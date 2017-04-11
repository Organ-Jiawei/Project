var enterFn = function(uid) {
	var bid = conn.getGroupId(uid, 'battle');

	// 不在战斗中
	if (!bid) {
		return;
	}

	var battle = g_table.memory.t_battle[bid];

	// 本场战斗已经结束了
	if (battle.status != 0) {
		return;
	}

	// 回合数已满
	if (battle.round >= battle.round_limit) {
		return;
	}

	var b_user = g_data.memory.m_battle_user.get(bid, uid);

	// 已经出过牌了
	if (b_user.discard == 1) {
		return;
	}

	// 先手
	if (battle.first_id == uid) {
		f2(bid, uid, battle.last_id);
	}
	// 后手
	else {
		f2(bid, uid, battle.first_id);
	}
};

var f2 = function(bid, own_id, foe_id) {
	var user_own = g_data.memory.m_battle_user.get(bid, own_id);
	var user_foe = g_data.memory.m_battle_user.get(bid, foe_id);

	user_own.discard = 1;
	user_foe.discard = 0;

	// Buff回合结算
	for (var slot of user_own.card_slots) {
		// 空槽
		if (slot === -1) {
			continue;
		}

		console.log('battle_next: [user_own.card_slots, id为%s的数据未做处理]');
	}

	var battle = g_table.memory.t_battle[bid];
	var users = g_data.memory.m_battle_user.get(bid);

	conn.send('battle', bid, [ 'battle_next', battle, users ]);
};

var f4 = function(bid, own_id, foe_id) {
	var user_own = g_data.memory.m_battle_user.get(bid, own_id);
	var user_foe = g_data.memory.m_battle_user.get(bid, foe_id);

	var slot_idx = 0;
	for (var i of user_own.hero_slots) {
		// 空槽
		if (i === -1) {
			continue;
		}

		var hero_own = g_table.memory.t_battle_hero[i];
		var hero_own_tmp = g_table.temp.t_card_hero[hero_own.hero_id];

		var skill = g_table.temp.t_skill[hero_own.hero_skill];

		// 攻击，法术，护甲，魔抗，生命，暴击
		
		// 能量值足够, 可以释放主动技能
		if (hero_own.hero_skill > 0 && hero_own.energy >= skill.launch_energy) {
			var hero_foe_arr = findSkillTargetFn(user_own, user_foe, slot_idx, skill.skill_target);

			if (hero_foe_arr.length > 0) {
				
			} else {
				console.log('battle_next: [找不到技能攻击目标]');
			}
		} else {
			// 被动技能
			if (hero_own_tmp.hero_skill_char > 0) {
				// todo ...
			}

			var hero_foe = findAttackTargetFn(user_foe);
			// var hero_foe_tmp = g_table.temp.t_card_hero[hero_foe.hero_id];

			// hero_own.hero_prop[0] * (1 - hArmorFn(hero_foe));

			// 暴击率
			if (util.random(10000) >= hero_foe.hero_prop[5]) {
				// todo ...
			}

			if (hero_foe) {
				
			} else {
				console.log('battle_next: [找不到普通攻击目标]');
			}
		}

		slot_idx++;
	}
};

// 寻找普通攻击目标, 从一号位开始找
var findAttackTargetFn = function(user) {
	for (var i of user.hero_slots) {
		// 空槽
		if (i === -1) {
			continue;
		}

		return g_table.memory.t_battle_hero[i];
	}
	return false;
};

/* 寻找技能攻击目标
 * 
 * 绝对位置：
 * 1、我方1号位
 * 2、我方2号位
 * 3、我方3号位
 * 4、我方4号位
 * 5、敌方1号位置
 * 6、敌方2号位置
 * 7、敌方3号位置
 * 8、敌方4号位置
 * 
 * 相对位置:
 * 
 * 9、携带者攻击的目标
 * 10、被选中对象
 * 11、本身（BUFF或者技能的携带者）
 * 12、本身左边的对象
 * 13、本身右边的对象
 * 14、本身对应的同位置敌方
 * 
 * (1.风2.火3.雷4.土5.水)
 * 
 * 15、我方指定五行的
 * 16、敌方指定五行的
 * 
 * (1.天神系2.天魔系3.幻妖系4.修罗系5.天选者)
 * 
 * 17、我方指定种族的
 * 18、敌方指定种族的
 */
var findSkillTargetFn = function(user_own, user_foe, slot_idx, targets) {
	var results = {};

	for (var tar of targets) {
		if (tar[0] >= 1 && tar[0] <= 4) {
			for (var i = tar[0] - 1; i < user_own.hero_slots.length; i++) {
				// 空槽
				if (user_own.hero_slots[i] === -1) {
					continue;
				}
				results[user_own.hero_slots[i]] = 1;
				break;
			}
		}

		if (tar[0] >= 5 && tar[0] <= 8) {
			for (var i = tar[0] - 5; i < user_foe.hero_slots.length; i++) {
				// 空槽
				if (user_foe.hero_slots[i] === -1) {
					continue;
				}
				results[user_foe.hero_slots[i]] = 1;
				break;
			}
		}

		if (tar[0] == 9) {
			// todo ...
		}

		if (tar[0] == 10) {
			// todo ...
		}

		if (tar[0] == 11) {
			results[user_own.hero_slots[slot_idx]] = 1;
		}

		if (tar[0] == 12) {
			for (var i = slot_idx - 1; i >= 0; i--) {
				// 空槽
				if (user_own.hero_slots[i] === -1) {
					continue;
				}
				results[user_own.hero_slots[i]] = 1;
				break;
			}
		}

		if (tar[0] == 13) {
			for (var i = slot_idx + 1; i >= user_own.hero_slots.length; i++) {
				// 空槽
				if (user_own.hero_slots[i] === -1) {
					continue;
				}
				results[user_own.hero_slots[i]] = 1;
				break;
			}
		}

		if (tar[0] == 14) {
			if (user_foe.hero_slots[slot_idx] !== -1) {
				results[user_foe.hero_slots[slot_idx]] = 1;
			}
		}

		if (tar[0] == 15) {
			for (var i of user_own.hero_slots) {
				// 空槽
				if (i === -1) {
					continue;
				}
				var hero = g_table.memory.t_battle_hero[i];
				var hero_tmp = g_table.temp.t_card_hero[hero.hero_id];

				if (hero_tmp.hero_element == tar[1]) {
					results[i] = 1;
				}
			}
		}

		if (tar[0] == 16) {
			for (var i of user_foe.hero_slots) {
				// 空槽
				if (i === -1) {
					continue;
				}
				var hero = g_table.memory.t_battle_hero[i];
				var hero_tmp = g_table.temp.t_card_hero[hero.hero_id];

				if (hero_tmp.hero_element == tar[1]) {
					results[i] = 1;
				}
			}
		}

		if (tar[0] == 17) {
			for (var i of user_own.hero_slots) {
				// 空槽
				if (i === -1) {
					continue;
				}
				var hero = g_table.memory.t_battle_hero[i];
				var hero_tmp = g_table.temp.t_card_hero[hero.hero_id];

				if (hero_tmp.hero_race == tar[1]) {
					results[i] = 1;
				}
			}
		}

		if (tar[0] == 18) {
			for (var i of user_foe.hero_slots) {
				// 空槽
				if (i === -1) {
					continue;
				}
				var hero = g_table.memory.t_battle_hero[i];
				var hero_tmp = g_table.temp.t_card_hero[hero.hero_id];

				if (hero_tmp.hero_race == tar[1]) {
					results[i] = 1;
				}
			}
		}
	}

	return Object.keys[results];
};

// 物抗减伤
var hArmorFn = function(hero) {
	return hero.hero_prop[2] / (hero.hero_prop[2] + g_table.temp.t_const.battle_k);
};

// 法抗减伤
var hAntiFn = function(hero) {
	return hero.hero_prop[3] / (hero.hero_prop[3] + g_table.temp.t_const.battle_k);
};

module.exports = enterFn;






















