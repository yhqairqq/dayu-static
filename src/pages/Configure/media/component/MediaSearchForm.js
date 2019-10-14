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
class MediaSearchForm extends React.Component {
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
         <div className={styles.message}>
            <div className={styles.ManageOperator}>
              <span className={styles.querySubmitButtons}>
                <div>
                <Form layout="inline">
                    <FormItem key="name" {...this.formLayout} label="表名">
                    {form.getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入表名' }],
                        initialValue: '',
                    })(<Input placeholder="请输入表名" />)} 
                    </FormItem>
                    <FormItem key="type" {...this.formLayout} label="数据源类型">
                    {form.getFieldDecorator('type', {
                        rules: [{ required: true, message: '数据源类型' }],
                        initialValue: 'MYSQL',
                    })(
                        <Select style={{ width: 300 }} mode="single" placeholder="数据源类型">
                        <Option key={'MYSQL'} value={'MYSQL'}>
                                MYSQL
                            </Option>
                            <Option key={'ROCKETMQ'} value={'ROCKETMQ'}>
                                ROCKETMQ
                            </Option>
                    </Select>
                    )}
                    </FormItem>
                </Form>

                </div>
                <Button type="primary">查询</Button>
              </span>
            </div>
          </div>
      </div>
    );
  }
}

export default MediaSearchForm;
