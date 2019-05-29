import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Col,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Divider,
  Row,
  Table,
  Modal
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from './ModelForm.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 表单组件
@Form.create()
class UpdateModelForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => { },
    handleUpdateModalVisible: () => { },
    values: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        fieldName: props.values.fieldName,
        fieldType: props.values.fieldType,
        fieldGroup: props.values.fieldGroup,
        fieldRule: props.values.fieldRule,
        value: props.values.value,
        showName: props.values.showName
      }
    }
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  };

  render() {
    const {
      updateModalVisible,
      handleUpdateModalVisible,
      values,
      form
    } = this.props;
    const {
      formVals
    } = this.state;


    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px  48px' }}
        destroyOnClose
        title={`修改字段信息:${formVals.fieldName}《${formVals.fieldType}》`}
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        <FormItem key="showName" {...this.formLayout} label="显示名称">
          {form.getFieldDecorator('showName', {
            rules: [{ required: true, message: '请输入显示名称！' }],
            initialValue: formVals.showName,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="fieldGroup" {...this.formLayout} label="字段分组">
          {form.getFieldDecorator('fieldGroup', {
            initialValue: formVals.fieldGroup,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">基础属性</Option>
              <Option value="1">消费属性</Option>
            </Select>
          )}
        </FormItem>
        <FormItem key="fieldRule" {...this.formLayout} label="查询规则">
          {form.getFieldDecorator('fieldRule', {
            initialValue: formVals.fieldRule,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">名字规则</Option>
              <Option value="1">性别规则</Option>
            </Select>
          )}
        </FormItem>
      </Modal>
    );
  }
}

@connect(({ loading }) => ({
  submitting: loading.effects['model/submitModelForm']
}))
@Form.create()
class ModelForm extends PureComponent {
  state = {
    updateModalVisible: false,
    editFormValues: {}
  }
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'model/submitModelForm',
          payload: values
        });
      }
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      editFormValues: record || {}
    })
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'model/update',
      payload: {
        query: formValues,
        body: {
          ...fields
        }
      }
    })
  }
  data = [
    {
      id: 1,
      fieldName: "user_name",
      fieldType: "varchar(256)",
      fieldGroup: "基础属性",
      fieldRule: "名字规则",
      value: "include '田'",
      showName: "用户登录名称"
    },
    {
      id: 2,
      fieldName: "sex",
      fieldType: "tinyint(1)",
      fieldGroup: "基础属性",
      fieldRule: "性别规则",
      value: " 1",
      showName: "用户性别"
    },
    {
      id: 3,
      fieldName: "money",
      fieldType: "Decimal(10,2)",
      fieldGroup: "消费属性",
      fieldRule: "data range",
      value: " ",
      showName: "用户财产"
    }
  ];
  // 业务表字段显示信息
  columns = [
    {
      title: '字段名',
      dataIndex: 'fieldName',
      key: 'fieldName',
    },
    {
      title: '数据类型',
      dataIndex: 'fieldType',
      key: 'fieldType',
    },
    {
      title: '所属分组',
      dataIndex: 'fieldGroup',
      key: 'fieldGroup',
    },
    {
      title: '查询规则',
      dataIndex: 'fieldRule',
      key: 'fieldRule',
    },
    {
      title: '代入值',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: '显示名称',
      dataIndex: 'showName',
      key: 'showName',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Fragment>
          <a>删除</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
        </Fragment>
      )
    }
  ]

  render() {
    const {
      submitting,
      loading,
      form: { getFieldDecorator, getFieldValue }
    } = this.props;
    const {
      updateModalVisible,
      editFormValues
    } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate
    }

    return (
      <PageHeaderWrapper
        title='编辑模型'
        content='选择某个数据源下的业务表，对业务表中的字段进行查询规则设置。'
        wrapperClassName={styles.modelForm}
      >
        <Card title="数据源选择" className={styles.card} bordered={false}>
          <Form hideRequiredMark style={{ marginTop: 8 }}>
            <Row gutter={8}>
            <Col lg={6} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入名称' }],
                  })(
                    <Input placeholder="请输入"/>
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="数据源">
                  {getFieldDecorator('datasourceId', {
                    rules: [{ required: true, message: '请选择数据源' }],
                  })(
                    <Select placeholder="请选择数据源">
                      <Option value="1">datasource_01</Option>
                      <Option value="2">datasource_02</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item {...formItemLayout} label="业务表">
                  {getFieldDecorator('tableId', {
                    rules: [{ required: true, message: '请选择业务表' }],
                  })(
                    <Select placeholder="请选择业务表">
                      <Option value="1">table_name_1</Option>
                      <Option value="2">table_name_2</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Button>
                  重新拉取表信息
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="表字段信息" className={styles.card} bordered={false}>
          <Table dataSource={this.data} columns={this.columns} rowKey={record => record.id} />
        </Card>
        <Card className={styles.submitCard} bordered={false}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            <FormattedMessage id="form.submit" />
          </Button>
          <Button style={{ marginLeft: 8 }}>
            <FormattedMessage id="form.save" />
          </Button>
        </Card>
        {editFormValues && Object.keys(editFormValues).length ? (
          <UpdateModelForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={editFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default ModelForm;