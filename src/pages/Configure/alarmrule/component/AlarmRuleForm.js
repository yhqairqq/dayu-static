import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, TreeSelect, Select, Radio } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@Form.create()
@connect(({  }) => ({
  
}))
class AlarmRuleForm extends React.Component {
  static defaultProps = {
    values: {},
    isEdit: false,
    handleAdd: () => {},
    handleUpdate: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    const {
     
    } = props;
    this.state = {
     
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    
  }

  onChange = e => {
   
  };

  okHandle = () => {
    const { values, form, handleUpdate } = this.props;
   
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
   
      handleUpdate({
        id: values.id,
        pipelineId:values.pipelineId,
        status:values.status,
        ...fieldsValue,
      });
    });
  };
  

  render() {
    const { } = this.state;
    const {
      isEdit,
      modalVisible,
      handleModalVisible,
      values,
      form,
    } = this.props;

   
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={window.innerWidth / 2}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={'修改告警规则信息'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle}
      >

        <FormItem key="monitorName" {...this.formLayout} label="监控项目">
          {form.getFieldDecorator('monitorName', {
            rules: [{ required: true, message: '监控项目' }],
            initialValue: values.monitorName,
          })(
            <Select
              style={{ width: 300 }}
              mode="single"
              placeholder="请选择数据源类型"
              onChange={this.typeSelectHandle}
            >
                <Option key={'DELAYTIME'} value={'DELAYTIME'}>
                        延迟
                </Option>
                <Option key={'PIPELINETIMEOUT'} value={'PIPELINETIMEOUT'}>
                Pipeline超时
                </Option>
                <Option key={'PROCESSTIMEOUT'} value={'PROCESSTIMEOUT'}>
                Process超时
                </Option>
                <Option key={'POSITIONTIMEOUT'} value={'POSITIONTIMEOUT'}>
                Position超时
                </Option>
                <Option key={'EXCEPTION'} value={'EXCEPTION'}>
                异常
                </Option>
           
            </Select>
          )}
        </FormItem>

        <FormItem key="matchValue" {...this.formLayout} label="阈值">
          {form.getFieldDecorator('matchValue', {
            rules: [{ required: true, message: '阈值' }],
            initialValue: values.matchValue,
          })(<Input placeholder="阈值" />)}
        </FormItem>
        <FormItem key="intervalTime" {...this.formLayout} label="报警间隔时间(秒)">
          {form.getFieldDecorator('intervalTime', {
            rules: [{ required: true, message: '报警间隔时间(秒)' }],
            initialValue: values.intervalTime,
          })(<Input placeholder="" />)}
        </FormItem>

        <FormItem key="autoRecovery" {...this.formLayout} label="开始自动恢复：">
          {form.getFieldDecorator('autoRecovery', {
            initialValue: values.autoRecovery || false,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="recoveryThresold" {...this.formLayout} label="触发自动恢复阀值">
          {form.getFieldDecorator('recoveryThresold', {
            rules: [{ required: true, message: '触发自动恢复阀值' }],
            initialValue: values.recoveryThresold,
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

export default AlarmRuleForm;
