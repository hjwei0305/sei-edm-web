import React, { Component } from 'react';
import { get } from 'lodash';
import { connect } from 'dva';
import cls from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import { Layout, Empty, Input, Popconfirm } from 'antd';
import { ExtIcon, ListCard } from 'suid';
import empty from '@/assets/item_empty.svg';
import { constants } from '@/utils';
import { FilterView } from '@/components';
import TypeAdd from './components/TypeForm/Add';
import TypeEdit from './components/TypeForm/Edit';
import Config from './Config';
import UnAssignOcrTemplate from './UnAssignOcrTemplate';
import styles from './index.less';

const { SERVER_PATH } = constants;
const { Sider, Content } = Layout;
const { Search } = Input;

@connect(({ typeAndElement, typeOrcTemplate, loading }) => ({
  typeAndElement,
  typeOrcTemplate,
  loading,
}))
class TypeAndElement extends Component {
  static listCardRef;

  static typeItemElementRef;

  constructor() {
    super();
    this.state = {
      dealId: null,
    };
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'typeAndElement/updateState',
      payload: {
        currentBizType: null,
        selectedBizType: null,
      },
    });
  }

  reloadData = () => {
    if (this.listCardRef) {
      this.listCardRef.remoteDataRefresh();
    }
  };

  handlerSave = (data, callback = () => {}) => {
    const {
      dispatch,
      typeAndElement: { currentDomain },
    } = this.props;
    dispatch({
      type: 'typeAndElement/saveBizType',
      payload: {
        domainId: get(currentDomain, 'id'),
        ...data,
      },
      callback: res => {
        if (res.success) {
          callback();
          this.reloadData();
        }
      },
    });
  };

  del = (data, e) => {
    if (e) e.stopPropagation();
    const { dispatch } = this.props;
    this.setState(
      {
        dealId: data.id,
      },
      () => {
        dispatch({
          type: 'typeAndElement/delBizType',
          payload: {
            id: data.id,
          },
          callback: res => {
            if (res.success) {
              this.setState({
                dealId: null,
              });
              this.reloadData();
            }
          },
        });
      },
    );
  };

  frozen = (data, e) => {
    if (e) e.stopPropagation();
    const { dispatch } = this.props;
    this.setState(
      {
        dealId: data.id,
      },
      () => {
        const frozen = get(data, 'frozen') || false;
        let urlAction = 'disableBizType';
        if (frozen === true) {
          urlAction = 'enableBizType';
        }
        dispatch({
          type: `typeAndElement/${urlAction}`,
          payload: {
            id: data.id,
          },
          callback: res => {
            if (res.success) {
              this.setState({
                dealId: null,
              });
              this.reloadData();
            }
          },
        });
      },
    );
  };

  renderItemAction = item => {
    const { loading } = this.props;
    const { dealId } = this.state;
    const saving = loading.effects['typeAndElement/saveBizType'];
    return (
      <div className="tool-action" onClick={e => e.stopPropagation()}>
        <TypeEdit saving={saving} save={this.handlerSave} rowData={item} />
        <Popconfirm
          title={formatMessage({
            id: 'global.delete.confirm',
            defaultMessage: '确定要删除吗?',
          })}
          onConfirm={e => this.del(item, e)}
        >
          {loading.effects['typeAndElement/delBizType'] && dealId === item.id ? (
            <ExtIcon className={cls('del', 'action-item', 'loading')} type="loading" antd />
          ) : (
            <ExtIcon className={cls('del', 'action-item')} type="delete" antd />
          )}
        </Popconfirm>
        <Popconfirm
          title={item.frozen ? '确定要启用吗?' : '确定要停用吗?'}
          onConfirm={e => this.frozen(item, e)}
        >
          {(loading.effects['typeAndElement/enableBizType'] ||
            loading.effects['typeAndElement/disableBizType']) &&
          dealId === item.id ? (
            <ExtIcon className={cls('frozen', 'action-item', 'loading')} type="loading" antd />
          ) : (
            <ExtIcon
              className={cls('frozen', 'action-item')}
              type={item.frozen ? 'check-circle' : 'close-circle'}
              antd
            />
          )}
        </Popconfirm>
      </div>
    );
  };

  handlerSelect = (keys, items) => {
    const {
      dispatch,
      typeAndElement: { currentTabKey },
    } = this.props;
    const selectedBizType = keys.length === 1 ? items[0] : null;
    dispatch({
      type: 'typeAndElement/updateState',
      payload: {
        selectedBizType,
      },
    });
    if (currentTabKey === 'ocrTemplate') {
      this.getAssignedOcrTemplate(selectedBizType);
    }
  };

  getAssignedOcrTemplate = bizType => {
    const {
      dispatch,
      typeAndElement: { selectedBizType },
    } = this.props;
    const bizTypeId = bizType ? get(bizType, 'id') : get(selectedBizType, 'id');
    if (bizTypeId) {
      dispatch({
        type: 'typeOrcTemplate/getAssignedOcrTemplate',
        payload: {
          bizTypeId,
        },
      });
    }
  };

  handlerBizTypeChange = currentDomain => {
    const { dispatch } = this.props;
    dispatch({
      type: 'typeAndElement/updateState',
      payload: {
        currentDomain,
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
    const { loading } = this.props;
    const saving = loading.effects['typeAndElement/saveBizType'];
    return (
      <>
        <Search
          allowClear
          placeholder="输入名称或备注说明关键字查询"
          onChange={e => this.handlerSearchChange(e.target.value)}
          onSearch={this.handlerSearch}
          onPressEnter={this.handlerPressEnter}
          style={{ width: '100%' }}
        />
        <TypeAdd saving={saving} save={this.handlerSave} />
      </>
    );
  };

  renderName = item => {
    const frozen = get(item, 'frozen');
    return (
      <>
        {`${get(item, 'name')}`}
        {frozen === true ? (
          <span style={{ color: '#f5222d', fontSize: 12, marginLeft: 8 }}>已停用</span>
        ) : null}
      </>
    );
  };

  renderListTitle = () => {
    const {
      loading,
      typeAndElement: { domainData, currentDomain },
    } = this.props;
    const loadingText = loading.effects['typeAndElement/getDomains'] ? '加载中...' : '业务领域';
    const filterViewProps = {
      title: loadingText,
      viewTypeData: domainData,
      currentViewType: currentDomain,
      onAction: this.handlerBizTypeChange,
      reader: {
        title: 'name',
        value: 'id',
      },
    };
    return <FilterView {...filterViewProps} />;
  };

  handlerTabChange = currentTabKey => {
    const { dispatch } = this.props;
    dispatch({
      type: 'typeAndElement/updateState',
      payload: {
        currentTabKey,
      },
    });
    if (currentTabKey === 'ocrTemplate') {
      this.getAssignedOcrTemplate();
    }
    if (currentTabKey === 'typeElement' && this.typeItemElementRef) {
      this.typeItemElementRef.reloadData();
    }
  };

  handlerCloseAssign = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'typeOrcTemplate/updateState',
      payload: {
        showAssignModal: false,
      },
    });
  };

  handlerAssign = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'typeOrcTemplate/assignOcrTemplate',
      payload: data,
      callback: res => {
        if (res.success) {
          this.handlerCloseAssign();
          this.getAssignedOcrTemplate();
        }
      },
    });
  };

  render() {
    const {
      loading,
      typeOrcTemplate: { showAssignModal, allOcrTemplateData, assignedOcrTemplateData },
      typeAndElement: { currentDomain, currentBizType, selectedBizType, currentTabKey },
    } = this.props;
    const selectedKeys = currentBizType ? [currentBizType.id] : [];
    const typeListProps = {
      className: 'left-content',
      title: this.renderListTitle(),
      showSearch: false,
      onSelectChange: this.handlerSelect,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      searchProperties: ['name', 'remark'],
      selectedKeys,
      itemField: {
        title: item => this.renderName(item),
        description: item => item.remark || item.code,
      },
      itemTool: this.renderItemAction,
    };

    if (currentDomain) {
      Object.assign(typeListProps, {
        store: {
          url: `${SERVER_PATH}/edm-service/bizType/getByDomainCode`,
        },
        cascadeParams: {
          domainCode: get(currentDomain, 'code'),
        },
      });
    }
    const configProps = {
      selectedBizType,
      onTypeItemElementRef: ref => (this.typeItemElementRef = ref),
      currentTabKey,
      onTabChange: this.handlerTabChange,
    };
    const unAssignOcrTemplateProps = {
      selectedBizType,
      showAssign: showAssignModal,
      closeAssign: this.handlerCloseAssign,
      assign: this.handlerAssign,
      assignLoading: loading.effects['typeOrcTemplate/assignOcrTemplate'],
      allOcrTemplateData,
      assignedOcrTemplateData,
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={420} className="auto-height" theme="light">
            <ListCard {...typeListProps} />
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 4 }}>
            {selectedBizType ? (
              <Config {...configProps} />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="选择业务类型配置要素与OCR模板" />
              </div>
            )}
          </Content>
        </Layout>
        <UnAssignOcrTemplate {...unAssignOcrTemplateProps} />
      </div>
    );
  }
}

export default TypeAndElement;
