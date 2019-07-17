import request from '@/utils/request';

const PRE_URL = '/anchor/uploadstrategy';

/**
 * 根据条件查询上传策略列表
 * @param {*} params
 */
export async function queryUploadStrategy(params) {
  return request(`${PRE_URL}/getByPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 添加上传策略
 * @param {*} params
 */
export async function addUploadStrategy(params) {
  return request(`${PRE_URL}/add`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 删除上传策略
 * @param {Long} id 上传策略Id
 */
export async function delUploadStrategy(id) {
  return request(`${PRE_URL}/del`, {
    method: 'POST',
    data: {
      id,
    },
  });
}

/**
 * 修改上传策略
 * @param {*} params
 */
export async function editUploadStrategy(params) {
  return request(`${PRE_URL}/edit`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
