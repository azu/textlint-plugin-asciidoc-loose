// LICENSE : MIT
"use strict";
import {createTokenStream} from "./token-stream";
const identity = (arg) => {
    return arg;
};
class Traverser {
    constructor(text) {
        this.text = text;
        this.tokens = createTokenStream(text);
    }

    /*
        3
        |
            2
            |
        3
        |
     */
    traverse({enter = identity, leave = identity}) {
        let lastToken = null;
        const scopeStack = [];
        this.tokens.forEach(token => {
            // level, high near root
            const currentLevel = token.scopes.length;
            const prevLevel = lastToken ? lastToken.scopes.length : 0;
            const parentScope = scopeStack[scopeStack.length - 1];
            if (currentLevel < prevLevel) {
                // enter
                enter(token, parentScope);
                scopeStack.push(token);
            } else if (currentLevel > prevLevel) {
                leave(token, parentScope);
                scopeStack.pop();
            } else if (currentLevel === prevLevel) {
                enter(token, parentScope);
            }
            // preserve
            lastToken = token;
        });

        // finish
        while (scopeStack.length > 0) {
            const lowestScopeToken = scopeStack.pop();
            const parentScope = scopeStack[scopeStack.length - 1];
            leave(lowestScopeToken, parentScope);
        }
    }
}
export function parse(text) {
    /*

    Scopeのイメージ
    [
        be
         be
          be
    ]
     */
    const traverser = new Traverser(text);
    let rootNode = {children: [], scopes: []};
    let parentNode = null;
    traverser.traverse({
        enter(node, parent){
            parentNode = parent || rootNode;
            if (!parentNode.children) {
                parentNode.children = [];
            }
            parentNode.children.push(node);
            if (parentNode.endIndex < node.endIndex) {
                parentNode.endIndex = node.endIndex;
            }
        },
        leave(node, parent){
            parentNode = parent || rootNode;
            if (!parentNode.children) {
                parentNode.children = [];
            }
            parentNode.children.push(node);
            if (parentNode.endIndex < node.endIndex) {
                parentNode.endIndex = node.endIndex;
            }
        }
    });


    //console.log(JSON.stringify(rootNode.children.map(node => {
    //    delete node.scopes;
    //    node.children && node.children.forEach(n => {
    //        delete n.scopes
    //    });
    //    return node;
    //}), null, 3));
    //console.log(JSON.stringify(rootNode, null, 2));
    var traverse = require('traverse');
    rootNode.scopes = ["Root"];
    traverse(rootNode).forEach(function (x) {
        const notLeaf = this.notLeaf;
        if (notLeaf && !Array.isArray(x)) {
            //console.log(new Array(this.level).join("\t") + x.scopes[x.scopes.length - 1]);
            console.log(new Array(this.level).join("\t") + x.scopes[x.scopes.length - 1] + "\t" + text.slice(x.startIndex, x.endIndex).slice(0, 5));
        }
    });

    console.log("");
}