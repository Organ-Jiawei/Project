module.exports = function(id) {
	var battle_id = conn.getGroupId(id, 'battle');

	// 还没有进入战斗
	if (!battle_id) {
		return;
	}

	var ids = Object.keys(conn._groups['battle'][battle_id]);
	var bus = {};
	for (var i of ids) {
		bus[i] = data.battle_user[i];
	}

	// 推送给玩家
	conn.send(id, [ 'battle_start', data.battle[battle_id], bus ]);
};
