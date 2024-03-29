import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Table,
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Popconfirm,
  TreeSelect,
  message,
  Divider,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ResOptForm from './components/ResOptForm';
import AuthorizedButton from '@/components/AuthorizedButton';

import styles from '../../styles/Manage.less';

const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ resource, loading }) => ({
  resource,
  loading: loading.models.resource,
}))
class ResManage extends React.Component {
  state = {
    modalVisible: false,
    expandForm: false,
    isEditForm: false,
    recordValue: {},
    formValues: {},
  };

  // 表格字段
  columns = [
    {
      title: '资源名称',
      dataIndex: 'name',
      render: (text, record) => (
        <Fragment>
          {record.icon ? <Icon type={record.icon} /> : ''}&nbsp;&nbsp;<span>{text}</span>
        </Fragment>
      ),
    },
    { title: '路径', dataIndex: 'path' },
    {
      title: '菜单',
      dataIndex: 'type',
      render: (text, record) => <span>{record.type === 0 ? '是' : '否'}</span>,
    },
    { title: '权限编码', dataIndex: 'authCode' },
    { title: '描述', dataIndex: 'comment' },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => (
        <Fragment>
          <AuthorizedButton mask={['DEL']}>
            <Popconfirm
              placement="top"
              title="确定删除该资源？"
              onConfirm={() => this.handleDelete(record)}
            >
              <a>删除</a>
            </Popconfirm>
          </AuthorizedButton>
          <AuthorizedButton mask={['EDIT']}>
            <a onClick={() => this.handleModalVisible(true, record, true)}>编辑</a>
          </AuthorizedButton>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'resource/fetch',
    });
    dispatch({
      type: 'resource/fetchAllParent',
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'resource/fetch',
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

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resource/add',
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
      type: 'resource/update',
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
      type: 'resource/remove',
      payload: record.id,
      callback: () => {
        message.success('删除成功');
        // 重载数据
        this.reloadData();
      },
    });
  };

  // 重新加载数据
  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resource/fetch',
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
        type: 'resource/fetch',
        payload: {
          params: values,
        },
      });
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
      type: 'resource/fetch',
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
      resource: { allParents },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem key="parentId" label="父节点">
              {getFieldDecorator('parentId')(
                <TreeSelect
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={allParents}
                  treeDefaultExpandAll
                  placeholder="请选择父节点"
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="name" label="资源名">
              {getFieldDecorator('name')(<Input placeholder="请输入资源名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="authCode" label="权限编码">
              {getFieldDecorator('authCode')(<Input placeholder="请输入权限编码" />)}
            </FormItem>
          </Col>
        </Row>
        <Divider type="horizontal" />
      </Form>
    );
  }

  render() {
    const {
      resource: { data },
      loading,
    } = this.props;
    const { modalVisible, expandForm, recordValue, isEditForm } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="系统资源管理" content="对系统资源进行增删改查操作~">
        <Card bordered={false}>
          <div className={styles.Manage}>
            {expandForm && <div className={styles.ManageForm}>{this.renderForm()}</div>}
            <div className={styles.ManageOperator}>
              <AuthorizedButton mask={['ADD']}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleModalVisible(true, {}, false)}
                >
                  添加资源
                </Button>
              </AuthorizedButton>
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
            <Table
              loading={loading}
              dataSource={data}
              columns={this.columns}
              rowKey={record => record.id}
            />
          </div>
        </Card>
        {modalVisible && (
          <ResOptForm
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

export default ResManage;
