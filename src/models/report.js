import {
  addReport,
  editReport,
  delReport,
  queryReport,
  queryReportTypes,
  saveSqlInfo,
  getSqlInfoById,
} from '@/services/report';

export default {
  namespace: 'report',
  state: {
    types: [],
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const resp = yield call(queryReport, payload);
      const { state, data = [] } = resp;
      yield put({
        type: 'save',
        payload: data,
      });
      if (resp && state === 0 && callback) {
        callback();
      }
    },
    *fetchTypes({ payload, callback }, { call, put }) {
      const resp = yield call(queryReportTypes, payload);
      const { state, data } = resp;
      yield put({
        type: 'saveTypes',
        payload: data,
      });
      if (resp && state === 0 && callback) {
        callback(data);
      }
    },
    *add({ payload, callback }, { call }) {
      const resp = yield call(addReport, payload);
      const { state } = resp;
      if (resp && state === 0 && callback) {
        callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const resp = yield call(delReport, payload);
      const { state } = resp;
      if (resp && state === 0 && callback) {
        callback();
      }
    },
    *update({ payload, callback }, { call }) {
      const resp = yield call(editReport, payload);
      const { state } = resp;
      if (resp && state === 0) {
        if (callback) callback();
      }
    },
    *sqlSave({ payload, callback }, { call }) {
      const resp = yield call(saveSqlInfo, payload);
      const { state } = resp;
      if (resp && state === 0) {
        if (callback) callback();
      }
    },
    *sqlInfo({ payload, callback }, { call }) {
      const resp = yield call(getSqlInfoById, payload);
      const { state, data } = resp;
      if (resp && state === 0) {
        if (callback) callback(data);
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
    saveTypes(state, action) {
      return {
        ...state,
        types: action.payload,
      };
    },
  },
};
