'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.1.0 (2019-10-17)
 */
(function (domGlobals) {
  'use strict';

  var Cell = function Cell(initial) {
    var value = initial;
    var get = function get() {
      return value;
    };
    var set = function set(v) {
      value = v;
    };
    var clone = function clone() {
      return Cell(get());
    };
    return {
      get: get,
      set: set,
      clone: clone
    };
  };

  var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var get = function get(fullscreenState) {
    return {
      isFullscreen: function isFullscreen() {
        return fullscreenState.get() !== null;
      }
    };
  };
  var Api = { get: get };

  var noop = function noop() {};
  var constant = function constant(value) {
    return function () {
      return value;
    };
  };
  var never = constant(false);
  var always = constant(true);

  var none = function none() {
    return NONE;
  };
  var NONE = function () {
    var eq = function eq(o) {
      return o.isNone();
    };
    var call = function call(thunk) {
      return thunk();
    };
    var id = function id(n) {
      return n;
    };
    var me = {
      fold: function fold(n, s) {
        return n();
      },
      is: never,
      isSome: never,
      isNone: always,
      getOr: id,
      getOrThunk: call,
      getOrDie: function getOrDie(msg) {
        throw new Error(msg || 'error: getOrDie called on none.');
      },
      getOrNull: constant(null),
      getOrUndefined: constant(undefined),
      or: id,
      orThunk: call,
      map: none,
      each: noop,
      bind: none,
      exists: never,
      forall: always,
      filter: none,
      equals: eq,
      equals_: eq,
      toArray: function toArray() {
        return [];
      },
      toString: constant('none()')
    };
    if (Object.freeze) {
      Object.freeze(me);
    }
    return me;
  }();
  var some = function some(a) {
    var constant_a = constant(a);
    var self = function self() {
      return me;
    };
    var bind = function bind(f) {
      return f(a);
    };
    var me = {
      fold: function fold(n, s) {
        return s(a);
      },
      is: function is(v) {
        return a === v;
      },
      isSome: always,
      isNone: never,
      getOr: constant_a,
      getOrThunk: constant_a,
      getOrDie: constant_a,
      getOrNull: constant_a,
      getOrUndefined: constant_a,
      or: self,
      orThunk: self,
      map: function map(f) {
        return some(f(a));
      },
      each: function each(f) {
        f(a);
      },
      bind: bind,
      exists: bind,
      forall: bind,
      filter: function filter(f) {
        return f(a) ? me : NONE;
      },
      toArray: function toArray() {
        return [a];
      },
      toString: function toString() {
        return 'some(' + a + ')';
      },
      equals: function equals(o) {
        return o.is(a);
      },
      equals_: function equals_(o, elementEq) {
        return o.fold(never, function (b) {
          return elementEq(a, b);
        });
      }
    };
    return me;
  };
  var from = function from(value) {
    return value === null || value === undefined ? NONE : some(value);
  };
  var Option = {
    some: some,
    none: none,
    from: from
  };

  var value = function value() {
    var subject = Cell(Option.none());
    var clear = function clear() {
      subject.set(Option.none());
    };
    var set = function set(s) {
      subject.set(Option.some(s));
    };
    var on = function on(f) {
      subject.get().each(f);
    };
    var isSet = function isSet() {
      return subject.get().isSome();
    };
    return {
      clear: clear,
      set: set,
      isSet: isSet,
      on: on
    };
  };

  var typeOf = function typeOf(x) {
    if (x === null) {
      return 'null';
    }
    var t = typeof x === 'undefined' ? 'undefined' : _typeof(x);
    if (t === 'object' && (Array.prototype.isPrototypeOf(x) || x.constructor && x.constructor.name === 'Array')) {
      return 'array';
    }
    if (t === 'object' && (String.prototype.isPrototypeOf(x) || x.constructor && x.constructor.name === 'String')) {
      return 'string';
    }
    return t;
  };
  var isType = function isType(type) {
    return function (value) {
      return typeOf(value) === type;
    };
  };
  var isString = isType('string');
  var isArray = isType('array');
  var isBoolean = isType('boolean');
  var isFunction = isType('function');
  var isNumber = isType('number');

  var nativeSlice = Array.prototype.slice;
  var nativePush = Array.prototype.push;
  var map = function map(xs, f) {
    var len = xs.length;
    var r = new Array(len);
    for (var i = 0; i < len; i++) {
      var x = xs[i];
      r[i] = f(x, i);
    }
    return r;
  };
  var each = function each(xs, f) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      f(x, i);
    }
  };
  var filter = function filter(xs, pred) {
    var r = [];
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i)) {
        r.push(x);
      }
    }
    return r;
  };
  var find = function find(xs, pred) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i)) {
        return Option.some(x);
      }
    }
    return Option.none();
  };
  var flatten = function flatten(xs) {
    var r = [];
    for (var i = 0, len = xs.length; i < len; ++i) {
      if (!isArray(xs[i])) {
        throw new Error('Arr.flatten item ' + i + ' was not an array, input: ' + xs);
      }
      nativePush.apply(r, xs[i]);
    }
    return r;
  };
  var bind = function bind(xs, f) {
    var output = map(xs, f);
    return flatten(output);
  };
  var from$1 = isFunction(Array.from) ? Array.from : function (x) {
    return nativeSlice.call(x);
  };

  var keys = Object.keys;
  var each$1 = function each$1(obj, f) {
    var props = keys(obj);
    for (var k = 0, len = props.length; k < len; k++) {
      var i = props[k];
      var x = obj[i];
      f(x, i);
    }
  };

  var contains = function contains(str, substr) {
    return str.indexOf(substr) !== -1;
  };

  var isSupported = function isSupported(dom) {
    return dom.style !== undefined && isFunction(dom.style.getPropertyValue);
  };

  var fromHtml = function fromHtml(html, scope) {
    var doc = scope || domGlobals.document;
    var div = doc.createElement('div');
    div.innerHTML = html;
    if (!div.hasChildNodes() || div.childNodes.length > 1) {
      domGlobals.console.error('HTML does not have a single root node', html);
      throw new Error('HTML must have a single root node');
    }
    return fromDom(div.childNodes[0]);
  };
  var fromTag = function fromTag(tag, scope) {
    var doc = scope || domGlobals.document;
    var node = doc.createElement(tag);
    return fromDom(node);
  };
  var fromText = function fromText(text, scope) {
    var doc = scope || domGlobals.document;
    var node = doc.createTextNode(text);
    return fromDom(node);
  };
  var fromDom = function fromDom(node) {
    if (node === null || node === undefined) {
      throw new Error('Node cannot be null or undefined');
    }
    return { dom: constant(node) };
  };
  var fromPoint = function fromPoint(docElm, x, y) {
    var doc = docElm.dom();
    return Option.from(doc.elementFromPoint(x, y)).map(fromDom);
  };
  var Element = {
    fromHtml: fromHtml,
    fromTag: fromTag,
    fromText: fromText,
    fromDom: fromDom,
    fromPoint: fromPoint
  };

  var ATTRIBUTE = domGlobals.Node.ATTRIBUTE_NODE;
  var CDATA_SECTION = domGlobals.Node.CDATA_SECTION_NODE;
  var COMMENT = domGlobals.Node.COMMENT_NODE;
  var DOCUMENT = domGlobals.Node.DOCUMENT_NODE;
  var DOCUMENT_TYPE = domGlobals.Node.DOCUMENT_TYPE_NODE;
  var DOCUMENT_FRAGMENT = domGlobals.Node.DOCUMENT_FRAGMENT_NODE;
  var ELEMENT = domGlobals.Node.ELEMENT_NODE;
  var TEXT = domGlobals.Node.TEXT_NODE;
  var PROCESSING_INSTRUCTION = domGlobals.Node.PROCESSING_INSTRUCTION_NODE;
  var ENTITY_REFERENCE = domGlobals.Node.ENTITY_REFERENCE_NODE;
  var ENTITY = domGlobals.Node.ENTITY_NODE;
  var NOTATION = domGlobals.Node.NOTATION_NODE;

  var Global = typeof domGlobals.window !== 'undefined' ? domGlobals.window : Function('return this;')();

  var type = function type(element) {
    return element.dom().nodeType;
  };
  var isType$1 = function isType$1(t) {
    return function (element) {
      return type(element) === t;
    };
  };
  var isText = isType$1(TEXT);

  var inBody = function inBody(element) {
    var dom = isText(element) ? element.dom().parentNode : element.dom();
    return dom !== undefined && dom !== null && dom.ownerDocument.body.contains(dom);
  };

  var rawSet = function rawSet(dom, key, value) {
    if (isString(value) || isBoolean(value) || isNumber(value)) {
      dom.setAttribute(key, value + '');
    } else {
      domGlobals.console.error('Invalid call to Attr.set. Key ', key, ':: Value ', value, ':: Element ', dom);
      throw new Error('Attribute value was not simple');
    }
  };
  var set = function set(element, key, value) {
    rawSet(element.dom(), key, value);
  };
  var get$1 = function get$1(element, key) {
    var v = element.dom().getAttribute(key);
    return v === null ? undefined : v;
  };
  var remove = function remove(element, key) {
    element.dom().removeAttribute(key);
  };

  var internalSet = function internalSet(dom, property, value) {
    if (!isString(value)) {
      domGlobals.console.error('Invalid call to CSS.set. Property ', property, ':: Value ', value, ':: Element ', dom);
      throw new Error('CSS value must be a string: ' + value);
    }
    if (isSupported(dom)) {
      dom.style.setProperty(property, value);
    }
  };
  var setAll = function setAll(element, css) {
    var dom = element.dom();
    each$1(css, function (v, k) {
      internalSet(dom, k, v);
    });
  };
  var get$2 = function get$2(element, property) {
    var dom = element.dom();
    var styles = domGlobals.window.getComputedStyle(dom);
    var r = styles.getPropertyValue(property);
    var v = r === '' && !inBody(element) ? getUnsafeProperty(dom, property) : r;
    return v === null ? undefined : v;
  };
  var getUnsafeProperty = function getUnsafeProperty(dom, property) {
    return isSupported(dom) ? dom.style.getPropertyValue(property) : '';
  };

  var firstMatch = function firstMatch(regexes, s) {
    for (var i = 0; i < regexes.length; i++) {
      var x = regexes[i];
      if (x.test(s)) {
        return x;
      }
    }
    return undefined;
  };
  var find$1 = function find$1(regexes, agent) {
    var r = firstMatch(regexes, agent);
    if (!r) {
      return {
        major: 0,
        minor: 0
      };
    }
    var group = function group(i) {
      return Number(agent.replace(r, '$' + i));
    };
    return nu(group(1), group(2));
  };
  var detect = function detect(versionRegexes, agent) {
    var cleanedAgent = String(agent).toLowerCase();
    if (versionRegexes.length === 0) {
      return unknown();
    }
    return find$1(versionRegexes, cleanedAgent);
  };
  var unknown = function unknown() {
    return nu(0, 0);
  };
  var nu = function nu(major, minor) {
    return {
      major: major,
      minor: minor
    };
  };
  var Version = {
    nu: nu,
    detect: detect,
    unknown: unknown
  };

  var edge = 'Edge';
  var chrome = 'Chrome';
  var ie = 'IE';
  var opera = 'Opera';
  var firefox = 'Firefox';
  var safari = 'Safari';
  var isBrowser = function isBrowser(name, current) {
    return function () {
      return current === name;
    };
  };
  var unknown$1 = function unknown$1() {
    return nu$1({
      current: undefined,
      version: Version.unknown()
    });
  };
  var nu$1 = function nu$1(info) {
    var current = info.current;
    var version = info.version;
    return {
      current: current,
      version: version,
      isEdge: isBrowser(edge, current),
      isChrome: isBrowser(chrome, current),
      isIE: isBrowser(ie, current),
      isOpera: isBrowser(opera, current),
      isFirefox: isBrowser(firefox, current),
      isSafari: isBrowser(safari, current)
    };
  };
  var Browser = {
    unknown: unknown$1,
    nu: nu$1,
    edge: constant(edge),
    chrome: constant(chrome),
    ie: constant(ie),
    opera: constant(opera),
    firefox: constant(firefox),
    safari: constant(safari)
  };

  var windows = 'Windows';
  var ios = 'iOS';
  var android = 'Android';
  var linux = 'Linux';
  var osx = 'OSX';
  var solaris = 'Solaris';
  var freebsd = 'FreeBSD';
  var isOS = function isOS(name, current) {
    return function () {
      return current === name;
    };
  };
  var unknown$2 = function unknown$2() {
    return nu$2({
      current: undefined,
      version: Version.unknown()
    });
  };
  var nu$2 = function nu$2(info) {
    var current = info.current;
    var version = info.version;
    return {
      current: current,
      version: version,
      isWindows: isOS(windows, current),
      isiOS: isOS(ios, current),
      isAndroid: isOS(android, current),
      isOSX: isOS(osx, current),
      isLinux: isOS(linux, current),
      isSolaris: isOS(solaris, current),
      isFreeBSD: isOS(freebsd, current)
    };
  };
  var OperatingSystem = {
    unknown: unknown$2,
    nu: nu$2,
    windows: constant(windows),
    ios: constant(ios),
    android: constant(android),
    linux: constant(linux),
    osx: constant(osx),
    solaris: constant(solaris),
    freebsd: constant(freebsd)
  };

  var DeviceType = function DeviceType(os, browser, userAgent, mediaMatch) {
    var isiPad = os.isiOS() && /ipad/i.test(userAgent) === true;
    var isiPhone = os.isiOS() && !isiPad;
    var isMobile = os.isiOS() || os.isAndroid();
    var isTouch = isMobile || mediaMatch('(pointer:coarse)');
    var isTablet = isiPad || !isiPhone && isMobile && mediaMatch('(min-device-width:768px)');
    var isPhone = isiPhone || isMobile && !isTablet;
    var iOSwebview = browser.isSafari() && os.isiOS() && /safari/i.test(userAgent) === false;
    var isDesktop = !isPhone && !isTablet && !iOSwebview;
    return {
      isiPad: constant(isiPad),
      isiPhone: constant(isiPhone),
      isTablet: constant(isTablet),
      isPhone: constant(isPhone),
      isTouch: constant(isTouch),
      isAndroid: os.isAndroid,
      isiOS: os.isiOS,
      isWebView: constant(iOSwebview),
      isDesktop: constant(isDesktop)
    };
  };

  var detect$1 = function detect$1(candidates, userAgent) {
    var agent = String(userAgent).toLowerCase();
    return find(candidates, function (candidate) {
      return candidate.search(agent);
    });
  };
  var detectBrowser = function detectBrowser(browsers, userAgent) {
    return detect$1(browsers, userAgent).map(function (browser) {
      var version = Version.detect(browser.versionRegexes, userAgent);
      return {
        current: browser.name,
        version: version
      };
    });
  };
  var detectOs = function detectOs(oses, userAgent) {
    return detect$1(oses, userAgent).map(function (os) {
      var version = Version.detect(os.versionRegexes, userAgent);
      return {
        current: os.name,
        version: version
      };
    });
  };
  var UaString = {
    detectBrowser: detectBrowser,
    detectOs: detectOs
  };

  var normalVersionRegex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/;
  var checkContains = function checkContains(target) {
    return function (uastring) {
      return contains(uastring, target);
    };
  };
  var browsers = [{
    name: 'Edge',
    versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
    search: function search(uastring) {
      return contains(uastring, 'edge/') && contains(uastring, 'chrome') && contains(uastring, 'safari') && contains(uastring, 'applewebkit');
    }
  }, {
    name: 'Chrome',
    versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/, normalVersionRegex],
    search: function search(uastring) {
      return contains(uastring, 'chrome') && !contains(uastring, 'chromeframe');
    }
  }, {
    name: 'IE',
    versionRegexes: [/.*?msie\ ?([0-9]+)\.([0-9]+).*/, /.*?rv:([0-9]+)\.([0-9]+).*/],
    search: function search(uastring) {
      return contains(uastring, 'msie') || contains(uastring, 'trident');
    }
  }, {
    name: 'Opera',
    versionRegexes: [normalVersionRegex, /.*?opera\/([0-9]+)\.([0-9]+).*/],
    search: checkContains('opera')
  }, {
    name: 'Firefox',
    versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
    search: checkContains('firefox')
  }, {
    name: 'Safari',
    versionRegexes: [normalVersionRegex, /.*?cpu os ([0-9]+)_([0-9]+).*/],
    search: function search(uastring) {
      return (contains(uastring, 'safari') || contains(uastring, 'mobile/')) && contains(uastring, 'applewebkit');
    }
  }];
  var oses = [{
    name: 'Windows',
    search: checkContains('win'),
    versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]
  }, {
    name: 'iOS',
    search: function search(uastring) {
      return contains(uastring, 'iphone') || contains(uastring, 'ipad');
    },
    versionRegexes: [/.*?version\/\ ?([0-9]+)\.([0-9]+).*/, /.*cpu os ([0-9]+)_([0-9]+).*/, /.*cpu iphone os ([0-9]+)_([0-9]+).*/]
  }, {
    name: 'Android',
    search: checkContains('android'),
    versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/]
  }, {
    name: 'OSX',
    search: checkContains('os x'),
    versionRegexes: [/.*?os\ x\ ?([0-9]+)_([0-9]+).*/]
  }, {
    name: 'Linux',
    search: checkContains('linux'),
    versionRegexes: []
  }, {
    name: 'Solaris',
    search: checkContains('sunos'),
    versionRegexes: []
  }, {
    name: 'FreeBSD',
    search: checkContains('freebsd'),
    versionRegexes: []
  }];
  var PlatformInfo = {
    browsers: constant(browsers),
    oses: constant(oses)
  };

  var detect$2 = function detect$2(userAgent, mediaMatch) {
    var browsers = PlatformInfo.browsers();
    var oses = PlatformInfo.oses();
    var browser = UaString.detectBrowser(browsers, userAgent).fold(Browser.unknown, Browser.nu);
    var os = UaString.detectOs(oses, userAgent).fold(OperatingSystem.unknown, OperatingSystem.nu);
    var deviceType = DeviceType(os, browser, userAgent, mediaMatch);
    return {
      browser: browser,
      os: os,
      deviceType: deviceType
    };
  };
  var PlatformDetection = { detect: detect$2 };

  var mediaMatch = function mediaMatch(query) {
    return domGlobals.window.matchMedia(query).matches;
  };
  var platform = Cell(PlatformDetection.detect(domGlobals.navigator.userAgent, mediaMatch));
  var detect$3 = function detect$3() {
    return platform.get();
  };

  var Immutable = function Immutable() {
    var fields = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      fields[_i] = arguments[_i];
    }
    return function () {
      var values = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
      }
      if (fields.length !== values.length) {
        throw new Error('Wrong number of arguments to struct. Expected "[' + fields.length + ']", got ' + values.length + ' arguments');
      }
      var struct = {};
      each(fields, function (name, i) {
        struct[name] = constant(values[i]);
      });
      return struct;
    };
  };

  var compareDocumentPosition = function compareDocumentPosition(a, b, match) {
    return (a.compareDocumentPosition(b) & match) !== 0;
  };
  var documentPositionPreceding = function documentPositionPreceding(a, b) {
    return compareDocumentPosition(a, b, domGlobals.Node.DOCUMENT_POSITION_PRECEDING);
  };
  var documentPositionContainedBy = function documentPositionContainedBy(a, b) {
    return compareDocumentPosition(a, b, domGlobals.Node.DOCUMENT_POSITION_CONTAINED_BY);
  };
  var Node = {
    documentPositionPreceding: documentPositionPreceding,
    documentPositionContainedBy: documentPositionContainedBy
  };

  var ELEMENT$1 = ELEMENT;
  var DOCUMENT$1 = DOCUMENT;
  var is = function is(element, selector) {
    var dom = element.dom();
    if (dom.nodeType !== ELEMENT$1) {
      return false;
    } else {
      var elem = dom;
      if (elem.matches !== undefined) {
        return elem.matches(selector);
      } else if (elem.msMatchesSelector !== undefined) {
        return elem.msMatchesSelector(selector);
      } else if (elem.webkitMatchesSelector !== undefined) {
        return elem.webkitMatchesSelector(selector);
      } else if (elem.mozMatchesSelector !== undefined) {
        return elem.mozMatchesSelector(selector);
      } else {
        throw new Error('Browser lacks native selectors');
      }
    }
  };
  var bypassSelector = function bypassSelector(dom) {
    return dom.nodeType !== ELEMENT$1 && dom.nodeType !== DOCUMENT$1 || dom.childElementCount === 0;
  };
  var all = function all(selector, scope) {
    var base = scope === undefined ? domGlobals.document : scope.dom();
    return bypassSelector(base) ? [] : map(base.querySelectorAll(selector), Element.fromDom);
  };

  var eq = function eq(e1, e2) {
    return e1.dom() === e2.dom();
  };
  var regularContains = function regularContains(e1, e2) {
    var d1 = e1.dom();
    var d2 = e2.dom();
    return d1 === d2 ? false : d1.contains(d2);
  };
  var ieContains = function ieContains(e1, e2) {
    return Node.documentPositionContainedBy(e1.dom(), e2.dom());
  };
  var browser = detect$3().browser;
  var contains$1 = browser.isIE() ? ieContains : regularContains;

  var parent = function parent(element) {
    return Option.from(element.dom().parentNode).map(Element.fromDom);
  };
  var parents = function parents(element, isRoot) {
    var stop = isFunction(isRoot) ? isRoot : never;
    var dom = element.dom();
    var ret = [];
    while (dom.parentNode !== null && dom.parentNode !== undefined) {
      var rawParent = dom.parentNode;
      var p = Element.fromDom(rawParent);
      ret.push(p);
      if (stop(p) === true) {
        break;
      } else {
        dom = rawParent;
      }
    }
    return ret;
  };
  var siblings = function siblings(element) {
    var filterSelf = function filterSelf(elements) {
      return filter(elements, function (x) {
        return !eq(element, x);
      });
    };
    return parent(element).map(children).map(filterSelf).getOr([]);
  };
  var children = function children(element) {
    return map(element.dom().childNodes, Element.fromDom);
  };
  var spot = Immutable('element', 'offset');

  var r = function r(left, top) {
    var translate = function translate(x, y) {
      return r(left + x, top + y);
    };
    return {
      left: constant(left),
      top: constant(top),
      translate: translate
    };
  };
  var Position = r;

  var isSafari = detect$3().browser.isSafari();
  var get$3 = function get$3(_DOC) {
    var doc = _DOC !== undefined ? _DOC.dom() : domGlobals.document;
    var x = doc.body.scrollLeft || doc.documentElement.scrollLeft;
    var y = doc.body.scrollTop || doc.documentElement.scrollTop;
    return Position(x, y);
  };

  var bounds = function bounds(x, y, width, height) {
    return {
      x: constant(x),
      y: constant(y),
      width: constant(width),
      height: constant(height),
      right: constant(x + width),
      bottom: constant(y + height)
    };
  };
  var getBounds = function getBounds(_win) {
    var win = _win === undefined ? domGlobals.window : _win;
    var visualViewport = win['visualViewport'];
    if (visualViewport !== undefined) {
      return bounds(visualViewport.pageLeft, visualViewport.pageTop, visualViewport.width, visualViewport.height);
    } else {
      var doc = Element.fromDom(win.document);
      var html = win.document.documentElement;
      var scroll = get$3(doc);
      var width = html.clientWidth;
      var height = html.clientHeight;
      return bounds(scroll.left(), scroll.top(), width, height);
    }
  };

  var fireFullscreenStateChanged = function fireFullscreenStateChanged(editor, state) {
    editor.fire('FullscreenStateChanged', { state: state });
  };
  var Events = { fireFullscreenStateChanged: fireFullscreenStateChanged };

  var global$1 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

  var global$2 = tinymce.util.Tools.resolve('tinymce.Env');

  var global$3 = tinymce.util.Tools.resolve('tinymce.util.Delay');

  var ancestors = function ancestors(scope, predicate, isRoot) {
    return filter(parents(scope, isRoot), predicate);
  };
  var siblings$1 = function siblings$1(scope, predicate) {
    return filter(siblings(scope), predicate);
  };

  var all$1 = function all$1(selector) {
    return all(selector);
  };
  var ancestors$1 = function ancestors$1(scope, selector, isRoot) {
    return ancestors(scope, function (e) {
      return is(e, selector);
    }, isRoot);
  };
  var siblings$2 = function siblings$2(scope, selector) {
    return siblings$1(scope, function (e) {
      return is(e, selector);
    });
  };

  var attr = 'data-ephox-mobile-fullscreen-style';
  var siblingStyles = 'display:none!important;';
  var ancestorPosition = 'position:absolute!important;';
  var ancestorStyles = 'top:0!important;left:0!important;margin:0!important;padding:0!important;width:100%!important;height:100%!important;overflow:visible!important;';
  var bgFallback = 'background-color:rgb(255,255,255)!important;';
  var isAndroid = global$2.os.isAndroid();
  var matchColor = function matchColor(editorBody) {
    var color = get$2(editorBody, 'background-color');
    return color !== undefined && color !== '' ? 'background-color:' + color + '!important' : bgFallback;
  };
  var clobberStyles = function clobberStyles(container, editorBody) {
    var gatherSibilings = function gatherSibilings(element) {
      var siblings = siblings$2(element, '*:not(.tox-silver-sink)');
      return siblings;
    };
    var clobber = function clobber(clobberStyle) {
      return function (element) {
        var styles = get$1(element, 'style');
        var backup = styles === undefined ? 'no-styles' : styles.trim();
        if (backup === clobberStyle) {
          return;
        } else {
          set(element, attr, backup);
          set(element, 'style', clobberStyle);
        }
      };
    };
    var ancestors = ancestors$1(container, '*');
    var siblings = bind(ancestors, gatherSibilings);
    var bgColor = matchColor(editorBody);
    each(siblings, clobber(siblingStyles));
    each(ancestors, clobber(ancestorPosition + ancestorStyles + bgColor));
    var containerStyles = isAndroid === true ? '' : ancestorPosition;
    clobber(containerStyles + ancestorStyles + bgColor)(container);
  };
  var restoreStyles = function restoreStyles() {
    var clobberedEls = all$1('[' + attr + ']');
    each(clobberedEls, function (element) {
      var restore = get$1(element, attr);
      if (restore !== 'no-styles') {
        set(element, 'style', restore);
      } else {
        remove(element, 'style');
      }
      remove(element, attr);
    });
  };
  var Thor = {
    clobberStyles: clobberStyles,
    restoreStyles: restoreStyles
  };

  var DOM = global$1.DOM;
  var getScrollPos = function getScrollPos() {
    var vp = getBounds(domGlobals.window);
    return {
      x: vp.x(),
      y: vp.y()
    };
  };
  var setScrollPos = function setScrollPos(pos) {
    domGlobals.window.scrollTo(pos.x, pos.y);
  };
  var visualViewport = domGlobals.window['visualViewport'];
  var isSafari$1 = global$2.browser.isSafari();
  var viewportUpdate = !isSafari$1 || visualViewport === undefined ? {
    bind: noop,
    unbind: noop,
    update: noop
  } : function () {
    var editorContainer = value();
    var refreshScroll = function refreshScroll() {
      domGlobals.document.body.scrollTop = 0;
      domGlobals.document.documentElement.scrollTop = 0;
    };
    var refreshVisualViewport = function refreshVisualViewport() {
      domGlobals.window.requestAnimationFrame(function () {
        editorContainer.on(function (container) {
          return setAll(container, {
            top: visualViewport.offsetTop + 'px',
            left: visualViewport.offsetLeft + 'px',
            height: visualViewport.height + 'px',
            width: visualViewport.width + 'px'
          });
        });
      });
    };
    var update = global$3.throttle(function () {
      refreshScroll();
      refreshVisualViewport();
    }, 50);
    var bind = function bind(element) {
      editorContainer.set(element);
      update();
      visualViewport.addEventListener('resize', update);
      visualViewport.addEventListener('scroll', update);
    };
    var unbind = function unbind() {
      editorContainer.on(function () {
        visualViewport.removeEventListener('scroll', update);
        visualViewport.removeEventListener('resize', update);
      });
      editorContainer.clear();
    };
    return {
      bind: bind,
      unbind: unbind
    };
  }();
  var toggleFullscreen = function toggleFullscreen(editor, fullscreenState) {
    var body = domGlobals.document.body;
    var documentElement = domGlobals.document.documentElement;
    var editorContainerStyle;
    var editorContainer, iframe, iframeStyle;
    editorContainer = editor.getContainer();
    var editorContainerS = Element.fromDom(editorContainer);
    var fullscreenInfo = fullscreenState.get();
    var editorBody = Element.fromDom(editor.getBody());
    var isTouch = global$2.deviceType.isTouch();
    editorContainerStyle = editorContainer.style;
    iframe = editor.getContentAreaContainer().firstChild;
    iframeStyle = iframe.style;
    if (!fullscreenInfo) {
      var newFullScreenInfo = {
        scrollPos: getScrollPos(),
        containerWidth: editorContainerStyle.width,
        containerHeight: editorContainerStyle.height,
        containerTop: editorContainerStyle.top,
        containerLeft: editorContainerStyle.left,
        iframeWidth: iframeStyle.width,
        iframeHeight: iframeStyle.height
      };
      if (isTouch) {
        Thor.clobberStyles(editorContainerS, editorBody);
      }
      iframeStyle.width = iframeStyle.height = '100%';
      editorContainerStyle.width = editorContainerStyle.height = '';
      DOM.addClass(body, 'tox-fullscreen');
      DOM.addClass(documentElement, 'tox-fullscreen');
      DOM.addClass(editorContainer, 'tox-fullscreen');
      viewportUpdate.bind(editorContainerS);
      editor.on('remove', viewportUpdate.unbind);
      fullscreenState.set(newFullScreenInfo);
      Events.fireFullscreenStateChanged(editor, true);
    } else {
      iframeStyle.width = fullscreenInfo.iframeWidth;
      iframeStyle.height = fullscreenInfo.iframeHeight;
      editorContainerStyle.width = fullscreenInfo.containerWidth;
      editorContainerStyle.height = fullscreenInfo.containerHeight;
      editorContainerStyle.top = fullscreenInfo.containerTop;
      editorContainerStyle.left = fullscreenInfo.containerLeft;
      if (isTouch) {
        Thor.restoreStyles();
      }
      DOM.removeClass(body, 'tox-fullscreen');
      DOM.removeClass(documentElement, 'tox-fullscreen');
      DOM.removeClass(editorContainer, 'tox-fullscreen');
      setScrollPos(fullscreenInfo.scrollPos);
      fullscreenState.set(null);
      Events.fireFullscreenStateChanged(editor, false);
      viewportUpdate.unbind();
      editor.off('remove', viewportUpdate.unbind);
    }
  };
  var Actions = { toggleFullscreen: toggleFullscreen };

  var register = function register(editor, fullscreenState) {
    editor.addCommand('mceFullScreen', function () {
      Actions.toggleFullscreen(editor, fullscreenState);
    });
  };
  var Commands = { register: register };

  var makeSetupHandler = function makeSetupHandler(editor, fullscreenState) {
    return function (api) {
      api.setActive(fullscreenState.get() !== null);
      var editorEventCallback = function editorEventCallback(e) {
        return api.setActive(e.state);
      };
      editor.on('FullscreenStateChanged', editorEventCallback);
      return function () {
        return editor.off('FullscreenStateChanged', editorEventCallback);
      };
    };
  };
  var register$1 = function register$1(editor, fullscreenState) {
    editor.ui.registry.addToggleMenuItem('fullscreen', {
      text: 'Fullscreen',
      shortcut: 'Meta+Shift+F',
      onAction: function onAction() {
        return editor.execCommand('mceFullScreen');
      },
      onSetup: makeSetupHandler(editor, fullscreenState)
    });
    editor.ui.registry.addToggleButton('fullscreen', {
      tooltip: 'Fullscreen',
      icon: 'fullscreen',
      onAction: function onAction() {
        return editor.execCommand('mceFullScreen');
      },
      onSetup: makeSetupHandler(editor, fullscreenState)
    });
  };
  var Buttons = { register: register$1 };

  function Plugin() {
    global.add('fullscreen', function (editor) {
      var fullscreenState = Cell(null);
      if (editor.settings.inline) {
        return Api.get(fullscreenState);
      }
      Commands.register(editor, fullscreenState);
      Buttons.register(editor, fullscreenState);
      editor.addShortcut('Meta+Shift+F', '', 'mceFullScreen');
      return Api.get(fullscreenState);
    });
  }

  Plugin();
})(window);
//# sourceMappingURL=plugin.js.map