import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Tag } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable, Space } from 'suid';
import { FilterView } from '@/components';
import { constants } from '@/utils';
import styles from './index.less';

const { RULE_TYPE } = constants;

@connect(({ bizRule, loading }) => ({ bizRule, loading }))
class BizRule extends Component {
  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bizRule/getBizRules',
    });
  };

  handlerViewTypeChange = ruleType => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bizRule/updateState',
      payload: {
        ruleType,
      },
    });
    this.reloadData();
  };

  render() {
    const { bizRule, loading } = this.props;
    const { ruleData, ruleTypeData, ruleType } = bizRule;
    const columns = [
      {
        title: '规则代码',
        dataIndex: 'code',
        width: 160,
        required: true,
      },
      {
        title: '规则名称',
        dataIndex: 'name',
        width: 180,
        required: true,
      },
      {
        title: '规则类型',
        dataIndex: 'ruleType',
        width: 100,
        required: true,
        render: t => {
          const rt = RULE_TYPE[t];
          if (rt) {
            return <Tag color={rt.color}>{rt.title}</Tag>;
          }
          return t;
        },
      },
      {
        title: '规则描述',
        dataIndex: 'remark',
        width: 480,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Space>
          <FilterView
            title="规则类型"
            currentViewType={ruleType}
            viewTypeData={ruleTypeData}
            onAction={this.handlerViewTypeChange}
            reader={{
              title: 'title',
              value: 'key',
            }}
          />
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </Space>
      ),
    };
    const tableProps = {
      toolBar: toolBarProps,
      columns,
      searchWidth: 320,
      lineNumber: false,
      rowKey: 'code',
      allowCustomColumns: false,
      searchPlaceHolder: '规则代码、名称、描述关键字',
      searchProperties: ['code', 'name', 'remark'],
      dataSource: ruleData,
      loading: loading.global,
    };
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable {...tableProps} />
      </div>
    );
  }
}

export default BizRule;
