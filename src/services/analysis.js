import request from '@/utils/request';
const PRE_URL = '/analysis';

export async function queryAnalysis(params) {
  return request(`${PRE_URL}/topstat/getByPage`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function fetchAnalysisThroughputHistory(params) {
  return request(`${PRE_URL}/fetchAnalysisThroughputHistory`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function fetchAnalysisDelayStat(params) {
  return request(`${PRE_URL}/fetchAnalysisDelayStat`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function fetchBehaviorHistoryCurve(params) {
  return request(`${PRE_URL}/fetchBehaviorHistoryCurve`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function fetchAllBehaviorHistory(params) {
  return request(`${PRE_URL}/fetchAllBehaviorHistory`, {
    method: 'POST',
  });
}

export async function fetchAllNodeInfo(params) {
  return request(`${PRE_URL}/fetchAllNodeInfo`, {
    method: 'POST',
  });
}
