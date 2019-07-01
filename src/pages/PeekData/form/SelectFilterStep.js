import React from 'react';
import { Input, Select, notification, Divider } from 'antd';
import RuleShow from './RuleShow';

const { Option } = Select;
const { Search } = Input;

const DEFAULT_STATE = {
  selectedGroup: -1,
  searchValue: undefined,
  selectedField: undefined,
  ruleList: [],
  selectedRule: undefined,
  ruleValue: undefined,
};

class SelectFilterStep extends React.Component {
  static defaultProps = {
    values: {},
    isEdit: false,
  };

  state = { ...DEFAULT_STATE };

  handleGroupChange = val => {
    this.setState({
      ...DEFAULT_STATE,
      selectedGroup: val,
    });
  };

  handleFieldSearch = val => {
    this.setState({
      searchValue: val,
    });
  };

  handleFieldChange = val => {
    const { modelMetas = [], dataTypeRules = {} } = this.props;
    const field = modelMetas.find(item => item.name === val);
    this.setState({
      selectedField: val,
      ruleList: dataTypeRules[field.dataType] || dataTypeRules.OBJECT,
    });
  };

  handleRuleChange = val => {
    this.setState({
      selectedRule: val,
    });
  };

  handleRuleValueChange = e => {
    this.setState({
      ruleValue: e.target.value,
    });
  };

  handleAddRule = () => {
    let isHave = false;
    let isNull = false;
    let errortext = '';
    let msg = '';

    const { selectedField, selectedRule, ruleValue, ruleList } = this.state;
    const { rules = [], modelMetas } = this.props;

    if (!selectedField || !selectedRule || !ruleValue) {
      isNull = true;
      msg = '非法的规则';
      errortext = '有条件为空';
    }
    const fieldObj = modelMetas.find(item => item.name === selectedField);
    if (!isNull) {
      for (let i = 0; i < rules.length; i += 1) {
        const tmp = rules[i];
        if (tmp.metaId === fieldObj.id && tmp.rule === selectedRule) {
          isHave = true;
          errortext = `${tmp.showName}  ${tmp.ruleLabel}  ${tmp.value}`;
          msg = '规则已存在';
          break;
        }
      }
    }
    const ruleObj = ruleList.find(item => item.value === selectedRule);

    if (!isHave && !isNull) {
      this.props.onFormValueChange('rules', [
        ...rules,
        {
          metaId: fieldObj.id,
          fieldName: fieldObj.name,
          showName: fieldObj.showName,
          ruleLabel: ruleObj.label,
          rule: ruleObj.value,
          value: ruleValue,
        },
      ]);
    } else {
      notification.error({
        message: msg,
        description: errortext,
      });
    }
  };

  handleDelRule = idx => {
    const { rules = [] } = this.props;
    this.props.onFormValueChange('rules', rules.filter((item, index) => index !== idx));
  };

  handleChangeRule = (params, idx) => {
    const { rules = [] } = this.props;
    const newRuleList = rules.map((rule, index) => {
      if (idx === index){
        return {...rule,...params};
      }
      return rule;
    });
    this.props.onFormValueChange('rules', newRuleList);
  };

  render() {
    const { modelMetas = [], dataTypeRules = {}, tagList, rules } = this.props;
    const {
      selectedGroup,
      searchValue,
      selectedField,
      selectedRule,
      ruleList,
      ruleValue,
    } = this.state;

    return (
      <div className="peekOptForm-selectFilterStep">
        <Divider type="horizontal" />
        <div>
          <Select
            key="groups"
            placeholder="选择分组"
            style={{ width: 200, marginLeft: 5 }}
            value={selectedGroup}
            onChange={this.handleGroupChange}
          >
            {tagList.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
          <Select
            key="rule_select"
            placeholder="选择筛选条件"
            style={{ width: 250, marginLeft: 5 }}
            value={selectedField}
            showSearch
            defaultActiveFirstOption={false}
            showArrow={false}
            allowClear
            filterOption={false}
            onSearch={this.handleFieldSearch}
            onChange={this.handleFieldChange}
            notFoundContent={null}
          >
            {modelMetas
              .filter(item => selectedGroup === -1 || item.tagId === selectedGroup)
              .filter(item => !searchValue || item.showName.indexOf(searchValue) > -1)
              .map((item) => (
                <Option value={item.name} key={item.id}>
                  {item.showName}
                </Option>
              ))}
          </Select>
          <Select
            placeholder="筛选规则"
            style={{ width: 170, marginLeft: 5 }}
            onChange={this.handleRuleChange}
            value={selectedRule}
          >
            {ruleList.map((item) => (
              <Option value={item.value} key={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
          <Search
            placeholder="输入值"
            enterButton="添加规则"
            style={{ width: 220, marginLeft: 5 }}
            value={ruleValue}
            onChange={this.handleRuleValueChange}
            onSearch={this.handleAddRule}
          />
        </div>
        <RuleShow
          rules={rules}
          handleChangeRule={this.handleChangeRule}
          modelMetas={modelMetas}
          dataTypeRules={dataTypeRules}
          handleDelRule={this.handleDelRule}
        />
      </div>
    );
  }
}

export default SelectFilterStep;
