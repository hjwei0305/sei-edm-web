import React, { Component } from 'react';
import { get } from 'lodash';
import { connect } from 'dva';
import cls from 'classnames';
import { Layout, Modal, Empty, Input } from 'antd';
import { ExtIcon, ListCard, BannerTitle } from 'suid';
import empty from '@/assets/item_empty.svg';
import { constants } from '@/utils';
import TemplateAdd from './components/TemplateForm/Add';
import TemplateEdit from './components/TemplateForm/Edit';
import TemplateElement from './components/Element';
import styles from './index.less';

const { OCR_TEMPLATE_ACTION } = constants;
const { Sider, Content } = Layout;
const { Search } = Input;

@connect(({ templateAndElement, loading }) => ({ templateAndElement, loading }))
class TemplateAndElement extends Component {
  static confirmModal;

  static listCardRef;

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'templateAndElement/updateState',
      payload: {
        showFormModal: false,
        itemData: null,
      },
    });
  }

  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'templateAndElement/getTemplates',
    });
  };

  handlerAdd = (types, callback = () => {}) => {
    const {
      dispatch,
      templateAndElement: { serviceData },
    } = this.props;
    dispatch({
      type: 'templateAndElement/addServiceTemplate',
      payload: {
        serviceId: get(serviceData, 'id'),
        types,
      },
      callback: res => {
        if (res.success) {
          callback();
          this.reloadData();
        }
      },
    });
  };

  handlerUpdate = (data, callback = () => {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'templateAndElement/updateServiceTemplate',
      payload: data,
      callback: res => {
        if (res.success) {
          callback();
          this.reloadData();
        }
      },
    });
  };

  deleteConfirm = record => {
    const { dispatch } = this.props;
    const id = get(record, 'id');
    this.confirmModal = Modal.confirm({
      title: `删除确认`,
      content: `即将删除【${get(record, 'name')}】,提示：删除后不可恢复!`,
      okButtonProps: { type: 'primary' },
      style: { top: '20%' },
      okText: '确定',
      onOk: () => {
        return new Promise(resolve => {
          this.confirmModal.update({
            okButtonProps: { type: 'primary', loading: true },
            cancelButtonProps: { disabled: true },
          });
          dispatch({
            type: 'templateAndElement/del',
            payload: [id],
            callback: res => {
              if (res.success) {
                resolve();
                this.reloadData();
              } else {
                this.confirmModal.update({
                  okButtonProps: { loading: false },
                  cancelButtonProps: { disabled: false },
                });
              }
            },
          });
        });
      },
      cancelText: '取消',
      onCancel: () => {
        this.confirmModal.destroy();
        this.confirmModal = null;
      },
    });
  };

  renderItemAction = item => {
    const { loading } = this.props;
    const saving = loading.effects['templateAndElement/updateServiceTemplate'];
    return (
      <div className="tool-action" onClick={e => e.stopPropagation()}>
        <TemplateEdit
          action={OCR_TEMPLATE_ACTION.UPDATE}
          saving={saving}
          save={this.handlerUpdate}
          rowData={item}
        />
        <ExtIcon
          onClick={() => this.deleteConfirm(item)}
          className={cls('del', 'action-item')}
          type="delete"
          antd
        />
      </div>
    );
  };

  handlerSelect = (keys, items) => {
    const { dispatch } = this.props;
    const selectedTemplate = keys.length === 1 ? items[0] : null;
    dispatch({
      type: 'templateAndElement/updateState',
      payload: {
        selectedTemplate,
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

  renderCustomTool = () => (
    <>
      <Search
        allowClear
        placeholder="输入名称或备注说明关键字查询"
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerPressEnter}
        style={{ width: '100%' }}
      />
    </>
  );

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

  handlerElementSave = (data, callback = () => {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'templateAndElement/saveElement',
      payload: data,
      callback: res => {
        if (res.success) {
          callback();
          this.handlerCloseFormModal();
        }
      },
    });
  };

  handlerCloseFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'templateAndElement/updateState',
      payload: {
        showElementFormModal: false,
        elementData: null,
      },
    });
  };

  handlerShowFormModal = elementData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'templateAndElement/updateState',
      payload: {
        showElementFormModal: true,
        elementData,
      },
    });
  };

  render() {
    const {
      loading,
      templateAndElement: {
        templateData,
        serviceData,
        selectedTemplate,
        showElementFormModal,
        elementData,
      },
    } = this.props;
    const selectedKeys = selectedTemplate ? [selectedTemplate.id] : [];
    const saving = loading.effects['templateAndElement/addServiceTemplate'];
    const templateProps = {
      className: 'left-content',
      title: <BannerTitle title={get(serviceData, 'name')} subTitle="模板列表" />,
      showSearch: false,
      onSelectChange: this.handlerSelect,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      searchProperties: ['name', 'remark'],
      selectedKeys,
      dataSource: templateData,
      extra: (
        <TemplateAdd
          templateData={templateData}
          action={OCR_TEMPLATE_ACTION.ADD}
          saving={saving}
          save={this.handlerAdd}
        />
      ),
      itemField: {
        title: item => this.renderName(item),
        description: item => item.type,
      },
      itemTool: this.renderItemAction,
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={380} className="auto-height" theme="light">
            <ListCard {...templateProps} />
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 4 }}>
            {selectedTemplate ? (
              <TemplateElement
                template={selectedTemplate}
                onSave={this.handlerElementSave}
                saving={loading.effects['templateAndElement/saveElement']}
                rowData={elementData}
                closeFormModal={this.handlerCloseFormModal}
                showModal={showElementFormModal}
                onEditElement={this.handlerShowFormModal}
              />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="选择预算主体来配置预算类型" />
              </div>
            )}
          </Content>
        </Layout>
      </div>
    );
  }
}

export default TemplateAndElement;
