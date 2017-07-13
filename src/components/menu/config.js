/**
 * Created by ssehacker on 2016/10/17.
 */
const menuContent = [];

const overviewMenu = {
  title: 'Platformoverview',
  id: 'platformoverview',
  icon: 'icon-tachometer',
  subMenu: [
    {
      sid: 'overview',
      title: '概况',
      url: '/platformoverview',
    },
  ],
};
menuContent.push(overviewMenu);

const managementMenu = {
  title: '管理',
  id: 'platformadmin',
  icon: 'icon-key',
  subMenu: [
    {
      sid: 'user',
      title: '用户',
      url: '/platformadmin/user',
    },
    {
      sid: 'sitesettings',
      title: '站点设置',
      url: '/platformadmin/sitesettings',
    },
    {
      sid: 'projects',
      title: '项目',
      url: '/platformadmin/projects',
    },
    {
      sid: 'logs',
      title: '操作日志',
      url: '/platformadmin/logs',
    },
    {
      sid: 'services',
      title: '底层服务',
      url: '/platformadmin/services',
    },
    {
      sid: 'recoverylog',
      title: '故障修复日志',
      url: '/platformadmin/recoverylog',
    },
    {
      sid: 'compute_hosts',
      title: '计算节点',
      url: '/platformadmin/compute_hosts',
    },
    {
      sid: 'ha',
      title: 'HA',
      url: '/platformadmin/ha',
    },
  ],
};
menuContent.push(managementMenu);

const storageMenu = {
  title: '存储',
  id: 'platformstorage',
  icon: 'icon-database',
  subMenu: [
    {
      sid: 'hardware',
      title: '云硬盘',
      url: '/platformstorage',
    },
    {
      sid: 'snapshots',
      title: '云硬盘快照',
      url: '/platformstorage/snapshots',
    },
    {
      sid: 'volume_types',
      title: '云硬盘类型',
      url: '/platformstorage/volume_types',
    },
  ],
};
menuContent.push(storageMenu);

const networkMenu = {
  title: '网络',
  id: 'platformnetwork',
  icon: 'icon-chain',
  subMenu: [
    {
      sid: 'networks',
      title: '网络',
      url: '/platformnetwork/networks',
    },
    {
      sid: 'float_ip',
      title: '浮动IP',
      url: '/platformnetwork',
    },
    {
      sid: 'security_groups',
      title: '安全组',
      url: '/platformnetwork/security_groups',
    },
    {
      sid: 'routers',
      title: '路由器',
      url: '/platformnetwork/routers',
    },
    {
      sid: 'qoses',
      title: 'Qos',
      url: '/platformnetwork/qoses',
    },
  ],
};
menuContent.push(networkMenu);

const computeMenu = {
  title: '计算',
  id: 'platformcompute',
  icon: 'icon-large',
  subMenu: [
    {
      sid: 'vmsnapshots',
      title: '云主机快照',
      url: '/platformcompute/vmsnapshots',
    },
    {
      sid: 'flavors',
      title: '云主机类型',
      url: '/platformcompute/flavors',
    },
    {
      sid: 'image',
      title: '镜像',
      url: '/platformcompute',
    },
    {
      sid: 'usbs',
      title: 'USB管理',
      url: '/platformcompute/usbs',
    },
    {
      sid: 'iso',
      title: 'ISO',
      url: '/platformcompute/iso',
    },
    {
      sid: 'instances',
      title: '云主机',
      url: '/platformcompute/instances',
    },
    {
      sid: 'aggregates',
      title: '主机聚合',
      url: '/platformcompute/aggregates',
    },
  ],
};
menuContent.push(computeMenu);

const monitorMenu = {
  title: '监控',
  id: 'platformmonitor',
  icon: 'icon-eye',
  subMenu: [
    {
      sid: 'resource',
      title: '资源监控',
      url: '/platformmonitor',
    },
  ],
};
menuContent.push(monitorMenu);

export default menuContent;
