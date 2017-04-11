/**
 * name     [String]          卡牌名称
 * plus     [Array<Number>]   属性加成 {气血, 攻击力, 防御力, 暴击率}
 * round    [Number]          功能类型 1.回合数持续  2.直接使用
 * round    [Number]          持续回合数
 */

var card = {
	1: {
		name: '杀气',
		plus: [0, 50, 0, 0],
		type: 1,
		round: 5
	},
	2: {
		name: '金刚护体',
		plus: [0, 0, 100, 0],
		type: 1,
		round: 5
	},
	3: {
		name: '暴走修罗',
		plus: [0, 0, 0, 3000],
		type: 1,
		round: 5
	},
	4: {
		name: '铁布散',
		plus: [0, 0, 30, 0],
		type: 1,
		round: 5
	},
	5: {
		name: '天罡气诀',
		plus: [0, 120, 0, 0],
		type: 1,
		round: 5
	},
	6: {
		name: '生命之泉',
		plus: [50, 0, 0, 0],
		type: 2,
		round: 1
	}
};

module.exports = card;
