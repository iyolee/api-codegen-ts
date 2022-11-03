"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objToTypeStr = void 0;
var lodash_1 = require("lodash");
var quoteKey_1 = require("./quoteKey");
var objToTypeStr = function (obj) {
    if (lodash_1.isEmpty(obj)) {
        return '';
    }
    var list = lodash_1.map(obj, function (v, k) { return quoteKey_1.quoteKey(k) + ": " + v + ";"; });
    return (obj &&
        "{\n        " + list.sort().join('\n') + "\n      }");
};
exports.objToTypeStr = objToTypeStr;
//# sourceMappingURL=objToTypeStr.js.map