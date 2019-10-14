import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, TreeSelect, Select, Radio } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@Form.create()
@connect(({ mediasource, loading }) => ({
  mediasource,
  loading: loading.models.mediasource,
}))
class MediaSourceForm extends React.Component {
  static defaultProps = {
    values: {},
    isEdit: false,
    handleAdd: () => {},
    handleUpdate: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    const {
      values: { type },
      values,
    } = props;
    this.state = {
      isHand: false,
      defaultTypes: type ? type.split(',') : [],
      typeVisible: type == null || type === 'MYSQL' ? true : false,
      sourceId: values.id,
      type,
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const { dispatch, values, isEdit } = this.props;

    if (isEdit) {
      dispatch({
        type: 'mediasource/fetchone',
        payload: {
          id: values.id,
        },
      });
    }

    // dispatch({
    //   type: 'group/getGroupTree',
    // });
    // dispatch({
    //   type: 'report/fetchTypes',
    // });
  }

  onChange = e => {
    this.setState({
      isHand: e.target.value === 'hand',
    });
  };

  okHandle = () => {
    const { values, isEdit = false, form, handleAdd, handleUpdate } = this.props;
    const { isHand, sourceId, type } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      console.log(fieldsValue);
      if (isEdit) {
        handleUpdate({
          id: sourceId,
          ...fieldsValue,
        });
      } else {
        handleAdd({
          ...fieldsValue,
        });
      }
    });
  };
  typeSelectHandle = value => {
    if (value === 'ROCKETMQ' || value === 'KAFKA') {
      this.setState({
        typeVisible: false,
        type: value,
      });
    } else {
      this.setState({
        typeVisible: true,
        type: value,
      });
    }
  };

  render() {
    const { isHand, defaultTypes, typeVisible, sourceId } = this.state;
    const {
      isEdit,
      modalVisible,
      handleModalVisible,

      form,
      mediasource: { source },
      //   group: { trees },
      //   report: { types },
    } = this.props;
    const values = {
      ...source,
    };

    const types = [
      {
        key: 'MYSQL',
        title: 'MYSQL',
        value: 'MYSQL',
      },
      {
        key: 'ROCKETMQ',
        title: 'ROCKETMQ',
        value: 'ROCKETMQ',
      },
      {
        key: 'KAFKA',
        title: 'KAFKA',
        value: 'KAFKA',
      },
    ];
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={window.innerWidth / 2}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={isEdit ? '修改数据源信息' : '新增数据源信息'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle}
      >
        <FormItem key="name" {...this.formLayout} label="数据源名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入数据源名称' }],
            initialValue: values.name,
          })(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem key="type" {...this.formLayout} label="数据源类型">
          {form.getFieldDecorator('type', {
            rules: [{ required: true, message: '数据源类型' }],
            initialValue: values.type,
          })(
            <Select
              style={{ width: 300 }}
              mode="single"
              placeholder="请选择数据源类型"
              onChange={this.typeSelectHandle}
            >
              {types.map(t => (
                <Option key={t.key} value={t.value}>
                  {t.title}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        {typeVisible && (
          <FormItem key="username" {...this.formLayout} label="用户名">
            {form.getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入数据源用户名' }],
              initialValue: values.username,
            })(<Input placeholder="请输入" />)}
          </FormItem>
        )}
        {typeVisible && (
          <FormItem key="password" {...this.formLayout} label="密码">
            {form.getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入数据源密码' }],
              initialValue: values.password,
            })(<Input placeholder="请输入" />)}
          </FormItem>
        )}

        <FormItem key="url" {...this.formLayout} label="数据源URL">
          {form.getFieldDecorator('url', {
            rules: [{ required: true, message: '请输入数据源名称URL' }],
            initialValue: values.url,
          })(<Input placeholder="jdbc:mysql://127.0.0.1:3306" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default MediaSourceForm;
