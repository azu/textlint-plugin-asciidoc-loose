// LICENSE : MIT
"use strict";
export default class TokenSeeker {
    constructor(tokens) {
        this.tokens = tokens;
        this._lookIndex = 0;
        this._lastIndex = this.tokens.length;
    }

    hasNextToken() {
        return this._lookIndex < this._lastIndex;
    }

    nextToken() {
        var token = this.tokens[this._lookIndex];
        this._lookIndex++;
        return token;
    }
}