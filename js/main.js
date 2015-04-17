var LD32 = LD32 || {};

// SET UP CONSTANTS
LD32.EXPECTED_TIMESTEP = 1 / 60;
LD32.SCREEN_WIDTH = 1152;
LD32.SCREEN_HEIGHT = 648;
LD32.GAME_WIDTH = 1152;
LD32.GAME_HEIGHT = 648;


LD32.game = new Phaser.Game(LD32.SCREEN_WIDTH, LD32.SCREEN_HEIGHT, Phaser.AUTO, '');

// SET UP STATES
LD32.game.state.add('Boot', LD32.Boot);
LD32.game.state.add('Preload', LD32.Preload);
LD32.game.state.add('PlayState', LD32.PlayState);

// GO
LD32.game.state.start('Boot');


// TODO - plan game
// TODO - plan game entities
// TODO - misc other game states
// TODO - graphics
// TODO - sounds
// TODO - music?







