/* eslint-disable no-restricted-syntax */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { isEqual } from 'lodash';
import { parseOfdDocument, renderOfd, digestCheck } from 'ofd.js';
import { ListLoader, ScrollBar, utils, message } from 'suid';
import SealInfo from './SealInfo';
import styles from './index.less';

const { Watermark } = utils;
@connect(({ ofdPreivew, loading }) => ({ ofdPreivew, loading }))
class OfdPreview extends PureComponent {
  static watermark;

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      sealInfo: null,
    };
  }

  componentDidUpdate(prevProps) {
    const {
      ofdPreivew: { fileData, watermark },
    } = this.props;
    if (!isEqual(prevProps.ofdPreivew.fileData, fileData)) {
      this.renderOdfContent();
      if (!this.watermark) {
        this.watermark = new Watermark({
          content: watermark,
        });
      }
      if (!this.watermark.isExist()) {
        this.watermark.get();
      }
    }
  }

  componentWillUnmount() {
    if (this.watermark) {
      this.watermark.remove();
    }
  }

  renderOdfContent = () => {
    const that = this;
    const {
      dispatch,
      ofdPreivew: { fileData, previewId },
    } = this.props;
    dispatch({
      type: 'ofdPreivew/updateState',
      payload: {
        rendering: true,
      },
    });
    parseOfdDocument({
      ofd: fileData,
      success(res) {
        // const x2js = new X2JS();
        // const page = res[0].pages[0];
        // const pageId = Object.keys(page)[0];
        // const { xml } = page[pageId];
        // const jsonData = x2js.xml2js(xml);
        // console.log(jsonData);
        const divs = renderOfd(document.body.clientWidth, res[0]);
        const contentDiv = document.getElementById(previewId);
        contentDiv.innerHTML = '';
        for (const div of divs) {
          contentDiv.appendChild(div);
        }
        that.setSealInfo();
        dispatch({
          type: 'ofdPreivew/updateState',
          payload: {
            rendering: false,
          },
        });
      },
      fail(err) {
        console.log(err);
        dispatch({
          type: 'ofdPreivew/updateState',
          payload: {
            rendering: false,
          },
        });
      },
    });
  };

  setSealInfo = () => {
    for (const ele of document.getElementsByName('seal_img_div')) {
      this.addEventOnSealDiv(
        ele,
        JSON.parse(ele.dataset.sesSignature),
        JSON.parse(ele.dataset.signedInfo),
      );
    }
  };

  addEventOnSealDiv = (div, SES_Signature, signedInfo) => {
    const sealInfo = {};
    try {
      global.hashRet = null;
      global.verifyRet = signedInfo.VerifyRet;
      div.addEventListener('click', () => {
        if (SES_Signature.realVersion < 4) {
          sealInfo.spSigner = SES_Signature.toSign.cert.commonName;
          sealInfo.spProvider = signedInfo.Provider['@_ProviderName'];
          sealInfo.spHashedValue = SES_Signature.toSign.dataHash.replace(/\n/g, '');
          sealInfo.spSignedValue = SES_Signature.signature.replace(/\n/g, '');
          sealInfo.spSignMethod = SES_Signature.toSign.signatureAlgorithm.replace(/\n/g, '');
          sealInfo.spSealID = SES_Signature.toSign.eseal.esealInfo.esID;
          sealInfo.spSealName = SES_Signature.toSign.eseal.esealInfo.property.name;
          sealInfo.spSealType = SES_Signature.toSign.eseal.esealInfo.property.type;
          sealInfo.spSealAuthTimeValidStart =
            SES_Signature.toSign.eseal.esealInfo.property.validStart;
          sealInfo.spSealAuthTimeValidEnd = SES_Signature.toSign.eseal.esealInfo.property.validEnd;
          sealInfo.spSealMakeTime = SES_Signature.toSign.eseal.esealInfo.property.createDate;
          sealInfo.spSealVersion = SES_Signature.toSign.eseal.esealInfo.header.version;
        } else {
          sealInfo.spSigner = SES_Signature.cert.commonName;
          sealInfo.spProvider = signedInfo.Provider['@_ProviderName'];
          sealInfo.spHashedValue = SES_Signature.toSign.dataHash.replace(/\n/g, '');
          sealInfo.spSignedValue = SES_Signature.signature.replace(/\n/g, '');
          sealInfo.spSignMethod = SES_Signature.signatureAlgID.replace(/\n/g, '');
          sealInfo.spSealID = SES_Signature.toSign.eseal.esealInfo.esID;
          sealInfo.spSealName = SES_Signature.toSign.eseal.esealInfo.property.name;
          sealInfo.spSealType = SES_Signature.toSign.eseal.esealInfo.property.type;
          sealInfo.spSealAuthTimeValidStart =
            SES_Signature.toSign.eseal.esealInfo.property.validStart;
          sealInfo.spSealAuthTimeValidEnd = SES_Signature.toSign.eseal.esealInfo.property.validEnd;
          sealInfo.spSealMakeTime = SES_Signature.toSign.eseal.esealInfo.property.createDate;
          sealInfo.spSealVersion = SES_Signature.toSign.eseal.esealInfo.header.version;
        }
        sealInfo.spVersion = SES_Signature.toSign.version;
        sealInfo.message = '验证中，请稍候... ';
        sealInfo.verifyDone = false;
        if (
          global.hashRet === null ||
          global.hashRet === undefined ||
          Object.keys(global.hashRet).length <= 0
        ) {
          setTimeout(() => {
            const signRetStr = global.verifyRet ? '签名值验证成功' : '签名值验证失败';
            global.hashRet = digestCheck(global.toBeChecked.get(signedInfo.signatureID));
            const hashRetStr = global.hashRet ? '文件摘要值验证成功' : '文件摘要值验证失败';
            sealInfo.verifyDone = true;
            sealInfo.message = `${hashRetStr} ${signRetStr}`;
            const sealInfoDone = {};
            Object.assign(sealInfoDone, sealInfo, {
              hashRet: global.hashRet,
              verifyRet: global.verifyRet,
            });
            this.setState({ sealInfo: sealInfoDone });
          }, 1000);
        }
        Object.assign(sealInfo, { hashRet: global.hashRet, verifyRet: global.verifyRet });
        this.setState({ sealInfo, showModal: true });
      });
    } catch (e) {
      console.log(e);
    }
    if (!global.verifyRet) {
      message.destroy();
      message.error('签章信息验证异常');
    }
  };

  handlerCloseModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const {
      loading,
      ofdPreivew: { rendering, previewId },
    } = this.props;
    const { showModal, sealInfo } = this.state;
    const sealInfoProps = {
      showModal,
      sealInfo,
      closeModal: this.handlerCloseModal,
    };
    return (
      <div className={styles['ofd-preview-box']}>
        {loading.global || rendering ? (
          <ListLoader style={{ position: 'absolute', height: '50%' }} />
        ) : null}
        <ScrollBar>
          <div id={previewId} className="ofd-content" />
        </ScrollBar>
        <SealInfo {...sealInfoProps} />
      </div>
    );
  }
}

export default OfdPreview;
