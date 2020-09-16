import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/**
 * 根据业务实体id获取附件清单
 * @entityId string
 */
export async function getEntityDocuments(params) {
  const url = `${SERVER_PATH}/edm-service/document/getEntityDocumentInfos`;
  return request({
    url,
    params,
  });
}

/**
 * 根据附件id清单获取队件清单
 * @docIds array
 */
export async function getDocuments(data) {
  const url = `${SERVER_PATH}/edm-service/document/getEntityDocumentInfoList`;
  return request({
    method: 'POST',
    url,
    data,
  });
}
