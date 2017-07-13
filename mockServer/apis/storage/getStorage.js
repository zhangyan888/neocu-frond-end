module.exports = {
  method: 'GET',
  url: '/project/storage/api/:id',
  data: {
    "ok": true,
    "msg": "",
    "data": {
      "id": "1311cb23-fc00-436a-98ac-d3dd98ab3187",
      "name": "v1",
      "description": "description for v1",
      "size": 10, // 单位为GB
      "status": "in-use", // 由前端翻译，可能的值包括：in-use,available,creating,downloading,restoring,error,error_extending,maintenance
      "volume_type": "Capacity", // 无需翻译。
      "multiattach": false, // 是否为共享盘
      "bootable": false, // 是否可启动
      "created_at": "2017年5月15日 14:33", // 日期一律由后端渲染
      "updated_at": "2017年5月15日 14:55",
      "autosnapshot_status": "on", // 由前端翻译，可能的值包括：on, off
      "autosnapshot_time": "01:01", // 自动快照时间
      "autosnapshot_cycle": "每周一", // 自动快照周期
      "autosnapshot_limit": 10, // 最大保留个数
      "attached_to": [{ // 该硬盘所连接的服务器
        "server_id": "6971b938-34f3-40c1-a8c9-80c5c2371a78", // 服务器id，用于构造超链接
        "server_name": "server1", // 服务器名称
        "device": "/dev/vdb" // 该硬盘在服务器上的挂载点
      }],
      "actions": [{
        "id": "edit",
        "enabled": true,
      },{
        "id": "delete",
        "enabled": true,
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
    }
  }
};
