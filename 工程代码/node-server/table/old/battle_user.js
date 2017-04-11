var battle_user = {};

/**
 * hero_id     [Number]          英雄ID (模板表)
 * hero_name   [String]          英雄名称 (模板)
 * level       [Number]          英雄等级
 * crit        [Number]          暴击率 (万分比)
 * attack      [Number]          攻击力
 * defense     [Number]          防御力
 * hp          [Number]          当前血量
 * hp_limit    [Number]          血量上限
 * discard     [Number]          0.未出牌  1.已出牌
 * have_cards  [Array<Number>]   拥有的卡牌
 * card_slot_1 [Object]          1号功能卡槽
 * card_slot_2 [Object]          2号功能卡槽
 * card_slot_3 [Object]          3号功能卡槽
 * card_slot_4 [Object]          4号功能卡槽
 * hero_slot_1 [Object]          1号英雄卡槽
 * hero_slot_2 [Object]          2号英雄卡槽
 * hero_slot_3 [Object]          3号英雄卡槽
 * hero_slot_4 [Object]          4号英雄卡槽
 */
battle_user.add = function(id) {
	var bu_item = {
		hp: data.user[id].hp,
		hp_limit: data.user[id].hp,
		discard: 0,
		have_cards: [],
		card_slot_1: null,
		card_slot_2: null,
		card_slot_3: null,
		card_slot_4: null,
	};

	var arr = Object.keys(data.card);

	bu_item.have_cards.push(arr[parseInt(Math.random() * arr.length)]);
	bu_item.have_cards.push(arr[parseInt(Math.random() * arr.length)]);
	bu_item.have_cards.push(arr[parseInt(Math.random() * arr.length)]);

	var idx = 1;
	for (var i of data.user[id].lineup) {
		var uh = data.user_hero[i];
		var h = data.hero[uh.hero_id];

		bu_item['hero_slot_' + idx] = {
			hero_id: uh.hero_id,
			hero_name: h.name,
			level: uh.level,
			crit: h.crit,
			attack: h.attack + uh.property[0],
			defense: h.defense + uh.property[1],
		};
		idx++;
	}

	battle_user[id] = bu_item;
}

module.exports = battle_user;
