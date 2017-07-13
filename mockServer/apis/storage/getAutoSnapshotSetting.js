module.exports = {
  method: 'GET',
  url: '/project/storage/api/:id/auto_snapshot',
  data: {
    "ok": true,
    "msg": "",
    "data": {
      "excateTime": "day", //day：每天（默认）， week：每周
      "executeCycle": 1, //当excateTime=1时才显示， None:无， 1：周一， 2：周二 ...
      "executeCycleHour": 1, //凌晨1点， None：无
      "executeCycleMinute": 10, //凌晨1点10分， None：无
      "snapshotLimit": 10, //保留快照的个数 10个， 默认10 最小1 最大10
      "executeStatus": true, //启动状态
    }
  }
};
