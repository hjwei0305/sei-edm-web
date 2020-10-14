import React, { PureComponent } from 'react';
import { get, split, isString, isArray, findIndex } from 'lodash';
import { connect } from 'dva';
import cls from 'classnames';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import withRouter from 'umi/withRouter';
import { Layout, Button, Tooltip } from 'antd';
import { HottedKey, ListCard, ScrollBar, ExtIcon, PageLoader, utils, ListLoader } from 'suid';
import { constants } from '@/utils';
import getAvatar from './FileIcon';
import styles from './index.less';

const { formatMsg } = utils;
const { SERVER_PATH } = constants;
const { Content, Footer, Sider } = Layout;
const { GlobalHotKeys, ObserveKeys } = HottedKey;

@withRouter
@connect(({ documentPreivew, loading }) => ({ documentPreivew, loading }))
class Preivew extends PureComponent {
  componentDidMount() {
    const { location, dispatch } = this.props;
    const { entityId, docIds: ids, watermark = '', currentFileId = '' } =
      get(location, 'query') || {};
    if (entityId) {
      dispatch({
        type: 'documentPreivew/getEntityDocuments',
        payload: {
          entityId,
          watermark,
          currentFileId,
        },
      });
    } else if (ids) {
      let docIds = [];
      if (isString(ids)) {
        docIds = split(ids, ',');
      }
      if (isArray(ids)) {
        docIds = [...ids];
      }
      dispatch({
        type: 'documentPreivew/getDocuments',
        payload: {
          docIds,
          watermark,
          currentFileId,
        },
      });
    }
  }

  handlerPrevFile = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'documentPreivew/handlerPrevFile',
    });
  };

  handlerNextFile = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'documentPreivew/handlerNextFile',
    });
  };

  getFileUrl = () => {
    const { documentPreivew } = this.props;
    const { watermark, currentFile } = documentPreivew;
    let url = '';
    if (currentFile) {
      url = `${SERVER_PATH}/edm-service/preview?docId=${get(
        currentFile,
        'id',
      )}&markText=${watermark}`;
    }
    return url;
  };

  handlerListCollapsed = () => {
    const { dispatch, documentPreivew } = this.props;
    const { collapsed } = documentPreivew;
    dispatch({
      type: 'documentPreivew/updateState',
      payload: {
        collapsed: !collapsed,
      },
    });
  };

  handlerCollapsed = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'documentPreivew/updateState',
      payload: {
        collapsed,
      },
    });
  };

  handlerFileSelectChange = (_, items) => {
    const { dispatch, documentPreivew } = this.props;
    const { fileList, fileTotalCount } = documentPreivew;
    const currentFile = items[0];
    const currentIndex = findIndex(fileList, file => file.id === currentFile.id);
    const prevButtonDisabled = currentIndex <= 0;
    const nextButtonDisabled = currentIndex >= fileTotalCount - 1;
    dispatch({
      type: 'documentPreivew/updateState',
      payload: {
        fileLoading: true,
        currentFile,
        currentFileIndex: currentIndex,
        prevButtonDisabled,
        nextButtonDisabled,
      },
    });
  };

  renderCustomTool = ({ total }) => {
    const { documentPreivew } = this.props;
    const { collapsed } = documentPreivew;
    const totalLocale = formatMessage({ id: 'preview.total', defaultMessage: '共 {total} 项' });
    const toggleLeft = formatMessage({
      id: 'preview.toggleLeft',
      defaultMessage: '按C键快速收起与展开',
    });
    return (
      <>
        {!collapsed ? (
          <span style={{ marginLeft: 8 }}>{formatMsg(totalLocale, { total })}</span>
        ) : null}
        <ExtIcon
          className="collapse"
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          style={{ fontSize: 18 }}
          onClick={this.handlerListCollapsed}
          tooltip={{ title: toggleLeft }}
          antd
        />
      </>
    );
  };

  renderItemAvatar = ({ item }) => {
    const { documentPreivew } = this.props;
    const { collapsed } = documentPreivew;
    if (collapsed) {
      return (
        <>
          <Tooltip title={item.name || item.fileName} placement="right">
            {getAvatar(item, 64)}
          </Tooltip>
        </>
      );
    }
    return getAvatar(item, 32);
  };

  renderRank = (_item, index) => {
    const { documentPreivew } = this.props;
    const { collapsed } = documentPreivew;
    let top = 16;
    if (collapsed) {
      top = 32;
    }
    let rank = index + 1;
    if (rank < 10) {
      rank = `0${rank}`;
    }
    return <div style={{ position: 'absolute', left: 2, top, color: '#999' }}>{rank}</div>;
  };

  handlerLoaded = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'documentPreivew/updateState',
      payload: {
        fileLoading: false,
      },
    });
  };

  render() {
    const globalKeyMap = {
      TOGGLE_COLLAPSE: 'c',
      PREV_FILE: 'left',
      NEXT_FILE: 'right',
    };
    const globalHandlers = {
      TOGGLE_COLLAPSE: this.handlerListCollapsed,
      PREV_FILE: this.handlerPrevFile,
      NEXT_FILE: this.handlerNextFile,
    };
    const { documentPreivew, loading } = this.props;
    const {
      prevButtonDisabled,
      nextButtonDisabled,
      collapsed,
      fileList,
      currentFile,
      fileLoading,
    } = documentPreivew;
    const selectedKeys = currentFile ? [currentFile.id || ''] : [];
    const fileListProps = {
      dataSource: fileList,
      selectedKeys,
      showSearch: false,
      pagination: false,
      onSelectChange: this.handlerFileSelectChange,
      customTool: this.renderCustomTool,
      itemField: {
        avatar: this.renderItemAvatar,
        title: file => file.name || file.fileName,
        description: file => file.fileSize,
      },
      itemTool: this.renderRank,
    };
    const dataLoading =
      loading.effects['documentPreivew/getEntityDocuments'] ||
      loading.effects['documentPreivew/getDocuments'];
    return (
      <div>
        {dataLoading ? (
          <PageLoader />
        ) : (
          <>
            <GlobalHotKeys keyMap={globalKeyMap} handlers={globalHandlers} />
            <Layout className={cls(styles['file-preview-box'])}>
              <Sider
                theme="light"
                width={360}
                collapsed={collapsed}
                className="file-preview-list"
                collapsedWidth={110}
                collapsible
                trigger={null}
                onCollapse={this.handlerCollapsed}
              >
                <ListCard {...fileListProps} />
              </Sider>
              <Content className="preview-content-wrap">
                <Layout className="preview-content-box">
                  <Content className="preview-content">
                    <ObserveKeys except={['left', 'right']}>
                      <ScrollBar>
                        {fileLoading ? (
                          <ListLoader style={{ position: 'absolute', height: '50%' }} />
                        ) : null}
                        <iframe
                          title="preview"
                          scrolling="no"
                          height="100%"
                          width="100%"
                          src={this.getFileUrl() || '#'}
                          onLoad={this.handlerLoaded}
                          frameBorder="0"
                        />
                      </ScrollBar>
                    </ObserveKeys>
                  </Content>
                  <Footer className="file-preview-foot-bar">
                    <div className="file-title">
                      {currentFile ? currentFile.name || currentFile.fileName : ''}
                    </div>
                    <Button
                      className="btn-item"
                      disabled={prevButtonDisabled}
                      size="large"
                      onClick={this.handlerPrevFile}
                    >
                      <ExtIcon type="left" antd />
                      <FormattedMessage id="preview.prevItem" defaultMessage="上一项" />
                    </Button>
                    <Button
                      className="btn-item"
                      disabled={nextButtonDisabled}
                      size="large"
                      onClick={this.handlerNextFile}
                    >
                      <FormattedMessage id="preview.nextItem" defaultMessage="下一项" />
                      <ExtIcon type="right" antd />
                    </Button>
                  </Footer>
                </Layout>
              </Content>
            </Layout>
          </>
        )}
      </div>
    );
  }
}

export default Preivew;
