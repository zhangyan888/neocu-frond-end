module.exports = {
  method: 'GET',
  url: '/project/storage/api/create_volume',
  data: {
    "ok": true,
    "msg": "",
    "data": {
      "name": "v1_copy",
      "description": "description for v1",
      "origin_id": "1311cb23-fc00-436a-98ac-d3dd98ab3187",  //源云硬盘id
      "origin_name": "v1", //源云硬盘名称
      "size": 10, //单位为GB
      "multiattach": false, // 是否为共享盘
      "volume_type": "test"
    }
  }
};
