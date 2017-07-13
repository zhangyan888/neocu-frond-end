module.exports = {
  method: 'GET',
  url: '/project/storage/api/usages',
  data: {
    "ok": true,
    "msg": "",
    "data": {
      "totalGigabytesUsed": "4", // 云硬盘容量，已使用4G
      "maxTotalVolumeGigabytes": "1000", //null: 无限制; 云硬盘容量，总计1000G
      "snapshotsUsed": "1", // 快照数量，已使用1个
      "maxTotalSnapshots": "10", //null: 无限制;  快照数量，总计10个
      "volumesUsed": "1", // 云硬盘数量，已使用1个
      "maxTotalVolumes": "10", //null: 无限制;  云硬盘数量，总计10个
    }
  }
};