// LICENSE : MIT
"use strict";
import NodeBuilder from "../src/NodeBuilder";
import TokenSeeker from "../src/TokenSeeker";
import assert from "power-assert";
describe("NodeBuilder-test", function () {
    it("should convert link", function () {
        var tokenSeeker = new TokenSeeker([
                {
                    "startIndex": 0,
                    "endIndex": 22,
                    "scopes": [
                        "text.asciidoc",
                        "meta.macro.asciidoc",
                        "markup.underline.link.macro.asciidoc"
                    ],
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 0
                        },
                        "end": {
                            "line": 1,
                            "column": 22
                        }
                    }
                },
                {
                    "startIndex": 22,
                    "endIndex": 23,
                    "scopes": [
                        "text.asciidoc",
                        "meta.macro.asciidoc",
                        "constant.character.attributes.macro.begin.asciidoc"
                    ],
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 22
                        },
                        "end": {
                            "line": 1,
                            "column": 23
                        }
                    }
                },
                {
                    "startIndex": 23,
                    "endIndex": 34,
                    "scopes": [
                        "text.asciidoc",
                        "meta.macro.asciidoc",
                        "variable.parameter.attributes.macro.asciidoc"
                    ],
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 23
                        },
                        "end": {
                            "line": 1,
                            "column": 34
                        }
                    }
                },
                {
                    "startIndex": 34,
                    "endIndex": 35,
                    "scopes": [
                        "text.asciidoc",
                        "meta.macro.asciidoc",
                        "constant.character.attributes.macro.end.asciidoc"
                    ],
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 34
                        },
                        "end": {
                            "line": 1,
                            "column": 35
                        }
                    }
                }
            ]
        );
        var builder = new NodeBuilder(tokenSeeker);
        var node = builder.nextNode();
        assert.deepEqual(node, {
                "startIndex": 0,
                "endIndex": 35,
                "type": "Link",
                "raw": "http://asciidoctor.org[Asciidoctor]",
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 35
                    }
                }
            }
        )
    });


});