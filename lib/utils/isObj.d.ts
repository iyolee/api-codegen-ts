import { CustomSchema } from '../types/common';
export declare const isObj: (s: CustomSchema) => true | {
    [propertyName: string]: import("swagger-schema-official").Schema;
} | {
    [k: string]: import("../types/openApi").ISchema | import("../types/openApi").IReference;
} | undefined;
