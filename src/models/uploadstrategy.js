import {
  queryUploadStrategy,
  delUploadStrategy,
  editUploadStrategy,
  addUploadStrategy,
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
    // 删除埋点应用
    *remove({ payload, callback }, { call }) {
      const response = yield call(delUploadStrategy, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    // 更新埋点应用信息
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
    saveAllAnchorTypes(state, action) {
      return {
        ...state,
        allAnchorTypes: action.payload,
      };
    },
    saveAllEventTypes(state, action) {
      return {
        ...state,
        allEventTypes: action.payload,
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
