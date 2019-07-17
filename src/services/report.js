import request from '@/utils/request';

const PRE_URL = '/report/design';

/**
 * 添加报表
 * @param {*} params
 */
export async function addReport(params) {
  return request(`${PRE_URL}/add`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 删除报表
 * @param {Long} id 报表Id
 */
export async function delReport(id) {
  return request(`${PRE_URL}/del`, {
    method: 'POST',
    data: {
      groupId: id,
    },
  });
}

/**
 * 修改信息
 * @param {*} params
 */
export async function editReport(params) {
  return request(`${PRE_URL}/edit`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 查询
 * @param {*} params
 */
export async function queryReport(params) {
  return request(`${PRE_URL}/getByPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 查询报表类型
 */
export async function queryReportTypes() {
  return request(`${PRE_URL}/types`, {
    method: 'POST',
    data: {},
  });
}

/**
 * 保存SQL信息
 * @param {*} params
 */
export async function saveSqlInfo(params) {
  return request(`${PRE_URL}/saveSql`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 获取sql详细信息
 * @param {*} sqlId
 */
export async function getSqlInfoById(sqlId) {
  return request(`${PRE_URL}/getSqlInfoById`, {
    method: 'POST',
    data: {
      sqlId,
    },
  });
}
