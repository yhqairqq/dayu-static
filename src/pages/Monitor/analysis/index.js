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
@connect(({ analysis, loading }) => ({
  analysis,
  loading: loading.models.analysis,
}))
class Analysis extends React.Component {
  state = {};
  columns = [
    { title: 'Channel名字', dataIndex: 'channelName' },
    { title: 'Pipeline信息', dataIndex: 'pipelineName' },
    { title: '延迟时间', dataIndex: 'delayTime' },
    {
      title: '最后采集间隔',
      dataIndex: 'lastUpdateDelay',
      render: text =>
        text > 1800 ? (
          <span
            style={{
              color: 'red',
            }}
          >
            {text} s
          </span>
        ) : (
          <span>{text} s</span>
        ),
    },
    { title: 'DB数量', dataIndex: 'dbStat.number' },
    { title: 'DB大小', dataIndex: 'dbStat.size' },
  ];
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'analysis/fetch',
    });
  }

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
      type: 'analysis/fetch',
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
      analysis: { data },
    } = this.props;
    const {} = this.state;
    return (
      <PageHeaderWrapper title="监控管理" content="Top列表">
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
      </PageHeaderWrapper>
    );
  }
}
export default Analysis;
