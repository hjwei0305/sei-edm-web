import React, { useCallback, useMemo, useState } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { Dropdown, Input, Button, Tooltip } from 'antd';
import { ListCard, ExtIcon } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { Search } = Input;
const { SERVER_PATH } = constants;
let listCardRef;

const MatchRule = ({ ocrTemplate, onAction = () => {} }) => {
  const [show, setShow] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([get(ocrTemplate, 'ruleCode')]);

  const handlerVisibleChange = useCallback(visible => {
    setShow(visible);
  }, []);

  const handlerSelectRow = useCallback(
    keys => {
      const [ruleCode] = keys;
      setSelectedKeys([ruleCode]);
      const data = {
        id: get(ocrTemplate, 'id'),
        ruleCode,
      };
      onAction(data);
      setSelectedKeys([]);
      setShow(false);
    },
    [ocrTemplate, onAction],
  );

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
      const ruleCode = get(ocrTemplate, 'ruleCode');
      return (
        <ExtIcon
          className={cls('tag', { actived: item.code === ruleCode })}
          type="check-square"
          antd
        />
      );
    },
    [ocrTemplate],
  );

  const renderListContent = useMemo(() => {
    const listProps = {
      title: '匹配规则',
      showSearch: false,
      onSelectChange: handlerSelectRow,
      rowKey: 'code',
      selectedKeys,
      className: styles['float-ocr-template-rule-box'],
      showArrow: false,
      pagination: false,
      itemField: {
        avatar: renderTag,
        title: item => item.name,
        description: item => item.code,
      },
      store: {
        url: `${SERVER_PATH}/edm-service/bizRule/findRules`,
        params: { ruleType: 'MATCH' },
      },
      cascadeParams: {
        template: get(ocrTemplate, 'templateType'),
      },
      onListCardRef: ref => (listCardRef = ref),
      customTool: renderCustomTool,
    };
    return <ListCard {...listProps} />;
  }, [handlerSelectRow, selectedKeys, renderTag, ocrTemplate, renderCustomTool]);

  const getTitle = useMemo(() => {
    const ruleName = get(ocrTemplate, 'ruleName');
    if (ruleName) {
      return (
        <Tooltip title="匹配规则设置">
          <Button type="link" size="small">
            {ruleName}
          </Button>
        </Tooltip>
      );
    }
    return '规则设置';
  }, [ocrTemplate]);

  return (
    <Dropdown
      onVisibleChange={handlerVisibleChange}
      visible={show}
      overlay={renderListContent}
      trigger={['click']}
    >
      <span className={cls(styles['view-box'])}>
        <span className="view-content" title={get(ocrTemplate, 'ruleCode') || ''}>
          {getTitle}
        </span>
        <ExtIcon type="down" antd />
      </span>
    </Dropdown>
  );
};
export default MatchRule;
