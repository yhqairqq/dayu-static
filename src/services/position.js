import request from '@/utils/request';
const PRE_URL = '/position';

export async function remove(params) {
  return request(`${PRE_URL}/remove`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
