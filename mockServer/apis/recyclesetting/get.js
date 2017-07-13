/**
 * Created by ssehacker on 2017/2/20.
 */

module.exports = {
  method: 'GET',
  url: '/platformrecyclesetting/config',
  data: {
    msg: '',
    ok: true,
    data: [
      {
        resource_type: 'volume',
        default_delay: '72',
        delay: '36',
      }
    ]
  }
};
