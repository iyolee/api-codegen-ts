import { Parameter } from 'swagger-schema-official';
import { CustomType, Ref } from './type';
import { IReference, IRequestBody, IResponse } from '../types/openApi';
export declare enum DeclKinds {
    interface = "interface",
    type = "type",
    enum = "enum"
}
export interface IStore {
    decls: {
        [id: string]: {
            type: CustomType;
            kind: string;
            name: string;
        };
    };
    refs: {
        [id: string]: Ref;
    };
    parameters: {
        [id: string]: Parameter;
    };
    responses: {
        [id: string]: Response | IResponse | IReference;
    };
    requestBodies: {
        [id: string]: IReference | IRequestBody;
    };
}
export declare const createRegister: (typeWithPrefix?: boolean) => {
    getDecls(): {
        [id: string]: {
            type: CustomType;
            kind: string;
            name: string;
        };
    };
    setDecl: (id: string, type: CustomType, kind: string) => void;
    setRef: (id: string) => Ref;
    getData(paths: string[]): any;
    setData(paths: string[], data: any): IStore;
    renameAllRefs: (cb: (newName: string) => string) => void;
};
