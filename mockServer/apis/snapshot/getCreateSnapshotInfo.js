module.exports = {
  method: 'GET',
  url: '/project/storage/api/:id/create_snapshot',
  data: {
    "ok": true,
    "msg": "",
    "data": {
      "totalGigabytesUsed": "4", //已使用4G
      "maxTotalVolumeGigabytes": "1000", //总计1000G
      "snapshotsUsed": "1", //已使用1个
      "maxTotalSnapshots": "10", //总计10个
      "volumeStatus": "in-use", //云硬盘状态，in-use：被使用 需要提示信息
  }
}
};