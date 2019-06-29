import React from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Modal
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ resource, loading }) => ({
  resource,
  loading: loading.models.resource
}))
class ResOptForm extends React.Component {
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
          ...fieldsValue,
          resId: values.id
        });
      } else {
        handleAdd(fieldsValue);
      }
    })
  }
  
  render() {
    const { isEdit, modalVisible, handleModalVisible,
      values, form, resource: { allParents } } = this.props;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={540}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={isEdit ? '修改资源' : '新增资源'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle}
      >
        <Form.Item key="parentId" {...this.formLayout} label="父节点">
          {form.getFieldDecorator('parentId', {
            rules: [{ required: true, message: '请选择父节点！' }],
            initialValue: values.parentId
          })(
            <Select key="parentId" placeholder="请选择父节点" style={{ width: '100%' }}>
              <Option value="0" key="0">---根目录---</Option>
              {allParents.map(ap => (
                <Option value={ap.id} key={ap.id}>
                  {ap.name}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <FormItem key="name" {...this.formLayout} label="资源名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入资源名称！' }],
            initialValue: values.name
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="code" {...this.formLayout} label="资源编码">
          {form.getFieldDecorator('code', {
            rules: [{ required: true, message: '请输入资源编码！' }],
            initialValue: values.code
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="comment" {...this.formLayout} label="描述信息">
          {form.getFieldDecorator('comment', {
            initialValue: values.comment
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    )
  }
}

export default ResOptForm;