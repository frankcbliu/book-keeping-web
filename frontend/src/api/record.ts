import axios from './instance/bff_instance'
import { RecordId, RecordItem } from './interface';


const recordApi = {
  listRecord,
  listAllRecords,
  recordCreate,
  deleteRecord,
}

/**
 * 根据时间范围查询账单
 */
export async function listRecord(begin_time: string, end_time: string): Promise<RecordItem[]> {
  try {
    const response = await axios.post<{ records: RecordItem[] }>('/record/list', {
      begin_time: begin_time,
      end_time: end_time,
    });
    return response.data.records;
  } catch (error) {
    console.error('list records error', error)
    return [];
  }
}

/**
 * 查询所有账单
 */
export async function listAllRecords(): Promise<RecordItem[]> {
  try {
    const response = await axios.post<{ records: RecordItem[] }>('/record/list_all');
    return response.data.records;
  } catch (error) {
    console.error('list records error', error)
    return [];
  }
}

export interface RecordCreateParams {
  classification_id?: number, // 分类ID
  sub_classification_id?: number, // 子分类ID
  note?: string, // 备注
  type?: string, // 账单类型
  amount?: string, // 金额
  consumption_time?: string, // 账单时间
}
/**
 * 创建账单
 * @param params 
 * @returns 
 */
function recordCreate(params: RecordCreateParams) {
  const { classification_id, sub_classification_id, note, type, amount, consumption_time } = params || {};

  return axios({
    method: 'POST',
    url: '/record/create',
    data: {
      classification_id: classification_id, sub_classification_id: sub_classification_id,
      note: note, type: type, amount: amount, consumption_time: consumption_time
    },
  });
}

export interface RecordDeleteParams {
  record_id?: number; // 账单ID
}

/**
 * 删除账单
 */
export async function deleteRecord(record_id: RecordId): Promise<boolean> {
  try {
    await axios.post<any>('/record/delete', {
      record_id: record_id
    });
    return true;
  } catch (error) {
    console.error('list records error', error)
    return false;
  }
}

export default recordApi