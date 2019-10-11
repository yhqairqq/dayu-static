import request from '@/utils/request';
const PRE_URL = '/canal';

/**
 *
 * @param {*} params
 */
export async function queryCanalAll(params) {
  return request(`${PRE_URL}/getAll`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function queryCanalByName(params) {
  return request(`${PRE_URL}/getByName`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function queryCanal(params) {
  return request(`${PRE_URL}/getByPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateCanal(params) {
  return request(`${PRE_URL}/update`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addCanal(params) {
  return request(`${PRE_URL}/add`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function remove(params) {
  return request(`${PRE_URL}/remove`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
