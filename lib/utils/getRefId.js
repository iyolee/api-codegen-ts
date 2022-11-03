"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefId = void 0;
var getRefId = function (str) {
    if (!str) {
        return '';
    }
    var list = str.split('/');
    return list[list.length - 1];
};
exports.getRefId = getRefId;
//# sourceMappingURL=getRefId.js.map