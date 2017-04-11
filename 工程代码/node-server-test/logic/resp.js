var config = require('./config.js');
var rml = require('redis-msg-list');

var client = rml.createClient(config.RPC_MSG_LIST.res, config.REDIS_OPTIONS)

client.on('connect', function() {
	console.log('Rml-Res connected.');
});

client.on('close', function(err) {
	console.log('Rml-Res close: %s', err);
});

client.on('error', function(err) {
	console.log('Rml-Res error: %s', err);
});

var resp = {};

// 错误给指定的用户
resp.err = function(cmd, id, params) {
	var resp = !!params ?? [cmd, 'error'].concat(params) : [cmd, 'error'];
	client.send(['send', id, resp]);
};

// 发送给指定的用户
resp.send = function(cmd, id, params) {
	var resp = !!params ? [cmd].concat(params) : [cmd];
	client.send(['send', id, resp]);
};

// 同步给指定的用户 (需要用户在线)
resp.sync = function() {
	// var roleid = arguments[0];
};

// 发送给所有的用户
resp.all = function(cmd, params) {
	client.send(['broadcast', cmd, params]);
};

// 设置指定的用户场景
resp.setScene = function(id, scene_id) {
	client.send(['enterGroup', id, 'scene', scene_id]);
};

// 发送给场景内用户
resp.scene = function(scene_id, params) {
	client.send(['send', 'scene', scene_id, params]);
};

// 设置指定用户国家
resp.setCountry = function(id, country_id) {
	client.send(['enterGroup', id, 'country', country_id]);
};

// 发送给国家内用户
resp.country = function(country_id, params) {
	client.send(['send', 'country', country_id, params]);
};

// 加入房间
resp.setRoom = function(id, room_id) {
	client.send(['enterGroup', id, 'room', room_id]);
};

// 发送给房间内用户
resp.room = function(room_id, params) {
	client.send(['send', 'room', room_id, params]);
};

// 退出房间
resp.quitRoom = function(room_id) {
	client.send(['quitGroup', room_id, 'room']);
};

module.exports = resp;