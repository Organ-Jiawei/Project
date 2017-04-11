var util = {
    // 换图片精灵(当前对象，图片路径，回调方法，更换spriteFrame前是否先置空)，是否缓存图片
    changeSpriteFrame: function(that, url, callback, setNull, isCache) {
        var self = this;
        callback = callback || function() {};
        if (!this._spriteFrameCache) {
            this._spriteFrameCache = {};
        }
        if (url.endsWith('.png') || url.endsWith('.jpg')) {
            // var pattern = /.+(?=\.[png|jpg])/i;
            // url = pattern.exec(url)[0];
            url = url.slice(0, url.length - 4);
        }
        if (url.startsWith('resources/')) {
            url = url.slice(10);
        }
        var spriteFrameImg = that.getComponent(cc.Sprite);
        spriteFrameImg.pp_url = url;

        var spriteFrameCache = this._spriteFrameCache[url];
        if (spriteFrameCache) {
            spriteFrameImg.spriteFrame = spriteFrameCache;
            callback();
            return;
        }

        if (setNull) {
            spriteFrameImg.spriteFrame = null;
        }

        cc.loader.loadRes(url, cc.SpriteFrame, function(err, spriteFrame) {
            if (err) {
                cc.error('SpriteFrame加载错误, 节点名: ' + spriteFrameImg.node.name + ', url: ' + url);
                return;
            }
            if (isCache) {
                self._spriteFrameCache[url] = spriteFrame;
            }
            if (spriteFrameImg.pp_url === url) {
                spriteFrameImg.spriteFrame = spriteFrame;
                callback();
            }
        });
    },

    // 获取相对坐标
    getRelativePosition: function(targetNode, mainNode) {
        var tar_pos = targetNode.convertToWorldSpaceAR();
        return mainNode.convertToNodeSpaceAR(tar_pos);
    },
};

module.exports = util;
