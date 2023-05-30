import axios from './instance/bff_instance'


const classificationApi = {
  classificationList,
  classificationCreate,
  classificationDelete,
}


export interface ClassificationListParams {
  ledger_id?: number; // 账本ID
}
/**
 * 查询分类列表
 * @returns 
 */
function classificationList(params: ClassificationListParams) {
  const { ledger_id } = params || {};

  return axios({
    method: 'POST',
    url: '/classification/list',
    data: {
      ledger_id: ledger_id
    },
  });
}


export interface ClassificationCreateParams {
  ledger_id?: number; // 账本ID
  name?: string; // 分类名称
}

/**
 * 创建分类
 * @param params 
 * @returns 
 */
function classificationCreate(params: ClassificationCreateParams) {
  const { name, ledger_id } = params || {};

  return axios({
    method: 'POST',
    url: '/classification/create',
    data: {
      name: name,
      ledger_id: ledger_id,
    },
  });
}



export interface ClassificationDeleteParams {
  ledger_id?: number; // 账本ID
  name?: string; // 分类名称
}

/**
 * 删除分类
 * @param params 
 * @returns 
 */
function classificationDelete(params: ClassificationDeleteParams) {
  const { name, ledger_id } = params || {};

  return axios({
    method: 'POST',
    url: '/classification/delete',
    data: {
      name: name,
      ledger_id: ledger_id,
    },
  });
}




export default classificationApi