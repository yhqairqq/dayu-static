import React from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Modal } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
class UserOptForm extends React.Component {
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
          userId: values.id,
          ...fieldsValue,
        });
      } else {
        handleAdd(fieldsValue);
      }
    });
  };

  render() {
    const {
      isEdit,
      modalVisible,
      handleModalVisible,
      values,
      form,
      role: { allRoles },
    } = this.props;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={640}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={isEdit ? '修改用户信息' : '新增用户信息'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle}
      >
        <FormItem key="nickname" {...this.formLayout} label="用户姓名">
          {form.getFieldDecorator('nickname', {
            rules: [{ required: true, message: '请输入用户姓名！' }],
            initialValue: values.nickname,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="username" {...this.formLayout} label="用户登录名">
          {form.getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户登录名！' }],
            initialValue: values.username,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="password" {...this.formLayout} label="登录密码">
          {form.getFieldDecorator('password', {})(<Input placeholder="默认自动生成" />)}
        </FormItem>
        <FormItem key="department" {...this.formLayout} label="所在部门">
          {form.getFieldDecorator('department', {
            rules: [{ required: true, message: '请输入部门名！' }],
            initialValue: values.department,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="position" {...this.formLayout} label="职位">
          {form.getFieldDecorator('position', {
            initialValue: values.position,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="phone" {...this.formLayout} label="联系电话">
          {form.getFieldDecorator('phone', {
            rules: [{ required: false, message: '请输入联系电话！', min: 11, max: 20 }],
            initialValue: values.phone,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="email" {...this.formLayout} label="电子邮箱">
          {form.getFieldDecorator('email', {
            rules: [{ required: true, message: '请输入电子邮箱！', min: 5, max: 20 }],
            initialValue: values.email,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="roleIds" {...this.formLayout} label="拥有角色">
          {form.getFieldDecorator('roleIds', {
            rules: [{ required: true, message: '请选择角色' }],
            initialValue: values.roleIds,
          })(
            <Select
              placeholder="选择角色"
              style={{ width: '100%' }}
              mode="multiple"
              defaultValue={values.roleIds}
            >
              {allRoles.map(r => (
                <Option key={r.id} value={r.id}>
                  {r.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default UserOptForm;
