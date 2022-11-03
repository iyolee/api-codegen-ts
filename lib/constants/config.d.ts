export declare const CONFIG_FILE_NAME = "api-codegen.config.json";
export declare const DEFAULT_OUTPUT_DIR = "api-clients";
export declare const DEFAULT_IMPORT_DIR = "api-data";
export declare const DEFAULT_CODEGEN_CONFIG: {
    outputFolder: string;
    requestCreateLib: string;
    requestCreateMethod: string;
    timeout: number;
    apiSpecsPaths: {
        path: string;
        name: string;
    }[];
    options: {
        eslintDisable: boolean;
        caseType: string;
        withComments: boolean;
        typeWithPrefix: boolean;
    };
};
