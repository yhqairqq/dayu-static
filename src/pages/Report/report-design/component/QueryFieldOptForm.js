import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, TreeSelect, Select, Radio, Row, Col, Checkbox } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@Form.create()
@connect(({ group, report, loading }) => ({
  group,
  report,
  loading: loading.models.group,
}))
class QueryFieldOptForm extends React.Component {
  static defaultProps = {
    values: {
      orderByType: 'ASC',
      parentId: '0',
      types: [],
    },
    isEdit: false,
    dependOnFields: [],
    handleAdd: () => {},
    handleUpdate: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    const {
      values: { types },
    } = props;
    const isLov = types ? types.indexOf(4) >= 0 : false;
    const isOrderByType = types ? types.indexOf(8) >= 0 : false;
    this.state = {
      isLov,
      isOrderByType,
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/fetchDataTypes',
    });
    dispatch({
      type: 'report/fetchFieldTypes',
    });
    dispatch({
      type: 'report/fetchReportTree',
    });
  }

  onCheckboxChange = checkedList => {
    const isLov = checkedList.indexOf(4) >= 0;
    const isOrderByType = checkedList.indexOf(8) >= 0;
    this.setState({
      isLov,
      isOrderByType,
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
    const { isLov, isOrderByType } = this.state;
    const {
      isEdit,
      modalVisible,
      handleModalVisible,
      values,
      form,
      dependOnFields,
      report: { dataTypes, fieldTypes, reportTree },
    } = this.props;

    const orderItemStyle = !isOrderByType ? { style: { display: 'none' } } : {}; // 控制组件在查看时隐藏
    const lovItemStyle = !isLov ? { style: { display: 'none' } } : {}; // 控制组件在查看时隐藏
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={640}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={isEdit ? '修改参数' : '新增参数'}
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
        <FormItem key="queryName" {...this.formLayout} label="参数名称">
          {form.getFieldDecorator('queryName', {
            rules: [{ required: true, message: '请输入参数名称！' }],
            initialValue: values.queryName,
          })(<Input placeholder="请输入参数名称" />)}
        </FormItem>
        <FormItem key="dataType" {...this.formLayout} label="数据类型">
          {form.getFieldDecorator('dataType', {
            rules: [{ required: true, message: '数据类型' }],
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
        <FormItem key="types" {...this.formLayout} label="字段类型">
          {form.getFieldDecorator('types', {
            initialValue: values.types,
          })(
            <Checkbox.Group style={{ width: '100%' }} onChange={this.onCheckboxChange}>
              <Row>
                {fieldTypes.map(ft => (
                  <Col span={8} key={ft.left}>
                    <Checkbox value={ft.left}>{ft.right}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          )}
        </FormItem>
        <FormItem key="valDefault" {...this.formLayout} label="默认值">
          {form.getFieldDecorator('valDefault', {
            initialValue: values.valDefault,
          })(<Input placeholder="请输入默认值" />)}
        </FormItem>
        <FormItem key="valMax" {...this.formLayout} label="最大值">
          {form.getFieldDecorator('valMax', {
            initialValue: values.valMax,
          })(<Input placeholder="请输入最大值" />)}
        </FormItem>
        <FormItem key="valMin" {...this.formLayout} label="最小值">
          {form.getFieldDecorator('valMin', {
            initialValue: values.valMin,
          })(<Input placeholder="请输入最小值" />)}
        </FormItem>
        <FormItem key="valForbidden" {...this.formLayout} label="禁用值">
          {form.getFieldDecorator('valForbidden', {
            initialValue: values.valForbidden,
          })(<Input placeholder="请输入禁用值（多个以逗号分隔）" />)}
        </FormItem>
        <FormItem key="mustFillIn" {...this.formLayout} label="是否必填">
          {form.getFieldDecorator('mustFillIn', {
            initialValue: values.mustFillIn,
          })(
            <Radio.Group>
              <Radio.Button value={0}>否</Radio.Button>
              <Radio.Button value={1}>是</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="lovReportId" {...this.formLayout} label="LOV数据源" {...lovItemStyle}>
          {form.getFieldDecorator('lovReportId', {
            rules: [{ required: isLov, message: '请选择LOV数据源' }],
            initialValue: values.lovReportId,
          })(
            <TreeSelect
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto', offsetHeight: 10 }}
              treeData={reportTree}
              treeDefaultExpandAll
              placeholder="请选择LOV数据源"
            />
          )}
        </FormItem>
        <FormItem key="dependOn" {...this.formLayout} label="父级级联" {...lovItemStyle}>
          {form.getFieldDecorator('dependOn', {
            initialValue: values.dependOn,
          })(
            <Select style={{ width: 300 }} placeholder="请选择父级级联">
              {dependOnFields.map(t => (
                <Option key={t.queryName} value={t.queryName}>
                  {t.showName}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem key="orderByType" {...this.formLayout} label="排序方式" {...orderItemStyle}>
          {form.getFieldDecorator('orderByType', {
            rules: [{ required: isOrderByType, message: '请选择排序方式' }],
            initialValue: values.orderByType,
          })(
            <Radio.Group>
              <Radio.Button value="ASC">ASC</Radio.Button>
              <Radio.Button value="DESC">DESC</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="placeholder" {...this.formLayout} label="提示信息">
          {form.getFieldDecorator('placeholder', {
            initialValue: values.placeholder,
          })(<TextArea placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default QueryFieldOptForm;
