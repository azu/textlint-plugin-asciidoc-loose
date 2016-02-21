#!/usr/bin/env node
var createTokenStream = require("../lib/token-stream").createTokenStream;
var result = createTokenStream(String(process.argv[2]));
console.log(JSON.stringify(result, null, 4));