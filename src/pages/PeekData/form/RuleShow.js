import React, { Fragment } from 'react';

import { Popconfirm, Empty, Table, Input, Select } from 'antd';
import styles from './RuleShow.less';

class RuleShow extends React.Component {
  static defaultProps = {
    rules: [],
    handleDelRule: () => {},
  };

  onRuleValueChange = (idx, e) => {
    const { handleChangeRule } = this.props;
    handleChangeRule({ value: e.target.value }, idx);
  };

  onRuleChange = (idx, value, ruleList) => {
    const { handleChangeRule } = this.props;
    const ruleObj = ruleList.find(item => item.value === value);
    handleChangeRule({ rule: ruleObj.value, label: ruleObj.label }, idx);
  };

  render() {
    const { rules, handleDelRule, modelMetas, dataTypeRules } = this.props;
    const groupsMapper = {};
    modelMetas.forEach(item => {
      groupsMapper[item.name] = item.groupName;
    });
    const columns = [
      {
        title: '分组名',
        key: 'groupName',
        render: (text, record) => groupsMapper[record.fieldName],
      },
      { title: '字段名', dataIndex: 'showName', key: 'showName' },
      {
        title: '规则',
        dataIndex: 'rule',
        key: 'rule',
        render: (text, record, index) => {
          const fieldObj = modelMetas.find(item => item.name === record.fieldName) || {};
          const ruleList = dataTypeRules[fieldObj.dataType] || dataTypeRules.OBJECT || [];
          return (
            <Select
              value={record.rule}
              onChange={value => this.onRuleChange(index, value, ruleList)}
            >
              {ruleList.map(rule => (
                <Select.Option value={rule.value} key={rule.value}>
                  {rule.label}
                </Select.Option>
              ))}
            </Select>
          );
        },
      },
      {
        title: '代入值',
        dataIndex: 'value',
        key: 'value',
        render: (text, record, index) => (
          <Input value={record.value} onChange={value => this.onRuleValueChange(index, value)} />
        ),
      },
      {
        title: '操作',
        render: (text, record, index) => (
          <Fragment>
            <Popconfirm
              placement="top"
              title="确定删除该模型？"
              onConfirm={() => handleDelRule(index)}
            >
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    return (
      <div className={styles.ruleList}>
        {rules.length <= 0 ? (
          <Empty
            style={{ marginTop: 20 }}
            imageStyle={{ height: 50 }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>一个规则也没有</span>}
          />
        ) : (
          <Table size="small" dataSource={rules} columns={columns} />
        )}
      </div>
    );
  }
}

export default RuleShow;
