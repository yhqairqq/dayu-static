import React from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Modal,
  TreeSelect,
  Select,
  Radio,
  Switch,
  Tree,
  Icon,
  Divider,
  Descriptions,
  Tabs,
  Row,
  Col,
  Button,
  Table,
  Popover,
} from 'antd';

import styles from '../../../styles/Manage.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = Tree;
const { TabPane } = Tabs;
const { SHOW_PARENT } = TreeSelect;

@Form.create()
@connect(({  }) => ({
    
}))
class MediaForm extends React.Component {
  static defaultProps = {

  };
  
  constructor(props) {
    super(props);
    const { values } = props;

    this.state = {
        mediaId: values.id,
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  

  componentDidMount() {
    const { dispatch} = this.props;
    const {  } = this.state;
  }
  
  okHandle = () => {
    const { values, isEdit = false, form, handleAdd, handleUpdate } = this.props;
    const { isHand, mediaId, type } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (isEdit) {
        handleUpdate({
          id: mediaId,
          ...fieldsValue,
        });
      } else {
        handleAdd({
          ...fieldsValue,
        });
      }
    });
  };
  render() {
    const {
    } = this.state;
    const {
        form,
        handleModalVisible,
        values,
    } = this.props;

    return (
        <Modal
        destroyOnClose
        maskClosable={false}
        width={window.innerWidth / 3}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={isEdit ? '修改数据表' : '新增数据表'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle} >



        </Modal>
    );
  }
}

export default MediaForm;
