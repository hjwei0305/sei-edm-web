/* eslint-disable no-restricted-syntax */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { isEqual } from 'lodash';
import { parseOfdDocument, renderOfd } from 'ofd.js';
import { ListLoader, ScrollBar } from 'suid';
import styles from './index.less';

@connect(({ ofdPreivew, loading }) => ({ ofdPreivew, loading }))
class OfdPreview extends PureComponent {
  componentDidUpdate(prevProps) {
    const {
      ofdPreivew: { fileData },
    } = this.props;
    if (!isEqual(prevProps.ofdPreivew.fileData, fileData)) {
      this.renderOdfContent();
    }
  }

  renderOdfContent = () => {
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
        const divs = renderOfd(document.body.clientWidth, res[0]);
        const contentDiv = document.getElementById(previewId);
        contentDiv.innerHTML = '';
        for (const div of divs) {
          contentDiv.appendChild(div);
        }
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

  render() {
    const {
      loading,
      ofdPreivew: { rendering, previewId },
    } = this.props;
    return (
      <div className={styles['ofd-preview-box']}>
        {loading.global || rendering ? (
          <ListLoader style={{ position: 'absolute', height: '50%' }} />
        ) : null}
        <ScrollBar>
          <div id={previewId} className="ofd-content" />
        </ScrollBar>
      </div>
    );
  }
}

export default OfdPreview;
