import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  Popconfirm,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PeekOptForm from './form/PeekOptForm';

import styles from './PeekData.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ user, model, peek, loading }) => ({
  user,
  model,
  peek,
  loading: loading.models.peek
}))
class PeekManage extends React.Component {
  state = {
    modalVisible: false,
    expandForm: false,
    isEditForm: false,
    recordValue: {},
    formValues: {}
  }
  // 表格字段列表
  columns = [
    { title: '所属模型', dataIndex: 'modelName', key: 'modelName' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '创建人', dataIndex: 'creator', key: 'creator' },
    { title: '取数次数', dataIndex: 'peekTime', key: 'peekTime' },
    {
      title: '操作', render: (text, record) => (
        <Fragment>
          <Popconfirm placement="top" title="确定删除该模型？"
            onConfirm={() => this.handleDelete(record)}>
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => this.handleModalVisible(true, record, true)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm placement="top" title='导出数据到邮箱'
            onConfirm={() => this.exportData(record)}>
            <a>导出</a>
          </Popconfirm>
        </Fragment>
      )
    }
  ];
  componentDidMount() {
    const { dispatch } = this.props;
    // 获取取数实例
    dispatch({
      type: 'peek/fetch'
    });
    // 获取所有模型
    dispatch({
      type: 'model/fetchAll'
    });
    // 获取所有用户
    dispatch({
      type: 'user/fetch'
    });
  }

  handleModalVisible = (flag, record, isEdit) => {
    const { dispatch } = this.props;
    this.setState({
      modalVisible: !!flag,
      isEditForm: !!isEdit,
      recordValue: record || {},
    });
  };

  exportData = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'peek/sendData2Me',
      payload: record.id,
      callback: (msg) => {
        message.success(msg);
      }
    });
  }

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'peek/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        // 重载数据
        this.reloadData();
      }
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'peek/update',
      payload: fields,
      callback: () => {
        message.success('修改成功');
        this.handleModalVisible();
        // 重载数据
        this.reloadData();
      }
    });
  };

  // 删除操作处理
  handleDelete = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'peek/remove',
      payload: record.id,
      callback: () => {
        message.success('删除成功');
        // 重载数据
        this.reloadData();
      }
    });
  };

  // 重新加载数据
  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'peek/fetch',
      payload: {},
    });
  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'peek/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
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
        type: 'peek/fetch',
        payload: {
          params: values
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
      ...filters
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'peek/fetch',
      payload: {
        params,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      }
    });
  }

  // 查询form表单
  renderForm() {
    const {
      form: { getFieldDecorator },
      user: { list },
      model: { allModels },
    } = this.props;

    return (
      <Form key="peekForm" onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem key="modelId" label="所属模型">
              {getFieldDecorator('modelId')(
                <Select key="modelId" placeholder="请选择所属模型">
                  {
                    allModels.map((item, index) => (
                      <Option value={item.id} key={item.id}>{item.name}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="createdBy" label="创建人">
              {getFieldDecorator('createdBy')(
                <Select key="createdBy" placeholder="请选择创建人">
                  {
                    list.map((item, index) => (
                      <Option key={index} value={item.id}>{item.nickname}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="name" label="取数名称">
              {getFieldDecorator('name')(<Input placeholder="请输入取数名称" />)}
            </FormItem>
          </Col>
        </Row>
        <Divider type="horizontal" />
      </Form>
    );
  }

  render() {
    const { peek: { data }, loading } = this.props;
    const { modalVisible, expandForm, recordValue, formValues, isEditForm } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate
    }
    return (
      <PageHeaderWrapper
        title="取数管理"
        content="管理取数实例，每个取数实例即一个查询~">
        <Card bordered={false}>
          <div className={styles.peekDataManage}>
            {expandForm && (
              <div className={styles.peekDataManageForm}>{this.renderForm()}</div>
            )}
            <div className={styles.peekDataManageOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, {}, false)}>
                新建
              </Button>
              <span className={styles.querySubmitButtons}>
                <Button type="primary" onClick={this.handleSearch}>查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  {expandForm ? '收起' : '展开'}
                  <Icon type={expandForm ? 'up' : 'down'} />
                </a>
              </span>
            </div>
            <StandardTable
              data={data}
              loading={loading}
              rowKey={record => record.id}
              disabledSelected={true}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {modalVisible && (
          <PeekOptForm
            {...parentMethods}
            isEdit={isEditForm}
            values={recordValue}
            modalVisible={modalVisible}
          />
        )}
      </PageHeaderWrapper>
    )
  }
}

export default PeekManage;