import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Icon,
  Button,
  Popconfirm,
  Form,
  Divider,
  Col,
  Tag,
  Row,
  Input,
  TreeSelect,
  Select,
  message,
  Badge,
  Table,
  Drawer,
  Modal,
} from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../styles/Manage.less';
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ logrecord, loading }) => ({
  logrecord,
  loading: loading.models.logrecord,
}))
class LogRecord extends React.Component {
  state = {
    exceptionVisible: false,
  };
  columns = [
    { title: '编号', dataIndex: 'id' },
    { title: 'channel信息', render: (text, record) => <a>{record.channel.id}</a> },
    {
      title: 'pipeline信息',
      render: (text, record) => (
        <a>{record.channel.pipelines.length > 0 && record.channel.pipelines[0].id}</a>
      ),
    },
    { title: 'Node信息', render: (text, record) => <a>{record.nid}</a> },
    { title: '日志标题', dataIndex: 'title' },
    {
      title: '日志内容',
      render: (text, record) => <a onClick={() => this.showException(record)}>点击查看详细信息</a>,
    },
    { title: '发生时间', dataIndex: 'gmtCreate' },
  ];
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'logrecord/fetch',
    });
  }
  showException = record => {
    this.setState({
      selectedRecord: record,
      exceptionVisible: true,
    });
  };
  handleExceptionVisible = exceptionVisible => {
    this.setState({
      exceptionVisible: exceptionVisible,
    });
  };

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
      type: 'logrecord/fetch',
      payload: {
        params,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };

  render() {
    const {
      loading,
      logrecord: { data },
      confirmLoading,
    } = this.props;
    const { exceptionVisible, selectedRecord } = this.state;
    return (
      <PageHeaderWrapper title="监控管理" content="日志管理">
        <Card bordered={false}>
          <div className={styles.message}>
            <div className={styles.ManageOperator}>
              <span className={styles.querySubmitButtons}>
                <Button type="primary">查询</Button>
              </span>
            </div>
          </div>
          <StandardTable
            loading={loading}
            data={data}
            columns={this.columns}
            rowKey={record => record.id}
            onChange={this.handleStandardTableChange}
          />
        </Card>
        <Modal
          destroyOnClose
          maskClosable={false}
          width={640}
          style={{ top: 20 }}
          bodyStyle={{ padding: '10px 10px' }}
          title={'异常信息'}
          visible={exceptionVisible}
          onCancel={() => this.handleExceptionVisible(false)}
          confirmLoading={confirmLoading}
          footer={[]}
        >
          {selectedRecord && selectedRecord.message}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default LogRecord;
