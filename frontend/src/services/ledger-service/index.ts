import ledgerApi from "../../api/ledger";
import { getLedgerList } from "./api";
import { ClassificationId, ClassificationItem, LedgerId, LedgerItem, SubClassificationItem } from "./index.interface";

/**
 * 账本服务
 */
class LedgerService {
  private ledgerMap: Map<LedgerId, LedgerItem & {
    classificationMap: Map<ClassificationId, ClassificationItem & {
      subClassificationList: SubClassificationItem[];
    }>
  }> = new Map()

  public async getLedgerList(): Promise<LedgerItem[]> {
    const ledgerValues = Array.from(this.ledgerMap.values());
    if (ledgerValues.length) {
      return ledgerValues;
    }

    const ledgerList = await getLedgerList();
    ledgerList.forEach((ledger) => {
      this.ledgerMap.set(ledger.id, {...ledger, classificationMap: new Map()})
    })
    return ledgerList;
  }

  public async getClassificationList(ledgerId: LedgerId): Promise<ClassificationItem[]> {
    const ledger = this.ledgerMap.get(ledgerId);
    if (!ledger) {
      console.error('getClassificationList ledger not existed')
      return [];
    }

    const classificationValues = Array.from(ledger.classificationMap.values());
    if (classificationValues.length) {
      return classificationValues;
    }

    // todo 调用接口
    return [];
  }
}

export const ledgerService = new LedgerService();
