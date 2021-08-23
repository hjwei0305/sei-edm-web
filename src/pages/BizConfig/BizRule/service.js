import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { SERVER_PATH } = constants;

/** 获取所有规则 */
export async function getBizRules() {
  const url = `${SERVER_PATH}/edm-service/bizRule/getAllRules`;
  return request({
    url,
  });
}
