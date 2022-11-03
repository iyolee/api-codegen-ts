import fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import { program } from 'commander';
import { codegen, getCodegenConfig, importSpec } from './core';
import {
  CONFIG_FILE_NAME,
  DEFAULT_CODEGEN_CONFIG,
  DEFAULT_OUTPUT_DIR
} from './constants';
import { isEmptyDir } from './utils/isEmptyDir';
import { clearDir } from './utils/clearDir';

const pkg = require('../package.json');

program
  .version(pkg.version, '-v, --version')
  .description('generate TypeScript code')
  .action(() => {
    const codegenConfig = getCodegenConfig();
    console.log(
      `Generate code to folder ${codegenConfig.outputFolder} successfully!`
    );
    codegen(codegenConfig);
  });

program
  .command('init')
  .description(`create ${CONFIG_FILE_NAME} file`)
  .action(() => {
    const file = path.resolve(process.cwd(), `./${CONFIG_FILE_NAME}`);

    if (fs.existsSync(file)) {
      console.log(
        `Will do nothing, because you've already have a ${CONFIG_FILE_NAME} file in the root directory.`
      );
    } else {
      fs.writeFileSync(
        file,
        prettier.format(JSON.stringify(DEFAULT_CODEGEN_CONFIG), {
          parser: 'json'
        })
      );
    }
  });

// 试验性功能
program
  .command('import')
  .description(`import API file`)
  .requiredOption('-i, --input resource <path>', 'import file path')
  .option('-o, --output [output_dir]', 'output file by path')
  .option('-p, --prefix [base_path]', 'path prefix')
  .option('-f, --force', 'forces a directory to be emptied')
  .action((options) => {
    const importPath = options?.input ?? '';
    const outputDir = options?.output ?? DEFAULT_OUTPUT_DIR;
    const basePath = options?.prefix ?? '';
    const forceClearDir = options?.force ?? false;
    // 保证目录是空目录
    if (fs.existsSync(outputDir) && !isEmptyDir(outputDir) && !forceClearDir) {
      console.log(
        `Will do nothing, because you've already have a ${outputDir} directory in the root directory.\n` +
          `Please empty the ${outputDir} directory manually or add the parameter \`-f\`.`
      );
      process.exit(1);
    } else {
      clearDir(outputDir);
    }
    importSpec(importPath, outputDir, basePath);
  });

program.parse(process.argv);
