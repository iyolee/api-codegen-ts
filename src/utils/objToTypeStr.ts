import { Dictionary, isEmpty, map } from 'lodash';
import { quoteKey } from './quoteKey';

export const objToTypeStr = (obj: Dictionary<any>) => {
  if (isEmpty(obj)) {
    return '';
  }
  const list = map<string, any>(
    obj,
    (v: any, k: string) => `${quoteKey(k)}: ${v};`
  );
  return (
    obj &&
    `{
        ${list.sort().join('\n')}
      }`
  );
};
