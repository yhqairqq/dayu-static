import React from 'react';
import styles from './index.less';

const isDateField = dataType =>
  dataType === 'DATE' || dataType === 'DATETIME' || dataType === 'TIME' || dataType === 'TIMESTAMP';

const addQuotaIfNeed = (val, dataType) =>
  dataType === 'STRING' || isDateField(dataType) ? `'${val}'` : val;

const toInStr = (val, dataType) => {
  let temp = '';
  if (val) {
    temp = val
      .split(',')
      .map(item => item.trim())
      .filter(item => item)
      .map(item => addQuotaIfNeed(item, dataType))
      .join(',');
  }
  return ` (${temp}) `;
};

const RuleFactoryMapper = {
  equals: (val, dataType) => `=  ${addQuotaIfNeed(val, dataType)}`,
  equalsIgnoreCase: (val, dataType) => `=  ${addQuotaIfNeed(val, dataType)}`,
  notEquals: (val, dataType) => `!=  ${addQuotaIfNeed(val, dataType)}`,
  gt: (val, dataType) => `>  ${addQuotaIfNeed(val, dataType)}`,
  gte: (val, dataType) => `>=  ${addQuotaIfNeed(val, dataType)}`,
  lt: (val, dataType) => `<  ${addQuotaIfNeed(val, dataType)}`,
  lte: (val, dataType) => `<=  ${addQuotaIfNeed(val, dataType)}`,
  startWith: val => `LIKE '${val}%'`,
  endWith: val => `LIKE '%${val}'`,
  contains: val => `LIKE '%${val}%'`,
  includes: (val, dataType) => `IN ${toInStr(val, dataType)}`,
  notIncludes: (val, dataType) => `NOT IN ${toInStr(val, dataType)}`,
};
/**
 * Author: feixy
 * Date: 2019-07-04
 * Time: 14:54
 */
class SqlPane extends React.Component {
  state = {};

  getSqlText = () => {
    const sqlArr = [];
    const { modelObj, selectedList, ruleList, modelMetaList } = this.props;
    if (modelObj && selectedList && selectedList.length > 0) {
      const modelMetaMapper = {};
      modelMetaList.forEach(item => {
        modelMetaMapper[item.id] = item;
      });

      const groupByArr = [];
      const selectFieldArr = [];
      const dimensionList = selectedList
        .filter(item => item.metaId)
        .filter(item => !item.aggExpression);
      const measureList = selectedList
        .filter(item => item.metaId)
        .filter(item => !!item.aggExpression);
      if (measureList.length > 0) {
        // 如果有一个聚合函数,则没有聚合函数的全部要放到groupBy中去
        dimensionList.forEach(field => {
          const { name } = modelMetaMapper[field.metaId];
          selectFieldArr.push(name);
          groupByArr.push(name);
        });
        measureList.forEach(field => {
          const { aggExpression, alias } = field;
          const { name, showName } = modelMetaMapper[field.metaId];
          const displayName = alias || showName;
          if (aggExpression === 'COUNT DISTINCT') {
            selectFieldArr.push(`COUNT (DISTINCT ${name}) as '${displayName}'`);
          } else {
            selectFieldArr.push(`${aggExpression}(${name}) as '${displayName}'`);
          }
        });
      } else {
        dimensionList.forEach(field => {
          const { name } = modelMetaMapper[field.metaId];
          selectFieldArr.push(name);
        });
      }
      sqlArr.push('SELECT<br/>');
      sqlArr.push(selectFieldArr.join(',<br/>'));
      sqlArr.push(`<br/> FROM ${modelObj.tableName}`);
      // 拼接rule
      const ruleArr = ruleList
        .filter(this.isValidRule)
        .map(item => {
          const { metaId } = item;
          const metaObj = modelMetaMapper[metaId];
          return this.createRuleString(metaObj, item);
        })
        .filter(item => !!item);
      if (ruleArr.length > 0) {
        sqlArr.push('<br/>WHERE<br/>');
        sqlArr.push(ruleArr.join(' AND <br/> '));
      }

      if (groupByArr.length > 0) {
        sqlArr.push('<br/>GROUP BY<br/>');
        sqlArr.push(groupByArr.join(',<br/>'));
      }
    }
    return sqlArr.join(' ');
  };

  createRuleString = (metaObj, ruleItem) => {
    const { name, dataType } = metaObj;
    const { rule, value } = ruleItem;
    const ruleFactory = RuleFactoryMapper[rule] || (() => null);
    const ruleString = ruleFactory(value, dataType);
    return ruleString ? ` ${name} ${ruleString} ` : null;
  };

  isValidRule = item => {
    return item.metaId && item.rule && item.value;
  };

  render() {
    return (
      <div className={styles.sqlPane}>
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: this.getSqlText() }} />
      </div>
    );
  }
}

export default SqlPane;
