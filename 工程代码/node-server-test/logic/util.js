var util = {};

// 根据目录下文件生成功能对象
util.requireDir = function(dirName) {
	var walk = require('walkdir');
	var path = require('path');
	var obj = {};

	walk.sync(dirName, function(pathName, stats) {
		var fileName = pathName.split(path.sep).pop();
		console.log(fileName);
		obj[fileName.slice(0, -3)] = require(pathName);
	});

	return obj;
};

module.exports = util;
