import request from '@/utils/request';

const PRE_URL = '/meta';

export async function querySchemas(params) {
  return request(`${PRE_URL}/schema/list`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function queryTables(params) {
  return request(`${PRE_URL}/table/list`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function queryTopics(params) {
  return request(`${PRE_URL}/topic/list`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
