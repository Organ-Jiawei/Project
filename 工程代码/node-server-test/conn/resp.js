var config = require('./config.js');
var conn = require('./conn.js');
var rml = require('redis-msg-list');

var server = rml.createServer(config.RPC_MSG_LIST.res, config.REDIS_OPTIONS);

server.on('connect', function() {
	console.log('Rml-Res connected.');
});

server.on('close', function(err) {
	console.log('Rml-Res close: %s', err);
});

server.on('error', function(err) {
	console.log('Rml-Res error: %s', err);
});

server.on('message', function(msg, callback) {
	try {
		var cp = JSON.parse(msg);
		var ope = cp.shift();

		conn[ope].apply(conn, cp);
	} catch(err) {
		console.log('Resp error: %s', err);
	}
	callback();
});

server.listen(1);
