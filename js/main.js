var LD32 = LD32 || {};

// SET UP CONSTANTS
LD32.EXPECTED_TIMESTEP = 1 / 60;
LD32.SCREEN_WIDTH = 1152;
LD32.SCREEN_HEIGHT = 648;
LD32.GAME_WIDTH = 1152;
LD32.GAME_HEIGHT = 648;

LD32.musicIndex = 0;


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


// there are four parts that need to be done here in descending order of priority

// DEFENSE
// - survive enemy waves, use flashlight to attack enemies at a very far distance and stay far away from enemies (flashlight does damage over time)
// - use built up defences to hide and survive

// BUILD/RESOURCE STUFF
// - build and manage resources
// - build on specified building slots using up or down

// RESEARCH
// - unlock new building types
// - improve existing building types
// - improve player

// HOME
// - PAUSE TIME PROGRESSION ON ENTRY
// - DISALLOW ENTRY IF ENEMIES OUTSIDE
// - sleep for heals and go to next night
// - consult logs on enemy types and structure types (this is actually super low priority)
// - check totals of all buildings
// - pick research item
// - get goals


// FEATURES
// - world (simple, flat plane, probably)
// - time passage (one night is five minutes? formula of enemy points that are the wave that show up at the beginning of the night)
// - player character (platformer movement style)
// - light physics
//      - rays need to emit, reflect and collide (handle as segments?)
//      - ray segments need to check for collision with player and/or enemy (ignore flashlight from player though)
// - flashlight weapon (20 damage per second while it's in contact) (15 second battery)
// - inventory slots (dark matter) (umbra pod)
// - enemies
// - buildings
// - resources
// - research
// - home stuff?

// UI
// - ability to take dark matter/umbra pods and move them from one structure to another (press down in front of building to remove if not holding, or up to insert if holding)
// - beam sources - up and down move the beam source instead
// - charge flashlight in front of reactor ('removing' power)
// - quick heal when holding umbra pods (press different key)
// - turn flashlight on/off (second different key)
// - quick disable/enable of beam sources via number keys? up to four beam sources
// - selection menu for building, or researching
// - menu for reading about buildings or enemies or world
// - input methods:
// keyboard+mouse, WASD, E for heal, F for toggle flashlight, 1234 for beam sources
// keyboard (flashlight autoaimed at nearest enemy), arrows, X for heal, C for flashlight, 1234 for beam sources
// gamepad, left stick for move, right stick for move flashlight, left trigger for flashlight, right trigger for heal, face buttons for beam sources


// assuming player health of 10

// ENEMIES
// - enemies all drop dark matter on death which needs to be collected by the player or some sort of collection structure
// - amount dropped should be a random number based on 1/2 the value +/- 1/8 the value
// - leaper enemy - fast, weak, leaps at targets, does contact + knockback for player -
    // health: 50, speed: 2xplayer, leap distance: 70, attack damage: 1 per leap, each leap has 1.5 second cooldown - value: 10
    // improved: 2x damage, 1.5x speed - value: 50
// - smasher enemy - slow, heavily armoured, slow attack but strong, targets structures over player -
    // health: 200, speed: 0.25xplayer, attack distance: 5, attack damage: 5 per hit, each hit has 4 second cooldown - value: 30
    // improved: 4x health, 4x damage - value: 200
// - air swarm enemy - fast, aerial, very weak attack but many of them at a time, targets player as priority
    // health: 20, speed: 7xplayer, attack range: 40, attack damage: 1 per projectile, 0.2 cooldown, x4 enemies - value: 60
    // improved: 2x speed, 2x amount - value: 300
// - parabolic arc projectile enemy - middling speed, probably just slower than the player, fires projectiles in an arc (45 degrees)
    // health: 75, speed: 0.9xplayer, attack range: 200, attack damage: 4 per hit, each hit has 3 second cooldown - value: 50
    // improved: 2x range, 2x health, 2x attack damage - value: 150

// BUILDINGS
// buildings take up slots
// all buildings have 100 health
// buildings build pretty much instantly, hooray dark matter
// upgrades automatically apply

// - dark matter reactor (charge flashlight, changes dark matter into power) - free, can't build, but for upgrade purposes, 500 dark matter
    // - improved: provides 3 power instead of 1
// - umbra garden (grows umbra pods from dark matter, which can be eaten for health) - 50 dark matter
    // - improved: grow in 1 day instead of 2

// - lens (amplifies any light that comes towards it into a stronger beam)  - x2 strength - 200 dark matter
    // - improved: stronger beam - x5 strength
// - mirror (redirects light in a direction) - 20 dark matter
    // - improved: splits light, light reflects as before but also lets original light direction continue
// - beam source (converts power into light) - light does 100 damage per second - SPECIAL
    // can't improve

// - collector (drags all collectibles in 200 radius into itself, feeds dark matter into reactors if they fall below 50 dark matter) - 150 dark matter
    // - improved: x4 radius, closer collector to a collectible wins
// - dark matter generator (creates dark matter) - 1 dark matter per second - 500 dark matter
    // - improved: 5 dark matter per second
// - distress signal (starts final wave) - 2500 dark matter

// - home (enter during downtime for research and eat and sleep (full heal)) - free, can't build

// RESOURCES
// - power (used to power flashlight charger and beam source)
// - dark matter (used to make buildings and a lot of other things)
    // - dropped forms (1, 10, 100)
    // - max held capacity 50
// - umbra pod (used to heal), max held capacity 4

// 10 dark matter will create 1 umbra pod in 2 days
// garden can only hold up to 5 mature umbra pods

// RESEARCH
// improve buildings (4x cost placement)
// building unlocks: (2x cost for placement)
// - collector
// - lens
// - dark matter generator
// - distress signal
// improve flashlight
// - 50 dmg (50 dark matter), 100 dmg (150 dark matter), 200 dmg (400 dark matter)
// - 30 second battery (50 dark matter), 60 second battery (200 dark matter), 150 second battery (500 dark matter)
// personal armor
// - 20 health (50 dark matter), 50 health (400 dark matter)
// capacity
// - 8 pods, 100 dark matter (50 dark matter)
// beam sources
// - 2 sources (200 dark matter), 3 sources (1000 dark matter), 4 sources (4000 dark matter)
// research costs X dark matter and takes Y days to complete, where Y is ceil(X/100)

// HOME STUFF
// research
// build things
// sleep (advance to next night)
// consult logs of enemies and buildings etc.