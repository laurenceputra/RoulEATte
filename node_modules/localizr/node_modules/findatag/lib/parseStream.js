/***@@@ BEGIN LICENSE @@@***/
/*───────────────────────────────────────────────────────────────────────────*\
│  Copyright (C) 2013 eBay Software Foundation                                │
│                                                                             │
│hh ,'""`.                                                                    │
│  / _  _ \  Licensed under the Apache License, Version 2.0 (the "License");  │
│  |(@)(@)|  you may not use this file except in compliance with the License. │
│  )  __  (  You may obtain a copy of the License at                          │
│ /,'))((`.\                                                                  │
│(( ((  )) ))    http://www.apache.org/licenses/LICENSE-2.0                   │
│ `\ `)(' /'                                                                  │
│                                                                             │
│   Unless required by applicable law or agreed to in writing, software       │
│   distributed under the License is distributed on an "AS IS" BASIS,         │
│   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  │
│   See the License for the specific language governing permissions and       │
│   limitations under the License.                                            │
\*───────────────────────────────────────────────────────────────────────────*/
/***@@@ END LICENSE @@@***/
'use strict';

var util = require('util'),
    async = require('async'),
    stream = require('stream');

function ParseStream(options) {
    ParseStream.super_.call(this);

    options = options || {};

    var tags;
    this._state = State.BEGIN;

    tags = options.tags;
    if (Array.isArray(tags)) {
        tags = tags.join(',');
    }

    this._tags = createDict(tags, /\s*,\s*/g);
    this._textNode = '';
    this._tagName = '';
    this._attributeName = '';
    this._attributeValue = '';
    this._attributes = {};

    this._options = options;
}

util.inherits(ParseStream, stream.Transform);


ParseStream.prototype.__defineGetter__('entityHandler', function () {
    return this._options;
});


ParseStream.prototype._transform = function (chunk, encoding, cb) {
    if (Buffer.isBuffer(chunk)) {
        encoding = 'utf8';
        chunk = chunk.toString(encoding);
    }

    return this.parseChunk(chunk, 0, cb);
};


function createDict(str, del) {
    return str && Object.freeze(str.split(del || '').reduce(function (s, c) {
        s[c] = true;
        return s;
    }, {}));
}


var ORD = 0;

var State = {
    BEGIN:        ORD++,
    TEXT:         ORD++,
    OPEN_CHAR:    ORD++,
    OPEN_TAG:     ORD++,
    ATTRIB:       ORD++,
    ATTRIB_NAME:  ORD++,
    ATTRIB_VALUE: ORD++,
    QUOTED_ATTRIB_VALUE: ORD++,
    QUOTED_ATTRIB_VALUE_ESCAPE: ORD++,
    CLOSE_TAG:    ORD++
};


var CharSet = {
    WHITESPACE: createDict('\n\r\t '),
    ESCAPEABLE_CONTROL_CHARS: createDict('bfnrtv'), 
    ALPHANUM:   createDict('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890._')
};


ParseStream.prototype._is = function (charSet, character) {
    return charSet[character];
};


ParseStream.prototype._closeText = function (cb) {
    var that = this;
    if (this._textNode && this._options.onText) {
        this._options.onText(this._textNode, function (err, result) {
            if (err) {
                return cb(err);
            } else {
                that.push(result);
                return cb();
            }
        });
        this._textNode = '';
    } else {
        if (this._textNode) {
            this.push(this._textNode);
            this._textNode = '';
        }
        return cb();
    }
};


ParseStream.prototype._closeTag = function (cb) {
    var that = this;
    if (this._tagName && this._options.onTag) {
        this._options.onTag({
            name: this._tagName,
            attributes: this._attributes
        }, function (err, result) {
            if (err) {
                return cb(err);
            } else {
                that.push(result);
                return cb();
            }
        });
    } else {
        return cb();
    }
};


ParseStream.prototype.parseChunk = function (chunk, pos, callback) {
    var c;
    var escCharMap = {"b":"\x08", "f":"\x0C", "n":"\x0A", "r":"\x0D", "t":"\x09", "v":"\x0B"};

    var that = this;

    while (c = chunk.charAt(pos++)) {

        switch (this._state) {
        case State.BEGIN:
            this._textNode = '';
            this._state = State.TEXT;
            // XXX: Intentionally fall through

            /* falls through */
        case State.TEXT:
            this._tagName = '';
            this._attributeName = '';
            this._attributeValue = '';
            this._attributes = {};

            if (c === '{') {
                this._state = State.OPEN_CHAR;
            } else {
                this._textNode += c;
            }
            break;

        case State.OPEN_CHAR:
            if (c === '@') {
                this._state = State.OPEN_TAG;
            } else {
                // Revert back to text state, including the previously skipped '{'
                this._state = State.TEXT;
                this._textNode += '{' + c;
            }
            break;

        case State.OPEN_TAG:
            if (this._is(CharSet.ALPHANUM, c)) {
                this._tagName += c;

            } else if (this._is(CharSet.WHITESPACE, c)) {
                if (this._tagName && (!this._tags || this._tags[this._tagName])) {
                    // Officially a tag so notify end of text node.
                    this._state = State.ATTRIB;
                } else {
                    // Revert back to text state, including the character and continuing as text node.
                    this._textNode += '{@' + this._tagName + c;
                    this._state = State.TEXT;
                }

            } else if (c === '/') {
                if (this._tagName && (!this._tags || this._tags[this._tagName])) {
                    // It's a tag w/ no attrs so close the prev textNode and initiate close
                    this._state = State.CLOSE_TAG;
                    return this._closeText(cont());
                } else {
                    // Not a tag, but we got here somehow, so just add tag-like chars
                    this._textNode += '{@' + this._tagName + c;
                    this._state = State.TEXT;
                }

            } else if (c === '}') {
                // Symmetrical tag, so ignore
                this._textNode += '{@' + this._tagName + c;
                this._state = State.TEXT;

            } else {
                if (this._tagName) {
                    return callback(new Error('Malformed tag. Tag not closed correctly.'));
                } else {
                    // Hit a character that's not valid in a tag, so put together what we've found so far and
                    // continue as text node.
                    this._textNode += '{@' + this._tagName + c;
                    this._state = State.TEXT;
                }
            }
            break;

        case State.ATTRIB:
            if (this._is(CharSet.ALPHANUM, c)) {
                this._attributeName = c;
                this._attributeValue = '';
                this._state = State.ATTRIB_NAME;

            } else if (this._is(CharSet.WHITESPACE, c)) {
                // noop

            } else if (c === '/') {
                this._state = State.CLOSE_TAG;
                return this._closeText(cont());
            } else {
                return callback(new Error('Malformed tag. Tag not closed correctly.'));
            }
            break;

        case State.ATTRIB_NAME:
            if (this._is(CharSet.ALPHANUM, c)) {
                this._attributeName += c;

            } else if (this._is(CharSet.WHITESPACE, c)) {
                if (this._attributeName) {
                    this._attributes[this._attributeName] = this._attributeName;
                }
                this._state = State.ATTRIB;

            } else if (c === '=') {
                this._state = State.ATTRIB_VALUE;

            } else if (c === '/') {
                if (this._attributeName) {
                    this._attributes[this._attributeName] = this._attributeName;
                }
                this._state = State.CLOSE_TAG;

            } else {
                this._textNode += c;
                this._state = State.TEXT;
            }
            break;

        case State.QUOTED_ATTRIB_VALUE:
            if (c === '"') {
                this._attributes[this._attributeName] = this._attributeValue;
                this._state = State.ATTRIB;
            } else if (c === '\\') {
                this._state = State.QUOTED_ATTRIB_VALUE_ESCAPE;
            } else {
                this._attributeValue += c;
            }
            break;

        case State.QUOTED_ATTRIB_VALUE_ESCAPE:
            // Only control chars must be mapped to different codes.
            if (this._is(CharSet.ESCAPEABLE_CONTROL_CHARS, c)) {
                this._attributeValue += escCharMap[c];
            } else {
                this._attributeValue += c;
            }
            this._state = State.QUOTED_ATTRIB_VALUE;
            break;

        case State.ATTRIB_VALUE:
            if (c === '/') {
                this._attributes[this._attributeName] = this._attributeValue;
                this._state = State.CLOSE_TAG;

            } else if (c === '"') {
                if (!this._attributeValue) {
                    this._state = State.QUOTED_ATTRIB_VALUE;
                } else {
                    return callback(new Error('Malformed tag. Invalid quote.'));
                }
            } else if (c === "'") {
                return callback(new Error('Malformed tag. Attribute values must use double quotes.'));

            } else if (this._is(CharSet.WHITESPACE, c)) {
                if (this._attributeValue) {
                    this._attributes[this._attributeName] = this._attributeValue;
                    this._state = State.ATTRIB;
                }

            } else {
                this._attributeValue += c;
            }
            break;

        case State.CLOSE_TAG:
            if (c === '}') {
                this._state = State.TEXT;
                return this._closeTag(cont());
            }
            break;
        }
    }

    if (this._state === State.TEXT) {
        return this._closeText(cont());
    } else {
        return cont()();
    }

    function cont() {
        if (pos >= chunk.length) {
            return callback;
        } else {
            return function maybeContinueParsing(err, data) {
                if (err || pos >= chunk.length) {
                    return callback(err);
                } else {
                    setImmediate(function() {
                        return that.parseChunk(chunk, pos, callback);
                    });
                }
            };
        }
    }
};

module.exports = ParseStream;
