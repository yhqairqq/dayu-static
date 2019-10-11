import sync from '@/services/full';
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
