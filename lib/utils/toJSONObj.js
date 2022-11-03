"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJSONObj = void 0;
var errorMessage_1 = require("../constants/errorMessage");
function toJSONObj(input, errorMsg, output) {
    if (errorMsg === void 0) { errorMsg = errorMessage_1.ERROR_MESSAGES.INVALID_JSON_FILE_ERROR; }
    if (output === void 0) { output = console.error; }
    if (typeof input === 'object') {
        return input;
    }
    if (typeof input === 'string') {
        try {
            return JSON.parse(input);
        }
        catch (e) {
            output(errorMsg);
            return;
        }
    }
    return;
}
exports.toJSONObj = toJSONObj;
//# sourceMappingURL=toJSONObj.js.map