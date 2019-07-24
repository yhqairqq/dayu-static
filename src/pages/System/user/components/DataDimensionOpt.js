import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Steps, Spin, Button, Checkbox } from 'antd';
import styles from '../../../styles/Manage.less';

const FormItem = Form.Item;
const { Step } = Steps;

@Form.create()
@connect(({ commonInfo, loading }) => ({
  commonInfo,
  commonLoading: loading.models.commonInfo,
}))
class DataDimensionOpt extends React.Component {
  static defaultProps = {
    values: {},
    handleOpt: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    const {
      values: { id },
    } = props;
    this.state = {
      formVals: {
        erpUserId: -1,
        userId: id,
        cities: [],
        classifies: [],
      },
      currentStep: 0,
      cities: [], // 城市列表
      classifies: [], // 品类列表
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const {
      formVals: { userId },
    } = this.state;
    dispatch({
      type: 'commonInfo/fetchByClassify',
      payload: {
        classify: 'city', // 城市列表
      },
      callback: data => {
        this.setState({
          cities: data,
        });
      },
    });
    dispatch({
      type: 'user/fetchDimensionSave',
      payload: {
        userId,
      },
      callback: data => {
        this.setState({
          formVals: data,
        });
      },
    });
    dispatch({
      type: 'commonInfo/fetchByClassify',
      payload: {
        classify: 'classify', // 品类列表
      },
      callback: data => {
        this.setState({
          classifies: data,
        });
      },
    });
  }

  handleSave = () => {
    const {
      form,
      handleOpt,
      values: { id },
    } = this.props;
    const { formVals } = this.state;
    const { fields } = formVals;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const newFormValues = { ...formVals, ...fieldsValue, fields, ...{ userId: id } };
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
          className={(currentStep !== 0).toString()}
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
          className={(currentStep !== 2).toString()}
          type="primary"
          onClick={() => this.handleNext(currentStep)}
        >
          下一步
        </Button>
        <Button
          key="save"
          className={(currentStep === 2).toString()}
          type="primary"
          onClick={() => this.handleSave()}
        >
          保存
        </Button>
      </div>
    );
  };

  renderUserRelStep = () => {
    const { formVals } = this.state;
    const { form } = this.props;
    return [
      <FormItem key="erpUserId" {...this.formLayout} label="ERP用户关联">
        {form.getFieldDecorator('erpUserId', {
          initialValue: formVals.erpUserId,
        })(
          // <Select style={{ width: '100%' }}>
          //   <Option value="全部">全部</Option>
          // </Select>
          <Input placeholder="请输入ERP用户Id" />
        )}
      </FormItem>,
    ];
  };

  renderCityStep = () => {
    const { form } = this.props;
    const { cities, formVals } = this.state;
    const options = [];
    cities.forEach(c => {
      const { id, name } = c;
      options.push({
        label: name,
        value: id,
      });
    });
    return [
      <FormItem key="cities" {...this.formLayout}>
        {form.getFieldDecorator('cities', {
          initialValue: formVals.cities,
        })(<Checkbox.Group options={options} />)}
      </FormItem>,
    ];
  };

  renderClassifyStep = () => {
    const { form } = this.props;
    const { classifies, formVals } = this.state;
    const options = [];
    classifies.forEach(c => {
      const { id, name } = c;
      options.push({
        label: name,
        value: id,
      });
    });
    return [
      <FormItem key="classifies" {...this.formLayout}>
        {form.getFieldDecorator('classifies', {
          initialValue: formVals.classifies,
        })(<Checkbox.Group options={options} />)}
      </FormItem>,
    ];
  };

  render() {
    const { modalVisible, handleModalVisible, commonLoading } = this.props;
    const { currentStep } = this.state;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={640}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title="数据维度编辑"
        visible={modalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleModalVisible(false)}
        afterClose={() => handleModalVisible()}
      >
        <Spin spinning={commonLoading}>
          <Steps style={{ marginBottom: 15 }} size="small" current={currentStep}>
            <Step title="关联ERP用户" />
            <Step title="城市维度选择" />
            <Step title="品类维度选择" />
          </Steps>
          {currentStep === 0 && this.renderUserRelStep()}
          {currentStep === 1 && this.renderCityStep()}
          {currentStep === 2 && this.renderClassifyStep()}
        </Spin>
      </Modal>
    );
  }
}

export default DataDimensionOpt;
