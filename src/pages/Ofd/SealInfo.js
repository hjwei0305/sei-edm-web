import React, { Component } from 'react';
import { get } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Descriptions, Alert, Button, Result } from 'antd';
import { ExtModal, ListLoader } from 'suid';

const invalidText = '[无效的签章结构]';
class SealInfo extends Component {
  static propTypes = {
    showModal: PropTypes.bool,
    closeModal: PropTypes.func,
    sealInfo: PropTypes.object,
  };

  static defaultProps = {
    showModal: false,
  };

  getSealInfo = fieldName => {
    const { sealInfo } = this.props;
    return get(sealInfo, fieldName);
  };

  renderFooterBtn = () => {
    const { closeModal, sealInfo } = this.props;
    if (sealInfo && sealInfo.verifyDone) {
      return (
        <Button type="primary" onClick={closeModal}>
          知道了
        </Button>
      );
    }
    return null;
  };

  render() {
    const { showModal, closeModal, sealInfo } = this.props;
    const modalProps = {
      destroyOnClose: true,
      onCancel: closeModal,
      visible: showModal,
      bodyStyle: { padding: 0 },
      centered: true,
      width: 620,
      zIndex: 10000000,
      footer: this.renderFooterBtn(),
      title: '签章与印章信息',
    };
    const spSealMakeTime = this.getSealInfo('spSealMakeTime');
    const spSealAuthTimeValidStart = this.getSealInfo('spSealAuthTimeValidStart');
    const spSealAuthTimeValidEnd = this.getSealInfo('spSealAuthTimeValidEnd');
    return (
      <ExtModal {...modalProps}>
        {sealInfo && sealInfo.verifyDone ? (
          <>
            <Alert
              message={
                sealInfo && sealInfo.hashRet && sealInfo.verifyRet
                  ? '发票签章有效'
                  : '发票签章信息异常'
              }
              description={this.getSealInfo('message')}
              type={sealInfo && sealInfo.hashRet && sealInfo.verifyRet ? 'success' : 'error'}
              showIcon
              banner
            />
            <Descriptions title="签章信息" style={{ margin: 16 }} column={1}>
              <Descriptions.Item label="签章人">
                {this.getSealInfo('spSigner') || invalidText}
              </Descriptions.Item>
              <Descriptions.Item label="签章提供者">
                {this.getSealInfo('spProvider') || invalidText}
              </Descriptions.Item>
              <Descriptions.Item label="签章时间">
                {spSealMakeTime
                  ? moment(spSealMakeTime).format('YYYY-MM-DD HH:mm:ss')
                  : invalidText}
              </Descriptions.Item>
              <Descriptions.Item label="签名算法">
                {this.getSealInfo('spSignMethod') || invalidText}
              </Descriptions.Item>
            </Descriptions>
            <Descriptions title="印章信息" style={{ margin: 16 }} column={1}>
              <Descriptions.Item label="印章标识">
                {this.getSealInfo('spSealID') || invalidText}
              </Descriptions.Item>
              <Descriptions.Item label="印章名称">
                {this.getSealInfo('spSealName') || invalidText}
              </Descriptions.Item>
              <Descriptions.Item label="印章类型">
                {this.getSealInfo('spSealType') || invalidText}
              </Descriptions.Item>
              <Descriptions.Item label="有效起止时间">{`${
                spSealAuthTimeValidStart
                  ? moment(spSealAuthTimeValidStart).format('YYYY-MM-DD HH:mm:ss')
                  : invalidText
              } ~ ${
                spSealAuthTimeValidEnd
                  ? moment(spSealAuthTimeValidEnd).format('YYYY-MM-DD HH:mm:ss')
                  : invalidText
              }`}</Descriptions.Item>
              <Descriptions.Item label="印章版本">
                {this.getSealInfo('spSealVersion') || invalidText}
              </Descriptions.Item>
            </Descriptions>
          </>
        ) : (
          <Result icon={<ListLoader />} title={this.getSealInfo('message')} />
        )}
      </ExtModal>
    );
  }
}

export default SealInfo;
