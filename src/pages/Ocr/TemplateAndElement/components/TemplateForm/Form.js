import React, { useCallback, useMemo, useState, useEffect } from 'react';
import cls from 'classnames';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { get, differenceBy } from 'lodash';
import { Button, Form, Input, Switch, Empty } from 'antd';
import { BannerTitle, ListCard, message } from 'suid';
import { constants } from '@/utils';
import empty from '@/assets/no_data.svg';
import styles from './Form.less';

const { OCR_TEMPLATE_TYPE, OCR_TEMPLATE_ACTION } = constants;
const templateTypeData = Object.keys(OCR_TEMPLATE_TYPE).map(key => OCR_TEMPLATE_TYPE[key]);
const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

let selectTemplateTypes = [];

const TemplateForm = props => {
  const {
    form,
    templateData = [],
    rowData,
    save = () => {},
    handlerPopoverHide = () => {},
    saving = false,
    action,
  } = props;

  const [typeData, setTypeData] = useState(templateTypeData);

  useEffect(() => {
    if (templateData.length > 0) {
      const ds = differenceBy(templateTypeData, templateData, 'type');
      setTypeData(ds);
    }
  }, [templateData]);

  const handlerFormSubmit = useCallback(() => {
    const { validateFields, getFieldsValue } = form;
    validateFields(errors => {
      if (errors) {
        return false;
      }
      if (action === OCR_TEMPLATE_ACTION.ADD) {
        if (selectTemplateTypes.length === 0) {
          message.destroy();
          message.warning('请选择OCR模板类型');
        }
        save(selectTemplateTypes, handlerPopoverHide);
      } else {
        const params = {};
        Object.assign(params, rowData || {});
        Object.assign(params, getFieldsValue());
        save(params, handlerPopoverHide);
      }
    });
  }, [action, form, handlerPopoverHide, rowData, save]);

  const handlerSelectChange = useCallback(keys => {
    selectTemplateTypes = keys;
  }, []);

  const renderFormContent = useMemo(() => {
    const { getFieldDecorator } = form;
    if (action === OCR_TEMPLATE_ACTION.ADD) {
      if (typeData.length === 0) {
        return (
          <Empty
            key="data-empty"
            className="data-empty"
            image={empty}
            description="暂无可添加OCR模板类型"
          />
        );
      }
      const listProps = {
        checkbox: true,
        dataSource: typeData,
        pagination: false,
        showArrow: false,
        showSearch: false,
        rowKey: 'type',
        onSelectChange: handlerSelectChange,
        itemField: {
          title: item => item.title,
          description: item => item.desc,
        },
      };
      return (
        <>
          <ListCard {...listProps} />
          <div className="footer-box">
            <Button type="primary" loading={saving} onClick={handlerFormSubmit}>
              确定
            </Button>
          </div>
        </>
      );
    }
    if (action === OCR_TEMPLATE_ACTION.UPDATE) {
      return (
        <Form {...formItemLayout}>
          <FormItem label="模板名称">
            {getFieldDecorator('name', {
              initialValue: get(rowData, 'name'),
              rules: [
                {
                  required: true,
                  message: '模板名称不能为空',
                },
              ],
            })(<Input autoComplete="off" />)}
          </FormItem>
          <FormItem label="备注说明" style={{ marginBottom: 4 }}>
            {getFieldDecorator('remark', {
              initialValue: get(rowData, 'remark'),
            })(<TextArea rows={4} style={{ resize: 'none' }} />)}
          </FormItem>
          <FormItem label="停用" style={{ marginBottom: 4 }}>
            {getFieldDecorator('roll', {
              initialValue: get(rowData, 'roll') || false,
              valuePropName: 'checked',
            })(<Switch size="small" />)}
          </FormItem>
          <FormItem wrapperCol={{ span: 4 }} className="btn-submit" style={{ marginBottom: 0 }}>
            <Button type="primary" loading={saving} onClick={handlerFormSubmit}>
              <FormattedMessage id="global.save" defaultMessage="保存" />
            </Button>
          </FormItem>
        </Form>
      );
    }
  }, [action, form, handlerFormSubmit, handlerSelectChange, rowData, saving, typeData]);

  let title = '新建';
  if (action === OCR_TEMPLATE_ACTION.UPDATE) {
    title = `${get(rowData, 'name')}`;
  }
  return (
    <div key="form-box" className={cls(styles['form-box'])}>
      <div className="base-view-body">
        <div className="header">
          <BannerTitle title={title} subTitle="OCR模板编辑" />
        </div>
        {renderFormContent}
      </div>
    </div>
  );
};

export default Form.create()(TemplateForm);
