/**
 * 连接模块
 * conn.send(userId, data)             - 向指定用户发送数据
 * conn.send(group, groupId, data)     - 向指定分组发送数据
 * conn.broadcast(data)                - 向所有的用户广播
 * conn.broadcast(group, data)         - 向分组内用户广播
 * conn.enterGroup(id, group, groupId) - 进入指定分组
 * conn.quitGroup(id, [group])         - 退出指定分组(group参数为null,则退出所有分组)
 */
var conn = {
	'_users': {},   // 用户对象
	'_groups': {},  // 分组对象
	'room_idx': 0
};

// 向conn对象中添加一个用户
conn.add = function(id, client) {
	if (this._users[id]) {
		// 关闭之前的连接并重新赋予连接
		this._users[id].client.close();
		this._users[id].client = client;
	} else {
		this._users[id] = {
			client: client,
			groups: {}
		};
	}

	conn.send(id, [ 'init', id ]);
};

// 从conn对象中删除一个用户
conn.del = function(id, client) {
	if (this._users[id] && this._users[id].client == client) {
		this.quitGroup(id);
		delete this._users[id];
		return true;
	}
	return false;
};

// 向用户集发送
conn._send = function(ids, data) {
	for (var i in ids) {
		this._users[i] && this._users[i].client.send(JSON.stringify(data));
	}
};

// 向指定用户或组发送
conn.send = function() {
	var args = arguments;

	// 指定的单个用户 (userId, data)
	if (args.length == 2) {
		var ids = {};
		ids[args[0]] = args[0];
		this._send(ids, args[1]);
	}

	// 分组内指定用户集 (group, groupId, data)
	if (args.length == 3) {
		this._send(this._groups[args[0]][args[1]], args[2]);
	}
};

// 向全体或全组广播
conn.broadcast = function() {
	var args = arguments;

	// 向全体广播 (data)
	if (args.length == 1) {
		this._send(this._users, args[0]);
	}

	// 向全组广播 (group, data)
	if (args.length == 2) {
		for (var i in this._groups[args[0]]) {
			this._send(this._groups[args[0]][i], args[1]);
		}
	}
};

// 退出指定分组
conn._quitGroup = function(id, group) {
	delete this._groups[group][this._users[id].groups[group]][id];
	delete this._users[id].groups[group];
};

// 退出分组(group参数为null,则退出所有分组)
conn.quitGroup = function(id, group) {
	if (group == null) {
		for (var group_s in this._users[id].groups) {
			this._quitGroup(id, group_s);
		}
	} else {
		this._quitGroup(id, group);
	}
};

// 加入指定分组
conn.enterGroup = function(id, group, group_id, value) {
	// 退出之前的分组
	if (this._users[id].groups[group] != null) {
		this._quitGroup(id, group);
	}

	// 定义新分组
	if (!this._groups[group]) {
		this._groups[group] = {};
	}

	// 定义分组内新用户集
	if (!this._groups[group][group_id]) {
		this._groups[group][group_id] = {};
	}

	// 添加用户到分组
	this._groups[group][group_id][id] = value || 1;
	// 设置用户分组id
	this._users[id].groups[group] = group_id;
};

// 获取分组ID
conn.getGroupId = function(id, group) {
	return this._users[id].groups[group];
}

// 获取指定分组的所有Key
conn.getGroupKeys = function(group, group_id) {
	return Object.keys(this._groups[group][group_id]);
}

module.exports = conn;
