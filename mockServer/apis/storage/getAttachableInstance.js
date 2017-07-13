// 尚未有连接
var res1 = {
  "ok": true,
  "msg": "",
  "data": {
    "attached": false, //是否已经连接
    "instances": [
      {"id": "xxxxxxxx-xxxx-xxxx-xxxx-instance1", "name":"instance1"},
      {"id": "xxxxxxxx-xxxx-xxxx-xxxx-instance2", "name":"instance2"},
      {"id": "xxxxxxxx-xxxx-xxxx-xxxx-instance3", "name":"instance3"}
    ],
    "attachments": null,
  }
};

// 已经有连接
var res2 = {
  "ok": true,
  "msg": "",
  "data": {
    "instance_name": "centos7_init",
    "attachment_id": "f9d552a5-68d6-403f-9ccb-e69866da5473",
    "device": "/dev/vdb",
    "server_id": "082cd286-41de-40f9-b8e4-2e36f129d437",
    "volume_id": "b08d7912-d106-4593-8c2c-a137b08d9d59"
  },
};

module.exports = {
  method: 'GET',
  url: `/project/storage/api/:id/edit_attachments`,
  data: res2,
};
