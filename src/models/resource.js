import {
  queryRes,
  addRes,
  editRes,
  delRes,
  queryAllParents
} from '@/services/resource';

export default {
  namespace: 'resource',
  state: {
    data: {
      list: [],
      pagination: {}
    },
    allParents: []
  },

  effects: {
    *fetchAllParent({ payload, callback }, { call, put }) {
      const response = yield call(queryAllParents, payload);
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
        data: action.payload
      }
    },
    saveAll(state, action) {
      return {
        ...state,
        allParents: action.payload
      }
    }
  }
}