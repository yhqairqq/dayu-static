import React from 'react';
import { Empty, Modal, Table } from 'antd';

class PreviewDataModal extends React.Component {
  static defaultProps = {
    rules: [],
    columns: [],
    handleModalVisible: () => {},
  };

  state = {};

  render() {
    const { data, columns, modalVisible, handleModalVisible } = this.props;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={740}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title="数据预览"
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        onOk={() => handleModalVisible()}
      >
        {data.length <= 0 ? (
          <Empty
            style={{ marginTop: 20 }}
            imageStyle={{ height: 50 }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>你的规则没有命中一条数据~~</span>}
          />
        ) : (
          <Table size="small" dataSource={data} columns={columns} pagination={false} />
        )}
      </Modal>
    );
  }
}

export default PreviewDataModal;
