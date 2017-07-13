module.exports = {
  method: 'GET',
  url: '/project/storage/api',
  data: {
    msg: '',
    ok: true,
    data: {
      has_prev_data: false,
      has_more_data: true,
      rows: [{
        id: '1311cb23-fc00-436a-98ac-d3dd98ab3187',
        name: 'v1',
        size: 10,
        status: 'in-use',
        volume_type: 'Capacity',
        multiattach: true,
        bootable: false,
        created_at: '2017年5月15日 14:33',
        updated_at: '2017年5月15日 14:55',
        actions: [{
          id: 'delete',
          enabled: true,
        }]
      },{
        id: '1311cb23-fc00-436a-98ac-d3dd98ab3180',
        name: 'v1',
        size: 20,
        status: 'in-use',
        volume_type: 'Capacity',
        multiattach: false,
        bootable: false,
        created_at: '2017年5月15日 14:33',
        updated_at: '2017年5月15日 14:55',
        "actions": [{
          "id": "edit",
          "enabled": true,
        },{
          "id": "delete",
          "enabled": false,
        },{
          "id": "edit-attachments",
          "enabled": true,
        },{
          "id": "create-snapshot",
          "enabled": true,
        },{
          "id": "extend-volume",
          "enabled": true,
        },{
          "id": "auto-snapshot",
          "enabled": true,
        },{
          "id": "copy-volume",
          "enabled": true,
        }]
      }],
      table_actions: [{
        id: 'create',
        enabled: true,
      }, {
        id: 'delete',
        enabled: false,
      }],
    }
  }
};
