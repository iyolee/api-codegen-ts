"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientConfigsV3 = exports.getClientConfigsV2 = void 0;
var lodash_1 = require("lodash");
var schema_1 = require("./schema");
var toCapitalCase_1 = require("../utils/toCapitalCase");
var getRequestURL_1 = require("../utils/getRequestURL");
var changeCase_1 = require("../utils/changeCase");
var getPathsFromRef = function (str) {
    if (!str) {
        return [];
    }
    var paths = str.replace(/^#\//, '').split('/');
    return lodash_1.takeRight(paths, 2);
};
var withOptionalName = function (name, required) {
    return "" + name + (required ? '' : '?');
};
var buildConfigs = function (_a) {
    var paths = _a.paths, basePath = _a.basePath, register = _a.register, backwardCompatible = _a.backwardCompatible, createOtherConfig = _a.createOtherConfig, caseType = _a.caseType;
    var createConfig = function (path, pathName) {
        var operations = getOperations(path);
        return lodash_1.keys(operations).map(function (method) {
            var operation = operations[method];
            var formattedParams = changeCase_1.changeParametersCase(operation.parameters, caseType);
            var _a = getParams(register)(formattedParams), pathParams = _a.pathParams, queryParams = _a.queryParams;
            return __assign(__assign({ url: getRequestURL_1.getRequestURL(pathName, basePath, caseType), method: backwardCompatible ? method : lodash_1.upperCase(method), operationId: backwardCompatible
                    ? operation.operationId
                    : lodash_1.camelCase(operation.operationId), deprecated: operation.deprecated, pathParams: getParamsNames(pathParams), queryParams: getParamsNames(queryParams), bodyParams: backwardCompatible
                    ? __spreadArray(__spreadArray([], __read(getParamsNames(pickParams(register)(formattedParams)('body')))), __read(getParamsNames(pickParams(register)(formattedParams)('formData')))) : undefined }, createOtherConfig(operation, pathParams, queryParams)), { summary: operation.summary, description: operation.description });
        });
    };
    return lodash_1.reduce(paths, function (configs, path, pathName) { return __spreadArray(__spreadArray([], __read(configs)), __read(createConfig(path, pathName))); }, []);
};
var getOperations = function (path) {
    return lodash_1.pick(path, ['get', 'post', 'put', 'delete', 'patch', 'head']);
};
var getParams = function (register) {
    return function (parameters) {
        var pickParamsByType = pickParams(register)(parameters);
        return {
            pathParams: pickParamsByType('path'),
            queryParams: pickParamsByType('query')
        };
    };
};
var getParamsNames = function (params) {
    return lodash_1.isEmpty(params) ? [] : lodash_1.map(params, function (param) { return param === null || param === void 0 ? void 0 : param.name; });
};
var getClientConfigsV2 = function (paths, basePath, register, options) {
    var _a;
    var schemaHandler = new schema_1.Schema(register);
    var backwardCompatible = (_a = options === null || options === void 0 ? void 0 : options.backwardCompatible) !== null && _a !== void 0 ? _a : false;
    var caseType = options === null || options === void 0 ? void 0 : options.caseType;
    var getRequestBody = function (operation) {
        var pickParamsByType = pickParams(register)(operation.parameters);
        var bodyParams = pickParamsByType('body');
        var formDataParams = pickParamsByType('formData');
        var getContentType = function () {
            if (operation.consumes && operation.consumes.length > 0) {
                return operation.consumes[0];
            }
            if (bodyParams) {
                return 'application/json';
            }
            if (formDataParams) {
                return 'multipart/form-data';
            }
            return '';
        };
        return {
            requestBody: bodyParams || formDataParams,
            contentType: getContentType()
        };
    };
    return buildConfigs({
        paths: paths,
        basePath: basePath,
        register: register,
        backwardCompatible: backwardCompatible,
        createOtherConfig: function (operation, pathParams, queryParams) {
            var requestTypesGetter = getRequestTypes(schemaHandler)(operation.operationId);
            var successResponsesGetter = getSuccessResponsesType(schemaHandler, register);
            var _a = getRequestBody(operation), requestBody = _a.requestBody, contentType = _a.contentType;
            var requestBodyType = requestTypesGetter(requestBody);
            var finalBodyType = backwardCompatible
                ? requestBodyType
                : getRequestBodyType({
                    schemaHandler: schemaHandler,
                    operationId: operation.operationId,
                    params: requestBody,
                    contentType: contentType
                });
            return {
                TResp: successResponsesGetter(operation.responses, function (resp) { return resp === null || resp === void 0 ? void 0 : resp.schema; }),
                TReq: __assign(__assign(__assign({}, requestTypesGetter(pathParams)), requestTypesGetter(queryParams)), (!lodash_1.isEmpty(requestBodyType) && finalBodyType)),
                contentType: contentType
            };
        },
        caseType: caseType
    });
};
exports.getClientConfigsV2 = getClientConfigsV2;
var getClientConfigsV3 = function (paths, basePath, register, options) {
    var schemaHandler = new schema_1.Schema(register, options);
    var caseType = options === null || options === void 0 ? void 0 : options.caseType;
    var getRequestBody = function (requestBody) {
        if (!requestBody) {
            return {};
        }
        var bodyData = (requestBody === null || requestBody === void 0 ? void 0 : requestBody.$ref)
            ? register.getData(getPathsFromRef(requestBody.$ref))
            : requestBody;
        return {
            requestBody: __assign(__assign({ name: 'requestBody' }, lodash_1.omit(bodyData, 'content')), getFirstValue(bodyData === null || bodyData === void 0 ? void 0 : bodyData.content)),
            contentType: bodyData && getFirstKey(bodyData === null || bodyData === void 0 ? void 0 : bodyData.content)
        };
    };
    return buildConfigs({
        paths: paths,
        basePath: basePath,
        register: register,
        createOtherConfig: function (operation, pathParams, queryParams) {
            var requestTypesGetter = getRequestTypes(schemaHandler)(operation.operationId);
            var _a = getRequestBody(operation.requestBody), requestBody = _a.requestBody, contentType = _a.contentType;
            var successResponsesGetter = getSuccessResponsesType(schemaHandler, register);
            return {
                TResp: successResponsesGetter(operation.responses, function (resp) { var _a; return (_a = getFirstValue(resp === null || resp === void 0 ? void 0 : resp.content)) === null || _a === void 0 ? void 0 : _a.schema; }),
                TReq: __assign(__assign(__assign({}, requestTypesGetter(pathParams)), requestTypesGetter(queryParams)), (requestBody && requestTypesGetter([requestBody]))),
                contentType: contentType
            };
        },
        caseType: caseType
    });
};
exports.getClientConfigsV3 = getClientConfigsV3;
var pickParams = function (register) {
    return function (params) {
        return function (type) {
            var list = lodash_1.map(params, function (param) {
                return getRef(param) ? register.getData(getPathsFromRef(param.$ref)) : param;
            }).filter(function (v) { return v.in === type; });
            return lodash_1.isEmpty(list) ? undefined : list;
        };
    };
};
var getRequestTypes = function (schemaHandler) {
    return function (operationId) {
        return function (params) {
            if (!params) {
                return;
            }
            return params.reduce(function (results, param) {
                var _a;
                return (__assign(__assign({}, results), (_a = {}, _a[withOptionalName(param.name, param.required)] = schemaHandler.convert(lodash_1.get(param, 'schema', param), "" + toCapitalCase_1.toCapitalCase(operationId) + toCapitalCase_1.toCapitalCase(param.name)), _a)));
            }, {});
        };
    };
};
var getRequestBodyType = function (_a) {
    var _b, _c;
    var schemaHandler = _a.schemaHandler, operationId = _a.operationId, params = _a.params, contentType = _a.contentType;
    if (!params) {
        return;
    }
    var REQUEST_BODY = 'requestBody';
    if (contentType === 'application/json') {
        var param = params[0];
        return _b = {},
            _b[withOptionalName(REQUEST_BODY, param.required)] = schemaHandler.convert(lodash_1.get(param, 'schema', param), "" + toCapitalCase_1.toCapitalCase(operationId) + toCapitalCase_1.toCapitalCase(param.name)),
            _b;
    }
    var isRequired = lodash_1.some(params, function (param) { return param.required; });
    return _c = {},
        _c[withOptionalName(REQUEST_BODY, isRequired)] = getRequestTypes(schemaHandler)(operationId)(params),
        _c;
};
var getSuccessResponsesType = function (schemaHandler, register) {
    return function (responses, getSchema) {
        if (!responses || !getSchema) {
            return;
        }
        var firstSuccessResp = undefined;
        lodash_1.keys(responses).forEach(function (code) {
            var httpCode = Number(code);
            var resp = responses[code];
            var hasContent = getRef(resp) || getSchema(resp);
            if (httpCode >= 200 &&
                httpCode < 300 &&
                hasContent &&
                !firstSuccessResp) {
                firstSuccessResp = resp;
            }
        });
        var handleResp = function (resp) {
            if (getRef(resp)) {
                var paths = getPathsFromRef(resp.$ref);
                var response = register.getData(paths);
                return response ? handleResp(response) : schemaHandler.convert(resp);
            }
            var schema = getSchema(resp);
            return schema && schemaHandler.convert(schema);
        };
        return firstSuccessResp && handleResp(firstSuccessResp);
    };
};
var getRef = function (v) { return v.$ref; };
var getFirstValue = function (data) { return lodash_1.first(lodash_1.values(data)); };
var getFirstKey = function (data) { return lodash_1.first(lodash_1.keys(data)); };
//# sourceMappingURL=createClientConfigs.js.map