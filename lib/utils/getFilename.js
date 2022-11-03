"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilename = void 0;
var getFilename = function (basePath) {
    return basePath ? "" + basePath.split('/').join('.').slice(1) : '';
};
exports.getFilename = getFilename;
//# sourceMappingURL=getFilename.js.map