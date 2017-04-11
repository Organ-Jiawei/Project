// 新开房间
function newRoom(id) {
	conn.enterGroup(id, 'room', ++conn.room_idx);

	// 推送给房主
	conn.send(id, [
		'room_enter',
		conn.room_idx,
		conn._groups['room'][conn.room_idx]
	]);
};

// 进入房间
function enterRoom(id, room_id) {
	conn.enterGroup(id, 'room', room_id);

	// 推送给房间内的玩家
	conn.send('room', room_id, [
		'room_enter',
		room_id,
		conn._groups['room'][room_id]
	]);
};

module.exports = function(id, room_id) {
	// 正在战斗中
	if (conn.getGroupId(id, 'battle')) {
		return;
	}

	if (room_id > 0) {
		enterRoom(id, room_id);
	} else {
		newRoom(id);
	}
};
