(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var trailingNewlineRegex = /\n[\s]+$/
var leadingNewlineRegex = /^\n[\s]+/
var trailingSpaceRegex = /[\s]+$/
var leadingSpaceRegex = /^[\s]+/
var multiSpaceRegex = /[\n\s]+/g

var TEXT_TAGS = [
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'data', 'dfn', 'em', 'i',
  'kbd', 'mark', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'amp', 'small', 'span',
  'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'
]

var VERBATIM_TAGS = [
  'code', 'pre', 'textarea'
]

module.exports = function appendChild (el, childs) {
  if (!Array.isArray(childs)) return

  var nodeName = el.nodeName.toLowerCase()

  var hadText = false
  var value, leader

  for (var i = 0, len = childs.length; i < len; i++) {
    var node = childs[i]
    if (Array.isArray(node)) {
      appendChild(el, node)
      continue
    }

    if (typeof node === 'number' ||
      typeof node === 'boolean' ||
      typeof node === 'function' ||
      node instanceof Date ||
      node instanceof RegExp) {
      node = node.toString()
    }

    var lastChild = el.childNodes[el.childNodes.length - 1]

    // Iterate over text nodes
    if (typeof node === 'string') {
      hadText = true

      // If we already had text, append to the existing text
      if (lastChild && lastChild.nodeName === '#text') {
        lastChild.nodeValue += node

      // We didn't have a text node yet, create one
      } else {
        node = document.createTextNode(node)
        el.appendChild(node)
        lastChild = node
      }

      // If this is the last of the child nodes, make sure we close it out
      // right
      if (i === len - 1) {
        hadText = false
        // Trim the child text nodes if the current node isn't a
        // node where whitespace matters.
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          // The very first node in the list should not have leading
          // whitespace. Sibling text nodes should have whitespace if there
          // was any.
          leader = i === 0 ? '' : ' '
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, leader)
            .replace(leadingSpaceRegex, ' ')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

    // Iterate over DOM nodes
    } else if (node && node.nodeType) {
      // If the last node was a text node, make sure it is properly closed out
      if (hadText) {
        hadText = false

        // Trim the child text nodes if the current node isn't a
        // text node or a code node
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')

          // Remove empty text nodes, append otherwise
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        // Trim the child nodes if the current node is not a node
        // where all whitespace must be preserved
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingSpaceRegex, ' ')
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

      // Store the last nodename
      var _nodeName = node.nodeName
      if (_nodeName) nodeName = _nodeName.toLowerCase()

      // Append the node to the DOM
      el.appendChild(node)
    }
  }
}

},{}],2:[function(require,module,exports){
var hyperx = require('hyperx')
var appendChild = require('./appendChild')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var BOOL_PROPS = [
  'autofocus', 'checked', 'defaultchecked', 'disabled', 'formnovalidate',
  'indeterminate', 'readonly', 'required', 'selected', 'willvalidate'
]

var COMMENT_TAG = '!--'

var SVG_TAGS = [
  'svg', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
  'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood',
  'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage',
  'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
  'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter',
  'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src',
  'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image',
  'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph',
  'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

function belCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  } else {
    el = document.createElement(tag)
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS.indexOf(key) !== -1) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else {
        if (ns) {
          if (p === 'xlink:href') {
            el.setAttributeNS(XLINKNS, p, val)
          } else if (/^xmlns($|:)/i.test(p)) {
            // skip xmlns definitions
          } else {
            el.setAttributeNS(null, p, val)
          }
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  appendChild(el, children)
  return el
}

module.exports = hyperx(belCreateElement, {comments: true})
module.exports.default = module.exports
module.exports.createElement = belCreateElement

},{"./appendChild":1,"hyperx":6}],3:[function(require,module,exports){
function rawCreateElement (tag) {
  if (typeof window !== 'undefined') {
    return browser()
  } else {
    return server()
  }

  function browser () {
    var el = document.createElement('div')
    el.innerHTML = tag
    return toArray(el.childNodes)
  }

  function server () {
    var wrapper = new String(tag) // eslint-disable-line no-new-wrappers
    wrapper.__encoded = true
    return wrapper
  }
}

function toArray (arr) {
  return Array.isArray(arr) ? arr : [].slice.call(arr)
}

module.exports = rawCreateElement

},{}],4:[function(require,module,exports){
(function (global,setImmediate){(function (){
/*
 * Dexie.js - a minimalistic wrapper for IndexedDB
 * ===============================================
 *
 * By David Fahlander, david.fahlander@gmail.com
 *
 * Version 3.2.3, Mon Jan 23 2023
 *
 * https://dexie.org
 *
 * Apache License Version 2.0, January 2004, http://www.apache.org/licenses/
 */
 
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Dexie = factory());
})(this, (function () { 'use strict';

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
    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    var _global = typeof globalThis !== 'undefined' ? globalThis :
        typeof self !== 'undefined' ? self :
            typeof window !== 'undefined' ? window :
                global;

    var keys = Object.keys;
    var isArray = Array.isArray;
    if (typeof Promise !== 'undefined' && !_global.Promise) {
        _global.Promise = Promise;
    }
    function extend(obj, extension) {
        if (typeof extension !== 'object')
            return obj;
        keys(extension).forEach(function (key) {
            obj[key] = extension[key];
        });
        return obj;
    }
    var getProto = Object.getPrototypeOf;
    var _hasOwn = {}.hasOwnProperty;
    function hasOwn(obj, prop) {
        return _hasOwn.call(obj, prop);
    }
    function props(proto, extension) {
        if (typeof extension === 'function')
            extension = extension(getProto(proto));
        (typeof Reflect === "undefined" ? keys : Reflect.ownKeys)(extension).forEach(function (key) {
            setProp(proto, key, extension[key]);
        });
    }
    var defineProperty = Object.defineProperty;
    function setProp(obj, prop, functionOrGetSet, options) {
        defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === 'function' ?
            { get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true } :
            { value: functionOrGetSet, configurable: true, writable: true }, options));
    }
    function derive(Child) {
        return {
            from: function (Parent) {
                Child.prototype = Object.create(Parent.prototype);
                setProp(Child.prototype, "constructor", Child);
                return {
                    extend: props.bind(null, Child.prototype)
                };
            }
        };
    }
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    function getPropertyDescriptor(obj, prop) {
        var pd = getOwnPropertyDescriptor(obj, prop);
        var proto;
        return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
    }
    var _slice = [].slice;
    function slice(args, start, end) {
        return _slice.call(args, start, end);
    }
    function override(origFunc, overridedFactory) {
        return overridedFactory(origFunc);
    }
    function assert(b) {
        if (!b)
            throw new Error("Assertion Failed");
    }
    function asap$1(fn) {
        if (_global.setImmediate)
            setImmediate(fn);
        else
            setTimeout(fn, 0);
    }
    function arrayToObject(array, extractor) {
        return array.reduce(function (result, item, i) {
            var nameAndValue = extractor(item, i);
            if (nameAndValue)
                result[nameAndValue[0]] = nameAndValue[1];
            return result;
        }, {});
    }
    function tryCatch(fn, onerror, args) {
        try {
            fn.apply(null, args);
        }
        catch (ex) {
            onerror && onerror(ex);
        }
    }
    function getByKeyPath(obj, keyPath) {
        if (hasOwn(obj, keyPath))
            return obj[keyPath];
        if (!keyPath)
            return obj;
        if (typeof keyPath !== 'string') {
            var rv = [];
            for (var i = 0, l = keyPath.length; i < l; ++i) {
                var val = getByKeyPath(obj, keyPath[i]);
                rv.push(val);
            }
            return rv;
        }
        var period = keyPath.indexOf('.');
        if (period !== -1) {
            var innerObj = obj[keyPath.substr(0, period)];
            return innerObj === undefined ? undefined : getByKeyPath(innerObj, keyPath.substr(period + 1));
        }
        return undefined;
    }
    function setByKeyPath(obj, keyPath, value) {
        if (!obj || keyPath === undefined)
            return;
        if ('isFrozen' in Object && Object.isFrozen(obj))
            return;
        if (typeof keyPath !== 'string' && 'length' in keyPath) {
            assert(typeof value !== 'string' && 'length' in value);
            for (var i = 0, l = keyPath.length; i < l; ++i) {
                setByKeyPath(obj, keyPath[i], value[i]);
            }
        }
        else {
            var period = keyPath.indexOf('.');
            if (period !== -1) {
                var currentKeyPath = keyPath.substr(0, period);
                var remainingKeyPath = keyPath.substr(period + 1);
                if (remainingKeyPath === "")
                    if (value === undefined) {
                        if (isArray(obj) && !isNaN(parseInt(currentKeyPath)))
                            obj.splice(currentKeyPath, 1);
                        else
                            delete obj[currentKeyPath];
                    }
                    else
                        obj[currentKeyPath] = value;
                else {
                    var innerObj = obj[currentKeyPath];
                    if (!innerObj || !hasOwn(obj, currentKeyPath))
                        innerObj = (obj[currentKeyPath] = {});
                    setByKeyPath(innerObj, remainingKeyPath, value);
                }
            }
            else {
                if (value === undefined) {
                    if (isArray(obj) && !isNaN(parseInt(keyPath)))
                        obj.splice(keyPath, 1);
                    else
                        delete obj[keyPath];
                }
                else
                    obj[keyPath] = value;
            }
        }
    }
    function delByKeyPath(obj, keyPath) {
        if (typeof keyPath === 'string')
            setByKeyPath(obj, keyPath, undefined);
        else if ('length' in keyPath)
            [].map.call(keyPath, function (kp) {
                setByKeyPath(obj, kp, undefined);
            });
    }
    function shallowClone(obj) {
        var rv = {};
        for (var m in obj) {
            if (hasOwn(obj, m))
                rv[m] = obj[m];
        }
        return rv;
    }
    var concat = [].concat;
    function flatten(a) {
        return concat.apply([], a);
    }
    var intrinsicTypeNames = "Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey"
        .split(',').concat(flatten([8, 16, 32, 64].map(function (num) { return ["Int", "Uint", "Float"].map(function (t) { return t + num + "Array"; }); }))).filter(function (t) { return _global[t]; });
    var intrinsicTypes = intrinsicTypeNames.map(function (t) { return _global[t]; });
    arrayToObject(intrinsicTypeNames, function (x) { return [x, true]; });
    var circularRefs = null;
    function deepClone(any) {
        circularRefs = typeof WeakMap !== 'undefined' && new WeakMap();
        var rv = innerDeepClone(any);
        circularRefs = null;
        return rv;
    }
    function innerDeepClone(any) {
        if (!any || typeof any !== 'object')
            return any;
        var rv = circularRefs && circularRefs.get(any);
        if (rv)
            return rv;
        if (isArray(any)) {
            rv = [];
            circularRefs && circularRefs.set(any, rv);
            for (var i = 0, l = any.length; i < l; ++i) {
                rv.push(innerDeepClone(any[i]));
            }
        }
        else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
            rv = any;
        }
        else {
            var proto = getProto(any);
            rv = proto === Object.prototype ? {} : Object.create(proto);
            circularRefs && circularRefs.set(any, rv);
            for (var prop in any) {
                if (hasOwn(any, prop)) {
                    rv[prop] = innerDeepClone(any[prop]);
                }
            }
        }
        return rv;
    }
    var toString = {}.toString;
    function toStringTag(o) {
        return toString.call(o).slice(8, -1);
    }
    var iteratorSymbol = typeof Symbol !== 'undefined' ?
        Symbol.iterator :
        '@@iterator';
    var getIteratorOf = typeof iteratorSymbol === "symbol" ? function (x) {
        var i;
        return x != null && (i = x[iteratorSymbol]) && i.apply(x);
    } : function () { return null; };
    var NO_CHAR_ARRAY = {};
    function getArrayOf(arrayLike) {
        var i, a, x, it;
        if (arguments.length === 1) {
            if (isArray(arrayLike))
                return arrayLike.slice();
            if (this === NO_CHAR_ARRAY && typeof arrayLike === 'string')
                return [arrayLike];
            if ((it = getIteratorOf(arrayLike))) {
                a = [];
                while ((x = it.next()), !x.done)
                    a.push(x.value);
                return a;
            }
            if (arrayLike == null)
                return [arrayLike];
            i = arrayLike.length;
            if (typeof i === 'number') {
                a = new Array(i);
                while (i--)
                    a[i] = arrayLike[i];
                return a;
            }
            return [arrayLike];
        }
        i = arguments.length;
        a = new Array(i);
        while (i--)
            a[i] = arguments[i];
        return a;
    }
    var isAsyncFunction = typeof Symbol !== 'undefined'
        ? function (fn) { return fn[Symbol.toStringTag] === 'AsyncFunction'; }
        : function () { return false; };

    var debug = typeof location !== 'undefined' &&
        /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
    function setDebug(value, filter) {
        debug = value;
        libraryFilter = filter;
    }
    var libraryFilter = function () { return true; };
    var NEEDS_THROW_FOR_STACK = !new Error("").stack;
    function getErrorWithStack() {
        if (NEEDS_THROW_FOR_STACK)
            try {
                getErrorWithStack.arguments;
                throw new Error();
            }
            catch (e) {
                return e;
            }
        return new Error();
    }
    function prettyStack(exception, numIgnoredFrames) {
        var stack = exception.stack;
        if (!stack)
            return "";
        numIgnoredFrames = (numIgnoredFrames || 0);
        if (stack.indexOf(exception.name) === 0)
            numIgnoredFrames += (exception.name + exception.message).split('\n').length;
        return stack.split('\n')
            .slice(numIgnoredFrames)
            .filter(libraryFilter)
            .map(function (frame) { return "\n" + frame; })
            .join('');
    }

    var dexieErrorNames = [
        'Modify',
        'Bulk',
        'OpenFailed',
        'VersionChange',
        'Schema',
        'Upgrade',
        'InvalidTable',
        'MissingAPI',
        'NoSuchDatabase',
        'InvalidArgument',
        'SubTransaction',
        'Unsupported',
        'Internal',
        'DatabaseClosed',
        'PrematureCommit',
        'ForeignAwait'
    ];
    var idbDomErrorNames = [
        'Unknown',
        'Constraint',
        'Data',
        'TransactionInactive',
        'ReadOnly',
        'Version',
        'NotFound',
        'InvalidState',
        'InvalidAccess',
        'Abort',
        'Timeout',
        'QuotaExceeded',
        'Syntax',
        'DataClone'
    ];
    var errorList = dexieErrorNames.concat(idbDomErrorNames);
    var defaultTexts = {
        VersionChanged: "Database version changed by other database connection",
        DatabaseClosed: "Database has been closed",
        Abort: "Transaction aborted",
        TransactionInactive: "Transaction has already completed or failed",
        MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
    };
    function DexieError(name, msg) {
        this._e = getErrorWithStack();
        this.name = name;
        this.message = msg;
    }
    derive(DexieError).from(Error).extend({
        stack: {
            get: function () {
                return this._stack ||
                    (this._stack = this.name + ": " + this.message + prettyStack(this._e, 2));
            }
        },
        toString: function () { return this.name + ": " + this.message; }
    });
    function getMultiErrorMessage(msg, failures) {
        return msg + ". Errors: " + Object.keys(failures)
            .map(function (key) { return failures[key].toString(); })
            .filter(function (v, i, s) { return s.indexOf(v) === i; })
            .join('\n');
    }
    function ModifyError(msg, failures, successCount, failedKeys) {
        this._e = getErrorWithStack();
        this.failures = failures;
        this.failedKeys = failedKeys;
        this.successCount = successCount;
        this.message = getMultiErrorMessage(msg, failures);
    }
    derive(ModifyError).from(DexieError);
    function BulkError(msg, failures) {
        this._e = getErrorWithStack();
        this.name = "BulkError";
        this.failures = Object.keys(failures).map(function (pos) { return failures[pos]; });
        this.failuresByPos = failures;
        this.message = getMultiErrorMessage(msg, failures);
    }
    derive(BulkError).from(DexieError);
    var errnames = errorList.reduce(function (obj, name) { return (obj[name] = name + "Error", obj); }, {});
    var BaseException = DexieError;
    var exceptions = errorList.reduce(function (obj, name) {
        var fullName = name + "Error";
        function DexieError(msgOrInner, inner) {
            this._e = getErrorWithStack();
            this.name = fullName;
            if (!msgOrInner) {
                this.message = defaultTexts[name] || fullName;
                this.inner = null;
            }
            else if (typeof msgOrInner === 'string') {
                this.message = "" + msgOrInner + (!inner ? '' : '\n ' + inner);
                this.inner = inner || null;
            }
            else if (typeof msgOrInner === 'object') {
                this.message = msgOrInner.name + " " + msgOrInner.message;
                this.inner = msgOrInner;
            }
        }
        derive(DexieError).from(BaseException);
        obj[name] = DexieError;
        return obj;
    }, {});
    exceptions.Syntax = SyntaxError;
    exceptions.Type = TypeError;
    exceptions.Range = RangeError;
    var exceptionMap = idbDomErrorNames.reduce(function (obj, name) {
        obj[name + "Error"] = exceptions[name];
        return obj;
    }, {});
    function mapError(domError, message) {
        if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
            return domError;
        var rv = new exceptionMap[domError.name](message || domError.message, domError);
        if ("stack" in domError) {
            setProp(rv, "stack", { get: function () {
                    return this.inner.stack;
                } });
        }
        return rv;
    }
    var fullNameExceptions = errorList.reduce(function (obj, name) {
        if (["Syntax", "Type", "Range"].indexOf(name) === -1)
            obj[name + "Error"] = exceptions[name];
        return obj;
    }, {});
    fullNameExceptions.ModifyError = ModifyError;
    fullNameExceptions.DexieError = DexieError;
    fullNameExceptions.BulkError = BulkError;

    function nop() { }
    function mirror(val) { return val; }
    function pureFunctionChain(f1, f2) {
        if (f1 == null || f1 === mirror)
            return f2;
        return function (val) {
            return f2(f1(val));
        };
    }
    function callBoth(on1, on2) {
        return function () {
            on1.apply(this, arguments);
            on2.apply(this, arguments);
        };
    }
    function hookCreatingChain(f1, f2) {
        if (f1 === nop)
            return f2;
        return function () {
            var res = f1.apply(this, arguments);
            if (res !== undefined)
                arguments[0] = res;
            var onsuccess = this.onsuccess,
            onerror = this.onerror;
            this.onsuccess = null;
            this.onerror = null;
            var res2 = f2.apply(this, arguments);
            if (onsuccess)
                this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
            if (onerror)
                this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
            return res2 !== undefined ? res2 : res;
        };
    }
    function hookDeletingChain(f1, f2) {
        if (f1 === nop)
            return f2;
        return function () {
            f1.apply(this, arguments);
            var onsuccess = this.onsuccess,
            onerror = this.onerror;
            this.onsuccess = this.onerror = null;
            f2.apply(this, arguments);
            if (onsuccess)
                this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
            if (onerror)
                this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
        };
    }
    function hookUpdatingChain(f1, f2) {
        if (f1 === nop)
            return f2;
        return function (modifications) {
            var res = f1.apply(this, arguments);
            extend(modifications, res);
            var onsuccess = this.onsuccess,
            onerror = this.onerror;
            this.onsuccess = null;
            this.onerror = null;
            var res2 = f2.apply(this, arguments);
            if (onsuccess)
                this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
            if (onerror)
                this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
            return res === undefined ?
                (res2 === undefined ? undefined : res2) :
                (extend(res, res2));
        };
    }
    function reverseStoppableEventChain(f1, f2) {
        if (f1 === nop)
            return f2;
        return function () {
            if (f2.apply(this, arguments) === false)
                return false;
            return f1.apply(this, arguments);
        };
    }
    function promisableChain(f1, f2) {
        if (f1 === nop)
            return f2;
        return function () {
            var res = f1.apply(this, arguments);
            if (res && typeof res.then === 'function') {
                var thiz = this, i = arguments.length, args = new Array(i);
                while (i--)
                    args[i] = arguments[i];
                return res.then(function () {
                    return f2.apply(thiz, args);
                });
            }
            return f2.apply(this, arguments);
        };
    }

    var INTERNAL = {};
    var LONG_STACKS_CLIP_LIMIT = 100,
    MAX_LONG_STACKS = 20, ZONE_ECHO_LIMIT = 100, _a$1 = typeof Promise === 'undefined' ?
        [] :
        (function () {
            var globalP = Promise.resolve();
            if (typeof crypto === 'undefined' || !crypto.subtle)
                return [globalP, getProto(globalP), globalP];
            var nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
            return [
                nativeP,
                getProto(nativeP),
                globalP
            ];
        })(), resolvedNativePromise = _a$1[0], nativePromiseProto = _a$1[1], resolvedGlobalPromise = _a$1[2], nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
    var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
    var patchGlobalPromise = !!resolvedGlobalPromise;
    var stack_being_generated = false;
    var schedulePhysicalTick = resolvedGlobalPromise ?
        function () { resolvedGlobalPromise.then(physicalTick); }
        :
            _global.setImmediate ?
                setImmediate.bind(null, physicalTick) :
                _global.MutationObserver ?
                    function () {
                        var hiddenDiv = document.createElement("div");
                        (new MutationObserver(function () {
                            physicalTick();
                            hiddenDiv = null;
                        })).observe(hiddenDiv, { attributes: true });
                        hiddenDiv.setAttribute('i', '1');
                    } :
                    function () { setTimeout(physicalTick, 0); };
    var asap = function (callback, args) {
        microtickQueue.push([callback, args]);
        if (needsNewPhysicalTick) {
            schedulePhysicalTick();
            needsNewPhysicalTick = false;
        }
    };
    var isOutsideMicroTick = true,
    needsNewPhysicalTick = true,
    unhandledErrors = [],
    rejectingErrors = [],
    currentFulfiller = null, rejectionMapper = mirror;
    var globalPSD = {
        id: 'global',
        global: true,
        ref: 0,
        unhandleds: [],
        onunhandled: globalError,
        pgp: false,
        env: {},
        finalize: function () {
            this.unhandleds.forEach(function (uh) {
                try {
                    globalError(uh[0], uh[1]);
                }
                catch (e) { }
            });
        }
    };
    var PSD = globalPSD;
    var microtickQueue = [];
    var numScheduledCalls = 0;
    var tickFinalizers = [];
    function DexiePromise(fn) {
        if (typeof this !== 'object')
            throw new TypeError('Promises must be constructed via new');
        this._listeners = [];
        this.onuncatched = nop;
        this._lib = false;
        var psd = (this._PSD = PSD);
        if (debug) {
            this._stackHolder = getErrorWithStack();
            this._prev = null;
            this._numPrev = 0;
        }
        if (typeof fn !== 'function') {
            if (fn !== INTERNAL)
                throw new TypeError('Not a function');
            this._state = arguments[1];
            this._value = arguments[2];
            if (this._state === false)
                handleRejection(this, this._value);
            return;
        }
        this._state = null;
        this._value = null;
        ++psd.ref;
        executePromiseTask(this, fn);
    }
    var thenProp = {
        get: function () {
            var psd = PSD, microTaskId = totalEchoes;
            function then(onFulfilled, onRejected) {
                var _this = this;
                var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
                var cleanup = possibleAwait && !decrementExpectedAwaits();
                var rv = new DexiePromise(function (resolve, reject) {
                    propagateToListener(_this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait, cleanup), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait, cleanup), resolve, reject, psd));
                });
                debug && linkToPreviousPromise(rv, this);
                return rv;
            }
            then.prototype = INTERNAL;
            return then;
        },
        set: function (value) {
            setProp(this, 'then', value && value.prototype === INTERNAL ?
                thenProp :
                {
                    get: function () {
                        return value;
                    },
                    set: thenProp.set
                });
        }
    };
    props(DexiePromise.prototype, {
        then: thenProp,
        _then: function (onFulfilled, onRejected) {
            propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
        },
        catch: function (onRejected) {
            if (arguments.length === 1)
                return this.then(null, onRejected);
            var type = arguments[0], handler = arguments[1];
            return typeof type === 'function' ? this.then(null, function (err) {
                return err instanceof type ? handler(err) : PromiseReject(err);
            })
                : this.then(null, function (err) {
                    return err && err.name === type ? handler(err) : PromiseReject(err);
                });
        },
        finally: function (onFinally) {
            return this.then(function (value) {
                onFinally();
                return value;
            }, function (err) {
                onFinally();
                return PromiseReject(err);
            });
        },
        stack: {
            get: function () {
                if (this._stack)
                    return this._stack;
                try {
                    stack_being_generated = true;
                    var stacks = getStack(this, [], MAX_LONG_STACKS);
                    var stack = stacks.join("\nFrom previous: ");
                    if (this._state !== null)
                        this._stack = stack;
                    return stack;
                }
                finally {
                    stack_being_generated = false;
                }
            }
        },
        timeout: function (ms, msg) {
            var _this = this;
            return ms < Infinity ?
                new DexiePromise(function (resolve, reject) {
                    var handle = setTimeout(function () { return reject(new exceptions.Timeout(msg)); }, ms);
                    _this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
                }) : this;
        }
    });
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag)
        setProp(DexiePromise.prototype, Symbol.toStringTag, 'Dexie.Promise');
    globalPSD.env = snapShot();
    function Listener(onFulfilled, onRejected, resolve, reject, zone) {
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.resolve = resolve;
        this.reject = reject;
        this.psd = zone;
    }
    props(DexiePromise, {
        all: function () {
            var values = getArrayOf.apply(null, arguments)
                .map(onPossibleParallellAsync);
            return new DexiePromise(function (resolve, reject) {
                if (values.length === 0)
                    resolve([]);
                var remaining = values.length;
                values.forEach(function (a, i) { return DexiePromise.resolve(a).then(function (x) {
                    values[i] = x;
                    if (!--remaining)
                        resolve(values);
                }, reject); });
            });
        },
        resolve: function (value) {
            if (value instanceof DexiePromise)
                return value;
            if (value && typeof value.then === 'function')
                return new DexiePromise(function (resolve, reject) {
                    value.then(resolve, reject);
                });
            var rv = new DexiePromise(INTERNAL, true, value);
            linkToPreviousPromise(rv, currentFulfiller);
            return rv;
        },
        reject: PromiseReject,
        race: function () {
            var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise(function (resolve, reject) {
                values.map(function (value) { return DexiePromise.resolve(value).then(resolve, reject); });
            });
        },
        PSD: {
            get: function () { return PSD; },
            set: function (value) { return PSD = value; }
        },
        totalEchoes: { get: function () { return totalEchoes; } },
        newPSD: newScope,
        usePSD: usePSD,
        scheduler: {
            get: function () { return asap; },
            set: function (value) { asap = value; }
        },
        rejectionMapper: {
            get: function () { return rejectionMapper; },
            set: function (value) { rejectionMapper = value; }
        },
        follow: function (fn, zoneProps) {
            return new DexiePromise(function (resolve, reject) {
                return newScope(function (resolve, reject) {
                    var psd = PSD;
                    psd.unhandleds = [];
                    psd.onunhandled = reject;
                    psd.finalize = callBoth(function () {
                        var _this = this;
                        run_at_end_of_this_or_next_physical_tick(function () {
                            _this.unhandleds.length === 0 ? resolve() : reject(_this.unhandleds[0]);
                        });
                    }, psd.finalize);
                    fn();
                }, zoneProps, resolve, reject);
            });
        }
    });
    if (NativePromise) {
        if (NativePromise.allSettled)
            setProp(DexiePromise, "allSettled", function () {
                var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
                return new DexiePromise(function (resolve) {
                    if (possiblePromises.length === 0)
                        resolve([]);
                    var remaining = possiblePromises.length;
                    var results = new Array(remaining);
                    possiblePromises.forEach(function (p, i) { return DexiePromise.resolve(p).then(function (value) { return results[i] = { status: "fulfilled", value: value }; }, function (reason) { return results[i] = { status: "rejected", reason: reason }; })
                        .then(function () { return --remaining || resolve(results); }); });
                });
            });
        if (NativePromise.any && typeof AggregateError !== 'undefined')
            setProp(DexiePromise, "any", function () {
                var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
                return new DexiePromise(function (resolve, reject) {
                    if (possiblePromises.length === 0)
                        reject(new AggregateError([]));
                    var remaining = possiblePromises.length;
                    var failures = new Array(remaining);
                    possiblePromises.forEach(function (p, i) { return DexiePromise.resolve(p).then(function (value) { return resolve(value); }, function (failure) {
                        failures[i] = failure;
                        if (!--remaining)
                            reject(new AggregateError(failures));
                    }); });
                });
            });
    }
    function executePromiseTask(promise, fn) {
        try {
            fn(function (value) {
                if (promise._state !== null)
                    return;
                if (value === promise)
                    throw new TypeError('A promise cannot be resolved with itself.');
                var shouldExecuteTick = promise._lib && beginMicroTickScope();
                if (value && typeof value.then === 'function') {
                    executePromiseTask(promise, function (resolve, reject) {
                        value instanceof DexiePromise ?
                            value._then(resolve, reject) :
                            value.then(resolve, reject);
                    });
                }
                else {
                    promise._state = true;
                    promise._value = value;
                    propagateAllListeners(promise);
                }
                if (shouldExecuteTick)
                    endMicroTickScope();
            }, handleRejection.bind(null, promise));
        }
        catch (ex) {
            handleRejection(promise, ex);
        }
    }
    function handleRejection(promise, reason) {
        rejectingErrors.push(reason);
        if (promise._state !== null)
            return;
        var shouldExecuteTick = promise._lib && beginMicroTickScope();
        reason = rejectionMapper(reason);
        promise._state = false;
        promise._value = reason;
        debug && reason !== null && typeof reason === 'object' && !reason._promise && tryCatch(function () {
            var origProp = getPropertyDescriptor(reason, "stack");
            reason._promise = promise;
            setProp(reason, "stack", {
                get: function () {
                    return stack_being_generated ?
                        origProp && (origProp.get ?
                            origProp.get.apply(reason) :
                            origProp.value) :
                        promise.stack;
                }
            });
        });
        addPossiblyUnhandledError(promise);
        propagateAllListeners(promise);
        if (shouldExecuteTick)
            endMicroTickScope();
    }
    function propagateAllListeners(promise) {
        var listeners = promise._listeners;
        promise._listeners = [];
        for (var i = 0, len = listeners.length; i < len; ++i) {
            propagateToListener(promise, listeners[i]);
        }
        var psd = promise._PSD;
        --psd.ref || psd.finalize();
        if (numScheduledCalls === 0) {
            ++numScheduledCalls;
            asap(function () {
                if (--numScheduledCalls === 0)
                    finalizePhysicalTick();
            }, []);
        }
    }
    function propagateToListener(promise, listener) {
        if (promise._state === null) {
            promise._listeners.push(listener);
            return;
        }
        var cb = promise._state ? listener.onFulfilled : listener.onRejected;
        if (cb === null) {
            return (promise._state ? listener.resolve : listener.reject)(promise._value);
        }
        ++listener.psd.ref;
        ++numScheduledCalls;
        asap(callListener, [cb, promise, listener]);
    }
    function callListener(cb, promise, listener) {
        try {
            currentFulfiller = promise;
            var ret, value = promise._value;
            if (promise._state) {
                ret = cb(value);
            }
            else {
                if (rejectingErrors.length)
                    rejectingErrors = [];
                ret = cb(value);
                if (rejectingErrors.indexOf(value) === -1)
                    markErrorAsHandled(promise);
            }
            listener.resolve(ret);
        }
        catch (e) {
            listener.reject(e);
        }
        finally {
            currentFulfiller = null;
            if (--numScheduledCalls === 0)
                finalizePhysicalTick();
            --listener.psd.ref || listener.psd.finalize();
        }
    }
    function getStack(promise, stacks, limit) {
        if (stacks.length === limit)
            return stacks;
        var stack = "";
        if (promise._state === false) {
            var failure = promise._value, errorName, message;
            if (failure != null) {
                errorName = failure.name || "Error";
                message = failure.message || failure;
                stack = prettyStack(failure, 0);
            }
            else {
                errorName = failure;
                message = "";
            }
            stacks.push(errorName + (message ? ": " + message : "") + stack);
        }
        if (debug) {
            stack = prettyStack(promise._stackHolder, 2);
            if (stack && stacks.indexOf(stack) === -1)
                stacks.push(stack);
            if (promise._prev)
                getStack(promise._prev, stacks, limit);
        }
        return stacks;
    }
    function linkToPreviousPromise(promise, prev) {
        var numPrev = prev ? prev._numPrev + 1 : 0;
        if (numPrev < LONG_STACKS_CLIP_LIMIT) {
            promise._prev = prev;
            promise._numPrev = numPrev;
        }
    }
    function physicalTick() {
        beginMicroTickScope() && endMicroTickScope();
    }
    function beginMicroTickScope() {
        var wasRootExec = isOutsideMicroTick;
        isOutsideMicroTick = false;
        needsNewPhysicalTick = false;
        return wasRootExec;
    }
    function endMicroTickScope() {
        var callbacks, i, l;
        do {
            while (microtickQueue.length > 0) {
                callbacks = microtickQueue;
                microtickQueue = [];
                l = callbacks.length;
                for (i = 0; i < l; ++i) {
                    var item = callbacks[i];
                    item[0].apply(null, item[1]);
                }
            }
        } while (microtickQueue.length > 0);
        isOutsideMicroTick = true;
        needsNewPhysicalTick = true;
    }
    function finalizePhysicalTick() {
        var unhandledErrs = unhandledErrors;
        unhandledErrors = [];
        unhandledErrs.forEach(function (p) {
            p._PSD.onunhandled.call(null, p._value, p);
        });
        var finalizers = tickFinalizers.slice(0);
        var i = finalizers.length;
        while (i)
            finalizers[--i]();
    }
    function run_at_end_of_this_or_next_physical_tick(fn) {
        function finalizer() {
            fn();
            tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
        }
        tickFinalizers.push(finalizer);
        ++numScheduledCalls;
        asap(function () {
            if (--numScheduledCalls === 0)
                finalizePhysicalTick();
        }, []);
    }
    function addPossiblyUnhandledError(promise) {
        if (!unhandledErrors.some(function (p) { return p._value === promise._value; }))
            unhandledErrors.push(promise);
    }
    function markErrorAsHandled(promise) {
        var i = unhandledErrors.length;
        while (i)
            if (unhandledErrors[--i]._value === promise._value) {
                unhandledErrors.splice(i, 1);
                return;
            }
    }
    function PromiseReject(reason) {
        return new DexiePromise(INTERNAL, false, reason);
    }
    function wrap(fn, errorCatcher) {
        var psd = PSD;
        return function () {
            var wasRootExec = beginMicroTickScope(), outerScope = PSD;
            try {
                switchToZone(psd, true);
                return fn.apply(this, arguments);
            }
            catch (e) {
                errorCatcher && errorCatcher(e);
            }
            finally {
                switchToZone(outerScope, false);
                if (wasRootExec)
                    endMicroTickScope();
            }
        };
    }
    var task = { awaits: 0, echoes: 0, id: 0 };
    var taskCounter = 0;
    var zoneStack = [];
    var zoneEchoes = 0;
    var totalEchoes = 0;
    var zone_id_counter = 0;
    function newScope(fn, props, a1, a2) {
        var parent = PSD, psd = Object.create(parent);
        psd.parent = parent;
        psd.ref = 0;
        psd.global = false;
        psd.id = ++zone_id_counter;
        var globalEnv = globalPSD.env;
        psd.env = patchGlobalPromise ? {
            Promise: DexiePromise,
            PromiseProp: { value: DexiePromise, configurable: true, writable: true },
            all: DexiePromise.all,
            race: DexiePromise.race,
            allSettled: DexiePromise.allSettled,
            any: DexiePromise.any,
            resolve: DexiePromise.resolve,
            reject: DexiePromise.reject,
            nthen: getPatchedPromiseThen(globalEnv.nthen, psd),
            gthen: getPatchedPromiseThen(globalEnv.gthen, psd)
        } : {};
        if (props)
            extend(psd, props);
        ++parent.ref;
        psd.finalize = function () {
            --this.parent.ref || this.parent.finalize();
        };
        var rv = usePSD(psd, fn, a1, a2);
        if (psd.ref === 0)
            psd.finalize();
        return rv;
    }
    function incrementExpectedAwaits() {
        if (!task.id)
            task.id = ++taskCounter;
        ++task.awaits;
        task.echoes += ZONE_ECHO_LIMIT;
        return task.id;
    }
    function decrementExpectedAwaits() {
        if (!task.awaits)
            return false;
        if (--task.awaits === 0)
            task.id = 0;
        task.echoes = task.awaits * ZONE_ECHO_LIMIT;
        return true;
    }
    if (('' + nativePromiseThen).indexOf('[native code]') === -1) {
        incrementExpectedAwaits = decrementExpectedAwaits = nop;
    }
    function onPossibleParallellAsync(possiblePromise) {
        if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
            incrementExpectedAwaits();
            return possiblePromise.then(function (x) {
                decrementExpectedAwaits();
                return x;
            }, function (e) {
                decrementExpectedAwaits();
                return rejection(e);
            });
        }
        return possiblePromise;
    }
    function zoneEnterEcho(targetZone) {
        ++totalEchoes;
        if (!task.echoes || --task.echoes === 0) {
            task.echoes = task.id = 0;
        }
        zoneStack.push(PSD);
        switchToZone(targetZone, true);
    }
    function zoneLeaveEcho() {
        var zone = zoneStack[zoneStack.length - 1];
        zoneStack.pop();
        switchToZone(zone, false);
    }
    function switchToZone(targetZone, bEnteringZone) {
        var currentZone = PSD;
        if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
            enqueueNativeMicroTask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
        }
        if (targetZone === PSD)
            return;
        PSD = targetZone;
        if (currentZone === globalPSD)
            globalPSD.env = snapShot();
        if (patchGlobalPromise) {
            var GlobalPromise_1 = globalPSD.env.Promise;
            var targetEnv = targetZone.env;
            nativePromiseProto.then = targetEnv.nthen;
            GlobalPromise_1.prototype.then = targetEnv.gthen;
            if (currentZone.global || targetZone.global) {
                Object.defineProperty(_global, 'Promise', targetEnv.PromiseProp);
                GlobalPromise_1.all = targetEnv.all;
                GlobalPromise_1.race = targetEnv.race;
                GlobalPromise_1.resolve = targetEnv.resolve;
                GlobalPromise_1.reject = targetEnv.reject;
                if (targetEnv.allSettled)
                    GlobalPromise_1.allSettled = targetEnv.allSettled;
                if (targetEnv.any)
                    GlobalPromise_1.any = targetEnv.any;
            }
        }
    }
    function snapShot() {
        var GlobalPromise = _global.Promise;
        return patchGlobalPromise ? {
            Promise: GlobalPromise,
            PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
            all: GlobalPromise.all,
            race: GlobalPromise.race,
            allSettled: GlobalPromise.allSettled,
            any: GlobalPromise.any,
            resolve: GlobalPromise.resolve,
            reject: GlobalPromise.reject,
            nthen: nativePromiseProto.then,
            gthen: GlobalPromise.prototype.then
        } : {};
    }
    function usePSD(psd, fn, a1, a2, a3) {
        var outerScope = PSD;
        try {
            switchToZone(psd, true);
            return fn(a1, a2, a3);
        }
        finally {
            switchToZone(outerScope, false);
        }
    }
    function enqueueNativeMicroTask(job) {
        nativePromiseThen.call(resolvedNativePromise, job);
    }
    function nativeAwaitCompatibleWrap(fn, zone, possibleAwait, cleanup) {
        return typeof fn !== 'function' ? fn : function () {
            var outerZone = PSD;
            if (possibleAwait)
                incrementExpectedAwaits();
            switchToZone(zone, true);
            try {
                return fn.apply(this, arguments);
            }
            finally {
                switchToZone(outerZone, false);
                if (cleanup)
                    enqueueNativeMicroTask(decrementExpectedAwaits);
            }
        };
    }
    function getPatchedPromiseThen(origThen, zone) {
        return function (onResolved, onRejected) {
            return origThen.call(this, nativeAwaitCompatibleWrap(onResolved, zone), nativeAwaitCompatibleWrap(onRejected, zone));
        };
    }
    var UNHANDLEDREJECTION = "unhandledrejection";
    function globalError(err, promise) {
        var rv;
        try {
            rv = promise.onuncatched(err);
        }
        catch (e) { }
        if (rv !== false)
            try {
                var event, eventData = { promise: promise, reason: err };
                if (_global.document && document.createEvent) {
                    event = document.createEvent('Event');
                    event.initEvent(UNHANDLEDREJECTION, true, true);
                    extend(event, eventData);
                }
                else if (_global.CustomEvent) {
                    event = new CustomEvent(UNHANDLEDREJECTION, { detail: eventData });
                    extend(event, eventData);
                }
                if (event && _global.dispatchEvent) {
                    dispatchEvent(event);
                    if (!_global.PromiseRejectionEvent && _global.onunhandledrejection)
                        try {
                            _global.onunhandledrejection(event);
                        }
                        catch (_) { }
                }
                if (debug && event && !event.defaultPrevented) {
                    console.warn("Unhandled rejection: " + (err.stack || err));
                }
            }
            catch (e) { }
    }
    var rejection = DexiePromise.reject;

    function tempTransaction(db, mode, storeNames, fn) {
        if (!db.idbdb || (!db._state.openComplete && (!PSD.letThrough && !db._vip))) {
            if (db._state.openComplete) {
                return rejection(new exceptions.DatabaseClosed(db._state.dbOpenError));
            }
            if (!db._state.isBeingOpened) {
                if (!db._options.autoOpen)
                    return rejection(new exceptions.DatabaseClosed());
                db.open().catch(nop);
            }
            return db._state.dbReadyPromise.then(function () { return tempTransaction(db, mode, storeNames, fn); });
        }
        else {
            var trans = db._createTransaction(mode, storeNames, db._dbSchema);
            try {
                trans.create();
                db._state.PR1398_maxLoop = 3;
            }
            catch (ex) {
                if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
                    console.warn('Dexie: Need to reopen db');
                    db._close();
                    return db.open().then(function () { return tempTransaction(db, mode, storeNames, fn); });
                }
                return rejection(ex);
            }
            return trans._promise(mode, function (resolve, reject) {
                return newScope(function () {
                    PSD.trans = trans;
                    return fn(resolve, reject, trans);
                });
            }).then(function (result) {
                return trans._completion.then(function () { return result; });
            });
        }
    }

    var DEXIE_VERSION = '3.2.3';
    var maxString = String.fromCharCode(65535);
    var minKey = -Infinity;
    var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
    var STRING_EXPECTED = "String expected.";
    var connections = [];
    var isIEOrEdge = typeof navigator !== 'undefined' && /(MSIE|Trident|Edge)/.test(navigator.userAgent);
    var hasIEDeleteObjectStoreBug = isIEOrEdge;
    var hangsOnDeleteLargeKeyRange = isIEOrEdge;
    var dexieStackFrameFilter = function (frame) { return !/(dexie\.js|dexie\.min\.js)/.test(frame); };
    var DBNAMES_DB = '__dbnames';
    var READONLY = 'readonly';
    var READWRITE = 'readwrite';

    function combine(filter1, filter2) {
        return filter1 ?
            filter2 ?
                function () { return filter1.apply(this, arguments) && filter2.apply(this, arguments); } :
                filter1 :
            filter2;
    }

    var AnyRange = {
        type: 3 ,
        lower: -Infinity,
        lowerOpen: false,
        upper: [[]],
        upperOpen: false
    };

    function workaroundForUndefinedPrimKey(keyPath) {
        return typeof keyPath === "string" && !/\./.test(keyPath)
            ? function (obj) {
                if (obj[keyPath] === undefined && (keyPath in obj)) {
                    obj = deepClone(obj);
                    delete obj[keyPath];
                }
                return obj;
            }
            : function (obj) { return obj; };
    }

    var Table =  (function () {
        function Table() {
        }
        Table.prototype._trans = function (mode, fn, writeLocked) {
            var trans = this._tx || PSD.trans;
            var tableName = this.name;
            function checkTableInTransaction(resolve, reject, trans) {
                if (!trans.schema[tableName])
                    throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
                return fn(trans.idbtrans, trans);
            }
            var wasRootExec = beginMicroTickScope();
            try {
                return trans && trans.db === this.db ?
                    trans === PSD.trans ?
                        trans._promise(mode, checkTableInTransaction, writeLocked) :
                        newScope(function () { return trans._promise(mode, checkTableInTransaction, writeLocked); }, { trans: trans, transless: PSD.transless || PSD }) :
                    tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
            }
            finally {
                if (wasRootExec)
                    endMicroTickScope();
            }
        };
        Table.prototype.get = function (keyOrCrit, cb) {
            var _this = this;
            if (keyOrCrit && keyOrCrit.constructor === Object)
                return this.where(keyOrCrit).first(cb);
            return this._trans('readonly', function (trans) {
                return _this.core.get({ trans: trans, key: keyOrCrit })
                    .then(function (res) { return _this.hook.reading.fire(res); });
            }).then(cb);
        };
        Table.prototype.where = function (indexOrCrit) {
            if (typeof indexOrCrit === 'string')
                return new this.db.WhereClause(this, indexOrCrit);
            if (isArray(indexOrCrit))
                return new this.db.WhereClause(this, "[" + indexOrCrit.join('+') + "]");
            var keyPaths = keys(indexOrCrit);
            if (keyPaths.length === 1)
                return this
                    .where(keyPaths[0])
                    .equals(indexOrCrit[keyPaths[0]]);
            var compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(function (ix) {
                return ix.compound &&
                    keyPaths.every(function (keyPath) { return ix.keyPath.indexOf(keyPath) >= 0; }) &&
                    ix.keyPath.every(function (keyPath) { return keyPaths.indexOf(keyPath) >= 0; });
            })[0];
            if (compoundIndex && this.db._maxKey !== maxString)
                return this
                    .where(compoundIndex.name)
                    .equals(compoundIndex.keyPath.map(function (kp) { return indexOrCrit[kp]; }));
            if (!compoundIndex && debug)
                console.warn("The query " + JSON.stringify(indexOrCrit) + " on " + this.name + " would benefit of a " +
                    ("compound index [" + keyPaths.join('+') + "]"));
            var idxByName = this.schema.idxByName;
            var idb = this.db._deps.indexedDB;
            function equals(a, b) {
                try {
                    return idb.cmp(a, b) === 0;
                }
                catch (e) {
                    return false;
                }
            }
            var _a = keyPaths.reduce(function (_a, keyPath) {
                var prevIndex = _a[0], prevFilterFn = _a[1];
                var index = idxByName[keyPath];
                var value = indexOrCrit[keyPath];
                return [
                    prevIndex || index,
                    prevIndex || !index ?
                        combine(prevFilterFn, index && index.multi ?
                            function (x) {
                                var prop = getByKeyPath(x, keyPath);
                                return isArray(prop) && prop.some(function (item) { return equals(value, item); });
                            } : function (x) { return equals(value, getByKeyPath(x, keyPath)); })
                        : prevFilterFn
                ];
            }, [null, null]), idx = _a[0], filterFunction = _a[1];
            return idx ?
                this.where(idx.name).equals(indexOrCrit[idx.keyPath])
                    .filter(filterFunction) :
                compoundIndex ?
                    this.filter(filterFunction) :
                    this.where(keyPaths).equals('');
        };
        Table.prototype.filter = function (filterFunction) {
            return this.toCollection().and(filterFunction);
        };
        Table.prototype.count = function (thenShortcut) {
            return this.toCollection().count(thenShortcut);
        };
        Table.prototype.offset = function (offset) {
            return this.toCollection().offset(offset);
        };
        Table.prototype.limit = function (numRows) {
            return this.toCollection().limit(numRows);
        };
        Table.prototype.each = function (callback) {
            return this.toCollection().each(callback);
        };
        Table.prototype.toArray = function (thenShortcut) {
            return this.toCollection().toArray(thenShortcut);
        };
        Table.prototype.toCollection = function () {
            return new this.db.Collection(new this.db.WhereClause(this));
        };
        Table.prototype.orderBy = function (index) {
            return new this.db.Collection(new this.db.WhereClause(this, isArray(index) ?
                "[" + index.join('+') + "]" :
                index));
        };
        Table.prototype.reverse = function () {
            return this.toCollection().reverse();
        };
        Table.prototype.mapToClass = function (constructor) {
            this.schema.mappedClass = constructor;
            var readHook = function (obj) {
                if (!obj)
                    return obj;
                var res = Object.create(constructor.prototype);
                for (var m in obj)
                    if (hasOwn(obj, m))
                        try {
                            res[m] = obj[m];
                        }
                        catch (_) { }
                return res;
            };
            if (this.schema.readHook) {
                this.hook.reading.unsubscribe(this.schema.readHook);
            }
            this.schema.readHook = readHook;
            this.hook("reading", readHook);
            return constructor;
        };
        Table.prototype.defineClass = function () {
            function Class(content) {
                extend(this, content);
            }
            return this.mapToClass(Class);
        };
        Table.prototype.add = function (obj, key) {
            var _this = this;
            var _a = this.schema.primKey, auto = _a.auto, keyPath = _a.keyPath;
            var objToAdd = obj;
            if (keyPath && auto) {
                objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
            }
            return this._trans('readwrite', function (trans) {
                return _this.core.mutate({ trans: trans, type: 'add', keys: key != null ? [key] : null, values: [objToAdd] });
            }).then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult; })
                .then(function (lastResult) {
                if (keyPath) {
                    try {
                        setByKeyPath(obj, keyPath, lastResult);
                    }
                    catch (_) { }
                }
                return lastResult;
            });
        };
        Table.prototype.update = function (keyOrObject, modifications) {
            if (typeof keyOrObject === 'object' && !isArray(keyOrObject)) {
                var key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
                if (key === undefined)
                    return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
                try {
                    if (typeof modifications !== "function") {
                        keys(modifications).forEach(function (keyPath) {
                            setByKeyPath(keyOrObject, keyPath, modifications[keyPath]);
                        });
                    }
                    else {
                        modifications(keyOrObject, { value: keyOrObject, primKey: key });
                    }
                }
                catch (_a) {
                }
                return this.where(":id").equals(key).modify(modifications);
            }
            else {
                return this.where(":id").equals(keyOrObject).modify(modifications);
            }
        };
        Table.prototype.put = function (obj, key) {
            var _this = this;
            var _a = this.schema.primKey, auto = _a.auto, keyPath = _a.keyPath;
            var objToAdd = obj;
            if (keyPath && auto) {
                objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
            }
            return this._trans('readwrite', function (trans) { return _this.core.mutate({ trans: trans, type: 'put', values: [objToAdd], keys: key != null ? [key] : null }); })
                .then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult; })
                .then(function (lastResult) {
                if (keyPath) {
                    try {
                        setByKeyPath(obj, keyPath, lastResult);
                    }
                    catch (_) { }
                }
                return lastResult;
            });
        };
        Table.prototype.delete = function (key) {
            var _this = this;
            return this._trans('readwrite', function (trans) { return _this.core.mutate({ trans: trans, type: 'delete', keys: [key] }); })
                .then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : undefined; });
        };
        Table.prototype.clear = function () {
            var _this = this;
            return this._trans('readwrite', function (trans) { return _this.core.mutate({ trans: trans, type: 'deleteRange', range: AnyRange }); })
                .then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : undefined; });
        };
        Table.prototype.bulkGet = function (keys) {
            var _this = this;
            return this._trans('readonly', function (trans) {
                return _this.core.getMany({
                    keys: keys,
                    trans: trans
                }).then(function (result) { return result.map(function (res) { return _this.hook.reading.fire(res); }); });
            });
        };
        Table.prototype.bulkAdd = function (objects, keysOrOptions, options) {
            var _this = this;
            var keys = Array.isArray(keysOrOptions) ? keysOrOptions : undefined;
            options = options || (keys ? undefined : keysOrOptions);
            var wantResults = options ? options.allKeys : undefined;
            return this._trans('readwrite', function (trans) {
                var _a = _this.schema.primKey, auto = _a.auto, keyPath = _a.keyPath;
                if (keyPath && keys)
                    throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
                if (keys && keys.length !== objects.length)
                    throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
                var numObjects = objects.length;
                var objectsToAdd = keyPath && auto ?
                    objects.map(workaroundForUndefinedPrimKey(keyPath)) :
                    objects;
                return _this.core.mutate({ trans: trans, type: 'add', keys: keys, values: objectsToAdd, wantResults: wantResults })
                    .then(function (_a) {
                    var numFailures = _a.numFailures, results = _a.results, lastResult = _a.lastResult, failures = _a.failures;
                    var result = wantResults ? results : lastResult;
                    if (numFailures === 0)
                        return result;
                    throw new BulkError(_this.name + ".bulkAdd(): " + numFailures + " of " + numObjects + " operations failed", failures);
                });
            });
        };
        Table.prototype.bulkPut = function (objects, keysOrOptions, options) {
            var _this = this;
            var keys = Array.isArray(keysOrOptions) ? keysOrOptions : undefined;
            options = options || (keys ? undefined : keysOrOptions);
            var wantResults = options ? options.allKeys : undefined;
            return this._trans('readwrite', function (trans) {
                var _a = _this.schema.primKey, auto = _a.auto, keyPath = _a.keyPath;
                if (keyPath && keys)
                    throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
                if (keys && keys.length !== objects.length)
                    throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
                var numObjects = objects.length;
                var objectsToPut = keyPath && auto ?
                    objects.map(workaroundForUndefinedPrimKey(keyPath)) :
                    objects;
                return _this.core.mutate({ trans: trans, type: 'put', keys: keys, values: objectsToPut, wantResults: wantResults })
                    .then(function (_a) {
                    var numFailures = _a.numFailures, results = _a.results, lastResult = _a.lastResult, failures = _a.failures;
                    var result = wantResults ? results : lastResult;
                    if (numFailures === 0)
                        return result;
                    throw new BulkError(_this.name + ".bulkPut(): " + numFailures + " of " + numObjects + " operations failed", failures);
                });
            });
        };
        Table.prototype.bulkDelete = function (keys) {
            var _this = this;
            var numKeys = keys.length;
            return this._trans('readwrite', function (trans) {
                return _this.core.mutate({ trans: trans, type: 'delete', keys: keys });
            }).then(function (_a) {
                var numFailures = _a.numFailures, lastResult = _a.lastResult, failures = _a.failures;
                if (numFailures === 0)
                    return lastResult;
                throw new BulkError(_this.name + ".bulkDelete(): " + numFailures + " of " + numKeys + " operations failed", failures);
            });
        };
        return Table;
    }());

    function Events(ctx) {
        var evs = {};
        var rv = function (eventName, subscriber) {
            if (subscriber) {
                var i = arguments.length, args = new Array(i - 1);
                while (--i)
                    args[i - 1] = arguments[i];
                evs[eventName].subscribe.apply(null, args);
                return ctx;
            }
            else if (typeof (eventName) === 'string') {
                return evs[eventName];
            }
        };
        rv.addEventType = add;
        for (var i = 1, l = arguments.length; i < l; ++i) {
            add(arguments[i]);
        }
        return rv;
        function add(eventName, chainFunction, defaultFunction) {
            if (typeof eventName === 'object')
                return addConfiguredEvents(eventName);
            if (!chainFunction)
                chainFunction = reverseStoppableEventChain;
            if (!defaultFunction)
                defaultFunction = nop;
            var context = {
                subscribers: [],
                fire: defaultFunction,
                subscribe: function (cb) {
                    if (context.subscribers.indexOf(cb) === -1) {
                        context.subscribers.push(cb);
                        context.fire = chainFunction(context.fire, cb);
                    }
                },
                unsubscribe: function (cb) {
                    context.subscribers = context.subscribers.filter(function (fn) { return fn !== cb; });
                    context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
                }
            };
            evs[eventName] = rv[eventName] = context;
            return context;
        }
        function addConfiguredEvents(cfg) {
            keys(cfg).forEach(function (eventName) {
                var args = cfg[eventName];
                if (isArray(args)) {
                    add(eventName, cfg[eventName][0], cfg[eventName][1]);
                }
                else if (args === 'asap') {
                    var context = add(eventName, mirror, function fire() {
                        var i = arguments.length, args = new Array(i);
                        while (i--)
                            args[i] = arguments[i];
                        context.subscribers.forEach(function (fn) {
                            asap$1(function fireEvent() {
                                fn.apply(null, args);
                            });
                        });
                    });
                }
                else
                    throw new exceptions.InvalidArgument("Invalid event config");
            });
        }
    }

    function makeClassConstructor(prototype, constructor) {
        derive(constructor).from({ prototype: prototype });
        return constructor;
    }

    function createTableConstructor(db) {
        return makeClassConstructor(Table.prototype, function Table(name, tableSchema, trans) {
            this.db = db;
            this._tx = trans;
            this.name = name;
            this.schema = tableSchema;
            this.hook = db._allTables[name] ? db._allTables[name].hook : Events(null, {
                "creating": [hookCreatingChain, nop],
                "reading": [pureFunctionChain, mirror],
                "updating": [hookUpdatingChain, nop],
                "deleting": [hookDeletingChain, nop]
            });
        });
    }

    function isPlainKeyRange(ctx, ignoreLimitFilter) {
        return !(ctx.filter || ctx.algorithm || ctx.or) &&
            (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
    }
    function addFilter(ctx, fn) {
        ctx.filter = combine(ctx.filter, fn);
    }
    function addReplayFilter(ctx, factory, isLimitFilter) {
        var curr = ctx.replayFilter;
        ctx.replayFilter = curr ? function () { return combine(curr(), factory()); } : factory;
        ctx.justLimit = isLimitFilter && !curr;
    }
    function addMatchFilter(ctx, fn) {
        ctx.isMatch = combine(ctx.isMatch, fn);
    }
    function getIndexOrStore(ctx, coreSchema) {
        if (ctx.isPrimKey)
            return coreSchema.primaryKey;
        var index = coreSchema.getIndexByKeyPath(ctx.index);
        if (!index)
            throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
        return index;
    }
    function openCursor(ctx, coreTable, trans) {
        var index = getIndexOrStore(ctx, coreTable.schema);
        return coreTable.openCursor({
            trans: trans,
            values: !ctx.keysOnly,
            reverse: ctx.dir === 'prev',
            unique: !!ctx.unique,
            query: {
                index: index,
                range: ctx.range
            }
        });
    }
    function iter(ctx, fn, coreTrans, coreTable) {
        var filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
        if (!ctx.or) {
            return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
        }
        else {
            var set_1 = {};
            var union = function (item, cursor, advance) {
                if (!filter || filter(cursor, advance, function (result) { return cursor.stop(result); }, function (err) { return cursor.fail(err); })) {
                    var primaryKey = cursor.primaryKey;
                    var key = '' + primaryKey;
                    if (key === '[object ArrayBuffer]')
                        key = '' + new Uint8Array(primaryKey);
                    if (!hasOwn(set_1, key)) {
                        set_1[key] = true;
                        fn(item, cursor, advance);
                    }
                }
            };
            return Promise.all([
                ctx.or._iterate(union, coreTrans),
                iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
            ]);
        }
    }
    function iterate(cursorPromise, filter, fn, valueMapper) {
        var mappedFn = valueMapper ? function (x, c, a) { return fn(valueMapper(x), c, a); } : fn;
        var wrappedFn = wrap(mappedFn);
        return cursorPromise.then(function (cursor) {
            if (cursor) {
                return cursor.start(function () {
                    var c = function () { return cursor.continue(); };
                    if (!filter || filter(cursor, function (advancer) { return c = advancer; }, function (val) { cursor.stop(val); c = nop; }, function (e) { cursor.fail(e); c = nop; }))
                        wrappedFn(cursor.value, cursor, function (advancer) { return c = advancer; });
                    c();
                });
            }
        });
    }

    function cmp(a, b) {
        try {
            var ta = type(a);
            var tb = type(b);
            if (ta !== tb) {
                if (ta === 'Array')
                    return 1;
                if (tb === 'Array')
                    return -1;
                if (ta === 'binary')
                    return 1;
                if (tb === 'binary')
                    return -1;
                if (ta === 'string')
                    return 1;
                if (tb === 'string')
                    return -1;
                if (ta === 'Date')
                    return 1;
                if (tb !== 'Date')
                    return NaN;
                return -1;
            }
            switch (ta) {
                case 'number':
                case 'Date':
                case 'string':
                    return a > b ? 1 : a < b ? -1 : 0;
                case 'binary': {
                    return compareUint8Arrays(getUint8Array(a), getUint8Array(b));
                }
                case 'Array':
                    return compareArrays(a, b);
            }
        }
        catch (_a) { }
        return NaN;
    }
    function compareArrays(a, b) {
        var al = a.length;
        var bl = b.length;
        var l = al < bl ? al : bl;
        for (var i = 0; i < l; ++i) {
            var res = cmp(a[i], b[i]);
            if (res !== 0)
                return res;
        }
        return al === bl ? 0 : al < bl ? -1 : 1;
    }
    function compareUint8Arrays(a, b) {
        var al = a.length;
        var bl = b.length;
        var l = al < bl ? al : bl;
        for (var i = 0; i < l; ++i) {
            if (a[i] !== b[i])
                return a[i] < b[i] ? -1 : 1;
        }
        return al === bl ? 0 : al < bl ? -1 : 1;
    }
    function type(x) {
        var t = typeof x;
        if (t !== 'object')
            return t;
        if (ArrayBuffer.isView(x))
            return 'binary';
        var tsTag = toStringTag(x);
        return tsTag === 'ArrayBuffer' ? 'binary' : tsTag;
    }
    function getUint8Array(a) {
        if (a instanceof Uint8Array)
            return a;
        if (ArrayBuffer.isView(a))
            return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
        return new Uint8Array(a);
    }

    var Collection =  (function () {
        function Collection() {
        }
        Collection.prototype._read = function (fn, cb) {
            var ctx = this._ctx;
            return ctx.error ?
                ctx.table._trans(null, rejection.bind(null, ctx.error)) :
                ctx.table._trans('readonly', fn).then(cb);
        };
        Collection.prototype._write = function (fn) {
            var ctx = this._ctx;
            return ctx.error ?
                ctx.table._trans(null, rejection.bind(null, ctx.error)) :
                ctx.table._trans('readwrite', fn, "locked");
        };
        Collection.prototype._addAlgorithm = function (fn) {
            var ctx = this._ctx;
            ctx.algorithm = combine(ctx.algorithm, fn);
        };
        Collection.prototype._iterate = function (fn, coreTrans) {
            return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
        };
        Collection.prototype.clone = function (props) {
            var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
            if (props)
                extend(ctx, props);
            rv._ctx = ctx;
            return rv;
        };
        Collection.prototype.raw = function () {
            this._ctx.valueMapper = null;
            return this;
        };
        Collection.prototype.each = function (fn) {
            var ctx = this._ctx;
            return this._read(function (trans) { return iter(ctx, fn, trans, ctx.table.core); });
        };
        Collection.prototype.count = function (cb) {
            var _this = this;
            return this._read(function (trans) {
                var ctx = _this._ctx;
                var coreTable = ctx.table.core;
                if (isPlainKeyRange(ctx, true)) {
                    return coreTable.count({
                        trans: trans,
                        query: {
                            index: getIndexOrStore(ctx, coreTable.schema),
                            range: ctx.range
                        }
                    }).then(function (count) { return Math.min(count, ctx.limit); });
                }
                else {
                    var count = 0;
                    return iter(ctx, function () { ++count; return false; }, trans, coreTable)
                        .then(function () { return count; });
                }
            }).then(cb);
        };
        Collection.prototype.sortBy = function (keyPath, cb) {
            var parts = keyPath.split('.').reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
            function getval(obj, i) {
                if (i)
                    return getval(obj[parts[i]], i - 1);
                return obj[lastPart];
            }
            var order = this._ctx.dir === "next" ? 1 : -1;
            function sorter(a, b) {
                var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
                return aVal < bVal ? -order : aVal > bVal ? order : 0;
            }
            return this.toArray(function (a) {
                return a.sort(sorter);
            }).then(cb);
        };
        Collection.prototype.toArray = function (cb) {
            var _this = this;
            return this._read(function (trans) {
                var ctx = _this._ctx;
                if (ctx.dir === 'next' && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
                    var valueMapper_1 = ctx.valueMapper;
                    var index = getIndexOrStore(ctx, ctx.table.core.schema);
                    return ctx.table.core.query({
                        trans: trans,
                        limit: ctx.limit,
                        values: true,
                        query: {
                            index: index,
                            range: ctx.range
                        }
                    }).then(function (_a) {
                        var result = _a.result;
                        return valueMapper_1 ? result.map(valueMapper_1) : result;
                    });
                }
                else {
                    var a_1 = [];
                    return iter(ctx, function (item) { return a_1.push(item); }, trans, ctx.table.core).then(function () { return a_1; });
                }
            }, cb);
        };
        Collection.prototype.offset = function (offset) {
            var ctx = this._ctx;
            if (offset <= 0)
                return this;
            ctx.offset += offset;
            if (isPlainKeyRange(ctx)) {
                addReplayFilter(ctx, function () {
                    var offsetLeft = offset;
                    return function (cursor, advance) {
                        if (offsetLeft === 0)
                            return true;
                        if (offsetLeft === 1) {
                            --offsetLeft;
                            return false;
                        }
                        advance(function () {
                            cursor.advance(offsetLeft);
                            offsetLeft = 0;
                        });
                        return false;
                    };
                });
            }
            else {
                addReplayFilter(ctx, function () {
                    var offsetLeft = offset;
                    return function () { return (--offsetLeft < 0); };
                });
            }
            return this;
        };
        Collection.prototype.limit = function (numRows) {
            this._ctx.limit = Math.min(this._ctx.limit, numRows);
            addReplayFilter(this._ctx, function () {
                var rowsLeft = numRows;
                return function (cursor, advance, resolve) {
                    if (--rowsLeft <= 0)
                        advance(resolve);
                    return rowsLeft >= 0;
                };
            }, true);
            return this;
        };
        Collection.prototype.until = function (filterFunction, bIncludeStopEntry) {
            addFilter(this._ctx, function (cursor, advance, resolve) {
                if (filterFunction(cursor.value)) {
                    advance(resolve);
                    return bIncludeStopEntry;
                }
                else {
                    return true;
                }
            });
            return this;
        };
        Collection.prototype.first = function (cb) {
            return this.limit(1).toArray(function (a) { return a[0]; }).then(cb);
        };
        Collection.prototype.last = function (cb) {
            return this.reverse().first(cb);
        };
        Collection.prototype.filter = function (filterFunction) {
            addFilter(this._ctx, function (cursor) {
                return filterFunction(cursor.value);
            });
            addMatchFilter(this._ctx, filterFunction);
            return this;
        };
        Collection.prototype.and = function (filter) {
            return this.filter(filter);
        };
        Collection.prototype.or = function (indexName) {
            return new this.db.WhereClause(this._ctx.table, indexName, this);
        };
        Collection.prototype.reverse = function () {
            this._ctx.dir = (this._ctx.dir === "prev" ? "next" : "prev");
            if (this._ondirectionchange)
                this._ondirectionchange(this._ctx.dir);
            return this;
        };
        Collection.prototype.desc = function () {
            return this.reverse();
        };
        Collection.prototype.eachKey = function (cb) {
            var ctx = this._ctx;
            ctx.keysOnly = !ctx.isMatch;
            return this.each(function (val, cursor) { cb(cursor.key, cursor); });
        };
        Collection.prototype.eachUniqueKey = function (cb) {
            this._ctx.unique = "unique";
            return this.eachKey(cb);
        };
        Collection.prototype.eachPrimaryKey = function (cb) {
            var ctx = this._ctx;
            ctx.keysOnly = !ctx.isMatch;
            return this.each(function (val, cursor) { cb(cursor.primaryKey, cursor); });
        };
        Collection.prototype.keys = function (cb) {
            var ctx = this._ctx;
            ctx.keysOnly = !ctx.isMatch;
            var a = [];
            return this.each(function (item, cursor) {
                a.push(cursor.key);
            }).then(function () {
                return a;
            }).then(cb);
        };
        Collection.prototype.primaryKeys = function (cb) {
            var ctx = this._ctx;
            if (ctx.dir === 'next' && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
                return this._read(function (trans) {
                    var index = getIndexOrStore(ctx, ctx.table.core.schema);
                    return ctx.table.core.query({
                        trans: trans,
                        values: false,
                        limit: ctx.limit,
                        query: {
                            index: index,
                            range: ctx.range
                        }
                    });
                }).then(function (_a) {
                    var result = _a.result;
                    return result;
                }).then(cb);
            }
            ctx.keysOnly = !ctx.isMatch;
            var a = [];
            return this.each(function (item, cursor) {
                a.push(cursor.primaryKey);
            }).then(function () {
                return a;
            }).then(cb);
        };
        Collection.prototype.uniqueKeys = function (cb) {
            this._ctx.unique = "unique";
            return this.keys(cb);
        };
        Collection.prototype.firstKey = function (cb) {
            return this.limit(1).keys(function (a) { return a[0]; }).then(cb);
        };
        Collection.prototype.lastKey = function (cb) {
            return this.reverse().firstKey(cb);
        };
        Collection.prototype.distinct = function () {
            var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
            if (!idx || !idx.multi)
                return this;
            var set = {};
            addFilter(this._ctx, function (cursor) {
                var strKey = cursor.primaryKey.toString();
                var found = hasOwn(set, strKey);
                set[strKey] = true;
                return !found;
            });
            return this;
        };
        Collection.prototype.modify = function (changes) {
            var _this = this;
            var ctx = this._ctx;
            return this._write(function (trans) {
                var modifyer;
                if (typeof changes === 'function') {
                    modifyer = changes;
                }
                else {
                    var keyPaths = keys(changes);
                    var numKeys = keyPaths.length;
                    modifyer = function (item) {
                        var anythingModified = false;
                        for (var i = 0; i < numKeys; ++i) {
                            var keyPath = keyPaths[i], val = changes[keyPath];
                            if (getByKeyPath(item, keyPath) !== val) {
                                setByKeyPath(item, keyPath, val);
                                anythingModified = true;
                            }
                        }
                        return anythingModified;
                    };
                }
                var coreTable = ctx.table.core;
                var _a = coreTable.schema.primaryKey, outbound = _a.outbound, extractKey = _a.extractKey;
                var limit = _this.db._options.modifyChunkSize || 200;
                var totalFailures = [];
                var successCount = 0;
                var failedKeys = [];
                var applyMutateResult = function (expectedCount, res) {
                    var failures = res.failures, numFailures = res.numFailures;
                    successCount += expectedCount - numFailures;
                    for (var _i = 0, _a = keys(failures); _i < _a.length; _i++) {
                        var pos = _a[_i];
                        totalFailures.push(failures[pos]);
                    }
                };
                return _this.clone().primaryKeys().then(function (keys) {
                    var nextChunk = function (offset) {
                        var count = Math.min(limit, keys.length - offset);
                        return coreTable.getMany({
                            trans: trans,
                            keys: keys.slice(offset, offset + count),
                            cache: "immutable"
                        }).then(function (values) {
                            var addValues = [];
                            var putValues = [];
                            var putKeys = outbound ? [] : null;
                            var deleteKeys = [];
                            for (var i = 0; i < count; ++i) {
                                var origValue = values[i];
                                var ctx_1 = {
                                    value: deepClone(origValue),
                                    primKey: keys[offset + i]
                                };
                                if (modifyer.call(ctx_1, ctx_1.value, ctx_1) !== false) {
                                    if (ctx_1.value == null) {
                                        deleteKeys.push(keys[offset + i]);
                                    }
                                    else if (!outbound && cmp(extractKey(origValue), extractKey(ctx_1.value)) !== 0) {
                                        deleteKeys.push(keys[offset + i]);
                                        addValues.push(ctx_1.value);
                                    }
                                    else {
                                        putValues.push(ctx_1.value);
                                        if (outbound)
                                            putKeys.push(keys[offset + i]);
                                    }
                                }
                            }
                            var criteria = isPlainKeyRange(ctx) &&
                                ctx.limit === Infinity &&
                                (typeof changes !== 'function' || changes === deleteCallback) && {
                                index: ctx.index,
                                range: ctx.range
                            };
                            return Promise.resolve(addValues.length > 0 &&
                                coreTable.mutate({ trans: trans, type: 'add', values: addValues })
                                    .then(function (res) {
                                    for (var pos in res.failures) {
                                        deleteKeys.splice(parseInt(pos), 1);
                                    }
                                    applyMutateResult(addValues.length, res);
                                })).then(function () { return (putValues.length > 0 || (criteria && typeof changes === 'object')) &&
                                coreTable.mutate({
                                    trans: trans,
                                    type: 'put',
                                    keys: putKeys,
                                    values: putValues,
                                    criteria: criteria,
                                    changeSpec: typeof changes !== 'function'
                                        && changes
                                }).then(function (res) { return applyMutateResult(putValues.length, res); }); }).then(function () { return (deleteKeys.length > 0 || (criteria && changes === deleteCallback)) &&
                                coreTable.mutate({
                                    trans: trans,
                                    type: 'delete',
                                    keys: deleteKeys,
                                    criteria: criteria
                                }).then(function (res) { return applyMutateResult(deleteKeys.length, res); }); }).then(function () {
                                return keys.length > offset + count && nextChunk(offset + limit);
                            });
                        });
                    };
                    return nextChunk(0).then(function () {
                        if (totalFailures.length > 0)
                            throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
                        return keys.length;
                    });
                });
            });
        };
        Collection.prototype.delete = function () {
            var ctx = this._ctx, range = ctx.range;
            if (isPlainKeyRange(ctx) &&
                ((ctx.isPrimKey && !hangsOnDeleteLargeKeyRange) || range.type === 3 ))
             {
                return this._write(function (trans) {
                    var primaryKey = ctx.table.core.schema.primaryKey;
                    var coreRange = range;
                    return ctx.table.core.count({ trans: trans, query: { index: primaryKey, range: coreRange } }).then(function (count) {
                        return ctx.table.core.mutate({ trans: trans, type: 'deleteRange', range: coreRange })
                            .then(function (_a) {
                            var failures = _a.failures; _a.lastResult; _a.results; var numFailures = _a.numFailures;
                            if (numFailures)
                                throw new ModifyError("Could not delete some values", Object.keys(failures).map(function (pos) { return failures[pos]; }), count - numFailures);
                            return count - numFailures;
                        });
                    });
                });
            }
            return this.modify(deleteCallback);
        };
        return Collection;
    }());
    var deleteCallback = function (value, ctx) { return ctx.value = null; };

    function createCollectionConstructor(db) {
        return makeClassConstructor(Collection.prototype, function Collection(whereClause, keyRangeGenerator) {
            this.db = db;
            var keyRange = AnyRange, error = null;
            if (keyRangeGenerator)
                try {
                    keyRange = keyRangeGenerator();
                }
                catch (ex) {
                    error = ex;
                }
            var whereCtx = whereClause._ctx;
            var table = whereCtx.table;
            var readingHook = table.hook.reading.fire;
            this._ctx = {
                table: table,
                index: whereCtx.index,
                isPrimKey: (!whereCtx.index || (table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name)),
                range: keyRange,
                keysOnly: false,
                dir: "next",
                unique: "",
                algorithm: null,
                filter: null,
                replayFilter: null,
                justLimit: true,
                isMatch: null,
                offset: 0,
                limit: Infinity,
                error: error,
                or: whereCtx.or,
                valueMapper: readingHook !== mirror ? readingHook : null
            };
        });
    }

    function simpleCompare(a, b) {
        return a < b ? -1 : a === b ? 0 : 1;
    }
    function simpleCompareReverse(a, b) {
        return a > b ? -1 : a === b ? 0 : 1;
    }

    function fail(collectionOrWhereClause, err, T) {
        var collection = collectionOrWhereClause instanceof WhereClause ?
            new collectionOrWhereClause.Collection(collectionOrWhereClause) :
            collectionOrWhereClause;
        collection._ctx.error = T ? new T(err) : new TypeError(err);
        return collection;
    }
    function emptyCollection(whereClause) {
        return new whereClause.Collection(whereClause, function () { return rangeEqual(""); }).limit(0);
    }
    function upperFactory(dir) {
        return dir === "next" ?
            function (s) { return s.toUpperCase(); } :
            function (s) { return s.toLowerCase(); };
    }
    function lowerFactory(dir) {
        return dir === "next" ?
            function (s) { return s.toLowerCase(); } :
            function (s) { return s.toUpperCase(); };
    }
    function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp, dir) {
        var length = Math.min(key.length, lowerNeedle.length);
        var llp = -1;
        for (var i = 0; i < length; ++i) {
            var lwrKeyChar = lowerKey[i];
            if (lwrKeyChar !== lowerNeedle[i]) {
                if (cmp(key[i], upperNeedle[i]) < 0)
                    return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
                if (cmp(key[i], lowerNeedle[i]) < 0)
                    return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
                if (llp >= 0)
                    return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
                return null;
            }
            if (cmp(key[i], lwrKeyChar) < 0)
                llp = i;
        }
        if (length < lowerNeedle.length && dir === "next")
            return key + upperNeedle.substr(key.length);
        if (length < key.length && dir === "prev")
            return key.substr(0, upperNeedle.length);
        return (llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1));
    }
    function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
        var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
        if (!needles.every(function (s) { return typeof s === 'string'; })) {
            return fail(whereClause, STRING_EXPECTED);
        }
        function initDirection(dir) {
            upper = upperFactory(dir);
            lower = lowerFactory(dir);
            compare = (dir === "next" ? simpleCompare : simpleCompareReverse);
            var needleBounds = needles.map(function (needle) {
                return { lower: lower(needle), upper: upper(needle) };
            }).sort(function (a, b) {
                return compare(a.lower, b.lower);
            });
            upperNeedles = needleBounds.map(function (nb) { return nb.upper; });
            lowerNeedles = needleBounds.map(function (nb) { return nb.lower; });
            direction = dir;
            nextKeySuffix = (dir === "next" ? "" : suffix);
        }
        initDirection("next");
        var c = new whereClause.Collection(whereClause, function () { return createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix); });
        c._ondirectionchange = function (direction) {
            initDirection(direction);
        };
        var firstPossibleNeedle = 0;
        c._addAlgorithm(function (cursor, advance, resolve) {
            var key = cursor.key;
            if (typeof key !== 'string')
                return false;
            var lowerKey = lower(key);
            if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
                return true;
            }
            else {
                var lowestPossibleCasing = null;
                for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
                    var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
                    if (casing === null && lowestPossibleCasing === null)
                        firstPossibleNeedle = i + 1;
                    else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
                        lowestPossibleCasing = casing;
                    }
                }
                if (lowestPossibleCasing !== null) {
                    advance(function () { cursor.continue(lowestPossibleCasing + nextKeySuffix); });
                }
                else {
                    advance(resolve);
                }
                return false;
            }
        });
        return c;
    }
    function createRange(lower, upper, lowerOpen, upperOpen) {
        return {
            type: 2 ,
            lower: lower,
            upper: upper,
            lowerOpen: lowerOpen,
            upperOpen: upperOpen
        };
    }
    function rangeEqual(value) {
        return {
            type: 1 ,
            lower: value,
            upper: value
        };
    }

    var WhereClause =  (function () {
        function WhereClause() {
        }
        Object.defineProperty(WhereClause.prototype, "Collection", {
            get: function () {
                return this._ctx.table.db.Collection;
            },
            enumerable: false,
            configurable: true
        });
        WhereClause.prototype.between = function (lower, upper, includeLower, includeUpper) {
            includeLower = includeLower !== false;
            includeUpper = includeUpper === true;
            try {
                if ((this._cmp(lower, upper) > 0) ||
                    (this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper)))
                    return emptyCollection(this);
                return new this.Collection(this, function () { return createRange(lower, upper, !includeLower, !includeUpper); });
            }
            catch (e) {
                return fail(this, INVALID_KEY_ARGUMENT);
            }
        };
        WhereClause.prototype.equals = function (value) {
            if (value == null)
                return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function () { return rangeEqual(value); });
        };
        WhereClause.prototype.above = function (value) {
            if (value == null)
                return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function () { return createRange(value, undefined, true); });
        };
        WhereClause.prototype.aboveOrEqual = function (value) {
            if (value == null)
                return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function () { return createRange(value, undefined, false); });
        };
        WhereClause.prototype.below = function (value) {
            if (value == null)
                return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function () { return createRange(undefined, value, false, true); });
        };
        WhereClause.prototype.belowOrEqual = function (value) {
            if (value == null)
                return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function () { return createRange(undefined, value); });
        };
        WhereClause.prototype.startsWith = function (str) {
            if (typeof str !== 'string')
                return fail(this, STRING_EXPECTED);
            return this.between(str, str + maxString, true, true);
        };
        WhereClause.prototype.startsWithIgnoreCase = function (str) {
            if (str === "")
                return this.startsWith(str);
            return addIgnoreCaseAlgorithm(this, function (x, a) { return x.indexOf(a[0]) === 0; }, [str], maxString);
        };
        WhereClause.prototype.equalsIgnoreCase = function (str) {
            return addIgnoreCaseAlgorithm(this, function (x, a) { return x === a[0]; }, [str], "");
        };
        WhereClause.prototype.anyOfIgnoreCase = function () {
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (set.length === 0)
                return emptyCollection(this);
            return addIgnoreCaseAlgorithm(this, function (x, a) { return a.indexOf(x) !== -1; }, set, "");
        };
        WhereClause.prototype.startsWithAnyOfIgnoreCase = function () {
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (set.length === 0)
                return emptyCollection(this);
            return addIgnoreCaseAlgorithm(this, function (x, a) { return a.some(function (n) { return x.indexOf(n) === 0; }); }, set, maxString);
        };
        WhereClause.prototype.anyOf = function () {
            var _this = this;
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            var compare = this._cmp;
            try {
                set.sort(compare);
            }
            catch (e) {
                return fail(this, INVALID_KEY_ARGUMENT);
            }
            if (set.length === 0)
                return emptyCollection(this);
            var c = new this.Collection(this, function () { return createRange(set[0], set[set.length - 1]); });
            c._ondirectionchange = function (direction) {
                compare = (direction === "next" ?
                    _this._ascending :
                    _this._descending);
                set.sort(compare);
            };
            var i = 0;
            c._addAlgorithm(function (cursor, advance, resolve) {
                var key = cursor.key;
                while (compare(key, set[i]) > 0) {
                    ++i;
                    if (i === set.length) {
                        advance(resolve);
                        return false;
                    }
                }
                if (compare(key, set[i]) === 0) {
                    return true;
                }
                else {
                    advance(function () { cursor.continue(set[i]); });
                    return false;
                }
            });
            return c;
        };
        WhereClause.prototype.notEqual = function (value) {
            return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], { includeLowers: false, includeUppers: false });
        };
        WhereClause.prototype.noneOf = function () {
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (set.length === 0)
                return new this.Collection(this);
            try {
                set.sort(this._ascending);
            }
            catch (e) {
                return fail(this, INVALID_KEY_ARGUMENT);
            }
            var ranges = set.reduce(function (res, val) { return res ?
                res.concat([[res[res.length - 1][1], val]]) :
                [[minKey, val]]; }, null);
            ranges.push([set[set.length - 1], this.db._maxKey]);
            return this.inAnyRange(ranges, { includeLowers: false, includeUppers: false });
        };
        WhereClause.prototype.inAnyRange = function (ranges, options) {
            var _this = this;
            var cmp = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
            if (ranges.length === 0)
                return emptyCollection(this);
            if (!ranges.every(function (range) {
                return range[0] !== undefined &&
                    range[1] !== undefined &&
                    ascending(range[0], range[1]) <= 0;
            })) {
                return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
            }
            var includeLowers = !options || options.includeLowers !== false;
            var includeUppers = options && options.includeUppers === true;
            function addRange(ranges, newRange) {
                var i = 0, l = ranges.length;
                for (; i < l; ++i) {
                    var range = ranges[i];
                    if (cmp(newRange[0], range[1]) < 0 && cmp(newRange[1], range[0]) > 0) {
                        range[0] = min(range[0], newRange[0]);
                        range[1] = max(range[1], newRange[1]);
                        break;
                    }
                }
                if (i === l)
                    ranges.push(newRange);
                return ranges;
            }
            var sortDirection = ascending;
            function rangeSorter(a, b) { return sortDirection(a[0], b[0]); }
            var set;
            try {
                set = ranges.reduce(addRange, []);
                set.sort(rangeSorter);
            }
            catch (ex) {
                return fail(this, INVALID_KEY_ARGUMENT);
            }
            var rangePos = 0;
            var keyIsBeyondCurrentEntry = includeUppers ?
                function (key) { return ascending(key, set[rangePos][1]) > 0; } :
                function (key) { return ascending(key, set[rangePos][1]) >= 0; };
            var keyIsBeforeCurrentEntry = includeLowers ?
                function (key) { return descending(key, set[rangePos][0]) > 0; } :
                function (key) { return descending(key, set[rangePos][0]) >= 0; };
            function keyWithinCurrentRange(key) {
                return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
            }
            var checkKey = keyIsBeyondCurrentEntry;
            var c = new this.Collection(this, function () { return createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers); });
            c._ondirectionchange = function (direction) {
                if (direction === "next") {
                    checkKey = keyIsBeyondCurrentEntry;
                    sortDirection = ascending;
                }
                else {
                    checkKey = keyIsBeforeCurrentEntry;
                    sortDirection = descending;
                }
                set.sort(rangeSorter);
            };
            c._addAlgorithm(function (cursor, advance, resolve) {
                var key = cursor.key;
                while (checkKey(key)) {
                    ++rangePos;
                    if (rangePos === set.length) {
                        advance(resolve);
                        return false;
                    }
                }
                if (keyWithinCurrentRange(key)) {
                    return true;
                }
                else if (_this._cmp(key, set[rangePos][1]) === 0 || _this._cmp(key, set[rangePos][0]) === 0) {
                    return false;
                }
                else {
                    advance(function () {
                        if (sortDirection === ascending)
                            cursor.continue(set[rangePos][0]);
                        else
                            cursor.continue(set[rangePos][1]);
                    });
                    return false;
                }
            });
            return c;
        };
        WhereClause.prototype.startsWithAnyOf = function () {
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (!set.every(function (s) { return typeof s === 'string'; })) {
                return fail(this, "startsWithAnyOf() only works with strings");
            }
            if (set.length === 0)
                return emptyCollection(this);
            return this.inAnyRange(set.map(function (str) { return [str, str + maxString]; }));
        };
        return WhereClause;
    }());

    function createWhereClauseConstructor(db) {
        return makeClassConstructor(WhereClause.prototype, function WhereClause(table, index, orCollection) {
            this.db = db;
            this._ctx = {
                table: table,
                index: index === ":id" ? null : index,
                or: orCollection
            };
            var indexedDB = db._deps.indexedDB;
            if (!indexedDB)
                throw new exceptions.MissingAPI();
            this._cmp = this._ascending = indexedDB.cmp.bind(indexedDB);
            this._descending = function (a, b) { return indexedDB.cmp(b, a); };
            this._max = function (a, b) { return indexedDB.cmp(a, b) > 0 ? a : b; };
            this._min = function (a, b) { return indexedDB.cmp(a, b) < 0 ? a : b; };
            this._IDBKeyRange = db._deps.IDBKeyRange;
        });
    }

    function eventRejectHandler(reject) {
        return wrap(function (event) {
            preventDefault(event);
            reject(event.target.error);
            return false;
        });
    }
    function preventDefault(event) {
        if (event.stopPropagation)
            event.stopPropagation();
        if (event.preventDefault)
            event.preventDefault();
    }

    var DEXIE_STORAGE_MUTATED_EVENT_NAME = 'storagemutated';
    var STORAGE_MUTATED_DOM_EVENT_NAME = 'x-storagemutated-1';
    var globalEvents = Events(null, DEXIE_STORAGE_MUTATED_EVENT_NAME);

    var Transaction =  (function () {
        function Transaction() {
        }
        Transaction.prototype._lock = function () {
            assert(!PSD.global);
            ++this._reculock;
            if (this._reculock === 1 && !PSD.global)
                PSD.lockOwnerFor = this;
            return this;
        };
        Transaction.prototype._unlock = function () {
            assert(!PSD.global);
            if (--this._reculock === 0) {
                if (!PSD.global)
                    PSD.lockOwnerFor = null;
                while (this._blockedFuncs.length > 0 && !this._locked()) {
                    var fnAndPSD = this._blockedFuncs.shift();
                    try {
                        usePSD(fnAndPSD[1], fnAndPSD[0]);
                    }
                    catch (e) { }
                }
            }
            return this;
        };
        Transaction.prototype._locked = function () {
            return this._reculock && PSD.lockOwnerFor !== this;
        };
        Transaction.prototype.create = function (idbtrans) {
            var _this = this;
            if (!this.mode)
                return this;
            var idbdb = this.db.idbdb;
            var dbOpenError = this.db._state.dbOpenError;
            assert(!this.idbtrans);
            if (!idbtrans && !idbdb) {
                switch (dbOpenError && dbOpenError.name) {
                    case "DatabaseClosedError":
                        throw new exceptions.DatabaseClosed(dbOpenError);
                    case "MissingAPIError":
                        throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
                    default:
                        throw new exceptions.OpenFailed(dbOpenError);
                }
            }
            if (!this.active)
                throw new exceptions.TransactionInactive();
            assert(this._completion._state === null);
            idbtrans = this.idbtrans = idbtrans ||
                (this.db.core
                    ? this.db.core.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })
                    : idbdb.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }));
            idbtrans.onerror = wrap(function (ev) {
                preventDefault(ev);
                _this._reject(idbtrans.error);
            });
            idbtrans.onabort = wrap(function (ev) {
                preventDefault(ev);
                _this.active && _this._reject(new exceptions.Abort(idbtrans.error));
                _this.active = false;
                _this.on("abort").fire(ev);
            });
            idbtrans.oncomplete = wrap(function () {
                _this.active = false;
                _this._resolve();
                if ('mutatedParts' in idbtrans) {
                    globalEvents.storagemutated.fire(idbtrans["mutatedParts"]);
                }
            });
            return this;
        };
        Transaction.prototype._promise = function (mode, fn, bWriteLock) {
            var _this = this;
            if (mode === 'readwrite' && this.mode !== 'readwrite')
                return rejection(new exceptions.ReadOnly("Transaction is readonly"));
            if (!this.active)
                return rejection(new exceptions.TransactionInactive());
            if (this._locked()) {
                return new DexiePromise(function (resolve, reject) {
                    _this._blockedFuncs.push([function () {
                            _this._promise(mode, fn, bWriteLock).then(resolve, reject);
                        }, PSD]);
                });
            }
            else if (bWriteLock) {
                return newScope(function () {
                    var p = new DexiePromise(function (resolve, reject) {
                        _this._lock();
                        var rv = fn(resolve, reject, _this);
                        if (rv && rv.then)
                            rv.then(resolve, reject);
                    });
                    p.finally(function () { return _this._unlock(); });
                    p._lib = true;
                    return p;
                });
            }
            else {
                var p = new DexiePromise(function (resolve, reject) {
                    var rv = fn(resolve, reject, _this);
                    if (rv && rv.then)
                        rv.then(resolve, reject);
                });
                p._lib = true;
                return p;
            }
        };
        Transaction.prototype._root = function () {
            return this.parent ? this.parent._root() : this;
        };
        Transaction.prototype.waitFor = function (promiseLike) {
            var root = this._root();
            var promise = DexiePromise.resolve(promiseLike);
            if (root._waitingFor) {
                root._waitingFor = root._waitingFor.then(function () { return promise; });
            }
            else {
                root._waitingFor = promise;
                root._waitingQueue = [];
                var store = root.idbtrans.objectStore(root.storeNames[0]);
                (function spin() {
                    ++root._spinCount;
                    while (root._waitingQueue.length)
                        (root._waitingQueue.shift())();
                    if (root._waitingFor)
                        store.get(-Infinity).onsuccess = spin;
                }());
            }
            var currentWaitPromise = root._waitingFor;
            return new DexiePromise(function (resolve, reject) {
                promise.then(function (res) { return root._waitingQueue.push(wrap(resolve.bind(null, res))); }, function (err) { return root._waitingQueue.push(wrap(reject.bind(null, err))); }).finally(function () {
                    if (root._waitingFor === currentWaitPromise) {
                        root._waitingFor = null;
                    }
                });
            });
        };
        Transaction.prototype.abort = function () {
            if (this.active) {
                this.active = false;
                if (this.idbtrans)
                    this.idbtrans.abort();
                this._reject(new exceptions.Abort());
            }
        };
        Transaction.prototype.table = function (tableName) {
            var memoizedTables = (this._memoizedTables || (this._memoizedTables = {}));
            if (hasOwn(memoizedTables, tableName))
                return memoizedTables[tableName];
            var tableSchema = this.schema[tableName];
            if (!tableSchema) {
                throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
            }
            var transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
            transactionBoundTable.core = this.db.core.table(tableName);
            memoizedTables[tableName] = transactionBoundTable;
            return transactionBoundTable;
        };
        return Transaction;
    }());

    function createTransactionConstructor(db) {
        return makeClassConstructor(Transaction.prototype, function Transaction(mode, storeNames, dbschema, chromeTransactionDurability, parent) {
            var _this = this;
            this.db = db;
            this.mode = mode;
            this.storeNames = storeNames;
            this.schema = dbschema;
            this.chromeTransactionDurability = chromeTransactionDurability;
            this.idbtrans = null;
            this.on = Events(this, "complete", "error", "abort");
            this.parent = parent || null;
            this.active = true;
            this._reculock = 0;
            this._blockedFuncs = [];
            this._resolve = null;
            this._reject = null;
            this._waitingFor = null;
            this._waitingQueue = null;
            this._spinCount = 0;
            this._completion = new DexiePromise(function (resolve, reject) {
                _this._resolve = resolve;
                _this._reject = reject;
            });
            this._completion.then(function () {
                _this.active = false;
                _this.on.complete.fire();
            }, function (e) {
                var wasActive = _this.active;
                _this.active = false;
                _this.on.error.fire(e);
                _this.parent ?
                    _this.parent._reject(e) :
                    wasActive && _this.idbtrans && _this.idbtrans.abort();
                return rejection(e);
            });
        });
    }

    function createIndexSpec(name, keyPath, unique, multi, auto, compound, isPrimKey) {
        return {
            name: name,
            keyPath: keyPath,
            unique: unique,
            multi: multi,
            auto: auto,
            compound: compound,
            src: (unique && !isPrimKey ? '&' : '') + (multi ? '*' : '') + (auto ? "++" : "") + nameFromKeyPath(keyPath)
        };
    }
    function nameFromKeyPath(keyPath) {
        return typeof keyPath === 'string' ?
            keyPath :
            keyPath ? ('[' + [].join.call(keyPath, '+') + ']') : "";
    }

    function createTableSchema(name, primKey, indexes) {
        return {
            name: name,
            primKey: primKey,
            indexes: indexes,
            mappedClass: null,
            idxByName: arrayToObject(indexes, function (index) { return [index.name, index]; })
        };
    }

    function safariMultiStoreFix(storeNames) {
        return storeNames.length === 1 ? storeNames[0] : storeNames;
    }
    var getMaxKey = function (IdbKeyRange) {
        try {
            IdbKeyRange.only([[]]);
            getMaxKey = function () { return [[]]; };
            return [[]];
        }
        catch (e) {
            getMaxKey = function () { return maxString; };
            return maxString;
        }
    };

    function getKeyExtractor(keyPath) {
        if (keyPath == null) {
            return function () { return undefined; };
        }
        else if (typeof keyPath === 'string') {
            return getSinglePathKeyExtractor(keyPath);
        }
        else {
            return function (obj) { return getByKeyPath(obj, keyPath); };
        }
    }
    function getSinglePathKeyExtractor(keyPath) {
        var split = keyPath.split('.');
        if (split.length === 1) {
            return function (obj) { return obj[keyPath]; };
        }
        else {
            return function (obj) { return getByKeyPath(obj, keyPath); };
        }
    }

    function arrayify(arrayLike) {
        return [].slice.call(arrayLike);
    }
    var _id_counter = 0;
    function getKeyPathAlias(keyPath) {
        return keyPath == null ?
            ":id" :
            typeof keyPath === 'string' ?
                keyPath :
                "[" + keyPath.join('+') + "]";
    }
    function createDBCore(db, IdbKeyRange, tmpTrans) {
        function extractSchema(db, trans) {
            var tables = arrayify(db.objectStoreNames);
            return {
                schema: {
                    name: db.name,
                    tables: tables.map(function (table) { return trans.objectStore(table); }).map(function (store) {
                        var keyPath = store.keyPath, autoIncrement = store.autoIncrement;
                        var compound = isArray(keyPath);
                        var outbound = keyPath == null;
                        var indexByKeyPath = {};
                        var result = {
                            name: store.name,
                            primaryKey: {
                                name: null,
                                isPrimaryKey: true,
                                outbound: outbound,
                                compound: compound,
                                keyPath: keyPath,
                                autoIncrement: autoIncrement,
                                unique: true,
                                extractKey: getKeyExtractor(keyPath)
                            },
                            indexes: arrayify(store.indexNames).map(function (indexName) { return store.index(indexName); })
                                .map(function (index) {
                                var name = index.name, unique = index.unique, multiEntry = index.multiEntry, keyPath = index.keyPath;
                                var compound = isArray(keyPath);
                                var result = {
                                    name: name,
                                    compound: compound,
                                    keyPath: keyPath,
                                    unique: unique,
                                    multiEntry: multiEntry,
                                    extractKey: getKeyExtractor(keyPath)
                                };
                                indexByKeyPath[getKeyPathAlias(keyPath)] = result;
                                return result;
                            }),
                            getIndexByKeyPath: function (keyPath) { return indexByKeyPath[getKeyPathAlias(keyPath)]; }
                        };
                        indexByKeyPath[":id"] = result.primaryKey;
                        if (keyPath != null) {
                            indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
                        }
                        return result;
                    })
                },
                hasGetAll: tables.length > 0 && ('getAll' in trans.objectStore(tables[0])) &&
                    !(typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) &&
                        !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
                        [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
            };
        }
        function makeIDBKeyRange(range) {
            if (range.type === 3 )
                return null;
            if (range.type === 4 )
                throw new Error("Cannot convert never type to IDBKeyRange");
            var lower = range.lower, upper = range.upper, lowerOpen = range.lowerOpen, upperOpen = range.upperOpen;
            var idbRange = lower === undefined ?
                upper === undefined ?
                    null :
                    IdbKeyRange.upperBound(upper, !!upperOpen) :
                upper === undefined ?
                    IdbKeyRange.lowerBound(lower, !!lowerOpen) :
                    IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
            return idbRange;
        }
        function createDbCoreTable(tableSchema) {
            var tableName = tableSchema.name;
            function mutate(_a) {
                var trans = _a.trans, type = _a.type, keys = _a.keys, values = _a.values, range = _a.range;
                return new Promise(function (resolve, reject) {
                    resolve = wrap(resolve);
                    var store = trans.objectStore(tableName);
                    var outbound = store.keyPath == null;
                    var isAddOrPut = type === "put" || type === "add";
                    if (!isAddOrPut && type !== 'delete' && type !== 'deleteRange')
                        throw new Error("Invalid operation type: " + type);
                    var length = (keys || values || { length: 1 }).length;
                    if (keys && values && keys.length !== values.length) {
                        throw new Error("Given keys array must have same length as given values array.");
                    }
                    if (length === 0)
                        return resolve({ numFailures: 0, failures: {}, results: [], lastResult: undefined });
                    var req;
                    var reqs = [];
                    var failures = [];
                    var numFailures = 0;
                    var errorHandler = function (event) {
                        ++numFailures;
                        preventDefault(event);
                    };
                    if (type === 'deleteRange') {
                        if (range.type === 4 )
                            return resolve({ numFailures: numFailures, failures: failures, results: [], lastResult: undefined });
                        if (range.type === 3 )
                            reqs.push(req = store.clear());
                        else
                            reqs.push(req = store.delete(makeIDBKeyRange(range)));
                    }
                    else {
                        var _a = isAddOrPut ?
                            outbound ?
                                [values, keys] :
                                [values, null] :
                            [keys, null], args1 = _a[0], args2 = _a[1];
                        if (isAddOrPut) {
                            for (var i = 0; i < length; ++i) {
                                reqs.push(req = (args2 && args2[i] !== undefined ?
                                    store[type](args1[i], args2[i]) :
                                    store[type](args1[i])));
                                req.onerror = errorHandler;
                            }
                        }
                        else {
                            for (var i = 0; i < length; ++i) {
                                reqs.push(req = store[type](args1[i]));
                                req.onerror = errorHandler;
                            }
                        }
                    }
                    var done = function (event) {
                        var lastResult = event.target.result;
                        reqs.forEach(function (req, i) { return req.error != null && (failures[i] = req.error); });
                        resolve({
                            numFailures: numFailures,
                            failures: failures,
                            results: type === "delete" ? keys : reqs.map(function (req) { return req.result; }),
                            lastResult: lastResult
                        });
                    };
                    req.onerror = function (event) {
                        errorHandler(event);
                        done(event);
                    };
                    req.onsuccess = done;
                });
            }
            function openCursor(_a) {
                var trans = _a.trans, values = _a.values, query = _a.query, reverse = _a.reverse, unique = _a.unique;
                return new Promise(function (resolve, reject) {
                    resolve = wrap(resolve);
                    var index = query.index, range = query.range;
                    var store = trans.objectStore(tableName);
                    var source = index.isPrimaryKey ?
                        store :
                        store.index(index.name);
                    var direction = reverse ?
                        unique ?
                            "prevunique" :
                            "prev" :
                        unique ?
                            "nextunique" :
                            "next";
                    var req = values || !('openKeyCursor' in source) ?
                        source.openCursor(makeIDBKeyRange(range), direction) :
                        source.openKeyCursor(makeIDBKeyRange(range), direction);
                    req.onerror = eventRejectHandler(reject);
                    req.onsuccess = wrap(function (ev) {
                        var cursor = req.result;
                        if (!cursor) {
                            resolve(null);
                            return;
                        }
                        cursor.___id = ++_id_counter;
                        cursor.done = false;
                        var _cursorContinue = cursor.continue.bind(cursor);
                        var _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
                        if (_cursorContinuePrimaryKey)
                            _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
                        var _cursorAdvance = cursor.advance.bind(cursor);
                        var doThrowCursorIsNotStarted = function () { throw new Error("Cursor not started"); };
                        var doThrowCursorIsStopped = function () { throw new Error("Cursor not stopped"); };
                        cursor.trans = trans;
                        cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
                        cursor.fail = wrap(reject);
                        cursor.next = function () {
                            var _this = this;
                            var gotOne = 1;
                            return this.start(function () { return gotOne-- ? _this.continue() : _this.stop(); }).then(function () { return _this; });
                        };
                        cursor.start = function (callback) {
                            var iterationPromise = new Promise(function (resolveIteration, rejectIteration) {
                                resolveIteration = wrap(resolveIteration);
                                req.onerror = eventRejectHandler(rejectIteration);
                                cursor.fail = rejectIteration;
                                cursor.stop = function (value) {
                                    cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                                    resolveIteration(value);
                                };
                            });
                            var guardedCallback = function () {
                                if (req.result) {
                                    try {
                                        callback();
                                    }
                                    catch (err) {
                                        cursor.fail(err);
                                    }
                                }
                                else {
                                    cursor.done = true;
                                    cursor.start = function () { throw new Error("Cursor behind last entry"); };
                                    cursor.stop();
                                }
                            };
                            req.onsuccess = wrap(function (ev) {
                                req.onsuccess = guardedCallback;
                                guardedCallback();
                            });
                            cursor.continue = _cursorContinue;
                            cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
                            cursor.advance = _cursorAdvance;
                            guardedCallback();
                            return iterationPromise;
                        };
                        resolve(cursor);
                    }, reject);
                });
            }
            function query(hasGetAll) {
                return function (request) {
                    return new Promise(function (resolve, reject) {
                        resolve = wrap(resolve);
                        var trans = request.trans, values = request.values, limit = request.limit, query = request.query;
                        var nonInfinitLimit = limit === Infinity ? undefined : limit;
                        var index = query.index, range = query.range;
                        var store = trans.objectStore(tableName);
                        var source = index.isPrimaryKey ? store : store.index(index.name);
                        var idbKeyRange = makeIDBKeyRange(range);
                        if (limit === 0)
                            return resolve({ result: [] });
                        if (hasGetAll) {
                            var req = values ?
                                source.getAll(idbKeyRange, nonInfinitLimit) :
                                source.getAllKeys(idbKeyRange, nonInfinitLimit);
                            req.onsuccess = function (event) { return resolve({ result: event.target.result }); };
                            req.onerror = eventRejectHandler(reject);
                        }
                        else {
                            var count_1 = 0;
                            var req_1 = values || !('openKeyCursor' in source) ?
                                source.openCursor(idbKeyRange) :
                                source.openKeyCursor(idbKeyRange);
                            var result_1 = [];
                            req_1.onsuccess = function (event) {
                                var cursor = req_1.result;
                                if (!cursor)
                                    return resolve({ result: result_1 });
                                result_1.push(values ? cursor.value : cursor.primaryKey);
                                if (++count_1 === limit)
                                    return resolve({ result: result_1 });
                                cursor.continue();
                            };
                            req_1.onerror = eventRejectHandler(reject);
                        }
                    });
                };
            }
            return {
                name: tableName,
                schema: tableSchema,
                mutate: mutate,
                getMany: function (_a) {
                    var trans = _a.trans, keys = _a.keys;
                    return new Promise(function (resolve, reject) {
                        resolve = wrap(resolve);
                        var store = trans.objectStore(tableName);
                        var length = keys.length;
                        var result = new Array(length);
                        var keyCount = 0;
                        var callbackCount = 0;
                        var req;
                        var successHandler = function (event) {
                            var req = event.target;
                            if ((result[req._pos] = req.result) != null)
                                ;
                            if (++callbackCount === keyCount)
                                resolve(result);
                        };
                        var errorHandler = eventRejectHandler(reject);
                        for (var i = 0; i < length; ++i) {
                            var key = keys[i];
                            if (key != null) {
                                req = store.get(keys[i]);
                                req._pos = i;
                                req.onsuccess = successHandler;
                                req.onerror = errorHandler;
                                ++keyCount;
                            }
                        }
                        if (keyCount === 0)
                            resolve(result);
                    });
                },
                get: function (_a) {
                    var trans = _a.trans, key = _a.key;
                    return new Promise(function (resolve, reject) {
                        resolve = wrap(resolve);
                        var store = trans.objectStore(tableName);
                        var req = store.get(key);
                        req.onsuccess = function (event) { return resolve(event.target.result); };
                        req.onerror = eventRejectHandler(reject);
                    });
                },
                query: query(hasGetAll),
                openCursor: openCursor,
                count: function (_a) {
                    var query = _a.query, trans = _a.trans;
                    var index = query.index, range = query.range;
                    return new Promise(function (resolve, reject) {
                        var store = trans.objectStore(tableName);
                        var source = index.isPrimaryKey ? store : store.index(index.name);
                        var idbKeyRange = makeIDBKeyRange(range);
                        var req = idbKeyRange ? source.count(idbKeyRange) : source.count();
                        req.onsuccess = wrap(function (ev) { return resolve(ev.target.result); });
                        req.onerror = eventRejectHandler(reject);
                    });
                }
            };
        }
        var _a = extractSchema(db, tmpTrans), schema = _a.schema, hasGetAll = _a.hasGetAll;
        var tables = schema.tables.map(function (tableSchema) { return createDbCoreTable(tableSchema); });
        var tableMap = {};
        tables.forEach(function (table) { return tableMap[table.name] = table; });
        return {
            stack: "dbcore",
            transaction: db.transaction.bind(db),
            table: function (name) {
                var result = tableMap[name];
                if (!result)
                    throw new Error("Table '" + name + "' not found");
                return tableMap[name];
            },
            MIN_KEY: -Infinity,
            MAX_KEY: getMaxKey(IdbKeyRange),
            schema: schema
        };
    }

    function createMiddlewareStack(stackImpl, middlewares) {
        return middlewares.reduce(function (down, _a) {
            var create = _a.create;
            return (__assign(__assign({}, down), create(down)));
        }, stackImpl);
    }
    function createMiddlewareStacks(middlewares, idbdb, _a, tmpTrans) {
        var IDBKeyRange = _a.IDBKeyRange; _a.indexedDB;
        var dbcore = createMiddlewareStack(createDBCore(idbdb, IDBKeyRange, tmpTrans), middlewares.dbcore);
        return {
            dbcore: dbcore
        };
    }
    function generateMiddlewareStacks(_a, tmpTrans) {
        var db = _a._novip;
        var idbdb = tmpTrans.db;
        var stacks = createMiddlewareStacks(db._middlewares, idbdb, db._deps, tmpTrans);
        db.core = stacks.dbcore;
        db.tables.forEach(function (table) {
            var tableName = table.name;
            if (db.core.schema.tables.some(function (tbl) { return tbl.name === tableName; })) {
                table.core = db.core.table(tableName);
                if (db[tableName] instanceof db.Table) {
                    db[tableName].core = table.core;
                }
            }
        });
    }

    function setApiOnPlace(_a, objs, tableNames, dbschema) {
        var db = _a._novip;
        tableNames.forEach(function (tableName) {
            var schema = dbschema[tableName];
            objs.forEach(function (obj) {
                var propDesc = getPropertyDescriptor(obj, tableName);
                if (!propDesc || ("value" in propDesc && propDesc.value === undefined)) {
                    if (obj === db.Transaction.prototype || obj instanceof db.Transaction) {
                        setProp(obj, tableName, {
                            get: function () { return this.table(tableName); },
                            set: function (value) {
                                defineProperty(this, tableName, { value: value, writable: true, configurable: true, enumerable: true });
                            }
                        });
                    }
                    else {
                        obj[tableName] = new db.Table(tableName, schema);
                    }
                }
            });
        });
    }
    function removeTablesApi(_a, objs) {
        var db = _a._novip;
        objs.forEach(function (obj) {
            for (var key in obj) {
                if (obj[key] instanceof db.Table)
                    delete obj[key];
            }
        });
    }
    function lowerVersionFirst(a, b) {
        return a._cfg.version - b._cfg.version;
    }
    function runUpgraders(db, oldVersion, idbUpgradeTrans, reject) {
        var globalSchema = db._dbSchema;
        var trans = db._createTransaction('readwrite', db._storeNames, globalSchema);
        trans.create(idbUpgradeTrans);
        trans._completion.catch(reject);
        var rejectTransaction = trans._reject.bind(trans);
        var transless = PSD.transless || PSD;
        newScope(function () {
            PSD.trans = trans;
            PSD.transless = transless;
            if (oldVersion === 0) {
                keys(globalSchema).forEach(function (tableName) {
                    createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
                });
                generateMiddlewareStacks(db, idbUpgradeTrans);
                DexiePromise.follow(function () { return db.on.populate.fire(trans); }).catch(rejectTransaction);
            }
            else
                updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans).catch(rejectTransaction);
        });
    }
    function updateTablesAndIndexes(_a, oldVersion, trans, idbUpgradeTrans) {
        var db = _a._novip;
        var queue = [];
        var versions = db._versions;
        var globalSchema = db._dbSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
        var anyContentUpgraderHasRun = false;
        var versToRun = versions.filter(function (v) { return v._cfg.version >= oldVersion; });
        versToRun.forEach(function (version) {
            queue.push(function () {
                var oldSchema = globalSchema;
                var newSchema = version._cfg.dbschema;
                adjustToExistingIndexNames(db, oldSchema, idbUpgradeTrans);
                adjustToExistingIndexNames(db, newSchema, idbUpgradeTrans);
                globalSchema = db._dbSchema = newSchema;
                var diff = getSchemaDiff(oldSchema, newSchema);
                diff.add.forEach(function (tuple) {
                    createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
                });
                diff.change.forEach(function (change) {
                    if (change.recreate) {
                        throw new exceptions.Upgrade("Not yet support for changing primary key");
                    }
                    else {
                        var store_1 = idbUpgradeTrans.objectStore(change.name);
                        change.add.forEach(function (idx) { return addIndex(store_1, idx); });
                        change.change.forEach(function (idx) {
                            store_1.deleteIndex(idx.name);
                            addIndex(store_1, idx);
                        });
                        change.del.forEach(function (idxName) { return store_1.deleteIndex(idxName); });
                    }
                });
                var contentUpgrade = version._cfg.contentUpgrade;
                if (contentUpgrade && version._cfg.version > oldVersion) {
                    generateMiddlewareStacks(db, idbUpgradeTrans);
                    trans._memoizedTables = {};
                    anyContentUpgraderHasRun = true;
                    var upgradeSchema_1 = shallowClone(newSchema);
                    diff.del.forEach(function (table) {
                        upgradeSchema_1[table] = oldSchema[table];
                    });
                    removeTablesApi(db, [db.Transaction.prototype]);
                    setApiOnPlace(db, [db.Transaction.prototype], keys(upgradeSchema_1), upgradeSchema_1);
                    trans.schema = upgradeSchema_1;
                    var contentUpgradeIsAsync_1 = isAsyncFunction(contentUpgrade);
                    if (contentUpgradeIsAsync_1) {
                        incrementExpectedAwaits();
                    }
                    var returnValue_1;
                    var promiseFollowed = DexiePromise.follow(function () {
                        returnValue_1 = contentUpgrade(trans);
                        if (returnValue_1) {
                            if (contentUpgradeIsAsync_1) {
                                var decrementor = decrementExpectedAwaits.bind(null, null);
                                returnValue_1.then(decrementor, decrementor);
                            }
                        }
                    });
                    return (returnValue_1 && typeof returnValue_1.then === 'function' ?
                        DexiePromise.resolve(returnValue_1) : promiseFollowed.then(function () { return returnValue_1; }));
                }
            });
            queue.push(function (idbtrans) {
                if (!anyContentUpgraderHasRun || !hasIEDeleteObjectStoreBug) {
                    var newSchema = version._cfg.dbschema;
                    deleteRemovedTables(newSchema, idbtrans);
                }
                removeTablesApi(db, [db.Transaction.prototype]);
                setApiOnPlace(db, [db.Transaction.prototype], db._storeNames, db._dbSchema);
                trans.schema = db._dbSchema;
            });
        });
        function runQueue() {
            return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) :
                DexiePromise.resolve();
        }
        return runQueue().then(function () {
            createMissingTables(globalSchema, idbUpgradeTrans);
        });
    }
    function getSchemaDiff(oldSchema, newSchema) {
        var diff = {
            del: [],
            add: [],
            change: []
        };
        var table;
        for (table in oldSchema) {
            if (!newSchema[table])
                diff.del.push(table);
        }
        for (table in newSchema) {
            var oldDef = oldSchema[table], newDef = newSchema[table];
            if (!oldDef) {
                diff.add.push([table, newDef]);
            }
            else {
                var change = {
                    name: table,
                    def: newDef,
                    recreate: false,
                    del: [],
                    add: [],
                    change: []
                };
                if ((
                '' + (oldDef.primKey.keyPath || '')) !== ('' + (newDef.primKey.keyPath || '')) ||
                    (oldDef.primKey.auto !== newDef.primKey.auto && !isIEOrEdge))
                 {
                    change.recreate = true;
                    diff.change.push(change);
                }
                else {
                    var oldIndexes = oldDef.idxByName;
                    var newIndexes = newDef.idxByName;
                    var idxName = void 0;
                    for (idxName in oldIndexes) {
                        if (!newIndexes[idxName])
                            change.del.push(idxName);
                    }
                    for (idxName in newIndexes) {
                        var oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
                        if (!oldIdx)
                            change.add.push(newIdx);
                        else if (oldIdx.src !== newIdx.src)
                            change.change.push(newIdx);
                    }
                    if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
                        diff.change.push(change);
                    }
                }
            }
        }
        return diff;
    }
    function createTable(idbtrans, tableName, primKey, indexes) {
        var store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ?
            { keyPath: primKey.keyPath, autoIncrement: primKey.auto } :
            { autoIncrement: primKey.auto });
        indexes.forEach(function (idx) { return addIndex(store, idx); });
        return store;
    }
    function createMissingTables(newSchema, idbtrans) {
        keys(newSchema).forEach(function (tableName) {
            if (!idbtrans.db.objectStoreNames.contains(tableName)) {
                createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
            }
        });
    }
    function deleteRemovedTables(newSchema, idbtrans) {
        [].slice.call(idbtrans.db.objectStoreNames).forEach(function (storeName) {
            return newSchema[storeName] == null && idbtrans.db.deleteObjectStore(storeName);
        });
    }
    function addIndex(store, idx) {
        store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multi });
    }
    function buildGlobalSchema(db, idbdb, tmpTrans) {
        var globalSchema = {};
        var dbStoreNames = slice(idbdb.objectStoreNames, 0);
        dbStoreNames.forEach(function (storeName) {
            var store = tmpTrans.objectStore(storeName);
            var keyPath = store.keyPath;
            var primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", false, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
            var indexes = [];
            for (var j = 0; j < store.indexNames.length; ++j) {
                var idbindex = store.index(store.indexNames[j]);
                keyPath = idbindex.keyPath;
                var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
                indexes.push(index);
            }
            globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
        });
        return globalSchema;
    }
    function readGlobalSchema(_a, idbdb, tmpTrans) {
        var db = _a._novip;
        db.verno = idbdb.version / 10;
        var globalSchema = db._dbSchema = buildGlobalSchema(db, idbdb, tmpTrans);
        db._storeNames = slice(idbdb.objectStoreNames, 0);
        setApiOnPlace(db, [db._allTables], keys(globalSchema), globalSchema);
    }
    function verifyInstalledSchema(db, tmpTrans) {
        var installedSchema = buildGlobalSchema(db, db.idbdb, tmpTrans);
        var diff = getSchemaDiff(installedSchema, db._dbSchema);
        return !(diff.add.length || diff.change.some(function (ch) { return ch.add.length || ch.change.length; }));
    }
    function adjustToExistingIndexNames(_a, schema, idbtrans) {
        var db = _a._novip;
        var storeNames = idbtrans.db.objectStoreNames;
        for (var i = 0; i < storeNames.length; ++i) {
            var storeName = storeNames[i];
            var store = idbtrans.objectStore(storeName);
            db._hasGetAll = 'getAll' in store;
            for (var j = 0; j < store.indexNames.length; ++j) {
                var indexName = store.indexNames[j];
                var keyPath = store.index(indexName).keyPath;
                var dexieName = typeof keyPath === 'string' ? keyPath : "[" + slice(keyPath).join('+') + "]";
                if (schema[storeName]) {
                    var indexSpec = schema[storeName].idxByName[dexieName];
                    if (indexSpec) {
                        indexSpec.name = indexName;
                        delete schema[storeName].idxByName[dexieName];
                        schema[storeName].idxByName[indexName] = indexSpec;
                    }
                }
            }
        }
        if (typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) &&
            !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
            _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope &&
            [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
            db._hasGetAll = false;
        }
    }
    function parseIndexSyntax(primKeyAndIndexes) {
        return primKeyAndIndexes.split(',').map(function (index, indexNum) {
            index = index.trim();
            var name = index.replace(/([&*]|\+\+)/g, "");
            var keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split('+') : name;
            return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), indexNum === 0);
        });
    }

    var Version =  (function () {
        function Version() {
        }
        Version.prototype._parseStoresSpec = function (stores, outSchema) {
            keys(stores).forEach(function (tableName) {
                if (stores[tableName] !== null) {
                    var indexes = parseIndexSyntax(stores[tableName]);
                    var primKey = indexes.shift();
                    if (primKey.multi)
                        throw new exceptions.Schema("Primary key cannot be multi-valued");
                    indexes.forEach(function (idx) {
                        if (idx.auto)
                            throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
                        if (!idx.keyPath)
                            throw new exceptions.Schema("Index must have a name and cannot be an empty string");
                    });
                    outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
                }
            });
        };
        Version.prototype.stores = function (stores) {
            var db = this.db;
            this._cfg.storesSource = this._cfg.storesSource ?
                extend(this._cfg.storesSource, stores) :
                stores;
            var versions = db._versions;
            var storesSpec = {};
            var dbschema = {};
            versions.forEach(function (version) {
                extend(storesSpec, version._cfg.storesSource);
                dbschema = (version._cfg.dbschema = {});
                version._parseStoresSpec(storesSpec, dbschema);
            });
            db._dbSchema = dbschema;
            removeTablesApi(db, [db._allTables, db, db.Transaction.prototype]);
            setApiOnPlace(db, [db._allTables, db, db.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
            db._storeNames = keys(dbschema);
            return this;
        };
        Version.prototype.upgrade = function (upgradeFunction) {
            this._cfg.contentUpgrade = promisableChain(this._cfg.contentUpgrade || nop, upgradeFunction);
            return this;
        };
        return Version;
    }());

    function createVersionConstructor(db) {
        return makeClassConstructor(Version.prototype, function Version(versionNumber) {
            this.db = db;
            this._cfg = {
                version: versionNumber,
                storesSource: null,
                dbschema: {},
                tables: {},
                contentUpgrade: null
            };
        });
    }

    function getDbNamesTable(indexedDB, IDBKeyRange) {
        var dbNamesDB = indexedDB["_dbNamesDB"];
        if (!dbNamesDB) {
            dbNamesDB = indexedDB["_dbNamesDB"] = new Dexie$1(DBNAMES_DB, {
                addons: [],
                indexedDB: indexedDB,
                IDBKeyRange: IDBKeyRange,
            });
            dbNamesDB.version(1).stores({ dbnames: "name" });
        }
        return dbNamesDB.table("dbnames");
    }
    function hasDatabasesNative(indexedDB) {
        return indexedDB && typeof indexedDB.databases === "function";
    }
    function getDatabaseNames(_a) {
        var indexedDB = _a.indexedDB, IDBKeyRange = _a.IDBKeyRange;
        return hasDatabasesNative(indexedDB)
            ? Promise.resolve(indexedDB.databases()).then(function (infos) {
                return infos
                    .map(function (info) { return info.name; })
                    .filter(function (name) { return name !== DBNAMES_DB; });
            })
            : getDbNamesTable(indexedDB, IDBKeyRange).toCollection().primaryKeys();
    }
    function _onDatabaseCreated(_a, name) {
        var indexedDB = _a.indexedDB, IDBKeyRange = _a.IDBKeyRange;
        !hasDatabasesNative(indexedDB) &&
            name !== DBNAMES_DB &&
            getDbNamesTable(indexedDB, IDBKeyRange).put({ name: name }).catch(nop);
    }
    function _onDatabaseDeleted(_a, name) {
        var indexedDB = _a.indexedDB, IDBKeyRange = _a.IDBKeyRange;
        !hasDatabasesNative(indexedDB) &&
            name !== DBNAMES_DB &&
            getDbNamesTable(indexedDB, IDBKeyRange).delete(name).catch(nop);
    }

    function vip(fn) {
        return newScope(function () {
            PSD.letThrough = true;
            return fn();
        });
    }

    function idbReady() {
        var isSafari = !navigator.userAgentData &&
            /Safari\//.test(navigator.userAgent) &&
            !/Chrom(e|ium)\//.test(navigator.userAgent);
        if (!isSafari || !indexedDB.databases)
            return Promise.resolve();
        var intervalId;
        return new Promise(function (resolve) {
            var tryIdb = function () { return indexedDB.databases().finally(resolve); };
            intervalId = setInterval(tryIdb, 100);
            tryIdb();
        }).finally(function () { return clearInterval(intervalId); });
    }

    function dexieOpen(db) {
        var state = db._state;
        var indexedDB = db._deps.indexedDB;
        if (state.isBeingOpened || db.idbdb)
            return state.dbReadyPromise.then(function () { return state.dbOpenError ?
                rejection(state.dbOpenError) :
                db; });
        debug && (state.openCanceller._stackHolder = getErrorWithStack());
        state.isBeingOpened = true;
        state.dbOpenError = null;
        state.openComplete = false;
        var openCanceller = state.openCanceller;
        function throwIfCancelled() {
            if (state.openCanceller !== openCanceller)
                throw new exceptions.DatabaseClosed('db.open() was cancelled');
        }
        var resolveDbReady = state.dbReadyResolve,
        upgradeTransaction = null, wasCreated = false;
        return DexiePromise.race([openCanceller, (typeof navigator === 'undefined' ? DexiePromise.resolve() : idbReady()).then(function () { return new DexiePromise(function (resolve, reject) {
                throwIfCancelled();
                if (!indexedDB)
                    throw new exceptions.MissingAPI();
                var dbName = db.name;
                var req = state.autoSchema ?
                    indexedDB.open(dbName) :
                    indexedDB.open(dbName, Math.round(db.verno * 10));
                if (!req)
                    throw new exceptions.MissingAPI();
                req.onerror = eventRejectHandler(reject);
                req.onblocked = wrap(db._fireOnBlocked);
                req.onupgradeneeded = wrap(function (e) {
                    upgradeTransaction = req.transaction;
                    if (state.autoSchema && !db._options.allowEmptyDB) {
                        req.onerror = preventDefault;
                        upgradeTransaction.abort();
                        req.result.close();
                        var delreq = indexedDB.deleteDatabase(dbName);
                        delreq.onsuccess = delreq.onerror = wrap(function () {
                            reject(new exceptions.NoSuchDatabase("Database " + dbName + " doesnt exist"));
                        });
                    }
                    else {
                        upgradeTransaction.onerror = eventRejectHandler(reject);
                        var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
                        wasCreated = oldVer < 1;
                        db._novip.idbdb = req.result;
                        runUpgraders(db, oldVer / 10, upgradeTransaction, reject);
                    }
                }, reject);
                req.onsuccess = wrap(function () {
                    upgradeTransaction = null;
                    var idbdb = db._novip.idbdb = req.result;
                    var objectStoreNames = slice(idbdb.objectStoreNames);
                    if (objectStoreNames.length > 0)
                        try {
                            var tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), 'readonly');
                            if (state.autoSchema)
                                readGlobalSchema(db, idbdb, tmpTrans);
                            else {
                                adjustToExistingIndexNames(db, db._dbSchema, tmpTrans);
                                if (!verifyInstalledSchema(db, tmpTrans)) {
                                    console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.");
                                }
                            }
                            generateMiddlewareStacks(db, tmpTrans);
                        }
                        catch (e) {
                        }
                    connections.push(db);
                    idbdb.onversionchange = wrap(function (ev) {
                        state.vcFired = true;
                        db.on("versionchange").fire(ev);
                    });
                    idbdb.onclose = wrap(function (ev) {
                        db.on("close").fire(ev);
                    });
                    if (wasCreated)
                        _onDatabaseCreated(db._deps, dbName);
                    resolve();
                }, reject);
            }); })]).then(function () {
            throwIfCancelled();
            state.onReadyBeingFired = [];
            return DexiePromise.resolve(vip(function () { return db.on.ready.fire(db.vip); })).then(function fireRemainders() {
                if (state.onReadyBeingFired.length > 0) {
                    var remainders_1 = state.onReadyBeingFired.reduce(promisableChain, nop);
                    state.onReadyBeingFired = [];
                    return DexiePromise.resolve(vip(function () { return remainders_1(db.vip); })).then(fireRemainders);
                }
            });
        }).finally(function () {
            state.onReadyBeingFired = null;
            state.isBeingOpened = false;
        }).then(function () {
            return db;
        }).catch(function (err) {
            state.dbOpenError = err;
            try {
                upgradeTransaction && upgradeTransaction.abort();
            }
            catch (_a) { }
            if (openCanceller === state.openCanceller) {
                db._close();
            }
            return rejection(err);
        }).finally(function () {
            state.openComplete = true;
            resolveDbReady();
        });
    }

    function awaitIterator(iterator) {
        var callNext = function (result) { return iterator.next(result); }, doThrow = function (error) { return iterator.throw(error); }, onSuccess = step(callNext), onError = step(doThrow);
        function step(getNext) {
            return function (val) {
                var next = getNext(val), value = next.value;
                return next.done ? value :
                    (!value || typeof value.then !== 'function' ?
                        isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) :
                        value.then(onSuccess, onError));
            };
        }
        return step(callNext)();
    }

    function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
        var i = arguments.length;
        if (i < 2)
            throw new exceptions.InvalidArgument("Too few arguments");
        var args = new Array(i - 1);
        while (--i)
            args[i - 1] = arguments[i];
        scopeFunc = args.pop();
        var tables = flatten(args);
        return [mode, tables, scopeFunc];
    }
    function enterTransactionScope(db, mode, storeNames, parentTransaction, scopeFunc) {
        return DexiePromise.resolve().then(function () {
            var transless = PSD.transless || PSD;
            var trans = db._createTransaction(mode, storeNames, db._dbSchema, parentTransaction);
            var zoneProps = {
                trans: trans,
                transless: transless
            };
            if (parentTransaction) {
                trans.idbtrans = parentTransaction.idbtrans;
            }
            else {
                try {
                    trans.create();
                    db._state.PR1398_maxLoop = 3;
                }
                catch (ex) {
                    if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
                        console.warn('Dexie: Need to reopen db');
                        db._close();
                        return db.open().then(function () { return enterTransactionScope(db, mode, storeNames, null, scopeFunc); });
                    }
                    return rejection(ex);
                }
            }
            var scopeFuncIsAsync = isAsyncFunction(scopeFunc);
            if (scopeFuncIsAsync) {
                incrementExpectedAwaits();
            }
            var returnValue;
            var promiseFollowed = DexiePromise.follow(function () {
                returnValue = scopeFunc.call(trans, trans);
                if (returnValue) {
                    if (scopeFuncIsAsync) {
                        var decrementor = decrementExpectedAwaits.bind(null, null);
                        returnValue.then(decrementor, decrementor);
                    }
                    else if (typeof returnValue.next === 'function' && typeof returnValue.throw === 'function') {
                        returnValue = awaitIterator(returnValue);
                    }
                }
            }, zoneProps);
            return (returnValue && typeof returnValue.then === 'function' ?
                DexiePromise.resolve(returnValue).then(function (x) { return trans.active ?
                    x
                    : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn")); })
                : promiseFollowed.then(function () { return returnValue; })).then(function (x) {
                if (parentTransaction)
                    trans._resolve();
                return trans._completion.then(function () { return x; });
            }).catch(function (e) {
                trans._reject(e);
                return rejection(e);
            });
        });
    }

    function pad(a, value, count) {
        var result = isArray(a) ? a.slice() : [a];
        for (var i = 0; i < count; ++i)
            result.push(value);
        return result;
    }
    function createVirtualIndexMiddleware(down) {
        return __assign(__assign({}, down), { table: function (tableName) {
                var table = down.table(tableName);
                var schema = table.schema;
                var indexLookup = {};
                var allVirtualIndexes = [];
                function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
                    var keyPathAlias = getKeyPathAlias(keyPath);
                    var indexList = (indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || []);
                    var keyLength = keyPath == null ? 0 : typeof keyPath === 'string' ? 1 : keyPath.length;
                    var isVirtual = keyTail > 0;
                    var virtualIndex = __assign(__assign({}, lowLevelIndex), { isVirtual: isVirtual, keyTail: keyTail, keyLength: keyLength, extractKey: getKeyExtractor(keyPath), unique: !isVirtual && lowLevelIndex.unique });
                    indexList.push(virtualIndex);
                    if (!virtualIndex.isPrimaryKey) {
                        allVirtualIndexes.push(virtualIndex);
                    }
                    if (keyLength > 1) {
                        var virtualKeyPath = keyLength === 2 ?
                            keyPath[0] :
                            keyPath.slice(0, keyLength - 1);
                        addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
                    }
                    indexList.sort(function (a, b) { return a.keyTail - b.keyTail; });
                    return virtualIndex;
                }
                var primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
                indexLookup[":id"] = [primaryKey];
                for (var _i = 0, _a = schema.indexes; _i < _a.length; _i++) {
                    var index = _a[_i];
                    addVirtualIndexes(index.keyPath, 0, index);
                }
                function findBestIndex(keyPath) {
                    var result = indexLookup[getKeyPathAlias(keyPath)];
                    return result && result[0];
                }
                function translateRange(range, keyTail) {
                    return {
                        type: range.type === 1  ?
                            2  :
                            range.type,
                        lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
                        lowerOpen: true,
                        upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
                        upperOpen: true
                    };
                }
                function translateRequest(req) {
                    var index = req.query.index;
                    return index.isVirtual ? __assign(__assign({}, req), { query: {
                            index: index,
                            range: translateRange(req.query.range, index.keyTail)
                        } }) : req;
                }
                var result = __assign(__assign({}, table), { schema: __assign(__assign({}, schema), { primaryKey: primaryKey, indexes: allVirtualIndexes, getIndexByKeyPath: findBestIndex }), count: function (req) {
                        return table.count(translateRequest(req));
                    }, query: function (req) {
                        return table.query(translateRequest(req));
                    }, openCursor: function (req) {
                        var _a = req.query.index, keyTail = _a.keyTail, isVirtual = _a.isVirtual, keyLength = _a.keyLength;
                        if (!isVirtual)
                            return table.openCursor(req);
                        function createVirtualCursor(cursor) {
                            function _continue(key) {
                                key != null ?
                                    cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) :
                                    req.unique ?
                                        cursor.continue(cursor.key.slice(0, keyLength)
                                            .concat(req.reverse
                                            ? down.MIN_KEY
                                            : down.MAX_KEY, keyTail)) :
                                        cursor.continue();
                            }
                            var virtualCursor = Object.create(cursor, {
                                continue: { value: _continue },
                                continuePrimaryKey: {
                                    value: function (key, primaryKey) {
                                        cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey);
                                    }
                                },
                                primaryKey: {
                                    get: function () {
                                        return cursor.primaryKey;
                                    }
                                },
                                key: {
                                    get: function () {
                                        var key = cursor.key;
                                        return keyLength === 1 ?
                                            key[0] :
                                            key.slice(0, keyLength);
                                    }
                                },
                                value: {
                                    get: function () {
                                        return cursor.value;
                                    }
                                }
                            });
                            return virtualCursor;
                        }
                        return table.openCursor(translateRequest(req))
                            .then(function (cursor) { return cursor && createVirtualCursor(cursor); });
                    } });
                return result;
            } });
    }
    var virtualIndexMiddleware = {
        stack: "dbcore",
        name: "VirtualIndexMiddleware",
        level: 1,
        create: createVirtualIndexMiddleware
    };

    function getObjectDiff(a, b, rv, prfx) {
        rv = rv || {};
        prfx = prfx || '';
        keys(a).forEach(function (prop) {
            if (!hasOwn(b, prop)) {
                rv[prfx + prop] = undefined;
            }
            else {
                var ap = a[prop], bp = b[prop];
                if (typeof ap === 'object' && typeof bp === 'object' && ap && bp) {
                    var apTypeName = toStringTag(ap);
                    var bpTypeName = toStringTag(bp);
                    if (apTypeName !== bpTypeName) {
                        rv[prfx + prop] = b[prop];
                    }
                    else if (apTypeName === 'Object') {
                        getObjectDiff(ap, bp, rv, prfx + prop + '.');
                    }
                    else if (ap !== bp) {
                        rv[prfx + prop] = b[prop];
                    }
                }
                else if (ap !== bp)
                    rv[prfx + prop] = b[prop];
            }
        });
        keys(b).forEach(function (prop) {
            if (!hasOwn(a, prop)) {
                rv[prfx + prop] = b[prop];
            }
        });
        return rv;
    }

    function getEffectiveKeys(primaryKey, req) {
        if (req.type === 'delete')
            return req.keys;
        return req.keys || req.values.map(primaryKey.extractKey);
    }

    var hooksMiddleware = {
        stack: "dbcore",
        name: "HooksMiddleware",
        level: 2,
        create: function (downCore) { return (__assign(__assign({}, downCore), { table: function (tableName) {
                var downTable = downCore.table(tableName);
                var primaryKey = downTable.schema.primaryKey;
                var tableMiddleware = __assign(__assign({}, downTable), { mutate: function (req) {
                        var dxTrans = PSD.trans;
                        var _a = dxTrans.table(tableName).hook, deleting = _a.deleting, creating = _a.creating, updating = _a.updating;
                        switch (req.type) {
                            case 'add':
                                if (creating.fire === nop)
                                    break;
                                return dxTrans._promise('readwrite', function () { return addPutOrDelete(req); }, true);
                            case 'put':
                                if (creating.fire === nop && updating.fire === nop)
                                    break;
                                return dxTrans._promise('readwrite', function () { return addPutOrDelete(req); }, true);
                            case 'delete':
                                if (deleting.fire === nop)
                                    break;
                                return dxTrans._promise('readwrite', function () { return addPutOrDelete(req); }, true);
                            case 'deleteRange':
                                if (deleting.fire === nop)
                                    break;
                                return dxTrans._promise('readwrite', function () { return deleteRange(req); }, true);
                        }
                        return downTable.mutate(req);
                        function addPutOrDelete(req) {
                            var dxTrans = PSD.trans;
                            var keys = req.keys || getEffectiveKeys(primaryKey, req);
                            if (!keys)
                                throw new Error("Keys missing");
                            req = req.type === 'add' || req.type === 'put' ? __assign(__assign({}, req), { keys: keys }) : __assign({}, req);
                            if (req.type !== 'delete')
                                req.values = __spreadArray([], req.values, true);
                            if (req.keys)
                                req.keys = __spreadArray([], req.keys, true);
                            return getExistingValues(downTable, req, keys).then(function (existingValues) {
                                var contexts = keys.map(function (key, i) {
                                    var existingValue = existingValues[i];
                                    var ctx = { onerror: null, onsuccess: null };
                                    if (req.type === 'delete') {
                                        deleting.fire.call(ctx, key, existingValue, dxTrans);
                                    }
                                    else if (req.type === 'add' || existingValue === undefined) {
                                        var generatedPrimaryKey = creating.fire.call(ctx, key, req.values[i], dxTrans);
                                        if (key == null && generatedPrimaryKey != null) {
                                            key = generatedPrimaryKey;
                                            req.keys[i] = key;
                                            if (!primaryKey.outbound) {
                                                setByKeyPath(req.values[i], primaryKey.keyPath, key);
                                            }
                                        }
                                    }
                                    else {
                                        var objectDiff = getObjectDiff(existingValue, req.values[i]);
                                        var additionalChanges_1 = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans);
                                        if (additionalChanges_1) {
                                            var requestedValue_1 = req.values[i];
                                            Object.keys(additionalChanges_1).forEach(function (keyPath) {
                                                if (hasOwn(requestedValue_1, keyPath)) {
                                                    requestedValue_1[keyPath] = additionalChanges_1[keyPath];
                                                }
                                                else {
                                                    setByKeyPath(requestedValue_1, keyPath, additionalChanges_1[keyPath]);
                                                }
                                            });
                                        }
                                    }
                                    return ctx;
                                });
                                return downTable.mutate(req).then(function (_a) {
                                    var failures = _a.failures, results = _a.results, numFailures = _a.numFailures, lastResult = _a.lastResult;
                                    for (var i = 0; i < keys.length; ++i) {
                                        var primKey = results ? results[i] : keys[i];
                                        var ctx = contexts[i];
                                        if (primKey == null) {
                                            ctx.onerror && ctx.onerror(failures[i]);
                                        }
                                        else {
                                            ctx.onsuccess && ctx.onsuccess(req.type === 'put' && existingValues[i] ?
                                                req.values[i] :
                                                primKey
                                            );
                                        }
                                    }
                                    return { failures: failures, results: results, numFailures: numFailures, lastResult: lastResult };
                                }).catch(function (error) {
                                    contexts.forEach(function (ctx) { return ctx.onerror && ctx.onerror(error); });
                                    return Promise.reject(error);
                                });
                            });
                        }
                        function deleteRange(req) {
                            return deleteNextChunk(req.trans, req.range, 10000);
                        }
                        function deleteNextChunk(trans, range, limit) {
                            return downTable.query({ trans: trans, values: false, query: { index: primaryKey, range: range }, limit: limit })
                                .then(function (_a) {
                                var result = _a.result;
                                return addPutOrDelete({ type: 'delete', keys: result, trans: trans }).then(function (res) {
                                    if (res.numFailures > 0)
                                        return Promise.reject(res.failures[0]);
                                    if (result.length < limit) {
                                        return { failures: [], numFailures: 0, lastResult: undefined };
                                    }
                                    else {
                                        return deleteNextChunk(trans, __assign(__assign({}, range), { lower: result[result.length - 1], lowerOpen: true }), limit);
                                    }
                                });
                            });
                        }
                    } });
                return tableMiddleware;
            } })); }
    };
    function getExistingValues(table, req, effectiveKeys) {
        return req.type === "add"
            ? Promise.resolve([])
            : table.getMany({ trans: req.trans, keys: effectiveKeys, cache: "immutable" });
    }

    function getFromTransactionCache(keys, cache, clone) {
        try {
            if (!cache)
                return null;
            if (cache.keys.length < keys.length)
                return null;
            var result = [];
            for (var i = 0, j = 0; i < cache.keys.length && j < keys.length; ++i) {
                if (cmp(cache.keys[i], keys[j]) !== 0)
                    continue;
                result.push(clone ? deepClone(cache.values[i]) : cache.values[i]);
                ++j;
            }
            return result.length === keys.length ? result : null;
        }
        catch (_a) {
            return null;
        }
    }
    var cacheExistingValuesMiddleware = {
        stack: "dbcore",
        level: -1,
        create: function (core) {
            return {
                table: function (tableName) {
                    var table = core.table(tableName);
                    return __assign(__assign({}, table), { getMany: function (req) {
                            if (!req.cache) {
                                return table.getMany(req);
                            }
                            var cachedResult = getFromTransactionCache(req.keys, req.trans["_cache"], req.cache === "clone");
                            if (cachedResult) {
                                return DexiePromise.resolve(cachedResult);
                            }
                            return table.getMany(req).then(function (res) {
                                req.trans["_cache"] = {
                                    keys: req.keys,
                                    values: req.cache === "clone" ? deepClone(res) : res,
                                };
                                return res;
                            });
                        }, mutate: function (req) {
                            if (req.type !== "add")
                                req.trans["_cache"] = null;
                            return table.mutate(req);
                        } });
                },
            };
        },
    };

    var _a;
    function isEmptyRange(node) {
        return !("from" in node);
    }
    var RangeSet = function (fromOrTree, to) {
        if (this) {
            extend(this, arguments.length ? { d: 1, from: fromOrTree, to: arguments.length > 1 ? to : fromOrTree } : { d: 0 });
        }
        else {
            var rv = new RangeSet();
            if (fromOrTree && ("d" in fromOrTree)) {
                extend(rv, fromOrTree);
            }
            return rv;
        }
    };
    props(RangeSet.prototype, (_a = {
            add: function (rangeSet) {
                mergeRanges(this, rangeSet);
                return this;
            },
            addKey: function (key) {
                addRange(this, key, key);
                return this;
            },
            addKeys: function (keys) {
                var _this = this;
                keys.forEach(function (key) { return addRange(_this, key, key); });
                return this;
            }
        },
        _a[iteratorSymbol] = function () {
            return getRangeSetIterator(this);
        },
        _a));
    function addRange(target, from, to) {
        var diff = cmp(from, to);
        if (isNaN(diff))
            return;
        if (diff > 0)
            throw RangeError();
        if (isEmptyRange(target))
            return extend(target, { from: from, to: to, d: 1 });
        var left = target.l;
        var right = target.r;
        if (cmp(to, target.from) < 0) {
            left
                ? addRange(left, from, to)
                : (target.l = { from: from, to: to, d: 1, l: null, r: null });
            return rebalance(target);
        }
        if (cmp(from, target.to) > 0) {
            right
                ? addRange(right, from, to)
                : (target.r = { from: from, to: to, d: 1, l: null, r: null });
            return rebalance(target);
        }
        if (cmp(from, target.from) < 0) {
            target.from = from;
            target.l = null;
            target.d = right ? right.d + 1 : 1;
        }
        if (cmp(to, target.to) > 0) {
            target.to = to;
            target.r = null;
            target.d = target.l ? target.l.d + 1 : 1;
        }
        var rightWasCutOff = !target.r;
        if (left && !target.l) {
            mergeRanges(target, left);
        }
        if (right && rightWasCutOff) {
            mergeRanges(target, right);
        }
    }
    function mergeRanges(target, newSet) {
        function _addRangeSet(target, _a) {
            var from = _a.from, to = _a.to, l = _a.l, r = _a.r;
            addRange(target, from, to);
            if (l)
                _addRangeSet(target, l);
            if (r)
                _addRangeSet(target, r);
        }
        if (!isEmptyRange(newSet))
            _addRangeSet(target, newSet);
    }
    function rangesOverlap(rangeSet1, rangeSet2) {
        var i1 = getRangeSetIterator(rangeSet2);
        var nextResult1 = i1.next();
        if (nextResult1.done)
            return false;
        var a = nextResult1.value;
        var i2 = getRangeSetIterator(rangeSet1);
        var nextResult2 = i2.next(a.from);
        var b = nextResult2.value;
        while (!nextResult1.done && !nextResult2.done) {
            if (cmp(b.from, a.to) <= 0 && cmp(b.to, a.from) >= 0)
                return true;
            cmp(a.from, b.from) < 0
                ? (a = (nextResult1 = i1.next(b.from)).value)
                : (b = (nextResult2 = i2.next(a.from)).value);
        }
        return false;
    }
    function getRangeSetIterator(node) {
        var state = isEmptyRange(node) ? null : { s: 0, n: node };
        return {
            next: function (key) {
                var keyProvided = arguments.length > 0;
                while (state) {
                    switch (state.s) {
                        case 0:
                            state.s = 1;
                            if (keyProvided) {
                                while (state.n.l && cmp(key, state.n.from) < 0)
                                    state = { up: state, n: state.n.l, s: 1 };
                            }
                            else {
                                while (state.n.l)
                                    state = { up: state, n: state.n.l, s: 1 };
                            }
                        case 1:
                            state.s = 2;
                            if (!keyProvided || cmp(key, state.n.to) <= 0)
                                return { value: state.n, done: false };
                        case 2:
                            if (state.n.r) {
                                state.s = 3;
                                state = { up: state, n: state.n.r, s: 0 };
                                continue;
                            }
                        case 3:
                            state = state.up;
                    }
                }
                return { done: true };
            },
        };
    }
    function rebalance(target) {
        var _a, _b;
        var diff = (((_a = target.r) === null || _a === void 0 ? void 0 : _a.d) || 0) - (((_b = target.l) === null || _b === void 0 ? void 0 : _b.d) || 0);
        var r = diff > 1 ? "r" : diff < -1 ? "l" : "";
        if (r) {
            var l = r === "r" ? "l" : "r";
            var rootClone = __assign({}, target);
            var oldRootRight = target[r];
            target.from = oldRootRight.from;
            target.to = oldRootRight.to;
            target[r] = oldRootRight[r];
            rootClone[r] = oldRootRight[l];
            target[l] = rootClone;
            rootClone.d = computeDepth(rootClone);
        }
        target.d = computeDepth(target);
    }
    function computeDepth(_a) {
        var r = _a.r, l = _a.l;
        return (r ? (l ? Math.max(r.d, l.d) : r.d) : l ? l.d : 0) + 1;
    }

    var observabilityMiddleware = {
        stack: "dbcore",
        level: 0,
        create: function (core) {
            var dbName = core.schema.name;
            var FULL_RANGE = new RangeSet(core.MIN_KEY, core.MAX_KEY);
            return __assign(__assign({}, core), { table: function (tableName) {
                    var table = core.table(tableName);
                    var schema = table.schema;
                    var primaryKey = schema.primaryKey;
                    var extractKey = primaryKey.extractKey, outbound = primaryKey.outbound;
                    var tableClone = __assign(__assign({}, table), { mutate: function (req) {
                            var trans = req.trans;
                            var mutatedParts = trans.mutatedParts || (trans.mutatedParts = {});
                            var getRangeSet = function (indexName) {
                                var part = "idb://" + dbName + "/" + tableName + "/" + indexName;
                                return (mutatedParts[part] ||
                                    (mutatedParts[part] = new RangeSet()));
                            };
                            var pkRangeSet = getRangeSet("");
                            var delsRangeSet = getRangeSet(":dels");
                            var type = req.type;
                            var _a = req.type === "deleteRange"
                                ? [req.range]
                                : req.type === "delete"
                                    ? [req.keys]
                                    : req.values.length < 50
                                        ? [[], req.values]
                                        : [], keys = _a[0], newObjs = _a[1];
                            var oldCache = req.trans["_cache"];
                            return table.mutate(req).then(function (res) {
                                if (isArray(keys)) {
                                    if (type !== "delete")
                                        keys = res.results;
                                    pkRangeSet.addKeys(keys);
                                    var oldObjs = getFromTransactionCache(keys, oldCache);
                                    if (!oldObjs && type !== "add") {
                                        delsRangeSet.addKeys(keys);
                                    }
                                    if (oldObjs || newObjs) {
                                        trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs);
                                    }
                                }
                                else if (keys) {
                                    var range = { from: keys.lower, to: keys.upper };
                                    delsRangeSet.add(range);
                                    pkRangeSet.add(range);
                                }
                                else {
                                    pkRangeSet.add(FULL_RANGE);
                                    delsRangeSet.add(FULL_RANGE);
                                    schema.indexes.forEach(function (idx) { return getRangeSet(idx.name).add(FULL_RANGE); });
                                }
                                return res;
                            });
                        } });
                    var getRange = function (_a) {
                        var _b, _c;
                        var _d = _a.query, index = _d.index, range = _d.range;
                        return [
                            index,
                            new RangeSet((_b = range.lower) !== null && _b !== void 0 ? _b : core.MIN_KEY, (_c = range.upper) !== null && _c !== void 0 ? _c : core.MAX_KEY),
                        ];
                    };
                    var readSubscribers = {
                        get: function (req) { return [primaryKey, new RangeSet(req.key)]; },
                        getMany: function (req) { return [primaryKey, new RangeSet().addKeys(req.keys)]; },
                        count: getRange,
                        query: getRange,
                        openCursor: getRange,
                    };
                    keys(readSubscribers).forEach(function (method) {
                        tableClone[method] = function (req) {
                            var subscr = PSD.subscr;
                            if (subscr) {
                                var getRangeSet = function (indexName) {
                                    var part = "idb://" + dbName + "/" + tableName + "/" + indexName;
                                    return (subscr[part] ||
                                        (subscr[part] = new RangeSet()));
                                };
                                var pkRangeSet_1 = getRangeSet("");
                                var delsRangeSet_1 = getRangeSet(":dels");
                                var _a = readSubscribers[method](req), queriedIndex = _a[0], queriedRanges = _a[1];
                                getRangeSet(queriedIndex.name || "").add(queriedRanges);
                                if (!queriedIndex.isPrimaryKey) {
                                    if (method === "count") {
                                        delsRangeSet_1.add(FULL_RANGE);
                                    }
                                    else {
                                        var keysPromise_1 = method === "query" &&
                                            outbound &&
                                            req.values &&
                                            table.query(__assign(__assign({}, req), { values: false }));
                                        return table[method].apply(this, arguments).then(function (res) {
                                            if (method === "query") {
                                                if (outbound && req.values) {
                                                    return keysPromise_1.then(function (_a) {
                                                        var resultingKeys = _a.result;
                                                        pkRangeSet_1.addKeys(resultingKeys);
                                                        return res;
                                                    });
                                                }
                                                var pKeys = req.values
                                                    ? res.result.map(extractKey)
                                                    : res.result;
                                                if (req.values) {
                                                    pkRangeSet_1.addKeys(pKeys);
                                                }
                                                else {
                                                    delsRangeSet_1.addKeys(pKeys);
                                                }
                                            }
                                            else if (method === "openCursor") {
                                                var cursor_1 = res;
                                                var wantValues_1 = req.values;
                                                return (cursor_1 &&
                                                    Object.create(cursor_1, {
                                                        key: {
                                                            get: function () {
                                                                delsRangeSet_1.addKey(cursor_1.primaryKey);
                                                                return cursor_1.key;
                                                            },
                                                        },
                                                        primaryKey: {
                                                            get: function () {
                                                                var pkey = cursor_1.primaryKey;
                                                                delsRangeSet_1.addKey(pkey);
                                                                return pkey;
                                                            },
                                                        },
                                                        value: {
                                                            get: function () {
                                                                wantValues_1 && pkRangeSet_1.addKey(cursor_1.primaryKey);
                                                                return cursor_1.value;
                                                            },
                                                        },
                                                    }));
                                            }
                                            return res;
                                        });
                                    }
                                }
                            }
                            return table[method].apply(this, arguments);
                        };
                    });
                    return tableClone;
                } });
        },
    };
    function trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs) {
        function addAffectedIndex(ix) {
            var rangeSet = getRangeSet(ix.name || "");
            function extractKey(obj) {
                return obj != null ? ix.extractKey(obj) : null;
            }
            var addKeyOrKeys = function (key) { return ix.multiEntry && isArray(key)
                ? key.forEach(function (key) { return rangeSet.addKey(key); })
                : rangeSet.addKey(key); };
            (oldObjs || newObjs).forEach(function (_, i) {
                var oldKey = oldObjs && extractKey(oldObjs[i]);
                var newKey = newObjs && extractKey(newObjs[i]);
                if (cmp(oldKey, newKey) !== 0) {
                    if (oldKey != null)
                        addKeyOrKeys(oldKey);
                    if (newKey != null)
                        addKeyOrKeys(newKey);
                }
            });
        }
        schema.indexes.forEach(addAffectedIndex);
    }

    var Dexie$1 =  (function () {
        function Dexie(name, options) {
            var _this = this;
            this._middlewares = {};
            this.verno = 0;
            var deps = Dexie.dependencies;
            this._options = options = __assign({
                addons: Dexie.addons, autoOpen: true,
                indexedDB: deps.indexedDB, IDBKeyRange: deps.IDBKeyRange }, options);
            this._deps = {
                indexedDB: options.indexedDB,
                IDBKeyRange: options.IDBKeyRange
            };
            var addons = options.addons;
            this._dbSchema = {};
            this._versions = [];
            this._storeNames = [];
            this._allTables = {};
            this.idbdb = null;
            this._novip = this;
            var state = {
                dbOpenError: null,
                isBeingOpened: false,
                onReadyBeingFired: null,
                openComplete: false,
                dbReadyResolve: nop,
                dbReadyPromise: null,
                cancelOpen: nop,
                openCanceller: null,
                autoSchema: true,
                PR1398_maxLoop: 3
            };
            state.dbReadyPromise = new DexiePromise(function (resolve) {
                state.dbReadyResolve = resolve;
            });
            state.openCanceller = new DexiePromise(function (_, reject) {
                state.cancelOpen = reject;
            });
            this._state = state;
            this.name = name;
            this.on = Events(this, "populate", "blocked", "versionchange", "close", { ready: [promisableChain, nop] });
            this.on.ready.subscribe = override(this.on.ready.subscribe, function (subscribe) {
                return function (subscriber, bSticky) {
                    Dexie.vip(function () {
                        var state = _this._state;
                        if (state.openComplete) {
                            if (!state.dbOpenError)
                                DexiePromise.resolve().then(subscriber);
                            if (bSticky)
                                subscribe(subscriber);
                        }
                        else if (state.onReadyBeingFired) {
                            state.onReadyBeingFired.push(subscriber);
                            if (bSticky)
                                subscribe(subscriber);
                        }
                        else {
                            subscribe(subscriber);
                            var db_1 = _this;
                            if (!bSticky)
                                subscribe(function unsubscribe() {
                                    db_1.on.ready.unsubscribe(subscriber);
                                    db_1.on.ready.unsubscribe(unsubscribe);
                                });
                        }
                    });
                };
            });
            this.Collection = createCollectionConstructor(this);
            this.Table = createTableConstructor(this);
            this.Transaction = createTransactionConstructor(this);
            this.Version = createVersionConstructor(this);
            this.WhereClause = createWhereClauseConstructor(this);
            this.on("versionchange", function (ev) {
                if (ev.newVersion > 0)
                    console.warn("Another connection wants to upgrade database '" + _this.name + "'. Closing db now to resume the upgrade.");
                else
                    console.warn("Another connection wants to delete database '" + _this.name + "'. Closing db now to resume the delete request.");
                _this.close();
            });
            this.on("blocked", function (ev) {
                if (!ev.newVersion || ev.newVersion < ev.oldVersion)
                    console.warn("Dexie.delete('" + _this.name + "') was blocked");
                else
                    console.warn("Upgrade '" + _this.name + "' blocked by other connection holding version " + ev.oldVersion / 10);
            });
            this._maxKey = getMaxKey(options.IDBKeyRange);
            this._createTransaction = function (mode, storeNames, dbschema, parentTransaction) { return new _this.Transaction(mode, storeNames, dbschema, _this._options.chromeTransactionDurability, parentTransaction); };
            this._fireOnBlocked = function (ev) {
                _this.on("blocked").fire(ev);
                connections
                    .filter(function (c) { return c.name === _this.name && c !== _this && !c._state.vcFired; })
                    .map(function (c) { return c.on("versionchange").fire(ev); });
            };
            this.use(virtualIndexMiddleware);
            this.use(hooksMiddleware);
            this.use(observabilityMiddleware);
            this.use(cacheExistingValuesMiddleware);
            this.vip = Object.create(this, { _vip: { value: true } });
            addons.forEach(function (addon) { return addon(_this); });
        }
        Dexie.prototype.version = function (versionNumber) {
            if (isNaN(versionNumber) || versionNumber < 0.1)
                throw new exceptions.Type("Given version is not a positive number");
            versionNumber = Math.round(versionNumber * 10) / 10;
            if (this.idbdb || this._state.isBeingOpened)
                throw new exceptions.Schema("Cannot add version when database is open");
            this.verno = Math.max(this.verno, versionNumber);
            var versions = this._versions;
            var versionInstance = versions.filter(function (v) { return v._cfg.version === versionNumber; })[0];
            if (versionInstance)
                return versionInstance;
            versionInstance = new this.Version(versionNumber);
            versions.push(versionInstance);
            versions.sort(lowerVersionFirst);
            versionInstance.stores({});
            this._state.autoSchema = false;
            return versionInstance;
        };
        Dexie.prototype._whenReady = function (fn) {
            var _this = this;
            return (this.idbdb && (this._state.openComplete || PSD.letThrough || this._vip)) ? fn() : new DexiePromise(function (resolve, reject) {
                if (_this._state.openComplete) {
                    return reject(new exceptions.DatabaseClosed(_this._state.dbOpenError));
                }
                if (!_this._state.isBeingOpened) {
                    if (!_this._options.autoOpen) {
                        reject(new exceptions.DatabaseClosed());
                        return;
                    }
                    _this.open().catch(nop);
                }
                _this._state.dbReadyPromise.then(resolve, reject);
            }).then(fn);
        };
        Dexie.prototype.use = function (_a) {
            var stack = _a.stack, create = _a.create, level = _a.level, name = _a.name;
            if (name)
                this.unuse({ stack: stack, name: name });
            var middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
            middlewares.push({ stack: stack, create: create, level: level == null ? 10 : level, name: name });
            middlewares.sort(function (a, b) { return a.level - b.level; });
            return this;
        };
        Dexie.prototype.unuse = function (_a) {
            var stack = _a.stack, name = _a.name, create = _a.create;
            if (stack && this._middlewares[stack]) {
                this._middlewares[stack] = this._middlewares[stack].filter(function (mw) {
                    return create ? mw.create !== create :
                        name ? mw.name !== name :
                            false;
                });
            }
            return this;
        };
        Dexie.prototype.open = function () {
            return dexieOpen(this);
        };
        Dexie.prototype._close = function () {
            var state = this._state;
            var idx = connections.indexOf(this);
            if (idx >= 0)
                connections.splice(idx, 1);
            if (this.idbdb) {
                try {
                    this.idbdb.close();
                }
                catch (e) { }
                this._novip.idbdb = null;
            }
            state.dbReadyPromise = new DexiePromise(function (resolve) {
                state.dbReadyResolve = resolve;
            });
            state.openCanceller = new DexiePromise(function (_, reject) {
                state.cancelOpen = reject;
            });
        };
        Dexie.prototype.close = function () {
            this._close();
            var state = this._state;
            this._options.autoOpen = false;
            state.dbOpenError = new exceptions.DatabaseClosed();
            if (state.isBeingOpened)
                state.cancelOpen(state.dbOpenError);
        };
        Dexie.prototype.delete = function () {
            var _this = this;
            var hasArguments = arguments.length > 0;
            var state = this._state;
            return new DexiePromise(function (resolve, reject) {
                var doDelete = function () {
                    _this.close();
                    var req = _this._deps.indexedDB.deleteDatabase(_this.name);
                    req.onsuccess = wrap(function () {
                        _onDatabaseDeleted(_this._deps, _this.name);
                        resolve();
                    });
                    req.onerror = eventRejectHandler(reject);
                    req.onblocked = _this._fireOnBlocked;
                };
                if (hasArguments)
                    throw new exceptions.InvalidArgument("Arguments not allowed in db.delete()");
                if (state.isBeingOpened) {
                    state.dbReadyPromise.then(doDelete);
                }
                else {
                    doDelete();
                }
            });
        };
        Dexie.prototype.backendDB = function () {
            return this.idbdb;
        };
        Dexie.prototype.isOpen = function () {
            return this.idbdb !== null;
        };
        Dexie.prototype.hasBeenClosed = function () {
            var dbOpenError = this._state.dbOpenError;
            return dbOpenError && (dbOpenError.name === 'DatabaseClosed');
        };
        Dexie.prototype.hasFailed = function () {
            return this._state.dbOpenError !== null;
        };
        Dexie.prototype.dynamicallyOpened = function () {
            return this._state.autoSchema;
        };
        Object.defineProperty(Dexie.prototype, "tables", {
            get: function () {
                var _this = this;
                return keys(this._allTables).map(function (name) { return _this._allTables[name]; });
            },
            enumerable: false,
            configurable: true
        });
        Dexie.prototype.transaction = function () {
            var args = extractTransactionArgs.apply(this, arguments);
            return this._transaction.apply(this, args);
        };
        Dexie.prototype._transaction = function (mode, tables, scopeFunc) {
            var _this = this;
            var parentTransaction = PSD.trans;
            if (!parentTransaction || parentTransaction.db !== this || mode.indexOf('!') !== -1)
                parentTransaction = null;
            var onlyIfCompatible = mode.indexOf('?') !== -1;
            mode = mode.replace('!', '').replace('?', '');
            var idbMode, storeNames;
            try {
                storeNames = tables.map(function (table) {
                    var storeName = table instanceof _this.Table ? table.name : table;
                    if (typeof storeName !== 'string')
                        throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
                    return storeName;
                });
                if (mode == "r" || mode === READONLY)
                    idbMode = READONLY;
                else if (mode == "rw" || mode == READWRITE)
                    idbMode = READWRITE;
                else
                    throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
                if (parentTransaction) {
                    if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
                        if (onlyIfCompatible) {
                            parentTransaction = null;
                        }
                        else
                            throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
                    }
                    if (parentTransaction) {
                        storeNames.forEach(function (storeName) {
                            if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
                                if (onlyIfCompatible) {
                                    parentTransaction = null;
                                }
                                else
                                    throw new exceptions.SubTransaction("Table " + storeName +
                                        " not included in parent transaction.");
                            }
                        });
                    }
                    if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
                        parentTransaction = null;
                    }
                }
            }
            catch (e) {
                return parentTransaction ?
                    parentTransaction._promise(null, function (_, reject) { reject(e); }) :
                    rejection(e);
            }
            var enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
            return (parentTransaction ?
                parentTransaction._promise(idbMode, enterTransaction, "lock") :
                PSD.trans ?
                    usePSD(PSD.transless, function () { return _this._whenReady(enterTransaction); }) :
                    this._whenReady(enterTransaction));
        };
        Dexie.prototype.table = function (tableName) {
            if (!hasOwn(this._allTables, tableName)) {
                throw new exceptions.InvalidTable("Table " + tableName + " does not exist");
            }
            return this._allTables[tableName];
        };
        return Dexie;
    }());

    var symbolObservable = typeof Symbol !== "undefined" && "observable" in Symbol
        ? Symbol.observable
        : "@@observable";
    var Observable =  (function () {
        function Observable(subscribe) {
            this._subscribe = subscribe;
        }
        Observable.prototype.subscribe = function (x, error, complete) {
            return this._subscribe(!x || typeof x === "function" ? { next: x, error: error, complete: complete } : x);
        };
        Observable.prototype[symbolObservable] = function () {
            return this;
        };
        return Observable;
    }());

    function extendObservabilitySet(target, newSet) {
        keys(newSet).forEach(function (part) {
            var rangeSet = target[part] || (target[part] = new RangeSet());
            mergeRanges(rangeSet, newSet[part]);
        });
        return target;
    }

    function liveQuery(querier) {
        return new Observable(function (observer) {
            var scopeFuncIsAsync = isAsyncFunction(querier);
            function execute(subscr) {
                if (scopeFuncIsAsync) {
                    incrementExpectedAwaits();
                }
                var exec = function () { return newScope(querier, { subscr: subscr, trans: null }); };
                var rv = PSD.trans
                    ?
                        usePSD(PSD.transless, exec)
                    : exec();
                if (scopeFuncIsAsync) {
                    rv.then(decrementExpectedAwaits, decrementExpectedAwaits);
                }
                return rv;
            }
            var closed = false;
            var accumMuts = {};
            var currentObs = {};
            var subscription = {
                get closed() {
                    return closed;
                },
                unsubscribe: function () {
                    closed = true;
                    globalEvents.storagemutated.unsubscribe(mutationListener);
                },
            };
            observer.start && observer.start(subscription);
            var querying = false, startedListening = false;
            function shouldNotify() {
                return keys(currentObs).some(function (key) {
                    return accumMuts[key] && rangesOverlap(accumMuts[key], currentObs[key]);
                });
            }
            var mutationListener = function (parts) {
                extendObservabilitySet(accumMuts, parts);
                if (shouldNotify()) {
                    doQuery();
                }
            };
            var doQuery = function () {
                if (querying || closed)
                    return;
                accumMuts = {};
                var subscr = {};
                var ret = execute(subscr);
                if (!startedListening) {
                    globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, mutationListener);
                    startedListening = true;
                }
                querying = true;
                Promise.resolve(ret).then(function (result) {
                    querying = false;
                    if (closed)
                        return;
                    if (shouldNotify()) {
                        doQuery();
                    }
                    else {
                        accumMuts = {};
                        currentObs = subscr;
                        observer.next && observer.next(result);
                    }
                }, function (err) {
                    querying = false;
                    observer.error && observer.error(err);
                    subscription.unsubscribe();
                });
            };
            doQuery();
            return subscription;
        });
    }

    var domDeps;
    try {
        domDeps = {
            indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
            IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
        };
    }
    catch (e) {
        domDeps = { indexedDB: null, IDBKeyRange: null };
    }

    var Dexie = Dexie$1;
    props(Dexie, __assign(__assign({}, fullNameExceptions), {
        delete: function (databaseName) {
            var db = new Dexie(databaseName, { addons: [] });
            return db.delete();
        },
        exists: function (name) {
            return new Dexie(name, { addons: [] }).open().then(function (db) {
                db.close();
                return true;
            }).catch('NoSuchDatabaseError', function () { return false; });
        },
        getDatabaseNames: function (cb) {
            try {
                return getDatabaseNames(Dexie.dependencies).then(cb);
            }
            catch (_a) {
                return rejection(new exceptions.MissingAPI());
            }
        },
        defineClass: function () {
            function Class(content) {
                extend(this, content);
            }
            return Class;
        }, ignoreTransaction: function (scopeFunc) {
            return PSD.trans ?
                usePSD(PSD.transless, scopeFunc) :
                scopeFunc();
        }, vip: vip, async: function (generatorFn) {
            return function () {
                try {
                    var rv = awaitIterator(generatorFn.apply(this, arguments));
                    if (!rv || typeof rv.then !== 'function')
                        return DexiePromise.resolve(rv);
                    return rv;
                }
                catch (e) {
                    return rejection(e);
                }
            };
        }, spawn: function (generatorFn, args, thiz) {
            try {
                var rv = awaitIterator(generatorFn.apply(thiz, args || []));
                if (!rv || typeof rv.then !== 'function')
                    return DexiePromise.resolve(rv);
                return rv;
            }
            catch (e) {
                return rejection(e);
            }
        },
        currentTransaction: {
            get: function () { return PSD.trans || null; }
        }, waitFor: function (promiseOrFunction, optionalTimeout) {
            var promise = DexiePromise.resolve(typeof promiseOrFunction === 'function' ?
                Dexie.ignoreTransaction(promiseOrFunction) :
                promiseOrFunction)
                .timeout(optionalTimeout || 60000);
            return PSD.trans ?
                PSD.trans.waitFor(promise) :
                promise;
        },
        Promise: DexiePromise,
        debug: {
            get: function () { return debug; },
            set: function (value) {
                setDebug(value, value === 'dexie' ? function () { return true; } : dexieStackFrameFilter);
            }
        },
        derive: derive, extend: extend, props: props, override: override,
        Events: Events, on: globalEvents, liveQuery: liveQuery, extendObservabilitySet: extendObservabilitySet,
        getByKeyPath: getByKeyPath, setByKeyPath: setByKeyPath, delByKeyPath: delByKeyPath, shallowClone: shallowClone, deepClone: deepClone, getObjectDiff: getObjectDiff, cmp: cmp, asap: asap$1,
        minKey: minKey,
        addons: [],
        connections: connections,
        errnames: errnames,
        dependencies: domDeps,
        semVer: DEXIE_VERSION, version: DEXIE_VERSION.split('.')
            .map(function (n) { return parseInt(n); })
            .reduce(function (p, c, i) { return p + (c / Math.pow(10, i * 2)); }) }));
    Dexie.maxKey = getMaxKey(Dexie.dependencies.IDBKeyRange);

    if (typeof dispatchEvent !== 'undefined' && typeof addEventListener !== 'undefined') {
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function (updatedParts) {
            if (!propagatingLocally) {
                var event_1;
                if (isIEOrEdge) {
                    event_1 = document.createEvent('CustomEvent');
                    event_1.initCustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, true, true, updatedParts);
                }
                else {
                    event_1 = new CustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, {
                        detail: updatedParts
                    });
                }
                propagatingLocally = true;
                dispatchEvent(event_1);
                propagatingLocally = false;
            }
        });
        addEventListener(STORAGE_MUTATED_DOM_EVENT_NAME, function (_a) {
            var detail = _a.detail;
            if (!propagatingLocally) {
                propagateLocally(detail);
            }
        });
    }
    function propagateLocally(updateParts) {
        var wasMe = propagatingLocally;
        try {
            propagatingLocally = true;
            globalEvents.storagemutated.fire(updateParts);
        }
        finally {
            propagatingLocally = wasMe;
        }
    }
    var propagatingLocally = false;

    if (typeof BroadcastChannel !== 'undefined') {
        var bc_1 = new BroadcastChannel(STORAGE_MUTATED_DOM_EVENT_NAME);
        if (typeof bc_1.unref === 'function') {
            bc_1.unref();
        }
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function (changedParts) {
            if (!propagatingLocally) {
                bc_1.postMessage(changedParts);
            }
        });
        bc_1.onmessage = function (ev) {
            if (ev.data)
                propagateLocally(ev.data);
        };
    }
    else if (typeof self !== 'undefined' && typeof navigator !== 'undefined') {
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function (changedParts) {
            try {
                if (!propagatingLocally) {
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem(STORAGE_MUTATED_DOM_EVENT_NAME, JSON.stringify({
                            trig: Math.random(),
                            changedParts: changedParts,
                        }));
                    }
                    if (typeof self['clients'] === 'object') {
                        __spreadArray([], self['clients'].matchAll({ includeUncontrolled: true }), true).forEach(function (client) {
                            return client.postMessage({
                                type: STORAGE_MUTATED_DOM_EVENT_NAME,
                                changedParts: changedParts,
                            });
                        });
                    }
                }
            }
            catch (_a) { }
        });
        if (typeof addEventListener !== 'undefined') {
            addEventListener('storage', function (ev) {
                if (ev.key === STORAGE_MUTATED_DOM_EVENT_NAME) {
                    var data = JSON.parse(ev.newValue);
                    if (data)
                        propagateLocally(data.changedParts);
                }
            });
        }
        var swContainer = self.document && navigator.serviceWorker;
        if (swContainer) {
            swContainer.addEventListener('message', propagateMessageLocally);
        }
    }
    function propagateMessageLocally(_a) {
        var data = _a.data;
        if (data && data.type === STORAGE_MUTATED_DOM_EVENT_NAME) {
            propagateLocally(data.changedParts);
        }
    }

    DexiePromise.rejectionMapper = mapError;
    setDebug(debug, dexieStackFrameFilter);

    var namedExports = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Dexie: Dexie$1,
        liveQuery: liveQuery,
        'default': Dexie$1,
        RangeSet: RangeSet,
        mergeRanges: mergeRanges,
        rangesOverlap: rangesOverlap
    });

    __assign(Dexie$1, namedExports, { default: Dexie$1 });

    return Dexie$1;

}));


}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)
},{"timers":8}],5:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],6:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        if (xstate === OPEN) {
          if (reg === '/') {
            p.push([ OPEN, '/', arg ])
            reg = ''
          } else {
            p.push([ OPEN, arg ])
          }
        } else if (xstate === COMMENT && opts.comments) {
          reg += String(arg)
        } else if (xstate !== COMMENT) {
          p.push([ VAR, xstate, arg ])
        }
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      if (opts.createFragment) return opts.createFragment(tree[2])
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && c === '/' && reg.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(c)) {
          if (reg.length) {
            res.push([OPEN, reg])
          }
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else if (x === null || x === undefined) return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":5}],7:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],8:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":7,"timers":8}],9:[function(require,module,exports){
'use strict';

/**
 * Check if `vhost` is a valid suffix of `hostname` (top-domain)
 *
 * It means that `vhost` needs to be a suffix of `hostname` and we then need to
 * make sure that: either they are equal, or the character preceding `vhost` in
 * `hostname` is a '.' (it should not be a partial label).
 *
 * * hostname = 'not.evil.com' and vhost = 'vil.com'      => not ok
 * * hostname = 'not.evil.com' and vhost = 'evil.com'     => ok
 * * hostname = 'not.evil.com' and vhost = 'not.evil.com' => ok
 */
function shareSameDomainSuffix(hostname, vhost) {
    if (hostname.endsWith(vhost)) {
        return (hostname.length === vhost.length ||
            hostname[hostname.length - vhost.length - 1] === '.');
    }
    return false;
}
/**
 * Given a hostname and its public suffix, extract the general domain.
 */
function extractDomainWithSuffix(hostname, publicSuffix) {
    // Locate the index of the last '.' in the part of the `hostname` preceding
    // the public suffix.
    //
    // examples:
    //   1. not.evil.co.uk  => evil.co.uk
    //         ^    ^
    //         |    | start of public suffix
    //         | index of the last dot
    //
    //   2. example.co.uk   => example.co.uk
    //     ^       ^
    //     |       | start of public suffix
    //     |
    //     | (-1) no dot found before the public suffix
    const publicSuffixIndex = hostname.length - publicSuffix.length - 2;
    const lastDotBeforeSuffixIndex = hostname.lastIndexOf('.', publicSuffixIndex);
    // No '.' found, then `hostname` is the general domain (no sub-domain)
    if (lastDotBeforeSuffixIndex === -1) {
        return hostname;
    }
    // Extract the part between the last '.'
    return hostname.slice(lastDotBeforeSuffixIndex + 1);
}
/**
 * Detects the domain based on rules and upon and a host string
 */
function getDomain$1(suffix, hostname, options) {
    // Check if `hostname` ends with a member of `validHosts`.
    if (options.validHosts !== null) {
        const validHosts = options.validHosts;
        for (let i = 0; i < validHosts.length; i += 1) {
            const vhost = validHosts[i];
            if ( /*@__INLINE__*/shareSameDomainSuffix(hostname, vhost) === true) {
                return vhost;
            }
        }
    }
    // If `hostname` is a valid public suffix, then there is no domain to return.
    // Since we already know that `getPublicSuffix` returns a suffix of `hostname`
    // there is no need to perform a string comparison and we only compare the
    // size.
    if (suffix.length === hostname.length) {
        return null;
    }
    // To extract the general domain, we start by identifying the public suffix
    // (if any), then consider the domain to be the public suffix with one added
    // level of depth. (e.g.: if hostname is `not.evil.co.uk` and public suffix:
    // `co.uk`, then we take one more level: `evil`, giving the final result:
    // `evil.co.uk`).
    return /*@__INLINE__*/ extractDomainWithSuffix(hostname, suffix);
}

/**
 * Return the part of domain without suffix.
 *
 * Example: for domain 'foo.com', the result would be 'foo'.
 */
function getDomainWithoutSuffix$1(domain, suffix) {
    // Note: here `domain` and `suffix` cannot have the same length because in
    // this case we set `domain` to `null` instead. It is thus safe to assume
    // that `suffix` is shorter than `domain`.
    return domain.slice(0, -suffix.length - 1);
}

/**
 * @param url - URL we want to extract a hostname from.
 * @param urlIsValidHostname - hint from caller; true if `url` is already a valid hostname.
 */
function extractHostname(url, urlIsValidHostname) {
    let start = 0;
    let end = url.length;
    let hasUpper = false;
    // If url is not already a valid hostname, then try to extract hostname.
    if (urlIsValidHostname === false) {
        // Special handling of data URLs
        if (url.startsWith('data:') === true) {
            return null;
        }
        // Trim leading spaces
        while (start < url.length && url.charCodeAt(start) <= 32) {
            start += 1;
        }
        // Trim trailing spaces
        while (end > start + 1 && url.charCodeAt(end - 1) <= 32) {
            end -= 1;
        }
        // Skip scheme.
        if (url.charCodeAt(start) === 47 /* '/' */ &&
            url.charCodeAt(start + 1) === 47 /* '/' */) {
            start += 2;
        }
        else {
            const indexOfProtocol = url.indexOf(':/', start);
            if (indexOfProtocol !== -1) {
                // Implement fast-path for common protocols. We expect most protocols
                // should be one of these 4 and thus we will not need to perform the
                // more expansive validity check most of the time.
                const protocolSize = indexOfProtocol - start;
                const c0 = url.charCodeAt(start);
                const c1 = url.charCodeAt(start + 1);
                const c2 = url.charCodeAt(start + 2);
                const c3 = url.charCodeAt(start + 3);
                const c4 = url.charCodeAt(start + 4);
                if (protocolSize === 5 &&
                    c0 === 104 /* 'h' */ &&
                    c1 === 116 /* 't' */ &&
                    c2 === 116 /* 't' */ &&
                    c3 === 112 /* 'p' */ &&
                    c4 === 115 /* 's' */) ;
                else if (protocolSize === 4 &&
                    c0 === 104 /* 'h' */ &&
                    c1 === 116 /* 't' */ &&
                    c2 === 116 /* 't' */ &&
                    c3 === 112 /* 'p' */) ;
                else if (protocolSize === 3 &&
                    c0 === 119 /* 'w' */ &&
                    c1 === 115 /* 's' */ &&
                    c2 === 115 /* 's' */) ;
                else if (protocolSize === 2 &&
                    c0 === 119 /* 'w' */ &&
                    c1 === 115 /* 's' */) ;
                else {
                    // Check that scheme is valid
                    for (let i = start; i < indexOfProtocol; i += 1) {
                        const lowerCaseCode = url.charCodeAt(i) | 32;
                        if (((lowerCaseCode >= 97 && lowerCaseCode <= 122) || // [a, z]
                            (lowerCaseCode >= 48 && lowerCaseCode <= 57) || // [0, 9]
                            lowerCaseCode === 46 || // '.'
                            lowerCaseCode === 45 || // '-'
                            lowerCaseCode === 43) === false // '+'
                        ) {
                            return null;
                        }
                    }
                }
                // Skip 0, 1 or more '/' after ':/'
                start = indexOfProtocol + 2;
                while (url.charCodeAt(start) === 47 /* '/' */) {
                    start += 1;
                }
            }
        }
        // Detect first occurrence of '/', '?' or '#'. We also keep track of the
        // last occurrence of '@', ']' or ':' to speed-up subsequent parsing of
        // (respectively), identifier, ipv6 or port.
        let indexOfIdentifier = -1;
        let indexOfClosingBracket = -1;
        let indexOfPort = -1;
        for (let i = start; i < end; i += 1) {
            const code = url.charCodeAt(i);
            if (code === 35 || // '#'
                code === 47 || // '/'
                code === 63 // '?'
            ) {
                end = i;
                break;
            }
            else if (code === 64) {
                // '@'
                indexOfIdentifier = i;
            }
            else if (code === 93) {
                // ']'
                indexOfClosingBracket = i;
            }
            else if (code === 58) {
                // ':'
                indexOfPort = i;
            }
            else if (code >= 65 && code <= 90) {
                hasUpper = true;
            }
        }
        // Detect identifier: '@'
        if (indexOfIdentifier !== -1 &&
            indexOfIdentifier > start &&
            indexOfIdentifier < end) {
            start = indexOfIdentifier + 1;
        }
        // Handle ipv6 addresses
        if (url.charCodeAt(start) === 91 /* '[' */) {
            if (indexOfClosingBracket !== -1) {
                return url.slice(start + 1, indexOfClosingBracket).toLowerCase();
            }
            return null;
        }
        else if (indexOfPort !== -1 && indexOfPort > start && indexOfPort < end) {
            // Detect port: ':'
            end = indexOfPort;
        }
    }
    // Trim trailing dots
    while (end > start + 1 && url.charCodeAt(end - 1) === 46 /* '.' */) {
        end -= 1;
    }
    const hostname = start !== 0 || end !== url.length ? url.slice(start, end) : url;
    if (hasUpper) {
        return hostname.toLowerCase();
    }
    return hostname;
}

/**
 * Check if a hostname is an IP. You should be aware that this only works
 * because `hostname` is already garanteed to be a valid hostname!
 */
function isProbablyIpv4(hostname) {
    // Cannot be shorted than 1.1.1.1
    if (hostname.length < 7) {
        return false;
    }
    // Cannot be longer than: 255.255.255.255
    if (hostname.length > 15) {
        return false;
    }
    let numberOfDots = 0;
    for (let i = 0; i < hostname.length; i += 1) {
        const code = hostname.charCodeAt(i);
        if (code === 46 /* '.' */) {
            numberOfDots += 1;
        }
        else if (code < 48 /* '0' */ || code > 57 /* '9' */) {
            return false;
        }
    }
    return (numberOfDots === 3 &&
        hostname.charCodeAt(0) !== 46 /* '.' */ &&
        hostname.charCodeAt(hostname.length - 1) !== 46 /* '.' */);
}
/**
 * Similar to isProbablyIpv4.
 */
function isProbablyIpv6(hostname) {
    if (hostname.length < 3) {
        return false;
    }
    let start = hostname[0] === '[' ? 1 : 0;
    let end = hostname.length;
    if (hostname[end - 1] === ']') {
        end -= 1;
    }
    // We only consider the maximum size of a normal IPV6. Note that this will
    // fail on so-called "IPv4 mapped IPv6 addresses" but this is a corner-case
    // and a proper validation library should be used for these.
    if (end - start > 39) {
        return false;
    }
    let hasColon = false;
    for (; start < end; start += 1) {
        const code = hostname.charCodeAt(start);
        if (code === 58 /* ':' */) {
            hasColon = true;
        }
        else if (((code >= 48 && code <= 57) || // 0-9
            (code >= 97 && code <= 102) || // a-f
            (code >= 65 && code <= 90)) === // A-F
            false) {
            return false;
        }
    }
    return hasColon;
}
/**
 * Check if `hostname` is *probably* a valid ip addr (either ipv6 or ipv4).
 * This *will not* work on any string. We need `hostname` to be a valid
 * hostname.
 */
function isIp(hostname) {
    return isProbablyIpv6(hostname) || isProbablyIpv4(hostname);
}

/**
 * Implements fast shallow verification of hostnames. This does not perform a
 * struct check on the content of labels (classes of Unicode characters, etc.)
 * but instead check that the structure is valid (number of labels, length of
 * labels, etc.).
 *
 * If you need stricter validation, consider using an external library.
 */
function isValidAscii(code) {
    return ((code >= 97 && code <= 122) || (code >= 48 && code <= 57) || code > 127);
}
/**
 * Check if a hostname string is valid. It's usually a preliminary check before
 * trying to use getDomain or anything else.
 *
 * Beware: it does not check if the TLD exists.
 */
function isValidHostname (hostname) {
    if (hostname.length > 255) {
        return false;
    }
    if (hostname.length === 0) {
        return false;
    }
    if ( /*@__INLINE__*/isValidAscii(hostname.charCodeAt(0)) === false) {
        return false;
    }
    // Validate hostname according to RFC
    let lastDotIndex = -1;
    let lastCharCode = -1;
    const len = hostname.length;
    for (let i = 0; i < len; i += 1) {
        const code = hostname.charCodeAt(i);
        if (code === 46 /* '.' */) {
            if (
            // Check that previous label is < 63 bytes long (64 = 63 + '.')
            i - lastDotIndex > 64 ||
                // Check that previous character was not already a '.'
                lastCharCode === 46 ||
                // Check that the previous label does not end with a '-' (dash)
                lastCharCode === 45 ||
                // Check that the previous label does not end with a '_' (underscore)
                lastCharCode === 95) {
                return false;
            }
            lastDotIndex = i;
        }
        else if (( /*@__INLINE__*/isValidAscii(code) || code === 45 || code === 95) ===
            false) {
            // Check if there is a forbidden character in the label
            return false;
        }
        lastCharCode = code;
    }
    return (
    // Check that last label is shorter than 63 chars
    len - lastDotIndex - 1 <= 63 &&
        // Check that the last character is an allowed trailing label character.
        // Since we already checked that the char is a valid hostname character,
        // we only need to check that it's different from '-'.
        lastCharCode !== 45);
}

function setDefaultsImpl({ allowIcannDomains = true, allowPrivateDomains = false, detectIp = true, extractHostname = true, mixedInputs = true, validHosts = null, validateHostname = true, }) {
    return {
        allowIcannDomains,
        allowPrivateDomains,
        detectIp,
        extractHostname,
        mixedInputs,
        validHosts,
        validateHostname,
    };
}
const DEFAULT_OPTIONS = /*@__INLINE__*/ setDefaultsImpl({});
function setDefaults(options) {
    if (options === undefined) {
        return DEFAULT_OPTIONS;
    }
    return /*@__INLINE__*/ setDefaultsImpl(options);
}

/**
 * Returns the subdomain of a hostname string
 */
function getSubdomain$1(hostname, domain) {
    // If `hostname` and `domain` are the same, then there is no sub-domain
    if (domain.length === hostname.length) {
        return '';
    }
    return hostname.slice(0, -domain.length - 1);
}

/**
 * Implement a factory allowing to plug different implementations of suffix
 * lookup (e.g.: using a trie or the packed hashes datastructures). This is used
 * and exposed in `tldts.ts` and `tldts-experimental.ts` bundle entrypoints.
 */
function getEmptyResult() {
    return {
        domain: null,
        domainWithoutSuffix: null,
        hostname: null,
        isIcann: null,
        isIp: null,
        isPrivate: null,
        publicSuffix: null,
        subdomain: null,
    };
}
function resetResult(result) {
    result.domain = null;
    result.domainWithoutSuffix = null;
    result.hostname = null;
    result.isIcann = null;
    result.isIp = null;
    result.isPrivate = null;
    result.publicSuffix = null;
    result.subdomain = null;
}
function parseImpl(url, step, suffixLookup, partialOptions, result) {
    const options = /*@__INLINE__*/ setDefaults(partialOptions);
    // Very fast approximate check to make sure `url` is a string. This is needed
    // because the library will not necessarily be used in a typed setup and
    // values of arbitrary types might be given as argument.
    if (typeof url !== 'string') {
        return result;
    }
    // Extract hostname from `url` only if needed. This can be made optional
    // using `options.extractHostname`. This option will typically be used
    // whenever we are sure the inputs to `parse` are already hostnames and not
    // arbitrary URLs.
    //
    // `mixedInput` allows to specify if we expect a mix of URLs and hostnames
    // as input. If only hostnames are expected then `extractHostname` can be
    // set to `false` to speed-up parsing. If only URLs are expected then
    // `mixedInputs` can be set to `false`. The `mixedInputs` is only a hint
    // and will not change the behavior of the library.
    if (options.extractHostname === false) {
        result.hostname = url;
    }
    else if (options.mixedInputs === true) {
        result.hostname = extractHostname(url, isValidHostname(url));
    }
    else {
        result.hostname = extractHostname(url, false);
    }
    if (step === 0 /* FLAG.HOSTNAME */ || result.hostname === null) {
        return result;
    }
    // Check if `hostname` is a valid ip address
    if (options.detectIp === true) {
        result.isIp = isIp(result.hostname);
        if (result.isIp === true) {
            return result;
        }
    }
    // Perform optional hostname validation. If hostname is not valid, no need to
    // go further as there will be no valid domain or sub-domain.
    if (options.validateHostname === true &&
        options.extractHostname === true &&
        isValidHostname(result.hostname) === false) {
        result.hostname = null;
        return result;
    }
    // Extract public suffix
    suffixLookup(result.hostname, options, result);
    if (step === 2 /* FLAG.PUBLIC_SUFFIX */ || result.publicSuffix === null) {
        return result;
    }
    // Extract domain
    result.domain = getDomain$1(result.publicSuffix, result.hostname, options);
    if (step === 3 /* FLAG.DOMAIN */ || result.domain === null) {
        return result;
    }
    // Extract subdomain
    result.subdomain = getSubdomain$1(result.hostname, result.domain);
    if (step === 4 /* FLAG.SUB_DOMAIN */) {
        return result;
    }
    // Extract domain without suffix
    result.domainWithoutSuffix = getDomainWithoutSuffix$1(result.domain, result.publicSuffix);
    return result;
}

function fastPathLookup (hostname, options, out) {
    // Fast path for very popular suffixes; this allows to by-pass lookup
    // completely as well as any extra allocation or string manipulation.
    if (options.allowPrivateDomains === false && hostname.length > 3) {
        const last = hostname.length - 1;
        const c3 = hostname.charCodeAt(last);
        const c2 = hostname.charCodeAt(last - 1);
        const c1 = hostname.charCodeAt(last - 2);
        const c0 = hostname.charCodeAt(last - 3);
        if (c3 === 109 /* 'm' */ &&
            c2 === 111 /* 'o' */ &&
            c1 === 99 /* 'c' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'com';
            return true;
        }
        else if (c3 === 103 /* 'g' */ &&
            c2 === 114 /* 'r' */ &&
            c1 === 111 /* 'o' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'org';
            return true;
        }
        else if (c3 === 117 /* 'u' */ &&
            c2 === 100 /* 'd' */ &&
            c1 === 101 /* 'e' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'edu';
            return true;
        }
        else if (c3 === 118 /* 'v' */ &&
            c2 === 111 /* 'o' */ &&
            c1 === 103 /* 'g' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'gov';
            return true;
        }
        else if (c3 === 116 /* 't' */ &&
            c2 === 101 /* 'e' */ &&
            c1 === 110 /* 'n' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'net';
            return true;
        }
        else if (c3 === 101 /* 'e' */ &&
            c2 === 100 /* 'd' */ &&
            c1 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'de';
            return true;
        }
    }
    return false;
}

const exceptions = (function () {
    const _0 = { "$": 1, "succ": {} }, _1 = { "$": 0, "succ": { "city": _0 } };
    const exceptions = { "$": 0, "succ": { "ck": { "$": 0, "succ": { "www": _0 } }, "jp": { "$": 0, "succ": { "kawasaki": _1, "kitakyushu": _1, "kobe": _1, "nagoya": _1, "sapporo": _1, "sendai": _1, "yokohama": _1 } } } };
    return exceptions;
})();
const rules = (function () {
    const _2 = { "$": 1, "succ": {} }, _3 = { "$": 2, "succ": {} }, _4 = { "$": 1, "succ": { "gov": _2, "com": _2, "org": _2, "net": _2, "edu": _2 } }, _5 = { "$": 0, "succ": { "*": _3 } }, _6 = { "$": 1, "succ": { "blogspot": _3 } }, _7 = { "$": 1, "succ": { "gov": _2 } }, _8 = { "$": 0, "succ": { "*": _2 } }, _9 = { "$": 0, "succ": { "cloud": _3 } }, _10 = { "$": 1, "succ": { "co": _3 } }, _11 = { "$": 2, "succ": { "nodes": _3 } }, _12 = { "$": 0, "succ": { "s3": _3 } }, _13 = { "$": 0, "succ": { "direct": _3 } }, _14 = { "$": 2, "succ": { "id": _3 } }, _15 = { "$": 0, "succ": { "vfs": _3, "webview-assets": _3 } }, _16 = { "$": 0, "succ": { "cloud9": _15 } }, _17 = { "$": 0, "succ": { "dualstack": _12, "cloud9": _15 } }, _18 = { "$": 0, "succ": { "dualstack": _12, "s3": _3, "s3-website": _3, "cloud9": _15 } }, _19 = { "$": 0, "succ": { "apps": _3 } }, _20 = { "$": 0, "succ": { "paas": _3 } }, _21 = { "$": 0, "succ": { "app": _3 } }, _22 = { "$": 2, "succ": { "eu": _3 } }, _23 = { "$": 0, "succ": { "site": _3 } }, _24 = { "$": 0, "succ": { "pages": _3 } }, _25 = { "$": 1, "succ": { "com": _2, "edu": _2, "net": _2, "org": _2 } }, _26 = { "$": 0, "succ": { "j": _3 } }, _27 = { "$": 0, "succ": { "jelastic": _3 } }, _28 = { "$": 0, "succ": { "user": _3 } }, _29 = { "$": 1, "succ": { "ybo": _3 } }, _30 = { "$": 0, "succ": { "cust": _3, "reservd": _3 } }, _31 = { "$": 0, "succ": { "cust": _3 } }, _32 = { "$": 1, "succ": { "gov": _2, "edu": _2, "mil": _2, "com": _2, "org": _2, "net": _2 } }, _33 = { "$": 1, "succ": { "edu": _2, "biz": _2, "net": _2, "org": _2, "gov": _2, "info": _2, "com": _2 } }, _34 = { "$": 1, "succ": { "gov": _2, "blogspot": _3 } }, _35 = { "$": 1, "succ": { "framer": _3 } }, _36 = { "$": 1, "succ": { "barsy": _3 } }, _37 = { "$": 0, "succ": { "forgot": _3 } }, _38 = { "$": 1, "succ": { "gs": _2 } }, _39 = { "$": 0, "succ": { "nes": _2 } }, _40 = { "$": 1, "succ": { "k12": _2, "cc": _2, "lib": _2 } }, _41 = { "$": 1, "succ": { "cc": _2, "lib": _2 } };
    const rules = { "$": 0, "succ": { "ac": { "$": 1, "succ": { "com": _2, "edu": _2, "gov": _2, "net": _2, "mil": _2, "org": _2, "drr": _3 } }, "ad": { "$": 1, "succ": { "nom": _2 } }, "ae": { "$": 1, "succ": { "co": _2, "net": _2, "org": _2, "sch": _2, "ac": _2, "gov": _2, "mil": _2, "blogspot": _3 } }, "aero": { "$": 1, "succ": { "accident-investigation": _2, "accident-prevention": _2, "aerobatic": _2, "aeroclub": _2, "aerodrome": _2, "agents": _2, "aircraft": _2, "airline": _2, "airport": _2, "air-surveillance": _2, "airtraffic": _2, "air-traffic-control": _2, "ambulance": _2, "amusement": _2, "association": _2, "author": _2, "ballooning": _2, "broker": _2, "caa": _2, "cargo": _2, "catering": _2, "certification": _2, "championship": _2, "charter": _2, "civilaviation": _2, "club": _2, "conference": _2, "consultant": _2, "consulting": _2, "control": _2, "council": _2, "crew": _2, "design": _2, "dgca": _2, "educator": _2, "emergency": _2, "engine": _2, "engineer": _2, "entertainment": _2, "equipment": _2, "exchange": _2, "express": _2, "federation": _2, "flight": _2, "fuel": _2, "gliding": _2, "government": _2, "groundhandling": _2, "group": _2, "hanggliding": _2, "homebuilt": _2, "insurance": _2, "journal": _2, "journalist": _2, "leasing": _2, "logistics": _2, "magazine": _2, "maintenance": _2, "media": _2, "microlight": _2, "modelling": _2, "navigation": _2, "parachuting": _2, "paragliding": _2, "passenger-association": _2, "pilot": _2, "press": _2, "production": _2, "recreation": _2, "repbody": _2, "res": _2, "research": _2, "rotorcraft": _2, "safety": _2, "scientist": _2, "services": _2, "show": _2, "skydiving": _2, "software": _2, "student": _2, "trader": _2, "trading": _2, "trainer": _2, "union": _2, "workinggroup": _2, "works": _2 } }, "af": _4, "ag": { "$": 1, "succ": { "com": _2, "org": _2, "net": _2, "co": _2, "nom": _2 } }, "ai": { "$": 1, "succ": { "off": _2, "com": _2, "net": _2, "org": _2, "uwu": _3 } }, "al": { "$": 1, "succ": { "com": _2, "edu": _2, "gov": _2, "mil": _2, "net": _2, "org": _2, "blogspot": _3 } }, "am": { "$": 1, "succ": { "co": _2, "com": _2, "commune": _2, "net": _2, "org": _2, "radio": _3, "blogspot": _3, "neko": _3, "nyaa": _3 } }, "ao": { "$": 1, "succ": { "ed": _2, "gv": _2, "og": _2, "co": _2, "pb": _2, "it": _2 } }, "aq": _2, "ar": { "$": 1, "succ": { "bet": _2, "com": _6, "coop": _2, "edu": _2, "gob": _2, "gov": _2, "int": _2, "mil": _2, "musica": _2, "mutual": _2, "net": _2, "org": _2, "senasa": _2, "tur": _2 } }, "arpa": { "$": 1, "succ": { "e164": _2, "in-addr": _2, "ip6": _2, "iris": _2, "uri": _2, "urn": _2 } }, "as": _7, "asia": { "$": 1, "succ": { "cloudns": _3 } }, "at": { "$": 1, "succ": { "ac": { "$": 1, "succ": { "sth": _2 } }, "co": _6, "gv": _2, "or": _2, "funkfeuer": { "$": 0, "succ": { "wien": _3 } }, "futurecms": { "$": 0, "succ": { "*": _3, "ex": _5, "in": _5 } }, "futurehosting": _3, "futuremailing": _3, "ortsinfo": { "$": 0, "succ": { "ex": _5, "kunden": _5 } }, "biz": _3, "info": _3, "123webseite": _3, "priv": _3, "myspreadshop": _3, "12hp": _3, "2ix": _3, "4lima": _3, "lima-city": _3 } }, "au": { "$": 1, "succ": { "com": { "$": 1, "succ": { "blogspot": _3, "cloudlets": { "$": 0, "succ": { "mel": _3 } }, "myspreadshop": _3 } }, "net": _2, "org": _2, "edu": { "$": 1, "succ": { "act": _2, "catholic": _2, "nsw": { "$": 1, "succ": { "schools": _2 } }, "nt": _2, "qld": _2, "sa": _2, "tas": _2, "vic": _2, "wa": _2 } }, "gov": { "$": 1, "succ": { "qld": _2, "sa": _2, "tas": _2, "vic": _2, "wa": _2 } }, "asn": _2, "id": _2, "info": _2, "conf": _2, "oz": _2, "act": _2, "nsw": _2, "nt": _2, "qld": _2, "sa": _2, "tas": _2, "vic": _2, "wa": _2 } }, "aw": { "$": 1, "succ": { "com": _2 } }, "ax": { "$": 1, "succ": { "be": _3, "cat": _3, "es": _3, "eu": _3, "gg": _3, "mc": _3, "us": _3, "xy": _3 } }, "az": { "$": 1, "succ": { "com": _2, "net": _2, "int": _2, "gov": _2, "org": _2, "edu": _2, "info": _2, "pp": _2, "mil": _2, "name": _2, "pro": _2, "biz": _2 } }, "ba": { "$": 1, "succ": { "com": _2, "edu": _2, "gov": _2, "mil": _2, "net": _2, "org": _2, "rs": _3, "blogspot": _3 } }, "bb": { "$": 1, "succ": { "biz": _2, "co": _2, "com": _2, "edu": _2, "gov": _2, "info": _2, "net": _2, "org": _2, "store": _2, "tv": _2 } }, "bd": _8, "be": { "$": 1, "succ": { "ac": _2, "webhosting": _3, "blogspot": _3, "interhostsolutions": _9, "kuleuven": { "$": 0, "succ": { "ezproxy": _3 } }, "123website": _3, "myspreadshop": _3, "transurl": _5 } }, "bf": _7, "bg": { "$": 1, "succ": { "0": _2, "1": _2, "2": _2, "3": _2, "4": _2, "5": _2, "6": _2, "7": _2, "8": _2, "9": _2, "a": _2, "b": _2, "c": _2, "d": _2, "e": _2, "f": _2, "g": _2, "h": _2, "i": _2, "j": _2, "k": _2, "l": _2, "m": _2, "n": _2, "o": _2, "p": _2, "q": _2, "r": _2, "s": _2, "t": _2, "u": _2, "v": _2, "w": _2, "x": _2, "y": _2, "z": _2, "blogspot": _3, "barsy": _3 } }, "bh": _4, "bi": { "$": 1, "succ": { "co": _2, "com": _2, "edu": _2, "or": _2, "org": _2 } }, "biz": { "$": 1, "succ": { "activetrail": _3, "cloudns": _3, "jozi": _3, "dyndns": _3, "for-better": _3, "for-more": _3, "for-some": _3, "for-the": _3, "selfip": _3, "webhop": _3, "orx": _3, "mmafan": _3, "myftp": _3, "no-ip": _3, "dscloud": _3 } }, "bj": { "$": 1, "succ": { "africa": _2, "agro": _2, "architectes": _2, "assur": _2, "avocats": _2, "co": _2, "com": _2, "eco": _2, "econo": _2, "edu": _2, "info": _2, "loisirs": _2, "money": _2, "net": _2, "org": _2, "ote": _2, "resto": _2, "restaurant": _2, "tourism": _2, "univ": _2, "blogspot": _3 } }, "bm": _4, "bn": { "$": 1, "succ": { "com": _2, "edu": _2, "gov": _2, "net": _2, "org": _2, "co": _3 } }, "bo": { "$": 1, "succ": { "com": _2, "edu": _2, "gob": _2, "int": _2, "org": _2, "net": _2, "mil": _2, "tv": _2, "web": _2, "academia": _2, "agro": _2, "arte": _2, "blog": _2, "bolivia": _2, "ciencia": _2, "cooperativa": _2, "democracia": _2, "deporte": _2, "ecologia": _2, "economia": _2, "empresa": _2, "indigena": _2, "industria": _2, "info": _2, "medicina": _2, "movimiento": _2, "musica": _2, "natural": _2, "nombre": _2, "noticias": _2, "patria": _2, "politica": _2, "profesional": _2, "plurinacional": _2, "pueblo": _2, "revista": _2, "salud": _2, "tecnologia": _2, "tksat": _2, "transporte": _2, "wiki": _2 } }, "br": { "$": 1, "succ": { "9guacu": _2, "abc": _2, "adm": _2, "adv": _2, "agr": _2, "aju": _2, "am": _2, "anani": _2, "aparecida": _2, "app": _2, "arq": _2, "art": _2, "ato": _2, "b": _2, "barueri": _2, "belem": _2, "bhz": _2, "bib": _2, "bio": _2, "blog": _2, "bmd": _2, "boavista": _2, "bsb": _2, "campinagrande": _2, "campinas": _2, "caxias": _2, "cim": _2, "cng": _2, "cnt": _2, "com": { "$": 1, "succ": { "blogspot": _3, "virtualcloud": { "$": 0, "succ": { "scale": { "$": 0, "succ": { "users": _3 } } } }, "simplesite": _3 } }, "contagem": _2, "coop": _2, "coz": _2, "cri": _2, "cuiaba": _2, "curitiba": _2, "def": _2, "des": _2, "det": _2, "dev": _2, "ecn": _2, "eco": _2, "edu": _2, "emp": _2, "enf": _2, "eng": _2, "esp": _2, "etc": _2, "eti": _2, "far": _2, "feira": _2, "flog": _2, "floripa": _2, "fm": _2, "fnd": _2, "fortal": _2, "fot": _2, "foz": _2, "fst": _2, "g12": _2, "geo": _2, "ggf": _2, "goiania": _2, "gov": { "$": 1, "succ": { "ac": _2, "al": _2, "am": _2, "ap": _2, "ba": _2, "ce": _2, "df": _2, "es": _2, "go": _2, "ma": _2, "mg": _2, "ms": _2, "mt": _2, "pa": _2, "pb": _2, "pe": _2, "pi": _2, "pr": _2, "rj": _2, "rn": _2, "ro": _2, "rr": _2, "rs": _2, "sc": _2, "se": _2, "sp": _2, "to": _2 } }, "gru": _2, "imb": _2, "ind": _2, "inf": _2, "jab": _2, "jampa": _2, "jdf": _2, "joinville": _2, "jor": _2, "jus": _2, "leg": { "$": 1, "succ": { "ac": _3, "al": _3, "am": _3, "ap": _3, "ba": _3, "ce": _3, "df": _3, "es": _3, "go": _3, "ma": _3, "mg": _3, "ms": _3, "mt": _3, "pa": _3, "pb": _3, "pe": _3, "pi": _3, "pr": _3, "rj": _3, "rn": _3, "ro": _3, "rr": _3, "rs": _3, "sc": _3, "se": _3, "sp": _3, "to": _3 } }, "lel": _2, "log": _2, "londrina": _2, "macapa": _2, "maceio": _2, "manaus": _2, "maringa": _2, "mat": _2, "med": _2, "mil": _2, "morena": _2, "mp": _2, "mus": _2, "natal": _2, "net": _2, "niteroi": _2, "nom": _8, "not": _2, "ntr": _2, "odo": _2, "ong": _2, "org": _2, "osasco": _2, "palmas": _2, "poa": _2, "ppg": _2, "pro": _2, "psc": _2, "psi": _2, "pvh": _2, "qsl": _2, "radio": _2, "rec": _2, "recife": _2, "rep": _2, "ribeirao": _2, "rio": _2, "riobranco": _2, "riopreto": _2, "salvador": _2, "sampa": _2, "santamaria": _2, "santoandre": _2, "saobernardo": _2, "saogonca": _2, "seg": _2, "sjc": _2, "slg": _2, "slz": _2, "sorocaba": _2, "srv": _2, "taxi": _2, "tc": _2, "tec": _2, "teo": _2, "the": _2, "tmp": _2, "trd": _2, "tur": _2, "tv": _2, "udi": _2, "vet": _2, "vix": _2, "vlog": _2, "wiki": _2, "zlg": _2 } }, "bs": { "$": 1, "succ": { "com": _2, "net": _2, "org": _2, "edu": _2, "gov": _2, "we": _3 } }, "bt": _4, "bv": _2, "bw": { "$": 1, "succ": { "co": _2, "org": _2 } }, "by": { "$": 1, "succ": { "gov": _2, "mil": _2, "com": _6, "of": _2, "mycloud": _3, "mediatech": _3 } }, "bz": { "$": 1, "succ": { "com": _2, "net": _2, "org": _2, "edu": _2, "gov": _2, "za": _3, "gsj": _3 } }, "ca": { "$": 1, "succ": { "ab": _2, "bc": _2, "mb": _2, "nb": _2, "nf": _2, "nl": _2, "ns": _2, "nt": _2, "nu": _2, "on": _2, "pe": _2, "qc": _2, "sk": _2, "yk": _2, "gc": _2, "barsy": _3, "awdev": _5, "co": _3, "blogspot": _3, "no-ip": _3, "myspreadshop": _3 } }, "cat": _2, "cc": { "$": 1, "succ": { "cloudns": _3, "ftpaccess": _3, "game-server": _3, "myphotos": _3, "scrapping": _3, "twmail": _3, "csx": _3, "fantasyleague": _3, "spawn": { "$": 0, "succ": { "instances": _3 } } } }, "cd": _7, "cf": _6, "cg": _2, "ch": { "$": 1, "succ": { "square7": _3, "blogspot": _3, "flow": { "$": 0, "succ": { "ae": { "$": 0, "succ": { "alp1": _3 } }, "appengine": _3 } }, "linkyard-cloud": _3, "dnsking": _3, "gotdns": _3, "123website": _3, "myspreadshop": _3, "firenet": { "$": 0, "succ": { "*": _3, "svc": _5 } }, "12hp": _3, "2ix": _3, "4lima": _3, "lima-city": _3 } }, "ci": { "$": 1, "succ": { "org": _2, "or": _2, "com": _2, "co": _2, "edu": _2, "ed": _2, "ac": _2, "net": _2, "go": _2, "asso": _2, "xn--aroport-bya": _2, "aéroport": _2, "int": _2, "presse": _2, "md": _2, "gouv": _2, "fin": _3, "nl": _3 } }, "ck": _8, "cl": { "$": 1, "succ": { "co": _2, "gob": _2, "gov": _2, "mil": _2, "blogspot": _3 } }, "cm": { "$": 1, "succ": { "co": _2, "com": _2, "gov": _2, "net": _2 } }, "cn": { "$": 1, "succ": { "ac": _2, "com": { "$": 1, "succ": { "amazonaws": { "$": 0, "succ": { "compute": _5, "cn-north-1": _12, "eb": { "$": 0, "succ": { "cn-north-1": _3, "cn-northwest-1": _3 } }, "elb": _5 } } } }, "edu": _2, "gov": _2, "net": _2, "org": _2, "mil": _2, "xn--55qx5d": _2, "公司": _2, "xn--io0a7i": _2, "网络": _2, "xn--od0alg": _2, "網絡": _2, "ah": _2, "bj": _2, "cq": _2, "fj": _2, "gd": _2, "gs": _2, "gz": _2, "gx": _2, "ha": _2, "hb": _2, "he": _2, "hi": _2, "hl": _2, "hn": _2, "jl": _2, "js": _2, "jx": _2, "ln": _2, "nm": _2, "nx": _2, "qh": _2, "sc": _2, "sd": _2, "sh": _2, "sn": _2, "sx": _2, "tj": _2, "xj": _2, "xz": _2, "yn": _2, "zj": _2, "hk": _2, "mo": _2, "tw": _2, "canva-apps": _3, "instantcloud": _3, "quickconnect": _13 } }, "co": { "$": 1, "succ": { "arts": _2, "com": _6, "edu": _2, "firm": _2, "gov": _2, "info": _2, "int": _2, "mil": _2, "net": _2, "nom": _2, "org": _2, "rec": _2, "web": _2, "carrd": _3, "crd": _3, "otap": _5, "leadpages": _3, "lpages": _3, "mypi": _3, "n4t": _3, "firewalledreplit": _14, "repl": _14, "supabase": _3 } }, "com": { "$": 1, "succ": { "devcdnaccesso": _5, "adobeaemcloud": { "$": 2, "succ": { "dev": _5 } }, "airkitapps": _3, "airkitapps-au": _3, "aivencloud": _3, "kasserver": _3, "amazonaws": { "$": 0, "succ": { "compute": _5, "compute-1": _5, "us-east-1": { "$": 2, "succ": { "dualstack": _12, "cloud9": _15 } }, "ap-northeast-1": _17, "ap-northeast-2": _18, "ap-south-1": _18, "ap-southeast-1": _17, "ap-southeast-2": _17, "ca-central-1": _18, "eu-central-1": _18, "eu-west-1": _17, "eu-west-2": _18, "eu-west-3": _18, "s3": _3, "s3-ap-northeast-1": _3, "s3-ap-northeast-2": _3, "s3-ap-south-1": _3, "s3-ap-southeast-1": _3, "s3-ap-southeast-2": _3, "s3-ca-central-1": _3, "s3-eu-central-1": _3, "s3-eu-west-1": _3, "s3-eu-west-2": _3, "s3-eu-west-3": _3, "s3-external-1": _3, "s3-fips-us-gov-west-1": _3, "s3-sa-east-1": _3, "s3-us-east-2": _3, "s3-us-gov-west-1": _3, "s3-us-west-1": _3, "s3-us-west-2": _3, "s3-website-ap-northeast-1": _3, "s3-website-ap-southeast-1": _3, "s3-website-ap-southeast-2": _3, "s3-website-eu-west-1": _3, "s3-website-sa-east-1": _3, "s3-website-us-east-1": _3, "s3-website-us-west-1": _3, "s3-website-us-west-2": _3, "sa-east-1": _17, "us-east-2": _18, "af-south-1": _16, "ap-east-1": _16, "ap-northeast-3": _16, "eu-north-1": _16, "eu-south-1": _16, "me-south-1": _16, "us-west-1": _16, "us-west-2": _16, "elb": _5 } }, "elasticbeanstalk": { "$": 2, "succ": { "ap-northeast-1": _3, "ap-northeast-2": _3, "ap-northeast-3": _3, "ap-south-1": _3, "ap-southeast-1": _3, "ap-southeast-2": _3, "ca-central-1": _3, "eu-central-1": _3, "eu-west-1": _3, "eu-west-2": _3, "eu-west-3": _3, "sa-east-1": _3, "us-east-1": _3, "us-east-2": _3, "us-gov-west-1": _3, "us-west-1": _3, "us-west-2": _3 } }, "awsglobalaccelerator": _3, "siiites": _3, "appspacehosted": _3, "appspaceusercontent": _3, "on-aptible": _3, "myasustor": _3, "balena-devices": _3, "betainabox": _3, "boutir": _3, "bplaced": _3, "cafjs": _3, "canva-apps": _3, "br": _3, "cn": _3, "de": _3, "eu": _3, "jpn": _3, "mex": _3, "ru": _3, "sa": _3, "uk": _3, "us": _3, "za": _3, "ar": _3, "hu": _3, "kr": _3, "no": _3, "qc": _3, "uy": _3, "africa": _3, "gr": _3, "co": _3, "jdevcloud": _3, "wpdevcloud": _3, "cloudcontrolled": _3, "cloudcontrolapp": _3, "cf-ipfs": _3, "cloudflare-ipfs": _3, "trycloudflare": _3, "customer-oci": { "$": 0, "succ": { "*": _3, "oci": _5, "ocp": _5, "ocs": _5 } }, "dattolocal": _3, "dattorelay": _3, "dattoweb": _3, "mydatto": _3, "builtwithdark": _3, "datadetect": { "$": 0, "succ": { "demo": _3, "instance": _3 } }, "ddns5": _3, "discordsays": _3, "discordsez": _3, "drayddns": _3, "dreamhosters": _3, "mydrobo": _3, "dyndns-at-home": _3, "dyndns-at-work": _3, "dyndns-blog": _3, "dyndns-free": _3, "dyndns-home": _3, "dyndns-ip": _3, "dyndns-mail": _3, "dyndns-office": _3, "dyndns-pics": _3, "dyndns-remote": _3, "dyndns-server": _3, "dyndns-web": _3, "dyndns-wiki": _3, "dyndns-work": _3, "blogdns": _3, "cechire": _3, "dnsalias": _3, "dnsdojo": _3, "doesntexist": _3, "dontexist": _3, "doomdns": _3, "dyn-o-saur": _3, "dynalias": _3, "est-a-la-maison": _3, "est-a-la-masion": _3, "est-le-patron": _3, "est-mon-blogueur": _3, "from-ak": _3, "from-al": _3, "from-ar": _3, "from-ca": _3, "from-ct": _3, "from-dc": _3, "from-de": _3, "from-fl": _3, "from-ga": _3, "from-hi": _3, "from-ia": _3, "from-id": _3, "from-il": _3, "from-in": _3, "from-ks": _3, "from-ky": _3, "from-ma": _3, "from-md": _3, "from-mi": _3, "from-mn": _3, "from-mo": _3, "from-ms": _3, "from-mt": _3, "from-nc": _3, "from-nd": _3, "from-ne": _3, "from-nh": _3, "from-nj": _3, "from-nm": _3, "from-nv": _3, "from-oh": _3, "from-ok": _3, "from-or": _3, "from-pa": _3, "from-pr": _3, "from-ri": _3, "from-sc": _3, "from-sd": _3, "from-tn": _3, "from-tx": _3, "from-ut": _3, "from-va": _3, "from-vt": _3, "from-wa": _3, "from-wi": _3, "from-wv": _3, "from-wy": _3, "getmyip": _3, "gotdns": _3, "hobby-site": _3, "homelinux": _3, "homeunix": _3, "iamallama": _3, "is-a-anarchist": _3, "is-a-blogger": _3, "is-a-bookkeeper": _3, "is-a-bulls-fan": _3, "is-a-caterer": _3, "is-a-chef": _3, "is-a-conservative": _3, "is-a-cpa": _3, "is-a-cubicle-slave": _3, "is-a-democrat": _3, "is-a-designer": _3, "is-a-doctor": _3, "is-a-financialadvisor": _3, "is-a-geek": _3, "is-a-green": _3, "is-a-guru": _3, "is-a-hard-worker": _3, "is-a-hunter": _3, "is-a-landscaper": _3, "is-a-lawyer": _3, "is-a-liberal": _3, "is-a-libertarian": _3, "is-a-llama": _3, "is-a-musician": _3, "is-a-nascarfan": _3, "is-a-nurse": _3, "is-a-painter": _3, "is-a-personaltrainer": _3, "is-a-photographer": _3, "is-a-player": _3, "is-a-republican": _3, "is-a-rockstar": _3, "is-a-socialist": _3, "is-a-student": _3, "is-a-teacher": _3, "is-a-techie": _3, "is-a-therapist": _3, "is-an-accountant": _3, "is-an-actor": _3, "is-an-actress": _3, "is-an-anarchist": _3, "is-an-artist": _3, "is-an-engineer": _3, "is-an-entertainer": _3, "is-certified": _3, "is-gone": _3, "is-into-anime": _3, "is-into-cars": _3, "is-into-cartoons": _3, "is-into-games": _3, "is-leet": _3, "is-not-certified": _3, "is-slick": _3, "is-uberleet": _3, "is-with-theband": _3, "isa-geek": _3, "isa-hockeynut": _3, "issmarterthanyou": _3, "likes-pie": _3, "likescandy": _3, "neat-url": _3, "saves-the-whales": _3, "selfip": _3, "sells-for-less": _3, "sells-for-u": _3, "servebbs": _3, "simple-url": _3, "space-to-rent": _3, "teaches-yoga": _3, "writesthisblog": _3, "digitaloceanspaces": _5, "ddnsfree": _3, "ddnsgeek": _3, "giize": _3, "gleeze": _3, "kozow": _3, "loseyourip": _3, "ooguy": _3, "theworkpc": _3, "mytuleap": _3, "tuleap-partners": _3, "encoreapi": _3, "evennode": { "$": 0, "succ": { "eu-1": _3, "eu-2": _3, "eu-3": _3, "eu-4": _3, "us-1": _3, "us-2": _3, "us-3": _3, "us-4": _3 } }, "onfabrica": _3, "fbsbx": _19, "fastly-edge": _3, "fastly-terrarium": _3, "fastvps-server": _3, "mydobiss": _3, "firebaseapp": _3, "fldrv": _3, "forgeblocks": _3, "framercanvas": _3, "freebox-os": _3, "freeboxos": _3, "freemyip": _3, "gentapps": _3, "gentlentapis": _3, "githubusercontent": _3, "0emm": _5, "appspot": { "$": 2, "succ": { "r": _5 } }, "codespot": _3, "googleapis": _3, "googlecode": _3, "pagespeedmobilizer": _3, "publishproxy": _3, "withgoogle": _3, "withyoutube": _3, "blogspot": _3, "awsmppl": _3, "herokuapp": _3, "herokussl": _3, "impertrixcdn": _3, "impertrix": _3, "smushcdn": _3, "wphostedmail": _3, "wpmucdn": _3, "pixolino": _3, "amscompute": _3, "clicketcloud": _3, "dopaas": _3, "hidora": _3, "hosted-by-previder": _20, "hosteur": { "$": 0, "succ": { "rag-cloud": _3, "rag-cloud-ch": _3 } }, "ik-server": { "$": 0, "succ": { "jcloud": _3, "jcloud-ver-jpc": _3 } }, "jelastic": { "$": 0, "succ": { "demo": _3 } }, "kilatiron": _3, "massivegrid": _20, "wafaicloud": { "$": 0, "succ": { "jed": _3, "lon": _3, "ryd": _3 } }, "joyent": { "$": 0, "succ": { "cns": _5 } }, "ktistory": _3, "lpusercontent": _3, "lmpm": _21, "linode": { "$": 0, "succ": { "members": _3, "nodebalancer": _5 } }, "linodeobjects": _5, "linodeusercontent": { "$": 0, "succ": { "ip": _3 } }, "barsycenter": _3, "barsyonline": _3, "mazeplay": _3, "miniserver": _3, "meteorapp": _22, "hostedpi": _3, "mythic-beasts": { "$": 0, "succ": { "customer": _3, "caracal": _3, "fentiger": _3, "lynx": _3, "ocelot": _3, "oncilla": _3, "onza": _3, "sphinx": _3, "vs": _3, "x": _3, "yali": _3 } }, "nospamproxy": _9, "4u": _3, "nfshost": _3, "001www": _3, "ddnslive": _3, "myiphost": _3, "blogsyte": _3, "ciscofreak": _3, "damnserver": _3, "ditchyourip": _3, "dnsiskinky": _3, "dynns": _3, "geekgalaxy": _3, "health-carereform": _3, "homesecuritymac": _3, "homesecuritypc": _3, "myactivedirectory": _3, "mysecuritycamera": _3, "net-freaks": _3, "onthewifi": _3, "point2this": _3, "quicksytes": _3, "securitytactics": _3, "serveexchange": _3, "servehumour": _3, "servep2p": _3, "servesarcasm": _3, "stufftoread": _3, "unusualperson": _3, "workisboring": _3, "3utilities": _3, "ddnsking": _3, "myvnc": _3, "servebeer": _3, "servecounterstrike": _3, "serveftp": _3, "servegame": _3, "servehalflife": _3, "servehttp": _3, "serveirc": _3, "servemp3": _3, "servepics": _3, "servequake": _3, "observableusercontent": { "$": 0, "succ": { "static": _3 } }, "simplesite": _3, "orsites": _3, "operaunite": _3, "authgear-staging": _3, "authgearapps": _3, "skygearapp": _3, "outsystemscloud": _3, "ownprovider": _3, "pgfog": _3, "pagefrontapp": _3, "pagexl": _3, "paywhirl": _5, "gotpantheon": _3, "platter-app": _3, "pleskns": _3, "postman-echo": _3, "prgmr": { "$": 0, "succ": { "xen": _3 } }, "pythonanywhere": _22, "qualifioapp": _3, "qbuser": _3, "qa2": _3, "dev-myqnapcloud": _3, "alpha-myqnapcloud": _3, "myqnapcloud": _3, "quipelements": _5, "rackmaze": _3, "rhcloud": _3, "render": _21, "onrender": _3, "180r": _3, "dojin": _3, "sakuratan": _3, "sakuraweb": _3, "x0": _3, "code": { "$": 0, "succ": { "builder": _5, "dev-builder": _5, "stg-builder": _5 } }, "logoip": _3, "scrysec": _3, "firewall-gateway": _3, "myshopblocks": _3, "myshopify": _3, "shopitsite": _3, "1kapp": _3, "appchizi": _3, "applinzi": _3, "sinaapp": _3, "vipsinaapp": _3, "bounty-full": { "$": 2, "succ": { "alpha": _3, "beta": _3 } }, "streamlitapp": _3, "try-snowplow": _3, "stackhero-network": _3, "playstation-cloud": _3, "myspreadshop": _3, "stdlib": { "$": 0, "succ": { "api": _3 } }, "temp-dns": _3, "dsmynas": _3, "familyds": _3, "mytabit": _3, "tb-hosting": _23, "reservd": _3, "thingdustdata": _3, "bloxcms": _3, "townnews-staging": _3, "typeform": { "$": 0, "succ": { "pro": _3 } }, "hk": _3, "it": _3, "vultrobjects": _5, "wafflecell": _3, "reserve-online": _3, "hotelwithflight": _3, "remotewd": _3, "wiardweb": _24, "messwithdns": _3, "woltlab-demo": _3, "wpenginepowered": { "$": 2, "succ": { "js": _3 } }, "wixsite": _3, "xnbay": { "$": 2, "succ": { "u2": _3, "u2-local": _3 } }, "yolasite": _3 } }, "coop": _2, "cr": { "$": 1, "succ": { "ac": _2, "co": _2, "ed": _2, "fi": _2, "go": _2, "or": _2, "sa": _2 } }, "cu": { "$": 1, "succ": { "com": _2, "edu": _2, "org": _2, "net": _2, "gov": _2, "inf": _2 } }, "cv": { "$": 1, "succ": { "com": _2, "edu": _2, "int": _2, "nome": _2, "org": _2, "blogspot": _3 } }, "cw": _25, "cx": { "$": 1, "succ": { "gov": _2, "ath": _3, "info": _3 } }, "cy": { "$": 1, "succ": { "ac": _2, "biz": _2, "com": { "$": 1, "succ": { "blogspot": _3, "scaleforce": _26 } }, "ekloges": _2, "gov": _2, "ltd": _2, "mil": _2, "net": _2, "org": _2, "press": _2, "pro": _2, "tm": _2 } }, "cz": { "$": 1, "succ": { "co": _3, "realm": _3, "e4": _3, "blogspot": _3, "metacentrum": { "$": 0, "succ": { "cloud": _5, "custom": _3 } }, "muni": { "$": 0, "succ": { "cloud": { "$": 0, "succ": { "flt": _3, "usr": _3 } } } } } }, "de": { "$": 1, "succ": { "bplaced": _3, "square7": _3, "com": _3, "cosidns": { "$": 0, "succ": { "dyn": _3 } }, "dynamisches-dns": _3, "dnsupdater": _3, "internet-dns": _3, "l-o-g-i-n": _3, "dnshome": _3, "fuettertdasnetz": _3, "isteingeek": _3, "istmein": _3, "lebtimnetz": _3, "leitungsen": _3, "traeumtgerade": _3, "ddnss": { "$": 2, "succ": { "dyn": _3, "dyndns": _3 } }, "dyndns1": _3, "dyn-ip24": _3, "home-webserver": { "$": 2, "succ": { "dyn": _3 } }, "myhome-server": _3, "frusky": _5, "goip": _3, "blogspot": _3, "xn--gnstigbestellen-zvb": _3, "günstigbestellen": _3, "xn--gnstigliefern-wob": _3, "günstigliefern": _3, "hs-heilbronn": { "$": 0, "succ": { "it": _24 } }, "dyn-berlin": _3, "in-berlin": _3, "in-brb": _3, "in-butter": _3, "in-dsl": _3, "in-vpn": _3, "iservschule": _3, "mein-iserv": _3, "schulplattform": _3, "schulserver": _3, "test-iserv": _3, "keymachine": _3, "git-repos": _3, "lcube-server": _3, "svn-repos": _3, "barsy": _3, "123webseite": _3, "logoip": _3, "firewall-gateway": _3, "my-gateway": _3, "my-router": _3, "spdns": _3, "speedpartner": { "$": 0, "succ": { "customer": _3 } }, "myspreadshop": _3, "taifun-dns": _3, "12hp": _3, "2ix": _3, "4lima": _3, "lima-city": _3, "dd-dns": _3, "dray-dns": _3, "draydns": _3, "dyn-vpn": _3, "dynvpn": _3, "mein-vigor": _3, "my-vigor": _3, "my-wan": _3, "syno-ds": _3, "synology-diskstation": _3, "synology-ds": _3, "uberspace": _5, "virtualuser": _3, "virtual-user": _3, "community-pro": _3, "diskussionsbereich": _3 } }, "dj": _2, "dk": { "$": 1, "succ": { "biz": _3, "co": _3, "firm": _3, "reg": _3, "store": _3, "blogspot": _3, "123hjemmeside": _3, "myspreadshop": _3 } }, "dm": _4, "do": { "$": 1, "succ": { "art": _2, "com": _2, "edu": _2, "gob": _2, "gov": _2, "mil": _2, "net": _2, "org": _2, "sld": _2, "web": _2 } }, "dz": { "$": 1, "succ": { "art": _2, "asso": _2, "com": _2, "edu": _2, "gov": _2, "org": _2, "net": _2, "pol": _2, "soc": _2, "tm": _2 } }, "ec": { "$": 1, "succ": { "com": _2, "info": _2, "net": _2, "fin": _2, "k12": _2, "med": _2, "pro": _2, "org": _2, "edu": _2, "gov": _2, "gob": _2, "mil": _2, "base": _3, "official": _3 } }, "edu": { "$": 1, "succ": { "rit": { "$": 0, "succ": { "git-pages": _3 } } } }, "ee": { "$": 1, "succ": { "edu": _2, "gov": _2, "riik": _2, "lib": _2, "med": _2, "com": _6, "pri": _2, "aip": _2, "org": _2, "fie": _2 } }, "eg": { "$": 1, "succ": { "com": _6, "edu": _2, "eun": _2, "gov": _2, "mil": _2, "name": _2, "net": _2, "org": _2, "sci": _2 } }, "er": _8, "es": { "$": 1, "succ": { "com": _6, "nom": _2, "org": _2, "gob": _2, "edu": _2, "123miweb": _3, "myspreadshop": _3 } }, "et": { "$": 1, "succ": { "com": _2, "gov": _2, "org": _2, "edu": _2, "biz": _2, "name": _2, "info": _2, "net": _2 } }, "eu": { "$": 1, "succ": { "airkitapps": _3, "mycd": _3, "cloudns": _3, "dogado": _27, "barsy": _3, "wellbeingzone": _3, "spdns": _3, "transurl": _5, "diskstation": _3 } }, "fi": { "$": 1, "succ": { "aland": _2, "dy": _3, "blogspot": _3, "xn--hkkinen-5wa": _3, "häkkinen": _3, "iki": _3, "cloudplatform": { "$": 0, "succ": { "fi": _3 } }, "datacenter": { "$": 0, "succ": { "demo": _3, "paas": _3 } }, "kapsi": _3, "123kotisivu": _3, "myspreadshop": _3 } }, "fj": { "$": 1, "succ": { "ac": _2, "biz": _2, "com": _2, "gov": _2, "info": _2, "mil": _2, "name": _2, "net": _2, "org": _2, "pro": _2 } }, "fk": _8, "fm": { "$": 1, "succ": { "com": _2, "edu": _2, "net": _2, "org": _2, "radio": _3, "user": _5 } }, "fo": _2, "fr": { "$": 1, "succ": { "asso": _2, "com": _2, "gouv": _2, "nom": _2, "prd": _2, "tm": _2, "aeroport": _2, "avocat": _2, "avoues": _2, "cci": _2, "chambagri": _2, "chirurgiens-dentistes": _2, "experts-comptables": _2, "geometre-expert": _2, "greta": _2, "huissier-justice": _2, "medecin": _2, "notaires": _2, "pharmacien": _2, "port": _2, "veterinaire": _2, "en-root": _3, "fbx-os": _3, "fbxos": _3, "freebox-os": _3, "freeboxos": _3, "blogspot": _3, "goupile": _3, "123siteweb": _3, "on-web": _3, "chirurgiens-dentistes-en-france": _3, "dedibox": _3, "myspreadshop": _3, "ynh": _3 } }, "ga": _2, "gb": _2, "gd": { "$": 1, "succ": { "edu": _2, "gov": _2 } }, "ge": { "$": 1, "succ": { "com": _2, "edu": _2, "gov": _2, "org": _2, "mil": _2, "net": _2, "pvt": _2 } }, "gf": _2, "gg": { "$": 1, "succ": { "co": _2, "net": _2, "org": _2, "kaas": _3, "cya": _3, "panel": { "$": 2, "succ": { "daemon": _3 } } } }, "gh": { "$": 1, "succ": { "com": _2, "edu": _2, "gov": _2, "org": _2, "mil": _2 } }, "gi": { "$": 1, "succ": { "com": _2, "ltd": _2, "gov": _2, "mod": _2, "edu": _2, "org": _2 } }, "gl": { "$": 1, "succ": { "co": _2, "com": _2, "edu": _2, "net": _2, "org": _2, "biz": _3, "xx": _3 } }, "gm": _2, "gn": { "$": 1, "succ": { "ac": _2, "com": _2, "edu": _2, "gov": _2, "org": _2, "net": _2 } }, "gov": _2, "gp": { "$": 1, "succ": { "com": _2, "net": _2, "mobi": _2, "edu": _2, "org": _2, "asso": _2, "app": _3 } }, "gq": _2, "gr": { "$": 1, "succ": { "com": _2, "edu": _2, "net": _2, "org": _2, "gov": _2, "blogspot": _3, "simplesite": _3 } }, "gs": _2, "gt": { "$": 1, "succ": { "com": _2, "edu": _2, "gob": _2, "ind": _2, "mil": _2, "net": _2, "org": _2, "blog": _3, "de": _3, "to": _3 } }, "gu": { "$": 1, "succ": { "com": _2, "edu": _2, "gov": _2, "guam": _2, "info": _2, "net": _2, "org": _2, "web": _2 } }, "gw": _2, "gy": { "$": 1, "succ": { "co": _2, "com": _2, "edu": _2, "gov": _2, "net": _2, "org": _2, "be": _3 } }, "hk": { "$": 1, "succ": { "com": _2, "edu": _2, "gov": _2, "idv": _2, "net": _2, "org": _2, "xn--55qx5d": _2, "公司": _2, "xn--wcvs22d": _2, "教育": _2, "xn--lcvr32d": _2, "敎育": _2, "xn--mxtq1m": _2, "政府": _2, "xn--gmqw5a": _2, "個人": _2, "xn--ciqpn": _2, "个人": _2, "xn--gmq050i": _2, "箇人": _2, "xn--zf0avx": _2, "網络": _2, "xn--io0a7i": _2, "网络": _2, "xn--mk0axi": _2, "组織": _2, "xn--od0alg": _2, "網絡": _2, "xn--od0aq3b": _2, "网絡": _2, "xn--tn0ag": _2, "组织": _2, "xn--uc0atv": _2, "組織": _2, "xn--uc0ay4a": _2, "組织": _2, "blogspot": _3, "secaas": _3, "ltd": _3, "inc": _3 } }, "hm": _2, "hn": { "$": 1, "succ": { "com": _2, "edu": _2, "org": _2, "net": _2, "mil": _2, "gob": _2, "cc": _3 } }, "hr": { "$": 1, "succ": { "iz": _2, "from": _2, "name": _2, "com": _2, "blogspot": _3, "free": _3 } }, "ht": { "$": 1, "succ": { "com": _2, "shop": _2, "firm": _2, "info": _2, "adult": _2, "net": _2, "pro": _2, "org": _2, "med": _2, "art": _2, "coop": _2, "pol": _2, "asso": _2, "edu": _2, "rel": _2, "gouv": _2, "perso": _2 } }, "hu": { "$": 1, "succ": { "2000": _2, "co": _2, "info": _2, "org": _2, "priv": _2, "sport": _2, "tm": _2, "agrar": _2, "bolt": _2, "casino": _2, "city": _2, "erotica": _2, "erotika": _2, "film": _2, "forum": _2, "games": _2, "hotel": _2, "ingatlan": _2, "jogasz": _2, "konyvelo": _2, "lakas": _2, "media": _2, "news": _2, "reklam": _2, "sex": _2, "shop": _2, "suli": _2, "szex": _2, "tozsde": _2, "utazas": _2, "video": _2, "blogspot": _3 } }, "id": { "$": 1, "succ": { "ac": _2, "biz": _2, "co": _6, "desa": _2, "go": _2, "mil": _2, "my": { "$": 1, "succ": { "rss": _5 } }, "net": _2, "or": _2, "ponpes": _2, "sch": _2, "web": _2, "flap": _3, "forte": _3 } }, "ie": { "$": 1, "succ": { "gov": _2, "blogspot": _3, "myspreadshop": _3 } }, "il": { "$": 1, "succ": { "ac": _2, "co": { "$": 1, "succ": { "ravpage": _3, "blogspot": _3, "tabitorder": _3, "mytabit": _3 } }, "gov": _2, "idf": _2, "k12": _2, "muni": _2, "net": _2, "org": _2 } }, "xn--4dbrk0ce": { "$": 1, "succ": { "xn--4dbgdty6c": _2, "xn--5dbhl8d": _2, "xn--8dbq2a": _2, "xn--hebda8b": _2 } }, "ישראל": { "$": 1, "succ": { "אקדמיה": _2, "ישוב": _2, "צהל": _2, "ממשל": _2 } }, "im": { "$": 1, "succ": { "ac": _2, "co": { "$": 1, "succ": { "ltd": _2, "plc": _2 } }, "com": _2, "net": _2, "org": _2, "tt": _2, "tv": _2, "ro": _3 } }, "in": { "$": 1, "succ": { "5g": _2, "6g": _2, "ac": _2, "ai": _2, "am": _2, "bihar": _2, "biz": _2, "business": _2, "ca": _2, "cn": _2, "co": _2, "com": _2, "coop": _2, "cs": _2, "delhi": _2, "dr": _2, "edu": _2, "er": _2, "firm": _2, "gen": _2, "gov": _2, "gujarat": _2, "ind": _2, "info": _2, "int": _2, "internet": _2, "io": _2, "me": _2, "mil": _2, "net": _2, "nic": _2, "org": _2, "pg": _2, "post": _2, "pro": _2, "res": _2, "travel": _2, "tv": _2, "uk": _2, "up": _2, "us": _2, "web": _3, "cloudns": _3, "blogspot": _3, "barsy": _3, "supabase": _3 } }, "info": { "$": 1, "succ": { "cloudns": _3, "dynamic-dns": _3, "dyndns": _3, "barrel-of-knowledge": _3, "barrell-of-knowledge": _3, "for-our": _3, "groks-the": _3, "groks-this": _3, "here-for-more": _3, "knowsitall": _3, "selfip": _3, "webhop": _3, "barsy": _3, "mayfirst": _3, "forumz": _3, "nsupdate": _3, "dvrcam": _3, "ilovecollege": _3, "no-ip": _3, "dnsupdate": _3, "v-info": _3 } }, "int": { "$": 1, "succ": { "eu": _2 } }, "io": { "$": 1, "succ": { "2038": _3, "com": _2, "on-acorn": _5, "apigee": _3, "b-data": _3, "backplaneapp": _3, "banzaicloud": { "$": 0, "succ": { "app": _3, "backyards": _5 } }, "beagleboard": _3, "bitbucket": _3, "bluebite": _3, "boxfuse": _3, "browsersafetymark": _3, "bigv": { "$": 0, "succ": { "uk0": _3 } }, "cleverapps": _3, "dappnode": { "$": 0, "succ": { "dyndns": _3 } }, "dedyn": _3, "drud": _3, "definima": _3, "fh-muenster": _3, "shw": _3, "forgerock": { "$": 0, "succ": { "id": _3 } }, "ghost": _3, "github": _3, "gitlab": _3, "lolipop": _3, "hasura-app": _3, "hostyhosting": _3, "moonscale": _5, "beebyte": _20, "beebyteapp": { "$": 0, "succ": { "sekd1": _3 } }, "jele": _3, "unispace": { "$": 0, "succ": { "cloud-fr1": _3 } }, "webthings": _3, "loginline": _3, "barsy": _3, "azurecontainer": _5, "ngrok": { "$": 2, "succ": { "ap": _3, "au": _3, "eu": _3, "in": _3, "jp": _3, "sa": _3, "us": _3 } }, "nodeart": { "$": 0, "succ": { "stage": _3 } }, "nid": _3, "pantheonsite": _3, "dyn53": _3, "pstmn": { "$": 2, "succ": { "mock": _3 } }, "protonet": _3, "qoto": _3, "qcx": { "$": 2, "succ": { "sys": _5 } }, "vaporcloud": _3, "vbrplsbx": { "$": 0, "succ": { "g": _3 } }, "on-k3s": _5, "on-rio": _5, "readthedocs": _3, "resindevice": _3, "resinstaging": { "$": 0, "succ": { "devices": _3 } }, "hzc": _3, "sandcats": _3, "shiftcrypto": _3, "shiftedit": _3, "mo-siemens": _3, "musician": _3, "lair": _19, "stolos": _5, "spacekit": _3, "utwente": _3, "s5y": _5, "edugit": _3, "telebit": _3, "thingdust": { "$": 0, "succ": { "dev": _30, "disrec": _30, "prod": _31, "testing": _30 } }, "tickets": _3, "upli": _3, "wedeploy": _3, "editorx": _3, "basicserver": _3, "virtualserver": _3 } }, "iq": _32, "ir": { "$": 1, "succ": { "ac": _2, "co": _2, "gov": _2, "id": _2, "net": _2, "org": _2, "sch": _2, "xn--mgba3a4f16a": _2, "ایران": _2, "xn--mgba3a4fra": _2, "ايران": _2 } }, "is": { "$": 1, "succ": { "net": _2, "com": _2, "edu": _2, "gov": _2, "org": _2, "int": _2, "cupcake": _3, "blogspot": _3 } }, "it": { "$": 1, "succ": { "gov": _2, "edu": _2, "abr": _2, "abruzzo": _2, "aosta-valley": _2, "aostavalley": _2, "bas": _2, "basilicata": _2, "cal": _2, "calabria": _2, "cam": _2, "campania": _2, "emilia-romagna": _2, "emiliaromagna": _2, "emr": _2, "friuli-v-giulia": _2, "friuli-ve-giulia": _2, "friuli-vegiulia": _2, "friuli-venezia-giulia": _2, "friuli-veneziagiulia": _2, "friuli-vgiulia": _2, "friuliv-giulia": _2, "friulive-giulia": _2, "friulivegiulia": _2, "friulivenezia-giulia": _2, "friuliveneziagiulia": _2, "friulivgiulia": _2, "fvg": _2, "laz": _2, "lazio": _2, "lig": _2, "liguria": _2, "lom": _2, "lombardia": _2, "lombardy": _2, "lucania": _2, "mar": _2, "marche": _2, "mol": _2, "molise": _2, "piedmont": _2, "piemonte": _2, "pmn": _2, "pug": _2, "puglia": _2, "sar": _2, "sardegna": _2, "sardinia": _2, "sic": _2, "sicilia": _2, "sicily": _2, "taa": _2, "tos": _2, "toscana": _2, "trentin-sud-tirol": _2, "xn--trentin-sd-tirol-rzb": _2, "trentin-süd-tirol": _2, "trentin-sudtirol": _2, "xn--trentin-sdtirol-7vb": _2, "trentin-südtirol": _2, "trentin-sued-tirol": _2, "trentin-suedtirol": _2, "trentino-a-adige": _2, "trentino-aadige": _2, "trentino-alto-adige": _2, "trentino-altoadige": _2, "trentino-s-tirol": _2, "trentino-stirol": _2, "trentino-sud-tirol": _2, "xn--trentino-sd-tirol-c3b": _2, "trentino-süd-tirol": _2, "trentino-sudtirol": _2, "xn--trentino-sdtirol-szb": _2, "trentino-südtirol": _2, "trentino-sued-tirol": _2, "trentino-suedtirol": _2, "trentino": _2, "trentinoa-adige": _2, "trentinoaadige": _2, "trentinoalto-adige": _2, "trentinoaltoadige": _2, "trentinos-tirol": _2, "trentinostirol": _2, "trentinosud-tirol": _2, "xn--trentinosd-tirol-rzb": _2, "trentinosüd-tirol": _2, "trentinosudtirol": _2, "xn--trentinosdtirol-7vb": _2, "trentinosüdtirol": _2, "trentinosued-tirol": _2, "trentinosuedtirol": _2, "trentinsud-tirol": _2, "xn--trentinsd-tirol-6vb": _2, "trentinsüd-tirol": _2, "trentinsudtirol": _2, "xn--trentinsdtirol-nsb": _2, "trentinsüdtirol": _2, "trentinsued-tirol": _2, "trentinsuedtirol": _2, "tuscany": _2, "umb": _2, "umbria": _2, "val-d-aosta": _2, "val-daosta": _2, "vald-aosta": _2, "valdaosta": _2, "valle-aosta": _2, "valle-d-aosta": _2, "valle-daosta": _2, "valleaosta": _2, "valled-aosta": _2, "valledaosta": _2, "vallee-aoste": _2, "xn--valle-aoste-ebb": _2, "vallée-aoste": _2, "vallee-d-aoste": _2, "xn--valle-d-aoste-ehb": _2, "vallée-d-aoste": _2, "valleeaoste": _2, "xn--valleaoste-e7a": _2, "valléeaoste": _2, "valleedaoste": _2, "xn--valledaoste-ebb": _2, "valléedaoste": _2, "vao": _2, "vda": _2, "ven": _2, "veneto": _2, "ag": _2, "agrigento": _2, "al": _2, "alessandria": _2, "alto-adige": _2, "altoadige": _2, "an": _2, "ancona": _2, "andria-barletta-trani": _2, "andria-trani-barletta": _2, "andriabarlettatrani": _2, "andriatranibarletta": _2, "ao": _2, "aosta": _2, "aoste": _2, "ap": _2, "aq": _2, "aquila": _2, "ar": _2, "arezzo": _2, "ascoli-piceno": _2, "ascolipiceno": _2, "asti": _2, "at": _2, "av": _2, "avellino": _2, "ba": _2, "balsan-sudtirol": _2, "xn--balsan-sdtirol-nsb": _2, "balsan-südtirol": _2, "balsan-suedtirol": _2, "balsan": _2, "bari": _2, "barletta-trani-andria": _2, "barlettatraniandria": _2, "belluno": _2, "benevento": _2, "bergamo": _2, "bg": _2, "bi": _2, "biella": _2, "bl": _2, "bn": _2, "bo": _2, "bologna": _2, "bolzano-altoadige": _2, "bolzano": _2, "bozen-sudtirol": _2, "xn--bozen-sdtirol-2ob": _2, "bozen-südtirol": _2, "bozen-suedtirol": _2, "bozen": _2, "br": _2, "brescia": _2, "brindisi": _2, "bs": _2, "bt": _2, "bulsan-sudtirol": _2, "xn--bulsan-sdtirol-nsb": _2, "bulsan-südtirol": _2, "bulsan-suedtirol": _2, "bulsan": _2, "bz": _2, "ca": _2, "cagliari": _2, "caltanissetta": _2, "campidano-medio": _2, "campidanomedio": _2, "campobasso": _2, "carbonia-iglesias": _2, "carboniaiglesias": _2, "carrara-massa": _2, "carraramassa": _2, "caserta": _2, "catania": _2, "catanzaro": _2, "cb": _2, "ce": _2, "cesena-forli": _2, "xn--cesena-forl-mcb": _2, "cesena-forlì": _2, "cesenaforli": _2, "xn--cesenaforl-i8a": _2, "cesenaforlì": _2, "ch": _2, "chieti": _2, "ci": _2, "cl": _2, "cn": _2, "co": _2, "como": _2, "cosenza": _2, "cr": _2, "cremona": _2, "crotone": _2, "cs": _2, "ct": _2, "cuneo": _2, "cz": _2, "dell-ogliastra": _2, "dellogliastra": _2, "en": _2, "enna": _2, "fc": _2, "fe": _2, "fermo": _2, "ferrara": _2, "fg": _2, "fi": _2, "firenze": _2, "florence": _2, "fm": _2, "foggia": _2, "forli-cesena": _2, "xn--forl-cesena-fcb": _2, "forlì-cesena": _2, "forlicesena": _2, "xn--forlcesena-c8a": _2, "forlìcesena": _2, "fr": _2, "frosinone": _2, "ge": _2, "genoa": _2, "genova": _2, "go": _2, "gorizia": _2, "gr": _2, "grosseto": _2, "iglesias-carbonia": _2, "iglesiascarbonia": _2, "im": _2, "imperia": _2, "is": _2, "isernia": _2, "kr": _2, "la-spezia": _2, "laquila": _2, "laspezia": _2, "latina": _2, "lc": _2, "le": _2, "lecce": _2, "lecco": _2, "li": _2, "livorno": _2, "lo": _2, "lodi": _2, "lt": _2, "lu": _2, "lucca": _2, "macerata": _2, "mantova": _2, "massa-carrara": _2, "massacarrara": _2, "matera": _2, "mb": _2, "mc": _2, "me": _2, "medio-campidano": _2, "mediocampidano": _2, "messina": _2, "mi": _2, "milan": _2, "milano": _2, "mn": _2, "mo": _2, "modena": _2, "monza-brianza": _2, "monza-e-della-brianza": _2, "monza": _2, "monzabrianza": _2, "monzaebrianza": _2, "monzaedellabrianza": _2, "ms": _2, "mt": _2, "na": _2, "naples": _2, "napoli": _2, "no": _2, "novara": _2, "nu": _2, "nuoro": _2, "og": _2, "ogliastra": _2, "olbia-tempio": _2, "olbiatempio": _2, "or": _2, "oristano": _2, "ot": _2, "pa": _2, "padova": _2, "padua": _2, "palermo": _2, "parma": _2, "pavia": _2, "pc": _2, "pd": _2, "pe": _2, "perugia": _2, "pesaro-urbino": _2, "pesarourbino": _2, "pescara": _2, "pg": _2, "pi": _2, "piacenza": _2, "pisa": _2, "pistoia": _2, "pn": _2, "po": _2, "pordenone": _2, "potenza": _2, "pr": _2, "prato": _2, "pt": _2, "pu": _2, "pv": _2, "pz": _2, "ra": _2, "ragusa": _2, "ravenna": _2, "rc": _2, "re": _2, "reggio-calabria": _2, "reggio-emilia": _2, "reggiocalabria": _2, "reggioemilia": _2, "rg": _2, "ri": _2, "rieti": _2, "rimini": _2, "rm": _2, "rn": _2, "ro": _2, "roma": _2, "rome": _2, "rovigo": _2, "sa": _2, "salerno": _2, "sassari": _2, "savona": _2, "si": _2, "siena": _2, "siracusa": _2, "so": _2, "sondrio": _2, "sp": _2, "sr": _2, "ss": _2, "suedtirol": _2, "xn--sdtirol-n2a": _2, "südtirol": _2, "sv": _2, "ta": _2, "taranto": _2, "te": _2, "tempio-olbia": _2, "tempioolbia": _2, "teramo": _2, "terni": _2, "tn": _2, "to": _2, "torino": _2, "tp": _2, "tr": _2, "trani-andria-barletta": _2, "trani-barletta-andria": _2, "traniandriabarletta": _2, "tranibarlettaandria": _2, "trapani": _2, "trento": _2, "treviso": _2, "trieste": _2, "ts": _2, "turin": _2, "tv": _2, "ud": _2, "udine": _2, "urbino-pesaro": _2, "urbinopesaro": _2, "va": _2, "varese": _2, "vb": _2, "vc": _2, "ve": _2, "venezia": _2, "venice": _2, "verbania": _2, "vercelli": _2, "verona": _2, "vi": _2, "vibo-valentia": _2, "vibovalentia": _2, "vicenza": _2, "viterbo": _2, "vr": _2, "vs": _2, "vt": _2, "vv": _2, "blogspot": _3, "ibxos": _3, "iliadboxos": _3, "neen": { "$": 0, "succ": { "jc": _3 } }, "tim": { "$": 0, "succ": { "open": { "$": 0, "succ": { "jelastic": _9 } } } }, "16-b": _3, "32-b": _3, "64-b": _3, "123homepage": _3, "myspreadshop": _3, "syncloud": _3 } }, "je": { "$": 1, "succ": { "co": _2, "net": _2, "org": _2, "of": _3 } }, "jm": _8, "jo": { "$": 1, "succ": { "com": _2, "org": _2, "net": _2, "edu": _2, "sch": _2, "gov": _2, "mil": _2, "name": _2 } }, "jobs": _2, "jp": { "$": 1, "succ": { "ac": _2, "ad": _2, "co": _2, "ed": _2, "go": _2, "gr": _2, "lg": _2, "ne": { "$": 1, "succ": { "aseinet": _28, "gehirn": _3, "ivory": _3, "mail-box": _3, "mints": _3, "mokuren": _3, "opal": _3, "sakura": _3, "sumomo": _3, "topaz": _3 } }, "or": _2, "aichi": { "$": 1, "succ": { "aisai": _2, "ama": _2, "anjo": _2, "asuke": _2, "chiryu": _2, "chita": _2, "fuso": _2, "gamagori": _2, "handa": _2, "hazu": _2, "hekinan": _2, "higashiura": _2, "ichinomiya": _2, "inazawa": _2, "inuyama": _2, "isshiki": _2, "iwakura": _2, "kanie": _2, "kariya": _2, "kasugai": _2, "kira": _2, "kiyosu": _2, "komaki": _2, "konan": _2, "kota": _2, "mihama": _2, "miyoshi": _2, "nishio": _2, "nisshin": _2, "obu": _2, "oguchi": _2, "oharu": _2, "okazaki": _2, "owariasahi": _2, "seto": _2, "shikatsu": _2, "shinshiro": _2, "shitara": _2, "tahara": _2, "takahama": _2, "tobishima": _2, "toei": _2, "togo": _2, "tokai": _2, "tokoname": _2, "toyoake": _2, "toyohashi": _2, "toyokawa": _2, "toyone": _2, "toyota": _2, "tsushima": _2, "yatomi": _2 } }, "akita": { "$": 1, "succ": { "akita": _2, "daisen": _2, "fujisato": _2, "gojome": _2, "hachirogata": _2, "happou": _2, "higashinaruse": _2, "honjo": _2, "honjyo": _2, "ikawa": _2, "kamikoani": _2, "kamioka": _2, "katagami": _2, "kazuno": _2, "kitaakita": _2, "kosaka": _2, "kyowa": _2, "misato": _2, "mitane": _2, "moriyoshi": _2, "nikaho": _2, "noshiro": _2, "odate": _2, "oga": _2, "ogata": _2, "semboku": _2, "yokote": _2, "yurihonjo": _2 } }, "aomori": { "$": 1, "succ": { "aomori": _2, "gonohe": _2, "hachinohe": _2, "hashikami": _2, "hiranai": _2, "hirosaki": _2, "itayanagi": _2, "kuroishi": _2, "misawa": _2, "mutsu": _2, "nakadomari": _2, "noheji": _2, "oirase": _2, "owani": _2, "rokunohe": _2, "sannohe": _2, "shichinohe": _2, "shingo": _2, "takko": _2, "towada": _2, "tsugaru": _2, "tsuruta": _2 } }, "chiba": { "$": 1, "succ": { "abiko": _2, "asahi": _2, "chonan": _2, "chosei": _2, "choshi": _2, "chuo": _2, "funabashi": _2, "futtsu": _2, "hanamigawa": _2, "ichihara": _2, "ichikawa": _2, "ichinomiya": _2, "inzai": _2, "isumi": _2, "kamagaya": _2, "kamogawa": _2, "kashiwa": _2, "katori": _2, "katsuura": _2, "kimitsu": _2, "kisarazu": _2, "kozaki": _2, "kujukuri": _2, "kyonan": _2, "matsudo": _2, "midori": _2, "mihama": _2, "minamiboso": _2, "mobara": _2, "mutsuzawa": _2, "nagara": _2, "nagareyama": _2, "narashino": _2, "narita": _2, "noda": _2, "oamishirasato": _2, "omigawa": _2, "onjuku": _2, "otaki": _2, "sakae": _2, "sakura": _2, "shimofusa": _2, "shirako": _2, "shiroi": _2, "shisui": _2, "sodegaura": _2, "sosa": _2, "tako": _2, "tateyama": _2, "togane": _2, "tohnosho": _2, "tomisato": _2, "urayasu": _2, "yachimata": _2, "yachiyo": _2, "yokaichiba": _2, "yokoshibahikari": _2, "yotsukaido": _2 } }, "ehime": { "$": 1, "succ": { "ainan": _2, "honai": _2, "ikata": _2, "imabari": _2, "iyo": _2, "kamijima": _2, "kihoku": _2, "kumakogen": _2, "masaki": _2, "matsuno": _2, "matsuyama": _2, "namikata": _2, "niihama": _2, "ozu": _2, "saijo": _2, "seiyo": _2, "shikokuchuo": _2, "tobe": _2, "toon": _2, "uchiko": _2, "uwajima": _2, "yawatahama": _2 } }, "fukui": { "$": 1, "succ": { "echizen": _2, "eiheiji": _2, "fukui": _2, "ikeda": _2, "katsuyama": _2, "mihama": _2, "minamiechizen": _2, "obama": _2, "ohi": _2, "ono": _2, "sabae": _2, "sakai": _2, "takahama": _2, "tsuruga": _2, "wakasa": _2 } }, "fukuoka": { "$": 1, "succ": { "ashiya": _2, "buzen": _2, "chikugo": _2, "chikuho": _2, "chikujo": _2, "chikushino": _2, "chikuzen": _2, "chuo": _2, "dazaifu": _2, "fukuchi": _2, "hakata": _2, "higashi": _2, "hirokawa": _2, "hisayama": _2, "iizuka": _2, "inatsuki": _2, "kaho": _2, "kasuga": _2, "kasuya": _2, "kawara": _2, "keisen": _2, "koga": _2, "kurate": _2, "kurogi": _2, "kurume": _2, "minami": _2, "miyako": _2, "miyama": _2, "miyawaka": _2, "mizumaki": _2, "munakata": _2, "nakagawa": _2, "nakama": _2, "nishi": _2, "nogata": _2, "ogori": _2, "okagaki": _2, "okawa": _2, "oki": _2, "omuta": _2, "onga": _2, "onojo": _2, "oto": _2, "saigawa": _2, "sasaguri": _2, "shingu": _2, "shinyoshitomi": _2, "shonai": _2, "soeda": _2, "sue": _2, "tachiarai": _2, "tagawa": _2, "takata": _2, "toho": _2, "toyotsu": _2, "tsuiki": _2, "ukiha": _2, "umi": _2, "usui": _2, "yamada": _2, "yame": _2, "yanagawa": _2, "yukuhashi": _2 } }, "fukushima": { "$": 1, "succ": { "aizubange": _2, "aizumisato": _2, "aizuwakamatsu": _2, "asakawa": _2, "bandai": _2, "date": _2, "fukushima": _2, "furudono": _2, "futaba": _2, "hanawa": _2, "higashi": _2, "hirata": _2, "hirono": _2, "iitate": _2, "inawashiro": _2, "ishikawa": _2, "iwaki": _2, "izumizaki": _2, "kagamiishi": _2, "kaneyama": _2, "kawamata": _2, "kitakata": _2, "kitashiobara": _2, "koori": _2, "koriyama": _2, "kunimi": _2, "miharu": _2, "mishima": _2, "namie": _2, "nango": _2, "nishiaizu": _2, "nishigo": _2, "okuma": _2, "omotego": _2, "ono": _2, "otama": _2, "samegawa": _2, "shimogo": _2, "shirakawa": _2, "showa": _2, "soma": _2, "sukagawa": _2, "taishin": _2, "tamakawa": _2, "tanagura": _2, "tenei": _2, "yabuki": _2, "yamato": _2, "yamatsuri": _2, "yanaizu": _2, "yugawa": _2 } }, "gifu": { "$": 1, "succ": { "anpachi": _2, "ena": _2, "gifu": _2, "ginan": _2, "godo": _2, "gujo": _2, "hashima": _2, "hichiso": _2, "hida": _2, "higashishirakawa": _2, "ibigawa": _2, "ikeda": _2, "kakamigahara": _2, "kani": _2, "kasahara": _2, "kasamatsu": _2, "kawaue": _2, "kitagata": _2, "mino": _2, "minokamo": _2, "mitake": _2, "mizunami": _2, "motosu": _2, "nakatsugawa": _2, "ogaki": _2, "sakahogi": _2, "seki": _2, "sekigahara": _2, "shirakawa": _2, "tajimi": _2, "takayama": _2, "tarui": _2, "toki": _2, "tomika": _2, "wanouchi": _2, "yamagata": _2, "yaotsu": _2, "yoro": _2 } }, "gunma": { "$": 1, "succ": { "annaka": _2, "chiyoda": _2, "fujioka": _2, "higashiagatsuma": _2, "isesaki": _2, "itakura": _2, "kanna": _2, "kanra": _2, "katashina": _2, "kawaba": _2, "kiryu": _2, "kusatsu": _2, "maebashi": _2, "meiwa": _2, "midori": _2, "minakami": _2, "naganohara": _2, "nakanojo": _2, "nanmoku": _2, "numata": _2, "oizumi": _2, "ora": _2, "ota": _2, "shibukawa": _2, "shimonita": _2, "shinto": _2, "showa": _2, "takasaki": _2, "takayama": _2, "tamamura": _2, "tatebayashi": _2, "tomioka": _2, "tsukiyono": _2, "tsumagoi": _2, "ueno": _2, "yoshioka": _2 } }, "hiroshima": { "$": 1, "succ": { "asaminami": _2, "daiwa": _2, "etajima": _2, "fuchu": _2, "fukuyama": _2, "hatsukaichi": _2, "higashihiroshima": _2, "hongo": _2, "jinsekikogen": _2, "kaita": _2, "kui": _2, "kumano": _2, "kure": _2, "mihara": _2, "miyoshi": _2, "naka": _2, "onomichi": _2, "osakikamijima": _2, "otake": _2, "saka": _2, "sera": _2, "seranishi": _2, "shinichi": _2, "shobara": _2, "takehara": _2 } }, "hokkaido": { "$": 1, "succ": { "abashiri": _2, "abira": _2, "aibetsu": _2, "akabira": _2, "akkeshi": _2, "asahikawa": _2, "ashibetsu": _2, "ashoro": _2, "assabu": _2, "atsuma": _2, "bibai": _2, "biei": _2, "bifuka": _2, "bihoro": _2, "biratori": _2, "chippubetsu": _2, "chitose": _2, "date": _2, "ebetsu": _2, "embetsu": _2, "eniwa": _2, "erimo": _2, "esan": _2, "esashi": _2, "fukagawa": _2, "fukushima": _2, "furano": _2, "furubira": _2, "haboro": _2, "hakodate": _2, "hamatonbetsu": _2, "hidaka": _2, "higashikagura": _2, "higashikawa": _2, "hiroo": _2, "hokuryu": _2, "hokuto": _2, "honbetsu": _2, "horokanai": _2, "horonobe": _2, "ikeda": _2, "imakane": _2, "ishikari": _2, "iwamizawa": _2, "iwanai": _2, "kamifurano": _2, "kamikawa": _2, "kamishihoro": _2, "kamisunagawa": _2, "kamoenai": _2, "kayabe": _2, "kembuchi": _2, "kikonai": _2, "kimobetsu": _2, "kitahiroshima": _2, "kitami": _2, "kiyosato": _2, "koshimizu": _2, "kunneppu": _2, "kuriyama": _2, "kuromatsunai": _2, "kushiro": _2, "kutchan": _2, "kyowa": _2, "mashike": _2, "matsumae": _2, "mikasa": _2, "minamifurano": _2, "mombetsu": _2, "moseushi": _2, "mukawa": _2, "muroran": _2, "naie": _2, "nakagawa": _2, "nakasatsunai": _2, "nakatombetsu": _2, "nanae": _2, "nanporo": _2, "nayoro": _2, "nemuro": _2, "niikappu": _2, "niki": _2, "nishiokoppe": _2, "noboribetsu": _2, "numata": _2, "obihiro": _2, "obira": _2, "oketo": _2, "okoppe": _2, "otaru": _2, "otobe": _2, "otofuke": _2, "otoineppu": _2, "oumu": _2, "ozora": _2, "pippu": _2, "rankoshi": _2, "rebun": _2, "rikubetsu": _2, "rishiri": _2, "rishirifuji": _2, "saroma": _2, "sarufutsu": _2, "shakotan": _2, "shari": _2, "shibecha": _2, "shibetsu": _2, "shikabe": _2, "shikaoi": _2, "shimamaki": _2, "shimizu": _2, "shimokawa": _2, "shinshinotsu": _2, "shintoku": _2, "shiranuka": _2, "shiraoi": _2, "shiriuchi": _2, "sobetsu": _2, "sunagawa": _2, "taiki": _2, "takasu": _2, "takikawa": _2, "takinoue": _2, "teshikaga": _2, "tobetsu": _2, "tohma": _2, "tomakomai": _2, "tomari": _2, "toya": _2, "toyako": _2, "toyotomi": _2, "toyoura": _2, "tsubetsu": _2, "tsukigata": _2, "urakawa": _2, "urausu": _2, "uryu": _2, "utashinai": _2, "wakkanai": _2, "wassamu": _2, "yakumo": _2, "yoichi": _2 } }, "hyogo": { "$": 1, "succ": { "aioi": _2, "akashi": _2, "ako": _2, "amagasaki": _2, "aogaki": _2, "asago": _2, "ashiya": _2, "awaji": _2, "fukusaki": _2, "goshiki": _2, "harima": _2, "himeji": _2, "ichikawa": _2, "inagawa": _2, "itami": _2, "kakogawa": _2, "kamigori": _2, "kamikawa": _2, "kasai": _2, "kasuga": _2, "kawanishi": _2, "miki": _2, "minamiawaji": _2, "nishinomiya": _2, "nishiwaki": _2, "ono": _2, "sanda": _2, "sannan": _2, "sasayama": _2, "sayo": _2, "shingu": _2, "shinonsen": _2, "shiso": _2, "sumoto": _2, "taishi": _2, "taka": _2, "takarazuka": _2, "takasago": _2, "takino": _2, "tamba": _2, "tatsuno": _2, "toyooka": _2, "yabu": _2, "yashiro": _2, "yoka": _2, "yokawa": _2 } }, "ibaraki": { "$": 1, "succ": { "ami": _2, "asahi": _2, "bando": _2, "chikusei": _2, "daigo": _2, "fujishiro": _2, "hitachi": _2, "hitachinaka": _2, "hitachiomiya": _2, "hitachiota": _2, "ibaraki": _2, "ina": _2, "inashiki": _2, "itako": _2, "iwama": _2, "joso": _2, "kamisu": _2, "kasama": _2, "kashima": _2, "kasumigaura": _2, "koga": _2, "miho": _2, "mito": _2, "moriya": _2, "naka": _2, "namegata": _2, "oarai": _2, "ogawa": _2, "omitama": _2, "ryugasaki": _2, "sakai": _2, "sakuragawa": _2, "shimodate": _2, "shimotsuma": _2, "shirosato": _2, "sowa": _2, "suifu": _2, "takahagi": _2, "tamatsukuri": _2, "tokai": _2, "tomobe": _2, "tone": _2, "toride": _2, "tsuchiura": _2, "tsukuba": _2, "uchihara": _2, "ushiku": _2, "yachiyo": _2, "yamagata": _2, "yawara": _2, "yuki": _2 } }, "ishikawa": { "$": 1, "succ": { "anamizu": _2, "hakui": _2, "hakusan": _2, "kaga": _2, "kahoku": _2, "kanazawa": _2, "kawakita": _2, "komatsu": _2, "nakanoto": _2, "nanao": _2, "nomi": _2, "nonoichi": _2, "noto": _2, "shika": _2, "suzu": _2, "tsubata": _2, "tsurugi": _2, "uchinada": _2, "wajima": _2 } }, "iwate": { "$": 1, "succ": { "fudai": _2, "fujisawa": _2, "hanamaki": _2, "hiraizumi": _2, "hirono": _2, "ichinohe": _2, "ichinoseki": _2, "iwaizumi": _2, "iwate": _2, "joboji": _2, "kamaishi": _2, "kanegasaki": _2, "karumai": _2, "kawai": _2, "kitakami": _2, "kuji": _2, "kunohe": _2, "kuzumaki": _2, "miyako": _2, "mizusawa": _2, "morioka": _2, "ninohe": _2, "noda": _2, "ofunato": _2, "oshu": _2, "otsuchi": _2, "rikuzentakata": _2, "shiwa": _2, "shizukuishi": _2, "sumita": _2, "tanohata": _2, "tono": _2, "yahaba": _2, "yamada": _2 } }, "kagawa": { "$": 1, "succ": { "ayagawa": _2, "higashikagawa": _2, "kanonji": _2, "kotohira": _2, "manno": _2, "marugame": _2, "mitoyo": _2, "naoshima": _2, "sanuki": _2, "tadotsu": _2, "takamatsu": _2, "tonosho": _2, "uchinomi": _2, "utazu": _2, "zentsuji": _2 } }, "kagoshima": { "$": 1, "succ": { "akune": _2, "amami": _2, "hioki": _2, "isa": _2, "isen": _2, "izumi": _2, "kagoshima": _2, "kanoya": _2, "kawanabe": _2, "kinko": _2, "kouyama": _2, "makurazaki": _2, "matsumoto": _2, "minamitane": _2, "nakatane": _2, "nishinoomote": _2, "satsumasendai": _2, "soo": _2, "tarumizu": _2, "yusui": _2 } }, "kanagawa": { "$": 1, "succ": { "aikawa": _2, "atsugi": _2, "ayase": _2, "chigasaki": _2, "ebina": _2, "fujisawa": _2, "hadano": _2, "hakone": _2, "hiratsuka": _2, "isehara": _2, "kaisei": _2, "kamakura": _2, "kiyokawa": _2, "matsuda": _2, "minamiashigara": _2, "miura": _2, "nakai": _2, "ninomiya": _2, "odawara": _2, "oi": _2, "oiso": _2, "sagamihara": _2, "samukawa": _2, "tsukui": _2, "yamakita": _2, "yamato": _2, "yokosuka": _2, "yugawara": _2, "zama": _2, "zushi": _2 } }, "kochi": { "$": 1, "succ": { "aki": _2, "geisei": _2, "hidaka": _2, "higashitsuno": _2, "ino": _2, "kagami": _2, "kami": _2, "kitagawa": _2, "kochi": _2, "mihara": _2, "motoyama": _2, "muroto": _2, "nahari": _2, "nakamura": _2, "nankoku": _2, "nishitosa": _2, "niyodogawa": _2, "ochi": _2, "okawa": _2, "otoyo": _2, "otsuki": _2, "sakawa": _2, "sukumo": _2, "susaki": _2, "tosa": _2, "tosashimizu": _2, "toyo": _2, "tsuno": _2, "umaji": _2, "yasuda": _2, "yusuhara": _2 } }, "kumamoto": { "$": 1, "succ": { "amakusa": _2, "arao": _2, "aso": _2, "choyo": _2, "gyokuto": _2, "kamiamakusa": _2, "kikuchi": _2, "kumamoto": _2, "mashiki": _2, "mifune": _2, "minamata": _2, "minamioguni": _2, "nagasu": _2, "nishihara": _2, "oguni": _2, "ozu": _2, "sumoto": _2, "takamori": _2, "uki": _2, "uto": _2, "yamaga": _2, "yamato": _2, "yatsushiro": _2 } }, "kyoto": { "$": 1, "succ": { "ayabe": _2, "fukuchiyama": _2, "higashiyama": _2, "ide": _2, "ine": _2, "joyo": _2, "kameoka": _2, "kamo": _2, "kita": _2, "kizu": _2, "kumiyama": _2, "kyotamba": _2, "kyotanabe": _2, "kyotango": _2, "maizuru": _2, "minami": _2, "minamiyamashiro": _2, "miyazu": _2, "muko": _2, "nagaokakyo": _2, "nakagyo": _2, "nantan": _2, "oyamazaki": _2, "sakyo": _2, "seika": _2, "tanabe": _2, "uji": _2, "ujitawara": _2, "wazuka": _2, "yamashina": _2, "yawata": _2 } }, "mie": { "$": 1, "succ": { "asahi": _2, "inabe": _2, "ise": _2, "kameyama": _2, "kawagoe": _2, "kiho": _2, "kisosaki": _2, "kiwa": _2, "komono": _2, "kumano": _2, "kuwana": _2, "matsusaka": _2, "meiwa": _2, "mihama": _2, "minamiise": _2, "misugi": _2, "miyama": _2, "nabari": _2, "shima": _2, "suzuka": _2, "tado": _2, "taiki": _2, "taki": _2, "tamaki": _2, "toba": _2, "tsu": _2, "udono": _2, "ureshino": _2, "watarai": _2, "yokkaichi": _2 } }, "miyagi": { "$": 1, "succ": { "furukawa": _2, "higashimatsushima": _2, "ishinomaki": _2, "iwanuma": _2, "kakuda": _2, "kami": _2, "kawasaki": _2, "marumori": _2, "matsushima": _2, "minamisanriku": _2, "misato": _2, "murata": _2, "natori": _2, "ogawara": _2, "ohira": _2, "onagawa": _2, "osaki": _2, "rifu": _2, "semine": _2, "shibata": _2, "shichikashuku": _2, "shikama": _2, "shiogama": _2, "shiroishi": _2, "tagajo": _2, "taiwa": _2, "tome": _2, "tomiya": _2, "wakuya": _2, "watari": _2, "yamamoto": _2, "zao": _2 } }, "miyazaki": { "$": 1, "succ": { "aya": _2, "ebino": _2, "gokase": _2, "hyuga": _2, "kadogawa": _2, "kawaminami": _2, "kijo": _2, "kitagawa": _2, "kitakata": _2, "kitaura": _2, "kobayashi": _2, "kunitomi": _2, "kushima": _2, "mimata": _2, "miyakonojo": _2, "miyazaki": _2, "morotsuka": _2, "nichinan": _2, "nishimera": _2, "nobeoka": _2, "saito": _2, "shiiba": _2, "shintomi": _2, "takaharu": _2, "takanabe": _2, "takazaki": _2, "tsuno": _2 } }, "nagano": { "$": 1, "succ": { "achi": _2, "agematsu": _2, "anan": _2, "aoki": _2, "asahi": _2, "azumino": _2, "chikuhoku": _2, "chikuma": _2, "chino": _2, "fujimi": _2, "hakuba": _2, "hara": _2, "hiraya": _2, "iida": _2, "iijima": _2, "iiyama": _2, "iizuna": _2, "ikeda": _2, "ikusaka": _2, "ina": _2, "karuizawa": _2, "kawakami": _2, "kiso": _2, "kisofukushima": _2, "kitaaiki": _2, "komagane": _2, "komoro": _2, "matsukawa": _2, "matsumoto": _2, "miasa": _2, "minamiaiki": _2, "minamimaki": _2, "minamiminowa": _2, "minowa": _2, "miyada": _2, "miyota": _2, "mochizuki": _2, "nagano": _2, "nagawa": _2, "nagiso": _2, "nakagawa": _2, "nakano": _2, "nozawaonsen": _2, "obuse": _2, "ogawa": _2, "okaya": _2, "omachi": _2, "omi": _2, "ookuwa": _2, "ooshika": _2, "otaki": _2, "otari": _2, "sakae": _2, "sakaki": _2, "saku": _2, "sakuho": _2, "shimosuwa": _2, "shinanomachi": _2, "shiojiri": _2, "suwa": _2, "suzaka": _2, "takagi": _2, "takamori": _2, "takayama": _2, "tateshina": _2, "tatsuno": _2, "togakushi": _2, "togura": _2, "tomi": _2, "ueda": _2, "wada": _2, "yamagata": _2, "yamanouchi": _2, "yasaka": _2, "yasuoka": _2 } }, "nagasaki": { "$": 1, "succ": { "chijiwa": _2, "futsu": _2, "goto": _2, "hasami": _2, "hirado": _2, "iki": _2, "isahaya": _2, "kawatana": _2, "kuchinotsu": _2, "matsuura": _2, "nagasaki": _2, "obama": _2, "omura": _2, "oseto": _2, "saikai": _2, "sasebo": _2, "seihi": _2, "shimabara": _2, "shinkamigoto": _2, "togitsu": _2, "tsushima": _2, "unzen": _2 } }, "nara": { "$": 1, "succ": { "ando": _2, "gose": _2, "heguri": _2, "higashiyoshino": _2, "ikaruga": _2, "ikoma": _2, "kamikitayama": _2, "kanmaki": _2, "kashiba": _2, "kashihara": _2, "katsuragi": _2, "kawai": _2, "kawakami": _2, "kawanishi": _2, "koryo": _2, "kurotaki": _2, "mitsue": _2, "miyake": _2, "nara": _2, "nosegawa": _2, "oji": _2, "ouda": _2, "oyodo": _2, "sakurai": _2, "sango": _2, "shimoichi": _2, "shimokitayama": _2, "shinjo": _2, "soni": _2, "takatori": _2, "tawaramoto": _2, "tenkawa": _2, "tenri": _2, "uda": _2, "yamatokoriyama": _2, "yamatotakada": _2, "yamazoe": _2, "yoshino": _2 } }, "niigata": { "$": 1, "succ": { "aga": _2, "agano": _2, "gosen": _2, "itoigawa": _2, "izumozaki": _2, "joetsu": _2, "kamo": _2, "kariwa": _2, "kashiwazaki": _2, "minamiuonuma": _2, "mitsuke": _2, "muika": _2, "murakami": _2, "myoko": _2, "nagaoka": _2, "niigata": _2, "ojiya": _2, "omi": _2, "sado": _2, "sanjo": _2, "seiro": _2, "seirou": _2, "sekikawa": _2, "shibata": _2, "tagami": _2, "tainai": _2, "tochio": _2, "tokamachi": _2, "tsubame": _2, "tsunan": _2, "uonuma": _2, "yahiko": _2, "yoita": _2, "yuzawa": _2 } }, "oita": { "$": 1, "succ": { "beppu": _2, "bungoono": _2, "bungotakada": _2, "hasama": _2, "hiji": _2, "himeshima": _2, "hita": _2, "kamitsue": _2, "kokonoe": _2, "kuju": _2, "kunisaki": _2, "kusu": _2, "oita": _2, "saiki": _2, "taketa": _2, "tsukumi": _2, "usa": _2, "usuki": _2, "yufu": _2 } }, "okayama": { "$": 1, "succ": { "akaiwa": _2, "asakuchi": _2, "bizen": _2, "hayashima": _2, "ibara": _2, "kagamino": _2, "kasaoka": _2, "kibichuo": _2, "kumenan": _2, "kurashiki": _2, "maniwa": _2, "misaki": _2, "nagi": _2, "niimi": _2, "nishiawakura": _2, "okayama": _2, "satosho": _2, "setouchi": _2, "shinjo": _2, "shoo": _2, "soja": _2, "takahashi": _2, "tamano": _2, "tsuyama": _2, "wake": _2, "yakage": _2 } }, "okinawa": { "$": 1, "succ": { "aguni": _2, "ginowan": _2, "ginoza": _2, "gushikami": _2, "haebaru": _2, "higashi": _2, "hirara": _2, "iheya": _2, "ishigaki": _2, "ishikawa": _2, "itoman": _2, "izena": _2, "kadena": _2, "kin": _2, "kitadaito": _2, "kitanakagusuku": _2, "kumejima": _2, "kunigami": _2, "minamidaito": _2, "motobu": _2, "nago": _2, "naha": _2, "nakagusuku": _2, "nakijin": _2, "nanjo": _2, "nishihara": _2, "ogimi": _2, "okinawa": _2, "onna": _2, "shimoji": _2, "taketomi": _2, "tarama": _2, "tokashiki": _2, "tomigusuku": _2, "tonaki": _2, "urasoe": _2, "uruma": _2, "yaese": _2, "yomitan": _2, "yonabaru": _2, "yonaguni": _2, "zamami": _2 } }, "osaka": { "$": 1, "succ": { "abeno": _2, "chihayaakasaka": _2, "chuo": _2, "daito": _2, "fujiidera": _2, "habikino": _2, "hannan": _2, "higashiosaka": _2, "higashisumiyoshi": _2, "higashiyodogawa": _2, "hirakata": _2, "ibaraki": _2, "ikeda": _2, "izumi": _2, "izumiotsu": _2, "izumisano": _2, "kadoma": _2, "kaizuka": _2, "kanan": _2, "kashiwara": _2, "katano": _2, "kawachinagano": _2, "kishiwada": _2, "kita": _2, "kumatori": _2, "matsubara": _2, "minato": _2, "minoh": _2, "misaki": _2, "moriguchi": _2, "neyagawa": _2, "nishi": _2, "nose": _2, "osakasayama": _2, "sakai": _2, "sayama": _2, "sennan": _2, "settsu": _2, "shijonawate": _2, "shimamoto": _2, "suita": _2, "tadaoka": _2, "taishi": _2, "tajiri": _2, "takaishi": _2, "takatsuki": _2, "tondabayashi": _2, "toyonaka": _2, "toyono": _2, "yao": _2 } }, "saga": { "$": 1, "succ": { "ariake": _2, "arita": _2, "fukudomi": _2, "genkai": _2, "hamatama": _2, "hizen": _2, "imari": _2, "kamimine": _2, "kanzaki": _2, "karatsu": _2, "kashima": _2, "kitagata": _2, "kitahata": _2, "kiyama": _2, "kouhoku": _2, "kyuragi": _2, "nishiarita": _2, "ogi": _2, "omachi": _2, "ouchi": _2, "saga": _2, "shiroishi": _2, "taku": _2, "tara": _2, "tosu": _2, "yoshinogari": _2 } }, "saitama": { "$": 1, "succ": { "arakawa": _2, "asaka": _2, "chichibu": _2, "fujimi": _2, "fujimino": _2, "fukaya": _2, "hanno": _2, "hanyu": _2, "hasuda": _2, "hatogaya": _2, "hatoyama": _2, "hidaka": _2, "higashichichibu": _2, "higashimatsuyama": _2, "honjo": _2, "ina": _2, "iruma": _2, "iwatsuki": _2, "kamiizumi": _2, "kamikawa": _2, "kamisato": _2, "kasukabe": _2, "kawagoe": _2, "kawaguchi": _2, "kawajima": _2, "kazo": _2, "kitamoto": _2, "koshigaya": _2, "kounosu": _2, "kuki": _2, "kumagaya": _2, "matsubushi": _2, "minano": _2, "misato": _2, "miyashiro": _2, "miyoshi": _2, "moroyama": _2, "nagatoro": _2, "namegawa": _2, "niiza": _2, "ogano": _2, "ogawa": _2, "ogose": _2, "okegawa": _2, "omiya": _2, "otaki": _2, "ranzan": _2, "ryokami": _2, "saitama": _2, "sakado": _2, "satte": _2, "sayama": _2, "shiki": _2, "shiraoka": _2, "soka": _2, "sugito": _2, "toda": _2, "tokigawa": _2, "tokorozawa": _2, "tsurugashima": _2, "urawa": _2, "warabi": _2, "yashio": _2, "yokoze": _2, "yono": _2, "yorii": _2, "yoshida": _2, "yoshikawa": _2, "yoshimi": _2 } }, "shiga": { "$": 1, "succ": { "aisho": _2, "gamo": _2, "higashiomi": _2, "hikone": _2, "koka": _2, "konan": _2, "kosei": _2, "koto": _2, "kusatsu": _2, "maibara": _2, "moriyama": _2, "nagahama": _2, "nishiazai": _2, "notogawa": _2, "omihachiman": _2, "otsu": _2, "ritto": _2, "ryuoh": _2, "takashima": _2, "takatsuki": _2, "torahime": _2, "toyosato": _2, "yasu": _2 } }, "shimane": { "$": 1, "succ": { "akagi": _2, "ama": _2, "gotsu": _2, "hamada": _2, "higashiizumo": _2, "hikawa": _2, "hikimi": _2, "izumo": _2, "kakinoki": _2, "masuda": _2, "matsue": _2, "misato": _2, "nishinoshima": _2, "ohda": _2, "okinoshima": _2, "okuizumo": _2, "shimane": _2, "tamayu": _2, "tsuwano": _2, "unnan": _2, "yakumo": _2, "yasugi": _2, "yatsuka": _2 } }, "shizuoka": { "$": 1, "succ": { "arai": _2, "atami": _2, "fuji": _2, "fujieda": _2, "fujikawa": _2, "fujinomiya": _2, "fukuroi": _2, "gotemba": _2, "haibara": _2, "hamamatsu": _2, "higashiizu": _2, "ito": _2, "iwata": _2, "izu": _2, "izunokuni": _2, "kakegawa": _2, "kannami": _2, "kawanehon": _2, "kawazu": _2, "kikugawa": _2, "kosai": _2, "makinohara": _2, "matsuzaki": _2, "minamiizu": _2, "mishima": _2, "morimachi": _2, "nishiizu": _2, "numazu": _2, "omaezaki": _2, "shimada": _2, "shimizu": _2, "shimoda": _2, "shizuoka": _2, "susono": _2, "yaizu": _2, "yoshida": _2 } }, "tochigi": { "$": 1, "succ": { "ashikaga": _2, "bato": _2, "haga": _2, "ichikai": _2, "iwafune": _2, "kaminokawa": _2, "kanuma": _2, "karasuyama": _2, "kuroiso": _2, "mashiko": _2, "mibu": _2, "moka": _2, "motegi": _2, "nasu": _2, "nasushiobara": _2, "nikko": _2, "nishikata": _2, "nogi": _2, "ohira": _2, "ohtawara": _2, "oyama": _2, "sakura": _2, "sano": _2, "shimotsuke": _2, "shioya": _2, "takanezawa": _2, "tochigi": _2, "tsuga": _2, "ujiie": _2, "utsunomiya": _2, "yaita": _2 } }, "tokushima": { "$": 1, "succ": { "aizumi": _2, "anan": _2, "ichiba": _2, "itano": _2, "kainan": _2, "komatsushima": _2, "matsushige": _2, "mima": _2, "minami": _2, "miyoshi": _2, "mugi": _2, "nakagawa": _2, "naruto": _2, "sanagochi": _2, "shishikui": _2, "tokushima": _2, "wajiki": _2 } }, "tokyo": { "$": 1, "succ": { "adachi": _2, "akiruno": _2, "akishima": _2, "aogashima": _2, "arakawa": _2, "bunkyo": _2, "chiyoda": _2, "chofu": _2, "chuo": _2, "edogawa": _2, "fuchu": _2, "fussa": _2, "hachijo": _2, "hachioji": _2, "hamura": _2, "higashikurume": _2, "higashimurayama": _2, "higashiyamato": _2, "hino": _2, "hinode": _2, "hinohara": _2, "inagi": _2, "itabashi": _2, "katsushika": _2, "kita": _2, "kiyose": _2, "kodaira": _2, "koganei": _2, "kokubunji": _2, "komae": _2, "koto": _2, "kouzushima": _2, "kunitachi": _2, "machida": _2, "meguro": _2, "minato": _2, "mitaka": _2, "mizuho": _2, "musashimurayama": _2, "musashino": _2, "nakano": _2, "nerima": _2, "ogasawara": _2, "okutama": _2, "ome": _2, "oshima": _2, "ota": _2, "setagaya": _2, "shibuya": _2, "shinagawa": _2, "shinjuku": _2, "suginami": _2, "sumida": _2, "tachikawa": _2, "taito": _2, "tama": _2, "toshima": _2 } }, "tottori": { "$": 1, "succ": { "chizu": _2, "hino": _2, "kawahara": _2, "koge": _2, "kotoura": _2, "misasa": _2, "nanbu": _2, "nichinan": _2, "sakaiminato": _2, "tottori": _2, "wakasa": _2, "yazu": _2, "yonago": _2 } }, "toyama": { "$": 1, "succ": { "asahi": _2, "fuchu": _2, "fukumitsu": _2, "funahashi": _2, "himi": _2, "imizu": _2, "inami": _2, "johana": _2, "kamiichi": _2, "kurobe": _2, "nakaniikawa": _2, "namerikawa": _2, "nanto": _2, "nyuzen": _2, "oyabe": _2, "taira": _2, "takaoka": _2, "tateyama": _2, "toga": _2, "tonami": _2, "toyama": _2, "unazuki": _2, "uozu": _2, "yamada": _2 } }, "wakayama": { "$": 1, "succ": { "arida": _2, "aridagawa": _2, "gobo": _2, "hashimoto": _2, "hidaka": _2, "hirogawa": _2, "inami": _2, "iwade": _2, "kainan": _2, "kamitonda": _2, "katsuragi": _2, "kimino": _2, "kinokawa": _2, "kitayama": _2, "koya": _2, "koza": _2, "kozagawa": _2, "kudoyama": _2, "kushimoto": _2, "mihama": _2, "misato": _2, "nachikatsuura": _2, "shingu": _2, "shirahama": _2, "taiji": _2, "tanabe": _2, "wakayama": _2, "yuasa": _2, "yura": _2 } }, "yamagata": { "$": 1, "succ": { "asahi": _2, "funagata": _2, "higashine": _2, "iide": _2, "kahoku": _2, "kaminoyama": _2, "kaneyama": _2, "kawanishi": _2, "mamurogawa": _2, "mikawa": _2, "murayama": _2, "nagai": _2, "nakayama": _2, "nanyo": _2, "nishikawa": _2, "obanazawa": _2, "oe": _2, "oguni": _2, "ohkura": _2, "oishida": _2, "sagae": _2, "sakata": _2, "sakegawa": _2, "shinjo": _2, "shirataka": _2, "shonai": _2, "takahata": _2, "tendo": _2, "tozawa": _2, "tsuruoka": _2, "yamagata": _2, "yamanobe": _2, "yonezawa": _2, "yuza": _2 } }, "yamaguchi": { "$": 1, "succ": { "abu": _2, "hagi": _2, "hikari": _2, "hofu": _2, "iwakuni": _2, "kudamatsu": _2, "mitou": _2, "nagato": _2, "oshima": _2, "shimonoseki": _2, "shunan": _2, "tabuse": _2, "tokuyama": _2, "toyota": _2, "ube": _2, "yuu": _2 } }, "yamanashi": { "$": 1, "succ": { "chuo": _2, "doshi": _2, "fuefuki": _2, "fujikawa": _2, "fujikawaguchiko": _2, "fujiyoshida": _2, "hayakawa": _2, "hokuto": _2, "ichikawamisato": _2, "kai": _2, "kofu": _2, "koshu": _2, "kosuge": _2, "minami-alps": _2, "minobu": _2, "nakamichi": _2, "nanbu": _2, "narusawa": _2, "nirasaki": _2, "nishikatsura": _2, "oshino": _2, "otsuki": _2, "showa": _2, "tabayama": _2, "tsuru": _2, "uenohara": _2, "yamanakako": _2, "yamanashi": _2 } }, "xn--4pvxs": _2, "栃木": _2, "xn--vgu402c": _2, "愛知": _2, "xn--c3s14m": _2, "愛媛": _2, "xn--f6qx53a": _2, "兵庫": _2, "xn--8pvr4u": _2, "熊本": _2, "xn--uist22h": _2, "茨城": _2, "xn--djrs72d6uy": _2, "北海道": _2, "xn--mkru45i": _2, "千葉": _2, "xn--0trq7p7nn": _2, "和歌山": _2, "xn--8ltr62k": _2, "長崎": _2, "xn--2m4a15e": _2, "長野": _2, "xn--efvn9s": _2, "新潟": _2, "xn--32vp30h": _2, "青森": _2, "xn--4it797k": _2, "静岡": _2, "xn--1lqs71d": _2, "東京": _2, "xn--5rtp49c": _2, "石川": _2, "xn--5js045d": _2, "埼玉": _2, "xn--ehqz56n": _2, "三重": _2, "xn--1lqs03n": _2, "京都": _2, "xn--qqqt11m": _2, "佐賀": _2, "xn--kbrq7o": _2, "大分": _2, "xn--pssu33l": _2, "大阪": _2, "xn--ntsq17g": _2, "奈良": _2, "xn--uisz3g": _2, "宮城": _2, "xn--6btw5a": _2, "宮崎": _2, "xn--1ctwo": _2, "富山": _2, "xn--6orx2r": _2, "山口": _2, "xn--rht61e": _2, "山形": _2, "xn--rht27z": _2, "山梨": _2, "xn--djty4k": _2, "岩手": _2, "xn--nit225k": _2, "岐阜": _2, "xn--rht3d": _2, "岡山": _2, "xn--klty5x": _2, "島根": _2, "xn--kltx9a": _2, "広島": _2, "xn--kltp7d": _2, "徳島": _2, "xn--uuwu58a": _2, "沖縄": _2, "xn--zbx025d": _2, "滋賀": _2, "xn--ntso0iqx3a": _2, "神奈川": _2, "xn--elqq16h": _2, "福井": _2, "xn--4it168d": _2, "福岡": _2, "xn--klt787d": _2, "福島": _2, "xn--rny31h": _2, "秋田": _2, "xn--7t0a264c": _2, "群馬": _2, "xn--5rtq34k": _2, "香川": _2, "xn--k7yn95e": _2, "高知": _2, "xn--tor131o": _2, "鳥取": _2, "xn--d5qv7z876c": _2, "鹿児島": _2, "kawasaki": _8, "kitakyushu": _8, "kobe": _8, "nagoya": _8, "sapporo": _8, "sendai": _8, "yokohama": _8, "buyshop": _3, "fashionstore": _3, "handcrafted": _3, "kawaiishop": _3, "supersale": _3, "theshop": _3, "usercontent": _3, "angry": _3, "babyblue": _3, "babymilk": _3, "backdrop": _3, "bambina": _3, "bitter": _3, "blush": _3, "boo": _3, "boy": _3, "boyfriend": _3, "but": _3, "candypop": _3, "capoo": _3, "catfood": _3, "cheap": _3, "chicappa": _3, "chillout": _3, "chips": _3, "chowder": _3, "chu": _3, "ciao": _3, "cocotte": _3, "coolblog": _3, "cranky": _3, "cutegirl": _3, "daa": _3, "deca": _3, "deci": _3, "digick": _3, "egoism": _3, "fakefur": _3, "fem": _3, "flier": _3, "floppy": _3, "fool": _3, "frenchkiss": _3, "girlfriend": _3, "girly": _3, "gloomy": _3, "gonna": _3, "greater": _3, "hacca": _3, "heavy": _3, "her": _3, "hiho": _3, "hippy": _3, "holy": _3, "hungry": _3, "icurus": _3, "itigo": _3, "jellybean": _3, "kikirara": _3, "kill": _3, "kilo": _3, "kuron": _3, "littlestar": _3, "lolipopmc": _3, "lolitapunk": _3, "lomo": _3, "lovepop": _3, "lovesick": _3, "main": _3, "mods": _3, "mond": _3, "mongolian": _3, "moo": _3, "namaste": _3, "nikita": _3, "nobushi": _3, "noor": _3, "oops": _3, "parallel": _3, "parasite": _3, "pecori": _3, "peewee": _3, "penne": _3, "pepper": _3, "perma": _3, "pigboat": _3, "pinoko": _3, "punyu": _3, "pupu": _3, "pussycat": _3, "pya": _3, "raindrop": _3, "readymade": _3, "sadist": _3, "schoolbus": _3, "secret": _3, "staba": _3, "stripper": _3, "sub": _3, "sunnyday": _3, "thick": _3, "tonkotsu": _3, "under": _3, "upper": _3, "velvet": _3, "verse": _3, "versus": _3, "vivian": _3, "watson": _3, "weblike": _3, "whitesnow": _3, "zombie": _3, "blogspot": _3, "2-d": _3, "bona": _3, "crap": _3, "daynight": _3, "eek": _3, "flop": _3, "halfmoon": _3, "jeez": _3, "matrix": _3, "mimoza": _3, "netgamers": _3, "nyanta": _3, "o0o0": _3, "rdy": _3, "rgr": _3, "rulez": _3, "sakurastorage": { "$": 0, "succ": { "isk01": _12, "isk02": _12 } }, "saloon": _3, "sblo": _3, "skr": _3, "tank": _3, "uh-oh": _3, "undo": _3, "webaccel": { "$": 0, "succ": { "rs": _3, "user": _3 } }, "websozai": _3, "xii": _3 } }, "ke": { "$": 1, "succ": { "ac": _2, "co": _6, "go": _2, "info": _2, "me": _2, "mobi": _2, "ne": _2, "or": _2, "sc": _2 } }, "kg": { "$": 1, "succ": { "org": _2, "net": _2, "com": _2, "edu": _2, "gov": _2, "mil": _2, "blog": _3, "io": _3, "jp": _3, "tv": _3, "uk": _3, "us": _3 } }, "kh": _8, "ki": _33, "km": { "$": 1, "succ": { "org": _2, "nom": _2, "gov": _2, "prd": _2, "tm": _2, "edu": _2, "mil": _2, "ass": _2, "com": _2, "coop": _2, "asso": _2, "presse": _2, "medecin": _2, "notaires": _2, "pharmaciens": _2, "veterinaire": _2, "gouv": _2 } }, "kn": { "$": 1, "succ": { "net": _2, "org": _2, "edu": _2, "gov": _2 } }, "kp": { "$": 1, "succ": { "com": _2, "edu": _2, "gov": _2, "org": _2, "rep": _2, "tra": _2 } }, "kr": { "$": 1, "succ": { "ac": _2, "co": _2, "es": _2, "go": _2, "hs": _2, "kg": _2, "mil": _2, "ms": _2, "ne": _2, "or": _2, "pe": _2, "re": _2, "sc": _2, "busan": _2, "chungbuk": _2, "chungnam": _2, "daegu": _2, "daejeon": _2, "gangwon": _2, "gwangju": _2, "gyeongbuk": _2, "gyeonggi": _2, "gyeongnam": _2, "incheon": _2, "jeju": _2, "jeonbuk": _2, "jeonnam": _2, "seoul": _2, "ulsan": _2, "blogspot": _3 } }, "kw": { "$": 1, "succ": { "com": _2, "edu": _2, "emb": _2, "gov": _2, "ind": _2, "net": _2, "org": _2 } }, "ky": _25, "kz": { "$": 1, "succ": { "org": _2, "edu": _2, "net": _2, "gov": _2, "mil": _2, "com": _2, "jcloud": _3, "kazteleport": { "$": 0, "succ": { "upaas": _3 } } } }, "la": { "$": 1, "succ": { "int": _2, "net": _2, "info": _2, "edu": _2, "gov": _2, "per": _2, "com": _2, "org": _2, "bnr": _3, "c": _3 } }, "lb": _4, "lc": { "$": 1, "succ": { "com": _2, "net": _2, "co": _2, "org": _2, "edu": _2, "gov": _2, "oy": _3 } }, "li": { "$": 1, "succ": { "blogspot": _3, "caa": _3 } }, "lk": { "$": 1, "succ": { "gov": _2, "sch": _2, "net": _2, "int": _2, "com": _2, "org": _2, "edu": _2, "ngo": _2, "soc": _2, "web": _2, "ltd": _2, "assn": _2, "grp": _2, "hotel": _2, "ac": _2 } }, "lr": _4, "ls": { "$": 1, "succ": { "ac": _2, "biz": _2, "co": _2, "edu": _2, "gov": _2, "info": _2, "net": _2, "org": _2, "sc": _2, "de": _3 } }, "lt": _34, "lu": { "$": 1, "succ": { "blogspot": _3, "123website": _3 } }, "lv": { "$": 1, "succ": { "com": _2, "edu": _2, "gov": _2, "org": _2, "mil": _2, "id": _2, "net": _2, "asn": _2, "conf": _2 } }, "ly": { "$": 1, "succ": { "com": _2, "net": _2, "gov": _2, "plc": _2, "edu": _2, "sch": _2, "med": _2, "org": _2, "id": _2 } }, "ma": { "$": 1, "succ": { "co": _2, "net": _2, "gov": _2, "org": _2, "ac": _2, "press": _2 } }, "mc": { "$": 1, "succ": { "tm": _2, "asso": _2 } }, "md": { "$": 1, "succ": { "blogspot": _3, "at": _3, "de": _3, "jp": _3, "to": _3 } }, "me": { "$": 1, "succ": { "co": _2, "net": _2, "org": _2, "edu": _2, "ac": _2, "gov": _2, "its": _2, "priv": _2, "c66": _3, "daplie": { "$": 2, "succ": { "localhost": _3 } }, "edgestack": _3, "filegear": _3, "filegear-au": _3, "filegear-de": _3, "filegear-gb": _3, "filegear-ie": _3, "filegear-jp": _3, "filegear-sg": _3, "glitch": _3, "ravendb": _3, "lohmus": _3, "barsy": _3, "mcpe": _3, "mcdir": _3, "soundcast": _3, "tcp4": _3, "brasilia": _3, "ddns": _3, "dnsfor": _3, "hopto": _3, "loginto": _3, "noip": _3, "webhop": _3, "vp4": _3, "diskstation": _3, "dscloud": _3, "i234": _3, "myds": _3, "synology": _3, "transip": _23, "wedeploy": _3, "yombo": _3, "nohost": _3 } }, "mg": { "$": 1, "succ": { "org": _2, "nom": _2, "gov": _2, "prd": _2, "tm": _2, "edu": _2, "mil": _2, "com": _2, "co": _2 } }, "mh": _2, "mil": _2, "mk": { "$": 1, "succ": { "com": _2, "org": _2, "net": _2, "edu": _2, "gov": _2, "inf": _2, "name": _2, "blogspot": _3 } }, "ml": { "$": 1, "succ": { "com": _2, "edu": _2, "gouv": _2, "gov": _2, "net": _2, "org": _2, "presse": _2 } }, "mm": _8, "mn": { "$": 1, "succ": { "gov": _2, "edu": _2, "org": _2, "nyc": _3 } }, "mo": _4, "mobi": { "$": 1, "succ": { "barsy": _3, "dscloud": _3 } }, "mp": { "$": 1, "succ": { "ju": _3 } }, "mq": _2, "mr": _34, "ms": { "$": 1, "succ": { "com": _2, "edu": _2, "gov": _2, "net": _2, "org": _2, "lab": _3, "minisite": _3 } }, "mt": { "$": 1, "succ": { "com": _6, "edu": _2, "net": _2, "org": _2 } }, "mu": { "$": 1, "succ": { "com": _2, "net": _2, "org": _2, "gov": _2, "ac": _2, "co": _2, "or": _2 } }, "museum": { "$": 1, "succ": { "academy": _2, "agriculture": _2, "air": _2, "airguard": _2, "alabama": _2, "alaska": _2, "amber": _2, "ambulance": _2, "american": _2, "americana": _2, "americanantiques": _2, "americanart": _2, "amsterdam": _2, "and": _2, "annefrank": _2, "anthro": _2, "anthropology": _2, "antiques": _2, "aquarium": _2, "arboretum": _2, "archaeological": _2, "archaeology": _2, "architecture": _2, "art": _2, "artanddesign": _2, "artcenter": _2, "artdeco": _2, "arteducation": _2, "artgallery": _2, "arts": _2, "artsandcrafts": _2, "asmatart": _2, "assassination": _2, "assisi": _2, "association": _2, "astronomy": _2, "atlanta": _2, "austin": _2, "australia": _2, "automotive": _2, "aviation": _2, "axis": _2, "badajoz": _2, "baghdad": _2, "bahn": _2, "bale": _2, "baltimore": _2, "barcelona": _2, "baseball": _2, "basel": _2, "baths": _2, "bauern": _2, "beauxarts": _2, "beeldengeluid": _2, "bellevue": _2, "bergbau": _2, "berkeley": _2, "berlin": _2, "bern": _2, "bible": _2, "bilbao": _2, "bill": _2, "birdart": _2, "birthplace": _2, "bonn": _2, "boston": _2, "botanical": _2, "botanicalgarden": _2, "botanicgarden": _2, "botany": _2, "brandywinevalley": _2, "brasil": _2, "bristol": _2, "british": _2, "britishcolumbia": _2, "broadcast": _2, "brunel": _2, "brussel": _2, "brussels": _2, "bruxelles": _2, "building": _2, "burghof": _2, "bus": _2, "bushey": _2, "cadaques": _2, "california": _2, "cambridge": _2, "can": _2, "canada": _2, "capebreton": _2, "carrier": _2, "cartoonart": _2, "casadelamoneda": _2, "castle": _2, "castres": _2, "celtic": _2, "center": _2, "chattanooga": _2, "cheltenham": _2, "chesapeakebay": _2, "chicago": _2, "children": _2, "childrens": _2, "childrensgarden": _2, "chiropractic": _2, "chocolate": _2, "christiansburg": _2, "cincinnati": _2, "cinema": _2, "circus": _2, "civilisation": _2, "civilization": _2, "civilwar": _2, "clinton": _2, "clock": _2, "coal": _2, "coastaldefence": _2, "cody": _2, "coldwar": _2, "collection": _2, "colonialwilliamsburg": _2, "coloradoplateau": _2, "columbia": _2, "columbus": _2, "communication": _2, "communications": _2, "community": _2, "computer": _2, "computerhistory": _2, "xn--comunicaes-v6a2o": _2, "comunicações": _2, "contemporary": _2, "contemporaryart": _2, "convent": _2, "copenhagen": _2, "corporation": _2, "xn--correios-e-telecomunicaes-ghc29a": _2, "correios-e-telecomunicações": _2, "corvette": _2, "costume": _2, "countryestate": _2, "county": _2, "crafts": _2, "cranbrook": _2, "creation": _2, "cultural": _2, "culturalcenter": _2, "culture": _2, "cyber": _2, "cymru": _2, "dali": _2, "dallas": _2, "database": _2, "ddr": _2, "decorativearts": _2, "delaware": _2, "delmenhorst": _2, "denmark": _2, "depot": _2, "design": _2, "detroit": _2, "dinosaur": _2, "discovery": _2, "dolls": _2, "donostia": _2, "durham": _2, "eastafrica": _2, "eastcoast": _2, "education": _2, "educational": _2, "egyptian": _2, "eisenbahn": _2, "elburg": _2, "elvendrell": _2, "embroidery": _2, "encyclopedic": _2, "england": _2, "entomology": _2, "environment": _2, "environmentalconservation": _2, "epilepsy": _2, "essex": _2, "estate": _2, "ethnology": _2, "exeter": _2, "exhibition": _2, "family": _2, "farm": _2, "farmequipment": _2, "farmers": _2, "farmstead": _2, "field": _2, "figueres": _2, "filatelia": _2, "film": _2, "fineart": _2, "finearts": _2, "finland": _2, "flanders": _2, "florida": _2, "force": _2, "fortmissoula": _2, "fortworth": _2, "foundation": _2, "francaise": _2, "frankfurt": _2, "franziskaner": _2, "freemasonry": _2, "freiburg": _2, "fribourg": _2, "frog": _2, "fundacio": _2, "furniture": _2, "gallery": _2, "garden": _2, "gateway": _2, "geelvinck": _2, "gemological": _2, "geology": _2, "georgia": _2, "giessen": _2, "glas": _2, "glass": _2, "gorge": _2, "grandrapids": _2, "graz": _2, "guernsey": _2, "halloffame": _2, "hamburg": _2, "handson": _2, "harvestcelebration": _2, "hawaii": _2, "health": _2, "heimatunduhren": _2, "hellas": _2, "helsinki": _2, "hembygdsforbund": _2, "heritage": _2, "histoire": _2, "historical": _2, "historicalsociety": _2, "historichouses": _2, "historisch": _2, "historisches": _2, "history": _2, "historyofscience": _2, "horology": _2, "house": _2, "humanities": _2, "illustration": _2, "imageandsound": _2, "indian": _2, "indiana": _2, "indianapolis": _2, "indianmarket": _2, "intelligence": _2, "interactive": _2, "iraq": _2, "iron": _2, "isleofman": _2, "jamison": _2, "jefferson": _2, "jerusalem": _2, "jewelry": _2, "jewish": _2, "jewishart": _2, "jfk": _2, "journalism": _2, "judaica": _2, "judygarland": _2, "juedisches": _2, "juif": _2, "karate": _2, "karikatur": _2, "kids": _2, "koebenhavn": _2, "koeln": _2, "kunst": _2, "kunstsammlung": _2, "kunstunddesign": _2, "labor": _2, "labour": _2, "lajolla": _2, "lancashire": _2, "landes": _2, "lans": _2, "xn--lns-qla": _2, "läns": _2, "larsson": _2, "lewismiller": _2, "lincoln": _2, "linz": _2, "living": _2, "livinghistory": _2, "localhistory": _2, "london": _2, "losangeles": _2, "louvre": _2, "loyalist": _2, "lucerne": _2, "luxembourg": _2, "luzern": _2, "mad": _2, "madrid": _2, "mallorca": _2, "manchester": _2, "mansion": _2, "mansions": _2, "manx": _2, "marburg": _2, "maritime": _2, "maritimo": _2, "maryland": _2, "marylhurst": _2, "media": _2, "medical": _2, "medizinhistorisches": _2, "meeres": _2, "memorial": _2, "mesaverde": _2, "michigan": _2, "midatlantic": _2, "military": _2, "mill": _2, "miners": _2, "mining": _2, "minnesota": _2, "missile": _2, "missoula": _2, "modern": _2, "moma": _2, "money": _2, "monmouth": _2, "monticello": _2, "montreal": _2, "moscow": _2, "motorcycle": _2, "muenchen": _2, "muenster": _2, "mulhouse": _2, "muncie": _2, "museet": _2, "museumcenter": _2, "museumvereniging": _2, "music": _2, "national": _2, "nationalfirearms": _2, "nationalheritage": _2, "nativeamerican": _2, "naturalhistory": _2, "naturalhistorymuseum": _2, "naturalsciences": _2, "nature": _2, "naturhistorisches": _2, "natuurwetenschappen": _2, "naumburg": _2, "naval": _2, "nebraska": _2, "neues": _2, "newhampshire": _2, "newjersey": _2, "newmexico": _2, "newport": _2, "newspaper": _2, "newyork": _2, "niepce": _2, "norfolk": _2, "north": _2, "nrw": _2, "nyc": _2, "nyny": _2, "oceanographic": _2, "oceanographique": _2, "omaha": _2, "online": _2, "ontario": _2, "openair": _2, "oregon": _2, "oregontrail": _2, "otago": _2, "oxford": _2, "pacific": _2, "paderborn": _2, "palace": _2, "paleo": _2, "palmsprings": _2, "panama": _2, "paris": _2, "pasadena": _2, "pharmacy": _2, "philadelphia": _2, "philadelphiaarea": _2, "philately": _2, "phoenix": _2, "photography": _2, "pilots": _2, "pittsburgh": _2, "planetarium": _2, "plantation": _2, "plants": _2, "plaza": _2, "portal": _2, "portland": _2, "portlligat": _2, "posts-and-telecommunications": _2, "preservation": _2, "presidio": _2, "press": _2, "project": _2, "public": _2, "pubol": _2, "quebec": _2, "railroad": _2, "railway": _2, "research": _2, "resistance": _2, "riodejaneiro": _2, "rochester": _2, "rockart": _2, "roma": _2, "russia": _2, "saintlouis": _2, "salem": _2, "salvadordali": _2, "salzburg": _2, "sandiego": _2, "sanfrancisco": _2, "santabarbara": _2, "santacruz": _2, "santafe": _2, "saskatchewan": _2, "satx": _2, "savannahga": _2, "schlesisches": _2, "schoenbrunn": _2, "schokoladen": _2, "school": _2, "schweiz": _2, "science": _2, "scienceandhistory": _2, "scienceandindustry": _2, "sciencecenter": _2, "sciencecenters": _2, "science-fiction": _2, "sciencehistory": _2, "sciences": _2, "sciencesnaturelles": _2, "scotland": _2, "seaport": _2, "settlement": _2, "settlers": _2, "shell": _2, "sherbrooke": _2, "sibenik": _2, "silk": _2, "ski": _2, "skole": _2, "society": _2, "sologne": _2, "soundandvision": _2, "southcarolina": _2, "southwest": _2, "space": _2, "spy": _2, "square": _2, "stadt": _2, "stalbans": _2, "starnberg": _2, "state": _2, "stateofdelaware": _2, "station": _2, "steam": _2, "steiermark": _2, "stjohn": _2, "stockholm": _2, "stpetersburg": _2, "stuttgart": _2, "suisse": _2, "surgeonshall": _2, "surrey": _2, "svizzera": _2, "sweden": _2, "sydney": _2, "tank": _2, "tcm": _2, "technology": _2, "telekommunikation": _2, "television": _2, "texas": _2, "textile": _2, "theater": _2, "time": _2, "timekeeping": _2, "topology": _2, "torino": _2, "touch": _2, "town": _2, "transport": _2, "tree": _2, "trolley": _2, "trust": _2, "trustee": _2, "uhren": _2, "ulm": _2, "undersea": _2, "university": _2, "usa": _2, "usantiques": _2, "usarts": _2, "uscountryestate": _2, "usculture": _2, "usdecorativearts": _2, "usgarden": _2, "ushistory": _2, "ushuaia": _2, "uslivinghistory": _2, "utah": _2, "uvic": _2, "valley": _2, "vantaa": _2, "versailles": _2, "viking": _2, "village": _2, "virginia": _2, "virtual": _2, "virtuel": _2, "vlaanderen": _2, "volkenkunde": _2, "wales": _2, "wallonie": _2, "war": _2, "washingtondc": _2, "watchandclock": _2, "watch-and-clock": _2, "western": _2, "westfalen": _2, "whaling": _2, "wildlife": _2, "williamsburg": _2, "windmill": _2, "workshop": _2, "york": _2, "yorkshire": _2, "yosemite": _2, "youth": _2, "zoological": _2, "zoology": _2, "xn--9dbhblg6di": _2, "ירושלים": _2, "xn--h1aegh": _2, "иком": _2 } }, "mv": { "$": 1, "succ": { "aero": _2, "biz": _2, "com": _2, "coop": _2, "edu": _2, "gov": _2, "info": _2, "int": _2, "mil": _2, "museum": _2, "name": _2, "net": _2, "org": _2, "pro": _2 } }, "mw": { "$": 1, "succ": { "ac": _2, "biz": _2, "co": _2, "com": _2, "coop": _2, "edu": _2, "gov": _2, "int": _2, "museum": _2, "net": _2, "org": _2 } }, "mx": { "$": 1, "succ": { "com": _2, "org": _2, "gob": _2, "edu": _2, "net": _2, "blogspot": _3 } }, "my": { "$": 1, "succ": { "biz": _2, "com": _2, "edu": _2, "gov": _2, "mil": _2, "name": _2, "net": _2, "org": _2, "blogspot": _3 } }, "mz": { "$": 1, "succ": { "ac": _2, "adv": _2, "co": _2, "edu": _2, "gov": _2, "mil": _2, "net": _2, "org": _2 } }, "na": { "$": 1, "succ": { "info": _2, "pro": _2, "name": _2, "school": _2, "or": _2, "dr": _2, "us": _2, "mx": _2, "ca": _2, "in": _2, "cc": _2, "tv": _2, "ws": _2, "mobi": _2, "co": _2, "com": _2, "org": _2 } }, "name": { "$": 1, "succ": { "her": _37, "his": _37 } }, "nc": { "$": 1, "succ": { "asso": _2, "nom": _2 } }, "ne": _2, "net": { "$": 1, "succ": { "adobeaemcloud": _3, "adobeio-static": _3, "adobeioruntime": _3, "akadns": _3, "akamai": _3, "akamai-staging": _3, "akamaiedge": _3, "akamaiedge-staging": _3, "akamaihd": _3, "akamaihd-staging": _3, "akamaiorigin": _3, "akamaiorigin-staging": _3, "akamaized": _3, "akamaized-staging": _3, "edgekey": _3, "edgekey-staging": _3, "edgesuite": _3, "edgesuite-staging": _3, "alwaysdata": _3, "myamaze": _3, "cloudfront": _3, "t3l3p0rt": _3, "appudo": _3, "atlassian-dev": { "$": 0, "succ": { "prod": { "$": 0, "succ": { "cdn": _3 } } } }, "myfritz": _3, "onavstack": _3, "shopselect": _3, "blackbaudcdn": _3, "boomla": _3, "bplaced": _3, "square7": _3, "gb": _3, "hu": _3, "jp": _3, "se": _3, "uk": _3, "in": _3, "clickrising": _3, "cloudaccess": _3, "cdn77-ssl": _3, "cdn77": { "$": 0, "succ": { "r": _3 } }, "feste-ip": _3, "knx-server": _3, "static-access": _3, "cryptonomic": _5, "dattolocal": _3, "mydatto": _3, "debian": _3, "bitbridge": _3, "at-band-camp": _3, "blogdns": _3, "broke-it": _3, "buyshouses": _3, "dnsalias": _3, "dnsdojo": _3, "does-it": _3, "dontexist": _3, "dynalias": _3, "dynathome": _3, "endofinternet": _3, "from-az": _3, "from-co": _3, "from-la": _3, "from-ny": _3, "gets-it": _3, "ham-radio-op": _3, "homeftp": _3, "homeip": _3, "homelinux": _3, "homeunix": _3, "in-the-band": _3, "is-a-chef": _3, "is-a-geek": _3, "isa-geek": _3, "kicks-ass": _3, "office-on-the": _3, "podzone": _3, "scrapper-site": _3, "selfip": _3, "sells-it": _3, "servebbs": _3, "serveftp": _3, "thruhere": _3, "webhop": _3, "definima": _3, "casacam": _3, "dynu": _3, "dynv6": _3, "twmail": _3, "ru": _3, "channelsdvr": { "$": 2, "succ": { "u": _3 } }, "fastlylb": { "$": 2, "succ": { "map": _3 } }, "fastly": { "$": 0, "succ": { "freetls": _3, "map": _3, "prod": { "$": 0, "succ": { "a": _3, "global": _3 } }, "ssl": { "$": 0, "succ": { "a": _3, "b": _3, "global": _3 } } } }, "edgeapp": _3, "flynnhosting": _3, "cdn-edges": _3, "heteml": _3, "cloudfunctions": _3, "moonscale": _3, "in-dsl": _3, "in-vpn": _3, "ipifony": _3, "iobb": _3, "cloudjiffy": { "$": 2, "succ": { "fra1-de": _3, "west1-us": _3 } }, "elastx": { "$": 0, "succ": { "jls-sto1": _3, "jls-sto2": _3, "jls-sto3": _3 } }, "faststacks": _3, "massivegrid": { "$": 0, "succ": { "paas": { "$": 0, "succ": { "fr-1": _3, "lon-1": _3, "lon-2": _3, "ny-1": _3, "ny-2": _3, "sg-1": _3 } } } }, "saveincloud": { "$": 0, "succ": { "jelastic": _3, "nordeste-idc": _3 } }, "scaleforce": _26, "tsukaeru": _27, "kinghost": _3, "uni5": _3, "krellian": _3, "barsy": _3, "memset": _3, "azurewebsites": _3, "azure-mobile": _3, "cloudapp": _3, "azurestaticapps": { "$": 2, "succ": { "1": _3, "2": _3, "3": _3, "centralus": _3, "eastasia": _3, "eastus2": _3, "westeurope": _3, "westus2": _3 } }, "dnsup": _3, "hicam": _3, "now-dns": _3, "ownip": _3, "vpndns": _3, "eating-organic": _3, "mydissent": _3, "myeffect": _3, "mymediapc": _3, "mypsx": _3, "mysecuritycamera": _3, "nhlfan": _3, "no-ip": _3, "pgafan": _3, "privatizehealthinsurance": _3, "bounceme": _3, "ddns": _3, "redirectme": _3, "serveblog": _3, "serveminecraft": _3, "sytes": _3, "cloudycluster": _3, "ovh": { "$": 0, "succ": { "webpaas": _5, "hosting": _5 } }, "bar0": _3, "bar1": _3, "bar2": _3, "rackmaze": _3, "squares": _3, "schokokeks": _3, "firewall-gateway": _3, "seidat": _3, "senseering": _3, "siteleaf": _3, "vps-host": { "$": 2, "succ": { "jelastic": { "$": 0, "succ": { "atl": _3, "njs": _3, "ric": _3 } } } }, "myspreadshop": _3, "srcf": { "$": 0, "succ": { "soc": _3, "user": _3 } }, "supabase": _3, "dsmynas": _3, "familyds": _3, "tailscale": { "$": 0, "succ": { "beta": _3 } }, "ts": _3, "torproject": { "$": 2, "succ": { "pages": _3 } }, "reserve-online": _3, "community-pro": _3, "meinforum": _3, "yandexcloud": { "$": 2, "succ": { "storage": _3, "website": _3 } }, "za": _3 } }, "nf": { "$": 1, "succ": { "com": _2, "net": _2, "per": _2, "rec": _2, "web": _2, "arts": _2, "firm": _2, "info": _2, "other": _2, "store": _2 } }, "ng": { "$": 1, "succ": { "com": _6, "edu": _2, "gov": _2, "i": _2, "mil": _2, "mobi": _2, "name": _2, "net": _2, "org": _2, "sch": _2, "col": _3, "firm": _3, "gen": _3, "ltd": _3, "ngo": _3 } }, "ni": { "$": 1, "succ": { "ac": _2, "biz": _2, "co": _2, "com": _2, "edu": _2, "gob": _2, "in": _2, "info": _2, "int": _2, "mil": _2, "net": _2, "nom": _2, "org": _2, "web": _2 } }, "nl": { "$": 1, "succ": { "co": _3, "hosting-cluster": _3, "blogspot": _3, "gov": _3, "khplay": _3, "123website": _3, "myspreadshop": _3, "transurl": _5, "cistron": _3, "demon": _3 } }, "no": { "$": 1, "succ": { "fhs": _2, "vgs": _2, "fylkesbibl": _2, "folkebibl": _2, "museum": _2, "idrett": _2, "priv": _2, "mil": _2, "stat": _2, "dep": _2, "kommune": _2, "herad": _2, "aa": _38, "ah": _38, "bu": _38, "fm": _38, "hl": _38, "hm": _38, "jan-mayen": _38, "mr": _38, "nl": _38, "nt": _38, "of": _38, "ol": _38, "oslo": _38, "rl": _38, "sf": _38, "st": _38, "svalbard": _38, "tm": _38, "tr": _38, "va": _38, "vf": _38, "akrehamn": _2, "xn--krehamn-dxa": _2, "åkrehamn": _2, "algard": _2, "xn--lgrd-poac": _2, "ålgård": _2, "arna": _2, "brumunddal": _2, "bryne": _2, "bronnoysund": _2, "xn--brnnysund-m8ac": _2, "brønnøysund": _2, "drobak": _2, "xn--drbak-wua": _2, "drøbak": _2, "egersund": _2, "fetsund": _2, "floro": _2, "xn--flor-jra": _2, "florø": _2, "fredrikstad": _2, "hokksund": _2, "honefoss": _2, "xn--hnefoss-q1a": _2, "hønefoss": _2, "jessheim": _2, "jorpeland": _2, "xn--jrpeland-54a": _2, "jørpeland": _2, "kirkenes": _2, "kopervik": _2, "krokstadelva": _2, "langevag": _2, "xn--langevg-jxa": _2, "langevåg": _2, "leirvik": _2, "mjondalen": _2, "xn--mjndalen-64a": _2, "mjøndalen": _2, "mo-i-rana": _2, "mosjoen": _2, "xn--mosjen-eya": _2, "mosjøen": _2, "nesoddtangen": _2, "orkanger": _2, "osoyro": _2, "xn--osyro-wua": _2, "osøyro": _2, "raholt": _2, "xn--rholt-mra": _2, "råholt": _2, "sandnessjoen": _2, "xn--sandnessjen-ogb": _2, "sandnessjøen": _2, "skedsmokorset": _2, "slattum": _2, "spjelkavik": _2, "stathelle": _2, "stavern": _2, "stjordalshalsen": _2, "xn--stjrdalshalsen-sqb": _2, "stjørdalshalsen": _2, "tananger": _2, "tranby": _2, "vossevangen": _2, "afjord": _2, "xn--fjord-lra": _2, "åfjord": _2, "agdenes": _2, "al": _2, "xn--l-1fa": _2, "ål": _2, "alesund": _2, "xn--lesund-hua": _2, "ålesund": _2, "alstahaug": _2, "alta": _2, "xn--lt-liac": _2, "áltá": _2, "alaheadju": _2, "xn--laheadju-7ya": _2, "álaheadju": _2, "alvdal": _2, "amli": _2, "xn--mli-tla": _2, "åmli": _2, "amot": _2, "xn--mot-tla": _2, "åmot": _2, "andebu": _2, "andoy": _2, "xn--andy-ira": _2, "andøy": _2, "andasuolo": _2, "ardal": _2, "xn--rdal-poa": _2, "årdal": _2, "aremark": _2, "arendal": _2, "xn--s-1fa": _2, "ås": _2, "aseral": _2, "xn--seral-lra": _2, "åseral": _2, "asker": _2, "askim": _2, "askvoll": _2, "askoy": _2, "xn--asky-ira": _2, "askøy": _2, "asnes": _2, "xn--snes-poa": _2, "åsnes": _2, "audnedaln": _2, "aukra": _2, "aure": _2, "aurland": _2, "aurskog-holand": _2, "xn--aurskog-hland-jnb": _2, "aurskog-høland": _2, "austevoll": _2, "austrheim": _2, "averoy": _2, "xn--avery-yua": _2, "averøy": _2, "balestrand": _2, "ballangen": _2, "balat": _2, "xn--blt-elab": _2, "bálát": _2, "balsfjord": _2, "bahccavuotna": _2, "xn--bhccavuotna-k7a": _2, "báhccavuotna": _2, "bamble": _2, "bardu": _2, "beardu": _2, "beiarn": _2, "bajddar": _2, "xn--bjddar-pta": _2, "bájddar": _2, "baidar": _2, "xn--bidr-5nac": _2, "báidár": _2, "berg": _2, "bergen": _2, "berlevag": _2, "xn--berlevg-jxa": _2, "berlevåg": _2, "bearalvahki": _2, "xn--bearalvhki-y4a": _2, "bearalváhki": _2, "bindal": _2, "birkenes": _2, "bjarkoy": _2, "xn--bjarky-fya": _2, "bjarkøy": _2, "bjerkreim": _2, "bjugn": _2, "bodo": _2, "xn--bod-2na": _2, "bodø": _2, "badaddja": _2, "xn--bdddj-mrabd": _2, "bådåddjå": _2, "budejju": _2, "bokn": _2, "bremanger": _2, "bronnoy": _2, "xn--brnny-wuac": _2, "brønnøy": _2, "bygland": _2, "bykle": _2, "barum": _2, "xn--brum-voa": _2, "bærum": _2, "telemark": { "$": 0, "succ": { "bo": _2, "xn--b-5ga": _2, "bø": _2 } }, "nordland": { "$": 0, "succ": { "bo": _2, "xn--b-5ga": _2, "bø": _2, "heroy": _2, "xn--hery-ira": _2, "herøy": _2 } }, "bievat": _2, "xn--bievt-0qa": _2, "bievát": _2, "bomlo": _2, "xn--bmlo-gra": _2, "bømlo": _2, "batsfjord": _2, "xn--btsfjord-9za": _2, "båtsfjord": _2, "bahcavuotna": _2, "xn--bhcavuotna-s4a": _2, "báhcavuotna": _2, "dovre": _2, "drammen": _2, "drangedal": _2, "dyroy": _2, "xn--dyry-ira": _2, "dyrøy": _2, "donna": _2, "xn--dnna-gra": _2, "dønna": _2, "eid": _2, "eidfjord": _2, "eidsberg": _2, "eidskog": _2, "eidsvoll": _2, "eigersund": _2, "elverum": _2, "enebakk": _2, "engerdal": _2, "etne": _2, "etnedal": _2, "evenes": _2, "evenassi": _2, "xn--eveni-0qa01ga": _2, "evenášši": _2, "evje-og-hornnes": _2, "farsund": _2, "fauske": _2, "fuossko": _2, "fuoisku": _2, "fedje": _2, "fet": _2, "finnoy": _2, "xn--finny-yua": _2, "finnøy": _2, "fitjar": _2, "fjaler": _2, "fjell": _2, "flakstad": _2, "flatanger": _2, "flekkefjord": _2, "flesberg": _2, "flora": _2, "fla": _2, "xn--fl-zia": _2, "flå": _2, "folldal": _2, "forsand": _2, "fosnes": _2, "frei": _2, "frogn": _2, "froland": _2, "frosta": _2, "frana": _2, "xn--frna-woa": _2, "fræna": _2, "froya": _2, "xn--frya-hra": _2, "frøya": _2, "fusa": _2, "fyresdal": _2, "forde": _2, "xn--frde-gra": _2, "førde": _2, "gamvik": _2, "gangaviika": _2, "xn--ggaviika-8ya47h": _2, "gáŋgaviika": _2, "gaular": _2, "gausdal": _2, "gildeskal": _2, "xn--gildeskl-g0a": _2, "gildeskål": _2, "giske": _2, "gjemnes": _2, "gjerdrum": _2, "gjerstad": _2, "gjesdal": _2, "gjovik": _2, "xn--gjvik-wua": _2, "gjøvik": _2, "gloppen": _2, "gol": _2, "gran": _2, "grane": _2, "granvin": _2, "gratangen": _2, "grimstad": _2, "grong": _2, "kraanghke": _2, "xn--kranghke-b0a": _2, "kråanghke": _2, "grue": _2, "gulen": _2, "hadsel": _2, "halden": _2, "halsa": _2, "hamar": _2, "hamaroy": _2, "habmer": _2, "xn--hbmer-xqa": _2, "hábmer": _2, "hapmir": _2, "xn--hpmir-xqa": _2, "hápmir": _2, "hammerfest": _2, "hammarfeasta": _2, "xn--hmmrfeasta-s4ac": _2, "hámmárfeasta": _2, "haram": _2, "hareid": _2, "harstad": _2, "hasvik": _2, "aknoluokta": _2, "xn--koluokta-7ya57h": _2, "ákŋoluokta": _2, "hattfjelldal": _2, "aarborte": _2, "haugesund": _2, "hemne": _2, "hemnes": _2, "hemsedal": _2, "more-og-romsdal": { "$": 0, "succ": { "heroy": _2, "sande": _2 } }, "xn--mre-og-romsdal-qqb": { "$": 0, "succ": { "xn--hery-ira": _2, "sande": _2 } }, "møre-og-romsdal": { "$": 0, "succ": { "herøy": _2, "sande": _2 } }, "hitra": _2, "hjartdal": _2, "hjelmeland": _2, "hobol": _2, "xn--hobl-ira": _2, "hobøl": _2, "hof": _2, "hol": _2, "hole": _2, "holmestrand": _2, "holtalen": _2, "xn--holtlen-hxa": _2, "holtålen": _2, "hornindal": _2, "horten": _2, "hurdal": _2, "hurum": _2, "hvaler": _2, "hyllestad": _2, "hagebostad": _2, "xn--hgebostad-g3a": _2, "hægebostad": _2, "hoyanger": _2, "xn--hyanger-q1a": _2, "høyanger": _2, "hoylandet": _2, "xn--hylandet-54a": _2, "høylandet": _2, "ha": _2, "xn--h-2fa": _2, "hå": _2, "ibestad": _2, "inderoy": _2, "xn--indery-fya": _2, "inderøy": _2, "iveland": _2, "jevnaker": _2, "jondal": _2, "jolster": _2, "xn--jlster-bya": _2, "jølster": _2, "karasjok": _2, "karasjohka": _2, "xn--krjohka-hwab49j": _2, "kárášjohka": _2, "karlsoy": _2, "galsa": _2, "xn--gls-elac": _2, "gálsá": _2, "karmoy": _2, "xn--karmy-yua": _2, "karmøy": _2, "kautokeino": _2, "guovdageaidnu": _2, "klepp": _2, "klabu": _2, "xn--klbu-woa": _2, "klæbu": _2, "kongsberg": _2, "kongsvinger": _2, "kragero": _2, "xn--krager-gya": _2, "kragerø": _2, "kristiansand": _2, "kristiansund": _2, "krodsherad": _2, "xn--krdsherad-m8a": _2, "krødsherad": _2, "kvalsund": _2, "rahkkeravju": _2, "xn--rhkkervju-01af": _2, "ráhkkerávju": _2, "kvam": _2, "kvinesdal": _2, "kvinnherad": _2, "kviteseid": _2, "kvitsoy": _2, "xn--kvitsy-fya": _2, "kvitsøy": _2, "kvafjord": _2, "xn--kvfjord-nxa": _2, "kvæfjord": _2, "giehtavuoatna": _2, "kvanangen": _2, "xn--kvnangen-k0a": _2, "kvænangen": _2, "navuotna": _2, "xn--nvuotna-hwa": _2, "návuotna": _2, "kafjord": _2, "xn--kfjord-iua": _2, "kåfjord": _2, "gaivuotna": _2, "xn--givuotna-8ya": _2, "gáivuotna": _2, "larvik": _2, "lavangen": _2, "lavagis": _2, "loabat": _2, "xn--loabt-0qa": _2, "loabát": _2, "lebesby": _2, "davvesiida": _2, "leikanger": _2, "leirfjord": _2, "leka": _2, "leksvik": _2, "lenvik": _2, "leangaviika": _2, "xn--leagaviika-52b": _2, "leaŋgaviika": _2, "lesja": _2, "levanger": _2, "lier": _2, "lierne": _2, "lillehammer": _2, "lillesand": _2, "lindesnes": _2, "lindas": _2, "xn--linds-pra": _2, "lindås": _2, "lom": _2, "loppa": _2, "lahppi": _2, "xn--lhppi-xqa": _2, "láhppi": _2, "lund": _2, "lunner": _2, "luroy": _2, "xn--lury-ira": _2, "lurøy": _2, "luster": _2, "lyngdal": _2, "lyngen": _2, "ivgu": _2, "lardal": _2, "lerdal": _2, "xn--lrdal-sra": _2, "lærdal": _2, "lodingen": _2, "xn--ldingen-q1a": _2, "lødingen": _2, "lorenskog": _2, "xn--lrenskog-54a": _2, "lørenskog": _2, "loten": _2, "xn--lten-gra": _2, "løten": _2, "malvik": _2, "masoy": _2, "xn--msy-ula0h": _2, "måsøy": _2, "muosat": _2, "xn--muost-0qa": _2, "muosát": _2, "mandal": _2, "marker": _2, "marnardal": _2, "masfjorden": _2, "meland": _2, "meldal": _2, "melhus": _2, "meloy": _2, "xn--mely-ira": _2, "meløy": _2, "meraker": _2, "xn--merker-kua": _2, "meråker": _2, "moareke": _2, "xn--moreke-jua": _2, "moåreke": _2, "midsund": _2, "midtre-gauldal": _2, "modalen": _2, "modum": _2, "molde": _2, "moskenes": _2, "moss": _2, "mosvik": _2, "malselv": _2, "xn--mlselv-iua": _2, "målselv": _2, "malatvuopmi": _2, "xn--mlatvuopmi-s4a": _2, "málatvuopmi": _2, "namdalseid": _2, "aejrie": _2, "namsos": _2, "namsskogan": _2, "naamesjevuemie": _2, "xn--nmesjevuemie-tcba": _2, "nååmesjevuemie": _2, "laakesvuemie": _2, "nannestad": _2, "narvik": _2, "narviika": _2, "naustdal": _2, "nedre-eiker": _2, "akershus": _39, "buskerud": _39, "nesna": _2, "nesodden": _2, "nesseby": _2, "unjarga": _2, "xn--unjrga-rta": _2, "unjárga": _2, "nesset": _2, "nissedal": _2, "nittedal": _2, "nord-aurdal": _2, "nord-fron": _2, "nord-odal": _2, "norddal": _2, "nordkapp": _2, "davvenjarga": _2, "xn--davvenjrga-y4a": _2, "davvenjárga": _2, "nordre-land": _2, "nordreisa": _2, "raisa": _2, "xn--risa-5na": _2, "ráisa": _2, "nore-og-uvdal": _2, "notodden": _2, "naroy": _2, "xn--nry-yla5g": _2, "nærøy": _2, "notteroy": _2, "xn--nttery-byae": _2, "nøtterøy": _2, "odda": _2, "oksnes": _2, "xn--ksnes-uua": _2, "øksnes": _2, "oppdal": _2, "oppegard": _2, "xn--oppegrd-ixa": _2, "oppegård": _2, "orkdal": _2, "orland": _2, "xn--rland-uua": _2, "ørland": _2, "orskog": _2, "xn--rskog-uua": _2, "ørskog": _2, "orsta": _2, "xn--rsta-fra": _2, "ørsta": _2, "hedmark": { "$": 0, "succ": { "os": _2, "valer": _2, "xn--vler-qoa": _2, "våler": _2 } }, "hordaland": { "$": 0, "succ": { "os": _2 } }, "osen": _2, "osteroy": _2, "xn--ostery-fya": _2, "osterøy": _2, "ostre-toten": _2, "xn--stre-toten-zcb": _2, "østre-toten": _2, "overhalla": _2, "ovre-eiker": _2, "xn--vre-eiker-k8a": _2, "øvre-eiker": _2, "oyer": _2, "xn--yer-zna": _2, "øyer": _2, "oygarden": _2, "xn--ygarden-p1a": _2, "øygarden": _2, "oystre-slidre": _2, "xn--ystre-slidre-ujb": _2, "øystre-slidre": _2, "porsanger": _2, "porsangu": _2, "xn--porsgu-sta26f": _2, "porsáŋgu": _2, "porsgrunn": _2, "radoy": _2, "xn--rady-ira": _2, "radøy": _2, "rakkestad": _2, "rana": _2, "ruovat": _2, "randaberg": _2, "rauma": _2, "rendalen": _2, "rennebu": _2, "rennesoy": _2, "xn--rennesy-v1a": _2, "rennesøy": _2, "rindal": _2, "ringebu": _2, "ringerike": _2, "ringsaker": _2, "rissa": _2, "risor": _2, "xn--risr-ira": _2, "risør": _2, "roan": _2, "rollag": _2, "rygge": _2, "ralingen": _2, "xn--rlingen-mxa": _2, "rælingen": _2, "rodoy": _2, "xn--rdy-0nab": _2, "rødøy": _2, "romskog": _2, "xn--rmskog-bya": _2, "rømskog": _2, "roros": _2, "xn--rros-gra": _2, "røros": _2, "rost": _2, "xn--rst-0na": _2, "røst": _2, "royken": _2, "xn--ryken-vua": _2, "røyken": _2, "royrvik": _2, "xn--ryrvik-bya": _2, "røyrvik": _2, "rade": _2, "xn--rde-ula": _2, "råde": _2, "salangen": _2, "siellak": _2, "saltdal": _2, "salat": _2, "xn--slt-elab": _2, "sálát": _2, "xn--slat-5na": _2, "sálat": _2, "samnanger": _2, "vestfold": { "$": 0, "succ": { "sande": _2 } }, "sandefjord": _2, "sandnes": _2, "sandoy": _2, "xn--sandy-yua": _2, "sandøy": _2, "sarpsborg": _2, "sauda": _2, "sauherad": _2, "sel": _2, "selbu": _2, "selje": _2, "seljord": _2, "sigdal": _2, "siljan": _2, "sirdal": _2, "skaun": _2, "skedsmo": _2, "ski": _2, "skien": _2, "skiptvet": _2, "skjervoy": _2, "xn--skjervy-v1a": _2, "skjervøy": _2, "skierva": _2, "xn--skierv-uta": _2, "skiervá": _2, "skjak": _2, "xn--skjk-soa": _2, "skjåk": _2, "skodje": _2, "skanland": _2, "xn--sknland-fxa": _2, "skånland": _2, "skanit": _2, "xn--sknit-yqa": _2, "skánit": _2, "smola": _2, "xn--smla-hra": _2, "smøla": _2, "snillfjord": _2, "snasa": _2, "xn--snsa-roa": _2, "snåsa": _2, "snoasa": _2, "snaase": _2, "xn--snase-nra": _2, "snåase": _2, "sogndal": _2, "sokndal": _2, "sola": _2, "solund": _2, "songdalen": _2, "sortland": _2, "spydeberg": _2, "stange": _2, "stavanger": _2, "steigen": _2, "steinkjer": _2, "stjordal": _2, "xn--stjrdal-s1a": _2, "stjørdal": _2, "stokke": _2, "stor-elvdal": _2, "stord": _2, "stordal": _2, "storfjord": _2, "omasvuotna": _2, "strand": _2, "stranda": _2, "stryn": _2, "sula": _2, "suldal": _2, "sund": _2, "sunndal": _2, "surnadal": _2, "sveio": _2, "svelvik": _2, "sykkylven": _2, "sogne": _2, "xn--sgne-gra": _2, "søgne": _2, "somna": _2, "xn--smna-gra": _2, "sømna": _2, "sondre-land": _2, "xn--sndre-land-0cb": _2, "søndre-land": _2, "sor-aurdal": _2, "xn--sr-aurdal-l8a": _2, "sør-aurdal": _2, "sor-fron": _2, "xn--sr-fron-q1a": _2, "sør-fron": _2, "sor-odal": _2, "xn--sr-odal-q1a": _2, "sør-odal": _2, "sor-varanger": _2, "xn--sr-varanger-ggb": _2, "sør-varanger": _2, "matta-varjjat": _2, "xn--mtta-vrjjat-k7af": _2, "mátta-várjjat": _2, "sorfold": _2, "xn--srfold-bya": _2, "sørfold": _2, "sorreisa": _2, "xn--srreisa-q1a": _2, "sørreisa": _2, "sorum": _2, "xn--srum-gra": _2, "sørum": _2, "tana": _2, "deatnu": _2, "time": _2, "tingvoll": _2, "tinn": _2, "tjeldsund": _2, "dielddanuorri": _2, "tjome": _2, "xn--tjme-hra": _2, "tjøme": _2, "tokke": _2, "tolga": _2, "torsken": _2, "tranoy": _2, "xn--trany-yua": _2, "tranøy": _2, "tromso": _2, "xn--troms-zua": _2, "tromsø": _2, "tromsa": _2, "romsa": _2, "trondheim": _2, "troandin": _2, "trysil": _2, "trana": _2, "xn--trna-woa": _2, "træna": _2, "trogstad": _2, "xn--trgstad-r1a": _2, "trøgstad": _2, "tvedestrand": _2, "tydal": _2, "tynset": _2, "tysfjord": _2, "divtasvuodna": _2, "divttasvuotna": _2, "tysnes": _2, "tysvar": _2, "xn--tysvr-vra": _2, "tysvær": _2, "tonsberg": _2, "xn--tnsberg-q1a": _2, "tønsberg": _2, "ullensaker": _2, "ullensvang": _2, "ulvik": _2, "utsira": _2, "vadso": _2, "xn--vads-jra": _2, "vadsø": _2, "cahcesuolo": _2, "xn--hcesuolo-7ya35b": _2, "čáhcesuolo": _2, "vaksdal": _2, "valle": _2, "vang": _2, "vanylven": _2, "vardo": _2, "xn--vard-jra": _2, "vardø": _2, "varggat": _2, "xn--vrggt-xqad": _2, "várggát": _2, "vefsn": _2, "vaapste": _2, "vega": _2, "vegarshei": _2, "xn--vegrshei-c0a": _2, "vegårshei": _2, "vennesla": _2, "verdal": _2, "verran": _2, "vestby": _2, "vestnes": _2, "vestre-slidre": _2, "vestre-toten": _2, "vestvagoy": _2, "xn--vestvgy-ixa6o": _2, "vestvågøy": _2, "vevelstad": _2, "vik": _2, "vikna": _2, "vindafjord": _2, "volda": _2, "voss": _2, "varoy": _2, "xn--vry-yla5g": _2, "værøy": _2, "vagan": _2, "xn--vgan-qoa": _2, "vågan": _2, "voagat": _2, "vagsoy": _2, "xn--vgsy-qoa0j": _2, "vågsøy": _2, "vaga": _2, "xn--vg-yiab": _2, "vågå": _2, "ostfold": { "$": 0, "succ": { "valer": _2 } }, "xn--stfold-9xa": { "$": 0, "succ": { "xn--vler-qoa": _2 } }, "østfold": { "$": 0, "succ": { "våler": _2 } }, "co": _3, "blogspot": _3, "123hjemmeside": _3, "myspreadshop": _3 } }, "np": _8, "nr": _33, "nu": { "$": 1, "succ": { "merseine": _3, "mine": _3, "shacknet": _3, "enterprisecloud": _3 } }, "nz": { "$": 1, "succ": { "ac": _2, "co": _6, "cri": _2, "geek": _2, "gen": _2, "govt": _2, "health": _2, "iwi": _2, "kiwi": _2, "maori": _2, "mil": _2, "xn--mori-qsa": _2, "māori": _2, "net": _2, "org": _2, "parliament": _2, "school": _2 } }, "om": { "$": 1, "succ": { "co": _2, "com": _2, "edu": _2, "gov": _2, "med": _2, "museum": _2, "net": _2, "org": _2, "pro": _2 } }, "onion": _2, "org": { "$": 1, "succ": { "altervista": _3, "amune": { "$": 0, "succ": { "tele": _3 } }, "pimienta": _3, "poivron": _3, "potager": _3, "sweetpepper": _3, "ae": _3, "us": _3, "certmgr": _3, "cdn77": { "$": 0, "succ": { "c": _3, "rsc": _3 } }, "cdn77-secure": { "$": 0, "succ": { "origin": { "$": 0, "succ": { "ssl": _3 } } } }, "cloudns": _3, "duckdns": _3, "tunk": _3, "dyndns": { "$": 2, "succ": { "go": _3, "home": _3 } }, "blogdns": _3, "blogsite": _3, "boldlygoingnowhere": _3, "dnsalias": _3, "dnsdojo": _3, "doesntexist": _3, "dontexist": _3, "doomdns": _3, "dvrdns": _3, "dynalias": _3, "endofinternet": _3, "endoftheinternet": _3, "from-me": _3, "game-host": _3, "gotdns": _3, "hobby-site": _3, "homedns": _3, "homeftp": _3, "homelinux": _3, "homeunix": _3, "is-a-bruinsfan": _3, "is-a-candidate": _3, "is-a-celticsfan": _3, "is-a-chef": _3, "is-a-geek": _3, "is-a-knight": _3, "is-a-linux-user": _3, "is-a-patsfan": _3, "is-a-soxfan": _3, "is-found": _3, "is-lost": _3, "is-saved": _3, "is-very-bad": _3, "is-very-evil": _3, "is-very-good": _3, "is-very-nice": _3, "is-very-sweet": _3, "isa-geek": _3, "kicks-ass": _3, "misconfused": _3, "podzone": _3, "readmyblog": _3, "selfip": _3, "sellsyourhome": _3, "servebbs": _3, "serveftp": _3, "servegame": _3, "stuff-4-sale": _3, "webhop": _3, "ddnss": _3, "accesscam": _3, "camdvr": _3, "freeddns": _3, "mywire": _3, "webredirect": _3, "eu": { "$": 2, "succ": { "al": _3, "asso": _3, "at": _3, "au": _3, "be": _3, "bg": _3, "ca": _3, "cd": _3, "ch": _3, "cn": _3, "cy": _3, "cz": _3, "de": _3, "dk": _3, "edu": _3, "ee": _3, "es": _3, "fi": _3, "fr": _3, "gr": _3, "hr": _3, "hu": _3, "ie": _3, "il": _3, "in": _3, "int": _3, "is": _3, "it": _3, "jp": _3, "kr": _3, "lt": _3, "lu": _3, "lv": _3, "mc": _3, "me": _3, "mk": _3, "mt": _3, "my": _3, "net": _3, "ng": _3, "nl": _3, "no": _3, "nz": _3, "paris": _3, "pl": _3, "pt": _3, "q-a": _3, "ro": _3, "ru": _3, "se": _3, "si": _3, "sk": _3, "tr": _3, "uk": _3, "us": _3 } }, "twmail": _3, "fedorainfracloud": _3, "fedorapeople": _3, "fedoraproject": { "$": 0, "succ": { "cloud": _3, "os": _21, "stg": { "$": 0, "succ": { "os": _21 } } } }, "freedesktop": _3, "hepforge": _3, "in-dsl": _3, "in-vpn": _3, "js": _3, "barsy": _3, "mayfirst": _3, "mozilla-iot": _3, "bmoattachments": _3, "dynserv": _3, "now-dns": _3, "cable-modem": _3, "collegefan": _3, "couchpotatofries": _3, "mlbfan": _3, "mysecuritycamera": _3, "nflfan": _3, "read-books": _3, "ufcfan": _3, "hopto": _3, "myftp": _3, "no-ip": _3, "zapto": _3, "httpbin": _3, "pubtls": _3, "jpn": _3, "my-firewall": _3, "myfirewall": _3, "spdns": _3, "small-web": _3, "dsmynas": _3, "familyds": _3, "teckids": _12, "tuxfamily": _3, "diskstation": _3, "hk": _3, "wmflabs": _3, "toolforge": _3, "wmcloud": _3, "za": _3 } }, "pa": { "$": 1, "succ": { "ac": _2, "gob": _2, "com": _2, "org": _2, "sld": _2, "edu": _2, "net": _2, "ing": _2, "abo": _2, "med": _2, "nom": _2 } }, "pe": { "$": 1, "succ": { "edu": _2, "gob": _2, "nom": _2, "mil": _2, "org": _2, "com": _2, "net": _2, "blogspot": _3 } }, "pf": { "$": 1, "succ": { "com": _2, "org": _2, "edu": _2 } }, "pg": _8, "ph": { "$": 1, "succ": { "com": _2, "net": _2, "org": _2, "gov": _2, "edu": _2, "ngo": _2, "mil": _2, "i": _2 } }, "pk": { "$": 1, "succ": { "com": _2, "net": _2, "edu": _2, "org": _2, "fam": _2, "biz": _2, "web": _2, "gov": _2, "gob": _2, "gok": _2, "gon": _2, "gop": _2, "gos": _2, "info": _2 } }, "pl": { "$": 1, "succ": { "com": _2, "net": _2, "org": _2, "aid": _2, "agro": _2, "atm": _2, "auto": _2, "biz": _2, "edu": _2, "gmina": _2, "gsm": _2, "info": _2, "mail": _2, "miasta": _2, "media": _2, "mil": _2, "nieruchomosci": _2, "nom": _2, "pc": _2, "powiat": _2, "priv": _2, "realestate": _2, "rel": _2, "sex": _2, "shop": _2, "sklep": _2, "sos": _2, "szkola": _2, "targi": _2, "tm": _2, "tourism": _2, "travel": _2, "turystyka": _2, "gov": { "$": 1, "succ": { "ap": _2, "ic": _2, "is": _2, "us": _2, "kmpsp": _2, "kppsp": _2, "kwpsp": _2, "psp": _2, "wskr": _2, "kwp": _2, "mw": _2, "ug": _2, "um": _2, "umig": _2, "ugim": _2, "upow": _2, "uw": _2, "starostwo": _2, "pa": _2, "po": _2, "psse": _2, "pup": _2, "rzgw": _2, "sa": _2, "so": _2, "sr": _2, "wsa": _2, "sko": _2, "uzs": _2, "wiih": _2, "winb": _2, "pinb": _2, "wios": _2, "witd": _2, "wzmiuw": _2, "piw": _2, "wiw": _2, "griw": _2, "wif": _2, "oum": _2, "sdn": _2, "zp": _2, "uppo": _2, "mup": _2, "wuoz": _2, "konsulat": _2, "oirm": _2 } }, "augustow": _2, "babia-gora": _2, "bedzin": _2, "beskidy": _2, "bialowieza": _2, "bialystok": _2, "bielawa": _2, "bieszczady": _2, "boleslawiec": _2, "bydgoszcz": _2, "bytom": _2, "cieszyn": _2, "czeladz": _2, "czest": _2, "dlugoleka": _2, "elblag": _2, "elk": _2, "glogow": _2, "gniezno": _2, "gorlice": _2, "grajewo": _2, "ilawa": _2, "jaworzno": _2, "jelenia-gora": _2, "jgora": _2, "kalisz": _2, "kazimierz-dolny": _2, "karpacz": _2, "kartuzy": _2, "kaszuby": _2, "katowice": _2, "kepno": _2, "ketrzyn": _2, "klodzko": _2, "kobierzyce": _2, "kolobrzeg": _2, "konin": _2, "konskowola": _2, "kutno": _2, "lapy": _2, "lebork": _2, "legnica": _2, "lezajsk": _2, "limanowa": _2, "lomza": _2, "lowicz": _2, "lubin": _2, "lukow": _2, "malbork": _2, "malopolska": _2, "mazowsze": _2, "mazury": _2, "mielec": _2, "mielno": _2, "mragowo": _2, "naklo": _2, "nowaruda": _2, "nysa": _2, "olawa": _2, "olecko": _2, "olkusz": _2, "olsztyn": _2, "opoczno": _2, "opole": _2, "ostroda": _2, "ostroleka": _2, "ostrowiec": _2, "ostrowwlkp": _2, "pila": _2, "pisz": _2, "podhale": _2, "podlasie": _2, "polkowice": _2, "pomorze": _2, "pomorskie": _2, "prochowice": _2, "pruszkow": _2, "przeworsk": _2, "pulawy": _2, "radom": _2, "rawa-maz": _2, "rybnik": _2, "rzeszow": _2, "sanok": _2, "sejny": _2, "slask": _2, "slupsk": _2, "sosnowiec": _2, "stalowa-wola": _2, "skoczow": _2, "starachowice": _2, "stargard": _2, "suwalki": _2, "swidnica": _2, "swiebodzin": _2, "swinoujscie": _2, "szczecin": _2, "szczytno": _2, "tarnobrzeg": _2, "tgory": _2, "turek": _2, "tychy": _2, "ustka": _2, "walbrzych": _2, "warmia": _2, "warszawa": _2, "waw": _2, "wegrow": _2, "wielun": _2, "wlocl": _2, "wloclawek": _2, "wodzislaw": _2, "wolomin": _2, "wroclaw": _2, "zachpomor": _2, "zagan": _2, "zarow": _2, "zgora": _2, "zgorzelec": _2, "beep": _3, "ecommerce-shop": _3, "shoparena": _3, "homesklep": _3, "sdscloud": _3, "unicloud": _3, "krasnik": _3, "leczna": _3, "lubartow": _3, "lublin": _3, "poniatowa": _3, "swidnik": _3, "co": _3, "simplesite": _3, "art": _3, "gliwice": _3, "krakow": _3, "poznan": _3, "wroc": _3, "zakopane": _3, "myspreadshop": _3, "gda": _3, "gdansk": _3, "gdynia": _3, "med": _3, "sopot": _3 } }, "pm": { "$": 1, "succ": { "own": _3, "name": _3 } }, "pn": { "$": 1, "succ": { "gov": _2, "co": _2, "org": _2, "edu": _2, "net": _2 } }, "post": _2, "pr": { "$": 1, "succ": { "com": _2, "net": _2, "org": _2, "gov": _2, "edu": _2, "isla": _2, "pro": _2, "biz": _2, "info": _2, "name": _2, "est": _2, "prof": _2, "ac": _2 } }, "pro": { "$": 1, "succ": { "aaa": _2, "aca": _2, "acct": _2, "avocat": _2, "bar": _2, "cpa": _2, "eng": _2, "jur": _2, "law": _2, "med": _2, "recht": _2, "cloudns": _3, "dnstrace": { "$": 0, "succ": { "bci": _3 } }, "barsy": _3 } }, "ps": { "$": 1, "succ": { "edu": _2, "gov": _2, "sec": _2, "plo": _2, "com": _2, "org": _2, "net": _2 } }, "pt": { "$": 1, "succ": { "net": _2, "gov": _2, "org": _2, "edu": _2, "int": _2, "publ": _2, "com": _2, "nome": _2, "blogspot": _3, "123paginaweb": _3 } }, "pw": { "$": 1, "succ": { "co": _2, "ne": _2, "or": _2, "ed": _2, "go": _2, "belau": _2, "cloudns": _3, "x443": _3 } }, "py": { "$": 1, "succ": { "com": _2, "coop": _2, "edu": _2, "gov": _2, "mil": _2, "net": _2, "org": _2 } }, "qa": { "$": 1, "succ": { "com": _2, "edu": _2, "gov": _2, "mil": _2, "name": _2, "net": _2, "org": _2, "sch": _2, "blogspot": _3 } }, "re": { "$": 1, "succ": { "asso": _2, "com": _2, "nom": _2, "blogspot": _3 } }, "ro": { "$": 1, "succ": { "arts": _2, "com": _2, "firm": _2, "info": _2, "nom": _2, "nt": _2, "org": _2, "rec": _2, "store": _2, "tm": _2, "www": _2, "co": _3, "shop": _3, "blogspot": _3, "barsy": _3 } }, "rs": { "$": 1, "succ": { "ac": _2, "co": _2, "edu": _2, "gov": _2, "in": _2, "org": _2, "brendly": { "$": 0, "succ": { "shop": _3 } }, "blogspot": _3, "ua": _3, "ox": _3 } }, "ru": { "$": 1, "succ": { "ac": _3, "edu": _3, "gov": _3, "int": _3, "mil": _3, "test": _3, "eurodir": _3, "adygeya": _3, "bashkiria": _3, "bir": _3, "cbg": _3, "com": _3, "dagestan": _3, "grozny": _3, "kalmykia": _3, "kustanai": _3, "marine": _3, "mordovia": _3, "msk": _3, "mytis": _3, "nalchik": _3, "nov": _3, "pyatigorsk": _3, "spb": _3, "vladikavkaz": _3, "vladimir": _3, "blogspot": _3, "na4u": _3, "mircloud": _3, "regruhosting": _27, "myjino": { "$": 2, "succ": { "hosting": _5, "landing": _5, "spectrum": _5, "vps": _5 } }, "cldmail": { "$": 0, "succ": { "hb": _3 } }, "mcdir": { "$": 2, "succ": { "vps": _3 } }, "mcpre": _3, "net": _3, "org": _3, "pp": _3, "123sait": _3, "lk3": _3, "ras": _3 } }, "rw": { "$": 1, "succ": { "ac": _2, "co": _2, "coop": _2, "gov": _2, "mil": _2, "net": _2, "org": _2 } }, "sa": { "$": 1, "succ": { "com": _2, "net": _2, "org": _2, "gov": _2, "med": _2, "pub": _2, "edu": _2, "sch": _2 } }, "sb": _4, "sc": _4, "sd": { "$": 1, "succ": { "com": _2, "net": _2, "org": _2, "edu": _2, "med": _2, "tv": _2, "gov": _2, "info": _2 } }, "se": { "$": 1, "succ": { "a": _2, "ac": _2, "b": _2, "bd": _2, "brand": _2, "c": _2, "d": _2, "e": _2, "f": _2, "fh": _2, "fhsk": _2, "fhv": _2, "g": _2, "h": _2, "i": _2, "k": _2, "komforb": _2, "kommunalforbund": _2, "komvux": _2, "l": _2, "lanbib": _2, "m": _2, "n": _2, "naturbruksgymn": _2, "o": _2, "org": _2, "p": _2, "parti": _2, "pp": _2, "press": _2, "r": _2, "s": _2, "t": _2, "tm": _2, "u": _2, "w": _2, "x": _2, "y": _2, "z": _2, "com": _3, "blogspot": _3, "conf": _3, "iopsys": _3, "123minsida": _3, "itcouldbewor": _3, "myspreadshop": _3, "paba": { "$": 0, "succ": { "su": _3 } } } }, "sg": { "$": 1, "succ": { "com": _2, "net": _2, "org": _2, "gov": _2, "edu": _2, "per": _2, "blogspot": _3, "enscaled": _3 } }, "sh": { "$": 1, "succ": { "com": _2, "net": _2, "gov": _2, "org": _2, "mil": _2, "bip": _3, "hashbang": _3, "platform": { "$": 0, "succ": { "bc": _3, "ent": _3, "eu": _3, "us": _3 } }, "now": _3, "vxl": _3, "wedeploy": _3 } }, "si": { "$": 1, "succ": { "gitapp": _3, "gitpage": _3, "blogspot": _3 } }, "sj": _2, "sk": _6, "sl": _4, "sm": _2, "sn": { "$": 1, "succ": { "art": _2, "com": _2, "edu": _2, "gouv": _2, "org": _2, "perso": _2, "univ": _2, "blogspot": _3 } }, "so": { "$": 1, "succ": { "com": _2, "edu": _2, "gov": _2, "me": _2, "net": _2, "org": _2, "sch": _3 } }, "sr": _2, "ss": { "$": 1, "succ": { "biz": _2, "com": _2, "edu": _2, "gov": _2, "me": _2, "net": _2, "org": _2, "sch": _2 } }, "st": { "$": 1, "succ": { "co": _2, "com": _2, "consulado": _2, "edu": _2, "embaixada": _2, "mil": _2, "net": _2, "org": _2, "principe": _2, "saotome": _2, "store": _2, "kirara": _3, "noho": _3 } }, "su": { "$": 1, "succ": { "abkhazia": _3, "adygeya": _3, "aktyubinsk": _3, "arkhangelsk": _3, "armenia": _3, "ashgabad": _3, "azerbaijan": _3, "balashov": _3, "bashkiria": _3, "bryansk": _3, "bukhara": _3, "chimkent": _3, "dagestan": _3, "east-kazakhstan": _3, "exnet": _3, "georgia": _3, "grozny": _3, "ivanovo": _3, "jambyl": _3, "kalmykia": _3, "kaluga": _3, "karacol": _3, "karaganda": _3, "karelia": _3, "khakassia": _3, "krasnodar": _3, "kurgan": _3, "kustanai": _3, "lenug": _3, "mangyshlak": _3, "mordovia": _3, "msk": _3, "murmansk": _3, "nalchik": _3, "navoi": _3, "north-kazakhstan": _3, "nov": _3, "obninsk": _3, "penza": _3, "pokrovsk": _3, "sochi": _3, "spb": _3, "tashkent": _3, "termez": _3, "togliatti": _3, "troitsk": _3, "tselinograd": _3, "tula": _3, "tuva": _3, "vladikavkaz": _3, "vladimir": _3, "vologda": _3 } }, "sv": { "$": 1, "succ": { "com": _2, "edu": _2, "gob": _2, "org": _2, "red": _2 } }, "sx": _7, "sy": _32, "sz": { "$": 1, "succ": { "co": _2, "ac": _2, "org": _2 } }, "tc": { "$": 1, "succ": { "ch": _3, "me": _3, "we": _3 } }, "td": _6, "tel": _2, "tf": { "$": 1, "succ": { "sch": _3 } }, "tg": _2, "th": { "$": 1, "succ": { "ac": _2, "co": _2, "go": _2, "in": _2, "mi": _2, "net": _2, "or": _2, "online": _3, "shop": _3 } }, "tj": { "$": 1, "succ": { "ac": _2, "biz": _2, "co": _2, "com": _2, "edu": _2, "go": _2, "gov": _2, "int": _2, "mil": _2, "name": _2, "net": _2, "nic": _2, "org": _2, "test": _2, "web": _2 } }, "tk": _2, "tl": _7, "tm": { "$": 1, "succ": { "com": _2, "co": _2, "org": _2, "net": _2, "nom": _2, "gov": _2, "mil": _2, "edu": _2 } }, "tn": { "$": 1, "succ": { "com": _2, "ens": _2, "fin": _2, "gov": _2, "ind": _2, "info": _2, "intl": _2, "mincom": _2, "nat": _2, "net": _2, "org": _2, "perso": _2, "tourism": _2, "orangecloud": _3 } }, "to": { "$": 1, "succ": { "611": _3, "com": _2, "gov": _2, "net": _2, "org": _2, "edu": _2, "mil": _2, "oya": _3, "rdv": _3, "x0": _3, "vpnplus": _3, "quickconnect": _13, "nyan": _3 } }, "tr": { "$": 1, "succ": { "av": _2, "bbs": _2, "bel": _2, "biz": _2, "com": _6, "dr": _2, "edu": _2, "gen": _2, "gov": _2, "info": _2, "mil": _2, "k12": _2, "kep": _2, "name": _2, "net": _2, "org": _2, "pol": _2, "tel": _2, "tsk": _2, "tv": _2, "web": _2, "nc": _7 } }, "tt": { "$": 1, "succ": { "co": _2, "com": _2, "org": _2, "net": _2, "biz": _2, "info": _2, "pro": _2, "int": _2, "coop": _2, "jobs": _2, "mobi": _2, "travel": _2, "museum": _2, "aero": _2, "name": _2, "gov": _2, "edu": _2 } }, "tv": { "$": 1, "succ": { "dyndns": _3, "better-than": _3, "on-the-web": _3, "worse-than": _3, "from": _3, "sakura": _3 } }, "tw": { "$": 1, "succ": { "edu": _2, "gov": _2, "mil": _2, "com": { "$": 1, "succ": { "mymailer": _3 } }, "net": _2, "org": _2, "idv": _2, "game": _2, "ebiz": _2, "club": _2, "xn--zf0ao64a": _2, "網路": _2, "xn--uc0atv": _2, "組織": _2, "xn--czrw28b": _2, "商業": _2, "url": _3, "blogspot": _3 } }, "tz": { "$": 1, "succ": { "ac": _2, "co": _2, "go": _2, "hotel": _2, "info": _2, "me": _2, "mil": _2, "mobi": _2, "ne": _2, "or": _2, "sc": _2, "tv": _2 } }, "ua": { "$": 1, "succ": { "com": _2, "edu": _2, "gov": _2, "in": _2, "net": _2, "org": _2, "cherkassy": _2, "cherkasy": _2, "chernigov": _2, "chernihiv": _2, "chernivtsi": _2, "chernovtsy": _2, "ck": _2, "cn": _2, "cr": _2, "crimea": _2, "cv": _2, "dn": _2, "dnepropetrovsk": _2, "dnipropetrovsk": _2, "donetsk": _2, "dp": _2, "if": _2, "ivano-frankivsk": _2, "kh": _2, "kharkiv": _2, "kharkov": _2, "kherson": _2, "khmelnitskiy": _2, "khmelnytskyi": _2, "kiev": _2, "kirovograd": _2, "km": _2, "kr": _2, "krym": _2, "ks": _2, "kv": _2, "kyiv": _2, "lg": _2, "lt": _2, "lugansk": _2, "lutsk": _2, "lv": _2, "lviv": _2, "mk": _2, "mykolaiv": _2, "nikolaev": _2, "od": _2, "odesa": _2, "odessa": _2, "pl": _2, "poltava": _2, "rivne": _2, "rovno": _2, "rv": _2, "sb": _2, "sebastopol": _2, "sevastopol": _2, "sm": _2, "sumy": _2, "te": _2, "ternopil": _2, "uz": _2, "uzhgorod": _2, "vinnica": _2, "vinnytsia": _2, "vn": _2, "volyn": _2, "yalta": _2, "zaporizhzhe": _2, "zaporizhzhia": _2, "zhitomir": _2, "zhytomyr": _2, "zp": _2, "zt": _2, "cc": _3, "inf": _3, "ltd": _3, "cx": _3, "ie": _3, "biz": _3, "co": _3, "pp": _3, "v": _3 } }, "ug": { "$": 1, "succ": { "co": _2, "or": _2, "ac": _2, "sc": _2, "go": _2, "ne": _2, "com": _2, "org": _2, "blogspot": _3 } }, "uk": { "$": 1, "succ": { "ac": _2, "co": { "$": 1, "succ": { "bytemark": { "$": 0, "succ": { "dh": _3, "vm": _3 } }, "blogspot": _3, "layershift": _26, "barsy": _3, "barsyonline": _3, "retrosnub": _31, "nh-serv": _3, "no-ip": _3, "wellbeingzone": _3, "adimo": _3, "myspreadshop": _3 } }, "gov": { "$": 1, "succ": { "campaign": _3, "service": _3, "api": _3, "homeoffice": _3 } }, "ltd": _2, "me": _2, "net": _2, "nhs": _2, "org": { "$": 1, "succ": { "glug": _3, "lug": _3, "lugs": _3, "affinitylottery": _3, "raffleentry": _3, "weeklylottery": _3 } }, "plc": _2, "police": _2, "sch": _8, "conn": _3, "copro": _3, "hosp": _3, "independent-commission": _3, "independent-inquest": _3, "independent-inquiry": _3, "independent-panel": _3, "independent-review": _3, "public-inquiry": _3, "royal-commission": _3, "pymnt": _3, "barsy": _3 } }, "us": { "$": 1, "succ": { "dni": _2, "fed": _2, "isa": _2, "kids": _2, "nsn": _2, "ak": _40, "al": _40, "ar": _40, "as": _40, "az": _40, "ca": _40, "co": _40, "ct": _40, "dc": _40, "de": { "$": 1, "succ": { "k12": _2, "cc": _2, "lib": _3 } }, "fl": _40, "ga": _40, "gu": _40, "hi": _41, "ia": _40, "id": _40, "il": _40, "in": _40, "ks": _40, "ky": _40, "la": _40, "ma": { "$": 1, "succ": { "k12": { "$": 1, "succ": { "pvt": _2, "chtr": _2, "paroch": _2 } }, "cc": _2, "lib": _2 } }, "md": _40, "me": _40, "mi": { "$": 1, "succ": { "k12": _2, "cc": _2, "lib": _2, "ann-arbor": _2, "cog": _2, "dst": _2, "eaton": _2, "gen": _2, "mus": _2, "tec": _2, "washtenaw": _2 } }, "mn": _40, "mo": _40, "ms": _40, "mt": _40, "nc": _40, "nd": _41, "ne": _40, "nh": _40, "nj": _40, "nm": _40, "nv": _40, "ny": _40, "oh": _40, "ok": _40, "or": _40, "pa": _40, "pr": _40, "ri": _41, "sc": _40, "sd": _41, "tn": _40, "tx": _40, "ut": _40, "vi": _40, "vt": _40, "va": _40, "wa": _40, "wi": _40, "wv": { "$": 1, "succ": { "cc": _2 } }, "wy": _40, "graphox": _3, "cloudns": _3, "drud": _3, "is-by": _3, "land-4-sale": _3, "stuff-4-sale": _3, "enscaled": { "$": 0, "succ": { "phx": _3 } }, "mircloud": _3, "freeddns": _3, "golffan": _3, "noip": _3, "pointto": _3, "platterp": _3 } }, "uy": { "$": 1, "succ": { "com": _6, "edu": _2, "gub": _2, "mil": _2, "net": _2, "org": _2 } }, "uz": { "$": 1, "succ": { "co": _2, "com": _2, "net": _2, "org": _2 } }, "va": _2, "vc": { "$": 1, "succ": { "com": _2, "net": _2, "org": _2, "gov": _2, "mil": _2, "edu": _2, "gv": { "$": 2, "succ": { "d": _3 } }, "0e": _3 } }, "ve": { "$": 1, "succ": { "arts": _2, "bib": _2, "co": _2, "com": _2, "e12": _2, "edu": _2, "firm": _2, "gob": _2, "gov": _2, "info": _2, "int": _2, "mil": _2, "net": _2, "nom": _2, "org": _2, "rar": _2, "rec": _2, "store": _2, "tec": _2, "web": _2 } }, "vg": { "$": 1, "succ": { "at": _3 } }, "vi": { "$": 1, "succ": { "co": _2, "com": _2, "k12": _2, "net": _2, "org": _2 } }, "vn": { "$": 1, "succ": { "com": _2, "net": _2, "org": _2, "edu": _2, "gov": _2, "int": _2, "ac": _2, "biz": _2, "info": _2, "name": _2, "pro": _2, "health": _2, "blogspot": _3 } }, "vu": { "$": 1, "succ": { "com": _2, "edu": _2, "net": _2, "org": _2, "cn": _3, "blog": _3, "dev": _3, "me": _3 } }, "wf": { "$": 1, "succ": { "biz": _3, "sch": _3 } }, "ws": { "$": 1, "succ": { "com": _2, "net": _2, "org": _2, "gov": _2, "edu": _2, "advisor": _5, "cloud66": _3, "dyndns": _3, "mypets": _3 } }, "yt": { "$": 1, "succ": { "org": _3 } }, "xn--mgbaam7a8h": _2, "امارات": _2, "xn--y9a3aq": _2, "հայ": _2, "xn--54b7fta0cc": _2, "বাংলা": _2, "xn--90ae": _2, "бг": _2, "xn--mgbcpq6gpa1a": _2, "البحرين": _2, "xn--90ais": _2, "бел": _2, "xn--fiqs8s": _2, "中国": _2, "xn--fiqz9s": _2, "中國": _2, "xn--lgbbat1ad8j": _2, "الجزائر": _2, "xn--wgbh1c": _2, "مصر": _2, "xn--e1a4c": _2, "ею": _2, "xn--qxa6a": _2, "ευ": _2, "xn--mgbah1a3hjkrd": _2, "موريتانيا": _2, "xn--node": _2, "გე": _2, "xn--qxam": _2, "ελ": _2, "xn--j6w193g": { "$": 1, "succ": { "xn--55qx5d": _2, "xn--wcvs22d": _2, "xn--mxtq1m": _2, "xn--gmqw5a": _2, "xn--od0alg": _2, "xn--uc0atv": _2 } }, "香港": { "$": 1, "succ": { "公司": _2, "教育": _2, "政府": _2, "個人": _2, "網絡": _2, "組織": _2 } }, "xn--2scrj9c": _2, "ಭಾರತ": _2, "xn--3hcrj9c": _2, "ଭାରତ": _2, "xn--45br5cyl": _2, "ভাৰত": _2, "xn--h2breg3eve": _2, "भारतम्": _2, "xn--h2brj9c8c": _2, "भारोत": _2, "xn--mgbgu82a": _2, "ڀارت": _2, "xn--rvc1e0am3e": _2, "ഭാരതം": _2, "xn--h2brj9c": _2, "भारत": _2, "xn--mgbbh1a": _2, "بارت": _2, "xn--mgbbh1a71e": _2, "بھارت": _2, "xn--fpcrj9c3d": _2, "భారత్": _2, "xn--gecrj9c": _2, "ભારત": _2, "xn--s9brj9c": _2, "ਭਾਰਤ": _2, "xn--45brj9c": _2, "ভারত": _2, "xn--xkc2dl3a5ee0h": _2, "இந்தியா": _2, "xn--mgba3a4f16a": _2, "ایران": _2, "xn--mgba3a4fra": _2, "ايران": _2, "xn--mgbtx2b": _2, "عراق": _2, "xn--mgbayh7gpa": _2, "الاردن": _2, "xn--3e0b707e": _2, "한국": _2, "xn--80ao21a": _2, "қаз": _2, "xn--q7ce6a": _2, "ລາວ": _2, "xn--fzc2c9e2c": _2, "ලංකා": _2, "xn--xkc2al3hye2a": _2, "இலங்கை": _2, "xn--mgbc0a9azcg": _2, "المغرب": _2, "xn--d1alf": _2, "мкд": _2, "xn--l1acc": _2, "мон": _2, "xn--mix891f": _2, "澳門": _2, "xn--mix082f": _2, "澳门": _2, "xn--mgbx4cd0ab": _2, "مليسيا": _2, "xn--mgb9awbf": _2, "عمان": _2, "xn--mgbai9azgqp6j": _2, "پاکستان": _2, "xn--mgbai9a5eva00b": _2, "پاكستان": _2, "xn--ygbi2ammx": _2, "فلسطين": _2, "xn--90a3ac": { "$": 1, "succ": { "xn--o1ac": _2, "xn--c1avg": _2, "xn--90azh": _2, "xn--d1at": _2, "xn--o1ach": _2, "xn--80au": _2 } }, "срб": { "$": 1, "succ": { "пр": _2, "орг": _2, "обр": _2, "од": _2, "упр": _2, "ак": _2 } }, "xn--p1ai": _2, "рф": _2, "xn--wgbl6a": _2, "قطر": _2, "xn--mgberp4a5d4ar": _2, "السعودية": _2, "xn--mgberp4a5d4a87g": _2, "السعودیة": _2, "xn--mgbqly7c0a67fbc": _2, "السعودیۃ": _2, "xn--mgbqly7cvafr": _2, "السعوديه": _2, "xn--mgbpl2fh": _2, "سودان": _2, "xn--yfro4i67o": _2, "新加坡": _2, "xn--clchc0ea0b2g2a9gcd": _2, "சிங்கப்பூர்": _2, "xn--ogbpf8fl": _2, "سورية": _2, "xn--mgbtf8fl": _2, "سوريا": _2, "xn--o3cw4h": { "$": 1, "succ": { "xn--12c1fe0br": _2, "xn--12co0c3b4eva": _2, "xn--h3cuzk1di": _2, "xn--o3cyx2a": _2, "xn--m3ch0j3a": _2, "xn--12cfi8ixb8l": _2 } }, "ไทย": { "$": 1, "succ": { "ศึกษา": _2, "ธุรกิจ": _2, "รัฐบาล": _2, "ทหาร": _2, "เน็ต": _2, "องค์กร": _2 } }, "xn--pgbs0dh": _2, "تونس": _2, "xn--kpry57d": _2, "台灣": _2, "xn--kprw13d": _2, "台湾": _2, "xn--nnx388a": _2, "臺灣": _2, "xn--j1amh": _2, "укр": _2, "xn--mgb2ddes": _2, "اليمن": _2, "xxx": _2, "ye": _32, "za": { "$": 0, "succ": { "ac": _2, "agric": _2, "alt": _2, "co": _6, "edu": _2, "gov": _2, "grondar": _2, "law": _2, "mil": _2, "net": _2, "ngo": _2, "nic": _2, "nis": _2, "nom": _2, "org": _2, "school": _2, "tm": _2, "web": _2 } }, "zm": { "$": 1, "succ": { "ac": _2, "biz": _2, "co": _2, "com": _2, "edu": _2, "gov": _2, "info": _2, "mil": _2, "net": _2, "org": _2, "sch": _2 } }, "zw": { "$": 1, "succ": { "ac": _2, "co": _2, "gov": _2, "mil": _2, "org": _2 } }, "aaa": _2, "aarp": _2, "abarth": _2, "abb": _2, "abbott": _2, "abbvie": _2, "abc": _2, "able": _2, "abogado": _2, "abudhabi": _2, "academy": { "$": 1, "succ": { "official": _3 } }, "accenture": _2, "accountant": _2, "accountants": _2, "aco": _2, "actor": _2, "ads": _2, "adult": _2, "aeg": _2, "aetna": _2, "afl": _2, "africa": _2, "agakhan": _2, "agency": _2, "aig": _2, "airbus": _2, "airforce": _2, "airtel": _2, "akdn": _2, "alfaromeo": _2, "alibaba": _2, "alipay": _2, "allfinanz": _2, "allstate": _2, "ally": _2, "alsace": _2, "alstom": _2, "amazon": _2, "americanexpress": _2, "americanfamily": _2, "amex": _2, "amfam": _2, "amica": _2, "amsterdam": _2, "analytics": _2, "android": _2, "anquan": _2, "anz": _2, "aol": _2, "apartments": _2, "app": { "$": 1, "succ": { "beget": _5, "clerk": _3, "clerkstage": _3, "wnext": _3, "platform0": _3, "deta": _3, "ondigitalocean": _3, "easypanel": _3, "encr": _3, "edgecompute": _3, "fireweb": _3, "onflashdrive": _3, "framer": _3, "run": { "$": 2, "succ": { "a": _3 } }, "web": _3, "hasura": _3, "loginline": _3, "messerli": _3, "netlify": _3, "ngrok": _3, "ngrok-free": _3, "developer": _5, "noop": _3, "northflank": _5, "snowflake": { "$": 2, "succ": { "privatelink": _3 } }, "streamlit": _3, "telebit": _3, "typedream": _3, "vercel": _3, "bookonline": _3 } }, "apple": _2, "aquarelle": _2, "arab": _2, "aramco": _2, "archi": _2, "army": _2, "art": _2, "arte": _2, "asda": _2, "associates": _2, "athleta": _2, "attorney": _2, "auction": _2, "audi": _2, "audible": _2, "audio": _2, "auspost": _2, "author": _2, "auto": _2, "autos": _2, "avianca": _2, "aws": _2, "axa": _2, "azure": _2, "baby": _2, "baidu": _2, "banamex": _2, "bananarepublic": _2, "band": _2, "bank": _2, "bar": _2, "barcelona": _2, "barclaycard": _2, "barclays": _2, "barefoot": _2, "bargains": _2, "baseball": _2, "basketball": { "$": 1, "succ": { "aus": _3, "nz": _3 } }, "bauhaus": _2, "bayern": _2, "bbc": _2, "bbt": _2, "bbva": _2, "bcg": _2, "bcn": _2, "beats": _2, "beauty": _2, "beer": _2, "bentley": _2, "berlin": _2, "best": _2, "bestbuy": _2, "bet": _2, "bharti": _2, "bible": _2, "bid": _2, "bike": _2, "bing": _2, "bingo": _2, "bio": _2, "black": _2, "blackfriday": _2, "blockbuster": _2, "blog": _2, "bloomberg": _2, "blue": _2, "bms": _2, "bmw": _2, "bnpparibas": _2, "boats": _2, "boehringer": _2, "bofa": _2, "bom": _2, "bond": _2, "boo": _2, "book": _2, "booking": _2, "bosch": _2, "bostik": _2, "boston": _2, "bot": _2, "boutique": _2, "box": _2, "bradesco": _2, "bridgestone": _2, "broadway": _2, "broker": _2, "brother": _2, "brussels": _2, "build": _2, "builders": { "$": 1, "succ": { "cloudsite": _3 } }, "business": _10, "buy": _2, "buzz": _2, "bzh": _2, "cab": _2, "cafe": _2, "cal": _2, "call": _2, "calvinklein": _2, "cam": _2, "camera": _2, "camp": _2, "canon": _2, "capetown": _2, "capital": _2, "capitalone": _2, "car": _2, "caravan": _2, "cards": _2, "care": _2, "career": _2, "careers": _2, "cars": _2, "casa": { "$": 1, "succ": { "nabu": { "$": 0, "succ": { "ui": _3 } } } }, "case": _2, "cash": _2, "casino": _2, "catering": _2, "catholic": _2, "cba": _2, "cbn": _2, "cbre": _2, "cbs": _2, "center": _2, "ceo": _2, "cern": _2, "cfa": _2, "cfd": _2, "chanel": _2, "channel": _2, "charity": _2, "chase": _2, "chat": _2, "cheap": _2, "chintai": _2, "christmas": _2, "chrome": _2, "church": _2, "cipriani": _2, "circle": _2, "cisco": _2, "citadel": _2, "citi": _2, "citic": _2, "city": _2, "cityeats": _2, "claims": _2, "cleaning": _2, "click": _2, "clinic": _2, "clinique": _2, "clothing": _2, "cloud": { "$": 1, "succ": { "banzai": _5, "elementor": _3, "encoway": { "$": 0, "succ": { "eu": _3 } }, "statics": _5, "ravendb": _3, "axarnet": { "$": 0, "succ": { "es-1": _3 } }, "diadem": _3, "jelastic": { "$": 0, "succ": { "vip": _3 } }, "jele": _3, "jenv-aruba": { "$": 0, "succ": { "aruba": { "$": 0, "succ": { "eur": { "$": 0, "succ": { "it1": _3 } } } }, "it1": _3 } }, "keliweb": { "$": 2, "succ": { "cs": _3 } }, "oxa": { "$": 2, "succ": { "tn": _3, "uk": _3 } }, "primetel": { "$": 2, "succ": { "uk": _3 } }, "reclaim": { "$": 0, "succ": { "ca": _3, "uk": _3, "us": _3 } }, "trendhosting": { "$": 0, "succ": { "ch": _3, "de": _3 } }, "jotelulu": _3, "kuleuven": _3, "linkyard": _3, "magentosite": _5, "perspecta": _3, "vapor": _3, "on-rancher": _5, "scw": { "$": 0, "succ": { "baremetal": { "$": 0, "succ": { "fr-par-1": _3, "fr-par-2": _3, "nl-ams-1": _3 } }, "fr-par": { "$": 0, "succ": { "fnc": { "$": 2, "succ": { "functions": _3 } }, "k8s": _11, "s3": _3, "s3-website": _3, "whm": _3 } }, "instances": { "$": 0, "succ": { "priv": _3, "pub": _3 } }, "k8s": _3, "nl-ams": { "$": 0, "succ": { "k8s": _11, "s3": _3, "s3-website": _3, "whm": _3 } }, "pl-waw": { "$": 0, "succ": { "k8s": _11, "s3": _3, "s3-website": _3 } }, "scalebook": _3, "smartlabeling": _3 } }, "sensiosite": _5, "trafficplex": _3, "urown": _3, "voorloper": _3 } }, "club": { "$": 1, "succ": { "cloudns": _3, "jele": _3, "barsy": _3 } }, "clubmed": _2, "coach": _2, "codes": { "$": 1, "succ": { "owo": _5 } }, "coffee": _2, "college": _2, "cologne": _2, "comcast": _2, "commbank": _2, "community": { "$": 1, "succ": { "nog": _3, "ravendb": _3, "myforum": _3 } }, "company": _2, "compare": _2, "computer": _2, "comsec": _2, "condos": _2, "construction": _2, "consulting": _2, "contact": _2, "contractors": _2, "cooking": _2, "cookingchannel": _2, "cool": { "$": 1, "succ": { "elementor": _3, "de": _3 } }, "corsica": _2, "country": _2, "coupon": _2, "coupons": _2, "courses": _2, "cpa": _2, "credit": _2, "creditcard": _2, "creditunion": _2, "cricket": _2, "crown": _2, "crs": _2, "cruise": _2, "cruises": _2, "cuisinella": _2, "cymru": _2, "cyou": _2, "dabur": _2, "dad": _2, "dance": _2, "data": _2, "date": _2, "dating": _2, "datsun": _2, "day": _2, "dclk": _2, "dds": _2, "deal": _2, "dealer": _2, "deals": _2, "degree": _2, "delivery": _2, "dell": _2, "deloitte": _2, "delta": _2, "democrat": _2, "dental": _2, "dentist": _2, "desi": _2, "design": { "$": 1, "succ": { "bss": _3 } }, "dev": { "$": 1, "succ": { "autocode": _3, "lcl": _5, "lclstage": _5, "stg": _5, "stgstage": _5, "pages": _3, "r2": _3, "workers": _3, "curv": _3, "deno": _3, "deno-staging": _3, "deta": _3, "fly": _3, "githubpreview": _3, "gateway": _5, "iserv": _3, "localcert": { "$": 0, "succ": { "user": _5 } }, "loginline": _3, "mediatech": _3, "ngrok": _3, "ngrok-free": _3, "platter-app": _3, "shiftcrypto": _3, "vercel": _3, "webhare": _5 } }, "dhl": _2, "diamonds": _2, "diet": _2, "digital": { "$": 1, "succ": { "cloudapps": { "$": 2, "succ": { "london": _3 } } } }, "direct": _2, "directory": _2, "discount": _2, "discover": _2, "dish": _2, "diy": _2, "dnp": _2, "docs": _2, "doctor": _2, "dog": _2, "domains": _2, "dot": _2, "download": _2, "drive": _2, "dtv": _2, "dubai": _2, "dunlop": _2, "dupont": _2, "durban": _2, "dvag": _2, "dvr": _2, "earth": { "$": 1, "succ": { "dapps": { "$": 0, "succ": { "*": _3, "bzz": _5 } } } }, "eat": _2, "eco": _2, "edeka": _2, "education": _10, "email": _2, "emerck": _2, "energy": _2, "engineer": _2, "engineering": _2, "enterprises": _2, "epson": _2, "equipment": _2, "ericsson": _2, "erni": _2, "esq": _2, "estate": { "$": 1, "succ": { "compute": _5 } }, "etisalat": _2, "eurovision": _2, "eus": { "$": 1, "succ": { "party": _28 } }, "events": { "$": 1, "succ": { "koobin": _3, "co": _3 } }, "exchange": _2, "expert": _2, "exposed": _2, "express": _2, "extraspace": _2, "fage": _2, "fail": _2, "fairwinds": _2, "faith": _29, "family": _2, "fan": _2, "fans": _2, "farm": { "$": 1, "succ": { "storj": _3 } }, "farmers": _2, "fashion": _2, "fast": _2, "fedex": _2, "feedback": _2, "ferrari": _2, "ferrero": _2, "fiat": _2, "fidelity": _2, "fido": _2, "film": _2, "final": _2, "finance": _2, "financial": _10, "fire": _2, "firestone": _2, "firmdale": _2, "fish": _2, "fishing": _2, "fit": _2, "fitness": _2, "flickr": _2, "flights": _2, "flir": _2, "florist": _2, "flowers": _2, "fly": _2, "foo": _2, "food": _2, "foodnetwork": _2, "football": _2, "ford": _2, "forex": _2, "forsale": _2, "forum": _2, "foundation": _2, "fox": _2, "free": _2, "fresenius": _2, "frl": _2, "frogans": _2, "frontdoor": _2, "frontier": _2, "ftr": _2, "fujitsu": _2, "fun": _2, "fund": _2, "furniture": _2, "futbol": _2, "fyi": _2, "gal": _2, "gallery": _2, "gallo": _2, "gallup": _2, "game": _2, "games": _2, "gap": _2, "garden": _2, "gay": _2, "gbiz": _2, "gdn": { "$": 1, "succ": { "cnpy": _3 } }, "gea": _2, "gent": _2, "genting": _2, "george": _2, "ggee": _2, "gift": _2, "gifts": _2, "gives": _2, "giving": _2, "glass": _2, "gle": _2, "global": _2, "globo": _2, "gmail": _2, "gmbh": _2, "gmo": _2, "gmx": _2, "godaddy": _2, "gold": _2, "goldpoint": _2, "golf": _2, "goo": _2, "goodyear": _2, "goog": { "$": 1, "succ": { "cloud": _3, "translate": _3, "usercontent": _5 } }, "google": _2, "gop": _2, "got": _2, "grainger": _2, "graphics": _2, "gratis": _2, "green": _2, "gripe": _2, "grocery": _2, "group": { "$": 1, "succ": { "discourse": _3 } }, "guardian": _2, "gucci": _2, "guge": _2, "guide": _2, "guitars": _2, "guru": _2, "hair": _2, "hamburg": _2, "hangout": _2, "haus": _2, "hbo": _2, "hdfc": _2, "hdfcbank": _2, "health": { "$": 1, "succ": { "hra": _3 } }, "healthcare": _2, "help": _2, "helsinki": _2, "here": _2, "hermes": _2, "hgtv": _2, "hiphop": _2, "hisamitsu": _2, "hitachi": _2, "hiv": _2, "hkt": _2, "hockey": _2, "holdings": _2, "holiday": _2, "homedepot": _2, "homegoods": _2, "homes": _2, "homesense": _2, "honda": _2, "horse": _2, "hospital": _2, "host": { "$": 1, "succ": { "cloudaccess": _3, "freesite": _3, "easypanel": _3, "fastvps": _3, "myfast": _3, "tempurl": _3, "wpmudev": _3, "jele": _3, "mircloud": _3, "pcloud": _3, "half": _3 } }, "hosting": { "$": 1, "succ": { "opencraft": _3 } }, "hot": _2, "hoteles": _2, "hotels": _2, "hotmail": _2, "house": _2, "how": _2, "hsbc": _2, "hughes": _2, "hyatt": _2, "hyundai": _2, "ibm": _2, "icbc": _2, "ice": _2, "icu": _2, "ieee": _2, "ifm": _2, "ikano": _2, "imamat": _2, "imdb": _2, "immo": _2, "immobilien": _2, "inc": _2, "industries": _2, "infiniti": _2, "ing": _2, "ink": _2, "institute": _2, "insurance": _2, "insure": _2, "international": _2, "intuit": _2, "investments": _2, "ipiranga": _2, "irish": _2, "ismaili": _2, "ist": _2, "istanbul": _2, "itau": _2, "itv": _2, "jaguar": _2, "java": _2, "jcb": _2, "jeep": _2, "jetzt": _2, "jewelry": _2, "jio": _2, "jll": _2, "jmp": _2, "jnj": _2, "joburg": _2, "jot": _2, "joy": _2, "jpmorgan": _2, "jprs": _2, "juegos": _2, "juniper": _2, "kaufen": _2, "kddi": _2, "kerryhotels": _2, "kerrylogistics": _2, "kerryproperties": _2, "kfh": _2, "kia": _2, "kids": _2, "kim": _2, "kinder": _2, "kindle": _2, "kitchen": _2, "kiwi": _2, "koeln": _2, "komatsu": _2, "kosher": _2, "kpmg": _2, "kpn": _2, "krd": { "$": 1, "succ": { "co": _3, "edu": _3 } }, "kred": _2, "kuokgroup": _2, "kyoto": _2, "lacaixa": _2, "lamborghini": _2, "lamer": _2, "lancaster": _2, "lancia": _2, "land": { "$": 1, "succ": { "static": { "$": 2, "succ": { "dev": _3, "sites": _3 } } } }, "landrover": _2, "lanxess": _2, "lasalle": _2, "lat": _2, "latino": _2, "latrobe": _2, "law": _2, "lawyer": _2, "lds": _2, "lease": _2, "leclerc": _2, "lefrak": _2, "legal": _2, "lego": _2, "lexus": _2, "lgbt": _2, "lidl": _2, "life": _2, "lifeinsurance": _2, "lifestyle": _2, "lighting": _2, "like": _2, "lilly": _2, "limited": _2, "limo": _2, "lincoln": _2, "linde": _2, "link": { "$": 1, "succ": { "cyon": _3, "mypep": _3, "dweb": _5 } }, "lipsy": _2, "live": { "$": 1, "succ": { "hlx": _3 } }, "living": _2, "llc": _2, "llp": _2, "loan": _2, "loans": _2, "locker": _2, "locus": _2, "lol": { "$": 1, "succ": { "omg": _3 } }, "london": _2, "lotte": _2, "lotto": _2, "love": _2, "lpl": _2, "lplfinancial": _2, "ltd": _2, "ltda": _2, "lundbeck": _2, "luxe": _2, "luxury": _2, "macys": _2, "madrid": _2, "maif": _2, "maison": _2, "makeup": _2, "man": _2, "management": { "$": 1, "succ": { "router": _3 } }, "mango": _2, "map": _2, "market": _2, "marketing": _2, "markets": _2, "marriott": _2, "marshalls": _2, "maserati": _2, "mattel": _2, "mba": _2, "mckinsey": _2, "med": _2, "media": _35, "meet": _2, "melbourne": _2, "meme": _2, "memorial": _2, "men": _2, "menu": _36, "merckmsd": _2, "miami": _2, "microsoft": _2, "mini": _2, "mint": _2, "mit": _2, "mitsubishi": _2, "mlb": _2, "mls": _2, "mma": _2, "mobile": _2, "moda": _2, "moe": _2, "moi": _2, "mom": _2, "monash": _2, "money": _2, "monster": _2, "mormon": _2, "mortgage": _2, "moscow": _2, "moto": _2, "motorcycles": _2, "mov": _2, "movie": _2, "msd": _2, "mtn": _2, "mtr": _2, "music": _2, "mutual": _2, "nab": _2, "nagoya": _2, "natura": _2, "navy": _2, "nba": _2, "nec": _2, "netbank": _2, "netflix": _2, "network": { "$": 1, "succ": { "alces": _5, "co": _3, "arvo": _3, "azimuth": _3, "tlon": _3 } }, "neustar": _2, "new": _2, "news": { "$": 1, "succ": { "noticeable": _3 } }, "next": _2, "nextdirect": _2, "nexus": _2, "nfl": _2, "ngo": _2, "nhk": _2, "nico": _2, "nike": _2, "nikon": _2, "ninja": _2, "nissan": _2, "nissay": _2, "nokia": _2, "northwesternmutual": _2, "norton": _2, "now": _2, "nowruz": _2, "nowtv": _2, "nra": _2, "nrw": _2, "ntt": _2, "nyc": _2, "obi": _2, "observer": _2, "office": _2, "okinawa": _2, "olayan": _2, "olayangroup": _2, "oldnavy": _2, "ollo": _2, "omega": _2, "one": { "$": 1, "succ": { "onred": { "$": 2, "succ": { "staging": _3 } }, "service": _3, "homelink": _3 } }, "ong": _2, "onl": _2, "online": { "$": 1, "succ": { "eero": _3, "eero-stage": _3, "barsy": _3 } }, "ooo": _2, "open": _2, "oracle": _2, "orange": { "$": 1, "succ": { "tech": _3 } }, "organic": _2, "origins": _2, "osaka": _2, "otsuka": _2, "ott": _2, "ovh": { "$": 1, "succ": { "nerdpol": _3 } }, "page": { "$": 1, "succ": { "hlx": _3, "hlx3": _3, "translated": _3, "codeberg": _3, "pdns": _3, "plesk": _3, "prvcy": _3, "rocky": _3, "magnet": _3 } }, "panasonic": _2, "paris": _2, "pars": _2, "partners": _2, "parts": _2, "party": _29, "passagens": _2, "pay": _2, "pccw": _2, "pet": _2, "pfizer": _2, "pharmacy": _2, "phd": _2, "philips": _2, "phone": _2, "photo": _2, "photography": _2, "photos": _35, "physio": _2, "pics": _2, "pictet": _2, "pictures": { "$": 1, "succ": { "1337": _3 } }, "pid": _2, "pin": _2, "ping": _2, "pink": _2, "pioneer": _2, "pizza": { "$": 1, "succ": { "ngrok": _3 } }, "place": _10, "play": _2, "playstation": _2, "plumbing": _2, "plus": _2, "pnc": _2, "pohl": _2, "poker": _2, "politie": _2, "porn": { "$": 1, "succ": { "indie": _3 } }, "pramerica": _2, "praxi": _2, "press": _2, "prime": _2, "prod": _2, "productions": _2, "prof": _2, "progressive": _2, "promo": _2, "properties": _2, "property": _2, "protection": _2, "pru": _2, "prudential": _2, "pub": _36, "pwc": _2, "qpon": _2, "quebec": _2, "quest": _2, "racing": _2, "radio": _2, "read": _2, "realestate": _2, "realtor": _2, "realty": _2, "recipes": _2, "red": _2, "redstone": _2, "redumbrella": _2, "rehab": _2, "reise": _2, "reisen": _2, "reit": _2, "reliance": _2, "ren": _2, "rent": _2, "rentals": _2, "repair": _2, "report": _2, "republican": _2, "rest": _2, "restaurant": _2, "review": _29, "reviews": _2, "rexroth": _2, "rich": _2, "richardli": _2, "ricoh": _2, "ril": _2, "rio": _2, "rip": { "$": 1, "succ": { "clan": _3 } }, "rocher": _2, "rocks": { "$": 1, "succ": { "myddns": _3, "lima-city": _3, "webspace": _3 } }, "rodeo": _2, "rogers": _2, "room": _2, "rsvp": _2, "rugby": _2, "ruhr": _2, "run": { "$": 1, "succ": { "hs": _3, "development": _3, "ravendb": _3, "servers": _3, "build": _5, "code": _5, "database": _5, "migration": _5, "onporter": _3, "repl": _3 } }, "rwe": _2, "ryukyu": _2, "saarland": _2, "safe": _2, "safety": _2, "sakura": _2, "sale": _2, "salon": _2, "samsclub": _2, "samsung": _2, "sandvik": _2, "sandvikcoromant": _2, "sanofi": _2, "sap": _2, "sarl": _2, "sas": _2, "save": _2, "saxo": _2, "sbi": _2, "sbs": _2, "sca": _2, "scb": _2, "schaeffler": _2, "schmidt": _2, "scholarships": _2, "school": _2, "schule": _2, "schwarz": _2, "science": _29, "scot": { "$": 1, "succ": { "edu": _3, "gov": { "$": 2, "succ": { "service": _3 } } } }, "search": _2, "seat": _2, "secure": _2, "security": _2, "seek": _2, "select": _2, "sener": _2, "services": { "$": 1, "succ": { "loginline": _3 } }, "seven": _2, "sew": _2, "sex": _2, "sexy": _2, "sfr": _2, "shangrila": _2, "sharp": _2, "shaw": _2, "shell": _2, "shia": _2, "shiksha": _2, "shoes": _2, "shop": { "$": 1, "succ": { "base": _3, "hoplix": _3, "barsy": _3 } }, "shopping": _2, "shouji": _2, "show": _2, "showtime": _2, "silk": _2, "sina": _2, "singles": _2, "site": { "$": 1, "succ": { "cloudera": _5, "cyon": _3, "fnwk": _3, "folionetwork": _3, "fastvps": _3, "jele": _3, "lelux": _3, "loginline": _3, "barsy": _3, "mintere": _3, "omniwe": _3, "opensocial": _3, "platformsh": _5, "tst": _5, "byen": _3, "srht": _3, "novecore": _3 } }, "ski": _2, "skin": _2, "sky": _2, "skype": _2, "sling": _2, "smart": _2, "smile": _2, "sncf": _2, "soccer": _2, "social": _2, "softbank": _2, "software": _2, "sohu": _2, "solar": _2, "solutions": { "$": 1, "succ": { "diher": _5 } }, "song": _2, "sony": _2, "soy": _2, "spa": _2, "space": { "$": 1, "succ": { "myfast": _3, "uber": _3, "xs4all": _3 } }, "sport": _2, "spot": _2, "srl": _2, "stada": _2, "staples": _2, "star": _2, "statebank": _2, "statefarm": _2, "stc": _2, "stcgroup": _2, "stockholm": _2, "storage": _2, "store": { "$": 1, "succ": { "sellfy": _3, "shopware": _3, "storebase": _3 } }, "stream": _2, "studio": _2, "study": _2, "style": _2, "sucks": _2, "supplies": _2, "supply": _2, "support": _36, "surf": _2, "surgery": _2, "suzuki": _2, "swatch": _2, "swiss": _2, "sydney": _2, "systems": { "$": 1, "succ": { "knightpoint": _3 } }, "tab": _2, "taipei": _2, "talk": _2, "taobao": _2, "target": _2, "tatamotors": _2, "tatar": _2, "tattoo": _2, "tax": _2, "taxi": _2, "tci": _2, "tdk": _2, "team": { "$": 1, "succ": { "discourse": _3, "jelastic": _3 } }, "tech": _2, "technology": _10, "temasek": _2, "tennis": _2, "teva": _2, "thd": _2, "theater": _2, "theatre": _2, "tiaa": _2, "tickets": _2, "tienda": _2, "tiffany": _2, "tips": _2, "tires": _2, "tirol": _2, "tjmaxx": _2, "tjx": _2, "tkmaxx": _2, "tmall": _2, "today": { "$": 1, "succ": { "prequalifyme": _3 } }, "tokyo": _2, "tools": _2, "top": { "$": 1, "succ": { "now-dns": _3, "ntdll": _3 } }, "toray": _2, "toshiba": _2, "total": _2, "tours": _2, "town": _2, "toyota": _2, "toys": _2, "trade": _29, "trading": _2, "training": _2, "travel": _2, "travelchannel": _2, "travelers": _2, "travelersinsurance": _2, "trust": _2, "trv": _2, "tube": _2, "tui": _2, "tunes": _2, "tushu": _2, "tvs": _2, "ubank": _2, "ubs": _2, "unicom": _2, "university": _2, "uno": _2, "uol": _2, "ups": _2, "vacations": _2, "vana": _2, "vanguard": _2, "vegas": _2, "ventures": _2, "verisign": _2, "versicherung": _2, "vet": _2, "viajes": _2, "video": _2, "vig": _2, "viking": _2, "villas": _2, "vin": _2, "vip": _2, "virgin": _2, "visa": _2, "vision": _2, "viva": _2, "vivo": _2, "vlaanderen": _2, "vodka": _2, "volkswagen": _2, "volvo": _2, "vote": _2, "voting": _2, "voto": _2, "voyage": _2, "vuelos": _2, "wales": _2, "walmart": _2, "walter": _2, "wang": _2, "wanggou": _2, "watch": _2, "watches": _2, "weather": _2, "weatherchannel": _2, "webcam": _2, "weber": _2, "website": _35, "wedding": _2, "weibo": _2, "weir": _2, "whoswho": _2, "wien": _2, "wiki": _35, "williamhill": _2, "win": _2, "windows": _2, "wine": _2, "winners": _2, "wme": _2, "wolterskluwer": _2, "woodside": _2, "work": _2, "works": _2, "world": _2, "wow": _2, "wtc": _2, "wtf": _2, "xbox": _2, "xerox": _2, "xfinity": _2, "xihuan": _2, "xin": _2, "xn--11b4c3d": _2, "कॉम": _2, "xn--1ck2e1b": _2, "セール": _2, "xn--1qqw23a": _2, "佛山": _2, "xn--30rr7y": _2, "慈善": _2, "xn--3bst00m": _2, "集团": _2, "xn--3ds443g": _2, "在线": _2, "xn--3pxu8k": _2, "点看": _2, "xn--42c2d9a": _2, "คอม": _2, "xn--45q11c": _2, "八卦": _2, "xn--4gbrim": _2, "موقع": _2, "xn--55qw42g": _2, "公益": _2, "xn--55qx5d": _2, "公司": _2, "xn--5su34j936bgsg": _2, "香格里拉": _2, "xn--5tzm5g": _2, "网站": _2, "xn--6frz82g": _2, "移动": _2, "xn--6qq986b3xl": _2, "我爱你": _2, "xn--80adxhks": _2, "москва": _2, "xn--80aqecdr1a": _2, "католик": _2, "xn--80asehdb": _2, "онлайн": _2, "xn--80aswg": _2, "сайт": _2, "xn--8y0a063a": _2, "联通": _2, "xn--9dbq2a": _2, "קום": _2, "xn--9et52u": _2, "时尚": _2, "xn--9krt00a": _2, "微博": _2, "xn--b4w605ferd": _2, "淡马锡": _2, "xn--bck1b9a5dre4c": _2, "ファッション": _2, "xn--c1avg": _2, "орг": _2, "xn--c2br7g": _2, "नेट": _2, "xn--cck2b3b": _2, "ストア": _2, "xn--cckwcxetd": _2, "アマゾン": _2, "xn--cg4bki": _2, "삼성": _2, "xn--czr694b": _2, "商标": _2, "xn--czrs0t": _2, "商店": _2, "xn--czru2d": _2, "商城": _2, "xn--d1acj3b": _2, "дети": _2, "xn--eckvdtc9d": _2, "ポイント": _2, "xn--efvy88h": _2, "新闻": _2, "xn--fct429k": _2, "家電": _2, "xn--fhbei": _2, "كوم": _2, "xn--fiq228c5hs": _2, "中文网": _2, "xn--fiq64b": _2, "中信": _2, "xn--fjq720a": _2, "娱乐": _2, "xn--flw351e": _2, "谷歌": _2, "xn--fzys8d69uvgm": _2, "電訊盈科": _2, "xn--g2xx48c": _2, "购物": _2, "xn--gckr3f0f": _2, "クラウド": _2, "xn--gk3at1e": _2, "通販": _2, "xn--hxt814e": _2, "网店": _2, "xn--i1b6b1a6a2e": _2, "संगठन": _2, "xn--imr513n": _2, "餐厅": _2, "xn--io0a7i": _2, "网络": _2, "xn--j1aef": _2, "ком": _2, "xn--jlq480n2rg": _2, "亚马逊": _2, "xn--jvr189m": _2, "食品": _2, "xn--kcrx77d1x4a": _2, "飞利浦": _2, "xn--kput3i": _2, "手机": _2, "xn--mgba3a3ejt": _2, "ارامكو": _2, "xn--mgba7c0bbn0a": _2, "العليان": _2, "xn--mgbaakc7dvf": _2, "اتصالات": _2, "xn--mgbab2bd": _2, "بازار": _2, "xn--mgbca7dzdo": _2, "ابوظبي": _2, "xn--mgbi4ecexp": _2, "كاثوليك": _2, "xn--mgbt3dhd": _2, "همراه": _2, "xn--mk1bu44c": _2, "닷컴": _2, "xn--mxtq1m": _2, "政府": _2, "xn--ngbc5azd": _2, "شبكة": _2, "xn--ngbe9e0a": _2, "بيتك": _2, "xn--ngbrx": _2, "عرب": _2, "xn--nqv7f": _2, "机构": _2, "xn--nqv7fs00ema": _2, "组织机构": _2, "xn--nyqy26a": _2, "健康": _2, "xn--otu796d": _2, "招聘": _2, "xn--p1acf": { "$": 1, "succ": { "xn--90amc": _3, "xn--j1aef": _3, "xn--j1ael8b": _3, "xn--h1ahn": _3, "xn--j1adp": _3, "xn--c1avg": _3, "xn--80aaa0cvac": _3, "xn--h1aliz": _3, "xn--90a1af": _3, "xn--41a": _3 } }, "рус": { "$": 1, "succ": { "биз": _3, "ком": _3, "крым": _3, "мир": _3, "мск": _3, "орг": _3, "самара": _3, "сочи": _3, "спб": _3, "я": _3 } }, "xn--pssy2u": _2, "大拿": _2, "xn--q9jyb4c": _2, "みんな": _2, "xn--qcka1pmc": _2, "グーグル": _2, "xn--rhqv96g": _2, "世界": _2, "xn--rovu88b": _2, "書籍": _2, "xn--ses554g": _2, "网址": _2, "xn--t60b56a": _2, "닷넷": _2, "xn--tckwe": _2, "コム": _2, "xn--tiq49xqyj": _2, "天主教": _2, "xn--unup4y": _2, "游戏": _2, "xn--vermgensberater-ctb": _2, "vermögensberater": _2, "xn--vermgensberatung-pwb": _2, "vermögensberatung": _2, "xn--vhquv": _2, "企业": _2, "xn--vuq861b": _2, "信息": _2, "xn--w4r85el8fhu5dnra": _2, "嘉里大酒店": _2, "xn--w4rs40l": _2, "嘉里": _2, "xn--xhq521b": _2, "广东": _2, "xn--zfr164b": _2, "政务": _2, "xyz": { "$": 1, "succ": { "blogsite": _3, "localzone": _3, "crafting": _3, "zapto": _3, "telebit": _5 } }, "yachts": _2, "yahoo": _2, "yamaxun": _2, "yandex": _2, "yodobashi": _2, "yoga": _2, "yokohama": _2, "you": _2, "youtube": _2, "yun": _2, "zappos": _2, "zara": _2, "zero": _2, "zip": _2, "zone": { "$": 1, "succ": { "cloud66": _3, "hs": _3, "triton": _5, "lima": _3 } }, "zuerich": _2 } };
    return rules;
})();

/**
 * Lookup parts of domain in Trie
 */
function lookupInTrie(parts, trie, index, allowedMask) {
    let result = null;
    let node = trie;
    while (node !== undefined) {
        // We have a match!
        if ((node.$ & allowedMask) !== 0) {
            result = {
                index: index + 1,
                isIcann: node.$ === 1 /* RULE_TYPE.ICANN */,
                isPrivate: node.$ === 2 /* RULE_TYPE.PRIVATE */,
            };
        }
        // No more `parts` to look for
        if (index === -1) {
            break;
        }
        const succ = node.succ;
        node = succ && (succ[parts[index]] || succ['*']);
        index -= 1;
    }
    return result;
}
/**
 * Check if `hostname` has a valid public suffix in `trie`.
 */
function suffixLookup(hostname, options, out) {
    if (fastPathLookup(hostname, options, out) === true) {
        return;
    }
    const hostnameParts = hostname.split('.');
    const allowedMask = (options.allowPrivateDomains === true ? 2 /* RULE_TYPE.PRIVATE */ : 0) |
        (options.allowIcannDomains === true ? 1 /* RULE_TYPE.ICANN */ : 0);
    // Look for exceptions
    const exceptionMatch = lookupInTrie(hostnameParts, exceptions, hostnameParts.length - 1, allowedMask);
    if (exceptionMatch !== null) {
        out.isIcann = exceptionMatch.isIcann;
        out.isPrivate = exceptionMatch.isPrivate;
        out.publicSuffix = hostnameParts.slice(exceptionMatch.index + 1).join('.');
        return;
    }
    // Look for a match in rules
    const rulesMatch = lookupInTrie(hostnameParts, rules, hostnameParts.length - 1, allowedMask);
    if (rulesMatch !== null) {
        out.isIcann = rulesMatch.isIcann;
        out.isPrivate = rulesMatch.isPrivate;
        out.publicSuffix = hostnameParts.slice(rulesMatch.index).join('.');
        return;
    }
    // No match found...
    // Prevailing rule is '*' so we consider the top-level domain to be the
    // public suffix of `hostname` (e.g.: 'example.org' => 'org').
    out.isIcann = false;
    out.isPrivate = false;
    out.publicSuffix = hostnameParts[hostnameParts.length - 1];
}

// For all methods but 'parse', it does not make sense to allocate an object
// every single time to only return the value of a specific attribute. To avoid
// this un-necessary allocation, we use a global object which is re-used.
const RESULT = getEmptyResult();
function parse(url, options = {}) {
    return parseImpl(url, 5 /* FLAG.ALL */, suffixLookup, options, getEmptyResult());
}
function getHostname(url, options = {}) {
    /*@__INLINE__*/ resetResult(RESULT);
    return parseImpl(url, 0 /* FLAG.HOSTNAME */, suffixLookup, options, RESULT).hostname;
}
function getPublicSuffix(url, options = {}) {
    /*@__INLINE__*/ resetResult(RESULT);
    return parseImpl(url, 2 /* FLAG.PUBLIC_SUFFIX */, suffixLookup, options, RESULT)
        .publicSuffix;
}
function getDomain(url, options = {}) {
    /*@__INLINE__*/ resetResult(RESULT);
    return parseImpl(url, 3 /* FLAG.DOMAIN */, suffixLookup, options, RESULT).domain;
}
function getSubdomain(url, options = {}) {
    /*@__INLINE__*/ resetResult(RESULT);
    return parseImpl(url, 4 /* FLAG.SUB_DOMAIN */, suffixLookup, options, RESULT)
        .subdomain;
}
function getDomainWithoutSuffix(url, options = {}) {
    /*@__INLINE__*/ resetResult(RESULT);
    return parseImpl(url, 5 /* FLAG.ALL */, suffixLookup, options, RESULT)
        .domainWithoutSuffix;
}

exports.getDomain = getDomain;
exports.getDomainWithoutSuffix = getDomainWithoutSuffix;
exports.getHostname = getHostname;
exports.getPublicSuffix = getPublicSuffix;
exports.getSubdomain = getSubdomain;
exports.parse = parse;


},{}],10:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("webextension-polyfill", ["module"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.browser = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (module) {
  /* webextension-polyfill - v0.10.0 - Fri Aug 12 2022 19:42:44 */

  /* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */

  /* vim: set sts=2 sw=2 et tw=80: */

  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  "use strict";

  if (!globalThis.chrome?.runtime?.id) {
    throw new Error("This script should only be loaded in a browser extension.");
  }

  if (typeof globalThis.browser === "undefined" || Object.getPrototypeOf(globalThis.browser) !== Object.prototype) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received."; // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.

    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            },
            "elements": {
              "createSidebarPane": {
                "minArgs": 1,
                "maxArgs": 1
              }
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goBack": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goForward": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };

      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }
      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */


      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }

        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }

          return super.get(key);
        }

      }
      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */


      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };
      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.reject
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function}
       *        The generated callback function.
       */


      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(new Error(extensionAPIs.runtime.lastError.message));
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };

      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";
      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */


      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }

          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }

          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({
                  resolve,
                  reject
                }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
                target[name](...args); // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.

                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;
                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({
                resolve,
                reject
              }, metadata));
            }
          });
        };
      };
      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the original method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */


      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }

        });
      };

      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */

      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return prop in target || prop in cache;
          },

          get(proxyTarget, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }

            if (!(prop in target)) {
              return undefined;
            }

            let value = target[prop];

            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.
              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else if (hasOwnProperty(metadata, "*")) {
              // Wrap all properties in * namespace.
              value = wrapObject(value, wrappers[prop], metadata["*"]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,

                get() {
                  return target[prop];
                },

                set(value) {
                  target[prop] = value;
                }

              });
              return value;
            }

            cache[prop] = value;
            return value;
          },

          set(proxyTarget, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }

            return true;
          },

          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },

          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }

        }; // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        //
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.

        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };
      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */


      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },

        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },

        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }

      });

      const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }
        /**
         * Wraps an onRequestFinished listener function so that it will return a
         * `getContent()` property which returns a `Promise` rather than using a
         * callback API.
         *
         * @param {object} req
         *        The HAR entry object representing the network request.
         */


        return function onRequestFinished(req) {
          const wrappedReq = wrapObject(req, {}
          /* wrappers */
          , {
            getContent: {
              minArgs: 0,
              maxArgs: 0
            }
          });
          listener(wrappedReq);
        };
      });
      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }
        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */


        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;
          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              didCallSendResponse = true;
              resolve(response);
            };
          });
          let result;

          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }

          const isResultThenable = result !== true && isThenable(result); // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.

          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          } // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).


          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;

              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }

              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          }; // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.


          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          } // Let Chrome know that the listener is replying.


          return true;
        };
      });

      const wrappedSendMessageCallback = ({
        reject,
        resolve
      }, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(new Error(extensionAPIs.runtime.lastError.message));
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };

      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }

        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }

        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, {
            resolve,
            reject
          });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };

      const staticWrappers = {
        devtools: {
          network: {
            onRequestFinished: wrapEvent(onRequestFinishedWrappers)
          }
        },
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 1,
            maxArgs: 3
          })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 2,
            maxArgs: 3
          })
        }
      };
      const settingMetadata = {
        clear: {
          minArgs: 1,
          maxArgs: 1
        },
        get: {
          minArgs: 1,
          maxArgs: 1
        },
        set: {
          minArgs: 1,
          maxArgs: 1
        }
      };
      apiMetadata.privacy = {
        network: {
          "*": settingMetadata
        },
        services: {
          "*": settingMetadata
        },
        websites: {
          "*": settingMetadata
        }
      };
      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    }; // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.


    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = globalThis.browser;
  }
});


},{}],11:[function(require,module,exports){
module.exports={
    "readme": "https://github.com/duckduckgo/privacy-configuration",
    "version": 1679992058904,
    "features": {
        "adClickAttribution": {
            "readme": "https://help.duckduckgo.com/duckduckgo-help-pages/privacy/web-tracking-protections/#3rd-party-tracker-loading-protection",
            "state": "enabled",
            "exceptions": [],
            "settings": {
                "linkFormats": [
                    {
                        "url": "duckduckgo.com/y.js",
                        "adDomainParameterName": "ad_domain",
                        "desc": "SERP Ads"
                    },
                    {
                        "url": "www.search-company.site/y.js",
                        "adDomainParameterName": "ad_domain",
                        "desc": "Test Domain"
                    },
                    {
                        "url": "www.search-company.example/y.js",
                        "adDomainParameterName": "ad_domain",
                        "desc": "Test Domain"
                    },
                    {
                        "url": "links.duckduckgo.com/m.js",
                        "adDomainParameterName": "ad_domain",
                        "desc": "Shopping Ads"
                    },
                    {
                        "url": "www.search-company.site/m.js",
                        "adDomainParameterName": "ad_domain",
                        "desc": "Test Domain"
                    },
                    {
                        "url": "www.search-company.example/m.js",
                        "adDomainParameterName": "ad_domain",
                        "desc": "Test Domain"
                    }
                ],
                "allowlist": [
                    {
                        "blocklistEntry": "bing.com",
                        "host": "bat.bing.com"
                    },
                    {
                        "blocklistEntry": "ad-company.site",
                        "host": "convert.ad-company.site"
                    },
                    {
                        "blocklistEntry": "ad-company.example",
                        "host": "convert.ad-company.example"
                    }
                ],
                "navigationExpiration": 1800,
                "totalExpiration": 604800,
                "heuristicDetection": "enabled",
                "domainDetection": "enabled"
            },
            "hash": "b813ade8472a097ffbd43a3331116fe1"
        },
        "ampLinks": {
            "exceptions": [
                {
                    "domain": "freecodecamp.org",
                    "reason": "Clicking 'get started' reloads the page and does not progress to the login page."
                },
                {
                    "domain": "www.audiosciencereview.com",
                    "reason": "Pages on the site end up in redirect loops in Firefox."
                }
            ],
            "settings": {
                "deepExtractionEnabled": true,
                "deepExtractionTimeout": 1500,
                "linkFormats": [
                    "^https?:\\/\\/(?:w{3}\\.)?google\\.\\S{2,}\\/amp\\/s\\/(\\S+)$",
                    "^https?:\\/\\/\\S+ampproject\\.org\\/\\S\\/s\\/(\\S+)$"
                ],
                "keywords": [
                    "=amp",
                    "amp=",
                    "&amp",
                    "amp&",
                    "/amp",
                    "amp/",
                    ".amp",
                    "amp.",
                    "%amp",
                    "amp%",
                    "_amp",
                    "amp_",
                    "?amp"
                ]
            },
            "state": "enabled",
            "hash": "8668c1396cf49ac18e2e057c48dac1a7"
        },
        "autoconsent": {
            "exceptions": [
                {
                    "domain": "zeitraum-moebel.de",
                    "reason": "After the cookie popup is managed and disappears, a semi-transparent overlay remains on the page which prevents further interaction with the site."
                },
                {
                    "domain": "mathebibel.de",
                    "reason": "Page renders but one cannot scroll (and no CMP is shown) for a few seconds."
                },
                {
                    "domain": "focus.de",
                    "reason": "Page renders but one cannot scroll (and no CMP is shown) for a few seconds."
                },
                {
                    "domain": "computerbild.de",
                    "reason": "Page renders but one cannot scroll (and no CMP is shown) for a few seconds."
                },
                {
                    "domain": "techtarget.com",
                    "reason": "Page renders but one cannot scroll (and no CMP is shown) for a few seconds."
                },
                {
                    "domain": "n-tv.de",
                    "reason": "Page renders but one cannot scroll (and no CMP is shown) for a few seconds."
                },
                {
                    "domain": "spiegel.de",
                    "reason": "CMP gets incorrectly handled, gets stuck in preferences dialogue."
                },
                {
                    "domain": "derstandard.at",
                    "reason": "CMP gets incorrectly handled / detected."
                },
                {
                    "domain": "concursolutions.com",
                    "reason": "Page renders blank for several seconds before cookie management can complete."
                },
                {
                    "domain": "asus.com",
                    "reason": "Opt out is broken on the US version of the site"
                },
                {
                    "domain": "swm.de",
                    "reason": "infinite reload"
                },
                {
                    "domain": "heise.de",
                    "reason": "infinite reload"
                },
                {
                    "domain": "voici.fr",
                    "reason": "https://github.com/duckduckgo/autoconsent/issues/66"
                },
                {
                    "domain": "tfl.gov.uk",
                    "reason": "https://github.com/duckduckgo/autoconsent/issues/68"
                },
                {
                    "domain": "corporatefinanceinstitute.com",
                    "reason": "CMP gets incorrectly handled / repeatedly opens tabs"
                },
                {
                    "domain": "kicker.de",
                    "reason": "https://github.com/duckduckgo/autoconsent/issues/66"
                },
                {
                    "domain": "epojisteni.cz",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/326"
                },
                {
                    "domain": "nhm.ac.uk",
                    "reason": "https://github.com/duckduckgo/autoconsent/issues/113"
                }
            ],
            "settings": {
                "disabledCMPs": [
                    "Sourcepoint-top"
                ]
            },
            "state": "disabled",
            "hash": "90db6caedebe315a0737ca1f746d5f52"
        },
        "autofill": {
            "exceptions": [
                {
                    "domain": "containerstore.com",
                    "reason": "Generally poor UX - no username saved on signup, prompts for Duck address on 'forgot password'."
                },
                {
                    "domain": "roll20.net",
                    "reason": "Performance issue for too many fields."
                }
            ],
            "state": "enabled",
            "hash": "59c4bd9b8cee343c81da98bfe5d77928"
        },
        "clickToLoad": {
            "exceptions": [],
            "settings": {
                "Facebook, Inc.": {
                    "ruleActions": [
                        "block-ctl-fb"
                    ],
                    "state": "enabled"
                },
                "Youtube": {
                    "ruleActions": [
                        "block-ctl-yt"
                    ],
                    "state": "disabled"
                }
            },
            "state": "enabled",
            "hash": "13f0b3ad67d6e300e17c52191ed4b963"
        },
        "clickToPlay": {
            "exceptions": [],
            "settings": {
                "Facebook": {
                    "clicksBeforeSimpleVersion": 3,
                    "ruleActions": [
                        "block-ctl-fb"
                    ],
                    "state": "enabled"
                }
            },
            "state": "enabled",
            "hash": "2f0917addece756bfb107fc3fba535e9"
        },
        "contentBlocking": {
            "state": "enabled",
            "exceptions": [
                {
                    "domain": "welt.de",
                    "reason": "Video pauses at about 13-15 seconds in. Playing the video again results in a single frame rendering without progressing to the next frame."
                }
            ],
            "hash": "ee4fc0c8e6acc9ef2629ae96156a76a5"
        },
        "cookie": {
            "exceptions": [
                {
                    "domain": "nespresso.com",
                    "reason": "Clicking 'Continue' after filling out details for account creation yields an error."
                }
            ],
            "state": "enabled",
            "minSupportedVersion": "2022.6.1",
            "settings": {
                "trackerCookie": "enabled",
                "nonTrackerCookie": "disabled",
                "excludedCookieDomains": [
                    {
                        "domain": "accounts.google.com",
                        "reason": "On some Google sign-in flows, there is an error after entering username and proceeding: 'Your browser has cookies disabled. Make sure that your cookies are enabled and try again.'"
                    },
                    {
                        "domain": "pay.google.com",
                        "reason": "After sign-in for Google Pay flows, there is repeated flickering and a loading spinner, preventing the flow from proceeding."
                    },
                    {
                        "domain": "payments.google.com",
                        "reason": "After sign-in for Google Pay flows (after flickering is resolved), blocking this causes the loading spinner to spin indefinitely, and the payment flow cannot proceed."
                    }
                ],
                "firstPartyTrackerCookiePolicy": {
                    "readme": "This policy is deprecated. We are expanding this protection to all first party cookies set by scripts and using firstPartyCookiePolicy policy instead.",
                    "threshold": 86400,
                    "maxAge": 86400
                },
                "firstPartyCookiePolicy": {
                    "threshold": 604800,
                    "maxAge": 604800
                }
            },
            "hash": "a86050a6a0612aee10f70fd8ca9b6d0c"
        },
        "customUserAgent": {
            "settings": {
                "omitApplicationSites": [
                    {
                        "domain": "thingiverse.com",
                        "reason": "Site loads blank and does not proceed."
                    },
                    {
                        "domain": "qubushotel.com",
                        "reason": "Homepage UI elements appear squashed together, preventing interaction with the site."
                    },
                    {
                        "domain": "digid.nl",
                        "reason": "https://github.com/duckduckgo/privacy-configuration/issues/602"
                    },
                    {
                        "domain": "sme.sk",
                        "reason": "https://github.com/duckduckgo/privacy-configuration/issues/667"
                    },
                    {
                        "domain": "tiktok.com",
                        "reason": "https://github.com/duckduckgo/privacy-configuration/issues/667"
                    }
                ],
                "omitVersionSites": []
            },
            "exceptions": [],
            "state": "disabled",
            "hash": "b1a30e9afcf663d1ad99590c14a5b5be"
        },
        "duckPlayer": {
            "exceptions": [],
            "state": "disabled",
            "hash": "728493ef7a1488e4781656d3f9db84aa"
        },
        "elementHiding": {
            "exceptions": [
                {
                    "domain": "politico.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/592"
                },
                {
                    "domain": "bild.de",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/589"
                },
                {
                    "domain": "kbb.com",
                    "reason": "Adblocker wall"
                },
                {
                    "domain": "medium.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/592"
                },
                {
                    "domain": "speedtest.net",
                    "reason": "main content hidden"
                },
                {
                    "domain": "tvlistings.zap2it.com",
                    "reason": "main content hidden"
                },
                {
                    "domain": "manhwascan.net",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/592"
                },
                {
                    "domain": "wiwo.de",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/592"
                },
                {
                    "domain": "metro.co.uk",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/592"
                },
                {
                    "domain": "blick.ch",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/592"
                }
            ],
            "settings": {
                "useStrictHideStyleTag": false,
                "rules": [
                    {
                        "selector": "[id*='gpt-']",
                        "type": "hide-empty"
                    },
                    {
                        "selector": "[class*='gpt-']",
                        "type": "closest-empty"
                    },
                    {
                        "selector": "[class*='dfp-']",
                        "type": "hide-empty"
                    },
                    {
                        "selector": "[id*='dfp-']",
                        "type": "hide-empty"
                    },
                    {
                        "selector": "[id*='dfp_']",
                        "type": "closest-empty"
                    },
                    {
                        "selector": "[id*='google_ads_iframe']",
                        "type": "hide"
                    },
                    {
                        "selector": "#google_ads",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".adsbygoogle",
                        "type": "hide-empty"
                    },
                    {
                        "selector": "[id*='taboola-']",
                        "type": "hide"
                    },
                    {
                        "selector": ".taboolaHeight",
                        "type": "hide"
                    },
                    {
                        "selector": ".taboola-placeholder",
                        "type": "hide"
                    },
                    {
                        "selector": ".adHolder",
                        "type": "closest-empty"
                    },
                    {
                        "selector": ".adplaceholder",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".ad-placeholder",
                        "type": "hide-empty"
                    },
                    {
                        "selector": "[class*='ad_unit']",
                        "type": "closest-empty"
                    },
                    {
                        "selector": ".column-ad",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".wide-ad",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".ad",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".AD",
                        "type": "hide-empty"
                    },
                    {
                        "selector": "[class*='ad-content']",
                        "type": "hide-empty"
                    },
                    {
                        "selector": "[class*='ad-slot_']",
                        "type": "hide-empty"
                    },
                    {
                        "selector": "[class*='_ad-slot']",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".ad-block",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".adBox",
                        "type": "hide-empty"
                    },
                    {
                        "selector": "[class^='adunit']",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".apexAd",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".ad-leaderboard",
                        "type": "closest-empty"
                    },
                    {
                        "selector": ".leaderboard",
                        "type": "closest-empty"
                    },
                    {
                        "selector": "#leaderboard",
                        "type": "closest-empty"
                    },
                    {
                        "selector": ".leaderboard_wrapper",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".banner-leaderboard",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".ad-banner-container",
                        "type": "hide-empty"
                    },
                    {
                        "selector": "[class*='bannerAd']",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".banner-placeholder",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".header-ads",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".header-ad-slot",
                        "type": "hide-empty"
                    },
                    {
                        "selector": "#credential_picker_container",
                        "type": "hide"
                    },
                    {
                        "selector": "#credential_picker_iframe",
                        "type": "hide"
                    },
                    {
                        "selector": "#google-one-tap-iframe",
                        "type": "hide"
                    },
                    {
                        "selector": ".google-one-tap-modal-div",
                        "type": "hide"
                    },
                    {
                        "selector": ".google-one-tap",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".ad_container",
                        "type": "closest-empty"
                    },
                    {
                        "selector": "[class^='ad-container']",
                        "type": "hide-empty"
                    },
                    {
                        "selector": "[class*='-ad-container']",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".adcontainer",
                        "type": "closest-empty"
                    },
                    {
                        "selector": ".ad-current",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".advertisement",
                        "type": "closest-empty"
                    },
                    {
                        "selector": "[class*='advert-']",
                        "type": "hide-empty"
                    },
                    {
                        "selector": "[id*='advert-']",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".ads__inline",
                        "type": "closest-empty"
                    },
                    {
                        "selector": ".ads__native",
                        "type": "closest-empty"
                    },
                    {
                        "selector": ".ad-slot",
                        "type": "closest-empty"
                    },
                    {
                        "selector": ".ad-wrap",
                        "type": "closest-empty"
                    },
                    {
                        "selector": ".ad-wrapper",
                        "type": "closest-empty"
                    },
                    {
                        "selector": ".ads-wrapper",
                        "type": "closest-empty"
                    },
                    {
                        "selector": "[class^='adWrapper']",
                        "type": "closest-empty"
                    },
                    {
                        "selector": "[class*='ad-zone']",
                        "type": "hide-empty"
                    },
                    {
                        "selector": "[data-adunitpath]",
                        "type": "closest-empty"
                    },
                    {
                        "selector": "[data-targeting]",
                        "type": "closest-empty"
                    },
                    {
                        "selector": "[data-ad-placeholder]",
                        "type": "closest-empty"
                    },
                    {
                        "selector": "[data-ad]",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".arc-ad-wrapper",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".bordeaux-slot",
                        "type": "closest-empty"
                    },
                    {
                        "selector": ".bordeaux-anchored-container",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".rightAd",
                        "type": "hide-empty"
                    },
                    {
                        "selector": ".sponsored-slot",
                        "type": "hide-empty"
                    }
                ],
                "styleTagExceptions": [],
                "mediaAndFormSelectors": "video,canvas,embed,object,audio,map,form,input,textarea,select,option,button",
                "adLabelStrings": [
                    "advertisement",
                    "advertisment",
                    "advertisementclose",
                    "advertisementcontinue reading the main story",
                    "advertisement\ncontinue reading the main story",
                    "advertisement\n\ncontinue reading the main story",
                    "advertisement - scroll to continue",
                    "advertisement · scroll to continue",
                    "advertising",
                    "advertising\nskip ad",
                    "advertising\nskip ad\nskip ad\nskip ad",
                    "ad feedback",
                    "anzeige",
                    "close this ad",
                    "sponsored",
                    "sponsorisé",
                    "story continues below advertisement",
                    "publicité",
                    "publicidade",
                    "reklama",
                    "skip ad",
                    "continue reading the main story"
                ],
                "domains": [
                    {
                        "domain": "abc.es",
                        "rules": [
                            {
                                "selector": ".voc-advertising",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "apnews.com",
                        "rules": [
                            {
                                "selector": ".proper-dynamic-insertion",
                                "type": "closest-empty"
                            }
                        ]
                    },
                    {
                        "domain": "bbc.com",
                        "rules": [
                            {
                                "selector": ".dotcom-ad",
                                "type": "closest-empty"
                            },
                            {
                                "selector": ".leaderboard-ad-placeholder",
                                "type": "closest-empty"
                            }
                        ]
                    },
                    {
                        "domain": "bleacherreport.com",
                        "rules": [
                            {
                                "selector": ".br-ad-wrapper",
                                "type": "closest-empty"
                            }
                        ]
                    },
                    {
                        "domain": "bloomberg.com",
                        "rules": [
                            {
                                "selector": ".unsupported-browser-notification-container",
                                "type": "hide"
                            }
                        ]
                    },
                    {
                        "domain": "bostonglobe.com",
                        "rules": [
                            {
                                "selector": ".arc_ad",
                                "type": "closest-empty"
                            }
                        ]
                    },
                    {
                        "domain": "carandclassic.com",
                        "rules": [
                            {
                                "selector": "[id*='advert-']",
                                "type": "override"
                            }
                        ]
                    },
                    {
                        "domain": "cbc.ca",
                        "rules": [
                            {
                                "selector": ".ad-risingstar-container",
                                "type": "hide-empty"
                            },
                            {
                                "selector": ".bigBoxContainer",
                                "type": "hide-empty"
                            },
                            {
                                "selector": ".stickyRailAd",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "cbssports.com",
                        "rules": [
                            {
                                "selector": ".leaderboard-wrap",
                                "type": "hide-empty"
                            },
                            {
                                "selector": ".skybox-top-wrapper",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "coingecko.com",
                        "rules": [
                            {
                                "selector": "[data-target='ads.banner']",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "cyclingtips.com",
                        "rules": [
                            {
                                "selector": "[data-block-name='ads']",
                                "type": "closest-empty"
                            }
                        ]
                    },
                    {
                        "domain": "dallasnews.com",
                        "rules": [
                            {
                                "selector": "[data-targeting]",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "ebay.com",
                        "rules": [
                            {
                                "selector": "#g-yolo-overlay-holder",
                                "type": "hide"
                            }
                        ]
                    },
                    {
                        "domain": "ebay-kleinanzeigen.de",
                        "rules": [
                            {
                                "selector": "[data-liberty-position-name]",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "eonline.com",
                        "rules": [
                            {
                                "selector": "[class*='mps-']",
                                "type": "closest-empty"
                            }
                        ]
                    },
                    {
                        "domain": "essentiallysports.com",
                        "rules": [
                            {
                                "selector": ".es-ad-space-container",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "express.co.uk",
                        "rules": [
                            {
                                "selector": ".superbanner",
                                "type": "hide-empty"
                            },
                            {
                                "selector": "#ad-vip-article",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "fandom.com",
                        "rules": [
                            {
                                "selector": ".top-ads-container",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "forbes.com",
                        "rules": [
                            {
                                "selector": "fbs-ad",
                                "type": "closest-empty"
                            }
                        ]
                    },
                    {
                        "domain": "fortune.com",
                        "rules": [
                            {
                                "selector": "[id*='Leaderboard']",
                                "type": "closest-empty"
                            },
                            {
                                "selector": "[id*='RightRailFlex']",
                                "type": "closest-empty"
                            },
                            {
                                "selector": "[id*='InStream']",
                                "type": "closest-empty"
                            }
                        ]
                    },
                    {
                        "domain": "foxnews.com",
                        "rules": [
                            {
                                "selector": ".vendor-unit",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "ghacks.net",
                        "rules": [
                            {
                                "selector": ".box-banner",
                                "type": "hide-empty"
                            },
                            {
                                "selector": "[id^='ghacks_ad_code']",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "hindustantimes.com",
                        "rules": [
                            {
                                "selector": ".desktopAd",
                                "type": "hide-empty"
                            },
                            {
                                "selector": "[class^='adHeight']",
                                "type": "hide-empty"
                            },
                            {
                                "selector": "[class^='adMinHeight']",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "huffpost.com",
                        "rules": [
                            {
                                "selector": ".connatix-player",
                                "type": "closest-empty"
                            }
                        ]
                    },
                    {
                        "domain": "indiatimes.com",
                        "rules": [
                            {
                                "selector": ".ad-cls",
                                "type": "hide-empty"
                            },
                            {
                                "selector": "._3JJMX",
                                "type": "hide-empty"
                            },
                            {
                                "selector": ".paisa-wrapper",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "indy100.com",
                        "rules": [
                            {
                                "selector": "[id*='thirdparty']",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "leboncoin.fr",
                        "rules": [
                            {
                                "selector": "#lht-space-ad",
                                "type": "hide-empty"
                            },
                            {
                                "selector": "[class*='styles__ad']",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "livemint.com",
                        "rules": [
                            {
                                "selector": "#adfreeDeskSpace",
                                "type": "hide-empty"
                            },
                            {
                                "selector": "#dekBudgetAd",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "macrumors.com",
                        "rules": [
                            {
                                "selector": ".tertiary",
                                "type": "hide-empty"
                            },
                            {
                                "selector": "[class*='sidebarblock']",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "marketwatch.com",
                        "rules": [
                            {
                                "selector": ".j-ad",
                                "type": "closest-empty"
                            }
                        ]
                    },
                    {
                        "domain": "mirror.co.uk",
                        "rules": [
                            {
                                "selector": "#comments-standalone-mpu",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "nasdaq.com",
                        "rules": [
                            {
                                "selector": "[class^='ads__midpage']",
                                "type": "hide-empty"
                            },
                            {
                                "selector": "[class^='ads__right-rail']",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "nbcsports.com",
                        "rules": [
                            {
                                "selector": ".block-mps",
                                "type": "hide-empty"
                            },
                            {
                                "selector": "#nbcsports-leaderboard",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "newsmax.com",
                        "rules": [
                            {
                                "selector": ".DFPad",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "nytimes.com",
                        "rules": [
                            {
                                "selector": "#top-wrapper",
                                "type": "hide-empty"
                            },
                            {
                                "selector": "#bottom-wrapper",
                                "type": "hide-empty"
                            },
                            {
                                "selector": "#mid1-wrapper",
                                "type": "hide-empty"
                            },
                            {
                                "selector": "#mid2-wrapper",
                                "type": "hide-empty"
                            },
                            {
                                "selector": "#mid3-wrapper",
                                "type": "hide-empty"
                            },
                            {
                                "selector": "#mktg-wrapper",
                                "type": "hide-empty"
                            },
                            {
                                "selector": ".e1xxpj0j1",
                                "type": "hide-empty"
                            },
                            {
                                "selector": "[id*='story-ad']",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "observador.pt",
                        "rules": [
                            {
                                "selector": ".obs-ad-placeholder",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "orange.fr",
                        "rules": [
                            {
                                "selector": ".tag-rm",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "psypost.com",
                        "rules": [
                            {
                                "selector": ".jeg_midbar",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "qz.com",
                        "rules": [
                            {
                                "selector": "#marquee-ad",
                                "type": "closest-empty"
                            }
                        ]
                    },
                    {
                        "domain": "reuters.com",
                        "rules": [
                            {
                                "selector": "[testid='ResponsiveAdSlot']",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "rumble.com",
                        "rules": [
                            {
                                "selector": "[id^='rumble-ad']",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "scmp.com",
                        "rules": [
                            {
                                "selector": "[class*='ad-slot-container']",
                                "type": "hide-empty"
                            },
                            {
                                "selector": ".top-ad",
                                "type": "hide-empty"
                            },
                            {
                                "selector": ".advertisement--mobile",
                                "type": "hide-empty"
                            },
                            {
                                "selector": ".bottom-ad",
                                "type": "hide-empty"
                            },
                            {
                                "selector": ".article-list__inline-ad",
                                "type": "hide-empty"
                            },
                            {
                                "selector": ".page-container__mobile-native-ad",
                                "type": "hide-empty"
                            },
                            {
                                "selector": ".ad-area",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "si.com",
                        "rules": [
                            {
                                "selector": ".m-ad",
                                "type": "closest-empty"
                            },
                            {
                                "selector": ".m-header-ad",
                                "type": "closest-empty"
                            }
                        ]
                    },
                    {
                        "domain": "skysports.com",
                        "rules": [
                            {
                                "selector": "[data-format='leaderboard']",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "snopes.com",
                        "rules": [
                            {
                                "selector": ".proper-dynamic-insertion",
                                "type": "closest-empty"
                            }
                        ]
                    },
                    {
                        "domain": "target.com",
                        "rules": [
                            {
                                "selector": "[class^='styles__PubAdWrapper']",
                                "type": "closest-empty"
                            }
                        ]
                    },
                    {
                        "domain": "thingiverse.com",
                        "rules": [
                            {
                                "selector": "[class*='AdCard__leaderboard']",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "tripadvisor.com",
                        "rules": [
                            {
                                "selector": "#tripGoogleOnetapContainer",
                                "type": "hide"
                            }
                        ]
                    },
                    {
                        "domain": "uol.com.br",
                        "rules": [
                            {
                                "selector": ".model-base-bnr",
                                "type": "hide"
                            }
                        ]
                    },
                    {
                        "domain": "wunderground.com",
                        "rules": [
                            {
                                "selector": ".pane-wu-fullscreenweather-ad-box-atf",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "vice.com",
                        "rules": [
                            {
                                "selector": ".adph",
                                "type": "hide-empty"
                            },
                            {
                                "selector": ".vice-ad__container",
                                "type": "hide-empty"
                            },
                            {
                                "selector": ".fixed-slot",
                                "type": "hide"
                            }
                        ]
                    },
                    {
                        "domain": "washingtonpost.com",
                        "rules": [
                            {
                                "selector": "wp-ad",
                                "type": "closest-empty"
                            },
                            {
                                "selector": "#leaderboard-wrapper",
                                "type": "hide-empty"
                            },
                            {
                                "selector": ".outbrain-wrapper",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "wsj.com",
                        "rules": [
                            {
                                "selector": "#cx-what-to-read-next",
                                "type": "closest-empty"
                            }
                        ]
                    },
                    {
                        "domain": "yahoo.com",
                        "rules": [
                            {
                                "selector": ".darla",
                                "type": "closest-empty"
                            }
                        ]
                    },
                    {
                        "domain": "gazeta.pl",
                        "rules": [
                            {
                                "selector": "[class*='DFP-']",
                                "type": "closest-empty"
                            },
                            {
                                "selector": "[id*='banC']",
                                "type": "hide-empty"
                            },
                            {
                                "selector": ".indexPremium__adv",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "nfl.com",
                        "rules": [
                            {
                                "selector": "[class*='adv-block']",
                                "type": "closest-empty"
                            }
                        ]
                    },
                    {
                        "domain": "usatoday.com",
                        "rules": [
                            {
                                "selector": "[aria-label='advertisement']",
                                "type": "closest-empty"
                            },
                            {
                                "selector": ".gnt_tb",
                                "type": "hide-empty"
                            },
                            {
                                "selector": ".gnt_flp",
                                "type": "hide-empty"
                            }
                        ]
                    },
                    {
                        "domain": "washingtontimes.com",
                        "rules": [
                            {
                                "selector": ".connatixcontainer",
                                "type": "hide"
                            },
                            {
                                "selector": "[id*='cxense-']",
                                "type": "closest-empty"
                            }
                        ]
                    },
                    {
                        "domain": "xfinity.com",
                        "rules": [
                            {
                                "selector": ".f-gpc-flyout",
                                "type": "hide"
                            },
                            {
                                "selector": ".f-gpc-banner",
                                "type": "hide"
                            }
                        ]
                    },
                    {
                        "domain": "first-party.site",
                        "rules": [
                            {
                                "selector": ".hide-test",
                                "type": "hide"
                            },
                            {
                                "selector": ".hide-empty-test",
                                "type": "hide-empty"
                            },
                            {
                                "selector": ".closest-empty-test",
                                "type": "closest-empty"
                            },
                            {
                                "selector": "[class^='ad-container']",
                                "type": "override"
                            }
                        ]
                    },
                    {
                        "domain": "privacy-test-pages.glitch.me",
                        "rules": [
                            {
                                "selector": ".hide-test",
                                "type": "hide"
                            },
                            {
                                "selector": ".hide-empty-test",
                                "type": "hide-empty"
                            },
                            {
                                "selector": ".closest-empty-test",
                                "type": "closest-empty"
                            },
                            {
                                "selector": "[class^='ad-container']",
                                "type": "override"
                            }
                        ]
                    }
                ]
            },
            "state": "enabled",
            "hash": "c13b227c89c72e4d75065edf9e8849b4"
        },
        "fingerprintingAudio": {
            "state": "disabled",
            "exceptions": [],
            "hash": "c292bb627849854515cebbded288ef5a"
        },
        "fingerprintingBattery": {
            "exceptions": [],
            "state": "enabled",
            "hash": "52857469413a66e8b0c7b00de5589162"
        },
        "fingerprintingCanvas": {
            "settings": {
                "webGl": "enabled"
            },
            "exceptions": [
                {
                    "domain": "adidas.com",
                    "reason": "When adding an item to the cart, there is an error 'An unexpected problem occurred' and the item is not added to the cart."
                },
                {
                    "domain": "adidas.co.uk",
                    "reason": "When adding an item to the cart, there is an error 'An unexpected problem occurred' and the item is not added to the cart."
                },
                {
                    "domain": "amtrak.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/499"
                },
                {
                    "domain": "emirates.com",
                    "reason": "After filling out flight information and clicking 'Search flights', a blank page is shown for several seconds before the page redirects."
                },
                {
                    "domain": "hm.com",
                    "reason": "When adding an item to cart, there is an error 'something went wrong', and the item does not get added to the cart."
                },
                {
                    "domain": "ikea.com",
                    "reason": "When creating an account, after filling out details and going to e-mail confirmation, there is an error 'Something went wrong', and the e-mail may not be received. Clicking 'Send new code' appears successful, but after entering the code there is often another account creation error."
                },
                {
                    "domain": "manulife.ca",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/499"
                },
                {
                    "domain": "northernrailway.co.uk",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/350"
                },
                {
                    "domain": "spirit.com",
                    "reason": "When attempting to sign in, a semi-transparent overlay appears over the page which prevents further interaction with the site."
                },
                {
                    "domain": "thetrainline.com",
                    "reason": "After filling out travel info and clicking 'Get times & tickets', there is an error warning that 'Something went wrong', which prevents further interaction."
                },
                {
                    "domain": "walgreens.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/499"
                },
                {
                    "domain": "godaddy.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/499"
                }
            ],
            "state": "enabled",
            "hash": "06756b6634deaeb0f50c9cbbdb591b3c"
        },
        "fingerprintingHardware": {
            "settings": {
                "keyboard": {
                    "type": "undefined"
                },
                "hardwareConcurrency": {
                    "type": "number",
                    "value": 2
                },
                "deviceMemory": {
                    "type": "number",
                    "value": 8
                }
            },
            "exceptions": [
                {
                    "domain": "gamestop.com",
                    "reason": "Clicking 'add to cart' causes a spinner to load briefly, and the item doesn't get added to the cart."
                },
                {
                    "domain": "godaddy.com",
                    "reason": "After entering login details and clicking to log in, the site shows an adwall and prevents login."
                },
                {
                    "domain": "realestate.com.au",
                    "reason": "Site loads blank and does not proceed."
                },
                {
                    "domain": "secureserver.net",
                    "reason": "After entering login details and clicking to log in, the site shows an adwall and prevents login."
                },
                {
                    "domain": "hyatt.com",
                    "reason": "Site loads blank and does not proceed."
                }
            ],
            "state": "enabled",
            "hash": "a445e9d5b517efc11be4406673301d8a"
        },
        "fingerprintingScreenSize": {
            "settings": {
                "availTop": {
                    "type": "number",
                    "value": 0
                },
                "availLeft": {
                    "type": "number",
                    "value": 0
                },
                "colorDepth": {
                    "type": "number",
                    "value": 24
                },
                "pixelDepth": {
                    "type": "number",
                    "value": 24
                }
            },
            "exceptions": [
                {
                    "domain": "gamestop.com",
                    "reason": "Clicking 'add to cart' causes a spinner to load briefly, and the item doesn't get added to the cart."
                },
                {
                    "domain": "godaddy.com",
                    "reason": "After entering login details and clicking to log in, the site shows an adwall and prevents login."
                },
                {
                    "domain": "hyatt.com",
                    "reason": "Site loads blank and does not proceed."
                },
                {
                    "domain": "secureserver.net",
                    "reason": "After entering login details and clicking to log in, the site shows an adwall and prevents login."
                }
            ],
            "state": "enabled",
            "hash": "7d4ea2f0c3583b807e930b1397e82ba3"
        },
        "fingerprintingTemporaryStorage": {
            "exceptions": [],
            "state": "enabled",
            "hash": "52857469413a66e8b0c7b00de5589162"
        },
        "googleRejected": {
            "exceptions": [],
            "state": "enabled",
            "hash": "52857469413a66e8b0c7b00de5589162"
        },
        "gpc": {
            "state": "enabled",
            "exceptions": [
                {
                    "domain": "allegiantair.com",
                    "reason": "Example URL: https://www.allegiantair.com/seating-checking-boarding; Clicking the 'show details' button in the FAQ sections does nothing."
                },
                {
                    "domain": "costco.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/644"
                },
                {
                    "domain": "duluthtrading.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/700"
                },
                {
                    "domain": "web.whatsapp.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/620"
                }
            ],
            "settings": {
                "gpcHeaderEnabledSites": [
                    "global-privacy-control.glitch.me",
                    "globalprivacycontrol.org",
                    "washingtonpost.com",
                    "nytimes.com",
                    "privacy-test-pages.glitch.me"
                ]
            },
            "hash": "470c77b05c99b8f0986cc40422a59c91"
        },
        "https": {
            "state": "enabled",
            "exceptions": [],
            "hash": "697382e31649d84b01166f1dc6f790d6"
        },
        "incontextSignup": {
            "exceptions": [],
            "state": "disabled",
            "hash": "728493ef7a1488e4781656d3f9db84aa"
        },
        "navigatorInterface": {
            "exceptions": [],
            "state": "enabled",
            "hash": "52857469413a66e8b0c7b00de5589162"
        },
        "nonTracking3pCookies": {
            "settings": {
                "excludedCookieDomains": []
            },
            "exceptions": [],
            "state": "disabled",
            "hash": "d6bd423722e7888ee5372f871395f211"
        },
        "referrer": {
            "exceptions": [
                {
                    "domain": "canadapost-postescanada.ca",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/647"
                }
            ],
            "state": "enabled",
            "hash": "118f6c323fac42ad0ab7ac4c7ac8a93d"
        },
        "requestFilterer": {
            "state": "disabled",
            "exceptions": [],
            "settings": {
                "windowInMs": 0
            },
            "hash": "9439c856372a09f0cfdc9e2e0fd086fd"
        },
        "runtimeChecks": {
            "state": "enabled",
            "exceptions": [
                {
                    "domain": "stackoverflow.com",
                    "reason": "https://github.com/duckduckgo/duckduckgo-privacy-extension/issues/1819"
                },
                {
                    "domain": "stackexchange.com",
                    "reason": "https://github.com/duckduckgo/duckduckgo-privacy-extension/issues/1819"
                }
            ],
            "settings": {
                "taintCheck": "disabled",
                "matchAllDomains": "disabled",
                "matchAllStackDomains": "disabled",
                "overloadInstanceOf": "enabled",
                "elementRemovalTimeout": 1000,
                "domains": [
                    {
                        "domain": "bbc.co.uk"
                    },
                    {
                        "domain": "cnn.com"
                    },
                    {
                        "domain": "preactjs.com"
                    },
                    {
                        "domain": "reactjs.org"
                    },
                    {
                        "domain": "browserbench.org"
                    },
                    {
                        "domain": "xnxx.com"
                    },
                    {
                        "domain": "wikipedia.org"
                    },
                    {
                        "domain": "xvideos.com"
                    },
                    {
                        "domain": "pornhub.com"
                    },
                    {
                        "domain": "reddit.com"
                    },
                    {
                        "domain": "amazon.com"
                    },
                    {
                        "domain": "youtube.com"
                    },
                    {
                        "domain": "facebook.com"
                    },
                    {
                        "domain": "youtube.com"
                    },
                    {
                        "disabled_domain": "stackoverflow.com"
                    },
                    {
                        "domain": "xhamster.com"
                    }
                ],
                "stackDomains": [
                    {
                        "domain": "clean.gg"
                    },
                    {
                        "domain": "googlevideo.com"
                    },
                    {
                        "domain": "nexac.com"
                    },
                    {
                        "domain": "associates-amazon.com"
                    },
                    {
                        "domain": "redd.it"
                    },
                    {
                        "domain": "amazonbusiness.com"
                    },
                    {
                        "domain": "indeed.com"
                    },
                    {
                        "disabled_domain": "stackexchange.com"
                    },
                    {
                        "domain": "bangassets.com"
                    },
                    {
                        "domain": "fontawesome.com"
                    },
                    {
                        "domain": "live-video.net"
                    },
                    {
                        "domain": "behave.com"
                    },
                    {
                        "domain": "imasdk.googleapis.com"
                    },
                    {
                        "domain": "appcast.io"
                    },
                    {
                        "domain": "d3b16pg7hqg2cy.cloudfront.net"
                    },
                    {
                        "domain": "d7qzviu3xw2xc.cloudfront.net"
                    },
                    {
                        "domain": "brightspot.cloud"
                    },
                    {
                        "domain": "dogvlw4b46a0r.cloudfront.net"
                    },
                    {
                        "domain": "d1at2uq7yy5k1j.cloudfront.net"
                    },
                    {
                        "domain": "d2uap9jskdzp2.cloudfront.net"
                    },
                    {
                        "domain": "consumertrack.com"
                    },
                    {
                        "domain": "strpst.com"
                    },
                    {
                        "domain": "d9esmwyn3ffr1.cloudfront.net"
                    },
                    {
                        "domain": "mapbox.com"
                    },
                    {
                        "domain": "mobtrakk.com"
                    },
                    {
                        "domain": "d1qze0i78vhibv.cloudfront.net"
                    },
                    {
                        "domain": "trustarc.com"
                    },
                    {
                        "domain": "wikimedia.org"
                    },
                    {
                        "domain": "phncdn.com"
                    },
                    {
                        "domain": "vfthr.com"
                    },
                    {
                        "domain": "aws.dev"
                    },
                    {
                        "domain": "mediawiki.org"
                    },
                    {
                        "domain": "ds69ljjohz9sr.cloudfront.net"
                    },
                    {
                        "domain": "ad-delivery.net"
                    },
                    {
                        "domain": "wunderkind.co"
                    },
                    {
                        "domain": "d2in0p32vp1pij.cloudfront.net"
                    },
                    {
                        "domain": "trustx.org"
                    },
                    {
                        "domain": "bouncex.net"
                    },
                    {
                        "domain": "ngtv.io"
                    },
                    {
                        "domain": "ds6yc8t7pnx74.cloudfront.net"
                    },
                    {
                        "domain": "d3216uwaav9lg7.cloudfront.net"
                    },
                    {
                        "domain": "veryinterestvids.xyz"
                    },
                    {
                        "domain": "vfgte.com"
                    },
                    {
                        "domain": "schwab.com"
                    },
                    {
                        "domain": "imgur.com"
                    },
                    {
                        "domain": "persprovath.xyz"
                    },
                    {
                        "domain": "outbrainimg.com"
                    },
                    {
                        "domain": "ajax.googleapis.com"
                    },
                    {
                        "domain": "w.org"
                    },
                    {
                        "domain": "fonts.googleapis.com"
                    },
                    {
                        "domain": "turner.com"
                    },
                    {
                        "domain": "googleusercontent.com"
                    },
                    {
                        "domain": "d8aa01cdolqj7.cloudfront.net"
                    },
                    {
                        "domain": "navdmp.com"
                    },
                    {
                        "domain": "xhcdn.com"
                    },
                    {
                        "domain": "imglnke.com"
                    },
                    {
                        "domain": "usbrowserspeed.com"
                    },
                    {
                        "domain": "warnermediacdn.com"
                    },
                    {
                        "domain": "d1xfq2052q7thw.cloudfront.net"
                    },
                    {
                        "domain": "bangcreatives.com"
                    },
                    {
                        "domain": "hotjar.io"
                    },
                    {
                        "domain": "amazonaws.com"
                    },
                    {
                        "domain": "vercel-analytics.com"
                    },
                    {
                        "domain": "boomtrain.com"
                    },
                    {
                        "domain": "cdnbasket.net"
                    },
                    {
                        "domain": "awsstatic.com"
                    },
                    {
                        "domain": "fbcdn.net"
                    },
                    {
                        "domain": "dianomi.com"
                    },
                    {
                        "domain": "amazon.co.uk"
                    },
                    {
                        "domain": "dwrl96u0lgux5.cloudfront.net"
                    },
                    {
                        "domain": "d39dwei46hk6jd.cloudfront.net"
                    },
                    {
                        "domain": "bbci.co.uk"
                    },
                    {
                        "domain": "bbcimg.co.uk"
                    },
                    {
                        "domain": "edigitalsurvey.com"
                    },
                    {
                        "domain": "gscontxt.net"
                    },
                    {
                        "domain": "afcdn.net"
                    },
                    {
                        "domain": "iperceptions.com"
                    },
                    {
                        "disabled_domain": "cookielaw.org"
                    },
                    {
                        "domain": "vscdns.com"
                    },
                    {
                        "domain": "vs3.com"
                    },
                    {
                        "domain": "summerhamster.com"
                    },
                    {
                        "domain": "d1x2hu8k357bsh.cloudfront.net"
                    },
                    {
                        "domain": "d2ef20sk9hi1u3.cloudfront.net"
                    },
                    {
                        "domain": "ggpht.com"
                    },
                    {
                        "domain": "ds7igiccqury3.cloudfront.net"
                    },
                    {
                        "domain": "xvideos.com"
                    },
                    {
                        "domain": "redditmedia.com"
                    },
                    {
                        "domain": "adobe.com"
                    },
                    {
                        "domain": "jnn-pa.googleapis.com"
                    },
                    {
                        "domain": "zetaglobal.net"
                    },
                    {
                        "domain": "gobankingrates.com"
                    },
                    {
                        "domain": "chartbeat.net"
                    },
                    {
                        "domain": "amzndevresources.com"
                    },
                    {
                        "domain": "imdb.com"
                    },
                    {
                        "domain": "wikidata.org"
                    },
                    {
                        "domain": "etahub.com"
                    },
                    {
                        "domain": "revjet.com"
                    },
                    {
                        "domain": "ixiaa.com"
                    },
                    {
                        "domain": "trustedbanana.com"
                    },
                    {
                        "domain": "fanagentmu.pics"
                    },
                    {
                        "domain": "indeed.tech"
                    },
                    {
                        "domain": "outturner.com"
                    },
                    {
                        "domain": "trafficfactory.biz"
                    },
                    {
                        "domain": "d2beun48pmgqbs.cloudfront.net"
                    },
                    {
                        "domain": "wmcdp.io"
                    },
                    {
                        "domain": "bbc.com"
                    },
                    {
                        "domain": "d1uznvntk80v7s.cloudfront.net"
                    },
                    {
                        "domain": "ytimg.com"
                    },
                    {
                        "domain": "beemray.com"
                    },
                    {
                        "domain": "siege-amazon.com"
                    },
                    {
                        "domain": "trafficjunky.net"
                    },
                    {
                        "domain": "consensu.org"
                    },
                    {
                        "domain": "ugdturner.com"
                    },
                    {
                        "domain": "dr3fr5q4g2ul9.cloudfront.net"
                    },
                    {
                        "domain": "cnn.io"
                    },
                    {
                        "domain": "cams.gratis"
                    },
                    {
                        "domain": "d1t40axu4ik42k.cloudfront.net"
                    },
                    {
                        "domain": "optimizely.com"
                    },
                    {
                        "domain": "media-amazon.com"
                    },
                    {
                        "domain": "amazondelivers.jobs"
                    },
                    {
                        "domain": "keywee.co"
                    },
                    {
                        "domain": "zqtk.net"
                    },
                    {
                        "domain": "d23tl967axkois.cloudfront.net"
                    },
                    {
                        "domain": "d3h2kq7so8dggb.cloudfront.net"
                    },
                    {
                        "domain": "bangkazza.com"
                    },
                    {
                        "domain": "effectivemeasure.net"
                    },
                    {
                        "domain": "gravatar.com"
                    },
                    {
                        "domain": "sstatic.net"
                    },
                    {
                        "domain": "d2u4zldaqlyj2w.cloudfront.net"
                    },
                    {
                        "domain": "akamaihd.net"
                    },
                    {
                        "domain": "onaudience.com"
                    },
                    {
                        "domain": "xhpingcdn.com"
                    },
                    {
                        "domain": "eu-1-id5-sync.com"
                    },
                    {
                        "domain": "xvideos-cdn.com"
                    },
                    {
                        "domain": "wp.com"
                    },
                    {
                        "domain": "quantcount.com"
                    },
                    {
                        "domain": "vercel-insights.com"
                    },
                    {
                        "domain": "jobsatamazon.co.uk"
                    },
                    {
                        "domain": "flixcdn.com"
                    },
                    {
                        "domain": "d2h1qfxg5j5pfv.cloudfront.net"
                    },
                    {
                        "domain": "d20kffh39acpue.cloudfront.net"
                    },
                    {
                        "domain": "d9sq4cz0q8up0.cloudfront.net"
                    }
                ],
                "tagModifiers": {
                    "script": {
                        "filters": {
                            "property": [
                                "blocking",
                                "fetchPriority"
                            ],
                            "attribute": [
                                "blocking",
                                "fetchpriority"
                            ]
                        }
                    }
                }
            },
            "hash": "78b94babd0e961860a50106afca4f6b0"
        },
        "serviceworkerInitiatedRequests": {
            "exceptions": [],
            "state": "enabled",
            "hash": "52857469413a66e8b0c7b00de5589162"
        },
        "trackerAllowlist": {
            "state": "enabled",
            "settings": {
                "allowlistedTrackers": {
                    "3lift.com": {
                        "rules": [
                            {
                                "rule": "tlx.3lift.com/header/auction",
                                "domains": [
                                    "aternos.org"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/328"
                            }
                        ]
                    },
                    "4dex.io": {
                        "rules": [
                            {
                                "rule": "mp.4dex.io/prebid",
                                "domains": [
                                    "aternos.org"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/328"
                            }
                        ]
                    },
                    "a-mo.net": {
                        "rules": [
                            {
                                "rule": "prebid.a-mo.net/a/c",
                                "domains": [
                                    "aternos.org"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/328"
                            }
                        ]
                    },
                    "acsbapp.com": {
                        "rules": [
                            {
                                "rule": "acsbapp.com",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/629"
                            }
                        ]
                    },
                    "addthis.com": {
                        "rules": [
                            {
                                "rule": "s7.addthis.com/js/300/addthis_widget.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/427"
                            },
                            {
                                "rule": "s7.addthis.com/l10n/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/427"
                            },
                            {
                                "rule": "s7.addthis.com/static/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/427"
                            }
                        ]
                    },
                    "adform.net": {
                        "rules": [
                            {
                                "rule": "adx.adform.net/adx/openrtb",
                                "domains": [
                                    "aternos.org"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/328"
                            },
                            {
                                "rule": "c1.adform.net/serving/cookie/match",
                                "domains": [
                                    "dhl.de"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/340"
                            }
                        ]
                    },
                    "ads-twitter.com": {
                        "rules": [
                            {
                                "rule": "static.ads-twitter.com/uwt.js",
                                "domains": [
                                    "hentaihaven.xxx"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/452"
                            }
                        ]
                    },
                    "adsafeprotected.com": {
                        "rules": [
                            {
                                "rule": "static.adsafeprotected.com/favicon.ico",
                                "domains": [
                                    "tf1info.fr"
                                ],
                                "reason": "Adwall displays over video and prevents video from being played."
                            },
                            {
                                "rule": "static.adsafeprotected.com/iasPET.1.js",
                                "domains": [
                                    "corriere.it"
                                ],
                                "reason": "Example URL: https://www.corriere.it/video-articoli/2022/07/13/missione-wwf-liberare-mare-plastica/9abb64de-029d-11ed-a0cc-ad3c68cacbae.shtml;,Clicking on the video to play causes a still frame to show and the video does not continue."
                            },
                            {
                                "rule": "static.adsafeprotected.com/vans-adapter-google-ima.js",
                                "domains": [
                                    "nhl.com"
                                ],
                                "reason": "Videos show a spinner and never load."
                            }
                        ]
                    },
                    "ahacdn.me": {
                        "rules": [
                            {
                                "rule": "ahacdn.me",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/447"
                            }
                        ]
                    },
                    "akadns.net": {
                        "rules": [
                            {
                                "rule": "login.fidelity.com.febsec-fidelity.com.akadns.net",
                                "domains": [
                                    "fidelity.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/677"
                            }
                        ]
                    },
                    "aldi-digital.co.uk": {
                        "rules": [
                            {
                                "rule": "assets.aldi-digital.co.uk/assets/050b4966c22c430e5c9308903ebb87e1/dist/scripts/main.js",
                                "domains": [
                                    "aldi.co.uk"
                                ],
                                "reason": "Product lists don't render."
                            }
                        ]
                    },
                    "alicdn.com": {
                        "rules": [
                            {
                                "rule": "aeis.alicdn.com/",
                                "domains": [
                                    "aliexpress.com",
                                    "aliexpress.us"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: alicdn.com.edgekey.net"
                            },
                            {
                                "rule": "aeproductsourcesite.alicdn.com/",
                                "domains": [
                                    "aliexpress.com",
                                    "aliexpress.us"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: alicdn.com.edgekey.net"
                            },
                            {
                                "rule": "assets.alicdn.com/",
                                "domains": [
                                    "aliexpress.com",
                                    "aliexpress.us"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: alicdn.com.edgekey.net"
                            },
                            {
                                "rule": "is.alicdn.com/",
                                "domains": [
                                    "aliexpress.com",
                                    "aliexpress.us"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: alicdn.com.edgekey.net"
                            },
                            {
                                "rule": "alicdn.com",
                                "domains": [
                                    "aliexpress.us"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/460"
                            }
                        ]
                    },
                    "amazon-adsystem.com": {
                        "rules": [
                            {
                                "rule": "c.amazon-adsystem.com/aax2/apstag.js",
                                "domains": [
                                    "corriere.it",
                                    "eurogamer.net",
                                    "seattletimes.com"
                                ],
                                "reason": "corriere.it - ,Example URL: https://www.corriere.it/video-articoli/2022/07/13/missione-wwf-liberare-mare-plastica/9abb64de-029d-11ed-a0cc-ad3c68cacbae.shtml;,Clicking on the video to play causes a still frame to show and the video does not continue.,eurogamer.net, seattletimes.com - An unskippable adwall appears which prevents interaction with the page."
                            }
                        ]
                    },
                    "azure.net": {
                        "rules": [
                            {
                                "rule": "amp.azure.net/libs/amp/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/504"
                            }
                        ]
                    },
                    "azureedge.net": {
                        "rules": [
                            {
                                "rule": "orderweb-cdn-endpoint-centralus.azureedge.net/js/chunk-vendors.js",
                                "domains": [
                                    "chipotle.com"
                                ],
                                "reason": "Site loads blank and cannot be interacted with."
                            }
                        ]
                    },
                    "bc0a.com": {
                        "rules": [
                            {
                                "rule": "marvel-b1-cdn.bc0a.com/f00000000269380/www.beretta.com/assets/",
                                "domains": [
                                    "beretta.com"
                                ],
                                "reason": "Example URL1: https://www.beretta.com/en-us/womens-clothing/caps-and-hats/;,Example URL2: https://www.beretta.com/en-us/mens-clothing/caps-and-hats/lp-trucker-hat/;,Various product and product-related images do not render - e.g., main product images on product pages, product images in product listings, etc."
                            }
                        ]
                    },
                    "bing.com": {
                        "rules": [
                            {
                                "rule": "r.bing.com/rp/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "See https://github.com/duckduckgo/privacy-configuration/issues/321.,These requests are associated with map/location functionality on websites."
                            },
                            {
                                "rule": "th.bing.com/th",
                                "domains": [
                                    "drudgereport.com"
                                ],
                                "reason": "On the homepage (drudgereport.com), some images are fetched from bing.com.,When we block these requests, the images do not render, and the page appears to have blank boxes.,Note that requests can be of the form th.bing.com/th?id=... or th.bing.com/th/id/..., hence we unblock the common path here."
                            },
                            {
                                "rule": "www.bing.com/api/maps/mapcontrol",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "See https://github.com/duckduckgo/privacy-configuration/issues/321.,This request is associated with map/location functionality on websites."
                            },
                            {
                                "rule": "www.bing.com/api/v6/Places/AutoSuggest",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "See https://github.com/duckduckgo/privacy-configuration/issues/321.,This request is associated with map/location auto-suggest functionality on websites."
                            },
                            {
                                "rule": "www.bing.com/maps/sdk/mapcontrol",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/321"
                            },
                            {
                                "rule": "www.bing.com/maps/sdkrelease/mapcontrol",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "See https://github.com/duckduckgo/privacy-configuration/issues/321.,This request is associated with map/location functionality on websites."
                            },
                            {
                                "rule": "www.bing.com/rp/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "See https://github.com/duckduckgo/privacy-configuration/issues/321.,These requests are associated with map/location functionality on websites."
                            }
                        ]
                    },
                    "captcha-delivery.com": {
                        "rules": [
                            {
                                "rule": "captcha-delivery.com",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/501"
                            }
                        ]
                    },
                    "casalemedia.com": {
                        "rules": [
                            {
                                "rule": "htlb.casalemedia.com/cygnus",
                                "domains": [
                                    "aternos.org"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/328"
                            }
                        ]
                    },
                    "cloudflare.com": {
                        "rules": [
                            {
                                "rule": "cdnjs.cloudflare.com/ajax/libs/fingerprintjs2/1.8.6/fingerprint2.min.js",
                                "domains": [
                                    "winnipegfreepress.com"
                                ],
                                "reason": "Example URL: https://www.winnipegfreepress.com/local/city-will-try-to-fill-money-losing-ex-canada-post-office-576646662.html,Main text content on article does not load."
                            },
                            {
                                "rule": "cdnjs.cloudflare.com/ajax/libs/three.js/84/three.min.js",
                                "domains": [
                                    "2000mules.com"
                                ],
                                "reason": "Loading percentage hits 100% and the site does not proceed to display usual content."
                            },
                            {
                                "rule": "challenges.cloudflare.com",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/641"
                            }
                        ]
                    },
                    "cloudfront.net": {
                        "rules": [
                            {
                                "rule": "d3oxtup47gylpj.cloudfront.net/theme/onlyfans/spa/chunk-vendors.js",
                                "domains": [
                                    "onlyfans.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/440"
                            },
                            {
                                "rule": "d3nn82uaxijpm6.cloudfront.net/",
                                "domains": [
                                    "strava.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/748"
                            },
                            {
                                "rule": "d9k0w0y3delq8.cloudfront.net",
                                "domains": [
                                    "hoyolab.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/754"
                            }
                        ]
                    },
                    "computerworld.com": {
                        "rules": [
                            {
                                "rule": "cmpv2.computerworld.com/",
                                "domains": [
                                    "computerworld.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/344"
                            }
                        ]
                    },
                    "connatix.com": {
                        "rules": [
                            {
                                "rule": "connatix.com",
                                "domains": [
                                    "accuweather.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/768"
                            }
                        ]
                    },
                    "cookiepro.com": {
                        "rules": [
                            {
                                "rule": "cookie-cdn.cookiepro.com",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/466"
                            }
                        ]
                    },
                    "cquotient.com": {
                        "rules": [
                            {
                                "rule": "cdn.cquotient.com/js/v2/gretel.min.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/486"
                            },
                            {
                                "rule": "e.cquotient.com/recs/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/486"
                            }
                        ]
                    },
                    "criteo.com": {
                        "rules": [
                            {
                                "rule": "bidder.criteo.com/cdb",
                                "domains": [
                                    "aternos.org"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/328"
                            }
                        ]
                    },
                    "criteo.net": {
                        "rules": [
                            {
                                "rule": "static.criteo.net/js/ld/publishertag.js",
                                "domains": [
                                    "wp.pl"
                                ],
                                "reason": "Adwall appears which reappears when dismissed. The adwall prevents interaction with the page."
                            },
                            {
                                "rule": "static.criteo.net/js/ld/publishertag.prebid.js",
                                "domains": [
                                    "wp.pl"
                                ],
                                "reason": "Adwall appears which reappears when dismissed. The adwall prevents interaction with the page."
                            }
                        ]
                    },
                    "cxense.com": {
                        "rules": [
                            {
                                "rule": "api.cxense.com/public/widget/data",
                                "domains": [
                                    "wsj.com"
                                ],
                                "reason": "Opinion section article elements do not render. Note that Firefox Enhanced Tracking Protection may prevent mitigation from succeeding on Firefox."
                            }
                        ]
                    },
                    "daumcdn.net": {
                        "rules": [
                            {
                                "rule": "daumcdn.net",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/444"
                            }
                        ]
                    },
                    "demdex.net": {
                        "rules": [
                            {
                                "rule": "dpm.demdex.net/id",
                                "domains": [
                                    "dhl.de",
                                    "homedepot.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/393"
                            }
                        ]
                    },
                    "derstandard.de": {
                        "rules": [
                            {
                                "rule": "spcmp.r53.derstandard.de/",
                                "domains": [
                                    "derstandard.de"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/344"
                            }
                        ]
                    },
                    "doubleclick.net": {
                        "rules": [
                            {
                                "rule": "securepubads.g.doubleclick.net/gampad/ads",
                                "domains": [
                                    "ah.nl"
                                ],
                                "reason": "'Bonus offer' elements do not render and are not clickable."
                            },
                            {
                                "rule": "pubads.g.doubleclick.net/gampad/ads",
                                "domains": [
                                    "nhl.com",
                                    "viki.com"
                                ],
                                "reason": "nhl.com - Videos show a spinner and never load.,viki.com - after a video has played for a few seconds an adwall pops up. Clicking 'I've turned off my adblocker' resets the video, then after a few seconds the adwall pops up again."
                            },
                            {
                                "rule": "pubads.g.doubleclick.net/ssai/event/",
                                "domains": [
                                    "cbssports.com"
                                ],
                                "reason": "Live videos do not load or render."
                            },
                            {
                                "rule": "securepubads.g.doubleclick.net/tag/js/gpt.js",
                                "domains": [
                                    "ah.nl",
                                    "wunderground.com",
                                    "youmath.it"
                                ],
                                "reason": "ah.nl - 'Bonus offer' elements do not render and are not clickable.,wunderground.com - Video element does not display.,youmath.it - Adwall displays which prevents page interaction and resets the page view when clicked."
                            },
                            {
                                "rule": "securepubads.g.doubleclick.net/gpt/pubads_impl_",
                                "domains": [
                                    "ah.nl",
                                    "wunderground.com"
                                ],
                                "reason": "ah.nl - 'Bonus offer' elements do not render and are not clickable.,wunderground.com - Video element does not display."
                            },
                            {
                                "rule": "securepubads.g.doubleclick.net/pagead/ppub_config",
                                "domains": [
                                    "weather.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/415"
                            }
                        ]
                    },
                    "dynamicyield.com": {
                        "rules": [
                            {
                                "rule": "cdn.dynamicyield.com/api/",
                                "domains": [
                                    "brooklinen.com",
                                    "carters.com",
                                    "seatosummit.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/535"
                            }
                        ]
                    },
                    "edgekey.net": {
                        "rules": [
                            {
                                "rule": "scene7.com.edgekey.net/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/356"
                            },
                            {
                                "rule": "alicdn.com.edgekey.net/",
                                "domains": [
                                    "aliexpress.com",
                                    "aliexpress.us"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/570"
                            },
                            {
                                "rule": "nintendo.com.edgekey.net/account/js/common.js",
                                "domains": [
                                    "nintendo.com"
                                ],
                                "reason": "CNAME version of nintendo.com exception"
                            },
                            {
                                "rule": "cdn.agoda.net.edgekey.net/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/771"
                            }
                        ]
                    },
                    "edgesuite.net": {
                        "rules": [
                            {
                                "rule": "sky.com.edgesuite.net/assets/sky_common.js",
                                "domains": [
                                    "sky.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/342"
                            },
                            {
                                "rule": "a.espncdn.com.stls.edgesuite.net/",
                                "domains": [
                                    "espn.co.uk",
                                    "espn.com",
                                    "espn.com.au",
                                    "espn.com.br",
                                    "espn.com.mx",
                                    "espn.in",
                                    "espnfc.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/750"
                            }
                        ]
                    },
                    "ezoic.com": {
                        "rules": [
                            {
                                "rule": "videosvc.ezoic.com/play",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/468"
                            },
                            {
                                "rule": "video-streaming.ezoic.com",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/468"
                            }
                        ]
                    },
                    "ezoic.net": {
                        "rules": [
                            {
                                "rule": "g.ezoic.net",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/468"
                            }
                        ]
                    },
                    "ezoiccdn.com": {
                        "rules": [
                            {
                                "rule": "sf.ezoiccdn.com",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/468"
                            }
                        ]
                    },
                    "facebook.net": {
                        "rules": [
                            {
                                "rule": "connect.facebook.net/en_US/sdk.js",
                                "domains": [
                                    "bandsintown.com",
                                    "nextdoor.co.uk",
                                    "nextdoor.com"
                                ],
                                "reason": "bandsintown.com - Ticket page renders blank. With this exception the page redirects to ticketspice.com.,nextdoor.co.uk, nextdoor.com - Facebook login option appears greyed out and cannot be clicked."
                            },
                            {
                                "rule": "connect.facebook.net/en_US/fbevents.js",
                                "domains": [
                                    "wp.pl"
                                ],
                                "reason": "Adwall appears which reappears when dismissed. The adwall prevents interaction with the page."
                            }
                        ]
                    },
                    "fastly.net": {
                        "rules": [
                            {
                                "rule": "mslc-prod-herokuapp-com.global.ssl.fastly.net/main.8736233213226195.js",
                                "domains": [
                                    "masslottery.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/332"
                            },
                            {
                                "rule": "ticketmaster4.map.fastly.net/eps-d",
                                "domains": [
                                    "ticketmaster.ca",
                                    "ticketmaster.com",
                                    "ticketmaster.com.au",
                                    "ticketmaster.com.mx"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/575"
                            },
                            {
                                "rule": "target-opus.map.fastly.net/",
                                "domains": [
                                    "target.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/635"
                            }
                        ]
                    },
                    "fox.com": {
                        "rules": [
                            {
                                "rule": "fox.com",
                                "domains": [
                                    "adrise.tv",
                                    "fncstatic.com",
                                    "fox10phoenix.com",
                                    "fox13news.com",
                                    "fox26houston.com",
                                    "fox29.com",
                                    "fox2detroit.com",
                                    "fox32chicago.com",
                                    "fox35orlando.com",
                                    "fox46charlotte.com",
                                    "fox4news.com",
                                    "fox5atlanta.com",
                                    "fox5dc.com",
                                    "fox5ny.com",
                                    "fox7austin.com",
                                    "fox9.com",
                                    "foxbusiness.com",
                                    "foxla.com",
                                    "foxnews.com",
                                    "foxsports.com",
                                    "foxsportsasia.com",
                                    "foxsportsgo.com",
                                    "foxweather.com",
                                    "ktvu.com",
                                    "tubi.io",
                                    "tubi.tv",
                                    "tubi.video",
                                    "tubitv.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/460"
                            }
                        ]
                    },
                    "fwmrm.net": {
                        "rules": [
                            {
                                "rule": "2a7e9.v.fwmrm.net/ad/g/1",
                                "domains": [
                                    "channel4.com"
                                ],
                                "reason": "Unskippable adblock warning when trying to play a video."
                            }
                        ]
                    },
                    "geetest.com": {
                        "rules": [
                            {
                                "rule": "api.geetest.com",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/462"
                            },
                            {
                                "rule": "static.geetest.com",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/462"
                            }
                        ]
                    },
                    "gemius.pl": {
                        "rules": [
                            {
                                "rule": "gapl.hit.gemius.pl/gplayer.js",
                                "domains": [
                                    "tvp.pl"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/376"
                            },
                            {
                                "rule": "pro.hit.gemius.pl/gstream.js",
                                "domains": [
                                    "tvp.pl"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/376"
                            },
                            {
                                "rule": "wp.hit.gemius.pl/xgemius.js",
                                "domains": [
                                    "wp.pl"
                                ],
                                "reason": "Adwall appears which reappears when dismissed. The adwall prevents interaction with the page."
                            }
                        ]
                    },
                    "getshogun.com": {
                        "rules": [
                            {
                                "rule": "cdn.getshogun.com",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/450"
                            },
                            {
                                "rule": "lib.getshogun.com",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/450"
                            }
                        ]
                    },
                    "google-analytics.com": {
                        "rules": [
                            {
                                "rule": "google-analytics.com/analytics.js",
                                "domains": [
                                    "doterra.com",
                                    "easyjet.com"
                                ],
                                "reason": "doterra.com - For doterra.com/login/loading, the page shows a loading indicator and never redirects.,easyjet.com - Clicking 'Show Worldwide flights' after entering parameters for a worldwide flight in the flight viewing form does nothing."
                            },
                            {
                                "rule": "www.google-analytics.com/plugins/ua/ecommerce.js",
                                "domains": [
                                    "doterra.com"
                                ],
                                "reason": "For doterra.com/login/loading, the page shows a loading indicator and never redirects."
                            }
                        ]
                    },
                    "google.co.uk": {
                        "rules": [
                            {
                                "rule": "maps.google.co.uk/maps",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/472"
                            }
                        ]
                    },
                    "google.com": {
                        "rules": [
                            {
                                "rule": "accounts.google.com/o/oauth2/iframerpc",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/489"
                            },
                            {
                                "rule": "accounts.google.com/o/oauth2/iframe",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/489"
                            },
                            {
                                "rule": "apis.google.com/js/platform.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/489"
                            },
                            {
                                "rule": "apis.google.com/_/scs/abc-static/_/js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/489"
                            },
                            {
                                "rule": "cse.google.com/cse.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/475"
                            },
                            {
                                "rule": "cse.google.com/cse/element/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/475"
                            },
                            {
                                "rule": "google.com/cse/cse.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/475"
                            },
                            {
                                "rule": "www.google.com/cse/static/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/475"
                            },
                            {
                                "rule": "www.google.com/maps/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/472"
                            }
                        ]
                    },
                    "googlesyndication.com": {
                        "rules": [
                            {
                                "rule": "pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
                                "domains": [
                                    "duden.de",
                                    "magicgameworld.com",
                                    "youmath.it"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/388"
                            },
                            {
                                "rule": "tpc.googlesyndication.com/pagead/js/loader21.html",
                                "domains": [
                                    "laprensa.hn",
                                    "rumble.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/388"
                            }
                        ]
                    },
                    "googletagmanager.com": {
                        "rules": [
                            {
                                "rule": "googletagmanager.com/gtm.js",
                                "domains": [
                                    "ah.nl",
                                    "dailyherald.com",
                                    "emirates.com",
                                    "iltalehti.fi",
                                    "kingarthurbaking.com",
                                    "pickfu.com",
                                    "rbcroyalbank.com"
                                ],
                                "reason": "ah.nl - 'Bonus offer' elements do not render and are not clickable.,dailyherald.com - Article images render as grey boxes.,emirates.com - After filling out login details and clicking to proceed, a loading spinners shows on the proceed button and the login does not progress.,iltalehti.fi - Article video renders as a blank box.,kingarthurbaking.com - https://github.com/duckduckgo/privacy-configuration/issues/348,pickfu.com - https://github.com/duckduckgo/privacy-configuration/issues/346,rbcroyalbank.com - Investments page renders blank."
                            }
                        ]
                    },
                    "gstatic.com": {
                        "rules": [
                            {
                                "rule": "maps.gstatic.com",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/472"
                            },
                            {
                                "rule": "www.gstatic.com/_/mss/boq-identity/_/js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/489"
                            }
                        ]
                    },
                    "iesnare.com": {
                        "rules": [
                            {
                                "rule": "mpsnare.iesnare.com/snare.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/669"
                            }
                        ]
                    },
                    "iheart.com": {
                        "rules": [
                            {
                                "rule": "iheart.com",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/760"
                            }
                        ]
                    },
                    "inq.com": {
                        "rules": [
                            {
                                "rule": "inq.com/chatrouter",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/479"
                            },
                            {
                                "rule": "inq.com/chatskins",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/479"
                            },
                            {
                                "rule": "inq.com/tagserver/init",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/479"
                            },
                            {
                                "rule": "inq.com/tagserver/launch",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/479"
                            },
                            {
                                "rule": "inq.com/tagserver/postToServer",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/479"
                            }
                        ]
                    },
                    "instagram.com": {
                        "rules": [
                            {
                                "rule": "platform.instagram.com/en_US/embeds.js",
                                "domains": [
                                    "livejournal.com"
                                ],
                                "reason": "Instagram embeds as main article content render as grey boxes."
                            },
                            {
                                "rule": "www.instagram.com/embed.js",
                                "domains": [
                                    "buzzfeed.com",
                                    "livejournal.com"
                                ],
                                "reason": "Instagram embeds as main article content render as grey boxes."
                            }
                        ]
                    },
                    "jimstatic.com": {
                        "rules": [
                            {
                                "rule": "assets.jimstatic.com",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/496"
                            }
                        ]
                    },
                    "klarnaservices.com": {
                        "rules": [
                            {
                                "rule": "na-library.klarnaservices.com/lib.js",
                                "domains": [
                                    "brooksrunning.com",
                                    "joann.com"
                                ],
                                "reason": "brooksrunning.com - When switching between product variants (e.g., different shoe colours) a loading spinner shows and the variant does not load.,joann.com - When switching between product variants (e.g., different shirt colours) the page shows an overlay and further interaction is prevented."
                            }
                        ]
                    },
                    "klaviyo.com": {
                        "rules": [
                            {
                                "rule": "www.klaviyo.com/media/js/public/klaviyo_subscribe.js",
                                "domains": [
                                    "fearofgod.com",
                                    "shopyalehome.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/362"
                            },
                            {
                                "rule": "klaviyo.com/",
                                "domains": [
                                    "kmail-lists.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/362"
                            }
                        ]
                    },
                    "listrakbi.com": {
                        "rules": [
                            {
                                "rule": "cdn.listrakbi.com/scripts/script.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/457"
                            }
                        ]
                    },
                    "liveperson.net": {
                        "rules": [
                            {
                                "rule": "liveperson.net",
                                "domains": [
                                    "virginmedia.com"
                                ],
                                "reason": "Chat button appears faded and cannot be interacted with."
                            }
                        ]
                    },
                    "loggly.com": {
                        "rules": [
                            {
                                "rule": "cloudfront.loggly.com/js/loggly.tracker-2.1.min.js",
                                "domains": [
                                    "rte.ie"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/681"
                            }
                        ]
                    },
                    "lpsnmedia.net": {
                        "rules": [
                            {
                                "rule": "lpsnmedia.net",
                                "domains": [
                                    "virginmedia.com"
                                ],
                                "reason": "Chat button appears faded and cannot be interacted with."
                            }
                        ]
                    },
                    "ltwebstatic.com": {
                        "rules": [
                            {
                                "rule": "sheinsz.ltwebstatic.com/she_dist/libs/geetest/fullpage.1.1.9.js",
                                "domains": [
                                    "shein.co.uk",
                                    "shein.com"
                                ],
                                "reason": "When attempting to create an account (after filling out registration form and clicking 'Register'), there is an 'access timed out' warning, and account creation does not proceed."
                            }
                        ]
                    },
                    "medicare.gov": {
                        "rules": [
                            {
                                "rule": "frontend.medicare.gov/static/js/2.6c6651b4.chunk.js",
                                "domains": [
                                    "medicare.gov"
                                ],
                                "reason": "Navigation bar at top of site does not display, preventing easy access to e.g., site login.,Note that this CNAMEs to iservprod.medicare.gov.edgekey.net at time of mitiagtion."
                            }
                        ]
                    },
                    "nextdoor.com": {
                        "rules": [
                            {
                                "rule": "nextdoor.com",
                                "domains": [
                                    "nextdoor.co.uk"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/460"
                            }
                        ]
                    },
                    "nintendo.com": {
                        "rules": [
                            {
                                "rule": "cdn.accounts.nintendo.com/account/js/common.js",
                                "domains": [
                                    "nintendo.com"
                                ],
                                "reason": "Accounts page renders blank. Download buttons show loading stars and never finish loading. Pricing information doesn't load. Note that cdn.accounts.nintendo.com CNAMEs to star.accounts.nintendo.com.edgekey.net at the time of mitigation.; CNAME ENTRY GENERATED FROM: nintendo.com.edgekey.net"
                            },
                            {
                                "rule": "api.ec.nintendo.com/account/js/common.js",
                                "domains": [
                                    "nintendo.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: nintendo.com.edgekey.net"
                            },
                            {
                                "rule": "cdn.my.nintendo.com/account/js/common.js",
                                "domains": [
                                    "nintendo.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: nintendo.com.edgekey.net"
                            }
                        ]
                    },
                    "nuance.com": {
                        "rules": [
                            {
                                "rule": "nuance.com/media/launch",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/479"
                            },
                            {
                                "rule": "nuance.com/media/sites",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/479"
                            }
                        ]
                    },
                    "omnitagjs.com": {
                        "rules": [
                            {
                                "rule": "hb-api.omnitagjs.com/hb-api/prebid/v1",
                                "domains": [
                                    "aternos.org"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/328"
                            }
                        ]
                    },
                    "onlyfans.com": {
                        "rules": [
                            {
                                "rule": "static.onlyfans.com",
                                "domains": [
                                    "onlyfans.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/440"
                            }
                        ]
                    },
                    "openx.net": {
                        "rules": [
                            {
                                "rule": "venatusmedia-d.openx.net/w/1.0/arj",
                                "domains": [
                                    "aternos.org"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/328"
                            }
                        ]
                    },
                    "opta.net": {
                        "rules": [
                            {
                                "rule": "secure.widget.cloud.opta.net/v3/v3.opta-widgets.js",
                                "domains": [
                                    "abc.net.au",
                                    "emol.com"
                                ],
                                "reason": "abc.net.au - Error message displays in place of scoreboard (scoreboard does not show).,emol.com - Scoreboard does not render."
                            }
                        ]
                    },
                    "osano.com": {
                        "rules": [
                            {
                                "rule": "dsar.api.osano.com/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/529"
                            }
                        ]
                    },
                    "pardot.com": {
                        "rules": [
                            {
                                "rule": "go.pardot.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/625"
                            }
                        ]
                    },
                    "plotrabbit.com": {
                        "rules": [
                            {
                                "rule": "plotrabbit.com",
                                "domains": [
                                    "cbssports.com"
                                ],
                                "reason": "Live videos do not load or render."
                            }
                        ]
                    },
                    "primaryarms.com": {
                        "rules": [
                            {
                                "rule": "images.primaryarms.com/f00000000191638/www.primaryarms.com/SSP%20Applications/NetSuite%20Inc.%20-%20SCA%20Mont%20Blanc/Development/img/",
                                "domains": [
                                    "primaryarms.com"
                                ],
                                "reason": "Product images on the main page don't render.,Note that this CNAMEs to marvel-b4-cdn.bc0a.com at time of mitigation."
                            },
                            {
                                "rule": "images.primaryarms.com/f00000000191638/www.primaryarms.com/core/media/media.nl",
                                "domains": [
                                    "primaryarms.com"
                                ],
                                "reason": "Images in the large scrolling image banner on main page do not render.,Note that this CNAMEs to marvel-b4-cdn.bc0a.com at time of mitigation."
                            }
                        ]
                    },
                    "privacy-center.org": {
                        "rules": [
                            {
                                "rule": "sdk.privacy-center.org",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/339"
                            }
                        ]
                    },
                    "privacy-mgmt.com": {
                        "rules": [
                            {
                                "rule": "privacy-mgmt.com/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/344"
                            }
                        ]
                    },
                    "privacymanager.io": {
                        "rules": [
                            {
                                "rule": "cmp-consent-tool.privacymanager.io/latest/605.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/334"
                            },
                            {
                                "rule": "cmp-consent-tool.privacymanager.io/latest/650.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/334"
                            },
                            {
                                "rule": "cmp-consent-tool.privacymanager.io/latest/847.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/334"
                            },
                            {
                                "rule": "cmp-consent-tool.privacymanager.io/latest/assets/icons/.*.svg",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/334"
                            },
                            {
                                "rule": "cmp-consent-tool.privacymanager.io/latest/defaultTheme.css",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/334"
                            },
                            {
                                "rule": "cmp-consent-tool.privacymanager.io/latest/index.html",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/334"
                            },
                            {
                                "rule": "cmp-consent-tool.privacymanager.io/latest/main.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/334"
                            },
                            {
                                "rule": "cmp-consent-tool.privacymanager.io/latest/polyfills.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/334"
                            },
                            {
                                "rule": "cmp-consent-tool.privacymanager.io/latest/runtime.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/334"
                            },
                            {
                                "rule": "cmp-consent-tool.privacymanager.io/latest/vendor.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/334"
                            },
                            {
                                "rule": "gdpr.privacymanager.io/1/gdpr.bundle.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/334"
                            },
                            {
                                "rule": "gdpr.privacymanager.io/latest/gdpr.bundle.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/334"
                            },
                            {
                                "rule": "gdpr-wrapper.privacymanager.io/gdpr/.*/gdpr-liveramp.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/334"
                            },
                            {
                                "rule": "gdpr-wrapper.privacymanager.io/gdpr/.*/manager-logo.png",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/334"
                            },
                            {
                                "rule": "vendors.privacymanager.io/vendor-list.json",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/334"
                            }
                        ]
                    },
                    "pubmatic.com": {
                        "rules": [
                            {
                                "rule": "ads.pubmatic.com/AdServer/",
                                "domains": [
                                    "hindustantimes.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/388"
                            },
                            {
                                "rule": "hbopenbid.pubmatic.com/translator",
                                "domains": [
                                    "aternos.org"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/328"
                            }
                        ]
                    },
                    "quantserve.com": {
                        "rules": [
                            {
                                "rule": "secure.quantserve.com/quant.js",
                                "domains": [
                                    "aternos.org"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/328"
                            }
                        ]
                    },
                    "rncdn7.com": {
                        "rules": [
                            {
                                "rule": "rncdn7.com",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/436"
                            }
                        ]
                    },
                    "rumble.com": {
                        "rules": [
                            {
                                "rule": "rumble.com/j/p/ui.r2.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/631"
                            }
                        ]
                    },
                    "scene7.com": {
                        "rules": [
                            {
                                "rule": "scene7.com/is/image/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/356"
                            },
                            {
                                "rule": "scene7.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/356"
                            }
                        ]
                    },
                    "searchspring.io": {
                        "rules": [
                            {
                                "rule": "searchspring.io",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/435"
                            }
                        ]
                    },
                    "segment.com": {
                        "rules": [
                            {
                                "rule": "cdn.segment.com",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/484"
                            }
                        ]
                    },
                    "shopeemobile.com": {
                        "rules": [
                            {
                                "rule": "deo.shopeemobile.com/shopee",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/442"
                            }
                        ]
                    },
                    "shortpixel.ai": {
                        "rules": [
                            {
                                "rule": "cdn.shortpixel.ai/assets/js/bundles/spai-lib-bg",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/712"
                            }
                        ]
                    },
                    "spiegel.de": {
                        "rules": [
                            {
                                "rule": "sp-spiegel-de.spiegel.de/",
                                "domains": [
                                    "spiegel.de"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/344"
                            }
                        ]
                    },
                    "spot.im": {
                        "rules": [
                            {
                                "rule": "spot.im/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/622"
                            }
                        ]
                    },
                    "strpst.com": {
                        "rules": [
                            {
                                "rule": "strpst.com",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/438"
                            }
                        ]
                    },
                    "theplatform.com": {
                        "rules": [
                            {
                                "rule": "link.theplatform.com/s/",
                                "domains": [
                                    "nbcsports.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/512"
                            },
                            {
                                "rule": "pdk.theplatform.com/pdk6/current/pdk/player.js",
                                "domains": [
                                    "eonline.com"
                                ],
                                "reason": "Videos don't play (blank box after clicking to play)."
                            },
                            {
                                "rule": "pdk.theplatform.com/pdk6/next/pdk/player.js",
                                "domains": [
                                    "nbcsports.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/512"
                            }
                        ]
                    },
                    "tiqcdn.com": {
                        "rules": [
                            {
                                "rule": "tags.tiqcdn.com/utag/lgi/vm-uk/prod/utag.77.js",
                                "domains": [
                                    "virginmedia.com"
                                ],
                                "reason": "Chat button appears faded and cannot be interacted with."
                            }
                        ]
                    },
                    "trustpilot.com": {
                        "rules": [
                            {
                                "rule": "widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js",
                                "domains": [
                                    "domesticandgeneral.com"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/466"
                            }
                        ]
                    },
                    "twitter.com": {
                        "rules": [
                            {
                                "rule": "platform.twitter.com/embed/embed",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/717"
                            },
                            {
                                "rule": "platform.twitter.com/widgets/tweet_button",
                                "domains": [
                                    "winnipegfreepress.com"
                                ],
                                "reason": "Tweet button does not render."
                            }
                        ]
                    },
                    "usabilla.com": {
                        "rules": [
                            {
                                "rule": "api.usabilla.com",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/482"
                            },
                            {
                                "rule": "w.usabilla.com",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/482"
                            }
                        ]
                    },
                    "usercentrics.eu": {
                        "rules": [
                            {
                                "rule": "api.usercentrics.eu/settings",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/477"
                            },
                            {
                                "rule": "api.usercentrics.eu/tcf",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/477"
                            },
                            {
                                "rule": "api.usercentrics.eu/translations",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/477"
                            },
                            {
                                "rule": "app.usercentrics.eu/browser",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/477"
                            },
                            {
                                "rule": "app.usercentrics.eu/session/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/477"
                            },
                            {
                                "rule": "graphql.usercentrics.eu/graphql",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/477"
                            },
                            {
                                "rule": "privacy-proxy.usercentrics.eu/latest/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/477"
                            },
                            {
                                "rule": "aggregator.service.usercentrics.eu/aggregate",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/477"
                            }
                        ]
                    },
                    "viafoura.net": {
                        "rules": [
                            {
                                "rule": "cdn.viafoura.net",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/763"
                            }
                        ]
                    },
                    "yandex.ru": {
                        "rules": [
                            {
                                "rule": "frontend.vh.yandex.ru/player/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/366"
                            },
                            {
                                "rule": "strm.yandex.ru/get/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/366"
                            },
                            {
                                "rule": "strm.yandex.ru/vh-special-converted/vod-content/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/366"
                            }
                        ]
                    },
                    "yotpo.com": {
                        "rules": [
                            {
                                "rule": "api.yotpo.com/products/.*/.*/bottomline",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/348"
                            },
                            {
                                "rule": "api.yotpo.com/questions/send_confirmation_mail",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/348"
                            },
                            {
                                "rule": "api.yotpo.com/v1/widget/reviews",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/348"
                            },
                            {
                                "rule": "cdn-yotpo-images-production.yotpo.com/Product/.*/.*/square.jpg",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/348"
                            },
                            {
                                "rule": "staticw2.yotpo.com/.*/widget.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/348"
                            },
                            {
                                "rule": "staticw2.yotpo.com/.*/widget.css",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/348"
                            },
                            {
                                "rule": "staticw2.yotpo.com/assets/yotpo-widget-font.woff",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/348"
                            },
                            {
                                "rule": "staticw2.yotpo.com/batch/app_key/.*/domain_key/.*/widget/main_widget",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/348"
                            },
                            {
                                "rule": "staticw2.yotpo.com/batch/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/348"
                            },
                            {
                                "rule": "api.yotpo.com/reviews/.*/vote",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/348"
                            }
                        ]
                    },
                    "yottaa.com": {
                        "rules": [
                            {
                                "rule": "cdn.yottaa.com/rapid.min.",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "https://github.com/duckduckgo/privacy-configuration/issues/492"
                            }
                        ]
                    },
                    "zeustechnology.com": {
                        "rules": [
                            {
                                "rule": "seattle-times.zeustechnology.com/main.js",
                                "domains": [
                                    "seattletimes.com"
                                ],
                                "reason": "An unskippable adwall appears which prevents interaction with the page."
                            }
                        ]
                    },
                    "fidelity.com": {
                        "rules": [
                            {
                                "rule": "login.fidelity.com",
                                "domains": [
                                    "fidelity.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: login.fidelity.com.febsec-fidelity.com.akadns.net"
                            }
                        ]
                    },
                    "hoyoverse.com": {
                        "rules": [
                            {
                                "rule": "webstatic.hoyoverse.com",
                                "domains": [
                                    "hoyolab.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: d9k0w0y3delq8.cloudfront.net"
                            }
                        ]
                    },
                    "marksandspencer.com": {
                        "rules": [
                            {
                                "rule": "asset1.marksandspencer.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "bareminerals.com": {
                        "rules": [
                            {
                                "rule": "assets.bareminerals.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "biglots.com": {
                        "rules": [
                            {
                                "rule": "assets.biglots.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "cox.com": {
                        "rules": [
                            {
                                "rule": "assets.cox.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "deloitte.com": {
                        "rules": [
                            {
                                "rule": "assets.deloitte.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "hpe.com": {
                        "rules": [
                            {
                                "rule": "assets.ext.hpe.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "hdsupplysolutions.com": {
                        "rules": [
                            {
                                "rule": "assets.hdsupplysolutions.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "langhamhotels.com": {
                        "rules": [
                            {
                                "rule": "assets.langhamhotels.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "lumen.com": {
                        "rules": [
                            {
                                "rule": "assets.lumen.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "spectrumenterprise.com": {
                        "rules": [
                            {
                                "rule": "assets.spectrumenterprise.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "microsoft.com": {
                        "rules": [
                            {
                                "rule": "cdn-dynmedia-1.microsoft.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "bajajfinserv.in": {
                        "rules": [
                            {
                                "rule": "cms-assets.bajajfinserv.in/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "hunterdouglas.com": {
                        "rules": [
                            {
                                "rule": "content.hunterdouglas.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "ihg.com": {
                        "rules": [
                            {
                                "rule": "digital.ihg.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "accenture.com": {
                        "rules": [
                            {
                                "rule": "dynamicmedia.accenture.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "assaabloy.com": {
                        "rules": [
                            {
                                "rule": "gw-assets.assaabloy.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "acer.com": {
                        "rules": [
                            {
                                "rule": "images.acer.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "altrarunning.com": {
                        "rules": [
                            {
                                "rule": "images.altrarunning.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "ansys.com": {
                        "rules": [
                            {
                                "rule": "images.ansys.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "asics.com": {
                        "rules": [
                            {
                                "rule": "images.asics.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "blackberry.com": {
                        "rules": [
                            {
                                "rule": "images.blackberry.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "blue-tomato.com": {
                        "rules": [
                            {
                                "rule": "images.blue-tomato.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "heb.com": {
                        "rules": [
                            {
                                "rule": "images.heb.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "hugoboss.com": {
                        "rules": [
                            {
                                "rule": "images.hugoboss.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "jansport.com": {
                        "rules": [
                            {
                                "rule": "images.jansport.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "keurig.com": {
                        "rules": [
                            {
                                "rule": "images.keurig.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "kirklands.com": {
                        "rules": [
                            {
                                "rule": "images.kirklands.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "kwikset.com": {
                        "rules": [
                            {
                                "rule": "images.kwikset.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "lee.com": {
                        "rules": [
                            {
                                "rule": "images.lee.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "lennoxpros.com": {
                        "rules": [
                            {
                                "rule": "images.lennoxpros.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "lululemon.com": {
                        "rules": [
                            {
                                "rule": "images.lululemon.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "pfisterfaucets.com": {
                        "rules": [
                            {
                                "rule": "images.pfisterfaucets.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "philips.com": {
                        "rules": [
                            {
                                "rule": "images.philips.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            },
                            {
                                "rule": "www.assets.lighting.philips.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "selfridges.com": {
                        "rules": [
                            {
                                "rule": "images.selfridges.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "shaneco.com": {
                        "rules": [
                            {
                                "rule": "images.shaneco.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "shophq.com": {
                        "rules": [
                            {
                                "rule": "images.shophq.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "tervis.com": {
                        "rules": [
                            {
                                "rule": "images.tervis.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "thenorthface.com": {
                        "rules": [
                            {
                                "rule": "images.thenorthface.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "timberland.com": {
                        "rules": [
                            {
                                "rule": "images.timberland.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "trex.com": {
                        "rules": [
                            {
                                "rule": "images.trex.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "vans.com": {
                        "rules": [
                            {
                                "rule": "images.vans.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "wacoal-america.com": {
                        "rules": [
                            {
                                "rule": "images.wacoal-america.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "wrangler.com": {
                        "rules": [
                            {
                                "rule": "images.wrangler.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            },
                            {
                                "rule": "imageseu.wrangler.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "uline.com": {
                        "rules": [
                            {
                                "rule": "img.uline.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "stryker.com": {
                        "rules": [
                            {
                                "rule": "media-assets.stryker.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "castorama.fr": {
                        "rules": [
                            {
                                "rule": "media.castorama.fr/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "chainreactioncycles.com": {
                        "rules": [
                            {
                                "rule": "media.chainreactioncycles.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "playstation.com": {
                        "rules": [
                            {
                                "rule": "media.direct.playstation.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "diy.com": {
                        "rules": [
                            {
                                "rule": "media.diy.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "guitarcenter.com": {
                        "rules": [
                            {
                                "rule": "media.guitarcenter.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "kohlsimg.com": {
                        "rules": [
                            {
                                "rule": "media.kohlsimg.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "schaefer-shop.de": {
                        "rules": [
                            {
                                "rule": "media.schaefer-shop.de/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "screwfix.com": {
                        "rules": [
                            {
                                "rule": "media.screwfix.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "screwfix.ie": {
                        "rules": [
                            {
                                "rule": "media.screwfix.ie/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "sunbeltrentals.com": {
                        "rules": [
                            {
                                "rule": "media.sunbeltrentals.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "bakerdist.com": {
                        "rules": [
                            {
                                "rule": "resource.bakerdist.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "gemaire.com": {
                        "rules": [
                            {
                                "rule": "resource.gemaire.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "armstrongceilings.com": {
                        "rules": [
                            {
                                "rule": "s7-images.armstrongceilings.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "bluegreenvacations.com": {
                        "rules": [
                            {
                                "rule": "s7.bluegreenvacations.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "italia.it": {
                        "rules": [
                            {
                                "rule": "tourismmedia.italia.it/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "signify.com": {
                        "rules": [
                            {
                                "rule": "www.assets.signify.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "hitachienergy.com": {
                        "rules": [
                            {
                                "rule": "dynamic-assets.hitachienergy.com/s7viewersdk/3.11/MixedMediaViewer/js/s7sdk/utils/Utils.js",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: scene7.com.edgekey.net"
                            }
                        ]
                    },
                    "aliexpress.com": {
                        "rules": [
                            {
                                "rule": "login.aliexpress.com/",
                                "domains": [
                                    "aliexpress.com",
                                    "aliexpress.us"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: alicdn.com.edgekey.net"
                            }
                        ]
                    },
                    "aliexpress.us": {
                        "rules": [
                            {
                                "rule": "login.aliexpress.us/",
                                "domains": [
                                    "aliexpress.com",
                                    "aliexpress.us"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: alicdn.com.edgekey.net"
                            }
                        ]
                    },
                    "agoda.net": {
                        "rules": [
                            {
                                "rule": "cdn0.agoda.net/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: cdn.agoda.net.edgekey.net"
                            },
                            {
                                "rule": "cdn6.agoda.net/",
                                "domains": [
                                    "<all>"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: cdn.agoda.net.edgekey.net"
                            }
                        ]
                    },
                    "sky.com": {
                        "rules": [
                            {
                                "rule": "accounts.sky.com/assets/sky_common.js",
                                "domains": [
                                    "sky.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: sky.com.edgesuite.net"
                            }
                        ]
                    },
                    "espncdn.com": {
                        "rules": [
                            {
                                "rule": "a.espncdn.com/",
                                "domains": [
                                    "espn.co.uk",
                                    "espn.com",
                                    "espn.com.au",
                                    "espn.com.br",
                                    "espn.com.mx",
                                    "espn.in",
                                    "espnfc.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: a.espncdn.com.stls.edgesuite.net"
                            }
                        ]
                    },
                    "ticketmaster.ca": {
                        "rules": [
                            {
                                "rule": "epsf.ticketmaster.ca/eps-d",
                                "domains": [
                                    "ticketmaster.ca",
                                    "ticketmaster.com",
                                    "ticketmaster.com.au",
                                    "ticketmaster.com.mx"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: ticketmaster4.map.fastly.net"
                            }
                        ]
                    },
                    "ticketmaster.com": {
                        "rules": [
                            {
                                "rule": "epsf.ticketmaster.com/eps-d",
                                "domains": [
                                    "ticketmaster.ca",
                                    "ticketmaster.com",
                                    "ticketmaster.com.au",
                                    "ticketmaster.com.mx"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: ticketmaster4.map.fastly.net"
                            }
                        ]
                    },
                    "target.com": {
                        "rules": [
                            {
                                "rule": "api.target.com/",
                                "domains": [
                                    "target.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: target-opus.map.fastly.net"
                            },
                            {
                                "rule": "carts.target.com/",
                                "domains": [
                                    "target.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: target-opus.map.fastly.net"
                            },
                            {
                                "rule": "gsp.target.com/",
                                "domains": [
                                    "target.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: target-opus.map.fastly.net"
                            },
                            {
                                "rule": "redoak.target.com/",
                                "domains": [
                                    "target.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: target-opus.map.fastly.net"
                            },
                            {
                                "rule": "redsky.target.com/",
                                "domains": [
                                    "target.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: target-opus.map.fastly.net"
                            },
                            {
                                "rule": "sapphire-api.target.com/",
                                "domains": [
                                    "target.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: target-opus.map.fastly.net"
                            },
                            {
                                "rule": "taglocker.target.com/",
                                "domains": [
                                    "target.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: target-opus.map.fastly.net"
                            }
                        ]
                    },
                    "targetimg1.com": {
                        "rules": [
                            {
                                "rule": "assets.targetimg1.com/",
                                "domains": [
                                    "target.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: target-opus.map.fastly.net"
                            }
                        ]
                    },
                    "optus.com.au": {
                        "rules": [
                            {
                                "rule": "lp-07.messaging.optus.com.au",
                                "domains": [
                                    "virginmedia.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: liveperson.net"
                            },
                            {
                                "rule": "lptag.messaging.optus.com.au",
                                "domains": [
                                    "virginmedia.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: liveperson.net"
                            },
                            {
                                "rule": "lpcdn.messaging.optus.com.au",
                                "domains": [
                                    "virginmedia.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: lpsnmedia.net"
                            }
                        ]
                    },
                    "mbna.ca": {
                        "rules": [
                            {
                                "rule": "chat.mbna.ca",
                                "domains": [
                                    "virginmedia.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: lpsnmedia.net"
                            }
                        ]
                    },
                    "singtel.com": {
                        "rules": [
                            {
                                "rule": "chat.singtel.com",
                                "domains": [
                                    "virginmedia.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: lpsnmedia.net"
                            }
                        ]
                    },
                    "navyfederal.org": {
                        "rules": [
                            {
                                "rule": "liveengage.navyfederal.org",
                                "domains": [
                                    "virginmedia.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: lpsnmedia.net"
                            }
                        ]
                    },
                    "bupa.com.au": {
                        "rules": [
                            {
                                "rule": "lp-01.customermessaging.bupa.com.au",
                                "domains": [
                                    "virginmedia.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: lpsnmedia.net"
                            },
                            {
                                "rule": "lpcdn.customermessaging.bupa.com.au",
                                "domains": [
                                    "virginmedia.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: lpsnmedia.net"
                            }
                        ]
                    },
                    "citi.com": {
                        "rules": [
                            {
                                "rule": "lpcdn.chat.online.citi.com",
                                "domains": [
                                    "virginmedia.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: lpsnmedia.net"
                            }
                        ]
                    },
                    "telstra.com.au": {
                        "rules": [
                            {
                                "rule": "lpcdn.messaging.telstra.com.au",
                                "domains": [
                                    "virginmedia.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: lpsnmedia.net"
                            }
                        ]
                    },
                    "americanexpress.com": {
                        "rules": [
                            {
                                "rule": "lpchat.americanexpress.com",
                                "domains": [
                                    "virginmedia.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: lpsnmedia.net"
                            }
                        ]
                    },
                    "joindeleteme.com": {
                        "rules": [
                            {
                                "rule": "b2b.joindeleteme.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "usgbc.org": {
                        "rules": [
                            {
                                "rule": "build.usgbc.org/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "claris.com": {
                        "rules": [
                            {
                                "rule": "content.claris.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "president.jp": {
                        "rules": [
                            {
                                "rule": "corp.president.jp/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "ap.org": {
                        "rules": [
                            {
                                "rule": "discover.ap.org/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "selinc.com": {
                        "rules": [
                            {
                                "rule": "discover.selinc.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "discovery.org": {
                        "rules": [
                            {
                                "rule": "dot.discovery.org/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "medbridgeeducation.com": {
                        "rules": [
                            {
                                "rule": "enterprise.medbridgeeducation.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "baesystems.com": {
                        "rules": [
                            {
                                "rule": "events.baesystems.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "acton.org": {
                        "rules": [
                            {
                                "rule": "go.acton.org/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "adflegal.org": {
                        "rules": [
                            {
                                "rule": "go.adflegal.org/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "adspipe.com": {
                        "rules": [
                            {
                                "rule": "go.adspipe.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "adventure-life.com": {
                        "rules": [
                            {
                                "rule": "go.adventure-life.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "brennancenter.org": {
                        "rules": [
                            {
                                "rule": "go.brennancenter.org/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "cdata.com": {
                        "rules": [
                            {
                                "rule": "go.cdata.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "concernusa.org": {
                        "rules": [
                            {
                                "rule": "go.concernusa.org/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "herzing.edu": {
                        "rules": [
                            {
                                "rule": "go.connect.herzing.edu/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "costar.com": {
                        "rules": [
                            {
                                "rule": "go.costar.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "esri.com": {
                        "rules": [
                            {
                                "rule": "go.esri.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "estes-express.com": {
                        "rules": [
                            {
                                "rule": "go.estes-express.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "hustlerturf.com": {
                        "rules": [
                            {
                                "rule": "go.hustlerturf.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "icontainers.com": {
                        "rules": [
                            {
                                "rule": "go.icontainers.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "iocdf.org": {
                        "rules": [
                            {
                                "rule": "go.iocdf.org/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "jinjibu.jp": {
                        "rules": [
                            {
                                "rule": "go.jinjibu.jp/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "lifefitness.com": {
                        "rules": [
                            {
                                "rule": "go.lifefitness.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "mobilityworks.com": {
                        "rules": [
                            {
                                "rule": "go.mobilityworks.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "neilpatel.com": {
                        "rules": [
                            {
                                "rule": "go.neilpatel.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "oru.edu": {
                        "rules": [
                            {
                                "rule": "go.oru.edu/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "panasonic.biz": {
                        "rules": [
                            {
                                "rule": "go.panasonic.biz/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "ripple.com": {
                        "rules": [
                            {
                                "rule": "go.ripple.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "strongtie.com": {
                        "rules": [
                            {
                                "rule": "go.strongtie.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "thirdspacelearning.com": {
                        "rules": [
                            {
                                "rule": "go.thirdspacelearning.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "iata.org": {
                        "rules": [
                            {
                                "rule": "go.updates.iata.org/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "uslawshield.com": {
                        "rules": [
                            {
                                "rule": "go.uslawshield.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "lumbermenonline.com": {
                        "rules": [
                            {
                                "rule": "go1.lumbermenonline.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "signalboosters.com": {
                        "rules": [
                            {
                                "rule": "go2.signalboosters.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "panasonic.jp": {
                        "rules": [
                            {
                                "rule": "gohs.panasonic.jp/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "rescue.org": {
                        "rules": [
                            {
                                "rule": "gorm.rescue.org/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "affirm.com": {
                        "rules": [
                            {
                                "rule": "info.affirm.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "bldr.com": {
                        "rules": [
                            {
                                "rule": "info.bldr.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "ckeditor.com": {
                        "rules": [
                            {
                                "rule": "info.ckeditor.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "factsmgt.com": {
                        "rules": [
                            {
                                "rule": "info.factsmgt.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "gci.com": {
                        "rules": [
                            {
                                "rule": "info.gci.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "msci.com": {
                        "rules": [
                            {
                                "rule": "info.msci.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "viewsonic.com": {
                        "rules": [
                            {
                                "rule": "info.viewsonic.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "woolmark.com": {
                        "rules": [
                            {
                                "rule": "info.woolmark.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "renasantbank.com": {
                        "rules": [
                            {
                                "rule": "insights.renasantbank.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "caring.com": {
                        "rules": [
                            {
                                "rule": "launch.caring.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "amazonappservices.com": {
                        "rules": [
                            {
                                "rule": "m.amazonappservices.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "epson.com.au": {
                        "rules": [
                            {
                                "rule": "marketing-sf.epson.com.au/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "groupon.com": {
                        "rules": [
                            {
                                "rule": "marketing.groupon.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "globalsign.com": {
                        "rules": [
                            {
                                "rule": "media.globalsign.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "tatlerasia.com": {
                        "rules": [
                            {
                                "rule": "media2.tatlerasia.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "schrott24.de": {
                        "rules": [
                            {
                                "rule": "metal.schrott24.de/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "fujitsu.com": {
                        "rules": [
                            {
                                "rule": "mkt-europe.global.fujitsu.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "tokyoweekender.com": {
                        "rules": [
                            {
                                "rule": "mkt.tokyoweekender.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "northside.com": {
                        "rules": [
                            {
                                "rule": "onechartmail.northside.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "epson.jp": {
                        "rules": [
                            {
                                "rule": "pd.epson.jp/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "11880.com": {
                        "rules": [
                            {
                                "rule": "pdt.11880.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "redlightguide.com": {
                        "rules": [
                            {
                                "rule": "pdt.redlightguide.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "werkenntdenbesten.de": {
                        "rules": [
                            {
                                "rule": "pdt.werkenntdenbesten.de/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "illumina.com": {
                        "rules": [
                            {
                                "rule": "prdt.illumina.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "xserver.ne.jp": {
                        "rules": [
                            {
                                "rule": "prm.xserver.ne.jp/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "brother.ca": {
                        "rules": [
                            {
                                "rule": "resellersales.brother.ca/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "chemie.de": {
                        "rules": [
                            {
                                "rule": "t.chemie.de/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "vonage.com": {
                        "rules": [
                            {
                                "rule": "ww3.business.vonage.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "ntt.com": {
                        "rules": [
                            {
                                "rule": "www.bizsol.ntt.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "shredit.com": {
                        "rules": [
                            {
                                "rule": "www.email.shredit.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "ergotron.com": {
                        "rules": [
                            {
                                "rule": "www2.ergotron.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "aruhi-corp.co.jp": {
                        "rules": [
                            {
                                "rule": "www2.go.aruhi-corp.co.jp/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "sharecare.com": {
                        "rules": [
                            {
                                "rule": "www2.sharecare.com/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    },
                    "sma.de": {
                        "rules": [
                            {
                                "rule": "www3.sma.de/",
                                "domains": [
                                    "klove.com"
                                ],
                                "reason": "CNAME ENTRY GENERATED FROM: go.pardot.com"
                            }
                        ]
                    }
                }
            },
            "exceptions": [],
            "hash": "4de0531b3d89d4e97d654b1e93ea963a"
        },
        "trackingCookies1p": {
            "settings": {
                "firstPartyTrackerCookiePolicy": {
                    "threshold": 86400,
                    "maxAge": 86400
                }
            },
            "exceptions": [],
            "state": "enabled",
            "hash": "66159bbb387e48b7d6295068e642fc99"
        },
        "trackingCookies3p": {
            "settings": {
                "excludedCookieDomains": []
            },
            "exceptions": [],
            "state": "enabled",
            "hash": "6859f9cb854d6be96600b5757600ee5b"
        },
        "trackingParameters": {
            "exceptions": [],
            "settings": {
                "parameters": [
                    "utm_source",
                    "utm_medium",
                    "utm_campaign",
                    "utm_term",
                    "utm_content",
                    "gclid",
                    "fbclid",
                    "fb_action_ids",
                    "fb_action_types",
                    "fb_source",
                    "fb_ref",
                    "ga_source",
                    "ga_medium",
                    "ga_term",
                    "ga_content",
                    "ga_campaign",
                    "ga_place",
                    "action_object_map",
                    "action_type_map",
                    "action_ref_map",
                    "gs_l",
                    "mkt_tok",
                    "hmb_campaign",
                    "hmb_source",
                    "hmb_medium"
                ]
            },
            "state": "enabled",
            "hash": "4eb7caeea36d5a0d96fe06386d403d54"
        },
        "userAgentRotation": {
            "settings": {
                "agentExcludePatterns": []
            },
            "exceptions": [],
            "state": "disabled",
            "hash": "5d33a7d6a3f780d2e07076e209a5bccb"
        },
        "webCompat": {
            "exceptions": [
                {
                    "domain": "portal.azure.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/526"
                },
                {
                    "domain": "lastpass.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/533"
                },
                {
                    "domain": "forums.swift.org",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "twittercommunity.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forum.asana.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.developer.atlassian.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "meta.discourse.org",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.smartthings.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forum.figma.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "bbs.boingboing.net",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "devforum.zoom.us",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forum.uipath.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "discuss.elastic.co",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forums.envato.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "discuss.newrelic.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.wd.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forums.wyzecam.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.anker.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "www.trainerroad.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "www.sitepoint.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "comunidade.nubank.com.br",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.monzo.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.wirexapp.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.freetrade.io",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forums.unrealengine.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forums.funcom.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.infiniteflight.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forums.eveonline.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.metamask.io",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forum.algorand.org",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forum.cardano.org",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forums.solana.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "developers.chia.net",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.cartalk.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "www.thefantasyfootballers.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "www.twit.community",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "commons.commondreams.org",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "boards.straightdope.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forum.gitlab.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "discuss.rubyonrails.org",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forums.docker.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.brave.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "discuss.emberjs.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forum.glamour.de",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forums.cfl.ca",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "soaps.sheknows.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forum.mssociety.org.uk",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forum.schizophrenia.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forum.octopus.energy",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forum.level1techs.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forums.zwift.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forums.plex.tv",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forum.arduino.cc",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forum.restic.net",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forum.openwrt.org",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "www.horlogeforum.nl",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forum.infinityfree.net",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forum.manjaro.org",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forum.projectpanoptes.org",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "forum.obsidian.md",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "us.forums.blizzard.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.home-assistant.io",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.openfl.org",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.sonarsource.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "ubuntu-mate.community",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.letsencrypt.org",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.naimaudio.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.ipfire.org",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.squirrelsquadron.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.signalusers.org",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.haxe.org",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.grafana.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.octoprint.org",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                },
                {
                    "domain": "community.bitwarden.com",
                    "reason": "https://github.com/duckduckgo/privacy-configuration/issues/519"
                }
            ],
            "state": "disabled",
            "hash": "b90668dd2aa466abc5eb36578c53ba7f"
        },
        "windowsPermissionUsage": {
            "exceptions": [],
            "state": "disabled",
            "hash": "728493ef7a1488e4781656d3f9db84aa"
        },
        "windowsWaitlist": {
            "exceptions": [],
            "state": "disabled",
            "hash": "728493ef7a1488e4781656d3f9db84aa"
        }
    },
    "unprotectedTemporary": []
}
},{}],12:[function(require,module,exports){
"use strict";

var parseUserAgentString = require('../js/shared-utils/parse-user-agent-string');
var browserInfo = parseUserAgentString();
function getConfigFileName() {
  var _browserInfo$browser;
  var browserName = (browserInfo === null || browserInfo === void 0 ? void 0 : (_browserInfo$browser = browserInfo.browser) === null || _browserInfo$browser === void 0 ? void 0 : _browserInfo$browser.toLowerCase()) || '';

  // clamp to known browsers
  if (!['chrome', 'firefox', 'brave', 'edg'].includes(browserName)) {
    browserName = '';
  } else {
    var _chrome;
    browserName = '-' + browserName + (((_chrome = chrome) === null || _chrome === void 0 ? void 0 : _chrome.runtime.getManifest().manifest_version) === 3 ? 'mv3' : '');
  }
  return "https://staticcdn.duckduckgo.com/trackerblocking/config/v2/extension".concat(browserName, "-config.json");
}
module.exports = {
  displayCategories: ['Analytics', 'Advertising', 'Social Network', 'Content Delivery', 'Embedded Content'],
  feedbackUrl: 'https://duckduckgo.com/feedback.js?type=extension-feedback',
  tosdrMessages: {
    A: 'Good',
    B: 'Mixed',
    C: 'Poor',
    D: 'Poor',
    E: 'Poor',
    good: 'Good',
    bad: 'Poor',
    unknown: 'Unknown',
    mixed: 'Mixed'
  },
  httpsService: 'https://duckduckgo.com/smarter_encryption.js',
  duckDuckGoSerpHostname: 'duckduckgo.com',
  httpsMessages: {
    secure: 'Encrypted Connection',
    upgraded: 'Forced Encryption',
    none: 'Unencrypted Connection'
  },
  /**
   * Major tracking networks data:
   * percent of the top 1 million sites a tracking network has been seen on.
   * see: https://webtransparency.cs.princeton.edu/webcensus/
   */
  majorTrackingNetworks: {
    google: 84,
    facebook: 36,
    twitter: 16,
    amazon: 14,
    appnexus: 10,
    oracle: 10,
    mediamath: 9,
    oath: 9,
    maxcdn: 7,
    automattic: 7
  },
  /*
   * Mapping entity names to CSS class name for popup icons
   */
  entityIconMapping: {
    'Google LLC': 'google',
    'Facebook, Inc.': 'facebook',
    'Twitter, Inc.': 'twitter',
    'Amazon Technologies, Inc.': 'amazon',
    'AppNexus, Inc.': 'appnexus',
    'MediaMath, Inc.': 'mediamath',
    'StackPath, LLC': 'maxcdn',
    'Automattic, Inc.': 'automattic',
    'Adobe Inc.': 'adobe',
    'Quantcast Corporation': 'quantcast',
    'The Nielsen Company': 'nielsen'
  },
  httpsDBName: 'https',
  httpsLists: [{
    type: 'upgrade bloom filter',
    name: 'httpsUpgradeBloomFilter',
    url: 'https://staticcdn.duckduckgo.com/https/https-bloom.json'
  }, {
    type: "don't upgrade bloom filter",
    name: 'httpsDontUpgradeBloomFilters',
    url: 'https://staticcdn.duckduckgo.com/https/negative-https-bloom.json'
  }, {
    type: 'upgrade safelist',
    name: 'httpsUpgradeList',
    url: 'https://staticcdn.duckduckgo.com/https/negative-https-allowlist.json'
  }, {
    type: "don't upgrade safelist",
    name: 'httpsDontUpgradeList',
    url: 'https://staticcdn.duckduckgo.com/https/https-allowlist.json'
  }],
  tdsLists: [{
    name: 'surrogates',
    url: '/data/surrogates.txt',
    format: 'text',
    source: 'local'
  }, {
    name: 'tds',
    url: 'https://staticcdn.duckduckgo.com/trackerblocking/v4/tds.json',
    format: 'json',
    source: 'external',
    channels: {
      live: 'https://staticcdn.duckduckgo.com/trackerblocking/v4/tds.json',
      next: 'https://staticcdn.duckduckgo.com/trackerblocking/v4/tds-next.json',
      beta: 'https://staticcdn.duckduckgo.com/trackerblocking/beta/tds.json'
    }
  }, {
    name: 'config',
    url: getConfigFileName(),
    format: 'json',
    source: 'external'
  }],
  httpsErrorCodes: {
    'net::ERR_CONNECTION_REFUSED': 1,
    'net::ERR_ABORTED': 2,
    'net::ERR_SSL_PROTOCOL_ERROR': 3,
    'net::ERR_SSL_VERSION_OR_CIPHER_MISMATCH': 4,
    'net::ERR_NAME_NOT_RESOLVED': 5,
    NS_ERROR_CONNECTION_REFUSED: 6,
    NS_ERROR_UNKNOWN_HOST: 7,
    'An additional policy constraint failed when validating this certificate.': 8,
    'Unable to communicate securely with peer: requested domain name does not match the server’s certificate.': 9,
    'Cannot communicate securely with peer: no common encryption algorithm(s).': 10,
    'SSL received a record that exceeded the maximum permissible length.': 11,
    'The certificate is not trusted because it is self-signed.': 12,
    downgrade_redirect_loop: 13
  },
  iconPaths: /** @type {const} */{
    regular: '/img/icon_browser_action.png',
    withSpecialState: '/img/icon_browser_action_special.png'
  },
  platform: {
    name: 'extension'
  },
  supportedLocales: ['cimode', 'en'],
  // cimode is for testing
  trackerStats: /** @type {const} */{
    allowedOrigin: 'https://duckduckgo.com',
    allowedPathname: 'ntp-tracker-stats.html',
    redirectTarget: 'html/tracker-stats.html',
    clientPortName: 'newtab-tracker-stats',
    /** @type {ReadonlyArray<string>} */
    excludedCompanies: ['ExoClick'],
    events: {
      incoming: {
        newTabPage_heartbeat: 'newTabPage_heartbeat'
      },
      outgoing: {
        newTabPage_data: 'newTabPage_data',
        newTabPage_disconnect: 'newTabPage_disconnect'
      }
    }
  }
};

},{"../js/shared-utils/parse-user-agent-string":22}],13:[function(require,module,exports){
"use strict";

module.exports = {
  httpsEverywhereEnabled: true,
  embeddedTweetsEnabled: false,
  GPC: true,
  youtubePreviewsEnabled: false,
  atb: null,
  set_atb: null,
  'config-etag': null,
  'httpsUpgradeBloomFilter-etag': null,
  'httpsDontUpgradeBloomFilters-etag': null,
  'httpsUpgradeList-etag': null,
  'httpsDontUpgradeList-etag': null,
  hasSeenPostInstall: false,
  extiSent: false,
  'tds-etag': null,
  lastTdsUpdate: 0
};

},{}],14:[function(require,module,exports){
module.exports={"config-etag":"W/\"908619556a78f118d1c2190d7d45433b\""}
},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showContextMenuAction = exports.sendJSPixel = exports.isValidUsername = exports.isValidToken = exports.hideContextMenuAction = exports.getAddresses = exports.formatAddress = exports.fetchAlias = exports.REFETCH_ALIAS_ALARM = void 0;
var _webextensionPolyfill = _interopRequireDefault(require("webextension-polyfill"));
var _pixels = require("./pixels");
var _load = _interopRequireDefault(require("./load"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var _require = require('./settings'),
  getSetting = _require.getSetting,
  updateSetting = _require.updateSetting;
var browserWrapper = require('./wrapper');
var utils = require('./utils');
var REFETCH_ALIAS_ALARM = 'refetchAlias';
exports.REFETCH_ALIAS_ALARM = REFETCH_ALIAS_ALARM;
var REFETCH_ALIAS_ATTEMPT = 'refetchAliasAttempt';
var pixelsEnabled = utils.getBrowserName() !== 'moz';
var fetchAlias = function fetchAlias() {
  // if another fetch was previously scheduled, clear that and execute now
  _webextensionPolyfill["default"].alarms.clear(REFETCH_ALIAS_ALARM);
  var userData = getSetting('userData');
  if (!(userData !== null && userData !== void 0 && userData.token)) return;
  return fetch('https://quack.duckduckgo.com/api/email/addresses', {
    method: 'post',
    headers: {
      Authorization: "Bearer ".concat(userData.token)
    }
  }).then( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (response) {
      if (response.ok) {
        return response.json().then( /*#__PURE__*/function () {
          var _ref3 = _asyncToGenerator(function* (_ref2) {
            var address = _ref2.address;
            if (!/^[a-z0-9]+$/.test(address)) throw new Error('Invalid address');
            updateSetting('userData', Object.assign(userData, {
              nextAlias: "".concat(address)
            }));
            // Reset attempts
            yield browserWrapper.removeFromSessionStorage(REFETCH_ALIAS_ATTEMPT);
            return {
              success: true
            };
          });
          return function (_x2) {
            return _ref3.apply(this, arguments);
          };
        }());
      } else {
        throw new Error('An error occurred while fetching the alias');
      }
    });
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }())["catch"]( /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(function* (e) {
      // TODO: Do we want to logout if the error is a 401 unauthorized?
      console.log('Error fetching new alias', e);
      // Don't try fetching more than 5 times in a row
      var attempts = (yield browserWrapper.getFromSessionStorage(REFETCH_ALIAS_ATTEMPT)) || 1;
      if (attempts < 5) {
        browserWrapper.createAlarm(REFETCH_ALIAS_ALARM, {
          delayInMinutes: 2
        });
        yield browserWrapper.setToSessionStorage(REFETCH_ALIAS_ATTEMPT, attempts + 1);
      }
      // Return the error so we can handle it
      return {
        error: e
      };
    });
    return function (_x3) {
      return _ref4.apply(this, arguments);
    };
  }());
};
exports.fetchAlias = fetchAlias;
var MENU_ITEM_ID = 'ddg-autofill-context-menu-item';
// Create the contextual menu hidden by default
_webextensionPolyfill["default"].contextMenus.create({
  id: MENU_ITEM_ID,
  title: 'Generate Private Duck Address',
  contexts: ['editable'],
  documentUrlPatterns: ['https://*/*'],
  visible: false
}, function () {
  // It's fine if this context menu already exists, suppress that error.
  // Note: Since webextension-polyfill does not wrap the contextMenus.create
  //       API, the old callback + runtime.lastError approach must be used.
  var lastError = _webextensionPolyfill["default"].runtime.lastError;
  if (lastError && lastError.message && !lastError.message.startsWith('Cannot create item with duplicate id')) {
    throw lastError;
  }
});
_webextensionPolyfill["default"].contextMenus.onClicked.addListener(function (info, tab) {
  var userData = getSetting('userData');
  if (tab !== null && tab !== void 0 && tab.id && userData.nextAlias) {
    _webextensionPolyfill["default"].tabs.sendMessage(tab.id, {
      type: 'contextualAutofill',
      alias: userData.nextAlias
    });
  }
});
var showContextMenuAction = function showContextMenuAction() {
  return _webextensionPolyfill["default"].contextMenus.update(MENU_ITEM_ID, {
    visible: true
  });
};
exports.showContextMenuAction = showContextMenuAction;
var hideContextMenuAction = function hideContextMenuAction() {
  return _webextensionPolyfill["default"].contextMenus.update(MENU_ITEM_ID, {
    visible: false
  });
};
exports.hideContextMenuAction = hideContextMenuAction;
var getAddresses = function getAddresses() {
  var userData = getSetting('userData');
  return {
    personalAddress: userData === null || userData === void 0 ? void 0 : userData.userName,
    privateAddress: userData === null || userData === void 0 ? void 0 : userData.nextAlias
  };
};
exports.getAddresses = getAddresses;
function sendPixelRequest(pixelName) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var randomNum = Math.ceil(Math.random() * 1e7);
  var searchParams = new URLSearchParams(Object.entries(params));
  var url = (0, _pixels.getURL)(pixelName) + "?".concat(randomNum, "&").concat(searchParams.toString());
  _load["default"].url(url);
}
function currentDate() {
  return new Date().toLocaleString('en-CA', {
    timeZone: 'America/New_York',
    dateStyle: 'short'
  });
}
var getFullPixelName = function getFullPixelName(name, browserName) {
  return "".concat(name, "_").concat(browserName.toLowerCase());
};
var fireAddressUsedPixel = function fireAddressUsedPixel(pixel) {
  var _utils$getBrowserName, _getSetting;
  var browserName = (_utils$getBrowserName = utils.getBrowserName()) !== null && _utils$getBrowserName !== void 0 ? _utils$getBrowserName : 'unknown';
  if (!pixelsEnabled) return;
  var userData = getSetting('userData');
  if (!(userData !== null && userData !== void 0 && userData.userName)) return;
  var lastAddressUsedAt = (_getSetting = getSetting('lastAddressUsedAt')) !== null && _getSetting !== void 0 ? _getSetting : '';
  sendPixelRequest(getFullPixelName(pixel, browserName), {
    duck_address_last_used: lastAddressUsedAt,
    cohort: userData.cohort
  });
  updateSetting('lastAddressUsedAt', currentDate());
};
var fireIncontextSignupPixel = function fireIncontextSignupPixel(pixel) {
  var _utils$getBrowserName2;
  var browserName = (_utils$getBrowserName2 = utils.getBrowserName()) !== null && _utils$getBrowserName2 !== void 0 ? _utils$getBrowserName2 : 'unknown';
  if (!pixelsEnabled) return;
  sendPixelRequest(getFullPixelName(pixel, browserName));
};

/**
 * Config type definition
 * @typedef {Object} FirePixelOptions
 * @property {import('@duckduckgo/autofill/src/deviceApiCalls/__generated__/validators-ts').SendJSPixelParams['pixelName']} pixelName
 */

/**
 *
 * @param {FirePixelOptions}  options
 */
var sendJSPixel = function sendJSPixel(options) {
  var pixelName = options.pixelName;
  switch (pixelName) {
    case 'autofill_show':
      fireAddressUsedPixel('email_tooltip_show_extension');
      break;
    case 'autofill_private_address':
      fireAddressUsedPixel('email_filled_random_extension');
      break;
    case 'autofill_personal_address':
      fireAddressUsedPixel('email_filled_main_extension');
      break;
    case 'incontext_show':
      fireIncontextSignupPixel('incontext_show_extension');
      break;
    case 'incontext_primary_cta':
      fireIncontextSignupPixel('incontext_primary_cta_extension');
      break;
    case 'incontext_dismiss_persisted':
      fireIncontextSignupPixel('incontext_dismiss_persisted_extension');
      break;
    case 'incontext_close_x':
      fireIncontextSignupPixel('incontext_close_x_extension');
      break;
    default:
      console.error('Unknown pixel name', pixelName);
  }
};

/**
 * Given a username, returns a valid email address with the duck domain
 * @param {string} address
 * @returns {string}
 */
exports.sendJSPixel = sendJSPixel;
var formatAddress = function formatAddress(address) {
  return address + '@duck.com';
};

/**
 * Checks formal username validity
 * @param {string} userName
 * @returns {boolean}
 */
exports.formatAddress = formatAddress;
var isValidUsername = function isValidUsername(userName) {
  return /^[a-z0-9_]+$/.test(userName);
};

/**
 * Checks formal token validity
 * @param {string} token
 * @returns {boolean}
 */
exports.isValidUsername = isValidUsername;
var isValidToken = function isValidToken(token) {
  return /^[a-z0-9]+$/.test(token);
};
exports.isValidToken = isValidToken;

},{"./load":16,"./pixels":17,"./settings":18,"./utils":20,"./wrapper":21,"webextension-polyfill":10}],16:[function(require,module,exports){
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var browserWrapper = require('./wrapper');
function JSONfromLocalFile(path) {
  return loadExtensionFile({
    url: path,
    returnType: 'json'
  });
}
function JSONfromExternalFile(urlString) {
  return loadExtensionFile({
    url: urlString,
    returnType: 'json',
    source: 'external'
  });
}
function url(urlString) {
  return loadExtensionFile({
    url: urlString,
    source: 'external'
  });
}

/*
 * Params:
 *  - url: request URL
 *  - source: requests are internal by default. set source to 'external' for non-extension URLs
 *  - etag: set an if-none-match header
 */
function loadExtensionFile(_x) {
  return _loadExtensionFile.apply(this, arguments);
}
function _loadExtensionFile() {
  _loadExtensionFile = _asyncToGenerator(function* (params) {
    var headers = new Headers();
    var urlString = params.url;
    if (params.source === 'external') {
      if (yield browserWrapper.getFromSessionStorage('dev')) {
        if (urlString.indexOf('?') > -1) {
          urlString += '&';
        } else {
          urlString += '?';
        }
        urlString += 'test=1';
      }
      if (params.etag) {
        headers.append('If-None-Match', params.etag);
      }
    } else {
      urlString = browserWrapper.getExtensionURL(urlString);
    }
    var rej;
    var timeoutPromise = new Promise(function (resolve, reject) {
      rej = reject;
    });
    // @ts-ignore
    var fetchTimeout = setTimeout(rej, params.timeout || 30000);
    var fetchResult = fetch(urlString, {
      method: 'GET',
      headers: headers
    }).then( /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(function* (response) {
        clearTimeout(fetchTimeout);
        var status = response.status;
        var etag = response.headers.get('etag');
        var date = response.headers.get('Date');
        var data;
        if (status === 200) {
          if (params.returnType === 'json') {
            data = yield response.json();
          } else if (params.returnType === 'arraybuffer') {
            data = yield response.arrayBuffer();
          } else {
            data = yield response.text();
          }
          return {
            status: status,
            date: date,
            etag: etag,
            data: data
          };
        } else if (status === 304) {
          console.log("".concat(urlString, " returned 304, resource not changed"));
          return {
            status: status,
            date: date,
            etag: etag
          };
        } else {
          throw new Error("".concat(urlString, " returned ").concat(response.status));
        }
      });
      return function (_x2) {
        return _ref.apply(this, arguments);
      };
    }());
    return Promise.race([timeoutPromise, fetchResult]);
  });
  return _loadExtensionFile.apply(this, arguments);
}
module.exports = {
  loadExtensionFile: loadExtensionFile,
  JSONfromLocalFile: JSONfromLocalFile,
  JSONfromExternalFile: JSONfromExternalFile,
  url: url
};

},{"./wrapper":21}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getURL = getURL;
/**
 *
 * Return URL for the pixel request
 * @param {string} pixelName
 * @returns {string}
 */
function getURL(pixelName) {
  if (!pixelName) throw new Error('pixelName is required');
  var url = 'https://improving.duckduckgo.com/t/';
  return url + pixelName;
}

},{}],18:[function(require,module,exports){
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var defaultSettings = require('../../data/defaultSettings');
var browserWrapper = require('./wrapper');

/**
 * Settings whose defaults can by managed by the system administrator
 */
var MANAGED_SETTINGS = ['hasSeenPostInstall'];
/**
 * Public api
 * Usage:
 * You can use promise callbacks to check readyness before getting and updating
 * settings.ready().then(() => settings.updateSetting('settingName', settingValue))
 */
var settings = {};
var isReady = false;
var _ready = init().then(function () {
  isReady = true;
  console.log('Settings are loaded');
});
function init() {
  return _init.apply(this, arguments);
}
function _init() {
  _init = _asyncToGenerator(function* () {
    buildSettingsFromDefaults();
    yield buildSettingsFromManagedStorage();
    yield buildSettingsFromLocalStorage();
  });
  return _init.apply(this, arguments);
}
function ready() {
  return _ready;
}

// Ensures we have cleared up old storage keys we have renamed
function checkForLegacyKeys() {
  var legacyKeys = {
    // Keys to migrate
    whitelisted: 'allowlisted',
    whitelistOptIn: 'allowlistOptIn',
    // Keys to remove
    advanced_options: null,
    clickToLoadClicks: null,
    cookieExcludeList: null,
    dev: null,
    ducky: null,
    extensionIsEnabled: null,
    failedUpgrades: null,
    last_search: null,
    lastsearch_enabled: null,
    meanings: null,
    safesearch: null,
    socialBlockingIsEnabled: null,
    totalUpgrades: null,
    trackerBlockingEnabled: null,
    use_post: null,
    version: null,
    zeroclick_google_right: null,
    'surrogates-etag': null,
    'brokenSiteList-etag': null,
    'surrogateList-etag': null,
    'trackersWhitelist-etag': null,
    'trackersWhitelistTemporary-etag': null
  };
  var syncNeeded = false;
  for (var legacyKey in legacyKeys) {
    var key = legacyKeys[legacyKey];
    if (!(legacyKey in settings)) {
      continue;
    }
    syncNeeded = true;
    var legacyValue = settings[legacyKey];
    if (key && legacyValue) {
      settings[key] = legacyValue;
    }
    delete settings[legacyKey];
  }
  if (syncNeeded) {
    syncSettingTolocalStorage();
  }
}
function buildSettingsFromLocalStorage() {
  return _buildSettingsFromLocalStorage.apply(this, arguments);
}
function _buildSettingsFromLocalStorage() {
  _buildSettingsFromLocalStorage = _asyncToGenerator(function* () {
    var results = yield browserWrapper.getFromStorage(['settings']);
    // copy over saved settings from storage
    if (!results) return;
    settings = browserWrapper.mergeSavedSettings(settings, results);
    checkForLegacyKeys();
  });
  return _buildSettingsFromLocalStorage.apply(this, arguments);
}
function buildSettingsFromManagedStorage() {
  return _buildSettingsFromManagedStorage.apply(this, arguments);
}
function _buildSettingsFromManagedStorage() {
  _buildSettingsFromManagedStorage = _asyncToGenerator(function* () {
    var results = yield browserWrapper.getFromManagedStorage(MANAGED_SETTINGS);
    settings = browserWrapper.mergeSavedSettings(settings, results);
  });
  return _buildSettingsFromManagedStorage.apply(this, arguments);
}
function buildSettingsFromDefaults() {
  // initial settings are a copy of default settings
  settings = Object.assign({}, defaultSettings);
}
function syncSettingTolocalStorage() {
  browserWrapper.syncToStorage({
    settings: settings
  });
}
function getSetting(name) {
  if (!isReady) {
    console.warn("Settings: getSetting() Settings not loaded: ".concat(name));
    return;
  }

  // let all and null return all settings
  if (name === 'all') name = null;
  if (name) {
    return settings[name];
  } else {
    return settings;
  }
}
function updateSetting(name, value) {
  if (!isReady) {
    console.warn("Settings: updateSetting() Setting not loaded: ".concat(name));
    return;
  }
  settings[name] = value;
  syncSettingTolocalStorage();
}
function removeSetting(name) {
  if (!isReady) {
    console.warn("Settings: removeSetting() Setting not loaded: ".concat(name));
    return;
  }
  if (settings[name]) {
    delete settings[name];
    syncSettingTolocalStorage();
  }
}
function logSettings() {
  browserWrapper.getFromStorage(['settings']).then(function (s) {
    console.log(s.settings);
  });
}
module.exports = {
  getSetting: getSetting,
  updateSetting: updateSetting,
  removeSetting: removeSetting,
  logSettings: logSettings,
  ready: ready
};

},{"../../data/defaultSettings":13,"./wrapper":21}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _dexie = _interopRequireDefault(require("dexie"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var load = require('./../load');
var constants = require('../../../data/constants');
var settings = require('./../settings');
var browserWrapper = require('./../wrapper');
var extensionConfig = require('./../../../data/bundled/extension-config.json');
var etags = require('../../../data/etags.json');
var configNames = constants.tdsLists.map(function (_ref) {
  var name = _ref.name;
  return name;
});

/**
 * @typedef {Object} TDSList
 * @property {string} name
 * @property {string} source
 * @property {string} url
 * @property {Record<string,string>} [channels]
 */
var TDSStorage = /*#__PURE__*/function () {
  function TDSStorage() {
    var _this = this;
    _classCallCheck(this, TDSStorage);
    this.dbc = new _dexie["default"]('tdsStorage');
    this.dbc.version(1).stores({
      tdsStorage: 'name,data'
    });
    this.table = this.dbc.table('tdsStorage');
    this.tds = {
      entities: {},
      trackers: {},
      domains: {},
      cnames: {}
    };
    this.surrogates = '';
    this.config = {
      features: {}
    };
    this.isInstalling = false;
    this._onUpdatedListeners = new Map();
    this._onReadyResolvers = new Map();
    this._onReadyPromises = new Map();
    var _iterator = _createForOfIteratorHelper(configNames),
      _step;
    try {
      var _loop = function _loop() {
        var configName = _step.value;
        _this._onReadyPromises.set(configName, new Promise(function (resolve) {
          _this._onReadyResolvers.set(configName, resolve);
        }));
      };
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }

      // Update the lists every half an hour.
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    this.updatePeriodInMinutes = 30;
    this.removeLegacyLists();
  }
  _createClass(TDSStorage, [{
    key: "initOnInstall",
    value: function () {
      var _initOnInstall = _asyncToGenerator(function* () {
        this.isInstalling = true;
        this._installingPromise = yield this._internalInitOnInstall();
        this.isInstalling = false;
      });
      function initOnInstall() {
        return _initOnInstall.apply(this, arguments);
      }
      return initOnInstall;
    }()
  }, {
    key: "_internalInitOnInstall",
    value: function () {
      var _internalInitOnInstall2 = _asyncToGenerator(function* () {
        yield settings.ready();
        var etagKey = 'config-etag';
        var etagValue = settings.getSetting(etagKey);
        // If there's an existing value ignore the bundled values
        if (!etagValue) {
          settings.updateSetting(etagKey, etags[etagKey]);
          this.config = extensionConfig;
          yield this.storeInLocalDB('config', extensionConfig);
        }
      });
      function _internalInitOnInstall() {
        return _internalInitOnInstall2.apply(this, arguments);
      }
      return _internalInitOnInstall;
    }()
  }, {
    key: "_internalOnListUpdate",
    value: function _internalOnListUpdate(configName, configValue) {
      var _this2 = this;
      return new Promise(function (resolve, reject) {
        self.setTimeout( /*#__PURE__*/_asyncToGenerator(function* () {
          // Ensure the onReady promise for this configuration is resolved.
          try {
            var readyResolve = _this2._onReadyResolvers.get(configName);
            if (readyResolve) {
              readyResolve();
              _this2._onReadyResolvers["delete"](configName);
            }

            // Check the current etag for this configuration, so that can be
            // passed to the listeners.
            var etag = settings.getSetting("".concat(configName, "-etag")) || '';

            // Notify any listeners that this list has updated.
            var listeners = _this2._onUpdatedListeners.get(configName);
            if (listeners) {
              var _iterator2 = _createForOfIteratorHelper(listeners.slice()),
                _step2;
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var listener = _step2.value;
                  yield listener(configName, etag, configValue);
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
            }
            resolve(null);
          } catch (e) {
            reject(e);
          }
        }), 0);
      });
    }
  }, {
    key: "getLists",
    value: function getLists() {
      var _this3 = this;
      var preferLocal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return Promise.all(constants.tdsLists.map( /*#__PURE__*/function () {
        var _ref3 = _asyncToGenerator(function* (list) {
          // Skip fetching the lists on extension startup if a new enough
          // local copy exists.
          if (preferLocal) {
            var lastUpdate = settings.getSetting("".concat(list.name, "-lastUpdate")) || 0;
            var millisecondsSinceUpdate = Date.now() - lastUpdate;
            if (millisecondsSinceUpdate < _this3.updatePeriodInMinutes * 60 * 1000) {
              var localList = yield _this3.getListFromLocalDB(list.name);
              if (localList) {
                return localList;
              }
            }
          }
          return yield _this3.getList(list);
        });
        return function (_x) {
          return _ref3.apply(this, arguments);
        };
      }()));
    }

    /**
     * @param {TDSList} list
     */
  }, {
    key: "getList",
    value: function () {
      var _getList = _asyncToGenerator(function* (list) {
        var _this4 = this;
        // If initOnInstall was called, await the updating from the local bundles before fetching
        if (this.isInstalling) {
          yield this._installingPromise;
        }
        /** @type {TDSList} */
        var listCopy = JSON.parse(JSON.stringify(list));
        var etag = settings.getSetting("".concat(listCopy.name, "-etag")) || '';
        var version = this.getVersionParam();
        var activeExperiment = settings.getSetting('activeExperiment');
        var channel = settings.getSetting("".concat(listCopy.name, "-channel")) || '';
        var experiment = '';
        if (activeExperiment) {
          experiment = settings.getSetting('experimentData');
        }

        // select custom version of the list from the config
        if (channel && listCopy.channels && listCopy.channels[channel]) {
          listCopy.url = listCopy.channels[channel];
        }

        // @ts-ignore
        if (experiment && experiment.listName === listCopy.name) {
          // @ts-ignore
          listCopy.url = experiment.url;
        }
        if (version && listCopy.source === 'external') {
          listCopy.url += version;
        }
        var source = listCopy.source ? listCopy.source : 'external';
        return this.getDataXHR(listCopy, etag, source).then(function (response) {
          // Set the lastUpdate time.
          // Notes:
          //  - Take the earliest time between server and local, that way if
          //    the local time is set far in the future updates will still
          //    happen.
          //  - Date.parse() returns NaN for invalid (or missing) Date
          //    headers, and Math.min() always considers NaN to be the
          //    smallest value. So before calling Math.min(), replace
          //    serverTime with localTime if serverTime is falsey (NaN).
          var localTime = Date.now();
          var serverTime = Date.parse(response.date);
          var updateTime = Math.min(localTime, serverTime || localTime);
          settings.updateSetting("".concat(listCopy.name, "-lastUpdate"), updateTime);

          // for 200 response we update etags
          if (response && response.status === 200) {
            var newEtag = response.etag || '';
            settings.updateSetting("".concat(listCopy.name, "-etag"), newEtag);
          }

          // We try to process both 200 and 304 responses. 200s will validate
          // and update the db. 304s will try to grab the previous data from db
          // or throw an error if none exists.
          return _this4.processData(listCopy.name, response.data).then(function (resultData) {
            if (resultData) {
              // store tds in memory so we can access it later if needed
              _this4[listCopy.name] = resultData;
              _this4._internalOnListUpdate(listCopy.name, resultData);
              return {
                name: listCopy.name,
                data: resultData
              };
            } else {
              throw new Error('TDS: process list xhr failed');
            }
          });
        })["catch"]( /*#__PURE__*/function () {
          var _ref4 = _asyncToGenerator(function* (e) {
            var result = yield _this4.getListFromLocalDB(listCopy.name);
            if (result) {
              return result;
            }

            // Reset the etag and lastUpdate time to force us to get
            // fresh server data in case of an error.
            settings.updateSetting("".concat(listCopy.name, "-etag"), '');
            settings.updateSetting("".concat(listCopy.name, "-lastUpdate"), '');
            throw new Error('TDS: data update failed');
          });
          return function (_x3) {
            return _ref4.apply(this, arguments);
          };
        }());
      });
      function getList(_x2) {
        return _getList.apply(this, arguments);
      }
      return getList;
    }()
  }, {
    key: "processData",
    value: function processData(name, xhrData) {
      if (xhrData) {
        var parsedData = this.parsedata(name, xhrData);
        this.storeInLocalDB(name, parsedData);
        return Promise.resolve(parsedData);
      } else {
        return Promise.resolve();
      }
    }
  }, {
    key: "getDataXHR",
    value: function getDataXHR(list, etag, source) {
      return load.loadExtensionFile({
        url: list.url,
        etag: etag,
        returnType: list.format,
        source: source,
        timeout: 60000
      });
    }
  }, {
    key: "getListFromLocalDB",
    value: function () {
      var _getListFromLocalDB = _asyncToGenerator(function* (name) {
        console.log('TDS: getting from db', name);
        try {
          yield this.dbc.open();
          var list = yield this.dbc.table('tdsStorage').get({
            name: name
          });
          if (list && list.data) {
            this[name] = list.data;
            this._internalOnListUpdate(name, list.data);
            return {
              name: name,
              data: list.data
            };
          }
        } catch (e) {
          console.warn("getListFromLocalDB failed for ".concat(name), e);
          return null;
        }
      });
      function getListFromLocalDB(_x4) {
        return _getListFromLocalDB.apply(this, arguments);
      }
      return getListFromLocalDB;
    }()
  }, {
    key: "storeInLocalDB",
    value: function storeInLocalDB(name, data) {
      return this.table.put({
        name: name,
        data: data
      })["catch"](function (e) {
        console.warn("storeInLocalDB failed for ".concat(name, ": resetting stored etag"), e);
        settings.updateSetting("".concat(name, "-etag"), '');
        settings.updateSetting("".concat(name, "-lastUpdate"), '');
      });
    }
  }, {
    key: "parsedata",
    value: function parsedata(name, data) {
      var parsers = {
        brokenSiteList: function brokenSiteList(dataIn) {
          return dataIn.trim().split('\n');
        }
      };
      if (parsers[name]) {
        return parsers[name](data);
      } else {
        return data;
      }
    }

    // add version param to url on the first install and only once a day after that
  }, {
    key: "getVersionParam",
    value: function getVersionParam() {
      var ONEDAY = 1000 * 60 * 60 * 24;
      var version = browserWrapper.getExtensionVersion();
      var lastTdsUpdate = settings.getSetting('lastTdsUpdate');
      var now = Date.now();
      var versionParam;

      // check delta for last update
      if (lastTdsUpdate) {
        // @ts-ignore
        var delta = now - new Date(lastTdsUpdate);
        if (delta > ONEDAY) {
          versionParam = "&v=".concat(version);
        }
      } else {
        versionParam = "&v=".concat(version);
      }
      if (versionParam) settings.updateSetting('lastTdsUpdate', now);
      return versionParam;
    }

    /**
     * Convert the given list into stringified form.
     * @param {*} name
     * @returns list in a fully serialisable format
     */
  }, {
    key: "getSerializableList",
    value: function getSerializableList(name) {
      var _this5 = this;
      if (name === 'tds') {
        // copy and convert regexes to string
        var listCopy = JSON.parse(JSON.stringify(this.tds));
        Object.values(listCopy.trackers).forEach(function (tracker) {
          var _tracker$rules;
          (_tracker$rules = tracker.rules) === null || _tracker$rules === void 0 ? void 0 : _tracker$rules.forEach(function (rule, i) {
            // convert Regex to string and cut slashes and flags
            var ruleRegexStr = _this5.tds.trackers[tracker.domain].rules[i].rule.toString();
            rule.rule = ruleRegexStr.slice(1, ruleRegexStr.length - 3);
          });
        });
        return listCopy;
      } else {
        return this[name];
      }
    }
  }, {
    key: "removeLegacyLists",
    value: function removeLegacyLists() {
      this.table["delete"]('ReferrerExcludeList');
      this.table["delete"]('brokenSiteList');
      this.table["delete"]('protections');
    }
  }, {
    key: "onUpdate",
    value: function onUpdate(name, listener) {
      var listeners = this._onUpdatedListeners.get(name);
      if (!listeners) {
        listeners = [];
        this._onUpdatedListeners.set(name, listeners);
      }
      listeners.push(listener);
    }
  }, {
    key: "ready",
    value: function ready(configName) {
      if (!configName) {
        return Promise.all(this._onReadyPromises.values());
      }
      var readyPromise = this._onReadyPromises.get(configName);
      if (!readyPromise) {
        throw new Error("Unknown configuration: ".concat(configName));
      }
      return readyPromise;
    }
  }]);
  return TDSStorage;
}();
var _default = new TDSStorage();
exports["default"] = _default;

},{"../../../data/constants":12,"../../../data/etags.json":14,"./../../../data/bundled/extension-config.json":11,"./../load":16,"./../settings":18,"./../wrapper":21,"dexie":4}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.brokenListIndex = brokenListIndex;
exports.extractHostFromURL = extractHostFromURL;
exports.extractLimitedDomainFromURL = extractLimitedDomainFromURL;
exports.extractTopSubdomainFromHost = extractTopSubdomainFromHost;
exports.findParent = findParent;
exports.findParentDisplayName = findParentDisplayName;
exports.getAsyncBlockingSupport = getAsyncBlockingSupport;
exports.getBaseDomain = getBaseDomain;
exports.getBrokenScriptLists = getBrokenScriptLists;
exports.getBrowserName = getBrowserName;
exports.getCurrentTab = getCurrentTab;
exports.getCurrentURL = getCurrentURL;
exports.getEnabledFeatures = getEnabledFeatures;
exports.getEnabledFeaturesAboutBlank = getEnabledFeaturesAboutBlank;
exports.getFeatureSettings = getFeatureSettings;
exports.getInstallTimestamp = getInstallTimestamp;
exports.getOsName = getOsName;
exports.getSessionKey = getSessionKey;
exports.getURLWithoutQueryString = getURLWithoutQueryString;
exports.getUpgradeToSecureSupport = getUpgradeToSecureSupport;
exports.isBroken = isBroken;
exports.isCookieExcluded = isCookieExcluded;
exports.isFeatureEnabled = isFeatureEnabled;
exports.isInstalledWithinDays = isInstalledWithinDays;
exports.isRedirect = isRedirect;
exports.isSafeListed = isSafeListed;
exports.isSameTopLevelDomain = isSameTopLevelDomain;
exports.parseVersionString = parseVersionString;
exports.reloadCurrentTab = reloadCurrentTab;
exports.removeBroken = removeBroken;
exports.resetSessionKey = resetSessionKey;
exports.satisfiesMinVersion = satisfiesMinVersion;
exports.sendAllTabsMessage = sendAllTabsMessage;
exports.sendTabMessage = sendTabMessage;
var _webextensionPolyfill = _interopRequireDefault(require("webextension-polyfill"));
var _wrapper = require("./wrapper");
var _tds = _interopRequireDefault(require("./storage/tds"));
var _settings = _interopRequireDefault(require("./settings"));
var tldts = _interopRequireWildcard(require("tldts"));
var _parseUserAgentString = _interopRequireDefault(require("../shared-utils/parse-user-agent-string"));
var _sha = _interopRequireDefault(require("../shared-utils/sha1"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var browserInfo = (0, _parseUserAgentString["default"])();

/**
 * Produce a random float, matches the output of Math.random() but much more cryptographically psudo-random.
 * @returns {number}
 */
function getRandomFloat() {
  return crypto.getRandomValues(new Uint32Array(1))[0] / Math.pow(2, 32);
}
function getSessionKey() {
  return _getSessionKey.apply(this, arguments);
}
function _getSessionKey() {
  _getSessionKey = _asyncToGenerator(function* () {
    var sessionKey = yield (0, _wrapper.getFromSessionStorage)('sessionKey');
    if (!sessionKey) {
      sessionKey = yield resetSessionKey();
    }
    return sessionKey;
  });
  return _getSessionKey.apply(this, arguments);
}
function resetSessionKey() {
  return _resetSessionKey.apply(this, arguments);
}
function _resetSessionKey() {
  _resetSessionKey = _asyncToGenerator(function* () {
    var sessionKey = (0, _sha["default"])(getRandomFloat().toString());
    yield (0, _wrapper.setToSessionStorage)('sessionKey', sessionKey);
    return sessionKey;
  });
  return _resetSessionKey.apply(this, arguments);
}
function sendTabMessage(_x, _x2, _x3) {
  return _sendTabMessage.apply(this, arguments);
}
function _sendTabMessage() {
  _sendTabMessage = _asyncToGenerator(function* (id, message, details) {
    try {
      yield _webextensionPolyfill["default"].tabs.sendMessage(id, message, details);
    } catch (_unused) {
      // Ignore errors
    }
  });
  return _sendTabMessage.apply(this, arguments);
}
function sendAllTabsMessage(_x4, _x5) {
  return _sendAllTabsMessage.apply(this, arguments);
}
/**
 * @param {string} urlString
 * @returns {string | null} etld plus one of the URL
 */
function _sendAllTabsMessage() {
  _sendAllTabsMessage = _asyncToGenerator(function* (message, details) {
    try {
      var _iterator = _createForOfIteratorHelper(yield _webextensionPolyfill["default"].tabs.query({})),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var tabId = _step.value.id;
          sendTabMessage(tabId, message, details);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } catch (_unused2) {
      // Ignore errors
    }
  });
  return _sendAllTabsMessage.apply(this, arguments);
}
function getBaseDomain(urlString) {
  var _parsedUrl$hostname;
  var parsedUrl = tldts.parse(urlString, {
    allowPrivateDomains: true
  });
  if (parsedUrl.hostname === 'localhost' || (_parsedUrl$hostname = parsedUrl.hostname) !== null && _parsedUrl$hostname !== void 0 && _parsedUrl$hostname.endsWith('.localhost') || parsedUrl.isIp) {
    return parsedUrl.hostname;
  }
  return parsedUrl.domain;
}
function extractHostFromURL(url, shouldKeepWWW) {
  if (!url) return '';

  // Tweak the URL for Firefox about:* pages to ensure that they are parsed
  // correctly. For example, 'about:example' becomes 'about://example'.
  if (url.startsWith('about:') && url[6] !== '/') {
    url = 'about://' + url.substr(6);
  }
  var urlObj = tldts.parse(url);
  var hostname = urlObj.hostname || '';
  if (!shouldKeepWWW) {
    hostname = hostname.replace(/^www\./, '');
  }
  return hostname;
}

// Removes information from a URL, such as path, user information, and optionally sub domains
// @ts-ignore
function extractLimitedDomainFromURL(url) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    keepSubdomains = _ref.keepSubdomains;
  if (!url) return undefined;
  try {
    var parsedURL = new URL(url);
    var tld = tldts.parse(url);
    if (!parsedURL || !tld) return '';
    // tld.domain is null if this is an IP or the domain does not use a known TLD (e.g. localhost)
    // in that case use the hostname (no truncation)
    var finalURL = tld.domain || tld.hostname;
    if (keepSubdomains) {
      finalURL = tld.hostname;
    } else if (tld.subdomain && tld.subdomain.toLowerCase() === 'www') {
      // This is a special case where if a domain requires 'www' to work
      // we keep it, even if we wouldn't normally keep subdomains.
      // note that even mutliple subdomains like www.something.domain.com has
      // subdomain of www.something, and wouldn't trigger this case.
      finalURL = 'www.' + tld.domain;
    }
    var port = parsedURL.port ? ":".concat(parsedURL.port) : '';
    return "".concat(parsedURL.protocol, "//").concat(finalURL).concat(port, "/");
  } catch (e) {
    // tried to parse invalid URL, such as an extension URL. In this case, don't modify anything
    return undefined;
  }
}
function extractTopSubdomainFromHost(host) {
  if (typeof host !== 'string') return false;
  var rgx = /\./g;
  // @ts-ignore
  if (host.match(rgx) && host.match(rgx).length > 1) {
    return host.split('.')[0];
  }
  return false;
}

// pull off subdomains and look for parent companies
function findParent(url) {
  var parts = extractHostFromURL(url).split('.');
  while (parts.length > 1) {
    var _tdsStorage$tds$track, _tdsStorage$tds$track2;
    var joinURL = parts.join('.');

    // check if tracker owner has 'ownedBy' to indicate a parent.
    if ((_tdsStorage$tds$track = _tds["default"].tds.trackers[joinURL]) !== null && _tdsStorage$tds$track !== void 0 && (_tdsStorage$tds$track2 = _tdsStorage$tds$track.owner) !== null && _tdsStorage$tds$track2 !== void 0 && _tdsStorage$tds$track2.ownedBy) {
      return _tds["default"].tds.trackers[joinURL].owner.ownedBy;
    } else if (_tds["default"].tds.domains[joinURL]) {
      return _tds["default"].tds.domains[joinURL];
    }
    parts.shift();
  }
}

/**
 * There are situations where we want to access the parent's displayName
 * only - for instance in the NewtabTrackerStats feature.
 * @param {string} url
 * @returns {string}
 */
function findParentDisplayName(url) {
  var parent = findParent(url);
  var entity = _tds["default"].tds.entities[parent];
  if (entity && entity.displayName) {
    return entity.displayName;
  }
  return 'unknown';
}
function getCurrentURL(callback) {
  _webextensionPolyfill["default"].tabs.query({
    active: true,
    lastFocusedWindow: true
  }).then(function (tabData) {
    if (tabData.length) {
      callback(tabData[0].url);
    }
  });
}
function getCurrentTab(_x6) {
  return _getCurrentTab.apply(this, arguments);
} // Browser / Version detection
// Get correct name for fetching UI assets
function _getCurrentTab() {
  _getCurrentTab = _asyncToGenerator(function* (callback) {
    var tabData = yield _webextensionPolyfill["default"].tabs.query({
      active: true,
      lastFocusedWindow: true
    });
    if (tabData.length) {
      return tabData[0];
    }
  });
  return _getCurrentTab.apply(this, arguments);
}
function getBrowserName() {
  if (!browserInfo || !browserInfo.browser) return;
  var browserName = browserInfo.browser.toLowerCase();
  if (browserName === 'firefox') browserName = 'moz';
  return browserName;
}
function getOsName() {
  if (!browserInfo || !browserInfo.os) return;
  return browserInfo.os;
}

// Determine if upgradeToSecure supported (Firefox 59+)
function getUpgradeToSecureSupport() {
  var canUpgrade = false;
  if (getBrowserName() !== 'moz') return canUpgrade;
  if (browserInfo && browserInfo.version >= 59) {
    canUpgrade = true;
  }
  return canUpgrade;
}

// return true if browser allows to handle request async
function getAsyncBlockingSupport() {
  var browserName = getBrowserName();
  if (browserName === 'moz' && browserInfo && browserInfo.version >= 52) {
    return true;
  } else if (['edg', 'edge', 'brave', 'chrome'].includes(browserName)) {
    return false;
  }
  console.warn("Unrecognized browser \"".concat(browserName, "\" - async response disallowed"));
  return false;
}

/**
 * @param {number} statusCode
 * @returns {boolean}
 */
function isRedirect(statusCode) {
  return statusCode >= 300 && statusCode <= 399;
}

/*
 * check to see if this is a broken site reported on github
*/
function isBroken(url) {
  if (!(_tds["default"] !== null && _tds["default"] !== void 0 && _tds["default"].config.unprotectedTemporary)) return;
  return brokenListIndex(url, _tds["default"] === null || _tds["default"] === void 0 ? void 0 : _tds["default"].config.unprotectedTemporary) !== -1;
}
function removeBroken(domain) {
  var index = brokenListIndex(domain, _tds["default"].config.unprotectedTemporary);
  if (index !== -1) {
    console.log('remove', _tds["default"].config.unprotectedTemporary.splice(index, 1));
  }
}
function getEnabledFeaturesAboutBlank(url) {
  if (!_tds["default"].config.features) return [];
  var enabledFeatures = [];
  for (var feature in _tds["default"].config.features) {
    var featureSettings = getFeatureSettings(feature);
    if (featureSettings.aboutBlankEnabled !== 'disabled' && brokenListIndex(url, featureSettings.aboutBlankSites || []) === -1) {
      enabledFeatures.push(feature);
    }
  }
  return enabledFeatures;
}
function getEnabledFeatures(url) {
  if (!_tds["default"].config.features) return [];
  var enabledFeatures = [];
  for (var feature in _tds["default"].config.features) {
    if (isFeatureEnabled(feature) && brokenListIndex(url, _tds["default"].config.features[feature].exceptions || []) === -1) {
      enabledFeatures.push(feature);
    }
  }
  return enabledFeatures;
}
function brokenListIndex(url, list) {
  var parsedDomain = tldts.parse(url);
  var hostname = parsedDomain.hostname || url;

  // If root domain in temp unprotected list, return true
  return list.findIndex(function (brokenSiteDomain) {
    if (brokenSiteDomain.domain) {
      return hostname === brokenSiteDomain.domain || hostname.endsWith(".".concat(brokenSiteDomain.domain));
    }
    return false;
  });
}

// We inject this into content scripts
function getBrokenScriptLists() {
  var brokenScripts = {};
  for (var key in _tds["default"].config.features) {
    var _featureSettings$scri;
    var featureSettings = getFeatureSettings(key);
    brokenScripts[key] = ((_featureSettings$scri = featureSettings.scripts) === null || _featureSettings$scri === void 0 ? void 0 : _featureSettings$scri.map(function (obj) {
      return obj.domain;
    })) || [];
  }
  return brokenScripts;
}

// return true if the given url is in the safelist. For checking if the current tab is in the safelist,
// tabManager.site.isProtectionEnabled() is the preferred method.
function isSafeListed(url) {
  var hostname = extractHostFromURL(url);
  var safeList = _settings["default"].getSetting('allowlisted');
  var subdomains = hostname.split('.');
  // Check user safe list
  // TODO make the same as brokenListIndex matching
  while (subdomains.length > 1) {
    if (safeList && safeList[subdomains.join('.')]) {
      return true;
    }
    subdomains.shift();
  }

  // Check broken sites
  if (isBroken(hostname)) {
    return true;
  }
  return false;
}
function isCookieExcluded(url) {
  var domain = new URL(url).host;
  return isDomainCookieExcluded(domain);
}
function isDomainCookieExcluded(domain) {
  var cookieSettings = getFeatureSettings('cookie');
  if (!cookieSettings || !cookieSettings.excludedCookieDomains) {
    return false;
  }
  if (cookieSettings.excludedCookieDomains.find(function (elem) {
    return elem.domain === domain;
  })) {
    return true;
  }
  var comps = domain.split('.');
  if (comps.length > 2) {
    comps.shift();
    return isDomainCookieExcluded(comps.join('.'));
  }
  return false;
}

/**
 * Tests whether the two URL's belong to the same
 * top level domain.
 */
function isSameTopLevelDomain(url1, url2) {
  var first = getBaseDomain(url1);
  var second = getBaseDomain(url2);
  if (!first || !second) {
    return false;
  }
  return first === second;
}
function parseVersionString(versionString) {
  var _versionString$split$ = versionString.split('.').map(Number),
    _versionString$split$2 = _slicedToArray(_versionString$split$, 3),
    _versionString$split$3 = _versionString$split$2[0],
    major = _versionString$split$3 === void 0 ? 0 : _versionString$split$3,
    _versionString$split$4 = _versionString$split$2[1],
    minor = _versionString$split$4 === void 0 ? 0 : _versionString$split$4,
    _versionString$split$5 = _versionString$split$2[2],
    patch = _versionString$split$5 === void 0 ? 0 : _versionString$split$5;
  return {
    major: major,
    minor: minor,
    patch: patch
  };
}
function satisfiesMinVersion(minVersionString, extensionVersionString) {
  var _parseVersionString = parseVersionString(minVersionString),
    minMajor = _parseVersionString.major,
    minMinor = _parseVersionString.minor,
    minPatch = _parseVersionString.patch;
  var _parseVersionString2 = parseVersionString(extensionVersionString),
    major = _parseVersionString2.major,
    minor = _parseVersionString2.minor,
    patch = _parseVersionString2.patch;
  return major > minMajor || major >= minMajor && minor > minMinor || major >= minMajor && minor >= minMinor && patch >= minPatch;
}

/**
 * Checks the config to see if a feature is enabled. You can optionally pass a second "customState"
 * parameter to check if the state is equeal to other states (i.e. state === 'beta').
 *
 * @param {String} featureName - the name of the feature
 * @returns {boolean} - if feature is enabled
 */
function isFeatureEnabled(featureName) {
  var feature = _tds["default"].config.features[featureName];
  if (!feature) {
    return false;
  }

  // If we have a supplied min version for the feature ensure the extension meets it
  if ('minSupportedVersion' in feature) {
    var extensionVersionString = (0, _wrapper.getExtensionVersion)();
    if (!satisfiesMinVersion(feature.minSupportedVersion, extensionVersionString)) {
      return false;
    }
  }
  return feature.state === 'enabled';
}

/**
 * Returns the settings object associated with featureName in the config
 *
 * @param {String} featureName - the name of the feature
 * @returns {Object} - Settings associated in the config with featureName
 */
function getFeatureSettings(featureName) {
  var feature = _tds["default"].config.features[featureName];
  if (_typeof(feature) !== 'object' || feature === null || !feature.settings) {
    return {};
  }
  return feature.settings;
}

/**
 * Strips off a query string from the URL
 * @param {string} urlString
 * @returns {string}
 */
function getURLWithoutQueryString(urlString) {
  return urlString === null || urlString === void 0 ? void 0 : urlString.split('?')[0];
}
function reloadCurrentTab() {
  return _reloadCurrentTab.apply(this, arguments);
}
function _reloadCurrentTab() {
  _reloadCurrentTab = _asyncToGenerator(function* () {
    var tab = yield getCurrentTab();
    if (tab && tab.id) {
      _webextensionPolyfill["default"].tabs.reload(tab.id);
    }
  });
  return _reloadCurrentTab.apply(this, arguments);
}
var dayMultiplier = 24 * 60 * 60 * 1000;

/**
 * Converts ATB value into date
 * @param {string} atb
 * @returns {number|null}
 */
function getInstallTimestamp(atb) {
  var match = atb.match(/^v?(\d+)-(\d)(.+)?$/i);
  if (!match) return null;
  var startDate = 1456272000000;
  var weeksSince = (parseInt(match[1], 10) - 1) * 7 * dayMultiplier;
  var daysSince = (parseInt(match[2], 10) - 1) * dayMultiplier;
  var installTimestamp = new Date(startDate + weeksSince + daysSince).getTime();
  return isNaN(installTimestamp) ? null : installTimestamp;
}

/**
 * Checks if the extension was installed within days of the from date
 * @param {number} numberOfDays
 * @param {number} [fromDate]
 * @param {string} [atb]
 * @returns {boolean}
 */
function isInstalledWithinDays(numberOfDays) {
  var fromDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Date.now();
  var atb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _settings["default"].getSetting('atb');
  if (!atb) return false;
  var installTimestamp = getInstallTimestamp(atb);
  // If we can't get the install date, assume it wasn't installed in time period
  if (!installTimestamp) return false;
  var daysInstalled = (fromDate - installTimestamp) / dayMultiplier;
  return daysInstalled <= numberOfDays;
}

},{"../shared-utils/parse-user-agent-string":22,"../shared-utils/sha1":23,"./settings":18,"./storage/tds":19,"./wrapper":21,"tldts":9,"webextension-polyfill":10}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeTabURL = changeTabURL;
exports.createAlarm = createAlarm;
exports.executeScript = executeScript;
exports.getDDGTabUrls = getDDGTabUrls;
exports.getExtensionId = getExtensionId;
exports.getExtensionURL = getExtensionURL;
exports.getExtensionVersion = getExtensionVersion;
exports.getFromManagedStorage = getFromManagedStorage;
exports.getFromSessionStorage = getFromSessionStorage;
exports.getFromStorage = getFromStorage;
exports.getManifestVersion = getManifestVersion;
exports.insertCSS = insertCSS;
exports.mergeSavedSettings = mergeSavedSettings;
exports.normalizeTabData = normalizeTabData;
exports.notifyPopup = notifyPopup;
exports.openExtensionPage = openExtensionPage;
exports.removeFromSessionStorage = removeFromSessionStorage;
exports.sessionStorageFallback = void 0;
exports.setActionIcon = setActionIcon;
exports.setToSessionStorage = setToSessionStorage;
exports.setUninstallURL = setUninstallURL;
exports.syncToStorage = syncToStorage;
var _webextensionPolyfill = _interopRequireDefault(require("webextension-polyfill"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function getExtensionURL(path) {
  return _webextensionPolyfill["default"].runtime.getURL(path);
}
function getExtensionVersion() {
  var manifest = _webextensionPolyfill["default"].runtime.getManifest();
  return manifest.version;
}
function openExtensionPage(path) {
  _webextensionPolyfill["default"].tabs.create({
    url: getExtensionURL(path)
  });
}

/**
 * @param {string} iconPath
 * @param {number} tabId
 * @returns {Promise<void>}
 */
function setActionIcon(_x, _x2) {
  return _setActionIcon.apply(this, arguments);
}
function _setActionIcon() {
  _setActionIcon = _asyncToGenerator(function* (iconPath, tabId) {
    if (typeof _webextensionPolyfill["default"].action === 'undefined') {
      return _webextensionPolyfill["default"].browserAction.setIcon({
        path: iconPath,
        tabId: tabId
      });
    }
    return _webextensionPolyfill["default"].action.setIcon({
      path: iconPath,
      tabId: tabId
    });
  });
  return _setActionIcon.apply(this, arguments);
}
function getManifestVersion() {
  var manifest = _webextensionPolyfill["default"].runtime.getManifest();
  return manifest.manifest_version;
}
function syncToStorage(data) {
  _webextensionPolyfill["default"].storage.local.set(data);
}

// @ts-ignore
function getFromStorage(_x3, _x4) {
  return _getFromStorage.apply(this, arguments);
} // @ts-ignore
function _getFromStorage() {
  _getFromStorage = _asyncToGenerator(function* (key, cb) {
    var result = yield _webextensionPolyfill["default"].storage.local.get(key);
    return result[key];
  });
  return _getFromStorage.apply(this, arguments);
}
function getFromManagedStorage(_x5, _x6) {
  return _getFromManagedStorage.apply(this, arguments);
}
function _getFromManagedStorage() {
  _getFromManagedStorage = _asyncToGenerator(function* (keys, cb) {
    try {
      return yield _webextensionPolyfill["default"].storage.managed.get(keys);
    } catch (e) {
      console.log('get managed failed', e);
    }
    return {};
  });
  return _getFromManagedStorage.apply(this, arguments);
}
function getExtensionId() {
  return _webextensionPolyfill["default"].runtime.id;
}
function notifyPopup(_x7) {
  return _notifyPopup.apply(this, arguments);
}
/**
 * @param {browser.WebRequest.OnBeforeRedirectDetailsType | browser.Tabs.Tab | browser.Tabs.OnUpdatedChangeInfoType} tabData
 * @returns {{tabId: number, url: string | undefined, requestId?: string, status: string | null | undefined}}
 */
function _notifyPopup() {
  _notifyPopup = _asyncToGenerator(function* (message) {
    try {
      yield _webextensionPolyfill["default"].runtime.sendMessage(message);
    } catch (_unused) {
      // Ignore this as can throw an error message when the popup is not open.
    }
  });
  return _notifyPopup.apply(this, arguments);
}
function normalizeTabData(tabData) {
  // @ts-expect-error - id doesn't exist onUpdatedChangeInfoType but we rectify in onCreateOrUpdateTab
  var tabId = 'tabId' in tabData ? tabData.tabId : tabData.id;
  var url = tabData.url;
  var status = 'status' in tabData ? tabData.status : null;
  var requestId = 'requestId' in tabData ? tabData.requestId : undefined;
  return {
    tabId: tabId,
    url: url,
    requestId: requestId,
    status: status
  };
}
function mergeSavedSettings(settings, results) {
  return Object.assign(settings, results);
}
function getDDGTabUrls() {
  return _getDDGTabUrls.apply(this, arguments);
}
function _getDDGTabUrls() {
  _getDDGTabUrls = _asyncToGenerator(function* () {
    var tabs = (yield _webextensionPolyfill["default"].tabs.query({
      url: 'https://*.duckduckgo.com/*'
    })) || [];
    tabs.forEach(function (tab) {
      insertCSS({
        target: {
          tabId: tab.id
        },
        files: ['/public/css/noatb.css']
      });
    });
    return tabs.map(function (tab) {
      return tab.url;
    });
  });
  return _getDDGTabUrls.apply(this, arguments);
}
function setUninstallURL(url) {
  _webextensionPolyfill["default"].runtime.setUninstallURL(url);
}
function changeTabURL(tabId, url) {
  return _webextensionPolyfill["default"].tabs.update(tabId, {
    url: url
  });
}
function convertScriptingAPIOptionsForTabsAPI(options) {
  if (_typeof(options) !== 'object') {
    throw new Error('Missing/invalid options Object.');
  }
  if (typeof options.file !== 'undefined' || typeof options.frameId !== 'undefined' || typeof options.runAt !== 'undefined' || typeof options.allFrames !== 'undefined' || typeof options.code !== 'undefined') {
    throw new Error('Please provide options compatible with the (MV3) scripting API, ' + 'instead of the (MV2) tabs API.');
  }
  if (typeof options.world !== 'undefined') {
    throw new Error('World targetting not supported by MV2.');
  }
  var _options$target = options.target,
    allFrames = _options$target.allFrames,
    frameIds = _options$target.frameIds,
    tabId = _options$target.tabId;
  delete options.target;
  if (Array.isArray(frameIds) && frameIds.length > 0) {
    if (frameIds.length > 1) {
      throw new Error('Targetting multiple frames by ID not supported by MV2.');
    }
    options.frameId = frameIds[0];
  }
  if (typeof options.files !== 'undefined') {
    if (Array.isArray(options.files) && options.files.length > 0) {
      if (options.files.length > 1) {
        throw new Error('Inserting multiple stylesheets/scripts in one go not supported by MV2.');
      }
      options.file = options.files[0];
    }
    delete options.files;
  }
  if (typeof allFrames !== 'undefined') {
    options.allFrames = allFrames;
  }
  if (typeof options.injectImmediately !== 'undefined') {
    if (options.injectImmediately) {
      options.runAt = 'document_start';
    }
    delete options.injectImmediately;
  }
  var stringifiedArgs = '';
  if (typeof options.args !== 'undefined') {
    if (Array.isArray(options.args)) {
      stringifiedArgs = '...' + JSON.stringify(options.args);
    }
    delete options.args;
  }
  if (typeof options.func !== 'undefined') {
    if (typeof options.func === 'function') {
      options.code = '(' + options.func.toString() + ')(' + stringifiedArgs + ')';
    }
    delete options.func;
  }
  return [tabId, options];
}

/**
 * Execute a script/function in the target tab.
 * This is a wrapper around tabs.executeScript (MV2) and
 * scripting.executeScript (MV3). Arguments are expected in the
 * scripting.executeScript[1] format.
 * Notes:
 *   - Instead of passing the `code` option (JavaScript string to execute), pass
 *     the `func` option (JavaScript function to execute).
 *   - Some features are not supported in MV2, including targetting multiple
 *     specific frames and targetting execution 'world'.
 * 1 - https://developer.chrome.com/docs/extensions/reference/scripting/#method-executeScript
 * @param {object} options
 *   Script injection options.
 * @returns {Promise<*>}
 */
function executeScript(_x8) {
  return _executeScript.apply(this, arguments);
}
/**
 * Insert CSS in the target tab.
 * This is a wrapper around tabs.insertCSS (MV2) and scripting.insertCSS (MV3).
 * Arguments are expected in the scripting.insertCSS[1] format.
 * Notes:
 *   - Some features are not supported in MV2, including targetting multiple
 *     specific frames and targetting execution 'world'.
 * 1 - https://developer.chrome.com/docs/extensions/reference/scripting/#method-insertCSS
 * @param {object} options
 *   CSS insertion options.
 */
function _executeScript() {
  _executeScript = _asyncToGenerator(function* (options) {
    if (typeof _webextensionPolyfill["default"].scripting === 'undefined') {
      var _browser$tabs;
      return yield (_browser$tabs = _webextensionPolyfill["default"].tabs).executeScript.apply(_browser$tabs, _toConsumableArray(convertScriptingAPIOptionsForTabsAPI(options)));
    }
    return yield _webextensionPolyfill["default"].scripting.executeScript(options);
  });
  return _executeScript.apply(this, arguments);
}
function insertCSS(_x9) {
  return _insertCSS.apply(this, arguments);
} // Session storage
// @ts-ignore
function _insertCSS() {
  _insertCSS = _asyncToGenerator(function* (options) {
    if (typeof _webextensionPolyfill["default"].scripting === 'undefined') {
      var _browser$tabs2;
      return yield (_browser$tabs2 = _webextensionPolyfill["default"].tabs).insertCSS.apply(_browser$tabs2, _toConsumableArray(convertScriptingAPIOptionsForTabsAPI(options)));
    }
    return yield _webextensionPolyfill["default"].scripting.insertCSS(options);
  });
  return _insertCSS.apply(this, arguments);
}
var sessionStorageSupported = typeof _webextensionPolyfill["default"].storage.session !== 'undefined';
var sessionStorageFallback = sessionStorageSupported ? null : new Map();

/**
 * Save some data to memory, which persists until the session ends (e.g. until
 * the browser is closed).
 * Note: There is a quota for how much data can be stored in memory. At the time
 *       of writing that was about 1 megabyte. Attempting to write more data
 *       than this will result in an error. For large values, please use
 *       `syncToStorage` (browser.storage.local) instead.
 *       See https://developer.chrome.com/docs/extensions/reference/storage/#property-session-session-QUOTA_BYTES
 * @param {string} key
 *   The storage key to write to.
 * @param {*} data
 *   The value to write.
 * @return {Promise<undefined>}
 */
exports.sessionStorageFallback = sessionStorageFallback;
function setToSessionStorage(_x10, _x11) {
  return _setToSessionStorage.apply(this, arguments);
}
/**
 * Retrieve a value from memory.
 * @param {string} key
 *   The storage key to retrieve.
 * @return {Promise<*>}
 *   The retrieved value.
 */
function _setToSessionStorage() {
  _setToSessionStorage = _asyncToGenerator(function* (key, data) {
    if (typeof key !== 'string') {
      throw new Error('Invalid storage key, string expected.');
    }
    if (sessionStorageSupported) {
      // @ts-ignore
      return yield _webextensionPolyfill["default"].storage.session.set(_defineProperty({}, key, data));
    }

    // @ts-ignore - TS doesn't know it is a Map
    sessionStorageFallback.set(key, data);
  });
  return _setToSessionStorage.apply(this, arguments);
}
function getFromSessionStorage(_x12) {
  return _getFromSessionStorage.apply(this, arguments);
}
/**
 * Removes a value from memory.
 * @param {string} key
 *   The storage key to remove.
 * @return {Promise<undefined>}
 */
function _getFromSessionStorage() {
  _getFromSessionStorage = _asyncToGenerator(function* (key) {
    if (typeof key !== 'string') {
      throw new Error('Invalid storage key, string expected.');
    }
    if (sessionStorageSupported) {
      // @ts-ignore
      var result = yield _webextensionPolyfill["default"].storage.session.get([key]);
      return result[key];
    }

    // @ts-ignore
    return sessionStorageFallback.get(key);
  });
  return _getFromSessionStorage.apply(this, arguments);
}
function removeFromSessionStorage(_x13) {
  return _removeFromSessionStorage.apply(this, arguments);
}
/**
 * Create an alarm, taking care to check it doesn't exist first.
 * See https://stackoverflow.com/questions/66391018/how-do-i-call-a-function-periodically-in-a-manifest-v3-chrome-extension/66391601#66391601
 * @param {string} name
 *   The alarm name.
 * @param {Object} alarmInfo
 *   Details that determine when the alarm should fire.
 *   See https://developer.chrome.com/docs/extensions/reference/alarms/#type-AlarmCreateInfo
 * @return {Promise}
 */
function _removeFromSessionStorage() {
  _removeFromSessionStorage = _asyncToGenerator(function* (key) {
    if (typeof key !== 'string') {
      throw new Error('Invalid storage key, string expected.');
    }
    if (sessionStorageSupported) {
      // @ts-ignore
      return yield _webextensionPolyfill["default"].storage.session.remove(key);
    }

    // @ts-ignore
    return sessionStorageFallback["delete"](key);
  });
  return _removeFromSessionStorage.apply(this, arguments);
}
function createAlarm(_x14, _x15) {
  return _createAlarm.apply(this, arguments);
}
function _createAlarm() {
  _createAlarm = _asyncToGenerator(function* (name, alarmInfo) {
    var existingAlarm = yield _webextensionPolyfill["default"].alarms.get(name);
    if (!existingAlarm) {
      return yield _webextensionPolyfill["default"].alarms.create(name, alarmInfo);
    }
  });
  return _createAlarm.apply(this, arguments);
}

},{"webextension-polyfill":10}],22:[function(require,module,exports){
"use strict";

module.exports = function (uaString) {
  if (!globalThis.navigator) return;
  if (!uaString) uaString = globalThis.navigator.userAgent;
  var browser;
  var version;
  try {
    var parsedUaParts = uaString.match(/(Firefox|Chrome|Edg)\/([0-9]+)/);
    var isEdge = /(Edge?)\/([0-9]+)/;
    var isOpera = /(OPR)\/([0-9]+)/;
    // Above regex matches on Chrome first, so check if this is really Edge
    if (uaString.match(isEdge)) {
      parsedUaParts = uaString.match(isEdge);
    } else if (uaString.match(isOpera)) {
      parsedUaParts = uaString.match(isOpera);
      parsedUaParts[1] = 'Opera';
    }
    browser = parsedUaParts[1];
    version = parsedUaParts[2];

    // Brave doesn't include any information in the UserAgent
    // @ts-ignore
    if (globalThis.navigator.brave) {
      browser = 'Brave';
    }
  } catch (e) {
    // unlikely, prevent extension from exploding if we don't recognize the UA
    browser = version = '';
  }
  var os = 'o';
  if (globalThis.navigator.userAgent.indexOf('Windows') !== -1) os = 'w';
  if (globalThis.navigator.userAgent.indexOf('Mac') !== -1) os = 'm';
  if (globalThis.navigator.userAgent.indexOf('Linux') !== -1) os = 'l';
  return {
    os: os,
    browser: browser,
    version: version
  };
};

},{}],23:[function(require,module,exports){
(function (process,global){(function (){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/* eslint-disable */
// @ts-nocheck
/*
 * [js-sha1]{@link https://github.com/emn178/js-sha1}
 *
 * @version 0.6.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
  'use strict';

  var root = (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' ? window : {};
  var NODE_JS = !root.JS_SHA1_NO_NODE_JS && (typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  }
  var COMMON_JS = !root.JS_SHA1_NO_COMMON_JS && (typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && module.exports;
  var AMD = typeof define === 'function' && define.amd;
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [-2147483648, 8388608, 32768, 128];
  var SHIFT = [24, 16, 8, 0];
  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];
  var blocks = [];
  var createOutputMethod = function createOutputMethod(outputType) {
    return function (message) {
      return new Sha1(true).update(message)[outputType]();
    };
  };
  var createMethod = function createMethod() {
    var method = createOutputMethod('hex');
    if (NODE_JS) {
      method = nodeWrap(method);
    }
    method.create = function () {
      return new Sha1();
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(type);
    }
    return method;
  };
  var nodeWrap = function nodeWrap(method) {
    var crypto = eval("require('crypto')");
    var Buffer = eval("require('buffer').Buffer");
    var nodeMethod = function nodeMethod(message) {
      if (typeof message === 'string') {
        return crypto.createHash('sha1').update(message, 'utf8').digest('hex');
      } else if (message.constructor === ArrayBuffer) {
        message = new Uint8Array(message);
      } else if (message.length === undefined) {
        return method(message);
      }
      return crypto.createHash('sha1').update(new Buffer(message)).digest('hex');
    };
    return nodeMethod;
  };
  function Sha1(sharedMemory) {
    if (sharedMemory) {
      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      this.blocks = blocks;
    } else {
      this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    this.h0 = 0x67452301;
    this.h1 = 0xEFCDAB89;
    this.h2 = 0x98BADCFE;
    this.h3 = 0x10325476;
    this.h4 = 0xC3D2E1F0;
    this.block = this.start = this.bytes = this.hBytes = 0;
    this.finalized = this.hashed = false;
    this.first = true;
  }
  Sha1.prototype.update = function (message) {
    if (this.finalized) {
      return;
    }
    var notString = typeof message !== 'string';
    if (notString && message.constructor === root.ArrayBuffer) {
      message = new Uint8Array(message);
    }
    var code,
      index = 0,
      i,
      length = message.length || 0,
      blocks = this.blocks;
    while (index < length) {
      if (this.hashed) {
        this.hashed = false;
        blocks[0] = this.block;
        blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      }
      if (notString) {
        for (i = this.start; index < length && i < 64; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < 64; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | code >> 6) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | code >> 12) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | code >> 6 & 0x3f) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + ((code & 0x3ff) << 10 | message.charCodeAt(++index) & 0x3ff);
            blocks[i >> 2] |= (0xf0 | code >> 18) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | code >> 12 & 0x3f) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | code >> 6 & 0x3f) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
          }
        }
      }
      this.lastByteIndex = i;
      this.bytes += i - this.start;
      if (i >= 64) {
        this.block = blocks[16];
        this.start = i - 64;
        this.hash();
        this.hashed = true;
      } else {
        this.start = i;
      }
    }
    if (this.bytes > 4294967295) {
      this.hBytes += this.bytes / 4294967296 << 0;
      this.bytes = this.bytes % 4294967296;
    }
    return this;
  };
  Sha1.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks,
      i = this.lastByteIndex;
    blocks[16] = this.block;
    blocks[i >> 2] |= EXTRA[i & 3];
    this.block = blocks[16];
    if (i >= 56) {
      if (!this.hashed) {
        this.hash();
      }
      blocks[0] = this.block;
      blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    }
    blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
    blocks[15] = this.bytes << 3;
    this.hash();
  };
  Sha1.prototype.hash = function () {
    var a = this.h0,
      b = this.h1,
      c = this.h2,
      d = this.h3,
      e = this.h4;
    var f,
      j,
      t,
      blocks = this.blocks;
    for (j = 16; j < 80; ++j) {
      t = blocks[j - 3] ^ blocks[j - 8] ^ blocks[j - 14] ^ blocks[j - 16];
      blocks[j] = t << 1 | t >>> 31;
    }
    for (j = 0; j < 20; j += 5) {
      f = b & c | ~b & d;
      t = a << 5 | a >>> 27;
      e = t + f + e + 1518500249 + blocks[j] << 0;
      b = b << 30 | b >>> 2;
      f = a & b | ~a & c;
      t = e << 5 | e >>> 27;
      d = t + f + d + 1518500249 + blocks[j + 1] << 0;
      a = a << 30 | a >>> 2;
      f = e & a | ~e & b;
      t = d << 5 | d >>> 27;
      c = t + f + c + 1518500249 + blocks[j + 2] << 0;
      e = e << 30 | e >>> 2;
      f = d & e | ~d & a;
      t = c << 5 | c >>> 27;
      b = t + f + b + 1518500249 + blocks[j + 3] << 0;
      d = d << 30 | d >>> 2;
      f = c & d | ~c & e;
      t = b << 5 | b >>> 27;
      a = t + f + a + 1518500249 + blocks[j + 4] << 0;
      c = c << 30 | c >>> 2;
    }
    for (; j < 40; j += 5) {
      f = b ^ c ^ d;
      t = a << 5 | a >>> 27;
      e = t + f + e + 1859775393 + blocks[j] << 0;
      b = b << 30 | b >>> 2;
      f = a ^ b ^ c;
      t = e << 5 | e >>> 27;
      d = t + f + d + 1859775393 + blocks[j + 1] << 0;
      a = a << 30 | a >>> 2;
      f = e ^ a ^ b;
      t = d << 5 | d >>> 27;
      c = t + f + c + 1859775393 + blocks[j + 2] << 0;
      e = e << 30 | e >>> 2;
      f = d ^ e ^ a;
      t = c << 5 | c >>> 27;
      b = t + f + b + 1859775393 + blocks[j + 3] << 0;
      d = d << 30 | d >>> 2;
      f = c ^ d ^ e;
      t = b << 5 | b >>> 27;
      a = t + f + a + 1859775393 + blocks[j + 4] << 0;
      c = c << 30 | c >>> 2;
    }
    for (; j < 60; j += 5) {
      f = b & c | b & d | c & d;
      t = a << 5 | a >>> 27;
      e = t + f + e - 1894007588 + blocks[j] << 0;
      b = b << 30 | b >>> 2;
      f = a & b | a & c | b & c;
      t = e << 5 | e >>> 27;
      d = t + f + d - 1894007588 + blocks[j + 1] << 0;
      a = a << 30 | a >>> 2;
      f = e & a | e & b | a & b;
      t = d << 5 | d >>> 27;
      c = t + f + c - 1894007588 + blocks[j + 2] << 0;
      e = e << 30 | e >>> 2;
      f = d & e | d & a | e & a;
      t = c << 5 | c >>> 27;
      b = t + f + b - 1894007588 + blocks[j + 3] << 0;
      d = d << 30 | d >>> 2;
      f = c & d | c & e | d & e;
      t = b << 5 | b >>> 27;
      a = t + f + a - 1894007588 + blocks[j + 4] << 0;
      c = c << 30 | c >>> 2;
    }
    for (; j < 80; j += 5) {
      f = b ^ c ^ d;
      t = a << 5 | a >>> 27;
      e = t + f + e - 899497514 + blocks[j] << 0;
      b = b << 30 | b >>> 2;
      f = a ^ b ^ c;
      t = e << 5 | e >>> 27;
      d = t + f + d - 899497514 + blocks[j + 1] << 0;
      a = a << 30 | a >>> 2;
      f = e ^ a ^ b;
      t = d << 5 | d >>> 27;
      c = t + f + c - 899497514 + blocks[j + 2] << 0;
      e = e << 30 | e >>> 2;
      f = d ^ e ^ a;
      t = c << 5 | c >>> 27;
      b = t + f + b - 899497514 + blocks[j + 3] << 0;
      d = d << 30 | d >>> 2;
      f = c ^ d ^ e;
      t = b << 5 | b >>> 27;
      a = t + f + a - 899497514 + blocks[j + 4] << 0;
      c = c << 30 | c >>> 2;
    }
    this.h0 = this.h0 + a << 0;
    this.h1 = this.h1 + b << 0;
    this.h2 = this.h2 + c << 0;
    this.h3 = this.h3 + d << 0;
    this.h4 = this.h4 + e << 0;
  };
  Sha1.prototype.hex = function () {
    this.finalize();
    var h0 = this.h0,
      h1 = this.h1,
      h2 = this.h2,
      h3 = this.h3,
      h4 = this.h4;
    return HEX_CHARS[h0 >> 28 & 0x0F] + HEX_CHARS[h0 >> 24 & 0x0F] + HEX_CHARS[h0 >> 20 & 0x0F] + HEX_CHARS[h0 >> 16 & 0x0F] + HEX_CHARS[h0 >> 12 & 0x0F] + HEX_CHARS[h0 >> 8 & 0x0F] + HEX_CHARS[h0 >> 4 & 0x0F] + HEX_CHARS[h0 & 0x0F] + HEX_CHARS[h1 >> 28 & 0x0F] + HEX_CHARS[h1 >> 24 & 0x0F] + HEX_CHARS[h1 >> 20 & 0x0F] + HEX_CHARS[h1 >> 16 & 0x0F] + HEX_CHARS[h1 >> 12 & 0x0F] + HEX_CHARS[h1 >> 8 & 0x0F] + HEX_CHARS[h1 >> 4 & 0x0F] + HEX_CHARS[h1 & 0x0F] + HEX_CHARS[h2 >> 28 & 0x0F] + HEX_CHARS[h2 >> 24 & 0x0F] + HEX_CHARS[h2 >> 20 & 0x0F] + HEX_CHARS[h2 >> 16 & 0x0F] + HEX_CHARS[h2 >> 12 & 0x0F] + HEX_CHARS[h2 >> 8 & 0x0F] + HEX_CHARS[h2 >> 4 & 0x0F] + HEX_CHARS[h2 & 0x0F] + HEX_CHARS[h3 >> 28 & 0x0F] + HEX_CHARS[h3 >> 24 & 0x0F] + HEX_CHARS[h3 >> 20 & 0x0F] + HEX_CHARS[h3 >> 16 & 0x0F] + HEX_CHARS[h3 >> 12 & 0x0F] + HEX_CHARS[h3 >> 8 & 0x0F] + HEX_CHARS[h3 >> 4 & 0x0F] + HEX_CHARS[h3 & 0x0F] + HEX_CHARS[h4 >> 28 & 0x0F] + HEX_CHARS[h4 >> 24 & 0x0F] + HEX_CHARS[h4 >> 20 & 0x0F] + HEX_CHARS[h4 >> 16 & 0x0F] + HEX_CHARS[h4 >> 12 & 0x0F] + HEX_CHARS[h4 >> 8 & 0x0F] + HEX_CHARS[h4 >> 4 & 0x0F] + HEX_CHARS[h4 & 0x0F];
  };
  Sha1.prototype.toString = Sha1.prototype.hex;
  Sha1.prototype.digest = function () {
    this.finalize();
    var h0 = this.h0,
      h1 = this.h1,
      h2 = this.h2,
      h3 = this.h3,
      h4 = this.h4;
    return [h0 >> 24 & 0xFF, h0 >> 16 & 0xFF, h0 >> 8 & 0xFF, h0 & 0xFF, h1 >> 24 & 0xFF, h1 >> 16 & 0xFF, h1 >> 8 & 0xFF, h1 & 0xFF, h2 >> 24 & 0xFF, h2 >> 16 & 0xFF, h2 >> 8 & 0xFF, h2 & 0xFF, h3 >> 24 & 0xFF, h3 >> 16 & 0xFF, h3 >> 8 & 0xFF, h3 & 0xFF, h4 >> 24 & 0xFF, h4 >> 16 & 0xFF, h4 >> 8 & 0xFF, h4 & 0xFF];
  };
  Sha1.prototype.array = Sha1.prototype.digest;
  Sha1.prototype.arrayBuffer = function () {
    this.finalize();
    var buffer = new ArrayBuffer(20);
    var dataView = new DataView(buffer);
    dataView.setUint32(0, this.h0);
    dataView.setUint32(4, this.h1);
    dataView.setUint32(8, this.h2);
    dataView.setUint32(12, this.h3);
    dataView.setUint32(16, this.h4);
    return buffer;
  };
  var exports = createMethod();
  if (COMMON_JS) {
    module.exports = exports;
  } else {
    root.sha1 = exports;
    if (AMD) {
      define(function () {
        return exports;
      });
    }
  }
})();

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":7}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendMessage = exports.openExtensionPage = exports.getExtensionURL = exports.backgroundMessage = void 0;
var _webextensionPolyfill = _interopRequireDefault(require("webextension-polyfill"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var sendMessage = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (messageType, options) {
    return yield _webextensionPolyfill["default"].runtime.sendMessage({
      messageType: messageType,
      options: options
    });
  });
  return function sendMessage(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.sendMessage = sendMessage;
var backgroundMessage = function backgroundMessage(thisModel) {
  // listen for messages from background and
  // // notify subscribers
  _webextensionPolyfill["default"].runtime.onMessage.addListener(function (req, sender) {
    if (sender.id !== _webextensionPolyfill["default"].runtime.id) return;
    if (req.updateTabData) thisModel.send('updateTabData');
    if (req.didResetTrackersData) thisModel.send('didResetTrackersData', req.didResetTrackersData);
    if (req.closePopup) window.close();
  });
};
exports.backgroundMessage = backgroundMessage;
var getExtensionURL = function getExtensionURL(path) {
  return _webextensionPolyfill["default"].runtime.getURL(path);
};
exports.getExtensionURL = getExtensionURL;
var openExtensionPage = function openExtensionPage(path) {
  _webextensionPolyfill["default"].tabs.create({
    url: getExtensionURL(path)
  });
};
exports.openExtensionPage = openExtensionPage;

},{"webextension-polyfill":10}],25:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.Model;
var tldts = require('tldts');
function Allowlist(attrs) {
  attrs.list = {};
  Parent.call(this, attrs);
  this.setAllowlistFromSettings();
}
Allowlist.prototype = window.$.extend({}, Parent.prototype, {
  modelName: 'allowlist',
  removeDomain: function removeDomain(itemIndex) {
    var domain = this.list[itemIndex];
    console.log("allowlist: remove ".concat(domain));
    this.sendMessage('setList', {
      list: 'allowlisted',
      domain: domain,
      value: false
    });
    // Remove domain allowlist opt-in status, if present
    this.sendMessage('allowlistOptIn', {
      list: 'allowlistOptIn',
      domain: domain,
      value: false
    });

    // Update list
    // use splice() so it reindexes the array
    this.list.splice(itemIndex, 1);
  },
  addDomain: function addDomain(url) {
    // We only allowlist domains, not full URLs:
    // - use getDomain, it will return null if the URL is invalid
    // - prefix with getSubDomain, which returns an empty string if none is found
    // But first, strip the 'www.' part, otherwise getSubDomain will include it
    // and allowlisting won't work for that site
    url = url ? url.replace(/^www\./, '') : '';
    var parsedDomain = tldts.parse(url);
    var localDomain = url.match(/^localhost(:[0-9]+)?$/i) ? 'localhost' : null;
    var subDomain = parsedDomain.subdomain;
    var domain = localDomain || (parsedDomain.isIp ? parsedDomain.hostname : parsedDomain.domain);
    if (domain) {
      var domainToAllowlist = subDomain ? subDomain + '.' + domain : domain;
      console.log("allowlist: add ".concat(domainToAllowlist));
      this.sendMessage('setList', {
        list: 'allowlisted',
        domain: domainToAllowlist,
        value: true
      });
      this.setAllowlistFromSettings();
    }
    return domain;
  },
  setAllowlistFromSettings: function setAllowlistFromSettings() {
    var self = this;
    this.sendMessage('getSetting', {
      name: 'allowlisted'
    }).then(function (allowlist) {
      allowlist = allowlist || {};
      var wlist = Object.keys(allowlist);
      wlist.sort();

      // Publish allowlist change notification via the store
      // used to know when to rerender the view
      self.set('list', wlist);
    });
  }
});
module.exports = Allowlist;

},{"tldts":9}],26:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.Model;
var browserUIWrapper = require('./../base/ui-wrapper.js');

/**
 * Background messaging is done via two methods:
 *
 * 1. Passive messages from background -> backgroundMessage model -> subscribing model
 *
 *  The background sends these messages using chrome.runtime.sendMessage({'name': 'value'})
 *  The backgroundMessage model (here) receives the message and forwards the
 *  it to the global event store via model.send(msg)
 *  Other modules that are subscribed to state changes in backgroundMessage are notified
 *
 * 2. Two-way messaging using this.model.sendMessage() as a passthrough
 *
 *  Each model can use a sendMessage method to send and receive a response from the background.
 *  Ex: this.model.sendMessage('name', { ... }).then((response) => console.log(response))
 *  Listeners must be registered in the background to respond to messages with this 'name'.
 *
 *  The common sendMessage method is defined in base/model.js
 */
function BackgroundMessage(attrs) {
  Parent.call(this, attrs);
  var thisModel = this;
  browserUIWrapper.backgroundMessage(thisModel);
}
BackgroundMessage.prototype = window.$.extend({}, Parent.prototype, {
  modelName: 'backgroundMessage'
});
module.exports = BackgroundMessage;

},{"./../base/ui-wrapper.js":24}],27:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var Parent = window.DDG.base.Model;
function PrivacyOptions(attrs) {
  // set some default values for the toggle switches in the template
  attrs.httpsEverywhereEnabled = true;
  attrs.embeddedTweetsEnabled = false;
  attrs.GPC = false;
  attrs.youtubeClickToLoadEnabled = false;
  attrs.youtubePreviewsEnabled = false;
  Parent.call(this, attrs);
}
PrivacyOptions.prototype = window.$.extend({}, Parent.prototype, {
  modelName: 'privacyOptions',
  toggle: function toggle(k) {
    if (Object.hasOwnProperty.call(this, k)) {
      this[k] = !this[k];
      console.log("PrivacyOptions model toggle ".concat(k, " is now ").concat(this[k]));
      this.sendMessage('updateSetting', {
        name: k,
        value: this[k]
      });
    }
  },
  getState: function getState() {
    var _this = this;
    return _asyncToGenerator(function* () {
      var _yield$Promise$all = yield Promise.all([_this.sendMessage('getSetting', 'all'), _this.sendMessage('isClickToLoadYoutubeEnabled')]),
        _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2),
        settings = _yield$Promise$all2[0],
        youtubeClickToLoadEnabled = _yield$Promise$all2[1];
      _this.httpsEverywhereEnabled = settings.httpsEverywhereEnabled;
      _this.embeddedTweetsEnabled = settings.embeddedTweetsEnabled;
      _this.GPC = settings.GPC;
      _this.youtubeClickToLoadEnabled = youtubeClickToLoadEnabled;
      _this.youtubePreviewsEnabled = settings.youtubePreviewsEnabled;
    })();
  }
});
module.exports = PrivacyOptions;

},{}],28:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.Model;
function UserData(attrs) {
  Parent.call(this, attrs);
  this.setUserDataFromSettings();
}
UserData.prototype = window.$.extend({}, Parent.prototype, {
  modelName: 'userData',
  logout: function logout() {
    var _this = this;
    this.sendMessage('logout').then(function () {
      return _this.set('userName', null);
    });
  },
  setUserDataFromSettings: function setUserDataFromSettings() {
    var _this2 = this;
    this.sendMessage('getSetting', {
      name: 'userData'
    }).then(function (data) {
      return _this2.set('userName', data === null || data === void 0 ? void 0 : data.userName);
    });
  }
});
module.exports = UserData;

},{}],29:[function(require,module,exports){
"use strict";

module.exports = {
  setBrowserClassOnBodyTag: require('./set-browser-class.js'),
  parseQueryString: require('./parse-query-string.js')
};

},{"./parse-query-string.js":30,"./set-browser-class.js":31}],30:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
module.exports = {
  parseQueryString: function parseQueryString(qs) {
    if (typeof qs !== 'string') {
      throw new Error('tried to parse a non-string query string');
    }
    var parsed = {};
    if (qs[0] === '?') {
      qs = qs.substr(1);
    }
    var parts = qs.split('&');
    parts.forEach(function (part) {
      var _part$split = part.split('='),
        _part$split2 = _slicedToArray(_part$split, 2),
        key = _part$split2[0],
        val = _part$split2[1];
      if (key && val) {
        parsed[key] = val;
      }
    });
    return parsed;
  }
};

},{}],31:[function(require,module,exports){
"use strict";

module.exports = {
  setBrowserClassOnBodyTag: function setBrowserClassOnBodyTag() {
    window.chrome.runtime.sendMessage({
      messageType: 'getBrowser'
    }, function (browserName) {
      if (['edg', 'edge', 'brave'].includes(browserName)) {
        browserName = 'chrome';
      }
      var browserClass = 'is-browser--' + browserName;
      window.$('html').addClass(browserClass);
      window.$('body').addClass(browserClass);
    });
  }
};

},{}],32:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.Page;
var mixins = require('./mixins/index.js');
var PrivacyOptionsView = require('./../views/privacy-options.js');
var PrivacyOptionsModel = require('./../models/privacy-options.js');
var privacyOptionsTemplate = require('./../templates/privacy-options.js');
var AllowlistView = require('./../views/allowlist.js');
var AllowlistModel = require('./../models/allowlist.js');
var allowlistTemplate = require('./../templates/allowlist.js');
var UserDataView = require('./../views/user-data.js');
var UserDataModel = require('./../models/user-data.js');
var userDataTemplate = require('./../templates/user-data.js');
var BackgroundMessageModel = require('./../models/background-message.js');
var browserUIWrapper = require('./../base/ui-wrapper.js');
var t = window.DDG.base.i18n.t;
function Options(ops) {
  Parent.call(this, ops);
}
Options.prototype = window.$.extend({}, Parent.prototype, mixins.setBrowserClassOnBodyTag, {
  pageName: 'options',
  ready: function ready() {
    var $parent = window.$('#options-content');
    Parent.prototype.ready.call(this);
    this.setBrowserClassOnBodyTag();
    window.$('.js-feedback-link').click(this._onFeedbackClick.bind(this));
    window.$('.js-report-site-link').click(this._onReportSiteClick.bind(this));
    var textContainers = document.querySelectorAll('[data-text]');
    textContainers.forEach(function (el) {
      var textID = el.getAttribute('data-text');
      var text = t(textID);
      el.innerHTML = text;
    });
    this.views.options = new PrivacyOptionsView({
      pageView: this,
      model: new PrivacyOptionsModel({}),
      appendTo: $parent,
      template: privacyOptionsTemplate
    });
    this.views.userData = new UserDataView({
      pageView: this,
      model: new UserDataModel({}),
      appendTo: $parent,
      template: userDataTemplate
    });
    this.views.allowlist = new AllowlistView({
      pageView: this,
      model: new AllowlistModel({}),
      appendTo: $parent,
      template: allowlistTemplate
    });
    this.message = new BackgroundMessageModel({});
  },
  _onFeedbackClick: function _onFeedbackClick(e) {
    e.preventDefault();
    browserUIWrapper.openExtensionPage('/html/feedback.html');
  },
  _onReportSiteClick: function _onReportSiteClick(e) {
    e.preventDefault();
    browserUIWrapper.openExtensionPage('/html/feedback.html?broken=1');
  }
});

// kickoff!
window.DDG = window.DDG || {};
window.DDG.page = new Options();

},{"./../base/ui-wrapper.js":24,"./../models/allowlist.js":25,"./../models/background-message.js":26,"./../models/privacy-options.js":27,"./../models/user-data.js":28,"./../templates/allowlist.js":34,"./../templates/privacy-options.js":35,"./../templates/user-data.js":37,"./../views/allowlist.js":38,"./../views/privacy-options.js":39,"./../views/user-data.js":40,"./mixins/index.js":29}],33:[function(require,module,exports){
"use strict";

var _templateObject, _templateObject2, _templateObject3;
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
var bel = require('bel');
var t = window.DDG.base.i18n.t;
module.exports = function (list) {
  if (list.length > 0) {
    var i = 0;
    return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["", ""])), list.map(function (dom) {
      return bel(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n<li class=\"js-allowlist-list-item\">\n    <a class=\"link-secondary\" href=\"https://", "\">", "</a>\n    <button class=\"remove pull-right js-allowlist-remove\" data-item=\"", "\">\xD7</button>\n</li>"])), dom, dom, i++);
    }));
  }
  return bel(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<li>", "</li>"])), t('options:noUnprotectedSitesAdded.title'));
};

},{"bel":2}],34:[function(require,module,exports){
"use strict";

var _templateObject, _templateObject2;
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
var bel = require('bel');
var allowlistItems = require('./allowlist-items.js');
var t = window.DDG.base.i18n.t;
module.exports = function () {
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<section class=\"options-content__allowlist\">\n    <h2 class=\"menu-title\">", "</h2>\n    <p class=\"menu-paragraph\">", "</p>\n    <ul class=\"default-list js-allowlist-container\">\n        ", "\n    </ul>\n    ", "\n</section>"])), t('options:unprotectedSites.title'), t('options:unprotectedSitesDesc.title'), allowlistItems(this.model.list), addToAllowlist());
  function addToAllowlist() {
    return bel(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<div>\n    <p class=\"allowlist-show-add js-allowlist-show-add\">\n        <a href=\"javascript:void(0)\" role=\"button\">", "</a>\n    </p>\n    <input class=\"is-hidden allowlist-url float-left js-allowlist-url\" type=\"text\" placeholder=\"", "\">\n    <div class=\"is-hidden allowlist-add is-disabled float-right js-allowlist-add\">", "</div>\n\n    <div class=\"is-hidden modal-box js-allowlist-error float-right\">\n        <div class=\"modal-box__popout\">\n            <div class=\"modal-box__popout__body\">\n            </div>\n        </div>\n        <div class=\"modal-box__body\">\n            <span class=\"icon icon__error\">\n            </span>\n            <span class=\"modal__body__text\">\n                ", "\n            </span>\n        </div>\n    </div>\n</div>"])), t('options:addUnprotectedSite.title'), t('options:enterURL.title'), t('shared:add.title'), t('options:invalidURL.title'));
  }
};

},{"./allowlist-items.js":33,"bel":2}],35:[function(require,module,exports){
"use strict";

var _templateObject;
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
var bel = require('bel');
var raw = require('bel/raw');
var toggleButton = require('./shared/toggle-button.js');
var t = window.DDG.base.i18n.t;
module.exports = function () {
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<section class=\"options-content__privacy divider-bottom\">\n    <h2 class=\"menu-title\">", "</h2>\n    <ul class=\"default-list\">\n        <li>\n            ", "\n            ", "\n        </li>\n        <li class=\"options-content__gpc-enabled\">\n            <h2 class=\"menu-title\">", "</h2>\n            <p class=\"menu-paragraph\">\n                ", "\n            </p>\n            <ul>\n                <li>\n                    ", "\n                </li>\n                <li>\n                    ", "\n                </li>\n            </ul>\n            ", "\n            ", "\n            <p class=\"gpc-disclaimer\">\n                ", "\n                <a href=\"https://duckduckgo.com/global-privacy-control-learn-more\">", "</a>\n            </p>\n        </li>\n    </ul>\n    <ul class=\"default-list", "\">\n        <li>\n            <h2 class=\"menu-title\">\n                ", "\n                ", "\n            </h2>\n            <p class=\"menu-paragraph\">\n                ", "\n                <a href=\"https://help.duckduckgo.com/duckduckgo-help-pages/privacy/embedded-content-protection/\">", "</a>\n            </p>\n        </li>\n    </ul>\n</section>"])), t('shared:options.title'), t('options:showEmbeddedTweets.title'), toggleButton(this.model.embeddedTweetsEnabled, 'js-options-embedded-tweets-enabled', 'embeddedTweetsEnabled'), t('options:globalPrivacyControlAbbr.title'), t('options:globalPrivacyControlDesc.title'), t('options:notSellYourPersonalData.title'), t('options:limitSharingOfPersonalData.title'), t('options:globalPrivacyControlAbbr.title'), toggleButton(this.model.GPC, 'js-options-gpc-enabled', 'GPC'), raw(t('options:globalPrivacyControlDisclaimer.title')), t('shared:learnMore.title'), this.model.youtubeClickToLoadEnabled ? '' : ' is-hidden', t('options:enableYoutubePreviews.title'), toggleButton(this.model.youtubePreviewsEnabled, 'js-options-youtube-previews-enabled', 'youtubePreviewsEnabled'), raw(t('options:enableYoutubePreviewsDesc.title')), t('shared:learnMore.title'));
};

},{"./shared/toggle-button.js":36,"bel":2,"bel/raw":3}],36:[function(require,module,exports){
"use strict";

var _templateObject;
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
var bel = require('bel');
module.exports = function (isActiveBoolean, klass, dataKey) {
  // make `klass` and `dataKey` optional:
  klass = klass || '';
  dataKey = dataKey || '';
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n<button class=\"toggle-button toggle-button--is-active-", " ", "\"\n    data-key=\"", "\"\n    type=\"button\"\n    aria-pressed=\"", "\"\n    >\n    <div class=\"toggle-button__bg\">\n    </div>\n    <div class=\"toggle-button__knob\"></div>\n</button>"])), isActiveBoolean, klass, dataKey, isActiveBoolean ? 'true' : 'false');
};

},{"bel":2}],37:[function(require,module,exports){
"use strict";

var _templateObject, _templateObject2, _templateObject3;
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
var bel = require('bel');
var raw = require('bel/raw');
var _require = require('../../background/email-utils'),
  formatAddress = _require.formatAddress;
var t = window.DDG.base.i18n.t;
module.exports = function () {
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<section class=\"options-content__user-data divider-bottom\">\n        <h2 class=\"menu-title\">", "</h2>\n        ", "\n    </section>"])), t('options:emailProtection.title'), renderUserDataContent(this.model));
};
function renderUserDataContent(model) {
  return !model.userName ? bel(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<div>\n                <p class=\"menu-paragraph\">", "</p>\n                <p class=\"options-info\">\n                    <a href=\"https://duckduckgo.com/email/enable-autofill\">", "</a>\n                </p>\n            </div>"])), t('options:autofillDisabled.title'), t('shared:enable.title')) : bel(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<div>\n                <p class=\"menu-paragraph\">\n                    ", "\n                </p>\n                <p class=\"options-info js-userdata-logout\">\n                    <a href=\"#\">", "</a>\n                </p>\n            </div>"])), raw(t('options:autofillEnabled.title', {
    userName: formatAddress(model.userName)
  })), t('shared:disable.title'));
}

},{"../../background/email-utils":15,"bel":2,"bel/raw":3}],38:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.View;
var isHiddenClass = 'is-hidden';
var isDisabledClass = 'is-disabled';
var isInvalidInputClass = 'is-invalid-input';
var allowlistItemsTemplate = require('./../templates/allowlist-items.js');
function Allowlist(ops) {
  this.model = ops.model;
  this.pageView = ops.pageView;
  this.template = ops.template;
  Parent.call(this, ops);

  // bind events
  this.setup();
}
Allowlist.prototype = window.$.extend({}, Parent.prototype, {
  _removeItem: function _removeItem(e) {
    var itemIndex = window.$(e.target).data('item');
    this.model.removeDomain(itemIndex);

    // No need to rerender the whole view
    this._renderList();
  },
  _addItem: function _addItem(e) {
    if (!this.$add.hasClass(isDisabledClass)) {
      var url = this.$url.val();
      var isValidInput = false;
      if (url) {
        isValidInput = this.model.addDomain(url);
      }
      if (isValidInput) {
        this.rerender();
      } else {
        this._showErrorMessage();
      }
    }
  },
  _showErrorMessage: function _showErrorMessage() {
    this.$add.addClass(isHiddenClass);
    this.$error.removeClass(isHiddenClass);
    this.$url.addClass(isInvalidInputClass);
  },
  _hideErrorMessage: function _hideErrorMessage() {
    this.$add.removeClass(isHiddenClass);
    this.$error.addClass(isHiddenClass);
    this.$url.removeClass(isInvalidInputClass);
  },
  _manageInputChange: function _manageInputChange(e) {
    var isButtonDisabled = this.$add.hasClass(isDisabledClass);
    this._hideErrorMessage();
    if (this.$url.val() && isButtonDisabled) {
      this.$add.removeClass(isDisabledClass);
    } else if (!this.$url.val()) {
      this.$add.addClass(isDisabledClass);
    }
    if (!isButtonDisabled && e.key === 'Enter') {
      // also add to allowlist on enter
      this._addItem();
    }
  },
  _showAddToAllowlistInput: function _showAddToAllowlistInput(e) {
    this.$url.removeClass(isHiddenClass);
    this.$url.focus();
    this.$add.removeClass(isHiddenClass);
    this.$showadd.addClass(isHiddenClass);
    e.preventDefault();
  },
  setup: function setup() {
    this._cacheElems('.js-allowlist', ['remove', 'add', 'error', 'show-add', 'container', 'list-item', 'url']);
    this.bindEvents([[this.$remove, 'click', this._removeItem], [this.$add, 'click', this._addItem], [this.$showadd, 'click', this._showAddToAllowlistInput], [this.$url, 'keyup', this._manageInputChange],
    // listen to changes to the allowlist model
    [this.store.subscribe, 'change:allowlist', this.rerender]]);
  },
  rerender: function rerender() {
    this.unbindEvents();
    this._rerender();
    this.setup();
  },
  _renderList: function _renderList() {
    this.unbindEvents();
    this.$container.html(allowlistItemsTemplate(this.model.list));
    this.setup();
  }
});
module.exports = Allowlist;

},{"./../templates/allowlist-items.js":33}],39:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.View;
function PrivacyOptions(ops) {
  var _this = this;
  this.model = ops.model;
  this.pageView = ops.pageView;
  this.template = ops.template;
  Parent.call(this, ops);
  this.model.getState().then(function () {
    _this.rerender();
  });
}
PrivacyOptions.prototype = window.$.extend({}, Parent.prototype, {
  _clickSetting: function _clickSetting(e) {
    var key = window.$(e.target).data('key') || window.$(e.target).parent().data('key');
    console.log("privacyOptions view click for setting \"".concat(key, "\""));
    this.model.toggle(key);
    this.rerender();
  },
  setup: function setup() {
    this._cacheElems('.js-options', ['blocktrackers', 'https-everywhere-enabled', 'embedded-tweets-enabled', 'gpc-enabled', 'youtube-previews-enabled']);
    this.bindEvents([[this.$blocktrackers, 'click', this._clickSetting], [this.$httpseverywhereenabled, 'click', this._clickSetting], [this.$embeddedtweetsenabled, 'click', this._clickSetting], [this.$gpcenabled, 'click', this._clickSetting], [this.$youtubepreviewsenabled, 'click', this._clickSetting]]);
  },
  rerender: function rerender() {
    this.unbindEvents();
    this._rerender();
    this.setup();
  }
});
module.exports = PrivacyOptions;

},{}],40:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.View;
function UserData(ops) {
  this.model = ops.model;
  this.pageView = ops.pageView;
  this.template = ops.template;
  Parent.call(this, ops);

  // bind events
  this.setup();
}
UserData.prototype = window.$.extend({}, Parent.prototype, {
  _logout: function _logout(e) {
    e.preventDefault();
    this.model.logout();
  },
  setup: function setup() {
    this._cacheElems('.js-userdata', ['logout']);
    this.bindEvents([[this.$logout, 'click', this._logout],
    // listen for changes to the userData model
    [this.store.subscribe, 'change:userData', this.rerender]]);
  },
  rerender: function rerender() {
    this.unbindEvents();
    this._rerender();
    this.setup();
  }
});
module.exports = UserData;

},{}]},{},[32]);
