import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { get } from 'lodash';
import { utils, SkeletonContent, ExtTable, Space } from 'suid';
import { constants } from '@/utils';
import EditCell from './EditCell';
import styles from './index.less';

const { request } = utils;
const { SERVER_PATH } = constants;

const ElementMap = props => {
  const { ocrTemplate } = props;

  const [dealId, setDealId] = useState();
  const [loading, setLoading] = useState(false);
  const [mapSaving, setMapSaving] = useState(false);
  const [ruleSaving, setRuleSaving] = useState(false);
  const [elementData, setElementData] = useState([]);

  const getMapData = useCallback(() => {
    const typeTempId = get(ocrTemplate, 'id');
    setLoading(true);
    request({
      url: `${SERVER_PATH}/edm-service/bizTypeTemplate/findByTypeTempId`,
      params: { typeTempId },
    })
      .then(res => {
        if (res.success) {
          setElementData(res.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ocrTemplate]);

  useEffect(() => {
    getMapData();
  }, [getMapData]);

  const updateLocalData = useCallback(
    nr => {
      const tbData = [...elementData];
      for (let i = 0; i < tbData.length; i += 1) {
        const row = tbData[i];
        if (row.id === nr.id) {
          Object.assign(row, nr);
        }
      }
      setElementData(tbData);
    },
    [elementData],
  );

  const handlerSaveRule = useCallback(
    (it, row, callback = () => {}) => {
      const rowId = get(row, 'id');
      setRuleSaving(true);
      setDealId(rowId);
      const ruleCode = get(it, 'code') || '';
      request({
        method: 'POST',
        url: `${SERVER_PATH}/edm-service/bizTypeTemplate/setValueRule/${rowId}`,
        params: { ruleCode },
      })
        .then(res => {
          if (res.success) {
            callback();
            updateLocalData(res.data);
          }
        })
        .finally(() => {
          setRuleSaving(false);
        });
    },
    [updateLocalData],
  );

  const handlerSaveFieldMap = useCallback(
    (it, row, callback = () => {}) => {
      const rowId = get(row, 'id');
      setMapSaving(true);
      setDealId(rowId);
      const fieldName = get(it, 'fieldName') || '';
      request({
        method: 'POST',
        url: `${SERVER_PATH}/edm-service/bizTypeTemplate/addMapping/${rowId}`,
        params: { fieldName },
      })
        .then(res => {
          if (res.success) {
            callback();
            updateLocalData(res.data);
          }
        })
        .finally(() => {
          setMapSaving(false);
        });
    },
    [updateLocalData],
  );

  const getExtTableProps = useCallback(() => {
    const columns = [
      {
        title: '业务要素',
        dataIndex: 'name',
        width: 240,
        required: true,
        className: 'padding-zero',
        render: (t, r) => {
          return (
            <Space direction="vertical" size={0}>
              {t}
              <span style={{ fontSize: 12, color: '#999' }}>{r.fieldName}</span>
            </Space>
          );
        },
      },
      {
        title: '模板要素',
        dataIndex: 'mappingName',
        width: 280,
        className: 'padding-zero',
        render: (t, r) => {
          return (
            <EditCell
              labelTitle="要素设置"
              store={{
                url: `${SERVER_PATH}/edm-service/ocrTemplate/getElementsByType`,
                autoLoad: true,
                params: {
                  type: r.templateType,
                },
              }}
              dealId={dealId}
              rowKey="fieldName"
              rowData={r}
              displayName={t}
              displayCode={r.mappingField}
              onSave={handlerSaveFieldMap}
              saving={mapSaving}
              reader={{
                name: 'name',
                description: 'fieldName',
              }}
            />
          );
        },
      },
      {
        title: '取值规则',
        dataIndex: 'ruleName',
        width: 220,
        className: 'padding-zero',
        render: (t, r) => {
          return (
            <EditCell
              labelTitle="取值规则设置"
              store={{
                url: `${SERVER_PATH}/edm-service/bizRule/findRules`,
                autoLoad: true,
                params: {
                  ruleType: 'VALUE',
                  template: r.templateType,
                },
              }}
              dealId={dealId}
              rowKey="code"
              rowData={r}
              displayName={t}
              displayCode={r.ruleCode}
              onSave={handlerSaveRule}
              saving={ruleSaving}
              reader={{
                name: 'name',
                description: 'code',
              }}
            />
          );
        },
      },
      {
        title: '默认值',
        dataIndex: 'defaultValue',
        width: 120,
        render: t => {
          return t || '-';
        },
      },
    ];
    const tbProps = {
      bordered: false,
      lineNumber: false,
      pagination: false,
      showSearch: false,
      fixedHeader: false,
      allowCustomColumns: false,
      columns,
      dataSource: elementData,
    };
    return tbProps;
  }, [dealId, elementData, handlerSaveFieldMap, handlerSaveRule, mapSaving, ruleSaving]);

  const renderContent = useMemo(() => {
    if (loading) {
      return (
        <SkeletonContent viewBox="0 0 100% 96" height={96}>
          <rect x="0" y="14" rx="3" ry="3" width="154" height="24" />
          <rect x="0" y="46" rx="3" ry="3" width="344" height="17" />
          <rect x="0" y="70" rx="3" ry="3" width="229" height="17" />
        </SkeletonContent>
      );
    }
    return <ExtTable {...getExtTableProps()} />;
  }, [getExtTableProps, loading]);

  return <div className={styles['element-map-box']}>{renderContent}</div>;
};

export default ElementMap;
