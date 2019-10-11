import request from '@/utils/request';
const PRE_URL = '/full';

/**
 *
 * @param {*} params
 */
export async function sync(params) {
  return request(`${PRE_URL}/sync`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
