import {sync,pairSync,syncCallback} from '@/services/full';
export default {
  namespace: 'full',
  state: {
    data: '',
  },
  effects: {
    *sync({ payload, callback }, { call, put }) {
      const resp = yield call(sync, payload);
      const { state, data } = resp;
      yield put({
        type: 'save',
        payload: data,
      });
      if (resp && state === 0 && callback) {
        callback();
      }
    },
    *pairSync({ payload, callback }, { call }) {
      const resp = yield call(pairSync, payload);
      const { state, data } = resp;
      if (resp && state === 0 && callback) {
        callback(data);
      }
    },
    *syncCallback({ payload, callback }, { call }) {
      const resp = yield call(syncCallback, payload);
      const { state, data } = resp;
      if (resp && state === 0 && callback) {
        callback(data);
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
  },
};
