import assert from "power-assert";
import {createTokenStream} from "../src/token-stream";
import * as fs from "fs";
import Dumper from "./helper/Duper";
function checkDump(dump, expected) {
    assert.equal(normalize(dump), normalize(expected));
}

function normalize(dump) {
    return dump
        .trim()
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
}
describe("Traverse", function () {
    it("should correct dump block", function () {
        /*
        = test
        text

         */
        var tokens = [
            {
                "startIndex": 0,
                "endIndex": 1,
                "scopes": [
                    "text.asciidoc", "support.variable.attributelist.asciidoc",
                    "punctuation.definition.attributelistline.begin.asciidoc"
                ],
                "loc": {"start": {"line": 1, "column": 0}, "end": {"line": 1, "column": 1}}
            }, {
                "startIndex": 1,
                "endIndex": 18,
                "scopes": ["text.asciidoc", "support.variable.attributelist.asciidoc"],
                "loc": {"start": {"line": 1, "column": 1}, "end": {"line": 1, "column": 18}}
            }, {
                "startIndex": 18,
                "endIndex": 19,
                "scopes": [
                    "text.asciidoc", "support.variable.attributelist.asciidoc",
                    "punctuation.definition.attributelistline.end.asciidoc"
                ],
                "loc": {"start": {"line": 1, "column": 18}, "end": {"line": 1, "column": 19}}
            }, {
                "startIndex": 20,
                "endIndex": 25,
                "scopes": [
                    "text.asciidoc", "meta.embedded.block.listing.asciidoc", "constant.delimiter.listing.begin.asciidoc"
                ],
                "loc": {"start": {"line": 2, "column": 0}, "end": {"line": 3, "column": 0}}
            }, {
                "startIndex": 25,
                "endIndex": 38,
                "scopes": [
                    "text.asciidoc", "meta.embedded.block.listing.asciidoc", "source.block.listing.content.asciidoc"
                ],
                "loc": {"start": {"line": 3, "column": 0}, "end": {"line": 4, "column": 0}}
            }, {
                "startIndex": 38,
                "endIndex": 43,
                "scopes": [
                    "text.asciidoc", "meta.embedded.block.listing.asciidoc", "constant.delimiter.listing.end.asciidoc"
                ],
                "loc": {"start": {"line": 4, "column": 0}, "end": {"line": 4, "column": 5}}
            }
        ];
        var dump = Dumper.dump(tokens);
        checkDump(dump, `
enter - [0, 1] - "text.asciidoc", "support.variable.attributelist.asciidoc", "punctuation.definition.attributelistline.begin.asciidoc"
enter - [1, 18] - "text.asciidoc", "support.variable.attributelist.asciidoc"
leave - [1, 18] - "text.asciidoc", "support.variable.attributelist.asciidoc"
leave - [18, 19] - "text.asciidoc", "support.variable.attributelist.asciidoc", "punctuation.definition.attributelistline.end.asciidoc"

enter - [20, 25] - "text.asciidoc", "meta.embedded.block.listing.asciidoc", "constant.delimiter.listing.begin.asciidoc"
enter - [25, 38] - "text.asciidoc", "meta.embedded.block.listing.asciidoc", "source.block.listing.content.asciidoc"
leave - [25, 38] - "text.asciidoc", "meta.embedded.block.listing.asciidoc", "source.block.listing.content.asciidoc"
leave - [38, 43] - "text.asciidoc", "meta.embedded.block.listing.asciidoc", "constant.delimiter.listing.end.asciidoc"
        `);

    });

    it("should correct dump header block", function () {
        /*

        = test

        test

         */
        var tokens = [
            {
                "startIndex": 0,
                "endIndex": 1,
                "scopes": [
                    "text.asciidoc", "markup.heading.level.0.asciidoc", "punctuation.definition.heading.asciidoc"
                ],
                "loc": {"start": {"line": 1, "column": 0}, "end": {"line": 1, "column": 1}}
            }, {
                "startIndex": 1,
                "endIndex": 2,
                "scopes": ["text.asciidoc", "markup.heading.level.0.asciidoc"],
                "loc": {"start": {"line": 1, "column": 1}, "end": {"line": 1, "column": 2}}
            }, {
                "startIndex": 2,
                "endIndex": 18,
                "scopes": ["text.asciidoc", "markup.heading.level.0.asciidoc", "entity.name.section.asciidoc"],
                "loc": {"start": {"line": 1, "column": 2}, "end": {"line": 1, "column": 18}}
            }, {
                "startIndex": 19,
                "endIndex": 25,
                "scopes": ["text.asciidoc"],
                "loc": {"start": {"line": 2, "column": 0}, "end": {"line": 3, "column": 0}}
            }, {
                "startIndex": 25,
                "endIndex": 31,
                "scopes": ["text.asciidoc"],
                "loc": {"start": {"line": 3, "column": 0}, "end": {"line": 3, "column": 6}}
            }
        ];
        var dump = Dumper.dump(tokens);
        checkDump(dump, `
enter - [0, 1] - "text.asciidoc", "markup.heading.level.0.asciidoc", "punctuation.definition.heading.asciidoc"
enter - [1, 2] - "text.asciidoc", "markup.heading.level.0.asciidoc"
enter - [2, 18] - "text.asciidoc", "markup.heading.level.0.asciidoc", "entity.name.section.asciidoc"

leave - [2, 18] - "text.asciidoc", "markup.heading.level.0.asciidoc", "entity.name.section.asciidoc"
leave - [1, 2] - "text.asciidoc", "markup.heading.level.0.asciidoc"
leave - [0, 1] - "text.asciidoc", "markup.heading.level.0.asciidoc", "punctuation.definition.heading.asciidoc"

enter - [19, 25] - "text.asciidoc"
leave - [19, 25] - "text.asciidoc"
enter - [25, 31] - "text.asciidoc"
leave - [25, 31] - "text.asciidoc"
        `);

    });
});