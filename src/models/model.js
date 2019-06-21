import {
  queryAllModel,
  queryModel,
  delModel,
  addModel,
  editModel,
  changeStatus,
  getColumns,
  getModelMeta,
} from '@/services/model';

export default {
  namespace: 'model',

  state: {
    fields: [], // 某张数据表的字段列表
    allModels: [], // 所有模型列表
    modelMetas: [], // 某个模型的字段列表
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchAll({ payload }, { call, put }) {
      const response = yield call(queryAllModel, payload);
      yield put({
        type: 'saveAllModels',
        payload: response.data,
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryModel, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchModelMeta({ payload }, { call, put }) {
      const response = yield call(getModelMeta, payload);
      console.log('fetchModelMeta:', payload);
      yield put({
        type: 'saveModelMetas',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addModel, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(delModel, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(editModel, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *changeStatus({ payload, callback }, { call, put }) {
      const response = yield call(changeStatus, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *getColumns({ payload, callback }, { call, put }) {
      const response = yield call(getColumns, payload);
      yield put({
        type: 'saveColumns',
        payload: response.data,
      });
      if (response && response.state === 0) {
        if (callback) callback();
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
    saveColumns(state, action) {
      return {
        ...state,
        fields: action.payload,
      };
    },
    saveAllModels(state, action) {
      return {
        ...state,
        allModels: action.payload,
      };
    },
    saveModelMetas(state, action) {
      return {
        ...state,
        modelMetas: action.payload,
      };
    },
  },
};
