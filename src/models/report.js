import {
  addReport,
  editReport,
  delReport,
  queryReport,
  reportTree,
  queryDataTypes,
  queryReportTypes,
  queryFieldTypes,
  saveSqlInfo,
  getSqlInfoById,
  saveQueryField,
  getQueryFieldsByReportId,
  saveReportColumns,
  getReportColumnsByReportId,
} from '@/services/report';

export default {
  namespace: 'report',
  state: {
    types: [], // 报表类型
    dataTypes: [], // 数据类型
    fieldTypes: [], // 参数类型
    reportTree: [], // 报表树
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
    *fetchDataTypes({ payload, callback }, { call, put }) {
      const resp = yield call(queryDataTypes, payload);
      const { state, data } = resp;
      yield put({
        type: 'saveDataTypes',
        payload: data,
      });
      if (resp && state === 0 && callback) {
        callback(data);
      }
    },
    *fetchFieldTypes({ payload, callback }, { call, put }) {
      const resp = yield call(queryFieldTypes, payload);
      const { state, data } = resp;
      yield put({
        type: 'saveFieldTypes',
        payload: data,
      });
      if (resp && state === 0 && callback) {
        callback(data);
      }
    },
    *fetchReportTree({ payload, callback }, { call, put }) {
      const resp = yield call(reportTree, payload);
      const { state, data } = resp;
      yield put({
        type: 'saveReportTree',
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
    *queryFieldsSave({ payload, callback }, { call }) {
      const resp = yield call(saveQueryField, payload);
      const { state } = resp;
      if (resp && state === 0) {
        if (callback) callback();
      }
    },
    *queryFields({ payload, callback }, { call }) {
      const resp = yield call(getQueryFieldsByReportId, payload);
      const { state, data } = resp;
      if (resp && state === 0) {
        if (callback) callback(data);
      }
    },
    *reportColumnsSave({ payload, callback }, { call }) {
      const resp = yield call(saveReportColumns, payload);
      const { state } = resp;
      if (resp && state === 0) {
        if (callback) callback();
      }
    },
    *reportColumns({ payload, callback }, { call }) {
      const resp = yield call(getReportColumnsByReportId, payload);
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
    saveDataTypes(state, action) {
      return {
        ...state,
        dataTypes: action.payload,
      };
    },
    saveFieldTypes(state, action) {
      return {
        ...state,
        fieldTypes: action.payload,
      };
    },
    saveReportTree(state, action) {
      return {
        ...state,
        reportTree: action.payload,
      };
    },
  },
};
