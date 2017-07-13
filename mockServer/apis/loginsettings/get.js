/**
 * Created by ssehacker on 2017/2/20.
 */
module.exports = {
  method: 'GET',
  url: '/platformadmin/login_settings/config',
  data: {
    ok: true,
    msg: '',
    data: {
      timeout: '15',
      maxFailureCount: '5',
      lockedTime: '1',
    }
  }
};