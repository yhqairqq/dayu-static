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
  Icon,
  Divider,
  Descriptions,
} from 'antd';
import { formatGroupDbAddress } from '@/utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@Form.create()
@connect(({ zookeeper, loading }) => ({
  zookeeper,
  loading: loading.models.zookeeper,
}))
class ZookeeperForm extends React.Component {
  static defaultProps = {
    values: {},
    isEdit: false,
    handleAdd: () => {},
    handleUpdate: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    const { values, isEdit } = props;
    this.state = {
      positionVisible: 'none',
      otherParamsVisible: 'none',
      enableRemedyVisible: 'none',
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const { dispatch, isEdit } = this.props;

    // dispatch({
    //   type: 'zookeeper/getZookeepers',
    // });
    // dispatch({
    //   type: 'report/fetchTypes',
    // });
  }

  enableRemedyShow = () => {
    const { enableRemedyVisible } = this.state;
    this.setState({
      enableRemedyVisible: enableRemedyVisible == 'none' ? 'block' : 'none',
    });
  };

  okHandle = () => {
    const { values, isEdit = false, form, handleAdd, handleUpdate } = this.props;
    const { isHand, sourceId, type } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();

      if (isEdit) {
        handleUpdate({
          id: values.id,
          ...fieldsValue,
          serverList: fieldsValue.zookeeperClusters.split(';').filter(item => item != ''),
        });
      } else {
        handleAdd({
          ...fieldsValue,
          serverList: fieldsValue.zookeeperClusters.split(';').filter(item => item != ''),
        });
      }
    });
  };

  render() {
    const { isHand, positionVisible, otherParamsVisible, enableRemedyVisible } = this.state;
    const { isEdit, modalVisible, handleModalVisible, form, values } = this.props;

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={window.innerWidth / 2}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 10px' }}
        title={isEdit ? '修改Zookeeper集群信息' : '新增Zookeeper集群信息'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle}
      >
        <FormItem key="clusterName" {...this.formLayout} label="集群名字">
          {form.getFieldDecorator('clusterName', {
            rules: [
              {
                required: true,
                message: 'ZooKeeper集群为空，无法添加Node或Canal，请先至少添加一个ZooKeeper集群',
              },
            ],
            initialValue: values.clusterName,
          })(<Input placeholder="集群名字" />)}
        </FormItem>

        <FormItem key="zookeeperClusters" {...this.formLayout} label="Zookeeper集群">
          {form.getFieldDecorator('zookeeperClusters', {
            rules: [{ required: true, message: 'Zookeeper集群' }],
            initialValue:
              values &&
              values.serverList &&
              values.serverList.map(item => item + ';').reduce((prev, val) => prev + val),
          })(<Input.TextArea autosize={{ minRows: 6 }} placeholder="" />)}
        </FormItem>
        <div
          style={{
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          格式如 10.20.10.20:8080;（必须以分号结束，可添多个）
        </div>
        <FormItem key="description" {...this.formLayout} label="描述信息">
          {form.getFieldDecorator('description', {
            rules: [{ required: false, message: '描述信息' }],
            initialValue: values.description,
          })(<Input.TextArea autosize={{ minRows: 6 }} placeholder="" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default ZookeeperForm;
