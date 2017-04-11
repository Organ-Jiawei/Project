module.exports = function(id) {
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
		return;
	}

	// 可以开局了
	for (var id of ids) {
		// 进入战斗组
		conn.enterGroup(id, 'battle', room_id);
		// 退出房间组
		conn.quitGroup(id, 'room');
		// 加入到用户战斗表
		data.battle_user.add(id);
	}

	// 随机决定先手
	var first = Math.floor(Math.random() * 2);
	data.battle[room_id] = {
		round: 1,
		first: ids[first],
		last: ids[first == 0 ? 1 : 0],
	};

	// 推送给本场战斗的玩家
	conn.send('battle', room_id, [ 'battle_start' ]);
};
