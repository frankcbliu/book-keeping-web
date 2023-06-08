import axios from './instance/bff_instance'
import { ClassificationId, SubClassificationItem } from "./interface";

const subClassificationApi = {
  listSubClassification,
  createSubClassification,
  deleteSubClassification,
}

/**
 * 查询分类列表
 */
export async function listSubClassification(classification_id: ClassificationId): Promise<SubClassificationItem[]> {
  try {
    const response = await axios.post<{ sub_classifications: SubClassificationItem[] }>('/sub_classification/list', {
      classification_id: classification_id, // 分类ID
    });
    return response.data.sub_classifications;
  } catch (error) {
    console.error('listSubClassification error', error)
    return [];
  }
}


/**
 * 创建分类
 */
export async function createSubClassification(classification_id: ClassificationId, name: string): Promise<any> {
  try {
    const response = await axios.post<any>('/sub_classification/create', {
      classification_id: classification_id, // 分类ID
      name: name, // 子分类名称
    });
    return response.data;
  } catch (error) {
    console.error('createSubClassification error', error)
    return null;
  }
}


/**
 * 删除分类
 */
export async function deleteSubClassification(classification_id: ClassificationId, name: string): Promise<boolean> {
  try {
    await axios.post<any>('/sub_classification/delete', {
      classification_id: classification_id, // 分类ID
      name: name, // 子分类名称
    });
    return true;
  } catch (error) {
    console.error('deleteLedger error', error)
    return false;
  }
}

export default subClassificationApi