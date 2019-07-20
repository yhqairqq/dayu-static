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
 * 查询数据类型
 */
export async function queryDataTypes() {
  return request(`${PRE_URL}/dataTypes`, {
    method: 'POST',
    data: {},
  });
}

/**
 * 查询参数类型
 */
export async function queryFieldTypes() {
  return request(`${PRE_URL}/fieldTypes`, {
    method: 'POST',
    data: {},
  });
}

/**
 * 查询报表树
 * @param {*} params
 */
export async function reportTree(params) {
  return request(`${PRE_URL}/reportTree`, {
    method: 'POST',
    data: {
      ...params,
    },
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

/**
 * 保存查询参数
 * @param {*} params
 */
export async function saveQueryField(params) {
  return request(`${PRE_URL}/saveQueryFields`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 根据报表Id获取查询参数
 * @param {*} params
 */
export async function getQueryFieldsByReportId(params) {
  return request(`${PRE_URL}/getQueryFieldsByReportId`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 保存报表字段信息
 * @param {*} params
 */
export async function saveReportColumns(params) {
  return request(`${PRE_URL}/saveReportColumns`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 根据报表Id获取报表字段
 * @param {*} params
 */
export async function getReportColumnsByReportId(params) {
  return request(`${PRE_URL}/getReportColumnsByReportId`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
