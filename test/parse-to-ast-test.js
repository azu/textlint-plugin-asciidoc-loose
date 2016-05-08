// LICENSE : MIT
"use strict";
const assert = require("power-assert");
const fs = require("fs");
const test = require("textlint-ast-test").test;
import {parse} from "../src/parse-to-ast";
describe("parse-to-ast", function () {
    it("should return AST", function () {
        const exampleText = fs.readFileSync(__dirname + "/fixtures/example.adoc", "utf-8");
        const AST = parse(exampleText);
        try {
            test(AST);
            throw new Error("ERROR")
        } catch (error) {
            console.log(error.stack);
            assert(error.message === "ERROR");
        }
    });
});