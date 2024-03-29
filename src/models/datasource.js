import {
  queryAllSimpleDatasource,
  queryDatasource,
  delDatasource,
  addDatasource,
  editDatasource,
  changeStatus,
  getDataTypes,
  getTables,
  getAllDsTypes,
  testConnection,
  getTablesAndColumns,
} from '@/services/datasource';

export default {
  namespace: 'datasource',
  state: {
    allTypes: [], // 所有支持的数据类型
    simpleDatasources: [], // 所有数据源简单信息
    tables: [], // 某个数据源下的表列表
    tableColumns: [], // 某个表下面的所有字段
    dataTypes: [], // 数据类型
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetchAll({ callback }, { call, put }) {
      const response = yield call(queryAllSimpleDatasource);
      const { data } = response;
      yield put({
        type: 'saveAll',
        payload: data,
      });
      if (callback) {
        callback(data);
      }
    },
    *fetchTables({ payload }, { call, put }) {
      const response = yield call(getTables, payload);
      const { data = [], state } = response;
      yield put({
        type: 'saveTables',
        payload: state === 1 ? [] : data,
      });
    },
    *fetchTablesAndColumns({ payload }, { call, put }) {
      const response = yield call(getTablesAndColumns, payload);
      const { data } = response;
      yield put({
        type: 'saveTablesAndColumns',
        payload: data,
      });
    },
    *fetchAllDsTypes({ payload, callback }, { call, put }) {
      const resp = yield call(getAllDsTypes, payload);
      yield put({
        type: 'saveAllTypes',
        payload: resp.data,
      });
      if (resp && resp.state === 0) {
        if (callback) callback();
      }
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryDatasource, payload);
      const { data } = response;
      yield put({
        type: 'save',
        payload: data,
      });
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addDatasource, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(delDatasource, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(editDatasource, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *changeStatus({ payload, callback }, { call }) {
      const response = yield call(changeStatus, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *getDataTypes({ payload }, { call, put }) {
      const response = yield call(getDataTypes, payload);
      yield put({
        type: 'saveDataTypes',
        payload: response.data,
      });
    },

    *testConnection({ payload, callback }, { call }) {
      const response = yield call(testConnection, payload);
      if (response.state === 0) {
        if (callback) {
          callback();
        }
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
    saveAll(state, action) {
      return {
        ...state,
        simpleDatasources: action.payload,
      };
    },
    saveTables(state, action) {
      return {
        ...state,
        tables: action.payload,
      };
    },
    saveTablesAndColumns(state, action) {
      return {
        ...state,
        tablesAndColumns: action.payload,
      };
    },
    saveDataTypes(state, action) {
      return {
        ...state,
        dataTypes: action.payload,
      };
    },
    saveAllTypes(state, action) {
      return {
        ...state,
        allTypes: action.payload,
      };
    },
  },
};
