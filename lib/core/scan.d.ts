import { IClientConfig, CustomSpec, ScanOptions, DataType } from '../types/common';
export declare const scan: (data: CustomSpec, options?: ScanOptions | undefined) => {
    clientConfigs: IClientConfig[];
    decls: {
        [id: string]: {
            type: import("./type").CustomType;
            kind: string;
            name: string;
        };
    };
    dataType: DataType;
};
