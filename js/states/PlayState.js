var LD32 = LD32 || {};

LD32.PlayState = function() {
};

LD32.PlayState.prototype = {

    create: function() {
        this.game.stage.backgroundColor = '#000000';
        this.game.camera.reset();
        this.game.world.setBounds(0, 0, LD32.GAME_WIDTH, LD32.GAME_HEIGHT);

    },

    update: function() {

    },

    render: function() {

    }
};
