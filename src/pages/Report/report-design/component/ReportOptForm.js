import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, TreeSelect, Select, Radio } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@Form.create()
@connect(({ group, report, loading }) => ({
  group,
  report,
  loading: loading.models.group,
}))
class ReportOptForm extends React.Component {
  static defaultProps = {
    values: {
      groupId: 0,
      parentId: '0',
    },
    isEdit: false,
    handleAdd: () => {},
    handleUpdate: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    const {
      values: { type },
    } = props;
    this.state = {
      isHand: false,
      defaultTypes: type ? type.split(',') : [],
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/getGroupTree',
    });
    dispatch({
      type: 'report/fetchTypes',
    });
  }

  onChange = e => {
    this.setState({
      isHand: e.target.value === 'hand',
    });
  };

  okHandle = () => {
    const { values, isEdit = false, form, handleAdd, handleUpdate } = this.props;
    const { isHand } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (isEdit) {
        handleUpdate({
          autoCreatedCode: isHand ? 0 : 1,
          reportId: values.id,
          ...fieldsValue,
        });
      } else {
        handleAdd({
          autoCreatedCode: isHand ? 0 : 1,
          ...fieldsValue,
        });
      }
    });
  };

  render() {
    const { isHand, defaultTypes } = this.state;
    const {
      isEdit,
      modalVisible,
      handleModalVisible,
      values,
      form,
      group: { trees },
      report: { types },
    } = this.props;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={640}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={isEdit ? '修改报表信息' : '新增报表信息'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle}
      >
        <FormItem key="groupIds" {...this.formLayout} label="隶属报表组">
          {form.getFieldDecorator('groupIds', {
            rules: [{ required: true, message: '请选择报表组' }],
            initialValue: values.groupIds,
          })(
            <TreeSelect
              style={{ width: 300 }}
              multiple
              dropdownStyle={{ maxHeight: 400, overflow: 'auto', offsetHeight: 10 }}
              treeData={trees}
              treeDefaultExpandAll
              placeholder="请选择报表组"
            />
          )}
        </FormItem>
        <FormItem key="type" {...this.formLayout} label="报表类型">
          {form.getFieldDecorator('type', {
            rules: [{ required: true, message: '报表类型' }],
            initialValue: defaultTypes,
          })(
            <Select style={{ width: 300 }} mode="multiple" placeholder="请选择报表类型">
              {types.map(t => (
                <Option key={t.key} value={t.value}>
                  {t.title}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem key="name" {...this.formLayout} label="报表名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入报表名称！' }],
            initialValue: values.name,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="simpleReport" {...this.formLayout} label="报表种类">
          {form.getFieldDecorator('simpleReport', {
            initialValue: values.simpleReport,
          })(
            <Radio.Group>
              <Radio.Button value={0}>普通报表</Radio.Button>
              <Radio.Button value={1}>LOV报表</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="statical" {...this.formLayout} label="报表状态">
          {form.getFieldDecorator('statical', {
            initialValue: values.statical,
          })(
            <Radio.Group>
              <Radio.Button value={0}>动态报表</Radio.Button>
              <Radio.Button value={1}>静态报表</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="xAxis" {...this.formLayout} label="X轴列名">
          {form.getFieldDecorator('xAxis', {
            initialValue: values.xAxis,
          })(<TextArea placeholder='请输入,多个以";"隔开' />)}
        </FormItem>
        <FormItem key="yAxis" {...this.formLayout} label="Y轴列名">
          {form.getFieldDecorator('yAxis', {
            initialValue: values.yAxis,
          })(<TextArea placeholder='请输入,多个以";"隔开' />)}
        </FormItem>
        <FormItem key="autoCreate" {...this.formLayout} label="报表编码">
          {!isEdit &&
            form.getFieldDecorator('code', {})(
              <div>
                <Radio.Group defaultValue="auto" onChange={this.onChange}>
                  <Radio.Button value="auto">自动生成</Radio.Button>
                  <Radio.Button value="hand">手动输入</Radio.Button>
                </Radio.Group>
                {isHand && <Input placeholder="请输入报表编码" />}
              </div>
            )}
          {isEdit && form.getFieldDecorator('code', {})(<span>{values.code}</span>)}
        </FormItem>
        <FormItem key="icon" {...this.formLayout} label="图标">
          {form.getFieldDecorator('icon', {
            initialValue: values.icon,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="comment" {...this.formLayout} label="描述信息">
          {form.getFieldDecorator('comment', {
            initialValue: values.comment,
          })(<TextArea placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default ReportOptForm;
