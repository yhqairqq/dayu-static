import React from 'react';
import { connect } from "dva";
import {
  Form,
  Tree,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Popconfirm,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
const FormItem = Form.Item;
const { TreeNode } = Tree;
const { Search } = Input;
const { Option } = Select;

@Form.create()
class AllotRes2Role extends React.Component {
  static defaultProps = {
    values: {
      appId: 0,
      type: 0
    },
    isEdit: false,
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
    const { values, isEdit = false, form, handleUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      fieldsValue.roleId = values.id;
      handleUpdate(fieldsValue);
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
        title={'分配资源权限'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle}
      >
      <span>出来就好</span>
      </Modal>
    )
  }
}

export default AllotRes2Role;