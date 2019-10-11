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
const DATE_REG = {
  datetime: /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/,
  date: /\d{4}-\d{2}-\d{2}/,
  time: /\d{2}:\d{2}:\d{2}/,
};

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
  tagIdMapper: {},
};
@Form.create()
@connect(({ user, loading, tag, model, peek }) => ({
  user,
  tag,
  peek,
  model,
  loading: loading.models.tag || loading.models.peek || loading.models.model,
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
        tagIdMapper: {},
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
      metaShowName: meta.showName,
      metaName: meta.name,
      dataType: meta.dataType,
      originDataType: meta.originDataType,
      metaId: meta.id,
      tagId: meta.tagId,
      remark: meta.remark,
      alias: metaObj.alias,
    };
  };

  processData = modelMetaList => {
    const fieldList = [];
    const tagIdMapper = {};
    modelMetaList.forEach(meta => {
      fieldList.push(this.createField(meta));
      tagIdMapper[meta.tagId] = true;
    });
    this.setState({
      fieldList,
      modelMetaList,
      tagIdMapper,
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

    if (!this.checkRule()) {
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
    const { form, dispatch } = this.props;
    const { selectedList = [], ruleList = [], modelId, id, name } = this.state;
    form.validateFields(err => {
      if (err) {
        return;
      }
      if (selectedList.length === 0) {
        message.error('请选择至少一个取数字段!');
        return;
      }
      if (this.checkRule()) {
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
      }
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
      tagIdMapper,
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
    params.tagList = [{ id: -1, name: '全部' }, ...(tagList || [])].filter(
      tag => tag.id === -1 || tagIdMapper[tag.id]
    );

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
        tab: (
          <span>
            <Icon type="database" />
            查看字段
          </span>
        ),
      },
      {
        key: 'rulePane',
        tab: (
          <span>
            <Icon type="filter" />
            过滤
          </span>
        ),
      },
      {
        key: 'sqlPane',
        tab: (
          <div>
            <Icon type="file-text" />
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
          查看结果
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

  checkRule() {
    const { modelMetaList, ruleList = [] } = this.state;
    if (ruleList.length === 0) {
      return true;
    }
    const {
      peek: { dataTypeRules },
    } = this.props;

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
      const modelMeta = metaObj[ruleItem.metaId];
      const { showName, dataType } = modelMeta;
      if (cacheObj[ruleKey]) {
        hasError = true;
        errorText = `${showName} ${ruleObj[ruleItem.rule]} ${ruleItem.value}`;
        msg = '规则已存在';
      } else {
        cacheObj[ruleKey] = true;
        if (dataType) {
          const reg = DATE_REG[dataType.toLowerCase()];
          if (reg && !reg.test(ruleItem.value)) {
            hasError = true;
            errorText = `${showName} ${ruleObj[ruleItem.rule]} ${ruleItem.value}`;
            msg = '错误的日期格式';
          }
        }
      }
    });

    if (hasError) {
      notification.error({
        message: msg,
        description: errorText,
      });
      return false;
    }
    return true;
  }

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
        width={1100}
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
