import React from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Modal,
  TreeSelect,
  Select,
  Radio,
  Switch,
  Icon,
  Divider,
  Descriptions,
  Button,
} from 'antd';
import { formatGroupDbAddress } from '@/utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@Form.create()
@connect(({ canal, zookeeper, loading }) => ({
  canal,
  zookeeper,
  loading: loading.models.canal,
}))
class CanalForm extends React.Component {
  static defaultProps = {
    values: {},
    isEdit: false,

    handleAdd: () => {},
    handleUpdate: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    const { values, isEdit } = props;
    this.state = {
      positionVisible: 'none',
      otherParamsVisible: 'none',
      binlogVisible: false,
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const { dispatch, isEdit } = this.props;

    dispatch({
      type: 'zookeeper/getZookeepers',
    });
    dispatch({
      type: 'mediasource/fetchAll',
      callback: data => {
        this.setState({
          datasources: data.filter(item => item.type == 'MYSQL'),
        });
      },
    });
  }
  otherParamsShow = () => {
    const { otherParamsVisible } = this.state;

    this.setState({
      otherParamsVisible: otherParamsVisible == 'none' ? 'block' : 'none',
    });
  };
  binlogShow = () => {
    const { form, dispatch } = this.props;
    const { binlogVisible } = this.state;
    console.log(form.getFieldsValue());
    let values = form.getFieldsValue();
    if (!binlogVisible) {
      dispatch({
        type: 'valid/binlogList',
        payload: {
          username: values.dbUsername,
          password: values.dbPassword,
          url: values.groupDbAddresses,
        },
        callback: data => {
          this.setState({
            binlogList: data.split(','),
            binlogVisible: !binlogVisible,
          });
          console.log(data);
        },
      });
    } else {
      this.setState({
        binlogVisible: !binlogVisible,
      });
    }
  };

  positionShow = () => {
    const { positionVisible } = this.state;

    this.setState({
      positionVisible: positionVisible == 'none' ? 'block' : 'none',
    });
  };
  okHandle = () => {
    const { values, isEdit = false, form, handleAdd, handleUpdate } = this.props;
    const { isHand, sourceId, type } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();

      if (isEdit) {
        handleUpdate({
          id: values.id,
          ...fieldsValue,
        });
      } else {
        handleAdd({
          ...fieldsValue,
        });
      }
    });
  };

  checkBinloglist = () => {
    const { form, dispatch } = this.props;
    console.log(form.getFieldsValue());
    let values = form.getFieldsValue();
    dispatch({
      type: 'valid/binlogList',
      payload: {
        username: values.dbUsername,
        password: values.dbPassword,
        url: values.groupDbAddresses,
      },
      callback: data => {
        this.setState({
          binlogList: data.split(','),
        });
        console.log(data);
      },
    });
  };
  datasourceHandleChange = value => {
    const { datasources } = this.state;

    let selectedSources = [];

    if (value.length > 0 && datasources && datasources.length > 0) {
      for (let s = 0; s < value.length; s++) {
        for (let d = 0; d < datasources.length; d++) {
          if (value[s] == datasources[d].id) {
            selectedSources.push(datasources[d]);
          }
        }
      }
      this.setState({
        selectedSources,
      });
    }
  };

  render() {
    const {
      isHand,
      positionVisible,
      otherParamsVisible,
      binlogList,
      datasources,
      selectedSources,
      binlogVisible,
    } = this.state;
    const {
      isEdit,
      modalVisible,
      handleModalVisible,
      form,
      values,
      zookeeper: { zookeepers },

      confirmLoading,
      //   group: { trees },
      //   report: { types },
    } = this.props;
    const canalParameter = values.canalParameter || {};

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={window.innerWidth / 2}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 10px' }}
        title={isEdit ? '修改canal信息' : '新增canal信息'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle}
        confirmLoading={confirmLoading}
      >
        <FormItem key="name" {...this.formLayout} label="canal名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入canal名称' }],
            initialValue: values.name,
          })(<Input placeholder="请输入canal名称" />)}
        </FormItem>

        <FormItem key="runMode" {...this.formLayout} label="数据源类型">
          {form.getFieldDecorator('runMode', {
            initialValue: canalParameter.runMode || 'EMBEDDED',
          })(
            <Radio.Group>
              <Radio.Button value="EMBEDDED">嵌入</Radio.Button>
              <Radio.Button value="SERVICE">独立</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>

        <FormItem key="autoKeeperClusterId" {...this.formLayout} label="zookeeper集群">
          {form.getFieldDecorator('zkClusterId', {
            rules: [{ required: true, message: 'zookeeper集群' }],
            initialValue: canalParameter.zkClusterId,
          })(
            <Select style={{ width: 300 }} mode="single" placeholder="请选择zookeeper集群">
              {zookeepers &&
                zookeepers.map(t => (
                  <Option key={t.id} value={t.id}>
                    {t.clusterName}
                  </Option>
                ))}
            </Select>
          )}
        </FormItem>
        <FormItem key="sourcingType" {...this.formLayout} label="数据源类型">
          {form.getFieldDecorator('sourcingType', {
            initialValue: canalParameter.sourcingType || 'MYSQL',
          })(
            <Radio.Group>
              <Radio.Button value="MYSQL">mysql</Radio.Button>
              <Radio.Button value="LOCALBINLOG">localbinlog</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="sourceId" {...this.formLayout} label="选择数据源">
          {form.getFieldDecorator('sourceId', {
            rules: [{ required: true, message: '' }],
            initialValue: selectedSources && selectedSources.map(source => source.id),
          })(
            <Select
              style={{ width: 300 }}
              mode="multiple"
              placeholder="请选择数据源"
              onChange={this.datasourceHandleChange}
            >
              {datasources &&
                datasources.map(t => (
                  <Option key={t.id} value={t.id}>
                    {t.id}-{t.name}-{t.url}
                  </Option>
                ))}
            </Select>
          )}
        </FormItem>
        <FormItem
          style={{
            display: selectedSources && selectedSources.length > 0 ? 'block' : 'none',
          }}
          key="groupDbAddresses"
          {...this.formLayout}
          label="数据库地址"
        >
          {form.getFieldDecorator('groupDbAddresses', {
            rules: [{ required: true, message: '请数据库地址' }],
            initialValue: isEdit
              ? formatGroupDbAddress(canalParameter.groupDbAddresses)
              : selectedSources &&
                selectedSources
                  .map(source => {
                    if (source.url) {
                      let start = source.url.lastIndexOf('/') + 1;
                      return source.url.substring(start) + ';';
                    } else {
                      return source.url;
                    }
                  })
                  .reduce((prev, val) => prev + val),
          })(
            <Input.TextArea
              autosize={{ minRows: 8 }}
              placeholder="127.0.0.1:3306;(必须以分号结束，可添多个 "
            />
          )}
        </FormItem>
        <FormItem
          style={{
            display: selectedSources && selectedSources.length > 0 ? 'block' : 'none',
          }}
          key="dbUsername"
          {...this.formLayout}
          label="数据库帐号"
        >
          {form.getFieldDecorator('dbUsername', {
            rules: [{ required: true, message: '请输入数据库帐号' }],
            initialValue: isEdit
              ? canalParameter.dbUsername
              : selectedSources && selectedSources.length > 0 && selectedSources[0].username,
          })(<Input disabled placeholder="sync" />)}
        </FormItem>
        <FormItem
          style={{
            display: selectedSources && selectedSources.length > 0 ? 'block' : 'none',
          }}
          key="dbPassword"
          {...this.formLayout}
          label="数据库密码"
        >
          {form.getFieldDecorator('dbPassword', {
            rules: [{ required: true, message: '请输入数据库密码' }],
            initialValue: isEdit
              ? canalParameter.dbPassword
              : selectedSources && selectedSources.length > 0 && selectedSources[0].password,
          })(<Input disabled placeholder="NuhEL2@p90BT" />)}
        </FormItem>
        <FormItem
          style={{
            display: selectedSources && selectedSources.length > 0 ? 'block' : 'none',
          }}
          {...this.formLayout}
          label="显示binlog列表"
        >
          <Switch
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
            onChange={this.binlogShow}
          />
          <span></span>
        </FormItem>
        <div
          style={{
            textAlign: 'center',
            color: 'red',
          }}
        >
          {binlogVisible && binlogList && binlogList.map(item => <div>{item}</div>)}
        </div>
        {/* <FormItem key="binlogList" {...this.formLayout} label="binlog列表">
          <Button size="small" type="primary" onClick={this.checkBinloglist}>显示</Button>
        </FormItem> */}

        <FormItem key="connectionCharset" {...this.formLayout} label="connectionCharset">
          {form.getFieldDecorator('connectionCharset', {
            rules: [{ required: true, message: '' }],
            initialValue: canalParameter.connectionCharset || 'UTF-8',
          })(<Input disabled placeholder="" />)}
        </FormItem>

        <FormItem {...this.formLayout} label="位点自定义设置">
          <Switch
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
            onChange={this.positionShow}
          />
        </FormItem>
        {
          <FormItem
            style={{
              display: positionVisible,
            }}
            key="positions"
            {...this.formLayout}
            label="位点信息"
          >
            {form.getFieldDecorator('positions', {
              rules: [{ required: false, message: '位点信息' }],
              initialValue: canalParameter.positions,
            })(<Input.TextArea autosize={{ minRows: 6 }} placeholder="" />)}
          </FormItem>
        }

        <FormItem key="gtidEnable" {...this.formLayout} label="是否启用gtid位点">
          {form.getFieldDecorator('gtidEnable', {
            initialValue: canalParameter.gtidEnable || false,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="tsdbEnable" {...this.formLayout} label="是否开启表结构TSDB">
          {form.getFieldDecorator('tsdbEnable', {
            initialValue: canalParameter.tsdbEnable || false,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="rdsAccesskey" {...this.formLayout} label="rds accesskey">
          {form.getFieldDecorator('rdsAccesskey', {
            rules: [{ required: false, message: '请输入rds accesskey' }],
            initialValue: canalParameter.rdsAccesskey,
          })(<Input placeholder="accesskey" />)}
        </FormItem>
        <FormItem key="rdsSecretkey" {...this.formLayout} label="rds secretkey">
          {form.getFieldDecorator('rdsSecretkey', {
            rules: [{ required: false, message: '请输入rds secretkey' }],
            initialValue: canalParameter.rdsSecretkey,
          })(<Input placeholder="secretkey" />)}
        </FormItem>
        <FormItem key="rdsInstanceId" {...this.formLayout} label="rds instanceId">
          {form.getFieldDecorator('rdsInstanceId', {
            rules: [{ required: false, message: 'rds instanceId' }],
            initialValue: canalParameter.rdsInstanceId,
          })(<Input placeholder="instanceId" />)}
        </FormItem>
        <Divider dashed />
        <FormItem key="storageMode" {...this.formLayout} label="存储机制">
          {form.getFieldDecorator('storageMode', {
            initialValue: canalParameter.storageMode || 'MEMORY',
          })(
            <Radio.Group>
              <Radio.Button value="MEMORY">memory</Radio.Button>
              <Radio.Button value="FILE">file</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="storageBatchMode" {...this.formLayout} label="存储batch获取模式">
          {form.getFieldDecorator('storageBatchMode', {
            initialValue: canalParameter.storageBatchMode || 'MEMSIZE',
          })(
            <Radio.Group>
              <Radio.Button value="MEMSIZE">MEMSIZE</Radio.Button>
              <Radio.Button value="ITEMSIZE">ITEMSIZE</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>

        <p>MEMSIZE模式 内存大小计算 = 记录数 * 记录单元大小 </p>
        <FormItem key="memoryStorageBufferSize" {...this.formLayout} label="存储buffer记录数">
          {form.getFieldDecorator('memoryStorageBufferSize', {
            rules: [{ required: true, message: '存储buffer记录数' }],
            initialValue: canalParameter.memoryStorageBufferSize || 32768,
          })(<Input placeholder="" />)}
        </FormItem>
        <FormItem key="memoryStorageBufferMemUnit" {...this.formLayout} label="buffer记录单元大小">
          {form.getFieldDecorator('memoryStorageBufferMemUnit', {
            rules: [{ required: true, message: 'buffer记录单元大小' }],
            initialValue: canalParameter.memoryStorageBufferMemUnit || 1024,
          })(<Input placeholder="" />)}
        </FormItem>
        <Divider dashed />
        <FormItem key="haMode" {...this.formLayout} label="HA机制">
          {form.getFieldDecorator('haMode', {
            initialValue: canalParameter.haMode || 'HEARTBEAT',
          })(
            <Radio.Group>
              <Radio.Button value="HEARTBEAT">heartbeat</Radio.Button>
              <Radio.Button value="MEDIA">media</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="detectingEnable" {...this.formLayout} label="是否开启心跳">
          {form.getFieldDecorator('detectingEnable', {
            initialValue: canalParameter.detectingEnable,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem {...this.formLayout} label="其他参数设置">
          <Switch
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
            onChange={this.otherParamsShow}
          />
        </FormItem>

        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="metaMode"
          {...this.formLayout}
          label="meta机制"
        >
          {form.getFieldDecorator('metaMode', {
            initialValue: canalParameter.metaMode || 'MIXED',
          })(
            <Radio.Group>
              <Radio.Button value="MEMORY">memory</Radio.Button>
              <Radio.Button value="ZOOKEEPER">zookeeper</Radio.Button>
              <Radio.Button value="MIXED">mixed</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>

        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="indexMode"
          {...this.formLayout}
          label="索引机制"
        >
          {form.getFieldDecorator('indexMode', {
            initialValue: canalParameter.indexMode || 'MEMORY_META_FAILBACK',
          })(
            <Radio.Group>
              <Radio.Button value="MEMORY">memory</Radio.Button>
              <Radio.Button value="ZOOKEEPER">zookeeper</Radio.Button>
              <Radio.Button value="MIXED">mixed</Radio.Button>
              <Radio.Button value="MEMORY_META_FAILBACK">memory_meta_failback</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>

        {
          <FormItem
            style={{
              display: otherParamsVisible,
            }}
            key="port"
            {...this.formLayout}
            label="服务端口"
          >
            {form.getFieldDecorator('port', {
              rules: [{ required: true, message: '服务端口' }],
              initialValue: canalParameter.port || 11111,
            })(<Input placeholder="" />)}
          </FormItem>
        }
        {
          <FormItem
            style={{
              display: otherParamsVisible,
            }}
            key="defaultConnectionTimeoutInSeconds"
            {...this.formLayout}
            label="默认连接超时(s)"
          >
            {form.getFieldDecorator('defaultConnectionTimeoutInSeconds', {
              rules: [{ required: true, message: '默认连接超时(s)' }],
              initialValue: canalParameter.defaultConnectionTimeoutInSeconds || 30,
            })(<Input placeholder="" />)}
          </FormItem>
        }
        {
          <FormItem
            style={{
              display: otherParamsVisible,
            }}
            key="receiveBufferSize"
            {...this.formLayout}
            label="sendBufferSize"
          >
            {form.getFieldDecorator('receiveBufferSize', {
              rules: [{ required: true, message: 'sendBufferSize' }],
              initialValue: canalParameter.receiveBufferSize || 16384,
            })(<Input placeholder="" />)}
          </FormItem>
        }
        {
          <FormItem
            style={{
              display: otherParamsVisible,
            }}
            key="sendBufferSize"
            {...this.formLayout}
            label="sendBufferSize"
          >
            {form.getFieldDecorator('sendBufferSize', {
              rules: [{ required: true, message: 'sendBufferSize' }],
              initialValue: canalParameter.sendBufferSize || 16384,
            })(<Input placeholder="" />)}
          </FormItem>
        }
        {
          <FormItem
            style={{
              display: otherParamsVisible,
            }}
            key="fallbackIntervalInSeconds"
            {...this.formLayout}
            label="切换回退时间"
          >
            {form.getFieldDecorator('fallbackIntervalInSeconds', {
              rules: [{ required: true, message: '切换回退时间' }],
              initialValue: canalParameter.fallbackIntervalInSeconds || 60,
            })(<Input placeholder="" />)}
          </FormItem>
        }
        <FormItem key="blackFilter" {...this.formLayout} label="过滤表达式">
          {form.getFieldDecorator('blackFilter', {
            rules: [{ required: false, message: '过滤表达式' }],
            initialValue: canalParameter.blackFilter,
          })(<Input.TextArea autosize={{ minRows: 6 }} placeholder="" />)}
        </FormItem>
        <FormItem key="description" {...this.formLayout} label="描述信息">
          {form.getFieldDecorator('description', {
            rules: [{ required: false, message: '描述信息' }],
            initialValue: values.description,
          })(<Input.TextArea autosize={{ minRows: 6 }} placeholder="" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default CanalForm;
