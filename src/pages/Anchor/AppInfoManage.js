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
  Divider,
} from 'antd';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AuthorizedButton from '@/components/AuthorizedButton';
import CerebrumOptForm from './form/AppInfoOptForm';

import styles from '../styles/Manage.less';

const { Option } = Select;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ user, role, loading, appinfo }) => ({
  user,
  role,
  loading: loading.models.user,
  appinfo,
}))
class CereBrumManage extends React.Component {
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
      title: '平台',
      dataIndex: 'platform',
      render(text) {
        const str = text;
        if (str === 0) return `移动端`;
        if (str === 1) return `html5`;
        if (str === 2) return `WEB`;
        if (str === 3) return `小程序`;
        return ``;
      },
    },
    {
      title: '应用类型',
      dataIndex: 'type',
      render(text) {
        const str = text;
        if (str === 0) return `呆萝卜`;
        if (str === 1) return `合伙人`;
        return ``;
      },
    },
    { title: '应用名', dataIndex: 'name' },
    { title: 'appKey', dataIndex: 'appKey' },
    {
      title: '创建时间',
      dataIndex: 'created',
      render: (text, record) => moment.unix(record.created).format('YYYY-MM-DD hh:mm:ss'),
    },
    { title: '创建人', dataIndex: 'creator' },
    { title: '备注', dataIndex: 'comment' },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => (
        <Fragment>
          <AuthorizedButton mask={['DEL']}>
            <Popconfirm
              placement="top"
              title="确定删除该应用？"
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
      type: 'appinfo/fetchByParams',
    });
    dispatch({
      type: 'user/fetch',
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'appinfo/fetchByParams',
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
      type: 'appinfo/add',
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
      type: 'appinfo/update',
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
      type: 'appinfo/remove',
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
      type: 'appinfo/fetchByParams',
      payload: {},
    });
    dispatch({
      type: 'user/fetch',
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
        type: 'appinfo/fetchByParams',
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
      type: 'appinfo/fetchByParams',
      payload: {
        params,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      user: { list },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem key="appKey" label="appKey">
              {getFieldDecorator('appKey')(<Input placeholder="请输入appKey" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="name" label="应用名">
              {getFieldDecorator('name')(<Input placeholder="请输入应用名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="platform" label="平台">
              {getFieldDecorator('platform')(
                <Select key="platform" placeholder="请选择平台类型">
                  <Option value="0" key="0">
                    移动端
                  </Option>
                  <Option value="1" key="1">
                    html5
                  </Option>
                  <Option value="2" key="2">
                    WEB
                  </Option>
                  <Option value="3" key="3">
                    小程序
                  </Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="type" label="类型">
              {getFieldDecorator('type')(
                <Select key="type" placeholder="请选择应用类型">
                  <Option value="0" key="0">
                    呆萝卜
                  </Option>
                  <Option value="1" key="1">
                    合伙人
                  </Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="createdBy" label="创建人">
              {getFieldDecorator('createdBy')(
                <Select key="createdBy" placeholder="请选择创建人">
                  {list.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.nickname}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Divider type="horizontal" />
      </Form>
    );
  }

  render() {
    const {
      appinfo: { data },
      loading,
    } = this.props;
    const { modalVisible, expandForm, recordValue, isEditForm } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="埋点应用管理" content="对埋点应用进行增删改查等操作~">
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
                  添加新埋点应用
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
          <CerebrumOptForm
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

export default CereBrumManage;
