import request from '@/utils/request';

const PRE_URL = '/report/group';

/**
 * 添加报表分组
 * @param {*} params
 */
export async function addGroup(params) {
  return request(`${PRE_URL}/add`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 删除报表组
 * @param {Long} id 报表组Id
 */
export async function delGroup(id) {
  return request(`${PRE_URL}/del`, {
    method: 'POST',
    data: {
      groupId: id,
    },
  });
}

/**
 * 修改分组信息
 * @param {*} params
 */
export async function editGroup(params) {
  return request(`${PRE_URL}/edit`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 查询分组
 * @param {*} params
 */
export async function queryGroup(params) {
  return request(`${PRE_URL}/getByPage`, {
    method: 'POST',
    data: {
      ...params,
    },
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
