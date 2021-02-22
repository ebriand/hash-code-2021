"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const times_1 = require("./utils/times");
exports.compile = (parserDefinition) => {
    switch (parserDefinition.type) {
        case "object":
            return exports.compileObject(parserDefinition);
        case "array":
            return exports.compileArray(parserDefinition);
        case "number":
            return exports.compileNumber(parserDefinition);
        case "string":
            return exports.compileString(parserDefinition);
    }
};
exports.compileObject = ({ properties }) => {
    const propertyParsers = properties.map(propertyParserDefinition => {
        const [[propertyName, parserDefinition]] = Object.entries(propertyParserDefinition);
        return [propertyName, exports.compile(parserDefinition)];
    });
    return (tokens, context = {}) => {
        return propertyParsers.reduce((objectParserResult, [propertyName, propertyParser]) => {
            const propertyParserResult = propertyParser(objectParserResult.remaining, objectParserResult.context);
            return {
                value: {
                    ...objectParserResult.value,
                    [propertyName]: propertyParserResult.value
                },
                remaining: propertyParserResult.remaining,
                context: {
                    ...objectParserResult.context,
                    [propertyName]: propertyParserResult.value
                }
            };
        }, { value: {}, remaining: tokens, context });
    };
};
exports.compileArray = ({ length, items }) => {
    const itemParser = exports.compile(items);
    return (tokens, context = {}) => {
        var _a, _b;
        const lengthValue = Number((_a = context) === null || _a === void 0 ? void 0 : _a[length]);
        if (!Number.isSafeInteger(lengthValue) || lengthValue < 0) {
            throw new RangeError(`expected '${length}' to be a safe positive integer but found '${(_b = context) === null || _b === void 0 ? void 0 : _b[length]}'`);
        }
        return times_1.times(lengthValue).reduce(arrayParserResult => {
            const itemParserResult = itemParser(arrayParserResult.remaining, context);
            return {
                ...itemParserResult,
                value: [...arrayParserResult.value, itemParserResult.value]
            };
        }, {
            value: [],
            remaining: tokens,
            context
        });
    };
};
exports.compileNumber = (parserDefinition) => {
    return (tokens, context = {}) => {
        const [nextToken, ...remaining] = tokens;
        const value = Number(nextToken);
        if (Number.isNaN(value)) {
            throw new RangeError(`expected number but found '${value}'`);
        }
        return {
            value,
            remaining,
            context
        };
    };
};
exports.compileString = (parserDefinition) => {
    return (tokens, context = {}) => {
        const [nextToken, ...remaining] = tokens;
        return {
            value: nextToken,
            remaining,
            context
        };
    };
};
//# sourceMappingURL=compile.js.map