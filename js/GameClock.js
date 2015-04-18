var LD32 = LD32 || {};

LD32.GameClock = function(game) {
    this.game = game;
};

LD32.GameClock.prototype = {

    totalSecondsElapsed: 0,
    secondsElapsed: 0,
    cyclesElapsed: 0,

    tick: function(numSeconds) {
        this.totalSecondsElapsed += numSeconds;
        this.secondsElapsed += numSeconds;
        if(this.secondsElapsed > LD32.Constants.CYCLES_LENGTH) {
            this.secondsElapsed -= LD32.Constants.CYCLES_LENGTH;
            this.cyclesElapsed++;
            this.startWave(30 + Math.pow(this.cyclesElapsed, 2.3));
            console.log("Start of Cycle " + this.cyclesElapsed);
        }
    },

    getProgressionOfCycle: function() {
        return this.secondsElapsed / LD32.Constants.CYCLES_LENGTH;
    },

    isDay: function() {
        return this.getProgressionOfCycle() < LD32.Constants.DAY_RATIO;
    },

    isNight: function() {
        return this.getProgressionOfCycle() >= LD32.Constants.DAY_RATIO;
    },

    startWave: function(enemyPoints) {
        var pointsRemaining = enemyPoints;
        var cheapestCost = Number.MAX_VALUE;
        for(var enemyType in LD32.Constants.ENEMIES) {
            if(LD32.Constants.ENEMIES[enemyType].hasOwnProperty("value")) {
                if(LD32.Constants.ENEMIES[enemyType].value < cheapestCost && this.cyclesElapsed >= LD32.Constants.ENEMIES[enemyType].earliestNight) {
                    cheapestCost = LD32.Constants.ENEMIES[enemyType].value;
                }
            }
        }

        while(pointsRemaining >= cheapestCost) {
            var candidateEnemyTypes = [];
            for(var enemyType in LD32.Constants.ENEMIES) {
                if(LD32.Constants.ENEMIES[enemyType].hasOwnProperty("value")) {
                    if(pointsRemaining >= LD32.Constants.ENEMIES[enemyType].value) {
                        candidateEnemyTypes.push(LD32.Constants.ENEMIES[enemyType]);
                    }
                }
            }

            // pick from available options
            var choice = GameUtil.pickRandom(candidateEnemyTypes);

            // buy as many of it as possible
            var cost = choice.value;
            var amount = Math.floor(pointsRemaining / cost);
            pointsRemaining -= amount * cost;
            this.spawnEnemy(choice, amount);
            console.log("Trying to spawn " + amount + " " + choice.name + ", " + pointsRemaining + " left");
        }

        // should have spawned all available enemies!
    },


    spawnEnemy: function(enemyType, amount) {
        var xStart = LD32.GAME_WIDTH*0.5 + Phaser.Math.sign(Math.random()-0.5) * (LD32.GAME_WIDTH * 0.3 + Math.random() * LD32.GAME_WIDTH * 0.2);
        if(enemyType.amount > 0) {
            amount *= enemyType.amount;
        }
        for(var i=0; i<amount; i++) {
            if(enemyType.code) {
                var enemy = GameUtil.recycle(this.game.state.getCurrentState().enemyGroup, enemyType.code);
                enemy.spawn(xStart);
            }
        }
    }

};