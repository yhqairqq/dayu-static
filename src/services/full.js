import request from '@/utils/request';

const PRE_URL = '/full';

/**
 *
 * @param {*} params
 */
export  async function sync(params) {
  return request(`${PRE_URL}/sync`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export  async function pairSync(params) {
  return request(`${PRE_URL}/pairSync`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export  async function syncCallback(params) {
  return request(`${PRE_URL}/syncCallback`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

