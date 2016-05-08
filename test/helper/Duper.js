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
            enter({current}) {
                const {startIndex, endIndex} = current;
                dumper.log(`enter - [${startIndex}, ${endIndex}] - "${current.scopes.join('", "')}"`);
            },
            leave({current}) {
                const {startIndex, endIndex} = current;
                dumper.log(`leave - [${startIndex}, ${endIndex}] - "${current.scopes.join('", "')}"`);
            }
        });
        return dumper.result();
    }
};