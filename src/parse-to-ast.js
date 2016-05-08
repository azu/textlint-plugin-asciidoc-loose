// LICENSE : MIT
"use strict";
import {createTokenStream} from "./token-stream";
import {Traverser} from "./traverse"
import StructuredSource  from "structured-source";
import NodeBuilder from "./NodeBuilder";
export function parse(text) {
    const tokens = createTokenStream(text);
    const traverser = new Traverser(tokens);
    const source = new StructuredSource(text);
    const nodeBuilder = new NodeBuilder({source, text});
    traverser.traverse({
        enter({current}){
            nodeBuilder.enterToken(current);
        },
        leave({current}){
            nodeBuilder.exitToken(current);
        }
    });
    return nodeBuilder.builtAST();
}