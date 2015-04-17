DAMEMapLoader = function(game) {
    this.game = game;

};

DAMEMapLoader.prototype.loadLevel = function(levelKey, mainLayerName, mapGroup, spriteAddedCallback, callbackContext) {
    var i, j, k;
    // convert loaded text into xml
    var xml = this.game.cache.getText(levelKey);
    var parser = new DOMParser();
    xml = parser.parseFromString(xml, "application/xml");
    var loadLayers = xml.getElementsByTagName('layer');

    var linkDictionary = {};
    var pathDictionary = {};
    var pathList = [];

    // go through each layer
    for(i = 0; i < loadLayers.length; i++) {
        var layerNode = loadLayers[i];
        // for each layer,

        // load in any specified maps
        var mapNodes = layerNode.getElementsByTagName('map');
        if(mapNodes.length > 0) {
            for(j = 0; j < mapNodes.length; j++) {
                var mapNode = mapNodes[j];
                // use layer name for map key
                var map = this.game.add.tilemap(layerNode.getAttribute('name'), Number(mapNode.getAttribute('tileWidth')), Number(mapNode.getAttribute('tileHeight')));
                map.addTilesetImage('tileset');
                map.setCollisionByExclusion([0]); // assumptions from flixel
                var layer = map.createLayer(0);
                if(layerNode.getAttribute('name') === mainLayerName) {
                    this.mainMap = map;
                    this.mainLayer = layer;
                    this.mainLayer.resizeWorld();
                }
                mapGroup.add(layer);
            }
        }

        // load in sprites! (oh god)
        var spriteNodes = layerNode.getElementsByTagName('sprite');
        if(spriteNodes.length > 0) {
            for(j = 0; j < spriteNodes.length; j++) {
                var spriteNode = spriteNodes[j];
                var spriteClassName = spriteNode.getAttribute('class');
                // load sprite generically
                // THIS DOES WEIRD SCIENCE BASED ON SPRITE CLASS NAMES, THIS WILL NEED TO BE FIXED PER PROJECT
                if(LD23[spriteClassName] != null) {
                    var sprite = new LD23[spriteClassName](this.game, Number(spriteNode.getAttribute('x')), Number(spriteNode.getAttribute('y')));
                    if(spriteNode.getAttribute("flip") == "true") {
                        if(sprite.anchor.x == 0) {
                            sprite.x += sprite.width * 0.5;
                            sprite.anchor.set(0.5, 0);
                        } else {
                            sprite.x += sprite.width;
                        }
                        sprite.scale.x = -1;
                    }
                    this.game.add.existing(sprite);

                    // store link and path ids to dictionaries
                    if(spriteNode.hasAttribute('linkId')) {
                        var linkId = spriteNode.getAttribute('linkId');
                        linkDictionary[linkId] = sprite;
                    }
                    if(spriteNode.hasAttribute('pathId')) {
                        var pathId = spriteNode.getAttribute('pathId');
                        pathDictionary[pathId] = sprite;
                    }

                    // prepare properties
                    var propertiesNodes = spriteNode.getElementsByTagName('properties');
                    if(propertiesNodes.length > 0) {
                        var propertyNode = propertiesNodes[0];
                        var props = propertyNode.getElementsByTagName('prop');
                        var propObj = {};
                        for(k = 0; k < props.length; k++) {
                            var prop = props[k];
                            propObj[prop.getAttribute('name')] = prop.getAttribute('value');
                        }
                        // if the sprite can take these properties, give them
                        // otherwise this was probably a whole waste of time
                        if(sprite.giveProperties != null) {
                            sprite.giveProperties(propObj);
                        } else {
                            console.log("Tried to give following properties to " + spriteClassName + " but couldn't: \n" + propObj);
                        }
                    }

                    // callback (do this last so that initial properties are already set up)
                    spriteAddedCallback.call(callbackContext, sprite, spriteClassName);
                }
            }
        }

        // UNCOMMENT THIS IF YOU USE PATHS

        //// load up paths
        //var pathNodes = layerNode.getElementsByTagName('path');
        //if(pathNodes.length > 0) {
        //    for(j = 0; j < pathNodes.length; j++) {
        //        var pathNode = pathNodes[j];
        //        var nodeNode = pathNode.getElementsByTagName('nodes')[0]; // wonderful name
        //        var nodes = nodeNode.getElementsByTagName('node');
        //        var path = new Throwbots.Path(this.game);
        //        for(k = 0; k < nodes.length; k++) {
        //            var node = nodes[k];
        //            path.add(Number(node.getAttribute('x')), Number(node.getAttribute('y')));
        //        }
        //        pathList.push(path);
        //    }
        //}
    }

    // load in links, set them up
    // ORDER IS IMPORTANT - 'TO' IS LINKED TO 'FROM', 'FROM' OWNS THE LINK
    var linkNode = xml.getElementsByTagName('links')[0];
    var links = linkNode.getElementsByTagName('link');
    for(i = 0; i < links.length; i++) {
        var link = links[i];
        var fromId = link.getAttribute('from');
        var toId = link.getAttribute('to');

        var fromSprite = linkDictionary[fromId];
        var toSprite = linkDictionary[toId];

        // if either sprite doesn't exist, the link shouldn't be made
        if(fromSprite && toSprite) {
            fromSprite.link(toSprite);
        }
    }

    //// assign paths to sprites that take paths
    //for(i = 0; i < pathList.length; i++) {
    //    var definedPath = pathList[i];
    //    var targetSprite = pathDictionary[i];
    //    if(targetSprite) {
    //        targetSprite.setPath(definedPath);
    //    }
    //}
};