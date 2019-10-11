import React from 'react';
import { connect } from 'dva';
import { Alert, Form, Modal, Divider, Table } from 'antd';

/**
 * Author: feixy
 * Date: 2019-07-11
 * Time: 11:36
 */
@Form.create()
@connect(({ model, loading, peek }) => ({
  model,
  peek,
  loading: loading.models.model || loading.models.peek || loading.models.datasource,
}))
class PreviewModal extends React.Component {
  state = {
    data: [],
    columns: [],
    total: 0,
    orderByField: '',
    tableName: '',
  };

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    const { dispatch, item } = this.props;
    const { orderByField } = this.state;
    const { datasourceId, tableName, id } = item;

    dispatch({
      type: 'peek/previewImportData',
      payload: { datasourceId, tableName, orderByField, id },
      callback: ({ rows, columns, rowSize }) => {
        const newColumns = columns.map(column => ({
          title: column,
          dataIndex: column,
          sorter: true,
          width: '150px',
        }));
        if (newColumns.length > 0) {
          delete newColumns[newColumns.length - 1].width;
        }
        this.setState({
          data: rows,
          total: rowSize,
          tableName,
          columns: newColumns,
        });
      },
    });
  };

  handleChange = (pagination, filters, sorter) => {
    const { field = '', order = '' } = sorter;
    let orderByField;
    if (field) {
      if (order.startsWith('asc')) {
        orderByField = `${field} asc`;
      } else {
        orderByField = `${field} desc`;
      }
    }
    this.setState(
      {
        orderByField,
      },
      () => this.fetch()
    );
  };

  render() {
    const { modalVisible, handleModalVisible } = this.props;

    const { data, columns, total, tableName } = this.state;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={1000}
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => handleModalVisible()}
        style={{ top: 20 }}
        visible={modalVisible}
        title="预览数据"
      >
        <Alert message={`数据库表:${tableName} 中的记录总数:${total}条`} type="info" showIcon />
        <Divider />
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          scroll={{ x: 600 }}
          onChange={this.handleChange}
        />
      </Modal>
    );
  }
}

export default PreviewModal;
