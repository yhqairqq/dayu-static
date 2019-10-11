import { querySchemas, queryTables, queryTopics } from '@/services/meta';
export default {
  namespace: 'meta',
  state: {
    data: [],
  },
  effects: {
    *fetchSchemas({ payload, callback }, { call }) {
      const resp = yield call(querySchemas, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback(data);
      }
    },
    *fetchTables({ payload, callback }, { call }) {
      const resp = yield call(queryTables, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback(data);
      }
    },
    *fetchTopics({ payload, callback }, { call }) {
      const resp = yield call(queryTopics, payload);
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
        pipelines: action.payload,
      };
    },
  },
};
