import React from 'react';
import { Table, Select, Form, Tooltip, Icon } from 'antd';
import styles from './index.less';

const AGG_TYPE_LIST = ['SUM', 'COUNT', 'MAX', 'MIN', 'AVG', 'COUNT DISTINCT'];
const FormItem = Form.Item;
const SelectOption = Select.Option;

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
/**
 * Author: feixy
 * Date: 2019-07-04
 * Time: 14:54
 */
class FieldPane extends React.Component {
  state = {};

  constructor(props) {
    super(props);

    this.columns = [
      {
        title: '分组标签',
        dataIndex: 'tagId',
        width: '15%',
        render: text => {
          const { tagList } = this.props;
          return tagList.find(item => item.id === text).name;
        },
      },
      {
        title: '名称',
        dataIndex: 'showName',
        key: 'showName',
        width: '40%',
        render: (text, record) => {
          const { remark } = record;
          return remark ? (
            <span>
              {text}
              <Tooltip placement="topLeft" title={remark} arrowPointAtCenter>
                <Icon type="question-circle" />
              </Tooltip>
            </span>
          ) : (
            text
          );
        },
      },
      { title: '字段类型', dataIndex: 'dataType', key: 'dataType', width: '15%' },
      {
        title: '聚合类型',
        dataIndex: 'aggExpression',
        key: 'aggExpression',
        width: '25%',
        render: (text, record) => {
          return (
            <Select
              placeholder="请选择聚合函数"
              value={text || undefined}
              style={{ width: '95%' }}
              allowClear
              onChange={this.onRowValueChange('aggExpression', record)}
            >
              {AGG_TYPE_LIST.map(type => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          );
        },
      },
    ];
  }

  onRowValueChange = (prop, record, mapper = e => e) => val => {
    const { onParentStateChange, dataList, selectedList } = this.props;
    const newDataList = dataList.map(item => {
      if (record.metaId === item.metaId) {
        return { ...item, [prop]: mapper(val) };
      }
      return item;
    });

    const newSelectedList = selectedList.map(item => {
      if (record.metaId === item.metaId) {
        return { ...item, [prop]: mapper(val) };
      }
      return item;
    });
    onParentStateChange({ fieldList: newDataList, selectedList: newSelectedList });
  };

  onRowSelectionChange = (selectedRowKeys, selectedRows) => {
    const { onParentStateChange, selectedList } = this.props;
    const dataList = this.getDataList();
    const mapper = {};
    dataList.forEach(item => {
      mapper[item.metaId] = true;
    });
    const tempDataList = selectedList.filter(item => !mapper[item.metaId]);
    onParentStateChange({ selectedList: [...tempDataList, ...selectedRows] });
  };

  renderFilterForm = () => {
    const { tagList = [], dataList = [], selectedTagInFieldPane, onParentStateChange } = this.props;
    const existedTagMapper = {};
    dataList.forEach(item => {
      existedTagMapper[item.tagId] = true;
    });
    return (
      <div>
        <Form {...formItemLayout}>
          <FormItem label="标签分组" layout="horizontal">
            <Select
              placeholder="请选择标签"
              value={selectedTagInFieldPane}
              onChange={val => onParentStateChange({ selectedTagInFieldPane: val }, false)}
            >
              {tagList
                .filter(({ id }) => id === -1 || existedTagMapper[id])
                .map(item => (
                  <SelectOption key={item.id} value={item.id}>
                    {item.name}
                  </SelectOption>
                ))}
            </Select>
          </FormItem>
        </Form>
      </div>
    );
  };

  getDataList = () => {
    const { selectedTagInFieldPane, dataList } = this.props;
    if (selectedTagInFieldPane !== -1) {
      return dataList.filter(item => item.tagId === selectedTagInFieldPane);
    }
    return dataList;
  };

  render() {
    const { selectedList = [] } = this.props;
    const rowSelection = {
      onChange: this.onRowSelectionChange,
      selectedRowKeys: selectedList.map(item => item.metaId),
    };
    return (
      <div className={styles.fieldPane}>
        {this.renderFilterForm()}
        <Table
          rowSelection={rowSelection}
          columns={this.columns}
          dataSource={this.getDataList()}
          size="small"
          rowKey="metaId"
          pagination={{ pageSize: 5 }}
        />
      </div>
    );
  }
}

export default FieldPane;
