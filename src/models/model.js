import {
  queryAllModel,
  queryModel,
  delModel,
  addModel,
  editModel,
  changeStatus,
  getColumns,
  getSchemas,
  getModelMeta,
  getUpgradeColumns,
  upgradeModel,
} from '@/services/model';

import * as DatasourceService from '@/services/datasource';
import * as TagService from '@/services/tag';

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

    modelModal: {
      datasourceList: [],
      tableList: [],
      tagList: [],
      dataTypeList: [],
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
      yield put({
        type: 'saveModelMetas',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addModel, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(delModel, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },

    *update({ payload, callback }, { call }) {
      const { isUpgrade, ...others } = payload;
      const response = yield call(isUpgrade ? upgradeModel : editModel, others);
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

    *getColumnsAndSchemas({ payload, callback }, { call }) {
      const { isUpgrade } = payload;
      const response1 = yield call(isUpgrade ? getUpgradeColumns : getColumns, payload);
      const response2 = yield call(getSchemas, payload);

      if (response1 && response1.state === 0 && response2 && response2.state === 0) {
        if (callback) callback({ fields: response1.data, schemas: response2.data });
      }
    },

    *initPage({ payload }, { call, put }) {
      const dataSourceResult = yield call(DatasourceService.queryAllSimpleDatasource, payload);
      const tagResult = yield call(TagService.queryAll, payload);
      const dataTypeResult = yield call(DatasourceService.getDataTypes, payload);
      if (
        dataSourceResult &&
        dataSourceResult.state === 0 &&
        tagResult &&
        tagResult.state === 0 &&
        dataTypeResult &&
        dataTypeResult.state === 0
      ) {
        yield put({
          type: 'saveModelModal',
          payload: {
            datasourceList: dataSourceResult.data,
            tagList: tagResult.data,
            dataTypeList: dataTypeResult.data,
          },
        });
      }
    },

    *queryTableListByDsId({ payload }, { call, put }) {
      const response = yield call(DatasourceService.getTables, payload);
      if (response && response.state === 0) {
        yield put({
          type: 'saveModelModal',
          payload: { tableList: response.data },
        });
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

    saveModelModal(state, action) {
      const { modelModal } = state;
      return {
        ...state,
        modelModal: {
          ...modelModal,
          ...action.payload,
        },
      };
    },
  },
};
