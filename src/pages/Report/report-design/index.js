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
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ReportOptForm from './component/ReportOptForm';
import ReportSqlEditor from './component/ReportSqlEditor';
import QueryFieldForm from './component/QueryFieldForm';

import styles from '../../styles/Manage.less';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ group, report, user, loading }) => ({
  group,
  report,
  user,
  loading: loading.models.report,
}))
class ReportDesign extends React.Component {
  state = {
    fieldModalVisible: false,
    sqlModalVisible: false,
    modalVisible: false,
    expandForm: false,
    isEditForm: false,
    recordValue: {},
    formValues: {},
    reportTypes: {},
  };

  // 表格字段
  columns = [
    {
      title: '所属报表组',
      dataIndex: 'groupNames',
      render: text => (
        <span>
          {text.map(t => (
            <Tag color="blue" key={t}>
              {t}
            </Tag>
          ))}
        </span>
      ),
    },
    { title: '报表名称', dataIndex: 'name' },
    { title: '编码', dataIndex: 'code' },
    {
      title: '类型',
      dataIndex: 'type',
      render: text => <span>{this.tagOfTypes(text)}</span>,
    },
    { title: '描述', dataIndex: 'comment' },
    { title: '创建人', dataIndex: 'creator' },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'option',
      render: (text, record) => (
        <Fragment>
          <Popconfirm
            placement="top"
            title="确实删除该分组？"
            onConfirm={() => this.handleDelete(record)}
          >
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => this.handleModalVisible(true, record, true)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleQueryFieldModalVisible(true, record)}>查询参数</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleSqlModalVisible(true, record)}>SQL</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleModalVisible(true, record, true)}>表字段信息</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/fetch',
    });
    dispatch({
      type: 'group/getGroupTree',
    });
    // 获取所有用户
    dispatch({
      type: 'user/fetch',
    });
    // 获取所有报表类型
    dispatch({
      type: 'report/fetchTypes',
      callback: data => {
        const map = {};
        data.forEach(d => {
          const { key, title } = d;
          map[key] = title;
        });
        this.setState({
          reportTypes: map,
        });
      },
    });
  }

  // 分解tag值
  tagOfTypes = txt => {
    const { reportTypes } = this.state;
    const tags = txt.split(',');
    return tags.map(t => (
      <Tag color="blue" key={t}>
        {reportTypes[t]}
      </Tag>
    ));
  };

  // 删除操作处理
  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/remove',
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
      type: 'report/fetch',
      payload: {},
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
        type: 'report/fetch',
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
      type: 'report/fetch',
      payload: {
        params,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'report/fetch',
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

  // sql编辑器
  handleSqlModalVisible = (flag, record) => {
    this.setState({
      sqlModalVisible: !!flag,
      recordValue: record || {},
    });
  };

  // 查询字段编辑
  handleQueryFieldModalVisible = (flag, record) => {
    this.setState({
      fieldModalVisible: !!flag,
      recordValue: record || {},
    });
  };

  // 保存sql信息
  saveSqlInfo = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/sqlSave',
      payload: fields,
      callback: () => {
        message.success('SQL保存成功');
        this.handleSqlModalVisible();
        // 重载数据
        this.reloadData();
      },
    });
  };

  // 保存查询参数信息
  saveQueryFieldInfo = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/queryFieldsSave',
      payload: fields,
      callback: () => {
        message.success('查询参数保存成功');
        this.handleQueryFieldModalVisible();
        // 重载数据
        this.reloadData();
      },
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/add',
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
      type: 'report/update',
      payload: fields,
      callback: () => {
        message.success('修改成功');
        this.handleModalVisible();
        // 重载数据
        this.reloadData();
      },
    });
  };

  // 查询表单
  renderForm() {
    const {
      form: { getFieldDecorator },
      group: { trees },
      user: { list },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem key="groupId" label="所属报表组">
              {getFieldDecorator('groupId')(
                <TreeSelect
                  style={{ width: 300 }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={trees}
                  treeDefaultExpandAll
                  placeholder="请选择报表组"
                />
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
          <Col md={8} sm={24}>
            <FormItem key="name" label="报表名称">
              {getFieldDecorator('name')(<Input placeholder="请输入名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="code" label="报表编码">
              {getFieldDecorator('code')(<Input placeholder="请输入编码" />)}
            </FormItem>
          </Col>
        </Row>
        <Divider type="horizontal" />
      </Form>
    );
  }

  render() {
    const {
      loading,
      report: { data },
    } = this.props;
    const {
      modalVisible,
      sqlModalVisible,
      fieldModalVisible,
      expandForm,
      recordValue,
      isEditForm,
    } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="报表设计管理" content="对报表进行设计、管理操作~">
        <Card bordered={false}>
          <div className={styles.Manage}>
            {expandForm && <div className={styles.ManageForm}>{this.renderForm()}</div>}
            <div className={styles.ManageOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleModalVisible(true, {}, false)}
              >
                新建
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
          <ReportOptForm
            {...parentMethods}
            isEdit={isEditForm}
            values={recordValue}
            modalVisible={modalVisible}
          />
        )}
        {sqlModalVisible && (
          <ReportSqlEditor
            handleOpt={this.saveSqlInfo}
            handleModalVisible={this.handleSqlModalVisible}
            values={recordValue}
            modalVisible={sqlModalVisible}
          />
        )}
        {fieldModalVisible && (
          <QueryFieldForm
            handleOpt={this.saveQueryFieldInfo}
            handleModalVisible={this.handleQueryFieldModalVisible}
            reportId={recordValue.id}
            modalVisible={fieldModalVisible}
          />
        )}
      </PageHeaderWrapper>
    );
  }
}

export default ReportDesign;
