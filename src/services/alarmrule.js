import request from '@/utils/request';

const PRE_URL = '/alarmRule';

export async function queryAlarm(params) {
  return request(`${PRE_URL}/getByPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 根据pipelineId 查询所有告警规则
 * @param {} params
 */
export async function findByPipelineId(params) {
  return request(`${PRE_URL}/findByPipelineId`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addAlarmRules(params) {
  return request(`${PRE_URL}/addAlarmRules`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function doSwitchStatus(params) {
  return request(`${PRE_URL}/doSwitchStatus`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
