import React from 'react';
import { connect } from 'dva';
import { Form, Modal, Steps, Spin, Button, Select, Checkbox, Row, Col, Divider, Input } from 'antd';
import styles from '../../../styles/Manage.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;
const { Search } = Input;

@Form.create()
@connect(({ commonInfo, user, loading }) => ({
  commonInfo,
  user,
  userLoading: loading.models.user,
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
        userId: id,
        erpUserId: -1,
        cities: [],
        classifies: [],
      },
      currentStep: 0,
      cities: [], // 城市列表
      classifies: [], // 品类列表
      citiesOfChecked: [], // 已选城市列表
      cityIndeterminate: true,
      checkAllCity: false,
      classifyOfChecked: [], // 已选品类列表
      classifyIndeterminate: true,
      checkAllClassify: false,
      erpUsers: [],
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
        const { cities, classifies } = data;
        this.setState({
          formVals: data,
          citiesOfChecked: cities,
          cityIndeterminate: cities && cities.length > 0,
          classifyOfChecked: classifies,
          classifyIndeterminate: classifies && classifies.length > 0,
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
    const { citiesOfChecked, classifyOfChecked, formVals } = this.state;
    const { erpUserId } = formVals;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const newFormValues = { ...formVals, ...fieldsValue };
      this.setState({
        formVals: newFormValues,
      });
      handleOpt({
        userId: id,
        erpUserId,
        cities: citiesOfChecked,
        classifies: classifyOfChecked,
      });
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

  // 查询ERP用户
  searchErpUser = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchErpUserInfo',
      payload: {
        username: value,
      },
      callback: data => {
        const { rows } = data;
        this.setState({
          erpUsers: rows,
        });
      },
    });
  };

  renderUserRelStep = () => {
    const { formVals, erpUsers } = this.state;
    const { form } = this.props;
    return [
      <FormItem key="names" {...this.formLayout} label="ERP用户查询">
        <Search
          placeholder="请输入ERP用户登录名或昵称"
          enterButton="查询"
          onSearch={val => this.searchErpUser(val)}
        />
      </FormItem>,
      <FormItem key="erpUserId" {...this.formLayout} label="用户关联">
        {form.getFieldDecorator('erpUserId', {
          initialValue: formVals.erpUserId,
        })(
          <Select mode="multiple" style={{ width: '100%' }} placeholder="请关联ERP用户">
            <Option value="0">全部</Option>
            <Option value="-1">未选择</Option>
            {erpUsers.map(u => (
              <Option value={u.id}>
                {u.name}({u.loginname})
              </Option>
            ))}
          </Select>
        )}
      </FormItem>,
    ];
  };

  onChangeOfCity = checkList => {
    const { cities } = this.state;
    this.setState({
      citiesOfChecked: checkList,
      cityIndeterminate: !!checkList.length && checkList.length < cities.length,
      checkAllCity: checkList.length === cities.length,
    });
  };

  onCheckAllCityChange = e => {
    const { cities } = this.state;
    const options = [];
    cities.forEach(c => {
      const { id } = c;
      options.push(id);
    });

    this.setState({
      citiesOfChecked: e.target.checked ? options : [],
      cityIndeterminate: false,
      checkAllCity: e.target.checked,
    });
  };

  renderCityStep = () => {
    const { cities, cityIndeterminate, checkAllCity, citiesOfChecked } = this.state;
    const options = [];
    cities.forEach(c => {
      const { id, name } = c;
      options.push({
        label: name,
        value: id,
      });
    });
    return [
      <Divider key="city_div_0" type="horizontal" />,
      <Checkbox
        key="city_all_checkbox"
        indeterminate={cityIndeterminate}
        onChange={this.onCheckAllCityChange}
        checked={checkAllCity}
      >
        全选
      </Checkbox>,
      <Divider key="city_div_1" type="horizontal" />,
      <Checkbox.Group
        style={{ width: '100%', marginBottom: '10px' }}
        value={citiesOfChecked}
        onChange={this.onChangeOfCity}
      >
        <Row>
          {options.map(item => (
            <Col key={item.value} span={6}>
              <Checkbox key={item.value} value={item.value}>
                {item.label}
              </Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>,
    ];
  };

  onChangeOfClassify = checkList => {
    const { classifies } = this.state;
    this.setState({
      classifyOfChecked: checkList,
      classifyIndeterminate: !!checkList.length && checkList.length < classifies.length,
      checkAllClassify: checkList.length === classifies.length,
    });
  };

  onCheckAllClassifyChange = e => {
    const { classifies } = this.state;
    const options = [];
    classifies.forEach(c => {
      const { id } = c;
      options.push(id);
    });

    this.setState({
      classifyOfChecked: e.target.checked ? options : [],
      classifyIndeterminate: false,
      checkAllClassify: e.target.checked,
    });
  };

  renderClassifyStep = () => {
    const { classifies, classifyIndeterminate, checkAllClassify, classifyOfChecked } = this.state;
    const options = [];
    classifies.forEach(c => {
      const { id, name } = c;
      options.push({
        label: name,
        value: id,
      });
    });
    return [
      <Divider key="classify_div_0" type="horizontal" />,
      <Checkbox
        key="classify_all_checkbox"
        indeterminate={classifyIndeterminate}
        onChange={this.onCheckAllClassifyChange}
        checked={checkAllClassify}
      >
        全选
      </Checkbox>,
      <Divider key="classify_div_1" type="horizontal" />,
      <Checkbox.Group
        style={{ width: '100%', marginBottom: '10px' }}
        value={classifyOfChecked}
        onChange={this.onChangeOfClassify}
      >
        <Row>
          {options.map(item => (
            <Col span={6}>
              <Checkbox value={item.value}>{item.label}</Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>,
    ];
  };

  render() {
    const { modalVisible, handleModalVisible, commonLoading, userLoading } = this.props;
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
        <Spin spinning={commonLoading || userLoading}>
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
