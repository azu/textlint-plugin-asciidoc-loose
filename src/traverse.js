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
const blocker = {
    isBegin(node){
        return blockNodeNameList.some(({begin}) => {
            const scopes = node.scopes;
            return scopes.indexOf(begin) !== -1;
        });
    },
    isEnd(node){
        return blockNodeNameList.some(({end}) => {
            const scopes = node.scopes;
            return scopes.indexOf(end) !== -1;
        });
    }

};
const blockNodeNameList = [
    {
        "name": "List",
        "begin": "punctuation.definition.attributelistline.begin.asciidoc",
        "end": "punctuation.definition.attributelistline.end.asciidoc"
    },
    {
        "begin": "constant.delimiter.block.literal.begin.asciidoc",
        "end": "constant.delimiter.block.literal.end.asciidoc"
    },
    {
        "begin": "punctuation.definition.comment.begin.asciidoc",
        "end": "punctuation.definition.comment.end.asciidoc"
    },
    {
        "begin": "constant.delimiter.listing.begin.asciidoc",
        "end": "constant.delimiter.listing.end.asciidoc"
    },
    {
        "begin": "constant.delimiter.listing.begin.asciidoc",
        "end": "constant.delimiter.listing.end.asciidoc"
    },
    {
        "begin": "constant.delimiter.block.sidebar.begin.asciidoc",
        "end": "constant.delimiter.block.sidebar.end.asciidoc"
    },
    {
        "begin": "constant.delimiter.block.passthrough.begin.asciidoc",
        "end": "constant.delimiter.block.passthrough.end.asciidoc"
    },
    {
        "begin": "constant.delimiter.block.quote.begin.asciidoc",
        "end": "constant.delimiter.block.quote.end.asciidoc"
    },
    {
        "begin": "constant.delimiter.example.begin.asciidoc",
        "end": "constant.delimiter.example.end.asciidoc"
    },
    {
        "begin": "constant.delimiter.block.open.begin.asciidoc",
        "end": "constant.delimiter.block.open.end.asciidoc"
    }
];
const testInlineBlock = (node) => {
    return inlineBlockNodeNameList.some(({begin}) => {
        const scopes = node.scopes;
        return begin.every(scopeName => {
            return scopes.indexOf(scopeName) !== -1;
        });
    });
};
const inlineBlockNodeNameList = [
    // #section_titles
    {
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
        "begin": [
            "punctuation.definition.comment.line.asciidoc",
            "meta.line.comment.content.asciidoc"
        ]
    },
    // #block_title
    {
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
        let isInBlock = false;
        while (this.seeker.hasNextToken()) {
            const token = this.seeker.nextToken();
            // Block Element
            if (blocker.isBegin(token)) {
                isInBlock = true;
                enter(token);
                continue;
            } else if (blocker.isEnd(token)) {
                isInBlock = false;
                const parentToken = currentBlockStack[0];
                while (currentBlockStack.length) {
                    const lastToken = currentBlockStack.pop();
                    leave(lastToken, parentToken);
                }
                leave(token);
                continue;
            } else if (isInBlock) {
                const parentToken = currentBlockStack[0];
                currentBlockStack.push(token);
                enter(token, parentToken);
                continue;
            }
            // Inline Block
            if (testInlineBlock(token)) {
                currentLineStack.push(token);
                enter(token);
            } else if (currentLineStack.length > 0) {
                const firstToken = currentLineStack[0];
                if (firstToken.loc.start.line !== token.loc.start.line) {
                    while (currentLineStack.length) {
                        const lastToken = currentLineStack.pop();
                        leave(lastToken, firstToken);
                    }
                }
                const parentToken = currentLineStack[0];
                currentLineStack.push(token);
                enter(token, parentToken);
            } else {
                const parentToken = currentLineStack[0];
                enter(token, parentToken);
            }
        }
        // finish
        while (currentLineStack.length > 0) {
            const lastToken = currentLineStack.pop();
            leave(lastToken);
        }
    }
}