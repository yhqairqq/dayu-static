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

import ZookeeperForm from './component/ZookeeperForm';
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
@connect(({ zookeeper, loading }) => ({
  zookeeper,
  loading: loading.models.zookeeper,
}))
class Zookeeper extends React.Component {
  state = {
    modalVisible: false,
    isEditForm: false,
    recordValue: {},
  };
  columns = [
    { title: '编号', dataIndex: 'id' },
    { title: '集群名称', dataIndex: 'clusterName' },
    {
      title: '集群地址',
      dataIndex: 'serverList',
      render: text => (
        <span>
          [
          {text.map(t => (
            <span key={t}>{`${t}`}</span>
          ))}
          ]
        </span>
      ),
    },
    { title: '描述', dataIndex: 'description' },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={() => this.handleModalVisible(true, record, true)}>编辑</a>
          <Divider type="vertical"></Divider>
          <a onClick={() => this.zooRefresh(record)}>刷新</a>
          <Divider type="vertical"></Divider>
          <Popconfirm placement="top" title="确实删除" onConfirm={() => this.handleDelete(record)}>
            <a>删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ];
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'zookeeper/getZookeepers',
    });
  }

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'zookeeper/add',
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
      type: 'zookeeper/update',
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
      type: 'zookeeper/remove',
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
      type: 'zookeeper/fetch',
      payload: {
        params,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };
  reduction = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'zookeeper/reduction',
      callback: data => {
        message.success(data);
        // 重载数据
        // this.reloadData();
      },
    });
  };
  zooRefresh = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'zookeeper/refresh',
      payload: {
        id: record.id,
      },
      callback: () => {
        message.success('刷新成功');
      },
    });
  };
  reloadData = () => {
    const { dispatch, recordValue } = this.props;
    dispatch({
      type: 'zookeeper/getZookeepers',
    });
  };

  render() {
    const {
      loading,
      zookeeper: { zookeepers },
    } = this.props;
    const { modalVisible, isEditForm, recordValue } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="集群管理" content="zookeeper">
        <Card bordered={false}>
          <div className={styles.message}>
            <Button type="primary" onClick={this.reduction}>
              一键补全
            </Button>
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
            <div className={styles.ManageOperator}>
              <span className={styles.querySubmitButtons}>
                <Button type="primary">查询</Button>
              </span>
            </div>
          </div>
          <Table
            loading={loading}
            dataSource={zookeepers}
            columns={this.columns}
            rowKey={record => record.id}
            pagination={false}
          />
        </Card>
        {modalVisible && (
          <ZookeeperForm
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
export default Zookeeper;
