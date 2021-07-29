import React, { Component } from 'react';
import { get } from 'lodash';
import { connect } from 'dva';
import cls from 'classnames';
import { Card } from 'antd';
import { ScrollBar, ExtIcon, Space } from 'suid';
import styles from './index.less';

const defaultAppIcon = '';
const { Meta } = Card;

@connect(({ ocrService, loading }) => ({ ocrService, loading }))
class OcrService extends Component {
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
        modalVisible: true,
        editData: null,
      },
    });
  };

  edit = editData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ocrService/updateState',
      payload: {
        modalVisible: true,
        editData,
      },
    });
  };

  handleSave = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ocrService/save',
      payload: data,
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'ocrService/updateState',
            payload: {
              modalVisible: false,
            },
          });
          this.reloadData();
        }
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
      ocrService: { serviceData },
    } = this.props;
    return (
      <div className={cls(styles['container-box'])}>
        <ScrollBar>
          <div className="service-box">
            {serviceData.map(d => {
              return (
                <Card
                  style={{ width: 300 }}
                  className="service-item"
                  cover={<img alt="LOGO" src={get(d, 'icon') || defaultAppIcon} />}
                >
                  <Meta title={get(d, 'name')} description={get(d, 'remark')} />
                </Card>
              );
            })}
            <div className="service-item trigger-blank">
              <Space direction="vertical">
                <ExtIcon type="plus" antd />
                <span className="blank-text">新建OCR服务</span>
              </Space>
            </div>
          </div>
        </ScrollBar>
      </div>
    );
  }
}

export default OcrService;
