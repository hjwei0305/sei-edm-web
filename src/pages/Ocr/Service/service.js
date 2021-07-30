import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { SERVER_PATH } = constants;

/** 获取所有OCR服务 */
export async function getAllServices() {
  const url = `${SERVER_PATH}/edm-service/ocrTemplate/findAllServices`;
  return request({
    url,
  });
}

/** 启用
 * @id string
 */
export async function enableService(params) {
  const url = `${SERVER_PATH}/edm-service/ocrTemplate/enableService`;
  return request({
    url,
    method: 'POST',
    params,
    data: {},
  });
}

/** 禁用
 * @id string
 */
export async function disableService(params) {
  const url = `${SERVER_PATH}/edm-service/ocrTemplate/disableService`;
  return request({
    url,
    method: 'POST',
    params,
    data: {},
  });
}

/** 保存 */
export async function save(data) {
  const url = `${SERVER_PATH}/edm-service/ocrTemplate/saveService`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${SERVER_PATH}/edm-service/ocrTemplate/removeService/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}
