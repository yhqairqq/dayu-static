import { remove } from '@/services/position';
export default {
  namespace: 'position',
  state: {
    data: {},
  },
  effects: {
    *remove({ payload, callback }, { call }) {
      const resp = yield call(queryNode, payload);
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
        data: action.payload,
      };
    },
  },
};
