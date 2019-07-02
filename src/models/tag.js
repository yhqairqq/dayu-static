import * as TagService from '@/services/tag';

export default {
  namespace: 'tag',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    tagList: [],
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

    *fetchAll({ payload }, { call, put }) {
      const response = yield call(TagService.queryAll, payload);
      yield put({
        type: 'saveTagList',
        payload: response.data,
      });
    },

    *saveTag({ payload, callback }, { call }) {
      const response = yield call(payload.id ? TagService.edit : TagService.add, payload);
      if (response && response.state === 0) {
        if (callback) callback();
      }
    },

    *remove({ payload, callback }, { call }) {
      const response = yield call(TagService.remove, payload);
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
    saveTagList(state, action) {
      return {
        ...state,
        tagList: action.payload,
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
