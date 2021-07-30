import React, { Component } from 'react';
import { get } from 'lodash';
import { connect } from 'dva';
import cls from 'classnames';
import QueueAnim from 'rc-queue-anim';
import { Card, Avatar, Modal } from 'antd';
import { ScrollBar, ExtIcon, Space, ListLoader } from 'suid';
import empty from '@/assets/ocr_empty.svg';
import { constants } from '@/utils';
import FormConfig from './components/FormConfig';
import ExtAction from './components/ExtAction';
import styles from './index.less';

const { OCR_SERVICE_BTN_KEY } = constants;
const defaultAppIcon = empty;
const { Meta } = Card;

@connect(({ ocrService, loading }) => ({ ocrService, loading }))
class OcrService extends Component {
  static confirmModal;

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ocrService/updateState',
      payload: {
        showFormModal: false,
        itemData: null,
      },
    });
  }

  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ocrService/getAllServices',
    });
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ocrService/updateState',
      payload: {
        showFormModal: true,
        itemData: null,
      },
    });
  };

  edit = itemData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ocrService/updateState',
      payload: {
        showFormModal: true,
        itemData,
      },
    });
  };

  handlerSave = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ocrService/save',
      payload: data,
      callback: res => {
        if (res.success) {
          this.reloadData();
        }
      },
    });
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ocrService/updateState',
      payload: {
        showFormModal: false,
        itemData: null,
      },
    });
  };

  deleteConfirm = record => {
    const { dispatch } = this.props;
    const id = get(record, 'id');
    this.confirmModal = Modal.confirm({
      title: `删除确认`,
      content: `提示：删除后不可恢复!`,
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
            type: 'ocrService/del',
            payload: {
              id,
            },
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

  setStateConfirm = (record, frozen) => {
    const { dispatch } = this.props;
    const id = get(record, 'id');
    const ocrName = get(record, 'name');
    let typeAction = 'ocrService/enableService';
    let title = '启用OCR服务';
    let subTitle = `确定要启用[${ocrName}]吗?，提示:启用后其它服务将自动停用`;
    if (frozen) {
      typeAction = 'ocrService/disableService';
      title = `停用OCR服务`;
      subTitle = `确定要停用[${ocrName}]吗?`;
    }
    this.confirmModal = Modal.confirm({
      title,
      content: subTitle,
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
            type: typeAction,
            payload: {
              id,
            },
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

  handlerAction = (key, row) => {
    if (key === OCR_SERVICE_BTN_KEY.EDIT) {
      this.edit(row);
    }
    if (key === OCR_SERVICE_BTN_KEY.DELETE) {
      this.deleteConfirm(row);
    }
    if (key === OCR_SERVICE_BTN_KEY.FROZEN) {
      this.setStateConfirm(row, true);
    }
    if (key === OCR_SERVICE_BTN_KEY.ACTIVE) {
      this.setStateConfirm(row, false);
    }
  };

  render() {
    const {
      loading,
      ocrService: { serviceData, itemData, showFormModal },
    } = this.props;
    const formConfigProps = {
      itemData,
      visible: showFormModal,
      onSave: this.handlerSave,
      saving: loading.effects['ocrService/save'],
      onClose: this.closeFormModal,
    };
    return (
      <div className={cls(styles['container-box'])}>
        <ScrollBar>
          {loading.effects['ocrService/getAllServices'] ? (
            <div className="service-box">
              <div
                key="trigger-blank"
                className={cls('service-item', 'trigger-blank', {
                  'show-form-modal': showFormModal,
                })}
                onClick={this.add}
              >
                <ListLoader />
              </div>
            </div>
          ) : (
            <QueueAnim component="div" type="scale" className="service-box">
              {serviceData.map(d => {
                return (
                  <Card
                    key={d.id}
                    bordered
                    hoverable
                    className="service-item"
                    cover={<img alt="LOGO" src={get(d, 'icon') || defaultAppIcon} />}
                  >
                    <Meta
                      avatar={
                        <Avatar shape="square" className={d.frozen ? 'frozen' : 'active'} size={42}>
                          {d.frozen ? '已停用' : '使用中'}
                        </Avatar>
                      }
                      title={get(d, 'name')}
                      description={get(d, 'remark') || get(d, 'code')}
                    />
                    <div className="action-box">
                      <ExtAction recordItem={d} onAction={this.handlerAction} />
                    </div>
                  </Card>
                );
              })}
              <div
                key="trigger-blank"
                className={cls('service-item', 'trigger-blank', {
                  'show-form-modal': showFormModal,
                })}
                onClick={this.add}
              >
                <Space direction="vertical">
                  <ExtIcon type="plus" antd />
                  <span className="blank-text">新建OCR服务</span>
                </Space>
              </div>
            </QueueAnim>
          )}
        </ScrollBar>
        <FormConfig {...formConfigProps} />
      </div>
    );
  }
}

export default OcrService;
