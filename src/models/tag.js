import * as TagService from '@/services/tag';

export default {
  namespace: 'tag',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(TagService.query, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },

    *saveTag({ payload, callback }, { call, put }) {
      const response = yield call(!!payload.id ? TagService.edit : TagService.add, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(TagService.remove, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },

    // *getRuleByPeekId({ payload, callback }, { call, put }) {
    //   const response = yield call(getRuleByPeekId, payload);
    //   yield put({
    //     type: 'saveRules',
    //     payload: response.data,
    //   });
    //   if (response && response.state === 0) {
    //     if (callback) callback();
    //   }
    // },
    // *getDataTypeRules({ payload }, { call, put }) {
    //   const response = yield call(getDataTypeRules, payload);
    //   yield put({
    //     type: 'saveDataRules',
    //     payload: response.data,
    //   });
    // },
    // *sendData2Me({ payload, callback }, { call, put }) {
    //   const response = yield call(sendData2Me, payload);
    //   if (response && response.state === 0) {
    //     if (callback) callback(response.data);
    //   }
    // },
    // *countSize({ payload, callback }, { call, put }) {
    //   const response = yield call(countSize, payload);
    //   if (response && response.state === 0) {
    //     if (callback) callback(response.data);
    //   }
    // },
    // *previewData({ payload, callback }, { call, put }) {
    //   const response = yield call(previewData, payload);
    //   if (response && response.state === 0) {
    //     if (callback) callback(response.data);
    //   }
    // },
    // *add({ payload, callback }, { call, put }) {
    //   const response = yield call(addPeek, payload);
    //   if (response && response.state === 0) {
    //     if (callback) callback();
    //   }
    // },

    // *update({ payload, callback }, { call, put }) {
    //   const response = yield call(editPeek, payload);
    //   if (response && response.state === 0) {
    //     if (callback) callback();
    //   }
    // },
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
