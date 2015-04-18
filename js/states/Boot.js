var LD32 = LD32 || {};

LD32.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
LD32.Boot.prototype = {

    preload: function() {
        //assets we'll use in the loading screen


    },
    create: function() {
        //this.game.time.advancedTiming = true;

        this.game.stage.backgroundColor = '#000000';
        //this.game.stage.smoothed = true;

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.minWidth = LD32.SCREEN_WIDTH * 0.5;
        this.scale.minHeight = LD32.SCREEN_HEIGHT * 0.5;
        this.scale.maxWidth = LD32.SCREEN_WIDTH;
        this.scale.maxHeight = LD32.SCREEN_HEIGHT;

        //have the game centered horizontally
        this.scale.pageAlignVertically = true;
        this.scale.pageAlignHorizontally = true;

        //screen size will be set automatically
        this.scale.setScreenSize(true);

        //physics system for movement
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 0;//LD32.Constants.GRAVITY;

        // plugins
        this.game.plugins.fadePlugin = this.game.plugins.add(Phaser.Plugin.Fade);
        this.game.plugins.shakePlugin = this.game.plugins.add(Phaser.Plugin.ScreenShake);
        //this.game.plugins.add(Phaser.Plugin.PixelScaler, 2);

        // sick of sounds?
        //this.game.sound.mute = true;

        this.state.start('Preload');
    }
};