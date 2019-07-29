import React from 'react';
import { connect } from 'dva';
import { Card, Form, Table } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ReportQueryForm from './component/ReportQueryForm';
import { splitType, includeTable } from './utils/report-type';

@Form.create()
@connect(({ report, loading }) => ({
  report,
  loading: loading.models.report,
}))
class ReportQuery extends React.Component {
  state = {
    report: {},
    fields: [],
    hasTable: false, // 是否有表格
    // graph: [], // 显示图形类型
    dataSource: [],
    columns: [],
  };

  componentDidMount() {
    const {
      match: { params },
      dispatch,
    } = this.props;
    const { reportId } = params;
    dispatch({
      type: 'report/fetchDetail',
      payload: {
        reportId,
      },
      callback: data => {
        const { report, fields } = data;
        const { type } = report; // 报表展示类型
        const graph = splitType(type);
        const hasTable = includeTable(graph);
        this.setState({
          fields,
          report,
          // graph,
          hasTable,
        });
      },
    });
  }

  // 数据查询操作
  formQuery = fields => {
    const {
      report: { code },
    } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'report/queryData',
      payload: {
        reportCode: code,
        ...fields,
      },
      callback: data => {
        this.handlerData(data);
      },
    });
  };

  // 处理查询数据
  handlerData = data => {
    const { columns, rows } = data;
    const { hasTable } = this.state;
    // 对表格数据进行处理
    if (hasTable) {
      const arr = [];
      if (columns) {
        columns.forEach(c => {
          arr.push({
            title: c.showName,
            dataIndex: c.name,
          });
        });
      }
      this.setState({
        dataSource: rows,
        columns: arr,
      });
    }
  };

  // 表单级联查询操作
  dependOnChange = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/queryLov',
      payload: {
        ...params,
      },
    });
  };

  // 获取表格行Key
  getRowKey = (record, index) => {
    return `${record[0]}_${index}`;
  };

  render() {
    const { fields, report, hasTable, dataSource, columns } = this.state;
    const { name, comment, queryFieldLabelLen, queryFieldMediaLen } = report;
    return (
      <PageHeaderWrapper title={name} content={comment}>
        <Card bordered={false}>
          <ReportQueryForm
            items={fields}
            labelSpan={queryFieldLabelLen}
            mediaSpan={queryFieldMediaLen}
            dependOnChange={this.dependOnChange}
            onQueryClick={this.formQuery}
          />
        </Card>
        <Card bordered={false} style={{ marginTop: '15px' }}>
          {hasTable && (
            <Table size="small" dataSource={dataSource} rowKey={this.getRowKey} columns={columns} />
          )}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ReportQuery;
