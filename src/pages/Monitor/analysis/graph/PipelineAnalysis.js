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
class PipelineAnalysis extends React.Component {
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
      type: 'analysis/fetchAnalysisThroughputHistory',
      payload: {
        pipelineId: values.id,
      },
      callback: data => {
        let plotCells = data.plotCells.map(item => {
          item.num = Number(item.num);
          item.size = Number(item.size);
          item.quantity = Number(item.quantity);
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
        width={1000}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 10px' }}
        title={'近一天流量'}
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
            总记录数:
          </span>
          {otherResult && otherResult.totalRecord1}
          <span
            style={{
              paddingLeft: '30px',
              fontWeight: 'bold',
            }}
          >
            总大小:
          </span>
          {otherResult && otherResult.totalSize1}
        </div>

        <Chart
          height={200}
          data={analysisResult && analysisResult.plotCells}
          scale={{
            num: {
              min: 0,
              alias: '记录条数',
            },
            time: {
              range: [0, 1],
              alias: '时间',
              formatter: val => moment(parseInt(val)).format('HH:mm:ss'),
            },
          }}
          padding={[20, 80, 80, 80]}
          forceFit
        >
          <Axis
            name="time"
            // label={{
            //   formatter:val=>moment(parseInt(val)).format("HH:mm:ss")
            //  }}
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
          <Geom type="line" position="time*num" size={2} shape={'smooth'} />
          <Geom
            type="point"
            position="time*num"
            size={4}
            shape={'circle'}
            style={{
              stroke: '#fff',
              lineWidth: 1,
            }}
          />
        </Chart>
        <div>
          <div></div>
          <Chart
            height={200}
            data={analysisResult && analysisResult.plotCells}
            scale={{
              size: {
                min: 0,
                alias: '记录大小',
              },
              time: {
                range: [0, 1],
                alias: '时间',
                formatter: val => moment(parseInt(val)).format('HH:mm:ss'),
              },
            }}
            padding={[20, 80, 80, 80]}
            forceFit
          >
            <Axis
              name="time"
              // label={{
              //     formatter:val=>moment(parseInt(val)).format("HH:mm:ss")
              // }}
            />
            <Axis
              name="size"
              label={{
                formatter: val => `${val / 1000} KB`,
              }}
            />
            <Tooltip
              crosshairs={{
                type: 'y',
              }}
            />
            <Geom type="line" position="time*size" size={2} shape={'smooth'} color={'green'} />
            <Geom
              type="point"
              position="time*size"
              size={4}
              shape={'circle'}
              style={{
                stroke: '#fff',
                lineWidth: 1,
              }}
            />
          </Chart>
        </div>
      </Modal>
    );
  }
}

export default PipelineAnalysis;
