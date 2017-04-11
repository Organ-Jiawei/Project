cc.Class({
    extends: cc.Component,

    properties: {
        btnSend: cc.Node,
        txtContent: cc.EditBox,
        toggleGroup: cc.ToggleGroup
    },

    initData: function() {
        var data = this.node.data = {};

        data.room = 1;
        data.uid = this.getQueryString('uid') || 10086;
        data.ws = {};
        data.channel = 'guide';
        data.roomMsgList = {};
    },

    onLoad: function () {
        this.initData();

        var slef = this;
        var data = this.node.data;

        this.btnSend.on(cc.Node.EventType.TOUCH_END, this.onSend, this);

        var url = cc.js.formatStr('ws://127.0.0.1:7878?channel=%s&uid=%s', data.channel, data.uid);
        var ws = new WebSocket(url);
        window.ws = ws;
        this.node.data.ws = ws;

        ws.addEventListener('open', this.onConnect.bind(this));
        ws.addEventListener('message', this.onMessage.bind(this));
        ws.addEventListener('error', this.onError.bind(this));
        ws.addEventListener('close', this.onClose.bind(this));
    },

    onConnect: function(event) {
        var data = this.node.data;

        console.log("连接成功");
        // this.send(['enterRoom', data.room]);
    },

    onMessage: function(event) {
        console.log("response text msg: " + event.data);
    },

    onError: function(event) {
        console.log("Send Text fired an error");
    },

    onClose: function(event) {
        console.log("WebSocket instance closed.");
    },

    onSend: function() {
        if (this.ws.readyState === WebSocket.CONNECTING) {
            console.log("正在连接中...");
        }
        else if (this.ws.readyState === WebSocket.OPEN) {
            var msg = this.txtContent.string.trim();

            this.send(['room', msg]);
        }
    },

    onToggleRoom: function(toggle, val) {
        var data = this.node.data;

        data.room = parseInt(val);
        this.send(['enterRoom', data.room]);
    },

    send: function(arr) {
        this.node.data.ws.send(JSON.stringify(arr));
    },

    /**
     * [getQueryString 获取Url中指定的参数]
     * @param  {[String]} name [参数名]
     * @return {[String]}      [指定参数的值，没有则返回null]
     * Auto:郝梦庆
     */
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
});
