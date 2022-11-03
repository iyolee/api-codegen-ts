import {
  Operation,
  Parameter,
  Path,
  Schema,
  Spec
} from 'swagger-schema-official';
import { CustomType } from '../core/type';
import {
  IComponents,
  IOpenAPI,
  IOperation,
  IPathItem,
  ISchema,
  TParameter
} from './openApi';

export type RequestType = { [key: string]: CustomType };

export interface IClientConfig {
  url: string;
  method: string;
  TResp: CustomType | undefined;
  TReq: RequestType | { [key: string]: RequestType } | undefined;
  operationId?: string;
  pathParams: string[];
  queryParams: string[];
  bodyParams?: string[]; // for backward capability, only used in swagger version 2.0
  contentType?: string;
  deprecated?: boolean;
  summary?: string;
  description?: string;
}

export type CustomSchema = Schema | ISchema;
export type CustomReference = {
  $ref: string;
};
export type CustomParameters =
  | Operation['parameters']
  | IOperation['parameters'];
export type CustomResponses = Spec['responses'] | IComponents['responses'];
export type CustomParameter = Parameter | TParameter;
export type CustomPath = Path | IPathItem;
export type CustomPaths = Spec['paths'] | IOpenAPI['paths'];
export type CustomOperation = Operation | IOperation;
export type CustomSpec = IOpenAPI | Spec;
export type CaseType = 'default' | 'camel' | 'snake';

export interface ScanOptions {
  eslintDisable?: boolean;
  caseType?: CaseType;
  withComments?: boolean;
  // prefix('I' for interface, 'T' for type) in types
  typeWithPrefix?: boolean;
  // keep operationId and method name as before (swagger version 2.0)
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

export enum DataType {
  openapi,
  swagger
}
