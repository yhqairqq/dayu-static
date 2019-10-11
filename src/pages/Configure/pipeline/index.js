import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Icon,
  Button,
  Popconfirm,
  Form,
  Divider,
  Col,
  Tag,
  Row,
  Input,
  TreeSelect,
  Select,
  message,
  Badge,
  Table,
  Drawer,
  Descriptions,
  Popover,
  Modal,
} from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PipelineForm from './component/PipelineForm';
import MediaPair from '../mediapair';
import PipelineDetail from './component/PipelineDetail';
import AlarmRuleList from '../alarmrule';
import PipelineAnalysis from '../../Monitor/analysis/graph/PipelineAnalysis';
import DelayStatAnalysis from '../../Monitor/analysis/graph/DelayStatAnalysis';
import TopLogRecord from '../../Monitor/logrecord/component/TopLogRecord';
import styles from '../../styles/Manage.less';
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ pipeline, loading }) => ({
  pipeline,
  loading: loading.models.pipeline,
}))
class Pipeline extends React.PureComponent {
  state = {
    modalVisible: false,
    isEditForm: false,
    recordValue: {},
    drawerVisible: false,
    alarmRulemodalVisible: false,
    analysisModalVisible: false,
  };
  piplineColumns = [
    { title: 'pipeline编号', dataIndex: 'id' },
    { title: 'pipeline名称', dataIndex: 'name' },
    {
      title: 'mainstem状态',
      render: (text, record) => (
        <Popover
          content={record.positionEventData && record.positionEventData.position}
          title="位点信息"
          trigger="hover"
        >
          {record.mainStemEventData && record.mainStemEventData.status == 'OVERTAKE' ? (
            <Badge status="processing" text="工作中"></Badge>
          ) : (
            <Badge status="error" text="定位中"></Badge>
          )}
        </Popover>
      ),
    },
    {
      title: '延迟时间',
      render: (text, record) => (
        <Popover
          content={<DelayStatAnalysis values={record}></DelayStatAnalysis>}
          title="延迟信息"
          trigger="hover"
        >
          <a>{`${record.delayStat && record.delayStat.delayTime} ms`}</a>{' '}
          <Icon type="fund" theme="twoTone" />
        </Popover>
      ),
    },
    {
      title: '最后同步时间',
      render: (text, record) => record.throughputStat && record.throughputStat.gmtModified,
    },
    {
      title: '最后同步位点时间',
      render: (text, record) => record.positionEventData && record.positionEventData.modifiedTime,
    },
    {
      title: '监控数',
      render: (text, record) =>
        record.alarmRules && (
          <a onClick={() => this.alarmRulehandleModalVisible(true, record)}>
            {record.alarmRules.length} <Icon type="bell" theme="twoTone" />
          </a>
        ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={() => this.showDrawer(record)}>查看</a>
          {record && record.channel.status === 'STOP' ? <Divider type="vertical"></Divider> : ''}
          {record && record.channel.status === 'STOP' ? (
            <a onClick={() => this.handleModalVisible(true, record, true)}>编辑</a>
          ) : (
            ''
          )}
          <Divider type="vertical"></Divider>
          <Popover
            content={<TopLogRecord values={record}></TopLogRecord>}
            title="日志信息"
            trigger="hover"
          >
            <a>
              日志 <Icon type="bug" theme="twoTone" />
            </a>
          </Popover>
          <Divider type="vertical"></Divider>
          <a onClick={() => this.analysisHandleModalVisible(true, record)}>流量</a>{' '}
          <Icon type="fund" theme="twoTone" />
          <Divider type="vertical"></Divider>
          {record.pairs.length == 0 ? (
            <Popconfirm
              placement="top"
              title="确实删除"
              onConfirm={() => this.handleDelete(record)}
            >
              <a>删除</a>
            </Popconfirm>
          ) : (
            <span>删除</span>
          )}
        </span>
      ),
    },
  ];
  constructor(props) {
    super(props);
    const { recordValue } = props;

    this.state = {
      positionVisible: 'none',
      otherParamsVisible: 'none',
      enableRemedyVisible: 'none',
      recordValue: recordValue,
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  componentDidMount() {
    const { dispatch, recordValue } = this.props;
    dispatch({
      type: 'pipeline/fetch',
      payload: {
        channelId: recordValue.id,
      },
      callback: data => {
        this.setState({
          pipelines: data,
        });
      },
    });
    this.timer = setInterval(() => {
      console.log('pipeline 刷新', recordValue.id);
      dispatch({
        type: 'pipeline/fetch',
        payload: {
          channelId: recordValue.id,
        },
        callback: data => {
          this.setState({
            pipelines: data,
          });
        },
      });
    }, 10000);
  }

  analysisHandleModalVisible = (flag, record) => {
    this.setState({
      analysisModalVisible: !!flag,
      piplineRecord: record || {},
    });
  };

  showDrawer = record => {
    const { drawerVisible } = this.state;
    this.setState({
      drawerVisible: true,
      piplineRecord: record,
    });
  };
  onClose = () => {
    const { drawerVisible } = this.state;
    this.setState({
      drawerVisible: !drawerVisible,
    });
  };

  alarmRulehandleModalVisible = (flag, record) => {
    this.setState({
      alarmRulemodalVisible: !!flag,
      piplineRecord: record || {},
    });
  };
  handleModalVisible = (flag, record, isEdit) => {
    this.setState({
      modalVisible: !!flag,
      isEditForm: !!isEdit,
      piplineRecord: record || {},
    });
  };
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'canal/fetch',
      payload: {
        params,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pipeline/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        // 重载数据
        this.reloadData();
      },
    });
  };
  handleUpdate = fields => {
    const { dispatch } = this.props;
    console.log(dispatch);
    dispatch({
      type: 'pipeline/update',
      payload: fields,
      callback: () => {
        message.success('修改成功');
        this.handleModalVisible();
        // 重载数据
        this.reloadData();
      },
    });
  };
  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pipeline/remove',
      payload: {
        id: record.id,
      },
      callback: () => {
        message.success('删除成功');
        // 重载数据
        this.reloadData();
      },
    });
  };
  reloadData = () => {
    const { dispatch, recordValue, handleChannelReload } = this.props;
    dispatch({
      type: 'pipeline/fetch',
      payload: {
        channelId: recordValue.id,
      },
      callback: data => {
        this.setState({
          pipelines: data,
        });
        handleChannelReload();
      },
    });
  };

  render() {
    const { loading, handleChannelReload } = this.props;
    const {
      modalVisible,
      isEditForm,
      expandForm,
      recordValue,
      drawerVisible,
      pipelines,
      piplineRecord,
      alarmRulemodalVisible,
      analysisModalVisible,
    } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate,
      handleChannelReload,
      alarmRulehandleModalVisible: this.alarmRulehandleModalVisible,
      analysisHandleModalVisible: this.analysisHandleModalVisible,
    };

    return (
      <div>
        <Button
          size="small"
          disabled={pipelines != null && pipelines.length > 0}
          type="primary"
          icon="plus"
          onClick={() => this.handleModalVisible(true, {}, false)}
        >
          添加pipeline信息
        </Button>
        <Table
          // loading={loading}
          dataSource={pipelines}
          columns={this.piplineColumns}
          rowKey={record => record.id}
          pagination={false}
          expandedRowRender={record => <MediaPair {...parentMethods} recordValue={record} />}
        />
        {modalVisible && (
          <PipelineForm
            {...parentMethods}
            isEdit={isEditForm}
            values={piplineRecord}
            modalVisible={modalVisible}
            channelId={recordValue.id}
          />
        )}
        <Drawer
          width={800}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={drawerVisible}
        >
          <PipelineDetail values={piplineRecord}></PipelineDetail>
        </Drawer>
        {alarmRulemodalVisible && (
          <AlarmRuleList
            values={piplineRecord}
            {...parentMethods}
            alarmRulemodalVisible={alarmRulemodalVisible}
          ></AlarmRuleList>
        )}
        {analysisModalVisible && (
          <PipelineAnalysis
            values={piplineRecord}
            {...parentMethods}
            analysisModalVisible={analysisModalVisible}
          ></PipelineAnalysis>
        )}
      </div>
    );
  }
}
export default Pipeline;
