/**
 * Author: feixy
 * Date: 2019-06-25
 * Time: 10:23
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';

import styles from './index.less';

const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const TagFormModal = Form.create()(props => {
  const { record = {}, isEdit = false, form, handleModalVisible, dispatch, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'tag/saveTag',
        payload: fieldsValue,
        callback: () => {
          message.success(!fieldsValue.id ? '修改成功' : '添加成功');
          handleModalVisible(false, {}, true);
        },
      });
    });
  };

  const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 15 },
  };

  return (
    <Modal
      destroyOnClose
      style={{ top: 20 }}
      title={isEdit ? '修改标签' : '新增标签'}
      visible
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <FormItem key="id" {...formLayout} label="数据源名称" style={{ display: 'none' }}>
        {form.getFieldDecorator('id', {
          initialValue: record.id,
        })(<Input />)}
      </FormItem>
      <FormItem key="name" {...formLayout} label="标签名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入标签名称！', min: 3, max: 20 }],
          initialValue: record.name,
        })(<Input placeholder="请输入标签名称" />)}
      </FormItem>
      <FormItem key="rule" {...formLayout} label="匹配值">
        {form.getFieldDecorator('rule', {
          rules: [{ required: true, message: '请输入匹配值' }],
          initialValue: record.rule,
        })(<Input placeholder="请输入匹配值" />)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
@connect(({ user, loading, tag }) => ({
  user,
  tag,
  loading: loading.models.tag,
}))
class TagList extends React.Component {
  state = {
    modalVisible: false,
    expandForm: false,
    formValues: {},
  };

  constructor(props) {
    super(props);
    // 表格字段列表
    this.columns = [
      { title: '序号', key: 'seq', render: (text, record, index) => index + 1 },
      { title: '名称', dataIndex: 'name', key: 'name' },
      { title: '匹配值', dataIndex: 'rule', key: 'rule' },
      { title: '创建人', dataIndex: 'creator', key: 'creator' },
      {
        title: '最后修改时间',
        dataIndex: 'modified',
        key: 'modified',
        render: (text, record) =>
          moment.unix(record.modified || record.created).format('YYYY-MM-DD hh:mm:ss'),
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <Popconfirm
              placement="top"
              title="确定删除该模型？"
              onConfirm={() => this.handleDelete(record)}
            >
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
  }

  componentDidMount() {
    this.reloadData();
  }

  // 删除操作处理
  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tag/remove',
      payload: record.id,
      callback: () => {
        message.success('删除成功');
        // 重载数据
        this.reloadData();
      },
    });
  };

  handleModalVisible = (visible = false, record = {}, reload = false) => {
    this.setState(
      {
        modalVisible: visible,
        record,
      },
      () => reload && this.reloadData()
    );
  };

  // 重新加载数据
  reloadData = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tag/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.reloadData();
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.reloadData({ params: fieldsValue });
    });
  };

  // 分页、过滤、排序处理
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
    this.reloadData({
      params,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  // 查询form表单
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { expandForm } = this.state;
    if (!expandForm) {
      return null;
    }

    return (
      <div className={styles.conditionForm}>
        <Form key="peekForm" onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem key="name" label="标签名称">
                {getFieldDecorator('name')(<Input placeholder="请输入取数名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Divider type="horizontal" />
        </Form>
      </div>
    );
  }

  renderOperators() {
    const { expandForm } = this.state;
    return (
      <div className={styles.operators}>
        <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
          新建
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
    );
  }

  renderTagFormModal() {
    const { modalVisible, record } = this.state;
    const { dispatch, loading } = this.props;
    if (!modalVisible) {
      return null;
    }
    const params = {
      record,
      dispatch,
      loading,
      handleModalVisible: this.handleModalVisible,
    };
    return <TagFormModal {...params} />;
  }

  render() {
    const {
      tag: { data },
      loading,
    } = this.props;
    return (
      <PageHeaderWrapper title="分组管理" content="管理模型中字段的分组信息">
        <Card bordered={false}>
          <div className={styles.tags}>
            {this.renderForm()}
            {this.renderOperators()}
            <StandardTable
              data={data}
              loading={loading}
              rowKey={record => record.id}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
          {this.renderTagFormModal()}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TagList;
