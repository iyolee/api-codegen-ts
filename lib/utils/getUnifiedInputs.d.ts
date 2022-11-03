import { CustomSpec, CustomSchema, CustomReference, DataType, ScanOptions } from '../types/common';
export declare const getUnifiedInputs: (data: CustomSpec, options?: ScanOptions | undefined) => {
    dataType: DataType;
    basePath: string;
    paths: import("../types/openApi").IPaths;
    schemas: {
        [key: string]: CustomSchema | CustomReference;
    };
    parameters: {
        [k: string]: import("../types/openApi").IReference | import("../types/openApi").TParameter;
    } | undefined;
    responses: {
        [k: string]: import("../types/openApi").IReference | import("../types/openApi").IResponse;
    } | undefined;
    requestBodies: {
        [k: string]: import("../types/openApi").IReference | import("../types/openApi").IRequestBody;
    } | undefined;
} | {
    dataType: DataType;
    basePath: string;
    paths: {
        [pathName: string]: import("swagger-schema-official").Path;
    };
    schemas: {
        [key: string]: CustomSchema;
    };
    parameters: {
        [parameterName: string]: import("swagger-schema-official").BodyParameter | import("swagger-schema-official").QueryParameter;
    } | undefined;
    responses: {
        [responseName: string]: import("swagger-schema-official").Response;
    } | undefined;
    requestBodies: null;
};
