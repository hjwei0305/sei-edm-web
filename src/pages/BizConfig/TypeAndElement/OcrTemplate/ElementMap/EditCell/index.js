import React, { useCallback, useMemo, useState } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { Dropdown, Input, Tooltip, Button, Popconfirm } from 'antd';
import { ListCard, ExtIcon, Space } from 'suid';
import styles from './index.less';

const { Search } = Input;
let listCardRef;

const MatchRule = props => {
  const {
    labelTitle,
    store,
    rowData,
    displayName,
    displayCode,
    rowKey,
    onSave = () => {},
    dealId,
    saving,
    reader = {
      name: 'name',
      description: 'code',
    },
  } = props;
  const [show, setShow] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([displayCode]);

  const handlerVisibleChange = useCallback(visible => {
    setShow(visible);
  }, []);

  const handlerSelectRow = useCallback(
    (keys, items) => {
      const [key] = keys;
      const [item] = items;
      setSelectedKeys([key]);
      onSave(item, rowData, () => {
        setShow(false);
        setSelectedKeys([]);
      });
    },
    [onSave, rowData],
  );

  const clearSet = useCallback(() => {
    onSave(null, rowData, () => {
      setShow(false);
      setSelectedKeys([]);
    });
  }, [onSave, rowData]);

  const handlerSearchChange = useCallback(v => {
    listCardRef.handlerSearchChange(v);
  }, []);

  const handlerPressEnter = useCallback(() => {
    listCardRef.handlerPressEnter();
  }, []);

  const handlerSearch = useCallback(v => {
    listCardRef.handlerSearch(v);
  }, []);

  const renderCustomTool = useCallback(() => {
    return (
      <>
        <Search
          allowClear
          placeholder="输入代码、名称关键字查询"
          onChange={e => handlerSearchChange(e.target.value)}
          onSearch={handlerSearch}
          onPressEnter={handlerPressEnter}
          style={{ width: '100%' }}
        />
      </>
    );
  }, [handlerPressEnter, handlerSearch, handlerSearchChange]);

  const renderTag = useCallback(
    ({ item }) => {
      return (
        <ExtIcon
          className={cls('tag', { actived: item[reader.description] === displayCode })}
          type="check-square"
          antd
        />
      );
    },
    [displayCode, reader],
  );

  const renderListContent = useMemo(() => {
    const listProps = {
      title: labelTitle,
      showSearch: false,
      pagination: false,
      onSelectChange: handlerSelectRow,
      selectedKeys,
      rowKey,
      className: styles['float-box'],
      showArrow: false,
      itemField: {
        avatar: renderTag,
        title: item => item[reader.name],
        description: item => item[reader.description],
      },
      extra: displayName ? (
        <Popconfirm
          overlayClassName={styles['popconfirm-set']}
          title="确定要清除设置吗?"
          onConfirm={clearSet}
        >
          <Button size="small" type="danger">
            清除设置
          </Button>
        </Popconfirm>
      ) : null,
      store,
      onListCardRef: ref => (listCardRef = ref),
      customTool: renderCustomTool,
    };
    return <ListCard {...listProps} />;
  }, [
    labelTitle,
    handlerSelectRow,
    selectedKeys,
    rowKey,
    renderTag,
    displayName,
    clearSet,
    store,
    renderCustomTool,
    reader.name,
    reader.description,
  ]);

  const renderTitle = useMemo(() => {
    if (saving && dealId === get(rowData, 'id')) {
      return (
        <div className="allow-edit">
          <ExtIcon type="loading" antd spin style={{ marginLeft: 4 }} />
        </div>
      );
    }
    if (displayName) {
      return (
        <div className="cell-item edit horizontal">
          <Space direction="vertical" size={0} className="text">
            {displayName}
            <span style={{ fontSize: 12, color: '#999' }}>{displayCode}</span>
          </Space>
          <ExtIcon type="down" antd />
        </div>
      );
    }
    return (
      <Tooltip title={labelTitle}>
        <div className="cell-item edit horizontal">
          <span style={{ color: '#999' }} className="text">
            -
          </span>
          <ExtIcon type="down" antd />
        </div>
      </Tooltip>
    );
  }, [displayCode, displayName, labelTitle, rowData, dealId, saving]);

  return (
    <Dropdown
      onVisibleChange={handlerVisibleChange}
      visible={show}
      overlay={renderListContent}
      trigger={['click']}
    >
      <div className={cls(styles['view-box'])}>{renderTitle}</div>
    </Dropdown>
  );
};
export default MatchRule;
