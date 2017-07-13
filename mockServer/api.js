/**
 * Created by ssehacker on 2016/10/11.
 */
var router = require('koa-router')();
var apis = require('./apis');

const methods = ['get', 'put', 'post', 'patch', 'delete'];

apis.forEach((request)=> {
	var method = request.method.toLowerCase();
	if(methods.indexOf(method)===-1){
		return;
	}
	router[method].call(router, request.url, function* () {
		this.body = request.data;
	});
});

module.exports = router;