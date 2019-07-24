import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Icon, Button, Form, Divider, Col, Row, Tag, Input } from 'antd';
import moment from 'moment';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import DetailInfo from './component/DetailInfo';

import styles from '../../styles/Manage.less';

const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ sqlRunLog, loading }) => ({
  sqlRunLog,
  loading: loading.models.sqlRunLog,
}))
class ReportLog extends React.Component {
  state = {
    modalVisible: false,
    expandForm: false,
    recordValue: {},
    formValues: {},
  };

  // 表格字段
  columns = [
    { title: '所属数据源', dataIndex: 'dsName' },
    { title: '报表名称', dataIndex: 'reportName' },
    { title: '耗时', dataIndex: 'elapsedTime', render: text => <span>{`${text}ms`}</span> },
    {
      title: '执行时间',
      dataIndex: 'created',
      render: text => <span>{this.formatTimestamp(text)}</span>,
    },
    {
      title: '状态',
      dataIndex: 'complete',
      render: text => (
        <Tag color={text === 1 ? 'blue' : 'red'} key={text}>
          {text === 1 ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleModalVisible(true, record, true)}>详情</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sqlRunLog/fetch',
    });
  }

  formatTimestamp = timestamp => {
    return moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss');
  };

  // 重新加载数据
  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sqlRunLog/fetch',
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
        type: 'sqlRunLog/fetch',
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
      type: 'sqlRunLog/fetch',
      payload: {
        params,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'sqlRunLog/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      recordValue: record || {},
    });
  };

  // 查询表单
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem key="reportName" label="报表名称">
              {getFieldDecorator('reportName')(<Input placeholder="请输入报表名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="reportCode" label="报表编码">
              {getFieldDecorator('reportCode')(<Input placeholder="请输入报表编码" />)}
            </FormItem>
          </Col>
        </Row>

        <Divider type="horizontal" />
      </Form>
    );
  }

  render() {
    const {
      loading,
      sqlRunLog: { data },
    } = this.props;
    const { modalVisible, expandForm, recordValue } = this.state;
    return (
      <PageHeaderWrapper title="报表日志查询" content="这里查询报表运行时日志~">
        <Card bordered={false}>
          <div className={styles.Manage}>
            {expandForm && <div className={styles.ManageForm}>{this.renderForm()}</div>}
            <div className={styles.ManageOperator} style={{ textAlign: 'right' }}>
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
          <DetailInfo
            handleModalVisible={this.handleModalVisible}
            values={recordValue}
            modalVisible={modalVisible}
          />
        )}
      </PageHeaderWrapper>
    );
  }
}

export default ReportLog;
