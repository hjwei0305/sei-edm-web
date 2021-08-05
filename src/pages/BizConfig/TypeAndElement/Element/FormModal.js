import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { Form, Input } from 'antd';
import { ExtModal, BannerTitle } from 'suid';
import styles from './FormModal.less';

const FormItem = Form.Item;
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

  closeFormModal = () => {
    const { closeFormModal } = this.props;
    if (closeFormModal && closeFormModal instanceof Function) {
      closeFormModal();
    }
  };

  render() {
    const { form, rowData, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData ? '修改' : '新建';
    return (
      <ExtModal
        destroyOnClose
        onCancel={this.closeFormModal}
        visible={showModal}
        centered
        width={420}
        wrapClassName={styles['form-modal-box']}
        bodyStyle={{ padding: 0 }}
        confirmLoading={saving}
        title={<BannerTitle title={title} subTitle="要素" />}
        onOk={this.handlerFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal" style={{ margin: 24 }}>
          <FormItem label="要素名称">
            {getFieldDecorator('aliasName', {
              initialValue: get(rowData, 'aliasName'),
              rules: [
                {
                  required: true,
                  message: '要素名称不能为空',
                },
              ],
            })(<Input autoComplete="off" />)}
          </FormItem>
          <FormItem label="要素字段">
            {getFieldDecorator('fieldName', {
              initialValue: get(rowData, 'fieldName'),
              rules: [
                {
                  required: true,
                  message: '要素字段不能为空',
                },
              ],
            })(<Input autoComplete="off" disabled={!!rowData} />)}
          </FormItem>
          <FormItem label="默认值">
            {getFieldDecorator('value', {
              initialValue: get(rowData, 'value'),
            })(<Input autoComplete="off" />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
