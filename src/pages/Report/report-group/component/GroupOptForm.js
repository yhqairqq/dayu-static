import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, TreeSelect } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
@connect(({ group, loading }) => ({
  group,
  loading: loading.models.group,
}))
class GroupOptForm extends React.Component {
  static defaultProps = {
    values: {
      groupId: 0,
      parentId: '0',
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

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/getGroupTree',
    });
  }

  okHandle = () => {
    const { values, isEdit = false, form, handleAdd, handleUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (isEdit) {
        handleUpdate({
          groupId: values.id,
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
      group: { trees },
    } = this.props;

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={640}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={isEdit ? '修改报表组信息' : '新增报表组信息'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle}
      >
        <FormItem key="parentId" {...this.formLayout} label="父报表组">
          {form.getFieldDecorator('parentId', {
            rules: [{ required: true, message: '请选择父报表组' }],
            initialValue: values.parentId,
          })(
            <TreeSelect
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto', offsetHeight: 10 }}
              treeData={trees}
              treeDefaultExpandAll
              placeholder="请选择父报表组"
            />
          )}
        </FormItem>
        <FormItem key="name" {...this.formLayout} label="报表组名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入报表组名称！' }],
            initialValue: values.name,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="icon" {...this.formLayout} label="图标">
          {form.getFieldDecorator('icon', {
            initialValue: values.icon,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="comment" {...this.formLayout} label="描述信息">
          {form.getFieldDecorator('comment', {
            initialValue: values.comment,
          })(<TextArea placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default GroupOptForm;
