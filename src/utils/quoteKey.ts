import { trimEnd, indexOf } from 'lodash';

export const quoteKey = (k: string) => {
  const isOptional = indexOf(k, '?') > -1;
  return `'${trimEnd(k, '?')}'${isOptional ? '?' : ''}`;
};
