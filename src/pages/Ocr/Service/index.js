import React, { Component } from 'react';
import { get } from 'lodash';
import { connect } from 'dva';
import cls from 'classnames';
import { Card } from 'antd';
import { ScrollBar, ExtIcon, Space } from 'suid';
import empty from '@/assets/ocr_empty.svg';
import FormConfig from './components/FormConfig';
import styles from './index.less';

const defaultAppIcon = empty;
const { Meta } = Card;

@connect(({ ocrService, loading }) => ({ ocrService, loading }))
class OcrService extends Component {
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
        modalVisible: true,
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

  del = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ocrService/del',
      payload: {
        id: record.id,
      },
      callback: res => {
        if (res.success) {
          this.reloadData();
        }
      },
    });
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
          <div className="service-box">
            {serviceData.map(d => {
              return (
                <Card
                  bordered
                  className="service-item"
                  cover={<img alt="LOGO" src={get(d, 'icon') || defaultAppIcon} />}
                >
                  <Meta title={get(d, 'name')} description={get(d, 'remark') || get(d, 'code')} />
                </Card>
              );
            })}
            <div
              className={cls('service-item', 'trigger-blank', { 'show-form-modal': showFormModal })}
              onClick={this.add}
            >
              <Space direction="vertical">
                <ExtIcon type="plus" antd />
                <span className="blank-text">新建OCR服务</span>
              </Space>
            </div>
          </div>
        </ScrollBar>
        <FormConfig {...formConfigProps} />
      </div>
    );
  }
}

export default OcrService;
