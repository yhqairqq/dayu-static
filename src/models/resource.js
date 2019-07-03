import {
  queryRes,
  addRes,
  editRes,
  delRes,
  allMask,
  queryAllParents,
  queryResTree,
} from '@/services/resource';

export default {
  namespace: 'resource',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    allParents: [],
    allMask: [], // 权限掩码列表
    resTree: [],
  },

  effects: {
    *fetchAllParent({ payload, callback }, { call, put }) {
      const response = yield call(queryAllParents, payload);
      const { state, data = [] } = response;
      yield put({
        type: 'saveAll',
        payload: data,
      });
      if (response && state === 0) {
        if (callback) callback(data);
      }
    },
    // 获取资源树
    *fetchResTree({ payload, callback }, { call, put }) {
      const resp = yield call(queryResTree, payload);
      const { state, data } = resp;
      yield put({
        type: 'saveResTree',
        payload: data,
      });
      if (resp && state === 0 && callback) {
        callback();
      }
    },
    // 权限掩码
    *allMask({ payload, callback }, { call, put }) {
      const resp = yield call(allMask, payload);
      yield put({
        type: 'saveAllMask',
        payload: resp.data,
      });
      if (resp && resp.state === 0) {
        if (callback) callback(resp.data);
      }
    },
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryRes, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addRes, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(delRes, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(editRes, payload);
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
        allParents: action.payload,
      };
    },
    saveResTree(state, action) {
      return {
        ...state,
        resTree: action.payload,
      };
    },
    saveAllMask(state, action) {
      return {
        ...state,
        allMask: action.payload,
      };
    },
  },
};
