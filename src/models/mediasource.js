import {
  queryMediaSource,
  addMediaSource,
  querybyId,
  updateSource,
  deleteSource,
  queryAll,
} from '@/services/mediasource';
export default {
  namespace: 'mediasource',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const resp = yield call(queryMediaSource, payload);
      const { state, data = [] } = resp;
      yield put({
        type: 'save',
        payload: data,
      });
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *fetchAll({ payload, callback }, { call }) {
      const resp = yield call(queryAll, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback(data);
      }
    },
    *fetchone({ payload, callback }, { call, put }) {
      const resp = yield call(querybyId, payload);
      const { state, data } = resp;
      yield put({
        type: 'saveone',
        payload: data,
      });
      if (resp && state == 0 && callback) {
        callback(data);
      }
    },
    *add({ payload, callback }, { call }) {
      const resp = yield call(addMediaSource, payload);
      const { state } = resp;
      if (resp && state === 0 && callback) {
        callback();
      }
    },
    *update({ payload, callback }, { call }) {
      const resp = yield call(updateSource, payload);
      const { state } = resp;
      if (resp && state == 0) {
        if (callback) callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const resp = yield call(deleteSource, payload);
      const { state } = resp;
      if (resp && state == 0 && callback) {
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
    saveone(state, action) {
      return {
        ...state,
        source: action.payload,
      };
    },
  },
};
