import { queryNode, removeNode, updateNode, addNode } from '@/services/node';
export default {
  namespace: 'node',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const resp = yield call(queryNode, payload);
      const { state, data = [] } = resp;
      yield put({
        type: 'save',
        payload: data,
      });
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const resp = yield call(removeNode, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *update({ payload, callback }, { call }) {
      const resp = yield call(updateNode, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *add({ payload, callback }, { call }) {
      const resp = yield call(addNode, payload);
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
        data: action.payload,
      };
    },
  },
};
