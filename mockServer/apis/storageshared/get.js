/**
 * Created by ssehacker on 2017/2/20.
 */
var attached = [];
var available = [];
var rand ;
for(var i=0; i<10; i++) {
  rand = Math.random();
  if(rand < 0.5) {
    attached.push({
      id: i+'',
      name: 'name'+i,
      device: '/dev/vdb/'+i,
    });
  } else {
    available.push({
      id: i+'',
      name: 'name' +i,
    });
  }
}
module.exports = {
  method: 'GET',
  url: '/project/storage/:volume_id/shared_volume_api/',
  data: {
    msg: '',
    ok: true,
    data: {
      attached,
      available
    }
  }
};
