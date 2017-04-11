// 全局变量声明
global.util = require('./util.js');

global.g_table = {};
global.g_table.memory = util.requireDir('./table/memory/');
global.g_table.temp = util.requireDir('./table/temp/');
global.g_table.user = util.requireDir('./table/user/');

global.g_data = {};
global.g_data.memory = util.requireDir('./data/memory/');
