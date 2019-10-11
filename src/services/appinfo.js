import request from '@/utils/request';

const PRE_URL = '/anchor/appinfo';

/**
 * 根据条件查询埋点应用列表
 * @param {*} params
 */
export async function queryAppInfo(params) {
  return request(`${PRE_URL}/getByPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 添加埋点
 * @param {*} params
 */
export async function addAppInfo(params) {
  return request(`${PRE_URL}/add`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 删除埋点
 * @param {Long} id 埋点Id
 */
export async function delAppInfo(id) {
  return request(`${PRE_URL}/del`, {
    method: 'POST',
    data: {
      modelId: id,
    },
  });
}

/**
 * 修改埋点应用信息
 * @param {*} params
 */
export async function editAppInfo(params) {
  return request(`${PRE_URL}/edit`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 获取所有埋点应用列表
 */
export async function queryAllAppInfos() {
  return request(`${PRE_URL}/getAllAppInfos`, {
    method: 'POST',
    data: {},
  });
}
