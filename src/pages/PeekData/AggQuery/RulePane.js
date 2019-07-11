import React, { Fragment } from 'react';
import { Button, Icon, Input, Popconfirm, Select, Table, Tooltip } from 'antd';
import styles from './index.less';

/**
 * Author: feixy
 * Date: 2019-07-04
 * Time: 14:54
 */
class RulePane extends React.Component {
  static defaultProps = {
    dataTypeRules: {},
  };

  onTagChange = (idx, value) => {
    const newItem = { tagId: value, value: undefined, rule: undefined, metaId: undefined };
    this.onRuleChange(idx, newItem);
  };

  onFieldChange = (idx, metaId) => {
    const newItem = { metaId, value: undefined, rule: undefined };
    this.onRuleChange(idx, newItem);
  };

  onRuleChange = (idx, newItem) => {
    const { ruleList, onParentStateChange } = this.props;
    const newList = ruleList.map((item, index) => {
      return index === idx ? { ...item, ...newItem } : item;
    });
    onParentStateChange({ ruleList: newList });
  };

  onAddRuleEvent = () => {
    const { ruleList, onParentStateChange, peekId } = this.props;
    const newRule = {
      peekId,
      id: undefined,
      metaId: undefined,
      tagId: -1,
      rule: undefined,
      value: undefined,
    };
    onParentStateChange({ ruleList: [...ruleList, newRule] });
  };

  onDelRuleEvent = index => {
    const { ruleList, onParentStateChange } = this.props;
    onParentStateChange({ ruleList: ruleList.filter((item, idx) => idx !== index) });
  };

  renderButton = () => {
    return (
      <div className={styles.addBtn}>
        <Button type="primary" icon="plus" onClick={this.onAddRuleEvent}>
          添加过滤条件
        </Button>
      </div>
    );
  };

  render() {
    const { ruleList, modelMetaList, dataTypeRules, tagList } = this.props;
    const modelMetaMap = {};
    modelMetaList.forEach(item => {
      modelMetaMap[item.id] = item;
    });
    const columns = [
      {
        title: '分组标签',
        dataIndex: 'tagId',
        width: '15%',
        render: (text, record, index) => {
          return (
            <Select
              value={record.tagId}
              style={{ width: '100%' }}
              onChange={value => this.onTagChange(index, value)}
            >
              {tagList.map(item => (
                <Select.Option value={item.id} key={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          );
        },
      },
      {
        title: '字段名',
        key: 'metaId',
        width: '35%',
        render: (text, record, index) => {
          const { tagId, metaId } = record;
          const fieldList =
            tagId === -1 ? modelMetaList : modelMetaList.filter(item => item.tagId === tagId);
          const meta = modelMetaMap[metaId] || {};
          return (
            <span>
              <Select
                value={record.metaId}
                style={{ width: '90%' }}
                allowClear
                onChange={value => this.onFieldChange(index, value, modelMetaMap[value])}
              >
                {fieldList.map(item => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.showName}
                  </Select.Option>
                ))}
              </Select>
              {meta.remark ? (
                <Tooltip placement="topLeft" title={meta.remark} arrowPointAtCenter>
                  <Icon type="question-circle" />
                </Tooltip>
              ) : null}
            </span>
          );
        },
      },
      {
        title: '规则',
        dataIndex: 'rule',
        key: 'rule',
        width: '15%',
        render: (text, record, index) => {
          let selectedList = [];
          if (record.metaId) {
            const fieldObj = modelMetaMap[record.metaId] || {};
            selectedList = dataTypeRules[fieldObj.dataType] || dataTypeRules.OBJECT || [];
          }
          return (
            <Select
              value={record.rule}
              style={{ width: '100%' }}
              onChange={val => this.onRuleChange(index, { rule: val })}
            >
              {selectedList.map(rule => (
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
        width: '20%',
        render: (text, record, index) => (
          <Input
            value={record.value}
            onChange={e => this.onRuleChange(index, { value: e.target.value })}
          />
        ),
      },
      {
        title: '操作',
        width: '10%',
        render: (text, record, index) => (
          <Fragment>
            <Popconfirm
              placement="top"
              title="确定删除该规则？"
              onConfirm={() => this.onDelRuleEvent(index)}
            >
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    return (
      <div className={styles.rulePane}>
        {this.renderButton()}
        <Table size="small" dataSource={ruleList} columns={columns} pagination={false} />
      </div>
    );
  }
}

export default RulePane;
