import React from 'react';
import { Form, Checkbox, Icon, Menu, Dropdown, Input, Divider } from 'antd';
// import PropTypes from 'prop-types';

import styles from '../index.less';

// 渲染单个表单项
const renderFormItem = ({ item, getFieldDecorator }) => {
  const {
    queryName, // key值
    showName, // label名称
    mustFillIn, // 是否必填
    valDefault, // 默认值
    rules,
    options = {},
  } = item;
  return (
    <Form.Item key={queryName} label={showName}>
      {getFieldDecorator(queryName, {
        ...options,
        initialValue: valDefault,
        rules: rules || [{ mustFillIn, message: `${showName}为空` }],
      })(<Input />)}
    </Form.Item>
  );
};

@Form.create()
class ReportQueryForm extends React.Component {
  state = {
    showSql: false,
  };

  menu = (
    <Menu
      onClick={e => {
        this.handleMenuClick(e);
      }}
    >
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

  // 显示SQL操作
  onCheckboxChange = e => {
    this.setState({
      showSql: e.target.checked,
    });
  };

  // 更多操作
  handleMenuClick = e => {
    const { key } = e;
    switch (key) {
      case 'download_xlsx':
        break;
      case 'download_csv':
        break;
      case 'timer':
        break;
      default:
        break;
    }
  };

  // 查询操作
  onQueryBtnClick = (e, action) => {
    e.preventDefault();
    const { form, onQueryClick } = this.props;
    const { showSql } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      onQueryClick({
        showSql: showSql ? 1 : 0,
        params: fieldsValue,
        action,
      });
    });
  };

  render() {
    const {
      items,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div>
        <Form layout="inline">
          {items.map(item => renderFormItem({ item, getFieldDecorator }))}
        </Form>
        <Divider type="horizontal" />
        <div className={styles.footer}>
          <Checkbox onChange={this.onCheckboxChange}>显示SQL</Checkbox>
          <span className={styles.queryBtn}>
            <Dropdown.Button onClick={this.onQueryBtnClick} overlay={this.menu}>
              查询
            </Dropdown.Button>
          </span>
        </div>
      </div>
    );
  }
}

// ReportQueryForm.propTypes = {
//   onQueryBtnClick: PropTypes.func,
//   onDependChange: PropTypes.func,
//   items: PropTypes.array.isRequired,
//   form: PropTypes.object.isRequired,
// }

// ReportQueryForm.defaultProps = {
//   onQueryClick: () => { },
//   onDependChange: () => { }
// }

export default Form.create()(ReportQueryForm);
