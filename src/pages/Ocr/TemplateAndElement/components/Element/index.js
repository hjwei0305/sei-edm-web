import React, { useCallback } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Card } from 'antd';
import { ExtTable, BannerTitle, ExtIcon } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { SERVER_PATH } = constants;

let tableRef;

const Element = props => {
  const { template, onEditElement = () => {}, onSave = () => {}, ...rest } = props;

  const reloadData = useCallback(() => {
    if (tableRef) {
      tableRef.remoteDataRefresh();
    }
  }, []);

  const edit = useCallback(
    element => {
      onEditElement(element);
    },
    [onEditElement],
  );

  const getTableProps = useCallback(() => {
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 80,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (text, record) => (
          <span className={cls('action-box')}>
            <ExtIcon className="edit" onClick={() => edit(record)} type="edit" antd />
          </span>
        ),
      },
      {
        title: '要素名称',
        dataIndex: 'name',
        width: 180,
        required: true,
      },
      {
        title: '映射字段名',
        dataIndex: 'fieldName',
        width: 220,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <>
          <Button onClick={reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const tableProps = {
      bordered: false,
      toolBar: toolBarProps,
      lineNumber: false,
      columns,
      allowCustomColumns: false,
      onTableRef: ref => (tableRef = ref),
      searchPlaceHolder: '输入要素名称、映射字段名关键字',
      searchProperties: ['name', 'fieldName'],
      searchWidth: 260,
      store: {
        url: `${SERVER_PATH}/edm-service/ocrTemplate/getElementsByTempId`,
      },
      cascadeParams: {
        tempId: get(template, 'id'),
      },
    };
    return tableProps;
  }, [edit, reloadData, template]);

  const handlerSave = useCallback(
    data => {
      onSave(data, reloadData);
    },
    [onSave, reloadData],
  );

  return (
    <div className={cls(styles['user-box'])}>
      <Card
        title={<BannerTitle title={get(template, 'name')} subTitle="模板要素" />}
        bordered={false}
      >
        <ExtTable {...getTableProps()} />
      </Card>
      <FormModal onSave={handlerSave} {...rest} />
    </div>
  );
};

export default Element;
