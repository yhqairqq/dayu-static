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
  Descriptions,
  Popover,
} from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CanalForm from './component/CanalForm';
import CanalDetail from './component/CanalDetail';
import styles from '../../styles/Manage.less';
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ canal, loading }) => ({
  canal,
  loading: loading.models.canal,
}))
class Canal extends React.Component {
  state = {
    modalVisible: false,
    isEditForm: false,
    recordValue: {},
    drawerVisible: false,
  };
  columns = [
    { title: '编号', dataIndex: 'id' },
    { title: 'Canal名字', dataIndex: 'name' },
    {
      title: '数据源类型',
      dataIndex: 'canalParameter.sourcingType',
      render: text =>
        text == 'MYSQL' ? <Tag color="green">{text}</Tag> : <Tag color="blue">{text}</Tag>,
    },
    { title: '连接配置', render:(text,record)=>(
      <Popover content={record.url} title="过滤脚本" trigger="hover">
     { record&&`${record.url.substring(0,50)}...`}
    </Popover>
     
    ) },
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
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'canal/fetch',
    });
    dispatch({
      type: 'mediasource/fetchAll',
      callback:(data)=>{
          this.setState({
              mediasources:data
          })
      }
    });
  }
  showDrawer = record => {
    const { drawerVisible } = this.state;
    this.setState({
      drawerVisible: true,
      recordValue: record,
    });
  };
  onClose = () => {
    const { drawerVisible } = this.state;
    this.setState({
      drawerVisible: !drawerVisible,
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
      type: 'canal/fetch',
      payload: {
        params,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'canal/add',
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
      type: 'canal/update',
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
      type: 'canal/remove',
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
  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'canal/fetch',
      payload: {},
    });
  };
  search = () =>{
    const {  form,dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
        if (err) return;
        dispatch({
            type: 'canal/fetch', 
            payload:{
                ...fieldsValue
            }
        });
      });

  }

  render() {
    const {
      loading,
      canal: { data },
      form,
    } = this.props;
    const { modalVisible, isEditForm, expandForm, recordValue, drawerVisible,
      mediasources
     } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="配置管理" content="canal配置">
        <Card bordered={false}>
          <div className={styles.message}>
           
            <div className={styles.ManageOperator}>
              <span className={styles.querySubmitButtons}>
              
              </span>
              <div style={{
              marginTop:'20px',
              marginBottom:'30px',
          }}>
            <Form layout="inline">
                        <FormItem key="name" {...this.formLayout} label="canal名称">
                        {form.getFieldDecorator('name', {
                            rules: [{ required: false, message: 'canal名称' }],
                            initialValue: '',
                        })(
                          <Input placeholder="canal名称" />
                        )} 
                       </FormItem>
                        <FormItem key="sourceId" {...this.formLayout} label="数据源名称">
                        {form.getFieldDecorator('sourceId', {
                            rules: [{ required: false, message: '数据源' }],
                            initialValue: '',
                        })(
                            <Select style={{ width: 300 }} mode="single" placeholder="数据源类型">
                                {
                                    mediasources&&mediasources.map(item=>(
                                        <Option key={item.id} value={item.id}>
                                            {item.name}-{item.url}
                                        </Option>
                                    ))
                                }
                            </Select>
                        )} 
                        </FormItem>
                        <FormItem key="url" {...this.formLayout} label="URL">
                        {form.getFieldDecorator('url', {
                            rules: [{ required: false, message: 'URL' }],
                            initialValue: '',
                        })(
                          <Input placeholder="URL" />
                        )} 
                       </FormItem>
                        <Button style={{
                            marginTop:'5px',
                            marginLeft:'20px'
                        }} type='primary' icon='search' onClick={()=>this.search()}>查询</Button>
                          <Button
                            style={{
                              marginTop:'5px',
                              marginLeft:'20px'
                            }}
                            icon="plus"
                            type="primary"
                            onClick={() => this.handleModalVisible(true, {}, false)}
                          >
                             新建canal
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
          <CanalForm
            {...parentMethods}
            isEdit={isEditForm}
            values={recordValue}
            modalVisible={modalVisible}
          />
        )}
        <Drawer
          width={800}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.drawerVisible}
        >
          <CanalDetail values={recordValue}></CanalDetail>
        </Drawer>
      </PageHeaderWrapper>
    );
  }
}
export default Canal;
