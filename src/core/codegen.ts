import * as fs from 'fs';
import * as path from 'path';
import yaml from 'js-yaml';
import { isEmpty } from 'lodash';
import { ERROR_MESSAGES, DEFAULT_OUTPUT_DIR } from '../constants';
import { CustomSpec, CodegenConfig, ApiSpecsPath } from '../types/common';
import { getCodegenConfig } from './getCodegenConfig';
import { hasHttpOrHttps } from '../utils/hasHttpOrHttps';
import { getFilename } from '../utils/getFilename';
import { toJSONObj } from '../utils/toJSONObj';
import { getUnifiedInputs } from '../utils/getUnifiedInputs';
import { fetchRemoteSpec } from '../utils/fetchRemoteSpec';
import { printOutputs } from './print';
import { scan } from './scan';

export const codegen = (codegenConfig = getCodegenConfig()) => {
  const { apiSpecsPaths } = codegenConfig;

  if (isEmpty(apiSpecsPaths)) {
    console.error(ERROR_MESSAGES.EMPTY_API_SPECS_PATHS);
    return;
  }

  apiSpecsPaths.forEach((item) => {
    hasHttpOrHttps(item.path)
      ? handleRemoteApiSpec(item, codegenConfig)
      : handleLocalApiSpec(item, codegenConfig);
  });
};

async function handleRemoteApiSpec(
  item: ApiSpecsPath,
  codegenConfig: CodegenConfig
) {
  const { data, fileType } = (await fetchRemoteSpec(item.path)) || {};
  const getResponseData = () => data;

  covertAndWrite(fileType, getResponseData, codegenConfig, item.name);
}

function handleLocalApiSpec(item: ApiSpecsPath, codegenConfig: CodegenConfig) {
  const fileType = path.extname(item.path).split('.')[1];
  const getFileStr = () => fs.readFileSync(item.path, 'utf8');

  covertAndWrite(fileType, getFileStr, codegenConfig, item.name);
}

function covertAndWrite(
  fileType: string = '',
  getData: () => string,
  codegenConfig: CodegenConfig,
  filename?: string
) {
  if (!fileType) {
    return;
  }

  const validFileType = ['json', 'yaml', 'yml'];

  if (!validFileType.includes(fileType)) {
    console.log(ERROR_MESSAGES.INVALID_FILE_EXT_ERROR);
    process.exit(1);
  }

  const data = getData();

  if (isJSON(fileType)) {
    writeSpecToFile(
      toJSONObj(data, ERROR_MESSAGES.INVALID_JSON_FILE_ERROR),
      codegenConfig,
      filename
    );
    return;
  }

  try {
    writeSpecToFile(yaml.load(data) as CustomSpec, codegenConfig, filename);
  } catch (e) {
    console.log(e);
  }
}

function writeSpecToFile(
  spec: CustomSpec,
  codegenConfig: CodegenConfig,
  filename?: string
) {
  const { outputFolder, requestCreateLib, requestCreateMethod, options } =
    codegenConfig;

  if (!spec) {
    return;
  }
  let fileHeader = `// This file was generated via api-codegen-ts https://github.com/iyolee/api-codegen-ts\n\n`;
  fileHeader += `// Don't modify the file manually\n\n`;
  if (options?.eslintDisable) {
    fileHeader += `/* eslint-disable */\n\n`;
  }
  if (requestCreateLib || requestCreateMethod) {
    fileHeader += `import { ${requestCreateMethod} } from '${requestCreateLib}';\n\n`;
  }
  const { clientConfigs, decls } = scan(spec, options);
  const fileStr = `${fileHeader} ${printOutputs(
    clientConfigs,
    decls,
    requestCreateMethod,
    options
  )}`;
  const { basePath } = getUnifiedInputs(spec);
  write(
    outputFolder || DEFAULT_OUTPUT_DIR,
    `./${filename || getFilename(basePath)}`,
    fileStr
  );
}

function write(output: string, filename: string, str: string) {
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }

  fs.writeFileSync(path.resolve(output, `./${filename}.ts`), str, 'utf-8');
}

function isJSON(ext: string) {
  return ext.includes('json');
}
