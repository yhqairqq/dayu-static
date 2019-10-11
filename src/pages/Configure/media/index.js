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
  Popover,
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
@connect(({ media, loading }) => ({
  media,
  loading: loading.models.media,
}))
class Media extends React.Component {
  state = {};
  columns = [
    { title: '编号', dataIndex: 'id' },
    { title: 'schema name', dataIndex: 'namespace' },
    { title: 'table name', dataIndex: 'name' },
    { title: 'topic name', dataIndex: 'topic' },
    {
      title: '数据源',
      render: (text, record) => (
        <Popover content={record.source.url} title="URL" trigger="hover">
          {<a>{record.source && record.source.name}</a>}
        </Popover>
      ),
    },
    { title: '数据源类型', dataIndex: 'source.type' },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a>查看</a>
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
      type: 'media/fetch',
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
      type: 'mediasource/fetch',
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
      media: { medias },
    } = this.props;
    const {} = this.state;
    console.log(medias);
    return (
      <PageHeaderWrapper title="配置管理" content="映射表模板">
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
            data={medias}
            columns={this.columns}
            rowKey={record => record.id}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Media;
