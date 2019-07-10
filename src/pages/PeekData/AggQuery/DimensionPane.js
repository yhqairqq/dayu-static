import React, { Fragment } from 'react';
import { Table } from 'antd';
import styles from './index.less';

/**
 * Author: feixy
 * Date: 2019-07-04
 * Time: 14:54
 */
class DimensionPane extends React.Component {
  state = {};

  constructor(props) {
    super(props);
    const { moveFieldToMeasure } = this.props;
    this.columns = [
      { title: '名称', dataIndex: 'showName', key: 'showName' },
      { title: '字段类型', dataIndex: 'dataType', key: 'dataType' },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => moveFieldToMeasure(record)}>置为指标</a>
          </Fragment>
        ),
      },
    ];
  }

  onRowSelectionChange = (selectedRowKeys, selectedRows) => {
    const { onParentStateChange } = this.props;
    onParentStateChange({ dimensionSelectedList: [...selectedRows] });
  };

  render() {
    const { selectedList } = this.props;
    const rowSelection = {
      onChange: this.onRowSelectionChange,
      selectedRowKeys: selectedList.map(item => item.metaId),
    };
    const { dataList = [] } = this.props;
    return (
      <div className={styles.rulePane}>
        <Table
          rowSelection={rowSelection}
          columns={this.columns}
          dataSource={dataList}
          size="small"
          style={{ maxHeight: '250px' }}
          rowKey="metaId"
          pagination={{ pageSize: 5 }}
        />
      </div>
    );
  }
}

export default DimensionPane;
