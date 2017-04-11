var m_battle_user = {};

/* 插入一条战斗用户数据
 * @param  uid  [String]   用户表ID
 * @param  bid  [Number]   战斗表ID
 * @descript
 *            id    自增ID
 *     battle_id    战斗ID
 *       user_id    用户ID
 *            hp    当前血量
 *      hp_limit    血量上限
 *       discard    出牌状态: 0.未出牌   1.已出牌
 *    have_cards    拥有的功能卡, ID数组
 *    card_slots    功能卡槽列表, ID数组 (默认为-1)
 *    hero_slots    英雄卡槽列表, ID数组 (默认为-1)
 */
m_battle_user.add = function(uid, bid) {
	var id = util.getTableInc(g_table.memory.t_battle_user);

	var user = g_table.user.t_user[uid];

	g_data.memory.m_battle_hero.add(user.lineup[0]);

	g_table.memory.t_battle_user[id] = {
		id: id,
		battle_id: bid,
		user_id: uid,
		hp: user.hp,
		hp_limit: user.hp,
		discard: 0,
		have_cards: [],
		card_slots: [-1, -1, -1, -1],
		hero_slots: [
			g_data.memory.m_battle_hero.add(uid, user.lineup[0]),
			g_data.memory.m_battle_hero.add(uid, user.lineup[1]),
			g_data.memory.m_battle_hero.add(uid, user.lineup[2]),
			g_data.memory.m_battle_hero.add(uid, user.lineup[3])
		]
	};
};

/* 获取一场战斗中的所有用户
 * @param  bid  [Number]   战斗表ID
 * @param  uid  [Number]   战斗用户表ID
 * @return      [Array<t_battle_user> | t_battle_user]
 */
m_battle_user.get = function(bid, uid) {
	var arr = [];

	for (var i in g_table.memory.t_battle_user) {
		if (g_table.memory.t_battle_user[i].battle_id == bid) {

			if (uid) {
				if (g_table.memory.t_battle_user[i].user_id == uid) {
					return g_table.memory.t_battle_user[i];
				}
			} else {
				arr.push(g_table.memory.t_battle_user[i]);

				if (arr.length == 2) {
					break;
				}
			}
		}
	}

	return arr;
};

module.exports = m_battle_user;
