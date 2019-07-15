import {
  queryPeek,
  addPeek,
  editPeek,
  delPeek,
  sendData2Me,
  countSize,
  previewData,
  getRuleByPeekId,
  getDataTypeRules,
  saveQuery,
  queryExistedRuleAndFieldList,
  importData,
  queryImportRecordList,
  previewImportData,
} from '@/services/peek';

export default {
  namespace: 'peek',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    rules: [],
    dataTypeRules: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryPeek, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *getRuleByPeekId({ payload, callback }, { call, put }) {
      const response = yield call(getRuleByPeekId, payload);
      yield put({
        type: 'saveRules',
        payload: response.data,
      });
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *getDataTypeRules({ payload }, { call, put }) {
      const response = yield call(getDataTypeRules, payload);
      yield put({
        type: 'saveDataRules',
        payload: response.data,
      });
    },
    *sendData2Me({ payload, callback }, { call }) {
      const response = yield call(sendData2Me, payload);
      if (response && response.state === 0) {
        if (callback) callback(response.data);
      }
    },
    *countSize({ payload, callback }, { call }) {
      const response = yield call(countSize, payload);
      if (response && response.state === 0) {
        if (callback) callback(response.data);
      }
    },
    *previewData({ payload, callback }, { call }) {
      const response = yield call(previewData, payload);
      if (response && response.state === 0) {
        if (callback) callback(response.data);
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addPeek, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(delPeek, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(editPeek, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },

    *saveQuery({ payload, callback }, { call }) {
      const response = yield call(saveQuery, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },

    *queryExistedRuleAndFieldList({ payload, callback }, { call }) {
      const response = yield call(queryExistedRuleAndFieldList, payload);
      if (response && response.state === 0) {
        if (callback) callback(response.data);
      }
    },

    *importData({ payload, callback }, { call }) {
      const response = yield call(importData, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },
    *fetchImportRecordList({ payload, callback }, { call }) {
      const response = yield call(queryImportRecordList, payload);
      if (response && response.state === 0) {
        if (callback) callback(response.data);
      }
    },

    *previewImportData({ payload, callback }, { call }) {
      const response = yield call(previewImportData, payload);
      if (response && response.state === 0) {
        if (callback) callback(response.data);
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
    saveRules(state, action) {
      return {
        ...state,
        rules: action.payload,
      };
    },
    saveDataRules(state, action) {
      return {
        ...state,
        dataTypeRules: action.payload,
      };
    },
  },
};
