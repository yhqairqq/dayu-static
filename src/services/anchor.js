import request from '@/utils/request';

const PRE_URL = '/anchor/anchor';

/**
 * 根据条件查询埋点列表
 * @param {*} params
 */
export async function queryAnchor(params) {
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
export async function addAnchor(params) {
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
export async function delAnchor(id) {
  return request(`${PRE_URL}/del`, {
    method: 'POST',
    data: {
      id,
    },
  });
}

/**
 * 上下线埋点
 * @param {Long} id 埋点Id
 */
export async function onlineOrOfflineAnchor(param) {
  return request(`${PRE_URL}/changeStatus`, {
    method: 'POST',
    data: {
      ...param,
    },
  });
}

/**
 * 修改埋点应用信息
 * @param {*} params
 */
export async function editAnchor(params) {
  return request(`${PRE_URL}/edit`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 获取所有埋点类型
 */
export async function queryAllAnchorTypes() {
  return request(`${PRE_URL}/getAllAnchorTypes`, {
    method: 'POST',
    data: {},
  });
}

/**
 * 获取所有事件类型
 */
export async function queryAllEventTypes() {
  return request(`${PRE_URL}/getAllEventTypes`, {
    method: 'POST',
    data: {},
  });
}

/**
 * 获取整个报表树型结构
 */
export async function getTree() {
  return request(`${PRE_URL}/treeNodes`, {
    method: 'POST',
    data: {},
  });
}
