import React, { useCallback, useState } from 'react';
import { get } from 'lodash';
import { Form, Input, Upload, Button } from 'antd';
import { message } from 'suid';

const FormItem = Form.Item;
const { TextArea } = Input;
const defaultAppIcon = '';
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const FormConfig = props => {
  const { editData, form, onSave = () => {}, saving, cancelEdit = () => {} } = props;
  const { getFieldDecorator } = form;

  const [logo, setLogo] = useState(get(editData, 'icon') || defaultAppIcon);

  const handlerSave = useCallback(() => {
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData, formData);
      if (onSave) {
        onSave(params);
      }
    });
  }, [editData, form, onSave]);

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
    const isLt10K = file.size / 1024 <= 10;
    if (!isLt10K) {
      message.error('图片大小需小于10Kb!');
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
    <Form {...formItemLayout} layout="horizontal">
      <FormItem label="服务商LOGO">
        <div className="logo-box horizontal">
          <div className="row-start icon">
            <img alt="" src={logo} />
          </div>
          <div className="tool-box vertical">
            <Upload {...getLogoProps()}>
              <Button type="primary" icon="upload" ghost>
                上传服务商LOGO
              </Button>
            </Upload>
            <div className="desc">
              请上传OCR服务商LOGO,图片为png格式,图片长宽都为80px，大小在20Kb以内;
            </div>
          </div>
        </div>
      </FormItem>
      <FormItem label="服务代码" extra="注册的bean">
        {getFieldDecorator('code', {
          initialValue: get(editData, 'code'),
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
          initialValue: get(editData, 'name'),
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
          initialValue: get(editData, 'secretId'),
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
          initialValue: get(editData, 'secretKey'),
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
          initialValue: get(editData, 'remark'),
        })(<TextArea rows={3} style={{ resize: 'none' }} />)}
      </FormItem>
      <FormItem className="btn-submit">
        <Button disabled={saving} onClick={cancelEdit}>
          取消
        </Button>
        <Button type="primary" loading={saving} onClick={handlerSave}>
          保存
        </Button>
      </FormItem>
    </Form>
  );
};

export default Form.create()(FormConfig);
