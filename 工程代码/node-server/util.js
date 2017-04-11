var util = {};

// 根据目录下文件生成功能对象
util.requireDir = function(dirName) {
	var walk = require('walkdir');
	var path = require('path');
	var obj = {};

	walk.sync(dirName, function(pathName, stats) {
		var fileName = pathName.split(path.sep).pop();
		var lasIdx = fileName.lastIndexOf('.');
		
		if (lasIdx > -1) {
			obj[fileName.slice(0, lasIdx)] = require(pathName);
		} else {
			// 文件夹
			// obj[fileName] = require(pathName);
		}
	});

	return obj;
};

// 获取表自增列值
util.getTableInc = function(tab) {
	var ids = Object.keys(tab);

	ids.sort(function(a, b) {
		return parseInt(a) > parseInt(b) ? -1 : 1;
	});

	var inc = ids.shift();

	return parseInt(inc) + 1;
};

// 获取随机整数
util.random = function(min, max) {
	if (typeof max == 'undefined') {
		max = min;
		min = 0;
	}

	return Math.floor(Math.random() * max + min);
};

module.exports = util;
