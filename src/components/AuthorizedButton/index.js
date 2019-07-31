import React, { Component } from 'react';

import check from './CheckPermissions';

import styles from './index.less';

class AuthorizedButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showElement: false,
    };
  }

  componentDidMount() {
    const {
      location: { pathname },
    } = window;
    const { mask } = this.props;
    this.setState({
      showElement: check(pathname, mask), // 判断是否有权限显示
    });
  }

  render() {
    const { children } = this.props;
    const { showElement } = this.state;
    return showElement ? <div className={styles.btnWrapper}>{children}</div> : null;
  }
}

export default AuthorizedButton;
