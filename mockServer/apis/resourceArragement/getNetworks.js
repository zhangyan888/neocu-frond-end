/**
 * Created by ssehacker on 2017/2/20.
 */

module.exports = {
  method: 'GET',
  url: '/api/ironic/install_sub_networks/',
  data: [
    {
      name: 'network1',
      id: 'NETWORK1',
    },
    {
      name: 'network2',
      id: 'NETWORK2',
    },
    {
      name: 'network3',
      id: 'NETWORK3',
    },
  ],
};
