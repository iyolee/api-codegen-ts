import { camelCase } from 'lodash';

export const toCapitalCase = (str?: string): string => {
  if (!str) {
    return '';
  }
  const camelStr = camelCase(str);
  return `${camelStr.charAt(0).toUpperCase()}${camelStr.slice(1)}`;
};
