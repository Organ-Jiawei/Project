module.exports = function(id, params) {
	console.log('ID %s, 进入了Buy模块', id);

	for (var i in params) {
		console.log('params.%s: %s', i, params[i]);
	}
};
