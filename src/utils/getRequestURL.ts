import { chain } from 'lodash';
import { CaseType } from '../types/common';
import { changeKeyCase } from './changeCase';

export const getRequestURL = (pathName: string, basePath?: string, caseType?: CaseType) => {
  const isPathParam = (str: string) => str.startsWith('{');
  const path = chain(pathName)
    .split('/')
    .map((p) => {
      let fp = changeKeyCase(p, caseType);
      return (isPathParam(p) ? `$${fp}` : p)
    })
    .join('/')
    .value();

  if (basePath === '/') {
    return path;
  }

  if (path === '/') {
    return basePath || path;
  }

  return `${basePath}${path}`;
};
