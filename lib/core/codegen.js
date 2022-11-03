"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.codegen = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var js_yaml_1 = __importDefault(require("js-yaml"));
var lodash_1 = require("lodash");
var constants_1 = require("../constants");
var getCodegenConfig_1 = require("./getCodegenConfig");
var hasHttpOrHttps_1 = require("../utils/hasHttpOrHttps");
var getFilename_1 = require("../utils/getFilename");
var toJSONObj_1 = require("../utils/toJSONObj");
var getUnifiedInputs_1 = require("../utils/getUnifiedInputs");
var fetchRemoteSpec_1 = require("../utils/fetchRemoteSpec");
var print_1 = require("./print");
var scan_1 = require("./scan");
var codegen = function (codegenConfig) {
    if (codegenConfig === void 0) { codegenConfig = getCodegenConfig_1.getCodegenConfig(); }
    var apiSpecsPaths = codegenConfig.apiSpecsPaths;
    if (lodash_1.isEmpty(apiSpecsPaths)) {
        console.error(constants_1.ERROR_MESSAGES.EMPTY_API_SPECS_PATHS);
        return;
    }
    apiSpecsPaths.forEach(function (item) {
        hasHttpOrHttps_1.hasHttpOrHttps(item.path)
            ? handleRemoteApiSpec(item, codegenConfig)
            : handleLocalApiSpec(item, codegenConfig);
    });
};
exports.codegen = codegen;
function handleRemoteApiSpec(item, codegenConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, fileType, getResponseData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetchRemoteSpec_1.fetchRemoteSpec(item.path)];
                case 1:
                    _a = (_b.sent()) || {}, data = _a.data, fileType = _a.fileType;
                    getResponseData = function () { return data; };
                    covertAndWrite(fileType, getResponseData, codegenConfig, item.name);
                    return [2 /*return*/];
            }
        });
    });
}
function handleLocalApiSpec(item, codegenConfig) {
    var fileType = path.extname(item.path).split('.')[1];
    var getFileStr = function () { return fs.readFileSync(item.path, 'utf8'); };
    covertAndWrite(fileType, getFileStr, codegenConfig, item.name);
}
function covertAndWrite(fileType, getData, codegenConfig, filename) {
    if (fileType === void 0) { fileType = ''; }
    if (!fileType) {
        return;
    }
    var validFileType = ['json', 'yaml', 'yml'];
    if (!validFileType.includes(fileType)) {
        console.log(constants_1.ERROR_MESSAGES.INVALID_FILE_EXT_ERROR);
        process.exit(1);
    }
    var data = getData();
    if (isJSON(fileType)) {
        writeSpecToFile(toJSONObj_1.toJSONObj(data, constants_1.ERROR_MESSAGES.INVALID_JSON_FILE_ERROR), codegenConfig, filename);
        return;
    }
    try {
        writeSpecToFile(js_yaml_1.default.load(data), codegenConfig, filename);
    }
    catch (e) {
        console.log(e);
    }
}
function writeSpecToFile(spec, codegenConfig, filename) {
    var outputFolder = codegenConfig.outputFolder, requestCreateLib = codegenConfig.requestCreateLib, requestCreateMethod = codegenConfig.requestCreateMethod, options = codegenConfig.options;
    if (!spec) {
        return;
    }
    var fileHeader = "// This file was generated via api-codegen-ts https://github.com/iyolee/api-codegen-ts\n\n";
    fileHeader += "// Don't modify the file manually\n\n";
    if (options === null || options === void 0 ? void 0 : options.eslintDisable) {
        fileHeader += "/* eslint-disable */\n\n";
    }
    if (requestCreateLib || requestCreateMethod) {
        fileHeader += "import { " + requestCreateMethod + " } from '" + requestCreateLib + "';\n\n";
    }
    var _a = scan_1.scan(spec, options), clientConfigs = _a.clientConfigs, decls = _a.decls;
    var fileStr = fileHeader + " " + print_1.printOutputs(clientConfigs, decls, requestCreateMethod, options);
    var basePath = getUnifiedInputs_1.getUnifiedInputs(spec).basePath;
    write(outputFolder || constants_1.DEFAULT_OUTPUT_DIR, "./" + (filename || getFilename_1.getFilename(basePath)), fileStr);
}
function write(output, filename, str) {
    if (!fs.existsSync(output)) {
        fs.mkdirSync(output);
    }
    fs.writeFileSync(path.resolve(output, "./" + filename + ".ts"), str, 'utf-8');
}
function isJSON(ext) {
    return ext.includes('json');
}
//# sourceMappingURL=codegen.js.map