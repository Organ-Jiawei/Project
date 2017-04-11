/****************************************************************
 *                                                              *
 *                       客户端配置信息                         *
 *                                                              *
 ***************************************************************/

var config = {};

config.DEBUG = true;
config.SOCKET_URL = 'ws://127.0.0.1:7878/';
config.IMAGES_URL = 'http://localhost:7456/build/res/raw-assets/res/';
config.FPS_INTERVAL = 2;  //必须大于0的整数
config.FPS_FLOOR = 15;	  //必须大于等于0的整数
config.VERSION = 'v0.0.0'; //客户端版本号

module.exports = config;
