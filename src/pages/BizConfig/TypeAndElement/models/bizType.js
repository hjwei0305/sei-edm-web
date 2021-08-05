import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { getDomains, saveBizType, delBizType, enableBizType, disableBizType } from '../service';

const { dvaModel, pathMatchRegexp } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'typeAndElement',

  state: {
    currentTabKey: 'typeElement',
    currentDomain: null,
    domainData: [],
    currentBizType: null,
    selectedBizType: null,
    showElementFormModal: false,
    currentTypeItemElelemnt: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/bizConfig/typeList', location.pathname)) {
          dispatch({
            type: 'getDomains',
          });
        }
      });
    },
  },
  effects: {
    *getDomains({ callback }, { call, put }) {
      const result = yield call(getDomains);
      message.destroy();
      if (result.success) {
        const domainData = result.data || [];
        const [currentDomain = null] = domainData;
        yield put({
          type: 'updateState',
          payload: {
            domainData,
            currentDomain,
          },
        });
      } else {
        message.error(result.message);
      }
      if (callback && callback instanceof Function) {
        callback(result);
      }
    },
    *saveBizType({ payload, callback }, { call }) {
      const re = yield call(saveBizType, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *delBizType({ payload, callback }, { call }) {
      const re = yield call(delBizType, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.delete-success', defaultMessage: '删除成功' }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *enableBizType({ payload, callback }, { call }) {
      const result = yield call(enableBizType, payload);
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
    *disableBizType({ payload, callback }, { call }) {
      const result = yield call(disableBizType, payload);
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
