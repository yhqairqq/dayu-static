import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Modal, Checkbox, Tree, Divider } from 'antd';

import CheckboxGroup from 'antd/lib/checkbox/Group';

const { confirm } = Modal;

@Form.create()
@connect(({ resource, role, loading }) => ({
  resource,
  role,
  loading: loading.models.resource,
}))
class AllotRes2Role extends React.Component {
  static defaultProps = {
    values: {
      appId: 0,
      type: 0,
    },
    isEdit: false,
    handleUpdate: () => {},
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      selectedKeys: [],
      autoExpandParent: false,
      checkedKeys: [],
      maskChecked: [], // 默认选择
      indeterminate: true,
      checkAll: false,
      roleMaskMap: {}, // 角色权限集合
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  componentDidMount() {
    const {
      dispatch,
      values: { id: roleId },
      allMask,
    } = this.props;

    const options = {};
    allMask.forEach(mask => {
      options[mask.left] = mask.right;
    });

    dispatch({
      type: 'resource/fetchResTree',
    });
    dispatch({
      type: 'role/fetchRoleRes',
      payload: {
        roleId,
      },
      callback: data => {
        const checkedKeys = [];
        const roleMaskMap = {};

        Object.keys(data).map(key => {
          const nk = key.replace(/"/g, ''); // 去除字符串的双引号； 问题的原因是java后端把Long转成了字符串
          checkedKeys.push(nk);

          const tmp = [];
          data[key].map(r => {
            tmp.push(options[r]);
            return null;
          });
          roleMaskMap[nk] = tmp;
          return null;
        });
        this.setState({
          roleMaskMap,
          checkedKeys,
        });
      },
    });
  }

  okHandle = () => {
    const {
      values,
      handleUpdate,
      allMask,
      resource: { resTree },
    } = this.props;
    const { roleMaskMap, checkedKeys } = this.state;
    const options = {};
    allMask.forEach(mask => {
      options[mask.right] = mask.left;
    });

    // 获取资源树信息
    const resInfo = {};
    resTree.forEach(res => {
      resInfo[res.key] = res.title;
      if (res.children) {
        res.children.forEach(child => {
          resInfo[child.key] = child.title;
        });
      }
    });

    // 获取权限类型信息
    const resMask = {};
    const contentInfo = {};
    Object.keys(roleMaskMap).map(key => {
      if (checkedKeys.includes(key)) {
        const mask = roleMaskMap[key].map(tk => {
          return options[tk];
        });
        resMask[key] = mask;
        contentInfo[resInfo[key]] = roleMaskMap[key];
      }
      return null;
    });

    confirm({
      title: '角色赋权如下：',
      content: (
        <div>
          {Object.keys(contentInfo).map(key => (
            <p style={{ margin: 5 }}>
              <strong>{key}</strong>: {contentInfo[key].join(',')}
            </p>
          ))}
        </div>
      ),
      onOk() {
        handleUpdate({
          roleId: values.id,
          roleMaskMap: resMask,
        });
      },
    });
  };

  // 节点选中
  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };

  // 树节点选择
  onSelect = (selectedKeys, info) => {
    const { roleMaskMap } = this.state;
    const { selected } = info;
    if (selected) {
      // 节点选中状态
      const maskChecked = roleMaskMap[selectedKeys[0]] || [];
      this.setState({ selectedKeys, maskChecked });
    }
    this.setState({ selectedKeys });
  };

  // 树展开
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  // 权限选择事件
  onCheckboxChange = maskChecked => {
    const { allMask } = this.props;
    const { roleMaskMap, selectedKeys } = this.state;
    roleMaskMap[selectedKeys[0]] = maskChecked;
    this.setState({
      maskChecked,
      roleMaskMap,
      indeterminate: !!maskChecked.length && maskChecked.length < allMask.length,
      checkAll: maskChecked.length === allMask.length,
    });
  };

  onCheckAllChange = e => {
    const { allMask } = this.props;
    const { roleMaskMap, selectedKeys } = this.state;

    const options = [];
    allMask.forEach(mask => {
      options.push(mask.right);
    });

    const {
      target: { checked },
    } = e;
    const maskChecked = checked ? options : [];
    roleMaskMap[selectedKeys[0]] = maskChecked;
    this.setState({
      maskChecked,
      indeterminate: false,
      checkAll: checked,
      roleMaskMap,
    });
  };

  render() {
    const {
      allotResVisible,
      handleModalVisible,
      values,
      resource: { resTree },
      allMask,
    } = this.props;
    const {
      expandedKeys,
      autoExpandParent,
      checkedKeys,
      selectedKeys,
      maskChecked,
      indeterminate,
      checkAll,
    } = this.state;
    const options = [];
    allMask.forEach(mask => {
      options.push(mask.right);
    });

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={540}
        style={{ top: 20 }}
        bodyStyle={{ padding: '10px 40px' }}
        title="分配资源权限"
        visible={allotResVisible}
        onCancel={() => handleModalVisible(false, false, values)}
        onOk={this.okHandle}
      >
        <Row gutter={8}>
          <Col span={16}>
            <Tree
              checkable
              expandedKeys={expandedKeys}
              checkedKeys={checkedKeys}
              selectedKeys={selectedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={this.onCheck}
              onSelect={this.onSelect}
              onExpand={this.onExpand}
              treeData={resTree}
            />
          </Col>
          <Col span={6}>
            <Checkbox
              disabled={selectedKeys.length === 0}
              indeterminate={indeterminate}
              onChange={this.onCheckAllChange}
              checked={checkAll}
            >
              所有权限
            </Checkbox>
            <Divider />
            <CheckboxGroup
              disabled={selectedKeys.length === 0}
              name="mask"
              options={options}
              value={maskChecked}
              onChange={this.onCheckboxChange}
            />
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default AllotRes2Role;
