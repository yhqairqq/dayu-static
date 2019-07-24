import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, TreeSelect, Radio } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
@connect(({ resource, loading }) => ({
  resource,
  loading: loading.models.resource,
}))
class ResOptForm extends React.Component {
  static defaultProps = {
    values: {
      appId: 0,
      type: 0,
    },
    isEdit: false,
    handleAdd: () => {},
    handleUpdate: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    const {
      values: { type },
    } = props;
    this.state = {
      isMenu: type === 0,
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'resource/fetchAllParent',
    });
  }

  onChange = e => {
    this.setState({
      isMenu: e.target.value === 0,
    });
  };

  okHandle = () => {
    const { values, isEdit = false, form, handleAdd, handleUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (isEdit) {
        handleUpdate({
          ...fieldsValue,
          resId: values.id,
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
      resource: { allParents },
    } = this.props;
    const { isMenu } = this.state;
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
            initialValue: values.parentId,
          })(
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto', offsetHeight: 10 }}
              treeData={allParents}
              treeDefaultExpandAll
              placeholder="请选择父节点"
            />
          )}
        </Form.Item>
        <FormItem key="name" {...this.formLayout} label="资源名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入资源名称！' }],
            initialValue: values.name,
          })(<Input placeholder="请输入资源名称" />)}
        </FormItem>
        <FormItem key="type" {...this.formLayout} label="资源类型">
          {form.getFieldDecorator('type', {
            initialValue: values.type,
          })(
            <div>
              <Radio.Group defaultValue={values.type} onChange={this.onChange}>
                <Radio.Button value={0}>菜单</Radio.Button>
                <Radio.Button value={1}>资源项</Radio.Button>
              </Radio.Group>
            </div>
          )}
        </FormItem>
        {isMenu && (
          <FormItem key="path" {...this.formLayout} label="路径">
            {form.getFieldDecorator('path', {
              rules: [{ required: isMenu, message: '请输入资源路径！' }],
              initialValue: values.path,
            })(<Input placeholder="请输入资源路径" />)}
          </FormItem>
        )}
        {!isMenu && (
          <FormItem key="authCode" {...this.formLayout} label="权限编码">
            {form.getFieldDecorator('authCode', {
              rules: [{ required: !isMenu, message: '请输入权限编码！' }],
              initialValue: values.authCode,
            })(<Input placeholder="请输入权限编码" />)}
          </FormItem>
        )}
        <FormItem key="icon" {...this.formLayout} label="图标">
          {form.getFieldDecorator('icon', {
            initialValue: values.icon,
          })(<Input placeholder="请输入图标" />)}
        </FormItem>
        <FormItem key="comment" {...this.formLayout} label="描述信息">
          {form.getFieldDecorator('comment', {
            initialValue: values.comment,
          })(<TextArea placeholder="请输入描述信息" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default ResOptForm;
