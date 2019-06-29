import React from 'react';
import {
  Form,
  Input,
  Modal,
  Radio,
} from 'antd';

const FormItem = Form.Item;

@Form.create()
class RoleOptForm extends React.Component {
  static defaultProps = {
    values: {
      appId: 0,
      type: 0
    },
    isEdit: false,
    handleAdd: () => { },
    handleUpdate: () => { },
    handleModalVisible: () => { }
  }

  constructor(props) {
    super(props);
    this.state = {
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  okHandle = () => {
    const { values, isEdit = false, form, handleAdd, handleUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (isEdit) {
        handleUpdate({
          roleId: values.id,
          ...fieldsValue
        });
      } else {
        handleAdd(fieldsValue);
      }
    })
  }

  render() {
    const { isEdit, modalVisible, handleModalVisible,
      values, form } = this.props;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={540}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={isEdit ? '修改角色信息' : '新增角色信息'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle}
      >
        <FormItem key="name" {...this.formLayout} label="角色名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入角色名称！' }],
            initialValue: values.name
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="code" {...this.formLayout} label="角色编码">
          {form.getFieldDecorator('code', {
            rules: [{ required: true, message: '请输入角色编码！' }],
            initialValue: values.code
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <Form.Item key="type" {...this.formLayout} label="角色类型">
          {form.getFieldDecorator('type', {
            initialValue: values.type
          })(
            <Radio.Group>
              <Radio value={0}>待授权角色</Radio>
              <Radio value={1}>默认角色</Radio>
            </Radio.Group>
          )}
        </Form.Item>
      </Modal>
    )
  }
}

export default RoleOptForm;