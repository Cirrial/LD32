var LD32 = LD32 || {};

//loading the game assets
LD32.Preload = function(){};

LD32.Preload.prototype = {
    preload: function() {
        // preload all the assets required here


    },

    create: function() {
        this.state.start('PlayState');
    }
};