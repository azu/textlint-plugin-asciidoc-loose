// LICENSE : MIT
"use strict";
import {createTokenStream} from "./token-stream";
import {Traverser} from "./traverse"
import StructuredSource  from "structured-source";
export function parse(text) {
    const tokens = createTokenStream(text);
    const traverser = new Traverser(tokens);
    const source = new StructuredSource(text);
    let rootNode = {children: [], scopes: []};
    let parentNode = null;
    traverser.traverse({
        enter({current, parent, type}){
            parentNode = parent || rootNode;
            if (!parentNode.children) {
                parentNode.children = [];
            }
            current.type = type;
            parentNode.children.push(current);
            if (parentNode.endIndex < current.endIndex) {
                parentNode.endIndex = current.endIndex;
                parentNode.loc = {
                    start: current.loc.start,
                    end: source.indexToPosition(parentNode.endIndex)
                }
            }
        }
    });


    function remove(node) {
        //delete node.scopes;
        delete node.loc;
        return node;
    }

    function reqRemove(node) {
        if (node.children) {
            node.children = node.children.map(child => reqRemove(child));
        }
        node.raw = text.slice(node.startIndex, node.endIndex);
        return remove(node);
    }

    rootNode = reqRemove(rootNode);
    //console.log(JSON.stringify(rootNode, null, 2));
    //var traverse = require('traverse');
    //rootNode.scopes = ["Root"];
    //traverse(rootNode).forEach(function (x) {
    //    const notLeaf = this.notLeaf;
    //    if (notLeaf && !Array.isArray(x)) {
    //        //console.log(new Array(this.level).join("\t") + x.scopes[x.scopes.length - 1]);
    //        console.log(new Array(this.level).join("\t") + x.scopes[x.scopes.length - 1] + "\t" + text.slice(x.startIndex, x.endIndex).slice(0, 5));
    //    }
    //});
    return rootNode;
}