import { queryMedia,addMedia,updateMedia,removeMedia } from '@/services/media';
export default {
  namespace: 'media',
  state: {
    data: [],
    pagination: {},
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const resp = yield call(queryMedia, payload);
      const { state, data = [] } = resp;
      yield put({
        type: 'save',
        payload: data,
      });
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *update({ payload, callback }, { call }) {
      const resp = yield call(updateMedia, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *add({ payload, callback }, { call }) {
      const resp = yield call(addMedia, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const resp = yield call(removeMedia, payload);
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
        medias: action.payload,
      };
    },
  },
};
