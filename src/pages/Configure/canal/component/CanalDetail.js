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
  Icon,
  Divider,
  Descriptions,
  Badge,
  Table,
} from 'antd';
import { formatGroupDbAddress } from '@/utils/utils';
@Form.create()
@connect(({ canal, zookeeper, loading }) => ({
  canal,
  zookeeper,
  loading: loading.models.canal,
}))
class CanalDetail extends React.Component {
  state = {};
  columns = [
    { title: 'channel编号', dataIndex: 'channelId' },
    { title: 'pipeline名字', dataIndex: 'name' },
    { title: '消费端ID', dataIndex: 'parameters.mainstemClientId' },
    { title: '消费批次大小', dataIndex: 'parameters.mainstemBatchsize' },
    { title: '获取数据超时时间', dataIndex: 'parameters.batchTimeout' },
  ];
  constructor(props) {
    super(props);
    const { values } = this.props;
    this.setState({
      values,
    });
  }

  componentDidMount() {
    const { dispatch, values, destinationName } = this.props;
    this.setState({
      values,
    });

    if (destinationName) {
      console.log('访问远程1', destinationName);
      dispatch({
        type: 'canal/fetchByName',
        payload: {
          destinationName,
        },
        callback: data => {
          this.setState({
            values: data,
          });
        },
      });
    } else {
      console.log('访问远程2', values);
      dispatch({
        type: 'zookeeper/getZookeeper',
        payload: {
          id: values.canalParameter.zkClusterId,
        },
      });
    }
  }

  render() {
    const { values } = this.state;
    const {
      zookeeper: { zookeeper },
      loading,
    } = this.props;
    const canalParameter = (values && values.canalParameter) || {};
    const pipelines = (values && values.pipelines) || [];

    return (
      <div>
        <Descriptions title="canal信息" bordered column={1} size="small">
          <Descriptions.Item label="canal序号">{values && values.id}</Descriptions.Item>
          <Descriptions.Item label="canal名称">{values && values.name}</Descriptions.Item>
          <Descriptions.Item label="运行状态">
            {values && values.status ? 'true' : 'false'}
          </Descriptions.Item>
          <Descriptions.Item label="运行模式">{canalParameter.runMode}</Descriptions.Item>
          <Descriptions.Item label="Zookeeper集群">{canalParameter.zkClusters}</Descriptions.Item>
          <Descriptions.Item label="数据源类型">{canalParameter.sourcingType}</Descriptions.Item>
          <Descriptions.Item label="数据库地址">
            {formatGroupDbAddress(canalParameter.groupDbAddresses)}
          </Descriptions.Item>
          <Descriptions.Item label="数据库帐号">{canalParameter.dbUsername}</Descriptions.Item>
          <Descriptions.Item label="数据库密码">{canalParameter.dbPassword}</Descriptions.Item>
          <Descriptions.Item label="connectionCharset">
            {canalParameter.connectionCharset}
          </Descriptions.Item>
          <Descriptions.Item label="是否启用gtid位点">
            {canalParameter.gtidEnable ? 'true' : 'false'}
          </Descriptions.Item>
          <Descriptions.Item label="位点信息">{canalParameter.positions}</Descriptions.Item>
          <Descriptions.Item label="是否开启表结构TSDB">
            {canalParameter.tsdbEnable ? 'true' : 'false'}
          </Descriptions.Item>
          <Descriptions.Item label="rds accesskey">{canalParameter.rdsAccesskey}</Descriptions.Item>
          <Descriptions.Item label="rds secretkey">{canalParameter.rdsSecretkey}</Descriptions.Item>
          <Descriptions.Item label="rds rdsInstance">
            {canalParameter.rdsInstance}
          </Descriptions.Item>
          <Descriptions.Item label="存储机制">{canalParameter.storageMode}</Descriptions.Item>
          <Descriptions.Item label="内存存储batch获取模式">
            {canalParameter.storageBatchMode}
          </Descriptions.Item>
          <Descriptions.Item label="内存存储buffer记录数">
            {canalParameter.memoryStorageBufferSize}
          </Descriptions.Item>
          <Descriptions.Item label="内存存储buffer记录单元大小">
            {canalParameter.memoryStorageBufferMemUnit}
          </Descriptions.Item>
          <Descriptions.Item label="HA机制">{canalParameter.haMode}</Descriptions.Item>
          <Descriptions.Item label="是否开启心跳">
            {canalParameter.detectingEnable ? 'true' : 'false'}
          </Descriptions.Item>
          <Descriptions.Item label="心跳sql">{canalParameter.detectingSQL}</Descriptions.Item>
          <Descriptions.Item label="心跳检测频率">
            {canalParameter.detectingIntervalInSeconds}
          </Descriptions.Item>
          <Descriptions.Item label="心跳超时时间">
            {canalParameter.detectingTimeoutThresholdInSeconds}
          </Descriptions.Item>
          <Descriptions.Item label="心跳检查重试次数">
            {canalParameter.detectingRetryTimes}
          </Descriptions.Item>
          <Descriptions.Item label="是否启用心跳HA">
            {canalParameter.heartbeatHaEnable ? 'true' : 'false'}
          </Descriptions.Item>
          <Descriptions.Item label="meta机制">{canalParameter.metaMode}</Descriptions.Item>
          <Descriptions.Item label="索引机制">{canalParameter.indexMode}</Descriptions.Item>
          <Descriptions.Item label="服务端口">{canalParameter.port}</Descriptions.Item>
          <Descriptions.Item label="默认连接超时">
            {canalParameter.defaultConnectionTimeoutInSeconds}
          </Descriptions.Item>
          <Descriptions.Item label="接收BufferSize">
            {canalParameter.receiveBufferSize}
          </Descriptions.Item>
          <Descriptions.Item label="发送BufferSize">
            {canalParameter.sendBufferSize}
          </Descriptions.Item>
          <Descriptions.Item label="切换回退时间">
            {canalParameter.fallbackIntervalInSeconds}
          </Descriptions.Item>
          <Descriptions.Item label="过滤表达式">{canalParameter.blackFilter}</Descriptions.Item>
          <Descriptions.Item label="描述信息">{canalParameter.desc}</Descriptions.Item>
        </Descriptions>
        <Table
          loading={loading}
          dataSource={pipelines}
          columns={this.columns}
          rowKey={record => record.id}
          pagination={false}
        />
      </div>
    );
  }
}

export default CanalDetail;
