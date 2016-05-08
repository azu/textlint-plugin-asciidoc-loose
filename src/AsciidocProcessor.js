// LICENSE : MIT
"use strict";
import {parse} from "./parse-to-ast";
export default class AsciidocProcessor {
    constructor(config) {
        this.config = config;
    }

    static availableExtensions() {
        // http://asciidoctor.org/docs/asciidoc-recommended-practices/
        return [
            ".asciidoc",
            ".adoc",
            ".asc"
        ];
    }

    processor(ext) {
        return {
            preProcess(text, filePath) {
                return parse(text);
            },
            postProcess(messages, filePath) {
                return {
                    messages,
                    filePath: filePath ? filePath : "<asciidoc>"
                };
            }
        };
    }
}
