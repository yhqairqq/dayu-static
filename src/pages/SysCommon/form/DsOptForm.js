import React from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Modal
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ datasource, loading }) => ({
  datasource,
  loading: loading.models.datasource,
}))
class DsOptForm extends React.Component {
  static defaultProps = {
    values: {

    },
    isEdit: false,
    handleAdd: () => { },
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
  };

  // 在render()方法之后立即执行
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'datasource/fetchAllDsTypes'
    });
  };

  okHandle = () => {
    const { values, isEdit = false, form, handleAdd, handleUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (isEdit) {
        handleUpdate({
          dsId: values.id,
          ...fieldsValue
        });
      } else {
        handleAdd(fieldsValue);
      }
    });
  };

  // 数据源修改
  handleDtChange = (value) => {
    const { form, datasource: { allTypes } } = this.props;
    let driverStr = '';
    for (let i = 0; i < allTypes.length; i += 1) {
      if (allTypes[i].type === value) {
        driverStr = allTypes[i].driver;
        break;
      }
    }
    // 联动
    form.setFieldsValue({
      jdbcDriver: driverStr
    })
  }

  render() {
    const {
      isEdit, modalVisible, handleModalVisible,
      datasource: { allTypes },
      values, form } = this.props;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        style={{ top: 20 }}
        title={isEdit ? '修改数据源' : '新增数据源'}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem key="name" {...this.formLayout} label="数据源名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入至少三个字符的规则描述！', min: 3, max: 20 }],
            initialValue: values.name
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="type" {...this.formLayout} label="数据源类型">
          {form.getFieldDecorator('type', {
            rules: [{ required: true, message: '数据源类型必须选择' }],
            initialValue: values.type
          })(
            <Select style={{ width: '100%' }} placeholder="请选择数据源类型" onChange={this.handleDtChange}>
              {
                allTypes.map((item) => (
                  <Option value={item.type} key={item.type}>{item.type}</Option>
                ))
              }
            </Select>
          )}
        </FormItem>
        <FormItem key="jdbcDriver" {...this.formLayout} label="JDBC驱动">
          {form.getFieldDecorator('jdbcDriver', {
            rules: [{ required: true, message: '请输入数据源驱动！' }],
            initialValue: values.jdbcDriver
          })(<Input placeholder="请输入数据源驱动" />)}
        </FormItem>
        <FormItem key="jdbcUrl" {...this.formLayout} label="JDBC URL">
          {form.getFieldDecorator('jdbcUrl', {
            rules: [{ required: true, message: '请输入数据源URL！' }],
            initialValue: values.jdbcUrl
          })(<Input placeholder="请输入数据源URL" />)}
        </FormItem>
        <FormItem key="username" {...this.formLayout} label="用户名">
          {form.getFieldDecorator('username', {
            initialValue: values.username
          })(<Input placeholder="请输入用户名" />)}
        </FormItem>
        <FormItem key="password" {...this.formLayout} label="密码">
          {form.getFieldDecorator('password', {
            initialValue: values.password
          })(<Input placeholder="请输入密码" />)}
        </FormItem>
        <FormItem key="timeout" {...this.formLayout} label="连接池超时时间(分)">
          {form.getFieldDecorator('timeout', {
            initialValue: values.tiemout || 1
          })(
            <Select style={{ width: '100%' }} placeholder="请选择超时时间">
              <Option value="1" key="1">1</Option>
              <Option value="5" key="5">5</Option>
              <Option value="10" key="10">10</Option>
              <Option value="15" key="15">15</Option>
              <Option value="30" key="30">30</Option>
              <Option value="40" key="40">40</Option>
              <Option value="50" key="50">50</Option>
              <Option value="60" key="60">60</Option>
            </Select>
          )}
        </FormItem>
        <FormItem key="testSql" {...this.formLayout} label="连接测试sql">
          {form.getFieldDecorator('testSql', {
            initialValue: values.testSql
          })(<Input placeholder="SELECT 1" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default DsOptForm;
