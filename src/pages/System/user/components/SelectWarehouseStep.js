import React from 'react';
import { Checkbox, Col, Divider, Row } from 'antd';

/**
 * 该组件已废弃, 参见SelectDimensionStep
 */
class SelectWarehouseStep extends React.Component {
  state = {
    checkAll: false,
    indeterminate: false,
  };

  onCheckAllEvent = e => {
    const { warehouseList, onParentStateValueChange } = this.props;
    const { checked } = e.target;
    this.setState(
      {
        checkAll: checked,
        indeterminate: false,
      },
      () => onParentStateValueChange(checked ? warehouseList.map(item => item.id) : [])
    );
  };

  onCheckEvent = valueList => {
    const { warehouseList, onParentStateValueChange } = this.props;
    this.setState(
      {
        checkAll: valueList.length === warehouseList.length,
        indeterminate: valueList.length > 0 && valueList.length < warehouseList.length,
      },
      () => onParentStateValueChange(valueList)
    );
  };

  render() {
    const { warehouseList = [], selectedWarehouseList = [] } = this.props;
    const { checkAll, indeterminate } = this.state;
    return (
      <div className="SelectDimensionStep">
        <Divider type="horizontal" />
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
          value={selectedWarehouseList}
          onChange={this.onCheckEvent}
        >
          <Row>
            {warehouseList.map(item => (
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
  }
}

export default SelectWarehouseStep;
