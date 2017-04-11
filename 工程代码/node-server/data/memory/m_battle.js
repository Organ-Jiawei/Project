var m_battle = {};

/* 插入一条战斗数据
 * @param  bid    [Number]  战斗表ID
 * @param  uid_1  [String]  玩家一ID
 * @param  uid_2  [String]  玩家二ID
 * @descript
 *              id    战斗ID
 *           round    当前回合数
 *     round_limit    回合数上限
 *          status    战斗状态: 0.已开局   1.胜负局    2.平局
 *       winner_id    胜利者ID
 *        first_id    先手ID
 *         last_id    后手ID
 */
m_battle.add = function(bid, uid_1, uid_2) {
	// var id = util.getTableInc(g_table.memory.t_battle);

	// 随机决定先手
	var first_id, last_id;
	if (Math.floor(Math.random() * 2) === 1) {
		first_id = uid_1;
		last_id = uid_2;
	} else {
		first_id = uid_2;
		last_id = uid_1;
	}

	g_table.memory.t_battle[id] = {
		id: bid,
		round: 1,
		round_limit: 25,
		status: 0,
		winner_id: "",
		first_id: first_id,
		last_id: last_id,
	};

	return id;
};

module.exports = m_battle;
