// LICENSE : MIT
"use strict";
import SourceStructure from "structured-source";
import {Registry} from 'vscode-textmate';
const registry = new Registry();
const grammar = registry.loadGrammarFromPathSync(__dirname + '/../syntax/Asciidoctor.tmLanguage');
export function createTokenStream(text) {
    const source = new SourceStructure(text);
    const tokenList = [];
    const lines = text.split("\n");
    var ruleStack = null;
    let lineStartIndex = 0;
    lines.forEach(line => {
        // prev rule stack
        const parsed = grammar.tokenizeLine(line, ruleStack);
        for (let i = 0; i < parsed.tokens.length; i++) {
            const token = parsed.tokens[i];
            token.startIndex += lineStartIndex;
            token.endIndex += lineStartIndex;
            token.loc = {
                start: source.indexToPosition(token.startIndex),
                end: source.indexToPosition(token.endIndex)
            };
            tokenList.push(token);
        }
        ruleStack = parsed.ruleStack;
        lineStartIndex += (line.length + 1);
    });
    return tokenList;
}
