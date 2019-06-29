import request from '@/utils/request';

const PRE_URL = "/peekdata/peek";

/**
 * 添加取数
 * @param {*} params 
 */
export async function addPeek(params) {
  return request(`${PRE_URL}/add`, {
    method: 'POST',
    data: {
      ...params
    },
  });
}

/**
 * 删除取数
 * @param {Long} id 模型Id
 */
export async function delPeek(id) {
  return request(`${PRE_URL}/del`, {
    method: 'POST',
    data: {
      peekId: id
    }
  })
}

/**
 * 修改取数信息
 * @param {*} params 
 */
export async function editPeek(params) {
  return request(`${PRE_URL}/edit`, {
    method: 'POST',
    data: {
      ...params
    },
  });
}

/**
 * 分页查询取数信息
 * @param {*} params 
 */
export async function queryPeek(params) {
  return request(`${PRE_URL}/getByPage`, {
    method: 'POST',
    data: {
     ...params
    }
  })
}

/**
 * 推送数据给
 * @param {*} peekId 
 */
export async function sendData2Me(peekId) {
  return request(`${PRE_URL}/sendData2Me`, {
    method: 'POST',
    data: {
      peekId
    }
  })
}

/**
 * 计算数据条数
 * @param {*} params 
 */
export async function countSize(params) {
  return request(`${PRE_URL}/countSize`, {
    method: 'POST',
    data: {
      ...params
    }
  })
}

/**
 * 预览数据
 * @param {*} params 
 */
export async function previewData(params) {
  return request(`${PRE_URL}/previewData`, {
    method: 'POST',
    data: {
      ...params
    }
  })
}

/**
 * 根据取数Id获取规则
 * @param {*} peekId 
 */
export async function getRuleByPeekId(peekId) {
  return request(`${PRE_URL}/getRuleByPeekId`, {
    method: 'POST',
    data: {
      peekId
    }
  })
}

/**
 * 获取所有数据类型的对就有效规则
 */
export async function getDataTypeRules() {
  return request(`${PRE_URL}/getDataTypeRules`, {
    method: 'POST',
    data: {
    }
  })
}