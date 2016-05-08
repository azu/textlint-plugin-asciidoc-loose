// LICENSE : MIT
"use strict";
import assert from "power-assert";
import * as fs from "fs";
import {parse} from "../src/textlint-plugin-asciidoc-loose";
const util = require("util");
describe("textlint-plugin-asciidoc", function () {
    it("should ", function () {
        const exampleText = fs.readFileSync(__dirname + "/fixtures/example.adoc", "utf-8");
        const ast = parse(exampleText);
        console.log(util.inspect(ast, { depth: null }));
    })
});