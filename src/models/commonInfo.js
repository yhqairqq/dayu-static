import {
  addInfo,
  editInfo,
  delInfo,
  getAllTypes,
  query,
  getByClassify,
} from '@/services/commonInfo';

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

    *fetchNoPagination({ payload, callback }, { call }) {
      const response = yield call(query, { params: payload, currentPage: 1, pageSize: 5000 });
      const { state, data } = response;
      if (state === 0 && callback) {
        const { list } = data;
        callback(list);
      }
    },

    *fetchByClassify({ payload, callback }, { call }) {
      const resp = yield call(getByClassify, payload);
      const { data, state } = resp;
      if (resp && state === 0) {
        if (callback) callback(data);
      }
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
