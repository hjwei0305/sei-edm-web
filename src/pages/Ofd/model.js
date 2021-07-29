/*
 * @Author: Eason
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: Eason
 * @Last Modified time: 2021-07-29 11:22:08
 */
import { utils, message } from 'suid';
import { getFile } from './service';

const { dvaModel, storage, constants, pathMatchRegexp, getUUID } = utils;
const { modelExtend, model } = dvaModel;
const { CONST_GLOBAL } = constants;
const defaultWatermark = 'SEI6.0';

export default modelExtend(model, {
  namespace: 'ofdPreivew',

  state: {
    previewId: getUUID(),
    pageIndex: 1,
    pageCount: 0,
    scale: 0,
    fileData: null,
    rendering: false,
    watermark: '',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const match = pathMatchRegexp('/preview/ofd/:id', location.pathname);
        if (match) {
          dispatch({
            type: 'getFile',
            payload: {
              docId: match[1],
            },
          });
        }
      });
    },
  },
  effects: {
    *getFile({ payload }, { call, put }) {
      const { docId } = payload;
      const watermark = storage.sessionStorage.get(CONST_GLOBAL.WATERMARK) || defaultWatermark;
      const result = yield call(getFile, { watermark, docId });
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            watermark,
            fileData: result.data,
          },
        });
      } else {
        message.destroy();
        message.error(result.message);
      }
    },
  },
});
