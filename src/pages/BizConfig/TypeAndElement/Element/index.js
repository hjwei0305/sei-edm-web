import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { get } from 'lodash';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Drawer, Popconfirm } from 'antd';
import { ExtTable, ExtIcon, Space } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { SERVER_PATH } = constants;

@connect(({ typeElement, loading }) => ({ typeElement, loading }))
class TypeItemElement extends Component {
  static tableRef;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      delRowId: null,
    };
  }

  componentDidMount() {
    const { onTypeItemElementRef } = this.props;
    if (onTypeItemElementRef) {
      onTypeItemElementRef(this);
    }
  }

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handlerSelectRow = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };

  handlerClearSelect = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'typeElement/updateState',
      payload: {
        showElementFormModal: true,
        currentTypeItemElelemnt: null,
      },
    });
  };

  edit = currentTypeItemElelemnt => {
    const { dispatch } = this.props;
    dispatch({
      type: 'typeElement/updateState',
      payload: {
        showElementFormModal: true,
        currentTypeItemElelemnt,
      },
    });
  };

  save = data => {
    const { dispatch, typeElement, selectedBizType } = this.props;
    const { currentTypeItemElelemnt } = typeElement;
    let action = 'addElement';
    if (currentTypeItemElelemnt) {
      action = 'updateElement';
    }
    dispatch({
      type: `typeElement/${action}`,
      payload: {
        bizTypeId: get(selectedBizType, 'id'),
        ...data,
      },
      callback: res => {
        if (res.success) {
          this.closeFormModal();
          this.reloadData();
        }
      },
    });
  };

  del = record => {
    const { dispatch } = this.props;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'typeElement/delElement',
          payload: [record.id],
          callback: res => {
            if (res.success) {
              this.setState({
                delRowId: null,
              });
              this.reloadData();
            }
          },
        });
      },
    );
  };

  delBatch = () => {
    const { selectedRowKeys } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'typeElement/delElement',
      payload: selectedRowKeys,
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
      type: 'typeElement/updateState',
      payload: {
        showElementFormModal: false,
        currentTypeItemElelemnt: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['typeElement/delElement'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return (
      <Popconfirm
        placement="topLeft"
        title={formatMessage({
          id: 'global.delete.confirm',
          defaultMessage: '确定要删除吗？提示：删除后不可恢复',
        })}
        onConfirm={() => this.del(row)}
      >
        <ExtIcon className="del" type="delete" antd />
      </Popconfirm>
    );
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { loading, typeElement, selectedBizType } = this.props;
    const { currentTypeItemElelemnt, showElementFormModal } = typeElement;
    const hasSelected = selectedRowKeys.length > 0;
    const columns = [
      {
        title: '操作',
        key: 'operation',
        width: 100,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        fixed: 'left',
        render: (_text, record) => (
          <span className={cls('action-box')} onClick={e => e.stopPropagation()}>
            <ExtIcon className="edit" onClick={() => this.edit(record)} type="edit" antd />
            {this.renderDelBtn(record)}
          </span>
        ),
      },
      {
        title: '要素名称',
        dataIndex: 'aliasName',
        width: 220,
        required: true,
      },
      {
        title: '要素字段',
        dataIndex: 'fieldName',
        width: 280,
      },
      {
        title: '默认值',
        dataIndex: 'value',
        width: 140,
        render: t => t || '-',
      },
    ];
    const delLoading = loading.effects['typeElement/delElement'];
    const saving =
      loading.effects['typeElement/addElement'] || loading.effects['typeElement/updateElement'];
    const toolBarProps = {
      left: (
        <>
          <Button type="primary" onClick={this.add}>
            新建要素
          </Button>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const extTableProps = {
      bordered: false,
      lineNumber: false,
      toolBar: toolBarProps,
      pagination: false,
      allowCustomColumns: false,
      columns,
      checkbox: {
        rowCheck: false,
      },
      selectedRowKeys,
      onSelectRow: this.handlerSelectRow,
      onTableRef: ref => (this.tableRef = ref),
      searchPlaceHolder: '输入要素名、要素字段关键字',
      searchProperties: ['aliasName', 'fieldName'],
      searchWidth: 260,
    };
    if (selectedBizType) {
      Object.assign(extTableProps, {
        store: {
          url: `${SERVER_PATH}/edm-service/bizType/getBizElements`,
          loaded: () => {
            this.setState({ selectedRowKeys: [] });
          },
        },
        cascadeParams: {
          bizTypeId: get(selectedBizType, 'id'),
        },
      });
    }
    const formModalProps = {
      rowData: currentTypeItemElelemnt,
      closeFormModal: this.closeFormModal,
      showModal: showElementFormModal,
      saving,
      save: this.save,
    };
    return (
      <div className={cls(styles['type-element-box'])}>
        <ExtTable {...extTableProps} />
        <FormModal {...formModalProps} />
        <Drawer
          placement="top"
          closable={false}
          mask={false}
          height={44}
          className={styles['float-tool']}
          getContainer={false}
          style={{ position: 'absolute' }}
          visible={hasSelected}
        >
          <Space>
            <Button onClick={this.handlerClearSelect} disabled={delLoading}>
              取消
            </Button>
            <Popconfirm
              disabled={delLoading}
              title="确定要删除选择的要素吗?"
              onConfirm={() => this.delBatch()}
            >
              <Button type="danger" loading={delLoading}>
                {`删除(${selectedRowKeys.length})`}
              </Button>
            </Popconfirm>
          </Space>
        </Drawer>
      </div>
    );
  }
}

export default TypeItemElement;
