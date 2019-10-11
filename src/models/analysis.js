import {
  queryAnalysis,
  fetchAnalysisThroughputHistory,
  fetchAnalysisDelayStat,
  fetchBehaviorHistoryCurve,
  fetchAllBehaviorHistory,
  fetchAllNodeInfo,
} from '@/services/analysis';
export default {
  namespace: 'analysis',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const resp = yield call(queryAnalysis, payload);
      const { state, data = [] } = resp;
      yield put({
        type: 'save',
        payload: data,
      });
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *fetchAnalysisThroughputHistory({ payload, callback }, { call }) {
      const resp = yield call(fetchAnalysisThroughputHistory, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback(data);
      }
    },
    *fetchAnalysisDelayStat({ payload, callback }, { call }) {
      const resp = yield call(fetchAnalysisDelayStat, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback(data);
      }
    },
    *fetchBehaviorHistoryCurve({ payload, callback }, { call }) {
      const resp = yield call(fetchBehaviorHistoryCurve, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback(data);
      }
    },
    *fetchAllBehaviorHistory({ payload, callback }, { call }) {
      const resp = yield call(fetchAllBehaviorHistory, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback(data);
      }
    },
    *fetchAllNodeInfo({ payload, callback }, { call }) {
      const resp = yield call(fetchAllNodeInfo, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback(data);
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
