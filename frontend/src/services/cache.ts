import ledgerApi from "../api/ledger";
import { ClassificationId, ClassificationItem, LedgerId, LedgerItem, RecordItem, SubClassificationItem } from "../api/interface";
import classificationApi from "../api/classification";
import subClassificationApi from "../api/sub_classification";
import recordApi from "../api/record";

/**
 * 账本服务
 */
class CacheService {
  // 缓存结构
  private ledgers: LedgerItem[] = []
  private classificationMap: Map<LedgerId, ClassificationItem[]> = new Map()
  private subClassificationMap: Map<ClassificationId, SubClassificationItem[]> = new Map();
  private records: RecordItem[] = []
  private needToUpdateRecord: boolean = false

  // 获取账本列表
  public async getLedgerList(): Promise<LedgerItem[]> {
    // 已有缓存，直接返回
    if (this.ledgers.length) {
      return this.ledgers;
    }
    // 更新缓存
    this.ledgers = await ledgerApi.listLedger();
    return this.ledgers;
  }

  // 获取分类列表
  public async getClassificationList(ledgerId: LedgerId): Promise<ClassificationItem[]> {
    // 已有缓存，直接返回
    const classifications = this.classificationMap.get(ledgerId)
    if (classifications && classifications.length) {
      return classifications
    }
    // 更新缓存
    const classificationList = await classificationApi.listClassification(ledgerId);
    this.classificationMap.set(ledgerId, classificationList)
    return classificationList;
  }

  // 获取子分类列表
  public async getSubClassificationList(classificationId: ClassificationId): Promise<SubClassificationItem[]> {
    // 已有缓存，直接返回
    const sub_classifications = this.subClassificationMap.get(classificationId)
    if (sub_classifications && sub_classifications.length) {
      return sub_classifications
    }
    // 更新缓存
    const subClassificationList = await subClassificationApi.listSubClassification(classificationId);
    this.subClassificationMap.set(classificationId, subClassificationList)
    return subClassificationList;
  }

  // 获取账本列表
  public async getRecordList(begin_time: string, end_time: string): Promise<RecordItem[]> {
    // 已有缓存，直接返回
    if (this.records.length && !this.needToUpdateRecord) {
      return this.filterRecords(begin_time, end_time);
    }
    // 更新缓存
    this.records = (await recordApi.listAllRecords())
    this.records.sort((a, b) => {
      let atime = new Date(a.consumption_time)
      let btime = new Date(b.consumption_time)
      if (atime === btime) {
        return 0
      } else if (atime > btime) {
        return -1
      } else {
        return 1
      }
    });
    this.needToUpdateRecord = false
    return this.filterRecords(begin_time, end_time);
  }

  // 根据时间对已经缓存好的数据进行过滤
  private filterRecords(begin_time: string, end_time: string): RecordItem[] {
    let btime = new Date(begin_time)
    let etime = new Date(end_time)
    return this.records.filter((item) => {
      let ctime = new Date(item.consumption_time)
      return btime <= ctime && ctime <= etime
    })
  }

  // 设置需要更新标识
  public NeedToUpdateRecord() {
    this.needToUpdateRecord = true
  }


  public async GetLedgerName(ledger_id: LedgerId) {
    const ledgers = await this.getLedgerList()
    return ledgers.find((ledger: LedgerItem) => {
      return ledger.id === ledger_id
    })?.name
  }

  public async getClassificationName(ledger_id: LedgerId, classification_id: ClassificationId) {
    const classifications = await this.getClassificationList(ledger_id)
    return classifications.find((classification: ClassificationItem) => {
      return classification.id === classification_id
    })?.name
  }

}

export const cacheService = new CacheService();
