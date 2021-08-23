import React, { useCallback, useMemo, useEffect } from 'react';
import cls from 'classnames';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { get } from 'lodash';
import { Button, Form, Input, Switch } from 'antd';
import { BannerTitle, ComboList } from 'suid';
import { constants } from '@/utils';
import styles from './Form.less';

const { SERVER_PATH } = constants;
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

const TemplateForm = props => {
  const { form, rowData, save = () => {}, handlerPopoverHide = () => {}, saving = false } = props;

  useEffect(() => {
    const { getFieldDecorator } = form;
    getFieldDecorator('ruleCode', { initialValue: get(rowData, 'ruleCode') });
  }, [form, rowData]);

  const handlerFormSubmit = useCallback(() => {
    const { validateFields, getFieldsValue } = form;
    validateFields(errors => {
      if (errors) {
        return false;
      }
      const params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, getFieldsValue());
      save(params, handlerPopoverHide);
    });
  }, [form, handlerPopoverHide, rowData, save]);

  const getMatchRoleListProps = useCallback(() => {
    const serviceProviderListProps = {
      form,
      store: {
        url: `${SERVER_PATH}/edm-service/bizRule/getMatchRules`,
      },
      pagination: false,
      name: 'ruleName',
      field: ['ruleCode'],
      reader: {
        name: 'name',
        field: ['code'],
        description: 'remark',
      },
    };
    return serviceProviderListProps;
  }, [form]);

  const renderFormContent = useMemo(() => {
    const { getFieldDecorator } = form;
    return (
      <Form {...formItemLayout}>
        <FormItem label="业务类型名称">
          {getFieldDecorator('name', {
            initialValue: get(rowData, 'name'),
            rules: [
              {
                required: true,
                message: '业务类型名称不能为空',
              },
            ],
          })(<Input autoComplete="off" />)}
        </FormItem>
        <FormItem label="匹配规则">
          {getFieldDecorator('ruleName', {
            initialValue: get(rowData, 'ruleName'),
          })(<ComboList {...getMatchRoleListProps()} />)}
        </FormItem>
        <FormItem label="备注说明" style={{ marginBottom: 4 }}>
          {getFieldDecorator('remark', {
            initialValue: get(rowData, 'remark'),
          })(<TextArea rows={4} style={{ resize: 'none' }} />)}
        </FormItem>
        <FormItem label="停用" style={{ marginBottom: 4 }}>
          {getFieldDecorator('frozen', {
            initialValue: get(rowData, 'frozen') || false,
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
  }, [form, getMatchRoleListProps, handlerFormSubmit, rowData, saving]);

  const title = rowData && rowData.id ? '编辑' : '新建';
  return (
    <div key="form-box" className={cls(styles['form-box'])}>
      <div className="base-view-body">
        <div className="header">
          <BannerTitle title={title} subTitle="业务类型" />
        </div>
        {renderFormContent}
      </div>
    </div>
  );
};

export default Form.create()(TemplateForm);
