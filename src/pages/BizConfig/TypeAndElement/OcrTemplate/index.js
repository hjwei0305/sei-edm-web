import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { get } from 'lodash';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Drawer, Popconfirm, Input } from 'antd';
import { Space, ListCard, ExtIcon } from 'suid';
import ElementMap from './ElementMap';
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

  showAssign = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'typeOrcTemplate/updateState',
      payload: {
        showAssignModal: true,
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
          <Button type="primary" onClick={this.showAssign}>
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

  handlerShowElementMap = item => {
    const {
      dispatch,
      typeOrcTemplate: { showElementMap, currentOcrTemplate },
    } = this.props;
    if (currentOcrTemplate && item.id === currentOcrTemplate.id) {
      dispatch({
        type: 'typeOrcTemplate/updateState',
        payload: {
          currentOcrTemplate: !showElementMap ? item : null,
          showElementMap: !showElementMap,
        },
      });
    } else {
      dispatch({
        type: 'typeOrcTemplate/updateState',
        payload: {
          currentOcrTemplate: item,
          showElementMap: true,
        },
      });
    }
  };

  renderDesc = item => {
    const {
      typeOrcTemplate: { showElementMap, currentOcrTemplate },
    } = this.props;
    return (
      <>
        <Space direction="vertical">
          {item.templateType}
          <Space>
            <Button
              size="small"
              className={cls('trigger-map', 'ant-dropdown-trigger', {
                'ant-dropdown-open': showElementMap && currentOcrTemplate.id === item.id,
              })}
              onClick={() => this.handlerShowElementMap(item)}
            >
              要素映射
              <ExtIcon type="down" antd />
            </Button>
          </Space>
        </Space>
        {showElementMap && currentOcrTemplate.id === item.id ? (
          <ElementMap ocrTemplate={item} />
        ) : null}
      </>
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
        title: item => item.remark,
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
