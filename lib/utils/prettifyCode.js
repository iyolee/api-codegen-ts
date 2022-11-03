"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettifyCode = void 0;
var prettier_1 = __importDefault(require("prettier"));
var prettifyCode = function (code) {
    return prettier_1.default.format(code, {
        printWidth: 120,
        trailingComma: 'all',
        arrowParens: 'always',
        parser: 'typescript'
    });
};
exports.prettifyCode = prettifyCode;
//# sourceMappingURL=prettifyCode.js.map