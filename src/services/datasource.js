import request from '@/utils/request';

const PRE_URL = '/common/datasource';

/**
 * 添加数据源
 * @param {*} params
 */
export async function addDatasource(params) {
  return request(`${PRE_URL}/add`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 获取所有支持的数据源类型
 */
export async function getAllDsTypes() {
  return request(`${PRE_URL}/getAllDsTypes`, {
    method: 'POST',
  });
}

/**
 * 修改数据源信息
 * @param {*} params
 */
export async function editDatasource(params) {
  return request(`${PRE_URL}/edit`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 停、启用数据源操作
 * @param {*} params
 */
export async function changeStatus(params) {
  return request(`${PRE_URL}/changeStatus`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 删除数据源
 * @param {Long} id 数据源Id
 */
export async function delDatasource(id) {
  return request(`${PRE_URL}/del`, {
    method: 'POST',
    data: {
      dsId: id,
    },
  });
}

/**
 * 根据条件查询数据源信息
 * @param {*} params
 */
export async function queryDatasource(params) {
  return request(`${PRE_URL}/getByPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 查询所有数据源简单信息
 * @param {*} params
 */
export async function queryAllSimpleDatasource(params) {
  return request(`${PRE_URL}/getAllSimple`, {
    method: 'POST',
    data: {
      params,
    },
  });
}

/**
 * 根据数据源Id获取下面的所有表信息
 * @param {*} dsId  数据源Id
 */
export async function getTables(dsId) {
  return request(`${PRE_URL}/getTables`, {
    method: 'POST',
    data: {
      dsId,
    },
  });
}

/**
 * 根据数据源Id获取下面的所有表以及字段信息
 * @param {*} dsId  数据源Id
 */
export async function getTablesAndColumns(dsId) {
  return request(`${PRE_URL}/getTablesAndColumns`, {
    method: 'POST',
    data: {
      dsId: dsId.dsId,
    },
  });
}

/**
 * 获取支持的数据类型列表
 */
export async function getDataTypes() {
  return request(`${PRE_URL}/getDataTypes`, {
    method: 'POST',
    data: {},
  });
}
