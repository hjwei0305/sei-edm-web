import { utils, message } from 'suid';
import { del, save, getAllServices, disableService, enableService } from './service';

const { dvaModel, pathMatchRegexp } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'ocrService',

  state: {
    itemData: null,
    showFormModal: false,
    serviceData: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/ocr/service', location.pathname)) {
          dispatch({
            type: 'getAllServices',
          });
        }
      });
    },
  },
  effects: {
    *getAllServices({ callback }, { call, put }) {
      const result = yield call(getAllServices);
      const { success, message: msg, data } = result || {};
      message.destroy();
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            serviceData: data || [],
          },
        });
      } else {
        message.error(msg);
      }
      if (callback && callback instanceof Function) {
        callback(result);
      }
    },
    *save({ payload, callback }, { call, put }) {
      const result = yield call(save, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
        yield put({
          type: 'updateState',
          payload: {
            itemData: null,
            showFormModal: false,
          },
        });
      } else {
        message.error(msg);
      }
      if (callback && callback instanceof Function) {
        callback(result);
      }
    },
    *del({ payload, callback }, { call }) {
      const result = yield call(del, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }
      if (callback && callback instanceof Function) {
        callback(result);
      }
    },
    *enableService({ payload, callback }, { call }) {
      const result = yield call(enableService, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }
      if (callback && callback instanceof Function) {
        callback(result);
      }
    },
    *disableService({ payload, callback }, { call }) {
      const result = yield call(disableService, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }
      if (callback && callback instanceof Function) {
        callback(result);
      }
    },
  },
});
