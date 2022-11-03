import { CustomSchema } from '../types/common';

export const isObj = (s: CustomSchema) => s.type === 'object' || s.properties;
