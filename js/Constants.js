var LD32 = LD32 || {};

// SET UP CORE CONSTANTS
LD32.EXPECTED_TIMESTEP = 1 / 60;
LD32.SCREEN_WIDTH = 1152;
LD32.SCREEN_HEIGHT = 648;
LD32.GAME_WIDTH = 1152;
LD32.GAME_HEIGHT = 648;

LD32.musicIndex = 0;

LD32.Constants = {

    CYCLES_LENGTH: 10, // seconds
    DAY_RATIO: 0.3,

    GRAVITY: 1000,

    // health, upgrade cost
    PLAYER_HEALTH: [
        [10, 0],
        [20, 50],
        [50, 400]
    ],
    PLAYER_SPEED: 600,
    PLAYER_JUMP_HEIGHT: 80,

    FLASHLIGHT_CHARGE: [
        [15, 0],
        [30, 50],
        [60, 200],
        [150, 500]
    ], // seconds
    FLASHLIGHT_DAMAGE: [
        [20, 0],
        [50, 50],
        [100, 150],
        [200, 400]
    ], // over time

    BEAM_DAMAGE: 100,

    // dark matter, pods, cost
    CAPACITY: [
        [50, 4, 0],
        [100, 8, 50]
    ],

    // as enemies are loaded in they will register themselves to this
    // under proto
    ENEMIES: {
        leaper: {
            name: "Leaper",
            health: 30,
            speed: 2, // multiple of player's speed
            attackRange: 100,
            attackDamage: 1,
            attackCooldown: 1.5,
            value: 10,
            earliestNight: 0
        },
        leaperImproved: {
            name: "Advanced Leaper",
            health: 60,
            speed: 4,
            attackRange: 70,
            attackDamage: 2,
            attackCooldown: 1.5,
            value: 50,
            earliestNight: 5
        },
        smasher: {
            name: "Smasher",
            health: 150,
            speed: 0.25,
            attackRange: 5,
            attackDamage: 5,
            attackCooldown: 4,
            value: 60,
            earliestNight: 2
        },
        smasherImproved: {
            name: "Advanced Smasher",
            health: 800,
            speed: 0.2,
            attackRange: 5,
            attackDamage: 20,
            attackCooldown: 4,
            value: 200,
            earliestNight: 7
        },
        airSwarmer: {
            name: "Air Swarmer",
            health: 10,
            speed: 5,
            attackRange: 40,
            attackDamage: 1,
            attackCooldown: 0.2,
            value: 60,
            amount: 4,
            earliestNight: 4
        },
        airSwarmerImproved: {
            name: "Advanced Air Swarmer",
            health: 20,
            speed: 10,
            attackRange: 40,
            attackDamage: 1,
            attackCooldown: 0.2,
            value: 300,
            amount: 8,
            earliestNight: 9
        },
        parabolic: {
            name: "Parabolic",
            health: 75,
            speed: 0.9,
            attackRange: 200,
            attackDamage: 4,
            attackCooldown: 3,
            value: 50,
            earliestNight: 6
        },
        parabolicImproved: {
            name: "Advanced Parabolic",
            health: 150,
            speed: 0.9,
            attackRange: 400,
            attackDamage: 8,
            attackCooldown: 3,
            value: 150,
            earliestNight: 11
        }
    },

    STRUCTURES: {
        darkMatterReactor: {
            name: "Reactor",
            health: 200,
            cost: 500
        },
        umbraGarden: {
            name: "Umbra Garden",
            health: 100,
            cost: 500
        },
        lens: {
            name: "Lens",
            health: 200,
            cost: 200
        },
        mirror: {
            name: "Mirror",
            health: 200,
            cost: 20
        },
        beamSource: {
            name: "Beam Source",
            health: 200,
            cost: -1
        },
        collector: {
            name: "Collector",
            health: 150,
            cost: 150
        },
        darkMatterGenerator: {
            name: "Generator",
            health: 200,
            cost: 500
        },
        distressSignal: {
            name: "Distress Signaller",
            health: 200,
            cost: 2500
        }
    },

    INIT_UNLOCKED_STRUCTURES: [
        "beamSource",
        "mirror",
        "umbraGarden"
    ],

    RESEARCH_DIVISOR: 100, // ceil(cost / divisor) = days to research
    IMPROVE_MULTIPLIER: 4, // building cost x multiplier = research cost
    UNLOCK_MULTIPLIER: 2,

    MAX_REFLECTIONS: 10,

    GROUND_Y: LD32.GAME_HEIGHT - 100
};