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
  Tabs,
  Popover,
} from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../styles/Manage.less';
import { sync } from 'glob';
import TransPairForm from './component/TransPairForm';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ full, loading }) => ({
  full,
  loading: loading.models.full,
}))
class FullSync extends React.Component {
  state = {
    tabKey:1,
    recordValue:{},
    pagination:{
      current: 1,
      pageSize: 10,
    }
  };
  pairColumn = [
    { title: '序号', dataIndex: 'id' },
    {
      title: '源表',
      render: (text, reocrd) => (
        <Popover
          content={`${reocrd.source&&reocrd.source.source.type}-${reocrd.source&&reocrd.source.source.name}-${reocrd.source&&reocrd.source.source.url}`}
          title="数据源"
          trigger="hover"
        >
          {reocrd.source&&reocrd.source.name
            .split(';')
            .filter(item => item != '')
            .map(item => (
              <div key={item}>{`${reocrd.source.namespace}.${item}`}</div>
            ))}
        </Popover>
      ),
    },
    {
      title: '目标表',
      render: (text, reocrd) => (
        <Popover
          content={`${reocrd.target&&reocrd.target.source.type}-${reocrd.target&&reocrd.target.source.name}-${reocrd.target&&reocrd.target.source.url}`}
          title="数据源"
          trigger="hover"
        >
          {reocrd.target&&reocrd.target.name
            .split(';')
            .filter(item => item != '')
            .map(item => (
              <div key={item}>{`${reocrd.target.namespace}.${item}`}</div>
            ))}
        </Popover>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
         
          <Popconfirm
              placement="top"
              title="确实开启同步"
              onConfirm={() => this.pairSync(record)}
            >
              <a>同步</a>
            </Popconfirm>
            <Divider type="vertical"></Divider>
          <a onClick={() => this.handleModalVisible(true, record, true)}>编辑</a>
          <Divider type="vertical"></Divider>
          <Popconfirm
              placement="top"
              title="确实删除"
              onConfirm={() => this.handleDelete(record)}
            >
              <a>删除</a>
            </Popconfirm>
        </span>
      ),
    },
  ];
  componentDidMount() {
    
    const {dispatch} = this.props;
    dispatch({
      type:'transpair/fetch',
      callback:(data)=>{
        this.setState({
          mediaPairTrans:data
        })
      }
    })
  }

  pairSync  = (record)=>{
    const {dispatch}  = this.props;
    
    dispatch({
      type:"full/pairSync",
      payload:{
        mediaPairid:record.id
      },
      callback:data=>{

      }
    })
  }
  jsonChange = e => {};
  sync = fields => {
    // console.log(fields);
    const { dispatch } = this.props;
    dispatch({
      type: 'full/sync',
      payload: fields,
    });
  };
  okHandle = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      // console.log('提交表单');
      this.sync({
        ...fieldsValue,
      });
    });
  };
  callback = key => {
    this.setState({
      tabKey:key
    })
    if(key === 2){
       
          
    }else{
     
    }
   };
   handleStandardTableChange = (pagination, filtersArg, sorter) => {
   
    const { dispatch } = this.props;
    const { formValues } = this.state;
    this.setState({
      pagination
  })
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
      type: 'transpair/fetch',
      payload: {
        params,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };
  handleModalVisible = (flag, record, isEdit) => {
    this.setState({
      modalVisible: !!flag,
      isEditForm: !!isEdit,
      rowRecord: record,
    });
  };
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'transpair/add',
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
      type: 'transpair/update',
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
      type: 'transpair/remove',
      payload: {
        id:record.id
      },
      callback: () => {
        message.success('删除成功');
        // 重载数据
        this.reloadData();
      },
    });
  };
  reloadData = () => {
    const { dispatch, recordValue } = this.props;
    const {pagination} = this.state
    dispatch({
      type: 'transpair/fetch',
      payload: {
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      },
      callback: data => {
        this.setState({
          mediaPairTrans: data,
        });
        
      },
    });
  };
  render() {
    const formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
    const {
      form,
      full: { data },
    } = this.props;
    const {
      recordValue,
      rowRecord,
      modalVisible,
      isEditForm,
      mediaPairTrans,
    } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="全量同步" content="全量数据同步">
       
        
        <Tabs defaultActiveKey="1" onChange={this.callback} key = "2">
       
               <TabPane tab="快速同步" key="1">
               <div style={{
                 marginTop:'10px',
                 marginBottom:'10px'
               }}>
                <Button
                  type="primary"
                  size="small"
                  icon="plus"
                  onClick={() => this.handleModalVisible(true, {}, false)}
                >
                  添加数据映射
                </Button>
                </div>
               <StandardTable
                  data={mediaPairTrans}
                  columns={this.pairColumn}
                  rowKey={record => record.id}
                  onChange={this.handleStandardTableChange}
                />
                </TabPane>
              <TabPane tab="高级同步" key="2">
                  <Button icon="swap" type="primary" onClick={this.okHandle}>
                    同步启动
                  </Button>
                  <Row gutter={8}>
                    <Col span={18}>
                      {' '}
                      <FormItem key="name" {...formLayout} label="文件名称">
                        {form.getFieldDecorator('name', {
                          rules: [{ required: false, message: 'json' }],
                          initialValue: '',
                        })(<Input placeholder="text.json" />)}
                      </FormItem>
                      <FormItem key="json" {...formLayout} label="脚本">
                        {form.getFieldDecorator('json', {
                          rules: [{ required: false, message: 'json' }],
                          initialValue: '',
                        })(
                          <TextArea autosize={{ minRows: 100 }} placeholder=" " onChange={this.jsonChange} />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={6}>
                      <div>{data && data}</div>
                    </Col>
                  </Row>
              </TabPane>
        </Tabs>

        {modalVisible && (
          <TransPairForm
            {...parentMethods}
            isEdit={isEditForm}
            mediaPair={recordValue}
            modalVisible={modalVisible}
          />
        )}

        
      </PageHeaderWrapper>
    );
  }
}
export default FullSync;
