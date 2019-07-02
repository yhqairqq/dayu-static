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
import styles from '../PeekData.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

@Form.create()
@connect(({ model, datasource, tag, loading }) => ({
  model,
  datasource,
  tag,
  dsLoading: loading.models.datasource,
  tagLoading: loading.models.tag,
  modelLoading: loading.models.model,
}))
class ModelOptForm extends React.Component {
  static defaultProps = {
    record: {},
    handleAdd: () => {},
    handleUpdate: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    const { record } = props;
    this.state = {
      formVals: {
        modelId: record.id,
        name: record.name,
        datasourceId: record.datasourceId,
        tableName: record.tableName,
        desc: record.desc,
        fields: [],
      },
      currentStep: 0,
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  // 在render()方法之后立即执行
  componentDidMount() {
    const { dispatch } = this.props;
    const { formVals } = this.state;

    dispatch({
      type: 'datasource/fetchAll',
    });
    // 拉取字段类型
    dispatch({
      type: 'datasource/getDataTypes',
    });
    // 拉取字段类型
    dispatch({
      type: 'tag/fetchAll',
    });

    // 拉取已设置的字段信息
    if (formVals.tableName) {
      this.handleTableChange(formVals.tableName);
    }
  }

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
      const { formVals } = this.state;
      this.setState({
        formVals: {
          ...formVals,
          ...fieldsValue,
        },
      });
      this.forward();
    });
  };

  handleSave = () => {
    const { form, handleUpdate, handleAdd } = this.props;
    const { formVals } = this.state;
    const { fields } = formVals;

    const hasErrorField = fields.some(item => item.showName == null || item.showName.length === 0);
    if (hasErrorField) {
      message.error('存在显示名称为空的记录,请检查!');
      return;
    }

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const newFormValues = { ...formVals, ...fieldsValue, fields };
      this.setState({
        formVals: newFormValues,
      });
      if (newFormValues.modelId) {
        handleUpdate(newFormValues);
      } else {
        handleAdd(newFormValues);
      }
    });
  };

  // 取消处理
  cancelHandle = () => {
    const { handleModalVisible, values, form } = this.props;
    form.resetFields();
    handleModalVisible(false, false, values);
  };

  // 处理数据源变更操作
  handleDtChange = value => {
    const { dispatch } = this.props;
    const { formVals } = this.state;
    formVals.datasourceId = value;
    this.setState({
      formVals,
    });
    dispatch({
      type: 'datasource/fetchTables',
      payload: value,
    });
  };

  // 处理数据表变更操作
  handleTableChange = value => {
    const { dispatch } = this.props;
    const { formVals } = this.state;
    const newFormValus = {
      ...formVals,
      fields: [],
      schemaList: [],
    };
    this.setState(
      {
        formVals: newFormValus,
      },
      () => {
        dispatch({
          type: 'model/getColumnsAndSchemas',
          payload: {
            modelId: newFormValus.modelId,
            tableName: value,
            datasourceId: newFormValus.datasourceId,
          },
          callback: data => {
            const { fields = [], schemas = [] } = data;
            const { tag } = this.props;
            const { tagList } = tag;
            this.setState({
              formVals: {
                ...newFormValus,
                fields: this.processData(fields, schemas, tagList),
              },
            });
          },
        });
      }
    );
  };

  processData = (fields, schemaList) => {
    const { tagList } = this.getModalData();
    const { formVals } = this.state;
    const isEdit = !!formVals.modelId;
    // 匹配标签
    const DEFAULT_TAG = tagList.find(item => item.defaulted === 1);
    const schemaMap = schemaList.reduce((a, b) => {
      const obj = { ...a };
      obj[b.fieldName] = b;
      return obj;
    }, {});
    return fields.map(item => {
      const obj = { ...item };
      if (!isEdit) {
        const findTag = tagList.find(tag => item.name.startsWith(tag.rule)) || DEFAULT_TAG;
        obj.tagId = findTag.id;
        const schema = schemaMap[item.name] || {};
        obj.showName = schema.comments || '';
      }
      obj.orderName = item.showName;
      return obj;
    });
  };

  onFieldPropChange = (record, prop, mapper = e => e) => value => {
    const { formVals } = this.state;
    const { fields = [] } = formVals;
    const newFields = fields.map(item => {
      const obj = { ...item };
      if (item.name === record.name) {
        obj[prop] = mapper(value);
      }
      return obj;
    });
    this.setState({
      formVals: {
        ...formVals,
        fields: newFields,
      },
    });
  };

  // 底部按钮
  renderFooter = currentStep => {
    return (
      <div className={styles.modelOptFormFooter}>
        <Button
          key="back"
          className={(currentStep === 1).toString()}
          style={{ float: 'left' }}
          onClick={this.backward}
        >
          上一步
        </Button>
        <Button key="cancel" className="true" onClick={() => this.cancelHandle()}>
          取消
        </Button>
        <Button
          key="forward"
          className={(currentStep === 0).toString()}
          type="primary"
          onClick={() => this.handleNext(currentStep)}
        >
          下一步
        </Button>
        <Button
          key="save"
          className={(currentStep === 1).toString()}
          type="primary"
          onClick={() => this.handleSave()}
        >
          保存
        </Button>
      </div>
    );
  };

  renderChooseDsStep = () => {
    const {
      form,
      datasource: { simpleDatasources, tables },
    } = this.props;
    const { formVals } = this.state;
    return [
      <FormItem key="name" {...this.formLayout} label="模型名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入模型名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入模型名称" />)}
      </FormItem>,
      <FormItem key="datasourceId" {...this.formLayout} label="数据源">
        {form.getFieldDecorator('datasourceId', {
          rules: [{ required: true, message: '请选择数据源' }],
          initialValue: formVals.datasourceId,
        })(
          <Select
            placeholder="请选择数据源"
            style={{ width: '100%' }}
            disabled={!!formVals.modelId}
            onChange={value => this.handleDtChange(value)}
          >
            {simpleDatasources.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>,
      <FormItem key="tableName" {...this.formLayout} label="业务表">
        {form.getFieldDecorator('tableName', {
          rules: [{ required: true, message: '请选择业务表' }],
          initialValue: formVals.tableName,
        })(
          <Select
            placeholder="请选择业务表"
            style={{ width: '100%' }}
            disabled={!!formVals.modelId}
            onChange={value => this.handleTableChange(value)}
          >
            {tables &&
              tables.map(item => (
                <Option key={item.name} value={item.name}>
                  {item.name}
                </Option>
              ))}
          </Select>
        )}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="模型描述">
        {form.getFieldDecorator('desc', {
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      </FormItem>,
    ];
  };

  renderFieldStep = () => {
    const {
      formVals: { fields },
    } = this.state;
    const { datasource, tag } = this.props;
    const { dataTypes } = datasource;
    const { tagList } = tag;
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
        sorter: (a, b) => a.orderName.localeCompare(b.orderName),
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
            {dataTypes.map(item => (
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
    return [
      <Divider type="horizontal" />,
      <Table width="100%" size="small" dataSource={fields} columns={columns} rowKey="name" />,
    ];
  };

  render() {
    const {
      modalVisible,
      handleModalVisible,
      record,
      dsLoading,
      tagLoading,
      modelLoading,
    } = this.props;
    const { currentStep } = this.state;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={1000}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={record.id ? '修改模型' : '新增模型'}
        visible={modalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleModalVisible(false, false, record)}
        afterClose={() => handleModalVisible()}
      >
        <Spin spinning={dsLoading || modelLoading || tagLoading}>
          <Steps style={{ marginBottom: 15 }} size="small" current={currentStep}>
            <Step title="数据源选择" />
            <Step title="字段修改" />
          </Steps>
          {currentStep === 0 && this.renderChooseDsStep()}
          {currentStep === 1 && this.renderFieldStep()}
        </Spin>
      </Modal>
    );
  }
}

export default ModelOptForm;
