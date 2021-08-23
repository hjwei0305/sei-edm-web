import { utils, message } from 'suid';
import { constants } from '@/utils';
import { getBizRules } from './service';

const { RULE_TYPE } = constants;
const ruleTypeData = Object.keys(RULE_TYPE).map(key => RULE_TYPE[key]);
const { dvaModel, pathMatchRegexp } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'bizRule',

  state: {
    ruleType: RULE_TYPE.ALL,
    ruleTypeData,
    ruleData: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/bizConfig/bizRule', location.pathname)) {
          dispatch({
            type: 'getBizRules',
          });
        }
      });
    },
  },
  effects: {
    *getBizRules({ callback }, { call, put, select }) {
      const result = yield call(getBizRules);
      const { ruleType } = yield select(sel => sel.bizRule);
      message.destroy();
      if (result.success) {
        let ruleData = result.data || [];
        if (ruleType.key !== RULE_TYPE.ALL.key) {
          ruleData = ruleData.filter(r => r.ruleType === ruleType.key);
        }
        yield put({
          type: 'updateState',
          payload: {
            ruleData,
          },
        });
      } else {
        message.error(result.message);
      }
      if (callback && callback instanceof Function) {
        callback(result);
      }
    },
  },
});
