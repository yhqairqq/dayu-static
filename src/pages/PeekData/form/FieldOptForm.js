import React, { PureComponent, Fragment } from 'react';
import dva, { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
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
  Table,
} from 'antd';
const FormItem = Form.Item;

@Form.create()
@connect(({ datasource, loading }) => ({
  datasource,
  loading: loading.models.datasource,
}))
class FieldOptForm extends React.Component {
  static defaultProps = {
    values: {},
    isEdit: false,
    handleUpdate: () => { },
    handleModalVisible: () => { }
  };

  constructor(props) {
    super(props);
    const { values } = props;
    this.state = {
      formVals: {
        name: values.name,
        showName: values.showName,
        groupName: values.groupName,
        dataType: values.dataType
      },
    }
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  };

  // 在render()方法之后立即执行
  componentDidMount() {
    const { dispatch } = this.props; 

    dispatch({
      type: 'datasource/getDataTypes'
    });
  };

  handleFieldUpdate = () => {
    const { form, handleUpdate} = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          handleUpdate(formVals);
        }
      );
    });
  }

  render() {
    const { form, modalVisible, handleModalVisible, values,
      datasource: { dataTypes }
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
    return (
      <Modal
        destroyOnClose
        centered
        maskClosable={false}
        title='修改字段信息'
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        onOk={() => this.handleFieldUpdate()}
      >
        <Form {...formItemLayout}>
          <Form.Item label="字段名">
            {form.getFieldDecorator('name', {
              initialValue: values.name,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="显示名称">
            {form.getFieldDecorator('showName', {
              rules: [{ required: true, message: '显示名称不能为空', }],
              initialValue: values.showName,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="数据类型">
            {form.getFieldDecorator('dataType', {
              rules: [{ required: true, message: '显示名称不能为空', }],
              initialValue: values.dataType,
            })(
              <Select key="dataType">
                {dataTypes && dataTypes.map((item, index) => (
                  <Option key={index} value={item}>{item}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="所属分组">
            {form.getFieldDecorator('groupName', {
              rules: [{ required: true, message: '显示名称不能为空', }],
              initialValue: values.groupName,
            })(<Input />)}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default FieldOptForm;
