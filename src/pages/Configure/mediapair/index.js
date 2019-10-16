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
} from 'antd';
import { queryMediapair } from '@/services/mediapair';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import MediaPairForm from './component/MediaPairForm';
import styles from '../../styles/Manage.less';
import BehaviorHistoryCurve from '../../Monitor/analysis/graph/BehaviorHistoryCurve';
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ mediapair, loading }) => ({
  mediapair,
  loading: loading.models.mediapair,
}))
class DataMediaPair extends React.Component {
  state = {
    modalVisible: false,
    isEditForm: false,
    recordValue: {},
    drawerVisible: false,
  };
  pairColumn = [
    { title: '序号', dataIndex: 'id' },
    {
      title: '源表',
      render: (text, reocrd) => (
        <Popover
          content={`${reocrd.target.source.type}-${reocrd.source.source.name}-${reocrd.source.source.url}`}
          title="数据源"
          trigger="hover"
        >
          {reocrd.source.name
            .split(';')
            .filter(item => item != '')
            .map(item => (
              <div key={item}>{`${reocrd.source.namespace}.${item}`}</div>
            ))}
        </Popover>
      ),
    },
    {
      title: '目标表',
      render: (text, reocrd) => (
        <Popover
          content={`${reocrd.target.source.type}-${reocrd.target.source.name}-${reocrd.target.source.url}`}
          title="数据源"
          trigger="hover"
        >
          {reocrd.target.name
            .split(';')
            .filter(item => item != '')
            .map(item => (
              <div key={item}>{`${reocrd.target.namespace}.${item}`}</div>
            ))}
        </Popover>
      ),
    },
    { title: 'topic', render: (text, reocrd) => <span>{reocrd.target.topic}</span> },
    { title: '权重', dataIndex: 'pushWeight' },
    { title: 'DeleteCount', dataIndex: 'tableStat.deleteCount' },
    { title: 'UpdateCount', dataIndex: 'tableStat.updateCount' },
    { title: 'InsertCount', dataIndex: 'tableStat.insertCount' },
    { title: '最后同步时间', dataIndex: 'tableStat.gmtModified' },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          {record && record.existFilter ? (
            <Popover content={record.filterData.sourceText} title="过滤脚本" trigger="hover">
              <a>过滤器</a>
            </Popover>
          ) : (
            '过滤器'
          )}
          {record && record.channel.status === 'STOP' ? <Divider type="vertical"></Divider> : ''}

          {record && record.channel.status === 'STOP' ? (
            <a onClick={() => this.handleModalVisible(true, record, true)}>编辑</a>
          ) : (
            ''
          )}

          {record && record.channel.status === 'STOP' ? <Divider type="vertical"></Divider> : ''}

          {record && record.channel.status === 'STOP' ? (
            <Popconfirm
              placement="top"
              title="确实删除"
              onConfirm={() => this.handleDelete(record)}
            >
              <a>删除</a>
            </Popconfirm>
          ) : (
            ''
          )}
          <Divider type="vertical"></Divider>
          <a onClick={() => this.analysisHandleModalVisible(true, record)}>行为曲线</a>
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
      recordValue,
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

    if (recordValue != null) {
      dispatch({
        type: 'mediapair/fetch',
        payload: {
          pipelineId: recordValue.id,
        },
        callback: data => {
          this.setState({
            mediapairs: data,
          });
        },
      });

      this.timer = setInterval(() => {
        dispatch({
          type: 'mediapair/fetch',
          payload: {
            pipelineId: recordValue.id,
          },
          callback: data => {
            this.setState({
              mediapairs: data,
            });
          },
        });
      }, 10000);
    }
  }

  onClose = () => {
    const { drawerVisible } = this.state;
    this.setState({
      drawerVisible: !drawerVisible,
    });
  };

  handleModalVisible = (flag, record, isEdit) => {
    this.setState({
      modalVisible: !!flag,
      isEditForm: !!isEdit,
      rowRecord: record,
    });
  };

  analysisHandleModalVisible = (flag, record) => {
    this.setState({
      analysisModalVisible: !!flag,
      mediaPairRecord: record || {},
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
      type: 'mediapair/add',
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

    dispatch({
      type: 'mediapair/update',
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
      type: 'mediapair/remove',
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
      type: 'mediapair/fetch',
      payload: {
        pipelineId: recordValue.id,
      },
      callback: data => {
        this.setState({
          mediapairs: data,
        });
        handleChannelReload();
      },
    });
  };

  render() {
    const { loading } = this.props;
    const {
      modalVisible,
      isEditForm,
      expandForm,
      recordValue,
      drawerVisible,
      mediapairs,
      rowRecord,
      mediaPairRecord,
      analysisModalVisible,
    } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate,
      analysisHandleModalVisible: this.analysisHandleModalVisible,
    };
    // console.log(recordValue)
    return (
      <div style={{
        overflowX:'auto',
        width:window.innerWidth > 1080?'100%':'780px'

      }}>
        <Button
          type="primary"
          size="small"
          icon="plus"
          onClick={() => this.handleModalVisible(true, {}, false)}
        >
          添加数据映射
        </Button>
        <Table
          // loading={loading}
          size = {window.innerWidth > 1440?'default':'small'}
          dataSource={mediapairs}
          columns={this.pairColumn}
          rowKey={record => record.id}
          pagination={false}
          expandRowByClick={true}
          scroll={{ x: 800, y: 600 }}
        />
        {modalVisible && (
          <MediaPairForm
            {...parentMethods}
            isEdit={isEditForm}
            mediaPair={rowRecord}
            values={recordValue}
            modalVisible={modalVisible}
          />
        )}
        {analysisModalVisible && (
          <BehaviorHistoryCurve
            {...parentMethods}
            analysisModalVisible={analysisModalVisible}
            values={mediaPairRecord}
          />
        )}
      </div>
    );
  }
}
export default DataMediaPair;
