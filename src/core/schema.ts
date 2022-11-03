import { filter, isArray, isEmpty, map, reduce } from 'lodash';
import { IReference, ISchema } from '../types/openApi';
import { CustomType, Obj, Type } from './type';
import { CustomSchema, ScanOptions } from '../types/common';
import { createRegister } from './createRegister';
import { isObj } from '../utils/isObj';
import { shouldUseExtends } from '../utils/shouldUseExtends';
import { toCapitalCase } from '../utils/toCapitalCase';
import { changeKeyCase } from '../utils/changeCase';

export class Schema {
  private type: Type;
  private options: ScanOptions;

  constructor(register: ReturnType<typeof createRegister>, options?: ScanOptions | undefined) {
    this.type = new Type(register);
    this.options = options || {};
  }

  public convert(schema: CustomSchema, id?: string): CustomType {
    const name = id ? toCapitalCase(id) : id;
    const oneOf = (schema as ISchema).oneOf || (schema as ISchema).anyOf;
    if (oneOf) {
      return this.type.oneOf(map(oneOf, (v) => this.convert(v)));
    }

    const allOf = (schema as ISchema).allOf;
    if (allOf) {
      return this.handleAllOf(allOf, name);
    }

    if (schema.items) {
      return this.type.array(this.handleItems(schema.items, name));
    }

    if (schema.$ref) {
      return this.type.ref((schema as IReference).$ref);
    }

    if (schema.enum) {
      return this.type.enum(schema.enum, name, schema.description);
    }

    if (isObj(schema)) {
      return schema.properties || schema.additionalProperties
        ? this.type.object(...this.handleObject(schema, name))
        : this.type.object('object');
    }

    if (schema.type === 'string') {
      return schema.format === 'binary' ? this.type.file(schema.description) : this.type.string(schema.description);
    }

    if (schema.type === 'boolean') {
      return this.type.boolean(schema.description);
    }

    if (schema.type === 'integer' || schema.type === 'number') {
      return this.type.number(schema.description);
    }

    if (schema.type === 'file') {
      return this.type.file(schema.description);
    }

    return this.type.null(schema.description);
  }

  private handleAllOf(schemas: Array<CustomSchema>, name?: string) {
    const getObj = (): Obj | undefined => {
      const objs: any[] = filter(schemas, (s) => isObj(s));
      if (isEmpty(objs)) {
        return;
      }

      return this.convert(
        reduce(objs, (res, item) => ({
          ...res,
          properties: {
            ...res.properties,
            ...item.properties
          }
        })),
        name
      ) as Obj;
    };

    const otherTypes: any[] = filter(schemas, (s) => !isObj(s)).map((v) =>
      !isEmpty(v) ? this.convert(v, name) : undefined
    );

    return this.type.allOf(getObj(), otherTypes, shouldUseExtends(schemas));
  }

  private handleItems(
    items: CustomSchema | IReference | CustomSchema[],
    name?: string
  ): CustomType | CustomType[] {
    if (isArray(items)) {
      return map(items, (v) => this.handleItems(v, name)) as CustomType[];
    }
    return this.convert(items, name);
  }

  private handleObject(schema: CustomSchema, name?: string) {
    const properties = reduce(
      schema.properties,
      (res, v, k) => {
        const isRequired = schema.required && schema.required.includes(k);
        const fk = changeKeyCase(k, this.options?.caseType);
        return {
          ...res,
          [`${fk}${isRequired ? '' : '?'}`]: this.convert(
            v,
            `${name}${toCapitalCase(fk)}`
          )
        };
      },
      {}
    );

    const getAdditionalProperties = () => {
      if (!schema.additionalProperties) {
        return;
      }
      if (schema.additionalProperties === true) {
        return this.type.any();
      }
      return this.convert(schema.additionalProperties as CustomSchema, name);
    };

    return [properties, getAdditionalProperties()] as const;
  }
}
