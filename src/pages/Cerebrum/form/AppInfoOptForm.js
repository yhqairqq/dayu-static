import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Radio } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
class AppInfoOptForm extends React.Component {
  static defaultProps = {
    values: {
      appId: 0,
    },
    isEdit: false,
    handleAdd: () => {},
    handleUpdate: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
    };
  }

  okHandle = () => {
    const { values, isEdit = false, form, handleAdd, handleUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (isEdit) {
        handleUpdate({
          modelId: values.id,
          ...fieldsValue,
        });
      } else {
        handleAdd(fieldsValue);
      }
    });
  };

  render() {
    const { isEdit, modalVisible, handleModalVisible, values, form } = this.props;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={640}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={isEdit ? '修改埋点应用信息' : '新增埋点应用信息'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle}
      >
        <FormItem key="name" {...this.formLayout} label="应用名">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入应用名！' }],
            initialValue: values.name,
          })(<Input placeholder="请输入" disabled={isEdit} />)}
        </FormItem>
        <Form.Item key="platform" {...this.formLayout} label="平台">
          {form.getFieldDecorator('platform', {
            rules: [{ required: true, message: '请选择平台！' }],
            initialValue: values.platform,
          })(
            <Radio.Group disabled={isEdit}>
              <Radio value={0}>移动端</Radio>
              <Radio value={1}>html5</Radio>
              <Radio value={2}>WEB</Radio>
              <Radio value={3}>小程序</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item key="type" {...this.formLayout} label="类型">
          {form.getFieldDecorator('type', {
            rules: [{ required: true, message: '请选择类型！' }],
            initialValue: values.type,
          })(
            <Radio.Group disabled={isEdit}>
              <Radio value={0}>呆萝卜</Radio>
              <Radio value={1}>合伙人</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        {isEdit ? (
          <FormItem key="appKey" {...this.formLayout} label="appKey">
            {form.getFieldDecorator('appKey', {
              rules: [{ required: true, message: '请输入appkey！' }],
              initialValue: values.appKey,
            })(<Input placeholder="请输入" disabled={isEdit} />)}
          </FormItem>
        ) : null}
        <FormItem key="comment" {...this.formLayout} label="应用描述">
          {form.getFieldDecorator('comment', {
            initialValue: values.comment,
          })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default AppInfoOptForm;
