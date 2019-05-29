import request from '@/utils/request';

const PRE_URL = "/peekdata/model";

/**
 * 添加模型
 * @param {*} params 
 */
export async function addModel(params) {
  return request(PRE_URL + '/add', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

/**
 * 删除模型
 * @param {Long} id 模型Id
 */
export async function delModel(id) {
  return request(PRE_URL + '/del', {
    method: 'POST',
    data: {
      modelId: id,
      method: 'delete'
    }
  })
}

/**
 * 修改模型信息
 * @param {*} params 
 */
export async function editModel(params = {}) {
  return request(PRE_URL + `/edit?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function queryModel(params) {
  return request(PRE_URL + '/getByPage', {
    method: 'POST',
    data: {
      params: params
    }
  })
}