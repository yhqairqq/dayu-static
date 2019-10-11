import { queryPipeline, updatePipeline, addPipeline, removePipeline } from '@/services/pipeline';
export default {
  namespace: 'pipeline',
  state: {
    data: [],
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const resp = yield call(queryPipeline, payload);
      const { state, data } = resp;
      yield put({
        type: 'save',
        payload: data,
      });
      if (resp && state == 0 && callback) {
        callback(data);
      }
    },
    *update({ payload, callback }, { call }) {
      const resp = yield call(updatePipeline, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *add({ payload, callback }, { call }) {
      const resp = yield call(addPipeline, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const resp = yield call(removePipeline, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        pipelines: action.payload,
      };
    },
  },
};
