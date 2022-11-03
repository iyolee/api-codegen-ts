import { ERROR_MESSAGES } from '../constants/errorMessage';

export function toJSONObj(
  input: unknown,
  errorMsg: string = ERROR_MESSAGES.INVALID_JSON_FILE_ERROR,
  output: (message: string) => void = console.error
) {
  if (typeof input === 'object') {
    return input;
  }

  if (typeof input === 'string') {
    try {
      return JSON.parse(input);
    } catch (e) {
      output(errorMsg);
      return;
    }
  }

  return;
}
