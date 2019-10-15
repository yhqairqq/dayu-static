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

import styles from '../../../styles/Manage.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = Tree;
const { TabPane } = Tabs;
const { SHOW_PARENT } = TreeSelect;

@Form.create()
@connect(({  }) => ({
    
}))
class MediaForm extends React.Component {
  static defaultProps = {

  };
  
  constructor(props) {
    super(props);
    const { values } = props;

    this.state = {
        mediaId: values.id,
        sourceType:'MYSQL',
        datasourceMap: new Map(),
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }
  componentDidMount() {
    const { dispatch,values} = this.props;
    const { datasourceMap } = this.state;
    dispatch({
        type: 'mediasource/fetchAll',
        callback:(data)=>{
            this.setState({
                mediasources:data
            })
            data&&data.forEach(source=>{  
                datasourceMap.set(source.id,source)
            });
            const sourceType =values.source&&values.source.type ||
            datasourceMap.get(data[0].id)&&datasourceMap.get(data[0].id).type
            if(sourceType == 'MYSQL'){
                this.setState({
                    sourceType:'MYSQL'
                })
            }else if(sourceType == 'ROCKETMQ'){
                this.setState({
                    sourceType:'ROCKETMQ'
                })
             }
           
        }
      });

  }
  datasourceOnSelect = (key) =>{
    const {dispatch} = this.props;
    const {mediasources,datasourceMap} = this.state;
    const source = datasourceMap.get(key)
    if(source.type == 'MYSQL'){
        this.setState({
            sourceType:'MYSQL'
        })
        dispatch({
            type: 'meta/fetchSchemas',
            payload: {
              dataMediaSourceId: key,
            },
            callback: data => {
                this.setState({
                    sourceId:key,
                    schemas:data
                })
            },
          });
    }else if(source.type == 'ROCKETMQ'){
        this.setState({
            sourceType:'ROCKETMQ'
        })
     }
    

  }
  namespaceOnSelect = (key)=>{
      const {sourceId} = this.state;
      const {dispatch} = this.props;
      if(sourceId){
        dispatch({
            type: 'meta/fetchTables',
            payload: {
              dataMediaSourceId: sourceId,
              schema: key,
            },
            callback: data => {
              this.setState({
                tables:data,
              });
            },
        });
      }
      
  }
  
  okHandle = () => {
    const { values, isEdit = false, form, handleAdd, handleUpdate } = this.props;
    const { isHand, mediaId, type } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      console.log(fieldsValue)
      if (isEdit) {
        handleUpdate({
          id: mediaId,
          ...fieldsValue,
        });
      } else {
        handleAdd({
          ...fieldsValue,
        });
      }
    });
  };
  render() {
    const {
        mediasources,
        schemas,
        tables,
        sourceType,
       
     } = this.state;
    const {
        form,
        handleModalVisible,
        values,
        isEdit,
        modalVisible,
    } = this.props;

    return (
        <Modal
        destroyOnClose
        maskClosable={false}
        width={window.innerWidth / 3}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={isEdit ? '修改数据表' : '新增数据表'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle} >
            <div style={{
                display:'flex'
            }}>
                <div >
                        <FormItem key="sourceId" {...this.formLayout} label="数据源名称">
                        {form.getFieldDecorator('sourceId', {
                            rules: [{ required: true, message: '数据源' }],
                            initialValue: values&&values.source&&values.source.id || mediasources&&mediasources[0].id,
                        })(
                            <Select style={{ width: 300 }} mode="single" placeholder="数据源类型" onChange = {this.datasourceOnSelect}>
                                {
                                    mediasources&&mediasources.map(item=>(
                                        <Option key={item.id} value={item.id}>
                                             {item.url}-{item.id}-{item.name}
                                        </Option>
                                    ))
                                }
                            </Select>
                        )} 
                        </FormItem>
                        <FormItem key="namespace" {...this.formLayout} label="数据库名称">
                        {form.getFieldDecorator('namespace', {
                            rules: [{ required: true, message: '数据库名称' }],
                            initialValue: values&&values.namespace || schemas&&schemas[0] || '',
                        })(
                            sourceType ==  "MYSQL" ?
                            <Select style={{ width: 300 }} mode="single" placeholder="数据库名称" onChange = {this.namespaceOnSelect}>
                                {
                                    schemas&&schemas.map(item=>(
                                        <Option key={item} value={item}>
                                             {item}
                                        </Option>
                                    ))
                                }
                            </Select>:
                            <Input placeholder="数据库名 "/>
                        )} 
                        </FormItem>
                        <FormItem key="names" {...this.formLayout} label="表名">
                        {form.getFieldDecorator('names', {
                            rules: [{ required: true, message: '表名' }],
                            initialValue: values&&values.name || tables&&tables[0] || ".*",
                        })(
                            sourceType ==  "MYSQL" ?
                            <Select style={{ width: 300 }} mode="multiple" placeholder="表名" >
                                {
                                    tables&&tables.map(item=>(
                                        <Option key={item} value={item}>
                                             {item}
                                        </Option>
                                    ))
                                }
                            </Select>:
                            <Input disabled placeholder="表名 通配.*"/>
                        )} 
                        </FormItem>
                        {
                            sourceType == "ROCKETMQ"&&
                            <FormItem key="topic" {...this.formLayout} label="topic名称">
                            {form.getFieldDecorator('topic', {
                                rules: [{ required: true, message: 'topic名称' }],
                                initialValue: values&&values.topic ||'',
                            })(
                                <Input  placeholder="topic名称"/>
                            )} 
                            </FormItem>
                        }
                </div>
            </div>

        </Modal>
    );
  }
}

export default MediaForm;
