import { addGroup, editGroup, delGroup, queryGroup, getTree } from '@/services/group';

export default {
  namespace: 'group',
  state: {
    data: [],
    trees: [],
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const resp = yield call(queryGroup, payload);
      const { state, data = [] } = resp;
      yield put({
        type: 'save',
        payload: data,
      });
      if (resp && state === 0 && callback) {
        callback();
      }
    },
    *add({ payload, callback }, { call }) {
      const resp = yield call(addGroup, payload);
      const { state } = resp;
      if (resp && state === 0 && callback) {
        callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const resp = yield call(delGroup, payload);
      const { state } = resp;
      if (resp && state === 0 && callback) {
        callback();
      }
    },
    *update({ payload, callback }, { call }) {
      const resp = yield call(editGroup, payload);
      const { state } = resp;
      if (resp && state === 0) {
        if (callback) callback();
      }
    },
    *getGroupTree({ payload, callback }, { call, put }) {
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
    save(state, action) {
      return {
        ...state,
        data: action.payload,
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
