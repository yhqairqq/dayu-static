import request from '@/utils/request';
import { async } from 'q';

const PRE_URL = "/peekdata/model";

/**
 * 添加模型
 * @param {*} params 
 */
export async function addModel(params) {
  return request(PRE_URL + '/add', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

/**
 * 删除模型
 * @param {Long} id 模型Id
 */
export async function delModel(id) {
  return request(PRE_URL + '/del', {
    method: 'POST',
    data: {
      modelId: id
    }
  })
}

/**
 * 修改模型信息
 * @param {*} params 
 */
export async function editModel(params) {
  return request(PRE_URL + '/edit', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

/**
 * 停、启用模型操作
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

export async function queryModel(params) {
  return request(PRE_URL + '/getByPage', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

/**
 * 获取所有模型列表
 */
export async function queryAllModel() {
  return request(PRE_URL + '/getAllModels', {
    method: 'POST',
    data: {
    }
  })
}


/**
 * 获取表字段列表 
 * @param {*} params 
 */
export async function getColumns(params) {
  return request(PRE_URL + '/getColumns', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

/**
 * 根据模型Id获取字段列表
 * @param {*} modelId Long
 */
export async function getModelMeta(modelId) {
  return request(PRE_URL + '/getColumnsByModelId', {
    method: 'POST',
    data: {
      modelId: modelId
    }
  })
}