import request from '@/utils/request';
import { async } from 'q';

const PRE_URL = "/common/datasource";

/**
 * 添加数据源
 * @param {*} params 
 */
export async function addDatasource(params) {
  return request(PRE_URL + '/add', {
    method: 'POST',
    data: {
      ...params
    },
  });
}


/**
 * 修改数据源信息
 * @param {*} params 
 */
export async function editDatasource(params) {
  return request(PRE_URL + '/edit', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

/**
 * 停、启用数据源操作
 * @param {*} params 
 */
export async function changeStatus(params) {
  return request(PRE_URL + '/changeStatus', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

/**
 * 删除数据源
 * @param {Long} id 数据源Id
 */
export async function delDatasource(id) {
  return request(PRE_URL + '/del', {
    method: 'POST',
    data: {
      dsId: id
    }
  })
}

/**
 * 根据条件查询数据源信息
 * @param {*} params 
 */
export async function queryDatasource(params) {
  return request(PRE_URL + '/getByPage', {
    method: 'POST',
    data: {
      params: params
    }
  })
}

/**
 * 查询所有数据源简单信息
 * @param {*} params 
 */
export async function queryAllSimpleDatasource(params) {
  return request(PRE_URL + '/getAllSimple', {
    method: 'POST',
    data: {
      params: params
    }
  })
}

/**
 * 根据数据源Id获取下面的所有表信息
 * @param {*} dsId  数据源Id
 */
export async function getTables(dsId) {
  return request(PRE_URL + '/getTables', {
    method: 'POST',
    data: {
      dsId: dsId
    }
  })
}