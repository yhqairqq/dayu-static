import React, { Component } from 'react';

import styles from './index.less';

class AuthorizedButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { children } = this.props;
    return <div className={styles.btnWrapper}>{children}</div>;
  }
}

export default AuthorizedButton;
