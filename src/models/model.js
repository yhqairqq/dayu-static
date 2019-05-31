import { queryModel, delModel, addModel, editModel, changeStatus, getColumns } from '@/services/model';

export default {
  namespace: 'model',

  state: {
    fields: [],
    data: {
      list: [],
      pagination: {}
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryModel, payload);
      const { data } = response
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addModel, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(delModel, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(editModel, payload);
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
    *getColumns({ payload, callback }, { call, put }) {
      const response = yield call(getColumns, payload);
      yield put({
        type: 'saveColumns',
        payload: response.data,
      });
      if (callback) callback();
    }
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
        fields: action.payload
      }
    }
  },
};