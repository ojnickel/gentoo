"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/jquery/dist/jquery.js
  var require_jquery = __commonJS({
    "node_modules/jquery/dist/jquery.js"(exports, module) {
      (function(global, factory) {
        "use strict";
        if (typeof module === "object" && typeof module.exports === "object") {
          module.exports = global.document ? factory(global, true) : function(w) {
            if (!w.document) {
              throw new Error("jQuery requires a window with a document");
            }
            return factory(w);
          };
        } else {
          factory(global);
        }
      })(typeof window !== "undefined" ? window : exports, function(window2, noGlobal) {
        "use strict";
        var arr2 = [];
        var getProto = Object.getPrototypeOf;
        var slice2 = arr2.slice;
        var flat = arr2.flat ? function(array) {
          return arr2.flat.call(array);
        } : function(array) {
          return arr2.concat.apply([], array);
        };
        var push = arr2.push;
        var indexOf = arr2.indexOf;
        var class2type = {};
        var toString = class2type.toString;
        var hasOwn = class2type.hasOwnProperty;
        var fnToString = hasOwn.toString;
        var ObjectFunctionString = fnToString.call(Object);
        var support = {};
        var isFunction = function isFunction2(obj) {
          return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function";
        };
        var isWindow = function isWindow2(obj) {
          return obj != null && obj === obj.window;
        };
        var document = window2.document;
        var preservedScriptAttributes = {
          type: true,
          src: true,
          nonce: true,
          noModule: true
        };
        function DOMEval(code, node, doc) {
          doc = doc || document;
          var i, val, script = doc.createElement("script");
          script.text = code;
          if (node) {
            for (i in preservedScriptAttributes) {
              val = node[i] || node.getAttribute && node.getAttribute(i);
              if (val) {
                script.setAttribute(i, val);
              }
            }
          }
          doc.head.appendChild(script).parentNode.removeChild(script);
        }
        function toType(obj) {
          if (obj == null) {
            return obj + "";
          }
          return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
        }
        var version = "3.7.1", rhtmlSuffix = /HTML$/i, jQuery = function(selector, context) {
          return new jQuery.fn.init(selector, context);
        };
        jQuery.fn = jQuery.prototype = {
          // The current version of jQuery being used
          jquery: version,
          constructor: jQuery,
          // The default length of a jQuery object is 0
          length: 0,
          toArray: function() {
            return slice2.call(this);
          },
          // Get the Nth element in the matched element set OR
          // Get the whole matched element set as a clean array
          get: function(num) {
            if (num == null) {
              return slice2.call(this);
            }
            return num < 0 ? this[num + this.length] : this[num];
          },
          // Take an array of elements and push it onto the stack
          // (returning the new matched element set)
          pushStack: function(elems) {
            var ret = jQuery.merge(this.constructor(), elems);
            ret.prevObject = this;
            return ret;
          },
          // Execute a callback for every element in the matched set.
          each: function(callback) {
            return jQuery.each(this, callback);
          },
          map: function(callback) {
            return this.pushStack(jQuery.map(this, function(elem, i) {
              return callback.call(elem, i, elem);
            }));
          },
          slice: function() {
            return this.pushStack(slice2.apply(this, arguments));
          },
          first: function() {
            return this.eq(0);
          },
          last: function() {
            return this.eq(-1);
          },
          even: function() {
            return this.pushStack(jQuery.grep(this, function(_elem, i) {
              return (i + 1) % 2;
            }));
          },
          odd: function() {
            return this.pushStack(jQuery.grep(this, function(_elem, i) {
              return i % 2;
            }));
          },
          eq: function(i) {
            var len = this.length, j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
          },
          end: function() {
            return this.prevObject || this.constructor();
          },
          // For internal use only.
          // Behaves like an Array's method, not like a jQuery method.
          push,
          sort: arr2.sort,
          splice: arr2.splice
        };
        jQuery.extend = jQuery.fn.extend = function() {
          var options, name, src, copy2, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
          if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
          }
          if (typeof target !== "object" && !isFunction(target)) {
            target = {};
          }
          if (i === length) {
            target = this;
            i--;
          }
          for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
              for (name in options) {
                copy2 = options[name];
                if (name === "__proto__" || target === copy2) {
                  continue;
                }
                if (deep && copy2 && (jQuery.isPlainObject(copy2) || (copyIsArray = Array.isArray(copy2)))) {
                  src = target[name];
                  if (copyIsArray && !Array.isArray(src)) {
                    clone = [];
                  } else if (!copyIsArray && !jQuery.isPlainObject(src)) {
                    clone = {};
                  } else {
                    clone = src;
                  }
                  copyIsArray = false;
                  target[name] = jQuery.extend(deep, clone, copy2);
                } else if (copy2 !== void 0) {
                  target[name] = copy2;
                }
              }
            }
          }
          return target;
        };
        jQuery.extend({
          // Unique for each copy of jQuery on the page
          expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
          // Assume jQuery is ready without the ready module
          isReady: true,
          error: function(msg) {
            throw new Error(msg);
          },
          noop: function() {
          },
          isPlainObject: function(obj) {
            var proto, Ctor;
            if (!obj || toString.call(obj) !== "[object Object]") {
              return false;
            }
            proto = getProto(obj);
            if (!proto) {
              return true;
            }
            Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
            return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
          },
          isEmptyObject: function(obj) {
            var name;
            for (name in obj) {
              return false;
            }
            return true;
          },
          // Evaluates a script in a provided context; falls back to the global one
          // if not specified.
          globalEval: function(code, options, doc) {
            DOMEval(code, { nonce: options && options.nonce }, doc);
          },
          each: function(obj, callback) {
            var length, i = 0;
            if (isArrayLike(obj)) {
              length = obj.length;
              for (; i < length; i++) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                  break;
                }
              }
            } else {
              for (i in obj) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                  break;
                }
              }
            }
            return obj;
          },
          // Retrieve the text value of an array of DOM nodes
          text: function(elem) {
            var node, ret = "", i = 0, nodeType = elem.nodeType;
            if (!nodeType) {
              while (node = elem[i++]) {
                ret += jQuery.text(node);
              }
            }
            if (nodeType === 1 || nodeType === 11) {
              return elem.textContent;
            }
            if (nodeType === 9) {
              return elem.documentElement.textContent;
            }
            if (nodeType === 3 || nodeType === 4) {
              return elem.nodeValue;
            }
            return ret;
          },
          // results is for internal usage only
          makeArray: function(arr3, results) {
            var ret = results || [];
            if (arr3 != null) {
              if (isArrayLike(Object(arr3))) {
                jQuery.merge(
                  ret,
                  typeof arr3 === "string" ? [arr3] : arr3
                );
              } else {
                push.call(ret, arr3);
              }
            }
            return ret;
          },
          inArray: function(elem, arr3, i) {
            return arr3 == null ? -1 : indexOf.call(arr3, elem, i);
          },
          isXMLDoc: function(elem) {
            var namespace = elem && elem.namespaceURI, docElem = elem && (elem.ownerDocument || elem).documentElement;
            return !rhtmlSuffix.test(namespace || docElem && docElem.nodeName || "HTML");
          },
          // Support: Android <=4.0 only, PhantomJS 1 only
          // push.apply(_, arraylike) throws on ancient WebKit
          merge: function(first, second) {
            var len = +second.length, j = 0, i = first.length;
            for (; j < len; j++) {
              first[i++] = second[j];
            }
            first.length = i;
            return first;
          },
          grep: function(elems, callback, invert) {
            var callbackInverse, matches = [], i = 0, length = elems.length, callbackExpect = !invert;
            for (; i < length; i++) {
              callbackInverse = !callback(elems[i], i);
              if (callbackInverse !== callbackExpect) {
                matches.push(elems[i]);
              }
            }
            return matches;
          },
          // arg is for internal usage only
          map: function(elems, callback, arg) {
            var length, value, i = 0, ret = [];
            if (isArrayLike(elems)) {
              length = elems.length;
              for (; i < length; i++) {
                value = callback(elems[i], i, arg);
                if (value != null) {
                  ret.push(value);
                }
              }
            } else {
              for (i in elems) {
                value = callback(elems[i], i, arg);
                if (value != null) {
                  ret.push(value);
                }
              }
            }
            return flat(ret);
          },
          // A global GUID counter for objects
          guid: 1,
          // jQuery.support is not used in Core but other projects attach their
          // properties to it so it needs to exist.
          support
        });
        if (typeof Symbol === "function") {
          jQuery.fn[Symbol.iterator] = arr2[Symbol.iterator];
        }
        jQuery.each(
          "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
          function(_i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
          }
        );
        function isArrayLike(obj) {
          var length = !!obj && "length" in obj && obj.length, type = toType(obj);
          if (isFunction(obj) || isWindow(obj)) {
            return false;
          }
          return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
        }
        function nodeName(elem, name) {
          return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        }
        var pop = arr2.pop;
        var sort = arr2.sort;
        var splice = arr2.splice;
        var whitespace = "[\\x20\\t\\r\\n\\f]";
        var rtrimCSS = new RegExp(
          "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
          "g"
        );
        jQuery.contains = function(a, b) {
          var bup = b && b.parentNode;
          return a === bup || !!(bup && bup.nodeType === 1 && // Support: IE 9 - 11+
          // IE doesn't have `contains` on SVG.
          (a.contains ? a.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
        };
        var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
        function fcssescape(ch, asCodePoint) {
          if (asCodePoint) {
            if (ch === "\0") {
              return "\uFFFD";
            }
            return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
          }
          return "\\" + ch;
        }
        jQuery.escapeSelector = function(sel) {
          return (sel + "").replace(rcssescape, fcssescape);
        };
        var preferredDoc = document, pushNative = push;
        (function() {
          var i, Expr, outermostContext, sortInput, hasDuplicate, push2 = pushNative, document2, documentElement2, documentIsHTML, rbuggyQSA, matches, expando = jQuery.expando, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), nonnativeSelectorCache = createCache(), sortOrder = function(a, b) {
            if (a === b) {
              hasDuplicate = true;
            }
            return 0;
          }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + // Operator (capture 2)
          "*([*^$|!~]?=)" + whitespace + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
          `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + identifier + "))|)" + whitespace + "*\\]", pseudos = ":(" + identifier + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + attributes + ")*)|.*)\\)|)", rwhitespace = new RegExp(whitespace + "+", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rleadingCombinator = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rdescend = new RegExp(whitespace + "|>"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
            ID: new RegExp("^#(" + identifier + ")"),
            CLASS: new RegExp("^\\.(" + identifier + ")"),
            TAG: new RegExp("^(" + identifier + "|[*])"),
            ATTR: new RegExp("^" + attributes),
            PSEUDO: new RegExp("^" + pseudos),
            CHILD: new RegExp(
              "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)",
              "i"
            ),
            bool: new RegExp("^(?:" + booleans + ")$", "i"),
            // For use in libraries implementing .is()
            // We use this for POS matching in `select`
            needsContext: new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
          }, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rquickExpr2 = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, runescape = new RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g"), funescape = function(escape2, nonHex) {
            var high = "0x" + escape2.slice(1) - 65536;
            if (nonHex) {
              return nonHex;
            }
            return high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
          }, unloadHandler = function() {
            setDocument();
          }, inDisabledFieldset = addCombinator(
            function(elem) {
              return elem.disabled === true && nodeName(elem, "fieldset");
            },
            { dir: "parentNode", next: "legend" }
          );
          function safeActiveElement() {
            try {
              return document2.activeElement;
            } catch (err) {
            }
          }
          try {
            push2.apply(
              arr2 = slice2.call(preferredDoc.childNodes),
              preferredDoc.childNodes
            );
            arr2[preferredDoc.childNodes.length].nodeType;
          } catch (e) {
            push2 = {
              apply: function(target, els) {
                pushNative.apply(target, slice2.call(els));
              },
              call: function(target) {
                pushNative.apply(target, slice2.call(arguments, 1));
              }
            };
          }
          function find(selector, context, results, seed) {
            var m, i2, elem, nid, match, groups, newSelector, newContext = context && context.ownerDocument, nodeType = context ? context.nodeType : 9;
            results = results || [];
            if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
              return results;
            }
            if (!seed) {
              setDocument(context);
              context = context || document2;
              if (documentIsHTML) {
                if (nodeType !== 11 && (match = rquickExpr2.exec(selector))) {
                  if (m = match[1]) {
                    if (nodeType === 9) {
                      if (elem = context.getElementById(m)) {
                        if (elem.id === m) {
                          push2.call(results, elem);
                          return results;
                        }
                      } else {
                        return results;
                      }
                    } else {
                      if (newContext && (elem = newContext.getElementById(m)) && find.contains(context, elem) && elem.id === m) {
                        push2.call(results, elem);
                        return results;
                      }
                    }
                  } else if (match[2]) {
                    push2.apply(results, context.getElementsByTagName(selector));
                    return results;
                  } else if ((m = match[3]) && context.getElementsByClassName) {
                    push2.apply(results, context.getElementsByClassName(m));
                    return results;
                  }
                }
                if (!nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                  newSelector = selector;
                  newContext = context;
                  if (nodeType === 1 && (rdescend.test(selector) || rleadingCombinator.test(selector))) {
                    newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                    if (newContext != context || !support.scope) {
                      if (nid = context.getAttribute("id")) {
                        nid = jQuery.escapeSelector(nid);
                      } else {
                        context.setAttribute("id", nid = expando);
                      }
                    }
                    groups = tokenize(selector);
                    i2 = groups.length;
                    while (i2--) {
                      groups[i2] = (nid ? "#" + nid : ":scope") + " " + toSelector(groups[i2]);
                    }
                    newSelector = groups.join(",");
                  }
                  try {
                    push2.apply(
                      results,
                      newContext.querySelectorAll(newSelector)
                    );
                    return results;
                  } catch (qsaError) {
                    nonnativeSelectorCache(selector, true);
                  } finally {
                    if (nid === expando) {
                      context.removeAttribute("id");
                    }
                  }
                }
              }
            }
            return select(selector.replace(rtrimCSS, "$1"), context, results, seed);
          }
          function createCache() {
            var keys = [];
            function cache(key, value) {
              if (keys.push(key + " ") > Expr.cacheLength) {
                delete cache[keys.shift()];
              }
              return cache[key + " "] = value;
            }
            return cache;
          }
          function markFunction(fn) {
            fn[expando] = true;
            return fn;
          }
          function assert(fn) {
            var el = document2.createElement("fieldset");
            try {
              return !!fn(el);
            } catch (e) {
              return false;
            } finally {
              if (el.parentNode) {
                el.parentNode.removeChild(el);
              }
              el = null;
            }
          }
          function createInputPseudo(type) {
            return function(elem) {
              return nodeName(elem, "input") && elem.type === type;
            };
          }
          function createButtonPseudo(type) {
            return function(elem) {
              return (nodeName(elem, "input") || nodeName(elem, "button")) && elem.type === type;
            };
          }
          function createDisabledPseudo(disabled) {
            return function(elem) {
              if ("form" in elem) {
                if (elem.parentNode && elem.disabled === false) {
                  if ("label" in elem) {
                    if ("label" in elem.parentNode) {
                      return elem.parentNode.disabled === disabled;
                    } else {
                      return elem.disabled === disabled;
                    }
                  }
                  return elem.isDisabled === disabled || // Where there is no isDisabled, check manually
                  elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled;
                }
                return elem.disabled === disabled;
              } else if ("label" in elem) {
                return elem.disabled === disabled;
              }
              return false;
            };
          }
          function createPositionalPseudo(fn) {
            return markFunction(function(argument) {
              argument = +argument;
              return markFunction(function(seed, matches2) {
                var j, matchIndexes = fn([], seed.length, argument), i2 = matchIndexes.length;
                while (i2--) {
                  if (seed[j = matchIndexes[i2]]) {
                    seed[j] = !(matches2[j] = seed[j]);
                  }
                }
              });
            });
          }
          function testContext(context) {
            return context && typeof context.getElementsByTagName !== "undefined" && context;
          }
          function setDocument(node) {
            var subWindow, doc = node ? node.ownerDocument || node : preferredDoc;
            if (doc == document2 || doc.nodeType !== 9 || !doc.documentElement) {
              return document2;
            }
            document2 = doc;
            documentElement2 = document2.documentElement;
            documentIsHTML = !jQuery.isXMLDoc(document2);
            matches = documentElement2.matches || documentElement2.webkitMatchesSelector || documentElement2.msMatchesSelector;
            if (documentElement2.msMatchesSelector && // Support: IE 11+, Edge 17 - 18+
            // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
            // two documents; shallow comparisons work.
            // eslint-disable-next-line eqeqeq
            preferredDoc != document2 && (subWindow = document2.defaultView) && subWindow.top !== subWindow) {
              subWindow.addEventListener("unload", unloadHandler);
            }
            support.getById = assert(function(el) {
              documentElement2.appendChild(el).id = jQuery.expando;
              return !document2.getElementsByName || !document2.getElementsByName(jQuery.expando).length;
            });
            support.disconnectedMatch = assert(function(el) {
              return matches.call(el, "*");
            });
            support.scope = assert(function() {
              return document2.querySelectorAll(":scope");
            });
            support.cssHas = assert(function() {
              try {
                document2.querySelector(":has(*,:jqfake)");
                return false;
              } catch (e) {
                return true;
              }
            });
            if (support.getById) {
              Expr.filter.ID = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                  return elem.getAttribute("id") === attrId;
                };
              };
              Expr.find.ID = function(id, context) {
                if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                  var elem = context.getElementById(id);
                  return elem ? [elem] : [];
                }
              };
            } else {
              Expr.filter.ID = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                  var node2 = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                  return node2 && node2.value === attrId;
                };
              };
              Expr.find.ID = function(id, context) {
                if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                  var node2, i2, elems, elem = context.getElementById(id);
                  if (elem) {
                    node2 = elem.getAttributeNode("id");
                    if (node2 && node2.value === id) {
                      return [elem];
                    }
                    elems = context.getElementsByName(id);
                    i2 = 0;
                    while (elem = elems[i2++]) {
                      node2 = elem.getAttributeNode("id");
                      if (node2 && node2.value === id) {
                        return [elem];
                      }
                    }
                  }
                  return [];
                }
              };
            }
            Expr.find.TAG = function(tag, context) {
              if (typeof context.getElementsByTagName !== "undefined") {
                return context.getElementsByTagName(tag);
              } else {
                return context.querySelectorAll(tag);
              }
            };
            Expr.find.CLASS = function(className, context) {
              if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
                return context.getElementsByClassName(className);
              }
            };
            rbuggyQSA = [];
            assert(function(el) {
              var input;
              documentElement2.appendChild(el).innerHTML = "<a id='" + expando + "' href='' disabled='disabled'></a><select id='" + expando + "-\r\\' disabled='disabled'><option selected=''></option></select>";
              if (!el.querySelectorAll("[selected]").length) {
                rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
              }
              if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
                rbuggyQSA.push("~=");
              }
              if (!el.querySelectorAll("a#" + expando + "+*").length) {
                rbuggyQSA.push(".#.+[+~]");
              }
              if (!el.querySelectorAll(":checked").length) {
                rbuggyQSA.push(":checked");
              }
              input = document2.createElement("input");
              input.setAttribute("type", "hidden");
              el.appendChild(input).setAttribute("name", "D");
              documentElement2.appendChild(el).disabled = true;
              if (el.querySelectorAll(":disabled").length !== 2) {
                rbuggyQSA.push(":enabled", ":disabled");
              }
              input = document2.createElement("input");
              input.setAttribute("name", "");
              el.appendChild(input);
              if (!el.querySelectorAll("[name='']").length) {
                rbuggyQSA.push("\\[" + whitespace + "*name" + whitespace + "*=" + whitespace + `*(?:''|"")`);
              }
            });
            if (!support.cssHas) {
              rbuggyQSA.push(":has");
            }
            rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
            sortOrder = function(a, b) {
              if (a === b) {
                hasDuplicate = true;
                return 0;
              }
              var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
              if (compare) {
                return compare;
              }
              compare = (a.ownerDocument || a) == (b.ownerDocument || b) ? a.compareDocumentPosition(b) : (
                // Otherwise we know they are disconnected
                1
              );
              if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {
                if (a === document2 || a.ownerDocument == preferredDoc && find.contains(preferredDoc, a)) {
                  return -1;
                }
                if (b === document2 || b.ownerDocument == preferredDoc && find.contains(preferredDoc, b)) {
                  return 1;
                }
                return sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0;
              }
              return compare & 4 ? -1 : 1;
            };
            return document2;
          }
          find.matches = function(expr, elements) {
            return find(expr, null, null, elements);
          };
          find.matchesSelector = function(elem, expr) {
            setDocument(elem);
            if (documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
              try {
                var ret = matches.call(elem, expr);
                if (ret || support.disconnectedMatch || // As well, disconnected nodes are said to be in a document
                // fragment in IE 9
                elem.document && elem.document.nodeType !== 11) {
                  return ret;
                }
              } catch (e) {
                nonnativeSelectorCache(expr, true);
              }
            }
            return find(expr, document2, null, [elem]).length > 0;
          };
          find.contains = function(context, elem) {
            if ((context.ownerDocument || context) != document2) {
              setDocument(context);
            }
            return jQuery.contains(context, elem);
          };
          find.attr = function(elem, name) {
            if ((elem.ownerDocument || elem) != document2) {
              setDocument(elem);
            }
            var fn = Expr.attrHandle[name.toLowerCase()], val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
            if (val !== void 0) {
              return val;
            }
            return elem.getAttribute(name);
          };
          find.error = function(msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
          };
          jQuery.uniqueSort = function(results) {
            var elem, duplicates = [], j = 0, i2 = 0;
            hasDuplicate = !support.sortStable;
            sortInput = !support.sortStable && slice2.call(results, 0);
            sort.call(results, sortOrder);
            if (hasDuplicate) {
              while (elem = results[i2++]) {
                if (elem === results[i2]) {
                  j = duplicates.push(i2);
                }
              }
              while (j--) {
                splice.call(results, duplicates[j], 1);
              }
            }
            sortInput = null;
            return results;
          };
          jQuery.fn.uniqueSort = function() {
            return this.pushStack(jQuery.uniqueSort(slice2.apply(this)));
          };
          Expr = jQuery.expr = {
            // Can be adjusted by the user
            cacheLength: 50,
            createPseudo: markFunction,
            match: matchExpr,
            attrHandle: {},
            find: {},
            relative: {
              ">": { dir: "parentNode", first: true },
              " ": { dir: "parentNode" },
              "+": { dir: "previousSibling", first: true },
              "~": { dir: "previousSibling" }
            },
            preFilter: {
              ATTR: function(match) {
                match[1] = match[1].replace(runescape, funescape);
                match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);
                if (match[2] === "~=") {
                  match[3] = " " + match[3] + " ";
                }
                return match.slice(0, 4);
              },
              CHILD: function(match) {
                match[1] = match[1].toLowerCase();
                if (match[1].slice(0, 3) === "nth") {
                  if (!match[3]) {
                    find.error(match[0]);
                  }
                  match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                  match[5] = +(match[7] + match[8] || match[3] === "odd");
                } else if (match[3]) {
                  find.error(match[0]);
                }
                return match;
              },
              PSEUDO: function(match) {
                var excess, unquoted = !match[6] && match[2];
                if (matchExpr.CHILD.test(match[0])) {
                  return null;
                }
                if (match[3]) {
                  match[2] = match[4] || match[5] || "";
                } else if (unquoted && rpseudo.test(unquoted) && // Get excess from tokenize (recursively)
                (excess = tokenize(unquoted, true)) && // advance to the next closing parenthesis
                (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
                  match[0] = match[0].slice(0, excess);
                  match[2] = unquoted.slice(0, excess);
                }
                return match.slice(0, 3);
              }
            },
            filter: {
              TAG: function(nodeNameSelector) {
                var expectedNodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                return nodeNameSelector === "*" ? function() {
                  return true;
                } : function(elem) {
                  return nodeName(elem, expectedNodeName);
                };
              },
              CLASS: function(className) {
                var pattern = classCache[className + " "];
                return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
                  return pattern.test(
                    typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || ""
                  );
                });
              },
              ATTR: function(name, operator, check) {
                return function(elem) {
                  var result = find.attr(elem, name);
                  if (result == null) {
                    return operator === "!=";
                  }
                  if (!operator) {
                    return true;
                  }
                  result += "";
                  if (operator === "=") {
                    return result === check;
                  }
                  if (operator === "!=") {
                    return result !== check;
                  }
                  if (operator === "^=") {
                    return check && result.indexOf(check) === 0;
                  }
                  if (operator === "*=") {
                    return check && result.indexOf(check) > -1;
                  }
                  if (operator === "$=") {
                    return check && result.slice(-check.length) === check;
                  }
                  if (operator === "~=") {
                    return (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1;
                  }
                  if (operator === "|=") {
                    return result === check || result.slice(0, check.length + 1) === check + "-";
                  }
                  return false;
                };
              },
              CHILD: function(type, what, _argument, first, last) {
                var simple = type.slice(0, 3) !== "nth", forward = type.slice(-4) !== "last", ofType = what === "of-type";
                return first === 1 && last === 0 ? (
                  // Shortcut for :nth-*(n)
                  function(elem) {
                    return !!elem.parentNode;
                  }
                ) : function(elem, _context, xml) {
                  var cache, outerCache, node, nodeIndex, start, dir3 = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType, diff = false;
                  if (parent) {
                    if (simple) {
                      while (dir3) {
                        node = elem;
                        while (node = node[dir3]) {
                          if (ofType ? nodeName(node, name) : node.nodeType === 1) {
                            return false;
                          }
                        }
                        start = dir3 = type === "only" && !start && "nextSibling";
                      }
                      return true;
                    }
                    start = [forward ? parent.firstChild : parent.lastChild];
                    if (forward && useCache) {
                      outerCache = parent[expando] || (parent[expando] = {});
                      cache = outerCache[type] || [];
                      nodeIndex = cache[0] === dirruns && cache[1];
                      diff = nodeIndex && cache[2];
                      node = nodeIndex && parent.childNodes[nodeIndex];
                      while (node = ++nodeIndex && node && node[dir3] || // Fallback to seeking `elem` from the start
                      (diff = nodeIndex = 0) || start.pop()) {
                        if (node.nodeType === 1 && ++diff && node === elem) {
                          outerCache[type] = [dirruns, nodeIndex, diff];
                          break;
                        }
                      }
                    } else {
                      if (useCache) {
                        outerCache = elem[expando] || (elem[expando] = {});
                        cache = outerCache[type] || [];
                        nodeIndex = cache[0] === dirruns && cache[1];
                        diff = nodeIndex;
                      }
                      if (diff === false) {
                        while (node = ++nodeIndex && node && node[dir3] || (diff = nodeIndex = 0) || start.pop()) {
                          if ((ofType ? nodeName(node, name) : node.nodeType === 1) && ++diff) {
                            if (useCache) {
                              outerCache = node[expando] || (node[expando] = {});
                              outerCache[type] = [dirruns, diff];
                            }
                            if (node === elem) {
                              break;
                            }
                          }
                        }
                      }
                    }
                    diff -= last;
                    return diff === first || diff % first === 0 && diff / first >= 0;
                  }
                };
              },
              PSEUDO: function(pseudo, argument) {
                var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || find.error("unsupported pseudo: " + pseudo);
                if (fn[expando]) {
                  return fn(argument);
                }
                if (fn.length > 1) {
                  args = [pseudo, pseudo, "", argument];
                  return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches2) {
                    var idx, matched = fn(seed, argument), i2 = matched.length;
                    while (i2--) {
                      idx = indexOf.call(seed, matched[i2]);
                      seed[idx] = !(matches2[idx] = matched[i2]);
                    }
                  }) : function(elem) {
                    return fn(elem, 0, args);
                  };
                }
                return fn;
              }
            },
            pseudos: {
              // Potentially complex pseudos
              not: markFunction(function(selector) {
                var input = [], results = [], matcher = compile(selector.replace(rtrimCSS, "$1"));
                return matcher[expando] ? markFunction(function(seed, matches2, _context, xml) {
                  var elem, unmatched = matcher(seed, null, xml, []), i2 = seed.length;
                  while (i2--) {
                    if (elem = unmatched[i2]) {
                      seed[i2] = !(matches2[i2] = elem);
                    }
                  }
                }) : function(elem, _context, xml) {
                  input[0] = elem;
                  matcher(input, null, xml, results);
                  input[0] = null;
                  return !results.pop();
                };
              }),
              has: markFunction(function(selector) {
                return function(elem) {
                  return find(selector, elem).length > 0;
                };
              }),
              contains: markFunction(function(text) {
                text = text.replace(runescape, funescape);
                return function(elem) {
                  return (elem.textContent || jQuery.text(elem)).indexOf(text) > -1;
                };
              }),
              // "Whether an element is represented by a :lang() selector
              // is based solely on the element's language value
              // being equal to the identifier C,
              // or beginning with the identifier C immediately followed by "-".
              // The matching of C against the element's language value is performed case-insensitively.
              // The identifier C does not have to be a valid language name."
              // https://www.w3.org/TR/selectors/#lang-pseudo
              lang: markFunction(function(lang) {
                if (!ridentifier.test(lang || "")) {
                  find.error("unsupported lang: " + lang);
                }
                lang = lang.replace(runescape, funescape).toLowerCase();
                return function(elem) {
                  var elemLang;
                  do {
                    if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                      elemLang = elemLang.toLowerCase();
                      return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                    }
                  } while ((elem = elem.parentNode) && elem.nodeType === 1);
                  return false;
                };
              }),
              // Miscellaneous
              target: function(elem) {
                var hash = window2.location && window2.location.hash;
                return hash && hash.slice(1) === elem.id;
              },
              root: function(elem) {
                return elem === documentElement2;
              },
              focus: function(elem) {
                return elem === safeActiveElement() && document2.hasFocus() && !!(elem.type || elem.href || ~elem.tabIndex);
              },
              // Boolean properties
              enabled: createDisabledPseudo(false),
              disabled: createDisabledPseudo(true),
              checked: function(elem) {
                return nodeName(elem, "input") && !!elem.checked || nodeName(elem, "option") && !!elem.selected;
              },
              selected: function(elem) {
                if (elem.parentNode) {
                  elem.parentNode.selectedIndex;
                }
                return elem.selected === true;
              },
              // Contents
              empty: function(elem) {
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                  if (elem.nodeType < 6) {
                    return false;
                  }
                }
                return true;
              },
              parent: function(elem) {
                return !Expr.pseudos.empty(elem);
              },
              // Element/input types
              header: function(elem) {
                return rheader.test(elem.nodeName);
              },
              input: function(elem) {
                return rinputs.test(elem.nodeName);
              },
              button: function(elem) {
                return nodeName(elem, "input") && elem.type === "button" || nodeName(elem, "button");
              },
              text: function(elem) {
                var attr;
                return nodeName(elem, "input") && elem.type === "text" && // Support: IE <10 only
                // New HTML5 attribute values (e.g., "search") appear
                // with elem.type === "text"
                ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
              },
              // Position-in-collection
              first: createPositionalPseudo(function() {
                return [0];
              }),
              last: createPositionalPseudo(function(_matchIndexes, length) {
                return [length - 1];
              }),
              eq: createPositionalPseudo(function(_matchIndexes, length, argument) {
                return [argument < 0 ? argument + length : argument];
              }),
              even: createPositionalPseudo(function(matchIndexes, length) {
                var i2 = 0;
                for (; i2 < length; i2 += 2) {
                  matchIndexes.push(i2);
                }
                return matchIndexes;
              }),
              odd: createPositionalPseudo(function(matchIndexes, length) {
                var i2 = 1;
                for (; i2 < length; i2 += 2) {
                  matchIndexes.push(i2);
                }
                return matchIndexes;
              }),
              lt: createPositionalPseudo(function(matchIndexes, length, argument) {
                var i2;
                if (argument < 0) {
                  i2 = argument + length;
                } else if (argument > length) {
                  i2 = length;
                } else {
                  i2 = argument;
                }
                for (; --i2 >= 0; ) {
                  matchIndexes.push(i2);
                }
                return matchIndexes;
              }),
              gt: createPositionalPseudo(function(matchIndexes, length, argument) {
                var i2 = argument < 0 ? argument + length : argument;
                for (; ++i2 < length; ) {
                  matchIndexes.push(i2);
                }
                return matchIndexes;
              })
            }
          };
          Expr.pseudos.nth = Expr.pseudos.eq;
          for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
            Expr.pseudos[i] = createInputPseudo(i);
          }
          for (i in { submit: true, reset: true }) {
            Expr.pseudos[i] = createButtonPseudo(i);
          }
          function setFilters() {
          }
          setFilters.prototype = Expr.filters = Expr.pseudos;
          Expr.setFilters = new setFilters();
          function tokenize(selector, parseOnly) {
            var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
            if (cached) {
              return parseOnly ? 0 : cached.slice(0);
            }
            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;
            while (soFar) {
              if (!matched || (match = rcomma.exec(soFar))) {
                if (match) {
                  soFar = soFar.slice(match[0].length) || soFar;
                }
                groups.push(tokens = []);
              }
              matched = false;
              if (match = rleadingCombinator.exec(soFar)) {
                matched = match.shift();
                tokens.push({
                  value: matched,
                  // Cast descendant combinators to space
                  type: match[0].replace(rtrimCSS, " ")
                });
                soFar = soFar.slice(matched.length);
              }
              for (type in Expr.filter) {
                if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
                  matched = match.shift();
                  tokens.push({
                    value: matched,
                    type,
                    matches: match
                  });
                  soFar = soFar.slice(matched.length);
                }
              }
              if (!matched) {
                break;
              }
            }
            if (parseOnly) {
              return soFar.length;
            }
            return soFar ? find.error(selector) : (
              // Cache the tokens
              tokenCache(selector, groups).slice(0)
            );
          }
          function toSelector(tokens) {
            var i2 = 0, len = tokens.length, selector = "";
            for (; i2 < len; i2++) {
              selector += tokens[i2].value;
            }
            return selector;
          }
          function addCombinator(matcher, combinator, base) {
            var dir3 = combinator.dir, skip = combinator.next, key = skip || dir3, checkNonElements = base && key === "parentNode", doneName = done++;
            return combinator.first ? (
              // Check against closest ancestor/preceding element
              function(elem, context, xml) {
                while (elem = elem[dir3]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    return matcher(elem, context, xml);
                  }
                }
                return false;
              }
            ) : (
              // Check against all ancestor/preceding elements
              function(elem, context, xml) {
                var oldCache, outerCache, newCache = [dirruns, doneName];
                if (xml) {
                  while (elem = elem[dir3]) {
                    if (elem.nodeType === 1 || checkNonElements) {
                      if (matcher(elem, context, xml)) {
                        return true;
                      }
                    }
                  }
                } else {
                  while (elem = elem[dir3]) {
                    if (elem.nodeType === 1 || checkNonElements) {
                      outerCache = elem[expando] || (elem[expando] = {});
                      if (skip && nodeName(elem, skip)) {
                        elem = elem[dir3] || elem;
                      } else if ((oldCache = outerCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                        return newCache[2] = oldCache[2];
                      } else {
                        outerCache[key] = newCache;
                        if (newCache[2] = matcher(elem, context, xml)) {
                          return true;
                        }
                      }
                    }
                  }
                }
                return false;
              }
            );
          }
          function elementMatcher(matchers) {
            return matchers.length > 1 ? function(elem, context, xml) {
              var i2 = matchers.length;
              while (i2--) {
                if (!matchers[i2](elem, context, xml)) {
                  return false;
                }
              }
              return true;
            } : matchers[0];
          }
          function multipleContexts(selector, contexts, results) {
            var i2 = 0, len = contexts.length;
            for (; i2 < len; i2++) {
              find(selector, contexts[i2], results);
            }
            return results;
          }
          function condense(unmatched, map, filter, context, xml) {
            var elem, newUnmatched = [], i2 = 0, len = unmatched.length, mapped = map != null;
            for (; i2 < len; i2++) {
              if (elem = unmatched[i2]) {
                if (!filter || filter(elem, context, xml)) {
                  newUnmatched.push(elem);
                  if (mapped) {
                    map.push(i2);
                  }
                }
              }
            }
            return newUnmatched;
          }
          function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
            if (postFilter && !postFilter[expando]) {
              postFilter = setMatcher(postFilter);
            }
            if (postFinder && !postFinder[expando]) {
              postFinder = setMatcher(postFinder, postSelector);
            }
            return markFunction(function(seed, results, context, xml) {
              var temp, i2, elem, matcherOut, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(
                selector || "*",
                context.nodeType ? [context] : context,
                []
              ), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems;
              if (matcher) {
                matcherOut = postFinder || (seed ? preFilter : preexisting || postFilter) ? (
                  // ...intermediate processing is necessary
                  []
                ) : (
                  // ...otherwise use results directly
                  results
                );
                matcher(matcherIn, matcherOut, context, xml);
              } else {
                matcherOut = matcherIn;
              }
              if (postFilter) {
                temp = condense(matcherOut, postMap);
                postFilter(temp, [], context, xml);
                i2 = temp.length;
                while (i2--) {
                  if (elem = temp[i2]) {
                    matcherOut[postMap[i2]] = !(matcherIn[postMap[i2]] = elem);
                  }
                }
              }
              if (seed) {
                if (postFinder || preFilter) {
                  if (postFinder) {
                    temp = [];
                    i2 = matcherOut.length;
                    while (i2--) {
                      if (elem = matcherOut[i2]) {
                        temp.push(matcherIn[i2] = elem);
                      }
                    }
                    postFinder(null, matcherOut = [], temp, xml);
                  }
                  i2 = matcherOut.length;
                  while (i2--) {
                    if ((elem = matcherOut[i2]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i2]) > -1) {
                      seed[temp] = !(results[temp] = elem);
                    }
                  }
                }
              } else {
                matcherOut = condense(
                  matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut
                );
                if (postFinder) {
                  postFinder(null, results, matcherOut, xml);
                } else {
                  push2.apply(results, matcherOut);
                }
              }
            });
          }
          function matcherFromTokens(tokens) {
            var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i2 = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
              return elem === checkContext;
            }, implicitRelative, true), matchAnyContext = addCombinator(function(elem) {
              return indexOf.call(checkContext, elem) > -1;
            }, implicitRelative, true), matchers = [function(elem, context, xml) {
              var ret = !leadingRelative && (xml || context != outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
              checkContext = null;
              return ret;
            }];
            for (; i2 < len; i2++) {
              if (matcher = Expr.relative[tokens[i2].type]) {
                matchers = [addCombinator(elementMatcher(matchers), matcher)];
              } else {
                matcher = Expr.filter[tokens[i2].type].apply(null, tokens[i2].matches);
                if (matcher[expando]) {
                  j = ++i2;
                  for (; j < len; j++) {
                    if (Expr.relative[tokens[j].type]) {
                      break;
                    }
                  }
                  return setMatcher(
                    i2 > 1 && elementMatcher(matchers),
                    i2 > 1 && toSelector(
                      // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                      tokens.slice(0, i2 - 1).concat({ value: tokens[i2 - 2].type === " " ? "*" : "" })
                    ).replace(rtrimCSS, "$1"),
                    matcher,
                    i2 < j && matcherFromTokens(tokens.slice(i2, j)),
                    j < len && matcherFromTokens(tokens = tokens.slice(j)),
                    j < len && toSelector(tokens)
                  );
                }
                matchers.push(matcher);
              }
            }
            return elementMatcher(matchers);
          }
          function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, outermost) {
              var elem, j, matcher, matchedCount = 0, i2 = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find.TAG("*", outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1, len = elems.length;
              if (outermost) {
                outermostContext = context == document2 || context || outermost;
              }
              for (; i2 !== len && (elem = elems[i2]) != null; i2++) {
                if (byElement && elem) {
                  j = 0;
                  if (!context && elem.ownerDocument != document2) {
                    setDocument(elem);
                    xml = !documentIsHTML;
                  }
                  while (matcher = elementMatchers[j++]) {
                    if (matcher(elem, context || document2, xml)) {
                      push2.call(results, elem);
                      break;
                    }
                  }
                  if (outermost) {
                    dirruns = dirrunsUnique;
                  }
                }
                if (bySet) {
                  if (elem = !matcher && elem) {
                    matchedCount--;
                  }
                  if (seed) {
                    unmatched.push(elem);
                  }
                }
              }
              matchedCount += i2;
              if (bySet && i2 !== matchedCount) {
                j = 0;
                while (matcher = setMatchers[j++]) {
                  matcher(unmatched, setMatched, context, xml);
                }
                if (seed) {
                  if (matchedCount > 0) {
                    while (i2--) {
                      if (!(unmatched[i2] || setMatched[i2])) {
                        setMatched[i2] = pop.call(results);
                      }
                    }
                  }
                  setMatched = condense(setMatched);
                }
                push2.apply(results, setMatched);
                if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
                  jQuery.uniqueSort(results);
                }
              }
              if (outermost) {
                dirruns = dirrunsUnique;
                outermostContext = contextBackup;
              }
              return unmatched;
            };
            return bySet ? markFunction(superMatcher) : superMatcher;
          }
          function compile(selector, match) {
            var i2, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
            if (!cached) {
              if (!match) {
                match = tokenize(selector);
              }
              i2 = match.length;
              while (i2--) {
                cached = matcherFromTokens(match[i2]);
                if (cached[expando]) {
                  setMatchers.push(cached);
                } else {
                  elementMatchers.push(cached);
                }
              }
              cached = compilerCache(
                selector,
                matcherFromGroupMatchers(elementMatchers, setMatchers)
              );
              cached.selector = selector;
            }
            return cached;
          }
          function select(selector, context, results, seed) {
            var i2, tokens, token, type, find2, compiled = typeof selector === "function" && selector, match = !seed && tokenize(selector = compiled.selector || selector);
            results = results || [];
            if (match.length === 1) {
              tokens = match[0] = match[0].slice(0);
              if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
                context = (Expr.find.ID(
                  token.matches[0].replace(runescape, funescape),
                  context
                ) || [])[0];
                if (!context) {
                  return results;
                } else if (compiled) {
                  context = context.parentNode;
                }
                selector = selector.slice(tokens.shift().value.length);
              }
              i2 = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
              while (i2--) {
                token = tokens[i2];
                if (Expr.relative[type = token.type]) {
                  break;
                }
                if (find2 = Expr.find[type]) {
                  if (seed = find2(
                    token.matches[0].replace(runescape, funescape),
                    rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
                  )) {
                    tokens.splice(i2, 1);
                    selector = seed.length && toSelector(tokens);
                    if (!selector) {
                      push2.apply(results, seed);
                      return results;
                    }
                    break;
                  }
                }
              }
            }
            (compiled || compile(selector, match))(
              seed,
              context,
              !documentIsHTML,
              results,
              !context || rsibling.test(selector) && testContext(context.parentNode) || context
            );
            return results;
          }
          support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
          setDocument();
          support.sortDetached = assert(function(el) {
            return el.compareDocumentPosition(document2.createElement("fieldset")) & 1;
          });
          jQuery.find = find;
          jQuery.expr[":"] = jQuery.expr.pseudos;
          jQuery.unique = jQuery.uniqueSort;
          find.compile = compile;
          find.select = select;
          find.setDocument = setDocument;
          find.tokenize = tokenize;
          find.escape = jQuery.escapeSelector;
          find.getText = jQuery.text;
          find.isXML = jQuery.isXMLDoc;
          find.selectors = jQuery.expr;
          find.support = jQuery.support;
          find.uniqueSort = jQuery.uniqueSort;
        })();
        var dir2 = function(elem, dir3, until) {
          var matched = [], truncate = until !== void 0;
          while ((elem = elem[dir3]) && elem.nodeType !== 9) {
            if (elem.nodeType === 1) {
              if (truncate && jQuery(elem).is(until)) {
                break;
              }
              matched.push(elem);
            }
          }
          return matched;
        };
        var siblings = function(n, elem) {
          var matched = [];
          for (; n; n = n.nextSibling) {
            if (n.nodeType === 1 && n !== elem) {
              matched.push(n);
            }
          }
          return matched;
        };
        var rneedsContext = jQuery.expr.match.needsContext;
        var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
        function winnow(elements, qualifier, not) {
          if (isFunction(qualifier)) {
            return jQuery.grep(elements, function(elem, i) {
              return !!qualifier.call(elem, i, elem) !== not;
            });
          }
          if (qualifier.nodeType) {
            return jQuery.grep(elements, function(elem) {
              return elem === qualifier !== not;
            });
          }
          if (typeof qualifier !== "string") {
            return jQuery.grep(elements, function(elem) {
              return indexOf.call(qualifier, elem) > -1 !== not;
            });
          }
          return jQuery.filter(qualifier, elements, not);
        }
        jQuery.filter = function(expr, elems, not) {
          var elem = elems[0];
          if (not) {
            expr = ":not(" + expr + ")";
          }
          if (elems.length === 1 && elem.nodeType === 1) {
            return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
          }
          return jQuery.find.matches(expr, jQuery.grep(elems, function(elem2) {
            return elem2.nodeType === 1;
          }));
        };
        jQuery.fn.extend({
          find: function(selector) {
            var i, ret, len = this.length, self2 = this;
            if (typeof selector !== "string") {
              return this.pushStack(jQuery(selector).filter(function() {
                for (i = 0; i < len; i++) {
                  if (jQuery.contains(self2[i], this)) {
                    return true;
                  }
                }
              }));
            }
            ret = this.pushStack([]);
            for (i = 0; i < len; i++) {
              jQuery.find(selector, self2[i], ret);
            }
            return len > 1 ? jQuery.uniqueSort(ret) : ret;
          },
          filter: function(selector) {
            return this.pushStack(winnow(this, selector || [], false));
          },
          not: function(selector) {
            return this.pushStack(winnow(this, selector || [], true));
          },
          is: function(selector) {
            return !!winnow(
              this,
              // If this is a positional/relative selector, check membership in the returned set
              // so $("p:first").is("p:last") won't return true for a doc with two "p".
              typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [],
              false
            ).length;
          }
        });
        var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, init2 = jQuery.fn.init = function(selector, context, root) {
          var match, elem;
          if (!selector) {
            return this;
          }
          root = root || rootjQuery;
          if (typeof selector === "string") {
            if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
              match = [null, selector, null];
            } else {
              match = rquickExpr.exec(selector);
            }
            if (match && (match[1] || !context)) {
              if (match[1]) {
                context = context instanceof jQuery ? context[0] : context;
                jQuery.merge(this, jQuery.parseHTML(
                  match[1],
                  context && context.nodeType ? context.ownerDocument || context : document,
                  true
                ));
                if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                  for (match in context) {
                    if (isFunction(this[match])) {
                      this[match](context[match]);
                    } else {
                      this.attr(match, context[match]);
                    }
                  }
                }
                return this;
              } else {
                elem = document.getElementById(match[2]);
                if (elem) {
                  this[0] = elem;
                  this.length = 1;
                }
                return this;
              }
            } else if (!context || context.jquery) {
              return (context || root).find(selector);
            } else {
              return this.constructor(context).find(selector);
            }
          } else if (selector.nodeType) {
            this[0] = selector;
            this.length = 1;
            return this;
          } else if (isFunction(selector)) {
            return root.ready !== void 0 ? root.ready(selector) : (
              // Execute immediately if ready is not present
              selector(jQuery)
            );
          }
          return jQuery.makeArray(selector, this);
        };
        init2.prototype = jQuery.fn;
        rootjQuery = jQuery(document);
        var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
          children: true,
          contents: true,
          next: true,
          prev: true
        };
        jQuery.fn.extend({
          has: function(target) {
            var targets = jQuery(target, this), l = targets.length;
            return this.filter(function() {
              var i = 0;
              for (; i < l; i++) {
                if (jQuery.contains(this, targets[i])) {
                  return true;
                }
              }
            });
          },
          closest: function(selectors, context) {
            var cur, i = 0, l = this.length, matched = [], targets = typeof selectors !== "string" && jQuery(selectors);
            if (!rneedsContext.test(selectors)) {
              for (; i < l; i++) {
                for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
                  if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : (
                    // Don't pass non-elements to jQuery#find
                    cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors)
                  ))) {
                    matched.push(cur);
                    break;
                  }
                }
              }
            }
            return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
          },
          // Determine the position of an element within the set
          index: function(elem) {
            if (!elem) {
              return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
            }
            if (typeof elem === "string") {
              return indexOf.call(jQuery(elem), this[0]);
            }
            return indexOf.call(
              this,
              // If it receives a jQuery object, the first element is used
              elem.jquery ? elem[0] : elem
            );
          },
          add: function(selector, context) {
            return this.pushStack(
              jQuery.uniqueSort(
                jQuery.merge(this.get(), jQuery(selector, context))
              )
            );
          },
          addBack: function(selector) {
            return this.add(
              selector == null ? this.prevObject : this.prevObject.filter(selector)
            );
          }
        });
        function sibling(cur, dir3) {
          while ((cur = cur[dir3]) && cur.nodeType !== 1) {
          }
          return cur;
        }
        jQuery.each({
          parent: function(elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
          },
          parents: function(elem) {
            return dir2(elem, "parentNode");
          },
          parentsUntil: function(elem, _i, until) {
            return dir2(elem, "parentNode", until);
          },
          next: function(elem) {
            return sibling(elem, "nextSibling");
          },
          prev: function(elem) {
            return sibling(elem, "previousSibling");
          },
          nextAll: function(elem) {
            return dir2(elem, "nextSibling");
          },
          prevAll: function(elem) {
            return dir2(elem, "previousSibling");
          },
          nextUntil: function(elem, _i, until) {
            return dir2(elem, "nextSibling", until);
          },
          prevUntil: function(elem, _i, until) {
            return dir2(elem, "previousSibling", until);
          },
          siblings: function(elem) {
            return siblings((elem.parentNode || {}).firstChild, elem);
          },
          children: function(elem) {
            return siblings(elem.firstChild);
          },
          contents: function(elem) {
            if (elem.contentDocument != null && // Support: IE 11+
            // <object> elements with no `data` attribute has an object
            // `contentDocument` with a `null` prototype.
            getProto(elem.contentDocument)) {
              return elem.contentDocument;
            }
            if (nodeName(elem, "template")) {
              elem = elem.content || elem;
            }
            return jQuery.merge([], elem.childNodes);
          }
        }, function(name, fn) {
          jQuery.fn[name] = function(until, selector) {
            var matched = jQuery.map(this, fn, until);
            if (name.slice(-5) !== "Until") {
              selector = until;
            }
            if (selector && typeof selector === "string") {
              matched = jQuery.filter(selector, matched);
            }
            if (this.length > 1) {
              if (!guaranteedUnique[name]) {
                jQuery.uniqueSort(matched);
              }
              if (rparentsprev.test(name)) {
                matched.reverse();
              }
            }
            return this.pushStack(matched);
          };
        });
        var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
        function createOptions(options) {
          var object = {};
          jQuery.each(options.match(rnothtmlwhite) || [], function(_, flag) {
            object[flag] = true;
          });
          return object;
        }
        jQuery.Callbacks = function(options) {
          options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);
          var firing, memory, fired, locked, list = [], queue = [], firingIndex = -1, fire = function() {
            locked = locked || options.once;
            fired = firing = true;
            for (; queue.length; firingIndex = -1) {
              memory = queue.shift();
              while (++firingIndex < list.length) {
                if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
                  firingIndex = list.length;
                  memory = false;
                }
              }
            }
            if (!options.memory) {
              memory = false;
            }
            firing = false;
            if (locked) {
              if (memory) {
                list = [];
              } else {
                list = "";
              }
            }
          }, self2 = {
            // Add a callback or a collection of callbacks to the list
            add: function() {
              if (list) {
                if (memory && !firing) {
                  firingIndex = list.length - 1;
                  queue.push(memory);
                }
                (function add(args) {
                  jQuery.each(args, function(_, arg) {
                    if (isFunction(arg)) {
                      if (!options.unique || !self2.has(arg)) {
                        list.push(arg);
                      }
                    } else if (arg && arg.length && toType(arg) !== "string") {
                      add(arg);
                    }
                  });
                })(arguments);
                if (memory && !firing) {
                  fire();
                }
              }
              return this;
            },
            // Remove a callback from the list
            remove: function() {
              jQuery.each(arguments, function(_, arg) {
                var index;
                while ((index = jQuery.inArray(arg, list, index)) > -1) {
                  list.splice(index, 1);
                  if (index <= firingIndex) {
                    firingIndex--;
                  }
                }
              });
              return this;
            },
            // Check if a given callback is in the list.
            // If no argument is given, return whether or not list has callbacks attached.
            has: function(fn) {
              return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
            },
            // Remove all callbacks from the list
            empty: function() {
              if (list) {
                list = [];
              }
              return this;
            },
            // Disable .fire and .add
            // Abort any current/pending executions
            // Clear all callbacks and values
            disable: function() {
              locked = queue = [];
              list = memory = "";
              return this;
            },
            disabled: function() {
              return !list;
            },
            // Disable .fire
            // Also disable .add unless we have memory (since it would have no effect)
            // Abort any pending executions
            lock: function() {
              locked = queue = [];
              if (!memory && !firing) {
                list = memory = "";
              }
              return this;
            },
            locked: function() {
              return !!locked;
            },
            // Call all callbacks with the given context and arguments
            fireWith: function(context, args) {
              if (!locked) {
                args = args || [];
                args = [context, args.slice ? args.slice() : args];
                queue.push(args);
                if (!firing) {
                  fire();
                }
              }
              return this;
            },
            // Call all the callbacks with the given arguments
            fire: function() {
              self2.fireWith(this, arguments);
              return this;
            },
            // To know if the callbacks have already been called at least once
            fired: function() {
              return !!fired;
            }
          };
          return self2;
        };
        function Identity(v) {
          return v;
        }
        function Thrower(ex) {
          throw ex;
        }
        function adoptValue(value, resolve, reject, noValue) {
          var method;
          try {
            if (value && isFunction(method = value.promise)) {
              method.call(value).done(resolve).fail(reject);
            } else if (value && isFunction(method = value.then)) {
              method.call(value, resolve, reject);
            } else {
              resolve.apply(void 0, [value].slice(noValue));
            }
          } catch (value2) {
            reject.apply(void 0, [value2]);
          }
        }
        jQuery.extend({
          Deferred: function(func) {
            var tuples = [
              // action, add listener, callbacks,
              // ... .then handlers, argument index, [final state]
              [
                "notify",
                "progress",
                jQuery.Callbacks("memory"),
                jQuery.Callbacks("memory"),
                2
              ],
              [
                "resolve",
                "done",
                jQuery.Callbacks("once memory"),
                jQuery.Callbacks("once memory"),
                0,
                "resolved"
              ],
              [
                "reject",
                "fail",
                jQuery.Callbacks("once memory"),
                jQuery.Callbacks("once memory"),
                1,
                "rejected"
              ]
            ], state = "pending", promise = {
              state: function() {
                return state;
              },
              always: function() {
                deferred.done(arguments).fail(arguments);
                return this;
              },
              "catch": function(fn) {
                return promise.then(null, fn);
              },
              // Keep pipe for back-compat
              pipe: function() {
                var fns = arguments;
                return jQuery.Deferred(function(newDefer) {
                  jQuery.each(tuples, function(_i, tuple) {
                    var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]];
                    deferred[tuple[1]](function() {
                      var returned = fn && fn.apply(this, arguments);
                      if (returned && isFunction(returned.promise)) {
                        returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                      } else {
                        newDefer[tuple[0] + "With"](
                          this,
                          fn ? [returned] : arguments
                        );
                      }
                    });
                  });
                  fns = null;
                }).promise();
              },
              then: function(onFulfilled, onRejected, onProgress) {
                var maxDepth = 0;
                function resolve(depth, deferred2, handler, special) {
                  return function() {
                    var that = this, args = arguments, mightThrow = function() {
                      var returned, then;
                      if (depth < maxDepth) {
                        return;
                      }
                      returned = handler.apply(that, args);
                      if (returned === deferred2.promise()) {
                        throw new TypeError("Thenable self-resolution");
                      }
                      then = returned && // Support: Promises/A+ section 2.3.4
                      // https://promisesaplus.com/#point-64
                      // Only check objects and functions for thenability
                      (typeof returned === "object" || typeof returned === "function") && returned.then;
                      if (isFunction(then)) {
                        if (special) {
                          then.call(
                            returned,
                            resolve(maxDepth, deferred2, Identity, special),
                            resolve(maxDepth, deferred2, Thrower, special)
                          );
                        } else {
                          maxDepth++;
                          then.call(
                            returned,
                            resolve(maxDepth, deferred2, Identity, special),
                            resolve(maxDepth, deferred2, Thrower, special),
                            resolve(
                              maxDepth,
                              deferred2,
                              Identity,
                              deferred2.notifyWith
                            )
                          );
                        }
                      } else {
                        if (handler !== Identity) {
                          that = void 0;
                          args = [returned];
                        }
                        (special || deferred2.resolveWith)(that, args);
                      }
                    }, process2 = special ? mightThrow : function() {
                      try {
                        mightThrow();
                      } catch (e) {
                        if (jQuery.Deferred.exceptionHook) {
                          jQuery.Deferred.exceptionHook(
                            e,
                            process2.error
                          );
                        }
                        if (depth + 1 >= maxDepth) {
                          if (handler !== Thrower) {
                            that = void 0;
                            args = [e];
                          }
                          deferred2.rejectWith(that, args);
                        }
                      }
                    };
                    if (depth) {
                      process2();
                    } else {
                      if (jQuery.Deferred.getErrorHook) {
                        process2.error = jQuery.Deferred.getErrorHook();
                      } else if (jQuery.Deferred.getStackHook) {
                        process2.error = jQuery.Deferred.getStackHook();
                      }
                      window2.setTimeout(process2);
                    }
                  };
                }
                return jQuery.Deferred(function(newDefer) {
                  tuples[0][3].add(
                    resolve(
                      0,
                      newDefer,
                      isFunction(onProgress) ? onProgress : Identity,
                      newDefer.notifyWith
                    )
                  );
                  tuples[1][3].add(
                    resolve(
                      0,
                      newDefer,
                      isFunction(onFulfilled) ? onFulfilled : Identity
                    )
                  );
                  tuples[2][3].add(
                    resolve(
                      0,
                      newDefer,
                      isFunction(onRejected) ? onRejected : Thrower
                    )
                  );
                }).promise();
              },
              // Get a promise for this deferred
              // If obj is provided, the promise aspect is added to the object
              promise: function(obj) {
                return obj != null ? jQuery.extend(obj, promise) : promise;
              }
            }, deferred = {};
            jQuery.each(tuples, function(i, tuple) {
              var list = tuple[2], stateString = tuple[5];
              promise[tuple[1]] = list.add;
              if (stateString) {
                list.add(
                  function() {
                    state = stateString;
                  },
                  // rejected_callbacks.disable
                  // fulfilled_callbacks.disable
                  tuples[3 - i][2].disable,
                  // rejected_handlers.disable
                  // fulfilled_handlers.disable
                  tuples[3 - i][3].disable,
                  // progress_callbacks.lock
                  tuples[0][2].lock,
                  // progress_handlers.lock
                  tuples[0][3].lock
                );
              }
              list.add(tuple[3].fire);
              deferred[tuple[0]] = function() {
                deferred[tuple[0] + "With"](this === deferred ? void 0 : this, arguments);
                return this;
              };
              deferred[tuple[0] + "With"] = list.fireWith;
            });
            promise.promise(deferred);
            if (func) {
              func.call(deferred, deferred);
            }
            return deferred;
          },
          // Deferred helper
          when: function(singleValue) {
            var remaining = arguments.length, i = remaining, resolveContexts = Array(i), resolveValues = slice2.call(arguments), primary = jQuery.Deferred(), updateFunc = function(i2) {
              return function(value) {
                resolveContexts[i2] = this;
                resolveValues[i2] = arguments.length > 1 ? slice2.call(arguments) : value;
                if (!--remaining) {
                  primary.resolveWith(resolveContexts, resolveValues);
                }
              };
            };
            if (remaining <= 1) {
              adoptValue(
                singleValue,
                primary.done(updateFunc(i)).resolve,
                primary.reject,
                !remaining
              );
              if (primary.state() === "pending" || isFunction(resolveValues[i] && resolveValues[i].then)) {
                return primary.then();
              }
            }
            while (i--) {
              adoptValue(resolveValues[i], updateFunc(i), primary.reject);
            }
            return primary.promise();
          }
        });
        var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
        jQuery.Deferred.exceptionHook = function(error, asyncError) {
          if (window2.console && window2.console.warn && error && rerrorNames.test(error.name)) {
            window2.console.warn(
              "jQuery.Deferred exception: " + error.message,
              error.stack,
              asyncError
            );
          }
        };
        jQuery.readyException = function(error) {
          window2.setTimeout(function() {
            throw error;
          });
        };
        var readyList = jQuery.Deferred();
        jQuery.fn.ready = function(fn) {
          readyList.then(fn).catch(function(error) {
            jQuery.readyException(error);
          });
          return this;
        };
        jQuery.extend({
          // Is the DOM ready to be used? Set to true once it occurs.
          isReady: false,
          // A counter to track how many items to wait for before
          // the ready event fires. See trac-6781
          readyWait: 1,
          // Handle when the DOM is ready
          ready: function(wait) {
            if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
              return;
            }
            jQuery.isReady = true;
            if (wait !== true && --jQuery.readyWait > 0) {
              return;
            }
            readyList.resolveWith(document, [jQuery]);
          }
        });
        jQuery.ready.then = readyList.then;
        function completed() {
          document.removeEventListener("DOMContentLoaded", completed);
          window2.removeEventListener("load", completed);
          jQuery.ready();
        }
        if (document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll) {
          window2.setTimeout(jQuery.ready);
        } else {
          document.addEventListener("DOMContentLoaded", completed);
          window2.addEventListener("load", completed);
        }
        var access = function(elems, fn, key, value, chainable, emptyGet, raw) {
          var i = 0, len = elems.length, bulk = key == null;
          if (toType(key) === "object") {
            chainable = true;
            for (i in key) {
              access(elems, fn, i, key[i], true, emptyGet, raw);
            }
          } else if (value !== void 0) {
            chainable = true;
            if (!isFunction(value)) {
              raw = true;
            }
            if (bulk) {
              if (raw) {
                fn.call(elems, value);
                fn = null;
              } else {
                bulk = fn;
                fn = function(elem, _key, value2) {
                  return bulk.call(jQuery(elem), value2);
                };
              }
            }
            if (fn) {
              for (; i < len; i++) {
                fn(
                  elems[i],
                  key,
                  raw ? value : value.call(elems[i], i, fn(elems[i], key))
                );
              }
            }
          }
          if (chainable) {
            return elems;
          }
          if (bulk) {
            return fn.call(elems);
          }
          return len ? fn(elems[0], key) : emptyGet;
        };
        var rmsPrefix = /^-ms-/, rdashAlpha = /-([a-z])/g;
        function fcamelCase(_all, letter) {
          return letter.toUpperCase();
        }
        function camelCase(string) {
          return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        }
        var acceptData = function(owner) {
          return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
        };
        function Data() {
          this.expando = jQuery.expando + Data.uid++;
        }
        Data.uid = 1;
        Data.prototype = {
          cache: function(owner) {
            var value = owner[this.expando];
            if (!value) {
              value = {};
              if (acceptData(owner)) {
                if (owner.nodeType) {
                  owner[this.expando] = value;
                } else {
                  Object.defineProperty(owner, this.expando, {
                    value,
                    configurable: true
                  });
                }
              }
            }
            return value;
          },
          set: function(owner, data, value) {
            var prop, cache = this.cache(owner);
            if (typeof data === "string") {
              cache[camelCase(data)] = value;
            } else {
              for (prop in data) {
                cache[camelCase(prop)] = data[prop];
              }
            }
            return cache;
          },
          get: function(owner, key) {
            return key === void 0 ? this.cache(owner) : (
              // Always use camelCase key (gh-2257)
              owner[this.expando] && owner[this.expando][camelCase(key)]
            );
          },
          access: function(owner, key, value) {
            if (key === void 0 || key && typeof key === "string" && value === void 0) {
              return this.get(owner, key);
            }
            this.set(owner, key, value);
            return value !== void 0 ? value : key;
          },
          remove: function(owner, key) {
            var i, cache = owner[this.expando];
            if (cache === void 0) {
              return;
            }
            if (key !== void 0) {
              if (Array.isArray(key)) {
                key = key.map(camelCase);
              } else {
                key = camelCase(key);
                key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
              }
              i = key.length;
              while (i--) {
                delete cache[key[i]];
              }
            }
            if (key === void 0 || jQuery.isEmptyObject(cache)) {
              if (owner.nodeType) {
                owner[this.expando] = void 0;
              } else {
                delete owner[this.expando];
              }
            }
          },
          hasData: function(owner) {
            var cache = owner[this.expando];
            return cache !== void 0 && !jQuery.isEmptyObject(cache);
          }
        };
        var dataPriv = new Data();
        var dataUser = new Data();
        var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /[A-Z]/g;
        function getData(data) {
          if (data === "true") {
            return true;
          }
          if (data === "false") {
            return false;
          }
          if (data === "null") {
            return null;
          }
          if (data === +data + "") {
            return +data;
          }
          if (rbrace.test(data)) {
            return JSON.parse(data);
          }
          return data;
        }
        function dataAttr(elem, key, data) {
          var name;
          if (data === void 0 && elem.nodeType === 1) {
            name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
            data = elem.getAttribute(name);
            if (typeof data === "string") {
              try {
                data = getData(data);
              } catch (e) {
              }
              dataUser.set(elem, key, data);
            } else {
              data = void 0;
            }
          }
          return data;
        }
        jQuery.extend({
          hasData: function(elem) {
            return dataUser.hasData(elem) || dataPriv.hasData(elem);
          },
          data: function(elem, name, data) {
            return dataUser.access(elem, name, data);
          },
          removeData: function(elem, name) {
            dataUser.remove(elem, name);
          },
          // TODO: Now that all calls to _data and _removeData have been replaced
          // with direct calls to dataPriv methods, these can be deprecated.
          _data: function(elem, name, data) {
            return dataPriv.access(elem, name, data);
          },
          _removeData: function(elem, name) {
            dataPriv.remove(elem, name);
          }
        });
        jQuery.fn.extend({
          data: function(key, value) {
            var i, name, data, elem = this[0], attrs = elem && elem.attributes;
            if (key === void 0) {
              if (this.length) {
                data = dataUser.get(elem);
                if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
                  i = attrs.length;
                  while (i--) {
                    if (attrs[i]) {
                      name = attrs[i].name;
                      if (name.indexOf("data-") === 0) {
                        name = camelCase(name.slice(5));
                        dataAttr(elem, name, data[name]);
                      }
                    }
                  }
                  dataPriv.set(elem, "hasDataAttrs", true);
                }
              }
              return data;
            }
            if (typeof key === "object") {
              return this.each(function() {
                dataUser.set(this, key);
              });
            }
            return access(this, function(value2) {
              var data2;
              if (elem && value2 === void 0) {
                data2 = dataUser.get(elem, key);
                if (data2 !== void 0) {
                  return data2;
                }
                data2 = dataAttr(elem, key);
                if (data2 !== void 0) {
                  return data2;
                }
                return;
              }
              this.each(function() {
                dataUser.set(this, key, value2);
              });
            }, null, value, arguments.length > 1, null, true);
          },
          removeData: function(key) {
            return this.each(function() {
              dataUser.remove(this, key);
            });
          }
        });
        jQuery.extend({
          queue: function(elem, type, data) {
            var queue;
            if (elem) {
              type = (type || "fx") + "queue";
              queue = dataPriv.get(elem, type);
              if (data) {
                if (!queue || Array.isArray(data)) {
                  queue = dataPriv.access(elem, type, jQuery.makeArray(data));
                } else {
                  queue.push(data);
                }
              }
              return queue || [];
            }
          },
          dequeue: function(elem, type) {
            type = type || "fx";
            var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type), next = function() {
              jQuery.dequeue(elem, type);
            };
            if (fn === "inprogress") {
              fn = queue.shift();
              startLength--;
            }
            if (fn) {
              if (type === "fx") {
                queue.unshift("inprogress");
              }
              delete hooks.stop;
              fn.call(elem, next, hooks);
            }
            if (!startLength && hooks) {
              hooks.empty.fire();
            }
          },
          // Not public - generate a queueHooks object, or return the current one
          _queueHooks: function(elem, type) {
            var key = type + "queueHooks";
            return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
              empty: jQuery.Callbacks("once memory").add(function() {
                dataPriv.remove(elem, [type + "queue", key]);
              })
            });
          }
        });
        jQuery.fn.extend({
          queue: function(type, data) {
            var setter = 2;
            if (typeof type !== "string") {
              data = type;
              type = "fx";
              setter--;
            }
            if (arguments.length < setter) {
              return jQuery.queue(this[0], type);
            }
            return data === void 0 ? this : this.each(function() {
              var queue = jQuery.queue(this, type, data);
              jQuery._queueHooks(this, type);
              if (type === "fx" && queue[0] !== "inprogress") {
                jQuery.dequeue(this, type);
              }
            });
          },
          dequeue: function(type) {
            return this.each(function() {
              jQuery.dequeue(this, type);
            });
          },
          clearQueue: function(type) {
            return this.queue(type || "fx", []);
          },
          // Get a promise resolved when queues of a certain type
          // are emptied (fx is the type by default)
          promise: function(type, obj) {
            var tmp, count = 1, defer2 = jQuery.Deferred(), elements = this, i = this.length, resolve = function() {
              if (!--count) {
                defer2.resolveWith(elements, [elements]);
              }
            };
            if (typeof type !== "string") {
              obj = type;
              type = void 0;
            }
            type = type || "fx";
            while (i--) {
              tmp = dataPriv.get(elements[i], type + "queueHooks");
              if (tmp && tmp.empty) {
                count++;
                tmp.empty.add(resolve);
              }
            }
            resolve();
            return defer2.promise(obj);
          }
        });
        var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
        var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
        var cssExpand = ["Top", "Right", "Bottom", "Left"];
        var documentElement = document.documentElement;
        var isAttached = function(elem) {
          return jQuery.contains(elem.ownerDocument, elem);
        }, composed = { composed: true };
        if (documentElement.getRootNode) {
          isAttached = function(elem) {
            return jQuery.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
          };
        }
        var isHiddenWithinTree = function(elem, el) {
          elem = el || elem;
          return elem.style.display === "none" || elem.style.display === "" && // Otherwise, check computed style
          // Support: Firefox <=43 - 45
          // Disconnected elements can have computed display: none, so first confirm that elem is
          // in the document.
          isAttached(elem) && jQuery.css(elem, "display") === "none";
        };
        function adjustCSS(elem, prop, valueParts, tween) {
          var adjusted, scale, maxIterations = 20, currentValue = tween ? function() {
            return tween.cur();
          } : function() {
            return jQuery.css(elem, prop, "");
          }, initial = currentValue(), unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"), initialInUnit = elem.nodeType && (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));
          if (initialInUnit && initialInUnit[3] !== unit) {
            initial = initial / 2;
            unit = unit || initialInUnit[3];
            initialInUnit = +initial || 1;
            while (maxIterations--) {
              jQuery.style(elem, prop, initialInUnit + unit);
              if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
                maxIterations = 0;
              }
              initialInUnit = initialInUnit / scale;
            }
            initialInUnit = initialInUnit * 2;
            jQuery.style(elem, prop, initialInUnit + unit);
            valueParts = valueParts || [];
          }
          if (valueParts) {
            initialInUnit = +initialInUnit || +initial || 0;
            adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
            if (tween) {
              tween.unit = unit;
              tween.start = initialInUnit;
              tween.end = adjusted;
            }
          }
          return adjusted;
        }
        var defaultDisplayMap = {};
        function getDefaultDisplay(elem) {
          var temp, doc = elem.ownerDocument, nodeName2 = elem.nodeName, display = defaultDisplayMap[nodeName2];
          if (display) {
            return display;
          }
          temp = doc.body.appendChild(doc.createElement(nodeName2));
          display = jQuery.css(temp, "display");
          temp.parentNode.removeChild(temp);
          if (display === "none") {
            display = "block";
          }
          defaultDisplayMap[nodeName2] = display;
          return display;
        }
        function showHide(elements, show) {
          var display, elem, values = [], index = 0, length = elements.length;
          for (; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
              continue;
            }
            display = elem.style.display;
            if (show) {
              if (display === "none") {
                values[index] = dataPriv.get(elem, "display") || null;
                if (!values[index]) {
                  elem.style.display = "";
                }
              }
              if (elem.style.display === "" && isHiddenWithinTree(elem)) {
                values[index] = getDefaultDisplay(elem);
              }
            } else {
              if (display !== "none") {
                values[index] = "none";
                dataPriv.set(elem, "display", display);
              }
            }
          }
          for (index = 0; index < length; index++) {
            if (values[index] != null) {
              elements[index].style.display = values[index];
            }
          }
          return elements;
        }
        jQuery.fn.extend({
          show: function() {
            return showHide(this, true);
          },
          hide: function() {
            return showHide(this);
          },
          toggle: function(state) {
            if (typeof state === "boolean") {
              return state ? this.show() : this.hide();
            }
            return this.each(function() {
              if (isHiddenWithinTree(this)) {
                jQuery(this).show();
              } else {
                jQuery(this).hide();
              }
            });
          }
        });
        var rcheckableType = /^(?:checkbox|radio)$/i;
        var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
        var rscriptType = /^$|^module$|\/(?:java|ecma)script/i;
        (function() {
          var fragment = document.createDocumentFragment(), div = fragment.appendChild(document.createElement("div")), input = document.createElement("input");
          input.setAttribute("type", "radio");
          input.setAttribute("checked", "checked");
          input.setAttribute("name", "t");
          div.appendChild(input);
          support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
          div.innerHTML = "<textarea>x</textarea>";
          support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
          div.innerHTML = "<option></option>";
          support.option = !!div.lastChild;
        })();
        var wrapMap = {
          // XHTML parsers do not magically insert elements in the
          // same way that tag soup parsers do. So we cannot shorten
          // this by omitting <tbody> or other required elements.
          thead: [1, "<table>", "</table>"],
          col: [2, "<table><colgroup>", "</colgroup></table>"],
          tr: [2, "<table><tbody>", "</tbody></table>"],
          td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
          _default: [0, "", ""]
        };
        wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
        wrapMap.th = wrapMap.td;
        if (!support.option) {
          wrapMap.optgroup = wrapMap.option = [1, "<select multiple='multiple'>", "</select>"];
        }
        function getAll(context, tag) {
          var ret;
          if (typeof context.getElementsByTagName !== "undefined") {
            ret = context.getElementsByTagName(tag || "*");
          } else if (typeof context.querySelectorAll !== "undefined") {
            ret = context.querySelectorAll(tag || "*");
          } else {
            ret = [];
          }
          if (tag === void 0 || tag && nodeName(context, tag)) {
            return jQuery.merge([context], ret);
          }
          return ret;
        }
        function setGlobalEval(elems, refElements) {
          var i = 0, l = elems.length;
          for (; i < l; i++) {
            dataPriv.set(
              elems[i],
              "globalEval",
              !refElements || dataPriv.get(refElements[i], "globalEval")
            );
          }
        }
        var rhtml = /<|&#?\w+;/;
        function buildFragment(elems, context, scripts, selection, ignored) {
          var elem, tmp, tag, wrap, attached, j, fragment = context.createDocumentFragment(), nodes = [], i = 0, l = elems.length;
          for (; i < l; i++) {
            elem = elems[i];
            if (elem || elem === 0) {
              if (toType(elem) === "object") {
                jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
              } else if (!rhtml.test(elem)) {
                nodes.push(context.createTextNode(elem));
              } else {
                tmp = tmp || fragment.appendChild(context.createElement("div"));
                tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                wrap = wrapMap[tag] || wrapMap._default;
                tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];
                j = wrap[0];
                while (j--) {
                  tmp = tmp.lastChild;
                }
                jQuery.merge(nodes, tmp.childNodes);
                tmp = fragment.firstChild;
                tmp.textContent = "";
              }
            }
          }
          fragment.textContent = "";
          i = 0;
          while (elem = nodes[i++]) {
            if (selection && jQuery.inArray(elem, selection) > -1) {
              if (ignored) {
                ignored.push(elem);
              }
              continue;
            }
            attached = isAttached(elem);
            tmp = getAll(fragment.appendChild(elem), "script");
            if (attached) {
              setGlobalEval(tmp);
            }
            if (scripts) {
              j = 0;
              while (elem = tmp[j++]) {
                if (rscriptType.test(elem.type || "")) {
                  scripts.push(elem);
                }
              }
            }
          }
          return fragment;
        }
        var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
        function returnTrue() {
          return true;
        }
        function returnFalse() {
          return false;
        }
        function on(elem, types, selector, data, fn, one) {
          var origFn, type;
          if (typeof types === "object") {
            if (typeof selector !== "string") {
              data = data || selector;
              selector = void 0;
            }
            for (type in types) {
              on(elem, type, selector, data, types[type], one);
            }
            return elem;
          }
          if (data == null && fn == null) {
            fn = selector;
            data = selector = void 0;
          } else if (fn == null) {
            if (typeof selector === "string") {
              fn = data;
              data = void 0;
            } else {
              fn = data;
              data = selector;
              selector = void 0;
            }
          }
          if (fn === false) {
            fn = returnFalse;
          } else if (!fn) {
            return elem;
          }
          if (one === 1) {
            origFn = fn;
            fn = function(event) {
              jQuery().off(event);
              return origFn.apply(this, arguments);
            };
            fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
          }
          return elem.each(function() {
            jQuery.event.add(this, types, fn, data, selector);
          });
        }
        jQuery.event = {
          global: {},
          add: function(elem, types, handler, data, selector) {
            var handleObjIn, eventHandle, tmp, events, t2, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.get(elem);
            if (!acceptData(elem)) {
              return;
            }
            if (handler.handler) {
              handleObjIn = handler;
              handler = handleObjIn.handler;
              selector = handleObjIn.selector;
            }
            if (selector) {
              jQuery.find.matchesSelector(documentElement, selector);
            }
            if (!handler.guid) {
              handler.guid = jQuery.guid++;
            }
            if (!(events = elemData.events)) {
              events = elemData.events = /* @__PURE__ */ Object.create(null);
            }
            if (!(eventHandle = elemData.handle)) {
              eventHandle = elemData.handle = function(e) {
                return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : void 0;
              };
            }
            types = (types || "").match(rnothtmlwhite) || [""];
            t2 = types.length;
            while (t2--) {
              tmp = rtypenamespace.exec(types[t2]) || [];
              type = origType = tmp[1];
              namespaces = (tmp[2] || "").split(".").sort();
              if (!type) {
                continue;
              }
              special = jQuery.event.special[type] || {};
              type = (selector ? special.delegateType : special.bindType) || type;
              special = jQuery.event.special[type] || {};
              handleObj = jQuery.extend({
                type,
                origType,
                data,
                handler,
                guid: handler.guid,
                selector,
                needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                namespace: namespaces.join(".")
              }, handleObjIn);
              if (!(handlers = events[type])) {
                handlers = events[type] = [];
                handlers.delegateCount = 0;
                if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                  if (elem.addEventListener) {
                    elem.addEventListener(type, eventHandle);
                  }
                }
              }
              if (special.add) {
                special.add.call(elem, handleObj);
                if (!handleObj.handler.guid) {
                  handleObj.handler.guid = handler.guid;
                }
              }
              if (selector) {
                handlers.splice(handlers.delegateCount++, 0, handleObj);
              } else {
                handlers.push(handleObj);
              }
              jQuery.event.global[type] = true;
            }
          },
          // Detach an event or set of events from an element
          remove: function(elem, types, handler, selector, mappedTypes) {
            var j, origCount, tmp, events, t2, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
            if (!elemData || !(events = elemData.events)) {
              return;
            }
            types = (types || "").match(rnothtmlwhite) || [""];
            t2 = types.length;
            while (t2--) {
              tmp = rtypenamespace.exec(types[t2]) || [];
              type = origType = tmp[1];
              namespaces = (tmp[2] || "").split(".").sort();
              if (!type) {
                for (type in events) {
                  jQuery.event.remove(elem, type + types[t2], handler, selector, true);
                }
                continue;
              }
              special = jQuery.event.special[type] || {};
              type = (selector ? special.delegateType : special.bindType) || type;
              handlers = events[type] || [];
              tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
              origCount = j = handlers.length;
              while (j--) {
                handleObj = handlers[j];
                if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                  handlers.splice(j, 1);
                  if (handleObj.selector) {
                    handlers.delegateCount--;
                  }
                  if (special.remove) {
                    special.remove.call(elem, handleObj);
                  }
                }
              }
              if (origCount && !handlers.length) {
                if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                  jQuery.removeEvent(elem, type, elemData.handle);
                }
                delete events[type];
              }
            }
            if (jQuery.isEmptyObject(events)) {
              dataPriv.remove(elem, "handle events");
            }
          },
          dispatch: function(nativeEvent) {
            var i, j, ret, matched, handleObj, handlerQueue, args = new Array(arguments.length), event = jQuery.event.fix(nativeEvent), handlers = (dataPriv.get(this, "events") || /* @__PURE__ */ Object.create(null))[event.type] || [], special = jQuery.event.special[event.type] || {};
            args[0] = event;
            for (i = 1; i < arguments.length; i++) {
              args[i] = arguments[i];
            }
            event.delegateTarget = this;
            if (special.preDispatch && special.preDispatch.call(this, event) === false) {
              return;
            }
            handlerQueue = jQuery.event.handlers.call(this, event, handlers);
            i = 0;
            while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
              event.currentTarget = matched.elem;
              j = 0;
              while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
                if (!event.rnamespace || handleObj.namespace === false || event.rnamespace.test(handleObj.namespace)) {
                  event.handleObj = handleObj;
                  event.data = handleObj.data;
                  ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
                  if (ret !== void 0) {
                    if ((event.result = ret) === false) {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }
                }
              }
            }
            if (special.postDispatch) {
              special.postDispatch.call(this, event);
            }
            return event.result;
          },
          handlers: function(event, handlers) {
            var i, handleObj, sel, matchedHandlers, matchedSelectors, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
            if (delegateCount && // Support: IE <=9
            // Black-hole SVG <use> instance trees (trac-13180)
            cur.nodeType && // Support: Firefox <=42
            // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
            // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
            // Support: IE 11 only
            // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
            !(event.type === "click" && event.button >= 1)) {
              for (; cur !== this; cur = cur.parentNode || this) {
                if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
                  matchedHandlers = [];
                  matchedSelectors = {};
                  for (i = 0; i < delegateCount; i++) {
                    handleObj = handlers[i];
                    sel = handleObj.selector + " ";
                    if (matchedSelectors[sel] === void 0) {
                      matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
                    }
                    if (matchedSelectors[sel]) {
                      matchedHandlers.push(handleObj);
                    }
                  }
                  if (matchedHandlers.length) {
                    handlerQueue.push({ elem: cur, handlers: matchedHandlers });
                  }
                }
              }
            }
            cur = this;
            if (delegateCount < handlers.length) {
              handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
            }
            return handlerQueue;
          },
          addProp: function(name, hook) {
            Object.defineProperty(jQuery.Event.prototype, name, {
              enumerable: true,
              configurable: true,
              get: isFunction(hook) ? function() {
                if (this.originalEvent) {
                  return hook(this.originalEvent);
                }
              } : function() {
                if (this.originalEvent) {
                  return this.originalEvent[name];
                }
              },
              set: function(value) {
                Object.defineProperty(this, name, {
                  enumerable: true,
                  configurable: true,
                  writable: true,
                  value
                });
              }
            });
          },
          fix: function(originalEvent) {
            return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
          },
          special: {
            load: {
              // Prevent triggered image.load events from bubbling to window.load
              noBubble: true
            },
            click: {
              // Utilize native event to ensure correct state for checkable inputs
              setup: function(data) {
                var el = this || data;
                if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                  leverageNative(el, "click", true);
                }
                return false;
              },
              trigger: function(data) {
                var el = this || data;
                if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                  leverageNative(el, "click");
                }
                return true;
              },
              // For cross-browser consistency, suppress native .click() on links
              // Also prevent it if we're currently inside a leveraged native-event stack
              _default: function(event) {
                var target = event.target;
                return rcheckableType.test(target.type) && target.click && nodeName(target, "input") && dataPriv.get(target, "click") || nodeName(target, "a");
              }
            },
            beforeunload: {
              postDispatch: function(event) {
                if (event.result !== void 0 && event.originalEvent) {
                  event.originalEvent.returnValue = event.result;
                }
              }
            }
          }
        };
        function leverageNative(el, type, isSetup) {
          if (!isSetup) {
            if (dataPriv.get(el, type) === void 0) {
              jQuery.event.add(el, type, returnTrue);
            }
            return;
          }
          dataPriv.set(el, type, false);
          jQuery.event.add(el, type, {
            namespace: false,
            handler: function(event) {
              var result, saved = dataPriv.get(this, type);
              if (event.isTrigger & 1 && this[type]) {
                if (!saved) {
                  saved = slice2.call(arguments);
                  dataPriv.set(this, type, saved);
                  this[type]();
                  result = dataPriv.get(this, type);
                  dataPriv.set(this, type, false);
                  if (saved !== result) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    return result;
                  }
                } else if ((jQuery.event.special[type] || {}).delegateType) {
                  event.stopPropagation();
                }
              } else if (saved) {
                dataPriv.set(this, type, jQuery.event.trigger(
                  saved[0],
                  saved.slice(1),
                  this
                ));
                event.stopPropagation();
                event.isImmediatePropagationStopped = returnTrue;
              }
            }
          });
        }
        jQuery.removeEvent = function(elem, type, handle) {
          if (elem.removeEventListener) {
            elem.removeEventListener(type, handle);
          }
        };
        jQuery.Event = function(src, props) {
          if (!(this instanceof jQuery.Event)) {
            return new jQuery.Event(src, props);
          }
          if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
            this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === void 0 && // Support: Android <=2.3 only
            src.returnValue === false ? returnTrue : returnFalse;
            this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;
            this.currentTarget = src.currentTarget;
            this.relatedTarget = src.relatedTarget;
          } else {
            this.type = src;
          }
          if (props) {
            jQuery.extend(this, props);
          }
          this.timeStamp = src && src.timeStamp || Date.now();
          this[jQuery.expando] = true;
        };
        jQuery.Event.prototype = {
          constructor: jQuery.Event,
          isDefaultPrevented: returnFalse,
          isPropagationStopped: returnFalse,
          isImmediatePropagationStopped: returnFalse,
          isSimulated: false,
          preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue;
            if (e && !this.isSimulated) {
              e.preventDefault();
            }
          },
          stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = returnTrue;
            if (e && !this.isSimulated) {
              e.stopPropagation();
            }
          },
          stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = returnTrue;
            if (e && !this.isSimulated) {
              e.stopImmediatePropagation();
            }
            this.stopPropagation();
          }
        };
        jQuery.each({
          altKey: true,
          bubbles: true,
          cancelable: true,
          changedTouches: true,
          ctrlKey: true,
          detail: true,
          eventPhase: true,
          metaKey: true,
          pageX: true,
          pageY: true,
          shiftKey: true,
          view: true,
          "char": true,
          code: true,
          charCode: true,
          key: true,
          keyCode: true,
          button: true,
          buttons: true,
          clientX: true,
          clientY: true,
          offsetX: true,
          offsetY: true,
          pointerId: true,
          pointerType: true,
          screenX: true,
          screenY: true,
          targetTouches: true,
          toElement: true,
          touches: true,
          which: true
        }, jQuery.event.addProp);
        jQuery.each({ focus: "focusin", blur: "focusout" }, function(type, delegateType) {
          function focusMappedHandler(nativeEvent) {
            if (document.documentMode) {
              var handle = dataPriv.get(this, "handle"), event = jQuery.event.fix(nativeEvent);
              event.type = nativeEvent.type === "focusin" ? "focus" : "blur";
              event.isSimulated = true;
              handle(nativeEvent);
              if (event.target === event.currentTarget) {
                handle(event);
              }
            } else {
              jQuery.event.simulate(
                delegateType,
                nativeEvent.target,
                jQuery.event.fix(nativeEvent)
              );
            }
          }
          jQuery.event.special[type] = {
            // Utilize native event if possible so blur/focus sequence is correct
            setup: function() {
              var attaches;
              leverageNative(this, type, true);
              if (document.documentMode) {
                attaches = dataPriv.get(this, delegateType);
                if (!attaches) {
                  this.addEventListener(delegateType, focusMappedHandler);
                }
                dataPriv.set(this, delegateType, (attaches || 0) + 1);
              } else {
                return false;
              }
            },
            trigger: function() {
              leverageNative(this, type);
              return true;
            },
            teardown: function() {
              var attaches;
              if (document.documentMode) {
                attaches = dataPriv.get(this, delegateType) - 1;
                if (!attaches) {
                  this.removeEventListener(delegateType, focusMappedHandler);
                  dataPriv.remove(this, delegateType);
                } else {
                  dataPriv.set(this, delegateType, attaches);
                }
              } else {
                return false;
              }
            },
            // Suppress native focus or blur if we're currently inside
            // a leveraged native-event stack
            _default: function(event) {
              return dataPriv.get(event.target, type);
            },
            delegateType
          };
          jQuery.event.special[delegateType] = {
            setup: function() {
              var doc = this.ownerDocument || this.document || this, dataHolder = document.documentMode ? this : doc, attaches = dataPriv.get(dataHolder, delegateType);
              if (!attaches) {
                if (document.documentMode) {
                  this.addEventListener(delegateType, focusMappedHandler);
                } else {
                  doc.addEventListener(type, focusMappedHandler, true);
                }
              }
              dataPriv.set(dataHolder, delegateType, (attaches || 0) + 1);
            },
            teardown: function() {
              var doc = this.ownerDocument || this.document || this, dataHolder = document.documentMode ? this : doc, attaches = dataPriv.get(dataHolder, delegateType) - 1;
              if (!attaches) {
                if (document.documentMode) {
                  this.removeEventListener(delegateType, focusMappedHandler);
                } else {
                  doc.removeEventListener(type, focusMappedHandler, true);
                }
                dataPriv.remove(dataHolder, delegateType);
              } else {
                dataPriv.set(dataHolder, delegateType, attaches);
              }
            }
          };
        });
        jQuery.each({
          mouseenter: "mouseover",
          mouseleave: "mouseout",
          pointerenter: "pointerover",
          pointerleave: "pointerout"
        }, function(orig, fix) {
          jQuery.event.special[orig] = {
            delegateType: fix,
            bindType: fix,
            handle: function(event) {
              var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
              if (!related || related !== target && !jQuery.contains(target, related)) {
                event.type = handleObj.origType;
                ret = handleObj.handler.apply(this, arguments);
                event.type = fix;
              }
              return ret;
            }
          };
        });
        jQuery.fn.extend({
          on: function(types, selector, data, fn) {
            return on(this, types, selector, data, fn);
          },
          one: function(types, selector, data, fn) {
            return on(this, types, selector, data, fn, 1);
          },
          off: function(types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) {
              handleObj = types.handleObj;
              jQuery(types.delegateTarget).off(
                handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
                handleObj.selector,
                handleObj.handler
              );
              return this;
            }
            if (typeof types === "object") {
              for (type in types) {
                this.off(type, selector, types[type]);
              }
              return this;
            }
            if (selector === false || typeof selector === "function") {
              fn = selector;
              selector = void 0;
            }
            if (fn === false) {
              fn = returnFalse;
            }
            return this.each(function() {
              jQuery.event.remove(this, types, fn, selector);
            });
          }
        });
        var rnoInnerhtml = /<script|<style|<link/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
        function manipulationTarget(elem, content) {
          if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {
            return jQuery(elem).children("tbody")[0] || elem;
          }
          return elem;
        }
        function disableScript(elem) {
          elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
          return elem;
        }
        function restoreScript(elem) {
          if ((elem.type || "").slice(0, 5) === "true/") {
            elem.type = elem.type.slice(5);
          } else {
            elem.removeAttribute("type");
          }
          return elem;
        }
        function cloneCopyEvent(src, dest) {
          var i, l, type, pdataOld, udataOld, udataCur, events;
          if (dest.nodeType !== 1) {
            return;
          }
          if (dataPriv.hasData(src)) {
            pdataOld = dataPriv.get(src);
            events = pdataOld.events;
            if (events) {
              dataPriv.remove(dest, "handle events");
              for (type in events) {
                for (i = 0, l = events[type].length; i < l; i++) {
                  jQuery.event.add(dest, type, events[type][i]);
                }
              }
            }
          }
          if (dataUser.hasData(src)) {
            udataOld = dataUser.access(src);
            udataCur = jQuery.extend({}, udataOld);
            dataUser.set(dest, udataCur);
          }
        }
        function fixInput(src, dest) {
          var nodeName2 = dest.nodeName.toLowerCase();
          if (nodeName2 === "input" && rcheckableType.test(src.type)) {
            dest.checked = src.checked;
          } else if (nodeName2 === "input" || nodeName2 === "textarea") {
            dest.defaultValue = src.defaultValue;
          }
        }
        function domManip(collection, args, callback, ignored) {
          args = flat(args);
          var fragment, first, scripts, hasScripts, node, doc, i = 0, l = collection.length, iNoClone = l - 1, value = args[0], valueIsFunction = isFunction(value);
          if (valueIsFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
            return collection.each(function(index) {
              var self2 = collection.eq(index);
              if (valueIsFunction) {
                args[0] = value.call(this, index, self2.html());
              }
              domManip(self2, args, callback, ignored);
            });
          }
          if (l) {
            fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
            first = fragment.firstChild;
            if (fragment.childNodes.length === 1) {
              fragment = first;
            }
            if (first || ignored) {
              scripts = jQuery.map(getAll(fragment, "script"), disableScript);
              hasScripts = scripts.length;
              for (; i < l; i++) {
                node = fragment;
                if (i !== iNoClone) {
                  node = jQuery.clone(node, true, true);
                  if (hasScripts) {
                    jQuery.merge(scripts, getAll(node, "script"));
                  }
                }
                callback.call(collection[i], node, i);
              }
              if (hasScripts) {
                doc = scripts[scripts.length - 1].ownerDocument;
                jQuery.map(scripts, restoreScript);
                for (i = 0; i < hasScripts; i++) {
                  node = scripts[i];
                  if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node)) {
                    if (node.src && (node.type || "").toLowerCase() !== "module") {
                      if (jQuery._evalUrl && !node.noModule) {
                        jQuery._evalUrl(node.src, {
                          nonce: node.nonce || node.getAttribute("nonce")
                        }, doc);
                      }
                    } else {
                      DOMEval(node.textContent.replace(rcleanScript, ""), node, doc);
                    }
                  }
                }
              }
            }
          }
          return collection;
        }
        function remove(elem, selector, keepData) {
          var node, nodes = selector ? jQuery.filter(selector, elem) : elem, i = 0;
          for (; (node = nodes[i]) != null; i++) {
            if (!keepData && node.nodeType === 1) {
              jQuery.cleanData(getAll(node));
            }
            if (node.parentNode) {
              if (keepData && isAttached(node)) {
                setGlobalEval(getAll(node, "script"));
              }
              node.parentNode.removeChild(node);
            }
          }
          return elem;
        }
        jQuery.extend({
          htmlPrefilter: function(html) {
            return html;
          },
          clone: function(elem, dataAndEvents, deepDataAndEvents) {
            var i, l, srcElements, destElements, clone = elem.cloneNode(true), inPage = isAttached(elem);
            if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
              destElements = getAll(clone);
              srcElements = getAll(elem);
              for (i = 0, l = srcElements.length; i < l; i++) {
                fixInput(srcElements[i], destElements[i]);
              }
            }
            if (dataAndEvents) {
              if (deepDataAndEvents) {
                srcElements = srcElements || getAll(elem);
                destElements = destElements || getAll(clone);
                for (i = 0, l = srcElements.length; i < l; i++) {
                  cloneCopyEvent(srcElements[i], destElements[i]);
                }
              } else {
                cloneCopyEvent(elem, clone);
              }
            }
            destElements = getAll(clone, "script");
            if (destElements.length > 0) {
              setGlobalEval(destElements, !inPage && getAll(elem, "script"));
            }
            return clone;
          },
          cleanData: function(elems) {
            var data, elem, type, special = jQuery.event.special, i = 0;
            for (; (elem = elems[i]) !== void 0; i++) {
              if (acceptData(elem)) {
                if (data = elem[dataPriv.expando]) {
                  if (data.events) {
                    for (type in data.events) {
                      if (special[type]) {
                        jQuery.event.remove(elem, type);
                      } else {
                        jQuery.removeEvent(elem, type, data.handle);
                      }
                    }
                  }
                  elem[dataPriv.expando] = void 0;
                }
                if (elem[dataUser.expando]) {
                  elem[dataUser.expando] = void 0;
                }
              }
            }
          }
        });
        jQuery.fn.extend({
          detach: function(selector) {
            return remove(this, selector, true);
          },
          remove: function(selector) {
            return remove(this, selector);
          },
          text: function(value) {
            return access(this, function(value2) {
              return value2 === void 0 ? jQuery.text(this) : this.empty().each(function() {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                  this.textContent = value2;
                }
              });
            }, null, value, arguments.length);
          },
          append: function() {
            return domManip(this, arguments, function(elem) {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                var target = manipulationTarget(this, elem);
                target.appendChild(elem);
              }
            });
          },
          prepend: function() {
            return domManip(this, arguments, function(elem) {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                var target = manipulationTarget(this, elem);
                target.insertBefore(elem, target.firstChild);
              }
            });
          },
          before: function() {
            return domManip(this, arguments, function(elem) {
              if (this.parentNode) {
                this.parentNode.insertBefore(elem, this);
              }
            });
          },
          after: function() {
            return domManip(this, arguments, function(elem) {
              if (this.parentNode) {
                this.parentNode.insertBefore(elem, this.nextSibling);
              }
            });
          },
          empty: function() {
            var elem, i = 0;
            for (; (elem = this[i]) != null; i++) {
              if (elem.nodeType === 1) {
                jQuery.cleanData(getAll(elem, false));
                elem.textContent = "";
              }
            }
            return this;
          },
          clone: function(dataAndEvents, deepDataAndEvents) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
            return this.map(function() {
              return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
          },
          html: function(value) {
            return access(this, function(value2) {
              var elem = this[0] || {}, i = 0, l = this.length;
              if (value2 === void 0 && elem.nodeType === 1) {
                return elem.innerHTML;
              }
              if (typeof value2 === "string" && !rnoInnerhtml.test(value2) && !wrapMap[(rtagName.exec(value2) || ["", ""])[1].toLowerCase()]) {
                value2 = jQuery.htmlPrefilter(value2);
                try {
                  for (; i < l; i++) {
                    elem = this[i] || {};
                    if (elem.nodeType === 1) {
                      jQuery.cleanData(getAll(elem, false));
                      elem.innerHTML = value2;
                    }
                  }
                  elem = 0;
                } catch (e) {
                }
              }
              if (elem) {
                this.empty().append(value2);
              }
            }, null, value, arguments.length);
          },
          replaceWith: function() {
            var ignored = [];
            return domManip(this, arguments, function(elem) {
              var parent = this.parentNode;
              if (jQuery.inArray(this, ignored) < 0) {
                jQuery.cleanData(getAll(this));
                if (parent) {
                  parent.replaceChild(elem, this);
                }
              }
            }, ignored);
          }
        });
        jQuery.each({
          appendTo: "append",
          prependTo: "prepend",
          insertBefore: "before",
          insertAfter: "after",
          replaceAll: "replaceWith"
        }, function(name, original) {
          jQuery.fn[name] = function(selector) {
            var elems, ret = [], insert = jQuery(selector), last = insert.length - 1, i = 0;
            for (; i <= last; i++) {
              elems = i === last ? this : this.clone(true);
              jQuery(insert[i])[original](elems);
              push.apply(ret, elems.get());
            }
            return this.pushStack(ret);
          };
        });
        var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
        var rcustomProp = /^--/;
        var getStyles = function(elem) {
          var view = elem.ownerDocument.defaultView;
          if (!view || !view.opener) {
            view = window2;
          }
          return view.getComputedStyle(elem);
        };
        var swap = function(elem, options, callback) {
          var ret, name, old = {};
          for (name in options) {
            old[name] = elem.style[name];
            elem.style[name] = options[name];
          }
          ret = callback.call(elem);
          for (name in options) {
            elem.style[name] = old[name];
          }
          return ret;
        };
        var rboxStyle = new RegExp(cssExpand.join("|"), "i");
        (function() {
          function computeStyleTests() {
            if (!div) {
              return;
            }
            container.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0";
            div.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%";
            documentElement.appendChild(container).appendChild(div);
            var divStyle = window2.getComputedStyle(div);
            pixelPositionVal = divStyle.top !== "1%";
            reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12;
            div.style.right = "60%";
            pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36;
            boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36;
            div.style.position = "absolute";
            scrollboxSizeVal = roundPixelMeasures(div.offsetWidth / 3) === 12;
            documentElement.removeChild(container);
            div = null;
          }
          function roundPixelMeasures(measure) {
            return Math.round(parseFloat(measure));
          }
          var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal, reliableTrDimensionsVal, reliableMarginLeftVal, container = document.createElement("div"), div = document.createElement("div");
          if (!div.style) {
            return;
          }
          div.style.backgroundClip = "content-box";
          div.cloneNode(true).style.backgroundClip = "";
          support.clearCloneStyle = div.style.backgroundClip === "content-box";
          jQuery.extend(support, {
            boxSizingReliable: function() {
              computeStyleTests();
              return boxSizingReliableVal;
            },
            pixelBoxStyles: function() {
              computeStyleTests();
              return pixelBoxStylesVal;
            },
            pixelPosition: function() {
              computeStyleTests();
              return pixelPositionVal;
            },
            reliableMarginLeft: function() {
              computeStyleTests();
              return reliableMarginLeftVal;
            },
            scrollboxSize: function() {
              computeStyleTests();
              return scrollboxSizeVal;
            },
            // Support: IE 9 - 11+, Edge 15 - 18+
            // IE/Edge misreport `getComputedStyle` of table rows with width/height
            // set in CSS while `offset*` properties report correct values.
            // Behavior in IE 9 is more subtle than in newer versions & it passes
            // some versions of this test; make sure not to make it pass there!
            //
            // Support: Firefox 70+
            // Only Firefox includes border widths
            // in computed dimensions. (gh-4529)
            reliableTrDimensions: function() {
              var table, tr, trChild, trStyle;
              if (reliableTrDimensionsVal == null) {
                table = document.createElement("table");
                tr = document.createElement("tr");
                trChild = document.createElement("div");
                table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
                tr.style.cssText = "box-sizing:content-box;border:1px solid";
                tr.style.height = "1px";
                trChild.style.height = "9px";
                trChild.style.display = "block";
                documentElement.appendChild(table).appendChild(tr).appendChild(trChild);
                trStyle = window2.getComputedStyle(tr);
                reliableTrDimensionsVal = parseInt(trStyle.height, 10) + parseInt(trStyle.borderTopWidth, 10) + parseInt(trStyle.borderBottomWidth, 10) === tr.offsetHeight;
                documentElement.removeChild(table);
              }
              return reliableTrDimensionsVal;
            }
          });
        })();
        function curCSS(elem, name, computed) {
          var width, minWidth, maxWidth, ret, isCustomProp = rcustomProp.test(name), style = elem.style;
          computed = computed || getStyles(elem);
          if (computed) {
            ret = computed.getPropertyValue(name) || computed[name];
            if (isCustomProp && ret) {
              ret = ret.replace(rtrimCSS, "$1") || void 0;
            }
            if (ret === "" && !isAttached(elem)) {
              ret = jQuery.style(elem, name);
            }
            if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {
              width = style.width;
              minWidth = style.minWidth;
              maxWidth = style.maxWidth;
              style.minWidth = style.maxWidth = style.width = ret;
              ret = computed.width;
              style.width = width;
              style.minWidth = minWidth;
              style.maxWidth = maxWidth;
            }
          }
          return ret !== void 0 ? (
            // Support: IE <=9 - 11 only
            // IE returns zIndex value as an integer.
            ret + ""
          ) : ret;
        }
        function addGetHookIf(conditionFn, hookFn) {
          return {
            get: function() {
              if (conditionFn()) {
                delete this.get;
                return;
              }
              return (this.get = hookFn).apply(this, arguments);
            }
          };
        }
        var cssPrefixes = ["Webkit", "Moz", "ms"], emptyStyle = document.createElement("div").style, vendorProps = {};
        function vendorPropName(name) {
          var capName = name[0].toUpperCase() + name.slice(1), i = cssPrefixes.length;
          while (i--) {
            name = cssPrefixes[i] + capName;
            if (name in emptyStyle) {
              return name;
            }
          }
        }
        function finalPropName(name) {
          var final = jQuery.cssProps[name] || vendorProps[name];
          if (final) {
            return final;
          }
          if (name in emptyStyle) {
            return name;
          }
          return vendorProps[name] = vendorPropName(name) || name;
        }
        var rdisplayswap = /^(none|table(?!-c[ea]).+)/, cssShow = { position: "absolute", visibility: "hidden", display: "block" }, cssNormalTransform = {
          letterSpacing: "0",
          fontWeight: "400"
        };
        function setPositiveNumber(_elem, value, subtract) {
          var matches = rcssNum.exec(value);
          return matches ? (
            // Guard against undefined "subtract", e.g., when used as in cssHooks
            Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px")
          ) : value;
        }
        function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
          var i = dimension === "width" ? 1 : 0, extra = 0, delta = 0, marginDelta = 0;
          if (box === (isBorderBox ? "border" : "content")) {
            return 0;
          }
          for (; i < 4; i += 2) {
            if (box === "margin") {
              marginDelta += jQuery.css(elem, box + cssExpand[i], true, styles);
            }
            if (!isBorderBox) {
              delta += jQuery.css(elem, "padding" + cssExpand[i], true, styles);
              if (box !== "padding") {
                delta += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
              } else {
                extra += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
              }
            } else {
              if (box === "content") {
                delta -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
              }
              if (box !== "margin") {
                delta -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
              }
            }
          }
          if (!isBorderBox && computedVal >= 0) {
            delta += Math.max(0, Math.ceil(
              elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - 0.5
              // If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
              // Use an explicit zero to avoid NaN (gh-3964)
            )) || 0;
          }
          return delta + marginDelta;
        }
        function getWidthOrHeight(elem, dimension, extra) {
          var styles = getStyles(elem), boxSizingNeeded = !support.boxSizingReliable() || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box", valueIsBorderBox = isBorderBox, val = curCSS(elem, dimension, styles), offsetProp = "offset" + dimension[0].toUpperCase() + dimension.slice(1);
          if (rnumnonpx.test(val)) {
            if (!extra) {
              return val;
            }
            val = "auto";
          }
          if ((!support.boxSizingReliable() && isBorderBox || // Support: IE 10 - 11+, Edge 15 - 18+
          // IE/Edge misreport `getComputedStyle` of table rows with width/height
          // set in CSS while `offset*` properties report correct values.
          // Interestingly, in some cases IE 9 doesn't suffer from this issue.
          !support.reliableTrDimensions() && nodeName(elem, "tr") || // Fall back to offsetWidth/offsetHeight when value is "auto"
          // This happens for inline elements with no explicit setting (gh-3571)
          val === "auto" || // Support: Android <=4.1 - 4.3 only
          // Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
          !parseFloat(val) && jQuery.css(elem, "display", false, styles) === "inline") && // Make sure the element is visible & connected
          elem.getClientRects().length) {
            isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";
            valueIsBorderBox = offsetProp in elem;
            if (valueIsBorderBox) {
              val = elem[offsetProp];
            }
          }
          val = parseFloat(val) || 0;
          return val + boxModelAdjustment(
            elem,
            dimension,
            extra || (isBorderBox ? "border" : "content"),
            valueIsBorderBox,
            styles,
            // Provide the current computed size to request scroll gutter calculation (gh-3589)
            val
          ) + "px";
        }
        jQuery.extend({
          // Add in style property hooks for overriding the default
          // behavior of getting and setting a style property
          cssHooks: {
            opacity: {
              get: function(elem, computed) {
                if (computed) {
                  var ret = curCSS(elem, "opacity");
                  return ret === "" ? "1" : ret;
                }
              }
            }
          },
          // Don't automatically add "px" to these possibly-unitless properties
          cssNumber: {
            animationIterationCount: true,
            aspectRatio: true,
            borderImageSlice: true,
            columnCount: true,
            flexGrow: true,
            flexShrink: true,
            fontWeight: true,
            gridArea: true,
            gridColumn: true,
            gridColumnEnd: true,
            gridColumnStart: true,
            gridRow: true,
            gridRowEnd: true,
            gridRowStart: true,
            lineHeight: true,
            opacity: true,
            order: true,
            orphans: true,
            scale: true,
            widows: true,
            zIndex: true,
            zoom: true,
            // SVG-related
            fillOpacity: true,
            floodOpacity: true,
            stopOpacity: true,
            strokeMiterlimit: true,
            strokeOpacity: true
          },
          // Add in properties whose names you wish to fix before
          // setting or getting the value
          cssProps: {},
          // Get and set the style property on a DOM Node
          style: function(elem, name, value, extra) {
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
              return;
            }
            var ret, type, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name), style = elem.style;
            if (!isCustomProp) {
              name = finalPropName(origName);
            }
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
            if (value !== void 0) {
              type = typeof value;
              if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
                value = adjustCSS(elem, name, ret);
                type = "number";
              }
              if (value == null || value !== value) {
                return;
              }
              if (type === "number" && !isCustomProp) {
                value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
              }
              if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
                style[name] = "inherit";
              }
              if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== void 0) {
                if (isCustomProp) {
                  style.setProperty(name, value);
                } else {
                  style[name] = value;
                }
              }
            } else {
              if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== void 0) {
                return ret;
              }
              return style[name];
            }
          },
          css: function(elem, name, extra, styles) {
            var val, num, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name);
            if (!isCustomProp) {
              name = finalPropName(origName);
            }
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
            if (hooks && "get" in hooks) {
              val = hooks.get(elem, true, extra);
            }
            if (val === void 0) {
              val = curCSS(elem, name, styles);
            }
            if (val === "normal" && name in cssNormalTransform) {
              val = cssNormalTransform[name];
            }
            if (extra === "" || extra) {
              num = parseFloat(val);
              return extra === true || isFinite(num) ? num || 0 : val;
            }
            return val;
          }
        });
        jQuery.each(["height", "width"], function(_i, dimension) {
          jQuery.cssHooks[dimension] = {
            get: function(elem, computed, extra) {
              if (computed) {
                return rdisplayswap.test(jQuery.css(elem, "display")) && // Support: Safari 8+
                // Table columns in Safari have non-zero offsetWidth & zero
                // getBoundingClientRect().width unless display is changed.
                // Support: IE <=11 only
                // Running getBoundingClientRect on a disconnected node
                // in IE throws an error.
                (!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function() {
                  return getWidthOrHeight(elem, dimension, extra);
                }) : getWidthOrHeight(elem, dimension, extra);
              }
            },
            set: function(elem, value, extra) {
              var matches, styles = getStyles(elem), scrollboxSizeBuggy = !support.scrollboxSize() && styles.position === "absolute", boxSizingNeeded = scrollboxSizeBuggy || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box", subtract = extra ? boxModelAdjustment(
                elem,
                dimension,
                extra,
                isBorderBox,
                styles
              ) : 0;
              if (isBorderBox && scrollboxSizeBuggy) {
                subtract -= Math.ceil(
                  elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles[dimension]) - boxModelAdjustment(elem, dimension, "border", false, styles) - 0.5
                );
              }
              if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {
                elem.style[dimension] = value;
                value = jQuery.css(elem, dimension);
              }
              return setPositiveNumber(elem, value, subtract);
            }
          };
        });
        jQuery.cssHooks.marginLeft = addGetHookIf(
          support.reliableMarginLeft,
          function(elem, computed) {
            if (computed) {
              return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function() {
                return elem.getBoundingClientRect().left;
              })) + "px";
            }
          }
        );
        jQuery.each({
          margin: "",
          padding: "",
          border: "Width"
        }, function(prefix, suffix) {
          jQuery.cssHooks[prefix + suffix] = {
            expand: function(value) {
              var i = 0, expanded = {}, parts = typeof value === "string" ? value.split(" ") : [value];
              for (; i < 4; i++) {
                expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
              }
              return expanded;
            }
          };
          if (prefix !== "margin") {
            jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
          }
        });
        jQuery.fn.extend({
          css: function(name, value) {
            return access(this, function(elem, name2, value2) {
              var styles, len, map = {}, i = 0;
              if (Array.isArray(name2)) {
                styles = getStyles(elem);
                len = name2.length;
                for (; i < len; i++) {
                  map[name2[i]] = jQuery.css(elem, name2[i], false, styles);
                }
                return map;
              }
              return value2 !== void 0 ? jQuery.style(elem, name2, value2) : jQuery.css(elem, name2);
            }, name, value, arguments.length > 1);
          }
        });
        function Tween(elem, options, prop, end, easing) {
          return new Tween.prototype.init(elem, options, prop, end, easing);
        }
        jQuery.Tween = Tween;
        Tween.prototype = {
          constructor: Tween,
          init: function(elem, options, prop, end, easing, unit) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || jQuery.easing._default;
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
          },
          cur: function() {
            var hooks = Tween.propHooks[this.prop];
            return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
          },
          run: function(percent) {
            var eased, hooks = Tween.propHooks[this.prop];
            if (this.options.duration) {
              this.pos = eased = jQuery.easing[this.easing](
                percent,
                this.options.duration * percent,
                0,
                1,
                this.options.duration
              );
            } else {
              this.pos = eased = percent;
            }
            this.now = (this.end - this.start) * eased + this.start;
            if (this.options.step) {
              this.options.step.call(this.elem, this.now, this);
            }
            if (hooks && hooks.set) {
              hooks.set(this);
            } else {
              Tween.propHooks._default.set(this);
            }
            return this;
          }
        };
        Tween.prototype.init.prototype = Tween.prototype;
        Tween.propHooks = {
          _default: {
            get: function(tween) {
              var result;
              if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
                return tween.elem[tween.prop];
              }
              result = jQuery.css(tween.elem, tween.prop, "");
              return !result || result === "auto" ? 0 : result;
            },
            set: function(tween) {
              if (jQuery.fx.step[tween.prop]) {
                jQuery.fx.step[tween.prop](tween);
              } else if (tween.elem.nodeType === 1 && (jQuery.cssHooks[tween.prop] || tween.elem.style[finalPropName(tween.prop)] != null)) {
                jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
              } else {
                tween.elem[tween.prop] = tween.now;
              }
            }
          }
        };
        Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
          set: function(tween) {
            if (tween.elem.nodeType && tween.elem.parentNode) {
              tween.elem[tween.prop] = tween.now;
            }
          }
        };
        jQuery.easing = {
          linear: function(p) {
            return p;
          },
          swing: function(p) {
            return 0.5 - Math.cos(p * Math.PI) / 2;
          },
          _default: "swing"
        };
        jQuery.fx = Tween.prototype.init;
        jQuery.fx.step = {};
        var fxNow, inProgress, rfxtypes = /^(?:toggle|show|hide)$/, rrun = /queueHooks$/;
        function schedule() {
          if (inProgress) {
            if (document.hidden === false && window2.requestAnimationFrame) {
              window2.requestAnimationFrame(schedule);
            } else {
              window2.setTimeout(schedule, jQuery.fx.interval);
            }
            jQuery.fx.tick();
          }
        }
        function createFxNow() {
          window2.setTimeout(function() {
            fxNow = void 0;
          });
          return fxNow = Date.now();
        }
        function genFx(type, includeWidth) {
          var which, i = 0, attrs = { height: type };
          includeWidth = includeWidth ? 1 : 0;
          for (; i < 4; i += 2 - includeWidth) {
            which = cssExpand[i];
            attrs["margin" + which] = attrs["padding" + which] = type;
          }
          if (includeWidth) {
            attrs.opacity = attrs.width = type;
          }
          return attrs;
        }
        function createTween(value, prop, animation) {
          var tween, collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]), index = 0, length = collection.length;
          for (; index < length; index++) {
            if (tween = collection[index].call(animation, prop, value)) {
              return tween;
            }
          }
        }
        function defaultPrefilter(elem, props, opts) {
          var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display, isBox = "width" in props || "height" in props, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHiddenWithinTree(elem), dataShow = dataPriv.get(elem, "fxshow");
          if (!opts.queue) {
            hooks = jQuery._queueHooks(elem, "fx");
            if (hooks.unqueued == null) {
              hooks.unqueued = 0;
              oldfire = hooks.empty.fire;
              hooks.empty.fire = function() {
                if (!hooks.unqueued) {
                  oldfire();
                }
              };
            }
            hooks.unqueued++;
            anim.always(function() {
              anim.always(function() {
                hooks.unqueued--;
                if (!jQuery.queue(elem, "fx").length) {
                  hooks.empty.fire();
                }
              });
            });
          }
          for (prop in props) {
            value = props[prop];
            if (rfxtypes.test(value)) {
              delete props[prop];
              toggle = toggle || value === "toggle";
              if (value === (hidden ? "hide" : "show")) {
                if (value === "show" && dataShow && dataShow[prop] !== void 0) {
                  hidden = true;
                } else {
                  continue;
                }
              }
              orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
            }
          }
          propTween = !jQuery.isEmptyObject(props);
          if (!propTween && jQuery.isEmptyObject(orig)) {
            return;
          }
          if (isBox && elem.nodeType === 1) {
            opts.overflow = [style.overflow, style.overflowX, style.overflowY];
            restoreDisplay = dataShow && dataShow.display;
            if (restoreDisplay == null) {
              restoreDisplay = dataPriv.get(elem, "display");
            }
            display = jQuery.css(elem, "display");
            if (display === "none") {
              if (restoreDisplay) {
                display = restoreDisplay;
              } else {
                showHide([elem], true);
                restoreDisplay = elem.style.display || restoreDisplay;
                display = jQuery.css(elem, "display");
                showHide([elem]);
              }
            }
            if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
              if (jQuery.css(elem, "float") === "none") {
                if (!propTween) {
                  anim.done(function() {
                    style.display = restoreDisplay;
                  });
                  if (restoreDisplay == null) {
                    display = style.display;
                    restoreDisplay = display === "none" ? "" : display;
                  }
                }
                style.display = "inline-block";
              }
            }
          }
          if (opts.overflow) {
            style.overflow = "hidden";
            anim.always(function() {
              style.overflow = opts.overflow[0];
              style.overflowX = opts.overflow[1];
              style.overflowY = opts.overflow[2];
            });
          }
          propTween = false;
          for (prop in orig) {
            if (!propTween) {
              if (dataShow) {
                if ("hidden" in dataShow) {
                  hidden = dataShow.hidden;
                }
              } else {
                dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
              }
              if (toggle) {
                dataShow.hidden = !hidden;
              }
              if (hidden) {
                showHide([elem], true);
              }
              anim.done(function() {
                if (!hidden) {
                  showHide([elem]);
                }
                dataPriv.remove(elem, "fxshow");
                for (prop in orig) {
                  jQuery.style(elem, prop, orig[prop]);
                }
              });
            }
            propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
            if (!(prop in dataShow)) {
              dataShow[prop] = propTween.start;
              if (hidden) {
                propTween.end = propTween.start;
                propTween.start = 0;
              }
            }
          }
        }
        function propFilter(props, specialEasing) {
          var index, name, easing, value, hooks;
          for (index in props) {
            name = camelCase(index);
            easing = specialEasing[name];
            value = props[index];
            if (Array.isArray(value)) {
              easing = value[1];
              value = props[index] = value[0];
            }
            if (index !== name) {
              props[name] = value;
              delete props[index];
            }
            hooks = jQuery.cssHooks[name];
            if (hooks && "expand" in hooks) {
              value = hooks.expand(value);
              delete props[name];
              for (index in value) {
                if (!(index in props)) {
                  props[index] = value[index];
                  specialEasing[index] = easing;
                }
              }
            } else {
              specialEasing[name] = easing;
            }
          }
        }
        function Animation(elem, properties, options) {
          var result, stopped, index = 0, length = Animation.prefilters.length, deferred = jQuery.Deferred().always(function() {
            delete tick.elem;
          }), tick = function() {
            if (stopped) {
              return false;
            }
            var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), temp = remaining / animation.duration || 0, percent = 1 - temp, index2 = 0, length2 = animation.tweens.length;
            for (; index2 < length2; index2++) {
              animation.tweens[index2].run(percent);
            }
            deferred.notifyWith(elem, [animation, percent, remaining]);
            if (percent < 1 && length2) {
              return remaining;
            }
            if (!length2) {
              deferred.notifyWith(elem, [animation, 1, 0]);
            }
            deferred.resolveWith(elem, [animation]);
            return false;
          }, animation = deferred.promise({
            elem,
            props: jQuery.extend({}, properties),
            opts: jQuery.extend(true, {
              specialEasing: {},
              easing: jQuery.easing._default
            }, options),
            originalProperties: properties,
            originalOptions: options,
            startTime: fxNow || createFxNow(),
            duration: options.duration,
            tweens: [],
            createTween: function(prop, end) {
              var tween = jQuery.Tween(
                elem,
                animation.opts,
                prop,
                end,
                animation.opts.specialEasing[prop] || animation.opts.easing
              );
              animation.tweens.push(tween);
              return tween;
            },
            stop: function(gotoEnd) {
              var index2 = 0, length2 = gotoEnd ? animation.tweens.length : 0;
              if (stopped) {
                return this;
              }
              stopped = true;
              for (; index2 < length2; index2++) {
                animation.tweens[index2].run(1);
              }
              if (gotoEnd) {
                deferred.notifyWith(elem, [animation, 1, 0]);
                deferred.resolveWith(elem, [animation, gotoEnd]);
              } else {
                deferred.rejectWith(elem, [animation, gotoEnd]);
              }
              return this;
            }
          }), props = animation.props;
          propFilter(props, animation.opts.specialEasing);
          for (; index < length; index++) {
            result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
            if (result) {
              if (isFunction(result.stop)) {
                jQuery._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result);
              }
              return result;
            }
          }
          jQuery.map(props, createTween, animation);
          if (isFunction(animation.opts.start)) {
            animation.opts.start.call(elem, animation);
          }
          animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
          jQuery.fx.timer(
            jQuery.extend(tick, {
              elem,
              anim: animation,
              queue: animation.opts.queue
            })
          );
          return animation;
        }
        jQuery.Animation = jQuery.extend(Animation, {
          tweeners: {
            "*": [function(prop, value) {
              var tween = this.createTween(prop, value);
              adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
              return tween;
            }]
          },
          tweener: function(props, callback) {
            if (isFunction(props)) {
              callback = props;
              props = ["*"];
            } else {
              props = props.match(rnothtmlwhite);
            }
            var prop, index = 0, length = props.length;
            for (; index < length; index++) {
              prop = props[index];
              Animation.tweeners[prop] = Animation.tweeners[prop] || [];
              Animation.tweeners[prop].unshift(callback);
            }
          },
          prefilters: [defaultPrefilter],
          prefilter: function(callback, prepend) {
            if (prepend) {
              Animation.prefilters.unshift(callback);
            } else {
              Animation.prefilters.push(callback);
            }
          }
        });
        jQuery.speed = function(speed, easing, fn) {
          var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
            complete: fn || !fn && easing || isFunction(speed) && speed,
            duration: speed,
            easing: fn && easing || easing && !isFunction(easing) && easing
          };
          if (jQuery.fx.off) {
            opt.duration = 0;
          } else {
            if (typeof opt.duration !== "number") {
              if (opt.duration in jQuery.fx.speeds) {
                opt.duration = jQuery.fx.speeds[opt.duration];
              } else {
                opt.duration = jQuery.fx.speeds._default;
              }
            }
          }
          if (opt.queue == null || opt.queue === true) {
            opt.queue = "fx";
          }
          opt.old = opt.complete;
          opt.complete = function() {
            if (isFunction(opt.old)) {
              opt.old.call(this);
            }
            if (opt.queue) {
              jQuery.dequeue(this, opt.queue);
            }
          };
          return opt;
        };
        jQuery.fn.extend({
          fadeTo: function(speed, to, easing, callback) {
            return this.filter(isHiddenWithinTree).css("opacity", 0).show().end().animate({ opacity: to }, speed, easing, callback);
          },
          animate: function(prop, speed, easing, callback) {
            var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
              var anim = Animation(this, jQuery.extend({}, prop), optall);
              if (empty || dataPriv.get(this, "finish")) {
                anim.stop(true);
              }
            };
            doAnimation.finish = doAnimation;
            return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
          },
          stop: function(type, clearQueue, gotoEnd) {
            var stopQueue = function(hooks) {
              var stop = hooks.stop;
              delete hooks.stop;
              stop(gotoEnd);
            };
            if (typeof type !== "string") {
              gotoEnd = clearQueue;
              clearQueue = type;
              type = void 0;
            }
            if (clearQueue) {
              this.queue(type || "fx", []);
            }
            return this.each(function() {
              var dequeue = true, index = type != null && type + "queueHooks", timers = jQuery.timers, data = dataPriv.get(this);
              if (index) {
                if (data[index] && data[index].stop) {
                  stopQueue(data[index]);
                }
              } else {
                for (index in data) {
                  if (data[index] && data[index].stop && rrun.test(index)) {
                    stopQueue(data[index]);
                  }
                }
              }
              for (index = timers.length; index--; ) {
                if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                  timers[index].anim.stop(gotoEnd);
                  dequeue = false;
                  timers.splice(index, 1);
                }
              }
              if (dequeue || !gotoEnd) {
                jQuery.dequeue(this, type);
              }
            });
          },
          finish: function(type) {
            if (type !== false) {
              type = type || "fx";
            }
            return this.each(function() {
              var index, data = dataPriv.get(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"], timers = jQuery.timers, length = queue ? queue.length : 0;
              data.finish = true;
              jQuery.queue(this, type, []);
              if (hooks && hooks.stop) {
                hooks.stop.call(this, true);
              }
              for (index = timers.length; index--; ) {
                if (timers[index].elem === this && timers[index].queue === type) {
                  timers[index].anim.stop(true);
                  timers.splice(index, 1);
                }
              }
              for (index = 0; index < length; index++) {
                if (queue[index] && queue[index].finish) {
                  queue[index].finish.call(this);
                }
              }
              delete data.finish;
            });
          }
        });
        jQuery.each(["toggle", "show", "hide"], function(_i, name) {
          var cssFn = jQuery.fn[name];
          jQuery.fn[name] = function(speed, easing, callback) {
            return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
          };
        });
        jQuery.each({
          slideDown: genFx("show"),
          slideUp: genFx("hide"),
          slideToggle: genFx("toggle"),
          fadeIn: { opacity: "show" },
          fadeOut: { opacity: "hide" },
          fadeToggle: { opacity: "toggle" }
        }, function(name, props) {
          jQuery.fn[name] = function(speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
          };
        });
        jQuery.timers = [];
        jQuery.fx.tick = function() {
          var timer, i = 0, timers = jQuery.timers;
          fxNow = Date.now();
          for (; i < timers.length; i++) {
            timer = timers[i];
            if (!timer() && timers[i] === timer) {
              timers.splice(i--, 1);
            }
          }
          if (!timers.length) {
            jQuery.fx.stop();
          }
          fxNow = void 0;
        };
        jQuery.fx.timer = function(timer) {
          jQuery.timers.push(timer);
          jQuery.fx.start();
        };
        jQuery.fx.interval = 13;
        jQuery.fx.start = function() {
          if (inProgress) {
            return;
          }
          inProgress = true;
          schedule();
        };
        jQuery.fx.stop = function() {
          inProgress = null;
        };
        jQuery.fx.speeds = {
          slow: 600,
          fast: 200,
          // Default speed
          _default: 400
        };
        jQuery.fn.delay = function(time, type) {
          time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
          type = type || "fx";
          return this.queue(type, function(next, hooks) {
            var timeout = window2.setTimeout(next, time);
            hooks.stop = function() {
              window2.clearTimeout(timeout);
            };
          });
        };
        (function() {
          var input = document.createElement("input"), select = document.createElement("select"), opt = select.appendChild(document.createElement("option"));
          input.type = "checkbox";
          support.checkOn = input.value !== "";
          support.optSelected = opt.selected;
          input = document.createElement("input");
          input.value = "t";
          input.type = "radio";
          support.radioValue = input.value === "t";
        })();
        var boolHook, attrHandle = jQuery.expr.attrHandle;
        jQuery.fn.extend({
          attr: function(name, value) {
            return access(this, jQuery.attr, name, value, arguments.length > 1);
          },
          removeAttr: function(name) {
            return this.each(function() {
              jQuery.removeAttr(this, name);
            });
          }
        });
        jQuery.extend({
          attr: function(elem, name, value) {
            var ret, hooks, nType = elem.nodeType;
            if (nType === 3 || nType === 8 || nType === 2) {
              return;
            }
            if (typeof elem.getAttribute === "undefined") {
              return jQuery.prop(elem, name, value);
            }
            if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
              hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : void 0);
            }
            if (value !== void 0) {
              if (value === null) {
                jQuery.removeAttr(elem, name);
                return;
              }
              if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
                return ret;
              }
              elem.setAttribute(name, value + "");
              return value;
            }
            if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
              return ret;
            }
            ret = jQuery.find.attr(elem, name);
            return ret == null ? void 0 : ret;
          },
          attrHooks: {
            type: {
              set: function(elem, value) {
                if (!support.radioValue && value === "radio" && nodeName(elem, "input")) {
                  var val = elem.value;
                  elem.setAttribute("type", value);
                  if (val) {
                    elem.value = val;
                  }
                  return value;
                }
              }
            }
          },
          removeAttr: function(elem, value) {
            var name, i = 0, attrNames = value && value.match(rnothtmlwhite);
            if (attrNames && elem.nodeType === 1) {
              while (name = attrNames[i++]) {
                elem.removeAttribute(name);
              }
            }
          }
        });
        boolHook = {
          set: function(elem, value, name) {
            if (value === false) {
              jQuery.removeAttr(elem, name);
            } else {
              elem.setAttribute(name, name);
            }
            return name;
          }
        };
        jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(_i, name) {
          var getter = attrHandle[name] || jQuery.find.attr;
          attrHandle[name] = function(elem, name2, isXML) {
            var ret, handle, lowercaseName = name2.toLowerCase();
            if (!isXML) {
              handle = attrHandle[lowercaseName];
              attrHandle[lowercaseName] = ret;
              ret = getter(elem, name2, isXML) != null ? lowercaseName : null;
              attrHandle[lowercaseName] = handle;
            }
            return ret;
          };
        });
        var rfocusable = /^(?:input|select|textarea|button)$/i, rclickable = /^(?:a|area)$/i;
        jQuery.fn.extend({
          prop: function(name, value) {
            return access(this, jQuery.prop, name, value, arguments.length > 1);
          },
          removeProp: function(name) {
            return this.each(function() {
              delete this[jQuery.propFix[name] || name];
            });
          }
        });
        jQuery.extend({
          prop: function(elem, name, value) {
            var ret, hooks, nType = elem.nodeType;
            if (nType === 3 || nType === 8 || nType === 2) {
              return;
            }
            if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
              name = jQuery.propFix[name] || name;
              hooks = jQuery.propHooks[name];
            }
            if (value !== void 0) {
              if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
                return ret;
              }
              return elem[name] = value;
            }
            if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
              return ret;
            }
            return elem[name];
          },
          propHooks: {
            tabIndex: {
              get: function(elem) {
                var tabindex = jQuery.find.attr(elem, "tabindex");
                if (tabindex) {
                  return parseInt(tabindex, 10);
                }
                if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
                  return 0;
                }
                return -1;
              }
            }
          },
          propFix: {
            "for": "htmlFor",
            "class": "className"
          }
        });
        if (!support.optSelected) {
          jQuery.propHooks.selected = {
            get: function(elem) {
              var parent = elem.parentNode;
              if (parent && parent.parentNode) {
                parent.parentNode.selectedIndex;
              }
              return null;
            },
            set: function(elem) {
              var parent = elem.parentNode;
              if (parent) {
                parent.selectedIndex;
                if (parent.parentNode) {
                  parent.parentNode.selectedIndex;
                }
              }
            }
          };
        }
        jQuery.each([
          "tabIndex",
          "readOnly",
          "maxLength",
          "cellSpacing",
          "cellPadding",
          "rowSpan",
          "colSpan",
          "useMap",
          "frameBorder",
          "contentEditable"
        ], function() {
          jQuery.propFix[this.toLowerCase()] = this;
        });
        function stripAndCollapse(value) {
          var tokens = value.match(rnothtmlwhite) || [];
          return tokens.join(" ");
        }
        function getClass(elem) {
          return elem.getAttribute && elem.getAttribute("class") || "";
        }
        function classesToArray(value) {
          if (Array.isArray(value)) {
            return value;
          }
          if (typeof value === "string") {
            return value.match(rnothtmlwhite) || [];
          }
          return [];
        }
        jQuery.fn.extend({
          addClass: function(value) {
            var classNames, cur, curValue, className, i, finalValue;
            if (isFunction(value)) {
              return this.each(function(j) {
                jQuery(this).addClass(value.call(this, j, getClass(this)));
              });
            }
            classNames = classesToArray(value);
            if (classNames.length) {
              return this.each(function() {
                curValue = getClass(this);
                cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
                if (cur) {
                  for (i = 0; i < classNames.length; i++) {
                    className = classNames[i];
                    if (cur.indexOf(" " + className + " ") < 0) {
                      cur += className + " ";
                    }
                  }
                  finalValue = stripAndCollapse(cur);
                  if (curValue !== finalValue) {
                    this.setAttribute("class", finalValue);
                  }
                }
              });
            }
            return this;
          },
          removeClass: function(value) {
            var classNames, cur, curValue, className, i, finalValue;
            if (isFunction(value)) {
              return this.each(function(j) {
                jQuery(this).removeClass(value.call(this, j, getClass(this)));
              });
            }
            if (!arguments.length) {
              return this.attr("class", "");
            }
            classNames = classesToArray(value);
            if (classNames.length) {
              return this.each(function() {
                curValue = getClass(this);
                cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
                if (cur) {
                  for (i = 0; i < classNames.length; i++) {
                    className = classNames[i];
                    while (cur.indexOf(" " + className + " ") > -1) {
                      cur = cur.replace(" " + className + " ", " ");
                    }
                  }
                  finalValue = stripAndCollapse(cur);
                  if (curValue !== finalValue) {
                    this.setAttribute("class", finalValue);
                  }
                }
              });
            }
            return this;
          },
          toggleClass: function(value, stateVal) {
            var classNames, className, i, self2, type = typeof value, isValidValue = type === "string" || Array.isArray(value);
            if (isFunction(value)) {
              return this.each(function(i2) {
                jQuery(this).toggleClass(
                  value.call(this, i2, getClass(this), stateVal),
                  stateVal
                );
              });
            }
            if (typeof stateVal === "boolean" && isValidValue) {
              return stateVal ? this.addClass(value) : this.removeClass(value);
            }
            classNames = classesToArray(value);
            return this.each(function() {
              if (isValidValue) {
                self2 = jQuery(this);
                for (i = 0; i < classNames.length; i++) {
                  className = classNames[i];
                  if (self2.hasClass(className)) {
                    self2.removeClass(className);
                  } else {
                    self2.addClass(className);
                  }
                }
              } else if (value === void 0 || type === "boolean") {
                className = getClass(this);
                if (className) {
                  dataPriv.set(this, "__className__", className);
                }
                if (this.setAttribute) {
                  this.setAttribute(
                    "class",
                    className || value === false ? "" : dataPriv.get(this, "__className__") || ""
                  );
                }
              }
            });
          },
          hasClass: function(selector) {
            var className, elem, i = 0;
            className = " " + selector + " ";
            while (elem = this[i++]) {
              if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
                return true;
              }
            }
            return false;
          }
        });
        var rreturn = /\r/g;
        jQuery.fn.extend({
          val: function(value) {
            var hooks, ret, valueIsFunction, elem = this[0];
            if (!arguments.length) {
              if (elem) {
                hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
                if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== void 0) {
                  return ret;
                }
                ret = elem.value;
                if (typeof ret === "string") {
                  return ret.replace(rreturn, "");
                }
                return ret == null ? "" : ret;
              }
              return;
            }
            valueIsFunction = isFunction(value);
            return this.each(function(i) {
              var val;
              if (this.nodeType !== 1) {
                return;
              }
              if (valueIsFunction) {
                val = value.call(this, i, jQuery(this).val());
              } else {
                val = value;
              }
              if (val == null) {
                val = "";
              } else if (typeof val === "number") {
                val += "";
              } else if (Array.isArray(val)) {
                val = jQuery.map(val, function(value2) {
                  return value2 == null ? "" : value2 + "";
                });
              }
              hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
              if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === void 0) {
                this.value = val;
              }
            });
          }
        });
        jQuery.extend({
          valHooks: {
            option: {
              get: function(elem) {
                var val = jQuery.find.attr(elem, "value");
                return val != null ? val : (
                  // Support: IE <=10 - 11 only
                  // option.text throws exceptions (trac-14686, trac-14858)
                  // Strip and collapse whitespace
                  // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
                  stripAndCollapse(jQuery.text(elem))
                );
              }
            },
            select: {
              get: function(elem) {
                var value, option, i, options = elem.options, index = elem.selectedIndex, one = elem.type === "select-one", values = one ? null : [], max = one ? index + 1 : options.length;
                if (index < 0) {
                  i = max;
                } else {
                  i = one ? index : 0;
                }
                for (; i < max; i++) {
                  option = options[i];
                  if ((option.selected || i === index) && // Don't return options that are disabled or in a disabled optgroup
                  !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {
                    value = jQuery(option).val();
                    if (one) {
                      return value;
                    }
                    values.push(value);
                  }
                }
                return values;
              },
              set: function(elem, value) {
                var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i = options.length;
                while (i--) {
                  option = options[i];
                  if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
                    optionSet = true;
                  }
                }
                if (!optionSet) {
                  elem.selectedIndex = -1;
                }
                return values;
              }
            }
          }
        });
        jQuery.each(["radio", "checkbox"], function() {
          jQuery.valHooks[this] = {
            set: function(elem, value) {
              if (Array.isArray(value)) {
                return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
              }
            }
          };
          if (!support.checkOn) {
            jQuery.valHooks[this].get = function(elem) {
              return elem.getAttribute("value") === null ? "on" : elem.value;
            };
          }
        });
        var location = window2.location;
        var nonce = { guid: Date.now() };
        var rquery = /\?/;
        jQuery.parseXML = function(data) {
          var xml, parserErrorElem;
          if (!data || typeof data !== "string") {
            return null;
          }
          try {
            xml = new window2.DOMParser().parseFromString(data, "text/xml");
          } catch (e) {
          }
          parserErrorElem = xml && xml.getElementsByTagName("parsererror")[0];
          if (!xml || parserErrorElem) {
            jQuery.error("Invalid XML: " + (parserErrorElem ? jQuery.map(parserErrorElem.childNodes, function(el) {
              return el.textContent;
            }).join("\n") : data));
          }
          return xml;
        };
        var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, stopPropagationCallback = function(e) {
          e.stopPropagation();
        };
        jQuery.extend(jQuery.event, {
          trigger: function(event, data, elem, onlyHandlers) {
            var i, cur, tmp, bubbleType, ontype, handle, special, lastElement, eventPath = [elem || document], type = hasOwn.call(event, "type") ? event.type : event, namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
            cur = lastElement = tmp = elem = elem || document;
            if (elem.nodeType === 3 || elem.nodeType === 8) {
              return;
            }
            if (rfocusMorph.test(type + jQuery.event.triggered)) {
              return;
            }
            if (type.indexOf(".") > -1) {
              namespaces = type.split(".");
              type = namespaces.shift();
              namespaces.sort();
            }
            ontype = type.indexOf(":") < 0 && "on" + type;
            event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event);
            event.isTrigger = onlyHandlers ? 2 : 3;
            event.namespace = namespaces.join(".");
            event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
            event.result = void 0;
            if (!event.target) {
              event.target = elem;
            }
            data = data == null ? [event] : jQuery.makeArray(data, [event]);
            special = jQuery.event.special[type] || {};
            if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
              return;
            }
            if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
              bubbleType = special.delegateType || type;
              if (!rfocusMorph.test(bubbleType + type)) {
                cur = cur.parentNode;
              }
              for (; cur; cur = cur.parentNode) {
                eventPath.push(cur);
                tmp = cur;
              }
              if (tmp === (elem.ownerDocument || document)) {
                eventPath.push(tmp.defaultView || tmp.parentWindow || window2);
              }
            }
            i = 0;
            while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
              lastElement = cur;
              event.type = i > 1 ? bubbleType : special.bindType || type;
              handle = (dataPriv.get(cur, "events") || /* @__PURE__ */ Object.create(null))[event.type] && dataPriv.get(cur, "handle");
              if (handle) {
                handle.apply(cur, data);
              }
              handle = ontype && cur[ontype];
              if (handle && handle.apply && acceptData(cur)) {
                event.result = handle.apply(cur, data);
                if (event.result === false) {
                  event.preventDefault();
                }
              }
            }
            event.type = type;
            if (!onlyHandlers && !event.isDefaultPrevented()) {
              if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
                if (ontype && isFunction(elem[type]) && !isWindow(elem)) {
                  tmp = elem[ontype];
                  if (tmp) {
                    elem[ontype] = null;
                  }
                  jQuery.event.triggered = type;
                  if (event.isPropagationStopped()) {
                    lastElement.addEventListener(type, stopPropagationCallback);
                  }
                  elem[type]();
                  if (event.isPropagationStopped()) {
                    lastElement.removeEventListener(type, stopPropagationCallback);
                  }
                  jQuery.event.triggered = void 0;
                  if (tmp) {
                    elem[ontype] = tmp;
                  }
                }
              }
            }
            return event.result;
          },
          // Piggyback on a donor event to simulate a different one
          // Used only for `focus(in | out)` events
          simulate: function(type, elem, event) {
            var e = jQuery.extend(
              new jQuery.Event(),
              event,
              {
                type,
                isSimulated: true
              }
            );
            jQuery.event.trigger(e, null, elem);
          }
        });
        jQuery.fn.extend({
          trigger: function(type, data) {
            return this.each(function() {
              jQuery.event.trigger(type, data, this);
            });
          },
          triggerHandler: function(type, data) {
            var elem = this[0];
            if (elem) {
              return jQuery.event.trigger(type, data, elem, true);
            }
          }
        });
        var rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
        function buildParams(prefix, obj, traditional, add) {
          var name;
          if (Array.isArray(obj)) {
            jQuery.each(obj, function(i, v) {
              if (traditional || rbracket.test(prefix)) {
                add(prefix, v);
              } else {
                buildParams(
                  prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]",
                  v,
                  traditional,
                  add
                );
              }
            });
          } else if (!traditional && toType(obj) === "object") {
            for (name in obj) {
              buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }
          } else {
            add(prefix, obj);
          }
        }
        jQuery.param = function(a, traditional) {
          var prefix, s = [], add = function(key, valueOrFunction) {
            var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
            s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
          };
          if (a == null) {
            return "";
          }
          if (Array.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
            jQuery.each(a, function() {
              add(this.name, this.value);
            });
          } else {
            for (prefix in a) {
              buildParams(prefix, a[prefix], traditional, add);
            }
          }
          return s.join("&");
        };
        jQuery.fn.extend({
          serialize: function() {
            return jQuery.param(this.serializeArray());
          },
          serializeArray: function() {
            return this.map(function() {
              var elements = jQuery.prop(this, "elements");
              return elements ? jQuery.makeArray(elements) : this;
            }).filter(function() {
              var type = this.type;
              return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
            }).map(function(_i, elem) {
              var val = jQuery(this).val();
              if (val == null) {
                return null;
              }
              if (Array.isArray(val)) {
                return jQuery.map(val, function(val2) {
                  return { name: elem.name, value: val2.replace(rCRLF, "\r\n") };
                });
              }
              return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
            }).get();
          }
        });
        var r20 = /%20/g, rhash = /#.*$/, rantiCache = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, prefilters = {}, transports = {}, allTypes = "*/".concat("*"), originAnchor = document.createElement("a");
        originAnchor.href = location.href;
        function addToPrefiltersOrTransports(structure) {
          return function(dataTypeExpression, func) {
            if (typeof dataTypeExpression !== "string") {
              func = dataTypeExpression;
              dataTypeExpression = "*";
            }
            var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
            if (isFunction(func)) {
              while (dataType = dataTypes[i++]) {
                if (dataType[0] === "+") {
                  dataType = dataType.slice(1) || "*";
                  (structure[dataType] = structure[dataType] || []).unshift(func);
                } else {
                  (structure[dataType] = structure[dataType] || []).push(func);
                }
              }
            }
          };
        }
        function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
          var inspected = {}, seekingTransport = structure === transports;
          function inspect(dataType) {
            var selected;
            inspected[dataType] = true;
            jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
              var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
              if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
                options.dataTypes.unshift(dataTypeOrTransport);
                inspect(dataTypeOrTransport);
                return false;
              } else if (seekingTransport) {
                return !(selected = dataTypeOrTransport);
              }
            });
            return selected;
          }
          return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
        }
        function ajaxExtend(target, src) {
          var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
          for (key in src) {
            if (src[key] !== void 0) {
              (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
            }
          }
          if (deep) {
            jQuery.extend(true, target, deep);
          }
          return target;
        }
        function ajaxHandleResponses(s, jqXHR, responses) {
          var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes;
          while (dataTypes[0] === "*") {
            dataTypes.shift();
            if (ct === void 0) {
              ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
            }
          }
          if (ct) {
            for (type in contents) {
              if (contents[type] && contents[type].test(ct)) {
                dataTypes.unshift(type);
                break;
              }
            }
          }
          if (dataTypes[0] in responses) {
            finalDataType = dataTypes[0];
          } else {
            for (type in responses) {
              if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                finalDataType = type;
                break;
              }
              if (!firstDataType) {
                firstDataType = type;
              }
            }
            finalDataType = finalDataType || firstDataType;
          }
          if (finalDataType) {
            if (finalDataType !== dataTypes[0]) {
              dataTypes.unshift(finalDataType);
            }
            return responses[finalDataType];
          }
        }
        function ajaxConvert(s, response, jqXHR, isSuccess) {
          var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s.dataTypes.slice();
          if (dataTypes[1]) {
            for (conv in s.converters) {
              converters[conv.toLowerCase()] = s.converters[conv];
            }
          }
          current = dataTypes.shift();
          while (current) {
            if (s.responseFields[current]) {
              jqXHR[s.responseFields[current]] = response;
            }
            if (!prev && isSuccess && s.dataFilter) {
              response = s.dataFilter(response, s.dataType);
            }
            prev = current;
            current = dataTypes.shift();
            if (current) {
              if (current === "*") {
                current = prev;
              } else if (prev !== "*" && prev !== current) {
                conv = converters[prev + " " + current] || converters["* " + current];
                if (!conv) {
                  for (conv2 in converters) {
                    tmp = conv2.split(" ");
                    if (tmp[1] === current) {
                      conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                      if (conv) {
                        if (conv === true) {
                          conv = converters[conv2];
                        } else if (converters[conv2] !== true) {
                          current = tmp[0];
                          dataTypes.unshift(tmp[1]);
                        }
                        break;
                      }
                    }
                  }
                }
                if (conv !== true) {
                  if (conv && s.throws) {
                    response = conv(response);
                  } else {
                    try {
                      response = conv(response);
                    } catch (e) {
                      return {
                        state: "parsererror",
                        error: conv ? e : "No conversion from " + prev + " to " + current
                      };
                    }
                  }
                }
              }
            }
          }
          return { state: "success", data: response };
        }
        jQuery.extend({
          // Counter for holding the number of active queries
          active: 0,
          // Last-Modified header cache for next request
          lastModified: {},
          etag: {},
          ajaxSettings: {
            url: location.href,
            type: "GET",
            isLocal: rlocalProtocol.test(location.protocol),
            global: true,
            processData: true,
            async: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            /*
            timeout: 0,
            data: null,
            dataType: null,
            username: null,
            password: null,
            cache: null,
            throws: false,
            traditional: false,
            headers: {},
            */
            accepts: {
              "*": allTypes,
              text: "text/plain",
              html: "text/html",
              xml: "application/xml, text/xml",
              json: "application/json, text/javascript"
            },
            contents: {
              xml: /\bxml\b/,
              html: /\bhtml/,
              json: /\bjson\b/
            },
            responseFields: {
              xml: "responseXML",
              text: "responseText",
              json: "responseJSON"
            },
            // Data converters
            // Keys separate source (or catchall "*") and destination types with a single space
            converters: {
              // Convert anything to text
              "* text": String,
              // Text to html (true = no transformation)
              "text html": true,
              // Evaluate text as a json expression
              "text json": JSON.parse,
              // Parse text as xml
              "text xml": jQuery.parseXML
            },
            // For options that shouldn't be deep extended:
            // you can add your own custom options here if
            // and when you create one that shouldn't be
            // deep extended (see ajaxExtend)
            flatOptions: {
              url: true,
              context: true
            }
          },
          // Creates a full fledged settings object into target
          // with both ajaxSettings and settings fields.
          // If target is omitted, writes into ajaxSettings.
          ajaxSetup: function(target, settings) {
            return settings ? (
              // Building a settings object
              ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings)
            ) : (
              // Extending ajaxSettings
              ajaxExtend(jQuery.ajaxSettings, target)
            );
          },
          ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
          ajaxTransport: addToPrefiltersOrTransports(transports),
          // Main method
          ajax: function(url, options) {
            if (typeof url === "object") {
              options = url;
              url = void 0;
            }
            options = options || {};
            var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, urlAnchor, completed2, fireGlobals, i, uncached, s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, strAbort = "canceled", jqXHR = {
              readyState: 0,
              // Builds headers hashtable if needed
              getResponseHeader: function(key) {
                var match;
                if (completed2) {
                  if (!responseHeaders) {
                    responseHeaders = {};
                    while (match = rheaders.exec(responseHeadersString)) {
                      responseHeaders[match[1].toLowerCase() + " "] = (responseHeaders[match[1].toLowerCase() + " "] || []).concat(match[2]);
                    }
                  }
                  match = responseHeaders[key.toLowerCase() + " "];
                }
                return match == null ? null : match.join(", ");
              },
              // Raw string
              getAllResponseHeaders: function() {
                return completed2 ? responseHeadersString : null;
              },
              // Caches the header
              setRequestHeader: function(name, value) {
                if (completed2 == null) {
                  name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
                  requestHeaders[name] = value;
                }
                return this;
              },
              // Overrides response content-type header
              overrideMimeType: function(type) {
                if (completed2 == null) {
                  s.mimeType = type;
                }
                return this;
              },
              // Status-dependent callbacks
              statusCode: function(map) {
                var code;
                if (map) {
                  if (completed2) {
                    jqXHR.always(map[jqXHR.status]);
                  } else {
                    for (code in map) {
                      statusCode[code] = [statusCode[code], map[code]];
                    }
                  }
                }
                return this;
              },
              // Cancel the request
              abort: function(statusText) {
                var finalText = statusText || strAbort;
                if (transport) {
                  transport.abort(finalText);
                }
                done(0, finalText);
                return this;
              }
            };
            deferred.promise(jqXHR);
            s.url = ((url || s.url || location.href) + "").replace(rprotocol, location.protocol + "//");
            s.type = options.method || options.type || s.method || s.type;
            s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];
            if (s.crossDomain == null) {
              urlAnchor = document.createElement("a");
              try {
                urlAnchor.href = s.url;
                urlAnchor.href = urlAnchor.href;
                s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
              } catch (e) {
                s.crossDomain = true;
              }
            }
            if (s.data && s.processData && typeof s.data !== "string") {
              s.data = jQuery.param(s.data, s.traditional);
            }
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
            if (completed2) {
              return jqXHR;
            }
            fireGlobals = jQuery.event && s.global;
            if (fireGlobals && jQuery.active++ === 0) {
              jQuery.event.trigger("ajaxStart");
            }
            s.type = s.type.toUpperCase();
            s.hasContent = !rnoContent.test(s.type);
            cacheURL = s.url.replace(rhash, "");
            if (!s.hasContent) {
              uncached = s.url.slice(cacheURL.length);
              if (s.data && (s.processData || typeof s.data === "string")) {
                cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;
                delete s.data;
              }
              if (s.cache === false) {
                cacheURL = cacheURL.replace(rantiCache, "$1");
                uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce.guid++ + uncached;
              }
              s.url = cacheURL + uncached;
            } else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
              s.data = s.data.replace(r20, "+");
            }
            if (s.ifModified) {
              if (jQuery.lastModified[cacheURL]) {
                jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
              }
              if (jQuery.etag[cacheURL]) {
                jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
              }
            }
            if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
              jqXHR.setRequestHeader("Content-Type", s.contentType);
            }
            jqXHR.setRequestHeader(
              "Accept",
              s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]
            );
            for (i in s.headers) {
              jqXHR.setRequestHeader(i, s.headers[i]);
            }
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed2)) {
              return jqXHR.abort();
            }
            strAbort = "abort";
            completeDeferred.add(s.complete);
            jqXHR.done(s.success);
            jqXHR.fail(s.error);
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
            if (!transport) {
              done(-1, "No Transport");
            } else {
              jqXHR.readyState = 1;
              if (fireGlobals) {
                globalEventContext.trigger("ajaxSend", [jqXHR, s]);
              }
              if (completed2) {
                return jqXHR;
              }
              if (s.async && s.timeout > 0) {
                timeoutTimer = window2.setTimeout(function() {
                  jqXHR.abort("timeout");
                }, s.timeout);
              }
              try {
                completed2 = false;
                transport.send(requestHeaders, done);
              } catch (e) {
                if (completed2) {
                  throw e;
                }
                done(-1, e);
              }
            }
            function done(status, nativeStatusText, responses, headers) {
              var isSuccess, success, error, response, modified, statusText = nativeStatusText;
              if (completed2) {
                return;
              }
              completed2 = true;
              if (timeoutTimer) {
                window2.clearTimeout(timeoutTimer);
              }
              transport = void 0;
              responseHeadersString = headers || "";
              jqXHR.readyState = status > 0 ? 4 : 0;
              isSuccess = status >= 200 && status < 300 || status === 304;
              if (responses) {
                response = ajaxHandleResponses(s, jqXHR, responses);
              }
              if (!isSuccess && jQuery.inArray("script", s.dataTypes) > -1 && jQuery.inArray("json", s.dataTypes) < 0) {
                s.converters["text script"] = function() {
                };
              }
              response = ajaxConvert(s, response, jqXHR, isSuccess);
              if (isSuccess) {
                if (s.ifModified) {
                  modified = jqXHR.getResponseHeader("Last-Modified");
                  if (modified) {
                    jQuery.lastModified[cacheURL] = modified;
                  }
                  modified = jqXHR.getResponseHeader("etag");
                  if (modified) {
                    jQuery.etag[cacheURL] = modified;
                  }
                }
                if (status === 204 || s.type === "HEAD") {
                  statusText = "nocontent";
                } else if (status === 304) {
                  statusText = "notmodified";
                } else {
                  statusText = response.state;
                  success = response.data;
                  error = response.error;
                  isSuccess = !error;
                }
              } else {
                error = statusText;
                if (status || !statusText) {
                  statusText = "error";
                  if (status < 0) {
                    status = 0;
                  }
                }
              }
              jqXHR.status = status;
              jqXHR.statusText = (nativeStatusText || statusText) + "";
              if (isSuccess) {
                deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
              } else {
                deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
              }
              jqXHR.statusCode(statusCode);
              statusCode = void 0;
              if (fireGlobals) {
                globalEventContext.trigger(
                  isSuccess ? "ajaxSuccess" : "ajaxError",
                  [jqXHR, s, isSuccess ? success : error]
                );
              }
              completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
              if (fireGlobals) {
                globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
                if (!--jQuery.active) {
                  jQuery.event.trigger("ajaxStop");
                }
              }
            }
            return jqXHR;
          },
          getJSON: function(url, data, callback) {
            return jQuery.get(url, data, callback, "json");
          },
          getScript: function(url, callback) {
            return jQuery.get(url, void 0, callback, "script");
          }
        });
        jQuery.each(["get", "post"], function(_i, method) {
          jQuery[method] = function(url, data, callback, type) {
            if (isFunction(data)) {
              type = type || callback;
              callback = data;
              data = void 0;
            }
            return jQuery.ajax(jQuery.extend({
              url,
              type: method,
              dataType: type,
              data,
              success: callback
            }, jQuery.isPlainObject(url) && url));
          };
        });
        jQuery.ajaxPrefilter(function(s) {
          var i;
          for (i in s.headers) {
            if (i.toLowerCase() === "content-type") {
              s.contentType = s.headers[i] || "";
            }
          }
        });
        jQuery._evalUrl = function(url, options, doc) {
          return jQuery.ajax({
            url,
            // Make this explicit, since user can override this through ajaxSetup (trac-11264)
            type: "GET",
            dataType: "script",
            cache: true,
            async: false,
            global: false,
            // Only evaluate the response if it is successful (gh-4126)
            // dataFilter is not invoked for failure responses, so using it instead
            // of the default converter is kludgy but it works.
            converters: {
              "text script": function() {
              }
            },
            dataFilter: function(response) {
              jQuery.globalEval(response, options, doc);
            }
          });
        };
        jQuery.fn.extend({
          wrapAll: function(html) {
            var wrap;
            if (this[0]) {
              if (isFunction(html)) {
                html = html.call(this[0]);
              }
              wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
              if (this[0].parentNode) {
                wrap.insertBefore(this[0]);
              }
              wrap.map(function() {
                var elem = this;
                while (elem.firstElementChild) {
                  elem = elem.firstElementChild;
                }
                return elem;
              }).append(this);
            }
            return this;
          },
          wrapInner: function(html) {
            if (isFunction(html)) {
              return this.each(function(i) {
                jQuery(this).wrapInner(html.call(this, i));
              });
            }
            return this.each(function() {
              var self2 = jQuery(this), contents = self2.contents();
              if (contents.length) {
                contents.wrapAll(html);
              } else {
                self2.append(html);
              }
            });
          },
          wrap: function(html) {
            var htmlIsFunction = isFunction(html);
            return this.each(function(i) {
              jQuery(this).wrapAll(htmlIsFunction ? html.call(this, i) : html);
            });
          },
          unwrap: function(selector) {
            this.parent(selector).not("body").each(function() {
              jQuery(this).replaceWith(this.childNodes);
            });
            return this;
          }
        });
        jQuery.expr.pseudos.hidden = function(elem) {
          return !jQuery.expr.pseudos.visible(elem);
        };
        jQuery.expr.pseudos.visible = function(elem) {
          return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
        };
        jQuery.ajaxSettings.xhr = function() {
          try {
            return new window2.XMLHttpRequest();
          } catch (e) {
          }
        };
        var xhrSuccessStatus = {
          // File protocol always yields status code 0, assume 200
          0: 200,
          // Support: IE <=9 only
          // trac-1450: sometimes IE returns 1223 when it should be 204
          1223: 204
        }, xhrSupported = jQuery.ajaxSettings.xhr();
        support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
        support.ajax = xhrSupported = !!xhrSupported;
        jQuery.ajaxTransport(function(options) {
          var callback, errorCallback;
          if (support.cors || xhrSupported && !options.crossDomain) {
            return {
              send: function(headers, complete) {
                var i, xhr = options.xhr();
                xhr.open(
                  options.type,
                  options.url,
                  options.async,
                  options.username,
                  options.password
                );
                if (options.xhrFields) {
                  for (i in options.xhrFields) {
                    xhr[i] = options.xhrFields[i];
                  }
                }
                if (options.mimeType && xhr.overrideMimeType) {
                  xhr.overrideMimeType(options.mimeType);
                }
                if (!options.crossDomain && !headers["X-Requested-With"]) {
                  headers["X-Requested-With"] = "XMLHttpRequest";
                }
                for (i in headers) {
                  xhr.setRequestHeader(i, headers[i]);
                }
                callback = function(type) {
                  return function() {
                    if (callback) {
                      callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null;
                      if (type === "abort") {
                        xhr.abort();
                      } else if (type === "error") {
                        if (typeof xhr.status !== "number") {
                          complete(0, "error");
                        } else {
                          complete(
                            // File: protocol always yields status 0; see trac-8605, trac-14207
                            xhr.status,
                            xhr.statusText
                          );
                        }
                      } else {
                        complete(
                          xhrSuccessStatus[xhr.status] || xhr.status,
                          xhr.statusText,
                          // Support: IE <=9 only
                          // IE9 has no XHR2 but throws on binary (trac-11426)
                          // For XHR2 non-text, let the caller handle it (gh-2498)
                          (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText },
                          xhr.getAllResponseHeaders()
                        );
                      }
                    }
                  };
                };
                xhr.onload = callback();
                errorCallback = xhr.onerror = xhr.ontimeout = callback("error");
                if (xhr.onabort !== void 0) {
                  xhr.onabort = errorCallback;
                } else {
                  xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                      window2.setTimeout(function() {
                        if (callback) {
                          errorCallback();
                        }
                      });
                    }
                  };
                }
                callback = callback("abort");
                try {
                  xhr.send(options.hasContent && options.data || null);
                } catch (e) {
                  if (callback) {
                    throw e;
                  }
                }
              },
              abort: function() {
                if (callback) {
                  callback();
                }
              }
            };
          }
        });
        jQuery.ajaxPrefilter(function(s) {
          if (s.crossDomain) {
            s.contents.script = false;
          }
        });
        jQuery.ajaxSetup({
          accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
          },
          contents: {
            script: /\b(?:java|ecma)script\b/
          },
          converters: {
            "text script": function(text) {
              jQuery.globalEval(text);
              return text;
            }
          }
        });
        jQuery.ajaxPrefilter("script", function(s) {
          if (s.cache === void 0) {
            s.cache = false;
          }
          if (s.crossDomain) {
            s.type = "GET";
          }
        });
        jQuery.ajaxTransport("script", function(s) {
          if (s.crossDomain || s.scriptAttrs) {
            var script, callback;
            return {
              send: function(_, complete) {
                script = jQuery("<script>").attr(s.scriptAttrs || {}).prop({ charset: s.scriptCharset, src: s.url }).on("load error", callback = function(evt) {
                  script.remove();
                  callback = null;
                  if (evt) {
                    complete(evt.type === "error" ? 404 : 200, evt.type);
                  }
                });
                document.head.appendChild(script[0]);
              },
              abort: function() {
                if (callback) {
                  callback();
                }
              }
            };
          }
        });
        var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
        jQuery.ajaxSetup({
          jsonp: "callback",
          jsonpCallback: function() {
            var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce.guid++;
            this[callback] = true;
            return callback;
          }
        });
        jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
          var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");
          if (jsonProp || s.dataTypes[0] === "jsonp") {
            callbackName = s.jsonpCallback = isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
            if (jsonProp) {
              s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
            } else if (s.jsonp !== false) {
              s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
            }
            s.converters["script json"] = function() {
              if (!responseContainer) {
                jQuery.error(callbackName + " was not called");
              }
              return responseContainer[0];
            };
            s.dataTypes[0] = "json";
            overwritten = window2[callbackName];
            window2[callbackName] = function() {
              responseContainer = arguments;
            };
            jqXHR.always(function() {
              if (overwritten === void 0) {
                jQuery(window2).removeProp(callbackName);
              } else {
                window2[callbackName] = overwritten;
              }
              if (s[callbackName]) {
                s.jsonpCallback = originalSettings.jsonpCallback;
                oldCallbacks.push(callbackName);
              }
              if (responseContainer && isFunction(overwritten)) {
                overwritten(responseContainer[0]);
              }
              responseContainer = overwritten = void 0;
            });
            return "script";
          }
        });
        support.createHTMLDocument = function() {
          var body = document.implementation.createHTMLDocument("").body;
          body.innerHTML = "<form></form><form></form>";
          return body.childNodes.length === 2;
        }();
        jQuery.parseHTML = function(data, context, keepScripts) {
          if (typeof data !== "string") {
            return [];
          }
          if (typeof context === "boolean") {
            keepScripts = context;
            context = false;
          }
          var base, parsed, scripts;
          if (!context) {
            if (support.createHTMLDocument) {
              context = document.implementation.createHTMLDocument("");
              base = context.createElement("base");
              base.href = document.location.href;
              context.head.appendChild(base);
            } else {
              context = document;
            }
          }
          parsed = rsingleTag.exec(data);
          scripts = !keepScripts && [];
          if (parsed) {
            return [context.createElement(parsed[1])];
          }
          parsed = buildFragment([data], context, scripts);
          if (scripts && scripts.length) {
            jQuery(scripts).remove();
          }
          return jQuery.merge([], parsed.childNodes);
        };
        jQuery.fn.load = function(url, params, callback) {
          var selector, type, response, self2 = this, off = url.indexOf(" ");
          if (off > -1) {
            selector = stripAndCollapse(url.slice(off));
            url = url.slice(0, off);
          }
          if (isFunction(params)) {
            callback = params;
            params = void 0;
          } else if (params && typeof params === "object") {
            type = "POST";
          }
          if (self2.length > 0) {
            jQuery.ajax({
              url,
              // If "type" variable is undefined, then "GET" method will be used.
              // Make value of this field explicit since
              // user can override it through ajaxSetup method
              type: type || "GET",
              dataType: "html",
              data: params
            }).done(function(responseText) {
              response = arguments;
              self2.html(selector ? (
                // If a selector was specified, locate the right elements in a dummy div
                // Exclude scripts to avoid IE 'Permission Denied' errors
                jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector)
              ) : (
                // Otherwise use the full result
                responseText
              ));
            }).always(callback && function(jqXHR, status) {
              self2.each(function() {
                callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
              });
            });
          }
          return this;
        };
        jQuery.expr.pseudos.animated = function(elem) {
          return jQuery.grep(jQuery.timers, function(fn) {
            return elem === fn.elem;
          }).length;
        };
        jQuery.offset = {
          setOffset: function(elem, options, i) {
            var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery.css(elem, "position"), curElem = jQuery(elem), props = {};
            if (position === "static") {
              elem.style.position = "relative";
            }
            curOffset = curElem.offset();
            curCSSTop = jQuery.css(elem, "top");
            curCSSLeft = jQuery.css(elem, "left");
            calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;
            if (calculatePosition) {
              curPosition = curElem.position();
              curTop = curPosition.top;
              curLeft = curPosition.left;
            } else {
              curTop = parseFloat(curCSSTop) || 0;
              curLeft = parseFloat(curCSSLeft) || 0;
            }
            if (isFunction(options)) {
              options = options.call(elem, i, jQuery.extend({}, curOffset));
            }
            if (options.top != null) {
              props.top = options.top - curOffset.top + curTop;
            }
            if (options.left != null) {
              props.left = options.left - curOffset.left + curLeft;
            }
            if ("using" in options) {
              options.using.call(elem, props);
            } else {
              curElem.css(props);
            }
          }
        };
        jQuery.fn.extend({
          // offset() relates an element's border box to the document origin
          offset: function(options) {
            if (arguments.length) {
              return options === void 0 ? this : this.each(function(i) {
                jQuery.offset.setOffset(this, options, i);
              });
            }
            var rect, win, elem = this[0];
            if (!elem) {
              return;
            }
            if (!elem.getClientRects().length) {
              return { top: 0, left: 0 };
            }
            rect = elem.getBoundingClientRect();
            win = elem.ownerDocument.defaultView;
            return {
              top: rect.top + win.pageYOffset,
              left: rect.left + win.pageXOffset
            };
          },
          // position() relates an element's margin box to its offset parent's padding box
          // This corresponds to the behavior of CSS absolute positioning
          position: function() {
            if (!this[0]) {
              return;
            }
            var offsetParent, offset, doc, elem = this[0], parentOffset = { top: 0, left: 0 };
            if (jQuery.css(elem, "position") === "fixed") {
              offset = elem.getBoundingClientRect();
            } else {
              offset = this.offset();
              doc = elem.ownerDocument;
              offsetParent = elem.offsetParent || doc.documentElement;
              while (offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && jQuery.css(offsetParent, "position") === "static") {
                offsetParent = offsetParent.parentNode;
              }
              if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
                parentOffset = jQuery(offsetParent).offset();
                parentOffset.top += jQuery.css(offsetParent, "borderTopWidth", true);
                parentOffset.left += jQuery.css(offsetParent, "borderLeftWidth", true);
              }
            }
            return {
              top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
              left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
            };
          },
          // This method will return documentElement in the following cases:
          // 1) For the element inside the iframe without offsetParent, this method will return
          //    documentElement of the parent window
          // 2) For the hidden or detached element
          // 3) For body or html element, i.e. in case of the html node - it will return itself
          //
          // but those exceptions were never presented as a real life use-cases
          // and might be considered as more preferable results.
          //
          // This logic, however, is not guaranteed and can change at any point in the future
          offsetParent: function() {
            return this.map(function() {
              var offsetParent = this.offsetParent;
              while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
                offsetParent = offsetParent.offsetParent;
              }
              return offsetParent || documentElement;
            });
          }
        });
        jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(method, prop) {
          var top = "pageYOffset" === prop;
          jQuery.fn[method] = function(val) {
            return access(this, function(elem, method2, val2) {
              var win;
              if (isWindow(elem)) {
                win = elem;
              } else if (elem.nodeType === 9) {
                win = elem.defaultView;
              }
              if (val2 === void 0) {
                return win ? win[prop] : elem[method2];
              }
              if (win) {
                win.scrollTo(
                  !top ? val2 : win.pageXOffset,
                  top ? val2 : win.pageYOffset
                );
              } else {
                elem[method2] = val2;
              }
            }, method, val, arguments.length);
          };
        });
        jQuery.each(["top", "left"], function(_i, prop) {
          jQuery.cssHooks[prop] = addGetHookIf(
            support.pixelPosition,
            function(elem, computed) {
              if (computed) {
                computed = curCSS(elem, prop);
                return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
              }
            }
          );
        });
        jQuery.each({ Height: "height", Width: "width" }, function(name, type) {
          jQuery.each({
            padding: "inner" + name,
            content: type,
            "": "outer" + name
          }, function(defaultExtra, funcName) {
            jQuery.fn[funcName] = function(margin, value) {
              var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"), extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
              return access(this, function(elem, type2, value2) {
                var doc;
                if (isWindow(elem)) {
                  return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
                }
                if (elem.nodeType === 9) {
                  doc = elem.documentElement;
                  return Math.max(
                    elem.body["scroll" + name],
                    doc["scroll" + name],
                    elem.body["offset" + name],
                    doc["offset" + name],
                    doc["client" + name]
                  );
                }
                return value2 === void 0 ? (
                  // Get width or height on the element, requesting but not forcing parseFloat
                  jQuery.css(elem, type2, extra)
                ) : (
                  // Set width or height on the element
                  jQuery.style(elem, type2, value2, extra)
                );
              }, type, chainable ? margin : void 0, chainable);
            };
          });
        });
        jQuery.each([
          "ajaxStart",
          "ajaxStop",
          "ajaxComplete",
          "ajaxError",
          "ajaxSuccess",
          "ajaxSend"
        ], function(_i, type) {
          jQuery.fn[type] = function(fn) {
            return this.on(type, fn);
          };
        });
        jQuery.fn.extend({
          bind: function(types, data, fn) {
            return this.on(types, null, data, fn);
          },
          unbind: function(types, fn) {
            return this.off(types, null, fn);
          },
          delegate: function(selector, types, data, fn) {
            return this.on(types, selector, data, fn);
          },
          undelegate: function(selector, types, fn) {
            return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
          },
          hover: function(fnOver, fnOut) {
            return this.on("mouseenter", fnOver).on("mouseleave", fnOut || fnOver);
          }
        });
        jQuery.each(
          "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),
          function(_i, name) {
            jQuery.fn[name] = function(data, fn) {
              return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
            };
          }
        );
        var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
        jQuery.proxy = function(fn, context) {
          var tmp, args, proxy;
          if (typeof context === "string") {
            tmp = fn[context];
            context = fn;
            fn = tmp;
          }
          if (!isFunction(fn)) {
            return void 0;
          }
          args = slice2.call(arguments, 2);
          proxy = function() {
            return fn.apply(context || this, args.concat(slice2.call(arguments)));
          };
          proxy.guid = fn.guid = fn.guid || jQuery.guid++;
          return proxy;
        };
        jQuery.holdReady = function(hold) {
          if (hold) {
            jQuery.readyWait++;
          } else {
            jQuery.ready(true);
          }
        };
        jQuery.isArray = Array.isArray;
        jQuery.parseJSON = JSON.parse;
        jQuery.nodeName = nodeName;
        jQuery.isFunction = isFunction;
        jQuery.isWindow = isWindow;
        jQuery.camelCase = camelCase;
        jQuery.type = toType;
        jQuery.now = Date.now;
        jQuery.isNumeric = function(obj) {
          var type = jQuery.type(obj);
          return (type === "number" || type === "string") && // parseFloat NaNs numeric-cast false positives ("")
          // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
          // subtraction forces infinities to NaN
          !isNaN(obj - parseFloat(obj));
        };
        jQuery.trim = function(text) {
          return text == null ? "" : (text + "").replace(rtrim, "$1");
        };
        if (typeof define === "function" && define.amd) {
          define("jquery", [], function() {
            return jQuery;
          });
        }
        var _jQuery = window2.jQuery, _$ = window2.$;
        jQuery.noConflict = function(deep) {
          if (window2.$ === jQuery) {
            window2.$ = _$;
          }
          if (deep && window2.jQuery === jQuery) {
            window2.jQuery = _jQuery;
          }
          return jQuery;
        };
        if (typeof noGlobal === "undefined") {
          window2.jQuery = window2.$ = jQuery;
        }
        return jQuery;
      });
    }
  });

  // node_modules/i18next/dist/esm/i18next.js
  var isString, defer, makeString, copy, lastOfPathSeparatorRegExp, cleanKey, canNotTraverseDeeper, getLastOfPath, setPath, pushPath, getPath, getPathWithDefaults, deepExtend, regexEscape, _entityMap, escape, RegExpCache, chars, looksLikeObjectPathRegExpCache, looksLikeObjectPath, deepFind, getCleanedCode, consoleLogger, Logger, baseLogger, EventEmitter, ResourceStore, postProcessor, checkedLoadedFor, shouldHandleAsObject, Translator, LanguageUtil, suffixesOrder, dummyRule, PluralResolver, deepFindWithDefaults, regexSafe, Interpolator, parseFormatStr, createCachedFormatter, Formatter, removePending, Connector, get, transformOptions, noop, bindMemberFunctions, I18n, instance, createInstance, dir, init, loadResources, reloadResources, use, changeLanguage, getFixedT, t, exists, setDefaultNamespace, hasLoadedNamespace, loadNamespaces, loadLanguages;
  var init_i18next = __esm({
    "node_modules/i18next/dist/esm/i18next.js"() {
      isString = (obj) => typeof obj === "string";
      defer = () => {
        let res;
        let rej;
        const promise = new Promise((resolve, reject) => {
          res = resolve;
          rej = reject;
        });
        promise.resolve = res;
        promise.reject = rej;
        return promise;
      };
      makeString = (object) => {
        if (object == null) return "";
        return "" + object;
      };
      copy = (a, s, t2) => {
        a.forEach((m) => {
          if (s[m]) t2[m] = s[m];
        });
      };
      lastOfPathSeparatorRegExp = /###/g;
      cleanKey = (key) => key && key.indexOf("###") > -1 ? key.replace(lastOfPathSeparatorRegExp, ".") : key;
      canNotTraverseDeeper = (object) => !object || isString(object);
      getLastOfPath = (object, path, Empty) => {
        const stack = !isString(path) ? path : path.split(".");
        let stackIndex = 0;
        while (stackIndex < stack.length - 1) {
          if (canNotTraverseDeeper(object)) return {};
          const key = cleanKey(stack[stackIndex]);
          if (!object[key] && Empty) object[key] = new Empty();
          if (Object.prototype.hasOwnProperty.call(object, key)) {
            object = object[key];
          } else {
            object = {};
          }
          ++stackIndex;
        }
        if (canNotTraverseDeeper(object)) return {};
        return {
          obj: object,
          k: cleanKey(stack[stackIndex])
        };
      };
      setPath = (object, path, newValue) => {
        const {
          obj,
          k
        } = getLastOfPath(object, path, Object);
        if (obj !== void 0 || path.length === 1) {
          obj[k] = newValue;
          return;
        }
        let e = path[path.length - 1];
        let p = path.slice(0, path.length - 1);
        let last = getLastOfPath(object, p, Object);
        while (last.obj === void 0 && p.length) {
          e = `${p[p.length - 1]}.${e}`;
          p = p.slice(0, p.length - 1);
          last = getLastOfPath(object, p, Object);
          if (last?.obj && typeof last.obj[`${last.k}.${e}`] !== "undefined") {
            last.obj = void 0;
          }
        }
        last.obj[`${last.k}.${e}`] = newValue;
      };
      pushPath = (object, path, newValue, concat) => {
        const {
          obj,
          k
        } = getLastOfPath(object, path, Object);
        obj[k] = obj[k] || [];
        obj[k].push(newValue);
      };
      getPath = (object, path) => {
        const {
          obj,
          k
        } = getLastOfPath(object, path);
        if (!obj) return void 0;
        if (!Object.prototype.hasOwnProperty.call(obj, k)) return void 0;
        return obj[k];
      };
      getPathWithDefaults = (data, defaultData, key) => {
        const value = getPath(data, key);
        if (value !== void 0) {
          return value;
        }
        return getPath(defaultData, key);
      };
      deepExtend = (target, source, overwrite) => {
        for (const prop in source) {
          if (prop !== "__proto__" && prop !== "constructor") {
            if (prop in target) {
              if (isString(target[prop]) || target[prop] instanceof String || isString(source[prop]) || source[prop] instanceof String) {
                if (overwrite) target[prop] = source[prop];
              } else {
                deepExtend(target[prop], source[prop], overwrite);
              }
            } else {
              target[prop] = source[prop];
            }
          }
        }
        return target;
      };
      regexEscape = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      _entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;"
      };
      escape = (data) => {
        if (isString(data)) {
          return data.replace(/[&<>"'\/]/g, (s) => _entityMap[s]);
        }
        return data;
      };
      RegExpCache = class {
        constructor(capacity) {
          this.capacity = capacity;
          this.regExpMap = /* @__PURE__ */ new Map();
          this.regExpQueue = [];
        }
        getRegExp(pattern) {
          const regExpFromCache = this.regExpMap.get(pattern);
          if (regExpFromCache !== void 0) {
            return regExpFromCache;
          }
          const regExpNew = new RegExp(pattern);
          if (this.regExpQueue.length === this.capacity) {
            this.regExpMap.delete(this.regExpQueue.shift());
          }
          this.regExpMap.set(pattern, regExpNew);
          this.regExpQueue.push(pattern);
          return regExpNew;
        }
      };
      chars = [" ", ",", "?", "!", ";"];
      looksLikeObjectPathRegExpCache = new RegExpCache(20);
      looksLikeObjectPath = (key, nsSeparator, keySeparator) => {
        nsSeparator = nsSeparator || "";
        keySeparator = keySeparator || "";
        const possibleChars = chars.filter((c) => nsSeparator.indexOf(c) < 0 && keySeparator.indexOf(c) < 0);
        if (possibleChars.length === 0) return true;
        const r = looksLikeObjectPathRegExpCache.getRegExp(`(${possibleChars.map((c) => c === "?" ? "\\?" : c).join("|")})`);
        let matched = !r.test(key);
        if (!matched) {
          const ki = key.indexOf(keySeparator);
          if (ki > 0 && !r.test(key.substring(0, ki))) {
            matched = true;
          }
        }
        return matched;
      };
      deepFind = function(obj, path) {
        let keySeparator = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ".";
        if (!obj) return void 0;
        if (obj[path]) {
          if (!Object.prototype.hasOwnProperty.call(obj, path)) return void 0;
          return obj[path];
        }
        const tokens = path.split(keySeparator);
        let current = obj;
        for (let i = 0; i < tokens.length; ) {
          if (!current || typeof current !== "object") {
            return void 0;
          }
          let next;
          let nextPath = "";
          for (let j = i; j < tokens.length; ++j) {
            if (j !== i) {
              nextPath += keySeparator;
            }
            nextPath += tokens[j];
            next = current[nextPath];
            if (next !== void 0) {
              if (["string", "number", "boolean"].indexOf(typeof next) > -1 && j < tokens.length - 1) {
                continue;
              }
              i += j - i + 1;
              break;
            }
          }
          current = next;
        }
        return current;
      };
      getCleanedCode = (code) => code?.replace("_", "-");
      consoleLogger = {
        type: "logger",
        log(args) {
          this.output("log", args);
        },
        warn(args) {
          this.output("warn", args);
        },
        error(args) {
          this.output("error", args);
        },
        output(type, args) {
          console?.[type]?.apply?.(console, args);
        }
      };
      Logger = class _Logger {
        constructor(concreteLogger) {
          let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          this.init(concreteLogger, options);
        }
        init(concreteLogger) {
          let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          this.prefix = options.prefix || "i18next:";
          this.logger = concreteLogger || consoleLogger;
          this.options = options;
          this.debug = options.debug;
        }
        log() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return this.forward(args, "log", "", true);
        }
        warn() {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          return this.forward(args, "warn", "", true);
        }
        error() {
          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }
          return this.forward(args, "error", "");
        }
        deprecate() {
          for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }
          return this.forward(args, "warn", "WARNING DEPRECATED: ", true);
        }
        forward(args, lvl, prefix, debugOnly) {
          if (debugOnly && !this.debug) return null;
          if (isString(args[0])) args[0] = `${prefix}${this.prefix} ${args[0]}`;
          return this.logger[lvl](args);
        }
        create(moduleName) {
          return new _Logger(this.logger, {
            ...{
              prefix: `${this.prefix}:${moduleName}:`
            },
            ...this.options
          });
        }
        clone(options) {
          options = options || this.options;
          options.prefix = options.prefix || this.prefix;
          return new _Logger(this.logger, options);
        }
      };
      baseLogger = new Logger();
      EventEmitter = class {
        constructor() {
          this.observers = {};
        }
        on(events, listener) {
          events.split(" ").forEach((event) => {
            if (!this.observers[event]) this.observers[event] = /* @__PURE__ */ new Map();
            const numListeners = this.observers[event].get(listener) || 0;
            this.observers[event].set(listener, numListeners + 1);
          });
          return this;
        }
        off(event, listener) {
          if (!this.observers[event]) return;
          if (!listener) {
            delete this.observers[event];
            return;
          }
          this.observers[event].delete(listener);
        }
        emit(event) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }
          if (this.observers[event]) {
            const cloned = Array.from(this.observers[event].entries());
            cloned.forEach((_ref) => {
              let [observer, numTimesAdded] = _ref;
              for (let i = 0; i < numTimesAdded; i++) {
                observer(...args);
              }
            });
          }
          if (this.observers["*"]) {
            const cloned = Array.from(this.observers["*"].entries());
            cloned.forEach((_ref2) => {
              let [observer, numTimesAdded] = _ref2;
              for (let i = 0; i < numTimesAdded; i++) {
                observer.apply(observer, [event, ...args]);
              }
            });
          }
        }
      };
      ResourceStore = class extends EventEmitter {
        constructor(data) {
          let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
            ns: ["translation"],
            defaultNS: "translation"
          };
          super();
          this.data = data || {};
          this.options = options;
          if (this.options.keySeparator === void 0) {
            this.options.keySeparator = ".";
          }
          if (this.options.ignoreJSONStructure === void 0) {
            this.options.ignoreJSONStructure = true;
          }
        }
        addNamespaces(ns) {
          if (this.options.ns.indexOf(ns) < 0) {
            this.options.ns.push(ns);
          }
        }
        removeNamespaces(ns) {
          const index = this.options.ns.indexOf(ns);
          if (index > -1) {
            this.options.ns.splice(index, 1);
          }
        }
        getResource(lng, ns, key) {
          let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
          const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
          const ignoreJSONStructure = options.ignoreJSONStructure !== void 0 ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
          let path;
          if (lng.indexOf(".") > -1) {
            path = lng.split(".");
          } else {
            path = [lng, ns];
            if (key) {
              if (Array.isArray(key)) {
                path.push(...key);
              } else if (isString(key) && keySeparator) {
                path.push(...key.split(keySeparator));
              } else {
                path.push(key);
              }
            }
          }
          const result = getPath(this.data, path);
          if (!result && !ns && !key && lng.indexOf(".") > -1) {
            lng = path[0];
            ns = path[1];
            key = path.slice(2).join(".");
          }
          if (result || !ignoreJSONStructure || !isString(key)) return result;
          return deepFind(this.data?.[lng]?.[ns], key, keySeparator);
        }
        addResource(lng, ns, key, value) {
          let options = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
            silent: false
          };
          const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
          let path = [lng, ns];
          if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);
          if (lng.indexOf(".") > -1) {
            path = lng.split(".");
            value = ns;
            ns = path[1];
          }
          this.addNamespaces(ns);
          setPath(this.data, path, value);
          if (!options.silent) this.emit("added", lng, ns, key, value);
        }
        addResources(lng, ns, resources) {
          let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {
            silent: false
          };
          for (const m in resources) {
            if (isString(resources[m]) || Array.isArray(resources[m])) this.addResource(lng, ns, m, resources[m], {
              silent: true
            });
          }
          if (!options.silent) this.emit("added", lng, ns, resources);
        }
        addResourceBundle(lng, ns, resources, deep, overwrite) {
          let options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {
            silent: false,
            skipCopy: false
          };
          let path = [lng, ns];
          if (lng.indexOf(".") > -1) {
            path = lng.split(".");
            deep = resources;
            resources = ns;
            ns = path[1];
          }
          this.addNamespaces(ns);
          let pack = getPath(this.data, path) || {};
          if (!options.skipCopy) resources = JSON.parse(JSON.stringify(resources));
          if (deep) {
            deepExtend(pack, resources, overwrite);
          } else {
            pack = {
              ...pack,
              ...resources
            };
          }
          setPath(this.data, path, pack);
          if (!options.silent) this.emit("added", lng, ns, resources);
        }
        removeResourceBundle(lng, ns) {
          if (this.hasResourceBundle(lng, ns)) {
            delete this.data[lng][ns];
          }
          this.removeNamespaces(ns);
          this.emit("removed", lng, ns);
        }
        hasResourceBundle(lng, ns) {
          return this.getResource(lng, ns) !== void 0;
        }
        getResourceBundle(lng, ns) {
          if (!ns) ns = this.options.defaultNS;
          return this.getResource(lng, ns);
        }
        getDataByLanguage(lng) {
          return this.data[lng];
        }
        hasLanguageSomeTranslations(lng) {
          const data = this.getDataByLanguage(lng);
          const n = data && Object.keys(data) || [];
          return !!n.find((v) => data[v] && Object.keys(data[v]).length > 0);
        }
        toJSON() {
          return this.data;
        }
      };
      postProcessor = {
        processors: {},
        addPostProcessor(module) {
          this.processors[module.name] = module;
        },
        handle(processors, value, key, options, translator) {
          processors.forEach((processor) => {
            value = this.processors[processor]?.process(value, key, options, translator) ?? value;
          });
          return value;
        }
      };
      checkedLoadedFor = {};
      shouldHandleAsObject = (res) => !isString(res) && typeof res !== "boolean" && typeof res !== "number";
      Translator = class _Translator extends EventEmitter {
        constructor(services) {
          let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          super();
          copy(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], services, this);
          this.options = options;
          if (this.options.keySeparator === void 0) {
            this.options.keySeparator = ".";
          }
          this.logger = baseLogger.create("translator");
        }
        changeLanguage(lng) {
          if (lng) this.language = lng;
        }
        exists(key) {
          let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
            interpolation: {}
          };
          if (key == null) {
            return false;
          }
          const resolved = this.resolve(key, options);
          return resolved?.res !== void 0;
        }
        extractFromKey(key, options) {
          let nsSeparator = options.nsSeparator !== void 0 ? options.nsSeparator : this.options.nsSeparator;
          if (nsSeparator === void 0) nsSeparator = ":";
          const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
          let namespaces = options.ns || this.options.defaultNS || [];
          const wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
          const seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !options.keySeparator && !this.options.userDefinedNsSeparator && !options.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
          if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
            const m = key.match(this.interpolator.nestingRegexp);
            if (m && m.length > 0) {
              return {
                key,
                namespaces: isString(namespaces) ? [namespaces] : namespaces
              };
            }
            const parts = key.split(nsSeparator);
            if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
            key = parts.join(keySeparator);
          }
          return {
            key,
            namespaces: isString(namespaces) ? [namespaces] : namespaces
          };
        }
        translate(keys, options, lastKey) {
          if (typeof options !== "object" && this.options.overloadTranslationOptionHandler) {
            options = this.options.overloadTranslationOptionHandler(arguments);
          }
          if (typeof options === "object") options = {
            ...options
          };
          if (!options) options = {};
          if (keys == null) return "";
          if (!Array.isArray(keys)) keys = [String(keys)];
          const returnDetails = options.returnDetails !== void 0 ? options.returnDetails : this.options.returnDetails;
          const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
          const {
            key,
            namespaces
          } = this.extractFromKey(keys[keys.length - 1], options);
          const namespace = namespaces[namespaces.length - 1];
          const lng = options.lng || this.language;
          const appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
          if (lng?.toLowerCase() === "cimode") {
            if (appendNamespaceToCIMode) {
              const nsSeparator = options.nsSeparator || this.options.nsSeparator;
              if (returnDetails) {
                return {
                  res: `${namespace}${nsSeparator}${key}`,
                  usedKey: key,
                  exactUsedKey: key,
                  usedLng: lng,
                  usedNS: namespace,
                  usedParams: this.getUsedParamsDetails(options)
                };
              }
              return `${namespace}${nsSeparator}${key}`;
            }
            if (returnDetails) {
              return {
                res: key,
                usedKey: key,
                exactUsedKey: key,
                usedLng: lng,
                usedNS: namespace,
                usedParams: this.getUsedParamsDetails(options)
              };
            }
            return key;
          }
          const resolved = this.resolve(keys, options);
          let res = resolved?.res;
          const resUsedKey = resolved?.usedKey || key;
          const resExactUsedKey = resolved?.exactUsedKey || key;
          const noObject = ["[object Number]", "[object Function]", "[object RegExp]"];
          const joinArrays = options.joinArrays !== void 0 ? options.joinArrays : this.options.joinArrays;
          const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
          const needsPluralHandling = options.count !== void 0 && !isString(options.count);
          const hasDefaultValue = _Translator.hasDefaultValue(options);
          const defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, options) : "";
          const defaultValueSuffixOrdinalFallback = options.ordinal && needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, {
            ordinal: false
          }) : "";
          const needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0;
          const defaultValue = needsZeroSuffixLookup && options[`defaultValue${this.options.pluralSeparator}zero`] || options[`defaultValue${defaultValueSuffix}`] || options[`defaultValue${defaultValueSuffixOrdinalFallback}`] || options.defaultValue;
          let resForObjHndl = res;
          if (handleAsObjectInI18nFormat && !res && hasDefaultValue) {
            resForObjHndl = defaultValue;
          }
          const handleAsObject = shouldHandleAsObject(resForObjHndl);
          const resType = Object.prototype.toString.apply(resForObjHndl);
          if (handleAsObjectInI18nFormat && resForObjHndl && handleAsObject && noObject.indexOf(resType) < 0 && !(isString(joinArrays) && Array.isArray(resForObjHndl))) {
            if (!options.returnObjects && !this.options.returnObjects) {
              if (!this.options.returnedObjectHandler) {
                this.logger.warn("accessing an object - but returnObjects options is not enabled!");
              }
              const r = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, resForObjHndl, {
                ...options,
                ns: namespaces
              }) : `key '${key} (${this.language})' returned an object instead of string.`;
              if (returnDetails) {
                resolved.res = r;
                resolved.usedParams = this.getUsedParamsDetails(options);
                return resolved;
              }
              return r;
            }
            if (keySeparator) {
              const resTypeIsArray = Array.isArray(resForObjHndl);
              const copy2 = resTypeIsArray ? [] : {};
              const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
              for (const m in resForObjHndl) {
                if (Object.prototype.hasOwnProperty.call(resForObjHndl, m)) {
                  const deepKey = `${newKeyToUse}${keySeparator}${m}`;
                  if (hasDefaultValue && !res) {
                    copy2[m] = this.translate(deepKey, {
                      ...options,
                      defaultValue: shouldHandleAsObject(defaultValue) ? defaultValue[m] : void 0,
                      ...{
                        joinArrays: false,
                        ns: namespaces
                      }
                    });
                  } else {
                    copy2[m] = this.translate(deepKey, {
                      ...options,
                      ...{
                        joinArrays: false,
                        ns: namespaces
                      }
                    });
                  }
                  if (copy2[m] === deepKey) copy2[m] = resForObjHndl[m];
                }
              }
              res = copy2;
            }
          } else if (handleAsObjectInI18nFormat && isString(joinArrays) && Array.isArray(res)) {
            res = res.join(joinArrays);
            if (res) res = this.extendTranslation(res, keys, options, lastKey);
          } else {
            let usedDefault = false;
            let usedKey = false;
            if (!this.isValidLookup(res) && hasDefaultValue) {
              usedDefault = true;
              res = defaultValue;
            }
            if (!this.isValidLookup(res)) {
              usedKey = true;
              res = key;
            }
            const missingKeyNoValueFallbackToKey = options.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey;
            const resForMissing = missingKeyNoValueFallbackToKey && usedKey ? void 0 : res;
            const updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
            if (usedKey || usedDefault || updateMissing) {
              this.logger.log(updateMissing ? "updateKey" : "missingKey", lng, namespace, key, updateMissing ? defaultValue : res);
              if (keySeparator) {
                const fk = this.resolve(key, {
                  ...options,
                  keySeparator: false
                });
                if (fk && fk.res) this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
              }
              let lngs = [];
              const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);
              if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) {
                for (let i = 0; i < fallbackLngs.length; i++) {
                  lngs.push(fallbackLngs[i]);
                }
              } else if (this.options.saveMissingTo === "all") {
                lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
              } else {
                lngs.push(options.lng || this.language);
              }
              const send = (l, k, specificDefaultValue) => {
                const defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
                if (this.options.missingKeyHandler) {
                  this.options.missingKeyHandler(l, namespace, k, defaultForMissing, updateMissing, options);
                } else if (this.backendConnector?.saveMissing) {
                  this.backendConnector.saveMissing(l, namespace, k, defaultForMissing, updateMissing, options);
                }
                this.emit("missingKey", l, namespace, k, res);
              };
              if (this.options.saveMissing) {
                if (this.options.saveMissingPlurals && needsPluralHandling) {
                  lngs.forEach((language) => {
                    const suffixes = this.pluralResolver.getSuffixes(language, options);
                    if (needsZeroSuffixLookup && options[`defaultValue${this.options.pluralSeparator}zero`] && suffixes.indexOf(`${this.options.pluralSeparator}zero`) < 0) {
                      suffixes.push(`${this.options.pluralSeparator}zero`);
                    }
                    suffixes.forEach((suffix) => {
                      send([language], key + suffix, options[`defaultValue${suffix}`] || defaultValue);
                    });
                  });
                } else {
                  send(lngs, key, defaultValue);
                }
              }
            }
            res = this.extendTranslation(res, keys, options, resolved, lastKey);
            if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = `${namespace}:${key}`;
            if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
              res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${namespace}:${key}` : key, usedDefault ? res : void 0);
            }
          }
          if (returnDetails) {
            resolved.res = res;
            resolved.usedParams = this.getUsedParamsDetails(options);
            return resolved;
          }
          return res;
        }
        extendTranslation(res, key, options, resolved, lastKey) {
          var _this = this;
          if (this.i18nFormat?.parse) {
            res = this.i18nFormat.parse(res, {
              ...this.options.interpolation.defaultVariables,
              ...options
            }, options.lng || this.language || resolved.usedLng, resolved.usedNS, resolved.usedKey, {
              resolved
            });
          } else if (!options.skipInterpolation) {
            if (options.interpolation) this.interpolator.init({
              ...options,
              ...{
                interpolation: {
                  ...this.options.interpolation,
                  ...options.interpolation
                }
              }
            });
            const skipOnVariables = isString(res) && (options?.interpolation?.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
            let nestBef;
            if (skipOnVariables) {
              const nb = res.match(this.interpolator.nestingRegexp);
              nestBef = nb && nb.length;
            }
            let data = options.replace && !isString(options.replace) ? options.replace : options;
            if (this.options.interpolation.defaultVariables) data = {
              ...this.options.interpolation.defaultVariables,
              ...data
            };
            res = this.interpolator.interpolate(res, data, options.lng || this.language || resolved.usedLng, options);
            if (skipOnVariables) {
              const na = res.match(this.interpolator.nestingRegexp);
              const nestAft = na && na.length;
              if (nestBef < nestAft) options.nest = false;
            }
            if (!options.lng && resolved && resolved.res) options.lng = this.language || resolved.usedLng;
            if (options.nest !== false) res = this.interpolator.nest(res, function() {
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }
              if (lastKey?.[0] === args[0] && !options.context) {
                _this.logger.warn(`It seems you are nesting recursively key: ${args[0]} in key: ${key[0]}`);
                return null;
              }
              return _this.translate(...args, key);
            }, options);
            if (options.interpolation) this.interpolator.reset();
          }
          const postProcess = options.postProcess || this.options.postProcess;
          const postProcessorNames = isString(postProcess) ? [postProcess] : postProcess;
          if (res != null && postProcessorNames?.length && options.applyPostProcessor !== false) {
            res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? {
              i18nResolved: {
                ...resolved,
                usedParams: this.getUsedParamsDetails(options)
              },
              ...options
            } : options, this);
          }
          return res;
        }
        resolve(keys) {
          let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          let found;
          let usedKey;
          let exactUsedKey;
          let usedLng;
          let usedNS;
          if (isString(keys)) keys = [keys];
          keys.forEach((k) => {
            if (this.isValidLookup(found)) return;
            const extracted = this.extractFromKey(k, options);
            const key = extracted.key;
            usedKey = key;
            let namespaces = extracted.namespaces;
            if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);
            const needsPluralHandling = options.count !== void 0 && !isString(options.count);
            const needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0;
            const needsContextHandling = options.context !== void 0 && (isString(options.context) || typeof options.context === "number") && options.context !== "";
            const codes = options.lngs ? options.lngs : this.languageUtils.toResolveHierarchy(options.lng || this.language, options.fallbackLng);
            namespaces.forEach((ns) => {
              if (this.isValidLookup(found)) return;
              usedNS = ns;
              if (!checkedLoadedFor[`${codes[0]}-${ns}`] && this.utils?.hasLoadedNamespace && !this.utils?.hasLoadedNamespace(usedNS)) {
                checkedLoadedFor[`${codes[0]}-${ns}`] = true;
                this.logger.warn(`key "${usedKey}" for languages "${codes.join(", ")}" won't get resolved as namespace "${usedNS}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
              }
              codes.forEach((code) => {
                if (this.isValidLookup(found)) return;
                usedLng = code;
                const finalKeys = [key];
                if (this.i18nFormat?.addLookupKeys) {
                  this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, options);
                } else {
                  let pluralSuffix;
                  if (needsPluralHandling) pluralSuffix = this.pluralResolver.getSuffix(code, options.count, options);
                  const zeroSuffix = `${this.options.pluralSeparator}zero`;
                  const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
                  if (needsPluralHandling) {
                    finalKeys.push(key + pluralSuffix);
                    if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                      finalKeys.push(key + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
                    }
                    if (needsZeroSuffixLookup) {
                      finalKeys.push(key + zeroSuffix);
                    }
                  }
                  if (needsContextHandling) {
                    const contextKey = `${key}${this.options.contextSeparator}${options.context}`;
                    finalKeys.push(contextKey);
                    if (needsPluralHandling) {
                      finalKeys.push(contextKey + pluralSuffix);
                      if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                        finalKeys.push(contextKey + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
                      }
                      if (needsZeroSuffixLookup) {
                        finalKeys.push(contextKey + zeroSuffix);
                      }
                    }
                  }
                }
                let possibleKey;
                while (possibleKey = finalKeys.pop()) {
                  if (!this.isValidLookup(found)) {
                    exactUsedKey = possibleKey;
                    found = this.getResource(code, ns, possibleKey, options);
                  }
                }
              });
            });
          });
          return {
            res: found,
            usedKey,
            exactUsedKey,
            usedLng,
            usedNS
          };
        }
        isValidLookup(res) {
          return res !== void 0 && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === "");
        }
        getResource(code, ns, key) {
          let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
          if (this.i18nFormat?.getResource) return this.i18nFormat.getResource(code, ns, key, options);
          return this.resourceStore.getResource(code, ns, key, options);
        }
        getUsedParamsDetails() {
          let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          const optionsKeys = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"];
          const useOptionsReplaceForData = options.replace && !isString(options.replace);
          let data = useOptionsReplaceForData ? options.replace : options;
          if (useOptionsReplaceForData && typeof options.count !== "undefined") {
            data.count = options.count;
          }
          if (this.options.interpolation.defaultVariables) {
            data = {
              ...this.options.interpolation.defaultVariables,
              ...data
            };
          }
          if (!useOptionsReplaceForData) {
            data = {
              ...data
            };
            for (const key of optionsKeys) {
              delete data[key];
            }
          }
          return data;
        }
        static hasDefaultValue(options) {
          const prefix = "defaultValue";
          for (const option in options) {
            if (Object.prototype.hasOwnProperty.call(options, option) && prefix === option.substring(0, prefix.length) && void 0 !== options[option]) {
              return true;
            }
          }
          return false;
        }
      };
      LanguageUtil = class {
        constructor(options) {
          this.options = options;
          this.supportedLngs = this.options.supportedLngs || false;
          this.logger = baseLogger.create("languageUtils");
        }
        getScriptPartFromCode(code) {
          code = getCleanedCode(code);
          if (!code || code.indexOf("-") < 0) return null;
          const p = code.split("-");
          if (p.length === 2) return null;
          p.pop();
          if (p[p.length - 1].toLowerCase() === "x") return null;
          return this.formatLanguageCode(p.join("-"));
        }
        getLanguagePartFromCode(code) {
          code = getCleanedCode(code);
          if (!code || code.indexOf("-") < 0) return code;
          const p = code.split("-");
          return this.formatLanguageCode(p[0]);
        }
        formatLanguageCode(code) {
          if (isString(code) && code.indexOf("-") > -1) {
            let formattedCode;
            try {
              formattedCode = Intl.getCanonicalLocales(code)[0];
            } catch (e) {
            }
            if (formattedCode && this.options.lowerCaseLng) {
              formattedCode = formattedCode.toLowerCase();
            }
            if (formattedCode) return formattedCode;
            if (this.options.lowerCaseLng) {
              return code.toLowerCase();
            }
            return code;
          }
          return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
        }
        isSupportedCode(code) {
          if (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) {
            code = this.getLanguagePartFromCode(code);
          }
          return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
        }
        getBestMatchFromCodes(codes) {
          if (!codes) return null;
          let found;
          codes.forEach((code) => {
            if (found) return;
            const cleanedLng = this.formatLanguageCode(code);
            if (!this.options.supportedLngs || this.isSupportedCode(cleanedLng)) found = cleanedLng;
          });
          if (!found && this.options.supportedLngs) {
            codes.forEach((code) => {
              if (found) return;
              const lngOnly = this.getLanguagePartFromCode(code);
              if (this.isSupportedCode(lngOnly)) return found = lngOnly;
              found = this.options.supportedLngs.find((supportedLng) => {
                if (supportedLng === lngOnly) return supportedLng;
                if (supportedLng.indexOf("-") < 0 && lngOnly.indexOf("-") < 0) return;
                if (supportedLng.indexOf("-") > 0 && lngOnly.indexOf("-") < 0 && supportedLng.substring(0, supportedLng.indexOf("-")) === lngOnly) return supportedLng;
                if (supportedLng.indexOf(lngOnly) === 0 && lngOnly.length > 1) return supportedLng;
              });
            });
          }
          if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
          return found;
        }
        getFallbackCodes(fallbacks, code) {
          if (!fallbacks) return [];
          if (typeof fallbacks === "function") fallbacks = fallbacks(code);
          if (isString(fallbacks)) fallbacks = [fallbacks];
          if (Array.isArray(fallbacks)) return fallbacks;
          if (!code) return fallbacks.default || [];
          let found = fallbacks[code];
          if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
          if (!found) found = fallbacks[this.formatLanguageCode(code)];
          if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
          if (!found) found = fallbacks.default;
          return found || [];
        }
        toResolveHierarchy(code, fallbackCode) {
          const fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
          const codes = [];
          const addCode = (c) => {
            if (!c) return;
            if (this.isSupportedCode(c)) {
              codes.push(c);
            } else {
              this.logger.warn(`rejecting language code not found in supportedLngs: ${c}`);
            }
          };
          if (isString(code) && (code.indexOf("-") > -1 || code.indexOf("_") > -1)) {
            if (this.options.load !== "languageOnly") addCode(this.formatLanguageCode(code));
            if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly") addCode(this.getScriptPartFromCode(code));
            if (this.options.load !== "currentOnly") addCode(this.getLanguagePartFromCode(code));
          } else if (isString(code)) {
            addCode(this.formatLanguageCode(code));
          }
          fallbackCodes.forEach((fc) => {
            if (codes.indexOf(fc) < 0) addCode(this.formatLanguageCode(fc));
          });
          return codes;
        }
      };
      suffixesOrder = {
        zero: 0,
        one: 1,
        two: 2,
        few: 3,
        many: 4,
        other: 5
      };
      dummyRule = {
        select: (count) => count === 1 ? "one" : "other",
        resolvedOptions: () => ({
          pluralCategories: ["one", "other"]
        })
      };
      PluralResolver = class {
        constructor(languageUtils) {
          let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          this.languageUtils = languageUtils;
          this.options = options;
          this.logger = baseLogger.create("pluralResolver");
          this.pluralRulesCache = {};
        }
        addRule(lng, obj) {
          this.rules[lng] = obj;
        }
        clearCache() {
          this.pluralRulesCache = {};
        }
        getRule(code) {
          let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          const cleanedCode = getCleanedCode(code === "dev" ? "en" : code);
          const type = options.ordinal ? "ordinal" : "cardinal";
          const cacheKey = JSON.stringify({
            cleanedCode,
            type
          });
          if (cacheKey in this.pluralRulesCache) {
            return this.pluralRulesCache[cacheKey];
          }
          let rule;
          try {
            rule = new Intl.PluralRules(cleanedCode, {
              type
            });
          } catch (err) {
            if (!Intl) {
              this.logger.error("No Intl support, please use an Intl polyfill!");
              return dummyRule;
            }
            if (!code.match(/-|_/)) return dummyRule;
            const lngPart = this.languageUtils.getLanguagePartFromCode(code);
            rule = this.getRule(lngPart, options);
          }
          this.pluralRulesCache[cacheKey] = rule;
          return rule;
        }
        needsPlural(code) {
          let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          let rule = this.getRule(code, options);
          if (!rule) rule = this.getRule("dev", options);
          return rule?.resolvedOptions().pluralCategories.length > 1;
        }
        getPluralFormsOfKey(code, key) {
          let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return this.getSuffixes(code, options).map((suffix) => `${key}${suffix}`);
        }
        getSuffixes(code) {
          let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          let rule = this.getRule(code, options);
          if (!rule) rule = this.getRule("dev", options);
          if (!rule) return [];
          return rule.resolvedOptions().pluralCategories.sort((pluralCategory1, pluralCategory2) => suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2]).map((pluralCategory) => `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${pluralCategory}`);
        }
        getSuffix(code, count) {
          let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          const rule = this.getRule(code, options);
          if (rule) {
            return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${rule.select(count)}`;
          }
          this.logger.warn(`no plural rule found for: ${code}`);
          return this.getSuffix("dev", count, options);
        }
      };
      deepFindWithDefaults = function(data, defaultData, key) {
        let keySeparator = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ".";
        let ignoreJSONStructure = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true;
        let path = getPathWithDefaults(data, defaultData, key);
        if (!path && ignoreJSONStructure && isString(key)) {
          path = deepFind(data, key, keySeparator);
          if (path === void 0) path = deepFind(defaultData, key, keySeparator);
        }
        return path;
      };
      regexSafe = (val) => val.replace(/\$/g, "$$$$");
      Interpolator = class {
        constructor() {
          let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          this.logger = baseLogger.create("interpolator");
          this.options = options;
          this.format = options?.interpolation?.format || ((value) => value);
          this.init(options);
        }
        init() {
          let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          if (!options.interpolation) options.interpolation = {
            escapeValue: true
          };
          const {
            escape: escape$1,
            escapeValue,
            useRawValueToEscape,
            prefix,
            prefixEscaped,
            suffix,
            suffixEscaped,
            formatSeparator,
            unescapeSuffix,
            unescapePrefix,
            nestingPrefix,
            nestingPrefixEscaped,
            nestingSuffix,
            nestingSuffixEscaped,
            nestingOptionsSeparator,
            maxReplaces,
            alwaysFormat
          } = options.interpolation;
          this.escape = escape$1 !== void 0 ? escape$1 : escape;
          this.escapeValue = escapeValue !== void 0 ? escapeValue : true;
          this.useRawValueToEscape = useRawValueToEscape !== void 0 ? useRawValueToEscape : false;
          this.prefix = prefix ? regexEscape(prefix) : prefixEscaped || "{{";
          this.suffix = suffix ? regexEscape(suffix) : suffixEscaped || "}}";
          this.formatSeparator = formatSeparator || ",";
          this.unescapePrefix = unescapeSuffix ? "" : unescapePrefix || "-";
          this.unescapeSuffix = this.unescapePrefix ? "" : unescapeSuffix || "";
          this.nestingPrefix = nestingPrefix ? regexEscape(nestingPrefix) : nestingPrefixEscaped || regexEscape("$t(");
          this.nestingSuffix = nestingSuffix ? regexEscape(nestingSuffix) : nestingSuffixEscaped || regexEscape(")");
          this.nestingOptionsSeparator = nestingOptionsSeparator || ",";
          this.maxReplaces = maxReplaces || 1e3;
          this.alwaysFormat = alwaysFormat !== void 0 ? alwaysFormat : false;
          this.resetRegExp();
        }
        reset() {
          if (this.options) this.init(this.options);
        }
        resetRegExp() {
          const getOrResetRegExp = (existingRegExp, pattern) => {
            if (existingRegExp?.source === pattern) {
              existingRegExp.lastIndex = 0;
              return existingRegExp;
            }
            return new RegExp(pattern, "g");
          };
          this.regexp = getOrResetRegExp(this.regexp, `${this.prefix}(.+?)${this.suffix}`);
          this.regexpUnescape = getOrResetRegExp(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`);
          this.nestingRegexp = getOrResetRegExp(this.nestingRegexp, `${this.nestingPrefix}(.+?)${this.nestingSuffix}`);
        }
        interpolate(str, data, lng, options) {
          let match;
          let value;
          let replaces;
          const defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
          const handleFormat = (key) => {
            if (key.indexOf(this.formatSeparator) < 0) {
              const path = deepFindWithDefaults(data, defaultData, key, this.options.keySeparator, this.options.ignoreJSONStructure);
              return this.alwaysFormat ? this.format(path, void 0, lng, {
                ...options,
                ...data,
                interpolationkey: key
              }) : path;
            }
            const p = key.split(this.formatSeparator);
            const k = p.shift().trim();
            const f = p.join(this.formatSeparator).trim();
            return this.format(deepFindWithDefaults(data, defaultData, k, this.options.keySeparator, this.options.ignoreJSONStructure), f, lng, {
              ...options,
              ...data,
              interpolationkey: k
            });
          };
          this.resetRegExp();
          const missingInterpolationHandler = options?.missingInterpolationHandler || this.options.missingInterpolationHandler;
          const skipOnVariables = options?.interpolation?.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
          const todos = [{
            regex: this.regexpUnescape,
            safeValue: (val) => regexSafe(val)
          }, {
            regex: this.regexp,
            safeValue: (val) => this.escapeValue ? regexSafe(this.escape(val)) : regexSafe(val)
          }];
          todos.forEach((todo) => {
            replaces = 0;
            while (match = todo.regex.exec(str)) {
              const matchedVar = match[1].trim();
              value = handleFormat(matchedVar);
              if (value === void 0) {
                if (typeof missingInterpolationHandler === "function") {
                  const temp = missingInterpolationHandler(str, match, options);
                  value = isString(temp) ? temp : "";
                } else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) {
                  value = "";
                } else if (skipOnVariables) {
                  value = match[0];
                  continue;
                } else {
                  this.logger.warn(`missed to pass in variable ${matchedVar} for interpolating ${str}`);
                  value = "";
                }
              } else if (!isString(value) && !this.useRawValueToEscape) {
                value = makeString(value);
              }
              const safeValue = todo.safeValue(value);
              str = str.replace(match[0], safeValue);
              if (skipOnVariables) {
                todo.regex.lastIndex += value.length;
                todo.regex.lastIndex -= match[0].length;
              } else {
                todo.regex.lastIndex = 0;
              }
              replaces++;
              if (replaces >= this.maxReplaces) {
                break;
              }
            }
          });
          return str;
        }
        nest(str, fc) {
          let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          let match;
          let value;
          let clonedOptions;
          const handleHasOptions = (key, inheritedOptions) => {
            const sep = this.nestingOptionsSeparator;
            if (key.indexOf(sep) < 0) return key;
            const c = key.split(new RegExp(`${sep}[ ]*{`));
            let optionsString = `{${c[1]}`;
            key = c[0];
            optionsString = this.interpolate(optionsString, clonedOptions);
            const matchedSingleQuotes = optionsString.match(/'/g);
            const matchedDoubleQuotes = optionsString.match(/"/g);
            if ((matchedSingleQuotes?.length ?? 0) % 2 === 0 && !matchedDoubleQuotes || matchedDoubleQuotes.length % 2 !== 0) {
              optionsString = optionsString.replace(/'/g, '"');
            }
            try {
              clonedOptions = JSON.parse(optionsString);
              if (inheritedOptions) clonedOptions = {
                ...inheritedOptions,
                ...clonedOptions
              };
            } catch (e) {
              this.logger.warn(`failed parsing options string in nesting for key ${key}`, e);
              return `${key}${sep}${optionsString}`;
            }
            if (clonedOptions.defaultValue && clonedOptions.defaultValue.indexOf(this.prefix) > -1) delete clonedOptions.defaultValue;
            return key;
          };
          while (match = this.nestingRegexp.exec(str)) {
            let formatters = [];
            clonedOptions = {
              ...options
            };
            clonedOptions = clonedOptions.replace && !isString(clonedOptions.replace) ? clonedOptions.replace : clonedOptions;
            clonedOptions.applyPostProcessor = false;
            delete clonedOptions.defaultValue;
            let doReduce = false;
            if (match[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(match[1])) {
              const r = match[1].split(this.formatSeparator).map((elem) => elem.trim());
              match[1] = r.shift();
              formatters = r;
              doReduce = true;
            }
            value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
            if (value && match[0] === str && !isString(value)) return value;
            if (!isString(value)) value = makeString(value);
            if (!value) {
              this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
              value = "";
            }
            if (doReduce) {
              value = formatters.reduce((v, f) => this.format(v, f, options.lng, {
                ...options,
                interpolationkey: match[1].trim()
              }), value.trim());
            }
            str = str.replace(match[0], value);
            this.regexp.lastIndex = 0;
          }
          return str;
        }
      };
      parseFormatStr = (formatStr) => {
        let formatName = formatStr.toLowerCase().trim();
        const formatOptions = {};
        if (formatStr.indexOf("(") > -1) {
          const p = formatStr.split("(");
          formatName = p[0].toLowerCase().trim();
          const optStr = p[1].substring(0, p[1].length - 1);
          if (formatName === "currency" && optStr.indexOf(":") < 0) {
            if (!formatOptions.currency) formatOptions.currency = optStr.trim();
          } else if (formatName === "relativetime" && optStr.indexOf(":") < 0) {
            if (!formatOptions.range) formatOptions.range = optStr.trim();
          } else {
            const opts = optStr.split(";");
            opts.forEach((opt) => {
              if (opt) {
                const [key, ...rest] = opt.split(":");
                const val = rest.join(":").trim().replace(/^'+|'+$/g, "");
                const trimmedKey = key.trim();
                if (!formatOptions[trimmedKey]) formatOptions[trimmedKey] = val;
                if (val === "false") formatOptions[trimmedKey] = false;
                if (val === "true") formatOptions[trimmedKey] = true;
                if (!isNaN(val)) formatOptions[trimmedKey] = parseInt(val, 10);
              }
            });
          }
        }
        return {
          formatName,
          formatOptions
        };
      };
      createCachedFormatter = (fn) => {
        const cache = {};
        return (val, lng, options) => {
          let optForCache = options;
          if (options && options.interpolationkey && options.formatParams && options.formatParams[options.interpolationkey] && options[options.interpolationkey]) {
            optForCache = {
              ...optForCache,
              [options.interpolationkey]: void 0
            };
          }
          const key = lng + JSON.stringify(optForCache);
          let formatter = cache[key];
          if (!formatter) {
            formatter = fn(getCleanedCode(lng), options);
            cache[key] = formatter;
          }
          return formatter(val);
        };
      };
      Formatter = class {
        constructor() {
          let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          this.logger = baseLogger.create("formatter");
          this.options = options;
          this.formats = {
            number: createCachedFormatter((lng, opt) => {
              const formatter = new Intl.NumberFormat(lng, {
                ...opt
              });
              return (val) => formatter.format(val);
            }),
            currency: createCachedFormatter((lng, opt) => {
              const formatter = new Intl.NumberFormat(lng, {
                ...opt,
                style: "currency"
              });
              return (val) => formatter.format(val);
            }),
            datetime: createCachedFormatter((lng, opt) => {
              const formatter = new Intl.DateTimeFormat(lng, {
                ...opt
              });
              return (val) => formatter.format(val);
            }),
            relativetime: createCachedFormatter((lng, opt) => {
              const formatter = new Intl.RelativeTimeFormat(lng, {
                ...opt
              });
              return (val) => formatter.format(val, opt.range || "day");
            }),
            list: createCachedFormatter((lng, opt) => {
              const formatter = new Intl.ListFormat(lng, {
                ...opt
              });
              return (val) => formatter.format(val);
            })
          };
          this.init(options);
        }
        init(services) {
          let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
            interpolation: {}
          };
          this.formatSeparator = options.interpolation.formatSeparator || ",";
        }
        add(name, fc) {
          this.formats[name.toLowerCase().trim()] = fc;
        }
        addCached(name, fc) {
          this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
        }
        format(value, format, lng) {
          let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
          const formats = format.split(this.formatSeparator);
          if (formats.length > 1 && formats[0].indexOf("(") > 1 && formats[0].indexOf(")") < 0 && formats.find((f) => f.indexOf(")") > -1)) {
            const lastIndex = formats.findIndex((f) => f.indexOf(")") > -1);
            formats[0] = [formats[0], ...formats.splice(1, lastIndex)].join(this.formatSeparator);
          }
          const result = formats.reduce((mem, f) => {
            const {
              formatName,
              formatOptions
            } = parseFormatStr(f);
            if (this.formats[formatName]) {
              let formatted = mem;
              try {
                const valOptions = options?.formatParams?.[options.interpolationkey] || {};
                const l = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
                formatted = this.formats[formatName](mem, l, {
                  ...formatOptions,
                  ...options,
                  ...valOptions
                });
              } catch (error) {
                this.logger.warn(error);
              }
              return formatted;
            } else {
              this.logger.warn(`there was no format function for ${formatName}`);
            }
            return mem;
          }, value);
          return result;
        }
      };
      removePending = (q, name) => {
        if (q.pending[name] !== void 0) {
          delete q.pending[name];
          q.pendingCount--;
        }
      };
      Connector = class extends EventEmitter {
        constructor(backend, store, services) {
          let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
          super();
          this.backend = backend;
          this.store = store;
          this.services = services;
          this.languageUtils = services.languageUtils;
          this.options = options;
          this.logger = baseLogger.create("backendConnector");
          this.waitingReads = [];
          this.maxParallelReads = options.maxParallelReads || 10;
          this.readingCalls = 0;
          this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
          this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
          this.state = {};
          this.queue = [];
          this.backend?.init?.(services, options.backend, options);
        }
        queueLoad(languages, namespaces, options, callback) {
          const toLoad = {};
          const pending = {};
          const toLoadLanguages = {};
          const toLoadNamespaces = {};
          languages.forEach((lng) => {
            let hasAllNamespaces = true;
            namespaces.forEach((ns) => {
              const name = `${lng}|${ns}`;
              if (!options.reload && this.store.hasResourceBundle(lng, ns)) {
                this.state[name] = 2;
              } else if (this.state[name] < 0) ;
              else if (this.state[name] === 1) {
                if (pending[name] === void 0) pending[name] = true;
              } else {
                this.state[name] = 1;
                hasAllNamespaces = false;
                if (pending[name] === void 0) pending[name] = true;
                if (toLoad[name] === void 0) toLoad[name] = true;
                if (toLoadNamespaces[ns] === void 0) toLoadNamespaces[ns] = true;
              }
            });
            if (!hasAllNamespaces) toLoadLanguages[lng] = true;
          });
          if (Object.keys(toLoad).length || Object.keys(pending).length) {
            this.queue.push({
              pending,
              pendingCount: Object.keys(pending).length,
              loaded: {},
              errors: [],
              callback
            });
          }
          return {
            toLoad: Object.keys(toLoad),
            pending: Object.keys(pending),
            toLoadLanguages: Object.keys(toLoadLanguages),
            toLoadNamespaces: Object.keys(toLoadNamespaces)
          };
        }
        loaded(name, err, data) {
          const s = name.split("|");
          const lng = s[0];
          const ns = s[1];
          if (err) this.emit("failedLoading", lng, ns, err);
          if (!err && data) {
            this.store.addResourceBundle(lng, ns, data, void 0, void 0, {
              skipCopy: true
            });
          }
          this.state[name] = err ? -1 : 2;
          if (err && data) this.state[name] = 0;
          const loaded = {};
          this.queue.forEach((q) => {
            pushPath(q.loaded, [lng], ns);
            removePending(q, name);
            if (err) q.errors.push(err);
            if (q.pendingCount === 0 && !q.done) {
              Object.keys(q.loaded).forEach((l) => {
                if (!loaded[l]) loaded[l] = {};
                const loadedKeys = q.loaded[l];
                if (loadedKeys.length) {
                  loadedKeys.forEach((n) => {
                    if (loaded[l][n] === void 0) loaded[l][n] = true;
                  });
                }
              });
              q.done = true;
              if (q.errors.length) {
                q.callback(q.errors);
              } else {
                q.callback();
              }
            }
          });
          this.emit("loaded", loaded);
          this.queue = this.queue.filter((q) => !q.done);
        }
        read(lng, ns, fcName) {
          let tried = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
          let wait = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : this.retryTimeout;
          let callback = arguments.length > 5 ? arguments[5] : void 0;
          if (!lng.length) return callback(null, {});
          if (this.readingCalls >= this.maxParallelReads) {
            this.waitingReads.push({
              lng,
              ns,
              fcName,
              tried,
              wait,
              callback
            });
            return;
          }
          this.readingCalls++;
          const resolver = (err, data) => {
            this.readingCalls--;
            if (this.waitingReads.length > 0) {
              const next = this.waitingReads.shift();
              this.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
            }
            if (err && data && tried < this.maxRetries) {
              setTimeout(() => {
                this.read.call(this, lng, ns, fcName, tried + 1, wait * 2, callback);
              }, wait);
              return;
            }
            callback(err, data);
          };
          const fc = this.backend[fcName].bind(this.backend);
          if (fc.length === 2) {
            try {
              const r = fc(lng, ns);
              if (r && typeof r.then === "function") {
                r.then((data) => resolver(null, data)).catch(resolver);
              } else {
                resolver(null, r);
              }
            } catch (err) {
              resolver(err);
            }
            return;
          }
          return fc(lng, ns, resolver);
        }
        prepareLoading(languages, namespaces) {
          let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          let callback = arguments.length > 3 ? arguments[3] : void 0;
          if (!this.backend) {
            this.logger.warn("No backend was added via i18next.use. Will not load resources.");
            return callback && callback();
          }
          if (isString(languages)) languages = this.languageUtils.toResolveHierarchy(languages);
          if (isString(namespaces)) namespaces = [namespaces];
          const toLoad = this.queueLoad(languages, namespaces, options, callback);
          if (!toLoad.toLoad.length) {
            if (!toLoad.pending.length) callback();
            return null;
          }
          toLoad.toLoad.forEach((name) => {
            this.loadOne(name);
          });
        }
        load(languages, namespaces, callback) {
          this.prepareLoading(languages, namespaces, {}, callback);
        }
        reload(languages, namespaces, callback) {
          this.prepareLoading(languages, namespaces, {
            reload: true
          }, callback);
        }
        loadOne(name) {
          let prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
          const s = name.split("|");
          const lng = s[0];
          const ns = s[1];
          this.read(lng, ns, "read", void 0, void 0, (err, data) => {
            if (err) this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err);
            if (!err && data) this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);
            this.loaded(name, err, data);
          });
        }
        saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
          let options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {};
          let clb = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : () => {
          };
          if (this.services?.utils?.hasLoadedNamespace && !this.services?.utils?.hasLoadedNamespace(namespace)) {
            this.logger.warn(`did not save key "${key}" as the namespace "${namespace}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
            return;
          }
          if (key === void 0 || key === null || key === "") return;
          if (this.backend?.create) {
            const opts = {
              ...options,
              isUpdate
            };
            const fc = this.backend.create.bind(this.backend);
            if (fc.length < 6) {
              try {
                let r;
                if (fc.length === 5) {
                  r = fc(languages, namespace, key, fallbackValue, opts);
                } else {
                  r = fc(languages, namespace, key, fallbackValue);
                }
                if (r && typeof r.then === "function") {
                  r.then((data) => clb(null, data)).catch(clb);
                } else {
                  clb(null, r);
                }
              } catch (err) {
                clb(err);
              }
            } else {
              fc(languages, namespace, key, fallbackValue, clb, opts);
            }
          }
          if (!languages || !languages[0]) return;
          this.store.addResource(languages[0], namespace, key, fallbackValue);
        }
      };
      get = () => ({
        debug: false,
        initAsync: true,
        ns: ["translation"],
        defaultNS: ["translation"],
        fallbackLng: ["dev"],
        fallbackNS: false,
        supportedLngs: false,
        nonExplicitSupportedLngs: false,
        load: "all",
        preload: false,
        simplifyPluralSuffix: true,
        keySeparator: ".",
        nsSeparator: ":",
        pluralSeparator: "_",
        contextSeparator: "_",
        partialBundledLanguages: false,
        saveMissing: false,
        updateMissing: false,
        saveMissingTo: "fallback",
        saveMissingPlurals: true,
        missingKeyHandler: false,
        missingInterpolationHandler: false,
        postProcess: false,
        postProcessPassResolved: false,
        returnNull: false,
        returnEmptyString: true,
        returnObjects: false,
        joinArrays: false,
        returnedObjectHandler: false,
        parseMissingKeyHandler: false,
        appendNamespaceToMissingKey: false,
        appendNamespaceToCIMode: false,
        overloadTranslationOptionHandler: (args) => {
          let ret = {};
          if (typeof args[1] === "object") ret = args[1];
          if (isString(args[1])) ret.defaultValue = args[1];
          if (isString(args[2])) ret.tDescription = args[2];
          if (typeof args[2] === "object" || typeof args[3] === "object") {
            const options = args[3] || args[2];
            Object.keys(options).forEach((key) => {
              ret[key] = options[key];
            });
          }
          return ret;
        },
        interpolation: {
          escapeValue: true,
          format: (value) => value,
          prefix: "{{",
          suffix: "}}",
          formatSeparator: ",",
          unescapePrefix: "-",
          nestingPrefix: "$t(",
          nestingSuffix: ")",
          nestingOptionsSeparator: ",",
          maxReplaces: 1e3,
          skipOnVariables: true
        }
      });
      transformOptions = (options) => {
        if (isString(options.ns)) options.ns = [options.ns];
        if (isString(options.fallbackLng)) options.fallbackLng = [options.fallbackLng];
        if (isString(options.fallbackNS)) options.fallbackNS = [options.fallbackNS];
        if (options.supportedLngs?.indexOf?.("cimode") < 0) {
          options.supportedLngs = options.supportedLngs.concat(["cimode"]);
        }
        if (typeof options.initImmediate === "boolean") options.initAsync = options.initImmediate;
        return options;
      };
      noop = () => {
      };
      bindMemberFunctions = (inst) => {
        const mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
        mems.forEach((mem) => {
          if (typeof inst[mem] === "function") {
            inst[mem] = inst[mem].bind(inst);
          }
        });
      };
      I18n = class _I18n extends EventEmitter {
        constructor() {
          let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          let callback = arguments.length > 1 ? arguments[1] : void 0;
          super();
          this.options = transformOptions(options);
          this.services = {};
          this.logger = baseLogger;
          this.modules = {
            external: []
          };
          bindMemberFunctions(this);
          if (callback && !this.isInitialized && !options.isClone) {
            if (!this.options.initAsync) {
              this.init(options, callback);
              return this;
            }
            setTimeout(() => {
              this.init(options, callback);
            }, 0);
          }
        }
        init() {
          var _this = this;
          let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          let callback = arguments.length > 1 ? arguments[1] : void 0;
          this.isInitializing = true;
          if (typeof options === "function") {
            callback = options;
            options = {};
          }
          if (options.defaultNS == null && options.ns) {
            if (isString(options.ns)) {
              options.defaultNS = options.ns;
            } else if (options.ns.indexOf("translation") < 0) {
              options.defaultNS = options.ns[0];
            }
          }
          const defOpts = get();
          this.options = {
            ...defOpts,
            ...this.options,
            ...transformOptions(options)
          };
          this.options.interpolation = {
            ...defOpts.interpolation,
            ...this.options.interpolation
          };
          if (options.keySeparator !== void 0) {
            this.options.userDefinedKeySeparator = options.keySeparator;
          }
          if (options.nsSeparator !== void 0) {
            this.options.userDefinedNsSeparator = options.nsSeparator;
          }
          const createClassOnDemand = (ClassOrObject) => {
            if (!ClassOrObject) return null;
            if (typeof ClassOrObject === "function") return new ClassOrObject();
            return ClassOrObject;
          };
          if (!this.options.isClone) {
            if (this.modules.logger) {
              baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
            } else {
              baseLogger.init(null, this.options);
            }
            let formatter;
            if (this.modules.formatter) {
              formatter = this.modules.formatter;
            } else {
              formatter = Formatter;
            }
            const lu = new LanguageUtil(this.options);
            this.store = new ResourceStore(this.options.resources, this.options);
            const s = this.services;
            s.logger = baseLogger;
            s.resourceStore = this.store;
            s.languageUtils = lu;
            s.pluralResolver = new PluralResolver(lu, {
              prepend: this.options.pluralSeparator,
              simplifyPluralSuffix: this.options.simplifyPluralSuffix
            });
            if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
              s.formatter = createClassOnDemand(formatter);
              s.formatter.init(s, this.options);
              this.options.interpolation.format = s.formatter.format.bind(s.formatter);
            }
            s.interpolator = new Interpolator(this.options);
            s.utils = {
              hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
            };
            s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
            s.backendConnector.on("*", function(event) {
              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }
              _this.emit(event, ...args);
            });
            if (this.modules.languageDetector) {
              s.languageDetector = createClassOnDemand(this.modules.languageDetector);
              if (s.languageDetector.init) s.languageDetector.init(s, this.options.detection, this.options);
            }
            if (this.modules.i18nFormat) {
              s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
              if (s.i18nFormat.init) s.i18nFormat.init(this);
            }
            this.translator = new Translator(this.services, this.options);
            this.translator.on("*", function(event) {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              _this.emit(event, ...args);
            });
            this.modules.external.forEach((m) => {
              if (m.init) m.init(this);
            });
          }
          this.format = this.options.interpolation.format;
          if (!callback) callback = noop;
          if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
            const codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
            if (codes.length > 0 && codes[0] !== "dev") this.options.lng = codes[0];
          }
          if (!this.services.languageDetector && !this.options.lng) {
            this.logger.warn("init: no languageDetector is used and no lng is defined");
          }
          const storeApi = ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"];
          storeApi.forEach((fcName) => {
            this[fcName] = function() {
              return _this.store[fcName](...arguments);
            };
          });
          const storeApiChained = ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"];
          storeApiChained.forEach((fcName) => {
            this[fcName] = function() {
              _this.store[fcName](...arguments);
              return _this;
            };
          });
          const deferred = defer();
          const load = () => {
            const finish = (err, t2) => {
              this.isInitializing = false;
              if (this.isInitialized && !this.initializedStoreOnce) this.logger.warn("init: i18next is already initialized. You should call init just once!");
              this.isInitialized = true;
              if (!this.options.isClone) this.logger.log("initialized", this.options);
              this.emit("initialized", this.options);
              deferred.resolve(t2);
              callback(err, t2);
            };
            if (this.languages && !this.isInitialized) return finish(null, this.t.bind(this));
            this.changeLanguage(this.options.lng, finish);
          };
          if (this.options.resources || !this.options.initAsync) {
            load();
          } else {
            setTimeout(load, 0);
          }
          return deferred;
        }
        loadResources(language) {
          let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop;
          let usedCallback = callback;
          const usedLng = isString(language) ? language : this.language;
          if (typeof language === "function") usedCallback = language;
          if (!this.options.resources || this.options.partialBundledLanguages) {
            if (usedLng?.toLowerCase() === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return usedCallback();
            const toLoad = [];
            const append = (lng) => {
              if (!lng) return;
              if (lng === "cimode") return;
              const lngs = this.services.languageUtils.toResolveHierarchy(lng);
              lngs.forEach((l) => {
                if (l === "cimode") return;
                if (toLoad.indexOf(l) < 0) toLoad.push(l);
              });
            };
            if (!usedLng) {
              const fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
              fallbacks.forEach((l) => append(l));
            } else {
              append(usedLng);
            }
            this.options.preload?.forEach?.((l) => append(l));
            this.services.backendConnector.load(toLoad, this.options.ns, (e) => {
              if (!e && !this.resolvedLanguage && this.language) this.setResolvedLanguage(this.language);
              usedCallback(e);
            });
          } else {
            usedCallback(null);
          }
        }
        reloadResources(lngs, ns, callback) {
          const deferred = defer();
          if (typeof lngs === "function") {
            callback = lngs;
            lngs = void 0;
          }
          if (typeof ns === "function") {
            callback = ns;
            ns = void 0;
          }
          if (!lngs) lngs = this.languages;
          if (!ns) ns = this.options.ns;
          if (!callback) callback = noop;
          this.services.backendConnector.reload(lngs, ns, (err) => {
            deferred.resolve();
            callback(err);
          });
          return deferred;
        }
        use(module) {
          if (!module) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
          if (!module.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
          if (module.type === "backend") {
            this.modules.backend = module;
          }
          if (module.type === "logger" || module.log && module.warn && module.error) {
            this.modules.logger = module;
          }
          if (module.type === "languageDetector") {
            this.modules.languageDetector = module;
          }
          if (module.type === "i18nFormat") {
            this.modules.i18nFormat = module;
          }
          if (module.type === "postProcessor") {
            postProcessor.addPostProcessor(module);
          }
          if (module.type === "formatter") {
            this.modules.formatter = module;
          }
          if (module.type === "3rdParty") {
            this.modules.external.push(module);
          }
          return this;
        }
        setResolvedLanguage(l) {
          if (!l || !this.languages) return;
          if (["cimode", "dev"].indexOf(l) > -1) return;
          for (let li = 0; li < this.languages.length; li++) {
            const lngInLngs = this.languages[li];
            if (["cimode", "dev"].indexOf(lngInLngs) > -1) continue;
            if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
              this.resolvedLanguage = lngInLngs;
              break;
            }
          }
        }
        changeLanguage(lng, callback) {
          var _this2 = this;
          this.isLanguageChangingTo = lng;
          const deferred = defer();
          this.emit("languageChanging", lng);
          const setLngProps = (l) => {
            this.language = l;
            this.languages = this.services.languageUtils.toResolveHierarchy(l);
            this.resolvedLanguage = void 0;
            this.setResolvedLanguage(l);
          };
          const done = (err, l) => {
            if (l) {
              setLngProps(l);
              this.translator.changeLanguage(l);
              this.isLanguageChangingTo = void 0;
              this.emit("languageChanged", l);
              this.logger.log("languageChanged", l);
            } else {
              this.isLanguageChangingTo = void 0;
            }
            deferred.resolve(function() {
              return _this2.t(...arguments);
            });
            if (callback) callback(err, function() {
              return _this2.t(...arguments);
            });
          };
          const setLng = (lngs) => {
            if (!lng && !lngs && this.services.languageDetector) lngs = [];
            const l = isString(lngs) ? lngs : this.services.languageUtils.getBestMatchFromCodes(lngs);
            if (l) {
              if (!this.language) {
                setLngProps(l);
              }
              if (!this.translator.language) this.translator.changeLanguage(l);
              this.services.languageDetector?.cacheUserLanguage?.(l);
            }
            this.loadResources(l, (err) => {
              done(err, l);
            });
          };
          if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
            setLng(this.services.languageDetector.detect());
          } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
            if (this.services.languageDetector.detect.length === 0) {
              this.services.languageDetector.detect().then(setLng);
            } else {
              this.services.languageDetector.detect(setLng);
            }
          } else {
            setLng(lng);
          }
          return deferred;
        }
        getFixedT(lng, ns, keyPrefix) {
          var _this3 = this;
          const fixedT = function(key, opts) {
            let options;
            if (typeof opts !== "object") {
              for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
                rest[_key3 - 2] = arguments[_key3];
              }
              options = _this3.options.overloadTranslationOptionHandler([key, opts].concat(rest));
            } else {
              options = {
                ...opts
              };
            }
            options.lng = options.lng || fixedT.lng;
            options.lngs = options.lngs || fixedT.lngs;
            options.ns = options.ns || fixedT.ns;
            if (options.keyPrefix !== "") options.keyPrefix = options.keyPrefix || keyPrefix || fixedT.keyPrefix;
            const keySeparator = _this3.options.keySeparator || ".";
            let resultKey;
            if (options.keyPrefix && Array.isArray(key)) {
              resultKey = key.map((k) => `${options.keyPrefix}${keySeparator}${k}`);
            } else {
              resultKey = options.keyPrefix ? `${options.keyPrefix}${keySeparator}${key}` : key;
            }
            return _this3.t(resultKey, options);
          };
          if (isString(lng)) {
            fixedT.lng = lng;
          } else {
            fixedT.lngs = lng;
          }
          fixedT.ns = ns;
          fixedT.keyPrefix = keyPrefix;
          return fixedT;
        }
        t() {
          for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }
          return this.translator?.translate(...args);
        }
        exists() {
          for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            args[_key5] = arguments[_key5];
          }
          return this.translator?.exists(...args);
        }
        setDefaultNamespace(ns) {
          this.options.defaultNS = ns;
        }
        hasLoadedNamespace(ns) {
          let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          if (!this.isInitialized) {
            this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages);
            return false;
          }
          if (!this.languages || !this.languages.length) {
            this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages);
            return false;
          }
          const lng = options.lng || this.resolvedLanguage || this.languages[0];
          const fallbackLng = this.options ? this.options.fallbackLng : false;
          const lastLng = this.languages[this.languages.length - 1];
          if (lng.toLowerCase() === "cimode") return true;
          const loadNotPending = (l, n) => {
            const loadState = this.services.backendConnector.state[`${l}|${n}`];
            return loadState === -1 || loadState === 0 || loadState === 2;
          };
          if (options.precheck) {
            const preResult = options.precheck(this, loadNotPending);
            if (preResult !== void 0) return preResult;
          }
          if (this.hasResourceBundle(lng, ns)) return true;
          if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
          if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
          return false;
        }
        loadNamespaces(ns, callback) {
          const deferred = defer();
          if (!this.options.ns) {
            if (callback) callback();
            return Promise.resolve();
          }
          if (isString(ns)) ns = [ns];
          ns.forEach((n) => {
            if (this.options.ns.indexOf(n) < 0) this.options.ns.push(n);
          });
          this.loadResources((err) => {
            deferred.resolve();
            if (callback) callback(err);
          });
          return deferred;
        }
        loadLanguages(lngs, callback) {
          const deferred = defer();
          if (isString(lngs)) lngs = [lngs];
          const preloaded = this.options.preload || [];
          const newLngs = lngs.filter((lng) => preloaded.indexOf(lng) < 0 && this.services.languageUtils.isSupportedCode(lng));
          if (!newLngs.length) {
            if (callback) callback();
            return Promise.resolve();
          }
          this.options.preload = preloaded.concat(newLngs);
          this.loadResources((err) => {
            deferred.resolve();
            if (callback) callback(err);
          });
          return deferred;
        }
        dir(lng) {
          if (!lng) lng = this.resolvedLanguage || (this.languages?.length > 0 ? this.languages[0] : this.language);
          if (!lng) return "rtl";
          const rtlLngs = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"];
          const languageUtils = this.services?.languageUtils || new LanguageUtil(get());
          return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
        }
        static createInstance() {
          let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          let callback = arguments.length > 1 ? arguments[1] : void 0;
          return new _I18n(options, callback);
        }
        cloneInstance() {
          let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop;
          const forkResourceStore = options.forkResourceStore;
          if (forkResourceStore) delete options.forkResourceStore;
          const mergedOptions = {
            ...this.options,
            ...options,
            ...{
              isClone: true
            }
          };
          const clone = new _I18n(mergedOptions);
          if (options.debug !== void 0 || options.prefix !== void 0) {
            clone.logger = clone.logger.clone(options);
          }
          const membersToCopy = ["store", "services", "language"];
          membersToCopy.forEach((m) => {
            clone[m] = this[m];
          });
          clone.services = {
            ...this.services
          };
          clone.services.utils = {
            hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
          };
          if (forkResourceStore) {
            const clonedData = Object.keys(this.store.data).reduce((prev, l) => {
              prev[l] = {
                ...this.store.data[l]
              };
              return Object.keys(prev[l]).reduce((acc, n) => {
                acc[n] = {
                  ...prev[l][n]
                };
                return acc;
              }, {});
            }, {});
            clone.store = new ResourceStore(clonedData, mergedOptions);
            clone.services.resourceStore = clone.store;
          }
          clone.translator = new Translator(clone.services, mergedOptions);
          clone.translator.on("*", function(event) {
            for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
              args[_key6 - 1] = arguments[_key6];
            }
            clone.emit(event, ...args);
          });
          clone.init(mergedOptions, callback);
          clone.translator.options = mergedOptions;
          clone.translator.backendConnector.services.utils = {
            hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
          };
          return clone;
        }
        toJSON() {
          return {
            options: this.options,
            store: this.store,
            language: this.language,
            languages: this.languages,
            resolvedLanguage: this.resolvedLanguage
          };
        }
      };
      instance = I18n.createInstance();
      instance.createInstance = I18n.createInstance;
      createInstance = instance.createInstance;
      dir = instance.dir;
      init = instance.init;
      loadResources = instance.loadResources;
      reloadResources = instance.reloadResources;
      use = instance.use;
      changeLanguage = instance.changeLanguage;
      getFixedT = instance.getFixedT;
      t = instance.t;
      exists = instance.exists;
      setDefaultNamespace = instance.setDefaultNamespace;
      hasLoadedNamespace = instance.hasLoadedNamespace;
      loadNamespaces = instance.loadNamespaces;
      loadLanguages = instance.loadLanguages;
    }
  });

  // node_modules/i18next-icu/dist/es/utils.js
  function getLastOfPath2(object, path, Empty) {
    function cleanKey2(key2) {
      return key2 && key2.indexOf("###") > -1 ? key2.replace(/###/g, ".") : key2;
    }
    function canNotTraverseDeeper2() {
      return !object || typeof object === "string";
    }
    var stack = typeof path !== "string" ? [].concat(path) : path.split(".");
    while (stack.length > 1) {
      if (canNotTraverseDeeper2()) return {};
      var key = cleanKey2(stack.shift());
      if (!object[key] && Empty) object[key] = new Empty();
      object = object[key];
    }
    if (canNotTraverseDeeper2()) return {};
    return {
      obj: object,
      k: cleanKey2(stack.shift())
    };
  }
  function setPath2(object, path, newValue) {
    var _getLastOfPath = getLastOfPath2(object, path, Object), obj = _getLastOfPath.obj, k = _getLastOfPath.k;
    obj[k] = newValue;
  }
  function getPath2(object, path) {
    var _getLastOfPath3 = getLastOfPath2(object, path), obj = _getLastOfPath3.obj, k = _getLastOfPath3.k;
    if (!obj) return void 0;
    return obj[k];
  }
  function defaults(obj) {
    each.call(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  }
  var arr, each, slice;
  var init_utils = __esm({
    "node_modules/i18next-icu/dist/es/utils.js"() {
      arr = [];
      each = arr.forEach;
      slice = arr.slice;
    }
  });

  // node_modules/tslib/tslib.es6.js
  function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  function __rest(s, e) {
    var t2 = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t2[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t2[p[i]] = s[p[i]];
      }
    return t2;
  }
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  }
  var extendStatics, __assign;
  var init_tslib_es6 = __esm({
    "node_modules/tslib/tslib.es6.js"() {
      extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      __assign = function() {
        __assign = Object.assign || function __assign2(t2) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t2[p] = s[p];
          }
          return t2;
        };
        return __assign.apply(this, arguments);
      };
    }
  });

  // node_modules/@formatjs/icu-messageformat-parser/lib/error.js
  var ErrorKind;
  var init_error = __esm({
    "node_modules/@formatjs/icu-messageformat-parser/lib/error.js"() {
      (function(ErrorKind2) {
        ErrorKind2[ErrorKind2["EXPECT_ARGUMENT_CLOSING_BRACE"] = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE";
        ErrorKind2[ErrorKind2["EMPTY_ARGUMENT"] = 2] = "EMPTY_ARGUMENT";
        ErrorKind2[ErrorKind2["MALFORMED_ARGUMENT"] = 3] = "MALFORMED_ARGUMENT";
        ErrorKind2[ErrorKind2["EXPECT_ARGUMENT_TYPE"] = 4] = "EXPECT_ARGUMENT_TYPE";
        ErrorKind2[ErrorKind2["INVALID_ARGUMENT_TYPE"] = 5] = "INVALID_ARGUMENT_TYPE";
        ErrorKind2[ErrorKind2["EXPECT_ARGUMENT_STYLE"] = 6] = "EXPECT_ARGUMENT_STYLE";
        ErrorKind2[ErrorKind2["INVALID_NUMBER_SKELETON"] = 7] = "INVALID_NUMBER_SKELETON";
        ErrorKind2[ErrorKind2["INVALID_DATE_TIME_SKELETON"] = 8] = "INVALID_DATE_TIME_SKELETON";
        ErrorKind2[ErrorKind2["EXPECT_NUMBER_SKELETON"] = 9] = "EXPECT_NUMBER_SKELETON";
        ErrorKind2[ErrorKind2["EXPECT_DATE_TIME_SKELETON"] = 10] = "EXPECT_DATE_TIME_SKELETON";
        ErrorKind2[ErrorKind2["UNCLOSED_QUOTE_IN_ARGUMENT_STYLE"] = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE";
        ErrorKind2[ErrorKind2["EXPECT_SELECT_ARGUMENT_OPTIONS"] = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS";
        ErrorKind2[ErrorKind2["EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE"] = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE";
        ErrorKind2[ErrorKind2["INVALID_PLURAL_ARGUMENT_OFFSET_VALUE"] = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE";
        ErrorKind2[ErrorKind2["EXPECT_SELECT_ARGUMENT_SELECTOR"] = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR";
        ErrorKind2[ErrorKind2["EXPECT_PLURAL_ARGUMENT_SELECTOR"] = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR";
        ErrorKind2[ErrorKind2["EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT"] = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT";
        ErrorKind2[ErrorKind2["EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT"] = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT";
        ErrorKind2[ErrorKind2["INVALID_PLURAL_ARGUMENT_SELECTOR"] = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR";
        ErrorKind2[ErrorKind2["DUPLICATE_PLURAL_ARGUMENT_SELECTOR"] = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR";
        ErrorKind2[ErrorKind2["DUPLICATE_SELECT_ARGUMENT_SELECTOR"] = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR";
        ErrorKind2[ErrorKind2["MISSING_OTHER_CLAUSE"] = 22] = "MISSING_OTHER_CLAUSE";
        ErrorKind2[ErrorKind2["INVALID_TAG"] = 23] = "INVALID_TAG";
        ErrorKind2[ErrorKind2["INVALID_TAG_NAME"] = 25] = "INVALID_TAG_NAME";
        ErrorKind2[ErrorKind2["UNMATCHED_CLOSING_TAG"] = 26] = "UNMATCHED_CLOSING_TAG";
        ErrorKind2[ErrorKind2["UNCLOSED_TAG"] = 27] = "UNCLOSED_TAG";
      })(ErrorKind || (ErrorKind = {}));
    }
  });

  // node_modules/@formatjs/icu-messageformat-parser/lib/types.js
  function isLiteralElement(el) {
    return el.type === TYPE.literal;
  }
  function isArgumentElement(el) {
    return el.type === TYPE.argument;
  }
  function isNumberElement(el) {
    return el.type === TYPE.number;
  }
  function isDateElement(el) {
    return el.type === TYPE.date;
  }
  function isTimeElement(el) {
    return el.type === TYPE.time;
  }
  function isSelectElement(el) {
    return el.type === TYPE.select;
  }
  function isPluralElement(el) {
    return el.type === TYPE.plural;
  }
  function isPoundElement(el) {
    return el.type === TYPE.pound;
  }
  function isTagElement(el) {
    return el.type === TYPE.tag;
  }
  function isNumberSkeleton(el) {
    return !!(el && typeof el === "object" && el.type === SKELETON_TYPE.number);
  }
  function isDateTimeSkeleton(el) {
    return !!(el && typeof el === "object" && el.type === SKELETON_TYPE.dateTime);
  }
  var TYPE, SKELETON_TYPE;
  var init_types = __esm({
    "node_modules/@formatjs/icu-messageformat-parser/lib/types.js"() {
      (function(TYPE2) {
        TYPE2[TYPE2["literal"] = 0] = "literal";
        TYPE2[TYPE2["argument"] = 1] = "argument";
        TYPE2[TYPE2["number"] = 2] = "number";
        TYPE2[TYPE2["date"] = 3] = "date";
        TYPE2[TYPE2["time"] = 4] = "time";
        TYPE2[TYPE2["select"] = 5] = "select";
        TYPE2[TYPE2["plural"] = 6] = "plural";
        TYPE2[TYPE2["pound"] = 7] = "pound";
        TYPE2[TYPE2["tag"] = 8] = "tag";
      })(TYPE || (TYPE = {}));
      (function(SKELETON_TYPE2) {
        SKELETON_TYPE2[SKELETON_TYPE2["number"] = 0] = "number";
        SKELETON_TYPE2[SKELETON_TYPE2["dateTime"] = 1] = "dateTime";
      })(SKELETON_TYPE || (SKELETON_TYPE = {}));
    }
  });

  // node_modules/@formatjs/icu-messageformat-parser/lib/regex.generated.js
  var SPACE_SEPARATOR_REGEX;
  var init_regex_generated = __esm({
    "node_modules/@formatjs/icu-messageformat-parser/lib/regex.generated.js"() {
      SPACE_SEPARATOR_REGEX = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;
    }
  });

  // node_modules/@formatjs/icu-skeleton-parser/lib/date-time.js
  function parseDateTimeSkeleton(skeleton) {
    var result = {};
    skeleton.replace(DATE_TIME_REGEX, function(match) {
      var len = match.length;
      switch (match[0]) {
        // Era
        case "G":
          result.era = len === 4 ? "long" : len === 5 ? "narrow" : "short";
          break;
        // Year
        case "y":
          result.year = len === 2 ? "2-digit" : "numeric";
          break;
        case "Y":
        case "u":
        case "U":
        case "r":
          throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");
        // Quarter
        case "q":
        case "Q":
          throw new RangeError("`q/Q` (quarter) patterns are not supported");
        // Month
        case "M":
        case "L":
          result.month = ["numeric", "2-digit", "short", "long", "narrow"][len - 1];
          break;
        // Week
        case "w":
        case "W":
          throw new RangeError("`w/W` (week) patterns are not supported");
        case "d":
          result.day = ["numeric", "2-digit"][len - 1];
          break;
        case "D":
        case "F":
        case "g":
          throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");
        // Weekday
        case "E":
          result.weekday = len === 4 ? "short" : len === 5 ? "narrow" : "short";
          break;
        case "e":
          if (len < 4) {
            throw new RangeError("`e..eee` (weekday) patterns are not supported");
          }
          result.weekday = ["short", "long", "narrow", "short"][len - 4];
          break;
        case "c":
          if (len < 4) {
            throw new RangeError("`c..ccc` (weekday) patterns are not supported");
          }
          result.weekday = ["short", "long", "narrow", "short"][len - 4];
          break;
        // Period
        case "a":
          result.hour12 = true;
          break;
        case "b":
        // am, pm, noon, midnight
        case "B":
          throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");
        // Hour
        case "h":
          result.hourCycle = "h12";
          result.hour = ["numeric", "2-digit"][len - 1];
          break;
        case "H":
          result.hourCycle = "h23";
          result.hour = ["numeric", "2-digit"][len - 1];
          break;
        case "K":
          result.hourCycle = "h11";
          result.hour = ["numeric", "2-digit"][len - 1];
          break;
        case "k":
          result.hourCycle = "h24";
          result.hour = ["numeric", "2-digit"][len - 1];
          break;
        case "j":
        case "J":
        case "C":
          throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");
        // Minute
        case "m":
          result.minute = ["numeric", "2-digit"][len - 1];
          break;
        // Second
        case "s":
          result.second = ["numeric", "2-digit"][len - 1];
          break;
        case "S":
        case "A":
          throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");
        // Zone
        case "z":
          result.timeZoneName = len < 4 ? "short" : "long";
          break;
        case "Z":
        // 1..3, 4, 5: The ISO8601 varios formats
        case "O":
        // 1, 4: miliseconds in day short, long
        case "v":
        // 1, 4: generic non-location format
        case "V":
        // 1, 2, 3, 4: time zone ID or city
        case "X":
        // 1, 2, 3, 4: The ISO8601 varios formats
        case "x":
          throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead");
      }
      return "";
    });
    return result;
  }
  var DATE_TIME_REGEX;
  var init_date_time = __esm({
    "node_modules/@formatjs/icu-skeleton-parser/lib/date-time.js"() {
      DATE_TIME_REGEX = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
    }
  });

  // node_modules/@formatjs/icu-skeleton-parser/lib/regex.generated.js
  var WHITE_SPACE_REGEX;
  var init_regex_generated2 = __esm({
    "node_modules/@formatjs/icu-skeleton-parser/lib/regex.generated.js"() {
      WHITE_SPACE_REGEX = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
    }
  });

  // node_modules/@formatjs/icu-skeleton-parser/lib/number.js
  function parseNumberSkeletonFromString(skeleton) {
    if (skeleton.length === 0) {
      throw new Error("Number skeleton cannot be empty");
    }
    var stringTokens = skeleton.split(WHITE_SPACE_REGEX).filter(function(x) {
      return x.length > 0;
    });
    var tokens = [];
    for (var _i = 0, stringTokens_1 = stringTokens; _i < stringTokens_1.length; _i++) {
      var stringToken = stringTokens_1[_i];
      var stemAndOptions = stringToken.split("/");
      if (stemAndOptions.length === 0) {
        throw new Error("Invalid number skeleton");
      }
      var stem = stemAndOptions[0], options = stemAndOptions.slice(1);
      for (var _a2 = 0, options_1 = options; _a2 < options_1.length; _a2++) {
        var option = options_1[_a2];
        if (option.length === 0) {
          throw new Error("Invalid number skeleton");
        }
      }
      tokens.push({ stem, options });
    }
    return tokens;
  }
  function icuUnitToEcma(unit) {
    return unit.replace(/^(.*?)-/, "");
  }
  function parseSignificantPrecision(str) {
    var result = {};
    if (str[str.length - 1] === "r") {
      result.roundingPriority = "morePrecision";
    } else if (str[str.length - 1] === "s") {
      result.roundingPriority = "lessPrecision";
    }
    str.replace(SIGNIFICANT_PRECISION_REGEX, function(_, g1, g2) {
      if (typeof g2 !== "string") {
        result.minimumSignificantDigits = g1.length;
        result.maximumSignificantDigits = g1.length;
      } else if (g2 === "+") {
        result.minimumSignificantDigits = g1.length;
      } else if (g1[0] === "#") {
        result.maximumSignificantDigits = g1.length;
      } else {
        result.minimumSignificantDigits = g1.length;
        result.maximumSignificantDigits = g1.length + (typeof g2 === "string" ? g2.length : 0);
      }
      return "";
    });
    return result;
  }
  function parseSign(str) {
    switch (str) {
      case "sign-auto":
        return {
          signDisplay: "auto"
        };
      case "sign-accounting":
      case "()":
        return {
          currencySign: "accounting"
        };
      case "sign-always":
      case "+!":
        return {
          signDisplay: "always"
        };
      case "sign-accounting-always":
      case "()!":
        return {
          signDisplay: "always",
          currencySign: "accounting"
        };
      case "sign-except-zero":
      case "+?":
        return {
          signDisplay: "exceptZero"
        };
      case "sign-accounting-except-zero":
      case "()?":
        return {
          signDisplay: "exceptZero",
          currencySign: "accounting"
        };
      case "sign-never":
      case "+_":
        return {
          signDisplay: "never"
        };
    }
  }
  function parseConciseScientificAndEngineeringStem(stem) {
    var result;
    if (stem[0] === "E" && stem[1] === "E") {
      result = {
        notation: "engineering"
      };
      stem = stem.slice(2);
    } else if (stem[0] === "E") {
      result = {
        notation: "scientific"
      };
      stem = stem.slice(1);
    }
    if (result) {
      var signDisplay = stem.slice(0, 2);
      if (signDisplay === "+!") {
        result.signDisplay = "always";
        stem = stem.slice(2);
      } else if (signDisplay === "+?") {
        result.signDisplay = "exceptZero";
        stem = stem.slice(2);
      }
      if (!CONCISE_INTEGER_WIDTH_REGEX.test(stem)) {
        throw new Error("Malformed concise eng/scientific notation");
      }
      result.minimumIntegerDigits = stem.length;
    }
    return result;
  }
  function parseNotationOptions(opt) {
    var result = {};
    var signOpts = parseSign(opt);
    if (signOpts) {
      return signOpts;
    }
    return result;
  }
  function parseNumberSkeleton(tokens) {
    var result = {};
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
      var token = tokens_1[_i];
      switch (token.stem) {
        case "percent":
        case "%":
          result.style = "percent";
          continue;
        case "%x100":
          result.style = "percent";
          result.scale = 100;
          continue;
        case "currency":
          result.style = "currency";
          result.currency = token.options[0];
          continue;
        case "group-off":
        case ",_":
          result.useGrouping = false;
          continue;
        case "precision-integer":
        case ".":
          result.maximumFractionDigits = 0;
          continue;
        case "measure-unit":
        case "unit":
          result.style = "unit";
          result.unit = icuUnitToEcma(token.options[0]);
          continue;
        case "compact-short":
        case "K":
          result.notation = "compact";
          result.compactDisplay = "short";
          continue;
        case "compact-long":
        case "KK":
          result.notation = "compact";
          result.compactDisplay = "long";
          continue;
        case "scientific":
          result = __assign(__assign(__assign({}, result), { notation: "scientific" }), token.options.reduce(function(all, opt2) {
            return __assign(__assign({}, all), parseNotationOptions(opt2));
          }, {}));
          continue;
        case "engineering":
          result = __assign(__assign(__assign({}, result), { notation: "engineering" }), token.options.reduce(function(all, opt2) {
            return __assign(__assign({}, all), parseNotationOptions(opt2));
          }, {}));
          continue;
        case "notation-simple":
          result.notation = "standard";
          continue;
        // https://github.com/unicode-org/icu/blob/master/icu4c/source/i18n/unicode/unumberformatter.h
        case "unit-width-narrow":
          result.currencyDisplay = "narrowSymbol";
          result.unitDisplay = "narrow";
          continue;
        case "unit-width-short":
          result.currencyDisplay = "code";
          result.unitDisplay = "short";
          continue;
        case "unit-width-full-name":
          result.currencyDisplay = "name";
          result.unitDisplay = "long";
          continue;
        case "unit-width-iso-code":
          result.currencyDisplay = "symbol";
          continue;
        case "scale":
          result.scale = parseFloat(token.options[0]);
          continue;
        // https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#integer-width
        case "integer-width":
          if (token.options.length > 1) {
            throw new RangeError("integer-width stems only accept a single optional option");
          }
          token.options[0].replace(INTEGER_WIDTH_REGEX, function(_, g1, g2, g3, g4, g5) {
            if (g1) {
              result.minimumIntegerDigits = g2.length;
            } else if (g3 && g4) {
              throw new Error("We currently do not support maximum integer digits");
            } else if (g5) {
              throw new Error("We currently do not support exact integer digits");
            }
            return "";
          });
          continue;
      }
      if (CONCISE_INTEGER_WIDTH_REGEX.test(token.stem)) {
        result.minimumIntegerDigits = token.stem.length;
        continue;
      }
      if (FRACTION_PRECISION_REGEX.test(token.stem)) {
        if (token.options.length > 1) {
          throw new RangeError("Fraction-precision stems only accept a single optional option");
        }
        token.stem.replace(FRACTION_PRECISION_REGEX, function(_, g1, g2, g3, g4, g5) {
          if (g2 === "*") {
            result.minimumFractionDigits = g1.length;
          } else if (g3 && g3[0] === "#") {
            result.maximumFractionDigits = g3.length;
          } else if (g4 && g5) {
            result.minimumFractionDigits = g4.length;
            result.maximumFractionDigits = g4.length + g5.length;
          } else {
            result.minimumFractionDigits = g1.length;
            result.maximumFractionDigits = g1.length;
          }
          return "";
        });
        var opt = token.options[0];
        if (opt === "w") {
          result = __assign(__assign({}, result), { trailingZeroDisplay: "stripIfInteger" });
        } else if (opt) {
          result = __assign(__assign({}, result), parseSignificantPrecision(opt));
        }
        continue;
      }
      if (SIGNIFICANT_PRECISION_REGEX.test(token.stem)) {
        result = __assign(__assign({}, result), parseSignificantPrecision(token.stem));
        continue;
      }
      var signOpts = parseSign(token.stem);
      if (signOpts) {
        result = __assign(__assign({}, result), signOpts);
      }
      var conciseScientificAndEngineeringOpts = parseConciseScientificAndEngineeringStem(token.stem);
      if (conciseScientificAndEngineeringOpts) {
        result = __assign(__assign({}, result), conciseScientificAndEngineeringOpts);
      }
    }
    return result;
  }
  var FRACTION_PRECISION_REGEX, SIGNIFICANT_PRECISION_REGEX, INTEGER_WIDTH_REGEX, CONCISE_INTEGER_WIDTH_REGEX;
  var init_number = __esm({
    "node_modules/@formatjs/icu-skeleton-parser/lib/number.js"() {
      init_tslib_es6();
      init_regex_generated2();
      FRACTION_PRECISION_REGEX = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g;
      SIGNIFICANT_PRECISION_REGEX = /^(@+)?(\+|#+)?[rs]?$/g;
      INTEGER_WIDTH_REGEX = /(\*)(0+)|(#+)(0+)|(0+)/g;
      CONCISE_INTEGER_WIDTH_REGEX = /^(0+)$/;
    }
  });

  // node_modules/@formatjs/icu-skeleton-parser/lib/index.js
  var init_lib = __esm({
    "node_modules/@formatjs/icu-skeleton-parser/lib/index.js"() {
      init_date_time();
      init_number();
    }
  });

  // node_modules/@formatjs/icu-messageformat-parser/lib/time-data.generated.js
  var timeData;
  var init_time_data_generated = __esm({
    "node_modules/@formatjs/icu-messageformat-parser/lib/time-data.generated.js"() {
      timeData = {
        "AX": [
          "H"
        ],
        "BQ": [
          "H"
        ],
        "CP": [
          "H"
        ],
        "CZ": [
          "H"
        ],
        "DK": [
          "H"
        ],
        "FI": [
          "H"
        ],
        "ID": [
          "H"
        ],
        "IS": [
          "H"
        ],
        "ML": [
          "H"
        ],
        "NE": [
          "H"
        ],
        "RU": [
          "H"
        ],
        "SE": [
          "H"
        ],
        "SJ": [
          "H"
        ],
        "SK": [
          "H"
        ],
        "AS": [
          "h",
          "H"
        ],
        "BT": [
          "h",
          "H"
        ],
        "DJ": [
          "h",
          "H"
        ],
        "ER": [
          "h",
          "H"
        ],
        "GH": [
          "h",
          "H"
        ],
        "IN": [
          "h",
          "H"
        ],
        "LS": [
          "h",
          "H"
        ],
        "PG": [
          "h",
          "H"
        ],
        "PW": [
          "h",
          "H"
        ],
        "SO": [
          "h",
          "H"
        ],
        "TO": [
          "h",
          "H"
        ],
        "VU": [
          "h",
          "H"
        ],
        "WS": [
          "h",
          "H"
        ],
        "001": [
          "H",
          "h"
        ],
        "AL": [
          "h",
          "H",
          "hB"
        ],
        "TD": [
          "h",
          "H",
          "hB"
        ],
        "ca-ES": [
          "H",
          "h",
          "hB"
        ],
        "CF": [
          "H",
          "h",
          "hB"
        ],
        "CM": [
          "H",
          "h",
          "hB"
        ],
        "fr-CA": [
          "H",
          "h",
          "hB"
        ],
        "gl-ES": [
          "H",
          "h",
          "hB"
        ],
        "it-CH": [
          "H",
          "h",
          "hB"
        ],
        "it-IT": [
          "H",
          "h",
          "hB"
        ],
        "LU": [
          "H",
          "h",
          "hB"
        ],
        "NP": [
          "H",
          "h",
          "hB"
        ],
        "PF": [
          "H",
          "h",
          "hB"
        ],
        "SC": [
          "H",
          "h",
          "hB"
        ],
        "SM": [
          "H",
          "h",
          "hB"
        ],
        "SN": [
          "H",
          "h",
          "hB"
        ],
        "TF": [
          "H",
          "h",
          "hB"
        ],
        "VA": [
          "H",
          "h",
          "hB"
        ],
        "CY": [
          "h",
          "H",
          "hb",
          "hB"
        ],
        "GR": [
          "h",
          "H",
          "hb",
          "hB"
        ],
        "CO": [
          "h",
          "H",
          "hB",
          "hb"
        ],
        "DO": [
          "h",
          "H",
          "hB",
          "hb"
        ],
        "KP": [
          "h",
          "H",
          "hB",
          "hb"
        ],
        "KR": [
          "h",
          "H",
          "hB",
          "hb"
        ],
        "NA": [
          "h",
          "H",
          "hB",
          "hb"
        ],
        "PA": [
          "h",
          "H",
          "hB",
          "hb"
        ],
        "PR": [
          "h",
          "H",
          "hB",
          "hb"
        ],
        "VE": [
          "h",
          "H",
          "hB",
          "hb"
        ],
        "AC": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "AI": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "BW": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "BZ": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "CC": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "CK": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "CX": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "DG": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "FK": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "GB": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "GG": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "GI": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "IE": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "IM": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "IO": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "JE": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "LT": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "MK": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "MN": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "MS": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "NF": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "NG": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "NR": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "NU": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "PN": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "SH": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "SX": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "TA": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "ZA": [
          "H",
          "h",
          "hb",
          "hB"
        ],
        "af-ZA": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "AR": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "CL": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "CR": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "CU": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "EA": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "es-BO": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "es-BR": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "es-EC": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "es-ES": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "es-GQ": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "es-PE": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "GT": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "HN": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "IC": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "KG": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "KM": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "LK": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "MA": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "MX": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "NI": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "PY": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "SV": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "UY": [
          "H",
          "h",
          "hB",
          "hb"
        ],
        "JP": [
          "H",
          "h",
          "K"
        ],
        "AD": [
          "H",
          "hB"
        ],
        "AM": [
          "H",
          "hB"
        ],
        "AO": [
          "H",
          "hB"
        ],
        "AT": [
          "H",
          "hB"
        ],
        "AW": [
          "H",
          "hB"
        ],
        "BE": [
          "H",
          "hB"
        ],
        "BF": [
          "H",
          "hB"
        ],
        "BJ": [
          "H",
          "hB"
        ],
        "BL": [
          "H",
          "hB"
        ],
        "BR": [
          "H",
          "hB"
        ],
        "CG": [
          "H",
          "hB"
        ],
        "CI": [
          "H",
          "hB"
        ],
        "CV": [
          "H",
          "hB"
        ],
        "DE": [
          "H",
          "hB"
        ],
        "EE": [
          "H",
          "hB"
        ],
        "FR": [
          "H",
          "hB"
        ],
        "GA": [
          "H",
          "hB"
        ],
        "GF": [
          "H",
          "hB"
        ],
        "GN": [
          "H",
          "hB"
        ],
        "GP": [
          "H",
          "hB"
        ],
        "GW": [
          "H",
          "hB"
        ],
        "HR": [
          "H",
          "hB"
        ],
        "IL": [
          "H",
          "hB"
        ],
        "IT": [
          "H",
          "hB"
        ],
        "KZ": [
          "H",
          "hB"
        ],
        "MC": [
          "H",
          "hB"
        ],
        "MD": [
          "H",
          "hB"
        ],
        "MF": [
          "H",
          "hB"
        ],
        "MQ": [
          "H",
          "hB"
        ],
        "MZ": [
          "H",
          "hB"
        ],
        "NC": [
          "H",
          "hB"
        ],
        "NL": [
          "H",
          "hB"
        ],
        "PM": [
          "H",
          "hB"
        ],
        "PT": [
          "H",
          "hB"
        ],
        "RE": [
          "H",
          "hB"
        ],
        "RO": [
          "H",
          "hB"
        ],
        "SI": [
          "H",
          "hB"
        ],
        "SR": [
          "H",
          "hB"
        ],
        "ST": [
          "H",
          "hB"
        ],
        "TG": [
          "H",
          "hB"
        ],
        "TR": [
          "H",
          "hB"
        ],
        "WF": [
          "H",
          "hB"
        ],
        "YT": [
          "H",
          "hB"
        ],
        "BD": [
          "h",
          "hB",
          "H"
        ],
        "PK": [
          "h",
          "hB",
          "H"
        ],
        "AZ": [
          "H",
          "hB",
          "h"
        ],
        "BA": [
          "H",
          "hB",
          "h"
        ],
        "BG": [
          "H",
          "hB",
          "h"
        ],
        "CH": [
          "H",
          "hB",
          "h"
        ],
        "GE": [
          "H",
          "hB",
          "h"
        ],
        "LI": [
          "H",
          "hB",
          "h"
        ],
        "ME": [
          "H",
          "hB",
          "h"
        ],
        "RS": [
          "H",
          "hB",
          "h"
        ],
        "UA": [
          "H",
          "hB",
          "h"
        ],
        "UZ": [
          "H",
          "hB",
          "h"
        ],
        "XK": [
          "H",
          "hB",
          "h"
        ],
        "AG": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "AU": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "BB": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "BM": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "BS": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "CA": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "DM": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "en-001": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "FJ": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "FM": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "GD": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "GM": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "GU": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "GY": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "JM": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "KI": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "KN": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "KY": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "LC": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "LR": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "MH": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "MP": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "MW": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "NZ": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "SB": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "SG": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "SL": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "SS": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "SZ": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "TC": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "TT": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "UM": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "US": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "VC": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "VG": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "VI": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "ZM": [
          "h",
          "hb",
          "H",
          "hB"
        ],
        "BO": [
          "H",
          "hB",
          "h",
          "hb"
        ],
        "EC": [
          "H",
          "hB",
          "h",
          "hb"
        ],
        "ES": [
          "H",
          "hB",
          "h",
          "hb"
        ],
        "GQ": [
          "H",
          "hB",
          "h",
          "hb"
        ],
        "PE": [
          "H",
          "hB",
          "h",
          "hb"
        ],
        "AE": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "ar-001": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "BH": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "DZ": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "EG": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "EH": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "HK": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "IQ": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "JO": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "KW": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "LB": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "LY": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "MO": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "MR": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "OM": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "PH": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "PS": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "QA": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "SA": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "SD": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "SY": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "TN": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "YE": [
          "h",
          "hB",
          "hb",
          "H"
        ],
        "AF": [
          "H",
          "hb",
          "hB",
          "h"
        ],
        "LA": [
          "H",
          "hb",
          "hB",
          "h"
        ],
        "CN": [
          "H",
          "hB",
          "hb",
          "h"
        ],
        "LV": [
          "H",
          "hB",
          "hb",
          "h"
        ],
        "TL": [
          "H",
          "hB",
          "hb",
          "h"
        ],
        "zu-ZA": [
          "H",
          "hB",
          "hb",
          "h"
        ],
        "CD": [
          "hB",
          "H"
        ],
        "IR": [
          "hB",
          "H"
        ],
        "hi-IN": [
          "hB",
          "h",
          "H"
        ],
        "kn-IN": [
          "hB",
          "h",
          "H"
        ],
        "ml-IN": [
          "hB",
          "h",
          "H"
        ],
        "te-IN": [
          "hB",
          "h",
          "H"
        ],
        "KH": [
          "hB",
          "h",
          "H",
          "hb"
        ],
        "ta-IN": [
          "hB",
          "h",
          "hb",
          "H"
        ],
        "BN": [
          "hb",
          "hB",
          "h",
          "H"
        ],
        "MY": [
          "hb",
          "hB",
          "h",
          "H"
        ],
        "ET": [
          "hB",
          "hb",
          "h",
          "H"
        ],
        "gu-IN": [
          "hB",
          "hb",
          "h",
          "H"
        ],
        "mr-IN": [
          "hB",
          "hb",
          "h",
          "H"
        ],
        "pa-IN": [
          "hB",
          "hb",
          "h",
          "H"
        ],
        "TW": [
          "hB",
          "hb",
          "h",
          "H"
        ],
        "KE": [
          "hB",
          "hb",
          "H",
          "h"
        ],
        "MM": [
          "hB",
          "hb",
          "H",
          "h"
        ],
        "TZ": [
          "hB",
          "hb",
          "H",
          "h"
        ],
        "UG": [
          "hB",
          "hb",
          "H",
          "h"
        ]
      };
    }
  });

  // node_modules/@formatjs/icu-messageformat-parser/lib/date-time-pattern-generator.js
  function getBestPattern(skeleton, locale) {
    var skeletonCopy = "";
    for (var patternPos = 0; patternPos < skeleton.length; patternPos++) {
      var patternChar = skeleton.charAt(patternPos);
      if (patternChar === "j") {
        var extraLength = 0;
        while (patternPos + 1 < skeleton.length && skeleton.charAt(patternPos + 1) === patternChar) {
          extraLength++;
          patternPos++;
        }
        var hourLen = 1 + (extraLength & 1);
        var dayPeriodLen = extraLength < 2 ? 1 : 3 + (extraLength >> 1);
        var dayPeriodChar = "a";
        var hourChar = getDefaultHourSymbolFromLocale(locale);
        if (hourChar == "H" || hourChar == "k") {
          dayPeriodLen = 0;
        }
        while (dayPeriodLen-- > 0) {
          skeletonCopy += dayPeriodChar;
        }
        while (hourLen-- > 0) {
          skeletonCopy = hourChar + skeletonCopy;
        }
      } else if (patternChar === "J") {
        skeletonCopy += "H";
      } else {
        skeletonCopy += patternChar;
      }
    }
    return skeletonCopy;
  }
  function getDefaultHourSymbolFromLocale(locale) {
    var hourCycle = locale.hourCycle;
    if (hourCycle === void 0 && // @ts-ignore hourCycle(s) is not identified yet
    locale.hourCycles && // @ts-ignore
    locale.hourCycles.length) {
      hourCycle = locale.hourCycles[0];
    }
    if (hourCycle) {
      switch (hourCycle) {
        case "h24":
          return "k";
        case "h23":
          return "H";
        case "h12":
          return "h";
        case "h11":
          return "K";
        default:
          throw new Error("Invalid hourCycle");
      }
    }
    var languageTag = locale.language;
    var regionTag;
    if (languageTag !== "root") {
      regionTag = locale.maximize().region;
    }
    var hourCycles = timeData[regionTag || ""] || timeData[languageTag || ""] || timeData["".concat(languageTag, "-001")] || timeData["001"];
    return hourCycles[0];
  }
  var init_date_time_pattern_generator = __esm({
    "node_modules/@formatjs/icu-messageformat-parser/lib/date-time-pattern-generator.js"() {
      init_time_data_generated();
    }
  });

  // node_modules/@formatjs/icu-messageformat-parser/lib/parser.js
  function createLocation(start, end) {
    return { start, end };
  }
  function RE(s, flag) {
    return new RegExp(s, flag);
  }
  function _isAlpha(codepoint) {
    return codepoint >= 97 && codepoint <= 122 || codepoint >= 65 && codepoint <= 90;
  }
  function _isAlphaOrSlash(codepoint) {
    return _isAlpha(codepoint) || codepoint === 47;
  }
  function _isPotentialElementNameChar(c) {
    return c === 45 || c === 46 || c >= 48 && c <= 57 || c === 95 || c >= 97 && c <= 122 || c >= 65 && c <= 90 || c == 183 || c >= 192 && c <= 214 || c >= 216 && c <= 246 || c >= 248 && c <= 893 || c >= 895 && c <= 8191 || c >= 8204 && c <= 8205 || c >= 8255 && c <= 8256 || c >= 8304 && c <= 8591 || c >= 11264 && c <= 12271 || c >= 12289 && c <= 55295 || c >= 63744 && c <= 64975 || c >= 65008 && c <= 65533 || c >= 65536 && c <= 983039;
  }
  function _isWhiteSpace(c) {
    return c >= 9 && c <= 13 || c === 32 || c === 133 || c >= 8206 && c <= 8207 || c === 8232 || c === 8233;
  }
  function _isPatternSyntax(c) {
    return c >= 33 && c <= 35 || c === 36 || c >= 37 && c <= 39 || c === 40 || c === 41 || c === 42 || c === 43 || c === 44 || c === 45 || c >= 46 && c <= 47 || c >= 58 && c <= 59 || c >= 60 && c <= 62 || c >= 63 && c <= 64 || c === 91 || c === 92 || c === 93 || c === 94 || c === 96 || c === 123 || c === 124 || c === 125 || c === 126 || c === 161 || c >= 162 && c <= 165 || c === 166 || c === 167 || c === 169 || c === 171 || c === 172 || c === 174 || c === 176 || c === 177 || c === 182 || c === 187 || c === 191 || c === 215 || c === 247 || c >= 8208 && c <= 8213 || c >= 8214 && c <= 8215 || c === 8216 || c === 8217 || c === 8218 || c >= 8219 && c <= 8220 || c === 8221 || c === 8222 || c === 8223 || c >= 8224 && c <= 8231 || c >= 8240 && c <= 8248 || c === 8249 || c === 8250 || c >= 8251 && c <= 8254 || c >= 8257 && c <= 8259 || c === 8260 || c === 8261 || c === 8262 || c >= 8263 && c <= 8273 || c === 8274 || c === 8275 || c >= 8277 && c <= 8286 || c >= 8592 && c <= 8596 || c >= 8597 && c <= 8601 || c >= 8602 && c <= 8603 || c >= 8604 && c <= 8607 || c === 8608 || c >= 8609 && c <= 8610 || c === 8611 || c >= 8612 && c <= 8613 || c === 8614 || c >= 8615 && c <= 8621 || c === 8622 || c >= 8623 && c <= 8653 || c >= 8654 && c <= 8655 || c >= 8656 && c <= 8657 || c === 8658 || c === 8659 || c === 8660 || c >= 8661 && c <= 8691 || c >= 8692 && c <= 8959 || c >= 8960 && c <= 8967 || c === 8968 || c === 8969 || c === 8970 || c === 8971 || c >= 8972 && c <= 8991 || c >= 8992 && c <= 8993 || c >= 8994 && c <= 9e3 || c === 9001 || c === 9002 || c >= 9003 && c <= 9083 || c === 9084 || c >= 9085 && c <= 9114 || c >= 9115 && c <= 9139 || c >= 9140 && c <= 9179 || c >= 9180 && c <= 9185 || c >= 9186 && c <= 9254 || c >= 9255 && c <= 9279 || c >= 9280 && c <= 9290 || c >= 9291 && c <= 9311 || c >= 9472 && c <= 9654 || c === 9655 || c >= 9656 && c <= 9664 || c === 9665 || c >= 9666 && c <= 9719 || c >= 9720 && c <= 9727 || c >= 9728 && c <= 9838 || c === 9839 || c >= 9840 && c <= 10087 || c === 10088 || c === 10089 || c === 10090 || c === 10091 || c === 10092 || c === 10093 || c === 10094 || c === 10095 || c === 10096 || c === 10097 || c === 10098 || c === 10099 || c === 10100 || c === 10101 || c >= 10132 && c <= 10175 || c >= 10176 && c <= 10180 || c === 10181 || c === 10182 || c >= 10183 && c <= 10213 || c === 10214 || c === 10215 || c === 10216 || c === 10217 || c === 10218 || c === 10219 || c === 10220 || c === 10221 || c === 10222 || c === 10223 || c >= 10224 && c <= 10239 || c >= 10240 && c <= 10495 || c >= 10496 && c <= 10626 || c === 10627 || c === 10628 || c === 10629 || c === 10630 || c === 10631 || c === 10632 || c === 10633 || c === 10634 || c === 10635 || c === 10636 || c === 10637 || c === 10638 || c === 10639 || c === 10640 || c === 10641 || c === 10642 || c === 10643 || c === 10644 || c === 10645 || c === 10646 || c === 10647 || c === 10648 || c >= 10649 && c <= 10711 || c === 10712 || c === 10713 || c === 10714 || c === 10715 || c >= 10716 && c <= 10747 || c === 10748 || c === 10749 || c >= 10750 && c <= 11007 || c >= 11008 && c <= 11055 || c >= 11056 && c <= 11076 || c >= 11077 && c <= 11078 || c >= 11079 && c <= 11084 || c >= 11085 && c <= 11123 || c >= 11124 && c <= 11125 || c >= 11126 && c <= 11157 || c === 11158 || c >= 11159 && c <= 11263 || c >= 11776 && c <= 11777 || c === 11778 || c === 11779 || c === 11780 || c === 11781 || c >= 11782 && c <= 11784 || c === 11785 || c === 11786 || c === 11787 || c === 11788 || c === 11789 || c >= 11790 && c <= 11798 || c === 11799 || c >= 11800 && c <= 11801 || c === 11802 || c === 11803 || c === 11804 || c === 11805 || c >= 11806 && c <= 11807 || c === 11808 || c === 11809 || c === 11810 || c === 11811 || c === 11812 || c === 11813 || c === 11814 || c === 11815 || c === 11816 || c === 11817 || c >= 11818 && c <= 11822 || c === 11823 || c >= 11824 && c <= 11833 || c >= 11834 && c <= 11835 || c >= 11836 && c <= 11839 || c === 11840 || c === 11841 || c === 11842 || c >= 11843 && c <= 11855 || c >= 11856 && c <= 11857 || c === 11858 || c >= 11859 && c <= 11903 || c >= 12289 && c <= 12291 || c === 12296 || c === 12297 || c === 12298 || c === 12299 || c === 12300 || c === 12301 || c === 12302 || c === 12303 || c === 12304 || c === 12305 || c >= 12306 && c <= 12307 || c === 12308 || c === 12309 || c === 12310 || c === 12311 || c === 12312 || c === 12313 || c === 12314 || c === 12315 || c === 12316 || c === 12317 || c >= 12318 && c <= 12319 || c === 12320 || c === 12336 || c === 64830 || c === 64831 || c >= 65093 && c <= 65094;
  }
  var _a, SPACE_SEPARATOR_START_REGEX, SPACE_SEPARATOR_END_REGEX, hasNativeStartsWith, hasNativeFromCodePoint, hasNativeFromEntries, hasNativeCodePointAt, hasTrimStart, hasTrimEnd, hasNativeIsSafeInteger, isSafeInteger, REGEX_SUPPORTS_U_AND_Y, re, startsWith, fromCodePoint, fromEntries, codePointAt, trimStart, trimEnd, matchIdentifierAtIndex, IDENTIFIER_PREFIX_RE_1, Parser;
  var init_parser = __esm({
    "node_modules/@formatjs/icu-messageformat-parser/lib/parser.js"() {
      init_tslib_es6();
      init_error();
      init_types();
      init_regex_generated();
      init_lib();
      init_date_time_pattern_generator();
      SPACE_SEPARATOR_START_REGEX = new RegExp("^".concat(SPACE_SEPARATOR_REGEX.source, "*"));
      SPACE_SEPARATOR_END_REGEX = new RegExp("".concat(SPACE_SEPARATOR_REGEX.source, "*$"));
      hasNativeStartsWith = !!String.prototype.startsWith;
      hasNativeFromCodePoint = !!String.fromCodePoint;
      hasNativeFromEntries = !!Object.fromEntries;
      hasNativeCodePointAt = !!String.prototype.codePointAt;
      hasTrimStart = !!String.prototype.trimStart;
      hasTrimEnd = !!String.prototype.trimEnd;
      hasNativeIsSafeInteger = !!Number.isSafeInteger;
      isSafeInteger = hasNativeIsSafeInteger ? Number.isSafeInteger : function(n) {
        return typeof n === "number" && isFinite(n) && Math.floor(n) === n && Math.abs(n) <= 9007199254740991;
      };
      REGEX_SUPPORTS_U_AND_Y = true;
      try {
        re = RE("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
        REGEX_SUPPORTS_U_AND_Y = ((_a = re.exec("a")) === null || _a === void 0 ? void 0 : _a[0]) === "a";
      } catch (_) {
        REGEX_SUPPORTS_U_AND_Y = false;
      }
      startsWith = hasNativeStartsWith ? (
        // Native
        function startsWith2(s, search, position) {
          return s.startsWith(search, position);
        }
      ) : (
        // For IE11
        function startsWith3(s, search, position) {
          return s.slice(position, position + search.length) === search;
        }
      );
      fromCodePoint = hasNativeFromCodePoint ? String.fromCodePoint : (
        // IE11
        function fromCodePoint2() {
          var codePoints = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            codePoints[_i] = arguments[_i];
          }
          var elements = "";
          var length = codePoints.length;
          var i = 0;
          var code;
          while (length > i) {
            code = codePoints[i++];
            if (code > 1114111)
              throw RangeError(code + " is not a valid code point");
            elements += code < 65536 ? String.fromCharCode(code) : String.fromCharCode(((code -= 65536) >> 10) + 55296, code % 1024 + 56320);
          }
          return elements;
        }
      );
      fromEntries = // native
      hasNativeFromEntries ? Object.fromEntries : (
        // Ponyfill
        function fromEntries2(entries) {
          var obj = {};
          for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var _a2 = entries_1[_i], k = _a2[0], v = _a2[1];
            obj[k] = v;
          }
          return obj;
        }
      );
      codePointAt = hasNativeCodePointAt ? (
        // Native
        function codePointAt2(s, index) {
          return s.codePointAt(index);
        }
      ) : (
        // IE 11
        function codePointAt3(s, index) {
          var size = s.length;
          if (index < 0 || index >= size) {
            return void 0;
          }
          var first = s.charCodeAt(index);
          var second;
          return first < 55296 || first > 56319 || index + 1 === size || (second = s.charCodeAt(index + 1)) < 56320 || second > 57343 ? first : (first - 55296 << 10) + (second - 56320) + 65536;
        }
      );
      trimStart = hasTrimStart ? (
        // Native
        function trimStart2(s) {
          return s.trimStart();
        }
      ) : (
        // Ponyfill
        function trimStart3(s) {
          return s.replace(SPACE_SEPARATOR_START_REGEX, "");
        }
      );
      trimEnd = hasTrimEnd ? (
        // Native
        function trimEnd2(s) {
          return s.trimEnd();
        }
      ) : (
        // Ponyfill
        function trimEnd3(s) {
          return s.replace(SPACE_SEPARATOR_END_REGEX, "");
        }
      );
      if (REGEX_SUPPORTS_U_AND_Y) {
        IDENTIFIER_PREFIX_RE_1 = RE("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
        matchIdentifierAtIndex = function matchIdentifierAtIndex2(s, index) {
          var _a2;
          IDENTIFIER_PREFIX_RE_1.lastIndex = index;
          var match = IDENTIFIER_PREFIX_RE_1.exec(s);
          return (_a2 = match[1]) !== null && _a2 !== void 0 ? _a2 : "";
        };
      } else {
        matchIdentifierAtIndex = function matchIdentifierAtIndex2(s, index) {
          var match = [];
          while (true) {
            var c = codePointAt(s, index);
            if (c === void 0 || _isWhiteSpace(c) || _isPatternSyntax(c)) {
              break;
            }
            match.push(c);
            index += c >= 65536 ? 2 : 1;
          }
          return fromCodePoint.apply(void 0, match);
        };
      }
      Parser = /** @class */
      function() {
        function Parser2(message, options) {
          if (options === void 0) {
            options = {};
          }
          this.message = message;
          this.position = { offset: 0, line: 1, column: 1 };
          this.ignoreTag = !!options.ignoreTag;
          this.locale = options.locale;
          this.requiresOtherClause = !!options.requiresOtherClause;
          this.shouldParseSkeletons = !!options.shouldParseSkeletons;
        }
        Parser2.prototype.parse = function() {
          if (this.offset() !== 0) {
            throw Error("parser can only be used once");
          }
          return this.parseMessage(0, "", false);
        };
        Parser2.prototype.parseMessage = function(nestingLevel, parentArgType, expectingCloseTag) {
          var elements = [];
          while (!this.isEOF()) {
            var char = this.char();
            if (char === 123) {
              var result = this.parseArgument(nestingLevel, expectingCloseTag);
              if (result.err) {
                return result;
              }
              elements.push(result.val);
            } else if (char === 125 && nestingLevel > 0) {
              break;
            } else if (char === 35 && (parentArgType === "plural" || parentArgType === "selectordinal")) {
              var position = this.clonePosition();
              this.bump();
              elements.push({
                type: TYPE.pound,
                location: createLocation(position, this.clonePosition())
              });
            } else if (char === 60 && !this.ignoreTag && this.peek() === 47) {
              if (expectingCloseTag) {
                break;
              } else {
                return this.error(ErrorKind.UNMATCHED_CLOSING_TAG, createLocation(this.clonePosition(), this.clonePosition()));
              }
            } else if (char === 60 && !this.ignoreTag && _isAlpha(this.peek() || 0)) {
              var result = this.parseTag(nestingLevel, parentArgType);
              if (result.err) {
                return result;
              }
              elements.push(result.val);
            } else {
              var result = this.parseLiteral(nestingLevel, parentArgType);
              if (result.err) {
                return result;
              }
              elements.push(result.val);
            }
          }
          return { val: elements, err: null };
        };
        Parser2.prototype.parseTag = function(nestingLevel, parentArgType) {
          var startPosition = this.clonePosition();
          this.bump();
          var tagName = this.parseTagName();
          this.bumpSpace();
          if (this.bumpIf("/>")) {
            return {
              val: {
                type: TYPE.literal,
                value: "<".concat(tagName, "/>"),
                location: createLocation(startPosition, this.clonePosition())
              },
              err: null
            };
          } else if (this.bumpIf(">")) {
            var childrenResult = this.parseMessage(nestingLevel + 1, parentArgType, true);
            if (childrenResult.err) {
              return childrenResult;
            }
            var children = childrenResult.val;
            var endTagStartPosition = this.clonePosition();
            if (this.bumpIf("</")) {
              if (this.isEOF() || !_isAlpha(this.char())) {
                return this.error(ErrorKind.INVALID_TAG, createLocation(endTagStartPosition, this.clonePosition()));
              }
              var closingTagNameStartPosition = this.clonePosition();
              var closingTagName = this.parseTagName();
              if (tagName !== closingTagName) {
                return this.error(ErrorKind.UNMATCHED_CLOSING_TAG, createLocation(closingTagNameStartPosition, this.clonePosition()));
              }
              this.bumpSpace();
              if (!this.bumpIf(">")) {
                return this.error(ErrorKind.INVALID_TAG, createLocation(endTagStartPosition, this.clonePosition()));
              }
              return {
                val: {
                  type: TYPE.tag,
                  value: tagName,
                  children,
                  location: createLocation(startPosition, this.clonePosition())
                },
                err: null
              };
            } else {
              return this.error(ErrorKind.UNCLOSED_TAG, createLocation(startPosition, this.clonePosition()));
            }
          } else {
            return this.error(ErrorKind.INVALID_TAG, createLocation(startPosition, this.clonePosition()));
          }
        };
        Parser2.prototype.parseTagName = function() {
          var startOffset = this.offset();
          this.bump();
          while (!this.isEOF() && _isPotentialElementNameChar(this.char())) {
            this.bump();
          }
          return this.message.slice(startOffset, this.offset());
        };
        Parser2.prototype.parseLiteral = function(nestingLevel, parentArgType) {
          var start = this.clonePosition();
          var value = "";
          while (true) {
            var parseQuoteResult = this.tryParseQuote(parentArgType);
            if (parseQuoteResult) {
              value += parseQuoteResult;
              continue;
            }
            var parseUnquotedResult = this.tryParseUnquoted(nestingLevel, parentArgType);
            if (parseUnquotedResult) {
              value += parseUnquotedResult;
              continue;
            }
            var parseLeftAngleResult = this.tryParseLeftAngleBracket();
            if (parseLeftAngleResult) {
              value += parseLeftAngleResult;
              continue;
            }
            break;
          }
          var location = createLocation(start, this.clonePosition());
          return {
            val: { type: TYPE.literal, value, location },
            err: null
          };
        };
        Parser2.prototype.tryParseLeftAngleBracket = function() {
          if (!this.isEOF() && this.char() === 60 && (this.ignoreTag || // If at the opening tag or closing tag position, bail.
          !_isAlphaOrSlash(this.peek() || 0))) {
            this.bump();
            return "<";
          }
          return null;
        };
        Parser2.prototype.tryParseQuote = function(parentArgType) {
          if (this.isEOF() || this.char() !== 39) {
            return null;
          }
          switch (this.peek()) {
            case 39:
              this.bump();
              this.bump();
              return "'";
            // '{', '<', '>', '}'
            case 123:
            case 60:
            case 62:
            case 125:
              break;
            case 35:
              if (parentArgType === "plural" || parentArgType === "selectordinal") {
                break;
              }
              return null;
            default:
              return null;
          }
          this.bump();
          var codePoints = [this.char()];
          this.bump();
          while (!this.isEOF()) {
            var ch = this.char();
            if (ch === 39) {
              if (this.peek() === 39) {
                codePoints.push(39);
                this.bump();
              } else {
                this.bump();
                break;
              }
            } else {
              codePoints.push(ch);
            }
            this.bump();
          }
          return fromCodePoint.apply(void 0, codePoints);
        };
        Parser2.prototype.tryParseUnquoted = function(nestingLevel, parentArgType) {
          if (this.isEOF()) {
            return null;
          }
          var ch = this.char();
          if (ch === 60 || ch === 123 || ch === 35 && (parentArgType === "plural" || parentArgType === "selectordinal") || ch === 125 && nestingLevel > 0) {
            return null;
          } else {
            this.bump();
            return fromCodePoint(ch);
          }
        };
        Parser2.prototype.parseArgument = function(nestingLevel, expectingCloseTag) {
          var openingBracePosition = this.clonePosition();
          this.bump();
          this.bumpSpace();
          if (this.isEOF()) {
            return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
          }
          if (this.char() === 125) {
            this.bump();
            return this.error(ErrorKind.EMPTY_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
          }
          var value = this.parseIdentifierIfPossible().value;
          if (!value) {
            return this.error(ErrorKind.MALFORMED_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
          }
          this.bumpSpace();
          if (this.isEOF()) {
            return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
          }
          switch (this.char()) {
            // Simple argument: `{name}`
            case 125: {
              this.bump();
              return {
                val: {
                  type: TYPE.argument,
                  // value does not include the opening and closing braces.
                  value,
                  location: createLocation(openingBracePosition, this.clonePosition())
                },
                err: null
              };
            }
            // Argument with options: `{name, format, ...}`
            case 44: {
              this.bump();
              this.bumpSpace();
              if (this.isEOF()) {
                return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
              }
              return this.parseArgumentOptions(nestingLevel, expectingCloseTag, value, openingBracePosition);
            }
            default:
              return this.error(ErrorKind.MALFORMED_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
          }
        };
        Parser2.prototype.parseIdentifierIfPossible = function() {
          var startingPosition = this.clonePosition();
          var startOffset = this.offset();
          var value = matchIdentifierAtIndex(this.message, startOffset);
          var endOffset = startOffset + value.length;
          this.bumpTo(endOffset);
          var endPosition = this.clonePosition();
          var location = createLocation(startingPosition, endPosition);
          return { value, location };
        };
        Parser2.prototype.parseArgumentOptions = function(nestingLevel, expectingCloseTag, value, openingBracePosition) {
          var _a2;
          var typeStartPosition = this.clonePosition();
          var argType = this.parseIdentifierIfPossible().value;
          var typeEndPosition = this.clonePosition();
          switch (argType) {
            case "":
              return this.error(ErrorKind.EXPECT_ARGUMENT_TYPE, createLocation(typeStartPosition, typeEndPosition));
            case "number":
            case "date":
            case "time": {
              this.bumpSpace();
              var styleAndLocation = null;
              if (this.bumpIf(",")) {
                this.bumpSpace();
                var styleStartPosition = this.clonePosition();
                var result = this.parseSimpleArgStyleIfPossible();
                if (result.err) {
                  return result;
                }
                var style = trimEnd(result.val);
                if (style.length === 0) {
                  return this.error(ErrorKind.EXPECT_ARGUMENT_STYLE, createLocation(this.clonePosition(), this.clonePosition()));
                }
                var styleLocation = createLocation(styleStartPosition, this.clonePosition());
                styleAndLocation = { style, styleLocation };
              }
              var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
              if (argCloseResult.err) {
                return argCloseResult;
              }
              var location_1 = createLocation(openingBracePosition, this.clonePosition());
              if (styleAndLocation && startsWith(styleAndLocation === null || styleAndLocation === void 0 ? void 0 : styleAndLocation.style, "::", 0)) {
                var skeleton = trimStart(styleAndLocation.style.slice(2));
                if (argType === "number") {
                  var result = this.parseNumberSkeletonFromString(skeleton, styleAndLocation.styleLocation);
                  if (result.err) {
                    return result;
                  }
                  return {
                    val: { type: TYPE.number, value, location: location_1, style: result.val },
                    err: null
                  };
                } else {
                  if (skeleton.length === 0) {
                    return this.error(ErrorKind.EXPECT_DATE_TIME_SKELETON, location_1);
                  }
                  var dateTimePattern = skeleton;
                  if (this.locale) {
                    dateTimePattern = getBestPattern(skeleton, this.locale);
                  }
                  var style = {
                    type: SKELETON_TYPE.dateTime,
                    pattern: dateTimePattern,
                    location: styleAndLocation.styleLocation,
                    parsedOptions: this.shouldParseSkeletons ? parseDateTimeSkeleton(dateTimePattern) : {}
                  };
                  var type = argType === "date" ? TYPE.date : TYPE.time;
                  return {
                    val: { type, value, location: location_1, style },
                    err: null
                  };
                }
              }
              return {
                val: {
                  type: argType === "number" ? TYPE.number : argType === "date" ? TYPE.date : TYPE.time,
                  value,
                  location: location_1,
                  style: (_a2 = styleAndLocation === null || styleAndLocation === void 0 ? void 0 : styleAndLocation.style) !== null && _a2 !== void 0 ? _a2 : null
                },
                err: null
              };
            }
            case "plural":
            case "selectordinal":
            case "select": {
              var typeEndPosition_1 = this.clonePosition();
              this.bumpSpace();
              if (!this.bumpIf(",")) {
                return this.error(ErrorKind.EXPECT_SELECT_ARGUMENT_OPTIONS, createLocation(typeEndPosition_1, __assign({}, typeEndPosition_1)));
              }
              this.bumpSpace();
              var identifierAndLocation = this.parseIdentifierIfPossible();
              var pluralOffset = 0;
              if (argType !== "select" && identifierAndLocation.value === "offset") {
                if (!this.bumpIf(":")) {
                  return this.error(ErrorKind.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, createLocation(this.clonePosition(), this.clonePosition()));
                }
                this.bumpSpace();
                var result = this.tryParseDecimalInteger(ErrorKind.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, ErrorKind.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);
                if (result.err) {
                  return result;
                }
                this.bumpSpace();
                identifierAndLocation = this.parseIdentifierIfPossible();
                pluralOffset = result.val;
              }
              var optionsResult = this.tryParsePluralOrSelectOptions(nestingLevel, argType, expectingCloseTag, identifierAndLocation);
              if (optionsResult.err) {
                return optionsResult;
              }
              var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
              if (argCloseResult.err) {
                return argCloseResult;
              }
              var location_2 = createLocation(openingBracePosition, this.clonePosition());
              if (argType === "select") {
                return {
                  val: {
                    type: TYPE.select,
                    value,
                    options: fromEntries(optionsResult.val),
                    location: location_2
                  },
                  err: null
                };
              } else {
                return {
                  val: {
                    type: TYPE.plural,
                    value,
                    options: fromEntries(optionsResult.val),
                    offset: pluralOffset,
                    pluralType: argType === "plural" ? "cardinal" : "ordinal",
                    location: location_2
                  },
                  err: null
                };
              }
            }
            default:
              return this.error(ErrorKind.INVALID_ARGUMENT_TYPE, createLocation(typeStartPosition, typeEndPosition));
          }
        };
        Parser2.prototype.tryParseArgumentClose = function(openingBracePosition) {
          if (this.isEOF() || this.char() !== 125) {
            return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
          }
          this.bump();
          return { val: true, err: null };
        };
        Parser2.prototype.parseSimpleArgStyleIfPossible = function() {
          var nestedBraces = 0;
          var startPosition = this.clonePosition();
          while (!this.isEOF()) {
            var ch = this.char();
            switch (ch) {
              case 39: {
                this.bump();
                var apostrophePosition = this.clonePosition();
                if (!this.bumpUntil("'")) {
                  return this.error(ErrorKind.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, createLocation(apostrophePosition, this.clonePosition()));
                }
                this.bump();
                break;
              }
              case 123: {
                nestedBraces += 1;
                this.bump();
                break;
              }
              case 125: {
                if (nestedBraces > 0) {
                  nestedBraces -= 1;
                } else {
                  return {
                    val: this.message.slice(startPosition.offset, this.offset()),
                    err: null
                  };
                }
                break;
              }
              default:
                this.bump();
                break;
            }
          }
          return {
            val: this.message.slice(startPosition.offset, this.offset()),
            err: null
          };
        };
        Parser2.prototype.parseNumberSkeletonFromString = function(skeleton, location) {
          var tokens = [];
          try {
            tokens = parseNumberSkeletonFromString(skeleton);
          } catch (e) {
            return this.error(ErrorKind.INVALID_NUMBER_SKELETON, location);
          }
          return {
            val: {
              type: SKELETON_TYPE.number,
              tokens,
              location,
              parsedOptions: this.shouldParseSkeletons ? parseNumberSkeleton(tokens) : {}
            },
            err: null
          };
        };
        Parser2.prototype.tryParsePluralOrSelectOptions = function(nestingLevel, parentArgType, expectCloseTag, parsedFirstIdentifier) {
          var _a2;
          var hasOtherClause = false;
          var options = [];
          var parsedSelectors = /* @__PURE__ */ new Set();
          var selector = parsedFirstIdentifier.value, selectorLocation = parsedFirstIdentifier.location;
          while (true) {
            if (selector.length === 0) {
              var startPosition = this.clonePosition();
              if (parentArgType !== "select" && this.bumpIf("=")) {
                var result = this.tryParseDecimalInteger(ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR, ErrorKind.INVALID_PLURAL_ARGUMENT_SELECTOR);
                if (result.err) {
                  return result;
                }
                selectorLocation = createLocation(startPosition, this.clonePosition());
                selector = this.message.slice(startPosition.offset, this.offset());
              } else {
                break;
              }
            }
            if (parsedSelectors.has(selector)) {
              return this.error(parentArgType === "select" ? ErrorKind.DUPLICATE_SELECT_ARGUMENT_SELECTOR : ErrorKind.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, selectorLocation);
            }
            if (selector === "other") {
              hasOtherClause = true;
            }
            this.bumpSpace();
            var openingBracePosition = this.clonePosition();
            if (!this.bumpIf("{")) {
              return this.error(parentArgType === "select" ? ErrorKind.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT : ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, createLocation(this.clonePosition(), this.clonePosition()));
            }
            var fragmentResult = this.parseMessage(nestingLevel + 1, parentArgType, expectCloseTag);
            if (fragmentResult.err) {
              return fragmentResult;
            }
            var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
            if (argCloseResult.err) {
              return argCloseResult;
            }
            options.push([
              selector,
              {
                value: fragmentResult.val,
                location: createLocation(openingBracePosition, this.clonePosition())
              }
            ]);
            parsedSelectors.add(selector);
            this.bumpSpace();
            _a2 = this.parseIdentifierIfPossible(), selector = _a2.value, selectorLocation = _a2.location;
          }
          if (options.length === 0) {
            return this.error(parentArgType === "select" ? ErrorKind.EXPECT_SELECT_ARGUMENT_SELECTOR : ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR, createLocation(this.clonePosition(), this.clonePosition()));
          }
          if (this.requiresOtherClause && !hasOtherClause) {
            return this.error(ErrorKind.MISSING_OTHER_CLAUSE, createLocation(this.clonePosition(), this.clonePosition()));
          }
          return { val: options, err: null };
        };
        Parser2.prototype.tryParseDecimalInteger = function(expectNumberError, invalidNumberError) {
          var sign = 1;
          var startingPosition = this.clonePosition();
          if (this.bumpIf("+")) {
          } else if (this.bumpIf("-")) {
            sign = -1;
          }
          var hasDigits = false;
          var decimal = 0;
          while (!this.isEOF()) {
            var ch = this.char();
            if (ch >= 48 && ch <= 57) {
              hasDigits = true;
              decimal = decimal * 10 + (ch - 48);
              this.bump();
            } else {
              break;
            }
          }
          var location = createLocation(startingPosition, this.clonePosition());
          if (!hasDigits) {
            return this.error(expectNumberError, location);
          }
          decimal *= sign;
          if (!isSafeInteger(decimal)) {
            return this.error(invalidNumberError, location);
          }
          return { val: decimal, err: null };
        };
        Parser2.prototype.offset = function() {
          return this.position.offset;
        };
        Parser2.prototype.isEOF = function() {
          return this.offset() === this.message.length;
        };
        Parser2.prototype.clonePosition = function() {
          return {
            offset: this.position.offset,
            line: this.position.line,
            column: this.position.column
          };
        };
        Parser2.prototype.char = function() {
          var offset = this.position.offset;
          if (offset >= this.message.length) {
            throw Error("out of bound");
          }
          var code = codePointAt(this.message, offset);
          if (code === void 0) {
            throw Error("Offset ".concat(offset, " is at invalid UTF-16 code unit boundary"));
          }
          return code;
        };
        Parser2.prototype.error = function(kind, location) {
          return {
            val: null,
            err: {
              kind,
              message: this.message,
              location
            }
          };
        };
        Parser2.prototype.bump = function() {
          if (this.isEOF()) {
            return;
          }
          var code = this.char();
          if (code === 10) {
            this.position.line += 1;
            this.position.column = 1;
            this.position.offset += 1;
          } else {
            this.position.column += 1;
            this.position.offset += code < 65536 ? 1 : 2;
          }
        };
        Parser2.prototype.bumpIf = function(prefix) {
          if (startsWith(this.message, prefix, this.offset())) {
            for (var i = 0; i < prefix.length; i++) {
              this.bump();
            }
            return true;
          }
          return false;
        };
        Parser2.prototype.bumpUntil = function(pattern) {
          var currentOffset = this.offset();
          var index = this.message.indexOf(pattern, currentOffset);
          if (index >= 0) {
            this.bumpTo(index);
            return true;
          } else {
            this.bumpTo(this.message.length);
            return false;
          }
        };
        Parser2.prototype.bumpTo = function(targetOffset) {
          if (this.offset() > targetOffset) {
            throw Error("targetOffset ".concat(targetOffset, " must be greater than or equal to the current offset ").concat(this.offset()));
          }
          targetOffset = Math.min(targetOffset, this.message.length);
          while (true) {
            var offset = this.offset();
            if (offset === targetOffset) {
              break;
            }
            if (offset > targetOffset) {
              throw Error("targetOffset ".concat(targetOffset, " is at invalid UTF-16 code unit boundary"));
            }
            this.bump();
            if (this.isEOF()) {
              break;
            }
          }
        };
        Parser2.prototype.bumpSpace = function() {
          while (!this.isEOF() && _isWhiteSpace(this.char())) {
            this.bump();
          }
        };
        Parser2.prototype.peek = function() {
          if (this.isEOF()) {
            return null;
          }
          var code = this.char();
          var offset = this.offset();
          var nextCode = this.message.charCodeAt(offset + (code >= 65536 ? 2 : 1));
          return nextCode !== null && nextCode !== void 0 ? nextCode : null;
        };
        return Parser2;
      }();
    }
  });

  // node_modules/@formatjs/icu-messageformat-parser/lib/index.js
  function pruneLocation(els) {
    els.forEach(function(el) {
      delete el.location;
      if (isSelectElement(el) || isPluralElement(el)) {
        for (var k in el.options) {
          delete el.options[k].location;
          pruneLocation(el.options[k].value);
        }
      } else if (isNumberElement(el) && isNumberSkeleton(el.style)) {
        delete el.style.location;
      } else if ((isDateElement(el) || isTimeElement(el)) && isDateTimeSkeleton(el.style)) {
        delete el.style.location;
      } else if (isTagElement(el)) {
        pruneLocation(el.children);
      }
    });
  }
  function parse(message, opts) {
    if (opts === void 0) {
      opts = {};
    }
    opts = __assign({ shouldParseSkeletons: true, requiresOtherClause: true }, opts);
    var result = new Parser(message, opts).parse();
    if (result.err) {
      var error = SyntaxError(ErrorKind[result.err.kind]);
      error.location = result.err.location;
      error.originalMessage = result.err.message;
      throw error;
    }
    if (!(opts === null || opts === void 0 ? void 0 : opts.captureLocation)) {
      pruneLocation(result.val);
    }
    return result.val;
  }
  var init_lib2 = __esm({
    "node_modules/@formatjs/icu-messageformat-parser/lib/index.js"() {
      init_tslib_es6();
      init_error();
      init_parser();
      init_types();
      init_types();
    }
  });

  // node_modules/@formatjs/fast-memoize/lib/index.js
  function memoize(fn, options) {
    var cache = options && options.cache ? options.cache : cacheDefault;
    var serializer = options && options.serializer ? options.serializer : serializerDefault;
    var strategy = options && options.strategy ? options.strategy : strategyDefault;
    return strategy(fn, {
      cache,
      serializer
    });
  }
  function isPrimitive(value) {
    return value == null || typeof value === "number" || typeof value === "boolean";
  }
  function monadic(fn, cache, serializer, arg) {
    var cacheKey = isPrimitive(arg) ? arg : serializer(arg);
    var computedValue = cache.get(cacheKey);
    if (typeof computedValue === "undefined") {
      computedValue = fn.call(this, arg);
      cache.set(cacheKey, computedValue);
    }
    return computedValue;
  }
  function variadic(fn, cache, serializer) {
    var args = Array.prototype.slice.call(arguments, 3);
    var cacheKey = serializer(args);
    var computedValue = cache.get(cacheKey);
    if (typeof computedValue === "undefined") {
      computedValue = fn.apply(this, args);
      cache.set(cacheKey, computedValue);
    }
    return computedValue;
  }
  function assemble(fn, context, strategy, cache, serialize) {
    return strategy.bind(context, fn, cache, serialize);
  }
  function strategyDefault(fn, options) {
    var strategy = fn.length === 1 ? monadic : variadic;
    return assemble(fn, this, strategy, options.cache.create(), options.serializer);
  }
  function strategyVariadic(fn, options) {
    return assemble(fn, this, variadic, options.cache.create(), options.serializer);
  }
  function strategyMonadic(fn, options) {
    return assemble(fn, this, monadic, options.cache.create(), options.serializer);
  }
  function ObjectWithoutPrototypeCache() {
    this.cache = /* @__PURE__ */ Object.create(null);
  }
  var serializerDefault, cacheDefault, strategies;
  var init_lib3 = __esm({
    "node_modules/@formatjs/fast-memoize/lib/index.js"() {
      serializerDefault = function() {
        return JSON.stringify(arguments);
      };
      ObjectWithoutPrototypeCache.prototype.get = function(key) {
        return this.cache[key];
      };
      ObjectWithoutPrototypeCache.prototype.set = function(key, value) {
        this.cache[key] = value;
      };
      cacheDefault = {
        create: function create() {
          return new ObjectWithoutPrototypeCache();
        }
      };
      strategies = {
        variadic: strategyVariadic,
        monadic: strategyMonadic
      };
    }
  });

  // node_modules/intl-messageformat/lib/src/error.js
  var ErrorCode, FormatError, InvalidValueError, InvalidValueTypeError, MissingValueError;
  var init_error2 = __esm({
    "node_modules/intl-messageformat/lib/src/error.js"() {
      init_tslib_es6();
      (function(ErrorCode2) {
        ErrorCode2["MISSING_VALUE"] = "MISSING_VALUE";
        ErrorCode2["INVALID_VALUE"] = "INVALID_VALUE";
        ErrorCode2["MISSING_INTL_API"] = "MISSING_INTL_API";
      })(ErrorCode || (ErrorCode = {}));
      FormatError = /** @class */
      function(_super) {
        __extends(FormatError2, _super);
        function FormatError2(msg, code, originalMessage) {
          var _this = _super.call(this, msg) || this;
          _this.code = code;
          _this.originalMessage = originalMessage;
          return _this;
        }
        FormatError2.prototype.toString = function() {
          return "[formatjs Error: ".concat(this.code, "] ").concat(this.message);
        };
        return FormatError2;
      }(Error);
      InvalidValueError = /** @class */
      function(_super) {
        __extends(InvalidValueError2, _super);
        function InvalidValueError2(variableId, value, options, originalMessage) {
          return _super.call(this, 'Invalid values for "'.concat(variableId, '": "').concat(value, '". Options are "').concat(Object.keys(options).join('", "'), '"'), ErrorCode.INVALID_VALUE, originalMessage) || this;
        }
        return InvalidValueError2;
      }(FormatError);
      InvalidValueTypeError = /** @class */
      function(_super) {
        __extends(InvalidValueTypeError2, _super);
        function InvalidValueTypeError2(value, type, originalMessage) {
          return _super.call(this, 'Value for "'.concat(value, '" must be of type ').concat(type), ErrorCode.INVALID_VALUE, originalMessage) || this;
        }
        return InvalidValueTypeError2;
      }(FormatError);
      MissingValueError = /** @class */
      function(_super) {
        __extends(MissingValueError2, _super);
        function MissingValueError2(variableId, originalMessage) {
          return _super.call(this, 'The intl string context variable "'.concat(variableId, '" was not provided to the string "').concat(originalMessage, '"'), ErrorCode.MISSING_VALUE, originalMessage) || this;
        }
        return MissingValueError2;
      }(FormatError);
    }
  });

  // node_modules/intl-messageformat/lib/src/formatters.js
  function mergeLiteral(parts) {
    if (parts.length < 2) {
      return parts;
    }
    return parts.reduce(function(all, part) {
      var lastPart = all[all.length - 1];
      if (!lastPart || lastPart.type !== PART_TYPE.literal || part.type !== PART_TYPE.literal) {
        all.push(part);
      } else {
        lastPart.value += part.value;
      }
      return all;
    }, []);
  }
  function isFormatXMLElementFn(el) {
    return typeof el === "function";
  }
  function formatToParts(els, locales, formatters, formats, values, currentPluralValue, originalMessage) {
    if (els.length === 1 && isLiteralElement(els[0])) {
      return [
        {
          type: PART_TYPE.literal,
          value: els[0].value
        }
      ];
    }
    var result = [];
    for (var _i = 0, els_1 = els; _i < els_1.length; _i++) {
      var el = els_1[_i];
      if (isLiteralElement(el)) {
        result.push({
          type: PART_TYPE.literal,
          value: el.value
        });
        continue;
      }
      if (isPoundElement(el)) {
        if (typeof currentPluralValue === "number") {
          result.push({
            type: PART_TYPE.literal,
            value: formatters.getNumberFormat(locales).format(currentPluralValue)
          });
        }
        continue;
      }
      var varName = el.value;
      if (!(values && varName in values)) {
        throw new MissingValueError(varName, originalMessage);
      }
      var value = values[varName];
      if (isArgumentElement(el)) {
        if (!value || typeof value === "string" || typeof value === "number") {
          value = typeof value === "string" || typeof value === "number" ? String(value) : "";
        }
        result.push({
          type: typeof value === "string" ? PART_TYPE.literal : PART_TYPE.object,
          value
        });
        continue;
      }
      if (isDateElement(el)) {
        var style = typeof el.style === "string" ? formats.date[el.style] : isDateTimeSkeleton(el.style) ? el.style.parsedOptions : void 0;
        result.push({
          type: PART_TYPE.literal,
          value: formatters.getDateTimeFormat(locales, style).format(value)
        });
        continue;
      }
      if (isTimeElement(el)) {
        var style = typeof el.style === "string" ? formats.time[el.style] : isDateTimeSkeleton(el.style) ? el.style.parsedOptions : formats.time.medium;
        result.push({
          type: PART_TYPE.literal,
          value: formatters.getDateTimeFormat(locales, style).format(value)
        });
        continue;
      }
      if (isNumberElement(el)) {
        var style = typeof el.style === "string" ? formats.number[el.style] : isNumberSkeleton(el.style) ? el.style.parsedOptions : void 0;
        if (style && style.scale) {
          value = value * (style.scale || 1);
        }
        result.push({
          type: PART_TYPE.literal,
          value: formatters.getNumberFormat(locales, style).format(value)
        });
        continue;
      }
      if (isTagElement(el)) {
        var children = el.children, value_1 = el.value;
        var formatFn = values[value_1];
        if (!isFormatXMLElementFn(formatFn)) {
          throw new InvalidValueTypeError(value_1, "function", originalMessage);
        }
        var parts = formatToParts(children, locales, formatters, formats, values, currentPluralValue);
        var chunks = formatFn(parts.map(function(p) {
          return p.value;
        }));
        if (!Array.isArray(chunks)) {
          chunks = [chunks];
        }
        result.push.apply(result, chunks.map(function(c) {
          return {
            type: typeof c === "string" ? PART_TYPE.literal : PART_TYPE.object,
            value: c
          };
        }));
      }
      if (isSelectElement(el)) {
        var opt = el.options[value] || el.options.other;
        if (!opt) {
          throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
        }
        result.push.apply(result, formatToParts(opt.value, locales, formatters, formats, values));
        continue;
      }
      if (isPluralElement(el)) {
        var opt = el.options["=".concat(value)];
        if (!opt) {
          if (!Intl.PluralRules) {
            throw new FormatError('Intl.PluralRules is not available in this environment.\nTry polyfilling it using "@formatjs/intl-pluralrules"\n', ErrorCode.MISSING_INTL_API, originalMessage);
          }
          var rule = formatters.getPluralRules(locales, { type: el.pluralType }).select(value - (el.offset || 0));
          opt = el.options[rule] || el.options.other;
        }
        if (!opt) {
          throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
        }
        result.push.apply(result, formatToParts(opt.value, locales, formatters, formats, values, value - (el.offset || 0)));
        continue;
      }
    }
    return mergeLiteral(result);
  }
  var PART_TYPE;
  var init_formatters = __esm({
    "node_modules/intl-messageformat/lib/src/formatters.js"() {
      init_lib2();
      init_error2();
      (function(PART_TYPE2) {
        PART_TYPE2[PART_TYPE2["literal"] = 0] = "literal";
        PART_TYPE2[PART_TYPE2["object"] = 1] = "object";
      })(PART_TYPE || (PART_TYPE = {}));
    }
  });

  // node_modules/intl-messageformat/lib/src/core.js
  function mergeConfig(c1, c2) {
    if (!c2) {
      return c1;
    }
    return __assign(__assign(__assign({}, c1 || {}), c2 || {}), Object.keys(c1).reduce(function(all, k) {
      all[k] = __assign(__assign({}, c1[k]), c2[k] || {});
      return all;
    }, {}));
  }
  function mergeConfigs(defaultConfig, configs) {
    if (!configs) {
      return defaultConfig;
    }
    return Object.keys(defaultConfig).reduce(function(all, k) {
      all[k] = mergeConfig(defaultConfig[k], configs[k]);
      return all;
    }, __assign({}, defaultConfig));
  }
  function createFastMemoizeCache(store) {
    return {
      create: function() {
        return {
          get: function(key) {
            return store[key];
          },
          set: function(key, value) {
            store[key] = value;
          }
        };
      }
    };
  }
  function createDefaultFormatters(cache) {
    if (cache === void 0) {
      cache = {
        number: {},
        dateTime: {},
        pluralRules: {}
      };
    }
    return {
      getNumberFormat: memoize(function() {
        var _a2;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return new ((_a2 = Intl.NumberFormat).bind.apply(_a2, __spreadArray([void 0], args, false)))();
      }, {
        cache: createFastMemoizeCache(cache.number),
        strategy: strategies.variadic
      }),
      getDateTimeFormat: memoize(function() {
        var _a2;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return new ((_a2 = Intl.DateTimeFormat).bind.apply(_a2, __spreadArray([void 0], args, false)))();
      }, {
        cache: createFastMemoizeCache(cache.dateTime),
        strategy: strategies.variadic
      }),
      getPluralRules: memoize(function() {
        var _a2;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return new ((_a2 = Intl.PluralRules).bind.apply(_a2, __spreadArray([void 0], args, false)))();
      }, {
        cache: createFastMemoizeCache(cache.pluralRules),
        strategy: strategies.variadic
      })
    };
  }
  var IntlMessageFormat;
  var init_core = __esm({
    "node_modules/intl-messageformat/lib/src/core.js"() {
      init_tslib_es6();
      init_lib2();
      init_lib3();
      init_formatters();
      IntlMessageFormat = /** @class */
      function() {
        function IntlMessageFormat2(message, locales, overrideFormats, opts) {
          if (locales === void 0) {
            locales = IntlMessageFormat2.defaultLocale;
          }
          var _this = this;
          this.formatterCache = {
            number: {},
            dateTime: {},
            pluralRules: {}
          };
          this.format = function(values) {
            var parts = _this.formatToParts(values);
            if (parts.length === 1) {
              return parts[0].value;
            }
            var result = parts.reduce(function(all, part) {
              if (!all.length || part.type !== PART_TYPE.literal || typeof all[all.length - 1] !== "string") {
                all.push(part.value);
              } else {
                all[all.length - 1] += part.value;
              }
              return all;
            }, []);
            if (result.length <= 1) {
              return result[0] || "";
            }
            return result;
          };
          this.formatToParts = function(values) {
            return formatToParts(_this.ast, _this.locales, _this.formatters, _this.formats, values, void 0, _this.message);
          };
          this.resolvedOptions = function() {
            var _a3;
            return {
              locale: ((_a3 = _this.resolvedLocale) === null || _a3 === void 0 ? void 0 : _a3.toString()) || Intl.NumberFormat.supportedLocalesOf(_this.locales)[0]
            };
          };
          this.getAst = function() {
            return _this.ast;
          };
          this.locales = locales;
          this.resolvedLocale = IntlMessageFormat2.resolveLocale(locales);
          if (typeof message === "string") {
            this.message = message;
            if (!IntlMessageFormat2.__parse) {
              throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
            }
            var _a2 = opts || {}, formatters = _a2.formatters, parseOpts = __rest(_a2, ["formatters"]);
            this.ast = IntlMessageFormat2.__parse(message, __assign(__assign({}, parseOpts), { locale: this.resolvedLocale }));
          } else {
            this.ast = message;
          }
          if (!Array.isArray(this.ast)) {
            throw new TypeError("A message must be provided as a String or AST.");
          }
          this.formats = mergeConfigs(IntlMessageFormat2.formats, overrideFormats);
          this.formatters = opts && opts.formatters || createDefaultFormatters(this.formatterCache);
        }
        Object.defineProperty(IntlMessageFormat2, "defaultLocale", {
          get: function() {
            if (!IntlMessageFormat2.memoizedDefaultLocale) {
              IntlMessageFormat2.memoizedDefaultLocale = new Intl.NumberFormat().resolvedOptions().locale;
            }
            return IntlMessageFormat2.memoizedDefaultLocale;
          },
          enumerable: false,
          configurable: true
        });
        IntlMessageFormat2.memoizedDefaultLocale = null;
        IntlMessageFormat2.resolveLocale = function(locales) {
          if (typeof Intl.Locale === "undefined") {
            return;
          }
          var supportedLocales = Intl.NumberFormat.supportedLocalesOf(locales);
          if (supportedLocales.length > 0) {
            return new Intl.Locale(supportedLocales[0]);
          }
          return new Intl.Locale(typeof locales === "string" ? locales : locales[0]);
        };
        IntlMessageFormat2.__parse = parse;
        IntlMessageFormat2.formats = {
          number: {
            integer: {
              maximumFractionDigits: 0
            },
            currency: {
              style: "currency"
            },
            percent: {
              style: "percent"
            }
          },
          date: {
            short: {
              month: "numeric",
              day: "numeric",
              year: "2-digit"
            },
            medium: {
              month: "short",
              day: "numeric",
              year: "numeric"
            },
            long: {
              month: "long",
              day: "numeric",
              year: "numeric"
            },
            full: {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric"
            }
          },
          time: {
            short: {
              hour: "numeric",
              minute: "numeric"
            },
            medium: {
              hour: "numeric",
              minute: "numeric",
              second: "numeric"
            },
            long: {
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              timeZoneName: "short"
            },
            full: {
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              timeZoneName: "short"
            }
          }
        };
        return IntlMessageFormat2;
      }();
    }
  });

  // node_modules/intl-messageformat/lib/index.js
  var lib_default;
  var init_lib4 = __esm({
    "node_modules/intl-messageformat/lib/index.js"() {
      init_core();
      init_formatters();
      init_core();
      init_error2();
      lib_default = IntlMessageFormat;
    }
  });

  // node_modules/i18next-icu/dist/es/index.js
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _classCallCheck(instance2, Constructor) {
    if (!(instance2 instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  function getDefaults() {
    return {
      memoize: true,
      memoizeFallback: false,
      bindI18n: "",
      bindI18nStore: "",
      parseErrorHandler: function parseErrorHandler(err, key, res, options) {
        return res;
      },
      parseLngForICU: function parseLngForICU(lng) {
        return lng;
      }
    };
  }
  var ICU, es_default;
  var init_es = __esm({
    "node_modules/i18next-icu/dist/es/index.js"() {
      init_utils();
      init_lib4();
      ICU = /* @__PURE__ */ function() {
        function ICU2(options) {
          _classCallCheck(this, ICU2);
          this.type = "i18nFormat";
          this.mem = {};
          this.init(null, options);
        }
        _createClass(ICU2, [{
          key: "init",
          value: function init2(i18next2, options) {
            var _this = this;
            var i18nextOptions = i18next2 && i18next2.options && i18next2.options.i18nFormat || {};
            this.options = defaults(i18nextOptions, options, this.options || {}, getDefaults());
            this.formats = this.options.formats;
            if (i18next2) {
              var _this$options = this.options, bindI18n = _this$options.bindI18n, bindI18nStore = _this$options.bindI18nStore, memoize2 = _this$options.memoize;
              i18next2.IntlMessageFormat = lib_default;
              i18next2.ICU = this;
              if (memoize2) {
                if (bindI18n) {
                  i18next2.on(bindI18n, function() {
                    return _this.clearCache();
                  });
                }
                if (bindI18nStore) {
                  i18next2.store.on(bindI18nStore, function() {
                    return _this.clearCache();
                  });
                }
              }
            }
          }
        }, {
          key: "addUserDefinedFormats",
          value: function addUserDefinedFormats(formats) {
            this.formats = this.formats ? _objectSpread(_objectSpread({}, this.formats), formats) : formats;
          }
        }, {
          key: "parse",
          value: function parse2(res, options, lng, ns, key, info) {
            var hadSuccessfulLookup = info && info.resolved && info.resolved.res;
            var memKey = this.options.memoize && "".concat(lng, ".").concat(ns, ".").concat(key.replace(/\./g, "###"));
            var fc;
            if (this.options.memoize) {
              fc = getPath2(this.mem, memKey);
            }
            try {
              if (!fc) {
                var transformedLng = this.options.parseLngForICU(lng);
                fc = new lib_default(res, transformedLng, this.formats, {
                  ignoreTag: true
                });
                if (this.options.memoize && (this.options.memoizeFallback || !info || hadSuccessfulLookup)) setPath2(this.mem, memKey, fc);
              }
              return fc.format(options);
            } catch (err) {
              return this.options.parseErrorHandler(err, key, res, options);
            }
          }
        }, {
          key: "addLookupKeys",
          value: function addLookupKeys(finalKeys, _key, _code, _ns, _options) {
            return finalKeys;
          }
        }, {
          key: "clearCache",
          value: function clearCache() {
            this.mem = {};
          }
        }]);
        return ICU2;
      }();
      ICU.type = "i18nFormat";
      es_default = ICU;
    }
  });

  // node_modules/webextension-polyfill/dist/browser-polyfill.js
  var require_browser_polyfill = __commonJS({
    "node_modules/webextension-polyfill/dist/browser-polyfill.js"(exports, module) {
      (function(global, factory) {
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
      })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports, function(module2) {
        "use strict";
        if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
          throw new Error("This script should only be loaded in a browser extension.");
        }
        if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
          const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
          const wrapAPIs = (extensionAPIs) => {
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
            class DefaultWeakMap extends WeakMap {
              constructor(createItem, items = void 0) {
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
            const isThenable = (value) => {
              return value && typeof value === "object" && typeof value.then === "function";
            };
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
            const pluralizeArguments = (numArgs) => numArgs == 1 ? "argument" : "arguments";
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
                    try {
                      target[name](...args, makeCallback({
                        resolve,
                        reject
                      }, metadata));
                    } catch (cbError) {
                      console.warn(`${name} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, cbError);
                      target[name](...args);
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
            const wrapMethod = (target, method, wrapper) => {
              return new Proxy(method, {
                apply(targetMethod, thisObj, args) {
                  return wrapper.call(thisObj, target, ...args);
                }
              });
            };
            let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
            const wrapObject = (target, wrappers = {}, metadata = {}) => {
              let cache = /* @__PURE__ */ Object.create(null);
              let handlers = {
                has(proxyTarget2, prop) {
                  return prop in target || prop in cache;
                },
                get(proxyTarget2, prop, receiver) {
                  if (prop in cache) {
                    return cache[prop];
                  }
                  if (!(prop in target)) {
                    return void 0;
                  }
                  let value = target[prop];
                  if (typeof value === "function") {
                    if (typeof wrappers[prop] === "function") {
                      value = wrapMethod(target, target[prop], wrappers[prop]);
                    } else if (hasOwnProperty(metadata, prop)) {
                      let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                      value = wrapMethod(target, target[prop], wrapper);
                    } else {
                      value = value.bind(target);
                    }
                  } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
                    value = wrapObject(value, wrappers[prop], metadata[prop]);
                  } else if (hasOwnProperty(metadata, "*")) {
                    value = wrapObject(value, wrappers[prop], metadata["*"]);
                  } else {
                    Object.defineProperty(cache, prop, {
                      configurable: true,
                      enumerable: true,
                      get() {
                        return target[prop];
                      },
                      set(value2) {
                        target[prop] = value2;
                      }
                    });
                    return value;
                  }
                  cache[prop] = value;
                  return value;
                },
                set(proxyTarget2, prop, value, receiver) {
                  if (prop in cache) {
                    cache[prop] = value;
                  } else {
                    target[prop] = value;
                  }
                  return true;
                },
                defineProperty(proxyTarget2, prop, desc) {
                  return Reflect.defineProperty(cache, prop, desc);
                },
                deleteProperty(proxyTarget2, prop) {
                  return Reflect.deleteProperty(cache, prop);
                }
              };
              let proxyTarget = Object.create(target);
              return new Proxy(proxyTarget, handlers);
            };
            const wrapEvent = (wrapperMap) => ({
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
            const onRequestFinishedWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onRequestFinished(req) {
                const wrappedReq = wrapObject(req, {}, {
                  getContent: {
                    minArgs: 0,
                    maxArgs: 0
                  }
                });
                listener(wrappedReq);
              };
            });
            const onMessageWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onMessage(message, sender, sendResponse) {
                let didCallSendResponse = false;
                let wrappedSendResponse;
                let sendResponsePromise = new Promise((resolve) => {
                  wrappedSendResponse = function(response) {
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
                const isResultThenable = result !== true && isThenable(result);
                if (result !== true && !isResultThenable && !didCallSendResponse) {
                  return false;
                }
                const sendPromisedResult = (promise) => {
                  promise.then((msg) => {
                    sendResponse(msg);
                  }, (error) => {
                    let message2;
                    if (error && (error instanceof Error || typeof error.message === "string")) {
                      message2 = error.message;
                    } else {
                      message2 = "An unexpected error occurred";
                    }
                    sendResponse({
                      __mozWebExtensionPolyfillReject__: true,
                      message: message2
                    });
                  }).catch((err) => {
                    console.error("Failed to send onMessage rejected reply", err);
                  });
                };
                if (isResultThenable) {
                  sendPromisedResult(result);
                } else {
                  sendPromisedResult(sendResponsePromise);
                }
                return true;
              };
            });
            const wrappedSendMessageCallback = ({
              reject,
              resolve
            }, reply) => {
              if (extensionAPIs.runtime.lastError) {
                if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
                  resolve();
                } else {
                  reject(new Error(extensionAPIs.runtime.lastError.message));
                }
              } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
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
          };
          module2.exports = wrapAPIs(chrome);
        } else {
          module2.exports = globalThis.browser;
        }
      });
    }
  });

  // shared/js/background/i18n.js
  function getUserLocale() {
    if (!import_webextension_polyfill.default?.i18n) {
      return "en";
    }
    const lang = import_webextension_polyfill.default.i18n.getUILanguage().slice(0, 2);
    if (["nn", "no"].includes(lang)) {
      return "nb";
    }
    return lang;
  }
  var import_webextension_polyfill;
  var init_i18n = __esm({
    "shared/js/background/i18n.js"() {
      "use strict";
      import_webextension_polyfill = __toESM(require_browser_polyfill());
    }
  });

  // shared/locales/bg/feedback.json
  var feedback_default;
  var init_feedback = __esm({
    "shared/locales/bg/feedback.json"() {
      feedback_default = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "\u041A\u043E\u0439 \u0443\u0435\u0431\u0441\u0430\u0439\u0442 \u0435 \u043F\u043E\u0432\u0440\u0435\u0434\u0435\u043D?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "\u041A\u043E\u043F\u0438\u0440\u0430\u0439\u0442\u0435 \u0438 \u043F\u043E\u0441\u0442\u0430\u0432\u0435\u0442\u0435 URL \u0430\u0434\u0440\u0435\u0441\u0430",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "\u041A\u0430\u043A\u0432\u043E \u0412\u0438 \u0445\u0430\u0440\u0435\u0441\u0432\u0430? \u041A\u0430\u043A\u0432\u043E \u043D\u0435 \u0440\u0430\u0431\u043E\u0442\u0438 \u043A\u0430\u043A\u0442\u043E \u0442\u0440\u044F\u0431\u0432\u0430? \u041A\u0430\u043A \u043C\u043E\u0436\u0435 \u0434\u0430 \u0441\u0435 \u043F\u043E\u0434\u043E\u0431\u0440\u0438 \u0440\u0430\u0437\u0448\u0438\u0440\u0435\u043D\u0438\u0435\u0442\u043E?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "\u0417\u0430 \u043A\u043E\u0438 \u0444\u0443\u043D\u043A\u0446\u0438\u0438 \u0438\u043B\u0438 \u0444\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u043D\u043E\u0441\u0442\u0438 \u0441\u0435 \u043E\u0442\u043D\u0430\u0441\u044F \u0412\u0430\u0448\u0438\u044F \u043E\u0442\u0437\u0438\u0432? \u041C\u043E\u043B\u044F, \u0434\u0430\u0439\u0442\u0435 \u043A\u043E\u043B\u043A\u043E\u0442\u043E \u043C\u043E\u0436\u0435 \u043F\u043E-\u043A\u043E\u043D\u043A\u0440\u0435\u0442\u0435\u043D \u043E\u0442\u0433\u043E\u0432\u043E\u0440.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "\u0418\u0437\u043F\u0440\u0430\u0449\u0430\u043D\u0435\u0442\u043E \u043D\u0430 \u0430\u043D\u043E\u043D\u0438\u043C\u0435\u043D \u043E\u0442\u0437\u0438\u0432 \u043D\u0438 \u043F\u043E\u043C\u0430\u0433\u0430 \u0434\u0430 \u043F\u043E\u0434\u043E\u0431\u0440\u0438\u043C DuckDuckGo Privacy Essentials.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "\u0418\u0441\u043A\u0430\u043C \u0434\u0430 \u043F\u043E\u0434\u0430\u043C \u0441\u0438\u0433\u043D\u0430\u043B \u0437\u0430 \u043F\u043E\u0432\u0440\u0435\u0434\u0435\u043D \u0441\u0430\u0439\u0442",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "\u0418\u0437\u043F\u0440\u0430\u0442\u0438",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "\u041E\u043F\u0438\u0448\u0435\u0442\u0435 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0430, \u043A\u043E\u0439\u0442\u043E \u0441\u0440\u0435\u0449\u043D\u0430\u0445\u0442\u0435:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "\u041A\u043E\u0435 \u0441\u044A\u0434\u044A\u0440\u0436\u0430\u043D\u0438\u0435 \u0438\u043B\u0438 \u0444\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u043D\u043E\u0441\u0442 \u043D\u0430 \u0443\u0435\u0431\u0441\u0430\u0439\u0442\u0430 \u0435 \u043F\u043E\u0432\u0440\u0435\u0434\u0435\u043D\u043E? \u041C\u043E\u043B\u044F, \u0434\u0430\u0439\u0442\u0435 \u043A\u043E\u043B\u043A\u043E\u0442\u043E \u043C\u043E\u0436\u0435 \u043F\u043E-\u043A\u043E\u043D\u043A\u0440\u0435\u0442\u0435\u043D \u043E\u0442\u0433\u043E\u0432\u043E\u0440.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "\u0411\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u0438\u043C \u0412\u0438 \u0437\u0430 \u043E\u0442\u0437\u0438\u0432\u0430!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "\u0412\u0430\u0448\u0438\u0442\u0435 \u0441\u0438\u0433\u043D\u0430\u043B\u0438 \u0437\u0430 \u043F\u043E\u0432\u0440\u0435\u0434\u0435\u043D \u0441\u0430\u0439\u0442 \u043F\u043E\u043C\u0430\u0433\u0430\u0442 \u043D\u0430 \u043D\u0430\u0448\u0438\u044F \u0435\u043A\u0438\u043F \u043E\u0442 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u0446\u0438 \u0434\u0430 \u043E\u0442\u0441\u0442\u0440\u0430\u043D\u0438 \u0442\u0435\u0437\u0438 \u043F\u043E\u0432\u0440\u0435\u0434\u0438.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/bg/options.json
  var options_default;
  var init_options = __esm({
    "shared/locales/bg/options.json"() {
      options_default = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "\u041E\u043F\u0446\u0438\u0438 \u0437\u0430 DuckDuckGo",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "\u041C\u043E\u0436\u0435\u0442\u0435 \u0434\u0430 \u0442\u044A\u0440\u0441\u0438\u0442\u0435 \u0438 \u0434\u0430 \u0441\u044A\u0440\u0444\u0438\u0440\u0430\u0442\u0435 \u0432 \u043C\u0440\u0435\u0436\u0430\u0442\u0430, \u0431\u0435\u0437 \u0434\u0430 \u0412\u0438 \u0441\u043B\u0435\u0434\u044F\u0442.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo \u0437\u0430\u0449\u0438\u0442\u0430\u0432\u0430 \u043F\u043E\u0432\u0435\u0440\u0438\u0442\u0435\u043B\u043D\u043E\u0441\u0442\u0442\u0430 \u043D\u0430 \u0434\u0430\u043D\u043D\u0438\u0442\u0435 \u0412\u0438 \u043E\u043D\u043B\u0430\u0439\u043D \u0441\n\u043F\u043E\u0432\u0435\u0440\u0438\u0442\u0435\u043B\u043D\u043E \u0442\u044A\u0440\u0441\u0435\u043D\u0435,\n\u0431\u043B\u043E\u043A\u0438\u0440\u0430\u043D\u0435 \u043D\u0430 \u0442\u0440\u0430\u043A\u0435\u0440\u0438\n\u0438 \u043A\u0440\u0438\u043F\u0442\u0438\u0440\u0430\u043D\u0435 \u043D\u0430 \u0441\u0430\u0439\u0442\u043E\u0432\u0435.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "\u0421\u043F\u043E\u0434\u0435\u043B\u044F\u043D\u0435 \u043D\u0430 \u043E\u0442\u0437\u0438\u0432",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "\u041F\u043E\u0434\u0430\u0432\u0430\u043D\u0435 \u043D\u0430 \u0441\u0438\u0433\u043D\u0430\u043B \u0437\u0430 \u043F\u043E\u0432\u0440\u0435\u0434\u0435\u043D \u0441\u0430\u0439\u0442",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "\u041F\u043E\u043A\u0430\u0437\u0432\u0430\u043D\u0435 \u043D\u0430 \u0432\u0433\u0440\u0430\u0434\u0435\u043D\u0438 \u0442\u0443\u0438\u0442\u043E\u0432\u0435",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "\u0413\u043B\u043E\u0431\u0430\u043B\u0435\u043D \u043A\u043E\u043D\u0442\u0440\u043E\u043B \u043D\u0430 \u043F\u043E\u0432\u0435\u0440\u0438\u0442\u0435\u043B\u043D\u043E\u0441\u0442\u0442\u0430 (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: "\u0412\u0430\u0448\u0438\u0442\u0435 \u043B\u0438\u0447\u043D\u0438 \u0434\u0430\u043D\u043D\u0438 \u043D\u0435 \u0441\u0430 \u0437\u0430 \u043F\u0440\u043E\u0434\u0430\u0436\u0431\u0430. \u041D\u0438\u0435 \u0432 DuckDuckGo \u0441\u043C\u0435 \u0441\u044A\u0433\u043B\u0430\u0441\u043D\u0438 \u0441 \u0442\u043E\u0432\u0430.\n\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u0430\u0439\u0442\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0442\u0430 \u201E\u0413\u043B\u043E\u0431\u0430\u043B\u0435\u043D \u043A\u043E\u043D\u0442\u0440\u043E\u043B \u043D\u0430 \u043F\u043E\u0432\u0435\u0440\u0438\u0442\u0435\u043B\u043D\u043E\u0441\u0442\u0442\u0430\u201C (GPC) \u0438 \u043D\u0438\u0435 \u0449\u0435\n\u0443\u0432\u0435\u0434\u043E\u043C\u044F\u0432\u0430\u043C\u0435 \u0443\u0435\u0431\u0441\u0430\u0439\u0442\u043E\u0432\u0435\u0442\u0435 \u0437\u0430 \u0412\u0430\u0448\u0435\u0442\u043E \u043F\u0440\u0435\u0434\u043F\u043E\u0447\u0438\u0442\u0430\u043D\u0438\u0435:",
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "\u0414\u0430 \u043D\u0435 \u043F\u0440\u043E\u0434\u0430\u0432\u0430\u0442 \u0412\u0430\u0448\u0438\u0442\u0435 \u043B\u0438\u0447\u043D\u0438 \u0434\u0430\u043D\u043D\u0438.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "\u0414\u0430 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0430\u0442 \u0441\u043F\u043E\u0434\u0435\u043B\u044F\u043D\u0435\u0442\u043E \u043D\u0430 \u043B\u0438\u0447\u043D\u0438\u0442\u0435 \u0412\u0438 \u0434\u0430\u043D\u043D\u0438 \u0441 \u0434\u0440\u0443\u0433\u0438 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>\u0422\u044A\u0439 \u043A\u0430\u0442\u043E \u0413\u043B\u043E\u0431\u0430\u043B\u043D\u0438\u044F\u0442 \u043A\u043E\u043D\u0442\u0440\u043E\u043B \u043D\u0430 \u043F\u043E\u0432\u0435\u0440\u0438\u0442\u0435\u043B\u043D\u043E\u0441\u0442\u0442\u0430 (GPC) \u0435 \u043D\u043E\u0432 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442,\n\u043F\u043E\u0432\u0435\u0447\u0435\u0442\u043E \u0443\u0435\u0431\u0441\u0430\u0439\u0442\u043E\u0432\u0435 \u0432\u0441\u0435 \u043E\u0449\u0435 \u043D\u0435 \u0433\u043E \u043F\u0440\u0438\u0437\u043D\u0430\u0432\u0430\u0442, \u043D\u043E \u043D\u0438\u0435 \u043F\u043E\u043B\u0430\u0433\u0430\u043C\u0435 \u0443\u0441\u0438\u043B\u0438\u044F\n\u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u044A\u0442 \u0434\u0430 \u0431\u044A\u0434\u0435 \u043F\u0440\u0438\u0435\u0442 \u043F\u043E \u0446\u0435\u043B\u0438\u044F \u0441\u0432\u044F\u0442.</b> \u0412\u044A\u043F\u0440\u0435\u043A\u0438 \u0442\u043E\u0432\u0430 \u043E\u0442 \u0443\u0435\u0431 \u0441\u0430\u0439\u0442\u043E\u0432\u0435\u0442\u0435 \u0441\u0435 \u0438\u0437\u0438\u0441\u043A\u0432\u0430 \u0434\u0430 \u043F\u0440\u0435\u0434\u043F\u0440\u0438\u0435\u043C\u0430\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043F\u043E \u0434\u0430\u0434\u0435\u043D \u0441\u0438\u0433\u043D\u0430\u043B\n\u0434\u043E \u0441\u0442\u0435\u043F\u0435\u043D\u0442\u0430, \u0434\u043E \u043A\u043E\u044F\u0442\u043E \u043F\u0440\u0438\u043B\u043E\u0436\u0438\u043C\u043E\u0442\u043E \u0437\u0430\u043A\u043E\u043D\u043E\u0434\u0430\u0442\u0435\u043B\u0441\u0442\u0432\u043E \u0438\u043C \u043D\u0430\u043B\u0430\u0433\u0430 \u0442\u043E\u0432\u0430.\xA0",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "\u0417\u0430\u0449\u0438\u0442\u0430 \u043D\u0430 \u0438\u043C\u0435\u0439\u043B",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E\u0442\u043E \u043F\u043E\u043F\u044A\u043B\u0432\u0430\u043D\u0435 \u0435 \u0434\u0435\u0430\u043A\u0442\u0438\u0432\u0438\u0440\u0430\u043D\u043E",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: '\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u0430\u043D\u043E \u0435 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u043E\u043F\u044A\u043B\u0432\u0430\u043D\u0435 \u0437\u0430 <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "\u041D\u044F\u043C\u0430 \u0434\u043E\u0431\u0430\u0432\u0435\u043D\u0438 \u043D\u0435\u0437\u0430\u0449\u0438\u0442\u0435\u043D\u0438 \u0441\u0430\u0439\u0442\u043E\u0432\u0435",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "\u041D\u0435\u0437\u0430\u0449\u0438\u0442\u0435\u043D\u0438 \u0441\u0430\u0439\u0442\u043E\u0432\u0435",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "\u041A\u044A\u043C \u0442\u0435\u0437\u0438 \u0441\u0430\u0439\u0442\u043E\u0432\u0435 \u043D\u044F\u043C\u0430 \u0434\u0430 \u0431\u044A\u0434\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0430 \u0437\u0430\u0449\u0438\u0442\u0430 \u043D\u0430 \u043F\u043E\u0432\u0435\u0440\u0438\u0442\u0435\u043B\u043D\u043E\u0441\u0442\u0442\u0430.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "\u0414\u043E\u0431\u0430\u0432\u044F\u043D\u0435 \u043D\u0430 \u043D\u0435\u0437\u0430\u0449\u0438\u0442\u0435\u043D \u0441\u0430\u0439\u0442",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "\u0412\u044A\u0432\u0435\u0434\u0435\u0442\u0435 URL \u0430\u0434\u0440\u0435\u0441",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D URL \u0430\u0434\u0440\u0435\u0441",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "\u0421 Fire Button \u043C\u043E\u0436\u0435\u0442\u0435 \u043B\u0435\u0441\u043D\u043E \u0434\u0430 \u0438\u0437\u0447\u0438\u0441\u0442\u0438\u0442\u0435 \u0440\u0430\u0437\u0434\u0435\u043B\u0438\u0442\u0435, \u0438\u0441\u0442\u043E\u0440\u0438\u044F\u0442\u0430 \u043D\u0430 \u0441\u044A\u0440\u0444\u0438\u0440\u0430\u043D\u0435 \u0438 \u0434\u0430\u043D\u043D\u0438\u0442\u0435. \u041C\u043E\u0436\u0435\u0442\u0435 \u0434\u0430 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0438\u0440\u0430\u0442\u0435 \u0434\u0430\u043B\u0438 \u0438\u0441\u0442\u043E\u0440\u0438\u044F\u0442\u0430 \u043D\u0430 \u0441\u044A\u0440\u0444\u0438\u0440\u0430\u043D\u0435 \u0438 \u0434\u0430\u043D\u043D\u0438\u0442\u0435 \u0434\u0430 \u0441\u0435 \u0438\u0437\u0447\u0438\u0441\u0442\u0432\u0430\u0442, \u043A\u0430\u043A\u0442\u043E \u0438 \u0434\u0430\u043B\u0438 \u0442\u0435\u043A\u0443\u0449\u0438\u0442\u0435 \u0440\u0430\u0437\u0434\u0435\u043B\u0438 \u0434\u0430 \u0441\u0435 \u0437\u0430\u0442\u0432\u0430\u0440\u044F\u0442.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "\u0418\u0437\u0447\u0438\u0441\u0442\u0432\u0430\u043D\u0435 \u043D\u0430 \u0438\u0441\u0442\u043E\u0440\u0438\u044F\u0442\u0430",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: "\u0418\u043C\u0430\u0439\u0442\u0435 \u043F\u0440\u0435\u0434\u0432\u0438\u0434: \u0418\u0441\u0442\u043E\u0440\u0438\u044F\u0442\u0430 \u043D\u0430 \u0441\u044A\u0440\u0444\u0438\u0440\u0430\u043D\u0435 \u043C\u043E\u0436\u0435 \u0434\u0430 \u0431\u044A\u0434\u0435 \u0438\u0437\u0447\u0438\u0441\u0442\u0435\u043D\u0430 \u0441\u0430\u043C\u043E \u0437\u0430 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D \u043F\u0435\u0440\u0438\u043E\u0434 \u043E\u0442 \u0432\u0440\u0435\u043C\u0435 (\u043D\u0430\u043F\u0440. \u0437\u0430 \u201E\u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u044F \u0447\u0430\u0441\u201C \u0438\u043B\u0438 \u0437\u0430 \u201E\u0446\u044F\u043B\u043E\u0442\u043E \u0432\u0440\u0435\u043C\u0435\u201C), \u0430 \u043D\u0435 \u0437\u0430 \u0432\u0441\u0435\u043A\u0438 \u043E\u0442\u0434\u0435\u043B\u0435\u043D \u0441\u0430\u0439\u0442.",
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "\u0417\u0430\u0442\u0432\u0430\u0440\u044F\u043D\u0435 \u043D\u0430 \u0440\u0430\u0437\u0434\u0435\u043B\u0438\u0442\u0435",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "\u0418\u0437\u0432\u044A\u0440\u0448\u0432\u0430 \u0441\u0435 \u0438\u0437\u0433\u0430\u0440\u044F\u043D\u0435...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/bg/shared.json
  var shared_default;
  var init_shared = __esm({
    "shared/locales/bg/shared.json"() {
      shared_default = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "\u041E\u043F\u0446\u0438\u0438",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "\u041D\u0430\u0443\u0447\u0435\u0442\u0435 \u043F\u043E\u0432\u0435\u0447\u0435",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u0430\u043D\u0435",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "\u0417\u0430\u0431\u0440\u0430\u043D\u0438",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "\u0414\u043E\u0431\u0430\u0432\u044F\u043D\u0435",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/cs/feedback.json
  var feedback_default2;
  var init_feedback2 = __esm({
    "shared/locales/cs/feedback.json"() {
      feedback_default2 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Kter\xFD web je po\u0161kozen\xFD?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Sem zkop\xEDruj adresu URL",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "Co se ti l\xEDb\xED? Co moc nefunguje? Jak by se dalo roz\u0161\xED\u0159en\xED zlep\u0161it?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "Kter\xFDch vlastnost\xED nebo funkc\xED se tvoje zp\u011Btn\xE1 vazba t\xFDk\xE1? Bu\u010F co nejkonkr\xE9tn\u011Bj\u0161\xED.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "Odesl\xE1n\xED anonymn\xED zp\u011Btn\xE9 vazby n\xE1m pom\xE1h\xE1 zlep\u0161ovat Privacy Essentials od DuckDuckGo.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "Chci nahl\xE1sit nefunk\u010Dn\xED web",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Odeslat",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Popi\u0161 zji\u0161t\u011Bn\xFD probl\xE9m:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Jak\xFD obsah nebo funkce webu je nefunk\u010Dn\xED? Bu\u010F co nejkonkr\xE9tn\u011Bj\u0161\xED.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "D\u011Bkujeme za zp\u011Btnou vazbu!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Tvoje hl\xE1\u0161en\xED o nefunk\u010Dn\xEDch str\xE1nk\xE1ch pom\xE1haj\xED t\xFDmu na\u0161ich v\xFDvoj\xE1\u0159\u016F tyhle chyby opravovat.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/cs/options.json
  var options_default2;
  var init_options2 = __esm({
    "shared/locales/cs/options.json"() {
      options_default2 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "Mo\u017Enosti DuckDuckGo",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "Nenech se sledovat p\u0159i vyhled\xE1v\xE1n\xED a\xA0prohl\xED\u017Een\xED webu.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo chr\xE1n\xED tvoje soukrom\xED na webu soukrom\xFDm vyhled\xE1v\xE1n\xEDm\n,blokov\xE1n\xEDm tracker\u016F\na\xA0\u0161ifrov\xE1n\xEDm str\xE1nek.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Pod\u011Bl se o zp\u011Btnou vazbu",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Nahl\xE1sit nefunk\u010Dn\xED web",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "Zobrazit vlo\u017Een\xE9 tweety",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Glob\xE1ln\xED kontrola ochrany osobn\xEDch \xFAdaj\u016F (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: "Tvoje data nesm\xED b\xFDt na prodej. P\u0159esn\u011B tak to v\xA0DuckDuckGo vid\xEDme.\nAktivuj nastaven\xED \u201EGlobal Privacy Control\u201C (GPC) a\xA0my d\xE1me webov\xFDm str\xE1nk\xE1m sign\xE1l, \u017Ee preferuje\u0161:",
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "Neprod\xE1vat osobn\xED \xFAdaje.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "Omezit sd\xEDlen\xED va\u0161ich osobn\xEDch \xFAdaj\u016F s jin\xFDmi spole\u010Dnosti.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>I kdy\u017E je Glob\xE1ln\xED kontrola ochrany osobn\xEDch \xFAdaj\u016F (GPC)\n nov\xFD standard, v\u011Bt\u0161ina webov\xFDch str\xE1nek ho zat\xEDm nerozpozn\xE1, nicm\xE9n\u011B tvrd\u011B pracujeme\n na tom, abychom zajistili, \u017Ee bude akceptov\xE1na po cel\xE9m sv\u011Bt\u011B.</b> Webov\xE9 str\xE1nky jsou nicm\xE9n\u011B povinny \u0159e\u0161it podn\u011Bty pouze v rozsahu, v jak\xE9m je k tomu donut\xED p\u0159\xEDslu\u0161n\xE9 z\xE1kony.",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "Ochrana e-mailu",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Vypnut\xE9 automatick\xE9 vypl\u0148ov\xE1n\xED",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Je zapnut\xE9 automatick\xE9 vypl\u0148ov\xE1n\xED pro u\u017Eivatele <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Nebyly p\u0159id\xE1ny \u017E\xE1dn\xE9 nechr\xE1n\u011Bn\xE9 weby",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Nechr\xE1n\u011Bn\xE9 str\xE1nky",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "Tyto str\xE1nky nebudou vylep\u0161eny ochranou soukrom\xED.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "P\u0159idat nechr\xE1n\u011Bn\xFD web",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "Zadej adresu URL",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "Neplatn\xE1 adresa URL",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "Pomoc\xED tla\u010D\xEDtka Fire Button m\u016F\u017Ee\u0161 snadno vymazat karty, historii proch\xE1zen\xED a data. Je jen na tob\u011B, jestli se m\xE1 vymazat historie proch\xE1zen\xED i data a jestli se maj\xED zav\u0159\xEDt aktu\xE1ln\xED karty.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "Vymazat historii",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: "Upozor\u0148ujeme, \u017Ee historie proch\xE1zen\xED se d\xE1 vymazat jen pro konkr\xE9tn\xED \u010Dasov\xE9 obdob\xED (nap\u0159. za posledn\xED hodinu nebo za celou dobu), nikoli pro jednotliv\xE9 weby.",
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Zav\u0159\xEDt karty",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "Prob\xEDh\xE1 maz\xE1n\xED...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/cs/shared.json
  var shared_default2;
  var init_shared2 = __esm({
    "shared/locales/cs/shared.json"() {
      shared_default2 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Mo\u017Enosti",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "V\xEDce informac\xED",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Povolit",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Vypnout",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "P\u0159idat",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/da/feedback.json
  var feedback_default3;
  var init_feedback3 = __esm({
    "shared/locales/da/feedback.json"() {
      feedback_default3 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Hvilket websted er \xF8delagt?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Kopier og inds\xE6t din URL",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "Hvad kan du lide? Hvad fungerer ikke? Hvordan kunne udvidelsen forbedres?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "Hvilke funktioner vedr\xF8rer din feedback? V\xE6r s\xE5 specifik som muligt.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "Hvis du sender anonym feedback, hj\xE6lper du os med at forbedre DuckDuckGo Essentielt for privatlivet.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "Jeg vil gerne rapportere et \xF8delagt websted",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Indsend",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Beskriv det problem, du st\xF8dte p\xE5:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Hvilket webstedsindhold eller funktionalitet er \xF8delagt? V\xE6r s\xE5 specifik som muligt.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "Tak for din feedback!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Dine rapporter om \xF8delagte websteder hj\xE6lper vores udviklingsteam med at rette disse fejl.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/da/options.json
  var options_default3;
  var init_options3 = __esm({
    "shared/locales/da/options.json"() {
      options_default3 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "Indstillinger for DuckDuckGo",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "S\xF8g og browse p\xE5 nettet uden at blive sporet.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo beskytter dit privatliv online med\nprivat s\xF8gning,\ntracker-blokering,\nog kryptering af websteder.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Del feedback",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Rapport\xE9r \xF8delagt websted",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "Vis indlejrede tweets",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Global Privacy Control (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: 'Dine data burde ikke v\xE6re til salg. Det er vi enige i hos DuckDuckGo.Aktiv\xE9r indstillingen "Global Privacy Control" (GPC), s\xE5\nsignalerer vi til websteder, at du foretr\xE6kker:',
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "Ikke at s\xE6lge dine personlige data.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "At begr\xE6nse deling af dine personlige data til andre virksomheder.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>Da Global Privacy Control (GPC) er en ny standard,\ngenkender de fleste websteder det endnu ikke, men vi arbejder h\xE5rdt\np\xE5 at sikre, at det bliver accepteret over hele verden.</b> Websteder er dog kun forpligtet til at reagere p\xE5 signalet i det omfang, de er forpligtede if\xF8lge loven til at g\xF8re det.\xA0",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "E-mailbeskyttelse",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Automatisk udfyldning er deaktiveret",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Automatisk udfyldning aktiveret for <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Ingen ubeskyttede websteder tilf\xF8jet",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Ubeskyttede websteder",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "Disse websteder vil ikke blive forbedret ved Beskyttelse af privatlivet.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "Tilf\xF8j ubeskyttet websted",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "Indtast URL",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "Ugyldig URL",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "Fire Button g\xF8r det nemt at rydde dine faner, browserhistorik og data. Du kan kontrollere, om den skal rydde browserhistorik og data, og om den skal lukke dine aktuelle faner eller ej.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "Ryd historik",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: 'Bem\xE6rk: Browserhistorikken kan kun slettes for et bestemt tidsrum (f.eks. "sidste time", eller "altid"), og ikke for hvert websted.',
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Luk fane",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "Afbr\xE6nding er i gang ...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/da/shared.json
  var shared_default3;
  var init_shared3 = __esm({
    "shared/locales/da/shared.json"() {
      shared_default3 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Valgmuligheder",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "Mere info",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Aktiver",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Deaktiver",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Tilf\xF8j",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/de/feedback.json
  var feedback_default4;
  var init_feedback4 = __esm({
    "shared/locales/de/feedback.json"() {
      feedback_default4 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Welche Website ist fehlerhaft?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "URL kopieren und einf\xFCgen",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "Was findest du gut? Was funktioniert nicht? Wie k\xF6nnte die Erweiterung verbessert werden?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "Auf welche Features oder Funktionen bezieht sich dein Feedback? Bitte sei so genau wie m\xF6glich.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "Das Senden von anonymem Feedback hilft uns, DuckDuckGo Privacy Essentials zu verbessern.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "Ich m\xF6chte eine fehlerhafte Seite melden",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Abschicken",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Beschreibe das Problem, auf das du gesto\xDFen bist:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Welche Inhalte oder Funktionen der Website sind fehlerhaft? Bitte sei so genau wie m\xF6glich.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "Vielen Dank f\xFCr dein Feedback!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Deine Meldungen \xFCber fehlerhafte Seiten helfen unserem Entwicklungsteam, diese Fehler zu beheben.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/de/options.json
  var options_default4;
  var init_options4 = __esm({
    "shared/locales/de/options.json"() {
      options_default4 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "DuckDuckGo-Optionen",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "Durchsuche und browse das Web ohne getrackt zu werden.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo sch\xFCtzt deine Privatsph\xE4re online mit\nprivater Suche,\nTracker-Blockade\nund Website-Verschl\xFCsselung.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Feedback teilen",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Fehlerhafte Seite melden",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "Eingebettete Tweets anzeigen",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Global Privacy Control (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: "Deine Daten sollten nicht zum Verkauf stehen. Und bei DuckDuckGo vertreten wir ebendiese Meinung.\nAktiviere die \u201EGlobal Privacy Control\u201C (GPC)-Einstellungen und wir\nteilen Websites mit, dass du Folgendes bevorzugst:",
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "Deine personenbezogenen Daten nicht verkaufen.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "Personenbezogene Daten wenn m\xF6glich nicht an andere Unternehmen weiterleiten.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>Global Privacy Control (GPC) ist noch ganz neu und die meisten Websites werden den Standard nicht sofort erkennen. Wir arbeiten aber darauf hin, dass der GPC-Standard bald weltweit akzeptiert wird.</b> Websites sind jedoch nur dann verpflichtet, den Aufruf zu beherzigen und umzusetzen, wenn die geltenden Gesetze sie dazu verpflichten.\xA0",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "E-Mail-Schutz",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Autovervollst\xE4ndigen deaktiviert",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Autovervollst\xE4ndigen aktiviert f\xFCr <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Keine ungesch\xFCtzten Seiten hinzugef\xFCgt",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Ungesch\xFCtzte Websites",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "F\xFCr diese Websites ist der Datenschutz nicht aktiviert.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "Ungesch\xFCtzte Website hinzuf\xFCgen",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "URL eingeben",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "Ung\xFCltige URL",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "Mit dem Fire Button k\xF6nnen Sie ganz einfach Ihre Tabs, Ihren Browserverlauf und Ihre Daten l\xF6schen. Sie k\xF6nnen festlegen, ob der Browserverlauf und die Daten gel\xF6scht werden sollen und ob die aktuellen Tabs geschlossen werden sollen oder nicht.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "Verlauf l\xF6schen",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: "Hinweis: Der Browserverlauf kann nur f\xFCr einen bestimmten Zeitraum gel\xF6scht werden (z. B. \u201Eletzte Stunde\u201C oder \u201Ealle Zeiten\u201C) und nicht pro Website.",
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Tabs schlie\xDFen",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "L\xF6schvorgang in Bearbeitung\xA0...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/de/shared.json
  var shared_default4;
  var init_shared4 = __esm({
    "shared/locales/de/shared.json"() {
      shared_default4 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Optionen",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "Mehr erfahren",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Aktivieren",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Deaktivieren",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Hinzuf\xFCgen",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/el/feedback.json
  var feedback_default5;
  var init_feedback5 = __esm({
    "shared/locales/el/feedback.json"() {
      feedback_default5 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "\u03A0\u03BF\u03B9\u03BF\u03C2 \u03B9\u03C3\u03C4\u03CC\u03C4\u03BF\u03C0\u03BF\u03C2 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03BA\u03B1\u03C4\u03B5\u03C3\u03C4\u03C1\u03B1\u03BC\u03BC\u03AD\u03BD\u03BF\u03C2;",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "\u0391\u03BD\u03C4\u03B9\u03B3\u03C1\u03AC\u03C8\u03C4\u03B5 \u03BA\u03B1\u03B9 \u03B5\u03C0\u03B9\u03BA\u03BF\u03BB\u03BB\u03AE\u03C3\u03C4\u03B5 \u03C4\u03B7 \u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 URL \u03C3\u03B1\u03C2",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "\u03A4\u03B9 \u03C3\u03B1\u03C2 \u03B1\u03C1\u03AD\u03C3\u03B5\u03B9; \u03A4\u03B9 \u03B4\u03B5\u03BD \u03BB\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03B5\u03AF; \u03A0\u03CE\u03C2 \u03B8\u03B1 \u03BC\u03C0\u03BF\u03C1\u03BF\u03CD\u03C3\u03B5 \u03BD\u03B1 \u03B2\u03B5\u03BB\u03C4\u03B9\u03C9\u03B8\u03B5\u03AF \u03B7 \u03B5\u03C0\u03AD\u03BA\u03C4\u03B1\u03C3\u03B7;",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "\u03A3\u03B5 \u03C0\u03BF\u03B9\u03B1 \u03C7\u03B1\u03C1\u03B1\u03BA\u03C4\u03B7\u03C1\u03B9\u03C3\u03C4\u03B9\u03BA\u03AC \u03AE \u03BB\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03AF\u03B5\u03C2 \u03B1\u03BD\u03B1\u03C6\u03AD\u03C1\u03BF\u03BD\u03C4\u03B1\u03B9 \u03C4\u03B1 \u03C3\u03C7\u03CC\u03BB\u03B9\u03AC \u03C3\u03B1\u03C2; \u039D\u03B1 \u03B5\u03AF\u03C3\u03C4\u03B5 \u03CC\u03C3\u03BF \u03C4\u03BF \u03B4\u03C5\u03BD\u03B1\u03C4\u03CC\u03BD \u03C0\u03B9\u03BF \u03C3\u03C5\u03B3\u03BA\u03B5\u03BA\u03C1\u03B9\u03BC\u03AD\u03BD\u03BF\u03B9.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "\u0397 \u03C5\u03C0\u03BF\u03B2\u03BF\u03BB\u03AE \u03B1\u03BD\u03CE\u03BD\u03C5\u03BC\u03C9\u03BD \u03C3\u03C7\u03BF\u03BB\u03AF\u03C9\u03BD \u03BC\u03AC\u03C2 \u03B2\u03BF\u03B7\u03B8\u03AC \u03BD\u03B1 \u03B2\u03B5\u03BB\u03C4\u03B9\u03CE\u03BD\u03BF\u03C5\u03BC\u03B5 \u03C4\u03BF DuckDuckGo Privacy Essentials.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "\u0398\u03AD\u03BB\u03C9 \u03BD\u03B1 \u03B1\u03BD\u03B1\u03C6\u03AD\u03C1\u03C9 \u03AD\u03BD\u03B1\u03BD \u03B9\u03C3\u03C4\u03CC\u03C4\u03BF\u03C0\u03BF \u03C0\u03BF\u03C5 \u03B4\u03B5\u03BD \u03BB\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03B5\u03AF \u03C3\u03C9\u03C3\u03C4\u03AC",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "\u03A5\u03C0\u03BF\u03B2\u03BF\u03BB\u03AE",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "\u03A0\u03B5\u03C1\u03B9\u03B3\u03C1\u03AC\u03C8\u03C4\u03B5 \u03C4\u03BF \u03C0\u03C1\u03CC\u03B2\u03BB\u03B7\u03BC\u03B1 \u03C0\u03BF\u03C5 \u03B1\u03BD\u03C4\u03B9\u03BC\u03B5\u03C4\u03C9\u03C0\u03AF\u03C3\u03B1\u03C4\u03B5:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "\u03A0\u03BF\u03B9\u03BF \u03C0\u03B5\u03C1\u03B9\u03B5\u03C7\u03CC\u03BC\u03B5\u03BD\u03BF \u03AE \u03BB\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u03C4\u03BF\u03C5 \u03B9\u03C3\u03C4\u03CC\u03C4\u03BF\u03C0\u03BF\u03C5 \u03B4\u03B5\u03BD \u03BB\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03B5\u03AF \u03C3\u03C9\u03C3\u03C4\u03AC; \u039D\u03B1 \u03B5\u03AF\u03C3\u03C4\u03B5 \u03CC\u03C3\u03BF \u03C4\u03BF \u03B4\u03C5\u03BD\u03B1\u03C4\u03CC\u03BD \u03C0\u03B9\u03BF \u03C3\u03C5\u03B3\u03BA\u03B5\u03BA\u03C1\u03B9\u03BC\u03AD\u03BD\u03BF\u03B9.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "\u0395\u03C5\u03C7\u03B1\u03C1\u03B9\u03C3\u03C4\u03BF\u03CD\u03BC\u03B5 \u03B3\u03B9\u03B1 \u03C4\u03B1 \u03C3\u03C7\u03CC\u03BB\u03B9\u03AC \u03C3\u03B1\u03C2!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "\u039F\u03B9 \u03B1\u03BD\u03B1\u03C6\u03BF\u03C1\u03AD\u03C2 \u03C3\u03B1\u03C2 \u03B3\u03B9\u03B1 \u03B9\u03C3\u03C4\u03CC\u03C4\u03BF\u03C0\u03BF\u03C5\u03C2 \u03C0\u03BF\u03C5 \u03B4\u03B5\u03BD \u03BB\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03BF\u03CD\u03BD \u03C3\u03C9\u03C3\u03C4\u03AC \u03B2\u03BF\u03B7\u03B8\u03BF\u03CD\u03BD \u03C4\u03B7\u03BD \u03BF\u03BC\u03AC\u03B4\u03B1 \u03B1\u03BD\u03AC\u03C0\u03C4\u03C5\u03BE\u03AE\u03C2 \u03BC\u03B1\u03C2 \u03BD\u03B1 \u03B4\u03B9\u03BF\u03C1\u03B8\u03CE\u03C3\u03B5\u03B9 \u03C4\u03B1 \u03C0\u03C1\u03BF\u03B2\u03BB\u03AE\u03BC\u03B1\u03C4\u03B1 \u03B1\u03C5\u03C4\u03AC.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/el/options.json
  var options_default5;
  var init_options5 = __esm({
    "shared/locales/el/options.json"() {
      options_default5 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2 DuckDuckGo",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "\u0391\u03BD\u03B1\u03B6\u03B7\u03C4\u03AE\u03C3\u03C4\u03B5 \u03BA\u03B1\u03B9 \u03C0\u03B5\u03C1\u03B9\u03B7\u03B3\u03B7\u03B8\u03B5\u03AF\u03C4\u03B5 \u03C3\u03C4\u03BF\u03BD \u0399\u03C3\u03C4\u03CC \u03C7\u03C9\u03C1\u03AF\u03C2 \u03BD\u03B1 \u03C3\u03B1\u03C2 \u03C0\u03B1\u03C1\u03B1\u03BA\u03BF\u03BB\u03BF\u03C5\u03B8\u03BF\u03CD\u03BD.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "\u03A4\u03BF DuckDuckGo \u03C0\u03C1\u03BF\u03C3\u03C4\u03B1\u03C4\u03B5\u03CD\u03B5\u03B9 \u03C4\u03B7\u03BD \u03B9\u03B4\u03B9\u03C9\u03C4\u03B9\u03BA\u03CC\u03C4\u03B7\u03C4\u03AC \u03C3\u03B1\u03C2 \u03C3\u03C4\u03BF \u03B4\u03B9\u03B1\u03B4\u03AF\u03BA\u03C4\u03C5\u03BF \u03BC\u03B5\n\u03B9\u03B4\u03B9\u03C9\u03C4\u03B9\u03BA\u03AE \u03B1\u03BD\u03B1\u03B6\u03AE\u03C4\u03B7\u03C3\u03B7,\n\u03B1\u03C0\u03BF\u03BA\u03BB\u03B5\u03B9\u03C3\u03BC\u03CC \u03C0\u03B1\u03C1\u03B1\u03BA\u03BF\u03BB\u03BF\u03CD\u03B8\u03B7\u03C3\u03B7\u03C2,\n\u03BA\u03B1\u03B9 \u03BA\u03C1\u03C5\u03C0\u03C4\u03BF\u03B3\u03C1\u03AC\u03C6\u03B7\u03C3\u03B7 \u03B9\u03C3\u03C4\u03CC\u03C4\u03BF\u03C0\u03C9\u03BD.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "\u039A\u03BF\u03B9\u03BD\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03B7 \u03C3\u03C7\u03BF\u03BB\u03AF\u03BF\u03C5",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "\u0391\u03BD\u03B1\u03C6\u03BF\u03C1\u03AC \u03B9\u03C3\u03C4\u03CC\u03C4\u03BF\u03C0\u03BF\u03C5 \u03C0\u03BF\u03C5 \u03B4\u03B5\u03BD \u03BB\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03B5\u03AF",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "\u0395\u03BC\u03C6\u03AC\u03BD\u03B9\u03C3\u03B7 \u03B5\u03BD\u03C3\u03C9\u03BC\u03B1\u03C4\u03C9\u03BC\u03AD\u03BD\u03C9\u03BD Tweet",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "\u03A0\u03B1\u03B3\u03BA\u03CC\u03C3\u03BC\u03B9\u03BF\u03C2 \u03AD\u03BB\u03B5\u03B3\u03C7\u03BF\u03C2 \u03B1\u03C0\u03BF\u03C1\u03C1\u03AE\u03C4\u03BF\u03C5 (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: "\u03A4\u03B1 \u03B4\u03B5\u03B4\u03BF\u03BC\u03AD\u03BD\u03B1 \u03C3\u03B1\u03C2 \u03B4\u03B5\u03BD \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03C0\u03C9\u03BB\u03BF\u03CD\u03BD\u03C4\u03B1\u03B9. \u03A3\u03C4\u03B7\u03BD DuckDuckGo \u03C3\u03C5\u03BC\u03C6\u03C9\u03BD\u03BF\u03CD\u03BC\u03B5.\u0395\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03B9\u03AE\u03C3\u03C4\u03B5 \u03C4\u03B9\u03C2 \u03C1\u03C5\u03B8\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2 \u03B3\u03B9\u03B1 \u03C4\u03BF\u03BD \xAB\u03A0\u03B1\u03B3\u03BA\u03CC\u03C3\u03BC\u03B9\u03BF \u03AD\u03BB\u03B5\u03B3\u03C7\u03BF \u03B1\u03C0\u03BF\u03C1\u03C1\u03AE\u03C4\u03BF\u03C5\xBB (GPC) \u03BA\u03B1\u03B9 \u03B8\u03B1\n\u03B5\u03C0\u03B9\u03C3\u03B7\u03BC\u03AC\u03BD\u03BF\u03C5\u03BC\u03B5 \u03C3\u03C4\u03BF\u03C5\u03C2 \u03B9\u03C3\u03C4\u03CC\u03C4\u03BF\u03C0\u03BF\u03C5\u03C2 \u03C4\u03B7\u03BD \u03C0\u03C1\u03BF\u03C4\u03AF\u03BC\u03B7\u03C3\u03AE \u03C3\u03B1\u03C2:",
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "\u039D\u03B1 \u03BC\u03B7\u03BD \u03C0\u03C9\u03BB\u03BF\u03CD\u03BD \u03C4\u03B1 \u03C0\u03C1\u03BF\u03C3\u03C9\u03C0\u03B9\u03BA\u03AC \u03B4\u03B5\u03B4\u03BF\u03BC\u03AD\u03BD\u03B1 \u03C3\u03B1\u03C2.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "\u039D\u03B1 \u03C0\u03B5\u03C1\u03B9\u03BF\u03C1\u03AF\u03C3\u03BF\u03C5\u03BD \u03C4\u03B7\u03BD \u03BA\u03BF\u03B9\u03BD\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03B7 \u03C4\u03C9\u03BD \u03C0\u03C1\u03BF\u03C3\u03C9\u03C0\u03B9\u03BA\u03CE\u03BD \u03B4\u03B5\u03B4\u03BF\u03BC\u03AD\u03BD\u03C9\u03BD \u03C3\u03B1\u03C2 \u03C3\u03B5 \u03AC\u03BB\u03BB\u03B5\u03C2 \u03B5\u03C4\u03B1\u03B9\u03C1\u03B5\u03AF\u03B5\u03C2.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>\u039A\u03B1\u03B8\u03CE\u03C2 \u03BF \u03A0\u03B1\u03B3\u03BA\u03CC\u03C3\u03BC\u03B9\u03BF\u03C2 \u03AD\u03BB\u03B5\u03B3\u03C7\u03BF\u03C2 \u03B1\u03C0\u03BF\u03C1\u03C1\u03AE\u03C4\u03BF\u03C5 (GPC) \u03B1\u03C0\u03BF\u03C4\u03B5\u03BB\u03B5\u03AF \u03BD\u03AD\u03BF \u03C0\u03C1\u03CC\u03C4\u03C5\u03C0\u03BF, \u03BF\u03B9 \u03C0\u03B5\u03C1\u03B9\u03C3\u03C3\u03CC\u03C4\u03B5\u03C1\u03BF\u03B9 \u03B9\u03C3\u03C4\u03CC\u03C4\u03BF\u03C0\u03BF\u03B9 \u03B4\u03B5\u03BD \u03B8\u03B1 \u03C4\u03BF \u03B1\u03BD\u03B1\u03B3\u03BD\u03C9\u03C1\u03AF\u03B6\u03BF\u03C5\u03BD \u03B1\u03BA\u03CC\u03BC\u03B7, \u03C9\u03C3\u03C4\u03CC\u03C3\u03BF \u03B5\u03C1\u03B3\u03B1\u03B6\u03CC\u03BC\u03B1\u03C3\u03C4\u03B5 \u03C3\u03BA\u03BB\u03B7\u03C1\u03AC \u03CE\u03C3\u03C4\u03B5 \u03BD\u03B1 \u03B5\u03BE\u03B1\u03C3\u03C6\u03B1\u03BB\u03AF\u03C3\u03BF\u03C5\u03BC\u03B5 \u03CC\u03C4\u03B9 \u03B8\u03B1 \u03B3\u03AF\u03BD\u03B5\u03B9 \u03B1\u03C0\u03BF\u03B4\u03B5\u03BA\u03C4\u03CC \u03C0\u03B1\u03B3\u03BA\u03BF\u03C3\u03BC\u03AF\u03C9\u03C2.</b> \u03A9\u03C3\u03C4\u03CC\u03C3\u03BF, \u03BF\u03B9 \u03B9\u03C3\u03C4\u03CC\u03C4\u03BF\u03C0\u03BF\u03B9 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03C5\u03C0\u03BF\u03C7\u03C1\u03B5\u03C9\u03BC\u03AD\u03BD\u03BF\u03B9 \u03BD\u03B1 \u03B5\u03BD\u03B5\u03C1\u03B3\u03BF\u03CD\u03BD \u03BC\u03CC\u03BD\u03BF \u03C3\u03C4\u03BF\u03BD \u03B2\u03B1\u03B8\u03BC\u03CC \u03C0\u03BF\u03C5 \u03C4\u03BF\u03C5\u03C2 \u03C5\u03C0\u03BF\u03C7\u03C1\u03B5\u03CE\u03BD\u03BF\u03C5\u03BD \u03BF\u03B9 \u03B9\u03C3\u03C7\u03CD\u03BF\u03BD\u03C4\u03B5\u03C2 \u03BD\u03CC\u03BC\u03BF\u03B9.\xA0",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "\u03A0\u03C1\u03BF\u03C3\u03C4\u03B1\u03C3\u03AF\u03B1 email",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "\u0397 \u03B1\u03C5\u03C4\u03CC\u03BC\u03B1\u03C4\u03B7 \u03C3\u03C5\u03BC\u03C0\u03BB\u03AE\u03C1\u03C9\u03C3\u03B7 \u03B1\u03C0\u03B5\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03B9\u03AE\u03B8\u03B7\u03BA\u03B5",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: '\u0397 \u03B1\u03C5\u03C4\u03CC\u03BC\u03B1\u03C4\u03B7 \u03C3\u03C5\u03BC\u03C0\u03BB\u03AE\u03C1\u03C9\u03C3\u03B7 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03B5\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03B9\u03B7\u03BC\u03AD\u03BD\u03B7 \u03B3\u03B9\u03B1 \u03C4\u03BF\u03BD \u03C7\u03C1\u03AE\u03C3\u03C4\u03B7 <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "\u0394\u03B5\u03BD \u03AD\u03C7\u03BF\u03C5\u03BD \u03C0\u03C1\u03BF\u03C3\u03C4\u03B5\u03B8\u03B5\u03AF \u03BC\u03B7 \u03C0\u03C1\u03BF\u03C3\u03C4\u03B1\u03C4\u03B5\u03C5\u03BC\u03AD\u03BD\u03BF\u03B9 \u03B9\u03C3\u03C4\u03CC\u03C4\u03BF\u03C0\u03BF\u03B9",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "\u039C\u03B7 \u03C0\u03C1\u03BF\u03C3\u03C4\u03B1\u03C4\u03B5\u03C5\u03CC\u03BC\u03B5\u03BD\u03BF\u03B9 \u03B9\u03C3\u03C4\u03CC\u03C4\u03BF\u03C0\u03BF\u03B9",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "\u039F\u03B9 \u03B9\u03C3\u03C4\u03CC\u03C4\u03BF\u03C0\u03BF\u03B9 \u03B1\u03C5\u03C4\u03BF\u03AF \u03B4\u03B5\u03BD \u03B8\u03B1 \u03B5\u03BD\u03B9\u03C3\u03C7\u03C5\u03B8\u03BF\u03CD\u03BD \u03B1\u03C0\u03CC \u03C4\u03B7\u03BD \u03A0\u03C1\u03BF\u03C3\u03C4\u03B1\u03C3\u03AF\u03B1 \u03C0\u03C1\u03BF\u03C3\u03C9\u03C0\u03B9\u03BA\u03CE\u03BD \u03B4\u03B5\u03B4\u03BF\u03BC\u03AD\u03BD\u03C9\u03BD.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u03BC\u03B7 \u03C0\u03C1\u03BF\u03C3\u03C4\u03B1\u03C4\u03B5\u03C5\u03BC\u03AD\u03BD\u03BF\u03C5 \u03B9\u03C3\u03C4\u03CC\u03C4\u03BF\u03C0\u03BF\u03C5",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "\u0395\u03B9\u03C3\u03B1\u03B3\u03AC\u03B3\u03B5\u03C4\u03B5 \u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 URL",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 URL",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "\u03A4\u03BF \u03BA\u03BF\u03C5\u03BC\u03C0\u03AF Fire Button \u03B4\u03B9\u03B5\u03C5\u03BA\u03BF\u03BB\u03CD\u03BD\u03B5\u03B9 \u03C4\u03B7 \u03B4\u03B9\u03B1\u03B4\u03B9\u03BA\u03B1\u03C3\u03AF\u03B1 \u03B5\u03BA\u03BA\u03B1\u03B8\u03AC\u03C1\u03B9\u03C3\u03B7\u03C2 \u03C4\u03C9\u03BD \u03BA\u03B1\u03C1\u03C4\u03B5\u03BB\u03CE\u03BD, \u03C4\u03BF\u03C5 \u03B9\u03C3\u03C4\u03BF\u03C1\u03B9\u03BA\u03BF\u03CD \u03C0\u03B5\u03C1\u03B9\u03AE\u03B3\u03B7\u03C3\u03B7\u03C2 \u03BA\u03B1\u03B9 \u03C4\u03C9\u03BD \u03B4\u03B5\u03B4\u03BF\u03BC\u03AD\u03BD\u03C9\u03BD \u03C3\u03B1\u03C2. \u039C\u03C0\u03BF\u03C1\u03B5\u03AF\u03C4\u03B5 \u03BD\u03B1 \u03B5\u03BB\u03AD\u03B3\u03BE\u03B5\u03C4\u03B5 \u03B1\u03BD \u03B8\u03B1 \u03B4\u03B9\u03B1\u03B3\u03C1\u03AC\u03C8\u03B5\u03B9 \u03C4\u03BF \u03B9\u03C3\u03C4\u03BF\u03C1\u03B9\u03BA\u03CC \u03C0\u03B5\u03C1\u03B9\u03AE\u03B3\u03B7\u03C3\u03B7\u03C2 \u03BA\u03B1\u03B8\u03CE\u03C2 \u03BA\u03B1\u03B9 \u03C4\u03B1 \u03B4\u03B5\u03B4\u03BF\u03BC\u03AD\u03BD\u03B1 \u03BA\u03B1\u03B9 \u03B1\u03BD \u03B8\u03B1 \u03BA\u03BB\u03B5\u03AF\u03C3\u03B5\u03B9 \u03AE \u03CC\u03C7\u03B9 \u03C4\u03B9\u03C2 \u03C4\u03C1\u03AD\u03C7\u03BF\u03C5\u03C3\u03B5\u03C2 \u03BA\u03B1\u03C1\u03C4\u03AD\u03BB\u03B5\u03C2 \u03C3\u03B1\u03C2.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "\u0395\u03BA\u03BA\u03B1\u03B8\u03AC\u03C1\u03B9\u03C3\u03B7 \u03B9\u03C3\u03C4\u03BF\u03C1\u03B9\u03BA\u03BF\u03CD",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: "\u03A3\u03B7\u03BC\u03B5\u03AF\u03C9\u03C3\u03B7: \u03C4\u03BF \u03B9\u03C3\u03C4\u03BF\u03C1\u03B9\u03BA\u03CC \u03C0\u03B5\u03C1\u03B9\u03AE\u03B3\u03B7\u03C3\u03B7\u03C2 \u03BC\u03C0\u03BF\u03C1\u03B5\u03AF \u03BD\u03B1 \u03B4\u03B9\u03B1\u03B3\u03C1\u03B1\u03C6\u03B5\u03AF \u03BC\u03CC\u03BD\u03BF \u03B3\u03B9\u03B1 \u03AD\u03BD\u03B1 \u03C3\u03C5\u03B3\u03BA\u03B5\u03BA\u03C1\u03B9\u03BC\u03AD\u03BD\u03BF \u03C7\u03C1\u03BF\u03BD\u03B9\u03BA\u03CC \u03B4\u03B9\u03AC\u03C3\u03C4\u03B7\u03BC\u03B1 (\u03C0.\u03C7.  \xAB\u03C4\u03B5\u03BB\u03B5\u03C5\u03C4\u03B1\u03AF\u03B1 \u03CE\u03C1\u03B1\xBB, \u03AE \xAB\u03CC\u03BB\u03BF\xBB) \u03BA\u03B1\u03B9 \u03CC\u03C7\u03B9 \u03B1\u03BD\u03AC \u03C4\u03BF\u03C0\u03BF\u03B8\u03B5\u03C3\u03AF\u03B1.",
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "\u039A\u03BB\u03B5\u03AF\u03C3\u03B9\u03BC\u03BF \u03BA\u03B1\u03C1\u03C4\u03B5\u03BB\u03CE\u03BD",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "\u039A\u03AC\u03C8\u03B9\u03BC\u03BF \u03C3\u03B5 \u03B5\u03BE\u03AD\u03BB\u03B9\u03BE\u03B7...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/el/shared.json
  var shared_default5;
  var init_shared5 = __esm({
    "shared/locales/el/shared.json"() {
      shared_default5 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "\u039C\u03AC\u03B8\u03B5\u03C4\u03B5 \u03C0\u03B5\u03C1\u03B9\u03C3\u03C3\u03CC\u03C4\u03B5\u03C1\u03B1",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "\u0395\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03B7",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "\u0391\u03C0\u03B5\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03B7",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/en/feedback.json
  var feedback_default6;
  var init_feedback6 = __esm({
    "shared/locales/en/feedback.json"() {
      feedback_default6 = {
        smartling: {
          string_format: "icu",
          translate_paths: [{
            path: "*/title",
            key: "{*}/title",
            instruction: "*/note"
          }]
        },
        brokenSiteLabel: {
          title: "Which website is broken?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Copy and paste your URL",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "What do you love? What isn't working? How could the extension be improved?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "Which features or functionality does your feedback refer to? Please be as specific as possible.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "Submitting anonymous feedback helps us improve DuckDuckGo Privacy Essentials.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "I want to report a broken site",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Submit",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Describe the issue you encountered:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Which website content or functionality is broken? Please be as specific as possible.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "Thank you for your feedback!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Your broken site reports help our development team fix these breakages.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/en/options.json
  var options_default6;
  var init_options6 = __esm({
    "shared/locales/en/options.json"() {
      options_default6 = {
        smartling: {
          string_format: "icu",
          translate_paths: [{
            path: "*/title",
            key: "{*}/title",
            instruction: "*/note"
          }]
        },
        optionsHeader: {
          title: "DuckDuckGo Options",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "Search and browse the web without being tracked.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo protects your privacy online with\nprivate search,\ntracker blocking,\nand site encryption.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Share feedback",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Report broken site",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "Show embedded Tweets",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Global Privacy Control (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: `Your data shouldn't be for sale. At DuckDuckGo, we agree.
Activate the "Global Privacy Control" (GPC) settings and we'll
signal to websites your preference to:`,
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "Not sell your personal data.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "Limit sharing of your personal data to other companies.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>Since Global Privacy Control (GPC) is a new standard,\nmost websites won't recognize it yet, but we're working hard\nto ensure it becomes accepted worldwide.</b> However, websites are only required to act on the signal to the\nextent applicable laws compel them to do so.",
          note: "Explains to the user that we can communicate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "Email Protection",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Autofill disabled",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Autofill enabled for <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "No unprotected sites added",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Unprotected Sites",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "These sites will not be enhanced by Privacy Protection.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "Add unprotected site",
          note: "Header for the user to add a site to the unprotected list"
        },
        enterURL: {
          title: "Enter URL",
          note: "Prompt to enter the website URL here"
        },
        invalidURL: {
          title: "Invalid URL",
          note: "The URL the user entered is not a valid website address"
        },
        enableYoutubePreviews: {
          title: "Enable YouTube Previews",
          note: "Whether the user wants to see YouTube Previews on embedded videos or if all YouTube embedded videos are completely blocked by default"
        },
        enableYoutubePreviewsDesc: {
          title: "DuckDuckGo automatically blocks embedded YouTube videos, along with their title and preview, from being loaded to improve your privacy. You can choose to enable previews, but doing so will allow Google to see some of your device\u2019s information when you visit any page with an embedded video.&nbsp;",
          note: "Describes that DDG automatically blocks embedded YouTube videos to improve privacy, but users can choose to see the video preview and this will cause Google to see some device information"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature"
        },
        fireButtonDesc: {
          title: "The Fire Button makes it easy to clear your tabs, browsing history, and data. You can control whether it clears browsing history as well as data, and whether or not it closes your current tabs.",
          note: "Describes the Fire button features"
        },
        fireButtonClearHistoryTitle: {
          title: "Clear History",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: 'Please note: browsing history can be cleared only for a specified time range (e.g. "last hour", or "all time"), and not on a per-site basis.',
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Close Tabs",
          note: "Title for option toggle."
        },
        burnPageTitle: {
          title: "Burn in progress...",
          note: "Title of the page opened after starting the data clearing process. Indicates the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/en/shared.json
  var shared_default6;
  var init_shared6 = __esm({
    "shared/locales/en/shared.json"() {
      shared_default6 = {
        smartling: {
          string_format: "icu",
          translate_paths: [{
            path: "*/title",
            key: "{*}/title",
            instruction: "*/note"
          }]
        },
        options: {
          title: "Options",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "Learn more",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Enable",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Disable",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Add",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/es/feedback.json
  var feedback_default7;
  var init_feedback7 = __esm({
    "shared/locales/es/feedback.json"() {
      feedback_default7 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "\xBFQu\xE9 sitio web no funciona?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Copia y pega tu URL",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "\xBFQu\xE9 te encanta? \xBFQu\xE9 no funciona? \xBFC\xF3mo se podr\xEDa mejorar la extensi\xF3n?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "\xBFA qu\xE9 caracter\xEDsticas o funcionalidades se refieren tus comentarios? Concreta lo m\xE1ximo posible.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "Enviar comentarios an\xF3nimos nos ayuda a mejorar los esenciales de privacidad de DuckDuckGo.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "Quiero informar de un sitio da\xF1ado",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Enviar",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Describe el problema que has encontrado:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "\xBFQu\xE9 contenido o funcionalidad del sitio web no funciona? Concreta lo m\xE1ximo posible.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "\xA1Gracias por tus comentarios!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Los informes de sitios da\xF1ados ayudan a nuestro equipo de desarrollo a solucionar estas aver\xEDas.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/es/options.json
  var options_default7;
  var init_options7 = __esm({
    "shared/locales/es/options.json"() {
      options_default7 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "Opciones de DuckDuckGo",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "Busca y navega por la web sin que te rastreen.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo protege tu privacidad en l\xEDnea con\nb\xFAsquedas privadas, \nbloqueo de rastreadores\ny cifrado de sitios.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Compartir opiniones",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Informar de sitio web da\xF1ado",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "Mostrar tuits incrustados",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Control Global de Privacidad (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: "Tus datos no deber\xEDan estar a la venta. En DuckDuckGo, estamos de acuerdo.Activa la configuraci\xF3n de \xABControl Global de Privacidad\xBB (GPC) e\ninformaremos a los sitios web de que prefieres:",
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "No vender tus datos personales.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "Limitar el uso compartido de tus datos personales con otras empresas.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>Dado que el Control Global de Privacidad (GPC) es un nuevo est\xE1ndar,\nla mayor\xEDa de los sitios web no lo reconoce todav\xEDa, pero estamos trabajando\npara garantizar que se acepte en todo el mundo.</b> Sin embargo, solo se exige a los sitios web que act\xFAen conforme a esta indicaci\xF3n en la\nmedida en que lo dictamine la legislaci\xF3n aplicable.\xA0",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "Protecci\xF3n del correo electr\xF3nico",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Autocompletar desactivado",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Autocompletar habilitado para <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "No se han a\xF1adido sitios no protegidos",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Sitios no protegidos",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "La protecci\xF3n de privacidad est\xE1 deshabilitada para estos sitios.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "A\xF1adir sitio no protegido",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "Introducir URL",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "URL no v\xE1lida",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "El Fire Button facilita el borrado de tus pesta\xF1as, historial de navegaci\xF3n y datos. Puedes controlar si se borra el historial de navegaci\xF3n adem\xE1s de los datos y si se cierran o no tus pesta\xF1as actuales.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "Borrar historial",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: "Ten en cuenta que el historial de navegaci\xF3n solo se puede borrar para un intervalo de tiempo especificado (por ejemplo, \xAB\xFAltima hora\xBB, o \xABsiempre\xBB) y no en funci\xF3n del sitio web.",
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Cerrar pesta\xF1as",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "Quema en curso...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/es/shared.json
  var shared_default7;
  var init_shared7 = __esm({
    "shared/locales/es/shared.json"() {
      shared_default7 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Opciones",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "M\xE1s informaci\xF3n",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Activar",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Deshabilitar",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "A\xF1adir",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/et/feedback.json
  var feedback_default8;
  var init_feedback8 = __esm({
    "shared/locales/et/feedback.json"() {
      feedback_default8 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Milline veebisait on katki?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Kopeeri ja kleebi oma URL",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "Mis sulle meeldib? Mis ei t\xF6\xF6ta? Kuidas saaks laiendust paremaks muuta?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "Millistele omadustele v\xF5i funktsioonidele sinu tagasiside viitab? Palun ole v\xF5imalikult konkreetne.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "Anon\xFC\xFCmne tagasiside aitab meil DuckDuckGo Privacy Essentialsi t\xE4iustada.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "Tahan teatada mittet\xF6\xF6tavast saidist",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Esita",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Kirjelda ilmnenud probleemi:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Milline veebisaidi sisu v\xF5i funktsioon ei t\xF6\xF6ta? Palun ole v\xF5imalikult konkreetne.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "T\xE4name sind tagasiside eest!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Mittetoimivast saidist teatamine aitab meie arendustiimil neid probleeme k\xF5rvaldada.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/et/options.json
  var options_default8;
  var init_options8 = __esm({
    "shared/locales/et/options.json"() {
      options_default8 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "DuckDuckGo valikud",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "Otsi ja sirvi veebis ilma j\xE4lgimiseta.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo kaitseb sinu privaatsust veebis\nprivaatse otsingu,\nj\xE4lgimise blokeerimise,\nja saidi kr\xFCptimise abil.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Jaga tagasisidet",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Teata mittetoimivast saidist",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "N\xE4ita manustatud s\xE4utse",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "\xDCleilmne privaatsuskontroll (Global Privacy Control (GPC))",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: "Sinu andmeid ei ole m\xFC\xFCgiks DuckDuckGo n\xF5ustub sellega.Aktiveeri seadistus \u201E\xDCleilmne privaatsuskontroll\u201C (GPC) ja me anname veebisaitidele m\xE4rku sinu eelistusest:",
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "Sinu andmed ei ole m\xFC\xFCgiks.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "piirata sinu isikuandmete jagamist teiste ettev\xF5tetega.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>Kuna \xFClemaailmne privaatsuskontroll (GPC) on uus standard,\n ei tunne enamik veebisaite seda veel \xE4ra, kuid me t\xF6\xF6tame selle nimel, et seda aktsepteeritaks \xFCleilmselt.</b> Kuid veebisaidid peavad reageerima signaalile ainult niiv\xF5rd,\nkuiv\xF5rd kehtivad seadused neid selleks sunnivad.\xA0",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "E-posti kaitse",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Automaatne t\xE4itmine keelatud",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Automaatne t\xE4itmine on <strong class="js-userdata-container">{userName}</strong> jaoks lubatud',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Kaitseta saite ei ole lisatud",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Kaitseta saidid",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "Nendele saitidele ei laienePrivaatsuse kaitse.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "Kaitseta saidi lisamine",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "Sisestage URL",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "Vale URL",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "Fire Button teeb vahekaartide, sirvimisajaloo ja andmete kustutamise lihtsaks. Saad m\xE4\xE4rata, kas see kustutab nii sirvimisajaloo kui ka andmed ja kas see sulgeb sinu praegused vahekaardid v\xF5i mitte.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "Kustuta ajalugu",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: "Pane t\xE4hele: kustutada saab ainult m\xE4\xE4ratud ajavahemiku sirvimisajaloo (nt viimane tund v\xF5i kogu aeg) ning seda ei saa teha saidi kaupa.",
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Sule vahekaardid",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "T\xFChjendamine on k\xE4imas ...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/et/shared.json
  var shared_default8;
  var init_shared8 = __esm({
    "shared/locales/et/shared.json"() {
      shared_default8 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Valikud",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "Loe edasi",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Luba",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Keela",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Lisa",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/fi/feedback.json
  var feedback_default9;
  var init_feedback9 = __esm({
    "shared/locales/fi/feedback.json"() {
      feedback_default9 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Mik\xE4 verkkosivusto on viallinen?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Kopioi ja liit\xE4 URL",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "Mit\xE4 sin\xE4 rakastat? Mik\xE4 ei toimi? Miten laajennusta voitaisiin parantaa?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "Mihin ominaisuuksiin tai toimintoon palautteesi viitta? Kerro mahdollisimman tarkasti.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "L\xE4hett\xE4m\xE4ll\xE4 nimet\xF6nt\xE4 palautetta autat meit\xE4 parantamaan DuckDuckGo Privacy Essentialsia.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "Haluan ilmoittaa toimimattomasta sivustosta",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "L\xE4het\xE4",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Kuvaile kohtaamasi ongelmaa:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Mik\xE4 sivuston sis\xE4lt\xF6 tai toiminto ei toimi? Kerro mahdollisimman tarkasti.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "Kiitos palautteesta!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Ilmoittamalla toimimattomista sivustoista autat kehitystiimi\xE4mme korjaamaan viat.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/fi/options.json
  var options_default9;
  var init_options9 = __esm({
    "shared/locales/fi/options.json"() {
      options_default9 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "DuckDuckGo-asetukset",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "Tee hakuja ja selaile netti\xE4 ilman, ett\xE4 sinua seurataan.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo suojaa yksityisyytt\xE4si verkossa tarjoten\nyksityisen haun,\nseurannan eston\nja sivuston salauksen.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Jaa palaute",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Ilmoita viallisesta sivustosta",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "N\xE4yt\xE4 upotetut twiitit",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Global Privacy Control (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: 'Tietojesi ei pit\xE4isi olla myynniss\xE4. DuckDuckGo on samaa mielt\xE4.\nOta "Global Privacy Control" (GPC) -asetukset k\xE4ytt\xF6\xF6n, niin me\nkerromme verkkosivustoille, ett\xE4:',
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "ne eiv\xE4t saa myyd\xE4 henkil\xF6tietojasi.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "niiden t\xE4ytyy rajoittaa henkil\xF6tietojesi jakamista muille yrityksille.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>Koska Global Privacy Control (GPC) on uusi standardi,\nuseimmat verkkosivustot eiv\xE4t viel\xE4 tunnista sit\xE4, mutta teemme parhaamme, ett\xE4\nstandardi hyv\xE4ksytt\xE4isiin kaikkialla maailmassa.</b> Verkkosivujen t\xE4ytyy kuitenkin noudattaa kehotusta vain siin\xE4 laajuudessa kuin sovellettavat lait m\xE4\xE4r\xE4\xE4v\xE4t.",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "S\xE4hk\xF6postisuojaus",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Automaattinen t\xE4ytt\xF6 poistettu k\xE4yt\xF6st\xE4",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Automaattinen t\xE4ytt\xF6 k\xE4yt\xF6ss\xE4 osoitteessa <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Suojaamattomia sivustoja ei ole lis\xE4tty.",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Suojaamattomat sivustot",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "Yksityisyyden suoja ei paranna n\xE4it\xE4 sivustoja.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "Lis\xE4\xE4 suojaamaton sivusto",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "Kirjoita URL-osoite",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "Virheellinen URL-osoite",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire-painike",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "Fire Button -painikkeen avulla v\xE4lilehtien, selaushistorian ja tietojen tyhjent\xE4minen on helppoa. Voit hallita, tyhjennet\xE4\xE4nk\xF6 selaushistoria ja tiedot, ja suljetaanko nykyiset v\xE4lilehdet.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "Tyhjenn\xE4 historia",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: 'Huomaa: selaushistoria voidaan tyhjent\xE4\xE4 vain tietylt\xE4 ajanjaksolta (esim. "viime tunti" tai "kaikki"), eik\xE4 sivustokohtaisesti.',
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Sulje v\xE4lilehdet",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "Poltto k\xE4ynniss\xE4...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/fi/shared.json
  var shared_default9;
  var init_shared9 = __esm({
    "shared/locales/fi/shared.json"() {
      shared_default9 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Valinnat",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "Lue lis\xE4\xE4",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Ota k\xE4ytt\xF6\xF6n",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Poista K\xE4yt\xF6st\xE4",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Lis\xE4\xE4",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/fr/feedback.json
  var feedback_default10;
  var init_feedback10 = __esm({
    "shared/locales/fr/feedback.json"() {
      feedback_default10 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Quel site Web pose probl\xE8me\xA0?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Copiez et collez l'URL",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "Qu'avez-vous le plus appr\xE9ci\xE9\xA0? Qu'avez-vous le moins appr\xE9ci\xE9\xA0? Comment l'extension pourrait-elle \xEAtre am\xE9lior\xE9e\xA0?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "Sur quelles caract\xE9ristiques ou fonctionnalit\xE9s vos commentaires portent-ils\xA0? Veuillez pr\xE9ciser...",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "En r\xE9pondant \xE0 ce questionnaire anonyme, vous nous aiderez \xE0 am\xE9liorer DuckDuckGo Privacy Essentials.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "Je souhaite signaler un probl\xE8me rencontr\xE9 sur un site",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Envoyer",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "D\xE9crivez le probl\xE8me rencontr\xE9\xA0:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Quel \xE9l\xE9ment du site Web (contenu ou fonctionnalit\xE9) ne fonctionne pas\xA0? Veuillez pr\xE9ciser...",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "Merci pour vos commentaires.",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Vos signalements permettent \xE0 notre \xE9quipe D\xE9veloppement de r\xE9soudre ces probl\xE8mes.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/fr/options.json
  var options_default10;
  var init_options10 = __esm({
    "shared/locales/fr/options.json"() {
      options_default10 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "Options DuckDuckGo",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "Faites des recherches et naviguez sur le Web sans \xEAtre suivi.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo prot\xE8ge votre confidentialit\xE9 en ligne gr\xE2ce \xE0 la recherche priv\xE9e, au blocage des traqueurs et au cryptage de site.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Partager des commentaires",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Signaler un probl\xE8me de site",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "Afficher les tweets int\xE9gr\xE9s",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Global Privacy Control (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: "Vos donn\xE9es ne sont pas \xE0 vendre. C'est aussi la philosophie de DuckDuckGo.\nActivez les param\xE8tres \xAB\xA0Global Privacy Control\xA0\xBB (GPC) et nous indiquerons aux sites Web que vous leur demandez de\xA0:",
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "Ne pas vendre vos donn\xE9es personnelles.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "Limiter le partage de vos donn\xE9es personnelles avec d'autres entreprises.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>\xC9tant donn\xE9 que le Global Privacy Control (GPC) est une nouvelle norme, la plupart des sites Web ne la reconnaissent pas encore, mais nous mettons tout en \u0153uvre pour qu'elle soit reconnue dans le monde entier.</b> Cependant, les sites Web ne sont tenus de respecter cette demande que dans la mesure o\xF9 les lois applicables les y obligent.\xA0",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "Protection des e-mails",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Saisie automatique d\xE9sactiv\xE9e",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Saisie automatique activ\xE9e pour <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Aucun ajout de site non prot\xE9g\xE9",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Sites non prot\xE9g\xE9s",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "Les sites suivants ne b\xE9n\xE9ficient pas de la protection de la confidentialit\xE9.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "Ajouter un site non prot\xE9g\xE9",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "Saisissez une URL",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "URL non valide",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "Le Fire Button permet de supprimer facilement vos onglets, votre historique de navigation et vos donn\xE9es. Vous pouvez contr\xF4ler s'il efface l'historique de navigation ainsi que les donn\xE9es, et s'il ferme ou non vos onglets en cours.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "Effacer l'historique",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: "Remarque\xA0: l'historique de navigation ne peut \xEAtre effac\xE9 que sur une p\xE9riode sp\xE9cifi\xE9e (par exemple, \xAB\xA0derni\xE8re heure\xA0\xBB, ou \xAB\xA0depuis le d\xE9but\xA0\xBB) et non par site.",
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Fermer les onglets",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "\xC7a br\xFBle\xA0: effacement en cours...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/fr/shared.json
  var shared_default10;
  var init_shared10 = __esm({
    "shared/locales/fr/shared.json"() {
      shared_default10 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Options",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "En savoir plus",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Activer",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "D\xE9sactiver",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Ajouter",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/hr/feedback.json
  var feedback_default11;
  var init_feedback11 = __esm({
    "shared/locales/hr/feedback.json"() {
      feedback_default11 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Koje je web-mjesto neispravno?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Kopiraj i zalijepi svoj URL",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "\u0160to ti se svi\u0111a? \u0160to ne funkcionira kako treba? Kako bi se pro\u0161irenje moglo pobolj\u0161ati?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "Na koje se zna\u010Dajke ili funkcije odnose tvoje povratne informacije? Budi \u0161to precizniji.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "Slanje anonimnih povratnih informacija poma\u017Ee nam pobolj\u0161ati DuckDuckGo Privacy Essentials.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "\u017Delim prijaviti neispravnu stranicu/web lokaciju",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Po\u0161alji",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Opi\u0161i problem na koji si nai\u0161ao:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Koji je sadr\u017Eaj ili funkcija web stranice/lokacije neispravan? Budi \u0161to precizniji.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "Hvala ti na povratnim informacijama!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Tvoji izvje\u0161taji o neispravnim web stranicama/lokacijama poma\u017Eu na\u0161em razvojnom timu da popravi te probleme.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/hr/options.json
  var options_default11;
  var init_options11 = __esm({
    "shared/locales/hr/options.json"() {
      options_default11 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "DuckDuckGo mogu\u0107nosti",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "Pretra\u017Euj i pregledavaj mre\u017Eu bez pra\u0107enja.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo \u0161titi tvoju privatnost na mre\u017Ei koriste\u0107i\nprivatno pretra\u017Eivanje,\nblokiranje alata za pra\u0107enje\n i enkripcijom stranica.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Podijeli povratne informacije",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Prijavi neispravno web-mjesto",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "Poka\u017Ei ugra\u0111ene tweetove",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Globalna kontrola privatnosti (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: 'Tvoji podaci ne bi trebali biti na prodaju. Mi u DuckDuckGo mislimo isto.\nAktiviraj postavke "Globalne kontrole privatnosti" (GPC) i mi \u0107emo\nweb lokacijama signalizirati koje \u017Eeli\u0161:',
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "Ne prodavati svoje osobne podatke.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "Ograni\u010Diti dijeljenje osobnih podataka s drugim tvrtkama.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>Budu\u0107i da je Globalna kontrola privatnosti (GPC) novi standard,\nve\u0107ina web-mjesta jo\u0161 ga ne\u0107e prepoznati, ali naporno radimo na tome da postane prihva\u0107en u cijelom svijetu.</b> Me\u0111utim, web-mjesta moraju djelovati na signal samo u mjeri u kojoj ih obvezuju va\u017Ee\u0107i zakoni.",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "Za\u0161tita e-po\u0161te",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Automatsko popunjavanje onemogu\u0107eno",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Automatsko popunjavanje omogu\u0107eno za <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Nema dodanih neza\u0161ti\u0107enih web-mjesta",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Neza\u0161ti\u0107ena web-mjesta",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "Ova web-mjesta ne\u0107e biti unaprije\u0111ena za\u0161titom privatnosti.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "Dodavanje neza\u0161ti\u0107enog web-mjesta",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "Unesi URL",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "URL nije valjan",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "Fire Button olak\u0161ava brisanje kartica, povijesti pregledavanja i podataka. Mo\u017Ee\u0161 kontrolirati ho\u0107e li se izbrisati povijest pregledavanja i podaci te ho\u0107e li se zatvoriti tvoje aktualne (otvorene) kartice.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "Izbri\u0161i povijest",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: 'Imaj na umu: povijest pregledavanja mo\u017Ee se izbrisati samo za odre\u0111eni vremenski raspon (npr. "posljednji sat" ili "sve vrijeme"), a ne na temelju web lokacije.',
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Zatvori kartice",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "Brisanje u tijeku...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/hr/shared.json
  var shared_default11;
  var init_shared11 = __esm({
    "shared/locales/hr/shared.json"() {
      shared_default11 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Opcije",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "Saznajte vi\u0161e",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Omogu\u0107i",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Onemogu\u0107i",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Dodaj",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/hu/feedback.json
  var feedback_default12;
  var init_feedback12 = __esm({
    "shared/locales/hu/feedback.json"() {
      feedback_default12 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Melyik weboldal nem m\u0171k\xF6dik?\u201D",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "M\xE1sold ki \xE9s illeszd be az URL-t",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "Mi tetszik? Mi nem m\u0171k\xF6dik? Hogyan lehetne jav\xEDtani a b\u0151v\xEDtm\xE9nyen?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "Melyik funkci\xF3ra vagy jellemz\u0151re vonatkozik a visszajelz\xE9sed? \xCDrd le a lehet\u0151 legpontosabban.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "Az anonim visszajelz\xE9sek bek\xFCld\xE9se seg\xEDt a DuckDuckGo Privacy Essentials fejleszt\xE9s\xE9ben.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "Nem megfelel\u0151en m\u0171k\xF6d\u0151 webhelyet szeretn\xE9k jelenteni",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "K\xFCld\xE9s",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "\xCDrd le a probl\xE9m\xE1t, amibe belefutott\xE1l:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "A webhely mely tartalma vagy funkci\xF3ja nem m\u0171k\xF6dik megfelel\u0151en? \xCDrd le a lehet\u0151 legpontosabban.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "K\xF6sz\xF6nj\xFCk visszajelz\xE9st!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "A nem megfelel\u0151en m\u0171k\xF6d\u0151 webhelyekkel kapcsolatos bejelent\xE9sek seg\xEDtik fejleszt\u0151csapatunkat a hib\xE1k kijav\xEDt\xE1s\xE1ban.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/hu/options.json
  var options_default12;
  var init_options12 = __esm({
    "shared/locales/hu/options.json"() {
      options_default12 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "DuckDuckGo be\xE1ll\xEDt\xE1sok",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "Keress \xE9s b\xF6ng\xE9ssz az interneten an\xE9lk\xFCl, hogy nyomon k\xF6vetn\xE9nek.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "A DuckDuckGo priv\xE1t keres\xE9ssel, \nnyomk\xF6vet\u0151k blokkol\xE1s\xE1val,\n\xE9s webhelyek titkos\xEDt\xE1s\xE1val \nv\xE9di az adataidat online.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Visszajelz\xE9s megoszt\xE1sa",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Hib\xE1s weboldal jelent\xE9se",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "Be\xE1gyazott tweetek megjelen\xEDt\xE9se",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Nemzetk\xF6zi adatv\xE9delmi szab\xE1lyoz\xE1s (Global Privacy Control, GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: "Az adataidnak nem lenne szabad elad\xF3nak lenni\xFCk. A DuckDuckG\xF3n\xE1l mi egyet\xE9rt\xFCnk ezzel.\nAktiv\xE1ld a \u201EGlob\xE1lis adatv\xE9delmi szab\xE1lyoz\xE1s\u201D (GPC) be\xE1ll\xEDt\xE1st, \xE9s mi\njelezz\xFCk a webhelyeknek, hogy te a k\xF6vetkez\u0151ket szeretn\xE9d:",
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "Ne adj\xE1k el a szem\xE9lyes adataidat.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "Korl\xE1tozz\xE1k a szem\xE9lyes adataid megoszt\xE1s\xE1t m\xE1s v\xE1llalatokkal.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>Mivel a Nemzetk\xF6zi Adatv\xE9delmi Szab\xE1lyoz\xE1s (Global Privacy Control, GPC) \xFAj szabv\xE1ny,\na legt\xF6bb weboldal m\xE9g nem fogja felismerni, de kem\xE9nyen dolgozunk azon,\nhogy vil\xE1gszerte elfogadott\xE1 v\xE1ljon.</b> A weboldalaknak azonban csak olyan m\xE9rt\xE9kben kell eleget tenni\xFCk a k\xE9r\xE9snek, amennyire a hat\xE1lyos t\xF6rv\xE9nyek ezt megk\xF6vetelik t\u0151l\xFCk.\xA0",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "E-mail v\xE9delem",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Automatikus kit\xF6lt\xE9s letiltva",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Az automatikus kit\xF6lt\xE9s <strong class="js-userdata-container">{userName}</strong> sz\xE1m\xE1ra enged\xE9lyezve van.',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Nincsenek hozz\xE1adva v\xE9dtelen webhelyek",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "V\xE9delem n\xE9lk\xFCli weboldalak",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "Ezeket az oldalakat nem er\u0151s\xEDti adatv\xE9delem.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "V\xE9dtelen webhely hozz\xE1ad\xE1sa",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "URL megad\xE1sa",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "\xC9rv\xE9nytelen URL",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "T\u0171z gomb",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "A T\u0171z gombbal k\xF6nnyen t\xF6r\xF6lheted a lapokat, a b\xF6ng\xE9sz\xE9si el\u0151zm\xE9nyeket \xE9s az adatokat. Be\xE1ll\xEDthatod, hogy a b\xF6ng\xE9sz\xE9si el\u0151zm\xE9nyeket \xE9s az adatokat is t\xF6r\xF6lje-e, illetve hogy bez\xE1rja-e a jelenlegi lapokat is.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "El\u0151zm\xE9nyek t\xF6rl\xE9se",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: "Megjegyz\xE9s: a b\xF6ng\xE9sz\xE9si el\u0151zm\xE9nyek csak meghat\xE1rozott id\u0151tartamra vonatkoz\xF3an t\xF6r\xF6lhet\u0151k (pl. \u201Eel\u0151z\u0151 1 \xF3ra\u201D vagy \u201Eminden id\u0151pont\u201D), webhelyre vonatkoz\xF3an azonban nem.",
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Lapok bez\xE1r\xE1sa",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "El\xE9get\xE9s folyamatban\u2026",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/hu/shared.json
  var shared_default12;
  var init_shared12 = __esm({
    "shared/locales/hu/shared.json"() {
      shared_default12 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Opci\xF3k",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "Tov\xE1bbi r\xE9szletek",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Enged\xE9lyez\xE9s",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Letilt",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Hozz\xE1ad\xE1s",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/it/feedback.json
  var feedback_default13;
  var init_feedback13 = __esm({
    "shared/locales/it/feedback.json"() {
      feedback_default13 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Quale sito web \xE8 danneggiato?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Copia e incolla il tuo URL",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "Cosa ti piace? Cosa non sta funzionando? Come potrebbe essere migliorata l'estensione?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "A quali caratteristiche o funzionalit\xE0 fa riferimento il tuo feedback? Inserisci informazioni il pi\xF9 specifiche possibile.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "L'invio di feedback anonimi ci aiuta a migliorare DuckDuckGo Privacy Essentials.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "Voglio segnalare un sito danneggiato",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Invia",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Descrivi il problema riscontrato:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Quali contenuti o funzionalit\xE0 del sito Web non funzionano? Inserisci informazioni il pi\xF9 specifiche possibile.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "Grazie per il tuo feedback.",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Le segnalazioni del tuo sito non funzionante aiutano il nostro team di sviluppo a correggere le interruzioni.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/it/options.json
  var options_default13;
  var init_options13 = __esm({
    "shared/locales/it/options.json"() {
      options_default13 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "Opzioni di DuckDuckGo",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "Cerca e naviga sul Web senza che altri ti traccino.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo protegge la tua privacy online con\nnavigazione in incognito, \nblocco dei sistemi di tracciamento\ne crittografia del sito.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Condividi feedback",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Segnala sito danneggiato",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "Mostra tweet incorporati",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Global Privacy Control (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: `I tuoi dati non dovrebbero mai essere messi in vendita. Noi di DuckDuckGo ne siamo convinti.
Attiva l'impostazione "Global Privacy Control" (GPC) e
segnaleremo ai siti web di:`,
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "Non vendere i tuoi dati personali.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "Limitare la condivisione dei tuoi dati personali con altre aziende.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>Dal momento che il Global Privacy Control (GPC) rappresenta un nuovo standard,\nla maggior parte dei siti web ancora non lo riconosce, ma ci stiamo impegnando al massimo per assicurarci che venga accettato in tutto il mondo.</b> Tuttavia, i siti web sono tenuti a rispondere alla segnalazione esclusivamente nei limiti delle leggi pertinenti che li obbligano ad agire in tal senso.\xA0",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "Protezione email",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Compilazione automatica disabilitata",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Compilazione automatica abilitata per <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Non \xE8 stato aggiunto nessun sito non protetto",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Siti non protetti",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "Questi siti non saranno ottimizzati dalla tutela della privacy.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "Aggiungi sito non protetto",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "Inserisci URL",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "URL non valido",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "Il Fire button semplifica l'eliminazione delle schede, della cronologia di navigazione e dei dati. Puoi controllare se eliminare la cronologia di navigazione e i dati e se chiudere le schede correnti.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "Elimina cronologia",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: 'Nota: la cronologia di navigazione pu\xF2 essere eliminata solo per un intervallo di tempo specificato (ad es. "ultima ora" o "sempre") e non in base al sito.',
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Chiudi schede",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "Eliminazione in corso...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/it/shared.json
  var shared_default13;
  var init_shared13 = __esm({
    "shared/locales/it/shared.json"() {
      shared_default13 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Opzioni",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "Ulteriori informazioni",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Attiva",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Disabilita",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Aggiungi",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/lt/feedback.json
  var feedback_default14;
  var init_feedback14 = __esm({
    "shared/locales/lt/feedback.json"() {
      feedback_default14 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Kuri svetain\u0117 neveikia?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Nukopijuokite ir \u012Fklijuokite savo URL",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "K\u0105 m\u0117gstate? Kas neveikia? Kaip b\u016Bt\u0173 galima patobulinti pl\u0117tin\u012F?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "Su kokiomis funkcijomis ar funkcionalumu susij\u0119 j\u016Bs\u0173 atsiliepimai? Nurodykite kuo konkre\u010Diau.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "Anonimini\u0173 atsiliepim\u0173 pateikimas padeda mums tobulinti \u201EDuckDuckGo Privacy Essentials\u201C.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "Noriu prane\u0161ti apie neveikian\u010Di\u0105 svetain\u0119",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Pateikti",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Apra\u0161ykite problem\u0105, su kuria susid\u016Br\u0117te:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Kuris svetain\u0117s turinys ar funkcionalumas neveikia? Nurodykite kuo konkre\u010Diau.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "D\u0117kojame u\u017E atsiliepimus!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "J\u016Bs\u0173 prane\u0161imai apie neveikian\u010Dias svetaines padeda m\u016Bs\u0173 k\u016Br\u0117j\u0173 komandai i\u0161taisyti \u0161iuos gedimus.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/lt/options.json
  var options_default14;
  var init_options14 = __esm({
    "shared/locales/lt/options.json"() {
      options_default14 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "\u201EDuckDuckGo\u201C parinktys",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "Ie\u0161kokite ir nar\u0161ykite \u017Einiatinklyje nesekami.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "\u201EDuckDuckGo\u201C saugo j\u016Bs\u0173 privatum\u0105 internete naudodama\npriva\u010Di\u0105 paie\u0161k\u0105,\nsek\u0117j\u0173 blokavim\u0105\nir svetaini\u0173 \u0161ifravim\u0105.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Bendrinti atsiliepim\u0105",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Prane\u0161ti apie sugadint\u0105 svetain\u0119",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "Rodyti \u012Fterptas \u017Einutes",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Visuotin\u0117 privatumo kontrol\u0117 (VPK)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: "J\u016Bs\u0173 duomenys neturi b\u016Bti pardavin\u0117jami. Svetain\u0117je \u201EDuckDuckGo\u201C su tuo sutinkame.\n\u012Ejunkite Pasaulin\u0117s privatumo kontrol\u0117s (angl. \u201EGlobal Privacy Control\u201C, GPC) nustatymus ir mes\nsignalizuosime svetain\u0117ms, kurioms teikiate pirmenyb\u0119:",
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "Neparduodu savo asmens duomen\u0173.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "Apriboti j\u016Bs\u0173 asmens duomen\u0173 dalijim\u0105si su kitomis \u012Fmon\u0117mis.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>Kadangi visuotin\u0117 privatumo kontrol\u0117 (VPK) yra naujas standartas,\n daugelis svetaini\u0173 jo neatpa\u017E\u012Fsta, ta\u010Diau mes stengiam\u0117s u\u017Etikrinti,\n kad jis b\u016Bt\u0173 priimtas visame pasaulyje.</b> Ta\u010Diau svetain\u0117s turi veikti tik remiantis signalu tiek,\n kiek taikoma pagal taikytin\u0105 teis\u0119.\xA0",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "El. pa\u0161to apsauga",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "I\u0161jungtas automatinis pildymas",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: '\u012Ejungtas automatinis pildymas <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Neprid\u0117ta joki\u0173 neapsaugot\u0173 svetaini\u0173",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Neapsaugotos svetain\u0117s",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "\u0160i\u0173 svetaini\u0173 nepatobulins privatumo apsauga.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "Prid\u0117ti neapsaugot\u0105 svetain\u0119",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "\u012Eveskite URL adres\u0105",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "Netinkamas URL adresas",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Mygtukas \u201EFire\u201C",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "Mygtukas \u201EFire\u201C leid\u017Eia lengvai i\u0161valyti skirtukus, nar\u0161ymo istorij\u0105 ir duomenis. Galite nustatyti, ar jis i\u0161trina nar\u0161ymo istorij\u0105 ir duomenis ir ar u\u017Edaro esamus skirtukus.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "I\u0161valyti istorij\u0105",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: "Atkreipkite d\u0117mes\u012F: nar\u0161ymo istorij\u0105 galima i\u0161trinti tik nurodytam laiko intervalui (pvz., \u201Epaskutin\u0117 valanda\u201C arba \u201Eviso laiko\u201C), o ne pagal kiekvien\u0105 svetain\u0119.",
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "U\u017Edaryti skirtukus",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "Vyksta valymas...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/lt/shared.json
  var shared_default14;
  var init_shared14 = __esm({
    "shared/locales/lt/shared.json"() {
      shared_default14 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Parinktys",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "Su\u017Einoti daugiau",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "\u012Ejungti",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "I\u0161jungti",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Papildyti",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/lv/feedback.json
  var feedback_default15;
  var init_feedback15 = __esm({
    "shared/locales/lv/feedback.json"() {
      feedback_default15 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Kura vietne ir boj\u0101ta?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Kop\u0113 un iel\u012Bm\u0113 URL",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "Kas tev pat\u012Bk? Kas nedarbojas? K\u0101 \u0161o papla\u0161in\u0101jumu var\u0113tu uzlabot?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "Uz kur\u0101m iesp\u0113j\u0101m vai funkcionalit\u0101ti attiecas tavas atsauksmes? L\u016Bdzu, nor\u0101di p\u0113c iesp\u0113jas prec\u012Bz\u0101k.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "Anon\u012Bmu atsauksmju snieg\u0161ana pal\u012Bdz mums uzlabot DuckDuckGo Privacy Essentials.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "V\u0113los zi\u0146ot par vietni, kas nedarbojas pareizi",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Iesniegt",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Apraksti probl\u0113mu, ar kuru sask\u0101ries:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "K\u0101ds vietnes saturs vai funkcionalit\u0101te ir nedarbojas? L\u016Bdzu, nor\u0101di p\u0113c iesp\u0113jas prec\u012Bz\u0101k.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "Paldies par atsauksmi!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Tavi zi\u0146ojumi par vietn\u0113m, kas nedarbojas pareizi, pal\u012Bdz m\u016Bsu izstr\u0101d\u0101t\u0101ju komandai nov\u0113rst \u0161os darb\u012Bbas trauc\u0113jumus.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/lv/options.json
  var options_default15;
  var init_options15 = __esm({
    "shared/locales/lv/options.json"() {
      options_default15 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "DuckDuckGo opcijas",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "Mekl\u0113 un p\u0101rl\u016Bko t\u012Bmekli bez izseko\u0161anas.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo aizsarg\u0101 tavu priv\u0101tumu tie\u0161saist\u0113 ar\npriv\u0101to mekl\u0113\u0161anu,\nizsekot\u0101ju blo\u0137\u0113\u0161anu,\nun viet\u0146u \u0161ifr\u0113\u0161anu.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Sniegt atsauksmes",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Zi\u0146ot par boj\u0101tu vietni",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "R\u0101d\u012Bt iegultos tv\u012Btus",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Glob\u0101l\u0101 priv\u0101tuma kontrole\xA0(GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: 'Taviem datiem nav j\u0101k\u013C\u016Bst par preci. DuckDuckGo tam piekr\u012Bt.\nAktiviz\u0113 "Glob\u0101l\u0101s priv\u0101tuma parvald\u012B\u0161anas" (GPC) iestat\u012Bjumus, un m\u0113s\npazi\u0146osim t\u012Bmek\u013Ca vietn\u0113m tavu izv\u0113li:',
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "Nep\u0101rdot personas datus.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "Ierobe\u017Eot tavu personas datu kop\u012Bgo\u0161anu ar citiem uz\u0146\u0113mumiem.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>T\u0101 k\u0101 Glob\u0101l\u0101 priv\u0101tuma p\u0101rvald\u012B\u0161ana (GPC) ir jauns standarts,\nvairums viet\u0146u to v\u0113l neatpaz\u012Bs, ta\u010Du m\u0113s str\u0101d\u0101jam,\nlai nodro\u0161in\u0101tu, ka tas tiek pie\u0146emts vis\u0101 pasaul\u0113.</b> Tom\u0113r vietn\u0113m ir oblig\u0101ti j\u0101r\u012Bkojas tikai uz t\u0101m attiecin\u0101mo\xA0piem\u0113rojamo ties\u012Bbu aktu ietvaros.\xA0",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "E-pasta aizsardz\u012Bba",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Autom\u0101tisk\u0101 aizpild\u012B\u0161ana atsp\u0113jota",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Iesl\u0113gta autom\u0101tisk\u0101 aizpild\u012B\u0161ana lietot\u0101jam <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Nav pievienota neviena neaizsarg\u0101ta vietne",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Neaizsarg\u0101tas vietnes",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "\u0160\u012Bs vietnes netiks uzlabotas ar priv\u0101tuma aizsardz\u012Bbu.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "Pievienot neaizsarg\u0101tu vietni",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "Ievadi URL",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "Neder\u012Bgs URL",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "Nospie\u017Eot Fire Button, vari viegli not\u012Br\u012Bt cilnes, p\u0101rl\u016Bko\u0161anas v\u0113sturi un datus. Vari izv\u0113l\u0113ties, vai not\u012Br\u012Bt gan p\u0101rl\u016Bko\u0161anas v\u0113sturi, gan datus, k\u0101 ar\u012B to, vai aizv\u0113rt pa\u0161reiz\u0113j\u0101s cilnes.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "Not\u012Br\u012Bt v\u0113sturi",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: 'L\u016Bdzu, \u0146em v\u0113r\u0101: p\u0101rl\u016Bko\u0161anas v\u0113sturi var dz\u0113st tikai par noteiktu laika periodu (piem., "p\u0113d\u0113j\u0101 stunda" vai "visu laiku"), nevis katrai vietnei atsevi\u0161\u0137i.',
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Aizv\u0113rt cilnes",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "Notiek t\u012Br\u012B\u0161ana...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/lv/shared.json
  var shared_default15;
  var init_shared15 = __esm({
    "shared/locales/lv/shared.json"() {
      shared_default15 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Opcijas",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "Uzzin\u0101t vair\u0101k",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Iesp\u0113jot",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Atsl\u0113gt",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Pievienot",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/nb/feedback.json
  var feedback_default16;
  var init_feedback16 = __esm({
    "shared/locales/nb/feedback.json"() {
      feedback_default16 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Hvilket nettsted fungerer ikke?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Kopier og lim inn URL-adressen din",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "Hva liker du? Hva er det som ikke fungerer? Hvordan kan utvidelsen forbedres?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "Hvilke funksjoner gjelder tilbakemeldingen din? V\xE6r s\xE5 spesifikk som mulig.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "Anonyme tilbakemeldinger hjelper oss \xE5 forbedre DuckDuck GoPrivacy Essentials.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "Jeg vil rapportere en nettstedsfeil",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Send",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Beskriv problemet:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Hvilket nettstedsinnhold eller -funksjon er det som ikke virker som det skal? V\xE6r s\xE5 spesifikk som mulig.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "Takk for tilbakemeldingen!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Rapporter fra deg hjelper utviklingsteamet v\xE5rt \xE5 reparere disse feilene.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/nb/options.json
  var options_default16;
  var init_options16 = __esm({
    "shared/locales/nb/options.json"() {
      options_default16 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "DuckduckGo-alternativer",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "S\xF8k og surf p\xE5 nettet uten \xE5 bli sporet.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo beskytter personvernet ditt p\xE5 nettet med\nprivat s\xF8k,\n sporingsblokkering\nog nettstedskryptering.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Del tilbakemelding",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Rapporter nettstedfeil",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "Vis innebygde tweeter",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Global Privacy Control (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: "Opplysningene dine skal ikke v\xE6re til salgs. Hos DuckDuckGo deler vi denne oppfatningen.\nAktiver innstillingene for \xABGlobal Privacy Control\xBB (GPC), s\xE5\nsignaliserer vi preferansene dine til nettsteder for at de",
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "ikke skal selge dine personlige data.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "skal begrense deling av personopplysningene dine med andre selskaper.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>Siden Global Privacy Control (GPC) er en ny standard,\nanerkjennes den nok ikke av nettsteder flest enn\xE5, men vi jobber\nhardt for \xE5 s\xF8rge for at den blir godkjent over hele verden.</b> Mange nettsteder er imidlertid kun p\xE5lagt \xE5 ta dette signalet til f\xF8lge n\xE5r\ngjeldende lover p\xE5legger dem \xE5 gj\xF8re det.\xA0",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "E-postbeskyttelse",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Autofyll deaktivert",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Autofyll aktivert for <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Ingen ubeskyttede nettsteder er lagt til",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Ubeskyttede nettsteder",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "Disse nettstedene blir ikke dekket av personvernbeskyttelse.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "Legg til ubeskyttet nettsted",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "Skriv inn URL-adresse",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "Ugyldig URL-adresse",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "Fire Button gj\xF8r det enkelt \xE5 fjerne faner, nettleserhistorikk og data. Du kan kontrollere om den skal fjerne b\xE5de nettleserhistorikk og data, og hvorvidt den skal lukke \xE5pne faner.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "Fjern historikk",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: "Merk: Nettleserhistorikk kan bare fjernes for en angitt tidsperiode (f.eks. \xABden siste timen\xBB eller \xABall tid\xBB), og ikke per nettsted.",
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Lukk faner",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "Brenning p\xE5g\xE5r\u2026",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/nb/shared.json
  var shared_default16;
  var init_shared16 = __esm({
    "shared/locales/nb/shared.json"() {
      shared_default16 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Alternativer",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "Finn ut mer",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Aktiver",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Sl\xE5 av",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Legg til",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/nl/feedback.json
  var feedback_default17;
  var init_feedback17 = __esm({
    "shared/locales/nl/feedback.json"() {
      feedback_default17 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Welke website is defect?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Kopieer en plak je URL",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "Wat werkt er goed? Wat werkt er niet? Hoe kan de extensie worden verbeterd?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "Naar welke functies of functionaliteit verwijst je feedback? Wees zo specifiek mogelijk.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "Het indienen van anonieme feedback helpt ons om DuckDuckGo Privacy Essentials te verbeteren.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "Ik wil een defecte website melden",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Verzenden",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Beschrijf het probleem dat je hebt ondervonden:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Welke inhoud of functionaliteit van de website werkt niet goed? Wees zo specifiek mogelijk.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "Bedankt voor je feedback!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Door defecte websites te melden, help je ons ontwikkelteam om deze defecten te verhelpen.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/nl/options.json
  var options_default17;
  var init_options17 = __esm({
    "shared/locales/nl/options.json"() {
      options_default17 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "DuckDuckGo-opties",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "Zoek en surf op internet zonder te worden gevolgd.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo beschermt je privacy online met \n priv\xE9zoekopdrachten, \n trackerblokkering \n en websiteversleuteling.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Feedback delen",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Defecte website melden",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "Ingesloten tweets weergeven",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Global Privacy Control (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: "Je gegevens zouden niet mogen worden verhandeld. Bij DuckDuckGo zijn we het daarmee eens.Activeer de instellingen voor 'Global Privacy Control' (GPC). We zullen\n vervolgens aan websites je voorkeuren doorgeven om:",
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "Verkoop je persoonlijke gegevens niet.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "\u2022 Het delen van je persoonsgegevens met andere bedrijven te beperken.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>Global Privacy Control (GPC) is een nieuwe standaard.\n Daarom herkennen de meeste websites deze nog niet. We werken er hard aan om ervoor te zorgen dat GCP wereldwijd wordt geaccepteerd.</b> Maar websites zijn alleen verplicht om op dit signaal te reageren voor zover de toepasselijke wetgeving dat vereist.&nbsp;",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "E-mailbescherming",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Automatisch invullen uitgeschakeld",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Automatisch invullen ingeschakeld voor <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Geen onbeveiligde sites toegevoegd",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Onbeschermde sites",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "Deze sites worden niet beschermd met Privacybescherming.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "Onbeveiligde site toevoegen",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "URL invoeren",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "Ongeldige URL",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "Met de Fire Button kun je eenvoudig tabbladen, browsegeschiedenis en gegevens wissen. Je kunt bepalen of zowel de browsegeschiedenis als de gegevens worden gewist en of je huidige tabbladen worden gesloten of niet.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "Geschiedenis wissen",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: "Let op: de browsegeschiedenis kan alleen worden gewist voor een bepaald tijdsbereik (bijv. 'afgelopen uur' of 'altijd') en niet per website.",
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Tabbladen sluiten",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "Bezig met verbranden...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/nl/shared.json
  var shared_default17;
  var init_shared17 = __esm({
    "shared/locales/nl/shared.json"() {
      shared_default17 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Opties",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "Meer informatie",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Inschakelen",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Uitschakelen",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Toevoegen",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/pl/feedback.json
  var feedback_default18;
  var init_feedback18 = __esm({
    "shared/locales/pl/feedback.json"() {
      feedback_default18 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Kt\xF3ra witryna nie dzia\u0142a poprawnie?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Skopiuj i wklej adres URL",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "Co Ci si\u0119 podoba? Co nie dzia\u0142a? Jak mo\u017Cna ulepszy\u0107 rozszerzenie?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "Jakich cech lub funkcji dotyczy Twoja opinia? Podaj jak najdok\u0142adniejsze informacje.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "Przekazanie anonimowej opinii pomo\u017Ce nam udoskonali\u0107 rozszerzenie Privacy Essentials DuckDuckGo.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "Chc\u0119 zg\u0142osi\u0107 niedzia\u0142aj\u0105c\u0105 witryn\u0119",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Prze\u015Blij",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Opisz napotkany problem:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Kt\xF3ra zawarto\u015B\u0107 lub funkcja witryny nie dzia\u0142a? Podaj jak najdok\u0142adniejsze informacje.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "Dzi\u0119kujemy za opini\u0119!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Zg\u0142oszenia niedzia\u0142aj\u0105cych stron pomagaj\u0105 zespo\u0142owi programistycznemu naprawi\u0107 te b\u0142\u0119dy.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/pl/options.json
  var options_default18;
  var init_options18 = __esm({
    "shared/locales/pl/options.json"() {
      options_default18 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "Opcje DuckDuckGo",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "Przeszukuj i przegl\u0105daj Internet bez bez ryzyka, \u017Ce kto\u015B Ci\u0119 \u015Bledzi.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo chroni Twoj\u0105 prywatno\u015B\u0107 w sieci dzi\u0119ki prywatnemu wyszukiwaniu\n, blokowaniu skrypt\xF3w \u015Bledz\u0105cych\n\ni szyfrowaniu stron.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Podziel si\u0119 opini\u0105",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Zg\u0142o\u015B uszkodzon\u0105 witryn\u0119",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "Poka\u017C osadzone tweety",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Globalna Kontrola Prywatno\u015Bci (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: "Twoje dane nie s\u0105 na sprzeda\u017C. W DuckDuckGo w pe\u0142ni si\u0119 z tym zgadzamy. Aktywuj ustawienie \u201EGlobalna kontrola prywatno\u015Bci\u201D (GPC), a my przeka\u017Cemy witrynom Twoje preferencje:",
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "Nie sprzedawa\u0107 Twoich danych osobowych.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "Ogranicza\u0107 udost\u0119pnianie Twoich danych osobowych innym firmom.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>Poniewa\u017C Globalna Kontrola Prywatno\u015Bci (GPC) to nowy standard, wi\u0119kszo\u015B\u0107 witryn jeszcze go nie rozpoznaje, ale ci\u0119\u017Cko pracujemy nad tym, aby by\u0142 uznawany na ca\u0142ym \u015Bwiecie.</b> Witryny internetowe s\u0105 jednak zobowi\u0105zane do dzia\u0142ania na podstawie sygna\u0142u wy\u0142\u0105cznie w zakresie, w jakim jest to wymagane przez obowi\u0105zuj\u0105ce prawo.\xA0",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "Ochrona poczty e-mail",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Wy\u0142\u0105czono autouzupe\u0142nianie",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'W\u0142\u0105czono autouzupe\u0142nianie dla <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Nie dodano \u017Cadnych niezabezpieczonych witryn",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Niezabezpieczone witryny",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "Te witryny nie b\u0119d\u0105 ulepszane przez ochron\u0119 prywatno\u015Bci.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "Dodaj niezabezpieczon\u0105 witryn\u0119",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "Wprowad\u017A adres URL",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "Nieprawid\u0142owy adres URL",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "Przycisk Fire Button u\u0142atwia czyszczenie kart, historii przegl\u0105dania i danych. Mo\u017Cesz wybra\u0107, czy przycisk czy\u015Bci histori\u0119 przegl\u0105dania i dane i czy zamyka bie\u017C\u0105ce karty.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "Wyczy\u015B\u0107 histori\u0119",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: "Uwaga: histori\u0119 przegl\u0105dania mo\u017Cna wyczy\u015Bci\u0107 tylko dla okre\u015Blonego zakresu czasu (np. \u201Eostatnia godzina\u201D, lub \u201Eca\u0142y czas\u201D), a nie dla poszczeg\xF3lnych witryn.",
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Zamknij karty",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "Trwa czyszczenie...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/pl/shared.json
  var shared_default18;
  var init_shared18 = __esm({
    "shared/locales/pl/shared.json"() {
      shared_default18 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Opcje",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "Dowiedz si\u0119 wi\u0119cej",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "W\u0142\u0105cz",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Wy\u0142\u0105cz",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Dodaj",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/pt/feedback.json
  var feedback_default19;
  var init_feedback19 = __esm({
    "shared/locales/pt/feedback.json"() {
      feedback_default19 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Que site est\xE1 com falhas?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Copia e cola o URL",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "Do que gostas? O que n\xE3o funciona? Como podemos melhorar a extens\xE3o?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "O teu feedback diz respeito a que recursos ou funcionalidades? Especifica o mais poss\xEDvel.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "O feedback an\xF3nimo ajuda-nos a melhorar os DuckDuckGo Privacy Essentials.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "Quero comunicar um site com problemas",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Submeter",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Descreve o problema que encontraste:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Que conte\xFAdos ou funcionalidades do site t\xEAm problemas? Especifica o mais poss\xEDvel.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "Agradecemos o teu feedback!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Quando nos informas acerca de problemas em sites, ajudas a nossa equipa de programadores a corrigir os erros.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/pt/options.json
  var options_default19;
  var init_options19 = __esm({
    "shared/locales/pt/options.json"() {
      options_default19 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "Op\xE7\xF5es do DuckDuckGo",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "Pesquisa e navega na Internet sem deixares rasto.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "O DuckDuckGo protege a tua privacidade online com\npesquisa privada,\nbloqueio de trackers\ne encripta\xE7\xE3o de sites.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Partilhar coment\xE1rios",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Denunciar site danificado",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "Mostrar Tweets incorporados",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Controlo Global de Privacidade (CGP)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: 'Os teus dados n\xE3o s\xE3o para vender. \xC9 isto que a DuckDuckGo defende.\nAtiva as defini\xE7\xF5es do "Controlo de Privacidade Global" (GPC) para\nsinalizarmos aos sites que:',
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "N\xE3o devem vender os teus dados pessoais.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "\u2022 Devem limitar a partilha dos teus dados pessoais com outras empresas.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>Uma vez que o Controlo de Privacidade Global (GPC) \xE9 uma norma nova,\na maioria dos sites ainda n\xE3o o reconhecem. No entanto, estamos a trabalhar arduamente\npara que seja aceite em todo o mundo.</b> Por\xE9m, os sites s\xF3 t\xEAm de agir em conformidade com o sinal\nna medida em que a legisla\xE7\xE3o aplic\xE1vel os obrigar a isso.\xA0",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "Prote\xE7\xE3o de e-mail",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Preenchimento autom\xE1tico desativado",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Preenchimento autom\xE1tico ativado para <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Nenhum site desprotegido adicionado",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Sites desprotegidos",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "Estes sites n\xE3o ser\xE3o aprimorados pela Prote\xE7\xE3o de Privacidade.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "Adicionar site desprotegido",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "Introduz o URL",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "URL inv\xE1lido",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "O Fire Button facilita a limpeza de separadores, hist\xF3rico de navega\xE7\xE3o e dados. Pode decidir se limpa ou n\xE3o o hist\xF3rico de navega\xE7\xE3o e os dados, e se fecha ou n\xE3o os separadores atuais.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "Limpar hist\xF3rico",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: 'Nota: precisa de especificar um intervalo de tempo para limpar o hist\xF3rico de navega\xE7\xE3o (por exemplo, "\xFAltima hora" ou "sempre"), e n\xE3o \xE9 poss\xEDvel limpar s\xF3 para um site.',
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Fechar separadores",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "Apagamento em curso...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/pt/shared.json
  var shared_default19;
  var init_shared19 = __esm({
    "shared/locales/pt/shared.json"() {
      shared_default19 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Op\xE7\xF5es",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "Saiba mais",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Permitir",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Desabilitar (fora)",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Adicionar",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/ro/feedback.json
  var feedback_default20;
  var init_feedback20 = __esm({
    "shared/locales/ro/feedback.json"() {
      feedback_default20 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Ce site este defect?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Copiaz\u0103 \u0219i lipe\u0219te URL-ul",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "Ce \xEE\u021Bi place? Ce nu func\u021Bioneaz\u0103? Cum ar putea fi \xEEmbun\u0103t\u0103\u021Bit\u0103 extensia?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "La ce caracteristici sau func\u021Bii se refer\u0103 feedbackul t\u0103u? Furnizeaz\u0103 detalii c\xE2t mai specifice.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "Trimiterea de feedback anonim ne ajut\u0103 s\u0103 \xEEmbun\u0103t\u0103\u021Bim DuckDuckGo Privacy Essentials.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "Vreau s\u0103 raportez un site care nu func\u021Bioneaz\u0103 adecvat",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Trimite",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Descrie problema pe care ai \xEEnt\xE2lnit-o:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Ce con\u021Binut sau func\u021Bie a site-ului nu func\u021Bioneaz\u0103 adecvat? Furnizeaz\u0103 detalii c\xE2t mai specifice.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "\xCE\u021Bi mul\u021Bumim pentru feedback!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Rapoartele tale privind site-urile care nu func\u021Bioneaz\u0103 adecvat ajut\u0103 echipa noastr\u0103 de dezvoltare s\u0103 remedieze aceste probleme.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/ro/options.json
  var options_default20;
  var init_options20 = __esm({
    "shared/locales/ro/options.json"() {
      options_default20 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "Op\u021Biuni DuckDuckGo",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "Caut\u0103 \u0219i navigheaz\u0103 pe web f\u0103r\u0103 a fi urm\u0103rit.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo \xEE\u021Bi protejeaz\u0103 confiden\u021Bialitatea online cu \nc\u0103utarea privat\u0103,\nblocarea tehnologiilor de urm\u0103rire\n\u0219i criptarea site-urilor.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Partajeaz\u0103 feedback",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Raporteaz\u0103 site-ul defect",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "Afi\u0219eaz\u0103 tweeturi \xEEncorporate",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Global Privacy Control (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: "Datele tale nu ar trebui s\u0103 fie de v\xE2nzare. La DuckDuckGo, suntem de acord cu acest lucru.\nActiveaz\u0103 set\u0103rile \u201EControl global al confiden\u021Bialit\u0103\u021Bii\u201D (CGC) \u0219i noi vom \nsemnala site-urilor preferin\u021Bele tale de:",
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "a nu se vinde datele tale cu caracter personal.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "a se limita distribuirea datelor tale cu caracter personal c\u0103tre alte companii.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>\xCEntruc\xE2t controlul global al confiden\u021Bialit\u0103\u021Bii (CGC) este un standard nou,\n majoritatea site-urilor nu \xEEl vor recunoa\u0219te \xEEnc\u0103, \xEEns\u0103 ne str\u0103duim\ns\u0103 ne asigur\u0103m c\u0103 acesta va fi acceptat \xEEn \xEEntreaga lume.</b> Cu toate acestea, site-urile sunt obligate s\u0103 ac\u021Bioneze \xEEn virtutea semnalului\n\xEEn m\u0103sura \xEEn care legile aplicabile le oblig\u0103 s\u0103 fac\u0103 acest lucru.\xA0",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "Protec\u021Bia comunica\u021Biilor prin e-mail",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Completarea automat\u0103 este dezactivat\u0103",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Completarea automat\u0103 este activat\u0103 pentru <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Nu s-au ad\u0103ugat site-uri neprotejate",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Site-uri neprotejate",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "Aceste site-uri nu vor fi \xEEmbun\u0103t\u0103\u021Bite de protec\u021Bia confiden\u021Bialit\u0103\u021Bii.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "Adaug\u0103 un site neprotejat",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "Introdu adresa URL",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "URL nevalid",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "Fire Button faciliteaz\u0103 \u0219tergerea filelor, a istoricului de navigare \u0219i a datelor. Po\u021Bi controla dac\u0103 \u0219terge istoricul de navigare, precum \u0219i datele \u0219i dac\u0103 \xEEnchide sau nu filele curente.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "\u0218terge istoricul",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: "Re\u021Bine: istoricul de navigare poate fi \u0219ters numai pentru un interval specificat (de ex., \u201Eultima or\u0103\u201D sau \u201Etotdeauna\u201D) \u0219i nu \xEEn func\u021Bie de site.",
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "\xCEnchide filele",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "Ardere \xEEn curs...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/ro/shared.json
  var shared_default20;
  var init_shared20 = __esm({
    "shared/locales/ro/shared.json"() {
      shared_default20 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Op\u021Biuni",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "Afl\u0103 mai multe",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Activare",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Dezactiveaz\u0103",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Ad\u0103uga\u021Bi",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/ru/feedback.json
  var feedback_default21;
  var init_feedback21 = __esm({
    "shared/locales/ru/feedback.json"() {
      feedback_default21 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "\u041A\u0430\u043A\u043E\u0439 \u0441\u0430\u0439\u0442 \u043D\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "\u0421\u043A\u043E\u043F\u0438\u0440\u0443\u0439\u0442\u0435 \u0438 \u0432\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 \u0441\u0430\u0439\u0442\u0430",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "\u0427\u0442\u043E \u0432\u0430\u043C \u043D\u0440\u0430\u0432\u0438\u0442\u0441\u044F? \u0427\u0442\u043E \u043D\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442? \u041A\u0430\u043A \u043C\u043E\u0436\u043D\u043E \u0443\u043B\u0443\u0447\u0448\u0438\u0442\u044C \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u0435?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "\u041A \u043A\u0430\u043A\u0438\u043C \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044F\u043C \u0438\u043B\u0438 \u0444\u0443\u043D\u043A\u0446\u0438\u044F\u043C \u043E\u0442\u043D\u043E\u0441\u0438\u0442\u0441\u044F \u0432\u0430\u0448 \u043E\u0442\u0437\u044B\u0432? \u041F\u043E\u0441\u0442\u0430\u0440\u0430\u0439\u0442\u0435\u0441\u044C \u043E\u0442\u0432\u0435\u0442\u0438\u0442\u044C \u043A\u0430\u043A \u043C\u043E\u0436\u043D\u043E \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u0435\u0435.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "\u0410\u043D\u043E\u043D\u0438\u043C\u043D\u044B\u0435 \u043E\u0442\u0437\u044B\u0432\u044B \u043F\u043E\u043C\u043E\u0433\u0430\u044E\u0442 \u043D\u0430\u043C \u0443\u043B\u0443\u0447\u0448\u0438\u0442\u044C DuckDuckGo Privacy Essentials.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "\u0421\u043E\u043E\u0431\u0449\u0438\u0442\u044C \u043E \u043D\u0435\u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0449\u0435\u043C \u0441\u0430\u0439\u0442\u0435",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "\u041E\u043F\u0438\u0448\u0438\u0442\u0435 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0443, \u0441 \u043A\u043E\u0442\u043E\u0440\u043E\u0439 \u0432\u044B \u0441\u0442\u043E\u043B\u043A\u043D\u0443\u043B\u0438\u0441\u044C:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "\u0421 \u043A\u0430\u043A\u0438\u043C\u0438 \u043A\u043E\u043D\u0442\u0435\u043D\u0442\u043E\u043C \u0438\u043B\u0438 \u0444\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u043E\u043C \u0441\u0430\u0439\u0442\u0430 \u0432\u043E\u0437\u043D\u0438\u043A\u043B\u0438 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u044B? \u041F\u043E\u0441\u0442\u0430\u0440\u0430\u0439\u0442\u0435\u0441\u044C \u043E\u0442\u0432\u0435\u0442\u0438\u0442\u044C \u043A\u0430\u043A \u043C\u043E\u0436\u043D\u043E \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u0435\u0435.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "\u0411\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u0438\u043C \u0432\u0430\u0441 \u0437\u0430 \u043E\u0442\u0437\u044B\u0432!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "\u0412\u0430\u0448\u0438 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u043E \u043D\u0435\u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0449\u0438\u0445 \u0441\u0430\u0439\u0442\u0430\u0445 \u043F\u043E\u043C\u043E\u0433\u0430\u044E\u0442 \u043D\u0430\u0448\u0438\u043C \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0430\u043C \u0443\u0441\u0442\u0440\u0430\u043D\u044F\u0442\u044C \u043D\u0435\u043F\u043E\u043B\u0430\u0434\u043A\u0438.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/ru/options.json
  var options_default21;
  var init_options21 = __esm({
    "shared/locales/ru/options.json"() {
      options_default21 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B DuckDuckGo",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "\u041F\u043E\u0438\u0441\u043A \u0438 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0418\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0430 \u0431\u0435\u0437 \u043E\u0442\u0441\u043B\u0435\u0436\u0438\u0432\u0430\u043D\u0438\u044F.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "\u0427\u0442\u043E\u0431\u044B \u0437\u0430\u0449\u0438\u0442\u0438\u0442\u044C \u0432\u0430\u0448\u0438 \u0434\u0430\u043D\u043D\u044B\u0435 \u0432 \u0418\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0435, DuckDuckGo \u043F\u0440\u0435\u0434\u043B\u0430\u0433\u0430\u0435\u0442 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0439 \u043F\u043E\u0438\u0441\u043A, \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0443 \u0442\u0440\u0435\u043A\u0435\u0440\u043E\u0432 \u0438 \u0448\u0438\u0444\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F \u0441 \u0441\u0430\u0439\u0442\u0430\u043C\u0438.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043E\u0442\u0437\u044B\u0432",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "\u0421\u043E\u043E\u0431\u0449\u0438\u0442\u044C \u043E \u043D\u0435\u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0449\u0435\u043C \u0441\u0430\u0439\u0442\u0435",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0432\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u044B\u0435 \u0442\u0432\u0438\u0442\u044B",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "\u0413\u043B\u043E\u0431\u0430\u043B\u044C\u043D\u044B\u0439 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438 (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: "\u041B\u0438\u0447\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u043D\u0435 \u0434\u043E\u043B\u0436\u043D\u044B \u043F\u0440\u043E\u0434\u0430\u0432\u0430\u0442\u044C\u0441\u044F. \u041C\u044B, \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0438 DuckDuckGo, \u0441 \u044D\u0442\u0438\u043C \u043F\u043E\u043B\u043D\u043E\u0441\u0442\u044C\u044E \u0441\u043E\u0433\u043B\u0430\u0441\u043D\u044B.\n\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0443 \xAB\u0413\u043B\u043E\u0431\u0430\u043B\u044C\u043D\u044B\u0439 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438\xBB (Global Privacy Control \u0438\u043B\u0438 GPC), \u0438 \u043C\u044B \u043F\u0435\u0440\u0435\u0434\u0430\u0434\u0438\u043C \u0441\u0430\u0439\u0442\u0430\u043C \u0432\u0430\u0448\u0438 \u043F\u0440\u0435\u0434\u043F\u043E\u0447\u0442\u0435\u043D\u0438\u044F:",
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "\u041D\u0435 \u043F\u0440\u043E\u0434\u0430\u0432\u0430\u0442\u044C \u0432\u0430\u0448\u0438 \u043B\u0438\u0447\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "\u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0438\u0442\u044C \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0443 \u0432\u0430\u0448\u0438\u0445 \u043B\u0438\u0447\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u0440\u0443\u0433\u0438\u043C \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044F\u043C",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>\u041F\u043E\u0441\u043A\u043E\u043B\u044C\u043A\u0443 \u0433\u043B\u043E\u0431\u0430\u043B\u044C\u043D\u044B\u0439 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438 (GPC) \u2014 \u043D\u043E\u0432\u044B\u0439 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442, \u043F\u043E\u043A\u0430 \u0447\u0442\u043E \u043E\u043D \u043D\u0435 \u043F\u0440\u0438\u0437\u043D\u0430\u0451\u0442\u0441\u044F \u043D\u0430 \u0431\u043E\u043B\u044C\u0448\u0438\u043D\u0441\u0442\u0432\u0435 \u0441\u0430\u0439\u0442\u043E\u0432, \u043D\u043E \u043C\u044B \u043F\u0440\u0438\u043B\u0430\u0433\u0430\u0435\u043C \u0432\u0441\u0435 \u0443\u0441\u0438\u043B\u0438\u044F, \u0447\u0442\u043E\u0431\u044B \u043E\u043D \u0431\u044B\u043B \u043F\u0440\u0438\u043D\u044F\u0442 \u0432\u043E \u0432\u0441\u0451\u043C \u043C\u0438\u0440\u0435.</b> \u0422\u0430\u043A\u0436\u0435 \u0445\u043E\u0442\u0438\u043C \u043F\u043E\u0434\u0447\u0435\u0440\u043A\u043D\u0443\u0442\u044C, \u0447\u0442\u043E \u0441\u0430\u0439\u0442\u044B \u043E\u0431\u044F\u0437\u0430\u043D\u044B \u0440\u0435\u0430\u0433\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043D\u0430 \u0441\u0438\u0433\u043D\u0430\u043B \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u0442\u043E\u0439 \u043C\u0435\u0440\u0435, \u0432 \u043A\u0430\u043A\u043E\u0439 \u044D\u0442\u043E \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u043F\u0440\u0438\u043C\u0435\u043D\u0438\u043C\u043E\u0435 \u0437\u0430\u043A\u043E\u043D\u043E\u0434\u0430\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u043E.",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "\u0417\u0430\u0449\u0438\u0442\u0430 \u044D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u043E\u0439 \u043F\u043E\u0447\u0442\u044B",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "\u0410\u0432\u0442\u043E\u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: '\u0412\u043A\u043B\u044E\u0447\u0435\u043D\u043E \u0430\u0432\u0442\u043E\u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 \u0434\u043B\u044F <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "\u041D\u0435\u0437\u0430\u0449\u0438\u0449\u0451\u043D\u043D\u044B\u0435 \u0441\u0430\u0439\u0442\u044B \u043D\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u044B",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "\u041D\u0435\u0437\u0430\u0449\u0438\u0449\u0451\u043D\u043D\u044B\u0435 \u0441\u0430\u0439\u0442\u044B",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "\u0421\u0430\u0439\u0442\u044B \u0431\u0435\u0437 \u0437\u0430\u0449\u0438\u0442\u044B \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u0435\u0437\u0430\u0449\u0438\u0449\u0451\u043D\u043D\u044B\u0439 \u0441\u0430\u0439\u0442",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 URL",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u044B\u0439 URL",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "\u041A\u043D\u043E\u043F\u043A\u0430 Fire Button (\xAB\u0422\u0440\u0435\u0432\u043E\u0433\u0430\xBB) \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u043C\u043E\u043C\u0435\u043D\u0442\u0430\u043B\u044C\u043D\u043E \u0437\u0430\u043A\u0440\u044B\u0442\u044C \u0432\u043A\u043B\u0430\u0434\u043A\u0438 \u0438 \u043E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0438\u0441\u0442\u043E\u0440\u0438\u044E \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u043E\u0432 \u0438 \u0434\u0430\u043D\u043D\u044B\u0435 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430. \u041F\u0440\u0435\u0434\u0443\u0441\u043C\u043E\u0442\u0440\u0435\u043D\u0430 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439 \u043F\u0440\u0438 \u043D\u0430\u0436\u0430\u0442\u0438\u0438 \u043A\u043D\u043E\u043F\u043A\u0438: \u043E\u0447\u0438\u0441\u0442\u043A\u0430 \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u043E\u0432, \u0434\u0430\u043D\u043D\u044B\u0445 \u0438 \u0437\u0430\u043A\u0440\u044B\u0442\u0438\u0435 \u0442\u0435\u043A\u0443\u0449\u0438\u0445 \u0432\u043A\u043B\u0430\u0434\u043E\u043A.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0438\u0441\u0442\u043E\u0440\u0438\u044E",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: "\u041F\u0440\u0438\u043C\u0438\u0442\u0435 \u0432\u043E \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u0435. \u0447\u0442\u043E \u0438\u0441\u0442\u043E\u0440\u0438\u044E \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u043E\u0432 \u043C\u043E\u0436\u043D\u043E \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0437\u0430 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0451\u043D\u043D\u044B\u0439 \u043F\u0435\u0440\u0438\u043E\u0434 (\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, \xAB\u0437\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u0447\u0430\u0441\xBB \u0438\u043B\u0438 \xAB\u0437\u0430 \u0432\u0441\u0451 \u0432\u0440\u0435\u043C\u044F\xBB), \u0430 \u043D\u0435 \u0432 \u043E\u0442\u043D\u043E\u0448\u0435\u043D\u0438\u0438 \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u043E\u0433\u043E \u0441\u0430\u0439\u0442\u0430.",
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0432\u043A\u043B\u0430\u0434\u043A\u0438",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "\u0421\u0436\u0438\u0433\u0430\u0435\u043C \u0434\u0430\u043D\u043D\u044B\u0435...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/ru/shared.json
  var shared_default21;
  var init_shared21 = __esm({
    "shared/locales/ru/shared.json"() {
      shared_default21 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "\u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/sk/feedback.json
  var feedback_default22;
  var init_feedback22 = __esm({
    "shared/locales/sk/feedback.json"() {
      feedback_default22 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Ktor\xE1 webov\xE1 lokalita je nefunk\u010Dn\xE1?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Skop\xEDrujte a prilepte URL adresu",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "\u010Co sa v\xE1m p\xE1\u010Di? \u010Co nefunguje? Ako by sa dalo roz\u0161\xEDrenie zlep\u0161i\u0165?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "Ktor\xFDch vlastnost\xED alebo funkci\xED sa t\xFDka va\u0161a sp\xE4tn\xE1 v\xE4zba? Bu\u010Fte \u010Do najkonkr\xE9tnej\u0161\xED.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "Odosielanie anonymnej sp\xE4tnej v\xE4zby n\xE1m pom\xE1ha zlep\u0161ova\u0165 DuckDuckGo Privacy Essentials.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "Chcem nahl\xE1si\u0165 nefunk\u010Dn\xFA lokalitu",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Odosla\u0165",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Op\xED\u0161te probl\xE9m, s ktor\xFDm ste sa stretli:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Ak\xFD obsah alebo ak\xE1 funk\u010Dnos\u0165 webovej lokality je nefunk\u010Dn\xE1? Bu\u010Fte \u010Do najkonkr\xE9tnej\u0161\xED.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "\u010Eakujeme za va\u0161u sp\xE4tn\xFA v\xE4zbu!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Va\u0161e hl\xE1senia o nefunk\u010Dn\xFDch lokalit\xE1ch pom\xE1haj\xFA n\xE1\u0161mu v\xFDvojov\xE9mu t\xEDmu tieto chyby opravi\u0165.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/sk/options.json
  var options_default22;
  var init_options22 = __esm({
    "shared/locales/sk/options.json"() {
      options_default22 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "Mo\u017Enosti DuckDuckGo",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "Vyh\u013Ead\xE1vajte a prehliadajte web bez toho, aby v\xE1s sledovali.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo chr\xE1ni va\u0161e s\xFAkromie online pomocou\ns\xFAkromn\xE9ho vyh\u013Ead\xE1vania,\n blokovania sledovania \na \u0161ifrovania lokal\xEDt.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Zdie\u013Ea\u0165 sp\xE4tn\xFA v\xE4zbu",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Nahl\xE1si\u0165 nefunk\u010Dn\xFA lokalitu",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "Zobrazi\u0165 vlo\u017Een\xE9 tweety",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Glob\xE1lna kontrola s\xFAkromia (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: "Va\u0161e \xFAdaje nesm\xFA by\u0165 na predaj. V\xA0DuckDuckGo s\xA0t\xFDm s\xFAhlas\xEDme. Aktivujte nastavenia \u201EGlob\xE1lne ovl\xE1danie ochrany s\xFAkromia\u201D (GPC) a my budeme\nsignalizova\u0165 webov\xFDm lokalit\xE1m va\u0161e preferencie, aby:",
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "nepred\xE1vali va\u0161e osobn\xE9 \xFAdaje,",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "obmedzili zdie\u013Eanie va\u0161ich osobn\xFDch \xFAdajov s\xA0in\xFDmi spolo\u010Dnos\u0165ami.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>Preto\u017Ee \u201EGlob\xE1lne ovl\xE1danie ochrany s\xFAkromia\u201D (GPC) je nov\xFDm \u0161tandardom,\nv\xE4\u010D\u0161ina webov\xFDch str\xE1nok ho e\u0161te nerozpozn\xE1, ale usilovne pracujeme na tom,\naby sa stal celosvetovo akceptovan\xFDm.</b> Od webov\xFDch str\xE1nok sa v\u0161ak vy\u017Eaduje, aby konali na z\xE1klade sign\xE1lu\niba v rozsahu, v akom to od nich vy\u017Eaduj\xFA pr\xEDslu\u0161n\xE9 z\xE1kony.",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "Ochrana e-mailu",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Automatick\xE9 vyp\u013A\u0148anie je vypnut\xE9",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Automatick\xE9 vyp\u013A\u0148anie je povolen\xE9 pre <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Neboli pridan\xE9 \u017Eiadne nechr\xE1nen\xE9 lokality",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Nezabezpe\u010Den\xE9 webov\xE9 str\xE1nky",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "Tieto webov\xE9 str\xE1nky nebud\xFA roz\u0161\xEDren\xE9 o ochranu s\xFAkromia.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "Pridanie nechr\xE1nenej lokality",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "Zadajte adresu URL",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "Neplatn\xE1 adresa URL",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "Tla\u010Didlo Fire Button u\u013Eah\u010Duje vymazanie kariet, hist\xF3rie prehliadania a\xA0\xFAdajov. M\xF4\u017Eete ovl\xE1da\u0165, \u010Di vyma\u017Ee hist\xF3riu prehliadania aj \xFAdaje a\xA0\u010Di sa zatvoria aktu\xE1lne karty.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "Vymaza\u0165 hist\xF3riu",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: "Upozornenie: hist\xF3riu prehliadania mo\u017Eno vymaza\u0165 len pre konkr\xE9tne obdobie (napr. za posledn\xFA hodinu alebo za cel\xE9 obdobie), nie pre jednotliv\xE9 weby.",
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Zatvori\u0165 karty",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "Prebieha vymaz\xE1vanie...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/sk/shared.json
  var shared_default22;
  var init_shared22 = __esm({
    "shared/locales/sk/shared.json"() {
      shared_default22 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Mo\u017Enosti",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "Zistite viac",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Povoli\u0165",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Zak\xE1za\u0165",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Prida\u0165",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/sl/feedback.json
  var feedback_default23;
  var init_feedback23 = __esm({
    "shared/locales/sl/feedback.json"() {
      feedback_default23 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Katera spletna stran je po\u0161kodovana?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Kopirajte in prilepite svoj URL",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "Kaj vam je v\u0161e\u010D? Kaj ne deluje? Kako bi lahko raz\u0161iritev izbolj\u0161ali?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "Na katere funkcije ali funkcionalnosti se nana\u0161ajo va\u0161e povratne informacije? Bodite \u010Dim bolj natan\u010Dni.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "Po\u0161iljanje anonimnih povratnih informacij nam pomaga izbolj\u0161ati raz\u0161iritev DuckDuckGo Privacy Essentials.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "\u017Delim prijaviti nedelujo\u010De spletno mesto",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Po\u0161lji",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Opi\u0161ite te\u017Eavo, na katero ste naleteli:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Katera vsebina ali funkcionalnost spletnega mesta ne deluje? Bodite \u010Dim bolj natan\u010Dni.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "Zahvaljujemo se vam za povratne informacije!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Va\u0161a poro\u010Dila o nedelujo\u010Dih spletnih mestih pomagajo na\u0161i razvojni ekipi pri odpravljanju teh napak.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/sl/options.json
  var options_default23;
  var init_options23 = __esm({
    "shared/locales/sl/options.json"() {
      options_default23 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "Mo\u017Enosti DuckDuckGo",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "I\u0161\u010Dite in brskajte po spletu brez sledenja.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo varuje va\u0161o zasebnost na spletu z\nzasebnim iskanjem,\nblokiranjem sledilnikov\nin \u0161ifriranjem spletnih mest.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Deli povratne informacije",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Prijavite po\u0161kodovano spletno mesto",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "Prika\u017Ei vdelane tvite",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Globalni nadzor zasebnosti (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: "Va\u0161i podatki ne bi smeli biti naprodaj. Pri DuckDuckGo se strinjamo.\nAktivirajte nastavitve \xBBGlobal Privacy Control\xAB (GPC) in spletnim mestom bomo\nsporo\u010Dili va\u0161e \u017Eelje:",
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "Ne prodajajte svojih osebnih podatkov.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "\u2022 Omejite skupno rabo svojih osebnih podatkov z drugimi podjetji.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>Ker je globalni nadzor zasebnosti (Global Privacy Control (GPC)) nov standard, ga \n\nve\u010Dina spletnih mest \u0161e ne prepozna, vendar si mo\u010Dno \nprizadevamo, da bi bil sprejet po vsem svetu.</b> Vendar morajo spletna mesta na podlagi signala ukrepati le v \nskladu z veljavnimi zakoni.\xA0",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "Za\u0161\u010Dita e-po\u0161te",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Samodejno izpolnjevanje je onemogo\u010Deno",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Omogo\u010Deno samodejno izpolnjevanje za uporabnika <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Ni dodanih neza\u0161\u010Ditenih spletnih mest",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Neza\u0161\u010Ditene strani",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "Varnost teh strani se z za\u0161\u010Dito zasebnosti ne bo izbolj\u0161ala.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "Dodajte neza\u0161\u010Diteno spletno mesto",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "Vnesite URL",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "Neveljaven URL",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "Z gumbom Fire Button lahko preprosto zaprete zavihke, po\u010Distite zgodovino brskanja in podatke. Dolo\u010Dite lahko, ali \u017Eelite po\u010Distiti zgodovino brskanja in podatke ter ali naj se zaprejo trenutni zavihki.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "Izbri\u0161i zgodovino",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: "Upo\u0161tevajte: Zgodovino brskanja lahko po\u010Distite le za dolo\u010Deno \u010Dasovno obdobje (npr.  \xBBzadnjo uro\xAB ali \xBBod za\u010Detka\xAB), in ne na podlagi posameznega spletnega mesta.",
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Zapri zavihke",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "Poteka brisanje ...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/sl/shared.json
  var shared_default23;
  var init_shared23 = __esm({
    "shared/locales/sl/shared.json"() {
      shared_default23 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Mo\u017Enosti",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "Ve\u010D",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Omogo\u010Di",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Onemogo\u010Di",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Dodaj",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/sv/feedback.json
  var feedback_default24;
  var init_feedback24 = __esm({
    "shared/locales/sv/feedback.json"() {
      feedback_default24 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Vilken webbplats \xE4r skadad?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "Kopiera och klistra in webbadressen",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "Vad tycker du om? Vad \xE4r det som inte fungerar? Hur kan till\xE4gget f\xF6rb\xE4ttras?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "Vilka funktioner ger du synpunkter om? Beskriv s\xE5 noggrant som m\xF6jligt.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "Om du skickar in anonym \xE5terkoppling hj\xE4lper du oss att f\xF6rb\xE4ttra DuckDuckGo Privacy Essentials.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "Jag vill rapportera en skadad webbplats",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "Skicka",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Beskriv problemet du r\xE5kade ut f\xF6r:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Vilket inneh\xE5ll eller vilken funktion \xE4r skadad? Beskriv s\xE5 noggrant som m\xF6jligt.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "Tack f\xF6r din \xE5terkoppling!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Dina rapporter om skadade webbplatser hj\xE4lper v\xE5rt utvecklingsteam att \xE5tg\xE4rda dessa fel.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/sv/options.json
  var options_default24;
  var init_options24 = __esm({
    "shared/locales/sv/options.json"() {
      options_default24 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "Alternativ f\xF6r DuckDuckGo",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "S\xF6k och surfa p\xE5 webben utan att bli sp\xE5rad.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo skyddar din integritet p\xE5 n\xE4tet med\nprivat s\xF6kning,\nblockering av sp\xE5rare\noch kryptering av webbplatser.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Ber\xE4tta vad du tycker",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Rapportera skadad webbplats",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "Visa inb\xE4ddade tweets",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "Global Privacy Control (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: "Dina uppgifter ska inte vara till salu. Vi p\xE5 DuckDuckGo h\xE5ller med.\nAktivera inst\xE4llningarna f\xF6r Global Privacy Control (GPC) s\xE5 signalerar vi\ntill webbplatser att du f\xF6redrar att de:",
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "Inte s\xE4ljer dina personuppgifter.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "Begr\xE4nsar delning av dina personuppgifter med andra f\xF6retag.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>Eftersom Global Privacy Control (GPC) \xE4r en ny standard\nf\xF6ljer de flesta webbplatser inte den \xE4nnu, men vi arbetar h\xE5rt\np\xE5 att se till att den blir accepterad i hela v\xE4rlden.</b> Webbplatser \xE4r dock skyldiga att r\xE4tta sig efter signalen endast\ni den utstr\xE4ckning som g\xE4llande lagstiftning kr\xE4ver det.\xA0",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "E-postskydd",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Automatisk ifyllning inaktiverad",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: 'Automatisk ifyllning aktiverad f\xF6r <strong class="js-userdata-container">{userName}</strong>',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Inga oskyddade webbplatser har lagts till",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Oskyddade webbplatser",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "Dessa webbplatser kommer inte att f\xF6rb\xE4ttras av integritetsskydd.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "L\xE4gg till oskyddad webbplats",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "Ange URL",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "Ogiltig URL",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "Med Fire Button \xE4r det enkelt att rensa dina flikar, din surfhistorik och dina data. Du kan sj\xE4lv best\xE4mma om s\xE5v\xE4l surfhistorik som data ska rensas, och om dina nuvarande flikar ska st\xE4ngs.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "Rensa historik",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: "Obs! Surfhistorik kan endast rensas f\xF6r en specifik tidsperiod (t.ex. \u201Dsenaste timmen\u201D eller \u201Df\xF6r all tid\u201D) och inte per webbplats.",
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "St\xE4ng flikar",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "Rensning p\xE5g\xE5r...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/sv/shared.json
  var shared_default24;
  var init_shared24 = __esm({
    "shared/locales/sv/shared.json"() {
      shared_default24 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Alternativ",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "L\xE4s mer",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Aktivera",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Inaktivera",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "L\xE4gg till",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/locales/tr/feedback.json
  var feedback_default25;
  var init_feedback25 = __esm({
    "shared/locales/tr/feedback.json"() {
      feedback_default25 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        brokenSiteLabel: {
          title: "Hangi web sitesi hatal\u0131?",
          note: "We're asking feedback from users. Here they are reporting a website url that is not working correctly."
        },
        brokenSitePlaceholder: {
          title: "URL'nizi kopyalay\u0131p yap\u0131\u015Ft\u0131r\u0131n",
          note: `Instructions to fill an input field with a URL. Here "your URL" doesn't mean that they own the website, just that they're reporting it.`
        },
        feedbackHeaderLabel: {
          title: "Neyi seviyorsunuz? Neler i\u015Fe yaram\u0131yor? Eklenti nas\u0131l geli\u015Ftirilebilir?",
          note: "Label over a feedback text area where the user can tell us about their experience with our browser extension."
        },
        feedbackPlaceholder: {
          title: "Geri bildiriminiz hangi \xF6zellikler veya i\u015Flevlerle ilgili? L\xFCtfen m\xFCmk\xFCn oldu\u011Funca spesifik bir \u015Fekilde belirtin.",
          note: "Placeholder text on feedback form input."
        },
        submittingFeedbackHelps: {
          title: "Anonim geri bildirim g\xF6ndermek, DuckDuckGo Privacy Essentials'\u0131 geli\u015Ftirmemize yard\u0131mc\u0131 olur.",
          note: "Description at top of feedback form."
        },
        reportBrokenSite: {
          title: "Bozuk bir siteyi bildirmek istiyorum",
          note: "This opens a feedback form to report a broken site. Broken here means 'not working as expected'."
        },
        submit: {
          title: "G\xF6nder",
          note: "To submit the feedback form."
        },
        describeTheIssue: {
          title: "Kar\u015F\u0131la\u015Ft\u0131\u011F\u0131n\u0131z sorunu a\xE7\u0131klay\u0131n:",
          note: "Label on broken site feedback textarea where users can describe in what way a site is not working as expected."
        },
        describeBreakagePlaceholder: {
          title: "Hangi web sitesi i\xE7eri\u011Fi veya i\u015Flevi bozuk? L\xFCtfen m\xFCmk\xFCn oldu\u011Funca spesifik bir \u015Fekilde belirtin.",
          note: "Placeholder text on the broken site form."
        },
        thankYou: {
          title: "Geri bildiriminiz i\xE7in te\u015Fekk\xFCr ederiz!",
          note: "Thank you note displayed after submitting feedback"
        },
        thankYouBrokenSite: {
          title: "Bozuk sitelerle ilgili bildirimleriniz, geli\u015Ftirme ekibimizin bu ar\u0131zalar\u0131 gidermesine yard\u0131mc\u0131 olur.",
          note: "Additional note when submitting a broken site."
        }
      };
    }
  });

  // shared/locales/tr/options.json
  var options_default25;
  var init_options25 = __esm({
    "shared/locales/tr/options.json"() {
      options_default25 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        optionsHeader: {
          title: "DuckDuckGo Se\xE7enekleri",
          note: "Header for options (settings) page"
        },
        optionsSubHeader: {
          title: "Web'de hi\xE7 kimse sizi takip edemeden arama yap\u0131n ve gezinin.",
          note: "We allow the user to browse the web without being followed by trackers"
        },
        optionsDesc: {
          title: "DuckDuckGo,\n\xF6zel arama,\nizleyici engelleme,\nve site \u015Fifreleme ile internette gizlili\u011Finizi korur.",
          note: "This describes how we protect the user from being tracked online"
        },
        shareFeedback: {
          title: "Geri bildirim payla\u015F",
          note: "Click here to share your opinions about this product"
        },
        reportBrokenSite: {
          title: "Hatal\u0131 siteyi bildir",
          note: "Click here to report an issue with a specific site you are trying to use"
        },
        showEmbeddedTweets: {
          title: "G\xF6m\xFCl\xFC Tweet'leri g\xF6ster",
          note: "Whether the user wants to see Tweets embedded in various webpages or should they be hidden util clicked on"
        },
        globalPrivacyControlAbbr: {
          title: "K\xFCresel Gizlilik Kontrol\xFC (GPC)",
          note: "Global Privacy Control is the name of the feature that lets users set a preference to not have their information sold"
        },
        globalPrivacyControlDesc: {
          title: `Verileriniz sat\u0131l\u0131k olmamal\u0131. DuckDuckGo'da ayn\u0131 fikirdeyiz.
"Global Gizlilik Kontrol\xFC" (GPC) ayarlar\u0131n\u0131 etkinle\u015Ftirdi\u011Finizde
web sitelerine tercihinizi iletiriz:`,
          note: "This describes the GPC feature, which lets the user set a preference to not have their personal information sold by websites to other parties. The string is followed by a list of actions like 'Not sell your personal data'. These are translated separately."
        },
        notSellYourPersonalData: {
          title: "Ki\u015Fisel verilerinizin sat\u0131lmamas\u0131n\u0131 istedi\u011Finizi.",
          note: "Part of the GPC description, this communicates that the user would signal to not SELL their personal data"
        },
        limitSharingOfPersonalData: {
          title: "\u2022 Ki\u015Fisel verilerinizin di\u011Fer \u015Firketlerle payla\u015F\u0131m\u0131n\u0131n s\u0131n\u0131rland\u0131r\u0131lmas\u0131n\u0131 istedi\u011Finizi.",
          note: "Part of the GPC description, this communicates that the user would signal to not SHARE their personal data"
        },
        globalPrivacyControlDisclaimer: {
          title: "<b>K\xFCresel Gizlilik Kontrol\xFC (GPC) yeni bir standart oldu\u011Fundan,\n\xE7o\u011Fu web sitesi taraf\u0131ndan hen\xFCz tan\u0131nmayacakt\u0131r. Ancak, d\xFCnya \xE7ap\u0131nda\nbenimsenmesini sa\u011Flamak i\xE7in elimizden geleni yap\u0131yoruz.</b> Bununla birlikte, web sitelerinin onlara bildirilen tercihleri yaln\u0131zca ge\xE7erli yasalar\u0131n zorunlu\nk\u0131ld\u0131\u011F\u0131 \xF6l\xE7\xFCde dikkate almalar\u0131 gerekmektedir.\xA0",
          note: "Explains to the user that we can communiate their choice to the website, but the website needs to choose to support this signal"
        },
        emailProtection: {
          title: "E-posta Korumas\u0131",
          note: "Email protection is a feature that lets the user pick private email addresses for different websites"
        },
        autofillDisabled: {
          title: "Otomatik doldurma devre d\u0131\u015F\u0131",
          note: "When we don't automatically help populate email fields with a private address"
        },
        autofillEnabled: {
          title: '<strong class="js-userdata-container">{userName}</strong> i\xE7in otomatik doldurma etkinle\u015Ftirildi',
          note: "When we do help populate email addresses for (your email address here)"
        },
        noUnprotectedSitesAdded: {
          title: "Eklenen korumas\u0131z site yok",
          note: "Currently there are no websites on the list of websites where our privacy protections are disabled"
        },
        unprotectedSites: {
          title: "Korumas\u0131z Siteler",
          note: "Header for the list of websites where our privacy protections are disabled"
        },
        unprotectedSitesDesc: {
          title: "Bu siteler i\xE7in Gizlilik Korumas\u0131 uygulanmayacakt\u0131r.",
          note: "Describes that the user will not be protected by our privacy features when visiting these websites"
        },
        addUnprotectedSite: {
          title: "Korumas\u0131z site ekle",
          note: "Header for the user to add a site to the uprotected list"
        },
        enterURL: {
          title: "URL Girin",
          note: "Promopt to enter the website URL here"
        },
        invalidURL: {
          title: "Ge\xE7ersiz URL",
          note: "The URL the user entered is not a valid website address"
        },
        fireButtonHeading: {
          title: "Fire Button",
          note: "Header for the settings for the Fire button feature. As per glossary, please do not translate Fire Button."
        },
        fireButtonDesc: {
          title: "Fire Button, sekmelerinizi, tarama ge\xE7mi\u015Finizi ve verilerinizi temizlemenizi kolayla\u015Ft\u0131r\u0131r. Tarama ge\xE7mi\u015Finin yan\u0131 s\u0131ra verileri de temizleyip temizlemeyece\u011Fini ve mevcut sekmelerinizi kapat\u0131p kapatmayaca\u011F\u0131n\u0131 kontrol edebilirsiniz.",
          note: "Describes the Fire button features. As per glossary, please do not translate Fire Button."
        },
        fireButtonClearHistoryTitle: {
          title: "Ge\xE7mi\u015Fi Temizle",
          note: "Title for option toggle"
        },
        fireButtonClearHistoryDesc: {
          title: 'L\xFCtfen unutmay\u0131n: Tarama ge\xE7mi\u015Fi yaln\u0131zca belirli bir zaman aral\u0131\u011F\u0131 i\xE7in temizlenebilir (\xF6r. "son 1 saat", veya "her zaman") ve site baz\u0131nda temizlenemez.',
          note: "Extra information about the clear history option toggle."
        },
        fireButtonTabClosureTitle: {
          title: "Sekmeleri Kapat",
          note: "Title for option toggle. Close is a verb."
        },
        burnPageTitle: {
          title: "Temizlik devam ediyor...",
          note: "Title of the page opened after starting the data clearing process. Indicates to the user that we're in the process of clearing website data."
        }
      };
    }
  });

  // shared/locales/tr/shared.json
  var shared_default25;
  var init_shared25 = __esm({
    "shared/locales/tr/shared.json"() {
      shared_default25 = {
        smartling: {
          string_format: "icu",
          translate_paths: [
            {
              path: "*/title",
              key: "{*}/title",
              instruction: "*/note"
            }
          ]
        },
        options: {
          title: "Se\xE7enekler",
          note: "Header for the interface where user can configure various options"
        },
        learnMore: {
          title: "Daha fazla bilgi",
          note: "Click here to learn more about how our services work"
        },
        enable: {
          title: "Etkinle\u015Ftir",
          note: "Button prompt to turn something on, i.e. click on this to enable"
        },
        disable: {
          title: "Devre d\u0131\u015F\u0131 b\u0131rak",
          note: "Button prompt to turn something off, i.e. click on this to disable"
        },
        add: {
          title: "Ekle",
          note: "To add something to a list"
        }
      };
    }
  });

  // shared/js/ui/base/locale-resources.js
  var locale_resources_default;
  var init_locale_resources = __esm({
    "shared/js/ui/base/locale-resources.js"() {
      "use strict";
      init_feedback();
      init_options();
      init_shared();
      init_feedback2();
      init_options2();
      init_shared2();
      init_feedback3();
      init_options3();
      init_shared3();
      init_feedback4();
      init_options4();
      init_shared4();
      init_feedback5();
      init_options5();
      init_shared5();
      init_feedback6();
      init_options6();
      init_shared6();
      init_feedback7();
      init_options7();
      init_shared7();
      init_feedback8();
      init_options8();
      init_shared8();
      init_feedback9();
      init_options9();
      init_shared9();
      init_feedback10();
      init_options10();
      init_shared10();
      init_feedback11();
      init_options11();
      init_shared11();
      init_feedback12();
      init_options12();
      init_shared12();
      init_feedback13();
      init_options13();
      init_shared13();
      init_feedback14();
      init_options14();
      init_shared14();
      init_feedback15();
      init_options15();
      init_shared15();
      init_feedback16();
      init_options16();
      init_shared16();
      init_feedback17();
      init_options17();
      init_shared17();
      init_feedback18();
      init_options18();
      init_shared18();
      init_feedback19();
      init_options19();
      init_shared19();
      init_feedback20();
      init_options20();
      init_shared20();
      init_feedback21();
      init_options21();
      init_shared21();
      init_feedback22();
      init_options22();
      init_shared22();
      init_feedback23();
      init_options23();
      init_shared23();
      init_feedback24();
      init_options24();
      init_shared24();
      init_feedback25();
      init_options25();
      init_shared25();
      locale_resources_default = {
        bg: { feedback: feedback_default, options: options_default, shared: shared_default },
        cs: { feedback: feedback_default2, options: options_default2, shared: shared_default2 },
        da: { feedback: feedback_default3, options: options_default3, shared: shared_default3 },
        de: { feedback: feedback_default4, options: options_default4, shared: shared_default4 },
        el: { feedback: feedback_default5, options: options_default5, shared: shared_default5 },
        en: { feedback: feedback_default6, options: options_default6, shared: shared_default6 },
        es: { feedback: feedback_default7, options: options_default7, shared: shared_default7 },
        et: { feedback: feedback_default8, options: options_default8, shared: shared_default8 },
        fi: { feedback: feedback_default9, options: options_default9, shared: shared_default9 },
        fr: { feedback: feedback_default10, options: options_default10, shared: shared_default10 },
        hr: { feedback: feedback_default11, options: options_default11, shared: shared_default11 },
        hu: { feedback: feedback_default12, options: options_default12, shared: shared_default12 },
        it: { feedback: feedback_default13, options: options_default13, shared: shared_default13 },
        lt: { feedback: feedback_default14, options: options_default14, shared: shared_default14 },
        lv: { feedback: feedback_default15, options: options_default15, shared: shared_default15 },
        nb: { feedback: feedback_default16, options: options_default16, shared: shared_default16 },
        nl: { feedback: feedback_default17, options: options_default17, shared: shared_default17 },
        pl: { feedback: feedback_default18, options: options_default18, shared: shared_default18 },
        pt: { feedback: feedback_default19, options: options_default19, shared: shared_default19 },
        ro: { feedback: feedback_default20, options: options_default20, shared: shared_default20 },
        ru: { feedback: feedback_default21, options: options_default21, shared: shared_default21 },
        sk: { feedback: feedback_default22, options: options_default22, shared: shared_default22 },
        sl: { feedback: feedback_default23, options: options_default23, shared: shared_default23 },
        sv: { feedback: feedback_default24, options: options_default24, shared: shared_default24 },
        tr: { feedback: feedback_default25, options: options_default25, shared: shared_default25 }
      };
    }
  });

  // shared/js/ui/base/localize.js
  var require_localize = __commonJS({
    "shared/js/ui/base/localize.js"(exports, module) {
      "use strict";
      init_i18next();
      init_es();
      init_i18n();
      init_locale_resources();
      instance.use(es_default).init({
        initImmediate: false,
        fallbackLng: "en",
        lng: getUserLocale(),
        ns: ["shared", "options", "feedback"],
        defaultNS: "shared",
        resources: locale_resources_default
      });
      module.exports = instance;
    }
  });

  // shared/js/ui/base/mixins/events.js
  var require_events = __commonJS({
    "shared/js/ui/base/mixins/events.js"(exports, module) {
      "use strict";
      module.exports = {
        bindEvents: function(events) {
          if (!this._bEvents) {
            this._bEvents = [];
          }
          for (var i = 0, evt; evt = events[i]; i++) {
            if (evt.length < 2 || !evt[0] || !evt[1] || !evt[2]) {
              continue;
            }
            const eventObject = {
              bound: evt[2].bind(this),
              evt
            };
            if (typeof evt[0] === "string") {
              this.$ && this.$(evt[0]).on(evt[1], eventObject.bound);
            } else {
              evt[0].on(evt[1], eventObject.bound);
            }
            this._bEvents.push(eventObject);
          }
        },
        unbindEvents: function() {
          while (this._bEvents && this._bEvents.length) {
            const eventObject = this._bEvents[this._bEvents.length - 1];
            const evt = eventObject.evt;
            if (evt) {
              if (typeof evt[0] === "string") {
                this.$ && this.$(evt[0]).off(evt[1], eventObject.bound);
              } else {
                evt[0].off(evt[1], eventObject.bound);
              }
            }
            this._bEvents.pop();
          }
          this._bEvents = null;
        }
      };
    }
  });

  // shared/js/ui/base/mixins/index.js
  var require_mixins = __commonJS({
    "shared/js/ui/base/mixins/index.js"(exports, module) {
      "use strict";
      module.exports = {
        events: require_events()
        // ...add more here!
      };
    }
  });

  // node_modules/is-plain-object/dist/is-plain-object.js
  var require_is_plain_object = __commonJS({
    "node_modules/is-plain-object/dist/is-plain-object.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      function isObject(o) {
        return Object.prototype.toString.call(o) === "[object Object]";
      }
      function isPlainObject(o) {
        var ctor, prot;
        if (isObject(o) === false) return false;
        ctor = o.constructor;
        if (ctor === void 0) return true;
        prot = ctor.prototype;
        if (isObject(prot) === false) return false;
        if (prot.hasOwnProperty("isPrototypeOf") === false) {
          return false;
        }
        return true;
      }
      exports.isPlainObject = isPlainObject;
    }
  });

  // node_modules/deep-freeze/index.js
  var require_deep_freeze = __commonJS({
    "node_modules/deep-freeze/index.js"(exports, module) {
      module.exports = function deepFreeze(o) {
        Object.freeze(o);
        Object.getOwnPropertyNames(o).forEach(function(prop) {
          if (o.hasOwnProperty(prop) && o[prop] !== null && (typeof o[prop] === "object" || typeof o[prop] === "function") && !Object.isFrozen(o[prop])) {
            deepFreeze(o[prop]);
          }
        });
        return o;
      };
    }
  });

  // node_modules/eventemitter2/lib/eventemitter2.js
  var require_eventemitter2 = __commonJS({
    "node_modules/eventemitter2/lib/eventemitter2.js"(exports, module) {
      !function(undefined2) {
        var hasOwnProperty = Object.hasOwnProperty;
        var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
          return Object.prototype.toString.call(obj) === "[object Array]";
        };
        var defaultMaxListeners = 10;
        var nextTickSupported = typeof process == "object" && typeof process.nextTick == "function";
        var symbolsSupported = typeof Symbol === "function";
        var reflectSupported = typeof Reflect === "object";
        var setImmediateSupported = typeof setImmediate === "function";
        var _setImmediate = setImmediateSupported ? setImmediate : setTimeout;
        var ownKeys2 = symbolsSupported ? reflectSupported && typeof Reflect.ownKeys === "function" ? Reflect.ownKeys : function(obj) {
          var arr2 = Object.getOwnPropertyNames(obj);
          arr2.push.apply(arr2, Object.getOwnPropertySymbols(obj));
          return arr2;
        } : Object.keys;
        function init2() {
          this._events = {};
          if (this._conf) {
            configure.call(this, this._conf);
          }
        }
        function configure(conf) {
          if (conf) {
            this._conf = conf;
            conf.delimiter && (this.delimiter = conf.delimiter);
            if (conf.maxListeners !== undefined2) {
              this._maxListeners = conf.maxListeners;
            }
            conf.wildcard && (this.wildcard = conf.wildcard);
            conf.newListener && (this._newListener = conf.newListener);
            conf.removeListener && (this._removeListener = conf.removeListener);
            conf.verboseMemoryLeak && (this.verboseMemoryLeak = conf.verboseMemoryLeak);
            conf.ignoreErrors && (this.ignoreErrors = conf.ignoreErrors);
            if (this.wildcard) {
              this.listenerTree = {};
            }
          }
        }
        function logPossibleMemoryLeak(count, eventName) {
          var errorMsg = "(node) warning: possible EventEmitter memory leak detected. " + count + " listeners added. Use emitter.setMaxListeners() to increase limit.";
          if (this.verboseMemoryLeak) {
            errorMsg += " Event name: " + eventName + ".";
          }
          if (typeof process !== "undefined" && process.emitWarning) {
            var e = new Error(errorMsg);
            e.name = "MaxListenersExceededWarning";
            e.emitter = this;
            e.count = count;
            process.emitWarning(e);
          } else {
            console.error(errorMsg);
            if (console.trace) {
              console.trace();
            }
          }
        }
        var toArray = function(a, b, c) {
          var n = arguments.length;
          switch (n) {
            case 0:
              return [];
            case 1:
              return [a];
            case 2:
              return [a, b];
            case 3:
              return [a, b, c];
            default:
              var arr2 = new Array(n);
              while (n--) {
                arr2[n] = arguments[n];
              }
              return arr2;
          }
        };
        function toObject(keys, values) {
          var obj = {};
          var key;
          var len = keys.length;
          var valuesCount = values ? values.length : 0;
          for (var i = 0; i < len; i++) {
            key = keys[i];
            obj[key] = i < valuesCount ? values[i] : undefined2;
          }
          return obj;
        }
        function TargetObserver(emitter, target, options) {
          this._emitter = emitter;
          this._target = target;
          this._listeners = {};
          this._listenersCount = 0;
          var on, off;
          if (options.on || options.off) {
            on = options.on;
            off = options.off;
          }
          if (target.addEventListener) {
            on = target.addEventListener;
            off = target.removeEventListener;
          } else if (target.addListener) {
            on = target.addListener;
            off = target.removeListener;
          } else if (target.on) {
            on = target.on;
            off = target.off;
          }
          if (!on && !off) {
            throw Error("target does not implement any known event API");
          }
          if (typeof on !== "function") {
            throw TypeError("on method must be a function");
          }
          if (typeof off !== "function") {
            throw TypeError("off method must be a function");
          }
          this._on = on;
          this._off = off;
          var _observers = emitter._observers;
          if (_observers) {
            _observers.push(this);
          } else {
            emitter._observers = [this];
          }
        }
        Object.assign(TargetObserver.prototype, {
          subscribe: function(event, localEvent, reducer) {
            var observer = this;
            var target = this._target;
            var emitter = this._emitter;
            var listeners = this._listeners;
            var handler = function() {
              var args = toArray.apply(null, arguments);
              var eventObj = {
                data: args,
                name: localEvent,
                original: event
              };
              if (reducer) {
                var result = reducer.call(target, eventObj);
                if (result !== false) {
                  emitter.emit.apply(emitter, [eventObj.name].concat(args));
                }
                return;
              }
              emitter.emit.apply(emitter, [localEvent].concat(args));
            };
            if (listeners[event]) {
              throw Error("Event '" + event + "' is already listening");
            }
            this._listenersCount++;
            if (emitter._newListener && emitter._removeListener && !observer._onNewListener) {
              this._onNewListener = function(_event) {
                if (_event === localEvent && listeners[event] === null) {
                  listeners[event] = handler;
                  observer._on.call(target, event, handler);
                }
              };
              emitter.on("newListener", this._onNewListener);
              this._onRemoveListener = function(_event) {
                if (_event === localEvent && !emitter.hasListeners(_event) && listeners[event]) {
                  listeners[event] = null;
                  observer._off.call(target, event, handler);
                }
              };
              listeners[event] = null;
              emitter.on("removeListener", this._onRemoveListener);
            } else {
              listeners[event] = handler;
              observer._on.call(target, event, handler);
            }
          },
          unsubscribe: function(event) {
            var observer = this;
            var listeners = this._listeners;
            var emitter = this._emitter;
            var handler;
            var events;
            var off = this._off;
            var target = this._target;
            var i;
            if (event && typeof event !== "string") {
              throw TypeError("event must be a string");
            }
            function clearRefs() {
              if (observer._onNewListener) {
                emitter.off("newListener", observer._onNewListener);
                emitter.off("removeListener", observer._onRemoveListener);
                observer._onNewListener = null;
                observer._onRemoveListener = null;
              }
              var index = findTargetIndex.call(emitter, observer);
              emitter._observers.splice(index, 1);
            }
            if (event) {
              handler = listeners[event];
              if (!handler) return;
              off.call(target, event, handler);
              delete listeners[event];
              if (!--this._listenersCount) {
                clearRefs();
              }
            } else {
              events = ownKeys2(listeners);
              i = events.length;
              while (i-- > 0) {
                event = events[i];
                off.call(target, event, listeners[event]);
              }
              this._listeners = {};
              this._listenersCount = 0;
              clearRefs();
            }
          }
        });
        function resolveOptions(options, schema, reducers, allowUnknown) {
          var computedOptions = Object.assign({}, schema);
          if (!options) return computedOptions;
          if (typeof options !== "object") {
            throw TypeError("options must be an object");
          }
          var keys = Object.keys(options);
          var length = keys.length;
          var option, value;
          var reducer;
          function reject(reason) {
            throw Error('Invalid "' + option + '" option value' + (reason ? ". Reason: " + reason : ""));
          }
          for (var i = 0; i < length; i++) {
            option = keys[i];
            if (!allowUnknown && !hasOwnProperty.call(schema, option)) {
              throw Error('Unknown "' + option + '" option');
            }
            value = options[option];
            if (value !== undefined2) {
              reducer = reducers[option];
              computedOptions[option] = reducer ? reducer(value, reject) : value;
            }
          }
          return computedOptions;
        }
        function constructorReducer(value, reject) {
          if (typeof value !== "function" || !value.hasOwnProperty("prototype")) {
            reject("value must be a constructor");
          }
          return value;
        }
        function makeTypeReducer(types) {
          var message = "value must be type of " + types.join("|");
          var len = types.length;
          var firstType = types[0];
          var secondType = types[1];
          if (len === 1) {
            return function(v, reject) {
              if (typeof v === firstType) {
                return v;
              }
              reject(message);
            };
          }
          if (len === 2) {
            return function(v, reject) {
              var kind = typeof v;
              if (kind === firstType || kind === secondType) return v;
              reject(message);
            };
          }
          return function(v, reject) {
            var kind = typeof v;
            var i = len;
            while (i-- > 0) {
              if (kind === types[i]) return v;
            }
            reject(message);
          };
        }
        var functionReducer = makeTypeReducer(["function"]);
        var objectFunctionReducer = makeTypeReducer(["object", "function"]);
        function makeCancelablePromise(Promise2, executor, options) {
          var isCancelable;
          var callbacks;
          var timer = 0;
          var subscriptionClosed;
          var promise = new Promise2(function(resolve, reject, onCancel) {
            options = resolveOptions(options, {
              timeout: 0,
              overload: false
            }, {
              timeout: function(value, reject2) {
                value *= 1;
                if (typeof value !== "number" || value < 0 || !Number.isFinite(value)) {
                  reject2("timeout must be a positive number");
                }
                return value;
              }
            });
            isCancelable = !options.overload && typeof Promise2.prototype.cancel === "function" && typeof onCancel === "function";
            function cleanup() {
              if (callbacks) {
                callbacks = null;
              }
              if (timer) {
                clearTimeout(timer);
                timer = 0;
              }
            }
            var _resolve = function(value) {
              cleanup();
              resolve(value);
            };
            var _reject = function(err) {
              cleanup();
              reject(err);
            };
            if (isCancelable) {
              executor(_resolve, _reject, onCancel);
            } else {
              callbacks = [function(reason) {
                _reject(reason || Error("canceled"));
              }];
              executor(_resolve, _reject, function(cb) {
                if (subscriptionClosed) {
                  throw Error("Unable to subscribe on cancel event asynchronously");
                }
                if (typeof cb !== "function") {
                  throw TypeError("onCancel callback must be a function");
                }
                callbacks.push(cb);
              });
              subscriptionClosed = true;
            }
            if (options.timeout > 0) {
              timer = setTimeout(function() {
                var reason = Error("timeout");
                reason.code = "ETIMEDOUT";
                timer = 0;
                promise.cancel(reason);
                reject(reason);
              }, options.timeout);
            }
          });
          if (!isCancelable) {
            promise.cancel = function(reason) {
              if (!callbacks) {
                return;
              }
              var length = callbacks.length;
              for (var i = 1; i < length; i++) {
                callbacks[i](reason);
              }
              callbacks[0](reason);
              callbacks = null;
            };
          }
          return promise;
        }
        function findTargetIndex(observer) {
          var observers = this._observers;
          if (!observers) {
            return -1;
          }
          var len = observers.length;
          for (var i = 0; i < len; i++) {
            if (observers[i]._target === observer) return i;
          }
          return -1;
        }
        function searchListenerTree(handlers, type, tree, i, typeLength) {
          if (!tree) {
            return null;
          }
          if (i === 0) {
            var kind = typeof type;
            if (kind === "string") {
              var ns, n, l = 0, j = 0, delimiter = this.delimiter, dl = delimiter.length;
              if ((n = type.indexOf(delimiter)) !== -1) {
                ns = new Array(5);
                do {
                  ns[l++] = type.slice(j, n);
                  j = n + dl;
                } while ((n = type.indexOf(delimiter, j)) !== -1);
                ns[l++] = type.slice(j);
                type = ns;
                typeLength = l;
              } else {
                type = [type];
                typeLength = 1;
              }
            } else if (kind === "object") {
              typeLength = type.length;
            } else {
              type = [type];
              typeLength = 1;
            }
          }
          var listeners = null, branch, xTree, xxTree, isolatedBranch, endReached, currentType = type[i], nextType = type[i + 1], branches, _listeners;
          if (i === typeLength) {
            if (tree._listeners) {
              if (typeof tree._listeners === "function") {
                handlers && handlers.push(tree._listeners);
                listeners = [tree];
              } else {
                handlers && handlers.push.apply(handlers, tree._listeners);
                listeners = [tree];
              }
            }
          } else {
            if (currentType === "*") {
              branches = ownKeys2(tree);
              n = branches.length;
              while (n-- > 0) {
                branch = branches[n];
                if (branch !== "_listeners") {
                  _listeners = searchListenerTree(handlers, type, tree[branch], i + 1, typeLength);
                  if (_listeners) {
                    if (listeners) {
                      listeners.push.apply(listeners, _listeners);
                    } else {
                      listeners = _listeners;
                    }
                  }
                }
              }
              return listeners;
            } else if (currentType === "**") {
              endReached = i + 1 === typeLength || i + 2 === typeLength && nextType === "*";
              if (endReached && tree._listeners) {
                listeners = searchListenerTree(handlers, type, tree, typeLength, typeLength);
              }
              branches = ownKeys2(tree);
              n = branches.length;
              while (n-- > 0) {
                branch = branches[n];
                if (branch !== "_listeners") {
                  if (branch === "*" || branch === "**") {
                    if (tree[branch]._listeners && !endReached) {
                      _listeners = searchListenerTree(handlers, type, tree[branch], typeLength, typeLength);
                      if (_listeners) {
                        if (listeners) {
                          listeners.push.apply(listeners, _listeners);
                        } else {
                          listeners = _listeners;
                        }
                      }
                    }
                    _listeners = searchListenerTree(handlers, type, tree[branch], i, typeLength);
                  } else if (branch === nextType) {
                    _listeners = searchListenerTree(handlers, type, tree[branch], i + 2, typeLength);
                  } else {
                    _listeners = searchListenerTree(handlers, type, tree[branch], i, typeLength);
                  }
                  if (_listeners) {
                    if (listeners) {
                      listeners.push.apply(listeners, _listeners);
                    } else {
                      listeners = _listeners;
                    }
                  }
                }
              }
              return listeners;
            } else if (tree[currentType]) {
              listeners = searchListenerTree(handlers, type, tree[currentType], i + 1, typeLength);
            }
          }
          xTree = tree["*"];
          if (xTree) {
            searchListenerTree(handlers, type, xTree, i + 1, typeLength);
          }
          xxTree = tree["**"];
          if (xxTree) {
            if (i < typeLength) {
              if (xxTree._listeners) {
                searchListenerTree(handlers, type, xxTree, typeLength, typeLength);
              }
              branches = ownKeys2(xxTree);
              n = branches.length;
              while (n-- > 0) {
                branch = branches[n];
                if (branch !== "_listeners") {
                  if (branch === nextType) {
                    searchListenerTree(handlers, type, xxTree[branch], i + 2, typeLength);
                  } else if (branch === currentType) {
                    searchListenerTree(handlers, type, xxTree[branch], i + 1, typeLength);
                  } else {
                    isolatedBranch = {};
                    isolatedBranch[branch] = xxTree[branch];
                    searchListenerTree(handlers, type, { "**": isolatedBranch }, i + 1, typeLength);
                  }
                }
              }
            } else if (xxTree._listeners) {
              searchListenerTree(handlers, type, xxTree, typeLength, typeLength);
            } else if (xxTree["*"] && xxTree["*"]._listeners) {
              searchListenerTree(handlers, type, xxTree["*"], typeLength, typeLength);
            }
          }
          return listeners;
        }
        function growListenerTree(type, listener, prepend) {
          var len = 0, j = 0, i, delimiter = this.delimiter, dl = delimiter.length, ns;
          if (typeof type === "string") {
            if ((i = type.indexOf(delimiter)) !== -1) {
              ns = new Array(5);
              do {
                ns[len++] = type.slice(j, i);
                j = i + dl;
              } while ((i = type.indexOf(delimiter, j)) !== -1);
              ns[len++] = type.slice(j);
            } else {
              ns = [type];
              len = 1;
            }
          } else {
            ns = type;
            len = type.length;
          }
          if (len > 1) {
            for (i = 0; i + 1 < len; i++) {
              if (ns[i] === "**" && ns[i + 1] === "**") {
                return;
              }
            }
          }
          var tree = this.listenerTree, name;
          for (i = 0; i < len; i++) {
            name = ns[i];
            tree = tree[name] || (tree[name] = {});
            if (i === len - 1) {
              if (!tree._listeners) {
                tree._listeners = listener;
              } else {
                if (typeof tree._listeners === "function") {
                  tree._listeners = [tree._listeners];
                }
                if (prepend) {
                  tree._listeners.unshift(listener);
                } else {
                  tree._listeners.push(listener);
                }
                if (!tree._listeners.warned && this._maxListeners > 0 && tree._listeners.length > this._maxListeners) {
                  tree._listeners.warned = true;
                  logPossibleMemoryLeak.call(this, tree._listeners.length, name);
                }
              }
              return true;
            }
          }
          return true;
        }
        function collectTreeEvents(tree, events, root, asArray) {
          var branches = ownKeys2(tree);
          var i = branches.length;
          var branch, branchName, path;
          var hasListeners = tree["_listeners"];
          var isArrayPath;
          while (i-- > 0) {
            branchName = branches[i];
            branch = tree[branchName];
            if (branchName === "_listeners") {
              path = root;
            } else {
              path = root ? root.concat(branchName) : [branchName];
            }
            isArrayPath = asArray || typeof branchName === "symbol";
            hasListeners && events.push(isArrayPath ? path : path.join(this.delimiter));
            if (typeof branch === "object") {
              collectTreeEvents.call(this, branch, events, path, isArrayPath);
            }
          }
          return events;
        }
        function recursivelyGarbageCollect(root) {
          var keys = ownKeys2(root);
          var i = keys.length;
          var obj, key, flag;
          while (i-- > 0) {
            key = keys[i];
            obj = root[key];
            if (obj) {
              flag = true;
              if (key !== "_listeners" && !recursivelyGarbageCollect(obj)) {
                delete root[key];
              }
            }
          }
          return flag;
        }
        function Listener(emitter, event, listener) {
          this.emitter = emitter;
          this.event = event;
          this.listener = listener;
        }
        Listener.prototype.off = function() {
          this.emitter.off(this.event, this.listener);
          return this;
        };
        function setupListener(event, listener, options) {
          if (options === true) {
            promisify = true;
          } else if (options === false) {
            async = true;
          } else {
            if (!options || typeof options !== "object") {
              throw TypeError("options should be an object or true");
            }
            var async = options.async;
            var promisify = options.promisify;
            var nextTick = options.nextTick;
            var objectify = options.objectify;
          }
          if (async || nextTick || promisify) {
            var _listener = listener;
            var _origin = listener._origin || listener;
            if (nextTick && !nextTickSupported) {
              throw Error("process.nextTick is not supported");
            }
            if (promisify === undefined2) {
              promisify = listener.constructor.name === "AsyncFunction";
            }
            listener = function() {
              var args = arguments;
              var context = this;
              var event2 = this.event;
              return promisify ? nextTick ? Promise.resolve() : new Promise(function(resolve) {
                _setImmediate(resolve);
              }).then(function() {
                context.event = event2;
                return _listener.apply(context, args);
              }) : (nextTick ? process.nextTick : _setImmediate)(function() {
                context.event = event2;
                _listener.apply(context, args);
              });
            };
            listener._async = true;
            listener._origin = _origin;
          }
          return [listener, objectify ? new Listener(this, event, listener) : this];
        }
        function EventEmitter2(conf) {
          this._events = {};
          this._newListener = false;
          this._removeListener = false;
          this.verboseMemoryLeak = false;
          configure.call(this, conf);
        }
        EventEmitter2.EventEmitter2 = EventEmitter2;
        EventEmitter2.prototype.listenTo = function(target, events, options) {
          if (typeof target !== "object") {
            throw TypeError("target musts be an object");
          }
          var emitter = this;
          options = resolveOptions(options, {
            on: undefined2,
            off: undefined2,
            reducers: undefined2
          }, {
            on: functionReducer,
            off: functionReducer,
            reducers: objectFunctionReducer
          });
          function listen(events2) {
            if (typeof events2 !== "object") {
              throw TypeError("events must be an object");
            }
            var reducers = options.reducers;
            var index = findTargetIndex.call(emitter, target);
            var observer;
            if (index === -1) {
              observer = new TargetObserver(emitter, target, options);
            } else {
              observer = emitter._observers[index];
            }
            var keys = ownKeys2(events2);
            var len = keys.length;
            var event;
            var isSingleReducer = typeof reducers === "function";
            for (var i = 0; i < len; i++) {
              event = keys[i];
              observer.subscribe(
                event,
                events2[event] || event,
                isSingleReducer ? reducers : reducers && reducers[event]
              );
            }
          }
          isArray(events) ? listen(toObject(events)) : typeof events === "string" ? listen(toObject(events.split(/\s+/))) : listen(events);
          return this;
        };
        EventEmitter2.prototype.stopListeningTo = function(target, event) {
          var observers = this._observers;
          if (!observers) {
            return false;
          }
          var i = observers.length;
          var observer;
          var matched = false;
          if (target && typeof target !== "object") {
            throw TypeError("target should be an object");
          }
          while (i-- > 0) {
            observer = observers[i];
            if (!target || observer._target === target) {
              observer.unsubscribe(event);
              matched = true;
            }
          }
          return matched;
        };
        EventEmitter2.prototype.delimiter = ".";
        EventEmitter2.prototype.setMaxListeners = function(n) {
          if (n !== undefined2) {
            this._maxListeners = n;
            if (!this._conf) this._conf = {};
            this._conf.maxListeners = n;
          }
        };
        EventEmitter2.prototype.getMaxListeners = function() {
          return this._maxListeners;
        };
        EventEmitter2.prototype.event = "";
        EventEmitter2.prototype.once = function(event, fn, options) {
          return this._once(event, fn, false, options);
        };
        EventEmitter2.prototype.prependOnceListener = function(event, fn, options) {
          return this._once(event, fn, true, options);
        };
        EventEmitter2.prototype._once = function(event, fn, prepend, options) {
          return this._many(event, 1, fn, prepend, options);
        };
        EventEmitter2.prototype.many = function(event, ttl, fn, options) {
          return this._many(event, ttl, fn, false, options);
        };
        EventEmitter2.prototype.prependMany = function(event, ttl, fn, options) {
          return this._many(event, ttl, fn, true, options);
        };
        EventEmitter2.prototype._many = function(event, ttl, fn, prepend, options) {
          var self2 = this;
          if (typeof fn !== "function") {
            throw new Error("many only accepts instances of Function");
          }
          function listener() {
            if (--ttl === 0) {
              self2.off(event, listener);
            }
            return fn.apply(this, arguments);
          }
          listener._origin = fn;
          return this._on(event, listener, prepend, options);
        };
        EventEmitter2.prototype.emit = function() {
          if (!this._events && !this._all) {
            return false;
          }
          this._events || init2.call(this);
          var type = arguments[0], ns, wildcard = this.wildcard;
          var args, l, i, j, containsSymbol;
          if (type === "newListener" && !this._newListener) {
            if (!this._events.newListener) {
              return false;
            }
          }
          if (wildcard) {
            ns = type;
            if (type !== "newListener" && type !== "removeListener") {
              if (typeof type === "object") {
                l = type.length;
                if (symbolsSupported) {
                  for (i = 0; i < l; i++) {
                    if (typeof type[i] === "symbol") {
                      containsSymbol = true;
                      break;
                    }
                  }
                }
                if (!containsSymbol) {
                  type = type.join(this.delimiter);
                }
              }
            }
          }
          var al = arguments.length;
          var handler;
          if (this._all && this._all.length) {
            handler = this._all.slice();
            for (i = 0, l = handler.length; i < l; i++) {
              this.event = type;
              switch (al) {
                case 1:
                  handler[i].call(this, type);
                  break;
                case 2:
                  handler[i].call(this, type, arguments[1]);
                  break;
                case 3:
                  handler[i].call(this, type, arguments[1], arguments[2]);
                  break;
                default:
                  handler[i].apply(this, arguments);
              }
            }
          }
          if (wildcard) {
            handler = [];
            searchListenerTree.call(this, handler, ns, this.listenerTree, 0, l);
          } else {
            handler = this._events[type];
            if (typeof handler === "function") {
              this.event = type;
              switch (al) {
                case 1:
                  handler.call(this);
                  break;
                case 2:
                  handler.call(this, arguments[1]);
                  break;
                case 3:
                  handler.call(this, arguments[1], arguments[2]);
                  break;
                default:
                  args = new Array(al - 1);
                  for (j = 1; j < al; j++) args[j - 1] = arguments[j];
                  handler.apply(this, args);
              }
              return true;
            } else if (handler) {
              handler = handler.slice();
            }
          }
          if (handler && handler.length) {
            if (al > 3) {
              args = new Array(al - 1);
              for (j = 1; j < al; j++) args[j - 1] = arguments[j];
            }
            for (i = 0, l = handler.length; i < l; i++) {
              this.event = type;
              switch (al) {
                case 1:
                  handler[i].call(this);
                  break;
                case 2:
                  handler[i].call(this, arguments[1]);
                  break;
                case 3:
                  handler[i].call(this, arguments[1], arguments[2]);
                  break;
                default:
                  handler[i].apply(this, args);
              }
            }
            return true;
          } else if (!this.ignoreErrors && !this._all && type === "error") {
            if (arguments[1] instanceof Error) {
              throw arguments[1];
            } else {
              throw new Error("Uncaught, unspecified 'error' event.");
            }
          }
          return !!this._all;
        };
        EventEmitter2.prototype.emitAsync = function() {
          if (!this._events && !this._all) {
            return false;
          }
          this._events || init2.call(this);
          var type = arguments[0], wildcard = this.wildcard, ns, containsSymbol;
          var args, l, i, j;
          if (type === "newListener" && !this._newListener) {
            if (!this._events.newListener) {
              return Promise.resolve([false]);
            }
          }
          if (wildcard) {
            ns = type;
            if (type !== "newListener" && type !== "removeListener") {
              if (typeof type === "object") {
                l = type.length;
                if (symbolsSupported) {
                  for (i = 0; i < l; i++) {
                    if (typeof type[i] === "symbol") {
                      containsSymbol = true;
                      break;
                    }
                  }
                }
                if (!containsSymbol) {
                  type = type.join(this.delimiter);
                }
              }
            }
          }
          var promises = [];
          var al = arguments.length;
          var handler;
          if (this._all) {
            for (i = 0, l = this._all.length; i < l; i++) {
              this.event = type;
              switch (al) {
                case 1:
                  promises.push(this._all[i].call(this, type));
                  break;
                case 2:
                  promises.push(this._all[i].call(this, type, arguments[1]));
                  break;
                case 3:
                  promises.push(this._all[i].call(this, type, arguments[1], arguments[2]));
                  break;
                default:
                  promises.push(this._all[i].apply(this, arguments));
              }
            }
          }
          if (wildcard) {
            handler = [];
            searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
          } else {
            handler = this._events[type];
          }
          if (typeof handler === "function") {
            this.event = type;
            switch (al) {
              case 1:
                promises.push(handler.call(this));
                break;
              case 2:
                promises.push(handler.call(this, arguments[1]));
                break;
              case 3:
                promises.push(handler.call(this, arguments[1], arguments[2]));
                break;
              default:
                args = new Array(al - 1);
                for (j = 1; j < al; j++) args[j - 1] = arguments[j];
                promises.push(handler.apply(this, args));
            }
          } else if (handler && handler.length) {
            handler = handler.slice();
            if (al > 3) {
              args = new Array(al - 1);
              for (j = 1; j < al; j++) args[j - 1] = arguments[j];
            }
            for (i = 0, l = handler.length; i < l; i++) {
              this.event = type;
              switch (al) {
                case 1:
                  promises.push(handler[i].call(this));
                  break;
                case 2:
                  promises.push(handler[i].call(this, arguments[1]));
                  break;
                case 3:
                  promises.push(handler[i].call(this, arguments[1], arguments[2]));
                  break;
                default:
                  promises.push(handler[i].apply(this, args));
              }
            }
          } else if (!this.ignoreErrors && !this._all && type === "error") {
            if (arguments[1] instanceof Error) {
              return Promise.reject(arguments[1]);
            } else {
              return Promise.reject("Uncaught, unspecified 'error' event.");
            }
          }
          return Promise.all(promises);
        };
        EventEmitter2.prototype.on = function(type, listener, options) {
          return this._on(type, listener, false, options);
        };
        EventEmitter2.prototype.prependListener = function(type, listener, options) {
          return this._on(type, listener, true, options);
        };
        EventEmitter2.prototype.onAny = function(fn) {
          return this._onAny(fn, false);
        };
        EventEmitter2.prototype.prependAny = function(fn) {
          return this._onAny(fn, true);
        };
        EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
        EventEmitter2.prototype._onAny = function(fn, prepend) {
          if (typeof fn !== "function") {
            throw new Error("onAny only accepts instances of Function");
          }
          if (!this._all) {
            this._all = [];
          }
          if (prepend) {
            this._all.unshift(fn);
          } else {
            this._all.push(fn);
          }
          return this;
        };
        EventEmitter2.prototype._on = function(type, listener, prepend, options) {
          if (typeof type === "function") {
            this._onAny(type, listener);
            return this;
          }
          if (typeof listener !== "function") {
            throw new Error("on only accepts instances of Function");
          }
          this._events || init2.call(this);
          var returnValue = this, temp;
          if (options !== undefined2) {
            temp = setupListener.call(this, type, listener, options);
            listener = temp[0];
            returnValue = temp[1];
          }
          if (this._newListener) {
            this.emit("newListener", type, listener);
          }
          if (this.wildcard) {
            growListenerTree.call(this, type, listener, prepend);
            return returnValue;
          }
          if (!this._events[type]) {
            this._events[type] = listener;
          } else {
            if (typeof this._events[type] === "function") {
              this._events[type] = [this._events[type]];
            }
            if (prepend) {
              this._events[type].unshift(listener);
            } else {
              this._events[type].push(listener);
            }
            if (!this._events[type].warned && this._maxListeners > 0 && this._events[type].length > this._maxListeners) {
              this._events[type].warned = true;
              logPossibleMemoryLeak.call(this, this._events[type].length, type);
            }
          }
          return returnValue;
        };
        EventEmitter2.prototype.off = function(type, listener) {
          if (typeof listener !== "function") {
            throw new Error("removeListener only takes instances of Function");
          }
          var handlers, leafs = [];
          if (this.wildcard) {
            var ns = typeof type === "string" ? type.split(this.delimiter) : type.slice();
            leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
            if (!leafs) return this;
          } else {
            if (!this._events[type]) return this;
            handlers = this._events[type];
            leafs.push({ _listeners: handlers });
          }
          for (var iLeaf = 0; iLeaf < leafs.length; iLeaf++) {
            var leaf = leafs[iLeaf];
            handlers = leaf._listeners;
            if (isArray(handlers)) {
              var position = -1;
              for (var i = 0, length = handlers.length; i < length; i++) {
                if (handlers[i] === listener || handlers[i].listener && handlers[i].listener === listener || handlers[i]._origin && handlers[i]._origin === listener) {
                  position = i;
                  break;
                }
              }
              if (position < 0) {
                continue;
              }
              if (this.wildcard) {
                leaf._listeners.splice(position, 1);
              } else {
                this._events[type].splice(position, 1);
              }
              if (handlers.length === 0) {
                if (this.wildcard) {
                  delete leaf._listeners;
                } else {
                  delete this._events[type];
                }
              }
              if (this._removeListener)
                this.emit("removeListener", type, listener);
              return this;
            } else if (handlers === listener || handlers.listener && handlers.listener === listener || handlers._origin && handlers._origin === listener) {
              if (this.wildcard) {
                delete leaf._listeners;
              } else {
                delete this._events[type];
              }
              if (this._removeListener)
                this.emit("removeListener", type, listener);
            }
          }
          this.listenerTree && recursivelyGarbageCollect(this.listenerTree);
          return this;
        };
        EventEmitter2.prototype.offAny = function(fn) {
          var i = 0, l = 0, fns;
          if (fn && this._all && this._all.length > 0) {
            fns = this._all;
            for (i = 0, l = fns.length; i < l; i++) {
              if (fn === fns[i]) {
                fns.splice(i, 1);
                if (this._removeListener)
                  this.emit("removeListenerAny", fn);
                return this;
              }
            }
          } else {
            fns = this._all;
            if (this._removeListener) {
              for (i = 0, l = fns.length; i < l; i++)
                this.emit("removeListenerAny", fns[i]);
            }
            this._all = [];
          }
          return this;
        };
        EventEmitter2.prototype.removeListener = EventEmitter2.prototype.off;
        EventEmitter2.prototype.removeAllListeners = function(type) {
          if (type === undefined2) {
            !this._events || init2.call(this);
            return this;
          }
          if (this.wildcard) {
            var leafs = searchListenerTree.call(this, null, type, this.listenerTree, 0), leaf, i;
            if (!leafs) return this;
            for (i = 0; i < leafs.length; i++) {
              leaf = leafs[i];
              leaf._listeners = null;
            }
            this.listenerTree && recursivelyGarbageCollect(this.listenerTree);
          } else if (this._events) {
            this._events[type] = null;
          }
          return this;
        };
        EventEmitter2.prototype.listeners = function(type) {
          var _events = this._events;
          var keys, listeners, allListeners;
          var i;
          var listenerTree;
          if (type === undefined2) {
            if (this.wildcard) {
              throw Error("event name required for wildcard emitter");
            }
            if (!_events) {
              return [];
            }
            keys = ownKeys2(_events);
            i = keys.length;
            allListeners = [];
            while (i-- > 0) {
              listeners = _events[keys[i]];
              if (typeof listeners === "function") {
                allListeners.push(listeners);
              } else {
                allListeners.push.apply(allListeners, listeners);
              }
            }
            return allListeners;
          } else {
            if (this.wildcard) {
              listenerTree = this.listenerTree;
              if (!listenerTree) return [];
              var handlers = [];
              var ns = typeof type === "string" ? type.split(this.delimiter) : type.slice();
              searchListenerTree.call(this, handlers, ns, listenerTree, 0);
              return handlers;
            }
            if (!_events) {
              return [];
            }
            listeners = _events[type];
            if (!listeners) {
              return [];
            }
            return typeof listeners === "function" ? [listeners] : listeners;
          }
        };
        EventEmitter2.prototype.eventNames = function(nsAsArray) {
          var _events = this._events;
          return this.wildcard ? collectTreeEvents.call(this, this.listenerTree, [], null, nsAsArray) : _events ? ownKeys2(_events) : [];
        };
        EventEmitter2.prototype.listenerCount = function(type) {
          return this.listeners(type).length;
        };
        EventEmitter2.prototype.hasListeners = function(type) {
          if (this.wildcard) {
            var handlers = [];
            var ns = typeof type === "string" ? type.split(this.delimiter) : type.slice();
            searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
            return handlers.length > 0;
          }
          var _events = this._events;
          var _all = this._all;
          return !!(_all && _all.length || _events && (type === undefined2 ? ownKeys2(_events).length : _events[type]));
        };
        EventEmitter2.prototype.listenersAny = function() {
          if (this._all) {
            return this._all;
          } else {
            return [];
          }
        };
        EventEmitter2.prototype.waitFor = function(event, options) {
          var self2 = this;
          var type = typeof options;
          if (type === "number") {
            options = { timeout: options };
          } else if (type === "function") {
            options = { filter: options };
          }
          options = resolveOptions(options, {
            timeout: 0,
            filter: undefined2,
            handleError: false,
            Promise,
            overload: false
          }, {
            filter: functionReducer,
            Promise: constructorReducer
          });
          return makeCancelablePromise(options.Promise, function(resolve, reject, onCancel) {
            function listener() {
              var filter = options.filter;
              if (filter && !filter.apply(self2, arguments)) {
                return;
              }
              self2.off(event, listener);
              if (options.handleError) {
                var err = arguments[0];
                err ? reject(err) : resolve(toArray.apply(null, arguments).slice(1));
              } else {
                resolve(toArray.apply(null, arguments));
              }
            }
            onCancel(function() {
              self2.off(event, listener);
            });
            self2._on(event, listener, false);
          }, {
            timeout: options.timeout,
            overload: options.overload
          });
        };
        function once(emitter, name, options) {
          options = resolveOptions(options, {
            Promise,
            timeout: 0,
            overload: false
          }, {
            Promise: constructorReducer
          });
          var _Promise = options.Promise;
          return makeCancelablePromise(_Promise, function(resolve, reject, onCancel) {
            var handler;
            if (typeof emitter.addEventListener === "function") {
              handler = function() {
                resolve(toArray.apply(null, arguments));
              };
              onCancel(function() {
                emitter.removeEventListener(name, handler);
              });
              emitter.addEventListener(
                name,
                handler,
                { once: true }
              );
              return;
            }
            var eventListener = function() {
              errorListener && emitter.removeListener("error", errorListener);
              resolve(toArray.apply(null, arguments));
            };
            var errorListener;
            if (name !== "error") {
              errorListener = function(err) {
                emitter.removeListener(name, eventListener);
                reject(err);
              };
              emitter.once("error", errorListener);
            }
            onCancel(function() {
              errorListener && emitter.removeListener("error", errorListener);
              emitter.removeListener(name, eventListener);
            });
            emitter.once(name, eventListener);
          }, {
            timeout: options.timeout,
            overload: options.overload
          });
        }
        var prototype = EventEmitter2.prototype;
        Object.defineProperties(EventEmitter2, {
          defaultMaxListeners: {
            get: function() {
              return prototype._maxListeners;
            },
            set: function(n) {
              if (typeof n !== "number" || n < 0 || Number.isNaN(n)) {
                throw TypeError("n must be a non-negative number");
              }
              prototype._maxListeners = n;
            },
            enumerable: true
          },
          once: {
            value: once,
            writable: true,
            configurable: true
          }
        });
        Object.defineProperties(prototype, {
          _maxListeners: {
            value: defaultMaxListeners,
            writable: true,
            configurable: true
          },
          _observers: { value: null, writable: true, configurable: true }
        });
        if (typeof define === "function" && define.amd) {
          define(function() {
            return EventEmitter2;
          });
        } else if (typeof exports === "object") {
          module.exports = EventEmitter2;
        } else {
          var _global = new Function("", "return this")();
          _global.EventEmitter2 = EventEmitter2;
        }
      }();
    }
  });

  // shared/js/ui/base/notifiers.js
  var require_notifiers = __commonJS({
    "shared/js/ui/base/notifiers.js"(exports, module) {
      "use strict";
      var registered = {};
      function add(notifierName) {
        registered[notifierName] = (state, notification) => {
          if (state === void 0) state = {};
          if (notification.notifierName === notifierName) {
            if (notification.change) {
              return {
                change: notification.change,
                attributes: notification.attributes
              };
            }
            if (notification.action) {
              return {
                action: notification.action,
                data: notification.data,
                attributes: notification.attributes
              };
            }
          } else {
            return state;
          }
        };
      }
      function combine() {
        const keys = Object.keys(registered);
        return function combination(state, notification) {
          const nextState = {};
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (typeof registered[key] !== "function") {
              throw new Error("notifier " + key + "must be a function");
            }
            nextState[key] = registered[key](state[key], notification);
          }
          return nextState;
        };
      }
      function remove(notifier) {
        if (registered[notifier]) {
          delete registered[notifier];
          return true;
        }
      }
      module.exports = {
        registered,
        // object containing each of our notifier funcs auto-generated by .add()
        add,
        // adds a new notifier to `registered`
        combine,
        // similar to Redux combineReducers() function
        remove
        // remove a notifier from `registered` object
      };
    }
  });

  // shared/js/ui/base/store.js
  var require_store = __commonJS({
    "shared/js/ui/base/store.js"(exports, module) {
      "use strict";
      var { isPlainObject } = require_is_plain_object();
      var deepFreeze = require_deep_freeze();
      var EventEmitter2 = require_eventemitter2();
      var notifiers = require_notifiers();
      function register(notifierName) {
        if (typeof notifierName !== "string") {
          throw new Error("notifierName argument must be a string");
        }
        if (notifiers.registered[notifierName]) {
          throw new Error(`notifierName argument must be unique to store ${notifierName} already exists`);
        }
        notifiers.add(notifierName);
        const combinedNotifiers = notifiers.combine();
        if (!_store) {
          _store = _createStore(combinedNotifiers);
          _store.subscribe((notification) => {
            notification = deepFreeze(notification);
            _publish(notification);
          });
        } else {
          _store.replaceNotifier(combinedNotifiers);
        }
      }
      function publish(notification) {
        _store.dispatch(notification);
      }
      var _publisher = new EventEmitter2();
      _publisher.setMaxListeners(100);
      function _publish(notification) {
        if (notification && notification.change) {
          console.info(`STORE NOTIFICATION change:${notification.notifierName}`, notification);
          _publisher.emit(`change:${notification.notifierName}`, notification);
        }
        if (notification && notification.action) {
          console.info(`STORE NOTIFICATION action:${notification.notifierName}`, notification);
          _publisher.emit(`action:${notification.notifierName}`, notification);
        }
      }
      function remove(notifierName) {
        if (notifiers.remove(notifierName)) {
          const combinedNotifiers = notifiers.combine();
          _store.replaceNotifier(combinedNotifiers);
        }
      }
      var _store = null;
      function _createStore(notifier) {
        if (!notifier || typeof notifier !== "function") throw new Error("notifier must be a function");
        let state = {};
        let listener = null;
        let isEmitting = false;
        function dispatch(notification) {
          if (!notification || !isPlainObject(notification)) throw new Error("notification parameter is required and must be a plain object");
          if (!notification.notifierName || typeof notification.notifierName !== "string")
            throw new Error("notifierName property of notification parameter is required and must be a string");
          if (isEmitting) throw new Error("subscribers may not generate notifications");
          isEmitting = true;
          state = notifier(state, notification);
          if (listener) listener(notification);
          isEmitting = false;
          return notification;
        }
        function subscribe(cb) {
          if (!cb || typeof cb !== "function") throw new Error("listener must be a function");
          listener = cb;
        }
        function replaceNotifier(next) {
          if (typeof next !== "function") throw new Error("new notifier must be a function");
          notifier = next;
        }
        dispatch({ notifierName: "@@createStore/INIT" });
        return {
          dispatch,
          subscribe,
          replaceNotifier
        };
      }
      module.exports = {
        register,
        // registers a new notifier to the store (likely a model)
        publish,
        // publish a notification from notifier to subscribers
        subscribe: _publisher,
        // subscribe to notifiers' notifications
        remove
        // remove a notifier from the store
      };
    }
  });

  // shared/js/ui/base/ui-wrapper.js
  var ui_wrapper_exports = {};
  __export(ui_wrapper_exports, {
    backgroundMessage: () => backgroundMessage,
    getExtensionURL: () => getExtensionURL,
    openExtensionPage: () => openExtensionPage,
    sendMessage: () => sendMessage
  });
  var import_webextension_polyfill2, sendMessage, backgroundMessage, getExtensionURL, openExtensionPage;
  var init_ui_wrapper = __esm({
    "shared/js/ui/base/ui-wrapper.js"() {
      "use strict";
      import_webextension_polyfill2 = __toESM(require_browser_polyfill());
      sendMessage = async (messageType, options) => {
        return await import_webextension_polyfill2.default.runtime.sendMessage({ messageType, options });
      };
      backgroundMessage = (thisModel) => {
        import_webextension_polyfill2.default.runtime.onMessage.addListener((req, sender) => {
          if (sender.id !== import_webextension_polyfill2.default.runtime.id) return;
          if (req.updateTabData) thisModel.send("updateTabData");
          if (req.didResetTrackersData) thisModel.send("didResetTrackersData", req.didResetTrackersData);
          if (req.closePopup) window.close();
        });
      };
      getExtensionURL = (path) => {
        return import_webextension_polyfill2.default.runtime.getURL(path);
      };
      openExtensionPage = (path) => {
        import_webextension_polyfill2.default.tabs.create({ url: getExtensionURL(path) });
      };
    }
  });

  // shared/js/ui/base/model.js
  var require_model = __commonJS({
    "shared/js/ui/base/model.js"(exports, module) {
      "use strict";
      var $ = require_jquery();
      var mixins2 = require_mixins();
      var store = require_store();
      var browserUIWrapper = (init_ui_wrapper(), __toCommonJS(ui_wrapper_exports));
      function BaseModel2(attrs) {
        $.extend(this, attrs);
        if (!this.modelName || typeof this.modelName !== "string") {
          throw new Error("cannot init model without `modelName` property");
        } else {
          this.store = store;
          this.store.register(this.modelName);
        }
      }
      BaseModel2.prototype = $.extend({}, mixins2.events, {
        /**
         * Setter method for modifying attributes
         * on the model. Since the attributes
         * are directly accessible + mutable on the object
         * itself, you don't *have* to use the set method.
         *
         * However, the benefit of using the set method
         * is that changes are broadcast out via store
         * to any UI components that might want to observe
         * changes and update their state.
         *
         * @param {string or object} attr
         * @param {*} val
         * @api public
         */
        set: function(attr, val) {
          if (typeof attr === "object") {
            for (const key in attr) {
              this.set(key, attr[key], val);
            }
            return;
          }
          const lastValue = this[attr] || null;
          this[attr] = val;
          if (val) {
            val = JSON.parse(JSON.stringify(val));
          }
          this.store.publish({
            notifierName: this.modelName,
            change: { attribute: attr, value: val, lastValue },
            attributes: this._toJSON()
          });
        },
        /**
         * Convenience method for code clarity
         * so we can explicitly call clear()
         * instead of doing null sets.
         * Using .clear() broadcasts the change
         * out to the rest of the app via this.set()
         * which calls this.store.publish()
         */
        clear: function(attr) {
          this.set(attr, null);
        },
        /**
         * Destroy any of this model's bound events
         * and remove its reducer from store so
         * there is no memeory footprint left.
         * Mostly used when view.destroy() is called.
         */
        destroy: function() {
          this.unbindEvents();
          this.store.remove(this.modelName);
        },
        /**
         * Send message to background
         * this.model.sendMessage(messageType, {...}).then((response) ..
         **/
        sendMessage(messageType, options) {
          return browserUIWrapper.sendMessage(messageType, options);
        },
        /**
         * Send a user action
         * Broadcasts an action to other UI components
         * via notification store
         * @param action {string}
         * @param data {could be a jquery event or other data is optional}
         */
        send: function(action, data) {
          if (!action) throw new Error("model.send() requires an action argument");
          data = data || null;
          if (data) {
            data = JSON.parse(JSON.stringify(data));
          }
          this.store.publish({
            notifierName: this.modelName,
            action,
            data,
            attributes: this._toJSON()
          });
        },
        /**
         * Private method for turning `this` into a
         * JSON object before sending to application store.
         * Basically just weeds out properties that
         * are functions.
         */
        _toJSON: function() {
          const attributes = Object.assign({}, Object.getPrototypeOf(this), this);
          if (attributes.store) delete attributes.store;
          return JSON.parse(JSON.stringify(attributes));
        }
      });
      module.exports = BaseModel2;
    }
  });

  // shared/js/ui/base/page.js
  var require_page = __commonJS({
    "shared/js/ui/base/page.js"(exports, module) {
      "use strict";
      var mixins2 = require_mixins();
      var store = require_store();
      function BasePage2(ops) {
        this.views = {};
        this.store = store;
        this.ready();
      }
      BasePage2.prototype = window.$.extend({}, mixins2.events, {
        // pageName: '' - should be unique, defined by each page subclass
        ready: function() {
        }
      });
      module.exports = BasePage2;
    }
  });

  // shared/js/ui/base/view.js
  var require_view = __commonJS({
    "shared/js/ui/base/view.js"(exports, module) {
      "use strict";
      var $ = require_jquery();
      var mixins2 = require_mixins();
      var store = require_store();
      function BaseView2(ops) {
        this.model = ops.model;
        this.views = this.views || {};
        this.store = store;
        this.$parent = typeof ops.appendTo === "string" ? $(ops.appendTo) : ops.appendTo;
        this.$before = typeof ops.before === "string" ? $(ops.before) : ops.before;
        this.$after = typeof ops.after === "string" ? $(ops.after) : ops.after;
        if (ops.events) {
          for (const id in ops.events) {
            this.on(id, ops.events[id]);
          }
        }
        this._render(ops);
      }
      BaseView2.prototype = $.extend({}, mixins2.events, {
        /***
         * Each view should define a template
         * if it wants to be rendered and added to the DOM.
         *
         * template: '',
         */
        /**
         * Removes the view element (and all child view elements)
         * from the DOM.
         *
         * Should be extended to do any cleanup of child views or
         * unbinding of events.
         */
        destroy: function() {
          this.unbindEvents();
          this.destroyChildViews();
          this.$el.remove();
          if (this.model) this.model.destroy();
        },
        /**
         * Go through the this.views object
         * and recurse down destroying any child
         * views and their child views so that
         * when a view is destroyed it removes all memory
         * footprint, all events are cleanly unbound and
         * all related DOM elements are removed.
         *
         */
        destroyChildViews: function() {
          !function destroyViews(views) {
            if (!views) {
              return;
            }
            let v;
            if ($.isArray(views)) {
              for (let i = 0; i < views.length; i++) {
                v = views[i];
                if (v && $.isArray(v)) {
                  destroyViews(v);
                } else {
                  v && v.destroy && v.destroy();
                }
              }
              views = null;
            } else {
              for (const c in views) {
                v = views[c];
                if (v && $.isArray(v)) {
                  destroyViews(v);
                } else {
                  v && v.destroy && v.destroy();
                }
                delete views[c];
              }
            }
          }(this.views);
          delete this.views;
        },
        /**
         * Take the template defined on the view class and
         * use it to create a DOM element + append it to the DOM.
         *
         * Can be extended with any custom rendering logic
         * a view may need to do.
         *
         * @param {object} ops - the same ops hash passed into the view constructor
         */
        _render: function(ops) {
          if (!this.$el) {
            if (ops && ops.$el) {
              this.$el = ops.$el;
            } else {
              const el = this.template();
              this.$el = $(el);
            }
          }
          if (!this.$el) throw new Error("Template Not Found: " + this.template);
          this._addToDOM();
          this.$ = this.$el.find.bind(this.$el);
        },
        _rerender: function() {
          const $prev = this.$el.prev();
          if ($prev.length) {
            delete this.$parent;
            this.$after = $prev;
          } else {
            const $next = this.$el.next();
            if ($next.length) {
              delete this.$parent;
              this.$before = $next;
            }
          }
          this.$el.remove();
          delete this.$el;
          this._render();
        },
        /**
         * Add the rendered element to the DOM.
         */
        _addToDOM: function() {
          if (this.$parent) {
            this.$parent.append(this.$el);
          } else if (this.$before) {
            this.$before.before(this.$el);
          } else if (this.$after) {
            this.$after.after(this.$el);
          }
        },
        /**
         * Takes a prefix string and an array
         * of elements and caches dom references.
         *
         * It should be used like this:
         *
         * this._cacheElems('.js-detail',['next','prev'])
         * --> this.$next (is cached ref to '.js-detail-next'
         *   this.$prev (is cached ref to '.js-detail-prev'
         *
         * @param {String} prefix
         * @param {Array} elems
         */
        _cacheElems: function(prefix, elems) {
          for (let i = 0; i < elems.length; i++) {
            const selector = prefix + "-" + elems[i];
            const id = "$" + elems[i].replace(/-/g, "");
            this[id] = this.$(selector);
          }
        }
      });
      module.exports = BaseView2;
    }
  });

  // shared/js/ui/base/index.js
  window.$ = window.jQuery = require_jquery();
  var i18next = require_localize();
  var mixins = require_mixins();
  var BaseModel = require_model();
  var BasePage = require_page();
  var BaseView = require_view();
  window.DDG = window.DDG || {};
  window.DDG.base = {
    mixins,
    Model: BaseModel,
    Page: BasePage,
    utils: {},
    View: BaseView,
    i18n: i18next
  };
})();
/*! Bundled license information:

jquery/dist/jquery.js:
  (*!
   * jQuery JavaScript Library v3.7.1
   * https://jquery.com/
   *
   * Copyright OpenJS Foundation and other contributors
   * Released under the MIT license
   * https://jquery.org/license
   *
   * Date: 2023-08-28T13:37Z
   *)

is-plain-object/dist/is-plain-object.js:
  (*!
   * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   *)

eventemitter2/lib/eventemitter2.js:
  (*!
   * EventEmitter2
   * https://github.com/hij1nx/EventEmitter2
   *
   * Copyright (c) 2013 hij1nx
   * Licensed under the MIT license.
   *)
*/
