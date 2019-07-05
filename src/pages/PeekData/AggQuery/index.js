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
import AggQueryModal from './AggQueryModal';


const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ user, loading, tag, model }) => ({
  user,
  tag,
  model,
  loading: loading.models.tag,
}))
class AggQuery extends React.Component {
  state = {
    modalVisible: false,
    expandForm: false,
    formValues: {},
  };

  constructor(props) {
    super(props);
    // 表格字段列表
    this.columns = [
      { title: '所属模型', dataIndex: 'modelName', key: 'modelName' },
      { title: '名称', dataIndex: 'name', key: 'name' },
      { title: '创建人', dataIndex: 'creator', key: 'creator' },
      { title: '取数次数', dataIndex: 'peekTime', key: 'peekTime' },
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
            <Divider type="vertical" />
            <a onClick={() => this.handleModalVisible(true, record, true)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              placement="top"
              title="导出数据到邮箱"
              onConfirm={() => this.exportData(record)}
            >
              <a>导出</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({type: "model/fetchAll"});
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
      }
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
      <div className={styles.queryForm}>
        <Form key="peekForm" layout="inline">
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

  renderModal () {
    const {modalVisible, record} = this.state;
    if (!modalVisible){
      return;
    }
    return <AggQueryModal />
  }



  render() {
    const {
      tag: { data },
      loading,
    } = this.props;

    return (
      <PageHeaderWrapper title="聚合取数" content="支持基于维度指标的聚合取数功能">
        <Card bordered={false}>
          <div className={styles.aggQuery}>
            {this.renderForm()}
            {this.renderOperators()}
            <StandardTable
              data={data}
              loading={loading}
              rowKey={record => record.id}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
            {this.renderModal()}
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AggQuery;
