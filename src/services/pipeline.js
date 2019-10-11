import request from '@/utils/request';
const PRE_URL = '/pipeline';

/**
 *
 * @param {*} params
 */
export async function queryPipeline(params) {
  return request(`${PRE_URL}/getPipelines`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
/**
 *
 * @param {*} params
 */
export async function updatePipeline(params) {
  return request(`${PRE_URL}/update`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
/**
 *
 * @param {*} params
 */
export async function addPipeline(params) {
  return request(`${PRE_URL}/add`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
/**
 *
 * @param {*} params
 */
export async function removePipeline(params) {
  return request(`${PRE_URL}/remove`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
