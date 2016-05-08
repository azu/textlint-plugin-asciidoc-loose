// LICENSE : MIT
"use strict";
import assert from "power-assert";
import * as fs from "fs";
import {createTokenStream} from "../src/token-stream";
describe("token-stream", function () {
    describe("createTokenStream", function () {
        it("should return token stream", function () {
            const text = `= Hello, AsciiDoc!
Text.
Text.`;
            const tokens = createTokenStream(text);
            assert.deepEqual(tokens, [
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
            ]);
        });
        it("should return list token stream", function () {
            const text = `
* list
* item

text`;
            const tokens = createTokenStream(text);
            assert.deepEqual(tokens, [
                {
                    "startIndex": 0,
                    "endIndex": 1,
                    "scopes": ["text.asciidoc"],
                    "loc": {"start": {"line": 1, "column": 0}, "end": {"line": 2, "column": 0}}
                }, {
                    "startIndex": 1,
                    "endIndex": 2,
                    "scopes": [
                        "text.asciidoc", "markup.list.bulleted.asciidoc", "string.unquoted.list.bullet.asciidoc",
                        "constant.numeric.list.bullet.asciidoc"
                    ],
                    "loc": {"start": {"line": 2, "column": 0}, "end": {"line": 2, "column": 1}}
                }, {
                    "startIndex": 2,
                    "endIndex": 3,
                    "scopes": ["text.asciidoc", "markup.list.bulleted.asciidoc"],
                    "loc": {"start": {"line": 2, "column": 1}, "end": {"line": 2, "column": 2}}
                }, {
                    "startIndex": 3,
                    "endIndex": 8,
                    "scopes": ["text.asciidoc"],
                    "loc": {"start": {"line": 2, "column": 2}, "end": {"line": 3, "column": 0}}
                }, {
                    "startIndex": 8,
                    "endIndex": 9,
                    "scopes": [
                        "text.asciidoc", "markup.list.bulleted.asciidoc", "string.unquoted.list.bullet.asciidoc",
                        "constant.numeric.list.bullet.asciidoc"
                    ],
                    "loc": {"start": {"line": 3, "column": 0}, "end": {"line": 3, "column": 1}}
                }, {
                    "startIndex": 9,
                    "endIndex": 10,
                    "scopes": ["text.asciidoc", "markup.list.bulleted.asciidoc"],
                    "loc": {"start": {"line": 3, "column": 1}, "end": {"line": 3, "column": 2}}
                }, {
                    "startIndex": 10,
                    "endIndex": 15,
                    "scopes": ["text.asciidoc"],
                    "loc": {"start": {"line": 3, "column": 2}, "end": {"line": 4, "column": 0}}
                }, {
                    "startIndex": 15,
                    "endIndex": 16,
                    "scopes": ["text.asciidoc"],
                    "loc": {"start": {"line": 4, "column": 0}, "end": {"line": 5, "column": 0}}
                }, {
                    "startIndex": 16,
                    "endIndex": 21,
                    "scopes": ["text.asciidoc"],
                    "loc": {"start": {"line": 5, "column": 0}, "end": {"line": 5, "column": 5}}
                }
            ])
        });
        it("should return list token stream", function () {
            const text = `- test`;
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
                    ],
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 0
                        },
                        "end": {
                            "line": 1,
                            "column": 1
                        }
                    }
                },
                {
                    "startIndex": 1,
                    "endIndex": 2,
                    "scopes": [
                        "text.asciidoc",
                        "markup.list.bulleted.asciidoc"
                    ],
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 1
                        },
                        "end": {
                            "line": 1,
                            "column": 2
                        }
                    }
                },
                {
                    "startIndex": 2,
                    "endIndex": 7,
                    "scopes": [
                        "text.asciidoc"
                    ],
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 2
                        },
                        "end": {
                            "line": 1,
                            "column": 7
                        }
                    }
                }
            ]);
        })
    });
    it("should parser text", function () {
        const exampleText = fs.readFileSync(__dirname + "/fixtures/example.adoc", "utf-8");
        const tokens = createTokenStream(exampleText);
        assert.deepEqual(tokens, [
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
                "endIndex": 48,
                "scopes": ["text.asciidoc"],
                "loc": {"start": {"line": 2, "column": 0}, "end": {"line": 3, "column": 0}}
            }, {
                "startIndex": 48,
                "endIndex": 49,
                "scopes": ["text.asciidoc"],
                "loc": {"start": {"line": 3, "column": 0}, "end": {"line": 4, "column": 0}}
            }, {
                "startIndex": 49,
                "endIndex": 68,
                "scopes": ["text.asciidoc"],
                "loc": {"start": {"line": 4, "column": 0}, "end": {"line": 4, "column": 19}}
            }, {
                "startIndex": 68,
                "endIndex": 87,
                "scopes": ["text.asciidoc", "meta.macro.asciidoc", "markup.underline.link.macro.asciidoc"],
                "loc": {"start": {"line": 4, "column": 19}, "end": {"line": 4, "column": 38}}
            }, {
                "startIndex": 87,
                "endIndex": 88,
                "scopes": [
                    "text.asciidoc", "meta.macro.asciidoc", "constant.character.attributes.macro.begin.asciidoc"
                ],
                "loc": {"start": {"line": 4, "column": 38}, "end": {"line": 4, "column": 39}}
            }, {
                "startIndex": 88,
                "endIndex": 96,
                "scopes": ["text.asciidoc", "meta.macro.asciidoc", "variable.parameter.attributes.macro.asciidoc"],
                "loc": {"start": {"line": 4, "column": 39}, "end": {"line": 4, "column": 47}}
            }, {
                "startIndex": 96,
                "endIndex": 97,
                "scopes": ["text.asciidoc", "meta.macro.asciidoc", "constant.character.attributes.macro.end.asciidoc"],
                "loc": {"start": {"line": 4, "column": 47}, "end": {"line": 4, "column": 48}}
            }, {
                "startIndex": 97,
                "endIndex": 99,
                "scopes": ["text.asciidoc"],
                "loc": {"start": {"line": 4, "column": 48}, "end": {"line": 5, "column": 0}}
            }, {
                "startIndex": 99,
                "endIndex": 100,
                "scopes": ["text.asciidoc"],
                "loc": {"start": {"line": 5, "column": 0}, "end": {"line": 6, "column": 0}}
            }, {
                "startIndex": 100,
                "endIndex": 102,
                "scopes": [
                    "text.asciidoc", "markup.heading.level.1.asciidoc", "punctuation.definition.heading.asciidoc"
                ],
                "loc": {"start": {"line": 6, "column": 0}, "end": {"line": 6, "column": 2}}
            }, {
                "startIndex": 102,
                "endIndex": 103,
                "scopes": ["text.asciidoc", "markup.heading.level.1.asciidoc"],
                "loc": {"start": {"line": 6, "column": 2}, "end": {"line": 6, "column": 3}}
            }, {
                "startIndex": 103,
                "endIndex": 116,
                "scopes": ["text.asciidoc", "markup.heading.level.1.asciidoc", "entity.name.section.asciidoc"],
                "loc": {"start": {"line": 6, "column": 3}, "end": {"line": 6, "column": 16}}
            }, {
                "startIndex": 117,
                "endIndex": 118,
                "scopes": ["text.asciidoc"],
                "loc": {"start": {"line": 7, "column": 0}, "end": {"line": 8, "column": 0}}
            }, {
                "startIndex": 118,
                "endIndex": 119,
                "scopes": [
                    "text.asciidoc", "markup.list.bulleted.asciidoc", "string.unquoted.list.bullet.asciidoc",
                    "constant.numeric.list.bullet.asciidoc"
                ],
                "loc": {"start": {"line": 8, "column": 0}, "end": {"line": 8, "column": 1}}
            }, {
                "startIndex": 119,
                "endIndex": 120,
                "scopes": ["text.asciidoc", "markup.list.bulleted.asciidoc"],
                "loc": {"start": {"line": 8, "column": 1}, "end": {"line": 8, "column": 2}}
            }, {
                "startIndex": 120,
                "endIndex": 127,
                "scopes": ["text.asciidoc"],
                "loc": {"start": {"line": 8, "column": 2}, "end": {"line": 9, "column": 0}}
            }, {
                "startIndex": 127,
                "endIndex": 128,
                "scopes": [
                    "text.asciidoc", "markup.list.bulleted.asciidoc", "string.unquoted.list.bullet.asciidoc",
                    "constant.numeric.list.bullet.asciidoc"
                ],
                "loc": {"start": {"line": 9, "column": 0}, "end": {"line": 9, "column": 1}}
            }, {
                "startIndex": 128,
                "endIndex": 129,
                "scopes": ["text.asciidoc", "markup.list.bulleted.asciidoc"],
                "loc": {"start": {"line": 9, "column": 1}, "end": {"line": 9, "column": 2}}
            }, {
                "startIndex": 129,
                "endIndex": 136,
                "scopes": ["text.asciidoc"],
                "loc": {"start": {"line": 9, "column": 2}, "end": {"line": 10, "column": 0}}
            }, {
                "startIndex": 136,
                "endIndex": 137,
                "scopes": ["text.asciidoc"],
                "loc": {"start": {"line": 10, "column": 0}, "end": {"line": 11, "column": 0}}
            }, {
                "startIndex": 137,
                "endIndex": 139,
                "scopes": [
                    "text.asciidoc", "meta.tag.blockid.asciidoc", "punctuation.definition.blockid.begin.asciidoc"
                ],
                "loc": {"start": {"line": 11, "column": 0}, "end": {"line": 11, "column": 2}}
            }, {
                "startIndex": 139,
                "endIndex": 150,
                "scopes": ["text.asciidoc", "meta.tag.blockid.asciidoc", "markup.underline.blockid.id.asciidoc"],
                "loc": {"start": {"line": 11, "column": 2}, "end": {"line": 11, "column": 13}}
            }, {
                "startIndex": 150,
                "endIndex": 152,
                "scopes": ["text.asciidoc", "meta.tag.blockid.asciidoc", "punctuation.definition.blockid.end.asciidoc"],
                "loc": {"start": {"line": 11, "column": 13}, "end": {"line": 11, "column": 15}}
            }, {
                "startIndex": 153,
                "endIndex": 154,
                "scopes": [
                    "text.asciidoc", "support.variable.attributelist.asciidoc",
                    "punctuation.definition.attributelistline.begin.asciidoc"
                ],
                "loc": {"start": {"line": 12, "column": 0}, "end": {"line": 12, "column": 1}}
            }, {
                "startIndex": 154,
                "endIndex": 165,
                "scopes": ["text.asciidoc", "support.variable.attributelist.asciidoc"],
                "loc": {"start": {"line": 12, "column": 1}, "end": {"line": 12, "column": 12}}
            }, {
                "startIndex": 165,
                "endIndex": 166,
                "scopes": [
                    "text.asciidoc", "support.variable.attributelist.asciidoc",
                    "punctuation.definition.attributelistline.end.asciidoc"
                ],
                "loc": {"start": {"line": 12, "column": 12}, "end": {"line": 12, "column": 13}}
            }, {
                "startIndex": 167,
                "endIndex": 168,
                "scopes": [
                    "text.asciidoc", "markup.heading.block.asciidoc", "punctuation.definition.blockheading.asciidoc"
                ],
                "loc": {"start": {"line": 13, "column": 0}, "end": {"line": 13, "column": 1}}
            }, {
                "startIndex": 168,
                "endIndex": 175,
                "scopes": ["text.asciidoc", "markup.heading.block.asciidoc"],
                "loc": {"start": {"line": 13, "column": 1}, "end": {"line": 14, "column": 0}}
            }, {
                "startIndex": 175,
                "endIndex": 180,
                "scopes": [
                    "text.asciidoc", "meta.embedded.block.listing.asciidoc", "constant.delimiter.listing.begin.asciidoc"
                ],
                "loc": {"start": {"line": 14, "column": 0}, "end": {"line": 15, "column": 0}}
            }, {
                "startIndex": 180,
                "endIndex": 198,
                "scopes": [
                    "text.asciidoc", "meta.embedded.block.listing.asciidoc", "source.block.listing.content.asciidoc"
                ],
                "loc": {"start": {"line": 15, "column": 0}, "end": {"line": 16, "column": 0}}
            }, {
                "startIndex": 198,
                "endIndex": 199,
                "scopes": [
                    "text.asciidoc", "meta.embedded.block.listing.asciidoc", "source.block.listing.content.asciidoc"
                ],
                "loc": {"start": {"line": 16, "column": 0}, "end": {"line": 17, "column": 0}}
            }, {
                "startIndex": 199,
                "endIndex": 212,
                "scopes": [
                    "text.asciidoc", "meta.embedded.block.listing.asciidoc", "source.block.listing.content.asciidoc"
                ],
                "loc": {"start": {"line": 17, "column": 0}, "end": {"line": 18, "column": 0}}
            }, {
                "startIndex": 212,
                "endIndex": 229,
                "scopes": [
                    "text.asciidoc", "meta.embedded.block.listing.asciidoc", "source.block.listing.content.asciidoc"
                ],
                "loc": {"start": {"line": 18, "column": 0}, "end": {"line": 19, "column": 0}}
            }, {
                "startIndex": 229,
                "endIndex": 233,
                "scopes": [
                    "text.asciidoc", "meta.embedded.block.listing.asciidoc", "source.block.listing.content.asciidoc"
                ],
                "loc": {"start": {"line": 19, "column": 0}, "end": {"line": 20, "column": 0}}
            }, {
                "startIndex": 233,
                "endIndex": 238,
                "scopes": [
                    "text.asciidoc", "meta.embedded.block.listing.asciidoc", "constant.delimiter.listing.end.asciidoc"
                ],
                "loc": {"start": {"line": 20, "column": 0}, "end": {"line": 20, "column": 5}}
            }
        ]);
    });
})