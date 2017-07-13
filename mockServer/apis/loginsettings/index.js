/**
 * Created by ssehacker on 2017/2/20.
 */

const getRes = require('./get');
const putRes = require('./put');
const getUserInfo = require('./getUserInfo');

module.exports = [
  getRes,
  putRes,
  getUserInfo,
];
