import assert from "power-assert";
import {parse, createTokenStream} from "../src/textlint-plugin-asciidoc";
import {createTokenStream} from "../src/token-stream";
import * as fs from "fs";
describe("textlint-plugin-asciidoc", function () {
    describe("createTokenStream", function () {
        it("should return token stream", function () {
            const text = `= Hello, AsciiDoc!
Text.`;
            const tokens = createTokenStream(text);
            assert.deepEqual(tokens, [
                // = Hello, AsciiDoc!
                {
                    startIndex: 0,
                    endIndex: 1,
                    scopes: [
                        'text.asciidoc',
                        'markup.heading.level.0.asciidoc',
                        'punctuation.definition.heading.asciidoc'
                    ]
                },
                {
                    startIndex: 1,
                    endIndex: 2,
                    scopes: [
                        'text.asciidoc',
                        'markup.heading.level.0.asciidoc'
                    ]
                },
                {
                    startIndex: 2,
                    endIndex: 18,
                    scopes: [
                        'text.asciidoc',
                        'markup.heading.level.0.asciidoc',
                        'entity.name.section.asciidoc'
                    ]
                },
                // text
                {
                    startIndex: 19, endIndex: 25, scopes: ['text.asciidoc']
                }
            ])
        });
        it("should return list token stream", function () {
            const text = `- list

text`;
            const tokens = createTokenStream(text);
            assert.deepEqual(tokens, [
                {
                    "startIndex": 0,
                    "endIndex": 1,
                    "scopes": [
                        "text.asciidoc",
                        "markup.list.bulleted.asciidoc",
                        "string.unquoted.list.bullet.asciidoc",
                        "constant.numeric.list.bullet.asciidoc"
                    ]
                },
                {
                    "startIndex": 1,
                    "endIndex": 2,
                    "scopes": [
                        "text.asciidoc",
                        "markup.list.bulleted.asciidoc"
                    ]
                },
                {"startIndex": 2, "endIndex": 7, "scopes": ["text.asciidoc"]},
                {"startIndex": 7, "endIndex": 8, "scopes": ["text.asciidoc"]},
                {"startIndex": 8, "endIndex": 13, "scopes": ["text.asciidoc"]}
            ])
        })
    });
    it("should parser text", function () {
        const exampleText = fs.readFileSync(__dirname + "/fixtures/example.adoc", "utf-8");
        parse(exampleText);
    });
});