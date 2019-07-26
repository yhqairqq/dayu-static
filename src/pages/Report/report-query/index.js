import React from 'react';
import { connect } from 'dva';
import { Form } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ReportQueryForm from './component/ReportQueryForm';

@Form.create()
@connect(({ report, loading }) => ({
  report,
  loading: loading.models.report,
}))
class ReportQuery extends React.Component {
  state = {
    reportInfo: {
      report: {},
      fields: [],
    },
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
        this.setState({
          reportInfo: data,
        });
      },
    });
  }

  formQuery = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/query',
      payload: {
        ...fields,
      },
    });
  };

  dependOnChange = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/queryLov',
      payload: {
        ...params,
      },
    });
  };

  render() {
    const { reportInfo } = this.state;
    const { report } = reportInfo;
    const { name, comment } = report;
    return (
      <PageHeaderWrapper title={name} content={comment}>
        <ReportQueryForm
          reportInfo={reportInfo}
          dependOnChange={this.dependOnChange}
          OnQueryClick={this.formQuery}
        />
      </PageHeaderWrapper>
    );
  }
}

export default ReportQuery;
