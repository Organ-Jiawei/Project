module.exports = function(id, params) {
	console.log('ID %s, 进入了Chat模块', id);

	for (var i in params) {
		console.log('params.%s: %s', i, params[i]);
	}

	var uid = params[0];
	var content = params[1];

	resp.send('chat', id, params);
};
