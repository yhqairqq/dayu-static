import { PureComponent, Fragment } from "react";

import styles from './RuleShow.less';
import {
  Popconfirm,
  Empty,
  Row,
  Col,
  Table,
} from "antd";

class RuleShow extends React.Component {
  static defaultProps = {
    rules: [],
    handleDelRule: () => { }
  }

  constructor(props) {
    super(props);
  }
  render() {
    const { rules, handleDelRule } = this.props;
    const columns = [
      { title: '字段名', dataIndex: 'showName', key: 'showName' },
      { title: '规则', dataIndex: 'ruleLabel', key: 'ruleLabel' },
      { title: '代入值', dataIndex: 'value', key: 'value' },
      {
        title: '操作', render: (text, record, index) => (
          <Fragment>
            <Popconfirm placement="top" title="确定删除该模型？"
              onConfirm={() => handleDelRule(index)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        )
      }
    ];
    return (
      <div className={styles.ruleList}>
        {
          rules.length <= 0 ?
            <Empty
              style={{ marginTop: 20 }}
              imageStyle={{ height: 50 }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span>一个规则也没有</span>
              }
            />
            :
            <Table
              size="small"
              dataSource={rules}
              columns={columns}
            />
        }
      </div>
    )
  }
}

export default RuleShow;
