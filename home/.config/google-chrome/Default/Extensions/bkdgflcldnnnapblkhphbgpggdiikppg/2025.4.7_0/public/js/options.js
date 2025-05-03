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

  // shared/js/ui/pages/mixins/set-browser-class.js
  var require_set_browser_class = __commonJS({
    "shared/js/ui/pages/mixins/set-browser-class.js"(exports2, module2) {
      "use strict";
      module2.exports = {
        setBrowserClassOnBodyTag: function() {
          window.chrome.runtime.sendMessage({ messageType: "getBrowser" }, (browserName2) => {
            if (["edg", "edge", "brave"].includes(browserName2)) {
              browserName2 = "chrome";
            }
            const browserClass = "is-browser--" + browserName2;
            window.$("html").addClass(browserClass);
            window.$("body").addClass(browserClass);
          });
        }
      };
    }
  });

  // shared/js/ui/pages/mixins/parse-query-string.js
  var require_parse_query_string = __commonJS({
    "shared/js/ui/pages/mixins/parse-query-string.js"(exports2, module2) {
      "use strict";
      module2.exports = {
        parseQueryString: (qs) => {
          if (typeof qs !== "string") {
            throw new Error("tried to parse a non-string query string");
          }
          const parsed = {};
          if (qs[0] === "?") {
            qs = qs.substr(1);
          }
          const parts = qs.split("&");
          parts.forEach((part) => {
            const [key, val] = part.split("=");
            if (key && val) {
              parsed[key] = val;
            }
          });
          return parsed;
        }
      };
    }
  });

  // shared/js/ui/pages/mixins/index.js
  var require_mixins = __commonJS({
    "shared/js/ui/pages/mixins/index.js"(exports2, module2) {
      "use strict";
      module2.exports = {
        setBrowserClassOnBodyTag: require_set_browser_class(),
        parseQueryString: require_parse_query_string()
      };
    }
  });

  // shared/js/ui/views/privacy-options.js
  var require_privacy_options = __commonJS({
    "shared/js/ui/views/privacy-options.js"(exports2, module2) {
      "use strict";
      var Parent2 = window.DDG.base.View;
      function PrivacyOptions(ops) {
        this.model = ops.model;
        this.pageView = ops.pageView;
        this.template = ops.template;
        Parent2.call(this, ops);
        this.model.getState().then(() => {
          this.rerender();
        });
      }
      PrivacyOptions.prototype = window.$.extend({}, Parent2.prototype, {
        _clickSetting: function(e) {
          const key = window.$(e.target).data("key") || window.$(e.target).parent().data("key");
          console.log(`privacyOptions view click for setting "${key}"`);
          this.model.toggle(key);
          this.rerender();
        },
        setup: function() {
          this._cacheElems(".js-options", [
            "blocktrackers",
            "https-everywhere-enabled",
            "embedded-tweets-enabled",
            "gpc-enabled",
            "youtube-previews-enabled",
            "firebutton-clear-history-enabled",
            "firebutton-tabclear-enabled"
          ]);
          this.bindEvents([
            [this.$blocktrackers, "click", this._clickSetting],
            [this.$httpseverywhereenabled, "click", this._clickSetting],
            [this.$embeddedtweetsenabled, "click", this._clickSetting],
            [this.$gpcenabled, "click", this._clickSetting],
            [this.$youtubepreviewsenabled, "click", this._clickSetting],
            [this.$firebuttonclearhistoryenabled, "click", this._clickSetting],
            [this.$firebuttontabclearenabled, "click", this._clickSetting]
          ]);
        },
        rerender: function() {
          this.unbindEvents();
          this._rerender();
          this.setup();
        }
      });
      module2.exports = PrivacyOptions;
    }
  });

  // shared/js/ui/models/privacy-options.js
  var require_privacy_options2 = __commonJS({
    "shared/js/ui/models/privacy-options.js"(exports2, module2) {
      "use strict";
      var Parent2 = window.DDG.base.Model;
      function PrivacyOptions(attrs) {
        attrs.httpsEverywhereEnabled = true;
        attrs.embeddedTweetsEnabled = false;
        attrs.GPC = false;
        attrs.youtubeClickToLoadEnabled = false;
        attrs.youtubePreviewsEnabled = false;
        attrs.fireButtonClearHistoryEnabled = true;
        attrs.fireButtonTabClearEnabled = true;
        Parent2.call(this, attrs);
      }
      PrivacyOptions.prototype = window.$.extend({}, Parent2.prototype, {
        modelName: "privacyOptions",
        toggle: function(k) {
          if (Object.hasOwnProperty.call(this, k)) {
            this[k] = !this[k];
            console.log(`PrivacyOptions model toggle ${k} is now ${this[k]}`);
            this.sendMessage("updateSetting", { name: k, value: this[k] });
          }
        },
        async getState() {
          const [settings14, youtubeClickToLoadEnabled] = await Promise.all([
            this.sendMessage("getSetting", "all"),
            this.sendMessage("isClickToLoadYoutubeEnabled")
          ]);
          this.httpsEverywhereEnabled = settings14.httpsEverywhereEnabled;
          this.embeddedTweetsEnabled = settings14.embeddedTweetsEnabled;
          this.GPC = settings14.GPC;
          this.youtubeClickToLoadEnabled = youtubeClickToLoadEnabled;
          this.youtubePreviewsEnabled = settings14.youtubePreviewsEnabled;
          this.fireButtonEnabled = true;
          this.fireButtonClearHistoryEnabled = settings14.fireButtonClearHistoryEnabled;
          this.fireButtonTabClearEnabled = settings14.fireButtonTabClearEnabled;
        }
      });
      module2.exports = PrivacyOptions;
    }
  });

  // node_modules/hyperscript-attribute-to-property/index.js
  var require_hyperscript_attribute_to_property = __commonJS({
    "node_modules/hyperscript-attribute-to-property/index.js"(exports2, module2) {
      module2.exports = attributeToProperty;
      var transform = {
        "class": "className",
        "for": "htmlFor",
        "http-equiv": "httpEquiv"
      };
      function attributeToProperty(h) {
        return function(tagName, attrs, children) {
          for (var attr in attrs) {
            if (attr in transform) {
              attrs[transform[attr]] = attrs[attr];
              delete attrs[attr];
            }
          }
          return h(tagName, attrs, children);
        };
      }
    }
  });

  // node_modules/hyperx/index.js
  var require_hyperx = __commonJS({
    "node_modules/hyperx/index.js"(exports2, module2) {
      var attrToProp = require_hyperscript_attribute_to_property();
      var VAR = 0;
      var TEXT = 1;
      var OPEN = 2;
      var CLOSE = 3;
      var ATTR = 4;
      var ATTR_KEY = 5;
      var ATTR_KEY_W = 6;
      var ATTR_VALUE_W = 7;
      var ATTR_VALUE = 8;
      var ATTR_VALUE_SQ = 9;
      var ATTR_VALUE_DQ = 10;
      var ATTR_EQ = 11;
      var ATTR_BREAK = 12;
      var COMMENT = 13;
      module2.exports = function(h, opts) {
        if (!opts) opts = {};
        var concat = opts.concat || function(a, b) {
          return String(a) + String(b);
        };
        if (opts.attrToProp !== false) {
          h = attrToProp(h);
        }
        return function(strings) {
          var state = TEXT, reg = "";
          var arglen = arguments.length;
          var parts = [];
          for (var i = 0; i < strings.length; i++) {
            if (i < arglen - 1) {
              var arg = arguments[i + 1];
              var p = parse2(strings[i]);
              var xstate = state;
              if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE;
              if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE;
              if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE;
              if (xstate === ATTR) xstate = ATTR_KEY;
              if (xstate === OPEN) {
                if (reg === "/") {
                  p.push([OPEN, "/", arg]);
                  reg = "";
                } else {
                  p.push([OPEN, arg]);
                }
              } else if (xstate === COMMENT && opts.comments) {
                reg += String(arg);
              } else if (xstate !== COMMENT) {
                p.push([VAR, xstate, arg]);
              }
              parts.push.apply(parts, p);
            } else parts.push.apply(parts, parse2(strings[i]));
          }
          var tree = [null, {}, []];
          var stack = [[tree, -1]];
          for (var i = 0; i < parts.length; i++) {
            var cur = stack[stack.length - 1][0];
            var p = parts[i], s = p[0];
            if (s === OPEN && /^\//.test(p[1])) {
              var ix = stack[stack.length - 1][1];
              if (stack.length > 1) {
                stack.pop();
                stack[stack.length - 1][0][2][ix] = h(
                  cur[0],
                  cur[1],
                  cur[2].length ? cur[2] : void 0
                );
              }
            } else if (s === OPEN) {
              var c = [p[1], {}, []];
              cur[2].push(c);
              stack.push([c, cur[2].length - 1]);
            } else if (s === ATTR_KEY || s === VAR && p[1] === ATTR_KEY) {
              var key = "";
              var copyKey;
              for (; i < parts.length; i++) {
                if (parts[i][0] === ATTR_KEY) {
                  key = concat(key, parts[i][1]);
                } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
                  if (typeof parts[i][2] === "object" && !key) {
                    for (copyKey in parts[i][2]) {
                      if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                        cur[1][copyKey] = parts[i][2][copyKey];
                      }
                    }
                  } else {
                    key = concat(key, parts[i][2]);
                  }
                } else break;
              }
              if (parts[i][0] === ATTR_EQ) i++;
              var j = i;
              for (; i < parts.length; i++) {
                if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
                  if (!cur[1][key]) cur[1][key] = strfn(parts[i][1]);
                  else parts[i][1] === "" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
                } else if (parts[i][0] === VAR && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
                  if (!cur[1][key]) cur[1][key] = strfn(parts[i][2]);
                  else parts[i][2] === "" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
                } else {
                  if (key.length && !cur[1][key] && i === j && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
                    cur[1][key] = key.toLowerCase();
                  }
                  if (parts[i][0] === CLOSE) {
                    i--;
                  }
                  break;
                }
              }
            } else if (s === ATTR_KEY) {
              cur[1][p[1]] = true;
            } else if (s === VAR && p[1] === ATTR_KEY) {
              cur[1][p[2]] = true;
            } else if (s === CLOSE) {
              if (selfClosing(cur[0]) && stack.length) {
                var ix = stack[stack.length - 1][1];
                stack.pop();
                stack[stack.length - 1][0][2][ix] = h(
                  cur[0],
                  cur[1],
                  cur[2].length ? cur[2] : void 0
                );
              }
            } else if (s === VAR && p[1] === TEXT) {
              if (p[2] === void 0 || p[2] === null) p[2] = "";
              else if (!p[2]) p[2] = concat("", p[2]);
              if (Array.isArray(p[2][0])) {
                cur[2].push.apply(cur[2], p[2]);
              } else {
                cur[2].push(p[2]);
              }
            } else if (s === TEXT) {
              cur[2].push(p[1]);
            } else if (s === ATTR_EQ || s === ATTR_BREAK) {
            } else {
              throw new Error("unhandled: " + s);
            }
          }
          if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
            tree[2].shift();
          }
          if (tree[2].length > 2 || tree[2].length === 2 && /\S/.test(tree[2][1])) {
            if (opts.createFragment) return opts.createFragment(tree[2]);
            throw new Error(
              "multiple root elements must be wrapped in an enclosing tag"
            );
          }
          if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === "string" && Array.isArray(tree[2][0][2])) {
            tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2]);
          }
          return tree[2][0];
          function parse2(str) {
            var res = [];
            if (state === ATTR_VALUE_W) state = ATTR;
            for (var i2 = 0; i2 < str.length; i2++) {
              var c2 = str.charAt(i2);
              if (state === TEXT && c2 === "<") {
                if (reg.length) res.push([TEXT, reg]);
                reg = "";
                state = OPEN;
              } else if (c2 === ">" && !quot(state) && state !== COMMENT) {
                if (state === OPEN && reg.length) {
                  res.push([OPEN, reg]);
                } else if (state === ATTR_KEY) {
                  res.push([ATTR_KEY, reg]);
                } else if (state === ATTR_VALUE && reg.length) {
                  res.push([ATTR_VALUE, reg]);
                }
                res.push([CLOSE]);
                reg = "";
                state = TEXT;
              } else if (state === COMMENT && /-$/.test(reg) && c2 === "-") {
                if (opts.comments) {
                  res.push([ATTR_VALUE, reg.substr(0, reg.length - 1)]);
                }
                reg = "";
                state = TEXT;
              } else if (state === OPEN && /^!--$/.test(reg)) {
                if (opts.comments) {
                  res.push([OPEN, reg], [ATTR_KEY, "comment"], [ATTR_EQ]);
                }
                reg = c2;
                state = COMMENT;
              } else if (state === TEXT || state === COMMENT) {
                reg += c2;
              } else if (state === OPEN && c2 === "/" && reg.length) {
              } else if (state === OPEN && /\s/.test(c2)) {
                if (reg.length) {
                  res.push([OPEN, reg]);
                }
                reg = "";
                state = ATTR;
              } else if (state === OPEN) {
                reg += c2;
              } else if (state === ATTR && /[^\s"'=/]/.test(c2)) {
                state = ATTR_KEY;
                reg = c2;
              } else if (state === ATTR && /\s/.test(c2)) {
                if (reg.length) res.push([ATTR_KEY, reg]);
                res.push([ATTR_BREAK]);
              } else if (state === ATTR_KEY && /\s/.test(c2)) {
                res.push([ATTR_KEY, reg]);
                reg = "";
                state = ATTR_KEY_W;
              } else if (state === ATTR_KEY && c2 === "=") {
                res.push([ATTR_KEY, reg], [ATTR_EQ]);
                reg = "";
                state = ATTR_VALUE_W;
              } else if (state === ATTR_KEY) {
                reg += c2;
              } else if ((state === ATTR_KEY_W || state === ATTR) && c2 === "=") {
                res.push([ATTR_EQ]);
                state = ATTR_VALUE_W;
              } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c2)) {
                res.push([ATTR_BREAK]);
                if (/[\w-]/.test(c2)) {
                  reg += c2;
                  state = ATTR_KEY;
                } else state = ATTR;
              } else if (state === ATTR_VALUE_W && c2 === '"') {
                state = ATTR_VALUE_DQ;
              } else if (state === ATTR_VALUE_W && c2 === "'") {
                state = ATTR_VALUE_SQ;
              } else if (state === ATTR_VALUE_DQ && c2 === '"') {
                res.push([ATTR_VALUE, reg], [ATTR_BREAK]);
                reg = "";
                state = ATTR;
              } else if (state === ATTR_VALUE_SQ && c2 === "'") {
                res.push([ATTR_VALUE, reg], [ATTR_BREAK]);
                reg = "";
                state = ATTR;
              } else if (state === ATTR_VALUE_W && !/\s/.test(c2)) {
                state = ATTR_VALUE;
                i2--;
              } else if (state === ATTR_VALUE && /\s/.test(c2)) {
                res.push([ATTR_VALUE, reg], [ATTR_BREAK]);
                reg = "";
                state = ATTR;
              } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ) {
                reg += c2;
              }
            }
            if (state === TEXT && reg.length) {
              res.push([TEXT, reg]);
              reg = "";
            } else if (state === ATTR_VALUE && reg.length) {
              res.push([ATTR_VALUE, reg]);
              reg = "";
            } else if (state === ATTR_VALUE_DQ && reg.length) {
              res.push([ATTR_VALUE, reg]);
              reg = "";
            } else if (state === ATTR_VALUE_SQ && reg.length) {
              res.push([ATTR_VALUE, reg]);
              reg = "";
            } else if (state === ATTR_KEY) {
              res.push([ATTR_KEY, reg]);
              reg = "";
            }
            return res;
          }
        };
        function strfn(x) {
          if (typeof x === "function") return x;
          else if (typeof x === "string") return x;
          else if (x && typeof x === "object") return x;
          else if (x === null || x === void 0) return x;
          else return concat("", x);
        }
      };
      function quot(state) {
        return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ;
      }
      var closeRE = RegExp("^(" + [
        "area",
        "base",
        "basefont",
        "bgsound",
        "br",
        "col",
        "command",
        "embed",
        "frame",
        "hr",
        "img",
        "input",
        "isindex",
        "keygen",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr",
        "!--",
        // SVG TAGS
        "animate",
        "animateTransform",
        "circle",
        "cursor",
        "desc",
        "ellipse",
        "feBlend",
        "feColorMatrix",
        "feComposite",
        "feConvolveMatrix",
        "feDiffuseLighting",
        "feDisplacementMap",
        "feDistantLight",
        "feFlood",
        "feFuncA",
        "feFuncB",
        "feFuncG",
        "feFuncR",
        "feGaussianBlur",
        "feImage",
        "feMergeNode",
        "feMorphology",
        "feOffset",
        "fePointLight",
        "feSpecularLighting",
        "feSpotLight",
        "feTile",
        "feTurbulence",
        "font-face-format",
        "font-face-name",
        "font-face-uri",
        "glyph",
        "glyphRef",
        "hkern",
        "image",
        "line",
        "missing-glyph",
        "mpath",
        "path",
        "polygon",
        "polyline",
        "rect",
        "set",
        "stop",
        "tref",
        "use",
        "view",
        "vkern"
      ].join("|") + ")(?:[.#][a-zA-Z0-9\x7F-\uFFFF_:-]+)*$");
      function selfClosing(tag) {
        return closeRE.test(tag);
      }
    }
  });

  // node_modules/nanohtml/lib/append-child.js
  var require_append_child = __commonJS({
    "node_modules/nanohtml/lib/append-child.js"(exports2, module2) {
      "use strict";
      var trailingNewlineRegex = /\n[\s]+$/;
      var leadingNewlineRegex = /^\n[\s]+/;
      var trailingSpaceRegex = /[\s]+$/;
      var leadingSpaceRegex = /^[\s]+/;
      var multiSpaceRegex = /[\n\s]+/g;
      var TEXT_TAGS = [
        "a",
        "abbr",
        "b",
        "bdi",
        "bdo",
        "br",
        "cite",
        "data",
        "dfn",
        "em",
        "i",
        "kbd",
        "mark",
        "q",
        "rp",
        "rt",
        "rtc",
        "ruby",
        "s",
        "amp",
        "small",
        "span",
        "strong",
        "sub",
        "sup",
        "time",
        "u",
        "var",
        "wbr"
      ];
      var VERBATIM_TAGS = [
        "code",
        "pre",
        "textarea"
      ];
      module2.exports = function appendChild(el, childs) {
        if (!Array.isArray(childs)) return;
        var nodeName = el.nodeName.toLowerCase();
        var hadText = false;
        var value, leader;
        for (var i = 0, len = childs.length; i < len; i++) {
          var node = childs[i];
          if (Array.isArray(node)) {
            appendChild(el, node);
            continue;
          }
          if (typeof node === "number" || typeof node === "boolean" || typeof node === "function" || node instanceof Date || node instanceof RegExp) {
            node = node.toString();
          }
          var lastChild = el.childNodes[el.childNodes.length - 1];
          if (typeof node === "string") {
            hadText = true;
            if (lastChild && lastChild.nodeName === "#text") {
              lastChild.nodeValue += node;
            } else {
              node = el.ownerDocument.createTextNode(node);
              el.appendChild(node);
              lastChild = node;
            }
            if (i === len - 1) {
              hadText = false;
              if (TEXT_TAGS.indexOf(nodeName) === -1 && VERBATIM_TAGS.indexOf(nodeName) === -1) {
                value = lastChild.nodeValue.replace(leadingNewlineRegex, "").replace(trailingSpaceRegex, "").replace(trailingNewlineRegex, "").replace(multiSpaceRegex, " ");
                if (value === "") {
                  el.removeChild(lastChild);
                } else {
                  lastChild.nodeValue = value;
                }
              } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
                leader = i === 0 ? "" : " ";
                value = lastChild.nodeValue.replace(leadingNewlineRegex, leader).replace(leadingSpaceRegex, " ").replace(trailingSpaceRegex, "").replace(trailingNewlineRegex, "").replace(multiSpaceRegex, " ");
                lastChild.nodeValue = value;
              }
            }
          } else if (node && node.nodeType) {
            if (hadText) {
              hadText = false;
              if (TEXT_TAGS.indexOf(nodeName) === -1 && VERBATIM_TAGS.indexOf(nodeName) === -1) {
                value = lastChild.nodeValue.replace(leadingNewlineRegex, "").replace(trailingNewlineRegex, " ").replace(multiSpaceRegex, " ");
                if (value === "") {
                  el.removeChild(lastChild);
                } else {
                  lastChild.nodeValue = value;
                }
              } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
                value = lastChild.nodeValue.replace(leadingSpaceRegex, " ").replace(leadingNewlineRegex, "").replace(trailingNewlineRegex, " ").replace(multiSpaceRegex, " ");
                lastChild.nodeValue = value;
              }
            }
            var _nodeName = node.nodeName;
            if (_nodeName) nodeName = _nodeName.toLowerCase();
            el.appendChild(node);
          }
        }
      };
    }
  });

  // node_modules/nanohtml/lib/svg-tags.js
  var require_svg_tags = __commonJS({
    "node_modules/nanohtml/lib/svg-tags.js"(exports2, module2) {
      "use strict";
      module2.exports = [
        "svg",
        "altGlyph",
        "altGlyphDef",
        "altGlyphItem",
        "animate",
        "animateColor",
        "animateMotion",
        "animateTransform",
        "circle",
        "clipPath",
        "color-profile",
        "cursor",
        "defs",
        "desc",
        "ellipse",
        "feBlend",
        "feColorMatrix",
        "feComponentTransfer",
        "feComposite",
        "feConvolveMatrix",
        "feDiffuseLighting",
        "feDisplacementMap",
        "feDistantLight",
        "feFlood",
        "feFuncA",
        "feFuncB",
        "feFuncG",
        "feFuncR",
        "feGaussianBlur",
        "feImage",
        "feMerge",
        "feMergeNode",
        "feMorphology",
        "feOffset",
        "fePointLight",
        "feSpecularLighting",
        "feSpotLight",
        "feTile",
        "feTurbulence",
        "filter",
        "font",
        "font-face",
        "font-face-format",
        "font-face-name",
        "font-face-src",
        "font-face-uri",
        "foreignObject",
        "g",
        "glyph",
        "glyphRef",
        "hkern",
        "image",
        "line",
        "linearGradient",
        "marker",
        "mask",
        "metadata",
        "missing-glyph",
        "mpath",
        "path",
        "pattern",
        "polygon",
        "polyline",
        "radialGradient",
        "rect",
        "set",
        "stop",
        "switch",
        "symbol",
        "text",
        "textPath",
        "title",
        "tref",
        "tspan",
        "use",
        "view",
        "vkern"
      ];
    }
  });

  // node_modules/nanohtml/lib/bool-props.js
  var require_bool_props = __commonJS({
    "node_modules/nanohtml/lib/bool-props.js"(exports2, module2) {
      "use strict";
      module2.exports = [
        "async",
        "autofocus",
        "autoplay",
        "checked",
        "controls",
        "default",
        "defaultchecked",
        "defer",
        "disabled",
        "formnovalidate",
        "hidden",
        "ismap",
        "loop",
        "multiple",
        "muted",
        "novalidate",
        "open",
        "playsinline",
        "readonly",
        "required",
        "reversed",
        "selected"
      ];
    }
  });

  // node_modules/nanohtml/lib/direct-props.js
  var require_direct_props = __commonJS({
    "node_modules/nanohtml/lib/direct-props.js"(exports2, module2) {
      "use strict";
      module2.exports = [
        "indeterminate"
      ];
    }
  });

  // node_modules/nanohtml/lib/dom.js
  var require_dom = __commonJS({
    "node_modules/nanohtml/lib/dom.js"(exports2, module2) {
      "use strict";
      var hyperx = require_hyperx();
      var appendChild = require_append_child();
      var SVG_TAGS = require_svg_tags();
      var BOOL_PROPS = require_bool_props();
      var DIRECT_PROPS = require_direct_props();
      var SVGNS = "http://www.w3.org/2000/svg";
      var XLINKNS = "http://www.w3.org/1999/xlink";
      var COMMENT_TAG = "!--";
      module2.exports = function(document2) {
        function nanoHtmlCreateElement(tag, props, children) {
          var el;
          if (SVG_TAGS.indexOf(tag) !== -1) {
            props.namespace = SVGNS;
          }
          var ns = false;
          if (props.namespace) {
            ns = props.namespace;
            delete props.namespace;
          }
          var isCustomElement = false;
          if (props.is) {
            isCustomElement = props.is;
            delete props.is;
          }
          if (ns) {
            if (isCustomElement) {
              el = document2.createElementNS(ns, tag, { is: isCustomElement });
            } else {
              el = document2.createElementNS(ns, tag);
            }
          } else if (tag === COMMENT_TAG) {
            return document2.createComment(props.comment);
          } else if (isCustomElement) {
            el = document2.createElement(tag, { is: isCustomElement });
          } else {
            el = document2.createElement(tag);
          }
          for (var p in props) {
            if (props.hasOwnProperty(p)) {
              var key = p.toLowerCase();
              var val = props[p];
              if (key === "classname") {
                key = "class";
                p = "class";
              }
              if (p === "htmlFor") {
                p = "for";
              }
              if (BOOL_PROPS.indexOf(key) !== -1) {
                if (String(val) === "true") val = key;
                else if (String(val) === "false") continue;
              }
              if (key.slice(0, 2) === "on" || DIRECT_PROPS.indexOf(key) !== -1) {
                el[p] = val;
              } else {
                if (ns) {
                  if (p === "xlink:href") {
                    el.setAttributeNS(XLINKNS, p, val);
                  } else if (/^xmlns($|:)/i.test(p)) {
                  } else {
                    el.setAttributeNS(null, p, val);
                  }
                } else {
                  el.setAttribute(p, val);
                }
              }
            }
          }
          appendChild(el, children);
          return el;
        }
        function createFragment(nodes) {
          var fragment = document2.createDocumentFragment();
          for (var i = 0; i < nodes.length; i++) {
            if (nodes[i] == null) continue;
            if (Array.isArray(nodes[i])) {
              fragment.appendChild(createFragment(nodes[i]));
            } else {
              if (typeof nodes[i] === "string") nodes[i] = document2.createTextNode(nodes[i]);
              fragment.appendChild(nodes[i]);
            }
          }
          return fragment;
        }
        var exports3 = hyperx(nanoHtmlCreateElement, {
          comments: true,
          createFragment
        });
        exports3.default = exports3;
        exports3.createComment = nanoHtmlCreateElement;
        return exports3;
      };
    }
  });

  // node_modules/nanohtml/lib/browser.js
  var require_browser = __commonJS({
    "node_modules/nanohtml/lib/browser.js"(exports2, module2) {
      module2.exports = require_dom()(document);
    }
  });

  // node_modules/nanohtml/lib/raw-browser.js
  var require_raw_browser = __commonJS({
    "node_modules/nanohtml/lib/raw-browser.js"(exports2, module2) {
      "use strict";
      function nanohtmlRawBrowser(tag) {
        var el = document.createElement("div");
        el.innerHTML = tag;
        return toArray(el.childNodes);
      }
      function toArray(arr) {
        return Array.isArray(arr) ? arr : [].slice.call(arr);
      }
      module2.exports = nanohtmlRawBrowser;
    }
  });

  // shared/js/ui/templates/shared/toggle-button.js
  var require_toggle_button = __commonJS({
    "shared/js/ui/templates/shared/toggle-button.js"(exports2, module2) {
      "use strict";
      var bel2 = require_browser();
      module2.exports = function(isActiveBoolean, klass, dataKey) {
        klass = klass || "";
        dataKey = dataKey || "";
        return bel2`
<button class="toggle-button toggle-button--is-active-${isActiveBoolean} ${klass}"
    data-key="${dataKey}"
    type="button"
    aria-pressed="${isActiveBoolean ? "true" : "false"}"
    >
    <div class="toggle-button__bg">
    </div>
    <div class="toggle-button__knob"></div>
</button>`;
      };
    }
  });

  // shared/js/ui/templates/privacy-options.js
  var require_privacy_options3 = __commonJS({
    "shared/js/ui/templates/privacy-options.js"(exports2, module2) {
      "use strict";
      var bel2 = require_browser();
      var raw = require_raw_browser();
      var toggleButton = require_toggle_button();
      var t2 = window.DDG.base.i18n.t;
      module2.exports = function() {
        return bel2`<section class="options-content__privacy divider-bottom">
    <h2 class="menu-title">${t2("shared:options.title")}</h2>
    <ul class="default-list">
        <li>
            ${t2("options:showEmbeddedTweets.title")}
            ${toggleButton(this.model.embeddedTweetsEnabled, "js-options-embedded-tweets-enabled", "embeddedTweetsEnabled")}
        </li>
        <li class="options-content__gpc-enabled">
            <h2 class="menu-title">${t2("options:globalPrivacyControlAbbr.title")}</h2>
            <p class="menu-paragraph">
                ${t2("options:globalPrivacyControlDesc.title")}
            </p>
            <ul>
                <li>
                    ${t2("options:notSellYourPersonalData.title")}
                </li>
                <li>
                    ${t2("options:limitSharingOfPersonalData.title")}
                </li>
            </ul>
            ${t2("options:globalPrivacyControlAbbr.title")}
            ${toggleButton(this.model.GPC, "js-options-gpc-enabled", "GPC")}
            <p class="gpc-disclaimer">
                ${raw(t2("options:globalPrivacyControlDisclaimer.title"))}
            </p>
            <p class="options-info">
                <a href="https://duckduckgo.com/global-privacy-control-learn-more">${t2("shared:learnMore.title")}</a>
            </p>
        </li>
    </ul>
    <ul class="default-list${this.model.youtubeClickToLoadEnabled ? "" : " is-hidden"}">
        <li>
            <h2 class="menu-title">
                ${t2("options:enableYoutubePreviews.title")}
                ${toggleButton(this.model.youtubePreviewsEnabled, "js-options-youtube-previews-enabled", "youtubePreviewsEnabled")}
            </h2>
            <p class="menu-paragraph">
                ${raw(t2("options:enableYoutubePreviewsDesc.title"))}
                <a href="https://help.duckduckgo.com/duckduckgo-help-pages/privacy/embedded-content-protection/">${t2("shared:learnMore.title")}</a>
            </p>
        </li>
    </ul>
    <ul class="default-list${this.model.fireButtonEnabled ? "" : " is-hidden"}">
        <li>
            <h2 class="menu-title fire-title">
                ${t2("options:fireButtonHeading.title")}
            </h2>
            <p class="menu-paragraph">
                ${t2("options:fireButtonDesc.title")}
            </p>
            <p class="options-info">
                <a href="https://help.duckduckgo.com/duckduckgo-help-pages/privacy/web-tracking-protections/#the-fire-button">${t2("shared:learnMore.title")}</a>
            </p>
        </li>
        <li class="fire-button-toggle">
            ${t2("options:fireButtonClearHistoryTitle.title")}
            ${toggleButton(
          this.model.fireButtonClearHistoryEnabled,
          "js-options-firebutton-clear-history-enabled",
          "fireButtonClearHistoryEnabled"
        )}
        </li>
        <li>
            <p class="menu-paragraph">${t2("options:fireButtonClearHistoryDesc.title")}</p>
        </li>
        <li class="fire-button-toggle">
            ${t2("options:fireButtonTabClosureTitle.title")}
            ${toggleButton(this.model.fireButtonTabClearEnabled, "js-options-firebutton-tabclear-enabled", "fireButtonTabClearEnabled")}
        </li>
    </ul>
</section>`;
      };
    }
  });

  // shared/js/ui/templates/allowlist-items.js
  var require_allowlist_items = __commonJS({
    "shared/js/ui/templates/allowlist-items.js"(exports2, module2) {
      "use strict";
      var bel2 = require_browser();
      var t2 = window.DDG.base.i18n.t;
      module2.exports = function(list) {
        if (list.length > 0) {
          let i = 0;
          return bel2`${list.map(
            (dom) => bel2`
<li class="js-allowlist-list-item">
    <a class="link-secondary" href="https://${dom}">${dom}</a>
    <button class="remove pull-right js-allowlist-remove" data-item="${i++}">×</button>
</li>`
          )}`;
        }
        return bel2`<li>${t2("options:noUnprotectedSitesAdded.title")}</li>`;
      };
    }
  });

  // shared/js/ui/views/allowlist.js
  var require_allowlist = __commonJS({
    "shared/js/ui/views/allowlist.js"(exports2, module2) {
      "use strict";
      var Parent2 = window.DDG.base.View;
      var isHiddenClass = "is-hidden";
      var isDisabledClass = "is-disabled";
      var isInvalidInputClass = "is-invalid-input";
      var allowlistItemsTemplate = require_allowlist_items();
      function Allowlist(ops) {
        this.model = ops.model;
        this.pageView = ops.pageView;
        this.template = ops.template;
        Parent2.call(this, ops);
        this.setup();
      }
      Allowlist.prototype = window.$.extend({}, Parent2.prototype, {
        _removeItem: function(e) {
          const itemIndex = window.$(e.target).data("item");
          this.model.removeDomain(itemIndex);
          this._renderList();
        },
        _addItem: function(e) {
          if (!this.$add.hasClass(isDisabledClass)) {
            const url = this.$url.val();
            let isValidInput = false;
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
        _showErrorMessage: function() {
          this.$add.addClass(isHiddenClass);
          this.$error.removeClass(isHiddenClass);
          this.$url.addClass(isInvalidInputClass);
        },
        _hideErrorMessage: function() {
          this.$add.removeClass(isHiddenClass);
          this.$error.addClass(isHiddenClass);
          this.$url.removeClass(isInvalidInputClass);
        },
        _manageInputChange: function(e) {
          const isButtonDisabled = this.$add.hasClass(isDisabledClass);
          this._hideErrorMessage();
          if (this.$url.val() && isButtonDisabled) {
            this.$add.removeClass(isDisabledClass);
          } else if (!this.$url.val()) {
            this.$add.addClass(isDisabledClass);
          }
          if (!isButtonDisabled && e.key === "Enter") {
            this._addItem();
          }
        },
        _showAddToAllowlistInput: function(e) {
          this.$url.removeClass(isHiddenClass);
          this.$url.focus();
          this.$add.removeClass(isHiddenClass);
          this.$showadd.addClass(isHiddenClass);
          e.preventDefault();
        },
        setup: function() {
          this._cacheElems(".js-allowlist", ["remove", "add", "error", "show-add", "container", "list-item", "url"]);
          this.bindEvents([
            [this.$remove, "click", this._removeItem],
            [this.$add, "click", this._addItem],
            [this.$showadd, "click", this._showAddToAllowlistInput],
            [this.$url, "keyup", this._manageInputChange],
            // listen to changes to the allowlist model
            [this.store.subscribe, "change:allowlist", this.rerender]
          ]);
        },
        rerender: function() {
          this.unbindEvents();
          this._rerender();
          this.setup();
        },
        _renderList: function() {
          this.unbindEvents();
          this.$container.html(allowlistItemsTemplate(this.model.list));
          this.setup();
        }
      });
      module2.exports = Allowlist;
    }
  });

  // node_modules/tldts/dist/cjs/index.js
  var require_cjs = __commonJS({
    "node_modules/tldts/dist/cjs/index.js"(exports2) {
      "use strict";
      function shareSameDomainSuffix(hostname, vhost) {
        if (hostname.endsWith(vhost)) {
          return hostname.length === vhost.length || hostname[hostname.length - vhost.length - 1] === ".";
        }
        return false;
      }
      function extractDomainWithSuffix(hostname, publicSuffix) {
        const publicSuffixIndex = hostname.length - publicSuffix.length - 2;
        const lastDotBeforeSuffixIndex = hostname.lastIndexOf(".", publicSuffixIndex);
        if (lastDotBeforeSuffixIndex === -1) {
          return hostname;
        }
        return hostname.slice(lastDotBeforeSuffixIndex + 1);
      }
      function getDomain$1(suffix, hostname, options) {
        if (options.validHosts !== null) {
          const validHosts = options.validHosts;
          for (const vhost of validHosts) {
            if (
              /*@__INLINE__*/
              shareSameDomainSuffix(hostname, vhost)
            ) {
              return vhost;
            }
          }
        }
        let numberOfLeadingDots = 0;
        if (hostname.startsWith(".")) {
          while (numberOfLeadingDots < hostname.length && hostname[numberOfLeadingDots] === ".") {
            numberOfLeadingDots += 1;
          }
        }
        if (suffix.length === hostname.length - numberOfLeadingDots) {
          return null;
        }
        return (
          /*@__INLINE__*/
          extractDomainWithSuffix(hostname, suffix)
        );
      }
      function getDomainWithoutSuffix$1(domain, suffix) {
        return domain.slice(0, -suffix.length - 1);
      }
      function extractHostname(url, urlIsValidHostname) {
        let start = 0;
        let end = url.length;
        let hasUpper = false;
        if (!urlIsValidHostname) {
          if (url.startsWith("data:")) {
            return null;
          }
          while (start < url.length && url.charCodeAt(start) <= 32) {
            start += 1;
          }
          while (end > start + 1 && url.charCodeAt(end - 1) <= 32) {
            end -= 1;
          }
          if (url.charCodeAt(start) === 47 && url.charCodeAt(start + 1) === 47) {
            start += 2;
          } else {
            const indexOfProtocol = url.indexOf(":/", start);
            if (indexOfProtocol !== -1) {
              const protocolSize = indexOfProtocol - start;
              const c0 = url.charCodeAt(start);
              const c1 = url.charCodeAt(start + 1);
              const c2 = url.charCodeAt(start + 2);
              const c3 = url.charCodeAt(start + 3);
              const c4 = url.charCodeAt(start + 4);
              if (protocolSize === 5 && c0 === 104 && c1 === 116 && c2 === 116 && c3 === 112 && c4 === 115) ;
              else if (protocolSize === 4 && c0 === 104 && c1 === 116 && c2 === 116 && c3 === 112) ;
              else if (protocolSize === 3 && c0 === 119 && c1 === 115 && c2 === 115) ;
              else if (protocolSize === 2 && c0 === 119 && c1 === 115) ;
              else {
                for (let i = start; i < indexOfProtocol; i += 1) {
                  const lowerCaseCode = url.charCodeAt(i) | 32;
                  if (!(lowerCaseCode >= 97 && lowerCaseCode <= 122 || // [a, z]
                  lowerCaseCode >= 48 && lowerCaseCode <= 57 || // [0, 9]
                  lowerCaseCode === 46 || // '.'
                  lowerCaseCode === 45 || // '-'
                  lowerCaseCode === 43)) {
                    return null;
                  }
                }
              }
              start = indexOfProtocol + 2;
              while (url.charCodeAt(start) === 47) {
                start += 1;
              }
            }
          }
          let indexOfIdentifier = -1;
          let indexOfClosingBracket = -1;
          let indexOfPort = -1;
          for (let i = start; i < end; i += 1) {
            const code = url.charCodeAt(i);
            if (code === 35 || // '#'
            code === 47 || // '/'
            code === 63) {
              end = i;
              break;
            } else if (code === 64) {
              indexOfIdentifier = i;
            } else if (code === 93) {
              indexOfClosingBracket = i;
            } else if (code === 58) {
              indexOfPort = i;
            } else if (code >= 65 && code <= 90) {
              hasUpper = true;
            }
          }
          if (indexOfIdentifier !== -1 && indexOfIdentifier > start && indexOfIdentifier < end) {
            start = indexOfIdentifier + 1;
          }
          if (url.charCodeAt(start) === 91) {
            if (indexOfClosingBracket !== -1) {
              return url.slice(start + 1, indexOfClosingBracket).toLowerCase();
            }
            return null;
          } else if (indexOfPort !== -1 && indexOfPort > start && indexOfPort < end) {
            end = indexOfPort;
          }
        }
        while (end > start + 1 && url.charCodeAt(end - 1) === 46) {
          end -= 1;
        }
        const hostname = start !== 0 || end !== url.length ? url.slice(start, end) : url;
        if (hasUpper) {
          return hostname.toLowerCase();
        }
        return hostname;
      }
      function isProbablyIpv4(hostname) {
        if (hostname.length < 7) {
          return false;
        }
        if (hostname.length > 15) {
          return false;
        }
        let numberOfDots = 0;
        for (let i = 0; i < hostname.length; i += 1) {
          const code = hostname.charCodeAt(i);
          if (code === 46) {
            numberOfDots += 1;
          } else if (code < 48 || code > 57) {
            return false;
          }
        }
        return numberOfDots === 3 && hostname.charCodeAt(0) !== 46 && hostname.charCodeAt(hostname.length - 1) !== 46;
      }
      function isProbablyIpv6(hostname) {
        if (hostname.length < 3) {
          return false;
        }
        let start = hostname.startsWith("[") ? 1 : 0;
        let end = hostname.length;
        if (hostname[end - 1] === "]") {
          end -= 1;
        }
        if (end - start > 39) {
          return false;
        }
        let hasColon = false;
        for (; start < end; start += 1) {
          const code = hostname.charCodeAt(start);
          if (code === 58) {
            hasColon = true;
          } else if (!(code >= 48 && code <= 57 || // 0-9
          code >= 97 && code <= 102 || // a-f
          code >= 65 && code <= 90)) {
            return false;
          }
        }
        return hasColon;
      }
      function isIp(hostname) {
        return isProbablyIpv6(hostname) || isProbablyIpv4(hostname);
      }
      function isValidAscii(code) {
        return code >= 97 && code <= 122 || code >= 48 && code <= 57 || code > 127;
      }
      function isValidHostname(hostname) {
        if (hostname.length > 255) {
          return false;
        }
        if (hostname.length === 0) {
          return false;
        }
        if (
          /*@__INLINE__*/
          !isValidAscii(hostname.charCodeAt(0)) && hostname.charCodeAt(0) !== 46 && // '.' (dot)
          hostname.charCodeAt(0) !== 95
        ) {
          return false;
        }
        let lastDotIndex = -1;
        let lastCharCode = -1;
        const len = hostname.length;
        for (let i = 0; i < len; i += 1) {
          const code = hostname.charCodeAt(i);
          if (code === 46) {
            if (
              // Check that previous label is < 63 bytes long (64 = 63 + '.')
              i - lastDotIndex > 64 || // Check that previous character was not already a '.'
              lastCharCode === 46 || // Check that the previous label does not end with a '-' (dash)
              lastCharCode === 45 || // Check that the previous label does not end with a '_' (underscore)
              lastCharCode === 95
            ) {
              return false;
            }
            lastDotIndex = i;
          } else if (!/*@__INLINE__*/
          (isValidAscii(code) || code === 45 || code === 95)) {
            return false;
          }
          lastCharCode = code;
        }
        return (
          // Check that last label is shorter than 63 chars
          len - lastDotIndex - 1 <= 63 && // Check that the last character is an allowed trailing label character.
          // Since we already checked that the char is a valid hostname character,
          // we only need to check that it's different from '-'.
          lastCharCode !== 45
        );
      }
      function setDefaultsImpl({ allowIcannDomains = true, allowPrivateDomains = false, detectIp = true, extractHostname: extractHostname2 = true, mixedInputs = true, validHosts = null, validateHostname = true }) {
        return {
          allowIcannDomains,
          allowPrivateDomains,
          detectIp,
          extractHostname: extractHostname2,
          mixedInputs,
          validHosts,
          validateHostname
        };
      }
      var DEFAULT_OPTIONS = (
        /*@__INLINE__*/
        setDefaultsImpl({})
      );
      function setDefaults(options) {
        if (options === void 0) {
          return DEFAULT_OPTIONS;
        }
        return (
          /*@__INLINE__*/
          setDefaultsImpl(options)
        );
      }
      function getSubdomain$1(hostname, domain) {
        if (domain.length === hostname.length) {
          return "";
        }
        return hostname.slice(0, -domain.length - 1);
      }
      function getEmptyResult() {
        return {
          domain: null,
          domainWithoutSuffix: null,
          hostname: null,
          isIcann: null,
          isIp: null,
          isPrivate: null,
          publicSuffix: null,
          subdomain: null
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
      function parseImpl(url, step, suffixLookup2, partialOptions, result) {
        const options = (
          /*@__INLINE__*/
          setDefaults(partialOptions)
        );
        if (typeof url !== "string") {
          return result;
        }
        if (!options.extractHostname) {
          result.hostname = url;
        } else if (options.mixedInputs) {
          result.hostname = extractHostname(url, isValidHostname(url));
        } else {
          result.hostname = extractHostname(url, false);
        }
        if (step === 0 || result.hostname === null) {
          return result;
        }
        if (options.detectIp) {
          result.isIp = isIp(result.hostname);
          if (result.isIp) {
            return result;
          }
        }
        if (options.validateHostname && options.extractHostname && !isValidHostname(result.hostname)) {
          result.hostname = null;
          return result;
        }
        suffixLookup2(result.hostname, options, result);
        if (step === 2 || result.publicSuffix === null) {
          return result;
        }
        result.domain = getDomain$1(result.publicSuffix, result.hostname, options);
        if (step === 3 || result.domain === null) {
          return result;
        }
        result.subdomain = getSubdomain$1(result.hostname, result.domain);
        if (step === 4) {
          return result;
        }
        result.domainWithoutSuffix = getDomainWithoutSuffix$1(result.domain, result.publicSuffix);
        return result;
      }
      function fastPathLookup(hostname, options, out) {
        if (!options.allowPrivateDomains && hostname.length > 3) {
          const last = hostname.length - 1;
          const c3 = hostname.charCodeAt(last);
          const c2 = hostname.charCodeAt(last - 1);
          const c1 = hostname.charCodeAt(last - 2);
          const c0 = hostname.charCodeAt(last - 3);
          if (c3 === 109 && c2 === 111 && c1 === 99 && c0 === 46) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = "com";
            return true;
          } else if (c3 === 103 && c2 === 114 && c1 === 111 && c0 === 46) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = "org";
            return true;
          } else if (c3 === 117 && c2 === 100 && c1 === 101 && c0 === 46) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = "edu";
            return true;
          } else if (c3 === 118 && c2 === 111 && c1 === 103 && c0 === 46) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = "gov";
            return true;
          } else if (c3 === 116 && c2 === 101 && c1 === 110 && c0 === 46) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = "net";
            return true;
          } else if (c3 === 101 && c2 === 100 && c1 === 46) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = "de";
            return true;
          }
        }
        return false;
      }
      var exceptions = /* @__PURE__ */ function() {
        const _0 = [1, {}], _1 = [2, {}], _2 = [0, { "city": _0 }];
        const exceptions2 = [0, { "ck": [0, { "www": _0 }], "jp": [0, { "kawasaki": _2, "kitakyushu": _2, "kobe": _2, "nagoya": _2, "sapporo": _2, "sendai": _2, "yokohama": _2 }], "dev": [0, { "hrsn": [0, { "psl": [0, { "wc": [0, { "ignored": _1, "sub": [0, { "ignored": _1 }] }] }] }] }] }];
        return exceptions2;
      }();
      var rules = /* @__PURE__ */ function() {
        const _3 = [1, {}], _4 = [2, {}], _5 = [1, { "com": _3, "edu": _3, "gov": _3, "net": _3, "org": _3 }], _6 = [1, { "com": _3, "edu": _3, "gov": _3, "mil": _3, "net": _3, "org": _3 }], _7 = [0, { "*": _4 }], _8 = [2, { "s": _7 }], _9 = [0, { "relay": _4 }], _10 = [2, { "staging": _4 }], _11 = [2, { "id": _4 }], _12 = [1, { "gov": _3 }], _13 = [0, { "transfer-webapp": _4 }], _14 = [0, { "notebook": _4, "studio": _4 }], _15 = [0, { "labeling": _4, "notebook": _4, "studio": _4 }], _16 = [0, { "notebook": _4 }], _17 = [0, { "labeling": _4, "notebook": _4, "notebook-fips": _4, "studio": _4 }], _18 = [0, { "notebook": _4, "notebook-fips": _4, "studio": _4, "studio-fips": _4 }], _19 = [0, { "*": _3 }], _20 = [1, { "co": _4 }], _21 = [0, { "objects": _4 }], _22 = [2, { "nodes": _4 }], _23 = [0, { "my": _7 }], _24 = [0, { "s3": _4, "s3-accesspoint": _4, "s3-website": _4 }], _25 = [0, { "s3": _4, "s3-accesspoint": _4 }], _26 = [0, { "direct": _4 }], _27 = [0, { "webview-assets": _4 }], _28 = [0, { "vfs": _4, "webview-assets": _4 }], _29 = [0, { "execute-api": _4, "emrappui-prod": _4, "emrnotebooks-prod": _4, "emrstudio-prod": _4, "dualstack": _24, "s3": _4, "s3-accesspoint": _4, "s3-object-lambda": _4, "s3-website": _4, "aws-cloud9": _27, "cloud9": _28 }], _30 = [0, { "execute-api": _4, "emrappui-prod": _4, "emrnotebooks-prod": _4, "emrstudio-prod": _4, "dualstack": _25, "s3": _4, "s3-accesspoint": _4, "s3-object-lambda": _4, "s3-website": _4, "aws-cloud9": _27, "cloud9": _28 }], _31 = [0, { "execute-api": _4, "emrappui-prod": _4, "emrnotebooks-prod": _4, "emrstudio-prod": _4, "dualstack": _24, "s3": _4, "s3-accesspoint": _4, "s3-object-lambda": _4, "s3-website": _4, "analytics-gateway": _4, "aws-cloud9": _27, "cloud9": _28 }], _32 = [0, { "execute-api": _4, "emrappui-prod": _4, "emrnotebooks-prod": _4, "emrstudio-prod": _4, "dualstack": _24, "s3": _4, "s3-accesspoint": _4, "s3-object-lambda": _4, "s3-website": _4 }], _33 = [0, { "s3": _4, "s3-accesspoint": _4, "s3-accesspoint-fips": _4, "s3-fips": _4, "s3-website": _4 }], _34 = [0, { "execute-api": _4, "emrappui-prod": _4, "emrnotebooks-prod": _4, "emrstudio-prod": _4, "dualstack": _33, "s3": _4, "s3-accesspoint": _4, "s3-accesspoint-fips": _4, "s3-fips": _4, "s3-object-lambda": _4, "s3-website": _4, "aws-cloud9": _27, "cloud9": _28 }], _35 = [0, { "execute-api": _4, "emrappui-prod": _4, "emrnotebooks-prod": _4, "emrstudio-prod": _4, "dualstack": _33, "s3": _4, "s3-accesspoint": _4, "s3-accesspoint-fips": _4, "s3-deprecated": _4, "s3-fips": _4, "s3-object-lambda": _4, "s3-website": _4, "analytics-gateway": _4, "aws-cloud9": _27, "cloud9": _28 }], _36 = [0, { "s3": _4, "s3-accesspoint": _4, "s3-accesspoint-fips": _4, "s3-fips": _4 }], _37 = [0, { "execute-api": _4, "emrappui-prod": _4, "emrnotebooks-prod": _4, "emrstudio-prod": _4, "dualstack": _36, "s3": _4, "s3-accesspoint": _4, "s3-accesspoint-fips": _4, "s3-fips": _4, "s3-object-lambda": _4, "s3-website": _4 }], _38 = [0, { "auth": _4 }], _39 = [0, { "auth": _4, "auth-fips": _4 }], _40 = [0, { "apps": _4 }], _41 = [0, { "paas": _4 }], _42 = [2, { "eu": _4 }], _43 = [0, { "app": _4 }], _44 = [0, { "site": _4 }], _45 = [1, { "com": _3, "edu": _3, "net": _3, "org": _3 }], _46 = [0, { "j": _4 }], _47 = [0, { "dyn": _4 }], _48 = [1, { "co": _3, "com": _3, "edu": _3, "gov": _3, "net": _3, "org": _3 }], _49 = [0, { "p": _4 }], _50 = [0, { "user": _4 }], _51 = [0, { "shop": _4 }], _52 = [0, { "cdn": _4 }], _53 = [0, { "cust": _4, "reservd": _4 }], _54 = [0, { "cust": _4 }], _55 = [0, { "s3": _4 }], _56 = [1, { "biz": _3, "com": _3, "edu": _3, "gov": _3, "info": _3, "net": _3, "org": _3 }], _57 = [1, { "framer": _4 }], _58 = [0, { "forgot": _4 }], _59 = [1, { "gs": _3 }], _60 = [0, { "nes": _3 }], _61 = [1, { "k12": _3, "cc": _3, "lib": _3 }], _62 = [1, { "cc": _3, "lib": _3 }];
        const rules2 = [0, { "ac": [1, { "com": _3, "edu": _3, "gov": _3, "mil": _3, "net": _3, "org": _3, "drr": _4, "feedback": _4, "forms": _4 }], "ad": _3, "ae": [1, { "ac": _3, "co": _3, "gov": _3, "mil": _3, "net": _3, "org": _3, "sch": _3 }], "aero": [1, { "airline": _3, "airport": _3, "accident-investigation": _3, "accident-prevention": _3, "aerobatic": _3, "aeroclub": _3, "aerodrome": _3, "agents": _3, "air-surveillance": _3, "air-traffic-control": _3, "aircraft": _3, "airtraffic": _3, "ambulance": _3, "association": _3, "author": _3, "ballooning": _3, "broker": _3, "caa": _3, "cargo": _3, "catering": _3, "certification": _3, "championship": _3, "charter": _3, "civilaviation": _3, "club": _3, "conference": _3, "consultant": _3, "consulting": _3, "control": _3, "council": _3, "crew": _3, "design": _3, "dgca": _3, "educator": _3, "emergency": _3, "engine": _3, "engineer": _3, "entertainment": _3, "equipment": _3, "exchange": _3, "express": _3, "federation": _3, "flight": _3, "freight": _3, "fuel": _3, "gliding": _3, "government": _3, "groundhandling": _3, "group": _3, "hanggliding": _3, "homebuilt": _3, "insurance": _3, "journal": _3, "journalist": _3, "leasing": _3, "logistics": _3, "magazine": _3, "maintenance": _3, "marketplace": _3, "media": _3, "microlight": _3, "modelling": _3, "navigation": _3, "parachuting": _3, "paragliding": _3, "passenger-association": _3, "pilot": _3, "press": _3, "production": _3, "recreation": _3, "repbody": _3, "res": _3, "research": _3, "rotorcraft": _3, "safety": _3, "scientist": _3, "services": _3, "show": _3, "skydiving": _3, "software": _3, "student": _3, "taxi": _3, "trader": _3, "trading": _3, "trainer": _3, "union": _3, "workinggroup": _3, "works": _3 }], "af": _5, "ag": [1, { "co": _3, "com": _3, "net": _3, "nom": _3, "org": _3, "obj": _4 }], "ai": [1, { "com": _3, "net": _3, "off": _3, "org": _3, "uwu": _4, "framer": _4 }], "al": _6, "am": [1, { "co": _3, "com": _3, "commune": _3, "net": _3, "org": _3, "radio": _4 }], "ao": [1, { "co": _3, "ed": _3, "edu": _3, "gov": _3, "gv": _3, "it": _3, "og": _3, "org": _3, "pb": _3 }], "aq": _3, "ar": [1, { "bet": _3, "com": _3, "coop": _3, "edu": _3, "gob": _3, "gov": _3, "int": _3, "mil": _3, "musica": _3, "mutual": _3, "net": _3, "org": _3, "senasa": _3, "tur": _3 }], "arpa": [1, { "e164": _3, "home": _3, "in-addr": _3, "ip6": _3, "iris": _3, "uri": _3, "urn": _3 }], "as": _12, "asia": [1, { "cloudns": _4, "daemon": _4, "dix": _4 }], "at": [1, { "ac": [1, { "sth": _3 }], "co": _3, "gv": _3, "or": _3, "funkfeuer": [0, { "wien": _4 }], "futurecms": [0, { "*": _4, "ex": _7, "in": _7 }], "futurehosting": _4, "futuremailing": _4, "ortsinfo": [0, { "ex": _7, "kunden": _7 }], "biz": _4, "info": _4, "123webseite": _4, "priv": _4, "myspreadshop": _4, "12hp": _4, "2ix": _4, "4lima": _4, "lima-city": _4 }], "au": [1, { "asn": _3, "com": [1, { "cloudlets": [0, { "mel": _4 }], "myspreadshop": _4 }], "edu": [1, { "act": _3, "catholic": _3, "nsw": [1, { "schools": _3 }], "nt": _3, "qld": _3, "sa": _3, "tas": _3, "vic": _3, "wa": _3 }], "gov": [1, { "qld": _3, "sa": _3, "tas": _3, "vic": _3, "wa": _3 }], "id": _3, "net": _3, "org": _3, "conf": _3, "oz": _3, "act": _3, "nsw": _3, "nt": _3, "qld": _3, "sa": _3, "tas": _3, "vic": _3, "wa": _3 }], "aw": [1, { "com": _3 }], "ax": _3, "az": [1, { "biz": _3, "co": _3, "com": _3, "edu": _3, "gov": _3, "info": _3, "int": _3, "mil": _3, "name": _3, "net": _3, "org": _3, "pp": _3, "pro": _3 }], "ba": [1, { "com": _3, "edu": _3, "gov": _3, "mil": _3, "net": _3, "org": _3, "rs": _4 }], "bb": [1, { "biz": _3, "co": _3, "com": _3, "edu": _3, "gov": _3, "info": _3, "net": _3, "org": _3, "store": _3, "tv": _3 }], "bd": _19, "be": [1, { "ac": _3, "cloudns": _4, "webhosting": _4, "interhostsolutions": [0, { "cloud": _4 }], "kuleuven": [0, { "ezproxy": _4 }], "123website": _4, "myspreadshop": _4, "transurl": _7 }], "bf": _12, "bg": [1, { "0": _3, "1": _3, "2": _3, "3": _3, "4": _3, "5": _3, "6": _3, "7": _3, "8": _3, "9": _3, "a": _3, "b": _3, "c": _3, "d": _3, "e": _3, "f": _3, "g": _3, "h": _3, "i": _3, "j": _3, "k": _3, "l": _3, "m": _3, "n": _3, "o": _3, "p": _3, "q": _3, "r": _3, "s": _3, "t": _3, "u": _3, "v": _3, "w": _3, "x": _3, "y": _3, "z": _3, "barsy": _4 }], "bh": _5, "bi": [1, { "co": _3, "com": _3, "edu": _3, "or": _3, "org": _3 }], "biz": [1, { "activetrail": _4, "cloud-ip": _4, "cloudns": _4, "jozi": _4, "dyndns": _4, "for-better": _4, "for-more": _4, "for-some": _4, "for-the": _4, "selfip": _4, "webhop": _4, "orx": _4, "mmafan": _4, "myftp": _4, "no-ip": _4, "dscloud": _4 }], "bj": [1, { "africa": _3, "agro": _3, "architectes": _3, "assur": _3, "avocats": _3, "co": _3, "com": _3, "eco": _3, "econo": _3, "edu": _3, "info": _3, "loisirs": _3, "money": _3, "net": _3, "org": _3, "ote": _3, "restaurant": _3, "resto": _3, "tourism": _3, "univ": _3 }], "bm": _5, "bn": [1, { "com": _3, "edu": _3, "gov": _3, "net": _3, "org": _3, "co": _4 }], "bo": [1, { "com": _3, "edu": _3, "gob": _3, "int": _3, "mil": _3, "net": _3, "org": _3, "tv": _3, "web": _3, "academia": _3, "agro": _3, "arte": _3, "blog": _3, "bolivia": _3, "ciencia": _3, "cooperativa": _3, "democracia": _3, "deporte": _3, "ecologia": _3, "economia": _3, "empresa": _3, "indigena": _3, "industria": _3, "info": _3, "medicina": _3, "movimiento": _3, "musica": _3, "natural": _3, "nombre": _3, "noticias": _3, "patria": _3, "plurinacional": _3, "politica": _3, "profesional": _3, "pueblo": _3, "revista": _3, "salud": _3, "tecnologia": _3, "tksat": _3, "transporte": _3, "wiki": _3 }], "br": [1, { "9guacu": _3, "abc": _3, "adm": _3, "adv": _3, "agr": _3, "aju": _3, "am": _3, "anani": _3, "aparecida": _3, "app": _3, "arq": _3, "art": _3, "ato": _3, "b": _3, "barueri": _3, "belem": _3, "bet": _3, "bhz": _3, "bib": _3, "bio": _3, "blog": _3, "bmd": _3, "boavista": _3, "bsb": _3, "campinagrande": _3, "campinas": _3, "caxias": _3, "cim": _3, "cng": _3, "cnt": _3, "com": [1, { "simplesite": _4 }], "contagem": _3, "coop": _3, "coz": _3, "cri": _3, "cuiaba": _3, "curitiba": _3, "def": _3, "des": _3, "det": _3, "dev": _3, "ecn": _3, "eco": _3, "edu": _3, "emp": _3, "enf": _3, "eng": _3, "esp": _3, "etc": _3, "eti": _3, "far": _3, "feira": _3, "flog": _3, "floripa": _3, "fm": _3, "fnd": _3, "fortal": _3, "fot": _3, "foz": _3, "fst": _3, "g12": _3, "geo": _3, "ggf": _3, "goiania": _3, "gov": [1, { "ac": _3, "al": _3, "am": _3, "ap": _3, "ba": _3, "ce": _3, "df": _3, "es": _3, "go": _3, "ma": _3, "mg": _3, "ms": _3, "mt": _3, "pa": _3, "pb": _3, "pe": _3, "pi": _3, "pr": _3, "rj": _3, "rn": _3, "ro": _3, "rr": _3, "rs": _3, "sc": _3, "se": _3, "sp": _3, "to": _3 }], "gru": _3, "imb": _3, "ind": _3, "inf": _3, "jab": _3, "jampa": _3, "jdf": _3, "joinville": _3, "jor": _3, "jus": _3, "leg": [1, { "ac": _4, "al": _4, "am": _4, "ap": _4, "ba": _4, "ce": _4, "df": _4, "es": _4, "go": _4, "ma": _4, "mg": _4, "ms": _4, "mt": _4, "pa": _4, "pb": _4, "pe": _4, "pi": _4, "pr": _4, "rj": _4, "rn": _4, "ro": _4, "rr": _4, "rs": _4, "sc": _4, "se": _4, "sp": _4, "to": _4 }], "leilao": _3, "lel": _3, "log": _3, "londrina": _3, "macapa": _3, "maceio": _3, "manaus": _3, "maringa": _3, "mat": _3, "med": _3, "mil": _3, "morena": _3, "mp": _3, "mus": _3, "natal": _3, "net": _3, "niteroi": _3, "nom": _19, "not": _3, "ntr": _3, "odo": _3, "ong": _3, "org": _3, "osasco": _3, "palmas": _3, "poa": _3, "ppg": _3, "pro": _3, "psc": _3, "psi": _3, "pvh": _3, "qsl": _3, "radio": _3, "rec": _3, "recife": _3, "rep": _3, "ribeirao": _3, "rio": _3, "riobranco": _3, "riopreto": _3, "salvador": _3, "sampa": _3, "santamaria": _3, "santoandre": _3, "saobernardo": _3, "saogonca": _3, "seg": _3, "sjc": _3, "slg": _3, "slz": _3, "sorocaba": _3, "srv": _3, "taxi": _3, "tc": _3, "tec": _3, "teo": _3, "the": _3, "tmp": _3, "trd": _3, "tur": _3, "tv": _3, "udi": _3, "vet": _3, "vix": _3, "vlog": _3, "wiki": _3, "zlg": _3 }], "bs": [1, { "com": _3, "edu": _3, "gov": _3, "net": _3, "org": _3, "we": _4 }], "bt": _5, "bv": _3, "bw": [1, { "ac": _3, "co": _3, "gov": _3, "net": _3, "org": _3 }], "by": [1, { "gov": _3, "mil": _3, "com": _3, "of": _3, "mediatech": _4 }], "bz": [1, { "co": _3, "com": _3, "edu": _3, "gov": _3, "net": _3, "org": _3, "za": _4, "mydns": _4, "gsj": _4 }], "ca": [1, { "ab": _3, "bc": _3, "mb": _3, "nb": _3, "nf": _3, "nl": _3, "ns": _3, "nt": _3, "nu": _3, "on": _3, "pe": _3, "qc": _3, "sk": _3, "yk": _3, "gc": _3, "barsy": _4, "awdev": _7, "co": _4, "no-ip": _4, "myspreadshop": _4, "box": _4 }], "cat": _3, "cc": [1, { "cleverapps": _4, "cloudns": _4, "ftpaccess": _4, "game-server": _4, "myphotos": _4, "scrapping": _4, "twmail": _4, "csx": _4, "fantasyleague": _4, "spawn": [0, { "instances": _4 }] }], "cd": _12, "cf": _3, "cg": _3, "ch": [1, { "square7": _4, "cloudns": _4, "cloudscale": [0, { "cust": _4, "lpg": _21, "rma": _21 }], "flow": [0, { "ae": [0, { "alp1": _4 }], "appengine": _4 }], "linkyard-cloud": _4, "gotdns": _4, "dnsking": _4, "123website": _4, "myspreadshop": _4, "firenet": [0, { "*": _4, "svc": _7 }], "12hp": _4, "2ix": _4, "4lima": _4, "lima-city": _4 }], "ci": [1, { "ac": _3, "xn--aroport-bya": _3, "a\xE9roport": _3, "asso": _3, "co": _3, "com": _3, "ed": _3, "edu": _3, "go": _3, "gouv": _3, "int": _3, "net": _3, "or": _3, "org": _3 }], "ck": _19, "cl": [1, { "co": _3, "gob": _3, "gov": _3, "mil": _3, "cloudns": _4 }], "cm": [1, { "co": _3, "com": _3, "gov": _3, "net": _3 }], "cn": [1, { "ac": _3, "com": [1, { "amazonaws": [0, { "cn-north-1": [0, { "execute-api": _4, "emrappui-prod": _4, "emrnotebooks-prod": _4, "emrstudio-prod": _4, "dualstack": _24, "s3": _4, "s3-accesspoint": _4, "s3-deprecated": _4, "s3-object-lambda": _4, "s3-website": _4 }], "cn-northwest-1": [0, { "execute-api": _4, "emrappui-prod": _4, "emrnotebooks-prod": _4, "emrstudio-prod": _4, "dualstack": _25, "s3": _4, "s3-accesspoint": _4, "s3-object-lambda": _4, "s3-website": _4 }], "compute": _7, "airflow": [0, { "cn-north-1": _7, "cn-northwest-1": _7 }], "eb": [0, { "cn-north-1": _4, "cn-northwest-1": _4 }], "elb": _7 }], "sagemaker": [0, { "cn-north-1": _14, "cn-northwest-1": _14 }] }], "edu": _3, "gov": _3, "mil": _3, "net": _3, "org": _3, "xn--55qx5d": _3, "\u516C\u53F8": _3, "xn--od0alg": _3, "\u7DB2\u7D61": _3, "xn--io0a7i": _3, "\u7F51\u7EDC": _3, "ah": _3, "bj": _3, "cq": _3, "fj": _3, "gd": _3, "gs": _3, "gx": _3, "gz": _3, "ha": _3, "hb": _3, "he": _3, "hi": _3, "hk": _3, "hl": _3, "hn": _3, "jl": _3, "js": _3, "jx": _3, "ln": _3, "mo": _3, "nm": _3, "nx": _3, "qh": _3, "sc": _3, "sd": _3, "sh": [1, { "as": _4 }], "sn": _3, "sx": _3, "tj": _3, "tw": _3, "xj": _3, "xz": _3, "yn": _3, "zj": _3, "canva-apps": _4, "canvasite": _23, "myqnapcloud": _4, "quickconnect": _26 }], "co": [1, { "com": _3, "edu": _3, "gov": _3, "mil": _3, "net": _3, "nom": _3, "org": _3, "carrd": _4, "crd": _4, "otap": _7, "leadpages": _4, "lpages": _4, "mypi": _4, "xmit": _7, "firewalledreplit": _11, "repl": _11, "supabase": _4 }], "com": [1, { "a2hosted": _4, "cpserver": _4, "adobeaemcloud": [2, { "dev": _7 }], "africa": _4, "airkitapps": _4, "airkitapps-au": _4, "aivencloud": _4, "alibabacloudcs": _4, "kasserver": _4, "amazonaws": [0, { "af-south-1": _29, "ap-east-1": _30, "ap-northeast-1": _31, "ap-northeast-2": _31, "ap-northeast-3": _29, "ap-south-1": _31, "ap-south-2": _32, "ap-southeast-1": _31, "ap-southeast-2": _31, "ap-southeast-3": _32, "ap-southeast-4": _32, "ap-southeast-5": [0, { "execute-api": _4, "dualstack": _24, "s3": _4, "s3-accesspoint": _4, "s3-deprecated": _4, "s3-object-lambda": _4, "s3-website": _4 }], "ca-central-1": _34, "ca-west-1": [0, { "execute-api": _4, "emrappui-prod": _4, "emrnotebooks-prod": _4, "emrstudio-prod": _4, "dualstack": _33, "s3": _4, "s3-accesspoint": _4, "s3-accesspoint-fips": _4, "s3-fips": _4, "s3-object-lambda": _4, "s3-website": _4 }], "eu-central-1": _31, "eu-central-2": _32, "eu-north-1": _30, "eu-south-1": _29, "eu-south-2": _32, "eu-west-1": [0, { "execute-api": _4, "emrappui-prod": _4, "emrnotebooks-prod": _4, "emrstudio-prod": _4, "dualstack": _24, "s3": _4, "s3-accesspoint": _4, "s3-deprecated": _4, "s3-object-lambda": _4, "s3-website": _4, "analytics-gateway": _4, "aws-cloud9": _27, "cloud9": _28 }], "eu-west-2": _30, "eu-west-3": _29, "il-central-1": [0, { "execute-api": _4, "emrappui-prod": _4, "emrnotebooks-prod": _4, "emrstudio-prod": _4, "dualstack": _24, "s3": _4, "s3-accesspoint": _4, "s3-object-lambda": _4, "s3-website": _4, "aws-cloud9": _27, "cloud9": [0, { "vfs": _4 }] }], "me-central-1": _32, "me-south-1": _30, "sa-east-1": _29, "us-east-1": [2, { "execute-api": _4, "emrappui-prod": _4, "emrnotebooks-prod": _4, "emrstudio-prod": _4, "dualstack": _33, "s3": _4, "s3-accesspoint": _4, "s3-accesspoint-fips": _4, "s3-deprecated": _4, "s3-fips": _4, "s3-object-lambda": _4, "s3-website": _4, "analytics-gateway": _4, "aws-cloud9": _27, "cloud9": _28 }], "us-east-2": _35, "us-gov-east-1": _37, "us-gov-west-1": _37, "us-west-1": _34, "us-west-2": _35, "compute": _7, "compute-1": _7, "airflow": [0, { "af-south-1": _7, "ap-east-1": _7, "ap-northeast-1": _7, "ap-northeast-2": _7, "ap-northeast-3": _7, "ap-south-1": _7, "ap-south-2": _7, "ap-southeast-1": _7, "ap-southeast-2": _7, "ap-southeast-3": _7, "ap-southeast-4": _7, "ca-central-1": _7, "ca-west-1": _7, "eu-central-1": _7, "eu-central-2": _7, "eu-north-1": _7, "eu-south-1": _7, "eu-south-2": _7, "eu-west-1": _7, "eu-west-2": _7, "eu-west-3": _7, "il-central-1": _7, "me-central-1": _7, "me-south-1": _7, "sa-east-1": _7, "us-east-1": _7, "us-east-2": _7, "us-west-1": _7, "us-west-2": _7 }], "s3": _4, "s3-1": _4, "s3-ap-east-1": _4, "s3-ap-northeast-1": _4, "s3-ap-northeast-2": _4, "s3-ap-northeast-3": _4, "s3-ap-south-1": _4, "s3-ap-southeast-1": _4, "s3-ap-southeast-2": _4, "s3-ca-central-1": _4, "s3-eu-central-1": _4, "s3-eu-north-1": _4, "s3-eu-west-1": _4, "s3-eu-west-2": _4, "s3-eu-west-3": _4, "s3-external-1": _4, "s3-fips-us-gov-east-1": _4, "s3-fips-us-gov-west-1": _4, "s3-global": [0, { "accesspoint": [0, { "mrap": _4 }] }], "s3-me-south-1": _4, "s3-sa-east-1": _4, "s3-us-east-2": _4, "s3-us-gov-east-1": _4, "s3-us-gov-west-1": _4, "s3-us-west-1": _4, "s3-us-west-2": _4, "s3-website-ap-northeast-1": _4, "s3-website-ap-southeast-1": _4, "s3-website-ap-southeast-2": _4, "s3-website-eu-west-1": _4, "s3-website-sa-east-1": _4, "s3-website-us-east-1": _4, "s3-website-us-gov-west-1": _4, "s3-website-us-west-1": _4, "s3-website-us-west-2": _4, "elb": _7 }], "amazoncognito": [0, { "af-south-1": _38, "ap-east-1": _38, "ap-northeast-1": _38, "ap-northeast-2": _38, "ap-northeast-3": _38, "ap-south-1": _38, "ap-south-2": _38, "ap-southeast-1": _38, "ap-southeast-2": _38, "ap-southeast-3": _38, "ap-southeast-4": _38, "ca-central-1": _38, "ca-west-1": _38, "eu-central-1": _38, "eu-central-2": _38, "eu-north-1": _38, "eu-south-1": _38, "eu-south-2": _38, "eu-west-1": _38, "eu-west-2": _38, "eu-west-3": _38, "il-central-1": _38, "me-central-1": _38, "me-south-1": _38, "sa-east-1": _38, "us-east-1": _39, "us-east-2": _39, "us-gov-west-1": [0, { "auth-fips": _4 }], "us-west-1": _39, "us-west-2": _39 }], "amplifyapp": _4, "awsapprunner": _7, "awsapps": _4, "elasticbeanstalk": [2, { "af-south-1": _4, "ap-east-1": _4, "ap-northeast-1": _4, "ap-northeast-2": _4, "ap-northeast-3": _4, "ap-south-1": _4, "ap-southeast-1": _4, "ap-southeast-2": _4, "ap-southeast-3": _4, "ca-central-1": _4, "eu-central-1": _4, "eu-north-1": _4, "eu-south-1": _4, "eu-west-1": _4, "eu-west-2": _4, "eu-west-3": _4, "il-central-1": _4, "me-south-1": _4, "sa-east-1": _4, "us-east-1": _4, "us-east-2": _4, "us-gov-east-1": _4, "us-gov-west-1": _4, "us-west-1": _4, "us-west-2": _4 }], "awsglobalaccelerator": _4, "siiites": _4, "appspacehosted": _4, "appspaceusercontent": _4, "on-aptible": _4, "myasustor": _4, "balena-devices": _4, "boutir": _4, "bplaced": _4, "cafjs": _4, "canva-apps": _4, "cdn77-storage": _4, "br": _4, "cn": _4, "de": _4, "eu": _4, "jpn": _4, "mex": _4, "ru": _4, "sa": _4, "uk": _4, "us": _4, "za": _4, "clever-cloud": [0, { "services": _7 }], "dnsabr": _4, "ip-ddns": _4, "jdevcloud": _4, "wpdevcloud": _4, "cf-ipfs": _4, "cloudflare-ipfs": _4, "trycloudflare": _4, "co": _4, "devinapps": _10, "builtwithdark": _4, "datadetect": [0, { "demo": _4, "instance": _4 }], "dattolocal": _4, "dattorelay": _4, "dattoweb": _4, "mydatto": _4, "digitaloceanspaces": _7, "discordsays": _4, "discordsez": _4, "drayddns": _4, "dreamhosters": _4, "durumis": _4, "mydrobo": _4, "blogdns": _4, "cechire": _4, "dnsalias": _4, "dnsdojo": _4, "doesntexist": _4, "dontexist": _4, "doomdns": _4, "dyn-o-saur": _4, "dynalias": _4, "dyndns-at-home": _4, "dyndns-at-work": _4, "dyndns-blog": _4, "dyndns-free": _4, "dyndns-home": _4, "dyndns-ip": _4, "dyndns-mail": _4, "dyndns-office": _4, "dyndns-pics": _4, "dyndns-remote": _4, "dyndns-server": _4, "dyndns-web": _4, "dyndns-wiki": _4, "dyndns-work": _4, "est-a-la-maison": _4, "est-a-la-masion": _4, "est-le-patron": _4, "est-mon-blogueur": _4, "from-ak": _4, "from-al": _4, "from-ar": _4, "from-ca": _4, "from-ct": _4, "from-dc": _4, "from-de": _4, "from-fl": _4, "from-ga": _4, "from-hi": _4, "from-ia": _4, "from-id": _4, "from-il": _4, "from-in": _4, "from-ks": _4, "from-ky": _4, "from-ma": _4, "from-md": _4, "from-mi": _4, "from-mn": _4, "from-mo": _4, "from-ms": _4, "from-mt": _4, "from-nc": _4, "from-nd": _4, "from-ne": _4, "from-nh": _4, "from-nj": _4, "from-nm": _4, "from-nv": _4, "from-oh": _4, "from-ok": _4, "from-or": _4, "from-pa": _4, "from-pr": _4, "from-ri": _4, "from-sc": _4, "from-sd": _4, "from-tn": _4, "from-tx": _4, "from-ut": _4, "from-va": _4, "from-vt": _4, "from-wa": _4, "from-wi": _4, "from-wv": _4, "from-wy": _4, "getmyip": _4, "gotdns": _4, "hobby-site": _4, "homelinux": _4, "homeunix": _4, "iamallama": _4, "is-a-anarchist": _4, "is-a-blogger": _4, "is-a-bookkeeper": _4, "is-a-bulls-fan": _4, "is-a-caterer": _4, "is-a-chef": _4, "is-a-conservative": _4, "is-a-cpa": _4, "is-a-cubicle-slave": _4, "is-a-democrat": _4, "is-a-designer": _4, "is-a-doctor": _4, "is-a-financialadvisor": _4, "is-a-geek": _4, "is-a-green": _4, "is-a-guru": _4, "is-a-hard-worker": _4, "is-a-hunter": _4, "is-a-landscaper": _4, "is-a-lawyer": _4, "is-a-liberal": _4, "is-a-libertarian": _4, "is-a-llama": _4, "is-a-musician": _4, "is-a-nascarfan": _4, "is-a-nurse": _4, "is-a-painter": _4, "is-a-personaltrainer": _4, "is-a-photographer": _4, "is-a-player": _4, "is-a-republican": _4, "is-a-rockstar": _4, "is-a-socialist": _4, "is-a-student": _4, "is-a-teacher": _4, "is-a-techie": _4, "is-a-therapist": _4, "is-an-accountant": _4, "is-an-actor": _4, "is-an-actress": _4, "is-an-anarchist": _4, "is-an-artist": _4, "is-an-engineer": _4, "is-an-entertainer": _4, "is-certified": _4, "is-gone": _4, "is-into-anime": _4, "is-into-cars": _4, "is-into-cartoons": _4, "is-into-games": _4, "is-leet": _4, "is-not-certified": _4, "is-slick": _4, "is-uberleet": _4, "is-with-theband": _4, "isa-geek": _4, "isa-hockeynut": _4, "issmarterthanyou": _4, "likes-pie": _4, "likescandy": _4, "neat-url": _4, "saves-the-whales": _4, "selfip": _4, "sells-for-less": _4, "sells-for-u": _4, "servebbs": _4, "simple-url": _4, "space-to-rent": _4, "teaches-yoga": _4, "writesthisblog": _4, "ddnsfree": _4, "ddnsgeek": _4, "giize": _4, "gleeze": _4, "kozow": _4, "loseyourip": _4, "ooguy": _4, "theworkpc": _4, "mytuleap": _4, "tuleap-partners": _4, "encoreapi": _4, "evennode": [0, { "eu-1": _4, "eu-2": _4, "eu-3": _4, "eu-4": _4, "us-1": _4, "us-2": _4, "us-3": _4, "us-4": _4 }], "onfabrica": _4, "fastly-edge": _4, "fastly-terrarium": _4, "fastvps-server": _4, "mydobiss": _4, "firebaseapp": _4, "fldrv": _4, "forgeblocks": _4, "framercanvas": _4, "freebox-os": _4, "freeboxos": _4, "freemyip": _4, "aliases121": _4, "gentapps": _4, "gentlentapis": _4, "githubusercontent": _4, "0emm": _7, "appspot": [2, { "r": _7 }], "blogspot": _4, "codespot": _4, "googleapis": _4, "googlecode": _4, "pagespeedmobilizer": _4, "withgoogle": _4, "withyoutube": _4, "grayjayleagues": _4, "hatenablog": _4, "hatenadiary": _4, "herokuapp": _4, "gr": _4, "smushcdn": _4, "wphostedmail": _4, "wpmucdn": _4, "pixolino": _4, "apps-1and1": _4, "live-website": _4, "dopaas": _4, "hosted-by-previder": _41, "hosteur": [0, { "rag-cloud": _4, "rag-cloud-ch": _4 }], "ik-server": [0, { "jcloud": _4, "jcloud-ver-jpc": _4 }], "jelastic": [0, { "demo": _4 }], "massivegrid": _41, "wafaicloud": [0, { "jed": _4, "ryd": _4 }], "webadorsite": _4, "joyent": [0, { "cns": _7 }], "lpusercontent": _4, "linode": [0, { "members": _4, "nodebalancer": _7 }], "linodeobjects": _7, "linodeusercontent": [0, { "ip": _4 }], "localtonet": _4, "lovableproject": _4, "barsycenter": _4, "barsyonline": _4, "modelscape": _4, "mwcloudnonprod": _4, "polyspace": _4, "mazeplay": _4, "miniserver": _4, "atmeta": _4, "fbsbx": _40, "meteorapp": _42, "routingthecloud": _4, "mydbserver": _4, "hostedpi": _4, "mythic-beasts": [0, { "caracal": _4, "customer": _4, "fentiger": _4, "lynx": _4, "ocelot": _4, "oncilla": _4, "onza": _4, "sphinx": _4, "vs": _4, "x": _4, "yali": _4 }], "nospamproxy": [0, { "cloud": [2, { "o365": _4 }] }], "4u": _4, "nfshost": _4, "3utilities": _4, "blogsyte": _4, "ciscofreak": _4, "damnserver": _4, "ddnsking": _4, "ditchyourip": _4, "dnsiskinky": _4, "dynns": _4, "geekgalaxy": _4, "health-carereform": _4, "homesecuritymac": _4, "homesecuritypc": _4, "myactivedirectory": _4, "mysecuritycamera": _4, "myvnc": _4, "net-freaks": _4, "onthewifi": _4, "point2this": _4, "quicksytes": _4, "securitytactics": _4, "servebeer": _4, "servecounterstrike": _4, "serveexchange": _4, "serveftp": _4, "servegame": _4, "servehalflife": _4, "servehttp": _4, "servehumour": _4, "serveirc": _4, "servemp3": _4, "servep2p": _4, "servepics": _4, "servequake": _4, "servesarcasm": _4, "stufftoread": _4, "unusualperson": _4, "workisboring": _4, "myiphost": _4, "observableusercontent": [0, { "static": _4 }], "simplesite": _4, "orsites": _4, "operaunite": _4, "customer-oci": [0, { "*": _4, "oci": _7, "ocp": _7, "ocs": _7 }], "oraclecloudapps": _7, "oraclegovcloudapps": _7, "authgear-staging": _4, "authgearapps": _4, "skygearapp": _4, "outsystemscloud": _4, "ownprovider": _4, "pgfog": _4, "pagexl": _4, "gotpantheon": _4, "paywhirl": _7, "upsunapp": _4, "postman-echo": _4, "prgmr": [0, { "xen": _4 }], "pythonanywhere": _42, "qa2": _4, "alpha-myqnapcloud": _4, "dev-myqnapcloud": _4, "mycloudnas": _4, "mynascloud": _4, "myqnapcloud": _4, "qualifioapp": _4, "ladesk": _4, "qbuser": _4, "quipelements": _7, "rackmaze": _4, "readthedocs-hosted": _4, "rhcloud": _4, "onrender": _4, "render": _43, "subsc-pay": _4, "180r": _4, "dojin": _4, "sakuratan": _4, "sakuraweb": _4, "x0": _4, "code": [0, { "builder": _7, "dev-builder": _7, "stg-builder": _7 }], "salesforce": [0, { "platform": [0, { "code-builder-stg": [0, { "test": [0, { "001": _7 }] }] }] }], "logoip": _4, "scrysec": _4, "firewall-gateway": _4, "myshopblocks": _4, "myshopify": _4, "shopitsite": _4, "1kapp": _4, "appchizi": _4, "applinzi": _4, "sinaapp": _4, "vipsinaapp": _4, "streamlitapp": _4, "try-snowplow": _4, "playstation-cloud": _4, "myspreadshop": _4, "w-corp-staticblitz": _4, "w-credentialless-staticblitz": _4, "w-staticblitz": _4, "stackhero-network": _4, "stdlib": [0, { "api": _4 }], "strapiapp": [2, { "media": _4 }], "streak-link": _4, "streaklinks": _4, "streakusercontent": _4, "temp-dns": _4, "dsmynas": _4, "familyds": _4, "mytabit": _4, "taveusercontent": _4, "tb-hosting": _44, "reservd": _4, "thingdustdata": _4, "townnews-staging": _4, "typeform": [0, { "pro": _4 }], "hk": _4, "it": _4, "deus-canvas": _4, "vultrobjects": _7, "wafflecell": _4, "hotelwithflight": _4, "reserve-online": _4, "cprapid": _4, "pleskns": _4, "remotewd": _4, "wiardweb": [0, { "pages": _4 }], "wixsite": _4, "wixstudio": _4, "messwithdns": _4, "woltlab-demo": _4, "wpenginepowered": [2, { "js": _4 }], "xnbay": [2, { "u2": _4, "u2-local": _4 }], "yolasite": _4 }], "coop": _3, "cr": [1, { "ac": _3, "co": _3, "ed": _3, "fi": _3, "go": _3, "or": _3, "sa": _3 }], "cu": [1, { "com": _3, "edu": _3, "gob": _3, "inf": _3, "nat": _3, "net": _3, "org": _3 }], "cv": [1, { "com": _3, "edu": _3, "id": _3, "int": _3, "net": _3, "nome": _3, "org": _3, "publ": _3 }], "cw": _45, "cx": [1, { "gov": _3, "cloudns": _4, "ath": _4, "info": _4, "assessments": _4, "calculators": _4, "funnels": _4, "paynow": _4, "quizzes": _4, "researched": _4, "tests": _4 }], "cy": [1, { "ac": _3, "biz": _3, "com": [1, { "scaleforce": _46 }], "ekloges": _3, "gov": _3, "ltd": _3, "mil": _3, "net": _3, "org": _3, "press": _3, "pro": _3, "tm": _3 }], "cz": [1, { "contentproxy9": [0, { "rsc": _4 }], "realm": _4, "e4": _4, "co": _4, "metacentrum": [0, { "cloud": _7, "custom": _4 }], "muni": [0, { "cloud": [0, { "flt": _4, "usr": _4 }] }] }], "de": [1, { "bplaced": _4, "square7": _4, "com": _4, "cosidns": _47, "dnsupdater": _4, "dynamisches-dns": _4, "internet-dns": _4, "l-o-g-i-n": _4, "ddnss": [2, { "dyn": _4, "dyndns": _4 }], "dyn-ip24": _4, "dyndns1": _4, "home-webserver": [2, { "dyn": _4 }], "myhome-server": _4, "dnshome": _4, "fuettertdasnetz": _4, "isteingeek": _4, "istmein": _4, "lebtimnetz": _4, "leitungsen": _4, "traeumtgerade": _4, "frusky": _7, "goip": _4, "xn--gnstigbestellen-zvb": _4, "g\xFCnstigbestellen": _4, "xn--gnstigliefern-wob": _4, "g\xFCnstigliefern": _4, "hs-heilbronn": [0, { "it": [0, { "pages": _4, "pages-research": _4 }] }], "dyn-berlin": _4, "in-berlin": _4, "in-brb": _4, "in-butter": _4, "in-dsl": _4, "in-vpn": _4, "iservschule": _4, "mein-iserv": _4, "schulplattform": _4, "schulserver": _4, "test-iserv": _4, "keymachine": _4, "git-repos": _4, "lcube-server": _4, "svn-repos": _4, "barsy": _4, "webspaceconfig": _4, "123webseite": _4, "rub": _4, "ruhr-uni-bochum": [2, { "noc": [0, { "io": _4 }] }], "logoip": _4, "firewall-gateway": _4, "my-gateway": _4, "my-router": _4, "spdns": _4, "speedpartner": [0, { "customer": _4 }], "myspreadshop": _4, "taifun-dns": _4, "12hp": _4, "2ix": _4, "4lima": _4, "lima-city": _4, "dd-dns": _4, "dray-dns": _4, "draydns": _4, "dyn-vpn": _4, "dynvpn": _4, "mein-vigor": _4, "my-vigor": _4, "my-wan": _4, "syno-ds": _4, "synology-diskstation": _4, "synology-ds": _4, "uberspace": _7, "virtual-user": _4, "virtualuser": _4, "community-pro": _4, "diskussionsbereich": _4 }], "dj": _3, "dk": [1, { "biz": _4, "co": _4, "firm": _4, "reg": _4, "store": _4, "123hjemmeside": _4, "myspreadshop": _4 }], "dm": _48, "do": [1, { "art": _3, "com": _3, "edu": _3, "gob": _3, "gov": _3, "mil": _3, "net": _3, "org": _3, "sld": _3, "web": _3 }], "dz": [1, { "art": _3, "asso": _3, "com": _3, "edu": _3, "gov": _3, "net": _3, "org": _3, "pol": _3, "soc": _3, "tm": _3 }], "ec": [1, { "com": _3, "edu": _3, "fin": _3, "gob": _3, "gov": _3, "info": _3, "k12": _3, "med": _3, "mil": _3, "net": _3, "org": _3, "pro": _3, "base": _4, "official": _4 }], "edu": [1, { "rit": [0, { "git-pages": _4 }] }], "ee": [1, { "aip": _3, "com": _3, "edu": _3, "fie": _3, "gov": _3, "lib": _3, "med": _3, "org": _3, "pri": _3, "riik": _3 }], "eg": [1, { "ac": _3, "com": _3, "edu": _3, "eun": _3, "gov": _3, "info": _3, "me": _3, "mil": _3, "name": _3, "net": _3, "org": _3, "sci": _3, "sport": _3, "tv": _3 }], "er": _19, "es": [1, { "com": _3, "edu": _3, "gob": _3, "nom": _3, "org": _3, "123miweb": _4, "myspreadshop": _4 }], "et": [1, { "biz": _3, "com": _3, "edu": _3, "gov": _3, "info": _3, "name": _3, "net": _3, "org": _3 }], "eu": [1, { "airkitapps": _4, "cloudns": _4, "dogado": [0, { "jelastic": _4 }], "barsy": _4, "spdns": _4, "transurl": _7, "diskstation": _4 }], "fi": [1, { "aland": _3, "dy": _4, "xn--hkkinen-5wa": _4, "h\xE4kkinen": _4, "iki": _4, "cloudplatform": [0, { "fi": _4 }], "datacenter": [0, { "demo": _4, "paas": _4 }], "kapsi": _4, "123kotisivu": _4, "myspreadshop": _4 }], "fj": [1, { "ac": _3, "biz": _3, "com": _3, "gov": _3, "info": _3, "mil": _3, "name": _3, "net": _3, "org": _3, "pro": _3 }], "fk": _19, "fm": [1, { "com": _3, "edu": _3, "net": _3, "org": _3, "radio": _4, "user": _7 }], "fo": _3, "fr": [1, { "asso": _3, "com": _3, "gouv": _3, "nom": _3, "prd": _3, "tm": _3, "avoues": _3, "cci": _3, "greta": _3, "huissier-justice": _3, "en-root": _4, "fbx-os": _4, "fbxos": _4, "freebox-os": _4, "freeboxos": _4, "goupile": _4, "123siteweb": _4, "on-web": _4, "chirurgiens-dentistes-en-france": _4, "dedibox": _4, "aeroport": _4, "avocat": _4, "chambagri": _4, "chirurgiens-dentistes": _4, "experts-comptables": _4, "medecin": _4, "notaires": _4, "pharmacien": _4, "port": _4, "veterinaire": _4, "myspreadshop": _4, "ynh": _4 }], "ga": _3, "gb": _3, "gd": [1, { "edu": _3, "gov": _3 }], "ge": [1, { "com": _3, "edu": _3, "gov": _3, "net": _3, "org": _3, "pvt": _3, "school": _3 }], "gf": _3, "gg": [1, { "co": _3, "net": _3, "org": _3, "botdash": _4, "kaas": _4, "stackit": _4, "panel": [2, { "daemon": _4 }] }], "gh": [1, { "com": _3, "edu": _3, "gov": _3, "mil": _3, "org": _3 }], "gi": [1, { "com": _3, "edu": _3, "gov": _3, "ltd": _3, "mod": _3, "org": _3 }], "gl": [1, { "co": _3, "com": _3, "edu": _3, "net": _3, "org": _3, "biz": _4 }], "gm": _3, "gn": [1, { "ac": _3, "com": _3, "edu": _3, "gov": _3, "net": _3, "org": _3 }], "gov": _3, "gp": [1, { "asso": _3, "com": _3, "edu": _3, "mobi": _3, "net": _3, "org": _3 }], "gq": _3, "gr": [1, { "com": _3, "edu": _3, "gov": _3, "net": _3, "org": _3, "barsy": _4, "simplesite": _4 }], "gs": _3, "gt": [1, { "com": _3, "edu": _3, "gob": _3, "ind": _3, "mil": _3, "net": _3, "org": _3 }], "gu": [1, { "com": _3, "edu": _3, "gov": _3, "guam": _3, "info": _3, "net": _3, "org": _3, "web": _3 }], "gw": _3, "gy": _48, "hk": [1, { "com": _3, "edu": _3, "gov": _3, "idv": _3, "net": _3, "org": _3, "xn--ciqpn": _3, "\u4E2A\u4EBA": _3, "xn--gmqw5a": _3, "\u500B\u4EBA": _3, "xn--55qx5d": _3, "\u516C\u53F8": _3, "xn--mxtq1m": _3, "\u653F\u5E9C": _3, "xn--lcvr32d": _3, "\u654E\u80B2": _3, "xn--wcvs22d": _3, "\u6559\u80B2": _3, "xn--gmq050i": _3, "\u7B87\u4EBA": _3, "xn--uc0atv": _3, "\u7D44\u7E54": _3, "xn--uc0ay4a": _3, "\u7D44\u7EC7": _3, "xn--od0alg": _3, "\u7DB2\u7D61": _3, "xn--zf0avx": _3, "\u7DB2\u7EDC": _3, "xn--mk0axi": _3, "\u7EC4\u7E54": _3, "xn--tn0ag": _3, "\u7EC4\u7EC7": _3, "xn--od0aq3b": _3, "\u7F51\u7D61": _3, "xn--io0a7i": _3, "\u7F51\u7EDC": _3, "inc": _4, "ltd": _4 }], "hm": _3, "hn": [1, { "com": _3, "edu": _3, "gob": _3, "mil": _3, "net": _3, "org": _3 }], "hr": [1, { "com": _3, "from": _3, "iz": _3, "name": _3, "brendly": _51 }], "ht": [1, { "adult": _3, "art": _3, "asso": _3, "com": _3, "coop": _3, "edu": _3, "firm": _3, "gouv": _3, "info": _3, "med": _3, "net": _3, "org": _3, "perso": _3, "pol": _3, "pro": _3, "rel": _3, "shop": _3, "rt": _4 }], "hu": [1, { "2000": _3, "agrar": _3, "bolt": _3, "casino": _3, "city": _3, "co": _3, "erotica": _3, "erotika": _3, "film": _3, "forum": _3, "games": _3, "hotel": _3, "info": _3, "ingatlan": _3, "jogasz": _3, "konyvelo": _3, "lakas": _3, "media": _3, "news": _3, "org": _3, "priv": _3, "reklam": _3, "sex": _3, "shop": _3, "sport": _3, "suli": _3, "szex": _3, "tm": _3, "tozsde": _3, "utazas": _3, "video": _3 }], "id": [1, { "ac": _3, "biz": _3, "co": _3, "desa": _3, "go": _3, "mil": _3, "my": _3, "net": _3, "or": _3, "ponpes": _3, "sch": _3, "web": _3, "zone": _4 }], "ie": [1, { "gov": _3, "myspreadshop": _4 }], "il": [1, { "ac": _3, "co": [1, { "ravpage": _4, "mytabit": _4, "tabitorder": _4 }], "gov": _3, "idf": _3, "k12": _3, "muni": _3, "net": _3, "org": _3 }], "xn--4dbrk0ce": [1, { "xn--4dbgdty6c": _3, "xn--5dbhl8d": _3, "xn--8dbq2a": _3, "xn--hebda8b": _3 }], "\u05D9\u05E9\u05E8\u05D0\u05DC": [1, { "\u05D0\u05E7\u05D3\u05DE\u05D9\u05D4": _3, "\u05D9\u05E9\u05D5\u05D1": _3, "\u05E6\u05D4\u05DC": _3, "\u05DE\u05DE\u05E9\u05DC": _3 }], "im": [1, { "ac": _3, "co": [1, { "ltd": _3, "plc": _3 }], "com": _3, "net": _3, "org": _3, "tt": _3, "tv": _3 }], "in": [1, { "5g": _3, "6g": _3, "ac": _3, "ai": _3, "am": _3, "bihar": _3, "biz": _3, "business": _3, "ca": _3, "cn": _3, "co": _3, "com": _3, "coop": _3, "cs": _3, "delhi": _3, "dr": _3, "edu": _3, "er": _3, "firm": _3, "gen": _3, "gov": _3, "gujarat": _3, "ind": _3, "info": _3, "int": _3, "internet": _3, "io": _3, "me": _3, "mil": _3, "net": _3, "nic": _3, "org": _3, "pg": _3, "post": _3, "pro": _3, "res": _3, "travel": _3, "tv": _3, "uk": _3, "up": _3, "us": _3, "cloudns": _4, "barsy": _4, "web": _4, "supabase": _4 }], "info": [1, { "cloudns": _4, "dynamic-dns": _4, "barrel-of-knowledge": _4, "barrell-of-knowledge": _4, "dyndns": _4, "for-our": _4, "groks-the": _4, "groks-this": _4, "here-for-more": _4, "knowsitall": _4, "selfip": _4, "webhop": _4, "barsy": _4, "mayfirst": _4, "mittwald": _4, "mittwaldserver": _4, "typo3server": _4, "dvrcam": _4, "ilovecollege": _4, "no-ip": _4, "forumz": _4, "nsupdate": _4, "dnsupdate": _4, "v-info": _4 }], "int": [1, { "eu": _3 }], "io": [1, { "2038": _4, "co": _3, "com": _3, "edu": _3, "gov": _3, "mil": _3, "net": _3, "nom": _3, "org": _3, "on-acorn": _7, "myaddr": _4, "apigee": _4, "b-data": _4, "beagleboard": _4, "bitbucket": _4, "bluebite": _4, "boxfuse": _4, "brave": _8, "browsersafetymark": _4, "bubble": _52, "bubbleapps": _4, "bigv": [0, { "uk0": _4 }], "cleverapps": _4, "cloudbeesusercontent": _4, "dappnode": [0, { "dyndns": _4 }], "darklang": _4, "definima": _4, "dedyn": _4, "fh-muenster": _4, "shw": _4, "forgerock": [0, { "id": _4 }], "github": _4, "gitlab": _4, "lolipop": _4, "hasura-app": _4, "hostyhosting": _4, "hypernode": _4, "moonscale": _7, "beebyte": _41, "beebyteapp": [0, { "sekd1": _4 }], "jele": _4, "webthings": _4, "loginline": _4, "barsy": _4, "azurecontainer": _7, "ngrok": [2, { "ap": _4, "au": _4, "eu": _4, "in": _4, "jp": _4, "sa": _4, "us": _4 }], "nodeart": [0, { "stage": _4 }], "pantheonsite": _4, "pstmn": [2, { "mock": _4 }], "protonet": _4, "qcx": [2, { "sys": _7 }], "qoto": _4, "vaporcloud": _4, "myrdbx": _4, "rb-hosting": _44, "on-k3s": _7, "on-rio": _7, "readthedocs": _4, "resindevice": _4, "resinstaging": [0, { "devices": _4 }], "hzc": _4, "sandcats": _4, "scrypted": [0, { "client": _4 }], "mo-siemens": _4, "lair": _40, "stolos": _7, "musician": _4, "utwente": _4, "edugit": _4, "telebit": _4, "thingdust": [0, { "dev": _53, "disrec": _53, "prod": _54, "testing": _53 }], "tickets": _4, "webflow": _4, "webflowtest": _4, "editorx": _4, "wixstudio": _4, "basicserver": _4, "virtualserver": _4 }], "iq": _6, "ir": [1, { "ac": _3, "co": _3, "gov": _3, "id": _3, "net": _3, "org": _3, "sch": _3, "xn--mgba3a4f16a": _3, "\u0627\u06CC\u0631\u0627\u0646": _3, "xn--mgba3a4fra": _3, "\u0627\u064A\u0631\u0627\u0646": _3, "arvanedge": _4 }], "is": _3, "it": [1, { "edu": _3, "gov": _3, "abr": _3, "abruzzo": _3, "aosta-valley": _3, "aostavalley": _3, "bas": _3, "basilicata": _3, "cal": _3, "calabria": _3, "cam": _3, "campania": _3, "emilia-romagna": _3, "emiliaromagna": _3, "emr": _3, "friuli-v-giulia": _3, "friuli-ve-giulia": _3, "friuli-vegiulia": _3, "friuli-venezia-giulia": _3, "friuli-veneziagiulia": _3, "friuli-vgiulia": _3, "friuliv-giulia": _3, "friulive-giulia": _3, "friulivegiulia": _3, "friulivenezia-giulia": _3, "friuliveneziagiulia": _3, "friulivgiulia": _3, "fvg": _3, "laz": _3, "lazio": _3, "lig": _3, "liguria": _3, "lom": _3, "lombardia": _3, "lombardy": _3, "lucania": _3, "mar": _3, "marche": _3, "mol": _3, "molise": _3, "piedmont": _3, "piemonte": _3, "pmn": _3, "pug": _3, "puglia": _3, "sar": _3, "sardegna": _3, "sardinia": _3, "sic": _3, "sicilia": _3, "sicily": _3, "taa": _3, "tos": _3, "toscana": _3, "trentin-sud-tirol": _3, "xn--trentin-sd-tirol-rzb": _3, "trentin-s\xFCd-tirol": _3, "trentin-sudtirol": _3, "xn--trentin-sdtirol-7vb": _3, "trentin-s\xFCdtirol": _3, "trentin-sued-tirol": _3, "trentin-suedtirol": _3, "trentino": _3, "trentino-a-adige": _3, "trentino-aadige": _3, "trentino-alto-adige": _3, "trentino-altoadige": _3, "trentino-s-tirol": _3, "trentino-stirol": _3, "trentino-sud-tirol": _3, "xn--trentino-sd-tirol-c3b": _3, "trentino-s\xFCd-tirol": _3, "trentino-sudtirol": _3, "xn--trentino-sdtirol-szb": _3, "trentino-s\xFCdtirol": _3, "trentino-sued-tirol": _3, "trentino-suedtirol": _3, "trentinoa-adige": _3, "trentinoaadige": _3, "trentinoalto-adige": _3, "trentinoaltoadige": _3, "trentinos-tirol": _3, "trentinostirol": _3, "trentinosud-tirol": _3, "xn--trentinosd-tirol-rzb": _3, "trentinos\xFCd-tirol": _3, "trentinosudtirol": _3, "xn--trentinosdtirol-7vb": _3, "trentinos\xFCdtirol": _3, "trentinosued-tirol": _3, "trentinosuedtirol": _3, "trentinsud-tirol": _3, "xn--trentinsd-tirol-6vb": _3, "trentins\xFCd-tirol": _3, "trentinsudtirol": _3, "xn--trentinsdtirol-nsb": _3, "trentins\xFCdtirol": _3, "trentinsued-tirol": _3, "trentinsuedtirol": _3, "tuscany": _3, "umb": _3, "umbria": _3, "val-d-aosta": _3, "val-daosta": _3, "vald-aosta": _3, "valdaosta": _3, "valle-aosta": _3, "valle-d-aosta": _3, "valle-daosta": _3, "valleaosta": _3, "valled-aosta": _3, "valledaosta": _3, "vallee-aoste": _3, "xn--valle-aoste-ebb": _3, "vall\xE9e-aoste": _3, "vallee-d-aoste": _3, "xn--valle-d-aoste-ehb": _3, "vall\xE9e-d-aoste": _3, "valleeaoste": _3, "xn--valleaoste-e7a": _3, "vall\xE9eaoste": _3, "valleedaoste": _3, "xn--valledaoste-ebb": _3, "vall\xE9edaoste": _3, "vao": _3, "vda": _3, "ven": _3, "veneto": _3, "ag": _3, "agrigento": _3, "al": _3, "alessandria": _3, "alto-adige": _3, "altoadige": _3, "an": _3, "ancona": _3, "andria-barletta-trani": _3, "andria-trani-barletta": _3, "andriabarlettatrani": _3, "andriatranibarletta": _3, "ao": _3, "aosta": _3, "aoste": _3, "ap": _3, "aq": _3, "aquila": _3, "ar": _3, "arezzo": _3, "ascoli-piceno": _3, "ascolipiceno": _3, "asti": _3, "at": _3, "av": _3, "avellino": _3, "ba": _3, "balsan": _3, "balsan-sudtirol": _3, "xn--balsan-sdtirol-nsb": _3, "balsan-s\xFCdtirol": _3, "balsan-suedtirol": _3, "bari": _3, "barletta-trani-andria": _3, "barlettatraniandria": _3, "belluno": _3, "benevento": _3, "bergamo": _3, "bg": _3, "bi": _3, "biella": _3, "bl": _3, "bn": _3, "bo": _3, "bologna": _3, "bolzano": _3, "bolzano-altoadige": _3, "bozen": _3, "bozen-sudtirol": _3, "xn--bozen-sdtirol-2ob": _3, "bozen-s\xFCdtirol": _3, "bozen-suedtirol": _3, "br": _3, "brescia": _3, "brindisi": _3, "bs": _3, "bt": _3, "bulsan": _3, "bulsan-sudtirol": _3, "xn--bulsan-sdtirol-nsb": _3, "bulsan-s\xFCdtirol": _3, "bulsan-suedtirol": _3, "bz": _3, "ca": _3, "cagliari": _3, "caltanissetta": _3, "campidano-medio": _3, "campidanomedio": _3, "campobasso": _3, "carbonia-iglesias": _3, "carboniaiglesias": _3, "carrara-massa": _3, "carraramassa": _3, "caserta": _3, "catania": _3, "catanzaro": _3, "cb": _3, "ce": _3, "cesena-forli": _3, "xn--cesena-forl-mcb": _3, "cesena-forl\xEC": _3, "cesenaforli": _3, "xn--cesenaforl-i8a": _3, "cesenaforl\xEC": _3, "ch": _3, "chieti": _3, "ci": _3, "cl": _3, "cn": _3, "co": _3, "como": _3, "cosenza": _3, "cr": _3, "cremona": _3, "crotone": _3, "cs": _3, "ct": _3, "cuneo": _3, "cz": _3, "dell-ogliastra": _3, "dellogliastra": _3, "en": _3, "enna": _3, "fc": _3, "fe": _3, "fermo": _3, "ferrara": _3, "fg": _3, "fi": _3, "firenze": _3, "florence": _3, "fm": _3, "foggia": _3, "forli-cesena": _3, "xn--forl-cesena-fcb": _3, "forl\xEC-cesena": _3, "forlicesena": _3, "xn--forlcesena-c8a": _3, "forl\xECcesena": _3, "fr": _3, "frosinone": _3, "ge": _3, "genoa": _3, "genova": _3, "go": _3, "gorizia": _3, "gr": _3, "grosseto": _3, "iglesias-carbonia": _3, "iglesiascarbonia": _3, "im": _3, "imperia": _3, "is": _3, "isernia": _3, "kr": _3, "la-spezia": _3, "laquila": _3, "laspezia": _3, "latina": _3, "lc": _3, "le": _3, "lecce": _3, "lecco": _3, "li": _3, "livorno": _3, "lo": _3, "lodi": _3, "lt": _3, "lu": _3, "lucca": _3, "macerata": _3, "mantova": _3, "massa-carrara": _3, "massacarrara": _3, "matera": _3, "mb": _3, "mc": _3, "me": _3, "medio-campidano": _3, "mediocampidano": _3, "messina": _3, "mi": _3, "milan": _3, "milano": _3, "mn": _3, "mo": _3, "modena": _3, "monza": _3, "monza-brianza": _3, "monza-e-della-brianza": _3, "monzabrianza": _3, "monzaebrianza": _3, "monzaedellabrianza": _3, "ms": _3, "mt": _3, "na": _3, "naples": _3, "napoli": _3, "no": _3, "novara": _3, "nu": _3, "nuoro": _3, "og": _3, "ogliastra": _3, "olbia-tempio": _3, "olbiatempio": _3, "or": _3, "oristano": _3, "ot": _3, "pa": _3, "padova": _3, "padua": _3, "palermo": _3, "parma": _3, "pavia": _3, "pc": _3, "pd": _3, "pe": _3, "perugia": _3, "pesaro-urbino": _3, "pesarourbino": _3, "pescara": _3, "pg": _3, "pi": _3, "piacenza": _3, "pisa": _3, "pistoia": _3, "pn": _3, "po": _3, "pordenone": _3, "potenza": _3, "pr": _3, "prato": _3, "pt": _3, "pu": _3, "pv": _3, "pz": _3, "ra": _3, "ragusa": _3, "ravenna": _3, "rc": _3, "re": _3, "reggio-calabria": _3, "reggio-emilia": _3, "reggiocalabria": _3, "reggioemilia": _3, "rg": _3, "ri": _3, "rieti": _3, "rimini": _3, "rm": _3, "rn": _3, "ro": _3, "roma": _3, "rome": _3, "rovigo": _3, "sa": _3, "salerno": _3, "sassari": _3, "savona": _3, "si": _3, "siena": _3, "siracusa": _3, "so": _3, "sondrio": _3, "sp": _3, "sr": _3, "ss": _3, "xn--sdtirol-n2a": _3, "s\xFCdtirol": _3, "suedtirol": _3, "sv": _3, "ta": _3, "taranto": _3, "te": _3, "tempio-olbia": _3, "tempioolbia": _3, "teramo": _3, "terni": _3, "tn": _3, "to": _3, "torino": _3, "tp": _3, "tr": _3, "trani-andria-barletta": _3, "trani-barletta-andria": _3, "traniandriabarletta": _3, "tranibarlettaandria": _3, "trapani": _3, "trento": _3, "treviso": _3, "trieste": _3, "ts": _3, "turin": _3, "tv": _3, "ud": _3, "udine": _3, "urbino-pesaro": _3, "urbinopesaro": _3, "va": _3, "varese": _3, "vb": _3, "vc": _3, "ve": _3, "venezia": _3, "venice": _3, "verbania": _3, "vercelli": _3, "verona": _3, "vi": _3, "vibo-valentia": _3, "vibovalentia": _3, "vicenza": _3, "viterbo": _3, "vr": _3, "vs": _3, "vt": _3, "vv": _3, "12chars": _4, "ibxos": _4, "iliadboxos": _4, "neen": [0, { "jc": _4 }], "123homepage": _4, "16-b": _4, "32-b": _4, "64-b": _4, "myspreadshop": _4, "syncloud": _4 }], "je": [1, { "co": _3, "net": _3, "org": _3, "of": _4 }], "jm": _19, "jo": [1, { "agri": _3, "ai": _3, "com": _3, "edu": _3, "eng": _3, "fm": _3, "gov": _3, "mil": _3, "net": _3, "org": _3, "per": _3, "phd": _3, "sch": _3, "tv": _3 }], "jobs": _3, "jp": [1, { "ac": _3, "ad": _3, "co": _3, "ed": _3, "go": _3, "gr": _3, "lg": _3, "ne": [1, { "aseinet": _50, "gehirn": _4, "ivory": _4, "mail-box": _4, "mints": _4, "mokuren": _4, "opal": _4, "sakura": _4, "sumomo": _4, "topaz": _4 }], "or": _3, "aichi": [1, { "aisai": _3, "ama": _3, "anjo": _3, "asuke": _3, "chiryu": _3, "chita": _3, "fuso": _3, "gamagori": _3, "handa": _3, "hazu": _3, "hekinan": _3, "higashiura": _3, "ichinomiya": _3, "inazawa": _3, "inuyama": _3, "isshiki": _3, "iwakura": _3, "kanie": _3, "kariya": _3, "kasugai": _3, "kira": _3, "kiyosu": _3, "komaki": _3, "konan": _3, "kota": _3, "mihama": _3, "miyoshi": _3, "nishio": _3, "nisshin": _3, "obu": _3, "oguchi": _3, "oharu": _3, "okazaki": _3, "owariasahi": _3, "seto": _3, "shikatsu": _3, "shinshiro": _3, "shitara": _3, "tahara": _3, "takahama": _3, "tobishima": _3, "toei": _3, "togo": _3, "tokai": _3, "tokoname": _3, "toyoake": _3, "toyohashi": _3, "toyokawa": _3, "toyone": _3, "toyota": _3, "tsushima": _3, "yatomi": _3 }], "akita": [1, { "akita": _3, "daisen": _3, "fujisato": _3, "gojome": _3, "hachirogata": _3, "happou": _3, "higashinaruse": _3, "honjo": _3, "honjyo": _3, "ikawa": _3, "kamikoani": _3, "kamioka": _3, "katagami": _3, "kazuno": _3, "kitaakita": _3, "kosaka": _3, "kyowa": _3, "misato": _3, "mitane": _3, "moriyoshi": _3, "nikaho": _3, "noshiro": _3, "odate": _3, "oga": _3, "ogata": _3, "semboku": _3, "yokote": _3, "yurihonjo": _3 }], "aomori": [1, { "aomori": _3, "gonohe": _3, "hachinohe": _3, "hashikami": _3, "hiranai": _3, "hirosaki": _3, "itayanagi": _3, "kuroishi": _3, "misawa": _3, "mutsu": _3, "nakadomari": _3, "noheji": _3, "oirase": _3, "owani": _3, "rokunohe": _3, "sannohe": _3, "shichinohe": _3, "shingo": _3, "takko": _3, "towada": _3, "tsugaru": _3, "tsuruta": _3 }], "chiba": [1, { "abiko": _3, "asahi": _3, "chonan": _3, "chosei": _3, "choshi": _3, "chuo": _3, "funabashi": _3, "futtsu": _3, "hanamigawa": _3, "ichihara": _3, "ichikawa": _3, "ichinomiya": _3, "inzai": _3, "isumi": _3, "kamagaya": _3, "kamogawa": _3, "kashiwa": _3, "katori": _3, "katsuura": _3, "kimitsu": _3, "kisarazu": _3, "kozaki": _3, "kujukuri": _3, "kyonan": _3, "matsudo": _3, "midori": _3, "mihama": _3, "minamiboso": _3, "mobara": _3, "mutsuzawa": _3, "nagara": _3, "nagareyama": _3, "narashino": _3, "narita": _3, "noda": _3, "oamishirasato": _3, "omigawa": _3, "onjuku": _3, "otaki": _3, "sakae": _3, "sakura": _3, "shimofusa": _3, "shirako": _3, "shiroi": _3, "shisui": _3, "sodegaura": _3, "sosa": _3, "tako": _3, "tateyama": _3, "togane": _3, "tohnosho": _3, "tomisato": _3, "urayasu": _3, "yachimata": _3, "yachiyo": _3, "yokaichiba": _3, "yokoshibahikari": _3, "yotsukaido": _3 }], "ehime": [1, { "ainan": _3, "honai": _3, "ikata": _3, "imabari": _3, "iyo": _3, "kamijima": _3, "kihoku": _3, "kumakogen": _3, "masaki": _3, "matsuno": _3, "matsuyama": _3, "namikata": _3, "niihama": _3, "ozu": _3, "saijo": _3, "seiyo": _3, "shikokuchuo": _3, "tobe": _3, "toon": _3, "uchiko": _3, "uwajima": _3, "yawatahama": _3 }], "fukui": [1, { "echizen": _3, "eiheiji": _3, "fukui": _3, "ikeda": _3, "katsuyama": _3, "mihama": _3, "minamiechizen": _3, "obama": _3, "ohi": _3, "ono": _3, "sabae": _3, "sakai": _3, "takahama": _3, "tsuruga": _3, "wakasa": _3 }], "fukuoka": [1, { "ashiya": _3, "buzen": _3, "chikugo": _3, "chikuho": _3, "chikujo": _3, "chikushino": _3, "chikuzen": _3, "chuo": _3, "dazaifu": _3, "fukuchi": _3, "hakata": _3, "higashi": _3, "hirokawa": _3, "hisayama": _3, "iizuka": _3, "inatsuki": _3, "kaho": _3, "kasuga": _3, "kasuya": _3, "kawara": _3, "keisen": _3, "koga": _3, "kurate": _3, "kurogi": _3, "kurume": _3, "minami": _3, "miyako": _3, "miyama": _3, "miyawaka": _3, "mizumaki": _3, "munakata": _3, "nakagawa": _3, "nakama": _3, "nishi": _3, "nogata": _3, "ogori": _3, "okagaki": _3, "okawa": _3, "oki": _3, "omuta": _3, "onga": _3, "onojo": _3, "oto": _3, "saigawa": _3, "sasaguri": _3, "shingu": _3, "shinyoshitomi": _3, "shonai": _3, "soeda": _3, "sue": _3, "tachiarai": _3, "tagawa": _3, "takata": _3, "toho": _3, "toyotsu": _3, "tsuiki": _3, "ukiha": _3, "umi": _3, "usui": _3, "yamada": _3, "yame": _3, "yanagawa": _3, "yukuhashi": _3 }], "fukushima": [1, { "aizubange": _3, "aizumisato": _3, "aizuwakamatsu": _3, "asakawa": _3, "bandai": _3, "date": _3, "fukushima": _3, "furudono": _3, "futaba": _3, "hanawa": _3, "higashi": _3, "hirata": _3, "hirono": _3, "iitate": _3, "inawashiro": _3, "ishikawa": _3, "iwaki": _3, "izumizaki": _3, "kagamiishi": _3, "kaneyama": _3, "kawamata": _3, "kitakata": _3, "kitashiobara": _3, "koori": _3, "koriyama": _3, "kunimi": _3, "miharu": _3, "mishima": _3, "namie": _3, "nango": _3, "nishiaizu": _3, "nishigo": _3, "okuma": _3, "omotego": _3, "ono": _3, "otama": _3, "samegawa": _3, "shimogo": _3, "shirakawa": _3, "showa": _3, "soma": _3, "sukagawa": _3, "taishin": _3, "tamakawa": _3, "tanagura": _3, "tenei": _3, "yabuki": _3, "yamato": _3, "yamatsuri": _3, "yanaizu": _3, "yugawa": _3 }], "gifu": [1, { "anpachi": _3, "ena": _3, "gifu": _3, "ginan": _3, "godo": _3, "gujo": _3, "hashima": _3, "hichiso": _3, "hida": _3, "higashishirakawa": _3, "ibigawa": _3, "ikeda": _3, "kakamigahara": _3, "kani": _3, "kasahara": _3, "kasamatsu": _3, "kawaue": _3, "kitagata": _3, "mino": _3, "minokamo": _3, "mitake": _3, "mizunami": _3, "motosu": _3, "nakatsugawa": _3, "ogaki": _3, "sakahogi": _3, "seki": _3, "sekigahara": _3, "shirakawa": _3, "tajimi": _3, "takayama": _3, "tarui": _3, "toki": _3, "tomika": _3, "wanouchi": _3, "yamagata": _3, "yaotsu": _3, "yoro": _3 }], "gunma": [1, { "annaka": _3, "chiyoda": _3, "fujioka": _3, "higashiagatsuma": _3, "isesaki": _3, "itakura": _3, "kanna": _3, "kanra": _3, "katashina": _3, "kawaba": _3, "kiryu": _3, "kusatsu": _3, "maebashi": _3, "meiwa": _3, "midori": _3, "minakami": _3, "naganohara": _3, "nakanojo": _3, "nanmoku": _3, "numata": _3, "oizumi": _3, "ora": _3, "ota": _3, "shibukawa": _3, "shimonita": _3, "shinto": _3, "showa": _3, "takasaki": _3, "takayama": _3, "tamamura": _3, "tatebayashi": _3, "tomioka": _3, "tsukiyono": _3, "tsumagoi": _3, "ueno": _3, "yoshioka": _3 }], "hiroshima": [1, { "asaminami": _3, "daiwa": _3, "etajima": _3, "fuchu": _3, "fukuyama": _3, "hatsukaichi": _3, "higashihiroshima": _3, "hongo": _3, "jinsekikogen": _3, "kaita": _3, "kui": _3, "kumano": _3, "kure": _3, "mihara": _3, "miyoshi": _3, "naka": _3, "onomichi": _3, "osakikamijima": _3, "otake": _3, "saka": _3, "sera": _3, "seranishi": _3, "shinichi": _3, "shobara": _3, "takehara": _3 }], "hokkaido": [1, { "abashiri": _3, "abira": _3, "aibetsu": _3, "akabira": _3, "akkeshi": _3, "asahikawa": _3, "ashibetsu": _3, "ashoro": _3, "assabu": _3, "atsuma": _3, "bibai": _3, "biei": _3, "bifuka": _3, "bihoro": _3, "biratori": _3, "chippubetsu": _3, "chitose": _3, "date": _3, "ebetsu": _3, "embetsu": _3, "eniwa": _3, "erimo": _3, "esan": _3, "esashi": _3, "fukagawa": _3, "fukushima": _3, "furano": _3, "furubira": _3, "haboro": _3, "hakodate": _3, "hamatonbetsu": _3, "hidaka": _3, "higashikagura": _3, "higashikawa": _3, "hiroo": _3, "hokuryu": _3, "hokuto": _3, "honbetsu": _3, "horokanai": _3, "horonobe": _3, "ikeda": _3, "imakane": _3, "ishikari": _3, "iwamizawa": _3, "iwanai": _3, "kamifurano": _3, "kamikawa": _3, "kamishihoro": _3, "kamisunagawa": _3, "kamoenai": _3, "kayabe": _3, "kembuchi": _3, "kikonai": _3, "kimobetsu": _3, "kitahiroshima": _3, "kitami": _3, "kiyosato": _3, "koshimizu": _3, "kunneppu": _3, "kuriyama": _3, "kuromatsunai": _3, "kushiro": _3, "kutchan": _3, "kyowa": _3, "mashike": _3, "matsumae": _3, "mikasa": _3, "minamifurano": _3, "mombetsu": _3, "moseushi": _3, "mukawa": _3, "muroran": _3, "naie": _3, "nakagawa": _3, "nakasatsunai": _3, "nakatombetsu": _3, "nanae": _3, "nanporo": _3, "nayoro": _3, "nemuro": _3, "niikappu": _3, "niki": _3, "nishiokoppe": _3, "noboribetsu": _3, "numata": _3, "obihiro": _3, "obira": _3, "oketo": _3, "okoppe": _3, "otaru": _3, "otobe": _3, "otofuke": _3, "otoineppu": _3, "oumu": _3, "ozora": _3, "pippu": _3, "rankoshi": _3, "rebun": _3, "rikubetsu": _3, "rishiri": _3, "rishirifuji": _3, "saroma": _3, "sarufutsu": _3, "shakotan": _3, "shari": _3, "shibecha": _3, "shibetsu": _3, "shikabe": _3, "shikaoi": _3, "shimamaki": _3, "shimizu": _3, "shimokawa": _3, "shinshinotsu": _3, "shintoku": _3, "shiranuka": _3, "shiraoi": _3, "shiriuchi": _3, "sobetsu": _3, "sunagawa": _3, "taiki": _3, "takasu": _3, "takikawa": _3, "takinoue": _3, "teshikaga": _3, "tobetsu": _3, "tohma": _3, "tomakomai": _3, "tomari": _3, "toya": _3, "toyako": _3, "toyotomi": _3, "toyoura": _3, "tsubetsu": _3, "tsukigata": _3, "urakawa": _3, "urausu": _3, "uryu": _3, "utashinai": _3, "wakkanai": _3, "wassamu": _3, "yakumo": _3, "yoichi": _3 }], "hyogo": [1, { "aioi": _3, "akashi": _3, "ako": _3, "amagasaki": _3, "aogaki": _3, "asago": _3, "ashiya": _3, "awaji": _3, "fukusaki": _3, "goshiki": _3, "harima": _3, "himeji": _3, "ichikawa": _3, "inagawa": _3, "itami": _3, "kakogawa": _3, "kamigori": _3, "kamikawa": _3, "kasai": _3, "kasuga": _3, "kawanishi": _3, "miki": _3, "minamiawaji": _3, "nishinomiya": _3, "nishiwaki": _3, "ono": _3, "sanda": _3, "sannan": _3, "sasayama": _3, "sayo": _3, "shingu": _3, "shinonsen": _3, "shiso": _3, "sumoto": _3, "taishi": _3, "taka": _3, "takarazuka": _3, "takasago": _3, "takino": _3, "tamba": _3, "tatsuno": _3, "toyooka": _3, "yabu": _3, "yashiro": _3, "yoka": _3, "yokawa": _3 }], "ibaraki": [1, { "ami": _3, "asahi": _3, "bando": _3, "chikusei": _3, "daigo": _3, "fujishiro": _3, "hitachi": _3, "hitachinaka": _3, "hitachiomiya": _3, "hitachiota": _3, "ibaraki": _3, "ina": _3, "inashiki": _3, "itako": _3, "iwama": _3, "joso": _3, "kamisu": _3, "kasama": _3, "kashima": _3, "kasumigaura": _3, "koga": _3, "miho": _3, "mito": _3, "moriya": _3, "naka": _3, "namegata": _3, "oarai": _3, "ogawa": _3, "omitama": _3, "ryugasaki": _3, "sakai": _3, "sakuragawa": _3, "shimodate": _3, "shimotsuma": _3, "shirosato": _3, "sowa": _3, "suifu": _3, "takahagi": _3, "tamatsukuri": _3, "tokai": _3, "tomobe": _3, "tone": _3, "toride": _3, "tsuchiura": _3, "tsukuba": _3, "uchihara": _3, "ushiku": _3, "yachiyo": _3, "yamagata": _3, "yawara": _3, "yuki": _3 }], "ishikawa": [1, { "anamizu": _3, "hakui": _3, "hakusan": _3, "kaga": _3, "kahoku": _3, "kanazawa": _3, "kawakita": _3, "komatsu": _3, "nakanoto": _3, "nanao": _3, "nomi": _3, "nonoichi": _3, "noto": _3, "shika": _3, "suzu": _3, "tsubata": _3, "tsurugi": _3, "uchinada": _3, "wajima": _3 }], "iwate": [1, { "fudai": _3, "fujisawa": _3, "hanamaki": _3, "hiraizumi": _3, "hirono": _3, "ichinohe": _3, "ichinoseki": _3, "iwaizumi": _3, "iwate": _3, "joboji": _3, "kamaishi": _3, "kanegasaki": _3, "karumai": _3, "kawai": _3, "kitakami": _3, "kuji": _3, "kunohe": _3, "kuzumaki": _3, "miyako": _3, "mizusawa": _3, "morioka": _3, "ninohe": _3, "noda": _3, "ofunato": _3, "oshu": _3, "otsuchi": _3, "rikuzentakata": _3, "shiwa": _3, "shizukuishi": _3, "sumita": _3, "tanohata": _3, "tono": _3, "yahaba": _3, "yamada": _3 }], "kagawa": [1, { "ayagawa": _3, "higashikagawa": _3, "kanonji": _3, "kotohira": _3, "manno": _3, "marugame": _3, "mitoyo": _3, "naoshima": _3, "sanuki": _3, "tadotsu": _3, "takamatsu": _3, "tonosho": _3, "uchinomi": _3, "utazu": _3, "zentsuji": _3 }], "kagoshima": [1, { "akune": _3, "amami": _3, "hioki": _3, "isa": _3, "isen": _3, "izumi": _3, "kagoshima": _3, "kanoya": _3, "kawanabe": _3, "kinko": _3, "kouyama": _3, "makurazaki": _3, "matsumoto": _3, "minamitane": _3, "nakatane": _3, "nishinoomote": _3, "satsumasendai": _3, "soo": _3, "tarumizu": _3, "yusui": _3 }], "kanagawa": [1, { "aikawa": _3, "atsugi": _3, "ayase": _3, "chigasaki": _3, "ebina": _3, "fujisawa": _3, "hadano": _3, "hakone": _3, "hiratsuka": _3, "isehara": _3, "kaisei": _3, "kamakura": _3, "kiyokawa": _3, "matsuda": _3, "minamiashigara": _3, "miura": _3, "nakai": _3, "ninomiya": _3, "odawara": _3, "oi": _3, "oiso": _3, "sagamihara": _3, "samukawa": _3, "tsukui": _3, "yamakita": _3, "yamato": _3, "yokosuka": _3, "yugawara": _3, "zama": _3, "zushi": _3 }], "kochi": [1, { "aki": _3, "geisei": _3, "hidaka": _3, "higashitsuno": _3, "ino": _3, "kagami": _3, "kami": _3, "kitagawa": _3, "kochi": _3, "mihara": _3, "motoyama": _3, "muroto": _3, "nahari": _3, "nakamura": _3, "nankoku": _3, "nishitosa": _3, "niyodogawa": _3, "ochi": _3, "okawa": _3, "otoyo": _3, "otsuki": _3, "sakawa": _3, "sukumo": _3, "susaki": _3, "tosa": _3, "tosashimizu": _3, "toyo": _3, "tsuno": _3, "umaji": _3, "yasuda": _3, "yusuhara": _3 }], "kumamoto": [1, { "amakusa": _3, "arao": _3, "aso": _3, "choyo": _3, "gyokuto": _3, "kamiamakusa": _3, "kikuchi": _3, "kumamoto": _3, "mashiki": _3, "mifune": _3, "minamata": _3, "minamioguni": _3, "nagasu": _3, "nishihara": _3, "oguni": _3, "ozu": _3, "sumoto": _3, "takamori": _3, "uki": _3, "uto": _3, "yamaga": _3, "yamato": _3, "yatsushiro": _3 }], "kyoto": [1, { "ayabe": _3, "fukuchiyama": _3, "higashiyama": _3, "ide": _3, "ine": _3, "joyo": _3, "kameoka": _3, "kamo": _3, "kita": _3, "kizu": _3, "kumiyama": _3, "kyotamba": _3, "kyotanabe": _3, "kyotango": _3, "maizuru": _3, "minami": _3, "minamiyamashiro": _3, "miyazu": _3, "muko": _3, "nagaokakyo": _3, "nakagyo": _3, "nantan": _3, "oyamazaki": _3, "sakyo": _3, "seika": _3, "tanabe": _3, "uji": _3, "ujitawara": _3, "wazuka": _3, "yamashina": _3, "yawata": _3 }], "mie": [1, { "asahi": _3, "inabe": _3, "ise": _3, "kameyama": _3, "kawagoe": _3, "kiho": _3, "kisosaki": _3, "kiwa": _3, "komono": _3, "kumano": _3, "kuwana": _3, "matsusaka": _3, "meiwa": _3, "mihama": _3, "minamiise": _3, "misugi": _3, "miyama": _3, "nabari": _3, "shima": _3, "suzuka": _3, "tado": _3, "taiki": _3, "taki": _3, "tamaki": _3, "toba": _3, "tsu": _3, "udono": _3, "ureshino": _3, "watarai": _3, "yokkaichi": _3 }], "miyagi": [1, { "furukawa": _3, "higashimatsushima": _3, "ishinomaki": _3, "iwanuma": _3, "kakuda": _3, "kami": _3, "kawasaki": _3, "marumori": _3, "matsushima": _3, "minamisanriku": _3, "misato": _3, "murata": _3, "natori": _3, "ogawara": _3, "ohira": _3, "onagawa": _3, "osaki": _3, "rifu": _3, "semine": _3, "shibata": _3, "shichikashuku": _3, "shikama": _3, "shiogama": _3, "shiroishi": _3, "tagajo": _3, "taiwa": _3, "tome": _3, "tomiya": _3, "wakuya": _3, "watari": _3, "yamamoto": _3, "zao": _3 }], "miyazaki": [1, { "aya": _3, "ebino": _3, "gokase": _3, "hyuga": _3, "kadogawa": _3, "kawaminami": _3, "kijo": _3, "kitagawa": _3, "kitakata": _3, "kitaura": _3, "kobayashi": _3, "kunitomi": _3, "kushima": _3, "mimata": _3, "miyakonojo": _3, "miyazaki": _3, "morotsuka": _3, "nichinan": _3, "nishimera": _3, "nobeoka": _3, "saito": _3, "shiiba": _3, "shintomi": _3, "takaharu": _3, "takanabe": _3, "takazaki": _3, "tsuno": _3 }], "nagano": [1, { "achi": _3, "agematsu": _3, "anan": _3, "aoki": _3, "asahi": _3, "azumino": _3, "chikuhoku": _3, "chikuma": _3, "chino": _3, "fujimi": _3, "hakuba": _3, "hara": _3, "hiraya": _3, "iida": _3, "iijima": _3, "iiyama": _3, "iizuna": _3, "ikeda": _3, "ikusaka": _3, "ina": _3, "karuizawa": _3, "kawakami": _3, "kiso": _3, "kisofukushima": _3, "kitaaiki": _3, "komagane": _3, "komoro": _3, "matsukawa": _3, "matsumoto": _3, "miasa": _3, "minamiaiki": _3, "minamimaki": _3, "minamiminowa": _3, "minowa": _3, "miyada": _3, "miyota": _3, "mochizuki": _3, "nagano": _3, "nagawa": _3, "nagiso": _3, "nakagawa": _3, "nakano": _3, "nozawaonsen": _3, "obuse": _3, "ogawa": _3, "okaya": _3, "omachi": _3, "omi": _3, "ookuwa": _3, "ooshika": _3, "otaki": _3, "otari": _3, "sakae": _3, "sakaki": _3, "saku": _3, "sakuho": _3, "shimosuwa": _3, "shinanomachi": _3, "shiojiri": _3, "suwa": _3, "suzaka": _3, "takagi": _3, "takamori": _3, "takayama": _3, "tateshina": _3, "tatsuno": _3, "togakushi": _3, "togura": _3, "tomi": _3, "ueda": _3, "wada": _3, "yamagata": _3, "yamanouchi": _3, "yasaka": _3, "yasuoka": _3 }], "nagasaki": [1, { "chijiwa": _3, "futsu": _3, "goto": _3, "hasami": _3, "hirado": _3, "iki": _3, "isahaya": _3, "kawatana": _3, "kuchinotsu": _3, "matsuura": _3, "nagasaki": _3, "obama": _3, "omura": _3, "oseto": _3, "saikai": _3, "sasebo": _3, "seihi": _3, "shimabara": _3, "shinkamigoto": _3, "togitsu": _3, "tsushima": _3, "unzen": _3 }], "nara": [1, { "ando": _3, "gose": _3, "heguri": _3, "higashiyoshino": _3, "ikaruga": _3, "ikoma": _3, "kamikitayama": _3, "kanmaki": _3, "kashiba": _3, "kashihara": _3, "katsuragi": _3, "kawai": _3, "kawakami": _3, "kawanishi": _3, "koryo": _3, "kurotaki": _3, "mitsue": _3, "miyake": _3, "nara": _3, "nosegawa": _3, "oji": _3, "ouda": _3, "oyodo": _3, "sakurai": _3, "sango": _3, "shimoichi": _3, "shimokitayama": _3, "shinjo": _3, "soni": _3, "takatori": _3, "tawaramoto": _3, "tenkawa": _3, "tenri": _3, "uda": _3, "yamatokoriyama": _3, "yamatotakada": _3, "yamazoe": _3, "yoshino": _3 }], "niigata": [1, { "aga": _3, "agano": _3, "gosen": _3, "itoigawa": _3, "izumozaki": _3, "joetsu": _3, "kamo": _3, "kariwa": _3, "kashiwazaki": _3, "minamiuonuma": _3, "mitsuke": _3, "muika": _3, "murakami": _3, "myoko": _3, "nagaoka": _3, "niigata": _3, "ojiya": _3, "omi": _3, "sado": _3, "sanjo": _3, "seiro": _3, "seirou": _3, "sekikawa": _3, "shibata": _3, "tagami": _3, "tainai": _3, "tochio": _3, "tokamachi": _3, "tsubame": _3, "tsunan": _3, "uonuma": _3, "yahiko": _3, "yoita": _3, "yuzawa": _3 }], "oita": [1, { "beppu": _3, "bungoono": _3, "bungotakada": _3, "hasama": _3, "hiji": _3, "himeshima": _3, "hita": _3, "kamitsue": _3, "kokonoe": _3, "kuju": _3, "kunisaki": _3, "kusu": _3, "oita": _3, "saiki": _3, "taketa": _3, "tsukumi": _3, "usa": _3, "usuki": _3, "yufu": _3 }], "okayama": [1, { "akaiwa": _3, "asakuchi": _3, "bizen": _3, "hayashima": _3, "ibara": _3, "kagamino": _3, "kasaoka": _3, "kibichuo": _3, "kumenan": _3, "kurashiki": _3, "maniwa": _3, "misaki": _3, "nagi": _3, "niimi": _3, "nishiawakura": _3, "okayama": _3, "satosho": _3, "setouchi": _3, "shinjo": _3, "shoo": _3, "soja": _3, "takahashi": _3, "tamano": _3, "tsuyama": _3, "wake": _3, "yakage": _3 }], "okinawa": [1, { "aguni": _3, "ginowan": _3, "ginoza": _3, "gushikami": _3, "haebaru": _3, "higashi": _3, "hirara": _3, "iheya": _3, "ishigaki": _3, "ishikawa": _3, "itoman": _3, "izena": _3, "kadena": _3, "kin": _3, "kitadaito": _3, "kitanakagusuku": _3, "kumejima": _3, "kunigami": _3, "minamidaito": _3, "motobu": _3, "nago": _3, "naha": _3, "nakagusuku": _3, "nakijin": _3, "nanjo": _3, "nishihara": _3, "ogimi": _3, "okinawa": _3, "onna": _3, "shimoji": _3, "taketomi": _3, "tarama": _3, "tokashiki": _3, "tomigusuku": _3, "tonaki": _3, "urasoe": _3, "uruma": _3, "yaese": _3, "yomitan": _3, "yonabaru": _3, "yonaguni": _3, "zamami": _3 }], "osaka": [1, { "abeno": _3, "chihayaakasaka": _3, "chuo": _3, "daito": _3, "fujiidera": _3, "habikino": _3, "hannan": _3, "higashiosaka": _3, "higashisumiyoshi": _3, "higashiyodogawa": _3, "hirakata": _3, "ibaraki": _3, "ikeda": _3, "izumi": _3, "izumiotsu": _3, "izumisano": _3, "kadoma": _3, "kaizuka": _3, "kanan": _3, "kashiwara": _3, "katano": _3, "kawachinagano": _3, "kishiwada": _3, "kita": _3, "kumatori": _3, "matsubara": _3, "minato": _3, "minoh": _3, "misaki": _3, "moriguchi": _3, "neyagawa": _3, "nishi": _3, "nose": _3, "osakasayama": _3, "sakai": _3, "sayama": _3, "sennan": _3, "settsu": _3, "shijonawate": _3, "shimamoto": _3, "suita": _3, "tadaoka": _3, "taishi": _3, "tajiri": _3, "takaishi": _3, "takatsuki": _3, "tondabayashi": _3, "toyonaka": _3, "toyono": _3, "yao": _3 }], "saga": [1, { "ariake": _3, "arita": _3, "fukudomi": _3, "genkai": _3, "hamatama": _3, "hizen": _3, "imari": _3, "kamimine": _3, "kanzaki": _3, "karatsu": _3, "kashima": _3, "kitagata": _3, "kitahata": _3, "kiyama": _3, "kouhoku": _3, "kyuragi": _3, "nishiarita": _3, "ogi": _3, "omachi": _3, "ouchi": _3, "saga": _3, "shiroishi": _3, "taku": _3, "tara": _3, "tosu": _3, "yoshinogari": _3 }], "saitama": [1, { "arakawa": _3, "asaka": _3, "chichibu": _3, "fujimi": _3, "fujimino": _3, "fukaya": _3, "hanno": _3, "hanyu": _3, "hasuda": _3, "hatogaya": _3, "hatoyama": _3, "hidaka": _3, "higashichichibu": _3, "higashimatsuyama": _3, "honjo": _3, "ina": _3, "iruma": _3, "iwatsuki": _3, "kamiizumi": _3, "kamikawa": _3, "kamisato": _3, "kasukabe": _3, "kawagoe": _3, "kawaguchi": _3, "kawajima": _3, "kazo": _3, "kitamoto": _3, "koshigaya": _3, "kounosu": _3, "kuki": _3, "kumagaya": _3, "matsubushi": _3, "minano": _3, "misato": _3, "miyashiro": _3, "miyoshi": _3, "moroyama": _3, "nagatoro": _3, "namegawa": _3, "niiza": _3, "ogano": _3, "ogawa": _3, "ogose": _3, "okegawa": _3, "omiya": _3, "otaki": _3, "ranzan": _3, "ryokami": _3, "saitama": _3, "sakado": _3, "satte": _3, "sayama": _3, "shiki": _3, "shiraoka": _3, "soka": _3, "sugito": _3, "toda": _3, "tokigawa": _3, "tokorozawa": _3, "tsurugashima": _3, "urawa": _3, "warabi": _3, "yashio": _3, "yokoze": _3, "yono": _3, "yorii": _3, "yoshida": _3, "yoshikawa": _3, "yoshimi": _3 }], "shiga": [1, { "aisho": _3, "gamo": _3, "higashiomi": _3, "hikone": _3, "koka": _3, "konan": _3, "kosei": _3, "koto": _3, "kusatsu": _3, "maibara": _3, "moriyama": _3, "nagahama": _3, "nishiazai": _3, "notogawa": _3, "omihachiman": _3, "otsu": _3, "ritto": _3, "ryuoh": _3, "takashima": _3, "takatsuki": _3, "torahime": _3, "toyosato": _3, "yasu": _3 }], "shimane": [1, { "akagi": _3, "ama": _3, "gotsu": _3, "hamada": _3, "higashiizumo": _3, "hikawa": _3, "hikimi": _3, "izumo": _3, "kakinoki": _3, "masuda": _3, "matsue": _3, "misato": _3, "nishinoshima": _3, "ohda": _3, "okinoshima": _3, "okuizumo": _3, "shimane": _3, "tamayu": _3, "tsuwano": _3, "unnan": _3, "yakumo": _3, "yasugi": _3, "yatsuka": _3 }], "shizuoka": [1, { "arai": _3, "atami": _3, "fuji": _3, "fujieda": _3, "fujikawa": _3, "fujinomiya": _3, "fukuroi": _3, "gotemba": _3, "haibara": _3, "hamamatsu": _3, "higashiizu": _3, "ito": _3, "iwata": _3, "izu": _3, "izunokuni": _3, "kakegawa": _3, "kannami": _3, "kawanehon": _3, "kawazu": _3, "kikugawa": _3, "kosai": _3, "makinohara": _3, "matsuzaki": _3, "minamiizu": _3, "mishima": _3, "morimachi": _3, "nishiizu": _3, "numazu": _3, "omaezaki": _3, "shimada": _3, "shimizu": _3, "shimoda": _3, "shizuoka": _3, "susono": _3, "yaizu": _3, "yoshida": _3 }], "tochigi": [1, { "ashikaga": _3, "bato": _3, "haga": _3, "ichikai": _3, "iwafune": _3, "kaminokawa": _3, "kanuma": _3, "karasuyama": _3, "kuroiso": _3, "mashiko": _3, "mibu": _3, "moka": _3, "motegi": _3, "nasu": _3, "nasushiobara": _3, "nikko": _3, "nishikata": _3, "nogi": _3, "ohira": _3, "ohtawara": _3, "oyama": _3, "sakura": _3, "sano": _3, "shimotsuke": _3, "shioya": _3, "takanezawa": _3, "tochigi": _3, "tsuga": _3, "ujiie": _3, "utsunomiya": _3, "yaita": _3 }], "tokushima": [1, { "aizumi": _3, "anan": _3, "ichiba": _3, "itano": _3, "kainan": _3, "komatsushima": _3, "matsushige": _3, "mima": _3, "minami": _3, "miyoshi": _3, "mugi": _3, "nakagawa": _3, "naruto": _3, "sanagochi": _3, "shishikui": _3, "tokushima": _3, "wajiki": _3 }], "tokyo": [1, { "adachi": _3, "akiruno": _3, "akishima": _3, "aogashima": _3, "arakawa": _3, "bunkyo": _3, "chiyoda": _3, "chofu": _3, "chuo": _3, "edogawa": _3, "fuchu": _3, "fussa": _3, "hachijo": _3, "hachioji": _3, "hamura": _3, "higashikurume": _3, "higashimurayama": _3, "higashiyamato": _3, "hino": _3, "hinode": _3, "hinohara": _3, "inagi": _3, "itabashi": _3, "katsushika": _3, "kita": _3, "kiyose": _3, "kodaira": _3, "koganei": _3, "kokubunji": _3, "komae": _3, "koto": _3, "kouzushima": _3, "kunitachi": _3, "machida": _3, "meguro": _3, "minato": _3, "mitaka": _3, "mizuho": _3, "musashimurayama": _3, "musashino": _3, "nakano": _3, "nerima": _3, "ogasawara": _3, "okutama": _3, "ome": _3, "oshima": _3, "ota": _3, "setagaya": _3, "shibuya": _3, "shinagawa": _3, "shinjuku": _3, "suginami": _3, "sumida": _3, "tachikawa": _3, "taito": _3, "tama": _3, "toshima": _3 }], "tottori": [1, { "chizu": _3, "hino": _3, "kawahara": _3, "koge": _3, "kotoura": _3, "misasa": _3, "nanbu": _3, "nichinan": _3, "sakaiminato": _3, "tottori": _3, "wakasa": _3, "yazu": _3, "yonago": _3 }], "toyama": [1, { "asahi": _3, "fuchu": _3, "fukumitsu": _3, "funahashi": _3, "himi": _3, "imizu": _3, "inami": _3, "johana": _3, "kamiichi": _3, "kurobe": _3, "nakaniikawa": _3, "namerikawa": _3, "nanto": _3, "nyuzen": _3, "oyabe": _3, "taira": _3, "takaoka": _3, "tateyama": _3, "toga": _3, "tonami": _3, "toyama": _3, "unazuki": _3, "uozu": _3, "yamada": _3 }], "wakayama": [1, { "arida": _3, "aridagawa": _3, "gobo": _3, "hashimoto": _3, "hidaka": _3, "hirogawa": _3, "inami": _3, "iwade": _3, "kainan": _3, "kamitonda": _3, "katsuragi": _3, "kimino": _3, "kinokawa": _3, "kitayama": _3, "koya": _3, "koza": _3, "kozagawa": _3, "kudoyama": _3, "kushimoto": _3, "mihama": _3, "misato": _3, "nachikatsuura": _3, "shingu": _3, "shirahama": _3, "taiji": _3, "tanabe": _3, "wakayama": _3, "yuasa": _3, "yura": _3 }], "yamagata": [1, { "asahi": _3, "funagata": _3, "higashine": _3, "iide": _3, "kahoku": _3, "kaminoyama": _3, "kaneyama": _3, "kawanishi": _3, "mamurogawa": _3, "mikawa": _3, "murayama": _3, "nagai": _3, "nakayama": _3, "nanyo": _3, "nishikawa": _3, "obanazawa": _3, "oe": _3, "oguni": _3, "ohkura": _3, "oishida": _3, "sagae": _3, "sakata": _3, "sakegawa": _3, "shinjo": _3, "shirataka": _3, "shonai": _3, "takahata": _3, "tendo": _3, "tozawa": _3, "tsuruoka": _3, "yamagata": _3, "yamanobe": _3, "yonezawa": _3, "yuza": _3 }], "yamaguchi": [1, { "abu": _3, "hagi": _3, "hikari": _3, "hofu": _3, "iwakuni": _3, "kudamatsu": _3, "mitou": _3, "nagato": _3, "oshima": _3, "shimonoseki": _3, "shunan": _3, "tabuse": _3, "tokuyama": _3, "toyota": _3, "ube": _3, "yuu": _3 }], "yamanashi": [1, { "chuo": _3, "doshi": _3, "fuefuki": _3, "fujikawa": _3, "fujikawaguchiko": _3, "fujiyoshida": _3, "hayakawa": _3, "hokuto": _3, "ichikawamisato": _3, "kai": _3, "kofu": _3, "koshu": _3, "kosuge": _3, "minami-alps": _3, "minobu": _3, "nakamichi": _3, "nanbu": _3, "narusawa": _3, "nirasaki": _3, "nishikatsura": _3, "oshino": _3, "otsuki": _3, "showa": _3, "tabayama": _3, "tsuru": _3, "uenohara": _3, "yamanakako": _3, "yamanashi": _3 }], "xn--ehqz56n": _3, "\u4E09\u91CD": _3, "xn--1lqs03n": _3, "\u4EAC\u90FD": _3, "xn--qqqt11m": _3, "\u4F50\u8CC0": _3, "xn--f6qx53a": _3, "\u5175\u5EAB": _3, "xn--djrs72d6uy": _3, "\u5317\u6D77\u9053": _3, "xn--mkru45i": _3, "\u5343\u8449": _3, "xn--0trq7p7nn": _3, "\u548C\u6B4C\u5C71": _3, "xn--5js045d": _3, "\u57FC\u7389": _3, "xn--kbrq7o": _3, "\u5927\u5206": _3, "xn--pssu33l": _3, "\u5927\u962A": _3, "xn--ntsq17g": _3, "\u5948\u826F": _3, "xn--uisz3g": _3, "\u5BAE\u57CE": _3, "xn--6btw5a": _3, "\u5BAE\u5D0E": _3, "xn--1ctwo": _3, "\u5BCC\u5C71": _3, "xn--6orx2r": _3, "\u5C71\u53E3": _3, "xn--rht61e": _3, "\u5C71\u5F62": _3, "xn--rht27z": _3, "\u5C71\u68A8": _3, "xn--nit225k": _3, "\u5C90\u961C": _3, "xn--rht3d": _3, "\u5CA1\u5C71": _3, "xn--djty4k": _3, "\u5CA9\u624B": _3, "xn--klty5x": _3, "\u5CF6\u6839": _3, "xn--kltx9a": _3, "\u5E83\u5CF6": _3, "xn--kltp7d": _3, "\u5FB3\u5CF6": _3, "xn--c3s14m": _3, "\u611B\u5A9B": _3, "xn--vgu402c": _3, "\u611B\u77E5": _3, "xn--efvn9s": _3, "\u65B0\u6F5F": _3, "xn--1lqs71d": _3, "\u6771\u4EAC": _3, "xn--4pvxs": _3, "\u6803\u6728": _3, "xn--uuwu58a": _3, "\u6C96\u7E04": _3, "xn--zbx025d": _3, "\u6ECB\u8CC0": _3, "xn--8pvr4u": _3, "\u718A\u672C": _3, "xn--5rtp49c": _3, "\u77F3\u5DDD": _3, "xn--ntso0iqx3a": _3, "\u795E\u5948\u5DDD": _3, "xn--elqq16h": _3, "\u798F\u4E95": _3, "xn--4it168d": _3, "\u798F\u5CA1": _3, "xn--klt787d": _3, "\u798F\u5CF6": _3, "xn--rny31h": _3, "\u79CB\u7530": _3, "xn--7t0a264c": _3, "\u7FA4\u99AC": _3, "xn--uist22h": _3, "\u8328\u57CE": _3, "xn--8ltr62k": _3, "\u9577\u5D0E": _3, "xn--2m4a15e": _3, "\u9577\u91CE": _3, "xn--32vp30h": _3, "\u9752\u68EE": _3, "xn--4it797k": _3, "\u9759\u5CA1": _3, "xn--5rtq34k": _3, "\u9999\u5DDD": _3, "xn--k7yn95e": _3, "\u9AD8\u77E5": _3, "xn--tor131o": _3, "\u9CE5\u53D6": _3, "xn--d5qv7z876c": _3, "\u9E7F\u5150\u5CF6": _3, "kawasaki": _19, "kitakyushu": _19, "kobe": _19, "nagoya": _19, "sapporo": _19, "sendai": _19, "yokohama": _19, "buyshop": _4, "fashionstore": _4, "handcrafted": _4, "kawaiishop": _4, "supersale": _4, "theshop": _4, "0am": _4, "0g0": _4, "0j0": _4, "0t0": _4, "mydns": _4, "pgw": _4, "wjg": _4, "usercontent": _4, "angry": _4, "babyblue": _4, "babymilk": _4, "backdrop": _4, "bambina": _4, "bitter": _4, "blush": _4, "boo": _4, "boy": _4, "boyfriend": _4, "but": _4, "candypop": _4, "capoo": _4, "catfood": _4, "cheap": _4, "chicappa": _4, "chillout": _4, "chips": _4, "chowder": _4, "chu": _4, "ciao": _4, "cocotte": _4, "coolblog": _4, "cranky": _4, "cutegirl": _4, "daa": _4, "deca": _4, "deci": _4, "digick": _4, "egoism": _4, "fakefur": _4, "fem": _4, "flier": _4, "floppy": _4, "fool": _4, "frenchkiss": _4, "girlfriend": _4, "girly": _4, "gloomy": _4, "gonna": _4, "greater": _4, "hacca": _4, "heavy": _4, "her": _4, "hiho": _4, "hippy": _4, "holy": _4, "hungry": _4, "icurus": _4, "itigo": _4, "jellybean": _4, "kikirara": _4, "kill": _4, "kilo": _4, "kuron": _4, "littlestar": _4, "lolipopmc": _4, "lolitapunk": _4, "lomo": _4, "lovepop": _4, "lovesick": _4, "main": _4, "mods": _4, "mond": _4, "mongolian": _4, "moo": _4, "namaste": _4, "nikita": _4, "nobushi": _4, "noor": _4, "oops": _4, "parallel": _4, "parasite": _4, "pecori": _4, "peewee": _4, "penne": _4, "pepper": _4, "perma": _4, "pigboat": _4, "pinoko": _4, "punyu": _4, "pupu": _4, "pussycat": _4, "pya": _4, "raindrop": _4, "readymade": _4, "sadist": _4, "schoolbus": _4, "secret": _4, "staba": _4, "stripper": _4, "sub": _4, "sunnyday": _4, "thick": _4, "tonkotsu": _4, "under": _4, "upper": _4, "velvet": _4, "verse": _4, "versus": _4, "vivian": _4, "watson": _4, "weblike": _4, "whitesnow": _4, "zombie": _4, "hateblo": _4, "hatenablog": _4, "hatenadiary": _4, "2-d": _4, "bona": _4, "crap": _4, "daynight": _4, "eek": _4, "flop": _4, "halfmoon": _4, "jeez": _4, "matrix": _4, "mimoza": _4, "netgamers": _4, "nyanta": _4, "o0o0": _4, "rdy": _4, "rgr": _4, "rulez": _4, "sakurastorage": [0, { "isk01": _55, "isk02": _55 }], "saloon": _4, "sblo": _4, "skr": _4, "tank": _4, "uh-oh": _4, "undo": _4, "webaccel": [0, { "rs": _4, "user": _4 }], "websozai": _4, "xii": _4 }], "ke": [1, { "ac": _3, "co": _3, "go": _3, "info": _3, "me": _3, "mobi": _3, "ne": _3, "or": _3, "sc": _3 }], "kg": [1, { "com": _3, "edu": _3, "gov": _3, "mil": _3, "net": _3, "org": _3, "us": _4 }], "kh": _19, "ki": _56, "km": [1, { "ass": _3, "com": _3, "edu": _3, "gov": _3, "mil": _3, "nom": _3, "org": _3, "prd": _3, "tm": _3, "asso": _3, "coop": _3, "gouv": _3, "medecin": _3, "notaires": _3, "pharmaciens": _3, "presse": _3, "veterinaire": _3 }], "kn": [1, { "edu": _3, "gov": _3, "net": _3, "org": _3 }], "kp": [1, { "com": _3, "edu": _3, "gov": _3, "org": _3, "rep": _3, "tra": _3 }], "kr": [1, { "ac": _3, "ai": _3, "co": _3, "es": _3, "go": _3, "hs": _3, "io": _3, "it": _3, "kg": _3, "me": _3, "mil": _3, "ms": _3, "ne": _3, "or": _3, "pe": _3, "re": _3, "sc": _3, "busan": _3, "chungbuk": _3, "chungnam": _3, "daegu": _3, "daejeon": _3, "gangwon": _3, "gwangju": _3, "gyeongbuk": _3, "gyeonggi": _3, "gyeongnam": _3, "incheon": _3, "jeju": _3, "jeonbuk": _3, "jeonnam": _3, "seoul": _3, "ulsan": _3, "c01": _4, "eliv-dns": _4 }], "kw": [1, { "com": _3, "edu": _3, "emb": _3, "gov": _3, "ind": _3, "net": _3, "org": _3 }], "ky": _45, "kz": [1, { "com": _3, "edu": _3, "gov": _3, "mil": _3, "net": _3, "org": _3, "jcloud": _4 }], "la": [1, { "com": _3, "edu": _3, "gov": _3, "info": _3, "int": _3, "net": _3, "org": _3, "per": _3, "bnr": _4 }], "lb": _5, "lc": [1, { "co": _3, "com": _3, "edu": _3, "gov": _3, "net": _3, "org": _3, "oy": _4 }], "li": _3, "lk": [1, { "ac": _3, "assn": _3, "com": _3, "edu": _3, "gov": _3, "grp": _3, "hotel": _3, "int": _3, "ltd": _3, "net": _3, "ngo": _3, "org": _3, "sch": _3, "soc": _3, "web": _3 }], "lr": _5, "ls": [1, { "ac": _3, "biz": _3, "co": _3, "edu": _3, "gov": _3, "info": _3, "net": _3, "org": _3, "sc": _3 }], "lt": _12, "lu": [1, { "123website": _4 }], "lv": [1, { "asn": _3, "com": _3, "conf": _3, "edu": _3, "gov": _3, "id": _3, "mil": _3, "net": _3, "org": _3 }], "ly": [1, { "com": _3, "edu": _3, "gov": _3, "id": _3, "med": _3, "net": _3, "org": _3, "plc": _3, "sch": _3 }], "ma": [1, { "ac": _3, "co": _3, "gov": _3, "net": _3, "org": _3, "press": _3 }], "mc": [1, { "asso": _3, "tm": _3 }], "md": [1, { "ir": _4 }], "me": [1, { "ac": _3, "co": _3, "edu": _3, "gov": _3, "its": _3, "net": _3, "org": _3, "priv": _3, "c66": _4, "craft": _4, "edgestack": _4, "filegear": _4, "glitch": _4, "filegear-sg": _4, "lohmus": _4, "barsy": _4, "mcdir": _4, "brasilia": _4, "ddns": _4, "dnsfor": _4, "hopto": _4, "loginto": _4, "noip": _4, "webhop": _4, "soundcast": _4, "tcp4": _4, "vp4": _4, "diskstation": _4, "dscloud": _4, "i234": _4, "myds": _4, "synology": _4, "transip": _44, "nohost": _4 }], "mg": [1, { "co": _3, "com": _3, "edu": _3, "gov": _3, "mil": _3, "nom": _3, "org": _3, "prd": _3 }], "mh": _3, "mil": _3, "mk": [1, { "com": _3, "edu": _3, "gov": _3, "inf": _3, "name": _3, "net": _3, "org": _3 }], "ml": [1, { "ac": _3, "art": _3, "asso": _3, "com": _3, "edu": _3, "gouv": _3, "gov": _3, "info": _3, "inst": _3, "net": _3, "org": _3, "pr": _3, "presse": _3 }], "mm": _19, "mn": [1, { "edu": _3, "gov": _3, "org": _3, "nyc": _4 }], "mo": _5, "mobi": [1, { "barsy": _4, "dscloud": _4 }], "mp": [1, { "ju": _4 }], "mq": _3, "mr": _12, "ms": [1, { "com": _3, "edu": _3, "gov": _3, "net": _3, "org": _3, "minisite": _4 }], "mt": _45, "mu": [1, { "ac": _3, "co": _3, "com": _3, "gov": _3, "net": _3, "or": _3, "org": _3 }], "museum": _3, "mv": [1, { "aero": _3, "biz": _3, "com": _3, "coop": _3, "edu": _3, "gov": _3, "info": _3, "int": _3, "mil": _3, "museum": _3, "name": _3, "net": _3, "org": _3, "pro": _3 }], "mw": [1, { "ac": _3, "biz": _3, "co": _3, "com": _3, "coop": _3, "edu": _3, "gov": _3, "int": _3, "net": _3, "org": _3 }], "mx": [1, { "com": _3, "edu": _3, "gob": _3, "net": _3, "org": _3 }], "my": [1, { "biz": _3, "com": _3, "edu": _3, "gov": _3, "mil": _3, "name": _3, "net": _3, "org": _3 }], "mz": [1, { "ac": _3, "adv": _3, "co": _3, "edu": _3, "gov": _3, "mil": _3, "net": _3, "org": _3 }], "na": [1, { "alt": _3, "co": _3, "com": _3, "gov": _3, "net": _3, "org": _3 }], "name": [1, { "her": _58, "his": _58 }], "nc": [1, { "asso": _3, "nom": _3 }], "ne": _3, "net": [1, { "adobeaemcloud": _4, "adobeio-static": _4, "adobeioruntime": _4, "akadns": _4, "akamai": _4, "akamai-staging": _4, "akamaiedge": _4, "akamaiedge-staging": _4, "akamaihd": _4, "akamaihd-staging": _4, "akamaiorigin": _4, "akamaiorigin-staging": _4, "akamaized": _4, "akamaized-staging": _4, "edgekey": _4, "edgekey-staging": _4, "edgesuite": _4, "edgesuite-staging": _4, "alwaysdata": _4, "myamaze": _4, "cloudfront": _4, "appudo": _4, "atlassian-dev": [0, { "prod": _52 }], "myfritz": _4, "onavstack": _4, "shopselect": _4, "blackbaudcdn": _4, "boomla": _4, "bplaced": _4, "square7": _4, "cdn77": [0, { "r": _4 }], "cdn77-ssl": _4, "gb": _4, "hu": _4, "jp": _4, "se": _4, "uk": _4, "clickrising": _4, "ddns-ip": _4, "dns-cloud": _4, "dns-dynamic": _4, "cloudaccess": _4, "cloudflare": [2, { "cdn": _4 }], "cloudflareanycast": _52, "cloudflarecn": _52, "cloudflareglobal": _52, "ctfcloud": _4, "feste-ip": _4, "knx-server": _4, "static-access": _4, "cryptonomic": _7, "dattolocal": _4, "mydatto": _4, "debian": _4, "definima": _4, "deno": _4, "at-band-camp": _4, "blogdns": _4, "broke-it": _4, "buyshouses": _4, "dnsalias": _4, "dnsdojo": _4, "does-it": _4, "dontexist": _4, "dynalias": _4, "dynathome": _4, "endofinternet": _4, "from-az": _4, "from-co": _4, "from-la": _4, "from-ny": _4, "gets-it": _4, "ham-radio-op": _4, "homeftp": _4, "homeip": _4, "homelinux": _4, "homeunix": _4, "in-the-band": _4, "is-a-chef": _4, "is-a-geek": _4, "isa-geek": _4, "kicks-ass": _4, "office-on-the": _4, "podzone": _4, "scrapper-site": _4, "selfip": _4, "sells-it": _4, "servebbs": _4, "serveftp": _4, "thruhere": _4, "webhop": _4, "casacam": _4, "dynu": _4, "dynv6": _4, "twmail": _4, "ru": _4, "channelsdvr": [2, { "u": _4 }], "fastly": [0, { "freetls": _4, "map": _4, "prod": [0, { "a": _4, "global": _4 }], "ssl": [0, { "a": _4, "b": _4, "global": _4 }] }], "fastlylb": [2, { "map": _4 }], "edgeapp": _4, "keyword-on": _4, "live-on": _4, "server-on": _4, "cdn-edges": _4, "heteml": _4, "cloudfunctions": _4, "grafana-dev": _4, "iobb": _4, "moonscale": _4, "in-dsl": _4, "in-vpn": _4, "oninferno": _4, "botdash": _4, "apps-1and1": _4, "ipifony": _4, "cloudjiffy": [2, { "fra1-de": _4, "west1-us": _4 }], "elastx": [0, { "jls-sto1": _4, "jls-sto2": _4, "jls-sto3": _4 }], "massivegrid": [0, { "paas": [0, { "fr-1": _4, "lon-1": _4, "lon-2": _4, "ny-1": _4, "ny-2": _4, "sg-1": _4 }] }], "saveincloud": [0, { "jelastic": _4, "nordeste-idc": _4 }], "scaleforce": _46, "kinghost": _4, "uni5": _4, "krellian": _4, "ggff": _4, "localcert": _4, "localhostcert": _4, "localto": _7, "barsy": _4, "memset": _4, "azure-api": _4, "azure-mobile": _4, "azureedge": _4, "azurefd": _4, "azurestaticapps": [2, { "1": _4, "2": _4, "3": _4, "4": _4, "5": _4, "6": _4, "7": _4, "centralus": _4, "eastasia": _4, "eastus2": _4, "westeurope": _4, "westus2": _4 }], "azurewebsites": _4, "cloudapp": _4, "trafficmanager": _4, "windows": [0, { "core": [0, { "blob": _4 }], "servicebus": _4 }], "mynetname": [0, { "sn": _4 }], "routingthecloud": _4, "bounceme": _4, "ddns": _4, "eating-organic": _4, "mydissent": _4, "myeffect": _4, "mymediapc": _4, "mypsx": _4, "mysecuritycamera": _4, "nhlfan": _4, "no-ip": _4, "pgafan": _4, "privatizehealthinsurance": _4, "redirectme": _4, "serveblog": _4, "serveminecraft": _4, "sytes": _4, "dnsup": _4, "hicam": _4, "now-dns": _4, "ownip": _4, "vpndns": _4, "cloudycluster": _4, "ovh": [0, { "hosting": _7, "webpaas": _7 }], "rackmaze": _4, "myradweb": _4, "in": _4, "subsc-pay": _4, "squares": _4, "schokokeks": _4, "firewall-gateway": _4, "seidat": _4, "senseering": _4, "siteleaf": _4, "mafelo": _4, "myspreadshop": _4, "vps-host": [2, { "jelastic": [0, { "atl": _4, "njs": _4, "ric": _4 }] }], "srcf": [0, { "soc": _4, "user": _4 }], "supabase": _4, "dsmynas": _4, "familyds": _4, "ts": [2, { "c": _7 }], "torproject": [2, { "pages": _4 }], "vusercontent": _4, "reserve-online": _4, "community-pro": _4, "meinforum": _4, "yandexcloud": [2, { "storage": _4, "website": _4 }], "za": _4 }], "nf": [1, { "arts": _3, "com": _3, "firm": _3, "info": _3, "net": _3, "other": _3, "per": _3, "rec": _3, "store": _3, "web": _3 }], "ng": [1, { "com": _3, "edu": _3, "gov": _3, "i": _3, "mil": _3, "mobi": _3, "name": _3, "net": _3, "org": _3, "sch": _3, "biz": [2, { "co": _4, "dl": _4, "go": _4, "lg": _4, "on": _4 }], "col": _4, "firm": _4, "gen": _4, "ltd": _4, "ngo": _4, "plc": _4 }], "ni": [1, { "ac": _3, "biz": _3, "co": _3, "com": _3, "edu": _3, "gob": _3, "in": _3, "info": _3, "int": _3, "mil": _3, "net": _3, "nom": _3, "org": _3, "web": _3 }], "nl": [1, { "co": _4, "hosting-cluster": _4, "gov": _4, "khplay": _4, "123website": _4, "myspreadshop": _4, "transurl": _7, "cistron": _4, "demon": _4 }], "no": [1, { "fhs": _3, "folkebibl": _3, "fylkesbibl": _3, "idrett": _3, "museum": _3, "priv": _3, "vgs": _3, "dep": _3, "herad": _3, "kommune": _3, "mil": _3, "stat": _3, "aa": _59, "ah": _59, "bu": _59, "fm": _59, "hl": _59, "hm": _59, "jan-mayen": _59, "mr": _59, "nl": _59, "nt": _59, "of": _59, "ol": _59, "oslo": _59, "rl": _59, "sf": _59, "st": _59, "svalbard": _59, "tm": _59, "tr": _59, "va": _59, "vf": _59, "akrehamn": _3, "xn--krehamn-dxa": _3, "\xE5krehamn": _3, "algard": _3, "xn--lgrd-poac": _3, "\xE5lg\xE5rd": _3, "arna": _3, "bronnoysund": _3, "xn--brnnysund-m8ac": _3, "br\xF8nn\xF8ysund": _3, "brumunddal": _3, "bryne": _3, "drobak": _3, "xn--drbak-wua": _3, "dr\xF8bak": _3, "egersund": _3, "fetsund": _3, "floro": _3, "xn--flor-jra": _3, "flor\xF8": _3, "fredrikstad": _3, "hokksund": _3, "honefoss": _3, "xn--hnefoss-q1a": _3, "h\xF8nefoss": _3, "jessheim": _3, "jorpeland": _3, "xn--jrpeland-54a": _3, "j\xF8rpeland": _3, "kirkenes": _3, "kopervik": _3, "krokstadelva": _3, "langevag": _3, "xn--langevg-jxa": _3, "langev\xE5g": _3, "leirvik": _3, "mjondalen": _3, "xn--mjndalen-64a": _3, "mj\xF8ndalen": _3, "mo-i-rana": _3, "mosjoen": _3, "xn--mosjen-eya": _3, "mosj\xF8en": _3, "nesoddtangen": _3, "orkanger": _3, "osoyro": _3, "xn--osyro-wua": _3, "os\xF8yro": _3, "raholt": _3, "xn--rholt-mra": _3, "r\xE5holt": _3, "sandnessjoen": _3, "xn--sandnessjen-ogb": _3, "sandnessj\xF8en": _3, "skedsmokorset": _3, "slattum": _3, "spjelkavik": _3, "stathelle": _3, "stavern": _3, "stjordalshalsen": _3, "xn--stjrdalshalsen-sqb": _3, "stj\xF8rdalshalsen": _3, "tananger": _3, "tranby": _3, "vossevangen": _3, "aarborte": _3, "aejrie": _3, "afjord": _3, "xn--fjord-lra": _3, "\xE5fjord": _3, "agdenes": _3, "akershus": _60, "aknoluokta": _3, "xn--koluokta-7ya57h": _3, "\xE1k\u014Boluokta": _3, "al": _3, "xn--l-1fa": _3, "\xE5l": _3, "alaheadju": _3, "xn--laheadju-7ya": _3, "\xE1laheadju": _3, "alesund": _3, "xn--lesund-hua": _3, "\xE5lesund": _3, "alstahaug": _3, "alta": _3, "xn--lt-liac": _3, "\xE1lt\xE1": _3, "alvdal": _3, "amli": _3, "xn--mli-tla": _3, "\xE5mli": _3, "amot": _3, "xn--mot-tla": _3, "\xE5mot": _3, "andasuolo": _3, "andebu": _3, "andoy": _3, "xn--andy-ira": _3, "and\xF8y": _3, "ardal": _3, "xn--rdal-poa": _3, "\xE5rdal": _3, "aremark": _3, "arendal": _3, "xn--s-1fa": _3, "\xE5s": _3, "aseral": _3, "xn--seral-lra": _3, "\xE5seral": _3, "asker": _3, "askim": _3, "askoy": _3, "xn--asky-ira": _3, "ask\xF8y": _3, "askvoll": _3, "asnes": _3, "xn--snes-poa": _3, "\xE5snes": _3, "audnedaln": _3, "aukra": _3, "aure": _3, "aurland": _3, "aurskog-holand": _3, "xn--aurskog-hland-jnb": _3, "aurskog-h\xF8land": _3, "austevoll": _3, "austrheim": _3, "averoy": _3, "xn--avery-yua": _3, "aver\xF8y": _3, "badaddja": _3, "xn--bdddj-mrabd": _3, "b\xE5d\xE5ddj\xE5": _3, "xn--brum-voa": _3, "b\xE6rum": _3, "bahcavuotna": _3, "xn--bhcavuotna-s4a": _3, "b\xE1hcavuotna": _3, "bahccavuotna": _3, "xn--bhccavuotna-k7a": _3, "b\xE1hccavuotna": _3, "baidar": _3, "xn--bidr-5nac": _3, "b\xE1id\xE1r": _3, "bajddar": _3, "xn--bjddar-pta": _3, "b\xE1jddar": _3, "balat": _3, "xn--blt-elab": _3, "b\xE1l\xE1t": _3, "balestrand": _3, "ballangen": _3, "balsfjord": _3, "bamble": _3, "bardu": _3, "barum": _3, "batsfjord": _3, "xn--btsfjord-9za": _3, "b\xE5tsfjord": _3, "bearalvahki": _3, "xn--bearalvhki-y4a": _3, "bearalv\xE1hki": _3, "beardu": _3, "beiarn": _3, "berg": _3, "bergen": _3, "berlevag": _3, "xn--berlevg-jxa": _3, "berlev\xE5g": _3, "bievat": _3, "xn--bievt-0qa": _3, "biev\xE1t": _3, "bindal": _3, "birkenes": _3, "bjarkoy": _3, "xn--bjarky-fya": _3, "bjark\xF8y": _3, "bjerkreim": _3, "bjugn": _3, "bodo": _3, "xn--bod-2na": _3, "bod\xF8": _3, "bokn": _3, "bomlo": _3, "xn--bmlo-gra": _3, "b\xF8mlo": _3, "bremanger": _3, "bronnoy": _3, "xn--brnny-wuac": _3, "br\xF8nn\xF8y": _3, "budejju": _3, "buskerud": _60, "bygland": _3, "bykle": _3, "cahcesuolo": _3, "xn--hcesuolo-7ya35b": _3, "\u010D\xE1hcesuolo": _3, "davvenjarga": _3, "xn--davvenjrga-y4a": _3, "davvenj\xE1rga": _3, "davvesiida": _3, "deatnu": _3, "dielddanuorri": _3, "divtasvuodna": _3, "divttasvuotna": _3, "donna": _3, "xn--dnna-gra": _3, "d\xF8nna": _3, "dovre": _3, "drammen": _3, "drangedal": _3, "dyroy": _3, "xn--dyry-ira": _3, "dyr\xF8y": _3, "eid": _3, "eidfjord": _3, "eidsberg": _3, "eidskog": _3, "eidsvoll": _3, "eigersund": _3, "elverum": _3, "enebakk": _3, "engerdal": _3, "etne": _3, "etnedal": _3, "evenassi": _3, "xn--eveni-0qa01ga": _3, "even\xE1\u0161\u0161i": _3, "evenes": _3, "evje-og-hornnes": _3, "farsund": _3, "fauske": _3, "fedje": _3, "fet": _3, "finnoy": _3, "xn--finny-yua": _3, "finn\xF8y": _3, "fitjar": _3, "fjaler": _3, "fjell": _3, "fla": _3, "xn--fl-zia": _3, "fl\xE5": _3, "flakstad": _3, "flatanger": _3, "flekkefjord": _3, "flesberg": _3, "flora": _3, "folldal": _3, "forde": _3, "xn--frde-gra": _3, "f\xF8rde": _3, "forsand": _3, "fosnes": _3, "xn--frna-woa": _3, "fr\xE6na": _3, "frana": _3, "frei": _3, "frogn": _3, "froland": _3, "frosta": _3, "froya": _3, "xn--frya-hra": _3, "fr\xF8ya": _3, "fuoisku": _3, "fuossko": _3, "fusa": _3, "fyresdal": _3, "gaivuotna": _3, "xn--givuotna-8ya": _3, "g\xE1ivuotna": _3, "galsa": _3, "xn--gls-elac": _3, "g\xE1ls\xE1": _3, "gamvik": _3, "gangaviika": _3, "xn--ggaviika-8ya47h": _3, "g\xE1\u014Bgaviika": _3, "gaular": _3, "gausdal": _3, "giehtavuoatna": _3, "gildeskal": _3, "xn--gildeskl-g0a": _3, "gildesk\xE5l": _3, "giske": _3, "gjemnes": _3, "gjerdrum": _3, "gjerstad": _3, "gjesdal": _3, "gjovik": _3, "xn--gjvik-wua": _3, "gj\xF8vik": _3, "gloppen": _3, "gol": _3, "gran": _3, "grane": _3, "granvin": _3, "gratangen": _3, "grimstad": _3, "grong": _3, "grue": _3, "gulen": _3, "guovdageaidnu": _3, "ha": _3, "xn--h-2fa": _3, "h\xE5": _3, "habmer": _3, "xn--hbmer-xqa": _3, "h\xE1bmer": _3, "hadsel": _3, "xn--hgebostad-g3a": _3, "h\xE6gebostad": _3, "hagebostad": _3, "halden": _3, "halsa": _3, "hamar": _3, "hamaroy": _3, "hammarfeasta": _3, "xn--hmmrfeasta-s4ac": _3, "h\xE1mm\xE1rfeasta": _3, "hammerfest": _3, "hapmir": _3, "xn--hpmir-xqa": _3, "h\xE1pmir": _3, "haram": _3, "hareid": _3, "harstad": _3, "hasvik": _3, "hattfjelldal": _3, "haugesund": _3, "hedmark": [0, { "os": _3, "valer": _3, "xn--vler-qoa": _3, "v\xE5ler": _3 }], "hemne": _3, "hemnes": _3, "hemsedal": _3, "hitra": _3, "hjartdal": _3, "hjelmeland": _3, "hobol": _3, "xn--hobl-ira": _3, "hob\xF8l": _3, "hof": _3, "hol": _3, "hole": _3, "holmestrand": _3, "holtalen": _3, "xn--holtlen-hxa": _3, "holt\xE5len": _3, "hordaland": [0, { "os": _3 }], "hornindal": _3, "horten": _3, "hoyanger": _3, "xn--hyanger-q1a": _3, "h\xF8yanger": _3, "hoylandet": _3, "xn--hylandet-54a": _3, "h\xF8ylandet": _3, "hurdal": _3, "hurum": _3, "hvaler": _3, "hyllestad": _3, "ibestad": _3, "inderoy": _3, "xn--indery-fya": _3, "inder\xF8y": _3, "iveland": _3, "ivgu": _3, "jevnaker": _3, "jolster": _3, "xn--jlster-bya": _3, "j\xF8lster": _3, "jondal": _3, "kafjord": _3, "xn--kfjord-iua": _3, "k\xE5fjord": _3, "karasjohka": _3, "xn--krjohka-hwab49j": _3, "k\xE1r\xE1\u0161johka": _3, "karasjok": _3, "karlsoy": _3, "karmoy": _3, "xn--karmy-yua": _3, "karm\xF8y": _3, "kautokeino": _3, "klabu": _3, "xn--klbu-woa": _3, "kl\xE6bu": _3, "klepp": _3, "kongsberg": _3, "kongsvinger": _3, "kraanghke": _3, "xn--kranghke-b0a": _3, "kr\xE5anghke": _3, "kragero": _3, "xn--krager-gya": _3, "krager\xF8": _3, "kristiansand": _3, "kristiansund": _3, "krodsherad": _3, "xn--krdsherad-m8a": _3, "kr\xF8dsherad": _3, "xn--kvfjord-nxa": _3, "kv\xE6fjord": _3, "xn--kvnangen-k0a": _3, "kv\xE6nangen": _3, "kvafjord": _3, "kvalsund": _3, "kvam": _3, "kvanangen": _3, "kvinesdal": _3, "kvinnherad": _3, "kviteseid": _3, "kvitsoy": _3, "xn--kvitsy-fya": _3, "kvits\xF8y": _3, "laakesvuemie": _3, "xn--lrdal-sra": _3, "l\xE6rdal": _3, "lahppi": _3, "xn--lhppi-xqa": _3, "l\xE1hppi": _3, "lardal": _3, "larvik": _3, "lavagis": _3, "lavangen": _3, "leangaviika": _3, "xn--leagaviika-52b": _3, "lea\u014Bgaviika": _3, "lebesby": _3, "leikanger": _3, "leirfjord": _3, "leka": _3, "leksvik": _3, "lenvik": _3, "lerdal": _3, "lesja": _3, "levanger": _3, "lier": _3, "lierne": _3, "lillehammer": _3, "lillesand": _3, "lindas": _3, "xn--linds-pra": _3, "lind\xE5s": _3, "lindesnes": _3, "loabat": _3, "xn--loabt-0qa": _3, "loab\xE1t": _3, "lodingen": _3, "xn--ldingen-q1a": _3, "l\xF8dingen": _3, "lom": _3, "loppa": _3, "lorenskog": _3, "xn--lrenskog-54a": _3, "l\xF8renskog": _3, "loten": _3, "xn--lten-gra": _3, "l\xF8ten": _3, "lund": _3, "lunner": _3, "luroy": _3, "xn--lury-ira": _3, "lur\xF8y": _3, "luster": _3, "lyngdal": _3, "lyngen": _3, "malatvuopmi": _3, "xn--mlatvuopmi-s4a": _3, "m\xE1latvuopmi": _3, "malselv": _3, "xn--mlselv-iua": _3, "m\xE5lselv": _3, "malvik": _3, "mandal": _3, "marker": _3, "marnardal": _3, "masfjorden": _3, "masoy": _3, "xn--msy-ula0h": _3, "m\xE5s\xF8y": _3, "matta-varjjat": _3, "xn--mtta-vrjjat-k7af": _3, "m\xE1tta-v\xE1rjjat": _3, "meland": _3, "meldal": _3, "melhus": _3, "meloy": _3, "xn--mely-ira": _3, "mel\xF8y": _3, "meraker": _3, "xn--merker-kua": _3, "mer\xE5ker": _3, "midsund": _3, "midtre-gauldal": _3, "moareke": _3, "xn--moreke-jua": _3, "mo\xE5reke": _3, "modalen": _3, "modum": _3, "molde": _3, "more-og-romsdal": [0, { "heroy": _3, "sande": _3 }], "xn--mre-og-romsdal-qqb": [0, { "xn--hery-ira": _3, "sande": _3 }], "m\xF8re-og-romsdal": [0, { "her\xF8y": _3, "sande": _3 }], "moskenes": _3, "moss": _3, "mosvik": _3, "muosat": _3, "xn--muost-0qa": _3, "muos\xE1t": _3, "naamesjevuemie": _3, "xn--nmesjevuemie-tcba": _3, "n\xE5\xE5mesjevuemie": _3, "xn--nry-yla5g": _3, "n\xE6r\xF8y": _3, "namdalseid": _3, "namsos": _3, "namsskogan": _3, "nannestad": _3, "naroy": _3, "narviika": _3, "narvik": _3, "naustdal": _3, "navuotna": _3, "xn--nvuotna-hwa": _3, "n\xE1vuotna": _3, "nedre-eiker": _3, "nesna": _3, "nesodden": _3, "nesseby": _3, "nesset": _3, "nissedal": _3, "nittedal": _3, "nord-aurdal": _3, "nord-fron": _3, "nord-odal": _3, "norddal": _3, "nordkapp": _3, "nordland": [0, { "bo": _3, "xn--b-5ga": _3, "b\xF8": _3, "heroy": _3, "xn--hery-ira": _3, "her\xF8y": _3 }], "nordre-land": _3, "nordreisa": _3, "nore-og-uvdal": _3, "notodden": _3, "notteroy": _3, "xn--nttery-byae": _3, "n\xF8tter\xF8y": _3, "odda": _3, "oksnes": _3, "xn--ksnes-uua": _3, "\xF8ksnes": _3, "omasvuotna": _3, "oppdal": _3, "oppegard": _3, "xn--oppegrd-ixa": _3, "oppeg\xE5rd": _3, "orkdal": _3, "orland": _3, "xn--rland-uua": _3, "\xF8rland": _3, "orskog": _3, "xn--rskog-uua": _3, "\xF8rskog": _3, "orsta": _3, "xn--rsta-fra": _3, "\xF8rsta": _3, "osen": _3, "osteroy": _3, "xn--ostery-fya": _3, "oster\xF8y": _3, "ostfold": [0, { "valer": _3 }], "xn--stfold-9xa": [0, { "xn--vler-qoa": _3 }], "\xF8stfold": [0, { "v\xE5ler": _3 }], "ostre-toten": _3, "xn--stre-toten-zcb": _3, "\xF8stre-toten": _3, "overhalla": _3, "ovre-eiker": _3, "xn--vre-eiker-k8a": _3, "\xF8vre-eiker": _3, "oyer": _3, "xn--yer-zna": _3, "\xF8yer": _3, "oygarden": _3, "xn--ygarden-p1a": _3, "\xF8ygarden": _3, "oystre-slidre": _3, "xn--ystre-slidre-ujb": _3, "\xF8ystre-slidre": _3, "porsanger": _3, "porsangu": _3, "xn--porsgu-sta26f": _3, "pors\xE1\u014Bgu": _3, "porsgrunn": _3, "rade": _3, "xn--rde-ula": _3, "r\xE5de": _3, "radoy": _3, "xn--rady-ira": _3, "rad\xF8y": _3, "xn--rlingen-mxa": _3, "r\xE6lingen": _3, "rahkkeravju": _3, "xn--rhkkervju-01af": _3, "r\xE1hkker\xE1vju": _3, "raisa": _3, "xn--risa-5na": _3, "r\xE1isa": _3, "rakkestad": _3, "ralingen": _3, "rana": _3, "randaberg": _3, "rauma": _3, "rendalen": _3, "rennebu": _3, "rennesoy": _3, "xn--rennesy-v1a": _3, "rennes\xF8y": _3, "rindal": _3, "ringebu": _3, "ringerike": _3, "ringsaker": _3, "risor": _3, "xn--risr-ira": _3, "ris\xF8r": _3, "rissa": _3, "roan": _3, "rodoy": _3, "xn--rdy-0nab": _3, "r\xF8d\xF8y": _3, "rollag": _3, "romsa": _3, "romskog": _3, "xn--rmskog-bya": _3, "r\xF8mskog": _3, "roros": _3, "xn--rros-gra": _3, "r\xF8ros": _3, "rost": _3, "xn--rst-0na": _3, "r\xF8st": _3, "royken": _3, "xn--ryken-vua": _3, "r\xF8yken": _3, "royrvik": _3, "xn--ryrvik-bya": _3, "r\xF8yrvik": _3, "ruovat": _3, "rygge": _3, "salangen": _3, "salat": _3, "xn--slat-5na": _3, "s\xE1lat": _3, "xn--slt-elab": _3, "s\xE1l\xE1t": _3, "saltdal": _3, "samnanger": _3, "sandefjord": _3, "sandnes": _3, "sandoy": _3, "xn--sandy-yua": _3, "sand\xF8y": _3, "sarpsborg": _3, "sauda": _3, "sauherad": _3, "sel": _3, "selbu": _3, "selje": _3, "seljord": _3, "siellak": _3, "sigdal": _3, "siljan": _3, "sirdal": _3, "skanit": _3, "xn--sknit-yqa": _3, "sk\xE1nit": _3, "skanland": _3, "xn--sknland-fxa": _3, "sk\xE5nland": _3, "skaun": _3, "skedsmo": _3, "ski": _3, "skien": _3, "skierva": _3, "xn--skierv-uta": _3, "skierv\xE1": _3, "skiptvet": _3, "skjak": _3, "xn--skjk-soa": _3, "skj\xE5k": _3, "skjervoy": _3, "xn--skjervy-v1a": _3, "skjerv\xF8y": _3, "skodje": _3, "smola": _3, "xn--smla-hra": _3, "sm\xF8la": _3, "snaase": _3, "xn--snase-nra": _3, "sn\xE5ase": _3, "snasa": _3, "xn--snsa-roa": _3, "sn\xE5sa": _3, "snillfjord": _3, "snoasa": _3, "sogndal": _3, "sogne": _3, "xn--sgne-gra": _3, "s\xF8gne": _3, "sokndal": _3, "sola": _3, "solund": _3, "somna": _3, "xn--smna-gra": _3, "s\xF8mna": _3, "sondre-land": _3, "xn--sndre-land-0cb": _3, "s\xF8ndre-land": _3, "songdalen": _3, "sor-aurdal": _3, "xn--sr-aurdal-l8a": _3, "s\xF8r-aurdal": _3, "sor-fron": _3, "xn--sr-fron-q1a": _3, "s\xF8r-fron": _3, "sor-odal": _3, "xn--sr-odal-q1a": _3, "s\xF8r-odal": _3, "sor-varanger": _3, "xn--sr-varanger-ggb": _3, "s\xF8r-varanger": _3, "sorfold": _3, "xn--srfold-bya": _3, "s\xF8rfold": _3, "sorreisa": _3, "xn--srreisa-q1a": _3, "s\xF8rreisa": _3, "sortland": _3, "sorum": _3, "xn--srum-gra": _3, "s\xF8rum": _3, "spydeberg": _3, "stange": _3, "stavanger": _3, "steigen": _3, "steinkjer": _3, "stjordal": _3, "xn--stjrdal-s1a": _3, "stj\xF8rdal": _3, "stokke": _3, "stor-elvdal": _3, "stord": _3, "stordal": _3, "storfjord": _3, "strand": _3, "stranda": _3, "stryn": _3, "sula": _3, "suldal": _3, "sund": _3, "sunndal": _3, "surnadal": _3, "sveio": _3, "svelvik": _3, "sykkylven": _3, "tana": _3, "telemark": [0, { "bo": _3, "xn--b-5ga": _3, "b\xF8": _3 }], "time": _3, "tingvoll": _3, "tinn": _3, "tjeldsund": _3, "tjome": _3, "xn--tjme-hra": _3, "tj\xF8me": _3, "tokke": _3, "tolga": _3, "tonsberg": _3, "xn--tnsberg-q1a": _3, "t\xF8nsberg": _3, "torsken": _3, "xn--trna-woa": _3, "tr\xE6na": _3, "trana": _3, "tranoy": _3, "xn--trany-yua": _3, "tran\xF8y": _3, "troandin": _3, "trogstad": _3, "xn--trgstad-r1a": _3, "tr\xF8gstad": _3, "tromsa": _3, "tromso": _3, "xn--troms-zua": _3, "troms\xF8": _3, "trondheim": _3, "trysil": _3, "tvedestrand": _3, "tydal": _3, "tynset": _3, "tysfjord": _3, "tysnes": _3, "xn--tysvr-vra": _3, "tysv\xE6r": _3, "tysvar": _3, "ullensaker": _3, "ullensvang": _3, "ulvik": _3, "unjarga": _3, "xn--unjrga-rta": _3, "unj\xE1rga": _3, "utsira": _3, "vaapste": _3, "vadso": _3, "xn--vads-jra": _3, "vads\xF8": _3, "xn--vry-yla5g": _3, "v\xE6r\xF8y": _3, "vaga": _3, "xn--vg-yiab": _3, "v\xE5g\xE5": _3, "vagan": _3, "xn--vgan-qoa": _3, "v\xE5gan": _3, "vagsoy": _3, "xn--vgsy-qoa0j": _3, "v\xE5gs\xF8y": _3, "vaksdal": _3, "valle": _3, "vang": _3, "vanylven": _3, "vardo": _3, "xn--vard-jra": _3, "vard\xF8": _3, "varggat": _3, "xn--vrggt-xqad": _3, "v\xE1rgg\xE1t": _3, "varoy": _3, "vefsn": _3, "vega": _3, "vegarshei": _3, "xn--vegrshei-c0a": _3, "veg\xE5rshei": _3, "vennesla": _3, "verdal": _3, "verran": _3, "vestby": _3, "vestfold": [0, { "sande": _3 }], "vestnes": _3, "vestre-slidre": _3, "vestre-toten": _3, "vestvagoy": _3, "xn--vestvgy-ixa6o": _3, "vestv\xE5g\xF8y": _3, "vevelstad": _3, "vik": _3, "vikna": _3, "vindafjord": _3, "voagat": _3, "volda": _3, "voss": _3, "co": _4, "123hjemmeside": _4, "myspreadshop": _4 }], "np": _19, "nr": _56, "nu": [1, { "merseine": _4, "mine": _4, "shacknet": _4, "enterprisecloud": _4 }], "nz": [1, { "ac": _3, "co": _3, "cri": _3, "geek": _3, "gen": _3, "govt": _3, "health": _3, "iwi": _3, "kiwi": _3, "maori": _3, "xn--mori-qsa": _3, "m\u0101ori": _3, "mil": _3, "net": _3, "org": _3, "parliament": _3, "school": _3, "cloudns": _4 }], "om": [1, { "co": _3, "com": _3, "edu": _3, "gov": _3, "med": _3, "museum": _3, "net": _3, "org": _3, "pro": _3 }], "onion": _3, "org": [1, { "altervista": _4, "pimienta": _4, "poivron": _4, "potager": _4, "sweetpepper": _4, "cdn77": [0, { "c": _4, "rsc": _4 }], "cdn77-secure": [0, { "origin": [0, { "ssl": _4 }] }], "ae": _4, "cloudns": _4, "ip-dynamic": _4, "ddnss": _4, "dpdns": _4, "duckdns": _4, "tunk": _4, "blogdns": _4, "blogsite": _4, "boldlygoingnowhere": _4, "dnsalias": _4, "dnsdojo": _4, "doesntexist": _4, "dontexist": _4, "doomdns": _4, "dvrdns": _4, "dynalias": _4, "dyndns": [2, { "go": _4, "home": _4 }], "endofinternet": _4, "endoftheinternet": _4, "from-me": _4, "game-host": _4, "gotdns": _4, "hobby-site": _4, "homedns": _4, "homeftp": _4, "homelinux": _4, "homeunix": _4, "is-a-bruinsfan": _4, "is-a-candidate": _4, "is-a-celticsfan": _4, "is-a-chef": _4, "is-a-geek": _4, "is-a-knight": _4, "is-a-linux-user": _4, "is-a-patsfan": _4, "is-a-soxfan": _4, "is-found": _4, "is-lost": _4, "is-saved": _4, "is-very-bad": _4, "is-very-evil": _4, "is-very-good": _4, "is-very-nice": _4, "is-very-sweet": _4, "isa-geek": _4, "kicks-ass": _4, "misconfused": _4, "podzone": _4, "readmyblog": _4, "selfip": _4, "sellsyourhome": _4, "servebbs": _4, "serveftp": _4, "servegame": _4, "stuff-4-sale": _4, "webhop": _4, "accesscam": _4, "camdvr": _4, "freeddns": _4, "mywire": _4, "webredirect": _4, "twmail": _4, "eu": [2, { "al": _4, "asso": _4, "at": _4, "au": _4, "be": _4, "bg": _4, "ca": _4, "cd": _4, "ch": _4, "cn": _4, "cy": _4, "cz": _4, "de": _4, "dk": _4, "edu": _4, "ee": _4, "es": _4, "fi": _4, "fr": _4, "gr": _4, "hr": _4, "hu": _4, "ie": _4, "il": _4, "in": _4, "int": _4, "is": _4, "it": _4, "jp": _4, "kr": _4, "lt": _4, "lu": _4, "lv": _4, "me": _4, "mk": _4, "mt": _4, "my": _4, "net": _4, "ng": _4, "nl": _4, "no": _4, "nz": _4, "pl": _4, "pt": _4, "ro": _4, "ru": _4, "se": _4, "si": _4, "sk": _4, "tr": _4, "uk": _4, "us": _4 }], "fedorainfracloud": _4, "fedorapeople": _4, "fedoraproject": [0, { "cloud": _4, "os": _43, "stg": [0, { "os": _43 }] }], "freedesktop": _4, "hatenadiary": _4, "hepforge": _4, "in-dsl": _4, "in-vpn": _4, "js": _4, "barsy": _4, "mayfirst": _4, "routingthecloud": _4, "bmoattachments": _4, "cable-modem": _4, "collegefan": _4, "couchpotatofries": _4, "hopto": _4, "mlbfan": _4, "myftp": _4, "mysecuritycamera": _4, "nflfan": _4, "no-ip": _4, "read-books": _4, "ufcfan": _4, "zapto": _4, "dynserv": _4, "now-dns": _4, "is-local": _4, "httpbin": _4, "pubtls": _4, "jpn": _4, "my-firewall": _4, "myfirewall": _4, "spdns": _4, "small-web": _4, "dsmynas": _4, "familyds": _4, "teckids": _55, "tuxfamily": _4, "diskstation": _4, "hk": _4, "us": _4, "toolforge": _4, "wmcloud": _4, "wmflabs": _4, "za": _4 }], "pa": [1, { "abo": _3, "ac": _3, "com": _3, "edu": _3, "gob": _3, "ing": _3, "med": _3, "net": _3, "nom": _3, "org": _3, "sld": _3 }], "pe": [1, { "com": _3, "edu": _3, "gob": _3, "mil": _3, "net": _3, "nom": _3, "org": _3 }], "pf": [1, { "com": _3, "edu": _3, "org": _3 }], "pg": _19, "ph": [1, { "com": _3, "edu": _3, "gov": _3, "i": _3, "mil": _3, "net": _3, "ngo": _3, "org": _3, "cloudns": _4 }], "pk": [1, { "ac": _3, "biz": _3, "com": _3, "edu": _3, "fam": _3, "gkp": _3, "gob": _3, "gog": _3, "gok": _3, "gop": _3, "gos": _3, "gov": _3, "net": _3, "org": _3, "web": _3 }], "pl": [1, { "com": _3, "net": _3, "org": _3, "agro": _3, "aid": _3, "atm": _3, "auto": _3, "biz": _3, "edu": _3, "gmina": _3, "gsm": _3, "info": _3, "mail": _3, "media": _3, "miasta": _3, "mil": _3, "nieruchomosci": _3, "nom": _3, "pc": _3, "powiat": _3, "priv": _3, "realestate": _3, "rel": _3, "sex": _3, "shop": _3, "sklep": _3, "sos": _3, "szkola": _3, "targi": _3, "tm": _3, "tourism": _3, "travel": _3, "turystyka": _3, "gov": [1, { "ap": _3, "griw": _3, "ic": _3, "is": _3, "kmpsp": _3, "konsulat": _3, "kppsp": _3, "kwp": _3, "kwpsp": _3, "mup": _3, "mw": _3, "oia": _3, "oirm": _3, "oke": _3, "oow": _3, "oschr": _3, "oum": _3, "pa": _3, "pinb": _3, "piw": _3, "po": _3, "pr": _3, "psp": _3, "psse": _3, "pup": _3, "rzgw": _3, "sa": _3, "sdn": _3, "sko": _3, "so": _3, "sr": _3, "starostwo": _3, "ug": _3, "ugim": _3, "um": _3, "umig": _3, "upow": _3, "uppo": _3, "us": _3, "uw": _3, "uzs": _3, "wif": _3, "wiih": _3, "winb": _3, "wios": _3, "witd": _3, "wiw": _3, "wkz": _3, "wsa": _3, "wskr": _3, "wsse": _3, "wuoz": _3, "wzmiuw": _3, "zp": _3, "zpisdn": _3 }], "augustow": _3, "babia-gora": _3, "bedzin": _3, "beskidy": _3, "bialowieza": _3, "bialystok": _3, "bielawa": _3, "bieszczady": _3, "boleslawiec": _3, "bydgoszcz": _3, "bytom": _3, "cieszyn": _3, "czeladz": _3, "czest": _3, "dlugoleka": _3, "elblag": _3, "elk": _3, "glogow": _3, "gniezno": _3, "gorlice": _3, "grajewo": _3, "ilawa": _3, "jaworzno": _3, "jelenia-gora": _3, "jgora": _3, "kalisz": _3, "karpacz": _3, "kartuzy": _3, "kaszuby": _3, "katowice": _3, "kazimierz-dolny": _3, "kepno": _3, "ketrzyn": _3, "klodzko": _3, "kobierzyce": _3, "kolobrzeg": _3, "konin": _3, "konskowola": _3, "kutno": _3, "lapy": _3, "lebork": _3, "legnica": _3, "lezajsk": _3, "limanowa": _3, "lomza": _3, "lowicz": _3, "lubin": _3, "lukow": _3, "malbork": _3, "malopolska": _3, "mazowsze": _3, "mazury": _3, "mielec": _3, "mielno": _3, "mragowo": _3, "naklo": _3, "nowaruda": _3, "nysa": _3, "olawa": _3, "olecko": _3, "olkusz": _3, "olsztyn": _3, "opoczno": _3, "opole": _3, "ostroda": _3, "ostroleka": _3, "ostrowiec": _3, "ostrowwlkp": _3, "pila": _3, "pisz": _3, "podhale": _3, "podlasie": _3, "polkowice": _3, "pomorskie": _3, "pomorze": _3, "prochowice": _3, "pruszkow": _3, "przeworsk": _3, "pulawy": _3, "radom": _3, "rawa-maz": _3, "rybnik": _3, "rzeszow": _3, "sanok": _3, "sejny": _3, "skoczow": _3, "slask": _3, "slupsk": _3, "sosnowiec": _3, "stalowa-wola": _3, "starachowice": _3, "stargard": _3, "suwalki": _3, "swidnica": _3, "swiebodzin": _3, "swinoujscie": _3, "szczecin": _3, "szczytno": _3, "tarnobrzeg": _3, "tgory": _3, "turek": _3, "tychy": _3, "ustka": _3, "walbrzych": _3, "warmia": _3, "warszawa": _3, "waw": _3, "wegrow": _3, "wielun": _3, "wlocl": _3, "wloclawek": _3, "wodzislaw": _3, "wolomin": _3, "wroclaw": _3, "zachpomor": _3, "zagan": _3, "zarow": _3, "zgora": _3, "zgorzelec": _3, "art": _4, "gliwice": _4, "krakow": _4, "poznan": _4, "wroc": _4, "zakopane": _4, "beep": _4, "ecommerce-shop": _4, "cfolks": _4, "dfirma": _4, "dkonto": _4, "you2": _4, "shoparena": _4, "homesklep": _4, "sdscloud": _4, "unicloud": _4, "lodz": _4, "pabianice": _4, "plock": _4, "sieradz": _4, "skierniewice": _4, "zgierz": _4, "krasnik": _4, "leczna": _4, "lubartow": _4, "lublin": _4, "poniatowa": _4, "swidnik": _4, "co": _4, "torun": _4, "simplesite": _4, "myspreadshop": _4, "gda": _4, "gdansk": _4, "gdynia": _4, "med": _4, "sopot": _4, "bielsko": _4 }], "pm": [1, { "own": _4, "name": _4 }], "pn": [1, { "co": _3, "edu": _3, "gov": _3, "net": _3, "org": _3 }], "post": _3, "pr": [1, { "biz": _3, "com": _3, "edu": _3, "gov": _3, "info": _3, "isla": _3, "name": _3, "net": _3, "org": _3, "pro": _3, "ac": _3, "est": _3, "prof": _3 }], "pro": [1, { "aaa": _3, "aca": _3, "acct": _3, "avocat": _3, "bar": _3, "cpa": _3, "eng": _3, "jur": _3, "law": _3, "med": _3, "recht": _3, "12chars": _4, "cloudns": _4, "barsy": _4, "ngrok": _4 }], "ps": [1, { "com": _3, "edu": _3, "gov": _3, "net": _3, "org": _3, "plo": _3, "sec": _3 }], "pt": [1, { "com": _3, "edu": _3, "gov": _3, "int": _3, "net": _3, "nome": _3, "org": _3, "publ": _3, "123paginaweb": _4 }], "pw": [1, { "gov": _3, "cloudns": _4, "x443": _4 }], "py": [1, { "com": _3, "coop": _3, "edu": _3, "gov": _3, "mil": _3, "net": _3, "org": _3 }], "qa": [1, { "com": _3, "edu": _3, "gov": _3, "mil": _3, "name": _3, "net": _3, "org": _3, "sch": _3 }], "re": [1, { "asso": _3, "com": _3, "netlib": _4, "can": _4 }], "ro": [1, { "arts": _3, "com": _3, "firm": _3, "info": _3, "nom": _3, "nt": _3, "org": _3, "rec": _3, "store": _3, "tm": _3, "www": _3, "co": _4, "shop": _4, "barsy": _4 }], "rs": [1, { "ac": _3, "co": _3, "edu": _3, "gov": _3, "in": _3, "org": _3, "brendly": _51, "barsy": _4, "ox": _4 }], "ru": [1, { "ac": _4, "edu": _4, "gov": _4, "int": _4, "mil": _4, "eurodir": _4, "adygeya": _4, "bashkiria": _4, "bir": _4, "cbg": _4, "com": _4, "dagestan": _4, "grozny": _4, "kalmykia": _4, "kustanai": _4, "marine": _4, "mordovia": _4, "msk": _4, "mytis": _4, "nalchik": _4, "nov": _4, "pyatigorsk": _4, "spb": _4, "vladikavkaz": _4, "vladimir": _4, "na4u": _4, "mircloud": _4, "myjino": [2, { "hosting": _7, "landing": _7, "spectrum": _7, "vps": _7 }], "cldmail": [0, { "hb": _4 }], "mcdir": [2, { "vps": _4 }], "mcpre": _4, "net": _4, "org": _4, "pp": _4, "lk3": _4, "ras": _4 }], "rw": [1, { "ac": _3, "co": _3, "coop": _3, "gov": _3, "mil": _3, "net": _3, "org": _3 }], "sa": [1, { "com": _3, "edu": _3, "gov": _3, "med": _3, "net": _3, "org": _3, "pub": _3, "sch": _3 }], "sb": _5, "sc": _5, "sd": [1, { "com": _3, "edu": _3, "gov": _3, "info": _3, "med": _3, "net": _3, "org": _3, "tv": _3 }], "se": [1, { "a": _3, "ac": _3, "b": _3, "bd": _3, "brand": _3, "c": _3, "d": _3, "e": _3, "f": _3, "fh": _3, "fhsk": _3, "fhv": _3, "g": _3, "h": _3, "i": _3, "k": _3, "komforb": _3, "kommunalforbund": _3, "komvux": _3, "l": _3, "lanbib": _3, "m": _3, "n": _3, "naturbruksgymn": _3, "o": _3, "org": _3, "p": _3, "parti": _3, "pp": _3, "press": _3, "r": _3, "s": _3, "t": _3, "tm": _3, "u": _3, "w": _3, "x": _3, "y": _3, "z": _3, "com": _4, "iopsys": _4, "123minsida": _4, "itcouldbewor": _4, "myspreadshop": _4 }], "sg": [1, { "com": _3, "edu": _3, "gov": _3, "net": _3, "org": _3, "enscaled": _4 }], "sh": [1, { "com": _3, "gov": _3, "mil": _3, "net": _3, "org": _3, "hashbang": _4, "botda": _4, "platform": [0, { "ent": _4, "eu": _4, "us": _4 }], "now": _4 }], "si": [1, { "f5": _4, "gitapp": _4, "gitpage": _4 }], "sj": _3, "sk": _3, "sl": _5, "sm": _3, "sn": [1, { "art": _3, "com": _3, "edu": _3, "gouv": _3, "org": _3, "perso": _3, "univ": _3 }], "so": [1, { "com": _3, "edu": _3, "gov": _3, "me": _3, "net": _3, "org": _3, "surveys": _4 }], "sr": _3, "ss": [1, { "biz": _3, "co": _3, "com": _3, "edu": _3, "gov": _3, "me": _3, "net": _3, "org": _3, "sch": _3 }], "st": [1, { "co": _3, "com": _3, "consulado": _3, "edu": _3, "embaixada": _3, "mil": _3, "net": _3, "org": _3, "principe": _3, "saotome": _3, "store": _3, "helioho": _4, "kirara": _4, "noho": _4 }], "su": [1, { "abkhazia": _4, "adygeya": _4, "aktyubinsk": _4, "arkhangelsk": _4, "armenia": _4, "ashgabad": _4, "azerbaijan": _4, "balashov": _4, "bashkiria": _4, "bryansk": _4, "bukhara": _4, "chimkent": _4, "dagestan": _4, "east-kazakhstan": _4, "exnet": _4, "georgia": _4, "grozny": _4, "ivanovo": _4, "jambyl": _4, "kalmykia": _4, "kaluga": _4, "karacol": _4, "karaganda": _4, "karelia": _4, "khakassia": _4, "krasnodar": _4, "kurgan": _4, "kustanai": _4, "lenug": _4, "mangyshlak": _4, "mordovia": _4, "msk": _4, "murmansk": _4, "nalchik": _4, "navoi": _4, "north-kazakhstan": _4, "nov": _4, "obninsk": _4, "penza": _4, "pokrovsk": _4, "sochi": _4, "spb": _4, "tashkent": _4, "termez": _4, "togliatti": _4, "troitsk": _4, "tselinograd": _4, "tula": _4, "tuva": _4, "vladikavkaz": _4, "vladimir": _4, "vologda": _4 }], "sv": [1, { "com": _3, "edu": _3, "gob": _3, "org": _3, "red": _3 }], "sx": _12, "sy": _6, "sz": [1, { "ac": _3, "co": _3, "org": _3 }], "tc": _3, "td": _3, "tel": _3, "tf": [1, { "sch": _4 }], "tg": _3, "th": [1, { "ac": _3, "co": _3, "go": _3, "in": _3, "mi": _3, "net": _3, "or": _3, "online": _4, "shop": _4 }], "tj": [1, { "ac": _3, "biz": _3, "co": _3, "com": _3, "edu": _3, "go": _3, "gov": _3, "int": _3, "mil": _3, "name": _3, "net": _3, "nic": _3, "org": _3, "test": _3, "web": _3 }], "tk": _3, "tl": _12, "tm": [1, { "co": _3, "com": _3, "edu": _3, "gov": _3, "mil": _3, "net": _3, "nom": _3, "org": _3 }], "tn": [1, { "com": _3, "ens": _3, "fin": _3, "gov": _3, "ind": _3, "info": _3, "intl": _3, "mincom": _3, "nat": _3, "net": _3, "org": _3, "perso": _3, "tourism": _3, "orangecloud": _4 }], "to": [1, { "611": _4, "com": _3, "edu": _3, "gov": _3, "mil": _3, "net": _3, "org": _3, "oya": _4, "x0": _4, "quickconnect": _26, "vpnplus": _4 }], "tr": [1, { "av": _3, "bbs": _3, "bel": _3, "biz": _3, "com": _3, "dr": _3, "edu": _3, "gen": _3, "gov": _3, "info": _3, "k12": _3, "kep": _3, "mil": _3, "name": _3, "net": _3, "org": _3, "pol": _3, "tel": _3, "tsk": _3, "tv": _3, "web": _3, "nc": _12 }], "tt": [1, { "biz": _3, "co": _3, "com": _3, "edu": _3, "gov": _3, "info": _3, "mil": _3, "name": _3, "net": _3, "org": _3, "pro": _3 }], "tv": [1, { "better-than": _4, "dyndns": _4, "on-the-web": _4, "worse-than": _4, "from": _4, "sakura": _4 }], "tw": [1, { "club": _3, "com": [1, { "mymailer": _4 }], "ebiz": _3, "edu": _3, "game": _3, "gov": _3, "idv": _3, "mil": _3, "net": _3, "org": _3, "url": _4, "mydns": _4 }], "tz": [1, { "ac": _3, "co": _3, "go": _3, "hotel": _3, "info": _3, "me": _3, "mil": _3, "mobi": _3, "ne": _3, "or": _3, "sc": _3, "tv": _3 }], "ua": [1, { "com": _3, "edu": _3, "gov": _3, "in": _3, "net": _3, "org": _3, "cherkassy": _3, "cherkasy": _3, "chernigov": _3, "chernihiv": _3, "chernivtsi": _3, "chernovtsy": _3, "ck": _3, "cn": _3, "cr": _3, "crimea": _3, "cv": _3, "dn": _3, "dnepropetrovsk": _3, "dnipropetrovsk": _3, "donetsk": _3, "dp": _3, "if": _3, "ivano-frankivsk": _3, "kh": _3, "kharkiv": _3, "kharkov": _3, "kherson": _3, "khmelnitskiy": _3, "khmelnytskyi": _3, "kiev": _3, "kirovograd": _3, "km": _3, "kr": _3, "kropyvnytskyi": _3, "krym": _3, "ks": _3, "kv": _3, "kyiv": _3, "lg": _3, "lt": _3, "lugansk": _3, "luhansk": _3, "lutsk": _3, "lv": _3, "lviv": _3, "mk": _3, "mykolaiv": _3, "nikolaev": _3, "od": _3, "odesa": _3, "odessa": _3, "pl": _3, "poltava": _3, "rivne": _3, "rovno": _3, "rv": _3, "sb": _3, "sebastopol": _3, "sevastopol": _3, "sm": _3, "sumy": _3, "te": _3, "ternopil": _3, "uz": _3, "uzhgorod": _3, "uzhhorod": _3, "vinnica": _3, "vinnytsia": _3, "vn": _3, "volyn": _3, "yalta": _3, "zakarpattia": _3, "zaporizhzhe": _3, "zaporizhzhia": _3, "zhitomir": _3, "zhytomyr": _3, "zp": _3, "zt": _3, "cc": _4, "inf": _4, "ltd": _4, "cx": _4, "ie": _4, "biz": _4, "co": _4, "pp": _4, "v": _4 }], "ug": [1, { "ac": _3, "co": _3, "com": _3, "edu": _3, "go": _3, "gov": _3, "mil": _3, "ne": _3, "or": _3, "org": _3, "sc": _3, "us": _3 }], "uk": [1, { "ac": _3, "co": [1, { "bytemark": [0, { "dh": _4, "vm": _4 }], "layershift": _46, "barsy": _4, "barsyonline": _4, "retrosnub": _54, "nh-serv": _4, "no-ip": _4, "adimo": _4, "myspreadshop": _4 }], "gov": [1, { "api": _4, "campaign": _4, "service": _4 }], "ltd": _3, "me": _3, "net": _3, "nhs": _3, "org": [1, { "glug": _4, "lug": _4, "lugs": _4, "affinitylottery": _4, "raffleentry": _4, "weeklylottery": _4 }], "plc": _3, "police": _3, "sch": _19, "conn": _4, "copro": _4, "hosp": _4, "independent-commission": _4, "independent-inquest": _4, "independent-inquiry": _4, "independent-panel": _4, "independent-review": _4, "public-inquiry": _4, "royal-commission": _4, "pymnt": _4, "barsy": _4, "nimsite": _4, "oraclegovcloudapps": _7 }], "us": [1, { "dni": _3, "isa": _3, "nsn": _3, "ak": _61, "al": _61, "ar": _61, "as": _61, "az": _61, "ca": _61, "co": _61, "ct": _61, "dc": _61, "de": [1, { "cc": _3, "lib": _4 }], "fl": _61, "ga": _61, "gu": _61, "hi": _62, "ia": _61, "id": _61, "il": _61, "in": _61, "ks": _61, "ky": _61, "la": _61, "ma": [1, { "k12": [1, { "chtr": _3, "paroch": _3, "pvt": _3 }], "cc": _3, "lib": _3 }], "md": _61, "me": _61, "mi": [1, { "k12": _3, "cc": _3, "lib": _3, "ann-arbor": _3, "cog": _3, "dst": _3, "eaton": _3, "gen": _3, "mus": _3, "tec": _3, "washtenaw": _3 }], "mn": _61, "mo": _61, "ms": _61, "mt": _61, "nc": _61, "nd": _62, "ne": _61, "nh": _61, "nj": _61, "nm": _61, "nv": _61, "ny": _61, "oh": _61, "ok": _61, "or": _61, "pa": _61, "pr": _61, "ri": _62, "sc": _61, "sd": _62, "tn": _61, "tx": _61, "ut": _61, "va": _61, "vi": _61, "vt": _61, "wa": _61, "wi": _61, "wv": [1, { "cc": _3 }], "wy": _61, "cloudns": _4, "is-by": _4, "land-4-sale": _4, "stuff-4-sale": _4, "heliohost": _4, "enscaled": [0, { "phx": _4 }], "mircloud": _4, "ngo": _4, "golffan": _4, "noip": _4, "pointto": _4, "freeddns": _4, "srv": [2, { "gh": _4, "gl": _4 }], "platterp": _4, "servername": _4 }], "uy": [1, { "com": _3, "edu": _3, "gub": _3, "mil": _3, "net": _3, "org": _3 }], "uz": [1, { "co": _3, "com": _3, "net": _3, "org": _3 }], "va": _3, "vc": [1, { "com": _3, "edu": _3, "gov": _3, "mil": _3, "net": _3, "org": _3, "gv": [2, { "d": _4 }], "0e": _7, "mydns": _4 }], "ve": [1, { "arts": _3, "bib": _3, "co": _3, "com": _3, "e12": _3, "edu": _3, "emprende": _3, "firm": _3, "gob": _3, "gov": _3, "info": _3, "int": _3, "mil": _3, "net": _3, "nom": _3, "org": _3, "rar": _3, "rec": _3, "store": _3, "tec": _3, "web": _3 }], "vg": [1, { "edu": _3 }], "vi": [1, { "co": _3, "com": _3, "k12": _3, "net": _3, "org": _3 }], "vn": [1, { "ac": _3, "ai": _3, "biz": _3, "com": _3, "edu": _3, "gov": _3, "health": _3, "id": _3, "info": _3, "int": _3, "io": _3, "name": _3, "net": _3, "org": _3, "pro": _3, "angiang": _3, "bacgiang": _3, "backan": _3, "baclieu": _3, "bacninh": _3, "baria-vungtau": _3, "bentre": _3, "binhdinh": _3, "binhduong": _3, "binhphuoc": _3, "binhthuan": _3, "camau": _3, "cantho": _3, "caobang": _3, "daklak": _3, "daknong": _3, "danang": _3, "dienbien": _3, "dongnai": _3, "dongthap": _3, "gialai": _3, "hagiang": _3, "haiduong": _3, "haiphong": _3, "hanam": _3, "hanoi": _3, "hatinh": _3, "haugiang": _3, "hoabinh": _3, "hungyen": _3, "khanhhoa": _3, "kiengiang": _3, "kontum": _3, "laichau": _3, "lamdong": _3, "langson": _3, "laocai": _3, "longan": _3, "namdinh": _3, "nghean": _3, "ninhbinh": _3, "ninhthuan": _3, "phutho": _3, "phuyen": _3, "quangbinh": _3, "quangnam": _3, "quangngai": _3, "quangninh": _3, "quangtri": _3, "soctrang": _3, "sonla": _3, "tayninh": _3, "thaibinh": _3, "thainguyen": _3, "thanhhoa": _3, "thanhphohochiminh": _3, "thuathienhue": _3, "tiengiang": _3, "travinh": _3, "tuyenquang": _3, "vinhlong": _3, "vinhphuc": _3, "yenbai": _3 }], "vu": _45, "wf": [1, { "biz": _4, "sch": _4 }], "ws": [1, { "com": _3, "edu": _3, "gov": _3, "net": _3, "org": _3, "advisor": _7, "cloud66": _4, "dyndns": _4, "mypets": _4 }], "yt": [1, { "org": _4 }], "xn--mgbaam7a8h": _3, "\u0627\u0645\u0627\u0631\u0627\u062A": _3, "xn--y9a3aq": _3, "\u0570\u0561\u0575": _3, "xn--54b7fta0cc": _3, "\u09AC\u09BE\u0982\u09B2\u09BE": _3, "xn--90ae": _3, "\u0431\u0433": _3, "xn--mgbcpq6gpa1a": _3, "\u0627\u0644\u0628\u062D\u0631\u064A\u0646": _3, "xn--90ais": _3, "\u0431\u0435\u043B": _3, "xn--fiqs8s": _3, "\u4E2D\u56FD": _3, "xn--fiqz9s": _3, "\u4E2D\u570B": _3, "xn--lgbbat1ad8j": _3, "\u0627\u0644\u062C\u0632\u0627\u0626\u0631": _3, "xn--wgbh1c": _3, "\u0645\u0635\u0631": _3, "xn--e1a4c": _3, "\u0435\u044E": _3, "xn--qxa6a": _3, "\u03B5\u03C5": _3, "xn--mgbah1a3hjkrd": _3, "\u0645\u0648\u0631\u064A\u062A\u0627\u0646\u064A\u0627": _3, "xn--node": _3, "\u10D2\u10D4": _3, "xn--qxam": _3, "\u03B5\u03BB": _3, "xn--j6w193g": [1, { "xn--gmqw5a": _3, "xn--55qx5d": _3, "xn--mxtq1m": _3, "xn--wcvs22d": _3, "xn--uc0atv": _3, "xn--od0alg": _3 }], "\u9999\u6E2F": [1, { "\u500B\u4EBA": _3, "\u516C\u53F8": _3, "\u653F\u5E9C": _3, "\u6559\u80B2": _3, "\u7D44\u7E54": _3, "\u7DB2\u7D61": _3 }], "xn--2scrj9c": _3, "\u0CAD\u0CBE\u0CB0\u0CA4": _3, "xn--3hcrj9c": _3, "\u0B2D\u0B3E\u0B30\u0B24": _3, "xn--45br5cyl": _3, "\u09AD\u09BE\u09F0\u09A4": _3, "xn--h2breg3eve": _3, "\u092D\u093E\u0930\u0924\u092E\u094D": _3, "xn--h2brj9c8c": _3, "\u092D\u093E\u0930\u094B\u0924": _3, "xn--mgbgu82a": _3, "\u0680\u0627\u0631\u062A": _3, "xn--rvc1e0am3e": _3, "\u0D2D\u0D3E\u0D30\u0D24\u0D02": _3, "xn--h2brj9c": _3, "\u092D\u093E\u0930\u0924": _3, "xn--mgbbh1a": _3, "\u0628\u0627\u0631\u062A": _3, "xn--mgbbh1a71e": _3, "\u0628\u06BE\u0627\u0631\u062A": _3, "xn--fpcrj9c3d": _3, "\u0C2D\u0C3E\u0C30\u0C24\u0C4D": _3, "xn--gecrj9c": _3, "\u0AAD\u0ABE\u0AB0\u0AA4": _3, "xn--s9brj9c": _3, "\u0A2D\u0A3E\u0A30\u0A24": _3, "xn--45brj9c": _3, "\u09AD\u09BE\u09B0\u09A4": _3, "xn--xkc2dl3a5ee0h": _3, "\u0B87\u0BA8\u0BCD\u0BA4\u0BBF\u0BAF\u0BBE": _3, "xn--mgba3a4f16a": _3, "\u0627\u06CC\u0631\u0627\u0646": _3, "xn--mgba3a4fra": _3, "\u0627\u064A\u0631\u0627\u0646": _3, "xn--mgbtx2b": _3, "\u0639\u0631\u0627\u0642": _3, "xn--mgbayh7gpa": _3, "\u0627\u0644\u0627\u0631\u062F\u0646": _3, "xn--3e0b707e": _3, "\uD55C\uAD6D": _3, "xn--80ao21a": _3, "\u049B\u0430\u0437": _3, "xn--q7ce6a": _3, "\u0EA5\u0EB2\u0EA7": _3, "xn--fzc2c9e2c": _3, "\u0DBD\u0D82\u0D9A\u0DCF": _3, "xn--xkc2al3hye2a": _3, "\u0B87\u0BB2\u0B99\u0BCD\u0B95\u0BC8": _3, "xn--mgbc0a9azcg": _3, "\u0627\u0644\u0645\u063A\u0631\u0628": _3, "xn--d1alf": _3, "\u043C\u043A\u0434": _3, "xn--l1acc": _3, "\u043C\u043E\u043D": _3, "xn--mix891f": _3, "\u6FB3\u9580": _3, "xn--mix082f": _3, "\u6FB3\u95E8": _3, "xn--mgbx4cd0ab": _3, "\u0645\u0644\u064A\u0633\u064A\u0627": _3, "xn--mgb9awbf": _3, "\u0639\u0645\u0627\u0646": _3, "xn--mgbai9azgqp6j": _3, "\u067E\u0627\u06A9\u0633\u062A\u0627\u0646": _3, "xn--mgbai9a5eva00b": _3, "\u067E\u0627\u0643\u0633\u062A\u0627\u0646": _3, "xn--ygbi2ammx": _3, "\u0641\u0644\u0633\u0637\u064A\u0646": _3, "xn--90a3ac": [1, { "xn--80au": _3, "xn--90azh": _3, "xn--d1at": _3, "xn--c1avg": _3, "xn--o1ac": _3, "xn--o1ach": _3 }], "\u0441\u0440\u0431": [1, { "\u0430\u043A": _3, "\u043E\u0431\u0440": _3, "\u043E\u0434": _3, "\u043E\u0440\u0433": _3, "\u043F\u0440": _3, "\u0443\u043F\u0440": _3 }], "xn--p1ai": _3, "\u0440\u0444": _3, "xn--wgbl6a": _3, "\u0642\u0637\u0631": _3, "xn--mgberp4a5d4ar": _3, "\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629": _3, "xn--mgberp4a5d4a87g": _3, "\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u0629": _3, "xn--mgbqly7c0a67fbc": _3, "\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u06C3": _3, "xn--mgbqly7cvafr": _3, "\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0647": _3, "xn--mgbpl2fh": _3, "\u0633\u0648\u062F\u0627\u0646": _3, "xn--yfro4i67o": _3, "\u65B0\u52A0\u5761": _3, "xn--clchc0ea0b2g2a9gcd": _3, "\u0B9A\u0BBF\u0B99\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0BC2\u0BB0\u0BCD": _3, "xn--ogbpf8fl": _3, "\u0633\u0648\u0631\u064A\u0629": _3, "xn--mgbtf8fl": _3, "\u0633\u0648\u0631\u064A\u0627": _3, "xn--o3cw4h": [1, { "xn--o3cyx2a": _3, "xn--12co0c3b4eva": _3, "xn--m3ch0j3a": _3, "xn--h3cuzk1di": _3, "xn--12c1fe0br": _3, "xn--12cfi8ixb8l": _3 }], "\u0E44\u0E17\u0E22": [1, { "\u0E17\u0E2B\u0E32\u0E23": _3, "\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08": _3, "\u0E40\u0E19\u0E47\u0E15": _3, "\u0E23\u0E31\u0E10\u0E1A\u0E32\u0E25": _3, "\u0E28\u0E36\u0E01\u0E29\u0E32": _3, "\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E23": _3 }], "xn--pgbs0dh": _3, "\u062A\u0648\u0646\u0633": _3, "xn--kpry57d": _3, "\u53F0\u7063": _3, "xn--kprw13d": _3, "\u53F0\u6E7E": _3, "xn--nnx388a": _3, "\u81FA\u7063": _3, "xn--j1amh": _3, "\u0443\u043A\u0440": _3, "xn--mgb2ddes": _3, "\u0627\u0644\u064A\u0645\u0646": _3, "xxx": _3, "ye": _6, "za": [0, { "ac": _3, "agric": _3, "alt": _3, "co": _3, "edu": _3, "gov": _3, "grondar": _3, "law": _3, "mil": _3, "net": _3, "ngo": _3, "nic": _3, "nis": _3, "nom": _3, "org": _3, "school": _3, "tm": _3, "web": _3 }], "zm": [1, { "ac": _3, "biz": _3, "co": _3, "com": _3, "edu": _3, "gov": _3, "info": _3, "mil": _3, "net": _3, "org": _3, "sch": _3 }], "zw": [1, { "ac": _3, "co": _3, "gov": _3, "mil": _3, "org": _3 }], "aaa": _3, "aarp": _3, "abb": _3, "abbott": _3, "abbvie": _3, "abc": _3, "able": _3, "abogado": _3, "abudhabi": _3, "academy": [1, { "official": _4 }], "accenture": _3, "accountant": _3, "accountants": _3, "aco": _3, "actor": _3, "ads": _3, "adult": _3, "aeg": _3, "aetna": _3, "afl": _3, "africa": _3, "agakhan": _3, "agency": _3, "aig": _3, "airbus": _3, "airforce": _3, "airtel": _3, "akdn": _3, "alibaba": _3, "alipay": _3, "allfinanz": _3, "allstate": _3, "ally": _3, "alsace": _3, "alstom": _3, "amazon": _3, "americanexpress": _3, "americanfamily": _3, "amex": _3, "amfam": _3, "amica": _3, "amsterdam": _3, "analytics": _3, "android": _3, "anquan": _3, "anz": _3, "aol": _3, "apartments": _3, "app": [1, { "adaptable": _4, "aiven": _4, "beget": _7, "brave": _8, "clerk": _4, "clerkstage": _4, "wnext": _4, "csb": [2, { "preview": _4 }], "deta": _4, "ondigitalocean": _4, "easypanel": _4, "encr": _4, "evervault": _9, "expo": _10, "edgecompute": _4, "on-fleek": _4, "flutterflow": _4, "framer": _4, "hosted": _7, "run": _7, "web": _4, "hasura": _4, "botdash": _4, "loginline": _4, "lovable": _4, "medusajs": _4, "messerli": _4, "netfy": _4, "netlify": _4, "ngrok": _4, "ngrok-free": _4, "developer": _7, "noop": _4, "northflank": _7, "upsun": _7, "replit": _11, "nyat": _4, "snowflake": [0, { "*": _4, "privatelink": _7 }], "streamlit": _4, "storipress": _4, "telebit": _4, "typedream": _4, "vercel": _4, "bookonline": _4, "wdh": _4, "zeabur": _4, "zerops": _7 }], "apple": _3, "aquarelle": _3, "arab": _3, "aramco": _3, "archi": _3, "army": _3, "art": _3, "arte": _3, "asda": _3, "associates": _3, "athleta": _3, "attorney": _3, "auction": _3, "audi": _3, "audible": _3, "audio": _3, "auspost": _3, "author": _3, "auto": _3, "autos": _3, "aws": [1, { "sagemaker": [0, { "ap-northeast-1": _15, "ap-northeast-2": _15, "ap-south-1": _15, "ap-southeast-1": _15, "ap-southeast-2": _15, "ca-central-1": _17, "eu-central-1": _15, "eu-west-1": _15, "eu-west-2": _15, "us-east-1": _17, "us-east-2": _17, "us-west-2": _17, "af-south-1": _14, "ap-east-1": _14, "ap-northeast-3": _14, "ap-south-2": _16, "ap-southeast-3": _14, "ap-southeast-4": _16, "ca-west-1": [0, { "notebook": _4, "notebook-fips": _4 }], "eu-central-2": _14, "eu-north-1": _14, "eu-south-1": _14, "eu-south-2": _14, "eu-west-3": _14, "il-central-1": _14, "me-central-1": _14, "me-south-1": _14, "sa-east-1": _14, "us-gov-east-1": _18, "us-gov-west-1": _18, "us-west-1": [0, { "notebook": _4, "notebook-fips": _4, "studio": _4 }], "experiments": _7 }], "repost": [0, { "private": _7 }], "on": [0, { "ap-northeast-1": _13, "ap-southeast-1": _13, "ap-southeast-2": _13, "eu-central-1": _13, "eu-north-1": _13, "eu-west-1": _13, "us-east-1": _13, "us-east-2": _13, "us-west-2": _13 }] }], "axa": _3, "azure": _3, "baby": _3, "baidu": _3, "banamex": _3, "band": _3, "bank": _3, "bar": _3, "barcelona": _3, "barclaycard": _3, "barclays": _3, "barefoot": _3, "bargains": _3, "baseball": _3, "basketball": [1, { "aus": _4, "nz": _4 }], "bauhaus": _3, "bayern": _3, "bbc": _3, "bbt": _3, "bbva": _3, "bcg": _3, "bcn": _3, "beats": _3, "beauty": _3, "beer": _3, "bentley": _3, "berlin": _3, "best": _3, "bestbuy": _3, "bet": _3, "bharti": _3, "bible": _3, "bid": _3, "bike": _3, "bing": _3, "bingo": _3, "bio": _3, "black": _3, "blackfriday": _3, "blockbuster": _3, "blog": _3, "bloomberg": _3, "blue": _3, "bms": _3, "bmw": _3, "bnpparibas": _3, "boats": _3, "boehringer": _3, "bofa": _3, "bom": _3, "bond": _3, "boo": _3, "book": _3, "booking": _3, "bosch": _3, "bostik": _3, "boston": _3, "bot": _3, "boutique": _3, "box": _3, "bradesco": _3, "bridgestone": _3, "broadway": _3, "broker": _3, "brother": _3, "brussels": _3, "build": [1, { "v0": _4 }], "builders": [1, { "cloudsite": _4 }], "business": _20, "buy": _3, "buzz": _3, "bzh": _3, "cab": _3, "cafe": _3, "cal": _3, "call": _3, "calvinklein": _3, "cam": _3, "camera": _3, "camp": [1, { "emf": [0, { "at": _4 }] }], "canon": _3, "capetown": _3, "capital": _3, "capitalone": _3, "car": _3, "caravan": _3, "cards": _3, "care": _3, "career": _3, "careers": _3, "cars": _3, "casa": [1, { "nabu": [0, { "ui": _4 }] }], "case": _3, "cash": _3, "casino": _3, "catering": _3, "catholic": _3, "cba": _3, "cbn": _3, "cbre": _3, "center": _3, "ceo": _3, "cern": _3, "cfa": _3, "cfd": _3, "chanel": _3, "channel": _3, "charity": _3, "chase": _3, "chat": _3, "cheap": _3, "chintai": _3, "christmas": _3, "chrome": _3, "church": _3, "cipriani": _3, "circle": _3, "cisco": _3, "citadel": _3, "citi": _3, "citic": _3, "city": _3, "claims": _3, "cleaning": _3, "click": _3, "clinic": _3, "clinique": _3, "clothing": _3, "cloud": [1, { "elementor": _4, "encoway": [0, { "eu": _4 }], "statics": _7, "ravendb": _4, "axarnet": [0, { "es-1": _4 }], "diadem": _4, "jelastic": [0, { "vip": _4 }], "jele": _4, "jenv-aruba": [0, { "aruba": [0, { "eur": [0, { "it1": _4 }] }], "it1": _4 }], "keliweb": [2, { "cs": _4 }], "oxa": [2, { "tn": _4, "uk": _4 }], "primetel": [2, { "uk": _4 }], "reclaim": [0, { "ca": _4, "uk": _4, "us": _4 }], "trendhosting": [0, { "ch": _4, "de": _4 }], "jotelulu": _4, "kuleuven": _4, "laravel": _4, "linkyard": _4, "magentosite": _7, "matlab": _4, "observablehq": _4, "perspecta": _4, "vapor": _4, "on-rancher": _7, "scw": [0, { "baremetal": [0, { "fr-par-1": _4, "fr-par-2": _4, "nl-ams-1": _4 }], "fr-par": [0, { "cockpit": _4, "fnc": [2, { "functions": _4 }], "k8s": _22, "s3": _4, "s3-website": _4, "whm": _4 }], "instances": [0, { "priv": _4, "pub": _4 }], "k8s": _4, "nl-ams": [0, { "cockpit": _4, "k8s": _22, "s3": _4, "s3-website": _4, "whm": _4 }], "pl-waw": [0, { "cockpit": _4, "k8s": _22, "s3": _4, "s3-website": _4 }], "scalebook": _4, "smartlabeling": _4 }], "servebolt": _4, "onstackit": [0, { "runs": _4 }], "trafficplex": _4, "unison-services": _4, "urown": _4, "voorloper": _4, "zap": _4 }], "club": [1, { "cloudns": _4, "jele": _4, "barsy": _4 }], "clubmed": _3, "coach": _3, "codes": [1, { "owo": _7 }], "coffee": _3, "college": _3, "cologne": _3, "commbank": _3, "community": [1, { "nog": _4, "ravendb": _4, "myforum": _4 }], "company": _3, "compare": _3, "computer": _3, "comsec": _3, "condos": _3, "construction": _3, "consulting": _3, "contact": _3, "contractors": _3, "cooking": _3, "cool": [1, { "elementor": _4, "de": _4 }], "corsica": _3, "country": _3, "coupon": _3, "coupons": _3, "courses": _3, "cpa": _3, "credit": _3, "creditcard": _3, "creditunion": _3, "cricket": _3, "crown": _3, "crs": _3, "cruise": _3, "cruises": _3, "cuisinella": _3, "cymru": _3, "cyou": _3, "dad": _3, "dance": _3, "data": _3, "date": _3, "dating": _3, "datsun": _3, "day": _3, "dclk": _3, "dds": _3, "deal": _3, "dealer": _3, "deals": _3, "degree": _3, "delivery": _3, "dell": _3, "deloitte": _3, "delta": _3, "democrat": _3, "dental": _3, "dentist": _3, "desi": _3, "design": [1, { "graphic": _4, "bss": _4 }], "dev": [1, { "12chars": _4, "myaddr": _4, "panel": _4, "lcl": _7, "lclstage": _7, "stg": _7, "stgstage": _7, "pages": _4, "r2": _4, "workers": _4, "deno": _4, "deno-staging": _4, "deta": _4, "evervault": _9, "fly": _4, "githubpreview": _4, "gateway": _7, "hrsn": [2, { "psl": [0, { "sub": _4, "wc": [0, { "*": _4, "sub": _7 }] }] }], "botdash": _4, "inbrowser": _7, "is-a-good": _4, "is-a": _4, "iserv": _4, "runcontainers": _4, "localcert": [0, { "user": _7 }], "loginline": _4, "barsy": _4, "mediatech": _4, "modx": _4, "ngrok": _4, "ngrok-free": _4, "is-a-fullstack": _4, "is-cool": _4, "is-not-a": _4, "localplayer": _4, "xmit": _4, "platter-app": _4, "replit": [2, { "archer": _4, "bones": _4, "canary": _4, "global": _4, "hacker": _4, "id": _4, "janeway": _4, "kim": _4, "kira": _4, "kirk": _4, "odo": _4, "paris": _4, "picard": _4, "pike": _4, "prerelease": _4, "reed": _4, "riker": _4, "sisko": _4, "spock": _4, "staging": _4, "sulu": _4, "tarpit": _4, "teams": _4, "tucker": _4, "wesley": _4, "worf": _4 }], "crm": [0, { "d": _7, "w": _7, "wa": _7, "wb": _7, "wc": _7, "wd": _7, "we": _7, "wf": _7 }], "vercel": _4, "webhare": _7 }], "dhl": _3, "diamonds": _3, "diet": _3, "digital": [1, { "cloudapps": [2, { "london": _4 }] }], "direct": [1, { "libp2p": _4 }], "directory": _3, "discount": _3, "discover": _3, "dish": _3, "diy": _3, "dnp": _3, "docs": _3, "doctor": _3, "dog": _3, "domains": _3, "dot": _3, "download": _3, "drive": _3, "dtv": _3, "dubai": _3, "dunlop": _3, "dupont": _3, "durban": _3, "dvag": _3, "dvr": _3, "earth": _3, "eat": _3, "eco": _3, "edeka": _3, "education": _20, "email": [1, { "crisp": [0, { "on": _4 }], "tawk": _49, "tawkto": _49 }], "emerck": _3, "energy": _3, "engineer": _3, "engineering": _3, "enterprises": _3, "epson": _3, "equipment": _3, "ericsson": _3, "erni": _3, "esq": _3, "estate": [1, { "compute": _7 }], "eurovision": _3, "eus": [1, { "party": _50 }], "events": [1, { "koobin": _4, "co": _4 }], "exchange": _3, "expert": _3, "exposed": _3, "express": _3, "extraspace": _3, "fage": _3, "fail": _3, "fairwinds": _3, "faith": _3, "family": _3, "fan": _3, "fans": _3, "farm": [1, { "storj": _4 }], "farmers": _3, "fashion": _3, "fast": _3, "fedex": _3, "feedback": _3, "ferrari": _3, "ferrero": _3, "fidelity": _3, "fido": _3, "film": _3, "final": _3, "finance": _3, "financial": _20, "fire": _3, "firestone": _3, "firmdale": _3, "fish": _3, "fishing": _3, "fit": _3, "fitness": _3, "flickr": _3, "flights": _3, "flir": _3, "florist": _3, "flowers": _3, "fly": _3, "foo": _3, "food": _3, "football": _3, "ford": _3, "forex": _3, "forsale": _3, "forum": _3, "foundation": _3, "fox": _3, "free": _3, "fresenius": _3, "frl": _3, "frogans": _3, "frontier": _3, "ftr": _3, "fujitsu": _3, "fun": _3, "fund": _3, "furniture": _3, "futbol": _3, "fyi": _3, "gal": _3, "gallery": _3, "gallo": _3, "gallup": _3, "game": _3, "games": [1, { "pley": _4, "sheezy": _4 }], "gap": _3, "garden": _3, "gay": [1, { "pages": _4 }], "gbiz": _3, "gdn": [1, { "cnpy": _4 }], "gea": _3, "gent": _3, "genting": _3, "george": _3, "ggee": _3, "gift": _3, "gifts": _3, "gives": _3, "giving": _3, "glass": _3, "gle": _3, "global": _3, "globo": _3, "gmail": _3, "gmbh": _3, "gmo": _3, "gmx": _3, "godaddy": _3, "gold": _3, "goldpoint": _3, "golf": _3, "goo": _3, "goodyear": _3, "goog": [1, { "cloud": _4, "translate": _4, "usercontent": _7 }], "google": _3, "gop": _3, "got": _3, "grainger": _3, "graphics": _3, "gratis": _3, "green": _3, "gripe": _3, "grocery": _3, "group": [1, { "discourse": _4 }], "gucci": _3, "guge": _3, "guide": _3, "guitars": _3, "guru": _3, "hair": _3, "hamburg": _3, "hangout": _3, "haus": _3, "hbo": _3, "hdfc": _3, "hdfcbank": _3, "health": [1, { "hra": _4 }], "healthcare": _3, "help": _3, "helsinki": _3, "here": _3, "hermes": _3, "hiphop": _3, "hisamitsu": _3, "hitachi": _3, "hiv": _3, "hkt": _3, "hockey": _3, "holdings": _3, "holiday": _3, "homedepot": _3, "homegoods": _3, "homes": _3, "homesense": _3, "honda": _3, "horse": _3, "hospital": _3, "host": [1, { "cloudaccess": _4, "freesite": _4, "easypanel": _4, "fastvps": _4, "myfast": _4, "tempurl": _4, "wpmudev": _4, "jele": _4, "mircloud": _4, "wp2": _4, "half": _4 }], "hosting": [1, { "opencraft": _4 }], "hot": _3, "hotels": _3, "hotmail": _3, "house": _3, "how": _3, "hsbc": _3, "hughes": _3, "hyatt": _3, "hyundai": _3, "ibm": _3, "icbc": _3, "ice": _3, "icu": _3, "ieee": _3, "ifm": _3, "ikano": _3, "imamat": _3, "imdb": _3, "immo": _3, "immobilien": _3, "inc": _3, "industries": _3, "infiniti": _3, "ing": _3, "ink": _3, "institute": _3, "insurance": _3, "insure": _3, "international": _3, "intuit": _3, "investments": _3, "ipiranga": _3, "irish": _3, "ismaili": _3, "ist": _3, "istanbul": _3, "itau": _3, "itv": _3, "jaguar": _3, "java": _3, "jcb": _3, "jeep": _3, "jetzt": _3, "jewelry": _3, "jio": _3, "jll": _3, "jmp": _3, "jnj": _3, "joburg": _3, "jot": _3, "joy": _3, "jpmorgan": _3, "jprs": _3, "juegos": _3, "juniper": _3, "kaufen": _3, "kddi": _3, "kerryhotels": _3, "kerryproperties": _3, "kfh": _3, "kia": _3, "kids": _3, "kim": _3, "kindle": _3, "kitchen": _3, "kiwi": _3, "koeln": _3, "komatsu": _3, "kosher": _3, "kpmg": _3, "kpn": _3, "krd": [1, { "co": _4, "edu": _4 }], "kred": _3, "kuokgroup": _3, "kyoto": _3, "lacaixa": _3, "lamborghini": _3, "lamer": _3, "lancaster": _3, "land": _3, "landrover": _3, "lanxess": _3, "lasalle": _3, "lat": _3, "latino": _3, "latrobe": _3, "law": _3, "lawyer": _3, "lds": _3, "lease": _3, "leclerc": _3, "lefrak": _3, "legal": _3, "lego": _3, "lexus": _3, "lgbt": _3, "lidl": _3, "life": _3, "lifeinsurance": _3, "lifestyle": _3, "lighting": _3, "like": _3, "lilly": _3, "limited": _3, "limo": _3, "lincoln": _3, "link": [1, { "myfritz": _4, "cyon": _4, "dweb": _7, "inbrowser": _7, "nftstorage": [0, { "ipfs": _4 }], "mypep": _4 }], "live": [1, { "aem": _4, "hlx": _4, "ewp": _7 }], "living": _3, "llc": _3, "llp": _3, "loan": _3, "loans": _3, "locker": _3, "locus": _3, "lol": [1, { "omg": _4 }], "london": _3, "lotte": _3, "lotto": _3, "love": _3, "lpl": _3, "lplfinancial": _3, "ltd": _3, "ltda": _3, "lundbeck": _3, "luxe": _3, "luxury": _3, "madrid": _3, "maif": _3, "maison": _3, "makeup": _3, "man": _3, "management": _3, "mango": _3, "map": _3, "market": _3, "marketing": _3, "markets": _3, "marriott": _3, "marshalls": _3, "mattel": _3, "mba": _3, "mckinsey": _3, "med": _3, "media": _57, "meet": _3, "melbourne": _3, "meme": _3, "memorial": _3, "men": _3, "menu": [1, { "barsy": _4, "barsyonline": _4 }], "merck": _3, "merckmsd": _3, "miami": _3, "microsoft": _3, "mini": _3, "mint": _3, "mit": _3, "mitsubishi": _3, "mlb": _3, "mls": _3, "mma": _3, "mobile": _3, "moda": _3, "moe": _3, "moi": _3, "mom": [1, { "ind": _4 }], "monash": _3, "money": _3, "monster": _3, "mormon": _3, "mortgage": _3, "moscow": _3, "moto": _3, "motorcycles": _3, "mov": _3, "movie": _3, "msd": _3, "mtn": _3, "mtr": _3, "music": _3, "nab": _3, "nagoya": _3, "navy": _3, "nba": _3, "nec": _3, "netbank": _3, "netflix": _3, "network": [1, { "alces": _7, "co": _4, "arvo": _4, "azimuth": _4, "tlon": _4 }], "neustar": _3, "new": _3, "news": [1, { "noticeable": _4 }], "next": _3, "nextdirect": _3, "nexus": _3, "nfl": _3, "ngo": _3, "nhk": _3, "nico": _3, "nike": _3, "nikon": _3, "ninja": _3, "nissan": _3, "nissay": _3, "nokia": _3, "norton": _3, "now": _3, "nowruz": _3, "nowtv": _3, "nra": _3, "nrw": _3, "ntt": _3, "nyc": _3, "obi": _3, "observer": _3, "office": _3, "okinawa": _3, "olayan": _3, "olayangroup": _3, "ollo": _3, "omega": _3, "one": [1, { "kin": _7, "service": _4 }], "ong": [1, { "obl": _4 }], "onl": _3, "online": [1, { "eero": _4, "eero-stage": _4, "websitebuilder": _4, "barsy": _4 }], "ooo": _3, "open": _3, "oracle": _3, "orange": [1, { "tech": _4 }], "organic": _3, "origins": _3, "osaka": _3, "otsuka": _3, "ott": _3, "ovh": [1, { "nerdpol": _4 }], "page": [1, { "aem": _4, "hlx": _4, "hlx3": _4, "translated": _4, "codeberg": _4, "heyflow": _4, "prvcy": _4, "rocky": _4, "pdns": _4, "plesk": _4 }], "panasonic": _3, "paris": _3, "pars": _3, "partners": _3, "parts": _3, "party": _3, "pay": _3, "pccw": _3, "pet": _3, "pfizer": _3, "pharmacy": _3, "phd": _3, "philips": _3, "phone": _3, "photo": _3, "photography": _3, "photos": _57, "physio": _3, "pics": _3, "pictet": _3, "pictures": [1, { "1337": _4 }], "pid": _3, "pin": _3, "ping": _3, "pink": _3, "pioneer": _3, "pizza": [1, { "ngrok": _4 }], "place": _20, "play": _3, "playstation": _3, "plumbing": _3, "plus": _3, "pnc": _3, "pohl": _3, "poker": _3, "politie": _3, "porn": _3, "pramerica": _3, "praxi": _3, "press": _3, "prime": _3, "prod": _3, "productions": _3, "prof": _3, "progressive": _3, "promo": _3, "properties": _3, "property": _3, "protection": _3, "pru": _3, "prudential": _3, "pub": [1, { "id": _7, "kin": _7, "barsy": _4 }], "pwc": _3, "qpon": _3, "quebec": _3, "quest": _3, "racing": _3, "radio": _3, "read": _3, "realestate": _3, "realtor": _3, "realty": _3, "recipes": _3, "red": _3, "redstone": _3, "redumbrella": _3, "rehab": _3, "reise": _3, "reisen": _3, "reit": _3, "reliance": _3, "ren": _3, "rent": _3, "rentals": _3, "repair": _3, "report": _3, "republican": _3, "rest": _3, "restaurant": _3, "review": _3, "reviews": _3, "rexroth": _3, "rich": _3, "richardli": _3, "ricoh": _3, "ril": _3, "rio": _3, "rip": [1, { "clan": _4 }], "rocks": [1, { "myddns": _4, "stackit": _4, "lima-city": _4, "webspace": _4 }], "rodeo": _3, "rogers": _3, "room": _3, "rsvp": _3, "rugby": _3, "ruhr": _3, "run": [1, { "development": _4, "ravendb": _4, "liara": [2, { "iran": _4 }], "servers": _4, "build": _7, "code": _7, "database": _7, "migration": _7, "onporter": _4, "repl": _4, "stackit": _4, "val": [0, { "express": _4, "web": _4 }], "wix": _4 }], "rwe": _3, "ryukyu": _3, "saarland": _3, "safe": _3, "safety": _3, "sakura": _3, "sale": _3, "salon": _3, "samsclub": _3, "samsung": _3, "sandvik": _3, "sandvikcoromant": _3, "sanofi": _3, "sap": _3, "sarl": _3, "sas": _3, "save": _3, "saxo": _3, "sbi": _3, "sbs": _3, "scb": _3, "schaeffler": _3, "schmidt": _3, "scholarships": _3, "school": _3, "schule": _3, "schwarz": _3, "science": _3, "scot": [1, { "gov": [2, { "service": _4 }] }], "search": _3, "seat": _3, "secure": _3, "security": _3, "seek": _3, "select": _3, "sener": _3, "services": [1, { "loginline": _4 }], "seven": _3, "sew": _3, "sex": _3, "sexy": _3, "sfr": _3, "shangrila": _3, "sharp": _3, "shell": _3, "shia": _3, "shiksha": _3, "shoes": _3, "shop": [1, { "base": _4, "hoplix": _4, "barsy": _4, "barsyonline": _4, "shopware": _4 }], "shopping": _3, "shouji": _3, "show": _3, "silk": _3, "sina": _3, "singles": _3, "site": [1, { "square": _4, "canva": _23, "cloudera": _7, "convex": _4, "cyon": _4, "fastvps": _4, "heyflow": _4, "jele": _4, "jouwweb": _4, "loginline": _4, "barsy": _4, "notion": _4, "omniwe": _4, "opensocial": _4, "madethis": _4, "platformsh": _7, "tst": _7, "byen": _4, "srht": _4, "novecore": _4, "cpanel": _4, "wpsquared": _4 }], "ski": _3, "skin": _3, "sky": _3, "skype": _3, "sling": _3, "smart": _3, "smile": _3, "sncf": _3, "soccer": _3, "social": _3, "softbank": _3, "software": _3, "sohu": _3, "solar": _3, "solutions": _3, "song": _3, "sony": _3, "soy": _3, "spa": _3, "space": [1, { "myfast": _4, "heiyu": _4, "hf": [2, { "static": _4 }], "app-ionos": _4, "project": _4, "uber": _4, "xs4all": _4 }], "sport": _3, "spot": _3, "srl": _3, "stada": _3, "staples": _3, "star": _3, "statebank": _3, "statefarm": _3, "stc": _3, "stcgroup": _3, "stockholm": _3, "storage": _3, "store": [1, { "barsy": _4, "sellfy": _4, "shopware": _4, "storebase": _4 }], "stream": _3, "studio": _3, "study": _3, "style": _3, "sucks": _3, "supplies": _3, "supply": _3, "support": [1, { "barsy": _4 }], "surf": _3, "surgery": _3, "suzuki": _3, "swatch": _3, "swiss": _3, "sydney": _3, "systems": [1, { "knightpoint": _4 }], "tab": _3, "taipei": _3, "talk": _3, "taobao": _3, "target": _3, "tatamotors": _3, "tatar": _3, "tattoo": _3, "tax": _3, "taxi": _3, "tci": _3, "tdk": _3, "team": [1, { "discourse": _4, "jelastic": _4 }], "tech": [1, { "cleverapps": _4 }], "technology": _20, "temasek": _3, "tennis": _3, "teva": _3, "thd": _3, "theater": _3, "theatre": _3, "tiaa": _3, "tickets": _3, "tienda": _3, "tips": _3, "tires": _3, "tirol": _3, "tjmaxx": _3, "tjx": _3, "tkmaxx": _3, "tmall": _3, "today": [1, { "prequalifyme": _4 }], "tokyo": _3, "tools": [1, { "addr": _47, "myaddr": _4 }], "top": [1, { "ntdll": _4, "wadl": _7 }], "toray": _3, "toshiba": _3, "total": _3, "tours": _3, "town": _3, "toyota": _3, "toys": _3, "trade": _3, "trading": _3, "training": _3, "travel": _3, "travelers": _3, "travelersinsurance": _3, "trust": _3, "trv": _3, "tube": _3, "tui": _3, "tunes": _3, "tushu": _3, "tvs": _3, "ubank": _3, "ubs": _3, "unicom": _3, "university": _3, "uno": _3, "uol": _3, "ups": _3, "vacations": _3, "vana": _3, "vanguard": _3, "vegas": _3, "ventures": _3, "verisign": _3, "versicherung": _3, "vet": _3, "viajes": _3, "video": _3, "vig": _3, "viking": _3, "villas": _3, "vin": _3, "vip": _3, "virgin": _3, "visa": _3, "vision": _3, "viva": _3, "vivo": _3, "vlaanderen": _3, "vodka": _3, "volvo": _3, "vote": _3, "voting": _3, "voto": _3, "voyage": _3, "wales": _3, "walmart": _3, "walter": _3, "wang": _3, "wanggou": _3, "watch": _3, "watches": _3, "weather": _3, "weatherchannel": _3, "webcam": _3, "weber": _3, "website": _57, "wed": _3, "wedding": _3, "weibo": _3, "weir": _3, "whoswho": _3, "wien": _3, "wiki": _57, "williamhill": _3, "win": _3, "windows": _3, "wine": _3, "winners": _3, "wme": _3, "wolterskluwer": _3, "woodside": _3, "work": _3, "works": _3, "world": _3, "wow": _3, "wtc": _3, "wtf": _3, "xbox": _3, "xerox": _3, "xihuan": _3, "xin": _3, "xn--11b4c3d": _3, "\u0915\u0949\u092E": _3, "xn--1ck2e1b": _3, "\u30BB\u30FC\u30EB": _3, "xn--1qqw23a": _3, "\u4F5B\u5C71": _3, "xn--30rr7y": _3, "\u6148\u5584": _3, "xn--3bst00m": _3, "\u96C6\u56E2": _3, "xn--3ds443g": _3, "\u5728\u7EBF": _3, "xn--3pxu8k": _3, "\u70B9\u770B": _3, "xn--42c2d9a": _3, "\u0E04\u0E2D\u0E21": _3, "xn--45q11c": _3, "\u516B\u5366": _3, "xn--4gbrim": _3, "\u0645\u0648\u0642\u0639": _3, "xn--55qw42g": _3, "\u516C\u76CA": _3, "xn--55qx5d": _3, "\u516C\u53F8": _3, "xn--5su34j936bgsg": _3, "\u9999\u683C\u91CC\u62C9": _3, "xn--5tzm5g": _3, "\u7F51\u7AD9": _3, "xn--6frz82g": _3, "\u79FB\u52A8": _3, "xn--6qq986b3xl": _3, "\u6211\u7231\u4F60": _3, "xn--80adxhks": _3, "\u043C\u043E\u0441\u043A\u0432\u0430": _3, "xn--80aqecdr1a": _3, "\u043A\u0430\u0442\u043E\u043B\u0438\u043A": _3, "xn--80asehdb": _3, "\u043E\u043D\u043B\u0430\u0439\u043D": _3, "xn--80aswg": _3, "\u0441\u0430\u0439\u0442": _3, "xn--8y0a063a": _3, "\u8054\u901A": _3, "xn--9dbq2a": _3, "\u05E7\u05D5\u05DD": _3, "xn--9et52u": _3, "\u65F6\u5C1A": _3, "xn--9krt00a": _3, "\u5FAE\u535A": _3, "xn--b4w605ferd": _3, "\u6DE1\u9A6C\u9521": _3, "xn--bck1b9a5dre4c": _3, "\u30D5\u30A1\u30C3\u30B7\u30E7\u30F3": _3, "xn--c1avg": _3, "\u043E\u0440\u0433": _3, "xn--c2br7g": _3, "\u0928\u0947\u091F": _3, "xn--cck2b3b": _3, "\u30B9\u30C8\u30A2": _3, "xn--cckwcxetd": _3, "\u30A2\u30DE\u30BE\u30F3": _3, "xn--cg4bki": _3, "\uC0BC\uC131": _3, "xn--czr694b": _3, "\u5546\u6807": _3, "xn--czrs0t": _3, "\u5546\u5E97": _3, "xn--czru2d": _3, "\u5546\u57CE": _3, "xn--d1acj3b": _3, "\u0434\u0435\u0442\u0438": _3, "xn--eckvdtc9d": _3, "\u30DD\u30A4\u30F3\u30C8": _3, "xn--efvy88h": _3, "\u65B0\u95FB": _3, "xn--fct429k": _3, "\u5BB6\u96FB": _3, "xn--fhbei": _3, "\u0643\u0648\u0645": _3, "xn--fiq228c5hs": _3, "\u4E2D\u6587\u7F51": _3, "xn--fiq64b": _3, "\u4E2D\u4FE1": _3, "xn--fjq720a": _3, "\u5A31\u4E50": _3, "xn--flw351e": _3, "\u8C37\u6B4C": _3, "xn--fzys8d69uvgm": _3, "\u96FB\u8A0A\u76C8\u79D1": _3, "xn--g2xx48c": _3, "\u8D2D\u7269": _3, "xn--gckr3f0f": _3, "\u30AF\u30E9\u30A6\u30C9": _3, "xn--gk3at1e": _3, "\u901A\u8CA9": _3, "xn--hxt814e": _3, "\u7F51\u5E97": _3, "xn--i1b6b1a6a2e": _3, "\u0938\u0902\u0917\u0920\u0928": _3, "xn--imr513n": _3, "\u9910\u5385": _3, "xn--io0a7i": _3, "\u7F51\u7EDC": _3, "xn--j1aef": _3, "\u043A\u043E\u043C": _3, "xn--jlq480n2rg": _3, "\u4E9A\u9A6C\u900A": _3, "xn--jvr189m": _3, "\u98DF\u54C1": _3, "xn--kcrx77d1x4a": _3, "\u98DE\u5229\u6D66": _3, "xn--kput3i": _3, "\u624B\u673A": _3, "xn--mgba3a3ejt": _3, "\u0627\u0631\u0627\u0645\u0643\u0648": _3, "xn--mgba7c0bbn0a": _3, "\u0627\u0644\u0639\u0644\u064A\u0627\u0646": _3, "xn--mgbab2bd": _3, "\u0628\u0627\u0632\u0627\u0631": _3, "xn--mgbca7dzdo": _3, "\u0627\u0628\u0648\u0638\u0628\u064A": _3, "xn--mgbi4ecexp": _3, "\u0643\u0627\u062B\u0648\u0644\u064A\u0643": _3, "xn--mgbt3dhd": _3, "\u0647\u0645\u0631\u0627\u0647": _3, "xn--mk1bu44c": _3, "\uB2F7\uCEF4": _3, "xn--mxtq1m": _3, "\u653F\u5E9C": _3, "xn--ngbc5azd": _3, "\u0634\u0628\u0643\u0629": _3, "xn--ngbe9e0a": _3, "\u0628\u064A\u062A\u0643": _3, "xn--ngbrx": _3, "\u0639\u0631\u0628": _3, "xn--nqv7f": _3, "\u673A\u6784": _3, "xn--nqv7fs00ema": _3, "\u7EC4\u7EC7\u673A\u6784": _3, "xn--nyqy26a": _3, "\u5065\u5EB7": _3, "xn--otu796d": _3, "\u62DB\u8058": _3, "xn--p1acf": [1, { "xn--90amc": _4, "xn--j1aef": _4, "xn--j1ael8b": _4, "xn--h1ahn": _4, "xn--j1adp": _4, "xn--c1avg": _4, "xn--80aaa0cvac": _4, "xn--h1aliz": _4, "xn--90a1af": _4, "xn--41a": _4 }], "\u0440\u0443\u0441": [1, { "\u0431\u0438\u0437": _4, "\u043A\u043E\u043C": _4, "\u043A\u0440\u044B\u043C": _4, "\u043C\u0438\u0440": _4, "\u043C\u0441\u043A": _4, "\u043E\u0440\u0433": _4, "\u0441\u0430\u043C\u0430\u0440\u0430": _4, "\u0441\u043E\u0447\u0438": _4, "\u0441\u043F\u0431": _4, "\u044F": _4 }], "xn--pssy2u": _3, "\u5927\u62FF": _3, "xn--q9jyb4c": _3, "\u307F\u3093\u306A": _3, "xn--qcka1pmc": _3, "\u30B0\u30FC\u30B0\u30EB": _3, "xn--rhqv96g": _3, "\u4E16\u754C": _3, "xn--rovu88b": _3, "\u66F8\u7C4D": _3, "xn--ses554g": _3, "\u7F51\u5740": _3, "xn--t60b56a": _3, "\uB2F7\uB137": _3, "xn--tckwe": _3, "\u30B3\u30E0": _3, "xn--tiq49xqyj": _3, "\u5929\u4E3B\u6559": _3, "xn--unup4y": _3, "\u6E38\u620F": _3, "xn--vermgensberater-ctb": _3, "verm\xF6gensberater": _3, "xn--vermgensberatung-pwb": _3, "verm\xF6gensberatung": _3, "xn--vhquv": _3, "\u4F01\u4E1A": _3, "xn--vuq861b": _3, "\u4FE1\u606F": _3, "xn--w4r85el8fhu5dnra": _3, "\u5609\u91CC\u5927\u9152\u5E97": _3, "xn--w4rs40l": _3, "\u5609\u91CC": _3, "xn--xhq521b": _3, "\u5E7F\u4E1C": _3, "xn--zfr164b": _3, "\u653F\u52A1": _3, "xyz": [1, { "botdash": _4, "telebit": _7 }], "yachts": _3, "yahoo": _3, "yamaxun": _3, "yandex": _3, "yodobashi": _3, "yoga": _3, "yokohama": _3, "you": _3, "youtube": _3, "yun": _3, "zappos": _3, "zara": _3, "zero": _3, "zip": _3, "zone": [1, { "cloud66": _4, "triton": _7, "stackit": _4, "lima": _4 }], "zuerich": _3 }];
        return rules2;
      }();
      function lookupInTrie(parts, trie, index, allowedMask) {
        let result = null;
        let node = trie;
        while (node !== void 0) {
          if ((node[0] & allowedMask) !== 0) {
            result = {
              index: index + 1,
              isIcann: node[0] === 1,
              isPrivate: node[0] === 2
            };
          }
          if (index === -1) {
            break;
          }
          const succ = node[1];
          node = Object.prototype.hasOwnProperty.call(succ, parts[index]) ? succ[parts[index]] : succ["*"];
          index -= 1;
        }
        return result;
      }
      function suffixLookup(hostname, options, out) {
        var _a;
        if (fastPathLookup(hostname, options, out)) {
          return;
        }
        const hostnameParts = hostname.split(".");
        const allowedMask = (options.allowPrivateDomains ? 2 : 0) | (options.allowIcannDomains ? 1 : 0);
        const exceptionMatch = lookupInTrie(hostnameParts, exceptions, hostnameParts.length - 1, allowedMask);
        if (exceptionMatch !== null) {
          out.isIcann = exceptionMatch.isIcann;
          out.isPrivate = exceptionMatch.isPrivate;
          out.publicSuffix = hostnameParts.slice(exceptionMatch.index + 1).join(".");
          return;
        }
        const rulesMatch = lookupInTrie(hostnameParts, rules, hostnameParts.length - 1, allowedMask);
        if (rulesMatch !== null) {
          out.isIcann = rulesMatch.isIcann;
          out.isPrivate = rulesMatch.isPrivate;
          out.publicSuffix = hostnameParts.slice(rulesMatch.index).join(".");
          return;
        }
        out.isIcann = false;
        out.isPrivate = false;
        out.publicSuffix = (_a = hostnameParts[hostnameParts.length - 1]) !== null && _a !== void 0 ? _a : null;
      }
      var RESULT = getEmptyResult();
      function parse2(url, options = {}) {
        return parseImpl(url, 5, suffixLookup, options, getEmptyResult());
      }
      function getHostname(url, options = {}) {
        resetResult(RESULT);
        return parseImpl(url, 0, suffixLookup, options, RESULT).hostname;
      }
      function getPublicSuffix(url, options = {}) {
        resetResult(RESULT);
        return parseImpl(url, 2, suffixLookup, options, RESULT).publicSuffix;
      }
      function getDomain2(url, options = {}) {
        resetResult(RESULT);
        return parseImpl(url, 3, suffixLookup, options, RESULT).domain;
      }
      function getSubdomain(url, options = {}) {
        resetResult(RESULT);
        return parseImpl(url, 4, suffixLookup, options, RESULT).subdomain;
      }
      function getDomainWithoutSuffix(url, options = {}) {
        resetResult(RESULT);
        return parseImpl(url, 5, suffixLookup, options, RESULT).domainWithoutSuffix;
      }
      exports2.getDomain = getDomain2;
      exports2.getDomainWithoutSuffix = getDomainWithoutSuffix;
      exports2.getHostname = getHostname;
      exports2.getPublicSuffix = getPublicSuffix;
      exports2.getSubdomain = getSubdomain;
      exports2.parse = parse2;
    }
  });

  // shared/js/ui/models/allowlist.js
  var require_allowlist2 = __commonJS({
    "shared/js/ui/models/allowlist.js"(exports2, module2) {
      "use strict";
      var Parent2 = window.DDG.base.Model;
      var tldts = require_cjs();
      function Allowlist(attrs) {
        attrs.list = {};
        Parent2.call(this, attrs);
        this.setAllowlistFromSettings();
      }
      Allowlist.prototype = window.$.extend({}, Parent2.prototype, {
        modelName: "allowlist",
        removeDomain(itemIndex) {
          const domain = this.list[itemIndex];
          console.log(`allowlist: remove ${domain}`);
          this.sendMessage("setList", {
            list: "allowlisted",
            domain,
            value: false
          });
          this.sendMessage("allowlistOptIn", {
            list: "allowlistOptIn",
            domain,
            value: false
          });
          this.list.splice(itemIndex, 1);
        },
        addDomain: function(url) {
          url = url ? url.replace(/^www\./, "") : "";
          const parsedDomain = tldts.parse(url);
          const localDomain = url.match(/^localhost(:[0-9]+)?$/i) ? "localhost" : null;
          const subDomain = parsedDomain.subdomain;
          const domain = localDomain || (parsedDomain.isIp ? parsedDomain.hostname : parsedDomain.domain);
          if (domain) {
            const domainToAllowlist = subDomain ? subDomain + "." + domain : domain;
            console.log(`allowlist: add ${domainToAllowlist}`);
            this.sendMessage("setList", {
              list: "allowlisted",
              domain: domainToAllowlist,
              value: true
            });
            this.setAllowlistFromSettings();
          }
          return domain;
        },
        setAllowlistFromSettings: function() {
          const self2 = this;
          this.sendMessage("getSetting", { name: "allowlisted" }).then((allowlist) => {
            allowlist = allowlist || {};
            const wlist = Object.keys(allowlist);
            wlist.sort();
            self2.set("list", wlist);
          });
        }
      });
      module2.exports = Allowlist;
    }
  });

  // shared/js/ui/templates/allowlist.js
  var require_allowlist3 = __commonJS({
    "shared/js/ui/templates/allowlist.js"(exports2, module2) {
      "use strict";
      var bel2 = require_browser();
      var allowlistItems = require_allowlist_items();
      var t2 = window.DDG.base.i18n.t;
      module2.exports = function() {
        return bel2`<section class="options-content__allowlist">
    <h2 class="menu-title">${t2("options:unprotectedSites.title")}</h2>
    <p class="menu-paragraph">${t2("options:unprotectedSitesDesc.title")}</p>
    <ul class="default-list js-allowlist-container">
        ${allowlistItems(this.model.list)}
    </ul>
    ${addToAllowlist()}
</section>`;
        function addToAllowlist() {
          return bel2`<div>
    <p class="allowlist-show-add js-allowlist-show-add">
        <a href="javascript:void(0)" role="button">${t2("options:addUnprotectedSite.title")}</a>
    </p>
    <input class="is-hidden allowlist-url float-left js-allowlist-url" type="text" placeholder="${t2("options:enterURL.title")}">
    <div class="is-hidden allowlist-add is-disabled float-right js-allowlist-add">${t2("shared:add.title")}</div>

    <div class="is-hidden modal-box js-allowlist-error float-right">
        <div class="modal-box__popout">
            <div class="modal-box__popout__body">
            </div>
        </div>
        <div class="modal-box__body">
            <span class="icon icon__error">
            </span>
            <span class="modal__body__text">
                ${t2("options:invalidURL.title")}
            </span>
        </div>
    </div>
</div>`;
        }
      };
    }
  });

  // shared/js/ui/views/user-data.js
  var require_user_data = __commonJS({
    "shared/js/ui/views/user-data.js"(exports2, module2) {
      "use strict";
      var Parent2 = window.DDG.base.View;
      function UserData(ops) {
        this.model = ops.model;
        this.pageView = ops.pageView;
        this.template = ops.template;
        Parent2.call(this, ops);
        this.setup();
      }
      UserData.prototype = window.$.extend({}, Parent2.prototype, {
        _logout: function(e) {
          e.preventDefault();
          this.model.logout();
        },
        setup: function() {
          this._cacheElems(".js-userdata", ["logout"]);
          this.bindEvents([
            [this.$logout, "click", this._logout],
            // listen for changes to the userData model
            [this.store.subscribe, "change:userData", this.rerender]
          ]);
        },
        rerender: function() {
          this.unbindEvents();
          this._rerender();
          this.setup();
        }
      });
      module2.exports = UserData;
    }
  });

  // shared/js/ui/models/user-data.js
  var require_user_data2 = __commonJS({
    "shared/js/ui/models/user-data.js"(exports2, module2) {
      "use strict";
      var Parent2 = window.DDG.base.Model;
      function UserData(attrs) {
        Parent2.call(this, attrs);
        this.setUserDataFromSettings();
      }
      UserData.prototype = window.$.extend({}, Parent2.prototype, {
        modelName: "userData",
        logout() {
          this.sendMessage("logout").then(() => this.set("userName", null));
        },
        setUserDataFromSettings: function() {
          this.sendMessage("getSetting", { name: "userData" }).then((data) => this.set("userName", data?.userName));
        }
      });
      module2.exports = UserData;
    }
  });

  // node_modules/webextension-polyfill/dist/browser-polyfill.js
  var require_browser_polyfill = __commonJS({
    "node_modules/webextension-polyfill/dist/browser-polyfill.js"(exports2, module2) {
      (function(global2, factory) {
        if (typeof define === "function" && define.amd) {
          define("webextension-polyfill", ["module"], factory);
        } else if (typeof exports2 !== "undefined") {
          factory(module2);
        } else {
          var mod = {
            exports: {}
          };
          factory(mod);
          global2.browser = mod.exports;
        }
      })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports2, function(module3) {
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
            const wrapMethod = (target, method2, wrapper) => {
              return new Proxy(method2, {
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
          module3.exports = wrapAPIs(chrome);
        } else {
          module3.exports = globalThis.browser;
        }
      });
    }
  });

  // shared/js/background/wrapper.js
  var wrapper_exports = {};
  __export(wrapper_exports, {
    changeTabURL: () => changeTabURL,
    createAlarm: () => createAlarm,
    executeScript: () => executeScript,
    getDDGTabUrls: () => getDDGTabUrls,
    getExtensionId: () => getExtensionId,
    getExtensionURL: () => getExtensionURL,
    getExtensionVersion: () => getExtensionVersion,
    getFromManagedStorage: () => getFromManagedStorage,
    getFromSessionStorage: () => getFromSessionStorage,
    getFromStorage: () => getFromStorage,
    getManifestVersion: () => getManifestVersion,
    insertCSS: () => insertCSS,
    mergeSavedSettings: () => mergeSavedSettings,
    normalizeTabData: () => normalizeTabData,
    openExtensionPage: () => openExtensionPage,
    removeFromSessionStorage: () => removeFromSessionStorage,
    sessionStorageFallback: () => sessionStorageFallback,
    setActionIcon: () => setActionIcon,
    setToSessionStorage: () => setToSessionStorage,
    setUninstallURL: () => setUninstallURL,
    syncToStorage: () => syncToStorage
  });
  function getExtensionURL(path) {
    return import_webextension_polyfill.default.runtime.getURL(path);
  }
  function getExtensionVersion() {
    const manifest = import_webextension_polyfill.default.runtime.getManifest();
    return manifest.version;
  }
  function openExtensionPage(path) {
    import_webextension_polyfill.default.tabs.create({ url: getExtensionURL(path) });
  }
  async function setActionIcon(iconPath, tabId) {
    if (typeof import_webextension_polyfill.default.action === "undefined") {
      return import_webextension_polyfill.default.browserAction.setIcon({ path: iconPath, tabId });
    }
    return import_webextension_polyfill.default.action.setIcon({ path: iconPath, tabId });
  }
  function getManifestVersion() {
    const manifest = import_webextension_polyfill.default.runtime.getManifest();
    return manifest.manifest_version;
  }
  function syncToStorage(data) {
    return import_webextension_polyfill.default.storage.local.set(data);
  }
  async function getFromStorage(key, cb) {
    const result = await import_webextension_polyfill.default.storage.local.get(key);
    return result[key];
  }
  async function getFromManagedStorage(keys, cb) {
    try {
      return await import_webextension_polyfill.default.storage.managed.get(keys);
    } catch (e) {
      console.log("get managed failed", e);
    }
    return {};
  }
  function getExtensionId() {
    return import_webextension_polyfill.default.runtime.id;
  }
  function normalizeTabData(tabData) {
    const tabId = "tabId" in tabData ? tabData.tabId : tabData.id;
    const url = tabData.url;
    const status = "status" in tabData ? tabData.status : null;
    const requestId = "requestId" in tabData ? tabData.requestId : void 0;
    return {
      tabId,
      url,
      requestId,
      status
    };
  }
  function mergeSavedSettings(settings14, results) {
    return Object.assign(settings14, results);
  }
  async function getDDGTabUrls() {
    const tabs = await import_webextension_polyfill.default.tabs.query({ url: "https://*.duckduckgo.com/*" }) || [];
    return tabs.map((tab) => tab.url);
  }
  function setUninstallURL(url) {
    import_webextension_polyfill.default.runtime.setUninstallURL(url);
  }
  function changeTabURL(tabId, url) {
    return import_webextension_polyfill.default.tabs.update(tabId, { url });
  }
  function convertScriptingAPIOptionsForTabsAPI(options) {
    if (typeof options !== "object") {
      throw new Error("Missing/invalid options Object.");
    }
    if (typeof options.file !== "undefined" || typeof options.frameId !== "undefined" || typeof options.runAt !== "undefined" || typeof options.allFrames !== "undefined" || typeof options.code !== "undefined") {
      throw new Error("Please provide options compatible with the (MV3) scripting API, instead of the (MV2) tabs API.");
    }
    if (typeof options.world !== "undefined") {
      throw new Error("World targetting not supported by MV2.");
    }
    const { allFrames, frameIds, tabId } = options.target;
    delete options.target;
    if (Array.isArray(frameIds) && frameIds.length > 0) {
      if (frameIds.length > 1) {
        throw new Error("Targetting multiple frames by ID not supported by MV2.");
      }
      options.frameId = frameIds[0];
    }
    if (typeof options.files !== "undefined") {
      if (Array.isArray(options.files) && options.files.length > 0) {
        if (options.files.length > 1) {
          throw new Error("Inserting multiple stylesheets/scripts in one go not supported by MV2.");
        }
        options.file = options.files[0];
      }
      delete options.files;
    }
    if (typeof allFrames !== "undefined") {
      options.allFrames = allFrames;
    }
    if (typeof options.injectImmediately !== "undefined") {
      if (options.injectImmediately) {
        options.runAt = "document_start";
      }
      delete options.injectImmediately;
    }
    let stringifiedArgs = "";
    if (typeof options.args !== "undefined") {
      if (Array.isArray(options.args)) {
        stringifiedArgs = "..." + JSON.stringify(options.args);
      }
      delete options.args;
    }
    if (typeof options.func !== "undefined") {
      if (typeof options.func === "function") {
        options.code = "(" + options.func.toString() + ")(" + stringifiedArgs + ")";
      }
      delete options.func;
    }
    return [tabId, options];
  }
  async function executeScript(options) {
    if (typeof import_webextension_polyfill.default.scripting === "undefined") {
      return await import_webextension_polyfill.default.tabs.executeScript(
        ...convertScriptingAPIOptionsForTabsAPI(options)
      );
    }
    return await import_webextension_polyfill.default.scripting.executeScript(options);
  }
  async function insertCSS(options) {
    if (typeof import_webextension_polyfill.default.scripting === "undefined") {
      return await import_webextension_polyfill.default.tabs.insertCSS(
        ...convertScriptingAPIOptionsForTabsAPI(options)
      );
    }
    return await import_webextension_polyfill.default.scripting.insertCSS(options);
  }
  async function setToSessionStorage(key, data) {
    if (typeof key !== "string") {
      throw new Error("Invalid storage key, string expected.");
    }
    if (sessionStorageSupported) {
      return await import_webextension_polyfill.default.storage.session.set({ [key]: data });
    }
    sessionStorageFallback.set(key, data);
  }
  async function getFromSessionStorage(key) {
    if (typeof key !== "string") {
      throw new Error("Invalid storage key, string expected.");
    }
    if (sessionStorageSupported) {
      const result = await import_webextension_polyfill.default.storage.session.get([key]);
      return result[key];
    }
    return sessionStorageFallback.get(key);
  }
  async function removeFromSessionStorage(key) {
    if (typeof key !== "string") {
      throw new Error("Invalid storage key, string expected.");
    }
    if (sessionStorageSupported) {
      return await import_webextension_polyfill.default.storage.session.remove(key);
    }
    return sessionStorageFallback.delete(key);
  }
  async function createAlarm(name, alarmInfo) {
    const existingAlarm = await import_webextension_polyfill.default.alarms.get(name);
    if (!existingAlarm) {
      return await import_webextension_polyfill.default.alarms.create(name, alarmInfo);
    }
  }
  var import_webextension_polyfill, sessionStorageSupported, sessionStorageFallback;
  var init_wrapper = __esm({
    "shared/js/background/wrapper.js"() {
      "use strict";
      import_webextension_polyfill = __toESM(require_browser_polyfill());
      sessionStorageSupported = typeof import_webextension_polyfill.default.storage.session !== "undefined";
      sessionStorageFallback = sessionStorageSupported ? null : /* @__PURE__ */ new Map();
    }
  });

  // shared/js/background/load.js
  var require_load = __commonJS({
    "shared/js/background/load.js"(exports2, module2) {
      "use strict";
      var browserWrapper5 = (init_wrapper(), __toCommonJS(wrapper_exports));
      function JSONfromLocalFile(path) {
        return loadExtensionFile({ url: path, returnType: "json" });
      }
      function JSONfromExternalFile(urlString) {
        return loadExtensionFile({ url: urlString, returnType: "json", source: "external" });
      }
      function url(urlString) {
        return loadExtensionFile({ url: urlString, source: "external" });
      }
      async function loadExtensionFile(params) {
        const headers = new Headers();
        let urlString = params.url;
        if (params.source === "external") {
          if (await browserWrapper5.getFromSessionStorage("dev")) {
            if (urlString.indexOf("?") > -1) {
              urlString += "&";
            } else {
              urlString += "?";
            }
            urlString += "test=1";
          }
          if (params.etag) {
            headers.append("If-None-Match", params.etag);
          }
        } else {
          urlString = browserWrapper5.getExtensionURL(urlString);
        }
        let rej;
        const timeoutPromise = new Promise((resolve, reject) => {
          rej = reject;
        });
        const fetchTimeout = setTimeout(rej, params.timeout || 3e4);
        const fetchResult = fetch(urlString, {
          method: "GET",
          headers
        }).then(async (response) => {
          clearTimeout(fetchTimeout);
          const status = response.status;
          const etag = response.headers.get("etag");
          const date = response.headers.get("Date");
          let data;
          if (status === 200) {
            if (params.returnType === "json") {
              data = await response.json();
            } else if (params.returnType === "arraybuffer") {
              data = await response.arrayBuffer();
            } else {
              data = await response.text();
            }
            return {
              status,
              date,
              etag,
              data
            };
          } else if (status === 304) {
            console.log(`${urlString} returned 304, resource not changed`);
            return {
              status,
              date,
              etag
            };
          } else {
            throw new Error(`${urlString} returned ${response.status}`);
          }
        });
        return Promise.race([timeoutPromise, fetchResult]);
      }
      module2.exports = {
        loadExtensionFile,
        JSONfromLocalFile,
        JSONfromExternalFile,
        url
      };
    }
  });

  // shared/data/defaultSettings.js
  var require_defaultSettings = __commonJS({
    "shared/data/defaultSettings.js"(exports2, module2) {
      "use strict";
      module2.exports = {
        httpsEverywhereEnabled: true,
        embeddedTweetsEnabled: false,
        GPC: true,
        youtubePreviewsEnabled: false,
        atb: null,
        set_atb: null,
        "config-etag": null,
        "httpsUpgradeBloomFilter-etag": null,
        "httpsDontUpgradeBloomFilters-etag": null,
        "httpsUpgradeList-etag": null,
        "httpsDontUpgradeList-etag": null,
        hasSeenPostInstall: false,
        extiSent: false,
        "tds-etag": null,
        lastTdsUpdate: 0,
        fireButtonClearHistoryEnabled: true,
        fireButtonTabClearEnabled: true
      };
    }
  });

  // shared/js/background/settings.js
  var require_settings = __commonJS({
    "shared/js/background/settings.js"(exports2, module2) {
      "use strict";
      var defaultSettings = require_defaultSettings();
      var browserWrapper5 = (init_wrapper(), __toCommonJS(wrapper_exports));
      var onSettingUpdate = new EventTarget();
      if (typeof CustomEvent === "undefined") globalThis.CustomEvent = Event;
      var MANAGED_SETTINGS = ["hasSeenPostInstall"];
      var settings14 = {};
      var isReady = false;
      var _ready = init().then(() => {
        isReady = true;
        console.log("Settings are loaded");
      });
      async function init() {
        buildSettingsFromDefaults();
        await buildSettingsFromManagedStorage();
        await buildSettingsFromLocalStorage();
      }
      function ready2() {
        return _ready;
      }
      function checkForLegacyKeys() {
        const legacyKeys = {
          // Keys to migrate
          whitelisted: "allowlisted",
          whitelistOptIn: "allowlistOptIn",
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
          "surrogates-etag": null,
          "brokenSiteList-etag": null,
          "surrogateList-etag": null,
          "trackersWhitelist-etag": null,
          "trackersWhitelistTemporary-etag": null
        };
        let syncNeeded = false;
        for (const legacyKey in legacyKeys) {
          const key = legacyKeys[legacyKey];
          if (!(legacyKey in settings14)) {
            continue;
          }
          syncNeeded = true;
          const legacyValue = settings14[legacyKey];
          if (key && legacyValue) {
            settings14[key] = legacyValue;
          }
          delete settings14[legacyKey];
        }
        if (syncNeeded) {
          syncSettingTolocalStorage();
        }
      }
      async function buildSettingsFromLocalStorage() {
        const results = await browserWrapper5.getFromStorage(["settings"]);
        if (!results) return;
        settings14 = browserWrapper5.mergeSavedSettings(settings14, results);
        checkForLegacyKeys();
      }
      async function buildSettingsFromManagedStorage() {
        const results = await browserWrapper5.getFromManagedStorage(MANAGED_SETTINGS);
        settings14 = browserWrapper5.mergeSavedSettings(settings14, results);
      }
      function buildSettingsFromDefaults() {
        settings14 = Object.assign({}, defaultSettings);
      }
      function syncSettingTolocalStorage() {
        return browserWrapper5.syncToStorage({ settings: settings14 });
      }
      function getSetting2(name) {
        if (!isReady) {
          console.warn(`Settings: getSetting() Settings not loaded: ${name}`);
          return;
        }
        if (name === "all") name = null;
        if (name) {
          return settings14[name];
        } else {
          return settings14;
        }
      }
      function updateSetting2(name, value) {
        if (!isReady) {
          console.warn(`Settings: updateSetting() Setting not loaded: ${name}`);
          return;
        }
        settings14[name] = value;
        syncSettingTolocalStorage().then(() => {
          onSettingUpdate.dispatchEvent(new CustomEvent(name, { detail: value }));
        });
      }
      function incrementNumericSetting(name, increment = 1) {
        if (!isReady) {
          console.warn("Settings: incrementNumericSetting() Setting not loaded:", name);
          return;
        }
        let value = settings14[name];
        if (typeof value !== "number" || isNaN(value)) {
          value = 0;
        }
        updateSetting2(name, value + increment);
      }
      function removeSetting(name) {
        if (!isReady) {
          console.warn(`Settings: removeSetting() Setting not loaded: ${name}`);
          return;
        }
        if (settings14[name]) {
          delete settings14[name];
          syncSettingTolocalStorage();
        }
      }
      function logSettings() {
        browserWrapper5.getFromStorage(["settings"]).then((s) => {
          console.log(s.settings);
        });
      }
      module2.exports = {
        getSetting: getSetting2,
        updateSetting: updateSetting2,
        incrementNumericSetting,
        removeSetting,
        logSettings,
        ready: ready2,
        onSettingUpdate
      };
    }
  });

  // shared/js/background/storage/tds.js
  var tds_exports = {};
  __export(tds_exports, {
    default: () => tds_default
  });
  var settings, listNames, tds_default;
  var init_tds = __esm({
    "shared/js/background/storage/tds.js"() {
      "use strict";
      settings = require_settings();
      listNames = ["tds", "surrogates", "config"];
      tds_default = {
        _config: { features: {} },
        _tds: { entities: {}, trackers: {}, domains: {}, cnames: {} },
        _surrogates: "",
        /** @type {import('@duckduckgo/privacy-configuration/schema/config').GenericV4Config} */
        get config() {
          return globalThis.components?.remoteConfig.config || this._config;
        },
        get tds() {
          return globalThis.components?.tds.tds.data || this._tds;
        },
        get surrogates() {
          return globalThis.components?.tds.surrogates.data || this._surrogates;
        },
        // these setters are to allow legacy tests to override the values here. In a running extension
        // these will have no effect
        set config(fallbackValue) {
          this._config = fallbackValue;
        },
        set tds(fallbackValue) {
          this._tds = fallbackValue;
        },
        set surrogates(fallbackValue) {
          this._surrogates = fallbackValue;
        },
        /** @type {TDSStorage?} */
        get tdsStorage() {
          return globalThis.components?.tds;
        },
        /**
         * @param {import('../components/resource-loader').ResourceName} configName
         * @param {import('../components/resource-loader').OnUpdatedCallback} cb
         */
        async onUpdate(configName, cb) {
          await settings.ready();
          if (listNames.includes(configName) && this.tdsStorage && this.tdsStorage[configName]) {
            this.tdsStorage[configName].onUpdate(cb);
          }
        },
        /**
         * @param {import('../components/resource-loader').ResourceName} [configName]
         * @returns {Promise}
         */
        async ready(configName) {
          await settings.ready();
          const tdsStorage2 = this.tdsStorage;
          if (!tdsStorage2) {
            return Promise.resolve();
          }
          if (configName && listNames.includes(configName)) {
            return tdsStorage2[configName].allLoadingFinished;
          }
          return Promise.all(listNames.map((n) => tdsStorage2[n].ready));
        },
        getSerializableList(name) {
          if (name === "tds") {
            const tds = globalThis.components.tds.tds;
            const listCopy = JSON.parse(JSON.stringify(tds.data));
            Object.values(listCopy.trackers).forEach((tracker) => {
              tracker.rules?.forEach((rule, i) => {
                const ruleRegexStr = tds.data.trackers[tracker.domain].rules[i].rule.toString();
                rule.rule = ruleRegexStr.slice(1, ruleRegexStr.length - 3);
              });
            });
            return listCopy;
          } else if (["surrogates", "config"].includes(name)) {
            return globalThis.components.tds[name].data;
          }
        },
        async getLists() {
          await this.ready();
          return [
            {
              name: "tds",
              data: this.tds
            },
            {
              name: "config",
              data: this.config
            },
            {
              name: "surrogates",
              data: this.surrogates
            }
          ];
        }
      };
    }
  });

  // shared/js/shared-utils/parse-user-agent-string.js
  var require_parse_user_agent_string = __commonJS({
    "shared/js/shared-utils/parse-user-agent-string.js"(exports2, module2) {
      "use strict";
      module2.exports = (uaString) => {
        if (!globalThis.navigator) return {};
        if (!uaString) uaString = globalThis.navigator.userAgent;
        let browser8;
        let version;
        try {
          let parsedUaParts = uaString.match(/(Firefox|Chrome|Edg)\/([0-9]+)/);
          const isEdge = /(Edge?)\/([0-9]+)/;
          const isOpera = /(OPR)\/([0-9]+)/;
          if (uaString.match(isEdge)) {
            parsedUaParts = uaString.match(isEdge);
          } else if (uaString.match(isOpera)) {
            parsedUaParts = uaString.match(isOpera);
            parsedUaParts[1] = "Opera";
          }
          browser8 = parsedUaParts[1];
          version = parsedUaParts[2];
          if (globalThis.navigator.brave) {
            browser8 = "Brave";
          }
        } catch (e) {
          browser8 = version = "";
        }
        let os = "o";
        if (globalThis.navigator.userAgent.indexOf("Windows") !== -1) os = "w";
        if (globalThis.navigator.userAgent.indexOf("Mac") !== -1) os = "m";
        if (globalThis.navigator.userAgent.indexOf("Linux") !== -1) os = "l";
        return {
          os,
          browser: browser8,
          version
        };
      };
    }
  });

  // shared/js/shared-utils/sha1.js
  var require_sha1 = __commonJS({
    "shared/js/shared-utils/sha1.js"(exports, module) {
      "use strict";
      (function() {
        "use strict";
        var root = typeof window === "object" ? window : {};
        var NODE_JS = !root.JS_SHA1_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node;
        if (NODE_JS) {
          root = global;
        }
        var COMMON_JS = !root.JS_SHA1_NO_COMMON_JS && typeof module === "object" && module.exports;
        var AMD = typeof define === "function" && define.amd;
        var HEX_CHARS = "0123456789abcdef".split("");
        var EXTRA = [-2147483648, 8388608, 32768, 128];
        var SHIFT = [24, 16, 8, 0];
        var OUTPUT_TYPES = ["hex", "array", "digest", "arrayBuffer"];
        var blocks = [];
        var createOutputMethod = function(outputType) {
          return function(message) {
            return new Sha1(true).update(message)[outputType]();
          };
        };
        var createMethod = function() {
          var method2 = createOutputMethod("hex");
          if (NODE_JS) {
            method2 = nodeWrap(method2);
          }
          method2.create = function() {
            return new Sha1();
          };
          method2.update = function(message) {
            return method2.create().update(message);
          };
          for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
            var type = OUTPUT_TYPES[i];
            method2[type] = createOutputMethod(type);
          }
          return method2;
        };
        var nodeWrap = function(method) {
          var crypto = eval("require('crypto')");
          var Buffer = eval("require('buffer').Buffer");
          var nodeMethod = function(message) {
            if (typeof message === "string") {
              return crypto.createHash("sha1").update(message, "utf8").digest("hex");
            } else if (message.constructor === ArrayBuffer) {
              message = new Uint8Array(message);
            } else if (message.length === void 0) {
              return method(message);
            }
            return crypto.createHash("sha1").update(new Buffer(message)).digest("hex");
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
          this.h0 = 1732584193;
          this.h1 = 4023233417;
          this.h2 = 2562383102;
          this.h3 = 271733878;
          this.h4 = 3285377520;
          this.block = this.start = this.bytes = this.hBytes = 0;
          this.finalized = this.hashed = false;
          this.first = true;
        }
        Sha1.prototype.update = function(message) {
          if (this.finalized) {
            return;
          }
          var notString = typeof message !== "string";
          if (notString && message.constructor === root.ArrayBuffer) {
            message = new Uint8Array(message);
          }
          var code, index = 0, i, length = message.length || 0, blocks2 = this.blocks;
          while (index < length) {
            if (this.hashed) {
              this.hashed = false;
              blocks2[0] = this.block;
              blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
            }
            if (notString) {
              for (i = this.start; index < length && i < 64; ++index) {
                blocks2[i >> 2] |= message[index] << SHIFT[i++ & 3];
              }
            } else {
              for (i = this.start; index < length && i < 64; ++index) {
                code = message.charCodeAt(index);
                if (code < 128) {
                  blocks2[i >> 2] |= code << SHIFT[i++ & 3];
                } else if (code < 2048) {
                  blocks2[i >> 2] |= (192 | code >> 6) << SHIFT[i++ & 3];
                  blocks2[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                } else if (code < 55296 || code >= 57344) {
                  blocks2[i >> 2] |= (224 | code >> 12) << SHIFT[i++ & 3];
                  blocks2[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[i++ & 3];
                  blocks2[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                } else {
                  code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
                  blocks2[i >> 2] |= (240 | code >> 18) << SHIFT[i++ & 3];
                  blocks2[i >> 2] |= (128 | code >> 12 & 63) << SHIFT[i++ & 3];
                  blocks2[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[i++ & 3];
                  blocks2[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                }
              }
            }
            this.lastByteIndex = i;
            this.bytes += i - this.start;
            if (i >= 64) {
              this.block = blocks2[16];
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
        Sha1.prototype.finalize = function() {
          if (this.finalized) {
            return;
          }
          this.finalized = true;
          var blocks2 = this.blocks, i = this.lastByteIndex;
          blocks2[16] = this.block;
          blocks2[i >> 2] |= EXTRA[i & 3];
          this.block = blocks2[16];
          if (i >= 56) {
            if (!this.hashed) {
              this.hash();
            }
            blocks2[0] = this.block;
            blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
          }
          blocks2[14] = this.hBytes << 3 | this.bytes >>> 29;
          blocks2[15] = this.bytes << 3;
          this.hash();
        };
        Sha1.prototype.hash = function() {
          var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4;
          var f, j, t2, blocks2 = this.blocks;
          for (j = 16; j < 80; ++j) {
            t2 = blocks2[j - 3] ^ blocks2[j - 8] ^ blocks2[j - 14] ^ blocks2[j - 16];
            blocks2[j] = t2 << 1 | t2 >>> 31;
          }
          for (j = 0; j < 20; j += 5) {
            f = b & c | ~b & d;
            t2 = a << 5 | a >>> 27;
            e = t2 + f + e + 1518500249 + blocks2[j] << 0;
            b = b << 30 | b >>> 2;
            f = a & b | ~a & c;
            t2 = e << 5 | e >>> 27;
            d = t2 + f + d + 1518500249 + blocks2[j + 1] << 0;
            a = a << 30 | a >>> 2;
            f = e & a | ~e & b;
            t2 = d << 5 | d >>> 27;
            c = t2 + f + c + 1518500249 + blocks2[j + 2] << 0;
            e = e << 30 | e >>> 2;
            f = d & e | ~d & a;
            t2 = c << 5 | c >>> 27;
            b = t2 + f + b + 1518500249 + blocks2[j + 3] << 0;
            d = d << 30 | d >>> 2;
            f = c & d | ~c & e;
            t2 = b << 5 | b >>> 27;
            a = t2 + f + a + 1518500249 + blocks2[j + 4] << 0;
            c = c << 30 | c >>> 2;
          }
          for (; j < 40; j += 5) {
            f = b ^ c ^ d;
            t2 = a << 5 | a >>> 27;
            e = t2 + f + e + 1859775393 + blocks2[j] << 0;
            b = b << 30 | b >>> 2;
            f = a ^ b ^ c;
            t2 = e << 5 | e >>> 27;
            d = t2 + f + d + 1859775393 + blocks2[j + 1] << 0;
            a = a << 30 | a >>> 2;
            f = e ^ a ^ b;
            t2 = d << 5 | d >>> 27;
            c = t2 + f + c + 1859775393 + blocks2[j + 2] << 0;
            e = e << 30 | e >>> 2;
            f = d ^ e ^ a;
            t2 = c << 5 | c >>> 27;
            b = t2 + f + b + 1859775393 + blocks2[j + 3] << 0;
            d = d << 30 | d >>> 2;
            f = c ^ d ^ e;
            t2 = b << 5 | b >>> 27;
            a = t2 + f + a + 1859775393 + blocks2[j + 4] << 0;
            c = c << 30 | c >>> 2;
          }
          for (; j < 60; j += 5) {
            f = b & c | b & d | c & d;
            t2 = a << 5 | a >>> 27;
            e = t2 + f + e - 1894007588 + blocks2[j] << 0;
            b = b << 30 | b >>> 2;
            f = a & b | a & c | b & c;
            t2 = e << 5 | e >>> 27;
            d = t2 + f + d - 1894007588 + blocks2[j + 1] << 0;
            a = a << 30 | a >>> 2;
            f = e & a | e & b | a & b;
            t2 = d << 5 | d >>> 27;
            c = t2 + f + c - 1894007588 + blocks2[j + 2] << 0;
            e = e << 30 | e >>> 2;
            f = d & e | d & a | e & a;
            t2 = c << 5 | c >>> 27;
            b = t2 + f + b - 1894007588 + blocks2[j + 3] << 0;
            d = d << 30 | d >>> 2;
            f = c & d | c & e | d & e;
            t2 = b << 5 | b >>> 27;
            a = t2 + f + a - 1894007588 + blocks2[j + 4] << 0;
            c = c << 30 | c >>> 2;
          }
          for (; j < 80; j += 5) {
            f = b ^ c ^ d;
            t2 = a << 5 | a >>> 27;
            e = t2 + f + e - 899497514 + blocks2[j] << 0;
            b = b << 30 | b >>> 2;
            f = a ^ b ^ c;
            t2 = e << 5 | e >>> 27;
            d = t2 + f + d - 899497514 + blocks2[j + 1] << 0;
            a = a << 30 | a >>> 2;
            f = e ^ a ^ b;
            t2 = d << 5 | d >>> 27;
            c = t2 + f + c - 899497514 + blocks2[j + 2] << 0;
            e = e << 30 | e >>> 2;
            f = d ^ e ^ a;
            t2 = c << 5 | c >>> 27;
            b = t2 + f + b - 899497514 + blocks2[j + 3] << 0;
            d = d << 30 | d >>> 2;
            f = c ^ d ^ e;
            t2 = b << 5 | b >>> 27;
            a = t2 + f + a - 899497514 + blocks2[j + 4] << 0;
            c = c << 30 | c >>> 2;
          }
          this.h0 = this.h0 + a << 0;
          this.h1 = this.h1 + b << 0;
          this.h2 = this.h2 + c << 0;
          this.h3 = this.h3 + d << 0;
          this.h4 = this.h4 + e << 0;
        };
        Sha1.prototype.hex = function() {
          this.finalize();
          var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4;
          return HEX_CHARS[h0 >> 28 & 15] + HEX_CHARS[h0 >> 24 & 15] + HEX_CHARS[h0 >> 20 & 15] + HEX_CHARS[h0 >> 16 & 15] + HEX_CHARS[h0 >> 12 & 15] + HEX_CHARS[h0 >> 8 & 15] + HEX_CHARS[h0 >> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h1 >> 28 & 15] + HEX_CHARS[h1 >> 24 & 15] + HEX_CHARS[h1 >> 20 & 15] + HEX_CHARS[h1 >> 16 & 15] + HEX_CHARS[h1 >> 12 & 15] + HEX_CHARS[h1 >> 8 & 15] + HEX_CHARS[h1 >> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h2 >> 28 & 15] + HEX_CHARS[h2 >> 24 & 15] + HEX_CHARS[h2 >> 20 & 15] + HEX_CHARS[h2 >> 16 & 15] + HEX_CHARS[h2 >> 12 & 15] + HEX_CHARS[h2 >> 8 & 15] + HEX_CHARS[h2 >> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h3 >> 28 & 15] + HEX_CHARS[h3 >> 24 & 15] + HEX_CHARS[h3 >> 20 & 15] + HEX_CHARS[h3 >> 16 & 15] + HEX_CHARS[h3 >> 12 & 15] + HEX_CHARS[h3 >> 8 & 15] + HEX_CHARS[h3 >> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h4 >> 28 & 15] + HEX_CHARS[h4 >> 24 & 15] + HEX_CHARS[h4 >> 20 & 15] + HEX_CHARS[h4 >> 16 & 15] + HEX_CHARS[h4 >> 12 & 15] + HEX_CHARS[h4 >> 8 & 15] + HEX_CHARS[h4 >> 4 & 15] + HEX_CHARS[h4 & 15];
        };
        Sha1.prototype.toString = Sha1.prototype.hex;
        Sha1.prototype.digest = function() {
          this.finalize();
          var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4;
          return [
            h0 >> 24 & 255,
            h0 >> 16 & 255,
            h0 >> 8 & 255,
            h0 & 255,
            h1 >> 24 & 255,
            h1 >> 16 & 255,
            h1 >> 8 & 255,
            h1 & 255,
            h2 >> 24 & 255,
            h2 >> 16 & 255,
            h2 >> 8 & 255,
            h2 & 255,
            h3 >> 24 & 255,
            h3 >> 16 & 255,
            h3 >> 8 & 255,
            h3 & 255,
            h4 >> 24 & 255,
            h4 >> 16 & 255,
            h4 >> 8 & 255,
            h4 & 255
          ];
        };
        Sha1.prototype.array = Sha1.prototype.digest;
        Sha1.prototype.arrayBuffer = function() {
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
            define(function() {
              return exports;
            });
          }
        }
      })();
    }
  });

  // shared/js/background/utils.js
  var utils_exports = {};
  __export(utils_exports, {
    brokenListIndex: () => brokenListIndex,
    daysInstalled: () => daysInstalled,
    extractHostFromURL: () => extractHostFromURL,
    extractLimitedDomainFromURL: () => extractLimitedDomainFromURL,
    extractTopSubdomainFromHost: () => extractTopSubdomainFromHost,
    findParent: () => findParent,
    findParentDisplayName: () => findParentDisplayName,
    getAsyncBlockingSupport: () => getAsyncBlockingSupport,
    getBaseDomain: () => getBaseDomain,
    getBrokenScriptLists: () => getBrokenScriptLists,
    getBrowserName: () => getBrowserName,
    getCurrentTab: () => getCurrentTab,
    getEnabledFeatures: () => getEnabledFeatures,
    getEnabledFeaturesAboutBlank: () => getEnabledFeaturesAboutBlank,
    getFeatureSettings: () => getFeatureSettings,
    getInstallTimestamp: () => getInstallTimestamp,
    getOsName: () => getOsName,
    getSessionKey: () => getSessionKey,
    getURLWithoutQueryString: () => getURLWithoutQueryString,
    getUpgradeToSecureSupport: () => getUpgradeToSecureSupport,
    isBroken: () => isBroken,
    isCookieExcluded: () => isCookieExcluded,
    isFeatureEnabled: () => isFeatureEnabled,
    isInstalledWithinDays: () => isInstalledWithinDays,
    isRedirect: () => isRedirect,
    isSafeListed: () => isSafeListed,
    isSameTopLevelDomain: () => isSameTopLevelDomain,
    parseVersionString: () => parseVersionString,
    reloadCurrentTab: () => reloadCurrentTab,
    removeBroken: () => removeBroken,
    resetSessionKey: () => resetSessionKey,
    resolveAfterDelay: () => resolveAfterDelay,
    satisfiesMinVersion: () => satisfiesMinVersion,
    sendAllTabsMessage: () => sendAllTabsMessage,
    sendTabMessage: () => sendTabMessage
  });
  function getRandomFloat() {
    return crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
  }
  async function getSessionKey() {
    let sessionKey = await getFromSessionStorage("sessionKey");
    if (!sessionKey) {
      sessionKey = await resetSessionKey();
    }
    return sessionKey;
  }
  async function resetSessionKey() {
    const sessionKey = (0, import_sha1.default)(getRandomFloat().toString());
    await setToSessionStorage("sessionKey", sessionKey);
    return sessionKey;
  }
  async function sendTabMessage(id, message, details) {
    try {
      await import_webextension_polyfill2.default.tabs.sendMessage(id, message, details);
    } catch {
    }
  }
  async function sendAllTabsMessage(message, details) {
    try {
      for (const { id: tabId } of await import_webextension_polyfill2.default.tabs.query({})) {
        sendTabMessage(tabId, message, details);
      }
    } catch {
    }
  }
  function getBaseDomain(urlString) {
    const parsedUrl = (0, import_tldts.parse)(urlString, { allowPrivateDomains: true });
    if (parsedUrl.hostname === "localhost" || parsedUrl.hostname?.endsWith(".localhost") || parsedUrl.isIp) {
      return parsedUrl.hostname;
    }
    return parsedUrl.domain;
  }
  function extractHostFromURL(url, shouldKeepWWW) {
    if (!url) return "";
    if (url.startsWith("about:") && url[6] !== "/") {
      url = "about://" + url.substr(6);
    }
    const urlObj = (0, import_tldts.parse)(url);
    let hostname = urlObj.hostname || "";
    if (!shouldKeepWWW) {
      hostname = hostname.replace(/^www\./, "");
    }
    return hostname;
  }
  function extractLimitedDomainFromURL(url, { keepSubdomains } = {}) {
    if (!url) return void 0;
    try {
      const parsedURL = new URL(url);
      const tld = (0, import_tldts.parse)(url);
      if (!parsedURL || !tld) return "";
      let finalURL = tld.domain || tld.hostname;
      if (keepSubdomains) {
        finalURL = tld.hostname;
      } else if (tld.subdomain && tld.subdomain.toLowerCase() === "www") {
        finalURL = "www." + tld.domain;
      }
      const port = parsedURL.port ? `:${parsedURL.port}` : "";
      return `${parsedURL.protocol}//${finalURL}${port}/`;
    } catch (e) {
      return void 0;
    }
  }
  function extractTopSubdomainFromHost(host) {
    if (typeof host !== "string") return false;
    const rgx = /\./g;
    if (host.match(rgx) && host.match(rgx).length > 1) {
      return host.split(".")[0];
    }
    return false;
  }
  function findParent(url) {
    const parts = extractHostFromURL(url).split(".");
    while (parts.length > 1) {
      const joinURL = parts.join(".");
      if (tds_default.tds.trackers[joinURL]?.owner?.ownedBy) {
        return tds_default.tds.trackers[joinURL].owner.ownedBy;
      } else if (tds_default.tds.domains[joinURL]) {
        return tds_default.tds.domains[joinURL];
      }
      parts.shift();
    }
  }
  function findParentDisplayName(url) {
    const parent2 = findParent(url);
    const entity = tds_default.tds.entities[parent2];
    if (entity && entity.displayName) {
      return entity.displayName;
    }
    return "unknown";
  }
  async function getCurrentTab() {
    const tabId = await getFromSessionStorage("currentTabId");
    if (tabId) {
      try {
        return await import_webextension_polyfill2.default.tabs.get(tabId);
      } catch (e) {
      }
    }
    const tabData = await import_webextension_polyfill2.default.tabs.query({
      active: true,
      lastFocusedWindow: true
    });
    if (tabData.length) {
      return tabData[0];
    }
  }
  function getBrowserName() {
    if (!browserInfo || !browserInfo.browser) return;
    let browserName2 = browserInfo.browser.toLowerCase();
    if (browserName2 === "firefox") browserName2 = "moz";
    return browserName2;
  }
  function getOsName() {
    if (!browserInfo || !browserInfo.os) return;
    return browserInfo.os;
  }
  function getUpgradeToSecureSupport() {
    let canUpgrade = false;
    if (getBrowserName() !== "moz") return canUpgrade;
    if (browserInfo && browserInfo.version >= 59) {
      canUpgrade = true;
    }
    return canUpgrade;
  }
  function getAsyncBlockingSupport() {
    const browserName2 = getBrowserName();
    if (browserName2 === "moz" && browserInfo && browserInfo.version >= 52) {
      return true;
    } else if (["edg", "edge", "brave", "chrome"].includes(browserName2)) {
      return false;
    }
    console.warn(`Unrecognized browser "${browserName2}" - async response disallowed`);
    return false;
  }
  function isRedirect(statusCode) {
    return statusCode >= 300 && statusCode <= 399;
  }
  function isBroken(url) {
    if (!tds_default?.config.unprotectedTemporary) return;
    return brokenListIndex(url, tds_default?.config.unprotectedTemporary) !== -1;
  }
  function removeBroken(domain, config = tds_default.config) {
    const index = brokenListIndex(domain, config.unprotectedTemporary);
    if (index !== -1) {
      console.log("remove", config.unprotectedTemporary.splice(index, 1));
    }
  }
  function getEnabledFeaturesAboutBlank(url) {
    if (!tds_default.config.features) return [];
    const enabledFeatures = [];
    for (const feature in tds_default.config.features) {
      const featureSettings = getFeatureSettings(feature);
      if (featureSettings.aboutBlankEnabled !== "disabled" && brokenListIndex(url, featureSettings.aboutBlankSites || []) === -1) {
        enabledFeatures.push(feature);
      }
    }
    return enabledFeatures;
  }
  function getEnabledFeatures(url) {
    if (!tds_default.config.features) return [];
    const enabledFeatures = [];
    for (const feature in tds_default.config.features) {
      if (isFeatureEnabled(feature) && brokenListIndex(url, tds_default.config.features[feature].exceptions || []) === -1) {
        enabledFeatures.push(feature);
      }
    }
    return enabledFeatures;
  }
  function brokenListIndex(url, list) {
    const parsedDomain = (0, import_tldts.parse)(url);
    const hostname = parsedDomain.hostname || url;
    return list.findIndex((brokenSiteDomain) => {
      if (brokenSiteDomain.domain) {
        return hostname === brokenSiteDomain.domain || hostname.endsWith(`.${brokenSiteDomain.domain}`);
      }
      return false;
    });
  }
  function getBrokenScriptLists() {
    const brokenScripts = {};
    for (const key in tds_default.config.features) {
      const featureSettings = getFeatureSettings(key);
      brokenScripts[key] = featureSettings.scripts?.map((obj) => obj.domain) || [];
    }
    return brokenScripts;
  }
  function isSafeListed(url) {
    const hostname = extractHostFromURL(url);
    const safeList = import_settings.default.getSetting("allowlisted");
    const subdomains = hostname.split(".");
    while (subdomains.length > 1) {
      if (safeList && safeList[subdomains.join(".")]) {
        return true;
      }
      subdomains.shift();
    }
    if (isBroken(hostname)) {
      return true;
    }
    return false;
  }
  function isCookieExcluded(url) {
    const domain = new URL(url).host;
    return isDomainCookieExcluded(domain);
  }
  function isDomainCookieExcluded(domain) {
    const cookieSettings = getFeatureSettings("cookie");
    if (!cookieSettings || !cookieSettings.excludedCookieDomains) {
      return false;
    }
    if (cookieSettings.excludedCookieDomains.find((elem) => elem.domain === domain)) {
      return true;
    }
    const comps = domain.split(".");
    if (comps.length > 2) {
      comps.shift();
      return isDomainCookieExcluded(comps.join("."));
    }
    return false;
  }
  function isSameTopLevelDomain(url1, url2) {
    const first = getBaseDomain(url1);
    const second = getBaseDomain(url2);
    if (!first || !second) {
      return false;
    }
    return first === second;
  }
  function parseVersionString(versionString) {
    return versionString.split(".").map(Number);
  }
  function satisfiesMinVersion(minVersionString, extensionVersionString) {
    const minVersions = parseVersionString(minVersionString);
    const currentVersions = parseVersionString(extensionVersionString);
    const maxLength = Math.max(minVersions.length, currentVersions.length);
    for (let i = 0; i < maxLength; i++) {
      const minNumberPart = minVersions[i] || 0;
      const currentVersionPart = currentVersions[i] || 0;
      if (currentVersionPart > minNumberPart) {
        return true;
      }
      if (currentVersionPart < minNumberPart) {
        return false;
      }
    }
    return true;
  }
  function isFeatureEnabled(featureName, config = tds_default.config) {
    const feature = config.features[featureName];
    if (!feature) {
      return false;
    }
    if ("minSupportedVersion" in feature) {
      const extensionVersionString = getExtensionVersion();
      if (!satisfiesMinVersion(feature.minSupportedVersion, extensionVersionString)) {
        return false;
      }
    }
    return feature.state === "enabled";
  }
  function getFeatureSettings(featureName, config = tds_default.config) {
    const feature = config.features[featureName];
    if (typeof feature !== "object" || feature === null || !feature.settings) {
      return {};
    }
    return feature.settings;
  }
  function getURLWithoutQueryString(urlString) {
    return urlString?.split("?")[0];
  }
  async function reloadCurrentTab() {
    const tab = await getCurrentTab();
    if (tab && tab.id) {
      await import_webextension_polyfill2.default.tabs.reload(tab.id);
    }
  }
  function getInstallTimestamp(atb) {
    const match = atb.match(/^v?(\d+)-(\d)(.+)?$/i);
    if (!match) return null;
    const startDate = 1456272e6;
    const weeksSince = (parseInt(match[1], 10) - 1) * 7 * dayMultiplier;
    const daysSince = (parseInt(match[2], 10) - 1) * dayMultiplier;
    const installTimestamp = new Date(startDate + weeksSince + daysSince).getTime();
    return isNaN(installTimestamp) ? null : installTimestamp;
  }
  function isInstalledWithinDays(numberOfDays, fromDate = Date.now(), atb = import_settings.default.getSetting("atb")) {
    return daysInstalled(fromDate, atb) <= numberOfDays;
  }
  function daysInstalled(fromDate = Date.now(), atb = import_settings.default.getSetting("atb")) {
    if (!atb) return NaN;
    const installTimestamp = getInstallTimestamp(atb);
    if (!installTimestamp) return NaN;
    return (fromDate - installTimestamp) / dayMultiplier;
  }
  function resolveAfterDelay(delay) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }
  var import_webextension_polyfill2, import_settings, import_tldts, import_parse_user_agent_string, import_sha1, browserInfo, dayMultiplier;
  var init_utils = __esm({
    "shared/js/background/utils.js"() {
      "use strict";
      import_webextension_polyfill2 = __toESM(require_browser_polyfill());
      init_wrapper();
      init_tds();
      import_settings = __toESM(require_settings());
      import_tldts = __toESM(require_cjs());
      import_parse_user_agent_string = __toESM(require_parse_user_agent_string());
      import_sha1 = __toESM(require_sha1());
      browserInfo = (0, import_parse_user_agent_string.default)();
      dayMultiplier = 24 * 60 * 60 * 1e3;
    }
  });

  // shared/js/background/pixels.js
  var pixels_exports = {};
  __export(pixels_exports, {
    getURL: () => getURL,
    sendPixelRequest: () => sendPixelRequest
  });
  function getURL(pixelName) {
    if (!pixelName) throw new Error("pixelName is required");
    const url = "https://improving.duckduckgo.com/t/";
    return url + pixelName;
  }
  function sendPixelRequest(pixelName, params = {}) {
    if (false) {
      return;
    }
    const browserName2 = getBrowserName() || "unknown";
    const randomNum = Math.ceil(Math.random() * 1e7);
    const searchParams = new URLSearchParams(Object.entries(params));
    const url = getURL(`${pixelName}_extension_${browserName2}`) + `?${randomNum}&${searchParams.toString()}`;
    return import_load.default.url(url);
  }
  var import_load;
  var init_pixels = __esm({
    "shared/js/background/pixels.js"() {
      "use strict";
      import_load = __toESM(require_load());
      init_utils();
    }
  });

  // shared/js/background/click-to-load.js
  function getDefaultEnabledClickToLoadRuleActionsForTab(tab) {
    if (!tab?.site?.isFeatureEnabled("clickToLoad")) {
      return [];
    }
    const clickToLoadSettings = tds_default?.config?.features?.clickToLoad?.settings;
    if (!clickToLoadSettings) {
      console.warn("Click to Load configuration not ready yet, skipped.");
      return [];
    }
    const enabledRuleActions = [];
    const { parentEntity } = tab.site;
    for (const [entity, { ruleActions, state }] of Object.entries(clickToLoadSettings)) {
      if (!ruleActions || ruleActions.length === 0 || state !== "enabled") {
        continue;
      }
      if (parentEntity !== entity) {
        enabledRuleActions.push(...ruleActions);
      }
    }
    return enabledRuleActions;
  }
  var init_click_to_load = __esm({
    "shared/js/background/click-to-load.js"() {
      "use strict";
      init_tds();
      init_utils();
    }
  });

  // shared/js/background/dnr-session-rule-id.js
  var dnr_session_rule_id_exports = {};
  __export(dnr_session_rule_id_exports, {
    flushSessionRules: () => flushSessionRules,
    getNextSessionRuleId: () => getNextSessionRuleId,
    setSessionRuleOffsetFromStorage: () => setSessionRuleOffsetFromStorage
  });
  async function setSessionRuleOffsetFromStorage() {
    const offset = await getFromSessionStorage(SESSION_RULE_STORAGE_KEY);
    if (offset) {
      sessionRuleOffset = offset;
    }
    ready = true;
  }
  function getNextSessionRuleId() {
    if (!ready) {
      console.warn("Tried to get session rule id before reading offset from storage");
      return null;
    }
    const nextRuleId = SESSION_RULE_ID_START + sessionRuleOffset;
    sessionRuleOffset += 1;
    setToSessionStorage(SESSION_RULE_STORAGE_KEY, sessionRuleOffset);
    return nextRuleId;
  }
  function isValidSessionId(id) {
    return id >= SESSION_RULE_ID_START;
  }
  function flushSessionRules() {
    return chrome.declarativeNetRequest.getSessionRules().then((rules) => {
      const ruleIds = rules.map(({ id }) => id).filter(isValidSessionId);
      if (ruleIds.length) {
        return chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: ruleIds });
      }
    });
  }
  var SESSION_RULE_ID_START, SESSION_RULE_STORAGE_KEY, sessionRuleOffset, ready;
  var init_dnr_session_rule_id = __esm({
    "shared/js/background/dnr-session-rule-id.js"() {
      "use strict";
      init_wrapper();
      SESSION_RULE_ID_START = 1e5;
      SESSION_RULE_STORAGE_KEY = "sessionRuleOffset";
      sessionRuleOffset = 0;
      ready = false;
    }
  });

  // shared/js/background/dnr-click-to-load.js
  var dnr_click_to_load_exports = {};
  __export(dnr_click_to_load_exports, {
    clearClickToLoadDnrRulesForTab: () => clearClickToLoadDnrRulesForTab,
    ensureClickToLoadRuleActionDisabled: () => ensureClickToLoadRuleActionDisabled,
    restoreDefaultClickToLoadRuleActions: () => restoreDefaultClickToLoadRuleActions
  });
  async function generateDnrAllowingRules(tab, ruleAction) {
    const existingRuleIds = tab.dnrRuleIdsByDisabledClickToLoadRuleAction[ruleAction];
    if (existingRuleIds && existingRuleIds.length > 0) {
      return [];
    }
    await import_settings2.default.ready();
    const allowingDnrRulesByClickToLoadRuleAction = import_settings2.default.getSetting("allowingDnrRulesByClickToLoadRuleAction");
    if (!allowingDnrRulesByClickToLoadRuleAction) {
      console.warn("Failed to load Click to Load allowing rules.");
      return [];
    }
    let allowingRules = allowingDnrRulesByClickToLoadRuleAction[ruleAction];
    if (!allowingRules) {
      console.warn(`No Click to Load allowing rules for action ${ruleAction}.`);
      return [];
    }
    const ruleIds = [];
    allowingRules = JSON.parse(JSON.stringify(allowingRules));
    for (const rule of allowingRules) {
      const ruleId = getNextSessionRuleId();
      if (typeof ruleId !== "number") {
        continue;
      }
      rule.id = ruleId;
      ruleIds.push(ruleId);
      rule.condition.tabIds = [tab.id];
    }
    if (ruleIds.length > 0) {
      tab.dnrRuleIdsByDisabledClickToLoadRuleAction[ruleAction] = ruleIds;
    }
    return allowingRules;
  }
  async function restoreDefaultClickToLoadRuleActions(tab) {
    const addRules = [];
    const removeRuleIds = [];
    await import_settings2.default.ready();
    const allowingDnrRulesByClickToLoadRuleAction = import_settings2.default.getSetting("allowingDnrRulesByClickToLoadRuleAction");
    if (!allowingDnrRulesByClickToLoadRuleAction) {
      console.warn("Click to Load DNR rules are not known yet, skipping.");
      return;
    }
    const disabledRuleActions = new Set(Object.keys(allowingDnrRulesByClickToLoadRuleAction));
    await tds_default.ready("config");
    for (const ruleAction of getDefaultEnabledClickToLoadRuleActionsForTab(tab)) {
      disabledRuleActions.delete(ruleAction);
    }
    if (!tab) {
      return;
    }
    for (const disabledRuleAction of Object.keys(tab.dnrRuleIdsByDisabledClickToLoadRuleAction)) {
      if (disabledRuleActions.has(disabledRuleAction)) {
        disabledRuleActions.delete(disabledRuleAction);
      } else {
        for (const ruleId of tab.dnrRuleIdsByDisabledClickToLoadRuleAction[disabledRuleAction]) {
          removeRuleIds.push(ruleId);
        }
        delete tab.dnrRuleIdsByDisabledClickToLoadRuleAction[disabledRuleAction];
      }
    }
    for (const disabledRuleAction of disabledRuleActions) {
      addRules.push(...await generateDnrAllowingRules(tab, disabledRuleAction));
    }
    if (addRules.length > 0 || removeRuleIds.length > 0) {
      return await chrome.declarativeNetRequest.updateSessionRules({ addRules, removeRuleIds });
    }
  }
  async function ensureClickToLoadRuleActionDisabled(ruleAction, tab) {
    const addRules = await generateDnrAllowingRules(tab, ruleAction);
    if (addRules.length > 0) {
      return await chrome.declarativeNetRequest.updateSessionRules({ addRules });
    }
  }
  async function clearClickToLoadDnrRulesForTab(tab) {
    const removeRuleIds = Array.prototype.concat(...Object.values(tab.dnrRuleIdsByDisabledClickToLoadRuleAction));
    if (removeRuleIds.length > 0) {
      return await chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds });
    }
  }
  var import_settings2;
  var init_dnr_click_to_load = __esm({
    "shared/js/background/dnr-click-to-load.js"() {
      "use strict";
      init_click_to_load();
      init_dnr_session_rule_id();
      import_settings2 = __toESM(require_settings());
      init_tds();
    }
  });

  // shared/js/background/i18n.js
  function getUserLocale() {
    if (!import_webextension_polyfill3.default?.i18n) {
      return "en";
    }
    const lang = import_webextension_polyfill3.default.i18n.getUILanguage().slice(0, 2);
    if (["nn", "no"].includes(lang)) {
      return "nb";
    }
    return lang;
  }
  function getFullUserLocale() {
    if (!import_webextension_polyfill3.default?.i18n) {
      return "en-US";
    }
    return import_webextension_polyfill3.default.i18n.getUILanguage();
  }
  var import_webextension_polyfill3;
  var init_i18n = __esm({
    "shared/js/background/i18n.js"() {
      "use strict";
      import_webextension_polyfill3 = __toESM(require_browser_polyfill());
    }
  });

  // shared/js/background/classes/top-blocked.js
  var require_top_blocked = __commonJS({
    "shared/js/background/classes/top-blocked.js"(exports2, module2) {
      "use strict";
      var TopBlocked = class {
        constructor() {
          this.data = [];
        }
        add(el) {
          this.data.push(el);
        }
        getTop(n, sortFunc) {
          this.sort(sortFunc);
          n = n || 10;
          return this.data.slice(0, n);
        }
        sort(sortFunc) {
          this.data.sort(sortFunc);
        }
        clear() {
          this.data = [];
        }
        setData(data) {
          this.data = data;
        }
      };
      module2.exports = TopBlocked;
    }
  });

  // shared/js/background/classes/company.js
  var require_company = __commonJS({
    "shared/js/background/classes/company.js"(exports2, module2) {
      "use strict";
      var Company = class {
        constructor(c) {
          this.name = c.name;
          this.count = 0;
          this.pagesSeenOn = 0;
          this.displayName = c.displayName || c.name;
        }
        incrementCount() {
          this.count += 1;
        }
        incrementPagesSeenOn() {
          this.pagesSeenOn += 1;
        }
        get(property) {
          return this[property];
        }
        set(property, val) {
          this[property] = val;
        }
      };
      module2.exports = Company;
    }
  });

  // shared/js/background/popup-messaging.js
  var popup_messaging_exports = {};
  __export(popup_messaging_exports, {
    getActivePort: () => getActivePort,
    postPopupMessage: () => postPopupMessage,
    setActivePort: () => setActivePort
  });
  function getActivePort() {
    return activePort;
  }
  function setActivePort(port) {
    activePort = port;
  }
  function postPopupMessage(message) {
    activePort?.postMessage(message);
  }
  var activePort;
  var init_popup_messaging = __esm({
    "shared/js/background/popup-messaging.js"() {
      "use strict";
      activePort = null;
    }
  });

  // shared/js/background/companies.js
  var require_companies = __commonJS({
    "shared/js/background/companies.js"(exports2, module2) {
      "use strict";
      var TopBlocked = require_top_blocked();
      var Company = require_company();
      var browserWrapper5 = (init_wrapper(), __toCommonJS(wrapper_exports));
      var { postPopupMessage: postPopupMessage2 } = (init_popup_messaging(), __toCommonJS(popup_messaging_exports));
      var Companies3 = (() => {
        let companyContainer = {};
        const topBlocked = new TopBlocked();
        const storageName = "companyData";
        let totalPages = 0;
        let totalPagesWithTrackers = 0;
        let lastStatsResetDate = null;
        function sortByCount(a, b) {
          return companyContainer[b].count - companyContainer[a].count;
        }
        function sortByPages(a, b) {
          return companyContainer[b].pagesSeenOn - companyContainer[a].pagesSeenOn;
        }
        return {
          get: (name) => {
            return companyContainer[name];
          },
          getTotalPages: () => {
            return totalPages;
          },
          add: (c) => {
            if (!companyContainer[c.name]) {
              companyContainer[c.name] = new Company(c);
              topBlocked.add(c.name);
            }
            companyContainer[c.name].incrementCount();
            return companyContainer[c.name];
          },
          // This is used by tab.js to count only unique tracking networks on a tab
          countCompanyOnPage: (c) => {
            if (!companyContainer[c.name]) {
              companyContainer[c.name] = new Company(c);
              topBlocked.add(c.name);
            }
            if (c.name !== "unknown") companyContainer[c.name].incrementPagesSeenOn();
          },
          all: () => {
            return Object.keys(companyContainer);
          },
          getTopBlocked: (n) => {
            const topBlockedData = [];
            topBlocked.getTop(n, sortByCount).forEach((name) => {
              const c = Companies3.get(name);
              topBlockedData.push({ name: c.name, count: c.count, displayName: c.displayName });
            });
            return topBlockedData;
          },
          getTopBlockedByPages: (n) => {
            const topBlockedData = [];
            topBlocked.getTop(n, sortByPages).forEach((name) => {
              const c = Companies3.get(name);
              topBlockedData.push({
                name: c.name,
                displayName: c.displayName,
                percent: Math.min(100, Math.round(c.pagesSeenOn / totalPages * 100))
              });
            });
            return {
              topBlocked: topBlockedData,
              totalPages,
              pctPagesWithTrackers: Math.min(100, Math.round(totalPagesWithTrackers / totalPages * 100)),
              lastStatsResetDate
            };
          },
          setTotalPagesFromStorage: (n) => {
            if (n) totalPages = n;
          },
          setTotalPagesWithTrackersFromStorage: (n) => {
            if (n) totalPagesWithTrackers = n;
          },
          resetData: () => {
            companyContainer = {};
            topBlocked.clear();
            totalPages = 0;
            totalPagesWithTrackers = 0;
            lastStatsResetDate = Date.now();
            Companies3.syncToStorage();
            postPopupMessage2({ messageType: "didResetTrackersData" });
          },
          getLastResetDate: () => lastStatsResetDate,
          incrementTotalPages: () => {
            totalPages += 1;
            Companies3.syncToStorage();
          },
          incrementTotalPagesWithTrackers: () => {
            totalPagesWithTrackers += 1;
            Companies3.syncToStorage();
          },
          syncToStorage: () => {
            const toSync = {};
            toSync[storageName] = companyContainer;
            browserWrapper5.syncToStorage(toSync);
            browserWrapper5.syncToStorage({ totalPages });
            browserWrapper5.syncToStorage({ totalPagesWithTrackers });
            browserWrapper5.syncToStorage({ lastStatsResetDate });
          },
          sanitizeData: (storageData) => {
            if (storageData && Object.hasOwnProperty.call(storageData, "twitter")) {
              delete storageData.twitter;
            }
            return storageData;
          },
          buildFromStorage: () => {
            browserWrapper5.getFromStorage(storageName).then((storageData) => {
              storageData = Companies3.sanitizeData(storageData);
              for (const company in storageData) {
                const newCompany = Companies3.add(storageData[company]);
                newCompany.set("count", storageData[company].count || 0);
                newCompany.set("pagesSeenOn", storageData[company].pagesSeenOn || 0);
              }
            });
            browserWrapper5.getFromStorage("totalPages").then((n) => {
              if (n) totalPages = n;
            });
            browserWrapper5.getFromStorage("totalPagesWithTrackers").then((n) => {
              if (n) totalPagesWithTrackers = n;
            });
            browserWrapper5.getFromStorage("lastStatsResetDate").then((d) => {
              if (d) {
                lastStatsResetDate = d;
              } else {
                Companies3.resetData();
              }
            });
          }
        };
      })();
      module2.exports = Companies3;
    }
  });

  // shared/data/tosdr.json
  var require_tosdr = __commonJS({
    "shared/data/tosdr.json"(exports2, module2) {
      module2.exports = {
        "zoosk.com": {
          score: 0,
          all: {
            bad: [],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "youtube.com": {
          score: 0,
          all: {
            bad: [
              "broader than necessary",
              "reduction of legal period for cause of action",
              "user needs to check tosback.org",
              "device fingerprinting"
            ],
            good: [
              "help you deal with take-down notices"
            ]
          },
          match: {
            bad: [
              "broader than necessary",
              "reduction of legal period for cause of action",
              "user needs to check tosback.org",
              "device fingerprinting"
            ],
            good: [
              "help you deal with take-down notices"
            ]
          },
          class: "D"
        },
        "yahoo.com": {
          score: 0,
          all: {
            bad: [
              "pseudonym not allowed (not because of user-to-user trust)",
              "user needs to check tosback.org",
              "device fingerprinting"
            ],
            good: [
              "limited for purpose of same service",
              "limited for purpose of same service"
            ]
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "xing.com": {
          score: 0,
          all: {
            bad: [
              "pseudonym not allowed (not because of user-to-user trust)"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "xfire.com": {
          score: 0,
          all: {
            bad: [],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "worldofwarcraft.com": {
          score: 0,
          all: {
            bad: [],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "wordpress.com": {
          score: 0,
          all: {
            bad: [
              "user needs to check tosback.org",
              "device fingerprinting"
            ],
            good: [
              "limited for purpose of same service"
            ]
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "wordfeud.com": {
          score: 0,
          all: {
            bad: [],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "wikipedia.org": {
          score: 0,
          all: {
            bad: [],
            good: [
              "only temporary session cookies",
              "user feedback is invited",
              "suspension will be fair and proportionate",
              "you publish under a free license, not a bilateral one"
            ]
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "whatsapp.com": {
          score: 0,
          all: {
            bad: [
              "user needs to check tosback.org"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "videobb.com": {
          score: 0,
          all: {
            bad: [],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "vbulletin.com": {
          score: 0,
          all: {
            bad: [],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "twitter.com": {
          score: 0,
          all: {
            bad: [
              "little involvement",
              "very broad",
              "your content stays licensed",
              "sets third-party cookies and/or ads"
            ],
            good: [
              "archives provided",
              "tracking data deleted after 10 days and opt-out",
              "you can get your data back"
            ]
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "twitpic.com": {
          score: 85,
          all: {
            bad: [
              "responsible and indemnify",
              "reduction of legal period for cause of action",
              "they can license to third parties"
            ],
            good: []
          },
          match: {
            bad: [
              "they can license to third parties"
            ],
            good: []
          },
          class: false
        },
        "tumblr.com": {
          score: 0,
          all: {
            bad: [
              "keep a license even after you close your account",
              "sets third-party cookies and/or ads"
            ],
            good: [
              "they state that you own your data",
              "third parties are bound by confidentiality obligations",
              "archives provided"
            ]
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "steampowered.com": {
          score: -65,
          all: {
            bad: [
              "defend, indemnify, hold harmless; survives termination",
              "personal data is given to third parties",
              "they can delete your account without prior notice and without a reason",
              "class action waiver"
            ],
            good: [
              "personal data is not sold",
              "pseudonyms allowed",
              "you can request access and deletion of personal data",
              "user is notified a month or more in advance",
              "you can leave at any time"
            ]
          },
          match: {
            bad: [
              "personal data is given to third parties"
            ],
            good: [
              "personal data is not sold",
              "you can request access and deletion of personal data"
            ]
          },
          class: false
        },
        "store.steampowered.com": {
          score: -65,
          all: {
            bad: [
              "defend, indemnify, hold harmless; survives termination",
              "personal data is given to third parties",
              "they can delete your account without prior notice and without a reason",
              "class action waiver"
            ],
            good: [
              "personal data is not sold",
              "pseudonyms allowed",
              "you can request access and deletion of personal data",
              "user is notified a month or more in advance",
              "you can leave at any time"
            ]
          },
          match: {
            bad: [
              "personal data is given to third parties"
            ],
            good: [
              "personal data is not sold",
              "you can request access and deletion of personal data"
            ]
          },
          class: false
        },
        "spotify.com": {
          score: 10,
          all: {
            bad: [
              "you grant perpetual license to anything you publish-bad-80",
              "spotify may transfer and process your data to somewhere outside of your country-bad-50",
              "personal data is given to third parties",
              "they can delete your account without prior notice and without a reason",
              "no promise to inform/notify",
              "no quality guarantee",
              "third parties may be involved in operating the service",
              "no quality guarantee"
            ],
            good: [
              "info given about risk of publishing your info online",
              "you can leave at any time",
              "they educate you about the risks",
              "info given about what personal data they collect",
              "info given about intended use of your information"
            ]
          },
          match: {
            bad: [
              "personal data is given to third parties"
            ],
            good: []
          },
          class: false
        },
        "soundcloud.com": {
          score: 20,
          all: {
            bad: [
              "responsible and indemnify",
              "may sell your data in merger",
              "third-party cookies, but with opt-out instructions"
            ],
            good: [
              "user is notified a month or more in advance",
              "easy to read",
              "you have control over licensing options",
              "your personal data is used for limited purposes",
              "pseudonyms allowed",
              "you can leave at any time"
            ]
          },
          match: {
            bad: [
              "may sell your data in merger"
            ],
            good: []
          },
          class: "B"
        },
        "sonic.net": {
          score: 0,
          all: {
            bad: [],
            good: [
              "logs are deleted after two weeks"
            ]
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "skype.com": {
          score: 0,
          all: {
            bad: [
              "user needs to check tosback.org",
              "you may not express negative opinions about them"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "seenthis.net": {
          score: 0,
          all: {
            bad: [],
            good: [
              "you can get your data back",
              "you can leave at any time",
              "you have control over licensing options"
            ]
          },
          match: {
            bad: [],
            good: [
              "you can get your data back",
              "you can leave at any time",
              "you have control over licensing options"
            ]
          },
          class: "A"
        },
        "runescape.com": {
          score: 0,
          all: {
            bad: [],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "rapidshare.com": {
          score: -50,
          all: {
            bad: [],
            good: [
              "no third-party access without a warrant",
              "they do not index or open files",
              "your personal data is used for limited purposes",
              "99.x% availability",
              "user is notified a month or more in advance"
            ]
          },
          match: {
            bad: [],
            good: [
              "no third-party access without a warrant"
            ]
          },
          class: false
        },
        "quora.com": {
          score: 0,
          all: {
            bad: [
              "device fingerprinting"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "phpbb.com": {
          score: 0,
          all: {
            bad: [],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "packagetrackr.com": {
          score: 0,
          all: {
            bad: [
              "user needs to check tosback.org"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "owncube.com": {
          score: -25,
          all: {
            bad: [
              "user needs to check tosback.org"
            ],
            good: [
              "personal data is not sold"
            ]
          },
          match: {
            bad: [],
            good: [
              "personal data is not sold"
            ]
          },
          class: false
        },
        "olx.com": {
          score: 0,
          all: {
            bad: [],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "netflix.com": {
          score: -20,
          all: {
            bad: [
              "class action waiver",
              "sets third-party cookies and/or ads",
              "they can delete your account without prior notice and without a reason",
              "no liability for unauthorized access",
              "user needs to check tosback.org",
              "targeted third-party advertising",
              "no promise to inform/notify"
            ],
            good: [
              "easy to read",
              "you can request access and deletion of personal data"
            ]
          },
          match: {
            bad: [
              "targeted third-party advertising"
            ],
            good: [
              "you can request access and deletion of personal data"
            ]
          },
          class: false
        },
        "nabble.com": {
          score: 0,
          all: {
            bad: [
              "user needs to check tosback.org"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "mint.com": {
          score: 20,
          all: {
            bad: [
              "may sell your data in merger",
              "user needs to rely on tosback.org"
            ],
            good: []
          },
          match: {
            bad: [
              "may sell your data in merger"
            ],
            good: []
          },
          class: false
        },
        "microsoft.com": {
          score: 60,
          all: {
            bad: [
              "class action waiver",
              "tracks you on other websites",
              "no promise to inform/notify",
              "user needs to check tosback.org",
              "your data may be stored anywhere in the world"
            ],
            good: [
              "personalized ads are opt-out"
            ]
          },
          match: {
            bad: [
              "tracks you on other websites"
            ],
            good: []
          },
          class: false
        },
        "lastpass.com": {
          score: -50,
          all: {
            bad: [
              "they can delete your account without prior notice and without a reason",
              "no quality guarantee",
              "no quality guarantee",
              "they become the owner of ideas you give them",
              "user needs to check tosback.org",
              "promotional communications are not opt-out",
              "responsible and indemnify"
            ],
            good: [
              "legal documents published under reusable license",
              "pseudonyms allowed",
              "info given about security practices",
              "only necessary logs are kept",
              "only temporary session cookies",
              "no third-party access without a warrant"
            ]
          },
          match: {
            bad: [],
            good: [
              "no third-party access without a warrant"
            ]
          },
          class: "B"
        },
        "kolabnow.com": {
          score: -75,
          all: {
            bad: [],
            good: [
              "no third-party access without a warrant",
              "4 weeks to review changes and possibility to negotiate-good-60",
              "no tracking cookies and web analytics opt-out-good-20",
              "suspension will be fair and proportionate",
              "only necessary logs are kept",
              "no third-party access without a warrant",
              "free software; you can run your own instance",
              "personal data is not sold"
            ]
          },
          match: {
            bad: [],
            good: [
              "no third-party access without a warrant",
              "personal data is not sold"
            ]
          },
          class: "A"
        },
        "kolab.org": {
          score: -75,
          all: {
            bad: [],
            good: [
              "no third-party access without a warrant",
              "4 weeks to review changes and possibility to negotiate-good-60",
              "no tracking cookies and web analytics opt-out-good-20",
              "suspension will be fair and proportionate",
              "only necessary logs are kept",
              "no third-party access without a warrant",
              "free software; you can run your own instance",
              "personal data is not sold"
            ]
          },
          match: {
            bad: [],
            good: [
              "no third-party access without a warrant",
              "personal data is not sold"
            ]
          },
          class: "A"
        },
        "kippt.com": {
          score: 0,
          all: {
            bad: [
              "user needs to rely on tosback.org"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "jagex.com": {
          score: 0,
          all: {
            bad: [],
            good: [
              "user is notified a week or more in advance"
            ]
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "instagram.com": {
          score: 0,
          all: {
            bad: [
              "class action waiver",
              "very broad"
            ],
            good: [
              "user is notified a week or more in advance"
            ]
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "informe.com": {
          score: 0,
          all: {
            bad: [
              "user needs to check tosback.org"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "imgur.com": {
          score: 0,
          all: {
            bad: [
              "device fingerprinting"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "ifttt.com": {
          score: 0,
          all: {
            bad: [
              "user needs to check tosback.org"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "identi.ca": {
          score: 0,
          all: {
            bad: [],
            good: [
              "you publish under a free license, not a bilateral one"
            ]
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "hypster.com": {
          score: 0,
          all: {
            bad: [],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "habbo.com": {
          score: 0,
          all: {
            bad: [],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "gravatar.com": {
          score: 0,
          all: {
            bad: [
              "broader than necessary"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "grammarly.com": {
          score: 20,
          all: {
            bad: [
              "no promise to inform/notify",
              "your use is throttled",
              "no pricing info given before you sign up",
              "may sell your data in merger"
            ],
            good: []
          },
          match: {
            bad: [
              "may sell your data in merger"
            ],
            good: []
          },
          class: false
        },
        "google.com": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.in": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.jp": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.de": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.uk": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.br": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.fr": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ru": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.it": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.hk": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.es": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ca": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.mx": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.tr": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.au": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.tw": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.pl": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.id": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.ar": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.ua": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.pk": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.th": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.sa": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.eg": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.nl": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.ve": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.za": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.gr": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.ph": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.se": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.sg": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.be": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.az": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.ao": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.co": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.kr": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.at": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.vn": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.cn": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.ng": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.cz": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ch": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.no": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ro": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.pe": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.pt": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.cl": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ae": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ie": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.dk": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.dz": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.hu": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.fi": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.il": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.sk": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.kz": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.kw": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.nz": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.lk": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.bg": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.by": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.do": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.ly": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.rs": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.mm": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.hr": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.ec": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.tn": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.my": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.lt": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.tm": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.iq": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.si": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.af": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.gt": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.lv": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.pr": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.gh": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.bd": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.cu": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.jo": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.lb": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.sv": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ee": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.bh": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ba": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.uy": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.ma": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.cm": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.tt": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.kh": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.py": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.np": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.cy": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.ni": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.et": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.cd": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.hn": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ge": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.am": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.lu": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.qa": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.mz": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.bw": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.mg": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.sn": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.pg": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.cg": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.bn": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.tj": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ht": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.zm": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.ke": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.al": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.bf": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.mu": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.cr": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.la": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.mn": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.bo": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.org": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.jm": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.tz": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.na": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ml": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.mt": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.is": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.bj": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.ug": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.rw": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.om": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ci": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.bs": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.td": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ps": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.gi": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.pa": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.sl": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.uz": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.md": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.bi": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.sr": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.cat": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.so": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.bt": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.je": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.gy": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.me": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.zw": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.gp": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.tg": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.ls": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.as": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.bz": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.cf": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.mv": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ad": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.li": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.cv": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.mk": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.vc": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.ag": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.gl": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ne": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.mw": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ws": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.kg": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.gm": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.to": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.sb": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.tn": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ga": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.tl": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.im": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.fj": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.dj": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ac": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.iq": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.vg": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.dm": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.sc": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.pt": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.cn": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.st": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ng": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.ai": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ki": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.vu": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.sm": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.jp": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.om": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.vi": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.gg": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.fm": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.hk": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.ck": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.tk": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.in": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.co.je": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.ve": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.tw": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.us": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ua": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.de.com": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.ms": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.com.by": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.nr": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.br.com": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.sh": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.hk.com": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "google.kr": {
          score: 220,
          all: {
            bad: [
              "they may stop providing the service at any time",
              "they can use your content for all their existing and future services",
              "third-party access without a warrant",
              "your content stays licensed",
              "tracks you on other websites",
              "logs are kept forever",
              "device fingerprinting"
            ],
            good: [
              "user is notified a week or more in advance",
              "archives provided",
              "they provide a way to export your data",
              "limited for purpose across broad platform"
            ]
          },
          match: {
            bad: [
              "they can use your content for all their existing and future services",
              "tracks you on other websites",
              "logs are kept forever"
            ],
            good: []
          },
          class: "C"
        },
        "github.com": {
          score: 0,
          all: {
            bad: [
              "they can delete your account without prior notice and without a reason",
              "user needs to check tosback.org",
              "pseudonym not allowed (not because of user-to-user trust)",
              "defend, indemnify, hold harmless"
            ],
            good: [
              "info given about security practices",
              "you publish under a free license, not a bilateral one",
              "will notify before merger",
              "your personal data is used for limited purposes"
            ]
          },
          match: {
            bad: [
              "they can delete your account without prior notice and without a reason",
              "user needs to check tosback.org",
              "pseudonym not allowed (not because of user-to-user trust)",
              "defend, indemnify, hold harmless"
            ],
            good: [
              "info given about security practices",
              "you publish under a free license, not a bilateral one",
              "will notify before merger",
              "your personal data is used for limited purposes"
            ]
          },
          class: "B"
        },
        "freeforums.org": {
          score: 0,
          all: {
            bad: [
              "user needs to check tosback.org"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "foxnews.com": {
          score: 0,
          all: {
            bad: [
              "device fingerprinting"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "flickr.com": {
          score: 0,
          all: {
            bad: [],
            good: [
              "you can choose with whom you share content",
              "limited for purpose of same service",
              "you can choose the copyright license"
            ]
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "flattr.com": {
          score: 0,
          all: {
            bad: [
              "sets third-party cookies and/or ads"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "facebook.com": {
          score: 100,
          all: {
            bad: [
              "pseudonym not allowed (not because of user-to-user trust)",
              "tracks you on other websites",
              "many third parties are involved in operating the service",
              "very broad",
              "your data is used for many purposes"
            ],
            good: [
              "they state that you own your data",
              "user feedback is invited"
            ]
          },
          match: {
            bad: [
              "tracks you on other websites",
              "your data is used for many purposes"
            ],
            good: []
          },
          class: false
        },
        "evernote.com": {
          score: 0,
          all: {
            bad: [],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "envato.com": {
          score: 0,
          all: {
            bad: [],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "ebuddy.com": {
          score: 0,
          all: {
            bad: [],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "duckduckgo.com": {
          score: -100,
          all: {
            bad: [],
            good: [
              "no tracking"
            ]
          },
          match: {
            bad: [],
            good: [
              "no tracking"
            ]
          },
          class: "A"
        },
        "duck.com": {
          score: -100,
          all: {
            bad: [],
            good: [
              "no tracking"
            ]
          },
          match: {
            bad: [],
            good: [
              "no tracking"
            ]
          },
          class: "A"
        },
        "donttrack.us": {
          score: -100,
          all: {
            bad: [],
            good: [
              "no tracking"
            ]
          },
          match: {
            bad: [],
            good: [
              "no tracking"
            ]
          },
          class: "A"
        },
        "privacyheroes.io": {
          score: -100,
          all: {
            bad: [],
            good: [
              "no tracking"
            ]
          },
          match: {
            bad: [],
            good: [
              "no tracking"
            ]
          },
          class: "A"
        },
        "spreadprivacy.com": {
          score: -100,
          all: {
            bad: [],
            good: [
              "no tracking"
            ]
          },
          match: {
            bad: [],
            good: [
              "no tracking"
            ]
          },
          class: "A"
        },
        "duckduckhack.com": {
          score: -100,
          all: {
            bad: [],
            good: [
              "no tracking"
            ]
          },
          match: {
            bad: [],
            good: [
              "no tracking"
            ]
          },
          class: "A"
        },
        "privatebrowsingmyths.com": {
          score: -100,
          all: {
            bad: [],
            good: [
              "no tracking"
            ]
          },
          match: {
            bad: [],
            good: [
              "no tracking"
            ]
          },
          class: "A"
        },
        "duck.co": {
          score: -100,
          all: {
            bad: [],
            good: [
              "no tracking"
            ]
          },
          match: {
            bad: [],
            good: [
              "no tracking"
            ]
          },
          class: "A"
        },
        "cispaletter.org": {
          score: -100,
          all: {
            bad: [],
            good: [
              "no tracking"
            ]
          },
          match: {
            bad: [],
            good: [
              "no tracking"
            ]
          },
          class: "A"
        },
        "dropbox.com": {
          score: 0,
          all: {
            bad: [],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "disqus.com": {
          score: 0,
          all: {
            bad: [
              "user needs to check tosback.org"
            ],
            good: [
              "they will help you react to others infringing on your copyright"
            ]
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "dictionary.com": {
          score: 0,
          all: {
            bad: [
              "device fingerprinting"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "delicious.com": {
          score: 20,
          all: {
            bad: [
              "broad license including right to distribute through any media",
              "sets third-party cookies and/or ads",
              "may sell your data in merger",
              "only for your individual and non-commercial use"
            ],
            good: [
              "third parties are bound by confidentiality obligations"
            ]
          },
          match: {
            bad: [
              "may sell your data in merger"
            ],
            good: []
          },
          class: "D"
        },
        "delicious.com.au": {
          score: 20,
          all: {
            bad: [
              "broad license including right to distribute through any media",
              "sets third-party cookies and/or ads",
              "may sell your data in merger",
              "only for your individual and non-commercial use"
            ],
            good: [
              "third parties are bound by confidentiality obligations"
            ]
          },
          match: {
            bad: [
              "may sell your data in merger"
            ],
            good: []
          },
          class: "D"
        },
        "coursera.org": {
          score: 0,
          all: {
            bad: [
              "user needs to rely on tosback.org"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "couchsurfing.org": {
          score: 20,
          all: {
            bad: [
              "your content stays licensed",
              "they can delete your account without prior notice and without a reason",
              "they become the owner of ideas you give them",
              "keep a license even after you close your account",
              "broader than necessary",
              "user needs to check tosback.org",
              "may sell your data in merger",
              "third-party cookies, but with opt-out instructions"
            ],
            good: []
          },
          match: {
            bad: [
              "may sell your data in merger"
            ],
            good: []
          },
          class: false
        },
        "cnn.com": {
          score: 0,
          all: {
            bad: [
              "device fingerprinting"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "cnet.com": {
          score: 0,
          all: {
            bad: [
              "device fingerprinting"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "cloudant.com": {
          score: 20,
          all: {
            bad: [
              "defend, indemnify, hold harmless",
              "user needs to check tosback.org",
              "no liability for unauthorized access",
              "may sell your data in merger",
              "sets third-party cookies and/or ads"
            ],
            good: [
              "limited for purpose of same service",
              "they provide a way to export your data",
              "refund policy",
              "you publish under a free license, not a bilateral one",
              "they give 30 days notice before closing your account",
              "will warn about maintenance"
            ]
          },
          match: {
            bad: [
              "may sell your data in merger"
            ],
            good: []
          },
          class: "B"
        },
        null: {
          score: 0,
          all: {
            bad: [
              "device fingerprinting"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "bitly.com": {
          score: 0,
          all: {
            bad: [],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "bearshare.com": {
          score: 0,
          all: {
            bad: [],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "bbc.com": {
          score: 0,
          all: {
            bad: [
              "device fingerprinting"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "icloud.com": {
          score: 0,
          all: {
            bad: [],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "apple.com": {
          score: 0,
          all: {
            bad: [
              "user needs to check tosback.org"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "app.net": {
          score: 0,
          all: {
            bad: [
              "user needs to rely on tosback.org",
              "you may not scrape",
              "defend, indemnify, hold harmless"
            ],
            good: [
              "user feedback is invited",
              "archives provided",
              "you can delete your content",
              "easy to read",
              "pseudonyms allowed"
            ]
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "amazon.com": {
          score: 110,
          all: {
            bad: [
              "may sell your data in merger",
              "targeted third-party advertising",
              "tracks you on other websites",
              "user needs to check tosback.org"
            ],
            good: []
          },
          match: {
            bad: [
              "may sell your data in merger",
              "targeted third-party advertising",
              "tracks you on other websites"
            ],
            good: []
          },
          class: false
        },
        "allrecipes.com": {
          score: 0,
          all: {
            bad: [
              "user needs to check tosback.org"
            ],
            good: []
          },
          match: {
            bad: [],
            good: []
          },
          class: false
        },
        "500px.com": {
          score: 0,
          all: {
            bad: [
              "class action waiver",
              "responsible and indemnify",
              "they can delete your account without prior notice and without a reason",
              "broader than necessary"
            ],
            good: [
              "easy to read",
              "pseudonyms allowed"
            ]
          },
          match: {
            bad: [
              "class action waiver",
              "responsible and indemnify",
              "they can delete your account without prior notice and without a reason",
              "broader than necessary"
            ],
            good: [
              "easy to read",
              "pseudonyms allowed"
            ]
          },
          class: "D"
        },
        "500px.me": {
          score: 0,
          all: {
            bad: [
              "class action waiver",
              "responsible and indemnify",
              "they can delete your account without prior notice and without a reason",
              "broader than necessary"
            ],
            good: [
              "easy to read",
              "pseudonyms allowed"
            ]
          },
          match: {
            bad: [
              "class action waiver",
              "responsible and indemnify",
              "they can delete your account without prior notice and without a reason",
              "broader than necessary"
            ],
            good: [
              "easy to read",
              "pseudonyms allowed"
            ]
          },
          class: "D"
        },
        "500px.org": {
          score: 0,
          all: {
            bad: [
              "class action waiver",
              "responsible and indemnify",
              "they can delete your account without prior notice and without a reason",
              "broader than necessary"
            ],
            good: [
              "easy to read",
              "pseudonyms allowed"
            ]
          },
          match: {
            bad: [
              "class action waiver",
              "responsible and indemnify",
              "they can delete your account without prior notice and without a reason",
              "broader than necessary"
            ],
            good: [
              "easy to read",
              "pseudonyms allowed"
            ]
          },
          class: "D"
        },
        "500px.net": {
          score: 0,
          all: {
            bad: [
              "class action waiver",
              "responsible and indemnify",
              "they can delete your account without prior notice and without a reason",
              "broader than necessary"
            ],
            good: [
              "easy to read",
              "pseudonyms allowed"
            ]
          },
          match: {
            bad: [
              "class action waiver",
              "responsible and indemnify",
              "they can delete your account without prior notice and without a reason",
              "broader than necessary"
            ],
            good: [
              "easy to read",
              "pseudonyms allowed"
            ]
          },
          class: "D"
        }
      };
    }
  });

  // shared/data/constants.js
  var require_constants = __commonJS({
    "shared/data/constants.js"(exports2, module2) {
      "use strict";
      var parseUserAgentString4 = require_parse_user_agent_string();
      var browserInfo2 = parseUserAgentString4();
      var trackerBlockingEndpointBase = "https://staticcdn.duckduckgo.com/trackerblocking";
      function isMV3() {
        if (typeof chrome !== "undefined") {
          return chrome?.runtime.getManifest().manifest_version === 3;
        }
        return false;
      }
      function getConfigFileName() {
        let browserName2 = browserInfo2?.browser?.toLowerCase() || "";
        if (!["chrome", "firefox", "brave", "edg"].includes(browserName2)) {
          browserName2 = "";
        } else {
          browserName2 = "-" + browserName2 + (isMV3() ? "mv3" : "");
        }
        return `${trackerBlockingEndpointBase}/config/v4/extension${browserName2}-config.json`;
      }
      function getTDSEndpoint(version) {
        const thisPlatform = `extension${isMV3() ? "-mv3" : ""}`;
        return `${trackerBlockingEndpointBase}/${version}/${thisPlatform}-tds.json`;
      }
      module2.exports = {
        displayCategories: ["Analytics", "Advertising", "Social Network", "Content Delivery", "Embedded Content"],
        feedbackUrl: "https://duckduckgo.com/feedback.js?type=extension-feedback",
        tosdrMessages: {
          A: "Good",
          B: "Mixed",
          C: "Poor",
          D: "Poor",
          E: "Poor",
          good: "Good",
          bad: "Poor",
          unknown: "Unknown",
          mixed: "Mixed"
        },
        httpsService: "https://duckduckgo.com/smarter_encryption.js",
        duckDuckGoSerpHostname: "duckduckgo.com",
        httpsMessages: {
          secure: "Encrypted Connection",
          upgraded: "Forced Encryption",
          none: "Unencrypted Connection"
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
          "Google LLC": "google",
          "Facebook, Inc.": "facebook",
          "Twitter, Inc.": "twitter",
          "Amazon Technologies, Inc.": "amazon",
          "AppNexus, Inc.": "appnexus",
          "MediaMath, Inc.": "mediamath",
          "StackPath, LLC": "maxcdn",
          "Automattic, Inc.": "automattic",
          "Adobe Inc.": "adobe",
          "Quantcast Corporation": "quantcast",
          "The Nielsen Company": "nielsen"
        },
        httpsDBName: "https",
        httpsLists: [
          {
            type: "upgrade bloom filter",
            name: "httpsUpgradeBloomFilter",
            url: "https://staticcdn.duckduckgo.com/https/https-bloom.json"
          },
          {
            type: "don't upgrade bloom filter",
            name: "httpsDontUpgradeBloomFilters",
            url: "https://staticcdn.duckduckgo.com/https/negative-https-bloom.json"
          },
          {
            type: "upgrade safelist",
            name: "httpsUpgradeList",
            url: "https://staticcdn.duckduckgo.com/https/negative-https-allowlist.json"
          },
          {
            type: "don't upgrade safelist",
            name: "httpsDontUpgradeList",
            url: "https://staticcdn.duckduckgo.com/https/https-allowlist.json"
          }
        ],
        tdsLists: [
          {
            name: "surrogates",
            url: "/data/surrogates.txt",
            format: "text",
            source: "local"
          },
          {
            name: "tds",
            url: getTDSEndpoint("v6/current"),
            format: "json",
            source: "external",
            channels: {
              live: getTDSEndpoint("v6/current"),
              next: getTDSEndpoint("v6/next"),
              beta: getTDSEndpoint("beta")
            }
          },
          {
            name: "config",
            url: getConfigFileName(),
            format: "json",
            source: "external"
          }
        ],
        httpsErrorCodes: {
          "net::ERR_CONNECTION_REFUSED": 1,
          "net::ERR_ABORTED": 2,
          "net::ERR_SSL_PROTOCOL_ERROR": 3,
          "net::ERR_SSL_VERSION_OR_CIPHER_MISMATCH": 4,
          "net::ERR_NAME_NOT_RESOLVED": 5,
          NS_ERROR_CONNECTION_REFUSED: 6,
          NS_ERROR_UNKNOWN_HOST: 7,
          "An additional policy constraint failed when validating this certificate.": 8,
          "Unable to communicate securely with peer: requested domain name does not match the server\u2019s certificate.": 9,
          "Cannot communicate securely with peer: no common encryption algorithm(s).": 10,
          "SSL received a record that exceeded the maximum permissible length.": 11,
          "The certificate is not trusted because it is self-signed.": 12,
          downgrade_redirect_loop: 13
        },
        iconPaths: (
          /** @type {const} */
          {
            regular: "/img/icon_browser_action.png",
            withSpecialState: "/img/icon_browser_action_special.png"
          }
        ),
        platform: {
          name: "extension"
        },
        trackerStats: (
          /** @type {const} */
          {
            allowedOrigin: "https://duckduckgo.com",
            allowedPathname: "ntp-tracker-stats.html",
            redirectTarget: "html/tracker-stats.html",
            clientPortName: "newtab-tracker-stats",
            /** @type {ReadonlyArray<string>} */
            excludedCompanies: ["ExoClick"],
            events: {
              incoming: {
                newTabPage_heartbeat: "newTabPage_heartbeat"
              },
              outgoing: {
                newTabPage_data: "newTabPage_data",
                newTabPage_disconnect: "newTabPage_disconnect"
              }
            }
          }
        )
      };
    }
  });

  // shared/js/background/privacy-practices.js
  var require_privacy_practices = __commonJS({
    "shared/js/background/privacy-practices.js"(exports2, module2) {
      "use strict";
      var tldts = require_cjs();
      var tosdr = require_tosdr();
      var constants3 = require_constants();
      var utils4 = (init_utils(), __toCommonJS(utils_exports));
      var tosdrRegexList = [];
      var tosdrScores = {};
      var PrivacyPractices = class {
        constructor() {
          Object.keys(tosdr).forEach((site) => {
            tosdrRegexList.push(new RegExp(`(^)${tldts.getDomain(site)}`));
            const tosdrClass = tosdr[site].class;
            const tosdrScore = tosdr[site].score;
            if (tosdrClass || tosdrScore) {
              let score = 5;
              if (tosdrClass === "A") {
                score = 0;
              } else if (tosdrClass === "B") {
                score = 1;
              } else if (tosdrClass === "D" || tosdrScore > 150) {
                score = 10;
              } else if (tosdrClass === "C" || tosdrScore > 100) {
                score = 7;
              }
              tosdrScores[site] = score;
              const parentEntity = utils4.findParent(site);
              if (parentEntity && (!tosdrScores[parentEntity] || tosdrScores[parentEntity] < score)) {
                tosdrScores[parentEntity] = score;
              }
            }
          });
        }
        getTosdr(url) {
          const domain = tldts.getDomain(url);
          let tosdrData;
          tosdrRegexList.some((tosdrSite) => {
            const match = tosdrSite.exec(domain);
            if (!match) return false;
            tosdrData = tosdr[match[0]];
            return tosdrData;
          });
          if (!tosdrData) return {};
          const matchGood = tosdrData.match && tosdrData.match.good || [];
          const matchBad = tosdrData.match && tosdrData.match.bad || [];
          let message = constants3.tosdrMessages.unknown;
          if (tosdrData.class) {
            message = constants3.tosdrMessages[tosdrData.class];
          } else if (matchGood.length && matchBad.length) {
            message = constants3.tosdrMessages.mixed;
          } else {
            if (tosdrData.score < 0) {
              message = constants3.tosdrMessages.good;
            } else if (tosdrData.score === 0 && (matchGood.length || matchBad.length)) {
              message = constants3.tosdrMessages.mixed;
            } else if (tosdrData.score > 0) {
              message = constants3.tosdrMessages.bad;
            }
          }
          return {
            score: tosdrData.score,
            class: tosdrData.class,
            reasons: {
              good: matchGood,
              bad: matchBad
            },
            message
          };
        }
        getTosdrScore(hostname, parent2) {
          const domain = tldts.getDomain(hostname);
          let parentMatch = "";
          if (parent2 && parent2.domains) {
            Object.keys(tosdrScores).some((tosdrName) => {
              const match = parent2.domains.find((d) => d === tosdrName);
              if (match) {
                parentMatch = match;
                return true;
              }
              return false;
            });
          }
          const score = [tosdrScores[parentMatch], tosdrScores[domain], tosdrScores[hostname]].find((s) => typeof s === "number");
          return score;
        }
      };
      module2.exports = new PrivacyPractices();
    }
  });

  // packages/privacy-grade/src/classes/grade.js
  var require_grade = __commonJS({
    "packages/privacy-grade/src/classes/grade.js"(exports2, module2) {
      "use strict";
      var UNKNOWN_PRIVACY_SCORE = 2;
      var TRACKER_RANGE_MAP = {
        zero: 0,
        max: 10,
        steps: [
          [0.1, 1],
          [1, 2],
          [5, 3],
          [10, 4],
          [15, 5],
          [20, 6],
          [30, 7],
          [45, 8],
          [66, 9]
        ]
      };
      var GRADE_RANGE_MAP = {
        zero: "A",
        max: "D-",
        steps: [
          [2, "A"],
          [4, "B+"],
          [10, "B"],
          [14, "C+"],
          [20, "C"],
          [30, "D"]
        ]
      };
      var Grade2 = class {
        constructor(attrs) {
          this.https = false;
          this.httpsAutoUpgrade = false;
          this.privacyScore = UNKNOWN_PRIVACY_SCORE;
          this.entitiesBlocked = {};
          this.entitiesNotBlocked = {};
          this.scores = null;
          attrs = attrs || {};
          if (attrs.https) {
            this.setHttps(attrs.https, attrs.httpsAutoUpgrade);
          }
          if (typeof attrs.privacyScore !== "undefined") {
            this.setPrivacyScore(attrs.privacyScore);
          }
          if (attrs.parentEntity) {
            this.setParentEntity(attrs.parentEntity, attrs.prevalence);
          }
          if (attrs.trackersBlocked) {
            Object.keys(attrs.trackersBlocked).forEach((entityName) => {
              this.addEntityBlocked(entityName, attrs.trackersBlocked[entityName].prevalence);
            });
          }
          if (attrs.trackersNotBlocked) {
            Object.keys(attrs.trackersNotBlocked).forEach((entityName) => {
              this.addEntityNotBlocked(entityName, attrs.trackersNotBlocked[entityName].prevalence);
            });
          }
        }
        setHttps(https, httpsAutoUpgrade) {
          this.scores = null;
          this.https = https;
          this.httpsAutoUpgrade = httpsAutoUpgrade;
        }
        setPrivacyScore(score) {
          this.scores = null;
          this.privacyScore = typeof score === "number" ? score : UNKNOWN_PRIVACY_SCORE;
        }
        addEntityBlocked(name, prevalence) {
          if (!name) return;
          this.scores = null;
          this.entitiesBlocked[name] = prevalence;
        }
        addEntityNotBlocked(name, prevalence) {
          if (!name) return;
          this.scores = null;
          this.entitiesNotBlocked[name] = prevalence;
        }
        setParentEntity(name, prevalence) {
          this.scores = null;
          this.addEntityNotBlocked(name, prevalence);
        }
        calculate() {
          let siteHttpsScore, enhancedHttpsScore;
          if (this.httpsAutoUpgrade) {
            siteHttpsScore = 0;
            enhancedHttpsScore = 0;
          } else if (this.https) {
            siteHttpsScore = 3;
            enhancedHttpsScore = 0;
          } else {
            siteHttpsScore = 10;
            enhancedHttpsScore = 10;
          }
          const privacyScore = Math.min(this.privacyScore, 10);
          let siteTrackerScore = 0;
          let enhancedTrackerScore = 0;
          for (const entity in this.entitiesBlocked) {
            siteTrackerScore += this._normalizeTrackerScore(this.entitiesBlocked[entity]);
          }
          for (const entity in this.entitiesNotBlocked) {
            siteTrackerScore += this._normalizeTrackerScore(this.entitiesNotBlocked[entity]);
            enhancedTrackerScore += this._normalizeTrackerScore(this.entitiesNotBlocked[entity]);
          }
          const siteTotalScore = siteHttpsScore + siteTrackerScore + privacyScore;
          const enhancedTotalScore = enhancedHttpsScore + enhancedTrackerScore + privacyScore;
          this.scores = {
            site: {
              grade: this._scoreToGrade(siteTotalScore),
              score: siteTotalScore,
              trackerScore: siteTrackerScore,
              httpsScore: siteHttpsScore,
              privacyScore
            },
            enhanced: {
              grade: this._scoreToGrade(enhancedTotalScore),
              score: enhancedTotalScore,
              trackerScore: enhancedTrackerScore,
              httpsScore: enhancedHttpsScore,
              privacyScore
            }
          };
        }
        get() {
          if (!this.scores) this.calculate();
          return this.scores;
        }
        _getValueFromRangeMap(value, rangeMapData) {
          const steps = rangeMapData.steps;
          if (!value || value <= 0) {
            return rangeMapData.zero;
          }
          if (value >= steps[steps.length - 1][0]) {
            return rangeMapData.max;
          }
          for (let i = 0; i < steps.length; i++) {
            if (value < steps[i][0]) {
              return steps[i][1];
            }
          }
        }
        _normalizeTrackerScore(pct) {
          return this._getValueFromRangeMap(pct, TRACKER_RANGE_MAP);
        }
        _scoreToGrade(score) {
          return this._getValueFromRangeMap(score, GRADE_RANGE_MAP);
        }
      };
      module2.exports = Grade2;
    }
  });

  // packages/privacy-grade/src/classes/trackers.js
  var require_trackers = __commonJS({
    "packages/privacy-grade/src/classes/trackers.js"(exports2, module2) {
      "use strict";
      var Trackers = class _Trackers {
        static standardRuleActions = /* @__PURE__ */ new Set(["block", "ignore"]);
        /**
         * @param {{
         *    tldts?: import('tldts'),
         *    tldjs: import('tldts'),
         *    utils: *,
         * }} ops
         */
        constructor(ops) {
          this.tldts = ops.tldts || ops.tldjs;
          this.utils = ops.utils;
        }
        /**
         * @param {{data: *, name: string}[]} lists
         */
        setLists(lists) {
          lists.forEach((list) => {
            if (list.name === "tds") {
              this.entityList = this.processEntityList(list.data.entities);
              this.trackerList = this.processTrackerList(list.data.trackers);
              this.domains = list.data.domains;
              this.cnames = list.data.cnames;
            } else if (list.name === "surrogates") {
              this.surrogateList = this.processSurrogateList(list.data);
            }
          });
        }
        /**
         * @param {Record<string, TrackerObj>} data
         * @returns {*}
         */
        processTrackerList(data) {
          for (const name in data) {
            if (data[name].rules) {
              for (const i in data[name].rules) {
                data[name].rules[i].rule = new RegExp(data[name].rules[i].rule, "ig");
              }
            }
          }
          return data;
        }
        /**
         * @param {Record<string, EntityData>} data
         * @returns {Record<string, string>}
         */
        processEntityList(data) {
          const processed = {};
          for (const entity in data) {
            data[entity].domains.forEach((domain) => {
              processed[domain] = entity;
            });
          }
          return processed;
        }
        /**
         * @param {string} text
         * @returns {Record<string, string>}
         */
        processSurrogateList(text) {
          const b64dataheader = "data:application/javascript;base64,";
          const surrogateList = {};
          const splitSurrogateList = text.trim().split("\n\n");
          splitSurrogateList.forEach((sur) => {
            const lines = sur.split("\n").filter((line) => {
              return !/^#.*/.test(line);
            });
            const firstLine = lines.shift();
            if (!firstLine) {
              return;
            }
            const pattern = firstLine.split(" ")[0].split("/")[1];
            const b64surrogate = btoa(lines.join("\n").toString());
            surrogateList[pattern] = b64dataheader + b64surrogate;
          });
          return surrogateList;
        }
        /**
         * @param {string} url
         * @returns {{fromCname: string | undefined, finalURL: string}}
         */
        resolveCname(url) {
          const parsed = this.tldts.parse(url, { allowPrivateDomains: true });
          let finalURL = url;
          let fromCname;
          if (parsed && this.cnames && parsed.domain) {
            let domain = parsed.domain;
            if (parsed.subdomain) {
              domain = parsed.subdomain + "." + domain;
            }
            const finalDomain = this.cnames[domain] || domain;
            finalURL = finalURL.replace(domain, finalDomain);
            if (finalDomain !== domain) {
              fromCname = domain;
            }
          }
          return {
            fromCname,
            finalURL
          };
        }
        /**
         * Copied from extension (FIX)
         * @param {string} urlString
         **/
        getBaseDomain(urlString) {
          const parsedUrl = this.tldts.parse(urlString, { allowPrivateDomains: true });
          return parsedUrl.domain || parsedUrl.hostname;
        }
        /**
         * single object with all of our request and site data split and
         * processed into the correct format for the tracker set/get functions.
         * This avoids repeat calls to split and util functions.
         * @param {string} urlToCheck
         * @param {string} siteUrl
         * @param {RequestExpression} request
         * @returns {RequestData | null}
         */
        getRequestData(urlToCheck, siteUrl, request) {
          const siteDomain = this.getBaseDomain(siteUrl);
          const urlToCheckDomain = this.getBaseDomain(urlToCheck);
          if (!siteDomain || !urlToCheckDomain) {
            return null;
          }
          return {
            siteUrl,
            request,
            sameBaseDomain: siteDomain === urlToCheckDomain,
            siteDomain,
            siteUrlSplit: this.utils.extractHostFromURL(siteUrl).split("."),
            urlToCheck,
            urlToCheckDomain,
            urlToCheckSplit: this.utils.extractHostFromURL(urlToCheck).split(".")
          };
        }
        /**
         * @param {string} url
         * @returns {boolean}
         */
        isSpecialURL(url) {
          let urlObj;
          try {
            urlObj = new URL(url);
          } catch {
            return true;
          }
          const specialProtocols = [
            // Browser specific internal protocols
            "chrome-extension:",
            "chrome-devtools:",
            "chrome-search:",
            "chrome:",
            "edge:",
            "opera:",
            "about:",
            "moz-extension:",
            // Special web protocols
            "file:",
            "javascript:",
            "data:",
            "blob:",
            "view-source:",
            "vbscript:",
            // Safelisted protocol handler schemes (https://html.spec.whatwg.org/#safelisted-scheme)
            "bitcoin:",
            "ftp:",
            "ftps:",
            "geo:",
            "im:",
            "irc:",
            "ircs:",
            "magnet:",
            "mailto:",
            "matrix:",
            "mms:",
            "news:",
            "nntp:",
            "openpgp4fpr:",
            "sftp:",
            "sip:",
            "sms:",
            "smsto:",
            "ssh:",
            "tel:",
            "urn:",
            "webcal:",
            "wtai:",
            "xmpp:"
          ];
          if (urlObj) {
            if (specialProtocols.includes(urlObj.protocol) || // https://html.spec.whatwg.org/#web+-scheme-prefix
            urlObj.protocol.startsWith("web+") || urlObj.hostname === "localhost") {
              return true;
            }
          }
          return false;
        }
        /**
         * @param {string} urlToCheck
         * @param {string} siteUrl
         * @param {RequestExpression} request
         * @param {Set<string>} [supportedCustomRuleActions]
         *   Optional set containing supported "custom" (aka non-standard) rule
         *   actions.
         *   Note: Standard block/ignore rule actions are always supported, and do
         *         not need to be included here. Custom rule actions are only
         *         necessary for features like Click to Load that have their own
         *         special rule actions.
         *         @see {Trackers.prototype.standardRuleActions}.
         * @returns {TrackerData | null}
         */
        getTrackerData(urlToCheck, siteUrl, request, supportedCustomRuleActions) {
          if (!this.entityList || !this.trackerList) {
            throw new Error("tried to detect trackers before rules were loaded");
          }
          if (this.isSpecialURL(urlToCheck) || this.isSpecialURL(siteUrl)) {
            return null;
          }
          let fromCname;
          let requestData = this.getRequestData(urlToCheck, siteUrl, request);
          if (!requestData) {
            return null;
          }
          const sameBaseDomain = requestData.sameBaseDomain;
          let tracker = this.findTracker(requestData);
          if (!tracker) {
            const cnameResolution = this.resolveCname(urlToCheck);
            const cnameRequestData = this.getRequestData(cnameResolution.finalURL, siteUrl, request);
            if (cnameResolution.fromCname && cnameRequestData) {
              tracker = this.findTracker(cnameRequestData);
              if (tracker) {
                fromCname = cnameResolution.fromCname;
                requestData = cnameRequestData;
              }
            }
          }
          const fullTrackerDomain = requestData.urlToCheckSplit.join(".");
          const requestOwner = this.findTrackerOwner(requestData.urlToCheckDomain);
          const websiteOwner = this.findWebsiteOwner(requestData);
          const sameEntity = requestOwner && websiteOwner ? requestOwner === websiteOwner : requestData.siteDomain === requestData.urlToCheckDomain;
          if (!tracker) {
            const owner = {
              name: requestOwner || requestData.urlToCheckDomain || "unknown",
              displayName: requestOwner || requestData.urlToCheckDomain || "Unknown"
            };
            const trackerObj = {
              domain: fullTrackerDomain,
              owner,
              prevalence: 0,
              fingerprinting: 0,
              cookies: 0,
              categories: [],
              default: "none",
              rules: []
            };
            return {
              action: trackerObj.default,
              reason: "",
              sameEntity,
              sameBaseDomain,
              redirectUrl: "",
              matchedRule: null,
              matchedRuleException: false,
              tracker: trackerObj,
              fullTrackerDomain,
              fromCname
            };
          }
          const matchedRule = this.findRule(tracker, requestData, supportedCustomRuleActions);
          const redirectUrl = matchedRule && matchedRule.surrogate ? this.surrogateList[matchedRule.surrogate] : false;
          const matchedRuleException = matchedRule ? this.matchesRuleDefinition(matchedRule, "exceptions", requestData) : false;
          const { action, reason } = this.getAction({
            sameEntity,
            matchedRule,
            matchedRuleException,
            defaultAction: tracker.default,
            redirectUrl
          });
          return {
            action,
            reason,
            sameEntity,
            sameBaseDomain,
            redirectUrl,
            matchedRule,
            matchedRuleException,
            tracker,
            fullTrackerDomain,
            fromCname
          };
        }
        /**
         * Pull subdomains off of the request rule and look for a matching tracker object in our data
         * @param {{urlToCheckSplit: string[]}} urlToCheckObject
         * @returns {undefined | TrackerObj}
         */
        findTracker(urlToCheckObject) {
          if (!this.trackerList) {
            throw new Error("tried to detect trackers before rules were loaded");
          }
          const urlList = Array.from(urlToCheckObject.urlToCheckSplit);
          while (urlList.length > 1) {
            const trackerDomain = urlList.join(".");
            urlList.shift();
            const matchedTracker = this.trackerList[trackerDomain];
            if (matchedTracker) {
              return matchedTracker;
            }
          }
        }
        /**
         * @param {string} trackerDomain
         * @returns {string | undefined}
         */
        findTrackerOwner(trackerDomain) {
          return this.entityList[trackerDomain];
        }
        /**
         * Set parent and first party values on tracker
         * @param {{siteUrlSplit: string[]}} siteUrlSplitObject
         * @returns {string | undefined}
         */
        findWebsiteOwner(siteUrlSplitObject) {
          const siteUrlList = Array.from(siteUrlSplitObject.siteUrlSplit);
          while (siteUrlList.length > 1) {
            const siteToCheck = siteUrlList.join(".");
            siteUrlList.shift();
            if (this.entityList[siteToCheck]) {
              return this.entityList[siteToCheck];
            }
          }
        }
        /**
         * Returns false if the given rule has an unsupported rule action, true
         * otherwise.
         * @param {TrackerRule} ruleObj
         * @param {Set<string>} [supportedCustomRuleActions]
         * @returns {boolean}
         */
        ruleActionSupported({ action }, supportedCustomRuleActions) {
          return (
            // Rule action generally defaults to 'block' if omitted.
            !action || // Standard rule actions are always supported.
            _Trackers.standardRuleActions.has(action) || // Provided custom rule actions (if any) are also supported.
            !!supportedCustomRuleActions && supportedCustomRuleActions.has(action)
          );
        }
        /**
         * Iterate through a tracker rule list and return the first matching rule, if any.
         * @param {TrackerObj} tracker
         * @param {RequestData} requestData
         * @param {Set<string>} [supportedCustomRuleActions]
         * @returns {TrackerRule | null}
         */
        findRule(tracker, requestData, supportedCustomRuleActions) {
          let matchedRule = null;
          if (tracker.rules && tracker.rules.length) {
            tracker.rules.some((ruleObj) => {
              if (this.requestMatchesRule(requestData, ruleObj) && this.ruleActionSupported(ruleObj, supportedCustomRuleActions)) {
                matchedRule = ruleObj;
                return true;
              }
              return false;
            });
          }
          return matchedRule;
        }
        /**
         * @param {RequestData} requestData
         * @param {TrackerRule} ruleObj
         * @returns {boolean}
         */
        requestMatchesRule(requestData, ruleObj) {
          if (requestData.urlToCheck.match(ruleObj.rule)) {
            if (ruleObj.options) {
              return this.matchesRuleDefinition(ruleObj, "options", requestData);
            } else {
              return true;
            }
          } else {
            return false;
          }
        }
        /**
         * Check the matched rule options against the request data
         * @param {TrackerRule} rule
         * @param {'exceptions' | 'options'} type
         * @param {RequestData} requestData
         * @returns {boolean} true if all options matched
         */
        matchesRuleDefinition(rule, type, requestData) {
          const ruleDefinition = rule[type];
          if (!ruleDefinition) {
            return false;
          }
          const matchTypes = ruleDefinition.types && ruleDefinition.types.length ? ruleDefinition.types.includes(requestData.request.type) : true;
          const matchDomains = ruleDefinition.domains && ruleDefinition.domains.length ? ruleDefinition.domains.some((domain) => domain.match(requestData.siteDomain)) : true;
          return matchTypes && matchDomains;
        }
        /**
         * @param {{
         *     sameEntity: boolean,
         *     matchedRule: TrackerRule | null,
         *     matchedRuleException: boolean,
         *     defaultAction: ActionName | undefined,
         *     redirectUrl: string | boolean
         * }} tracker
         * @returns {{ action: ActionName, reason: string }}
         */
        getAction(tracker) {
          let action = "ignore";
          let reason = "unknown fallback";
          if (tracker.sameEntity) {
            action = "ignore";
            reason = "first party";
          } else if (tracker.matchedRuleException) {
            action = "ignore";
            reason = "matched rule - exception";
          } else if (!tracker.matchedRule && tracker.defaultAction === "ignore") {
            action = "ignore";
            reason = "default ignore";
          } else if (tracker.matchedRule && tracker.matchedRule.action === "ignore") {
            action = "ignore";
            reason = "matched rule - ignore";
          } else if (!tracker.matchedRule && tracker.defaultAction === "block") {
            action = "block";
            reason = "default block";
          } else if (tracker.matchedRule) {
            if (tracker.redirectUrl) {
              action = "redirect";
              reason = "matched rule - surrogate";
            } else {
              action = "block";
              reason = "matched rule - block";
            }
          }
          return { action, reason };
        }
      };
      module2.exports = Trackers;
    }
  });

  // packages/privacy-grade/index.js
  var require_privacy_grade = __commonJS({
    "packages/privacy-grade/index.js"(exports2, module2) {
      "use strict";
      module2.exports = {
        Grade: require_grade(),
        Trackers: require_trackers()
      };
    }
  });

  // shared/js/background/classes/privacy-dashboard-data.js
  function convertState(action, isSameEntity2) {
    if (action === "none") {
      return { allowed: { reason: "otherThirdPartyRequest" } };
    }
    if (action === "ignore" || action === "ignore-user") {
      if (isSameEntity2) {
        return { allowed: { reason: "ownedByFirstParty" } };
      }
      return { allowed: { reason: "ruleException" } };
    }
    if (action === "ad-attribution") {
      return { allowed: { reason: "adClickAttribution" } };
    }
    if (action === "block") {
      return { blocked: {} };
    }
    if (action === "redirect") {
      return { blocked: {} };
    }
    const _output = action;
    return null;
  }
  var init_privacy_dashboard_data = __esm({
    "shared/js/background/classes/privacy-dashboard-data.js"() {
      "use strict";
      init_i18n();
    }
  });

  // shared/js/background/classes/tracker.js
  var tracker_exports = {};
  __export(tracker_exports, {
    Tracker: () => Tracker
  });
  var import_constants, Companies, Tracker;
  var init_tracker = __esm({
    "shared/js/background/classes/tracker.js"() {
      "use strict";
      import_constants = __toESM(require_constants());
      init_privacy_dashboard_data();
      init_tds();
      Companies = require_companies();
      Tracker = class _Tracker {
        /**
         * @param {TrackerData | null} t
         */
        constructor(t2) {
          this.urls = {};
          this.count = 0;
          if (!t2) {
            return;
          }
          if (!t2.tracker) {
            throw new Error("Tracker object required for Tracker constructor");
          }
          this.parentCompany = Companies.get(t2.tracker.owner.ownedBy || t2.tracker.owner.name);
          this.displayName = this.parentCompany?.displayName || t2.tracker.owner.displayName;
          this.prevalence = tds_default.tds.entities[t2.tracker.owner.name]?.prevalence;
        }
        /**
         * A parent company may try to track you through many different entities.
         * We store a list of all unique urls here.
         * @param {TrackerData} t
         * @param {string} tabUrl
         * @param {string} baseDomain
         * @param {string} url
         */
        addTrackerUrl(t2, tabUrl, baseDomain, url) {
          if (t2.sameBaseDomain) {
            return;
          }
          this.count += 1;
          const key = t2.fullTrackerDomain + ":" + t2.action;
          if (this.urls[key]) return;
          const state = convertState(t2.action, t2.sameEntity);
          if (!state) return;
          const category = t2.tracker?.categories?.find((trackerRadarCategory) => import_constants.default.displayCategories.includes(trackerRadarCategory));
          const detectedRequest = {
            action: t2.action,
            url,
            eTLDplus1: baseDomain,
            pageUrl: tabUrl,
            entityName: this.displayName,
            prevalence: this.prevalence,
            ownerName: this.parentCompany?.name,
            category,
            state
          };
          this.urls[key] = detectedRequest;
        }
        /**
         * @param {Tracker} data
         * @returns {Tracker}
         */
        static restore(data) {
          const tracker = new _Tracker(null);
          for (const [key, value] of Object.entries(data)) {
            tracker[key] = value;
          }
          return tracker;
        }
      };
    }
  });

  // packages/ddg2dnr/lib/rulePriorities.js
  var require_rulePriorities = __commonJS({
    "packages/ddg2dnr/lib/rulePriorities.js"(exports2) {
      "use strict";
      exports2.AD_ATTRIBUTION_POLICY_PRIORITY = 3e4;
      exports2.SERVICE_WORKER_INITIATED_ALLOWING_PRIORITY = 1e6;
      exports2.USER_ALLOWLISTED_PRIORITY = 1e6;
      exports2.ATB_PARAM_PRIORITY = 2e6;
      exports2.NEWTAB_TRACKER_STATS_REDIRECT_PRIORITY = 2e6;
    }
  });

  // packages/ddg2dnr/lib/utils.js
  var require_utils = __commonJS({
    "packages/ddg2dnr/lib/utils.js"(exports2) {
      "use strict";
      var cnameDomainAnchor = "[a-z]+://[^/?]*";
      var cnameDomainAnchorCompatibleRuleSuffix = /^(:[0-9]+)?[/?]/;
      var regularExpressionChars = /* @__PURE__ */ new Set([".", "*", "+", "?", "{", "}", "[", "]", "{", "}"]);
      function storeInMapLookup(lookup, key, values) {
        let storedValues = lookup.get(key);
        if (!storedValues) {
          storedValues = [];
          lookup.set(key, storedValues);
        }
        for (const value of values) {
          storedValues.push(value);
        }
      }
      function storeInObjectLookup(lookup, key, values) {
        let storedValues = lookup[key];
        if (!storedValues) {
          storedValues = [];
          lookup[key] = storedValues;
        }
        for (const value of values) {
          storedValues.push(value);
        }
      }
      function storeInLookup(lookup, key, values) {
        if (lookup instanceof Map) {
          storeInMapLookup(lookup, key, values);
        } else {
          storeInObjectLookup(lookup, key, values);
        }
      }
      function castDNREnum(s) {
        return s;
      }
      function generateDNRRule5({
        id,
        priority,
        actionType,
        redirect,
        requestHeaders,
        responseHeaders,
        urlFilter,
        regexFilter,
        resourceTypes: resourceTypes2,
        excludedResourceTypes,
        requestDomains,
        excludedRequestDomains,
        initiatorDomains,
        excludedInitiatorDomains,
        matchCase = false,
        tabIds,
        excludedTabIds,
        requestMethods,
        excludedRequestMethods
      }) {
        const dnrRule = {
          priority,
          action: {
            type: actionType
          },
          condition: {}
        };
        if (typeof id === "number") {
          dnrRule.id = id;
        }
        if (requestDomains && requestDomains.length > 0) {
          dnrRule.condition.requestDomains = requestDomains;
        }
        if (actionType === "redirect" && redirect) {
          dnrRule.action.redirect = redirect;
        }
        if (actionType === "modifyHeaders") {
          if (requestHeaders && requestHeaders.length > 0) {
            dnrRule.action.requestHeaders = requestHeaders;
          }
          if (responseHeaders && responseHeaders.length > 0) {
            dnrRule.action.responseHeaders = responseHeaders;
          }
        }
        if (urlFilter) {
          dnrRule.condition.urlFilter = urlFilter;
          if (urlFilter[0] === "|" && urlFilter[1] === "|") {
            delete dnrRule.condition.requestDomains;
          }
          if (!matchCase) {
            dnrRule.condition.isUrlFilterCaseSensitive = false;
          }
        } else if (regexFilter) {
          dnrRule.condition.regexFilter = regexFilter;
          if (!matchCase) {
            dnrRule.condition.isUrlFilterCaseSensitive = false;
          }
        }
        if (resourceTypes2 && resourceTypes2.length > 0) {
          dnrRule.condition.resourceTypes = resourceTypes2;
        }
        if (excludedResourceTypes && excludedResourceTypes.length > 0) {
          dnrRule.condition.excludedResourceTypes = excludedResourceTypes;
        }
        if (initiatorDomains && initiatorDomains.length > 0) {
          dnrRule.condition.initiatorDomains = initiatorDomains;
        }
        if (excludedRequestDomains && excludedRequestDomains.length > 0) {
          dnrRule.condition.excludedRequestDomains = excludedRequestDomains;
        }
        if (excludedInitiatorDomains && excludedInitiatorDomains.length > 0 && actionType !== "allow") {
          if (excludedInitiatorDomains.length === 1 && requestDomains && requestDomains.length === 1) {
            dnrRule.condition.domainType = castDNREnum("thirdParty");
          } else {
            dnrRule.condition.excludedInitiatorDomains = excludedInitiatorDomains;
          }
        }
        if (tabIds && tabIds.length > 0) {
          dnrRule.condition.tabIds = tabIds;
        }
        if (excludedTabIds && excludedTabIds.length > 0) {
          dnrRule.condition.excludedTabIds = excludedTabIds;
        }
        if (requestMethods && requestMethods.length > 0) {
          dnrRule.condition.requestMethods = requestMethods;
        }
        if (excludedRequestMethods && excludedRequestMethods.length > 0) {
          dnrRule.condition.excludedRequestMethods = excludedRequestMethods;
        }
        return dnrRule;
      }
      function alphaChar(charCode) {
        return charCode >= 97 && charCode <= 122 || charCode >= 65 && charCode <= 90;
      }
      function parseRegexTrackerRule(domain, trackerRule) {
        let requiresRegexFilter = false;
        let urlFilter = "";
        let afterDomainRuleIndex = -1;
        let lastAlphaIndex = -1;
        let escaped = false;
        let previousCharWasPeriod = false;
        for (let i = 0; i < trackerRule.length; i++) {
          const char = trackerRule[i];
          const charCode = char.charCodeAt(0);
          if (domain && urlFilter.length === domain.length && afterDomainRuleIndex === -1) {
            afterDomainRuleIndex = i;
          }
          if (escaped) {
            if (char === "*") {
              requiresRegexFilter = true;
              continue;
            }
            if (alphaChar(charCode)) {
              lastAlphaIndex = i;
            }
            escaped = false;
            urlFilter += char;
            continue;
          }
          if (char === "\\") {
            escaped = true;
            continue;
          }
          if (char === ".") {
            previousCharWasPeriod = true;
            continue;
          }
          if (char === "*" && previousCharWasPeriod) {
            urlFilter += "*";
            previousCharWasPeriod = false;
            continue;
          }
          if (regularExpressionChars.has(char) || previousCharWasPeriod) {
            requiresRegexFilter = true;
            continue;
          }
          if (alphaChar(charCode)) {
            lastAlphaIndex = i;
          }
          urlFilter += char;
        }
        if (previousCharWasPeriod) {
          requiresRegexFilter = true;
        }
        return {
          requiresRegexFilter,
          urlFilter,
          afterDomainRuleIndex,
          lastAlphaIndex
        };
      }
      function processRegexTrackerRule(domain, trackerRule, matchCnames) {
        if (!trackerRule) {
          return {};
        }
        let { requiresRegexFilter, urlFilter, afterDomainRuleIndex, lastAlphaIndex } = parseRegexTrackerRule(domain, trackerRule);
        let regexFilter = trackerRule;
        let matchCase = false;
        let usedRegexForWorkaround = false;
        if (domain && urlFilter.startsWith(domain)) {
          if (urlFilter.length === domain.length) {
            return {};
          }
          matchCase = lastAlphaIndex < afterDomainRuleIndex;
          if (urlFilter[domain.length] === "*") {
            regexFilter = regexFilter.substr(afterDomainRuleIndex + 2);
            urlFilter = urlFilter.substr(domain.length + 1);
          } else {
            if (matchCnames && afterDomainRuleIndex > -1 && cnameDomainAnchorCompatibleRuleSuffix.test(urlFilter.substr(domain.length))) {
              usedRegexForWorkaround = true;
              regexFilter = cnameDomainAnchor + trackerRule.substr(afterDomainRuleIndex);
            }
            urlFilter = "||" + urlFilter;
          }
        } else {
          matchCase = lastAlphaIndex === -1;
        }
        if (requiresRegexFilter) {
          return { regexFilter, matchCase };
        }
        if (usedRegexForWorkaround) {
          return { regexFilter, matchCase, fallbackUrlFilter: urlFilter };
        }
        return { urlFilter, matchCase };
      }
      function processPlaintextTrackerRule(domain, trackerRule) {
        let urlFilter = trackerRule;
        if (domain && urlFilter.startsWith(domain)) {
          urlFilter = "||" + urlFilter;
        }
        const matchCase = false;
        return { urlFilter, matchCase };
      }
      function getTrackerEntryDomain(trackerEntries, domain, skipSubdomains = 0) {
        let i = domain[0] === "." ? 0 : -1;
        do {
          domain = domain.substr(i + 1);
          i = domain.indexOf(".");
          if (skipSubdomains > 0) {
            skipSubdomains -= 1;
            continue;
          }
          const trackerEntry = trackerEntries[domain];
          if (trackerEntry) {
            return domain;
          }
        } while (i > -1);
        return null;
      }
      function generateRequestDomainsByTrackerDomain(tds) {
        const requestDomainsByTrackerDomain = /* @__PURE__ */ new Map();
        for (const trackerDomain of Object.keys(tds.trackers)) {
          storeInLookup(requestDomainsByTrackerDomain, trackerDomain, [trackerDomain]);
        }
        for (const [domain, cname] of Object.entries(tds.cnames)) {
          const trackerEntryDomain = getTrackerEntryDomain(tds.trackers, cname);
          if (trackerEntryDomain) {
            if (getTrackerEntryDomain(tds.trackers, domain, 1)) {
              continue;
            }
            storeInLookup(requestDomainsByTrackerDomain, trackerEntryDomain, [domain]);
          }
        }
        return requestDomainsByTrackerDomain;
      }
      var resourceTypes = /* @__PURE__ */ new Set([
        "main_frame",
        "sub_frame",
        "stylesheet",
        "script",
        "image",
        "font",
        "object",
        "xmlhttprequest",
        "ping",
        "csp_report",
        "media",
        "websocket",
        "webtransport",
        "webbundle",
        "other"
      ]);
      exports2.castDNREnum = castDNREnum;
      exports2.generateDNRRule = generateDNRRule5;
      exports2.generateRequestDomainsByTrackerDomain = generateRequestDomainsByTrackerDomain;
      exports2.getTrackerEntryDomain = getTrackerEntryDomain;
      exports2.processRegexTrackerRule = processRegexTrackerRule;
      exports2.processPlaintextTrackerRule = processPlaintextTrackerRule;
      exports2.resourceTypes = resourceTypes;
      exports2.storeInLookup = storeInLookup;
    }
  });

  // shared/js/background/classes/ad-click-attribution-policy.js
  var ad_click_attribution_policy_exports = {};
  __export(ad_click_attribution_policy_exports, {
    AdClick: () => AdClick,
    AdClickAttributionPolicy: () => AdClickAttributionPolicy,
    sendPageloadsWithAdAttributionPixelAndResetCount: () => sendPageloadsWithAdAttributionPixelAndResetCount
  });
  async function sendPageloadsWithAdAttributionPixelAndResetCount() {
    await import_settings3.default.ready();
    const count = import_settings3.default.getSetting("m_pageloads_with_ad_attribution.count");
    if (typeof count === "number" && count > 0) {
      await sendPixelRequest("m_pageloads_with_ad_attribution", {
        count
      });
    }
    import_settings3.default.updateSetting("m_pageloads_with_ad_attribution.count", 0);
  }
  var import_rulePriorities, import_utils3, import_settings3, getFeatureSettings2, getBaseDomain2, browserWrapper, getNextSessionRuleId2, appVersion, manifestVersion, AdClickAttributionPolicy, AdClick;
  var init_ad_click_attribution_policy = __esm({
    "shared/js/background/classes/ad-click-attribution-policy.js"() {
      "use strict";
      import_rulePriorities = __toESM(require_rulePriorities());
      import_utils3 = __toESM(require_utils());
      import_settings3 = __toESM(require_settings());
      init_pixels();
      ({ getFeatureSettings: getFeatureSettings2, getBaseDomain: getBaseDomain2 } = (init_utils(), __toCommonJS(utils_exports)));
      browserWrapper = (init_wrapper(), __toCommonJS(wrapper_exports));
      ({ getNextSessionRuleId: getNextSessionRuleId2 } = (init_dnr_session_rule_id(), __toCommonJS(dnr_session_rule_id_exports)));
      appVersion = browserWrapper.getExtensionVersion();
      manifestVersion = browserWrapper.getManifestVersion();
      AdClickAttributionPolicy = class {
        constructor() {
          const policy = getFeatureSettings2("adClickAttribution");
          this.linkFormats = policy.linkFormats || [];
          this.allowlist = policy.allowlist || [];
          this.navigationExpiration = policy.navigationExpiration || 0;
          this.totalExpiration = policy.totalExpiration || 0;
          this.domainDetectionEnabled = policy.domainDetection === "enabled";
          this.heuristicDetectionEnabled = policy.heuristicDetection === "enabled";
        }
        /**
         * @param {URL} resourceURL
         * @returns {AdClickAttributionLinkFormat | undefined}
         */
        getMatchingLinkFormat(resourceURL) {
          const hostnameAndPath = resourceURL.hostname + resourceURL.pathname;
          for (const linkFormat of this.linkFormats) {
            if (hostnameAndPath === linkFormat.url) {
              if (linkFormat.adDomainParameterName) {
                const parameterDomain = resourceURL.searchParams.get(linkFormat.adDomainParameterName);
                if (parameterDomain !== null) {
                  return linkFormat;
                }
              }
            }
          }
        }
        /**
         * Constructs an AdClick object to be stored on the tab if the load is a valid ad click link format.
         * @param {string} resourcePath
         * @param {Tab} tab
         * @returns {AdClick | undefined}
         */
        createAdClick(resourcePath, tab) {
          let resourceURL;
          try {
            resourceURL = new URL(resourcePath);
          } catch {
            return;
          }
          const linkFormat = this.getMatchingLinkFormat(resourceURL);
          if (!linkFormat) return;
          const adClick = new AdClick(
            this.navigationExpiration,
            this.totalExpiration,
            this.allowlist,
            this.heuristicDetectionEnabled,
            this.domainDetectionEnabled
          );
          if (manifestVersion === 3) {
            adClick.createDNR(tab.id);
          }
          if (linkFormat.adDomainParameterName) {
            const parameterDomain = resourceURL.searchParams.get(linkFormat.adDomainParameterName);
            if (parameterDomain && this.domainDetectionEnabled) {
              const parsedParameterDomain = getBaseDomain2(parameterDomain);
              if (parsedParameterDomain) {
                adClick.setAdBaseDomain(parsedParameterDomain);
                adClick.parameterAdBaseDomain = parsedParameterDomain;
              }
            }
          }
          if (this.heuristicDetectionEnabled && !adClick.parameterAdBaseDomain) {
            adClick.adClickRedirect = true;
          }
          return adClick;
        }
        /**
         * @param {string} resourcePath
         * @returns {boolean}
         */
        resourcePermitted(resourcePath) {
          let resourceURL;
          try {
            resourceURL = new URL(resourcePath);
          } catch {
            return true;
          }
          for (const allowlistItem of this.allowlist) {
            if (resourceURL.hostname === allowlistItem.host || resourceURL.hostname.endsWith("." + allowlistItem.host)) {
              return true;
            }
          }
          return false;
        }
      };
      AdClick = class _AdClick {
        /**
         * @param {number} navigationExpiration in seconds
         * @param {number} totalExpiration in seconds
         * @param {any} allowlist
         * @param {boolean} heuristicDetectionEnabled
         * @param {boolean} domainDetectionEnabled
         */
        constructor(navigationExpiration, totalExpiration, allowlist, heuristicDetectionEnabled, domainDetectionEnabled) {
          this.adBaseDomain = null;
          this.parameterAdBaseDomain = null;
          this.adClickRedirect = false;
          this.navigationExpiration = navigationExpiration;
          this.totalExpiration = totalExpiration;
          this.expires = Date.now() + this.totalExpiration * 1e3;
          this.clickExpires = Date.now() + this.navigationExpiration * 1e3;
          this.allowlist = allowlist;
          this.adClickDNR = null;
          this.heuristicDetectionEnabled = heuristicDetectionEnabled;
          this.domainDetectionEnabled = domainDetectionEnabled;
          this.adClickDetectedPixelSent = false;
          this.adClickActivePixelSent = false;
        }
        clone() {
          const adClick = new _AdClick(
            this.navigationExpiration,
            this.totalExpiration,
            this.allowlist,
            this.heuristicDetectionEnabled,
            this.domainDetectionEnabled
          );
          adClick.adBaseDomain = this.adBaseDomain;
          adClick.parameterAdBaseDomain = this.parameterAdBaseDomain;
          adClick.adClickRedirect = this.adClickRedirect;
          adClick.expires = this.expires;
          adClick.clickExpires = Date.now() + this.navigationExpiration * 1e3;
          adClick.adClickDNR = this.adClickDNR;
          adClick.adClickDetectedPixelSent = this.adClickDetectedPixelSent;
          adClick.adClickActivePixelSent = this.adClickActivePixelSent;
          return adClick;
        }
        /**
         * Propagate an adclick to a new tab, used when a user navigates to a new tab.
         * @param {number} tabId
         * @returns {AdClick} adClick
         */
        propagate(tabId) {
          const adClick = this.clone();
          if (this.adClickDNR) {
            this.createDNR(tabId);
          }
          return adClick;
        }
        static restore(adClick) {
          const restoredAdClick = new _AdClick(
            adClick.navigationExpiration,
            adClick.totalExpiration,
            adClick.allowlist,
            adClick.heuristicDetectionEnabled,
            adClick.domainDetectionEnabled
          );
          restoredAdClick.adBaseDomain = adClick.adBaseDomain;
          restoredAdClick.parameterAdBaseDomain = adClick.parameterAdBaseDomain;
          restoredAdClick.adClickRedirect = adClick.adClickRedirect;
          restoredAdClick.expires = adClick.expires;
          restoredAdClick.clickExpires = adClick.clickExpires;
          restoredAdClick.adClickDNR = adClick.adClickDNR;
          restoredAdClick.adClickDetectedPixelSent = adClick.adClickDetectedPixelSent;
          restoredAdClick.adClickActivePixelSent = adClick.adClickActivePixelSent;
          return restoredAdClick;
        }
        /**
         * @param {string} domain
         **/
        setAdBaseDomain(domain) {
          this.adBaseDomain = domain;
          this.adClickRedirect = false;
          if (this.adClickDNR) {
            this.updateDNRInitiator(domain);
          }
        }
        /**
         * Send this AdClick's 'm_ad_click_detected' pixel request, if it hasn't
         * been sent already.
         * @param {string?} heuristicAdBaseDomain
         */
        sendAdClickDetectedPixel(heuristicAdBaseDomain) {
          if (this.adClickDetectedPixelSent) {
            return;
          }
          if (!this.heuristicDetectionEnabled && heuristicAdBaseDomain) {
            heuristicAdBaseDomain = null;
          }
          let domainDetection = "none";
          if (this.parameterAdBaseDomain && heuristicAdBaseDomain) {
            if (this.parameterAdBaseDomain === heuristicAdBaseDomain) {
              domainDetection = "matched";
            } else {
              domainDetection = "mismatch";
            }
          } else if (this.parameterAdBaseDomain) {
            domainDetection = "serp_only";
          } else if (heuristicAdBaseDomain) {
            domainDetection = "heuristic_only";
          }
          sendPixelRequest("m_ad_click_detected", {
            appVersion,
            domainDetection,
            heuristicDetectionEnabled: this.heuristicDetectionEnabled ? "1" : "0",
            domainDetectionEnabled: this.domainDetectionEnabled ? "1" : 0
          });
          this.adClickDetectedPixelSent = true;
        }
        /**
         * @param {Tab} tab
         * @returns {boolean} true if a new tab should have the ad attribution policy applied
         */
        shouldPropagateAdClickForNewTab(tab) {
          if (tab.site.baseDomain === this.adBaseDomain) {
            return this.hasNotExpired();
          }
          return false;
        }
        /**
         * @param {Tab} tab
         * @returns {boolean} true if a new navigation should have the ad attribution policy applied
         */
        shouldPropagateAdClickForNavigation(tab) {
          if (tab.site.baseDomain !== this.adBaseDomain) {
            return this.clickExpires > Date.now();
          }
          return this.hasNotExpired();
        }
        hasNotExpired() {
          if (this.expires > Date.now()) {
            return true;
          } else {
            this.removeDNR();
            return false;
          }
        }
        /**
         * Check if this AdClick is active for the tab and currently allowing
         * requests. Returns true if it hasn't expired and the ad domain matches the
         * tab domain.
         * @param {Tab} tab
         * @returns {boolean}
         */
        allowAdAttribution(tab) {
          return tab.site.baseDomain === this.adBaseDomain && this.hasNotExpired();
        }
        /**
         * Called when a request has been allowed by the AdClickAttributionPolicy
         * (only happens when this AdClick is active for the tab). Takes care of
         * some housekeeping for the ad_attribution pixels.
         * @param {Tab} tab
         */
        requestWasAllowed(tab) {
          if (!tab.firstAdAttributionAllowed) {
            import_settings3.default.incrementNumericSetting("m_pageloads_with_ad_attribution.count");
            tab.firstAdAttributionAllowed = true;
          }
          if (!this.adClickActivePixelSent) {
            sendPixelRequest("m_ad_click_active", { appVersion });
            this.adClickActivePixelSent = true;
          }
        }
        getAdClickDNR(tabId) {
          const id = getNextSessionRuleId2();
          if (typeof id !== "number") {
            console.error("Failed to create ad click attribution rule.");
            return;
          }
          const adClickDNR = {
            rule: (0, import_utils3.generateDNRRule)({
              id,
              priority: import_rulePriorities.AD_ATTRIBUTION_POLICY_PRIORITY,
              actionType: "allow",
              requestDomains: this.allowlist.map((entry) => entry.host)
            })
          };
          adClickDNR.rule.condition.tabIds = [tabId];
          return adClickDNR;
        }
        updateDNRInitiator(domain) {
          if (this.adClickDNR && domain) {
            this.adClickDNR.rule.condition.initiatorDomains = [domain];
            this.updateDNR();
          }
        }
        createDNR(tabId) {
          const adClickDNR = this.getAdClickDNR(tabId);
          if (adClickDNR) {
            this.adClickDNR = adClickDNR;
            chrome.declarativeNetRequest.updateSessionRules({
              addRules: [this.adClickDNR.rule]
            });
          }
        }
        updateDNR() {
          if (this.adClickDNR) {
            chrome.declarativeNetRequest.updateSessionRules({
              removeRuleIds: [this.adClickDNR.rule.id],
              addRules: [this.adClickDNR.rule]
            });
          }
        }
        removeDNR() {
          if (this.adClickDNR) {
            chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: [this.adClickDNR.rule.id] });
          }
        }
      };
    }
  });

  // shared/js/background/classes/tab-state.js
  var tab_state_exports = {};
  __export(tab_state_exports, {
    TabState: () => TabState
  });
  var TabState, StorageInstance, Storage;
  var init_tab_state = __esm({
    "shared/js/background/classes/tab-state.js"() {
      "use strict";
      init_wrapper();
      init_i18n();
      init_tracker();
      init_ad_click_attribution_policy();
      TabState = class _TabState {
        /**
         * @param {import('./tab').TabData} tabData
         */
        constructor(tabData, restoring = false) {
          this.tabId = tabData.tabId;
          this.url = tabData.url;
          this.upgradedHttps = false;
          this.hasHttpsError = false;
          this.mainFrameUpgraded = false;
          this.urlParametersRemoved = false;
          this.urlParametersRemovedUrl = null;
          this.ampUrl = null;
          this.cleanAmpUrl = null;
          this.requestId = tabData.requestId;
          this.status = tabData.status;
          this.statusCode = null;
          this.adClick = null;
          this.firstAdAttributionAllowed = false;
          this.trackers = {};
          this.referrer = null;
          this.disabledClickToLoadRuleActions = [];
          this.dnrRuleIdsByDisabledClickToLoadRuleAction = {};
          this.ctlYouTube = false;
          this.ctlFacebookPlaceholderShown = false;
          this.ctlFacebookLogin = false;
          this.allowlisted = false;
          this.allowlistOptIn = false;
          this.denylisted = false;
          this.debugFlags = [];
          this.errorDescriptions = [];
          this.httpErrorCodes = [];
          this.performanceWarning = false;
          this.userRefreshCount = 0;
          this.openerContext = null;
          this.jsPerformance = [];
          this.locale = getFullUserLocale();
          if (!restoring) {
            Storage.backup(this);
          }
        }
        static async done() {
          await Storage.done();
        }
        /**
         * @template {InstanceType<typeof TabState>} T
         * @template {keyof T} K
         * @param {K} key
         * @param {T[K]} value
         */
        setValue(key, value) {
          this[key] = value;
          Storage.backup(this);
        }
        /**
         * Restores a tab state from storage.
         * @param {number} tabId
         * @returns {Promise<TabState | null>}
         */
        static async restore(tabId) {
          const data = await Storage.get(tabId);
          if (!data) {
            return null;
          }
          let parsedData;
          try {
            parsedData = JSON.parse(data);
          } catch (e) {
            console.error("Error parsing tab state", e);
            return null;
          }
          const state = new _TabState(parsedData, true);
          for (const [key, value] of Object.entries(parsedData)) {
            if (key === "trackers") {
              const trackers3 = {};
              for (const trackerKey of Object.keys(value)) {
                const tracker = parsedData[key][trackerKey];
                trackers3[trackerKey] = Tracker.restore(tracker);
              }
              state[key] = trackers3;
            } else if (key === "adClick" && value) {
              state[key] = AdClick.restore(value);
            } else {
              state[key] = value;
            }
          }
          await Storage.backup(state);
          return state;
        }
        /**
         * Used for removing the stored tab state.
         * @param {number} tabId
         */
        static async delete(tabId) {
          await Storage.delete(tabId);
        }
      };
      StorageInstance = class _StorageInstance {
        taskQueue = [];
        processing = false;
        /**
         * Awaits until the storage queue is empty.
         * @returns {Promise<void>}
         */
        async done() {
          const queue = this.taskQueue;
          await Promise.all(queue);
        }
        /**
         * Adds a task to the storage queue, prevents tasks from being executed in parallel.
         * Returns the result of the task.
         * Please handle the error handling of the task method yourself.
         * @template T
         * @param {() => Promise<T>} task
         * @returns {Promise<T>}
         */
        async _addTask(task) {
          let done = (_) => {
          };
          this.taskQueue.push(async () => {
            const value = await Promise.resolve(task());
            done(value);
          });
          this.processQueue();
          return new Promise((resolve) => {
            done = resolve;
          });
        }
        /**
         * Processes the storage queue in order.
         */
        async processQueue() {
          if (!this.processing) {
            while (this.taskQueue.length > 0) {
              this.processing = true;
              const task = this.taskQueue.shift();
              await task();
            }
            this.processing = false;
          }
        }
        /**
         * Returns a string key for the storage lookup of a tab.
         * @param {number} tabId
         * @returns {string}
         */
        static _getStorageKey(tabId) {
          return `tabState-${tabId}`;
        }
        /**
         * Deletes a tab-state from session storage.
         * @param {number} tabId
         */
        async delete(tabId) {
          await this._addTask(async () => {
            try {
              await removeFromSessionStorage(_StorageInstance._getStorageKey(tabId));
            } catch (e) {
              console.error("Removal of tab state failed", e);
            }
          });
        }
        /**
         * Gets a serialized tab-state from session storage.
         * @param {number} tabId
         * @returns {Promise<string | undefined>}
         */
        async get(tabId) {
          return this._addTask(async () => {
            try {
              return getFromSessionStorage(_StorageInstance._getStorageKey(tabId));
            } catch (e) {
              console.error("Retrieval of tab state failed", e);
              return void 0;
            }
          });
        }
        /**
         * @param {TabState} tabState
         * @returns {Promise<void>}
         */
        async backup(tabState) {
          await this._addTask(async () => {
            try {
              await setToSessionStorage(_StorageInstance._getStorageKey(tabState.tabId), JSON.stringify(tabState));
            } catch (e) {
              console.error("Storage of tab state failed", e);
            }
          });
        }
      };
      Storage = new StorageInstance();
    }
  });

  // shared/js/background/classes/site.js
  var site_exports = {};
  __export(site_exports, {
    default: () => Site
  });
  var import_tldts2, settings5, utils, tdsStorage, privacyPractices, Grade, browserWrapper2, TabState2, Site;
  var init_site = __esm({
    "shared/js/background/classes/site.js"() {
      "use strict";
      import_tldts2 = __toESM(require_cjs());
      settings5 = require_settings();
      utils = (init_utils(), __toCommonJS(utils_exports));
      tdsStorage = (init_tds(), __toCommonJS(tds_exports)).default;
      privacyPractices = require_privacy_practices();
      Grade = require_privacy_grade().Grade;
      browserWrapper2 = (init_wrapper(), __toCommonJS(wrapper_exports));
      ({ TabState: TabState2 } = (init_tab_state(), __toCommonJS(tab_state_exports)));
      Site = class {
        constructor(url, tabState) {
          if (!tabState) {
            tabState = new TabState2({ tabId: 1, url, status: "complete" });
          }
          this.url = url || "";
          this._tabState = tabState;
          this.trackerUrls = [];
          this.grade = new Grade();
          this.setListStatusFromGlobal();
          this.didIncrementCompaniesData = false;
          this.tosdr = privacyPractices.getTosdr(this.domain);
          if (this.parentEntity && this.parentPrevalence) {
            this.grade.setParentEntity(this.parentEntity, this.parentPrevalence);
          }
          if ("parent" in globalThis) {
            this.grade.setPrivacyScore(privacyPractices.getTosdrScore(this.domain, parent));
          }
          if (this.url.match(/^https:\/\//)) {
            this.grade.setHttps(true, true);
          }
          this.specialDomainName = this.getSpecialDomain();
        }
        get allowlisted() {
          return this._tabState.allowlisted;
        }
        set allowlisted(value) {
          this._tabState.setValue("allowlisted", value);
        }
        get allowlistOptIn() {
          return this._tabState.allowlistOptIn;
        }
        set allowlistOptIn(value) {
          this._tabState.setValue("allowlistOptIn", value);
        }
        get denylisted() {
          return this._tabState.denylisted;
        }
        set denylisted(value) {
          this._tabState.setValue("denylisted", value);
        }
        /**
         * Broken site reporting relies on the www. prefix being present as a.com matches *.a.com
         * This would make the list apply to a much larger audience than is required.
         * The other allowlisting code is different and probably should be changed to match.
         */
        get isBroken() {
          return utils.isBroken(this.domainWWW);
        }
        get enabledFeatures() {
          if (this.specialDomainName && this.specialDomainName !== "new tab") {
            return [];
          }
          return utils.getEnabledFeatures(this.domainWWW);
        }
        get domain() {
          const domain = utils.extractHostFromURL(this.url) || "";
          return domain.toLowerCase();
        }
        get domainWWW() {
          const domainWWW = utils.extractHostFromURL(this.url, true) || "";
          return domainWWW.toLowerCase();
        }
        get protocol() {
          return this.url.substr(0, this.url.indexOf(":"));
        }
        get baseDomain() {
          return utils.getBaseDomain(this.url);
        }
        get parentEntity() {
          return utils.findParent(this.domain) || "";
        }
        get parentPrevalence() {
          const parent2 = tdsStorage.tds.entities[this.parentEntity];
          return parent2 ? parent2.prevalence : 0;
        }
        /*
         * When site objects are created we check the stored lists
         * and set the new site list statuses
         */
        setListStatusFromGlobal() {
          const globalLists = ["allowlisted", "allowlistOptIn", "denylisted"];
          globalLists.forEach((name) => {
            const list = settings5.getSetting(name) || {};
            this.setListValue(name, list[this.domain] || false);
          });
        }
        /**
         * @param {allowlistName} listName
         * @param {boolean} value
         */
        setListValue(listName, value) {
          if (value === true || value === false) {
            this[listName] = value;
          }
        }
        isContentBlockingEnabled() {
          return this.isFeatureEnabled("contentBlocking");
        }
        isProtectionEnabled() {
          if (this.denylisted) {
            return true;
          }
          return !(this.allowlisted || this.isBroken);
        }
        /**
         * Checks different toggles we have in the application:
         * - User toggle off
         * - Remotely disable it
         *      - tempAllowlist
         *      - "status" check
         *      - "exceptions" check
         * - User toggle on
         */
        isFeatureEnabled(featureName) {
          const allowlistOnlyFeatures = ["autofill", "adClickAttribution", "toggleReports"];
          if (allowlistOnlyFeatures.includes(featureName)) {
            return this.enabledFeatures.includes(featureName);
          }
          if (this.denylisted) {
            return true;
          }
          return this.isProtectionEnabled() && this.enabledFeatures.includes(featureName);
        }
        /**
         * @param {import("../../../../node_modules/@duckduckgo/privacy-grade/src/classes/trackers").TrackerData} t
         */
        addTracker(t2) {
          if (t2.action === "ignore" && !t2.sameEntity) {
            return;
          }
          if (t2.tracker && this.trackerUrls.indexOf(t2.tracker.domain) === -1) {
            this.trackerUrls.push(t2.tracker.domain);
            const entityPrevalence = tdsStorage.tds.entities[t2.tracker.owner.name]?.prevalence;
            if (t2.action) {
              if (["block", "redirect", "ignore-user"].includes(t2.action)) {
                this.grade.addEntityBlocked(t2.tracker.owner.name, entityPrevalence);
              } else if (t2.action === "ignore") {
                this.grade.addEntityNotBlocked(t2.tracker.owner.name, entityPrevalence);
              }
            }
          }
        }
        /*
         * specialDomain
         *
         * determine if domain is a special page
         *
         * returns: a useable special page description string.
         *          or null if not a special page.
         */
        getSpecialDomain() {
          const extensionId = browserWrapper2.getExtensionId();
          const localhostName = "localhost";
          const { protocol, url, domain } = this;
          const { publicSuffix } = (0, import_tldts2.parse)(this.url);
          if (url === "") {
            return "new tab";
          }
          if (domain === localhostName || domain.match(/^127\.0\.0\.1/) || publicSuffix === localhostName) {
            return localhostName;
          }
          if (domain.match(/^0\.0\.0\.0/)) {
            return domain;
          }
          if (protocol === "about" || protocol === "chrome" || protocol === "chrome-search" || protocol === "vivaldi") {
            if (domain === "newtab" || domain === "local-ntp") {
              return "new tab";
            }
            return domain;
          }
          if (protocol === "file") {
            return "local file";
          }
          if (protocol === "chrome-extension" || protocol === "moz-extension") {
            if (domain === extensionId) {
              const matches = url.match(/^(?:chrome|moz)-extension:\/\/[^/]+\/html\/([a-z-]+).html/);
              if (matches && matches[1]) {
                return matches[1];
              }
            }
            return "extension page";
          }
          if (url.startsWith("https://duckduckgo.com/chrome_newtab")) {
            return "new tab";
          }
          return null;
        }
      };
    }
  });

  // packages/ddg2dnr/lib/smarterEncryption.js
  var require_smarterEncryption = __commonJS({
    "packages/ddg2dnr/lib/smarterEncryption.js"(exports2) {
      "use strict";
      var { storeInLookup } = require_utils();
      var SMARTER_ENCRYPTION_PRIORITY = 5e3;
      function generateRegexFilter(subdomainCount, matchWwwSubdomain) {
        return "^http://" + (matchWwwSubdomain ? "(www\\.)?" : "") + Array(subdomainCount).fill("[^.]+").join("\\.") + "(:|/|$)";
      }
      function generateRule(id, subdomainCount, domains, matchWwwSubdomain) {
        return {
          id,
          priority: SMARTER_ENCRYPTION_PRIORITY,
          action: {
            type: "upgradeScheme"
          },
          condition: {
            resourceTypes: [
              "main_frame",
              "sub_frame",
              "stylesheet",
              "script",
              "image",
              "font",
              "object",
              "xmlhttprequest",
              "ping",
              "csp_report",
              "media",
              "websocket",
              "webtransport",
              "webbundle",
              "other"
            ],
            requestDomains: domains,
            regexFilter: generateRegexFilter(subdomainCount, matchWwwSubdomain)
          }
        };
      }
      function generateSmarterEncryptionRuleset(domains, startingRuleId = 1) {
        const domainsBySubdomainCount = /* @__PURE__ */ new Map();
        const domainsWithOptionalWwwBySubdomainCount = /* @__PURE__ */ new Map();
        const domainsToMatchWithWwwPrefix = /* @__PURE__ */ new Set();
        const nonWwwDomains = [];
        for (const domain of domains) {
          if (domain.startsWith("www.")) {
            domainsToMatchWithWwwPrefix.add(domain.substr(4));
          } else {
            nonWwwDomains.push(domain);
          }
        }
        for (const domain of nonWwwDomains) {
          if (domainsToMatchWithWwwPrefix.has(domain)) {
            domainsToMatchWithWwwPrefix.delete(domain);
            storeInLookup(domainsWithOptionalWwwBySubdomainCount, domain.split(".").length, [domain]);
          } else {
            storeInLookup(domainsBySubdomainCount, domain.split(".").length, [domain]);
          }
        }
        for (const domain of domainsToMatchWithWwwPrefix) {
          storeInLookup(domainsBySubdomainCount, domain.split(".").length + 1, ["www." + domain]);
        }
        let id = startingRuleId;
        const rules = [];
        for (const [subdomainCount, domainGroup] of domainsBySubdomainCount) {
          if (domainGroup.length < 1) {
            continue;
          }
          rules.push(generateRule(id++, subdomainCount, domainGroup, false));
        }
        for (const [subdomainCount, domainGroup] of domainsWithOptionalWwwBySubdomainCount) {
          if (domainGroup.length < 1) {
            continue;
          }
          rules.push(generateRule(id++, subdomainCount, domainGroup, true));
        }
        return rules;
      }
      function createSmarterEncryptionTemporaryRule2(domains, type = "allow", id) {
        if (["allow", "upgrade"].indexOf(type) === -1) {
          throw new Error(`createSmarterEncryptionTemporaryRule type ${type} is not valid`);
        }
        const actionType = type === "allow" ? "allow" : "upgradeScheme";
        const detailsType = type === "allow" ? "httpsAllowlist" : "sessionUpgrades";
        return {
          rule: {
            id,
            priority: SMARTER_ENCRYPTION_PRIORITY,
            action: {
              type: actionType
            },
            condition: {
              requestDomains: domains,
              resourceTypes: [
                "main_frame",
                "sub_frame",
                "stylesheet",
                "script",
                "image",
                "font",
                "object",
                "xmlhttprequest",
                "ping",
                "csp_report",
                "media",
                "websocket",
                "webtransport",
                "webbundle",
                "other"
              ]
            }
          },
          matchDetails: {
            type: detailsType,
            possibleTrackerDomains: domains
          }
        };
      }
      exports2.SMARTER_ENCRYPTION_PRIORITY = SMARTER_ENCRYPTION_PRIORITY;
      exports2.generateSmarterEncryptionRuleset = generateSmarterEncryptionRuleset;
      exports2.createSmarterEncryptionTemporaryRule = createSmarterEncryptionTemporaryRule2;
    }
  });

  // shared/js/background/dnr-utils.js
  async function findExistingRule(isSessionRule = false, desiredRuleId) {
    const rules = await chrome.declarativeNetRequest[isSessionRule ? "getSessionRules" : "getDynamicRules"]();
    return rules.find((r) => r.id === desiredRuleId);
  }
  var import_settings4, USER_ALLOWLIST_RULE_ID, HTTPS_SESSION_ALLOWLIST_RULE_ID, HTTPS_SESSION_UPGRADE_RULE_ID, SETTING_PREFIX, ruleIdRangeByConfigName, findExistingDynamicRule, findExistingSessionRule;
  var init_dnr_utils = __esm({
    "shared/js/background/dnr-utils.js"() {
      "use strict";
      import_settings4 = __toESM(require_settings());
      USER_ALLOWLIST_RULE_ID = 20001;
      HTTPS_SESSION_ALLOWLIST_RULE_ID = 20004;
      HTTPS_SESSION_UPGRADE_RULE_ID = 20005;
      SETTING_PREFIX = "declarative_net_request-";
      ruleIdRangeByConfigName = {
        tds: [1, 1e4],
        config: [10001, 2e4],
        _RESERVED: [20001, 21e3],
        combined: [21001, 31e3]
      };
      findExistingDynamicRule = findExistingRule.bind(null, false);
      findExistingSessionRule = findExistingRule.bind(null, true);
    }
  });

  // shared/js/background/dnr-smarter-encryption.js
  var dnr_smarter_encryption_exports = {};
  __export(dnr_smarter_encryption_exports, {
    addSmarterEncryptionSessionException: () => addSmarterEncryptionSessionException,
    addSmarterEncryptionSessionRule: () => addSmarterEncryptionSessionRule
  });
  async function updateSmarterEncryptionSessionRule(ruleId, addDomain, type) {
    const existingRule = await findExistingSessionRule(ruleId);
    const ruleDomains = existingRule?.condition.requestDomains || [];
    if (ruleDomains.includes(addDomain)) {
      return;
    }
    ruleDomains.push(addDomain);
    const { rule } = (0, import_smarterEncryption.createSmarterEncryptionTemporaryRule)(ruleDomains, type, ruleId);
    await chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [ruleId],
      addRules: [rule]
    });
  }
  async function addSmarterEncryptionSessionException(domain) {
    return updateSmarterEncryptionSessionRule(HTTPS_SESSION_ALLOWLIST_RULE_ID, domain, "allow");
  }
  async function addSmarterEncryptionSessionRule(domain) {
    return updateSmarterEncryptionSessionRule(HTTPS_SESSION_UPGRADE_RULE_ID, domain, "upgrade");
  }
  var import_smarterEncryption;
  var init_dnr_smarter_encryption = __esm({
    "shared/js/background/dnr-smarter-encryption.js"() {
      "use strict";
      import_smarterEncryption = __toESM(require_smarterEncryption());
      init_dnr_utils();
    }
  });

  // shared/js/background/classes/https-redirects.js
  var require_https_redirects = __commonJS({
    "shared/js/background/classes/https-redirects.js"(exports2, module2) {
      "use strict";
      var utils4 = (init_utils(), __toCommonJS(utils_exports));
      var browserWrapper5 = (init_wrapper(), __toCommonJS(wrapper_exports));
      var { addSmarterEncryptionSessionException: addSmarterEncryptionSessionException2 } = (init_dnr_smarter_encryption(), __toCommonJS(dnr_smarter_encryption_exports));
      var MAINFRAME_RESET_MS = 3e3;
      var REQUEST_REDIRECT_LIMIT = 7;
      var manifestVersion2 = browserWrapper5.getManifestVersion();
      var HttpsRedirects = class {
        constructor() {
          this.failedUpgradeHosts = {};
          this.redirectCounts = {};
          this.mainFrameRedirect = null;
          this.clearMainFrameTimeout = null;
        }
        registerRedirect(request) {
          if (request.type === "main_frame") {
            if (this.mainFrameRedirect && request.url === this.mainFrameRedirect.url) {
              this.mainFrameRedirect.count += 1;
              return;
            }
            this.mainFrameRedirect = {
              url: request.url,
              time: Date.now(),
              count: 0
            };
            clearTimeout(this.clearMainFrameTimeout);
            this.clearMainFrameTimeout = setTimeout(this.resetMainFrameRedirect, MAINFRAME_RESET_MS);
          } else {
            this.redirectCounts[request.requestId] = this.redirectCounts[request.requestId] || 0;
            this.redirectCounts[request.requestId] += 1;
          }
        }
        canRedirect(request) {
          let canRedirect = true;
          const hostname = utils4.extractHostFromURL(request.url, true);
          if (this.failedUpgradeHosts[hostname]) {
            console.log(`HTTPS: not upgrading ${request.url}, hostname previously failed: ${hostname}`);
            return false;
          }
          if (request.type === "main_frame") {
            if (this.mainFrameRedirect && this.mainFrameRedirect.url === request.url) {
              const timeSinceFirstHit = Date.now() - this.mainFrameRedirect.time;
              if (timeSinceFirstHit < MAINFRAME_RESET_MS && this.mainFrameRedirect.count >= REQUEST_REDIRECT_LIMIT) {
                canRedirect = false;
              }
            }
          } else if (this.redirectCounts[request.requestId]) {
            canRedirect = this.redirectCounts[request.requestId] < REQUEST_REDIRECT_LIMIT;
          }
          if (!canRedirect) {
            this.failedUpgradeHosts[hostname] = true;
            console.log(`HTTPS: not upgrading, redirect loop protection kicked in for url: ${request.url}`);
            if (manifestVersion2 === 3) {
              addSmarterEncryptionSessionException2(hostname);
            }
          }
          return canRedirect;
        }
        /**
         * We regenerate tab objects every time a new main_frame request is made.
         *
         * persistMainFrameRedirect() is used whenever a tab object is regenerated,
         * so we can maintain redirect loop protection across multiple main_frame requests
         */
        persistMainFrameRedirect(redirectData) {
          if (!redirectData) {
            return;
          }
          this.mainFrameRedirect = Object.assign({}, redirectData);
          this.clearMainFrameTimeout = setTimeout(this.resetMainFrameRedirect, MAINFRAME_RESET_MS);
        }
        getMainFrameRedirect() {
          return this.mainFrameRedirect;
        }
        resetMainFrameRedirect() {
          clearTimeout(this.clearMainFrameTimeout);
          this.mainFrameRedirect = null;
        }
      };
      module2.exports = HttpsRedirects;
    }
  });

  // shared/js/background/classes/tab.js
  var require_tab = __commonJS({
    "shared/js/background/classes/tab.js"(exports2, module2) {
      "use strict";
      var Site2 = (init_site(), __toCommonJS(site_exports)).default;
      var { Tracker: Tracker2 } = (init_tracker(), __toCommonJS(tracker_exports));
      var HttpsRedirects = require_https_redirects();
      var Companies3 = require_companies();
      var webResourceKeyRegex = /.*\?key=(.*)/;
      var { AdClickAttributionPolicy: AdClickAttributionPolicy2 } = (init_ad_click_attribution_policy(), __toCommonJS(ad_click_attribution_policy_exports));
      var { TabState: TabState3 } = (init_tab_state(), __toCommonJS(tab_state_exports));
      var Tab = class _Tab {
        /**
         * @param {TabData|TabState} tabData
         */
        constructor(tabData) {
          if (tabData instanceof TabState3) {
            this._tabState = tabData;
          } else {
            this._tabState = new TabState3(tabData);
          }
          this.site = new Site2(this.url, this._tabState);
          this.httpsRedirects = new HttpsRedirects();
          this.webResourceAccess = [];
          this.surrogates = {};
        }
        /**
         * @param {number} tabId
         */
        static async restore(tabId) {
          const state = await TabState3.restore(tabId);
          if (!state) {
            return null;
          }
          return new _Tab(state);
        }
        set referrer(value) {
          this._tabState.setValue("referrer", value);
        }
        get referrer() {
          return this._tabState.referrer;
        }
        set adClick(value) {
          this._tabState.setValue("adClick", value);
        }
        get adClick() {
          return this._tabState.adClick;
        }
        set firstAdAttributionAllowed(value) {
          this._tabState.setValue("firstAdAttributionAllowed", value);
        }
        get firstAdAttributionAllowed() {
          return this._tabState.firstAdAttributionAllowed;
        }
        set disabledClickToLoadRuleActions(value) {
          this._tabState.setValue("disabledClickToLoadRuleActions", value);
        }
        get disabledClickToLoadRuleActions() {
          return this._tabState.disabledClickToLoadRuleActions;
        }
        set dnrRuleIdsByDisabledClickToLoadRuleAction(value) {
          this._tabState.setValue("dnrRuleIdsByDisabledClickToLoadRuleAction", value);
        }
        get dnrRuleIdsByDisabledClickToLoadRuleAction() {
          return this._tabState.dnrRuleIdsByDisabledClickToLoadRuleAction;
        }
        set trackers(value) {
          this._tabState.setValue("trackers", value);
        }
        get trackers() {
          return this._tabState.trackers;
        }
        get url() {
          return this._tabState.url;
        }
        set url(url) {
          this._tabState.setValue("url", url);
        }
        get id() {
          return this._tabState.tabId;
        }
        set id(tabId) {
          this._tabState.setValue("tabId", tabId);
        }
        get upgradedHttps() {
          return this._tabState.upgradedHttps;
        }
        set upgradedHttps(value) {
          this._tabState.setValue("upgradedHttps", value);
        }
        get hasHttpsError() {
          return this._tabState.hasHttpsError;
        }
        set hasHttpsError(value) {
          this._tabState.setValue("hasHttpsError", value);
        }
        get mainFrameUpgraded() {
          return this._tabState.mainFrameUpgraded;
        }
        set mainFrameUpgraded(value) {
          this._tabState.setValue("mainFrameUpgraded", value);
        }
        get urlParametersRemoved() {
          return this._tabState.urlParametersRemoved;
        }
        set urlParametersRemoved(value) {
          this._tabState.setValue("urlParametersRemoved", value);
        }
        get urlParametersRemovedUrl() {
          return this._tabState.urlParametersRemovedUrl;
        }
        set urlParametersRemovedUrl(value) {
          this._tabState.setValue("urlParametersRemovedUrl", value);
        }
        get ampUrl() {
          return this._tabState.ampUrl;
        }
        set ampUrl(url) {
          this._tabState.setValue("ampUrl", url);
        }
        get cleanAmpUrl() {
          return this._tabState.cleanAmpUrl;
        }
        get requestId() {
          return this._tabState.requestId;
        }
        set cleanAmpUrl(url) {
          this._tabState.setValue("cleanAmpUrl", url);
        }
        get status() {
          return this._tabState.status;
        }
        set status(value) {
          this._tabState.setValue("status", value);
        }
        get statusCode() {
          return this._tabState.statusCode;
        }
        set statusCode(value) {
          this._tabState.setValue("statusCode", value);
        }
        get ctlYouTube() {
          return this._tabState.ctlYouTube;
        }
        set ctlYouTube(value) {
          this._tabState.setValue("ctlYouTube", value);
        }
        get ctlFacebookPlaceholderShown() {
          return this._tabState.ctlFacebookPlaceholderShown;
        }
        set ctlFacebookPlaceholderShown(value) {
          this._tabState.setValue("ctlFacebookPlaceholderShown", value);
        }
        get ctlFacebookLogin() {
          return this._tabState.ctlFacebookLogin;
        }
        set ctlFacebookLogin(value) {
          this._tabState.setValue("ctlFacebookLogin", value);
        }
        get debugFlags() {
          return this._tabState.debugFlags;
        }
        set debugFlags(value) {
          this._tabState.setValue("debugFlags", value);
        }
        get errorDescriptions() {
          return this._tabState.errorDescriptions;
        }
        set errorDescriptions(value) {
          this._tabState.setValue("errorDescriptions", value);
        }
        get httpErrorCodes() {
          return this._tabState.httpErrorCodes;
        }
        set httpErrorCodes(value) {
          this._tabState.setValue("httpErrorCodes", value);
        }
        get performanceWarning() {
          return this._tabState.performanceWarning;
        }
        set performanceWarning(value) {
          this._tabState.setValue("performanceWarning", value);
        }
        get userRefreshCount() {
          return this._tabState.userRefreshCount;
        }
        set userRefreshCount(value) {
          this._tabState.setValue("userRefreshCount", value);
        }
        get openerContext() {
          return this._tabState.openerContext;
        }
        set openerContext(value) {
          this._tabState.setValue("openerContext", value);
        }
        get jsPerformance() {
          return this._tabState.jsPerformance;
        }
        set jsPerformance(value) {
          this._tabState.setValue("jsPerformance", value);
        }
        get locale() {
          return this._tabState.locale;
        }
        set locale(value) {
          this._tabState.setValue("locale", value);
        }
        /**
         * If given a valid adClick redirect, set the adClick to the tab.
         * @param {string} requestURL
         */
        setAdClickIfValidRedirect(requestURL) {
          const policy = this.getAdClickAttributionPolicy();
          const adClick = policy.createAdClick(requestURL, this);
          if (adClick) {
            this.adClick = adClick;
          }
        }
        /**
         * @returns {AdClickAttributionPolicy}
         */
        getAdClickAttributionPolicy() {
          this._adClickAttributionPolicy = this._adClickAttributionPolicy || new AdClickAttributionPolicy2();
          return this._adClickAttributionPolicy;
        }
        /**
         * Returns true if a resource should be permitted when the tab is in the adClick state.
         * @param {string} resourcePath
         * @returns {boolean}
         */
        allowAdAttribution(resourcePath) {
          if (!this.site.isFeatureEnabled("adClickAttribution") || !this.adClick || !this.adClick.allowAdAttribution(this)) return false;
          const policy = this.getAdClickAttributionPolicy();
          const permitted = policy.resourcePermitted(resourcePath);
          if (permitted) {
            this.adClick.requestWasAllowed(this);
          }
          return permitted;
        }
        updateSite(url) {
          if (this.site.url === url) return;
          this.url = url;
          this.site = new Site2(url, this._tabState);
          this.userRefreshCount = 0;
        }
        // Store all trackers for a given tab even if we don't block them.
        /**
         * @param t
         * @param {string} baseDomain
         * @param {string} url
         * @returns {Tracker}
         */
        addToTrackers(t2, baseDomain, url) {
          const trackers3 = this.trackers;
          const tracker = this.trackers[t2.tracker.owner.name];
          if (tracker) {
            tracker.addTrackerUrl(t2, this.url || "", baseDomain, url);
          } else if (t2.tracker) {
            const newTracker = new Tracker2(t2);
            newTracker.addTrackerUrl(t2, this.url || "", baseDomain, url);
            this.trackers[t2.tracker.owner.name] = newTracker;
            if (t2.tracker.owner.name !== "unknown") Companies3.countCompanyOnPage(t2.tracker.owner);
          }
          this.trackers = trackers3;
          return this.trackers[t2.tracker.owner.name];
        }
        /**
         * Adds an entry to the tab webResourceAccess list.
         * @param {string} resourceName URL to the web accessible resource
         * @returns {string} generated access key
         **/
        addWebResourceAccess(resourceName) {
          const key = Math.floor(Math.random() * 1e10).toString(16);
          this.webResourceAccess.push({ key, resourceName, time: Date.now(), wasAccessed: false });
          return key;
        }
        /**
         * Access to web accessible resources needs to have the correct key passed in the URL
         * and the requests needs to happen within 1 second since the generation of the key
         * in addWebResourceAccess
         * @param {string} resourceURL web accessible resource URL
         * @returns {boolean} is access to the resource allowed
         **/
        hasWebResourceAccess(resourceURL) {
          if (!this.webResourceAccess.length) {
            return false;
          }
          const keyMatches = webResourceKeyRegex.exec(resourceURL);
          if (!keyMatches) {
            return false;
          }
          const key = keyMatches[1];
          const hasAccess = this.webResourceAccess.some((resource) => {
            if (resource.key === key && !resource.wasAccessed) {
              resource.wasAccessed = true;
              if (Date.now() - resource.time < 1e3) {
                return true;
              }
            }
            return false;
          });
          return hasAccess;
        }
        /**
         * This method sets ampUrl. In cases where ampUrl is already set with an AMP url and the new url is
         * contained in the current ampUrl, we don't want to set ampUrl to the new url. This is because in some cases
         * simple amp urls (e.g. google.com/amp) will contain another amp url as the extacted url.
         *
         * @param {string} url - the url to set ampUrl to
         */
        setAmpUrl(url) {
          if (this.ampUrl) {
            const ampUrl = new URL(this.ampUrl);
            const newUrl = new URL(url);
            if (ampUrl.hostname.includes("google") && ampUrl.pathname.includes(newUrl.hostname)) {
              return;
            }
          }
          this.ampUrl = url;
        }
        /**
         * Post a message to the devtools panel for this tab
         * @param {Object} devtools
         * @param {string} action
         * @param {Object} message
         */
        postDevtoolsMessage(devtools3, action, message) {
          devtools3.postMessage(this.id, action, message);
        }
      };
      module2.exports = Tab;
    }
  });

  // shared/js/background/classes/sw-tab.js
  var require_sw_tab = __commonJS({
    "shared/js/background/classes/sw-tab.js"(exports2, module2) {
      "use strict";
      var Tab = require_tab();
      var ServiceWorkerTab = class extends Tab {
        /**
         * @param {string} swUrl
         * @param {Record<number, Tab>} tabContainer
         */
        constructor(swUrl, tabContainer) {
          super({
            tabId: -1,
            url: swUrl,
            status: null
          });
          this.origin = new URL(swUrl).origin;
          this.tabContainer = tabContainer;
        }
        /**
         * Find the list of tabs which share the same origin as this service worker.
         * @returns {Tab[]}
         */
        _findMatchingTabs() {
          return Object.keys(this.tabContainer).filter((tabId) => {
            const tab = this.tabContainer[tabId];
            try {
              return Number(tabId) > -1 && new URL(tab.url).origin === this.origin;
            } catch (e) {
              return false;
            }
          }).map((k) => this.tabContainer[k]);
        }
        /**
         * @param t
         * @param {string} baseDomain
         * @param {string} url
         * @returns {import('./tracker').Tracker}
         */
        addToTrackers(tracker, baseDomain, url) {
          const results = this._findMatchingTabs().map((tab) => tab.addToTrackers(tracker, baseDomain, url));
          return results[0];
        }
        /**
         * Post a message to the devtools panel for all matching
         * @param {Object} devtools
         * @param {string} action
         * @param {Object} message
         */
        postDevtoolsMessage(devtools3, action, message) {
          this._findMatchingTabs().forEach((tab) => tab.postDevtoolsMessage(devtools3, action, message));
        }
      };
      module2.exports = ServiceWorkerTab;
    }
  });

  // shared/js/background/trackers.js
  var require_trackers2 = __commonJS({
    "shared/js/background/trackers.js"(exports2, module2) {
      "use strict";
      var utils4 = (init_utils(), __toCommonJS(utils_exports));
      var tldts = require_cjs();
      var Trackers = require_privacy_grade().Trackers;
      var TrackersInstance = new Trackers({ tldjs: tldts, utils: utils4 });
      module2.exports = TrackersInstance;
    }
  });

  // packages/ddg2dnr/lib/gpc.js
  var require_gpc = __commonJS({
    "packages/ddg2dnr/lib/gpc.js"(exports2) {
      "use strict";
      var { resourceTypes, generateDNRRule: generateDNRRule5 } = require_utils();
      var GPC_HEADER_PRIORITY = 4e4;
      function generateGPCheaderRule2(ruleId, allowedDomains) {
        return generateDNRRule5({
          id: ruleId,
          priority: GPC_HEADER_PRIORITY,
          actionType: "modifyHeaders",
          requestHeaders: [{ header: "Sec-GPC", operation: "set", value: "1" }],
          resourceTypes: [...resourceTypes],
          excludedInitiatorDomains: allowedDomains,
          excludedRequestDomains: allowedDomains
        });
      }
      exports2.GPC_HEADER_PRIORITY = GPC_HEADER_PRIORITY;
      exports2.generateGPCheaderRule = generateGPCheaderRule2;
    }
  });

  // shared/js/background/dnr-gpc.js
  var import_settings5, import_gpc;
  var init_dnr_gpc = __esm({
    "shared/js/background/dnr-gpc.js"() {
      "use strict";
      import_settings5 = __toESM(require_settings());
      init_tds();
      init_dnr_utils();
      import_gpc = __toESM(require_gpc());
    }
  });

  // shared/js/background/dnr-service-worker-initiated.js
  var import_rulePriorities2, import_utils4;
  var init_dnr_service_worker_initiated = __esm({
    "shared/js/background/dnr-service-worker-initiated.js"() {
      "use strict";
      init_dnr_utils();
      import_rulePriorities2 = __toESM(require_rulePriorities());
      import_utils4 = __toESM(require_utils());
    }
  });

  // packages/ddg2dnr/lib/ampProtection.js
  var require_ampProtection = __commonJS({
    "packages/ddg2dnr/lib/ampProtection.js"(exports2) {
      "use strict";
      var { generateDNRRule: generateDNRRule5 } = require_utils();
      var AMP_PROTECTION_PRIORITY = 4e4;
      async function generateAmpProtectionRules({ features: { ampLinks } }, isRegexSupported) {
        const results = [];
        if (!ampLinks || ampLinks.state !== "enabled" || !ampLinks.settings || !ampLinks.settings.linkFormats || ampLinks.settings.linkFormats.length === 0) {
          return results;
        }
        const {
          settings: { linkFormats: ampLinkRegexps }
        } = ampLinks;
        const excludedDomains = (ampLinks?.exceptions || []).map(({ domain }) => domain);
        for (const ampLinkRegex of ampLinkRegexps) {
          const regexFilter = ampLinkRegex.replaceAll("\\S", ".");
          const { isSupported } = await isRegexSupported({
            regex: regexFilter,
            isCaseSensitive: false,
            requireCapturing: true
          });
          if (!isSupported) {
            continue;
          }
          const rule = generateDNRRule5({
            priority: AMP_PROTECTION_PRIORITY,
            actionType: "redirect",
            regexFilter,
            redirect: { regexSubstitution: "https://\\1" },
            resourceTypes: ["main_frame"],
            excludedInitiatorDomains: excludedDomains,
            excludedRequestDomains: excludedDomains
          });
          const matchDetails = {
            type: "ampProtection"
          };
          results.push({ rule, matchDetails });
        }
        return results;
      }
      exports2.AMP_PROTECTION_PRIORITY = AMP_PROTECTION_PRIORITY;
      exports2.generateAmpProtectionRules = generateAmpProtectionRules;
    }
  });

  // packages/ddg2dnr/lib/trackerAllowlist.js
  var require_trackerAllowlist = __commonJS({
    "packages/ddg2dnr/lib/trackerAllowlist.js"(exports2) {
      "use strict";
      var { processPlaintextTrackerRule, storeInLookup, generateDNRRule: generateDNRRule5, getTrackerEntryDomain } = require_utils();
      var BASELINE_PRIORITY = 2e4;
      var PRIORITY_INCREMENT = 1;
      var CEILING_PRIORITY = 20100;
      var MAXIMUM_RULES_PER_TRACKER_ENTRY = (CEILING_PRIORITY - BASELINE_PRIORITY) / PRIORITY_INCREMENT;
      function* generateTrackerAllowlistRules({ features: { trackerAllowlist } }) {
        if (!trackerAllowlist || trackerAllowlist.state !== "enabled" || !trackerAllowlist.settings || !trackerAllowlist.settings.allowlistedTrackers || trackerAllowlist.settings.allowlistedTrackers.length === 0) {
          return;
        }
        const { allowlistedTrackers } = trackerAllowlist.settings;
        const excludedRequestDomainsByTrackerEntry = /* @__PURE__ */ new Map();
        for (const trackerDomain of Object.keys(allowlistedTrackers)) {
          let currentTrackerDomain = trackerDomain;
          while (currentTrackerDomain) {
            currentTrackerDomain = getTrackerEntryDomain(allowlistedTrackers, currentTrackerDomain, 1);
            if (currentTrackerDomain) {
              storeInLookup(excludedRequestDomainsByTrackerEntry, currentTrackerDomain, [trackerDomain]);
            }
          }
        }
        for (const [trackerDomain, trackerEntry] of Object.entries(allowlistedTrackers)) {
          const { rules: trackerEntryRules } = trackerEntry;
          if (!trackerEntryRules || trackerEntryRules.length === 0) {
            continue;
          }
          if (trackerEntryRules.length > MAXIMUM_RULES_PER_TRACKER_ENTRY) {
            throw new Error("Too many allowlist rules for tracker domain: " + trackerDomain);
          }
          const requestDomains = [trackerDomain];
          const excludedRequestDomains = excludedRequestDomainsByTrackerEntry.get(trackerDomain);
          let priority = BASELINE_PRIORITY;
          for (let i = trackerEntryRules.length - 1; i >= 0; i--) {
            let { rule: trackerRule, domains: initiatorDomains, reason: allowlistReason } = trackerEntryRules[i];
            if (initiatorDomains.length === 0 || initiatorDomains[0] === "<all>") {
              initiatorDomains = null;
            }
            const { urlFilter, matchCase } = processPlaintextTrackerRule(trackerDomain, trackerRule);
            const rule = generateDNRRule5({
              priority,
              actionType: "allow",
              urlFilter,
              matchCase,
              requestDomains,
              excludedRequestDomains,
              initiatorDomains
            });
            const matchDetails = {
              type: "trackerAllowlist",
              domain: trackerDomain,
              reason: allowlistReason
            };
            yield { rule, matchDetails };
            priority += PRIORITY_INCREMENT;
          }
        }
      }
      exports2.BASELINE_PRIORITY = BASELINE_PRIORITY;
      exports2.PRIORITY_INCREMENT = PRIORITY_INCREMENT;
      exports2.CEILING_PRIORITY = CEILING_PRIORITY;
      exports2.MAXIMUM_RULES_PER_TRACKER_ENTRY = MAXIMUM_RULES_PER_TRACKER_ENTRY;
      exports2.generateTrackerAllowlistRules = generateTrackerAllowlistRules;
    }
  });

  // packages/ddg2dnr/lib/temporaryAllowlist.js
  var require_temporaryAllowlist = __commonJS({
    "packages/ddg2dnr/lib/temporaryAllowlist.js"(exports2) {
      "use strict";
      var CONTENT_BLOCKING_ALLOWLIST_PRIORITY = 3e4;
      var UNPROTECTED_TEMPORARY_ALLOWLIST_PRIORITY = 1e6;
      var { generateDNRRule: generateDNRRule5 } = require_utils();
      function* generateTemporaryAllowlistRules({ features: { contentBlocking }, unprotectedTemporary }, denylistedDomains) {
        const denylistedDomainsSet = new Set(denylistedDomains);
        const configs = [
          {
            type: "unprotectedTemporary",
            priority: UNPROTECTED_TEMPORARY_ALLOWLIST_PRIORITY,
            entries: unprotectedTemporary || []
          }
        ];
        if (contentBlocking?.state !== "enabled") {
          yield {
            rule: generateDNRRule5({
              priority: CONTENT_BLOCKING_ALLOWLIST_PRIORITY,
              actionType: "allowAllRequests",
              resourceTypes: ["main_frame"]
            }),
            matchDetails: {
              type: "contentBlocking",
              reason: "contentBlocking disabled for all domains."
            }
          };
        } else {
          configs.push({
            type: "contentBlocking",
            priority: CONTENT_BLOCKING_ALLOWLIST_PRIORITY,
            entries: contentBlocking?.exceptions || []
          });
        }
        for (const { type, priority, entries } of configs) {
          for (const { domain, reason } of entries) {
            if (denylistedDomainsSet.has(domain)) continue;
            const matchDetails = { type, domain, reason };
            const rule = generateDNRRule5({
              priority,
              actionType: "allowAllRequests",
              requestDomains: [domain],
              resourceTypes: ["main_frame"]
            });
            yield { rule, matchDetails };
          }
        }
      }
      exports2.CONTENT_BLOCKING_ALLOWLIST_PRIORITY = CONTENT_BLOCKING_ALLOWLIST_PRIORITY;
      exports2.UNPROTECTED_TEMPORARY_ALLOWLIST_PRIORITY = UNPROTECTED_TEMPORARY_ALLOWLIST_PRIORITY;
      exports2.generateTemporaryAllowlistRules = generateTemporaryAllowlistRules;
    }
  });

  // packages/ddg2dnr/lib/trackingParams.js
  var require_trackingParams = __commonJS({
    "packages/ddg2dnr/lib/trackingParams.js"(exports2) {
      "use strict";
      var { generateDNRRule: generateDNRRule5 } = require_utils();
      var TRACKING_PARAM_PRIORITY = 4e4;
      function generateTrackingParameterRules(config) {
        if (config.features?.trackingParameters?.state !== "enabled") {
          return [];
        }
        const allowedDomains = config.features.trackingParameters.exceptions?.map((e) => e.domain);
        const trackingParams = config.features.trackingParameters.settings?.parameters?.filter((param) => !param.match(/[*+?{}[\]]/, "g"));
        if (!trackingParams) {
          return [];
        }
        const rule = generateDNRRule5({
          priority: TRACKING_PARAM_PRIORITY,
          actionType: "redirect",
          redirect: {
            transform: {
              queryTransform: {
                removeParams: trackingParams
              }
            }
          },
          resourceTypes: ["main_frame"],
          excludedRequestDomains: allowedDomains
        });
        return [{ matchDetails: { type: "trackingParams" }, rule }];
      }
      exports2.TRACKING_PARAM_PRIORITY = TRACKING_PARAM_PRIORITY;
      exports2.generateTrackingParameterRules = generateTrackingParameterRules;
    }
  });

  // packages/ddg2dnr/lib/extensionConfiguration.js
  var require_extensionConfiguration = __commonJS({
    "packages/ddg2dnr/lib/extensionConfiguration.js"(exports2) {
      "use strict";
      var { generateAmpProtectionRules } = require_ampProtection();
      var { generateTrackerAllowlistRules } = require_trackerAllowlist();
      var { generateTemporaryAllowlistRules } = require_temporaryAllowlist();
      var { generateTrackingParameterRules } = require_trackingParams();
      var { createSmarterEncryptionTemporaryRule: createSmarterEncryptionTemporaryRule2 } = require_smarterEncryption();
      async function generateExtensionConfigurationRuleset2(extensionConfig, denylistedDomains, isRegexSupported, startingRuleId = 1) {
        if (typeof isRegexSupported !== "function") {
          throw new Error("Missing isRegexSupported function.");
        }
        let ruleId = startingRuleId;
        const ruleset = [];
        const matchDetailsByRuleId = {};
        const appendRuleResult = (result) => {
          if (result) {
            const { matchDetails, rule } = result;
            rule.id = ruleId++;
            ruleset.push(rule);
            matchDetailsByRuleId[rule.id] = matchDetails;
          }
        };
        for (const result of await generateAmpProtectionRules(extensionConfig, isRegexSupported)) {
          appendRuleResult(result);
        }
        for (const result of generateTrackerAllowlistRules(extensionConfig)) {
          appendRuleResult(result);
        }
        for (const result of generateTemporaryAllowlistRules(extensionConfig, denylistedDomains)) {
          appendRuleResult(result);
        }
        for (const result of generateTrackingParameterRules(extensionConfig)) {
          appendRuleResult(result);
        }
        if (extensionConfig.features?.https?.exceptions?.length > 0) {
          appendRuleResult(createSmarterEncryptionTemporaryRule2(extensionConfig.features.https.exceptions.map((entry) => entry.domain)));
        }
        return { ruleset, matchDetailsByRuleId };
      }
      exports2.generateExtensionConfigurationRuleset = generateExtensionConfigurationRuleset2;
    }
  });

  // packages/ddg2dnr/lib/tds.js
  var require_tds = __commonJS({
    "packages/ddg2dnr/lib/tds.js"(exports2) {
      "use strict";
      var {
        generateDNRRule: generateDNRRule5,
        getTrackerEntryDomain,
        storeInLookup,
        processRegexTrackerRule,
        resourceTypes,
        generateRequestDomainsByTrackerDomain
      } = require_utils();
      var clickToLoadActionPrefix = "block-ctl-";
      var BASELINE_PRIORITY = 1e4;
      var CEILING_PRIORITY = 19999;
      var SUBDOMAIN_PRIORITY_INCREMENT = 100;
      var TRACKER_RULE_PRIORITY_INCREMENT = 1;
      var MAXIMUM_SUBDOMAIN_PRIORITY = CEILING_PRIORITY - CEILING_PRIORITY % SUBDOMAIN_PRIORITY_INCREMENT;
      var MAXIMUM_TRACKER_RULE_PRIORITY_INCREMENT = SUBDOMAIN_PRIORITY_INCREMENT - TRACKER_RULE_PRIORITY_INCREMENT;
      var MAXIMUM_REGEX_RULES = 900;
      var trackerDomainSymbol = Symbol("trackerDomain");
      var clickToLoadActionSymbol = Symbol("clickToLoadActionSymbol");
      function normalizeTypesCondition(types) {
        if (!types || types.length === 0) {
          return [];
        }
        const normalizedTypes = /* @__PURE__ */ new Set();
        for (const type of types) {
          switch (type) {
            case "main_frame":
              continue;
            case "imageset":
              normalizedTypes.add("image");
              break;
            default:
              if (resourceTypes.has(type)) {
                normalizedTypes.add(type);
              } else {
                normalizedTypes.add("other");
              }
          }
        }
        return Array.from(normalizedTypes);
      }
      function normalizeAction(action, defaultAction) {
        if (action === "ignore") {
          return "allow";
        }
        if (!action && defaultAction) {
          return defaultAction;
        }
        return action;
      }
      function normalizeTrackerRule(trackerRule) {
        if (trackerRule instanceof RegExp) {
          return trackerRule.source;
        }
        return trackerRule;
      }
      function calculateTrackerEntryPriorities(tds) {
        const priorityByTrackerEntryDomain = /* @__PURE__ */ new Map();
        for (let domain of Object.keys(tds.trackers)) {
          if (priorityByTrackerEntryDomain.has(domain)) {
            continue;
          }
          let basePriority = BASELINE_PRIORITY;
          const trackerEntryDomains = [domain];
          while (true) {
            const i = domain.indexOf(".");
            if (i === -1) {
              break;
            }
            domain = domain.substr(i + 1);
            if (tds.trackers[domain]) {
              if (priorityByTrackerEntryDomain.has(domain)) {
                basePriority = priorityByTrackerEntryDomain.get(domain) + SUBDOMAIN_PRIORITY_INCREMENT;
                break;
              }
              trackerEntryDomains.push(domain);
            }
          }
          for (let i = trackerEntryDomains.length - 1; i >= 0; i--) {
            priorityByTrackerEntryDomain.set(trackerEntryDomains[i], basePriority);
            basePriority += SUBDOMAIN_PRIORITY_INCREMENT;
          }
        }
        return priorityByTrackerEntryDomain;
      }
      function removeRedundantDNRRules(dnrRules) {
        if (!dnrRules || dnrRules.length === 0) {
          return [];
        }
        const {
          priority: defaultPriority,
          action: { type: defaultAction }
        } = dnrRules[0];
        let rulesToRemoveStartIndex = 1;
        let rulesToRemoveCount = 0;
        if (defaultPriority === BASELINE_PRIORITY && defaultAction === "allow") {
          rulesToRemoveStartIndex = 0;
          rulesToRemoveCount = 1;
        }
        for (let i = 1; i < dnrRules.length; i++) {
          if (dnrRules[i].action.type === defaultAction) {
            rulesToRemoveCount++;
          } else {
            break;
          }
        }
        if (rulesToRemoveCount > 0) {
          dnrRules.splice(rulesToRemoveStartIndex, rulesToRemoveCount);
        }
        return dnrRules;
      }
      async function generateDNRRulesForTrackerEntry(trackerDomain, trackerEntry, requestDomains, excludedInitiatorDomains, priority, isRegexSupported, surrogatePathPrefix, supportedSurrogateScripts) {
        const dnrRules = [];
        if (priority > MAXIMUM_SUBDOMAIN_PRIORITY) {
          throw new Error("Too many tracker entries for domain: " + trackerDomain);
        }
        const defaultAction = normalizeAction(trackerEntry.default);
        if (defaultAction !== "block" && defaultAction !== "allow") {
          return dnrRules;
        }
        const trackerEntryRules = trackerEntry.rules || [];
        dnrRules.push(
          generateDNRRule5({
            priority,
            actionType: defaultAction,
            requestDomains,
            excludedInitiatorDomains
          })
        );
        const matchCnames = requestDomains.length > 1;
        if (trackerEntryRules.length * TRACKER_RULE_PRIORITY_INCREMENT > MAXIMUM_TRACKER_RULE_PRIORITY_INCREMENT) {
          throw new Error("Too many rules for tracker domain:" + trackerDomain);
        }
        for (let i = trackerEntryRules.length - 1; i >= 0; i--) {
          let { action: ruleAction, rule: trackerRule, exceptions: ruleExceptions, options: ruleOptions, surrogate } = trackerEntryRules[i];
          ruleAction = normalizeAction(ruleAction, "block");
          let clickToLoadAction = null;
          if (ruleAction.startsWith(clickToLoadActionPrefix)) {
            clickToLoadAction = ruleAction;
            ruleAction = "block";
          }
          if (ruleAction !== "block" && ruleAction !== "allow") {
            continue;
          }
          trackerRule = normalizeTrackerRule(trackerRule);
          let { fallbackUrlFilter, urlFilter, regexFilter, matchCase } = processRegexTrackerRule(trackerDomain, trackerRule, matchCnames);
          if (regexFilter) {
            const { isSupported } = await isRegexSupported({
              regex: regexFilter,
              isCaseSensitive: matchCase
            });
            if (!isSupported) {
              if (fallbackUrlFilter) {
                regexFilter = void 0;
                urlFilter = fallbackUrlFilter;
              } else {
                continue;
              }
            }
          }
          let redirectAction = null;
          let ruleResourceTypes = null;
          if (surrogate) {
            ruleResourceTypes = ["script"];
            if (!supportedSurrogateScripts.has(surrogate)) {
              ruleAction = "block";
            } else {
              ruleAction = "redirect";
              redirectAction = {
                extensionPath: surrogatePathPrefix + surrogate
              };
            }
          }
          priority += TRACKER_RULE_PRIORITY_INCREMENT;
          let initiatorDomains = null;
          if (ruleOptions && (ruleAction === "block" || ruleAction === "redirect")) {
            ruleResourceTypes = normalizeTypesCondition(ruleOptions.types);
            initiatorDomains = ruleOptions.domains;
          }
          {
            const newRule = generateDNRRule5({
              priority,
              actionType: ruleAction,
              redirect: redirectAction,
              urlFilter,
              regexFilter,
              matchCase,
              requestDomains,
              excludedInitiatorDomains,
              initiatorDomains,
              resourceTypes: ruleResourceTypes
            });
            if (clickToLoadAction) {
              newRule[clickToLoadActionSymbol] = clickToLoadAction;
            }
            dnrRules.push(newRule);
          }
          if (ruleExceptions && (ruleAction === "block" || ruleAction === "redirect")) {
            dnrRules.push(
              generateDNRRule5({
                priority,
                actionType: "allow",
                urlFilter,
                regexFilter,
                matchCase,
                resourceTypes: normalizeTypesCondition(ruleExceptions.types),
                requestDomains,
                initiatorDomains: ruleExceptions.domains
              })
            );
          }
        }
        return removeRedundantDNRRules(dnrRules);
      }
      function finalizeDNRRulesAndLookup(startingRuleId, dnrRules) {
        const ruleIdByByStringifiedDNRRule = /* @__PURE__ */ new Map();
        const requestDomainsByRuleId = /* @__PURE__ */ new Map();
        const trackerDomainsByRuleId = /* @__PURE__ */ new Map();
        const matchDetailsByRuleId = {};
        const allowingRulesByClickToLoadAction = {};
        const ruleset = [];
        let nextRuleId = startingRuleId;
        for (const rule of dnrRules) {
          const trackerDomain = rule[trackerDomainSymbol];
          delete rule[trackerDomainSymbol];
          const clickToLoadAction = rule[clickToLoadActionSymbol];
          delete rule[clickToLoadActionSymbol];
          if (clickToLoadAction) {
            const inverseAllowingRule = JSON.parse(JSON.stringify(rule));
            inverseAllowingRule.action.type = "allow";
            delete inverseAllowingRule.action.redirect;
            delete inverseAllowingRule.condition.domainType;
            delete inverseAllowingRule.condition.excludedInitiatorDomains;
            storeInLookup(allowingRulesByClickToLoadAction, clickToLoadAction, [inverseAllowingRule]);
          }
          if (!rule.condition.requestDomains || rule.priority !== BASELINE_PRIORITY || rule.action === "redirect" || clickToLoadAction) {
            const ruleId = nextRuleId++;
            rule.id = ruleId;
            ruleset.push(rule);
            let matchType = "trackerBlocking";
            if (clickToLoadAction) {
              matchType = "clickToLoad";
            } else if (rule.action.type === "redirect") {
              matchType = "surrogateScript";
            }
            matchDetailsByRuleId[ruleId] = {
              type: matchType,
              possibleTrackerDomains: [trackerDomain]
            };
            continue;
          }
          let { requestDomains } = rule.condition;
          delete rule.condition.requestDomains;
          const key = JSON.stringify(rule);
          if (ruleIdByByStringifiedDNRRule.has(key)) {
            const ruleId = ruleIdByByStringifiedDNRRule.get(key);
            storeInLookup(trackerDomainsByRuleId, ruleId, [trackerDomain]);
            storeInLookup(requestDomainsByRuleId, ruleId, requestDomains);
          } else {
            const ruleId = nextRuleId++;
            rule.id = ruleId;
            requestDomains = requestDomains.slice();
            rule.condition.requestDomains = requestDomains;
            ruleset.push(rule);
            ruleIdByByStringifiedDNRRule.set(key, ruleId);
            storeInLookup(trackerDomainsByRuleId, ruleId, [trackerDomain]);
            requestDomainsByRuleId.set(ruleId, requestDomains);
          }
        }
        for (let i = startingRuleId; i < startingRuleId + ruleset.length; i++) {
          if (!trackerDomainsByRuleId.has(i)) {
            continue;
          }
          matchDetailsByRuleId[i] = {
            type: "trackerBlocking",
            possibleTrackerDomains: trackerDomainsByRuleId.get(i)
          };
        }
        return { ruleset, matchDetailsByRuleId, allowingRulesByClickToLoadAction };
      }
      async function generateTdsRuleset2(tds, supportedSurrogateScripts, surrogatePathPrefix, isRegexSupported, startingRuleId = 1) {
        if (typeof tds !== "object" || typeof tds.cnames !== "object" || typeof tds.domains !== "object" || typeof tds.entities !== "object" || typeof tds.trackers !== "object") {
          throw new Error("Invalid block list.");
        }
        if (typeof isRegexSupported !== "function") {
          throw new Error("Missing isRegexSupported function.");
        }
        const requestDomainsByTrackerDomain = generateRequestDomainsByTrackerDomain(tds);
        const priorityByTrackerDomain = calculateTrackerEntryPriorities(tds);
        let regexRuleCount = 0;
        const dnrRules = [];
        for (const [trackerDomain, trackerEntry] of Object.entries(tds.trackers)) {
          const requestDomains = requestDomainsByTrackerDomain.get(trackerDomain);
          if (typeof tds.entities[trackerEntry.owner.name] === "undefined") {
            continue;
          }
          const excludedInitiatorDomains = tds.entities[trackerEntry.owner.name].domains;
          const priority = priorityByTrackerDomain.get(trackerDomain);
          const trackerRules = await generateDNRRulesForTrackerEntry(
            trackerDomain,
            trackerEntry,
            requestDomains,
            excludedInitiatorDomains,
            priority,
            isRegexSupported,
            surrogatePathPrefix,
            supportedSurrogateScripts
          );
          for (const rule of trackerRules) {
            if (rule.condition.regexFilter && ++regexRuleCount > MAXIMUM_REGEX_RULES) {
              throw new Error("Maximum number of regular expression rules exceeded!");
            }
            rule[trackerDomainSymbol] = trackerDomain;
            dnrRules.push(rule);
          }
        }
        return finalizeDNRRulesAndLookup(startingRuleId, dnrRules);
      }
      exports2.BASELINE_PRIORITY = BASELINE_PRIORITY;
      exports2.CEILING_PRIORITY = CEILING_PRIORITY;
      exports2.SUBDOMAIN_PRIORITY_INCREMENT = SUBDOMAIN_PRIORITY_INCREMENT;
      exports2.TRACKER_RULE_PRIORITY_INCREMENT = TRACKER_RULE_PRIORITY_INCREMENT;
      exports2.MAXIMUM_SUBDOMAIN_PRIORITY = MAXIMUM_SUBDOMAIN_PRIORITY;
      exports2.MAXIMUM_TRACKER_RULE_PRIORITY_INCREMENT = MAXIMUM_TRACKER_RULE_PRIORITY_INCREMENT;
      exports2.MAXIMUM_REGEX_RULES = MAXIMUM_REGEX_RULES;
      exports2.getTrackerEntryDomain = getTrackerEntryDomain;
      exports2.generateDNRRule = generateDNRRule5;
      exports2.generateTdsRuleset = generateTdsRuleset2;
    }
  });

  // packages/ddg2dnr/lib/cookies.js
  var require_cookies = __commonJS({
    "packages/ddg2dnr/lib/cookies.js"(exports2) {
      "use strict";
      var { castDNREnum, generateRequestDomainsByTrackerDomain, getTrackerEntryDomain, storeInLookup } = require_utils();
      var COOKIE_PRIORITY = 4e4;
      function generateCookieBlockingRuleset(tds, excludedCookieDomains, siteAllowlist, startingRuleId = 1) {
        const rules = [];
        const entityDomainMapping = /* @__PURE__ */ new Map();
        const trackerDomainExclusions = /* @__PURE__ */ new Map();
        const matchDetailsByRuleId = {};
        const singleDomainEntityDomains = [];
        const requestDomainsByTrackerDomain = generateRequestDomainsByTrackerDomain(tds);
        for (const domain of excludedCookieDomains) {
          const trackerEntryDomain = getTrackerEntryDomain(tds.trackers, domain);
          storeInLookup(trackerDomainExclusions, trackerEntryDomain, [domain]);
        }
        for (const [trackerDomain, trackerEntry] of Object.entries(tds.trackers)) {
          const mapEntry = entityDomainMapping.get(trackerEntry.owner.name) || { domains: /* @__PURE__ */ new Set(), trackerDomains: /* @__PURE__ */ new Set() };
          for (const domain of requestDomainsByTrackerDomain.get(trackerDomain) || []) {
            mapEntry.domains.add(domain);
            mapEntry.trackerDomains.add(domain);
          }
          tds.entities[trackerEntry.owner.name].domains.forEach((d) => mapEntry.domains.add(d));
          entityDomainMapping.set(trackerEntry.owner.name, mapEntry);
        }
        for (const [, { domains, trackerDomains }] of entityDomainMapping.entries()) {
          const excludedRequestDomains = [];
          for (const domain of trackerDomains) {
            if (trackerDomainExclusions.has(domain)) {
              excludedRequestDomains.push(...trackerDomainExclusions.get(domain) || []);
            }
          }
          if (domains.size === 1 && trackerDomains.size === 1 && excludedRequestDomains.length === 0) {
            singleDomainEntityDomains.push(...domains);
            continue;
          }
          rules.push({
            id: startingRuleId++,
            priority: COOKIE_PRIORITY,
            action: {
              type: castDNREnum("modifyHeaders"),
              requestHeaders: [
                {
                  header: "cookie",
                  operation: castDNREnum("remove")
                }
              ],
              responseHeaders: [
                {
                  header: "set-cookie",
                  operation: castDNREnum("remove")
                }
              ]
            },
            condition: {
              requestDomains: Array.from(trackerDomains),
              excludedInitiatorDomains: [...domains, ...siteAllowlist],
              excludedRequestDomains
            }
          });
          matchDetailsByRuleId[startingRuleId] = {
            type: "cookieBlocking",
            possibleTrackerDomains: Array.from(trackerDomains)
          };
        }
        if (singleDomainEntityDomains.length > 0) {
          rules.push({
            id: ++startingRuleId,
            priority: COOKIE_PRIORITY,
            action: {
              type: castDNREnum("modifyHeaders"),
              requestHeaders: [
                {
                  header: "cookie",
                  operation: castDNREnum("remove")
                }
              ],
              responseHeaders: [
                {
                  header: "set-cookie",
                  operation: castDNREnum("remove")
                }
              ]
            },
            condition: {
              requestDomains: singleDomainEntityDomains,
              excludedInitiatorDomains: siteAllowlist,
              domainType: castDNREnum("thirdParty")
            }
          });
          matchDetailsByRuleId[startingRuleId] = {
            type: "cookieBlocking",
            possibleTrackerDomains: singleDomainEntityDomains
          };
        }
        return {
          ruleset: rules,
          matchDetailsByRuleId
        };
      }
      exports2.generateCookieBlockingRuleset = generateCookieBlockingRuleset;
      exports2.COOKIE_PRIORITY = COOKIE_PRIORITY;
    }
  });

  // packages/ddg2dnr/lib/combined.js
  var require_combined = __commonJS({
    "packages/ddg2dnr/lib/combined.js"(exports2) {
      "use strict";
      var { generateCookieBlockingRuleset } = require_cookies();
      function generateCombinedConfigBlocklistRuleset2(tds, config, denylistedDomains, startingRuleId = 1) {
        if (config.features?.cookie?.state !== "enabled") {
          return { ruleset: [], matchDetailsByRuleId: {} };
        }
        const cookieAllowlist = (config.features.cookie?.exceptions.map((entry) => entry.domain) || []).concat(config.unprotectedTemporary.map((entry) => entry.domain)).filter((domain) => !denylistedDomains.includes(domain));
        const excludedCookieDomains = config.features.cookie?.settings.excludedCookieDomains.map((entry) => entry.domain);
        return generateCookieBlockingRuleset(tds, excludedCookieDomains, cookieAllowlist, startingRuleId);
      }
      exports2.generateCombinedConfigBlocklistRuleset = generateCombinedConfigBlocklistRuleset2;
    }
  });

  // shared/js/background/dnr-config-rulesets.js
  function generateEtagRule(id, etag) {
    return (0, import_utils6.generateDNRRule)({
      id,
      priority: 1,
      actionType: "allow",
      urlFilter: etag,
      requestDomains: ["etag.invalid"]
    });
  }
  async function configRulesNeedUpdate(configName, expectedState) {
    const settingName = SETTING_PREFIX + configName;
    const settingValue = import_settings6.default.getSetting(settingName);
    if (!settingValue) {
      return true;
    }
    if (!expectedState.etag) {
      return true;
    }
    for (const [key, value] of Object.entries(expectedState)) {
      if (settingValue[key] !== value) {
        return true;
      }
    }
    const [etagRuleId] = ruleIdRangeByConfigName[configName];
    const existingEtagRule = await findExistingDynamicRule(etagRuleId);
    if (!existingEtagRule) {
      return true;
    }
    return existingEtagRule.condition.urlFilter !== expectedState.etag;
  }
  function minimalConfig({ unprotectedTemporary, features }) {
    const result = { features: {}, unprotectedTemporary };
    for (const featureName of Object.keys(features)) {
      if (isFeatureEnabled(featureName)) {
        result.features[featureName] = features[featureName];
      }
    }
    return result;
  }
  async function updateConfigRules(configName, latestState, rules, matchDetailsByRuleId, allowingRulesByClickToLoadAction = {}) {
    const [ruleIdStart, ruleIdEnd] = ruleIdRangeByConfigName[configName];
    const etagRuleId = ruleIdStart;
    const maxNumberOfRules = ruleIdEnd - ruleIdStart;
    const { etag } = latestState;
    if (!rules) {
      console.error("No declarativeNetRequest rules generated for configuration: ", configName, "(Etag: ", etag, ")");
      return;
    }
    rules.push(generateEtagRule(etagRuleId, etag));
    if (rules.length > maxNumberOfRules) {
      console.error(
        "Too many declarativeNetRequest rules generated for configuration: ",
        configName,
        "(Etag: ",
        etag,
        ", Rules generated: ",
        rules.length,
        ")"
      );
      return;
    }
    const removeRuleIds = [];
    for (let i = ruleIdStart; i <= ruleIdEnd; i++) {
      removeRuleIds.push(i);
    }
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds,
      addRules: rules
    });
    const settingName = SETTING_PREFIX + configName;
    const settingValue = {
      matchDetailsByRuleId
    };
    for (const key of Object.keys(latestState)) {
      settingValue[key] = latestState[key];
    }
    if (Object.keys(allowingRulesByClickToLoadAction).length) {
      import_settings6.default.updateSetting("allowingDnrRulesByClickToLoadRuleAction", allowingRulesByClickToLoadAction);
    }
    import_settings6.default.updateSetting(settingName, settingValue);
  }
  async function updateExtensionConfigRules(etag = null, configValue = null) {
    const extensionVersion = getExtensionVersion();
    const denylistedDomains = getDenylistedDomains();
    const latestState = {
      extensionVersion,
      denylistedDomains: denylistedDomains.join(),
      etag
    };
    if (!configValue) {
      configValue = tds_default.config;
    }
    if (!etag) {
      const settingName = SETTING_PREFIX + "config";
      const settingValue = import_settings6.default.getSetting(settingName);
      if (!settingValue?.etag) {
        return;
      }
      latestState.etag = settingValue.etag;
    }
    if (!await configRulesNeedUpdate("config", latestState)) {
      return;
    }
    const [ruleIdStart] = ruleIdRangeByConfigName.config;
    const { ruleset, matchDetailsByRuleId } = await (0, import_extensionConfiguration.generateExtensionConfigurationRuleset)(
      minimalConfig(configValue),
      denylistedDomains,
      chrome.declarativeNetRequest.isRegexSupported,
      ruleIdStart + 1
    );
    await updateConfigRules("config", latestState, ruleset, matchDetailsByRuleId);
  }
  async function updateCombinedConfigBlocklistRules() {
    const extensionVersion = getExtensionVersion();
    const denylistedDomains = getDenylistedDomains();
    const tdsEtag = import_settings6.default.getSetting("tds-etag");
    const combinedState = {
      etag: `${import_settings6.default.getSetting("config-etag")}-${tdsEtag}`,
      denylistedDomains: denylistedDomains.join(),
      extensionVersion
    };
    if (tdsEtag && await configRulesNeedUpdate("combined", combinedState)) {
      const { ruleset, matchDetailsByRuleId } = (0, import_combined.generateCombinedConfigBlocklistRuleset)(
        tds_default.tds,
        minimalConfig(tds_default.config),
        denylistedDomains,
        ruleIdRangeByConfigName.combined[0] + 1
      );
      await updateConfigRules("combined", combinedState, ruleset, matchDetailsByRuleId);
    }
  }
  var import_settings6, import_trackers, import_extensionConfiguration, import_tds7, import_utils6, import_combined, ruleUpdateLock;
  var init_dnr_config_rulesets = __esm({
    "shared/js/background/dnr-config-rulesets.js"() {
      "use strict";
      init_wrapper();
      import_settings6 = __toESM(require_settings());
      init_tds();
      import_trackers = __toESM(require_trackers2());
      init_utils();
      init_dnr_gpc();
      init_dnr_service_worker_initiated();
      init_dnr_user_allowlist();
      init_dnr_utils();
      import_extensionConfiguration = __toESM(require_extensionConfiguration());
      import_tds7 = __toESM(require_tds());
      import_utils6 = __toESM(require_utils());
      import_combined = __toESM(require_combined());
      ruleUpdateLock = Promise.resolve();
    }
  });

  // shared/js/background/dnr-user-allowlist.js
  var dnr_user_allowlist_exports = {};
  __export(dnr_user_allowlist_exports, {
    getDenylistedDomains: () => getDenylistedDomains,
    refreshUserAllowlistRules: () => refreshUserAllowlistRules,
    toggleUserAllowlistDomain: () => toggleUserAllowlistDomain,
    updateUserDenylist: () => updateUserDenylist
  });
  function normalizeUntrustedDomain(domain) {
    try {
      return new URL("https://" + domain).hostname;
    } catch (e) {
      return null;
    }
  }
  async function updateUserAllowlistRule(allowlistedDomains) {
    const addRules = [];
    const removeRuleIds = [USER_ALLOWLIST_RULE_ID];
    if (allowlistedDomains.length > 0) {
      addRules.push(
        (0, import_utils7.generateDNRRule)({
          id: USER_ALLOWLIST_RULE_ID,
          priority: import_rulePriorities3.USER_ALLOWLISTED_PRIORITY,
          actionType: "allowAllRequests",
          resourceTypes: ["main_frame"],
          requestDomains: allowlistedDomains
        })
      );
    }
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds,
      addRules
    });
  }
  async function toggleUserAllowlistDomain(domain, enable) {
    const normalizedDomain = normalizeUntrustedDomain(domain);
    if (typeof normalizedDomain !== "string") {
      return;
    }
    const existingRule = await findExistingDynamicRule(USER_ALLOWLIST_RULE_ID);
    const allowlistedDomains = new Set(existingRule ? existingRule.condition.requestDomains : []);
    allowlistedDomains[enable ? "add" : "delete"](normalizedDomain);
    await updateUserAllowlistRule(Array.from(allowlistedDomains));
  }
  async function refreshUserAllowlistRules(allowlistedDomains) {
    const normalizedAllowlistedDomains = (
      /** @type {string[]} */
      allowlistedDomains.map(normalizeUntrustedDomain).filter((domain) => typeof domain === "string")
    );
    await updateUserAllowlistRule(normalizedAllowlistedDomains);
  }
  function getDenylistedDomains() {
    const denylist = import_settings7.default.getSetting("denylisted") || {};
    const denylistedDomains = [];
    for (const [domain, enabled] of Object.entries(denylist)) {
      if (enabled) {
        const normalizedDomain = normalizeUntrustedDomain(domain);
        if (normalizedDomain) {
          denylistedDomains.push(normalizedDomain);
        }
      }
    }
    return denylistedDomains.sort();
  }
  async function updateUserDenylist() {
    await updateExtensionConfigRules();
    await updateCombinedConfigBlocklistRules();
  }
  var import_settings7, import_rulePriorities3, import_utils7;
  var init_dnr_user_allowlist = __esm({
    "shared/js/background/dnr-user-allowlist.js"() {
      "use strict";
      import_settings7 = __toESM(require_settings());
      import_rulePriorities3 = __toESM(require_rulePriorities());
      init_dnr_config_rulesets();
      init_dnr_utils();
      import_utils7 = __toESM(require_utils());
    }
  });

  // shared/js/background/tab-manager.js
  var require_tab_manager = __commonJS({
    "shared/js/background/tab-manager.js"(exports2, module2) {
      "use strict";
      var Companies3 = require_companies();
      var settings14 = require_settings();
      var Tab = require_tab();
      var ServiceWorkerTab = require_sw_tab();
      var { TabState: TabState3 } = (init_tab_state(), __toCommonJS(tab_state_exports));
      var browserWrapper5 = (init_wrapper(), __toCommonJS(wrapper_exports));
      var { toggleUserAllowlistDomain: toggleUserAllowlistDomain2, updateUserDenylist: updateUserDenylist2 } = (init_dnr_user_allowlist(), __toCommonJS(dnr_user_allowlist_exports));
      var { clearClickToLoadDnrRulesForTab: clearClickToLoadDnrRulesForTab2 } = (init_dnr_click_to_load(), __toCommonJS(dnr_click_to_load_exports));
      var { getCurrentTab: getCurrentTab3 } = (init_utils(), __toCommonJS(utils_exports));
      var persistentTabProperties = ["ampUrl", "cleanAmpUrl", "dnrRuleIdsByDisabledClickToLoadRuleAction", "userRefreshCount"];
      var TabManager = class {
        constructor() {
          this.tabContainer = {};
          this.swContainer = {};
        }
        /* This overwrites the current tab data for a given
         * id and is only called in three cases:
         * 1. When a new tab is opened. See onUpdated listener below
         * 2. When we get a new main_frame request
         */
        create(tabData) {
          const normalizedData = browserWrapper5.normalizeTabData(tabData);
          const newTab = new Tab(normalizedData);
          const oldTab = this.tabContainer[newTab.id];
          if (oldTab) {
            for (const property of persistentTabProperties) {
              newTab[property] = oldTab[property];
            }
            if (oldTab.adClick?.shouldPropagateAdClickForNavigation(oldTab)) {
              newTab.adClick = oldTab.adClick.clone();
            }
          }
          this.tabContainer[newTab.id] = newTab;
          return newTab;
        }
        async restoreOrCreate(tabData) {
          const restored = await this.restore(tabData.id);
          if (!restored) {
            await this.create(tabData);
          }
        }
        async restore(tabId) {
          const restoredState = await Tab.restore(tabId);
          if (restoredState) {
            this.tabContainer[tabId] = restoredState;
          }
          return restoredState;
        }
        delete(id) {
          const tabToRemove = this.tabContainer[id];
          if (tabToRemove) {
            tabToRemove?.adClick?.removeDNR();
            if (browserWrapper5.getManifestVersion() === 3) {
              clearClickToLoadDnrRulesForTab2(tabToRemove);
            }
          }
          delete this.tabContainer[id];
          TabState3.delete(id);
        }
        has(id) {
          return id in this.tabContainer;
        }
        /**
         * Called using either a chrome tab object or by id
         * get({tabId: ###});
         * @returns {Tab}
         */
        get(tabData) {
          if (tabData.tabId === -1 && (tabData.initiator || tabData.documentUrl)) {
            const swUrl = tabData.initiator || tabData.documentUrl;
            const swOrigin = new URL(swUrl).origin;
            if (!this.swContainer[swOrigin]) {
              this.swContainer[swOrigin] = new ServiceWorkerTab(swUrl, this.tabContainer);
            }
            return this.swContainer[swOrigin];
          }
          return this.tabContainer[tabData.tabId];
        }
        async getOrRestoreTab(tabId) {
          if (!tabManager4.has(tabId)) {
            await tabManager4.restore(tabId);
          }
          return tabManager4.get({ tabId });
        }
        /**
         * Return a Tab Object for the currently focused tab, if possible.
         *
         * @returns {Promise<import("./classes/tab")?>}
         */
        async getOrRestoreCurrentTab() {
          const currentTabDetails = await getCurrentTab3();
          if (currentTabDetails?.id) {
            return await tabManager4.getOrRestoreTab(currentTabDetails.id);
          }
          return null;
        }
        /**
         * This will allowlist any open tabs with the same domain
         *
         * @param {object} data
         * @param {allowlistName} data.list - name of the allowlist to update
         * @param {string} data.domain - domain to allowlist
         * @param {boolean} data.value - allowlist value, true or false
         * @return {Promise}
         */
        async setList(data) {
          this.setGlobalAllowlist(data.list, data.domain, data.value);
          const allTabs = [
            ...Object.keys(this.tabContainer).map((tabId) => this.tabContainer[tabId]),
            ...Object.keys(this.swContainer).map((origin) => this.swContainer[origin])
          ];
          allTabs.filter((tab) => tab.site && tab.site.domain === data.domain).forEach((tab) => {
            tab.site.setListValue(data.list, data.value);
          });
          if (browserWrapper5.getManifestVersion() === 3) {
            if (data.list === "allowlisted") {
              await toggleUserAllowlistDomain2(data.domain, data.value);
            } else if (data.list === "denylisted") {
              await updateUserDenylist2();
            }
          }
        }
        /**
         * Update the allowlists kept in settings
         *
         * @param {allowlistName} list
         * @param {string} domain
         * @param {boolean} value
         */
        setGlobalAllowlist(list, domain, value) {
          const globalallowlist = settings14.getSetting(list) || {};
          if (value) {
            globalallowlist[domain] = true;
          } else {
            delete globalallowlist[domain];
          }
          settings14.updateSetting(list, globalallowlist);
        }
        /* This handles the new tab case. You have clicked to
         * open a new tab and haven't typed in a url yet.
         * This will fire an onUpdated event and we can create
         * an intital tab instance here. We'll update this instance
         * later on when webrequests start coming in.
         */
        createOrUpdateTab(id, info) {
          if (!tabManager4.get({ tabId: id })) {
            info.id = id;
            return tabManager4.create(info);
          } else {
            const tab = tabManager4.get({ tabId: id });
            if (tab && info.status) {
              tab.status = info.status;
              if (tab.status === "complete") {
                const hasHttps = !!(tab.url && tab.url.match(/^https:\/\//));
                tab.site.grade.setHttps(hasHttps, hasHttps);
                console.info(tab.site.grade);
                if (tab.statusCode === 200 && !tab.site.didIncrementCompaniesData) {
                  if (tab.trackers && Object.keys(tab.trackers).length > 0) {
                    Companies3.incrementTotalPagesWithTrackers();
                  }
                  Companies3.incrementTotalPages();
                  tab.site.didIncrementCompaniesData = true;
                }
              }
            }
            return tab;
          }
        }
        updateTabUrl(request) {
          const tab = tabManager4.get({ tabId: request.tabId });
          if (tab) {
            tab.statusCode = request.statusCode;
            if (tab.statusCode === 200) {
              tab.updateSite(request.url);
            }
          }
        }
      };
      var tabManager4 = new TabManager();
      module2.exports = tabManager4;
    }
  });

  // shared/js/background/tracker-utils.js
  var tracker_utils_exports = {};
  __export(tracker_utils_exports, {
    hasTrackerListLoaded: () => hasTrackerListLoaded,
    isFirstPartyByEntity: () => isFirstPartyByEntity,
    isSameEntity: () => isSameEntity,
    isTracker: () => isTracker,
    truncateReferrer: () => truncateReferrer
  });
  function hasTrackerListLoaded() {
    return !!import_trackers2.default.trackerList;
  }
  function isSameEntity(url1, url2) {
    try {
      const domain1 = (0, import_tldts3.parse)(url1).domain;
      const domain2 = (0, import_tldts3.parse)(url2).domain;
      if (domain1 === domain2) return true;
      const entity1 = import_trackers2.default.findWebsiteOwner({ siteUrlSplit: extractHostFromURL(url1).split(".") });
      const entity2 = import_trackers2.default.findWebsiteOwner({ siteUrlSplit: extractHostFromURL(url2).split(".") });
      if (entity1 === void 0 && entity2 === void 0) return false;
      return entity1 === entity2;
    } catch (e) {
      return false;
    }
  }
  function isTracker(url) {
    const data = {
      urlToCheckSplit: extractHostFromURL(url).split(".")
    };
    const tracker = import_trackers2.default.findTracker(data);
    return !!tracker;
  }
  function truncateReferrer(referrer, target) {
    if (!referrer || referrer === "") {
      return void 0;
    }
    if (isSafeListed(referrer) || isSafeListed(target)) {
      return void 0;
    }
    const { fromCname, finalURL } = import_trackers2.default.resolveCname(target);
    if (isSameEntity(referrer, target) && (!fromCname || isSameEntity(referrer, finalURL))) {
      return void 0;
    }
    const exceptionList = tds_default.config.features.referrer.exceptions;
    if (brokenListIndex(referrer, exceptionList) !== -1 || brokenListIndex(target, exceptionList) !== -1) {
      return void 0;
    }
    return extractLimitedDomainFromURL(referrer, { keepSubdomains: true });
  }
  function isFirstPartyByEntity(trackerUrl, siteUrl) {
    const cnameResolution = import_trackers2.default.resolveCname(trackerUrl);
    trackerUrl = cnameResolution.finalURL;
    if (isSameTopLevelDomain(trackerUrl, siteUrl)) {
      return true;
    }
    const trackerDomain = (0, import_tldts3.parse)(trackerUrl).domain;
    if (!trackerDomain) return false;
    const trackerOwner = import_trackers2.default.findTrackerOwner(trackerDomain);
    const websiteOwner = import_trackers2.default.findWebsiteOwner({ siteUrlSplit: extractHostFromURL(siteUrl).split(".") });
    return trackerOwner && websiteOwner ? trackerOwner === websiteOwner : false;
  }
  var import_trackers2, import_tldts3;
  var init_tracker_utils = __esm({
    "shared/js/background/tracker-utils.js"() {
      "use strict";
      init_utils();
      import_trackers2 = __toESM(require_trackers2());
      import_tldts3 = __toESM(require_cjs());
      init_tds();
    }
  });

  // shared/js/background/devtools.js
  var devtools_exports = {};
  __export(devtools_exports, {
    isActive: () => isActive,
    postMessage: () => postMessage,
    registerDevtools: () => registerDevtools
  });
  function registerDevtools(newDevtools) {
    devtools = newDevtools;
  }
  function isActive(tabId) {
    if (devtools) {
      return devtools.isActive(tabId);
    }
    return false;
  }
  function postMessage(tabId, action, message) {
    if (devtools) {
      devtools.postMessage(tabId, action, message);
    }
  }
  var devtools;
  var init_devtools = __esm({
    "shared/js/background/devtools.js"() {
      "use strict";
      devtools = null;
    }
  });

  // shared/js/background/classes/legacy-tab-transfer.js
  var legacy_tab_transfer_exports = {};
  __export(legacy_tab_transfer_exports, {
    LegacyTabTransfer: () => LegacyTabTransfer
  });
  function isPrimitive(value) {
    return Object(value) !== value;
  }
  function isStructuredCloneable(value) {
    return isPrimitive(value) || Array.isArray(value);
  }
  function cloneClassObject(object) {
    if (isStructuredCloneable(object)) {
      return structuredClone(object);
    }
    const out = {};
    for (const key of Object.keys(object)) {
      const value = object[key];
      if (key.startsWith("_")) {
        continue;
      }
      if (isStructuredCloneable(value)) {
        out[key] = structuredClone(value);
      } else {
        out[key] = cloneClassObject(value);
      }
    }
    if (hasModifiedPrototype(object)) {
      const objectDescriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(object));
      for (const [key, value] of Object.entries(objectDescriptors)) {
        if (typeof value.get === "function") {
          out[key] = cloneClassObject(object[key]);
        }
      }
    }
    return out;
  }
  function hasModifiedPrototype(object) {
    return Object.getPrototypeOf(object) !== Object.getPrototypeOf({});
  }
  var LegacyTabTransfer;
  var init_legacy_tab_transfer = __esm({
    "shared/js/background/classes/legacy-tab-transfer.js"() {
      "use strict";
      LegacyTabTransfer = class {
        /**
         * @param {import('./tab')} tab
         */
        constructor(tab) {
          const clonedTab = cloneClassObject(tab);
          const entries = Object.entries(clonedTab);
          for (const [key] of entries) {
            this[key] = clonedTab[key];
          }
        }
      };
    }
  });

  // shared/js/background/helpers/arguments-object.js
  function getArgumentsObject(tabId, sender, documentUrl, sessionKey) {
    const tab = tabManager.get({ tabId });
    if (!tab || !tab.url) {
      return null;
    }
    const tabClone = new LegacyTabTransfer2(tab);
    const site = tabClone.site;
    let cookie = {};
    if (sender.url === "about:blank") {
      const aboutBlankEnabled = utils2.getEnabledFeaturesAboutBlank(tab.url);
      site.enabledFeatures = site.enabledFeatures.filter((feature) => aboutBlankEnabled.includes(feature));
    }
    site.enabledFeatures = site.enabledFeatures.filter((feature) => {
      if (feature === "trackerAllowlist") return false;
      if (feature === "referrer" && !tab.referrer?.referrer) return false;
      return true;
    });
    const featureSettings = {};
    for (const feature of site.enabledFeatures) {
      const featureSetting = utils2.getFeatureSettings(feature);
      if (Object.keys(featureSetting).length) {
        featureSettings[feature] = featureSetting;
      }
    }
    if (tab.site.isFeatureEnabled("cookie")) {
      cookie = {
        isThirdPartyFrame: false,
        shouldBlock: false,
        isTracker: false,
        isFrame: false
      };
      if (sender.frameId !== 0) {
        cookie.isFrame = true;
      }
      if (trackerutils.hasTrackerListLoaded()) {
        if (documentUrl && trackerutils.isTracker(documentUrl)) {
          cookie.isTracker = true;
        }
        cookie.isThirdPartyFrame = !trackerutils.isFirstPartyByEntity(documentUrl, tab.url);
      }
      cookie.shouldBlock = !utils2.isCookieExcluded(documentUrl);
    }
    return {
      featureSettings,
      debug: isActive2(tabId),
      cookie,
      globalPrivacyControlValue: settings10.getSetting("GPC"),
      stringExemptionLists: utils2.getBrokenScriptLists(),
      sessionKey,
      site,
      platform: constants2.platform,
      locale: getUserLocale(),
      assets: {
        regularFontUrl: getExtensionURL("/public/font/ProximaNova-Reg-webfont.woff"),
        boldFontUrl: getExtensionURL("/public/font/ProximaNova-Bold-webfont.woff")
      }
    };
  }
  var utils2, tabManager, trackerutils, settings10, isActive2, constants2, LegacyTabTransfer2;
  var init_arguments_object = __esm({
    "shared/js/background/helpers/arguments-object.js"() {
      "use strict";
      init_i18n();
      init_wrapper();
      utils2 = (init_utils(), __toCommonJS(utils_exports));
      tabManager = require_tab_manager();
      trackerutils = (init_tracker_utils(), __toCommonJS(tracker_utils_exports));
      settings10 = require_settings();
      ({ isActive: isActive2 } = (init_devtools(), __toCommonJS(devtools_exports)));
      constants2 = require_constants();
      ({ LegacyTabTransfer: LegacyTabTransfer2 } = (init_legacy_tab_transfer(), __toCommonJS(legacy_tab_transfer_exports)));
    }
  });

  // shared/js/background/broken-site-report.js
  async function getDisclosureDetails() {
    let siteUrl = null;
    const currentTabUrl = (await getCurrentTab2())?.url;
    if (currentTabUrl) {
      siteUrl = getURLWithoutQueryString2(currentTabUrl);
    }
    const response = { data: [] };
    for (const paramId of PARAM_IDS) {
      if (paramId === "siteUrl" && siteUrl) {
        response.data.push({ id: "siteUrl", additional: { url: siteUrl } });
      } else {
        response.data.push({ id: paramId });
      }
    }
    return response;
  }
  var load2, browserWrapper3, settings11, parseUserAgentString2, getCurrentTab2, getURLWithoutQueryString2, getURL2, PARAM_IDS;
  var init_broken_site_report = __esm({
    "shared/js/background/broken-site-report.js"() {
      "use strict";
      load2 = require_load();
      browserWrapper3 = (init_wrapper(), __toCommonJS(wrapper_exports));
      settings11 = require_settings();
      parseUserAgentString2 = require_parse_user_agent_string();
      ({ getCurrentTab: getCurrentTab2, getURLWithoutQueryString: getURLWithoutQueryString2 } = (init_utils(), __toCommonJS(utils_exports)));
      ({ getURL: getURL2 } = (init_pixels(), __toCommonJS(pixels_exports)));
      PARAM_IDS = [
        "siteUrl",
        "atb",
        "errorDescriptions",
        "extensionVersion",
        "features",
        "httpErrorCodes",
        "jsPerformance",
        "locale",
        "openerContext",
        "requests",
        "userRefreshCount"
      ];
    }
  });

  // shared/js/background/components/toggle-reports.js
  var import_webextension_polyfill4, import_settings8, import_tab_manager, ToggleReports;
  var init_toggle_reports = __esm({
    "shared/js/background/components/toggle-reports.js"() {
      "use strict";
      import_webextension_polyfill4 = __toESM(require_browser_polyfill());
      init_message_handlers();
      init_popup_messaging();
      import_settings8 = __toESM(require_settings());
      init_utils();
      init_broken_site_report();
      init_wrapper();
      import_tab_manager = __toESM(require_tab_manager());
      ToggleReports = class _ToggleReports {
        static ALARM_NAME = "toggleReportsClearExpired";
        /**
         *
         * @param {{
         *   dashboardMessaging: import('./dashboard-messaging').default
         * }} args
         */
        constructor({ dashboardMessaging }) {
          this.dashboardMessaging = dashboardMessaging;
          this.onDisconnect = this.toggleReportFinished.bind(this, false);
          registerMessageHandler("getToggleReportOptions", (_, sender) => this.toggleReportStarted(sender));
          registerMessageHandler("rejectToggleReport", (_, sender) => this.toggleReportFinished(false, sender));
          registerMessageHandler("sendToggleReport", (_, sender) => this.toggleReportFinished(true, sender));
          registerMessageHandler("seeWhatIsSent", () => {
          });
          createAlarm(_ToggleReports.ALARM_NAME, { periodInMinutes: 60 });
          import_webextension_polyfill4.default.alarms.onAlarm.addListener(async ({ name }) => {
            if (name === _ToggleReports.ALARM_NAME) {
              await _ToggleReports.clearExpiredResponses();
            }
          });
        }
        /**
         * Provides details of what will be included in a breakage report, so that
         * the user can make an informed decision. Called when the "toggle reports"
         * UI flow begins.
         *
         * @param {browser.Runtime.Port} sender
         * @returns {Promise<import('../broken-site-report').DisclosureDetails>}
         */
        async toggleReportStarted(sender) {
          sender?.onDisconnect?.addListener(this.onDisconnect);
          return getDisclosureDetails();
        }
        /**
         * Called when the "toggle reports" UI flow finishes. If the user chose to
         * send the breakage report that will be sent now.
         *
         * @param {boolean} accepted
         *   True if the user opted to send the breakage report, false otherwise.
         * @param {browser.Runtime.Port?} sender
         * @returns {Promise<void>}
         */
        async toggleReportFinished(accepted, sender) {
          sender?.onDisconnect?.removeListener(this.onDisconnect);
          await import_settings8.default.ready();
          const times = import_settings8.default.getSetting("toggleReportTimes") || [];
          times.push({ timestamp: Date.now(), accepted });
          import_settings8.default.updateSetting("toggleReportTimes", times);
          if (accepted) {
            try {
              await this.dashboardMessaging.submitBrokenSiteReport(
                {},
                "protection-toggled-off-breakage-report",
                "on_protections_off_dashboard_main"
              );
            } catch (e) {
              console.error("Failed to send breakage report", e);
            }
          }
          await Promise.all([reloadCurrentTab(), resolveAfterDelay(accepted ? 5e3 : 0)]);
          postPopupMessage({ messageType: "closePopup" });
        }
        /**
         * Clear any old recorded response times.
         *
         * @returns {Promise<void>}
         */
        static async clearExpiredResponses() {
          const { dismissInterval, promptInterval } = getFeatureSettings("toggleReports");
          const now = Date.now();
          let dismissCutoff = null;
          let acceptCutoff = null;
          if (typeof dismissInterval === "number") {
            dismissCutoff = now - dismissInterval * 1e3;
          }
          if (typeof promptInterval === "number") {
            acceptCutoff = now - promptInterval * 1e3;
          }
          await import_settings8.default.ready();
          let times = import_settings8.default.getSetting("toggleReportTimes") || [];
          const existingTimesLength = times.length;
          times = times.filter(
            ({ accepted, timestamp }) => accepted && (typeof acceptCutoff !== "number" || timestamp >= acceptCutoff) || !accepted && (typeof dismissCutoff !== "number" || timestamp >= dismissCutoff)
          );
          if (times.length < existingTimesLength) {
            import_settings8.default.updateSetting("toggleReportTimes", times);
          }
        }
        /**
         * Count the number of accepted and declined responses recorded.
         *
         * Note: Does not filter away expired times, take care to call
         *       ToggleReports.clearExpiredResponses() first.
         *
         * @returns {Promise<{accepted: number, declined: number}>}
         */
        static async countResponses() {
          await import_settings8.default.ready();
          const times = import_settings8.default.getSetting("toggleReportTimes") || [];
          const counts = { accepted: 0, declined: 0 };
          for (const { accepted } of times) {
            counts[accepted ? "accepted" : "declined"]++;
          }
          return counts;
        }
        /**
         * Check if the toggle report UI flow should been displayed display for the
         * currently focused tab.
         *
         * @returns {Promise<boolean>}
         */
        static async shouldDisplay() {
          const currentTab = await import_tab_manager.default.getOrRestoreCurrentTab();
          if (!currentTab?.site?.isFeatureEnabled("toggleReports")) {
            return false;
          }
          const { dismissLogicEnabled, promptLimitLogicEnabled, maxPromptCount } = getFeatureSettings("toggleReports");
          await _ToggleReports.clearExpiredResponses();
          const counts = await _ToggleReports.countResponses();
          if (dismissLogicEnabled && counts.declined > 0) {
            return false;
          }
          if (promptLimitLogicEnabled && typeof maxPromptCount === "number" && counts.accepted >= maxPromptCount) {
            return false;
          }
          return true;
        }
      };
    }
  });

  // shared/js/background/message-handlers.js
  async function registeredContentScript(options, sender, req) {
    const sessionKey = await utils3.getSessionKey();
    const argumentsObject = getArgumentsObject(sender.tab.id, sender, options?.documentUrl || req.documentUrl, sessionKey);
    if (!argumentsObject) {
      return;
    }
    return argumentsObject;
  }
  function resetTrackersData() {
    return Companies2.resetData();
  }
  function getExtensionVersion2() {
    return browserWrapper4.getExtensionVersion();
  }
  function setList(options) {
    tabManager3.setList(options);
  }
  async function setLists(options) {
    let allowlisting = false;
    for (const listItem of options.lists) {
      if (listItem.value && listItem.list === "allowlisted") {
        allowlisting = true;
      }
      await tabManager3.setList(listItem);
    }
    if (allowlisting && await ToggleReports.shouldDisplay()) {
      postPopupMessage({ messageType: "toggleReport" });
      return;
    }
    try {
      postPopupMessage({ messageType: "closePopup" });
      await reloadCurrentTab();
    } catch (e) {
      console.error("Error trying to reload+refresh following `setLists` message", e);
    }
  }
  function allowlistOptIn(optInData) {
    tabManager3.setGlobalAllowlist("allowlistOptIn", optInData.domain, optInData.value);
  }
  function getBrowser() {
    return browserName;
  }
  function openOptions() {
    if (browserName === "moz") {
      import_webextension_polyfill5.default.tabs.create({ url: getExtensionURL("/html/options.html") });
    } else {
      import_webextension_polyfill5.default.runtime.openOptionsPage();
    }
  }
  function getTopBlockedByPages(options) {
    return Companies2.getTopBlockedByPages(options);
  }
  async function getClickToLoadState() {
    const devMode = await browserWrapper4.getFromSessionStorage("dev") || false;
    await settings13.ready();
    const youtubePreviewsEnabled = await settings13.getSetting("youtubePreviewsEnabled") || false;
    return { devMode, youtubePreviewsEnabled };
  }
  async function getYouTubeVideoDetails(videoURL) {
    const endpointURL = new URL("https://www.youtube.com/oembed?format=json");
    const parsedVideoURL = new URL(videoURL);
    const playlistID = parsedVideoURL.searchParams.get("list");
    const videoId = parsedVideoURL.pathname.split("/").pop();
    if (playlistID) {
      parsedVideoURL.hostname = endpointURL.hostname;
      endpointURL.searchParams.set("url", parsedVideoURL.href);
    } else {
      endpointURL.searchParams.set("url", "https://youtu.be/" + videoId);
    }
    try {
      const youTubeVideoResponse = await fetch(endpointURL.href, {
        referrerPolicy: "no-referrer",
        credentials: "omit"
      }).then((response) => response.json());
      const { title, thumbnail_url: previewImage } = youTubeVideoResponse;
      return { status: "success", videoURL, title, previewImage };
    } catch (e) {
      return { status: "failed", videoURL };
    }
  }
  async function unblockClickToLoadContent(data, sender) {
    const tab = tabManager3.get({ tabId: sender.tab.id });
    if (!tab.disabledClickToLoadRuleActions.includes(data.action)) {
      tab.disabledClickToLoadRuleActions.push(data.action);
    }
    if (browserWrapper4.getManifestVersion() === 3) {
      await ensureClickToLoadRuleActionDisabled(data.action, tab);
    }
  }
  function updateYouTubeCTLAddedFlag(value, sender) {
    const tab = tabManager3.get({ tabId: sender.tab.id });
    tab.ctlYouTube = Boolean(value);
  }
  function updateFacebookCTLBreakageFlags({ ctlFacebookPlaceholderShown = false, ctlFacebookLogin = false }, sender) {
    const tabId = sender?.tab?.id;
    if (typeof tabId === "undefined") {
      return;
    }
    const tab = tabManager3.get({ tabId });
    if (ctlFacebookPlaceholderShown) {
      tab.ctlFacebookPlaceholderShown = true;
    }
    if (ctlFacebookLogin) {
      tab.ctlFacebookLogin = true;
    }
  }
  function setYoutubePreviewsEnabled(value, sender) {
    return updateSetting({ name: "youtubePreviewsEnabled", value });
  }
  async function updateSetting({ name, value }) {
    await settings13.ready();
    settings13.updateSetting(name, value);
    utils3.sendAllTabsMessage({ messageType: `ddg-settings-${name}`, value });
    return { messageType: `ddg-settings-${name}`, value };
  }
  async function getSetting({ name }) {
    await settings13.ready();
    return settings13.getSetting(name);
  }
  function getTopBlocked(options) {
    return Companies2.getTopBlocked(options);
  }
  function getListContents(list) {
    const loader = globalThis.components.tds[list];
    return {
      data: tds_default.getSerializableList(list),
      etag: loader.etag
    };
  }
  async function setListContents({ name, value }) {
    const loader = globalThis.components.tds[name];
    await loader.overrideDataValue(value);
    return loader.etag;
  }
  async function reloadList(listName) {
    await globalThis.components.tds[listName].checkForUpdates(true);
  }
  function debuggerMessage(message, sender) {
    devtools2.postMessage(sender.tab?.id, message.action, message.message);
  }
  function search({ term }) {
    const browserInfo2 = (0, import_parse_user_agent_string2.default)();
    if (browserInfo2?.os) {
      const url = new URL("https://duckduckgo.com");
      url.searchParams.set("q", term);
      url.searchParams.set("bext", browserInfo2.os + "cr");
      import_webextension_polyfill5.default.tabs.create({ url: url.toString() });
    }
  }
  function openShareFeedbackPage() {
    return browserWrapper4.openExtensionPage("/html/feedback.html");
  }
  async function isClickToLoadYoutubeEnabled() {
    await tds_default.ready("config");
    return isFeatureEnabled("clickToLoad") && tds_default?.config?.features?.clickToLoad?.settings?.Youtube?.state === "enabled";
  }
  function addDebugFlag(message, sender, req) {
    const tab = tabManager3.get({ tabId: sender.tab.id });
    const flags = new Set(tab.debugFlags);
    flags.add(message.flag);
    tab.debugFlags = [...flags];
  }
  function registerMessageHandler(name, func) {
    messageHandlers[name] = func;
  }
  var import_webextension_polyfill5, import_parse_user_agent_string2, utils3, settings13, tabManager3, Companies2, browserName, devtools2, browserWrapper4, messageHandlers;
  var init_message_handlers = __esm({
    "shared/js/background/message-handlers.js"() {
      "use strict";
      import_webextension_polyfill5 = __toESM(require_browser_polyfill());
      import_parse_user_agent_string2 = __toESM(require_parse_user_agent_string());
      init_wrapper();
      init_utils();
      init_dnr_click_to_load();
      init_tds();
      init_arguments_object();
      init_popup_messaging();
      init_toggle_reports();
      utils3 = (init_utils(), __toCommonJS(utils_exports));
      settings13 = require_settings();
      tabManager3 = require_tab_manager();
      Companies2 = require_companies();
      browserName = utils3.getBrowserName();
      devtools2 = (init_devtools(), __toCommonJS(devtools_exports));
      browserWrapper4 = (init_wrapper(), __toCommonJS(wrapper_exports));
      messageHandlers = {
        registeredContentScript,
        resetTrackersData,
        getExtensionVersion: getExtensionVersion2,
        setList,
        setLists,
        allowlistOptIn,
        getBrowser,
        openOptions,
        getTopBlockedByPages,
        getClickToLoadState,
        getYouTubeVideoDetails,
        unblockClickToLoadContent,
        updateYouTubeCTLAddedFlag,
        updateFacebookCTLBreakageFlags,
        setYoutubePreviewsEnabled,
        updateSetting,
        getSetting,
        getTopBlocked,
        getListContents,
        setListContents,
        reloadList,
        debuggerMessage,
        search,
        openShareFeedbackPage,
        isClickToLoadYoutubeEnabled,
        addDebugFlag
      };
    }
  });

  // shared/js/background/components/email-autofill.js
  var email_autofill_exports = {};
  __export(email_autofill_exports, {
    REFETCH_ALIAS_ALARM: () => REFETCH_ALIAS_ALARM,
    default: () => EmailAutofill,
    formatAddress: () => formatAddress,
    isValidToken: () => isValidToken,
    isValidUsername: () => isValidUsername
  });
  function currentDate() {
    return (/* @__PURE__ */ new Date()).toLocaleString("en-CA", {
      timeZone: "America/New_York",
      dateStyle: "short"
    });
  }
  function isExpectedSender(sender) {
    try {
      const domain = (0, import_tldts4.getDomain)(sender.url);
      const { pathname } = new URL(sender.url);
      return domain === "duckduckgo.com" && pathname.startsWith("/email");
    } catch {
      return false;
    }
  }
  function getEmailProtectionCapabilities(_, sender) {
    if (!isExpectedSender(sender)) return;
    return {
      addUserData: true,
      getUserData: true,
      removeUserData: true
    };
  }
  var import_webextension_polyfill6, import_tldts4, MENU_ITEM_ID, REFETCH_ALIAS_ALARM, REFETCH_ALIAS_ATTEMPT, EmailAutofill, formatAddress, isValidUsername, isValidToken;
  var init_email_autofill = __esm({
    "shared/js/background/components/email-autofill.js"() {
      "use strict";
      import_webextension_polyfill6 = __toESM(require_browser_polyfill());
      init_pixels();
      init_message_handlers();
      import_tldts4 = __toESM(require_cjs());
      init_tds();
      init_utils();
      init_wrapper();
      MENU_ITEM_ID = "ddg-autofill-context-menu-item";
      REFETCH_ALIAS_ALARM = "refetchAlias";
      REFETCH_ALIAS_ATTEMPT = "refetchAliasAttempt";
      EmailAutofill = class {
        /**
         * @param {{
         *  settings: import('../settings.js');
         * }} options
         */
        constructor({ settings: settings14 }) {
          this.settings = settings14;
          this.contextMenuAvailable = !!import_webextension_polyfill6.default.contextMenus;
          if (this.contextMenuAvailable) {
            import_webextension_polyfill6.default.contextMenus.create(
              {
                id: MENU_ITEM_ID,
                title: "Generate Private Duck Address",
                contexts: ["editable"],
                documentUrlPatterns: ["https://*/*"],
                visible: false
              },
              () => {
                const { lastError } = import_webextension_polyfill6.default.runtime;
                if (lastError && lastError.message && !lastError.message.startsWith("Cannot create item with duplicate id")) {
                  throw lastError;
                }
              }
            );
            import_webextension_polyfill6.default.contextMenus.onClicked.addListener((info, tab) => {
              const userData = this.settings.getSetting("userData");
              if (tab?.id && userData.nextAlias) {
                import_webextension_polyfill6.default.tabs.sendMessage(tab.id, {
                  type: "contextualAutofill",
                  alias: userData.nextAlias
                });
              }
            });
          }
          import_webextension_polyfill6.default.alarms.onAlarm.addListener((alarmEvent) => {
            if (alarmEvent.name === REFETCH_ALIAS_ALARM) {
              this.fetchAlias();
            }
          });
          registerMessageHandler("getAddresses", this.getAddresses.bind(this));
          registerMessageHandler("sendJSPixel", this.sendJSPixel.bind(this));
          registerMessageHandler("getAlias", this.getAlias.bind(this));
          registerMessageHandler("refreshAlias", this.refreshAlias.bind(this));
          registerMessageHandler("getEmailProtectionCapabilities", getEmailProtectionCapabilities);
          registerMessageHandler("getIncontextSignupDismissedAt", this.getIncontextSignupDismissedAt.bind(this));
          registerMessageHandler("setIncontextSignupPermanentlyDismissedAt", this.setIncontextSignupPermanentlyDismissedAt.bind(this));
          registerMessageHandler("getUserData", this.getUserData.bind(this));
          registerMessageHandler("addUserData", this.addUserData.bind(this));
          registerMessageHandler("removeUserData", this.removeUserData.bind(this));
          registerMessageHandler("logout", this.logout.bind(this));
          this.ready = this.init();
        }
        async init() {
          await this.settings.ready();
          const userData = this.settings.getSetting("userData");
          if (userData && userData.token) {
            if (!userData.nextAlias) await this.fetchAlias();
            this.showContextMenuAction();
          }
        }
        async fetchAlias() {
          await this.settings.ready();
          import_webextension_polyfill6.default.alarms.clear(REFETCH_ALIAS_ALARM);
          const userData = this.settings.getSetting("userData");
          if (!userData?.token) return;
          return fetch("https://quack.duckduckgo.com/api/email/addresses", {
            method: "post",
            headers: { Authorization: `Bearer ${userData.token}` }
          }).then(async (response) => {
            if (response.ok) {
              return response.json().then(async ({ address }) => {
                if (!/^[a-z0-9-]+$/.test(address)) throw new Error("Invalid address");
                this.settings.updateSetting("userData", Object.assign(userData, { nextAlias: `${address}` }));
                await removeFromSessionStorage(REFETCH_ALIAS_ATTEMPT);
                return { success: true };
              });
            } else {
              throw new Error("An error occurred while fetching the alias");
            }
          }).catch(async (e) => {
            console.log("Error fetching new alias", e);
            const attempts = await getFromSessionStorage(REFETCH_ALIAS_ATTEMPT) || 1;
            if (attempts < 5) {
              createAlarm(REFETCH_ALIAS_ALARM, { delayInMinutes: 2 });
              await setToSessionStorage(REFETCH_ALIAS_ATTEMPT, attempts + 1);
            }
            return { error: e };
          });
        }
        async getAlias() {
          await this.settings.ready();
          const userData = this.settings.getSetting("userData");
          return { alias: userData?.nextAlias };
        }
        /**
         * @returns {Promise<import('@duckduckgo/privacy-dashboard/schema/__generated__/schema.types').RefreshAliasResponse>}
         */
        async refreshAlias() {
          await this.fetchAlias();
          return this.getAddresses();
        }
        getAddresses() {
          const userData = this.settings.getSetting("userData");
          return {
            personalAddress: userData?.userName,
            privateAddress: userData?.nextAlias
          };
        }
        showContextMenuAction() {
          if (this.contextMenuAvailable) {
            import_webextension_polyfill6.default.contextMenus.update(MENU_ITEM_ID, { visible: true });
          }
        }
        hideContextMenuAction() {
          if (this.contextMenuAvailable) {
            import_webextension_polyfill6.default.contextMenus.update(MENU_ITEM_ID, { visible: false });
          }
        }
        /**
         *
         * @param {FirePixelOptions}  options
         */
        sendJSPixel(options) {
          const { pixelName } = options;
          switch (pixelName) {
            case "autofill_show":
              this.fireAutofillPixel("email_tooltip_show");
              break;
            case "autofill_private_address":
              this.fireAutofillPixel("email_filled_random", true);
              break;
            case "autofill_personal_address":
              this.fireAutofillPixel("email_filled_main", true);
              break;
            case "incontext_show":
              sendPixelRequest("incontext_show");
              break;
            case "incontext_primary_cta":
              sendPixelRequest("incontext_primary_cta");
              break;
            case "incontext_dismiss_persisted":
              sendPixelRequest("incontext_dismiss_persisted");
              break;
            case "incontext_close_x":
              sendPixelRequest("incontext_close_x");
              break;
            default:
              getFromSessionStorage("dev").then((isDev) => {
                if (isDev) console.error("Unknown pixel name", pixelName);
              });
          }
        }
        fireAutofillPixel(pixel, shouldUpdateLastUsed = false) {
          const userData = this.settings.getSetting("userData");
          if (!userData?.userName) return;
          const lastAddressUsedAt = this.settings.getSetting("lastAddressUsedAt") ?? "";
          sendPixelRequest(pixel, { duck_address_last_used: lastAddressUsedAt, cohort: userData.cohort });
          if (shouldUpdateLastUsed) {
            this.settings.updateSetting("lastAddressUsedAt", currentDate());
          }
        }
        getIncontextSignupDismissedAt() {
          const permanentlyDismissedAt = this.settings.getSetting("incontextSignupPermanentlyDismissedAt");
          const installedDays = tds_default.config.features.incontextSignup?.settings?.installedDays ?? 3;
          const isInstalledRecently = isInstalledWithinDays(installedDays);
          return { success: { permanentlyDismissedAt, isInstalledRecently } };
        }
        setIncontextSignupPermanentlyDismissedAt({ value }) {
          this.settings.updateSetting("incontextSignupPermanentlyDismissedAt", value);
        }
        // Get user data to be used by the email web app settings page. This includes
        // username, last alias, and a token for generating additional aliases.
        async getUserData(_, sender) {
          if (!isExpectedSender(sender)) return;
          await this.settings.ready();
          const userData = this.settings.getSetting("userData");
          if (userData) {
            return userData;
          } else {
            return { error: "Something seems wrong with the user data" };
          }
        }
        async addUserData(userData, sender) {
          const { userName, token } = userData;
          if (!isExpectedSender(sender)) return;
          const sendDdgUserReady = async () => {
            const tabs = await import_webextension_polyfill6.default.tabs.query({});
            tabs.forEach((tab) => sendTabMessage(tab.id, { type: "ddgUserReady" }));
          };
          await this.settings.ready();
          const { existingToken } = this.settings.getSetting("userData") || {};
          if (existingToken === token) {
            sendDdgUserReady();
            return { success: true };
          }
          if (isValidUsername(userName) && isValidToken(token)) {
            this.settings.updateSetting("userData", userData);
            const response = await this.fetchAlias();
            if (response && "error" in response) {
              return { error: response.error.message };
            }
            sendDdgUserReady();
            this.showContextMenuAction();
            return { success: true };
          } else {
            return { error: "Something seems wrong with the user data" };
          }
        }
        async removeUserData(_, sender) {
          if (!isExpectedSender(sender)) return;
          await this.logout();
        }
        async logout() {
          this.settings.updateSetting("userData", {});
          this.settings.updateSetting("lastAddressUsedAt", "");
          const tabs = await import_webextension_polyfill6.default.tabs.query({});
          tabs.forEach((tab) => {
            sendTabMessage(tab.id, { type: "logout" });
          });
          this.hideContextMenuAction();
        }
      };
      formatAddress = (address) => address + "@duck.com";
      isValidUsername = (userName) => /^[a-z0-9_]+$/.test(userName);
      isValidToken = (token) => /^[a-z0-9]+$/.test(token);
    }
  });

  // shared/js/ui/templates/user-data.js
  var require_user_data3 = __commonJS({
    "shared/js/ui/templates/user-data.js"(exports2, module2) {
      "use strict";
      var bel2 = require_browser();
      var raw = require_raw_browser();
      var { formatAddress: formatAddress2 } = (init_email_autofill(), __toCommonJS(email_autofill_exports));
      var t2 = window.DDG.base.i18n.t;
      module2.exports = function() {
        return bel2`<section class="options-content__user-data divider-bottom">
        <h2 class="menu-title">${t2("options:emailProtection.title")}</h2>
        ${renderUserDataContent(this.model)}
    </section>`;
      };
      function renderUserDataContent(model) {
        return !model.userName ? bel2`<div>
                <p class="menu-paragraph">${t2("options:autofillDisabled.title")}</p>
                <p class="options-info">
                    <a href="https://duckduckgo.com/email/enable-autofill">${t2("shared:enable.title")}</a>
                </p>
            </div>` : bel2`<div>
                <p class="menu-paragraph">
                    ${raw(t2("options:autofillEnabled.title", { userName: formatAddress2(model.userName) }))}
                </p>
                <p class="options-info js-userdata-logout">
                    <a href="#">${t2("shared:disable.title")}</a>
                </p>
            </div>`;
      }
    }
  });

  // shared/js/ui/base/ui-wrapper.js
  var ui_wrapper_exports = {};
  __export(ui_wrapper_exports, {
    backgroundMessage: () => backgroundMessage,
    getExtensionURL: () => getExtensionURL2,
    openExtensionPage: () => openExtensionPage2,
    sendMessage: () => sendMessage
  });
  var import_webextension_polyfill7, sendMessage, backgroundMessage, getExtensionURL2, openExtensionPage2;
  var init_ui_wrapper = __esm({
    "shared/js/ui/base/ui-wrapper.js"() {
      "use strict";
      import_webextension_polyfill7 = __toESM(require_browser_polyfill());
      sendMessage = async (messageType, options) => {
        return await import_webextension_polyfill7.default.runtime.sendMessage({ messageType, options });
      };
      backgroundMessage = (thisModel) => {
        import_webextension_polyfill7.default.runtime.onMessage.addListener((req, sender) => {
          if (sender.id !== import_webextension_polyfill7.default.runtime.id) return;
          if (req.updateTabData) thisModel.send("updateTabData");
          if (req.didResetTrackersData) thisModel.send("didResetTrackersData", req.didResetTrackersData);
          if (req.closePopup) window.close();
        });
      };
      getExtensionURL2 = (path) => {
        return import_webextension_polyfill7.default.runtime.getURL(path);
      };
      openExtensionPage2 = (path) => {
        import_webextension_polyfill7.default.tabs.create({ url: getExtensionURL2(path) });
      };
    }
  });

  // shared/js/ui/models/background-message.js
  var require_background_message = __commonJS({
    "shared/js/ui/models/background-message.js"(exports2, module2) {
      "use strict";
      var Parent2 = window.DDG.base.Model;
      var browserUIWrapper2 = (init_ui_wrapper(), __toCommonJS(ui_wrapper_exports));
      function BackgroundMessage(attrs) {
        Parent2.call(this, attrs);
        const thisModel = this;
        browserUIWrapper2.backgroundMessage(thisModel);
      }
      BackgroundMessage.prototype = window.$.extend({}, Parent2.prototype, {
        modelName: "backgroundMessage"
      });
      module2.exports = BackgroundMessage;
    }
  });

  // shared/js/ui/views/internal-options.js
  var internal_options_exports = {};
  __export(internal_options_exports, {
    default: () => InternalOptionsView
  });
  function template() {
    if (this.model.isInternalUser) {
      const buttonState = this._buttonState();
      const buttonDisabled = buttonState.endsWith("disabled");
      const buttonText = buttonDisabled ? buttonState.slice(0, buttonState.length - 9) : buttonState;
      return import_nanohtml.default`<section class="options-content__allowlist divider-bottom">
            <h2 class="menu-title">Internal settings</h2>
            <ul class="default-list">
                <li>
                    <p class="menu-paragraph">
                        Internal-only settings for debugging the extension.
                    </p>
                </li>
                <li>
                    <p class="options-info">Custom config URL</p>
                    <input class="allowlist-url js-options-config-url" type="text" placeholder="Privacy Configuration URL" value="${this.model.debuggingSettings?.configURLOverride}" />
                    <button class="custom-config-button float-right js-options-set-config-url" ${buttonDisabled ? "disabled" : ""}>${buttonText}</button>
                </li>
            </ul>
        </section>`;
    }
    return import_nanohtml.default`<section class="options-content__allowlist"></section>`;
  }
  function InternalOptionsView(ops) {
    this.model = ops.model = new Model();
    this.template = ops.template = template;
    this.pageView = ops.pageView;
    ViewParent.call(this, ops);
    this.reload();
  }
  var import_nanohtml, ModelParent, ViewParent, Model;
  var init_internal_options = __esm({
    "shared/js/ui/views/internal-options.js"() {
      "use strict";
      import_nanohtml = __toESM(require_browser());
      ModelParent = window.DDG.base.Model;
      ViewParent = window.DDG.base.View;
      Model = class extends ModelParent {
        constructor() {
          super({
            modelName: "internalOptions"
          });
          this.isInternalUser = false;
        }
        async getState() {
          this.isInternalUser = await this.sendMessage("isInternalUser");
          this.debuggingSettings = await this.sendMessage("getDebuggingSettings");
        }
      };
      InternalOptionsView.prototype = window.$.extend({}, ViewParent.prototype, {
        setup: function() {
          this._cacheElems(".js-options", ["config-url", "set-config-url"]);
          this.bindEvents([
            [this.$setconfigurl, "click", this._clickSetting],
            [this.$configurl, "input", this._onURLChange]
          ]);
          this._onURLChange();
        },
        _buttonState: function() {
          const currentValue = this.model.debuggingSettings?.configURLOverride;
          const inputValue = this.$configurl?.val() || currentValue;
          let inputIsValidUrl = false;
          try {
            inputIsValidUrl = !!new URL(inputValue);
          } catch (e) {
          }
          if (!currentValue) {
            return inputIsValidUrl ? "Set" : "Set disabled";
          }
          if (!this.$configurl?.val()) {
            return "Clear";
          }
          if (inputValue === currentValue) {
            return "Reload now";
          }
          return inputIsValidUrl ? "Update" : "Update disabled";
        },
        _clickSetting: async function() {
          const buttonState = this._buttonState();
          const inputValue = this.$configurl?.val();
          if (buttonState === "Set" || buttonState === "Update") {
            await this.model.sendMessage("enableDebugging", {
              configURLOverride: inputValue,
              debuggerConnection: true
            });
          } else if (buttonState === "Clear") {
            await this.model.sendMessage("disableDebugging");
          } else if (buttonState === "Reload now") {
            await this.model.sendMessage("forceReloadConfig");
          }
          this.reload();
        },
        _onURLChange: function() {
          const buttonState = this._buttonState();
          const buttonText = buttonState.split(" ")[0];
          const buttonDisabled = buttonState.endsWith("disabled");
          this.$setconfigurl.attr("disabled", buttonDisabled);
          this.$setconfigurl.text(buttonText);
        },
        reload: function() {
          this.model.getState().then(() => {
            this.unbindEvents();
            this._rerender();
            this.setup();
          });
        }
      });
    }
  });

  // shared/js/ui/pages/options.js
  var Parent = window.DDG.base.Page;
  var mixins = require_mixins();
  var PrivacyOptionsView = require_privacy_options();
  var PrivacyOptionsModel = require_privacy_options2();
  var privacyOptionsTemplate = require_privacy_options3();
  var AllowlistView = require_allowlist();
  var AllowlistModel = require_allowlist2();
  var allowlistTemplate = require_allowlist3();
  var UserDataView = require_user_data();
  var UserDataModel = require_user_data2();
  var userDataTemplate = require_user_data3();
  var BackgroundMessageModel = require_background_message();
  var browserUIWrapper = (init_ui_wrapper(), __toCommonJS(ui_wrapper_exports));
  var InternalOptionsView2 = (init_internal_options(), __toCommonJS(internal_options_exports)).default;
  var t = window.DDG.base.i18n.t;
  function Options(ops) {
    Parent.call(this, ops);
  }
  Options.prototype = window.$.extend({}, Parent.prototype, mixins.setBrowserClassOnBodyTag, {
    pageName: "options",
    ready: function() {
      const $parent = window.$("#options-content");
      Parent.prototype.ready.call(this);
      this.setBrowserClassOnBodyTag();
      window.$(".js-feedback-link").click(this._onFeedbackClick.bind(this));
      window.$(".js-report-site-link").click(this._onReportSiteClick.bind(this));
      const textContainers = document.querySelectorAll("[data-text]");
      textContainers.forEach((el) => {
        const textID = el.getAttribute("data-text");
        const text = t(textID);
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
      this.views.internal = new InternalOptionsView2({
        pageView: this,
        appendTo: $parent
      });
      this.views.allowlist = new AllowlistView({
        pageView: this,
        model: new AllowlistModel({}),
        appendTo: $parent,
        template: allowlistTemplate
      });
      this.message = new BackgroundMessageModel({});
    },
    _onFeedbackClick: function(e) {
      e.preventDefault();
      browserUIWrapper.openExtensionPage("/html/feedback.html");
    },
    _onReportSiteClick: function(e) {
      e.preventDefault();
      browserUIWrapper.openExtensionPage("/html/feedback.html?broken=1");
    }
  });
  window.DDG = window.DDG || {};
  window.DDG.page = new Options();
})();
/*
 * [js-sha1]{@link https://github.com/emn178/js-sha1}
 *
 * @version 0.6.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
