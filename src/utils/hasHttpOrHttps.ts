import { ERROR_MESSAGES } from '../constants/errorMessage';

export const hasHttpOrHttps = (path: string) => {
  if (!path) {
    console.log(ERROR_MESSAGES.EMPTY_PATH_PROPERTY);
    process.exit(1);
  }

  if (!/(http|https):\/\/([\w.]+\/?)\S*/.test(path)) return false;

  const url = new URL(path);
  const protocol = url.protocol;
  return protocol && /https?:/.test(protocol);
};
