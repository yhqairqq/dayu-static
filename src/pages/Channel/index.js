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
  Dropdown,
  Menu,
  Spin,
} from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ChannelForm from './component/ChannelForm';
import Pipeline from '../Configure/pipeline';
import styles from '../styles/Manage.less';
import HistoryForm from './component/HistoryForm';
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ channel, pipeline, loading }) => ({
  channel,
  pipeline,
  loading: loading.models.channel,
}))
class Channel extends React.Component {
  state = {
    drawerVisible: false,
    modalVisible: false,
    pipelineModalVisible: false,
    isEditForm: false,
    recordValue: {},
    historyVisible: false,
    syching:false,
    closing:false,
    statusMap:new Map()
  };
  columns = [
    { title: '编号', dataIndex: 'id' },
    { title: 'channel名称', dataIndex: 'name' },
    {
      title: '运行状态',
      dataIndex: 'status',
      render: (text, record) => (
        <span>
          {record.status === 'STOP' ? (
            <Badge status="error" text="停止"></Badge>
          ) : record.status === 'PAUSE' ? (
            <Badge status="error" text="挂起"></Badge>
          ) : (
            <Badge status="processing" text="开启"></Badge>
          )}
        </span>
      ),
    },
    {
      title: '标签',
      render: (text, record) =>
        record.tag && (
          <span>
            <Tag color="red">{record.tag.name}</Tag>
            <Tag color="blue">{record.tag.subName}</Tag>
          </span>
        ),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (text, record) => {
        const {statusMap} = this.state;
        return <span>
          {record.ready ? (
            record.status === 'STOP' ? (
              statusMap&&statusMap.get(record.id)=='starting'?<Spin size="small" />:<Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <Popconfirm
                        placement="top"
                        title={record.status === 'STOP' ? '确定开启吗' : '确定关闭吗'}
                        onConfirm={() =>
                          this.switch(
                            record.id,
                            record.status === 'STOP' ? 'start' : 'stop',
                            'last'
                          )
                        }
                      >
                        <a>上一次位点开始</a>
                      </Popconfirm>
                    </Menu.Item>
                    <Menu.Item>
                      <Popconfirm
                        placement="top"
                        title={record.status === 'STOP' ? '确定开启吗' : '确定关闭吗'}
                        onConfirm={() =>
                          this.switch(record.id, record.status === 'STOP' ? 'start' : 'stop', 'new')
                        }
                      >
                        <a>最新位点开启</a>
                      </Popconfirm>
                    </Menu.Item>
                    <Menu.Item>
                      <Popconfirm
                        placement="top"
                        title={record.status === 'STOP' ? '确定开启吗' : '确定关闭吗'}
                        onConfirm={() =>
                          this.switch(
                            record.id,
                            record.status === 'STOP' ? 'start' : 'stop',
                            'full'
                          )
                        }
                      >
                        <a>全量同步</a>
                      </Popconfirm>
                    </Menu.Item>
                    <Menu.Item>
                      <a onClick={() => this.historyFormShow(record)}>历史位点开启</a>
                    </Menu.Item>
                  </Menu>
                }
              >
                <a className="ant-dropdown-link">
                  开启
                  <Icon type="down" />
                </a>
              </Dropdown>
            ) : (
              <Popconfirm
                placement="top"
                title={record.status === 'STOP' ? '确定开启吗' : '确定关闭吗'}
                onConfirm={() =>
                  this.switch(record.id, record.status === 'STOP' ? 'start' : 'stop', 'customize')
                }
              >
                {statusMap&&statusMap.get(record.id)=='stoping'?<Spin size="small" />: <a>关闭</a>}
              
              </Popconfirm>
            )
          ) : record.status === 'STOP' ? (
            '开启'
          ) : (
            '关闭'
          )}
          <Divider type="vertical"></Divider>
          {record.ready ? <span></span> : <span></span>}
          <a onClick={() => this.notify(record.id)}>推送</a>

          <Divider type="vertical"></Divider>
          <a onClick={() => this.showDrawer(record)}>详情</a>
          {record.status == 'STOP' ? <Divider type="vertical"></Divider> : ''}
          {record.status == 'STOP' ? (
            <a onClick={() => this.handleModalVisible(true, record, true)}>编辑</a>
          ) : (
            ''
          )}
          <Divider type="vertical"></Divider>
          {record.pipelines.length == 0 ? (
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
      },
    },
  ];
  renderTitle = record => {
    if (record.status == 'START') {
      return '关闭';
    } else if (record.status == 'STOP') {
      return '开启';
    } else {
      return '解挂';
    }
  };

  renderConfirm = record => {};

  componentWillUnmount() {
    // clearInterval(this.timer);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'channel/fetch',
    });
    //    this.timer =  setInterval(
    //         () => {
    //             console.log('channel 定时刷新')
    //             dispatch({
    //                 type:'channel/fetch',
    //             })
    //         },
    //         10000
    //     );
  }
  showDrawer = record => {
    this.setState({
      drawerVisible: true,
      recordValue: record,
    });
  };
  swtichWithStart = (channelId, status, start, startTime) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'channel/doStatus',
      payload: {
        status: status,
        id: channelId,
        start,
        startTime,
      },
      callback: data => {
        this.handleHistoryModalVisible(false);
        this.reloadData();
      },
    });
  };
  switch = (channelId, status, start) => {
    const { dispatch } = this.props;
    const {statusMap} = this.state;

    if(status == 'start'){
        statusMap.set(channelId,'starting')
    }else{
      statusMap.set(channelId,'stoping')
    }
    
    dispatch({
      type: 'channel/doStatus',
      payload: {
        status: status,
        id: channelId,
        start,
      },
      callback: data => {
        this.reloadData();
        if(status == 'start'){
          statusMap.set(channelId,'started')
        }else{
          statusMap.set(channelId,'stoped')
        }
      },
    });
  };

  notify = channelId => {};
  onClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  nestedTable = data => {
    const pairRowRender = pairs => {
      const { pipelines } = data;
      const columns = [
        { title: '原始数据源', dataIndex: 'source' },
        { title: '目标数据源', dataIndex: 'target' },
      ];
      return <Table columns={columns} dataSource={pairs} pagination={false} />;
    };
    const pipelinesRowRender = pipelines => {
      const columns = [{ title: '名称', dataIndex: 'name' }];
      return (
        <Table
          columns={columns}
          dataSource={pipelines}
          expandedRowRender={pairRowRender()}
          pagination={false}
        ></Table>
      );
    };
  };
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'channel/add',
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
      type: 'channel/update',
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
      type: 'channel/remove',
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
    const { dispatch } = this.props;
    dispatch({
      type: 'channel/fetch',
      payload: {},
    });
  };
  // 分页、过滤、排序处理
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
      type: 'channel/fetch',
      payload: {
        params,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };
  handleModalVisible = (flag, record, isEdit) => {
    this.setState({
      modalVisible: !!flag,
      isEditForm: !!isEdit,
      recordValue: record || {},
    });
  };
  handleHistoryModalVisible = flag => {
    this.setState({
      historyVisible: flag,
    });
  };
  handlePiplineModalVisible = (flag, record, isEdit) => {
    this.setState({
      pipelineModalVisible: !!flag,
      isEditForm: !!isEdit,
      recordValue: record || {},
    });
  };

  historyFormShow = record => {
    this.setState({
      historyVisible: true,
      selectedRecord: record,
    });
  };
  searchChannel = () =>{
    const {dispatch,form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
          type: 'channel/fetch',
          payload:{
              ...fieldsValue
          }
      });
    });
  }

  render() {
    const {
      loading,
      channel: { data },
      form,
    } = this.props;
    const {
      modalVisible,
      isEditForm,
      recordValue,
      drawerVisible,
      historyVisible,
      selectedRecord,
      syching,
    } = this.state;
    const pipelines = recordValue.pipelines || [];
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate,
      handleChannelReload: this.reloadData,
      handleHistoryModalVisible: this.handleHistoryModalVisible,
      swtichWithStart: this.swtichWithStart,
    };
    // console.log(data)
    const pStyle = {
      fontSize: 16,
      color: 'rgba(0,0,0,0.85)',
      lineHeight: '24px',
      display: 'block',
      marginBottom: 16,
    };

    const DrawerCol = ({ media }) => (
      <Col span={12}>
        <p>
          {' '}
          <span
            style={{
              marginRight: 8,
              fontWeight: 'bold',
            }}
          >
            jdbc:
          </span>
          {media.source.url}
        </p>
        <p>
          {' '}
          <span
            style={{
              marginRight: 8,
              fontWeight: 'bold',
            }}
          >
            数据库:
          </span>
          {media.namespace}
        </p>
        <p>
          {' '}
          <span
            style={{
              marginRight: 8,
              fontWeight: 'bold',
            }}
          >
            表:
          </span>
          {media.name}
        </p>
      </Col>
    );

    return (
      <PageHeaderWrapper title="Channel管理" content="管理同步链路">
        <Card bordered={false}>
          <div className={styles.message}>
            
            <div className={styles.ManageOperator}>
              <span className={styles.querySubmitButtons}>
              
              </span>
              <div style={{
                marginTop:'20px',
                marginBottom:'20px'
              }}>
              <Form layout="inline">
                    <FormItem style={{marginLeft:'20px'}} key="name" {...this.formLayout} label="channel名称">
                    {form.getFieldDecorator('name', {
                        rules: [{ required: false, message: 'channel名称' }],
                        initialValue: '',
                    })(<Input placeholder="channel名称" />)} 
                    </FormItem>
                    
                    <FormItem key="status" {...this.formLayout} label="状态">
                        {form.getFieldDecorator('status', {
                            rules: [{ required: false, message: '状态' }],
                            initialValue: '',
                        })(
                            <Select style={{ width: 100 }} mode="single" placeholder="状态">
                                 <Option key={'START'} value={'START'}>
                                    运行
                                </Option>
                                <Option key={'PAUSE'} value={'PAUSE'}>
                                    挂起
                                </Option>
                                <Option key={'STOP'} value={'STOP'}>
                                    停止
                                </Option>
                            </Select>
                        )}
                        </FormItem>
                    <Button style={{
                      marginTop:'5px',
                      marginRight:'20px',
                    }} type="primary" icon="search" onClick = {()=>this.searchChannel()}>查询</Button>
                    <Button
                      style={{
                        marginTop:'5px'
                      }}
                      icon="plus"
                      type="primary"
                      onClick={() => this.handleModalVisible(true, {}, false)}
                    >
                      新建链路
                    </Button>
              </Form>
              
              </div>
            </div>
          </div>
          <StandardTable
            size = {window.innerWidth > 1440?'default':'small'}
            // loading={loading}
            data={data}
            columns={this.columns}
            rowKey={record => `${record.id}-1`}
            onChange={this.handleStandardTableChange}
            // expandRowByClick={true}
            expandedRowRender={record => (
              <Pipeline {...parentMethods} recordValue={record}></Pipeline>
            )}
          />
          <ChannelForm
            {...parentMethods}
            isEdit={isEditForm}
            values={recordValue}
            modalVisible={modalVisible}
          />

          <Drawer
            width={700}
            placement="right"
            closable={false}
            onClose={this.onClose}
            visible={this.state.drawerVisible}
          >
            <p style={{ ...pStyle, marginBottom: 24 }}></p>
            <p style={pStyle}>{recordValue && recordValue.name}</p>
            {pipelines &&
              pipelines.map(pipeline =>
                pipeline.pairs.map(pair => (
                  <Row
                    key={pair.id}
                    style={{
                      borderBottom: '1px solid #e9e9e9',
                    }}
                  >
                    <DrawerCol media={pair.source}></DrawerCol>
                    <DrawerCol media={pair.target}></DrawerCol>
                  </Row>
                ))
              )}
          </Drawer>
          {historyVisible && (
            <HistoryForm
              {...parentMethods}
              historyVisible={historyVisible}
              channelId={selectedRecord.id}
            ></HistoryForm>
          )}
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Channel;
