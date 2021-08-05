import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { get } from 'lodash';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Drawer, Popconfirm, Input } from 'antd';
import { Space, ListCard } from 'suid';
import MatchRule from './MatchRule';
import styles from './index.less';

const { Search } = Input;
@connect(({ typeOrcTemplate, loading }) => ({ typeOrcTemplate, loading }))
class OcrTemplate extends Component {
  static listCardRef;

  constructor() {
    super();
    this.state = {
      selectedKeys: [],
    };
  }

  reloadData = () => {
    const { dispatch, selectedBizType } = this.props;
    dispatch({
      type: 'typeOrcTemplate/getAssignedOcrTemplate',
      payload: {
        bizTypeId: get(selectedBizType, 'id'),
      },
    });
  };

  handlerSelectRow = selectedKeys => {
    this.setState({
      selectedKeys,
    });
  };

  handlerClearSelect = () => {
    this.setState({
      selectedKeys: [],
    });
  };

  add = () => {
    const { dispatch, selectedBizType } = this.props;
    dispatch({
      type: 'typeOrcTemplate/updateState',
      payload: {
        showAssignModal: true,
        currentOcrTemplate: null,
      },
    });
    dispatch({
      type: 'typeOrcTemplate/getAssignedOcrTemplate',
      payload: {
        bizTypeId: get(selectedBizType, 'id'),
      },
    });
  };

  edit = currentOcrTemplate => {
    const { dispatch } = this.props;
    dispatch({
      type: 'typeOrcTemplate/updateState',
      payload: {
        showFormModal: true,
        currentOcrTemplate,
      },
    });
  };

  save = data => {
    const { dispatch, typeOrcTemplate, selectedBizType } = this.props;
    const { currentOcrTemplate } = typeOrcTemplate;
    let action = 'addElement';
    if (currentOcrTemplate) {
      action = 'updateElement';
    }
    dispatch({
      type: `typeOrcTemplate/${action}`,
      payload: {
        bizTypeId: get(selectedBizType, 'id'),
        ...data,
      },
      callback: res => {
        if (res.success) {
          this.closeFormModal();
          this.reloadData();
        }
      },
    });
  };

  removeBatch = () => {
    const { selectedKeys } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'typeOrcTemplate/delOcrTemplate',
      payload: selectedKeys,
      callback: res => {
        if (res.success) {
          this.handlerClearSelect();
          this.reloadData();
        }
      },
    });
  };

  setMatchRule = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'typeOrcTemplate/setOcrTemplateRole',
      payload: data,
      callback: res => {
        if (res.success) {
          this.handlerClearSelect();
          this.reloadData();
        }
      },
    });
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerPressEnter = () => {
    this.listCardRef.handlerPressEnter();
  };

  handlerSearch = v => {
    this.listCardRef.handlerSearch(v);
  };

  renderCustomTool = () => {
    return (
      <>
        <Space>
          <Button type="primary" onClick={this.add}>
            分配OCR模板
          </Button>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </Space>
        <Search
          placeholder="输入模板代码、名称关键字查询"
          onChange={e => this.handlerSearchChange(e.target.value)}
          onSearch={this.handlerSearch}
          onPressEnter={this.handlerPressEnter}
          style={{ width: 240 }}
        />
      </>
    );
  };

  renderDesc = item => {
    return (
      <Space direction="vertical">
        {item.templateType}
        <Space>
          <Button size="small">要素映射</Button>
          <MatchRule ocrTemplate={item} onAction={this.setMatchRule} />
        </Space>
      </Space>
    );
  };

  render() {
    const { selectedKeys } = this.state;
    const { loading, typeOrcTemplate } = this.props;
    const { assignedOcrTemplateData } = typeOrcTemplate;
    const hasSelected = selectedKeys.length > 0;
    const delLoading = loading.effects['typeOrcTemplate/delElement'];
    const typeOrcTemplateListProps = {
      pagination: false,
      rowCheck: false,
      checkbox: true,
      showSearch: false,
      dataSource: assignedOcrTemplateData,
      selectedKeys,
      searchProperties: ['templateType', 'templateTypeRemark'],
      onSelectChange: this.handlerSelectRow,
      showArrow: false,
      loading: loading.effects['typeOrcTemplate/getAssignedOcrTemplate'],
      itemField: {
        title: item => item.templateType,
        description: this.renderDesc,
      },
      onListCardRef: ref => (this.listCardRef = ref),
      customTool: this.renderCustomTool,
    };
    return (
      <div className={cls(styles['type-ocr-template-box'])}>
        <ListCard {...typeOrcTemplateListProps} />
        <Drawer
          placement="top"
          closable={false}
          mask={false}
          height={44}
          getContainer={false}
          className={styles['float-tool']}
          style={{ position: 'absolute' }}
          visible={hasSelected}
        >
          <Space>
            <Button onClick={this.handlerClearSelect} disabled={delLoading}>
              取消
            </Button>
            <Popconfirm
              disabled={delLoading}
              title="确定要移除选择的模板吗?"
              onConfirm={() => this.removeBatch()}
            >
              <Button type="danger" loading={delLoading}>
                {`移除(${selectedKeys.length})`}
              </Button>
            </Popconfirm>
          </Space>
        </Drawer>
      </div>
    );
  }
}

export default OcrTemplate;
