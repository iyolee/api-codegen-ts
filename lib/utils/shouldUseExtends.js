"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldUseExtends = void 0;
var lodash_1 = require("lodash");
var shouldUseExtends = function (schemas) {
    return !!lodash_1.find(schemas, function (schema) { return schema.$ref; }) &&
        !!lodash_1.find(schemas, function (schema) { return !lodash_1.isEmpty(schema.properties); });
};
exports.shouldUseExtends = shouldUseExtends;
//# sourceMappingURL=shouldUseExtends.js.map