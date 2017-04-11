cc.Class({
    extends: cc.Component,

    properties: {
        FoeCardSlotList: [cc.Node],
        FoeHeroSlotList: [cc.Node],
        OwnHeroSlotList: [cc.Node],
        OwnCardSlotList: [cc.Node],

        layFoeFlexible: cc.Node,
        layOwnFlexible: cc.Node,

        layNext: cc.Node,
        layNextMask: cc.Node,
        btnNext: cc.Node,

        lblOwnHp: cc.Label,
        lblFoeHp: cc.Label,

        layWait: cc.Node,
        layWaitMask: cc.Node,

        layWin: cc.Node,
        layLost: cc.Node,

        lblRound: cc.Label,

        layHurt: cc.Node,

        prefabHero: cc.Prefab,
    },

    onLoad: function () {
        this.init();

        window.kk = this;
    },

    init: function() {
        this.initData();
        this.bindEvent();

        this.layNext.zIndex = 10;
        this.layWait.zIndex = 10;
        game.socket.send('battle_start');
    },

    initData: function() {
        var data = this.node.data = {};

        // 选中的手牌
        data.flexibleChecked = 0;

        // 当前回合数
        data.round = 1;
        // 回合数上限
        data.roundLimit = 25;

        // 先手ID
        data.firstId = '';

        // 自己的ID
        data.ownId = '';
        // 敌人的ID
        data.foeId = '';

        // 自己的数据
        data.ownData = {};
        // 敌人的数据
        data.foeData = {};

        // 是否正在PK中
        data.pking = false;

        // 玩家拥有的卡牌列表
        data.ownCards = {};
        // 敌人拥有的卡牌列表
        data.foeCards = {};
        // 玩家功能卡槽数据列表
        data.ownCardSlots = {};
        // 敌人功能卡槽数据列表
        data.foeCardSlots = {};
    },

    initView: function() {
        var data = this.node.data;

        // 是否为先手
        if (data.firstId === game.socket.uid) {
            this.showNext();
        } else {
            this.showWait();
        }

        // 加载手牌
        this.loadCard();
        // 英雄登场
        this.heroDebut();
        // 更新回合数
        this.updateViewToRound();
        // 更新血量
        this.updateViewToHp(true);
        this.updateViewToHp(false);
        // 更新结果
        this.updateViewToResult();
    },

    updateView: function() {
        var data = this.node.data;

        if (data.ownData.discard == 0) {
            this.showNext();
        } else {
            this.showWait();
        }

        // 更新回合数
        this.updateViewToRound();
    },

    /* [更新视图] 血量
     * @param  dir  [Boolean]  True:我方发动攻击 False:敌方发动攻击
     */
    updateViewToHp: function(dir) {
        var data = this.node.data;

        if (dir === true) {
            this.lblOwnHp.string = data.ownData.hp + '/' + data.ownData.hp_limit;
        } else {
            this.lblFoeHp.string = data.foeData.hp + '/' + data.foeData.hp_limit;
        }
    },

    updateViewToResult: function(state) {
        this.layWin.active = false;
        this.layLost.active = false;

        if (state == 1) {
            this.layWin.active = true;
        }

        if (state == 2) {
            this.layLost.active = true;
        }
    },

    bindEvent: function() {
        var self = this;

        this.FoeCardSlotList.forEach(function(node, idx) {
            node.on(cc.Node.EventType.TOUCH_END, self.onFoeCardSlot, self);
        });

        this.FoeHeroSlotList.forEach(function(node, idx) {
            node.on(cc.Node.EventType.TOUCH_END, self.onFoeHeroSlot, self);
        });

        this.OwnHeroSlotList.forEach(function(node, idx) {
            node.on(cc.Node.EventType.TOUCH_END, self.onOwnHeroSlot, self);
        });

        this.OwnCardSlotList.forEach(function(node, idx) {
            node.on(cc.Node.EventType.TOUCH_END, self.onOwnCardSlot, self);
        });

        this.layWin.on(cc.Node.EventType.TOUCH_END, this.preventEvent, this);
        this.layLost.on(cc.Node.EventType.TOUCH_END, this.preventEvent, this);        

        // 回合等待的遮罩层
        this.layWaitMask.on(cc.Node.EventType.TOUCH_END, this.preventEvent, this);
        // 回合结束的遮罩层
        this.layNextMask.on(cc.Node.EventType.TOUCH_END, this.preventEvent, this);
        // 按钮事件 - 回合结束
        this.btnNext.on(cc.Node.EventType.TOUCH_END, this.onNext, this);

        game.socket.listen(game.socket.MESSAGE, this.onSocket, this);
    },

    preventEvent: function (ev) {
        ev.stopPropagation();
    },

    onFoeCardSlot: function(ev) {
        console.log(ev.target.name);
    },

    onOwnCardSlot: function(ev) {
        var node = ev.target;
        var data = this.node.data;

        if (!node.name.startsWith('card_slot_')) {
            return;
        }

        var slot_id = parseInt(node.name.substr(10));

        // 该卡槽已经有卡了
        // if (data.ownData['card_slot_' + slot_id]) {
        //     return;
        // }

        // 没有这张手牌
        if (data.ownData.have_cards.indexOf(data.flexibleChecked) == -1) {
            return;
        }

        game.socket.send('battle_discard', data.ownId, data.flexibleChecked, slot_id);
    },

    onFoeHeroSlot: function(ev) {
        console.log(ev.target.name);
    },

    onOwnHeroSlot: function(ev) {
        console.log(ev.target.name);
    },

    onFlexible: function(ev) {
        var node = ev.target;
        var data = this.node.data;

        var card_id = parseInt(node.name);

        if (isNaN(card_id)) {
            return;
        }

        // 重复选择, 取消选择
        if (card_id == data.flexibleChecked) {
            node.y = 65;
            data.flexibleChecked = 0;
            this.showNext();
            return;
        }

        data.flexibleChecked = card_id;

        this.hideNext(true);

        // 更新选中状态
        this.layOwnFlexible.children.forEach(function(n, i) {
            if (n != node) {
                n.y = 65;
            }
        });
        node.y = 65 + 30;
    },

    onNext: function(slot) {
        game.socket.send('battle_next');
    },

    onSocket: function(ev) {
        var result = JSON.parse(ev.data);
        var cmd = result.shift();

        switch (cmd) {
            // 进入战斗
            case 'battle_start':
                this.doBattleStart.apply(this, result);
                break;
            // 回合结束
            case 'battle_next':
                this.onBattleNext.apply(this, result);
                break;
            // 出牌
            case 'battle_discard':
                this.onBattleDiscard.apply(this, result);
                break;
        }
    },

    doBattleStart: function(battle, battle_users) {
        var data = this.node.data;

        data.round = battle.round;
        data.firstId = battle.first;
        data.ownData = battle_users[battle.first];
        data.foeData = battle_users[battle.last];

        if (battle.first === game.socket.uid) {
            data.ownId = battle.first;
            data.foeId = battle.last;
        } else {
            data.ownId = battle.last;
            data.foeId = battle.first;
        }

        this.initView();
    },

    onBattleNext: function(round, battle_users, log_list) {
        var self = this;
        var data = this.node.data;

        // 吃自己的穿自己, 这样才活的踏实
        data.pking = true;
        this.hideNext();

        this.analyLog(log_list, function() {
            data.round = round;
            data.ownData = battle_users[data.ownId];
            data.foeData = battle_users[data.foeId];
            self.updateView();
        });
    },

    onBattleDiscard: function(user_id, card_id, slot_id) {
        var data = this.node.data;

        if (!this.testUserId(uid)) {
            return;
        }

        if (user_id == data.ownId) {
            this.playCard(slot_id);
        } else {

        }
        this.showNext();
    },

    /* 验证uid是否为本局有效uid
     * @param  uid  [Number]   用户ID
     */
    testUserId: function(uid) {
        var data = this.node.data;

        if (data.ownId === uid) {
            return true;
        }

        if (data.foeId === uid) {
            return true;
        }

        return false;
    },

    /* 分析回合日志
     * @param  log  [Array<any>]
     */
    analyLog: function(log_list, callback) {
        // 本次回合分析完毕
        if (log_list.length == 0) {
            callback();
            return;
        }

        var self = this;
        var data = this.node.data;
        var log = log_list.shift();
        var uid = log.shift();
        var cmd = log.shift();

        // 普通攻击
        if (cmd === 'atk') {
            this.heroAttack(uid === data.ownId, log, function() {
                if (log_list.length > 0) {
                    self.analyLog(log_list, callback);
                } else {
                    callback();
                }
            });
        }

        // 胜利
        if (cmd === 'win') {
            this.updateViewToResult(uid === data.ownId ? 1 : 2);
            callback();
        }
    },

    showNext: function() {
        this.hideWait();
        this.layNext.active = true;

        this.OwnCardSlotList.forEach(function(n, i) {
            n.color = cc.color(224, 203, 203);
            n.getChildByName('Label').active = false;
        });
    },

    /* 隐藏回合结束
     * @param  showSlot  [Boolean]  是否显示卡槽状态
     */
    hideNext: function(showSlot) {
        var data = this.node.data;

        this.layNext.active = false;

        showSlot && this.OwnCardSlotList.forEach(function(n, i) {
            // 已经放过卡了
            if (data.ownCardSlots[i + 1]) {
                return;
            }

            n.color = cc.color(235, 255, 0);
            n.getChildByName('Label').active = true;
        });
    },

    showWait: function() {
        this.layNext.active = false;
        this.layWait.active = true;
    },

    hideWait: function() {
        this.layWait.active = false;
    },

    /**
     * 出牌
     * @param  slot  [Number]  卡槽
     */
    playCard: function(slot) {
        var data = this.node.data;
        var card = data.ownCards[data.flexibleChecked];

        var node = new cc.Node('card_' + card.id);
        var sprite = node.addComponent(cc.Sprite);
        sprite.trim = false;
        sprite.sizeMode = cc.Sprite.SizeMode.RAW;
        this.OwnCardSlotList[slot - 1].addChild(node);

        game.util.changeSpriteFrame(node, 'resources/img/card.jpg', null, false, true);

        data.ownCardSlots[slot] = card;

        this.removeFlexible(1, card.id);
    },

    /**
     * 英雄普通攻击动作
     * @param  dir       [Boolean]    True:我方发动攻击 False:敌方发动攻击
     * @param  log[0]    [Number]     发动攻击的英雄槽
     * @param  log[1]    [Number]     被攻击的英雄槽
     * @param  log[2]    [Number]     伤害值
     * @param  log[3]    [Crit]       是否暴击
     * @param  callback  [Function]   回调函数
     */
    heroAttack: function(dir, log, callback) {
        var data = this.node.data;
        var nodeOwnSlot, nodeFoeSlot, posTar;

        if (dir === true) {
            nodeOwnSlot = this.OwnHeroSlotList[log[0] - 1];
            nodeFoeSlot = this.FoeHeroSlotList[log[1] - 1];
        } else {
            nodeOwnSlot = this.FoeHeroSlotList[log[0] - 1];
            nodeFoeSlot = this.OwnHeroSlotList[log[1] - 1];
        }

        posTar = nodeFoeSlot.convertToWorldSpaceAR();

        var m1 = cc.moveTo(0.2, nodeOwnSlot.convertToNodeSpaceAR(posTar));
        var m2 = cc.moveTo(0.3, cc.p(0, 0));
        var callFn = cc.callFunc(callback, this);
        var hurtFn = cc.callFunc(function() {
            this.newHurtLabel(!dir, log[1], log[2], log[3]);

            if (dir === true) {
                data.foeData.hp -= log[3] ? log[2] * 2: log[2];
            } else {
                data.ownData.hp -= log[3] ? log[2] * 2: log[2];
            }
            this.updateViewToHp(!dir);
        }, this);

        var seq = cc.sequence(m1, hurtFn, m2, callFn);

        nodeOwnSlot.getChildByName('hero').runAction(seq).easing(cc.easeOut(2));
    },

    /* 英雄登场
     * 
     */
    heroDebut: function() {
        this.OwnHeroSlotList.forEach(function(n) {
            n.removeAllChildren();
        }, this);

        this.FoeHeroSlotList.forEach(function(n) {
            n.removeAllChildren();
        }, this);

        this.heroDebutSingle(1, 1);
        this.heroDebutSingle(2, 1);
    },

    heroDebutSingle: function(type, n) {
        var data = this.node.data;
        var hero, prefab, parent;

        if (n > 4) {
            return;
        }

        if (type == 1) {
            hero = data.ownData['hero_slot_' + n];
            parent = this.OwnHeroSlotList[n - 1];
        }

        if (type == 2) {
            hero = data.foeData['hero_slot_' + n];
            parent = this.FoeHeroSlotList[n - 1];
        }

        if (hero) {
            prefab = cc.instantiate(this.prefabHero);
            prefab.scale = 2;
            prefab.parent = parent;
            prefab.getComponent('hero').init(hero);
            parent.zIndex = 1;

            prefab.runAction(cc.sequence(cc.scaleTo(0.25, 1), cc.callFunc(function() {
                parent.zIndex = 0;
            }, this))).easing(cc.easeBackIn());

            prefab.runAction(cc.sequence(cc.delayTime(0.15), cc.callFunc(function() {
                this.heroDebutSingle(type, n + 1);
            }, this)));
        }
    },

    loadCard: function() {
        var data = this.node.data;

        this.layOwnFlexible.removeAllChildren();
        this.layFoeFlexible.removeAllChildren();

        data.ownData.have_cards.forEach(function(card) {
            this.addFlexible(1, card);
        }, this);

        data.foeData.have_cards.forEach(function(card) {
            this.addFlexible(2, card);
        }, this);
    },

    /* 添加手牌
     * @param type [Number]   1.我方 2.敌方
     * @param card [Object]   卡牌
     */
    addFlexible: function(type, card) {
        var data = this.node.data;

        if (type == 1) {
            var node = new cc.Node(card.id);
            node.y = 65;
            var sprite = node.addComponent(cc.Sprite);
            sprite.trim = false;
            sprite.sizeMode = cc.Sprite.SizeMode.RAW;
            this.layOwnFlexible.addChild(node);

            game.util.changeSpriteFrame(node, 'resources/img/card.jpg', null, false, true);

            this.sortFlexible(this.layOwnFlexible);

            // 绑定手牌点击事件
            node.on(cc.Node.EventType.TOUCH_END, this.onFlexible, this);

            data.ownCards[card.id] = card;
        }

        if (type == 2) {
            var node = new cc.Node(card.id);
            node.y = -65;
            var sprite = node.addComponent(cc.Sprite);
            sprite.trim = false;
            sprite.sizeMode = cc.Sprite.SizeMode.RAW;
            this.layFoeFlexible.addChild(node);

            game.util.changeSpriteFrame(node, 'resources/img/card_b.jpg', null, false, true);

            this.sortFlexible(this.layFoeFlexible);

            data.foeCards[card.id] = card;
        }
    },

    removeFlexible: function(type, card_id) {
        var data = this.node.data;

        if (type == 1) {
            var cardNode = this.layOwnFlexible.getChildByName('card_' + card_id);
            this.layOwnFlexible.removeChild(cardNode);
            this.sortFlexible(this.layOwnFlexible);
            delete data.ownCards[card_id];
        }

        if (type == 2) {
            var cardNode = this.layFoeFlexible.getChildByName('card_' + card_id);
            this.layFoeFlexible.removeChild(cardNode);
            this.sortFlexible(this.layFoeFlexible);
            delete data.foeCards[card_id];
        }
    },

    /* 手牌排序
     * @param layFlexible [cc.Node]   手牌容器节点
     */
    sortFlexible: function(layFlexible) {
        var count = layFlexible.childrenCount;
        if (count == 0) return;

        var screenSpace = 20;
        var screenWidth = cc.winSize.width - screenSpace;
        var cardWidth = layFlexible.children[0].width || 90;
        var diffWidth = screenWidth - cardWidth * count;
        var space;

        if (diffWidth > 0) {
            space = Math.min(diffWidth / count - 1, 40);
            diffWidth = diffWidth - space * (count - 1);

            layFlexible.children.forEach(function(node, idx) {
                node.x = diffWidth / 2 + cardWidth * idx + space * idx + cardWidth / 2;
                // 屏幕间隔
                node.x += screenSpace / 2
            });
        } else {
            space = Math.min(diffWidth / count - 1, (screenWidth - cardWidth * count) / (count - 1));

            layFlexible.children.forEach(function(node, idx) {
                node.x = cardWidth * idx + space * idx + cardWidth / 2;
                // 屏幕间隔
                node.x += screenSpace / 2
            });
        }
    },

    /* 更新回合数现实
     * 
     */
    updateViewToRound: function() {
        var data = this.node.data;

        this.lblRound.string = data.round + '/' + data.roundLimit;
    },

    /* 实例化一个伤害文本
     * @param  dir  [Boolean]  True:我方 False:敌方
     * @param  slot [Number]   英雄槽位
     * @param  hurt [Number]   伤害值
     * @param  crit [Boolean]  是否暴击
     */
    newHurtLabel: function(dir, slot, hurt, crit) {
        var node = new cc.Node('Label');
        node.color = cc.color(255, 0, 0);
        node.parent = this.layHurt;

        var lblHurt = node.addComponent(cc.Label);
        lblHurt.fontSize = 30;

        if (hurt <= 0) {
            lblHurt.string = 'Miss';
        }
        else if (crit) {
            lblHurt.string = '暴击! -' + (hurt * 2);
        }
        else {
            lblHurt.string = '-' + hurt;
        }

        if (dir === true) {
            var pos = game.util.getRelativePosition(this.OwnHeroSlotList[slot - 1], this.layHurt);
        } else {
            var pos = game.util.getRelativePosition(this.FoeHeroSlotList[slot - 1], this.layHurt);
        }

        pos.y += 20;
        node.setPosition(pos);

        var m1 = cc.moveBy(0.3, cc.p(0, 45));
        var d1 = cc.delayTime(0.3);
        var o1 = cc.fadeOut(0.3);
        var callFn = cc.callFunc(function() {
            this.layHurt.removeChild(node);
            cc.log('delete');
        }, this);
        var seq = cc.sequence(m1, d1, o1, callFn);

        node.runAction(seq);
    },
});












