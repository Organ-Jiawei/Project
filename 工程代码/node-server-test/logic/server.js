// 全局变量声明
global.util = require('./util.js');
global.resp = require('./resp.js');

var config = require('./config.js');
var route = require('./route.js');
var rml = require('redis-msg-list');

var server = rml.createServer(config.RPC_MSG_LIST.cmd, config.REDIS_OPTIONS);

server.on('connect', function() {
	console.log('Rml-Cmd connected.');
});

server.on('close', function(err) {
	console.log('Rml-Cmd close: %s', err);
});

server.on('error', function(err) {
	console.log('Rml-Cmd error: %s', err);
});

server.on('message', function(msg, callback) {
	route(msg, function(err) {
		if (err) {
			console.log(err);
		}
		callback();
	});
});

server.listen(1);

console.log('Server is starting...');
