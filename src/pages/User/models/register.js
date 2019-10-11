import { regUser } from '@/services/user';

export default {
  namespace: 'register',

  state: {
    status: {
      state: null,
      data: null,
    },
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(regUser, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        status: payload,
      };
    },
  },
};
