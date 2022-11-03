"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var prettier_1 = __importDefault(require("prettier"));
var commander_1 = require("commander");
var core_1 = require("./core");
var constants_1 = require("./constants");
var isEmptyDir_1 = require("./utils/isEmptyDir");
var clearDir_1 = require("./utils/clearDir");
var pkg = require('../package.json');
commander_1.program
    .version(pkg.version, '-v, --version')
    .description('generate TypeScript code')
    .action(function () {
    var codegenConfig = core_1.getCodegenConfig();
    console.log("Generate code to folder " + codegenConfig.outputFolder + " successfully!");
    core_1.codegen(codegenConfig);
});
commander_1.program
    .command('init')
    .description("create " + constants_1.CONFIG_FILE_NAME + " file")
    .action(function () {
    var file = path_1.default.resolve(process.cwd(), "./" + constants_1.CONFIG_FILE_NAME);
    if (fs_1.default.existsSync(file)) {
        console.log("Will do nothing, because you've already have a " + constants_1.CONFIG_FILE_NAME + " file in the root directory.");
    }
    else {
        fs_1.default.writeFileSync(file, prettier_1.default.format(JSON.stringify(constants_1.DEFAULT_CODEGEN_CONFIG), {
            parser: 'json'
        }));
    }
});
// 试验性功能
commander_1.program
    .command('import')
    .description("import API file")
    .requiredOption('-i, --input resource <path>', 'import file path')
    .option('-o, --output [output_dir]', 'output file by path')
    .option('-p, --prefix [base_path]', 'path prefix')
    .option('-f, --force', 'forces a directory to be emptied')
    .action(function (options) {
    var _a, _b, _c, _d;
    var importPath = (_a = options === null || options === void 0 ? void 0 : options.input) !== null && _a !== void 0 ? _a : '';
    var outputDir = (_b = options === null || options === void 0 ? void 0 : options.output) !== null && _b !== void 0 ? _b : constants_1.DEFAULT_OUTPUT_DIR;
    var basePath = (_c = options === null || options === void 0 ? void 0 : options.prefix) !== null && _c !== void 0 ? _c : '';
    var forceClearDir = (_d = options === null || options === void 0 ? void 0 : options.force) !== null && _d !== void 0 ? _d : false;
    // 保证目录是空目录
    if (fs_1.default.existsSync(outputDir) && !isEmptyDir_1.isEmptyDir(outputDir) && !forceClearDir) {
        console.log("Will do nothing, because you've already have a " + outputDir + " directory in the root directory.\n" +
            ("Please empty the " + outputDir + " directory manually or add the parameter `-f`."));
        process.exit(1);
    }
    else {
        clearDir_1.clearDir(outputDir);
    }
    core_1.importSpec(importPath, outputDir, basePath);
});
commander_1.program.parse(process.argv);
//# sourceMappingURL=index.js.map