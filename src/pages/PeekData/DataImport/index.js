/**
 * Author: feixy
 * Date: 2019-06-25
 * Time: 10:23
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Spin, Divider, Row, Col, Input, Button, Icon, Tag } from 'antd';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ImportModal from './ImportModal';
import styles from './index.less';
import StandardTable from '../../../components/StandardTable';
import PreviewModal from './PreviewModal';

const FormItem = Form.Item;
@Form.create()
@connect(({ user, loading, model, peek }) => ({
  user,
  model,
  peek,
  loading: loading.models.peek,
}))
class DataImportList extends React.Component {
  state = {
    importModalVisible: false,
    expandForm: false,
    item: {},

    data: {
      list: [],
      pagination: { pageSize: 10, current: 1, total: 0 },
    },
    queryParams: {},
  };

  constructor(props) {
    super(props);
    // 表格字段列表
    this.columns = [
      { title: '序号', key: 'seq', render: (text, record, index) => index + 1 },
      { title: '用户名', dataIndex: 'creator', key: 'creator' },
      {
        title: '上传时间',
        dataIndex: 'created',
        key: 'created',
        render: text => moment.unix(text).format('YYYY-MM-DD hh:mm:ss'),
      },
      { title: '文件', dataIndex: 'fileName' },

      { title: '数据源', dataIndex: 'datasourceType' },
      { title: '数据库', dataIndex: 'datasourceName' },
      { title: '表名', dataIndex: 'tableName' },
      { title: '分区名', dataIndex: 'partitionName' },
      {
        title: '是否覆盖',
        dataIndex: 'overwrited',
        render: text => (text === 1 ? <Tag color="green">是</Tag> : <Tag color="cyan">否</Tag>),
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleModalVisible(true, record)}>查看</a>
            <Divider type="vertical" />
            <a onClick={() => this.handlePreviewModalVisible(true, record)}>数据预览</a>
          </Fragment>
        ),
      },
    ];
  }

  componentDidMount() {
    this.doQuery();
  }

  onQueryParamsChange = (prop, mapper = e => e) => value => {
    const { queryParams } = this.state;
    this.setState({
      queryParams: {
        ...queryParams,
        [prop]: mapper(value),
      },
    });
  };

  getQueryParams = () => {
    const { queryParams } = this.state;
    return queryParams;
  };

  resetQueryParams = () => {
    this.setState({
      queryParams: {},
    });
  };

  doQuery = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'peek/fetchImportRecordList',
      payload: { params: this.getQueryParams() },
      callback: data => {
        this.setState({
          data,
        });
      },
    });
  };

  renderImportModal = () => {
    const { importModalVisible, item } = this.state;
    if (!importModalVisible) {
      return null;
    }
    return <ImportModal item={item} handleModalVisible={this.handleModalVisible} />;
  };

  renderForm = () => {
    const { expandForm, queryParams } = this.state;
    if (!expandForm) {
      return null;
    }

    return (
      <div className={styles.queryForm}>
        <Form key="queryForm" onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem key="fileName" label="导入文件">
                <Input
                  placeholder="请输入文件名"
                  value={queryParams.fileName}
                  onChange={this.onQueryParamsChange('fileName', e => e.target.value)}
                />
              </FormItem>
            </Col>
          </Row>
          <Divider type="horizontal" />
        </Form>
      </div>
    );
  };

  handleModalVisible = (visible = false, record = {}, reload = false) => {
    this.setState(
      {
        importModalVisible: visible,
        item: record,
      },
      () => reload && this.doQuery()
    );
  };

  handlePreviewModalVisible = (visible = false, record = {}) => {
    this.setState({
      previewModalVisible: visible,
      item: record,
    });
  };

  renderPreviewModal = () => {
    const { previewModalVisible, item } = this.state;
    if (!previewModalVisible) {
      return null;
    }
    return (
      <PreviewModal
        modalVisible={previewModalVisible}
        item={item}
        handleModalVisible={this.handlePreviewModalVisible}
      />
    );
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderOperators = () => {
    const { expandForm } = this.state;
    return (
      <div className={styles.operators}>
        <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
          新建
        </Button>
        <span className={styles.querySubmitButtons}>
          <Button type="primary" onClick={this.doQuery}>
            查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={this.resetQueryParams}>
            重置
          </Button>
          <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
            {expandForm ? '收起' : '展开'}
            <Icon type={expandForm ? 'up' : 'down'} />
          </a>
        </span>
      </div>
    );
  };

  render() {
    const { loading } = this.props;
    const { data } = this.state;
    return (
      <PageHeaderWrapper title="数据导入" content="支持外部数据导入,目前只支持.xlsx格式文件">
        <Spin spinning={false} tip="查询中...">
          <Card bordered={false}>
            <div className={styles.importContainer}>
              {this.renderForm()}
              {this.renderOperators()}
              <StandardTable
                data={data}
                loading={loading}
                rowKey={record => record.id}
                columns={this.columns}
              />
              {this.renderImportModal()}
              {this.renderPreviewModal()}
            </div>
          </Card>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default DataImportList;
