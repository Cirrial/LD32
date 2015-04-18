var LD32 = LD32 || {};

LD32.LightRay = function(game, x, y, sceneryGroup, receiverGroup, enemyGroup, playerGroup) {

    // TODO - graphic

    var width = 10;
    var height = 1;
    var tempBmd = GameUtil.createPlaceholderBitmap(game, width, height, "#FFFFFF");



    Phaser.TileSprite.call(this, game, x, y, 10, 1, tempBmd);

    this.anchor.setTo(0.5, 0.5);

    // cache group references
    this.sceneryGroup = sceneryGroup;
    this.receiverGroup = receiverGroup;
    this.enemyGroup = enemyGroup;
    this.playerGroup = playerGroup;

    this.damage = LD32.Constants.BEAM_DAMAGE;

    this.exists = false;
};

LD32.LightRay.prototype = Object.create(Phaser.TileSprite.prototype);
LD32.LightRay.prototype.constructor = LD32.LightRay;

LD32.LightRay.prototype.update = function() {
    if(this.contactLine) {
        this.applyDamage();
    }
};

LD32.LightRay.prototype.cast = function(source, startPoint, direction, reflections) {
    if(!this.exists) return; // do not cast if dead

    if(typeof reflections === 'undefined') {
        reflections = 0;
    }

    var i, r;
    var hitPoint;
    var hasHit = false;
    var endPoint = {x: startPoint.x + (direction.x * 3000), y: startPoint.y + (direction.y * 3000)};
    var rayLine = new Phaser.Line(startPoint.x, startPoint.y, endPoint.x, endPoint.y);


    // raycast from given start point and direction  until we hit (descending priority):

    // a receiver (line segment)
    var closestDistance = Number.MAX_VALUE;
    var chosenHit = null;
    var chosenReceiver = null;
    for(i = 0; i < this.receiverGroup.children.length; i++) {
        var receiver = this.receiverGroup.children[i];
        if(receiver.alive && receiver != source) {
            // collision happens if the receiver's distance to the ray is within the sum of the radius of receiver treating ray as a line
            var rLine = new Phaser.Line(receiver.x - Math.cos(receiver.rotation) * receiver.width * 0.5, receiver.y - Math.sin(receiver.rotation) * receiver.width * 0.5, receiver.x + Math.cos(receiver.rotation) * receiver.width * 0.5, receiver.y + Math.sin(receiver.rotation) * receiver.width * 0.5);
            r = receiver.width;
            hitPoint = Phaser.Line.intersects(rLine, rayLine)//GameUtil.getClosestPointToLineSegment(receiver, rayLine);
            if(hitPoint) {
                var distance = Phaser.Point.distance(startPoint, hitPoint);
                if(distance < closestDistance) {
                    closestDistance = distance;
                    chosenHit = hitPoint;
                    chosenReceiver = receiver;
                }
            }
        }
    }

    // once we get our closest option
    if(chosenHit) {
        // CONTACT
        endPoint = chosenHit;
        hasHit = true;
        chosenReceiver.lightHit(this, endPoint, direction, source, reflections);
    }

    // world scenery
    if(!hasHit) {
        for(i = 0; i < this.sceneryGroup.children.length; i++) {
            var scenery = this.sceneryGroup.children[i];
            // test for rectangle intersect
            var boundingRectangle = scenery.getBounds();
            hitPoint = GameUtil.getClosestLineIntersectionPointWithRectangle(rayLine, boundingRectangle);
            if(hitPoint != null) {
                // CONTACT
                endPoint = hitPoint;
                hasHit = true;
            }
        }
    }
    // else it hits nothing
    // just use the existing thing

    var dx = endPoint.x - startPoint.x;
    var dy = endPoint.y - startPoint.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    // change height
    this.height = Math.max(1, dist);
    // rotate
    this.rotation = Math.atan2(dy, dx) + Math.PI*0.5;
    // position
    this.x = startPoint.x + dx * 0.5;
    this.y = startPoint.y + dy * 0.5;

    rayLine.setTo(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    this.contactLine = rayLine;
    this.originSource = source;
};

LD32.LightRay.prototype.applyDamage = function() {
    if(!this.exists) return;
    // check if this segment overlaps any enemies or the player, and do damage as appropriate
    var i;

    for(i = 0; i < this.enemyGroup.children.length; i++) {
        var enemy = this.enemyGroup.children[i];
        if(this.checkSpriteOverlap(enemy, this.contactLine)) {
            enemy.damage(this.damage * this.game.time.physicsElapsed);
        }
    }

    for(i = 0; i < this.playerGroup.children.length; i++) {
        var player = this.playerGroup.children[i];
        if(this.checkSpriteOverlap(player, this.contactLine)) {
            player.damage(this.damage * this.game.time.physicsElapsed * 0.5);
        }
    }
};

LD32.LightRay.prototype.checkSpriteOverlap = function(sprite, rayLine) {
    var r = Math.min(sprite.width, sprite.height) + this.width;
    var closestPoint = GameUtil.getClosestPointToLineSegment(sprite, rayLine);
    return Phaser.Point.distance(sprite, closestPoint) <= r && this.originSource != sprite;
};