// LICENSE : MIT
"use strict";
import assert from "power-assert";
import AsciidocProcessor from "../src/AsciidocProcessor"
import {TextLintCore} from "textlint";
import path from "path";
describe("AsciidocProcessor", function () {
    let textlint;
    beforeEach(function () {
        textlint = new TextLintCore();
        textlint.setupProcessors({
            "asciidoc-loose": AsciidocProcessor
        });
        textlint.setupRules({
            "no-todo": require("textlint-rule-no-todo")
        });
    });
    context("when target file is a Text", function () {
        it("should report error", function () {
            var fixturePath = path.join(__dirname, "fixtures/todo.adoc");
            return textlint.lintFile(fixturePath).then(results => {
                assert(results.messages.length > 0);
                assert(results.filePath === fixturePath);
            });
        });
    });
    context("when target is text", function () {
        it("should report error", function () {
            return textlint.lintText("TODO: this is todo", ".adoc").then(results => {
                assert(results.messages.length === 1);
                assert(results.filePath === "<asciidoc>");
            });
        });
    });
});