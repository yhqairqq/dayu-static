import {
  queryChannel,
  addChannel,
  updateChannel,
  removeChannel,
  doStatus,
} from '@/services/channel';
export default {
  namespace: 'channel',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const resp = yield call(queryChannel, payload);
      const { state, data = [] } = resp;
      yield put({
        type: 'save',
        payload: data,
      });
      if (resp && state === 0 && callback) {
        callback();
      }
    },
    *add({ payload, callback }, { call }) {
      const resp = yield call(addChannel, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *update({ payload, callback }, { call }) {
      const resp = yield call(updateChannel, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const resp = yield call(removeChannel, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *doStatus({ payload, callback }, { call }) {
      const resp = yield call(doStatus, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
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
