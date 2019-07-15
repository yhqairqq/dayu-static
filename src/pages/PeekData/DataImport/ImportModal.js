import React from 'react';
import { connect } from 'dva';
import { Button, Form, Icon, message, Modal, Radio, Select, Spin, Switch, Upload } from 'antd';
import styles from './index.less';

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

const DEFAULT_STATE = {
  file: null,
  datasourceType: 'mysql',
  datasourceId: undefined,
  tableName: undefined,
  overwrited: 0,
  fileName: undefined,
};

/**
 * Author: feixy
 * Date: 2019-07-11
 * Time: 11:36
 */
@Form.create()
@connect(({ model, loading, peek, datasource: { simpleDatasources, tables } }) => ({
  model,
  peek,
  loading: loading.models.model || loading.models.peek || loading.models.datasource,
  simpleDatasources,
  tables,
}))
class ImportModal extends React.Component {
  constructor(props) {
    super(props);
    const { item } = props;
    this.item = item;
    if (this.item.id) {
      const { fileName, datasourceType, datasourceId, tableName, overwrited } = this.item;
      this.state = {
        ...DEFAULT_STATE,
        fileName,
        datasourceType,
        datasourceId,
        tableName,
        overwrited,
      };
    } else {
      this.state = { ...DEFAULT_STATE };
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'datasource/fetchAll',
      callback: datasourceList => {
        const { datasourceType } = this.state;
        const findDataSource = datasourceList.find(
          item => item.useType === 2 && item.type.toLowerCase() === datasourceType
        );
        if (findDataSource) {
          this.onDataSourceChangeEvent(findDataSource.id);
        }
      },
    });
  }

  onImportEvent = () => {
    const { form, dispatch, handleModalVisible } = this.props;
    form.validateFields(err => {
      if (err) {
        return;
      }
      const formData = new FormData();
      const { file, fileName, overwrited, tableName, datasourceId, datasourceType } = this.state;
      formData.append('file', file);
      formData.append('fileName', fileName);
      formData.append('overwrited', overwrited);
      formData.append('tableName', tableName);
      formData.append('datasourceId', datasourceId);
      formData.append('datasourceType', datasourceType);
      dispatch({
        type: 'peek/importData',
        payload: formData,
        callback: () => {
          message.success('数据导入成功');
          handleModalVisible(false, {}, true);
        },
      });
    });
  };

  getUploadProps = () => {
    const { file } = this.state;
    const fileList = file ? [file] : undefined;
    return {
      accept: '.xlsx',
      fileList,
      beforeUpload: newFile => {
        this.setState({
          file: newFile,
          fileName: newFile.name,
        });
        return false;
      },
      onRemove: () => {
        const {
          form: { setFieldsValue },
        } = this.props;
        setFieldsValue({ filePlaceHolder: null });
        this.setState({
          file: undefined,
        });
      },
    };
  };

  onStateChange = (key, mapper = e => e) => value => {
    this.setState({
      [key]: mapper(value),
    });
  };

  onDataSourceChangeEvent = val => {
    const { dispatch } = this.props;
    this.setState({ datasourceId: val }, () => {
      dispatch({
        type: 'datasource/fetchTables',
        payload: val,
      });
    });
  };

  isView = () => {
    const { id } = this.item;
    return !!id;
  };

  render() {
    const {
      form: { getFieldDecorator },
      simpleDatasources = [],
      tables = [],
      loading,
      handleModalVisible,
    } = this.props;

    const { tableName, datasourceType, datasourceId, overwrited, fileName } = this.state;
    const viewHideStyle = this.isView() ? { style: { display: 'none' } } : {}; // 控制组件在查看时隐藏
    const addHideStyle = !this.isView() ? { style: { display: 'none' } } : {}; // 控制组件在新增时隐藏
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={1000}
        okText="导入"
        onOk={this.onImportEvent}
        okButtonProps={viewHideStyle}
        onCancel={() => handleModalVisible()}
        style={{ top: 20 }}
        visible
        title="导入数据"
        className={styles.dataImportModal}
      >
        <Spin spinning={loading} tip="查询中...">
          <div>
            <Form.Item {...formItemLayout} label="数据源类型">
              {getFieldDecorator('datasourceType', {
                initialValue: datasourceType,
              })(
                <Radio.Group
                  disabled={this.isView()}
                  onChange={this.onStateChange('datasourceType', e => e.target.value)}
                >
                  <Radio value="hive" disabled>
                    Hive
                  </Radio>
                  <Radio value="mysql">MySQL</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="选择数据库">
              {getFieldDecorator('datasourceId', {
                rules: [
                  {
                    required: true,
                    message: '请选择数据库',
                  },
                ],
                initialValue: datasourceId,
              })(
                <Select
                  disabled={this.isView()}
                  onChange={this.onDataSourceChangeEvent}
                  style={{ width: '100%' }}
                  placeholder="请选择数据源"
                >
                  {simpleDatasources
                    .filter(item => item.type.toLowerCase() === datasourceType)
                    .map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item {...formItemLayout} label="选择导入表">
              {getFieldDecorator('tableName', {
                rules: [
                  {
                    required: true,
                    message: '请选择导入表',
                  },
                ],
                initialValue: tableName,
              })(
                <Select
                  placeholder="请选择导入表"
                  disabled={!datasourceId || this.isView()}
                  onChange={this.onStateChange('tableName')}
                  style={{ width: '100%' }}
                >
                  {tables.map(item => (
                    <Option value={item.name} key={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item {...formItemLayout} label="是否覆盖原数据">
              {getFieldDecorator('overwrited', {
                valuePropName: 'checked',
                initialValue: overwrited === 1,
              })(
                <Switch
                  disabled={this.isView()}
                  checkedChildren="是"
                  unCheckedChildren="否"
                  onChange={this.onStateChange('overwrited', e => (e ? 1 : 0))}
                />
              )}
            </Form.Item>

            <Form.Item {...formItemLayout} label="上传数据文件" {...addHideStyle}>
              {fileName}
            </Form.Item>
            <Form.Item {...formItemLayout} label="上传数据文件" {...viewHideStyle}>
              {getFieldDecorator('filePlaceHolder', {
                rules: [
                  {
                    required: true,
                    message: '请选择需要上传的数据文件',
                  },
                ],
              })(
                <Upload {...this.getUploadProps()}>
                  <Button size="small">
                    <Icon type="upload" />
                    选择文件
                  </Button>
                </Upload>
              )}
            </Form.Item>
          </div>
        </Spin>
      </Modal>
    );
  }
}

export default ImportModal;
