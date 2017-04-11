var m_battle_hero = {};

var propFn = function() {

};

/* 插入一条战斗英雄数据
 * @param  uid  [String]   用户表ID
 * @param  hid  [Number]   用户英雄表ID
 * @return      [Number]   战斗英雄表ID
 * @descript
 *               id    自增ID
 *          user_id    用户表ID
 *          hero_id    用户英雄表ID
 *            level    英雄等级
 *    hero_add_prop    英雄属性加点 [攻击, 法术, 护甲, 魔抗, 生命]
 */
m_battle_hero.add = function(uid, hid) {
	var id = util.getTableInc(g_table.memory.t_battle_hero);

	var u_hero = g_table.user.t_user_hero[hid];

	if (u_hero) {
		var prop_arr = [];
		var hero_tmp = g_table.temp.t_card_hero[gid];
		var prop_tmp = g_table.temp.t_point_prop;

		for (var i = 0; i < 5; i ++) {
			prop_arr.push(hero_tmp.hero_ini_prop[i] + hero_tmp.hero_ini_prop[i] * hero_tmp.hero_lv_point_rate[i] * u_hero.hero_add_prop[i]);
		}
		prop_arr = hero_tmp.hero_ini_prop;
		

		g_table.memory.t_battle_hero[id] = {
			id: id,
			user_id: uid,
			hero_id: hid,
			level: u_hero.level,
			energy: 0,
			hero_skill: [],
			hero_prop: prop_arr
		};
	} else {
		id = -1;
	}

	return id;
};

/* 获取一场战斗中的所有英雄
 * @param  bid  [Number]   战斗表ID
 * @return      [Array<t_battle_hero>]
 */
m_battle_hero.get = function(bid) {
	var arr = [];

	var users = g_data.memory.m_battle_user.get(bid);

	var ids = users[0].hero_slots.concat(users[1].hero_slots);

	ids.filter(function(n) {
		return n != -1;
	});

	for (var i in g_table.memory.t_battle_hero) {
		if (ids.indexOf(i) > -1) {
			arr.push(g_table.memory.t_battle_hero[i]);

			if (arr.length == ids.length) {
				break;
			}
		}
	}

	return arr;
};

module.exports = m_battle_hero;
