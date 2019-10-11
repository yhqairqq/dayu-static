import { queryLogRecord, fetchByPipelineIdTop } from '@/services/logrecord';
export default {
  namespace: 'logrecord',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const resp = yield call(queryLogRecord, payload);
      const { state, data = [] } = resp;
      yield put({
        type: 'save',
        payload: data,
      });
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *fetchByPipelineIdTop({ payload, callback }, { call }) {
      const resp = yield call(fetchByPipelineIdTop, payload);
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
