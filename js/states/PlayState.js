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

    gameClock: null,

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

        this.gameClock = new LD32.GameClock(this.game);

        this.player = new LD32.Player(this.game, this.game.width * 0.5, this.game.height * 0.5 - 200);
        this.game.add.existing(this.player);
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
        this.playerGroup.add(this.player);

        var groundBmp = GameUtil.createPlaceholderBitmap(this.game, LD32.GAME_WIDTH, 100, "#202020");
        var ground = this.game.make.sprite(0, LD32.Constants.GROUND_Y, groundBmp);
        this.game.physics.enable(ground, Phaser.Physics.ARCADE);
        ground.body.moves = false;
        ground.body.immovable = true;
        this.sceneryGroup.add(ground);

        for(var i=0; i<4; i++) {
            var mirror = new LD32.Mirror(this.game, Math.random() * LD32.GAME_WIDTH, LD32.Constants.GROUND_Y - 200);
            mirror.angle = Math.random() * 360;
            this.receiverGroup.add(mirror);
        }
    },

    update: function() {
        this.game.physics.arcade.collide(this.playerGroup, this.sceneryGroup);
        this.game.physics.arcade.collide(this.enemyGroup, this.sceneryGroup);

        this.gameClock.tick(this.game.time.physicsElapsed);
    },

    render: function() {

    },

    createLightRay: function(x, y) {
        var ray = new LD32.LightRay(this.game, x, y, this.sceneryGroup, this.receiverGroup, this.enemyGroup, this.playerGroup);
        this.segmentGroup.add(ray);
        return ray;
    }
};
