import request from '@/utils/request';

const PRE_URL = '/sys/user';

export async function query() {
  return request(`${PRE_URL}/users`);
}
/**
 * 查询当前用户信息
 */
export async function queryCurrent() {
  return request(`${PRE_URL}/getCurrent`, {
    method: 'POST',
  });
}
/**
 * 根据条件查询用户列表
 * @param {*} params
 */
export async function queryUsers(params) {
  return request(`${PRE_URL}/getByPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 获取当前用户拥有的菜单列表
 */
export async function queryUserMenu() {
  return request(`${PRE_URL}/menuTree`, {
    method: 'POST',
  });
}

/**
 * 用户注册接口
 * @param {*} params
 */
export async function regUser(params) {
  return request(`${PRE_URL}/reg`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 添加用户
 * @param {*} params
 */
export async function addUser(params) {
  return request(`${PRE_URL}/add`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 修改密码
 * @param {*} params
 */
export async function changePwd(params) {
  return request(`${PRE_URL}/changePwd`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 删除用户
 * @param {Long} id 用户Id
 */
export async function delUser(id) {
  return request(`${PRE_URL}/del`, {
    method: 'POST',
    data: {
      userId: id,
    },
  });
}

/**
 * 重置用户密码
 * @param {Long} id 用户Id
 */
export async function resetPwd(id) {
  return request(`${PRE_URL}/resetPwd`, {
    method: 'POST',
    data: {
      userId: id,
    },
  });
}

/**
 * 修改用户信息
 * @param {*} params
 */
export async function editUser(params) {
  return request(`${PRE_URL}/edit`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 登录
 * @param {*} params
 */
export async function accountLogin(params) {
  return request(`${PRE_URL}/login`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取用户的数据维度
 * @param {*} params
 */
export async function getDataDimension(params) {
  return request(`${PRE_URL}/getDataDimension`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 保存用户的数据维度
 * @param {*} params
 */
export async function saveDataDimension(params) {
  return request(`${PRE_URL}/saveDataDimension`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 获取ERP系统用户信息列表
 */
export async function getErpUserInfo(params) {
  return request(`${PRE_URL}/getErpUserInfo`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
