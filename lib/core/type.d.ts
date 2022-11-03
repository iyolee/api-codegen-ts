import { createRegister, DeclKinds } from './createRegister';
export declare type CustomType = Ref | Obj | Arr | Enum | OneOf | AllOf | BasicType;
interface TypeFactory {
    toType: () => string;
    toDescription: () => string;
}
declare class BasicType implements TypeFactory {
    private name;
    private description?;
    static type(name: string, description?: string): BasicType;
    constructor(name: string, description?: string | undefined);
    toType(): string;
    toDescription(): string;
}
export declare class Enum implements TypeFactory {
    private name;
    private value?;
    private kind?;
    private description?;
    constructor(name: string, value?: any[] | undefined, kind?: DeclKinds | undefined, description?: string | undefined);
    toType(): string;
    toDescription(): string;
}
declare class OneOf implements TypeFactory {
    private types;
    constructor(types: CustomType[]);
    toType(): string;
    toDescription(): string;
}
declare class AllOf implements TypeFactory {
    private obj;
    private otherTypes;
    private useExtends?;
    constructor(obj: Obj | undefined, otherTypes: Omit<CustomType, 'Obj'>[], useExtends?: boolean | undefined);
    toType(useExtends?: boolean | undefined): string;
    toDescription(): string;
}
export declare class Arr implements TypeFactory {
    private data;
    constructor(data: CustomType[] | CustomType);
    toType(): string;
    toDescription(): string;
}
export declare class Ref implements TypeFactory {
    private name;
    alias: string | undefined;
    constructor(name: string);
    rename(alias: string): void;
    toType(): string;
    toDescription(): string;
}
export declare class Obj implements TypeFactory {
    private props;
    private additionalProps?;
    constructor(props: {
        [key: string]: CustomType;
    } | string, additionalProps?: CustomType | undefined);
    toType(): string;
    toDescription(): string;
}
export declare class Type {
    private register;
    constructor(register: ReturnType<typeof createRegister>);
    enum(value: any[], id?: string, desc?: string): Ref | Enum;
    ref($ref: string): Ref;
    array(types: CustomType | CustomType[]): Arr;
    oneOf(types: CustomType[]): OneOf;
    allOf(obj: Obj | undefined, otherTypes: Omit<CustomType, 'Obj'>[], useExtends?: boolean): AllOf;
    object(props: {
        [key: string]: CustomType;
    } | string, additionalProps?: CustomType, description?: string): Obj;
    boolean(description?: string): BasicType;
    string(description?: string): BasicType;
    null(description?: string): BasicType;
    number(description?: string): BasicType;
    file(description?: string): BasicType;
    any(description?: string): BasicType;
}
export {};
