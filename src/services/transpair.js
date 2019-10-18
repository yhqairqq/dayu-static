import request from '@/utils/request';

const PRE_URL = '/transpair';

/**
 *
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

export async function update(params) {
  return request(`${PRE_URL}/update`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function add(params) {
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
