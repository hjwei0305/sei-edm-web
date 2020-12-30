import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/**
 * 获取文件二进行流
 * @docId string
 * @markText string
 */
export async function getFile(params) {
  const url = `${SERVER_PATH}/edm-service/preview/readFile`;
  return request({
    url,
    responseType: 'arraybuffer',
    params,
  });
}
