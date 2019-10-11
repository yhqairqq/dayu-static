export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/',
        redirect: '/overview/monitor',
      },
      // dashboard
      {
        path: '/overview',
        name: '仪表盘',
        icon: 'dashboard',
        routes: [
          {
            path: '/overview/monitor',
            name: '分析页',
            component: './OverView/monitor',
          },
        ],
      },
      //同步信息
      {
        path: '/channel',
        name: '同步管理',
        icon: 'profile',
        routes: [
          {
            path: '/channel',
            name: '同步channel',
            component: './Channel',
          },
        ],
      },
      //机器管理
      {
        path: '/cluster',
        name: '集群管理',
        icon: 'profile',
        routes: [
          {
            path: '/cluster/node',
            name: '节点管理',
            component: './Cluster/node',
          },
          {
            path: '/cluster/zookeeper',
            name: '同步channel',
            component: './Cluster/zookeeper',
          },
        ],
      },
      //配置管理
      {
        path: '/config',
        name: '配置管理',
        icon: 'profile',
        routes: [
          {
            path: '/config/mediasource',
            name: '数据源管理',
            component: './Configure/mediasource',
          },
          {
            path: '/config/media',
            name: '数据管理',
            component: './Configure/media',
          },
          {
            path: '/config/canal',
            name: 'canal管理',
            component: './Configure/canal',
          },
        ],
      },
      {
        path: '/full',
        name: '全量同步',
        icon: 'profile',
        routes: [
          {
            path: '/full',
            name: '全量同步',
            component: './FullSync',
          },
        ],
      },
      //监控管理
      {
        path: '/monitor',
        name: '监控管理',
        icon: 'profile',
        routes: [
          {
            path: '/monitor/logrecord',
            name: '日志管理',
            component: './Monitor/logrecord',
          },
          {
            path: '/monitor/alarm',
            name: '监控列表',
            component: './Monitor/alarm',
          },
          {
            path: '/monitor/analysis',
            name: '同步TOP',
            component: './Monitor/analysis',
          },
        ],
      },
      // 系统管理
      {
        path: '/system',
        icon: 'profile',
        name: '系统管理',
        routes: [
          {
            path: '/system/user-manage',
            name: '用户管理',
            component: './System/user',
          },
          {
            path: '/system/role-manage',
            name: '角色管理',
            component: './System/role',
          },
          {
            path: '/system/res-manage',
            name: '资源管理',
            component: './System/resource',
          },
        ],
      },
      // 基础信息管理
      {
        path: '/common',
        icon: 'profile',
        name: '基础信息管理',
        routes: [
          // 数据源管理
          {
            path: '/common/datasource-manage',
            name: '数据源管理',
            component: './SysCommon/datasource',
          },
          {
            path: '/common/common-info',
            name: '基础信息管理',
            component: './SysCommon/common-info',
          },
        ],
      },
      // 自助取数平台
      {
        path: '/peekdata',
        icon: 'funnel-plot',
        name: '自助取数',
        routes: [
          // 模型管理
          {
            path: '/peekdata/model-manage',
            name: '模型管理',
            component: './PeekData/ModelManage',
          },
          // 取数管理
          {
            path: '/peekdata/peek-manage',
            name: '取数管理',
            component: './PeekData/PeekManage',
          },
          // 分组管理
          {
            path: '/peekdata/tags',
            name: '标签管理',
            component: './PeekData/tags',
          },
          // 高级取数管理
          {
            path: '/peekdata/query-manage',
            name: '高级取数管理',
            component: './PeekData/AggQuery',
          },
          // 导入工具
          {
            path: '/peekdata/data-import',
            name: '数据导入',
            component: './PeekData/DataImport',
          },
        ],
      },
      // 报表管理
      {
        path: '/report',
        name: '报表管理',
        routes: [
          // 报表组管理
          {
            path: '/report/group',
            name: '报表组管理',
            component: './Report/report-group',
          },
          {
            path: '/report/design',
            name: '报表管理',
            component: './Report/report-design',
          },
          {
            path: '/report/log',
            name: '报表日志',
            component: './Report/report-log',
          },
        ],
      },
      {
        path: '/query',
        name: '报表查询',
        routes: [
          // 通用报表查询
          {
            path: '/query/:reportId/:radmon',
            hideInMenu: true,
            component: './Report/report-query',
          },
        ],
      },
      // 日志埋点管理
      {
        path: '/anchor',
        icon: 'profile',
        name: '埋点管理',
        routes: [
          // 应用管理
          {
            path: '/anchor/app-info',
            name: '埋点应用管理',
            component: './Anchor/AppInfoManage',
          },
          // 埋点管理
          {
            path: '/anchor/anchor-info',
            name: '埋点管理',
            component: './Anchor/AnchorManage',
          },
          // 日志上传策略
          {
            path: '/anchor/trans-strategy',
            name: '上传策略管理',
            component: './Anchor/StrategyManage',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
    ],
  },
];
