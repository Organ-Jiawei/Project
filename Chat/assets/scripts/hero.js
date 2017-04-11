cc.Class({
    extends: cc.Component,

    properties: {
    	imgHero: cc.Node,
        lblName: cc.Label
    },

    init: function(info) {
        this.lblName.string = info.hero_name;

        var url = 'resources/img/battle_hero/' + info.hero_id + '.png';
        game.util.changeSpriteFrame(this.imgHero, url, null, false, true);
    },
});
