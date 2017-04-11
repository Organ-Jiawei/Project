/**
 * 游戏命名空间
 */

var game = {};

game.config = require('config');  // 游戏配置
// game.data = require('data');   // 用户数据接口
game.socket = require('socket');  // websocket对象
game.util = require('util');      // util对象

window.game = game;

// 读取缓存
// game.data.cache.read();
