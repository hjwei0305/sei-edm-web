import React from 'react';
import { get } from 'lodash';
import { Tabs, Card } from 'antd';
import { BannerTitle } from 'suid';
import TypeItemElement from './Element';
import OcrTemplate from './OcrTemplate';
import styles from './Config.less';

const { TabPane } = Tabs;

const Config = ({ selectedBizType, currentTabKey, onTabChange, onTypeItemElementRef }) => {
  const renderTitle = () => {
    return (
      <>
        <BannerTitle title={get(selectedBizType, 'name')} subTitle="配置" />
      </>
    );
  };

  return (
    <Card className={styles['view-box']} bordered={false} title={renderTitle()}>
      <Tabs type="card" activeKey={currentTabKey} onChange={onTabChange} animated={false}>
        <TabPane tab="业务类型要素" key="typeElement" forceRender>
          <TypeItemElement
            onTypeItemElementRef={onTypeItemElementRef}
            selectedBizType={selectedBizType}
          />
        </TabPane>
        <TabPane tab="OCR识别模板" key="ocrTemplate">
          <OcrTemplate selectedBizType={selectedBizType} />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Config;
