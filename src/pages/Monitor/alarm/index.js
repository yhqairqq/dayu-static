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
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
class Alarm extends React.Component {
  state = {};
  columns = [
    { title: '序号', dataIndex: 'id' },
    { title: 'PIPELINE通道', dataIndex: 'pipelineId' },
    { title: '监控项目', dataIndex: 'monitorName' },
    { title: '阈值', dataIndex: 'matchValue' },
    {
      title: '状态',
      dataIndex: 'status',
      render: text => (
        <span>
          {text === 'DISABLE' ? (
            <Badge status="error" text="停止"></Badge>
          ) : (
            <Badge status="processing" text="开启"></Badge>
          )}
        </span>
      ),
    },
    { title: '发送对象', dataIndex: 'receiverKey' },
    { title: '暂停时间', dataIndex: 'url' },

    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a>描述</a>
          <Divider type="vertical"></Divider>
          <a>历史</a>
          <Divider type="vertical"></Divider>
          <a>暂停</a>
          <Divider type="vertical"></Divider>
          <a>编辑</a>
          <Divider type="vertical"></Divider>
          <a>删除</a>
        </span>
      ),
    },
  ];
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
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
      type: 'alarm/fetch',
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
      rule: { data },
    } = this.props;
    const {} = this.state;
    return (
      <PageHeaderWrapper title="监控管理" content="监控列表">
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
export default Alarm;
