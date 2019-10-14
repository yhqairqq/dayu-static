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
@connect(({ zookeeper, node, loading }) => ({
  node,
  zookeeper,
  loading: loading.models.zookeeper,
}))
class NodeForm extends React.Component {
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

    dispatch({
      type: 'zookeeper/getZookeepers',
    });
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
        });
      } else {
        handleAdd({
          ...fieldsValue,
        });
      }
    });
  };

  render() {
    const { isHand, positionVisible, otherParamsVisible, enableRemedyVisible } = this.state;
    const {
      isEdit,
      modalVisible,
      handleModalVisible,
      form,
      values,
      zookeeper: { zookeepers },
    } = this.props;

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={window.innerWidth / 2}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 10px' }}
        title={isEdit ? '修改node信息' : '新增node信息'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle}
      >
        <FormItem key="name" {...this.formLayout} label="机器名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '机器名称' }],
            initialValue: values.name,
          })(<Input placeholder="机器名称" />)}
        </FormItem>
        <FormItem key="ip" {...this.formLayout} label="机器IP">
          {form.getFieldDecorator('ip', {
            rules: [{ required: true, message: '机器IP' }],
            initialValue: values.ip,
          })(<Input placeholder="" />)}
        </FormItem>
        <FormItem key="port" {...this.formLayout} label="机器端口">
          {form.getFieldDecorator('port', {
            rules: [{ required: true, message: '机器端口' }],
            initialValue: values.port || 2088,
          })(<Input disabled placeholder="2088" />)}
        </FormItem>
        <FormItem key="downloadPort" {...this.formLayout} label="下载端口">
          {form.getFieldDecorator('downloadPort', {
            rules: [{ required: true, message: '下载端口' }],
            initialValue: values.downloadPort || 1100,
          })(<Input disabled placeholder="1100" />)}
        </FormItem>
        <div
          style={{
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          可为空，不填写默认即为：机器端口 + 1
        </div>
        <FormItem key="mbeanPort" {...this.formLayout} label="MBean端口">
          {form.getFieldDecorator('mbeanPort', {
            rules: [{ required: false, message: 'MBean端口' }],
            initialValue: values.mbeanPort,
          })(<Input disabled placeholder="" />)}
        </FormItem>
        <div
          style={{
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          可为空，不填写默认即为：机器端口 + 2
        </div>
        <FormItem key="externalIp" {...this.formLayout} label="外部IP">
          {form.getFieldDecorator('externalIp', {
            rules: [{ required: false, message: '外部IP' }],
            initialValue: values.externalIp,
          })(<Input disabled placeholder="" />)}
        </FormItem>
        <FormItem key="useExternalIp" {...this.formLayout} label="启用外部IP">
          {form.getFieldDecorator('useExternalIp', {
            initialValue: values.useExternalIp || false,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="autoKeeperClusterId" {...this.formLayout} label="zookeeper集群">
          {form.getFieldDecorator('autoKeeperClusterId', {
            rules: [{ required: true, message: 'zookeeper集群' }],
            initialValue: (values && values.parameters && values.parameters.zkCluster.id) || '1',
          })(
            <Select style={{ width: 300 }} mode="single" placeholder="请选择zookeeper集群">
              {zookeepers &&
                zookeepers.map(t => (
                  <Option key={t.id} value={t.id}>
                    {t.clusterName}
                  </Option>
                ))}
            </Select>
          )}
        </FormItem>

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

export default NodeForm;
