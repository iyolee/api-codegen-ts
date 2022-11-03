import { isEmpty, get } from 'lodash';
import { IOpenAPI, IServer } from '../types/openApi';
import { CustomSpec, CustomSchema, CustomReference, DataType, ScanOptions } from '../types/common';

const isOpenApi = (v: any): v is IOpenAPI => v.openapi;

const getBasePathFromServers = (servers?: IServer[]): string => {
  if (isEmpty(servers)) {
    return '';
  }
  const server = servers![0];
  if (server?.variables) {
    const basePath = get(server, 'variables.basePath.default');
    return basePath ? `/${basePath}` : '';
  }
  const url = new URL(server?.url);
  return url.pathname || '';
};

export const getUnifiedInputs = (data: CustomSpec, options?: ScanOptions) => {
  if (isOpenApi(data)) {
    return {
      dataType: DataType.openapi,
      basePath: getBasePathFromServers(data?.servers),
      paths: data.paths,
      schemas: data.components?.schemas as {
        [key: string]: CustomSchema | CustomReference;
      },
      parameters: data.components?.parameters,
      responses: data.components?.responses,
      requestBodies: data.components?.requestBodies
    };
  }

  return {
    dataType: DataType.swagger,
    basePath: data.basePath || '',
    paths: data.paths,
    schemas: data.definitions as { [key: string]: CustomSchema },
    parameters: data.parameters,
    responses: data.responses,
    requestBodies: null
  };
};
