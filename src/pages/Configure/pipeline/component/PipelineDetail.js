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
  Drawer,
} from 'antd';
import { formatGroupDbAddress } from '@/utils/utils';

import CanalDetail from '../../canal/component/CanalDetail';

@Form.create()
@connect(({ pipeline, zookeeper, loading }) => ({
  pipeline,
  zookeeper,
  loading: loading.models.pipeline,
}))
class PipelineDetail extends React.Component {
  state = {
    otherParametersVisible: false,
    drawerVisible: false,
  };
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
  }
  switchChange = (checked, event) => {
    const { otherParametersVisible } = this.state;
    this.setState({
      otherParametersVisible: !otherParametersVisible,
    });
  };
  showCanal = () => {
    this.setState({
      drawerVisible: true,
    });
  };
  onClose = () => {
    const { drawerVisible } = this.state;
    this.setState({
      drawerVisible: !drawerVisible,
    });
  };

  componentDidMount() {
    //    const {dispatch,values} = this.props;
    //    dispatch({
    //        type:'zookeeper/getZookeeper',
    //        payload:{
    //         id:values.canalParameter.zkClusterId,
    //        }
    //    });
  }

  render() {
    const { otherParametersVisible, drawerVisible } = this.state;
    const {
      values,
      zookeeper: { zookeeper },
      loading,
    } = this.props;

    const parameters = values.parameters || {};

    return (
      <div>
        <Descriptions title="pipeline信息" bordered column={1} size="small">
          <Descriptions.Item label="Pipeline序号">{values.id}</Descriptions.Item>
          <Descriptions.Item label="Pipeline名字">{values.name}</Descriptions.Item>
          <Descriptions.Item label="Select机器">
            {values.selectNodes &&
              values.selectNodes.map(node => <span key={node.id}>{node.name};</span>)}
          </Descriptions.Item>
          <Descriptions.Item label="Load机器">
            {values.loadNodes &&
              values.loadNodes.map(node => <span key={node.id}>{node.name};</span>)}
          </Descriptions.Item>
          <Descriptions.Item label="并行度">{parameters.parallelism}</Descriptions.Item>
          <Descriptions.Item label="数据反查线程数">{parameters.extractPoolSize}</Descriptions.Item>
          <Descriptions.Item label="数据载入线程数">{parameters.loadPoolSize}</Descriptions.Item>
          <Descriptions.Item label="主站点">{parameters.home ? '是' : '否'}</Descriptions.Item>
          <Descriptions.Item label="同步数据来源">{parameters.selectorMode}</Descriptions.Item>
          <Descriptions.Item label="Canal名字">
            {<a onClick={this.showCanal}>{parameters.destinationName}</a>}
          </Descriptions.Item>
          <Descriptions.Item label="主道消费批次大小">
            {parameters.mainstemBatchsize}
          </Descriptions.Item>
          {parameters.selectorMode == 'Canal' && (
            <Descriptions.Item label="获取批次数据超时时间">
              {parameters.batchTimeout}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="描述信息">{values.description}</Descriptions.Item>
        </Descriptions>
        <Switch checkedChildren="开" unCheckedChildren="关" onClick={this.switchChange} />
        {otherParametersVisible && (
          <Descriptions title="高级选项" bordered column={1} size="small">
            <Descriptions.Item label="使用batch">
              {parameters.useBatch ? '是' : '否'}
            </Descriptions.Item>
            <Descriptions.Item label="跳过Select异常">
              {parameters.skipSelectException ? '开启' : '关闭'}
            </Descriptions.Item>
            <Descriptions.Item label="跳过Load异常">
              {parameters.skipLoadException ? '开启' : '关闭'}
            </Descriptions.Item>
            <Descriptions.Item label="仲裁器调度模式">{parameters.arbitrateMode}</Descriptions.Item>
            <Descriptions.Item label="负载均衡算法">{parameters.lbAlgorithm}</Descriptions.Item>
            <Descriptions.Item label="传输模式">{parameters.pipeChooseType}</Descriptions.Item>
            <Descriptions.Item label="记录selector日志">
              {parameters.dumpSelector ? '开启' : '关闭'}
            </Descriptions.Item>
            <Descriptions.Item label="记录selector详细日志">
              {parameters.dumpSelectorDetail ? '开启' : '关闭'}
            </Descriptions.Item>
            <Descriptions.Item label="记录load日志">
              {parameters.dumpEvent ? '开启' : '关闭'}
            </Descriptions.Item>
            <Descriptions.Item label="dryRun模式">
              {parameters.dryRun ? '开启' : '关闭'}
            </Descriptions.Item>
            <Descriptions.Item label="跳过数据">
              {parameters.dataSyncSkip ? '开启' : '关闭'}
            </Descriptions.Item>
            <Descriptions.Item label="支持ddl同步">
              {parameters.ddlSync ? '开启' : '关闭'}
            </Descriptions.Item>
            <Descriptions.Item label="跳过ddl异常">
              {parameters.skipDdlException ? '开启' : '关闭'}
            </Descriptions.Item>
            <Descriptions.Item label="启用公网同步">
              {parameters.useExternalIp ? '开启' : '关闭'}
            </Descriptions.Item>
            <Descriptions.Item label="跳过自由门数据">
              {parameters.skipFreedom ? '开启' : '关闭'}
            </Descriptions.Item>
            <Descriptions.Item label="跳过反查无记录数据">
              {parameters.skipNoRow ? '开启' : '关闭'}
            </Descriptions.Item>
            <Descriptions.Item label="启用数据表类型转化">
              {parameters.useTableTransform ? '开启' : '关闭'}
            </Descriptions.Item>
            <Descriptions.Item label="兼容字段新增同步">
              {parameters.enableCompatibleMissColumn ? '开启' : '关闭'}
            </Descriptions.Item>
            <Descriptions.Item label="传递变化">
              {parameters.passChange ? '开启' : 'false'}
            </Descriptions.Item>
            <Descriptions.Item label="自定义同步标记">{parameters.channelInfo}</Descriptions.Item>
          </Descriptions>
        )}

        <Drawer
          width={800}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={drawerVisible}
        >
          <CanalDetail destinationName={parameters.destinationName}></CanalDetail>
        </Drawer>

        {/* <Table
                               loading={loading}
                               dataSource={pipelines}
                               columns={this.columns}
                               rowKey={record => record.id}
                               pagination={false}
                               /> */}
      </div>
    );
  }
}

export default PipelineDetail;
