"use strict";
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
exports.printOutputs = void 0;
var lodash_1 = require("lodash");
var createRegister_1 = require("./createRegister");
var prettifyCode_1 = require("../utils/prettifyCode");
var objToTypeStr_1 = require("../utils/objToTypeStr");
var printOutputs = function (clientConfigs, decls, requestCreateMethod, options) {
    if (requestCreateMethod) {
        return prettifyCode_1.prettifyCode(printRequest(clientConfigs, requestCreateMethod, options) + " \n\n " + printTypes(decls));
    }
    return prettifyCode_1.prettifyCode(printRequestWithoutRequestMethod(clientConfigs, options) + " \n\n " + printTypes(decls));
};
exports.printOutputs = printOutputs;
var hasRequestBody = function (TReq) {
    return (TReq === null || TReq === void 0 ? void 0 : TReq.requestBody) || (TReq || {})['requestBody?'];
};
var printRequest = function (clientConfigs, requestCreateMethod, options) {
    var configs = lodash_1.sortBy(clientConfigs, function (o) { return o.operationId; });
    return configs
        .map(function (v) {
        var toUrl = function () { return "url: `" + v.url + "`,"; };
        var toMethod = function () { return "method: \"" + v.method + "\","; };
        var toRequestBody = function () {
            if (!lodash_1.isEmpty(v.bodyParams)) {
                return "data: " + (v.bodyParams.length > 1
                    ? "{" + v.bodyParams.join(',') + "}"
                    : v.bodyParams[0]) + ",";
            }
            return v.contentType && hasRequestBody(v.TReq)
                ? 'data: requestBody,'
                : '';
        };
        var toQueryParams = function () {
            var params = toRequestParams(v.queryParams);
            return params ? "params: " + params + "," : '';
        };
        var toHeaders = function () {
            return v.contentType ? "headers: {\"Content-Type\": '" + v.contentType + "'}," : '';
        };
        var toGenerators = function () {
            var _a;
            var TReq = generateTReq(v.TReq);
            var TResp = (_a = v.TResp) === null || _a === void 0 ? void 0 : _a.toType(false);
            if (!TReq && !TResp) {
                return '';
            }
            if (!TResp) {
                return "<" + TReq + ">";
            }
            return "<" + TReq + ", " + TResp + ">";
        };
        var toRequestInputs = function () {
            var getRequestBody = function () {
                if (!lodash_1.isEmpty(v.bodyParams)) {
                    return v.bodyParams;
                }
                return v.contentType && hasRequestBody(v.TReq) ? ['requestBody'] : '';
            };
            var list = lodash_1.compact(__spreadArray(__spreadArray(__spreadArray([], __read(v.pathParams)), __read(v.queryParams)), __read(getRequestBody())));
            return lodash_1.isEmpty(list) ? '' : toRequestParams(list);
        };
        return "\n" + addComments(v, options === null || options === void 0 ? void 0 : options.withComments) + "\nexport const " + v.operationId + " = " + requestCreateMethod + toGenerators() + "(\"" + v.operationId + "\", (" + toRequestInputs() + ") => ({" + toUrl() + toMethod() + toRequestBody() + toQueryParams() + toHeaders() + "})\n);\n";
    })
        .join('');
};
var printRequestWithoutRequestMethod = function (clientConfigs, options) {
    var configs = lodash_1.sortBy(clientConfigs, function (o) { return o.operationId; });
    return configs
        .map(function (v) {
        var toUrl = function () { return "url: `" + v.url + "`,"; };
        var toMethod = function () { return "method: \"" + v.method + "\","; };
        var toRequestBody = function () {
            if (!lodash_1.isEmpty(v.bodyParams)) {
                return "data: " + (v.bodyParams.length > 1
                    ? "{" + v.bodyParams.join(',') + "}"
                    : v.bodyParams[0]) + ",";
            }
            return v.contentType && hasRequestBody(v.TReq)
                ? 'params: requestBody,'
                : '';
        };
        var toQueryParams = function () {
            var params = toRequestParams(v.queryParams);
            return params ? "params: " + params + "," : '';
        };
        var toHeaders = function () {
            return v.contentType ? "headers: {\"Content-Type\": '" + v.contentType + "'}," : '';
        };
        var toReqType = function () {
            var TReq = generateTReq(v.TReq);
            if (!TReq) {
                return '';
            }
            return TReq;
        };
        // const toRespType = () => {
        //   const TResp = v.TResp?.toType(false);
        //   if (!TResp) {
        //     return null;
        //   }
        //   return TResp;
        // };
        var toRequestInputs = function () {
            var getRequestBody = function () {
                if (!lodash_1.isEmpty(v.bodyParams)) {
                    return v.bodyParams;
                }
                return v.contentType && hasRequestBody(v.TReq) ? ['requestBody'] : '';
            };
            var list = lodash_1.compact(__spreadArray(__spreadArray(__spreadArray([], __read(v.pathParams)), __read(v.queryParams)), __read(getRequestBody())));
            return lodash_1.isEmpty(list) ? '' : toRequestParams(list);
        };
        return "\n" + addComments(v, options === null || options === void 0 ? void 0 : options.withComments) + "\nexport function " + v.operationId + " (" + toRequestInputs() + (toRequestInputs() ? ':' : '') + toReqType() + ") {\n  return {" + toUrl() + toMethod() + toRequestBody() + toQueryParams() + toHeaders() + "};\n}\n";
    })
        .join('');
};
var addComments = function (v, withComments) {
    var summaryComment = withComments && v.summary ? "* " + v.summary : '';
    var deprecatedComment = v.deprecated
        ? "* @deprecated " + v.operationId
        : '';
    var comments = [summaryComment, deprecatedComment].filter(function (c) { return !!c; });
    return lodash_1.isEmpty(comments)
        ? ''
        : "/**\n  " + comments.join('\\n') + "\n  */";
};
var printTypes = function (decls) {
    return lodash_1.keys(decls)
        .sort()
        .map(function (k) {
        var expr = decls[k].kind === createRegister_1.DeclKinds.type ? '=' : '';
        var semi = decls[k].kind === createRegister_1.DeclKinds.type ? ';' : '';
        return "export " + decls[k].kind + " " + decls[k].name + " " + expr + " " + decls[k].type.toType() + semi;
    })
        .join('\n\n');
};
var generateTReq = function (TReq) {
    if (lodash_1.isEmpty(TReq)) {
        return;
    }
    function gen(obj) {
        return objToTypeStr_1.objToTypeStr(lodash_1.mapValues(obj, function (v) {
            if (!v.toType) {
                return gen(v);
            }
            return v.toType(false);
        }));
    }
    return gen(TReq);
};
var toRequestParams = function (data) {
    return !lodash_1.isEmpty(data) ? "{\n " + data.join(',\n') + " \n}" : undefined;
};
//# sourceMappingURL=print.js.map