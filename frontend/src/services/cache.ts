import ledgerApi from "../api/ledger";
import {ClassificationId, ClassificationItem, LedgerId, LedgerItem, SubClassificationItem} from "../api/interface";
import classificationApi from "../api/classification";
import subClassificationApi from "../api/sub_classification";

/**
 * 账本服务
 */
class CacheService {
  // 缓存结构
  private ledgers: LedgerItem [] = []
  private classificationMap: Map<LedgerId, ClassificationItem[]> = new Map()
  private subClassificationMap: Map<ClassificationId, SubClassificationItem[]> = new Map();

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

}

export const cacheService = new CacheService();
