import axios from './instance/bff_instance'
import { ClassificationId, ClassificationItem, LedgerId } from "./interface";


const classificationApi = {
  listClassification,
  createClassification,
  deleteClassification,
}


/**
 * 查询分类列表
 */
export async function listClassification(ledger_id: LedgerId): Promise<ClassificationItem[]> {
  try {
    const response = await axios.post<{ classifications: ClassificationItem[] }>('/classification/list', {
      ledger_id: ledger_id, // 账本ID
    });
    return response.data.classifications;
  } catch (error) {
    console.error('listClassificationList error', error)
    return [];
  }
}


/**
 * 创建分类
 */
export async function createClassification(ledger_id: LedgerId, name: string): Promise<ClassificationId | null> {
  try {
    const response = await axios.post<ClassificationId>('/classification/create', {
      ledger_id: ledger_id, // 账本ID
      name: name, // 分类名称
    });
    return response.data;
  } catch (error) {
    console.error('createClassification error', error)
    return null;
  }
}

/**
 * 删除分类
 */
export async function deleteClassification(ledger_id: LedgerId, name: string): Promise<boolean> {
  try {
    await axios.post<any>('/classification/delete', {
      ledger_id: ledger_id, // 账本ID
      name: name, // 分类名称
    });
    return true;
  } catch (error) {
    console.error('deleteLedger error', error)
    return false;
  }
}

export default classificationApi