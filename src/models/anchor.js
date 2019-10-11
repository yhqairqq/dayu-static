import {
  queryAnchor,
  delAnchor,
  editAnchor,
  addAnchor,
  queryAllAnchorTypes,
  queryAllEventTypes,
  getTree,
  onlineOrOfflineAnchor,
} from '@/services/anchor';

export default {
  namespace: 'anchor',

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
      const resp = yield call(queryAnchor, payload);
      yield put({
        type: 'savePage',
        payload: resp.data,
      });
    },
    // 删除埋点应用
    *remove({ payload, callback }, { call }) {
      const response = yield call(delAnchor, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    // 上下线埋点
    *onlineOrOffline({ payload, callback }, { call }) {
      const response = yield call(onlineOrOfflineAnchor, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    // 更新埋点应用信息
    *update({ payload, callback }, { call }) {
      const response = yield call(editAnchor, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    // 增加埋点信息
    *add({ payload, callback }, { call }) {
      const response = yield call(addAnchor, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *fetchAllAnchorTypes({ payload, callback }, { call, put }) {
      const response = yield call(queryAllAnchorTypes, payload);
      const { state, data = [] } = response;
      yield put({
        type: 'saveAllAnchorTypes',
        payload: data,
      });
      if (response && state === 0) {
        if (callback) callback(data);
      }
    },
    *fetchAllEventTypes({ payload, callback }, { call, put }) {
      const response = yield call(queryAllEventTypes, payload);
      const { state, data = [] } = response;
      yield put({
        type: 'saveAllEventTypes',
        payload: data,
      });
      if (response && state === 0) {
        if (callback) callback(data);
      }
    },
    *getAnchorTree({ payload, callback }, { call, put }) {
      const resp = yield call(getTree, payload);
      const { state, data = [] } = resp;
      yield put({
        type: 'saveTree',
        payload: data,
      });
      if (resp && state === 0 && callback) {
        callback();
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
