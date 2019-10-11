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
  Modal,
} from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../styles/Manage.less';
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ alarmrule, loading }) => ({
  alarmrule,
  loading: loading.models.alarmrule,
}))
class AlarmRuleList extends React.Component {
  state = {
    modalVisible: false,
    isEditForm: false,
    recordValue: {},
    drawerVisible: false,
  };
  columns = [
    { title: '序号', dataIndex: 'id' },
    { title: 'PIPELINE通道', dataIndex: 'pipelineId' },
    { title: '监控项目', dataIndex: 'monitorName' },
    { title: '阈值', dataIndex: 'matchValue' },
    {
      title: '状态',
      dataIndex: 'status',
      render: text => (
        <span>
          {text === 'DISABLE' ? (
            <Badge status="error" text="停止"></Badge>
          ) : (
            <Badge status="processing" text="开启"></Badge>
          )}
        </span>
      ),
    },
    { title: '发送对象', dataIndex: 'receiverKey' },
    { title: '暂停时间', dataIndex: 'url' },

    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a>描述</a>
          <Divider type="vertical"></Divider>
          <a>历史</a>
          <Divider type="vertical"></Divider>
          <a
            onClick={() =>
              this.doSwtchStatus(record, record.status == 'DISABLE' ? 'ENABLE' : 'PAUSE')
            }
          >
            {record.status == 'DISABLE' ? '开启' : '暂停'}
          </a>
          <Divider type="vertical"></Divider>
          <a>编辑</a>
          <Divider type="vertical"></Divider>
          <a>删除</a>
        </span>
      ),
    },
  ];
  componentDidMount() {
    const { dispatch, values } = this.props;
    console.log('values', values);
    if (values != null) {
      dispatch({
        type: 'rule/fetchByPipelineId',
        payload: {
          pipelineId: values.id,
        },
        callback: data => {
          console.log(data);
          this.setState({
            alarmRules: data,
          });
        },
      });
    }
  }

  doSwtchStatus = (record, status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/doSwitchStatus',
      payload: {
        id: record.id,
        status,
      },
      callback: () => {
        message.success('更新成功');
        this.reloadData();
      },
    });
  };
  addAlarmRules = () => {
    const { dispatch, values } = this.props;
    dispatch({
      type: 'rule/addAlarmRules',
      payload: {
        pipelineId: values.id,
      },
      callback: () => {
        message.success('添加成功');
        this.reloadData();
      },
    });
  };

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      recordValue: record || {},
    });
  };

  // 重新加载数据
  reloadData = () => {
    const { dispatch, values } = this.props;
    dispatch({
      type: 'alarmrule/fetchByPipelineId',
      payload: {
        pipelineId: values.id,
      },
      callback: data => {
        this.setState({
          alarmRules: data,
        });
      },
    });
  };

  render() {
    const {
      loading,
      alarmRulehandleUpdate,
      alarmRulehandleModalVisible,
      alarmRulemodalVisible,
    } = this.props;

    const { alarmRules } = this.state;

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={1500}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 10px' }}
        title={'告警规则列表'}
        visible={alarmRulemodalVisible}
        onCancel={() => alarmRulehandleModalVisible(false, {})}
        footer={[]}
      >
        <div>
          <Button type="primary" icon="plus" onClick={() => this.addAlarmRules()}>
            一键监控
          </Button>
        </div>
        <div>
          <Table
            loading={loading}
            dataSource={alarmRules}
            columns={this.columns}
            rowKey={record => record.id}
          />
        </div>
      </Modal>
    );
  }
}
export default AlarmRuleList;
