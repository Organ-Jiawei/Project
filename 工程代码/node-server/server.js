// 全局变量声明
global.util = require('./util.js');
global.conn = require('./conn.js');
global.data = util.requireDir('./data');

var ws = require('ws');
var route = require('./route.js');
var config = require('./config.js');
var server = require('http').createServer();

var wss = new ws.Server({
	server: server,
	verifyClient: require('./verify.js'),
});

wss.on('connection', function(client) {
	// 用户标识
	var id = client.upgradeReq.uid;

	// 添加用户
	conn.add(id, client);

	// 分发指令
	client.on('message', function(msg) { route(id, msg); });

	// 用户断线
	client.on('close', function(code) { conn.del(id, client); });
});

server.allowHalfOpen = false;
server.listen(config.HOST.port, config.HOST.ip);

console.log('Server is starting ...');
