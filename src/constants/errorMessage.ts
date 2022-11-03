import { CONFIG_FILE_NAME } from './config';

export const ERROR_MESSAGES = {
  INVALID_FILE_EXT_ERROR:
    'The swagger/openapi file type you provided in `apiSpecsPaths` is invalid, currently only allow .json/.yaml/.yml.',
  INVALID_JSON_FILE_ERROR: 'Your json file is invalid, please check it!',
  FETCH_CLIENT_FAILED_ERROR: `Fetch client failed! Please check your network or ${CONFIG_FILE_NAME} file.`,
  EMPTY_API_SPECS_PATHS: `The \`apiSpecsPaths\` cannot be empty! Please input it in your ${CONFIG_FILE_NAME} file.`,
  EMPTY_PATH_PROPERTY: `The \`path\` cannot be empty! Please input it in \`apiSpecsPaths\`.`,
  NOT_FOUND_CONFIG_FILE: `Cannot found config file ${CONFIG_FILE_NAME}.\nPlease generate ${CONFIG_FILE_NAME} with the \`cgen init\` command first.`
};
