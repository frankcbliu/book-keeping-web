import axios from './instance/bff_instance'


const ledgerApi = {
  ledgerList,
  ledgerCreate,
  ledgerDelete,
}

/**
 * 查询账本列表
 * @returns 
 */
function ledgerList() {
  return axios({
    method: 'POST',
    url: '/ledger/list',
  });
}

export interface LedgerCreateParams {
  name?: string; // 账本名称
}

/**
 * 创建账本
 * @param params 
 * @returns 
 */
function ledgerCreate(params: LedgerCreateParams) {
  const { name } = params || {};

  return axios({
    method: 'POST',
    url: '/ledger/create',
    data: {
      name: name
    },
  });
}



export interface LedgerDeleteParams {
  name?: string; // 账本名称
}

/**
 * 删除账本
 * @param params 
 * @returns 
 */
function ledgerDelete(params: LedgerDeleteParams) {
  const { name } = params || {};

  return axios({
    method: 'POST',
    url: '/ledger/delete',
    data: {
      name: name
    },
  });
}

export default ledgerApi