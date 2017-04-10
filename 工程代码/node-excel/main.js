var fs = require('fs');
var path = require('path');
var walk = require('walkdir');
var xlsx = require('node-xlsx');

var mainFn = function() {
	directoryFn('./excel');
	directoryFn('./json/client/');
	directoryFn('./json/server/');

	walk.sync('./excel', function(pathName, stats) {
		var fileName = pathName.split(path.sep).pop();

		if (!fileName.endsWith('.xlsx')) {
			return;
		}

		for (var sheet of xlsx.parse(fs.readFileSync(pathName))) {
			if (!sheet.name.startsWith('t_')) {
				continue;
			}

			generateFn(sheet);
		}
	});
};

var analyFn = function(data, type) {
	var title_arr = data[1];
	var class_arr = data[2];
	var type_arr = data[3];
	var result = {};

	for (var i = 4; i < data.length; i++) {
		result[data[i][0]] = {};
		for (var j = 0; j < title_arr.length; j++) {
			if (class_arr[j] == type || class_arr[j] == 2) {
				if (type_arr[j] == 'int') {
					result[data[i][0]][title_arr[j]] = parseInt(data[i][j]);
				}

				if (type_arr[j] == 'string') {
					result[data[i][0]][title_arr[j]] = data[i][j];
				}

				if (type_arr[j] == 'List') {
					result[data[i][0]][title_arr[j]] = data[i][j].trim().slice(1, -1).split(',');
				}

				if (type_arr[j] == 'Map') {
					result[data[i][0]][title_arr[j]] = [];
					var keys = data[i][j].trim().slice(1, -1).split(',');
					for (var k of keys) {
						result[data[i][0]][title_arr[j]].push(k.split('='));
					}
				}
			}
		}

		if (Object.keys(result[data[i][0]]).length == 0) {
			delete result[data[i][0]];
		}
	}
	return result;
};

var generateFn = function(sheet) {
	var data = analyFn(sheet.data, 1);

	if (Object.keys(data).length > 0) {
		fs.writeFileSync(`./json/client/${sheet.name}.json`, JSON.stringify(data));
		console.log(`生成文件  ./json/client/${sheet.name}.json`);
	}

	data = analyFn(sheet.data, 0);

	if (Object.keys(data).length > 0) {
		fs.writeFileSync(`./json/server/${sheet.name}.json`, JSON.stringify(data));
		console.log(`生成文件  ./json/server/${sheet.name}.json`);
	}
};

var directoryFn = function(path) {
	if (path.startsWith('./')) {
		path = path.slice(2);
	}

	if (path.endsWith('/')) {
		path = path.slice(0, -1);
	}

	var arr = path.split('/');
	var dirpath = '.';

	for (var f of arr) {
		dirpath += '/' + f;

		fs.existsSync(dirpath) || fs.mkdirSync(dirpath);
	}
};

var deleteFolder = function(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

deleteFolder('./json');

mainFn();
