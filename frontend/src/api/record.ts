import axios from './instance/bff_instance'


const recordApi = {
  recordList,
  recordCreate,
  recordDelete,
}

export interface RecordListParams {
  start_time?: string; // 开始时间
  end_time?: string; // 截止时间
}
/**
 * 查询账单
 * @returns 
 */
function recordList(params: RecordListParams) {
  const { start_time, end_time } = params || {};

  return axios({
    method: 'POST',
    url: '/classification/list',
    data: {
      start_time: start_time,
      end_time: end_time,
    },
  });
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
 * @param params 
 * @returns 
 */
function recordDelete(params: RecordDeleteParams) {
  const { record_id } = params || {};

  return axios({
    method: 'POST',
    url: '/record/delete',
    data: {
      record_id: record_id
    },
  });
}

export default recordApi