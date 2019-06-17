import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
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
  Popconfirm,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

class UserManage extends React.Component {
  render() {
    return (
      <PageHeaderWrapper
        title="用户管理"
        content='对系统用户进行增删改查等操作~'
      ></PageHeaderWrapper>
    );
  }
}

export default UserManage;