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
import ModelOptForm from './form/ModelOptForm';

import styles from './PeekData.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['success', 'error'];
const status = ['使用中', '已停用'];

@Form.create()
@connect(({ model, datasource, loading }) => ({
  model,
  datasource,
  loading: loading.models.model,
}))
class ModelManage extends React.Component {
  state = {
    modalVisible: false,
    expandForm: false,
    recordValue: {},
    isEditForm: false, // 是否为编辑数据
    formValues: {}
  };

  // 表格字段列表
  columns = [
    { title: '模型名称', dataIndex: 'name', },
    {
      title: '模型状态', dataIndex: 'status', filters: [
        { text: status[0], value: 0, },
        { text: status[1], value: 1, }
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    { title: '创建人', dataIndex: 'creator' },
    { title: '描述', dataIndex: 'desc', },
    {
      title: '操作', render: (text, record) => (
        <Fragment>
          <Popconfirm placement="top" title="确定删除该模型？"
            onConfirm={() => this.handleDelete(record)}>
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => this.handleModalVisible(true, true, record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm placement="top" title={record.status === 0 ? '确定停用' : '确定启用'}
            onConfirm={() => this.handleStatus(record)}>
            <a>{record.status === 0 ? '停用' : '启用'}</a>
          </Popconfirm>
        </Fragment>
      )
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'model/fetch'
    });
    dispatch({
      type: 'datasource/fetch'
    });
  }
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
      type: 'model/fetch',
      payload: {
        params,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      }
    });
  }
  // 重置查询表单
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {}
    });
    dispatch({
      type: 'model/fetch',
      payload: {}
    });
  };

  // 查询处理
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValues) => {
      if (err) return;
      const values = {
        ...fieldsValues,
        updatedAt: fieldsValues.updatedAt && fieldsValues.updatedAt.valueOf()
      };
      this.setState({
        formValues: values
      });
      dispatch({
        type: 'model/fetch',
        payload: {
          params: values
        }
      });
    });
  };

  // 删除操作处理
  handleDelete = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'model/remove',
      payload: record.id,
      callback: () => {
        message.success('删除成功');
        // 重载数据
        this.reloadData();
      }
    });
  };
  // 模型启、停用操作
  handleStatus = (record) => {
    const { dispatch } = this.props;
    const status = record.status === 0 ? 1 : 0;
    dispatch({
      type: 'model/changeStatus',
      payload: {
        status: status,
        modelId: record.id,
      },
      callback: () => {
        message.success('操作成功');
        // 重载数据
        this.reloadData();
      }
    });
  };

  handleModalVisible = (flag, isEdit, record) => {
    const { dispatch } = this.props;
    this.setState({
      modalVisible: !!flag,
      isEditForm: !!isEdit,
      recordValue: record || {},
    });
  }

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'model/add',
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
      type: 'model/update',
      payload: fields,
      callback: () => {
        message.success('修改成功');
        this.handleModalVisible();
        // 重载数据
        this.reloadData();
      }
    });
  };

  // 重新加载数据
  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'model/fetch',
      payload: {},
    });
  };

  // 查询表单
  renderForm() {
    const { expandForm } = this.state;
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="模型名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="模型状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">使用中</Option>
                  <Option value="1">已停用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  // 主 render
  render() {
    const {
      model: { data },
      loading } = this.props;
    const { modalVisible, recordValue, isEditForm } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate
    }

    return (
      <PageHeaderWrapper
        title="模型管理"
        content='管理取数模型，设置模型规则~'
      >
        <Card bordered={false}>
          <div className={styles.peekDataManage}>
            <div className={styles.peekDataManageForm}>{this.renderForm()}</div>
            <div className={styles.peekDataManageOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
            </Button>
            </div>
            <StandardTable
              disabledSelected={true}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey={record => record.id}
            />
          </div>
        </Card>
        {modalVisible && (
          <ModelOptForm
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

export default ModelManage;
