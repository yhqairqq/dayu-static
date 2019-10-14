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
  message,
} from 'antd';

import CanalForm from '../../canal/component/CanalForm';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option, OptGroup } = Select;

@Form.create()
@connect(({ canal, pipeline, node, zookeeper, loading }) => ({
  canal,
  pipeline,
  node,
  zookeeper,
  loading: loading.models.pipeline,
}))
class PipelineForm extends React.Component {
  static defaultProps = {
    values: {},
    isEdit: false,

    handleAdd: () => {},
    handleUpdate: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    const { values, isEdit, channelId } = props;
    this.state = {
      channelId,
      positionVisible: 'none',
      otherParamsVisible: 'none',
      canalModalVisible: false,
      confirmLoading: false,
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const { dispatch, isEdit } = this.props;

    dispatch({
      type: 'node/fetch',
    });
    dispatch({
      type: 'canal/fetchAll',
    });

    // dispatch({
    //   type: 'zookeeper/getZookeepers',
    // });
    // dispatch({
    //   type: 'report/fetchTypes',
    // });
  }
  otherParamsShow = () => {
    const { otherParamsVisible } = this.state;

    this.setState({
      otherParamsVisible: otherParamsVisible == 'none' ? 'block' : 'none',
    });
  };
  binlogShow = () => {};

  positionShow = () => {
    const { positionVisible } = this.state;

    this.setState({
      positionVisible: positionVisible == 'none' ? 'block' : 'none',
    });
  };
  okHandle = () => {
    const { values, isEdit = false, form, handleAdd, handleUpdate } = this.props;
    const { isHand, sourceId, type, channelId } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();

      if (isEdit) {
        handleUpdate({
          channelId,
          id: values.id,
          ...fieldsValue,
        });
      } else {
        handleAdd({
          channelId,
          ...fieldsValue,
        });
      }
    });
  };
  canalAdd = () => {
    console.log('canaladd');
    this.setState({
      canalModalVisible: true,
    });
  };
  handleModalVisible = (flag, record, isEdit) => {
    console.log(flag, record);
    this.setState({
      canalModalVisible: !!flag,
      isEditForm: !!isEdit,
      recordValue: record || {},
    });
  };
  handleAdd = fields => {
    const { dispatch } = this.props;
    this.setState({
      confirmLoading: true,
    });
    dispatch({
      type: 'canal/add',
      payload: fields,
      callback: () => {
        setTimeout(() => {
          message.success('添加成功');
          this.setState({
            confirmLoading: false,
          });
          this.handleModalVisible();
          // 重载数据
          this.reloadData();
        }, 2000);
      },
    });
  };
  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'canal/fetchAll',
      payload: {},
    });
  };

  render() {
    const {
      isHand,
      positionVisible,
      otherParamsVisible,
      canalModalVisible,
      confirmLoading,
    } = this.state;
    const {
      isEdit,
      modalVisible,
      handleModalVisible,
      form,
      values,
      node: { data },
      canal: { canals },
      zookeeper: { zookeepers },
    } = this.props;
    const nodes = (data && data.list) || [];

    const pipelineParameter = values.parameters || {};

    const selectNodes = values.selectNodes;
    const loadNodes = values.loadNodes;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={window.innerWidth / 2}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 10px' }}
        title={isEdit ? '修改pipline信息' : '新增pipline信息'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle}
      >
        <FormItem key="name" {...this.formLayout} label="Pipeline名字">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: 'Pipeline名字' }],
            initialValue: values.name,
          })(<Input placeholder="Pipeline名字" />)}
        </FormItem>

        <FormItem key="selectNodeIds" {...this.formLayout} label="Select机器">
          {form.getFieldDecorator('selectNodeIds', {
            rules: [{ required: true, message: 'Select机器' }],
            initialValue: selectNodes && selectNodes.map(node => node.id),
          })(
            <Select style={{ width: 200, height: 50 }} mode="multiple">
              <OptGroup label="Select">
                {nodes &&
                  nodes.map(node => (
                    <Option key={node.id} value={node.id}>
                      {node.name}
                    </Option>
                  ))}
              </OptGroup>
            </Select>
          )}
        </FormItem>
        <FormItem key="loadNodeIds" {...this.formLayout} label="Load机器">
          {form.getFieldDecorator('loadNodeIds', {
            rules: [{ required: true, message: 'Load机器' }],
            initialValue: loadNodes && loadNodes.map(node => node.id),
          })(
            <Select style={{ width: 200, height: 50 }} mode="multiple">
              <OptGroup label="Load">
                {nodes &&
                  nodes.map(node => (
                    <Option key={node.id} value={node.id}>
                      {node.name}
                    </Option>
                  ))}
              </OptGroup>
            </Select>
          )}
        </FormItem>
        <FormItem key="parallelism" {...this.formLayout} label="并行度">
          {form.getFieldDecorator('parallelism', {
            rules: [{ required: true, message: '并行度' }],
            initialValue: pipelineParameter.parallelism || 5,
          })(<Input />)}
        </FormItem>
        <FormItem key="extractPoolSize" {...this.formLayout} label="数据反查线程数">
          {form.getFieldDecorator('extractPoolSize', {
            rules: [{ required: true, message: '数据反查线程数' }],
            initialValue: pipelineParameter.extractPoolSize || 10,
          })(<Input />)}
        </FormItem>
        <FormItem key="loadPoolSize" {...this.formLayout} label="数据载入线程数">
          {form.getFieldDecorator('loadPoolSize', {
            rules: [{ required: true, message: '数据载入线程数' }],
            initialValue: pipelineParameter.loadPoolSize || 15,
          })(<Input />)}
        </FormItem>
        <FormItem key="home" {...this.formLayout} label="主站点">
          {form.getFieldDecorator('home', {
            initialValue: pipelineParameter.home || false,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="selectorMode" {...this.formLayout} label="同步数据来源">
          {form.getFieldDecorator('selectorMode', {
            initialValue: pipelineParameter.selectorMode || 'Canal',
          })(
            <Radio.Group>
              <Radio.Button value="Canal">Canal</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="destinationName" {...this.formLayout} label="Canal名字">
          {form.getFieldDecorator('destinationName', {
            rules: [{ required: true, message: 'Canal名字' }],
            initialValue: pipelineParameter.destinationName,
          })(
            <Select style={{ width: 200, height: 10 }}>
              <OptGroup label="canal">
                {canals &&
                  canals.map(canal => (
                    <Option
                      key={canal.id}
                      value={canal.name}
                      disabled={canal.used}
                      title={canal.name}
                    >{`${canal.id}-${canal.name}`}</Option>
                  ))}
              </OptGroup>
            </Select>
          )}
          <span
            style={{
              marginLeft: '10px',
            }}
          >
            <Button type="primary" onClick={this.canalAdd}>
              新增选项
            </Button>
          </span>
        </FormItem>
        <FormItem key="mainstemBatchsize" {...this.formLayout} label="消费批次大小">
          {form.getFieldDecorator('mainstemBatchsize', {
            rules: [{ required: true, message: '消费批次大小' }],
            initialValue: pipelineParameter.mainstemBatchsize || 6000,
          })(<Input />)}
        </FormItem>
        <FormItem key="batchTimeout" {...this.formLayout} label="获取批次数据超时时间(毫秒)">
          {form.getFieldDecorator('batchTimeout', {
            rules: [{ required: true, message: '获取批次数据超时时间(毫秒):' }],
            initialValue: pipelineParameter.batchTimeout || -1,
          })(<Input placeholder="格式: -1不进行控制，0代表永久，>0则按照指定时间控制" />)}
        </FormItem>
        <FormItem key="description" {...this.formLayout} label="描述信息">
          {form.getFieldDecorator('description', {
            rules: [{ required: false, message: '描述信息' }],
            initialValue: values.description,
          })(<Input.TextArea autosize={{ minRows: 6 }} placeholder="" />)}
        </FormItem>
        <FormItem {...this.formLayout} label="高级设置">
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
          key="useBatch"
          {...this.formLayout}
          label="使用batch"
        >
          {form.getFieldDecorator('useBatch', {
            initialValue: pipelineParameter.useBatch || true,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="skipSelectException"
          {...this.formLayout}
          label="跳过Select异常"
        >
          {form.getFieldDecorator('skipSelectException', {
            initialValue: pipelineParameter.skipSelectException || false,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="skipLoadException"
          {...this.formLayout}
          label="跳过Load异常"
        >
          {form.getFieldDecorator('skipLoadException', {
            initialValue: pipelineParameter.skipLoadException || false,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="arbitrateMode"
          {...this.formLayout}
          label="仲裁器调度模式"
        >
          {form.getFieldDecorator('arbitrateMode', {
            initialValue: pipelineParameter.arbitrateMode || 'AUTOMATIC',
          })(
            <Radio.Group>
              <Radio.Button value="AUTOMATIC">AUTOMATIC</Radio.Button>
              <Radio.Button value="RPC">RPC</Radio.Button>
              <Radio.Button value="ZOOKEEPER">ZOOKEEPER</Radio.Button>
              <Radio.Button value="MEMORY">MEMORY</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="lbAlgorithm"
          {...this.formLayout}
          label="负载均衡算法"
        >
          {form.getFieldDecorator('lbAlgorithm', {
            initialValue: pipelineParameter.lbAlgorithm || 'Stick',
          })(
            <Radio.Group>
              <Radio.Button value="Random">Random</Radio.Button>
              <Radio.Button value="RoundRbin">RoundRbin</Radio.Button>
              <Radio.Button value="Stick">Stick</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="pipeChooseType"
          {...this.formLayout}
          label="传输模式"
        >
          {form.getFieldDecorator('pipeChooseType', {
            initialValue: pipelineParameter.pipeChooseType || 'AUTOMATIC',
          })(
            <Radio.Group>
              <Radio.Button value="AUTOMATIC">AUTOMATIC</Radio.Button>
              <Radio.Button value="RPC">RPC</Radio.Button>
              <Radio.Button value="HTTP">HTTP</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="dumpSelector"
          {...this.formLayout}
          label="记录selector日志"
        >
          {form.getFieldDecorator('dumpSelector', {
            initialValue: pipelineParameter.dumpSelector || true,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="dumpSelectorDetail"
          {...this.formLayout}
          label="记录selector详细日志"
        >
          {form.getFieldDecorator('dumpSelectorDetail', {
            initialValue: pipelineParameter.dumpSelectorDetail || false,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="dumpEvent"
          {...this.formLayout}
          label="记录load日志"
        >
          {form.getFieldDecorator('dumpEvent', {
            initialValue: pipelineParameter.dumpEvent || false,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="dryRun"
          {...this.formLayout}
          label="dryRun模式"
        >
          {form.getFieldDecorator('dryRun', {
            initialValue: pipelineParameter.dryRun || false,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="dataSyncSkip"
          {...this.formLayout}
          label="跳过数据同步"
        >
          {form.getFieldDecorator('dataSyncSkip', {
            initialValue: pipelineParameter.dataSyncSkip || false,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="ddlSync"
          {...this.formLayout}
          label="支持ddl同步"
        >
          {form.getFieldDecorator('ddlSync', {
            initialValue: pipelineParameter.ddlSync || true,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="skipDdlException"
          {...this.formLayout}
          label="是否跳过ddl异常"
        >
          {form.getFieldDecorator('skipDdlException', {
            initialValue: pipelineParameter.skipDdlException || false,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="useExternalIp"
          {...this.formLayout}
          label="启用公网同步"
        >
          {form.getFieldDecorator('useExternalIp', {
            initialValue: pipelineParameter.useExternalIp || false,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="skipFreedom"
          {...this.formLayout}
          label="跳过自由门数据"
        >
          {form.getFieldDecorator('skipFreedom', {
            initialValue: pipelineParameter.skipFreedom || false,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="skipNoRow"
          {...this.formLayout}
          label="跳过反查无记录数据"
        >
          {form.getFieldDecorator('skipNoRow', {
            initialValue: pipelineParameter.skipNoRow || false,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="useTableTransform"
          {...this.formLayout}
          label="启用数据表类型转化"
        >
          {form.getFieldDecorator('useTableTransform', {
            initialValue: pipelineParameter.useTableTransform || false,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="enableCompatibleMissColumn"
          {...this.formLayout}
          label="兼容字段新增同步"
        >
          {form.getFieldDecorator('enableCompatibleMissColumn', {
            initialValue: pipelineParameter.enableCompatibleMissColumn || true,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="passChange"
          {...this.formLayout}
          label="传递变化"
        >
          {form.getFieldDecorator('passChange', {
            initialValue: pipelineParameter.passChange || false,
          })(
            <Radio.Group>
              <Radio.Button value={true}>是</Radio.Button>
              <Radio.Button value={false}>否</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem
          style={{
            display: otherParamsVisible,
          }}
          key="channelInfo"
          {...this.formLayout}
          label="自定义同步标记"
        >
          {form.getFieldDecorator('channelInfo', {
            rules: [{ required: false, message: '获取批次数据超时时间(毫秒):' }],
            initialValue: pipelineParameter.channelInfo,
          })(<Input placeholder="" />)}
        </FormItem>

        {canalModalVisible && (
          <CanalForm
            {...parentMethods}
            isEdit={false}
            modalVisible={canalModalVisible}
            confirmLoading={confirmLoading}
          />
        )}
      </Modal>
    );
  }
}

export default PipelineForm;
