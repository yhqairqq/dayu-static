import React from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
// 需要修改样式就修改这个引用并且修改codemirror theme option
import 'codemirror/theme/ambiance.css';
import 'codemirror/mode/sql/sql';
import 'codemirror/addon/hint/show-hint.css';
import './hint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/addon/comment/comment';
import 'codemirror/keymap/sublime';
import { Icon, Tooltip, message } from 'antd';
import copyToClipboard from 'copy-to-clipboard';
import sqlFormatter from './SqlFormatter/sqlFormatter';

export default class SqlEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ExcludedIntelliSenseTriggerKeys: {
        '8': 'backspace',
        '9': 'tab',
        '13': 'enter',
        '16': 'shift',
        '17': 'ctrl',
        '18': 'alt',
        '19': 'pause',
        '20': 'capslock',
        '27': 'escape',
        '32': 'space',
        '33': 'pageup',
        '34': 'pagedown',
        '35': 'end',
        '36': 'home',
        '37': 'left',
        '38': 'up',
        '39': 'right',
        '40': 'down',
        '45': 'insert',
        '46': 'delete',
        '91': 'left window key',
        '92': 'right window key',
        '93': 'select',
        '107': 'add',
        '109': 'subtract',
        '110': 'decimal point',
        '111': 'divide',
        '112': 'f1',
        '113': 'f2',
        '114': 'f3',
        '115': 'f4',
        '116': 'f5',
        '117': 'f6',
        '118': 'f7',
        '119': 'f8',
        '120': 'f9',
        '121': 'f10',
        '122': 'f11',
        '123': 'f12',
        '144': 'numlotettck',
        '145': 'scrolllock',
        '186': 'semicolon',
        '187': 'equalsign',
        '188': 'comma',
        '189': 'dash',
        '191': 'slash',
        '192': 'graveaccent',
        '220': 'backslash',
        '222': 'quote',
      },
      value: '',
    };
    this.editor = null;
  }

  componentDidMount() {
    const { hintOptions, height, value, readOnly = false } = this.props;
    this.editor = CodeMirror.fromTextArea(this.codeDom, {
      styleActiveLine: true,
      matchBrackets: true,
      theme: 'default',
      mode: 'text/x-mysql',
      indentWithTabs: true,
      autofocus: true,
      lineWrapping: true,
      completeSingle: false,
      readOnly,
      extraKeys: {
        Ctrl: 'autocomplete',
      },
      hintOptions,
    });
    this.editor.setSize('auto', height || '500px');
    this.editor.setValue(value || '');
    this.setState({
      value: value || '',
    });

    this.editor.on('keyup', (cm, event) => {
      const { ExcludedIntelliSenseTriggerKeys } = this.state;
      this.setState({
        value: this.getTextareaCode(),
      });
      if (
        !cm.state.completionActive &&
        !ExcludedIntelliSenseTriggerKeys[event.keyCode.toString()]
      ) {
        CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.state;
    if (nextProps.value !== value) {
      this.editor.setValue(nextProps.value);
      this.setState({
        value: nextProps.value,
      });
    }
  }

  getTextareaCode = () => this.editor.getValue();

  copy = () => {
    const nowValue = this.getTextareaCode();
    copyToClipboard(nowValue);
    message.info('拷贝成功');
  };

  format(value) {
    this.editor.setValue(sqlFormatter.format(value));
  }

  render() {
    const { value } = this.state;
    return (
      <div>
        <div style={{ backgroundColor: '#f7f7f7', paddingLeft: '1em' }}>
          <Tooltip title="点我格式化">
            <Icon type="file-done" onClick={() => this.format(value)} />
          </Tooltip>
          <Tooltip title="点我复制">
            <Icon type="copy" onClick={() => this.copy()} style={{ paddingLeft: '1em' }} />
          </Tooltip>
        </div>
        <div
          style={{
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: '#e8e8e8',
            lineHeight: '1em',
          }}
        >
          <textarea
            ref={p => {
              this.codeDom = p;
            }}
          />
        </div>
      </div>
    );
  }
}
