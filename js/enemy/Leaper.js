var LD32 = LD32 || {};

LD32.Leaper = function(game, x, y) {
    // TODO - graphic

    var width = 80;
    var height = 40;
    var tempBmd = GameUtil.createPlaceholderBitmap(game, width, height, "#A09090");

    Phaser.Sprite.call(this, game, x, y, tempBmd);

    this.anchor.setTo(0.5, 0.5);

    var data = LD32.Constants.ENEMIES['leaper'];

    this.maxHealth = this.health = data.health;
    this.speed = LD32.Constants.PLAYER_SPEED * data.speed;
    this.attackRange = data.attackRange;
    this.attackDamage = data.attackDamage;
    this.attackCooldown = data.attackCooldown;
    this.attackCooldownTimer = 0;

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSize(width, height, 0, 0);
    this.body.collideWorldBounds = true;
    this.body.maxVelocity.x = 400;
    this.body.maxVelocity.y = 800;
    this.body.drag.x = 2000;

    this.leaping = false;
    this.leapPower = 50;

    this.target = this.game.state.getCurrentState().player;
};

LD32.Leaper.prototype = Object.create(Phaser.Sprite.prototype);
LD32.Leaper.prototype.constructor = LD32.Leaper;
LD32.Constants.ENEMIES['leaper'].code = LD32.Leaper;

LD32.Leaper.prototype.spawn = function(xStart) {
    // TODO - animation & invulnerability?
    this.reset(xStart + (Math.random()-0.5) * 50, LD32.Constants.GROUND_Y - this.height * 0.5, this.maxHealth);
};

LD32.Leaper.prototype.update = function() {
    if(!this.alive) return;
    var dx, dist;
    // chase after player!
    if(this.target.alive) {

        dx = this.target.x - this.x;
        var dir = Phaser.Math.sign(dx);

        if(!this.leaping) {
            this.body.acceleration.x = this.speed * dir;
        }

        dist = Phaser.Point.distance(this, this.target);
        if(dist < this.attackRange) {
            this.leap(dir);
        }
    } else {
        // leap randomly
        this.body.acceleration.x = 0;
        this.leap(Phaser.Math.sign((Math.random() - 0.5)*3));
    }

    if(this.leaping) {
        dist = Phaser.Point.distance(this, this.target);
        if(dist < this.width + this.target.width) {
            this.dealHit(this.target);
        }
        if(this.body.velocity.y == 0 && (this.body.onFloor() || this.body.touching.down)) {
            this.leaping = false;
        }
    }
    this.attackCooldownTimer -= this.game.time.physicsElapsed;
    if(this.attackCooldownTimer <= 0) this.attackCooldownTimer = 0;
};

LD32.Leaper.prototype.leap = function(dir) {
    if(!this.alive) return;
    if(this.leaping || this.attackCooldownTimer > 0) return;
    this.attackCooldownTimer = this.attackCooldown;
    this.scale.x = dir;
    this.body.acceleration.x = 0;
    this.body.acceleration.y = 0;
    this.body.velocity.x += this.speed * 6 * dir;
    this.body.velocity.y -= this.leapPower;
    this.leaping = true;
};

LD32.Leaper.prototype.dealHit = function(victim) {
    if(!this.alive) return;
    victim.damage(this.attackDamage);
    if (victim.x < this.x ) {
        this.body.velocity.x -= 2000;
    } else {
        this.body.velocity.x += 2000;
    }
    this.body.velocity.y -= 1500;
};