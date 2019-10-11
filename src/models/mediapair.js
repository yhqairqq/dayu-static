import { queryMediapair, addMediaPair, remove, updateMediaPair } from '@/services/mediapair';
export default {
  namespace: 'mediapair',
  state: {
    data: [],
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const resp = yield call(queryMediapair, payload);
      const { state, data = [] } = resp;
      yield put({
        type: 'save',
        payload: data,
      });
      if (resp && state == 0 && callback) {
        callback(data);
      }
    },
    *update({ payload, callback }, { call }) {
      const resp = yield call(updateMediaPair, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *add({ payload, callback }, { call }) {
      const resp = yield call(addMediaPair, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const resp = yield call(remove, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        mediapairs: action.payload,
      };
    },
  },
};
