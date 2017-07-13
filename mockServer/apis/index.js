/**
 * Created by ssehacker on 2016/10/11.
 */

var recycleSetting = require('./recyclesetting');
var platformLicense = require('./platformlicense');
var loginSettings = require('./loginsettings');
var passwordSetting = require('./passwordsetting');
var storageShared = require('./storageshared');
var resourceArragement = require('./resourceArragement');
var storage = require('./storage');
var snapshot = require('./snapshot');

module.exports = [
  ...recycleSetting,
  ...platformLicense,
  ...loginSettings,
  ...passwordSetting,
  ...storageShared,
  ...resourceArragement,
  ...storage,
  ...snapshot,
];
