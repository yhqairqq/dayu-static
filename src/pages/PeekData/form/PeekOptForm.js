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



import RuleShow from './RuleShow';

const RULES = {
  String: [
    { label: '等于', value: 'equals' },
    { label: '等于(不分别大小写)', value: 'equalsIgnoreCase' },
    { label: '包含', value: 'includes' },
    { label: '不包含', value: 'notIncludes' },
    { label: '以字符开始', value: 'startWith' },
    { label: '以字符结束', value: 'endWith' },
  ],
  Integer: [
    { label: '等于', value: 'equals' },
    { label: '不等于', value: 'notEquals' },
    { label: '大于', value: 'gt' },
    { label: '大于等于', value: 'gte' },
    { label: '小于', value: 'lt' },
    { label: '小于等于', value: 'lte' },
  ],
  Date: [
    { label: '等于', value: 'equals' },
    { label: '大于', value: 'gt' },
    { label: '大于等于', value: 'gte' },
    { label: '小于', value: 'lt' },
    { label: '小于等于', value: 'lte' },
  ],
  Other: [
    { label: '等于', value: 'equals' },
    { label: '不等于', value: 'notEquals' },
  ]
}

@Form.create()
@connect(({ model, loading }) => ({
  model,
  loading: loading.models.model,
}))
class PeekOptForm extends React.Component {
  static defaultProps = {
    values: {},
    isEdit: false,
    handleAdd: () => { },
    handleUpdate: () => { },
    handleModalVisible: () => { }
  }

  constructor(props) {
    super(props);
    const { values } = props;
    this.state = {
      formVals: {
        name: values.name,
        modelId: values.modelId
      },
      selectedMeta: {},
      curRules: [],
      selectedRule: {},
      userSetRules: [],
      currentStep: 0,
      needFileds: [],
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  };

  componentDidMount() {
    const { dispatch } = this.props;
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
    const { formVals: oldValue, userSetRules } = this.state;
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
            formVals.rules = userSetRules;
            const fields = formVals.fields;
            const fieldNames = [];
            if (fields) {
              fields.map((field) => {
                fieldNames.push(field.key);
              })
            }
            formVals.fields = fieldNames.join(',');
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
  }
  
  // 统计条数
  countSizeHandle = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'peek/countSize',
      payload: value
    }, () => {
      console.log('--countSize success')
    })
  }
  // 预览数据
  previewDataHandle = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'peek/previewData',
      payload: value
    }, () => {
      console.log('--previewData success')
    })
  }

  // 模型选择变更处理
  handleModelChange = (value) => {
    const { dispatch } = this.props;

    // 获取模型的字段列表
    dispatch({
      type: 'model/fetchModelMeta',
      payload: value
    })
  }

  // 处理字符筛选变更
  handleMetaChange = (index) => {
    const {
      model: { modelMetas }
    } = this.props;
    let value = {};
    if (index > -1 && index < modelMetas.length) {
      value = modelMetas[index];
    }
    const dataType = value.dataType;
    if (RULES.hasOwnProperty(dataType)) {
      this.setState({
        selectedMeta: value,
        curRules: RULES[dataType]
      })
    } else {
      this.setState({
        selectedMeta: value,
        curRules: RULES.Other
      })
    }
  }

  needFieldChange = (value) => {
    this.setState({
      needFileds: value
    })
  }

  handleRuleChange = (index) => {
    const { curRules } = this.state;
    if (index > -1 && index < curRules.length) {
      this.setState({
        selectedRule: curRules[index]
      })
    }
  }

  handleAddRule = (value) => {
    const { userSetRules, selectedRule, selectedMeta } = this.state;

    let isHave = false;
    let isNull = false;
    let errortext = '';
    let msg = '';
    if (!selectedRule.label || !selectedMeta.id || !value) {
      isNull = true;
      msg = '非法的规则';
      errortext = '有条件为空';
    }
    if (!isNull) {
      for (let i = 0; i < userSetRules.length; i++) {
        const tmp = userSetRules[i];
        if (tmp.metaId === selectedMeta.id &&
          tmp.rule === selectedRule.value) {
          isHave = true;
          errortext = `${tmp.showName}  ${tmp.ruleLabel}  ${tmp.value}`;
          msg = '规则已存在';
          break;
        }
      }
    }
    if (!isHave && !isNull) {
      userSetRules.push({
        metaId: selectedMeta.id,
        name: selectedMeta.name,
        showName: selectedMeta.showName,
        ruleLabel: selectedRule.label,
        rule: selectedRule.value,
        value: value
      })
      this.setState({
        userSetRules
      })
    } else {
      notification.error({
        message: msg,
        description: errortext,
      });
    }
  }

  handleDelRule = (index) => {
    const { userSetRules } = this.state;
    if (index > -1 && index < userSetRules.length) {
      userSetRules.splice(index, 1)
    }

    this.setState({
      userSetRules
    })
  }

  // 底部按钮
  renderFooter = currentStep => {
    const item = [];
    if (currentStep > 0) {
      item.push(
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>
      )
    }
    if (currentStep === 2) {
      item.push(
        <div style={{ display: 'inline', marginRight: 40 }}>
          <Button key="static" onClick={() => this.countSizeHandle()}>
            统计条数
          </Button>
          <Button key="preview" onClick={() => this.previewDataHandle()}>
            预览
          </Button>
        </div>
      )
    }
    item.push(
      <Button key="cancel" onClick={() => this.cancelHandle()}>
        取消
        </Button>
    )
    item.push(
      <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
        {currentStep !== 2 ? '下一步' : '保存'}
      </Button>
    )
    return item;
  };

  removeField = (e, fieldId) => {
    console.log(e);
    console.log(fieldId)
  }

  renderContent = (currentStep, formVals) => {
    const {
      form,
      model: { allModels, modelMetas }
    } = this.props;
    const {
      curRules, userSetRules, needFileds
    } = this.state;
    if (currentStep === 1) {
      return [
        <FormItem key="fields" {...this.formLayout} label="选择数据字段">
          {form.getFieldDecorator('fields', {
            rules: [{ required: true, message: '选择数据字段' }],
            initialValue: formVals.fields,
          })(
            <Select placeholder="选择数据字段" style={{ width: '100%' }}
              onChange={(value) => { this.needFieldChange(value) }}
              labelInValue={true}
              maxTagCount={3}
              mode="multiple"
            >
              {
                modelMetas.map((item, index) => (
                  <Option value={item.name} key={item.name}>{item.showName}</Option>
                ))
              }
            </Select>
          )}
        </FormItem>,
        <div>
          <span>已选字段：</span>
          {
            needFileds.map((field, index) => (
              <Tag style={{ marginTop: 5 }} key={index}>
                {field.label}
              </Tag>
            ))
          }
        </div>
      ];
    } else if (currentStep === 2) {
      return [
        <Divider type="horizontal" />,
        <div>
          <Select key="rule_select" placeholder="选择筛选条件" style={{ width: 180, marginLeft: 5 }}
            onChange={(value) => this.handleMetaChange(value)}
          >
            {
              modelMetas.map((item, index) => (
                <Option value={index} key={index}>{item.showName}</Option>
              ))
            }
          </Select>
          <Select placeholder="筛选规则" style={{ width: 140, marginLeft: 5 }}
            onChange={(value) => this.handleRuleChange(value)}
          >
            {
              curRules.map((item, index) => (
                <Option value={index} key={index}>{item.label}</Option>
              ))
            }
          </Select>
          <Search
            placeholder="输入值"
            enterButton="添加规则"
            style={{ width: 320, marginLeft: 5 }}
            onSearch={value => this.handleAddRule(value)}
          />
        </div>,
        <RuleShow rules={userSetRules} handleDelRule={this.handleDelRule} />
      ]
    }
    return [
      <FormItem key="name" {...this.formLayout} label="取数名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入模型名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="modelId" {...this.formLayout} label="选择模型">
        {form.getFieldDecorator('modelId', {
          rules: [{ required: true, message: '选择模型' }],
          initialValue: formVals.modelId,
        })(
          <Select placeholder="选择模型" style={{ width: '100%' }}
            onChange={(value) => this.handleModelChange(value)}>
            {
              allModels.map((item, index) => (
                <Option value={item.id} key={item.id}>{item.name}</Option>
              ))
            }
          </Select>
        )}
      </FormItem>
    ]
  }

  render() {
    const { isEdit, modalVisible, handleModalVisible, values } = this.props;
    const { currentStep, formVals } = this.state;

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={740}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={isEdit ? '修改模型' : '新增模型'}
        visible={modalVisible}
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
      </Modal>
    )
  }
}

export default PeekOptForm;