var GameUtil = {

    SOUND_FALLOFF_RADIUS_MAX: 200,

    proximitySoundPool: {},
    musicPool: {},

    pickRandom: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    // to be used to recycle entities _only_
    // can take phaser groups or arrays
    recycle: function(group, type) {
        var collection = group;
        if(group instanceof Phaser.Group) {
            collection = group.children;
        }
        var item = null;
        for(var i = 0; i < collection.length; i++) {
            var test = collection[i];
            if(test instanceof type && type.alive) {
                item = test;
                break;
            }
        }
        if(item == null && type != null) {
            item = new type(LD32.game, 0, 0);
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
        for(var i = 0; i < arr.length; i++) {
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
        for(var i = 0; i < group.children.length; i++) {
            var obj = group.children[i];
            if(!obj.alive || obj === origin) continue;
            if(excluded.indexOf(obj) != -1) continue;
            var dx = obj.x - origin.x;
            var dy = obj.y - origin.y;
            var sqDist = dx * dx + dy * dy;
            if(sqDist < bestSqDist) {
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
        for(var i = 0; i < group.children.length; i++) {
            var obj = group.children[i];
            if(!obj.alive || obj === origin) continue;
            var dx = obj.x - origin.x;
            var dy = obj.y - origin.y;
            var sqDist = dx * dx + dy * dy;
            if(sqDist < (radius * radius)) {
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
        for(var i = 0; i < arr.length; i++) {
            var obj = arr[i];
            if(!obj.alive) continue;
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
        var sound = GameUtil.proximitySoundPool[key];
        if(!sound) {
            sound = LD32.game.add.sound(key, volume, loop);
            sound.allowMultiple = false;
            GameUtil.proximitySoundPool[key] = sound;
        }

        // proximity volume adjustment
        var cameraTarget = LD32.game.camera.target;
        var radialMultiplier = Phaser.Math.distance(cameraTarget.x, cameraTarget.y, source.x, source.y) / GameUtil.SOUND_FALLOFF_RADIUS_MAX;
        radialMultiplier = 1 - Phaser.Math.clamp(radialMultiplier, 0, 1);
        volume = volume * radialMultiplier;

        // this is where panning would go

        sound.play("", 0, volume, loop);
        return sound;
    },

    playShuffledMusic: function(list) {
        if(LD32.musicIndex < 0 || LD32.musicIndex >= list.length) {
            var lastPlayedKey = LD32.musicIndex < 0 ? "" : list[list.length - 1];
            LD32.musicIndex = 0;
            do {
                list = Phaser.ArrayUtils.shuffle(list);
            } while(list[0] === lastPlayedKey); // avoid playing the last song repeatedly
        }
        var key = list[LD32.musicIndex];
        var music = GameUtil.musicPool[key];
        if(!music) {
            music = LD32.game.add.sound(key, 0.5, false);
            GameUtil.musicPool[key] = music;
        }
        LD32.musicIndex++;
        music.play();
        return music;
    },

    stripListenersFromMusicPool: function() {
        for(var i = 0; i < GameUtil.musicPool.length; i++) {
            var music = GameUtil.musicPool[i];
            music.onStop.removeAll();
        }
    },

    createPlaceholderBitmap: function(game, width, height, color) {
        // create a new bitmap data object
        var bmd = game.make.bitmapData(width, height);

        // draw to the canvas context like normal
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, width, height);
        bmd.ctx.fillStyle = color;
        bmd.ctx.fill();

        return bmd;
    },

    // Code adapated from
    // http://blog.generalrelativity.org/actionscript-30/collision-detection-circleline-segment-circlecapsule/
    // Accessed 27/02/10
    // Returns the closest point on a line segment to the test point
    getClosestPointToLineSegment: function(point, line) {
        var v = new Phaser.Point(line.end.x, line.end.y);
        Phaser.Point.subtract(v, line.start, v);
        var w = new Phaser.Point(point.x, point.y);
        Phaser.Point.subtract(w, line.start, w);
        var t = w.dot(v) / v.dot(v);
        if(t < 0) {
            t = 0;
        } else if(t > 1) {
            t = 1;
        }
        return Phaser.Point.add(new Phaser.Point(line.start.x, line.start.y), (v.multiply(t, t)));
    },

    // adapted http://www.rocketshipgames.com/blogs/tjkopena/2014/07/circle-intersection-test/
    // accessed 18/04/15
    getClosestLineIntersectionPointWithCircle: function(line, circle) {
        var closestEndPoint = null;

        var lx = line.end.x - line.start.x;
        var ly = line.end.y - line.start.y;

        var len = Math.sqrt(lx * lx + ly * ly);

        var dx = lx / len;
        var dy = ly / len;

        var t = dx * (circle.x - line.start.x) + dy * (circle.y - line.start.y);

        var ex = t * dx + line.start.x;
        var ey = t * dy + line.start.y;

        var lec = Math.sqrt((ex - circle.x) * (ex - circle.x) +
        (ey - circle.y) * (ey - circle.y));

        if(lec < circle.radius) {
            var dt = Math.sqrt(circle.radius * circle.radius - lec * lec);
            closestEndPoint = new Phaser.Point();
            closestEndPoint.x = (t - dt) * dx + line.start.x;
            closestEndPoint.y = (t - dt) * dy + line.start.y;
            // INTERSECTION
        } else if(lec == circle.radius) {
            closestEndPoint = new Phaser.Point();
            closestEndPoint.x = ex;
            closestEndPoint.y = ey;
            // TANGENT
        }

        return closestEndPoint;
    },

    // adapted http://gamemechanicexplorer.com/#raycasting-1
    // accessed 18/04/15
    getClosestLineIntersectionPointWithRectangle: function(line, rectangle, insideRectangle) {
        var distanceToWall = Number.POSITIVE_INFINITY;
        var closestEndPoint = null;

        var rectLines = [
            new Phaser.Line(rectangle.x, rectangle.y, rectangle.x + rectangle.width, rectangle.y),
            new Phaser.Line(rectangle.x, rectangle.y, rectangle.x, rectangle.y + rectangle.height),
            new Phaser.Line(rectangle.x + rectangle.width, rectangle.y,
                rectangle.x + rectangle.width, rectangle.y + rectangle.height),
            new Phaser.Line(rectangle.x, rectangle.y + rectangle.height,
                rectangle.x + rectangle.width, rectangle.y + rectangle.height)
        ];

        for(var i=0; i<rectLines.length; i++) {
            var intersection = Phaser.Line.intersects(line, rectLines[i]);
            if(intersection) {
                if(insideRectangle) {
                    // if the line starts inside the rectangle, there is only one line it will be in contact with
                    closestEndPoint = intersection;
                    return closestEndPoint;
                }
                var distance = Phaser.Math.distance(line.start.x, line.start.y, intersection.x, intersection.y);
                if(distance < distanceToWall) {
                    distanceToWall = distance;
                    closestEndPoint = intersection;
                }
            }
        }

        return closestEndPoint;
    }

};