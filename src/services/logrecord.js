import request from '@/utils/request';

const PRE_URL = '/logrecord';

export async function queryLogRecord(params) {
  return request(`${PRE_URL}/getByPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function fetchByPipelineIdTop(params) {
  return request(`${PRE_URL}/fetchByPipelineIdTop`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
