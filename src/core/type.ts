import { compact, isArray, keys, map, some, uniqueId } from 'lodash';
import { createRegister, DeclKinds } from './createRegister';
import { quoteKey } from '../utils/quoteKey';
import { toCapitalCase } from '../utils/toCapitalCase';

export type CustomType = Ref | Obj | Arr | Enum | OneOf | AllOf | BasicType;

interface TypeFactory {
  toType: () => string;
  toDescription: () => string;
}

const getRefId = (str?: string): string => {
  if (!str) {
    return '';
  }
  const list = str.split('/');
  return list[list.length - 1];
};

const isNumberLike = (n: any) => !isNaN(parseFloat(n)) && isFinite(n);

class BasicType implements TypeFactory {
  static type(name: string, description?: string) {
    return new BasicType(name, description);
  }

  constructor(private name: string, private description?: string) {}

  toType() {
    return this.name;
  }

  toDescription() {
    return this.description ?? '';
  }
}

export class Enum implements TypeFactory {
  constructor(
    private name: string,
    private value?: any[],
    private kind?: DeclKinds,
    private description?: string
  ) {}

  toType(): string {
    if (this.value) {
      if (this.kind === DeclKinds.type) {
        return `${this.value
          .map((v) => {
            if (typeof v === 'number') {
              return v;
            }
            return `"${v}"`;
          })
          .join('|')}`;
      }
      return `{${this.value.map((v) => `'${v}' = '${v}',`).join('\n')}}`;
    }
    return `(keyof typeof ${this.name})`;
  }

  toDescription(): string {
    return this.description ?? '';
  }
}

class OneOf implements TypeFactory {
  constructor(private types: CustomType[]) {}

  toType(): string {
    return `(${map(this.types, (type) => type.toType()).join('|')})`;
  }

  toDescription(): string {
    return '';
  }
}

class AllOf implements TypeFactory {
  constructor(
    private obj: Obj | undefined,
    private otherTypes: Omit<CustomType, 'Obj'>[],
    private useExtends?: boolean
  ) {}

  toType(useExtends: boolean | undefined = this.useExtends): string {
    if (useExtends) {
      return `extends ${compact(this.otherTypes)
        .map((v) => v.toType())
        .join(',')} ${this.obj?.toType()}`;
    }
    return `${map(compact([this.obj, ...this.otherTypes]), (type) =>
      type.toType()
    ).join('&')}`;
  }
  toDescription(): string {
    return '';
  }
}

export class Arr implements TypeFactory {
  constructor(private data: CustomType[] | CustomType) {}

  toType(): string {
    if (isArray(this.data)) {
      return `[${map(this.data as CustomType[], (v) => v.toType())}]`;
    }
    return `${(this.data as CustomType).toType()}[]`;
  }
  toDescription(): string {
    return '';
  }
}

export class Ref implements TypeFactory {
  alias: string | undefined;

  constructor(private name: string) {}

  rename(alias: string) {
    this.alias = alias;
  }

  toType(): string {
    return this.alias || this.name;
  }

  toDescription(): string {
    return '';
  }
}

export class Obj implements TypeFactory {
  constructor(
    private props: { [key: string]: CustomType } | string,
    private additionalProps?: CustomType
  ) {}

  toType(): string {
    if (this.props === 'object') {
      return '{[key:string]:any}';
    }

    const handler = (
      props: { [key: string]: CustomType } | CustomType,
      additionalProps?: CustomType
    ): string => {
      if (props?.toType) {
        return (props as CustomType).toType();
      }

      const data = keys(props)
        .sort()
        .map((k) => {
          const type = (props as { [key: string]: CustomType })[k].toType();

          const desc = (props as { [key: string]: CustomType })[
            k
          ].toDescription();

          const comment = desc ? `/* ${desc} */\n` : '';

          return `\n${comment}${quoteKey(k)}: ${type};\n`;
        })
        .join('');

      return additionalProps
        ? `{${data}[key:string]: ${additionalProps.toType()}}`
        : `{${data}}`;
    };

    return handler(
      this.props as { [key: string]: CustomType },
      this.additionalProps
    );
  }

  toDescription(): string {
    return '';
  }
}

const hasNumber = (list: any[]) => some(list, (v) => isNumberLike(v));

export class Type {
  constructor(private register: ReturnType<typeof createRegister>) {}

  enum(value: any[], id: string = uniqueId('Enum'), desc?: string) {
    const kind = hasNumber(value) ? DeclKinds.type : DeclKinds.enum;
    this.register.setDecl(id, new Enum(id, value, kind), kind);

    if (kind === DeclKinds.type) {
      return this.register.setRef(id);
    }

    return new Enum(id, undefined, kind, desc);
  }

  ref($ref: string) {
    const id = toCapitalCase(getRefId($ref));
    return this.register.setRef(id);
  }

  array(types: CustomType | CustomType[]) {
    return new Arr(types);
  }

  oneOf(types: CustomType[]) {
    return new OneOf(types);
  }

  allOf(
    obj: Obj | undefined,
    otherTypes: Omit<CustomType, 'Obj'>[],
    useExtends?: boolean
  ) {
    return new AllOf(obj, otherTypes, useExtends);
  }

  object(
    props: { [key: string]: CustomType } | string,
    additionalProps?: CustomType,
    description?: string
  ) {
    return new Obj(props, additionalProps);
  }

  boolean(description?: string) {
    return BasicType.type('boolean', description);
  }

  string(description?: string) {
    return BasicType.type('string', description);
  }

  null(description?: string) {
    return BasicType.type('null', description);
  }

  number(description?: string) {
    return BasicType.type('number', description);
  }

  file(description?: string) {
    return BasicType.type('File', description);
  }

  any(description?: string) {
    return BasicType.type('any', description);
  }
}
