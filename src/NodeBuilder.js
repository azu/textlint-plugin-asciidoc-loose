// LICENSE : MIT
"use strict";
/**
 * create paragraph node from TxtNodes.
 * @param {TxtNode[]} nodes - Child nodes
 * @return {TxtNode} Paragraph node
 */
function createParagraphNode(nodes) {
    return {
        type: "Paragraph",
        children: nodes || []
    };
}
function createBlockNode(token) {
    return {
        type: token.type,
        children: []
    };
}
/**
 * fill properties of paragraph node.
 * @param {TxtNode} node - Paragraph node to modify
 * @param {string} fullText - Full text of the document
 */
function fixParagraphNode(node, fullText) {
    const firstNode = node.children[0];
    const lastNode = node.children[node.children.length - 1];
    node.range = [firstNode.range[0], lastNode.range[1]];
    node.raw = fullText.slice(node.range[0], node.range[1]);
    node.loc = {
        start: {
            line: firstNode.loc.start.line,
            column: firstNode.loc.start.column
        },
        end: {
            line: lastNode.loc.end.line,
            column: lastNode.loc.end.column
        }
    };
}
export default class NodeBuilder {
    constructor({source, text}) {
        const range = [0, text.length];
        this.AST = {
            type: "Document",
            raw: text,
            range: range,
            loc: source.rangeToLocation(range),
            children: []
        };
        this.text = text;
        this.source = source;
        this.currentParentNode = this.AST;
        this.currentStrStack = [];
    }

    builtAST() {
        this.AST.children.forEach((node) => {
            if (node.type == "Paragraph") {
                fixParagraphNode(node, this.text);
            }
        });
        return this.AST;
    }

    addNodeToRoot(node) {
        this.AST.children.push(node);
    }

    backParentToRoot() {
        this.currentParentNode = this.AST;
    }

    setCurrentParentNode(token) {
        this.currentParentNode = createBlockNode(token);
        this.addNodeToRoot(this.currentParentNode);
    }

    isInBlock() {
        return this.currentParentNode !== null
    }

    pushStrToCurrentStack(token) {
        // create range and raw
        token.raw = this.text.slice(token.startIndex, token.endIndex);
        token.value = token.raw;
        token.range = [token.startIndex, token.endIndex];
        delete token.startIndex;
        delete token.endIndex;
        this.currentStrStack.push(token);
    }

    wrapStrWithParagraph() {
        if (this.currentStrStack.length === 0) {
            return;
        }
        const paragraph = createParagraphNode(this.currentStrStack);
        this.currentParentNode.children.push(paragraph);
        this.currentStrStack = [];
    }

    enterToken(token) {
        switch (token.type) {
            case "Str":
                return this.pushStrToCurrentStack(token);
            // case "Paragraph":
            // case "Header":
            // case "List":
            //     return this.setCurrentParentNode(token);
            default:
                this.wrapStrWithParagraph();
        }
    }

    exitToken(token) {
        // switch (token.type) {
        //     case "Paragraph":
        //     case "Header":
        //     case "List":
        //         this.wrapStrWithParagraph();
        //         return this.backParentToRoot();
        // }
    }
}