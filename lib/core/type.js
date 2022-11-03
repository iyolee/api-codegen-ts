"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = exports.Obj = exports.Ref = exports.Arr = exports.Enum = void 0;
var lodash_1 = require("lodash");
var createRegister_1 = require("./createRegister");
var quoteKey_1 = require("../utils/quoteKey");
var toCapitalCase_1 = require("../utils/toCapitalCase");
var getRefId = function (str) {
    if (!str) {
        return '';
    }
    var list = str.split('/');
    return list[list.length - 1];
};
var isNumberLike = function (n) { return !isNaN(parseFloat(n)) && isFinite(n); };
var BasicType = /** @class */ (function () {
    function BasicType(name, description) {
        this.name = name;
        this.description = description;
    }
    BasicType.type = function (name, description) {
        return new BasicType(name, description);
    };
    BasicType.prototype.toType = function () {
        return this.name;
    };
    BasicType.prototype.toDescription = function () {
        var _a;
        return (_a = this.description) !== null && _a !== void 0 ? _a : '';
    };
    return BasicType;
}());
var Enum = /** @class */ (function () {
    function Enum(name, value, kind, description) {
        this.name = name;
        this.value = value;
        this.kind = kind;
        this.description = description;
    }
    Enum.prototype.toType = function () {
        if (this.value) {
            if (this.kind === createRegister_1.DeclKinds.type) {
                return "" + this.value.map(function (v) { return "\"" + v + "\""; }).join('|');
            }
            return "{" + this.value.map(function (v) { return "'" + v + "' = '" + v + "',"; }).join('\n') + "}";
        }
        return "(keyof typeof " + this.name + ")";
    };
    Enum.prototype.toDescription = function () {
        var _a;
        return (_a = this.description) !== null && _a !== void 0 ? _a : '';
    };
    return Enum;
}());
exports.Enum = Enum;
var OneOf = /** @class */ (function () {
    function OneOf(types) {
        this.types = types;
    }
    OneOf.prototype.toType = function () {
        return "(" + lodash_1.map(this.types, function (type) { return type.toType(); }).join('|') + ")";
    };
    OneOf.prototype.toDescription = function () {
        return '';
    };
    return OneOf;
}());
var AllOf = /** @class */ (function () {
    function AllOf(obj, otherTypes, useExtends) {
        this.obj = obj;
        this.otherTypes = otherTypes;
        this.useExtends = useExtends;
    }
    AllOf.prototype.toType = function (useExtends) {
        var _a;
        if (useExtends === void 0) { useExtends = this.useExtends; }
        if (useExtends) {
            return "extends " + lodash_1.compact(this.otherTypes)
                .map(function (v) { return v.toType(); })
                .join(',') + " " + ((_a = this.obj) === null || _a === void 0 ? void 0 : _a.toType());
        }
        return "" + lodash_1.map(lodash_1.compact(__spreadArray([this.obj], __read(this.otherTypes))), function (type) {
            return type.toType();
        }).join('&');
    };
    AllOf.prototype.toDescription = function () {
        return '';
    };
    return AllOf;
}());
var Arr = /** @class */ (function () {
    function Arr(data) {
        this.data = data;
    }
    Arr.prototype.toType = function () {
        if (lodash_1.isArray(this.data)) {
            return "[" + lodash_1.map(this.data, function (v) { return v.toType(); }) + "]";
        }
        return this.data.toType() + "[]";
    };
    Arr.prototype.toDescription = function () {
        return '';
    };
    return Arr;
}());
exports.Arr = Arr;
var Ref = /** @class */ (function () {
    function Ref(name) {
        this.name = name;
    }
    Ref.prototype.rename = function (alias) {
        this.alias = alias;
    };
    Ref.prototype.toType = function () {
        return this.alias || this.name;
    };
    Ref.prototype.toDescription = function () {
        return '';
    };
    return Ref;
}());
exports.Ref = Ref;
var Obj = /** @class */ (function () {
    function Obj(props, additionalProps) {
        this.props = props;
        this.additionalProps = additionalProps;
    }
    Obj.prototype.toType = function () {
        if (this.props === 'object') {
            return '{[key:string]:any}';
        }
        var handler = function (props, additionalProps) {
            if (props === null || props === void 0 ? void 0 : props.toType) {
                return props.toType();
            }
            var data = lodash_1.keys(props)
                .sort()
                .map(function (k) {
                var type = props[k].toType();
                var desc = props[k].toDescription();
                var comment = desc ? "/* " + desc + " */\n" : '';
                return "\n" + comment + quoteKey_1.quoteKey(k) + ": " + type + ";\n";
            })
                .join('');
            return additionalProps
                ? "{" + data + "[key:string]: " + additionalProps.toType() + "}"
                : "{" + data + "}";
        };
        return handler(this.props, this.additionalProps);
    };
    Obj.prototype.toDescription = function () {
        return '';
    };
    return Obj;
}());
exports.Obj = Obj;
var hasNumber = function (list) { return lodash_1.some(list, function (v) { return isNumberLike(v); }); };
var Type = /** @class */ (function () {
    function Type(register) {
        this.register = register;
    }
    Type.prototype.enum = function (value, id, desc) {
        if (id === void 0) { id = lodash_1.uniqueId('Enum'); }
        var kind = hasNumber(value) ? createRegister_1.DeclKinds.type : createRegister_1.DeclKinds.enum;
        this.register.setDecl(id, new Enum(id, value, kind), kind);
        if (kind === createRegister_1.DeclKinds.type) {
            return this.register.setRef(id);
        }
        return new Enum(id, undefined, kind, desc);
    };
    Type.prototype.ref = function ($ref) {
        var id = toCapitalCase_1.toCapitalCase(getRefId($ref));
        return this.register.setRef(id);
    };
    Type.prototype.array = function (types) {
        return new Arr(types);
    };
    Type.prototype.oneOf = function (types) {
        return new OneOf(types);
    };
    Type.prototype.allOf = function (obj, otherTypes, useExtends) {
        return new AllOf(obj, otherTypes, useExtends);
    };
    Type.prototype.object = function (props, additionalProps, description) {
        return new Obj(props, additionalProps);
    };
    Type.prototype.boolean = function (description) {
        return BasicType.type('boolean', description);
    };
    Type.prototype.string = function (description) {
        return BasicType.type('string', description);
    };
    Type.prototype.null = function (description) {
        return BasicType.type('null', description);
    };
    Type.prototype.number = function (description) {
        return BasicType.type('number', description);
    };
    Type.prototype.file = function (description) {
        return BasicType.type('File', description);
    };
    Type.prototype.any = function (description) {
        return BasicType.type('any', description);
    };
    return Type;
}());
exports.Type = Type;
//# sourceMappingURL=type.js.map