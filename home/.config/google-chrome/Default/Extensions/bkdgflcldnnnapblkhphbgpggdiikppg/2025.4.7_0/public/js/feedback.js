"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // shared/js/ui/pages/mixins/set-browser-class.js
  var require_set_browser_class = __commonJS({
    "shared/js/ui/pages/mixins/set-browser-class.js"(exports, module) {
      "use strict";
      module.exports = {
        setBrowserClassOnBodyTag: function() {
          window.chrome.runtime.sendMessage({ messageType: "getBrowser" }, (browserName) => {
            if (["edg", "edge", "brave"].includes(browserName)) {
              browserName = "chrome";
            }
            const browserClass = "is-browser--" + browserName;
            window.$("html").addClass(browserClass);
            window.$("body").addClass(browserClass);
          });
        }
      };
    }
  });

  // shared/js/ui/pages/mixins/parse-query-string.js
  var require_parse_query_string = __commonJS({
    "shared/js/ui/pages/mixins/parse-query-string.js"(exports, module) {
      "use strict";
      module.exports = {
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
    "shared/js/ui/pages/mixins/index.js"(exports, module) {
      "use strict";
      module.exports = {
        setBrowserClassOnBodyTag: require_set_browser_class(),
        parseQueryString: require_parse_query_string()
      };
    }
  });

  // shared/js/shared-utils/parse-user-agent-string.js
  var require_parse_user_agent_string = __commonJS({
    "shared/js/shared-utils/parse-user-agent-string.js"(exports, module) {
      "use strict";
      module.exports = (uaString) => {
        if (!globalThis.navigator) return {};
        if (!uaString) uaString = globalThis.navigator.userAgent;
        let browser;
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
          browser = parsedUaParts[1];
          version = parsedUaParts[2];
          if (globalThis.navigator.brave) {
            browser = "Brave";
          }
        } catch (e) {
          browser = version = "";
        }
        let os = "o";
        if (globalThis.navigator.userAgent.indexOf("Windows") !== -1) os = "w";
        if (globalThis.navigator.userAgent.indexOf("Mac") !== -1) os = "m";
        if (globalThis.navigator.userAgent.indexOf("Linux") !== -1) os = "l";
        return {
          os,
          browser,
          version
        };
      };
    }
  });

  // node_modules/hyperscript-attribute-to-property/index.js
  var require_hyperscript_attribute_to_property = __commonJS({
    "node_modules/hyperscript-attribute-to-property/index.js"(exports, module) {
      module.exports = attributeToProperty;
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
    "node_modules/hyperx/index.js"(exports, module) {
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
      module.exports = function(h, opts) {
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
              var p = parse(strings[i]);
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
            } else parts.push.apply(parts, parse(strings[i]));
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
          function parse(str) {
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
    "node_modules/nanohtml/lib/append-child.js"(exports, module) {
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
      module.exports = function appendChild(el, childs) {
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
    "node_modules/nanohtml/lib/svg-tags.js"(exports, module) {
      "use strict";
      module.exports = [
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
    "node_modules/nanohtml/lib/bool-props.js"(exports, module) {
      "use strict";
      module.exports = [
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
    "node_modules/nanohtml/lib/direct-props.js"(exports, module) {
      "use strict";
      module.exports = [
        "indeterminate"
      ];
    }
  });

  // node_modules/nanohtml/lib/dom.js
  var require_dom = __commonJS({
    "node_modules/nanohtml/lib/dom.js"(exports, module) {
      "use strict";
      var hyperx = require_hyperx();
      var appendChild = require_append_child();
      var SVG_TAGS = require_svg_tags();
      var BOOL_PROPS = require_bool_props();
      var DIRECT_PROPS = require_direct_props();
      var SVGNS = "http://www.w3.org/2000/svg";
      var XLINKNS = "http://www.w3.org/1999/xlink";
      var COMMENT_TAG = "!--";
      module.exports = function(document2) {
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
        var exports2 = hyperx(nanoHtmlCreateElement, {
          comments: true,
          createFragment
        });
        exports2.default = exports2;
        exports2.createComment = nanoHtmlCreateElement;
        return exports2;
      };
    }
  });

  // node_modules/nanohtml/lib/browser.js
  var require_browser = __commonJS({
    "node_modules/nanohtml/lib/browser.js"(exports, module) {
      module.exports = require_dom()(document);
    }
  });

  // shared/js/ui/templates/feedback-form.js
  var require_feedback_form = __commonJS({
    "shared/js/ui/templates/feedback-form.js"(exports, module) {
      "use strict";
      var bel = require_browser();
      var t = window.DDG.base.i18n.t;
      module.exports = function() {
        let fields;
        if (this.model.submitted || this.model.errored) {
          return showThankYou(this.model.isBrokenSite);
        }
        if (this.model.isBrokenSite) {
          fields = bel`<div>
            <label class='frm__label'>${t("feedback:brokenSiteLabel.title")}</label>
            <input class='js-feedback-url frm__input' type='text' placeholder='${t("feedback:brokenSitePlaceholder.title")}' value='${this.model.url}'/>
            <label class='frm__label'>${t("feedback:describeTheIssue.title")}</label>
            <textarea class='frm__text js-feedback-message' required placeholder='${t("feedback:describeBreakagePlaceholder.title")}'></textarea>
        </div>`;
        } else {
          fields = bel`<div>
            <label class='frm__label'>${t("feedback:feedbackHeaderLabel.title")}</label>
            <textarea class='frm__text js-feedback-message' placeholder='${t("feedback:feedbackPlaceholder.title")}'></textarea>
        </div>`;
        }
        return bel`<form class='frm'>
        <p>${t("feedback:submittingFeedbackHelps.title")}</p>
        <label class='frm__label'>
            <input type='checkbox' class='js-feedback-broken-site frm__label__chk'
                ${this.model.isBrokenSite ? "checked" : ""}/>
            ${t("feedback:reportBrokenSite.title")}
        </label>
        ${fields}
        <input class='btn js-feedback-submit ${this.model.canSubmit ? "" : "is-disabled"}'
            type='submit' value='${t("feedback:submit.title")}' ${this.model.canSubmit ? "" : "disabled"}/>
    </form>`;
      };
      function showThankYou(isBrokenSite) {
        if (isBrokenSite) {
          return bel`<div>
            <p>${t("feedback:thankYou.title")}</p>
            <p>${t("feedback:thankYouBrokenSite.title")}</p>
        </div>`;
        } else {
          return bel`<p>${t("feedback:thankYou.title")}</p>`;
        }
      }
    }
  });

  // shared/js/ui/views/feedback-form.js
  var require_feedback_form2 = __commonJS({
    "shared/js/ui/views/feedback-form.js"(exports, module) {
      "use strict";
      var Parent2 = window.DDG.base.View;
      var feedbackFormTemplate = require_feedback_form();
      function FeedbackForm(ops) {
        this.model = ops.model;
        this.template = feedbackFormTemplate;
        Parent2.call(this, ops);
        this._setup();
      }
      FeedbackForm.prototype = window.$.extend({}, Parent2.prototype, {
        _setup: function() {
          this._cacheElems(".js-feedback", ["url", "message", "broken-site", "submit"]);
          this.bindEvents([
            [this.store.subscribe, "change:feedbackForm", this._onModelChange],
            [this.$url, "input", this._onUrlChange],
            [this.$message, "input", this._onMessageChange],
            [this.$brokensite, "change", this._onBrokenSiteChange],
            [this.$submit, "click", this._onSubmitClick]
          ]);
        },
        _onModelChange: function(e) {
          if (e.change.attribute === "isBrokenSite" || e.change.attribute === "submitted" || e.change.attribute === "errored") {
            this.unbindEvents();
            this._rerender();
            this._setup();
          } else if (e.change.attribute === "canSubmit") {
            this.$submit.toggleClass("is-disabled", !this.model.canSubmit);
            this.$submit.attr("disabled", !this.model.canSubmit);
          }
        },
        _onBrokenSiteChange: function(e) {
          this.model.toggleBrokenSite(e.target.checked);
        },
        _onUrlChange: function() {
          this.model.set("url", this.$url.val());
          this.model.updateCanSubmit();
        },
        _onMessageChange: function() {
          this.model.set("message", this.$message.val());
          this.model.updateCanSubmit();
        },
        _onSubmitClick: function(e) {
          e.preventDefault();
          if (!this.model.canSubmit) {
            return;
          }
          this.model.submit();
          this.$submit.addClass("is-disabled");
        }
      });
      module.exports = FeedbackForm;
    }
  });

  // shared/data/constants.js
  var require_constants = __commonJS({
    "shared/data/constants.js"(exports, module) {
      "use strict";
      var parseUserAgentString2 = require_parse_user_agent_string();
      var browserInfo = parseUserAgentString2();
      var trackerBlockingEndpointBase = "https://staticcdn.duckduckgo.com/trackerblocking";
      function isMV3() {
        if (typeof chrome !== "undefined") {
          return chrome?.runtime.getManifest().manifest_version === 3;
        }
        return false;
      }
      function getConfigFileName() {
        let browserName = browserInfo?.browser?.toLowerCase() || "";
        if (!["chrome", "firefox", "brave", "edg"].includes(browserName)) {
          browserName = "";
        } else {
          browserName = "-" + browserName + (isMV3() ? "mv3" : "");
        }
        return `${trackerBlockingEndpointBase}/config/v4/extension${browserName}-config.json`;
      }
      function getTDSEndpoint(version) {
        const thisPlatform = `extension${isMV3() ? "-mv3" : ""}`;
        return `${trackerBlockingEndpointBase}/${version}/${thisPlatform}-tds.json`;
      }
      module.exports = {
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

  // shared/js/ui/models/feedback-form.js
  var require_feedback_form3 = __commonJS({
    "shared/js/ui/models/feedback-form.js"(exports, module) {
      "use strict";
      var Parent2 = window.DDG.base.Model;
      var constants = require_constants();
      function FeedbackForm(attrs) {
        attrs = attrs || {};
        attrs.isBrokenSite = attrs.isBrokenSite || false;
        attrs.url = attrs.url || "";
        attrs.message = attrs.message || "";
        attrs.canSubmit = false;
        attrs.submitted = false;
        attrs.browser = attrs.browser || "";
        attrs.browserVersion = attrs.browserVersion || "";
        Parent2.call(this, attrs);
        this.updateCanSubmit();
        this.sendMessage("getSetting", { name: "atb" }).then((atb) => {
          this.atb = atb;
        });
        this.sendMessage("getExtensionVersion").then((extensionVersion) => {
          this.extensionVersion = extensionVersion;
        });
        this.sendMessage("getSetting", { name: "tds-etag" }).then((etag) => {
          this.tds = etag;
        });
      }
      FeedbackForm.prototype = window.$.extend({}, Parent2.prototype, {
        modelName: "feedbackForm",
        submit: function() {
          if (!this.canSubmit || this._submitting) {
            return;
          }
          this._submitting = true;
          window.$.ajax(constants.feedbackUrl, {
            method: "POST",
            data: {
              reason: this.isBrokenSite ? "broken_site" : "general",
              url: this.url || "",
              comment: this.message || "",
              browser: this.browser || "",
              browser_version: this.browserVersion || "",
              v: this.extensionVersion || "",
              atb: this.atb || "",
              tds: this.tsd || ""
            },
            success: (data) => {
              if (data && data.status === "success") {
                this.set("submitted", true);
              } else {
                this.set("errored", true);
              }
            },
            error: () => {
              this.set("errored", true);
            }
          });
        },
        toggleBrokenSite: function(val) {
          this.set("isBrokenSite", val);
          this.updateCanSubmit();
          this.reset();
        },
        updateCanSubmit: function() {
          if (this.isBrokenSite) {
            this.set("canSubmit", !!(this.url && this.message));
          } else {
            this.set("canSubmit", !!this.message);
          }
        },
        reset: function() {
          this.set("url", "");
          this.set("message", "");
          this.set("canSubmit", false);
        }
      });
      module.exports = FeedbackForm;
    }
  });

  // shared/js/ui/pages/feedback.js
  var Parent = window.DDG.base.Page;
  var mixins = require_mixins();
  var parseUserAgentString = require_parse_user_agent_string();
  var FeedbackFormView = require_feedback_form2();
  var FeedbackFormModel = require_feedback_form3();
  function Feedback(ops) {
    Parent.call(this, ops);
  }
  Feedback.prototype = window.$.extend({}, Parent.prototype, mixins.setBrowserClassOnBodyTag, mixins.parseQueryString, {
    pageName: "feedback",
    ready: function() {
      Parent.prototype.ready.call(this);
      this.setBrowserClassOnBodyTag();
      const params = this.parseQueryString(window.location.search);
      const browserInfo = parseUserAgentString();
      this.form = new FeedbackFormView({
        appendTo: window.$(".js-feedback-form"),
        model: new FeedbackFormModel({
          isBrokenSite: params.broken,
          url: decodeURIComponent(params.url || ""),
          browser: browserInfo.browser,
          browserVersion: browserInfo.version
        })
      });
    }
  });
  window.DDG = window.DDG || {};
  window.DDG.page = new Feedback();
})();
