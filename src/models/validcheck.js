import { binlogList } from '@/services/validcheck';
export default {
  namespace: 'valid',
  state: {
    data: {},
  },
  effects: {
    *binlogList({ payload, callback }, { call, put }) {
      const resp = yield call(binlogList, payload);
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
