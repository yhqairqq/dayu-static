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