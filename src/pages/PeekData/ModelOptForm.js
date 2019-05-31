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
import StandardTable from '@/components/StandardTable';
import { resolve } from 'path';

const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

@Form.create()
@connect(({ model, datasource, loading }) => ({
  model,
  datasource,
  loading: loading.models.datasource,
}))
class ModelOptForm extends PureComponent {
  static defaultProps = {
    values: {},
    isEdit: false,
    handleAdd: () => { },
    handleUpdate: () => { },
    handleModalVisible: () => { }
  };
  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        name: props.values.name,
        datasourceId: props.values.datasourceId,
        tableName: props.values.tableName,
        desc: props.values.desc,
        fields: []
      },
      datasources: [], // 数据源
      tableNames: [],  // 数据表
      currentStep: 0
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  };

  // 在render()方法之后立即执行
  componentDidMount() {
    const { dispatch } = this.props;
    const { formVals } = this.state;
    dispatch({
      type: 'datasource/fetchAll'
    });
    // 拉取相应的
    if (formVals.datasourceId) {
      dispatch({
        type: 'datasource/fetchTables',
        payload: formVals.datasourceId
      })
    }
  };

  okHandle = () => {
    form.validateFields((err, fieldsValues) => {
      if (err) return;
      form.resetFields();
      if (isEdit) {
        fieldsValues.modelId = recordValue.id;
        handleUpdate(fieldsValues);
      } else {
        handleAdd(fieldsValues);
      }
    })
  }

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  handleNext = currentStep => {
    const { form, handleUpdate, handleAdd, isEdit, model: { fields } } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 1) {
            this.forward();
          } else {
            form.resetFields();
            if (!formVals.fields) {
              formVals.fields = fields;
            }
            console.log(formVals)
            if (isEdit) {
              handleUpdate(formVals);
            } else {
              handleAdd(formVals);
            }
          }
        }
      );
    });
  };
  // 取消处理
  cancelHandle = () => {
    const { handleModalVisible, form } = this.props;

    form.resetFields();
    this.setState({
      formVals: {}
    })
    handleModalVisible();
  }

  // 处理数据源变更操作
  handleDtChange = (value) => {
    const { dispatch } = this.props;
    this.setState({
      formVals: {
        datasourceId: value
      }
    });
    dispatch({
      type: 'datasource/fetchTables',
      payload: value
    })
  }

  // 处理数据表变更操作
  handleTableChange = (value) => {
    const { dispatch } = this.props;
    const { formVals } = this.state;
    dispatch({
      type: 'model/getColumns',
      payload: {
        modelId: formVals.id,
        tableName: value,
        datasourceId: formVals.datasourceId
      }
    })
  }

  // 底部按钮
  renderFooter = currentStep => {
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => this.cancelHandle()}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          保存
        </Button>,
      ]
    }
    return [
      <Button key="cancel" onClick={() => this.cancelHandle()}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>
    ]
  };

  // 表单
  renderContent = (currentStep, formVals) => {
    const {
      form,
      datasource: { simpleDatasources, tables },
      model: { fields }
    } = this.props;
    if (currentStep == 1) {
      // 业务表字段显示信息
      const columns = [
        {
          title: '字段名', dataIndex: 'name', key: 'name',
          sorter: (a, b) => a.name.localeCompare(b.name)
        },
        { title: '显示名称', dataIndex: 'showName', key: 'showName', editable: true },
        { title: '数据类型', dataIndex: 'dataType', key: 'dataType' },
        { title: '所属分组', dataIndex: 'groupName', key: 'groupName' },
        {
          title: '操作', key: 'action',
          render: (text, record) => (
            <Fragment>
              <Popconfirm placement="top" title="确定删除该字段？">
                <a>删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a>编辑</a>
            </Fragment>
          )
        }
      ]
      return [
        <Divider type="horizontal" />,
        <Table
          size="small"
          dataSource={fields}
          columns={columns}
          rowKey={record => record.id}
        />
      ]
    }
    return [
      <FormItem key="name" {...this.formLayout} label="模型名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入模型名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="datasourceId" {...this.formLayout} label="数据源">
        {form.getFieldDecorator('datasourceId', {
          rules: [{ required: true, message: '请选择数据源' }],
          initialValue: formVals.datasourceId,
        })(
          <Select placeholder="请选择数据源" style={{ width: '100%' }} onChange={(value) => this.handleDtChange(value)}>
            {
              simpleDatasources.map((item, index) => (
                <Option value={item.id} key={item.id}>{item.name}</Option>
              ))
            }
          </Select>
        )}
      </FormItem>,
      <FormItem key="tableName" {...this.formLayout} label="业务表">
        {form.getFieldDecorator('tableName', {
          rules: [{ required: true, message: '请选择业务表' }],
          initialValue: formVals.tableName,
        })(
          <Select placeholder="请选择业务表" style={{ width: '100%' }} onChange={(value) => this.handleTableChange(value)}>
            {
              tables.map((item, index) => (
                <Option key={item.name} value={item.name}>{item.name}</Option>
              ))
            }
          </Select>
        )}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="模型描述">
        {form.getFieldDecorator('desc', {
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      </FormItem>
    ];
  };

  render() {
    const { isEdit, modalVisible, values } = this.props;
    const { currentStep, formVals } = this.state;

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={700}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={isEdit ? '修改模型' : '新增模型'}
        visible={modalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => this.cancelHandle()}
        afterClose={() => this.cancelHandle()}
      >
        <Steps style={{ marginBottom: 15 }} size="small" current={currentStep}>
          <Step title="数据源选择" />
          <Step title="字段修改" />
        </Steps>
        {this.renderContent(currentStep, formVals)}
      </Modal>
    )
  }
}

export default ModelOptForm;