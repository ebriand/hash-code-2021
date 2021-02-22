"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = (shortParserDefinition) => {
    if (typeof shortParserDefinition === "string") {
        return { type: shortParserDefinition };
    }
    else if (Array.isArray(shortParserDefinition) ||
        shortParserDefinition.type === "object") {
        return normalizeObject(shortParserDefinition);
    }
    else if ("length" in shortParserDefinition) {
        return normalizeArray(shortParserDefinition);
    }
    else if (!shortParserDefinition.type) {
        return { type: "number" };
    }
    else {
        return { type: shortParserDefinition.type };
    }
};
const normalizeObject = (shortObjectParserDefinition) => {
    if (Array.isArray(shortObjectParserDefinition)) {
        return normalizeObject({
            type: "object",
            properties: shortObjectParserDefinition
        });
    }
    else {
        return {
            type: "object",
            properties: shortObjectParserDefinition.properties.map(normalizeProperty)
        };
    }
};
const normalizeProperty = (shortPropertyParserDefinition) => {
    if (typeof shortPropertyParserDefinition === "string") {
        return { [shortPropertyParserDefinition]: exports.normalize({}) };
    }
    else if (Array.isArray(shortPropertyParserDefinition)) {
        const [propertyName, length, itemParserDefinition] = shortPropertyParserDefinition;
        return {
            [propertyName]: {
                type: "array",
                length,
                items: exports.normalize(itemParserDefinition || {})
            }
        };
    }
    else {
        const [[propertyName, parserDefinition]] = Object.entries(shortPropertyParserDefinition);
        return { [propertyName]: exports.normalize(parserDefinition) };
    }
};
const normalizeArray = (shortArrayParserDefinition) => {
    if (shortArrayParserDefinition.type !== "array") {
        return normalizeArray({
            type: "array",
            length: shortArrayParserDefinition.length,
            items: shortArrayParserDefinition.items
                ? exports.normalize(shortArrayParserDefinition.items)
                : // TypeScript seems unable to select the subset ShortParserDefinition
                    // that is correct here. It selects ShortArrayParserDefinition instead of
                    // ShortNumberParserDefiniton | StringParserDefinition. Hence the cast.
                    exports.normalize({ type: shortArrayParserDefinition.type })
        });
    }
    else {
        return {
            type: "array",
            length: shortArrayParserDefinition.length,
            items: exports.normalize(shortArrayParserDefinition.items || {})
        };
    }
};
//# sourceMappingURL=normalize.js.map