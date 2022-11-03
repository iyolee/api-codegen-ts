"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasHttpOrHttps = void 0;
var errorMessage_1 = require("../constants/errorMessage");
var hasHttpOrHttps = function (path) {
    if (!path) {
        console.log(errorMessage_1.ERROR_MESSAGES.EMPTY_PATH_PROPERTY);
        process.exit(1);
    }
    if (!/(http|https):\/\/([\w.]+\/?)\S*/.test(path))
        return false;
    var url = new URL(path);
    var protocol = url.protocol;
    return protocol && /https?:/.test(protocol);
};
exports.hasHttpOrHttps = hasHttpOrHttps;
//# sourceMappingURL=hasHttpOrHttps.js.map