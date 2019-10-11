import request from '@/utils/request';
const PRE_URL = '/media';

/**
 *
 * @param {*} params
 */
export async function queryMedia(params) {
  return request(`${PRE_URL}/getByPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateMediaPair(params) {
  return request(`${PRE_URL}/update`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addMediaPair(params) {
  console.log(params);
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
