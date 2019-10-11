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
import NodeForm from './component/NodeForm';
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ node, loading }) => ({
  node,
  loading: loading.models.node,
}))
class Node extends React.Component {
  state = {};
  columns = [
    { title: '编号', dataIndex: 'id' },
    { title: '名称', dataIndex: 'name' },
    { title: 'IP', dataIndex: 'ip' },
    { title: '端口', dataIndex: 'port' },
    {
      title: '状态',
      dataIndex: 'status',
      render: text => (
        <span>
          {text === 'STOP' ? (
            <Badge status="error" text="停止"></Badge>
          ) : (
            <Badge status="processing" text="开启"></Badge>
          )}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a>查看</a>
          <Divider type="vertical"></Divider>
          <a onClick={() => this.handleModalVisible(true, record, true)}>编辑</a>
          <Divider type="vertical"></Divider>
          {!record.used ? (
            <Popconfirm
              placement="top"
              title="确实删除"
              onConfirm={() => this.handleDelete(record)}
            >
              <a>删除</a>
            </Popconfirm>
          ) : (
            '删除'
          )}
        </span>
      ),
    },
  ];
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'node/fetch',
    });
  }

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'node/add',
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
      type: 'node/update',
      payload: fields,
      callback: () => {
        message.success('修改成功');
        this.handleModalVisible();
        // 重载数据
        this.reloadData();
      },
    });
  };
  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'node/remove',
      payload: {
        id: record.id,
      },
      callback: () => {
        message.success('删除成功');
        // 重载数据
        this.reloadData();
      },
    });
  };
  handleModalVisible = (flag, record, isEdit) => {
    this.setState({
      modalVisible: !!flag,
      isEditForm: !!isEdit,
      recordValue: record || {},
    });
  };
  reloadData = () => {
    const { dispatch, recordValue } = this.props;
    dispatch({
      type: 'node/fetch',
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
      type: 'node/fetch',
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
      node: { data },
    } = this.props;
    const { modalVisible, isEditForm, recordValue } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="集群管理" content="计算节点管理">
        <Card bordered={false}>
          <Button
            style={{
              marginLeft: '10px',
            }}
            type="primary"
            icon="plus"
            onClick={() => this.handleModalVisible(true, {}, false)}
          >
            新增
          </Button>
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
        {modalVisible && (
          <NodeForm
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
export default Node;
