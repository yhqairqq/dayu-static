import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Modal, Table, Button, Divider, Popconfirm } from 'antd';

import ReportColumnOptForm from './ReportColumnOptForm';

@Form.create()
@connect(({ group, report, loading }) => ({
  group,
  report,
  loading: loading.models.group,
}))
class ReportColumnForm extends React.Component {
  static defaultProps = {
    reportId: 0,
    handleOpt: () => {},
    handleModalVisible: () => {},
  };

  columns = [
    { title: '显示名', dataIndex: 'showName', width: 100 },
    { title: '列名', dataIndex: 'name', width: 100 },
    { title: '数据类型', dataIndex: 'dataType' },
    {
      title: '原生列',
      dataIndex: 'raw',
      width: 60,
      render: text => <span>{text === 1 ? '是' : '否'}</span>,
    },
    {
      title: '隐藏',
      dataIndex: 'hidden',
      width: 60,
      render: text => <span>{text === 1 ? '是' : '否'}</span>,
    },
    {
      title: '冻结列',
      dataIndex: 'frozen',
      width: 60,
      render: text => <span>{text === 1 ? '是' : '否'}</span>,
    },
    {
      title: '下钻',
      dataIndex: 'drill',
      width: 60,
      render: text => <span>{text === 1 ? '是' : '否'}</span>,
    },
    {
      title: '分裂',
      dataIndex: 'split',
      width: 60,
      render: text => <span>{text === 1 ? '是' : '否'}</span>,
    },
    { title: '单位', dataIndex: 'unit' },
    { title: '格式化宏', dataIndex: 'formatMacro' },
    { title: '切分字符', dataIndex: 'splitChar' },
    { title: 'KV分隔符', dataIndex: 'splitKvChar' },
    {
      title: '操作',
      dataIndex: 'option',
      width: 120,
      render: (text, record, index) => (
        <Fragment>
          <Popconfirm
            placement="top"
            title="确实删除该查询参数？"
            onConfirm={() => this.handleDelete(index)}
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
      reportColumns: [],
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const { dispatch, reportId } = this.props;
    dispatch({
      type: 'report/reportColumns',
      payload: {
        reportId,
      },
      callback: data => {
        this.setState({
          reportColumns: data,
        });
      },
    });
    dispatch({
      type: 'report/fetchTypes',
    });
  }

  okHandle = () => {
    const { handleOpt, reportId } = this.props;
    const { reportColumns } = this.state;
    handleOpt({
      reportId,
      reportColumns,
    });
  };

  // 表格字段详情页面
  handleDetailModalVisible = (flag, record, isEdit, index) => {
    this.setState({
      deltailModalVisible: !!flag,
      isEditForm: !!isEdit,
      editIndex: index,
      recordValue: record || {},
    });
  };

  // 表格字段配置删除
  handleDelete = index => {
    const { reportColumns } = this.state;
    reportColumns.splice(index, 1);
    this.setState({
      reportColumns,
    });
  };

  // 表格字段添加
  handleAdd = fields => {
    const { reportColumns } = this.state;
    reportColumns.push(fields);
    this.setState({
      reportColumns,
    });
    this.handleDetailModalVisible();
  };

  // 表格字段更新
  handleUpdate = fields => {
    this.handleDetailModalVisible();
    const { reportColumns, editIndex } = this.state;
    reportColumns.splice(editIndex, 1, fields);
    this.setState({
      reportColumns,
    });
  };

  render() {
    const { isEditForm, recordValue, deltailModalVisible, reportColumns } = this.state;
    const { modalVisible, handleModalVisible, reportId } = this.props;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleDetailModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={1000}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title="报表字段管理"
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        onOk={this.okHandle}
      >
        <Button
          icon="plus"
          type="primary"
          onClick={() =>
            this.handleDetailModalVisible(
              true,
              {
                raw: 1,
                split: 0,
                frozen: 0,
                hidden: 0,
                drill: 0,
                supportSort: 0,
              },
              false
            )
          }
        >
          新建
        </Button>
        <Table
          size="small"
          columns={this.columns}
          dataSource={reportColumns}
          rowKey={record => record.queryName}
        />
        {deltailModalVisible && (
          <ReportColumnOptForm
            {...parentMethods}
            isEdit={isEditForm}
            values={recordValue}
            reportId={reportId}
            reportColumns={reportColumns}
            modalVisible={deltailModalVisible}
          />
        )}
      </Modal>
    );
  }
}

export default ReportColumnForm;
