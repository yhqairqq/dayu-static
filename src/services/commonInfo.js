import request from '@/utils/request';

const PRE_URL = '/common/info';

/**
 * 添加
 * @param {*} params
 */
export async function addInfo(params) {
  return request(`${PRE_URL}/add`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 获取所有支持的类型
 */
export async function getAllTypes() {
  return request(`${PRE_URL}/getTypes`, {
    method: 'POST',
  });
}

/**
 * 修改信息
 * @param {*} params
 */
export async function editInfo(params) {
  return request(`${PRE_URL}/edit`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 删除
 * @param {Long} id Id
 */
export async function delInfo(id) {
  return request(`${PRE_URL}/del`, {
    method: 'POST',
    data: {
      dsId: id,
    },
  });
}

/**
 * 根据条件查询信息
 * @param {*} params
 */
export async function query(params) {
  return request(`${PRE_URL}/getByPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
