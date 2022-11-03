import { IClientConfig, ScanOptions } from '../types/common';
import { IStore } from './createRegister';
export declare const printOutputs: (clientConfigs: IClientConfig[], decls: IStore['decls'], requestCreateMethod: string, options?: ScanOptions | undefined) => string;
