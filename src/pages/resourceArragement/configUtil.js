/**
 * Created by ssehacker on 2017/3/20.
 */
const commonSetting = {
  width: 75,
  height: 100,
  inMenu: true,
};

const util = {};

const menu = window.menu || [];
const data = [
  {
    name: i18n('Instance'),
    type: 'VM',
    related: ['harddisk', 'IP', 'Vlan'],
    icon: 'icon-VM',
    color: '#6ba7ad',
    ...commonSetting,
    inMenu: false,
    actions: [
      {
        name: 'update',
        text: i18n('Update Params'),
      },
      {
        name: 'delete',
        text: i18n('Delete Module'),
      },
    ],
  },
  {
    name: i18n('Volume'),
    type: 'harddisk',
    icon: 'icon-disk',
    color: '#6ba7ad',
    ...commonSetting,
    inMenu: false,
    actions: [
      {
        name: 'update',
        text: i18n('Update Params'),
      },
      {
        name: 'delete',
        text: i18n('Delete Module'),
      },
    ],
  },
  {
    name: i18n('Public IP'),
    type: 'IP',
    related: ['firewall', 'router', 'balancing'],
    icon: 'icon-ip',
    color: '#ada96a',
    ...commonSetting,
    inMenu: menu.indexOf('IP') == -1,
    actions: [
      {
        name: 'update',
        text: i18n('Update Params'),
      },
      {
        name: 'delete',
        text: i18n('Delete Module'),
      },
    ],
  },
  {
    name: i18n('Private Network'),
    type: 'Vlan',
    related: ['firewall', 'balancing', 'router','physics'],
    icon: 'icon-diqiu',
    color: '#6a7ead',
    ...commonSetting,
    inMenu: menu.indexOf('Vlan') == -1,
    actions: [
      {
        name: 'update',
        text: i18n('Update Params'),
      },
      {
        name: 'delete',
        text: i18n('Delete Module'),
      },
    ],
  },
  {
    name: i18n('NLB'),
    type: 'balancing',
    related: ['listen','Vlan'],
    icon: 'icon-CLB',
    color: '#6aad84',
    ...commonSetting,
    inMenu: false,
    actions: [
      {
        name: 'update',
        text: i18n('Update Params'),
      },
      {
        name: 'addListener',
        text: i18n('Add Listener'),
      },
      {
        name: 'delete',
        text: i18n('Delete Module'),
      },
    ],
  },
  {
    name: i18n('Listener'),
    type: 'listen',
    color: '#6aad84',
    width: 75,
    height: 50,
    inMenu: false,
    actions: [
      {
        name: 'update',
        text: i18n('Update Params'),
      },
      {
        name: 'managePolicy',
        text: i18n('Manage Policy'),
      },
      {
        name: 'manageBackend',
        text: i18n('Manage Backend'),
      },
      {
        name: 'delete',
        text: i18n('Delete Module'),
      },
    ],
  },
  {
    name: i18n('Firewall'),
    type: 'firewall',
    related: ['IP'],
    icon: 'icon-lock',
    color: '#6aad84',
    ...commonSetting,
    inMenu: menu.indexOf('firewall') == -1,
    actions: [
      {
        name: 'update',
        text: i18n('Update Params'),
      },
      {
        name: 'addRule',
        text: i18n('Add Rule'),
      },
      {
        name: 'viewRule',
        text: i18n('View Rule'),
      },
      {
        name: 'delete',
        text: i18n('Delete Module'),
      },
    ],
  },
  {
    name: i18n('Router'),
    type: 'router',
    related: ['pptp', 'openvpn','Vlan'],
    icon: 'icon-router',
    color: '#6aad84',
    ...commonSetting,
    inMenu: menu.indexOf('router') == -1,
    actions: [
      {
        name: 'update',
        text: i18n('Update Params'),
      },
      {
        name: 'pptp',
        text: `${i18n('Enable')}VPN(PPTP)`,
      },
      {
        name: 'openvpn',
        text: `${i18n('Enable')}VPN(OPENVPN)`,
      },
      {
        name: 'delete',
        text: i18n('Delete Module'),
      },
    ],
  },
  {
    name: i18n('PPTP'),
    type: 'pptp',
    color: '#6aad84',
    width: 75,
    height: 50,
    inMenu: false,
    actions: [
      {
        name: 'update',
        text: i18n('Update Params'),
      },
      {
        name: 'manageUser',
        text: i18n('Manage User'),
      },
      {
        name: 'delete',
        text: i18n('Delete Module'),
      },
    ],
  },
  {
		name: i18n('OpenVPN'),
		type: 'openvpn',
		color: '#6aad84',
		width: 75,
		height: 50,
		inMenu: false,
		actions: [
			{
				name: 'update',
				text: i18n('Update Params'),
			},
			{
				name: 'delete',
				text: i18n('Delete Module'),
			},
		],
	},
  {
    name: i18n('Mysql'),
    type: 'mysql',
    related: ['mysqlReplica'],
    icon: 'icon-entityhost',
    color: '#6ba7ad',
    ...commonSetting,
    inMenu: false,
    actions: [
      {
        name: 'update',
        text: i18n('Update Params'),
      },
      {
        name: 'createInstance',
        text: i18n('Create Readonly Instance'),
      },
      {
        name: 'delete',
        text: i18n('Delete Module'),
      },
    ],
  },

  {
    name: i18n('Physics machine'),
    type: 'physics',
    related: ['IP','Vlan'],
    icon: 'icon-wuliji',
    color: '#6ba7ad',
    ...commonSetting,
    inMenu: true,
    actions: [
      {
        name: 'update',
        text: i18n('Update Params'),
      },
      {
        name: 'delete',
        text: i18n('Delete Module'),
      },
    ],
  },
  {
    name: i18n('Replica'),
    type: 'mysqlReplica',
    color: '#6aad84',
    width: 75,
    height: 50,
    inMenu: false,
    actions: [
      {
        name: 'update',
        text: i18n('Update Params'),
      },
      {
        name: 'delete',
        text: i18n('Delete Module'),
      },
    ],
  },
];

function filterProperty(obj, fields) {
  const foo = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && fields.indexOf(key) > -1) {
      foo[key] = obj[key];
    }
  }
  return foo;
}

function getRelations() {
  const relations = [];
  for (let i = 0; i < data.length; i++) {
    const block = data[i];
    if (block.related && block.related.length) {
      for (let j = 0; j < block.related.length; j++) {
        const type = block.related[j];
        const exist = block.related.find((item) => {
          return (item.sourceType === block.type && item.targetType === type)
            || (item.sourceType === type && item.targetType === block.type);
        });
        if (!exist) {
          relations.push({
            sourceType: block.type,
            targetType: type,
          });
        }
      }
    }
  }
  return relations;
}

util.getAllMenu = function () {
  const fields = ['name', 'type', 'icon'];
  return data.filter(item => item.inMenu).map(item => filterProperty(item, fields));
};

util.getBlock = function (type) {
  const block = data.find(item => item.type === type);
  const fields = ['name', 'type', 'icon', 'color', 'width', 'height'];
  return filterProperty(block, fields);
};

util.getActions = function (type) {
  const block = data.find(item => item.type === type);
  return block.actions;
};

util.connectable = function (type1, type2) {
  if (!this.relations) {
    this.relations = getRelations();
  }
  return !!this.relations.find(item => (item.sourceType === type1 && item.targetType === type2)
  || (item.sourceType === type2 && item.targetType === type1));
};

util.getProperty=function(type,property){
  const block = data.find(item => item.type === type);
  return block[property];
};

export default util;
