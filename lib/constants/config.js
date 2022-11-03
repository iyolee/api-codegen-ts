"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CODEGEN_CONFIG = exports.DEFAULT_IMPORT_DIR = exports.DEFAULT_OUTPUT_DIR = exports.CONFIG_FILE_NAME = void 0;
// 配置文档
exports.CONFIG_FILE_NAME = 'api-codegen.config.json';
// 默认生成代码的目录
exports.DEFAULT_OUTPUT_DIR = 'api-clients';
// 默认导入API的目录
exports.DEFAULT_IMPORT_DIR = 'api-data';
// 默认配置文件
exports.DEFAULT_CODEGEN_CONFIG = {
    outputFolder: exports.DEFAULT_OUTPUT_DIR,
    requestCreateLib: '',
    requestCreateMethod: 'createRequest',
    timeout: 3 * 60 * 1000,
    apiSpecsPaths: [
        {
            path: 'https://petstore.swagger.io/v2/swagger.json',
            name: 'example'
        }
    ],
    options: {
        eslintDisable: false,
        // 'default' | 'camel' | 'snake'
        caseType: 'default',
        withComments: false,
        typeWithPrefix: false
        // backwardCompatible: false
    }
};
//# sourceMappingURL=config.js.map