import request from '@/utils/request';

const PRE_URL = '/sys/res';

/**
 * 获取所有父节点资源
 */
export async function queryAllParents() {
  return request(`${PRE_URL}/getAllParents`, {
    method: 'POST',
    data: {},
  });
}

/**
 * 获取资源树
 */
export async function queryResTree() {
  return request(`${PRE_URL}/resTree`, {
    method: 'POST',
  });
}
/**
 * 根据条件查询资源列表
 * @param {*} params
 */
export async function queryRes(params) {
  return request(`${PRE_URL}/getByPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 添加资源
 * @param {*} params
 */
export async function addRes(params) {
  return request(`${PRE_URL}/add`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 删除资源
 * @param {Long} id 资源Id
 */
export async function delRes(id) {
  return request(`${PRE_URL}/del`, {
    method: 'POST',
    data: {
      resId: id,
    },
  });
}

/**
 * 修改资源
 * @param {*} params
 */
export async function editRes(params) {
  return request(`${PRE_URL}/edit`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
