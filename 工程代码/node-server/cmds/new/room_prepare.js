var enterFn = function(id) {
	// 正在战斗中
	if (conn.getGroupId(id, 'battle')) {
		return;
	}

	var room_id = conn.getGroupId(id, 'room');
	// 还没有进入房间
	if (!room_id) {
		return;
	}
	// 默认为1, 2为已准备
	conn._groups['room'][room_id][id] = 2;

	noticeFn(room_id);
};

var noticeFn = function(room_id) {
	var ids = Object.keys(conn._groups['room'][room_id]);

	// 是否都准备好了
	var isallok = true;
	for (var id of ids) {
		if (conn._groups['room'][room_id][id] != 2) {
			isallok = false;
			break;
		}
	}
	
	// 还有人没准备好
	if (isallok == false || ids.length < 2) {
		// 推送给房间内的玩家
		conn.send('room', room_id, [ 'room_prepare', conn._groups['room'][room_id] ]);
	} else {
		battleFn(room_id);
	}
};

var battleFn = function(room_id) {
	var ids = Object.keys(conn._groups['room'][room_id]);

	// 开始一场战斗
	g_data.memory.m_battle.add(room_id, ids[0], ids[1]);

	// 进入战斗场地并离开房间
	for (var id of ids) {
		// 进入战斗组
		conn.enterGroup(id, 'battle', room_id);
		// 退出房间组
		conn.quitGroup(id, 'room');
		// 加入到用户战斗表
		g_data.memory.m_battle_user.add(id, room_id);
	}

	// 推送给本场战斗的玩家
	conn.send('battle', room_id, [ 'battle_start' ]);
};

module.exports = enterFn;
