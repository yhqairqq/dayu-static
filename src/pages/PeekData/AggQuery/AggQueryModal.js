import React from 'react';
import { connect } from 'dva';
import { Button, Card, Form, Input, message, Modal, notification, Select, Spin, Icon } from 'antd';
import styles from './index.less';
import FieldPane from './FieldPane';
import RulePane from './RulePane';
import SqlPane from './SqlPane';
import PreviewDataModal from '../form/PreviewDataModal';

/**
 * Author: feixy
 * Date: 2019-07-04
 * Time: 14:02
 */

const FormItem = Form.Item;
const SelectOption = Select.Option;

const DEFAULT_STATE = {
  id: undefined,
  name: undefined,
  modelId: undefined,
  modelObj: undefined,
  modelMetaList: [],
  fieldList: [],
  selectedTagInFieldPane: -1,
  selectedList: [],
  paneKey: 'fieldPane',
  ruleList: [],
  previewModalVisible: false,
  previewColumns: [],
  previewData: [],
  showSqlTipIcon: false,
};
@Form.create()
@connect(({ user, loading, tag, model, peek }) => ({
  user,
  tag,
  peek,
  model,
  loading: loading.models.tag || loading.models.peek,
}))
class AggQueryModal extends React.Component {
  constructor(props) {
    super(props);
    const { item = {} } = this.props;
    const { modelId, id, name } = item;
    this.state = { ...DEFAULT_STATE, id, name, modelId };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'tag/fetchAll',
    });

    dispatch({
      type: 'peek/getDataTypeRules',
      payload: {},
    });

    const { id } = this.state;
    if (id) {
      this.initPage(id);
    }
  }

  onTabChange = (key, prop) => {
    const param = { [prop]: key };
    if (key === 'sqlPane') {
      param.showSqlTipIcon = false;
    }

    this.setState({ ...param });
  };

  onModelChange = modelId => {
    const { dispatch, model } = this.props;
    const { allModels } = model;
    const modelObj = allModels.find(item => item.id === modelId);
    this.setState(
      {
        modelId,
        modelObj,
        selectedTagInFieldPane: -1,
      },
      () => {
        dispatch({
          type: 'model/fetchModelMeta',
          payload: modelId,
          callback: this.processData,
        });
      }
    );
  };

  initPage = peekId => {
    const { dispatch } = this.props;
    const { modelId } = this.state;
    dispatch({
      type: 'peek/queryExistedRuleAndFieldList',
      payload: peekId,
      callback: ({ fieldList, ruleList }) => {
        this.setState(
          {
            selectedList: fieldList,
            ruleList,
          },
          () => {
            this.onModelChange(modelId);
          }
        );
      },
    });
  };

  createField = meta => {
    const { id, selectedList = [] } = this.state;
    const metaObj = selectedList.find(item => item.metaId === meta.id) || {};
    return {
      id: undefined,
      peekId: id,
      aggExpression: metaObj.aggExpression,
      format: undefined,
      showName: meta.showName,
      name: meta.name,
      dataType: meta.dataType,
      metaId: meta.id,
      tagId: meta.tagId,
      remark: meta.remark,
    };
  };

  processData = modelMetaList => {
    const fieldList = [];
    modelMetaList.forEach(meta => {
      fieldList.push(this.createField(meta));
    });
    this.setState({
      fieldList,
      modelMetaList,
    });
  };

  onStateChange = params => {
    this.setState({
      ...params,
    });
  };

  renderForm = () => {
    const { model, form } = this.props;
    const { allModels = [] } = model;
    const { name, modelId } = this.state;
    return (
      <div>
        <Form layout="inline">
          <FormItem label="模型">
            {form.getFieldDecorator('modelId', {
              rules: [{ required: true, message: '请选择模型!' }],
              initialValue: modelId,
            })(
              <Select
                placeholder="请选择模型"
                onChange={this.onModelChange}
                style={{ width: '180px' }}
                disabled={this.isEdit()}
              >
                {allModels.map(item => (
                  <SelectOption key={item.id} value={item.id}>
                    {item.name}
                  </SelectOption>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="取数名称">
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入取数名称！' }],
              initialValue: name,
            })(
              <Input
                placeholder="请输入取数名称"
                disabled={this.isEdit()}
                onChange={e => this.onStateChange({ name: e.target.value })}
              />
            )}
          </FormItem>
        </Form>
      </div>
    );
  };

  onPreviewDataEvent = () => {
    const { dispatch } = this.props;
    const { modelId, selectedList, ruleList } = this.state;
    if (!selectedList || selectedList.length === 0) {
      message.error('请至少选择一个字段再执行预览操作');
      return;
    }
    dispatch({
      type: 'peek/previewData',
      payload: {
        modelId,
        fieldList: selectedList,
        rules: ruleList,
      },
      callback: data => {
        if (data) {
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
            previewModalVisible: true,
          });
        }
      },
    });
  };

  handlePreviewModalVisible = () => {
    this.setState({
      previewModalVisible: false,
      previewData: [],
      previewColumns: [],
    });
  };

  onCancelEvent = (visible, reload = false) => {
    const { handleModalVisible } = this.props;
    handleModalVisible(false, {}, reload);
  };

  onSaveEvent = () => {
    const {
      form,
      peek: { dataTypeRules },
      dispatch,
    } = this.props;
    const { selectedList = [], ruleList = [], modelMetaList, modelId, id, name } = this.state;
    form.validateFields(err => {
      if (err) {
        return;
      }
      if (selectedList.length === 0) {
        message.error('请选择至少一个取数字段!');
        return;
      }
      if (ruleList.length > 0) {
        const ruleObj = {};
        Object.keys(dataTypeRules).forEach(key => {
          dataTypeRules[key].forEach(rule => {
            ruleObj[rule.value] = rule.label;
          });
        });

        const metaObj = {};
        modelMetaList.forEach(meta => {
          metaObj[meta.id] = meta;
        });
        const cacheObj = {};
        let hasError = false;
        let errorText = '';
        let msg = '';
        ruleList.forEach(ruleItem => {
          if (hasError) {
            return;
          }
          if (!ruleItem.metaId || !ruleItem.rule || !ruleItem.value) {
            hasError = true;
            errorText = `有条件为空`;
            msg = '非法的规则';
            return;
          }
          const ruleKey = `${ruleItem.metaId}-${ruleItem.rule}`;
          if (cacheObj[ruleKey]) {
            hasError = true;
            errorText = `${metaObj[ruleItem.metaId].showName} ${ruleObj[ruleItem.rule]} ${
              ruleItem.value
            }`;
            msg = '规则已存在';
          } else {
            cacheObj[ruleKey] = true;
          }
        });

        if (hasError) {
          notification.error({
            message: msg,
            description: errorText,
          });
          return;
        }
      }

      dispatch({
        type: 'peek/saveQuery',
        payload: {
          peekId: id,
          name,
          modelId,
          fieldList: selectedList,
          rules: ruleList,
        },
        callback: () => {
          message.success('保存取数配置成功');
          this.onCancelEvent(false, true);
        },
      });
    });
  };

  renderPane = () => {
    const {
      fieldList,
      selectedList,
      ruleList,
      modelMetaList,
      selectedTagInFieldPane,
      paneKey,
      modelObj,
    } = this.state;
    let PaneComponent = null;
    const params = {};
    const {
      tag: { tagList },
      peek: { dataTypeRules },
    } = this.props;

    params.onParentStateChange = (param, showSqlTip = true) =>
      this.onStateChange(showSqlTip ? { ...param, showSqlTipIcon: true } : param);
    params.isEdit = this.isEdit();
    params.tagList = [{ id: -1, name: '全部' }, ...(tagList || [])];
    if (paneKey === 'fieldPane') {
      PaneComponent = FieldPane;
      params.dataList = fieldList;
      params.selectedList = selectedList;
      params.selectedTagInFieldPane = selectedTagInFieldPane;
    } else if (paneKey === 'rulePane') {
      PaneComponent = RulePane;
      params.ruleList = ruleList;
      params.modelMetaList = modelMetaList;
      params.dataTypeRules = dataTypeRules;
    } else {
      PaneComponent = SqlPane;
      params.selectedList = selectedList;
      params.ruleList = ruleList;
      params.modelObj = modelObj;
      params.modelMetaList = modelMetaList;
    }

    return <PaneComponent {...params} />;
  };

  getTabList = () => {
    const { showSqlTipIcon } = this.state;
    const tabList = [
      {
        key: 'fieldPane',
        tab: '查看字段',
      },
      {
        key: 'rulePane',
        tab: '过滤',
      },
      {
        key: 'sqlPane',
        tab: (
          <div>
            SQL
            {showSqlTipIcon ? (
              <Icon type="info-circle" style={{ float: 'right', fontSize: '1px', color: 'red' }} />
            ) : null}
          </div>
        ),
      },
    ];
    return tabList;
  };

  renderContentPane = () => {
    const { paneKey } = this.state;
    return (
      <Card
        className={styles.paneList}
        style={{ width: '100%' }}
        activeTabKey={paneKey}
        tabList={this.getTabList()}
        onTabChange={key => {
          this.onTabChange(key, 'paneKey');
        }}
      >
        {this.renderPane()}
      </Card>
    );
  };

  renderFooter = () => {
    return (
      <div className={styles.footer}>
        <Button key="preview" onClick={this.onPreviewDataEvent}>
          预览
        </Button>
        <Button key="cancel" onClick={this.onCancelEvent}>
          取消
        </Button>
        <Button key="submit" type="primary" onClick={this.onSaveEvent}>
          保存
        </Button>
      </div>
    );
  };

  isEdit = () => {
    const { id } = this.state;
    return !!id;
  };

  renderPreviewDataModal = () => {
    const { previewModalVisible, previewData, previewColumns } = this.state;
    if (!previewModalVisible) {
      return null;
    }

    return (
      <PreviewDataModal
        data={previewData}
        modalVisible={previewModalVisible}
        handleModalVisible={this.handlePreviewModalVisible}
        columns={previewColumns}
      />
    );
  };

  render() {
    const { loading = false } = this.props;
    return (
      <Modal
        destroyOnClose
        style={{ top: 20 }}
        width={900}
        visible
        title={this.isEdit() ? '编辑取数' : '新增取数'}
        footer={this.renderFooter()}
        onCancel={this.onCancelEvent}
        confirmLoading={loading}
        className={styles.aggQueryModel}
        maskClosable={false}
      >
        <Spin spinning={loading} tip="查询数据中...">
          {this.renderForm()}
          {this.renderContentPane()}
          {this.renderPreviewDataModal()}
        </Spin>
      </Modal>
    );
  }
}

export default AggQueryModal;
