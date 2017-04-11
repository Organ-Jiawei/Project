var cmds = util.requireDir(__dirname + '/cmds');

// 路由模块
module.exports = function(msg, callback) {
	try {
		var cp = JSON.parse(msg);
		var cmd = cp[0];
		var id = cp[1];
		var params = cp[2];

		console.log('cmd: %s, id: %s, params: %s', cmd, id, JSON.stringify(params));

		cmds[cmd](id, params);
		callback();
	} catch (err) {
		callback('Logic Route error: ' + err);
	}
};
