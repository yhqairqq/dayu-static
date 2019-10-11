import {
  queryRoles,
  addRole,
  editRole,
  delRole,
  queryAllRoles,
  saveRoleRes,
  getRoleRes,
} from '@/services/role';

export default {
  namespace: 'role',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    allRoles: [],
  },

  effects: {
    *fetchAll({ payload, callback }, { call, put }) {
      const response = yield call(queryAllRoles, payload);
      const { state, data = [] } = response;
      yield put({
        type: 'saveAll',
        payload: data,
      });
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
    // 保存角色资源权限
    *saveRoleRes({ payload, callback }, { call }) {
      const resp = yield call(saveRoleRes, payload);
      if (resp && resp.state === 0 && callback) {
        callback();
      }
    },
    // 拉取指定角色资源权限
    *fetchRoleRes({ payload, callback }, { call }) {
      const resp = yield call(getRoleRes, payload);
      const { state, data } = resp;
      if (resp && state === 0 && callback) {
        callback(data);
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
        data: action.payload,
      };
    },
    saveAll(state, action) {
      return {
        ...state,
        allRoles: action.payload,
      };
    },
  },
};
