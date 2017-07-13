/**
 * Created by ssehacker on 2017/2/20.
 */
const getSnapshots = require('./getSnapshots');
const editStorage = require('./editSnapshot');
const getSnapshot = require('./getSnapshot');
const createStorage = require('./createStorage');
const getCreateSnapshotInfo = require('./getCreateSnapshotInfo');
const removeStorage = require('./removeStorage');

// todo 接口清理
module.exports = [
  getSnapshots,
  editStorage,
  getSnapshot,
  createStorage,
  getCreateSnapshotInfo,
  removeStorage,
];
