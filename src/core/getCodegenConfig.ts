import * as fs from 'fs';
import * as path from 'path';
import { ERROR_MESSAGES, CONFIG_FILE_NAME } from '../constants';
import { CodegenConfig } from '../types/common';

export const getCodegenConfig = (configPath?: string): CodegenConfig => {
  const codegenConfigPath = configPath || path.resolve(CONFIG_FILE_NAME);
  if (!fs.existsSync(codegenConfigPath)) {
    console.log(ERROR_MESSAGES.NOT_FOUND_CONFIG_FILE);
    process.exit(1);
  }
  return require(codegenConfigPath);
};
