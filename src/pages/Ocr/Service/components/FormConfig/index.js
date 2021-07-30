import React, { useCallback, useState, useEffect } from 'react';
import { get } from 'lodash';
import { Form, Input, Upload, Button } from 'antd';
import { message, ExtModal, ScrollBar } from 'suid';
import empty from '@/assets/ocr_empty.svg';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const defaultAppIcon = empty;
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const FormConfig = props => {
  const { itemData, visible, form, onSave = () => {}, saving, onClose = () => {} } = props;
  const { getFieldDecorator } = form;

  const [logo, setLogo] = useState(get(itemData, 'icon') || defaultAppIcon);

  const clearData = useCallback(() => {
    setLogo(defaultAppIcon);
  }, []);

  useEffect(() => {
    setLogo(get(itemData, 'icon') || defaultAppIcon);
  }, [itemData]);

  useEffect(() => {
    return () => {
      clearData();
    };
  }, [clearData]);

  const handlerClose = useCallback(() => {
    onClose();
    clearData();
  }, [clearData, onClose]);

  const handlerSave = useCallback(() => {
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, itemData, formData, { icon: logo });
      if (onSave) {
        onSave(params);
      }
    });
  }, [form, logo, itemData, onSave]);

  const customRequest = useCallback(option => {
    const formData = new FormData();
    formData.append('files[]', option.file);
    const reader = new FileReader();
    reader.readAsDataURL(option.file);
    reader.onloadend = e => {
      if (e && e.target && e.target.result) {
        option.onSuccess();
        setLogo(e.target.result);
      }
    };
  }, []);

  const beforeUpload = useCallback(file => {
    const isJpgOrPng = file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传PNG文件!');
      return false;
    }
    const isLt10K = file.size / 1024 <= 50;
    if (!isLt10K) {
      message.error('图片大小需小于50Kb!');
      return false;
    }
    return isJpgOrPng && isLt10K;
  }, []);

  const getLogoProps = useCallback(() => {
    const uploadProps = {
      customRequest,
      showUploadList: false,
      beforeUpload,
    };
    return uploadProps;
  }, [beforeUpload, customRequest]);

  return (
    <ExtModal
      destroyOnClose
      onCancel={handlerClose}
      visible={visible}
      centered
      width={420}
      wrapClassName={styles['container-box']}
      confirmLoading={saving}
      maskClosable={false}
      title={itemData ? '修改OCR服务' : '新建OCR服务'}
      onOk={handlerSave}
    >
      <ScrollBar>
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="服务LOGO">
            <div className="logo-box horizontal">
              <div className="row-start icon">
                <img alt="LOGO" src={logo} />
              </div>
              <div className="tool-box vertical">
                <Upload {...getLogoProps()}>
                  <Button type="primary" icon="upload" ghost>
                    上传服务商LOGO
                  </Button>
                </Upload>
                <div className="desc">
                  请上传OCR服务商LOGO,图片为png格式,图片长宽都为120px，大小在50Kb以内;
                </div>
              </div>
            </div>
          </FormItem>
          <FormItem label="服务代码" extra="注册的bean">
            {getFieldDecorator('code', {
              initialValue: get(itemData, 'code'),
              rules: [
                {
                  required: true,
                  message: '服务代码不能为空',
                },
              ],
            })(<Input autoComplete="off" />)}
          </FormItem>
          <FormItem label="服务名称">
            {getFieldDecorator('name', {
              initialValue: get(itemData, 'name'),
              rules: [
                {
                  required: true,
                  message: '服务名称不能为空',
                },
              ],
            })(<Input autoComplete="off" />)}
          </FormItem>
          <FormItem label="秘钥ID">
            {getFieldDecorator('secretId', {
              initialValue: get(itemData, 'secretId'),
              rules: [
                {
                  required: false,
                  message: '秘钥ID不能为空',
                },
              ],
            })(<Input autoComplete="off" />)}
          </FormItem>
          <FormItem label="秘钥KEY">
            {getFieldDecorator('secretKey', {
              initialValue: get(itemData, 'secretKey'),
              rules: [
                {
                  required: false,
                  message: '秘钥KEY不能为空',
                },
              ],
            })(<Input autoComplete="off" />)}
          </FormItem>
          <FormItem label="备注说明">
            {getFieldDecorator('remark', {
              initialValue: get(itemData, 'remark'),
            })(<TextArea rows={3} style={{ resize: 'none' }} />)}
          </FormItem>
        </Form>
      </ScrollBar>
    </ExtModal>
  );
};

export default Form.create()(FormConfig);
