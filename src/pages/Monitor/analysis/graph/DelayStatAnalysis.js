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
import numeral from 'numeral';

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
class DelayStatAnalysis extends React.Component {
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
    const { dispatch, values } = this.props;
    dispatch({
      type: 'analysis/fetchAnalysisDelayStat',
      payload: {
        pipelineId: values.id,
      },
      callback: data => {
        let plotCells = data.plotCells.map(item => {
          item.avgDelayNumber = Number(item.avgDelayNumber);
          item.avgDelayTime = Number(item.avgDelayTime);
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
    const {
      isHand,
      positionVisible,
      otherParamsVisible,
      enableRemedyVisible,
      analysisResult,
    } = this.state;
    const {
      isEdit,
      modalVisible,
      analysisHandleModalVisible,
      analysisModalVisible,
      form,
      values,
    } = this.props;
    const otherResult = (analysisResult && analysisResult.otherResult) || {};
    // const plotCells = []
    // for(let i=0;i<1000;i++){
    //   plotCells.push({
    //     time:1569765960000+i*100,
    //     avgDelayTime:i%20
    //   })
    // }
    // console.log(plotCells)
    return (
      <div
        style={{
          width: '800px',
        }}
      >
        <div>
          <span
            style={{
              paddingLeft: '30px',
              fontWeight: 'bold',
            }}
          >
            平均延迟:
          </span>
          {otherResult && numeral(otherResult.delayAvg).format('0,0.00')} ms
        </div>
        {/* analysisResult&&analysisResult. */}
        <Chart
          height={200}
          data={analysisResult && analysisResult.plotCells}
          scale={{
            avgDelayTime: {
              min: 0,
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
          <Axis
            name="time"
            //   label={{
            //     formatter:val=>moment(parseInt(val)).format("HH:mm:ss")
            // }}
          />
          <Axis
            name="avgDelayTime"
            label={{
              formatter: val => `${val} ms`,
            }}
          />
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom type="line" position="time*avgDelayTime" size={1} shape={'smooth'}  color={'l (270) 0:rgba(255, 146, 136, 1) .5:rgba(100, 268, 255, 1) 1:rgba(215, 0, 255, 1)'} />
          <Geom
            type="point"
            position="time*avgDelayTime"
            size={1}
            shape={'circle'}
            style={{
              stroke: '#fff',
              lineWidth: 1,
            }}
          />
        </Chart>
      </div>
    );
  }
}

export default DelayStatAnalysis;
