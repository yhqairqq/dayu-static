import {
  queryUploadStrategy,
  delUploadStrategy,
  editUploadStrategy,
  addUploadStrategy,
  queryAllStrategyTypes,
} from '@/services/uploadstrategy';

export default {
  namespace: 'uploadstrategy',

  state: {
    list: [],
    currentUser: {},
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchByParams({ payload }, { call, put }) {
      const resp = yield call(queryUploadStrategy, payload);
      yield put({
        type: 'savePage',
        payload: resp.data,
      });
    },
    // 删除上传策略
    *remove({ payload, callback }, { call }) {
      const response = yield call(delUploadStrategy, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    // 更新上传策略信息
    *update({ payload, callback }, { call }) {
      const response = yield call(editUploadStrategy, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    // 增加上传策略信息
    *add({ payload, callback }, { call }) {
      const response = yield call(addUploadStrategy, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *fetchAllStrategyTypes({ payload, callback }, { call, put }) {
      const response = yield call(queryAllStrategyTypes, payload);
      const { state, data = [] } = response;
      yield put({
        type: 'saveAllStrategyTypes',
        payload: data,
      });
      if (response && state === 0) {
        if (callback) callback(data);
      }
    },
  },

  reducers: {
    savePage(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveAll(state, action) {
      return {
        ...state,
        allAppInfos: action.payload,
      };
    },
    saveAllStrategyTypes(state, action) {
      return {
        ...state,
        allStrategyTypes: action.payload,
      };
    },
    saveTree(state, action) {
      return {
        ...state,
        trees: action.payload,
      };
    },
  },
};
