import { Operation, Parameter, Path, Schema, Spec } from 'swagger-schema-official';
import { CustomType } from '../core/type';
import { IComponents, IOpenAPI, IOperation, IPathItem, ISchema, TParameter } from './openApi';
export declare type RequestType = {
    [key: string]: CustomType;
};
export interface IClientConfig {
    url: string;
    method: string;
    TResp: CustomType | undefined;
    TReq: RequestType | {
        [key: string]: RequestType;
    } | undefined;
    operationId?: string;
    pathParams: string[];
    queryParams: string[];
    bodyParams?: string[];
    contentType?: string;
    deprecated?: boolean;
    summary?: string;
    description?: string;
}
export declare type CustomSchema = Schema | ISchema;
export declare type CustomReference = {
    $ref: string;
};
export declare type CustomParameters = Operation['parameters'] | IOperation['parameters'];
export declare type CustomResponses = Spec['responses'] | IComponents['responses'];
export declare type CustomParameter = Parameter | TParameter;
export declare type CustomPath = Path | IPathItem;
export declare type CustomPaths = Spec['paths'] | IOpenAPI['paths'];
export declare type CustomOperation = Operation | IOperation;
export declare type CustomSpec = IOpenAPI | Spec;
export declare type CaseType = 'default' | 'camel' | 'snake';
export interface ScanOptions {
    eslintDisable?: boolean;
    caseType?: CaseType;
    withComments?: boolean;
    typeWithPrefix?: boolean;
    backwardCompatible?: boolean;
}
export interface ApiSpecsPath {
    path: string;
    name?: string;
}
export interface CodegenConfig {
    requestCreateLib: string;
    requestCreateMethod: string;
    apiSpecsPaths: ApiSpecsPath[];
    outputFolder?: string;
    timeout?: number;
    options?: ScanOptions;
}
export declare enum DataType {
    openapi = 0,
    swagger = 1
}
