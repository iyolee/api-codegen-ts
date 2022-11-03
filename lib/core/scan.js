"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scan = void 0;
var lodash_1 = require("lodash");
var schema_1 = require("./schema");
var common_1 = require("../types/common");
var createRegister_1 = require("./createRegister");
var createClientConfigs_1 = require("./createClientConfigs");
var shouldUseExtends_1 = require("../utils/shouldUseExtends");
var toCapitalCase_1 = require("../utils/toCapitalCase");
var getUnifiedInputs_1 = require("../utils/getUnifiedInputs");
var scan = function (data, options) {
    var register = createRegister_1.createRegister(options === null || options === void 0 ? void 0 : options.typeWithPrefix);
    var schemaHandler = new schema_1.Schema(register, options);
    var _a = getUnifiedInputs_1.getUnifiedInputs(data), dataType = _a.dataType, basePath = _a.basePath, paths = _a.paths, schemas = _a.schemas, parameters = _a.parameters, responses = _a.responses, requestBodies = _a.requestBodies;
    lodash_1.keys(schemas).forEach(function (k) {
        var name = toCapitalCase_1.toCapitalCase(k);
        register.setDecl(name, schemaHandler.convert(schemas[k], name), getDeclarationType(schemas[k]));
    });
    register.setData(['parameters'], parameters);
    register.setData(['responses'], responses);
    register.setData(['requestBodies'], requestBodies);
    var clientConfigs = dataType === common_1.DataType.swagger
        ? createClientConfigs_1.getClientConfigsV2(paths, basePath, register, options)
        : createClientConfigs_1.getClientConfigsV3(paths, basePath, register, options);
    var decls = register.getDecls();
    if (options === null || options === void 0 ? void 0 : options.typeWithPrefix) {
        register.renameAllRefs(function (key) { return decls[key].name; });
    }
    return { clientConfigs: clientConfigs, decls: decls, dataType: dataType };
};
exports.scan = scan;
var getDeclarationType = function (schema) {
    if ((schema === null || schema === void 0 ? void 0 : schema.type) === 'object' ||
        (schema === null || schema === void 0 ? void 0 : schema.properties) ||
        ((schema === null || schema === void 0 ? void 0 : schema.allOf) && shouldUseExtends_1.shouldUseExtends(schema === null || schema === void 0 ? void 0 : schema.allOf))) {
        return createRegister_1.DeclKinds.interface;
    }
    return createRegister_1.DeclKinds.type;
};
//# sourceMappingURL=scan.js.map