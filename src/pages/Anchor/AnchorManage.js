import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Popconfirm,
  message,
  Divider,
  Tag,
} from 'antd';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AnchorOptForm from './form/AnchorOptForm';

import styles from '../styles/Manage.less';

const { Option } = Select;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ user, role, loading, appinfo, anchor }) => ({
  user,
  role,
  loading: loading.models.user,
  appinfo,
  anchor,
}))
class CereBrumManage extends React.Component {
  state = {
    modalVisible: false,
    expandForm: false,
    isEditForm: false,
    recordValue: {},
    formValues: {},
  };

  // 表格字段
  columns = [
    {
      title: '所属应用',
      dataIndex: 'appInfoName',
    },
    {
      title: '埋点类型',
      dataIndex: 'type',
      render: text => {
        const {
          anchor: { allAnchorTypes },
        } = this.props;
        if (allAnchorTypes instanceof Array) {
          for (let i = 0, len = allAnchorTypes.length; i < len; i += 1) {
            if (allAnchorTypes[i][text] !== undefined) return allAnchorTypes[i][text];
          }
        }
        return text;
      },
    },
    { title: '唯一识别码', dataIndex: 'objectId' },
    {
      title: '事件类型',
      dataIndex: 'eventType',
      render: text => {
        const {
          anchor: { allEventTypes },
        } = this.props;
        if (allEventTypes instanceof Array) {
          for (let i = 0, len = allEventTypes.length; i < len; i += 1) {
            if (allEventTypes[i][text] !== undefined) return allEventTypes[i][text];
          }
        }
        return text;
      },
    },
    { title: '埋点名称', dataIndex: 'name' },
    {
      title: '状态',
      dataIndex: 'status',
      render: text => (
        <Tag color={text === 0 ? 'red' : 'blue'}>{text === 0 ? `未上线` : `上线`}</Tag>
      ),
    },
    { title: '创建人', dataIndex: 'creator' },
    {
      title: '创建时间',
      dataIndex: 'created',
      render: (text, record) => moment.unix(record.created).format('YYYY-MM-DD hh:mm:ss'),
    },
    { title: '备注', dataIndex: 'comment' },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        if (record.status === 0) {
          return (
            <Fragment>
              <a onClick={() => this.handleModalVisible(true, record, true)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleOnline(record)}>上线</a>
              <Divider type="vertical" />
              <Popconfirm
                placement="top"
                title="确定删除该应用？"
                onConfirm={() => this.handleDelete(record)}
              >
                <a>删除</a>
              </Popconfirm>
            </Fragment>
          );
        }
        return (
          <Fragment>
            <a onClick={() => this.handleOffline(record)}>下线</a>
          </Fragment>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'anchor/fetchByParams',
    });
    dispatch({
      type: 'appinfo/fetchAll',
    });
    dispatch({
      type: 'anchor/fetchAllAnchorTypes',
    });
    dispatch({
      type: 'anchor/fetchAllEventTypes',
    });
    dispatch({
      type: 'anchor/getAnchorTree',
    });
    dispatch({
      type: 'user/fetch',
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'anchor/fetchByParams',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleModalVisible = (flag, record, isEdit) => {
    this.setState({
      modalVisible: !!flag,
      isEditForm: !!isEdit,
      recordValue: record || {},
    });
  };

  handleOnline = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'anchor/onlineOrOffline',
      payload: { id: record.id, status: 1 },
      callback: () => {
        message.success('上线成功');
        // 重载数据
        this.reloadData();
      },
    });
  };

  handleOffline = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'anchor/onlineOrOffline',
      payload: { id: record.id, status: 0 },
      callback: () => {
        message.success('下线成功');
        // 重载数据
        this.reloadData();
      },
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'anchor/add',
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
      type: 'anchor/update',
      payload: fields,
      callback: () => {
        message.success('修改成功');
        this.handleModalVisible();
        // 重载数据
        this.reloadData();
      },
    });
  };

  // 删除操作处理
  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'anchor/remove',
      payload: record.id,
      callback: () => {
        message.success('删除成功');
        // 重载数据
        this.reloadData();
      },
    });
  };

  // 重新加载数据
  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'anchor/fetchByParams',
    });
    dispatch({
      type: 'appinfo/fetchAll',
    });
    dispatch({
      type: 'anchor/fetchAllAnchorTypes',
    });
    dispatch({
      type: 'anchor/fetchAllEventTypes',
    });
    dispatch({
      type: 'anchor/getAnchorTree',
    });
    dispatch({
      type: 'user/fetch',
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'anchor/fetchByParams',
        payload: {
          params: values,
        },
      });
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
      type: 'anchor/fetchByParams',
      payload: {
        params,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      user: { list },
      appinfo: { allAppInfos },
      anchor: { allAnchorTypes },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem key="appId" label="所属应用">
              {getFieldDecorator('appId')(
                <Select placeholder="选择应用" style={{ width: '100%' }}>
                  {allAppInfos.map(r => (
                    <Select.Option key={r.id} value={r.id}>
                      {r.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="type" label="埋点类型">
              {getFieldDecorator('type')(
                <Select placeholder="选择埋点类型" style={{ width: '100%' }}>
                  {allAnchorTypes.map(r => {
                    const key = Object.keys(r)[0];
                    return <Select.Option value={key}>{r[key]}</Select.Option>;
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="createdBy" label="创建人">
              {getFieldDecorator('createdBy')(
                <Select key="createdBy" placeholder="请选择创建人">
                  {list.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.nickname}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col md={8} sm={24}>
            <FormItem key="objectId" label="唯一识别码">
              {getFieldDecorator('objectId')(<Input placeholder="请输入唯一识别码" />)}
            </FormItem>
          </Col>
        </Row>
        <Divider type="horizontal" />
      </Form>
    );
  }

  render() {
    const {
      anchor: { data },
      loading,
    } = this.props;
    const { modalVisible, expandForm, recordValue, isEditForm } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="埋点管理" content="对埋点进行增删改查等操作~">
        <Card bordered={false}>
          <div className={styles.Manage}>
            {expandForm && <div className={styles.ManageForm}>{this.renderForm()}</div>}
            <div className={styles.ManageOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleModalVisible(true, {}, false)}
              >
                添加新埋点
              </Button>
              <span className={styles.querySubmitButtons}>
                <Button type="primary" onClick={this.handleSearch}>
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  {expandForm ? '收起' : '展开'}
                  <Icon type={expandForm ? 'up' : 'down'} />
                </a>
              </span>
            </div>
            <StandardTable
              loading={loading}
              data={data}
              columns={this.columns}
              rowKey={record => record.id}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {modalVisible && (
          <AnchorOptForm
            {...parentMethods}
            isEdit={isEditForm}
            values={recordValue}
            modalVisible={modalVisible}
          />
        )}
      </PageHeaderWrapper>
    );
  }
}

export default CereBrumManage;
