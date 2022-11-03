"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = void 0;
var config_1 = require("./config");
exports.ERROR_MESSAGES = {
    INVALID_FILE_EXT_ERROR: 'The swagger/openapi file type you provided in `apiSpecsPaths` is invalid, currently only allow .json/.yaml/.yml.',
    INVALID_JSON_FILE_ERROR: 'Your json file is invalid, please check it!',
    FETCH_CLIENT_FAILED_ERROR: "Fetch client failed! Please check your network or " + config_1.CONFIG_FILE_NAME + " file.",
    EMPTY_API_SPECS_PATHS: "The `apiSpecsPaths` cannot be empty! Please input it in your " + config_1.CONFIG_FILE_NAME + " file.",
    EMPTY_PATH_PROPERTY: "The `path` cannot be empty! Please input it in `apiSpecsPaths`.",
    NOT_FOUND_CONFIG_FILE: "Cannot found config file " + config_1.CONFIG_FILE_NAME + ".\nPlease generate " + config_1.CONFIG_FILE_NAME + " with the `cgen init` command first."
};
//# sourceMappingURL=errorMessage.js.map