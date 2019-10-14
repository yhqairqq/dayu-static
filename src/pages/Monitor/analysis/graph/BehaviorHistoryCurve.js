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
@connect(({ analysis, loading }) => ({
  analysis,
  loading: loading.models.analysis,
}))
class BehaviorHistoryCurve extends React.Component {
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
      type: 'analysis/fetchBehaviorHistoryCurve',
      payload: {
        dataMediaPairId: values.id,
      },
      callback: data => {
        let plotCells = data.plotCells.map(item => {
          item.num = Number(item.num);
          item.time = Number(item.time);
          return item;
        });
        data = {
          ...data,
          plotCells,
        };
        this.setState({
          analysisResult: data,
        });
      },
    });
    // dispatch({
    //   type: 'report/fetchTypes',
    // });
  }
  render() {
    const { analysisResult } = this.state;
    const { analysisModalVisible, analysisHandleModalVisible, form, values } = this.props;
    const otherResult = (analysisResult && analysisResult.otherResult) || {};
    const cols = {
      num: {
        min: 0,
      },
      time: {
        range: [0, 1],
      },
    };
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={window.innerWidth / 2}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 10px' }}
        title={'行为分析'}
        visible={analysisModalVisible}
        onCancel={() => analysisHandleModalVisible(false, {})}
        footer={[]}
      >
        <div>
          <span
            style={{
              paddingLeft: '30px',
              fontWeight: 'bold',
            }}
          >
            insert总:
          </span>
          {otherResult && otherResult.totalInsert}
          <span
            style={{
              paddingLeft: '30px',
              fontWeight: 'bold',
            }}
          >
            delete总:
          </span>
          {otherResult && otherResult.totalDelete}
          <span
            style={{
              paddingLeft: '30px',
              fontWeight: 'bold',
            }}
          >
            update总:
          </span>
          {otherResult && otherResult.totalUpdate}
        </div>

        <Chart
          // height={200}
          data={analysisResult && analysisResult.plotCells}
          scale={{
            num: {
              min: 0,
              alias: '记录条数',
              // formatter:val=>`${val} 条`
            },
            time: {
              range: [0, 1],
              alias: '时间',
              formatter: val => moment(Number(val)).format('HH:mm:ss'),
            },
          }}
          padding={[20, 80, 80, 80]}
          forceFit
        >
          <Legend />
          <Axis
            name="time"
            //   label={{
            //         formatter:val=>moment(parseInt(val)).format("HH:mm")
            //         }}
          />
          <Axis
            name="num"
            label={{
              formatter: val => `${val} 条`,
            }}
          />
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom type="line" position="time*num" size={2} color={'type'} shape={'smooth'} />
          <Geom
            type="point"
            position="time*num"
            size={1}
            shape={'circle'}
            color={'type'}
            style={{
              stroke: '#fff',
              lineWidth: 1,
            }}
          />
        </Chart>
        <div></div>
      </Modal>
    );
  }
}

export default BehaviorHistoryCurve;
