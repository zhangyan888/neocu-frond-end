module.exports = {
  method: 'GET',
  url: '/project/snapshot/api',
  data: {
    msg: '',
    ok: true,
    data: {
      has_prev_data: false,
      has_more_data: true,
      rows: [{
        id: '1311cb23-fc00-436a-98ac-d3dd98ab3187',
        name: 'test1',
        size: 10,
        status: 'in-use',
        volume_name: 'test111',
        volume_id: '23-fc00-436a-98ac-d3dd9',
        created_at: '2017年5月15日 14:33',
        updated_at: '2017年5月15日 14:55',
        actions: [{
          id: 'delete',
          enabled: true,
        }]
      }, {
        id: '1311cb23-fc00-436a-98ac-d3dd98ab3180',
        name: 'test2',
        size: 20,
        status: 'in-use',
        volume_name: 'test111',
        volume_id: '23-fc00-436a-98ac-d3dd9',
        created_at: '2017年5月15日 14:33',
        updated_at: '2017年5月15日 14:55',
        actions: [{
          id: 'delete',
          enabled: true,
        }]
      }, {
        id: '1311cb23-fc00-436a-98ac-d3dd98ab3430',
        name: 'test3',
        size: 20,
        status: 'in-use',
        volume_name: 'test111',
        volume_id: '23-fc00-436a-98ac-d3dd9',
        created_at: '2017年5月15日 14:33',
        updated_at: '2017年5月15日 14:55',
        actions: [{
          id: 'delete',
          enabled: true,
        }]
      }],
      table_actions: [{
        id: 'delete',
        enabled: true,
      }],
    }
  }
};
