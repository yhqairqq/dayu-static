import { queryAlarm, findByPipelineId, addAlarmRules, doSwitchStatus } from '@/services/alarmrule';
export default {
  namespace: 'rule',
  state: {
    data: {},
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const resp = yield call(queryAlarm, payload);
      const { state, data = [] } = resp;
      yield put({
        type: 'save',
        payload: data,
      });
      if (resp && state == 0 && callback) {
        callback();
      }
    },
    *fetchByPipelineId({ payload, callback }, { call }) {
      const resp = yield call(findByPipelineId, payload);
      const { state, data } = resp;

      if (resp && state == 0 && callback) {
        callback(data);
      }
    },
    *addAlarmRules({ payload, callback }, { call }) {
      const resp = yield call(addAlarmRules, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback(data);
      }
    },
    *doSwitchStatus({ payload, callback }, { call }) {
      const resp = yield call(doSwitchStatus, payload);
      const { state, data } = resp;
      if (resp && state == 0 && callback) {
        callback(data);
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
  },
};
