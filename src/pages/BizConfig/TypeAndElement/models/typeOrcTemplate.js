import { utils, message } from 'suid';
import {
  delOcrTemplate,
  assignOcrTemplate,
  getAssignedOcrTemplate,
  getAllOcrTemplate,
} from '../service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'typeOrcTemplate',

  state: {
    showFormModal: false,
    showAssignModal: false,
    currentOcrTemplate: null,
    showUnAssign: false,
    allOcrTemplateData: [],
    assignedOcrTemplateData: [],
    showElementMap: false,
  },
  effects: {
    *getAssignedOcrTemplate({ payload, callback }, { call, put, select }) {
      const { allOcrTemplateData: originAllOcrTemplateData } = yield select(
        sel => sel.typeOrcTemplate,
      );
      const result = yield call(getAssignedOcrTemplate, payload);
      message.destroy();
      if (result.success) {
        const assignedOcrTemplateData = result.data || [];
        const allOcrTemplateData = [...originAllOcrTemplateData];
        if (originAllOcrTemplateData.length === 0) {
          const res = yield call(getAllOcrTemplate);
          if (res.success) {
            (res.data || []).forEach(tp => {
              allOcrTemplateData.push({
                name: tp.remark,
                code: tp.name,
                templateType: tp.name,
              });
            });
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            assignedOcrTemplateData,
            allOcrTemplateData,
          },
        });
      } else {
        message.error(result.message);
      }
      if (callback && callback instanceof Function) {
        callback(result);
      }
    },
    *assignOcrTemplate({ payload, callback }, { call }) {
      const re = yield call(assignOcrTemplate, payload);
      message.destroy();
      if (re.success) {
        message.success('分配OCR模板成功');
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *delOcrTemplate({ payload, callback }, { call }) {
      const re = yield call(delOcrTemplate, payload);
      message.destroy();
      if (re.success) {
        message.success('移除OCR模板成功');
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
