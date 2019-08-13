import React from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Modal } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ commonInfo, loading }) => ({
  commonInfo,
  loading: loading.models.commonInfo,
}))
class CommonOptForm extends React.Component {
  static defaultProps = {
    values: {},
    isEdit: false,
    handleAdd: () => {},
    handleUpdate: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      parentType: undefined,
      parentList: [],
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
    this.typeMapper = {};
  }

  // 在render()方法之后立即执行
  componentDidMount() {
    const {
      dispatch,
      isEdit,
      values: { classify },
    } = this.props;
    dispatch({
      type: 'commonInfo/fetchAllTypes',
      callback: data => {
        data.forEach(item => {
          this.typeMapper[item.classify] = item;
        });
        if (isEdit) {
          this.onClassifyChangeEvent(classify);
        }
      },
    });
  }

  okHandle = () => {
    const { values, isEdit = false, form, handleAdd, handleUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (isEdit) {
        handleUpdate({
          commonInfoId: values.id,
          ...fieldsValue,
        });
      } else {
        handleAdd(fieldsValue);
      }
    });
  };

  onClassifyChangeEvent = val => {
    const selectedType = this.typeMapper[val];
    const parentType = this.typeMapper[selectedType.parentClassify];
    if (parentType !== undefined) {
      const { dispatch } = this.props;
      dispatch({
        type: 'commonInfo/fetchByClassify',
        payload: { classify: parentType.classify },
        callback: data => {
          this.setState({
            parentType,
            parentList: data,
          });
        },
      });
    } else {
      this.setState({
        parentType: undefined,
        parentList: [],
      });
    }
  };

  renderParent = () => {
    const { parentType, parentList } = this.state;
    if (parentType === undefined) {
      return null;
    }
    const {
      form,
      values: { parentClassify },
    } = this.props;
    return (
      <FormItem key="parentClassify" {...this.formLayout} label={`所属${parentType.desc}`}>
        {form.getFieldDecorator('parentClassify', {
          rules: [{ required: true, message: `${parentType.desc}必须选择` }],
          initialValue: parentClassify,
        })(
          <Select
            style={{ width: '100%' }}
            placeholder={`请选择所属${parentType.desc}`}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            optionFilterProp="children"
            showSearch
          >
            {parentList.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>
    );
  };

  render() {
    const {
      isEdit,
      modalVisible,
      handleModalVisible,
      commonInfo: { allTypes },
      values,
      form,
    } = this.props;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        style={{ top: 20 }}
        title={isEdit ? '修改基础项' : '新增基础项'}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem key="classify" {...this.formLayout} label="类型">
          {form.getFieldDecorator('classify', {
            rules: [{ required: true, message: '类型必须选择' }],
            initialValue: values.classify,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择类型"
              disabled={isEdit}
              onChange={this.onClassifyChangeEvent}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              optionFilterProp="children"
              showSearch
            >
              {allTypes.map(item => (
                <Option value={item.classify} key={item.classify}>
                  {item.desc}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        {this.renderParent()}
        <FormItem key="code" {...this.formLayout} label="编码">
          {form.getFieldDecorator('code', {
            rules: [{ required: true, message: '请输入编码！' }],
            initialValue: values.code,
          })(<Input placeholder="请输入编码" />)}
        </FormItem>
        <FormItem key="name" {...this.formLayout} label="名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入名称！', min: 1, max: 20 }],
            initialValue: values.name,
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default CommonOptForm;
