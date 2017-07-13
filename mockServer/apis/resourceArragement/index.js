/**
 * Created by ssehacker on 2017/2/20.
 */
const getSystem = require('./getSystem');
const getFlavors = require('./getFlavors');
const getTroveFlavors = require('./getTroveFlavors');
const getVolumeTypes = require('./getVolumeTypes');
const getFlatNetworks = require('./getFlatNetworks');
const getNetworks = require('./getNetworks');
const getMysqlFlavors = require('./getMysqlFlavors');
const getDatestoreVersion = require('./getDatestoreVersion');
const getMysqlFilterFlavors = require('./getMysqlFilterFlavors');
const postData = require('./postData');
const postNewData = require('./postNewData');
const getImage = require('./getImage');
const getPool_id = require('./getPool_id');
const getPrivatenetwork = require('./getPrivatenetwork');
module.exports = [
  getSystem,
  getFlavors,
  getTroveFlavors,
  getVolumeTypes,
  getFlatNetworks,
  getNetworks,
  getMysqlFlavors,
  getDatestoreVersion,
  getMysqlFilterFlavors,
  postData,
  postNewData,
  getImage,
  getPool_id,
  getPrivatenetwork
];
