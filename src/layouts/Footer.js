import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '安徽菜菜电子商务有限公司',
          title: '安徽菜菜电子商务有限公司',
          href: 'https://www.dailuobo.com/',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2019 呆萝卜大数据出品
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
