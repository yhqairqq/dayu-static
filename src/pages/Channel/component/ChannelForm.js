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
@connect(({ channel, loading }) => ({
  channel,
  loading: loading.models.channel,
}))
class ChannelForm extends React.Component {
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
    const { isEdit, modalVisible, handleModalVisible, form, values } = this.props;

    const parameters = values.parameters || {};

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={740}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 10px' }}
        title={isEdit ? '修改链路l信息' : '新增链路信息'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle}
      >
        <FormItem key="name" {...this.formLayout} label="名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入名称' }],
            initialValue: values.name,
          })(<Input placeholder="请输入channel名称" />)}
        </FormItem>
        <FormItem key="tag.name" {...this.formLayout} label="业务标签">
          {form.getFieldDecorator('tag.name', {
            rules: [{ required: true, message: '' }],
            initialValue: values.tag && values.tag.name,
          })(<Input placeholder="" />)}
        </FormItem>
        <FormItem key="tag.subName" {...this.formLayout} label="对接人标签">
          {form.getFieldDecorator('tag.subName', {
            rules: [{ required: true, message: '' }],
            initialValue: values.tag && values.tag.subName,
          })(<Input placeholder="" />)}
        </FormItem>
        <FormItem key="syncConsistency" {...this.formLayout} label="同步一致性">
          {form.getFieldDecorator('syncConsistency', {
            initialValue: parameters.syncConsistency || 'BASE',
          })(
            <Radio.Group disabled>
              <Radio.Button value="MEDIA">基于数据库反查</Radio.Button>
              <Radio.Button value="BASE">基于当前日志变更</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="syncMode" {...this.formLayout} label="同步模式">
          {form.getFieldDecorator('syncMode', {
            initialValue: parameters.syncMode || 'FIELD',
          })(
            <Radio.Group>
              <Radio.Button value="ROW">行记录模式</Radio.Button>
              <Radio.Button value="FIELD">列记录模式</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="enableRemedy" {...this.formLayout} label="是否开启数据一致性">
          {form.getFieldDecorator('enableRemedy', {
            initialValue: parameters.enableRemedy || false,
          })(
            <Radio.Group disabled>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: enableRemedyVisible,
          }}
          key="remedyAlgorithm"
          {...this.formLayout}
          label="一致性算法"
        >
          {form.getFieldDecorator('remedyAlgorithm', {
            initialValue: parameters.remedyAlgorithm || 'LOOPBACK',
          })(
            <Radio.Group>
              <Radio.Button value="LOOPBACK">单向回环补救</Radio.Button>
              <Radio.Button value="INTERSECTION">时间交集补救</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: enableRemedyVisible,
          }}
          key="remedyDelayThresoldForMedia"
          {...this.formLayout}
          label="一致性反查数据库延迟阀值"
        >
          {form.getFieldDecorator('remedyDelayThresoldForMedia', {
            initialValue: parameters.remedyDelayThresoldForMedia || 60,
          })(<Input placeholder="" />)}
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

export default ChannelForm;
