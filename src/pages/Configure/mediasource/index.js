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
import MediaSourceForm from './component/MediaSourceForm';
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ mediasource, loading }) => ({
  mediasource,
  loading: loading.models.mediasource,
}))
class MediaSource extends React.Component {
  state = {
    modalVisible: false,
    isEditForm: false,
    recordValue: {},
    drawerVisible: false,
  };
  columns = [
    { title: '编号', dataIndex: 'id' },
    { title: '数据源名称', dataIndex: 'name' },
    {
      title: '类型',
      dataIndex: 'type',
      render: text =>
        text == 'MYSQL' ? <Tag color="green">{text}</Tag> : <Tag color="blue">{text}</Tag>,
    },
    { title: 'URL', dataIndex: 'url' },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={() => this.showDrawer(record)}>查看</a>
          <Divider type="vertical"></Divider>
          <a onClick={() => this.handleModalVisible(true, record, true)}>编辑</a>
          <Divider type="vertical"></Divider>
          {record.used === false ? (
            <Popconfirm
              placement="top"
              title="确实删除"
              onConfirm={() => this.handleDelete(record)}
            >
              <a>删除</a>
            </Popconfirm>
          ) : (
            <span>删除</span>
          )}
        </span>
      ),
    },
  ];

  mediaColumns = [
    { title: '编号', dataIndex: 'id' },
    { title: '数据库名', dataIndex: 'namespace' },
    { title: '表名', dataIndex: 'name' },
  ];
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'mediasource/fetch',
    });
  }
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleModalVisible = (flag, record, isEdit) => {
    this.setState({
      modalVisible: !!flag,
      isEditForm: !!isEdit,
      recordValue: record || {},
    });
  };

  // 重新加载数据
  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mediasource/fetch',
      payload: {},
    });
  };
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mediasource/add',
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
      type: 'mediasource/update',
      payload: fields,
      callback: () => {
        message.success('修改成功');
        this.handleModalVisible();
        // 重载数据
        this.reloadData();
      },
    });
  };
  // 删除操作处理
  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mediasource/remove',
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

  showDrawer = record => {
    this.setState({
      drawerVisible: true,
      recordValue: record,
    });
    console.log(record.dataMedias);
  };
  onClose = () => {
    this.setState({
      drawerVisible: false,
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
      type: 'mediasource/fetch',
      payload: {
        params,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };
  search = ()=>{
    const {dispatch,form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
          type: 'mediasource/fetch',
          payload:{
              ...fieldsValue
          }
      });
    });
  }

  render() {
    const {
      loading,
      mediasource: { data },
      form,
    } = this.props;

    const { modalVisible, expandForm, recordValue, isEditForm, drawerVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate,
    };

    const pStyle = {
      fontSize: 16,
      color: 'rgba(0,0,0,0.85)',
      lineHeight: '24px',
      display: 'block',
      marginBottom: 16,
    };

    return (
      <PageHeaderWrapper title="配置管理" content="数据源配置">
        <Card bordered={false}>
          <div className={styles.message}>
            <div className={styles.ManageOperator}>
            <div style={{
                marginTop:'20px',
                marginBottom:'20px'
              }}>
              <Form layout="inline">
                    <FormItem style={{marginLeft:'20px'}} key="name" {...this.formLayout} label="数据源名称">
                    {form.getFieldDecorator('name', {
                        rules: [{ required: false, message: '数据源名称' }],
                        initialValue: '',
                    })(<Input placeholder="数据源名称" />)} 
                    </FormItem>
                    
                    <FormItem key="type" {...this.formLayout} label="数据源类型">
                        {form.getFieldDecorator('type', {
                            rules: [{ required: false, message: '状态' }],
                            initialValue: '',
                        })(
                            <Select style={{ width: 200 }} mode="single" placeholder="状态">
                                 <Option key={'MYSQL'} value={'MYSQL'}>
                                 MYSQL
                                </Option>
                                <Option key={'ROCKETMQ'} value={'ROCKETMQ'}>
                                ROCKETMQ
                                </Option>
                                <Option key={'KAFKA'} value={'KAFKA'}>
                                KAFKA
                                </Option>
                            </Select>
                        )}
                        </FormItem>
                    <Button style={{
                      marginTop:'5px',
                      marginRight:'20px',
                    }} type="primary" icon="search" onClick = {()=>this.search()}>查询</Button>
                    <Button
                      style={{
                        marginTop:'5px'
                      }}
                      icon="plus"
                      type="primary"
                      onClick={() => this.handleModalVisible(true, {}, false)}
                    >
                       新建数据源
                    </Button>
              </Form>
              
              </div>
             
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
          <MediaSourceForm
            {...parentMethods}
            isEdit={isEditForm}
            values={recordValue}
            modalVisible={modalVisible}
          />
        )}

        <Drawer
          width={700}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.drawerVisible}
        >
          <p style={{ ...pStyle, marginBottom: 24 }}></p>
          {recordValue && recordValue.dataMedias && (
            <Table
              loading={loading}
              dataSource={recordValue.dataMedias}
              columns={this.mediaColumns}
              rowKey={record => record.id}
              pagination={false}
            />
          )}
        </Drawer>
      </PageHeaderWrapper>
    );
  }
}
export default MediaSource;
