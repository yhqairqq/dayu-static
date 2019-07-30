import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import styles from './index.less';

@withRouter
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
