import React from 'react';
import { Checkbox, Col, Divider, Empty, Row } from 'antd';

class SelectDimensionStep extends React.Component {
  static defaultProps = {
    emptyMessage: '暂无数据111',
  };

  state = {
    checkAll: false,
    indeterminate: false,
  };

  onCheckAllEvent = e => {
    const { dataList, onParentStateValueChange } = this.props;
    const { checked } = e.target;
    this.setState(
      {
        checkAll: checked,
        indeterminate: false,
      },
      () => onParentStateValueChange(checked ? dataList.map(item => item.id) : [])
    );
  };

  onCheckEvent = valueList => {
    const { dataList, onParentStateValueChange } = this.props;
    this.setState(
      {
        checkAll: valueList.length === dataList.length,
        indeterminate: valueList.length > 0 && valueList.length < dataList.length,
      },
      () => onParentStateValueChange(valueList)
    );
  };

  renderEmpty = () => {
    const { dataList = [], emptyMessage } = this.props;
    if (dataList.length === 0) {
      return <Empty description={emptyMessage} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
    return null;
  };

  renderContent = () => {
    const { dataList = [], selectedDataList = [] } = this.props;
    if (dataList.length === 0) {
      return null;
    }
    const { checkAll, indeterminate } = this.state;
    return (
      <div>
        <Checkbox
          key="city_all_checkbox"
          indeterminate={indeterminate}
          onChange={this.onCheckAllEvent}
          checked={checkAll}
        >
          全选
        </Checkbox>
        <Divider type="horizontal" />
        <Checkbox.Group
          style={{ width: '100%', marginBottom: '10px' }}
          value={selectedDataList}
          onChange={this.onCheckEvent}
        >
          <Row>
            {dataList.map(item => (
              <Col key={item.id} span={6}>
                <Checkbox key={item.id} value={item.id}>
                  {item.name}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </div>
    );
  };

  render() {
    return (
      <div className="SelectDimensionStep">
        <Divider type="horizontal" />
        {this.renderEmpty()}
        {this.renderContent()}
      </div>
    );
  }
}

export default SelectDimensionStep;
