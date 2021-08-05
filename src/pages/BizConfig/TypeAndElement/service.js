import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { SERVER_PATH } = constants;

/** 获取所有业务领域 */
export async function getDomains() {
  const url = `${SERVER_PATH}/edm-service/bizDomain/findAll`;
  return request({
    url,
  });
}

/** 保存业务类型 */
export async function saveBizType(data) {
  const url = `${SERVER_PATH}/edm-service/bizType/save`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除业务类型 */
export async function delBizType(params) {
  const url = `${SERVER_PATH}/edm-service/bizType/delete/${params.id}`;
  return request({
    url,
    method: 'DELETE',
  });
}

/** 启用业务类型
 * @id string
 */
export async function enableBizType(params) {
  const url = `${SERVER_PATH}/edm-service/bizType/enable`;
  return request({
    url,
    method: 'POST',
    params,
    data: {},
  });
}

/** 禁用业务类型
 * @id string
 */
export async function disableBizType(params) {
  const url = `${SERVER_PATH}/edm-service/bizType/disable`;
  return request({
    url,
    method: 'POST',
    params,
    data: {},
  });
}

/** 新增业务要素 */
export async function addElement(data) {
  const url = `${SERVER_PATH}/edm-service/bizType/addElement`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 更新业务要素 */
export async function updateElement(data) {
  const url = `${SERVER_PATH}/edm-service/bizType/putElement`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 删除业务要素 */
export async function delElement(ids) {
  const url = `${SERVER_PATH}/edm-service/bizType/removeElement`;
  return request({
    url,
    method: 'POST',
    data: ids,
  });
}

/**
 * 获取业务类型已分配的OCR服务模板
 * @bizTypeId string
 */
export async function getAssignedOcrTemplate(params) {
  const url = `${SERVER_PATH}/edm-service/bizTypeTemplate/findByBizTypeId`;
  return request({
    url,
    params,
  });
}

/**
 * 获取所有OCR服务模板
 */
export async function getAllOcrTemplate() {
  const url = `${SERVER_PATH}/edm-service/bizTypeTemplate/getAllTemplateTypes`;
  return request({
    url,
  });
}

/** 设置业务类型OCR模板规则 */
export async function setOcrTemplateRole(data) {
  const { id, ruleCode } = data;
  const url = `${SERVER_PATH}/edm-service/bizTypeTemplate/setMatchRole/${id}`;
  return request({
    url,
    method: 'POST',
    params: { ruleCode },
    data: {},
  });
}

/** 移除业务类型OCR服务模板 */
export async function delOcrTemplate(ids) {
  const url = `${SERVER_PATH}/edm-service/bizTypeTemplate/removeTemplate`;
  return request({
    url,
    method: 'DELETE',
    data: ids,
  });
}

/** 分配业务类型OCR服务模板 */
export async function assignOcrTemplate(data) {
  const { bizTypeId, types } = data;
  const url = `${SERVER_PATH}/edm-service/bizTypeTemplate/assignTemplate/${bizTypeId}`;
  return request({
    url,
    method: 'POST',
    data: types,
  });
}
