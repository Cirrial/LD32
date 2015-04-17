var GameUtil = {

    SOUND_FALLOFF_RADIUS_MAX: 200,

    proximitySoundPool: {},
    musicPool: {},

    // to be used to recycle entities _only_
    // can take phaser groups or arrays
    recycle: function(group, type) {
        var collection = group;
        if(group instanceof Phaser.Group) {
            collection = group.children;
        }
        var item = null;
        for(var i=0; i<collection.length; i++) {
            var test = collection[i];
            if(test instanceof type && type.alive) {
                item = test;
                break;
            }
        }
        if(item == null && type != null) {
            item = new type(Flourish.game, 0, 0);
            if(group instanceof Phaser.Group) {
                group.add(item);
            } else {
                group.push(item);
            }
        }
        return item;
    },

    countLivingInArray: function(arr) {
        var alive = 0;
        for(var i=0; i<arr.length; i++) {
            var entity = arr[i];
            if(entity.alive) {
                alive++;
            }
        }
        return alive;
    },

    getNearest: function(origin, group, maxDist, excluded) {
        if(typeof maxDist === 'undefined') {
            maxDist = 1000;
        }
        if(typeof excluded === 'undefined') {
            excluded = [];
        }
        var bestSqDist = maxDist * maxDist;
        var bestMatch = null;
        for(var i=0; i <group.children.length; i++) {
            var obj = group.children[i];
            if (!obj.alive || obj === origin) continue;
            if(excluded.indexOf(obj) != -1) continue;
            var dx = obj.x - origin.x;
            var dy = obj.y - origin.y;
            var sqDist = dx * dx + dy * dy;
            if (sqDist < bestSqDist) {
                bestSqDist = sqDist;
                bestMatch = obj;
            }
        }
        return bestMatch;
    },

    getAllWithin: function(origin, group, radius) {
        if(typeof radius === 'undefined') {
            radius = 1000;
        }
        var entities = [];
        for(var i=0; i <group.children.length; i++) {
            var obj = group.children[i];
            if (!obj.alive || obj === origin) continue;
            var dx = obj.x - origin.x;
            var dy = obj.y - origin.y;
            var sqDist = dx * dx + dy * dy;
            if (sqDist < (radius * radius)) {
                entities.push(obj);
            }
        }
        return entities;
    },

    getMeanPositionOfEntitiesInArray: function(arr, point) {
        if(typeof point === 'undefined') {
            point = new Phaser.Point();
        }
        var num = 0;
        for(var i=0; i <arr.length; i++) {
            var obj = arr[i];
            if (!obj.alive) continue;
            num++;
            point.x += obj.x;
            point.y += obj.y;
        }
        point.x /= num;
        point.y /= num;
        return point;
    },

    playSound: function(key, source, volume, loop) {
        if(volume == null || volume == undefined) {
            volume = 0.4;
        }
        var sound = Flourish.Util.proximitySoundPool[key];
        if(!sound) {
            sound = Flourish.game.add.sound(key, volume, loop);
            sound.allowMultiple = false;
            Flourish.Util.proximitySoundPool[key] = sound;
        }

        // proximity volume adjustment
        var cameraTarget = Flourish.game.camera.target;
        var radialMultiplier = Phaser.Math.distance(cameraTarget.x, cameraTarget.y, source.x, source.y) / Flourish.Util.SOUND_FALLOFF_RADIUS_MAX;
        radialMultiplier = 1 - Phaser.Math.clamp(radialMultiplier, 0, 1);
        volume = volume * radialMultiplier;

        // this is where panning would go

        sound.play("", 0, volume, loop);
        return sound;
    },

    playShuffledMusic: function(list) {
        if(Flourish.musicIndex < 0 || Flourish.musicIndex >= list.length) {
            var lastPlayedKey = Flourish.musicIndex < 0 ? "" : list[list.length - 1];
            Flourish.musicIndex = 0;
            do {
                list = Phaser.ArrayUtils.shuffle(list);
            } while(list[0] === lastPlayedKey); // avoid playing the last song repeatedly
        }
        var key = list[Flourish.musicIndex];
        var music = Flourish.Util.musicPool[key];
        if(!music) {
            music = Flourish.game.add.sound(key, 0.5, false);
            Flourish.Util.musicPool[key] = music;
        }
        Flourish.musicIndex++;
        music.play();
        return music;
    },

    stripListenersFromMusicPool: function() {
        for(var i=0; i<Flourish.Util.musicPool.length; i++) {
            var music = Flourish.Util.musicPool[i];
            music.onStop.removeAll();
        }
    }
};