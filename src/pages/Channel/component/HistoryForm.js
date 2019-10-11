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
  DatePicker,
  TimePicker,
} from 'antd';
import { formatGroupDbAddress } from '@/utils/utils';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@Form.create()
@connect(({}) => ({}))
class HistoryForm extends React.Component {
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
      enableRemedyVisible: 'none',
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const { dispatch, isEdit } = this.props;

    // dispatch({
    //   type: 'zookeeper/getZookeepers',
    // });
    // dispatch({
    //   type: 'report/fetchTypes',
    // });
  }

  enableRemedyShow = () => {
    const { enableRemedyVisible } = this.state;
    this.setState({
      enableRemedyVisible: enableRemedyVisible == 'none' ? 'block' : 'none',
    });
  };

  okHandle = () => {
    const { form, swtichWithStart, channelId } = this.props;
    const { isHand, sourceId, type } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      console.log(fieldsValue.startTime);
      console.log(fieldsValue.startTime.format('YYYY-MM-DD HH:mm:ss'));
      swtichWithStart(
        channelId,
        'start',
        'history',
        fieldsValue.startTime.format('YYYY-MM-DD HH:mm:ss')
      );
    });
  };

  render() {
    const {} = this.state;
    const { historyVisible, handleHistoryModalVisible, form, values } = this.props;

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={440}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 10px' }}
        title={'历史时间位点'}
        visible={historyVisible}
        onCancel={() => handleHistoryModalVisible(false)}
        onOk={this.okHandle}
      >
        <FormItem key="startTime" {...this.formLayout} label="时间戳">
          {form.getFieldDecorator('startTime', {
            rules: [{ required: true, message: '开始时间' }],
            initialValue: '',
          })(
            <DatePicker
              style={{
                minWidth: '250px',
              }}
              showTime
            />
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default HistoryForm;
