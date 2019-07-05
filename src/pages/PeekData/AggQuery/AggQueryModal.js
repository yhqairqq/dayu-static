import React from 'react';
import { connect } from 'dva';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Tabs,
} from 'antd';
import styles from "./index.less";
import DimensionPane from './DimensionPane';
import MeasurePane from './MeasurePane';

/**
 * Author: feixy
 * Date: 2019-07-04
 * Time: 14:02
 */


const FormItem = Form.Item;
const SelectOption = Select.Option;
const TabPane = Tabs.TabPane;

const formItemLayout = {
  labelCol: {
    xs: { span: 5 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 8 },
    sm: { span: 6 },
  },
};
const tabList = [
  {
    key: 'dimensionPane',
    tab: '维度',
  },
  {
    key: 'measurePane',
    tab: '指标',
  },
  {
    key: 'filterPane',
    tab: '过滤',
  },
  {
    key: 'sqlPane',
    tab: 'SQL',
  },
];

@connect(({ user, loading, tag, model }) => ({
  user,
  tag,
  model,
  loading: loading.models.tag,
}))
class AggQueryModal extends React.Component{

  state = {
    modelId:undefined,
    modelMetaList:[],
    paneKey: "dimensionPane",
    dimensionDataList:[],
    dimensionSelectedList:[],
    measureDataList:[],
    measureSelectedList:[],
    filterPane:{
      dataList:[],
      selectedList:[],
    }
  };

  onTabChange = (key,prop)=>{
    this.setState({ [prop]: key });
  };

  onModelChange = (modelId) => {
   const {dispatch} = this.props;
   this.setState({
     modelId
   },()=>{
     dispatch({
       type:"model/fetchModelMeta",
       payload:modelId,
       callback: this.processData
     });
   });
  };

  createField = (meta, type)=>({
    id:undefined,
    peekId:undefined,
    aggExpression:undefined,
    format:undefined,
    type,
    showName:meta.showName,
    name:meta.name,
    dataType:meta.dataType,
    metaId:meta.id,
  });


  processData = (modelMetaList) =>{

      const dimensionDataList = [];
      const measureDataList = [];
      modelMetaList.forEach(meta=>{
        if(meta.dataType === "INTEGER"){
          measureDataList.push(this.createField(meta));
        } else {
          dimensionDataList.push(this.createField(meta));
        }
      });
      this.setState({
        dimensionDataList,
        measureDataList,
        modelMetaList
      })
  };

  onStateChange = (params) => {
    this.setState({
      ...params
    })
  };


  renderForm = () => {
    const {model} = this.props;
    const {allModels=[]} = model;
    return <div>
      <Form {...formItemLayout}>
        <FormItem label="模型" layout="horizontal">
          <Select placeholder="请选择模型" onChange={this.onModelChange}>
            {allModels.map(item => <SelectOption key={item.id} value={item.id}>{item.name}</SelectOption>)}
          </Select>
        </FormItem>
      </Form>
    </div>;
  };

  moveFieldToMeasure = (movedField) => {
    const {dimensionDataList, dimensionSelectedList,measureDataList,modelMetaList } = this.state;
    const findField = modelMetaList.find(data => data.id === movedField.metaId);
    this.setState({
      dimensionDataList: dimensionDataList.filter(data => data.metaId !== movedField.metaId),
      dimensionSelectedList: dimensionSelectedList.filter(data => data.metaId !== movedField.metaId),
      measureDataList: [...measureDataList, this.createField(findField, "measure")]
    });
  };

  moveFieldToDimension = (movedField) => {
    const {dimensionDataList,measureDataList, measureSelectedList,modelMetaList } = this.state;
    const findField = modelMetaList.find(data => data.id === movedField.metaId);
    this.setState({
      measureDataList: measureDataList.filter(data => data.metaId !== movedField.metaId),
      measureSelectedList: measureSelectedList.filter(data => data.metaId !== movedField.metaId),
      dimensionDataList: [...dimensionDataList, this.createField(findField, "dimension")]
    });
  };

  renderPane = ()=>{
    const {dimensionDataList, dimensionSelectedList, measureDataList, measureSelectedList, modelMetaList, paneKey} = this.state;
    let PaneComponent = null;
    const params = {};
    params.onParentStateChange = this.onStateChange;
    if(paneKey === "dimensionPane"){
      PaneComponent = DimensionPane;
      params.dataList = dimensionDataList;
      params.selectedList = dimensionSelectedList;
      params.moveFieldToMeasure = this.moveFieldToMeasure;
    } else {
      PaneComponent = MeasurePane;
      params.dataList = measureDataList;
      params.selectedList = measureSelectedList;
      params.moveFieldToDimension = this.moveFieldToDimension;
    }
    return (<PaneComponent {...params}/>);
  };

  renderContentPane(){
    return (<Card className={styles.modalContent}
                  style={{ width: '100%' }}
                  activeTabKey={this.state.paneKey}
                  tabList={tabList}
                  onTabChange={key => {
                    this.onTabChange(key, 'paneKey');
                  }}
          >
      {this.renderPane()}
    </Card>);
  }


  render() {
    const {loading = false} = this.props;
    return (
      <Modal
        destroyOnClose
        style={{ top: 20 }}
        width={900}
        title="新增取数"
        visible
        onOk={()=>{}}
        onCancel={()=>{}}
        confirmLoading={loading}>
        {this.renderForm()}
        {this.renderContentPane()}
      </Modal>
    )
  }

}

export default AggQueryModal;
