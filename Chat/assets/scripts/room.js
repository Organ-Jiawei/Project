cc.Class({
    extends: cc.Component,

    properties: {
        lblRoom: cc.Label,
        lblLUid: cc.Label,
        flagLReady: cc.Node,
        lblRUid: cc.Label,
        flagRReady: cc.Node,
        btnReady: cc.Node,
        btnGoto: cc.Node,
        txtRoom: cc.EditBox
    },

    onLoad: function () {
        this.init();
    },

    init: function() {
        this.bindEvent();
        this.initData();
        this.initView();

        game.socket.send('room_enter');
    },

    initData: function() {
        var data = this.node.data = {};

        // 房间ID
        data.roomId = '???';
        // 房间中的用户列表
        data.roomUsers = {};
    },

    initView: function() {
        var data = this.node.data;
        var ids = Object.keys(data.roomUsers);

        // 房间号
        this.lblRoom.string = data.roomId;

        // 左边
        if (ids.length > 0) {
            // ID号
            this.lblLUid.node.active = true;
            if (ids[0].startsWith('guide_')) {
                this.lblLUid.string = ids[0].substr(6);
            } else {
                this.lblLUid.string = ids[0];
            }
            // 准备状态
            this.flagLReady.active = data.roomUsers[ids[0]] == 2;
        } else {
            this.lblLUid.node.active = false;
            this.flagLReady.active = false;
        }

        // 右边
        if (ids.length > 1) {
            // ID号
            this.lblRUid.node.active = true;
            if (ids[1].startsWith('guide_')) {
                this.lblRUid.string = ids[1].substr(6);
            } else {
                this.lblRUid.string = ids[1];
            }
            // 准备状态
            this.flagRReady.active = data.roomUsers[ids[1]] == 2;
        } else {
            this.lblRUid.node.active = false;
            this.flagRReady.active = false;
        }
    },

    bindEvent: function() {
        this.btnGoto.on(cc.Node.EventType.TOUCH_END, this.onGoto, this);
        this.btnReady.on(cc.Node.EventType.TOUCH_END, this.onReady, this);

        game.socket.listen(game.socket.MESSAGE, this.onSocket, this);
    },

    onGoto: function() {
        var roomId = parseInt(this.txtRoom.string.trim());

        if (roomId) {
            game.socket.send('room_enter', roomId);
        } else {
            alert('请输入正确格式');
        }

        // 清空输入框
        this.txtRoom.string = '';
    },

    onReady: function() {
        game.socket.send('room_prepare');
    },

    onSocket: function(ev) {
        var result = JSON.parse(ev.data);
        var cmd = result.shift();

        switch (cmd) {
            case 'room_enter':
                this.doRoomEnter.apply(this, result);
                break;
            case 'room_prepare':
                this.doRoomPrepare.apply(this, result);
                break;
            case 'battle_start':
                this.doBattleStart.apply(this, result);
                break;
        }
    },

    doRoomEnter: function(r_id, r_users) {
        var data = this.node.data;

        data.roomId = r_id;
        data.roomUsers = r_users;

        this.initView();
    },

    doRoomPrepare: function(r_users) {
        var data = this.node.data;

        data.roomUsers = r_users;

        this.initView();
    },

    doBattleStart: function(first_id, battle_users) {
        game.socket.un(game.socket.MESSAGE, this.onSocket);

        cc.director.loadScene('battle');
    },
});
