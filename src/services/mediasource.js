import request from '@/utils/request';
const PRE_URL = '/mediasource';

/**
 * 查询数据源
 * @param {} params
 */
export async function queryMediaSource(params) {
  return request(`${PRE_URL}/getByPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function queryAll(params) {
  return request(`${PRE_URL}/listAll`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 添加数据源
 * @param {*} params
 */
export async function addMediaSource(params) {
  return request(`${PRE_URL}/add`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 根据ID 查询数据源
 * @param {*} params
 */
export async function querybyId(params) {
  return request(`${PRE_URL}/getDetailById`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
/**
 * 根据id更新
 * @param {*} params
 */
export async function updateSource(params) {
  return request(`${PRE_URL}/update`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function deleteSource(params) {
  return request(`${PRE_URL}/delete`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
