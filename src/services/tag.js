import request from '@/utils/request';

const PRE_URL = '/peekdata/tag';

/**
 * 添加标签
 * @param {*} params
 */
export async function add(params) {
  return request(PRE_URL + '/add', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 删除标签
 * @param {Long} id 模型Id
 */
export async function remove(id) {
  return request(PRE_URL + '/del', {
    method: 'POST',
    data: {
      id: id,
    },
  });
}

/**
 * 修改标签信息
 * @param {*} params
 */
export async function edit(params) {
  return request(PRE_URL + '/edit', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 分页查询取数信息
 * @param {*} params
 */
export async function query(params) {
  return request(PRE_URL + '/getByPage', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function queryAll() {
  return request(PRE_URL + '/listAll', {
    method: 'GET',
  });
}
