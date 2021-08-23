/*
 * @Author: Eason
 * @Date: 2020-02-21 18:03:16
 * @Last Modified by: Eason
 * @Last Modified time: 2021-08-23 11:36:33
 */
import { base } from '../../public/app.config.json';

/** 服务接口基地址，默认是当前站点的域名地址 */
const BASE_DOMAIN = '/';

/** 网关地址 */
const GATEWAY = 'api-gateway';

/**
 * 非生产环境下是使用mocker开发，还是与真实后台开发或联调
 * 注：
 *    yarn start 使用真实后台开发或联调
 *    yarn start:mock 使用mocker数据模拟
 */
const getServerPath = () => {
  if (process.env.NODE_ENV !== 'production') {
    if (process.env.MOCK === 'yes') {
      return '/mocker.api';
    }
    return '/api-gateway';
  }
  return `${BASE_DOMAIN}${GATEWAY}`;
};

/** 项目的站点基地址 */
const APP_BASE = base;

/** 站点的地址，用于获取本站点的静态资源如json文件，xls数据导入模板等等 */
const LOCAL_PATH = process.env.NODE_ENV !== 'production' ? '..' : `../${APP_BASE}`;

const SERVER_PATH = getServerPath();

const LOGIN_STATUS = {
  SUCCESS: 'success',
  MULTI_TENANT: 'multiTenant',
  CAPTCHA_ERROR: 'captchaError',
  FROZEN: 'frozen',
  LOCKED: 'locked',
  FAILURE: 'failure',
};

/** 业务模块功能项示例 */
const APP_MODULE_BTN_KEY = {
  CREATE: `${APP_BASE}_CREATE`,
  EDIT: `${APP_BASE}_EDIT`,
  DELETE: `${APP_BASE}_DELETE`,
};

/** OCR服务功能操作 */
const OCR_SERVICE_BTN_KEY = {
  CREATE: 'OCR_SERVICE_CREATE',
  EDIT: 'OCR_SERVICE_EIDT',
  DELETE: 'OCR_SERVICE_DELETE',
  FROZEN: 'OCR_SERVICE_FROZEN',
  ACTIVE: 'OCR_SERVICE_ACTIVE',
};

/**
 * OCR模板类型
 * BusInvoice:公共汽车票,
 * CarInvoice:汽车票,
 * FlightInvoice:飞机票,
 * InvoiceGeneral:,
 * OTHER:其它,
 * QuotaInvoice:定额发票
 * ShipInvoice:船票,
 * TaxiInvoice:出租车发票,
 * TollInvoice,
 * TrainTicket:火车票,
 * VatInvoice:增值税发票,
 * VatRollInvoice
 */

const OCR_TEMPLATE_TYPE = {
  BUS_INVOICE: { type: 'BusInvoice', title: '汽车票', desc: '' },
  CAR_INVOICE: { type: 'CarInvoice', title: '购车发票', desc: '' },
  FLIGHT_INVOICE: { type: 'FlightInvoice', title: '机票行程单', desc: '' },
  INVOICE_GENERAL: { type: 'InvoiceGeneral', title: '通用机打发票', desc: '' },
  QUOTA_INVOICE: { type: 'QuotaInvoice', title: '定额发票', desc: '' },
  SHIP_INVOICE: { type: 'ShipInvoice', title: '轮船票', desc: '' },
  TAX_INVOICE: { type: 'TaxiInvoice', title: '出租车发票', desc: '' },
  TOLL_INVOICE: { type: 'TollInvoice', title: '过路过桥费发票', desc: '' },
  TRAIN_INVOICE: { type: 'TrainTicket', title: '火车票', desc: '' },
  VAT_INVOICE: { type: 'VatInvoice', title: '增值税发票', desc: '' },
  VAT_ROLL_INVOICE: { type: 'VatRollInvoice', title: '增值税发票(卷票)', desc: '' },
  OTHER: { type: 'OTHER', title: '其他未知票据', desc: '其它未定义的票据' },
};

/** OCR模板操作类型 */
const OCR_TEMPLATE_ACTION = {
  ADD: 'add',
  UPDATE: 'update',
};

const RULE_TYPE = {
  ALL: { key: 'ALL', title: '全部', color: '' },
  MATCH: { key: 'MATCH', title: '匹配规则', color: 'blue' },
  VALUE: { key: 'VALUE', title: '取值规则', color: 'orange' },
};

export default {
  APP_BASE,
  LOCAL_PATH,
  SERVER_PATH,
  APP_MODULE_BTN_KEY,
  LOGIN_STATUS,
  OCR_SERVICE_BTN_KEY,
  OCR_TEMPLATE_TYPE,
  OCR_TEMPLATE_ACTION,
  RULE_TYPE,
};
