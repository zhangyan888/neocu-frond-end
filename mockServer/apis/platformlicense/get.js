/**
 * Created by ssehacker on 2017/2/20.
 */

module.exports = {
  method: 'GET',
  url: '/platformlicense/config',
  data: {
    ok: true,
    msg: '',
    data: {
      author: 'CloudUItra体验用户',
      timeOfLoadFile: '2016-5-5', //时间戳以秒为单位， js中是以毫秒为单位的
      expires: '2017-1-1',
      isExpired: true,
    }
  }
};