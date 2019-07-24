import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Modal, Table, Button, Divider, Popconfirm, Tag } from 'antd';

import QueryFieldOptForm from './QueryFieldOptForm';

@Form.create()
@connect(({ group, report, loading }) => ({
  group,
  report,
  loading: loading.models.group,
}))
class QueryFieldForm extends React.Component {
  static defaultProps = {
    reportId: 0,
    handleOpt: () => {},
    handleModalVisible: () => {},
  };

  columns = [
    { title: '显示名', dataIndex: 'showName', width: 100 },
    { title: '参数名', dataIndex: 'queryName', width: 100 },
    { title: '数据类型', dataIndex: 'dataType' },
    {
      title: '必填',
      dataIndex: 'mustFillIn',
      width: 60,
      render: text => <span>{text === 1 ? '是' : '否'}</span>,
    },
    {
      title: '参数类型',
      dataIndex: 'type',
      render: text => <span>{this.tagOfTypes(text)}</span>,
    },
    { title: '默认值', dataIndex: 'valDefault' },
    { title: '级联依赖', dataIndex: 'dependOn' },
    {
      title: '操作',
      dataIndex: 'option',
      width: 120,
      render: (text, record, index) => (
        <Fragment>
          <Popconfirm
            placement="top"
            title="确实删除该查询参数？"
            onConfirm={() => this.handleFieldDelete(index)}
          >
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => this.handleDetailModalVisible(true, record, true, index)}>编辑</a>
        </Fragment>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      deltailModalVisible: false,
      editIndex: -1,
      isEditForm: false,
      recordValue: {},
      queryFields: [],
      fieldTypeMap: {},
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const { dispatch, reportId } = this.props;
    dispatch({
      type: 'report/queryFields',
      payload: {
        reportId,
      },
      callback: data => {
        this.setState({
          queryFields: data,
        });
      },
    });
    dispatch({
      type: 'report/fetchTypes',
    });
    dispatch({
      type: 'report/fetchFieldTypes',
      callback: data => {
        const fieldTypeMap = {};
        data.forEach(el => {
          fieldTypeMap[el.left] = el.right;
        });
        this.setState({
          fieldTypeMap,
        });
      },
    });
  }

  tagOfTypes = value => {
    const { fieldTypeMap } = this.state;
    const {
      report: { fieldTypes },
    } = this.props;
    const tags = [];
    fieldTypes.forEach(f => {
      const tmp = value & f.left; // eslint-disable-line no-bitwise
      if (tmp === f.left) {
        tags.push(f.left);
      }
    });
    return tags.map(t => (
      <Tag color="blue" key={t}>
        {fieldTypeMap[t]}
      </Tag>
    ));
  };

  okHandle = () => {
    const { handleOpt, reportId } = this.props;
    const { queryFields } = this.state;
    handleOpt({
      reportId,
      queryFields,
    });
  };

  // 查询参数详情页面
  handleDetailModalVisible = (flag, record, isEdit, index) => {
    this.setState({
      deltailModalVisible: !!flag,
      isEditForm: !!isEdit,
      editIndex: index,
      recordValue: record || {},
    });
  };

  // 查询参数删除
  handleFieldDelete = index => {
    const { queryFields } = this.state;
    queryFields.splice(index, 1);
    this.setState({
      queryFields,
    });
  };

  // 查询参数添加
  handleFieldAdd = fields => {
    const { queryFields } = this.state;
    queryFields.push(fields);
    this.setState({
      queryFields,
    });
    this.handleDetailModalVisible();
  };

  // 查询参数更新
  handleFieldUpdate = fields => {
    this.handleDetailModalVisible();
    const { queryFields, editIndex } = this.state;
    queryFields.splice(editIndex, 1, fields);
    this.setState({
      queryFields,
    });
  };

  render() {
    const { isEditForm, recordValue, deltailModalVisible, queryFields } = this.state;
    const { modalVisible, handleModalVisible, reportId } = this.props;

    const parentMethods = {
      handleAdd: this.handleFieldAdd,
      handleModalVisible: this.handleDetailModalVisible,
      handleUpdate: this.handleFieldUpdate,
    };
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={1000}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title="查询参数"
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        onOk={this.okHandle}
      >
        <Button
          icon="plus"
          type="primary"
          onClick={() => this.handleDetailModalVisible(true, {}, false)}
        >
          新建
        </Button>
        <Table
          size="small"
          columns={this.columns}
          dataSource={queryFields}
          pagination={false}
          rowKey={record => record.queryName}
        />
        {deltailModalVisible && (
          <QueryFieldOptForm
            {...parentMethods}
            isEdit={isEditForm}
            values={recordValue}
            reportId={reportId}
            dependOnFields={queryFields}
            modalVisible={deltailModalVisible}
          />
        )}
      </Modal>
    );
  }
}

export default QueryFieldForm;
