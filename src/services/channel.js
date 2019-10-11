import request from '@/utils/request';

const PRE_URL = '/channel';

/**
 * 查询channel
 * @param {*} params
 */
export async function queryChannel(params) {
  return request(`${PRE_URL}/getByPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addChannel(params) {
  return request(`${PRE_URL}/add`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateChannel(params) {
  return request(`${PRE_URL}/update`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function removeChannel(params) {
  return request(`${PRE_URL}/remove`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
/**
 * 开启和关闭同步链路
 * @param {*} params
 */
export async function doStatus(params) {
  return request(`${PRE_URL}/doStatus`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
