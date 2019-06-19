import { query as queryAll, 
  queryCurrent,
  queryUsers,
  addUser,
  delUser,
  editUser,
  resetPwd
 } from '@/services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    data: {
      list: [],
      pagination: {}
    },
  },

  effects: {
    *fetchByParams({ payload }, { call, put }) {
      const resp = yield call(queryUsers, payload);
      yield put({
        type: 'savePage',
        payload: resp.data
      })
    },
    // 添加用户
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addUser, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    // 删除用户
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(delUser, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    // 重置密码
    *resetPwd({payload, callback}, {call, put}) {
      const response = yield call(resetPwd, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    // 更新用户信息
    *update({ payload, callback }, { call, put }) {
      const response = yield call(editUser, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *fetch(_, { call, put }) {
      const response = yield call(queryAll);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
    },
  },

  reducers: {
    savePage(state, action) {
      return {
        ...state,
        data: action.payload
      }
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
