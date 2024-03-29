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
  Popconfirm,
  Row,
  Spin,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AuthorizedButton from '@/components/AuthorizedButton';

import styles from './index.less';
import AggQueryModal from './AggQueryModal';

const FormItem = Form.Item;

@Form.create()
@connect(({ user, loading, tag, model, peek }) => ({
  user,
  tag,
  model,
  peek,
  loading: loading.models.peek,
}))
class AggQuery extends React.Component {
  state = {
    modalVisible: false,
    expandForm: false,
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
            <AuthorizedButton mask={['DEL']}>
              <Popconfirm
                placement="top"
                title="确定删除该模型？"
                onConfirm={() => this.handleDelete(record)}
              >
                <a>删除</a>
              </Popconfirm>
            </AuthorizedButton>
            <AuthorizedButton mask={['EDIT']}>
              <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
            </AuthorizedButton>
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
    const { dispatch } = this.props;
    dispatch({ type: 'model/fetchAll' });
    this.reloadData();
  }

  // 删除操作处理
  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'peek/remove',
      payload: record.id,
      callback: () => {
        message.success('删除成功');
        // 重载数据
        this.reloadData();
      },
    });
  };

  exportData = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'peek/sendData2Me',
      payload: record.id,
      callback: msg => {
        message.success(msg);
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
      () => !visible && reload && this.reloadData()
    );
  };

  // 重新加载数据
  reloadData = pagination => {
    const { pageSize = 10, current = 1 } = pagination || {};
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.doQuery({
        params: { ...fieldsValue, newVersion: true },
        pageSize,
        currentPage: current,
      });
    });
  };

  doQuery = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'peek/fetch',
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
    this.reloadData();
  };

  // 分页、过滤、排序处理
  handleStandardTableChange = pagination => {
    this.reloadData(pagination);
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
        <AuthorizedButton mask={['ADD']}>
          <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
            新建
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
    );
  }

  renderModal() {
    const { modalVisible, record } = this.state;
    if (!modalVisible) {
      return null;
    }
    const parentMethod = {
      handleSaveEvent: this.handleSaveEvent,
      handleModalVisible: this.handleModalVisible,
    };
    return <AggQueryModal item={record} {...parentMethod} />;
  }

  render() {
    const { peek = {}, loading } = this.props;
    const { data } = peek;

    return (
      <PageHeaderWrapper title="高级取数" content="支持基于聚合函数的取数功能">
        <Spin spinning={loading} tip="查询中...">
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
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default AggQuery;
