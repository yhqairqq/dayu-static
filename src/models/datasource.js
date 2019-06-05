import {
  queryAllSimpleDatasource,
  queryDatasource,
  delDatasource,
  addDatasource,
  editDatasource,
  changeStatus,
  getDataTypes,
  getTables,
} from '@/services/datasource';

export default {
  namespace: 'datasource',
  state: {
    simpleDatasources: [], // 所有数据源简单信息
    tables: [], // 某个数据源下的表列表
    tableColumns: [], // 某个表下面的所有字段
    dataTypes: [], // 数据类型
    data: {
      list: [],
      pagination: {}
    },
  },
  effects: {
    *fetchAll(_, { call, put }) {
      const response = yield call(queryAllSimpleDatasource);
      const { data } = response
      yield put({
        type: 'saveAll',
        payload: data,
      });
    },
    *fetchTables({ payload }, { call, put }) {
      const response = yield call(getTables, payload);
      const { data } = response
      yield put({
        type: 'saveTables',
        payload: data,
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryDatasource, payload);
      const { data } = response
      yield put({
        type: 'save',
        payload: data,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addDatasource, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(delDatasource, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(editDatasource, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *changeStatus({ payload, callback }, { call, put }) {
      const response = yield call(changeStatus, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *getDataTypes({payload}, {call, put}) {
      const response = yield call(getDataTypes, payload);
      yield put({
        type: 'saveDataTypes',
        payload: response.data,
      });
    }
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
        simpleDatasources: action.payload
      }
    },
    saveTables(state, action) {
      return {
        ...state,
        tables: action.payload
      }
    },
    saveDataTypes(state, action) {
      return {
        ...state,
        dataTypes: action.payload
      }
    }
  },
}