"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteKey = void 0;
var lodash_1 = require("lodash");
var quoteKey = function (k) {
    var isOptional = lodash_1.indexOf(k, '?') > -1;
    return "'" + lodash_1.trimEnd(k, '?') + "'" + (isOptional ? '?' : '');
};
exports.quoteKey = quoteKey;
//# sourceMappingURL=quoteKey.js.map