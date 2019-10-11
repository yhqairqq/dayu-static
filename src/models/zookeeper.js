import {
  getZookeepers,
  getZookeeper,
  reduction,
  removeZookeeper,
  addZookeeper,
  updateZookeeper,
  refresh,
} from '@/services/zookeeper';
export default {
  namespace: 'zookeeper',
  state: {
    data: [],
  },
  effects: {
    *getZookeepers({ payload, callback }, { call, put }) {
      const resp = yield call(getZookeepers, payload);
      const { state, data = [] } = resp;
      yield put({
        type: 'save',
        payload: data,
      });
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *getZookeeper({ payload, callback }, { call, put }) {
      const resp = yield call(getZookeeper, payload);
      const { state, data } = resp;
      yield put({
        type: 'saveZookeeper',
        payload: data,
      });
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *reduction({ payload, callback }, { call, put }) {
      const resp = yield call(reduction, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback(data);
      }
    },
    *remove({ payload, callback }, { call }) {
      const resp = yield call(removeZookeeper, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *update({ payload, callback }, { call }) {
      const resp = yield call(updateZookeeper, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *add({ payload, callback }, { call }) {
      const resp = yield call(addZookeeper, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *refresh({ payload, callback }, { call }) {
      const resp = yield call(refresh, payload);
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
        zookeepers: action.payload,
      };
    },
    saveZookeeper(state, action) {
      return {
        ...state,
        zookeeper: action.payload,
      };
    },
  },
};
