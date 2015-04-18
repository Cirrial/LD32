var LD32 = LD32 || {};

LD32.Player = function(game, x, y) {

    // TODO - graphic

    var width = 40;
    var height = 80;
    var tempBmd = GameUtil.createPlaceholderBitmap(game, width, height, "#A0A0A0");

    Phaser.Sprite.call(this, game, x, y, tempBmd);

    this.anchor.setTo(0.5, 0.5);

    this.maxHealth = this.health = LD32.Constants.PLAYER_HEALTH[0][0];

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSize(width, height, 0, 0);
    this.body.collideWorldBounds = true;
    this.body.maxVelocity.x = 400;
    this.body.maxVelocity.y = 700;
    this.body.drag.x = 2000;

    this.jumping = false;
    this.jumpStrength = 0;
    this.jumpStrengthMax = 80;
    this.jumpDecay = 8;

    this.invulnerabilityTimer = 0;
    this.invulnerabilityTimerAmount = 1;

    this.flashlightChargeMax = this.flashlightCharge = LD32.Constants.FLASHLIGHT_CHARGE[0][0];
    this.flashlightOn = false;
    this.flashlightRay = this.game.state.getCurrentState().createLightRay(this.x, this.y);
    this.flashlightRay.damage = LD32.Constants.FLASHLIGHT_DAMAGE[0][0];

    var flashlightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
    flashlightButton.onDown.add(this.toggleFlashlight, this);
    this.events.onKilled.add(this.onKilled, this);

};

LD32.Player.prototype = Object.create(Phaser.Sprite.prototype);
LD32.Player.prototype.constructor = LD32.Player;


LD32.Player.prototype.update = function() {
    // move on x axis
    if((this.game.input.keyboard.isDown(Phaser.Keyboard.D) || this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))) {
        this.body.acceleration.x = LD32.Constants.PLAYER_SPEED;
        if(!this.flashlightOn) this.scale.x = 1;
        this.animations.play("walk");
    } else if((this.game.input.keyboard.isDown(Phaser.Keyboard.A) || this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))) {
        this.body.acceleration.x = -LD32.Constants.PLAYER_SPEED;
        if(!this.flashlightOn) this.scale.x = -1;
        this.animations.play("walk");
    } else {
        this.body.acceleration.x = 0;
        this.animations.play("stand");
    }

    // jump
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.W) || this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        if(!this.jumping && (this.body.onFloor() || this.body.touching.down)) {
            this.jumping = true;
            this.jumpStrength = this.jumpStrengthMax;
            this.animations.play("jump");
        }
    }
    if(this.jumping) {
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.W) || this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            if(this.jumpStrength > 0) {
                this.body.velocity.y -= this.jumpStrength * (LD32.EXPECTED_TIMESTEP * 200);
                this.jumpStrength -= this.jumpDecay * (LD32.EXPECTED_TIMESTEP * 200);
            }
        } else {
            this.jumping = false;
        }
        this.animations.play("jump");
    }

    if(this.health < 0) this.health = 0;

    // mercy invulnerability
    if(this.invulnerabilityTimer > 0) {
        this.invulnerabilityTimer -= this.game.time.physicsElapsed;
        this.renderable = !this.renderable; // hacky awful flicker
    } else if(this.alive) {
        this.renderable = true;
    }

    // flashlight
    if(this.flashlightOn) {
        this.flashlightCharge -= this.game.time.physicsElapsed;
        if(this.flashlightCharge <= 0) {
            this.flashlightCharge = 0;
            this.flashlightOn = false;
            this.flashlightRay.exists = false;
        } else {
            this.flashlightRay.exists = true;
            var pointer = this.game.input.activePointer;
            var px = pointer.x - this.x;
            var py = pointer.y - this.y;
            this.scale.x = Phaser.Math.sign(px);
            var xOffset = this.width;
            this.flashlightRay.cast(this, {x: this.x + xOffset, y: this.y}, {x: px, y: py});
        }
    }
};

LD32.Player.prototype.toggleFlashlight = function() {
    if(this.flashlightOn) {
        this.flashlightOn = false;
        this.flashlightRay.exists = false;
    } else if(this.flashlightCharge > 0) {
        this.flashlightOn = true;
    }
};

LD32.Player.prototype.isVulnerable = function() {
    return this.invulnerabilityTimer <= 0;
};

LD32.Player.prototype.damage = function(amount, bypassInvulnerability) {
    if(this.alive && (bypassInvulnerability || this.isVulnerable())) { // overridden just for that
        this.health -= amount;

        if(this.health <= 0) {
            this.kill();
        }

        if(!bypassInvulnerability) {
            this.invulnerabilityTimer = this.invulnerabilityTimerAmount;
        }
    }
    return this;
};


LD32.Player.prototype.onKilled = function() {
    // TODO - handle player death - should it game over? Restart from previous night?
    // turn off flashlight
    this.flashlightOn = false;
    this.flashlightRay.exists = false;
};

