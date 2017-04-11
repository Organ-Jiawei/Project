var enterFn = function(uid) {
	var bid = conn.getGroupId(uid, 'battle');

	// 还没有进入战斗
	if (!bid) {
		return;
	}

	var ids = Object.keys(conn._groups['battle'][bid]);
	var bus = {};
	for (var i of ids) {
		bus[i] = data.battle_user[i];
	}

	var battle = g_table.memory.t_battle[bid];
	var users = g_data.memory.m_battle_user.get(bid);
	var heros = g_data.memory.m_battle_hero.get(bid);

	// 推送给玩家
	conn.send(uid, [ 'battle_start', battle, users, heros ]);
};

module.exports = enterFn;
