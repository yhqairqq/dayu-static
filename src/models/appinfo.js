import {
  queryAppInfo,
  delAppInfo,
  editAppInfo,
  addAppInfo,
  queryAllAppInfos,
} from '@/services/appinfo';

export default {
  namespace: 'appinfo',

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
      const resp = yield call(queryAppInfo, payload);
      yield put({
        type: 'savePage',
        payload: resp.data,
      });
    },
    // 删除埋点应用
    *remove({ payload, callback }, { call }) {
      const response = yield call(delAppInfo, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    // 更新埋点应用信息
    *update({ payload, callback }, { call }) {
      const response = yield call(editAppInfo, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    // 增加埋点应用信息
    *add({ payload, callback }, { call }) {
      const response = yield call(addAppInfo, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    // 获取全部的埋点应用
    *fetchAll({ payload, callback }, { call, put }) {
      const response = yield call(queryAllAppInfos, payload);
      const { state, data = [] } = response;
      yield put({
        type: 'saveAll',
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
  },
};
