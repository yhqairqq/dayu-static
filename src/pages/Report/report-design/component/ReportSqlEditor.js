import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Select, Radio, Steps, Spin, Button, InputNumber } from 'antd';
import styles from '../index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;

@Form.create()
@connect(({ datasource, report, loading }) => ({
  datasource,
  report,
  dsLoading: loading.models.datasource,
  reportLoading: loading.models.report,
}))
class ReportSqlEditor extends React.Component {
  static defaultProps = {
    values: {},
    handleOpt: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    const {
      values: { id, detailSqlId },
    } = props;
    this.state = {
      formVals: {
        reportId: id,
        sqlId: detailSqlId,
        cached: 0,
        cachedTime: 5,
        timeout: 10,
        needDetailLog: 0,
      },
      currentStep: 0,
      isCache: false,
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { formVals } = this.state;
    const { sqlId } = formVals;
    dispatch({
      type: 'datasource/fetchAll',
    });
    if (sqlId) {
      dispatch({
        type: 'report/sqlInfo',
        payload: sqlId,
        callback: data => {
          const newFormVals = { ...formVals, ...data };
          this.setState({
            formVals: newFormVals,
          });
        },
      });
    }
  }

  onChange = e => {
    this.setState({
      isCache: e.target.value === 1,
    });
  };

  handleSave = () => {
    const { form, handleOpt } = this.props;
    const { formVals } = this.state;
    const { fields } = formVals;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const newFormValues = { ...formVals, ...fieldsValue, fields };
      this.setState({
        formVals: newFormValues,
      });
      handleOpt(newFormValues);
    });
  };

  // 取消处理
  cancelHandle = () => {
    const { handleModalVisible, values, form } = this.props;
    form.resetFields();
    handleModalVisible(false, false, values);
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  handleNext = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { formVals } = this.state;
      this.setState({
        formVals: {
          ...formVals,
          ...fieldsValue,
        },
      });
      this.forward();
    });
  };

  // 底部按钮
  renderFooter = currentStep => {
    return (
      <div className={styles.modelOptFormFooter}>
        <Button
          key="back"
          className={(currentStep === 1).toString()}
          style={{ float: 'left' }}
          onClick={this.backward}
        >
          上一步
        </Button>
        <Button key="cancel" className="true" onClick={() => this.cancelHandle()}>
          取消
        </Button>
        <Button
          key="forward"
          className={(currentStep === 0).toString()}
          type="primary"
          onClick={() => this.handleNext(currentStep)}
        >
          下一步
        </Button>
        <Button
          key="save"
          className={(currentStep === 1).toString()}
          type="primary"
          onClick={() => this.handleSave()}
        >
          保存
        </Button>
      </div>
    );
  };

  renderCommonStep = () => {
    const {
      form,
      datasource: { simpleDatasources },
    } = this.props;
    const { formVals, isCache } = this.state;
    return [
      <FormItem key="dsId" {...this.formLayout} label="数据源">
        {form.getFieldDecorator('dsId', {
          rules: [{ required: true, message: '请选择数据源' }],
          initialValue: formVals.dsId,
        })(
          <Select placeholder="请选择数据源" style={{ width: '100%' }}>
            {simpleDatasources.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>,
      <FormItem key="cached" {...this.formLayout} label="是否缓存">
        {form.getFieldDecorator('cached', {
          initialValue: formVals.cached,
        })(
          <Radio.Group onChange={this.onChange}>
            <Radio.Button value={0}>否</Radio.Button>
            <Radio.Button value={1}>是</Radio.Button>
          </Radio.Group>
        )}
      </FormItem>,
      <FormItem key="cachedTime" {...this.formLayout} label="缓存时间(秒)">
        {form.getFieldDecorator('cachedTime', {
          rules: [{ required: isCache, message: '请输入缓存时间' }],
          initialValue: formVals.cachedTime,
        })(<InputNumber style={{ width: '50%' }} min={0} max={3600} />)}
      </FormItem>,
      <FormItem key="timeout" {...this.formLayout} label="超时时间(秒)">
        {form.getFieldDecorator('timeout', {
          rules: [{ required: true, message: '请输入超时时间' }],
          initialValue: formVals.timeout,
        })(<InputNumber style={{ width: '50%' }} min={0} max={360} />)}
      </FormItem>,
      <FormItem key="needDetailLog" {...this.formLayout} label="是否记录日志">
        {form.getFieldDecorator('needDetailLog', {
          initialValue: formVals.needDetailLog,
        })(
          <Radio.Group>
            <Radio.Button value={0}>否</Radio.Button>
            <Radio.Button value={1}>是</Radio.Button>
          </Radio.Group>
        )}
      </FormItem>,
      <FormItem key="comment" {...this.formLayout} label="描述信息">
        {form.getFieldDecorator('comment', {
          initialValue: formVals.comment,
        })(<TextArea rows={4} placeholder="请输入" />)}
      </FormItem>,
    ];
  };

  renderSqlStep = () => {
    const { form } = this.props;
    const { formVals } = this.state;
    return [
      <FormItem key="text" label="SQL">
        {form.getFieldDecorator('text', {
          initialValue: formVals.text,
        })(<TextArea rows={24} placeholder="请输入" />)}
      </FormItem>,
    ];
  };

  render() {
    const { modalVisible, handleModalVisible, reportLoading, dsLoading } = this.props;
    const { currentStep } = this.state;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={640}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title="SQL编辑器"
        visible={modalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleModalVisible(false)}
        afterClose={() => handleModalVisible()}
      >
        <Spin spinning={dsLoading || reportLoading}>
          <Steps style={{ marginBottom: 15 }} size="small" current={currentStep}>
            <Step title="基础信息" />
            <Step title="SQL编辑" />
          </Steps>
          {currentStep === 0 && this.renderCommonStep()}
          {currentStep === 1 && this.renderSqlStep()}
        </Spin>
      </Modal>
    );
  }
}

export default ReportSqlEditor;
