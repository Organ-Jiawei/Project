var user_id = 0;
var card_id = 0;
var slot_id = 0;
var battle_id = 0;

// 先手
var firstFn = function () {
	// 已经出过牌了
	if (data.battle_user[user_id].discard == 1) {
		return;
	}

	// 血量不足, 已阵亡
	if (data.battle_user[user_id].hp <= 0) {
		return;
	}

	// 没有这张手牌
	if (data.battle_user[user_id].have_cards.indexOf(card_id) == -1) {
		return;
	}

	// 卡槽已满
	if (!setCardSlotFn(user_id, card_id)) {
		return;
	}

	useCardFn();
};

// 后手
var lastFn = function() {
	// 已经出过牌了
	if (data.battle_user[user_id].discard == 1) {
		return;
	}

	// 先手还没出牌
	if (data.battle_user[data.battle[battle_id].first].discard == 0) {
		return;
	}

	// 血量不足, 已阵亡
	if (data.battle_user[user_id].hp <= 0) {
		return;
	}

	// 没有这张手牌
	if (data.battle_user[user_id].have_cards.indexOf(card_id) == -1) {
		return;
	}

	// 卡槽已满
	if (!setCardSlotFn(user_id, card_id)) {
		return;
	}

	useCardFn();
};

// 使用卡
var useCardFn = function() {
	var b_user = data.battle_user[user_id];
	var card = data.card[card_id];
	var card_idx = b_user.have_cards.indexOf(card_id);

	// 消耗卡
	if (card.type == 2) {
		// 设置卡槽信息
		b_user['card_slot_' + slot_id] = {
			id: card_id,
			round: card.round,
		};
	}
	// Buff卡
	else if (card.type == 1) {
		b_user.hp = Math.min(b_user.hp + card.plus[0], b_user.hp_limit);
	}
	
	// 推送给战斗中的玩家出牌信息
	conn.send('battle', battle_id, [ 'battle_discard', user_id, card_id, slot_id ]);

	// 移除卡牌
	b_user.have_cards.splice(card_idx, 1);
};

module.exports = function(id, cid, slot) {
	user_id = id;
	card_id = cid;
	slot_id = slot;
	battle_id = conn.getGroupId(id, 'battle');

	// 不在战斗中
	if (!battle_id) {
		return;
	}

	// 需要选择卡槽的牌
	if (data.card[card_id].type == 1) {
		// 卡槽错误
		if (typeof slot != 'number' || (slot < 1 || slot > 4)) {
			return;
		}
	}

	// 先手
	if (data.battle[battle_id].first == id) {
		firstFn();
	}

	// 后手
	if (data.battle[battle_id].last == id) {
		lastFn();
	}
};
