import React, { Fragment } from 'react';
import {Table, Select} from "antd";
import styles from "./index.less";


const AGG_TYPE_LIST = ["SUM", "COUNT", "MAX", "MIN", "AGG", "COUNT DISTINCT"];

/**
 * Author: feixy
 * Date: 2019-07-04
 * Time: 14:54
 */
class MeasurePane extends React.Component{

  state={
  };

  constructor(props) {
    super(props);
    const {moveFieldToDimension} = this.props;
    this.columns = [
      { title: '名称', dataIndex: 'showName', key: 'showName', width:"45%" },
      { title: '字段类型', dataIndex: 'dataType', key: 'dataType',width:"15%" },
      { title: '聚合类型', dataIndex: 'aggExpression', key: 'aggExpression',width:"30%",
        render:(text, record)=>{
          return (<Select placeholder="请选择聚合函数" value={text} style={{width:"95%"}} onChange={this.onRowValueChange('aggExpression',record)}>
            {AGG_TYPE_LIST.map(type=> <Select.Option key={type} value={type}>{type}</Select.Option>)}
          </Select>);
        }
      },
      {
        title: '操作',width:"10%",
        render: (text, record) => (
          <Fragment>
            <a onClick={() => moveFieldToDimension(record)}>置为维度</a>
          </Fragment>
        ),
      },
    ];
  }

  onRowValueChange = (prop, record, mapper= e=>e) => (val) => {

    const {onParentStateChange, dataList} = this.props;
    const newDataList = dataList.map(item => {
      if(record.metaId === item.metaId){
        return {...item, [prop]:mapper(val)}
      }
      return item;
    });
    onParentStateChange({measureDataList:newDataList});
  };

  onRowSelectionChange = (selectedRowKeys, selectedRows) => {
    const {onParentStateChange} = this.props;
    onParentStateChange({measureSelectedList:[...selectedRows]});
  };

  render(){
    const {dataList=[], selectedList = []} = this.props;
    const rowSelection = {
      onChange:this.onRowSelectionChange,
      selectedRowKeys:selectedList.map(item=>item.metaId),
    };
    return (<div className={styles.pane}>
      <Table rowSelection={rowSelection}
             columns={this.columns}
             dataSource={dataList}
             size="small"
             style={{maxHeight:"250px"}}
             rowKey="metaId"
             pagination={{pageSize:5}}
      />
    </div>)
  }
}

export default MeasurePane;
