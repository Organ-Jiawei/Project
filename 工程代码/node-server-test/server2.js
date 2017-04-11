// var register = require('babel-core/register');

// register({
//     presets: ['stage-3']
// });

/*-------------------------------------*/

global.util = require('./core/util.js');

var config = require('./core/config.js');
var route = require('./route.js');

var http = require('http');
var mysql = require('mysql');


var connection = mysql.createConnection(config.MYSQL_OPTIONS);

var sqlstr = 'select u.id `编号`, u.name `名称` , u.sex `性别`, phy.name `种族`, par.name `门派` from `t_user` u left join `t_party` par on par.id = u.party_id left join `t_phylet` phy on phy.id = u.phylet_id'

// connection.query('SHOW TABLE STATUS LIKE ?', 't_user', function(err, results) {
// 	console.log(results);
// });

// connection.query('SHOW COLUMNS FROM ??', 't_user', function(err, results) {
// 	console.log(results);
// });

connection.query('SELECT * FROM ??', 't_user', function(err, results) {
	console.log(results);
})

// http.createServer(function(request, response) {
// 	var idxOf = request.url.indexOf('?');
// 	var url, paramStr;

// 	if (idxOf == -1) {
// 		url = request.url;
// 		paramStr = '';
// 	} else {
// 		url = request.url.substring(0, idxOf);
// 		paramStr = request.url.substring(idxOf);
// 	}

// 	var modelArr = url.split('/');
// 	// 模块名
// 	var modelName = modelArr[modelArr.length - 1];
// 	if (modelName == '' && modelArr.length >= 2) {
// 		modelName = modelArr[modelArr.length - 2];
// 	}

// 	// 参数
// 	var params = {};
// 	paramStr.split('&').forEach(function(val) {
// 		var kv = val.split('=');
// 		params[kv[0]] = kv[1];
// 	});

// 	console.log("modelName: " + modelName);

// 	var result = route(modelName, params);
// 	response.end(result);
// }).listen(config.SERVER.port);

// connection.query(sqlstr, function(err, results) {
// 	if (err) throw err;

// 	// `results` is an array with one element for every statement in the query:
// 	console.log(results); // [{1: 1}]
// });

