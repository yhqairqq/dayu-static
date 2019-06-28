import React from 'react';
import { connect } from 'dva';
import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Steps,
  Switch,
  Table,
  message,
} from 'antd';
import _ from 'lodash';
const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

import styles from '../PeekData.less';

@Form.create()
@connect(({ model, loading }) => ({
  model,
  loading: loading.models.model,
}))
class ModelUpgradeModal extends React.Component {
  static defaultProps = {
    record: {},
    isUpgrade: false,
    handleAdd: () => {},
    handleUpdate: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };

    const { record = {} } = props;
    this.state = {
      currentStep: 0,
      item: { ...record },
      fieldList: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'model/initPage',
      payload: {},
    });
    const { tableName, datasourceId } = this.getModalDataItem();
    if (this.isUpgrade()) {
      this.handleDtChange(datasourceId);
    } else if (this.isEdit()) {
      this.handleTableChange(tableName);
    }
  }

  getModalData = () => {
    return this.props.model.modelModal || {};
  };

  getModalDataItem = () => {
    return this.state.item || {};
  };

  isEdit = () => {
    return !!this.getModalDataItem().id;
  };

  /**
   * 是否升级
   * @returns {boolean}
   */
  isUpgrade = () => {
    return this.props.isUpgrade;
  };

  handleDtChange = datasourceId => {
    const { dispatch } = this.props;
    this.onItemValueChange({ datasourceId });
    dispatch({
      type: 'model/queryTableListByDsId',
      payload: datasourceId,
    });
  };

  handleTableChange = (tableName, prop = 'tableName') => {
    const { dispatch } = this.props;
    const item = this.getModalDataItem();
    this.onItemValueChange({ [prop]: tableName });
    //根据选择的表查询该表的column和Schema
    dispatch({
      type: 'model/getColumnsAndSchemas',
      payload: {
        modelId: item.id,
        tableName: tableName,
        datasourceId: item.datasourceId,
        isUpgrade: this.isUpgrade(),
      },
      callback: data => {
        const { fields = [], schemas = [] } = data;
        this.setState({
          fieldList: this.processData(fields, schemas),
        });
      },
    });
  };

  processData = (fields, schemaList) => {
    const { tagList } = this.getModalData();
    const isEdit = this.isEdit();
    //匹配标签
    const DEFAULT_TAG = tagList.find(item => item.defaulted === 1);
    const schemaMap = schemaList.reduce((a, b) => {
      a[b['fieldName']] = b;
      return a;
    }, {});
    fields.forEach(item => {
      if (!isEdit || this.isUpgrade()) {
        const findTag = tagList.find(tag => item.name.startsWith(tag.rule)) || DEFAULT_TAG;
        item['tagId'] = findTag.id;
        const schema = schemaMap[item.name] || {};
        item['showName'] = schema.comments || '';
      }
      item['_orderName'] = item.showName;
    });
    return fields;
  };

  onItemValueChange = params => {
    this.setState({
      item: {
        ...this.getModalDataItem(),
        ...params,
      },
    });
  };

  renderBasicStep = () => {
    const { form } = this.props;
    const { datasourceList = [], tableList = [] } = this.getModalData();
    const item = this.getModalDataItem();
    return (
      <Form layout="horizontal">
        <FormItem key="name" {...this.formLayout} label="模型名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入模型名称！' }],
            initialValue: item.name,
          })(
            <Input
              placeholder="请输入模型名称"
              disabled={this.isUpgrade()}
              onChange={e => this.onItemValueChange({ name: e.target.value })}
            />
          )}
        </FormItem>
        <FormItem key="datasourceId" {...this.formLayout} label="数据源">
          {form.getFieldDecorator('datasourceId', {
            rules: [{ required: true, message: '请选择数据源' }],
            initialValue: item.datasourceId,
          })(
            <Select
              placeholder="请选择数据源"
              style={{ width: '100%' }}
              disabled={this.isEdit() || this.isUpgrade()}
              onChange={this.handleDtChange}
            >
              {datasourceList.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        {!this.isUpgrade() ? (
          <FormItem key="tableName" {...this.formLayout} label="业务表">
            {form.getFieldDecorator('tableName', {
              rules: [{ required: true, message: '请选择业务表' }],
              initialValue: item.tableName,
            })(
              <Select
                placeholder="请选择业务表"
                style={{ width: '100%' }}
                disabled={this.isEdit()}
                onChange={value => this.handleTableChange(value)}
              >
                {tableList &&
                  tableList.map(item => (
                    <Option key={item.name} value={item.name}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            )}
          </FormItem>
        ) : null}
        {this.isUpgrade() ? (
          <FormItem key="tableNameBak" {...this.formLayout} label="业务表">
            <Input value={item.tableName} disabled={true} />
          </FormItem>
        ) : null}

        {this.isUpgrade() ? (
          <FormItem key="newTableName" {...this.formLayout} label="业务表(新)">
            {form.getFieldDecorator('newTableName', {
              rules: [{ required: true, message: '请选择新的业务表' }],
              initialValue: item.newTableName,
            })(
              <Select
                placeholder="请选择业务表"
                style={{ width: '100%' }}
                onChange={value => this.handleTableChange(value, 'newTableName')}
              >
                {tableList &&
                  tableList.map(item => (
                    <Option key={item.name} value={item.name}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            )}
          </FormItem>
        ) : null}

        <FormItem key="desc" {...this.formLayout} label="模型描述">
          {form.getFieldDecorator('desc', {
            initialValue: item.desc,
          })(
            <TextArea
              rows={4}
              disabled={this.isUpgrade()}
              placeholder="请输入至少五个字符"
              onChange={e => this.onItemValueChange({ desc: e.target.value })}
            />
          )}
        </FormItem>
      </Form>
    );
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  handleNext = () => {
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const item = this.getModalDataItem();

      if (this.isUpgrade() && item['tableName'] === item['newTableName']) {
        message.error('模型对应的业务表名称没有发生变更,请修改!');
        return;
      }

      this.forward();
    });
  };

  handleSave = () => {
    const { handleUpdate, handleAdd } = this.props;
    const { item, fieldList } = this.state;
    const hasErrorField = fieldList.some(
      item => item.showName == null || item.showName.length === 0
    );
    if (hasErrorField) {
      message.error('存在显示名称为空的记录,请检查!');
      return;
    }
    const params = {
      ...item,
      tableName: this.isUpgrade() ? item.newTableName : item.tableName,
      modelId: item.id,
      fields: fieldList,
    };
    if (this.isEdit() || this.isUpgrade()) {
      handleUpdate(params, this.isUpgrade);
    } else {
      handleAdd(params);
    }
  };

  handleCancel = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible(false);
  };

  renderFooter = currentStep => {
    return (
      <div className={styles.modelOptFormFooter}>
        <Button
          key="back"
          className={(currentStep == 1).toString()}
          style={{ float: 'left' }}
          onClick={this.backward}
        >
          上一步
        </Button>
        <Button key="cancel" className="true" onClick={this.handleCancel}>
          取消
        </Button>
        <Button
          key="forward"
          className={(currentStep == 0).toString()}
          type="primary"
          onClick={this.handleNext}
        >
          下一步
        </Button>
        <Button
          key="save"
          className={(currentStep == 1).toString()}
          type="primary"
          onClick={this.handleSave}
        >
          保存
        </Button>
      </div>
    );
  };

  onFieldPropChange = (record, prop, mapper = e => e) => value => {
    const { fieldList } = this.state;
    const newFields = fieldList.map(item => {
      if (item.name === record.name) {
        item[prop] = mapper(value);
      }
      return item;
    });
    this.setState({
      fieldList: newFields,
    });
  };

  renderFieldStep = () => {
    const { fieldList } = this.state;
    const { tagList, dataTypeList } = this.getModalData();
    const columns = [
      {
        title: '字段名',
        dataIndex: 'name',
        key: 'name',
        width: '35%',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: text => (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>
        ),
      },
      {
        title: '显示名称',
        dataIndex: 'showName',
        key: 'showName',
        width: '25%',
        sorter: (a, b) => a._orderName.localeCompare(b._orderName),
        render: (text, record) => (
          <Input
            value={text}
            onChange={this.onFieldPropChange(record, 'showName', e => e.target.value)}
          />
        ),
      },
      {
        title: '数据类型',
        dataIndex: 'dataType',
        key: 'dataType',
        width: '20%',
        render: (text, record) => (
          <Select
            style={{ width: '100%' }}
            value={text}
            onChange={this.onFieldPropChange(record, 'dataType')}
          >
            {dataTypeList.map(item => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      {
        title: '是否可用',
        dataIndex: 'display',
        key: 'display',
        width: '10%',
        render: (text, record) => (
          <Switch
            checkedChildren="是"
            unCheckedChildren="否"
            checked={text !== 0}
            onChange={this.onFieldPropChange(record, 'display', val => (val ? 1 : 0))}
          />
        ),
      },
      {
        title: '所属标签',
        dataIndex: 'tagId',
        width: '15%',
        render: (text, record) => (
          <Select value={text} onChange={this.onFieldPropChange(record, 'tagId')}>
            {tagList.map(item => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
    ];
    return (
      <Table width="100%" size="small" dataSource={fieldList} columns={columns} rowKey="name" />
    );
  };

  renderTitle = () => {
    if (this.isUpgrade()) {
      return '同步模型';
    }
    if (this.isEdit()) {
      return '修改模型';
    }
    return '新增模型';
  };

  render() {
    const { currentStep } = this.state;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={1000}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={this.renderTitle()}
        visible={true}
        footer={this.renderFooter(currentStep)}
        onCancel={this.handleCancel}
      >
        <Spin spinning={false}>
          <Steps style={{ marginBottom: 15 }} size="small" current={currentStep}>
            <Step title="数据源选择" />
            <Step title={this.isUpgrade() ? '字段同步' : '字段修改'} />
          </Steps>
          <Divider type="horizontal" />
          {currentStep === 0 && this.renderBasicStep()}
          {currentStep === 1 && this.renderFieldStep()}
        </Spin>
      </Modal>
    );
  }
}

export default ModelUpgradeModal;
