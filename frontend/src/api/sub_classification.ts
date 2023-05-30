import axios from './instance/bff_instance'


const subClassificationApi = {
  subClassificationList,
  subClassificationCreate,
  subClassificationDelete,
}

export interface SubClassificationListParams {
  classification_id?: number; // 账本ID
}

/**
 * 查询子类别列表
 * @returns 
 */
function subClassificationList(params: SubClassificationListParams) {
  const { classification_id } = params || {};

  return axios({
    method: 'POST',
    url: '/sub_classification/list',
    data: {
      classification_id: classification_id,
    },
  });
}


export interface SubClassificationCreateParams {
  classification_id?: number; // 账本ID
  name?: string; // 分类名称
}

/**
 * 创建分类
 * @param params 
 * @returns 
 */
function subClassificationCreate(params: SubClassificationCreateParams) {
  const { name, classification_id } = params || {};

  return axios({
    method: 'POST',
    url: '/sub_classification/create',
    data: {
      name: name,
      classification_id: classification_id,
    },
  });
}



export interface SubClassificationDeleteParams {
  classification_id?: number; // 账本ID
  name?: string; // 分类名称
}

/**
 * 删除分类
 * @param params 
 * @returns 
 */
function subClassificationDelete(params: SubClassificationDeleteParams) {
  const { name, classification_id } = params || {};

  return axios({
    method: 'POST',
    url: '/sub_classification/delete',
    data: {
      name: name,
      classification_id: classification_id,
    },
  });
}

export default subClassificationApi