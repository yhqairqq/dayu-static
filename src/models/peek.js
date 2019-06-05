import {
  queryPeek,
  addPeek,
  editPeek,
  delPeek,
  sendData2Me,
  countSize,
  previewData,
} from '@/services/peek'

export default {
  namespace: 'peek',

  state: {
    data: {
      list: [],
      pagination: {}
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPeek, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *sendData2Me({ payload, callback }, { call, put }) {
      const response = yield call(queryPeek, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    },
    *countSize({ payload, callback }, { call, put }) {
      const response = yield call(countSize, payload);
      yield put({
        type: 'saveCountSize',
        payload: response.data,
      });

      if (callback) callback();
    },
    *previewData({ payload, callback }, { call, put }) {
      const response = yield call(previewData, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addPeek, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(delPeek, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(editPeek, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  }

}