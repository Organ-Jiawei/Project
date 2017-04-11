var log = [];

var f4 = function(own, foe, slot) {
	var bu_own = data.battle_user[own];
	var bu_foe = data.battle_user[foe];

	slot = slot || 1;

	if (bu_own['hero_slot_' + slot]) {
		for (var i = slot; i <= 4; i++) {
			if (bu_foe['hero_slot_' + i]) {
				// pk
				var hero_own = bu_own['hero_slot_' + slot];
				var hero_foe = bu_foe['hero_slot_' + i];
				var hurt = f6(hero_own, f5(bu_own), hero_foe, f5(bu_foe));

				bu_foe.hp -= hurt.iscrit ? hurt.value * 2 : hurt.value;

				log.push([own, 'atk', slot, i, hurt.value, hurt.iscrit]);

				// 阵亡
				if (bu_foe.hp <= 0) {
					log.push([own, 'win']);
					return;
				}

				f4(own, foe, slot + 1);
				break;
			}
		}
	} else {
		slot < 4 && f4(own, foe, slot + 1);
	}
};

var f5 = function(b_user) {
	var buff_plus = [0, 0, 0];

	for (var i = 1; i <= 4; i++) {
		var card_slot = b_user['card_slot_' + i];
		if (card_slot) {
			buff_plus[0] += data.card[card_slot.id].plus[1];
			buff_plus[1] += data.card[card_slot.id].plus[2];
			buff_plus[2] += data.card[card_slot.id].plus[3];
		}
	};

	return buff_plus;
};

var f6 = function(hero_own, buff_own, hero_foe, buff_foe) {
	return {
		value: Math.max((hero_own.attack + buff_own[0]) - (hero_foe.defense + buff_foe[1]), 0),
		iscrit: parseInt(Math.random() * 10000) <= hero_own.crit + buff_own[2]
	};
};

var f2 = function(battle_id, own, foe) {
	data.battle_user[own].discard = 1;
	data.battle_user[foe].discard = 0;

	// 清空日志列表
	log = [];

	f4(own, foe);

	// Buff回合结算
	for (var i = 1; i <= 4; i++) {
		var cardSlot = data.battle_user[own]['card_slot_' + i];
		if (cardSlot && --cardSlot.round <= 0) {
			data.battle_user[own]['card_slot_' + i] = null;
		}
	}

	var battleUsers = {};
	battleUsers[own] = data.battle_user[own];
	battleUsers[foe] = data.battle_user[foe];

	// 回合数更新
	if (own == data.battle[battle_id].last) {
		data.battle[battle_id].round++;
	}

	conn.send('battle', battle_id, ['battle_next', data.battle[battle_id].round, battleUsers, log]);
};

module.exports = function(id) {
	var battle_id = conn.getGroupId(id, 'battle');

	// 不在战斗中
	if (!battle_id) {
		return;
	}

	// 已经出过牌了
	if (data.battle_user[id].discard == 1) {
		return;
	}

	if (data.battle[battle_id].first == id) {
		f2(battle_id, id, data.battle[battle_id].last);
	}

	if (data.battle[battle_id].last == id) {
		f2(battle_id, id, data.battle[battle_id].first);
	}
};
