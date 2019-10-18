import { query,update,remove,add } from '@/services/transpair';
export default {
  namespace: 'transpair',
  state: {
    data: [],
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const resp = yield call(query, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback(data);
      }
    },
    *update({ payload, callback }, { call }) {
      const resp = yield call(update, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *add({ payload, callback }, { call }) {
      const resp = yield call(add, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const resp = yield call(remove, payload);
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
        mediapairs: action.payload,
      };
    },
  },
};
