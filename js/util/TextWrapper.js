// Chopped and changed utility 'class' ported from TypeScript to Javascript.
// from http://sbcgamesdev.blogspot.co.uk/2015/02/phaser-tutorial-how-to-wrap-bitmap-text.html
// accessed 25/2/15

var TextWrapper = {
    eCharType: {
        UNDEFINED: -1,
        SPACE: 1,
        NEWLINE: 2,
        CHARACTER: 3
        //SPECIAL = 4 // for future
    },

    mText: "",
    mTextPosition: 0,
    mFontData: null,

    // -------------------------------------------------------------------------
    hasNext: function() {
        return TextWrapper.mTextPosition < TextWrapper.mText.length;
    },
    // -------------------------------------------------------------------------
    getChar: function() {
        return TextWrapper.mText.charAt(TextWrapper.mTextPosition++);
    },

    // -------------------------------------------------------------------------
    peekChar: function() {
        return TextWrapper.mText.charAt(TextWrapper.mTextPosition);
    },

    // -------------------------------------------------------------------------
    getPosition: function() {
        return TextWrapper.mTextPosition;
    },

    // -------------------------------------------------------------------------
    setPosition: function(aPosition) {
        TextWrapper.mTextPosition = aPosition;
    },

// -------------------------------------------------------------------------
    getCharAdvance: function(aCharCode, aPrevCharCode) {
        var charData = TextWrapper.mFontData.chars[aCharCode];

        // width
        var advance = charData.xAdvance;

        // kerning
        if(aPrevCharCode > 0 && charData.kerning[aPrevCharCode])
            advance += charData.kerning[aPrevCharCode];

        return advance;
    },

// -------------------------------------------------------------------------
    getCharType: function(aChar) {
        if(aChar === ' ')
            return TextWrapper.eCharType.SPACE;
        else if(/(?:\r\n|\r|\n)/.test(aChar))
            return TextWrapper.eCharType.NEWLINE;
        else
            return TextWrapper.eCharType.CHARACTER;
    },

// -------------------------------------------------------------------------
    wrapText: function(aText, aWidth, aHeight, aFontName, aSize) {
        // set vars for text processing
        TextWrapper.mText = aText;
        TextWrapper.setPosition(0);
        // font data
        TextWrapper.mFontData = PIXI.BitmapText.fonts[aFontName];

        // if size not defined then take default size
        if(aSize == undefined)
            aSize = TextWrapper.mFontData.size;

        var scale = aSize / TextWrapper.mFontData.size;
        // height of line scaled
        var lineHeight = TextWrapper.mFontData.lineHeight * scale;
        // instead of scaling every single character we will scale line in opposite direction
        var lineWidth = aWidth / scale;

        // result
        var mLineStart = [];
        var mLineChars = [];
        var mPageStart = [];
        var mMaxLine = 0;
        var firstLineOnPage = true;
        var pageCounter = 0;

        // char position in text
        var currentPosition = 0;
        // first line position
        mLineStart[mMaxLine] = currentPosition;
        // first page
        mPageStart[pageCounter++] = 0;
        // remaining height of current page
        var remainingHeight = aHeight;


        // whole text
        while(TextWrapper.hasNext()) {
            var charCount = 0;
            // saves number of chars before last space
            var saveSpaceCharCount = 0;
            var saveCharPosition = -1;
            // (previous) type of character
            var type = TextWrapper.eCharType.UNDEFINED;
            var previousType = TextWrapper.eCharType.UNDEFINED;
            // remaining width will decrease with words read
            var remainingWidth = lineWidth;
            // previous char code
            var prevCharCode = -1;

            // single line
            while(TextWrapper.hasNext()) {
                currentPosition = TextWrapper.getPosition();
                // read char and move in text by 1 character forward
                var char = TextWrapper.getChar();
                // get type and code
                type = TextWrapper.getCharType(char);
                var charCode = char.charCodeAt(0);

                // process based on type
                if(type === TextWrapper.eCharType.SPACE) {
                    if(previousType != TextWrapper.eCharType.SPACE)
                        saveSpaceCharCount = charCount;

                    ++charCount;
                    remainingWidth -= TextWrapper.getCharAdvance(charCode, prevCharCode);
                }
                else if(type === TextWrapper.eCharType.CHARACTER) {
                    if(previousType !== TextWrapper.eCharType.CHARACTER)
                        saveCharPosition = currentPosition;

                    remainingWidth -= TextWrapper.getCharAdvance(charCode, prevCharCode);

                    if(remainingWidth < 0)
                        break;

                    ++charCount;
                }
                else if(type === TextWrapper.eCharType.NEWLINE) {
                    var breakLoop = false;

                    // if there is no more text then ignore new line
                    if(TextWrapper.hasNext()) {
                        breakLoop = true;
                        saveSpaceCharCount = charCount;
                        saveCharPosition = TextWrapper.getPosition();
                        currentPosition = saveCharPosition;
                        // simulate normal width overflow
                        remainingWidth = -1;
                        type = TextWrapper.eCharType.CHARACTER;
                    }

                    if(breakLoop)
                        break;
                }

                previousType = type;
                prevCharCode = charCode;
            }


            // lines / pages
            remainingHeight -= lineHeight;
            // set new page if not enough remaining height
            if(remainingHeight < 0)
                mPageStart[pageCounter++] = mMaxLine;

            if(remainingWidth < 0 && type === TextWrapper.eCharType.CHARACTER) {
                if(saveSpaceCharCount != 0)
                    mLineChars[mMaxLine] = saveSpaceCharCount;
                else // for too long words that do not fit into one line (and Chinese texts)
                    mLineChars[mMaxLine] = charCount;

                // does new line still fits into current page?
                firstLineOnPage = false;

                // set new page
                if(remainingHeight < 0) {
                    firstLineOnPage = true;
                    remainingHeight = aHeight - lineHeight;
                }

                if(saveSpaceCharCount != 0) {
                    mLineStart[++mMaxLine] = saveCharPosition;
                    TextWrapper.setPosition(saveCharPosition);
                } else {
                    mLineStart[++mMaxLine] = currentPosition;
                    TextWrapper.setPosition(currentPosition);
                }
            } else if(!TextWrapper.hasNext()) {
                if(type === TextWrapper.eCharType.CHARACTER) {
                    mLineChars[mMaxLine] = charCount;
                } else if(type === TextWrapper.eCharType.SPACE) {
                    mLineChars[mMaxLine] = saveSpaceCharCount;
                }
            }
        }

        mPageStart[pageCounter] = mMaxLine + 1;


        // lines into string[]
        var result = [];

        for(var i = 1; i <= pageCounter; i++) {
            var firstLine = mPageStart[i - 1];
            var lastLine = mPageStart[i];

            var pageText = [];
            for(var l = firstLine; l < lastLine; l++) {
                pageText.push(TextWrapper.mText.substr(mLineStart[l], mLineChars[l]));
            }

            result.push(pageText.join("\n"));
        }

        return result;
    }
};
