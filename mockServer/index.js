/**
 * Created by ssehacker on 2016/10/8.
 */
var serve = require('koa-static');
var koa = require('koa');
var path = require('path');
var apiRoute = require('./api');
var app = koa();

var router = require('koa-router')();

app.use(serve(path.resolve(__dirname , '../dist')));
app.use(serve(path.resolve(__dirname ,'../public')));

var views = require('koa-views');

console.log(path.resolve(__dirname, '../public'));
app.use(views( path.resolve(__dirname, '../public') ));

//中间件： 打印访问路径,耗时
app.use(function *(next){
	var start = Date.now();

	yield next;
	var time = Date.now()-start;
	console.log(this.request.method +'\t'+this.request.url +'\t' + time + 'ms');
});

router.get('/', function * (next) {
	// let pathName = this.request.url;
	// pathName = pathName.substring(pathName.indexOf('/'));
	// pathName = pathName || 'demo';
	yield this.render('index');
});

router.get('/:module', function * (next) {
	// console.log(this.params.module);
	yield this.render('index');
});



app
	.use(apiRoute.routes())
	.use(router.routes())
	.use(router.allowedMethods());


app.listen(3003);

console.log('listening on port 3003');