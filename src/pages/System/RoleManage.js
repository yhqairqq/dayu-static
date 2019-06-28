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
  Popconfirm,
  message,
  Divider
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import RoleOptForm from './form/RoleOptForm';
import AllotRes2Role from './form/AllotRes2Role';

import styles from '../styles/Manage.less';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@Form.create()
@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role
}))
class RoleManage extends React.Component {
  state = {
    allotResVisible: false, // 分配资源弹框可视化
    modalVisible: false,
    expandForm: false,
    isEditForm: false,
    recordValue: {},
    formValues: {}
  }

  // 表格字段
  columns = [
    { title: '角色名称', dataIndex: 'name' },
    { title: '角色编码', dataIndex: 'code' },
    {
      title: '角色类型', dataIndex: 'type', filters: [
        { text: '待授权', value: 0 },
        { text: '默认权限', value: 1 }
      ], render(val) {
        return <span>{val === 0 ? '待授权' : '默认权限'}</span>;
      }
    },
    {
      title: '操作', dataIndex: 'option', render: (text, record) => (
        <Fragment>
          <Popconfirm placement="top" title="确定删除该角色？" onConfirm={() => this.handleDelete(record)}>
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => this.handleAllotModalVisible(true, record)}>分配资源</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleModalVisible(true, record, true)}>编辑</a>

        </Fragment>
      )
    }
  ]

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetch'
    })
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'role/fetch',
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

  handleAllotModalVisible = (flag, record) => {
    this.setState({
      allotResVisible: !!flag,
      recordValue: record || {},
    });
  };

  handleAllotUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/saveRoleRes',
      payload: fields,
      callback: () => {
        message.success('设置角色资源成功');
        this.handleAllotModalVisible();
        // 重载数据
        this.reloadData();
      }
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/add',
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
      type: 'role/update',
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
      type: 'role/remove',
      payload: record.id,
      callback: () => {
        message.success('删除成功');
        // 重载数据
        this.reloadData();
      }
    });
  };

  // 重新加载数据
  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetch',
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
        type: 'role/fetch',
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
      type: 'role/fetch',
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
            <FormItem key="type" label="角色类型">
              {getFieldDecorator('type')(
                <Select key="type" placeholder="请选择角色类型">
                  <Option value="0" key="0">待授权</Option>
                  <Option value="1" key="1">默认角色</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="name" label="角色名">
              {getFieldDecorator('name')(<Input placeholder="请输入角色名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="code" label="角色编码">
              {getFieldDecorator('code')(<Input placeholder="请输入角色编码" />)}
            </FormItem>
          </Col>
        </Row>
        <Divider type="horizontal" />
      </Form>
    )
  }

  render() {
    const { role: { data }, loading } = this.props;
    const { modalVisible, allotResVisible, expandForm, recordValue, isEditForm } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate
    }
    return (
      <PageHeaderWrapper
        title="用户角色管理"
        content='对系统角色进行增删改查操作~'
      >
        <Card bordered={false}>
          <div className={styles.Manage}>
            {expandForm && (
              <div className={styles.ManageForm}>{this.renderForm()}</div>
            )}
            <div className={styles.ManageOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, {}, false)}>添加新角色</Button>
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
          <RoleOptForm
            {...parentMethods}
            isEdit={isEditForm}
            values={recordValue}
            modalVisible={modalVisible}
          />
        )}
        {allotResVisible && (
          <AllotRes2Role
            handleModalVisibl={this.handleAllotModalVisible}
            handleUpdate={this.handleAllotUpdate}
            values={recordValue}
            allotResVisible={allotResVisible}
          />
        )}
      </PageHeaderWrapper>
    );
  }
}

export default RoleManage;