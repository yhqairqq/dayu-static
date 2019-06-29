import React from 'react';
import {
  Form,
  Modal
} from 'antd';

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
    const { values, form, handleUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate({
        roleId: values.id,
        ...fieldsValue
      });
    })
  }

  render() {
    const { modalVisible, handleModalVisible, values } = this.props;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={540}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title='分配资源权限'
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