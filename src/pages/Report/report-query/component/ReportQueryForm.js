import React from 'react';
import { Form, Checkbox, Icon, Menu, Card, Dropdown } from 'antd';

import styles from '../index.less';

@Form.create()
class ReportQueryForm extends React.Component {
  static defaultProps = {
    reportInfo: {
      report: {},
      fields: [],
    },
    onDependChange: () => {},
    OnQueryClick: () => {},
  };

  menu = (
    <Menu onClick={this.handleMenuClick}>
      <Menu.Item key="download_xlsx">
        <Icon type="user" /> 下载Excel文件
      </Menu.Item>
      <Menu.Item key="download_csv">
        <Icon type="user" /> 下载CSV文件
      </Menu.Item>
      <Menu.Item key="timer">
        <Icon type="user" />
        定制Job
      </Menu.Item>
    </Menu>
  );

  handleMenuClick = () => {};

  onQueryBtnClick = () => {};

  render() {
    return (
      <Card bordered={false}>
        <div className={styles.ManageOperator}>
          <Checkbox>显示SQL</Checkbox>
          <span className={styles.querySubmitButtons}>
            <Dropdown.Button onClick={this.onQueryBtnClick} overlay={this.menu}>
              查询
            </Dropdown.Button>
          </span>
        </div>
      </Card>
    );
  }
}

export default ReportQueryForm;
