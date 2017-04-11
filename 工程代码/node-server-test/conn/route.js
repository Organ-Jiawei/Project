var config = require('./config.js');
var rml = require('redis-msg-list');

var client = rml.createClient(config.RPC_MSG_LIST.cmd, config.REDIS_OPTIONS);

client.on('connect', function() {
	console.log('Rml-Cmd connected.');
});

client.on('close', function(err) {
	console.log('Rml-Cmd close: %s', err);
});

client.on('error', function(err) {
	console.log('Rml-Cmd error: %s', err);
});

// 执行命令
module.exports = function(id, msg) {
	try {
		var cp = JSON.parse(msg);
		// 指令名
		var cmd = cp.shift();
		// 参数数组
		var params = cp;

		// client.send([cmd, id, params]);

		console.log(msg);
	} catch (err) {
		console.log('Route error: %s', err);
	}
};
