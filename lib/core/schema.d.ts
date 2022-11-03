import { CustomType } from './type';
import { CustomSchema, ScanOptions } from '../types/common';
import { createRegister } from './createRegister';
export declare class Schema {
    private type;
    private options;
    constructor(register: ReturnType<typeof createRegister>, options?: ScanOptions | undefined);
    convert(schema: CustomSchema, id?: string): CustomType;
    private handleAllOf;
    private handleItems;
    private handleObject;
}
