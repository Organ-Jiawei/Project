var ws = null;
var eventManager = {
	'open': [],
	'message': [],
	'error': [],
	'close': []
};

var socket = {
	uid: 0,

	CONNECT: 'open',
	MESSAGE: 'message',
	ERROR: 'error',
	CLOSE: 'close',
};

socket.connect = function(uid) {
	var url = cc.js.formatStr('%s?channel=%s&uid=%s', game.config.SOCKET_URL, 'guide', uid);

	// 开始连接
    ws = new WebSocket(url);

    this.uid = uid;

    this.ws = ws;

    ws.addEventListener('open', this._conn.bind(this));
    ws.addEventListener('message', this._msg.bind(this));
    ws.addEventListener('error', this._err.bind(this));
    ws.addEventListener('close', this._close.bind(this));
};

/**
 * 发送数据到服务器
 * @param  cmd  [String]   命令名称
 * @param  ...
 */
socket.send = function(cmd) {
	var arr = [];
	for (var i in arguments) {
		arr.push(arguments[i]);
	}

	if (arr.length == 0) {
		return;
	}

	ws.send(JSON.stringify(arr));
};

socket.listen = function(ev, fn, thisObj) {
	if (eventManager[ev]) {
		eventManager[ev].push({ fn: fn, thisObj: thisObj });
	}
};

socket.un = function(event, fn) {
	if (eventManager[event]) {
		eventManager[event].forEach(function(ev, idx) {
			if (ev.fn === fn) {
				eventManager[event].splice(idx, 1);
				return;
			}
		});
	}
};

socket._err = function(event) {
	console.error('socket send an error !');

	eventManager[this.ERROR].forEach(function(ev, idx) {
		ev.fn.apply(ev.thisObj, [event]);
	});
};

socket._msg = function(event) {
    var result = JSON.parse(event.data);

    // 初始化用户信息
    if (result.shift() === 'init') {
    	this.uid = result[0];
    }

	// console.log('msg: %s', ev.data);

	eventManager[this.MESSAGE].forEach(function(ev, idx) {
		ev.fn.apply(ev.thisObj, [event]);
	});
};

socket._close = function(event) {
	console.error('server is closed !');

	eventManager[this.CLOSE].forEach(function(ev, idx) {
		ev.fn.apply(ev.thisObj, [event]);
	});
};

socket._conn = function(event) {
	console.warn('welcome %s !', this.uid);

	eventManager[this.CONNECT].forEach(function(ev, idx) {
		ev.fn.apply(ev.thisObj, [event]);
	});
};

module.exports = socket;
