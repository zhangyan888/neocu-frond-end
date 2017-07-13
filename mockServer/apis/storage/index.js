/**
 * Created by ssehacker on 2017/2/20.
 */
const getStorages = require('./getStorages');
const editStorage = require('./editStorage');
const getStorage = require('./getStorage');
const createSnapshot = require('./createSnapshot');
const getUsages = require('./getUsages');
const removeStorage = require('./removeStorage');
const getStorageTypeEnume = require('./getStorageTypeEnume');
const createStorage = require('./createStorage');
const getPureStorage = require('./getPureStorage');
const resizeStorage = require('./resizeStorage');
const getAutoSnapshotSetting = require('./getAutoSnapshotSetting');
const saveAutoSnapshotSetting = require('./saveAutoSnapshotSetting');
const getStorageInfoBeforeCopy = require('./getStorageInfoBeforeCopy');
const getAttachableInstance = require('./getAttachableInstance');
const attachStorage = require('./attachStorage');

module.exports = [
  getStorages,
  editStorage,
  getStorage,
  createSnapshot,
  getUsages,
  removeStorage,
  getStorageTypeEnume,
  createStorage,
  getPureStorage,
  resizeStorage,
  getAutoSnapshotSetting,
  saveAutoSnapshotSetting,
  getStorageInfoBeforeCopy,
  getAttachableInstance,
  attachStorage,
];
