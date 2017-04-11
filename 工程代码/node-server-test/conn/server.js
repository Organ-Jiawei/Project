var ws = require('ws');
var conn = require('./conn.js');
var route = require('./route.js');
var config = require('./config.js');
var server = require('http').createServer();

var wss = new ws.Server({
	server: server,
	verifyClient: require('./verify.js'),
});

// 启动回应监听服务
require('./resp.js');

wss.on('connection', function(client) {
	// 用户标识
	var id = client.upgradeReq.uid;

	// 添加用户
	conn.add(id, client);
	// console.log(id + ' connected. Online(' + wss.clients.length + ')');

	client.on('message', function(msg) {
		// 分发指令
		route(id, msg);
	});

	client.on('close', function(code) {
		// 删除用户
		if (conn.del(id, client)) {
			console.log('close: ' + id);
		}

		// console.log(id + ' closed. Online(' + wss.clients.length + ')');
	});
});

server.allowHalfOpen = false;
server.listen(config.HOST.port, config.HOST.ip);

console.log('服务器启动!');
