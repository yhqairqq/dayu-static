import React from 'react';
import { connect } from 'dva';
import {
  Form,
  Button,
  Modal,
  Steps,
  notification,
} from 'antd';

import _ from 'lodash';
import { getRuleByPeekId } from '@/services/peek';
import PreviewDataModal from './PreviewDataModal';
import SelectFieldStep from './SelectFieldStep';
import SelectFilterStep from './SelectFilterStep';
import BasicInfoStep from './BasicInfoStep';

const { Step } = Steps;

@Form.create()
@connect(({ model, peek, loading, tag }) => ({
  model,
  peek,
  tag,
  loading: loading.models.peek,
}))
class PeekOptForm extends React.Component {
  static defaultProps = {
    values: {},
    isEdit: false,
    handleAdd: () => { },
    handleUpdate: () => { },
    handleModalVisible: () => { },
  };

  constructor(props) {
    super(props);
    const {
      values: { id, fields: fieldsTmp, name, modelId },
    } = props;
    let peekId = 0;
    if (id) {
      peekId = id;
    }

    // 切分返回字段
    let fields = [];
    if (fieldsTmp) {
      fields = fieldsTmp.split(',');
    }

    this.state = {
      formVals: {
        peekId,
        name,
        modelId,
        fields,
        rules: [],
      },
      currentStep: 0,
      // 预览相关
      previewDataModalVisable: false,
      previewData: [],
      previewColumns: [],
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { formVals } = this.state;
    // 获取模型的字段列表
    if (formVals.modelId) {
      this.handleModelChange(formVals.modelId);
    }
    if (formVals.peekId !== 0) {
      // 获取已设置规则信息
      getRuleByPeekId(formVals.peekId).then(val => {
        if (val) {
          const { state, data } = val;
          if (state === 0) {
            this.onFormValueChange('rules', data);
          }
        }
      });
    }
    dispatch({
      type: 'peek/getDataTypeRules',
      payload: {},
    });

    dispatch({
      type: 'tag/fetchAll',
      payload: {},
    });
  }

  // 模型选择变更处理
  handleModelChange = value => {
    const { dispatch } = this.props;
    // 获取模型的字段列表
    dispatch({
      type: 'model/fetchModelMeta',
      payload: value,
    });
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

  handleNext = currentStep => {
    const { form, handleUpdate, handleAdd, isEdit } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            const { rules, fields } = formVals;
            let haveErr = false;
            if (rules) {
              const nullRull = rules.filter(r => !r.value || !r.rule);
              haveErr = nullRull.length > 0;
            }
            if (haveErr) {
              notification.error({
                message: '非法的规则',
                description: '有条件为空',
              });
              return;
            }

            formVals.fields = fields.join(',');
            if (isEdit) {
              handleUpdate(formVals);
            } else {
              handleAdd(formVals);
            }
          }
        }
      );
    });
  };

  // 取消处理
  cancelHandle = () => {
    const { handleModalVisible, values, form } = this.props;
    form.resetFields();
    handleModalVisible(false, false, values);
  };

  // 统计条数
  countSizeHandle = () => {
    const { dispatch } = this.props;
    const {
      formVals: { modelId, rules },
    } = this.state;

    dispatch({
      type: 'peek/countSize',
      payload: {
        modelId,
        rules,
      },
      callback: size => {
        Modal.success({
          title: '统计数据',
          content: `根据规则查询出数据条数：${size}`,
        });
      },
    });
  };

  // 预览数据
  previewDataHandle = () => {
    const { dispatch } = this.props;
    const {
      formVals: { modelId, fields: fieldArr, rules },
    } = this.state;

    let fields = '';
    if (fieldArr) {
      fields = fieldArr.join(',');
    }
    dispatch({
      type: 'peek/previewData',
      payload: {
        modelId,
        fields,
        rules,
      },
      callback: data => {
        if (data && data.rowSize > 0) {
          const columns = [];
          const { columns: oldColumns, showNameOfColumns, rows } = data;
          for (let i = 0; i < oldColumns.length; i += 1) {
            const tmp = oldColumns[i];
            columns.push({
              title: showNameOfColumns[tmp],
              dataIndex: tmp,
              key: tmp,
            });
          }
          this.setState({
            previewColumns: columns,
            previewData: rows,
            previewDataModalVisable: true,
          });
        }
      },
    });
  };

  handlePreviewDataModalVisable = () => {
    this.setState({
      previewDataModalVisable: false,
    });
  };

  // 底部按钮
  renderFooter = currentStep => {
    const item = [];
    if (currentStep > 0) {
      item.push(
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>
      );
    }
    if (currentStep === 2) {
      item.push(
        <div style={{ display: 'inline', marginRight: 40 }}>
          <Button key="static" onClick={() => this.countSizeHandle()}>
            统计数据
          </Button>
          <Button key="preview" onClick={() => this.previewDataHandle()}>
            预览
          </Button>
        </div>
      );
    }
    item.push(
      <Button key="cancel" onClick={() => this.cancelHandle()}>
        取消
      </Button>
    );
    item.push(
      <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
        {currentStep !== 2 ? '下一步' : '保存'}
      </Button>
    );
    return item;
  };

  onFormValueChange = (key, value) => {
    const { formVals: oldVals } = this.state;
    this.setState({
      formVals: {
        ...oldVals,
        [key]: value,
      },
    });
    if (key === 'modelId') {
      this.handleModelChange(value);
    }
  };

  renderContent = (currentStep, formVals) => {
    const {
      form,
      model: { allModels, modelMetas },
      peek: { dataTypeRules },
    } = this.props;

    const tagList = [{ id: -1, name: '全部' }, ...this.props.tag.tagList];
    const { fields, rules } = formVals;
    switch (currentStep) {
      case 1:
        return (
          <SelectFieldStep
            selectedFields={fields}
            formLayout={this.formLayout}
            tagList={tagList}
            modelMetas={modelMetas}
            onFormValueChange={this.onFormValueChange}
          />
        );
      case 2:
        return (
          <SelectFilterStep
            tagList={tagList}
            onFormValueChange={this.onFormValueChange}
            modelMetas={modelMetas}
            rules={rules}
            dataTypeRules={dataTypeRules}
          />
        );
      default:
        return (
          <BasicInfoStep
            form={form}
            formLayout={this.formLayout}
            allModels={allModels}
            onFormValueChange={this.onFormValueChange}
            formVals={formVals}
          />
        );
    }
  };

  render() {
    const { isEdit, handleModalVisible, values, modalVisible } = this.props;
    const {
      currentStep,
      formVals,
      previewData,
      previewColumns,
      previewDataModalVisable,
    } = this.state;

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={940}
        visible={modalVisible}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={isEdit ? '修改取数' : '新增取数'}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleModalVisible(false, false, values)}
        afterClose={() => handleModalVisible()}
      >
        <Steps style={{ marginBottom: 15 }} size="small" current={currentStep}>
          <Step title="基本信息设置" />
          <Step title="选择返回字段" />
          <Step title="设置筛选条件" />
        </Steps>
        {this.renderContent(currentStep, formVals)}
        <PreviewDataModal
          data={previewData}
          modalVisible={previewDataModalVisable}
          handleModalVisible={() => this.handlePreviewDataModalVisable()}
          columns={previewColumns}
        />
      </Modal>
    );
  }
}

export default PeekOptForm;
