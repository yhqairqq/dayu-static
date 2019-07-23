import { addInfo, editInfo, delInfo, getAllTypes, query } from '@/services/commonInfo';

export default {
  namespace: 'commonInfo',
  state: {
    allTypes: [], // 所有支持的类型
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetchAllTypes({ payload, callback }, { call, put }) {
      const response = yield call(getAllTypes, payload);
      const { data } = response;
      yield put({
        type: 'saveTypes',
        payload: data,
      });
      if (callback) {
        callback(data);
      }
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      const { data } = response;
      yield put({
        type: 'save',
        payload: data,
      });
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addInfo, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(delInfo, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(editInfo, payload);
      if (response && response.state === 0) {
        if (callback) callback();
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
    saveTypes(state, action) {
      return {
        ...state,
        allTypes: action.payload,
      };
    },
  },
};
