import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Radio, Select, TreeSelect } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
@connect(({ role, loading, appinfo, anchor }) => ({
  role,
  loading: loading.models.role,
  appinfo,
  anchor,
}))
class AnchorOptForm extends React.Component {
  static defaultProps = {
    values: {
      appId: 0,
    },
    isEdit: false,
    handleAdd: () => {},
    handleUpdate: () => {},
    handleModalVisible: () => {},
  };

  state = {
    addObjectId: false,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.formLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
  }

  addBySelf = () => {
    this.setState({
      addObjectId: true,
    });
  };

  autoGenerate = () => {
    this.setState({
      addObjectId: false,
    });
  };

  okHandle = () => {
    const { values, isEdit = false, form, handleAdd, handleUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (isEdit) {
        handleUpdate({
          id: values.id,
          ...fieldsValue,
        });
      } else {
        handleAdd(fieldsValue);
      }
    });
  };

  render() {
    const {
      isEdit,
      modalVisible,
      handleModalVisible,
      values,
      form,
      appinfo: { allAppInfos },
      anchor: { allAnchorTypes, allEventTypes, trees },
    } = this.props;
    const { addObjectId } = this.state;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title={isEdit ? '修改埋点信息' : '新增埋点信息'}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle}
      >
        <FormItem key="appId" {...this.formLayout} label="所属应用">
          {form.getFieldDecorator('appID', {
            rules: [{ required: true, message: '请选择所属应用！' }],
            initialValue: values.appId,
          })(
            <Select placeholder="选择应用" style={{ width: '100%' }}>
              {allAppInfos.map(r => (
                <Select.Option key={r.id} value={r.id}>
                  {r.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </FormItem>
        <Form.Item key="type" {...this.formLayout} label="埋点类型">
          {form.getFieldDecorator('type', {
            rules: [{ required: true, message: '请选择埋点类型！' }],
            initialValue: values.type,
          })(
            <Radio.Group>
              {allAnchorTypes.map(r => {
                const key = Object.keys(r)[0];
                return (
                  <Radio value={key} key={key}>
                    {r[key]}
                  </Radio>
                );
              })}
            </Radio.Group>
          )}
        </Form.Item>
        <FormItem key="parentId" {...this.formLayout} label="父节点">
          {form.getFieldDecorator('parentId', {
            rules: [{ required: true, message: '请选择父节点' }],
            initialValue: values.parentId,
          })(
            <TreeSelect
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto', offsetHeight: 10 }}
              treeData={trees}
              treeDefaultExpandAll
              placeholder="请选择父节点"
            />
          )}
        </FormItem>
        <FormItem key="eventType" {...this.formLayout} label="事件类型">
          {form.getFieldDecorator('eventType', {
            rules: [{ required: true, message: '请选择事件类型！' }],
            initialValue: values.eventType,
          })(
            <Radio.Group>
              {allEventTypes.map(r => {
                const key = Object.keys(r)[0];
                return (
                  <Radio value={key} key={key}>
                    {r[key]}
                  </Radio>
                );
              })}
            </Radio.Group>
          )}
        </FormItem>
        <FormItem key="name" {...this.formLayout} label="埋点名称">
          {form.getFieldDecorator('name', {
            initialValue: values.name,
            rules: [{ required: true, message: '请输入埋点名称！' }],
          })(<Input placeholder="请输入埋点名称" />)}
        </FormItem>
        {isEdit ? (
          <FormItem key="objectId" {...this.formLayout} label="埋点唯一标识码">
            {form.getFieldDecorator('objectId', {
              rules: [{ required: true, message: '请选择埋点唯一标识码！' }],
              initialValue: values.objectId,
            })(<Input disabled={isEdit} />)}
          </FormItem>
        ) : (
          <div>
            <FormItem key="autoCode" {...this.formLayout} label="埋点唯一标识码">
              {form.getFieldDecorator('autoCode', {
                rules: [{ required: true, message: '请选择埋点唯一标识码！' }],
                initialValue: values.autoCode,
              })(
                <Radio.Group>
                  <Radio value={0} onChange={this.addBySelf} key={0}>
                    自填
                  </Radio>
                  <Radio value={1} onChange={this.autoGenerate} key={1}>
                    自动生成
                  </Radio>
                </Radio.Group>
              )}
            </FormItem>
            {addObjectId ? (
              <FormItem key="objectId" {...this.formLayout} label="埋点唯一标识码">
                {form.getFieldDecorator('objectId', {
                  rules: [{ required: true, message: '请输入埋点唯一标识码！' }],
                  initialValue: values.objectId,
                })(<Input placeholder="请确保标识码唯一" />)}
              </FormItem>
            ) : null}
          </div>
        )}
        <FormItem key="androidMapObject" {...this.formLayout} label="Android映射对象">
          {form.getFieldDecorator('androidMapObject', {
            initialValue: values.androidMapObject,
          })(<TextArea rows={2} placeholder="多个请以逗号隔开" />)}
        </FormItem>
        <FormItem key="iosMapObject" {...this.formLayout} label="IOS映射对象">
          {form.getFieldDecorator('iosMapObject', {
            initialValue: values.iosMapObject,
          })(<TextArea rows={2} placeholder="多个请以逗号隔开" />)}
        </FormItem>
        <FormItem key="comment" {...this.formLayout} label="描述">
          {form.getFieldDecorator('comment', {
            initialValue: values.comment,
          })(<TextArea rows={4} placeholder="多个请以逗号隔开" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default AnchorOptForm;
