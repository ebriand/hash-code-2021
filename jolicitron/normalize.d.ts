import { ParserDefinition, ArrayParserDefinition, StringParserDefinition, NumberParserDefinition } from "./compile";
export declare const normalize: (shortParserDefinition: ShortParserDefinition) => ParserDefinition;
export declare type ShortParserDefinition = ShortObjectParserDefinition | ShortArrayParserDefinition | ShortNumberParserDefinition | StringParserDefinition | "number" | "string";
export declare type ShortObjectParserDefinition = {
    type: "object";
    properties: ShortPropertyParserDefinition[];
} | ShortPropertyParserDefinition[];
export declare type ShortPropertyParserDefinition = {
    [key: string]: ShortParserDefinition;
} | string | [string, string] | [string, string, ShortParserDefinition];
export declare type ShortArrayParserDefinition = {
    length: ArrayParserDefinition["length"];
    type?: "number" | "string" | "array";
    items?: ShortParserDefinition;
};
export declare type ShortNumberParserDefinition = Partial<NumberParserDefinition>;
//# sourceMappingURL=normalize.d.ts.map