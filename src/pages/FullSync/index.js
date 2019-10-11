import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Icon,
  Button,
  Popconfirm,
  Form,
  Divider,
  Col,
  Tag,
  Row,
  Input,
  TreeSelect,
  Select,
  message,
  Badge,
  Table,
  Drawer,
} from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../styles/Manage.less';
import { sync } from 'glob';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
@connect(({ full, loading }) => ({
  full,
  loading: loading.models.full,
}))
class FullSync extends React.Component {
  state = {};

  componentDidMount() {}

  jsonChange = e => {};
  sync = fields => {
    console.log(fields);
    const { dispatch } = this.props;
    dispatch({
      type: 'full/sync',
      payload: fields,
    });
  };
  okHandle = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      console.log('提交表单');
      this.sync({
        ...fieldsValue,
      });
    });
  };

  render() {
    const formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
    const {
      form,
      full: { data },
    } = this.props;
    const {} = this.state;
    return (
      <PageHeaderWrapper title="全量同步" content="全量数据同步">
        <Button icon="swap" type="primary" onClick={this.okHandle}>
          同步启动
        </Button>
        <Row gutter={8}>
          <Col span={18}>
            {' '}
            <FormItem key="name" {...formLayout} label="文件名称">
              {form.getFieldDecorator('name', {
                rules: [{ required: false, message: 'json' }],
                initialValue: '',
              })(<Input placeholder="text.json" />)}
            </FormItem>
            <FormItem key="json" {...formLayout} label="脚本">
              {form.getFieldDecorator('json', {
                rules: [{ required: false, message: 'json' }],
                initialValue: '',
              })(
                <TextArea autosize={{ minRows: 100 }} placeholder=" " onChange={this.jsonChange} />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <div>{data && data}</div>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}
export default FullSync;
