/**
 * Created by ssehacker on 2017/2/20.
 */

import Msg from './message';
import { error } from '../components/dialog';
import * as request from './request';
request.delete = request.del;

const util = {};

util.Msg = Msg;
function throttle(fn, timeout) {
  timeout = timeout || 500;
  let handler;
  return function (...args) {
    const ctx = this;
    clearTimeout(handler);
    handler = setTimeout(() => {
      fn.apply(ctx, args);
    }, timeout);
  };
}

function pick(o, ...fields) {
  return fields.reduce((a, x) => {
    if (Object.prototype.hasOwnProperty.call(o, x)) {
      a[x] = o[x];
    }
    return a;
  }, {});
}

function handleResError(err) {
  const msg = err && err.responseJSON;
  console.error(err);
  error(msg || Msg.OPERATE_ERROR);
}


function indexBy(object, key) {
  return Object.keys(object).reduce((result, k) => {
    const value = object[k];
    result[value[key]] = value;
    return result;
  }, {});
}

export {
  Msg,
  request,
  throttle,
  handleResError,
  pick,
  indexBy,
};
export default util;
