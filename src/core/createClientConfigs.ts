import {
  BodyParameter,
  FormDataParameter,
  Operation,
  Path,
  Response
} from 'swagger-schema-official';
import {
  camelCase,
  Dictionary,
  first,
  get,
  isEmpty,
  keys,
  map,
  omit,
  pick,
  reduce,
  upperCase,
  values,
  some,
  takeRight
} from 'lodash';
import { CustomType } from './type';
import { Schema } from './schema';
import {
  CaseType,
  CustomOperation,
  CustomParameter,
  CustomParameters,
  CustomPath,
  CustomPaths,
  CustomReference,
  CustomSchema,
  IClientConfig,
  ScanOptions
} from '../types/common';
import { createRegister } from './createRegister';
import { IOperation, IPaths, IRequestBody, IResponse } from '../types/openApi';
import { toCapitalCase } from '../utils/toCapitalCase';
import { getRequestURL } from '../utils/getRequestURL';
import { changeParametersCase } from '../utils/changeCase';

const getPathsFromRef = (str?: string): string[] => {
  if (!str) {
    return [];
  }

  const paths = str.replace(/^#\//, '').split('/');
  return takeRight(paths, 2);
};

const withOptionalName = (name: string, required?: boolean) =>
  `${name}${required ? '' : '?'}`;

const buildConfigs = <TOperation extends CustomOperation>({
  paths,
  basePath,
  register,
  backwardCompatible,
  createOtherConfig,
  caseType
}: {
  paths: CustomPaths;
  basePath: string;
  register: ReturnType<typeof createRegister>;
  backwardCompatible?: boolean;
  createOtherConfig: (
    operation: TOperation,
    pathParams?: CustomParameter[],
    queryParams?: CustomParameter[]
  ) => Pick<IClientConfig, 'TReq' | 'TResp' | 'contentType'>;
  caseType?: CaseType | undefined;
}) => {
  const createConfig = (
    path: CustomPath,
    pathName: string
  ): IClientConfig[] => {
    const operations = getOperations<TOperation>(path);
    return keys(operations).map((method) => {
      const operation = operations[method];
      const formattedParams = changeParametersCase(
        operation.parameters,
        caseType
      );
      const { pathParams, queryParams } = getParams(register)(formattedParams);

      return {
        url: getRequestURL(pathName, basePath, caseType),
        method: backwardCompatible ? method : upperCase(method),
        operationId: backwardCompatible
          ? operation.operationId
          : camelCase(operation.operationId),
        deprecated: operation.deprecated,
        pathParams: getParamsNames(pathParams),
        queryParams: getParamsNames(queryParams),
        bodyParams: backwardCompatible
          ? [
              ...getParamsNames(pickParams(register)(formattedParams)('body')),
              ...getParamsNames(
                pickParams(register)(formattedParams)('formData')
              )
            ]
          : undefined,
        ...createOtherConfig(operation, pathParams, queryParams),
        summary: operation.summary,
        description: operation.description
      };
    });
  };

  return reduce(
    paths,
    (configs: IClientConfig[], path: CustomPath, pathName: string) => [
      ...configs,
      ...createConfig(path, pathName)
    ],
    []
  );
};

const getOperations = <TOperation>(path: CustomPath) =>
  pick(path, ['get', 'post', 'put', 'delete', 'patch', 'head']) as {
    [method: string]: TOperation;
  };

const getParams =
  (register: ReturnType<typeof createRegister>) =>
  (parameters: CustomParameters) => {
    const pickParamsByType = pickParams(register)(parameters);
    return {
      pathParams: pickParamsByType<CustomParameter>('path'),
      queryParams: pickParamsByType<CustomParameter>('query')
    };
  };

const getParamsNames = (params?: any[]) =>
  isEmpty(params) ? [] : map(params, (param) => param?.name);

export const getClientConfigsV2 = (
  paths: { [pathName: string]: Path },
  basePath: string,
  register: ReturnType<typeof createRegister>,
  options?: ScanOptions
): IClientConfig[] => {
  const schemaHandler = new Schema(register);
  const backwardCompatible = options?.backwardCompatible ?? false;
  const caseType = options?.caseType;
  const getRequestBody = (operation: Operation) => {
    const pickParamsByType = pickParams(register)(operation.parameters);

    const bodyParams = pickParamsByType<BodyParameter>('body');
    const formDataParams = pickParamsByType<FormDataParameter>('formData');

    const getContentType = () => {
      if (operation.consumes && operation.consumes!.length > 0) {
        return operation.consumes[0] as string;
      }
      if (bodyParams) {
        return 'application/json';
      }
      if (formDataParams) {
        return 'multipart/form-data';
      }
      return '';
    };

    return {
      requestBody: bodyParams || formDataParams,
      contentType: getContentType()
    };
  };

  return buildConfigs<Operation>({
    paths,
    basePath,
    register,
    backwardCompatible,
    createOtherConfig: (operation, pathParams, queryParams) => {
      const requestTypesGetter = getRequestTypes(schemaHandler)(
        operation.operationId
      );

      const successResponsesGetter = getSuccessResponsesType(
        schemaHandler,
        register
      );
      const { requestBody, contentType } = getRequestBody(operation);
      const requestBodyType = requestTypesGetter(requestBody);
      const finalBodyType = backwardCompatible
        ? requestBodyType
        : getRequestBodyType({
            schemaHandler,
            operationId: operation.operationId,
            params: requestBody,
            contentType
          });

      return {
        TResp: successResponsesGetter<Response>(
          operation.responses,
          (resp) => resp?.schema
        ),
        TReq: {
          ...requestTypesGetter(pathParams),
          ...requestTypesGetter(queryParams),
          ...(!isEmpty(requestBodyType) && finalBodyType)
        },
        contentType
      };
    },
    caseType
  });
};

export const getClientConfigsV3 = (
  paths: IPaths,
  basePath: string,
  register: ReturnType<typeof createRegister>,
  options?: ScanOptions
): IClientConfig[] => {
  const schemaHandler = new Schema(register, options);
  const caseType = options?.caseType;
  const getRequestBody = (requestBody?: CustomReference | IRequestBody) => {
    if (!requestBody) {
      return {};
    }
    const bodyData = requestBody?.$ref
      ? register.getData(getPathsFromRef(requestBody.$ref))
      : requestBody;

    return {
      requestBody: {
        name: 'requestBody',
        ...omit(bodyData, 'content'),
        ...getFirstValue(bodyData?.content)
      },
      contentType: bodyData && getFirstKey(bodyData?.content)
    };
  };

  return buildConfigs<IOperation>({
    paths,
    basePath,
    register,
    createOtherConfig: (operation, pathParams, queryParams) => {
      const requestTypesGetter = getRequestTypes(schemaHandler)(
        operation.operationId
      );
      const { requestBody, contentType } = getRequestBody(
        operation.requestBody
      );
      const successResponsesGetter = getSuccessResponsesType(
        schemaHandler,
        register
      );

      return {
        TResp: successResponsesGetter<IResponse>(
          operation.responses,
          (resp) => getFirstValue(resp?.content)?.schema
        ),
        TReq: {
          ...requestTypesGetter(pathParams),
          ...requestTypesGetter(queryParams),
          ...(requestBody && requestTypesGetter([requestBody]))
        },
        contentType
      };
    },
    caseType
  });
};

const pickParams =
  (register: ReturnType<typeof createRegister>) =>
  (params?: CustomParameters) =>
  <TParameter>(
    type: 'path' | 'query' | 'body' | 'formData'
  ): TParameter[] | undefined => {
    const list = map(params, (param) =>
      getRef(param) ? register.getData(getPathsFromRef(param.$ref)) : param
    ).filter((v: CustomParameter) => v.in === type);

    return isEmpty(list) ? undefined : list;
  };

const getRequestTypes =
  (schemaHandler: Schema) =>
  (operationId?: string) =>
  (params?: CustomParameter[]): { [key: string]: CustomType } | undefined => {
    if (!params) {
      return;
    }

    return params.reduce(
      (results, param) => ({
        ...results,
        [withOptionalName(param.name, param.required)]: schemaHandler.convert(
          get(param, 'schema', param),
          `${toCapitalCase(operationId)}${toCapitalCase(param.name)}`
        )
      }),
      {}
    );
  };

const getRequestBodyType = ({
  schemaHandler,
  operationId,
  params,
  contentType
}: {
  schemaHandler: Schema;
  operationId?: string;
  params?: CustomParameter[];
  contentType?: string;
}) => {
  if (!params) {
    return;
  }

  const REQUEST_BODY = 'requestBody';

  if (contentType === 'application/json') {
    const param = params[0];
    return {
      [withOptionalName(REQUEST_BODY, param.required)]: schemaHandler.convert(
        get(param, 'schema', param),
        `${toCapitalCase(operationId)}${toCapitalCase(param.name)}`
      )
    };
  }

  const isRequired = some(params, (param) => param.required);
  return {
    [withOptionalName(REQUEST_BODY, isRequired)]:
      getRequestTypes(schemaHandler)(operationId)(params)
  };
};

const getSuccessResponsesType =
  (schemaHandler: Schema, register: ReturnType<typeof createRegister>) =>
  <TResponse>(
    responses?: { [responseName: string]: TResponse | CustomReference },
    getSchema?: (resp?: TResponse) => CustomSchema | undefined
  ) => {
    if (!responses || !getSchema) {
      return;
    }

    let firstSuccessResp: TResponse | CustomReference | undefined = undefined;

    keys(responses).forEach((code) => {
      const httpCode = Number(code);
      const resp = responses[code];
      const hasContent = getRef(resp) || getSchema(resp as TResponse);

      if (
        httpCode >= 200 &&
        httpCode < 300 &&
        hasContent &&
        !firstSuccessResp
      ) {
        firstSuccessResp = resp;
      }
    });

    const handleResp = (
      resp?: TResponse | CustomReference
    ): CustomType | undefined => {
      if (getRef(resp)) {
        const paths = getPathsFromRef(resp.$ref);
        const response = register.getData(paths);
        return response ? handleResp(response) : schemaHandler.convert(resp);
      }

      const schema = getSchema(resp);
      return schema && schemaHandler.convert(schema);
    };

    return firstSuccessResp && handleResp(firstSuccessResp);
  };

const getRef = (v: any): v is CustomReference => v.$ref;

const getFirstValue = (data?: Dictionary<any>) => first(values(data));

const getFirstKey = (data?: Dictionary<any>) => first(keys(data));
