"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnifiedInputs = void 0;
var lodash_1 = require("lodash");
var common_1 = require("../types/common");
var isOpenApi = function (v) { return v.openapi; };
var getBasePathFromServers = function (servers) {
    if (lodash_1.isEmpty(servers)) {
        return '';
    }
    var server = servers[0];
    if (server === null || server === void 0 ? void 0 : server.variables) {
        var basePath = lodash_1.get(server, 'variables.basePath.default');
        return basePath ? "/" + basePath : '';
    }
    var url = new URL(server === null || server === void 0 ? void 0 : server.url);
    return url.pathname || '';
};
var getUnifiedInputs = function (data, options) {
    var _a, _b, _c, _d;
    if (isOpenApi(data)) {
        return {
            dataType: common_1.DataType.openapi,
            basePath: getBasePathFromServers(data === null || data === void 0 ? void 0 : data.servers),
            paths: data.paths,
            schemas: (_a = data.components) === null || _a === void 0 ? void 0 : _a.schemas,
            parameters: (_b = data.components) === null || _b === void 0 ? void 0 : _b.parameters,
            responses: (_c = data.components) === null || _c === void 0 ? void 0 : _c.responses,
            requestBodies: (_d = data.components) === null || _d === void 0 ? void 0 : _d.requestBodies
        };
    }
    return {
        dataType: common_1.DataType.swagger,
        basePath: data.basePath || '',
        paths: data.paths,
        schemas: data.definitions,
        parameters: data.parameters,
        responses: data.responses,
        requestBodies: null
    };
};
exports.getUnifiedInputs = getUnifiedInputs;
//# sourceMappingURL=getUnifiedInputs.js.map