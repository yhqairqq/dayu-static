import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Tag,
  Popconfirm,
  message,
  Divider,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import UserOptForm from './components/UserOptForm';
import DataDimensionOpt from './components/DataDimensionOpt';

import styles from '../../styles/Manage.less';

const { Option } = Select;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ user, role, loading }) => ({
  user,
  role,
  loading: loading.models.user,
}))
class UserManage extends React.Component {
  state = {
    modalVisible: false,
    modalDataAuthVisible: false,
    expandForm: false,
    isEditForm: false,
    recordValue: {},
    formValues: {},
  };

  // 表格字段
  columns = [
    { title: '昵称', dataIndex: 'nickname' },
    { title: '登录名', dataIndex: 'username' },
    {
      title: '拥有角色',
      dataIndex: 'roleNames',
      render: text => (
        <span>
          {text.map(t => (
            <Tag color="blue" key={t}>
              {t}
            </Tag>
          ))}
        </span>
      ),
    },
    { title: '所在部门', dataIndex: 'department' },
    { title: '职位', dataIndex: 'position' },
    { title: '邮箱', dataIndex: 'email' },
    { title: '电话', dataIndex: 'phone' },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => (
        <Fragment>
          <Popconfirm
            placement="top"
            title="确定删除该用户？"
            onConfirm={() => this.handleDelete(record)}
          >
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm
            placement="top"
            title="确定初始化密码？"
            onConfirm={() => this.resetPwd(record)}
          >
            <a>初始化密码</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => this.handleModalVisible(true, record, true)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDataAuthVisible(true, record)}>数据维度权限</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchByParams',
    });

    dispatch({
      type: 'role/fetchAll',
    });
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
    this.setState({
      modalVisible: !!flag,
      isEditForm: !!isEdit,
      recordValue: record || {},
    });
  };

  handleDataAuthVisible = (flag, record) => {
    this.setState({
      modalDataAuthVisible: !!flag,
      recordValue: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        // 重载数据
        this.reloadData();
      },
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
      },
    });
  };

  // 删除操作处理
  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/remove',
      payload: record.id,
      callback: () => {
        message.success('删除成功');
        // 重载数据
        this.reloadData();
      },
    });
  };

  // 重置密码
  resetPwd = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/resetPwd',
      payload: record.id,
      callback: () => {
        message.success('重置密码成功');
        // 重载数据
        this.reloadData();
      },
    });
  };

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
          params: values,
        },
      });
    });
  };

  // 数据维度设置
  handleDataAuthModalVisible = (flag, record) => {
    this.setState({
      modalDataAuthVisible: !!flag,
      recordValue: record || {},
    });
  };

  // 保存数据维度信息
  saveDataDimension = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/dataDimensionSave',
      payload: fields,
      callback: () => {
        message.success('表格字段保存成功');
        this.handleDataAuthModalVisible();
        // 重载数据
        this.reloadData();
      },
    });
  };

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
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'user/fetchByParams',
      payload: {
        params,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };

  // 查询表单
  renderForm() {
    const {
      form: { getFieldDecorator },
      role: { allRoles },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem key="roleId" label="拥有角色">
              {getFieldDecorator('roleId')(
                <Select key="roleId" placeholder="请选择所属应用">
                  {allRoles.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
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
    );
  }

  render() {
    const {
      user: { data },
      loading,
    } = this.props;
    const { modalVisible, modalDataAuthVisible, expandForm, recordValue, isEditForm } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="用户管理" content="对系统用户进行增删改查等操作~">
        <Card bordered={false}>
          <div className={styles.Manage}>
            {expandForm && <div className={styles.ManageForm}>{this.renderForm()}</div>}
            <div className={styles.ManageOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleModalVisible(true, {}, false)}
              >
                添加新用户
              </Button>
              <span className={styles.querySubmitButtons}>
                <Button type="primary" onClick={this.handleSearch}>
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  {expandForm ? '收起' : '展开'}
                  <Icon type={expandForm ? 'up' : 'down'} />
                </a>
              </span>
            </div>
            <StandardTable
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
        {modalDataAuthVisible && (
          <DataDimensionOpt
            handleOpt={this.saveDataDimension}
            handleModalVisible={this.handleDataAuthModalVisible}
            values={recordValue}
            modalVisible={modalDataAuthVisible}
          />
        )}
      </PageHeaderWrapper>
    );
  }
}

export default UserManage;
