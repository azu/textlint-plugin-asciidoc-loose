// LICENSE : MIT
"use strict";
import {Traverser} from"./traverse";
class Link {
    is() {
        return [
            "markup.underline.link.macro.asciidoc",
            "constant.character.attributes.macro.begin.asciidoc",
            "markup.underline.link.macro.asciidoc",
            "constant.character.attributes.macro.end.asciidoc"
        ]
    }
}
export default class NodeBuilder {
    constructor(seeker) {
        this.prevToken = null;
        this.seeker = seeker;
    }

    nextNode() {
        const node = {
            type: "Link"
        };
        const firstToken = this.seeker.nextToken();
    }
}

