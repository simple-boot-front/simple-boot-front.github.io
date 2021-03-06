'use strict';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var SimOption_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimOption = void 0;
var SimOption = (function () {
    function SimOption(advice, proxy) {
        if (advice === void 0) { advice = []; }
        this.advice = advice;
        this.proxy = proxy;
    }
    SimOption.prototype.addAdvicce = function (advice) {
        this.advice.push(advice);
    };
    SimOption.prototype.setAdvice = function () {
        var advice = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            advice[_i] = arguments[_i];
        }
        this.advice = advice;
        return this;
    };
    return SimOption;
}());
exports.SimOption = SimOption;

});

unwrapExports(SimOption_1);
SimOption_1.SimOption;

var SimFrontOption_1 = createCommonjsModule(function (module, exports) {
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimFrontOption = exports.UrlType = void 0;

var UrlType;
(function (UrlType) {
    UrlType["path"] = "path";
    UrlType["hash"] = "hash";
})(UrlType = exports.UrlType || (exports.UrlType = {}));
var SimFrontOption = (function (_super) {
    __extends(SimFrontOption, _super);
    function SimFrontOption(window, advice) {
        if (advice === void 0) { advice = []; }
        var _this = _super.call(this, advice) || this;
        _this.window = window;
        _this.selector = '#app';
        _this.urlType = UrlType.path;
        return _this;
    }
    SimFrontOption.prototype.setSelector = function (selector) {
        this.selector = selector;
        return this;
    };
    SimFrontOption.prototype.setUrlType = function (urlType) {
        this.urlType = urlType;
        return this;
    };
    return SimFrontOption;
}(SimOption_1.SimOption));
exports.SimFrontOption = SimFrontOption;

});

unwrapExports(SimFrontOption_1);
var SimFrontOption_2 = SimFrontOption_1.SimFrontOption;
var SimFrontOption_3 = SimFrontOption_1.UrlType;

/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect$1;
(function (Reflect) {
    // Metadata Proposal
    // https://rbuckton.github.io/reflect-metadata/
    (function (factory) {
        var root = typeof commonjsGlobal === "object" ? commonjsGlobal :
            typeof self === "object" ? self :
                typeof this === "object" ? this :
                    Function("return this;")();
        var exporter = makeExporter(Reflect);
        if (typeof root.Reflect === "undefined") {
            root.Reflect = Reflect;
        }
        else {
            exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter);
        function makeExporter(target, previous) {
            return function (key, value) {
                if (typeof target[key] !== "function") {
                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                }
                if (previous)
                    previous(key, value);
            };
        }
    })(function (exporter) {
        var hasOwn = Object.prototype.hasOwnProperty;
        // feature test for Symbol support
        var supportsSymbol = typeof Symbol === "function";
        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        var HashMap = {
            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
            create: supportsCreate
                ? function () { return MakeDictionary(Object.create(null)); }
                : supportsProto
                    ? function () { return MakeDictionary({ __proto__: null }); }
                    : function () { return MakeDictionary({}); },
            has: downLevel
                ? function (map, key) { return hasOwn.call(map, key); }
                : function (map, key) { return key in map; },
            get: downLevel
                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
                : function (map, key) { return map[key]; },
        };
        // Load global or shim versions of Map, Set, and WeakMap
        var functionPrototype = Object.getPrototypeOf(Function);
        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
        // [[Metadata]] internal slot
        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
        var Metadata = new _WeakMap();
        /**
         * Applies a set of decorators to a property of a target object.
         * @param decorators An array of decorators.
         * @param target The target object.
         * @param propertyKey (Optional) The property key to decorate.
         * @param attributes (Optional) The property descriptor for the target key.
         * @remarks Decorators are applied in reverse order.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Example = Reflect.decorate(decoratorsArray, Example);
         *
         *     // property (on constructor)
         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Object.defineProperty(Example, "staticMethod",
         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
         *
         *     // method (on prototype)
         *     Object.defineProperty(Example.prototype, "method",
         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
         *
         */
        function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                    throw new TypeError();
                if (IsNull(attributes))
                    attributes = undefined;
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(decorators, target, propertyKey, attributes);
            }
            else {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsConstructor(target))
                    throw new TypeError();
                return DecorateConstructor(decorators, target);
            }
        }
        exporter("decorate", decorate);
        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
        /**
         * A default metadata decorator factory that can be used on a class, class member, or parameter.
         * @param metadataKey The key for the metadata entry.
         * @param metadataValue The value for the metadata entry.
         * @returns A decorator function.
         * @remarks
         * If `metadataKey` is already defined for the target and target key, the
         * metadataValue for that key will be overwritten.
         * @example
         *
         *     // constructor
         *     @Reflect.metadata(key, value)
         *     class Example {
         *     }
         *
         *     // property (on constructor, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticProperty;
         *     }
         *
         *     // property (on prototype, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         property;
         *     }
         *
         *     // method (on constructor)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticMethod() { }
         *     }
         *
         *     // method (on prototype)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         method() { }
         *     }
         *
         */
        function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                    throw new TypeError();
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
        }
        exporter("metadata", metadata);
        /**
         * Define a unique metadata entry on the target.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param metadataValue A value that contains attached metadata.
         * @param target The target object on which to define metadata.
         * @param propertyKey (Optional) The property key for the target.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Reflect.defineMetadata("custom:annotation", options, Example);
         *
         *     // property (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
         *
         *     // method (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
         *
         *     // decorator factory as metadata-producing annotation.
         *     function MyAnnotation(options): Decorator {
         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
         *     }
         *
         */
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        /**
         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        /**
         * Gets a value indicating whether the target object has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        /**
         * Gets the metadata keys defined on the target object or its prototype chain.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
         *
         */
        function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        /**
         * Gets the unique metadata keys defined on the target object.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
         *
         */
        function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        /**
         * Deletes the metadata entry from the target object with the provided key.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.deleteMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            if (!metadataMap.delete(metadataKey))
                return false;
            if (metadataMap.size > 0)
                return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0)
                return true;
            Metadata.delete(target);
            return true;
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsConstructor(decorated))
                        throw new TypeError();
                    target = decorated;
                }
            }
            return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsObject(decorated))
                        throw new TypeError();
                    descriptor = decorated;
                }
            }
            return descriptor;
        }
        function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
                if (!Create)
                    return undefined;
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
                if (!Create)
                    return undefined;
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
        }
        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
        function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
        }
        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            return ToBoolean(metadataMap.has(MetadataKey));
        }
        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
        function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryGetMetadata(MetadataKey, parent, P);
            return undefined;
        }
        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return undefined;
            return metadataMap.get(MetadataKey);
        }
        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
            metadataMap.set(MetadataKey, MetadataValue);
        }
        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
        function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
                return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
                return ownKeys;
            if (ownKeys.length <= 0)
                return parentKeys;
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                var key = ownKeys_1[_i];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                var key = parentKeys_1[_a];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            return keys;
        }
        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
        function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                    keys.length = k;
                    return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                    keys[k] = nextValue;
                }
                catch (e) {
                    try {
                        IteratorClose(iterator);
                    }
                    finally {
                        throw e;
                    }
                }
                k++;
            }
        }
        // 6 ECMAScript Data Typ0es and Values
        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
        function Type(x) {
            if (x === null)
                return 1 /* Null */;
            switch (typeof x) {
                case "undefined": return 0 /* Undefined */;
                case "boolean": return 2 /* Boolean */;
                case "string": return 3 /* String */;
                case "symbol": return 4 /* Symbol */;
                case "number": return 5 /* Number */;
                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
                default: return 6 /* Object */;
            }
        }
        // 6.1.1 The Undefined Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
        function IsUndefined(x) {
            return x === undefined;
        }
        // 6.1.2 The Null Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
        function IsNull(x) {
            return x === null;
        }
        // 6.1.5 The Symbol Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
        function IsSymbol(x) {
            return typeof x === "symbol";
        }
        // 6.1.7 The Object Type
        // https://tc39.github.io/ecma262/#sec-object-type
        function IsObject(x) {
            return typeof x === "object" ? x !== null : typeof x === "function";
        }
        // 7.1 Type Conversion
        // https://tc39.github.io/ecma262/#sec-type-conversion
        // 7.1.1 ToPrimitive(input [, PreferredType])
        // https://tc39.github.io/ecma262/#sec-toprimitive
        function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
                case 0 /* Undefined */: return input;
                case 1 /* Null */: return input;
                case 2 /* Boolean */: return input;
                case 3 /* String */: return input;
                case 4 /* Symbol */: return input;
                case 5 /* Number */: return input;
            }
            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== undefined) {
                var result = exoticToPrim.call(input, hint);
                if (IsObject(result))
                    throw new TypeError();
                return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
        function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
                var toString_1 = O.toString;
                if (IsCallable(toString_1)) {
                    var result = toString_1.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            else {
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var toString_2 = O.toString;
                if (IsCallable(toString_2)) {
                    var result = toString_2.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            throw new TypeError();
        }
        // 7.1.2 ToBoolean(argument)
        // https://tc39.github.io/ecma262/2016/#sec-toboolean
        function ToBoolean(argument) {
            return !!argument;
        }
        // 7.1.12 ToString(argument)
        // https://tc39.github.io/ecma262/#sec-tostring
        function ToString(argument) {
            return "" + argument;
        }
        // 7.1.14 ToPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-topropertykey
        function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3 /* String */);
            if (IsSymbol(key))
                return key;
            return ToString(key);
        }
        // 7.2 Testing and Comparison Operations
        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
        // 7.2.2 IsArray(argument)
        // https://tc39.github.io/ecma262/#sec-isarray
        function IsArray(argument) {
            return Array.isArray
                ? Array.isArray(argument)
                : argument instanceof Object
                    ? argument instanceof Array
                    : Object.prototype.toString.call(argument) === "[object Array]";
        }
        // 7.2.3 IsCallable(argument)
        // https://tc39.github.io/ecma262/#sec-iscallable
        function IsCallable(argument) {
            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
            return typeof argument === "function";
        }
        // 7.2.4 IsConstructor(argument)
        // https://tc39.github.io/ecma262/#sec-isconstructor
        function IsConstructor(argument) {
            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
            return typeof argument === "function";
        }
        // 7.2.7 IsPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-ispropertykey
        function IsPropertyKey(argument) {
            switch (Type(argument)) {
                case 3 /* String */: return true;
                case 4 /* Symbol */: return true;
                default: return false;
            }
        }
        // 7.3 Operations on Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-objects
        // 7.3.9 GetMethod(V, P)
        // https://tc39.github.io/ecma262/#sec-getmethod
        function GetMethod(V, P) {
            var func = V[P];
            if (func === undefined || func === null)
                return undefined;
            if (!IsCallable(func))
                throw new TypeError();
            return func;
        }
        // 7.4 Operations on Iterator Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
        function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
                throw new TypeError(); // from Call
            var iterator = method.call(obj);
            if (!IsObject(iterator))
                throw new TypeError();
            return iterator;
        }
        // 7.4.4 IteratorValue(iterResult)
        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
        function IteratorValue(iterResult) {
            return iterResult.value;
        }
        // 7.4.5 IteratorStep(iterator)
        // https://tc39.github.io/ecma262/#sec-iteratorstep
        function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
        }
        // 7.4.6 IteratorClose(iterator, completion)
        // https://tc39.github.io/ecma262/#sec-iteratorclose
        function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
                f.call(iterator);
        }
        // 9.1 Ordinary Object Internal Methods and Internal Slots
        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
        function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof O !== "function" || O === functionPrototype)
                return proto;
            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
            // Try to determine the superclass constructor. Compatible implementations
            // must either set __proto__ on a subclass constructor to the superclass constructor,
            // or ensure each class has a valid `constructor` property on its prototype that
            // points back to the constructor.
            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
            // This is the case when in ES6 or when using __proto__ in a compatible browser.
            if (proto !== functionPrototype)
                return proto;
            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (prototypeProto == null || prototypeProto === Object.prototype)
                return proto;
            // If the constructor was not a function, then we cannot determine the heritage.
            var constructor = prototypeProto.constructor;
            if (typeof constructor !== "function")
                return proto;
            // If we have some kind of self-reference, then we cannot determine the heritage.
            if (constructor === O)
                return proto;
            // we have a pretty good guess at the heritage.
            return constructor;
        }
        // naive Map shim
        function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = /** @class */ (function () {
                function MapIterator(keys, values, selector) {
                    this._index = 0;
                    this._keys = keys;
                    this._values = values;
                    this._selector = selector;
                }
                MapIterator.prototype["@@iterator"] = function () { return this; };
                MapIterator.prototype[iteratorSymbol] = function () { return this; };
                MapIterator.prototype.next = function () {
                    var index = this._index;
                    if (index >= 0 && index < this._keys.length) {
                        var result = this._selector(this._keys[index], this._values[index]);
                        if (index + 1 >= this._keys.length) {
                            this._index = -1;
                            this._keys = arraySentinel;
                            this._values = arraySentinel;
                        }
                        else {
                            this._index++;
                        }
                        return { value: result, done: false };
                    }
                    return { value: undefined, done: true };
                };
                MapIterator.prototype.throw = function (error) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    throw error;
                };
                MapIterator.prototype.return = function (value) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    return { value: value, done: true };
                };
                return MapIterator;
            }());
            return /** @class */ (function () {
                function Map() {
                    this._keys = [];
                    this._values = [];
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                }
                Object.defineProperty(Map.prototype, "size", {
                    get: function () { return this._keys.length; },
                    enumerable: true,
                    configurable: true
                });
                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
                Map.prototype.get = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    return index >= 0 ? this._values[index] : undefined;
                };
                Map.prototype.set = function (key, value) {
                    var index = this._find(key, /*insert*/ true);
                    this._values[index] = value;
                    return this;
                };
                Map.prototype.delete = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    if (index >= 0) {
                        var size = this._keys.length;
                        for (var i = index + 1; i < size; i++) {
                            this._keys[i - 1] = this._keys[i];
                            this._values[i - 1] = this._values[i];
                        }
                        this._keys.length--;
                        this._values.length--;
                        if (key === this._cacheKey) {
                            this._cacheKey = cacheSentinel;
                            this._cacheIndex = -2;
                        }
                        return true;
                    }
                    return false;
                };
                Map.prototype.clear = function () {
                    this._keys.length = 0;
                    this._values.length = 0;
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                };
                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                Map.prototype["@@iterator"] = function () { return this.entries(); };
                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
                Map.prototype._find = function (key, insert) {
                    if (this._cacheKey !== key) {
                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                    }
                    if (this._cacheIndex < 0 && insert) {
                        this._cacheIndex = this._keys.length;
                        this._keys.push(key);
                        this._values.push(undefined);
                    }
                    return this._cacheIndex;
                };
                return Map;
            }());
            function getKey(key, _) {
                return key;
            }
            function getValue(_, value) {
                return value;
            }
            function getEntry(key, value) {
                return [key, value];
            }
        }
        // naive Set shim
        function CreateSetPolyfill() {
            return /** @class */ (function () {
                function Set() {
                    this._map = new _Map();
                }
                Object.defineProperty(Set.prototype, "size", {
                    get: function () { return this._map.size; },
                    enumerable: true,
                    configurable: true
                });
                Set.prototype.has = function (value) { return this._map.has(value); };
                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
                Set.prototype.delete = function (value) { return this._map.delete(value); };
                Set.prototype.clear = function () { this._map.clear(); };
                Set.prototype.keys = function () { return this._map.keys(); };
                Set.prototype.values = function () { return this._map.values(); };
                Set.prototype.entries = function () { return this._map.entries(); };
                Set.prototype["@@iterator"] = function () { return this.keys(); };
                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
                return Set;
            }());
        }
        // naive WeakMap shim
        function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return /** @class */ (function () {
                function WeakMap() {
                    this._key = CreateUniqueKey();
                }
                WeakMap.prototype.has = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.has(table, this._key) : false;
                };
                WeakMap.prototype.get = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
                };
                WeakMap.prototype.set = function (target, value) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                    table[this._key] = value;
                    return this;
                };
                WeakMap.prototype.delete = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? delete table[this._key] : false;
                };
                WeakMap.prototype.clear = function () {
                    // NOTE: not a real clear, just makes the previous data unreachable
                    this._key = CreateUniqueKey();
                };
                return WeakMap;
            }());
            function CreateUniqueKey() {
                var key;
                do
                    key = "@@WeakMap@@" + CreateUUID();
                while (HashMap.has(keys, key));
                keys[key] = true;
                return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
                if (!hasOwn.call(target, rootKey)) {
                    if (!create)
                        return undefined;
                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
                }
                return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
                for (var i = 0; i < size; ++i)
                    buffer[i] = Math.random() * 0xff | 0;
                return buffer;
            }
            function GenRandomBytes(size) {
                if (typeof Uint8Array === "function") {
                    if (typeof crypto !== "undefined")
                        return crypto.getRandomValues(new Uint8Array(size));
                    if (typeof msCrypto !== "undefined")
                        return msCrypto.getRandomValues(new Uint8Array(size));
                    return FillRandomBytes(new Uint8Array(size), size);
                }
                return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
                var data = GenRandomBytes(UUID_SIZE);
                // mark as random - RFC 4122 ?? 4.4
                data[6] = data[6] & 0x4f | 0x40;
                data[8] = data[8] & 0xbf | 0x80;
                var result = "";
                for (var offset = 0; offset < UUID_SIZE; ++offset) {
                    var byte = data[offset];
                    if (offset === 4 || offset === 6 || offset === 8)
                        result += "-";
                    if (byte < 16)
                        result += "0";
                    result += byte.toString(16).toLowerCase();
                }
                return result;
            }
        }
        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
        function MakeDictionary(obj) {
            obj.__ = undefined;
            delete obj.__;
            return obj;
        }
    });
})(Reflect$1 || (Reflect$1 = {}));

var ReflectUtils_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectUtils = void 0;

var ReflectUtils = (function () {
    function ReflectUtils() {
    }
    ReflectUtils.getParameterTypes = function (target, propertyKey) {
        if (propertyKey) {
            return Reflect.getMetadata('design:paramtypes', target, propertyKey) || [];
        }
        else {
            return Reflect.getMetadata('design:paramtypes', target) || [];
        }
    };
    ReflectUtils.getReturnType = function (target, propertyKey) {
        return Reflect.getMetadata("design:returntype", target, propertyKey);
    };
    ReflectUtils.getType = function (target, propertyKey) {
        if (propertyKey) {
            return Reflect.getMetadata('design:type', target, propertyKey);
        }
        else {
            return Reflect.getMetadata('design:type', target);
        }
    };
    ReflectUtils.getMetadata = function (metadataKey, target, propertyKey) {
        if (propertyKey) {
            return Reflect.getMetadata(metadataKey, target, propertyKey);
        }
        else {
            return Reflect.getMetadata(metadataKey, target);
        }
    };
    ReflectUtils.getMetadataKeys = function (target) {
        return Reflect.getMetadataKeys(target);
    };
    ReflectUtils.getOwnMetadata = function (metadataKey, target, propertyKey) {
        if (propertyKey) {
            return Reflect.getOwnMetadata(metadataKey, target, propertyKey);
        }
        else {
            return Reflect.getOwnMetadata(metadataKey, target);
        }
    };
    ReflectUtils.getMetadatas = function (target) {
        return this.getMetadataKeys(target).map(function (it) { return ReflectUtils.getMetadata(it, target); });
    };
    ReflectUtils.metadata = function (metadataKey, data) {
        return Reflect.metadata(metadataKey, data);
    };
    ReflectUtils.defineMetadata = function (metadataKey, value, target, propertyKey) {
        if (propertyKey && Reflect.defineMetadata) {
            Reflect.defineMetadata(metadataKey, value, target, propertyKey);
        }
        else if (Reflect.defineMetadata) {
            Reflect.defineMetadata(metadataKey, value, target);
        }
    };
    return ReflectUtils;
}());
exports.ReflectUtils = ReflectUtils;

});

unwrapExports(ReflectUtils_1);
ReflectUtils_1.ReflectUtils;

var Component_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComponent = exports.Component = exports.ComponentMetadataKey = exports.componentSelectors = void 0;

exports.componentSelectors = new Map();
exports.ComponentMetadataKey = Symbol('Component');
var Component = function (config) {
    return function (target) {
        if (!config) {
            config = {};
        }
        if (!config.selector) {
            config.selector = target.name;
        }
        ReflectUtils_1.ReflectUtils.defineMetadata(exports.ComponentMetadataKey, config, target);
        exports.componentSelectors.set(config.selector.toLowerCase(), target);
    };
};
exports.Component = Component;
var getComponent = function (target) {
    if (target && typeof target === 'object') {
        target = target.constructor;
    }
    try {
        return ReflectUtils_1.ReflectUtils.getMetadata(exports.ComponentMetadataKey, target);
    }
    catch (e) {
    }
};
exports.getComponent = getComponent;

});

unwrapExports(Component_1);
Component_1.getComponent;
var Component_3 = Component_1.Component;
Component_1.ComponentMetadataKey;
Component_1.componentSelectors;

var Script_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScript = exports.Script = exports.ScriptMetadataKey = exports.scripts = void 0;

exports.scripts = new Map();
exports.ScriptMetadataKey = Symbol('Script');
var Script = function (config) {
    return function (target) {
        if (!config) {
            config = {};
        }
        if (!config.name) {
            config.name = target.name;
        }
        exports.scripts.set(config.name, target);
        ReflectUtils_1.ReflectUtils.defineMetadata(exports.ScriptMetadataKey, config, target);
        return target;
    };
};
exports.Script = Script;
var getScript = function (target) {
    if (target && typeof target === 'object') {
        target = target.constructor;
    }
    try {
        return ReflectUtils_1.ReflectUtils.getMetadata(exports.ScriptMetadataKey, target);
    }
    catch (e) {
    }
};
exports.getScript = getScript;

});

unwrapExports(Script_1);
Script_1.getScript;
Script_1.Script;
Script_1.ScriptMetadataKey;
Script_1.scripts;

var ValidUtils_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidUtils = void 0;
var ValidUtils = (function () {
    function ValidUtils() {
    }
    ValidUtils.isNullOrUndefined = function (data) {
        if (data == null || undefined === data) {
            return true;
        }
        else {
            return false;
        }
    };
    ValidUtils.isNull = function (data) {
        if (data == null) {
            return true;
        }
        else {
            return false;
        }
    };
    ValidUtils.isArray = function (object_o) {
        if (ValidUtils.isNullOrUndefined(object_o)) {
            return false;
        }
        else {
            return Object.prototype.toString.call(object_o).trim() === '[object Array]';
        }
    };
    ValidUtils.isNumber = function (object_o) {
        if (ValidUtils.isNullOrUndefined(object_o)) {
            return false;
        }
        else {
            return Object.prototype.toString.call(object_o).trim() === '[object Number]';
        }
    };
    ValidUtils.isString = function (object_o) {
        if (ValidUtils.isNullOrUndefined(object_o)) {
            return false;
        }
        else {
            return Object.prototype.toString.call(object_o).trim() === '[object String]';
        }
    };
    ValidUtils.isFunction = function (object_o) {
        if (ValidUtils.isNullOrUndefined(object_o)) {
            return false;
        }
        else {
            return Object.prototype.toString.call(object_o).trim() === '[object Function]';
        }
    };
    ValidUtils.isObject = function (object_o) {
        if (ValidUtils.isNullOrUndefined(object_o)) {
            return false;
        }
        else {
            return Object.prototype.toString.call(object_o).trim() === '[object Object]';
        }
    };
    ValidUtils.isMap = function (object_o) {
        if (ValidUtils.isNullOrUndefined(object_o)) {
            return false;
        }
        else {
            return Object.prototype.toString.call(object_o).trim() === '[object Map]';
        }
    };
    return ValidUtils;
}());
exports.ValidUtils = ValidUtils;

});

unwrapExports(ValidUtils_1);
ValidUtils_1.ValidUtils;

var RandomUtils_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomUtils = void 0;

var RandomUtils = (function () {
    function RandomUtils() {
    }
    RandomUtils.random = function (min, max) {
        if (ValidUtils_1.ValidUtils.isNullOrUndefined(min)) {
            return Math.random();
        }
        else if (!ValidUtils_1.ValidUtils.isNullOrUndefined(min) && ValidUtils_1.ValidUtils.isNullOrUndefined(max)) {
            return Math.random() * (min || 0);
        }
        else {
            return Math.random() * ((max || 0) - (min || 0)) + (min || 0);
        }
    };
    RandomUtils.uuid = function (format) {
        if (format === void 0) { format = 'xxxx-xxxx-xxxx-xxxx'; }
        return format.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    RandomUtils.getRandomColor = function () {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    RandomUtils.getRandomString = function (len) {
        var letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        var color = '';
        for (var i = 0; i < len; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    };
    RandomUtils.d = '';
    return RandomUtils;
}());
exports.RandomUtils = RandomUtils;

});

unwrapExports(RandomUtils_1);
RandomUtils_1.RandomUtils;

var StringUtils_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtils = void 0;
var StringUtils = (function () {
    function StringUtils() {
    }
    StringUtils.deleteEnter = function (data) {
        return data.replace(/\r?\n/g, '');
    };
    StringUtils.regexExec = function (regex, text) {
        var varExec = regex.exec(text);
        var usingVars = [];
        while (varExec) {
            usingVars.push(varExec);
            varExec = regex.exec(varExec.input);
        }
        return usingVars;
    };
    StringUtils.escapeSpecialCharacterRegExp = function (data) {
        return data.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };
    return StringUtils;
}());
exports.StringUtils = StringUtils;

});

unwrapExports(StringUtils_1);
StringUtils_1.StringUtils;

var ScriptUtils_1 = createCommonjsModule(function (module, exports) {
var __values = (commonjsGlobal && commonjsGlobal.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptUtils = void 0;
var ScriptUtils = (function () {
    function ScriptUtils() {
    }
    ScriptUtils.getVariablePaths = function (script) {
        var usingVars = new Set();
        var GetDetectProxy = (function () {
            function GetDetectProxy(prefix) {
                this.prefix = prefix;
                this.usingVars = usingVars;
            }
            GetDetectProxy.prototype.set = function (target, p, value, receiver) {
                return true;
            };
            GetDetectProxy.prototype.get = function (target, p, receiver) {
                var items;
                if (typeof p === 'string') {
                    items = this.prefix ? this.prefix + '.' + p : p;
                    this.usingVars.add(items);
                }
                return new Proxy(function () {
                }, new GetDetectProxy(items));
            };
            return GetDetectProxy;
        }());
        var destUser = new Proxy(function () {
        }, new GetDetectProxy());
        try {
            Function("\"use strict\"; ".concat(script, "; ")).bind(destUser)();
        }
        catch (e) {
            console.error(e);
        }
        return usingVars;
    };
    ScriptUtils.evalReturn = function (script, thisTarget) {
        return this.eval('return ' + script + ';', thisTarget);
    };
    ScriptUtils.eval = function (script, thisTarget) {
        return Function("\"use strict\"; ".concat(script, " ")).bind(thisTarget)();
    };
    ScriptUtils.loadElement = function (name, attribute, document) {
        return new Promise(function (resolve, reject) {
            var e_1, _a;
            var tag = document.createElement(name);
            tag.onload = resolve;
            tag.onerror = reject;
            try {
                for (var _b = __values(Object.entries(attribute)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                    tag.setAttribute(key, value);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            document.head.append(tag);
        });
    };
    ScriptUtils.loadStyleSheet = function (href, attribute, document) {
        if (attribute === void 0) { attribute = {}; }
        attribute.type = 'text/css';
        attribute.rel = 'stylesheet';
        attribute.href = href;
        return ScriptUtils.loadElement('link', attribute, document);
    };
    ScriptUtils.loadScript = function (src, attribute, document) {
        if (attribute === void 0) { attribute = {}; }
        attribute.type = 'text/javascript';
        attribute.src = src;
        return ScriptUtils.loadElement('script', attribute, document);
    };
    return ScriptUtils;
}());
exports.ScriptUtils = ScriptUtils;

});

unwrapExports(ScriptUtils_1);
ScriptUtils_1.ScriptUtils;

var DomUtils_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomUtils = void 0;
var DomUtils = (function () {
    function DomUtils() {
    }
    DomUtils.selectorElements = function (selector, element) {
        if (element === void 0) { element = document; }
        return Array.prototype.slice.call(element.querySelectorAll(selector));
    };
    DomUtils.selectorNodes = function (selector, element) {
        if (element === void 0) { element = document; }
        return element.querySelectorAll(selector);
    };
    DomUtils.removeAttribute = function (result, attrs) {
        attrs.forEach(function (it) {
            result.removeAttribute(it);
        });
    };
    DomUtils.setAttribute = function (result, attrs) {
        attrs.forEach(function (it) {
            result.setAttribute(it, '');
        });
    };
    DomUtils.setAttributeAttr = function (result, attrs) {
        attrs.forEach(function (it) {
            result.setAttribute(it.name, it.value);
        });
    };
    DomUtils.getAttributeToObject = function (input) {
        var attribute = {};
        input.getAttributeNames().forEach(function (ait) {
            attribute[ait] = input.getAttribute(ait);
        });
        return attribute;
    };
    DomUtils.getStyleToObject = function (input) {
        var style = {};
        for (var i = 0; i < input.style.length; i++) {
            var key = input.style[i];
            style[key] = input.style[key];
        }
        return style;
    };
    return DomUtils;
}());
exports.DomUtils = DomUtils;

});

unwrapExports(DomUtils_1);
DomUtils_1.DomUtils;

var Range_1 = createCommonjsModule(function (module, exports) {
var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
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
var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = exports.RangeIterator = exports.RangeResult = void 0;
var RangeResult = (function () {
    function RangeResult(value, done) {
        this.done = done;
        this.value = value !== null && value !== void 0 ? value : 0;
    }
    return RangeResult;
}());
exports.RangeResult = RangeResult;
var RangeIterator = (function () {
    function RangeIterator(first, last, step) {
        this._current = this._first = first;
        this._last = last;
        this._step = step;
    }
    RangeIterator.prototype.next = function (value) {
        var r;
        if (this._first < this._last && this._current < this._last) {
            r = new RangeResult(this._current, false);
            this._current += this._step;
        }
        else if (this._first > this._last && this._current > this._last) {
            r = new RangeResult(this._current, false);
            this._current -= this._step;
        }
        else {
            r = new RangeResult(undefined, true);
        }
        return r;
    };
    return RangeIterator;
}());
exports.RangeIterator = RangeIterator;
var Range = (function () {
    function Range(first, last, step) {
        if (step === void 0) { step = 1; }
        this.first = first;
        this.last = last;
        this.step = step;
        this.isRange = true;
    }
    Range.prototype[Symbol.iterator] = function () {
        return new RangeIterator(this.first, this.last, this.step);
    };
    Range.range = function (first, last, step) {
        if (step === void 0) { step = 1; }
        if (typeof first === 'number' && last === undefined) {
            return new Range(0, first, step);
        }
        else if (typeof first === 'string') {
            var _a = __read(first.split('..'), 2), _first = _a[0], _b = _a[1], _last = _b === void 0 ? '0' : _b;
            var _c = __read(_last.split(','), 2), __last = _c[0], _d = _c[1], _step = _d === void 0 ? '1' : _d;
            return new Range(Number(_first.trim()), Number(__last.trim()), Number(_step.trim()));
        }
        else {
            return new Range(first, last !== null && last !== void 0 ? last : 0, step);
        }
    };
    Range.prototype.toArray = function () {
        return __spreadArray([], __read(this), false);
    };
    return Range;
}());
exports.Range = Range;

});

unwrapExports(Range_1);
Range_1.Range;
Range_1.RangeIterator;
Range_1.RangeResult;

var Types = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomRenderFinalProxy = exports.Shield = void 0;
var Shield = (function () {
    function Shield() {
    }
    return Shield;
}());
exports.Shield = Shield;
var DomRenderFinalProxy = (function () {
    function DomRenderFinalProxy() {
    }
    DomRenderFinalProxy.prototype.set = function (target, p, value, receiver) {
        target[p] = value;
        return true;
    };
    DomRenderFinalProxy.prototype.get = function (target, p, receiver) {
        return target[p];
    };
    DomRenderFinalProxy.final = function (obj) {
        obj._DomRender_isFinal = true;
        return obj;
    };
    DomRenderFinalProxy.isFinal = function (obj) {
        return '_DomRender_isFinal' in obj;
    };
    DomRenderFinalProxy.unFinal = function (obj) {
        delete obj._DomRender_isFinal;
        return obj;
    };
    DomRenderFinalProxy.prototype.has = function (target, p) {
        return p === '_DomRender_isFinal' || p in target;
    };
    return DomRenderFinalProxy;
}());
exports.DomRenderFinalProxy = DomRenderFinalProxy;

});

unwrapExports(Types);
Types.DomRenderFinalProxy;
Types.Shield;

var EventManager_1 = createCommonjsModule(function (module, exports) {
var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
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
var __values = (commonjsGlobal && commonjsGlobal.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventManager = exports.EventManager = void 0;




var EventManager = (function () {
    function EventManager() {
        var _this = this;
        this.attrPrefix = 'dr-';
        this.eventNames = [
            'click', 'mousedown', 'mouseup', 'dblclick', 'mouseover', 'mouseout', 'mousemove', 'mouseenter', 'mouseleave', 'contextmenu',
            'keyup', 'keydown', 'keypress',
            'change', 'input', 'submit', 'resize', 'focus', 'blur'
        ];
        this.eventParam = this.attrPrefix + 'event';
        this.attrNames = [
            this.attrPrefix + 'value',
            this.attrPrefix + 'value-link',
            this.attrPrefix + 'attr',
            this.attrPrefix + 'style',
            this.attrPrefix + 'class',
            this.attrPrefix + 'window-event-' + EventManager.WINDOW_EVENT_POPSTATE,
            this.attrPrefix + 'window-event-' + EventManager.WINDOW_EVENT_RESIZE,
            this.attrPrefix + 'on-init',
            this.eventParam
        ];
        this.bindScript = "\n        const ".concat(EventManager.SCRIPTS_VARNAME, " = this.__render.scripts;\n        const ").concat(EventManager.RANGE_VARNAME, " = this.__render.range;\n        const ").concat(EventManager.ELEMENT_VARNAME, " = this.__render.element;\n        const ").concat(EventManager.TARGET_VARNAME, " = this.__render.target;\n        const ").concat(EventManager.EVENT_VARNAME, " = this.__render.event;\n    ");
        this.eventNames.forEach(function (it) {
            _this.attrNames.push(_this.attrPrefix + 'event-' + it);
        });
        if (typeof window !== 'undefined') {
            EventManager.WINDOW_EVENTS.forEach(function (eventName) {
                window === null || window === void 0 ? void 0 : window.addEventListener(eventName, function (event) {
                    var targetAttr = "dr-window-event-".concat(eventName);
                    document.querySelectorAll("[".concat(targetAttr, "]")).forEach(function (it) {
                        var _a;
                        var script = it.getAttribute(targetAttr);
                        if (script) {
                            var obj = it.obj;
                            var config = (_a = obj === null || obj === void 0 ? void 0 : obj._DomRender_proxy) === null || _a === void 0 ? void 0 : _a.config;
                            ScriptUtils_1.ScriptUtils.eval("".concat(_this.bindScript, " ").concat(script, " "), Object.assign(obj, {
                                __render: Object.freeze({
                                    target: Types.DomRenderFinalProxy.final(event.target),
                                    element: it,
                                    event: event,
                                    range: Range_1.Range.range,
                                    scripts: EventManager.setBindProperty(config === null || config === void 0 ? void 0 : config.scripts, obj)
                                })
                            }));
                        }
                    });
                });
            });
        }
    }
    EventManager.prototype.findAttrElements = function (fragment, config) {
        var _a, _b;
        var elements = new Set();
        var addAttributes = (_b = (_a = config === null || config === void 0 ? void 0 : config.applyEvents) === null || _a === void 0 ? void 0 : _a.map(function (it) { return it.attrName; })) !== null && _b !== void 0 ? _b : [];
        addAttributes.concat(this.attrNames).forEach(function (attrName) {
            fragment === null || fragment === void 0 ? void 0 : fragment.querySelectorAll("[".concat(attrName, "]")).forEach(function (it) {
                elements.add(it);
            });
        });
        return elements;
    };
    EventManager.prototype.applyEvent = function (obj, childNodes, config) {
        var _this = this;
        this.eventNames.forEach(function (it) {
            _this.addDrEvents(obj, it, childNodes, config);
        });
        this.addDrEventPram(obj, this.eventParam, childNodes, config);
        this.procAttr(childNodes, this.attrPrefix + 'value', function (it, attribute) {
            var script = attribute;
            if (script) {
                var data = ScriptUtils_1.ScriptUtils.evalReturn(script, obj);
                if (it.value !== data) {
                    it.value = data;
                }
            }
        });
        EventManager.WINDOW_EVENTS.forEach(function (it) {
            _this.procAttr(childNodes, _this.attrPrefix + 'window-event-' + it, function (it, attribute) {
                it.obj = obj;
            });
        });
        this.procAttr(childNodes, this.attrPrefix + 'on-init', function (it, attribute) {
            var script = attribute;
            if (script) {
                script = 'return ' + script;
            }
            if (script) {
                ScriptUtils_1.ScriptUtils.eval("".concat(_this.bindScript, "; ").concat(script, " "), Object.assign(obj, {
                    __render: Object.freeze({
                        element: it
                    })
                }));
            }
        });
        this.procAttr(childNodes, this.attrPrefix + 'value-link', function (it, varName) {
            if (varName) {
                var ownerVariablePathName = it.getAttribute(EventManager.ownerVariablePathAttrName);
                var bindObj_1 = obj;
                if (ownerVariablePathName) {
                    bindObj_1 = ScriptUtils_1.ScriptUtils.evalReturn(ownerVariablePathName, obj);
                }
                var value = _this.getValue(obj, varName, bindObj_1);
                if (typeof value === 'function' && value) {
                    value(it.value);
                }
                else {
                    if (value) {
                        _this.setValue(obj, varName, value);
                    }
                    else {
                        _this.setValue(obj, varName, it.value);
                    }
                }
                it.addEventListener('input', function (eit) {
                    if (typeof _this.getValue(obj, varName, bindObj_1) === 'function') {
                        _this.getValue(obj, varName, bindObj_1)(it.value, eit);
                    }
                    else {
                        _this.setValue(obj, varName, it.value);
                    }
                });
            }
        });
        this.changeVar(obj, childNodes, undefined);
        var elements = Array.from(childNodes).filter(function (it) { return it.nodeType === 1; }).map(function (it) { return it; });
        elements.forEach(function (it) {
            var _a;
            (_a = config === null || config === void 0 ? void 0 : config.applyEvents) === null || _a === void 0 ? void 0 : _a.filter(function (ta) { return it.getAttribute(ta.attrName); }).forEach(function (ta) { return ta.callBack(it, it.getAttribute(ta.attrName), obj); });
        });
    };
    EventManager.prototype.changeVar = function (obj, elements, varName) {
        var _this = this;
        this.procAttr(elements, this.attrPrefix + 'value-link', function (it, attribute) {
            var ownerVariablePathName = it.getAttribute(EventManager.ownerVariablePathAttrName);
            var bindObj = obj;
            if (ownerVariablePathName) {
                bindObj = ScriptUtils_1.ScriptUtils.evalReturn(ownerVariablePathName, obj);
            }
            if (attribute && attribute === varName) {
                if (typeof _this.getValue(obj, attribute, bindObj) === 'function') {
                    _this.getValue(obj, attribute, bindObj)(it.value);
                }
                else {
                    var value = _this.getValue(obj, attribute, bindObj);
                    if (value !== undefined && value !== null) {
                        it.value = value;
                    }
                }
            }
        });
        this.procAttr(elements, this.attrPrefix + 'attr', function (it, attribute) {
            var e_1, _a;
            var script = attribute;
            if (script) {
                script = 'return ' + script;
            }
            if (_this.isUsingThisVar(script, varName) || varName === undefined) {
                var data = ScriptUtils_1.ScriptUtils.eval("const $element = this.__render.element; ".concat(script, " "), Object.assign(obj, {
                    __render: Object.freeze({
                        element: it
                    })
                }));
                if (typeof data === 'string') {
                    data.split(',').forEach(function (sit) {
                        var _a = __read(sit.split('='), 2), key = _a[0], value = _a[1];
                        var s = value.trim();
                        var k = key.trim();
                        if (s === 'null') {
                            it.removeAttribute(k);
                        }
                        else {
                            it.setAttribute(k, s);
                        }
                    });
                }
                else if (Array.isArray(data)) {
                    data.forEach(function (sit) {
                        var _a = __read(sit.split('='), 2), key = _a[0], value = _a[1];
                        var s = value.trim();
                        var k = key.trim();
                        if (s === 'null') {
                            it.removeAttribute(k);
                        }
                        else {
                            it.setAttribute(k, s);
                        }
                    });
                }
                else {
                    try {
                        for (var _b = __values(Object.entries(data)), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                            if (value === null) {
                                it.removeAttribute(key);
                            }
                            else {
                                it.setAttribute(key, String(value));
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
            }
        });
        this.procAttr(elements, this.attrPrefix + 'style', function (it, attribute) {
            var e_2, _a;
            var script = attribute;
            if (script) {
                script = 'return ' + script;
            }
            if (_this.isUsingThisVar(script, varName) || varName === undefined) {
                var data = ScriptUtils_1.ScriptUtils.eval("const $element = this.__render.element;  ".concat(script, " "), Object.assign(obj, {
                    __render: Object.freeze({
                        element: it
                    })
                }));
                if (typeof data === 'string') {
                    it.setAttribute('style', data);
                }
                else if (Array.isArray(data)) {
                    it.setAttribute('style', data.join(';'));
                }
                else {
                    try {
                        for (var _b = __values(Object.entries(data)), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                            if (it instanceof HTMLElement) {
                                it.style[key] = String(value);
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
        });
        this.procAttr(elements, this.attrPrefix + 'class', function (it, attribute) {
            var e_3, _a;
            var script = attribute;
            if (script) {
                script = 'return ' + script;
            }
            if (_this.isUsingThisVar(script, varName) || varName === undefined) {
                var data = ScriptUtils_1.ScriptUtils.eval("const $element = this.element;  ".concat(script, " "), Object.assign(obj, {
                    __render: Object.freeze({
                        element: it
                    })
                }));
                if (typeof data === 'string') {
                    it.setAttribute('class', data);
                }
                else if (Array.isArray(data)) {
                    it.setAttribute('class', data.join(' '));
                }
                else {
                    try {
                        for (var _b = __values(Object.entries(data)), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                            if (it instanceof HTMLElement) {
                                if (value) {
                                    it.classList.add(key);
                                }
                                else {
                                    it.classList.remove(key);
                                }
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
        });
    };
    EventManager.prototype.addDrEvents = function (obj, eventName, elements, config) {
        var _this = this;
        var attr = this.attrPrefix + 'event-' + eventName;
        this.procAttr(elements, attr, function (it, attribute) {
            var script = attribute;
            it.addEventListener(eventName, function (event) {
                var filter = true;
                var filterScript = it.getAttribute("".concat(attr, ":filter"));
                var thisTarget = Object.assign(obj, {
                    __render: Object.freeze({
                        event: event,
                        element: it,
                        target: event.target,
                        range: Range_1.Range.range,
                        scripts: EventManager.setBindProperty(config === null || config === void 0 ? void 0 : config.scripts, obj)
                    })
                });
                if (filterScript) {
                    filter = ScriptUtils_1.ScriptUtils.eval("".concat(_this.bindScript, " return ").concat(filterScript), thisTarget);
                }
                if (filter) {
                    ScriptUtils_1.ScriptUtils.eval("".concat(_this.bindScript, " ").concat(script, " "), thisTarget);
                }
            });
        });
    };
    EventManager.prototype.addDrEventPram = function (obj, attr, elements, config) {
        var _this = this;
        this.procAttr(elements, attr, function (it, attribute, attributes) {
            var bind = attributes[attr + ':bind'];
            if (bind) {
                var script_1 = attribute;
                var params_1 = {};
                var prefix_1 = attr + ':';
                Object.entries(attributes).filter(function (_a) {
                    var _b = __read(_a, 2), k = _b[0]; _b[1];
                    return k.startsWith(prefix_1);
                }).forEach(function (_a) {
                    var _b = __read(_a, 2), k = _b[0], v = _b[1];
                    params_1[k.slice(prefix_1.length)] = v;
                });
                bind.split(',').forEach(function (eventName) {
                    it.addEventListener(eventName.trim(), function (event) {
                        ScriptUtils_1.ScriptUtils.eval("const $params = this.__render.params; ".concat(_this.bindScript, "  ").concat(script_1, " "), Object.assign(obj, {
                            __render: Object.freeze({
                                event: event,
                                element: it,
                                target: event.target,
                                range: Range_1.Range.range,
                                scripts: EventManager.setBindProperty(config === null || config === void 0 ? void 0 : config.scripts, obj),
                                params: params_1
                            })
                        }));
                    });
                });
            }
        });
    };
    EventManager.prototype.procAttr = function (elements, attrName, callBack) {
        if (elements === void 0) { elements = new Set(); }
        var sets = new Set();
        elements.forEach(function (it) {
            if (!it) {
                return;
            }
            if (it.nodeType === 1) {
                var e = it;
                sets.add(e);
                e.querySelectorAll("[".concat(attrName, "]")).forEach(function (it) {
                    sets.add(it);
                });
            }
        });
        sets.forEach(function (it) {
            var attr = it.getAttribute(attrName);
            var attrs = DomUtils_1.DomUtils.getAttributeToObject(it);
            if (attr) {
                callBack(it, attr, attrs);
            }
        });
    };
    EventManager.prototype.getValue = function (obj, name, bindObj) {
        var r = ScriptUtils_1.ScriptUtils.evalReturn(name, obj);
        if (typeof r === 'function') {
            r = r.bind(bindObj !== null && bindObj !== void 0 ? bindObj : obj);
        }
        return r;
    };
    EventManager.prototype.setValue = function (obj, name, value) {
        name = name.replaceAll('this.', 'this.this.');
        ScriptUtils_1.ScriptUtils.eval("".concat(name, " = this.value"), {
            this: obj,
            value: value
        });
    };
    EventManager.prototype.isUsingThisVar = function (raws, varName) {
        if (varName && raws) {
            if (varName.startsWith('this.')) {
                varName = varName.replace(/this\./, '');
            }
            EventManager.VARNAMES.forEach(function (it) {
                raws = raws.replace(RegExp(it.replace('$', '\\$'), 'g'), "this.___".concat(it));
            });
            var variablePaths = ScriptUtils_1.ScriptUtils.getVariablePaths(raws !== null && raws !== void 0 ? raws : '');
            return variablePaths.has(varName);
        }
        return false;
    };
    EventManager.setBindProperty = function (scripts, obj) {
        var e_4, _a;
        if (scripts) {
            var newScripts = Object.assign({}, scripts);
            try {
                for (var _b = __values(Object.entries(newScripts)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                    if (typeof value === 'function') {
                        newScripts[key] = value.bind(obj);
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return newScripts;
        }
    };
    EventManager.ownerVariablePathAttrName = 'dr-owner-variable-path';
    EventManager.SCRIPTS_VARNAME = '$scripts';
    EventManager.FAG_VARNAME = '$fag';
    EventManager.RAWSET_VARNAME = '$rawset';
    EventManager.RANGE_VARNAME = '$range';
    EventManager.ELEMENT_VARNAME = '$element';
    EventManager.TARGET_VARNAME = '$target';
    EventManager.EVENT_VARNAME = '$event';
    EventManager.VARNAMES = [EventManager.SCRIPTS_VARNAME, EventManager.FAG_VARNAME, EventManager.RAWSET_VARNAME, EventManager.RANGE_VARNAME, EventManager.ELEMENT_VARNAME, EventManager.TARGET_VARNAME, EventManager.EVENT_VARNAME];
    EventManager.WINDOW_EVENT_POPSTATE = 'popstate';
    EventManager.WINDOW_EVENT_RESIZE = 'resize';
    EventManager.WINDOW_EVENTS = [EventManager.WINDOW_EVENT_POPSTATE, EventManager.WINDOW_EVENT_RESIZE];
    return EventManager;
}());
exports.EventManager = EventManager;
exports.eventManager = new EventManager();

});

unwrapExports(EventManager_1);
EventManager_1.eventManager;
EventManager_1.EventManager;

var Validator_1 = createCommonjsModule(function (module, exports) {
var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
var Validator = (function () {
    function Validator(_value, target, event, autoValid, autoValidAction) {
        if (autoValid === void 0) { autoValid = true; }
        if (autoValidAction === void 0) { autoValidAction = true; }
        this._value = _value;
        this.setTarget(target);
        this.setEvent(event);
        this.setAutoValid(autoValid);
        this.setAutoValidAction(autoValidAction);
    }
    Validator.prototype.getValidAction = function () {
        return this._validAction;
    };
    Validator.prototype.setValidAction = function (value) {
        this._validAction = value;
        return this;
    };
    Validator.prototype.getAutoValid = function () {
        return this._autoValid;
    };
    Validator.prototype.setAutoValid = function (autoValid) {
        this._autoValid = autoValid;
        return this;
    };
    Validator.prototype.getAutoValidAction = function () {
        return this._autoValidAction;
    };
    Validator.prototype.setAutoValidAction = function (autoValid) {
        this._autoValidAction = autoValid;
        return this;
    };
    Validator.prototype.getEvent = function () {
        return this._event;
    };
    Validator.prototype.setEvent = function (event) {
        if (event) {
            this._event = this.domRenderFinal(event);
        }
        return this;
    };
    Validator.prototype.getTarget = function () {
        return this._target;
    };
    Validator.prototype.targetFocus = function () {
        var _a, _b;
        (_b = (_a = this._target) === null || _a === void 0 ? void 0 : _a.focus) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    Validator.prototype.targetDispatchEvent = function (event) {
        var _a;
        return (_a = this._target) === null || _a === void 0 ? void 0 : _a.dispatchEvent(event);
    };
    Validator.prototype.setTarget = function (target) {
        if (target) {
            this._target = this.domRenderFinal(target);
        }
        return this;
    };
    Validator.prototype.domRenderFinal = function (obj) {
        obj._DomRender_isFinal = true;
        return obj;
    };
    Object.defineProperty(Validator.prototype, "value", {
        get: function () {
            var _a;
            if (this._value === undefined || this._value === null) {
                this._value = (_a = this.getTarget()) === null || _a === void 0 ? void 0 : _a.value;
            }
            return this._value;
        },
        set: function (value) {
            this._value = value;
            this.tickValue(value);
        },
        enumerable: false,
        configurable: true
    });
    Validator.prototype.tickValue = function (value) {
        this.changeValue(value);
        var target = this.getTarget();
        if (target && (target === null || target === void 0 ? void 0 : target.value) !== undefined && (target === null || target === void 0 ? void 0 : target.value) !== null) {
            try {
                target.value = this._value;
            }
            catch (e) {
                console.log('set value function is blocked ');
            }
        }
        if (this.getAutoValidAction()) {
            this.validAction();
        }
        else if (this.getAutoValid()) {
            this.valid();
        }
    };
    Validator.prototype.set = function (value, target, event) {
        this.setTarget(target);
        this.setEvent(event);
        this.value = value;
    };
    Validator.prototype.changeValue = function (value) {
    };
    Object.defineProperty(Validator.prototype, "checked", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this.getTarget()) === null || _a === void 0 ? void 0 : _a.checked) !== null && _b !== void 0 ? _b : false;
        },
        set: function (checked) {
            var target = this.getTarget();
            if (target) {
                target.checked = checked;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Validator.prototype, "selectedIndex", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this.getTarget()) === null || _a === void 0 ? void 0 : _a.selectedIndex) !== null && _b !== void 0 ? _b : -1;
        },
        set: function (selectedIndex) {
            var target = this.getTarget();
            if (target) {
                target.selectedIndex = selectedIndex;
            }
        },
        enumerable: false,
        configurable: true
    });
    Validator.prototype.querySelector = function (selector) {
        var _a;
        return (_a = this.getTarget()) === null || _a === void 0 ? void 0 : _a.querySelector(selector);
    };
    Validator.prototype.querySelectorALL = function (selector) {
        var _a;
        return (_a = this.getTarget()) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selector);
    };
    Validator.prototype.validAction = function () {
        var _a;
        var valid = this.valid();
        (_a = this.getValidAction()) === null || _a === void 0 ? void 0 : _a(valid, this.value, this.getTarget(), this.getEvent());
        return valid;
    };
    Validator.prototype.inValid = function () {
        return !this.valid();
    };
    Validator.prototype.allValid = function () {
        return this.valid() && this.childInValid();
    };
    Validator.prototype.allValidAction = function () {
        return this.validAction() && this.childInValidAction();
    };
    Validator.prototype.allInValid = function () {
        return !this.allValid();
    };
    Validator.prototype.allInValidAction = function () {
        return !this.allValidAction();
    };
    Validator.prototype.childValid = function () {
        return !this.childInValid();
    };
    Validator.prototype.childValue = function () {
        var data = {};
        this.childValidators().filter(function (_a) {
            var _b = __read(_a, 2), k = _b[0], v = _b[1];
            data[k] = v.value;
        });
        return data;
    };
    Validator.prototype.childValidAction = function () {
        return !this.childInValidAction();
    };
    Validator.prototype.childInValid = function () {
        var inValid = this.childValidators().filter(function (_a) {
            var _b = __read(_a, 2); _b[0]; var v = _b[1];
            return !v.valid();
        });
        return inValid.length > 0;
    };
    Validator.prototype.childInValidValidator = function () {
        var inValid = this.childValidators().filter(function (_a) {
            var _b = __read(_a, 2); _b[0]; var v = _b[1];
            return !v.valid();
        });
        return inValid;
    };
    Validator.prototype.childInValidAction = function () {
        var inValid = this.childValidators().filter(function (_a) {
            var _b = __read(_a, 2); _b[0]; var v = _b[1];
            return !v.validAction();
        });
        return inValid.length > 0;
    };
    Validator.prototype.childValidator = function (name) {
        var _a;
        return (_a = Object.entries(this).find(function (_a) {
            var _b = __read(_a, 2), k = _b[0], v = _b[1];
            return (k === name && (v instanceof Validator));
        })) === null || _a === void 0 ? void 0 : _a[1];
    };
    Validator.prototype.childValidators = function () {
        return Object.entries(this).filter(function (_a) {
            var _b = __read(_a, 2); _b[0]; var v = _b[1];
            return (v instanceof Validator);
        });
    };
    Validator.prototype.childValidValidator = function () {
        return this.childValidators().filter(function (it) { return it[1].valid(); });
    };
    Validator.prototype.syncValue = function () {
        var _a;
        this.value = (_a = this.getTarget()) === null || _a === void 0 ? void 0 : _a.value;
    };
    Validator.prototype.allSyncValue = function () {
        this.childValidators().forEach(function (_a) {
            var _b = __read(_a, 2); _b[0]; var e = _b[1];
            e.syncValue();
        });
    };
    Object.defineProperty(Validator.prototype, "length", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this.value) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        },
        enumerable: false,
        configurable: true
    });
    return Validator;
}());
exports.Validator = Validator;

});

unwrapExports(Validator_1);
Validator_1.Validator;

var NonPassValidator_1 = createCommonjsModule(function (module, exports) {
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonPassValidator = void 0;

var NonPassValidator = (function (_super) {
    __extends(NonPassValidator, _super);
    function NonPassValidator(value, target, event, autoValid) {
        if (autoValid === void 0) { autoValid = true; }
        return _super.call(this, value, target, event, autoValid) || this;
    }
    NonPassValidator.prototype.valid = function () {
        return false;
    };
    return NonPassValidator;
}(Validator_1.Validator));
exports.NonPassValidator = NonPassValidator;

});

unwrapExports(NonPassValidator_1);
NonPassValidator_1.NonPassValidator;

var ValidatorArray_1 = createCommonjsModule(function (module, exports) {
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorArray = void 0;


var ValidatorArray = (function (_super) {
    __extends(ValidatorArray, _super);
    function ValidatorArray(value, target, event, autoValid) {
        if (autoValid === void 0) { autoValid = true; }
        var _this = _super.call(this, value, target, event, autoValid) || this;
        _this._makeValidatorFactory = function (value, target, event) {
            return new NonPassValidator_1.NonPassValidator(value, target, event);
        };
        return _this;
    }
    ValidatorArray.prototype.getMakeValidatorFactory = function () {
        return this._makeValidatorFactory;
    };
    ValidatorArray.prototype.setMakeValidatorFactory = function (value) {
        this._makeValidatorFactory = value;
        return this;
    };
    ValidatorArray.prototype.setArrayValue = function (target, value, event) {
        var _a;
        (_a = this.value) === null || _a === void 0 ? void 0 : _a.filter(function (it) {
            if (it.getTarget()) {
                return it.getTarget() === target;
            }
            else {
                return false;
            }
        }).forEach(function (it) {
            it.set(value, target, event);
        });
        this.tickValue(this.value);
    };
    ValidatorArray.prototype.addValidator = function (value, target, event) {
        var _a, _b;
        if (!this.value) {
            this.value = [];
        }
        if (value instanceof Validator_1.Validator) {
            (_a = this.value) === null || _a === void 0 ? void 0 : _a.push(value);
        }
        else {
            (_b = this.value) === null || _b === void 0 ? void 0 : _b.push(this.makeValidator(value, target, event));
        }
        this.tickValue(this.value);
    };
    ValidatorArray.prototype.allChecked = function (checked) {
        var _a;
        this.checked = checked;
        (_a = this.value) === null || _a === void 0 ? void 0 : _a.forEach(function (it) {
            it.checked = checked;
        });
    };
    ValidatorArray.prototype.getValidators = function () {
        return this._value;
    };
    ValidatorArray.prototype.getValidator = function (e) {
        var _a;
        return (_a = this.value) === null || _a === void 0 ? void 0 : _a.filter(function (it) { return it.getTarget() === e; })[0];
    };
    ValidatorArray.prototype.getValidatorByValue = function (value) {
        var validatorByValue = this.getValidatorByValues(value)[0];
        return validatorByValue;
    };
    ValidatorArray.prototype.getValidatorByValues = function (value) {
        var _a, _b;
        return (_b = (_a = this.value) === null || _a === void 0 ? void 0 : _a.filter(function (it) { return it.value === value; })) !== null && _b !== void 0 ? _b : [];
    };
    ValidatorArray.prototype.removeElement = function (e) {
        var value = this.value;
        if (value) {
            this.value = value.filter(function (it) { return it.getTarget() !== e; });
        }
    };
    ValidatorArray.prototype.makeValidator = function (value, target, event) {
        return this._makeValidatorFactory(value, target, event);
    };
    return ValidatorArray;
}(Validator_1.Validator));
exports.ValidatorArray = ValidatorArray;

});

unwrapExports(ValidatorArray_1);
ValidatorArray_1.ValidatorArray;

var RawSet_1 = createCommonjsModule(function (module, exports) {
var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
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
var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (commonjsGlobal && commonjsGlobal.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawSet = void 0;








var RawSet = (function () {
    function RawSet(uuid, point, fragment, data) {
        if (data === void 0) { data = {}; }
        this.uuid = uuid;
        this.point = point;
        this.fragment = fragment;
        this.data = data;
    }
    Object.defineProperty(RawSet.prototype, "isConnected", {
        get: function () {
            return this.point.start.isConnected && this.point.end.isConnected;
        },
        enumerable: false,
        configurable: true
    });
    RawSet.prototype.getUsingTriggerVariables = function (config) {
        var usingTriggerVariables = new Set();
        this.fragment.childNodes.forEach(function (cNode, key) {
            var _a, _b, _c;
            var script = '';
            if (cNode.nodeType === Node.TEXT_NODE) {
                script = "`".concat((_a = cNode.textContent) !== null && _a !== void 0 ? _a : '', "`");
            }
            else if (cNode.nodeType === Node.ELEMENT_NODE) {
                var element_1 = cNode;
                var targetAttrNames = ((_c = (_b = config === null || config === void 0 ? void 0 : config.targetAttrs) === null || _b === void 0 ? void 0 : _b.map(function (it) { return it.name; })) !== null && _c !== void 0 ? _c : []).concat(RawSet.DR_ATTRIBUTES);
                script = targetAttrNames.map(function (it) { return (element_1.getAttribute(it)); }).filter(function (it) { return it; }).join(';');
            }
            if (script) {
                EventManager_1.EventManager.VARNAMES.forEach(function (it) {
                    script = script.replace(RegExp(it.replace('$', '\\$'), 'g'), "this.___".concat(it));
                });
                Array.from(ScriptUtils_1.ScriptUtils.getVariablePaths(script)).filter(function (it) { return !it.startsWith("___".concat(EventManager_1.EventManager.SCRIPTS_VARNAME)) && !it.startsWith("___".concat(EventManager_1.EventManager.SCRIPTS_VARNAME)); }).forEach(function (it) { return usingTriggerVariables.add(it); });
            }
        });
        return usingTriggerVariables;
    };
    RawSet.prototype.render = function (obj, config) {
        var e_1, _a, e_2, _b;
        var _this = this;
        var _c, _d, _e, _f, _g, _h, _j;
        var genNode = config.window.document.importNode(this.fragment, true);
        var raws = [];
        var onAttrInitCallBack = [];
        var onElementInitCallBack = [];
        var drAttrs = [];
        genNode.childNodes.forEach(function (cNode, key) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
            var __render = Object.freeze({
                rawset: _this,
                scripts: EventManager_1.EventManager.setBindProperty(config === null || config === void 0 ? void 0 : config.scripts, obj),
                range: Range_1.Range.range,
                element: cNode,
                bindScript: "\n                    const ".concat(EventManager_1.EventManager.SCRIPTS_VARNAME, " = this.__render.scripts;\n                    const ").concat(EventManager_1.EventManager.RAWSET_VARNAME, " = this.__render.rawset;\n                    const ").concat(EventManager_1.EventManager.ELEMENT_VARNAME, " = this.__render.element;\n                    const ").concat(EventManager_1.EventManager.RANGE_VARNAME, " = this.__render.range;\n            ")
            });
            var fag = config.window.document.createDocumentFragment();
            if (cNode.nodeType === Node.TEXT_NODE && cNode.textContent) {
                var textContent = cNode.textContent;
                var runText = RawSet.exporesionGrouops(textContent)[0][1];
                var n = void 0;
                if (textContent === null || textContent === void 0 ? void 0 : textContent.startsWith('#')) {
                    var r = ScriptUtils_1.ScriptUtils.eval("".concat(__render.bindScript, " return ").concat(runText), Object.assign(obj, { __render: __render }));
                    var template = config.window.document.createElement('template');
                    template.innerHTML = r;
                    n = template.content;
                }
                else {
                    var r = ScriptUtils_1.ScriptUtils.eval("".concat(__render.bindScript, "  return ").concat(runText), Object.assign(obj, { __render: __render }));
                    n = config.window.document.createTextNode(r);
                }
                (_a = cNode.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(n, cNode);
            }
            else if (cNode.nodeType === Node.ELEMENT_NODE) {
                var element_2 = cNode;
                var drAttr_1 = {
                    dr: _this.getAttributeAndDelete(element_2, RawSet.DR),
                    drIf: _this.getAttributeAndDelete(element_2, RawSet.DR_IF_NAME),
                    drFor: _this.getAttributeAndDelete(element_2, RawSet.DR_FOR_NAME),
                    drForOf: _this.getAttributeAndDelete(element_2, RawSet.DR_FOR_OF_NAME),
                    drRepeat: _this.getAttributeAndDelete(element_2, RawSet.DR_REPEAT_NAME),
                    drThis: _this.getAttributeAndDelete(element_2, RawSet.DR_THIS_NAME),
                    drForm: _this.getAttributeAndDelete(element_2, RawSet.DR_FORM_NAME),
                    drPre: _this.getAttributeAndDelete(element_2, RawSet.DR_PRE_NAME),
                    drInnerHTML: _this.getAttributeAndDelete(element_2, RawSet.DR_INNERHTML_NAME),
                    drInnerText: _this.getAttributeAndDelete(element_2, RawSet.DR_INNERTEXT_NAME),
                    drItOption: _this.getAttributeAndDelete(element_2, RawSet.DR_IT_OPTIONNAME),
                    drVarOption: _this.getAttributeAndDelete(element_2, RawSet.DR_VAR_OPTIONNAME),
                    drAfterOption: _this.getAttributeAndDelete(element_2, RawSet.DR_AFTER_OPTIONNAME),
                    drBeforeOption: _this.getAttributeAndDelete(element_2, RawSet.DR_BEFORE_OPTIONNAME),
                    drCompleteOption: _this.getAttributeAndDelete(element_2, RawSet.DR_COMPLETE_OPTIONNAME),
                    drStripOption: _this.getAttributeAndDelete(element_2, RawSet.DR_STRIP_OPTIONNAME)
                };
                drAttrs.push(drAttr_1);
                if (drAttr_1.drPre != null) {
                    return;
                }
                if (drAttr_1.dr !== null && drAttr_1.dr.length >= 0) {
                    var itRandom = RawSet.drItOtherEncoding(element_2);
                    var vars = RawSet.drVarEncoding(element_2, (_b = drAttr_1.drVarOption) !== null && _b !== void 0 ? _b : '');
                    var newTemp = config.window.document.createElement('temp');
                    ScriptUtils_1.ScriptUtils.eval("\n                        ".concat(__render.bindScript, "\n                        const n = $element.cloneNode(true);\n                        var destIt = ").concat(drAttr_1.drItOption, ";\n                        if (destIt !== undefined) {\n                            n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt)))\n                            // console.log('----', n.innerHTML);\n                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);\n                            // console.log('----', n.innerHTML);\n                        }\n                        if (this.__render.drStripOption === 'true') {\n                            Array.from(n.childNodes).forEach(it => this.__fag.append(it));\n                        } else {\n                            this.__render.fag.append(n);\n                        }"), Object.assign(obj, {
                        __render: Object.freeze(__assign({ fag: newTemp, drStripOption: drAttr_1.drStripOption }, __render))
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    var tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content);
                    var rr = RawSet.checkPointCreates(fag, config);
                    (_c = element_2.parentNode) === null || _c === void 0 ? void 0 : _c.replaceChild(fag, element_2);
                    raws.push.apply(raws, __spreadArray([], __read(rr), false));
                }
                if (drAttr_1.drIf) {
                    var itRandom = RawSet.drItOtherEncoding(element_2);
                    var vars = RawSet.drVarEncoding(element_2, (_d = drAttr_1.drVarOption) !== null && _d !== void 0 ? _d : '');
                    var newTemp = config.window.document.createElement('temp');
                    ScriptUtils_1.ScriptUtils.eval("\n                    ".concat(__render.bindScript, "\n                    ").concat((_e = drAttr_1.drBeforeOption) !== null && _e !== void 0 ? _e : '', "\n                    if(").concat(drAttr_1.drIf, ") {\n                        const n = $element.cloneNode(true);\n                        Object.entries(this.__render.drAttr).filter(([k,v]) => k !== 'drIf' && v).forEach(([k, v]) => n.setAttribute(this.__render.drAttrsOriginName[k], v));\n                        var destIt = ").concat(drAttr_1.drItOption, ";\n                        if (destIt !== undefined) {\n                            n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt)))\n                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);\n                        }\n                        if (this.__render.drStripOption === 'true') {\n                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));\n                        } else {\n                            this.__render.fag.append(n);\n                        }\n                    }\n                    ").concat((_f = drAttr_1.drAfterOption) !== null && _f !== void 0 ? _f : '', "\n                    "), Object.assign(obj, {
                        __render: Object.freeze(__assign({ fag: newTemp, drAttr: drAttr_1, drAttrsOriginName: RawSet.drAttrsOriginName, drStripOption: drAttr_1.drStripOption }, __render))
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    var bypass = ((_g = newTemp.innerHTML) !== null && _g !== void 0 ? _g : '').trim().length <= 0;
                    var tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content);
                    var rr = RawSet.checkPointCreates(fag, config);
                    (_h = element_2.parentNode) === null || _h === void 0 ? void 0 : _h.replaceChild(fag, element_2);
                    raws.push.apply(raws, __spreadArray([], __read(rr), false));
                    if (bypass) {
                        return;
                    }
                }
                if (drAttr_1.drThis) {
                    var r = ScriptUtils_1.ScriptUtils.evalReturn(drAttr_1.drThis, obj);
                    if (r) {
                        fag.append(RawSet.drThisCreate(element_2, drAttr_1.drThis, (_j = drAttr_1.drVarOption) !== null && _j !== void 0 ? _j : '', drAttr_1.drStripOption, obj, config));
                        var rr = RawSet.checkPointCreates(fag, config);
                        (_k = element_2.parentNode) === null || _k === void 0 ? void 0 : _k.replaceChild(fag, element_2);
                        raws.push.apply(raws, __spreadArray([], __read(rr), false));
                    }
                    else {
                        cNode.remove();
                    }
                }
                if (drAttr_1.drForm) {
                    RawSet.drFormOtherMoveAttr(element_2, 'name', 'temp-name', config);
                    var data = ScriptUtils_1.ScriptUtils.evalReturn("".concat(drAttr_1.drForm), obj);
                    var childs = Array.from(element_2.querySelectorAll('[name]'));
                    var fromName = ScriptUtils_1.ScriptUtils.evalReturn((_l = element_2.getAttribute('dr-form:name')) !== null && _l !== void 0 ? _l : '', obj);
                    var thisName = fromName !== null && fromName !== void 0 ? fromName : element_2.getAttribute('name');
                    if (childs.length <= 0 && thisName) {
                        childs.push(element_2);
                    }
                    else {
                        if (data instanceof Validator_1.Validator) {
                            data.setTarget(element_2);
                        }
                    }
                    childs.forEach(function (it) {
                        var _a, _b, _c, _d, _e;
                        var eventName = (_a = it.getAttribute('dr-form:event')) !== null && _a !== void 0 ? _a : 'change';
                        var validatorName = it.getAttribute('dr-form:validator');
                        var attrEventName = EventManager_1.eventManager.attrPrefix + 'event-' + eventName;
                        var varpath = (_c = ScriptUtils_1.ScriptUtils.evalReturn((_b = element_2.getAttribute('dr-form:name')) !== null && _b !== void 0 ? _b : '', obj)) !== null && _c !== void 0 ? _c : it.getAttribute('name');
                        if (varpath != null) {
                            if (validatorName) {
                                ScriptUtils_1.ScriptUtils.eval("\n                                    ".concat(__render.bindScript, "\n                                    const validator = typeof ").concat(validatorName, " ==='function' ?  new  ").concat(validatorName, "() : ").concat(validatorName, ";\n                                    ").concat(drAttr_1.drForm, "['").concat(varpath, "'] = validator;\n                                "), Object.assign(obj, {
                                    __render: Object.freeze(__assign({ drStripOption: drAttr_1.drStripOption }, __render))
                                }));
                            }
                            varpath = "".concat(drAttr_1.drForm, "['").concat(varpath, "']");
                            var data_1 = ScriptUtils_1.ScriptUtils.evalReturn("".concat(varpath), obj);
                            if (data_1 instanceof ValidatorArray_1.ValidatorArray) {
                                it.setAttribute(attrEventName, "".concat(varpath, ".setArrayValue($target, $target.value, $event); ").concat((_d = it.getAttribute(attrEventName)) !== null && _d !== void 0 ? _d : '', ";"));
                                data_1.addValidator(it.value, it);
                            }
                            else if (data_1 instanceof Validator_1.Validator) {
                                it.setAttribute(attrEventName, "".concat(varpath, ".set($target.value, $target, $event); ").concat((_e = it.getAttribute(attrEventName)) !== null && _e !== void 0 ? _e : '', ";"));
                                data_1.setTarget(it);
                                data_1.value = it.value;
                            }
                            else {
                                it.setAttribute(attrEventName, "".concat(varpath, " = $target.value;"));
                            }
                        }
                    });
                    RawSet.drFormOtherMoveAttr(element_2, 'temp-name', 'name', config);
                    raws.push.apply(raws, __spreadArray([], __read(RawSet.checkPointCreates(element_2, config)), false));
                }
                if (drAttr_1.drInnerText) {
                    var newTemp = config.window.document.createElement('temp');
                    ScriptUtils_1.ScriptUtils.eval(" \n                        ".concat(__render.bindScript, "\n                        const n = $element.cloneNode(true);  \n                        ").concat((_m = drAttr_1.drBeforeOption) !== null && _m !== void 0 ? _m : '', "\n                        n.innerText = ").concat(drAttr_1.drInnerText, ";\n                        if (this.__render.drStripOption === 'true') {\n                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));\n                        } else {\n                            this.__render.fag.append(n);\n                        }\n                        ").concat((_o = drAttr_1.drAfterOption) !== null && _o !== void 0 ? _o : '', "\n                    "), Object.assign(obj, {
                        __render: Object.freeze(__assign({ drStripOption: drAttr_1.drStripOption, fag: newTemp }, __render))
                    }));
                    var tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content);
                    var rr = RawSet.checkPointCreates(fag, config);
                    (_p = element_2.parentNode) === null || _p === void 0 ? void 0 : _p.replaceChild(fag, element_2);
                    raws.push.apply(raws, __spreadArray([], __read(rr), false));
                }
                if (drAttr_1.drInnerHTML) {
                    var newTemp = config.window.document.createElement('temp');
                    ScriptUtils_1.ScriptUtils.eval("\n                        ".concat(__render.bindScript, "\n                        const n = $element.cloneNode(true);\n                        ").concat((_q = drAttr_1.drBeforeOption) !== null && _q !== void 0 ? _q : '', "\n                        n.innerHTML = ").concat(drAttr_1.drInnerHTML, ";\n                        if (this.__render.drStripOption === 'true') {\n                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));\n                        } else {\n                            this.__render.fag.append(n);\n                        }\n                        ").concat((_r = drAttr_1.drAfterOption) !== null && _r !== void 0 ? _r : '', "\n                    "), Object.assign(obj, {
                        __render: Object.freeze(__assign({ drStripOption: drAttr_1.drStripOption, fag: newTemp }, __render))
                    }));
                    var tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content);
                    var rr = RawSet.checkPointCreates(fag, config);
                    (_s = element_2.parentNode) === null || _s === void 0 ? void 0 : _s.replaceChild(fag, element_2);
                    raws.push.apply(raws, __spreadArray([], __read(rr), false));
                }
                if (drAttr_1.drFor) {
                    var itRandom = RawSet.drItOtherEncoding(element_2);
                    var vars = RawSet.drVarEncoding(element_2, (_t = drAttr_1.drVarOption) !== null && _t !== void 0 ? _t : '');
                    var newTemp = config.window.document.createElement('temp');
                    ScriptUtils_1.ScriptUtils.eval("\n                    ".concat(__render.bindScript, "\n                    ").concat((_u = drAttr_1.drBeforeOption) !== null && _u !== void 0 ? _u : '', "\n                    for(").concat(drAttr_1.drFor, ") {\n                        const n = this.__render.element.cloneNode(true);\n                        var destIt = ").concat(drAttr_1.drItOption, ";\n                        if (destIt !== undefined) {\n                            n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt).replace(/\\#nearForIt\\#/g, destIt))) \n                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);\n                        }\n                        if (this.__render.drStripOption === 'true') {\n                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));\n                        } else {\n                            this.__render.fag.append(n);\n                        }\n                    }\n                    ").concat((_v = drAttr_1.drAfterOption) !== null && _v !== void 0 ? _v : '', "\n                    "), Object.assign(obj, {
                        __render: Object.freeze(__assign({ fag: newTemp, drStripOption: drAttr_1.drStripOption }, __render))
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    var tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content);
                    var rr = RawSet.checkPointCreates(fag, config);
                    (_w = element_2.parentNode) === null || _w === void 0 ? void 0 : _w.replaceChild(fag, element_2);
                    raws.push.apply(raws, __spreadArray([], __read(rr), false));
                }
                if (drAttr_1.drForOf) {
                    var itRandom = RawSet.drItOtherEncoding(element_2);
                    var vars = RawSet.drVarEncoding(element_2, (_x = drAttr_1.drVarOption) !== null && _x !== void 0 ? _x : '');
                    var newTemp = config.window.document.createElement('temp');
                    ScriptUtils_1.ScriptUtils.eval("\n                    ".concat(__render.bindScript, "\n                    ").concat((_y = drAttr_1.drBeforeOption) !== null && _y !== void 0 ? _y : '', "\n                    var i = 0; \n                    const forOf = ").concat(drAttr_1.drForOf, ";\n                    const forOfStr = `").concat(drAttr_1.drForOf, "`.trim();\n                    if (forOf) {\n                        for(const it of forOf) {\n                            var destIt = it;\n                            if (/\\[(.*,?)\\],/g.test(forOfStr)) {\n                                if (typeof it === 'string') {\n                                    destIt = it;\n                                } else {\n                                    destIt = forOfStr.substring(1, forOfStr.length-1).split(',')[i];\n                                }\n                            } else if (forOf.isRange) {\n                                    destIt = it;\n                            }  else {\n                                destIt = forOfStr + '[' + i +']'\n                            }\n                            const n = this.__render.element.cloneNode(true);\n                            n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt).replace(/\\#nearForOfIt\\#/g, destIt)))\n                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);\n                            if (this.__render.drStripOption === 'true') {\n                                Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));\n                            } else {\n                                this.__render.fag.append(n);\n                            }\n                            i++;\n                        }\n                    }\n                    ").concat((_z = drAttr_1.drAfterOption) !== null && _z !== void 0 ? _z : '', "\n                    "), Object.assign(obj, {
                        __render: Object.freeze(__assign({ drStripOption: drAttr_1.drStripOption, fag: newTemp }, __render))
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    var tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content);
                    var rr = RawSet.checkPointCreates(fag, config);
                    (_0 = element_2.parentNode) === null || _0 === void 0 ? void 0 : _0.replaceChild(fag, element_2);
                    raws.push.apply(raws, __spreadArray([], __read(rr), false));
                }
                if (drAttr_1.drRepeat) {
                    var itRandom = RawSet.drItOtherEncoding(element_2);
                    var vars = RawSet.drVarEncoding(element_2, (_1 = drAttr_1.drVarOption) !== null && _1 !== void 0 ? _1 : '');
                    var newTemp = config.window.document.createElement('temp');
                    ScriptUtils_1.ScriptUtils.eval("\n                    ".concat(__render.bindScript, "\n                    ").concat((_2 = drAttr_1.drBeforeOption) !== null && _2 !== void 0 ? _2 : '', "\n                    var i = 0; \n                    const repeat = ").concat(drAttr_1.drRepeat, ";\n                    const repeatStr = `").concat(drAttr_1.drRepeat, "`;\n                    let range = repeat;\n                    if (typeof repeat === 'number') {\n                        range = ").concat(EventManager_1.EventManager.RANGE_VARNAME, "(repeat);\n                    } \n                    for(const it of range) {\n                        var destIt = it;\n                        if (range.isRange) {\n                            destIt = it;\n                        }  else {\n                            destIt = repeatStr + '[' + i +']'\n                        }\n                        const n = this.__render.element.cloneNode(true);\n                        n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt).replace(/\\#nearRangeIt\\#/g, destIt)))\n                        n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);\n                        \n                        if (this.__render.drStripOption === 'true') {\n                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));\n                        } else {\n                            this.__render.fag.append(n);\n                        }\n                        i++;\n                    }\n                    ").concat((_3 = drAttr_1.drAfterOption) !== null && _3 !== void 0 ? _3 : '', "\n                    "), Object.assign(obj, {
                        __render: Object.freeze(__assign({ fag: newTemp, drStripOption: drAttr_1.drStripOption }, __render))
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    var tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content);
                    var rr = RawSet.checkPointCreates(fag, config);
                    (_4 = element_2.parentNode) === null || _4 === void 0 ? void 0 : _4.replaceChild(fag, element_2);
                    raws.push.apply(raws, __spreadArray([], __read(rr), false));
                }
                (_5 = config === null || config === void 0 ? void 0 : config.targetElements) === null || _5 === void 0 ? void 0 : _5.forEach(function (it) {
                    var _a, _b;
                    var name = it.name;
                    if (name.toLowerCase() === element_2.tagName.toLowerCase()) {
                        var documentFragment = it.callBack(element_2, obj, _this);
                        if (documentFragment) {
                            var rr = RawSet.checkPointCreates(documentFragment, config);
                            (_a = element_2.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(documentFragment, element_2);
                            raws.push.apply(raws, __spreadArray([], __read(rr), false));
                            onElementInitCallBack.push({
                                name: name,
                                obj: obj,
                                targetElement: it
                            });
                            (_b = it === null || it === void 0 ? void 0 : it.complete) === null || _b === void 0 ? void 0 : _b.call(it, element_2, obj, _this);
                        }
                    }
                });
                (_6 = config === null || config === void 0 ? void 0 : config.targetAttrs) === null || _6 === void 0 ? void 0 : _6.forEach(function (it) {
                    var _a, _b;
                    var attrName = it.name;
                    var attrValue = _this.getAttributeAndDelete(element_2, attrName);
                    if (attrValue && attrName) {
                        var documentFragment = it.callBack(element_2, attrValue, obj, _this);
                        if (documentFragment) {
                            var rr = RawSet.checkPointCreates(documentFragment, config);
                            (_a = element_2.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(documentFragment, element_2);
                            raws.push.apply(raws, __spreadArray([], __read(rr), false));
                            onAttrInitCallBack.push({
                                attrName: attrName,
                                attrValue: attrValue,
                                obj: obj
                            });
                            (_b = it === null || it === void 0 ? void 0 : it.complete) === null || _b === void 0 ? void 0 : _b.call(it, element_2, attrValue, obj, _this);
                        }
                    }
                });
            }
        });
        this.applyEvent(obj, genNode, config);
        this.replaceBody(genNode);
        drAttrs.forEach(function (it) {
            if (it.drCompleteOption) {
                ScriptUtils_1.ScriptUtils.eval("\n                const ".concat(EventManager_1.EventManager.FAG_VARNAME, " = this.__render.fag;\n                const ").concat(EventManager_1.EventManager.SCRIPTS_VARNAME, " = this.__render.scripts;\n                const ").concat(EventManager_1.EventManager.RAWSET_VARNAME, " = this.__render.rawset;\n                ").concat(it.drCompleteOption, "\n                "), Object.assign(obj, {
                    __render: Object.freeze({
                        rawset: _this,
                        fag: genNode,
                        scripts: EventManager_1.EventManager.setBindProperty(config === null || config === void 0 ? void 0 : config.scripts, obj)
                    })
                }));
            }
        });
        try {
            for (var onElementInitCallBack_1 = __values(onElementInitCallBack), onElementInitCallBack_1_1 = onElementInitCallBack_1.next(); !onElementInitCallBack_1_1.done; onElementInitCallBack_1_1 = onElementInitCallBack_1.next()) {
                var it_1 = onElementInitCallBack_1_1.value;
                (_f = (_e = (_d = (_c = it_1.targetElement) === null || _c === void 0 ? void 0 : _c.__render) === null || _d === void 0 ? void 0 : _d.component) === null || _e === void 0 ? void 0 : _e.onInitRender) === null || _f === void 0 ? void 0 : _f.call(_e, (_g = it_1.targetElement) === null || _g === void 0 ? void 0 : _g.__render);
                var r = (_h = config === null || config === void 0 ? void 0 : config.onElementInit) === null || _h === void 0 ? void 0 : _h.call(config, it_1.name, obj, this, it_1.targetElement);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (onElementInitCallBack_1_1 && !onElementInitCallBack_1_1.done && (_a = onElementInitCallBack_1.return)) _a.call(onElementInitCallBack_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var onAttrInitCallBack_1 = __values(onAttrInitCallBack), onAttrInitCallBack_1_1 = onAttrInitCallBack_1.next(); !onAttrInitCallBack_1_1.done; onAttrInitCallBack_1_1 = onAttrInitCallBack_1.next()) {
                var it_2 = onAttrInitCallBack_1_1.value;
                var r = (_j = config === null || config === void 0 ? void 0 : config.onAttrInit) === null || _j === void 0 ? void 0 : _j.call(config, it_2.attrName, it_2.attrValue, obj, this);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (onAttrInitCallBack_1_1 && !onAttrInitCallBack_1_1.done && (_b = onAttrInitCallBack_1.return)) _b.call(onAttrInitCallBack_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return raws;
    };
    RawSet.prototype.applyEvent = function (obj, fragment, config) {
        if (fragment === void 0) { fragment = this.fragment; }
        EventManager_1.eventManager.applyEvent(obj, EventManager_1.eventManager.findAttrElements(fragment, config), config);
    };
    RawSet.prototype.getAttribute = function (element, attr) {
        var data = element.getAttribute(attr);
        return data;
    };
    RawSet.prototype.getAttributeAndDelete = function (element, attr) {
        var data = element.getAttribute(attr);
        element.removeAttribute(attr);
        return data;
    };
    RawSet.prototype.replaceBody = function (genNode) {
        var _a;
        this.childAllRemove();
        (_a = this.point.start.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(genNode, this.point.start.nextSibling);
    };
    RawSet.checkPointCreates = function (element, config) {
        var _a, _b, _c, _d;
        var thisVariableName = element.__domrender_this_variable_name;
        var nodeIterator = config.window.document.createNodeIterator(element, NodeFilter.SHOW_ALL, {
            acceptNode: function (node) {
                var _a, _b, _c, _d, _e;
                if (node.nodeType === Node.TEXT_NODE) {
                    var between = RawSet.exporesionGrouops(StringUtils_1.StringUtils.deleteEnter((_a = node.data) !== null && _a !== void 0 ? _a : ''));
                    return (between === null || between === void 0 ? void 0 : between.length) > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
                else if (node.nodeType === Node.ELEMENT_NODE) {
                    var element_3 = node;
                    var isElement = ((_c = (_b = config.targetElements) === null || _b === void 0 ? void 0 : _b.map(function (it) { return it.name.toLowerCase(); })) !== null && _c !== void 0 ? _c : []).includes(element_3.tagName.toLowerCase());
                    var targetAttrNames_1 = ((_e = (_d = config.targetAttrs) === null || _d === void 0 ? void 0 : _d.map(function (it) { return it.name; })) !== null && _e !== void 0 ? _e : []).concat(RawSet.DR_ATTRIBUTES);
                    var isAttr = element_3.getAttributeNames().filter(function (it) { return targetAttrNames_1.includes(it.toLowerCase()); }).length > 0;
                    return (isAttr || isElement) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        });
        var pars = [];
        var currentNode;
        var _loop_1 = function () {
            if (currentNode.nodeType === Node.TEXT_NODE) {
                var text = (_a = currentNode.textContent) !== null && _a !== void 0 ? _a : '';
                var template_1 = config.window.document.createElement('template');
                var a = RawSet.exporesionGrouops(text);
                var map = a.map(function (it) {
                    return {
                        uuid: RandomUtils_1.RandomUtils.uuid(),
                        content: it[0],
                        regexArr: it
                    };
                });
                var lasterIndex_1 = 0;
                map.forEach(function (it) {
                    var regexArr = it.regexArr;
                    var preparedText = regexArr.input.substring(lasterIndex_1, regexArr.index);
                    var start = config.window.document.createComment("start text ".concat(it.uuid));
                    var end = config.window.document.createComment("end text ".concat(it.uuid));
                    template_1.content.append(document.createTextNode(preparedText));
                    template_1.content.append(start);
                    template_1.content.append(end);
                    var fragment = config.window.document.createDocumentFragment();
                    fragment.append(config.window.document.createTextNode(it.content));
                    pars.push(new RawSet(it.uuid, {
                        start: start,
                        end: end,
                        thisVariableName: thisVariableName
                    }, fragment));
                    lasterIndex_1 = regexArr.index + it.content.length;
                });
                template_1.content.append(config.window.document.createTextNode(text.substring(lasterIndex_1, text.length)));
                (_b = currentNode === null || currentNode === void 0 ? void 0 : currentNode.parentNode) === null || _b === void 0 ? void 0 : _b.replaceChild(template_1.content, currentNode);
            }
            else {
                var uuid = RandomUtils_1.RandomUtils.uuid();
                var fragment = config.window.document.createDocumentFragment();
                var start = config.window.document.createComment("start ".concat(uuid));
                var end = config.window.document.createComment("end ".concat(uuid));
                (_c = currentNode === null || currentNode === void 0 ? void 0 : currentNode.parentNode) === null || _c === void 0 ? void 0 : _c.insertBefore(start, currentNode);
                (_d = currentNode === null || currentNode === void 0 ? void 0 : currentNode.parentNode) === null || _d === void 0 ? void 0 : _d.insertBefore(end, currentNode.nextSibling);
                fragment.append(currentNode);
                pars.push(new RawSet(uuid, {
                    start: start,
                    end: end,
                    thisVariableName: thisVariableName
                }, fragment));
            }
        };
        while (currentNode = nodeIterator.nextNode()) {
            _loop_1();
        }
        return pars;
    };
    RawSet.prototype.childAllRemove = function () {
        var next = this.point.start.nextSibling;
        while (next) {
            if (next === this.point.end) {
                break;
            }
            next.remove();
            next = this.point.start.nextSibling;
        }
    };
    RawSet.drItOtherEncoding = function (element) {
        var random = RandomUtils_1.RandomUtils.uuid();
        var regex = /#it#/g;
        element.querySelectorAll("[".concat(RawSet.DR_IT_OPTIONNAME, "], [").concat(RawSet.DR_FOR_OF_NAME, "], [").concat(RawSet.DR_REPEAT_NAME, "]")).forEach(function (it) {
            it.innerHTML = it.innerHTML.replace(regex, random);
        });
        return random;
    };
    RawSet.drItOtherDecoding = function (element, random) {
        element.querySelectorAll("[".concat(RawSet.DR_IT_OPTIONNAME, "], [").concat(RawSet.DR_FOR_OF_NAME, "], [").concat(RawSet.DR_REPEAT_NAME, "]")).forEach(function (it) {
            it.innerHTML = it.innerHTML.replace(RegExp(random, 'g'), '#it#');
        });
    };
    RawSet.drThisEncoding = function (element, drThis) {
        var thisRandom = RandomUtils_1.RandomUtils.uuid();
        element.querySelectorAll("[".concat(RawSet.DR_PRE_NAME, "]")).forEach(function (it) {
            it.innerHTML = it.innerHTML.replace(/this/g, thisRandom);
        });
        element.querySelectorAll("[".concat(RawSet.DR_THIS_NAME, "]")).forEach(function (it) {
            var message = it.innerHTML;
            StringUtils_1.StringUtils.regexExec(/([^(dr\-)])?this(?=.?)/g, message).reverse().forEach(function (it) {
                var _a;
                message = message.substr(0, it.index) + message.substr(it.index).replace(it[0], "".concat((_a = it[1]) !== null && _a !== void 0 ? _a : '').concat(drThis));
            });
            it.innerHTML = message;
        });
        var message = element.innerHTML;
        StringUtils_1.StringUtils.regexExec(/([^(dr\-)])?this(?=.?)/g, message).reverse().forEach(function (it) {
            var _a;
            message = message.substr(0, it.index) + message.substr(it.index).replace(it[0], "".concat((_a = it[1]) !== null && _a !== void 0 ? _a : '').concat(drThis));
        });
        element.innerHTML = message;
        return thisRandom;
    };
    RawSet.drThisDecoding = function (element, thisRandom) {
        element.querySelectorAll("[".concat(RawSet.DR_PRE_NAME, "]")).forEach(function (it) {
            it.innerHTML = it.innerHTML.replace(RegExp(thisRandom, 'g'), 'this');
        });
        element.querySelectorAll("[".concat(RawSet.DR_THIS_NAME, "]")).forEach(function (it) {
            it.innerHTML = it.innerHTML.replace(RegExp(thisRandom, 'g'), 'this');
        });
    };
    RawSet.drFormOtherMoveAttr = function (element, as, to, config) {
        element.querySelectorAll("[".concat(RawSet.DR_FORM_NAME, "]")).forEach(function (subElement) {
            var _a;
            var nodeIterator = config.window.document.createNodeIterator(subElement, NodeFilter.SHOW_ELEMENT, {
                acceptNode: function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        var element_4 = node;
                        return element_4.hasAttribute(as) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                    }
                    else {
                        return NodeFilter.FILTER_REJECT;
                    }
                }
            });
            var node;
            while (node = nodeIterator.nextNode()) {
                var element_5 = node;
                element_5.setAttribute(to, (_a = element_5.getAttribute(as)) !== null && _a !== void 0 ? _a : '');
                element_5.removeAttribute(as);
            }
        });
    };
    RawSet.drVarEncoding = function (element, drVarOption) {
        var _a;
        var vars = ((_a = drVarOption === null || drVarOption === void 0 ? void 0 : drVarOption.split(',')) !== null && _a !== void 0 ? _a : []).map(function (it) {
            var _a, _b;
            var s = it.trim().split('=');
            var name = (_a = s[0]) === null || _a === void 0 ? void 0 : _a.trim();
            var value = (_b = s[1]) === null || _b === void 0 ? void 0 : _b.trim();
            return {
                name: name,
                value: value,
                regex: RegExp('\\$var\\.' + name + '(?=.?)', 'g'),
                random: RandomUtils_1.RandomUtils.uuid()
            };
        });
        element.querySelectorAll("[".concat(RawSet.DR_VAR_OPTIONNAME, "]")).forEach(function (it) {
            vars.filter(function (vit) { return vit.value && vit.name; }).forEach(function (vit) {
                it.innerHTML = it.innerHTML.replace(vit.regex, vit.random);
            });
        });
        vars.filter(function (vit) { return vit.value && vit.name; }).forEach(function (vit) {
            element.innerHTML = element.innerHTML.replace(vit.regex, vit.value);
        });
        return vars;
    };
    RawSet.drVarDecoding = function (element, vars) {
        element.querySelectorAll("[".concat(RawSet.DR_THIS_NAME, "]")).forEach(function (it) {
            vars.filter(function (vit) { return vit.value && vit.name; }).forEach(function (vit) {
                it.innerHTML = it.innerHTML.replace(RegExp(vit.random, 'g'), vit.value);
            });
        });
    };
    RawSet.drThisCreate = function (element, drThis, drVarOption, drStripOption, obj, config) {
        var fag = config.window.document.createDocumentFragment();
        var n = element.cloneNode(true);
        n.querySelectorAll(EventManager_1.eventManager.attrNames.map(function (it) { return "[".concat(it, "]"); }).join(',')).forEach(function (it) {
            it.setAttribute(EventManager_1.EventManager.ownerVariablePathAttrName, 'this');
        });
        var thisRandom = this.drThisEncoding(n, drThis);
        var vars = this.drVarEncoding(n, drVarOption);
        this.drVarDecoding(n, vars);
        this.drThisDecoding(n, thisRandom);
        if (drStripOption && (drStripOption === true || drStripOption === 'true')) {
            Array.from(n.childNodes).forEach(function (it) { return fag.append(it); });
        }
        else {
            fag.append(n);
        }
        fag.__domrender_this_variable_name = drThis;
        return fag;
    };
    RawSet.createComponentTargetAttribute = function (name, getThisObj, factory) {
        var targetAttribute = {
            name: name,
            callBack: function (element, attrValue, obj, rawSet) {
                var _a;
                var thisObj = getThisObj(element, attrValue, obj, rawSet);
                var data = factory(element, attrValue, obj, rawSet);
                rawSet.point.thisVariableName = data.__domrender_this_variable_name;
                if (thisObj) {
                    thisObj['__domrender_component_new'] = (_a = thisObj['__domrender_component_new']) !== null && _a !== void 0 ? _a : new Proxy({}, new Types.DomRenderFinalProxy());
                    thisObj['__domrender_component_new'].thisVariableName = rawSet.point.thisVariableName;
                    thisObj['__domrender_component_new'].rawSet = rawSet;
                    thisObj['__domrender_component_new'].innerHTML = element.innerHTML;
                    thisObj['__domrender_component_new'].rootCreator = new Proxy(obj, new Types.DomRenderFinalProxy());
                    thisObj['__domrender_component_new'].creator = new Proxy(rawSet.point.thisVariableName ? ScriptUtils_1.ScriptUtils.evalReturn(rawSet.point.thisVariableName, obj) : obj, new Types.DomRenderFinalProxy());
                }
                return data;
            }
        };
        return targetAttribute;
    };
    RawSet.createComponentTargetElement = function (name, objFactory, template, styles, scripts, config) {
        if (template === void 0) { template = ''; }
        if (styles === void 0) { styles = []; }
        var targetElement = {
            name: name,
            styles: styles,
            template: template,
            callBack: function (element, obj, rawSet) {
                var _a, _b;
                if (!obj.__domrender_components) {
                    obj.__domrender_components = {};
                }
                var domrenderComponents = obj.__domrender_components;
                var componentKey = '_' + RandomUtils_1.RandomUtils.getRandomString(20);
                domrenderComponents[componentKey] = objFactory(element, obj, rawSet);
                var instance = domrenderComponents[componentKey];
                var attribute = {};
                element.getAttributeNames().forEach(function (it) {
                    attribute[it] = element.getAttribute(it);
                });
                var render = Object.freeze({
                    component: instance,
                    element: element,
                    innerHTML: element.innerHTML,
                    attribute: attribute,
                    rawset: rawSet,
                    componentKey: componentKey,
                    scripts: EventManager_1.EventManager.setBindProperty(scripts, obj)
                });
                this.__render = render;
                instance['__domrender_component_new'] = (_a = instance['__domrender_component_new']) !== null && _a !== void 0 ? _a : new Proxy({}, new Types.DomRenderFinalProxy());
                instance['__domrender_component_new'].thisVariableName = rawSet.point.thisVariableName;
                instance['__domrender_component_new'].rawSet = rawSet;
                instance['__domrender_component_new'].innerHTML = element.innerHTML;
                instance['__domrender_component_new'].rootCreator = new Proxy(obj, new Types.DomRenderFinalProxy());
                instance['__domrender_component_new'].creator = new Proxy(rawSet.point.thisVariableName ? ScriptUtils_1.ScriptUtils.evalReturn(rawSet.point.thisVariableName, obj) : obj, new Types.DomRenderFinalProxy());
                var applayTemplate = element.innerHTML;
                if (applayTemplate) {
                    if (rawSet.point.thisVariableName) {
                        applayTemplate = applayTemplate.replace(/this\./g, 'this.__domrender_component_new.rootCreator.');
                    }
                }
                applayTemplate = template.replace('#innerHTML#', applayTemplate);
                var oninit = element.getAttribute('dr-on-init');
                if (oninit) {
                    var script = "var $component = this.__render.component; var $element = this.__render.element; var $innerHTML = this.__render.innerHTML; var $attribute = this.__render.attribute;  ".concat(oninit, " ");
                    ScriptUtils_1.ScriptUtils.eval(script, Object.assign(obj, {
                        __render: render
                    }));
                }
                var innerHTML = ((_b = styles === null || styles === void 0 ? void 0 : styles.map(function (it) { return "<style>".concat(it, "</style>"); })) !== null && _b !== void 0 ? _b : []).join(' ') + (applayTemplate !== null && applayTemplate !== void 0 ? applayTemplate : '');
                element.innerHTML = innerHTML;
                var data = RawSet.drThisCreate(element, "this.__domrender_components.".concat(componentKey), '', true, obj, config);
                return data;
            },
        };
        return targetElement;
    };
    RawSet.exporesionGrouops = function (data) {
        var reg = /(?:[$#]\{(?:(([$#]\{)??[^$#]?[^{]*?)\}[$#]))/g;
        return StringUtils_1.StringUtils.regexExec(reg, data);
    };
    RawSet.DR = 'dr';
    RawSet.DR_IF_NAME = 'dr-if';
    RawSet.DR_FOR_NAME = 'dr-for';
    RawSet.DR_FOR_OF_NAME = 'dr-for-of';
    RawSet.DR_REPEAT_NAME = 'dr-repeat';
    RawSet.DR_THIS_NAME = 'dr-this';
    RawSet.DR_FORM_NAME = 'dr-form';
    RawSet.DR_PRE_NAME = 'dr-pre';
    RawSet.DR_INNERHTML_NAME = 'dr-inner-html';
    RawSet.DR_INNERTEXT_NAME = 'dr-inner-text';
    RawSet.DR_DETECT_NAME = 'dr-detect';
    RawSet.DR_IT_OPTIONNAME = 'dr-it';
    RawSet.DR_VAR_OPTIONNAME = 'dr-var';
    RawSet.DR_AFTER_OPTIONNAME = 'dr-after';
    RawSet.DR_BEFORE_OPTIONNAME = 'dr-before';
    RawSet.DR_COMPLETE_OPTIONNAME = 'dr-complete';
    RawSet.DR_STRIP_OPTIONNAME = 'dr-strip';
    RawSet.drAttrsOriginName = {
        dr: RawSet.DR,
        drIf: RawSet.DR_IF_NAME,
        drFor: RawSet.DR_FOR_NAME,
        drForOf: RawSet.DR_FOR_OF_NAME,
        drRepeat: RawSet.DR_REPEAT_NAME,
        drThis: RawSet.DR_THIS_NAME,
        drForm: RawSet.DR_FORM_NAME,
        drPre: RawSet.DR_PRE_NAME,
        drInnerHTML: RawSet.DR_INNERHTML_NAME,
        drInnerText: RawSet.DR_INNERTEXT_NAME,
        drItOption: RawSet.DR_IT_OPTIONNAME,
        drVarOption: RawSet.DR_VAR_OPTIONNAME,
        drAfterOption: RawSet.DR_AFTER_OPTIONNAME,
        drBeforeOption: RawSet.DR_BEFORE_OPTIONNAME,
        drCompleteOption: RawSet.DR_COMPLETE_OPTIONNAME,
        drStripOption: RawSet.DR_STRIP_OPTIONNAME,
    };
    RawSet.DR_TAGS = [];
    RawSet.DR_ATTRIBUTES = [RawSet.DR, RawSet.DR_IF_NAME, RawSet.DR_FOR_OF_NAME, RawSet.DR_FOR_NAME, RawSet.DR_THIS_NAME, RawSet.DR_FORM_NAME, RawSet.DR_PRE_NAME, RawSet.DR_INNERHTML_NAME, RawSet.DR_INNERTEXT_NAME, RawSet.DR_REPEAT_NAME, RawSet.DR_DETECT_NAME];
    return RawSet;
}());
exports.RawSet = RawSet;

});

unwrapExports(RawSet_1);
RawSet_1.RawSet;

var DomRenderProxy_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomRenderProxy = void 0;




var excludeGetSetPropertys = ['onBeforeReturnGet', 'onBeforeReturnSet', '__domrender_components', '__render', '_DomRender_isFinal', '_domRender_ref', '_rawSets', '_domRender_proxy', '_targets', '_DomRender_origin', '_DomRender_ref', '_DomRender_proxy'];
var DomRenderProxy = (function () {
    function DomRenderProxy(_domRender_origin, target, config) {
        this._domRender_origin = _domRender_origin;
        this.config = config;
        this._domRender_ref = new Map();
        this._rawSets = new Map();
        this._targets = new Set();
        if (target) {
            this._targets.add(target);
        }
    }
    DomRenderProxy.unFinal = function (obj) {
        return Types.DomRenderFinalProxy.unFinal(obj);
    };
    DomRenderProxy.final = function (obj) {
        return Types.DomRenderFinalProxy.final(obj);
    };
    DomRenderProxy.isFinal = function (obj) {
        return Types.DomRenderFinalProxy.isFinal(obj);
    };
    DomRenderProxy.prototype.run = function (objProxy) {
        var _this = this;
        this._domRender_proxy = objProxy;
        var obj = objProxy._DomRender_origin;
        if (obj) {
            Object.keys(obj).forEach(function (it) {
                var _a, _b;
                var target = obj[it];
                if (target !== undefined && target !== null && typeof target === 'object' && !DomRenderProxy.isFinal(target) && !Object.isFrozen(target) && !(obj instanceof Types.Shield)) {
                    var filter = (_b = (_a = _this.config.proxyExcludeTyps) === null || _a === void 0 ? void 0 : _a.filter(function (it) { return target instanceof it; })) !== null && _b !== void 0 ? _b : [];
                    if (filter.length === 0) {
                        var proxyAfter = _this.proxy(objProxy, target, it);
                        obj[it] = proxyAfter;
                    }
                }
            });
        }
        this._targets.forEach(function (target) {
            _this.initRender(target);
        });
    };
    DomRenderProxy.prototype.initRender = function (target) {
        var _this = this;
        var _a, _b;
        this._targets.add(target);
        var rawSets = RawSet_1.RawSet.checkPointCreates(target, this.config);
        EventManager_1.eventManager.applyEvent(this._domRender_proxy, EventManager_1.eventManager.findAttrElements(target, this.config), this.config);
        rawSets.forEach(function (it) {
            var strings = it.getUsingTriggerVariables(_this.config);
            if (strings.size <= 0) {
                _this.addRawSet('', it);
            }
            else {
                strings.forEach(function (sit) {
                    _this.addRawSet(sit, it);
                });
            }
        });
        this.render(this.getRawSets());
        (_b = (_a = this._domRender_proxy) === null || _a === void 0 ? void 0 : _a.onInitRender) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    DomRenderProxy.prototype.getRawSets = function () {
        var set = new Set();
        this._rawSets.forEach(function (v, k) {
            v.forEach(function (it) { return set.add(it); });
        });
        return Array.from(set);
    };
    DomRenderProxy.prototype.render = function (raws) {
        var _this = this;
        (raws !== null && raws !== void 0 ? raws : this.getRawSets()).forEach(function (it) {
            it.getUsingTriggerVariables(_this.config).forEach(function (path) { return _this.addRawSet(path, it); });
            if (it.point.start.isConnected && it.point.start.isConnected) {
                var rawSets = it.render(_this._domRender_proxy, _this.config);
                _this.render(rawSets);
            }
            else {
                _this.removeRawSet(it);
            }
        });
    };
    DomRenderProxy.prototype.root = function (paths, value, lastDoneExecute) {
        var _this = this;
        if (lastDoneExecute === void 0) { lastDoneExecute = true; }
        var fullPaths = [];
        if (this._domRender_ref.size > 0) {
            this._domRender_ref.forEach(function (it, key) {
                if ('_DomRender_isProxy' in key) {
                    it.forEach(function (sit) {
                        var _a;
                        var items = (_a = key._DomRender_proxy) === null || _a === void 0 ? void 0 : _a.root(paths.concat(sit), value, lastDoneExecute);
                        fullPaths.push(items.join(','));
                    });
                }
            });
        }
        else {
            var strings = paths.reverse();
            var fullPathStr_1 = strings.join('.');
            if (lastDoneExecute) {
                var iterable = this._rawSets.get(fullPathStr_1);
                var front = strings.slice(0, strings.length - 1).join('.');
                var last = strings[strings.length - 1];
                if (!isNaN(Number(last)) && Array.isArray(ScriptUtils_1.ScriptUtils.evalReturn('this.' + front, this._domRender_proxy))) {
                    var aIterable = this._rawSets.get(front);
                    if (aIterable) {
                        this.render(Array.from(aIterable));
                    }
                }
                else if (iterable) {
                    this.render(Array.from(iterable));
                }
                this._targets.forEach(function (it) {
                    if (it.nodeType === Node.DOCUMENT_FRAGMENT_NODE || it.nodeType === Node.ELEMENT_NODE) {
                        var targets = EventManager_1.eventManager.findAttrElements(it, _this.config);
                        EventManager_1.eventManager.changeVar(_this._domRender_proxy, targets, "this.".concat(fullPathStr_1));
                    }
                });
            }
            fullPaths.push(fullPathStr_1);
        }
        return fullPaths;
    };
    DomRenderProxy.prototype.set = function (target, p, value, receiver) {
        var _a, _b, _c;
        if (typeof p === 'string') {
            value = this.proxy(receiver, value, p);
        }
        target[p] = value;
        var fullPath;
        if (typeof p === 'string') {
            fullPath = this.root([p], value);
        }
        if (('onBeforeReturnSet' in receiver) && typeof p === 'string' && !((_a = this.config.proxyExcludeOnBeforeReturnSets) !== null && _a !== void 0 ? _a : []).concat(excludeGetSetPropertys).includes(p)) {
            (_c = (_b = receiver) === null || _b === void 0 ? void 0 : _b.onBeforeReturnSet) === null || _c === void 0 ? void 0 : _c.call(_b, p, value, fullPath);
        }
        return true;
    };
    DomRenderProxy.prototype.get = function (target, p, receiver) {
        var _a, _b, _c;
        if (p === '_DomRender_origin') {
            return this._domRender_origin;
        }
        else if (p === '_DomRender_ref') {
            return this._domRender_ref;
        }
        else if (p === '_DomRender_proxy') {
            return this;
        }
        else {
            var it_1 = target[p];
            if (it_1 && typeof it_1 === 'object' && ('_DomRender_isProxy' in it_1) && Object.prototype.toString.call(it_1._DomRender_origin) === '[object Date]') {
                it_1 = it_1._DomRender_origin;
            }
            if (('onBeforeReturnGet' in receiver) && typeof p === 'string' && !((_a = this.config.proxyExcludeOnBeforeReturnGets) !== null && _a !== void 0 ? _a : []).concat(excludeGetSetPropertys).includes(p)) {
                (_c = (_b = receiver) === null || _b === void 0 ? void 0 : _b.onBeforeReturnGet) === null || _c === void 0 ? void 0 : _c.call(_b, p, it_1, this.root([p], it_1, false));
            }
            return it_1;
        }
    };
    DomRenderProxy.prototype.has = function (target, p) {
        return p === '_DomRender_isProxy' || p in target;
    };
    DomRenderProxy.prototype.proxy = function (parentProxy, obj, p) {
        var _a, _b;
        var proxyTarget = ((_b = (_a = this.config.proxyExcludeTyps) === null || _a === void 0 ? void 0 : _a.filter(function (it) { return obj instanceof it; })) !== null && _b !== void 0 ? _b : []).length <= 0;
        if (proxyTarget && obj !== undefined && obj !== null && typeof obj === 'object' && !('_DomRender_isProxy' in obj) && !DomRenderProxy.isFinal(obj) && !Object.isFrozen(obj) && !(obj instanceof Types.Shield)) {
            var domRender = new DomRenderProxy(obj, undefined, this.config);
            domRender.addRef(parentProxy, p);
            var proxy = new Proxy(obj, domRender);
            domRender.run(proxy);
            return proxy;
        }
        if (proxyTarget && obj !== undefined && obj !== null && typeof obj === 'object' && ('_DomRender_isProxy' in obj) && !DomRenderProxy.isFinal(obj) && !Object.isFrozen(obj) && !(obj instanceof Types.Shield)) {
            var d = obj._DomRender_proxy;
            d.addRef(this._domRender_proxy, p);
            return obj;
        }
        else {
            return obj;
        }
    };
    DomRenderProxy.prototype.addRef = function (parent, path) {
        var _a;
        if (!this._domRender_ref.get(parent)) {
            this._domRender_ref.set(parent, new Set());
        }
        (_a = this._domRender_ref.get(parent)) === null || _a === void 0 ? void 0 : _a.add(path);
    };
    DomRenderProxy.prototype.addRawSetAndRender = function (path, rawSet) {
        this.addRawSet(path, rawSet);
        this.render([rawSet]);
    };
    DomRenderProxy.prototype.addRawSet = function (path, rawSet) {
        var _a;
        if (!this._rawSets.get(path)) {
            this._rawSets.set(path, new Set());
        }
        (_a = this._rawSets.get(path)) === null || _a === void 0 ? void 0 : _a.add(rawSet);
    };
    DomRenderProxy.prototype.removeRawSet = function (raws) {
        this._rawSets.forEach(function (it) {
            it.delete(raws);
        });
        this.garbageRawSet();
    };
    DomRenderProxy.prototype.garbageRawSet = function () {
        var _this = this;
        this._targets.forEach(function (it) {
            if (!it.isConnected) {
                _this._targets.delete(it);
            }
        });
        this._rawSets.forEach(function (it) {
            it.forEach(function (sit) {
                if (!sit.isConnected) {
                    it.delete(sit);
                }
            });
        });
    };
    return DomRenderProxy;
}());
exports.DomRenderProxy = DomRenderProxy;

});

unwrapExports(DomRenderProxy_1);
DomRenderProxy_1.DomRenderProxy;

var DomRender_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomRender = void 0;

var DomRender = (function () {
    function DomRender() {
    }
    DomRender.run = function (obj, target, config) {
        var robj = obj;
        if ('_DomRender_isProxy' in obj) {
            if (target) {
                obj._DomRender_proxy.initRender(target);
            }
            robj = obj;
            return robj;
        }
        if (!config) {
            config = { window: window };
        }
        var domRender = new DomRenderProxy_1.DomRenderProxy(obj, target, config);
        var dest = new Proxy(obj, domRender);
        robj = dest;
        domRender.run(robj);
        return robj;
    };
    return DomRender;
}());
exports.DomRender = DomRender;

});

unwrapExports(DomRender_1);
DomRender_1.DomRender;

var SimDecorator = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostConstruct = exports.PostConstruct = exports.getRouter = exports.Router = exports.RouterMetadataKey = exports.getSim = exports.Sim = exports.SimMetadataKey = exports.sims = void 0;


exports.sims = new Set();
exports.SimMetadataKey = Symbol('Sim');
var Sim = function (config) {
    if (config === void 0) { config = {}; }
    return function (target) {
        ReflectUtils_1.ReflectUtils.defineMetadata(exports.SimMetadataKey, config, target);
        exports.sims.add(target);
    };
};
exports.Sim = Sim;
var getSim = function (target) {
    if (null != target && undefined != target && typeof target === 'object') {
        target = target.constructor;
    }
    try {
        return ReflectUtils_1.ReflectUtils.getMetadata(exports.SimMetadataKey, target);
    }
    catch (e) { }
};
exports.getSim = getSim;
exports.RouterMetadataKey = Symbol('Router');
var Router = function (config) {
    return function (target) {
        ReflectUtils_1.ReflectUtils.defineMetadata(exports.RouterMetadataKey, config, target);
    };
};
exports.Router = Router;
var getRouter = function (target) {
    if (null != target && undefined != target && typeof target === 'object') {
        target = target.constructor;
    }
    try {
        return ReflectUtils_1.ReflectUtils.getMetadata(exports.RouterMetadataKey, target);
    }
    catch (e) { }
};
exports.getRouter = getRouter;
var PostConstructMetadataKey = Symbol('PostConstruct');
var PostConstruct = function (target, propertyKey, descriptor) {
    ReflectUtils_1.ReflectUtils.defineMetadata(PostConstructMetadataKey, PostConstructMetadataKey, target, propertyKey);
};
exports.PostConstruct = PostConstruct;
var getPostConstruct = function (target, propertyKey) {
    return ReflectUtils_1.ReflectUtils.getMetadata(PostConstructMetadataKey, target, propertyKey);
};
exports.getPostConstruct = getPostConstruct;

});

unwrapExports(SimDecorator);
SimDecorator.getPostConstruct;
SimDecorator.PostConstruct;
var SimDecorator_3 = SimDecorator.getRouter;
var SimDecorator_4 = SimDecorator.Router;
SimDecorator.RouterMetadataKey;
SimDecorator.getSim;
var SimDecorator_7 = SimDecorator.Sim;
SimDecorator.SimMetadataKey;
SimDecorator.sims;

var SimAtomic_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimAtomic = void 0;


var SimAtomic = (function () {
    function SimAtomic(type, simstanceManager) {
        this.type = type;
        this.simstanceManager = simstanceManager;
    }
    SimAtomic.prototype.getConfig = function (key) {
        if (key === void 0) { key = SimDecorator.SimMetadataKey; }
        return ReflectUtils_1.ReflectUtils.getMetadata(key, this.type);
    };
    SimAtomic.prototype.getConfigs = function () {
        return ReflectUtils_1.ReflectUtils.getMetadatas(this.type);
    };
    Object.defineProperty(SimAtomic.prototype, "value", {
        get: function () {
            var _a;
            return (_a = this.simstanceManager) === null || _a === void 0 ? void 0 : _a.getOrNewSim(this.type);
        },
        enumerable: false,
        configurable: true
    });
    return SimAtomic;
}());
exports.SimAtomic = SimAtomic;

});

unwrapExports(SimAtomic_1);
SimAtomic_1.SimAtomic;

var SimError_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimError = void 0;
var SimError = (function () {
    function SimError(message, name, stack) {
        this.message = message;
        this.name = name;
        this.stack = stack;
    }
    return SimError;
}());
exports.SimError = SimError;

});

unwrapExports(SimError_1);
SimError_1.SimError;

var SimNoSuch_1 = createCommonjsModule(function (module, exports) {
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimNoSuch = void 0;

var SimNoSuch = (function (_super) {
    __extends(SimNoSuch, _super);
    function SimNoSuch(message, name, stack) {
        return _super.call(this, message, name, stack) || this;
    }
    return SimNoSuch;
}(SimError_1.SimError));
exports.SimNoSuch = SimNoSuch;

});

unwrapExports(SimNoSuch_1);
SimNoSuch_1.SimNoSuch;

var ObjectUtils_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectUtils = void 0;
var ObjectUtils = (function () {
    function ObjectUtils() {
    }
    ObjectUtils.getAllProtoTypeName = function (target) {
        var data = [];
        if (target) {
            var proto = Object.getPrototypeOf(target);
            if (proto && (data = Object.keys(proto) || []).length > 0) {
                data = data.concat(this.getAllProtoTypeName(proto));
            }
        }
        return data.filter(function (it) { return it !== 'constructor'; });
    };
    ObjectUtils.getProtoTypeName = function (target) {
        var data = [];
        if (target) {
            var proto = Object.getPrototypeOf(target);
            data = Object.keys(proto) || [];
        }
        return data.filter(function (it) { return it !== 'constructor'; });
    };
    ObjectUtils.getProtoTypes = function (target) {
        var data = [];
        if (target) {
            var proto_1 = Object.getPrototypeOf(target);
            (Object.keys(proto_1) || []).filter(function (it) { return it !== 'constructor'; }).forEach(function (it) {
                data.push(proto_1[it]);
            });
        }
        return data;
    };
    ObjectUtils.seal = function (target) {
        return Object.seal(target);
    };
    ObjectUtils.isPrototypeOfTarget = function (start, target) {
        if (start && target) {
            return Object.prototype.isPrototypeOf.call(start.prototype, target);
        }
        else {
            return false;
        }
    };
    ObjectUtils.getAllProtoType = function (start) {
        var protos = [];
        while (start) {
            protos.push(start);
            start = Object.getPrototypeOf(start);
        }
        return protos;
    };
    ObjectUtils.getPrototypeOf = function (start) {
        return Object.getPrototypeOf(start);
    };
    ObjectUtils.getPrototypeKeyMap = function (target) {
        var data = new Map();
        var proto = Object.getPrototypeOf(target);
        (Object.keys(proto) || []).filter(function (it) { return it !== 'constructor'; }).forEach(function (it) {
            data.set(proto[it], it);
        });
        return data;
    };
    ObjectUtils.getPrototypeName = function (target, fnc) {
        return this.getPrototypeKeyMap(target).get(fnc);
    };
    return ObjectUtils;
}());
exports.ObjectUtils = ObjectUtils;

});

unwrapExports(ObjectUtils_1);
ObjectUtils_1.ObjectUtils;

var FunctionUtils_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionUtils = void 0;
var FunctionUtils = (function () {
    function FunctionUtils() {
    }
    FunctionUtils.getParameterNames = function (func, property) {
        var _a, _b;
        if (typeof func === 'object' && property) {
            func = func[property];
        }
        return (_b = (_a = new RegExp('(?:' + func.name + '\\s*|^)\\s*\\((.*?)\\)')
            .exec(func.toString().replace(/\n/g, ''))) === null || _a === void 0 ? void 0 : _a[1].replace(/\/\*.*?\*\//g, '').replace(/ /g, '').split(',')) !== null && _b !== void 0 ? _b : [];
    };
    FunctionUtils.eval = function (script, obj) {
        try {
            if (script && obj) {
                return Function("\"use strict\";\n                    ".concat(script, "\n                    ")).bind(obj)();
            }
            else if (script) {
                return (new Function('return ' + script))();
            }
            else {
                return null;
            }
        }
        catch (e) {
            return null;
        }
    };
    return FunctionUtils;
}());
exports.FunctionUtils = FunctionUtils;

});

unwrapExports(FunctionUtils_1);
FunctionUtils_1.FunctionUtils;

var Inject_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInject = exports.Inject = void 0;


var InjectMetadataKey = Symbol('Inject');
var Inject = function (config) {
    if (config === void 0) { config = {}; }
    return function (target, propertyKey, parameterIndex) {
        if (propertyKey && typeof target === 'object') {
            target = target.constructor;
            var existingInjectdParameters = (Reflect.getOwnMetadata(InjectMetadataKey, target, propertyKey) || []);
            existingInjectdParameters.push({ index: parameterIndex, config: config, propertyKey: propertyKey });
            ReflectUtils_1.ReflectUtils.defineMetadata(InjectMetadataKey, existingInjectdParameters, target, propertyKey);
        }
        else if (!propertyKey || typeof target === 'function') {
            var existingInjectdParameters = (ReflectUtils_1.ReflectUtils.getMetadata(InjectMetadataKey, target) || []);
            existingInjectdParameters.push({ index: parameterIndex, config: config });
            ReflectUtils_1.ReflectUtils.defineMetadata(InjectMetadataKey, existingInjectdParameters, target);
        }
    };
};
exports.Inject = Inject;
var getInject = function (target, propertyKey) {
    if (null != target && undefined != target && typeof target === 'object') {
        target = target.constructor;
    }
    if (propertyKey) {
        var parameters = Reflect.getOwnMetadata(InjectMetadataKey, target, propertyKey);
        return parameters;
    }
    else {
        return ReflectUtils_1.ReflectUtils.getMetadata(InjectMetadataKey, target);
    }
};
exports.getInject = getInject;

});

unwrapExports(Inject_1);
Inject_1.getInject;
Inject_1.Inject;

var MetaDataAtomic_1 = createCommonjsModule(function (module, exports) {
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaDataPropertyAtomic = exports.MetaDataAtomic = void 0;

var MetaDataAtomic = (function () {
    function MetaDataAtomic(target, metaData) {
        this.target = target;
        this.metaData = metaData;
    }
    return MetaDataAtomic;
}());
exports.MetaDataAtomic = MetaDataAtomic;
var MetaDataPropertyAtomic = (function (_super) {
    __extends(MetaDataPropertyAtomic, _super);
    function MetaDataPropertyAtomic(target, metaData, property, parameter) {
        var _this = _super.call(this, target, metaData) || this;
        _this.property = property;
        _this.parameter = parameter;
        return _this;
    }
    MetaDataPropertyAtomic.prototype.call = function () {
        var _a;
        var parameter = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parameter[_i] = arguments[_i];
        }
        return (_a = this.target)[this.property].apply(_a, parameter);
    };
    return MetaDataPropertyAtomic;
}(MetaDataAtomic));
exports.MetaDataPropertyAtomic = MetaDataPropertyAtomic;

});

unwrapExports(MetaDataAtomic_1);
MetaDataAtomic_1.MetaDataPropertyAtomic;
MetaDataAtomic_1.MetaDataAtomic;

var ExceptionDecorator = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTargetAndIncludeNullAndSortExceptionHandlers = exports.getExceptionHandlers = exports.getExceptionHandler = exports.ExceptionHandler = void 0;




var ExceptionHandlerMetadataKey = Symbol('ExceptionHandler');
var ExceptionHandler = function (target) {
    return ReflectUtils_1.ReflectUtils.metadata(ExceptionHandlerMetadataKey, target !== null && target !== void 0 ? target : null);
};
exports.ExceptionHandler = ExceptionHandler;
var getExceptionHandler = function (target, propertyKey) {
    return ReflectUtils_1.ReflectUtils.getMetadata(ExceptionHandlerMetadataKey, target, propertyKey);
};
exports.getExceptionHandler = getExceptionHandler;
var getExceptionHandlers = function (target) {
    return ObjectUtils_1.ObjectUtils.getAllProtoTypeName(target)
        .map(function (it) { return new MetaDataAtomic_1.MetaDataPropertyAtomic(target, (0, exports.getExceptionHandler)(target, it), it, ReflectUtils_1.ReflectUtils.getParameterTypes(target, it)); })
        .filter(function (it) { return it.metaData !== undefined; }) || [];
};
exports.getExceptionHandlers = getExceptionHandlers;
var getTargetAndIncludeNullAndSortExceptionHandlers = function (target, error) {
    return (0, exports.getExceptionHandlers)(target).filter(function (it) { return it.metaData == null || ObjectUtils_1.ObjectUtils.isPrototypeOfTarget(it.metaData, error); })
        .sort(function (a, b) { return ObjectUtils_1.ObjectUtils.getAllProtoType(a.metaData).length - ObjectUtils_1.ObjectUtils.getAllProtoType(b.metaData).length; });
};
exports.getTargetAndIncludeNullAndSortExceptionHandlers = getTargetAndIncludeNullAndSortExceptionHandlers;

});

unwrapExports(ExceptionDecorator);
ExceptionDecorator.getTargetAndIncludeNullAndSortExceptionHandlers;
ExceptionDecorator.getExceptionHandlers;
ExceptionDecorator.getExceptionHandler;
ExceptionDecorator.ExceptionHandler;

var AOPDecorator = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAround = exports.Around = exports.AroundForceReturn = exports.getProtoBefores = exports.getBefores = exports.getBefore = exports.Before = exports.getProtoAfters = exports.getAfters = exports.getAfter = exports.After = void 0;




var AfterMetadataKey = Symbol('After');
var BeforeMetadataKey = Symbol('Before');
var AroundMetadataKey = Symbol('Around');
var After = function (data) {
    return ReflectUtils_1.ReflectUtils.metadata(AfterMetadataKey, data);
};
exports.After = After;
var getAfter = function (target, propertyKey) {
    return ReflectUtils_1.ReflectUtils.getMetadata(AfterMetadataKey, target, propertyKey);
};
exports.getAfter = getAfter;
var getAfters = function (target) {
    return ObjectUtils_1.ObjectUtils.getAllProtoTypeName(target)
        .map(function (it) { return new MetaDataAtomic_1.MetaDataPropertyAtomic(target, (0, exports.getAfter)(target, it), it); })
        .filter(function (it) { return it.metaData !== undefined; }) || [];
};
exports.getAfters = getAfters;
var getProtoAfters = function (target, propertyKey, type) {
    return (0, exports.getAfters)(target).filter(function (it) { var _a; return propertyKey === it.metaData.property && type === ((_a = it.metaData.type) === null || _a === void 0 ? void 0 : _a.prototype); }) || [];
};
exports.getProtoAfters = getProtoAfters;
var Before = function (data) {
    return ReflectUtils_1.ReflectUtils.metadata(BeforeMetadataKey, data);
};
exports.Before = Before;
var getBefore = function (target, propertyKey) {
    return ReflectUtils_1.ReflectUtils.getMetadata(BeforeMetadataKey, target, propertyKey);
};
exports.getBefore = getBefore;
var getBefores = function (target) {
    return ObjectUtils_1.ObjectUtils.getAllProtoTypeName(target)
        .map(function (it) { return new MetaDataAtomic_1.MetaDataPropertyAtomic(target, (0, exports.getBefore)(target, it), it); })
        .filter(function (it) { return it.metaData !== undefined; }) || [];
};
exports.getBefores = getBefores;
var getProtoBefores = function (target, propertyKey, type) {
    return (0, exports.getBefores)(target).filter(function (it) { var _a; return propertyKey === it.metaData.property && type === ((_a = it.metaData.type) === null || _a === void 0 ? void 0 : _a.prototype); }) || [];
};
exports.getProtoBefores = getProtoBefores;
var AroundForceReturn = (function () {
    function AroundForceReturn(value) {
        this.value = value;
    }
    return AroundForceReturn;
}());
exports.AroundForceReturn = AroundForceReturn;
var Around = function (config) {
    return function (target, propertyKey, descriptor) {
        ReflectUtils_1.ReflectUtils.defineMetadata(AroundMetadataKey, config, target, propertyKey);
        var method = descriptor.value;
        descriptor.value = function () {
            var _a, _b;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log('check method');
            var before = undefined;
            var r = undefined;
            if (config.before) {
                try {
                    before = (_a = config.before) === null || _a === void 0 ? void 0 : _a.call(config, this, propertyKey, args);
                }
                catch (e) {
                    if (e instanceof AroundForceReturn) {
                        return e.value;
                    }
                }
                r = method.apply(this, before);
            }
            else {
                r = method.apply(this, args);
            }
            if (config.after) {
                try {
                    r = (_b = config.after) === null || _b === void 0 ? void 0 : _b.call(config, this, propertyKey, args, r);
                }
                catch (e) {
                    if (e instanceof AroundForceReturn) {
                        return e.value;
                    }
                }
            }
            return r;
        };
    };
};
exports.Around = Around;
var getAround = function (target, propertyKey) {
    return ReflectUtils_1.ReflectUtils.getMetadata(AroundMetadataKey, target, propertyKey);
};
exports.getAround = getAround;

});

unwrapExports(AOPDecorator);
AOPDecorator.getAround;
AOPDecorator.Around;
AOPDecorator.AroundForceReturn;
AOPDecorator.getProtoBefores;
AOPDecorator.getBefores;
AOPDecorator.getBefore;
AOPDecorator.Before;
AOPDecorator.getProtoAfters;
AOPDecorator.getAfters;
AOPDecorator.getAfter;
AOPDecorator.After;

var SimProxyHandler_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimProxyHandler = void 0;



var SimProxyHandler = (function () {
    function SimProxyHandler(simstanceManager, simOption) {
        this.simstanceManager = simstanceManager;
        this.simOption = simOption;
    }
    SimProxyHandler.prototype.get = function (target, name) {
        if (name === '_SimpleBoot_simstanceManager') {
            return this.simstanceManager;
        }
        else if (name === '_SimpleBoot_simOption') {
            return this.simOption;
        }
        else {
            return target[name];
        }
    };
    SimProxyHandler.prototype.set = function (obj, prop, value, receiver) {
        var _a;
        value = (_a = this.simstanceManager) === null || _a === void 0 ? void 0 : _a.proxy(value);
        obj[prop] = value;
        return true;
    };
    SimProxyHandler.prototype.apply = function (target, thisArg, argumentsList) {
        var _a;
        var r;
        try {
            this.aopBefore(thisArg, target);
            r = target.apply(thisArg, argumentsList);
            this.aopAfter(thisArg, target);
        }
        catch (e) {
            var inHandler = (0, ExceptionDecorator.getTargetAndIncludeNullAndSortExceptionHandlers)(thisArg, e);
            if (inHandler.length > 0) {
                inHandler[inHandler.length - 1].call(e, thisArg, target, argumentsList);
            }
            else {
                for (var i = 0; i < this.simOption.advice.length; i++) {
                    var sim = (_a = this.simstanceManager) === null || _a === void 0 ? void 0 : _a.getOrNewSim(this.simOption.advice[i]);
                    var inHandler_1 = (0, ExceptionDecorator.getTargetAndIncludeNullAndSortExceptionHandlers)(sim, e);
                    if (inHandler_1.length > 0) {
                        inHandler_1[inHandler_1.length - 1].call(e, thisArg, target, argumentsList);
                        break;
                    }
                }
            }
            console.error(e);
        }
        return r;
    };
    SimProxyHandler.prototype.aopBefore = function (obj, protoType) {
        var _a;
        var propertyName = ObjectUtils_1.ObjectUtils.getPrototypeName(obj, protoType);
        if (propertyName) {
            (0, AOPDecorator.getProtoBefores)(obj, propertyName).forEach(function (it) {
                it.call(obj, protoType, propertyName);
            });
            for (var i = 0; i < this.simOption.advice.length; i++) {
                var sim = (_a = this.simstanceManager) === null || _a === void 0 ? void 0 : _a.getOrNewSim(this.simOption.advice[i]);
                var protoBefores = (0, AOPDecorator.getProtoBefores)(sim, propertyName, Object.getPrototypeOf(obj));
                protoBefores.forEach(function (it) {
                    it.call(obj, protoType, propertyName);
                });
            }
        }
    };
    SimProxyHandler.prototype.aopAfter = function (obj, protoType) {
        var _a;
        var propertyName = ObjectUtils_1.ObjectUtils.getPrototypeName(obj, protoType);
        if (propertyName) {
            (0, AOPDecorator.getProtoAfters)(obj, propertyName).forEach(function (it) {
                it.call(obj, protoType, propertyName);
            });
            for (var i = 0; i < this.simOption.advice.length; i++) {
                var sim = (_a = this.simstanceManager) === null || _a === void 0 ? void 0 : _a.getOrNewSim(this.simOption.advice[i]);
                var protoBefores = (0, AOPDecorator.getProtoAfters)(sim, propertyName, Object.getPrototypeOf(obj));
                protoBefores.forEach(function (it) {
                    it.call(obj, protoType, propertyName);
                });
            }
        }
    };
    SimProxyHandler.prototype.has = function (target, key) {
        if (key === 'isProxy') {
            return true;
        }
        return key in target;
    };
    return SimProxyHandler;
}());
exports.SimProxyHandler = SimProxyHandler;

});

unwrapExports(SimProxyHandler_1);
SimProxyHandler_1.SimProxyHandler;

var SimstanceManager_1 = createCommonjsModule(function (module, exports) {
var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimstanceManager = void 0;










var SimstanceManager = (function () {
    function SimstanceManager(option) {
        this.option = option;
        this._storage = new Map();
        this._storage.set(SimstanceManager, this);
        this._storage.set(option.constructor, option);
        this._storage.set(SimOption_1.SimOption, option);
        this.simProxyHandler = new SimProxyHandler_1.SimProxyHandler(this, option);
    }
    Object.defineProperty(SimstanceManager.prototype, "storage", {
        get: function () {
            return this._storage;
        },
        enumerable: false,
        configurable: true
    });
    SimstanceManager.prototype.getSimAtomics = function () {
        var _this = this;
        return Array.from(this._storage.keys()).map(function (it) { return new SimAtomic_1.SimAtomic(it, _this); });
    };
    SimstanceManager.prototype.getSimConfig = function (scheme) {
        var newVar = this.getSimAtomics().filter(function (it) { var _a; return scheme && it && scheme === ((_a = it === null || it === void 0 ? void 0 : it.getConfig()) === null || _a === void 0 ? void 0 : _a.scheme); }) || [];
        return newVar;
    };
    SimstanceManager.prototype.findFirstSim = function (_a) {
        var scheme = _a.scheme, type = _a.type;
        if (scheme || type) {
            return this.getSimAtomics().filter(function (it) {
                var _a;
                var b = (scheme ? scheme === ((_a = it.getConfig()) === null || _a === void 0 ? void 0 : _a.scheme) : true) && (type ? it.value instanceof type : true);
                return b;
            })[0];
        }
    };
    SimstanceManager.prototype.getOrNewSim = function (k) {
        if (k) {
            var newVar = this.storage.get(k);
            if (!newVar) {
                newVar = this.resolve(k);
            }
            return newVar;
        }
    };
    SimstanceManager.prototype.getOrNewSims = function (k) {
        var _this = this;
        var list = new Array(0);
        this.storage.forEach(function (value, key, mapObject) {
            var sw = false;
            if (value && value instanceof k) {
                sw = true;
            }
            else if (key === k || k.isPrototypeOf(key)) {
                sw = true;
            }
            if (sw) {
                if (!value) {
                    value = _this.resolve(key);
                }
                list.push(value);
            }
        });
        return list;
    };
    SimstanceManager.prototype.register = function (target) {
        if (!this._storage.has(target)) {
            this._storage.set(target, undefined);
        }
    };
    SimstanceManager.prototype.set = function (target, obj) {
        this._storage.set(target, obj);
    };
    SimstanceManager.prototype.resolve = function (target) {
        var _this = this;
        var _a, _b, _c;
        var registed = this._storage.get(target);
        if (registed) {
            return registed;
        }
        if (this._storage.has(target) && undefined === registed) {
            var newSim = this.newSim(target, function (data) { return _this._storage.set(target, data); });
            (_a = newSim === null || newSim === void 0 ? void 0 : newSim.onSimCreate) === null || _a === void 0 ? void 0 : _a.call(newSim);
            return newSim;
        }
        var simNoSuch = new SimNoSuch_1.SimNoSuch('SimNoSuch: no simple instance ' + 'name:' + ((_c = (_b = target === null || target === void 0 ? void 0 : target.prototype) === null || _b === void 0 ? void 0 : _b.constructor) === null || _c === void 0 ? void 0 : _c.name) + ',' + target);
        console.error(simNoSuch);
        throw simNoSuch;
    };
    SimstanceManager.prototype.newSim = function (target, simCreateAfter) {
        var r = new (target.bind.apply(target, __spreadArray([void 0], this.getParameterSim({ target: target }), false)))();
        var p = this.proxy(r);
        simCreateAfter === null || simCreateAfter === void 0 ? void 0 : simCreateAfter(p);
        this.callBindPostConstruct(p);
        return p;
    };
    SimstanceManager.prototype.callBindPostConstruct = function (obj) {
        var _this = this;
        var set = new Set(ObjectUtils_1.ObjectUtils.getAllProtoTypeName(obj));
        set.forEach(function (it) {
            var _a;
            var postConstruct = (0, SimDecorator.getPostConstruct)(obj, it);
            if (postConstruct) {
                (_a = obj)[it].apply(_a, _this.getParameterSim({ target: obj, targetKey: it }));
            }
        });
    };
    SimstanceManager.prototype.getParameterSim = function (_a, otherStorage) {
        var _this = this;
        var target = _a.target, targetKey = _a.targetKey, firstCheckMaker = _a.firstCheckMaker;
        var paramTypes = ReflectUtils_1.ReflectUtils.getParameterTypes(target, targetKey);
        FunctionUtils_1.FunctionUtils.getParameterNames(target, targetKey);
        var injections = [];
        var injects = (0, Inject_1.getInject)(target, targetKey);
        injections = paramTypes.map(function (token, idx) {
            var _a;
            var _b, _c;
            var saveInject = injects === null || injects === void 0 ? void 0 : injects.find(function (it) { return it.index === idx; });
            for (var _i = 0, _d = firstCheckMaker !== null && firstCheckMaker !== void 0 ? firstCheckMaker : []; _i < _d.length; _i++) {
                var f = _d[_i];
                var firstCheckObj = f({ target: target, targetKey: targetKey }, token, idx, saveInject);
                if (undefined !== firstCheckObj) {
                    return firstCheckObj;
                }
            }
            if (saveInject) {
                var inject = saveInject.config;
                var obj = otherStorage === null || otherStorage === void 0 ? void 0 : otherStorage.get(token);
                if (!obj) {
                    var findFirstSim = _this.findFirstSim({ scheme: inject.scheme, type: inject.type });
                    obj = findFirstSim ? _this.resolve((_b = findFirstSim === null || findFirstSim === void 0 ? void 0 : findFirstSim.type) !== null && _b !== void 0 ? _b : token) : _this.resolve(token);
                }
                if (inject.applyProxy) {
                    if (inject.applyProxy.param) {
                        obj = new Proxy(obj, new ((_a = inject.applyProxy.type).bind.apply(_a, __spreadArray([void 0], inject.applyProxy.param, false)))());
                    }
                    else {
                        obj = new Proxy(obj, new inject.applyProxy.type());
                    }
                }
                return obj;
            }
            else if (token) {
                return (_c = otherStorage === null || otherStorage === void 0 ? void 0 : otherStorage.get(token)) !== null && _c !== void 0 ? _c : _this.resolve(token);
            }
        });
        return injections;
    };
    SimstanceManager.prototype.proxy = function (target) {
        var _this = this;
        if ((0, SimDecorator.getSim)(target) && (typeof target === 'object') && (!('isProxy' in target))) {
            for (var key in target) {
                target[key] = this.proxy(target[key]);
            }
            var protoTypeName = ObjectUtils_1.ObjectUtils.getProtoTypeName(target);
            protoTypeName.filter(function (it) { return typeof target[it] === 'function'; }).forEach(function (it) {
                target[it] = new Proxy(target[it], _this.simProxyHandler);
            });
            if (this.simProxyHandler) {
                target = new Proxy(target, this.simProxyHandler);
            }
        }
        if (this.option.proxy) {
            target = this.option.proxy.onProxy(target);
        }
        return target;
    };
    SimstanceManager.prototype.run = function (otherInstanceSim) {
        var _this = this;
        otherInstanceSim === null || otherInstanceSim === void 0 ? void 0 : otherInstanceSim.forEach(function (value, key) {
            _this.set(key, value);
        });
        SimDecorator.sims.forEach(function (data) {
            _this.register(data);
        });
        this.callBindPostConstruct(this);
    };
    return SimstanceManager;
}());
exports.SimstanceManager = SimstanceManager;

});

unwrapExports(SimstanceManager_1);
SimstanceManager_1.SimstanceManager;

var Intent_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intent = exports.PublishType = void 0;
(function (PublishType) {
    PublishType["DATA_PARAMETERS"] = "DATA_PARAMETERS";
    PublishType["INLINE_DATA_PARAMETERS"] = "INLINE_DATA_PARAMETERS";
})(exports.PublishType || (exports.PublishType = {}));
var Intent = (function () {
    function Intent(uri, data, event) {
        this.uri = uri;
        this.data = data;
        this.event = event;
    }
    Object.defineProperty(Intent.prototype, "scheme", {
        get: function () {
            return this.uri.split('://')[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Intent.prototype, "paths", {
        get: function () {
            var _a;
            return ((_a = this.pathname.split('/')) !== null && _a !== void 0 ? _a : []);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Intent.prototype, "fullPath", {
        get: function () {
            var _a;
            var paths = this.uri.split('://');
            return (_a = paths[paths.length >= 2 ? 1 : 0]) !== null && _a !== void 0 ? _a : '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Intent.prototype, "pathname", {
        get: function () {
            var paths = this.fullPath.split('?');
            return paths[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Intent.prototype, "query", {
        get: function () {
            var _a;
            var paths = this.fullPath.split('?');
            return (_a = paths[1]) !== null && _a !== void 0 ? _a : '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Intent.prototype, "queryParams", {
        get: function () {
            var _a;
            var param = {};
            (_a = this.query.split('&')) === null || _a === void 0 ? void 0 : _a.forEach(function (it) {
                var a = it.split('=');
                param[a[0]] = a[1];
            });
            return param;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Intent.prototype, "queryParamsAfterDecodeURI", {
        get: function () {
            var params = this.queryParams;
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    params[key] = decodeURIComponent(params[key]);
                }
            }
            return params;
        },
        enumerable: false,
        configurable: true
    });
    Intent.prototype.getPathnameData = function (urlExpression) {
        var urls = this.pathname.split('/');
        var urlExpressions = urlExpression.split('/');
        if (urls.length !== urlExpressions.length) {
            return;
        }
        var data = {};
        for (var i = 0; i < urlExpressions.length; i++) {
            var it_1 = urlExpressions[i];
            var urlit = urls[i];
            if (!it_1.startsWith(':')) {
                if (it_1 !== urlit) {
                    return;
                }
                continue;
            }
            data[it_1.slice(1)] = urlit;
        }
        return data;
    };
    return Intent;
}());
exports.Intent = Intent;

});

unwrapExports(Intent_1);
Intent_1.Intent;
Intent_1.PublishType;

var IntentManager_1 = createCommonjsModule(function (module, exports) {
var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentManager = void 0;

var IntentManager = (function () {
    function IntentManager(simstanceManager) {
        this.simstanceManager = simstanceManager;
    }
    IntentManager.prototype.publish = function (it, data) {
        var _this = this;
        if (typeof it === 'string') {
            it = new Intent_1.Intent(it, data);
        }
        var intent = it;
        var r = [];
        this.simstanceManager.getSimConfig(intent.scheme).forEach(function (data) {
            var _a, _b, _c, _d;
            var orNewSim = (_a = _this.simstanceManager) === null || _a === void 0 ? void 0 : _a.getOrNewSim(data.type);
            if (orNewSim) {
                if (intent.paths.length > 0) {
                    var callthis_1 = orNewSim;
                    var lastProp_1 = '';
                    intent.paths.filter(function (i) { return i; }).forEach(function (i) {
                        callthis_1 = orNewSim;
                        orNewSim = orNewSim === null || orNewSim === void 0 ? void 0 : orNewSim[i];
                        lastProp_1 = i;
                    });
                    if (orNewSim && typeof orNewSim === 'function') {
                        if (Intent_1.PublishType.DATA_PARAMETERS === intent.publishType) {
                            r.push(orNewSim.call(callthis_1, intent.data));
                        }
                        else if (Intent_1.PublishType.INLINE_DATA_PARAMETERS === intent.publishType) {
                            r.push(orNewSim.call.apply(orNewSim, __spreadArray([callthis_1], intent.data, false)));
                        }
                        else {
                            r.push(orNewSim.call(callthis_1, intent));
                        }
                    }
                    else if (orNewSim) {
                        callthis_1[lastProp_1] = intent.data;
                        r.push(callthis_1[lastProp_1]);
                    }
                }
                else {
                    if (Intent_1.PublishType.DATA_PARAMETERS === intent.publishType) {
                        r.push((_b = orNewSim === null || orNewSim === void 0 ? void 0 : orNewSim.intentSubscribe) === null || _b === void 0 ? void 0 : _b.call(orNewSim, intent.data));
                    }
                    else if (Intent_1.PublishType.INLINE_DATA_PARAMETERS === intent.publishType) {
                        r.push((_c = orNewSim === null || orNewSim === void 0 ? void 0 : orNewSim.intentSubscribe) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([orNewSim], intent.data, false)));
                    }
                    else {
                        r.push((_d = orNewSim === null || orNewSim === void 0 ? void 0 : orNewSim.intentSubscribe) === null || _d === void 0 ? void 0 : _d.call(orNewSim, intent));
                    }
                }
            }
        });
        return r;
    };
    return IntentManager;
}());
exports.IntentManager = IntentManager;

});

unwrapExports(IntentManager_1);
IntentManager_1.IntentManager;

var RouterModule_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterModule = void 0;
var RouterModule = (function () {
    function RouterModule(simstanceManager, router, module, routerChains) {
        if (routerChains === void 0) { routerChains = []; }
        this.simstanceManager = simstanceManager;
        this.router = router;
        this.module = module;
        this.routerChains = routerChains;
    }
    RouterModule.prototype.getModuleInstance = function () {
        return this.simstanceManager.getOrNewSim(this.module);
    };
    Object.defineProperty(RouterModule.prototype, "lastRouteChain", {
        get: function () {
            return this.routerChains[this.routerChains.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RouterModule.prototype, "lastRouteChainValue", {
        get: function () {
            return this.lastRouteChain.value;
        },
        enumerable: false,
        configurable: true
    });
    RouterModule.prototype.hasActivateInLastRoute = function (obj) {
        var _a;
        return ((_a = this.lastRouteChainValue) === null || _a === void 0 ? void 0 : _a.hasActivate(obj)) === true;
    };
    Object.defineProperty(RouterModule.prototype, "queryParams", {
        get: function () {
            if (this.intent) {
                return this.intent.queryParams;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RouterModule.prototype, "queryParamsAfterDecodeURI", {
        get: function () {
            if (this.intent) {
                return this.intent.queryParamsAfterDecodeURI;
            }
        },
        enumerable: false,
        configurable: true
    });
    return RouterModule;
}());
exports.RouterModule = RouterModule;

});

unwrapExports(RouterModule_1);
RouterModule_1.RouterModule;

var OnRoute_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnRoute = exports.OnRoute = exports.OnRouteMetadataKey = exports.onRoutes = void 0;

exports.onRoutes = new Map();
exports.OnRouteMetadataKey = Symbol('OnRoute');
var OnRoute = function (config) {
    return function (target, propertyKey, descriptor) {
        var _a;
        if (null != target && undefined != target && typeof target === 'object') {
            target = target.constructor;
        }
        if (!exports.onRoutes.get(target)) {
            exports.onRoutes.set(target, []);
        }
        (_a = exports.onRoutes.get(target)) === null || _a === void 0 ? void 0 : _a.push(propertyKey);
        ReflectUtils_1.ReflectUtils.defineMetadata(exports.OnRouteMetadataKey, config, target, propertyKey);
        ReflectUtils_1.ReflectUtils.getMetadata(exports.OnRouteMetadataKey, target, propertyKey);
    };
};
exports.OnRoute = OnRoute;
var getOnRoute = function (target, propertyKey) {
    if (null != target && undefined != target && typeof target === 'object') {
        target = target.constructor;
    }
    return ReflectUtils_1.ReflectUtils.getMetadata(exports.OnRouteMetadataKey, target, propertyKey);
};
exports.getOnRoute = getOnRoute;

});

unwrapExports(OnRoute_1);
OnRoute_1.getOnRoute;
OnRoute_1.OnRoute;
OnRoute_1.OnRouteMetadataKey;
OnRoute_1.onRoutes;

var RouterManager_1 = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterManager = void 0;





var RouterManager = (function () {
    function RouterManager(simstanceManager, rootRouter) {
        this.simstanceManager = simstanceManager;
        this.rootRouter = rootRouter;
    }
    RouterManager.prototype.routing = function (intent) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return __awaiter(this, void 0, void 0, function () {
            var routers, routerAtomic, rootRouter, executeModule, i, current, next, value, routerChain, otherStorage, _loop_1, this_1, _i, _r, _s, key, value, i, current, next, value;
            return __generator(this, function (_t) {
                switch (_t.label) {
                    case 0:
                        routers = [];
                        routerAtomic = new SimAtomic_1.SimAtomic(this.rootRouter, this.simstanceManager);
                        routerAtomic.getConfig(SimDecorator.RouterMetadataKey);
                        rootRouter = routerAtomic.value;
                        executeModule = this.getExecuteModule(routerAtomic, intent, routers);
                        new Date().getTime();
                        if (!(executeModule === null || executeModule === void 0 ? void 0 : executeModule.router)) return [3, 13];
                        executeModule.routerChains = routers;
                        if (!(((_a = executeModule.routerChains) === null || _a === void 0 ? void 0 : _a.length) && ((_b = executeModule.routerChains) === null || _b === void 0 ? void 0 : _b.length) > 0)) return [3, 4];
                        i = 0;
                        _t.label = 1;
                    case 1:
                        if (!(i < executeModule.routerChains.length)) return [3, 4];
                        current = executeModule.routerChains[i];
                        next = executeModule.routerChains[i + 1];
                        value = current.value;
                        if (!next) return [3, 3];
                        return [4, ((_c = value === null || value === void 0 ? void 0 : value.canActivate) === null || _c === void 0 ? void 0 : _c.call(value, intent, (_d = next === null || next === void 0 ? void 0 : next.value) !== null && _d !== void 0 ? _d : null))];
                    case 2:
                        _t.sent();
                        _t.label = 3;
                    case 3:
                        i++;
                        return [3, 1];
                    case 4:
                        this.activeRouterModule = executeModule;
                        if (!!(executeModule === null || executeModule === void 0 ? void 0 : executeModule.module)) return [3, 6];
                        routerChain = executeModule.routerChains[executeModule.routerChains.length - 1];
                        return [4, ((_f = (_e = routerChain === null || routerChain === void 0 ? void 0 : routerChain.value) === null || _e === void 0 ? void 0 : _e.canActivate) === null || _f === void 0 ? void 0 : _f.call(_e, intent, executeModule.getModuleInstance()))];
                    case 5:
                        _t.sent();
                        return [3, 8];
                    case 6: return [4, ((_j = (_h = (_g = executeModule.router) === null || _g === void 0 ? void 0 : _g.value) === null || _h === void 0 ? void 0 : _h.canActivate) === null || _j === void 0 ? void 0 : _j.call(_h, intent, executeModule.getModuleInstance()))];
                    case 7:
                        _t.sent();
                        _t.label = 8;
                    case 8:
                        this.activeRouterModule = executeModule;
                        otherStorage = new Map();
                        otherStorage.set(Intent_1.Intent, intent);
                        otherStorage.set(RouterModule_1.RouterModule, executeModule);
                        _loop_1 = function (key, value) {
                            var sim, simValue_1, _u, value_1, v, onRouteConfig, r;
                            return __generator(this, function (_v) {
                                switch (_v.label) {
                                    case 0:
                                        _v.trys.push([0, 5, , 6]);
                                        sim = this_1.simstanceManager.findFirstSim({ type: key });
                                        simValue_1 = sim === null || sim === void 0 ? void 0 : sim.value;
                                        if (!simValue_1) return [3, 4];
                                        _u = 0, value_1 = value;
                                        _v.label = 1;
                                    case 1:
                                        if (!(_u < value_1.length)) return [3, 4];
                                        v = value_1[_u];
                                        onRouteConfig = (0, OnRoute_1.getOnRoute)(key, v);
                                        r = undefined;
                                        if (!(onRouteConfig === null || onRouteConfig === void 0 ? void 0 : onRouteConfig.isActivateMe)) {
                                            r = (_k = simValue_1[v]) === null || _k === void 0 ? void 0 : _k.call.apply(_k, __spreadArray([simValue_1], this_1.simstanceManager.getParameterSim({ target: simValue_1, targetKey: v }, otherStorage), false));
                                        }
                                        else if ((_m = (_l = this_1.activeRouterModule) === null || _l === void 0 ? void 0 : _l.routerChains) === null || _m === void 0 ? void 0 : _m.some(function (it) { var _a, _b; return (_b = (_a = it.value) === null || _a === void 0 ? void 0 : _a.hasActivate) === null || _b === void 0 ? void 0 : _b.call(_a, simValue_1); })) {
                                            r = (_o = simValue_1[v]) === null || _o === void 0 ? void 0 : _o.call.apply(_o, __spreadArray([simValue_1], this_1.simstanceManager.getParameterSim({ target: simValue_1, targetKey: v }, otherStorage), false));
                                        }
                                        if (!(r instanceof Promise)) return [3, 3];
                                        return [4, r];
                                    case 2:
                                        _v.sent();
                                        _v.label = 3;
                                    case 3:
                                        _u++;
                                        return [3, 1];
                                    case 4: return [3, 6];
                                    case 5:
                                        _v.sent();
                                        return [3, 6];
                                    case 6: return [2];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _r = Array.from(OnRoute_1.onRoutes);
                        _t.label = 9;
                    case 9:
                        if (!(_i < _r.length)) return [3, 12];
                        _s = _r[_i], key = _s[0], value = _s[1];
                        return [5, _loop_1(key, value)];
                    case 10:
                        _t.sent();
                        _t.label = 11;
                    case 11:
                        _i++;
                        return [3, 9];
                    case 12: return [2, this.activeRouterModule];
                    case 13:
                        if (!(routers.length && routers.length > 0)) return [3, 17];
                        i = 0;
                        _t.label = 14;
                    case 14:
                        if (!(i < routers.length)) return [3, 17];
                        current = routers[i];
                        next = routers[i + 1];
                        value = current.value;
                        return [4, ((_p = value === null || value === void 0 ? void 0 : value.canActivate) === null || _p === void 0 ? void 0 : _p.call(value, intent, (_q = next === null || next === void 0 ? void 0 : next.value) !== null && _q !== void 0 ? _q : null))];
                    case 15:
                        _t.sent();
                        _t.label = 16;
                    case 16:
                        i++;
                        return [3, 14];
                    case 17: return [2, this.activeRouterModule = new RouterModule_1.RouterModule(this.simstanceManager, rootRouter, undefined, routers)];
                }
            });
        });
    };
    RouterManager.prototype.getExecuteModule = function (router, intent, parentRouters) {
        var path = intent.pathname;
        var routerConfig = router.getConfig(SimDecorator.RouterMetadataKey);
        if (routerConfig) {
            var routerStrings = parentRouters.slice(1).map(function (it) { var _a; return ((_a = it.getConfig(SimDecorator.RouterMetadataKey)) === null || _a === void 0 ? void 0 : _a.path) || ''; });
            var isRoot = this.isRootUrl(routerConfig.path, routerStrings, path);
            if (isRoot) {
                parentRouters.push(router);
                var module_1 = this.findRouting(router, routerConfig, routerStrings, intent);
                if (module_1 === null || module_1 === void 0 ? void 0 : module_1.module) {
                    module_1.intent = intent;
                    return module_1;
                }
                else if (routerConfig.routers && routerConfig.routers.length > 0) {
                    for (var _i = 0, _a = routerConfig.routers; _i < _a.length; _i++) {
                        var child = _a[_i];
                        var routerAtomic = new SimAtomic_1.SimAtomic(child, this.simstanceManager);
                        routerAtomic.getConfig(SimDecorator.RouterMetadataKey);
                        var router_1 = routerAtomic.value;
                        var executeModule = this.getExecuteModule(routerAtomic, intent, parentRouters);
                        if (router_1 && executeModule) {
                            return executeModule;
                        }
                    }
                }
            }
        }
    };
    RouterManager.prototype.isRootUrl = function (path, parentRoots, url) {
        return url.startsWith(parentRoots.join('') + (path || ''));
    };
    RouterManager.prototype.findRouting = function (router, routerData, parentRoots, intent) {
        var urlRoot = parentRoots.join('') + routerData.path;
        for (var _i = 0, _a = Object.keys(routerData.route).filter(function (it) { return !it.startsWith('_'); }); _i < _a.length; _i++) {
            var it_1 = _a[_i];
            var pathnameData = intent.getPathnameData(urlRoot + it_1);
            if (pathnameData) {
                var _b = this.findRouteProperty(routerData.route, it_1), child = _b.child, data = _b.data;
                var rm = new RouterModule_1.RouterModule(this.simstanceManager, router, child);
                rm.data = data;
                rm.pathData = pathnameData;
                return rm;
            }
        }
    };
    RouterManager.prototype.findRouteProperty = function (route, propertyName) {
        var child;
        var data;
        var routeElement = route[propertyName];
        if (typeof routeElement === 'function') {
            child = routeElement;
        }
        else if (typeof routeElement === 'string') {
            return this.findRouteProperty(route, routeElement);
        }
        else {
            child = routeElement === null || routeElement === void 0 ? void 0 : routeElement[0];
            data = routeElement === null || routeElement === void 0 ? void 0 : routeElement[1];
        }
        return {
            child: child,
            data: data
        };
    };
    return RouterManager;
}());
exports.RouterManager = RouterManager;

});

unwrapExports(RouterManager_1);
RouterManager_1.RouterManager;

var SimpleApplication_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleApplication = void 0;





var SimpleApplication = (function () {
    function SimpleApplication(rootRouter, option) {
        if (option === void 0) { option = new SimOption_1.SimOption(); }
        this.rootRouter = rootRouter;
        this.option = option;
        this.simstanceManager = new SimstanceManager_1.SimstanceManager(option);
        this.simstanceManager.storage.set(SimpleApplication, this);
        this.intentManager = new IntentManager_1.IntentManager(this.simstanceManager);
        this.routerManager = new RouterManager_1.RouterManager(this.simstanceManager, this.rootRouter);
        this.simstanceManager.storage.set(SimstanceManager_1.SimstanceManager, this.simstanceManager);
        this.simstanceManager.storage.set(IntentManager_1.IntentManager, this.intentManager);
        this.simstanceManager.storage.set(RouterManager_1.RouterManager, this.routerManager);
    }
    SimpleApplication.prototype.run = function (otherInstanceSim) {
        this.simstanceManager.run(otherInstanceSim);
    };
    SimpleApplication.prototype.publishIntent = function (i) {
        return this.intentManager.publish(i);
    };
    SimpleApplication.prototype.routing = function (i) {
        return this.routerManager.routing(i);
    };
    return SimpleApplication;
}());
exports.SimpleApplication = SimpleApplication;

});

unwrapExports(SimpleApplication_1);
SimpleApplication_1.SimpleApplication;

var LocationUtils_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationUtils = void 0;
var LocationUtils = (function () {
    function LocationUtils() {
    }
    LocationUtils.hash = function (window) {
        return window.location.hash.replace('#', '');
    };
    LocationUtils.hashPath = function (window) {
        return '/' + window.location.hash.replace('#', '').split('?')[0];
    };
    LocationUtils.hashQueryParams = function (window) {
        var s = window.location.hash.replace('#', '').split('?')[1] || '';
        return this.queryStringToMap(s);
    };
    LocationUtils.path = function (window) {
        return window.location.pathname;
    };
    LocationUtils.pathQueryParamsObject = function (window) {
        return this.queryStringToObject(window.location.search.substring(1));
    };
    LocationUtils.hashQueryParamsObject = function (window) {
        var _a;
        return this.queryStringToObject((_a = window.location.hash.split('?').pop()) !== null && _a !== void 0 ? _a : '');
    };
    LocationUtils.pathQueryParams = function (window) {
        return this.queryStringToMap(window.location.search.substring(1));
    };
    LocationUtils.queryStringToMap = function (s) {
        var params = new Map();
        var vars = s.split('&') || [];
        vars.forEach(function (it) {
            var kv = it.split('=') || [];
            if (kv[0] && kv[0].length > 0) {
                params.set(kv[0], kv[1]);
            }
        });
        return params;
    };
    LocationUtils.queryStringToObject = function (s) {
        var params = {};
        var vars = s.split('&') || [];
        vars.forEach(function (it) {
            var kv = it.split('=') || [];
            if (kv[0] && kv[0].length > 0) {
                params[kv[0]] = kv[1];
            }
        });
        return params;
    };
    return LocationUtils;
}());
exports.LocationUtils = LocationUtils;

});

unwrapExports(LocationUtils_1);
LocationUtils_1.LocationUtils;

var Navigation_1 = createCommonjsModule(function (module, exports) {
var __decorate = (commonjsGlobal && commonjsGlobal.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (commonjsGlobal && commonjsGlobal.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navigation = void 0;



var Navigation = (function () {
    function Navigation(option) {
        this.option = option;
    }
    Object.defineProperty(Navigation.prototype, "url", {
        get: function () {
            var queryParams = this.queryParamsObject;
            var queryString = Object.entries(queryParams).map(function (_a) {
                var key = _a[0], value = _a[1];
                return "".concat(key, "=").concat(value);
            }).join('&');
            var path = this.path;
            return path + (queryString.length > 0 ? ('?' + queryString) : '');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Navigation.prototype, "path", {
        get: function () {
            if (SimFrontOption_1.UrlType.path === this.option.urlType) {
                return LocationUtils_1.LocationUtils.path(this.option.window);
            }
            else if (SimFrontOption_1.UrlType.hash === this.option.urlType) {
                return LocationUtils_1.LocationUtils.hashPath(this.option.window);
            }
            else {
                return '';
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Navigation.prototype, "queryParams", {
        get: function () {
            if (SimFrontOption_1.UrlType.path === this.option.urlType) {
                return LocationUtils_1.LocationUtils.pathQueryParams(this.option.window);
            }
            else if (SimFrontOption_1.UrlType.hash === this.option.urlType) {
                return LocationUtils_1.LocationUtils.hashQueryParams(this.option.window);
            }
            else {
                return new Map();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Navigation.prototype, "queryParamsObject", {
        get: function () {
            if (SimFrontOption_1.UrlType.path === this.option.urlType) {
                return LocationUtils_1.LocationUtils.pathQueryParamsObject(this.option.window);
            }
            else if (SimFrontOption_1.UrlType.hash === this.option.urlType) {
                return LocationUtils_1.LocationUtils.hashQueryParamsObject(this.option.window);
            }
            else {
                return {};
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Navigation.prototype, "pathInfo", {
        get: function () {
            return { path: this.path, queryParams: this.queryParams };
        },
        enumerable: false,
        configurable: true
    });
    Navigation.prototype.reload = function () {
        this.option.window.dispatchEvent(new Event('popstate'));
    };
    Navigation.prototype.pathAndSearch = function () {
        return this.option.window.location.pathname + this.option.window.location.search;
    };
    Navigation.prototype.go = function (path, data, title) {
        if (data === void 0) { data = {}; }
        if (title === void 0) { title = ''; }
        if (SimFrontOption_1.UrlType.path === this.option.urlType) {
            this.option.window.history.pushState(data, title, path);
        }
        else if (SimFrontOption_1.UrlType.hash === this.option.urlType) {
            path = '#' + path.substring(1);
            this.option.window.history.pushState(data, title, path);
        }
        this.option.window.dispatchEvent(new Event('popstate'));
    };
    Navigation.prototype.state = function () {
        return this.option.window.history.state;
    };
    Navigation = __decorate([
        (0, SimDecorator.Sim)(),
        __metadata("design:paramtypes", [SimFrontOption_1.SimFrontOption])
    ], Navigation);
    return Navigation;
}());
exports.Navigation = Navigation;

});

unwrapExports(Navigation_1);
var Navigation_2 = Navigation_1.Navigation;

var View_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = void 0;
var View = (function () {
    function View(_e) {
        this._e = _e;
    }
    Object.defineProperty(View.prototype, "e", {
        get: function () {
            if (typeof this._e === 'string') {
                return document.querySelector(this._e);
            }
            else {
                return this._e;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "value", {
        get: function () {
            return this.e.value;
        },
        enumerable: false,
        configurable: true
    });
    return View;
}());
exports.View = View;

});

unwrapExports(View_1);
View_1.View;

var ViewService_1 = createCommonjsModule(function (module, exports) {
var __decorate = (commonjsGlobal && commonjsGlobal.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (commonjsGlobal && commonjsGlobal.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewService = void 0;


var ViewService = (function () {
    function ViewService() {
    }
    ViewService.prototype.e = function (selector) {
        try {
            var querySelector = document.querySelector(selector);
            if (querySelector) {
                return new View_1.View(querySelector);
            }
            else {
                return undefined;
            }
        }
        catch (e) {
            return undefined;
        }
    };
    ViewService.prototype.eI = function (selector) {
        var _a;
        return (_a = this.e("#".concat(selector))) !== null && _a !== void 0 ? _a : undefined;
    };
    ViewService.prototype.eC = function (selector) {
        var _a;
        return (_a = this.e(".".concat(selector))) !== null && _a !== void 0 ? _a : undefined;
    };
    ViewService = __decorate([
        (0, SimDecorator.Sim)(),
        __metadata("design:paramtypes", [])
    ], ViewService);
    return ViewService;
}());
exports.ViewService = ViewService;

});

unwrapExports(ViewService_1);
ViewService_1.ViewService;

var HttpService_1 = createCommonjsModule(function (module, exports) {
var __decorate = (commonjsGlobal && commonjsGlobal.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (commonjsGlobal && commonjsGlobal.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpService = void 0;

var HttpService = (function () {
    function HttpService() {
    }
    HttpService = __decorate([
        (0, SimDecorator.Sim)(),
        __metadata("design:paramtypes", [])
    ], HttpService);
    return HttpService;
}());
exports.HttpService = HttpService;

});

unwrapExports(HttpService_1);
HttpService_1.HttpService;

var InjectFrontSituationType_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectFrontSituationType = void 0;
(function (InjectFrontSituationType) {
    InjectFrontSituationType["OPENER"] = "SIMPLE_BOOT_FRONT://OPENER";
})(exports.InjectFrontSituationType || (exports.InjectFrontSituationType = {}));

});

unwrapExports(InjectFrontSituationType_1);
InjectFrontSituationType_1.InjectFrontSituationType;

var SimpleBootFront_1 = createCommonjsModule(function (module, exports) {
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleBootFront = void 0;

















var SimpleBootFront = (function (_super) {
    __extends(SimpleBootFront, _super);
    function SimpleBootFront(rootRouter, option) {
        var _this = _super.call(this, rootRouter, option) || this;
        _this.rootRouter = rootRouter;
        _this.option = option;
        _this.domRendoerExcludeProxy = [SimpleApplication_1.SimpleApplication, IntentManager_1.IntentManager, RouterManager_1.RouterManager, SimstanceManager_1.SimstanceManager, SimFrontOption_1.SimFrontOption, Navigation_1.Navigation, ViewService_1.ViewService, HttpService_1.HttpService, HTMLElement];
        _this.domRenderTargetElements = [];
        _this.domRenderTargetAttrs = [];
        _this.onDoneRouteSubject = new Map();
        _this.domRenderConfig = {
            window: option.window,
            targetElements: _this.domRenderTargetElements,
            targetAttrs: _this.domRenderTargetAttrs,
            onElementInit: function (name, obj, rawSet, targetElement) {
                var _a, _b, _c;
                var target = (_a = targetElement === null || targetElement === void 0 ? void 0 : targetElement.__render) === null || _a === void 0 ? void 0 : _a.component;
                var targetKey = 'onInit';
                var firstCheckMaker = [function (ownerObj, type, idx, saveInjectionConfig) {
                        if (InjectFrontSituationType_1.InjectFrontSituationType.OPENER === (saveInjectionConfig === null || saveInjectionConfig === void 0 ? void 0 : saveInjectionConfig.config.situationType) && rawSet.point.thisVariableName) {
                            return new Proxy(ScriptUtils_1.ScriptUtils.evalReturn(rawSet.point.thisVariableName, obj), new Types.DomRenderFinalProxy());
                        }
                    }];
                if (rawSet.point.thisVariableName) {
                    (_b = target === null || target === void 0 ? void 0 : target.onInit) === null || _b === void 0 ? void 0 : _b.call.apply(_b, __spreadArray([target], _this.simstanceManager.getParameterSim({ target: target, targetKey: targetKey, firstCheckMaker: firstCheckMaker }), false));
                }
                else {
                    (_c = target === null || target === void 0 ? void 0 : target.onInit) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([target], _this.simstanceManager.getParameterSim({ target: target, targetKey: targetKey, firstCheckMaker: firstCheckMaker }), false));
                }
            },
            onAttrInit: function (attrName, attrValue, obj, rawSet) {
                var _a, _b;
                if (attrName === 'component') {
                    var target_1 = ScriptUtils_1.ScriptUtils.evalReturn(attrValue, obj);
                    var targetKey = 'onInit';
                    var firstCheckMaker = [function (obj, type, idx, saveInjectionConfig) {
                            var _a, _b;
                            if (InjectFrontSituationType_1.InjectFrontSituationType.OPENER === (saveInjectionConfig === null || saveInjectionConfig === void 0 ? void 0 : saveInjectionConfig.config.situationType) && ((_a = target_1 === null || target_1 === void 0 ? void 0 : target_1.__domrender_component_new) === null || _a === void 0 ? void 0 : _a.creator)) {
                                return (_b = target_1 === null || target_1 === void 0 ? void 0 : target_1.__domrender_component_new) === null || _b === void 0 ? void 0 : _b.creator;
                            }
                        }];
                    if (rawSet.point.thisVariableName) {
                        (_a = target_1 === null || target_1 === void 0 ? void 0 : target_1.onInit) === null || _a === void 0 ? void 0 : _a.call.apply(_a, __spreadArray([target_1], _this.simstanceManager.getParameterSim({ target: target_1, targetKey: targetKey, firstCheckMaker: firstCheckMaker }), false));
                    }
                    else {
                        (_b = target_1 === null || target_1 === void 0 ? void 0 : target_1.onInit) === null || _b === void 0 ? void 0 : _b.call.apply(_b, __spreadArray([target_1], _this.simstanceManager.getParameterSim({ target: target_1, targetKey: targetKey, firstCheckMaker: firstCheckMaker }), false));
                    }
                }
            },
            scripts: { application: _this },
            applyEvents: [{
                    attrName: 'router-link',
                    callBack: function (elements, attrValue, obj) {
                        elements.addEventListener('click', function (event) {
                            var _a;
                            (_a = _this.getSimstanceManager().getOrNewSim(Navigation_1.Navigation)) === null || _a === void 0 ? void 0 : _a.go(attrValue);
                        });
                    }
                }],
            proxyExcludeTyps: _this.domRendoerExcludeProxy
        };
        _this.option.window.__dirname = 'simple-boot-front__dirname';
        var targetAttribute = RawSet_1.RawSet.createComponentTargetAttribute('component', function (element, attrValue, obj, rawSet) {
            return ScriptUtils_1.ScriptUtils.eval("return ".concat(attrValue), obj);
        }, function (element, attrValue, obj, rawSet) {
            if (attrValue) {
                var targetObj = ScriptUtils_1.ScriptUtils.eval("return ".concat(attrValue), obj);
                var n = element.cloneNode(true);
                var innerHTML = _this.getComponentInnerHtml(targetObj);
                n.innerHTML = innerHTML;
                return RawSet_1.RawSet.drThisCreate(n, attrValue, '', true, obj, _this.option);
            }
            var fag = _this.option.window.document.createDocumentFragment();
            return fag;
        });
        _this.domRenderTargetAttrs.push(targetAttribute);
        option.proxy = {
            onProxy: function (it) { return _this.createDomRender(it); }
        };
        return _this;
    }
    SimpleBootFront.prototype.regDoneRouteCallBack = function (callBackObj) {
        this.onDoneRouteSubject.set(callBackObj, []);
    };
    SimpleBootFront.prototype.pushDoneRouteCallBack = function (callBackObj, param) {
        var newVar = this.onDoneRouteSubject.get(callBackObj);
        if (!newVar) {
            newVar = [];
            this.onDoneRouteSubject.set(callBackObj, newVar);
        }
        newVar === null || newVar === void 0 ? void 0 : newVar.push(param);
    };
    SimpleBootFront.prototype.getComponentInnerHtml = function (targetObj) {
        var _a, _b, _c;
        var component = (0, Component_1.getComponent)(targetObj);
        var styles = ((_b = (_a = component === null || component === void 0 ? void 0 : component.styles) === null || _a === void 0 ? void 0 : _a.map(function (it) { return "<style>".concat(it, "</style>"); })) !== null && _b !== void 0 ? _b : []).join(' ');
        var template = ((_c = component === null || component === void 0 ? void 0 : component.template) !== null && _c !== void 0 ? _c : '');
        return styles + template;
    };
    SimpleBootFront.prototype.createDomRender = function (obj) {
        var component = (0, Component_1.getComponent)(obj);
        if (component && typeof obj === 'object') {
            return DomRender_1.DomRender.run(obj, undefined, this.domRenderConfig);
        }
        return obj;
    };
    SimpleBootFront.prototype.run = function (otherInstanceSim) {
        var _this = this;
        var _a, _b, _c, _d, _e;
        _super.prototype.run.call(this, otherInstanceSim);
        this.initDomRenderScripts();
        this.initDomRenderTargetElements();
        this.navigation = this.simstanceManager.getOrNewSim(Navigation_1.Navigation);
        var routerAtomic = new SimAtomic_1.SimAtomic(this.rootRouter, this.getSimstanceManager());
        var target = this.option.window.document.querySelector(this.option.selector);
        if (target && routerAtomic.value) {
            var component = routerAtomic.getConfig(Component_1.ComponentMetadataKey);
            this.option.window.document.createElement('template');
            var styles = ((_b = (_a = component === null || component === void 0 ? void 0 : component.styles) === null || _a === void 0 ? void 0 : _a.map(function (it) { return "<style>".concat(it, "</style>"); })) !== null && _b !== void 0 ? _b : []).join(' ');
            target.innerHTML = "".concat(styles, " ").concat((_c = component === null || component === void 0 ? void 0 : component.template) !== null && _c !== void 0 ? _c : '');
            var val = routerAtomic.value;
            var domRenderProxy = val._DomRender_proxy;
            domRenderProxy.initRender(target);
            (_e = (_d = val) === null || _d === void 0 ? void 0 : _d.onInit) === null || _e === void 0 ? void 0 : _e.call(_d);
        }
        this.option.window.addEventListener('intent', function (event) {
            var cevent = event;
            _this.publishIntent(new Intent_1.Intent(cevent.detail.uri, cevent.detail.data, event));
        });
        this.option.window.addEventListener('popstate', function (event) {
            var _a;
            var intent = new Intent_1.Intent((_a = _this.navigation.url) !== null && _a !== void 0 ? _a : '');
            _this.routing(intent).then(function (it) {
                _this.afterSetting();
                _this.onDoneRouteSubject.forEach(function (val, key) {
                    while (val.length) {
                        key.onDoneRoute(it, val.pop());
                    }
                });
            });
        });
        this.option.window.dispatchEvent(new Event('popstate'));
        return this;
    };
    SimpleBootFront.prototype.afterSetting = function () {
        var _this = this;
        this.option.window.document.querySelectorAll('[router-link]').forEach(function (it) {
            var _a, _b, _c, _d;
            var link = it.getAttribute('router-link');
            if (link) {
                var activeClasss = it.getAttribute('router-active-class');
                var aClasss = activeClasss === null || activeClasss === void 0 ? void 0 : activeClasss.split(',');
                var inActiveClasss = it.getAttribute('router-inactive-class');
                var iClasss = inActiveClasss === null || inActiveClasss === void 0 ? void 0 : inActiveClasss.split(',');
                if (_this.navigation.path === link) {
                    if (aClasss && aClasss.length > 0) {
                        (_a = it.classList).add.apply(_a, aClasss);
                    }
                    if (iClasss && iClasss.length > 0) {
                        (_b = it.classList).remove.apply(_b, iClasss);
                    }
                }
                else {
                    if (aClasss && aClasss.length > 0) {
                        (_c = it.classList).remove.apply(_c, aClasss);
                    }
                    if (iClasss && iClasss.length > 0) {
                        (_d = it.classList).add.apply(_d, iClasss);
                    }
                }
            }
        });
    };
    SimpleBootFront.prototype.initDomRenderScripts = function () {
        var _this = this;
        var simstanceManager = this.simstanceManager;
        Script_1.scripts.forEach(function (val, name) {
            _this.domRenderConfig.scripts[name] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var obj;
                try {
                    obj = simstanceManager.getOrNewSim(val);
                }
                catch (e) {
                    obj = simstanceManager.newSim(val);
                }
                var render = this.__render;
                var scriptRunnable = obj;
                scriptRunnable.rawSets.set(render.rawset, this);
                return scriptRunnable.run.apply(scriptRunnable, args);
            };
        });
    };
    SimpleBootFront.prototype.initDomRenderTargetElements = function () {
        var _this = this;
        var selectors = Component_1.componentSelectors;
        selectors.forEach(function (val, name) {
            var component = (0, Component_1.getComponent)(val);
            var items = RawSet_1.RawSet.createComponentTargetElement(name, function (e, o, r) {
                var newSim = _this.simstanceManager.newSim(val);
                return newSim;
            }, component === null || component === void 0 ? void 0 : component.template, component === null || component === void 0 ? void 0 : component.styles, _this.domRenderConfig.scripts, _this.domRenderConfig);
            _this.domRenderTargetElements.push(items);
        });
    };
    SimpleBootFront.prototype.getSimstanceManager = function () {
        return this.simstanceManager;
    };
    SimpleBootFront.prototype.go = function (url) {
        var _a;
        (_a = this.getSimstanceManager().getOrNewSim(Navigation_1.Navigation)) === null || _a === void 0 ? void 0 : _a.go(url);
    };
    return SimpleBootFront;
}(SimpleApplication_1.SimpleApplication));
exports.SimpleBootFront = SimpleBootFront;

});

unwrapExports(SimpleBootFront_1);
var SimpleBootFront_2 = SimpleBootFront_1.SimpleBootFront;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var template$16 = "<!--    <p>??\\_(???)_/?? - Everyone</p>-->\r\n<article>\r\n    <h1>SIMPLE-BOOT-FRONT</h1>\r\n    <p>Single Page Application Framworks for Web</p>\r\n\r\n    <ul class=\"badge-container\">\r\n        <li>\r\n            <a href=\"https://www.npmjs.com/package/simple-boot-front\" target=\"_blank\"><img dr-attr=\"{'src': 'https://img.shields.io/badge/npm-'+(this.package?.version??'')+'-blue?logo=npm'}\"></a>\r\n        </li>\r\n        <li>\r\n            <img dr-attr=\"{'src': 'https://img.shields.io/badge/license-'+(this.package?.license??'')+'-green'}\">\r\n        </li>\r\n        <li>\r\n            <a href=\"https://discord.gg/PW56dpns\" target=\"_blank\"><img src=\"https://img.shields.io/badge/discord-brightgreen?logo=discord\"></a>\r\n        </li>\r\n        <li>\r\n            <a href=\"https://github.com/visualkhh/simple-boot-front\" target=\"_blank\"><img src=\"https://img.shields.io/badge/-github-black?logo=github\"></a>\r\n        </li>\r\n    </ul>\r\n\r\n    <section>\r\n        <h2>our primary goals are</h2>\r\n        <ul>\r\n            <li>Single Page Application Framworks for Web</li>\r\n            <li>Provide a radically faster and widely accessible getting started experience for all front end.</li>\r\n        </ul>\r\n    </section>\r\n\r\n    <hr>\r\n\r\n    <section>\r\n        <h2>dependencies</h2>\r\n        <ul>\r\n            <li>dom-render <span class=\"badge bg-secondary\">Product line</span></li>\r\n            <li>simple-boot-core <span class=\"badge bg-secondary\">Product line</span></li>\r\n            <li>reflect-metadata</li>\r\n        </ul>\r\n    </section>\r\n\r\n    <hr>\r\n    <domrender-function-section></domrender-function-section>\r\n    <hr>\r\n    <core-function-section></core-function-section>\r\n    <hr>\r\n    <h1>??? life cycle</h1>\r\n    <domrender-lifecycle-section></domrender-lifecycle-section>\r\n    <hr>\r\n    <core-lifecycle-section></core-lifecycle-section>\r\n    <hr>\r\n    <front-lifecycle-section></front-lifecycle-section>\r\n    <hr>\r\n\r\n    <section>\r\n        <h2>contributors</h2>\r\n        <a href=\"https://github.com/visualkhh/simple-boot-front/graphs/contributors\">\r\n            <img src=\"https://contrib.rocks/image?repo=visualkhh/simple-boot-front\">\r\n        </a>\r\n    </section>\r\n</article>\r\n";

var style$o = "/*pre code {*/\r\n/*    overflow-x: auto ;*/\r\n/*    overflow-y:hidden;*/\r\n/*    white-space: pre;*/\r\n/*    !*white-space: nowrap;*!*/\r\n\r\n/*}*/\r\n/*code {*/\r\n/*    white-space: pre;*/\r\n/*    -webkit-overflow-scrolling: auto;*/\r\n/*}*/\r\n/*#div1, #div2, #div3, #div4 {*/\r\n/*    border: 1px solid black;*/\r\n/*    width:  250px;*/\r\n/*    margin-bottom: 12px;*/\r\n/*}*/\r\n\r\n/*#div1 { overflow-x: hidden;}*/\r\n/*#div2 { overflow-x: scroll;}*/\r\n/*#div3 { overflow-x: visible;}*/\r\n/*#div4 { overflow-x: auto;*/\r\n/*    white-space: nowrap;*/\r\n/*}*/\r\n";

// import { ProgressModal } from 'src/app/services/alert/AlertService';
var ApiService = /** @class */ (function () {
    function ApiService() {
    }
    ApiService.prototype.getBlobBase64 = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var data, blob;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(url)];
                    case 1:
                        data = _a.sent();
                        return [4 /*yield*/, data.blob()];
                    case 2:
                        blob = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve) {
                                var reader = new FileReader();
                                reader.readAsDataURL(blob);
                                reader.onloadend = function () {
                                    var base64data = reader.result;
                                    resolve(base64data);
                                };
                            })];
                }
            });
        });
    };
    ApiService.prototype.getJson = function (url) {
        return fetch(url).then(function (response) { return response.json(); });
    };
    ApiService.prototype.json = function (url, requstInit) {
        // RequestInfo
        return fetch(url, requstInit).then(function (response) { return response.json(); });
    };
    ApiService = __decorate([
        SimDecorator_7(),
        __metadata("design:paramtypes", [])
    ], ApiService);
    return ApiService;
}());

var template$15 = "<section>\r\n    <h2>${this.title}$</h2>\r\n    <dl dr-pre>\r\n        <ul>\r\n            <li>\r\n                <dt>onSimCreate()</dt>\r\n                <dd>Sim create just one call <small>(OnSimCreate.ts)</small></dd>\r\n            </li>\r\n        </ul>\r\n    </dl>\r\n</section>\r\n";

var CoreLifecycleSection = /** @class */ (function () {
    function CoreLifecycleSection() {
        this.title = 'core life cycle';
        console.log('CoreLifecycleSection constructor');
    }
    CoreLifecycleSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'core-lifecycle-section',
            template: template$15
        }),
        __metadata("design:paramtypes", [])
    ], CoreLifecycleSection);
    return CoreLifecycleSection;
}());

var template$14 = "<section>\r\n    <h2>${this.title}$</h2>\r\n    <p>simple-boot-core <a href=\"https://github.com/visualkhh/simple-boot-core\" target=\"_blank\"><img src=\"https://img.shields.io/badge/-github-black?logo=github\"></a></p>\r\n    <ul>\r\n        <li>Object management <small>(@Sim)</small></li>\r\n        <li>Dependency Injection <small>(DI)</small></li>\r\n        <li>Aspect Oriented Programming <small>(AOP)</small></li>\r\n        <li>Global Advice</li>\r\n        <li>Intent Event System</li>\r\n        <li>Route System <small>(@Router)</small></li>\r\n    </ul>\r\n</section>\r\n";

var CoreFunctionSection = /** @class */ (function () {
    function CoreFunctionSection() {
        this.title = 'core engine';
    }
    CoreFunctionSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'core-function-section',
            template: template$14
        })
    ], CoreFunctionSection);
    return CoreFunctionSection;
}());

var template$13 = "<section>\r\n    <h2>${this.title}$</h2>\r\n    <dl dr-pre>\r\n        <ul>\r\n            <li>\r\n                <dt>onChangedRender()</dt>\r\n                <dd>change rended in module event <small>(OnChangedRender.ts)</small></dd>\r\n            </li>\r\n            <li>\r\n                <dt>onFinish()</dt>\r\n                <dd>Sim create just one call <small>(OnFinish.ts)</small></dd>\r\n            </li>\r\n            <li>\r\n                <dt>onInit()</dt>\r\n                <dd>module load event <small>(OnInit.ts)</small></dd>\r\n            </li>\r\n            <li>\r\n                <dt>onDestroy()</dt>\r\n                <dd>module destroy event <small>(OnDestroy.ts)</small></dd>\r\n            </li>\r\n            <li>\r\n                <dt>onInitedChild()</dt>\r\n                <dd>module and child module inited event <small>(OnInitedChild.ts)</small></dd>\r\n            </li>\r\n        </ul>\r\n    </dl>\r\n</section>\r\n";

var FrontLifecycleSection = /** @class */ (function () {
    function FrontLifecycleSection() {
        this.title = 'front life cycle';
    }
    FrontLifecycleSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'front-lifecycle-section',
            template: template$13
        })
    ], FrontLifecycleSection);
    return FrontLifecycleSection;
}());

var template$12 = "<section>\r\n    <h2>${this.title}$</h2>\r\n    <p>dom-render <a href=\"https://github.com/visualkhh/dom-render\" target=\"_blank\"><img src=\"https://img.shields.io/badge/-github-black?logo=github\"></a></p>\r\n    <ul>\r\n        <li>Dom control and reorder</li>\r\n        <li>Immediate reaction when the value changes</li>\r\n        <li>all internal variables are managed by proxy <small class=\"text-danger\">(DomRenderProxy)</small></li>\r\n    </ul>\r\n</section>\r\n";

var DomrenderFunctionSection = /** @class */ (function () {
    function DomrenderFunctionSection() {
        this.title = 'view Template engine';
    }
    DomrenderFunctionSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-function-section',
            template: template$12
        })
    ], DomrenderFunctionSection);
    return DomrenderFunctionSection;
}());

var template$11 = "<section>\r\n    <h2>${this.title}$</h2>\r\n    <dl dr-pre>\r\n        <ul>\r\n            <li>\r\n                <dt>onInitRender()</dt>\r\n                <dd>init rendered call<small>(OnInitRender.ts)</small></dd>\r\n            </li>\r\n        </ul>\r\n    </dl>\r\n</section>\r\n";

var DomrenderLifecycleSection = /** @class */ (function () {
    function DomrenderLifecycleSection() {
        this.title = 'dom-render life cycle';
    }
    DomrenderLifecycleSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-lifecycle-section',
            template: template$11
        })
    ], DomrenderLifecycleSection);
    return DomrenderLifecycleSection;
}());

var FrontIntroduction = /** @class */ (function () {
    function FrontIntroduction(apiService) {
        this.apiService = apiService;
        console.log('FrontIntroduction constructor');
    }
    FrontIntroduction.prototype.onInit = function () {
        var _this = this;
        this.apiService.getJson('https://visualkhh.github.io/simple-boot-front/package.json').then(function (it) {
            _this.package = it;
        });
    };
    FrontIntroduction = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$16,
            styles: [style$o],
            using: [CoreLifecycleSection, FrontLifecycleSection, CoreFunctionSection, DomrenderFunctionSection, DomrenderLifecycleSection]
        }),
        __metadata("design:paramtypes", [ApiService])
    ], FrontIntroduction);
    return FrontIntroduction;
}());

var template$10 = "<div>\r\n  <header class=\"header\">\r\n    <nav class=\"input-group\">\r\n      <label class=\"input-group-text bg-white\" for=\"groupSelect\">simple-boot</label>\r\n      <select class=\"form-select form-select-lg\" id=\"groupSelect\" dr-on-init=\"this.category = $element\" dr-event-change=\"this.changeCategory($target.value)\">\r\n        <option selected=\"selected\" value=\"simple-boot-front\" dr-attr=\"{selected: this.getPath(1) === $element.value ? 'selected' : null}\">front </option>\r\n        <option value=\"dom-render\" dr-attr=\"{selected: this.getPath(1) === $element.value ? 'selected' : null}\">dom-render</option>\r\n        <option value=\"simple-boot-core\" dr-attr=\"{selected: this.getPath(1) === $element.value ? 'selected' : null}\">core</option>\r\n        <option value=\"create-simple-boot-front\" dr-attr=\"{selected: this.getPath(1) === $element.value ? 'selected' : null}\">create</option>\r\n        <option value=\"simple-boot-front-cli\" dr-attr=\"{selected: this.getPath(1) === $element.value ? 'selected' : null}\">cli</option>\r\n      </select>\r\n      <span class=\"input-group-text bg-light fs-6\">???</span>\r\n      <select class=\"form-select form-select-sm\" dr-on-init=\"this.detail = $element\" dr-event-change=\"this.changeDetail($target.value)\">\r\n        <option dr-for-of=\"this.detailsItems\" dr-complete=\"this.changeDetail(this.detail.value)\" dr-value=\"#it#\" dr-attr=\"{selected: this.navagation.path === $element.value ? 'selected' : null}\">${#it#?.split?.('/')?.[2] ?? ''}$</option>\r\n      </select>\r\n    </nav>\r\n  </header>\r\n  <main>\r\n    <route component=\"this.child\"></route>\r\n  </main>\r\n  <footer>\r\n    <ul class=\"badge-container\">\r\n      <!--      <li>-->\r\n      <!--        <a href=\"https://www.npmjs.com/package/simple-boot-front\" target=\"_blank\"><img src=\"https://img.shields.io/badge/npm-blue?logo=npm\"></a>-->\r\n      <!--      </li>-->\r\n      <!--      <li>-->\r\n      <!--        <img src=\"https://img.shields.io/badge/license-MIT-green\">-->\r\n      <!--      </li>-->\r\n      <!--      <li>-->\r\n      <!--        <a href=\"https://discord.gg/PW56dpns\" target=\"_blank\"><img src=\"https://img.shields.io/badge/discord-brightgreen?logo=discord\"></a>-->\r\n      <!--      </li>-->\r\n      <!--      <li>-->\r\n      <!--        <a href=\"https://github.com/visualkhh/simple-boot-front\" target=\"_blank\"><img src=\"https://img.shields.io/badge/-github-black?logo=github\"></a>-->\r\n      <!--      </li>-->\r\n      <li>\r\n        <a href=\"maileto:visualkhh@gmail.com\" target=\"_blank\"><img src=\"https://img.shields.io/badge/visualkhh@gmail.com-lightgrey\"></a>\r\n      </li> &nbsp;\r\n    </ul>\r\n  </footer>\r\n</div>\r\n";

var style$n = "html {\r\n    scroll-behavior: smooth;\r\n}\r\nheader {\r\n    position: -webkit-sticky; /* ????????? ???????????? ?????? */\r\n    position: sticky;\r\n    top: 0px;\r\n    /*border: #656565 1px solid;*/\r\n    /*background: white;*/\r\n    /*border-bottom-left-radius: 5px;*/\r\n    /*border-bottom-right-radius: 5px;*/\r\n}\r\n\r\n/*footer,*/\r\nmain {\r\n/*    border: #333333 1px solid;*/\r\n    color: rgb(30, 30, 30);\r\n    padding: 10px;\r\n/*    !*margin: 20px;*!*/\r\n}\r\n\r\n.code-container {\r\n    color: #a9b7c6;\r\n    background-color: #282b2e;\r\n    overflow-x: auto;\r\n    /*margin: 5px;*/\r\n    padding: 10px;\r\n    border-radius: 10px;\r\n}\r\npre code{\r\n    border-radius: 10px;\r\n}\r\n\r\n\r\nul.badge-container {\r\n    padding-left: 0px;\r\n    /*background-color: #3D99CE;*/\r\n    /*text-align: center;*/\r\n}\r\nfooter>ul.badge-container {\r\n    text-align: right;\r\n}\r\n\r\nul.badge-container > li {\r\n    display: inline-block;\r\n    /*padding: 10px 20px;*/\r\n}\r\nul.badge-container > li:hover {\r\n    /*background-color: #2779BF;*/\r\n}\r\nul.badge-container > li > a {\r\n    color: white;\r\n    text-decoration: none;\r\n}\r\n\r\n\r\nfigure figcaption {\r\n    text-align: right;\r\n    font-size: 0.5rem;\r\n}\r\n\r\n\r\n.content-container {\r\n    color: #a9b7c6;\r\n    background-color: #282b2e;\r\n    border-radius: 10px;\r\n    padding: 7px;\r\n    overflow-x: auto;\r\n}\r\n\r\n.content-container-white {\r\n    color: #282b2e;\r\n    border: #dedede solid 1px;\r\n    border-radius: 10px;\r\n    padding: 7px;\r\n    overflow-x: auto;\r\n}\r\n.no-overflow {\r\n    overflow-x: visible;\r\n    overflow-y: visible;\r\n}\r\n\r\n/*.dl-container > dt::before {*/\r\n/*    content: '- ';*/\r\n\r\n/*}*/\r\n.dl-container > dd {\r\n    padding-left: 10px;\r\n    margin-bottom: 15px;\r\n}\r\n\r\ndd > small {\r\n    font-size: 0.5rem;\r\n}\r\n\r\nli > small {\r\n    font-size: 0.5rem;\r\n}\r\n\r\n\r\n/*------------------------*/\r\n.bd-callout-info {\r\n    border-left-color: #5bc0de !important;\r\n}\r\n.bd-callout-warning {\r\n    border-left-color: #f0ad4e !important;\r\n}\r\n.bd-callout-danger {\r\n    border-left-color: #d9534f !important;\r\n}\r\n.bd-callout {\r\n    padding: 1.25rem;\r\n    margin-top: 1.25rem;\r\n    margin-bottom: 1.25rem;\r\n    border: 1px solid #e9ecef;\r\n    border-left-width: .25rem;\r\n    border-radius: .25rem;\r\n}\r\n\r\n/*domrender section------------*/\r\n.result-container {\r\n    display: flex;\r\n    flex-direction: column;\r\n}\r\n.result-container .result {\r\n    color: #282b2e;\r\n    border: #dedede solid 1px;\r\n    border-radius: 10px;\r\n    padding: 7px;\r\n    overflow-x: auto;\r\n    height: 100%;\r\n}\r\n\r\n/*.result-container .result ul, .result-container .result ol {*/\r\n.result-container .result :is(ul, ol) {\r\n    display: inline-block;\r\n    border: #c8c8c8 1px solid;\r\n    margin: 2px;\r\n}\r\n\r\n\r\nul.subsection-container {\r\n    list-style: none;\r\n    padding-left: 5px;\r\n}\r\nul.subsection-container > li {\r\n    margin-bottom: 20px;\r\n}\r\n";

var template$$ = "<article>\r\n    <h1>???? Quick start</h1>\r\n    <p>Start a project simply and quickly.</p>\r\n    <section>\r\n        <h2>create</h2>\r\n        <figure>\r\n            <figcaption>terminal</figcaption>\r\n            <pre class=\"code-container bash\">npm init simple-boot-front projectname\r\ncd projectname\r\nnpm start</pre>\r\n        </figure>\r\n    </section>\r\n\r\n    <hr>\r\n    <section>\r\n        <h2>directory structure</h2>\r\n        <p>default bundler rollup (sample template)</p>\r\n        <figure class=\"content-container-white\">\r\n            <figcaption>structure</figcaption>\r\n            <ul class=\"root-directory\">\r\n                <li>assets</li>\r\n                <li>dist <small>out put directory</small></li>\r\n                <li>src <small>source</small>\r\n                    <ul class=\"child-directory\">\r\n                        <li>pages <small>your pages</small>\r\n                            <ul class=\"child-directory\">\r\n                                <li>home.ts <small>sample page</small></li>\r\n                                <li>user.ts <small>sample page</small></li>\r\n                            </ul>\r\n                        </li>\r\n                        <li>index.css <small class=\"text-primary\">index route page css</small></li>\r\n                        <li>index.html <small class=\"text-primary\">index route page template</small></li>\r\n                        <li>index.ts <small class=\"text-primary\">simple-boot-fornt start and route point</small></li>\r\n                    </ul>\r\n                </li>\r\n                <li>types <small>typescript type</small></li>\r\n                    <ul class=\"child-directory\">\r\n                        <li>index.d.ts <small>type definition</small></li>\r\n                    </ul>\r\n                \r\n                <li>index.html <small class=\"text-primary\">start point html</small></li>\r\n                <li>package.json <small>project config</small></li>\r\n                <li>rollup.config.js <small>rollup bundler config</small></li>\r\n                <li>tsconfig.json <small>typescript config</small></li>\r\n            </ul>\r\n        </figure>\r\n    </section>\r\n    <hr>\r\n    <section>\r\n        <h2>execution command (package.json)</h2>\r\n        <figure>\r\n            <figcaption>package.json</figcaption>\r\n            <pre dr-pre class=\"code-container json\">{\r\n  \"name\": \"simple-boot-front-templates\",\r\n  \"version\": \"1.0.0\",\r\n                ...\r\n  \"scripts\": {\r\n    \"start\": \"rollup -c && sbf serve --path ./dist --port 4500\",\r\n    \"serve\": \"sbf serve --path ./dist --port 4500\",\r\n    \"serve:watch\": \"sbf serve --path ./dist --port 4500 --watch\",\r\n    \"serve:watch:all\": \"sbf serve --bundle rollup --path ./dist --port 4500 --watch\",\r\n    \"serve:proxy\": \"sbf serve --path ./dist --port 4500 --proxy http://localhost:8080\",\r\n    \"bundle\": \"rollup -c \",\r\n    \"bundle:watch\": \"rollup -c -w \"\r\n  },\r\n  \"devDependencies\": {\r\n    ...\r\n  },\r\n  \"dependencies\": {\r\n    \"simple-boot-front\": ...\r\n  }\r\n}</pre>\r\n        </figure>\r\n\r\n        <dl class=\"dl-container\">\r\n            <ul>\r\n                <li>\r\n                    <dt>start</dt>\r\n                    <dd>run the server after bundling</dd>\r\n                </li>\r\n                <li>\r\n                    <dt>serve</dt>\r\n                    <dd>run the server</dd>\r\n                </li>\r\n                <li>\r\n                    <dt>serve:watch</dt>\r\n                    <dd>run the server. It also updates the browser when there is a change in the dist directory file<span class=\"badge bg-secondary\">(detect dist directory)</span></dd>\r\n                </li>\r\n                <li>\r\n                    <dt>serve:watch:all</dt>\r\n                    <dd>\"serve:watch\" is the same and updates are made even when the source file<span class=\"badge bg-secondary\">(detect dist, src directory)</span></dd>\r\n                </li>\r\n                <li>\r\n                    <dt>serve:proxy</dt>\r\n                    <dd>run the proxy server<span class=\"badge bg-secondary\">--proxy address</span></dd>\r\n                </li>\r\n                <li>\r\n                    <dt>bundle</dt>\r\n                    <dd>rollup bundle</dd>\r\n                </li>\r\n                <li>\r\n                    <dt>bundle:watch</dt>\r\n                    <dd>rollup bundle watch</dd>\r\n                </li>\r\n            </ul>\r\n        </dl>\r\n\r\n    </section>\r\n\r\n    <hr>\r\n\r\n    <h1>???? Code description</h1>\r\n    <section>\r\n        <h2>simple-boot-front start</h2>\r\n        <figure>\r\n            <figcaption>index.html</figcaption>\r\n            <pre dr-pre class=\"code-container html\">&lt;!DOCTYPE html&gt;\r\n&lt;html lang=&quot;en&quot;&gt;\r\n&lt;head&gt;\r\n    &lt;meta charset=&quot;UTF-8&quot;&gt;\r\n    &lt;title&gt;simple-boot-front&lt;/title&gt;\r\n    &lt;script src=&quot;bundle.js&quot; defer&gt;&lt;/script&gt;\r\n    &lt;link rel=&quot;shortcut icon&quot; href=&quot;assets/favicons/favicon.ico&quot;&gt;\r\n&lt;/head&gt;\r\n&lt;body id=&quot;app&quot;&gt;\r\n&lt;/body&gt;\r\n&lt;/html&gt;\r\n</pre>\r\n        </figure>\r\n        <figure>\r\n            <figcaption>index.ts (simple-boot-front start)</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">const config = new SimFrontOption(window);\r\nconfig.setUrlType(UrlType.hash);\r\nnew SimpleBootFront(Index, config).run();</pre>\r\n        </figure>\r\n    </section>\r\n\r\n    <hr>\r\n    <section>\r\n        <h2>single page</h2>\r\n        <figure>\r\n            <figcaption>index.ts</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">import template from './index.html'\r\nimport style from './index.css'\r\n@Component({\r\n    template,\r\n    styles: [style]\r\n})\r\nexport class Index {\r\n}</pre>\r\n        </figure>\r\n    </section>\r\n\r\n    <hr>\r\n    <router-template-section dr-on-init=\"$component.title = 'multiple route pages'\"></router-template-section>\r\n</article>\r\n\r\n";

var style$m = "ul.root-directory {\r\n    list-style:none;\r\n}\r\nul.root-directory > li::before {\r\n    content: '??? ';\r\n}\r\nul.root-directory > li:first-child::before {\r\n    content: '??? ';\r\n    margin-left: -1px;\r\n    font-size: 0.9rem;\r\n}\r\n\r\nul.root-directory > li:last-child::before {\r\n    content: '??? ';\r\n    font-size: 0.9rem;\r\n    margin-left: -1px;\r\n}\r\n\r\n\r\nul.child-directory {\r\n    list-style:none;\r\n    /*padding-left: calc(50 - 10px);*/\r\n}\r\nul.child-directory > li::before {\r\n    content: ' ??? ';\r\n    padding-left: 4px;\r\n}\r\nul.child-directory > li:last-child::before {\r\n    content: '??? ';\r\n    font-size: 0.9rem;\r\n    margin-left: -1px;\r\n}\r\n\r\nul.root-directory > li small, ul.child-directory > li small {\r\n    font-size: 0.5rem;\r\n    padding-left: 3px;\r\n}\r\nul.root-directory > li small::before, ul.child-directory > li small::before {\r\n    content: '(';\r\n}\r\nul.root-directory > li small::after, ul.child-directory > li small::after {\r\n    content: ')';\r\n}\r\n";

var template$_ = "<section>\r\n    <h2>${this.title}$</h2>\r\n    <figure>\r\n        <figcaption>index.html</figcaption>\r\n        <pre dr-pre class=\"code-container html\">&lt;header&gt;\r\n    &lt;nav&gt;\r\n        &lt;ul&gt;\r\n            &lt;li&gt;\r\n                &lt;button router-link=&quot;/&quot;&gt;home&lt;/button&gt;\r\n            &lt;/li&gt;\r\n            &lt;li&gt;\r\n                &lt;button router-link=&quot;/user&quot;&gt;user&lt;/button&gt;\r\n            &lt;/li&gt;\r\n        &lt;/ul&gt;\r\n    &lt;/nav&gt;\r\n\r\n&lt;/header&gt;\r\n&lt;main&gt;\r\n    &lt;route component=&quot;this.child&quot;&gt;&lt;/route&gt;\r\n&lt;/main&gt;\r\n&lt;footer&gt;\r\n    footer\r\n&lt;/footer&gt;\r\n</pre>\r\n    </figure>\r\n    <figure>\r\n        <figcaption>router index.ts</figcaption>\r\n        <pre dr-pre class=\"code-container typescript\">@Sim()\r\n@Router({\r\n    path: '',\r\n    route: {\r\n        '/': Home,\r\n        '/users': User\r\n    }\r\n})\r\n@Component({\r\n    template,\r\n    styles: [style]\r\n})\r\nexport class Index implements RouterAction {\r\n    child?: any;\r\n    canActivate(url: any, module: any): void {\r\n        this.child = module;\r\n    }\r\n}</pre>\r\n    </figure>\r\n    \r\n</section>\r\n";

var RouterTemplateSection = /** @class */ (function () {
    function RouterTemplateSection() {
        this.title = 'Router';
    }
    RouterTemplateSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'router-template-section',
            template: template$_
        })
    ], RouterTemplateSection);
    return RouterTemplateSection;
}());

var FrontQuickstart = /** @class */ (function () {
    function FrontQuickstart() {
    }
    FrontQuickstart.prototype.onInit = function () {
    };
    FrontQuickstart = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$$,
            styles: [style$m],
            using: [RouterTemplateSection]
        }),
        __metadata("design:paramtypes", [])
    ], FrontQuickstart);
    return FrontQuickstart;
}());

var template$Z = "<article>\r\n    <h1>@Component</h1>\r\n    <p>minimum units that make up the page</p>\r\n    <section>\r\n        <h2>create</h2>\r\n        <figure>\r\n            <figcaption>template.html</figcaption>\r\n            <pre dr-pre class=\"code-container html\">&lt;h1&gt;${this.name}$&lt;/h1&gt;\r\n&lt;div dr-inner-html=&quot;this.html&quot;&gt;&lt;/div&gt;</pre>\r\n        </figure>\r\n        <figure>\r\n            <figcaption>typescript</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">@Sim()\r\n@Component({\r\n  selector: 'index',\r\n  template,\r\n  styles: [style]\r\n})\r\nexport class Index {\r\n  public name = 'index class'\r\n  public title = ''\r\n  public html = ''\r\n  public setData(title: string, html: string) {\r\n    this.title = title;\r\n    this.html = html;\r\n  }\r\n}</pre>\r\n        </figure>\r\n        \r\n    </section>\r\n\r\n    <hr>\r\n\r\n    <domrender-component-template-section dr-on-init=\"$component.title='using'\"></domrender-component-template-section>\r\n    <hr>\r\n\r\n    <section>\r\n        <h2>componentConfig</h2>\r\n        <figure>\r\n            <figcaption>ComponentConfig.ts</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">export interface ComponentConfig {\r\n    selector?: string,\r\n    template?: string,\r\n    styles?: (string)[],\r\n    using?: (ConstructorType&lt;any&gt;)[],\r\n}</pre>\r\n        </figure>\r\n        <dl class=\"dl-container\" dr-pre>\r\n            <ul>\r\n                <li>\r\n                    <dt>selector</dt>\r\n                    <dd>element name</dd>\r\n                </li>\r\n                <li>\r\n                    <dt>template</dt>\r\n                    <dd>html template string</dd>\r\n                </li>\r\n                <li>\r\n                    <dt>styles</dt>\r\n                    <dd>style string array</dd>\r\n                </li>\r\n                <li>\r\n                    <dt>using</dt>\r\n                    <dd>using components or scripts in this component</dd>\r\n                </li>\r\n            </ul>\r\n        </dl>\r\n    </section>\r\n\r\n\r\n</article>\r\n\r\n";

var style$l = "";

var template$Y = "<section>\r\n    <h2>${this.title}$</h2>\r\n    <figure>\r\n        <figcaption>typescript</figcaption>\r\n        <pre dr-pre class=\"code-container typescript\">constructor(index: Index){...}</pre>\r\n    </figure>\r\n    <figure>\r\n        <figcaption>html</figcaption>\r\n        <pre dr-pre class=\"code-container html\">&lt;index&gt;&lt;/index&gt;\r\n&lt;index dr-on-init=&quot;$component.setData(&#39;hello component&#39;, $innerHTML)&quot;&gt;&lt;/index&gt;</pre>\r\n    </figure>\r\n</section>\r\n\r\n<domrender-component-attr-section></domrender-component-attr-section>\r\n";

var template$X = "<section>\r\n    <h2>${this.title}$</h2>\r\n    <dl dr-pre>\r\n        <ul>\r\n            <li>\r\n                <dt>&lt;tagname&gt;&lt;/tagname&gt;</dt>\r\n                <dd>component selector name</dd>\r\n            </li>\r\n            <li>\r\n                <dt>dr-on-init attribute</dt>\r\n                <dd>\r\n                    component created init call script\r\n                    <ul>\r\n                        <li><span class=\"badge bg-primary\">$component</span> : component instance</li>\r\n                        <li><span class=\"badge bg-primary\">$element</span> : this element instance</li>\r\n                        <li><span class=\"badge bg-primary\">$attribute</span> : this element attribute object</li>\r\n                        <li><span class=\"badge bg-primary\">$innerHTML</span> : this element innerHTML string</li>\r\n                    </ul>\r\n                </dd>\r\n            </li>\r\n        </ul>\r\n    </dl>\r\n</section>\r\n";

var DomrenderComponentAttrSection = /** @class */ (function () {
    function DomrenderComponentAttrSection() {
        this.title = 'tagName and variable in attribute';
    }
    DomrenderComponentAttrSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-component-attr-section',
            template: template$X
        })
    ], DomrenderComponentAttrSection);
    return DomrenderComponentAttrSection;
}());

var DomrenderComponentTemplateSection = /** @class */ (function () {
    function DomrenderComponentTemplateSection() {
        this.title = 'component';
    }
    DomrenderComponentTemplateSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-component-template-section',
            template: template$Y,
            using: [DomrenderComponentAttrSection]
        })
    ], DomrenderComponentTemplateSection);
    return DomrenderComponentTemplateSection;
}());

var FrontComponent = /** @class */ (function () {
    function FrontComponent() {
    }
    FrontComponent.prototype.onInit = function () {
    };
    FrontComponent = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$Z,
            styles: [style$l],
            using: [DomrenderComponentTemplateSection]
        }),
        __metadata("design:paramtypes", [])
    ], FrontComponent);
    return FrontComponent;
}());

var template$W = "<article>\r\n    <h1>@Router</h1>\r\n    <p>page routing controller</p>\r\n    <router-template-section dr-on-init=\"$component.title = 'create'\"></router-template-section>\r\n    <hr>\r\n    <core-routermapping-section></core-routermapping-section>\r\n    <hr>\r\n    <core-routercurrent-section></core-routercurrent-section>\r\n    <hr>\r\n    <core-routerconfig-section></core-routerconfig-section>\r\n    <hr>\r\n    <core-routeraction-section></core-routeraction-section>\r\n\r\n    <hr>\r\n    <section>\r\n        <h2>include Component</h2>\r\n        <p>Route Change callback Component Data</p>\r\n        <figure>\r\n            <figcaption>include component</figcaption>\r\n            <pre dr-pre class=\"code-container html\">&lt;route component=&quot;this.child&quot;&gt;&lt;/route&gt;</pre>\r\n        </figure>\r\n    </section>\r\n    <hr>\r\n    <section>\r\n        <h2>routing in html</h2>\r\n        <figure>\r\n            <figcaption>router-link attribute</figcaption>\r\n            <pre dr-pre class=\"code-container html\">&lt;button router-link=&quot;/&quot;&gt;home&lt;/button&gt;\r\n&lt;a router-link=&quot;/home&quot; router-active-class=&quot;active&quot; router-inactive-class=&quot;inactive&quot;&gt;home&lt;/a&gt;</pre>\r\n        </figure>\r\n        <dl>\r\n            <ul>\r\n                <li>\r\n                    <dt>router-link</dt>\r\n                    <dd>Go to the page (route url)</dd>\r\n                </li>\r\n                <li>\r\n                    <dt>router-active-class</dt>\r\n                    <dd>current route path matching set className</dd>\r\n                </li>\r\n                <li>\r\n                    <dt>router-inactive-class</dt>\r\n                    <dd>current route path matching unset className</dd>\r\n                </li>\r\n            </ul>\r\n        </dl>\r\n    </section>\r\n</article>\r\n\r\n";

var style$k = "";

var template$V = "<section>\r\n    <h2>${this.title}$</h2>\r\n    <dl class=\"dl-container\">\r\n        <ul>\r\n            <li>\r\n                <dt>path</dt>\r\n                <dd>router control path</dd>\r\n            </li>\r\n            <li>\r\n                <dt>route</dt>\r\n                <dd>mapping components</dd>\r\n            </li>\r\n            <li>\r\n                <dt>routers</dt>\r\n                <dd>sub router array</dd>\r\n            </li>\r\n        </ul>\r\n    </dl>\r\n</section>\r\n";

var CoreRouterconfigSection = /** @class */ (function () {
    function CoreRouterconfigSection() {
        this.title = 'routerConfig';
    }
    CoreRouterconfigSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'core-routerconfig-section',
            template: template$V
        })
    ], CoreRouterconfigSection);
    return CoreRouterconfigSection;
}());

var template$U = "<section>\r\n    <h2>${this.title}$</h2>\r\n    <figure>\r\n        <figcaption>router.ts</figcaption>\r\n        <pre dr-pre class=\"code-container typescript\">@Sim()\r\n@Router({\r\n    path: '',\r\n    route: {\r\n        '': '/',\r\n        '/': [Home, {data: 456}],\r\n        '/user': User,\r\n        '/user/:aa/addr': [UserAddr, {data:'data'}]\r\n    },\r\n    routers: [UserRouter]\r\n})\r\nexport class AppRouter implements RouterAction {\r\n    constructor() {\r\n    }\r\n    canActivate(url: Intent, module: any): void {\r\n        console.log('AppRouter canActivate->>>>>', url, module)\r\n    }\r\n}</pre>\r\n    </figure>\r\n    \r\n</section>\r\n\r\n";

var CoreRouterTemplateSection = /** @class */ (function () {
    function CoreRouterTemplateSection() {
        this.title = 'router';
    }
    CoreRouterTemplateSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'core-router-template-section',
            template: template$U
        })
    ], CoreRouterTemplateSection);
    return CoreRouterTemplateSection;
}());

var template$T = "\r\n<section>\r\n    <h2>${this.title}$</h2>\r\n    <figure>\r\n        <figcaption>@Router</figcaption>\r\n        <pre dr-pre class=\"code-container typescript\">@Router({\r\n    path: '',\r\n    route: {\r\n        '/': Home,\r\n        '/jhon': '/user',\r\n        '/user': User,\r\n        '/user/:id': UserDetail,\r\n        '/welcom': [Welcom, {msg: 'welcom', other: 'other data'}]\r\n    }\r\n})</pre>\r\n    </figure>\r\n    <dl dr-pre>\r\n        <ul>\r\n            <li>\r\n                <dt>'path': Component(@Sim)</dt>\r\n                <dd>matches the path, this Component (@Sim) call</dd>\r\n            </li>\r\n            <li>\r\n                <dt>'path': 'path'</dt>\r\n                <dd>Redirect end point (no url changed)</dd>\r\n            </li>\r\n            <li>\r\n                <dt>'path': '/path/:data'</dt>\r\n                <dd>url path variable</dd>\r\n            </li>\r\n            <li>\r\n                <dt>'path': [Component (@Sim), Data]</dt>\r\n                <dd>call Component with Data</dd>\r\n            </li>\r\n        </ul>\r\n    </dl>\r\n</section>\r\n";

var CoreRoutermappingSection = /** @class */ (function () {
    function CoreRoutermappingSection() {
        this.title = 'router Mapping';
    }
    CoreRoutermappingSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'core-routermapping-section',
            template: template$T
        })
    ], CoreRoutermappingSection);
    return CoreRoutermappingSection;
}());

var template$S = "\r\n<section>\r\n    <h2>${this.title}$</h2>\r\n    <figure>\r\n        <figcaption>get RouterModule in Component</figcaption>\r\n        <pre dr-pre class=\"code-container typescript\">constructor(routerManager: RouterManager){\r\n    // get path data  '/user/:id'\r\n    routerManager.activeRouterModule.pathData.id;\r\n\r\n    // receive data\r\n    routerManager.activeRouterModule.data\r\n}</pre>\r\n    </figure>\r\n</section>\r\n";

var CoreRoutercurrentSection = /** @class */ (function () {
    function CoreRoutercurrentSection() {
        this.title = 'current Route (RouterModule)';
    }
    CoreRoutercurrentSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'core-routercurrent-section',
            template: template$S
        })
    ], CoreRoutercurrentSection);
    return CoreRoutercurrentSection;
}());

var template$R = "<section>\r\n    <h2>${this.title}$</h2>\r\n    <p>Route Change callback in Router</p>\r\n    <figure>\r\n        <figcaption>simple-boot-core/route/RouterAction</figcaption>\r\n        <pre dr-pre class=\"code-container typescript\">export interface RouterAction {\r\n    canActivate(url: Intent, module: any): void;\r\n}</pre>\r\n    </figure>\r\n</section>\r\n";

var CoreRouteractionSection = /** @class */ (function () {
    function CoreRouteractionSection() {
        this.title = 'routerAction';
    }
    CoreRouteractionSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'core-routeraction-section',
            template: template$R
        })
    ], CoreRouteractionSection);
    return CoreRouteractionSection;
}());

var FrontRouter = /** @class */ (function () {
    function FrontRouter() {
    }
    FrontRouter.prototype.onInit = function () {
    };
    FrontRouter = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$W,
            styles: [style$k],
            using: [RouterTemplateSection, CoreRouterconfigSection, CoreRouterTemplateSection, CoreRoutermappingSection, CoreRoutercurrentSection, CoreRouteractionSection]
        }),
        __metadata("design:paramtypes", [])
    ], FrontRouter);
    return FrontRouter;
}());

var template$Q = "<article>\r\n    <h1>@Script</h1>\r\n    <p>define script instructions and call</p>\r\n    <section>\r\n        <h2>create</h2>\r\n        <p>extends ScriptRunnable class (create 'run' method) implements</p>\r\n        <figure>\r\n            <figcaption>define Script class</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">\r\n@Sim()\r\n@Script({\r\n    name: 'calc'\r\n})\r\nexport class CalcScript extends ScriptRunnable {\r\n    constructor() {\r\n        super();\r\n    }\r\n\r\n    run(data1: number, data2: nuber): any {\r\n        return data1 + data2;\r\n    }\r\n\r\n}</pre>\r\n        </figure>\r\n    </section>\r\n\r\n    <hr>\r\n\r\n    <section>\r\n        <h2>using</h2>\r\n        <figure>\r\n            <figcaption>class</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">counstructor(calcScript: CalcScript) {...}\r\ncounstructor(scriptService: ScriptService) {\r\n  const script = scriptService.getScript('calc');\r\n}</pre>\r\n        </figure>\r\n        <figure>\r\n            <figcaption>html</figcaption>\r\n            <pre dr-pre class=\"code-container html\">&lt;div&gt;${$scripts.calc(1, 4)}$&lt;/div&gt;\r\n&lt;div dr-if=&quot;$scripts.calc(1, 3) === 3&quot;&gt; is 3&lt;/div&gt;</pre>\r\n        </figure>\r\n    </section>\r\n    <hr>\r\n    <section>\r\n        <h2>scriptConfig</h2>\r\n        <figure>\r\n            <figcaption>ScriptConfig.ts</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">export interface ScriptConfig {\r\n    name?: string,\r\n    using?: (ConstructorType&lt;any&gt;)[],\r\n}</pre>\r\n        </figure>\r\n        <dl class=\"dl-container\">\r\n            <ul>\r\n                <li>\r\n                    <dt>name</dt>\r\n                    <dd>script name</dd>\r\n                </li>\r\n                <li>\r\n                    <dt>using</dt>\r\n                    <dd>using components or scripts in this component</dd>\r\n                </li>\r\n            </ul>\r\n        </dl>\r\n    </section>\r\n    <hr>\r\n    <section>\r\n        <h2>change Data and Ref re render</h2>\r\n        <p>If the data changes, re render the place you are referring to.</p>\r\n        <p>???? example: i18n Script</p>\r\n        <figure>\r\n            <figcaption>html</figcaption>\r\n            <pre dr-pre class=\"code-container html\">&lt;div&gt;${$scripts.i18n('hello')}$&lt;/div&gt;</pre>\r\n        </figure>\r\n        <figure>\r\n            <figcaption>I18nScript.ts</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">@Sim()\r\n@Script({\r\n    name: 'i18n'\r\n})\r\nexport class I18nScript extends ScriptRunnable {\r\n    public language?: Language;\r\n    constructor(public i18nService: I18nService) {\r\n        super();\r\n        i18nService.subject.subscribe(it => {\r\n            this.language = it;\r\n            this.render();  //  ref target  rerender\r\n        })\r\n    }\r\n    run(key: string): any {\r\n        return this.language?.defaultData?.[key] ?? key;\r\n    }\r\n}</pre>\r\n        </figure>\r\n        <figure>\r\n            <figcaption>I18nService.ts</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">import enUS from '@generate/i18n/message_en_US.json';\r\nimport koKR from '@generate/i18n/message_ko_KR.json';\r\nimport { ApiService } from 'services/ApiService';\r\nimport { Sim } from 'simple-boot-core/decorators/SimDecorator';\r\nimport { OnSimCreate } from 'simple-boot-core/lifecycle/OnSimCreate';\r\nimport { IntentManager } from 'simple-boot-core/intent/IntentManager';\r\nimport { BehaviorSubject } from 'rxjs';\r\nexport type Language = {\r\n    key: string;\r\n    param: string;\r\n    alt: string;\r\n    title: string;\r\n    defaultData: {[k: string]: string  }\r\n}\r\n\r\n\r\nexport const languages: Language[] = [\r\n    {\r\n        key: 'us',\r\n        param: 'en_US',\r\n        alt: 'United States',\r\n        title: 'English (US)',\r\n        defaultData: enUS\r\n    },\r\n\r\n    {\r\n        key: 'kr',\r\n        param: 'ko_KR',\r\n        alt: 'Korea',\r\n        title: '?????????',\r\n        defaultData: koKR\r\n    }\r\n];\r\n\r\n@Sim()\r\nexport class I18nService implements OnSimCreate {\r\n    public subject = new BehaviorSubject<language |undefined>(this.getData());\r\n    constructor(public apiService: ApiService, public indentManager: IntentManager) {\r\n    }\r\n\r\n    onSimCreate(): void {\r\n        const country = this.currentCountry;\r\n        this.changeCountry(country);\r\n    }\r\n\r\n    public changeCountry(country: string) {\r\n        this.apiService.get(`/langs/message_${country}.json`)\r\n            .then(data => {\r\n                const findLangguage = this.getData(country);\r\n                if (findLangguage) {\r\n                    findLangguage.defaultData = data;\r\n                    this.subject.next(findLangguage);\r\n                }\r\n            })\r\n    }\r\n\r\n    public getData(key: string = this.currentCountry) {\r\n        return languages.find(it => it.key === key);\r\n    }\r\n\r\n    public getDatas() {\r\n        return languages;\r\n    }\r\n\r\n    public get currentCountry() {\r\n        return navigator.language.toLowerCase().replace('-', '_').split('_') [1] ?? 'us'\r\n    }\r\n\r\n}\r\n</language></pre>\r\n        </figure>\r\n    </section>\r\n</article>\r\n\r\n";

var style$j = "";

var FrontScript = /** @class */ (function () {
    function FrontScript() {
    }
    FrontScript.prototype.onInit = function () {
    };
    FrontScript = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$Q,
            styles: [style$j]
        }),
        __metadata("design:paramtypes", [])
    ], FrontScript);
    return FrontScript;
}());

var template$P = "<article>\r\n    <h1>DOM-RENDER</h1>\r\n    <p>view template Engine</p>\r\n\r\n    <ul class=\"badge-container\">\r\n        <li>\r\n            <a href=\"https://www.npmjs.com/package/dom-render\" target=\"_blank\"><img dr-attr=\"{'src': 'https://img.shields.io/badge/npm-'+(this.package?.version??'')+'-blue?logo=npm'}\"></a>\r\n        </li>\r\n        <li>\r\n            <img dr-attr=\"{'src': 'https://img.shields.io/badge/license-'+(this.package?.license??'')+'-green'}\">\r\n        </li>\r\n        <li>\r\n            <a href=\"https://github.com/visualkhh/dom-render\" target=\"_blank\"><img src=\"https://img.shields.io/badge/-github-black?logo=github\"></a>\r\n        </li>\r\n    </ul>\r\n\r\n    <domrender-function-section></domrender-function-section>\r\n\r\n    <hr>\r\n\r\n    <section>\r\n        <h2>dependencies</h2>\r\n        <ul>\r\n            <li>0 zero dependency</li>\r\n        </ul>\r\n    </section>\r\n\r\n    <hr>\r\n    <domrender-lifecycle-section></domrender-lifecycle-section>\r\n    <section>\r\n        <h2>contributors</h2>\r\n        <a href=\"https://github.com/visualkhh/dom-render/graphs/contributors\">\r\n            <img src=\"https://contrib.rocks/image?repo=visualkhh/dom-render\">\r\n        </a>\r\n    </section>\r\n</article>\r\n";

var style$i = "";

var DomrenderIntroduction = /** @class */ (function () {
    function DomrenderIntroduction(apiService) {
        this.apiService = apiService;
    }
    DomrenderIntroduction.prototype.onInit = function () {
        var _this = this;
        this.apiService.getJson('https://visualkhh.github.io/dom-render/package.json').then(function (it) {
            _this.package = it;
        });
    };
    DomrenderIntroduction = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$P,
            styles: [style$i],
            using: [DomrenderFunctionSection, DomrenderLifecycleSection]
        }),
        __metadata("design:paramtypes", [ApiService])
    ], DomrenderIntroduction);
    return DomrenderIntroduction;
}());

var template$O = "<article>\r\n    <h1>???? Quick start</h1>\r\n    <p>Start a project simply and quickly.</p>\r\n    <section>\r\n        <h2>create</h2>\r\n        <figure>\r\n            <figcaption>terminal</figcaption>\r\n            <pre class=\"code-container bash\">npm install dom-render</pre>\r\n        </figure>\r\n    </section>\r\n\r\n    <hr>\r\n    <h1>???? Code description</h1>\r\n    <section>\r\n        <h2>simple-boot-front start</h2>\r\n        <figure>\r\n            <figcaption>index.html</figcaption>\r\n            <pre dr-pre class=\"code-container html\">&lt;!DOCTYPE html&gt;\r\n&lt;html lang=&quot;en&quot;&gt;\r\n&lt;head&gt;\r\n    &lt;meta charset=&quot;UTF-8&quot;&gt;\r\n    &lt;title&gt;simple-boot-front&lt;/title&gt;\r\n    &lt;script src=&quot;bundle.js&quot; defer&gt;&lt;/script&gt;\r\n    &lt;link rel=&quot;shortcut icon&quot; href=&quot;assets/favicons/favicon.ico&quot;&gt;\r\n&lt;/head&gt;\r\n&lt;body id=&quot;app&quot;&gt;\r\n    &lt;div&gt;name: ${this.name}$ &lt;/div&gt;\r\n&lt;/body&gt;\r\n&lt;/html&gt;\r\n</pre>\r\n        </figure>\r\n        <figure>\r\n            <figcaption>index.ts (dom-render start)</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">const target = document.querySelector('#app');\r\nconst data = DomRender.run({name: 'my name is dom-render'}, target);\r\ndata.name = 'modify name';</pre>\r\n        </figure>\r\n    </section>\r\n\r\n    <hr>\r\n    <section>\r\n        <h2>Expressions (calc and innerTEXT)</h2>\r\n        <p dr-pre>${...}$</p>\r\n        <figure dr-pre class=\"content-container-white\">\r\n            <figcaption>${...}$</figcaption>\r\n            <dl>\r\n                <ul>\r\n                    <li>\r\n                        <dt>start</dt>\r\n                        <dl>${</dl>\r\n                    </li>\r\n                    <li>\r\n                        <dt>end</dt>\r\n                        <dl>}$</dl>\r\n                    </li>\r\n                </ul>\r\n            </dl>\r\n        </figure>\r\n    </section>\r\n    <section>\r\n        <h2>Expressions (calc and innerHTML)</h2>\r\n        <p dr-pre>#{...}#</p>\r\n        <figure dr-pre class=\"content-container-white\">\r\n            <figcaption>#{...}#</figcaption>\r\n            <dl>\r\n                <ul>\r\n                    <li>\r\n                        <dt>start</dt>\r\n                        <dl>#{</dl>\r\n                    </li>\r\n                    <li>\r\n                        <dt>end</dt>\r\n                        <dl>}#</dl>\r\n                    </li>\r\n                </ul>\r\n            </dl>\r\n        </figure>\r\n    </section>\r\n</article>\r\n\r\n";

var style$h = "";

var DomrenderQuickstart = /** @class */ (function () {
    function DomrenderQuickstart() {
    }
    DomrenderQuickstart.prototype.onInit = function () {
    };
    DomrenderQuickstart = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$O,
            styles: [style$h],
            using: [RouterTemplateSection]
        }),
        __metadata("design:paramtypes", [])
    ], DomrenderQuickstart);
    return DomrenderQuickstart;
}());

var template$N = "<article>\r\n    <h1>?????? Function ????</h1>\r\n    <p>provides a powerful function for dome control</p>\r\n<!--    <section>-->\r\n<!--        <div class=\"bd-callout bd-callout-info\">-->\r\n<!--            <h5 id=\"conveying-meaning-to-assistive-technologies\">Conveying meaning to assistive technologies</h5>-->\r\n<!--            <p>Using color to add meaning only provides a visual indication, which will not be conveyed to users of assistive technologies ??? such as screen readers. Ensure that information denoted by the color is either obvious from the content itself (e.g. the visible text), or is included through alternative means, such as additional text hidden with the <code>.visually-hidden</code> class.-->\r\n<!--            </p></div>-->\r\n<!--    </section>-->\r\n\r\n    <domrender-expression-section></domrender-expression-section>\r\n    <hr>\r\n    <domrender-dr-if-section></domrender-dr-if-section>\r\n    <hr>\r\n    <domrender-dr-repeat-section></domrender-dr-repeat-section>\r\n    <hr>\r\n    <domrender-dr-for-section></domrender-dr-for-section>\r\n    <hr>\r\n    <domrender-dr-for-of-section></domrender-dr-for-of-section>\r\n    <hr>\r\n    <domrender-dr-inner-text-section></domrender-dr-inner-text-section>\r\n    <hr>\r\n    <domrender-dr-inner-html-section></domrender-dr-inner-html-section>\r\n    <hr>\r\n\r\n    <h1>?????? dr-event</h1>\r\n    <ul class=\"subsection-container\">\r\n        <li><domrender-event-attribute-values-section></domrender-event-attribute-values-section></li>\r\n        <li><domrender-dr-event-click-section></domrender-dr-event-click-section></li>\r\n        <li><domrender-dr-event-mousedown-section></domrender-dr-event-mousedown-section></li>\r\n        <li><domrender-dr-event-mouseup-section></domrender-dr-event-mouseup-section></li>\r\n        <li><domrender-dr-event-dblclick-section></domrender-dr-event-dblclick-section></li>\r\n        <li><domrender-dr-event-mouseover-section></domrender-dr-event-mouseover-section></li>\r\n        <li><domrender-dr-event-mousemove-section></domrender-dr-event-mousemove-section></li>\r\n        <li><domrender-dr-event-mouseenter-section></domrender-dr-event-mouseenter-section></li>\r\n        <li><domrender-dr-event-mouseleave-section></domrender-dr-event-mouseleave-section></li>\r\n        <li><domrender-dr-event-contextmenu-section></domrender-dr-event-contextmenu-section></li>\r\n        <li><domrender-dr-event-keyup-section></domrender-dr-event-keyup-section></li>\r\n        <li><domrender-dr-event-keydown-section></domrender-dr-event-keydown-section></li>\r\n        <li><domrender-dr-event-keypress-section></domrender-dr-event-keypress-section></li>\r\n        <li><domrender-dr-event-change-section></domrender-dr-event-change-section></li>\r\n        <li><domrender-dr-event-input-section></domrender-dr-event-input-section></li>\r\n        <li><domrender-dr-event-submit-section></domrender-dr-event-submit-section></li>\r\n        <li><domrender-dr-event-resize-section></domrender-dr-event-resize-section></li>\r\n        <li><domrender-dr-event-focus-section></domrender-dr-event-focus-section></li>\r\n        <li><domrender-dr-event-blur-section></domrender-dr-event-blur-section></li>\r\n        <li><domrender-dr-window-event-popstate-section></domrender-dr-window-event-popstate-section></li>\r\n        <li><domrender-dr-window-event-resize-section></domrender-dr-window-event-resize-section></li>\r\n        <li><domrender-dr-event-section></domrender-dr-event-section></li>\r\n    </ul>\r\n    <hr>\r\n    <domrender-dr-attr-section></domrender-dr-attr-section>\r\n    <hr>\r\n    <domrender-dr-class-section></domrender-dr-class-section>\r\n    <hr>\r\n    <domrender-dr-style-section></domrender-dr-style-section>\r\n    <hr>\r\n    <domrender-dr-strip-section></domrender-dr-strip-section>\r\n    <hr>\r\n    <section>\r\n        <h2>dr-on-init</h2>\r\n        <figure>\r\n            <figcaption>example</figcaption>\r\n            <pre dr-pre class=\"code-container html\">&lt;input dr-on-init=&quot;this.onInitElement&quot;&gt;</pre>\r\n        </figure>\r\n    </section>\r\n    <hr>\r\n    <section>\r\n        <h2>dr-before, dr-after</h2>\r\n        <figure>\r\n            <figcaption>example</figcaption>\r\n            <pre dr-pre class=\"code-container html\">&lt;div dr-before=&quot;console.log(&#39;process before&#39;)&quot; dr-after=&quot;console.log(&#39;process after&#39;)&quot;&gt;&lt;/div&gt;</pre>\r\n        </figure>\r\n    </section>\r\n    <hr>\r\n    <section>\r\n        <h2>dr-complete</h2>\r\n        <figure>\r\n            <figcaption>example</figcaption>\r\n            <pre dr-pre class=\"code-container html\">&lt;select dr-value-link=&quot;this.currentContry&quot; dr-event-change=&quot;this.contryChange($event)&quot;&gt;\r\n    &lt;option dr-for-of=&quot;this.languages&quot; dr-value=&quot;#it#.key&quot; dr-complete=&quot;this.currentContry=&#39;defaultValue&#39;&quot;&gt;${#it#.title}$&lt;/option&gt;\r\n&lt;/select&gt;</pre>\r\n        </figure>\r\n    </section>\r\n\r\n</article>\r\n\r\n";

var style$g = "";

var template$M = "<section>\r\n    <h2>expression</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-on-init=\"this.templateCodeContainer\" dr-pre class=\"code-container html m-0\">first: ${this.first}$ &lt;br&gt;\r\nfullName: ${this.getFullName()}$&lt;br&gt;\r\n${this.getStrongTagFullName()}$&lt;br&gt;\r\n#{this.getStrongTagFullName()}#</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">first = 'simple';\r\nmiddle = 'boot';\r\nlast = 'front';\r\ngetFullName() {\r\n    return this.first + this.middle + this.last;\r\n}\r\ngetStrongTagFullName() {\r\n    return `&lt;strong&gt;${this.getFullName()}&lt;/strong&gt;`\r\n}</pre>\r\n                </figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                    first: ${this.first}$ <br>\r\n                    fullName: ${this.getFullName()}$<br>\r\n                    ${this.getStrongTagFullName()}$<br>\r\n                    #{this.getStrongTagFullName()}#\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderExpressionSection = /** @class */ (function () {
    function DomrenderExpressionSection() {
        this.first = 'simple';
        this.middle = 'boot';
        this.last = 'front';
    }
    DomrenderExpressionSection.prototype.getFullName = function () {
        return this.first + this.middle + this.last;
    };
    DomrenderExpressionSection.prototype.onInitRender = function () {
    };
    DomrenderExpressionSection.prototype.getStrongTagFullName = function () {
        return "<strong>".concat(this.getFullName(), "</strong>");
    };
    DomrenderExpressionSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-expression-section',
            template: template$M
        })
    ], DomrenderExpressionSection);
    return DomrenderExpressionSection;
}());

var template$L = "<section>\r\n    <h2>dr-if</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;button dr-event-click=&quot;this.toggle()&quot;&gt;toggle&lt;/button&gt;\r\n&lt;img dr-if=&quot;this.isVisible&quot; width=&quot;50&quot; height=&quot;50&quot; src=&quot;https://www.npmjs.com/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci8wYzVmYzU4MDczY2FiMWUxMGQ1NzhiZmYxY2RhY2ZmMT9zaXplPTQ5NiZkZWZhdWx0PXJldHJvIn0.KfOeIzhFTipcdnU39eQXEbtFEFUPZxcxn9tDq3_o5z0&quot;&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">isVisible = true;\r\ntoggle() {\r\n    return this.isVisible = !this.isVisible;\r\n}</pre>\r\n                </figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <button dr-event-click=\"this.toggle()\">toggle</button>\r\n                        <img dr-if=\"this.isVisible\" width=\"50\" height=\"50\" src=\"https://www.npmjs.com/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci8wYzVmYzU4MDczY2FiMWUxMGQ1NzhiZmYxY2RhY2ZmMT9zaXplPTQ5NiZkZWZhdWx0PXJldHJvIn0.KfOeIzhFTipcdnU39eQXEbtFEFUPZxcxn9tDq3_o5z0\">\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrIfSection = /** @class */ (function () {
    function DomrenderDrIfSection() {
        this.isVisible = true;
    }
    DomrenderDrIfSection.prototype.toggle = function () {
        return this.isVisible = !this.isVisible;
    };
    DomrenderDrIfSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-if-section',
            template: template$L
        })
    ], DomrenderDrIfSection);
    return DomrenderDrIfSection;
}());

var template$K = "<section>\r\n    <h2>dr-repeat</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html\">&lt;ol&gt;\r\n   &lt;li dr-repeat=&quot;3&quot;&gt;#it#&lt;/li&gt;\r\n&lt;/ol&gt;\r\n&lt;ol&gt;\r\n   &lt;li dr-repeat=&quot;$range(this.start, this.end)&quot;&gt;#it#&lt;/li&gt;\r\n&lt;/ol&gt;\r\n&lt;ol&gt;\r\n   &lt;li dr-repeat=&quot;$range(this.end, this.start)&quot;&gt;#it#&lt;/li&gt;\r\n&lt;/ol&gt;\r\n&lt;ol&gt;\r\n   &lt;li dr-repeat=&quot;$range(this.start, this.end, this.step)&quot;&gt;#it#&lt;/li&gt;\r\n&lt;/ol&gt;\r\n&lt;ol&gt;\r\n   &lt;li dr-repeat=&quot;$range(&#39;50..60, 2&#39;)&quot;&gt;#it#&lt;/li&gt;\r\n&lt;/ol&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">public start = 10;\r\npublic end = 20;\r\npublic step = 2;</pre>\r\n                </figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <ol>\r\n                           <li dr-repeat=\"3\">#it#</li>\r\n                        </ol>\r\n                        <ol>\r\n                           <li dr-repeat=\"$range(this.start, this.end)\">#it#</li>\r\n                        </ol>\r\n                        <ol>\r\n                           <li dr-repeat=\"$range(this.end, this.start)\">#it#</li>\r\n                        </ol>\r\n                        <ol>\r\n                           <li dr-repeat=\"$range(this.start, this.end, this.step)\">#it#</li>\r\n                        </ol>\r\n                        <ol>\r\n                           <li dr-repeat=\"$range('50..60, 2')\">#it#</li>\r\n                        </ol>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrRepeatSection = /** @class */ (function () {
    function DomrenderDrRepeatSection() {
        this.start = 10;
        this.end = 20;
        this.step = 2;
    }
    DomrenderDrRepeatSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-repeat-section',
            template: template$K
        })
    ], DomrenderDrRepeatSection);
    return DomrenderDrRepeatSection;
}());

var template$J = "<section>\r\n    <h2>dr-for</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html\">&lt;button dr-for=&quot;var i = 0 ; i &lt; this.products.length; i++&quot; dr-it=&quot;&#39;this.products[&#39;+i+&#39;]&#39;&quot;&gt;\r\n    ${#it#.name}$\r\n&lt;/button&gt;\r\n&lt;input type=&quot;text&quot; dr-for=&quot;var i = 0 ; i &lt; this.products.length; i++&quot; dr-it=&quot;this.products[i].value&quot; dr-value=&quot;&#39;#it#&#39;&quot;&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">public products = [\r\n    {name: 'front', value: 'front-value'},\r\n    {name: 'core', value: 'core-value'},\r\n    {name: 'dom-render', value: 'dom-render-value'},\r\n];</pre>\r\n                </figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <button dr-for=\"var i = 0 ; i < this.products.length; i++\" dr-it=\"'this.products['+i+']'\">\r\n                            ${#it#.name}$\r\n                        </button>\r\n                        <input type=\"text\" dr-for=\"var i = 0 ; i < this.products.length; i++\" dr-it=\"this.products[i].value\" dr-value=\"'#it#'\">\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrForSection = /** @class */ (function () {
    function DomrenderDrForSection() {
        this.products = [
            { name: 'front', value: 'front-value' },
            { name: 'core', value: 'core-value' },
            { name: 'dom-render', value: 'dom-value' },
        ];
    }
    DomrenderDrForSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-for-section',
            template: template$J
        })
    ], DomrenderDrForSection);
    return DomrenderDrForSection;
}());

var template$I = "<section>\r\n    <h2>dr-for-of</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html\">&lt;div class=&quot;result&quot;&gt;\r\n    &lt;ul dr-for-of=&quot;this.products&quot;&gt;\r\n        ${#it#.name}$\r\n        &lt;li dr-for-of=&quot;#it#.contributor&quot; dr-var=&quot;name=#it#.name&quot;&gt;\r\n            ${$var.name}$ = ${#it#}$\r\n        &lt;/li&gt;\r\n    &lt;/ul&gt;\r\n&lt;/div&gt;</pre></figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">public products = [\r\n    {name: 'front', contributor: ['a', 'b', 'c']},\r\n    {name: 'core', contributor: ['e', 'f', 'g']},\r\n    {name: 'dom-render', contributor: ['h', 'i', 'j', 'k', 'l', 'm']},\r\n];</pre>\r\n                </figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <ul dr-for-of=\"this.products\">\r\n                            ${#it#.name}$\r\n                            <li dr-for-of=\"#it#.contributor\" dr-var=\"name=#it#.name\">\r\n                                ${$var.name}$ = ${#it#}$\r\n                            </li>\r\n                        </ul>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrForOfSection = /** @class */ (function () {
    function DomrenderDrForOfSection() {
        this.products = [
            { name: 'front', contributor: ['a', 'b', 'c'] },
            { name: 'core', contributor: ['e', 'f', 'g'] },
            { name: 'dom-render', contributor: ['h', 'i', 'j', 'k', 'l', 'm'] },
        ];
    }
    DomrenderDrForOfSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-for-of-section',
            template: template$I
        })
    ], DomrenderDrForOfSection);
    return DomrenderDrForOfSection;
}());

var template$H = "<section>\r\n    <h2>dr-inner-text</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;div dr-inner-text=&quot;`&lt;button dr-event-click=&#39;alert(1004)&#39;&gt;${this.label}&lt;/button&gt;`&quot;&gt;&lt;/div&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">label = 'click me';</pre>\r\n                </figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <div dr-inner-text=\"`<button dr-event-click='alert(1004)'>${this.label}</button>`\"></div>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrInnerTextSection = /** @class */ (function () {
    function DomrenderDrInnerTextSection() {
        this.label = 'click me';
    }
    DomrenderDrInnerTextSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-inner-text-section',
            template: template$H
        })
    ], DomrenderDrInnerTextSection);
    return DomrenderDrInnerTextSection;
}());

var template$G = "<section>\r\n    <h2>dr-inner-html</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;div dr-inner-text=&quot;`&lt;button dr-event-click=&#39;alert(1004)&#39;&gt;${this.label}&lt;/button&gt;`&quot;&gt;&lt;/div&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">label = 'click me';</pre>\r\n                </figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <div dr-inner-html=\"`<button dr-event-click='alert(1004)'>${this.label}</button>`\"></div>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrInnerHtmlSection = /** @class */ (function () {
    function DomrenderDrInnerHtmlSection() {
        this.label = 'click me';
    }
    DomrenderDrInnerHtmlSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-inner-html-section',
            template: template$G
        })
    ], DomrenderDrInnerHtmlSection);
    return DomrenderDrInnerHtmlSection;
}());

var template$F = "<section>\r\n    <h2>?????? dr-event-click</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;button dr-event-click=&quot;this.count++&quot;&gt;${this.count}$&lt;/button&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">count = 1;</pre></figure>\r\n            </div>\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <button dr-event-click=\"this.count++;\">${this.count}$</button>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventClickSection = /** @class */ (function () {
    function DomrenderDrEventClickSection() {
        this.count = 1;
    }
    DomrenderDrEventClickSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-click-section',
            template: template$F
        })
    ], DomrenderDrEventClickSection);
    return DomrenderDrEventClickSection;
}());

var template$E = "<section>\r\n    <p>attribute variable</p>\r\n    <ul>\r\n        <li><span class=\"badge bg-primary\">$event</span> : event instance</li>\r\n        <li><span class=\"badge bg-primary\">$element</span> : element instance</li>\r\n        <li><span class=\"badge bg-primary\">$target</span> : event target instance</li>\r\n        <li><span class=\"badge bg-primary\">$scripts</span> : scripts instance</li>\r\n        <li><span class=\"badge bg-primary\">$range</span> : range object creater</li>\r\n    </ul>\r\n</section>\r\n";

var DomrenderEventAttributeValuesSection = /** @class */ (function () {
    function DomrenderEventAttributeValuesSection() {
        this.count = 1;
    }
    DomrenderEventAttributeValuesSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-event-attribute-values-section',
            template: template$E
        })
    ], DomrenderEventAttributeValuesSection);
    return DomrenderEventAttributeValuesSection;
}());

var template$D = "<section>\r\n    <h2>?????? dr-event-mousedown</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;button dr-event-mousedown=&quot;this.count++&quot;&gt;${this.count}$&lt;/button&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">count = 1;</pre></figure>\r\n            </div>\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <button dr-event-mousedown=\"this.count++;\">${this.count}$</button>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventMousedownSection = /** @class */ (function () {
    function DomrenderDrEventMousedownSection() {
        this.count = 1;
    }
    DomrenderDrEventMousedownSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-mousedown-section',
            template: template$D
        })
    ], DomrenderDrEventMousedownSection);
    return DomrenderDrEventMousedownSection;
}());

var template$C = "<section>\r\n    <h2>?????? dr-event-mouseup</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;button dr-event-mouseup=&quot;this.count++&quot;&gt;${this.count}$&lt;/button&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">count = 1;</pre></figure>\r\n            </div>\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <button dr-event-mouseup=\"this.count++;\">${this.count}$</button>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventMouseupSection = /** @class */ (function () {
    function DomrenderDrEventMouseupSection() {
        this.count = 1;
    }
    DomrenderDrEventMouseupSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-mouseup-section',
            template: template$C
        })
    ], DomrenderDrEventMouseupSection);
    return DomrenderDrEventMouseupSection;
}());

var template$B = "<section>\r\n    <h2>?????? dr-event-dblclick</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;button dr-event-dblclick=&quot;this.count++&quot;&gt;${this.count}$&lt;/button&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">count = 1;</pre></figure>\r\n            </div>\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <button dr-event-dblclick=\"this.count++;\">${this.count}$</button>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventDblclickSection = /** @class */ (function () {
    function DomrenderDrEventDblclickSection() {
        this.count = 1;
    }
    DomrenderDrEventDblclickSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-dblclick-section',
            template: template$B
        })
    ], DomrenderDrEventDblclickSection);
    return DomrenderDrEventDblclickSection;
}());

var template$A = "<section>\r\n    <h2>?????? dr-event-mouseover</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;button dr-event-mouseover=&quot;this.count++&quot;&gt;${this.count}$&lt;/button&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">count = 1;</pre></figure>\r\n            </div>\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <button dr-event-mouseover=\"this.count++;\">${this.count}$</button>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventMouseoverSection = /** @class */ (function () {
    function DomrenderDrEventMouseoverSection() {
        this.count = 1;
    }
    DomrenderDrEventMouseoverSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-mouseover-section',
            template: template$A
        })
    ], DomrenderDrEventMouseoverSection);
    return DomrenderDrEventMouseoverSection;
}());

var template$z = "<section>\r\n    <h2>?????? dr-event-mousemove</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;button dr-event-mousemove=&quot;this.count++&quot;&gt;${this.count}$&lt;/button&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">count = 1;</pre></figure>\r\n            </div>\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <button dr-event-mousemove=\"this.count++;\">${this.count}$</button>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventMousemoveSection = /** @class */ (function () {
    function DomrenderDrEventMousemoveSection() {
        this.count = 1;
    }
    DomrenderDrEventMousemoveSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-mousemove-section',
            template: template$z
        })
    ], DomrenderDrEventMousemoveSection);
    return DomrenderDrEventMousemoveSection;
}());

var template$y = "<section>\r\n    <h2>?????? dr-event-mouseenter</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;button dr-event-mouseenter=&quot;this.count++&quot;&gt;${this.count}$&lt;/button&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">count = 1;</pre></figure>\r\n            </div>\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <button dr-event-mouseenter=\"this.count++;\">${this.count}$</button>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventMouseenterSection = /** @class */ (function () {
    function DomrenderDrEventMouseenterSection() {
        this.count = 1;
    }
    DomrenderDrEventMouseenterSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-mouseenter-section',
            template: template$y
        })
    ], DomrenderDrEventMouseenterSection);
    return DomrenderDrEventMouseenterSection;
}());

var template$x = "<section>\r\n    <h2>?????? dr-event-mouseleave</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;button dr-event-mouseleave=&quot;this.count++&quot;&gt;${this.count}$&lt;/button&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">count = 1;</pre></figure>\r\n            </div>\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <button dr-event-mouseleave=\"this.count++;\">${this.count}$</button>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventMouseleaveSection = /** @class */ (function () {
    function DomrenderDrEventMouseleaveSection() {
        this.count = 1;
    }
    DomrenderDrEventMouseleaveSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-mouseleave-section',
            template: template$x
        })
    ], DomrenderDrEventMouseleaveSection);
    return DomrenderDrEventMouseleaveSection;
}());

var template$w = "<section>\r\n    <h2>?????? dr-event-contextmenu</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;button dr-event-contextmenu=&quot;this.count++&quot;&gt;${this.count}$ mouse contextmenu(mouse right click)&lt;/button&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">count = 1;</pre></figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <button dr-event-contextmenu=\"this.count++;\">${this.count}$  mouse contextmenu(mouse right click)</button>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventContextmenuSection = /** @class */ (function () {
    function DomrenderDrEventContextmenuSection() {
        this.count = 1;
    }
    DomrenderDrEventContextmenuSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-contextmenu-section',
            template: template$w
        })
    ], DomrenderDrEventContextmenuSection);
    return DomrenderDrEventContextmenuSection;
}());

var template$v = "<section>\r\n    <h2>?????? dr-event-keyup</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;input type=&quot;text&quot; dr-event-keyup=&quot;this.target = $target; this.value = $target.value; this.event = $event;&quot;&gt;\r\n&lt;p&gt;value: ${this.value}$&lt;/p&gt;\r\n&lt;p&gt;target: ${this.target}$&lt;/p&gt;\r\n&lt;p&gt;event: ${this.event}$&lt;/p&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">count = 1;</pre></figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <input type=\"text\" dr-event-keyup=\"this.target = $target; this.value = $target.value; this.event = $event;\">\r\n                        <p>value: ${this.value}$</p>\r\n                        <p>target: ${this.target}$</p>\r\n                        <p>event: ${this.event}$</p>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventKeyupSection = /** @class */ (function () {
    function DomrenderDrEventKeyupSection() {
        this.value = '';
    }
    DomrenderDrEventKeyupSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-keyup-section',
            template: template$v
        })
    ], DomrenderDrEventKeyupSection);
    return DomrenderDrEventKeyupSection;
}());

var template$u = "<section>\r\n    <h2>?????? dr-event-keydown</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;input type=&quot;text&quot; dr-event-keydown=&quot;this.target = $target; this.value = $target.value; this.event = $event;&quot;&gt;\r\n&lt;p&gt;value: ${this.value}$&lt;/p&gt;\r\n&lt;p&gt;target: ${this.target}$&lt;/p&gt;\r\n&lt;p&gt;event: ${this.event}$&lt;/p&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">count = 1;</pre></figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <input type=\"text\" dr-event-keydown=\"this.target = $target; this.value = $target.value; this.event = $event;\">\r\n                        <p>value: ${this.value}$</p>\r\n                        <p>target: ${this.target}$</p>\r\n                        <p>event: ${this.event}$</p>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventKeydownSection = /** @class */ (function () {
    function DomrenderDrEventKeydownSection() {
        this.value = '';
    }
    DomrenderDrEventKeydownSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-keydown-section',
            template: template$u
        })
    ], DomrenderDrEventKeydownSection);
    return DomrenderDrEventKeydownSection;
}());

var template$t = "<section>\r\n    <h2>?????? dr-event-keypress</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;input type=&quot;text&quot; dr-event-keypress=&quot;this.target = $target; this.value = $target.value; this.event = $event;&quot;&gt;\r\n&lt;p&gt;value: ${this.value}$&lt;/p&gt;\r\n&lt;p&gt;target: ${this.target}$&lt;/p&gt;\r\n&lt;p&gt;event: ${this.event}$&lt;/p&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">count = 1;</pre></figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <input type=\"text\" dr-event-keypress=\"this.target = $target; this.value = $target.value; this.event = $event;\">\r\n                        <p>value: ${this.value}$</p>\r\n                        <p>target: ${this.target}$</p>\r\n                        <p>event: ${this.event}$</p>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventKeypressSection = /** @class */ (function () {
    function DomrenderDrEventKeypressSection() {
        this.value = '';
    }
    DomrenderDrEventKeypressSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-keypress-section',
            template: template$t
        })
    ], DomrenderDrEventKeypressSection);
    return DomrenderDrEventKeypressSection;
}());

var template$s = "<section>\r\n    <h2>?????? dr-event-change</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;input type=&quot;text&quot; dr-event-change=&quot;this.target = $target; this.value = $target.value; this.event = $event;&quot;&gt;\r\n&lt;p&gt;value: ${this.value}$&lt;/p&gt;\r\n&lt;p&gt;target: ${this.target}$&lt;/p&gt;\r\n&lt;p&gt;event: ${this.event}$&lt;/p&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">count = 1;</pre></figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <input type=\"text\" dr-event-change=\"this.target = $target; this.value = $target.value; this.event = $event;\">\r\n                        <p>value: ${this.value}$</p>\r\n                        <p>target: ${this.target}$</p>\r\n                        <p>event: ${this.event}$</p>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventChangeSection = /** @class */ (function () {
    function DomrenderDrEventChangeSection() {
        this.value = '';
    }
    DomrenderDrEventChangeSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-change-section',
            template: template$s
        })
    ], DomrenderDrEventChangeSection);
    return DomrenderDrEventChangeSection;
}());

var template$r = "<section>\r\n    <h2>?????? dr-event-input</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;input type=&quot;text&quot; dr-event-input=&quot;this.target = $target; this.value = $target.value; this.event = $event;&quot;&gt;\r\n&lt;p&gt;value: ${this.value}$&lt;/p&gt;\r\n&lt;p&gt;target: ${this.target}$&lt;/p&gt;\r\n&lt;p&gt;event: ${this.event}$&lt;/p&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">count = 1;</pre></figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <input type=\"text\" dr-event-input=\"this.target = $target; this.value = $target.value; this.event = $event;\">\r\n                        <p>value: ${this.value}$</p>\r\n                        <p>target: ${this.target}$</p>\r\n                        <p>event: ${this.event}$</p>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventInputSection = /** @class */ (function () {
    function DomrenderDrEventInputSection() {
        this.value = '';
    }
    DomrenderDrEventInputSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-input-section',
            template: template$r
        })
    ], DomrenderDrEventInputSection);
    return DomrenderDrEventInputSection;
}());

var template$q = "<section>\r\n    <h2>?????? dr-event-submit</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;form dr-event-submit=&quot;this.submit($target, $event);&quot;&gt;\r\n    &lt;p&gt;target: ${this.target}$&lt;/p&gt;\r\n    &lt;p&gt;event: ${this.event}$&lt;/p&gt;\r\n    &lt;p&gt;lastSubmit: ${this.lastSubmit}$&lt;/p&gt;\r\n    &lt;button type=&quot;submit&quot;&gt;submit&lt;/button&gt;\r\n&lt;/form&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">target?: Element;\r\nevent?: Event;\r\nlastSubmit = new Date();\r\nsubmit(target: Element, event: Event) {\r\n    this.target = target;\r\n    this.event = event;\r\n    this.lastSubmit = new Date();\r\n    event.preventDefault();\r\n}</pre></figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <form dr-event-submit=\"this.submit($target, $event);\">\r\n                            <p>target: ${this.target}$</p>\r\n                            <p>event: ${this.event}$</p>\r\n                            <p>lastSubmit: ${this.lastSubmit}$</p>\r\n                            <button type=\"submit\">submit</button>\r\n                        </form>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventSubmitSection = /** @class */ (function () {
    function DomrenderDrEventSubmitSection() {
        this.lastSubmit = new Date();
    }
    DomrenderDrEventSubmitSection.prototype.submit = function (target, event) {
        this.target = target;
        this.event = event;
        this.lastSubmit = new Date();
        event.preventDefault();
    };
    DomrenderDrEventSubmitSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-submit-section',
            template: template$q
        })
    ], DomrenderDrEventSubmitSection);
    return DomrenderDrEventSubmitSection;
}());

var template$p = "<section>\r\n    <h2>?????? dr-event-resize</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;div dr-event-resize=&quot;this.target = $target; this.event = $event;&quot;&gt;.&lt;/div&gt;\r\n&lt;p&gt;target: ${this.target}$&lt;/p&gt;\r\n&lt;p&gt;event: ${this.event}$&lt;/p&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">target?: Element;\r\nevent?: Event;</pre></figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <div dr-event-resize=\"this.target = $target; this.event = $event;\">.</div>\r\n                        <p>target: ${this.target}$</p>\r\n                        <p>event: ${this.event}$</p>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventResizeSection = /** @class */ (function () {
    function DomrenderDrEventResizeSection() {
    }
    DomrenderDrEventResizeSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-resize-section',
            template: template$p
        })
    ], DomrenderDrEventResizeSection);
    return DomrenderDrEventResizeSection;
}());

var template$o = "<section>\r\n    <h2>?????? dr-event-focus</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;input type=&quot;text&quot; dr-event-focus=&quot;this.target = $target; this.event = $event;&quot;&gt;\r\n&lt;p&gt;target: ${this.target}$&lt;/p&gt;\r\n&lt;p&gt;event: ${this.event}$&lt;/p&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">count = 1;</pre></figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <input type=\"text\" dr-event-focus=\"this.target = $target; this.event = $event;\">\r\n                        <p>target: ${this.target}$</p>\r\n                        <p>event: ${this.event}$</p>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventFocusSection = /** @class */ (function () {
    function DomrenderDrEventFocusSection() {
    }
    DomrenderDrEventFocusSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-focus-section',
            template: template$o
        })
    ], DomrenderDrEventFocusSection);
    return DomrenderDrEventFocusSection;
}());

var template$n = "<section>\r\n    <h2>?????? dr-event-blur</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;input type=&quot;text&quot; dr-event-blur=&quot;this.target = $target; this.event = $event;&quot;&gt;\r\n&lt;p&gt;target: ${this.target}$&lt;/p&gt;\r\n&lt;p&gt;event: ${this.event}$&lt;/p&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">count = 1;</pre></figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <input type=\"text\" dr-event-blur=\"this.target = $target; this.event = $event;\">\r\n                        <p>target: ${this.target}$</p>\r\n                        <p>event: ${this.event}$</p>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventBlurSection = /** @class */ (function () {
    function DomrenderDrEventBlurSection() {
    }
    DomrenderDrEventBlurSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-blur-section',
            template: template$n
        })
    ], DomrenderDrEventBlurSection);
    return DomrenderDrEventBlurSection;
}());

var template$m = "<section>\r\n    <h2>?????? dr-window-event-popstate</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;input type=&quot;text&quot; dr-window-event-popstate=&quot;this.value = location.href; console.log($target) &quot;&gt;\r\n&lt;p&gt;value: ${this.value}$&lt;/p&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">value = '';</pre></figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <input type=\"text\" dr-window-event-popstate=\"this.value = location.href; console.log($target)\">\r\n                        <p>value: ${this.value}$</p>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrWindowEventPopstateSection = /** @class */ (function () {
    function DomrenderDrWindowEventPopstateSection() {
        this.value = '';
    }
    DomrenderDrWindowEventPopstateSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-window-event-popstate-section',
            template: template$m
        })
    ], DomrenderDrWindowEventPopstateSection);
    return DomrenderDrWindowEventPopstateSection;
}());

var template$l = "<section xmlns:dr-event=\"http://www.w3.org/1999/xhtml\">\r\n    <h2>?????? custom event (other)</h2>\r\n    <p>other event (custom)</p>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;input type=&quot;text&quot; dr-on-init=&quot;this.targetElement&quot; dr-event:bind=&quot;custom&quot; dr-event=&quot;this.target = $target; this.params = $params; this.event = $event;&quot;&gt;\r\n&lt;p&gt;param: ${this.params?.bind}$&lt;/p&gt;\r\n&lt;p&gt;target: ${this.target}$&lt;/p&gt;\r\n&lt;p&gt;event: ${this.event}$&lt;/p&gt;\r\n&lt;button dr-event-click=&quot;this.dispatchEvent()&quot;&gt;dispatch CustomEvent&lt;/button&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">targetElement?: Element;\r\nparams?: any;\r\nevent?: Event;\r\ntarget?: Element;\r\n\r\ndispatchEvent() {\r\n    this.targetElement!.dispatchEvent(new Event('custom'));\r\n}</pre></figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <input type=\"text\" dr-on-init=\"this.targetElement\" dr-event:bind=\"custom\" dr-event=\"this.target = $target; this.params = $params; this.event = $event;\">\r\n                        <p>param: ${this.params?.bind}$</p>\r\n                        <p>target: ${this.target}$</p>\r\n                        <p>event: ${this.event}$</p>\r\n                        <button dr-event-click=\"this.dispatchEvent()\">dispatch CustomEvent</button>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrEventSection = /** @class */ (function () {
    function DomrenderDrEventSection() {
    }
    DomrenderDrEventSection.prototype.dispatchEvent = function () {
        this.targetElement.dispatchEvent(new Event('custom'));
    };
    DomrenderDrEventSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-event-section',
            template: template$l
        })
    ], DomrenderDrEventSection);
    return DomrenderDrEventSection;
}());

var template$k = "<section>\r\n    <h2>?????? dr-window-event-resize</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;input type=&quot;text&quot; dr-window-event-resize=&quot;this.event = $event; this.target = $target&quot;&gt;\r\n    &lt;p&gt;innerWidth: ${this.target?.innerWidth}$&lt;/p&gt;\r\n    &lt;p&gt;innerHeight: ${this.target?.innerHeight}$&lt;/p&gt;</pre></figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">event?: Event;\r\ntarget?: Window;</pre></figure>\r\n            </div>\r\n            <div class=\"col-sm-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <input type=\"text\" dr-window-event-resize=\"this.event = $event; this.target = $target\">\r\n                        <p>innerWidth: ${this.target?.innerWidth}$</p>\r\n                        <p>innerHeight: ${this.target?.innerHeight}$</p>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrWindowEventResizeSection = /** @class */ (function () {
    function DomrenderDrWindowEventResizeSection() {
    }
    DomrenderDrWindowEventResizeSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-window-event-resize-section',
            template: template$k
        })
    ], DomrenderDrWindowEventResizeSection);
    return DomrenderDrWindowEventResizeSection;
}());

var template$j = "<section>\r\n    <h2>dr-attr</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;button dr-event-click=&quot;this.change()&quot;&gt;change&lt;/button&gt;\r\n&lt;textarea dr-attr=&quot;{rows: this.rows, cols: this.cols}&quot;&gt;&lt;/textarea&gt;\r\n&lt;textarea dr-attr=&quot;[&#39;rows=&#39;+this.rows, &#39;cols=&#39; +this.cols]&quot;&gt;&lt;/textarea&gt;\r\n&lt;textarea dr-attr=&quot;&#39;rows=&#39;+this.rows +&#39;, cols=&#39; +this.cols&quot;&gt;&lt;/textarea&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">rows = 11;\r\ncols = 11;\r\n\r\nchange() {\r\n    this.rows = Math.floor(Math.random() * 10)\r\n    this.cols = Math.floor(Math.random() * 10)\r\n}</pre></figure>\r\n            </div>\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <button dr-event-click=\"this.change()\">change</button>\r\n                        <textarea dr-attr=\"{rows: this.rows, cols: this.cols}\"></textarea>\r\n                        <textarea dr-attr=\"['rows='+this.rows, 'cols=' +this.cols]\"></textarea>\r\n                        <textarea dr-attr=\"'rows='+this.rows +', cols=' +this.cols\"></textarea>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrAttrSection = /** @class */ (function () {
    function DomrenderDrAttrSection() {
        this.rows = 11;
        this.cols = 11;
    }
    DomrenderDrAttrSection.prototype.change = function () {
        this.rows = Math.floor(Math.random() * 10);
        this.cols = Math.floor(Math.random() * 10);
    };
    DomrenderDrAttrSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-attr-section',
            template: template$j
        })
    ], DomrenderDrAttrSection);
    return DomrenderDrAttrSection;
}());

var template$i = "<section>\r\n    <h2>dr-class</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;style&gt;\r\n    .color {\r\n        color: red;\r\n    }\r\n    .bgColor {\r\n        background-color: yellow;\r\n    }\r\n&lt;/style&gt;\r\n&lt;button dr-event-click=&quot;this.change()&quot;&gt;change&lt;/button&gt;\r\n&lt;div dr-class=&quot;{color: this.color, bgColor: this.bgColor}&quot;&gt;content&lt;/div&gt;\r\n&lt;div dr-class=&quot;[&#39;bgColor&#39;]&quot;&gt;content&lt;/div&gt;\r\n&lt;div dr-class=&quot;&#39;color&#39;&quot;&gt;content&lt;/div&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">color = false;\r\nbgColor = false;\r\n\r\nchange() {\r\n    this.color = (Math.random() * 10) > 5;\r\n    this.bgColor = (Math.random() * 10) > 5;\r\n}</pre></figure>\r\n            </div>\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <style>\r\n                            .color {\r\n                                color: red;\r\n                            }\r\n                            .bgColor {\r\n                                background-color: yellow;\r\n                            }\r\n                        </style>\r\n                        <button dr-event-click=\"this.change()\">change</button>\r\n                        <div dr-class=\"{color: this.color, bgColor: this.bgColor}\">content</div>\r\n                        <div dr-class=\"['bgColor']\">content</div>\r\n                        <div dr-class=\"'color'\">content</div>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrClassSection = /** @class */ (function () {
    function DomrenderDrClassSection() {
        this.color = false;
        this.bgColor = false;
    }
    DomrenderDrClassSection.prototype.change = function () {
        this.color = (Math.random() * 10) > 5;
        this.bgColor = (Math.random() * 10) > 5;
    };
    DomrenderDrClassSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-class-section',
            template: template$i
        })
    ], DomrenderDrClassSection);
    return DomrenderDrClassSection;
}());

var template$h = "<section>\r\n    <h2>dr-style</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;button dr-event-click=&quot;this.change()&quot;&gt;change&lt;/button&gt;\r\n&lt;div dr-style=&quot;{fontSize: this.size + &#39;px&#39;, margin: this.size + &#39;px&#39;}&quot;&gt; content &lt;/div&gt;\r\n&lt;div dr-style=&quot;&#39;font-size: &#39; + this.size +&#39;px; margin: &#39; + this.size + &#39;px&#39;&quot;&gt; content &lt;/div&gt;\r\n&lt;div dr-style=&quot;[&#39;font-size: &#39; + this.size +&#39;px&#39;, &#39;margin: &#39; + this.size + &#39;px&#39;]&quot;&gt; content &lt;/div&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0\">\r\n                    <figcaption>class, object body code</figcaption>\r\n                    <pre dr-pre class=\"code-container typescript m-0\">    size = 10;\r\n\r\nchange() {\r\n    this.size = Math.floor(Math.random() * 40);\r\n}</pre></figure>\r\n            </div>\r\n            <div class=\"col-6\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <button dr-event-click=\"this.change()\">change</button>\r\n                        <div dr-style=\"{fontSize: this.size + 'px', margin: this.size + 'px'}\"> content </div>\r\n                        <div dr-style=\"'font-size: ' + this.size +'px; margin: ' + this.size + 'px'\"> content </div>\r\n                        <div dr-style=\"['font-size: ' + this.size +'px', 'margin: ' + this.size + 'px']\"> content </div>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrStyleSection = /** @class */ (function () {
    function DomrenderDrStyleSection() {
        this.size = 10;
    }
    DomrenderDrStyleSection.prototype.change = function () {
        this.size = Math.floor(Math.random() * 40);
    };
    DomrenderDrStyleSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-style-section',
            template: template$h
        })
    ], DomrenderDrStyleSection);
    return DomrenderDrStyleSection;
}());

var template$g = "<section>\r\n    <h2>dr-strip</h2>\r\n    <article class=\"content-container-white no-overflow\">\r\n        <div class=\"row\">\r\n            <figure class=\"m-0\">\r\n                <figcaption>template.html</figcaption>\r\n                <pre dr-pre class=\"code-container html m-0\">&lt;button dr-if=&quot;true&quot; dr-strip=&quot;false&quot;&gt;false button strip &lt;/button&gt;\r\n&lt;button dr-if=&quot;true&quot; dr-strip=&quot;true&quot;&gt;true button strip &lt;/button&gt;</pre>\r\n            </figure>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-12\">\r\n                <figure class=\"m-0 result-container h-100\">\r\n                    <figcaption><strong>result</strong></figcaption>\r\n                    <div class=\"result\">\r\n                        <button dr-if=\"true\" dr-strip=\"false\">false button strip </button>\r\n                        <button dr-if=\"true\" dr-strip=\"true\">true button strip </button>\r\n                    </div>\r\n                </figure>\r\n            </div>\r\n        </div>\r\n    </article>\r\n</section>\r\n";

var DomrenderDrStripSection = /** @class */ (function () {
    function DomrenderDrStripSection() {
    }
    DomrenderDrStripSection = __decorate([
        SimDecorator_7(),
        Component_3({
            selector: 'domrender-dr-strip-section',
            template: template$g
        })
    ], DomrenderDrStripSection);
    return DomrenderDrStripSection;
}());

var DomrenderFunction = /** @class */ (function () {
    function DomrenderFunction() {
    }
    DomrenderFunction.prototype.onInit = function () {
    };
    DomrenderFunction = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$N,
            styles: [style$g],
            using: [DomrenderExpressionSection, DomrenderDrIfSection, DomrenderDrRepeatSection,
                DomrenderDrForSection, DomrenderDrForOfSection,
                DomrenderDrInnerTextSection, DomrenderDrInnerHtmlSection,
                DomrenderDrEventClickSection, DomrenderEventAttributeValuesSection,
                DomrenderDrEventMousedownSection, DomrenderDrEventMouseupSection, DomrenderDrEventDblclickSection, DomrenderDrEventMouseoverSection, DomrenderDrEventMousemoveSection, DomrenderDrEventMouseenterSection, DomrenderDrEventMouseleaveSection, DomrenderDrEventContextmenuSection,
                DomrenderDrEventKeyupSection, DomrenderDrEventKeydownSection, DomrenderDrEventKeypressSection, DomrenderDrEventChangeSection, DomrenderDrEventInputSection,
                DomrenderDrEventSubmitSection, DomrenderDrEventResizeSection, DomrenderDrEventFocusSection, DomrenderDrEventBlurSection, DomrenderDrWindowEventPopstateSection, DomrenderDrEventSection, DomrenderDrWindowEventResizeSection,
                DomrenderDrAttrSection, DomrenderDrClassSection, DomrenderDrStyleSection, DomrenderDrStripSection
            ]
        }),
        __metadata("design:paramtypes", [])
    ], DomrenderFunction);
    return DomrenderFunction;
}());

var template$f = "<article>\r\n    <h1>Script</h1>\r\n    <p>define script instructions and call</p>\r\n    <p>define script function in $scripts object</p>\r\n    <section>\r\n        <h2>define</h2>\r\n        <figure>\r\n            <figcaption>class</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">new DomRender.run(obj, target, {\r\n  scripts: {\r\n    concat: function (head: string, tail: string) {\r\n      return head + tail;\r\n    }\r\n  }\r\n});</pre>\r\n        </figure>\r\n    </section>\r\n\r\n    <hr>\r\n\r\n    <section>\r\n        <h2>using in Class</h2>\r\n        <figure>\r\n            <figcaption>class</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">const data = config.scripts.concat('head', 'tail')</pre>\r\n        </figure>\r\n    </section>\r\n    <hr>\r\n\r\n    <section>\r\n        <h2>using in html</h2>\r\n        <figure>\r\n            <figcaption>html</figcaption>\r\n            <pre dr-pre class=\"code-container html\">&lt;div&gt;${$scripts.concat(&#39;head&#39;, &#39;tail&#39;)}$&lt;/div&gt;\r\n&lt;div dr-if=&quot;$scripts.concat(&#39;wow&#39;, &#39;good&#39;) === &#39;wowgood&#39;&quot;&gt;\r\nis wowgood\r\n&lt;/div&gt;</pre>\r\n        </figure>\r\n        <figure>\r\n            <figcaption>html</figcaption>\r\n            <pre dr-pre class=\"code-container html\">&lt;div&gt;${$scripts.calc(1, 4)}$&lt;/div&gt;\r\n&lt;div dr-if=&quot;$scripts.calc(1, 3) === 3&quot;&gt; is 3&lt;/div&gt;</pre>\r\n        </figure>\r\n        <dl>\r\n            <ul>\r\n                <li>\r\n                    <dt>$scripts</dt>\r\n                    <dd>scripts object</dd>\r\n                </li>\r\n            </ul>\r\n        </dl>\r\n    </section>\r\n</article>\r\n\r\n";

var style$f = "";

var DomrenderScript = /** @class */ (function () {
    function DomrenderScript() {
    }
    DomrenderScript.prototype.onInit = function () {
    };
    DomrenderScript = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$f,
            styles: [style$f]
        }),
        __metadata("design:paramtypes", [])
    ], DomrenderScript);
    return DomrenderScript;
}());

var template$e = "<article>\r\n    <h1>Component</h1>\r\n    <p>create custom tags in component format</p>\r\n    <section>\r\n        <h2>define</h2>\r\n        <figure>\r\n            <figcaption>typescript</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">export namespace Profile {\r\n  export const templat = &#39;&lt;div&gt;${this.name}$ &lt;/div&gt;&#39;;\r\n  export const styles = ['p {color: red}', 'div {margin: ${this.margin} + \\'px\\' }'];\r\n  export class Component {\r\n    public name = 'default name';\r\n    public margin = 5;\r\n    public say() {\r\n        console.log('say!~')\r\n    }\r\n  }\r\n}\r\n\r\nnew DomRender.run(obj, target, {\r\n  targetElements: [\r\n    RawSet.createComponentTargetElement('my-element', (e, o, r) => new Profile.Component(), Profile.templat, Profile.styles, scripts)\r\n  ],\r\n});</pre>\r\n        </figure>\r\n    </section>\r\n\r\n    <hr>\r\n\r\n    <section>\r\n        <h2>using in html</h2>\r\n        <figure>\r\n            <figcaption>html</figcaption>\r\n            <pre dr-pre class=\"code-container html\">&lt;my-element dr-on-init=&quot;$component.say();&quot;&gt;&lt;/my-element&gt;</pre>\r\n        </figure>\r\n        <figure>\r\n            <figcaption>html</figcaption>\r\n            <pre dr-pre class=\"code-container html\">&lt;div&gt;${$scripts.calc(1, 4)}$&lt;/div&gt;\r\n&lt;div dr-if=&quot;$scripts.calc(1, 3) === 3&quot;&gt; is 3&lt;/div&gt;</pre>\r\n        </figure>\r\n    </section>\r\n    <hr>\r\n\r\n    <domrender-component-attr-section></domrender-component-attr-section>\r\n</article>\r\n\r\n";

var style$e = "";

var DomrenderComponent = /** @class */ (function () {
    function DomrenderComponent() {
    }
    DomrenderComponent.prototype.onInit = function () {
    };
    DomrenderComponent = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$e,
            styles: [style$e],
            using: [DomrenderComponentAttrSection]
        }),
        __metadata("design:paramtypes", [])
    ], DomrenderComponent);
    return DomrenderComponent;
}());

var template$d = "<article>\r\n    <h1>Validation</h1>\r\n    <p>Form and Validator</p>\r\n    <section>\r\n        <h2>dr-form</h2>\r\n        <figure>\r\n            <figcaption>form</figcaption>\r\n <pre dr-pre class=\"code-container html\">&lt;form dr-form=&quot;this.form&quot; dr-event-submit=&quot;this.submit(); $event.preventDefault();&quot;&gt;\r\n  name: &lt;input name=&quot;name&quot;&gt;\r\n  age: &lt;input name=&quot;age&quot;&gt;\r\n  addr: &lt;input dr-form:event=&quot;input&quot; name=&quot;addr&quot;&gt;\r\n  &lt;button type=&quot;submit&quot;&gt;submit&lt;/button&gt;\r\n&lt;/form&gt;</pre>\r\n        </figure>\r\n        <figure>\r\n            <figcaption>typescript</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">class User {\r\n  form = {};\r\n  submit() {\r\n    const form = (this.form as any)\r\n    console.log('submit->', form, form.name, form.age, form.addr);\r\n  }\r\n}</pre>\r\n        </figure>\r\n        <dl>\r\n            <ul>\r\n                <li>\r\n                    <dt>event</dt>\r\n                    <dd>change (default)</dd>\r\n                </li>\r\n                <li>\r\n                    <dt>modify event event</dt>\r\n                    <dd>dr-form:event=\"input\"</dd>\r\n                </li>\r\n            </ul>\r\n        </dl>\r\n    </section>\r\n\r\n    <hr>\r\n\r\n    <section>\r\n        <h2>validator</h2>\r\n        <figure>\r\n            <figcaption>validation examples</figcaption>\r\n            <pre dr-pre class=\"code-container html\">&lt;form dr-form=&quot;this.form&quot; dr-event-submit=&quot;this.submit(); $event.preventDefault();&quot;&gt;\r\n    &lt;h2&gt;validator&lt;/h2&gt;\r\n    required: &lt;input name=&quot;required&quot;&gt; &lt;br&gt;\r\n    notEmpty: &lt;input name=&quot;notEmpty&quot;&gt; &lt;br&gt;\r\n    empty: &lt;input name=&quot;empty&quot;&gt; &lt;br&gt;\r\n    regexp: /[0-9]/ &lt;input name=&quot;regexp&quot;&gt; &lt;br&gt;\r\n    &lt;h2&gt;mix validator&lt;/h2&gt;\r\n    required, notEmpty: &lt;input name=&quot;mix&quot;&gt; &lt;br&gt;\r\n    &lt;h2&gt;all check required&lt;/h2&gt;\r\n    &lt;input name=&quot;all&quot; type=&quot;checkbox&quot; value=&quot;a&quot;&gt;a &lt;br&gt;\r\n    &lt;input name=&quot;all&quot; type=&quot;checkbox&quot; value=&quot;b&quot;&gt;b &lt;br&gt;\r\n\r\n    &lt;h2&gt;gender chose one&lt;/h2&gt;\r\n    &lt;input name=&quot;gender&quot; type=&quot;radio&quot; value=&quot;male&quot;&gt; Male &lt;br&gt;\r\n    &lt;input name=&quot;gender&quot; type=&quot;radio&quot; value=&quot;female&quot;&gt; Female&lt;br&gt;\r\n\r\n    &lt;button type=&quot;submit&quot;&gt;check valid&lt;/button&gt;\r\n&lt;/form&gt;</pre>\r\n        </figure>\r\n        <figure>\r\n            <figcaption>typescript</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">class PageValidator extends FormValidator {\r\n    required = new RequiredValidator();\r\n    notEmpty = new NotEmptyValidator();\r\n    empty = new EmptyValidator();\r\n    regexp = new RegExpTestValidator(/[0-9]/);\r\n    mix = new MultipleValidator([new RequiredValidator(), new NotEmptyValidator()]);\r\n\r\n    all = new ValidValidatorArray((v, t, e) => {\r\n        return !((v ?? []).filter(it => !it.checked).length > 0);\r\n    });\r\n\r\n    gender = new ValidValidatorArray((v, t, e) => {\r\n        return ((v ?? []).filter(it => it.checked).length > 0);\r\n    });\r\n}\r\nclass User {\r\n  form = new PageValidator();\r\n  submit() {\r\n    console.log('submit valid->', this.form.valid());\r\n  }\r\n\r\n  changeData() {\r\n    this.form.required.value = 'new value';\r\n  }\r\n}</pre>\r\n        </figure>\r\n        Validator types.\r\n        <dl>\r\n            <ul>\r\n                <li><dt>Validator (abstract)</dt><dd></dd></li>\r\n                <li><dt>ValidatorArray (abstract)</dt><dd></dd></li>\r\n                <li><dt>AllCheckedValidatorArray</dt><dd></dd></li>\r\n                <li><dt>AllUnCheckedValidatorArray</dt><dd></dd></li>\r\n                <li><dt>CheckedValidator</dt><dd></dd></li>\r\n                <li><dt>CountEqualsCheckedValidatorArray</dt><dd></dd></li>\r\n                <li><dt>CountEqualsUnCheckedValidatorArray</dt><dd></dd></li>\r\n                <li><dt>CountGreaterThanCheckedValidatorArray</dt><dd></dd></li>\r\n                <li><dt>CountGreaterThanEqualsCheckedValidatorArray</dt><dd></dd></li>\r\n                <li><dt>CountGreaterThanEqualsUnCheckedValidatorArray</dt><dd></dd></li>\r\n                <li><dt>CountGreaterThanUnCheckedValidatorArray</dt><dd></dd></li>\r\n                <li><dt>CountLessThanCheckedValidatorArray</dt><dd></dd></li>\r\n                <li><dt>CountLessThanEqualsCheckedValidatorArray</dt><dd></dd></li>\r\n                <li><dt>CountLessThanEqualsUnCheckedValidatorArray</dt><dd></dd></li>\r\n                <li><dt>CountLessThanUnCheckedValidatorArray</dt><dd></dd></li>\r\n                <li><dt>CountUnCheckedValidatorArray</dt><dd></dd></li>\r\n                <li><dt>EmptyValidator</dt><dd></dd></li>\r\n                <li><dt>ExcludeCheckedValidatorArray</dt><dd></dd></li>\r\n                <li><dt>FormValidator</dt><dd></dd></li>\r\n                <li><dt>IncludeCheckedValidatorArray</dt><dd></dd></li>\r\n                <li><dt>MultipleValidator</dt><dd></dd></li>\r\n                <li><dt>NonPassValidator</dt><dd></dd></li>\r\n                <li><dt>NotEmptyValidator</dt><dd></dd></li>\r\n                <li><dt>NotRegExpTestValidator</dt><dd></dd></li>\r\n                <li><dt>PassValidator</dt><dd></dd></li>\r\n                <li><dt>RegExpTestValidator</dt><dd></dd></li>\r\n                <li><dt>RequiredValidator</dt><dd></dd></li>\r\n                <li><dt>UnCheckedValidator</dt><dd></dd></li>\r\n                <li><dt>ValidMultipleValidator</dt><dd></dd></li>\r\n                <li><dt>ValidValidator</dt><dd></dd></li>\r\n                <li><dt>ValidValidatorArray</dt><dd></dd></li>\r\n                <li><dt>ValueEqualsValidator</dt><dd></dd></li>\r\n                <li><dt>ValueNotEqualsValidator</dt><dd></dd></li>\r\n            </ul>\r\n        </dl>\r\n    </section>\r\n</article>\r\n\r\n";

var style$d = "";

var DomrenderValidation = /** @class */ (function () {
    function DomrenderValidation() {
    }
    DomrenderValidation.prototype.onInit = function () {
    };
    DomrenderValidation = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$d,
            styles: [style$d]
        }),
        __metadata("design:paramtypes", [])
    ], DomrenderValidation);
    return DomrenderValidation;
}());

var template$c = "<article>\r\n    <h1>Detect</h1>\r\n    <p>Detect get, set variable</p>\r\n    <section>\r\n        <h2>onBeforeReturnSet</h2>\r\n        <figure>\r\n            <pre dr-pre class=\"code-container typescript\">export interface OnBeforeReturnSet {\r\n    onBeforeReturnSet(name: string, value: any, fullPath?: string[]): void;\r\n}</pre>\r\n        </figure>\r\n    </section>\r\n\r\n    <hr>\r\n\r\n    <section>\r\n        <h2>onBeforeReturnGet</h2>\r\n        <figure>\r\n            <figcaption>class</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">export interface OnBeforeReturnGet {\r\n    onBeforeReturnGet(name: string, value: any, fullPath?: string[]): void;\r\n}</pre>\r\n        </figure>\r\n    </section>\r\n    <hr>\r\n\r\n    <section>\r\n        <h2>using</h2>\r\n        <figure>\r\n            <figcaption>class</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">{\r\n    name: 'dom-render'\r\n    onBeforeReturnSet: (name: string, value: any, fullpath: string[]) => {\r\n        console.log('set name-->', name, value, fullpath);\r\n    }\r\n    onBeforeReturnGet: (name: string, value: any, fullpath: string[]) => {\r\n        console.log('get name-->', name, value, fullpath);\r\n    }\r\n}</pre>\r\n        </figure>\r\n        <p>exclude detect property: Config</p>\r\n        <dl>\r\n            <ul>\r\n                <li>\r\n                    <dt>proxyExcludeOnBeforeReturnGets: ['propertyName']</dt>\r\n                    <dd></dd>\r\n                </li>\r\n                <li>\r\n                    <dt>proxyExcludeOnBeforeReturnSets: ['propertyName']</dt>\r\n                    <dd></dd>\r\n                </li>\r\n            </ul>\r\n        </dl>\r\n    </section>\r\n</article>\r\n\r\n";

var style$c = "";

var DomrenderDetect = /** @class */ (function () {
    function DomrenderDetect() {
    }
    DomrenderDetect.prototype.onInit = function () {
    };
    DomrenderDetect = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$c,
            styles: [style$c]
        }),
        __metadata("design:paramtypes", [])
    ], DomrenderDetect);
    return DomrenderDetect;
}());

var template$b = "<article>\r\n    <h1>Config</h1>\r\n    <p>dom-render config</p>\r\n    <section>\r\n        <h2>config</h2>\r\n        <figure>\r\n            <figcaption>Config.ts</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">export type TargetElement = {\r\n    _name: string,\r\n    template?: string,\r\n    styles?: string[],\r\n    callBack: (target: Element, obj: any, rawSet: RawSet) => DocumentFragment,\r\n    complete?: (target: Element, obj: any, rawSet: RawSet) => void\r\n};\r\n\r\nexport type TargetAttr = {\r\n    name: string,\r\n    callBack: (target: Element, attrValue: string, obj: any, rawSet: RawSet) => DocumentFragment,\r\n    complete?: (target: Element, attrValue: string, obj: any, rawSet: RawSet) => void\r\n};\r\n\r\nexport interface Config {\r\n    targetElements?: TargetElement[];\r\n    targetAttrs?: TargetAttr[];\r\n    onElementInit?: (name: string, obj: any, rawSet: RawSet) =&gt; void;\r\n    onAttrInit?: (name: string, attrValue: string, obj: any, rawSet: RawSet) =&gt; void;\r\n    proxyExcludeTyps?: ConstructorType&lt;any&gt;[];\r\n    proxyExcludeOnBeforeReturnSets?: string[];\r\n    proxyExcludeOnBeforeReturnGets?: string[];\r\n    scripts?: { [n: string]: any };\r\n    applyEvents?: { attrName: string, callBack: (elements: Element, attrValue: string, obj: any) => void }[];\r\n}</pre>\r\n        </figure>\r\n    </section>\r\n</article>\r\n\r\n";

var style$b = "";

var DomrenderConfig = /** @class */ (function () {
    function DomrenderConfig() {
    }
    DomrenderConfig.prototype.onInit = function () {
    };
    DomrenderConfig = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$b,
            styles: [style$b]
        }),
        __metadata("design:paramtypes", [])
    ], DomrenderConfig);
    return DomrenderConfig;
}());

var template$a = "<article>\r\n    <h1>Proxy</h1>\r\n    <p>all internal variables are managed by proxy (DomRenderProxy)</p>\r\n    <section>\r\n        <h2>exclude proxy</h2>\r\n        <p>(situation: Maximum call stack error)</p>\r\n        <figure>\r\n            <pre dr-pre class=\"code-container typescript\">// frezz\r\n{name : Object.freeze({...})}\r\n\r\n// Shield Object type: {[k: string]: any}\r\n{name : new Shield()}\r\n\r\n// DomRenderProxy Final\r\n{name : DomRenderProxy.final({...})}</pre>\r\n        </figure>\r\n        <dl>\r\n            <dt>exclude detect property: Config</dt>\r\n            <dd>proxyExcludeTyps: [Class...]</dd>\r\n        </dl>\r\n    </section>\r\n</article>\r\n\r\n";

var style$a = "";

var DomrenderProxy = /** @class */ (function () {
    function DomrenderProxy() {
    }
    DomrenderProxy.prototype.onInit = function () {
    };
    DomrenderProxy = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$a,
            styles: [style$a]
        }),
        __metadata("design:paramtypes", [])
    ], DomrenderProxy);
    return DomrenderProxy;
}());

var template$9 = "<article>\r\n    <h1>Class</h1>\r\n    <p>define class in dom-render framworks</p>\r\n    <section>\r\n        <h2>range</h2>\r\n        <dl>\r\n            <ul>\r\n                <li>\r\n                    <dt>in html</dt>\r\n                    <dd>variable: $range</dd>\r\n                </li>\r\n                <li>\r\n                    <dt>in class</dt>\r\n                    <dd>new Range(...)</dd>\r\n                </li>\r\n            </ul>\r\n        </dl>\r\n        <figure>\r\n            <figcaption>typescript</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">const range = new Range(100,55, 10);\r\nfor (let data of new Range(100,55, 10)) {\r\n  console.log(data);\r\n}\r\nconst rangeArray = new Range(100,55, 10).toArray();</pre>\r\n        </figure>\r\n        <figure>\r\n            <figcaption>html</figcaption>\r\n            <pre dr-pre class=\"code-container html\">&lt;div dr-repeat=&quot;$range(10, 20)&quot;&gt;&lt;div&gt;#it#&lt;/div&gt;&lt;/div&gt;</pre>\r\n        </figure>\r\n\r\n\r\n        <figure>\r\n            <figcaption>Range iterator class</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">export declare class Range implements Iterable&lt;number&gt; {\r\n    first: number;\r\n    last: number;\r\n    step: number;\r\n    readonly isRange = true;\r\n    constructor(first: number, last: number, step?: number);\r\n    [Symbol.iterator](): Iterator&lt;number&gt;;\r\n    static range(first: number | string, last?: number, step?: number): Range;\r\n    toArray(): number[];\r\n}</pre>\r\n        </figure>\r\n    </section>\r\n</article>\r\n\r\n";

var style$9 = "";

var DomrenderClass = /** @class */ (function () {
    function DomrenderClass() {
    }
    DomrenderClass.prototype.onInit = function () {
    };
    DomrenderClass = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$9,
            styles: [style$9]
        }),
        __metadata("design:paramtypes", [])
    ], DomrenderClass);
    return DomrenderClass;
}());

var template$8 = "<article>\r\n    <h1>option config</h1>\r\n    <p>simple-boot-front Framworks option</p>\r\n    <section>\r\n        <h2>simFrontOption</h2>\r\n        <figure>\r\n            <figcaption>simple-boot-front/option/SimFrontOption.ts</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">const config = new SimFrontOption(window);</pre>\r\n            <pre dr-pre class=\"code-container typescript\">export declare enum UrlType {\r\n    path = \"path\",\r\n    hash = \"hash\"\r\n}\r\nexport declare class SimFrontOption extends SimOption {\r\n    window: Window;\r\n    selector: string;\r\n    urlType: UrlType;\r\n    constructor(window: Window, advice?: ConstructorType&lt;any&gt;[]);\r\n    setSelector(selector: string): SimFrontOption;\r\n    setUrlType(urlType: UrlType): SimFrontOption;\r\n}\r\n</pre>\r\n        </figure>\r\n        <dl class=\"dl-container\">\r\n            <ul>\r\n                <li>\r\n                    <dt>constructor</dt>\r\n                    <dd>\r\n                        <ol>\r\n                            <li>\r\n                                window object\r\n                            </li>\r\n                            <li>\r\n                                global advice class @Sim class type\r\n                            </li>\r\n                        </ol>\r\n                    </dd>\r\n                </li>\r\n                <li>\r\n                    <dt>selector</dt>\r\n                </li>\r\n                <dd>target element selector (default: '#app')</dd>\r\n                <li>\r\n                    <dt>urlType</dt>\r\n                    <dd>\r\n                        <ul>\r\n                            <li>UrlType.path (default)</li>\r\n                            <li>UrlType.hash</li>\r\n                        </ul>\r\n                    </dd>\r\n                </li>\r\n            </ul>\r\n        </dl>\r\n    </section>\r\n\r\n    <hr>\r\n\r\n    <section>\r\n        <h2>simpleBootFront</h2>\r\n        <figure>\r\n            <figcaption>simple-boot-front/SimpleBootFront.ts</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">const config = new SimFrontOption(window);\r\nnew SimpleBootFront(Index, config).run();</pre>\r\n            <pre dr-pre class=\"code-container typescript\">export declare class SimpleBootFront extends SimpleApplication {\r\n    rootRouter: ConstructorType&lt;any&gt;;\r\n    option: SimFrontOption;\r\n    navigation: Navigation;\r\n    domRendoerExcludeProxy: (typeof SimFrontOption | typeof SimstanceManager | typeof SimpleApplication | typeof Navigation | typeof HttpService | typeof IntentManager | typeof RouterManager)[];\r\n    domRenderTargetElements: TargetElement[];\r\n    domRenderTargetAttrs: TargetAttr[];\r\n    domRenderConfig: Config;\r\n    constructor(rootRouter: ConstructorType&lt;any&gt;, option: SimFrontOption);\r\n    getComponentInnerHtml(targetObj: any): string;\r\n    createDomRender&lt;T extends object&gt;(obj: T): T;\r\n    run(): void;\r\n    private afterSetting;\r\n    resetDomrenderScripts(): void;\r\n}</pre>\r\n        </figure>\r\n        <dl class=\"dl-container\">\r\n            <ul>\r\n                <li>\r\n                    <dt>constructor</dt>\r\n                    <dd>\r\n                        <ol>\r\n                            <li>\r\n                                Router Component or Component class type\r\n                            </li>\r\n                            <li>\r\n                                SimFrontOption object\r\n                            </li>\r\n                        </ol>\r\n                    </dd>\r\n                </li>\r\n                <li>\r\n                    <dt>domRendoerExcludeProxy</dt>\r\n                </li>\r\n                <dd>domRender proxy exclude type list</dd>\r\n                <li>\r\n                    <dt>run</dt>\r\n                </li>\r\n                <dd>simple-boot-front start</dd>\r\n            </ul>\r\n        </dl>\r\n    </section>\r\n</article>\r\n\r\n";

var style$8 = "";

var FrontOption = /** @class */ (function () {
    function FrontOption(apiService) {
        this.apiService = apiService;
    }
    FrontOption.prototype.onInit = function () {
    };
    FrontOption = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$8,
            styles: [style$8]
        }),
        __metadata("design:paramtypes", [ApiService])
    ], FrontOption);
    return FrontOption;
}());

var template$7 = "<article>\r\n    <h1>Exception Advice</h1>\r\n    <ul>\r\n        <li>Support Global, Exception Type Advice</li>\r\n    </ul>\r\n    <hr>\r\n    <section>\r\n        <h2>@ExceptionHandler</h2>\r\n        <figure>\r\n            <figcaption>ExceptionHandler simple-boot-core/decorators/exception/ExceptionDecorator</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">@Sim()\r\nexport class GlobalAdvice {\r\n\r\n    constructor() {\r\n    }\r\n\r\n    @ExceptionHandler()\r\n    print(error: any){\r\n        console.log('global advice errorr', error.msg)\r\n    }\r\n\r\n    @ExceptionHandler(NotFoundError)\r\n    print(error: NotFoundError){\r\n        console.log('NotFoundError', error)\r\n    }\r\n\r\n}\r\n</pre>\r\n        </figure>\r\n    </section>\r\n    <hr>\r\n    <section>\r\n        <h2>exceptionHandler</h2>\r\n        <figure>\r\n            <figcaption>ExceptionDecorator.ts</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">export const ExceptionHandler = (target?: ConstructorType&lt;any&gt;) =&gt; {\r\n    return ReflectUtils.metadata(ExceptionHandlerMetadataKey, target ?? null);\r\n}</pre>\r\n        </figure>\r\n        <dl>\r\n            <ul>\r\n                <li>\r\n                    <dt>target</dt>\r\n                    <dl>target Exception Target (optional)</dl>\r\n                </li>\r\n            </ul>\r\n        </dl>\r\n    </section>\r\n</article>\r\n\r\n";

var style$7 = "";

var CoreAdvice = /** @class */ (function () {
    function CoreAdvice() {
    }
    CoreAdvice.prototype.onInit = function () {
    };
    CoreAdvice = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$7,
            styles: [style$7]
        }),
        __metadata("design:paramtypes", [])
    ], CoreAdvice);
    return CoreAdvice;
}());

var template$6 = "<article>\r\n    <h1>SIMPLE-BOOT-CORE</h1>\r\n    <p>core Engine</p>\r\n\r\n    <ul class=\"badge-container\">\r\n        <li>\r\n            <a href=\"https://www.npmjs.com/package/simple-boot-core\" target=\"_blank\"><img dr-attr=\"{'src': 'https://img.shields.io/badge/npm-'+(this.package?.version??'')+'-blue?logo=npm'}\"></a>\r\n        </li>\r\n        <li>\r\n            <img dr-attr=\"{'src': 'https://img.shields.io/badge/license-'+(this.package?.license??'')+'-green'}\">\r\n        </li>\r\n        <li>\r\n            <a href=\"https://github.com/visualkhh/simple-boot-core\" target=\"_blank\"><img src=\"https://img.shields.io/badge/-github-black?logo=github\"></a>\r\n        </li>\r\n    </ul>\r\n\r\n    <section>\r\n        <h2>our primary goals are</h2>\r\n        <ul>\r\n            <li>manage objects easily.</li>\r\n            <li>users focus only on business logic.</li>\r\n        </ul>\r\n    </section>\r\n\r\n    <hr>\r\n\r\n    <section>\r\n        <h2>dependencies</h2>\r\n        <ul>\r\n            <li>0 zero dependency</li>\r\n        </ul>\r\n    </section>\r\n\r\n    <hr>\r\n    <core-lifecycle-section></core-lifecycle-section>\r\n    <hr>\r\n    <core-function-section></core-function-section>\r\n    <hr>\r\n\r\n    <section>\r\n        <h2>contributors</h2>\r\n        <a href=\"https://github.com/visualkhh/simple-boot-core/graphs/contributors\">\r\n            <img src=\"https://contrib.rocks/image?repo=visualkhh/simple-boot-core\">\r\n        </a>\r\n    </section>\r\n</article>\r\n";

var style$6 = "";

var CoreIntroduction = /** @class */ (function () {
    function CoreIntroduction(apiService) {
        this.apiService = apiService;
    }
    CoreIntroduction.prototype.onInit = function () {
        var _this = this;
        this.apiService.getJson('https://visualkhh.github.io/simple-boot-core/package.json').then(function (it) {
            _this.package = it;
        });
    };
    CoreIntroduction = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$6,
            styles: [style$6],
            using: [CoreLifecycleSection, CoreFunctionSection]
        }),
        __metadata("design:paramtypes", [ApiService])
    ], CoreIntroduction);
    return CoreIntroduction;
}());

var template$5 = "<article>\r\n    <h1>???? Quick start</h1>\r\n    <p>Start a project simply and quickly.</p>\r\n    <section>\r\n        <h2>create</h2>\r\n        <figure>\r\n            <figcaption>terminal</figcaption>\r\n            <pre class=\"code-container bash\">npm install simple-boot-core</pre>\r\n        </figure>\r\n    </section>\r\n\r\n    <hr>\r\n    <section>\r\n        <h2>simple-boot-core start</h2>\r\n        <figure>\r\n            <figcaption>index.ts</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">const option = new SimOption([GlobalAdvice]);\r\nconst simpleApplication = new SimpleApplication(AppRouter, option);\r\nsimpleApplication.run();\r\nconst intent = new Intent(&#39;/user/456/addr&#39;);\r\nsimpleApplication.routing&lt;SimAtomic&lt;any&gt;, any&gt;(intent)\r\n .then(it =&gt; {\r\n    let moduleInstance = it.getModuleInstance&lt;UserAddr&gt;();\r\n    moduleInstance?.print();\r\n });</pre>\r\n        </figure>\r\n    </section>\r\n\r\n    <hr>\r\n    <core-router-template-section></core-router-template-section>\r\n</article>\r\n\r\n";

var style$5 = "";

var CoreQuickstart = /** @class */ (function () {
    function CoreQuickstart() {
    }
    CoreQuickstart.prototype.onInit = function () {
    };
    CoreQuickstart = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$5,
            styles: [style$5],
            using: [CoreRouterTemplateSection]
        }),
        __metadata("design:paramtypes", [])
    ], CoreQuickstart);
    return CoreQuickstart;
}());

var template$4 = "<article>\r\n    <h1>@Router</h1>\r\n    <p>routing controller</p>\r\n\r\n    <core-router-template-section dr-on-init=\"$component.title='create'\"></core-router-template-section>\r\n    <hr>\r\n    <core-routermapping-section></core-routermapping-section>\r\n    <hr>\r\n    <core-routerconfig-section></core-routerconfig-section>\r\n    <hr>\r\n    <core-routercurrent-section></core-routercurrent-section>\r\n    <hr>\r\n    <core-routeraction-section></core-routeraction-section>\r\n</article>\r\n\r\n";

var style$4 = "";

var CoreRouter = /** @class */ (function () {
    function CoreRouter() {
    }
    CoreRouter.prototype.onInit = function () {
    };
    CoreRouter = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$4,
            styles: [style$4],
            using: [CoreRouterconfigSection, CoreRouterTemplateSection, CoreRoutermappingSection, CoreRoutercurrentSection, CoreRouteractionSection]
        }),
        __metadata("design:paramtypes", [])
    ], CoreRouter);
    return CoreRouter;
}());

var template$3 = "<article>\r\n    <h1>??????Intent Event System</h1>\r\n    <p>transmit data between objects and generate events</p>\r\n    <p>send data and generate events to @Sim scheme</p>\r\n    <ul>\r\n        <li>Support Object transmission</li>\r\n        <li>Support query parameters</li>\r\n        <li>Allocate directly to variables</li>\r\n        <li>Calling the method</li>\r\n    </ul>\r\n    <hr>\r\n    <section>\r\n        <h2>intent publish</h2>\r\n        <figure>\r\n            <figcaption>publish</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">@Sim({scheme:'user'})\r\nexport class User {\r\n    constructor(private intentManager: IntentManager) {\r\n    }\r\n    publishEvent() {\r\n        // this.intentManager.publish(new Intent('targetScheme://path?a=55', 'ddddddddddd'));\r\n        // this.intentManager.publish(new Intent('targetScheme://path?bb=44&ff=44', '444'));\r\n        // this.intentManager.publish(new Intent('targetScheme://path?gg=55&sadfsdf=444', '55'));\r\n        //global\r\n        this.intentManager.publish('://path?query=a')\r\n        //target\r\n        this.intentManager.publish('scheme://path?query=a')\r\n    }\r\n}</pre>\r\n        </figure>\r\n    </section>\r\n    <hr>\r\n    <section>\r\n        <h2>intent subscribe</h2>\r\n\r\n\r\n\r\n        <figure>\r\n            <figcaption>implements interface IntentSubscribe</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">export interface IntentSubscribe {\r\n    intentSubscribe(intent: Intent): void;\r\n}\r\n</pre>\r\n        </figure>\r\n        <figure>\r\n            <figcaption>method subscribe</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">class User implements IntentSubscribe {\r\n    intentSubscribe(intent: Intent) {\r\n        //receive\r\n    }\r\n}</pre>\r\n        </figure>\r\n    </section>\r\n<hr>\r\n    <section>\r\n        <h2>intent</h2>\r\n        <figure>\r\n            <figcaption>simple-boot-core/intent/Intent</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">export declare class Intent&lt;T = any, E = any&gt; {\r\n    uri: string;\r\n    data?: T | undefined;\r\n    event?: E | undefined;\r\n    constructor(uri: string, data?: T | undefined, event?: E | undefined);\r\n    get scheme(): string;\r\n    get paths(): string[];\r\n    get fullPath(): string;\r\n    get pathname(): string;\r\n    get query(): string;\r\n    get queryParams(): {\r\n        [key: string]: string;\r\n    };\r\n    getPathnameData(urlExpression: string): {\r\n        [name: string]: string;\r\n    } | undefined;\r\n}\r\n</pre>\r\n        </figure>\r\n    </section>\r\n</article>\r\n\r\n";

var style$3 = "";

var CoreIntent = /** @class */ (function () {
    function CoreIntent() {
    }
    CoreIntent.prototype.onInit = function () {
    };
    CoreIntent = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$3,
            styles: [style$3]
        }),
        __metadata("design:paramtypes", [])
    ], CoreIntent);
    return CoreIntent;
}());

var template$2 = "<article>\r\n    <h1>Aspect Oriented Programming (AOP)</h1>\r\n    <ul>\r\n        <li>Support method aop</li>\r\n    </ul>\r\n    <hr>\r\n    <section>\r\n        <h2>@After, @Before</h2>\r\n        <figure>\r\n            <figcaption>After, Before simple-boot-core/decorators/aop/AOPDecorato</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">@Sim()\r\nexport class User {\r\n    // target method\r\n    print() {\r\n        console.log('execute print method');\r\n    }\r\n\r\n    @Before({property: 'print'})\r\n    before() {\r\n        console.log('---Before----');\r\n    }\r\n\r\n    @After({property: 'print'})\r\n    after() {\r\n        console.log('---After----');\r\n    }\r\n}}</pre>\r\n        </figure>\r\n    </section>\r\n    <hr>\r\n    <section>\r\n        <h2>AOPOption</h2>\r\n        <figure>\r\n            <figcaption>AOPOption</figcaption>\r\n            <pre dr-pre class=\"code-container typescript\">type AOPOption = {type?: ConstructorType&lt;any&gt;, property: string}</pre>\r\n        </figure>\r\n        <dl>\r\n            <ul>\r\n                <li>\r\n                    <dt>type</dt>\r\n                    <dl>target Type (optional)</dl>\r\n                </li>\r\n                <li>\r\n                    <dt>property</dt>\r\n                    <dl>property method name</dl>\r\n                </li>\r\n            </ul>\r\n        </dl>\r\n    </section>\r\n</article>\r\n\r\n";

var style$2 = "";

var CoreAop = /** @class */ (function () {
    function CoreAop() {
    }
    CoreAop.prototype.onInit = function () {
    };
    CoreAop = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$2,
            styles: [style$2]
        }),
        __metadata("design:paramtypes", [])
    ], CoreAop);
    return CoreAop;
}());

var template$1 = "<!--    <p>??\\_(???)_/?? - Everyone</p>-->\r\n<article>\r\n    <h1>CREATE-SIMPLE-BOOT-FRONT</h1>\r\n    <p>default boilerplate template creater</p>\r\n    <ul class=\"badge-container\">\r\n        <li>\r\n            <a href=\"https://www.npmjs.com/package/create-simple-boot-front\" target=\"_blank\"><img dr-attr=\"{'src': 'https://img.shields.io/badge/npm-'+(this.package?.version??'')+'-blue?logo=npm'}\"></a>\r\n        </li>\r\n        <li>\r\n            <img dr-attr=\"{'src': 'https://img.shields.io/badge/license-'+(this.package?.license??'')+'-green'}\">\r\n        </li>\r\n        <li>\r\n            <a href=\"https://github.com/visualkhh/simple-boot-front/tree/master/create\" target=\"_blank\"><img src=\"https://img.shields.io/badge/-github-black?logo=github\"></a>\r\n        </li>\r\n    </ul>\r\n    <section>\r\n        <h2>???? Quick start </h2>\r\n        <figure>\r\n            <figcaption>terminal</figcaption>\r\n            <pre class=\"code-container bash\">npm init simple-boot-front projectname\r\ncd projectname\r\nnpm start</pre>\r\n        </figure>\r\n        <dl class=\"dl-container\">\r\n            <ul>\r\n                <li>\r\n                    <dt>bundler</dt>\r\n                    <dd>\r\n                        rollup <small>(default)</small>\r\n                    </dd>\r\n                </li>\r\n            </ul>\r\n        </dl>\r\n    </section>\r\n    <hr>\r\n    <section>\r\n        <h2>example</h2>\r\n        <figure>\r\n            <figcaption>serve</figcaption>\r\n            <pre class=\"code-container bash\">sbf serve --path ../dist --watch</pre>\r\n        </figure>\r\n    </section>\r\n</article>\r\n";

var style$1 = "";

var CreateIntroduction = /** @class */ (function () {
    function CreateIntroduction(apiService) {
        this.apiService = apiService;
    }
    CreateIntroduction.prototype.onInit = function () {
        var _this = this;
        this.apiService.getJson('https://visualkhh.github.io/simple-boot-front/create/package.json').then(function (it) {
            _this.package = it;
        });
    };
    CreateIntroduction = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template$1,
            styles: [style$1]
        }),
        __metadata("design:paramtypes", [ApiService])
    ], CreateIntroduction);
    return CreateIntroduction;
}());

var template = "<!--    <p>??\\_(???)_/?? - Everyone</p>-->\r\n<article>\r\n    <h1>SIMPLE-BOOT-FRONT-CLI (sbf)</h1>\r\n    <p>sbf cli</p>\r\n    <ul class=\"badge-container\">\r\n        <li>\r\n            <a href=\"https://www.npmjs.com/package/simple-boot-front-cli\" target=\"_blank\"><img dr-attr=\"{'src': 'https://img.shields.io/badge/npm-'+(this.package?.version??'')+'-blue?logo=npm'}\"></a>\r\n        </li>\r\n        <li>\r\n            <img dr-attr=\"{'src': 'https://img.shields.io/badge/license-'+(this.package?.license??'')+'-green'}\">\r\n        </li>\r\n        <li>\r\n            <a href=\"https://github.com/visualkhh/simple-boot-front/tree/master/cli\" target=\"_blank\"><img src=\"https://img.shields.io/badge/-github-black?logo=github\"></a>\r\n        </li>\r\n    </ul>\r\n    <section>\r\n        <h2>???? Quick start </h2>\r\n        <figure>\r\n            <figcaption>terminal</figcaption>\r\n            <pre class=\"code-container bash\">npm install simple-boot-front-cli</pre>\r\n        </figure>\r\n        <dl class=\"dl-container\">\r\n            <ul>\r\n                <li>\r\n                    <dt>serve</dt>\r\n                    <dd>\r\n                        http server and proxy\r\n                        <ul>\r\n                            <li>--path dist path</li>\r\n                            <li>--port server port</li>\r\n                            <li>--proxy proxy url</li>\r\n                            <li>--bundle rollup</li>\r\n                            <li>--watch fileChange(dist) browser refresh</li>\r\n                        </ul>\r\n                    </dd>\r\n                </li>\r\n                <li>\r\n                    <dt>create</dt>\r\n                    <dd>create simple-boot-front template project</dd>\r\n                </li>\r\n                <li>\r\n                    <dt>rollup-build</dt>\r\n                    <dd>\r\n                        project rollup bundle\r\n                        <ul>\r\n                            <li>--config rollup config path</li>\r\n                            <li>--watch rollup watc</li>\r\n                        </ul>\r\n                    </dd>\r\n                </li>\r\n                <li>\r\n                    <dt>exec</dt>\r\n                    <dd>\r\n                        executing Shell Commands <small>(child-process)</small>\r\n                        <ul>\r\n                            <li>--cmd 'copmmand' ...--cmd... <small>(multiple)</small></li>\r\n                        </ul>\r\n                    </dd>\r\n                </li>\r\n            </ul>\r\n        </dl>\r\n    </section>\r\n    <hr>\r\n    <section>\r\n        <h2>example</h2>\r\n        <figure>\r\n            <figcaption>serve</figcaption>\r\n            <pre class=\"code-container bash\">sbf serve --path ../dist --watch</pre>\r\n        </figure>\r\n    </section>\r\n</article>\r\n";

var style = "";

var CliIntroduction = /** @class */ (function () {
    function CliIntroduction(apiService) {
        this.apiService = apiService;
    }
    CliIntroduction.prototype.onInit = function () {
        var _this = this;
        this.apiService.getJson('https://visualkhh.github.io/simple-boot-front/cli/package.json').then(function (it) {
            _this.package = it;
        });
    };
    CliIntroduction = __decorate([
        SimDecorator_7(),
        Component_3({
            template: template,
            styles: [style]
        }),
        __metadata("design:paramtypes", [ApiService])
    ], CliIntroduction);
    return CliIntroduction;
}());

var IndexRouter = /** @class */ (function () {
    function IndexRouter(navagation) {
        this.navagation = navagation;
        this.detailsItems = [];
        this.defaultAutoSeconds = 10;
        this.autoSeconds = this.defaultAutoSeconds;
        this.forceAutoStop = false;
        var data = SimDecorator_3(this);
        this.route = data.route;
    }
    IndexRouter.prototype.onInit = function () {
        var _a;
        this.detailsItems = this.getDetails((_a = this.category) === null || _a === void 0 ? void 0 : _a.value);
    };
    IndexRouter.prototype.changeCategory = function (data) {
        this.detailsItems = this.getDetails(data);
    };
    IndexRouter.prototype.changeDetail = function (data) {
        if (data) {
            this.navagation.go(data);
        }
    };
    IndexRouter.prototype.getPath = function (depth) {
        var _a, _b;
        return (_b = (_a = this.navagation.path) === null || _a === void 0 ? void 0 : _a.split('/')[depth]) !== null && _b !== void 0 ? _b : '';
    };
    IndexRouter.prototype.getDetails = function (prefix) {
        if (prefix === void 0) { prefix = ''; }
        return Object.entries(this.route).filter(function (_a) {
            var k = _a[0]; _a[1];
            return k.split('/')[1] === prefix;
        }).map(function (_a) {
            var k = _a[0]; _a[1];
            return k;
        });
    };
    IndexRouter.prototype.canActivate = function (url, module) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                window.scrollTo(0, 0);
                this.child = module;
                // hljs.highlightAll();
                feather.replace({ 'aria-hidden': 'true' });
                document.querySelectorAll('.code-container').forEach(function (el) {
                    hljs.highlightElement(el);
                });
                return [2 /*return*/];
            });
        });
    };
    IndexRouter.prototype.hasActivate = function (checkObj) {
        return this.child === checkObj;
    };
    IndexRouter = __decorate([
        SimDecorator_7(),
        SimDecorator_4({
            path: '',
            route: {
                '/': '/simple-boot-front/introduction',
                '/simple-boot-front/introduction': FrontIntroduction,
                '/simple-boot-front/quick-start': FrontQuickstart,
                '/simple-boot-front/component': FrontComponent,
                '/simple-boot-front/router': FrontRouter,
                '/simple-boot-front/script': FrontScript,
                '/dom-render/introduction': DomrenderIntroduction,
                '/dom-render/quick-start': DomrenderQuickstart,
                '/dom-render/function': DomrenderFunction,
                '/dom-render/script': DomrenderScript,
                '/dom-render/component': DomrenderComponent,
                '/dom-render/validation': DomrenderValidation,
                '/dom-render/class': DomrenderClass,
                '/dom-render/proxy': DomrenderProxy,
                '/dom-render/detect': DomrenderDetect,
                '/dom-render/config': DomrenderConfig,
                '/simple-boot-front/config-option': FrontOption,
                '/simple-boot-core/introduction': CoreIntroduction,
                '/simple-boot-core/quick-start': CoreQuickstart,
                '/simple-boot-core/router': CoreRouter,
                '/simple-boot-core/intent': CoreIntent,
                '/simple-boot-core/aop': CoreAop,
                '/simple-boot-core/advice': CoreAdvice,
                '/create-simple-boot-front/introduction': CreateIntroduction,
                '/simple-boot-front-cli/introduction': CliIntroduction
            }
        }),
        Component_3({
            template: template$10,
            styles: [style$n],
        }),
        __metadata("design:paramtypes", [Navigation_2])
    ], IndexRouter);
    return IndexRouter;
}());

function start() {
    var simFrontOption = new SimFrontOption_2(window).setUrlType(SimFrontOption_3.hash);
    var simpleApplication = new SimpleBootFront_2(IndexRouter, simFrontOption);
    return simpleApplication;
}
start().run();
//# sourceMappingURL=bundle.js.map
