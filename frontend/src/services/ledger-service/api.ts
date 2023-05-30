import axios from '../../api/instance/bff_instance'
import { LedgerId, LedgerItem } from "./index.interface";

/**
 * 查询账本列表
 */
export async function getLedgerList(): Promise<LedgerItem[]> {
  try {
    const response = await axios.post<{ ledgers: LedgerItem[] }>('/ledger/list');
    return response.data.ledgers;
  } catch (error) {
    console.error('getLedgerList error', error)
    return [];
  }
}

/**
 * 创建账本
 */
export async function createLedger(name: string): Promise<LedgerId | null> {
  try {
    const response = await axios.post<LedgerId>('/ledger/create', {
      name
    });
    return response.data;
  } catch (error) {
    console.error('createLedger error', error)
    return null;
  }
}

/**
 * 删除账本
 */
export async function deleteLedger(id: LedgerId): Promise<boolean> {
  try {
    await axios.post<LedgerItem[]>('/ledger/delete', {
      id,
    });
    return true;
  } catch (error) {
    console.error('deleteLedger error', error)
    return false;
  }
}