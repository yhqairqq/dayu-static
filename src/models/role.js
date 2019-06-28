import {
  queryRoles,
  addRole,
  editRole,
  delRole,
  queryAllRoles
} from '@/services/role';

export default {
  namespace: 'role',
  state: {
    data: {
      list: [],
      pagination: {}
    },
    allRoles: []
  },

  effects: {
    *fetchAll({ payload, callback }, { call, put }) {
      const response = yield call(queryAllRoles, payload);
      const { state, data = [] } = response;
      yield put({
        type: 'saveAll',
        payload: data
      })
      if (response && state === 0) {
        if (callback) callback(data);
      }
    },
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryRoles, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addRole, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(delRole, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(editRole, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      }
    },
    saveAll(state, action) {
      return {
        ...state,
        allRoles: action.payload
      }
    }
  }
}