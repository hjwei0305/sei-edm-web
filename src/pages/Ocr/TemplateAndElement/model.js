import { utils, message } from 'suid';
import { get } from 'lodash';
import {
  getService,
  getTemplates,
  addServiceTemplate,
  updateServiceTemplate,
  del,
  saveElement,
} from './service';

const { dvaModel, pathMatchRegexp } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'templateAndElement',

  state: {
    serviceData: null,
    templateData: [],
    selectedTemplate: null,
    showElementFormModal: false,
    elementData: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/ocr/template', location.pathname)) {
          dispatch({
            type: 'getService',
          });
        }
      });
    },
  },
  effects: {
    *getService({ callback }, { call, put }) {
      const result = yield call(getService);
      message.destroy();
      if (result.success) {
        const serviceData = result.data;
        const re = yield call(getTemplates, { serviceId: get(serviceData, 'id') });
        if (re.success) {
          yield put({
            type: 'updateState',
            payload: {
              serviceData: result.data || null,
              templateData: re.data || [],
            },
          });
        } else {
          message.error(re.message);
        }
      } else {
        message.error(result.message);
      }
      if (callback && callback instanceof Function) {
        callback(result);
      }
    },
    *getTemplates({ callback }, { call, put, select }) {
      const { serviceData } = yield select(sel => sel.templateAndElement);
      const serviceId = get(serviceData, 'id');
      message.destroy();
      if (serviceId) {
        const re = yield call(getTemplates, { serviceId });
        if (re.success) {
          yield put({
            type: 'updateState',
            payload: {
              templateData: re.data || [],
            },
          });
        } else {
          message.error(re.message);
        }
        if (callback && callback instanceof Function) {
          callback(re);
        }
      }
    },
    *addServiceTemplate({ payload, callback }, { call, put }) {
      const result = yield call(addServiceTemplate, payload);
      const { success, message: msg, data } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
        yield put({
          type: 'updateState',
          payload: {
            selectedTemplate: data,
          },
        });
      } else {
        message.error(msg);
      }
      if (callback && callback instanceof Function) {
        callback(result);
      }
    },
    *del({ payload, callback }, { call, put }) {
      const result = yield call(del, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
        yield put({
          type: 'updateState',
          payload: {
            selectedTemplate: null,
          },
        });
      } else {
        message.error(msg);
      }
      if (callback && callback instanceof Function) {
        callback(result);
      }
    },
    *updateServiceTemplate({ payload, callback }, { call, put }) {
      const result = yield call(updateServiceTemplate, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
        yield put({
          type: 'updateState',
          payload: {
            selectedTemplate: result.data,
          },
        });
      } else {
        message.error(msg);
      }
      if (callback && callback instanceof Function) {
        callback(result);
      }
    },
    *saveElement({ payload, callback }, { call }) {
      const result = yield call(saveElement, payload);
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
