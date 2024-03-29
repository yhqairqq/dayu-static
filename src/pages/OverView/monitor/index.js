import React from 'react';
import { connect } from 'dva';
import numeral from 'numeral';
import { Button, Form, Col, Row, Select, Descriptions, List } from 'antd';
import moment from 'moment';
import { formatGroupDbAddress,formatSizeUnit } from '@/utils/utils';

import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, Guide, Facet, Util } from 'bizcharts';
import DataSet from '@antv/data-set';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const count = 3;
const { DataView } = DataSet;
const { Html } = Guide;

@Form.create()
@connect(({}) => ({}))
class OverMonitor extends React.Component {
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
    behaviorList: [],
  };
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    this.getData();
    this.timer = setInterval(() => {
      this.getData();
    }, 30000);
  }

  getData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'analysis/fetchAllBehaviorHistory',
      callback: data => {
        data&&data.sort((a,b)=>{
         return  b.plotCells.length  - a.plotCells.length
        })
        let behaviorList = data.filter(item=>(item != null)).map(item => {
          let cells =
            item.plotCells &&
            item.plotCells.map(cell => {
              cell.num = Number(cell.num);
              cell.size = Number(cell.size);
              cell.quantity = Number(cell.quantity);
              cell.time = Number(cell.time);
              return cell;
            });
          return {
            ...item,
            plotCells: cells,
          };
        });

        this.setState({
          behaviorList: behaviorList || [],
        });
      },
    });
    dispatch({
      type: 'analysis/fetchAllNodeInfo',
      callback: data => {
        this.setState({
          nodeInfos: data,
        });
      },
    });
  };

  renderNodeData = heapMemoryUsage => {
    if (!heapMemoryUsage) {
      return [];
    } else {
      let data = [];
      let obj = JSON.parse(heapMemoryUsage);
      let unused = obj.committed / 1000 / 1000 - obj.used / 1000 / 1000;
      let userd = obj.used / 1000 / 1000;

      data.push({
        item: 'unuserd',
        capacity: unused,
      });
      data.push({
        item: 'used',
        capacity: userd,
      });
      return data;
    }
  };

  getDataView = data => {
    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'capacity',
      dimension: 'item',
      as: 'percent',
    });
    return dv;
  };
  getTotalMemmory = heapMemoryUsage => {
    if (!heapMemoryUsage) {
      return '';
    } else {
      let obj = JSON.parse(heapMemoryUsage);
      let total = obj.committed / 1000 / 1000/1000;
      return numeral(total).format('0,0.00') + 'G';
    }
  };

  // onLoadMore = () => {
  //     this.setState({
  //       loading: true,
  //       list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
  //     });
  //     this.getData(res => {
  //       const data = this.state.data.concat(res.results);
  //       this.setState(
  //         {
  //           data,
  //           list: data,
  //           loading: false,
  //         },
  //         () => {
  //           // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
  //           // In real scene, you can using public method of react-virtualized:
  //           // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
  //           window.dispatchEvent(new Event('resize'));
  //         },
  //       );
  //     });
  //   };

  render() {
    const { initLoading, loading, list, behaviorList, nodeInfos } = this.state;
    const {} = this.props;
    const loadMore =
      !initLoading && !loading ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button onClick={this.onLoadMore}>loading more</Button>
        </div>
      ) : null;

    const cols = {
      percent: {
        formatter: val => {
          val = val * 100;
          return numeral(val).format('00.0') + '%';
        },
      },
    };

    return (
      <div>
        <Row gutter={20}>
          <Col span={14}>
          <div style={{
              textAlign:'center',
              fontWeight: 'bold',
            }}>流量监控</div>
            <List
              className="demo-loadmore-list"
              // loading={initLoading}
              itemLayout="horizontal"
              // loadMore={loadMore}
              dataSource={behaviorList}
              renderItem={item => (
                <div>
                  <Chart
                    height={200}
                    data={item && item.plotCells}
                    scale={{
                      size: {
                        min: 0,
                        alias: '平均吞吐量',
                        // formatter: val => `${numeral(val/1000).format('00.00')}KB`,
                      },
                      time: {
                        range: [0, 1],
                        alias: '时间',
                        formatter: val => moment(parseInt(val)).format('HH:mm:ss'),
                      },
                      
                    }}
                    line={{
                      stroke: "#E6E6E6"
                    }}
                    // padding={[20, 80, 8, 80]}
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
                        formatter: val => formatSizeUnit(val),
                      }}
                      line={false}
                      tickLine={null}
                      grid={null}
                      title={null}
                    />
                    <Tooltip
                      crosshairs={{
                        type: 'y',
                      }}
                    />
                    <Geom
                      type="line"
                      position="time*size"
                      size={1}
                      shape={'smooth'}
                      color={'#483D8B'}
                    />
                    <Geom
                      type="point"
                      position="time*size"
                      size={1}
                      shape={'circle'}
                      style={{
                        stroke: '#fff',
                        lineWidth: 1,
                      }}
                    />
                  </Chart>
                  <div
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    <span
                      style={{
                        paddingLeft: '30px',
                        fontWeight: 'bold',
                      }}
                    >
                      链路名称:
                    </span>
                    {item.otherResult.pipeline.name}
                  </div>
                </div>
              )}
            ></List>
          </Col>
          <Col span={10}>
            <div style={{
              textAlign:'center',
              fontWeight: 'bold',
            }}>计算节点</div>
            <List
              className="demo-loadmore-list"
              // loading={initLoading}
              dataSource={nodeInfos&&nodeInfos.filter(info=>(info.otherResult.versionInfo != ""))}
              renderItem={item => (
                <div style={{
                  display:"flex",
                  marginTop:'20px',
                  justifyContent:'space-between'
                }}>
                 
                    <div
                      style={{
                        // height: '450px',
                        width:  window.innerWidth > 1080?window.innerWidth>1440?'70%':'80%':'100%' ,
                        
                      }}
                    >
                      <div
                        style={{
                          textAlign: 'center',
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 'bold',
                          }}
                        >
                          内存总量:
                        </span>
                        {this.getTotalMemmory(item.otherResult.heapMemoryUsage)}
                      </div>
                      {item.otherResult.heapMemoryUsage!=0 && (
                        <Chart
                          height={window.innerWidth>1440?250:100}
                          width={200}
                          data={this.getDataView(
                            this.renderNodeData(item.otherResult.heapMemoryUsage)
                          )}
                          scale={cols}
                          padding={[5, 5, 5, 5]}
                          forceFit
                        >
                          <Coord type={'theta'} radius={0.75} innerRadius={0.6} />
                          <Axis name="percent" />
                          {/* <Legend position="right" offsetY={-350 / 2} offsetX={-200} /> */}
                          <Tooltip
                            showTitle={false}
                            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
                          />
                          {/* <Guide>
                                                <Html
                                                position={["50%", "50%"]}
                                                html={this.getTotalMemmory(item.otherResult.heapMemoryUsage)}
                                                alignX="middle"
                                                alignY="middle"
                                                />
                                            </Guide> */}
                          <Geom
                            type="intervalStack"
                            position="percent"
                            color={['item', [ '#339900','#990000']]}
                            tooltip={[
                              'item*percent',
                              (item, percent) => {
                                percent = numeral(percent*100).format('00.0') + '%';
                                return {
                                  name: item,
                                  value: percent,
                                };
                              },
                            ]}
                            style={{
                              lineWidth: 1,
                              stroke: '#fff',
                            }}
                          >
                            <Label
                              content="percent"
                              formatter={(val, item) => {
                                return item.point.item + ': ' + val;
                              }}
                            />
                          </Geom>
                        </Chart>
                      )}
                      <div
                        style={{
                          textAlign: 'center',
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 'bold',
                          }}
                        >
                          节点名称:
                        </span>
                        {item.otherResult.node.name}
                      </div>
                
                    </div>
                    {window.innerWidth > 1080&&<div style={{
                        width: window.innerWidth>1440?'30%':'20%'
                    }}>
                      <div style={{
                          fontSize:'8px'
                        }}>
                        <div style={{marginBottom:'5x'}}>
                        <span >名称</span> :<span> {item.otherResult.node.name} </span>
                        </div>
                      </div>
                      <div style={{
                          fontSize:'8px'
                        }}>
                        <div style={{marginBottom:'5x'}}>
                        <span >机器序号</span> :<span> {item.otherResult.node.id}</span>
                        </div>
                      </div>
                      <div style={{
                          fontSize:'8px'
                        }}>
                        <div style={{marginBottom:'5x'}}>
                        <span >地址端口</span> :<span>  {item.otherResult.node.port}</span>
                        </div>
                      </div>
                      <div style={{
                          fontSize:'8px'
                        }}>
                        <div style={{marginBottom:'5x'}}>
                        <span >下载端口</span> :<span>   {item.otherResult.node.parameters.downloadPort}</span>
                        </div>
                      </div>
                      <div style={{
                          fontSize:'8px'
                        }}>
                        <div style={{marginBottom:'5x'}}>
                        <span >MBean端口</span> :<span> {item.otherResult.node.parameters.mbeanPort}</span>
                        </div>
                      </div>
                      <div style={{
                          fontSize:'8px'
                        }}>
                        <div style={{marginBottom:'5x'}}>
                        <span >运行状态</span> :<span>  {item.otherResult.node.status}</span>
                        </div>
                      </div>
                      <div style={{
                          fontSize:'8px'
                        }}>
                        <div style={{marginBottom:'5x'}}>
                        <span >线程使用状况</span> :<span>{`${item.otherResult.threadActiveSize}/${item.otherResult.threadPoolSize}`}</span>
                        </div>
                      </div>
                      <div style={{
                          fontSize:'8px'
                        }}>
                        <div style={{marginBottom:'5x'}}>
                        <span >实际运行的Pipeline数统计</span> :<span> {item.otherResult.runningPipelines!=0&&item.otherResult.runningPipelines.reduce((pre, val) => pre + ',' + val)}</span>
                        </div>
                      </div>
                      <div style={{
                          fontSize:'8px'
                        }}>
                        <div style={{marginBottom:'5x'}}>
                        <span >操作系统信息</span> :<span>  {item.otherResult.systemInfo}</span>
                        </div>
                      </div>
                    </div>}
                </div>
              )}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
export default OverMonitor;
