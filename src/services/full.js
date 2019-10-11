import request from '@/utils/request';

const PRE_URL = '/full';

/**
 *
 * @param {*} params
 */
export default async function sync(params) {
  return request(`${PRE_URL}/sync`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
