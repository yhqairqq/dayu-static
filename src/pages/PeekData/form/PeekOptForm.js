import React, { PureComponent, Fragment } from 'react';
import dva, { connect } from 'dva';
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
  message,
  Popconfirm,
  Badge,
  Divider,
  Steps,
  Radio,
  Table,
  Tag,
  notification,
} from 'antd';
const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;
const Search = Input.Search;

import { getRuleByPeekId } from '@/services/peek';
import RuleShow from './RuleShow';
import PreviewDataModal from './PreviewDataModal';
import _ from 'lodash';
import SelectFieldStep from './SelectFieldStep';
import SelectFilterStep from './SelectFilterStep';

@Form.create()
@connect(({ model, peek, loading }) => ({
  model,
  peek,
  loading: loading.models.peek,
}))
class PeekOptForm extends React.Component {
  static defaultProps = {
    values: {},
    isEdit: false,
    handleAdd: () => {},
    handleUpdate: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    const {
      values: { id, fields: fieldsTmp, name, modelId },
    } = props;
    let peekId = 0;
    if (id) {
      peekId = id;
    }

    // 切分返回字段
    let fields = [];
    if (fieldsTmp) {
      fields = fieldsTmp.split(',');
    }

    this.state = {
      formVals: {
        peekId,
        name: name,
        modelId: modelId,
        fields,
        rules: [],
      },
      currentStep: 0,
      // 预览相关
      previewDataModalVisable: false,
      previewData: [],
      previewColumns: [],
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { formVals } = this.state;
    // 获取模型的字段列表
    if (formVals.modelId) {
      this.handleModelChange(formVals.modelId);
    }
    if (formVals.peekId !== 0) {
      // 获取已设置规则信息
      getRuleByPeekId(formVals.peekId).then(val => {
        if (val) {
          const { state, data } = val;
          if (state === 0) {
            this.onFormValueChange('rules', data);
          }
        }
      });
    }
    dispatch({
      type: 'peek/getDataTypeRules',
      payload: {},
    });
  }

  // 模型选择变更处理
  handleModelChange = value => {
    const { dispatch } = this.props;
    console.log(value);
    // 获取模型的字段列表
    dispatch({
      type: 'model/fetchModelMeta',
      payload: value,
    });
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

  handleNext = currentStep => {
    const { form, handleUpdate, handleAdd, isEdit } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            const fields = formVals.fields || [];
            for (let rule of formVals.rules) {
              if (!rule.value || !rule.rule) {
                notification.error({
                  message: '非法的规则',
                  description: '有条件为空',
                });
                return;
              }
            }
            formVals.fields = fields.join(',');
            if (isEdit) {
              handleUpdate(formVals);
            } else {
              handleAdd(formVals);
            }
          }
        }
      );
    });
  };
  // 取消处理
  cancelHandle = () => {
    const { handleModalVisible, values, form } = this.props;
    form.resetFields();
    handleModalVisible(false, false, values);
  };

  // 统计条数
  countSizeHandle = () => {
    const { dispatch } = this.props;
    const {
      formVals: { modelId, rules },
    } = this.state;

    dispatch({
      type: 'peek/countSize',
      payload: {
        modelId,
        rules,
      },
      callback: size => {
        Modal.success({
          title: '统计数据',
          content: '根据规则查询出数据条数： ' + size,
        });
      },
    });
  };
  // 预览数据
  previewDataHandle = () => {
    const { dispatch } = this.props;
    const {
      formVals: { modelId, fields: fieldArr, rules },
    } = this.state;

    let fields = '';
    if (fieldArr) {
      fields = fieldArr.join(',');
    }
    dispatch({
      type: 'peek/previewData',
      payload: {
        modelId,
        fields,
        rules: rules,
      },
      callback: data => {
        if (data && data.rowSize > 0) {
          let columns = [];
          const { columns: oldColumns, showNameOfColumns, rows } = data;
          for (let i = 0; i < oldColumns.length; i++) {
            const tmp = oldColumns[i];
            columns.push({
              title: showNameOfColumns[tmp],
              dataIndex: tmp,
              key: tmp,
            });
          }
          this.setState({
            previewColumns: columns,
            previewData: rows,
            previewDataModalVisable: true,
          });
        }
      },
    });
  };

  handlePreviewDataModalVisable = () => {
    this.setState({
      previewDataModalVisable: false,
    });
  };

  // 底部按钮
  renderFooter = currentStep => {
    const item = [];
    if (currentStep > 0) {
      item.push(
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>
      );
    }
    if (currentStep === 2) {
      item.push(
        <div style={{ display: 'inline', marginRight: 40 }}>
          <Button key="static" onClick={() => this.countSizeHandle()}>
            统计数据
          </Button>
          <Button key="preview" onClick={() => this.previewDataHandle()}>
            预览
          </Button>
        </div>
      );
    }
    item.push(
      <Button key="cancel" onClick={() => this.cancelHandle()}>
        取消
      </Button>
    );
    item.push(
      <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
        {currentStep !== 2 ? '下一步' : '保存'}
      </Button>
    );
    return item;
  };

  onFormValueChange = (key, value) => {
    const oldVals = this.state.formVals;
    this.setState({
      formVals: {
        ...oldVals,
        [key]: value,
      },
    });
    if (key === 'modelId') {
      this.handleModelChange(value);
    }
  };

  renderContent = (currentStep, formVals) => {
    const {
      form,
      model: { allModels, modelMetas },
      peek: { rules: oldRules, dataTypeRules },
    } = this.props;

    const groupFieldMap = _.groupBy(modelMetas, 'groupName');
    const groups = ['全部', ..._.keys(groupFieldMap)];
    const { fields, rules } = formVals;
    if (currentStep === 1) {
      return (
        <SelectFieldStep
          selectedFields={fields}
          formLayout={this.formLayout}
          groups={groups}
          modelMetas={modelMetas}
          onFormValueChange={this.onFormValueChange}
        />
      );
    } else if (currentStep === 2) {
      return (
        <SelectFilterStep
          groups={groups}
          onFormValueChange={this.onFormValueChange}
          modelMetas={modelMetas}
          rules={rules}
          dataTypeRules={dataTypeRules}
        />
      );
    }
    return (
      <BasicInfoStep
        form={form}
        formLayout={this.formLayout}
        allModels={allModels}
        onFormValueChange={this.onFormValueChange}
        {...formVals}
      />
    );
  };

  render() {
    const { isEdit, modalVisible, handleModalVisible, values } = this.props;
    const {
      currentStep,
      formVals,
      previewData,
      previewColumns,
      previewDataModalVisable,
    } = this.state;

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={940}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={isEdit ? '修改模型' : '新增模型'}
        visible={true}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleModalVisible(false, false, values)}
        afterClose={() => handleModalVisible()}
      >
        <Steps style={{ marginBottom: 15 }} size="small" current={currentStep}>
          <Step title="基本信息设置" />
          <Step title="选择返回字段" />
          <Step title="设置筛选条件" />
        </Steps>
        {this.renderContent(currentStep, formVals)}
        <PreviewDataModal
          data={previewData}
          modalVisible={previewDataModalVisable}
          handleModalVisible={() => this.handlePreviewDataModalVisable()}
          columns={previewColumns}
        />
      </Modal>
    );
  }
}

class BasicInfoStep extends React.Component {
  render() {
    const { form, allModels, name, modelId, formLayout, peekId, onFormValueChange } = this.props;
    return (
      <div className="peekOptForm-basicInfoStep">
        <FormItem key="name" {...formLayout} label="取数名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入模型名称！' }],
            initialValue: name,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        ,
        <FormItem key="modelId" {...formLayout} label="选择模型">
          {form.getFieldDecorator('modelId', {
            rules: [{ required: true, message: '选择模型' }],
            initialValue: modelId,
          })(
            <Select
              placeholder="选择模型"
              style={{ width: '100%' }}
              disabled={peekId !== 0}
              onChange={value => onFormValueChange('modelId', value)}
            >
              {allModels.map((item, index) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      </div>
    );
  }
}

export default PeekOptForm;
