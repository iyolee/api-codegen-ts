import { find, isEmpty } from 'lodash';
import { CustomSchema } from '../types/common';

export const shouldUseExtends = (schemas: CustomSchema): boolean =>
  !!find(schemas, (schema) => schema.$ref) &&
  !!find(schemas, (schema) => !isEmpty(schema.properties));
