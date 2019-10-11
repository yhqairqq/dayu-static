import React from 'react';
import { Form, Select, Tag } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class SelectFieldStep extends React.Component {
  static defaultProps = {
    values: {},
    isEdit: false,
    tagList: [],
  };

  state = {
    selectedGroup: -1,
    searchValue: '',
    selectedField: undefined,
  };

  onGroupChange = value => {
    this.setState({
      selectedGroup: value,
      selectedField: undefined,
    });
  };

  handleSearch = value => {
    this.setState({
      searchValue: value,
    });
  };

  onAddField = key => {
    const { onFormValueChange } = this.props;
    this.setState({
      searchValue: '',
      selectedField: undefined,
    });
    const { modelMetas = [], selectedFields = [] } = this.props;
    const field = modelMetas.find(item => item.name === key);
    onFormValueChange('fields', [...selectedFields, field.name]);
  };

  handleDeleteFields = key => {
    const { selectedFields = [], onFormValueChange } = this.props;
    onFormValueChange('fields', selectedFields.filter(item => item !== key));
  };

  render() {
    const { modelMetas = [], selectedFields = [], formLayout, tagList } = this.props;
    const { selectedGroup, searchValue, selectedField } = this.state;
    const selectedFieldObjs = modelMetas.filter(item =>
      selectedFields.some(fieldName => fieldName === item.name)
    );
    return (
      <div>
        <FormItem key="group" {...formLayout} label="选择字段分组">
          <Select
            placeholder="选择字段分组"
            style={{ width: '100%' }}
            value={selectedGroup}
            onChange={this.onGroupChange}
          >
            {tagList.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem key="fields" {...formLayout} label="选择数据字段">
          <Select
            value={selectedField}
            showSearch
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={this.handleSearch}
            onChange={this.onAddField}
            style={{ width: '100%' }}
            notFoundContent={null}
          >
            {modelMetas
              .filter(item => selectedGroup === -1 || item.tagId === selectedGroup)
              .filter(item => searchValue.length === 0 || item.showName.indexOf(searchValue) > -1)
              .filter(item => selectedFields.every(fieldName => fieldName !== item.name))
              .map(item => (
                <Option value={item.name} key={item.name}>
                  {item.showName}
                </Option>
              ))}
          </Select>
        </FormItem>
        <div>
          <span>已选字段：</span>
          {selectedFieldObjs.map(field => (
            <Tag
              style={{ marginTop: 5 }}
              key={field.name}
              closable
              onClose={() => this.handleDeleteFields(field.name)}
            >
              {field.showName}
            </Tag>
          ))}
        </div>
      </div>
    );
  }
}

export default SelectFieldStep;
