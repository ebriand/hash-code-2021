export declare const compile: (parserDefinition: ParserDefinition) => Parser<unknown>;
export declare const compileObject: ({ properties }: ObjectParserDefinition) => Parser<unknown>;
export declare const compileArray: ({ length, items }: ArrayParserDefinition) => Parser<unknown[]>;
export declare const compileNumber: (parserDefinition: NumberParserDefinition) => Parser<number>;
export declare const compileString: (parserDefinition: StringParserDefinition) => Parser<string>;
export declare type ParserDefinition = ObjectParserDefinition | ArrayParserDefinition | NumberParserDefinition | StringParserDefinition;
export declare type ObjectParserDefinition = {
    type: "object";
    properties: PropertyParserDefinition[];
};
export declare type PropertyParserDefinition = {
    [key: string]: ParserDefinition;
};
export declare type ArrayParserDefinition = {
    type: "array";
    length: string;
    items: ParserDefinition;
};
export declare type NumberParserDefinition = {
    type: "number";
};
export declare type StringParserDefinition = {
    type: "string";
};
declare type Parser<T> = (tokens: string[], context?: Context) => ParserResult<T>;
declare type Context = {
    [key: string]: unknown;
};
declare type ParserResult<T> = {
    value: T;
    remaining: string[];
    context?: Context;
};
export {};
//# sourceMappingURL=compile.d.ts.map