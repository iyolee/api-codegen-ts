"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRemoteSpec = void 0;
var axios_1 = __importDefault(require("axios"));
var constants_1 = require("../constants");
function getFileTypeByContentType(contentType) {
    if (contentType.includes('json')) {
        return 'json';
    }
    if (contentType.includes('yaml') || contentType.includes('yml')) {
        return 'yaml';
    }
    return '';
}
function fetchRemoteSpec(url, timeout) {
    if (timeout === void 0) { timeout = 180000; }
    var instance = axios_1.default.create({ timeout: timeout });
    return instance
        .get(url)
        .then(function (response) {
        return {
            data: response.data,
            fileType: getFileTypeByContentType(response.headers['content-type'])
        };
    })
        .catch(function (error) {
        console.error(error.code + ": " + constants_1.ERROR_MESSAGES.FETCH_CLIENT_FAILED_ERROR);
    });
}
exports.fetchRemoteSpec = fetchRemoteSpec;
//# sourceMappingURL=fetchRemoteSpec.js.map