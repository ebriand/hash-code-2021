"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compile_1 = require("./compile");
const normalize_1 = require("./normalize");
const tokenize_1 = require("./tokenize");
exports.default = (parserDefinition, input) => {
    const normalized = normalize_1.normalize(parserDefinition);
    const parser = compile_1.compile(normalized);
    const tokens = tokenize_1.tokenize(input);
    const { value } = parser(tokens);
    return value;
};
//# sourceMappingURL=jolicitron.js.map