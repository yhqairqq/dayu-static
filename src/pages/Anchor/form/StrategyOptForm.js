import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Radio, Checkbox, Select } from 'antd';

const FormItem = Form.Item;

@Form.create()
@connect(({ role, loading, appinfo }) => ({
  role,
  loading: loading.models.role,
  appinfo,
}))
class StrategyOptForm extends React.Component {
  static defaultProps = {
    values: {
      appId: 0,
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
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    };
  }

  okHandle = () => {
    const { values, isEdit = false, form, handleAdd, handleUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (isEdit) {
        handleUpdate({
          id: values.id,
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
      appinfo: { allAppInfos },
    } = this.props;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={isEdit ? '修改上传策略信息' : '新增上传策略信息'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle}
      >
        <FormItem key="appKey" {...this.formLayout} label="所属应用">
          {form.getFieldDecorator('appKey', {
            rules: [{ required: true, message: '请选择所属应用！' }],
            initialValue: values.appKey,
          })(
            <Select placeholder="选择应用" style={{ width: '100%' }} disabled={isEdit}>
              {allAppInfos.map(r => (
                <Select.Option key={r.appKey} value={r.appKey}>
                  {r.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </FormItem>
        <Form.Item key="system" {...this.formLayout} label="设备类型">
          {form.getFieldDecorator('system', {
            rules: [{ required: true, message: '请选择设备类型！' }],
            initialValue: values.system,
          })(
            <Radio.Group disabled={isEdit}>
              <Radio value="ios">ios</Radio>
              <Radio value="android">android</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item key="upload" {...this.formLayout} label="上传策略">
          {form.getFieldDecorator('upload', {
            rules: [{ required: true, message: '请选择上传策略！' }],
            initialValue: values.upload,
          })(
            <Checkbox.Group
              options={[
                { label: '启动上传', value: '0' },
                { label: '后台上传', value: '1' },
                { label: '进入前台上传', value: '2' },
                { label: '累计N个点上传', value: '3' },
              ]}
            />
          )}
        </Form.Item>
        <Form.Item key="accNum" {...this.formLayout} label="累计点数">
          {form.getFieldDecorator('accNum', {
            rules: [
              {
                required: true,
                pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                message: '请输入正确的数字',
              },
            ],
            initialValue: values.accNum,
          })(<Input placeholder="输入累计点数" />)}
        </Form.Item>
        <FormItem key="closeSwitch" {...this.formLayout} label="是否开启上传">
          {form.getFieldDecorator('closeSwitch', {
            rules: [{ required: true, message: '请选择是否开启上传！' }],
            initialValue: values.closeSwitch,
          })(
            <Radio.Group>
              <Radio value={0}>打开</Radio>
              <Radio value={1}>关闭</Radio>
            </Radio.Group>
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default StrategyOptForm;
