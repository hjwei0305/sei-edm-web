import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { Form, Input, Switch } from 'antd';
import { ExtModal } from 'suid';
import styles from './index.less';

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

@Form.create()
class FormModal extends PureComponent {
  handlerFormSubmit = () => {
    const { form, save, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData);
      save(params);
    });
  };

  render() {
    const { form, rowData, closeFormModal, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData ? '修改业务领域' : '新建业务领域';
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        maskClosable={false}
        centered
        width={420}
        wrapClassName={styles['form-modal-box']}
        bodyStyle={{ padding: 0 }}
        confirmLoading={saving}
        title={title}
        onOk={this.handlerFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal" style={{ margin: 24 }}>
          <FormItem label="领域代码">
            {getFieldDecorator('code', {
              initialValue: get(rowData, 'code'),
              rules: [
                {
                  required: true,
                  message: '领域代码不能为空',
                },
              ],
            })(<Input autoComplete="off" disabled={!!rowData} />)}
          </FormItem>
          <FormItem label="领域名称">
            {getFieldDecorator('name', {
              initialValue: get(rowData, 'name'),
              rules: [
                {
                  required: true,
                  message: '领域名称不能为空',
                },
              ],
            })(<Input autoComplete="off" />)}
          </FormItem>
          <FormItem label="备注说明">
            {getFieldDecorator('bizFrom', {
              initialValue: get(rowData, 'bizFrom'),
            })(<TextArea rows={3} style={{ resize: 'none' }} />)}
          </FormItem>
          <FormItem label="停用">
            {getFieldDecorator('frozen', {
              valuePropName: 'checked',
              initialValue: get(rowData, 'frozen') || false,
            })(<Switch size="small" />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
