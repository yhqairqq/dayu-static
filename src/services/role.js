import request from '@/utils/request';

const PRE_URL = '/sys/role';

/**
 * 获取所有角色列表
 */
export async function queryAllRoles() {
  return request(`${PRE_URL}/getAllRoles`, {
    method: 'POST',
    data: {},
  });
}

/**
 * 保存角色与资源关系
 * @param {*} params
 */
export async function saveRoleRes(params) {
  return request(`${PRE_URL}/saveRoleRes`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 获取指定角色资源权限
 * @param {*} roleId
 */
export async function getRoleRes(roleId) {
  return request(`${PRE_URL}/getRoleRes`, {
    method: 'POST',
    data: roleId,
  });
}

/**
 * 根据条件查询角色列表
 * @param {*} params
 */
export async function queryRoles(params) {
  return request(`${PRE_URL}/getByPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 添加角色
 * @param {*} params
 */
export async function addRole(params) {
  return request(`${PRE_URL}/add`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 删除角色
 * @param {Long} id 角色Id
 */
export async function delRole(id) {
  return request(`${PRE_URL}/del`, {
    method: 'POST',
    data: {
      roleId: id,
    },
  });
}

/**
 * 修改角色
 * @param {*} params
 */
export async function editRole(params) {
  return request(`${PRE_URL}/edit`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
