// HACKY EXTENSIONS TO PHASER
// !! THESE ARE LIKELY TO ABRUPTLY STOP WORKING !!

// FORCE BITMAP TEXT TO OBEY ANCHORS, EVEN THOUGH THEY'RE GROUPS
// (whatever, i don't care, i just want the same behaviour)
// http://www.html5gamedevs.com/topic/4158-center-bitmaptext/page-2
// accessed 25/02/15
//Phaser.BitmapText.prototype.anchor = new Phaser.Point();
//Phaser.BitmapText.prototype.update = function() {
//    if(this.anchor != null) {
//        this.updateTransform();
//        this.pivot.x = this.anchor.x * this.textWidth;
//        this.pivot.y = this.anchor.y * this.textHeight;
//    }
//};
//
//// sound hack
//Phaser.Sound.prototype.fadeIn = function(duration, loop, volume) {
//    if(typeof loop === 'undefined') {
//        loop = false;
//    }
//    if(typeof volume === 'undefined') {
//        volume = 1;
//    }
//
//    if(this.paused) {
//        return;
//    }
//
//    this.play('', 0, 0, loop);
//
//    this.fadeTo(duration, volume);
//};