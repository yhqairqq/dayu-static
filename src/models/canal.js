import {
  queryCanal,
  updateCanal,
  addCanal,
  remove,
  queryCanalAll,
  queryCanalByName,
} from '@/services/canal';
export default {
  namespace: 'canal',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetchAll({ payload, callback }, { call, put }) {
      const resp = yield call(queryCanalAll, payload);
      const { state, data = [] } = resp;
      yield put({
        type: 'saveAll',
        payload: data,
      });
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *fetchByName({ payload, callback }, { call }) {
      const resp = yield call(queryCanalByName, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback(data);
      }
    },
    *fetch({ payload, callback }, { call, put }) {
      const resp = yield call(queryCanal, payload);
      const { state, data = [] } = resp;
      yield put({
        type: 'save',
        payload: data,
      });
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *update({ payload, callback }, { call }) {
      const resp = yield call(updateCanal, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *add({ payload, callback }, { call }) {
      const resp = yield call(addCanal, payload);
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
        data: action.payload,
      };
    },
    saveAll(state, action) {
      return {
        ...state,
        canals: action.payload,
      };
    },
  },
};
