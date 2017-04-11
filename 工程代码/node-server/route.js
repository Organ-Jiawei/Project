var cmds = util.requireDir(__dirname + '/cmds');

function filterError(msg) {
	var params = [];
	try {
		params = JSON.parse(msg);

		if (!params instanceof Array) {
			throw 'msg is not an array';
		}

		if (params.length == 0 || typeof params[0] != 'string') {
			throw 'format error';
		}
	} catch(err) {
		params = [];
		console.log('Route error: %s', err);
	}
	return params;
};

// 执行命令
module.exports = function(id, msg) {
	var params = filterError(msg);

	// 异常参数
	if (params.length == 0) {
		return;
	}

	// 指令名
	var cmd = params.shift();

	if (!cmds[cmd]) {
		console.log('Route error: cmd does not exist');
		return;
	}

	// 用户ID加入到参数列表的首位
	params.unshift(id);

	cmds[cmd].apply(cmds, params);
};
