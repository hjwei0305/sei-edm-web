import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { SERVER_PATH } = constants;

/** 获取当前可以用的OCR服务 */
export async function getService() {
  const url = `${SERVER_PATH}/edm-service/ocrTemplate/findAvailableService`;
  return request({
    url,
  });
}

/**
 * 通过OCR服务ID获取模板清单
 * @serviceId string
 */
export async function getTemplates(params) {
  const url = `${SERVER_PATH}/edm-service/ocrTemplate/getTemplates`;
  return request({
    url,
    params,
  });
}

/** 添加模板
 * @serviceId string
 * @types array
 */
export async function addServiceTemplate(data) {
  const { types, serviceId } = data;
  const url = `${SERVER_PATH}/edm-service/ocrTemplate/addTemplate/${serviceId}`;
  return request({
    url,
    method: 'POST',
    data: types,
  });
}

/**
 * 更新模板
 */
export async function updateServiceTemplate(data) {
  const url = `${SERVER_PATH}/edm-service/ocrTemplate/updateTemplate`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除模板 */
export async function del(ids) {
  const url = `${SERVER_PATH}/edm-service/ocrTemplate/removeTemplate`;
  return request({
    url,
    method: 'DELETE',
    data: ids,
  });
}

/**
 * 更新ocr模版要素名称
 */
export async function saveElement(data) {
  const { id, name } = data;
  const url = `${SERVER_PATH}/edm-service/ocrTemplate/putElement/${id}`;
  return request({
    url,
    data: { name },
  });
}
