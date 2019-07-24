import { getDetail, queryData } from '@/services/sqlRunLog';

export default {
  namespace: 'sqlRunLog',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const resp = yield call(queryData, payload);
      const { state, data = [] } = resp;
      yield put({
        type: 'save',
        payload: data,
      });
      if (resp && state === 0 && callback) {
        callback();
      }
    },
    *fetchById({ payload, callback }, { call }) {
      const resp = yield call(getDetail, payload);
      const { state, data } = resp;
      if (resp && state === 0 && callback) {
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
