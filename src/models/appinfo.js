import { queryAppInfo, delAppInfo, editAppInfo, addAppInfo } from '@/services/appinfo';

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
    // 删除埋点
    *remove({ payload, callback }, { call }) {
      const response = yield call(delAppInfo, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    // 更新埋点信息
    *update({ payload, callback }, { call }) {
      const response = yield call(editAppInfo, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    // 增加埋点信息
    *add({ payload, callback }, { call }) {
      const response = yield call(addAppInfo, payload);
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
  },
};
