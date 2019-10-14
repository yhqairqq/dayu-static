import React from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Modal,
  TreeSelect,
  Select,
  Radio,
  Switch,
  Tree,
  Icon,
  Divider,
  Descriptions,
  Tabs,
  Row,
  Col,
  Button,
  Table,
  Popover,
} from 'antd';
import StandardTable from '@/components/StandardTable';

import MediaSearchForm from './MediaSearchForm'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = Tree;
const { TabPane } = Tabs;
const { SHOW_PARENT } = TreeSelect;

@Form.create()
@connect(({ media,  loading }) => ({
    media,
  loading: loading.models.media,
}))
class MediaList extends React.Component {
  static defaultProps = {

  };
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
          <a>查看</a>
          <Divider type="vertical"></Divider>
          <a>编辑</a>
          <Divider type="vertical"></Divider>
          <a>删除</a>
        </span>
      ),
    },
  ];

  rowSelection = {
    type:'radio',
    onSelect: (record, selected, selectedRows) => {
       const {selectMedia}  = this.props;
      selectMedia(record)
    },
  };
  constructor(props) {
    super(props);
    const {  } = props;

    this.state = {
        mediasources:[]
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
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

  search = ()=>{
    const {  form,dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
        if (err) return;
        // fosrm.resetFields();
        // console.log(fieldsValue)
        dispatch({
            type: 'media/fetch',
            payload:{
                ...fieldsValue
            }
        });
      });

  }

  componentDidMount() {
    const { dispatch} = this.props;
    const {  } = this.state;


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
  
  render() {
    const {
        mediasources,
    } = this.state;
    const {
        form,
        loading,
        media: { medias },
        selectMedia,
    } = this.props;

    return (
      <div>
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
                                             {item.id}-{item.name}-{item.url}
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
                </Form>
            
          </div>
          <StandardTable
            loading={loading}
            data={medias}
            columns={this.columns}
            rowKey={record => record.id}
            onChange={this.handleStandardTableChange}
            // rowSelection={this.rowSelection} 
            onRow={record => {
                return {
                  onClick: event => {selectMedia(record)}, // 点击行
                  onDoubleClick: event => {},
                  onContextMenu: event => {},
                  onMouseEnter: event => {}, // 鼠标移入行
                  onMouseLeave: event => {},
                };
              }}
          />
      </div>
    );
  }
}

export default MediaList;
