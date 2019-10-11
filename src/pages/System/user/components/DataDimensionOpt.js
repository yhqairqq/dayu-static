import React from 'react';
import { connect } from 'dva';
import { Form, Modal, Steps, Spin, Button, Select, Input } from 'antd';
import _ from 'lodash';
import styles from '../../../styles/Manage.less';
import SelectDimensionStep from './SelectDimensionStep';

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
      userId: id,
      erpUserId: '-1',
      currentStep: 0,
      erpUsers: [],
      warehouseList: [],
      selectedWarehouseList: [],
      storeList: [],
      selectedStoreList: [],
      classifyList: [],
      selectedClassifyList: [],
      cityList: [],
      selectedCityList: [],
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    this.fetchCommonInfo('city', 'cityList');
    this.fetchCommonInfo('classify', 'classifyList');
    const { userId } = this.state;
    this.dispatchEvent('user/fetchDimensionSave', { userId }, data => {
      const { cities, classifies, warehouses, stores, erpUserId } = data;
      this.setState({
        erpUserId,
        selectedCityList: cities,
        selectedClassifyList: classifies,
        selectedWarehouseList: warehouses,
        selectedStoreList: stores,
      });
      if (cities.length > 0) {
        this.onCityChangeEvent(cities, warehouses, stores);
      }
    });
  }

  fetchCommonInfo = (classify, field) => {
    this.dispatchEvent('commonInfo/fetchByClassify', { classify }, data => {
      this.setState({
        [field]: data,
      });
    });
  };

  handleSave = () => {
    const { form, handleOpt } = this.props;
    const {
      selectedCityList,
      selectedClassifyList,
      selectedWarehouseList,
      selectedStoreList,
      userId,
      erpUserId,
    } = this.state;
    form.validateFields(err => {
      if (err) return;
      handleOpt({
        userId,
        erpUserId,
        cities: selectedCityList,
        classifies: selectedClassifyList,
        warehouses: selectedWarehouseList,
        stores: selectedStoreList,
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
    form.validateFields(err => {
      if (err) return;
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
          className={(currentStep !== 4).toString()}
          type="primary"
          onClick={() => this.handleNext(currentStep)}
        >
          下一步
        </Button>
        <Button
          key="save"
          className={(currentStep === 4).toString()}
          type="primary"
          onClick={() => this.handleSave()}
        >
          保存
        </Button>
      </div>
    );
  };

  onErpUserChangeEvent = value => {
    this.onStateValueChange('erpUserId')(value);
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
    const { erpUserId, erpUsers } = this.state;
    return [
      <FormItem key="names" {...this.formLayout} label="ERP用户查询">
        <Search
          placeholder="请输入ERP用户登录名或昵称"
          enterButton="查询"
          onSearch={val => this.searchErpUser(val)}
        />
      </FormItem>,
      <FormItem key="erpUserId" {...this.formLayout} label="用户关联">
        <Select
          mode="multiple"
          value={erpUserId}
          style={{ width: '100%' }}
          placeholder="请关联ERP用户"
          onChange={this.onErpUserChangeEvent}
        >
          <Option value="0">全部</Option>
          <Option value="-1">未选择</Option>
          {erpUsers.map(u => (
            <Option value={u.id}>
              {u.name}({u.loginname})
            </Option>
          ))}
        </Select>
      </FormItem>,
    ];
  };

  onCityChangeEvent = (checkList, selectedWarehouseList = [], selectedStoreList = []) => {
    const callback = values => {
      this.setState({
        selectedCityList: checkList,
        warehouseList: [],
        selectedWarehouseList,
        storeList: [],
        selectedStoreList,
        ...values,
      });
    };
    if (checkList.length === 0) {
      callback();
    } else {
      const { cityList } = this.state;
      const allCityObj = cityList.find(item => item.code === '-1');
      const hasAllCityId = checkList.some(id => id === allCityObj.id);

      this.dispatchEvent(
        'commonInfo/fetchNoPagination',
        {
          parentClassifyList: hasAllCityId ? null : checkList,
        },
        data => {
          const dataMap = _.groupBy(data, 'classify');
          callback({
            warehouseList: dataMap.warehouse || [],
            storeList: dataMap.store || [],
          });
        }
      );
    }
  };

  dispatchEvent = (type, params, callback = () => {}) => {
    const { dispatch } = this.props;
    dispatch({ type, payload: params, callback });
  };

  onStateValueChange = field => value => {
    this.setState({
      [field]: value,
    });
  };

  renderCityStep = () => {
    const { cityList, selectedCityList } = this.state;
    const params = {
      dataList: cityList,
      selectedDataList: selectedCityList,
      onParentStateValueChange: this.onCityChangeEvent,
      emptyMessage: '没有城市维度数据',
    };
    return <SelectDimensionStep {...params} />;
  };

  renderClassifyStep = () => {
    const { classifyList, selectedClassifyList } = this.state;
    const params = {
      dataList: classifyList,
      selectedDataList: selectedClassifyList,
      onParentStateValueChange: this.onStateValueChange('selectedClassifyList'),
      emptyMessage: '没有品类维度数据',
    };
    return <SelectDimensionStep {...params} />;
  };

  renderWarehouseStep = () => {
    const { warehouseList, selectedWarehouseList } = this.state;

    const params = {
      dataList: warehouseList,
      selectedDataList: selectedWarehouseList,
      onParentStateValueChange: this.onStateValueChange('selectedWarehouseList'),
      emptyMessage: '选择的城市下没有仓库数据',
    };
    return <SelectDimensionStep {...params} />;
  };

  renderStoreStep = () => {
    const { storeList, selectedStoreList } = this.state;
    const params = {
      dataList: storeList,
      selectedDataList: selectedStoreList,
      onParentStateValueChange: this.onStateValueChange('selectedStoreList'),
      emptyMessage: '选择的城市下没有门店数据',
    };
    return <SelectDimensionStep {...params} />;
  };

  render() {
    const { modalVisible, handleModalVisible, commonLoading, userLoading } = this.props;
    const { currentStep } = this.state;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={800}
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
            <Step title="城市选择" />
            <Step title="仓库选择" />
            <Step title="门店选择" />
            <Step title="品类选择" />
          </Steps>
          {currentStep === 0 && this.renderUserRelStep()}
          {currentStep === 1 && this.renderCityStep()}
          {currentStep === 2 && this.renderWarehouseStep()}
          {currentStep === 3 && this.renderStoreStep()}
          {currentStep === 4 && this.renderClassifyStep()}
        </Spin>
      </Modal>
    );
  }
}

export default DataDimensionOpt;
