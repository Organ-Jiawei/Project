var url = require('url');
var query = require('querystring');

// 用户验证
module.exports = function(info, callback) {
	var qs = url.parse(info.req.url).query;
	var params = query.parse(qs);

	try {
		var channel = require('./channel/' + params.channel + '.js');
	} catch (err) {
		return callback(false);
	}

	channel(params, function(uid) {
		if (uid) {
			info.req.uid = params.channel + '_' + uid;
			callback(true);
		} else {
			callback(false);
		}
	});
};
