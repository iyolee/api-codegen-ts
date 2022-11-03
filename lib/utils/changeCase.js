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
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeKeyCase = exports.changeParametersCase = exports.toLine = exports.toHump = void 0;
// 下划线转换驼峰
function toHump(name) {
    if (typeof name !== 'string')
        return name;
    return name.replace(/\_(\w)/g, function (_, letter) {
        return letter.toUpperCase();
    });
}
exports.toHump = toHump;
// 驼峰转换下划线
function toLine(name) {
    if (typeof name !== 'string')
        return name;
    return name.replace(/([A-Z])/g, '_$1').toLowerCase();
}
exports.toLine = toLine;
function changeParametersCase(data, type) {
    if (!Array.isArray(data))
        return data;
    var res = (data || []).map(function (item) {
        if (type === 'camel') {
            return __assign(__assign({}, item), { name: toHump(item.name) });
        }
        else if (type === 'snake') {
            return __assign(__assign({}, item), { name: toLine(item.name) });
        }
        return item;
    });
    return res;
}
exports.changeParametersCase = changeParametersCase;
function changeKeyCase(key, type) {
    if (typeof key !== 'string')
        return key;
    var res = key;
    if (type === 'camel') {
        res = toHump(key);
    }
    else if (type === 'snake') {
        res = toLine(key);
    }
    return res;
}
exports.changeKeyCase = changeKeyCase;
//# sourceMappingURL=changeCase.js.map