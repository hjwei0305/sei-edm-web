import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { addElement, updateElement, delElement } from '../service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'typeElement',

  state: {
    elementData: [],
    showElementFormModal: false,
    currentTypeItemElelemnt: null,
  },
  effects: {
    *addElement({ payload, callback }, { call }) {
      const re = yield call(addElement, payload);
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
    *updateElement({ payload, callback }, { call }) {
      const re = yield call(updateElement, payload);
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
    *delElement({ payload, callback }, { call }) {
      const re = yield call(delElement, payload);
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
  },
});
