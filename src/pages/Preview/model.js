/*
 * @Author: Eason
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: Eason
 * @Last Modified time: 2020-10-14 10:36:22
 */
import { get } from 'lodash';
import { utils, message } from 'suid';
import { constants } from '@/utils';
import { getEntityDocuments, getDocuments } from './service';

const { SERVER_PATH } = constants;
const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

const getFileList = documents => {
  return documents.map(doc => {
    const id = get(doc, 'id') || get(doc, 'docId');
    const fileName = get(doc, 'fileName');
    return {
      id,
      uid: id,
      name: fileName,
      fileName,
      status: 'done',
      fileSize: get(doc, 'fileSize'),
      size: get(doc, 'size'),
      documentTypeEnum: get(doc, 'documentTypeEnum') || get(doc, 'documentType'),
      uploadedTime: get(doc, 'uploadedTime'),
      thumbUrl: `${SERVER_PATH}/edm-service/file/thumbnail?docId=${id}`,
    };
  });
};

export default modelExtend(model, {
  namespace: 'documentPreivew',

  state: {
    fileList: [],
    currentFile: null,
    currentFileIndex: 0,
    currentFileId: '',
    collapsed: false,
    fileLoading: true,
    prevButtonDisabled: true,
    nextButtonDisabled: true,
    watermark: '',
    fileTotalCount: 0,
  },
  effects: {
    *getEntityDocuments({ payload }, { call, put }) {
      const { entityId, watermark, currentFileId } = payload;
      const res = yield call(getEntityDocuments, { entityId });
      if (res.success) {
        const documents = res.data || [];
        const fileList = getFileList(documents);
        let currentFile = fileList.length > 0 ? fileList[0] : null;
        const fileTotalCount = fileList.length;
        let currentFileIndex = 0;
        let prevButtonDisabled = true;
        let nextButtonDisabled = true;
        if (fileTotalCount > 1) {
          nextButtonDisabled = false;
        }
        if (currentFileId) {
          for (let i = 0; i < fileTotalCount; i += 1) {
            const file = fileList[i];
            if (file.id === currentFileId) {
              currentFileIndex = i;
              currentFile = file;
              break;
            }
          }
          prevButtonDisabled = currentFileIndex <= 0;
          nextButtonDisabled = currentFileIndex >= fileTotalCount - 1;
        }
        yield put({
          type: 'updateState',
          payload: {
            watermark,
            fileList,
            currentFile,
            collapsed: false,
            currentFileIndex,
            prevButtonDisabled,
            nextButtonDisabled,
            fileTotalCount,
          },
        });
      } else {
        message.destroy();
        message.error(res.message);
      }
    },
    *getDocuments({ payload }, { call, put }) {
      const { docIds, watermark, currentFileId } = payload;
      const res = yield call(getDocuments, docIds);
      if (res.success) {
        const documents = res.data || [];
        const fileList = getFileList(documents);
        let currentFile = fileList.length > 0 ? fileList[0] : null;
        const fileTotalCount = fileList.length;
        let prevButtonDisabled = true;
        let nextButtonDisabled = true;
        let currentFileIndex = 0;
        if (fileTotalCount > 1) {
          nextButtonDisabled = false;
        }
        if (currentFileId) {
          for (let i = 0; i < fileTotalCount; i += 1) {
            const file = fileList[i];
            if (file.id === currentFileId) {
              currentFileIndex = i;
              currentFile = file;
              break;
            }
          }
          prevButtonDisabled = currentFileIndex <= 0;
          nextButtonDisabled = currentFileIndex >= fileTotalCount - 1;
        }
        yield put({
          type: 'updateState',
          payload: {
            watermark,
            fileList,
            currentFile,
            collapsed: false,
            currentFileIndex,
            prevButtonDisabled,
            nextButtonDisabled,
            fileTotalCount,
          },
        });
      } else {
        message.destroy();
        message.error(res.message);
      }
    },
    *handlerPrevFile(_, { put, select }) {
      const { fileTotalCount, fileList, currentFileIndex } = yield select(
        sel => sel.documentPreivew,
      );
      const currentIndex = currentFileIndex - 1 <= 0 ? 0 : currentFileIndex - 1;
      const prevButtonDisabled = currentIndex <= 0;
      const nextButtonDisabled = currentIndex >= fileTotalCount;
      yield put({
        type: 'updateState',
        payload: {
          fileLoading: true,
          currentFile: fileList[currentIndex],
          currentFileIndex: currentIndex,
          prevButtonDisabled,
          nextButtonDisabled,
        },
      });
    },
    *handlerNextFile(_, { put, select }) {
      const { fileTotalCount, fileList, currentFileIndex } = yield select(
        sel => sel.documentPreivew,
      );
      const currentIndex =
        currentFileIndex + 1 >= fileTotalCount ? fileTotalCount - 1 : currentFileIndex + 1;
      const prevButtonDisabled = currentIndex <= 0;
      const nextButtonDisabled = currentIndex >= fileTotalCount - 1;
      yield put({
        type: 'updateState',
        payload: {
          fileLoading: true,
          currentFile: fileList[currentIndex],
          currentFileIndex: currentIndex,
          prevButtonDisabled,
          nextButtonDisabled,
        },
      });
    },
  },
});
