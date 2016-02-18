// LICENSE : MIT
"use strict";
import {createTokenStream} from "./token-stream";
import {Registry} from 'vscode-textmate';
const registry = new Registry();
const grammar = registry.loadGrammarFromPathSync(__dirname + '/syntax/Asciidoctor.tmLanguage');
const identity = (arg) => {
    return arg;
};
class Traverser {
    constructor(text) {
        this.text = text;
        this.tokens = createTokenStream(text);
    }

    traverse({enter = identity, visit = identity, leave = identity}) {
        var ruleStack = null;
        let lineStartIndex = 0;
        const workList = [];
        const leaveList = [];
        let lastToken = null;
        this.lines.forEach(line => {
            // prev rule stack
            const parsed = grammar.tokenizeLine(line, ruleStack);
            for (let i = 0; i < parsed.tokens.length; i++) {
                const token = parsed.tokens[i];
                token.startIndex += lineStartIndex;
                token.endIndex += lineStartIndex;
                if (!lastToken) {
                    enter(token);
                    lastToken = token;
                    continue;
                }
                // scopesが減ったらenter/増えたらleave
                if (token.scopes.length < lastToken.scopes.length) {
                    const parentToken = leaveList[leaveList.length - 1];
                    leaveList.push(token);
                    enter(token, parentToken);
                }
                if (token.scopes.length > lastToken.scopes.length) {
                    leaveList.pop();
                    const parentToken = leaveList[leaveList.length - 1];
                    leave(token, parentToken);
                }
                if (token.scopes.length === lastToken.scopes.length) {
                    const parentToken = leaveList[leaveList.length - 1];
                    enter(token, parentToken);
                }
                lastToken = token;
            }
            ruleStack = parsed.ruleStack;
            lineStartIndex += (line.length + 1);
        });

        if (leaveList.length > 0) {
            leave(lastToken);
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
    let stack = [];
    let rootNode = {children: []};
    let parentNode = null;
    let currentNode = null;
    let currentNodeChildren = [];
    traverser.traverse({
        enter(node, parent){
            if (parent) {
                console.log(parent);
            }
            if (parentNode === parent) {
                currentNodeChildren.push(node)
            } else {
                parentNode = parent || rootNode;
                currentNode = node;
                currentNodeChildren = [];
            }
        },
        visit(node){
            currentNodeChildren.push(node);
        },
        leave(node){
            if (!parentNode.children) {
                parentNode.children = [];
            }
            if (currentNodeChildren.length) {
                currentNode.children = currentNodeChildren.slice();
            }
            parentNode.children.push(currentNode);
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
    console.log("");
}