import { Path } from 'swagger-schema-official';
import { IClientConfig, ScanOptions } from '../types/common';
import { createRegister } from './createRegister';
import { IPaths } from '../types/openApi';
export declare const getClientConfigsV2: (paths: {
    [pathName: string]: Path;
}, basePath: string, register: ReturnType<typeof createRegister>, options?: ScanOptions | undefined) => IClientConfig[];
export declare const getClientConfigsV3: (paths: IPaths, basePath: string, register: ReturnType<typeof createRegister>, options?: ScanOptions | undefined) => IClientConfig[];
