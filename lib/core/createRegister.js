"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRegister = exports.DeclKinds = void 0;
var lodash_1 = require("lodash");
var type_1 = require("./type");
var DeclKinds;
(function (DeclKinds) {
    DeclKinds["interface"] = "interface";
    DeclKinds["type"] = "type";
    DeclKinds["enum"] = "enum";
})(DeclKinds = exports.DeclKinds || (exports.DeclKinds = {}));
var withPrefix = function (name, kind) {
    switch (kind) {
        case 'interface':
            return "I" + name;
        case 'type':
            return "T" + name;
        default:
            return name;
    }
};
var createRegister = function (typeWithPrefix) {
    if (typeWithPrefix === void 0) { typeWithPrefix = false; }
    var store = {
        decls: {},
        refs: {},
        parameters: {},
        responses: {},
        requestBodies: {}
    };
    return {
        getDecls: function () {
            return store.decls;
        },
        setDecl: function (id, type, kind) {
            store.decls[id] = {
                type: type,
                kind: kind,
                name: typeWithPrefix ? withPrefix(id, kind) : id
            };
        },
        setRef: function (id) {
            if (store.refs[id]) {
                return store.refs[id];
            }
            var type = new type_1.Ref(id);
            store.refs[id] = type;
            return type;
        },
        getData: function (paths) {
            return lodash_1.get(store, paths);
        },
        setData: function (paths, data) {
            return lodash_1.set(store, paths, data);
        },
        renameAllRefs: function (cb) {
            for (var name_1 in store.refs) {
                if (name_1) {
                    store.refs[name_1].rename(cb(name_1));
                }
            }
        }
    };
};
exports.createRegister = createRegister;
//# sourceMappingURL=createRegister.js.map