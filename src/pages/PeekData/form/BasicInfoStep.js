import React from 'react';
import { Form, Select, Input } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class BasicInfoStep extends React.Component {
  static defaultProps = {
    allModels: [],
    formVals: {},
  };

  onAddField = key => {
    const { onFormValueChange } = this.props;
    this.setState({});
    const { modelMetas = [], selectedFields = [] } = this.props;
    const field = modelMetas.find(item => item.name === key);
    onFormValueChange('fields', [...selectedFields, field.name]);
  };

  handleDeleteFields = key => {
    const { selectedFields = [], onFormValueChange } = this.props;
    onFormValueChange('fields', selectedFields.filter(item => item.key !== key));
  };

  render() {
    const { formLayout, allModels, formVals, form, onFormValueChange } = this.props;

    return (
      <div className="peekOptForm-basicInfoStep">
        <FormItem key="name" {...formLayout} label="取数名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入模型名称！' }],
            initialValue: formVals.name,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        ,
        <FormItem key="modelId" {...formLayout} label="选择模型">
          {form.getFieldDecorator('modelId', {
            rules: [{ required: true, message: '选择模型' }],
            initialValue: formVals.modelId,
          })(
            <Select
              placeholder="选择模型"
              style={{ width: '100%' }}
              disabled={formVals.peekId !== 0}
              onChange={value => onFormValueChange('modelId', value)}
            >
              {allModels.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      </div>
    );
  }
}

export default BasicInfoStep;
