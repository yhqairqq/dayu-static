import React from 'react';
import { connect } from 'dva';
import { Form, Modal, Tabs } from 'antd';
import SqlEditor from '@/components/SqlEditor';

const { TabPane } = Tabs;

@Form.create()
@connect(({ sqlRunLog, loading }) => ({
  sqlRunLog,
  loading: loading.models.sqlRunLog,
}))
class DetailInfo extends React.Component {
  static defaultProps = {
    values: {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const {
      values: { id },
    } = this.props;
    dispatch({
      type: 'sqlRunLog/fetchById',
      payload: {
        logId: id,
      },
      callback: data => {
        const { text, errInfo } = data;
        this.setState({
          text,
          errInfo,
        });
      },
    });
  }

  render() {
    const { modalVisible, handleModalVisible } = this.props;
    const { text, errInfo } = this.state;
    return (
      <Modal
        destroyOnClose
        width={1000}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title="详情"
        visible={modalVisible}
        footer={null}
        onCancel={() => handleModalVisible(false)}
        onOk={() => handleModalVisible(false)}
      >
        <Tabs defaultActiveKey="1" style={{ marginBottom: '15px' }}>
          <TabPane tab="运行SQL" key="1">
            <SqlEditor value={text} readOnly />
          </TabPane>
          <TabPane tab="错误日志" key="2">
            {errInfo}
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default DetailInfo;
