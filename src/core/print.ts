import { sortBy, isEmpty, compact, keys, mapValues } from 'lodash';
import { IClientConfig, RequestType, ScanOptions } from '../types/common';
import { IStore, DeclKinds } from './createRegister';
import { CustomType } from './type';
import { prettifyCode } from '../utils/prettifyCode';
import { objToTypeStr } from '../utils/objToTypeStr';

export const printOutputs = (
  clientConfigs: IClientConfig[],
  decls: IStore['decls'],
  requestCreateMethod: string,
  options?: ScanOptions,
) => {
  if (requestCreateMethod) {
    return prettifyCode(
      `${printRequest(
        clientConfigs,
        requestCreateMethod,
        options
      )} \n\n ${printTypes(decls)}`
    );
  }
  return prettifyCode(
    `${printRequestWithoutRequestMethod(
      clientConfigs,
      options
    )} \n\n ${printTypes(decls)}`
  );
};

const hasRequestBody = (TReq: IClientConfig['TReq']) =>
  TReq?.requestBody || (TReq || {})['requestBody?'];

const printRequest = (
  clientConfigs: IClientConfig[],
  requestCreateMethod: string,
  options?: ScanOptions
): string => {
  const configs = sortBy(clientConfigs, (o) => o.operationId);

  return configs
    .map((v) => {
      const toUrl = () => `url: \`${v.url}\`,`;
      const toMethod = () => `method: "${v.method}",`;
      const toRequestBody = () => {
        if (!isEmpty(v.bodyParams)) {
          return `data: ${
            v.bodyParams!.length > 1
              ? `{${v.bodyParams!.join(',')}}`
              : v.bodyParams![0]
          },`;
        }
        return v.contentType && hasRequestBody(v.TReq)
          ? 'data: requestBody,'
          : '';
      };
      const toQueryParams = () => {
        const params = toRequestParams(v.queryParams);
        return params ? `params: ${params},` : '';
      };
      const toHeaders = () =>
        v.contentType ? `headers: {"Content-Type": '${v.contentType}'},` : '';
      const toGenerators = () => {
        const TReq = generateTReq(v.TReq);
        const TResp = v.TResp?.toType(false);

        if (!TReq && !TResp) {
          return '';
        }
        if (!TResp) {
          return `<${TReq}>`;
        }
        return `<${TReq}, ${TResp}>`;
      };
      const toRequestInputs = () => {
        const getRequestBody = () => {
          if (!isEmpty(v.bodyParams)) {
            return v.bodyParams!;
          }
          return v.contentType && hasRequestBody(v.TReq) ? ['requestBody'] : '';
        };
        const list = compact([
          ...v.pathParams,
          ...v.queryParams,
          ...getRequestBody()
        ]);

        return isEmpty(list) ? '' : toRequestParams(list);
      };

      return `
${addComments(v, options?.withComments)}
export const ${v.operationId} = ${requestCreateMethod}${toGenerators()}("${
        v.operationId
      }", (${toRequestInputs()}) => ({${toUrl()}${toMethod()}${toRequestBody()}${toQueryParams()}${toHeaders()}})
);
`;
    })
    .join('');
};

const printRequestWithoutRequestMethod = (
  clientConfigs: IClientConfig[],
  options?: ScanOptions
): string => {
  const configs = sortBy(clientConfigs, (o) => o.operationId);

  return configs
    .map((v) => {
      const toUrl = () => `url: \`${v.url}\`,`;
      const toMethod = () => `method: "${v.method}",`;
      const toRequestBody = () => {
        if (!isEmpty(v.bodyParams)) {
          return `data: ${
            v.bodyParams!.length > 1
              ? `{${v.bodyParams!.join(',')}}`
              : v.bodyParams![0]
          },`;
        }
        return v.contentType && hasRequestBody(v.TReq)
          ? 'params: requestBody,'
          : '';
      };
      const toQueryParams = () => {
        const params = toRequestParams(v.queryParams);
        return params ? `params: ${params},` : '';
      };
      const toHeaders = () =>
        v.contentType ? `headers: {"Content-Type": '${v.contentType}'},` : '';
      const toReqType = () => {
        const TReq = generateTReq(v.TReq);

        if (!TReq) {
          return '';
        }
        return TReq;
      };
      // const toRespType = () => {
      //   const TResp = v.TResp?.toType(false);

      //   if (!TResp) {
      //     return null;
      //   }
      //   return TResp;
      // };
      const toRequestInputs = () => {
        const getRequestBody = () => {
          if (!isEmpty(v.bodyParams)) {
            return v.bodyParams!;
          }
          return v.contentType && hasRequestBody(v.TReq) ? ['requestBody'] : '';
        };
        const list = compact([
          ...v.pathParams,
          ...v.queryParams,
          ...getRequestBody()
        ]);
        return isEmpty(list) ? '' : toRequestParams(list);
      };

      return `
${addComments(v, options?.withComments)}
export function ${v.operationId} (${toRequestInputs()}${
        toRequestInputs() ? ':' : ''
      }${toReqType()}) {
  return {${toUrl()}${toMethod()}${toRequestBody()}${toQueryParams()}${toHeaders()}};
}
`;
    })
    .join('');
};

const addComments = (v: IClientConfig, withComments?: boolean) => {
  const summaryComment = withComments && v.summary ? `* ${v.summary}` : '';
  const deprecatedComment = v.deprecated
    ? `* @deprecated ${v.operationId}`
    : '';
  const comments = [summaryComment, deprecatedComment].filter((c) => !!c);

  return isEmpty(comments)
    ? ''
    : `/**
  ${comments.join('\\n')}
  */`;
};

const printTypes = (decls: IStore['decls']): string => {
  return keys(decls)
    .sort()
    .map((k) => {
      const expr = decls[k].kind === DeclKinds.type ? '=' : '';
      const semi = decls[k].kind === DeclKinds.type ? ';' : '';
      return `export ${decls[k].kind} ${decls[k].name} ${expr} ${decls[
        k
      ].type.toType()}${semi}`;
    })
    .join('\n\n');
};

const generateTReq = (TReq: IClientConfig['TReq']) => {
  if (isEmpty(TReq)) {
    return;
  }

  function gen(obj: IClientConfig['TReq']): string {
    return objToTypeStr(
      mapValues(obj, (v) => {
        if (!v.toType) {
          return gen(v as RequestType);
        }
        return (v as CustomType).toType(false);
      })
    );
  }

  return gen(TReq);
};

const toRequestParams = (data: string[]) =>
  !isEmpty(data) ? `{\n ${data.join(',\n')} \n}` : undefined;
