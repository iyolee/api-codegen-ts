"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestURL = void 0;
var lodash_1 = require("lodash");
var changeCase_1 = require("./changeCase");
var getRequestURL = function (pathName, basePath, caseType) {
    var isPathParam = function (str) { return str.startsWith('{'); };
    var path = lodash_1.chain(pathName)
        .split('/')
        .map(function (p) {
        var fp = changeCase_1.changeKeyCase(p, caseType);
        return (isPathParam(p) ? "$" + fp : p);
    })
        .join('/')
        .value();
    if (basePath === '/') {
        return path;
    }
    if (path === '/') {
        return basePath || path;
    }
    return "" + basePath + path;
};
exports.getRequestURL = getRequestURL;
//# sourceMappingURL=getRequestURL.js.map