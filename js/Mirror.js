var LD32 = LD32 || {};

LD32.Mirror = function(game, x, y) {

    // TODO - graphic

    var width = 100;
    var height = 10;
    var tempBmd = GameUtil.createPlaceholderBitmap(game, width, height, "#D0D0D0");

    Phaser.Sprite.call(this, game, x, y, tempBmd);

    this.anchor.setTo(0.5, 0.5);

    this.shoneOn = false;
    this.prevShoneOn = false;
    this.ray = null;
};

LD32.Mirror.prototype = Object.create(Phaser.Sprite.prototype);
LD32.Mirror.prototype.constructor = LD32.Mirror;

LD32.Mirror.prototype.update = function() {
    this.prevShoneOn = this.shoneOn;
    this.shoneOn = false;
    if(this.shoneOn == false && this.prevShoneOn == false) {
        if(this.ray) this.ray.exists = false;
    }
};

LD32.Mirror.prototype.lightHit = function(lightRay, contactPoint, direction, originSource) {
    if(this == originSource) return;
    this.shoneOn = true;
    if(this.ray == null) {
        this.ray = this.game.state.getCurrentState().createLightRay(contactPoint.x, contactPoint.y);
    }
    this.ray.exists = true;

    var reflectBaseLine = new Phaser.Line(this.x, this.y, this.x + Math.cos(this.rotation), this.y + Math.sin(this.rotation));
    var directionLine = new Phaser.Line(contactPoint.x - direction.x, contactPoint.y - direction.y, contactPoint.x, contactPoint.y);
    var reflectAngle = Phaser.Line.reflect(reflectBaseLine, directionLine);
    var reflectLine = new Phaser.Line().fromAngle(contactPoint.x, contactPoint.y, reflectAngle, 10);

    this.ray.cast(this, contactPoint, new Phaser.Point(reflectLine.x, reflectLine.y));
};
