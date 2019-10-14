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
  Tree,
  Icon,
  Divider,
  Descriptions,
  Tabs,
  Row,
  Col,
  Button,
  Table,
  Popover,
} from 'antd';

import styles from '../../../styles/Manage.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = Tree;
const { TabPane } = Tabs;
const { SHOW_PARENT } = TreeSelect;

@Form.create()
@connect(({  }) => ({
    
}))
class MediaForm extends React.Component {
  static defaultProps = {

  };
  
  constructor(props) {
    super(props);
    const {  } = props;

    this.state = {
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  

  componentDidMount() {
    const { dispatch} = this.props;
    const {  } = this.state;
  }
  
  render() {
    const {
    } = this.state;
    const {
        form,
    } = this.props;

    return (
      <div>
         
      </div>
    );
  }
}

export default MediaForm;
