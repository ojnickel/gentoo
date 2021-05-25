(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var document = require('global/document')
var hyperx = require('hyperx')
var onload = require('on-load')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var BOOL_PROPS = {
  autofocus: 1,
  checked: 1,
  defaultchecked: 1,
  disabled: 1,
  formnovalidate: 1,
  indeterminate: 1,
  readonly: 1,
  required: 1,
  selected: 1,
  willvalidate: 1
}
var COMMENT_TAG = '!--'
var SVG_TAGS = [
  'svg',
  'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
  'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB',
  'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode',
  'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting',
  'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face',
  'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri',
  'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line',
  'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath',
  'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
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

  // If adding onload events
  if (props.onload || props.onunload) {
    var load = props.onload || function () {}
    var unload = props.onunload || function () {}
    onload(el, function belOnload () {
      load(el)
    }, function belOnunload () {
      unload(el)
    },
    // We have to use non-standard `caller` to find who invokes `belCreateElement`
    belCreateElement.caller.caller.caller)
    delete props.onload
    delete props.onunload
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
      if (BOOL_PROPS[key]) {
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

  function appendChild (childs) {
    if (!Array.isArray(childs)) return
    for (var i = 0; i < childs.length; i++) {
      var node = childs[i]
      if (Array.isArray(node)) {
        appendChild(node)
        continue
      }

      if (typeof node === 'number' ||
        typeof node === 'boolean' ||
        typeof node === 'function' ||
        node instanceof Date ||
        node instanceof RegExp) {
        node = node.toString()
      }

      if (typeof node === 'string') {
        if (el.lastChild && el.lastChild.nodeName === '#text') {
          el.lastChild.nodeValue += node
          continue
        }
        node = document.createTextNode(node)
      }

      if (node && node.nodeType) {
        el.appendChild(node)
      }
    }
  }
  appendChild(children)

  return el
}

module.exports = hyperx(belCreateElement, {comments: true})
module.exports.default = module.exports
module.exports.createElement = belCreateElement

},{"global/document":3,"hyperx":6,"on-load":8}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
(function (global){(function (){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":2}],4:[function(require,module,exports){
(function (global){(function (){
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
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
assert.notEqual = notEqual
assert.notOk = notOk
assert.equal = equal
assert.ok = assert

module.exports = assert

function equal (a, b, m) {
  assert(a == b, m) // eslint-disable-line eqeqeq
}

function notEqual (a, b, m) {
  assert(a != b, m) // eslint-disable-line eqeqeq
}

function notOk (t, m) {
  assert(!t, m)
}

function assert (t, m) {
  if (!t) throw new Error(m || 'AssertionError')
}

},{}],8:[function(require,module,exports){
/* global MutationObserver */
var document = require('global/document')
var window = require('global/window')
var assert = require('assert')
var watch = Object.create(null)
var KEY_ID = 'onloadid' + (new Date() % 9e6).toString(36)
var KEY_ATTR = 'data-' + KEY_ID
var INDEX = 0

if (window && window.MutationObserver) {
  var observer = new MutationObserver(function (mutations) {
    if (Object.keys(watch).length < 1) return
    for (var i = 0; i < mutations.length; i++) {
      if (mutations[i].attributeName === KEY_ATTR) {
        eachAttr(mutations[i], turnon, turnoff)
        continue
      }
      eachMutation(mutations[i].removedNodes, turnoff)
      eachMutation(mutations[i].addedNodes, turnon)
    }
  })
  if (document.body) {
    beginObserve(observer)
  } else {
    document.addEventListener('DOMContentLoaded', function (event) {
      beginObserve(observer)
    })
  }
}

function beginObserve (observer) {
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: [KEY_ATTR]
  })
}

module.exports = function onload (el, on, off, caller) {
  assert(document.body, 'on-load: will not work prior to DOMContentLoaded')
  on = on || function () {}
  off = off || function () {}
  el.setAttribute(KEY_ATTR, 'o' + INDEX)
  watch['o' + INDEX] = [on, off, 0, caller || onload.caller]
  INDEX += 1
  return el
}

module.exports.KEY_ATTR = KEY_ATTR
module.exports.KEY_ID = KEY_ID

function turnon (index, el) {
  if (watch[index][0] && watch[index][2] === 0) {
    watch[index][0](el)
    watch[index][2] = 1
  }
}

function turnoff (index, el) {
  if (watch[index][1] && watch[index][2] === 1) {
    watch[index][1](el)
    watch[index][2] = 0
  }
}

function eachAttr (mutation, on, off) {
  var newValue = mutation.target.getAttribute(KEY_ATTR)
  if (sameOrigin(mutation.oldValue, newValue)) {
    watch[newValue] = watch[mutation.oldValue]
    return
  }
  if (watch[mutation.oldValue]) {
    off(mutation.oldValue, mutation.target)
  }
  if (watch[newValue]) {
    on(newValue, mutation.target)
  }
}

function sameOrigin (oldValue, newValue) {
  if (!oldValue || !newValue) return false
  return watch[oldValue][3] === watch[newValue][3]
}

function eachMutation (nodes, fn) {
  var keys = Object.keys(watch)
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] && nodes[i].getAttribute && nodes[i].getAttribute(KEY_ATTR)) {
      var onloadid = nodes[i].getAttribute(KEY_ATTR)
      keys.forEach(function (k) {
        if (onloadid === k) {
          fn(k, nodes[i])
        }
      })
    }
    if (nodes[i].childNodes.length > 0) {
      eachMutation(nodes[i].childNodes, fn)
    }
  }
}

},{"assert":7,"global/document":3,"global/window":4}],9:[function(require,module,exports){
"use strict";

module.exports = {
  "entityList": "https://duckduckgo.com/contentblocking.js?l=entitylist2",
  "entityMap": "data/tracker_lists/entityMap.json",
  "displayCategories": ["Analytics", "Advertising", "Social Network"],
  "requestListenerTypes": ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"],
  "feedbackUrl": "https://duckduckgo.com/feedback.js?type=extension-feedback",
  "tosdrMessages": {
    "A": "Good",
    "B": "Mixed",
    "C": "Poor",
    "D": "Poor",
    "E": "Poor",
    "good": "Good",
    "bad": "Poor",
    "unknown": "Unknown",
    "mixed": "Mixed"
  },
  "httpsService": "https://duckduckgo.com/smarter_encryption.js",
  "duckDuckGoSerpHostname": "duckduckgo.com",
  "httpsMessages": {
    "secure": "Encrypted Connection",
    "upgraded": "Forced Encryption",
    "none": "Unencrypted Connection"
  },

  /**
   * Major tracking networks data:
   * percent of the top 1 million sites a tracking network has been seen on.
   * see: https://webtransparency.cs.princeton.edu/webcensus/
   */
  "majorTrackingNetworks": {
    "google": 84,
    "facebook": 36,
    "twitter": 16,
    "amazon": 14,
    "appnexus": 10,
    "oracle": 10,
    "mediamath": 9,
    "oath": 9,
    "maxcdn": 7,
    "automattic": 7
  },

  /*
   * Mapping entity names to CSS class name for popup icons
   */
  "entityIconMapping": {
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
  "httpsDBName": "https",
  "httpsLists": [{
    "type": "upgrade bloom filter",
    "name": "httpsUpgradeBloomFilter",
    "url": "https://staticcdn.duckduckgo.com/https/https-bloom.json"
  }, {
    "type": "don\'t upgrade bloom filter",
    "name": "httpsDontUpgradeBloomFilters",
    "url": "https://staticcdn.duckduckgo.com/https/negative-https-bloom.json"
  }, {
    "type": "upgrade safelist",
    "name": "httpsUpgradeList",
    "url": "https://staticcdn.duckduckgo.com/https/negative-https-whitelist.json"
  }, {
    "type": "don\'t upgrade safelist",
    "name": "httpsDontUpgradeList",
    "url": "https://staticcdn.duckduckgo.com/https/https-whitelist.json"
  }],
  "tdsLists": [{
    "name": "surrogates",
    "url": "/data/surrogates.txt",
    "format": "text",
    "source": "local"
  }, {
    "name": "tds",
    "url": "https://staticcdn.duckduckgo.com/trackerblocking/v2.1/tds.json",
    "format": "json",
    "source": "external"
  }, {
    "name": "brokenSiteList",
    "url": "https://duckduckgo.com/contentblocking/trackers-unprotected-temporary.txt",
    "format": "text",
    "source": "external"
  }, {
    "name": "protections",
    "url": "https://duckduckgo.com/contentblocking/protections.json",
    "format": "json",
    "source": "external"
  }, {
    "name": "ReferrerExcludeList",
    "url": "https://staticcdn.duckduckgo.com/useragents/referrer_excludes.json",
    "format": "json",
    "source": "external"
  }, {
    "name": "ClickToLoadConfig",
    "url": "https://staticcdn.duckduckgo.com/useragents/social_ctp_configuration.json",
    "format": "json",
    "source": "external"
  }],
  "UserAgentLists": [{
    "name": "agents",
    "url": "https://staticcdn.duckduckgo.com/useragents/random_useragent.json",
    "format": "json",
    "source": "external"
  }, {
    "name": "excludeList",
    "url": "https://staticcdn.duckduckgo.com/useragents/useragent_excludes.json",
    "format": "json",
    "source": "external"
  }],
  "CookieLists": [{
    "name": "cookieExcludeList",
    "url": "https://staticcdn.duckduckgo.com/useragents/cookie_configuration.json",
    "format": "json",
    "source": "external"
  }],
  "httpsErrorCodes": {
    "net::ERR_CONNECTION_REFUSED": 1,
    "net::ERR_ABORTED": 2,
    "net::ERR_SSL_PROTOCOL_ERROR": 3,
    "net::ERR_SSL_VERSION_OR_CIPHER_MISMATCH": 4,
    "net::ERR_NAME_NOT_RESOLVED": 5,
    "NS_ERROR_CONNECTION_REFUSED": 6,
    "NS_ERROR_UNKNOWN_HOST": 7,
    "An additional policy constraint failed when validating this certificate.": 8,
    "Unable to communicate securely with peer: requested domain name does not match the server’s certificate.": 9,
    "Cannot communicate securely with peer: no common encryption algorithm(s).": 10,
    "SSL received a record that exceeded the maximum permissible length.": 11,
    "The certificate is not trusted because it is self-signed.": 12,
    "downgrade_redirect_loop": 13
  }
};

},{}],10:[function(require,module,exports){
"use strict";

module.exports = {
  "extensionIsEnabled": true,
  "socialBlockingIsEnabled": false,
  "trackerBlockingEnabled": true,
  "httpsEverywhereEnabled": true,
  "embeddedTweetsEnabled": false,
  "GPC": true,
  "meanings": true,
  "advanced_options": true,
  "last_search": "",
  "lastsearch_enabled": true,
  "safesearch": true,
  "use_post": false,
  "ducky": false,
  "dev": false,
  "zeroclick_google_right": false,
  "version": null,
  "atb": null,
  "set_atb": null,
  "trackersWhitelistTemporary-etag": null,
  "trackersWhitelist-etag": null,
  "surrogateList-etag": null,
  "httpsUpgradeBloomFilter-etag": null,
  "httpsDontUpgradeBloomFilters-etag": null,
  "httpsUpgradeList-etag": null,
  "httpsDontUpgradeList-etag": null,
  "hasSeenPostInstall": false,
  "extiSent": false,
  "failedUpgrades": 0,
  "totalUpgrades": 0,
  "tds-etag": null,
  "surrogates-etag": null,
  "brokenSiteList-etag": null,
  "lastTdsUpdate": 0
};

},{}],11:[function(require,module,exports){
"use strict";

var getExtensionURL = function getExtensionURL(path) {
  return chrome.extension.getURL(path);
};

var getExtensionVersion = function getExtensionVersion() {
  var manifest = window.chrome && chrome.runtime.getManifest();
  return manifest.version;
};

var setBadgeIcon = function setBadgeIcon(badgeData) {
  chrome.browserAction.setIcon(badgeData);
};

var syncToStorage = function syncToStorage(data) {
  chrome.storage.local.set(data, function () {});
};

var getFromStorage = function getFromStorage(key, cb) {
  chrome.storage.local.get(key, function (result) {
    cb(result[key]);
  });
};

var getExtensionId = function getExtensionId() {
  return chrome.runtime.id;
};

var notifyPopup = function notifyPopup(message) {
  // this can send an error message when the popup is not open. check lastError to hide it
  chrome.runtime.sendMessage(message, function () {
    return chrome.runtime.lastError;
  });
};

var normalizeTabData = function normalizeTabData(tabData) {
  return tabData;
};

var mergeSavedSettings = function mergeSavedSettings(settings, results) {
  return Object.assign(settings, results);
};

var getDDGTabUrls = function getDDGTabUrls() {
  return new Promise(function (resolve) {
    chrome.tabs.query({
      url: 'https://*.duckduckgo.com/*'
    }, function (tabs) {
      tabs = tabs || [];
      tabs.forEach(function (tab) {
        chrome.tabs.insertCSS(tab.id, {
          file: '/public/css/noatb.css'
        });
      });
      resolve(tabs.map(function (tab) {
        return tab.url;
      }));
    });
  });
};

var setUninstallURL = function setUninstallURL(url) {
  chrome.runtime.setUninstallURL(url);
};

var changeTabURL = function changeTabURL(tabId, url) {
  return new Promise(function (resolve) {
    chrome.tabs.update(tabId, {
      url: url
    }, resolve);
  });
};

module.exports = {
  getExtensionURL: getExtensionURL,
  getExtensionVersion: getExtensionVersion,
  setBadgeIcon: setBadgeIcon,
  syncToStorage: syncToStorage,
  getFromStorage: getFromStorage,
  notifyPopup: notifyPopup,
  normalizeTabData: normalizeTabData,
  mergeSavedSettings: mergeSavedSettings,
  getDDGTabUrls: getDDGTabUrls,
  setUninstallURL: setUninstallURL,
  getExtensionId: getExtensionId,
  changeTabURL: changeTabURL
};

},{}],12:[function(require,module,exports){
"use strict";

var _require = require('./settings.es6'),
    getSetting = _require.getSetting,
    updateSetting = _require.updateSetting;

var REFETCH_ALIAS_ALARM = 'refetchAlias'; // Keep track of the number of attempted fetches. Stop trying after 5.

var attempts = 1;

var fetchAlias = function fetchAlias() {
  // if another fetch was previously scheduled, clear that and execute now
  chrome.alarms.get(REFETCH_ALIAS_ALARM, function () {
    return chrome.alarms.clear(REFETCH_ALIAS_ALARM);
  });
  var userData = getSetting('userData');
  if (!userData.token) return;
  return fetch('https://quack.duckduckgo.com/api/email/addresses', {
    method: 'post',
    headers: {
      Authorization: "Bearer ".concat(userData.token)
    }
  }).then(function (response) {
    if (response.ok) {
      return response.json().then(function (_ref) {
        var address = _ref.address;
        if (!/^[a-z0-9]+$/.test(address)) throw new Error('Invalid address');
        updateSetting('userData', Object.assign(userData, {
          nextAlias: "".concat(address)
        })); // Reset attempts

        attempts = 1;
        return {
          success: true
        };
      });
    } else {
      throw new Error('An error occurred while fetching the alias');
    }
  })["catch"](function (e) {
    // TODO: Do we want to logout if the error is a 401 unauthorized?
    console.log('Error fetching new alias', e); // Don't try fetching more than 5 times in a row

    if (attempts < 5) {
      chrome.alarms.create(REFETCH_ALIAS_ALARM, {
        delayInMinutes: 2
      });
      attempts++;
    } // Return the error so we can handle it


    return {
      error: e
    };
  });
};

var MENU_ITEM_ID = 'ddg-autofill-context-menu-item'; // Create the contextual menu hidden by default

chrome.contextMenus.create({
  id: MENU_ITEM_ID,
  title: 'Use Duck Address',
  contexts: ['editable'],
  visible: false,
  onclick: function onclick(info, tab) {
    var userData = getSetting('userData');

    if (userData.nextAlias) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'contextualAutofill',
        alias: userData.nextAlias
      });
    }
  }
});

var showContextMenuAction = function showContextMenuAction() {
  return chrome.contextMenus.update(MENU_ITEM_ID, {
    visible: true
  });
};

var hideContextMenuAction = function hideContextMenuAction() {
  return chrome.contextMenus.update(MENU_ITEM_ID, {
    visible: false
  });
};

var getAddresses = function getAddresses() {
  var userData = getSetting('userData');
  return {
    personalAddress: userData === null || userData === void 0 ? void 0 : userData.userName,
    privateAddress: userData === null || userData === void 0 ? void 0 : userData.nextAlias
  };
};
/**
 * Given a username, returns a valid email address with the duck domain
 * @param {string} address
 * @returns {string}
 */


var formatAddress = function formatAddress(address) {
  return address + '@duck.com';
};
/**
 * Checks formal username validity
 * @param {string} userName
 * @returns {boolean}
 */


var isValidUsername = function isValidUsername(userName) {
  return /^[a-z0-9_]+$/.test(userName);
};
/**
 * Checks formal token validity
 * @param {string} token
 * @returns {boolean}
 */


var isValidToken = function isValidToken(token) {
  return /^[a-z0-9]+$/.test(token);
};

module.exports = {
  REFETCH_ALIAS_ALARM: REFETCH_ALIAS_ALARM,
  fetchAlias: fetchAlias,
  showContextMenuAction: showContextMenuAction,
  hideContextMenuAction: hideContextMenuAction,
  getAddresses: getAddresses,
  formatAddress: formatAddress,
  isValidUsername: isValidUsername,
  isValidToken: isValidToken
};

},{"./settings.es6":13}],13:[function(require,module,exports){
"use strict";

var defaultSettings = require('../../data/defaultSettings');

var browserWrapper = require('./chrome-wrapper.es6');
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
  return new Promise(function (resolve, reject) {
    buildSettingsFromDefaults();
    buildSettingsFromLocalStorage().then(function () {
      resolve();
    });
  });
}

function ready() {
  return _ready;
}

function buildSettingsFromLocalStorage() {
  return new Promise(function (resolve) {
    browserWrapper.getFromStorage(['settings'], function (results) {
      // copy over saved settings from storage
      if (!results) resolve();
      settings = browserWrapper.mergeSavedSettings(settings, results);
      resolve();
    });
  });
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
  } // let all and null return all settings


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
  browserWrapper.getFromStorage(['settings'], function (s) {
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

},{"../../data/defaultSettings":10,"./chrome-wrapper.es6":11}],14:[function(require,module,exports){
"use strict";

var fetch = function fetch(message) {
  return new Promise(function (resolve, reject) {
    window.chrome.runtime.sendMessage(message, function (result) {
      return resolve(result);
    });
  });
};

var backgroundMessage = function backgroundMessage(thisModel) {
  // listen for messages from background and
  // // notify subscribers
  window.chrome.runtime.onMessage.addListener(function (req, sender) {
    if (sender.id !== chrome.runtime.id) return;
    if (req.whitelistChanged) thisModel.send('whitelistChanged');
    if (req.updateTabData) thisModel.send('updateTabData');
    if (req.didResetTrackersData) thisModel.send('didResetTrackersData', req.didResetTrackersData);
    if (req.closePopup) window.close();
  });
};

var getBackgroundTabData = function getBackgroundTabData() {
  return new Promise(function (resolve, reject) {
    fetch({
      getCurrentTab: true
    }).then(function (tab) {
      if (tab) {
        fetch({
          getTab: tab.id
        }).then(function (backgroundTabObj) {
          resolve(backgroundTabObj);
        });
      }
    });
  });
};

var search = function search(url) {
  window.chrome.tabs.create({
    url: "https://duckduckgo.com/?q=".concat(url, "&bext=").concat(window.localStorage.os, "cr")
  });
};

var getExtensionURL = function getExtensionURL(path) {
  return chrome.extension.getURL(path);
};

var openExtensionPage = function openExtensionPage(path) {
  window.chrome.tabs.create({
    url: getExtensionURL(path)
  });
};

var openOptionsPage = function openOptionsPage(browser) {
  if (browser === 'moz') {
    openExtensionPage('/html/options.html');
    window.close();
  } else {
    window.chrome.runtime.openOptionsPage();
  }
};

var reloadTab = function reloadTab(id) {
  window.chrome.tabs.reload(id);
};

var closePopup = function closePopup() {
  var w = window.chrome.extension.getViews({
    type: 'popup'
  })[0];
  w.close();
};

module.exports = {
  fetch: fetch,
  reloadTab: reloadTab,
  closePopup: closePopup,
  backgroundMessage: backgroundMessage,
  getBackgroundTabData: getBackgroundTabData,
  search: search,
  openOptionsPage: openOptionsPage,
  openExtensionPage: openExtensionPage,
  getExtensionURL: getExtensionURL
};

},{}],15:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.Model;

function Autocomplete(attrs) {
  Parent.call(this, attrs);
}

Autocomplete.prototype = window.$.extend({}, Parent.prototype, {
  modelName: 'autocomplete',
  fetchSuggestions: function fetchSuggestions(searchText) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      // TODO: ajax call here to ddg autocomplete service
      // for now we'll just mock up an async xhr query result:
      _this.suggestions = ["".concat(searchText, " world"), "".concat(searchText, " united"), "".concat(searchText, " famfam")];
      resolve();
    });
  }
});
module.exports = Autocomplete;

},{}],16:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.Model;

var browserUIWrapper = require('./../base/chrome-ui-wrapper.es6.js');
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
 * 2. Two-way messaging using this.model.fetch() as a passthrough
 *
 *  Each model can use a fetch method to send and receive a response from the background.
 *  Ex: this.model.fetch({'name': 'value'}).then((response) => console.log(response))
 *  Listeners must be registered in the background to respond to messages with this 'name'.
 *
 *  The common fetch method is defined in base/model.es6.js
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

},{"./../base/chrome-ui-wrapper.es6.js":14}],17:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.Model;

function EmailAliasModel(attrs) {
  attrs = attrs || {};
  Parent.call(this, attrs);
}

EmailAliasModel.prototype = window.$.extend({}, Parent.prototype, {
  modelName: 'emailAlias',
  getUserData: function getUserData() {
    return this.fetch({
      getSetting: {
        name: 'userData'
      }
    }).then(function (userData) {
      return userData;
    });
  },
  logout: function logout() {
    var _this = this;

    return this.fetch({
      logout: true
    }).then(function () {
      return _this.set('userData', undefined);
    });
  }
});
module.exports = EmailAliasModel;

},{}],18:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.Model;

function HamburgerMenu(attrs) {
  attrs = attrs || {};
  attrs.tabUrl = '';
  Parent.call(this, attrs);
}

HamburgerMenu.prototype = window.$.extend({}, Parent.prototype, {
  modelName: 'hamburgerMenu'
});
module.exports = HamburgerMenu;

},{}],19:[function(require,module,exports){
"use strict";

module.exports = {
  // Fixes cases like "Amazon.com", which break the company icon
  normalizeCompanyName: function normalizeCompanyName(companyName) {
    companyName = companyName || '';
    var normalizedName = companyName.toLowerCase().replace(/\.[a-z]+$/, '');
    return normalizedName;
  }
};

},{}],20:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.Model;

var browserUIWrapper = require('./../base/chrome-ui-wrapper.es6.js');

function Search(attrs) {
  Parent.call(this, attrs);
}

Search.prototype = window.$.extend({}, Parent.prototype, {
  modelName: 'search',
  doSearch: function doSearch(s) {
    this.searchText = s;
    s = encodeURIComponent(s);
    console.log("doSearch() for ".concat(s));
    browserUIWrapper.search(s);
  }
});
module.exports = Search;

},{"./../base/chrome-ui-wrapper.es6.js":14}],21:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.Model;

var normalizeCompanyName = require('./mixins/normalize-company-name.es6');

function SiteCompanyList(attrs) {
  attrs = attrs || {};
  attrs.tab = null;
  attrs.companyListMap = [];
  Parent.call(this, attrs);
}

SiteCompanyList.prototype = window.$.extend({}, Parent.prototype, normalizeCompanyName, {
  modelName: 'siteCompanyList',
  fetchAsyncData: function fetchAsyncData() {
    var _this = this;

    return new Promise(function (resolve, reject) {
      _this.fetch({
        getCurrentTab: true
      }).then(function (tab) {
        if (tab) {
          _this.fetch({
            getTab: tab.id
          }).then(function (bkgTab) {
            _this.tab = bkgTab;
            _this.domain = _this.tab && _this.tab.site ? _this.tab.site.domain : '';

            _this._updateCompaniesList();

            resolve();
          });
        } else {
          console.debug('SiteDetails model: no tab');
          resolve();
        }
      });
    });
  },
  _updateCompaniesList: function _updateCompaniesList() {
    var _this2 = this;

    // list of all trackers on page (whether we blocked them or not)
    this.trackers = this.tab.trackers || {};
    var companyNames = Object.keys(this.trackers);
    var unknownSameDomainCompany = null; // set trackerlist metadata for list display by company:

    this.companyListMap = companyNames.map(function (companyName) {
      var company = _this2.trackers[companyName];
      var urlsList = company.urls ? Object.keys(company.urls) : []; // Unknown same domain trackers need to be individually fetched and put
      // in the unblocked list

      if (companyName === 'unknown' && _this2.hasUnblockedTrackers(company, urlsList)) {
        unknownSameDomainCompany = _this2.createUnblockedList(company, urlsList);
      } // calc max using pixels instead of % to make margins easier
      // max width: 300 - (horizontal padding in css) = 260


      return {
        name: companyName,
        displayName: company.displayName || companyName,
        normalizedName: _this2.normalizeCompanyName(companyName),
        count: _this2._setCount(company, companyName, urlsList),
        urls: company.urls,
        urlsList: urlsList
      };
    }, this).sort(function (a, b) {
      return b.count - a.count;
    });

    if (unknownSameDomainCompany) {
      this.companyListMap.push(unknownSameDomainCompany);
    }
  },
  // Make ad-hoc unblocked list
  // used to cherry pick unblocked trackers from unknown companies
  // the name is the site domain, count is -2 to show the list at the bottom
  createUnblockedList: function createUnblockedList(company, urlsList) {
    var unblockedTrackers = this.spliceUnblockedTrackers(company, urlsList);
    return {
      name: this.domain,
      iconName: '',
      // we won't have an icon for unknown first party trackers
      count: -2,
      urls: unblockedTrackers,
      urlsList: Object.keys(unblockedTrackers)
    };
  },
  // Return an array of unblocked trackers
  // and remove those entries from the specified company
  // only needed for unknown trackers, so far
  spliceUnblockedTrackers: function spliceUnblockedTrackers(company, urlsList) {
    if (!company || !company.urls || !urlsList) return null;
    return urlsList.filter(function (url) {
      return company.urls[url].isBlocked === false;
    }).reduce(function (unblockedTrackers, url) {
      unblockedTrackers[url] = company.urls[url]; // Update the company urls and urlsList

      delete company.urls[url];
      urlsList.splice(urlsList.indexOf(url), 1);
      return unblockedTrackers;
    }, {});
  },
  // Return true if company has unblocked trackers in the current tab
  hasUnblockedTrackers: function hasUnblockedTrackers(company, urlsList) {
    if (!company || !company.urls || !urlsList) return false;
    return urlsList.some(function (url) {
      return company.urls[url].isBlocked === false;
    });
  },
  // Determines sorting order of the company list
  _setCount: function _setCount(company, companyName, urlsList) {
    var count = company.count; // Unknown trackers, followed by unblocked first party,
    // should be at the bottom of the list

    if (companyName === 'unknown') {
      count = -1;
    } else if (this.hasUnblockedTrackers(company, urlsList)) {
      count = -2;
    }

    return count;
  }
});
module.exports = SiteCompanyList;

},{"./mixins/normalize-company-name.es6":19}],22:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.Model;

var constants = require('../../../data/constants');

var httpsMessages = constants.httpsMessages;

var browserUIWrapper = require('./../base/chrome-ui-wrapper.es6.js'); // for now we consider tracker networks found on more than 7% of sites
// as "major"


var MAJOR_TRACKER_THRESHOLD_PCT = 7;

function Site(attrs) {
  attrs = attrs || {};
  attrs.disabled = true; // disabled by default

  attrs.tab = null;
  attrs.domain = '-';
  attrs.isWhitelisted = false;
  attrs.whitelistOptIn = false;
  attrs.isCalculatingSiteRating = true;
  attrs.siteRating = {};
  attrs.httpsState = 'none';
  attrs.httpsStatusText = '';
  attrs.trackersCount = 0; // unique trackers count

  attrs.majorTrackerNetworksCount = 0;
  attrs.totalTrackerNetworksCount = 0;
  attrs.trackerNetworks = [];
  attrs.tosdr = {};
  attrs.isaMajorTrackingNetwork = false;
  Parent.call(this, attrs);
  this.bindEvents([[this.store.subscribe, 'action:backgroundMessage', this.handleBackgroundMsg]]);
}

Site.prototype = window.$.extend({}, Parent.prototype, {
  modelName: 'site',
  getBackgroundTabData: function getBackgroundTabData() {
    var _this = this;

    return new Promise(function (resolve) {
      browserUIWrapper.getBackgroundTabData().then(function (tab) {
        if (tab) {
          _this.set('tab', tab);

          _this.domain = tab.site.domain;

          _this.fetchSiteRating();

          _this.set('tosdr', tab.site.tosdr);

          _this.set('isaMajorTrackingNetwork', tab.site.parentPrevalence >= MAJOR_TRACKER_THRESHOLD_PCT);

          _this.fetch({
            getSetting: {
              name: 'tds-etag'
            }
          }).then(function (etag) {
            return _this.set('tds', etag);
          });
        } else {
          console.debug('Site model: no tab');
        }

        _this.setSiteProperties();

        _this.setHttpsMessage();

        _this.update();

        resolve();
      });
    });
  },
  fetchSiteRating: function fetchSiteRating() {
    var _this2 = this;

    // console.log('[model] fetchSiteRating()')
    if (this.tab) {
      this.fetch({
        getSiteGrade: this.tab.id
      }).then(function (rating) {
        console.log('fetchSiteRating: ', rating);
        if (rating) _this2.update({
          siteRating: rating
        });
      });
    }
  },
  setSiteProperties: function setSiteProperties() {
    if (!this.tab) {
      this.domain = 'new tab'; // tab can be null for firefox new tabs

      this.set({
        isCalculatingSiteRating: false
      });
    } else {
      this.isWhitelisted = this.tab.site.whitelisted;
      this.whitelistOptIn = this.tab.site.whitelistOptIn;

      if (this.tab.site.specialDomainName) {
        this.domain = this.tab.site.specialDomainName; // eg "extensions", "options", "new tab"

        this.set({
          isCalculatingSiteRating: false
        });
      } else {
        this.set({
          disabled: false
        });
      }
    }

    if (this.domain && this.domain === '-') this.set('disabled', true);
  },
  setHttpsMessage: function setHttpsMessage() {
    if (!this.tab) return;

    if (this.tab.upgradedHttps) {
      this.httpsState = 'upgraded';
    } else if (/^https/.exec(this.tab.url)) {
      this.httpsState = 'secure';
    } else {
      this.httpsState = 'none';
    }

    this.httpsStatusText = httpsMessages[this.httpsState];
  },
  handleBackgroundMsg: function handleBackgroundMsg(message) {
    var _this3 = this;

    // console.log('[model] handleBackgroundMsg()')
    if (!this.tab) return;

    if (message.action && message.action === 'updateTabData') {
      this.fetch({
        getTab: this.tab.id
      }).then(function (backgroundTabObj) {
        _this3.tab = backgroundTabObj;

        _this3.update();

        _this3.fetchSiteRating();
      });
    }
  },
  // calls `this.set()` to trigger view re-rendering
  update: function update(ops) {
    // console.log('[model] update()')
    if (this.tab) {
      // got siteRating back from background process
      if (ops && ops.siteRating && ops.siteRating.site && ops.siteRating.enhanced) {
        var before = ops.siteRating.site.grade;
        var after = ops.siteRating.enhanced.grade; // we don't currently show D- grades

        if (before === 'D-') before = 'D';
        if (after === 'D-') after = 'D';

        if (before !== this.siteRating.before || after !== this.siteRating.after) {
          var newSiteRating = {
            cssBefore: before.replace('+', '-plus').toLowerCase(),
            cssAfter: after.replace('+', '-plus').toLowerCase(),
            before: before,
            after: after
          };
          this.set({
            siteRating: newSiteRating,
            isCalculatingSiteRating: false
          });
        } else if (this.isCalculatingSiteRating) {
          // got site rating from background process
          this.set('isCalculatingSiteRating', false);
        }
      }

      var newTrackersCount = this.getUniqueTrackersCount();

      if (newTrackersCount !== this.trackersCount) {
        this.set('trackersCount', newTrackersCount);
      }

      var newTrackersBlockedCount = this.getUniqueTrackersBlockedCount();

      if (newTrackersBlockedCount !== this.trackersBlockedCount) {
        this.set('trackersBlockedCount', newTrackersBlockedCount);
      }

      var newTrackerNetworks = this.getTrackerNetworksOnPage();

      if (this.trackerNetworks.length === 0 || newTrackerNetworks.length !== this.trackerNetworks.length) {
        this.set('trackerNetworks', newTrackerNetworks);
      }

      var newUnknownTrackersCount = this.getUnknownTrackersCount();
      var newTotalTrackerNetworksCount = newUnknownTrackersCount + newTrackerNetworks.length;

      if (newTotalTrackerNetworksCount !== this.totalTrackerNetworksCount) {
        this.set('totalTrackerNetworksCount', newTotalTrackerNetworksCount);
      }

      var newMajorTrackerNetworksCount = this.getMajorTrackerNetworksCount();

      if (newMajorTrackerNetworksCount !== this.majorTrackerNetworksCount) {
        this.set('majorTrackerNetworksCount', newMajorTrackerNetworksCount);
      }
    }
  },
  getUniqueTrackersCount: function getUniqueTrackersCount() {
    var _this4 = this;

    // console.log('[model] getUniqueTrackersCount()')
    var count = Object.keys(this.tab.trackers).reduce(function (total, name) {
      return _this4.tab.trackers[name].count + total;
    }, 0);
    return count;
  },
  getUniqueTrackersBlockedCount: function getUniqueTrackersBlockedCount() {
    var _this5 = this;

    // console.log('[model] getUniqueTrackersBlockedCount()')
    var count = Object.keys(this.tab.trackersBlocked).reduce(function (total, name) {
      var companyBlocked = _this5.tab.trackersBlocked[name]; // Don't throw a TypeError if urls are not there

      var trackersBlocked = companyBlocked.urls ? Object.keys(companyBlocked.urls) : null; // Counting unique URLs instead of using the count
      // because the count refers to all requests rather than unique number of trackers

      var trackersBlockedCount = trackersBlocked ? trackersBlocked.length : 0;
      return trackersBlockedCount + total;
    }, 0);
    return count;
  },
  getUnknownTrackersCount: function getUnknownTrackersCount() {
    // console.log('[model] getUnknownTrackersCount()')
    var unknownTrackers = this.tab.trackers ? this.tab.trackers.unknown : {};
    var count = 0;

    if (unknownTrackers && unknownTrackers.urls) {
      var unknownTrackersUrls = Object.keys(unknownTrackers.urls);
      count = unknownTrackersUrls ? unknownTrackersUrls.length : 0;
    }

    return count;
  },
  getMajorTrackerNetworksCount: function getMajorTrackerNetworksCount() {
    // console.log('[model] getMajorTrackerNetworksCount()')
    // Show only blocked major trackers count, unless site is whitelisted
    var trackers = this.isWhitelisted ? this.tab.trackers : this.tab.trackersBlocked;
    var count = Object.values(trackers).reduce(function (total, t) {
      var isMajor = t.prevalence > MAJOR_TRACKER_THRESHOLD_PCT;
      total += isMajor ? 1 : 0;
      return total;
    }, 0);
    return count;
  },
  getTrackerNetworksOnPage: function getTrackerNetworksOnPage() {
    // console.log('[model] getMajorTrackerNetworksOnPage()')
    // all tracker networks found on this page/tab
    var networks = Object.keys(this.tab.trackers).map(function (t) {
      return t.toLowerCase();
    }).filter(function (t) {
      return t !== 'unknown';
    });
    return networks;
  },
  toggleWhitelist: function toggleWhitelist() {
    if (this.tab && this.tab.site) {
      this.isWhitelisted = !this.isWhitelisted;
      this.set('whitelisted', this.isWhitelisted);
      var whitelistOnOrOff = this.isWhitelisted ? 'off' : 'on'; // fire ept.on pixel if just turned privacy protection on,
      // fire ept.off pixel if just turned privacy protection off.

      if (whitelistOnOrOff === 'on' && this.whitelistOptIn) {
        // If user reported broken site and opted to share data on site,
        // attach domain and path to ept.on pixel if they turn privacy protection back on.
        var siteUrl = this.tab.url.split('?')[0].split('#')[0];
        this.set('whitelistOptIn', false);
        this.fetch({
          firePixel: ['ept', 'on', {
            siteUrl: encodeURIComponent(siteUrl)
          }]
        });
        this.fetch({
          whitelistOptIn: {
            list: 'whitelistOptIn',
            domain: this.tab.site.domain,
            value: false
          }
        });
      } else {
        this.fetch({
          firePixel: ['ept', whitelistOnOrOff]
        });
      }

      this.fetch({
        whitelisted: {
          list: 'whitelisted',
          domain: this.tab.site.domain,
          value: this.isWhitelisted
        }
      });
    }
  },
  submitBreakageForm: function submitBreakageForm(category) {
    if (!this.tab) return;
    var blockedTrackers = [];
    var surrogates = [];
    var upgradedHttps = this.tab.upgradedHttps; // remove params and fragments from url to avoid including sensitive data

    var siteUrl = this.tab.url.split('?')[0].split('#')[0];
    var trackerObjects = this.tab.trackersBlocked;
    var pixelParams = ['epbf', {
      category: category
    }, {
      siteUrl: encodeURIComponent(siteUrl)
    }, {
      upgradedHttps: upgradedHttps.toString()
    }, {
      tds: this.tds
    }];

    var _loop = function _loop(tracker) {
      var trackerDomains = trackerObjects[tracker].urls;
      Object.keys(trackerDomains).forEach(function (domain) {
        if (trackerDomains[domain].isBlocked) {
          blockedTrackers.push(domain);

          if (trackerDomains[domain].reason === 'matched rule - surrogate') {
            surrogates.push(domain);
          }
        }
      });
    };

    for (var tracker in trackerObjects) {
      _loop(tracker);
    }

    pixelParams.push({
      blockedTrackers: blockedTrackers
    }, {
      surrogates: surrogates
    });
    this.fetch({
      firePixel: pixelParams
    }); // remember that user opted into sharing site breakage data
    // for this domain, so that we can attach domain when they
    // remove site from whitelist

    this.set('whitelistOptIn', true);
    this.fetch({
      whitelistOptIn: {
        list: 'whitelistOptIn',
        domain: this.tab.site.domain,
        value: true
      }
    });
  }
});
module.exports = Site;

},{"../../../data/constants":9,"./../base/chrome-ui-wrapper.es6.js":14}],23:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.Model;

var normalizeCompanyName = require('./mixins/normalize-company-name.es6');

function TopBlocked(attrs) {
  attrs = attrs || {}; // eslint-disable-next-line no-self-assign

  attrs.numCompanies = attrs.numCompanies;
  attrs.companyList = [];
  attrs.companyListMap = [];
  attrs.pctPagesWithTrackers = null;
  attrs.lastStatsResetDate = null;
  Parent.call(this, attrs);
}

TopBlocked.prototype = window.$.extend({}, Parent.prototype, normalizeCompanyName, {
  modelName: 'topBlocked',
  getTopBlocked: function getTopBlocked() {
    var _this = this;

    return new Promise(function (resolve, reject) {
      _this.fetch({
        getTopBlockedByPages: _this.numCompanies
      }).then(function (data) {
        if (!data.totalPages || data.totalPages < 30) return resolve();
        if (!data.topBlocked || data.topBlocked.length < 1) return resolve();
        _this.companyList = data.topBlocked;
        _this.companyListMap = _this.companyList.map(function (company) {
          return {
            name: company.name,
            displayName: company.displayName,
            normalizedName: _this.normalizeCompanyName(company.name),
            percent: company.percent,
            // calc graph bars using pixels instead of % to
            // make margins easier
            // max width: 145px
            px: Math.floor(company.percent / 100 * 145)
          };
        });

        if (data.pctPagesWithTrackers) {
          _this.pctPagesWithTrackers = data.pctPagesWithTrackers;

          if (data.lastStatsResetDate) {
            _this.lastStatsResetDate = data.lastStatsResetDate;
          }
        }

        resolve();
      });
    });
  },
  reset: function reset(resetDate) {
    this.companyList = [];
    this.companyListMap = [];
    this.pctPagesWithTrackers = null;
    this.lastStatsResetDate = resetDate;
  }
});
module.exports = TopBlocked;

},{"./mixins/normalize-company-name.es6":19}],24:[function(require,module,exports){
"use strict";

module.exports = {
  setBrowserClassOnBodyTag: function setBrowserClassOnBodyTag() {
    window.chrome.runtime.sendMessage({
      getBrowser: true
    }, function (browser) {
      if (['edg', 'edge', 'brave'].includes(browser)) {
        browser = 'chrome';
      }

      var browserClass = 'is-browser--' + browser;
      window.$('html').addClass(browserClass);
      window.$('body').addClass(browserClass);
    });
  }
};

},{}],25:[function(require,module,exports){
"use strict";

module.exports = {
  setBrowserClassOnBodyTag: require('./chrome-set-browser-class.es6.js'),
  parseQueryString: require('./parse-query-string.es6.js')
};

},{"./chrome-set-browser-class.es6.js":24,"./parse-query-string.es6.js":26}],26:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

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

},{}],27:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.Page;

var mixins = require('./mixins/index.es6.js');

var HamburgerMenuView = require('./../views/hamburger-menu.es6.js');

var HamburgerMenuModel = require('./../models/hamburger-menu.es6.js');

var hamburgerMenuTemplate = require('./../templates/hamburger-menu.es6.js');

var TopBlockedView = require('./../views/top-blocked-truncated.es6.js');

var TopBlockedModel = require('./../models/top-blocked.es6.js');

var topBlockedTemplate = require('./../templates/top-blocked-truncated.es6.js');

var SiteView = require('./../views/site.es6.js');

var SiteModel = require('./../models/site.es6.js');

var siteTemplate = require('./../templates/site.es6.js');

var SearchView = require('./../views/search.es6.js');

var SearchModel = require('./../models/search.es6.js');

var searchTemplate = require('./../templates/search.es6.js');

var AutocompleteView = require('./../views/autocomplete.es6.js');

var AutocompleteModel = require('./../models/autocomplete.es6.js');

var autocompleteTemplate = require('./../templates/autocomplete.es6.js');

var BackgroundMessageModel = require('./../models/background-message.es6.js');

var EmailAliasView = require('../views/email-alias.es6.js');

var EmailAliasModel = require('../models/email-alias.es6.js');

var EmailAliasTemplate = require('../templates/email-alias.es6.js');

function Trackers(ops) {
  this.$parent = window.$('#popup-container');
  Parent.call(this, ops);
}

Trackers.prototype = window.$.extend({}, Parent.prototype, mixins.setBrowserClassOnBodyTag, {
  pageName: 'popup',
  ready: function ready() {
    Parent.prototype.ready.call(this);
    this.message = new BackgroundMessageModel();
    this.setBrowserClassOnBodyTag();
    this.views.search = new SearchView({
      pageView: this,
      model: new SearchModel({
        searchText: ''
      }),
      appendTo: window.$('#search-form-container'),
      template: searchTemplate
    });
    this.views.hamburgerMenu = new HamburgerMenuView({
      pageView: this,
      model: new HamburgerMenuModel(),
      appendTo: window.$('#hamburger-menu-container'),
      template: hamburgerMenuTemplate
    });
    this.views.site = new SiteView({
      pageView: this,
      model: new SiteModel(),
      appendTo: window.$('#site-info-container'),
      template: siteTemplate
    });
    this.views.topblocked = new TopBlockedView({
      pageView: this,
      model: new TopBlockedModel({
        numCompanies: 3
      }),
      appendTo: window.$('#top-blocked-container'),
      template: topBlockedTemplate
    });
    this.views.emailAlias = new EmailAliasView({
      pageView: this,
      model: new EmailAliasModel(),
      appendTo: window.$('#email-alias-container'),
      template: EmailAliasTemplate
    }); // TODO: hook up model query to actual ddg ac endpoint.
    // For now this is just here to demonstrate how to
    // listen to another component via model.set() +
    // store.subscribe()

    this.views.autocomplete = new AutocompleteView({
      pageView: this,
      model: new AutocompleteModel({
        suggestions: []
      }),
      // appendTo: this.views.search.$el,
      appendTo: null,
      template: autocompleteTemplate
    });
  }
}); // kickoff!

window.DDG = window.DDG || {};
window.DDG.page = new Trackers();

},{"../models/email-alias.es6.js":17,"../templates/email-alias.es6.js":30,"../views/email-alias.es6.js":55,"./../models/autocomplete.es6.js":15,"./../models/background-message.es6.js":16,"./../models/hamburger-menu.es6.js":18,"./../models/search.es6.js":20,"./../models/site.es6.js":22,"./../models/top-blocked.es6.js":23,"./../templates/autocomplete.es6.js":28,"./../templates/hamburger-menu.es6.js":32,"./../templates/search.es6.js":34,"./../templates/site.es6.js":47,"./../templates/top-blocked-truncated.es6.js":50,"./../views/autocomplete.es6.js":53,"./../views/hamburger-menu.es6.js":57,"./../views/search.es6.js":61,"./../views/site.es6.js":62,"./../views/top-blocked-truncated.es6.js":64,"./mixins/index.es6.js":25}],28:[function(require,module,exports){
"use strict";

var _templateObject, _templateObject2;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

module.exports = function () {
  // TODO/REMOVE: remove marginTop style tag once this is actually hooked up
  // this is just to demo model store for now!
  //  -> this is gross, don't do this:
  var marginTop = this.model.suggestions && this.model.suggestions.length > 0 ? 'margin-top: 50px;' : '';
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<ul class=\"js-autocomplete\" style=\"", "\">\n        ", "\n    </ul>"])), marginTop, this.model.suggestions.map(function (suggestion) {
    return bel(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n            <li><a href=\"javascript:void(0)\">", "</a></li>"])), suggestion);
  }));
};

},{"bel":1}],29:[function(require,module,exports){
"use strict";

var _templateObject, _templateObject2;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

var categories = [{
  category: 'Video didn\'t play',
  value: 'videos'
}, {
  category: 'Images didn\'t load',
  value: 'images'
}, {
  category: 'Comments didn\'t load',
  value: 'comments'
}, {
  category: 'Content is missing',
  value: 'content'
}, {
  category: 'Links or buttons don\'t work',
  value: 'links'
}, {
  category: 'I can\'t sign in',
  value: 'login'
}, {
  category: 'The site asked me to disable',
  value: 'paywall'
}];

function shuffle(arr) {
  var len = arr.length;
  var temp;
  var index;

  while (len > 0) {
    index = Math.floor(Math.random() * len);
    len--;
    temp = arr[len];
    arr[len] = arr[index];
    arr[index] = temp;
  }

  return arr;
}

module.exports = function () {
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<div class=\"breakage-form js-breakage-form\">\n    <div class=\"breakage-form__content\">\n        <nav class=\"breakage-form__close-container\">\n            <a href=\"javascript:void(0)\" class=\"icon icon__close js-breakage-form-close\" role=\"button\" aria-label=\"Dismiss form\"></a>\n        </nav>\n        <div class=\"form__icon--wrapper\">\n            <div class=\"form__icon\"></div>\n        </div>\n        <div class=\"breakage-form__element js-breakage-form-element\">\n            <h2 class=\"breakage-form__title\">Something broken?</h2>\n            <div class=\"breakage-form__explanation\">Submitting an anonymous broken site report helps us debug these issues and improve the extension.</div>\n            <div class=\"form__label__select\">Describe what happened</div>\n            <div class=\"form__select breakage-form__input--dropdown\">\n                <select class=\"js-breakage-form-dropdown\">\n                    <option value=''>Pick your issue from the list...</option>\n                    ", "\n                    <option value='Other'>Something else</option>\n                </select>\n            </div>\n            <btn class=\"form__submit js-breakage-form-submit btn-disabled\" role=\"button\" disabled=\"true\">Send report</btn>\n            <div class=\"breakage-form__footer\">Reports sent to DuckDuckGo are 100% anonymous and only include your selection above, the URL, and a list of trackers we found on the site.</div>\n        </div>\n        <div class=\"breakage-form__message js-breakage-form-message is-transparent\">\n            <h2 class=\"breakage-form__success--title\">Thank you!</h2>\n            <div class=\"breakage-form__success--message\">Your report will help improve the extension and make the experience better for other people.</div>\n        </div>\n    </div>\n</div>"])), shuffle(categories).map(function (item) {
    return bel(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<option value=", ">", "</option>"])), item.value, item.category);
  }));
};

},{"bel":1}],30:[function(require,module,exports){
"use strict";

var _templateObject;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

module.exports = function () {
  if (this.model.userData && this.model.userData.nextAlias) {
    return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n            <div class=\"js-email-alias email-alias-block padded\">\n                <span class=\"email-alias__icon\"></span>\n                <a href=\"#\" class=\"link-secondary bold\">\n                    <span class=\"text-line-after-icon\">\n                        Create new Duck Address\n                        <span class=\"js-alias-copied alias-copied-label\">Copied to clipboard</span>\n                    </span>\n                </a>\n            </div>"])));
  }

  return null;
};

},{"bel":1}],31:[function(require,module,exports){
"use strict";

var _templateObject;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

var reasons = require('./shared/grade-scorecard-reasons.es6.js');

var grades = require('./shared/grade-scorecard-grades.es6.js');

var ratingHero = require('./shared/rating-hero.es6.js');

module.exports = function () {
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<section class=\"sliding-subview grade-scorecard sliding-subview--has-fixed-header\">\n    <div class=\"site-info site-info--full-height card\">\n        ", "\n        ", "\n        ", "\n    </div>\n</section>"])), ratingHero(this.model, {
    showClose: true
  }), reasons(this.model), grades(this.model));
};

},{"./shared/grade-scorecard-grades.es6.js":36,"./shared/grade-scorecard-reasons.es6.js":37,"./shared/rating-hero.es6.js":40,"bel":1}],32:[function(require,module,exports){
"use strict";

var _templateObject;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

module.exports = function () {
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<nav class=\"hamburger-menu js-hamburger-menu is-hidden\">\n    <div class=\"hamburger-menu__bg\"></div>\n    <div class=\"hamburger-menu__content card padded\">\n        <h2 class=\"menu-title border--bottom hamburger-menu__content__more-options\">\n            More options\n        </h2>\n        <nav class=\"pull-right hamburger-menu__close-container\">\n            <a href=\"javascript:void(0)\" class=\"icon icon__close js-hamburger-menu-close\" role=\"button\" aria-label=\"Close options\"></a>\n        </nav>\n        <ul class=\"hamburger-menu__links padded default-list\">\n            <li>\n                <a href=\"javascript:void(0)\" class=\"menu-title js-hamburger-menu-options-link\">\n                    Settings\n                    <span>Manage Unprotected Sites and other options.</span>\n                </a>\n            </li>\n            <li>\n                <a href=\"javascript:void(0)\" class=\"menu-title js-hamburger-menu-feedback-link\">\n                    Share feedback\n                    <span>Got issues or suggestions? Let us know!</span>\n                </a>\n            </li>\n            <li>\n                <a href=\"javascript:void(0)\" class=\"menu-title js-hamburger-menu-broken-site-link\">\n                    Report broken site\n                    <span>If a site's not working, please tell us.</span>\n                </a>\n            </li>\n        </ul>\n    </div>\n</nav>"])));
};

},{"bel":1}],33:[function(require,module,exports){
"use strict";

var _templateObject, _templateObject2;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

var hero = require('./shared/hero.es6.js');

var statusList = require('./shared/status-list.es6.js');

var constants = require('../../../data/constants');

var crossplatformLink = require('./shared/crossplatform-link.es6.js');

function upperCaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = function () {
  var domain = this.model && this.model.domain;
  var tosdr = this.model && this.model.tosdr;
  var tosdrMsg = tosdr && tosdr.message || constants.tosdrMessages.unknown;
  var tosdrStatus = tosdrMsg.toLowerCase();
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<section class=\"sliding-subview sliding-subview--has-fixed-header\">\n    <div class=\"privacy-practices site-info site-info--full-height card\">\n        <div class=\"js-privacy-practices-hero\">\n            ", "\n        </div>\n        <div class=\"privacy-practices__explainer padded border--bottom--inner\n            text--center\">\n            Privacy practices indicate how much the personal information\n            that you share with a website is protected.\n        </div>\n        <div class=\"privacy-practices__details padded\n            js-privacy-practices-details\">\n            ", "\n        </div>\n        <div class=\"privacy-practices__attrib padded text--center border--top--inner\">\n            Privacy Practices from ", ".\n        </div>\n    </div>\n</section>"])), hero({
    status: tosdrStatus,
    title: domain,
    subtitle: "".concat(tosdrMsg, " Privacy Practices"),
    showClose: true
  }), tosdr && tosdr.reasons ? renderDetails(tosdr.reasons) : renderNoDetails(), crossplatformLink('https://tosdr.org/', {
    className: 'bold',
    target: '_blank',
    text: 'ToS;DR',
    attributes: {
      'aria-label': 'Terms of Service; Didn\'t Read'
    }
  }));
};

function renderDetails(reasons) {
  var good = reasons.good || [];
  var bad = reasons.bad || [];
  if (!good.length && !bad.length) return renderNoDetails(); // convert arrays to work for the statusList template,
  // which use objects

  good = good.map(function (item) {
    return {
      msg: upperCaseFirst(item),
      modifier: 'good'
    };
  });
  bad = bad.map(function (item) {
    return {
      msg: upperCaseFirst(item),
      modifier: 'bad'
    };
  }); // list good first, then bad

  return statusList(good.concat(bad));
}

function renderNoDetails() {
  return bel(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<div class=\"text--center\">\n    <h1 class=\"privacy-practices__details__title\">\n        No privacy practices found\n    </h1>\n    <div class=\"privacy-practices__details__msg\">\n        The privacy practices of this website have not been reviewed.\n    </div>\n</div>"])));
}

},{"../../../data/constants":9,"./shared/crossplatform-link.es6.js":35,"./shared/hero.es6.js":39,"./shared/status-list.es6.js":42,"bel":1}],34:[function(require,module,exports){
"use strict";

var _templateObject;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

var hamburgerButton = require('./shared/hamburger-button.es6.js');

module.exports = function () {
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    <form class=\"sliding-subview__header search-form js-search-form\" name=\"x\">\n        <input type=\"text\" autocomplete=\"off\" placeholder=\"Search DuckDuckGo\"\n            name=\"q\" class=\"search-form__input js-search-input\"\n            value=\"", "\" />\n        <input class=\"search-form__go js-search-go\" value=\"\" type=\"submit\" aria-label=\"Search\" />\n        ", "\n    </form>"])), this.model.searchText, hamburgerButton('js-search-hamburger-button'));
};

},{"./shared/hamburger-button.es6.js":38,"bel":1}],35:[function(require,module,exports){
"use strict";

/* Generates a link that will work on both webextensions and safari
 * url: href url
 * options: any a tag attribute
 */
module.exports = function (url, options) {
  var a = document.createElement('a');
  a.href = url; // attributes for the <a> tag, e.g. "aria-label"

  if (options.attributes) {
    for (var attr in options.attributes) {
      a.setAttribute(attr, options.attributes[attr]);
    }

    delete options.attributes;
  }

  for (var key in options) {
    a[key] = options[key];
  }

  if (window.safari) {
    // safari can't use _blank target so we'll add a click handler
    if (a.target === '_blank') {
      a.removeAttribute('target');
      a.href = 'javascript:void(0)';

      a.onclick = function () {
        window.safari.application.activeBrowserWindow.openTab().url = url;
        window.safari.self.hide();
      };
    }
  }

  return a;
};

},{}],36:[function(require,module,exports){
"use strict";

var statusList = require('./status-list.es6.js');

module.exports = function (site) {
  var grades = getGrades(site.siteRating, site.isWhitelisted);
  if (!grades || !grades.length) return;
  return statusList(grades, 'status-list--right padded js-grade-scorecard-grades');
};

function getGrades(rating, isWhitelisted) {
  if (!rating || !rating.before || !rating.after) return; // transform site ratings into grades
  // that the template can display more easily

  var before = rating.cssBefore;
  var after = rating.cssAfter;
  var grades = [];
  grades.push({
    msg: 'Privacy Grade',
    modifier: before.toLowerCase()
  });

  if (before !== after && !isWhitelisted) {
    grades.push({
      msg: 'Enhanced Grade',
      modifier: after.toLowerCase(),
      highlight: true
    });
  }

  return grades;
}

},{"./status-list.es6.js":42}],37:[function(require,module,exports){
"use strict";

var statusList = require('./status-list.es6.js');

var constants = require('../../../../data/constants');

var trackerNetworksText = require('./tracker-networks-text.es6.js');

module.exports = function (site) {
  var reasons = getReasons(site);
  if (!reasons || !reasons.length) return;
  return statusList(reasons, 'status-list--right padded border--bottom--inner js-grade-scorecard-reasons');
};

function getReasons(site) {
  var reasons = []; // grab all the data from the site to create
  // a list of reasons behind the grade
  // encryption status

  var httpsState = site.httpsState;

  if (httpsState) {
    var _modifier = httpsState === 'none' ? 'bad' : 'good';

    reasons.push({
      modifier: _modifier,
      msg: site.httpsStatusText
    });
  } // tracking networks blocked or found,
  // only show a message if there's any


  var trackersCount = site.isWhitelisted ? site.trackersCount : site.trackersBlockedCount;
  var trackersBadOrGood = trackersCount !== 0 ? 'bad' : 'good';
  reasons.push({
    modifier: trackersBadOrGood,
    msg: "".concat(trackerNetworksText(site))
  }); // major tracking networks,
  // only show a message if there are any

  var majorTrackersBadOrGood = site.majorTrackerNetworksCount !== 0 ? 'bad' : 'good';
  reasons.push({
    modifier: majorTrackersBadOrGood,
    msg: "".concat(trackerNetworksText(site, true))
  }); // Is the site itself a major tracking network?
  // only show a message if it is

  if (site.isaMajorTrackingNetwork) {
    reasons.push({
      modifier: 'bad',
      msg: 'Site Is a Major Tracker Network'
    });
  } // privacy practices from tosdr


  var unknownPractices = constants.tosdrMessages.unknown;
  var privacyMessage = site.tosdr && site.tosdr.message || unknownPractices;
  var modifier = privacyMessage === unknownPractices ? 'poor' : privacyMessage.toLowerCase();
  reasons.push({
    modifier: modifier,
    msg: "".concat(privacyMessage, " Privacy Practices")
  });
  return reasons;
}

},{"../../../../data/constants":9,"./status-list.es6.js":42,"./tracker-networks-text.es6.js":46}],38:[function(require,module,exports){
"use strict";

var _templateObject;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

module.exports = function (klass) {
  klass = klass || '';
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<button type=\"button\" class=\"hamburger-button ", "\" aria-label=\"More options\">\n    <span></span>\n    <span></span>\n    <span></span>\n</button>"])), klass);
};

},{"bel":1}],39:[function(require,module,exports){
"use strict";

var _templateObject, _templateObject2;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

module.exports = function (ops) {
  var slidingSubviewClass = ops.showClose ? 'js-sliding-subview-close' : '';
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<div class=\"hero text--center ", "\">\n    <div class=\"hero__icon hero__icon--", "\">\n    </div>\n    <h1 class=\"hero__title\">\n        ", "\n    </h1>\n    <h2 class=\"hero__subtitle\" aria-label=\"", "\">\n        ", "\n    </h2>\n    ", "\n</div>"])), slidingSubviewClass, ops.status, ops.title, ops.subtitleLabel ? ops.subtitleLabel : ops.subtitle, ops.subtitle, renderOpenOrCloseButton(ops.showClose));
};

function renderOpenOrCloseButton(isCloseButton) {
  var openOrClose = isCloseButton ? 'close' : 'open';
  var arrowIconClass = isCloseButton ? 'icon__arrow--left' : '';
  return bel(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<a href=\"javascript:void(0)\"\n        class=\"hero__", "\"\n        role=\"button\"\n        aria-label=\"", "\"\n        >\n    <span class=\"icon icon__arrow icon__arrow--large ", "\">\n    </span>\n</a>"])), openOrClose, isCloseButton ? 'Go back' : 'More details', arrowIconClass);
}

},{"bel":1}],40:[function(require,module,exports){
"use strict";

var _templateObject, _templateObject2, _templateObject3;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

var hero = require('./hero.es6.js');

module.exports = function (site, ops) {
  var status = siteRatingStatus(site.isCalculatingSiteRating, site.siteRating, site.isWhitelisted);
  var subtitle = siteRatingSubtitle(site.isCalculatingSiteRating, site.siteRating, site.isWhitelisted);
  var label = subtitleLabel(site.isCalculatingSiteRating, site.siteRating, site.isWhitelisted);
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<div class=\"rating-hero-container js-rating-hero\">\n     ", "\n</div>"])), hero({
    status: status,
    title: site.domain,
    subtitle: subtitle,
    subtitleLabel: label,
    showClose: ops.showClose,
    showOpen: ops.showOpen
  }));
};

function siteRatingStatus(isCalculating, rating, isWhitelisted) {
  var status;
  var isActive = '';

  if (isCalculating) {
    status = 'calculating';
  } else if (rating && rating.before) {
    isActive = isWhitelisted ? '' : '--active';

    if (isActive && rating.after) {
      status = rating.cssAfter;
    } else {
      status = rating.cssBefore;
    }
  } else {
    status = 'null';
  }

  return status + isActive;
}

function siteRatingSubtitle(isCalculating, rating, isWhitelisted) {
  var isActive = true;
  if (isWhitelisted) isActive = false; // site grade/rating was upgraded by extension

  if (isActive && rating && rating.before && rating.after) {
    if (rating.before !== rating.after) {
      // wrap this in a single root span otherwise bel complains
      return bel(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<span>Site enhanced from\n    <span class=\"rating-letter rating-letter--", "\">\n    </span>\n</span>"])), rating.cssBefore);
    }
  } // deal with other states


  var msg = 'Privacy Grade'; // site is whitelisted

  if (!isActive) {
    msg = 'Privacy Protection Disabled'; // "null" state (empty tab, browser's "about:" pages)
  } else if (!isCalculating && !rating.before && !rating.after) {
    msg = 'We only grade regular websites'; // rating is still calculating
  } else if (isCalculating) {
    msg = 'Calculating...';
  }

  return bel(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["", ""])), msg);
} // to avoid duplicating messages between the icon and the subtitle,
// we combine information for both here


function subtitleLabel(isCalculating, rating, isWhitelisted) {
  if (isCalculating) return;

  if (isWhitelisted && rating.before) {
    return "Privacy Protection Disabled, Privacy Grade ".concat(rating.before);
  }

  if (rating.before && rating.before === rating.after) {
    return "Privacy Grade ".concat(rating.before);
  }

  if (rating.before && rating.after) {
    return "Site enhanced from ".concat(rating.before);
  }
}

},{"./hero.es6.js":39,"bel":1}],41:[function(require,module,exports){
"use strict";

var _templateObject;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

var hamburgerButton = require('./hamburger-button.es6.js');

module.exports = function (title) {
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<nav class=\"sliding-subview__header card\">\n    <a href=\"javascript:void(0)\" class=\"sliding-subview__header__back\n        sliding-subview__header__back--is-icon\n        js-sliding-subview-close\">\n        <span class=\"icon icon__arrow icon__arrow--left pull-left\">\n        </span>\n    </a>\n    <h2 class=\"sliding-subview__header__title\">\n        ", "\n    </h2>\n    ", "\n</nav>"])), title, hamburgerButton());
};

},{"./hamburger-button.es6.js":38,"bel":1}],42:[function(require,module,exports){
"use strict";

var _templateObject, _templateObject2;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

module.exports = function (items, extraClasses) {
  extraClasses = extraClasses || '';
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<ul class=\"status-list ", "\">\n    ", "\n</ul>"])), extraClasses, items.map(renderItem));
};

function renderItem(item) {
  return bel(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<li class=\"status-list__item status-list__item--", "\n    bold ", "\">\n    ", "\n</li>"])), item.modifier, item.highlight ? 'is-highlighted' : '', item.msg);
}

},{"bel":1}],43:[function(require,module,exports){
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

},{"bel":1}],44:[function(require,module,exports){
"use strict";

var _templateObject;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

module.exports = function () {
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<div class=\"top-blocked__no-data\">\n    <div class=\"top-blocked__no-data__graph\">\n        <span class=\"top-blocked__no-data__graph__bar one\"></span>\n        <span class=\"top-blocked__no-data__graph__bar two\"></span>\n        <span class=\"top-blocked__no-data__graph__bar three\"></span>\n        <span class=\"top-blocked__no-data__graph__bar four\"></span>\n    </div>\n    <p class=\"top-blocked__no-data__lead text-center\">Tracker Networks Top Offenders</p>\n    <p>No data available yet</p>\n</div>"])));
};

},{"bel":1}],45:[function(require,module,exports){
"use strict";

var _templateObject;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

module.exports = function (siteRating, isWhitelisted, totalTrackerNetworksCount) {
  var iconNameModifier = 'blocked';

  if (isWhitelisted && siteRating.before === 'D' && totalTrackerNetworksCount !== 0) {
    iconNameModifier = 'warning';
  }

  var iconName = 'major-networks-' + iconNameModifier;
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["", ""])), iconName);
};

},{"bel":1}],46:[function(require,module,exports){
"use strict";

var _templateObject, _templateObject2;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

module.exports = function (site, isMajorNetworksCount) {
  // Show all trackers found if site is whitelisted
  // but only show the blocked ones otherwise
  var trackersCount = site.isWhitelisted ? site.trackersCount : site.trackersBlockedCount || 0;
  var uniqueTrackersText = trackersCount === 1 ? ' Tracker ' : ' Trackers ';

  if (isMajorNetworksCount) {
    trackersCount = site.majorTrackerNetworksCount;
    uniqueTrackersText = trackersCount === 1 ? ' Major Tracker Network ' : ' Major Tracker Networks ';
  }

  var finalText = trackersCount + uniqueTrackersText + trackersBlockedOrFound(site, trackersCount);
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["", ""])), finalText);
};

function trackersBlockedOrFound(site, trackersCount) {
  var msg = '';

  if (site && (site.isWhitelisted || trackersCount === 0)) {
    msg = 'Found';
  } else {
    msg = 'Blocked';
  }

  return bel(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["", ""])), msg);
}

},{"bel":1}],47:[function(require,module,exports){
"use strict";

var _templateObject, _templateObject2, _templateObject3;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

var toggleButton = require('./shared/toggle-button.es6.js');

var ratingHero = require('./shared/rating-hero.es6.js');

var trackerNetworksIcon = require('./shared/tracker-network-icon.es6.js');

var trackerNetworksText = require('./shared/tracker-networks-text.es6.js');

var constants = require('../../../data/constants');

module.exports = function () {
  var tosdrMsg = this.model.tosdr && this.model.tosdr.message || constants.tosdrMessages.unknown;
  return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<div class=\"site-info site-info--main\">\n    <ul class=\"default-list\">\n        <li class=\"border--bottom site-info__rating-li main-rating js-hero-open\">\n            ", "\n        </li>\n        <li class=\"site-info__li--https-status padded border--bottom\">\n            <p class=\"site-info__https-status bold\">\n                <span class=\"site-info__https-status__icon\n                    is-", "\">\n                </span>\n                <span class=\"text-line-after-icon\">\n                    ", "\n                </span>\n            </p>\n        </li>\n        <li class=\"js-site-tracker-networks js-site-show-page-trackers site-info__li--trackers padded border--bottom\">\n            <a href=\"javascript:void(0)\" class=\"link-secondary bold\" role=\"button\">\n                ", "\n            </a>\n        </li>\n        <li class=\"js-site-privacy-practices site-info__li--privacy-practices padded border--bottom\">\n            <span class=\"site-info__privacy-practices__icon\n                is-", "\">\n            </span>\n            <a href=\"javascript:void(0)\" class=\"link-secondary bold\" role=\"button\">\n                <span class=\"text-line-after-icon\"> ", " Privacy Practices </span>\n                <span class=\"icon icon__arrow pull-right\"></span>\n            </a>\n        </li>\n        <li class=\"site-info__li--toggle padded ", "\">\n            <p class=\"is-transparent site-info__whitelist-status js-site-whitelist-status\">\n                <span class=\"text-line-after-icon privacy-on-off-message bold\">\n                    ", "\n                </span>\n            </p>\n            <p class=\"site-info__protection js-site-protection bold\">Site Privacy Protection</p>\n            <div class=\"site-info__toggle-container\">\n                ", "\n            </div>\n        </li>\n        <li class=\"js-site-manage-whitelist-li site-info__li--manage-whitelist padded\">\n            ", "\n        </li>\n        <li class=\"js-site-confirm-breakage-li site-info__li--confirm-breakage border--bottom padded is-hidden\">\n           <div class=\"js-site-confirm-breakage-message site-info__confirm-thanks is-transparent\">\n                <span class=\"site-info__message\">\n                    Thanks for the feedback!\n                </span>\n            </div>\n            <div class=\"js-site-confirm-breakage site-info--confirm-breakage\">\n                <span class=\"site-info--is-site-broken bold\">\n                    Is this website broken?\n                </span>\n                <btn class=\"js-site-confirm-breakage-yes site-info__confirm-breakage-yes btn-pill\">\n                    Yes\n                </btn>\n                <btn class=\"js-site-confirm-breakage-no site-info__confirm-breakage-no btn-pill\">\n                    No\n                </btn>\n            </div>\n        </li>\n    </ul>\n</div>"])), ratingHero(this.model, {
    showOpen: !this.model.disabled
  }), this.model.httpsState, this.model.httpsStatusText, renderTrackerNetworks(this.model), tosdrMsg.toLowerCase(), tosdrMsg, this.model.isWhitelisted ? '' : 'is-active', setTransitionText(!this.model.isWhitelisted), toggleButton(!this.model.isWhitelisted, 'js-site-toggle pull-right'), renderManageWhitelist(this.model));

  function setTransitionText(isSiteWhitelisted) {
    isSiteWhitelisted = isSiteWhitelisted || false;
    var text = 'Added to Unprotected Sites';

    if (isSiteWhitelisted) {
      text = 'Removed from Unprotected Sites';
    }

    return text;
  }

  function renderTrackerNetworks(model) {
    var isActive = !model.isWhitelisted ? 'is-active' : '';
    return bel(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<a href=\"javascript:void(0)\" class=\"site-info__trackers link-secondary bold\">\n    <span class=\"site-info__trackers-status__icon\n        icon-", "\"></span>\n    <span class=\"", " text-line-after-icon\"> ", " </span>\n    <span class=\"icon icon__arrow pull-right\"></span>\n</a>"])), trackerNetworksIcon(model.siteRating, model.isWhitelisted, model.totalTrackerNetworksCount), isActive, trackerNetworksText(model, false));
  }

  function renderManageWhitelist(model) {
    return bel(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<div>\n    <a href=\"javascript:void(0)\" class=\"js-site-manage-whitelist site-info__manage-whitelist link-secondary bold\">\n        Unprotected Sites\n    </a>\n    <div class=\"separator\"></div>\n    <a href=\"javascript:void(0)\" class=\"js-site-report-broken site-info__report-broken link-secondary bold\">\n        Report broken site\n    </a>\n</div>"])));
  }
};

},{"../../../data/constants":9,"./shared/rating-hero.es6.js":40,"./shared/toggle-button.es6.js":43,"./shared/tracker-network-icon.es6.js":45,"./shared/tracker-networks-text.es6.js":46,"bel":1}],48:[function(require,module,exports){
"use strict";

var _templateObject;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

module.exports = function (companyListMap) {
  return companyListMap.map(function (data) {
    return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<li class=\"top-blocked__li\">\n    <div title=\"", "\" class=\"top-blocked__li__company-name\">", "</div>\n    <div class=\"top-blocked__li__blocker-bar\">\n        <div class=\"top-blocked__li__blocker-bar__fg\n            js-top-blocked-graph-bar-fg\"\n            style=\"width: 0px\" data-width=\"", "\">\n        </div>\n    </div>\n    <div class=\"top-blocked__li__blocker-pct js-top-blocked-pct\">\n        ", "%\n    </div>\n</li>"])), data.name, data.displayName, data.percent, data.percent);
  });
};

},{"bel":1}],49:[function(require,module,exports){
"use strict";

var _templateObject;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

var constants = require('../../../data/constants');

var entityIconMapping = constants.entityIconMapping;

module.exports = function (companyListMap) {
  return companyListMap.map(function (data) {
    return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<span class=\"top-blocked__pill-site__icon ", "\"></span>"])), getScssClass(data.name));
  });

  function getScssClass(companyName) {
    var iconClassName = entityIconMapping[companyName] || 'generic';
    return iconClassName;
  }
};

},{"../../../data/constants":9,"bel":1}],50:[function(require,module,exports){
"use strict";

var _templateObject;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

var listItems = require('./top-blocked-truncated-list-items.es6.js');

module.exports = function () {
  if (this.model.companyListMap && this.model.companyListMap.length > 0) {
    return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<div class=\"top-blocked top-blocked--truncated\">\n    <div class=\"top-blocked__see-all js-top-blocked-see-all\">\n        <a href=\"javascript:void(0)\" class=\"link-secondary\">\n            <span class=\"icon icon__arrow pull-right\"></span>\n            Top Tracking Offenders\n            <span class=\"top-blocked__list top-blocked__list--truncated top-blocked__list--icons\">\n                ", "\n            </span>\n        </a>\n    </div>\n</div>"])), listItems(this.model.companyListMap));
  }
};

},{"./top-blocked-truncated-list-items.es6.js":49,"bel":1}],51:[function(require,module,exports){
"use strict";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

var header = require('./shared/sliding-subview-header.es6.js');

var listItems = require('./top-blocked-list-items.es6.js');

var noData = require('./shared/top-blocked-no-data.es6.js');

module.exports = function () {
  if (!this.model) {
    return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<div class=\"sliding-subview\n    sliding-subview--has-fixed-header top-blocked-header\">\n    ", "\n</div>"])), header('All Trackers'));
  } else {
    return bel(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<div class=\"js-top-blocked-content\">\n    ", "\n    ", "\n    ", "\n</div>"])), renderPctPagesWithTrackers(this.model), renderList(this.model), renderResetButton(this.model));
  }
};

function renderPctPagesWithTrackers(model) {
  var msg = '';

  if (model.lastStatsResetDate) {
    var d = new Date(model.lastStatsResetDate).toLocaleDateString('default', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    if (d) msg = " since ".concat(d);
  }

  if (model.pctPagesWithTrackers) {
    return bel(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<p class=\"top-blocked__pct card\">\n    Trackers were found on <b>", "%</b>\n    of websites you've visited", ".\n</p>"])), model.pctPagesWithTrackers, msg);
  }
}

function renderList(model) {
  if (model.companyListMap.length > 0) {
    return bel(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["<ol aria-label=\"List of Trackers Found\" class=\"default-list top-blocked__list card border--bottom\">\n    ", "\n</ol>"])), listItems(model.companyListMap));
  } else {
    return bel(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["<ol class=\"default-list top-blocked__list\">\n    <li class=\"top-blocked__li top-blocked__li--no-data\">\n        ", "\n    </li>\n</ol>"])), noData());
  }
}

function renderResetButton(model) {
  if (model.companyListMap.length > 0) {
    return bel(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["<div class=\"top-blocked__reset-stats\">\n    <button class=\"top-blocked__reset-stats__button block\n        js-reset-trackers-data\">\n        Reset global stats\n    </button>\n    <p>These stats are only stored locally on your device,\n    and are not sent anywhere, ever.</p>\n</div>"])));
  }
}

},{"./shared/sliding-subview-header.es6.js":41,"./shared/top-blocked-no-data.es6.js":44,"./top-blocked-list-items.es6.js":48,"bel":1}],52:[function(require,module,exports){
"use strict";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bel = require('bel');

var hero = require('./shared/hero.es6.js');

var trackerNetworksIcon = require('./shared/tracker-network-icon.es6.js');

var trackerNetworksText = require('./shared/tracker-networks-text.es6.js');

var displayCategories = require('./../../../data/constants.js').displayCategories;

module.exports = function () {
  if (!this.model) {
    return bel(_templateObject || (_templateObject = _taggedTemplateLiteral(["<section class=\"sliding-subview\n    sliding-subview--has-fixed-header\">\n</section>"])));
  } else {
    return bel(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<div class=\"tracker-networks site-info site-info--full-height card\">\n    <div class=\"js-tracker-networks-hero\">\n        ", "\n    </div>\n    <div class=\"tracker-networks__explainer border--bottom--inner\n        text--center\">\n        Tracker networks aggregate your web history into a data profile about you.\n        Major tracker networks are more harmful because they can track and target you across more of the Internet.\n    </div>\n    <div class=\"tracker-networks__details padded\n        js-tracker-networks-details\">\n        <ol class=\"default-list site-info__trackers__company-list\" aria-label=\"List of tracker networks\">\n            ", "\n        </ol>\n    </div>\n</div>"])), renderHero(this.model.site), renderTrackerDetails(this.model, this.model.DOMAIN_MAPPINGS));
  }
};

function renderHero(site) {
  site = site || {};
  return bel(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["", ""])), hero({
    status: trackerNetworksIcon(site.siteRating, site.isWhitelisted, site.totalTrackerNetworksCount),
    title: site.domain,
    subtitle: "".concat(trackerNetworksText(site, false)),
    showClose: true
  }));
}

function renderTrackerDetails(model) {
  var companyListMap = model.companyListMap || {};

  if (companyListMap.length === 0) {
    return bel(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["<li class=\"is-empty\"></li>"])));
  }

  if (companyListMap && companyListMap.length > 0) {
    return companyListMap.map(function (c, i) {
      var borderClass = '';

      if (c.name && c.name === 'unknown') {
        c.name = '(Tracker network unknown)';
      } else if (c.name && model.hasUnblockedTrackers(c, c.urlsList)) {
        var additionalText = ' associated domains';
        var domain = model.site ? model.site.domain : c.displayName;
        c.displayName = model.site.isWhitelisted ? domain + additionalText : domain + additionalText + ' (not blocked)';
        borderClass = companyListMap.length > 1 ? 'border--top padded--top' : '';
      }

      return bel(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["<li class=\"", "\">\n    <div class=\"site-info__tracker__wrapper ", " float-right\">\n        <span class=\"site-info__tracker__icon ", "\">\n        </span>\n    </div>\n    <h1 title=\"", "\" class=\"site-info__domain block\">", "</h1>\n    <ol class=\"default-list site-info__trackers__company-list__url-list\" aria-label=\"Tracker domains for ", "\">\n        ", "\n    </ol>\n</li>"])), borderClass, c.normalizedName, c.normalizedName, c.name, c.displayName, c.name, c.urlsList.map(function (url) {
        // find first matchign category from our list of allowed display categories
        var category = '';

        if (c.urls[url] && c.urls[url].categories) {
          displayCategories.some(function (displayCat) {
            var match = c.urls[url].categories.find(function (cat) {
              return cat === displayCat;
            });

            if (match) {
              category = match;
              return true;
            }

            return false;
          });
        }

        return bel(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["<li>\n                <div class=\"url\">", "</div>\n                <div class=\"category\">", "</div>\n            </li>"])), url, category);
      }));
    });
  }
}

},{"./../../../data/constants.js":9,"./shared/hero.es6.js":39,"./shared/tracker-network-icon.es6.js":45,"./shared/tracker-networks-text.es6.js":46,"bel":1}],53:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.View;

function Autocomplete(ops) {
  this.model = ops.model;
  this.pageView = ops.pageView;
  this.template = ops.template;
  Parent.call(this, ops);
  this.bindEvents([[this.store.subscribe, 'change:search', this._handleSearchText]]);
}

Autocomplete.prototype = window.$.extend({}, Parent.prototype, {
  _handleSearchText: function _handleSearchText(notification) {
    var _this = this;

    if (notification.change && notification.change.attribute === 'searchText') {
      if (!notification.change.value) {
        this.model.suggestions = [];

        this._rerender();

        return;
      }

      this.model.fetchSuggestions(notification.change.value).then(function () {
        return _this._rerender();
      });
    }
  }
});
module.exports = Autocomplete;

},{}],54:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.View;

function BreakageForm(ops) {
  this.model = ops.model;
  this.template = ops.template;
  this.siteView = ops.siteView;
  this.clickSource = ops.clickSource;
  this.$root = window.$('.js-breakage-form');
  Parent.call(this, ops);

  this._setup();
}

BreakageForm.prototype = window.$.extend({}, Parent.prototype, {
  _setup: function _setup() {
    this._cacheElems('.js-breakage-form', ['close', 'submit', 'element', 'message', 'dropdown']);

    this.bindEvents([[this.$close, 'click', this._closeForm], [this.$submit, 'click', this._submitForm], [this.$dropdown, 'change', this._selectCategory]]);
  },
  _closeForm: function _closeForm(e) {
    if (e) e.preventDefault(); // reload page after closing form if user got to form from
    // toggling privacy protection. otherwise destroy view.

    if (this.clickSource === 'toggle') {
      this.siteView.closePopupAndReload(500);
      this.destroy();
    } else {
      this.destroy();
    }
  },
  _submitForm: function _submitForm() {
    if (this.$submit.hasClass('btn-disabled')) {
      return;
    }

    var category = this.$dropdown.val();
    this.model.submitBreakageForm(category);

    this._showThankYouMessage();
  },
  _showThankYouMessage: function _showThankYouMessage() {
    this.$element.addClass('is-transparent');
    this.$message.removeClass('is-transparent'); // reload page after form submission if user got to form from
    // toggling privacy protection, otherwise destroy view.

    if (this.clickSource === 'toggle') {
      this.siteView.closePopupAndReload(3500);
    }
  },
  _selectCategory: function _selectCategory() {
    if (this.$dropdown.val()) {
      this.$submit.removeClass('btn-disabled');
      this.$submit.attr('disabled', false);
    } else if (!this.$submit.hasClass('btn-disabled')) {
      this.$submit.addClass('btn-disabled');
      this.$submit.attr('disabled', true);
    }
  }
});
module.exports = BreakageForm;

},{}],55:[function(require,module,exports){
"use strict";

var _require = require('../../background/email-utils.es6'),
    formatAddress = _require.formatAddress;

var Parent = window.DDG.base.View;

function EmailAliasView(ops) {
  var _this = this;

  this.model = ops.model;
  this.pageView = ops.pageView;
  this.template = ops.template;
  this.model.getUserData().then(function (userData) {
    _this.model.set('userData', userData);

    Parent.call(_this, ops);

    _this._setup();
  });
}

EmailAliasView.prototype = window.$.extend({}, Parent.prototype, {
  _copyAliasToClipboard: function _copyAliasToClipboard() {
    var _this2 = this;

    var alias = this.model.userData.nextAlias;
    navigator.clipboard.writeText(formatAddress(alias));
    this.$el.addClass('show-copied-label');
    this.$el.one('animationend', function () {
      _this2.$el.removeClass('show-copied-label');
    });
    this.model.fetch({
      refreshAlias: true
    }).then(function (_ref) {
      var privateAddress = _ref.privateAddress;
      _this2.model.userData.nextAlias = privateAddress;
    });
  },
  _setup: function _setup() {
    this.bindEvents([[this.$el, 'click', this._copyAliasToClipboard]]);
  }
});
module.exports = EmailAliasView;

},{"../../background/email-utils.es6":12}],56:[function(require,module,exports){
"use strict";

var Parent = require('./sliding-subview.es6.js');

var ratingHeroTemplate = require('../templates/shared/rating-hero.es6.js');

var gradesTemplate = require('../templates/shared/grade-scorecard-grades.es6.js');

var reasonsTemplate = require('../templates/shared/grade-scorecard-reasons.es6.js');

function GradeScorecard(ops) {
  this.model = ops.model;
  this.template = ops.template;
  Parent.call(this, ops);

  this._setup();

  this.bindEvents([[this.store.subscribe, 'change:site', this._onSiteChange]]);
  this.setupClose();
}

GradeScorecard.prototype = window.$.extend({}, Parent.prototype, {
  _setup: function _setup() {
    this._cacheElems('.js-grade-scorecard', ['reasons', 'grades']);

    this.$hero = this.$('.js-rating-hero');
  },
  _rerenderHero: function _rerenderHero() {
    this.$hero.replaceWith(ratingHeroTemplate(this.model, {
      showClose: true
    }));
  },
  _rerenderGrades: function _rerenderGrades() {
    this.$grades.replaceWith(gradesTemplate(this.model));
  },
  _rerenderReasons: function _rerenderReasons() {
    this.$reasons.replaceWith(reasonsTemplate(this.model));
  },
  _onSiteChange: function _onSiteChange(e) {
    if (e.change.attribute === 'siteRating') {
      this._rerenderHero();

      this._rerenderGrades();
    } // all the other stuff we use in the reasons
    // (e.g. https, tosdr)
    // doesn't change dynamically


    if (e.change.attribute === 'trackerNetworks' || e.change.attribute === 'isaMajorTrackingNetwork') {
      this._rerenderReasons();
    } // recache any selectors that were rerendered


    this._setup();

    this.setupClose();
  }
});
module.exports = GradeScorecard;

},{"../templates/shared/grade-scorecard-grades.es6.js":36,"../templates/shared/grade-scorecard-reasons.es6.js":37,"../templates/shared/rating-hero.es6.js":40,"./sliding-subview.es6.js":63}],57:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.View;

var openOptionsPage = require('./mixins/open-options-page.es6.js');

var browserUIWrapper = require('./../base/chrome-ui-wrapper.es6.js');

function HamburgerMenu(ops) {
  this.model = ops.model;
  this.template = ops.template;
  this.pageView = ops.pageView;
  Parent.call(this, ops);

  this._setup();
}

HamburgerMenu.prototype = window.$.extend({}, Parent.prototype, openOptionsPage, {
  _setup: function _setup() {
    this._cacheElems('.js-hamburger-menu', ['close', 'options-link', 'feedback-link', 'broken-site-link']);

    this.bindEvents([[this.$close, 'click', this._closeMenu], [this.$optionslink, 'click', this.openOptionsPage], [this.$feedbacklink, 'click', this._handleFeedbackClick], [this.$brokensitelink, 'click', this._handleBrokenSiteClick], [this.model.store.subscribe, 'action:search', this._handleAction], [this.model.store.subscribe, 'change:site', this._handleSiteUpdate]]);
  },
  _handleAction: function _handleAction(notification) {
    if (notification.action === 'burgerClick') this._openMenu();
  },
  _openMenu: function _openMenu(e) {
    this.$el.removeClass('is-hidden');
  },
  _closeMenu: function _closeMenu(e) {
    if (e) e.preventDefault();
    this.$el.addClass('is-hidden');
  },
  _handleFeedbackClick: function _handleFeedbackClick(e) {
    e.preventDefault();
    browserUIWrapper.openExtensionPage('/html/feedback.html');
  },
  _handleBrokenSiteClick: function _handleBrokenSiteClick(e) {
    e.preventDefault();
    this.$el.addClass('is-hidden');
    this.pageView.views.site.showBreakageForm('reportBrokenSite');
  },
  _handleSiteUpdate: function _handleSiteUpdate(notification) {
    if (notification && notification.change.attribute === 'tab') {
      this.model.tabUrl = notification.change.value.url;

      this._rerender();

      this._setup();
    }
  }
});
module.exports = HamburgerMenu;

},{"./../base/chrome-ui-wrapper.es6.js":14,"./mixins/open-options-page.es6.js":59}],58:[function(require,module,exports){
"use strict";

module.exports = {
  animateGraphBars: function animateGraphBars() {
    var self = this;
    window.setTimeout(function () {
      if (!self.$graphbarfg) return;
      self.$graphbarfg.each(function (i, el) {
        var $el = window.$(el);
        var w = $el.data().width;
        $el.css('width', w + '%');
      });
    }, 250);
    window.setTimeout(function () {
      if (!self.$pct) return;
      self.$pct.each(function (i, el) {
        var $el = window.$(el);
        $el.css('color', '#333333');
      });
    }, 700);
  }
};

},{}],59:[function(require,module,exports){
"use strict";

var browserUIWrapper = require('./../../base/chrome-ui-wrapper.es6.js');

module.exports = {
  openOptionsPage: function openOptionsPage() {
    this.model.fetch({
      getBrowser: true
    }).then(function (browser) {
      browserUIWrapper.openOptionsPage(browser);
    });
  }
};

},{"./../../base/chrome-ui-wrapper.es6.js":14}],60:[function(require,module,exports){
"use strict";

var ParentSlidingSubview = require('./sliding-subview.es6.js');

function PrivacyPractices(ops) {
  this.model = ops.model;
  this.template = ops.template;
  ParentSlidingSubview.call(this, ops);
  this.setupClose();
}

PrivacyPractices.prototype = window.$.extend({}, ParentSlidingSubview.prototype, {});
module.exports = PrivacyPractices;

},{"./sliding-subview.es6.js":63}],61:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.View;
var FOCUS_CLASS = 'go--focused';

function Search(ops) {
  var _this = this;

  this.model = ops.model;
  this.pageView = ops.pageView;
  this.template = ops.template;
  Parent.call(this, ops);

  this._cacheElems('.js-search', ['form', 'input', 'go', 'hamburger-button']);

  this.bindEvents([[this.$input, 'input', this._handleInput], [this.$input, 'blur', this._handleBlur], [this.$go, 'click', this._handleSubmit], [this.$form, 'submit', this._handleSubmit], [this.$hamburgerbutton, 'click', this._handleBurgerClick]]);
  window.setTimeout(function () {
    return _this.$input.focus();
  }, 200);
}

Search.prototype = window.$.extend({}, Parent.prototype, {
  // Hover effect on search button while typing
  _addHoverEffect: function _addHoverEffect() {
    if (!this.$go.hasClass(FOCUS_CLASS)) {
      this.$go.addClass(FOCUS_CLASS);
    }
  },
  _removeHoverEffect: function _removeHoverEffect() {
    if (this.$go.hasClass(FOCUS_CLASS)) {
      this.$go.removeClass(FOCUS_CLASS);
    }
  },
  _handleBlur: function _handleBlur(e) {
    this._removeHoverEffect();
  },
  _handleInput: function _handleInput(e) {
    var searchText = this.$input.val();
    this.model.set('searchText', searchText);

    if (searchText.length) {
      this._addHoverEffect();
    } else {
      this._removeHoverEffect();
    }
  },
  _handleSubmit: function _handleSubmit(e) {
    e.preventDefault();
    console.log("Search submit for ".concat(this.$input.val()));
    this.model.fetch({
      firePixel: 'epq'
    });
    this.model.doSearch(this.$input.val());
    window.close();
  },
  _handleBurgerClick: function _handleBurgerClick(e) {
    e.preventDefault();
    this.model.fetch({
      firePixel: 'eph'
    });
    this.model.send('burgerClick');
  }
});
module.exports = Search;

},{}],62:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.View;

var GradeScorecardView = require('./../views/grade-scorecard.es6.js');

var TrackerNetworksView = require('./../views/tracker-networks.es6.js');

var PrivacyPracticesView = require('./../views/privacy-practices.es6.js');

var BreakageFormView = require('./../views/breakage-form.es6.js');

var gradeScorecardTemplate = require('./../templates/grade-scorecard.es6.js');

var trackerNetworksTemplate = require('./../templates/tracker-networks.es6.js');

var privacyPracticesTemplate = require('./../templates/privacy-practices.es6.js');

var breakageFormTemplate = require('./../templates/breakage-form.es6.js');

var openOptionsPage = require('./mixins/open-options-page.es6.js');

var browserUIWrapper = require('./../base/chrome-ui-wrapper.es6.js');

function Site(ops) {
  var _this = this;

  this.model = ops.model;
  this.pageView = ops.pageView;
  this.template = ops.template; // cache 'body' selector

  this.$body = window.$('body'); // get data from background process, then re-render template with it

  this.model.getBackgroundTabData().then(function () {
    if (_this.model.tab && (_this.model.tab.status === 'complete' || _this.model.domain === 'new tab')) {
      // render template for the first time here
      Parent.call(_this, ops);

      _this.model.fetch({
        firePixel: 'ep'
      });

      _this._setup();
    } else {
      // the timeout helps buffer the re-render cycle during heavy
      // page loads with lots of trackers
      Parent.call(_this, ops);
      setTimeout(function () {
        return _this.rerender();
      }, 750);
    }
  });
}

Site.prototype = window.$.extend({}, Parent.prototype, openOptionsPage, {
  _onWhitelistClick: function _onWhitelistClick(e) {
    if (this.$body.hasClass('is-disabled')) return;
    this.model.toggleWhitelist();
    var whitelisted = this.model.isWhitelisted;

    this._showWhitelistedStatusMessage(!whitelisted);

    if (whitelisted) {
      this._showBreakageConfirmation();
    }
  },
  // If we just whitelisted a site, show a message briefly before reloading
  // otherwise just reload the tab and close the popup
  _showWhitelistedStatusMessage: function _showWhitelistedStatusMessage(reload) {
    var _this2 = this;

    var isTransparentClass = 'is-transparent'; // Wait for the rerendering to be done
    // 10ms timeout is the minimum to render the transition smoothly

    setTimeout(function () {
      return _this2.$whiteliststatus.removeClass(isTransparentClass);
    }, 10);
    setTimeout(function () {
      return _this2.$protection.addClass(isTransparentClass);
    }, 10);

    if (reload) {
      // Wait a bit more before closing the popup and reloading the tab
      this.closePopupAndReload(1500);
    }
  },
  // NOTE: after ._setup() is called this view listens for changes to
  // site model and re-renders every time model properties change
  _setup: function _setup() {
    // console.log('[site view] _setup()')
    this._cacheElems('.js-site', ['toggle', 'protection', 'whitelist-status', 'show-all-trackers', 'show-page-trackers', 'manage-whitelist', 'manage-whitelist-li', 'report-broken', 'privacy-practices', 'confirm-breakage-li', 'confirm-breakage', 'confirm-breakage-yes', 'confirm-breakage-no', 'confirm-breakage-message']);

    this.$gradescorecard = this.$('.js-hero-open');
    this.bindEvents([[this.$toggle, 'click', this._onWhitelistClick], [this.$showpagetrackers, 'click', this._showPageTrackers], [this.$privacypractices, 'click', this._showPrivacyPractices], [this.$confirmbreakageyes, 'click', this._onConfirmBrokenClick], [this.$confirmbreakageno, 'click', this._onConfirmNotBrokenClick], [this.$gradescorecard, 'click', this._showGradeScorecard], [this.$managewhitelist, 'click', this._onManageWhitelistClick], [this.$reportbroken, 'click', this._onReportBrokenSiteClick], [this.store.subscribe, 'change:site', this.rerender]]);
  },
  rerender: function rerender() {
    // Prevent rerenders when confirmation form is active,
    // otherwise form will disappear on rerender.
    if (this.$body.hasClass('confirmation-active')) return;

    if (this.model && this.model.disabled) {
      if (!this.$body.hasClass('is-disabled')) {
        console.log('$body.addClass() is-disabled');
        this.$body.addClass('is-disabled');

        this._rerender();

        this._setup();
      }
    } else {
      this.$body.removeClass('is-disabled');
      this.unbindEvents();

      this._rerender();

      this._setup();
    }
  },
  _onManageWhitelistClick: function _onManageWhitelistClick() {
    if (this.model && this.model.disabled) {
      return;
    }

    this.openOptionsPage();
  },
  _onReportBrokenSiteClick: function _onReportBrokenSiteClick(e) {
    e.preventDefault();

    if (this.model && this.model.disabled) {
      return;
    }

    this.showBreakageForm('reportBrokenSite');
  },
  _onConfirmBrokenClick: function _onConfirmBrokenClick() {
    var isHiddenClass = 'is-hidden';
    this.$managewhitelistli.removeClass(isHiddenClass);
    this.$confirmbreakageli.addClass(isHiddenClass);
    this.$body.removeClass('confirmation-active');
    this.showBreakageForm('toggle');
  },
  _onConfirmNotBrokenClick: function _onConfirmNotBrokenClick() {
    var isTransparentClass = 'is-transparent';
    this.$confirmbreakagemessage.removeClass(isTransparentClass);
    this.$confirmbreakage.addClass(isTransparentClass);
    this.$body.removeClass('confirmation-active');
    this.closePopupAndReload(1500);
  },
  _showBreakageConfirmation: function _showBreakageConfirmation() {
    this.$body.addClass('confirmation-active');
    this.$confirmbreakageli.removeClass('is-hidden');
    this.$managewhitelistli.addClass('is-hidden');
  },
  // pass clickSource to specify whether page should reload
  // after submitting breakage form.
  showBreakageForm: function showBreakageForm(clickSource) {
    this.views.breakageForm = new BreakageFormView({
      siteView: this,
      template: breakageFormTemplate,
      model: this.model,
      appendTo: this.$body,
      clickSource: clickSource
    });
  },
  _showPageTrackers: function _showPageTrackers(e) {
    if (this.$body.hasClass('is-disabled')) return;
    this.model.fetch({
      firePixel: 'epn'
    });
    this.views.slidingSubview = new TrackerNetworksView({
      template: trackerNetworksTemplate
    });
  },
  _showPrivacyPractices: function _showPrivacyPractices(e) {
    if (this.model.disabled) return;
    this.model.fetch({
      firePixel: 'epp'
    });
    this.views.privacyPractices = new PrivacyPracticesView({
      template: privacyPracticesTemplate,
      model: this.model
    });
  },
  _showGradeScorecard: function _showGradeScorecard(e) {
    if (this.model.disabled) return;
    this.model.fetch({
      firePixel: 'epc'
    });
    this.views.gradeScorecard = new GradeScorecardView({
      template: gradeScorecardTemplate,
      model: this.model
    });
  },
  closePopupAndReload: function closePopupAndReload(delay) {
    var _this3 = this;

    delay = delay || 0;
    setTimeout(function () {
      browserUIWrapper.reloadTab(_this3.model.tab.id);
      browserUIWrapper.closePopup();
    }, delay);
  }
});
module.exports = Site;

},{"./../base/chrome-ui-wrapper.es6.js":14,"./../templates/breakage-form.es6.js":29,"./../templates/grade-scorecard.es6.js":31,"./../templates/privacy-practices.es6.js":33,"./../templates/tracker-networks.es6.js":52,"./../views/breakage-form.es6.js":54,"./../views/grade-scorecard.es6.js":56,"./../views/privacy-practices.es6.js":60,"./../views/tracker-networks.es6.js":66,"./mixins/open-options-page.es6.js":59}],63:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.View;

function SlidingSubview(ops) {
  ops.appendTo = window.$('.sliding-subview--root');
  Parent.call(this, ops);
  this.$root = window.$('.sliding-subview--root');
  this.$root.addClass('sliding-subview--open');
  this.setupClose();
}

SlidingSubview.prototype = window.$.extend({}, Parent.prototype, {
  setupClose: function setupClose() {
    this._cacheElems('.js-sliding-subview', ['close']);

    this.bindEvents([[this.$close, 'click', this._destroy]]);
  },
  _destroy: function _destroy() {
    var _this = this;

    this.$root.removeClass('sliding-subview--open');
    window.setTimeout(function () {
      _this.destroy();
    }, 400); // 400ms = 0.35s in .sliding-subview--root transition + 50ms padding
  }
});
module.exports = SlidingSubview;

},{}],64:[function(require,module,exports){
"use strict";

var Parent = window.DDG.base.View;

var TopBlockedFullView = require('./top-blocked.es6.js');

var topBlockedFullTemplate = require('./../templates/top-blocked.es6.js');

var TOP_BLOCKED_CLASS = 'has-top-blocked--truncated';

function TruncatedTopBlocked(ops) {
  var _this = this;

  this.model = ops.model;
  this.pageView = ops.pageView;
  this.template = ops.template;
  this.model.getTopBlocked().then(function () {
    Parent.call(_this, ops);

    _this._setup();
  });
  this.bindEvents([[this.model.store.subscribe, 'action:backgroundMessage', this.handleBackgroundMsg]]);
}

TruncatedTopBlocked.prototype = window.$.extend({}, Parent.prototype, {
  _seeAllClick: function _seeAllClick() {
    this.model.fetch({
      firePixel: 'eps'
    });
    this.views.slidingSubview = new TopBlockedFullView({
      template: topBlockedFullTemplate,
      numItems: 10
    });
  },
  _setup: function _setup() {
    this._cacheElems('.js-top-blocked', ['graph-bar-fg', 'pct', 'see-all']);

    this.bindEvents([[this.$seeall, 'click', this._seeAllClick]]);

    if (window.$('.top-blocked--truncated').length) {
      window.$('html').addClass(TOP_BLOCKED_CLASS);
    }
  },
  rerenderList: function rerenderList() {
    this._rerender();

    this._setup();
  },
  handleBackgroundMsg: function handleBackgroundMsg(message) {
    var _this2 = this;

    if (!message || !message.action) return;

    if (message.action === 'didResetTrackersData') {
      this.model.reset();
      setTimeout(function () {
        return _this2.rerenderList();
      }, 750);
      this.rerenderList();
      window.$('html').removeClass(TOP_BLOCKED_CLASS);
    }
  }
});
module.exports = TruncatedTopBlocked;

},{"./../templates/top-blocked.es6.js":51,"./top-blocked.es6.js":65}],65:[function(require,module,exports){
"use strict";

var ParentSlidingSubview = require('./sliding-subview.es6.js');

var animateGraphBars = require('./mixins/animate-graph-bars.es6.js');

var TopBlockedModel = require('./../models/top-blocked.es6.js');

function TopBlocked(ops) {
  // model data is async
  this.model = null;
  this.numItems = ops.numItems;
  this.template = ops.template;
  ParentSlidingSubview.call(this, ops);
  this.setupClose();
  this.renderAsyncContent();
  this.bindEvents([[this.model.store.subscribe, 'action:backgroundMessage', this.handleBackgroundMsg]]);
}

TopBlocked.prototype = window.$.extend({}, ParentSlidingSubview.prototype, animateGraphBars, {
  setup: function setup() {
    this.$content = this.$el.find('.js-top-blocked-content'); // listener for reset stats click

    this.$reset = this.$el.find('.js-reset-trackers-data');
    this.bindEvents([[this.$reset, 'click', this.resetTrackersStats]]);
  },
  renderAsyncContent: function renderAsyncContent() {
    var _this = this;

    var random = Math.round(Math.random() * 100000);
    this.model = new TopBlockedModel({
      modelName: 'topBlocked' + random,
      numCompanies: this.numItems
    });
    this.model.getTopBlocked().then(function () {
      var content = _this.template();

      _this.$el.append(content);

      _this.setup(); // animate graph bars and pct


      _this.$graphbarfg = _this.$el.find('.js-top-blocked-graph-bar-fg');
      _this.$pct = _this.$el.find('.js-top-blocked-pct');

      _this.animateGraphBars();
    });
  },
  resetTrackersStats: function resetTrackersStats(e) {
    if (e) e.preventDefault();
    this.model.fetch({
      resetTrackersData: true
    });
  },
  handleBackgroundMsg: function handleBackgroundMsg(message) {
    if (!message || !message.action) return;

    if (message.action === 'didResetTrackersData') {
      this.model.reset(message.data);
      var content = this.template();
      this.$content.replaceWith(content);
    }
  }
});
module.exports = TopBlocked;

},{"./../models/top-blocked.es6.js":23,"./mixins/animate-graph-bars.es6.js":58,"./sliding-subview.es6.js":63}],66:[function(require,module,exports){
"use strict";

var ParentSlidingSubview = require('./sliding-subview.es6.js');

var heroTemplate = require('./../templates/shared/hero.es6.js');

var CompanyListModel = require('./../models/site-company-list.es6.js');

var SiteModel = require('./../models/site.es6.js');

var trackerNetworksIconTemplate = require('./../templates/shared/tracker-network-icon.es6.js');

var trackerNetworksTextTemplate = require('./../templates/shared/tracker-networks-text.es6.js');

function TrackerNetworks(ops) {
  var _this = this;

  // model data is async
  this.model = null;
  this.currentModelName = null;
  this.currentSiteModelName = null;
  this.template = ops.template;
  ParentSlidingSubview.call(this, ops);
  setTimeout(function () {
    return _this._rerender();
  }, 750);
  this.renderAsyncContent();
}

TrackerNetworks.prototype = window.$.extend({}, ParentSlidingSubview.prototype, {
  setup: function setup() {
    this._cacheElems('.js-tracker-networks', ['hero', 'details']); // site rating arrives async


    this.bindEvents([[this.store.subscribe, "change:".concat(this.currentSiteModelName), this._rerender]]);
  },
  renderAsyncContent: function renderAsyncContent() {
    var _this2 = this;

    var random = Math.round(Math.random() * 100000);
    this.currentModelName = 'siteCompanyList' + random;
    this.currentSiteModelName = 'site' + random;
    this.model = new CompanyListModel({
      modelName: this.currentModelName
    });
    this.model.fetchAsyncData().then(function () {
      _this2.model.site = new SiteModel({
        modelName: _this2.currentSiteModelName
      });

      _this2.model.site.getBackgroundTabData().then(function () {
        var content = _this2.template();

        _this2.$el.append(content);

        _this2.setup();

        _this2.setupClose();
      });
    });
  },
  _renderHeroTemplate: function _renderHeroTemplate() {
    if (this.model.site) {
      var trackerNetworksIconName = trackerNetworksIconTemplate(this.model.site.siteRating, this.model.site.isWhitelisted, this.model.site.totalTrackerNetworksCount);
      var trackerNetworksText = trackerNetworksTextTemplate(this.model.site, false);
      this.$hero.html(heroTemplate({
        status: trackerNetworksIconName,
        title: this.model.site.domain,
        subtitle: trackerNetworksText,
        showClose: true
      }));
    }
  },
  _rerender: function _rerender(e) {
    if (e && e.change) {
      if (e.change.attribute === 'isaMajorTrackingNetwork' || e.change.attribute === 'isWhitelisted' || e.change.attribute === 'totalTrackerNetworksCount' || e.change.attribute === 'siteRating') {
        this._renderHeroTemplate();

        this.unbindEvents();
        this.setup();
        this.setupClose();
      }
    }
  }
});
module.exports = TrackerNetworks;

},{"./../models/site-company-list.es6.js":21,"./../models/site.es6.js":22,"./../templates/shared/hero.es6.js":39,"./../templates/shared/tracker-network-icon.es6.js":45,"./../templates/shared/tracker-networks-text.es6.js":46,"./sliding-subview.es6.js":63}]},{},[27]);
