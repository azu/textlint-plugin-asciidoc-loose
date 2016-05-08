// LICENSE : MIT
"use strict";
import TokenSeeker from "./TokenSeeker";
const identity = (arg) => {
    return arg;
};

/*
 - Inline Block
 - Header, List ...
 - reset each line
 - Block
 - Source Code Block...
 - reset each end block
 */
class Blocker {
    constructor({blockNodeNameList}) {
        this.blockNodeNameList = blockNodeNameList;
    }

    beginNode(token) {
        const blockNodeNameList = this.blockNodeNameList;
        for (let i = 0; i < blockNodeNameList.length; i++) {
            const blockNode = blockNodeNameList[i];
            const begin = blockNode.begin;
            const targetScopes = token.scopes;
            if (targetScopes.indexOf(begin) !== -1) {
                return blockNode;
            }
        }
    }

    getBeginType(token) {
        const beginNode = this.beginNode(token);
        return beginNode ? beginNode.type : null;
    }

    getEndType(token) {
        const endNode = this.endNode(token);
        return endNode ? endNode.type : null;
    }

    endNode(token) {
        const blockNodeNameList = this.blockNodeNameList;
        for (let i = 0; i < blockNodeNameList.length; i++) {
            const blockNode = blockNodeNameList[i];
            const end = blockNode.end;
            const targetScopes = token.scopes;
            if (targetScopes.indexOf(end) !== -1) {
                return blockNode;
            }
        }
    }

    isBegin(token) {
        const beginNode = this.beginNode(token);
        return beginNode !== undefined;
    }

    isEnd(token) {
        const endNode = this.endNode(token);
        return endNode !== undefined;
    }
}
class InlineBlocker {
    constructor({inlineBlockNodeNameList}) {
        this.inlineBlockNodeNameList = inlineBlockNodeNameList;
    }

    inlineNode(node) {
        const matchNode = this.inlineBlockNodeNameList.filter(({begin}) => {
            const scopes = node.scopes;
            return begin.every(scopeName => {
                return scopes.indexOf(scopeName) !== -1;
            });
        });
        return matchNode.length !== 0 ? matchNode[0] : null;
    }

    getNodeType(node) {
        const inlineNode = this.inlineNode(node);
        return inlineNode !== null ? inlineNode.type : null;
    }

    testInlineBlock(node) {
        const inlineNode = this.inlineNode(node);
        return inlineNode !== null;
    };
}
const blockNodeNameList = [
    {
        "type": "Header",
        "begin": "punctuation.definition.attributelistline.begin.asciidoc",
        "end": "punctuation.definition.attributelistline.end.asciidoc"
    },
    {
        /*
         ....
         Lorem ipsum.
         ....

         pre
         */
        "type": "CodeBlock",
        "begin": "constant.delimiter.block.literal.begin.asciidoc",
        "end": "constant.delimiter.block.literal.end.asciidoc"
    },
    {
        "type": "Comment",
        "begin": "punctuation.definition.comment.begin.asciidoc",
        "end": "punctuation.definition.comment.end.asciidoc"
    },
    {
        "type": "List",
        "begin": "constant.delimiter.listing.begin.asciidoc",
        "end": "constant.delimiter.listing.end.asciidoc"
    },
    {
        /*
         ****
         Lorem ipsum
         ****
         */
        "type": "Paragraph",
        "begin": "constant.delimiter.block.sidebar.begin.asciidoc",
        "end": "constant.delimiter.block.sidebar.end.asciidoc"
    },
    {
        "begin": "constant.delimiter.block.passthrough.begin.asciidoc",
        "end": "constant.delimiter.block.passthrough.end.asciidoc"
    },
    {
        "type": "BlockQuote",
        "begin": "constant.delimiter.block.quote.begin.asciidoc",
        "end": "constant.delimiter.block.quote.end.asciidoc"
    },
    {
        /*
         ====
         Lorem ipsum.
         ====
         */
        "type": "Paragraph",
        "begin": "constant.delimiter.example.begin.asciidoc",
        "end": "constant.delimiter.example.end.asciidoc"
    },
    {
        /*
         --
         Lorem ipsum
         --
         */
        "type": "CodeBlock",
        "begin": "constant.delimiter.block.open.begin.asciidoc",
        "end": "constant.delimiter.block.open.end.asciidoc"
    }
];
const getStrType = (node) => {
    return node.scopes.join(",") === ['text.asciidoc'].join(",") ? "Str" : null;
};
const inlineBlockNodeNameList = [
    // #section_titles
    {
        "type": "Header",
        "begin": [
            "punctuation.definition.heading.asciidoc"
        ]
    },
    // #ulist_item_marker
    {
        "begin": [
            "string.unquoted.list.bullet.asciidoc",
            "constant.numeric.list.bullet.asciidoc"
        ]
    },
    // #comment
    {
        "type": "Comment",
        "begin": [
            "punctuation.definition.comment.line.asciidoc",
            "meta.line.comment.content.asciidoc"
        ]
    },
    // #block_title
    {
        "type": "Paragraph",
        "begin": [
            "punctuation.definition.blockheading.asciidoc"
        ]
    }

];

export class Traverser {
    constructor(tokens) {
        this.seeker = Array.isArray(tokens) ? new TokenSeeker(tokens) : tokens;
    }

    traverse({enter = identity, leave = identity}) {
        const currentLineStack = [];
        const currentBlockStack = [];
        const blocker = new Blocker({blockNodeNameList});
        const inlineBlocker = new InlineBlocker({inlineBlockNodeNameList})
        let isInBlock = false;
        while (this.seeker.hasNextToken()) {
            const token = this.seeker.nextToken();
            token.type = blocker.getBeginType(token) || blocker.getEndType(token) || inlineBlocker.getNodeType(token) || getStrType(token);
            // Block Element
            if (blocker.isBegin(token)) {
                isInBlock = true;
                enter({
                    current: token,
                    type: blocker.getBeginType(token)
                });
                continue;
            } else if (blocker.isEnd(token)) {
                isInBlock = false;
                const parentToken = currentBlockStack[0];
                while (currentBlockStack.length) {
                    const lastToken = currentBlockStack.pop();
                    leave({
                        current: lastToken,
                        parent: parentToken,
                        type: blocker.getEndType(token)
                    });
                }
                leave({
                    current: token,
                    type: blocker.getEndType(token)
                });
                continue;
            } else if (isInBlock) {
                const parentToken = currentBlockStack[0];
                currentBlockStack.push(token);
                enter({
                    current: token,
                    parent: parentToken,
                    type: blocker.getBeginType(token)
                });
                continue;
            }
            // Inline Block
            if (inlineBlocker.testInlineBlock(token)) {
                currentLineStack.push(token);
                enter({
                    current: token,
                    type: blocker.getBeginType(token)
                });
                continue;
            } else if (currentLineStack.length > 0) {
                const firstToken = currentLineStack[0];
                if (firstToken.loc.start.line !== token.loc.start.line) {
                    while (currentLineStack.length) {
                        const lastToken = currentLineStack.pop();
                        leave({
                            current: lastToken,
                            parent: firstToken,
                            type: blocker.getEndType(lastToken)
                        });
                    }
                }
                const parentToken = currentLineStack[0];
                currentLineStack.push(token);
                enter({
                    current: token,
                    parent: parentToken
                });

                continue;

            } else {
                const parentToken = currentLineStack[0];
                enter({
                    current: token,
                    parent: parentToken,
                    type: blocker.getBeginType(token)
                });
                continue;
            }
        }
        // finish
        while (currentLineStack.length > 0) {
            const lastToken = currentLineStack.pop();
            leave({
                current: lastToken,
                type: blocker.getEndType(lastToken)
            });
        }
    }
}