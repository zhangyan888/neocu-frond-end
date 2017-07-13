module.exports = {
  method: 'GET',
  url: '/project/snapshot/api/:id',
  data: {
    "ok": true,
    "msg": "",
    "data": {
      "id": "1311cb23-fc00-436a-98ac-d3dd98ab3187",
      "name": "v1",
      "description": "description for v1",
      "project": "demo",
      "status": "in-use", // 由前端翻译，可能的值包括：in-use,available,creating,downloading,restoring,error,error_extending,maintenance
      "created_at": "2017年5月15日 14:33", // 日期一律由后端渲染
      "updated_at": "2017年5月15日 14:55",
      "actions": [{
        "id": "edit",
        "enabled": true,
      },{
        "id": "delete",
        "enabled": true,
      }]
    }
  }
};
