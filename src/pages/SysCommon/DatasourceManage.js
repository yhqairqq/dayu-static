import React, { PureComponent, Fragment } from 'react';
import dva, { connect } from 'dva';
import moment, { isDate } from 'moment';
import router from 'umi/router';
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
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './DatasourceManage.less';
import FormItem from 'antd/lib/form/FormItem';

const { Option } = Select;

const statusMap = ['success', 'error']
const status = ['使用中', '已停用']
const DATASOURCE_TYPE = [
  {
    type: 'MySQL',
    driver: 'com.mysql.jdbc.Driver',
  },
  {
    type: 'PostgreSQL',
    driver: 'org.postgresql.Driver',
  },
  {
    type: 'ElasticSearch',
    driver: 'org.elasticsearch.xpack.sql.jdbc.EsDriver'
  }
]

const CreateForm = Form.create()(props => {
  const { modalVisible, recordValue, isEdit = false, form, handleAdd, handleUpdate, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (isEdit) {
        fieldsValue.dsId = recordValue.id
        handleUpdate(fieldsValue);
      } else {
        handleAdd(fieldsValue);
      }
    });
  };

  const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 15 },
  };

  // 数据源修改
  function handleDtChange(value) {
    let driverStr = '';
    for (let i = 0; i < DATASOURCE_TYPE.length; i++) {
      if (DATASOURCE_TYPE[i].type === value) {
        driverStr = DATASOURCE_TYPE[i].driver;
        break;
      }
    }
    recordValue.jdbcDriver = driverStr;
  }
  return (
    <Modal
      destroyOnClose
      style={{ top: 20 }}
      title={isEdit ? '修改数据源' : '新增数据源'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem key="name" {...formLayout} label="数据源名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入至少三个字符的规则描述！', min: 3, max: 20 }],
          initialValue: recordValue.name
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem key="type" {...formLayout} label="数据源类型">
        {form.getFieldDecorator('type', {
          rules: [{ required: true, message: '数据源类型必须选择' }],
          initialValue: recordValue.type
        })(
          <Select style={{ width: '100%' }} placeholder="请选择数据源类型" onChange={handleDtChange}>
            {
              DATASOURCE_TYPE.map((item, index) => (
                <Option value={item.type} key={index}>{item.type}</Option>
              ))
            }
          </Select>
        )}
      </FormItem>
      <FormItem key="jdbcDriver" {...formLayout} label="JDBC驱动">
        {form.getFieldDecorator('jdbcDriver', {
          rules: [{ required: true, message: '请输入数据源驱动！' }],
          initialValue: recordValue.jdbcDriver
        })(<Input placeholder="请输入数据源驱动" />)}
      </FormItem>
      <FormItem key="jdbcUrl" {...formLayout} label="JDBC URL">
        {form.getFieldDecorator('jdbcUrl', {
          rules: [{ required: true, message: '请输入数据源URL！' }],
          initialValue: recordValue.jdbcUrl
        })(<Input placeholder="请输入数据源URL" />)}
      </FormItem>
      <FormItem key="username" {...formLayout} label="用户名">
        {form.getFieldDecorator('username', {
          initialValue: recordValue.username
        })(<Input placeholder="请输入用户名" />)}
      </FormItem>
      <FormItem key="password" {...formLayout} label="密码">
        {form.getFieldDecorator('password', {
          initialValue: recordValue.password
        })(<Input placeholder="请输入密码" />)}
      </FormItem>
      <FormItem key="timeout" {...formLayout} label="连接池超时时间(分)">
        {form.getFieldDecorator('timeout', {
          initialValue: recordValue.tiemout || 1
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
      <FormItem key="testSql" {...formLayout} label="连接测试sql">
        {form.getFieldDecorator('testSql', {
          initialValue: recordValue.testSql
        })(<Input placeholder="SELECT 1" />)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
@connect(({ datasource, user, loading }) => ({
  datasource,
  user,
  loading: loading.models.datasource
}))
class DatasourceManage extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    recordValue: {},
    isEditForm: false, // 是否为编辑数据
    formValues: {}
  };

  columns = [
    {
      title: '数据源类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '数据源名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '数据源URL',
      dataIndex: 'jdbcUrl',
      key: 'jdbcUrl'
    },
    {
      title: '登录账号',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filters: [
        {
          text: status[0],
          value: 0
        },
        {
          text: status[1],
          value: 1
        }
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />
      }
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Fragment>
          <Popconfirm placement="top" title="确定删除该数据源？"
            onConfirm={() => this.handleDelete(record)}>
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => this.handleModalVisible(true, record, true)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm placement="top" title={record.status === 0 ? '确定停用' : '确定启用'}
            onConfirm={() => this.handleStatus(record)}>
            <a>{record.status === 0 ? '停用' : '启用'}</a>
          </Popconfirm>
        </Fragment>
      )
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'datasource/fetch'
    });
    // 获取所有用户
    dispatch({
      type: 'user/fetch'
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'datasource/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'datasource/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'datasource/fetch',
        payload: values,
      });
    });
  };

  // 数据源启、停用操作
  handleStatus = (record) => {
    const { dispatch } = this.props;
    const status = record.status === 0 ? 1 : 0;
    dispatch({
      type: 'datasource/changeStatus',
      payload: {
        status: status,
        dsId: record.id
      },
    });
    message.success('操作成功');
    // 重载数据
    this.reloadData();
  }

  // 删除操作处理
  handleDelete = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'datasource/remove',
      payload: record.id,
    });
    message.success('删除成功');
    // 重载数据
    this.reloadData();
  }

  handleModalVisible = (flag, record, isEdit) => {
    const { dispatch } = this.props;
    this.setState({
      modalVisible: !!flag,
      isEditForm: !!isEdit,
      recordValue: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'datasource/add',
      payload: fields,
    });

    message.success('添加成功');
    this.handleModalVisible();
    // 重载数据
    this.reloadData();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'datasource/update',
      payload: fields,
    });

    message.success('修改成功');
    this.handleModalVisible();
    // 重载数据
    this.reloadData();
  };

  // 重新加载数据
  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'datasource/fetch',
      payload: this.formValues,
    });
  }

  // 查询form
  renderForm() {
    const {
      form: { getFieldDecorator },
      user: { list },
    } = this.props;
    return (
      <Form key="search_form" onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem key="type" label="数据源">
              {getFieldDecorator('type')(
                <Select placeholder="请选择数据类型">
                  {
                    DATASOURCE_TYPE.map((item, index) => (
                      <Option value={item.type} key={index}>{item.type}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="status" label="源状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择数据状态">
                  <Option key="0" vallue="0">使用中</Option>
                  <Option key="1" vallue="1">已停用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="createdBy" label="创建人">
              {getFieldDecorator('createdBy')(
                <Select placeholder="请选择数据源创建人">
                  {
                    list.map((item, index) => (
                      <Option value={item.id} key={item.id}>{item.nickname}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="name" label="源名称">
              {getFieldDecorator('name')(<Input placeholder="请输入数据源名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="jdbcUrl" label="源URL">
              {getFieldDecorator('jdbcUrl')(<Input placeholder="请输入数据源URL" />)}
            </FormItem>
          </Col>
        </Row>
        <Divider type="horizontal" />
      </Form>
    )
  }

  render() {
    const { datasource: { data }, loading } = this.props;
    const { modalVisible, expandForm, recordValue, formValues, isEditForm } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate
    }
    return (
      <PageHeaderWrapper
        title="数据源管理"
        content="管理所有可用的数据源，为系统其他业务服务~"
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            {expandForm && (
              <div className={styles.tableListForm}>{this.renderForm()}</div>
            )}
            <div className={styles.tableListOperator}>
              <Button type="primary" icon="plus" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              <span className={styles.submitButtons}>
                <Button type="primary" onClick={this.handleSearch}>查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  {expandForm ? '收起' : '展开'}
                  <Icon type={expandForm ? 'up' : 'down'} />
                </a>
              </span>
            </div>
            <StandardTable
              disabledSelected={true}
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              rowKey={record => record.id}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          isEdit={isEditForm}
          recordValue={recordValue}
          modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default DatasourceManage;
