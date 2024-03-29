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
import MediaForm from './component/MediaForm'
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
    { title: 'table name', render:(text,record)=>(
      record.name
            .split(';')
            .filter(item => item != '')
            .map(item => (
              <div key={item}>{item}</div>
            ))
    ) },
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
          <a onClick={()=>this.handleModalVisible(true,record,true)}>编辑</a>
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
      type: 'media/fetch',
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
      type: 'media/fetch',
      payload: {
        params,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };

  // 重新加载数据
  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'media/fetch'
    });
  };
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'media/add',
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
      type: 'media/update',
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
      type: 'media/remove',
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
  search = ()=>{
    const {  form,dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
        if (err) return;
        dispatch({
            type: 'media/fetch',
            payload:{
                ...fieldsValue
            }
        });
      });

  }
  

  render() {
    const {
      loading,
      media: { medias },
      form,
    } = this.props;
    const {
      modalVisible,
      mediasources,
      recordValue,
      isEditForm,
    } = this.state;
  
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="配置管理" content="映射表模板">
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
                        <FormItem style={{marginLeft:'20px'}} key="namespace" {...this.formLayout} label="数据库名">
                        {form.getFieldDecorator('namespace', {
                            rules: [{ required: false, message: '数据库名' }],
                            initialValue: '',
                        })(<Input placeholder="数据库名" />)} 
                        </FormItem>
                        
                        <FormItem key="name" {...this.formLayout} label="表名">
                        {form.getFieldDecorator('name', {
                            rules: [{ required: false, message: '请输入表名' }],
                            initialValue: '',
                        })(<Input placeholder="请输入表名" />)} 
                        </FormItem>
                        <FormItem key="topic" {...this.formLayout} label="Topic">
                        {form.getFieldDecorator('topic', {
                            rules: [{ required: false, message: 'Topic' }],
                            initialValue: '',
                        })(<Input placeholder="Topic" />)} 
                        </FormItem>

                        <FormItem key="type" {...this.formLayout} label="数据源类型">
                        {form.getFieldDecorator('type', {
                            rules: [{ required: false, message: '数据源类型' }],
                            initialValue: 'MYSQL',
                        })(
                            <Select style={{ width: 300 }} mode="single" placeholder="数据源类型">
                                 <Option key={'MYSQL'} value={'MYSQL'}>
                                    MYSQL
                                </Option>
                                <Option key={'ROCKETMQ'} value={'ROCKETMQ'}>
                                    ROCKETMQ
                                </Option>
                            </Select>
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
                            新建数据表
                      </Button>
                </Form>
            
          </div>
            </div>
          </div>
          <StandardTable
            loading={loading}
            data={medias}
            columns={this.columns}
            rowKey={record => record.id}
            onChange={this.handleStandardTableChange}
          />
           {modalVisible && (
          <MediaForm
            {...parentMethods}
            isEdit={isEditForm}
            values={recordValue}
            modalVisible={modalVisible}
          />
        )}

        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Media;
