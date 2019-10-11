import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
} from 'antd';
import { formatGroupDbAddress } from '@/utils/utils';

import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from 'bizcharts';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@Form.create()
@connect(({ logrecord, loading }) => ({
  logrecord,
  loading: loading.models.logrecord,
}))
class TopLogRecord extends React.Component {
  static defaultProps = {
    values: {},
    isEdit: false,
    handleAdd: () => {},
    handleUpdate: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    const { values } = props;
    this.state = {};
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const { dispatch, values } = this.props;
    dispatch({
      type: 'logrecord/fetchByPipelineIdTop',
      payload: {
        pipelineId: values.id,
      },
      callback: data => {
        this.setState({
          logrecord: data,
        });
      },
    });
    // dispatch({
    //   type: 'report/fetchTypes',
    // });
  }
  render() {
    const { logrecord } = this.state;
    const { form, values } = this.props;

    return <div>{logrecord && logrecord.message}</div>;
  }
}

export default TopLogRecord;
