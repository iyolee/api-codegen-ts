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
exports.Schema = void 0;
var lodash_1 = require("lodash");
var type_1 = require("./type");
var isObj_1 = require("../utils/isObj");
var shouldUseExtends_1 = require("../utils/shouldUseExtends");
var toCapitalCase_1 = require("../utils/toCapitalCase");
var changeCase_1 = require("../utils/changeCase");
var Schema = /** @class */ (function () {
    function Schema(register, options) {
        this.type = new type_1.Type(register);
        this.options = options || {};
    }
    Schema.prototype.convert = function (schema, id) {
        var _a;
        var _this = this;
        var name = id ? toCapitalCase_1.toCapitalCase(id) : id;
        var oneOf = schema.oneOf || schema.anyOf;
        if (oneOf) {
            return this.type.oneOf(lodash_1.map(oneOf, function (v) { return _this.convert(v); }));
        }
        var allOf = schema.allOf;
        if (allOf) {
            return this.handleAllOf(allOf, name);
        }
        if (schema.items) {
            return this.type.array(this.handleItems(schema.items, name));
        }
        if (schema.$ref) {
            return this.type.ref(schema.$ref);
        }
        if (schema.enum) {
            return this.type.enum(schema.enum, name, schema.description);
        }
        if (isObj_1.isObj(schema)) {
            return schema.properties || schema.additionalProperties
                ? (_a = this.type).object.apply(_a, __spreadArray([], __read(this.handleObject(schema, name)))) : this.type.object('object');
        }
        if (schema.type === 'string') {
            return schema.format === 'binary' ? this.type.file(schema.description) : this.type.string(schema.description);
        }
        if (schema.type === 'boolean') {
            return this.type.boolean(schema.description);
        }
        if (schema.type === 'integer' || schema.type === 'number') {
            return this.type.number(schema.description);
        }
        if (schema.type === 'file') {
            return this.type.file(schema.description);
        }
        return this.type.null(schema.description);
    };
    Schema.prototype.handleAllOf = function (schemas, name) {
        var _this = this;
        var getObj = function () {
            var objs = lodash_1.filter(schemas, function (s) { return isObj_1.isObj(s); });
            if (lodash_1.isEmpty(objs)) {
                return;
            }
            return _this.convert(lodash_1.reduce(objs, function (res, item) { return (__assign(__assign({}, res), { properties: __assign(__assign({}, res.properties), item.properties) })); }), name);
        };
        var otherTypes = lodash_1.filter(schemas, function (s) { return !isObj_1.isObj(s); }).map(function (v) {
            return !lodash_1.isEmpty(v) ? _this.convert(v, name) : undefined;
        });
        return this.type.allOf(getObj(), otherTypes, shouldUseExtends_1.shouldUseExtends(schemas));
    };
    Schema.prototype.handleItems = function (items, name) {
        var _this = this;
        if (lodash_1.isArray(items)) {
            return lodash_1.map(items, function (v) { return _this.handleItems(v, name); });
        }
        return this.convert(items, name);
    };
    Schema.prototype.handleObject = function (schema, name) {
        var _this = this;
        var properties = lodash_1.reduce(schema.properties, function (res, v, k) {
            var _a;
            var _b;
            var isRequired = schema.required && schema.required.includes(k);
            var fk = changeCase_1.changeKeyCase(k, (_b = _this.options) === null || _b === void 0 ? void 0 : _b.caseType);
            return __assign(__assign({}, res), (_a = {}, _a["" + fk + (isRequired ? '' : '?')] = _this.convert(v, "" + name + toCapitalCase_1.toCapitalCase(fk)), _a));
        }, {});
        var getAdditionalProperties = function () {
            if (!schema.additionalProperties) {
                return;
            }
            if (schema.additionalProperties === true) {
                return _this.type.any();
            }
            return _this.convert(schema.additionalProperties, name);
        };
        return [properties, getAdditionalProperties()];
    };
    return Schema;
}());
exports.Schema = Schema;
//# sourceMappingURL=schema.js.map