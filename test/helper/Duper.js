// LICENSE : MIT
"use strict";
import {Traverser} from "../../src/traverse";
export default class Dumper {
    constructor() {
        this.logs = [];
    }

    log(str) {
        this.logs.push(str);
    }

    result() {
        return this.logs.join('\n');
    }

    static dump(toknes) {
        const dumper = new Dumper();
        const traverser = new Traverser(toknes);
        traverser.traverse({
            enter(node) {
                const {startIndex, endIndex} = node;
                dumper.log(`enter - [${startIndex}, ${endIndex}] - "${node.scopes.join('", "')}"`);
            },
            leave(node) {
                const {startIndex, endIndex} = node;
                dumper.log(`leave - [${startIndex}, ${endIndex}] - "${node.scopes.join('", "')}"`);
            }
        });
        return dumper.result();
    }
};