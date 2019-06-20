import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
  Popconfirm,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import UserOptForm from './form/UserOptForm';

import styles from '../styles/Manage.less';

const FormItem = Form.Item;

@Form.create()
@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user
}))
class UserManage extends React.Component {
  state = {
    modalVisible: false,
    expandForm: false,
    isEditForm: false,
    recordValue: {},
    formValues: {}
  }
  // 表格字段
  columns = [
    { title: '昵称', dataIndex: 'nickname' },
    { title: '登录名', dataIndex: 'username' },
    {
      title: '所属应用', dataIndex: 'appId', filters: [
        { text: '拉冬系统', value: 0 },
        { text: '日报看板', value: 1 }
      ], render(val) {
        return <span>{val === 0 ? '拉冬系统' : '日报看板'}</span>;
      }
    },
    { title: '所在部门', dataIndex: 'department' },
    { title: '职位', dataIndex: 'position' },
    { title: '邮箱', dataIndex: 'email' },
    {
      title: '操作', dataIndex: 'option', render: (text, record) => (
        <Fragment>
          <Popconfirm placement="top" title="确定删除该用户？"
            onConfirm={() => this.handleDelete(record)}>
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm placement="top" title="确定初始化密码？"
            onConfirm={() => this.resetPwd(record)}
          >
            <a>初始化密码</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => this.handleModalVisible(true, record, true)}>编辑</a>

        </Fragment>
      )
    }
  ]
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchByParams'
    })
  }
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'user/fetchByParams',
      payload: {},
    });
  };
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
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
    console.log(fields)
    dispatch({
      type: 'user/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        // 重载数据
        this.reloadData();
      }
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/update',
      payload: fields,
      callback: () => {
        message.success('修改成功');
        this.handleModalVisible();
        // 重载数据
        this.reloadData();
      }
    });
  };

  // 删除操作处理
  handleDelete = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/remove',
      payload: record.id,
      callback: () => {
        message.success('删除成功');
        // 重载数据
        this.reloadData();
      }
    });
  };

  // 重置密码
  resetPwd = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/resetPwd',
      payload: record.id,
      callback: () => {
        message.success('重置密码成功');
        // 重载数据
        this.reloadData();
      }
    });
  }
  // 重新加载数据
  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchByParams',
      payload: {},
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
        type: 'user/fetchByParams',
        payload: {
          params: values
        },
      });
    });
  }

  // 分页、过滤、排序处理
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      ...formValues,
      ...filters
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'user/fetchByParams',
      payload: {
        params,
        currentPage: pagination.current,
        pageSize: pagination.pageSize
      }
    });
  }

  // 查询表单
  renderForm() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem key="appId" label="所属应用">
              {getFieldDecorator('appId')(
                <Select key="appId" placeholder="请选择所属应用">
                  <Option value="0" key="0">拉冬系统</Option>
                  <Option value="1" key="1">日报看板</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="username" label="登录名">
              {getFieldDecorator('username')(<Input placeholder="请输入登录名" />)}
            </FormItem>
          </Col>
        </Row>
        <Divider type="horizontal" />
      </Form>
    )
  }

  render() {
    const { user: { data }, loading } = this.props;
    const { modalVisible, expandForm, recordValue, isEditForm } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate
    }
    return (
      <PageHeaderWrapper
        title="用户管理"
        content='对系统用户进行增删改查等操作~'
      >
        <Card bordered={false}>
          <div className={styles.Manage}>
            {expandForm && (
              <div className={styles.ManageForm}>{this.renderForm()}</div>
            )}
            <div className={styles.ManageOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, {}, false)}>添加新用户</Button>
              <span className={styles.querySubmitButtons}>
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
              rowKey={record => record.id}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {modalVisible && (
          <UserOptForm
            {...parentMethods}
            isEdit={isEditForm}
            values={recordValue}
            modalVisible={modalVisible}
          />
        )}
      </PageHeaderWrapper>
    );
  }
}

export default UserManage;