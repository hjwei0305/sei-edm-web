import React, { useCallback, useEffect, useState } from 'react';
import cls from 'classnames';
import { get, differenceBy } from 'lodash';
import { Button, Input, Drawer } from 'antd';
import { ListCard } from 'suid';
import styles from './UnAssignOcrTemplate.less';

const { Search } = Input;
const FC = () => {};
let listCardRef;

const UnAssignOcrTemplate = props => {
  const {
    selectedBizType,
    showAssign = false,
    closeAssign = FC,
    assign = FC,
    assignLoading = false,
    allOcrTemplateData = [],
    assignedOcrTemplateData = [],
  } = props;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [unAssignedOcrTemplateData, setUnAssignedOcrTemplateData] = useState([]);

  const clearSelected = useCallback(() => {
    setSelectedRowKeys([]);
  }, []);

  useEffect(() => {
    return clearSelected;
  }, [clearSelected]);

  useEffect(() => {
    if (showAssign) {
      const data = differenceBy(allOcrTemplateData, assignedOcrTemplateData, 'templateType');
      setUnAssignedOcrTemplateData(data);
    }
  }, [allOcrTemplateData, assignedOcrTemplateData, showAssign]);

  const handlerAssign = useCallback(() => {
    const data = {
      bizTypeId: get(selectedBizType, 'id'),
      types: selectedRowKeys,
    };
    assign(data);
  }, [assign, selectedBizType, selectedRowKeys]);

  const handlerClose = useCallback(() => {
    closeAssign();
    clearSelected();
  }, [clearSelected, closeAssign]);

  const handlerSelectRow = useCallback(selRowKeys => {
    setSelectedRowKeys(selRowKeys);
  }, []);

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
        <Button
          type="primary"
          onClick={handlerAssign}
          loading={assignLoading}
          disabled={selectedRowKeys.length === 0}
        >
          {`确定(${selectedRowKeys.length})`}
        </Button>
        <Search
          placeholder="输入代码、名称关键字查询"
          onChange={e => handlerSearchChange(e.target.value)}
          onSearch={handlerSearch}
          onPressEnter={handlerPressEnter}
          style={{ width: 240 }}
        />
      </>
    );
  }, [
    assignLoading,
    handlerAssign,
    handlerPressEnter,
    handlerSearch,
    handlerSearchChange,
    selectedRowKeys,
  ]);

  const getListCardProps = useCallback(() => {
    const listCardProps = {
      showSearch: false,
      onSelectChange: handlerSelectRow,
      checkbox: true,
      rowKey: 'code',
      showArrow: false,
      dataSource: unAssignedOcrTemplateData,
      itemField: {
        title: item => item.name,
        description: item => item.code,
      },
      onListCardRef: ref => (listCardRef = ref),
      customTool: renderCustomTool,
    };
    return listCardProps;
  }, [handlerSelectRow, renderCustomTool, unAssignedOcrTemplateData]);

  return (
    <Drawer
      width={460}
      destroyOnClose
      getContainer={false}
      placement="right"
      visible={showAssign}
      title="分配OCR模板"
      className={cls(styles['unassign-box'])}
      onClose={handlerClose}
      style={{ position: 'absolute' }}
    >
      <ListCard {...getListCardProps()} />
    </Drawer>
  );
};

export default UnAssignOcrTemplate;
