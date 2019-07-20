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
class ReportColumnOptForm extends React.Component {
  static defaultProps = {
    values: {
      split: 0,
      frozen: 0,
      hidden: 0,
      drill: 0,
      raw: 1,
      supportSort: 0,
    },
    isEdit: false,
    reportColumns: [],
    handleAdd: () => {},
    handleUpdate: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    const {
      values: { drill, split },
    } = props;
    this.state = {
      isDrill: drill === 1,
      isSplit: split === 1,
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const { dispatch, reportId } = this.props;
    dispatch({
      type: 'report/fetchDataTypes',
    });
    dispatch({
      type: 'report/fetchFieldTypes',
    });
    dispatch({
      type: 'report/fetchReportTree',
      payload: {
        simpleReport: 0, // 获取简单的报表
        fixOption: 'NULL', // 携带未选择
        filterIds: [reportId], // 需要过滤掉的报表（自身）
      },
    });
  }

  onDrillChange = e => {
    this.setState({
      isDrill: e.target.value === 1,
    });
  };

  onSplitChange = e => {
    this.setState({
      isSplit: e.target.value === 1,
    });
  };

  okHandle = () => {
    const { values, isEdit = false, form, handleAdd, handleUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (isEdit) {
        handleUpdate({
          reportId: values.id,
          ...fieldsValue,
        });
      } else {
        handleAdd({
          ...fieldsValue,
        });
      }
    });
  };

  render() {
    const { isDrill, isSplit } = this.state;
    const {
      isEdit,
      modalVisible,
      handleModalVisible,
      values,
      form,
      report: { dataTypes, reportTree },
    } = this.props;

    const splitItemStyle = !isSplit ? { style: { display: 'none' } } : {}; // 控制组件在查看时隐藏
    const drillItemStyle = !isDrill ? { style: { display: 'none' } } : {}; // 控制组件在查看时隐藏
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={640}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={isEdit ? '修改表格字段信息' : '新增表格字段信息'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle}
      >
        <FormItem key="showName" {...this.formLayout} label="显示名称">
          {form.getFieldDecorator('showName', {
            rules: [{ required: true, message: '请输入显示名称！' }],
            initialValue: values.showName,
          })(<Input placeholder="请输入显示名称" />)}
        </FormItem>
        <FormItem key="name" {...this.formLayout} label="列名">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入列名！' }],
            initialValue: values.name,
          })(<Input placeholder="请输入列名" />)}
        </FormItem>
        <FormItem key="dataType" {...this.formLayout} label="数据类型">
          {form.getFieldDecorator('dataType', {
            rules: [{ required: true, message: '请选择数据类型' }],
            initialValue: values.dataType,
          })(
            <Select style={{ width: 300 }} placeholder="请选择数据类型">
              {dataTypes.map(t => (
                <Option key={t.key} value={t.value}>
                  {t.title}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem key="raw" {...this.formLayout} label="是否为原生字段">
          {form.getFieldDecorator('raw', {
            rules: [{ required: true, message: '请选择' }],
            initialValue: values.raw,
          })(
            <Radio.Group>
              <Radio.Button value={0}>否</Radio.Button>
              <Radio.Button value={1}>是</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="supportSort" {...this.formLayout} label="支持排序">
          {form.getFieldDecorator('supportSort', {
            rules: [{ required: true, message: '请选择' }],
            initialValue: values.supportSort,
          })(
            <Radio.Group>
              <Radio.Button value={0}>否</Radio.Button>
              <Radio.Button value={1}>是</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="frozen" {...this.formLayout} label="是否为冻结列">
          {form.getFieldDecorator('frozen', {
            initialValue: values.frozen,
          })(
            <Radio.Group>
              <Radio.Button value={0}>否</Radio.Button>
              <Radio.Button value={1}>是</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="hidden" {...this.formLayout} label="是否隐藏列">
          {form.getFieldDecorator('hidden', {
            initialValue: values.hidden,
          })(
            <Radio.Group>
              <Radio.Button value={0}>否</Radio.Button>
              <Radio.Button value={1}>是</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="drill" {...this.formLayout} label="是否下钻列">
          {form.getFieldDecorator('drill', {
            initialValue: values.drill,
          })(
            <Radio.Group onChange={this.onDrillChange}>
              <Radio.Button value={0}>否</Radio.Button>
              <Radio.Button value={1}>是</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="drillReportId" {...this.formLayout} label="下钻详细表" {...drillItemStyle}>
          {form.getFieldDecorator('drillReportId', {
            rules: [{ required: isDrill, message: '请选择下钻详细表' }],
            initialValue: values.drillReportId,
          })(
            <TreeSelect
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto', offsetHeight: 10 }}
              treeData={reportTree}
              treeDefaultExpandAll
              placeholder="请选择下钻详细表"
            />
          )}
        </FormItem>
        <FormItem key="drillParams" {...this.formLayout} label="下钻参数" {...drillItemStyle}>
          {form.getFieldDecorator('drillParams', {
            rules: [{ required: isDrill, message: '请输入下钻参数' }],
            initialValue: values.drillParams,
          })(<Input placeholder="请输入下钻参数" />)}
        </FormItem>
        <FormItem key="split" {...this.formLayout} label="是否分裂">
          {form.getFieldDecorator('split', {
            initialValue: values.split,
          })(
            <Radio.Group onChange={this.onSplitChange}>
              <Radio.Button value={0}>否</Radio.Button>
              <Radio.Button value={1}>是</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="splitChar" {...this.formLayout} label="数据项分隔符" {...splitItemStyle}>
          {form.getFieldDecorator('splitChar', {
            rules: [{ required: isSplit, message: '请输入数据项分隔符' }],
            initialValue: values.splitChar,
          })(<Input placeholder="请输入数据项分隔符" />)}
        </FormItem>
        <FormItem key="splitKvChar" {...this.formLayout} label="KV分隔符" {...splitItemStyle}>
          {form.getFieldDecorator('splitKvChar', {
            rules: [{ required: isSplit, message: '请输入KV分隔符' }],
            initialValue: values.splitChar,
          })(<Input placeholder="请输入KV分隔符" />)}
        </FormItem>
        <FormItem key="formatMacro" {...this.formLayout} label="数据格式化宏">
          {form.getFieldDecorator('formatMacro', {
            initialValue: values.formatMacro,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="comment" {...this.formLayout} label="提示信息">
          {form.getFieldDecorator('comment', {
            initialValue: values.comment,
          })(<TextArea placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default ReportColumnOptForm;
