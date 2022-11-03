"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCapitalCase = void 0;
var lodash_1 = require("lodash");
var toCapitalCase = function (str) {
    if (!str) {
        return '';
    }
    var camelStr = lodash_1.camelCase(str);
    return "" + camelStr.charAt(0).toUpperCase() + camelStr.slice(1);
};
exports.toCapitalCase = toCapitalCase;
//# sourceMappingURL=toCapitalCase.js.map