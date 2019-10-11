import request from '@/utils/request';

const PRE_URL = '/report/log';

/**
 * 获取详情
 * @param {*} params
 */
export async function getDetail(params) {
  return request(`${PRE_URL}/detail`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 根据条件查询信息
 * @param {*} params
 */
export async function queryData(params) {
  return request(`${PRE_URL}/getByPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
