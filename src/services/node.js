import request from '@/utils/request';
import { async } from 'q';
const PRE_URL = '/node';

export async function queryNode(params) {
  return request(`${PRE_URL}/getByPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 根据id更新
 * @param {*} params
 */
export async function updateNode(params) {
  return request(`${PRE_URL}/update`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function removeNode(params) {
  return request(`${PRE_URL}/remove`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
/**
 * 添加数据源
 * @param {*} params
 */
export async function addNode(params) {
  return request(`${PRE_URL}/add`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
