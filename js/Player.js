var LD32 = LD32 || {};

LD32.Player = function(game, x, y) {

    // TODO - graphic

    var width = 22;
    var height = 56;
    var tempBmd = GameUtil.createPlaceholderBitmap(game, width, height, "#A0A0A0");

    Phaser.Sprite.call(this, game, x, y, tempBmd);

    this.anchor.setTo(0.5, 0.5);

    this.maxHealth = this.health = LD32.Constants.PLAYER_HEALTH[0][0];

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSize(width, height, 0, 0);
    this.body.collideWorldBounds = true;
    this.body.maxVelocity.x = 300;
    this.body.maxVelocity.y = 800;
    this.body.drag.x = 2000;

    this.events.onKilled.add(this.onKilled, this);

};

LD32.Player.prototype = Object.create(Phaser.Sprite.prototype);
LD32.Player.prototype.constructor = LD32.Player;


LD32.Player.prototype.onKilled = function() {
    // TODO - handle player death - should it game over? Restart from previous night?
};