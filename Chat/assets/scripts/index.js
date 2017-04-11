cc.Class({
    extends: cc.Component,

    properties: {
        wrapNode: cc.Node
    },

    onLoad: function () {
        this.bindEvent();
    },

    bindEvent: function() {
        var self = this;

        this.wrapNode.children.forEach(function(node, idx) {
            node.on(cc.Node.EventType.TOUCH_END, self.onLogin, self);
        });
    },

    onLogin: function(ev) {
        var node = ev.target;
        var uid = node.getChildByName('Label').getComponent(cc.Label).string;

        game.socket.connect(uid);
        game.socket.listen(game.socket.CONNECT, this.onConnected, this);
    },

    onConnected: function() {
        cc.director.loadScene('room');
    },
});
