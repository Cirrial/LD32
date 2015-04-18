var LD32 = LD32 || {};

LD32.PlayState = function() {
};

LD32.PlayState.prototype = {

    backgroundGroup: null,
    sceneryGroup: null,
    structureGroup: null,
    receiverGroup: null,
    playerGroup: null,
    enemyGroup: null,
    effectsGroup: null,
    segmentGroup: null,

    player: null,
    testRay: null,


    create: function() {
        this.game.stage.backgroundColor = '#000000';
        this.game.camera.reset();
        this.game.world.setBounds(0, 0, LD32.GAME_WIDTH, LD32.GAME_HEIGHT);

        this.backgroundGroup = this.game.add.group();
        this.sceneryGroup = this.game.add.group();
        this.structureGroup = this.game.add.group();
        this.receiverGroup = this.game.add.group(); // components part of light receiving structures
        this.playerGroup = this.game.add.group();
        this.enemyGroup = this.game.add.group();
        this.effectsGroup = this.game.add.group();
        this.segmentGroup = this.game.add.group();

        this.player = new LD32.Player(this.game, this.game.width * 0.5, this.game.height * 0.5 - 200);
        this.game.add.existing(this.player);
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
        this.playerGroup.add(this.player);

        this.testRay = this.createLightRay(this.game.width * 0.5, this.game.height * 0.5 + 100);

        var groundBmp = GameUtil.createPlaceholderBitmap(this.game, LD32.GAME_WIDTH, 100, "#202020");
        var ground = this.game.make.sprite(0, LD32.GAME_HEIGHT - 100, groundBmp);
        this.sceneryGroup.add(ground);

        var mirror = new LD32.Mirror(this.game, 800, LD32.GAME_HEIGHT - 200);
        mirror.angle = -45;
        this.receiverGroup.add(mirror);
        mirror = new LD32.Mirror(this.game, 500, LD32.GAME_HEIGHT - 200);
        mirror.angle = 20;
        this.receiverGroup.add(mirror);
    },

    update: function() {
        var cx = this.game.width * 0.5;
        var cy = this.game.height * 0.5;
        var pointer = this.game.input.activePointer;
        var dx = pointer.x - cx;
        var dy = pointer.y - cy;
        this.testRay.cast(null, {x: cx, y: cy}, {x: dx, y: dy});
    },

    render: function() {

    },

    createLightRay: function(x, y) {
        var ray = new LD32.LightRay(this.game, x, y, this.sceneryGroup, this.receiverGroup, this.enemyGroup, this.playerGroup);
        this.segmentGroup.add(ray);
        return ray;
    }
};
