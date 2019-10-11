import request from '@/utils/request';

const PRE_URL = '/mediapair';

/**
 *
 * @param {*} params
 */
export async function queryMediapair(params) {
  return request(`${PRE_URL}/mediapairs`, {
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
