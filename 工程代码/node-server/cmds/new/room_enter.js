// 新开房间
function newRoom(uid) {
	conn.enterGroup(uid, 'room', ++conn.room_idx);

	// 推送给房主
	conn.send(uid, [
		'room_enter',
		conn.room_idx,
		conn._groups['room'][conn.room_idx]
	]);
};

// 进入房间
function enterRoom(uid, room_id) {
	conn.enterGroup(uid, 'room', room_id);

	// 推送给房间内的玩家
	conn.send('room', room_id, [
		'room_enter',
		room_id,
		conn._groups['room'][room_id]
	]);
};

var enterFn = function(uid, room_id) {
	// 正在战斗中
	if (conn.getGroupId(uid, 'battle')) {
		return;
	}

	if (room_id > 0) {
		enterRoom(uid, room_id);
	} else {
		newRoom(uid);
	}
};

module.exports = enterFn;
