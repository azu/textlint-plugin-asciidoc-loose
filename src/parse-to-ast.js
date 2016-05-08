// LICENSE : MIT
"use strict";
import {createTokenStream} from "./token-stream";
import {Traverser} from "./traverse"
import StructuredSource  from "structured-source";
import NodeBuilder from "./NodeBuilder";
export function parse(text) {
    /*
    Work Flow
    1. Parse text as tokens
    2. Traverse token
    3. Build AST from token
    
    Limitation:
    
    Token is based on textmate bundle.
    It is RegExp based.
     */
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