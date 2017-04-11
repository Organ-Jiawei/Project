var config = {};

// 服务地址
config.HOST = {
    port : process.argv[2] || 7878,
    ip : process.argv[3] || "127.0.0.1"
};

// redis连接地址
config.REDIS_OPTIONS = {
	host : '127.0.0.1',
	port : 6379,
	db : 1
};

// 指令消息队列
config.RPC_MSG_LIST = {
	cmd: 'cmd_msg_list',
	res: 'res_msg_list'
};

module.exports = config;