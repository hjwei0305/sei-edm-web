import React, { useCallback, useMemo } from 'react';
import { get } from 'lodash';
import { Form, Input } from 'antd';
import { ExtModal, BannerTitle } from 'suid';
import styles from './index.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const FormModal = props => {
  const { form, onSave, saving, rowData, closeFormModal, showModal } = props;
  const handlerFormSubmit = useCallback(() => {
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData);
      onSave(params);
    });
  }, [form, rowData, onSave]);

  const getFormModalProps = useMemo(() => {
    const modalProps = {
      destroyOnClose: true,
      onCancel: closeFormModal,
      visible: showModal,
      maskClosable: false,
      centered: true,
      width: 420,
      wrapClassName: styles['form-modal-box'],
      bodyStyle: { padding: 0 },
      confirmLoading: saving,
      title: <BannerTitle title={get(rowData, 'name')} subTitle="编辑" />,
      onOk: handlerFormSubmit,
    };
    return modalProps;
  }, [closeFormModal, handlerFormSubmit, rowData, saving, showModal]);

  return (
    <ExtModal {...getFormModalProps}>
      <Form {...formItemLayout} layout="horizontal" style={{ margin: 24 }}>
        <FormItem label="要素名称">
          {form.getFieldDecorator('name', {
            initialValue: get(rowData, 'name'),
            rules: [
              {
                required: true,
                message: '要素名称不能为空',
              },
            ],
          })(<Input autoComplete="off" />)}
        </FormItem>
      </Form>
    </ExtModal>
  );
};

export default Form.create()(FormModal);
