import request from '@/utils/request';

const PRE_URL = '/zookeeper';
/**
 * 获取所有zookeeper配置
 */
export async function getZookeepers() {
  return request(`${PRE_URL}/getZookeepers`, {
    method: 'POST',
  });
}

export async function getZookeeper(params) {
  return request(`${PRE_URL}/getZookeeper`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function reduction(params) {
  return request(`${PRE_URL}/reduction`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
/**
 * 根据id更新
 * @param {*} params
 */
export async function updateZookeeper(params) {
  return request(`${PRE_URL}/update`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function removeZookeeper(params) {
  return request(`${PRE_URL}/remove`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
/**
 * 添加数据源
 * @param {*} params
 */
export async function addZookeeper(params) {
  return request(`${PRE_URL}/add`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function refresh(params) {
  return request(`${PRE_URL}/refresh`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
