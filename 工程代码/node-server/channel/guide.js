// 以游客身份进入
module.exports = function(params, callback) {
	var uid = params.uid || '';
	var regTest = /^[a-zA-Z0-9]+$/;

	if (uid.length <= 16 && regTest.test(uid) && data.user.t_user[uid]) {
		callback(uid);
	} else {
		callback(0);
	}
};
