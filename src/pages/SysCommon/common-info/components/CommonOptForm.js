import React from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Modal } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ commonInfo, loading }) => ({
  commonInfo,
  loading: loading.models.commonInfo,
}))
class CommonOptForm extends React.Component {
  static defaultProps = {
    values: {},
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

  // 在render()方法之后立即执行
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonInfo/fetchAllTypes',
    });
  }

  okHandle = () => {
    const { values, isEdit = false, form, handleAdd, handleUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (isEdit) {
        handleUpdate({
          commonInfoId: values.id,
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
      commonInfo: { allTypes },
      values,
      form,
    } = this.props;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        style={{ top: 20 }}
        title={isEdit ? '修改基础项' : '新增基础项'}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem key="classify" {...this.formLayout} label="类型">
          {form.getFieldDecorator('classify', {
            rules: [{ required: true, message: '类型必须选择' }],
            initialValue: values.classify,
          })(
            <Select style={{ width: '100%' }} placeholder="请选择类型">
              {allTypes.map(item => (
                <Option value={item.left} key={item.left}>
                  {item.right}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem key="code" {...this.formLayout} label="编码">
          {form.getFieldDecorator('code', {
            rules: [{ required: true, message: '请输入编码！' }],
            initialValue: values.code,
          })(<Input placeholder="请输入编码" />)}
        </FormItem>
        <FormItem key="name" {...this.formLayout} label="名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入名称！', min: 1, max: 20 }],
            initialValue: values.name,
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default CommonOptForm;
