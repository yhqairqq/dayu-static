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
} from 'antd';
import datasource from '@/models/datasource';
import MediaList from '../../Configure//media/component/MediaList'
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = Tree;
const { TabPane } = Tabs;
const { SHOW_PARENT } = TreeSelect;

@Form.create()
@connect(({ mediasource,  zookeeper, loading }) => ({
  mediasource,
  zookeeper,
  loading: loading.models.mediasource,
}))
class TransPairForm extends React.Component {
  static defaultProps = {
    values: {},
    isEdit: false,

    handleAdd: () => {},
    handleUpdate: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    const { values, isEdit, mediaPair } = props;

    this.state = {
      positionVisible: 'none',
      otherParamsVisible: 'none',
      metaModalVisible: false,
      schemaMap: new Map(),
      tablesMap: new Map(),
      pairs: [],
      sourceType: 'source',
      radioType: 'MYSQL',
      sourceDataMedia: '',
      targetDataMedia: '',
      mediaModalVisible:false,
      formModalWidth:'1200',
      formType:1,
      expandedKeys:[],
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const { values, isEdit, mediaPair } = this.props;

    const { datasourceMap } = this.state;

    if (isEdit && mediaPair) {
      //获取原表namespace
      let namespace = mediaPair.source.namespace;
      this.setState({
        sourceDataMedia: mediaPair.source.name
          .split(';')
          .filter(item => item != '')
          .map(item => namespace + '.' + item + '\n')
          .reduce((prev, val) => prev + val),
        selectedSourceMedia:mediaPair.source,
        selectedTargetMedia:mediaPair.target,
      });

      if (mediaPair.target.source.type == 'MYSQL') {
        this.setState({
          targetDataMedia: mediaPair.target.name
            .split(';')
            .filter(item => item != '')
            .map(item => namespace + '.' + item + '\n')
            .reduce((prev, val) => prev + val),
        });
      } else {
        let map = datasourceMap;
        if (!datasourceMap) {
          map = new Map();
        }
        map.set(mediaPair.target.source.id, mediaPair.target.source);

        this.setState({
          sourceType: 'target',
          radioType: 'MQ',
          topic: mediaPair.target.topic,
          datasourceMap: map,
          targetId: mediaPair.target.source.id,
        });
      }
    }
  }
  otherParamsShow = () => {
    const { otherParamsVisible } = this.state;

    this.setState({
      otherParamsVisible: otherParamsVisible == 'none' ? 'block' : 'none',
    });
  };
  binlogShow = () => {};

  positionShow = () => {
    const { positionVisible } = this.state;

    this.setState({
      positionVisible: positionVisible == 'none' ? 'block' : 'none',
    });
  };
  okHandle = () => {
    const {  isEdit = false, form, handleAdd, handleUpdate, mediaPair } = this.props;
    const { isHand, type, targetId, sourceId,selectedSourceMedia,selectedTargetMedia,formType } = this.state;
    if(formType == 1){
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        if (isEdit) {
          handleUpdate({
            id: mediaPair.id,
  
            // sourceDataMedia:fieldsValue.sourceDataMedia.split('\n'),
            // targetDataMedia:fieldsValue.targetDataMedia.split('\n'),
          });
        } else {
          handleAdd({
            ...fieldsValue,
         
            sourceDataMedia: fieldsValue.sourceDataMedia.split('\n'),
            targetDataMedia:
              (fieldsValue.targetDataMedia && fieldsValue.targetDataMedia.split('\n')) || '',
            sourceId,
            targetId,
          });
        }
      });
    }else if(formType == 2){
    
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        if (isEdit) {
          handleUpdate({
            id: mediaPair.id,
            ...fieldsValue,
           
            sourceMediaId:selectedSourceMedia.id,
            targetMediaId:selectedTargetMedia.id,
  
          });
        } else {
          handleAdd({
            ...fieldsValue,
            sourceMediaId:selectedSourceMedia.id,
            targetMediaId:selectedTargetMedia.id,
          });
        }
      });
    }
  };
  onSelect = (selectedKeys, info) => {
    this.setState({
      expandedKeys:selectedKeys
    })
    selectedKeys.map(key => this.renderTreeNodes(key));
  };



  onCheck = (checkedKeys, info) => {
    console.log('checkedKeys',checkedKeys)
    const { sourceDataMedia, targetDataMedia, sourceType, radioType } = this.state;
    if (sourceType == 'source') {
      if (checkedKeys.length > 0) {
        this.setState({
          sourceId: checkedKeys[0].split('-')[0],
        });
      }

      this.setState({
        sourceDataMedia:
          checkedKeys.length > 0
            ? checkedKeys
                .filter(item => item.split('-').length == 3)
                .map(item => {
                  let values = item.split('-');
                  return values[1] + '.' + values[2] + '\n';
                })
                .reduce((prev, val, index, arr) => {
                  return prev + val;
                })
            : '',
      });
    } else {
      if (checkedKeys.length > 0) {
        let values = checkedKeys[0].split('-');
        this.setState({
          targetId: values[0],
        });
      }

      if (radioType == 'MQ') {
        if (checkedKeys.length > 0) {
          this.setState({
            targetId: checkedKeys[0],
          });
        }
        return;
      }

      let all = false;
      //获取targetId

      for (let i = 0; i < checkedKeys.length; i++) {
        let values = checkedKeys[i].split('-');
        if (values.length == 2) {
          this.setState({
            targetDataMedia: values[1] + '.*\n',
          });
          all = true;
          break;
        }
      }
      if (!all) {
        this.setState({
          targetDataMedia:
            checkedKeys.length > 0
              ? checkedKeys
                  .filter(item => item.split('-').length == 3)
                  .map(item => {
                    let values = item.split('-');
                    return values[1] + '.' + values[2] + '\n';
                  })
                  .reduce((prev, val, index, arr) => {
                    return prev + val;
                  })
              : '',
        });
      }
    }
  };
  onLoadData = treeNode => {
    console.log('onLoadData')
  };
  onTreeExpand = expandedKeys => {

    console.log('onTreeExpand')
  };
  renderTreeNodes = key => {
    const { dispatch } = this.props;
    const { schemaMap, tablesMap, sourceType, radioType,targteDataSources } = this.state;

    let values = key.split('-');

    if (values.length == 3) {
      return;
    } else if (values.length == 2) {
      dispatch({
        type: 'meta/fetchTables',
        payload: {
          dataMediaSourceId: values[0],
          schema: values[1],
        },
        callback: data => {
          tablesMap.set(values[0] + values[1], data);
          this.setState({
            tablesMap,
          });
        },
      });
      return;
    }
    if (radioType == 'MQ') {
      // dispatch({
      //   type:'meta/fetchTopics',
      //   payload:{
      //     dataMediaSourceId:key,
      //   },
      //   callback:(data)=>{
      //     topicMap.set(key, data)
      //     this.setState({
      //       topicMap
      //     })
      //   }
      // })
      return;
    }

    dispatch({
      type: 'meta/fetchSchemas',
      payload: {
        dataMediaSourceId: key,
      },
      callback: data => {
        schemaMap.set(key, data);
        // console.log("schemaMap",schemaMap)
        // console.log("targteDataSources",targteDataSources)
        this.setState({
          schemaMap,
        });
      },
    });
  };
  callback = key => {
    if(key === 2){
        this.setState({
          formType:key,
          formModalWidth:500,
        })      
    }else{
      this.setState({
        formType:key,
        formModalWidth:1200,
      })      
    }
   };
  metaShow = type => {
    const { dispatch, values } = this.props;
    const { schemaMap, tablesMap, topicMap } = this.state;
    dispatch({
      type: 'mediasource/fetchAll',
      payload: {
        type: type,
        destinationName: values && values.parameters&&values.parameters.destinationName,
      },
      callback: data => {
        let datasourceMap = new Map();
        for (let i = 0; i < data.length; i++) {
          datasourceMap.set(data[i].id, data[i]);
        }
        this.setState({
          datasources: data.filter(item => item.type == 'MYSQL'),
          targteDataSources: data.filter(item => item.type == 'MYSQL'),
          cacheDataSources: data,
          datasourceMap,
        });
      },
    });
    this.setState({
      metaModalVisible: true,
      sourceType: type,
      schemaMap: new Map(),
      tablesMap: new Map(),
      topicMap: new Map(),
    });
  };
  handleMetaModelVisible = visible => {
    this.setState({
      metaModalVisible: visible,
    });
  };
  radioChange = e => {
    const { datasources, cacheDataSources } = this.state;

    if (e.target.value == 'MYSQL') {
      this.setState({
        targteDataSources: cacheDataSources.filter(datasource => datasource.type == 'MYSQL'),
        radioType: 'MYSQL',
      });
    } else if (e.target.value == 'MQ') {
      this.setState({
        targteDataSources: cacheDataSources.filter(datasource => datasource.type != 'MYSQL'),
        radioType: 'MQ',
        targetDataMedia: '',
      });
    }
  };
  selectMedia = (item)=>{
    const {inputType} = this.state;
    if(inputType){
      if(inputType === 'source'){
          this.setState({
            selectedSourceMedia:item,
            mediaModalVisible:false,
          })
      }else{
        this.setState({
          selectedTargetMedia:item,
          mediaModalVisible:false,
        })
      }
    }
    // console.log(item)
  }

  handleMediaModalVisible = (flag,inputType)=>{
    this.setState({
      mediaModalVisible:flag,
      inputType
    })
  }
  searchKeyChnage = e =>{
    const { value } = e.target;
    this.setState({
      searchKey:value || ''
    })
  }
  render() {
    const {
      isHand,
      positionVisible,
      otherParamsVisible,
      metaModalVisible,
      datasources,
      cacheDataSources,
      schemaMap,
      tablesMap,
      topicMap,
      pairs,
      sourceType,
      radioType,
      sourceDataMedia,
      targetDataMedia,
      targteDataSources,
      targetId,
      datasourceMap,
      topic,
      mediaModalVisible,
      formModalWidth,
      selectedSourceMedia,
      selectedTargetMedia,
      formType,
      searchKey,
      expandedKeys,
    } = this.state;
    const {
      isEdit,
      modalVisible,
      handleModalVisible,
      form,
      values,
      mediaPair,
      zookeeper: { zookeepers },
    } = this.props;

    const parentMethods = {
      selectMedia:this.selectMedia
    };
    // console.log(sourceType)
    // console.log('schemaMap',schemaMap)
    // console.log('tablesMap',tablesMap)

   
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={window.innerWidth>1080?window.innerWidth/2:window.innerWidth/4*3}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 10px' }}
        title={isEdit ? '修改数据映射信息' : '新增数据映射信息'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, mediaPair)}
        onOk={this.okHandle}
      >
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="快速配置" key="1">
            {
              formType == 1&&<div style={{display:'flex',justifyContent:'space-between'}}>
              <div style={{width:'60%'}}>
                <FormItem key="sourceDataMedia" {...this.formLayout} label="源数据表">
                  {form.getFieldDecorator('sourceDataMedia', {
                    rules: [{ required: true, message: '源数据表' }],
                    initialValue: sourceDataMedia,
                  })(<Input.TextArea disabled autosize={{ minRows: 10 }} placeholder="源数据表" />)}
                  <Button
                    disabled={isEdit ? true : false}
                    size="small"
                    type="primary"
                    icon="plus"
                    onClick={() => this.metaShow('source')}
                  >
                    添加数据源表
                  </Button>
                </FormItem>
                {!(radioType == 'MQ' && sourceType == 'target') && (
                <FormItem key="targetDataMedia" {...this.formLayout} label="目标数据表">
                    {form.getFieldDecorator('targetDataMedia', {
                      rules: [{ required: false, message: '目标数据表' }],
                      initialValue: targetDataMedia,
                    })(
                      <Input.TextArea
                        disabled
                        autosize={{ minRows: 10 }}
                        placeholder="目标数据表"
                      />
                    )}
                    <Button
                      disabled={sourceDataMedia == '' ? true : false}
                      size="small"
                      type="primary"
                      icon="plus"
                      onClick={() => this.metaShow('target')}
                    >
                      添加目标源表
                    </Button>
                  </FormItem>
                )}
              </div>
              {metaModalVisible && (
                <div style={{width:"40%",marginBottom:'10px'}}>
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom:'10px',
                    }}
                  >
                    {sourceType == 'source' ? '数据源' : '目标源'}
                    {sourceType == 'source' ? (
                      ''
                    ) : (
                      <div>
                        <Radio.Group onChange={this.radioChange} defaultValue="MYSQL">
                          <Radio.Button value="MYSQL">MYSQL</Radio.Button>
                          <Radio.Button value="MQ">MQ</Radio.Button>
                        </Radio.Group>
                      </div>
                    )}
                  </div>
                  <Input.Search style={{ marginBottom: 8 }} placeholder="Search" onChange = {this.searchKeyChnage}/>
                 <div style={{
                       height: '500px',
                       overflow: 'scroll',
                       overflowX: 'hidden',
                       overflowY: 'auto',
                 }}>
                 {sourceType == 'source' ? (
                    <Tree
                      checkable
                      expandedKeys = {expandedKeys}
                      autoExpandParent={true}
                      onLoadData={this.onLoadData}
                      showIcon={true}
                      onSelect={this.onSelect}
                      onCheck={this.onCheck}
                    >
                      {datasources &&
                        datasources.map(datasource => (
                          <TreeNode 
                          title={datasource.name} 
                          key={datasource.id} 
                          selectable={true}
                          >
                            {schemaMap &&
                              schemaMap.get(datasource.id) &&
                              schemaMap.get(datasource.id).map(schema => (
                                <TreeNode
                                  title={schema}
                                  key={`${datasource.id}-${schema}`}
                                  selectable={true}
                                >
                                 
                                   {tablesMap&&
                                      tablesMap.get(datasource.id + schema) &&
                                      tablesMap
                                        .get(datasource.id + schema)
                                        .filter(item=>{
                                          if(searchKey == null || searchKey==''){
                                               return true
                                          }else{
                                          
                                            return (item&&item.indexOf(searchKey) == 0)
                                          }
                                        })
                                        .map(table => (
                                          <TreeNode
                                            title={table}
                                            key={`${datasource.id}-${schema}-${table}`}
                                            isLeaf={true}
                                            selectable={false}
                                          ></TreeNode>
                                      ))}
                                     
                                </TreeNode>
                              ))}
                          </TreeNode>
                        ))}
                    </Tree>
                  ) : (
                    <Tree
                      checkable
                      expandedKeys = {expandedKeys}
                      autoExpandParent={true}
                      onLoadData={this.onLoadData}
                      showIcon={true}
                      onSelect={this.onSelect}
                      onCheck={this.onCheck}
                    >
                      {targteDataSources &&
                        targteDataSources.map(datasource => (
                          <TreeNode
                            title={datasource.name}
                            key={datasource.id}
                            selectable={radioType == 'MYSQL'}
                          >
                            {radioType == 'MYSQL'&& schemaMap &&
                                schemaMap.get(datasource.id) &&
                                schemaMap.get(datasource.id).map(schema => (
                                  // console.log(schema)
                                 
                                  <TreeNode
                                    title={schema}
                                    key={`${datasource.id}-${schema}`}
                                    selectable={true}
                                  >
                                    {tablesMap &&
                                      tablesMap.get(datasource.id + schema) &&
                                      tablesMap
                                        .get(datasource.id + schema)
                                        .filter(item=>{
                                          if(searchKey == null || searchKey==''){
                                               return true
                                          }else{
                                          
                                            return (item&&item.indexOf(searchKey) == 0)
                                          }
                                        })
                                        .map(table => (
                                          <TreeNode
                                            title={table}
                                            key={`${datasource.id}-${schema}-${table}`}
                                            isLeaf={true}
                                            selectable={false}
                                          ></TreeNode>
                                        ))}
                                  </TreeNode>
                            ))
                              }
                          </TreeNode>
                        ))}
                    </Tree>
                  )}
                 </div>
                </div>
              )}
            </div>
            }
          </TabPane>
          <TabPane tab="模板配置" key="2">
            {
              formType == 2&&           
              <div >
              <div>
                 <FormItem key="sourceMediaId" {...this.formLayout} label="源数据表列表">
                   {form.getFieldDecorator('sourceMediaId', {
                     rules: [{ required: true, message: '请输入数据源名称' }],
                     initialValue: selectedSourceMedia&&selectedSourceMedia.name
                     .split(";").reduce((prev,val)=>(`${prev}\n${val}`)),
                   })(<Input.TextArea  autosize={{ minRows: 10 }} onFocus={()=>this.handleMediaModalVisible(true,'source')} placeholder="请输入" />)}
                 </FormItem>
                 <FormItem key="targetMediaId" {...this.formLayout} label="目标源表列表">
                   {form.getFieldDecorator('targetMediaId', {
                     rules: [{ required: true, message: '请输入数据源名称' }],
                     initialValue: selectedTargetMedia&&selectedTargetMedia.name
                     .split(";").reduce((prev,val)=>(`${prev}\n${val}`)),
                   })(<Input.TextArea  autosize={{ minRows: 10 }} onFocus={()=>this.handleMediaModalVisible(true,'target')} placeholder="请输入" />)}
                 </FormItem>
             
               </div>
         </div>
            }
          </TabPane>
        </Tabs>
        {mediaModalVisible&&<Modal
            destroyOnClose
            maskClosable={false}
            width={window.innerWidth >1080?window.innerWidth/2:window.innerWidth/4*3}
            style={{ top: 20 }}
            bodyStyle={{ padding: '10px 10px' }}
            title={isEdit ? '修改数据映射信息' : '新增数据映射信息'}
            visible={mediaModalVisible}
            onCancel={() => this.handleMediaModalVisible(false)}
           
          >  
          <MediaList 
            {...parentMethods}
          ></MediaList>  
        </Modal>  }
        

      </Modal>
    );
  }
}

export default TransPairForm;
