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

  var _assign = function __assign() {
    _assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) {
          if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
      }
      return t;
    };
    return _assign.apply(this, arguments);
  };
  function __rest(s, e) {
    var t = {};
    for (var p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === 'function') for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
  }

  var noop = function noop() {};
  var compose = function compose(fa, fb) {
    return function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return fa(fb.apply(null, args));
    };
  };
  var constant = function constant(value) {
    return function () {
      return value;
    };
  };
  var identity = function identity(x) {
    return x;
  };
  function curry(fn) {
    var initialArgs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      initialArgs[_i - 1] = arguments[_i];
    }
    return function () {
      var restArgs = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        restArgs[_i] = arguments[_i];
      }
      var all = initialArgs.concat(restArgs);
      return fn.apply(null, all);
    };
  }
  var not = function not(f) {
    return function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return !f.apply(null, args);
    };
  };
  var die = function die(msg) {
    return function () {
      throw new Error(msg);
    };
  };
  var apply = function apply(f) {
    return f();
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

  var keys = Object.keys;
  var hasOwnProperty = Object.hasOwnProperty;
  var each = function each(obj, f) {
    var props = keys(obj);
    for (var k = 0, len = props.length; k < len; k++) {
      var i = props[k];
      var x = obj[i];
      f(x, i);
    }
  };
  var map = function map(obj, f) {
    return tupleMap(obj, function (x, i) {
      return {
        k: i,
        v: f(x, i)
      };
    });
  };
  var tupleMap = function tupleMap(obj, f) {
    var r = {};
    each(obj, function (x, i) {
      var tuple = f(x, i);
      r[tuple.k] = tuple.v;
    });
    return r;
  };
  var mapToArray = function mapToArray(obj, f) {
    var r = [];
    each(obj, function (value, name) {
      r.push(f(value, name));
    });
    return r;
  };
  var find = function find(obj, pred) {
    var props = keys(obj);
    for (var k = 0, len = props.length; k < len; k++) {
      var i = props[k];
      var x = obj[i];
      if (pred(x, i, obj)) {
        return Option.some(x);
      }
    }
    return Option.none();
  };
  var values = function values(obj) {
    return mapToArray(obj, function (v) {
      return v;
    });
  };
  var has = function has(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  var touchstart = constant('touchstart');
  var touchmove = constant('touchmove');
  var touchend = constant('touchend');
  var mousedown = constant('mousedown');
  var mousemove = constant('mousemove');
  var mouseup = constant('mouseup');
  var mouseover = constant('mouseover');
  var keydown = constant('keydown');
  var keyup = constant('keyup');
  var input = constant('input');
  var change = constant('change');
  var click = constant('click');
  var transitionend = constant('transitionend');
  var selectstart = constant('selectstart');

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
  var isObject = isType('object');
  var isArray = isType('array');
  var isBoolean = isType('boolean');
  var isFunction = isType('function');
  var isNumber = isType('number');

  var nativeSlice = Array.prototype.slice;
  var nativeIndexOf = Array.prototype.indexOf;
  var nativePush = Array.prototype.push;
  var rawIndexOf = function rawIndexOf(ts, t) {
    return nativeIndexOf.call(ts, t);
  };
  var contains = function contains(xs, x) {
    return rawIndexOf(xs, x) > -1;
  };
  var exists = function exists(xs, pred) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i)) {
        return true;
      }
    }
    return false;
  };
  var map$1 = function map$1(xs, f) {
    var len = xs.length;
    var r = new Array(len);
    for (var i = 0; i < len; i++) {
      var x = xs[i];
      r[i] = f(x, i);
    }
    return r;
  };
  var each$1 = function each$1(xs, f) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      f(x, i);
    }
  };
  var eachr = function eachr(xs, f) {
    for (var i = xs.length - 1; i >= 0; i--) {
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
  var foldr = function foldr(xs, f, acc) {
    eachr(xs, function (x) {
      acc = f(acc, x);
    });
    return acc;
  };
  var foldl = function foldl(xs, f, acc) {
    each$1(xs, function (x) {
      acc = f(acc, x);
    });
    return acc;
  };
  var find$2 = function find$2(xs, pred) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i)) {
        return Option.some(x);
      }
    }
    return Option.none();
  };
  var findIndex = function findIndex(xs, pred) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i)) {
        return Option.some(i);
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
    var output = map$1(xs, f);
    return flatten(output);
  };
  var forall = function forall(xs, pred) {
    for (var i = 0, len = xs.length; i < len; ++i) {
      var x = xs[i];
      if (pred(x, i) !== true) {
        return false;
      }
    }
    return true;
  };
  var reverse = function reverse(xs) {
    var r = nativeSlice.call(xs, 0);
    r.reverse();
    return r;
  };
  var difference = function difference(a1, a2) {
    return filter(a1, function (x) {
      return !contains(a2, x);
    });
  };
  var pure = function pure(x) {
    return [x];
  };
  var from$1 = isFunction(Array.from) ? Array.from : function (x) {
    return nativeSlice.call(x);
  };

  var detect$1 = function detect$1(candidates, userAgent) {
    var agent = String(userAgent).toLowerCase();
    return find$2(candidates, function (candidate) {
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

  var checkRange = function checkRange(str, substr, start) {
    if (substr === '') {
      return true;
    }
    if (str.length < substr.length) {
      return false;
    }
    var x = str.substr(start, start + substr.length);
    return x === substr;
  };
  var supplant = function supplant(str, obj) {
    var isStringOrNumber = function isStringOrNumber(a) {
      var t = typeof a === 'undefined' ? 'undefined' : _typeof(a);
      return t === 'string' || t === 'number';
    };
    return str.replace(/\$\{([^{}]*)\}/g, function (fullMatch, key) {
      var value = obj[key];
      return isStringOrNumber(value) ? value.toString() : fullMatch;
    });
  };
  var contains$1 = function contains$1(str, substr) {
    return str.indexOf(substr) !== -1;
  };
  var endsWith = function endsWith(str, suffix) {
    return checkRange(str, suffix, str.length - suffix.length);
  };
  var trim = function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
  };

  var normalVersionRegex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/;
  var checkContains = function checkContains(target) {
    return function (uastring) {
      return contains$1(uastring, target);
    };
  };
  var browsers = [{
    name: 'Edge',
    versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
    search: function search(uastring) {
      return contains$1(uastring, 'edge/') && contains$1(uastring, 'chrome') && contains$1(uastring, 'safari') && contains$1(uastring, 'applewebkit');
    }
  }, {
    name: 'Chrome',
    versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/, normalVersionRegex],
    search: function search(uastring) {
      return contains$1(uastring, 'chrome') && !contains$1(uastring, 'chromeframe');
    }
  }, {
    name: 'IE',
    versionRegexes: [/.*?msie\ ?([0-9]+)\.([0-9]+).*/, /.*?rv:([0-9]+)\.([0-9]+).*/],
    search: function search(uastring) {
      return contains$1(uastring, 'msie') || contains$1(uastring, 'trident');
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
      return (contains$1(uastring, 'safari') || contains$1(uastring, 'mobile/')) && contains$1(uastring, 'applewebkit');
    }
  }];
  var oses = [{
    name: 'Windows',
    search: checkContains('win'),
    versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]
  }, {
    name: 'iOS',
    search: function search(uastring) {
      return contains$1(uastring, 'iphone') || contains$1(uastring, 'ipad');
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

  var alloy = { tap: constant('alloy.tap') };
  var focus = constant('alloy.focus');
  var postBlur = constant('alloy.blur.post');
  var postPaste = constant('alloy.paste.post');
  var receive = constant('alloy.receive');
  var execute = constant('alloy.execute');
  var focusItem = constant('alloy.focus.item');
  var tap = alloy.tap;
  var tapOrClick = detect$3().deviceType.isTouch() ? alloy.tap : click;
  var longpress = constant('alloy.longpress');
  var systemInit = constant('alloy.system.init');
  var attachedToDom = constant('alloy.system.attached');
  var detachedFromDom = constant('alloy.system.detached');
  var focusShifted = constant('alloy.focusmanager.shifted');
  var highlight = constant('alloy.highlight');
  var dehighlight = constant('alloy.dehighlight');

  var emit = function emit(component, event) {
    dispatchWith(component, component.element(), event, {});
  };
  var emitWith = function emitWith(component, event, properties) {
    dispatchWith(component, component.element(), event, properties);
  };
  var emitExecute = function emitExecute(component) {
    emit(component, execute());
  };
  var dispatch = function dispatch(component, target, event) {
    dispatchWith(component, target, event, {});
  };
  var dispatchWith = function dispatchWith(component, target, event, properties) {
    var data = _assign({ target: target }, properties);
    component.getSystem().triggerEvent(event, target, map(data, constant));
  };
  var dispatchEvent = function dispatchEvent(component, target, event, simulatedEvent) {
    component.getSystem().triggerEvent(event, target, simulatedEvent.event());
  };
  var dispatchFocus = function dispatchFocus(component, target) {
    component.getSystem().triggerFocus(target, component.element());
  };

  var cached = function cached(f) {
    var called = false;
    var r;
    return function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      if (!called) {
        called = true;
        r = f.apply(null, args);
      }
      return r;
    };
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

  var name = function name(element) {
    var r = element.dom().nodeName;
    return r.toLowerCase();
  };
  var type = function type(element) {
    return element.dom().nodeType;
  };
  var isType$1 = function isType$1(t) {
    return function (element) {
      return type(element) === t;
    };
  };
  var isElement = isType$1(ELEMENT);
  var isText = isType$1(TEXT);

  var inBody = function inBody(element) {
    var dom = isText(element) ? element.dom().parentNode : element.dom();
    return dom !== undefined && dom !== null && dom.ownerDocument.body.contains(dom);
  };
  var body = cached(function () {
    return getBody(Element.fromDom(domGlobals.document));
  });
  var getBody = function getBody(doc) {
    var b = doc.dom().body;
    if (b === null || b === undefined) {
      throw new Error('Body is not available yet');
    }
    return Element.fromDom(b);
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
      each$1(fields, function (name, i) {
        struct[name] = constant(values[i]);
      });
      return struct;
    };
  };

  var sort = function sort(arr) {
    return arr.slice(0).sort();
  };
  var reqMessage = function reqMessage(required, keys) {
    throw new Error('All required keys (' + sort(required).join(', ') + ') were not specified. Specified keys were: ' + sort(keys).join(', ') + '.');
  };
  var unsuppMessage = function unsuppMessage(unsupported) {
    throw new Error('Unsupported keys for object: ' + sort(unsupported).join(', '));
  };
  var validateStrArr = function validateStrArr(label, array) {
    if (!isArray(array)) {
      throw new Error('The ' + label + ' fields must be an array. Was: ' + array + '.');
    }
    each$1(array, function (a) {
      if (!isString(a)) {
        throw new Error('The value ' + a + ' in the ' + label + ' fields was not a string.');
      }
    });
  };
  var checkDupes = function checkDupes(everything) {
    var sorted = sort(everything);
    var dupe = find$2(sorted, function (s, i) {
      return i < sorted.length - 1 && s === sorted[i + 1];
    });
    dupe.each(function (d) {
      throw new Error('The field: ' + d + ' occurs more than once in the combined fields: [' + sorted.join(', ') + '].');
    });
  };

  var MixedBag = function MixedBag(required, optional) {
    var everything = required.concat(optional);
    if (everything.length === 0) {
      throw new Error('You must specify at least one required or optional field.');
    }
    validateStrArr('required', required);
    validateStrArr('optional', optional);
    checkDupes(everything);
    return function (obj) {
      var keys$1 = keys(obj);
      var allReqd = forall(required, function (req) {
        return contains(keys$1, req);
      });
      if (!allReqd) {
        reqMessage(required, keys$1);
      }
      var unsupported = filter(keys$1, function (key) {
        return !contains(everything, key);
      });
      if (unsupported.length > 0) {
        unsuppMessage(unsupported);
      }
      var r = {};
      each$1(required, function (req) {
        r[req] = constant(obj[req]);
      });
      each$1(optional, function (opt) {
        r[opt] = constant(Object.prototype.hasOwnProperty.call(obj, opt) ? Option.some(obj[opt]) : Option.none());
      });
      return r;
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
    return bypassSelector(base) ? [] : map$1(base.querySelectorAll(selector), Element.fromDom);
  };
  var one = function one(selector, scope) {
    var base = scope === undefined ? domGlobals.document : scope.dom();
    return bypassSelector(base) ? Option.none() : Option.from(base.querySelector(selector)).map(Element.fromDom);
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
  var contains$2 = browser.isIE() ? ieContains : regularContains;

  var owner = function owner(element) {
    return Element.fromDom(element.dom().ownerDocument);
  };
  var defaultView = function defaultView(element) {
    return Element.fromDom(element.dom().ownerDocument.defaultView);
  };
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
  var nextSibling = function nextSibling(element) {
    return Option.from(element.dom().nextSibling).map(Element.fromDom);
  };
  var children = function children(element) {
    return map$1(element.dom().childNodes, Element.fromDom);
  };
  var child = function child(element, index) {
    var cs = element.dom().childNodes;
    return Option.from(cs[index]).map(Element.fromDom);
  };
  var firstChild = function firstChild(element) {
    return child(element, 0);
  };
  var spot = Immutable('element', 'offset');

  var before = function before(marker, element) {
    var parent$1 = parent(marker);
    parent$1.each(function (v) {
      v.dom().insertBefore(element.dom(), marker.dom());
    });
  };
  var after = function after(marker, element) {
    var sibling = nextSibling(marker);
    sibling.fold(function () {
      var parent$1 = parent(marker);
      parent$1.each(function (v) {
        append(v, element);
      });
    }, function (v) {
      before(v, element);
    });
  };
  var prepend = function prepend(parent, element) {
    var firstChild$1 = firstChild(parent);
    firstChild$1.fold(function () {
      append(parent, element);
    }, function (v) {
      parent.dom().insertBefore(element.dom(), v.dom());
    });
  };
  var append = function append(parent, element) {
    parent.dom().appendChild(element.dom());
  };
  var appendAt = function appendAt(parent, element, index) {
    child(parent, index).fold(function () {
      append(parent, element);
    }, function (v) {
      before(v, element);
    });
  };

  var append$1 = function append$1(parent, elements) {
    each$1(elements, function (x) {
      append(parent, x);
    });
  };

  var empty = function empty(element) {
    element.dom().textContent = '';
    each$1(children(element), function (rogue) {
      remove(rogue);
    });
  };
  var remove = function remove(element) {
    var dom = element.dom();
    if (dom.parentNode !== null) {
      dom.parentNode.removeChild(dom);
    }
  };

  var fireDetaching = function fireDetaching(component) {
    emit(component, detachedFromDom());
    var children = component.components();
    each$1(children, fireDetaching);
  };
  var fireAttaching = function fireAttaching(component) {
    var children = component.components();
    each$1(children, fireAttaching);
    emit(component, attachedToDom());
  };
  var attach = function attach(parent, child) {
    append(parent.element(), child.element());
  };
  var detachChildren = function detachChildren(component) {
    each$1(component.components(), function (childComp) {
      return remove(childComp.element());
    });
    empty(component.element());
    component.syncComponents();
  };
  var replaceChildren = function replaceChildren(component, newChildren) {
    var subs = component.components();
    detachChildren(component);
    var deleted = difference(subs, newChildren);
    each$1(deleted, function (comp) {
      fireDetaching(comp);
      component.getSystem().removeFromWorld(comp);
    });
    each$1(newChildren, function (childComp) {
      if (!childComp.getSystem().isConnected()) {
        component.getSystem().addToWorld(childComp);
        attach(component, childComp);
        if (inBody(component.element())) {
          fireAttaching(childComp);
        }
      } else {
        attach(component, childComp);
      }
      component.syncComponents();
    });
  };

  var attach$1 = function attach$1(parent, child) {
    attachWith(parent, child, append);
  };
  var attachWith = function attachWith(parent, child, insertion) {
    parent.getSystem().addToWorld(child);
    insertion(parent.element(), child.element());
    if (inBody(parent.element())) {
      fireAttaching(child);
    }
    parent.syncComponents();
  };
  var doDetach = function doDetach(component) {
    fireDetaching(component);
    remove(component.element());
    component.getSystem().removeFromWorld(component);
  };
  var detach = function detach(component) {
    var parent$1 = parent(component.element()).bind(function (p) {
      return component.getSystem().getByDom(p).toOption();
    });
    doDetach(component);
    parent$1.each(function (p) {
      p.syncComponents();
    });
  };
  var attachSystemAfter = function attachSystemAfter(element, guiSystem) {
    attachSystemWith(element, guiSystem, after);
  };
  var attachSystemWith = function attachSystemWith(element, guiSystem, inserter) {
    inserter(element, guiSystem.element());
    var children$1 = children(guiSystem.element());
    each$1(children$1, function (child) {
      guiSystem.getByDom(child).each(fireAttaching);
    });
  };
  var detachSystem = function detachSystem(guiSystem) {
    var children$1 = children(guiSystem.element());
    each$1(children$1, function (child) {
      guiSystem.getByDom(child).each(fireDetaching);
    });
    remove(guiSystem.element());
  };

  var value = function value(o) {
    var is = function is(v) {
      return o === v;
    };
    var or = function or(opt) {
      return value(o);
    };
    var orThunk = function orThunk(f) {
      return value(o);
    };
    var map = function map(f) {
      return value(f(o));
    };
    var mapError = function mapError(f) {
      return value(o);
    };
    var each = function each(f) {
      f(o);
    };
    var bind = function bind(f) {
      return f(o);
    };
    var fold = function fold(_, onValue) {
      return onValue(o);
    };
    var exists = function exists(f) {
      return f(o);
    };
    var forall = function forall(f) {
      return f(o);
    };
    var toOption = function toOption() {
      return Option.some(o);
    };
    return {
      is: is,
      isValue: always,
      isError: never,
      getOr: constant(o),
      getOrThunk: constant(o),
      getOrDie: constant(o),
      or: or,
      orThunk: orThunk,
      fold: fold,
      map: map,
      mapError: mapError,
      each: each,
      bind: bind,
      exists: exists,
      forall: forall,
      toOption: toOption
    };
  };
  var error = function error(message) {
    var getOrThunk = function getOrThunk(f) {
      return f();
    };
    var getOrDie = function getOrDie() {
      return die(String(message))();
    };
    var or = function or(opt) {
      return opt;
    };
    var orThunk = function orThunk(f) {
      return f();
    };
    var map = function map(f) {
      return error(message);
    };
    var mapError = function mapError(f) {
      return error(f(message));
    };
    var bind = function bind(f) {
      return error(message);
    };
    var fold = function fold(onError, _) {
      return onError(message);
    };
    return {
      is: never,
      isValue: never,
      isError: always,
      getOr: identity,
      getOrThunk: getOrThunk,
      getOrDie: getOrDie,
      or: or,
      orThunk: orThunk,
      fold: fold,
      map: map,
      mapError: mapError,
      each: noop,
      bind: bind,
      exists: never,
      forall: always,
      toOption: Option.none
    };
  };
  var fromOption = function fromOption(opt, err) {
    return opt.fold(function () {
      return error(err);
    }, value);
  };
  var Result = {
    value: value,
    error: error,
    fromOption: fromOption
  };

  var generate = function generate(cases) {
    if (!isArray(cases)) {
      throw new Error('cases must be an array');
    }
    if (cases.length === 0) {
      throw new Error('there must be at least one case');
    }
    var constructors = [];
    var adt = {};
    each$1(cases, function (acase, count) {
      var keys$1 = keys(acase);
      if (keys$1.length !== 1) {
        throw new Error('one and only one name per case');
      }
      var key = keys$1[0];
      var value = acase[key];
      if (adt[key] !== undefined) {
        throw new Error('duplicate key detected:' + key);
      } else if (key === 'cata') {
        throw new Error('cannot have a case named cata (sorry)');
      } else if (!isArray(value)) {
        throw new Error('case arguments must be an array');
      }
      constructors.push(key);
      adt[key] = function () {
        var argLength = arguments.length;
        if (argLength !== value.length) {
          throw new Error('Wrong number of arguments to case ' + key + '. Expected ' + value.length + ' (' + value + '), got ' + argLength);
        }
        var args = new Array(argLength);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var match = function match(branches) {
          var branchKeys = keys(branches);
          if (constructors.length !== branchKeys.length) {
            throw new Error('Wrong number of arguments to match. Expected: ' + constructors.join(',') + '\nActual: ' + branchKeys.join(','));
          }
          var allReqd = forall(constructors, function (reqKey) {
            return contains(branchKeys, reqKey);
          });
          if (!allReqd) {
            throw new Error('Not all branches were specified when using match. Specified: ' + branchKeys.join(', ') + '\nRequired: ' + constructors.join(', '));
          }
          return branches[key].apply(null, args);
        };
        return {
          fold: function fold() {
            if (arguments.length !== cases.length) {
              throw new Error('Wrong number of arguments to fold. Expected ' + cases.length + ', got ' + arguments.length);
            }
            var target = arguments[count];
            return target.apply(null, args);
          },
          match: match,
          log: function log(label) {
            domGlobals.console.log(label, {
              constructors: constructors,
              constructor: key,
              params: args
            });
          }
        };
      };
    });
    return adt;
  };
  var Adt = { generate: generate };

  var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  var shallow = function shallow(old, nu) {
    return nu;
  };
  var deep = function deep(old, nu) {
    var bothObjects = isObject(old) && isObject(nu);
    return bothObjects ? deepMerge(old, nu) : nu;
  };
  var baseMerge = function baseMerge(merger) {
    return function () {
      var objects = new Array(arguments.length);
      for (var i = 0; i < objects.length; i++) {
        objects[i] = arguments[i];
      }
      if (objects.length === 0) {
        throw new Error('Can\'t merge zero objects');
      }
      var ret = {};
      for (var j = 0; j < objects.length; j++) {
        var curObject = objects[j];
        for (var key in curObject) {
          if (hasOwnProperty$1.call(curObject, key)) {
            ret[key] = merger(ret[key], curObject[key]);
          }
        }
      }
      return ret;
    };
  };
  var deepMerge = baseMerge(deep);
  var merge = baseMerge(shallow);

  var adt = Adt.generate([{ strict: [] }, { defaultedThunk: ['fallbackThunk'] }, { asOption: [] }, { asDefaultedOptionThunk: ['fallbackThunk'] }, { mergeWithThunk: ['baseThunk'] }]);
  var defaulted = function defaulted(fallback) {
    return adt.defaultedThunk(constant(fallback));
  };
  var mergeWith = function mergeWith(base) {
    return adt.mergeWithThunk(constant(base));
  };
  var strict = adt.strict;
  var asOption = adt.asOption;
  var defaultedThunk = adt.defaultedThunk;
  var mergeWithThunk = adt.mergeWithThunk;

  var exclude = function exclude(obj, fields) {
    var r = {};
    each(obj, function (v, k) {
      if (!contains(fields, k)) {
        r[k] = v;
      }
    });
    return r;
  };

  var readOpt = function readOpt(key) {
    return function (obj) {
      return has(obj, key) ? Option.from(obj[key]) : Option.none();
    };
  };
  var readOr = function readOr(key, fallback) {
    return function (obj) {
      return has(obj, key) ? obj[key] : fallback;
    };
  };
  var readOptFrom = function readOptFrom(obj, key) {
    return readOpt(key)(obj);
  };
  var hasKey = function hasKey(obj, key) {
    return has(obj, key) && obj[key] !== undefined && obj[key] !== null;
  };

  var wrap = function wrap(key, value) {
    var r = {};
    r[key] = value;
    return r;
  };
  var wrapAll = function wrapAll(keyvalues) {
    var r = {};
    each$1(keyvalues, function (kv) {
      r[kv.key] = kv.value;
    });
    return r;
  };

  var comparison = Adt.generate([{
    bothErrors: ['error1', 'error2']
  }, {
    firstError: ['error1', 'value2']
  }, {
    secondError: ['value1', 'error2']
  }, {
    bothValues: ['value1', 'value2']
  }]);
  var partition = function partition(results) {
    var errors = [];
    var values = [];
    each$1(results, function (result) {
      result.fold(function (err) {
        errors.push(err);
      }, function (value) {
        values.push(value);
      });
    });
    return {
      errors: errors,
      values: values
    };
  };

  var exclude$1 = function exclude$1(obj, fields) {
    return exclude(obj, fields);
  };
  var readOpt$1 = function readOpt$1(key) {
    return readOpt(key);
  };
  var readOr$1 = function readOr$1(key, fallback) {
    return readOr(key, fallback);
  };
  var readOptFrom$1 = function readOptFrom$1(obj, key) {
    return readOptFrom(obj, key);
  };
  var wrap$1 = function wrap$1(key, value) {
    return wrap(key, value);
  };
  var wrapAll$1 = function wrapAll$1(keyvalues) {
    return wrapAll(keyvalues);
  };
  var mergeValues = function mergeValues(values, base) {
    return values.length === 0 ? Result.value(base) : Result.value(deepMerge(base, merge.apply(undefined, values)));
  };
  var mergeErrors = function mergeErrors(errors) {
    return Result.error(flatten(errors));
  };
  var consolidate = function consolidate(objs, base) {
    var partitions = partition(objs);
    return partitions.errors.length > 0 ? mergeErrors(partitions.errors) : mergeValues(partitions.values, base);
  };
  var hasKey$1 = function hasKey$1(obj, key) {
    return hasKey(obj, key);
  };

  var SimpleResultType;
  (function (SimpleResultType) {
    SimpleResultType[SimpleResultType['Error'] = 0] = 'Error';
    SimpleResultType[SimpleResultType['Value'] = 1] = 'Value';
  })(SimpleResultType || (SimpleResultType = {}));
  var fold = function fold(res, onError, onValue) {
    return res.stype === SimpleResultType.Error ? onError(res.serror) : onValue(res.svalue);
  };
  var partition$1 = function partition$1(results) {
    var values = [];
    var errors = [];
    each$1(results, function (obj) {
      fold(obj, function (err) {
        return errors.push(err);
      }, function (val) {
        return values.push(val);
      });
    });
    return {
      values: values,
      errors: errors
    };
  };
  var mapError = function mapError(res, f) {
    if (res.stype === SimpleResultType.Error) {
      return {
        stype: SimpleResultType.Error,
        serror: f(res.serror)
      };
    } else {
      return res;
    }
  };
  var map$2 = function map$2(res, f) {
    if (res.stype === SimpleResultType.Value) {
      return {
        stype: SimpleResultType.Value,
        svalue: f(res.svalue)
      };
    } else {
      return res;
    }
  };
  var bind$1 = function bind$1(res, f) {
    if (res.stype === SimpleResultType.Value) {
      return f(res.svalue);
    } else {
      return res;
    }
  };
  var bindError = function bindError(res, f) {
    if (res.stype === SimpleResultType.Error) {
      return f(res.serror);
    } else {
      return res;
    }
  };
  var svalue = function svalue(v) {
    return {
      stype: SimpleResultType.Value,
      svalue: v
    };
  };
  var serror = function serror(e) {
    return {
      stype: SimpleResultType.Error,
      serror: e
    };
  };
  var toResult = function toResult(res) {
    return fold(res, Result.error, Result.value);
  };
  var fromResult = function fromResult(res) {
    return res.fold(serror, svalue);
  };
  var SimpleResult = {
    fromResult: fromResult,
    toResult: toResult,
    svalue: svalue,
    partition: partition$1,
    serror: serror,
    bind: bind$1,
    bindError: bindError,
    map: map$2,
    mapError: mapError,
    fold: fold
  };

  var mergeValues$1 = function mergeValues$1(values, base) {
    return values.length > 0 ? SimpleResult.svalue(deepMerge(base, merge.apply(undefined, values))) : SimpleResult.svalue(base);
  };
  var mergeErrors$1 = function mergeErrors$1(errors) {
    return compose(SimpleResult.serror, flatten)(errors);
  };
  var consolidateObj = function consolidateObj(objects, base) {
    var partition = SimpleResult.partition(objects);
    return partition.errors.length > 0 ? mergeErrors$1(partition.errors) : mergeValues$1(partition.values, base);
  };
  var consolidateArr = function consolidateArr(objects) {
    var partitions = SimpleResult.partition(objects);
    return partitions.errors.length > 0 ? mergeErrors$1(partitions.errors) : SimpleResult.svalue(partitions.values);
  };
  var ResultCombine = {
    consolidateObj: consolidateObj,
    consolidateArr: consolidateArr
  };

  var typeAdt = Adt.generate([{
    setOf: ['validator', 'valueType']
  }, { arrOf: ['valueType'] }, { objOf: ['fields'] }, { itemOf: ['validator'] }, {
    choiceOf: ['key', 'branches']
  }, { thunk: ['description'] }, {
    func: ['args', 'outputSchema']
  }]);
  var fieldAdt = Adt.generate([{
    field: ['name', 'presence', 'type']
  }, { state: ['name'] }]);

  var formatObj = function formatObj(input) {
    return isObject(input) && keys(input).length > 100 ? ' removed due to size' : JSON.stringify(input, null, 2);
  };
  var formatErrors = function formatErrors(errors) {
    var es = errors.length > 10 ? errors.slice(0, 10).concat([{
      path: [],
      getErrorInfo: function getErrorInfo() {
        return '... (only showing first ten failures)';
      }
    }]) : errors;
    return map$1(es, function (e) {
      return 'Failed path: (' + e.path.join(' > ') + ')\n' + e.getErrorInfo();
    });
  };

  var nu$3 = function nu$3(path, getErrorInfo) {
    return SimpleResult.serror([{
      path: path,
      getErrorInfo: getErrorInfo
    }]);
  };
  var missingStrict = function missingStrict(path, key, obj) {
    return nu$3(path, function () {
      return 'Could not find valid *strict* value for "' + key + '" in ' + formatObj(obj);
    });
  };
  var missingKey = function missingKey(path, key) {
    return nu$3(path, function () {
      return 'Choice schema did not contain choice key: "' + key + '"';
    });
  };
  var missingBranch = function missingBranch(path, branches, branch) {
    return nu$3(path, function () {
      return 'The chosen schema: "' + branch + '" did not exist in branches: ' + formatObj(branches);
    });
  };
  var unsupportedFields = function unsupportedFields(path, unsupported) {
    return nu$3(path, function () {
      return 'There are unsupported fields: [' + unsupported.join(', ') + '] specified';
    });
  };
  var custom = function custom(path, err) {
    return nu$3(path, function () {
      return err;
    });
  };

  var adt$1 = Adt.generate([{
    field: ['key', 'okey', 'presence', 'prop']
  }, {
    state: ['okey', 'instantiator']
  }]);
  var strictAccess = function strictAccess(path, obj, key) {
    return readOptFrom(obj, key).fold(function () {
      return missingStrict(path, key, obj);
    }, SimpleResult.svalue);
  };
  var fallbackAccess = function fallbackAccess(obj, key, fallbackThunk) {
    var v = readOptFrom(obj, key).fold(function () {
      return fallbackThunk(obj);
    }, identity);
    return SimpleResult.svalue(v);
  };
  var optionAccess = function optionAccess(obj, key) {
    return SimpleResult.svalue(readOptFrom(obj, key));
  };
  var optionDefaultedAccess = function optionDefaultedAccess(obj, key, fallback) {
    var opt = readOptFrom(obj, key).map(function (val) {
      return val === true ? fallback(obj) : val;
    });
    return SimpleResult.svalue(opt);
  };
  var cExtractOne = function cExtractOne(path, obj, field, strength) {
    return field.fold(function (key, okey, presence, prop) {
      var bundle = function bundle(av) {
        var result = prop.extract(path.concat([key]), strength, av);
        return SimpleResult.map(result, function (res) {
          return wrap(okey, strength(res));
        });
      };
      var bundleAsOption = function bundleAsOption(optValue) {
        return optValue.fold(function () {
          var outcome = wrap(okey, strength(Option.none()));
          return SimpleResult.svalue(outcome);
        }, function (ov) {
          var result = prop.extract(path.concat([key]), strength, ov);
          return SimpleResult.map(result, function (res) {
            return wrap(okey, strength(Option.some(res)));
          });
        });
      };
      return function () {
        return presence.fold(function () {
          return SimpleResult.bind(strictAccess(path, obj, key), bundle);
        }, function (fallbackThunk) {
          return SimpleResult.bind(fallbackAccess(obj, key, fallbackThunk), bundle);
        }, function () {
          return SimpleResult.bind(optionAccess(obj, key), bundleAsOption);
        }, function (fallbackThunk) {
          return SimpleResult.bind(optionDefaultedAccess(obj, key, fallbackThunk), bundleAsOption);
        }, function (baseThunk) {
          var base = baseThunk(obj);
          var result = SimpleResult.map(fallbackAccess(obj, key, constant({})), function (v) {
            return deepMerge(base, v);
          });
          return SimpleResult.bind(result, bundle);
        });
      }();
    }, function (okey, instantiator) {
      var state = instantiator(obj);
      return SimpleResult.svalue(wrap(okey, strength(state)));
    });
  };
  var cExtract = function cExtract(path, obj, fields, strength) {
    var results = map$1(fields, function (field) {
      return cExtractOne(path, obj, field, strength);
    });
    return ResultCombine.consolidateObj(results, {});
  };
  var value$1 = function value$1(validator) {
    var extract = function extract(path, strength, val) {
      return SimpleResult.bindError(validator(val, strength), function (err) {
        return custom(path, err);
      });
    };
    var toString = function toString() {
      return 'val';
    };
    var toDsl = function toDsl() {
      return typeAdt.itemOf(validator);
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var getSetKeys = function getSetKeys(obj) {
    var keys$1 = keys(obj);
    return filter(keys$1, function (k) {
      return hasKey$1(obj, k);
    });
  };
  var objOfOnly = function objOfOnly(fields) {
    var delegate = objOf(fields);
    var fieldNames = foldr(fields, function (acc, f) {
      return f.fold(function (key) {
        return deepMerge(acc, wrap$1(key, true));
      }, constant(acc));
    }, {});
    var extract = function extract(path, strength, o) {
      var keys = isBoolean(o) ? [] : getSetKeys(o);
      var extra = filter(keys, function (k) {
        return !hasKey$1(fieldNames, k);
      });
      return extra.length === 0 ? delegate.extract(path, strength, o) : unsupportedFields(path, extra);
    };
    return {
      extract: extract,
      toString: delegate.toString,
      toDsl: delegate.toDsl
    };
  };
  var objOf = function objOf(fields) {
    var extract = function extract(path, strength, o) {
      return cExtract(path, o, fields, strength);
    };
    var toString = function toString() {
      var fieldStrings = map$1(fields, function (field) {
        return field.fold(function (key, okey, presence, prop) {
          return key + ' -> ' + prop.toString();
        }, function (okey, instantiator) {
          return 'state(' + okey + ')';
        });
      });
      return 'obj{\n' + fieldStrings.join('\n') + '}';
    };
    var toDsl = function toDsl() {
      return typeAdt.objOf(map$1(fields, function (f) {
        return f.fold(function (key, okey, presence, prop) {
          return fieldAdt.field(key, presence, prop);
        }, function (okey, instantiator) {
          return fieldAdt.state(okey);
        });
      }));
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var arrOf = function arrOf(prop) {
    var extract = function extract(path, strength, array) {
      var results = map$1(array, function (a, i) {
        return prop.extract(path.concat(['[' + i + ']']), strength, a);
      });
      return ResultCombine.consolidateArr(results);
    };
    var toString = function toString() {
      return 'array(' + prop.toString() + ')';
    };
    var toDsl = function toDsl() {
      return typeAdt.arrOf(prop);
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var setOf = function setOf(validator, prop) {
    var validateKeys = function validateKeys(path, keys) {
      return arrOf(value$1(validator)).extract(path, identity, keys);
    };
    var extract = function extract(path, strength, o) {
      var keys$1 = keys(o);
      var validatedKeys = validateKeys(path, keys$1);
      return SimpleResult.bind(validatedKeys, function (validKeys) {
        var schema = map$1(validKeys, function (vk) {
          return adt$1.field(vk, vk, strict(), prop);
        });
        return objOf(schema).extract(path, strength, o);
      });
    };
    var toString = function toString() {
      return 'setOf(' + prop.toString() + ')';
    };
    var toDsl = function toDsl() {
      return typeAdt.setOf(validator, prop);
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var anyValue = constant(value$1(SimpleResult.svalue));
  var state = adt$1.state;
  var field = adt$1.field;

  var chooseFrom = function chooseFrom(path, strength, input, branches, ch) {
    var fields = readOptFrom$1(branches, ch);
    return fields.fold(function () {
      return missingBranch(path, branches, ch);
    }, function (vp) {
      return vp.extract(path.concat(['branch: ' + ch]), strength, input);
    });
  };
  var choose = function choose(key, branches) {
    var extract = function extract(path, strength, input) {
      var choice = readOptFrom$1(input, key);
      return choice.fold(function () {
        return missingKey(path, key);
      }, function (chosen) {
        return chooseFrom(path, strength, input, branches, chosen);
      });
    };
    var toString = function toString() {
      return 'chooseOn(' + key + '). Possible values: ' + keys(branches);
    };
    var toDsl = function toDsl() {
      return typeAdt.choiceOf(key, branches);
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };

  var _anyValue = value$1(SimpleResult.svalue);
  var valueOf = function valueOf(validator) {
    return value$1(function (v) {
      return validator(v).fold(SimpleResult.serror, SimpleResult.svalue);
    });
  };
  var setOf$1 = function setOf$1(validator, prop) {
    return setOf(function (v) {
      return SimpleResult.fromResult(validator(v));
    }, prop);
  };
  var extract = function extract(label, prop, strength, obj) {
    var res = prop.extract([label], strength, obj);
    return SimpleResult.mapError(res, function (errs) {
      return {
        input: obj,
        errors: errs
      };
    });
  };
  var asRaw = function asRaw(label, prop, obj) {
    return SimpleResult.toResult(extract(label, prop, identity, obj));
  };
  var getOrDie = function getOrDie(extraction) {
    return extraction.fold(function (errInfo) {
      throw new Error(formatError(errInfo));
    }, identity);
  };
  var asRawOrDie = function asRawOrDie(label, prop, obj) {
    return getOrDie(asRaw(label, prop, obj));
  };
  var formatError = function formatError(errInfo) {
    return 'Errors: \n' + formatErrors(errInfo.errors) + '\n\nInput object: ' + formatObj(errInfo.input);
  };
  var choose$1 = function choose$1(key, branches) {
    return choose(key, map(branches, objOf));
  };
  var anyValue$1 = constant(_anyValue);
  var typedValue = function typedValue(validator, expectedType) {
    return value$1(function (a) {
      var actualType = typeof a === 'undefined' ? 'undefined' : _typeof(a);
      return validator(a) ? SimpleResult.svalue(a) : SimpleResult.serror('Expected type: ' + expectedType + ' but got: ' + actualType);
    });
  };
  var functionProcessor = typedValue(isFunction, 'function');

  var strict$1 = function strict$1(key) {
    return field(key, key, strict(), anyValue());
  };
  var strictOf = function strictOf(key, schema) {
    return field(key, key, strict(), schema);
  };
  var strictFunction = function strictFunction(key) {
    return strictOf(key, functionProcessor);
  };
  var forbid = function forbid(key, message) {
    return field(key, key, asOption(), value$1(function (v) {
      return SimpleResult.serror('The field: ' + key + ' is forbidden. ' + message);
    }));
  };
  var strictObjOf = function strictObjOf(key, objSchema) {
    return field(key, key, strict(), objOf(objSchema));
  };
  var option = function option(key) {
    return field(key, key, asOption(), anyValue());
  };
  var optionOf = function optionOf(key, schema) {
    return field(key, key, asOption(), schema);
  };
  var optionObjOf = function optionObjOf(key, objSchema) {
    return optionOf(key, objOf(objSchema));
  };
  var optionObjOfOnly = function optionObjOfOnly(key, objSchema) {
    return optionOf(key, objOfOnly(objSchema));
  };
  var defaulted$1 = function defaulted$1(key, fallback) {
    return field(key, key, defaulted(fallback), anyValue());
  };
  var defaultedOf = function defaultedOf(key, fallback, schema) {
    return field(key, key, defaulted(fallback), schema);
  };
  var defaultedObjOf = function defaultedObjOf(key, fallback, objSchema) {
    return defaultedOf(key, fallback, objOf(objSchema));
  };
  var state$1 = function state$1(okey, instantiator) {
    return state(okey, instantiator);
  };

  var isSource = function isSource(component, simulatedEvent) {
    return eq(component.element(), simulatedEvent.event().target());
  };

  var nu$4 = function nu$4(parts) {
    if (!hasKey$1(parts, 'can') && !hasKey$1(parts, 'abort') && !hasKey$1(parts, 'run')) {
      throw new Error('EventHandler defined by: ' + JSON.stringify(parts, null, 2) + ' does not have can, abort, or run!');
    }
    return asRawOrDie('Extracting event.handler', objOfOnly([defaulted$1('can', constant(true)), defaulted$1('abort', constant(false)), defaulted$1('run', noop)]), parts);
  };
  var all$1 = function all$1(handlers, f) {
    return function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return foldl(handlers, function (acc, handler) {
        return acc && f(handler).apply(undefined, args);
      }, true);
    };
  };
  var any = function any(handlers, f) {
    return function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return foldl(handlers, function (acc, handler) {
        return acc || f(handler).apply(undefined, args);
      }, false);
    };
  };
  var read = function read(handler) {
    return isFunction(handler) ? {
      can: constant(true),
      abort: constant(false),
      run: handler
    } : handler;
  };
  var fuse = function fuse(handlers) {
    var can = all$1(handlers, function (handler) {
      return handler.can;
    });
    var abort = any(handlers, function (handler) {
      return handler.abort;
    });
    var run = function run() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      each$1(handlers, function (handler) {
        handler.run.apply(undefined, args);
      });
    };
    return nu$4({
      can: can,
      abort: abort,
      run: run
    });
  };

  function ClosestOrAncestor(is, ancestor, scope, a, isRoot) {
    return is(scope, a) ? Option.some(scope) : isFunction(isRoot) && isRoot(scope) ? Option.none() : ancestor(scope, a, isRoot);
  }

  var ancestor = function ancestor(scope, predicate, isRoot) {
    var element = scope.dom();
    var stop = isFunction(isRoot) ? isRoot : constant(false);
    while (element.parentNode) {
      element = element.parentNode;
      var el = Element.fromDom(element);
      if (predicate(el)) {
        return Option.some(el);
      } else if (stop(el)) {
        break;
      }
    }
    return Option.none();
  };
  var closest = function closest(scope, predicate, isRoot) {
    var is = function is(s, test) {
      return test(s);
    };
    return ClosestOrAncestor(is, ancestor, scope, predicate, isRoot);
  };
  var descendant = function descendant(scope, predicate) {
    var descend = function descend(node) {
      for (var i = 0; i < node.childNodes.length; i++) {
        var child_1 = Element.fromDom(node.childNodes[i]);
        if (predicate(child_1)) {
          return Option.some(child_1);
        }
        var res = descend(node.childNodes[i]);
        if (res.isSome()) {
          return res;
        }
      }
      return Option.none();
    };
    return descend(scope.dom());
  };

  var closest$1 = function closest$1(target, transform, isRoot) {
    var delegate = closest(target, function (elem) {
      return transform(elem).isSome();
    }, isRoot);
    return delegate.bind(transform);
  };

  var derive = function derive(configs) {
    return wrapAll$1(configs);
  };
  var abort = function abort(name, predicate) {
    return {
      key: name,
      value: nu$4({ abort: predicate })
    };
  };
  var can = function can(name, predicate) {
    return {
      key: name,
      value: nu$4({ can: predicate })
    };
  };
  var run = function run(name, handler) {
    return {
      key: name,
      value: nu$4({ run: handler })
    };
  };
  var runActionExtra = function runActionExtra(name, action, extra) {
    return {
      key: name,
      value: nu$4({
        run: function run(component) {
          action.apply(undefined, [component].concat(extra));
        }
      })
    };
  };
  var runOnName = function runOnName(name) {
    return function (handler) {
      return run(name, handler);
    };
  };
  var runOnSourceName = function runOnSourceName(name) {
    return function (handler) {
      return {
        key: name,
        value: nu$4({
          run: function run(component, simulatedEvent) {
            if (isSource(component, simulatedEvent)) {
              handler(component, simulatedEvent);
            }
          }
        })
      };
    };
  };
  var redirectToUid = function redirectToUid(name, uid) {
    return run(name, function (component, simulatedEvent) {
      component.getSystem().getByUid(uid).each(function (redirectee) {
        dispatchEvent(redirectee, redirectee.element(), name, simulatedEvent);
      });
    });
  };
  var redirectToPart = function redirectToPart(name, detail, partName) {
    var uid = detail.partUids[partName];
    return redirectToUid(name, uid);
  };
  var cutter = function cutter(name) {
    return run(name, function (component, simulatedEvent) {
      simulatedEvent.cut();
    });
  };
  var stopper = function stopper(name) {
    return run(name, function (component, simulatedEvent) {
      simulatedEvent.stop();
    });
  };
  var runOnSource = function runOnSource(name, f) {
    return runOnSourceName(name)(f);
  };
  var runOnAttached = runOnSourceName(attachedToDom());
  var runOnDetached = runOnSourceName(detachedFromDom());
  var runOnInit = runOnSourceName(systemInit());
  var runOnExecute = runOnName(execute());

  var markAsBehaviourApi = function markAsBehaviourApi(f, apiName, apiFunction) {
    var delegate = apiFunction.toString();
    var endIndex = delegate.indexOf(')') + 1;
    var openBracketIndex = delegate.indexOf('(');
    var parameters = delegate.substring(openBracketIndex + 1, endIndex - 1).split(/,\s*/);
    f.toFunctionAnnotation = function () {
      return {
        name: apiName,
        parameters: cleanParameters(parameters.slice(0, 1).concat(parameters.slice(3)))
      };
    };
    return f;
  };
  var cleanParameters = function cleanParameters(parameters) {
    return map$1(parameters, function (p) {
      return endsWith(p, '/*') ? p.substring(0, p.length - '/*'.length) : p;
    });
  };
  var markAsExtraApi = function markAsExtraApi(f, extraName) {
    var delegate = f.toString();
    var endIndex = delegate.indexOf(')') + 1;
    var openBracketIndex = delegate.indexOf('(');
    var parameters = delegate.substring(openBracketIndex + 1, endIndex - 1).split(/,\s*/);
    f.toFunctionAnnotation = function () {
      return {
        name: extraName,
        parameters: cleanParameters(parameters)
      };
    };
    return f;
  };
  var markAsSketchApi = function markAsSketchApi(f, apiFunction) {
    var delegate = apiFunction.toString();
    var endIndex = delegate.indexOf(')') + 1;
    var openBracketIndex = delegate.indexOf('(');
    var parameters = delegate.substring(openBracketIndex + 1, endIndex - 1).split(/,\s*/);
    f.toFunctionAnnotation = function () {
      return {
        name: 'OVERRIDE',
        parameters: cleanParameters(parameters.slice(1))
      };
    };
    return f;
  };

  var nu$5 = function nu$5(s) {
    return {
      classes: s.classes !== undefined ? s.classes : [],
      attributes: s.attributes !== undefined ? s.attributes : {},
      styles: s.styles !== undefined ? s.styles : {}
    };
  };
  var merge$1 = function merge$1(defnA, mod) {
    return _assign(_assign({}, defnA), {
      attributes: _assign(_assign({}, defnA.attributes), mod.attributes),
      styles: _assign(_assign({}, defnA.styles), mod.styles),
      classes: defnA.classes.concat(mod.classes)
    });
  };

  var executeEvent = function executeEvent(bConfig, bState, executor) {
    return runOnExecute(function (component) {
      executor(component, bConfig, bState);
    });
  };
  var loadEvent = function loadEvent(bConfig, bState, f) {
    return runOnInit(function (component, simulatedEvent) {
      f(component, bConfig, bState);
    });
  };
  var create = function create(schema, name, active, apis, extra, state) {
    var configSchema = objOfOnly(schema);
    var schemaSchema = optionObjOf(name, [optionObjOfOnly('config', schema)]);
    return doCreate(configSchema, schemaSchema, name, active, apis, extra, state);
  };
  var createModes = function createModes(modes, name, active, apis, extra, state) {
    var configSchema = modes;
    var schemaSchema = optionObjOf(name, [optionOf('config', modes)]);
    return doCreate(configSchema, schemaSchema, name, active, apis, extra, state);
  };
  var wrapApi = function wrapApi(bName, apiFunction, apiName) {
    var f = function f(component) {
      var rest = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
      }
      var args = [component].concat(rest);
      return component.config({ name: constant(bName) }).fold(function () {
        throw new Error('We could not find any behaviour configuration for: ' + bName + '. Using API: ' + apiName);
      }, function (info) {
        var rest = Array.prototype.slice.call(args, 1);
        return apiFunction.apply(undefined, [component, info.config, info.state].concat(rest));
      });
    };
    return markAsBehaviourApi(f, apiName, apiFunction);
  };
  var revokeBehaviour = function revokeBehaviour(name) {
    return {
      key: name,
      value: undefined
    };
  };
  var doCreate = function doCreate(configSchema, schemaSchema, _name, active, apis, extra, state) {
    var getConfig = function getConfig(info) {
      return hasKey$1(info, _name) ? info[_name]() : Option.none();
    };
    var wrappedApis = map(apis, function (apiF, apiName) {
      return wrapApi(_name, apiF, apiName);
    });
    var wrappedExtra = map(extra, function (extraF, extraName) {
      return markAsExtraApi(extraF, extraName);
    });
    var me = _assign(_assign(_assign({}, wrappedExtra), wrappedApis), {
      revoke: curry(revokeBehaviour, _name),
      config: function config(spec) {
        var prepared = asRawOrDie(_name + '-config', configSchema, spec);
        return {
          key: _name,
          value: {
            config: prepared,
            me: me,
            configAsRaw: cached(function () {
              return asRawOrDie(_name + '-config', configSchema, spec);
            }),
            initialConfig: spec,
            state: state
          }
        };
      },
      schema: function schema() {
        return schemaSchema;
      },
      exhibit: function exhibit(info, base) {
        return getConfig(info).bind(function (behaviourInfo) {
          return readOptFrom$1(active, 'exhibit').map(function (exhibitor) {
            return exhibitor(base, behaviourInfo.config, behaviourInfo.state);
          });
        }).getOr(nu$5({}));
      },
      name: function name() {
        return _name;
      },
      handlers: function handlers(info) {
        return getConfig(info).map(function (behaviourInfo) {
          var getEvents = readOr$1('events', function (a, b) {
            return {};
          })(active);
          return getEvents(behaviourInfo.config, behaviourInfo.state);
        }).getOr({});
      }
    });
    return me;
  };

  var NoState = {
    init: function init() {
      return nu$6({
        readState: function readState() {
          return 'No State required';
        }
      });
    }
  };
  var nu$6 = function nu$6(spec) {
    return spec;
  };

  var derive$1 = function derive$1(capabilities) {
    return wrapAll$1(capabilities);
  };
  var simpleSchema = objOfOnly([strict$1('fields'), strict$1('name'), defaulted$1('active', {}), defaulted$1('apis', {}), defaulted$1('state', NoState), defaulted$1('extra', {})]);
  var create$1 = function create$1(data) {
    var value = asRawOrDie('Creating behaviour: ' + data.name, simpleSchema, data);
    return create(value.fields, value.name, value.active, value.apis, value.extra, value.state);
  };
  var modeSchema = objOfOnly([strict$1('branchKey'), strict$1('branches'), strict$1('name'), defaulted$1('active', {}), defaulted$1('apis', {}), defaulted$1('state', NoState), defaulted$1('extra', {})]);
  var createModes$1 = function createModes$1(data) {
    var value = asRawOrDie('Creating behaviour: ' + data.name, modeSchema, data);
    return createModes(choose$1(value.branchKey, value.branches), value.name, value.active, value.apis, value.extra, value.state);
  };
  var revoke = constant(undefined);

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
  var setAll = function setAll(element, attrs) {
    var dom = element.dom();
    each(attrs, function (v, k) {
      rawSet(dom, k, v);
    });
  };
  var get = function get(element, key) {
    var v = element.dom().getAttribute(key);
    return v === null ? undefined : v;
  };
  var has$1 = function has$1(element, key) {
    var dom = element.dom();
    return dom && dom.hasAttribute ? dom.hasAttribute(key) : false;
  };
  var remove$1 = function remove$1(element, key) {
    element.dom().removeAttribute(key);
  };

  var read$1 = function read$1(element, attr) {
    var value = get(element, attr);
    return value === undefined || value === '' ? [] : value.split(' ');
  };
  var add = function add(element, attr, id) {
    var old = read$1(element, attr);
    var nu = old.concat([id]);
    set(element, attr, nu.join(' '));
    return true;
  };
  var remove$2 = function remove$2(element, attr, id) {
    var nu = filter(read$1(element, attr), function (v) {
      return v !== id;
    });
    if (nu.length > 0) {
      set(element, attr, nu.join(' '));
    } else {
      remove$1(element, attr);
    }
    return false;
  };

  var supports = function supports(element) {
    return element.dom().classList !== undefined;
  };
  var get$1 = function get$1(element) {
    return read$1(element, 'class');
  };
  var add$1 = function add$1(element, clazz) {
    return add(element, 'class', clazz);
  };
  var remove$3 = function remove$3(element, clazz) {
    return remove$2(element, 'class', clazz);
  };

  var add$2 = function add$2(element, clazz) {
    if (supports(element)) {
      element.dom().classList.add(clazz);
    } else {
      add$1(element, clazz);
    }
  };
  var cleanClass = function cleanClass(element) {
    var classList = supports(element) ? element.dom().classList : get$1(element);
    if (classList.length === 0) {
      remove$1(element, 'class');
    }
  };
  var remove$4 = function remove$4(element, clazz) {
    if (supports(element)) {
      var classList = element.dom().classList;
      classList.remove(clazz);
    } else {
      remove$3(element, clazz);
    }
    cleanClass(element);
  };
  var has$2 = function has$2(element, clazz) {
    return supports(element) && element.dom().classList.contains(clazz);
  };

  var swap = function swap(element, addCls, removeCls) {
    remove$4(element, removeCls);
    add$2(element, addCls);
  };
  var toAlpha = function toAlpha(component, swapConfig, swapState) {
    swap(component.element(), swapConfig.alpha, swapConfig.omega);
  };
  var toOmega = function toOmega(component, swapConfig, swapState) {
    swap(component.element(), swapConfig.omega, swapConfig.alpha);
  };
  var clear = function clear(component, swapConfig, swapState) {
    remove$4(component.element(), swapConfig.alpha);
    remove$4(component.element(), swapConfig.omega);
  };
  var isAlpha = function isAlpha(component, swapConfig, swapState) {
    return has$2(component.element(), swapConfig.alpha);
  };
  var isOmega = function isOmega(component, swapConfig, swapState) {
    return has$2(component.element(), swapConfig.omega);
  };

  var SwapApis = /*#__PURE__*/Object.freeze({
    toAlpha: toAlpha,
    toOmega: toOmega,
    isAlpha: isAlpha,
    isOmega: isOmega,
    clear: clear
  });

  var SwapSchema = [strict$1('alpha'), strict$1('omega')];

  var Swapping = create$1({
    fields: SwapSchema,
    name: 'swapping',
    apis: SwapApis
  });

  var focus$1 = function focus$1(element) {
    element.dom().focus();
  };
  var blur = function blur(element) {
    element.dom().blur();
  };
  var hasFocus = function hasFocus(element) {
    var doc = owner(element).dom();
    return element.dom() === doc.activeElement;
  };
  var active = function active(_doc) {
    var doc = _doc !== undefined ? _doc.dom() : domGlobals.document;
    return Option.from(doc.activeElement).map(Element.fromDom);
  };
  var search = function search(element) {
    return active(owner(element)).filter(function (e) {
      return element.dom().contains(e.dom());
    });
  };

  var global$1 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

  var global$2 = tinymce.util.Tools.resolve('tinymce.ThemeManager');

  var openLink = function openLink(target) {
    var link = domGlobals.document.createElement('a');
    link.target = '_blank';
    link.href = target.href;
    link.rel = 'noreferrer noopener';
    var nuEvt = domGlobals.document.createEvent('MouseEvents');
    nuEvt.initMouseEvent('click', true, true, domGlobals.window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    domGlobals.document.body.appendChild(link);
    link.dispatchEvent(nuEvt);
    domGlobals.document.body.removeChild(link);
  };
  var TinyCodeDupe = { openLink: openLink };

  var isSkinDisabled = function isSkinDisabled(editor) {
    return editor.settings.skin === false;
  };
  var _readOnlyOnInit = function _readOnlyOnInit(editor) {
    return false;
  };

  var formatChanged = 'formatChanged';
  var orientationChanged = 'orientationChanged';
  var dropupDismissed = 'dropupDismissed';
  var TinyChannels = {
    formatChanged: constant(formatChanged),
    orientationChanged: constant(orientationChanged),
    dropupDismissed: constant(dropupDismissed)
  };

  var fromHtml$1 = function fromHtml$1(html, scope) {
    var doc = scope || domGlobals.document;
    var div = doc.createElement('div');
    div.innerHTML = html;
    return children(Element.fromDom(div));
  };

  var get$2 = function get$2(element) {
    return element.dom().innerHTML;
  };
  var set$1 = function set$1(element, content) {
    var owner$1 = owner(element);
    var docDom = owner$1.dom();
    var fragment = Element.fromDom(docDom.createDocumentFragment());
    var contentElements = fromHtml$1(content, docDom);
    append$1(fragment, contentElements);
    empty(element);
    append(element, fragment);
  };
  var getOuter = function getOuter(element) {
    var container = Element.fromTag('div');
    var clone = Element.fromDom(element.dom().cloneNode(true));
    append(container, clone);
    return get$2(container);
  };

  var clone = function clone(original, isDeep) {
    return Element.fromDom(original.dom().cloneNode(isDeep));
  };
  var shallow$1 = function shallow$1(original) {
    return clone(original, false);
  };

  var getHtml = function getHtml(element) {
    var clone = shallow$1(element);
    return getOuter(clone);
  };

  var element = function element(elem) {
    return getHtml(elem);
  };

  var chooseChannels = function chooseChannels(channels, message) {
    return message.universal() ? channels : filter(channels, function (ch) {
      return contains(message.channels(), ch);
    });
  };
  var events = function events(receiveConfig) {
    return derive([run(receive(), function (component, message) {
      var channelMap = receiveConfig.channels;
      var channels = keys(channelMap);
      var targetChannels = chooseChannels(channels, message);
      each$1(targetChannels, function (ch) {
        var channelInfo = channelMap[ch];
        var channelSchema = channelInfo.schema;
        var data = asRawOrDie('channel[' + ch + '] data\nReceiver: ' + element(component.element()), channelSchema, message.data());
        channelInfo.onReceive(component, data);
      });
    })]);
  };

  var ActiveReceiving = /*#__PURE__*/Object.freeze({
    events: events
  });

  var cat = function cat(arr) {
    var r = [];
    var push = function push(x) {
      r.push(x);
    };
    for (var i = 0; i < arr.length; i++) {
      arr[i].each(push);
    }
    return r;
  };
  var sequence = function sequence(arr) {
    var r = [];
    for (var i = 0; i < arr.length; i++) {
      var x = arr[i];
      if (x.isSome()) {
        r.push(x.getOrDie());
      } else {
        return Option.none();
      }
    }
    return Option.some(r);
  };
  var findMap = function findMap(arr, f) {
    for (var i = 0; i < arr.length; i++) {
      var r = f(arr[i], i);
      if (r.isSome()) {
        return r;
      }
    }
    return Option.none();
  };
  var someIf = function someIf(b, a) {
    return b ? Option.some(a) : Option.none();
  };

  var unknown$3 = 'unknown';
  var EventConfiguration;
  (function (EventConfiguration) {
    EventConfiguration[EventConfiguration['STOP'] = 0] = 'STOP';
    EventConfiguration[EventConfiguration['NORMAL'] = 1] = 'NORMAL';
    EventConfiguration[EventConfiguration['LOGGING'] = 2] = 'LOGGING';
  })(EventConfiguration || (EventConfiguration = {}));
  var eventConfig = Cell({});
  var makeEventLogger = function makeEventLogger(eventName, initialTarget) {
    var sequence = [];
    var startTime = new Date().getTime();
    return {
      logEventCut: function logEventCut(name, target, purpose) {
        sequence.push({
          outcome: 'cut',
          target: target,
          purpose: purpose
        });
      },
      logEventStopped: function logEventStopped(name, target, purpose) {
        sequence.push({
          outcome: 'stopped',
          target: target,
          purpose: purpose
        });
      },
      logNoParent: function logNoParent(name, target, purpose) {
        sequence.push({
          outcome: 'no-parent',
          target: target,
          purpose: purpose
        });
      },
      logEventNoHandlers: function logEventNoHandlers(name, target) {
        sequence.push({
          outcome: 'no-handlers-left',
          target: target
        });
      },
      logEventResponse: function logEventResponse(name, target, purpose) {
        sequence.push({
          outcome: 'response',
          purpose: purpose,
          target: target
        });
      },
      write: function write() {
        var finishTime = new Date().getTime();
        if (contains(['mousemove', 'mouseover', 'mouseout', systemInit()], eventName)) {
          return;
        }
        domGlobals.console.log(eventName, {
          event: eventName,
          time: finishTime - startTime,
          target: initialTarget.dom(),
          sequence: map$1(sequence, function (s) {
            if (!contains(['cut', 'stopped', 'response'], s.outcome)) {
              return s.outcome;
            } else {
              return '{' + s.purpose + '} ' + s.outcome + ' at (' + element(s.target) + ')';
            }
          })
        });
      }
    };
  };
  var processEvent = function processEvent(eventName, initialTarget, f) {
    var status = readOptFrom$1(eventConfig.get(), eventName).orThunk(function () {
      var patterns = keys(eventConfig.get());
      return findMap(patterns, function (p) {
        return eventName.indexOf(p) > -1 ? Option.some(eventConfig.get()[p]) : Option.none();
      });
    }).getOr(EventConfiguration.NORMAL);
    switch (status) {
      case EventConfiguration.NORMAL:
        return f(noLogger());
      case EventConfiguration.LOGGING:
        {
          var logger = makeEventLogger(eventName, initialTarget);
          var output = f(logger);
          logger.write();
          return output;
        }
      case EventConfiguration.STOP:
        return true;
    }
  };
  var path = ['alloy/data/Fields', 'alloy/debugging/Debugging'];
  var getTrace = function getTrace() {
    var err = new Error();
    if (err.stack !== undefined) {
      var lines = err.stack.split('\n');
      return find$2(lines, function (line) {
        return line.indexOf('alloy') > 0 && !exists(path, function (p) {
          return line.indexOf(p) > -1;
        });
      }).getOr(unknown$3);
    } else {
      return unknown$3;
    }
  };
  var ignoreEvent = {
    logEventCut: noop,
    logEventStopped: noop,
    logNoParent: noop,
    logEventNoHandlers: noop,
    logEventResponse: noop,
    write: noop
  };
  var monitorEvent = function monitorEvent(eventName, initialTarget, f) {
    return processEvent(eventName, initialTarget, f);
  };
  var noLogger = constant(ignoreEvent);

  var menuFields = constant([strict$1('menu'), strict$1('selectedMenu')]);
  var itemFields = constant([strict$1('item'), strict$1('selectedItem')]);
  var schema = constant(objOf(itemFields().concat(menuFields())));
  var itemSchema = constant(objOf(itemFields()));

  var _initSize = strictObjOf('initSize', [strict$1('numColumns'), strict$1('numRows')]);
  var itemMarkers = function itemMarkers() {
    return strictOf('markers', itemSchema());
  };
  var tieredMenuMarkers = function tieredMenuMarkers() {
    return strictObjOf('markers', [strict$1('backgroundMenu')].concat(menuFields()).concat(itemFields()));
  };
  var markers = function markers(required) {
    return strictObjOf('markers', map$1(required, strict$1));
  };
  var onPresenceHandler = function onPresenceHandler(label, fieldName, presence) {
    var trace = getTrace();
    return field(fieldName, fieldName, presence, valueOf(function (f) {
      return Result.value(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return f.apply(undefined, args);
      });
    }));
  };
  var onHandler = function onHandler(fieldName) {
    return onPresenceHandler('onHandler', fieldName, defaulted(noop));
  };
  var onKeyboardHandler = function onKeyboardHandler(fieldName) {
    return onPresenceHandler('onKeyboardHandler', fieldName, defaulted(Option.none));
  };
  var onStrictHandler = function onStrictHandler(fieldName) {
    return onPresenceHandler('onHandler', fieldName, strict());
  };
  var onStrictKeyboardHandler = function onStrictKeyboardHandler(fieldName) {
    return onPresenceHandler('onKeyboardHandler', fieldName, strict());
  };
  var output = function output(name, value) {
    return state$1(name, constant(value));
  };
  var snapshot = function snapshot(name) {
    return state$1(name, identity);
  };
  var initSize = constant(_initSize);

  var ReceivingSchema = [strictOf('channels', setOf$1(Result.value, objOfOnly([onStrictHandler('onReceive'), defaulted$1('schema', anyValue$1())])))];

  var Receiving = create$1({
    fields: ReceivingSchema,
    name: 'receiving',
    active: ActiveReceiving
  });

  var updateAriaState = function updateAriaState(component, toggleConfig, toggleState) {
    var ariaInfo = toggleConfig.aria;
    ariaInfo.update(component, ariaInfo, toggleState.get());
  };
  var updateClass = function updateClass(component, toggleConfig, toggleState) {
    toggleConfig.toggleClass.each(function (toggleClass) {
      if (toggleState.get()) {
        add$2(component.element(), toggleClass);
      } else {
        remove$4(component.element(), toggleClass);
      }
    });
  };
  var toggle = function toggle(component, toggleConfig, toggleState) {
    set$2(component, toggleConfig, toggleState, !toggleState.get());
  };
  var on = function on(component, toggleConfig, toggleState) {
    toggleState.set(true);
    updateClass(component, toggleConfig, toggleState);
    updateAriaState(component, toggleConfig, toggleState);
  };
  var off = function off(component, toggleConfig, toggleState) {
    toggleState.set(false);
    updateClass(component, toggleConfig, toggleState);
    updateAriaState(component, toggleConfig, toggleState);
  };
  var set$2 = function set$2(component, toggleConfig, toggleState, state) {
    var action = state ? on : off;
    action(component, toggleConfig, toggleState);
  };
  var isOn = function isOn(component, toggleConfig, toggleState) {
    return toggleState.get();
  };
  var onLoad = function onLoad(component, toggleConfig, toggleState) {
    set$2(component, toggleConfig, toggleState, toggleConfig.selected);
  };

  var ToggleApis = /*#__PURE__*/Object.freeze({
    onLoad: onLoad,
    toggle: toggle,
    isOn: isOn,
    on: on,
    off: off,
    set: set$2
  });

  var exhibit = function exhibit(base, toggleConfig, toggleState) {
    return nu$5({});
  };
  var events$1 = function events$1(toggleConfig, toggleState) {
    var execute = executeEvent(toggleConfig, toggleState, toggle);
    var load = loadEvent(toggleConfig, toggleState, onLoad);
    return derive(flatten([toggleConfig.toggleOnExecute ? [execute] : [], [load]]));
  };

  var ActiveToggle = /*#__PURE__*/Object.freeze({
    exhibit: exhibit,
    events: events$1
  });

  var SetupBehaviourCellState = function SetupBehaviourCellState(initialState) {
    var init = function init() {
      var cell = Cell(initialState);
      var get = function get() {
        return cell.get();
      };
      var set = function set(newState) {
        return cell.set(newState);
      };
      var clear = function clear() {
        return cell.set(initialState);
      };
      var readState = function readState() {
        return cell.get();
      };
      return {
        get: get,
        set: set,
        clear: clear,
        readState: readState
      };
    };
    return { init: init };
  };

  var updatePressed = function updatePressed(component, ariaInfo, status) {
    set(component.element(), 'aria-pressed', status);
    if (ariaInfo.syncWithExpanded) {
      updateExpanded(component, ariaInfo, status);
    }
  };
  var updateSelected = function updateSelected(component, ariaInfo, status) {
    set(component.element(), 'aria-selected', status);
  };
  var updateChecked = function updateChecked(component, ariaInfo, status) {
    set(component.element(), 'aria-checked', status);
  };
  var updateExpanded = function updateExpanded(component, ariaInfo, status) {
    set(component.element(), 'aria-expanded', status);
  };

  var ToggleSchema = [defaulted$1('selected', false), option('toggleClass'), defaulted$1('toggleOnExecute', true), defaultedOf('aria', { mode: 'none' }, choose$1('mode', {
    pressed: [defaulted$1('syncWithExpanded', false), output('update', updatePressed)],
    checked: [output('update', updateChecked)],
    expanded: [output('update', updateExpanded)],
    selected: [output('update', updateSelected)],
    none: [output('update', noop)]
  }))];

  var Toggling = create$1({
    fields: ToggleSchema,
    name: 'toggling',
    active: ActiveToggle,
    apis: ToggleApis,
    state: SetupBehaviourCellState(false)
  });

  var format = function format(command, update) {
    return Receiving.config({
      channels: wrap$1(TinyChannels.formatChanged(), {
        onReceive: function onReceive(button, data) {
          if (data.command === command) {
            update(button, data.state);
          }
        }
      })
    });
  };
  var orientation = function orientation(onReceive) {
    return Receiving.config({ channels: wrap$1(TinyChannels.orientationChanged(), { onReceive: onReceive }) });
  };
  var receive$1 = function receive$1(channel, onReceive) {
    return {
      key: channel,
      value: { onReceive: onReceive }
    };
  };
  var Receivers = {
    format: format,
    orientation: orientation,
    receive: receive$1
  };

  var prefix = 'tinymce-mobile';
  var resolve = function resolve(p) {
    return prefix + '-' + p;
  };
  var Styles = {
    resolve: resolve,
    prefix: constant(prefix)
  };

  var events$2 = function events$2(optAction) {
    var executeHandler = function executeHandler(action) {
      return run(execute(), function (component, simulatedEvent) {
        action(component);
        simulatedEvent.stop();
      });
    };
    var onClick = function onClick(component, simulatedEvent) {
      simulatedEvent.stop();
      emitExecute(component);
    };
    var onMousedown = function onMousedown(component, simulatedEvent) {
      simulatedEvent.cut();
    };
    var pointerEvents = detect$3().deviceType.isTouch() ? [run(tap(), onClick)] : [run(click(), onClick), run(mousedown(), onMousedown)];
    return derive(flatten([optAction.map(executeHandler).toArray(), pointerEvents]));
  };

  var focus$2 = function focus$2(component, focusConfig) {
    if (!focusConfig.ignore) {
      focus$1(component.element());
      focusConfig.onFocus(component);
    }
  };
  var blur$1 = function blur$1(component, focusConfig) {
    if (!focusConfig.ignore) {
      blur(component.element());
    }
  };
  var isFocused = function isFocused(component) {
    return hasFocus(component.element());
  };

  var FocusApis = /*#__PURE__*/Object.freeze({
    focus: focus$2,
    blur: blur$1,
    isFocused: isFocused
  });

  var exhibit$1 = function exhibit$1(base, focusConfig) {
    var mod = focusConfig.ignore ? {} : { attributes: { tabindex: '-1' } };
    return nu$5(mod);
  };
  var events$3 = function events$3(focusConfig) {
    return derive([run(focus(), function (component, simulatedEvent) {
      focus$2(component, focusConfig);
      simulatedEvent.stop();
    })].concat(focusConfig.stopMousedown ? [run(mousedown(), function (_, simulatedEvent) {
      simulatedEvent.event().prevent();
    })] : []));
  };

  var ActiveFocus = /*#__PURE__*/Object.freeze({
    exhibit: exhibit$1,
    events: events$3
  });

  var FocusSchema = [onHandler('onFocus'), defaulted$1('stopMousedown', false), defaulted$1('ignore', false)];

  var Focusing = create$1({
    fields: FocusSchema,
    name: 'focusing',
    active: ActiveFocus,
    apis: FocusApis
  });

  var isSupported = function isSupported(dom) {
    return dom.style !== undefined && isFunction(dom.style.getPropertyValue);
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
  var internalRemove = function internalRemove(dom, property) {
    if (isSupported(dom)) {
      dom.style.removeProperty(property);
    }
  };
  var set$3 = function set$3(element, property, value) {
    var dom = element.dom();
    internalSet(dom, property, value);
  };
  var setAll$1 = function setAll$1(element, css) {
    var dom = element.dom();
    each(css, function (v, k) {
      internalSet(dom, k, v);
    });
  };
  var get$3 = function get$3(element, property) {
    var dom = element.dom();
    var styles = domGlobals.window.getComputedStyle(dom);
    var r = styles.getPropertyValue(property);
    var v = r === '' && !inBody(element) ? getUnsafeProperty(dom, property) : r;
    return v === null ? undefined : v;
  };
  var getUnsafeProperty = function getUnsafeProperty(dom, property) {
    return isSupported(dom) ? dom.style.getPropertyValue(property) : '';
  };
  var getRaw = function getRaw(element, property) {
    var dom = element.dom();
    var raw = getUnsafeProperty(dom, property);
    return Option.from(raw).filter(function (r) {
      return r.length > 0;
    });
  };
  var remove$5 = function remove$5(element, property) {
    var dom = element.dom();
    internalRemove(dom, property);
    if (has$1(element, 'style') && trim(get(element, 'style')) === '') {
      remove$1(element, 'style');
    }
  };
  var reflow = function reflow(e) {
    return e.dom().offsetWidth;
  };

  function Dimension(name, getOffset) {
    var set = function set(element, h) {
      if (!isNumber(h) && !h.match(/^[0-9]+$/)) {
        throw new Error(name + '.set accepts only positive integer values. Value was ' + h);
      }
      var dom = element.dom();
      if (isSupported(dom)) {
        dom.style[name] = h + 'px';
      }
    };
    var get = function get(element) {
      var r = getOffset(element);
      if (r <= 0 || r === null) {
        var css = get$3(element, name);
        return parseFloat(css) || 0;
      }
      return r;
    };
    var getOuter = get;
    var aggregate = function aggregate(element, properties) {
      return foldl(properties, function (acc, property) {
        var val = get$3(element, property);
        var value = val === undefined ? 0 : parseInt(val, 10);
        return isNaN(value) ? acc : acc + value;
      }, 0);
    };
    var max = function max(element, value, properties) {
      var cumulativeInclusions = aggregate(element, properties);
      var absoluteMax = value > cumulativeInclusions ? value - cumulativeInclusions : 0;
      return absoluteMax;
    };
    return {
      set: set,
      get: get,
      getOuter: getOuter,
      aggregate: aggregate,
      max: max
    };
  }

  var api = Dimension('height', function (element) {
    var dom = element.dom();
    return inBody(element) ? dom.getBoundingClientRect().height : dom.offsetHeight;
  });
  var get$4 = function get$4(element) {
    return api.get(element);
  };

  var ancestors = function ancestors(scope, predicate, isRoot) {
    return filter(parents(scope, isRoot), predicate);
  };
  var siblings$1 = function siblings$1(scope, predicate) {
    return filter(siblings(scope), predicate);
  };

  var all$2 = function all$2(selector) {
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
  var descendants = function descendants(scope, selector) {
    return all(selector, scope);
  };

  var first = function first(selector) {
    return one(selector);
  };
  var ancestor$1 = function ancestor$1(scope, selector, isRoot) {
    return ancestor(scope, function (e) {
      return is(e, selector);
    }, isRoot);
  };
  var descendant$1 = function descendant$1(scope, selector) {
    return one(selector, scope);
  };
  var closest$2 = function closest$2(scope, selector, isRoot) {
    return ClosestOrAncestor(is, ancestor$1, scope, selector, isRoot);
  };

  var BACKSPACE = function BACKSPACE() {
    return [8];
  };
  var TAB = function TAB() {
    return [9];
  };
  var ENTER = function ENTER() {
    return [13];
  };
  var ESCAPE = function ESCAPE() {
    return [27];
  };
  var SPACE = function SPACE() {
    return [32];
  };
  var LEFT = function LEFT() {
    return [37];
  };
  var UP = function UP() {
    return [38];
  };
  var RIGHT = function RIGHT() {
    return [39];
  };
  var DOWN = function DOWN() {
    return [40];
  };

  var cyclePrev = function cyclePrev(values, index, predicate) {
    var before = reverse(values.slice(0, index));
    var after = reverse(values.slice(index + 1));
    return find$2(before.concat(after), predicate);
  };
  var tryPrev = function tryPrev(values, index, predicate) {
    var before = reverse(values.slice(0, index));
    return find$2(before, predicate);
  };
  var cycleNext = function cycleNext(values, index, predicate) {
    var before = values.slice(0, index);
    var after = values.slice(index + 1);
    return find$2(after.concat(before), predicate);
  };
  var tryNext = function tryNext(values, index, predicate) {
    var after = values.slice(index + 1);
    return find$2(after, predicate);
  };

  var inSet = function inSet(keys) {
    return function (event) {
      var raw = event.raw();
      return contains(keys, raw.which);
    };
  };
  var and = function and(preds) {
    return function (event) {
      return forall(preds, function (pred) {
        return pred(event);
      });
    };
  };
  var isShift = function isShift(event) {
    var raw = event.raw();
    return raw.shiftKey === true;
  };
  var isControl = function isControl(event) {
    var raw = event.raw();
    return raw.ctrlKey === true;
  };
  var isNotShift = not(isShift);

  var rule = function rule(matches, action) {
    return {
      matches: matches,
      classification: action
    };
  };
  var choose$2 = function choose$2(transitions, event) {
    var transition = find$2(transitions, function (t) {
      return t.matches(event);
    });
    return transition.map(function (t) {
      return t.classification;
    });
  };

  var cycleBy = function cycleBy(value, delta, min, max) {
    var r = value + delta;
    if (r > max) {
      return min;
    } else {
      return r < min ? max : r;
    }
  };
  var cap = function cap(value, min, max) {
    if (value <= min) {
      return min;
    } else {
      return value >= max ? max : value;
    }
  };

  var dehighlightAllExcept = function dehighlightAllExcept(component, hConfig, hState, skip) {
    var highlighted = descendants(component.element(), '.' + hConfig.highlightClass);
    each$1(highlighted, function (h) {
      if (!exists(skip, function (skipComp) {
        return skipComp.element() === h;
      })) {
        remove$4(h, hConfig.highlightClass);
        component.getSystem().getByDom(h).each(function (target) {
          hConfig.onDehighlight(component, target);
          emit(target, dehighlight());
        });
      }
    });
  };
  var dehighlightAll = function dehighlightAll(component, hConfig, hState) {
    return dehighlightAllExcept(component, hConfig, hState, []);
  };
  var dehighlight$1 = function dehighlight$1(component, hConfig, hState, target) {
    if (isHighlighted(component, hConfig, hState, target)) {
      remove$4(target.element(), hConfig.highlightClass);
      hConfig.onDehighlight(component, target);
      emit(target, dehighlight());
    }
  };
  var highlight$1 = function highlight$1(component, hConfig, hState, target) {
    dehighlightAllExcept(component, hConfig, hState, [target]);
    if (!isHighlighted(component, hConfig, hState, target)) {
      add$2(target.element(), hConfig.highlightClass);
      hConfig.onHighlight(component, target);
      emit(target, highlight());
    }
  };
  var highlightFirst = function highlightFirst(component, hConfig, hState) {
    getFirst(component, hConfig).each(function (firstComp) {
      highlight$1(component, hConfig, hState, firstComp);
    });
  };
  var highlightLast = function highlightLast(component, hConfig, hState) {
    getLast(component, hConfig).each(function (lastComp) {
      highlight$1(component, hConfig, hState, lastComp);
    });
  };
  var highlightAt = function highlightAt(component, hConfig, hState, index) {
    getByIndex(component, hConfig, hState, index).fold(function (err) {
      throw new Error(err);
    }, function (firstComp) {
      highlight$1(component, hConfig, hState, firstComp);
    });
  };
  var highlightBy = function highlightBy(component, hConfig, hState, predicate) {
    var candidates = getCandidates(component, hConfig);
    var targetComp = find$2(candidates, predicate);
    targetComp.each(function (c) {
      highlight$1(component, hConfig, hState, c);
    });
  };
  var isHighlighted = function isHighlighted(component, hConfig, hState, queryTarget) {
    return has$2(queryTarget.element(), hConfig.highlightClass);
  };
  var getHighlighted = function getHighlighted(component, hConfig, hState) {
    return descendant$1(component.element(), '.' + hConfig.highlightClass).bind(function (e) {
      return component.getSystem().getByDom(e).toOption();
    });
  };
  var getByIndex = function getByIndex(component, hConfig, hState, index) {
    var items = descendants(component.element(), '.' + hConfig.itemClass);
    return Option.from(items[index]).fold(function () {
      return Result.error('No element found with index ' + index);
    }, component.getSystem().getByDom);
  };
  var getFirst = function getFirst(component, hConfig, hState) {
    return descendant$1(component.element(), '.' + hConfig.itemClass).bind(function (e) {
      return component.getSystem().getByDom(e).toOption();
    });
  };
  var getLast = function getLast(component, hConfig, hState) {
    var items = descendants(component.element(), '.' + hConfig.itemClass);
    var last = items.length > 0 ? Option.some(items[items.length - 1]) : Option.none();
    return last.bind(function (c) {
      return component.getSystem().getByDom(c).toOption();
    });
  };
  var getDelta = function getDelta(component, hConfig, hState, delta) {
    var items = descendants(component.element(), '.' + hConfig.itemClass);
    var current = findIndex(items, function (item) {
      return has$2(item, hConfig.highlightClass);
    });
    return current.bind(function (selected) {
      var dest = cycleBy(selected, delta, 0, items.length - 1);
      return component.getSystem().getByDom(items[dest]).toOption();
    });
  };
  var getPrevious = function getPrevious(component, hConfig, hState) {
    return getDelta(component, hConfig, hState, -1);
  };
  var getNext = function getNext(component, hConfig, hState) {
    return getDelta(component, hConfig, hState, +1);
  };
  var getCandidates = function getCandidates(component, hConfig, hState) {
    var items = descendants(component.element(), '.' + hConfig.itemClass);
    return cat(map$1(items, function (i) {
      return component.getSystem().getByDom(i).toOption();
    }));
  };

  var HighlightApis = /*#__PURE__*/Object.freeze({
    dehighlightAll: dehighlightAll,
    dehighlight: dehighlight$1,
    highlight: highlight$1,
    highlightFirst: highlightFirst,
    highlightLast: highlightLast,
    highlightAt: highlightAt,
    highlightBy: highlightBy,
    isHighlighted: isHighlighted,
    getHighlighted: getHighlighted,
    getFirst: getFirst,
    getLast: getLast,
    getPrevious: getPrevious,
    getNext: getNext,
    getCandidates: getCandidates
  });

  var HighlightSchema = [strict$1('highlightClass'), strict$1('itemClass'), onHandler('onHighlight'), onHandler('onDehighlight')];

  var Highlighting = create$1({
    fields: HighlightSchema,
    name: 'highlighting',
    apis: HighlightApis
  });

  var reportFocusShifting = function reportFocusShifting(component, prevFocus, newFocus) {
    var noChange = prevFocus.exists(function (p) {
      return newFocus.exists(function (n) {
        return eq(n, p);
      });
    });
    if (!noChange) {
      emitWith(component, focusShifted(), {
        prevFocus: prevFocus,
        newFocus: newFocus
      });
    }
  };
  var dom = function dom() {
    var get = function get(component) {
      return search(component.element());
    };
    var set = function set(component, focusee) {
      var prevFocus = get(component);
      component.getSystem().triggerFocus(focusee, component.element());
      var newFocus = get(component);
      reportFocusShifting(component, prevFocus, newFocus);
    };
    return {
      get: get,
      set: set
    };
  };
  var highlights = function highlights() {
    var get = function get(component) {
      return Highlighting.getHighlighted(component).map(function (item) {
        return item.element();
      });
    };
    var set = function set(component, element) {
      var prevFocus = get(component);
      component.getSystem().getByDom(element).fold(noop, function (item) {
        Highlighting.highlight(component, item);
      });
      var newFocus = get(component);
      reportFocusShifting(component, prevFocus, newFocus);
    };
    return {
      get: get,
      set: set
    };
  };

  var FocusInsideModes;
  (function (FocusInsideModes) {
    FocusInsideModes['OnFocusMode'] = 'onFocus';
    FocusInsideModes['OnEnterOrSpaceMode'] = 'onEnterOrSpace';
    FocusInsideModes['OnApiMode'] = 'onApi';
  })(FocusInsideModes || (FocusInsideModes = {}));

  var typical = function typical(infoSchema, stateInit, getKeydownRules, getKeyupRules, optFocusIn) {
    var schema = function schema() {
      return infoSchema.concat([defaulted$1('focusManager', dom()), defaultedOf('focusInside', 'onFocus', valueOf(function (val) {
        return contains(['onFocus', 'onEnterOrSpace', 'onApi'], val) ? Result.value(val) : Result.error('Invalid value for focusInside');
      })), output('handler', me), output('state', stateInit), output('sendFocusIn', optFocusIn)]);
    };
    var processKey = function processKey(component, simulatedEvent, getRules, keyingConfig, keyingState) {
      var rules = getRules(component, simulatedEvent, keyingConfig, keyingState);
      return choose$2(rules, simulatedEvent.event()).bind(function (rule) {
        return rule(component, simulatedEvent, keyingConfig, keyingState);
      });
    };
    var toEvents = function toEvents(keyingConfig, keyingState) {
      var onFocusHandler = keyingConfig.focusInside !== FocusInsideModes.OnFocusMode ? Option.none() : optFocusIn(keyingConfig).map(function (focusIn) {
        return run(focus(), function (component, simulatedEvent) {
          focusIn(component, keyingConfig, keyingState);
          simulatedEvent.stop();
        });
      });
      var tryGoInsideComponent = function tryGoInsideComponent(component, simulatedEvent) {
        var isEnterOrSpace = inSet(SPACE().concat(ENTER()))(simulatedEvent.event());
        if (keyingConfig.focusInside === FocusInsideModes.OnEnterOrSpaceMode && isEnterOrSpace && isSource(component, simulatedEvent)) {
          optFocusIn(keyingConfig).each(function (focusIn) {
            focusIn(component, keyingConfig, keyingState);
            simulatedEvent.stop();
          });
        }
      };
      return derive(onFocusHandler.toArray().concat([run(keydown(), function (component, simulatedEvent) {
        processKey(component, simulatedEvent, getKeydownRules, keyingConfig, keyingState).fold(function () {
          tryGoInsideComponent(component, simulatedEvent);
        }, function (_) {
          simulatedEvent.stop();
        });
      }), run(keyup(), function (component, simulatedEvent) {
        processKey(component, simulatedEvent, getKeyupRules, keyingConfig, keyingState).each(function (_) {
          simulatedEvent.stop();
        });
      })]));
    };
    var me = {
      schema: schema,
      processKey: processKey,
      toEvents: toEvents
    };
    return me;
  };

  var create$2 = function create$2(cyclicField) {
    var schema = [option('onEscape'), option('onEnter'), defaulted$1('selector', '[data-alloy-tabstop="true"]:not(:disabled)'), defaulted$1('firstTabstop', 0), defaulted$1('useTabstopAt', constant(true)), option('visibilitySelector')].concat([cyclicField]);
    var isVisible = function isVisible(tabbingConfig, element) {
      var target = tabbingConfig.visibilitySelector.bind(function (sel) {
        return closest$2(element, sel);
      }).getOr(element);
      return get$4(target) > 0;
    };
    var findInitial = function findInitial(component, tabbingConfig) {
      var tabstops = descendants(component.element(), tabbingConfig.selector);
      var visibles = filter(tabstops, function (elem) {
        return isVisible(tabbingConfig, elem);
      });
      return Option.from(visibles[tabbingConfig.firstTabstop]);
    };
    var findCurrent = function findCurrent(component, tabbingConfig) {
      return tabbingConfig.focusManager.get(component).bind(function (elem) {
        return closest$2(elem, tabbingConfig.selector);
      });
    };
    var isTabstop = function isTabstop(tabbingConfig, element) {
      return isVisible(tabbingConfig, element) && tabbingConfig.useTabstopAt(element);
    };
    var focusIn = function focusIn(component, tabbingConfig) {
      findInitial(component, tabbingConfig).each(function (target) {
        tabbingConfig.focusManager.set(component, target);
      });
    };
    var goFromTabstop = function goFromTabstop(component, tabstops, stopIndex, tabbingConfig, cycle) {
      return cycle(tabstops, stopIndex, function (elem) {
        return isTabstop(tabbingConfig, elem);
      }).fold(function () {
        return tabbingConfig.cyclic ? Option.some(true) : Option.none();
      }, function (target) {
        tabbingConfig.focusManager.set(component, target);
        return Option.some(true);
      });
    };
    var go = function go(component, simulatedEvent, tabbingConfig, cycle) {
      var tabstops = descendants(component.element(), tabbingConfig.selector);
      return findCurrent(component, tabbingConfig).bind(function (tabstop) {
        var optStopIndex = findIndex(tabstops, curry(eq, tabstop));
        return optStopIndex.bind(function (stopIndex) {
          return goFromTabstop(component, tabstops, stopIndex, tabbingConfig, cycle);
        });
      });
    };
    var goBackwards = function goBackwards(component, simulatedEvent, tabbingConfig, tabbingState) {
      var navigate = tabbingConfig.cyclic ? cyclePrev : tryPrev;
      return go(component, simulatedEvent, tabbingConfig, navigate);
    };
    var goForwards = function goForwards(component, simulatedEvent, tabbingConfig, tabbingState) {
      var navigate = tabbingConfig.cyclic ? cycleNext : tryNext;
      return go(component, simulatedEvent, tabbingConfig, navigate);
    };
    var execute = function execute(component, simulatedEvent, tabbingConfig, tabbingState) {
      return tabbingConfig.onEnter.bind(function (f) {
        return f(component, simulatedEvent);
      });
    };
    var exit = function exit(component, simulatedEvent, tabbingConfig, tabbingState) {
      return tabbingConfig.onEscape.bind(function (f) {
        return f(component, simulatedEvent);
      });
    };
    var getKeydownRules = constant([rule(and([isShift, inSet(TAB())]), goBackwards), rule(inSet(TAB()), goForwards), rule(inSet(ESCAPE()), exit), rule(and([isNotShift, inSet(ENTER())]), execute)]);
    var getKeyupRules = constant([]);
    return typical(schema, NoState.init, getKeydownRules, getKeyupRules, function () {
      return Option.some(focusIn);
    });
  };

  var AcyclicType = create$2(state$1('cyclic', constant(false)));

  var CyclicType = create$2(state$1('cyclic', constant(true)));

  var inside = function inside(target) {
    return name(target) === 'input' && get(target, 'type') !== 'radio' || name(target) === 'textarea';
  };

  var doDefaultExecute = function doDefaultExecute(component, simulatedEvent, focused) {
    dispatch(component, focused, execute());
    return Option.some(true);
  };
  var defaultExecute = function defaultExecute(component, simulatedEvent, focused) {
    return inside(focused) && inSet(SPACE())(simulatedEvent.event()) ? Option.none() : doDefaultExecute(component, simulatedEvent, focused);
  };
  var stopEventForFirefox = function stopEventForFirefox(component, simulatedEvent) {
    return Option.some(true);
  };

  var schema$1 = [defaulted$1('execute', defaultExecute), defaulted$1('useSpace', false), defaulted$1('useEnter', true), defaulted$1('useControlEnter', false), defaulted$1('useDown', false)];
  var execute$1 = function execute$1(component, simulatedEvent, executeConfig) {
    return executeConfig.execute(component, simulatedEvent, component.element());
  };
  var getKeydownRules = function getKeydownRules(component, simulatedEvent, executeConfig, executeState) {
    var spaceExec = executeConfig.useSpace && !inside(component.element()) ? SPACE() : [];
    var enterExec = executeConfig.useEnter ? ENTER() : [];
    var downExec = executeConfig.useDown ? DOWN() : [];
    var execKeys = spaceExec.concat(enterExec).concat(downExec);
    return [rule(inSet(execKeys), execute$1)].concat(executeConfig.useControlEnter ? [rule(and([isControl, inSet(ENTER())]), execute$1)] : []);
  };
  var getKeyupRules = function getKeyupRules(component, simulatedEvent, executeConfig, executeState) {
    return executeConfig.useSpace && !inside(component.element()) ? [rule(inSet(SPACE()), stopEventForFirefox)] : [];
  };
  var ExecutionType = typical(schema$1, NoState.init, getKeydownRules, getKeyupRules, function () {
    return Option.none();
  });

  var flatgrid = function flatgrid(spec) {
    var dimensions = Cell(Option.none());
    var setGridSize = function setGridSize(numRows, numColumns) {
      dimensions.set(Option.some({
        numRows: constant(numRows),
        numColumns: constant(numColumns)
      }));
    };
    var getNumRows = function getNumRows() {
      return dimensions.get().map(function (d) {
        return d.numRows();
      });
    };
    var getNumColumns = function getNumColumns() {
      return dimensions.get().map(function (d) {
        return d.numColumns();
      });
    };
    return nu$6({
      readState: function readState() {
        return dimensions.get().map(function (d) {
          return {
            numRows: d.numRows(),
            numColumns: d.numColumns()
          };
        }).getOr({
          numRows: '?',
          numColumns: '?'
        });
      },
      setGridSize: setGridSize,
      getNumRows: getNumRows,
      getNumColumns: getNumColumns
    });
  };
  var init = function init(spec) {
    return spec.state(spec);
  };

  var KeyingState = /*#__PURE__*/Object.freeze({
    flatgrid: flatgrid,
    init: init
  });

  var onDirection = function onDirection(isLtr, isRtl) {
    return function (element) {
      return getDirection(element) === 'rtl' ? isRtl : isLtr;
    };
  };
  var getDirection = function getDirection(element) {
    return get$3(element, 'direction') === 'rtl' ? 'rtl' : 'ltr';
  };

  var useH = function useH(movement) {
    return function (component, simulatedEvent, config, state) {
      var move = movement(component.element());
      return use(move, component, simulatedEvent, config, state);
    };
  };
  var west = function west(moveLeft, moveRight) {
    var movement = onDirection(moveLeft, moveRight);
    return useH(movement);
  };
  var east = function east(moveLeft, moveRight) {
    var movement = onDirection(moveRight, moveLeft);
    return useH(movement);
  };
  var useV = function useV(move) {
    return function (component, simulatedEvent, config, state) {
      return use(move, component, simulatedEvent, config, state);
    };
  };
  var use = function use(move, component, simulatedEvent, config, state) {
    var outcome = config.focusManager.get(component).bind(function (focused) {
      return move(component.element(), focused, config, state);
    });
    return outcome.map(function (newFocus) {
      config.focusManager.set(component, newFocus);
      return true;
    });
  };
  var north = useV;
  var south = useV;
  var move = useV;

  var isHidden = function isHidden(dom) {
    return dom.offsetWidth <= 0 && dom.offsetHeight <= 0;
  };
  var isVisible = function isVisible(element) {
    var dom = element.dom();
    return !isHidden(dom);
  };

  var indexInfo = MixedBag(['index', 'candidates'], []);
  var locate = function locate(candidates, predicate) {
    return findIndex(candidates, predicate).map(function (index) {
      return indexInfo({
        index: index,
        candidates: candidates
      });
    });
  };

  var locateVisible = function locateVisible(container, current, selector) {
    var predicate = curry(eq, current);
    var candidates = descendants(container, selector);
    var visible = filter(candidates, isVisible);
    return locate(visible, predicate);
  };
  var findIndex$1 = function findIndex$1(elements, target) {
    return findIndex(elements, function (elem) {
      return eq(target, elem);
    });
  };

  var withGrid = function withGrid(values, index, numCols, f) {
    var oldRow = Math.floor(index / numCols);
    var oldColumn = index % numCols;
    return f(oldRow, oldColumn).bind(function (address) {
      var newIndex = address.row() * numCols + address.column();
      return newIndex >= 0 && newIndex < values.length ? Option.some(values[newIndex]) : Option.none();
    });
  };
  var cycleHorizontal = function cycleHorizontal(values, index, numRows, numCols, delta) {
    return withGrid(values, index, numCols, function (oldRow, oldColumn) {
      var onLastRow = oldRow === numRows - 1;
      var colsInRow = onLastRow ? values.length - oldRow * numCols : numCols;
      var newColumn = cycleBy(oldColumn, delta, 0, colsInRow - 1);
      return Option.some({
        row: constant(oldRow),
        column: constant(newColumn)
      });
    });
  };
  var cycleVertical = function cycleVertical(values, index, numRows, numCols, delta) {
    return withGrid(values, index, numCols, function (oldRow, oldColumn) {
      var newRow = cycleBy(oldRow, delta, 0, numRows - 1);
      var onLastRow = newRow === numRows - 1;
      var colsInRow = onLastRow ? values.length - newRow * numCols : numCols;
      var newCol = cap(oldColumn, 0, colsInRow - 1);
      return Option.some({
        row: constant(newRow),
        column: constant(newCol)
      });
    });
  };
  var cycleRight = function cycleRight(values, index, numRows, numCols) {
    return cycleHorizontal(values, index, numRows, numCols, +1);
  };
  var cycleLeft = function cycleLeft(values, index, numRows, numCols) {
    return cycleHorizontal(values, index, numRows, numCols, -1);
  };
  var cycleUp = function cycleUp(values, index, numRows, numCols) {
    return cycleVertical(values, index, numRows, numCols, -1);
  };
  var cycleDown = function cycleDown(values, index, numRows, numCols) {
    return cycleVertical(values, index, numRows, numCols, +1);
  };

  var schema$2 = [strict$1('selector'), defaulted$1('execute', defaultExecute), onKeyboardHandler('onEscape'), defaulted$1('captureTab', false), initSize()];
  var focusIn = function focusIn(component, gridConfig, gridState) {
    descendant$1(component.element(), gridConfig.selector).each(function (first) {
      gridConfig.focusManager.set(component, first);
    });
  };
  var findCurrent = function findCurrent(component, gridConfig) {
    return gridConfig.focusManager.get(component).bind(function (elem) {
      return closest$2(elem, gridConfig.selector);
    });
  };
  var execute$2 = function execute$2(component, simulatedEvent, gridConfig, gridState) {
    return findCurrent(component, gridConfig).bind(function (focused) {
      return gridConfig.execute(component, simulatedEvent, focused);
    });
  };
  var doMove = function doMove(cycle) {
    return function (element, focused, gridConfig, gridState) {
      return locateVisible(element, focused, gridConfig.selector).bind(function (identified) {
        return cycle(identified.candidates(), identified.index(), gridState.getNumRows().getOr(gridConfig.initSize.numRows), gridState.getNumColumns().getOr(gridConfig.initSize.numColumns));
      });
    };
  };
  var handleTab = function handleTab(component, simulatedEvent, gridConfig, gridState) {
    return gridConfig.captureTab ? Option.some(true) : Option.none();
  };
  var doEscape = function doEscape(component, simulatedEvent, gridConfig, gridState) {
    return gridConfig.onEscape(component, simulatedEvent);
  };
  var moveLeft = doMove(cycleLeft);
  var moveRight = doMove(cycleRight);
  var moveNorth = doMove(cycleUp);
  var moveSouth = doMove(cycleDown);
  var getKeydownRules$1 = constant([rule(inSet(LEFT()), west(moveLeft, moveRight)), rule(inSet(RIGHT()), east(moveLeft, moveRight)), rule(inSet(UP()), north(moveNorth)), rule(inSet(DOWN()), south(moveSouth)), rule(and([isShift, inSet(TAB())]), handleTab), rule(and([isNotShift, inSet(TAB())]), handleTab), rule(inSet(ESCAPE()), doEscape), rule(inSet(SPACE().concat(ENTER())), execute$2)]);
  var getKeyupRules$1 = constant([rule(inSet(SPACE()), stopEventForFirefox)]);
  var FlatgridType = typical(schema$2, flatgrid, getKeydownRules$1, getKeyupRules$1, function () {
    return Option.some(focusIn);
  });

  var horizontal = function horizontal(container, selector, current, delta) {
    var isDisabledButton = function isDisabledButton(candidate) {
      return name(candidate) === 'button' && get(candidate, 'disabled') === 'disabled';
    };
    var tryCycle = function tryCycle(initial, index, candidates) {
      var newIndex = cycleBy(index, delta, 0, candidates.length - 1);
      if (newIndex === initial) {
        return Option.none();
      } else {
        return isDisabledButton(candidates[newIndex]) ? tryCycle(initial, newIndex, candidates) : Option.from(candidates[newIndex]);
      }
    };
    return locateVisible(container, current, selector).bind(function (identified) {
      var index = identified.index();
      var candidates = identified.candidates();
      return tryCycle(index, index, candidates);
    });
  };

  var schema$3 = [strict$1('selector'), defaulted$1('getInitial', Option.none), defaulted$1('execute', defaultExecute), onKeyboardHandler('onEscape'), defaulted$1('executeOnMove', false), defaulted$1('allowVertical', true)];
  var findCurrent$1 = function findCurrent$1(component, flowConfig) {
    return flowConfig.focusManager.get(component).bind(function (elem) {
      return closest$2(elem, flowConfig.selector);
    });
  };
  var execute$3 = function execute$3(component, simulatedEvent, flowConfig) {
    return findCurrent$1(component, flowConfig).bind(function (focused) {
      return flowConfig.execute(component, simulatedEvent, focused);
    });
  };
  var focusIn$1 = function focusIn$1(component, flowConfig) {
    flowConfig.getInitial(component).orThunk(function () {
      return descendant$1(component.element(), flowConfig.selector);
    }).each(function (first) {
      flowConfig.focusManager.set(component, first);
    });
  };
  var moveLeft$1 = function moveLeft$1(element, focused, info) {
    return horizontal(element, info.selector, focused, -1);
  };
  var moveRight$1 = function moveRight$1(element, focused, info) {
    return horizontal(element, info.selector, focused, +1);
  };
  var doMove$1 = function doMove$1(movement) {
    return function (component, simulatedEvent, flowConfig) {
      return movement(component, simulatedEvent, flowConfig).bind(function () {
        return flowConfig.executeOnMove ? execute$3(component, simulatedEvent, flowConfig) : Option.some(true);
      });
    };
  };
  var doEscape$1 = function doEscape$1(component, simulatedEvent, flowConfig, _flowState) {
    return flowConfig.onEscape(component, simulatedEvent);
  };
  var getKeydownRules$2 = function getKeydownRules$2(_component, _se, flowConfig, _flowState) {
    var westMovers = LEFT().concat(flowConfig.allowVertical ? UP() : []);
    var eastMovers = RIGHT().concat(flowConfig.allowVertical ? DOWN() : []);
    return [rule(inSet(westMovers), doMove$1(west(moveLeft$1, moveRight$1))), rule(inSet(eastMovers), doMove$1(east(moveLeft$1, moveRight$1))), rule(inSet(ENTER()), execute$3), rule(inSet(SPACE()), execute$3), rule(inSet(ESCAPE()), doEscape$1)];
  };
  var getKeyupRules$2 = constant([rule(inSet(SPACE()), stopEventForFirefox)]);
  var FlowType = typical(schema$3, NoState.init, getKeydownRules$2, getKeyupRules$2, function () {
    return Option.some(focusIn$1);
  });

  var outcome = MixedBag(['rowIndex', 'columnIndex', 'cell'], []);
  var toCell = function toCell(matrix, rowIndex, columnIndex) {
    return Option.from(matrix[rowIndex]).bind(function (row) {
      return Option.from(row[columnIndex]).map(function (cell) {
        return outcome({
          rowIndex: rowIndex,
          columnIndex: columnIndex,
          cell: cell
        });
      });
    });
  };
  var cycleHorizontal$1 = function cycleHorizontal$1(matrix, rowIndex, startCol, deltaCol) {
    var row = matrix[rowIndex];
    var colsInRow = row.length;
    var newColIndex = cycleBy(startCol, deltaCol, 0, colsInRow - 1);
    return toCell(matrix, rowIndex, newColIndex);
  };
  var cycleVertical$1 = function cycleVertical$1(matrix, colIndex, startRow, deltaRow) {
    var nextRowIndex = cycleBy(startRow, deltaRow, 0, matrix.length - 1);
    var colsInNextRow = matrix[nextRowIndex].length;
    var nextColIndex = cap(colIndex, 0, colsInNextRow - 1);
    return toCell(matrix, nextRowIndex, nextColIndex);
  };
  var moveHorizontal = function moveHorizontal(matrix, rowIndex, startCol, deltaCol) {
    var row = matrix[rowIndex];
    var colsInRow = row.length;
    var newColIndex = cap(startCol + deltaCol, 0, colsInRow - 1);
    return toCell(matrix, rowIndex, newColIndex);
  };
  var moveVertical = function moveVertical(matrix, colIndex, startRow, deltaRow) {
    var nextRowIndex = cap(startRow + deltaRow, 0, matrix.length - 1);
    var colsInNextRow = matrix[nextRowIndex].length;
    var nextColIndex = cap(colIndex, 0, colsInNextRow - 1);
    return toCell(matrix, nextRowIndex, nextColIndex);
  };
  var cycleRight$1 = function cycleRight$1(matrix, startRow, startCol) {
    return cycleHorizontal$1(matrix, startRow, startCol, +1);
  };
  var cycleLeft$1 = function cycleLeft$1(matrix, startRow, startCol) {
    return cycleHorizontal$1(matrix, startRow, startCol, -1);
  };
  var cycleUp$1 = function cycleUp$1(matrix, startRow, startCol) {
    return cycleVertical$1(matrix, startCol, startRow, -1);
  };
  var cycleDown$1 = function cycleDown$1(matrix, startRow, startCol) {
    return cycleVertical$1(matrix, startCol, startRow, +1);
  };
  var moveLeft$2 = function moveLeft$2(matrix, startRow, startCol) {
    return moveHorizontal(matrix, startRow, startCol, -1);
  };
  var moveRight$2 = function moveRight$2(matrix, startRow, startCol) {
    return moveHorizontal(matrix, startRow, startCol, +1);
  };
  var moveUp = function moveUp(matrix, startRow, startCol) {
    return moveVertical(matrix, startCol, startRow, -1);
  };
  var moveDown = function moveDown(matrix, startRow, startCol) {
    return moveVertical(matrix, startCol, startRow, +1);
  };

  var schema$4 = [strictObjOf('selectors', [strict$1('row'), strict$1('cell')]), defaulted$1('cycles', true), defaulted$1('previousSelector', Option.none), defaulted$1('execute', defaultExecute)];
  var focusIn$2 = function focusIn$2(component, matrixConfig) {
    var focused = matrixConfig.previousSelector(component).orThunk(function () {
      var selectors = matrixConfig.selectors;
      return descendant$1(component.element(), selectors.cell);
    });
    focused.each(function (cell) {
      matrixConfig.focusManager.set(component, cell);
    });
  };
  var execute$4 = function execute$4(component, simulatedEvent, matrixConfig) {
    return search(component.element()).bind(function (focused) {
      return matrixConfig.execute(component, simulatedEvent, focused);
    });
  };
  var toMatrix = function toMatrix(rows, matrixConfig) {
    return map$1(rows, function (row) {
      return descendants(row, matrixConfig.selectors.cell);
    });
  };
  var doMove$2 = function doMove$2(ifCycle, ifMove) {
    return function (element, focused, matrixConfig) {
      var move = matrixConfig.cycles ? ifCycle : ifMove;
      return closest$2(focused, matrixConfig.selectors.row).bind(function (inRow) {
        var cellsInRow = descendants(inRow, matrixConfig.selectors.cell);
        return findIndex$1(cellsInRow, focused).bind(function (colIndex) {
          var allRows = descendants(element, matrixConfig.selectors.row);
          return findIndex$1(allRows, inRow).bind(function (rowIndex) {
            var matrix = toMatrix(allRows, matrixConfig);
            return move(matrix, rowIndex, colIndex).map(function (next) {
              return next.cell();
            });
          });
        });
      });
    };
  };
  var moveLeft$3 = doMove$2(cycleLeft$1, moveLeft$2);
  var moveRight$3 = doMove$2(cycleRight$1, moveRight$2);
  var moveNorth$1 = doMove$2(cycleUp$1, moveUp);
  var moveSouth$1 = doMove$2(cycleDown$1, moveDown);
  var getKeydownRules$3 = constant([rule(inSet(LEFT()), west(moveLeft$3, moveRight$3)), rule(inSet(RIGHT()), east(moveLeft$3, moveRight$3)), rule(inSet(UP()), north(moveNorth$1)), rule(inSet(DOWN()), south(moveSouth$1)), rule(inSet(SPACE().concat(ENTER())), execute$4)]);
  var getKeyupRules$3 = constant([rule(inSet(SPACE()), stopEventForFirefox)]);
  var MatrixType = typical(schema$4, NoState.init, getKeydownRules$3, getKeyupRules$3, function () {
    return Option.some(focusIn$2);
  });

  var schema$5 = [strict$1('selector'), defaulted$1('execute', defaultExecute), defaulted$1('moveOnTab', false)];
  var execute$5 = function execute$5(component, simulatedEvent, menuConfig) {
    return menuConfig.focusManager.get(component).bind(function (focused) {
      return menuConfig.execute(component, simulatedEvent, focused);
    });
  };
  var focusIn$3 = function focusIn$3(component, menuConfig) {
    descendant$1(component.element(), menuConfig.selector).each(function (first) {
      menuConfig.focusManager.set(component, first);
    });
  };
  var moveUp$1 = function moveUp$1(element, focused, info) {
    return horizontal(element, info.selector, focused, -1);
  };
  var moveDown$1 = function moveDown$1(element, focused, info) {
    return horizontal(element, info.selector, focused, +1);
  };
  var fireShiftTab = function fireShiftTab(component, simulatedEvent, menuConfig) {
    return menuConfig.moveOnTab ? move(moveUp$1)(component, simulatedEvent, menuConfig) : Option.none();
  };
  var fireTab = function fireTab(component, simulatedEvent, menuConfig) {
    return menuConfig.moveOnTab ? move(moveDown$1)(component, simulatedEvent, menuConfig) : Option.none();
  };
  var getKeydownRules$4 = constant([rule(inSet(UP()), move(moveUp$1)), rule(inSet(DOWN()), move(moveDown$1)), rule(and([isShift, inSet(TAB())]), fireShiftTab), rule(and([isNotShift, inSet(TAB())]), fireTab), rule(inSet(ENTER()), execute$5), rule(inSet(SPACE()), execute$5)]);
  var getKeyupRules$4 = constant([rule(inSet(SPACE()), stopEventForFirefox)]);
  var MenuType = typical(schema$5, NoState.init, getKeydownRules$4, getKeyupRules$4, function () {
    return Option.some(focusIn$3);
  });

  var schema$6 = [onKeyboardHandler('onSpace'), onKeyboardHandler('onEnter'), onKeyboardHandler('onShiftEnter'), onKeyboardHandler('onLeft'), onKeyboardHandler('onRight'), onKeyboardHandler('onTab'), onKeyboardHandler('onShiftTab'), onKeyboardHandler('onUp'), onKeyboardHandler('onDown'), onKeyboardHandler('onEscape'), defaulted$1('stopSpaceKeyup', false), option('focusIn')];
  var getKeydownRules$5 = function getKeydownRules$5(component, simulatedEvent, specialInfo) {
    return [rule(inSet(SPACE()), specialInfo.onSpace), rule(and([isNotShift, inSet(ENTER())]), specialInfo.onEnter), rule(and([isShift, inSet(ENTER())]), specialInfo.onShiftEnter), rule(and([isShift, inSet(TAB())]), specialInfo.onShiftTab), rule(and([isNotShift, inSet(TAB())]), specialInfo.onTab), rule(inSet(UP()), specialInfo.onUp), rule(inSet(DOWN()), specialInfo.onDown), rule(inSet(LEFT()), specialInfo.onLeft), rule(inSet(RIGHT()), specialInfo.onRight), rule(inSet(SPACE()), specialInfo.onSpace), rule(inSet(ESCAPE()), specialInfo.onEscape)];
  };
  var getKeyupRules$5 = function getKeyupRules$5(component, simulatedEvent, specialInfo) {
    return specialInfo.stopSpaceKeyup ? [rule(inSet(SPACE()), stopEventForFirefox)] : [];
  };
  var SpecialType = typical(schema$6, NoState.init, getKeydownRules$5, getKeyupRules$5, function (specialInfo) {
    return specialInfo.focusIn;
  });

  var acyclic = AcyclicType.schema();
  var cyclic = CyclicType.schema();
  var flow = FlowType.schema();
  var flatgrid$1 = FlatgridType.schema();
  var matrix = MatrixType.schema();
  var execution = ExecutionType.schema();
  var menu = MenuType.schema();
  var special = SpecialType.schema();

  var KeyboardBranches = /*#__PURE__*/Object.freeze({
    acyclic: acyclic,
    cyclic: cyclic,
    flow: flow,
    flatgrid: flatgrid$1,
    matrix: matrix,
    execution: execution,
    menu: menu,
    special: special
  });

  var Keying = createModes$1({
    branchKey: 'mode',
    branches: KeyboardBranches,
    name: 'keying',
    active: {
      events: function events(keyingConfig, keyingState) {
        var handler = keyingConfig.handler;
        return handler.toEvents(keyingConfig, keyingState);
      }
    },
    apis: {
      focusIn: function focusIn(component, keyConfig, keyState) {
        keyConfig.sendFocusIn(keyConfig).fold(function () {
          component.getSystem().triggerFocus(component.element(), component.element());
        }, function (sendFocusIn) {
          sendFocusIn(component, keyConfig, keyState);
        });
      },
      setGridSize: function setGridSize(component, keyConfig, keyState, numRows, numColumns) {
        if (!hasKey$1(keyState, 'setGridSize')) {
          domGlobals.console.error('Layout does not support setGridSize');
        } else {
          keyState.setGridSize(numRows, numColumns);
        }
      }
    },
    state: KeyingState
  });

  var field$1 = function field$1(name, forbidden) {
    return defaultedObjOf(name, {}, map$1(forbidden, function (f) {
      return forbid(f.name(), 'Cannot configure ' + f.name() + ' for ' + name);
    }).concat([state$1('dump', identity)]));
  };
  var get$5 = function get$5(data) {
    return data.dump;
  };
  var augment = function augment(data, original) {
    return _assign(_assign({}, data.dump), derive$1(original));
  };
  var SketchBehaviours = {
    field: field$1,
    augment: augment,
    get: get$5
  };

  var _placeholder = 'placeholder';
  var adt$2 = Adt.generate([{
    single: ['required', 'valueThunk']
  }, {
    multiple: ['required', 'valueThunks']
  }]);
  var subPlaceholder = function subPlaceholder(owner, detail, compSpec, placeholders) {
    if (owner.exists(function (o) {
      return o !== compSpec.owner;
    })) {
      return adt$2.single(true, constant(compSpec));
    }
    return readOptFrom$1(placeholders, compSpec.name).fold(function () {
      throw new Error('Unknown placeholder component: ' + compSpec.name + '\nKnown: [' + keys(placeholders) + ']\nNamespace: ' + owner.getOr('none') + '\nSpec: ' + JSON.stringify(compSpec, null, 2));
    }, function (newSpec) {
      return newSpec.replace();
    });
  };
  var scan = function scan(owner, detail, compSpec, placeholders) {
    if (compSpec.uiType === _placeholder) {
      return subPlaceholder(owner, detail, compSpec, placeholders);
    } else {
      return adt$2.single(false, constant(compSpec));
    }
  };
  var substitute = function substitute(owner, detail, compSpec, placeholders) {
    var base = scan(owner, detail, compSpec, placeholders);
    return base.fold(function (req, valueThunk) {
      var value = valueThunk(detail, compSpec.config, compSpec.validated);
      var childSpecs = readOptFrom$1(value, 'components').getOr([]);
      var substituted = bind(childSpecs, function (c) {
        return substitute(owner, detail, c, placeholders);
      });
      return [_assign(_assign({}, value), { components: substituted })];
    }, function (req, valuesThunk) {
      var values = valuesThunk(detail, compSpec.config, compSpec.validated);
      var preprocessor = compSpec.validated.preprocess.getOr(identity);
      return preprocessor(values);
    });
  };
  var substituteAll = function substituteAll(owner, detail, components, placeholders) {
    return bind(components, function (c) {
      return substitute(owner, detail, c, placeholders);
    });
  };
  var oneReplace = function oneReplace(label, replacements) {
    var called = false;
    var used = function used() {
      return called;
    };
    var replace = function replace() {
      if (called === true) {
        throw new Error('Trying to use the same placeholder more than once: ' + label);
      }
      called = true;
      return replacements;
    };
    var required = function required() {
      return replacements.fold(function (req, _) {
        return req;
      }, function (req, _) {
        return req;
      });
    };
    return {
      name: constant(label),
      required: required,
      used: used,
      replace: replace
    };
  };
  var substitutePlaces = function substitutePlaces(owner, detail, components, placeholders) {
    var ps = map(placeholders, function (ph, name) {
      return oneReplace(name, ph);
    });
    var outcome = substituteAll(owner, detail, components, ps);
    each(ps, function (p) {
      if (p.used() === false && p.required()) {
        throw new Error('Placeholder: ' + p.name() + ' was not found in components list\nNamespace: ' + owner.getOr('none') + '\nComponents: ' + JSON.stringify(detail.components, null, 2));
      }
    });
    return outcome;
  };
  var single = adt$2.single;
  var multiple = adt$2.multiple;
  var placeholder = constant(_placeholder);

  var unique = 0;
  var generate$1 = function generate$1(prefix) {
    var date = new Date();
    var time = date.getTime();
    var random = Math.floor(Math.random() * 1000000000);
    unique++;
    return prefix + '_' + random + unique + String(time);
  };

  var adt$3 = Adt.generate([{ required: ['data'] }, { external: ['data'] }, { optional: ['data'] }, { group: ['data'] }]);
  var fFactory = defaulted$1('factory', { sketch: identity });
  var fSchema = defaulted$1('schema', []);
  var fName = strict$1('name');
  var fPname = field('pname', 'pname', defaultedThunk(function (typeSpec) {
    return '<alloy.' + generate$1(typeSpec.name) + '>';
  }), anyValue$1());
  var fGroupSchema = state$1('schema', function () {
    return [option('preprocess')];
  });
  var fDefaults = defaulted$1('defaults', constant({}));
  var fOverrides = defaulted$1('overrides', constant({}));
  var requiredSpec = objOf([fFactory, fSchema, fName, fPname, fDefaults, fOverrides]);
  var optionalSpec = objOf([fFactory, fSchema, fName, fPname, fDefaults, fOverrides]);
  var groupSpec = objOf([fFactory, fGroupSchema, fName, strict$1('unit'), fPname, fDefaults, fOverrides]);
  var asNamedPart = function asNamedPart(part) {
    return part.fold(Option.some, Option.none, Option.some, Option.some);
  };
  var name$1 = function name$1(part) {
    var get = function get(data) {
      return data.name;
    };
    return part.fold(get, get, get, get);
  };
  var convert = function convert(adtConstructor, partSchema) {
    return function (spec) {
      var data = asRawOrDie('Converting part type', partSchema, spec);
      return adtConstructor(data);
    };
  };
  var required = convert(adt$3.required, requiredSpec);
  var optional = convert(adt$3.optional, optionalSpec);
  var group = convert(adt$3.group, groupSpec);
  var original = constant('entirety');

  var combine = function combine(detail, data, partSpec, partValidated) {
    return deepMerge(data.defaults(detail, partSpec, partValidated), partSpec, { uid: detail.partUids[data.name] }, data.overrides(detail, partSpec, partValidated));
  };
  var subs = function subs(owner, detail, parts) {
    var internals = {};
    var externals = {};
    each$1(parts, function (part) {
      part.fold(function (data) {
        internals[data.pname] = single(true, function (detail, partSpec, partValidated) {
          return data.factory.sketch(combine(detail, data, partSpec, partValidated));
        });
      }, function (data) {
        var partSpec = detail.parts[data.name];
        externals[data.name] = constant(data.factory.sketch(combine(detail, data, partSpec[original()]), partSpec));
      }, function (data) {
        internals[data.pname] = single(false, function (detail, partSpec, partValidated) {
          return data.factory.sketch(combine(detail, data, partSpec, partValidated));
        });
      }, function (data) {
        internals[data.pname] = multiple(true, function (detail, _partSpec, _partValidated) {
          var units = detail[data.name];
          return map$1(units, function (u) {
            return data.factory.sketch(deepMerge(data.defaults(detail, u, _partValidated), u, data.overrides(detail, u)));
          });
        });
      });
    });
    return {
      internals: constant(internals),
      externals: constant(externals)
    };
  };

  var generate$2 = function generate$2(owner, parts) {
    var r = {};
    each$1(parts, function (part) {
      asNamedPart(part).each(function (np) {
        var g = doGenerateOne(owner, np.pname);
        r[np.name] = function (config) {
          var validated = asRawOrDie('Part: ' + np.name + ' in ' + owner, objOf(np.schema), config);
          return _assign(_assign({}, g), {
            config: config,
            validated: validated
          });
        };
      });
    });
    return r;
  };
  var doGenerateOne = function doGenerateOne(owner, pname) {
    return {
      uiType: placeholder(),
      owner: owner,
      name: pname
    };
  };
  var generateOne = function generateOne(owner, pname, config) {
    return {
      uiType: placeholder(),
      owner: owner,
      name: pname,
      config: config,
      validated: {}
    };
  };
  var schemas = function schemas(parts) {
    return bind(parts, function (part) {
      return part.fold(Option.none, Option.some, Option.none, Option.none).map(function (data) {
        return strictObjOf(data.name, data.schema.concat([snapshot(original())]));
      }).toArray();
    });
  };
  var names = function names(parts) {
    return map$1(parts, name$1);
  };
  var substitutes = function substitutes(owner, detail, parts) {
    return subs(owner, detail, parts);
  };
  var components = function components(owner, detail, internals) {
    return substitutePlaces(Option.some(owner), detail, detail.components, internals);
  };
  var getPart = function getPart(component, detail, partKey) {
    var uid = detail.partUids[partKey];
    return component.getSystem().getByUid(uid).toOption();
  };
  var getPartOrDie = function getPartOrDie(component, detail, partKey) {
    return getPart(component, detail, partKey).getOrDie('Could not find part: ' + partKey);
  };
  var getAllParts = function getAllParts(component, detail) {
    var system = component.getSystem();
    return map(detail.partUids, function (pUid, k) {
      return constant(system.getByUid(pUid));
    });
  };
  var defaultUids = function defaultUids(baseUid, partTypes) {
    var partNames = names(partTypes);
    return wrapAll$1(map$1(partNames, function (pn) {
      return {
        key: pn,
        value: baseUid + '-' + pn
      };
    }));
  };
  var defaultUidsSchema = function defaultUidsSchema(partTypes) {
    return field('partUids', 'partUids', mergeWithThunk(function (spec) {
      return defaultUids(spec.uid, partTypes);
    }), anyValue$1());
  };

  var premadeTag = generate$1('alloy-premade');
  var premade = function premade(comp) {
    return wrap$1(premadeTag, comp);
  };
  var getPremade = function getPremade(spec) {
    return readOptFrom$1(spec, premadeTag);
  };
  var makeApi = function makeApi(f) {
    return markAsSketchApi(function (component) {
      var rest = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
      }
      return f.apply(undefined, [component.getApis()].concat([component].concat(rest)));
    }, f);
  };

  var prefix$1 = constant('alloy-id-');
  var idAttr = constant('data-alloy-id');

  var prefix$2 = prefix$1();
  var idAttr$1 = idAttr();
  var write = function write(label, elem) {
    var id = generate$1(prefix$2 + label);
    writeOnly(elem, id);
    return id;
  };
  var writeOnly = function writeOnly(elem, uid) {
    Object.defineProperty(elem.dom(), idAttr$1, {
      value: uid,
      writable: true
    });
  };
  var read$2 = function read$2(elem) {
    var id = isElement(elem) ? elem.dom()[idAttr$1] : null;
    return Option.from(id);
  };
  var generate$3 = function generate$3(prefix) {
    return generate$1(prefix);
  };

  var base = function base(partSchemas, partUidsSchemas) {
    var ps = partSchemas.length > 0 ? [strictObjOf('parts', partSchemas)] : [];
    return ps.concat([strict$1('uid'), defaulted$1('dom', {}), defaulted$1('components', []), snapshot('originalSpec'), defaulted$1('debug.sketcher', {})]).concat(partUidsSchemas);
  };
  var asRawOrDie$1 = function asRawOrDie$1(label, schema, spec, partSchemas, partUidsSchemas) {
    var baseS = base(partSchemas, partUidsSchemas);
    return asRawOrDie(label + ' [SpecSchema]', objOfOnly(baseS.concat(schema)), spec);
  };

  var single$1 = function single$1(owner, schema, factory, spec) {
    var specWithUid = supplyUid(spec);
    var detail = asRawOrDie$1(owner, schema, specWithUid, [], []);
    return factory(detail, specWithUid);
  };
  var composite = function composite(owner, schema, partTypes, factory, spec) {
    var specWithUid = supplyUid(spec);
    var partSchemas = schemas(partTypes);
    var partUidsSchema = defaultUidsSchema(partTypes);
    var detail = asRawOrDie$1(owner, schema, specWithUid, partSchemas, [partUidsSchema]);
    var subs = substitutes(owner, detail, partTypes);
    var components$1 = components(owner, detail, subs.internals());
    return factory(detail, components$1, specWithUid, subs.externals());
  };
  var supplyUid = function supplyUid(spec) {
    return spec.hasOwnProperty('uid') ? spec : _assign(_assign({}, spec), { uid: generate$3('uid') });
  };

  function isSketchSpec(spec) {
    return spec.uid !== undefined;
  }
  var singleSchema = objOfOnly([strict$1('name'), strict$1('factory'), strict$1('configFields'), defaulted$1('apis', {}), defaulted$1('extraApis', {})]);
  var compositeSchema = objOfOnly([strict$1('name'), strict$1('factory'), strict$1('configFields'), strict$1('partFields'), defaulted$1('apis', {}), defaulted$1('extraApis', {})]);
  var single$2 = function single$2(rawConfig) {
    var config = asRawOrDie('Sketcher for ' + rawConfig.name, singleSchema, rawConfig);
    var sketch = function sketch(spec) {
      return single$1(config.name, config.configFields, config.factory, spec);
    };
    var apis = map(config.apis, makeApi);
    var extraApis = map(config.extraApis, function (f, k) {
      return markAsExtraApi(f, k);
    });
    return _assign(_assign({
      name: constant(config.name),
      partFields: constant([]),
      configFields: constant(config.configFields),
      sketch: sketch
    }, apis), extraApis);
  };
  var composite$1 = function composite$1(rawConfig) {
    var config = asRawOrDie('Sketcher for ' + rawConfig.name, compositeSchema, rawConfig);
    var sketch = function sketch(spec) {
      return composite(config.name, config.configFields, config.partFields, config.factory, spec);
    };
    var parts = generate$2(config.name, config.partFields);
    var apis = map(config.apis, makeApi);
    var extraApis = map(config.extraApis, function (f, k) {
      return markAsExtraApi(f, k);
    });
    return _assign(_assign({
      name: constant(config.name),
      partFields: constant(config.partFields),
      configFields: constant(config.configFields),
      sketch: sketch,
      parts: constant(parts)
    }, apis), extraApis);
  };

  var factory = function factory(detail) {
    var events = events$2(detail.action);
    var tag = detail.dom.tag;
    var lookupAttr = function lookupAttr(attr) {
      return readOptFrom$1(detail.dom, 'attributes').bind(function (attrs) {
        return readOptFrom$1(attrs, attr);
      });
    };
    var getModAttributes = function getModAttributes() {
      if (tag === 'button') {
        var type = lookupAttr('type').getOr('button');
        var roleAttrs = lookupAttr('role').map(function (role) {
          return { role: role };
        }).getOr({});
        return _assign({ type: type }, roleAttrs);
      } else {
        var role = lookupAttr('role').getOr('button');
        return { role: role };
      }
    };
    return {
      uid: detail.uid,
      dom: detail.dom,
      components: detail.components,
      events: events,
      behaviours: SketchBehaviours.augment(detail.buttonBehaviours, [Focusing.config({}), Keying.config({
        mode: 'execution',
        useSpace: true,
        useEnter: true
      })]),
      domModification: { attributes: getModAttributes() },
      eventOrder: detail.eventOrder
    };
  };
  var Button = single$2({
    name: 'Button',
    factory: factory,
    configFields: [defaulted$1('uid', undefined), strict$1('dom'), defaulted$1('components', []), SketchBehaviours.field('buttonBehaviours', [Focusing, Keying]), option('action'), option('role'), defaulted$1('eventOrder', {})]
  });

  var exhibit$2 = function exhibit$2(base, unselectConfig) {
    return nu$5({
      styles: {
        '-webkit-user-select': 'none',
        'user-select': 'none',
        '-ms-user-select': 'none',
        '-moz-user-select': '-moz-none'
      },
      attributes: { unselectable: 'on' }
    });
  };
  var events$4 = function events$4(unselectConfig) {
    return derive([abort(selectstart(), constant(true))]);
  };

  var ActiveUnselecting = /*#__PURE__*/Object.freeze({
    events: events$4,
    exhibit: exhibit$2
  });

  var Unselecting = create$1({
    fields: [],
    name: 'unselecting',
    active: ActiveUnselecting
  });

  var getAttrs = function getAttrs(elem) {
    var attributes = elem.dom().attributes !== undefined ? elem.dom().attributes : [];
    return foldl(attributes, function (b, attr) {
      var _a;
      if (attr.name === 'class') {
        return b;
      } else {
        return _assign(_assign({}, b), (_a = {}, _a[attr.name] = attr.value, _a));
      }
    }, {});
  };
  var getClasses = function getClasses(elem) {
    return Array.prototype.slice.call(elem.dom().classList, 0);
  };
  var fromHtml$2 = function fromHtml$2(html) {
    var elem = Element.fromHtml(html);
    var children$1 = children(elem);
    var attrs = getAttrs(elem);
    var classes = getClasses(elem);
    var contents = children$1.length === 0 ? {} : { innerHtml: get$2(elem) };
    return _assign({
      tag: name(elem),
      classes: classes,
      attributes: attrs
    }, contents);
  };

  var dom$1 = function dom$1(rawHtml) {
    var html = supplant(rawHtml, { prefix: Styles.prefix() });
    return fromHtml$2(html);
  };
  var spec = function spec(rawHtml) {
    var sDom = dom$1(rawHtml);
    return { dom: sDom };
  };

  var forToolbarCommand = function forToolbarCommand(editor, command) {
    return forToolbar(command, function () {
      editor.execCommand(command);
    }, {}, editor);
  };
  var getToggleBehaviours = function getToggleBehaviours(command) {
    return derive$1([Toggling.config({
      toggleClass: Styles.resolve('toolbar-button-selected'),
      toggleOnExecute: false,
      aria: { mode: 'pressed' }
    }), Receivers.format(command, function (button, status) {
      var toggle = status ? Toggling.on : Toggling.off;
      toggle(button);
    })]);
  };
  var forToolbarStateCommand = function forToolbarStateCommand(editor, command) {
    var extraBehaviours = getToggleBehaviours(command);
    return forToolbar(command, function () {
      editor.execCommand(command);
    }, extraBehaviours, editor);
  };
  var forToolbarStateAction = function forToolbarStateAction(editor, clazz, command, action) {
    var extraBehaviours = getToggleBehaviours(command);
    return forToolbar(clazz, action, extraBehaviours, editor);
  };
  var getToolbarIconButton = function getToolbarIconButton(clazz, editor) {
    var icons = editor.ui.registry.getAll().icons;
    var optOxideIcon = Option.from(icons[clazz]);
    return optOxideIcon.fold(function () {
      return dom$1('<span class="${prefix}-toolbar-button ${prefix}-toolbar-group-item ${prefix}-icon-' + clazz + ' ${prefix}-icon"></span>');
    }, function (icon) {
      return dom$1('<span class="${prefix}-toolbar-button ${prefix}-toolbar-group-item">' + icon + '</span>');
    });
  };
  var forToolbar = function forToolbar(clazz, action, extraBehaviours, editor) {
    return Button.sketch({
      dom: getToolbarIconButton(clazz, editor),
      action: action,
      buttonBehaviours: deepMerge(derive$1([Unselecting.config({})]), extraBehaviours)
    });
  };
  var Buttons = {
    forToolbar: forToolbar,
    forToolbarCommand: forToolbarCommand,
    forToolbarStateAction: forToolbarStateAction,
    forToolbarStateCommand: forToolbarStateCommand,
    getToolbarIconButton: getToolbarIconButton
  };

  var platform$1 = detect$3();
  var isTouch = platform$1.deviceType.isTouch();
  var labelPart = optional({
    schema: [strict$1('dom')],
    name: 'label'
  });
  var edgePart = function edgePart(name) {
    return optional({
      name: '' + name + '-edge',
      overrides: function overrides(detail) {
        var action = detail.model.manager.edgeActions[name];
        return action.fold(function () {
          return {};
        }, function (a) {
          var touchEvents = derive([runActionExtra(touchstart(), a, [detail])]);
          var mouseEvents = derive([runActionExtra(mousedown(), a, [detail]), runActionExtra(mousemove(), function (l, det) {
            if (det.mouseIsDown.get()) {
              a(l, det);
            }
          }, [detail])]);
          return { events: isTouch ? touchEvents : mouseEvents };
        });
      }
    });
  };
  var tlEdgePart = edgePart('top-left');
  var tedgePart = edgePart('top');
  var trEdgePart = edgePart('top-right');
  var redgePart = edgePart('right');
  var brEdgePart = edgePart('bottom-right');
  var bedgePart = edgePart('bottom');
  var blEdgePart = edgePart('bottom-left');
  var ledgePart = edgePart('left');
  var thumbPart = required({
    name: 'thumb',
    defaults: constant({ dom: { styles: { position: 'absolute' } } }),
    overrides: function overrides(detail) {
      return {
        events: derive([redirectToPart(touchstart(), detail, 'spectrum'), redirectToPart(touchmove(), detail, 'spectrum'), redirectToPart(touchend(), detail, 'spectrum'), redirectToPart(mousedown(), detail, 'spectrum'), redirectToPart(mousemove(), detail, 'spectrum'), redirectToPart(mouseup(), detail, 'spectrum')])
      };
    }
  });
  var spectrumPart = required({
    schema: [state$1('mouseIsDown', function () {
      return Cell(false);
    })],
    name: 'spectrum',
    overrides: function overrides(detail) {
      var modelDetail = detail.model;
      var model = modelDetail.manager;
      var setValueFrom = function setValueFrom(component, simulatedEvent) {
        return model.getValueFromEvent(simulatedEvent).map(function (value) {
          return model.setValueFrom(component, detail, value);
        });
      };
      var touchEvents = derive([run(touchstart(), setValueFrom), run(touchmove(), setValueFrom)]);
      var mouseEvents = derive([run(mousedown(), setValueFrom), run(mousemove(), function (spectrum, se) {
        if (detail.mouseIsDown.get()) {
          setValueFrom(spectrum, se);
        }
      })]);
      return {
        behaviours: derive$1(isTouch ? [] : [Keying.config({
          mode: 'special',
          onLeft: function onLeft(spectrum) {
            return model.onLeft(spectrum, detail);
          },
          onRight: function onRight(spectrum) {
            return model.onRight(spectrum, detail);
          },
          onUp: function onUp(spectrum) {
            return model.onUp(spectrum, detail);
          },
          onDown: function onDown(spectrum) {
            return model.onDown(spectrum, detail);
          }
        }), Focusing.config({})]),
        events: isTouch ? touchEvents : mouseEvents
      };
    }
  });
  var SliderParts = [labelPart, ledgePart, redgePart, tedgePart, bedgePart, tlEdgePart, trEdgePart, blEdgePart, brEdgePart, thumbPart, spectrumPart];

  var onLoad$1 = function onLoad$1(component, repConfig, repState) {
    repConfig.store.manager.onLoad(component, repConfig, repState);
  };
  var onUnload = function onUnload(component, repConfig, repState) {
    repConfig.store.manager.onUnload(component, repConfig, repState);
  };
  var setValue = function setValue(component, repConfig, repState, data) {
    repConfig.store.manager.setValue(component, repConfig, repState, data);
  };
  var getValue = function getValue(component, repConfig, repState) {
    return repConfig.store.manager.getValue(component, repConfig, repState);
  };
  var getState = function getState(component, repConfig, repState) {
    return repState;
  };

  var RepresentApis = /*#__PURE__*/Object.freeze({
    onLoad: onLoad$1,
    onUnload: onUnload,
    setValue: setValue,
    getValue: getValue,
    getState: getState
  });

  var events$5 = function events$5(repConfig, repState) {
    var es = repConfig.resetOnDom ? [runOnAttached(function (comp, se) {
      onLoad$1(comp, repConfig, repState);
    }), runOnDetached(function (comp, se) {
      onUnload(comp, repConfig, repState);
    })] : [loadEvent(repConfig, repState, onLoad$1)];
    return derive(es);
  };

  var ActiveRepresenting = /*#__PURE__*/Object.freeze({
    events: events$5
  });

  var memory = function memory() {
    var data = Cell(null);
    var readState = function readState() {
      return {
        mode: 'memory',
        value: data.get()
      };
    };
    var isNotSet = function isNotSet() {
      return data.get() === null;
    };
    var clear = function clear() {
      data.set(null);
    };
    return nu$6({
      set: data.set,
      get: data.get,
      isNotSet: isNotSet,
      clear: clear,
      readState: readState
    });
  };
  var manual = function manual() {
    var readState = function readState() {};
    return nu$6({ readState: readState });
  };
  var dataset = function dataset() {
    var dataByValue = Cell({});
    var dataByText = Cell({});
    var readState = function readState() {
      return {
        mode: 'dataset',
        dataByValue: dataByValue.get(),
        dataByText: dataByText.get()
      };
    };
    var clear = function clear() {
      dataByValue.set({});
      dataByText.set({});
    };
    var lookup = function lookup(itemString) {
      return readOptFrom$1(dataByValue.get(), itemString).orThunk(function () {
        return readOptFrom$1(dataByText.get(), itemString);
      });
    };
    var update = function update(items) {
      var currentDataByValue = dataByValue.get();
      var currentDataByText = dataByText.get();
      var newDataByValue = {};
      var newDataByText = {};
      each$1(items, function (item) {
        newDataByValue[item.value] = item;
        readOptFrom$1(item, 'meta').each(function (meta) {
          readOptFrom$1(meta, 'text').each(function (text) {
            newDataByText[text] = item;
          });
        });
      });
      dataByValue.set(_assign(_assign({}, currentDataByValue), newDataByValue));
      dataByText.set(_assign(_assign({}, currentDataByText), newDataByText));
    };
    return nu$6({
      readState: readState,
      lookup: lookup,
      update: update,
      clear: clear
    });
  };
  var init$1 = function init$1(spec) {
    return spec.store.manager.state(spec);
  };

  var RepresentState = /*#__PURE__*/Object.freeze({
    memory: memory,
    dataset: dataset,
    manual: manual,
    init: init$1
  });

  var setValue$1 = function setValue$1(component, repConfig, repState, data) {
    var store = repConfig.store;
    repState.update([data]);
    store.setValue(component, data);
    repConfig.onSetValue(component, data);
  };
  var getValue$1 = function getValue$1(component, repConfig, repState) {
    var store = repConfig.store;
    var key = store.getDataKey(component);
    return repState.lookup(key).fold(function () {
      return store.getFallbackEntry(key);
    }, function (data) {
      return data;
    });
  };
  var onLoad$2 = function onLoad$2(component, repConfig, repState) {
    var store = repConfig.store;
    store.initialValue.each(function (data) {
      setValue$1(component, repConfig, repState, data);
    });
  };
  var onUnload$1 = function onUnload$1(component, repConfig, repState) {
    repState.clear();
  };
  var DatasetStore = [option('initialValue'), strict$1('getFallbackEntry'), strict$1('getDataKey'), strict$1('setValue'), output('manager', {
    setValue: setValue$1,
    getValue: getValue$1,
    onLoad: onLoad$2,
    onUnload: onUnload$1,
    state: dataset
  })];

  var getValue$2 = function getValue$2(component, repConfig, repState) {
    return repConfig.store.getValue(component);
  };
  var setValue$2 = function setValue$2(component, repConfig, repState, data) {
    repConfig.store.setValue(component, data);
    repConfig.onSetValue(component, data);
  };
  var onLoad$3 = function onLoad$3(component, repConfig, repState) {
    repConfig.store.initialValue.each(function (data) {
      repConfig.store.setValue(component, data);
    });
  };
  var ManualStore = [strict$1('getValue'), defaulted$1('setValue', noop), option('initialValue'), output('manager', {
    setValue: setValue$2,
    getValue: getValue$2,
    onLoad: onLoad$3,
    onUnload: noop,
    state: NoState.init
  })];

  var setValue$3 = function setValue$3(component, repConfig, repState, data) {
    repState.set(data);
    repConfig.onSetValue(component, data);
  };
  var getValue$3 = function getValue$3(component, repConfig, repState) {
    return repState.get();
  };
  var onLoad$4 = function onLoad$4(component, repConfig, repState) {
    repConfig.store.initialValue.each(function (initVal) {
      if (repState.isNotSet()) {
        repState.set(initVal);
      }
    });
  };
  var onUnload$2 = function onUnload$2(component, repConfig, repState) {
    repState.clear();
  };
  var MemoryStore = [option('initialValue'), output('manager', {
    setValue: setValue$3,
    getValue: getValue$3,
    onLoad: onLoad$4,
    onUnload: onUnload$2,
    state: memory
  })];

  var RepresentSchema = [defaultedOf('store', { mode: 'memory' }, choose$1('mode', {
    memory: MemoryStore,
    manual: ManualStore,
    dataset: DatasetStore
  })), onHandler('onSetValue'), defaulted$1('resetOnDom', false)];

  var Representing = create$1({
    fields: RepresentSchema,
    name: 'representing',
    active: ActiveRepresenting,
    apis: RepresentApis,
    extra: {
      setValueFrom: function setValueFrom(component, source) {
        var value = Representing.getValue(source);
        Representing.setValue(component, value);
      }
    },
    state: RepresentState
  });

  var api$1 = Dimension('width', function (element) {
    return element.dom().offsetWidth;
  });
  var set$4 = function set$4(element, h) {
    api$1.set(element, h);
  };
  var get$6 = function get$6(element) {
    return api$1.get(element);
  };

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

  var isTouch$1 = detect$3().deviceType.isTouch();
  var _sliderChangeEvent = 'slider.change.value';
  var sliderChangeEvent = constant(_sliderChangeEvent);
  var getEventSource = function getEventSource(simulatedEvent) {
    var evt = simulatedEvent.event().raw();
    if (isTouch$1) {
      var touchEvent = evt;
      return touchEvent.touches !== undefined && touchEvent.touches.length === 1 ? Option.some(touchEvent.touches[0]).map(function (t) {
        return Position(t.clientX, t.clientY);
      }) : Option.none();
    } else {
      var mouseEvent = evt;
      return mouseEvent.clientX !== undefined ? Option.some(mouseEvent).map(function (me) {
        return Position(me.clientX, me.clientY);
      }) : Option.none();
    }
  };

  var t = 'top',
      r$1 = 'right',
      b = 'bottom',
      l = 'left';
  var minX = function minX(detail) {
    return detail.model.minX;
  };
  var minY = function minY(detail) {
    return detail.model.minY;
  };
  var min1X = function min1X(detail) {
    return detail.model.minX - 1;
  };
  var min1Y = function min1Y(detail) {
    return detail.model.minY - 1;
  };
  var maxX = function maxX(detail) {
    return detail.model.maxX;
  };
  var maxY = function maxY(detail) {
    return detail.model.maxY;
  };
  var max1X = function max1X(detail) {
    return detail.model.maxX + 1;
  };
  var max1Y = function max1Y(detail) {
    return detail.model.maxY + 1;
  };
  var range = function range(detail, max, min) {
    return max(detail) - min(detail);
  };
  var xRange = function xRange(detail) {
    return range(detail, maxX, minX);
  };
  var yRange = function yRange(detail) {
    return range(detail, maxY, minY);
  };
  var halfX = function halfX(detail) {
    return xRange(detail) / 2;
  };
  var halfY = function halfY(detail) {
    return yRange(detail) / 2;
  };
  var step = function step(detail) {
    return detail.stepSize;
  };
  var snap = function snap(detail) {
    return detail.snapToGrid;
  };
  var snapStart = function snapStart(detail) {
    return detail.snapStart;
  };
  var rounded = function rounded(detail) {
    return detail.rounded;
  };
  var hasEdge = function hasEdge(detail, edgeName) {
    return detail[edgeName + '-edge'] !== undefined;
  };
  var hasLEdge = function hasLEdge(detail) {
    return hasEdge(detail, l);
  };
  var hasREdge = function hasREdge(detail) {
    return hasEdge(detail, r$1);
  };
  var hasTEdge = function hasTEdge(detail) {
    return hasEdge(detail, t);
  };
  var hasBEdge = function hasBEdge(detail) {
    return hasEdge(detail, b);
  };
  var currentValue = function currentValue(detail) {
    return detail.model.value.get();
  };

  var xValue = function xValue(x) {
    return { x: constant(x) };
  };
  var yValue = function yValue(y) {
    return { y: constant(y) };
  };
  var xyValue = function xyValue(x, y) {
    return {
      x: constant(x),
      y: constant(y)
    };
  };
  var fireSliderChange = function fireSliderChange(component, value) {
    emitWith(component, sliderChangeEvent(), { value: value });
  };
  var setToTLEdgeXY = function setToTLEdgeXY(edge, detail) {
    fireSliderChange(edge, xyValue(min1X(detail), min1Y(detail)));
  };
  var setToTEdge = function setToTEdge(edge, detail) {
    fireSliderChange(edge, yValue(min1Y(detail)));
  };
  var setToTEdgeXY = function setToTEdgeXY(edge, detail) {
    fireSliderChange(edge, xyValue(halfX(detail), min1Y(detail)));
  };
  var setToTREdgeXY = function setToTREdgeXY(edge, detail) {
    fireSliderChange(edge, xyValue(max1X(detail), min1Y(detail)));
  };
  var setToREdge = function setToREdge(edge, detail) {
    fireSliderChange(edge, xValue(max1X(detail)));
  };
  var setToREdgeXY = function setToREdgeXY(edge, detail) {
    fireSliderChange(edge, xyValue(max1X(detail), halfY(detail)));
  };
  var setToBREdgeXY = function setToBREdgeXY(edge, detail) {
    fireSliderChange(edge, xyValue(max1X(detail), max1Y(detail)));
  };
  var setToBEdge = function setToBEdge(edge, detail) {
    fireSliderChange(edge, yValue(max1Y(detail)));
  };
  var setToBEdgeXY = function setToBEdgeXY(edge, detail) {
    fireSliderChange(edge, xyValue(halfX(detail), max1Y(detail)));
  };
  var setToBLEdgeXY = function setToBLEdgeXY(edge, detail) {
    fireSliderChange(edge, xyValue(min1X(detail), max1Y(detail)));
  };
  var setToLEdge = function setToLEdge(edge, detail) {
    fireSliderChange(edge, xValue(min1X(detail)));
  };
  var setToLEdgeXY = function setToLEdgeXY(edge, detail) {
    fireSliderChange(edge, xyValue(min1X(detail), halfY(detail)));
  };

  var reduceBy = function reduceBy(value, min, max, step) {
    if (value < min) {
      return value;
    } else if (value > max) {
      return max;
    } else if (value === min) {
      return min - 1;
    } else {
      return Math.max(min, value - step);
    }
  };
  var increaseBy = function increaseBy(value, min, max, step) {
    if (value > max) {
      return value;
    } else if (value < min) {
      return min;
    } else if (value === max) {
      return max + 1;
    } else {
      return Math.min(max, value + step);
    }
  };
  var capValue = function capValue(value, min, max) {
    return Math.max(min, Math.min(max, value));
  };
  var snapValueOf = function snapValueOf(value, min, max, step, snapStart) {
    return snapStart.fold(function () {
      var initValue = value - min;
      var extraValue = Math.round(initValue / step) * step;
      return capValue(min + extraValue, min - 1, max + 1);
    }, function (start) {
      var remainder = (value - start) % step;
      var adjustment = Math.round(remainder / step);
      var rawSteps = Math.floor((value - start) / step);
      var maxSteps = Math.floor((max - start) / step);
      var numSteps = Math.min(maxSteps, rawSteps + adjustment);
      var r = start + numSteps * step;
      return Math.max(start, r);
    });
  };
  var findOffsetOf = function findOffsetOf(value, min, max) {
    return Math.min(max, Math.max(value, min)) - min;
  };
  var findValueOf = function findValueOf(args) {
    var min = args.min,
        max = args.max,
        range = args.range,
        value = args.value,
        step = args.step,
        snap = args.snap,
        snapStart = args.snapStart,
        rounded = args.rounded,
        hasMinEdge = args.hasMinEdge,
        hasMaxEdge = args.hasMaxEdge,
        minBound = args.minBound,
        maxBound = args.maxBound,
        screenRange = args.screenRange;
    var capMin = hasMinEdge ? min - 1 : min;
    var capMax = hasMaxEdge ? max + 1 : max;
    if (value < minBound) {
      return capMin;
    } else if (value > maxBound) {
      return capMax;
    } else {
      var offset = findOffsetOf(value, minBound, maxBound);
      var newValue = capValue(offset / screenRange * range + min, capMin, capMax);
      if (snap && newValue >= min && newValue <= max) {
        return snapValueOf(newValue, min, max, step, snapStart);
      } else if (rounded) {
        return Math.round(newValue);
      } else {
        return newValue;
      }
    }
  };
  var findOffsetOfValue = function findOffsetOfValue(args) {
    var min = args.min,
        max = args.max,
        range = args.range,
        value = args.value,
        hasMinEdge = args.hasMinEdge,
        hasMaxEdge = args.hasMaxEdge,
        maxBound = args.maxBound,
        maxOffset = args.maxOffset,
        centerMinEdge = args.centerMinEdge,
        centerMaxEdge = args.centerMaxEdge;
    if (value < min) {
      return hasMinEdge ? 0 : centerMinEdge;
    } else if (value > max) {
      return hasMaxEdge ? maxBound : centerMaxEdge;
    } else {
      return (value - min) / range * maxOffset;
    }
  };

  var top = 'top',
      right = 'right',
      bottom = 'bottom',
      left = 'left',
      width = 'width',
      height = 'height';
  var getBounds = function getBounds(component) {
    return component.element().dom().getBoundingClientRect();
  };
  var getBoundsProperty = function getBoundsProperty(bounds, property) {
    return bounds[property];
  };
  var getMinXBounds = function getMinXBounds(component) {
    var bounds = getBounds(component);
    return getBoundsProperty(bounds, left);
  };
  var getMaxXBounds = function getMaxXBounds(component) {
    var bounds = getBounds(component);
    return getBoundsProperty(bounds, right);
  };
  var getMinYBounds = function getMinYBounds(component) {
    var bounds = getBounds(component);
    return getBoundsProperty(bounds, top);
  };
  var getMaxYBounds = function getMaxYBounds(component) {
    var bounds = getBounds(component);
    return getBoundsProperty(bounds, bottom);
  };
  var getXScreenRange = function getXScreenRange(component) {
    var bounds = getBounds(component);
    return getBoundsProperty(bounds, width);
  };
  var getYScreenRange = function getYScreenRange(component) {
    var bounds = getBounds(component);
    return getBoundsProperty(bounds, height);
  };
  var getCenterOffsetOf = function getCenterOffsetOf(componentMinEdge, componentMaxEdge, spectrumMinEdge) {
    return (componentMinEdge + componentMaxEdge) / 2 - spectrumMinEdge;
  };
  var getXCenterOffSetOf = function getXCenterOffSetOf(component, spectrum) {
    var componentBounds = getBounds(component);
    var spectrumBounds = getBounds(spectrum);
    var componentMinEdge = getBoundsProperty(componentBounds, left);
    var componentMaxEdge = getBoundsProperty(componentBounds, right);
    var spectrumMinEdge = getBoundsProperty(spectrumBounds, left);
    return getCenterOffsetOf(componentMinEdge, componentMaxEdge, spectrumMinEdge);
  };
  var getYCenterOffSetOf = function getYCenterOffSetOf(component, spectrum) {
    var componentBounds = getBounds(component);
    var spectrumBounds = getBounds(spectrum);
    var componentMinEdge = getBoundsProperty(componentBounds, top);
    var componentMaxEdge = getBoundsProperty(componentBounds, bottom);
    var spectrumMinEdge = getBoundsProperty(spectrumBounds, top);
    return getCenterOffsetOf(componentMinEdge, componentMaxEdge, spectrumMinEdge);
  };

  var fireSliderChange$1 = function fireSliderChange$1(spectrum, value) {
    emitWith(spectrum, sliderChangeEvent(), { value: value });
  };
  var sliderValue = function sliderValue(x) {
    return { x: constant(x) };
  };
  var findValueOfOffset = function findValueOfOffset(spectrum, detail, left) {
    var args = {
      min: minX(detail),
      max: maxX(detail),
      range: xRange(detail),
      value: left,
      step: step(detail),
      snap: snap(detail),
      snapStart: snapStart(detail),
      rounded: rounded(detail),
      hasMinEdge: hasLEdge(detail),
      hasMaxEdge: hasREdge(detail),
      minBound: getMinXBounds(spectrum),
      maxBound: getMaxXBounds(spectrum),
      screenRange: getXScreenRange(spectrum)
    };
    return findValueOf(args);
  };
  var setValueFrom = function setValueFrom(spectrum, detail, value) {
    var xValue = findValueOfOffset(spectrum, detail, value);
    var sliderVal = sliderValue(xValue);
    fireSliderChange$1(spectrum, sliderVal);
    return xValue;
  };
  var setToMin = function setToMin(spectrum, detail) {
    var min = minX(detail);
    fireSliderChange$1(spectrum, sliderValue(min));
  };
  var setToMax = function setToMax(spectrum, detail) {
    var max = maxX(detail);
    fireSliderChange$1(spectrum, sliderValue(max));
  };
  var moveBy = function moveBy(direction, spectrum, detail) {
    var f = direction > 0 ? increaseBy : reduceBy;
    var xValue = f(currentValue(detail).x(), minX(detail), maxX(detail), step(detail));
    fireSliderChange$1(spectrum, sliderValue(xValue));
    return Option.some(xValue);
  };
  var handleMovement = function handleMovement(direction) {
    return function (spectrum, detail) {
      return moveBy(direction, spectrum, detail).map(function () {
        return true;
      });
    };
  };
  var getValueFromEvent = function getValueFromEvent(simulatedEvent) {
    var pos = getEventSource(simulatedEvent);
    return pos.map(function (p) {
      return p.left();
    });
  };
  var findOffsetOfValue$1 = function findOffsetOfValue$1(spectrum, detail, value, minEdge, maxEdge) {
    var minOffset = 0;
    var maxOffset = getXScreenRange(spectrum);
    var centerMinEdge = minEdge.bind(function (edge) {
      return Option.some(getXCenterOffSetOf(edge, spectrum));
    }).getOr(minOffset);
    var centerMaxEdge = maxEdge.bind(function (edge) {
      return Option.some(getXCenterOffSetOf(edge, spectrum));
    }).getOr(maxOffset);
    var args = {
      min: minX(detail),
      max: maxX(detail),
      range: xRange(detail),
      value: value,
      hasMinEdge: hasLEdge(detail),
      hasMaxEdge: hasREdge(detail),
      minBound: getMinXBounds(spectrum),
      minOffset: minOffset,
      maxBound: getMaxXBounds(spectrum),
      maxOffset: maxOffset,
      centerMinEdge: centerMinEdge,
      centerMaxEdge: centerMaxEdge
    };
    return findOffsetOfValue(args);
  };
  var findPositionOfValue = function findPositionOfValue(slider, spectrum, value, minEdge, maxEdge, detail) {
    var offset = findOffsetOfValue$1(spectrum, detail, value, minEdge, maxEdge);
    return getMinXBounds(spectrum) - getMinXBounds(slider) + offset;
  };
  var setPositionFromValue = function setPositionFromValue(slider, thumb, detail, edges) {
    var value = currentValue(detail);
    var pos = findPositionOfValue(slider, edges.getSpectrum(slider), value.x(), edges.getLeftEdge(slider), edges.getRightEdge(slider), detail);
    var thumbRadius = get$6(thumb.element()) / 2;
    set$3(thumb.element(), 'left', pos - thumbRadius + 'px');
  };
  var onLeft = handleMovement(-1);
  var onRight = handleMovement(1);
  var onUp = Option.none;
  var onDown = Option.none;
  var edgeActions = {
    'top-left': Option.none(),
    'top': Option.none(),
    'top-right': Option.none(),
    'right': Option.some(setToREdge),
    'bottom-right': Option.none(),
    'bottom': Option.none(),
    'bottom-left': Option.none(),
    'left': Option.some(setToLEdge)
  };

  var HorizontalModel = /*#__PURE__*/Object.freeze({
    setValueFrom: setValueFrom,
    setToMin: setToMin,
    setToMax: setToMax,
    findValueOfOffset: findValueOfOffset,
    getValueFromEvent: getValueFromEvent,
    findPositionOfValue: findPositionOfValue,
    setPositionFromValue: setPositionFromValue,
    onLeft: onLeft,
    onRight: onRight,
    onUp: onUp,
    onDown: onDown,
    edgeActions: edgeActions
  });

  var fireSliderChange$2 = function fireSliderChange$2(spectrum, value) {
    emitWith(spectrum, sliderChangeEvent(), { value: value });
  };
  var sliderValue$1 = function sliderValue$1(y) {
    return { y: constant(y) };
  };
  var findValueOfOffset$1 = function findValueOfOffset$1(spectrum, detail, top) {
    var args = {
      min: minY(detail),
      max: maxY(detail),
      range: yRange(detail),
      value: top,
      step: step(detail),
      snap: snap(detail),
      snapStart: snapStart(detail),
      rounded: rounded(detail),
      hasMinEdge: hasTEdge(detail),
      hasMaxEdge: hasBEdge(detail),
      minBound: getMinYBounds(spectrum),
      maxBound: getMaxYBounds(spectrum),
      screenRange: getYScreenRange(spectrum)
    };
    return findValueOf(args);
  };
  var setValueFrom$1 = function setValueFrom$1(spectrum, detail, value) {
    var yValue = findValueOfOffset$1(spectrum, detail, value);
    var sliderVal = sliderValue$1(yValue);
    fireSliderChange$2(spectrum, sliderVal);
    return yValue;
  };
  var setToMin$1 = function setToMin$1(spectrum, detail) {
    var min = minY(detail);
    fireSliderChange$2(spectrum, sliderValue$1(min));
  };
  var setToMax$1 = function setToMax$1(spectrum, detail) {
    var max = maxY(detail);
    fireSliderChange$2(spectrum, sliderValue$1(max));
  };
  var moveBy$1 = function moveBy$1(direction, spectrum, detail) {
    var f = direction > 0 ? increaseBy : reduceBy;
    var yValue = f(currentValue(detail).y(), minY(detail), maxY(detail), step(detail));
    fireSliderChange$2(spectrum, sliderValue$1(yValue));
    return Option.some(yValue);
  };
  var handleMovement$1 = function handleMovement$1(direction) {
    return function (spectrum, detail) {
      return moveBy$1(direction, spectrum, detail).map(function () {
        return true;
      });
    };
  };
  var getValueFromEvent$1 = function getValueFromEvent$1(simulatedEvent) {
    var pos = getEventSource(simulatedEvent);
    return pos.map(function (p) {
      return p.top();
    });
  };
  var findOffsetOfValue$2 = function findOffsetOfValue$2(spectrum, detail, value, minEdge, maxEdge) {
    var minOffset = 0;
    var maxOffset = getYScreenRange(spectrum);
    var centerMinEdge = minEdge.bind(function (edge) {
      return Option.some(getYCenterOffSetOf(edge, spectrum));
    }).getOr(minOffset);
    var centerMaxEdge = maxEdge.bind(function (edge) {
      return Option.some(getYCenterOffSetOf(edge, spectrum));
    }).getOr(maxOffset);
    var args = {
      min: minY(detail),
      max: maxY(detail),
      range: yRange(detail),
      value: value,
      hasMinEdge: hasTEdge(detail),
      hasMaxEdge: hasBEdge(detail),
      minBound: getMinYBounds(spectrum),
      minOffset: minOffset,
      maxBound: getMaxYBounds(spectrum),
      maxOffset: maxOffset,
      centerMinEdge: centerMinEdge,
      centerMaxEdge: centerMaxEdge
    };
    return findOffsetOfValue(args);
  };
  var findPositionOfValue$1 = function findPositionOfValue$1(slider, spectrum, value, minEdge, maxEdge, detail) {
    var offset = findOffsetOfValue$2(spectrum, detail, value, minEdge, maxEdge);
    return getMinYBounds(spectrum) - getMinYBounds(slider) + offset;
  };
  var setPositionFromValue$1 = function setPositionFromValue$1(slider, thumb, detail, edges) {
    var value = currentValue(detail);
    var pos = findPositionOfValue$1(slider, edges.getSpectrum(slider), value.y(), edges.getTopEdge(slider), edges.getBottomEdge(slider), detail);
    var thumbRadius = get$4(thumb.element()) / 2;
    set$3(thumb.element(), 'top', pos - thumbRadius + 'px');
  };
  var onLeft$1 = Option.none;
  var onRight$1 = Option.none;
  var onUp$1 = handleMovement$1(-1);
  var onDown$1 = handleMovement$1(1);
  var edgeActions$1 = {
    'top-left': Option.none(),
    'top': Option.some(setToTEdge),
    'top-right': Option.none(),
    'right': Option.none(),
    'bottom-right': Option.none(),
    'bottom': Option.some(setToBEdge),
    'bottom-left': Option.none(),
    'left': Option.none()
  };

  var VerticalModel = /*#__PURE__*/Object.freeze({
    setValueFrom: setValueFrom$1,
    setToMin: setToMin$1,
    setToMax: setToMax$1,
    findValueOfOffset: findValueOfOffset$1,
    getValueFromEvent: getValueFromEvent$1,
    findPositionOfValue: findPositionOfValue$1,
    setPositionFromValue: setPositionFromValue$1,
    onLeft: onLeft$1,
    onRight: onRight$1,
    onUp: onUp$1,
    onDown: onDown$1,
    edgeActions: edgeActions$1
  });

  var fireSliderChange$3 = function fireSliderChange$3(spectrum, value) {
    emitWith(spectrum, sliderChangeEvent(), { value: value });
  };
  var sliderValue$2 = function sliderValue$2(x, y) {
    return {
      x: constant(x),
      y: constant(y)
    };
  };
  var setValueFrom$2 = function setValueFrom$2(spectrum, detail, value) {
    var xValue = findValueOfOffset(spectrum, detail, value.left());
    var yValue = findValueOfOffset$1(spectrum, detail, value.top());
    var val = sliderValue$2(xValue, yValue);
    fireSliderChange$3(spectrum, val);
    return val;
  };
  var moveBy$2 = function moveBy$2(direction, isVerticalMovement, spectrum, detail) {
    var f = direction > 0 ? increaseBy : reduceBy;
    var xValue = isVerticalMovement ? currentValue(detail).x() : f(currentValue(detail).x(), minX(detail), maxX(detail), step(detail));
    var yValue = !isVerticalMovement ? currentValue(detail).y() : f(currentValue(detail).y(), minY(detail), maxY(detail), step(detail));
    fireSliderChange$3(spectrum, sliderValue$2(xValue, yValue));
    return Option.some(xValue);
  };
  var handleMovement$2 = function handleMovement$2(direction, isVerticalMovement) {
    return function (spectrum, detail) {
      return moveBy$2(direction, isVerticalMovement, spectrum, detail).map(function () {
        return true;
      });
    };
  };
  var setToMin$2 = function setToMin$2(spectrum, detail) {
    var mX = minX(detail);
    var mY = minY(detail);
    fireSliderChange$3(spectrum, sliderValue$2(mX, mY));
  };
  var setToMax$2 = function setToMax$2(spectrum, detail) {
    var mX = maxX(detail);
    var mY = maxY(detail);
    fireSliderChange$3(spectrum, sliderValue$2(mX, mY));
  };
  var getValueFromEvent$2 = function getValueFromEvent$2(simulatedEvent) {
    return getEventSource(simulatedEvent);
  };
  var setPositionFromValue$2 = function setPositionFromValue$2(slider, thumb, detail, edges) {
    var value = currentValue(detail);
    var xPos = findPositionOfValue(slider, edges.getSpectrum(slider), value.x(), edges.getLeftEdge(slider), edges.getRightEdge(slider), detail);
    var yPos = findPositionOfValue$1(slider, edges.getSpectrum(slider), value.y(), edges.getTopEdge(slider), edges.getBottomEdge(slider), detail);
    var thumbXRadius = get$6(thumb.element()) / 2;
    var thumbYRadius = get$4(thumb.element()) / 2;
    set$3(thumb.element(), 'left', xPos - thumbXRadius + 'px');
    set$3(thumb.element(), 'top', yPos - thumbYRadius + 'px');
  };
  var onLeft$2 = handleMovement$2(-1, false);
  var onRight$2 = handleMovement$2(1, false);
  var onUp$2 = handleMovement$2(-1, true);
  var onDown$2 = handleMovement$2(1, true);
  var edgeActions$2 = {
    'top-left': Option.some(setToTLEdgeXY),
    'top': Option.some(setToTEdgeXY),
    'top-right': Option.some(setToTREdgeXY),
    'right': Option.some(setToREdgeXY),
    'bottom-right': Option.some(setToBREdgeXY),
    'bottom': Option.some(setToBEdgeXY),
    'bottom-left': Option.some(setToBLEdgeXY),
    'left': Option.some(setToLEdgeXY)
  };

  var TwoDModel = /*#__PURE__*/Object.freeze({
    setValueFrom: setValueFrom$2,
    setToMin: setToMin$2,
    setToMax: setToMax$2,
    getValueFromEvent: getValueFromEvent$2,
    setPositionFromValue: setPositionFromValue$2,
    onLeft: onLeft$2,
    onRight: onRight$2,
    onUp: onUp$2,
    onDown: onDown$2,
    edgeActions: edgeActions$2
  });

  var isTouch$2 = detect$3().deviceType.isTouch();
  var SliderSchema = [defaulted$1('stepSize', 1), defaulted$1('onChange', noop), defaulted$1('onChoose', noop), defaulted$1('onInit', noop), defaulted$1('onDragStart', noop), defaulted$1('onDragEnd', noop), defaulted$1('snapToGrid', false), defaulted$1('rounded', true), option('snapStart'), strictOf('model', choose$1('mode', {
    x: [defaulted$1('minX', 0), defaulted$1('maxX', 100), state$1('value', function (spec) {
      return Cell(spec.mode.minX);
    }), strict$1('getInitialValue'), output('manager', HorizontalModel)],
    y: [defaulted$1('minY', 0), defaulted$1('maxY', 100), state$1('value', function (spec) {
      return Cell(spec.mode.minY);
    }), strict$1('getInitialValue'), output('manager', VerticalModel)],
    xy: [defaulted$1('minX', 0), defaulted$1('maxX', 100), defaulted$1('minY', 0), defaulted$1('maxY', 100), state$1('value', function (spec) {
      return Cell({
        x: constant(spec.mode.minX),
        y: constant(spec.mode.minY)
      });
    }), strict$1('getInitialValue'), output('manager', TwoDModel)]
  })), field$1('sliderBehaviours', [Keying, Representing])].concat(!isTouch$2 ? [state$1('mouseIsDown', function () {
    return Cell(false);
  })] : []);

  var isTouch$3 = detect$3().deviceType.isTouch();
  var sketch = function sketch(detail, components, _spec, _externals) {
    var getThumb = function getThumb(component) {
      return getPartOrDie(component, detail, 'thumb');
    };
    var getSpectrum = function getSpectrum(component) {
      return getPartOrDie(component, detail, 'spectrum');
    };
    var getLeftEdge = function getLeftEdge(component) {
      return getPart(component, detail, 'left-edge');
    };
    var getRightEdge = function getRightEdge(component) {
      return getPart(component, detail, 'right-edge');
    };
    var getTopEdge = function getTopEdge(component) {
      return getPart(component, detail, 'top-edge');
    };
    var getBottomEdge = function getBottomEdge(component) {
      return getPart(component, detail, 'bottom-edge');
    };
    var modelDetail = detail.model;
    var model = modelDetail.manager;
    var refresh = function refresh(slider, thumb) {
      model.setPositionFromValue(slider, thumb, detail, {
        getLeftEdge: getLeftEdge,
        getRightEdge: getRightEdge,
        getTopEdge: getTopEdge,
        getBottomEdge: getBottomEdge,
        getSpectrum: getSpectrum
      });
    };
    var changeValue = function changeValue(slider, newValue) {
      modelDetail.value.set(newValue);
      var thumb = getThumb(slider);
      refresh(slider, thumb);
      detail.onChange(slider, thumb, newValue);
      return Option.some(true);
    };
    var resetToMin = function resetToMin(slider) {
      model.setToMin(slider, detail);
    };
    var resetToMax = function resetToMax(slider) {
      model.setToMax(slider, detail);
    };
    var touchEvents = [run(touchstart(), function (slider, _simulatedEvent) {
      detail.onDragStart(slider, getThumb(slider));
    }), run(touchend(), function (slider, _simulatedEvent) {
      detail.onDragEnd(slider, getThumb(slider));
    })];
    var mouseEvents = [run(mousedown(), function (slider, simulatedEvent) {
      simulatedEvent.stop();
      detail.onDragStart(slider, getThumb(slider));
      detail.mouseIsDown.set(true);
    }), run(mouseup(), function (slider, _simulatedEvent) {
      detail.onDragEnd(slider, getThumb(slider));
    })];
    var uiEventsArr = isTouch$3 ? touchEvents : mouseEvents;
    return {
      uid: detail.uid,
      dom: detail.dom,
      components: components,
      behaviours: augment(detail.sliderBehaviours, flatten([!isTouch$3 ? [Keying.config({
        mode: 'special',
        focusIn: function focusIn(slider) {
          return getPart(slider, detail, 'spectrum').map(Keying.focusIn).map(constant(true));
        }
      })] : [], [Representing.config({
        store: {
          mode: 'manual',
          getValue: function getValue(_) {
            return modelDetail.value.get();
          }
        }
      }), Receiving.config({
        channels: {
          'mouse.released': {
            onReceive: function onReceive(slider, se) {
              var fireOnChoose = function fireOnChoose() {
                getPart(slider, detail, 'thumb').each(function (thumb) {
                  var value = modelDetail.value.get();
                  detail.onChoose(slider, thumb, value);
                });
              };
              if (isTouch$3) {
                fireOnChoose();
              } else {
                var wasDown = detail.mouseIsDown.get();
                detail.mouseIsDown.set(false);
                if (wasDown) {
                  fireOnChoose();
                }
              }
            }
          }
        }
      })]])),
      events: derive([run(sliderChangeEvent(), function (slider, simulatedEvent) {
        changeValue(slider, simulatedEvent.event().value());
      }), runOnAttached(function (slider, simulatedEvent) {
        var getInitial = modelDetail.getInitialValue();
        modelDetail.value.set(getInitial);
        var thumb = getThumb(slider);
        refresh(slider, thumb);
        var spectrum = getSpectrum(slider);
        detail.onInit(slider, thumb, spectrum, modelDetail.value.get());
      })].concat(uiEventsArr)),
      apis: {
        resetToMin: resetToMin,
        resetToMax: resetToMax,
        changeValue: changeValue,
        refresh: refresh
      },
      domModification: { styles: { position: 'relative' } }
    };
  };

  var Slider = composite$1({
    name: 'Slider',
    configFields: SliderSchema,
    partFields: SliderParts,
    factory: sketch,
    apis: {
      resetToMin: function resetToMin(apis, slider) {
        apis.resetToMin(slider);
      },
      resetToMax: function resetToMax(apis, slider) {
        apis.resetToMax(slider);
      },
      refresh: function refresh(apis, slider) {
        apis.refresh(slider);
      }
    }
  });

  var button = function button(realm, clazz, makeItems, editor) {
    return Buttons.forToolbar(clazz, function () {
      var items = makeItems();
      realm.setContextToolbar([{
        label: clazz + ' group',
        items: items
      }]);
    }, {}, editor);
  };

  var BLACK = -1;
  var makeSlider = function makeSlider(spec$1) {
    var getColor = function getColor(hue) {
      if (hue < 0) {
        return 'black';
      } else if (hue > 360) {
        return 'white';
      } else {
        return 'hsl(' + hue + ', 100%, 50%)';
      }
    };
    var onInit = function onInit(slider, thumb, spectrum, value) {
      var color = getColor(value.x());
      set$3(thumb.element(), 'background-color', color);
    };
    var onChange = function onChange(slider, thumb, value) {
      var color = getColor(value.x());
      set$3(thumb.element(), 'background-color', color);
      spec$1.onChange(slider, thumb, color);
    };
    return Slider.sketch({
      dom: dom$1('<div class="${prefix}-slider ${prefix}-hue-slider-container"></div>'),
      components: [Slider.parts()['left-edge'](spec('<div class="${prefix}-hue-slider-black"></div>')), Slider.parts().spectrum({
        dom: dom$1('<div class="${prefix}-slider-gradient-container"></div>'),
        components: [spec('<div class="${prefix}-slider-gradient"></div>')],
        behaviours: derive$1([Toggling.config({ toggleClass: Styles.resolve('thumb-active') })])
      }), Slider.parts()['right-edge'](spec('<div class="${prefix}-hue-slider-white"></div>')), Slider.parts().thumb({
        dom: dom$1('<div class="${prefix}-slider-thumb"></div>'),
        behaviours: derive$1([Toggling.config({ toggleClass: Styles.resolve('thumb-active') })])
      })],
      onChange: onChange,
      onDragStart: function onDragStart(slider, thumb) {
        Toggling.on(thumb);
      },
      onDragEnd: function onDragEnd(slider, thumb) {
        Toggling.off(thumb);
      },
      onInit: onInit,
      stepSize: 10,
      model: {
        mode: 'x',
        minX: 0,
        maxX: 360,
        getInitialValue: function getInitialValue() {
          return {
            x: function x() {
              return spec$1.getInitialValue();
            }
          };
        }
      },
      sliderBehaviours: derive$1([Receivers.orientation(Slider.refresh)])
    });
  };
  var makeItems = function makeItems(spec) {
    return [makeSlider(spec)];
  };
  var sketch$1 = function sketch$1(realm, editor) {
    var spec = {
      onChange: function onChange(slider, thumb, color) {
        editor.undoManager.transact(function () {
          editor.formatter.apply('forecolor', { value: color });
          editor.nodeChanged();
        });
      },
      getInitialValue: function getInitialValue() {
        return BLACK;
      }
    };
    return button(realm, 'color-levels', function () {
      return makeItems(spec);
    }, editor);
  };
  var ColorSlider = {
    makeItems: makeItems,
    sketch: sketch$1
  };

  var schema$7 = objOfOnly([strict$1('getInitialValue'), strict$1('onChange'), strict$1('category'), strict$1('sizes')]);
  var sketch$2 = function sketch$2(rawSpec) {
    var spec$1 = asRawOrDie('SizeSlider', schema$7, rawSpec);
    var isValidValue = function isValidValue(valueIndex) {
      return valueIndex >= 0 && valueIndex < spec$1.sizes.length;
    };
    var onChange = function onChange(slider, thumb, valueIndex) {
      var index = valueIndex.x();
      if (isValidValue(index)) {
        spec$1.onChange(index);
      }
    };
    return Slider.sketch({
      dom: {
        tag: 'div',
        classes: [Styles.resolve('slider-' + spec$1.category + '-size-container'), Styles.resolve('slider'), Styles.resolve('slider-size-container')]
      },
      onChange: onChange,
      onDragStart: function onDragStart(slider, thumb) {
        Toggling.on(thumb);
      },
      onDragEnd: function onDragEnd(slider, thumb) {
        Toggling.off(thumb);
      },
      model: {
        mode: 'x',
        minX: 0,
        maxX: spec$1.sizes.length - 1,
        getInitialValue: function getInitialValue() {
          return {
            x: function x() {
              return spec$1.getInitialValue();
            }
          };
        }
      },
      stepSize: 1,
      snapToGrid: true,
      sliderBehaviours: derive$1([Receivers.orientation(Slider.refresh)]),
      components: [Slider.parts().spectrum({
        dom: dom$1('<div class="${prefix}-slider-size-container"></div>'),
        components: [spec('<div class="${prefix}-slider-size-line"></div>')]
      }), Slider.parts().thumb({
        dom: dom$1('<div class="${prefix}-slider-thumb"></div>'),
        behaviours: derive$1([Toggling.config({ toggleClass: Styles.resolve('thumb-active') })])
      })]
    });
  };
  var SizeSlider = { sketch: sketch$2 };

  var candidates = ['9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '32px', '36px'];
  var defaultSize = 'medium';
  var defaultIndex = 2;
  var indexToSize = function indexToSize(index) {
    return Option.from(candidates[index]);
  };
  var sizeToIndex = function sizeToIndex(size) {
    return findIndex(candidates, function (v) {
      return v === size;
    });
  };
  var getRawOrComputed = function getRawOrComputed(isRoot, rawStart) {
    var optStart = isElement(rawStart) ? Option.some(rawStart) : parent(rawStart).filter(isElement);
    return optStart.map(function (start) {
      var inline = closest(start, function (elem) {
        return getRaw(elem, 'font-size').isSome();
      }, isRoot).bind(function (elem) {
        return getRaw(elem, 'font-size');
      });
      return inline.getOrThunk(function () {
        return get$3(start, 'font-size');
      });
    }).getOr('');
  };
  var getSize = function getSize(editor) {
    var node = editor.selection.getStart();
    var elem = Element.fromDom(node);
    var root = Element.fromDom(editor.getBody());
    var isRoot = function isRoot(e) {
      return eq(root, e);
    };
    var elemSize = getRawOrComputed(isRoot, elem);
    return find$2(candidates, function (size) {
      return elemSize === size;
    }).getOr(defaultSize);
  };
  var applySize = function applySize(editor, value) {
    var currentValue = getSize(editor);
    if (currentValue !== value) {
      editor.execCommand('fontSize', false, value);
    }
  };
  var get$7 = function get$7(editor) {
    var size = getSize(editor);
    return sizeToIndex(size).getOr(defaultIndex);
  };
  var apply$1 = function apply$1(editor, index) {
    indexToSize(index).each(function (size) {
      applySize(editor, size);
    });
  };
  var FontSizes = {
    candidates: constant(candidates),
    get: get$7,
    apply: apply$1
  };

  var sizes = FontSizes.candidates();
  var makeSlider$1 = function makeSlider$1(spec) {
    return SizeSlider.sketch({
      onChange: spec.onChange,
      sizes: sizes,
      category: 'font',
      getInitialValue: spec.getInitialValue
    });
  };
  var makeItems$1 = function makeItems$1(spec$1) {
    return [spec('<span class="${prefix}-toolbar-button ${prefix}-icon-small-font ${prefix}-icon"></span>'), makeSlider$1(spec$1), spec('<span class="${prefix}-toolbar-button ${prefix}-icon-large-font ${prefix}-icon"></span>')];
  };
  var sketch$3 = function sketch$3(realm, editor) {
    var spec = {
      onChange: function onChange(value) {
        FontSizes.apply(editor, value);
      },
      getInitialValue: function getInitialValue() {
        return FontSizes.get(editor);
      }
    };
    return button(realm, 'font-size', function () {
      return makeItems$1(spec);
    }, editor);
  };

  var record = function record(spec) {
    var uid = isSketchSpec(spec) && hasKey$1(spec, 'uid') ? spec.uid : generate$3('memento');
    var get = function get(anyInSystem) {
      return anyInSystem.getSystem().getByUid(uid).getOrDie();
    };
    var getOpt = function getOpt(anyInSystem) {
      return anyInSystem.getSystem().getByUid(uid).toOption();
    };
    var asSpec = function asSpec() {
      return _assign(_assign({}, spec), { uid: uid });
    };
    return {
      get: get,
      getOpt: getOpt,
      asSpec: asSpec
    };
  };

  var promise = function promise() {
    var Promise = function Promise(fn) {
      if (_typeof(this) !== 'object') {
        throw new TypeError('Promises must be constructed via new');
      }
      if (typeof fn !== 'function') {
        throw new TypeError('not a function');
      }
      this._state = null;
      this._value = null;
      this._deferreds = [];
      doResolve(fn, bind(resolve, this), bind(reject, this));
    };
    var asap = Promise.immediateFn || typeof window.setImmediate === 'function' && window.setImmediate || function (fn) {
      domGlobals.setTimeout(fn, 1);
    };
    function bind(fn, thisArg) {
      return function () {
        return fn.apply(thisArg, arguments);
      };
    }
    var isArray = Array.isArray || function (value) {
      return Object.prototype.toString.call(value) === '[object Array]';
    };
    function handle(deferred) {
      var me = this;
      if (this._state === null) {
        this._deferreds.push(deferred);
        return;
      }
      asap(function () {
        var cb = me._state ? deferred.onFulfilled : deferred.onRejected;
        if (cb === null) {
          (me._state ? deferred.resolve : deferred.reject)(me._value);
          return;
        }
        var ret;
        try {
          ret = cb(me._value);
        } catch (e) {
          deferred.reject(e);
          return;
        }
        deferred.resolve(ret);
      });
    }
    function resolve(newValue) {
      try {
        if (newValue === this) {
          throw new TypeError('A promise cannot be resolved with itself.');
        }
        if (newValue && ((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) === 'object' || typeof newValue === 'function')) {
          var then = newValue.then;
          if (typeof then === 'function') {
            doResolve(bind(then, newValue), bind(resolve, this), bind(reject, this));
            return;
          }
        }
        this._state = true;
        this._value = newValue;
        finale.call(this);
      } catch (e) {
        reject.call(this, e);
      }
    }
    function reject(newValue) {
      this._state = false;
      this._value = newValue;
      finale.call(this);
    }
    function finale() {
      for (var _i = 0, _a = this._deferreds; _i < _a.length; _i++) {
        var deferred = _a[_i];
        handle.call(this, deferred);
      }
      this._deferreds = [];
    }
    function Handler(onFulfilled, onRejected, resolve, reject) {
      this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
      this.onRejected = typeof onRejected === 'function' ? onRejected : null;
      this.resolve = resolve;
      this.reject = reject;
    }
    function doResolve(fn, onFulfilled, onRejected) {
      var done = false;
      try {
        fn(function (value) {
          if (done) {
            return;
          }
          done = true;
          onFulfilled(value);
        }, function (reason) {
          if (done) {
            return;
          }
          done = true;
          onRejected(reason);
        });
      } catch (ex) {
        if (done) {
          return;
        }
        done = true;
        onRejected(ex);
      }
    }
    Promise.prototype.catch = function (onRejected) {
      return this.then(null, onRejected);
    };
    Promise.prototype.then = function (onFulfilled, onRejected) {
      var me = this;
      return new Promise(function (resolve, reject) {
        handle.call(me, new Handler(onFulfilled, onRejected, resolve, reject));
      });
    };
    Promise.all = function () {
      var values = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
      }
      var args = Array.prototype.slice.call(values.length === 1 && isArray(values[0]) ? values[0] : values);
      return new Promise(function (resolve, reject) {
        if (args.length === 0) {
          return resolve([]);
        }
        var remaining = args.length;
        function res(i, val) {
          try {
            if (val && ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' || typeof val === 'function')) {
              var then = val.then;
              if (typeof then === 'function') {
                then.call(val, function (val) {
                  res(i, val);
                }, reject);
                return;
              }
            }
            args[i] = val;
            if (--remaining === 0) {
              resolve(args);
            }
          } catch (ex) {
            reject(ex);
          }
        }
        for (var i = 0; i < args.length; i++) {
          res(i, args[i]);
        }
      });
    };
    Promise.resolve = function (value) {
      if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.constructor === Promise) {
        return value;
      }
      return new Promise(function (resolve) {
        resolve(value);
      });
    };
    Promise.reject = function (reason) {
      return new Promise(function (resolve, reject) {
        reject(reason);
      });
    };
    Promise.race = function (values) {
      return new Promise(function (resolve, reject) {
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
          var value = values_1[_i];
          value.then(resolve, reject);
        }
      });
    };
    return Promise;
  };
  var Promise = window.Promise ? window.Promise : promise();

  function blobToDataUri(blob) {
    return new Promise(function (resolve) {
      var reader = new domGlobals.FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }
  function blobToBase64(blob) {
    return blobToDataUri(blob).then(function (dataUri) {
      return dataUri.split(',')[1];
    });
  }

  var blobToBase64$1 = function blobToBase64$1(blob) {
    return blobToBase64(blob);
  };

  var addImage = function addImage(editor, blob) {
    blobToBase64$1(blob).then(function (base64) {
      editor.undoManager.transact(function () {
        var cache = editor.editorUpload.blobCache;
        var info = cache.create(generate$1('mceu'), blob, base64);
        cache.add(info);
        var img = editor.dom.createHTML('img', { src: info.blobUri() });
        editor.insertContent(img);
      });
    });
  };
  var extractBlob = function extractBlob(simulatedEvent) {
    var event = simulatedEvent.event();
    var files = event.raw().target.files || event.raw().dataTransfer.files;
    return Option.from(files[0]);
  };
  var sketch$4 = function sketch$4(editor) {
    var pickerDom = {
      tag: 'input',
      attributes: {
        accept: 'image/*',
        type: 'file',
        title: ''
      },
      styles: {
        visibility: 'hidden',
        position: 'absolute'
      }
    };
    var memPicker = record({
      dom: pickerDom,
      events: derive([cutter(click()), run(change(), function (picker, simulatedEvent) {
        extractBlob(simulatedEvent).each(function (blob) {
          addImage(editor, blob);
        });
      })])
    });
    return Button.sketch({
      dom: Buttons.getToolbarIconButton('image', editor),
      components: [memPicker.asSpec()],
      action: function action(button) {
        var picker = memPicker.get(button);
        picker.element().dom().click();
      }
    });
  };

  var get$8 = function get$8(element) {
    return element.dom().textContent;
  };
  var set$5 = function set$5(element, value) {
    element.dom().textContent = value;
  };

  var isNotEmpty = function isNotEmpty(val) {
    return val.length > 0;
  };
  var defaultToEmpty = function defaultToEmpty(str) {
    return str === undefined || str === null ? '' : str;
  };
  var noLink = function noLink(editor) {
    var text = editor.selection.getContent({ format: 'text' });
    return {
      url: '',
      text: text,
      title: '',
      target: '',
      link: Option.none()
    };
  };
  var fromLink = function fromLink(link) {
    var text = get$8(link);
    var url = get(link, 'href');
    var title = get(link, 'title');
    var target = get(link, 'target');
    return {
      url: defaultToEmpty(url),
      text: text !== url ? defaultToEmpty(text) : '',
      title: defaultToEmpty(title),
      target: defaultToEmpty(target),
      link: Option.some(link)
    };
  };
  var getInfo = function getInfo(editor) {
    return query(editor).fold(function () {
      return noLink(editor);
    }, function (link) {
      return fromLink(link);
    });
  };
  var wasSimple = function wasSimple(link) {
    var prevHref = get(link, 'href');
    var prevText = get$8(link);
    return prevHref === prevText;
  };
  var getTextToApply = function getTextToApply(link, url, info) {
    return info.text.toOption().filter(isNotEmpty).fold(function () {
      return wasSimple(link) ? Option.some(url) : Option.none();
    }, Option.some);
  };
  var unlinkIfRequired = function unlinkIfRequired(editor, info) {
    var activeLink = info.link.bind(identity);
    activeLink.each(function (link) {
      editor.execCommand('unlink');
    });
  };
  var getAttrs$1 = function getAttrs$1(url, info) {
    var attrs = {};
    attrs.href = url;
    info.title.toOption().filter(isNotEmpty).each(function (title) {
      attrs.title = title;
    });
    info.target.toOption().filter(isNotEmpty).each(function (target) {
      attrs.target = target;
    });
    return attrs;
  };
  var applyInfo = function applyInfo(editor, info) {
    info.url.toOption().filter(isNotEmpty).fold(function () {
      unlinkIfRequired(editor, info);
    }, function (url) {
      var attrs = getAttrs$1(url, info);
      var activeLink = info.link.bind(identity);
      activeLink.fold(function () {
        var text = info.text.toOption().filter(isNotEmpty).getOr(url);
        editor.insertContent(editor.dom.createHTML('a', attrs, editor.dom.encode(text)));
      }, function (link) {
        var text = getTextToApply(link, url, info);
        setAll(link, attrs);
        text.each(function (newText) {
          set$5(link, newText);
        });
      });
    });
  };
  var query = function query(editor) {
    var start = Element.fromDom(editor.selection.getStart());
    return closest$2(start, 'a');
  };
  var LinkBridge = {
    getInfo: getInfo,
    applyInfo: applyInfo,
    query: query
  };

  var platform$2 = detect$3();
  var preserve = function preserve(f, editor) {
    var rng = editor.selection.getRng();
    f();
    editor.selection.setRng(rng);
  };
  var forAndroid = function forAndroid(editor, f) {
    var wrapper = platform$2.os.isAndroid() ? preserve : apply;
    wrapper(f, editor);
  };
  var RangePreserver = { forAndroid: forAndroid };

  var events$6 = function events$6(name, eventHandlers) {
    var events = derive(eventHandlers);
    return create$1({
      fields: [strict$1('enabled')],
      name: name,
      active: { events: constant(events) }
    });
  };
  var config = function config(name, eventHandlers) {
    var me = events$6(name, eventHandlers);
    return {
      key: name,
      value: {
        config: {},
        me: me,
        configAsRaw: constant({}),
        initialConfig: {},
        state: NoState
      }
    };
  };

  var getCurrent = function getCurrent(component, composeConfig, composeState) {
    return composeConfig.find(component);
  };

  var ComposeApis = /*#__PURE__*/Object.freeze({
    getCurrent: getCurrent
  });

  var ComposeSchema = [strict$1('find')];

  var Composing = create$1({
    fields: ComposeSchema,
    name: 'composing',
    apis: ComposeApis
  });

  var factory$1 = function factory$1(detail) {
    var _a = detail.dom,
        attributes = _a.attributes,
        domWithoutAttributes = __rest(_a, ['attributes']);
    return {
      uid: detail.uid,
      dom: _assign({
        tag: 'div',
        attributes: _assign({ role: 'presentation' }, attributes)
      }, domWithoutAttributes),
      components: detail.components,
      behaviours: get$5(detail.containerBehaviours),
      events: detail.events,
      domModification: detail.domModification,
      eventOrder: detail.eventOrder
    };
  };
  var Container = single$2({
    name: 'Container',
    factory: factory$1,
    configFields: [defaulted$1('components', []), field$1('containerBehaviours', []), defaulted$1('events', {}), defaulted$1('domModification', {}), defaulted$1('eventOrder', {})]
  });

  var factory$2 = function factory$2(detail) {
    return {
      uid: detail.uid,
      dom: detail.dom,
      behaviours: SketchBehaviours.augment(detail.dataBehaviours, [Representing.config({
        store: {
          mode: 'memory',
          initialValue: detail.getInitialValue()
        }
      }), Composing.config({ find: Option.some })]),
      events: derive([runOnAttached(function (component, simulatedEvent) {
        Representing.setValue(component, detail.getInitialValue());
      })])
    };
  };
  var DataField = single$2({
    name: 'DataField',
    factory: factory$2,
    configFields: [strict$1('uid'), strict$1('dom'), strict$1('getInitialValue'), SketchBehaviours.field('dataBehaviours', [Representing, Composing])]
  });

  var get$9 = function get$9(element) {
    return element.dom().value;
  };
  var set$6 = function set$6(element, value) {
    if (value === undefined) {
      throw new Error('Value.set was undefined');
    }
    element.dom().value = value;
  };

  var schema$8 = constant([option('data'), defaulted$1('inputAttributes', {}), defaulted$1('inputStyles', {}), defaulted$1('tag', 'input'), defaulted$1('inputClasses', []), onHandler('onSetValue'), defaulted$1('styles', {}), defaulted$1('eventOrder', {}), field$1('inputBehaviours', [Representing, Focusing]), defaulted$1('selectOnFocus', true)]);
  var focusBehaviours = function focusBehaviours(detail) {
    return derive$1([Focusing.config({
      onFocus: detail.selectOnFocus === false ? noop : function (component) {
        var input = component.element();
        var value = get$9(input);
        input.dom().setSelectionRange(0, value.length);
      }
    })]);
  };
  var behaviours = function behaviours(detail) {
    return _assign(_assign({}, focusBehaviours(detail)), augment(detail.inputBehaviours, [Representing.config({
      store: {
        mode: 'manual',
        initialValue: detail.data.getOr(undefined),
        getValue: function getValue(input) {
          return get$9(input.element());
        },
        setValue: function setValue(input, data) {
          var current = get$9(input.element());
          if (current !== data) {
            set$6(input.element(), data);
          }
        }
      },
      onSetValue: detail.onSetValue
    })]));
  };
  var dom$2 = function dom$2(detail) {
    return {
      tag: detail.tag,
      attributes: _assign({ type: 'text' }, detail.inputAttributes),
      styles: detail.inputStyles,
      classes: detail.inputClasses
    };
  };

  var factory$3 = function factory$3(detail, spec) {
    return {
      uid: detail.uid,
      dom: dom$2(detail),
      components: [],
      behaviours: behaviours(detail),
      eventOrder: detail.eventOrder
    };
  };
  var Input = single$2({
    name: 'Input',
    configFields: schema$8(),
    factory: factory$3
  });

  var exhibit$3 = function exhibit$3(base, tabConfig) {
    return nu$5({
      attributes: wrapAll$1([{
        key: tabConfig.tabAttr,
        value: 'true'
      }])
    });
  };

  var ActiveTabstopping = /*#__PURE__*/Object.freeze({
    exhibit: exhibit$3
  });

  var TabstopSchema = [defaulted$1('tabAttr', 'data-alloy-tabstop')];

  var Tabstopping = create$1({
    fields: TabstopSchema,
    name: 'tabstopping',
    active: ActiveTabstopping
  });

  var global$3 = tinymce.util.Tools.resolve('tinymce.util.I18n');

  var clearInputBehaviour = 'input-clearing';
  var field$2 = function field$2(name, placeholder) {
    var inputSpec = record(Input.sketch({
      inputAttributes: { placeholder: global$3.translate(placeholder) },
      onSetValue: function onSetValue(input$1, data) {
        emit(input$1, input());
      },
      inputBehaviours: derive$1([Composing.config({ find: Option.some }), Tabstopping.config({}), Keying.config({ mode: 'execution' })]),
      selectOnFocus: false
    }));
    var buttonSpec = record(Button.sketch({
      dom: dom$1('<button class="${prefix}-input-container-x ${prefix}-icon-cancel-circle ${prefix}-icon"></button>'),
      action: function action(button) {
        var input = inputSpec.get(button);
        Representing.setValue(input, '');
      }
    }));
    return {
      name: name,
      spec: Container.sketch({
        dom: dom$1('<div class="${prefix}-input-container"></div>'),
        components: [inputSpec.asSpec(), buttonSpec.asSpec()],
        containerBehaviours: derive$1([Toggling.config({ toggleClass: Styles.resolve('input-container-empty') }), Composing.config({
          find: function find(comp) {
            return Option.some(inputSpec.get(comp));
          }
        }), config(clearInputBehaviour, [run(input(), function (iContainer) {
          var input = inputSpec.get(iContainer);
          var val = Representing.getValue(input);
          var f = val.length > 0 ? Toggling.off : Toggling.on;
          f(iContainer);
        })])])
      })
    };
  };
  var hidden = function hidden(name) {
    return {
      name: name,
      spec: DataField.sketch({
        dom: {
          tag: 'span',
          styles: { display: 'none' }
        },
        getInitialValue: function getInitialValue() {
          return Option.none();
        }
      })
    };
  };

  var nativeDisabled = ['input', 'button', 'textarea', 'select'];
  var onLoad$5 = function onLoad$5(component, disableConfig, disableState) {
    if (disableConfig.disabled) {
      disable(component, disableConfig);
    }
  };
  var hasNative = function hasNative(component, config) {
    return config.useNative === true && contains(nativeDisabled, name(component.element()));
  };
  var nativeIsDisabled = function nativeIsDisabled(component) {
    return has$1(component.element(), 'disabled');
  };
  var nativeDisable = function nativeDisable(component) {
    set(component.element(), 'disabled', 'disabled');
  };
  var nativeEnable = function nativeEnable(component) {
    remove$1(component.element(), 'disabled');
  };
  var ariaIsDisabled = function ariaIsDisabled(component) {
    return get(component.element(), 'aria-disabled') === 'true';
  };
  var ariaDisable = function ariaDisable(component) {
    set(component.element(), 'aria-disabled', 'true');
  };
  var ariaEnable = function ariaEnable(component) {
    set(component.element(), 'aria-disabled', 'false');
  };
  var disable = function disable(component, disableConfig, disableState) {
    disableConfig.disableClass.each(function (disableClass) {
      add$2(component.element(), disableClass);
    });
    var f = hasNative(component, disableConfig) ? nativeDisable : ariaDisable;
    f(component);
    disableConfig.onDisabled(component);
  };
  var enable = function enable(component, disableConfig, disableState) {
    disableConfig.disableClass.each(function (disableClass) {
      remove$4(component.element(), disableClass);
    });
    var f = hasNative(component, disableConfig) ? nativeEnable : ariaEnable;
    f(component);
    disableConfig.onEnabled(component);
  };
  var isDisabled = function isDisabled(component, disableConfig) {
    return hasNative(component, disableConfig) ? nativeIsDisabled(component) : ariaIsDisabled(component);
  };
  var set$7 = function set$7(component, disableConfig, disableState, disabled) {
    var f = disabled ? disable : enable;
    f(component, disableConfig, disableState);
  };

  var DisableApis = /*#__PURE__*/Object.freeze({
    enable: enable,
    disable: disable,
    isDisabled: isDisabled,
    onLoad: onLoad$5,
    set: set$7
  });

  var exhibit$4 = function exhibit$4(base, disableConfig, disableState) {
    return nu$5({ classes: disableConfig.disabled ? disableConfig.disableClass.map(pure).getOr([]) : [] });
  };
  var events$7 = function events$7(disableConfig, disableState) {
    return derive([abort(execute(), function (component, simulatedEvent) {
      return isDisabled(component, disableConfig);
    }), loadEvent(disableConfig, disableState, onLoad$5)]);
  };

  var ActiveDisable = /*#__PURE__*/Object.freeze({
    exhibit: exhibit$4,
    events: events$7
  });

  var DisableSchema = [defaulted$1('disabled', false), defaulted$1('useNative', true), option('disableClass'), onHandler('onDisabled'), onHandler('onEnabled')];

  var Disabling = create$1({
    fields: DisableSchema,
    name: 'disabling',
    active: ActiveDisable,
    apis: DisableApis
  });

  var owner$1 = 'form';
  var schema$9 = [field$1('formBehaviours', [Representing])];
  var getPartName = function getPartName(name) {
    return '<alloy.field.' + name + '>';
  };
  var sketch$5 = function sketch$5(fSpec) {
    var parts = function () {
      var _record = [];
      var field = function field(name, config) {
        _record.push(name);
        return generateOne(owner$1, getPartName(name), config);
      };
      return {
        field: field,
        record: function record() {
          return _record;
        }
      };
    }();
    var spec = fSpec(parts);
    var partNames = parts.record();
    var fieldParts = map$1(partNames, function (n) {
      return required({
        name: n,
        pname: getPartName(n)
      });
    });
    return composite(owner$1, schema$9, fieldParts, make, spec);
  };
  var toResult$1 = function toResult$1(o, e) {
    return o.fold(function () {
      return Result.error(e);
    }, Result.value);
  };
  var make = function make(detail, components, spec) {
    return {
      uid: detail.uid,
      dom: detail.dom,
      components: components,
      behaviours: augment(detail.formBehaviours, [Representing.config({
        store: {
          mode: 'manual',
          getValue: function getValue(form) {
            var resPs = getAllParts(form, detail);
            return map(resPs, function (resPThunk, pName) {
              return resPThunk().bind(function (v) {
                var opt = Composing.getCurrent(v);
                return toResult$1(opt, 'missing current');
              }).map(Representing.getValue);
            });
          },
          setValue: function setValue(form, values) {
            each(values, function (newValue, key) {
              getPart(form, detail, key).each(function (wrapper) {
                Composing.getCurrent(wrapper).each(function (field) {
                  Representing.setValue(field, newValue);
                });
              });
            });
          }
        }
      })]),
      apis: {
        getField: function getField(form, key) {
          return getPart(form, detail, key).bind(Composing.getCurrent);
        }
      }
    };
  };
  var Form = {
    getField: makeApi(function (apis, component, key) {
      return apis.getField(component, key);
    }),
    sketch: sketch$5
  };

  var api$2 = function api$2() {
    var subject = Cell(Option.none());
    var revoke = function revoke() {
      subject.get().each(function (s) {
        s.destroy();
      });
    };
    var clear = function clear() {
      revoke();
      subject.set(Option.none());
    };
    var set = function set(s) {
      revoke();
      subject.set(Option.some(s));
    };
    var run = function run(f) {
      subject.get().each(f);
    };
    var isSet = function isSet() {
      return subject.get().isSome();
    };
    return {
      clear: clear,
      isSet: isSet,
      set: set,
      run: run
    };
  };
  var value$2 = function value$2() {
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

  var SWIPING_LEFT = 1;
  var SWIPING_RIGHT = -1;
  var SWIPING_NONE = 0;
  var init$2 = function init$2(xValue) {
    return {
      xValue: xValue,
      points: []
    };
  };
  var move$1 = function move$1(model, xValue) {
    if (xValue === model.xValue) {
      return model;
    }
    var currentDirection = xValue - model.xValue > 0 ? SWIPING_LEFT : SWIPING_RIGHT;
    var newPoint = {
      direction: currentDirection,
      xValue: xValue
    };
    var priorPoints = function () {
      if (model.points.length === 0) {
        return [];
      } else {
        var prev = model.points[model.points.length - 1];
        return prev.direction === currentDirection ? model.points.slice(0, model.points.length - 1) : model.points;
      }
    }();
    return {
      xValue: xValue,
      points: priorPoints.concat([newPoint])
    };
  };
  var complete = function complete(model) {
    if (model.points.length === 0) {
      return SWIPING_NONE;
    } else {
      var firstDirection = model.points[0].direction;
      var lastDirection = model.points[model.points.length - 1].direction;
      return firstDirection === SWIPING_RIGHT && lastDirection === SWIPING_RIGHT ? SWIPING_RIGHT : firstDirection === SWIPING_LEFT && lastDirection === SWIPING_LEFT ? SWIPING_LEFT : SWIPING_NONE;
    }
  };
  var SwipingModel = {
    init: init$2,
    move: move$1,
    complete: complete
  };

  var sketch$6 = function sketch$6(rawSpec) {
    var navigateEvent = 'navigateEvent';
    var wrapperAdhocEvents = 'serializer-wrapper-events';
    var formAdhocEvents = 'form-events';
    var schema = objOf([strict$1('fields'), defaulted$1('maxFieldIndex', rawSpec.fields.length - 1), strict$1('onExecute'), strict$1('getInitialValue'), state$1('state', function () {
      return {
        dialogSwipeState: value$2(),
        currentScreen: Cell(0)
      };
    })]);
    var spec$1 = asRawOrDie('SerialisedDialog', schema, rawSpec);
    var navigationButton = function navigationButton(direction, directionName, enabled) {
      return Button.sketch({
        dom: dom$1('<span class="${prefix}-icon-' + directionName + ' ${prefix}-icon"></span>'),
        action: function action(button) {
          emitWith(button, navigateEvent, { direction: direction });
        },
        buttonBehaviours: derive$1([Disabling.config({
          disableClass: Styles.resolve('toolbar-navigation-disabled'),
          disabled: !enabled
        })])
      });
    };
    var reposition = function reposition(dialog, message) {
      descendant$1(dialog.element(), '.' + Styles.resolve('serialised-dialog-chain')).each(function (parent) {
        set$3(parent, 'left', -spec$1.state.currentScreen.get() * message.width + 'px');
      });
    };
    var navigate = function navigate(dialog, direction) {
      var screens = descendants(dialog.element(), '.' + Styles.resolve('serialised-dialog-screen'));
      descendant$1(dialog.element(), '.' + Styles.resolve('serialised-dialog-chain')).each(function (parent) {
        if (spec$1.state.currentScreen.get() + direction >= 0 && spec$1.state.currentScreen.get() + direction < screens.length) {
          getRaw(parent, 'left').each(function (left) {
            var currentLeft = parseInt(left, 10);
            var w = get$6(screens[0]);
            set$3(parent, 'left', currentLeft - direction * w + 'px');
          });
          spec$1.state.currentScreen.set(spec$1.state.currentScreen.get() + direction);
        }
      });
    };
    var focusInput = function focusInput(dialog) {
      var inputs = descendants(dialog.element(), 'input');
      var optInput = Option.from(inputs[spec$1.state.currentScreen.get()]);
      optInput.each(function (input) {
        dialog.getSystem().getByDom(input).each(function (inputComp) {
          dispatchFocus(dialog, inputComp.element());
        });
      });
      var dotitems = memDots.get(dialog);
      Highlighting.highlightAt(dotitems, spec$1.state.currentScreen.get());
    };
    var resetState = function resetState() {
      spec$1.state.currentScreen.set(0);
      spec$1.state.dialogSwipeState.clear();
    };
    var memForm = record(Form.sketch(function (parts) {
      return {
        dom: dom$1('<div class="${prefix}-serialised-dialog"></div>'),
        components: [Container.sketch({
          dom: dom$1('<div class="${prefix}-serialised-dialog-chain" style="left: 0px; position: absolute;"></div>'),
          components: map$1(spec$1.fields, function (field, i) {
            return i <= spec$1.maxFieldIndex ? Container.sketch({
              dom: dom$1('<div class="${prefix}-serialised-dialog-screen"></div>'),
              components: [navigationButton(-1, 'previous', i > 0), parts.field(field.name, field.spec), navigationButton(+1, 'next', i < spec$1.maxFieldIndex)]
            }) : parts.field(field.name, field.spec);
          })
        })],
        formBehaviours: derive$1([Receivers.orientation(function (dialog, message) {
          reposition(dialog, message);
        }), Keying.config({
          mode: 'special',
          focusIn: function focusIn(dialog) {
            focusInput(dialog);
          },
          onTab: function onTab(dialog) {
            navigate(dialog, +1);
            return Option.some(true);
          },
          onShiftTab: function onShiftTab(dialog) {
            navigate(dialog, -1);
            return Option.some(true);
          }
        }), config(formAdhocEvents, [runOnAttached(function (dialog, simulatedEvent) {
          resetState();
          var dotitems = memDots.get(dialog);
          Highlighting.highlightFirst(dotitems);
          spec$1.getInitialValue(dialog).each(function (v) {
            Representing.setValue(dialog, v);
          });
        }), runOnExecute(spec$1.onExecute), run(transitionend(), function (dialog, simulatedEvent) {
          var event = simulatedEvent.event();
          if (event.raw().propertyName === 'left') {
            focusInput(dialog);
          }
        }), run(navigateEvent, function (dialog, simulatedEvent) {
          var event = simulatedEvent.event();
          var direction = event.direction();
          navigate(dialog, direction);
        })])])
      };
    }));
    var memDots = record({
      dom: dom$1('<div class="${prefix}-dot-container"></div>'),
      behaviours: derive$1([Highlighting.config({
        highlightClass: Styles.resolve('dot-active'),
        itemClass: Styles.resolve('dot-item')
      })]),
      components: bind(spec$1.fields, function (_f, i) {
        return i <= spec$1.maxFieldIndex ? [spec('<div class="${prefix}-dot-item ${prefix}-icon-full-dot ${prefix}-icon"></div>')] : [];
      })
    });
    return {
      dom: dom$1('<div class="${prefix}-serializer-wrapper"></div>'),
      components: [memForm.asSpec(), memDots.asSpec()],
      behaviours: derive$1([Keying.config({
        mode: 'special',
        focusIn: function focusIn(wrapper) {
          var form = memForm.get(wrapper);
          Keying.focusIn(form);
        }
      }), config(wrapperAdhocEvents, [run(touchstart(), function (wrapper, simulatedEvent) {
        var event = simulatedEvent.event();
        spec$1.state.dialogSwipeState.set(SwipingModel.init(event.raw().touches[0].clientX));
      }), run(touchmove(), function (wrapper, simulatedEvent) {
        var event = simulatedEvent.event();
        spec$1.state.dialogSwipeState.on(function (state) {
          simulatedEvent.event().prevent();
          spec$1.state.dialogSwipeState.set(SwipingModel.move(state, event.raw().touches[0].clientX));
        });
      }), run(touchend(), function (wrapper) {
        spec$1.state.dialogSwipeState.on(function (state) {
          var dialog = memForm.get(wrapper);
          var direction = -1 * SwipingModel.complete(state);
          navigate(dialog, direction);
        });
      })])])
    };
  };

  var getGroups = cached(function (realm, editor) {
    return [{
      label: 'the link group',
      items: [sketch$6({
        fields: [field$2('url', 'Type or paste URL'), field$2('text', 'Link text'), field$2('title', 'Link title'), field$2('target', 'Link target'), hidden('link')],
        maxFieldIndex: ['url', 'text', 'title', 'target'].length - 1,
        getInitialValue: function getInitialValue() {
          return Option.some(LinkBridge.getInfo(editor));
        },
        onExecute: function onExecute(dialog) {
          var info = Representing.getValue(dialog);
          LinkBridge.applyInfo(editor, info);
          realm.restoreToolbar();
          editor.focus();
        }
      })]
    }];
  });
  var sketch$7 = function sketch$7(realm, editor) {
    return Buttons.forToolbarStateAction(editor, 'link', 'link', function () {
      var groups = getGroups(realm, editor);
      realm.setContextToolbar(groups);
      RangePreserver.forAndroid(editor, function () {
        realm.focusToolbar();
      });
      LinkBridge.query(editor).each(function (link) {
        editor.selection.select(link.dom());
      });
    });
  };

  var DefaultStyleFormats = [{
    title: 'Headings',
    items: [{
      title: 'Heading 1',
      format: 'h1'
    }, {
      title: 'Heading 2',
      format: 'h2'
    }, {
      title: 'Heading 3',
      format: 'h3'
    }, {
      title: 'Heading 4',
      format: 'h4'
    }, {
      title: 'Heading 5',
      format: 'h5'
    }, {
      title: 'Heading 6',
      format: 'h6'
    }]
  }, {
    title: 'Inline',
    items: [{
      title: 'Bold',
      icon: 'bold',
      format: 'bold'
    }, {
      title: 'Italic',
      icon: 'italic',
      format: 'italic'
    }, {
      title: 'Underline',
      icon: 'underline',
      format: 'underline'
    }, {
      title: 'Strikethrough',
      icon: 'strikethrough',
      format: 'strikethrough'
    }, {
      title: 'Superscript',
      icon: 'superscript',
      format: 'superscript'
    }, {
      title: 'Subscript',
      icon: 'subscript',
      format: 'subscript'
    }, {
      title: 'Code',
      icon: 'code',
      format: 'code'
    }]
  }, {
    title: 'Blocks',
    items: [{
      title: 'Paragraph',
      format: 'p'
    }, {
      title: 'Blockquote',
      format: 'blockquote'
    }, {
      title: 'Div',
      format: 'div'
    }, {
      title: 'Pre',
      format: 'pre'
    }]
  }, {
    title: 'Alignment',
    items: [{
      title: 'Left',
      icon: 'alignleft',
      format: 'alignleft'
    }, {
      title: 'Center',
      icon: 'aligncenter',
      format: 'aligncenter'
    }, {
      title: 'Right',
      icon: 'alignright',
      format: 'alignright'
    }, {
      title: 'Justify',
      icon: 'alignjustify',
      format: 'alignjustify'
    }]
  }];

  var isRecursive = function isRecursive(component, originator, target) {
    return eq(originator, component.element()) && !eq(originator, target);
  };
  var events$8 = derive([can(focus(), function (component, simulatedEvent) {
    var originator = simulatedEvent.event().originator();
    var target = simulatedEvent.event().target();
    if (isRecursive(component, originator, target)) {
      domGlobals.console.warn(focus() + ' did not get interpreted by the desired target. ' + '\nOriginator: ' + element(originator) + '\nTarget: ' + element(target) + '\nCheck the ' + focus() + ' event handlers');
      return false;
    } else {
      return true;
    }
  })]);

  var DefaultEvents = /*#__PURE__*/Object.freeze({
    events: events$8
  });

  var make$1 = identity;

  var NoContextApi = function NoContextApi(getComp) {
    var fail = function fail(event) {
      return function () {
        throw new Error('The component must be in a context to send: ' + event + '\n' + element(getComp().element()) + ' is not in context.');
      };
    };
    return {
      debugInfo: constant('fake'),
      triggerEvent: fail('triggerEvent'),
      triggerFocus: fail('triggerFocus'),
      triggerEscape: fail('triggerEscape'),
      build: fail('build'),
      addToWorld: fail('addToWorld'),
      removeFromWorld: fail('removeFromWorld'),
      addToGui: fail('addToGui'),
      removeFromGui: fail('removeFromGui'),
      getByUid: fail('getByUid'),
      getByDom: fail('getByDom'),
      broadcast: fail('broadcast'),
      broadcastOn: fail('broadcastOn'),
      broadcastEvent: fail('broadcastEvent'),
      isConnected: constant(false)
    };
  };
  var singleton = NoContextApi();

  var generateFrom = function generateFrom(spec, all) {
    var schema = map$1(all, function (a) {
      return optionObjOf(a.name(), [strict$1('config'), defaulted$1('state', NoState)]);
    });
    var validated = asRaw('component.behaviours', objOf(schema), spec.behaviours).fold(function (errInfo) {
      throw new Error(formatError(errInfo) + '\nComplete spec:\n' + JSON.stringify(spec, null, 2));
    }, function (v) {
      return v;
    });
    return {
      list: all,
      data: map(validated, function (optBlobThunk) {
        var optBlob = optBlobThunk;
        var output = optBlob.map(function (blob) {
          return {
            config: blob.config,
            state: blob.state.init(blob.config)
          };
        });
        return function () {
          return output;
        };
      })
    };
  };
  var getBehaviours = function getBehaviours(bData) {
    return bData.list;
  };
  var getData = function getData(bData) {
    return bData.data;
  };

  var byInnerKey = function byInnerKey(data, tuple) {
    var r = {};
    each(data, function (detail, key) {
      each(detail, function (value, indexKey) {
        var chain = readOr$1(indexKey, [])(r);
        r[indexKey] = chain.concat([tuple(key, value)]);
      });
    });
    return r;
  };

  var combine$1 = function combine$1(info, baseMod, behaviours, base) {
    var modsByBehaviour = _assign({}, baseMod);
    each$1(behaviours, function (behaviour) {
      modsByBehaviour[behaviour.name()] = behaviour.exhibit(info, base);
    });
    var nameAndMod = function nameAndMod(name, modification) {
      return {
        name: name,
        modification: modification
      };
    };
    var byAspect = byInnerKey(modsByBehaviour, nameAndMod);
    var combineObjects = function combineObjects(objects) {
      return foldr(objects, function (b, a) {
        return _assign(_assign({}, a.modification), b);
      }, {});
    };
    var combinedClasses = foldr(byAspect.classes, function (b, a) {
      return a.modification.concat(b);
    }, []);
    var combinedAttributes = combineObjects(byAspect.attributes);
    var combinedStyles = combineObjects(byAspect.styles);
    return nu$5({
      classes: combinedClasses,
      attributes: combinedAttributes,
      styles: combinedStyles
    });
  };

  var sortKeys = function sortKeys(label, keyName, array, order) {
    var sliced = array.slice(0);
    try {
      var sorted = sliced.sort(function (a, b) {
        var aKey = a[keyName]();
        var bKey = b[keyName]();
        var aIndex = order.indexOf(aKey);
        var bIndex = order.indexOf(bKey);
        if (aIndex === -1) {
          throw new Error('The ordering for ' + label + ' does not have an entry for ' + aKey + '.\nOrder specified: ' + JSON.stringify(order, null, 2));
        }
        if (bIndex === -1) {
          throw new Error('The ordering for ' + label + ' does not have an entry for ' + bKey + '.\nOrder specified: ' + JSON.stringify(order, null, 2));
        }
        if (aIndex < bIndex) {
          return -1;
        } else if (bIndex < aIndex) {
          return 1;
        } else {
          return 0;
        }
      });
      return Result.value(sorted);
    } catch (err) {
      return Result.error([err]);
    }
  };

  var uncurried = function uncurried(handler, purpose) {
    return {
      handler: handler,
      purpose: constant(purpose)
    };
  };
  var curried = function curried(handler, purpose) {
    return {
      cHandler: handler,
      purpose: constant(purpose)
    };
  };
  var curryArgs = function curryArgs(descHandler, extraArgs) {
    return curried(curry.apply(undefined, [descHandler.handler].concat(extraArgs)), descHandler.purpose());
  };
  var getCurried = function getCurried(descHandler) {
    return descHandler.cHandler;
  };

  var behaviourTuple = function behaviourTuple(name, handler) {
    return {
      name: constant(name),
      handler: constant(handler)
    };
  };
  var nameToHandlers = function nameToHandlers(behaviours, info) {
    var r = {};
    each$1(behaviours, function (behaviour) {
      r[behaviour.name()] = behaviour.handlers(info);
    });
    return r;
  };
  var groupByEvents = function groupByEvents(info, behaviours, base) {
    var behaviourEvents = _assign(_assign({}, base), nameToHandlers(behaviours, info));
    return byInnerKey(behaviourEvents, behaviourTuple);
  };
  var combine$2 = function combine$2(info, eventOrder, behaviours, base) {
    var byEventName = groupByEvents(info, behaviours, base);
    return combineGroups(byEventName, eventOrder);
  };
  var assemble = function assemble(rawHandler) {
    var handler = read(rawHandler);
    return function (component, simulatedEvent) {
      var rest = [];
      for (var _i = 2; _i < arguments.length; _i++) {
        rest[_i - 2] = arguments[_i];
      }
      var args = [component, simulatedEvent].concat(rest);
      if (handler.abort.apply(undefined, args)) {
        simulatedEvent.stop();
      } else if (handler.can.apply(undefined, args)) {
        handler.run.apply(undefined, args);
      }
    };
  };
  var missingOrderError = function missingOrderError(eventName, tuples) {
    return Result.error(['The event (' + eventName + ') has more than one behaviour that listens to it.\nWhen this occurs, you must ' + 'specify an event ordering for the behaviours in your spec (e.g. [ "listing", "toggling" ]).\nThe behaviours that ' + 'can trigger it are: ' + JSON.stringify(map$1(tuples, function (c) {
      return c.name();
    }), null, 2)]);
  };
  var fuse$1 = function fuse$1(tuples, eventOrder, eventName) {
    var order = eventOrder[eventName];
    if (!order) {
      return missingOrderError(eventName, tuples);
    } else {
      return sortKeys('Event: ' + eventName, 'name', tuples, order).map(function (sortedTuples) {
        var handlers = map$1(sortedTuples, function (tuple) {
          return tuple.handler();
        });
        return fuse(handlers);
      });
    }
  };
  var combineGroups = function combineGroups(byEventName, eventOrder) {
    var r = mapToArray(byEventName, function (tuples, eventName) {
      var combined = tuples.length === 1 ? Result.value(tuples[0].handler()) : fuse$1(tuples, eventOrder, eventName);
      return combined.map(function (handler) {
        var assembled = assemble(handler);
        var purpose = tuples.length > 1 ? filter(eventOrder[eventName], function (o) {
          return exists(tuples, function (t) {
            return t.name() === o;
          });
        }).join(' > ') : tuples[0].name();
        return wrap$1(eventName, uncurried(assembled, purpose));
      });
    });
    return consolidate(r, {});
  };

  var toInfo = function toInfo(spec) {
    return asRaw('custom.definition', objOf([field('dom', 'dom', strict(), objOf([strict$1('tag'), defaulted$1('styles', {}), defaulted$1('classes', []), defaulted$1('attributes', {}), option('value'), option('innerHtml')])), strict$1('components'), strict$1('uid'), defaulted$1('events', {}), defaulted$1('apis', {}), field('eventOrder', 'eventOrder', mergeWith({
      'alloy.execute': ['disabling', 'alloy.base.behaviour', 'toggling', 'typeaheadevents'],
      'alloy.focus': ['alloy.base.behaviour', 'focusing', 'keying'],
      'alloy.system.init': ['alloy.base.behaviour', 'disabling', 'toggling', 'representing'],
      'input': ['alloy.base.behaviour', 'representing', 'streaming', 'invalidating'],
      'alloy.system.detached': ['alloy.base.behaviour', 'representing', 'item-events', 'tooltipping'],
      'mousedown': ['focusing', 'alloy.base.behaviour', 'item-type-events'],
      'mouseover': ['item-type-events', 'tooltipping']
    }), anyValue$1()), option('domModification')]), spec);
  };
  var toDefinition = function toDefinition(detail) {
    return _assign(_assign({}, detail.dom), {
      uid: detail.uid,
      domChildren: map$1(detail.components, function (comp) {
        return comp.element();
      })
    });
  };
  var toModification = function toModification(detail) {
    return detail.domModification.fold(function () {
      return nu$5({});
    }, nu$5);
  };
  var toEvents = function toEvents(info) {
    return info.events;
  };

  var add$3 = function add$3(element, classes) {
    each$1(classes, function (x) {
      add$2(element, x);
    });
  };
  var remove$6 = function remove$6(element, classes) {
    each$1(classes, function (x) {
      remove$4(element, x);
    });
  };

  var renderToDom = function renderToDom(definition) {
    var subject = Element.fromTag(definition.tag);
    setAll(subject, definition.attributes);
    add$3(subject, definition.classes);
    setAll$1(subject, definition.styles);
    definition.innerHtml.each(function (html) {
      return set$1(subject, html);
    });
    var children = definition.domChildren;
    append$1(subject, children);
    definition.value.each(function (value) {
      set$6(subject, value);
    });
    if (!definition.uid) {
      debugger;
    }
    writeOnly(subject, definition.uid);
    return subject;
  };

  var getBehaviours$1 = function getBehaviours$1(spec) {
    var behaviours = readOr$1('behaviours', {})(spec);
    var keys$1 = filter(keys(behaviours), function (k) {
      return behaviours[k] !== undefined;
    });
    return map$1(keys$1, function (k) {
      return behaviours[k].me;
    });
  };
  var generateFrom$1 = function generateFrom$1(spec, all) {
    return generateFrom(spec, all);
  };
  var generate$4 = function generate$4(spec) {
    var all = getBehaviours$1(spec);
    return generateFrom$1(spec, all);
  };

  var getDomDefinition = function getDomDefinition(info, bList, bData) {
    var definition = toDefinition(info);
    var infoModification = toModification(info);
    var baseModification = { 'alloy.base.modification': infoModification };
    var modification = bList.length > 0 ? combine$1(bData, baseModification, bList, definition) : infoModification;
    return merge$1(definition, modification);
  };
  var getEvents = function getEvents(info, bList, bData) {
    var baseEvents = { 'alloy.base.behaviour': toEvents(info) };
    return combine$2(bData, info.eventOrder, bList, baseEvents).getOrDie();
  };
  var build = function build(spec) {
    var getMe = function getMe() {
      return me;
    };
    var systemApi = Cell(singleton);
    var info = getOrDie(toInfo(spec));
    var bBlob = generate$4(spec);
    var bList = getBehaviours(bBlob);
    var bData = getData(bBlob);
    var modDefinition = getDomDefinition(info, bList, bData);
    var item = renderToDom(modDefinition);
    var events = getEvents(info, bList, bData);
    var subcomponents = Cell(info.components);
    var connect = function connect(newApi) {
      systemApi.set(newApi);
    };
    var disconnect = function disconnect() {
      systemApi.set(NoContextApi(getMe));
    };
    var syncComponents = function syncComponents() {
      var children$1 = children(item);
      var subs = bind(children$1, function (child) {
        return systemApi.get().getByDom(child).fold(function () {
          return [];
        }, function (c) {
          return [c];
        });
      });
      subcomponents.set(subs);
    };
    var config = function config(behaviour) {
      var b = bData;
      var f = isFunction(b[behaviour.name()]) ? b[behaviour.name()] : function () {
        throw new Error('Could not find ' + behaviour.name() + ' in ' + JSON.stringify(spec, null, 2));
      };
      return f();
    };
    var hasConfigured = function hasConfigured(behaviour) {
      return isFunction(bData[behaviour.name()]);
    };
    var getApis = function getApis() {
      return info.apis;
    };
    var readState = function readState(behaviourName) {
      return bData[behaviourName]().map(function (b) {
        return b.state.readState();
      }).getOr('not enabled');
    };
    var me = {
      getSystem: systemApi.get,
      config: config,
      hasConfigured: hasConfigured,
      spec: constant(spec),
      readState: readState,
      getApis: getApis,
      connect: connect,
      disconnect: disconnect,
      element: constant(item),
      syncComponents: syncComponents,
      components: subcomponents.get,
      events: constant(events)
    };
    return me;
  };

  var buildSubcomponents = function buildSubcomponents(spec) {
    var components = readOr$1('components', [])(spec);
    return map$1(components, build$1);
  };
  var buildFromSpec = function buildFromSpec(userSpec) {
    var _a = make$1(userSpec),
        specEvents = _a.events,
        spec = __rest(_a, ['events']);
    var components = buildSubcomponents(spec);
    var completeSpec = _assign(_assign({}, spec), {
      events: _assign(_assign({}, DefaultEvents), specEvents),
      components: components
    });
    return Result.value(build(completeSpec));
  };
  var text = function text(textContent) {
    var element = Element.fromText(textContent);
    return external({ element: element });
  };
  var external = function external(spec) {
    var extSpec = asRawOrDie('external.component', objOfOnly([strict$1('element'), option('uid')]), spec);
    var systemApi = Cell(NoContextApi());
    var connect = function connect(newApi) {
      systemApi.set(newApi);
    };
    var disconnect = function disconnect() {
      systemApi.set(NoContextApi(function () {
        return me;
      }));
    };
    extSpec.uid.each(function (uid) {
      writeOnly(extSpec.element, uid);
    });
    var me = {
      getSystem: systemApi.get,
      config: Option.none,
      hasConfigured: constant(false),
      connect: connect,
      disconnect: disconnect,
      getApis: function getApis() {
        return {};
      },
      element: constant(extSpec.element),
      spec: constant(spec),
      readState: constant('No state'),
      syncComponents: noop,
      components: constant([]),
      events: constant({})
    };
    return premade(me);
  };
  var uids = generate$3;
  var build$1 = function build$1(spec) {
    return getPremade(spec).fold(function () {
      var userSpecWithUid = spec.hasOwnProperty('uid') ? spec : _assign({ uid: uids('') }, spec);
      return buildFromSpec(userSpecWithUid).getOrDie();
    }, function (prebuilt) {
      return prebuilt;
    });
  };
  var premade$1 = premade;

  var hoverEvent = 'alloy.item-hover';
  var focusEvent = 'alloy.item-focus';
  var onHover = function onHover(item) {
    if (search(item.element()).isNone() || Focusing.isFocused(item)) {
      if (!Focusing.isFocused(item)) {
        Focusing.focus(item);
      }
      emitWith(item, hoverEvent, { item: item });
    }
  };
  var _onFocus = function _onFocus(item) {
    emitWith(item, focusEvent, { item: item });
  };
  var hover = constant(hoverEvent);
  var focus$3 = constant(focusEvent);

  var builder = function builder(detail) {
    return {
      dom: detail.dom,
      domModification: _assign(_assign({}, detail.domModification), { attributes: _assign(_assign(_assign({ 'role': detail.toggling.isSome() ? 'menuitemcheckbox' : 'menuitem' }, detail.domModification.attributes), { 'aria-haspopup': detail.hasSubmenu }), detail.hasSubmenu ? { 'aria-expanded': false } : {}) }),
      behaviours: SketchBehaviours.augment(detail.itemBehaviours, [detail.toggling.fold(Toggling.revoke, function (tConfig) {
        return Toggling.config(_assign({ aria: { mode: 'checked' } }, tConfig));
      }), Focusing.config({
        ignore: detail.ignoreFocus,
        stopMousedown: detail.ignoreFocus,
        onFocus: function onFocus(component) {
          _onFocus(component);
        }
      }), Keying.config({ mode: 'execution' }), Representing.config({
        store: {
          mode: 'memory',
          initialValue: detail.data
        }
      }), config('item-type-events', [run(tapOrClick(), emitExecute), cutter(mousedown()), run(mouseover(), onHover), run(focusItem(), Focusing.focus)])]),
      components: detail.components,
      eventOrder: detail.eventOrder
    };
  };
  var schema$a = [strict$1('data'), strict$1('components'), strict$1('dom'), defaulted$1('hasSubmenu', false), option('toggling'), SketchBehaviours.field('itemBehaviours', [Toggling, Focusing, Keying, Representing]), defaulted$1('ignoreFocus', false), defaulted$1('domModification', {}), output('builder', builder), defaulted$1('eventOrder', {})];

  var builder$1 = function builder$1(detail) {
    return {
      dom: detail.dom,
      components: detail.components,
      events: derive([stopper(focusItem())])
    };
  };
  var schema$b = [strict$1('dom'), strict$1('components'), output('builder', builder$1)];

  var owner$2 = function owner$2() {
    return 'item-widget';
  };
  var parts = constant([required({
    name: 'widget',
    overrides: function overrides(detail) {
      return {
        behaviours: derive$1([Representing.config({
          store: {
            mode: 'manual',
            getValue: function getValue(component) {
              return detail.data;
            },
            setValue: function setValue() {}
          }
        })])
      };
    }
  })]);

  var builder$2 = function builder$2(detail) {
    var subs = substitutes(owner$2(), detail, parts());
    var components$1 = components(owner$2(), detail, subs.internals());
    var focusWidget = function focusWidget(component) {
      return getPart(component, detail, 'widget').map(function (widget) {
        Keying.focusIn(widget);
        return widget;
      });
    };
    var onHorizontalArrow = function onHorizontalArrow(component, simulatedEvent) {
      return inside(simulatedEvent.event().target()) ? Option.none() : function () {
        if (detail.autofocus) {
          simulatedEvent.setSource(component.element());
          return Option.none();
        } else {
          return Option.none();
        }
      }();
    };
    return {
      dom: detail.dom,
      components: components$1,
      domModification: detail.domModification,
      events: derive([runOnExecute(function (component, simulatedEvent) {
        focusWidget(component).each(function (widget) {
          simulatedEvent.stop();
        });
      }), run(mouseover(), onHover), run(focusItem(), function (component, simulatedEvent) {
        if (detail.autofocus) {
          focusWidget(component);
        } else {
          Focusing.focus(component);
        }
      })]),
      behaviours: SketchBehaviours.augment(detail.widgetBehaviours, [Representing.config({
        store: {
          mode: 'memory',
          initialValue: detail.data
        }
      }), Focusing.config({
        ignore: detail.ignoreFocus,
        onFocus: function onFocus(component) {
          _onFocus(component);
        }
      }), Keying.config({
        mode: 'special',
        focusIn: detail.autofocus ? function (component) {
          focusWidget(component);
        } : revoke(),
        onLeft: onHorizontalArrow,
        onRight: onHorizontalArrow,
        onEscape: function onEscape(component, simulatedEvent) {
          if (!Focusing.isFocused(component) && !detail.autofocus) {
            Focusing.focus(component);
            return Option.some(true);
          } else if (detail.autofocus) {
            simulatedEvent.setSource(component.element());
            return Option.none();
          } else {
            return Option.none();
          }
        }
      })])
    };
  };
  var schema$c = [strict$1('uid'), strict$1('data'), strict$1('components'), strict$1('dom'), defaulted$1('autofocus', false), defaulted$1('ignoreFocus', false), SketchBehaviours.field('widgetBehaviours', [Representing, Focusing, Keying]), defaulted$1('domModification', {}), defaultUidsSchema(parts()), output('builder', builder$2)];

  var itemSchema$1 = choose$1('type', {
    widget: schema$c,
    item: schema$a,
    separator: schema$b
  });
  var configureGrid = function configureGrid(detail, movementInfo) {
    return {
      mode: 'flatgrid',
      selector: '.' + detail.markers.item,
      initSize: {
        numColumns: movementInfo.initSize.numColumns,
        numRows: movementInfo.initSize.numRows
      },
      focusManager: detail.focusManager
    };
  };
  var configureMatrix = function configureMatrix(detail, movementInfo) {
    return {
      mode: 'matrix',
      selectors: {
        row: movementInfo.rowSelector,
        cell: '.' + detail.markers.item
      },
      focusManager: detail.focusManager
    };
  };
  var configureMenu = function configureMenu(detail, movementInfo) {
    return {
      mode: 'menu',
      selector: '.' + detail.markers.item,
      moveOnTab: movementInfo.moveOnTab,
      focusManager: detail.focusManager
    };
  };
  var parts$1 = constant([group({
    factory: {
      sketch: function sketch(spec) {
        var itemInfo = asRawOrDie('menu.spec item', itemSchema$1, spec);
        return itemInfo.builder(itemInfo);
      }
    },
    name: 'items',
    unit: 'item',
    defaults: function defaults(detail, u) {
      return u.hasOwnProperty('uid') ? u : _assign(_assign({}, u), { uid: generate$3('item') });
    },
    overrides: function overrides(detail, u) {
      return {
        type: u.type,
        ignoreFocus: detail.fakeFocus,
        domModification: { classes: [detail.markers.item] }
      };
    }
  })]);
  var schema$d = constant([strict$1('value'), strict$1('items'), strict$1('dom'), strict$1('components'), defaulted$1('eventOrder', {}), field$1('menuBehaviours', [Highlighting, Representing, Composing, Keying]), defaultedOf('movement', {
    mode: 'menu',
    moveOnTab: true
  }, choose$1('mode', {
    grid: [initSize(), output('config', configureGrid)],
    matrix: [output('config', configureMatrix), strict$1('rowSelector')],
    menu: [defaulted$1('moveOnTab', true), output('config', configureMenu)]
  })), itemMarkers(), defaulted$1('fakeFocus', false), defaulted$1('focusManager', dom()), onHandler('onHighlight')]);

  var focus$4 = constant('alloy.menu-focus');

  var make$2 = function make$2(detail, components, spec, externals) {
    return {
      uid: detail.uid,
      dom: detail.dom,
      markers: detail.markers,
      behaviours: augment(detail.menuBehaviours, [Highlighting.config({
        highlightClass: detail.markers.selectedItem,
        itemClass: detail.markers.item,
        onHighlight: detail.onHighlight
      }), Representing.config({
        store: {
          mode: 'memory',
          initialValue: detail.value
        }
      }), Composing.config({ find: Option.some }), Keying.config(detail.movement.config(detail, detail.movement))]),
      events: derive([run(focus$3(), function (menu, simulatedEvent) {
        var event = simulatedEvent.event();
        menu.getSystem().getByDom(event.target()).each(function (item) {
          Highlighting.highlight(menu, item);
          simulatedEvent.stop();
          emitWith(menu, focus$4(), {
            menu: menu,
            item: item
          });
        });
      }), run(hover(), function (menu, simulatedEvent) {
        var item = simulatedEvent.event().item();
        Highlighting.highlight(menu, item);
      })]),
      components: components,
      eventOrder: detail.eventOrder,
      domModification: { attributes: { role: 'menu' } }
    };
  };

  var Menu = composite$1({
    name: 'Menu',
    configFields: schema$d(),
    partFields: parts$1(),
    factory: make$2
  });

  var preserve$1 = function preserve$1(f, container) {
    var ownerDoc = owner(container);
    var refocus = active(ownerDoc).bind(function (focused) {
      var hasFocus = function hasFocus(elem) {
        return eq(focused, elem);
      };
      return hasFocus(container) ? Option.some(container) : descendant(container, hasFocus);
    });
    var result = f(container);
    refocus.each(function (oldFocus) {
      active(ownerDoc).filter(function (newFocus) {
        return eq(newFocus, oldFocus);
      }).fold(function () {
        focus$1(oldFocus);
      }, noop);
    });
    return result;
  };

  var set$8 = function set$8(component, replaceConfig, replaceState, data) {
    preserve$1(function () {
      var newChildren = map$1(data, component.getSystem().build);
      replaceChildren(component, newChildren);
    }, component.element());
  };
  var insert = function insert(component, replaceConfig, insertion, childSpec) {
    var child = component.getSystem().build(childSpec);
    attachWith(component, child, insertion);
  };
  var append$2 = function append$2(component, replaceConfig, replaceState, appendee) {
    insert(component, replaceConfig, append, appendee);
  };
  var prepend$1 = function prepend$1(component, replaceConfig, replaceState, prependee) {
    insert(component, replaceConfig, prepend, prependee);
  };
  var remove$7 = function remove$7(component, replaceConfig, replaceState, removee) {
    var children = contents(component);
    var foundChild = find$2(children, function (child) {
      return eq(removee.element(), child.element());
    });
    foundChild.each(detach);
  };
  var contents = function contents(component, replaceConfig) {
    return component.components();
  };
  var replaceAt = function replaceAt(component, replaceConfig, replaceState, replaceeIndex, replacer) {
    var children = contents(component);
    return Option.from(children[replaceeIndex]).map(function (replacee) {
      remove$7(component, replaceConfig, replaceState, replacee);
      replacer.each(function (r) {
        insert(component, replaceConfig, function (p, c) {
          appendAt(p, c, replaceeIndex);
        }, r);
      });
      return replacee;
    });
  };
  var replaceBy = function replaceBy(component, replaceConfig, replaceState, replaceePred, replacer) {
    var children = contents(component);
    return findIndex(children, replaceePred).bind(function (replaceeIndex) {
      return replaceAt(component, replaceConfig, replaceState, replaceeIndex, replacer);
    });
  };

  var ReplaceApis = /*#__PURE__*/Object.freeze({
    append: append$2,
    prepend: prepend$1,
    remove: remove$7,
    replaceAt: replaceAt,
    replaceBy: replaceBy,
    set: set$8,
    contents: contents
  });

  var Replacing = create$1({
    fields: [],
    name: 'replacing',
    apis: ReplaceApis
  });

  var transpose = function transpose(obj) {
    return tupleMap(obj, function (v, k) {
      return {
        k: v,
        v: k
      };
    });
  };
  var trace = function trace(items, byItem, byMenu, finish) {
    return readOptFrom$1(byMenu, finish).bind(function (triggerItem) {
      return readOptFrom$1(items, triggerItem).bind(function (triggerMenu) {
        var rest = trace(items, byItem, byMenu, triggerMenu);
        return Option.some([triggerMenu].concat(rest));
      });
    }).getOr([]);
  };
  var generate$5 = function generate$5(menus, expansions) {
    var items = {};
    each(menus, function (menuItems, menu) {
      each$1(menuItems, function (item) {
        items[item] = menu;
      });
    });
    var byItem = expansions;
    var byMenu = transpose(expansions);
    var menuPaths = map(byMenu, function (_triggerItem, submenu) {
      return [submenu].concat(trace(items, byItem, byMenu, submenu));
    });
    return map(items, function (menu) {
      return readOptFrom$1(menuPaths, menu).getOr([menu]);
    });
  };

  var init$3 = function init$3() {
    var expansions = Cell({});
    var menus = Cell({});
    var paths = Cell({});
    var primary = Cell(Option.none());
    var directory = Cell({});
    var clear = function clear() {
      expansions.set({});
      menus.set({});
      paths.set({});
      primary.set(Option.none());
    };
    var isClear = function isClear() {
      return primary.get().isNone();
    };
    var setMenuBuilt = function setMenuBuilt(menuName, built) {
      var _a;
      menus.set(_assign(_assign({}, menus.get()), (_a = {}, _a[menuName] = {
        type: 'prepared',
        menu: built
      }, _a)));
    };
    var setContents = function setContents(sPrimary, sMenus, sExpansions, dir) {
      primary.set(Option.some(sPrimary));
      expansions.set(sExpansions);
      menus.set(sMenus);
      directory.set(dir);
      var sPaths = generate$5(dir, sExpansions);
      paths.set(sPaths);
    };
    var getTriggeringItem = function getTriggeringItem(menuValue) {
      return find(expansions.get(), function (v, k) {
        return v === menuValue;
      });
    };
    var getTriggerData = function getTriggerData(menuValue, getItemByValue, path) {
      return getPreparedMenu(menuValue).bind(function (menu) {
        return getTriggeringItem(menuValue).bind(function (triggeringItemValue) {
          return getItemByValue(triggeringItemValue).map(function (triggeredItem) {
            return {
              triggeredMenu: menu,
              triggeringItem: triggeredItem,
              triggeringPath: path
            };
          });
        });
      });
    };
    var getTriggeringPath = function getTriggeringPath(itemValue, getItemByValue) {
      var extraPath = filter(lookupItem(itemValue).toArray(), function (menuValue) {
        return getPreparedMenu(menuValue).isSome();
      });
      return readOptFrom$1(paths.get(), itemValue).bind(function (path) {
        var revPath = reverse(extraPath.concat(path));
        var triggers = bind(revPath, function (menuValue, menuIndex) {
          return getTriggerData(menuValue, getItemByValue, revPath.slice(0, menuIndex + 1)).fold(function () {
            return primary.get().is(menuValue) ? [] : [Option.none()];
          }, function (data) {
            return [Option.some(data)];
          });
        });
        return sequence(triggers);
      });
    };
    var expand = function expand(itemValue) {
      return readOptFrom$1(expansions.get(), itemValue).map(function (menu) {
        var current = readOptFrom$1(paths.get(), itemValue).getOr([]);
        return [menu].concat(current);
      });
    };
    var collapse = function collapse(itemValue) {
      return readOptFrom$1(paths.get(), itemValue).bind(function (path) {
        return path.length > 1 ? Option.some(path.slice(1)) : Option.none();
      });
    };
    var refresh = function refresh(itemValue) {
      return readOptFrom$1(paths.get(), itemValue);
    };
    var getPreparedMenu = function getPreparedMenu(menuValue) {
      return lookupMenu(menuValue).bind(extractPreparedMenu);
    };
    var lookupMenu = function lookupMenu(menuValue) {
      return readOptFrom$1(menus.get(), menuValue);
    };
    var lookupItem = function lookupItem(itemValue) {
      return readOptFrom$1(expansions.get(), itemValue);
    };
    var otherMenus = function otherMenus(path) {
      var menuValues = directory.get();
      return difference(keys(menuValues), path);
    };
    var getPrimary = function getPrimary() {
      return primary.get().bind(getPreparedMenu);
    };
    var getMenus = function getMenus() {
      return menus.get();
    };
    return {
      setMenuBuilt: setMenuBuilt,
      setContents: setContents,
      expand: expand,
      refresh: refresh,
      collapse: collapse,
      lookupMenu: lookupMenu,
      lookupItem: lookupItem,
      otherMenus: otherMenus,
      getPrimary: getPrimary,
      getMenus: getMenus,
      clear: clear,
      isClear: isClear,
      getTriggeringPath: getTriggeringPath
    };
  };
  var extractPreparedMenu = function extractPreparedMenu(prep) {
    return prep.type === 'prepared' ? Option.some(prep.menu) : Option.none();
  };
  var LayeredState = {
    init: init$3,
    extractPreparedMenu: extractPreparedMenu
  };

  var make$3 = function make$3(detail, rawUiSpec) {
    var submenuParentItems = Cell(Option.none());
    var buildMenus = function buildMenus(container, primaryName, menus) {
      return map(menus, function (spec, name) {
        var makeSketch = function makeSketch() {
          return Menu.sketch(_assign(_assign({ dom: spec.dom }, spec), {
            value: name,
            items: spec.items,
            markers: detail.markers,
            fakeFocus: detail.fakeFocus,
            onHighlight: detail.onHighlight,
            focusManager: detail.fakeFocus ? highlights() : dom()
          }));
        };
        return name === primaryName ? {
          type: 'prepared',
          menu: container.getSystem().build(makeSketch())
        } : {
          type: 'notbuilt',
          nbMenu: makeSketch
        };
      });
    };
    var layeredState = LayeredState.init();
    var setup = function setup(container) {
      var componentMap = buildMenus(container, detail.data.primary, detail.data.menus);
      var directory = toDirectory();
      layeredState.setContents(detail.data.primary, componentMap, detail.data.expansions, directory);
      return layeredState.getPrimary();
    };
    var getItemValue = function getItemValue(item) {
      return Representing.getValue(item).value;
    };
    var getItemByValue = function getItemByValue(container, menus, itemValue) {
      return findMap(menus, function (menu) {
        if (!menu.getSystem().isConnected()) {
          return Option.none();
        }
        var candidates = Highlighting.getCandidates(menu);
        return find$2(candidates, function (c) {
          return getItemValue(c) === itemValue;
        });
      });
    };
    var toDirectory = function toDirectory(container) {
      return map(detail.data.menus, function (data, menuName) {
        return bind(data.items, function (item) {
          return item.type === 'separator' ? [] : [item.data.value];
        });
      });
    };
    var setActiveMenu = function setActiveMenu(container, menu) {
      Highlighting.highlight(container, menu);
      Highlighting.getHighlighted(menu).orThunk(function () {
        return Highlighting.getFirst(menu);
      }).each(function (item) {
        dispatch(container, item.element(), focusItem());
      });
    };
    var getMenus = function getMenus(state, menuValues) {
      return cat(map$1(menuValues, function (mv) {
        return state.lookupMenu(mv).bind(function (prep) {
          return prep.type === 'prepared' ? Option.some(prep.menu) : Option.none();
        });
      }));
    };
    var closeOthers = function closeOthers(container, state, path) {
      var others = getMenus(state, state.otherMenus(path));
      each$1(others, function (o) {
        remove$6(o.element(), [detail.markers.backgroundMenu]);
        if (!detail.stayInDom) {
          Replacing.remove(container, o);
        }
      });
    };
    var getSubmenuParents = function getSubmenuParents(container) {
      return submenuParentItems.get().getOrThunk(function () {
        var r = {};
        var items = descendants(container.element(), '.' + detail.markers.item);
        var parentItems = filter(items, function (i) {
          return get(i, 'aria-haspopup') === 'true';
        });
        each$1(parentItems, function (i) {
          container.getSystem().getByDom(i).each(function (itemComp) {
            var key = getItemValue(itemComp);
            r[key] = itemComp;
          });
        });
        submenuParentItems.set(Option.some(r));
        return r;
      });
    };
    var updateAriaExpansions = function updateAriaExpansions(container, path) {
      var parentItems = getSubmenuParents(container);
      each(parentItems, function (v, k) {
        var expanded = contains(path, k);
        set(v.element(), 'aria-expanded', expanded);
      });
    };
    var updateMenuPath = function updateMenuPath(container, state, path) {
      return Option.from(path[0]).bind(function (latestMenuName) {
        return state.lookupMenu(latestMenuName).bind(function (menuPrep) {
          if (menuPrep.type === 'notbuilt') {
            return Option.none();
          } else {
            var activeMenu = menuPrep.menu;
            var rest = getMenus(state, path.slice(1));
            each$1(rest, function (r) {
              add$2(r.element(), detail.markers.backgroundMenu);
            });
            if (!inBody(activeMenu.element())) {
              Replacing.append(container, premade$1(activeMenu));
            }
            remove$6(activeMenu.element(), [detail.markers.backgroundMenu]);
            setActiveMenu(container, activeMenu);
            closeOthers(container, state, path);
            return Option.some(activeMenu);
          }
        });
      });
    };
    var ExpandHighlightDecision;
    (function (ExpandHighlightDecision) {
      ExpandHighlightDecision[ExpandHighlightDecision['HighlightSubmenu'] = 0] = 'HighlightSubmenu';
      ExpandHighlightDecision[ExpandHighlightDecision['HighlightParent'] = 1] = 'HighlightParent';
    })(ExpandHighlightDecision || (ExpandHighlightDecision = {}));
    var buildIfRequired = function buildIfRequired(container, menuName, menuPrep) {
      if (menuPrep.type === 'notbuilt') {
        var menu = container.getSystem().build(menuPrep.nbMenu());
        layeredState.setMenuBuilt(menuName, menu);
        return menu;
      } else {
        return menuPrep.menu;
      }
    };
    var expandRight = function expandRight(container, item, decision) {
      if (decision === void 0) {
        decision = ExpandHighlightDecision.HighlightSubmenu;
      }
      var value = getItemValue(item);
      return layeredState.expand(value).bind(function (path) {
        updateAriaExpansions(container, path);
        return Option.from(path[0]).bind(function (menuName) {
          return layeredState.lookupMenu(menuName).bind(function (activeMenuPrep) {
            var activeMenu = buildIfRequired(container, menuName, activeMenuPrep);
            if (!inBody(activeMenu.element())) {
              Replacing.append(container, premade$1(activeMenu));
            }
            detail.onOpenSubmenu(container, item, activeMenu, reverse(path));
            if (decision === ExpandHighlightDecision.HighlightSubmenu) {
              Highlighting.highlightFirst(activeMenu);
              return updateMenuPath(container, layeredState, path);
            } else {
              Highlighting.dehighlightAll(activeMenu);
              return Option.some(item);
            }
          });
        });
      });
    };
    var collapseLeft = function collapseLeft(container, item) {
      var value = getItemValue(item);
      return layeredState.collapse(value).bind(function (path) {
        updateAriaExpansions(container, path);
        return updateMenuPath(container, layeredState, path).map(function (activeMenu) {
          detail.onCollapseMenu(container, item, activeMenu);
          return activeMenu;
        });
      });
    };
    var updateView = function updateView(container, item) {
      var value = getItemValue(item);
      return layeredState.refresh(value).bind(function (path) {
        updateAriaExpansions(container, path);
        return updateMenuPath(container, layeredState, path);
      });
    };
    var onRight = function onRight(container, item) {
      return inside(item.element()) ? Option.none() : expandRight(container, item, ExpandHighlightDecision.HighlightSubmenu);
    };
    var onLeft = function onLeft(container, item) {
      return inside(item.element()) ? Option.none() : collapseLeft(container, item);
    };
    var onEscape = function onEscape(container, item) {
      return collapseLeft(container, item).orThunk(function () {
        return detail.onEscape(container, item).map(function () {
          return container;
        });
      });
    };
    var keyOnItem = function keyOnItem(f) {
      return function (container, simulatedEvent) {
        return closest$2(simulatedEvent.getSource(), '.' + detail.markers.item).bind(function (target) {
          return container.getSystem().getByDom(target).toOption().bind(function (item) {
            return f(container, item).map(function () {
              return true;
            });
          });
        });
      };
    };
    var events = derive([run(focus$4(), function (sandbox, simulatedEvent) {
      var item = simulatedEvent.event().item();
      layeredState.lookupItem(getItemValue(item)).each(function () {
        var menu = simulatedEvent.event().menu();
        Highlighting.highlight(sandbox, menu);
        var value = getItemValue(simulatedEvent.event().item());
        layeredState.refresh(value).each(function (path) {
          return closeOthers(sandbox, layeredState, path);
        });
      });
    }), runOnExecute(function (component, simulatedEvent) {
      var target = simulatedEvent.event().target();
      component.getSystem().getByDom(target).each(function (item) {
        var itemValue = getItemValue(item);
        if (itemValue.indexOf('collapse-item') === 0) {
          collapseLeft(component, item);
        }
        expandRight(component, item, ExpandHighlightDecision.HighlightSubmenu).fold(function () {
          detail.onExecute(component, item);
        }, function () {});
      });
    }), runOnAttached(function (container, simulatedEvent) {
      setup(container).each(function (primary) {
        Replacing.append(container, premade$1(primary));
        detail.onOpenMenu(container, primary);
        if (detail.highlightImmediately) {
          setActiveMenu(container, primary);
        }
      });
    })].concat(detail.navigateOnHover ? [run(hover(), function (sandbox, simulatedEvent) {
      var item = simulatedEvent.event().item();
      updateView(sandbox, item);
      expandRight(sandbox, item, ExpandHighlightDecision.HighlightParent);
      detail.onHover(sandbox, item);
    })] : []));
    var getActiveItem = function getActiveItem(container) {
      return Highlighting.getHighlighted(container).bind(Highlighting.getHighlighted);
    };
    var collapseMenuApi = function collapseMenuApi(container) {
      getActiveItem(container).each(function (currentItem) {
        collapseLeft(container, currentItem);
      });
    };
    var highlightPrimary = function highlightPrimary(container) {
      layeredState.getPrimary().each(function (primary) {
        setActiveMenu(container, primary);
      });
    };
    var extractMenuFromContainer = function extractMenuFromContainer(container) {
      return Option.from(container.components()[0]).filter(function (comp) {
        return get(comp.element(), 'role') === 'menu';
      });
    };
    var repositionMenus = function repositionMenus(container) {
      var maybeActivePrimary = layeredState.getPrimary().bind(function (primary) {
        return getActiveItem(container).bind(function (currentItem) {
          var itemValue = getItemValue(currentItem);
          var allMenus = values(layeredState.getMenus());
          var preparedMenus = cat(map$1(allMenus, LayeredState.extractPreparedMenu));
          return layeredState.getTriggeringPath(itemValue, function (v) {
            return getItemByValue(container, preparedMenus, v);
          });
        }).map(function (triggeringPath) {
          return {
            primary: primary,
            triggeringPath: triggeringPath
          };
        });
      });
      maybeActivePrimary.fold(function () {
        extractMenuFromContainer(container).each(function (primaryMenu) {
          detail.onRepositionMenu(container, primaryMenu, []);
        });
      }, function (_a) {
        var primary = _a.primary,
            triggeringPath = _a.triggeringPath;
        detail.onRepositionMenu(container, primary, triggeringPath);
      });
    };
    var apis = {
      collapseMenu: collapseMenuApi,
      highlightPrimary: highlightPrimary,
      repositionMenus: repositionMenus
    };
    return {
      uid: detail.uid,
      dom: detail.dom,
      markers: detail.markers,
      behaviours: augment(detail.tmenuBehaviours, [Keying.config({
        mode: 'special',
        onRight: keyOnItem(onRight),
        onLeft: keyOnItem(onLeft),
        onEscape: keyOnItem(onEscape),
        focusIn: function focusIn(container, keyInfo) {
          layeredState.getPrimary().each(function (primary) {
            dispatch(container, primary.element(), focusItem());
          });
        }
      }), Highlighting.config({
        highlightClass: detail.markers.selectedMenu,
        itemClass: detail.markers.menu
      }), Composing.config({
        find: function find(container) {
          return Highlighting.getHighlighted(container);
        }
      }), Replacing.config({})]),
      eventOrder: detail.eventOrder,
      apis: apis,
      events: events
    };
  };
  var collapseItem = constant('collapse-item');

  var tieredData = function tieredData(primary, menus, expansions) {
    return {
      primary: primary,
      menus: menus,
      expansions: expansions
    };
  };
  var singleData = function singleData(name, menu) {
    return {
      primary: name,
      menus: wrap$1(name, menu),
      expansions: {}
    };
  };
  var collapseItem$1 = function collapseItem$1(text) {
    return {
      value: generate$1(collapseItem()),
      meta: { text: text }
    };
  };
  var tieredMenu = single$2({
    name: 'TieredMenu',
    configFields: [onStrictKeyboardHandler('onExecute'), onStrictKeyboardHandler('onEscape'), onStrictHandler('onOpenMenu'), onStrictHandler('onOpenSubmenu'), onStrictHandler('onRepositionMenu'), onHandler('onCollapseMenu'), defaulted$1('highlightImmediately', true), strictObjOf('data', [strict$1('primary'), strict$1('menus'), strict$1('expansions')]), defaulted$1('fakeFocus', false), onHandler('onHighlight'), onHandler('onHover'), tieredMenuMarkers(), strict$1('dom'), defaulted$1('navigateOnHover', true), defaulted$1('stayInDom', false), field$1('tmenuBehaviours', [Keying, Highlighting, Composing, Replacing]), defaulted$1('eventOrder', {})],
    apis: {
      collapseMenu: function collapseMenu(apis, tmenu) {
        apis.collapseMenu(tmenu);
      },
      highlightPrimary: function highlightPrimary(apis, tmenu) {
        apis.highlightPrimary(tmenu);
      },
      repositionMenus: function repositionMenus(apis, tmenu) {
        apis.repositionMenus(tmenu);
      }
    },
    factory: make$3,
    extraApis: {
      tieredData: tieredData,
      singleData: singleData,
      collapseItem: collapseItem$1
    }
  });

  var findRoute = function findRoute(component, transConfig, transState, route) {
    return readOptFrom$1(transConfig.routes, route.start).bind(function (sConfig) {
      return readOptFrom$1(sConfig, route.destination);
    });
  };
  var getTransition = function getTransition(comp, transConfig, transState) {
    var route = getCurrentRoute(comp, transConfig);
    return route.bind(function (r) {
      return getTransitionOf(comp, transConfig, transState, r);
    });
  };
  var getTransitionOf = function getTransitionOf(comp, transConfig, transState, route) {
    return findRoute(comp, transConfig, transState, route).bind(function (r) {
      return r.transition.map(function (t) {
        return {
          transition: t,
          route: r
        };
      });
    });
  };
  var disableTransition = function disableTransition(comp, transConfig, transState) {
    getTransition(comp, transConfig, transState).each(function (routeTransition) {
      var t = routeTransition.transition;
      remove$4(comp.element(), t.transitionClass);
      remove$1(comp.element(), transConfig.destinationAttr);
    });
  };
  var getNewRoute = function getNewRoute(comp, transConfig, transState, destination) {
    return {
      start: get(comp.element(), transConfig.stateAttr),
      destination: destination
    };
  };
  var getCurrentRoute = function getCurrentRoute(comp, transConfig, transState) {
    var el = comp.element();
    return has$1(el, transConfig.destinationAttr) ? Option.some({
      start: get(comp.element(), transConfig.stateAttr),
      destination: get(comp.element(), transConfig.destinationAttr)
    }) : Option.none();
  };
  var jumpTo = function jumpTo(comp, transConfig, transState, destination) {
    disableTransition(comp, transConfig, transState);
    if (has$1(comp.element(), transConfig.stateAttr) && get(comp.element(), transConfig.stateAttr) !== destination) {
      transConfig.onFinish(comp, destination);
    }
    set(comp.element(), transConfig.stateAttr, destination);
  };
  var fasttrack = function fasttrack(comp, transConfig, transState, destination) {
    if (has$1(comp.element(), transConfig.destinationAttr)) {
      set(comp.element(), transConfig.stateAttr, get(comp.element(), transConfig.destinationAttr));
      remove$1(comp.element(), transConfig.destinationAttr);
    }
  };
  var progressTo = function progressTo(comp, transConfig, transState, destination) {
    fasttrack(comp, transConfig);
    var route = getNewRoute(comp, transConfig, transState, destination);
    getTransitionOf(comp, transConfig, transState, route).fold(function () {
      jumpTo(comp, transConfig, transState, destination);
    }, function (routeTransition) {
      disableTransition(comp, transConfig, transState);
      var t = routeTransition.transition;
      add$2(comp.element(), t.transitionClass);
      set(comp.element(), transConfig.destinationAttr, destination);
    });
  };
  var getState$1 = function getState$1(comp, transConfig, transState) {
    var e = comp.element();
    return has$1(e, transConfig.stateAttr) ? Option.some(get(e, transConfig.stateAttr)) : Option.none();
  };

  var TransitionApis = /*#__PURE__*/Object.freeze({
    findRoute: findRoute,
    disableTransition: disableTransition,
    getCurrentRoute: getCurrentRoute,
    jumpTo: jumpTo,
    progressTo: progressTo,
    getState: getState$1
  });

  var events$9 = function events$9(transConfig, transState) {
    return derive([run(transitionend(), function (component, simulatedEvent) {
      var raw = simulatedEvent.event().raw();
      getCurrentRoute(component, transConfig).each(function (route) {
        findRoute(component, transConfig, transState, route).each(function (rInfo) {
          rInfo.transition.each(function (rTransition) {
            if (raw.propertyName === rTransition.property) {
              jumpTo(component, transConfig, transState, route.destination);
              transConfig.onTransition(component, route);
            }
          });
        });
      });
    }), runOnAttached(function (comp, se) {
      jumpTo(comp, transConfig, transState, transConfig.initialState);
    })]);
  };

  var ActiveTransitioning = /*#__PURE__*/Object.freeze({
    events: events$9
  });

  var TransitionSchema = [defaulted$1('destinationAttr', 'data-transitioning-destination'), defaulted$1('stateAttr', 'data-transitioning-state'), strict$1('initialState'), onHandler('onTransition'), onHandler('onFinish'), strictOf('routes', setOf$1(Result.value, setOf$1(Result.value, objOfOnly([optionObjOfOnly('transition', [strict$1('property'), strict$1('transitionClass')])]))))];

  var createRoutes = function createRoutes(routes) {
    var r = {};
    each(routes, function (v, k) {
      var waypoints = k.split('<->');
      r[waypoints[0]] = wrap$1(waypoints[1], v);
      r[waypoints[1]] = wrap$1(waypoints[0], v);
    });
    return r;
  };
  var createBistate = function createBistate(first, second, transitions) {
    return wrapAll$1([{
      key: first,
      value: wrap$1(second, transitions)
    }, {
      key: second,
      value: wrap$1(first, transitions)
    }]);
  };
  var createTristate = function createTristate(first, second, third, transitions) {
    return wrapAll$1([{
      key: first,
      value: wrapAll$1([{
        key: second,
        value: transitions
      }, {
        key: third,
        value: transitions
      }])
    }, {
      key: second,
      value: wrapAll$1([{
        key: first,
        value: transitions
      }, {
        key: third,
        value: transitions
      }])
    }, {
      key: third,
      value: wrapAll$1([{
        key: first,
        value: transitions
      }, {
        key: second,
        value: transitions
      }])
    }]);
  };
  var Transitioning = create$1({
    fields: TransitionSchema,
    name: 'transitioning',
    active: ActiveTransitioning,
    apis: TransitionApis,
    extra: {
      createRoutes: createRoutes,
      createBistate: createBistate,
      createTristate: createTristate
    }
  });

  var scrollable = Styles.resolve('scrollable');
  var register = function register(element) {
    add$2(element, scrollable);
  };
  var deregister = function deregister(element) {
    remove$4(element, scrollable);
  };
  var Scrollable = {
    register: register,
    deregister: deregister,
    scrollable: constant(scrollable)
  };

  var getValue$4 = function getValue$4(item) {
    return readOptFrom$1(item, 'format').getOr(item.title);
  };
  var convert$1 = function convert$1(formats, memMenuThunk) {
    var mainMenu = makeMenu('Styles', [].concat(map$1(formats.items, function (k) {
      return makeItem(getValue$4(k), k.title, k.isSelected(), k.getPreview(), hasKey$1(formats.expansions, getValue$4(k)));
    })), memMenuThunk, false);
    var submenus = map(formats.menus, function (menuItems, menuName) {
      var items = map$1(menuItems, function (item) {
        return makeItem(getValue$4(item), item.title, item.isSelected !== undefined ? item.isSelected() : false, item.getPreview !== undefined ? item.getPreview() : '', hasKey$1(formats.expansions, getValue$4(item)));
      });
      return makeMenu(menuName, items, memMenuThunk, true);
    });
    var menus = deepMerge(submenus, wrap$1('styles', mainMenu));
    var tmenu = tieredMenu.tieredData('styles', menus, formats.expansions);
    return { tmenu: tmenu };
  };
  var makeItem = function makeItem(value, text, selected, preview, isMenu) {
    return {
      data: {
        value: value,
        text: text
      },
      type: 'item',
      dom: {
        tag: 'div',
        classes: isMenu ? [Styles.resolve('styles-item-is-menu')] : []
      },
      toggling: {
        toggleOnExecute: false,
        toggleClass: Styles.resolve('format-matches'),
        selected: selected
      },
      itemBehaviours: derive$1(isMenu ? [] : [Receivers.format(value, function (comp, status) {
        var toggle = status ? Toggling.on : Toggling.off;
        toggle(comp);
      })]),
      components: [{
        dom: {
          tag: 'div',
          attributes: { style: preview },
          innerHtml: text
        }
      }]
    };
  };
  var makeMenu = function makeMenu(value, items, memMenuThunk, collapsable) {
    return {
      value: value,
      dom: { tag: 'div' },
      components: [Button.sketch({
        dom: {
          tag: 'div',
          classes: [Styles.resolve('styles-collapser')]
        },
        components: collapsable ? [{
          dom: {
            tag: 'span',
            classes: [Styles.resolve('styles-collapse-icon')]
          }
        }, text(value)] : [text(value)],
        action: function action(item) {
          if (collapsable) {
            var comp = memMenuThunk().get(item);
            tieredMenu.collapseMenu(comp);
          }
        }
      }), {
        dom: {
          tag: 'div',
          classes: [Styles.resolve('styles-menu-items-container')]
        },
        components: [Menu.parts().items({})],
        behaviours: derive$1([config('adhoc-scrollable-menu', [runOnAttached(function (component, simulatedEvent) {
          set$3(component.element(), 'overflow-y', 'auto');
          set$3(component.element(), '-webkit-overflow-scrolling', 'touch');
          Scrollable.register(component.element());
        }), runOnDetached(function (component) {
          remove$5(component.element(), 'overflow-y');
          remove$5(component.element(), '-webkit-overflow-scrolling');
          Scrollable.deregister(component.element());
        })])])
      }],
      items: items,
      menuBehaviours: derive$1([Transitioning.config({
        initialState: 'after',
        routes: Transitioning.createTristate('before', 'current', 'after', {
          transition: {
            property: 'transform',
            transitionClass: 'transitioning'
          }
        })
      })])
    };
  };
  var sketch$8 = function sketch$8(settings) {
    var dataset = convert$1(settings.formats, function () {
      return memMenu;
    });
    var memMenu = record(tieredMenu.sketch({
      dom: {
        tag: 'div',
        classes: [Styles.resolve('styles-menu')]
      },
      components: [],
      fakeFocus: true,
      stayInDom: true,
      onExecute: function onExecute(tmenu, item) {
        var v = Representing.getValue(item);
        settings.handle(item, v.value);
        return Option.none();
      },
      onEscape: function onEscape() {
        return Option.none();
      },
      onOpenMenu: function onOpenMenu(container, menu) {
        var w = get$6(container.element());
        set$4(menu.element(), w);
        Transitioning.jumpTo(menu, 'current');
      },
      onOpenSubmenu: function onOpenSubmenu(container, item, submenu) {
        var w = get$6(container.element());
        var menu = ancestor$1(item.element(), '[role="menu"]').getOrDie('hacky');
        var menuComp = container.getSystem().getByDom(menu).getOrDie();
        set$4(submenu.element(), w);
        Transitioning.progressTo(menuComp, 'before');
        Transitioning.jumpTo(submenu, 'after');
        Transitioning.progressTo(submenu, 'current');
      },
      onCollapseMenu: function onCollapseMenu(container, item, menu) {
        var submenu = ancestor$1(item.element(), '[role="menu"]').getOrDie('hacky');
        var submenuComp = container.getSystem().getByDom(submenu).getOrDie();
        Transitioning.progressTo(submenuComp, 'after');
        Transitioning.progressTo(menu, 'current');
      },
      navigateOnHover: false,
      highlightImmediately: true,
      data: dataset.tmenu,
      markers: {
        backgroundMenu: Styles.resolve('styles-background-menu'),
        menu: Styles.resolve('styles-menu'),
        selectedMenu: Styles.resolve('styles-selected-menu'),
        item: Styles.resolve('styles-item'),
        selectedItem: Styles.resolve('styles-selected-item')
      }
    }));
    return memMenu.asSpec();
  };
  var StylesMenu = { sketch: sketch$8 };

  var getFromExpandingItem = function getFromExpandingItem(item) {
    var newItem = deepMerge(exclude$1(item, ['items']), { menu: true });
    var rest = expand(item.items);
    var newMenus = deepMerge(rest.menus, wrap$1(item.title, rest.items));
    var newExpansions = deepMerge(rest.expansions, wrap$1(item.title, item.title));
    return {
      item: newItem,
      menus: newMenus,
      expansions: newExpansions
    };
  };
  var getFromItem = function getFromItem(item) {
    return hasKey$1(item, 'items') ? getFromExpandingItem(item) : {
      item: item,
      menus: {},
      expansions: {}
    };
  };
  var expand = function expand(items) {
    return foldr(items, function (acc, item) {
      var newData = getFromItem(item);
      return {
        menus: deepMerge(acc.menus, newData.menus),
        items: [newData.item].concat(acc.items),
        expansions: deepMerge(acc.expansions, newData.expansions)
      };
    }, {
      menus: {},
      expansions: {},
      items: []
    });
  };
  var StyleConversions = { expand: expand };

  var register$1 = function register$1(editor, settings) {
    var isSelectedFor = function isSelectedFor(format) {
      return function () {
        return editor.formatter.match(format);
      };
    };
    var getPreview = function getPreview(format) {
      return function () {
        var styles = editor.formatter.getCssText(format);
        return styles;
      };
    };
    var enrichSupported = function enrichSupported(item) {
      return deepMerge(item, {
        isSelected: isSelectedFor(item.format),
        getPreview: getPreview(item.format)
      });
    };
    var enrichMenu = function enrichMenu(item) {
      return deepMerge(item, {
        isSelected: constant(false),
        getPreview: constant('')
      });
    };
    var enrichCustom = function enrichCustom(item) {
      var formatName = generate$1(item.title);
      var newItem = deepMerge(item, {
        format: formatName,
        isSelected: isSelectedFor(formatName),
        getPreview: getPreview(formatName)
      });
      editor.formatter.register(formatName, newItem);
      return newItem;
    };
    var formats = readOptFrom$1(settings, 'style_formats').getOr(DefaultStyleFormats);
    var doEnrich = function doEnrich(items) {
      return map$1(items, function (item) {
        if (hasKey$1(item, 'items')) {
          var newItems = doEnrich(item.items);
          return deepMerge(enrichMenu(item), { items: newItems });
        } else if (hasKey$1(item, 'format')) {
          return enrichSupported(item);
        } else {
          return enrichCustom(item);
        }
      });
    };
    return doEnrich(formats);
  };
  var prune = function prune(editor, formats) {
    var doPrune = function doPrune(items) {
      return bind(items, function (item) {
        if (item.items !== undefined) {
          var newItems = doPrune(item.items);
          return newItems.length > 0 ? [item] : [];
        } else {
          var keep = hasKey$1(item, 'format') ? editor.formatter.canApply(item.format) : true;
          return keep ? [item] : [];
        }
      });
    };
    var prunedItems = doPrune(formats);
    return StyleConversions.expand(prunedItems);
  };
  var ui = function ui(editor, formats, onDone) {
    var pruned = prune(editor, formats);
    return StylesMenu.sketch({
      formats: pruned,
      handle: function handle(item, value) {
        editor.undoManager.transact(function () {
          if (Toggling.isOn(item)) {
            editor.formatter.remove(value);
          } else {
            editor.formatter.apply(value);
          }
        });
        onDone();
      }
    });
  };
  var StyleFormats = {
    register: register$1,
    ui: ui
  };

  var defaults = ['undo', 'bold', 'italic', 'link', 'image', 'bullist', 'styleselect'];
  var extract$1 = function extract$1(rawToolbar) {
    var toolbar = rawToolbar.replace(/\|/g, ' ').trim();
    return toolbar.length > 0 ? toolbar.split(/\s+/) : [];
  };
  var identifyFromArray = function identifyFromArray(toolbar) {
    return bind(toolbar, function (item) {
      return isArray(item) ? identifyFromArray(item) : extract$1(item);
    });
  };
  var identify = function identify(settings) {
    var toolbar = settings.toolbar !== undefined ? settings.toolbar : defaults;
    return isArray(toolbar) ? identifyFromArray(toolbar) : extract$1(toolbar);
  };
  var setup = function setup(realm, editor) {
    var commandSketch = function commandSketch(name) {
      return function () {
        return Buttons.forToolbarCommand(editor, name);
      };
    };
    var stateCommandSketch = function stateCommandSketch(name) {
      return function () {
        return Buttons.forToolbarStateCommand(editor, name);
      };
    };
    var actionSketch = function actionSketch(name, query, action) {
      return function () {
        return Buttons.forToolbarStateAction(editor, name, query, action);
      };
    };
    var undo = commandSketch('undo');
    var redo = commandSketch('redo');
    var bold = stateCommandSketch('bold');
    var italic = stateCommandSketch('italic');
    var underline = stateCommandSketch('underline');
    var removeformat = commandSketch('removeformat');
    var link = function link() {
      return sketch$7(realm, editor);
    };
    var unlink = actionSketch('unlink', 'link', function () {
      editor.execCommand('unlink', null, false);
    });
    var image = function image() {
      return sketch$4(editor);
    };
    var bullist = actionSketch('unordered-list', 'ul', function () {
      editor.execCommand('InsertUnorderedList', null, false);
    });
    var numlist = actionSketch('ordered-list', 'ol', function () {
      editor.execCommand('InsertOrderedList', null, false);
    });
    var fontsizeselect = function fontsizeselect() {
      return sketch$3(realm, editor);
    };
    var forecolor = function forecolor() {
      return ColorSlider.sketch(realm, editor);
    };
    var styleFormats = StyleFormats.register(editor, editor.settings);
    var styleFormatsMenu = function styleFormatsMenu() {
      return StyleFormats.ui(editor, styleFormats, function () {
        editor.fire('scrollIntoView');
      });
    };
    var styleselect = function styleselect() {
      return Buttons.forToolbar('style-formats', function (button) {
        editor.fire('toReading');
        realm.dropup().appear(styleFormatsMenu, Toggling.on, button);
      }, derive$1([Toggling.config({
        toggleClass: Styles.resolve('toolbar-button-selected'),
        toggleOnExecute: false,
        aria: { mode: 'pressed' }
      }), Receiving.config({
        channels: wrapAll$1([Receivers.receive(TinyChannels.orientationChanged(), Toggling.off), Receivers.receive(TinyChannels.dropupDismissed(), Toggling.off)])
      })]), editor);
    };
    var feature = function feature(prereq, sketch) {
      return {
        isSupported: function isSupported() {
          var buttons = editor.ui.registry.getAll().buttons;
          return prereq.forall(function (p) {
            return hasKey$1(buttons, p);
          });
        },
        sketch: sketch
      };
    };
    return {
      undo: feature(Option.none(), undo),
      redo: feature(Option.none(), redo),
      bold: feature(Option.none(), bold),
      italic: feature(Option.none(), italic),
      underline: feature(Option.none(), underline),
      removeformat: feature(Option.none(), removeformat),
      link: feature(Option.none(), link),
      unlink: feature(Option.none(), unlink),
      image: feature(Option.none(), image),
      bullist: feature(Option.some('bullist'), bullist),
      numlist: feature(Option.some('numlist'), numlist),
      fontsizeselect: feature(Option.none(), fontsizeselect),
      forecolor: feature(Option.none(), forecolor),
      styleselect: feature(Option.none(), styleselect)
    };
  };
  var detect$4 = function detect$4(settings, features) {
    var itemNames = identify(settings);
    var present = {};
    return bind(itemNames, function (iName) {
      var r = !hasKey$1(present, iName) && hasKey$1(features, iName) && features[iName].isSupported() ? [features[iName].sketch()] : [];
      present[iName] = true;
      return r;
    });
  };
  var Features = {
    identify: identify,
    setup: setup,
    detect: detect$4
  };

  var mkEvent = function mkEvent(target, x, y, stop, prevent, kill, raw) {
    return {
      target: constant(target),
      x: constant(x),
      y: constant(y),
      stop: stop,
      prevent: prevent,
      kill: kill,
      raw: constant(raw)
    };
  };
  var fromRawEvent = function fromRawEvent(rawEvent) {
    var target = Element.fromDom(rawEvent.target);
    var stop = function stop() {
      rawEvent.stopPropagation();
    };
    var prevent = function prevent() {
      rawEvent.preventDefault();
    };
    var kill = compose(prevent, stop);
    return mkEvent(target, rawEvent.clientX, rawEvent.clientY, stop, prevent, kill, rawEvent);
  };
  var handle = function handle(filter, handler) {
    return function (rawEvent) {
      if (!filter(rawEvent)) {
        return;
      }
      handler(fromRawEvent(rawEvent));
    };
  };
  var binder = function binder(element, event, filter, handler, useCapture) {
    var wrapped = handle(filter, handler);
    element.dom().addEventListener(event, wrapped, useCapture);
    return { unbind: curry(unbind, element, event, wrapped, useCapture) };
  };
  var bind$2 = function bind$2(element, event, filter, handler) {
    return binder(element, event, filter, handler, false);
  };
  var capture = function capture(element, event, filter, handler) {
    return binder(element, event, filter, handler, true);
  };
  var unbind = function unbind(element, event, handler, useCapture) {
    element.dom().removeEventListener(event, handler, useCapture);
  };

  var filter$1 = constant(true);
  var bind$3 = function bind$3(element, event, handler) {
    return bind$2(element, event, filter$1, handler);
  };
  var capture$1 = function capture$1(element, event, handler) {
    return capture(element, event, filter$1, handler);
  };

  var global$4 = tinymce.util.Tools.resolve('tinymce.util.Delay');

  var INTERVAL = 50;
  var INSURANCE = 1000 / INTERVAL;
  var get$a = function get$a(outerWindow) {
    var isPortrait = outerWindow.matchMedia('(orientation: portrait)').matches;
    return { isPortrait: constant(isPortrait) };
  };
  var getActualWidth = function getActualWidth(outerWindow) {
    var isIos = detect$3().os.isiOS();
    var isPortrait = get$a(outerWindow).isPortrait();
    return isIos && !isPortrait ? outerWindow.screen.height : outerWindow.screen.width;
  };
  var onChange = function onChange(outerWindow, listeners) {
    var win = Element.fromDom(outerWindow);
    var poller = null;
    var change = function change() {
      global$4.clearInterval(poller);
      var orientation = get$a(outerWindow);
      listeners.onChange(orientation);
      onAdjustment(function () {
        listeners.onReady(orientation);
      });
    };
    var orientationHandle = bind$3(win, 'orientationchange', change);
    var onAdjustment = function onAdjustment(f) {
      global$4.clearInterval(poller);
      var flag = outerWindow.innerHeight;
      var insurance = 0;
      poller = global$4.setInterval(function () {
        if (flag !== outerWindow.innerHeight) {
          global$4.clearInterval(poller);
          f(Option.some(outerWindow.innerHeight));
        } else if (insurance > INSURANCE) {
          global$4.clearInterval(poller);
          f(Option.none());
        }
        insurance++;
      }, INTERVAL);
    };
    var destroy = function destroy() {
      orientationHandle.unbind();
    };
    return {
      onAdjustment: onAdjustment,
      destroy: destroy
    };
  };
  var Orientation = {
    get: get$a,
    onChange: onChange,
    getActualWidth: getActualWidth
  };

  function DelayedFunction(fun, delay) {
    var ref = null;
    var schedule = function schedule() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      ref = domGlobals.setTimeout(function () {
        fun.apply(null, args);
        ref = null;
      }, delay);
    };
    var cancel = function cancel() {
      if (ref !== null) {
        domGlobals.clearTimeout(ref);
        ref = null;
      }
    };
    return {
      cancel: cancel,
      schedule: schedule
    };
  }

  var SIGNIFICANT_MOVE = 5;
  var LONGPRESS_DELAY = 400;
  var getTouch = function getTouch(event) {
    var raw = event.raw();
    if (raw.touches === undefined || raw.touches.length !== 1) {
      return Option.none();
    }
    return Option.some(raw.touches[0]);
  };
  var isFarEnough = function isFarEnough(touch, data) {
    var distX = Math.abs(touch.clientX - data.x());
    var distY = Math.abs(touch.clientY - data.y());
    return distX > SIGNIFICANT_MOVE || distY > SIGNIFICANT_MOVE;
  };
  var monitor = function monitor(settings) {
    var startData = Cell(Option.none());
    var longpressFired = Cell(false);
    var longpress$1 = DelayedFunction(function (event) {
      settings.triggerEvent(longpress(), event);
      longpressFired.set(true);
    }, LONGPRESS_DELAY);
    var handleTouchstart = function handleTouchstart(event) {
      getTouch(event).each(function (touch) {
        longpress$1.cancel();
        var data = {
          x: constant(touch.clientX),
          y: constant(touch.clientY),
          target: event.target
        };
        longpress$1.schedule(event);
        longpressFired.set(false);
        startData.set(Option.some(data));
      });
      return Option.none();
    };
    var handleTouchmove = function handleTouchmove(event) {
      longpress$1.cancel();
      getTouch(event).each(function (touch) {
        startData.get().each(function (data) {
          if (isFarEnough(touch, data)) {
            startData.set(Option.none());
          }
        });
      });
      return Option.none();
    };
    var handleTouchend = function handleTouchend(event) {
      longpress$1.cancel();
      var isSame = function isSame(data) {
        return eq(data.target(), event.target());
      };
      return startData.get().filter(isSame).map(function (data) {
        if (longpressFired.get()) {
          event.prevent();
          return false;
        } else {
          return settings.triggerEvent(tap(), event);
        }
      });
    };
    var handlers = wrapAll$1([{
      key: touchstart(),
      value: handleTouchstart
    }, {
      key: touchmove(),
      value: handleTouchmove
    }, {
      key: touchend(),
      value: handleTouchend
    }]);
    var fireIfReady = function fireIfReady(event, type) {
      return readOptFrom$1(handlers, type).bind(function (handler) {
        return handler(event);
      });
    };
    return { fireIfReady: fireIfReady };
  };

  var monitor$1 = function monitor$1(editorApi) {
    var tapEvent = monitor({
      triggerEvent: function triggerEvent(type, evt) {
        editorApi.onTapContent(evt);
      }
    });
    var onTouchend = function onTouchend() {
      return bind$3(editorApi.body(), 'touchend', function (evt) {
        tapEvent.fireIfReady(evt, 'touchend');
      });
    };
    var onTouchmove = function onTouchmove() {
      return bind$3(editorApi.body(), 'touchmove', function (evt) {
        tapEvent.fireIfReady(evt, 'touchmove');
      });
    };
    var fireTouchstart = function fireTouchstart(evt) {
      tapEvent.fireIfReady(evt, 'touchstart');
    };
    return {
      fireTouchstart: fireTouchstart,
      onTouchend: onTouchend,
      onTouchmove: onTouchmove
    };
  };
  var TappingEvent = { monitor: monitor$1 };

  var isAndroid6 = detect$3().os.version.major >= 6;
  var initEvents = function initEvents(editorApi, toolstrip, alloy) {
    var tapping = TappingEvent.monitor(editorApi);
    var outerDoc = owner(toolstrip);
    var isRanged = function isRanged(sel) {
      return !eq(sel.start(), sel.finish()) || sel.soffset() !== sel.foffset();
    };
    var hasRangeInUi = function hasRangeInUi() {
      return active(outerDoc).filter(function (input) {
        return name(input) === 'input';
      }).exists(function (input) {
        return input.dom().selectionStart !== input.dom().selectionEnd;
      });
    };
    var updateMargin = function updateMargin() {
      var rangeInContent = editorApi.doc().dom().hasFocus() && editorApi.getSelection().exists(isRanged);
      alloy.getByDom(toolstrip).each((rangeInContent || hasRangeInUi()) === true ? Toggling.on : Toggling.off);
    };
    var listeners = [bind$3(editorApi.body(), 'touchstart', function (evt) {
      editorApi.onTouchContent();
      tapping.fireTouchstart(evt);
    }), tapping.onTouchmove(), tapping.onTouchend(), bind$3(toolstrip, 'touchstart', function (evt) {
      editorApi.onTouchToolstrip();
    }), editorApi.onToReading(function () {
      blur(editorApi.body());
    }), editorApi.onToEditing(noop), editorApi.onScrollToCursor(function (tinyEvent) {
      tinyEvent.preventDefault();
      editorApi.getCursorBox().each(function (bounds) {
        var cWin = editorApi.win();
        var isOutside = bounds.top() > cWin.innerHeight || bounds.bottom() > cWin.innerHeight;
        var cScrollBy = isOutside ? bounds.bottom() - cWin.innerHeight + 50 : 0;
        if (cScrollBy !== 0) {
          cWin.scrollTo(cWin.pageXOffset, cWin.pageYOffset + cScrollBy);
        }
      });
    })].concat(isAndroid6 === true ? [] : [bind$3(Element.fromDom(editorApi.win()), 'blur', function () {
      alloy.getByDom(toolstrip).each(Toggling.off);
    }), bind$3(outerDoc, 'select', updateMargin), bind$3(editorApi.doc(), 'selectionchange', updateMargin)]);
    var destroy = function destroy() {
      each$1(listeners, function (l) {
        l.unbind();
      });
    };
    return { destroy: destroy };
  };
  var AndroidEvents = { initEvents: initEvents };

  var safeParse = function safeParse(element, attribute) {
    var parsed = parseInt(get(element, attribute), 10);
    return isNaN(parsed) ? 0 : parsed;
  };
  var DataAttributes = { safeParse: safeParse };

  function NodeValue(is, name) {
    var get = function get(element) {
      if (!is(element)) {
        throw new Error('Can only get ' + name + ' value of a ' + name + ' node');
      }
      return getOption(element).getOr('');
    };
    var getOption = function getOption(element) {
      return is(element) ? Option.from(element.dom().nodeValue) : Option.none();
    };
    var set = function set(element, value) {
      if (!is(element)) {
        throw new Error('Can only set raw ' + name + ' value of a ' + name + ' node');
      }
      element.dom().nodeValue = value;
    };
    return {
      get: get,
      getOption: getOption,
      set: set
    };
  }

  var api$3 = NodeValue(isText, 'text');
  var get$b = function get$b(element) {
    return api$3.get(element);
  };
  var getOption = function getOption(element) {
    return api$3.getOption(element);
  };

  var getEnd = function getEnd(element) {
    return name(element) === 'img' ? 1 : getOption(element).fold(function () {
      return children(element).length;
    }, function (v) {
      return v.length;
    });
  };
  var NBSP = '\xA0';
  var isTextNodeWithCursorPosition = function isTextNodeWithCursorPosition(el) {
    return getOption(el).filter(function (text) {
      return text.trim().length !== 0 || text.indexOf(NBSP) > -1;
    }).isSome();
  };
  var elementsWithCursorPosition = ['img', 'br'];
  var isCursorPosition = function isCursorPosition(elem) {
    var hasCursorPosition = isTextNodeWithCursorPosition(elem);
    return hasCursorPosition || contains(elementsWithCursorPosition, name(elem));
  };

  var create$3 = Immutable('start', 'soffset', 'finish', 'foffset');
  var SimRange = { create: create$3 };

  var adt$4 = Adt.generate([{ before: ['element'] }, {
    on: ['element', 'offset']
  }, { after: ['element'] }]);
  var cata = function cata(subject, onBefore, onOn, onAfter) {
    return subject.fold(onBefore, onOn, onAfter);
  };
  var getStart = function getStart(situ) {
    return situ.fold(identity, identity, identity);
  };
  var before$1 = adt$4.before;
  var on$1 = adt$4.on;
  var after$1 = adt$4.after;
  var Situ = {
    before: before$1,
    on: on$1,
    after: after$1,
    cata: cata,
    getStart: getStart
  };

  var adt$5 = Adt.generate([{ domRange: ['rng'] }, {
    relative: ['startSitu', 'finishSitu']
  }, {
    exact: ['start', 'soffset', 'finish', 'foffset']
  }]);
  var exactFromRange = function exactFromRange(simRange) {
    return adt$5.exact(simRange.start(), simRange.soffset(), simRange.finish(), simRange.foffset());
  };
  var getStart$1 = function getStart$1(selection) {
    return selection.match({
      domRange: function domRange(rng) {
        return Element.fromDom(rng.startContainer);
      },
      relative: function relative(startSitu, finishSitu) {
        return Situ.getStart(startSitu);
      },
      exact: function exact(start, soffset, finish, foffset) {
        return start;
      }
    });
  };
  var domRange = adt$5.domRange;
  var relative = adt$5.relative;
  var exact = adt$5.exact;
  var getWin = function getWin(selection) {
    var start = getStart$1(selection);
    return defaultView(start);
  };
  var range$1 = SimRange.create;
  var Selection = {
    domRange: domRange,
    relative: relative,
    exact: exact,
    exactFromRange: exactFromRange,
    getWin: getWin,
    range: range$1
  };

  var setStart = function setStart(rng, situ) {
    situ.fold(function (e) {
      rng.setStartBefore(e.dom());
    }, function (e, o) {
      rng.setStart(e.dom(), o);
    }, function (e) {
      rng.setStartAfter(e.dom());
    });
  };
  var setFinish = function setFinish(rng, situ) {
    situ.fold(function (e) {
      rng.setEndBefore(e.dom());
    }, function (e, o) {
      rng.setEnd(e.dom(), o);
    }, function (e) {
      rng.setEndAfter(e.dom());
    });
  };
  var relativeToNative = function relativeToNative(win, startSitu, finishSitu) {
    var range = win.document.createRange();
    setStart(range, startSitu);
    setFinish(range, finishSitu);
    return range;
  };
  var exactToNative = function exactToNative(win, start, soffset, finish, foffset) {
    var rng = win.document.createRange();
    rng.setStart(start.dom(), soffset);
    rng.setEnd(finish.dom(), foffset);
    return rng;
  };
  var toRect = function toRect(rect) {
    return {
      left: constant(rect.left),
      top: constant(rect.top),
      right: constant(rect.right),
      bottom: constant(rect.bottom),
      width: constant(rect.width),
      height: constant(rect.height)
    };
  };
  var getFirstRect = function getFirstRect(rng) {
    var rects = rng.getClientRects();
    var rect = rects.length > 0 ? rects[0] : rng.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0 ? Option.some(rect).map(toRect) : Option.none();
  };

  var adt$6 = Adt.generate([{
    ltr: ['start', 'soffset', 'finish', 'foffset']
  }, {
    rtl: ['start', 'soffset', 'finish', 'foffset']
  }]);
  var fromRange = function fromRange(win, type, range) {
    return type(Element.fromDom(range.startContainer), range.startOffset, Element.fromDom(range.endContainer), range.endOffset);
  };
  var getRanges = function getRanges(win, selection) {
    return selection.match({
      domRange: function domRange(rng) {
        return {
          ltr: constant(rng),
          rtl: Option.none
        };
      },
      relative: function relative(startSitu, finishSitu) {
        return {
          ltr: cached(function () {
            return relativeToNative(win, startSitu, finishSitu);
          }),
          rtl: cached(function () {
            return Option.some(relativeToNative(win, finishSitu, startSitu));
          })
        };
      },
      exact: function exact(start, soffset, finish, foffset) {
        return {
          ltr: cached(function () {
            return exactToNative(win, start, soffset, finish, foffset);
          }),
          rtl: cached(function () {
            return Option.some(exactToNative(win, finish, foffset, start, soffset));
          })
        };
      }
    });
  };
  var doDiagnose = function doDiagnose(win, ranges) {
    var rng = ranges.ltr();
    if (rng.collapsed) {
      var reversed = ranges.rtl().filter(function (rev) {
        return rev.collapsed === false;
      });
      return reversed.map(function (rev) {
        return adt$6.rtl(Element.fromDom(rev.endContainer), rev.endOffset, Element.fromDom(rev.startContainer), rev.startOffset);
      }).getOrThunk(function () {
        return fromRange(win, adt$6.ltr, rng);
      });
    } else {
      return fromRange(win, adt$6.ltr, rng);
    }
  };
  var diagnose = function diagnose(win, selection) {
    var ranges = getRanges(win, selection);
    return doDiagnose(win, ranges);
  };
  var asLtrRange = function asLtrRange(win, selection) {
    var diagnosis = diagnose(win, selection);
    return diagnosis.match({
      ltr: function ltr(start, soffset, finish, foffset) {
        var rng = win.document.createRange();
        rng.setStart(start.dom(), soffset);
        rng.setEnd(finish.dom(), foffset);
        return rng;
      },
      rtl: function rtl(start, soffset, finish, foffset) {
        var rng = win.document.createRange();
        rng.setStart(finish.dom(), foffset);
        rng.setEnd(start.dom(), soffset);
        return rng;
      }
    });
  };

  var searchForPoint = function searchForPoint(rectForOffset, x, y, maxX, length) {
    if (length === 0) {
      return 0;
    } else if (x === maxX) {
      return length - 1;
    }
    var xDelta = maxX;
    for (var i = 1; i < length; i++) {
      var rect = rectForOffset(i);
      var curDeltaX = Math.abs(x - rect.left);
      if (y <= rect.bottom) {
        if (y < rect.top || curDeltaX > xDelta) {
          return i - 1;
        } else {
          xDelta = curDeltaX;
        }
      }
    }
    return 0;
  };
  var inRect = function inRect(rect, x, y) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };

  var locateOffset = function locateOffset(doc, textnode, x, y, rect) {
    var rangeForOffset = function rangeForOffset(o) {
      var r = doc.dom().createRange();
      r.setStart(textnode.dom(), o);
      r.collapse(true);
      return r;
    };
    var rectForOffset = function rectForOffset(o) {
      var r = rangeForOffset(o);
      return r.getBoundingClientRect();
    };
    var length = get$b(textnode).length;
    var offset = searchForPoint(rectForOffset, x, y, rect.right, length);
    return rangeForOffset(offset);
  };
  var locate$1 = function locate$1(doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rects = r.getClientRects();
    var foundRect = findMap(rects, function (rect) {
      return inRect(rect, x, y) ? Option.some(rect) : Option.none();
    });
    return foundRect.map(function (rect) {
      return locateOffset(doc, node, x, y, rect);
    });
  };

  var searchInChildren = function searchInChildren(doc, node, x, y) {
    var r = doc.dom().createRange();
    var nodes = children(node);
    return findMap(nodes, function (n) {
      r.selectNode(n.dom());
      return inRect(r.getBoundingClientRect(), x, y) ? locateNode(doc, n, x, y) : Option.none();
    });
  };
  var locateNode = function locateNode(doc, node, x, y) {
    return isText(node) ? locate$1(doc, node, x, y) : searchInChildren(doc, node, x, y);
  };
  var locate$2 = function locate$2(doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rect = r.getBoundingClientRect();
    var boundedX = Math.max(rect.left, Math.min(rect.right, x));
    var boundedY = Math.max(rect.top, Math.min(rect.bottom, y));
    return locateNode(doc, node, boundedX, boundedY);
  };

  var first$1 = function first$1(element) {
    return descendant(element, isCursorPosition);
  };
  var last = function last(element) {
    return descendantRtl(element, isCursorPosition);
  };
  var descendantRtl = function descendantRtl(scope, predicate) {
    var descend = function descend(element) {
      var children$1 = children(element);
      for (var i = children$1.length - 1; i >= 0; i--) {
        var child = children$1[i];
        if (predicate(child)) {
          return Option.some(child);
        }
        var res = descend(child);
        if (res.isSome()) {
          return res;
        }
      }
      return Option.none();
    };
    return descend(scope);
  };

  var COLLAPSE_TO_LEFT = true;
  var COLLAPSE_TO_RIGHT = false;
  var getCollapseDirection = function getCollapseDirection(rect, x) {
    return x - rect.left < rect.right - x ? COLLAPSE_TO_LEFT : COLLAPSE_TO_RIGHT;
  };
  var createCollapsedNode = function createCollapsedNode(doc, target, collapseDirection) {
    var r = doc.dom().createRange();
    r.selectNode(target.dom());
    r.collapse(collapseDirection);
    return r;
  };
  var locateInElement = function locateInElement(doc, node, x) {
    var cursorRange = doc.dom().createRange();
    cursorRange.selectNode(node.dom());
    var rect = cursorRange.getBoundingClientRect();
    var collapseDirection = getCollapseDirection(rect, x);
    var f = collapseDirection === COLLAPSE_TO_LEFT ? first$1 : last;
    return f(node).map(function (target) {
      return createCollapsedNode(doc, target, collapseDirection);
    });
  };
  var locateInEmpty = function locateInEmpty(doc, node, x) {
    var rect = node.dom().getBoundingClientRect();
    var collapseDirection = getCollapseDirection(rect, x);
    return Option.some(createCollapsedNode(doc, node, collapseDirection));
  };
  var search$1 = function search$1(doc, node, x) {
    var f = children(node).length === 0 ? locateInEmpty : locateInElement;
    return f(doc, node, x);
  };

  var caretPositionFromPoint = function caretPositionFromPoint(doc, x, y) {
    return Option.from(doc.dom().caretPositionFromPoint(x, y)).bind(function (pos) {
      if (pos.offsetNode === null) {
        return Option.none();
      }
      var r = doc.dom().createRange();
      r.setStart(pos.offsetNode, pos.offset);
      r.collapse();
      return Option.some(r);
    });
  };
  var caretRangeFromPoint = function caretRangeFromPoint(doc, x, y) {
    return Option.from(doc.dom().caretRangeFromPoint(x, y));
  };
  var searchTextNodes = function searchTextNodes(doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rect = r.getBoundingClientRect();
    var boundedX = Math.max(rect.left, Math.min(rect.right, x));
    var boundedY = Math.max(rect.top, Math.min(rect.bottom, y));
    return locate$2(doc, node, boundedX, boundedY);
  };
  var searchFromPoint = function searchFromPoint(doc, x, y) {
    return Element.fromPoint(doc, x, y).bind(function (elem) {
      var fallback = function fallback() {
        return search$1(doc, elem, x);
      };
      return children(elem).length === 0 ? fallback() : searchTextNodes(doc, elem, x, y).orThunk(fallback);
    });
  };
  var availableSearch = document.caretPositionFromPoint ? caretPositionFromPoint : document.caretRangeFromPoint ? caretRangeFromPoint : searchFromPoint;

  var beforeSpecial = function beforeSpecial(element, offset) {
    var name$1 = name(element);
    if ('input' === name$1) {
      return Situ.after(element);
    } else if (!contains(['br', 'img'], name$1)) {
      return Situ.on(element, offset);
    } else {
      return offset === 0 ? Situ.before(element) : Situ.after(element);
    }
  };
  var preprocessExact = function preprocessExact(start, soffset, finish, foffset) {
    var startSitu = beforeSpecial(start, soffset);
    var finishSitu = beforeSpecial(finish, foffset);
    return Selection.relative(startSitu, finishSitu);
  };

  var makeRange = function makeRange(start, soffset, finish, foffset) {
    var doc = owner(start);
    var rng = doc.dom().createRange();
    rng.setStart(start.dom(), soffset);
    rng.setEnd(finish.dom(), foffset);
    return rng;
  };
  var after$2 = function after$2(start, soffset, finish, foffset) {
    var r = makeRange(start, soffset, finish, foffset);
    var same = eq(start, finish) && soffset === foffset;
    return r.collapsed && !same;
  };

  var doSetNativeRange = function doSetNativeRange(win, rng) {
    Option.from(win.getSelection()).each(function (selection) {
      selection.removeAllRanges();
      selection.addRange(rng);
    });
  };
  var doSetRange = function doSetRange(win, start, soffset, finish, foffset) {
    var rng = exactToNative(win, start, soffset, finish, foffset);
    doSetNativeRange(win, rng);
  };
  var setLegacyRtlRange = function setLegacyRtlRange(win, selection, start, soffset, finish, foffset) {
    selection.collapse(start.dom(), soffset);
    selection.extend(finish.dom(), foffset);
  };
  var setRangeFromRelative = function setRangeFromRelative(win, relative) {
    return diagnose(win, relative).match({
      ltr: function ltr(start, soffset, finish, foffset) {
        doSetRange(win, start, soffset, finish, foffset);
      },
      rtl: function rtl(start, soffset, finish, foffset) {
        var selection = win.getSelection();
        if (selection.setBaseAndExtent) {
          selection.setBaseAndExtent(start.dom(), soffset, finish.dom(), foffset);
        } else if (selection.extend) {
          try {
            setLegacyRtlRange(win, selection, start, soffset, finish, foffset);
          } catch (e) {
            doSetRange(win, finish, foffset, start, soffset);
          }
        } else {
          doSetRange(win, finish, foffset, start, soffset);
        }
      }
    });
  };
  var setExact = function setExact(win, start, soffset, finish, foffset) {
    var relative = preprocessExact(start, soffset, finish, foffset);
    setRangeFromRelative(win, relative);
  };
  var readRange = function readRange(selection) {
    if (selection.rangeCount > 0) {
      var firstRng = selection.getRangeAt(0);
      var lastRng = selection.getRangeAt(selection.rangeCount - 1);
      return Option.some(SimRange.create(Element.fromDom(firstRng.startContainer), firstRng.startOffset, Element.fromDom(lastRng.endContainer), lastRng.endOffset));
    } else {
      return Option.none();
    }
  };
  var doGetExact = function doGetExact(selection) {
    var anchor = Element.fromDom(selection.anchorNode);
    var focus = Element.fromDom(selection.focusNode);
    return after$2(anchor, selection.anchorOffset, focus, selection.focusOffset) ? Option.some(SimRange.create(anchor, selection.anchorOffset, focus, selection.focusOffset)) : readRange(selection);
  };
  var getExact = function getExact(win) {
    return Option.from(win.getSelection()).filter(function (sel) {
      return sel.rangeCount > 0;
    }).bind(doGetExact);
  };
  var get$c = function get$c(win) {
    return getExact(win).map(function (range) {
      return Selection.exact(range.start(), range.soffset(), range.finish(), range.foffset());
    });
  };
  var getFirstRect$1 = function getFirstRect$1(win, selection) {
    var rng = asLtrRange(win, selection);
    return getFirstRect(rng);
  };
  var clear$1 = function clear$1(win) {
    var selection = win.getSelection();
    selection.removeAllRanges();
  };

  var COLLAPSED_WIDTH = 2;
  var collapsedRect = function collapsedRect(rect) {
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: constant(COLLAPSED_WIDTH),
      height: rect.height
    };
  };
  var toRect$1 = function toRect$1(rawRect) {
    return {
      left: constant(rawRect.left),
      top: constant(rawRect.top),
      right: constant(rawRect.right),
      bottom: constant(rawRect.bottom),
      width: constant(rawRect.width),
      height: constant(rawRect.height)
    };
  };
  var getRectsFromRange = function getRectsFromRange(range) {
    if (!range.collapsed) {
      return map$1(range.getClientRects(), toRect$1);
    } else {
      var start_1 = Element.fromDom(range.startContainer);
      return parent(start_1).bind(function (parent) {
        var selection = Selection.exact(start_1, range.startOffset, parent, getEnd(parent));
        var optRect = getFirstRect$1(range.startContainer.ownerDocument.defaultView, selection);
        return optRect.map(collapsedRect).map(pure);
      }).getOr([]);
    }
  };
  var getRectangles = function getRectangles(cWin) {
    var sel = cWin.getSelection();
    return sel !== undefined && sel.rangeCount > 0 ? getRectsFromRange(sel.getRangeAt(0)) : [];
  };
  var Rectangles = { getRectangles: getRectangles };

  var autocompleteHack = function autocompleteHack() {
    return function (f) {
      global$4.setTimeout(function () {
        f();
      }, 0);
    };
  };
  var resume = function resume(cWin) {
    cWin.focus();
    var iBody = Element.fromDom(cWin.document.body);
    var inInput = active().exists(function (elem) {
      return contains(['input', 'textarea'], name(elem));
    });
    var transaction = inInput ? autocompleteHack() : apply;
    transaction(function () {
      active().each(blur);
      focus$1(iBody);
    });
  };
  var ResumeEditing = { resume: resume };

  var EXTRA_SPACING = 50;
  var data = 'data-' + Styles.resolve('last-outer-height');
  var setLastHeight = function setLastHeight(cBody, value) {
    set(cBody, data, value);
  };
  var getLastHeight = function getLastHeight(cBody) {
    return DataAttributes.safeParse(cBody, data);
  };
  var getBoundsFrom = function getBoundsFrom(rect) {
    return {
      top: constant(rect.top()),
      bottom: constant(rect.top() + rect.height())
    };
  };
  var getBounds$1 = function getBounds$1(cWin) {
    var rects = Rectangles.getRectangles(cWin);
    return rects.length > 0 ? Option.some(rects[0]).map(getBoundsFrom) : Option.none();
  };
  var findDelta = function findDelta(outerWindow, cBody) {
    var last = getLastHeight(cBody);
    var current = outerWindow.innerHeight;
    return last > current ? Option.some(last - current) : Option.none();
  };
  var calculate = function calculate(cWin, bounds, delta) {
    var isOutside = bounds.top() > cWin.innerHeight || bounds.bottom() > cWin.innerHeight;
    return isOutside ? Math.min(delta, bounds.bottom() - cWin.innerHeight + EXTRA_SPACING) : 0;
  };
  var setup$1 = function setup$1(outerWindow, cWin) {
    var cBody = Element.fromDom(cWin.document.body);
    var toEditing = function toEditing() {
      ResumeEditing.resume(cWin);
    };
    var onResize = bind$3(Element.fromDom(outerWindow), 'resize', function () {
      findDelta(outerWindow, cBody).each(function (delta) {
        getBounds$1(cWin).each(function (bounds) {
          var cScrollBy = calculate(cWin, bounds, delta);
          if (cScrollBy !== 0) {
            cWin.scrollTo(cWin.pageXOffset, cWin.pageYOffset + cScrollBy);
          }
        });
      });
      setLastHeight(cBody, outerWindow.innerHeight);
    });
    setLastHeight(cBody, outerWindow.innerHeight);
    var destroy = function destroy() {
      onResize.unbind();
    };
    return {
      toEditing: toEditing,
      destroy: destroy
    };
  };
  var AndroidSetup = { setup: setup$1 };

  var getBodyFromFrame = function getBodyFromFrame(frame) {
    return Option.some(Element.fromDom(frame.dom().contentWindow.document.body));
  };
  var getDocFromFrame = function getDocFromFrame(frame) {
    return Option.some(Element.fromDom(frame.dom().contentWindow.document));
  };
  var getWinFromFrame = function getWinFromFrame(frame) {
    return Option.from(frame.dom().contentWindow);
  };
  var getSelectionFromFrame = function getSelectionFromFrame(frame) {
    var optWin = getWinFromFrame(frame);
    return optWin.bind(getExact);
  };
  var getFrame = function getFrame(editor) {
    return editor.getFrame();
  };
  var getOrDerive = function getOrDerive(name, f) {
    return function (editor) {
      var g = editor[name].getOrThunk(function () {
        var frame = getFrame(editor);
        return function () {
          return f(frame);
        };
      });
      return g();
    };
  };
  var getOrListen = function getOrListen(editor, doc, name, type) {
    return editor[name].getOrThunk(function () {
      return function (handler) {
        return bind$3(doc, type, handler);
      };
    });
  };
  var toRect$2 = function toRect$2(rect) {
    return {
      left: constant(rect.left),
      top: constant(rect.top),
      right: constant(rect.right),
      bottom: constant(rect.bottom),
      width: constant(rect.width),
      height: constant(rect.height)
    };
  };
  var getActiveApi = function getActiveApi(editor) {
    var frame = getFrame(editor);
    var tryFallbackBox = function tryFallbackBox(win) {
      var isCollapsed = function isCollapsed(sel) {
        return eq(sel.start(), sel.finish()) && sel.soffset() === sel.foffset();
      };
      var toStartRect = function toStartRect(sel) {
        var rect = sel.start().dom().getBoundingClientRect();
        return rect.width > 0 || rect.height > 0 ? Option.some(rect).map(toRect$2) : Option.none();
      };
      return getExact(win).filter(isCollapsed).bind(toStartRect);
    };
    return getBodyFromFrame(frame).bind(function (body) {
      return getDocFromFrame(frame).bind(function (doc) {
        return getWinFromFrame(frame).map(function (win) {
          var html = Element.fromDom(doc.dom().documentElement);
          var getCursorBox = editor.getCursorBox.getOrThunk(function () {
            return function () {
              return get$c(win).bind(function (sel) {
                return getFirstRect$1(win, sel).orThunk(function () {
                  return tryFallbackBox(win);
                });
              });
            };
          });
          var setSelection = editor.setSelection.getOrThunk(function () {
            return function (start, soffset, finish, foffset) {
              setExact(win, start, soffset, finish, foffset);
            };
          });
          var clearSelection = editor.clearSelection.getOrThunk(function () {
            return function () {
              clear$1(win);
            };
          });
          return {
            body: constant(body),
            doc: constant(doc),
            win: constant(win),
            html: constant(html),
            getSelection: curry(getSelectionFromFrame, frame),
            setSelection: setSelection,
            clearSelection: clearSelection,
            frame: constant(frame),
            onKeyup: getOrListen(editor, doc, 'onKeyup', 'keyup'),
            onNodeChanged: getOrListen(editor, doc, 'onNodeChanged', 'SelectionChange'),
            onDomChanged: editor.onDomChanged,
            onScrollToCursor: editor.onScrollToCursor,
            onScrollToElement: editor.onScrollToElement,
            onToReading: editor.onToReading,
            onToEditing: editor.onToEditing,
            onToolbarScrollStart: editor.onToolbarScrollStart,
            onTouchContent: editor.onTouchContent,
            onTapContent: editor.onTapContent,
            onTouchToolstrip: editor.onTouchToolstrip,
            getCursorBox: getCursorBox
          };
        });
      });
    });
  };
  var PlatformEditor = {
    getBody: getOrDerive('getBody', getBodyFromFrame),
    getDoc: getOrDerive('getDoc', getDocFromFrame),
    getWin: getOrDerive('getWin', getWinFromFrame),
    getSelection: getOrDerive('getSelection', getSelectionFromFrame),
    getFrame: getFrame,
    getActiveApi: getActiveApi
  };

  var attr = 'data-ephox-mobile-fullscreen-style';
  var siblingStyles = 'display:none!important;';
  var ancestorPosition = 'position:absolute!important;';
  var ancestorStyles = 'top:0!important;left:0!important;margin:0!important;padding:0!important;width:100%!important;height:100%!important;overflow:visible!important;';
  var bgFallback = 'background-color:rgb(255,255,255)!important;';
  var isAndroid = detect$3().os.isAndroid();
  var matchColor = function matchColor(editorBody) {
    var color = get$3(editorBody, 'background-color');
    return color !== undefined && color !== '' ? 'background-color:' + color + '!important' : bgFallback;
  };
  var clobberStyles = function clobberStyles(container, editorBody) {
    var gatherSibilings = function gatherSibilings(element) {
      var siblings = siblings$2(element, '*');
      return siblings;
    };
    var clobber = function clobber(clobberStyle) {
      return function (element) {
        var styles = get(element, 'style');
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
    each$1(siblings, clobber(siblingStyles));
    each$1(ancestors, clobber(ancestorPosition + ancestorStyles + bgColor));
    var containerStyles = isAndroid === true ? '' : ancestorPosition;
    clobber(containerStyles + ancestorStyles + bgColor)(container);
  };
  var restoreStyles = function restoreStyles() {
    var clobberedEls = all$2('[' + attr + ']');
    each$1(clobberedEls, function (element) {
      var restore = get(element, attr);
      if (restore !== 'no-styles') {
        set(element, 'style', restore);
      } else {
        remove$1(element, 'style');
      }
      remove$1(element, attr);
    });
  };
  var Thor = {
    clobberStyles: clobberStyles,
    restoreStyles: restoreStyles
  };

  var tag = function tag() {
    var head = first('head').getOrDie();
    var nu = function nu() {
      var meta = Element.fromTag('meta');
      set(meta, 'name', 'viewport');
      append(head, meta);
      return meta;
    };
    var element = first('meta[name="viewport"]').getOrThunk(nu);
    var backup = get(element, 'content');
    var maximize = function maximize() {
      set(element, 'content', 'width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0');
    };
    var restore = function restore() {
      if (backup !== undefined && backup !== null && backup.length > 0) {
        set(element, 'content', backup);
      } else {
        set(element, 'content', 'user-scalable=yes');
      }
    };
    return {
      maximize: maximize,
      restore: restore
    };
  };
  var MetaViewport = { tag: tag };

  var create$4 = function create$4(platform, mask) {
    var meta = MetaViewport.tag();
    var androidApi = api$2();
    var androidEvents = api$2();
    var enter = function enter() {
      mask.hide();
      add$2(platform.container, Styles.resolve('fullscreen-maximized'));
      add$2(platform.container, Styles.resolve('android-maximized'));
      meta.maximize();
      add$2(platform.body, Styles.resolve('android-scroll-reload'));
      androidApi.set(AndroidSetup.setup(platform.win, PlatformEditor.getWin(platform.editor).getOrDie('no')));
      PlatformEditor.getActiveApi(platform.editor).each(function (editorApi) {
        Thor.clobberStyles(platform.container, editorApi.body());
        androidEvents.set(AndroidEvents.initEvents(editorApi, platform.toolstrip, platform.alloy));
      });
    };
    var exit = function exit() {
      meta.restore();
      mask.show();
      remove$4(platform.container, Styles.resolve('fullscreen-maximized'));
      remove$4(platform.container, Styles.resolve('android-maximized'));
      Thor.restoreStyles();
      remove$4(platform.body, Styles.resolve('android-scroll-reload'));
      androidEvents.clear();
      androidApi.clear();
    };
    return {
      enter: enter,
      exit: exit
    };
  };
  var AndroidMode = { create: create$4 };

  var first$2 = function first$2(fn, rate) {
    var timer = null;
    var cancel = function cancel() {
      if (timer !== null) {
        domGlobals.clearTimeout(timer);
        timer = null;
      }
    };
    var throttle = function throttle() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      if (timer === null) {
        timer = domGlobals.setTimeout(function () {
          fn.apply(null, args);
          timer = null;
        }, rate);
      }
    };
    return {
      cancel: cancel,
      throttle: throttle
    };
  };
  var last$1 = function last$1(fn, rate) {
    var timer = null;
    var cancel = function cancel() {
      if (timer !== null) {
        domGlobals.clearTimeout(timer);
        timer = null;
      }
    };
    var throttle = function throttle() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      if (timer !== null) {
        domGlobals.clearTimeout(timer);
      }
      timer = domGlobals.setTimeout(function () {
        fn.apply(null, args);
        timer = null;
      }, rate);
    };
    return {
      cancel: cancel,
      throttle: throttle
    };
  };

  var sketch$9 = function sketch$9(onView, translate) {
    var memIcon = record(Container.sketch({
      dom: dom$1('<div aria-hidden="true" class="${prefix}-mask-tap-icon"></div>'),
      containerBehaviours: derive$1([Toggling.config({
        toggleClass: Styles.resolve('mask-tap-icon-selected'),
        toggleOnExecute: false
      })])
    }));
    var onViewThrottle = first$2(onView, 200);
    return Container.sketch({
      dom: dom$1('<div class="${prefix}-disabled-mask"></div>'),
      components: [Container.sketch({
        dom: dom$1('<div class="${prefix}-content-container"></div>'),
        components: [Button.sketch({
          dom: dom$1('<div class="${prefix}-content-tap-section"></div>'),
          components: [memIcon.asSpec()],
          action: function action(button) {
            onViewThrottle.throttle();
          },
          buttonBehaviours: derive$1([Toggling.config({ toggleClass: Styles.resolve('mask-tap-icon-selected') })])
        })]
      })]
    });
  };
  var TapToEditMask = { sketch: sketch$9 };

  var MobileSchema = objOf([strictObjOf('editor', [strict$1('getFrame'), option('getBody'), option('getDoc'), option('getWin'), option('getSelection'), option('setSelection'), option('clearSelection'), option('cursorSaver'), option('onKeyup'), option('onNodeChanged'), option('getCursorBox'), strict$1('onDomChanged'), defaulted$1('onTouchContent', noop), defaulted$1('onTapContent', noop), defaulted$1('onTouchToolstrip', noop), defaulted$1('onScrollToCursor', constant({ unbind: noop })), defaulted$1('onScrollToElement', constant({ unbind: noop })), defaulted$1('onToEditing', constant({ unbind: noop })), defaulted$1('onToReading', constant({ unbind: noop })), defaulted$1('onToolbarScrollStart', identity)]), strict$1('socket'), strict$1('toolstrip'), strict$1('dropup'), strict$1('toolbar'), strict$1('container'), strict$1('alloy'), state$1('win', function (spec) {
    return owner(spec.socket).dom().defaultView;
  }), state$1('body', function (spec) {
    return Element.fromDom(spec.socket.dom().ownerDocument.body);
  }), defaulted$1('translate', identity), defaulted$1('setReadOnly', noop), defaulted$1('readOnlyOnInit', constant(true))]);

  var produce = function produce(raw) {
    var mobile = asRawOrDie('Getting AndroidWebapp schema', MobileSchema, raw);
    set$3(mobile.toolstrip, 'width', '100%');
    var onTap = function onTap() {
      mobile.setReadOnly(mobile.readOnlyOnInit());
      mode.enter();
    };
    var mask = build$1(TapToEditMask.sketch(onTap, mobile.translate));
    mobile.alloy.add(mask);
    var maskApi = {
      show: function show() {
        mobile.alloy.add(mask);
      },
      hide: function hide() {
        mobile.alloy.remove(mask);
      }
    };
    append(mobile.container, mask.element());
    var mode = AndroidMode.create(mobile, maskApi);
    return {
      setReadOnly: mobile.setReadOnly,
      refreshStructure: noop,
      enter: mode.enter,
      exit: mode.exit,
      destroy: noop
    };
  };
  var AndroidWebapp = { produce: produce };

  var schema$e = constant([strict$1('dom'), defaulted$1('shell', true), field$1('toolbarBehaviours', [Replacing])]);
  var enhanceGroups = function enhanceGroups(detail) {
    return { behaviours: derive$1([Replacing.config({})]) };
  };
  var parts$2 = constant([optional({
    name: 'groups',
    overrides: enhanceGroups
  })]);

  var factory$4 = function factory$4(detail, components, spec, _externals) {
    var setGroups = function setGroups(toolbar, groups) {
      getGroupContainer(toolbar).fold(function () {
        domGlobals.console.error('Toolbar was defined to not be a shell, but no groups container was specified in components');
        throw new Error('Toolbar was defined to not be a shell, but no groups container was specified in components');
      }, function (container) {
        Replacing.set(container, groups);
      });
    };
    var getGroupContainer = function getGroupContainer(component) {
      return detail.shell ? Option.some(component) : getPart(component, detail, 'groups');
    };
    var extra = detail.shell ? {
      behaviours: [Replacing.config({})],
      components: []
    } : {
      behaviours: [],
      components: components
    };
    return {
      uid: detail.uid,
      dom: detail.dom,
      components: extra.components,
      behaviours: augment(detail.toolbarBehaviours, extra.behaviours),
      apis: { setGroups: setGroups },
      domModification: { attributes: { role: 'group' } }
    };
  };
  var Toolbar = composite$1({
    name: 'Toolbar',
    configFields: schema$e(),
    partFields: parts$2(),
    factory: factory$4,
    apis: {
      setGroups: function setGroups(apis, toolbar, groups) {
        apis.setGroups(toolbar, groups);
      }
    }
  });

  var schema$f = constant([strict$1('items'), markers(['itemSelector']), field$1('tgroupBehaviours', [Keying])]);
  var parts$3 = constant([group({
    name: 'items',
    unit: 'item'
  })]);

  var factory$5 = function factory$5(detail, components, spec, _externals) {
    return {
      uid: detail.uid,
      dom: detail.dom,
      components: components,
      behaviours: augment(detail.tgroupBehaviours, [Keying.config({
        mode: 'flow',
        selector: detail.markers.itemSelector
      })]),
      domModification: { attributes: { role: 'toolbar' } }
    };
  };
  var ToolbarGroup = composite$1({
    name: 'ToolbarGroup',
    configFields: schema$f(),
    partFields: parts$3(),
    factory: factory$5
  });

  var dataHorizontal = 'data-' + Styles.resolve('horizontal-scroll');
  var canScrollVertically = function canScrollVertically(container) {
    container.dom().scrollTop = 1;
    var result = container.dom().scrollTop !== 0;
    container.dom().scrollTop = 0;
    return result;
  };
  var canScrollHorizontally = function canScrollHorizontally(container) {
    container.dom().scrollLeft = 1;
    var result = container.dom().scrollLeft !== 0;
    container.dom().scrollLeft = 0;
    return result;
  };
  var hasVerticalScroll = function hasVerticalScroll(container) {
    return container.dom().scrollTop > 0 || canScrollVertically(container);
  };
  var hasHorizontalScroll = function hasHorizontalScroll(container) {
    return container.dom().scrollLeft > 0 || canScrollHorizontally(container);
  };
  var markAsHorizontal = function markAsHorizontal(container) {
    set(container, dataHorizontal, 'true');
  };
  var hasScroll = function hasScroll(container) {
    return get(container, dataHorizontal) === 'true' ? hasHorizontalScroll(container) : hasVerticalScroll(container);
  };
  var exclusive = function exclusive(scope, selector) {
    return bind$3(scope, 'touchmove', function (event) {
      closest$2(event.target(), selector).filter(hasScroll).fold(function () {
        event.raw().preventDefault();
      }, noop);
    });
  };
  var Scrollables = {
    exclusive: exclusive,
    markAsHorizontal: markAsHorizontal
  };

  function ScrollingToolbar() {
    var makeGroup = function makeGroup(gSpec) {
      var scrollClass = gSpec.scrollable === true ? '${prefix}-toolbar-scrollable-group' : '';
      return {
        dom: dom$1('<div aria-label="' + gSpec.label + '" class="${prefix}-toolbar-group ' + scrollClass + '"></div>'),
        tgroupBehaviours: derive$1([config('adhoc-scrollable-toolbar', gSpec.scrollable === true ? [runOnInit(function (component, simulatedEvent) {
          set$3(component.element(), 'overflow-x', 'auto');
          Scrollables.markAsHorizontal(component.element());
          Scrollable.register(component.element());
        })] : [])]),
        components: [Container.sketch({ components: [ToolbarGroup.parts().items({})] })],
        markers: { itemSelector: '.' + Styles.resolve('toolbar-group-item') },
        items: gSpec.items
      };
    };
    var toolbar = build$1(Toolbar.sketch({
      dom: dom$1('<div class="${prefix}-toolbar"></div>'),
      components: [Toolbar.parts().groups({})],
      toolbarBehaviours: derive$1([Toggling.config({
        toggleClass: Styles.resolve('context-toolbar'),
        toggleOnExecute: false,
        aria: { mode: 'none' }
      }), Keying.config({ mode: 'cyclic' })]),
      shell: true
    }));
    var wrapper = build$1(Container.sketch({
      dom: { classes: [Styles.resolve('toolstrip')] },
      components: [premade$1(toolbar)],
      containerBehaviours: derive$1([Toggling.config({
        toggleClass: Styles.resolve('android-selection-context-toolbar'),
        toggleOnExecute: false
      })])
    }));
    var resetGroups = function resetGroups() {
      Toolbar.setGroups(toolbar, initGroups.get());
      Toggling.off(toolbar);
    };
    var initGroups = Cell([]);
    var setGroups = function setGroups(gs) {
      initGroups.set(gs);
      resetGroups();
    };
    var createGroups = function createGroups(gs) {
      return map$1(gs, compose(ToolbarGroup.sketch, makeGroup));
    };
    var refresh = function refresh() {};
    var setContextToolbar = function setContextToolbar(gs) {
      Toggling.on(toolbar);
      Toolbar.setGroups(toolbar, gs);
    };
    var restoreToolbar = function restoreToolbar() {
      if (Toggling.isOn(toolbar)) {
        resetGroups();
      }
    };
    var focus = function focus() {
      Keying.focusIn(toolbar);
    };
    return {
      wrapper: constant(wrapper),
      toolbar: constant(toolbar),
      createGroups: createGroups,
      setGroups: setGroups,
      setContextToolbar: setContextToolbar,
      restoreToolbar: restoreToolbar,
      refresh: refresh,
      focus: focus
    };
  }

  var makeEditSwitch = function makeEditSwitch(webapp) {
    return build$1(Button.sketch({
      dom: dom$1('<div class="${prefix}-mask-edit-icon ${prefix}-icon"></div>'),
      action: function action() {
        webapp.run(function (w) {
          w.setReadOnly(false);
        });
      }
    }));
  };
  var makeSocket = function makeSocket() {
    return build$1(Container.sketch({
      dom: dom$1('<div class="${prefix}-editor-socket"></div>'),
      components: [],
      containerBehaviours: derive$1([Replacing.config({})])
    }));
  };
  var showEdit = function showEdit(socket, switchToEdit) {
    Replacing.append(socket, premade$1(switchToEdit));
  };
  var hideEdit = function hideEdit(socket, switchToEdit) {
    Replacing.remove(socket, switchToEdit);
  };
  var updateMode = function updateMode(socket, switchToEdit, readOnly, root) {
    var swap = readOnly === true ? Swapping.toAlpha : Swapping.toOmega;
    swap(root);
    var f = readOnly ? showEdit : hideEdit;
    f(socket, switchToEdit);
  };
  var CommonRealm = {
    makeEditSwitch: makeEditSwitch,
    makeSocket: makeSocket,
    updateMode: updateMode
  };

  var getAnimationRoot = function getAnimationRoot(component, slideConfig) {
    return slideConfig.getAnimationRoot.fold(function () {
      return component.element();
    }, function (get) {
      return get(component);
    });
  };

  var getDimensionProperty = function getDimensionProperty(slideConfig) {
    return slideConfig.dimension.property;
  };
  var getDimension = function getDimension(slideConfig, elem) {
    return slideConfig.dimension.getDimension(elem);
  };
  var disableTransitions = function disableTransitions(component, slideConfig) {
    var root = getAnimationRoot(component, slideConfig);
    remove$6(root, [slideConfig.shrinkingClass, slideConfig.growingClass]);
  };
  var setShrunk = function setShrunk(component, slideConfig) {
    remove$4(component.element(), slideConfig.openClass);
    add$2(component.element(), slideConfig.closedClass);
    set$3(component.element(), getDimensionProperty(slideConfig), '0px');
    reflow(component.element());
  };
  var setGrown = function setGrown(component, slideConfig) {
    remove$4(component.element(), slideConfig.closedClass);
    add$2(component.element(), slideConfig.openClass);
    remove$5(component.element(), getDimensionProperty(slideConfig));
  };
  var doImmediateShrink = function doImmediateShrink(component, slideConfig, slideState, _calculatedSize) {
    slideState.setCollapsed();
    set$3(component.element(), getDimensionProperty(slideConfig), getDimension(slideConfig, component.element()));
    reflow(component.element());
    disableTransitions(component, slideConfig);
    setShrunk(component, slideConfig);
    slideConfig.onStartShrink(component);
    slideConfig.onShrunk(component);
  };
  var doStartShrink = function doStartShrink(component, slideConfig, slideState, calculatedSize) {
    var size = calculatedSize.getOrThunk(function () {
      return getDimension(slideConfig, component.element());
    });
    slideState.setCollapsed();
    set$3(component.element(), getDimensionProperty(slideConfig), size);
    reflow(component.element());
    var root = getAnimationRoot(component, slideConfig);
    remove$4(root, slideConfig.growingClass);
    add$2(root, slideConfig.shrinkingClass);
    setShrunk(component, slideConfig);
    slideConfig.onStartShrink(component);
  };
  var doStartSmartShrink = function doStartSmartShrink(component, slideConfig, slideState) {
    var size = getDimension(slideConfig, component.element());
    var shrinker = size === '0px' ? doImmediateShrink : doStartShrink;
    shrinker(component, slideConfig, slideState, Option.some(size));
  };
  var doStartGrow = function doStartGrow(component, slideConfig, slideState) {
    var root = getAnimationRoot(component, slideConfig);
    var wasShrinking = has$2(root, slideConfig.shrinkingClass);
    var beforeSize = getDimension(slideConfig, component.element());
    setGrown(component, slideConfig);
    var fullSize = getDimension(slideConfig, component.element());
    var startPartialGrow = function startPartialGrow() {
      set$3(component.element(), getDimensionProperty(slideConfig), beforeSize);
      reflow(component.element());
    };
    var startCompleteGrow = function startCompleteGrow() {
      setShrunk(component, slideConfig);
    };
    var setStartSize = wasShrinking ? startPartialGrow : startCompleteGrow;
    setStartSize();
    remove$4(root, slideConfig.shrinkingClass);
    add$2(root, slideConfig.growingClass);
    setGrown(component, slideConfig);
    set$3(component.element(), getDimensionProperty(slideConfig), fullSize);
    slideState.setExpanded();
    slideConfig.onStartGrow(component);
  };
  var refresh = function refresh(component, slideConfig, slideState) {
    if (slideState.isExpanded()) {
      remove$5(component.element(), getDimensionProperty(slideConfig));
      var fullSize = getDimension(slideConfig, component.element());
      set$3(component.element(), getDimensionProperty(slideConfig), fullSize);
    }
  };
  var grow = function grow(component, slideConfig, slideState) {
    if (!slideState.isExpanded()) {
      doStartGrow(component, slideConfig, slideState);
    }
  };
  var shrink = function shrink(component, slideConfig, slideState) {
    if (slideState.isExpanded()) {
      doStartSmartShrink(component, slideConfig, slideState);
    }
  };
  var immediateShrink = function immediateShrink(component, slideConfig, slideState) {
    if (slideState.isExpanded()) {
      doImmediateShrink(component, slideConfig, slideState);
    }
  };
  var hasGrown = function hasGrown(component, slideConfig, slideState) {
    return slideState.isExpanded();
  };
  var hasShrunk = function hasShrunk(component, slideConfig, slideState) {
    return slideState.isCollapsed();
  };
  var isGrowing = function isGrowing(component, slideConfig, slideState) {
    var root = getAnimationRoot(component, slideConfig);
    return has$2(root, slideConfig.growingClass) === true;
  };
  var isShrinking = function isShrinking(component, slideConfig, slideState) {
    var root = getAnimationRoot(component, slideConfig);
    return has$2(root, slideConfig.shrinkingClass) === true;
  };
  var isTransitioning = function isTransitioning(component, slideConfig, slideState) {
    return isGrowing(component, slideConfig) === true || isShrinking(component, slideConfig) === true;
  };
  var toggleGrow = function toggleGrow(component, slideConfig, slideState) {
    var f = slideState.isExpanded() ? doStartSmartShrink : doStartGrow;
    f(component, slideConfig, slideState);
  };

  var SlidingApis = /*#__PURE__*/Object.freeze({
    refresh: refresh,
    grow: grow,
    shrink: shrink,
    immediateShrink: immediateShrink,
    hasGrown: hasGrown,
    hasShrunk: hasShrunk,
    isGrowing: isGrowing,
    isShrinking: isShrinking,
    isTransitioning: isTransitioning,
    toggleGrow: toggleGrow,
    disableTransitions: disableTransitions
  });

  var exhibit$5 = function exhibit$5(base, slideConfig) {
    var expanded = slideConfig.expanded;
    return expanded ? nu$5({
      classes: [slideConfig.openClass],
      styles: {}
    }) : nu$5({
      classes: [slideConfig.closedClass],
      styles: wrap$1(slideConfig.dimension.property, '0px')
    });
  };
  var events$a = function events$a(slideConfig, slideState) {
    return derive([runOnSource(transitionend(), function (component, simulatedEvent) {
      var raw = simulatedEvent.event().raw();
      if (raw.propertyName === slideConfig.dimension.property) {
        disableTransitions(component, slideConfig);
        if (slideState.isExpanded()) {
          remove$5(component.element(), slideConfig.dimension.property);
        }
        var notify = slideState.isExpanded() ? slideConfig.onGrown : slideConfig.onShrunk;
        notify(component);
      }
    })]);
  };

  var ActiveSliding = /*#__PURE__*/Object.freeze({
    exhibit: exhibit$5,
    events: events$a
  });

  var SlidingSchema = [strict$1('closedClass'), strict$1('openClass'), strict$1('shrinkingClass'), strict$1('growingClass'), option('getAnimationRoot'), onHandler('onShrunk'), onHandler('onStartShrink'), onHandler('onGrown'), onHandler('onStartGrow'), defaulted$1('expanded', false), strictOf('dimension', choose$1('property', {
    width: [output('property', 'width'), output('getDimension', function (elem) {
      return get$6(elem) + 'px';
    })],
    height: [output('property', 'height'), output('getDimension', function (elem) {
      return get$4(elem) + 'px';
    })]
  }))];

  var init$4 = function init$4(spec) {
    var state = Cell(spec.expanded);
    var readState = function readState() {
      return 'expanded: ' + state.get();
    };
    return nu$6({
      isExpanded: function isExpanded() {
        return state.get() === true;
      },
      isCollapsed: function isCollapsed() {
        return state.get() === false;
      },
      setCollapsed: curry(state.set, false),
      setExpanded: curry(state.set, true),
      readState: readState
    });
  };

  var SlidingState = /*#__PURE__*/Object.freeze({
    init: init$4
  });

  var Sliding = create$1({
    fields: SlidingSchema,
    name: 'sliding',
    active: ActiveSliding,
    apis: SlidingApis,
    state: SlidingState
  });

  var build$2 = function build$2(refresh, scrollIntoView) {
    var dropup = build$1(Container.sketch({
      dom: {
        tag: 'div',
        classes: [Styles.resolve('dropup')]
      },
      components: [],
      containerBehaviours: derive$1([Replacing.config({}), Sliding.config({
        closedClass: Styles.resolve('dropup-closed'),
        openClass: Styles.resolve('dropup-open'),
        shrinkingClass: Styles.resolve('dropup-shrinking'),
        growingClass: Styles.resolve('dropup-growing'),
        dimension: { property: 'height' },
        onShrunk: function onShrunk(component) {
          refresh();
          scrollIntoView();
          Replacing.set(component, []);
        },
        onGrown: function onGrown(component) {
          refresh();
          scrollIntoView();
        }
      }), Receivers.orientation(function (component, data) {
        disappear(noop);
      })])
    }));
    var appear = function appear(menu, update, component) {
      if (Sliding.hasShrunk(dropup) === true && Sliding.isTransitioning(dropup) === false) {
        domGlobals.window.requestAnimationFrame(function () {
          update(component);
          Replacing.set(dropup, [menu()]);
          Sliding.grow(dropup);
        });
      }
    };
    var disappear = function disappear(onReadyToShrink) {
      domGlobals.window.requestAnimationFrame(function () {
        onReadyToShrink();
        Sliding.shrink(dropup);
      });
    };
    return {
      appear: appear,
      disappear: disappear,
      component: constant(dropup),
      element: dropup.element
    };
  };

  var closest$3 = function closest$3(scope, selector, isRoot) {
    return closest$2(scope, selector, isRoot).isSome();
  };

  var isDangerous = function isDangerous(event) {
    var keyEv = event.raw();
    return keyEv.which === BACKSPACE()[0] && !contains(['input', 'textarea'], name(event.target())) && !closest$3(event.target(), '[contenteditable="true"]');
  };
  var isFirefox = detect$3().browser.isFirefox();
  var settingsSchema = objOfOnly([strictFunction('triggerEvent'), defaulted$1('stopBackspace', true)]);
  var bindFocus = function bindFocus(container, handler) {
    if (isFirefox) {
      return capture$1(container, 'focus', handler);
    } else {
      return bind$3(container, 'focusin', handler);
    }
  };
  var bindBlur = function bindBlur(container, handler) {
    if (isFirefox) {
      return capture$1(container, 'blur', handler);
    } else {
      return bind$3(container, 'focusout', handler);
    }
  };
  var setup$2 = function setup$2(container, rawSettings) {
    var settings = asRawOrDie('Getting GUI events settings', settingsSchema, rawSettings);
    var pointerEvents = detect$3().deviceType.isTouch() ? ['touchstart', 'touchmove', 'touchend', 'gesturestart'] : ['mousedown', 'mouseup', 'mouseover', 'mousemove', 'mouseout', 'click'];
    var tapEvent = monitor(settings);
    var simpleEvents = map$1(pointerEvents.concat(['selectstart', 'input', 'contextmenu', 'change', 'transitionend', 'drag', 'dragstart', 'dragend', 'dragenter', 'dragleave', 'dragover', 'drop', 'keyup']), function (type) {
      return bind$3(container, type, function (event) {
        tapEvent.fireIfReady(event, type).each(function (tapStopped) {
          if (tapStopped) {
            event.kill();
          }
        });
        var stopped = settings.triggerEvent(type, event);
        if (stopped) {
          event.kill();
        }
      });
    });
    var pasteTimeout = Cell(Option.none());
    var onPaste = bind$3(container, 'paste', function (event) {
      tapEvent.fireIfReady(event, 'paste').each(function (tapStopped) {
        if (tapStopped) {
          event.kill();
        }
      });
      var stopped = settings.triggerEvent('paste', event);
      if (stopped) {
        event.kill();
      }
      pasteTimeout.set(Option.some(domGlobals.setTimeout(function () {
        settings.triggerEvent(postPaste(), event);
      }, 0)));
    });
    var onKeydown = bind$3(container, 'keydown', function (event) {
      var stopped = settings.triggerEvent('keydown', event);
      if (stopped) {
        event.kill();
      } else if (settings.stopBackspace === true && isDangerous(event)) {
        event.prevent();
      }
    });
    var onFocusIn = bindFocus(container, function (event) {
      var stopped = settings.triggerEvent('focusin', event);
      if (stopped) {
        event.kill();
      }
    });
    var focusoutTimeout = Cell(Option.none());
    var onFocusOut = bindBlur(container, function (event) {
      var stopped = settings.triggerEvent('focusout', event);
      if (stopped) {
        event.kill();
      }
      focusoutTimeout.set(Option.some(domGlobals.setTimeout(function () {
        settings.triggerEvent(postBlur(), event);
      }, 0)));
    });
    var unbind = function unbind() {
      each$1(simpleEvents, function (e) {
        e.unbind();
      });
      onKeydown.unbind();
      onFocusIn.unbind();
      onFocusOut.unbind();
      onPaste.unbind();
      pasteTimeout.get().each(domGlobals.clearTimeout);
      focusoutTimeout.get().each(domGlobals.clearTimeout);
    };
    return { unbind: unbind };
  };

  var derive$2 = function derive$2(rawEvent, rawTarget) {
    var source = readOptFrom$1(rawEvent, 'target').map(function (getTarget) {
      return getTarget();
    }).getOr(rawTarget);
    return Cell(source);
  };

  var fromSource = function fromSource(event, source) {
    var stopper = Cell(false);
    var cutter = Cell(false);
    var stop = function stop() {
      stopper.set(true);
    };
    var cut = function cut() {
      cutter.set(true);
    };
    return {
      stop: stop,
      cut: cut,
      isStopped: stopper.get,
      isCut: cutter.get,
      event: constant(event),
      setSource: source.set,
      getSource: source.get
    };
  };
  var fromExternal = function fromExternal(event) {
    var stopper = Cell(false);
    var stop = function stop() {
      stopper.set(true);
    };
    return {
      stop: stop,
      cut: noop,
      isStopped: stopper.get,
      isCut: constant(false),
      event: constant(event),
      setSource: die('Cannot set source of a broadcasted event'),
      getSource: die('Cannot get source of a broadcasted event')
    };
  };

  var adt$7 = Adt.generate([{ stopped: [] }, { resume: ['element'] }, { complete: [] }]);
  var doTriggerHandler = function doTriggerHandler(lookup, eventType, rawEvent, target, source, logger) {
    var handler = lookup(eventType, target);
    var simulatedEvent = fromSource(rawEvent, source);
    return handler.fold(function () {
      logger.logEventNoHandlers(eventType, target);
      return adt$7.complete();
    }, function (handlerInfo) {
      var descHandler = handlerInfo.descHandler();
      var eventHandler = getCurried(descHandler);
      eventHandler(simulatedEvent);
      if (simulatedEvent.isStopped()) {
        logger.logEventStopped(eventType, handlerInfo.element(), descHandler.purpose());
        return adt$7.stopped();
      } else if (simulatedEvent.isCut()) {
        logger.logEventCut(eventType, handlerInfo.element(), descHandler.purpose());
        return adt$7.complete();
      } else {
        return parent(handlerInfo.element()).fold(function () {
          logger.logNoParent(eventType, handlerInfo.element(), descHandler.purpose());
          return adt$7.complete();
        }, function (parent) {
          logger.logEventResponse(eventType, handlerInfo.element(), descHandler.purpose());
          return adt$7.resume(parent);
        });
      }
    });
  };
  var doTriggerOnUntilStopped = function doTriggerOnUntilStopped(lookup, eventType, rawEvent, rawTarget, source, logger) {
    return doTriggerHandler(lookup, eventType, rawEvent, rawTarget, source, logger).fold(function () {
      return true;
    }, function (parent) {
      return doTriggerOnUntilStopped(lookup, eventType, rawEvent, parent, source, logger);
    }, function () {
      return false;
    });
  };
  var triggerHandler = function triggerHandler(lookup, eventType, rawEvent, target, logger) {
    var source = derive$2(rawEvent, target);
    return doTriggerHandler(lookup, eventType, rawEvent, target, source, logger);
  };
  var broadcast = function broadcast(listeners, rawEvent, logger) {
    var simulatedEvent = fromExternal(rawEvent);
    each$1(listeners, function (listener) {
      var descHandler = listener.descHandler();
      var handler = getCurried(descHandler);
      handler(simulatedEvent);
    });
    return simulatedEvent.isStopped();
  };
  var triggerUntilStopped = function triggerUntilStopped(lookup, eventType, rawEvent, logger) {
    var rawTarget = rawEvent.target();
    return triggerOnUntilStopped(lookup, eventType, rawEvent, rawTarget, logger);
  };
  var triggerOnUntilStopped = function triggerOnUntilStopped(lookup, eventType, rawEvent, rawTarget, logger) {
    var source = derive$2(rawEvent, rawTarget);
    return doTriggerOnUntilStopped(lookup, eventType, rawEvent, rawTarget, source, logger);
  };

  var eventHandler = Immutable('element', 'descHandler');
  var broadcastHandler = function broadcastHandler(id, handler) {
    return {
      id: constant(id),
      descHandler: constant(handler)
    };
  };
  function EventRegistry() {
    var registry = {};
    var registerId = function registerId(extraArgs, id, events) {
      each(events, function (v, k) {
        var handlers = registry[k] !== undefined ? registry[k] : {};
        handlers[id] = curryArgs(v, extraArgs);
        registry[k] = handlers;
      });
    };
    var findHandler = function findHandler(handlers, elem) {
      return read$2(elem).fold(function () {
        return Option.none();
      }, function (id) {
        var reader = readOpt$1(id);
        return handlers.bind(reader).map(function (descHandler) {
          return eventHandler(elem, descHandler);
        });
      });
    };
    var filterByType = function filterByType(type) {
      return readOptFrom$1(registry, type).map(function (handlers) {
        return mapToArray(handlers, function (f, id) {
          return broadcastHandler(id, f);
        });
      }).getOr([]);
    };
    var find = function find(isAboveRoot, type, target) {
      var readType = readOpt$1(type);
      var handlers = readType(registry);
      return closest$1(target, function (elem) {
        return findHandler(handlers, elem);
      }, isAboveRoot);
    };
    var unregisterId = function unregisterId(id) {
      each(registry, function (handlersById, eventName) {
        if (handlersById.hasOwnProperty(id)) {
          delete handlersById[id];
        }
      });
    };
    return {
      registerId: registerId,
      unregisterId: unregisterId,
      filterByType: filterByType,
      find: find
    };
  }

  function Registry() {
    var events = EventRegistry();
    var components = {};
    var readOrTag = function readOrTag(component) {
      var elem = component.element();
      return read$2(elem).fold(function () {
        return write('uid-', component.element());
      }, function (uid) {
        return uid;
      });
    };
    var failOnDuplicate = function failOnDuplicate(component, tagId) {
      var conflict = components[tagId];
      if (conflict === component) {
        unregister(component);
      } else {
        throw new Error('The tagId "' + tagId + '" is already used by: ' + element(conflict.element()) + '\nCannot use it for: ' + element(component.element()) + '\n' + 'The conflicting element is' + (inBody(conflict.element()) ? ' ' : ' not ') + 'already in the DOM');
      }
    };
    var register = function register(component) {
      var tagId = readOrTag(component);
      if (hasKey$1(components, tagId)) {
        failOnDuplicate(component, tagId);
      }
      var extraArgs = [component];
      events.registerId(extraArgs, tagId, component.events());
      components[tagId] = component;
    };
    var unregister = function unregister(component) {
      read$2(component.element()).each(function (tagId) {
        delete components[tagId];
        events.unregisterId(tagId);
      });
    };
    var filter = function filter(type) {
      return events.filterByType(type);
    };
    var find = function find(isAboveRoot, type, target) {
      return events.find(isAboveRoot, type, target);
    };
    var getById = function getById(id) {
      return readOpt$1(id)(components);
    };
    return {
      find: find,
      filter: filter,
      register: register,
      unregister: unregister,
      getById: getById
    };
  }

  var takeover = function takeover(root) {
    var isAboveRoot = function isAboveRoot(el) {
      return parent(root.element()).fold(function () {
        return true;
      }, function (parent) {
        return eq(el, parent);
      });
    };
    var registry = Registry();
    var lookup = function lookup(eventName, target) {
      return registry.find(isAboveRoot, eventName, target);
    };
    var domEvents = setup$2(root.element(), {
      triggerEvent: function triggerEvent(eventName, event) {
        return monitorEvent(eventName, event.target(), function (logger) {
          return triggerUntilStopped(lookup, eventName, event, logger);
        });
      }
    });
    var systemApi = {
      debugInfo: constant('real'),
      triggerEvent: function triggerEvent(eventName, target, data) {
        monitorEvent(eventName, target, function (logger) {
          triggerOnUntilStopped(lookup, eventName, data, target, logger);
        });
      },
      triggerFocus: function triggerFocus(target, originator) {
        read$2(target).fold(function () {
          focus$1(target);
        }, function (_alloyId) {
          monitorEvent(focus(), target, function (logger) {
            triggerHandler(lookup, focus(), {
              originator: constant(originator),
              kill: noop,
              prevent: noop,
              target: constant(target)
            }, target, logger);
          });
        });
      },
      triggerEscape: function triggerEscape(comp, simulatedEvent) {
        systemApi.triggerEvent('keydown', comp.element(), simulatedEvent.event());
      },
      getByUid: function getByUid(uid) {
        return _getByUid(uid);
      },
      getByDom: function getByDom(elem) {
        return _getByDom(elem);
      },
      build: build$1,
      addToGui: function addToGui(c) {
        add(c);
      },
      removeFromGui: function removeFromGui(c) {
        remove$1(c);
      },
      addToWorld: function addToWorld(c) {
        _addToWorld(c);
      },
      removeFromWorld: function removeFromWorld(c) {
        _removeFromWorld(c);
      },
      broadcast: function broadcast(message) {
        broadcast$1(message);
      },
      broadcastOn: function broadcastOn(channels, message) {
        _broadcastOn(channels, message);
      },
      broadcastEvent: function broadcastEvent(eventName, event) {
        _broadcastEvent(eventName, event);
      },
      isConnected: constant(true)
    };
    var _addToWorld = function _addToWorld(component) {
      component.connect(systemApi);
      if (!isText(component.element())) {
        registry.register(component);
        each$1(component.components(), _addToWorld);
        systemApi.triggerEvent(systemInit(), component.element(), { target: constant(component.element()) });
      }
    };
    var _removeFromWorld = function _removeFromWorld(component) {
      if (!isText(component.element())) {
        each$1(component.components(), _removeFromWorld);
        registry.unregister(component);
      }
      component.disconnect();
    };
    var add = function add(component) {
      attach$1(root, component);
    };
    var remove$1 = function remove$1(component) {
      detach(component);
    };
    var destroy = function destroy() {
      domEvents.unbind();
      remove(root.element());
    };
    var broadcastData = function broadcastData(data) {
      var receivers = registry.filter(receive());
      each$1(receivers, function (receiver) {
        var descHandler = receiver.descHandler();
        var handler = getCurried(descHandler);
        handler(data);
      });
    };
    var broadcast$1 = function broadcast$1(message) {
      broadcastData({
        universal: constant(true),
        data: constant(message)
      });
    };
    var _broadcastOn = function _broadcastOn(channels, message) {
      broadcastData({
        universal: constant(false),
        channels: constant(channels),
        data: constant(message)
      });
    };
    var _broadcastEvent = function _broadcastEvent(eventName, event) {
      var listeners = registry.filter(eventName);
      return broadcast(listeners, event);
    };
    var _getByUid = function _getByUid(uid) {
      return registry.getById(uid).fold(function () {
        return Result.error(new Error('Could not find component with uid: "' + uid + '" in system.'));
      }, Result.value);
    };
    var _getByDom = function _getByDom(elem) {
      var uid = read$2(elem).getOr('not found');
      return _getByUid(uid);
    };
    _addToWorld(root);
    return {
      root: constant(root),
      element: root.element,
      destroy: destroy,
      add: add,
      remove: remove$1,
      getByUid: _getByUid,
      getByDom: _getByDom,
      addToWorld: _addToWorld,
      removeFromWorld: _removeFromWorld,
      broadcast: broadcast$1,
      broadcastOn: _broadcastOn,
      broadcastEvent: _broadcastEvent
    };
  };

  var READ_ONLY_MODE_CLASS = constant(Styles.resolve('readonly-mode'));
  var EDIT_MODE_CLASS = constant(Styles.resolve('edit-mode'));
  function OuterContainer(spec) {
    var root = build$1(Container.sketch({
      dom: { classes: [Styles.resolve('outer-container')].concat(spec.classes) },
      containerBehaviours: derive$1([Swapping.config({
        alpha: READ_ONLY_MODE_CLASS(),
        omega: EDIT_MODE_CLASS()
      })])
    }));
    return takeover(root);
  }

  function AndroidRealm(scrollIntoView) {
    var alloy = OuterContainer({ classes: [Styles.resolve('android-container')] });
    var toolbar = ScrollingToolbar();
    var webapp = api$2();
    var switchToEdit = CommonRealm.makeEditSwitch(webapp);
    var socket = CommonRealm.makeSocket();
    var dropup = build$2(noop, scrollIntoView);
    alloy.add(toolbar.wrapper());
    alloy.add(socket);
    alloy.add(dropup.component());
    var setToolbarGroups = function setToolbarGroups(rawGroups) {
      var groups = toolbar.createGroups(rawGroups);
      toolbar.setGroups(groups);
    };
    var setContextToolbar = function setContextToolbar(rawGroups) {
      var groups = toolbar.createGroups(rawGroups);
      toolbar.setContextToolbar(groups);
    };
    var focusToolbar = function focusToolbar() {
      toolbar.focus();
    };
    var restoreToolbar = function restoreToolbar() {
      toolbar.restoreToolbar();
    };
    var init = function init(spec) {
      webapp.set(AndroidWebapp.produce(spec));
    };
    var exit = function exit() {
      webapp.run(function (w) {
        w.exit();
        Replacing.remove(socket, switchToEdit);
      });
    };
    var updateMode = function updateMode(readOnly) {
      CommonRealm.updateMode(socket, switchToEdit, readOnly, alloy.root());
    };
    return {
      system: constant(alloy),
      element: alloy.element,
      init: init,
      exit: exit,
      setToolbarGroups: setToolbarGroups,
      setContextToolbar: setContextToolbar,
      focusToolbar: focusToolbar,
      restoreToolbar: restoreToolbar,
      updateMode: updateMode,
      socket: constant(socket),
      dropup: constant(dropup)
    };
  }

  var input$1 = function input$1(parent, operation) {
    var input = Element.fromTag('input');
    setAll$1(input, {
      opacity: '0',
      position: 'absolute',
      top: '-1000px',
      left: '-1000px'
    });
    append(parent, input);
    focus$1(input);
    operation(input);
    remove(input);
  };
  var CaptureBin = { input: input$1 };

  var refreshInput = function refreshInput(input) {
    var start = input.dom().selectionStart;
    var end = input.dom().selectionEnd;
    var dir = input.dom().selectionDirection;
    global$4.setTimeout(function () {
      input.dom().setSelectionRange(start, end, dir);
      focus$1(input);
    }, 50);
  };
  var refresh$1 = function refresh$1(winScope) {
    var sel = winScope.getSelection();
    if (sel.rangeCount > 0) {
      var br = sel.getRangeAt(0);
      var r = winScope.document.createRange();
      r.setStart(br.startContainer, br.startOffset);
      r.setEnd(br.endContainer, br.endOffset);
      sel.removeAllRanges();
      sel.addRange(r);
    }
  };
  var CursorRefresh = {
    refreshInput: refreshInput,
    refresh: refresh$1
  };

  var resume$1 = function resume$1(cWin, frame) {
    active().each(function (active) {
      if (!eq(active, frame)) {
        blur(active);
      }
    });
    cWin.focus();
    focus$1(Element.fromDom(cWin.document.body));
    CursorRefresh.refresh(cWin);
  };
  var ResumeEditing$1 = { resume: resume$1 };

  var stubborn = function stubborn(outerBody, cWin, page, frame) {
    var toEditing = function toEditing() {
      ResumeEditing$1.resume(cWin, frame);
    };
    var toReading = function toReading() {
      CaptureBin.input(outerBody, blur);
    };
    var captureInput = bind$3(page, 'keydown', function (evt) {
      if (!contains(['input', 'textarea'], name(evt.target()))) {
        toEditing();
      }
    });
    var onToolbarTouch = function onToolbarTouch() {};
    var destroy = function destroy() {
      captureInput.unbind();
    };
    return {
      toReading: toReading,
      toEditing: toEditing,
      onToolbarTouch: onToolbarTouch,
      destroy: destroy
    };
  };
  var timid = function timid(outerBody, cWin, page, frame) {
    var dismissKeyboard = function dismissKeyboard() {
      blur(frame);
    };
    var onToolbarTouch = function onToolbarTouch() {
      dismissKeyboard();
    };
    var toReading = function toReading() {
      dismissKeyboard();
    };
    var toEditing = function toEditing() {
      ResumeEditing$1.resume(cWin, frame);
    };
    return {
      toReading: toReading,
      toEditing: toEditing,
      onToolbarTouch: onToolbarTouch,
      destroy: noop
    };
  };
  var IosKeyboard = {
    stubborn: stubborn,
    timid: timid
  };

  var initEvents$1 = function initEvents$1(editorApi, iosApi, toolstrip, socket, dropup) {
    var saveSelectionFirst = function saveSelectionFirst() {
      iosApi.run(function (api) {
        api.highlightSelection();
      });
    };
    var refreshIosSelection = function refreshIosSelection() {
      iosApi.run(function (api) {
        api.refreshSelection();
      });
    };
    var scrollToY = function scrollToY(yTop, height) {
      var y = yTop - socket.dom().scrollTop;
      iosApi.run(function (api) {
        api.scrollIntoView(y, y + height);
      });
    };
    var scrollToElement = function scrollToElement(target) {
      scrollToY(iosApi, socket);
    };
    var scrollToCursor = function scrollToCursor() {
      editorApi.getCursorBox().each(function (box) {
        scrollToY(box.top(), box.height());
      });
    };
    var clearSelection = function clearSelection() {
      iosApi.run(function (api) {
        api.clearSelection();
      });
    };
    var clearAndRefresh = function clearAndRefresh() {
      clearSelection();
      refreshThrottle.throttle();
    };
    var refreshView = function refreshView() {
      scrollToCursor();
      iosApi.run(function (api) {
        api.syncHeight();
      });
    };
    var reposition = function reposition() {
      var toolbarHeight = get$4(toolstrip);
      iosApi.run(function (api) {
        api.setViewportOffset(toolbarHeight);
      });
      refreshIosSelection();
      refreshView();
    };
    var toEditing = function toEditing() {
      iosApi.run(function (api) {
        api.toEditing();
      });
    };
    var toReading = function toReading() {
      iosApi.run(function (api) {
        api.toReading();
      });
    };
    var onToolbarTouch = function onToolbarTouch(event) {
      iosApi.run(function (api) {
        api.onToolbarTouch(event);
      });
    };
    var tapping = TappingEvent.monitor(editorApi);
    var refreshThrottle = last$1(refreshView, 300);
    var listeners = [editorApi.onKeyup(clearAndRefresh), editorApi.onNodeChanged(refreshIosSelection), editorApi.onDomChanged(refreshThrottle.throttle), editorApi.onDomChanged(refreshIosSelection), editorApi.onScrollToCursor(function (tinyEvent) {
      tinyEvent.preventDefault();
      refreshThrottle.throttle();
    }), editorApi.onScrollToElement(function (event) {
      scrollToElement(event.element());
    }), editorApi.onToEditing(toEditing), editorApi.onToReading(toReading), bind$3(editorApi.doc(), 'touchend', function (touchEvent) {
      if (eq(editorApi.html(), touchEvent.target()) || eq(editorApi.body(), touchEvent.target())) ;
    }), bind$3(toolstrip, 'transitionend', function (transitionEvent) {
      if (transitionEvent.raw().propertyName === 'height') {
        reposition();
      }
    }), capture$1(toolstrip, 'touchstart', function (touchEvent) {
      saveSelectionFirst();
      onToolbarTouch(touchEvent);
      editorApi.onTouchToolstrip();
    }), bind$3(editorApi.body(), 'touchstart', function (evt) {
      clearSelection();
      editorApi.onTouchContent();
      tapping.fireTouchstart(evt);
    }), tapping.onTouchmove(), tapping.onTouchend(), bind$3(editorApi.body(), 'click', function (event) {
      event.kill();
    }), bind$3(toolstrip, 'touchmove', function () {
      editorApi.onToolbarScrollStart();
    })];
    var destroy = function destroy() {
      each$1(listeners, function (l) {
        l.unbind();
      });
    };
    return { destroy: destroy };
  };
  var IosEvents = { initEvents: initEvents$1 };

  function FakeSelection(win, frame) {
    var doc = win.document;
    var container = Element.fromTag('div');
    add$2(container, Styles.resolve('unfocused-selections'));
    append(Element.fromDom(doc.documentElement), container);
    var onTouch = bind$3(container, 'touchstart', function (event) {
      event.prevent();
      ResumeEditing$1.resume(win, frame);
      clear();
    });
    var make = function make(rectangle) {
      var span = Element.fromTag('span');
      add$3(span, [Styles.resolve('layer-editor'), Styles.resolve('unfocused-selection')]);
      setAll$1(span, {
        left: rectangle.left() + 'px',
        top: rectangle.top() + 'px',
        width: rectangle.width() + 'px',
        height: rectangle.height() + 'px'
      });
      return span;
    };
    var update = function update() {
      clear();
      var rectangles = Rectangles.getRectangles(win);
      var spans = map$1(rectangles, make);
      append$1(container, spans);
    };
    var clear = function clear() {
      empty(container);
    };
    var destroy = function destroy() {
      onTouch.unbind();
      remove(container);
    };
    var isActive = function isActive() {
      return children(container).length > 0;
    };
    return {
      update: update,
      isActive: isActive,
      destroy: destroy,
      clear: clear
    };
  }

  var exports$1 = {},
      module = { exports: exports$1 };
  (function (define, exports, module, require) {
    (function (f) {
      if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined') {
        module.exports = f();
      } else if (typeof define === 'function' && define.amd) {
        define([], f);
      } else {
        var g;
        if (typeof window !== 'undefined') {
          g = window;
        } else if (typeof global !== 'undefined') {
          g = global;
        } else if (typeof self !== 'undefined') {
          g = self;
        } else {
          g = this;
        }
        g.EphoxContactWrapper = f();
      }
    })(function () {
      return function () {
        function r(e, n, t) {
          function o(i, f) {
            if (!n[i]) {
              if (!e[i]) {
                var c = 'function' == typeof require && require;
                if (!f && c) return c(i, !0);
                if (u) return u(i, !0);
                var a = new Error('Cannot find module \'' + i + '\'');
                throw a.code = 'MODULE_NOT_FOUND', a;
              }
              var p = n[i] = { exports: {} };
              e[i][0].call(p.exports, function (r) {
                var n = e[i][1][r];
                return o(n || r);
              }, p, p.exports, r, e, n, t);
            }
            return n[i].exports;
          }
          for (var u = 'function' == typeof require && require, i = 0; i < t.length; i++) {
            o(t[i]);
          }return o;
        }
        return r;
      }()({
        1: [function (require, module, exports) {
          var process = module.exports = {};
          var cachedSetTimeout;
          var cachedClearTimeout;
          function defaultSetTimout() {
            throw new Error('setTimeout has not been defined');
          }
          function defaultClearTimeout() {
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
          })();
          function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
              return setTimeout(fun, 0);
            }
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
              cachedSetTimeout = setTimeout;
              return setTimeout(fun, 0);
            }
            try {
              return cachedSetTimeout(fun, 0);
            } catch (e) {
              try {
                return cachedSetTimeout.call(null, fun, 0);
              } catch (e) {
                return cachedSetTimeout.call(this, fun, 0);
              }
            }
          }
          function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
              return clearTimeout(marker);
            }
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
              cachedClearTimeout = clearTimeout;
              return clearTimeout(marker);
            }
            try {
              return cachedClearTimeout(marker);
            } catch (e) {
              try {
                return cachedClearTimeout.call(null, marker);
              } catch (e) {
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
            while (len) {
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
          process.version = '';
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
          process.listeners = function (name) {
            return [];
          };
          process.binding = function (name) {
            throw new Error('process.binding is not supported');
          };
          process.cwd = function () {
            return '/';
          };
          process.chdir = function (dir) {
            throw new Error('process.chdir is not supported');
          };
          process.umask = function () {
            return 0;
          };
        }, {}],
        2: [function (require, module, exports) {
          (function (setImmediate) {
            (function (root) {
              var setTimeoutFunc = setTimeout;
              function noop() {}
              function bind(fn, thisArg) {
                return function () {
                  fn.apply(thisArg, arguments);
                };
              }
              function Promise(fn) {
                if (_typeof(this) !== 'object') throw new TypeError('Promises must be constructed via new');
                if (typeof fn !== 'function') throw new TypeError('not a function');
                this._state = 0;
                this._handled = false;
                this._value = undefined;
                this._deferreds = [];
                doResolve(fn, this);
              }
              function handle(self, deferred) {
                while (self._state === 3) {
                  self = self._value;
                }
                if (self._state === 0) {
                  self._deferreds.push(deferred);
                  return;
                }
                self._handled = true;
                Promise._immediateFn(function () {
                  var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
                  if (cb === null) {
                    (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
                    return;
                  }
                  var ret;
                  try {
                    ret = cb(self._value);
                  } catch (e) {
                    reject(deferred.promise, e);
                    return;
                  }
                  resolve(deferred.promise, ret);
                });
              }
              function resolve(self, newValue) {
                try {
                  if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
                  if (newValue && ((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) === 'object' || typeof newValue === 'function')) {
                    var then = newValue.then;
                    if (newValue instanceof Promise) {
                      self._state = 3;
                      self._value = newValue;
                      finale(self);
                      return;
                    } else if (typeof then === 'function') {
                      doResolve(bind(then, newValue), self);
                      return;
                    }
                  }
                  self._state = 1;
                  self._value = newValue;
                  finale(self);
                } catch (e) {
                  reject(self, e);
                }
              }
              function reject(self, newValue) {
                self._state = 2;
                self._value = newValue;
                finale(self);
              }
              function finale(self) {
                if (self._state === 2 && self._deferreds.length === 0) {
                  Promise._immediateFn(function () {
                    if (!self._handled) {
                      Promise._unhandledRejectionFn(self._value);
                    }
                  });
                }
                for (var i = 0, len = self._deferreds.length; i < len; i++) {
                  handle(self, self._deferreds[i]);
                }
                self._deferreds = null;
              }
              function Handler(onFulfilled, onRejected, promise) {
                this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
                this.onRejected = typeof onRejected === 'function' ? onRejected : null;
                this.promise = promise;
              }
              function doResolve(fn, self) {
                var done = false;
                try {
                  fn(function (value) {
                    if (done) return;
                    done = true;
                    resolve(self, value);
                  }, function (reason) {
                    if (done) return;
                    done = true;
                    reject(self, reason);
                  });
                } catch (ex) {
                  if (done) return;
                  done = true;
                  reject(self, ex);
                }
              }
              Promise.prototype['catch'] = function (onRejected) {
                return this.then(null, onRejected);
              };
              Promise.prototype.then = function (onFulfilled, onRejected) {
                var prom = new this.constructor(noop);
                handle(this, new Handler(onFulfilled, onRejected, prom));
                return prom;
              };
              Promise.all = function (arr) {
                var args = Array.prototype.slice.call(arr);
                return new Promise(function (resolve, reject) {
                  if (args.length === 0) return resolve([]);
                  var remaining = args.length;
                  function res(i, val) {
                    try {
                      if (val && ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' || typeof val === 'function')) {
                        var then = val.then;
                        if (typeof then === 'function') {
                          then.call(val, function (val) {
                            res(i, val);
                          }, reject);
                          return;
                        }
                      }
                      args[i] = val;
                      if (--remaining === 0) {
                        resolve(args);
                      }
                    } catch (ex) {
                      reject(ex);
                    }
                  }
                  for (var i = 0; i < args.length; i++) {
                    res(i, args[i]);
                  }
                });
              };
              Promise.resolve = function (value) {
                if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.constructor === Promise) {
                  return value;
                }
                return new Promise(function (resolve) {
                  resolve(value);
                });
              };
              Promise.reject = function (value) {
                return new Promise(function (resolve, reject) {
                  reject(value);
                });
              };
              Promise.race = function (values) {
                return new Promise(function (resolve, reject) {
                  for (var i = 0, len = values.length; i < len; i++) {
                    values[i].then(resolve, reject);
                  }
                });
              };
              Promise._immediateFn = typeof setImmediate === 'function' ? function (fn) {
                setImmediate(fn);
              } : function (fn) {
                setTimeoutFunc(fn, 0);
              };
              Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
                if (typeof console !== 'undefined' && console) {
                  console.warn('Possible Unhandled Promise Rejection:', err);
                }
              };
              Promise._setImmediateFn = function _setImmediateFn(fn) {
                Promise._immediateFn = fn;
              };
              Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
                Promise._unhandledRejectionFn = fn;
              };
              if (typeof module !== 'undefined' && module.exports) {
                module.exports = Promise;
              } else if (!root.Promise) {
                root.Promise = Promise;
              }
            })(this);
          }).call(this, require('timers').setImmediate);
        }, { 'timers': 3 }],
        3: [function (require, module, exports) {
          (function (setImmediate, clearImmediate) {
            var nextTick = require('process/browser.js').nextTick;
            var apply = Function.prototype.apply;
            var slice = Array.prototype.slice;
            var immediateIds = {};
            var nextImmediateId = 0;
            exports.setTimeout = function () {
              return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
            };
            exports.setInterval = function () {
              return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
            };
            exports.clearTimeout = exports.clearInterval = function (timeout) {
              timeout.close();
            };
            function Timeout(id, clearFn) {
              this._id = id;
              this._clearFn = clearFn;
            }
            Timeout.prototype.unref = Timeout.prototype.ref = function () {};
            Timeout.prototype.close = function () {
              this._clearFn.call(window, this._id);
            };
            exports.enroll = function (item, msecs) {
              clearTimeout(item._idleTimeoutId);
              item._idleTimeout = msecs;
            };
            exports.unenroll = function (item) {
              clearTimeout(item._idleTimeoutId);
              item._idleTimeout = -1;
            };
            exports._unrefActive = exports.active = function (item) {
              clearTimeout(item._idleTimeoutId);
              var msecs = item._idleTimeout;
              if (msecs >= 0) {
                item._idleTimeoutId = setTimeout(function onTimeout() {
                  if (item._onTimeout) item._onTimeout();
                }, msecs);
              }
            };
            exports.setImmediate = typeof setImmediate === 'function' ? setImmediate : function (fn) {
              var id = nextImmediateId++;
              var args = arguments.length < 2 ? false : slice.call(arguments, 1);
              immediateIds[id] = true;
              nextTick(function onNextTick() {
                if (immediateIds[id]) {
                  if (args) {
                    fn.apply(null, args);
                  } else {
                    fn.call(null);
                  }
                  exports.clearImmediate(id);
                }
              });
              return id;
            };
            exports.clearImmediate = typeof clearImmediate === 'function' ? clearImmediate : function (id) {
              delete immediateIds[id];
            };
          }).call(this, require('timers').setImmediate, require('timers').clearImmediate);
        }, {
          'process/browser.js': 1,
          'timers': 3
        }],
        4: [function (require, module, exports) {
          var promisePolyfill = require('promise-polyfill');
          var Global = function () {
            if (typeof window !== 'undefined') {
              return window;
            } else {
              return Function('return this;')();
            }
          }();
          module.exports = { boltExport: Global.Promise || promisePolyfill };
        }, { 'promise-polyfill': 2 }]
      }, {}, [4])(4);
    });
  })(undefined, exports$1, module, undefined);
  var Promise$1 = module.exports.boltExport;

  var nu$7 = function nu$7(baseFn) {
    var data = Option.none();
    var callbacks = [];
    var map = function map(f) {
      return nu$7(function (nCallback) {
        get(function (data) {
          nCallback(f(data));
        });
      });
    };
    var get = function get(nCallback) {
      if (isReady()) {
        call(nCallback);
      } else {
        callbacks.push(nCallback);
      }
    };
    var set = function set(x) {
      data = Option.some(x);
      run(callbacks);
      callbacks = [];
    };
    var isReady = function isReady() {
      return data.isSome();
    };
    var run = function run(cbs) {
      each$1(cbs, call);
    };
    var call = function call(cb) {
      data.each(function (x) {
        domGlobals.setTimeout(function () {
          cb(x);
        }, 0);
      });
    };
    baseFn(set);
    return {
      get: get,
      map: map,
      isReady: isReady
    };
  };
  var pure$1 = function pure$1(a) {
    return nu$7(function (callback) {
      callback(a);
    });
  };
  var LazyValue = {
    nu: nu$7,
    pure: pure$1
  };

  var errorReporter = function errorReporter(err) {
    domGlobals.setTimeout(function () {
      throw err;
    }, 0);
  };
  var make$4 = function make$4(run) {
    var get = function get(callback) {
      run().then(callback, errorReporter);
    };
    var map = function map(fab) {
      return make$4(function () {
        return run().then(fab);
      });
    };
    var bind = function bind(aFutureB) {
      return make$4(function () {
        return run().then(function (v) {
          return aFutureB(v).toPromise();
        });
      });
    };
    var anonBind = function anonBind(futureB) {
      return make$4(function () {
        return run().then(function () {
          return futureB.toPromise();
        });
      });
    };
    var toLazy = function toLazy() {
      return LazyValue.nu(get);
    };
    var toCached = function toCached() {
      var cache = null;
      return make$4(function () {
        if (cache === null) {
          cache = run();
        }
        return cache;
      });
    };
    var toPromise = run;
    return {
      map: map,
      bind: bind,
      anonBind: anonBind,
      toLazy: toLazy,
      toCached: toCached,
      toPromise: toPromise,
      get: get
    };
  };
  var nu$8 = function nu$8(baseFn) {
    return make$4(function () {
      return new Promise$1(baseFn);
    });
  };
  var pure$2 = function pure$2(a) {
    return make$4(function () {
      return Promise$1.resolve(a);
    });
  };
  var Future = {
    nu: nu$8,
    pure: pure$2
  };

  var adjust = function adjust(value, destination, amount) {
    if (Math.abs(value - destination) <= amount) {
      return Option.none();
    } else if (value < destination) {
      return Option.some(value + amount);
    } else {
      return Option.some(value - amount);
    }
  };
  var create$5 = function create$5() {
    var interval = null;
    var animate = function animate(getCurrent, destination, amount, increment, doFinish, rate) {
      var finished = false;
      var finish = function finish(v) {
        finished = true;
        doFinish(v);
      };
      global$4.clearInterval(interval);
      var abort = function abort(v) {
        global$4.clearInterval(interval);
        finish(v);
      };
      interval = global$4.setInterval(function () {
        var value = getCurrent();
        adjust(value, destination, amount).fold(function () {
          global$4.clearInterval(interval);
          finish(destination);
        }, function (s) {
          increment(s, abort);
          if (!finished) {
            var newValue = getCurrent();
            if (newValue !== s || Math.abs(newValue - destination) > Math.abs(value - destination)) {
              global$4.clearInterval(interval);
              finish(destination);
            }
          }
        });
      }, rate);
    };
    return { animate: animate };
  };
  var SmoothAnimation = {
    create: create$5,
    adjust: adjust
  };

  var findDevice = function findDevice(deviceWidth, deviceHeight) {
    var devices = [{
      width: 320,
      height: 480,
      keyboard: {
        portrait: 300,
        landscape: 240
      }
    }, {
      width: 320,
      height: 568,
      keyboard: {
        portrait: 300,
        landscape: 240
      }
    }, {
      width: 375,
      height: 667,
      keyboard: {
        portrait: 305,
        landscape: 240
      }
    }, {
      width: 414,
      height: 736,
      keyboard: {
        portrait: 320,
        landscape: 240
      }
    }, {
      width: 768,
      height: 1024,
      keyboard: {
        portrait: 320,
        landscape: 400
      }
    }, {
      width: 1024,
      height: 1366,
      keyboard: {
        portrait: 380,
        landscape: 460
      }
    }];
    return findMap(devices, function (device) {
      return someIf(deviceWidth <= device.width && deviceHeight <= device.height, device.keyboard);
    }).getOr({
      portrait: deviceHeight / 5,
      landscape: deviceWidth / 4
    });
  };

  var softKeyboardLimits = function softKeyboardLimits(outerWindow) {
    return findDevice(outerWindow.screen.width, outerWindow.screen.height);
  };
  var accountableKeyboardHeight = function accountableKeyboardHeight(outerWindow) {
    var portrait = Orientation.get(outerWindow).isPortrait();
    var limits = softKeyboardLimits(outerWindow);
    var keyboard = portrait ? limits.portrait : limits.landscape;
    var visualScreenHeight = portrait ? outerWindow.screen.height : outerWindow.screen.width;
    return visualScreenHeight - outerWindow.innerHeight > keyboard ? 0 : keyboard;
  };
  var getGreenzone = function getGreenzone(socket, dropup) {
    var outerWindow = owner(socket).dom().defaultView;
    var viewportHeight = get$4(socket) + get$4(dropup);
    var acc = accountableKeyboardHeight(outerWindow);
    return viewportHeight - acc;
  };
  var updatePadding = function updatePadding(contentBody, socket, dropup) {
    var greenzoneHeight = getGreenzone(socket, dropup);
    var deltaHeight = get$4(socket) + get$4(dropup) - greenzoneHeight;
    set$3(contentBody, 'padding-bottom', deltaHeight + 'px');
  };
  var DeviceZones = {
    getGreenzone: getGreenzone,
    updatePadding: updatePadding
  };

  var fixture = Adt.generate([{
    fixed: ['element', 'property', 'offsetY']
  }, {
    scroller: ['element', 'offsetY']
  }]);
  var yFixedData = 'data-' + Styles.resolve('position-y-fixed');
  var yFixedProperty = 'data-' + Styles.resolve('y-property');
  var yScrollingData = 'data-' + Styles.resolve('scrolling');
  var windowSizeData = 'data-' + Styles.resolve('last-window-height');
  var getYFixedData = function getYFixedData(element) {
    return DataAttributes.safeParse(element, yFixedData);
  };
  var getYFixedProperty = function getYFixedProperty(element) {
    return get(element, yFixedProperty);
  };
  var getLastWindowSize = function getLastWindowSize(element) {
    return DataAttributes.safeParse(element, windowSizeData);
  };
  var classifyFixed = function classifyFixed(element, offsetY) {
    var prop = getYFixedProperty(element);
    return fixture.fixed(element, prop, offsetY);
  };
  var classifyScrolling = function classifyScrolling(element, offsetY) {
    return fixture.scroller(element, offsetY);
  };
  var classify = function classify(element) {
    var offsetY = getYFixedData(element);
    var classifier = get(element, yScrollingData) === 'true' ? classifyScrolling : classifyFixed;
    return classifier(element, offsetY);
  };
  var findFixtures = function findFixtures(container) {
    var candidates = descendants(container, '[' + yFixedData + ']');
    return map$1(candidates, classify);
  };
  var takeoverToolbar = function takeoverToolbar(toolbar) {
    var oldToolbarStyle = get(toolbar, 'style');
    setAll$1(toolbar, {
      position: 'absolute',
      top: '0px'
    });
    set(toolbar, yFixedData, '0px');
    set(toolbar, yFixedProperty, 'top');
    var restore = function restore() {
      set(toolbar, 'style', oldToolbarStyle || '');
      remove$1(toolbar, yFixedData);
      remove$1(toolbar, yFixedProperty);
    };
    return { restore: restore };
  };
  var takeoverViewport = function takeoverViewport(toolbarHeight, height, viewport) {
    var oldViewportStyle = get(viewport, 'style');
    Scrollable.register(viewport);
    setAll$1(viewport, {
      position: 'absolute',
      height: height + 'px',
      width: '100%',
      top: toolbarHeight + 'px'
    });
    set(viewport, yFixedData, toolbarHeight + 'px');
    set(viewport, yScrollingData, 'true');
    set(viewport, yFixedProperty, 'top');
    var restore = function restore() {
      Scrollable.deregister(viewport);
      set(viewport, 'style', oldViewportStyle || '');
      remove$1(viewport, yFixedData);
      remove$1(viewport, yScrollingData);
      remove$1(viewport, yFixedProperty);
    };
    return { restore: restore };
  };
  var takeoverDropup = function takeoverDropup(dropup, toolbarHeight, viewportHeight) {
    var oldDropupStyle = get(dropup, 'style');
    setAll$1(dropup, {
      position: 'absolute',
      bottom: '0px'
    });
    set(dropup, yFixedData, '0px');
    set(dropup, yFixedProperty, 'bottom');
    var restore = function restore() {
      set(dropup, 'style', oldDropupStyle || '');
      remove$1(dropup, yFixedData);
      remove$1(dropup, yFixedProperty);
    };
    return { restore: restore };
  };
  var deriveViewportHeight = function deriveViewportHeight(viewport, toolbarHeight, dropupHeight) {
    var outerWindow = owner(viewport).dom().defaultView;
    var winH = outerWindow.innerHeight;
    set(viewport, windowSizeData, winH + 'px');
    return winH - toolbarHeight - dropupHeight;
  };
  var takeover$1 = function takeover$1(viewport, contentBody, toolbar, dropup) {
    var outerWindow = owner(viewport).dom().defaultView;
    var toolbarSetup = takeoverToolbar(toolbar);
    var toolbarHeight = get$4(toolbar);
    var dropupHeight = get$4(dropup);
    var viewportHeight = deriveViewportHeight(viewport, toolbarHeight, dropupHeight);
    var viewportSetup = takeoverViewport(toolbarHeight, viewportHeight, viewport);
    var dropupSetup = takeoverDropup(dropup);
    var isActive = true;
    var restore = function restore() {
      isActive = false;
      toolbarSetup.restore();
      viewportSetup.restore();
      dropupSetup.restore();
    };
    var isExpanding = function isExpanding() {
      var currentWinHeight = outerWindow.innerHeight;
      var lastWinHeight = getLastWindowSize(viewport);
      return currentWinHeight > lastWinHeight;
    };
    var refresh = function refresh() {
      if (isActive) {
        var newToolbarHeight = get$4(toolbar);
        var dropupHeight_1 = get$4(dropup);
        var newHeight = deriveViewportHeight(viewport, newToolbarHeight, dropupHeight_1);
        set(viewport, yFixedData, newToolbarHeight + 'px');
        set$3(viewport, 'height', newHeight + 'px');
        DeviceZones.updatePadding(contentBody, viewport, dropup);
      }
    };
    var setViewportOffset = function setViewportOffset(newYOffset) {
      var offsetPx = newYOffset + 'px';
      set(viewport, yFixedData, offsetPx);
      refresh();
    };
    DeviceZones.updatePadding(contentBody, viewport, dropup);
    return {
      setViewportOffset: setViewportOffset,
      isExpanding: isExpanding,
      isShrinking: not(isExpanding),
      refresh: refresh,
      restore: restore
    };
  };
  var IosViewport = {
    findFixtures: findFixtures,
    takeover: takeover$1,
    getYFixedData: getYFixedData
  };

  var animator = SmoothAnimation.create();
  var ANIMATION_STEP = 15;
  var NUM_TOP_ANIMATION_FRAMES = 10;
  var ANIMATION_RATE = 10;
  var lastScroll = 'data-' + Styles.resolve('last-scroll-top');
  var getTop = function getTop(element) {
    var raw = getRaw(element, 'top').getOr('0');
    return parseInt(raw, 10);
  };
  var getScrollTop = function getScrollTop(element) {
    return parseInt(element.dom().scrollTop, 10);
  };
  var moveScrollAndTop = function moveScrollAndTop(element, destination, finalTop) {
    return Future.nu(function (callback) {
      var getCurrent = curry(getScrollTop, element);
      var update = function update(newScroll) {
        element.dom().scrollTop = newScroll;
        set$3(element, 'top', getTop(element) + ANIMATION_STEP + 'px');
      };
      var finish = function finish() {
        element.dom().scrollTop = destination;
        set$3(element, 'top', finalTop + 'px');
        callback(destination);
      };
      animator.animate(getCurrent, destination, ANIMATION_STEP, update, finish, ANIMATION_RATE);
    });
  };
  var moveOnlyScroll = function moveOnlyScroll(element, destination) {
    return Future.nu(function (callback) {
      var getCurrent = curry(getScrollTop, element);
      set(element, lastScroll, getCurrent());
      var update = function update(newScroll, abort) {
        var previous = DataAttributes.safeParse(element, lastScroll);
        if (previous !== element.dom().scrollTop) {
          abort(element.dom().scrollTop);
        } else {
          element.dom().scrollTop = newScroll;
          set(element, lastScroll, newScroll);
        }
      };
      var finish = function finish() {
        element.dom().scrollTop = destination;
        set(element, lastScroll, destination);
        callback(destination);
      };
      var distance = Math.abs(destination - getCurrent());
      var step = Math.ceil(distance / NUM_TOP_ANIMATION_FRAMES);
      animator.animate(getCurrent, destination, step, update, finish, ANIMATION_RATE);
    });
  };
  var moveOnlyTop = function moveOnlyTop(element, destination) {
    return Future.nu(function (callback) {
      var getCurrent = curry(getTop, element);
      var update = function update(newTop) {
        set$3(element, 'top', newTop + 'px');
      };
      var finish = function finish() {
        update(destination);
        callback(destination);
      };
      var distance = Math.abs(destination - getCurrent());
      var step = Math.ceil(distance / NUM_TOP_ANIMATION_FRAMES);
      animator.animate(getCurrent, destination, step, update, finish, ANIMATION_RATE);
    });
  };
  var updateTop = function updateTop(element, amount) {
    var newTop = amount + IosViewport.getYFixedData(element) + 'px';
    set$3(element, 'top', newTop);
  };
  var moveWindowScroll = function moveWindowScroll(toolbar, viewport, destY) {
    var outerWindow = owner(toolbar).dom().defaultView;
    return Future.nu(function (callback) {
      updateTop(toolbar, destY);
      updateTop(viewport, destY);
      outerWindow.scrollTo(0, destY);
      callback(destY);
    });
  };
  var IosScrolling = {
    moveScrollAndTop: moveScrollAndTop,
    moveOnlyScroll: moveOnlyScroll,
    moveOnlyTop: moveOnlyTop,
    moveWindowScroll: moveWindowScroll
  };

  function BackgroundActivity(doAction) {
    var action = Cell(LazyValue.pure({}));
    var start = function start(value) {
      var future = LazyValue.nu(function (callback) {
        return doAction(value).get(callback);
      });
      action.set(future);
    };
    var idle = function idle(g) {
      action.get().get(function () {
        g();
      });
    };
    return {
      start: start,
      idle: idle
    };
  }

  var scrollIntoView = function scrollIntoView(cWin, socket, dropup, top, bottom) {
    var greenzone = DeviceZones.getGreenzone(socket, dropup);
    var refreshCursor = curry(CursorRefresh.refresh, cWin);
    if (top > greenzone || bottom > greenzone) {
      IosScrolling.moveOnlyScroll(socket, socket.dom().scrollTop - greenzone + bottom).get(refreshCursor);
    } else if (top < 0) {
      IosScrolling.moveOnlyScroll(socket, socket.dom().scrollTop + top).get(refreshCursor);
    }
  };
  var Greenzone = { scrollIntoView: scrollIntoView };

  var par = function par(asyncValues, nu) {
    return nu(function (callback) {
      var r = [];
      var count = 0;
      var cb = function cb(i) {
        return function (value) {
          r[i] = value;
          count++;
          if (count >= asyncValues.length) {
            callback(r);
          }
        };
      };
      if (asyncValues.length === 0) {
        callback([]);
      } else {
        each$1(asyncValues, function (asyncValue, i) {
          asyncValue.get(cb(i));
        });
      }
    });
  };

  var par$1 = function par$1(futures) {
    return par(futures, Future.nu);
  };

  var updateFixed = function updateFixed(element, property, winY, offsetY) {
    var destination = winY + offsetY;
    set$3(element, property, destination + 'px');
    return Future.pure(offsetY);
  };
  var updateScrollingFixed = function updateScrollingFixed(element, winY, offsetY) {
    var destTop = winY + offsetY;
    var oldProp = getRaw(element, 'top').getOr(offsetY);
    var delta = destTop - parseInt(oldProp, 10);
    var destScroll = element.dom().scrollTop + delta;
    return IosScrolling.moveScrollAndTop(element, destScroll, destTop);
  };
  var updateFixture = function updateFixture(fixture, winY) {
    return fixture.fold(function (element, property, offsetY) {
      return updateFixed(element, property, winY, offsetY);
    }, function (element, offsetY) {
      return updateScrollingFixed(element, winY, offsetY);
    });
  };
  var updatePositions = function updatePositions(container, winY) {
    var fixtures = IosViewport.findFixtures(container);
    var updates = map$1(fixtures, function (fixture) {
      return updateFixture(fixture, winY);
    });
    return par$1(updates);
  };
  var IosUpdates = { updatePositions: updatePositions };

  var VIEW_MARGIN = 5;
  var register$2 = function register$2(toolstrip, socket, container, outerWindow, structure, cWin) {
    var scroller = BackgroundActivity(function (y) {
      return IosScrolling.moveWindowScroll(toolstrip, socket, y);
    });
    var scrollBounds = function scrollBounds() {
      var rects = Rectangles.getRectangles(cWin);
      return Option.from(rects[0]).bind(function (rect) {
        var viewTop = rect.top() - socket.dom().scrollTop;
        var outside = viewTop > outerWindow.innerHeight + VIEW_MARGIN || viewTop < -VIEW_MARGIN;
        return outside ? Option.some({
          top: constant(viewTop),
          bottom: constant(viewTop + rect.height())
        }) : Option.none();
      });
    };
    var scrollThrottle = last$1(function () {
      scroller.idle(function () {
        IosUpdates.updatePositions(container, outerWindow.pageYOffset).get(function () {
          var extraScroll = scrollBounds();
          extraScroll.each(function (extra) {
            socket.dom().scrollTop = socket.dom().scrollTop + extra.top();
          });
          scroller.start(0);
          structure.refresh();
        });
      });
    }, 1000);
    var onScroll = bind$3(Element.fromDom(outerWindow), 'scroll', function () {
      if (outerWindow.pageYOffset < 0) {
        return;
      }
      scrollThrottle.throttle();
    });
    IosUpdates.updatePositions(container, outerWindow.pageYOffset).get(identity);
    return { unbind: onScroll.unbind };
  };
  var setup$3 = function setup$3(bag) {
    var cWin = bag.cWin();
    var ceBody = bag.ceBody();
    var socket = bag.socket();
    var toolstrip = bag.toolstrip();
    var toolbar = bag.toolbar();
    var contentElement = bag.contentElement();
    var keyboardType = bag.keyboardType();
    var outerWindow = bag.outerWindow();
    var dropup = bag.dropup();
    var structure = IosViewport.takeover(socket, ceBody, toolstrip, dropup);
    var keyboardModel = keyboardType(bag.outerBody(), cWin, body(), contentElement, toolstrip, toolbar);
    var toEditing = function toEditing() {
      keyboardModel.toEditing();
      clearSelection();
    };
    var toReading = function toReading() {
      keyboardModel.toReading();
    };
    var onToolbarTouch = function onToolbarTouch(event) {
      keyboardModel.onToolbarTouch(event);
    };
    var onOrientation = Orientation.onChange(outerWindow, {
      onChange: noop,
      onReady: structure.refresh
    });
    onOrientation.onAdjustment(function () {
      structure.refresh();
    });
    var onResize = bind$3(Element.fromDom(outerWindow), 'resize', function () {
      if (structure.isExpanding()) {
        structure.refresh();
      }
    });
    var onScroll = register$2(toolstrip, socket, bag.outerBody(), outerWindow, structure, cWin);
    var unfocusedSelection = FakeSelection(cWin, contentElement);
    var refreshSelection = function refreshSelection() {
      if (unfocusedSelection.isActive()) {
        unfocusedSelection.update();
      }
    };
    var highlightSelection = function highlightSelection() {
      unfocusedSelection.update();
    };
    var clearSelection = function clearSelection() {
      unfocusedSelection.clear();
    };
    var scrollIntoView = function scrollIntoView(top, bottom) {
      Greenzone.scrollIntoView(cWin, socket, dropup, top, bottom);
    };
    var syncHeight = function syncHeight() {
      set$3(contentElement, 'height', contentElement.dom().contentWindow.document.body.scrollHeight + 'px');
    };
    var setViewportOffset = function setViewportOffset(newYOffset) {
      structure.setViewportOffset(newYOffset);
      IosScrolling.moveOnlyTop(socket, newYOffset).get(identity);
    };
    var destroy = function destroy() {
      structure.restore();
      onOrientation.destroy();
      onScroll.unbind();
      onResize.unbind();
      keyboardModel.destroy();
      unfocusedSelection.destroy();
      CaptureBin.input(body(), blur);
    };
    return {
      toEditing: toEditing,
      toReading: toReading,
      onToolbarTouch: onToolbarTouch,
      refreshSelection: refreshSelection,
      clearSelection: clearSelection,
      highlightSelection: highlightSelection,
      scrollIntoView: scrollIntoView,
      updateToolbarPadding: noop,
      setViewportOffset: setViewportOffset,
      syncHeight: syncHeight,
      refreshStructure: structure.refresh,
      destroy: destroy
    };
  };
  var IosSetup = { setup: setup$3 };

  var create$6 = function create$6(platform, mask) {
    var meta = MetaViewport.tag();
    var priorState = value$2();
    var scrollEvents = value$2();
    var iosApi = api$2();
    var iosEvents = api$2();
    var enter = function enter() {
      mask.hide();
      var doc = Element.fromDom(domGlobals.document);
      PlatformEditor.getActiveApi(platform.editor).each(function (editorApi) {
        priorState.set({
          socketHeight: getRaw(platform.socket, 'height'),
          iframeHeight: getRaw(editorApi.frame(), 'height'),
          outerScroll: domGlobals.document.body.scrollTop
        });
        scrollEvents.set({ exclusives: Scrollables.exclusive(doc, '.' + Scrollable.scrollable()) });
        add$2(platform.container, Styles.resolve('fullscreen-maximized'));
        Thor.clobberStyles(platform.container, editorApi.body());
        meta.maximize();
        set$3(platform.socket, 'overflow', 'scroll');
        set$3(platform.socket, '-webkit-overflow-scrolling', 'touch');
        focus$1(editorApi.body());
        var setupBag = MixedBag(['cWin', 'ceBody', 'socket', 'toolstrip', 'toolbar', 'dropup', 'contentElement', 'cursor', 'keyboardType', 'isScrolling', 'outerWindow', 'outerBody'], []);
        iosApi.set(IosSetup.setup(setupBag({
          cWin: editorApi.win(),
          ceBody: editorApi.body(),
          socket: platform.socket,
          toolstrip: platform.toolstrip,
          toolbar: platform.toolbar,
          dropup: platform.dropup.element(),
          contentElement: editorApi.frame(),
          cursor: noop,
          outerBody: platform.body,
          outerWindow: platform.win,
          keyboardType: IosKeyboard.stubborn,
          isScrolling: function isScrolling() {
            var scrollValue = scrollEvents;
            return scrollValue.get().exists(function (s) {
              return s.socket.isScrolling();
            });
          }
        })));
        iosApi.run(function (api) {
          api.syncHeight();
        });
        iosEvents.set(IosEvents.initEvents(editorApi, iosApi, platform.toolstrip, platform.socket, platform.dropup));
      });
    };
    var exit = function exit() {
      meta.restore();
      iosEvents.clear();
      iosApi.clear();
      mask.show();
      priorState.on(function (s) {
        s.socketHeight.each(function (h) {
          set$3(platform.socket, 'height', h);
        });
        s.iframeHeight.each(function (h) {
          set$3(platform.editor.getFrame(), 'height', h);
        });
        domGlobals.document.body.scrollTop = s.scrollTop;
      });
      priorState.clear();
      scrollEvents.on(function (s) {
        s.exclusives.unbind();
      });
      scrollEvents.clear();
      remove$4(platform.container, Styles.resolve('fullscreen-maximized'));
      Thor.restoreStyles();
      Scrollable.deregister(platform.toolbar);
      remove$5(platform.socket, 'overflow');
      remove$5(platform.socket, '-webkit-overflow-scrolling');
      blur(platform.editor.getFrame());
      PlatformEditor.getActiveApi(platform.editor).each(function (editorApi) {
        editorApi.clearSelection();
      });
    };
    var refreshStructure = function refreshStructure() {
      iosApi.run(function (api) {
        api.refreshStructure();
      });
    };
    return {
      enter: enter,
      refreshStructure: refreshStructure,
      exit: exit
    };
  };
  var IosMode = { create: create$6 };

  var produce$1 = function produce$1(raw) {
    var mobile = asRawOrDie('Getting IosWebapp schema', MobileSchema, raw);
    set$3(mobile.toolstrip, 'width', '100%');
    set$3(mobile.container, 'position', 'relative');
    var onView = function onView() {
      mobile.setReadOnly(mobile.readOnlyOnInit());
      mode.enter();
    };
    var mask = build$1(TapToEditMask.sketch(onView, mobile.translate));
    mobile.alloy.add(mask);
    var maskApi = {
      show: function show() {
        mobile.alloy.add(mask);
      },
      hide: function hide() {
        mobile.alloy.remove(mask);
      }
    };
    var mode = IosMode.create(mobile, maskApi);
    return {
      setReadOnly: mobile.setReadOnly,
      refreshStructure: mode.refreshStructure,
      enter: mode.enter,
      exit: mode.exit,
      destroy: noop
    };
  };
  var IosWebapp = { produce: produce$1 };

  function IosRealm(scrollIntoView) {
    var alloy = OuterContainer({ classes: [Styles.resolve('ios-container')] });
    var toolbar = ScrollingToolbar();
    var webapp = api$2();
    var switchToEdit = CommonRealm.makeEditSwitch(webapp);
    var socket = CommonRealm.makeSocket();
    var dropup = build$2(function () {
      webapp.run(function (w) {
        w.refreshStructure();
      });
    }, scrollIntoView);
    alloy.add(toolbar.wrapper());
    alloy.add(socket);
    alloy.add(dropup.component());
    var setToolbarGroups = function setToolbarGroups(rawGroups) {
      var groups = toolbar.createGroups(rawGroups);
      toolbar.setGroups(groups);
    };
    var setContextToolbar = function setContextToolbar(rawGroups) {
      var groups = toolbar.createGroups(rawGroups);
      toolbar.setContextToolbar(groups);
    };
    var focusToolbar = function focusToolbar() {
      toolbar.focus();
    };
    var restoreToolbar = function restoreToolbar() {
      toolbar.restoreToolbar();
    };
    var init = function init(spec) {
      webapp.set(IosWebapp.produce(spec));
    };
    var exit = function exit() {
      webapp.run(function (w) {
        Replacing.remove(socket, switchToEdit);
        w.exit();
      });
    };
    var updateMode = function updateMode(readOnly) {
      CommonRealm.updateMode(socket, switchToEdit, readOnly, alloy.root());
    };
    return {
      system: constant(alloy),
      element: alloy.element,
      init: init,
      exit: exit,
      setToolbarGroups: setToolbarGroups,
      setContextToolbar: setContextToolbar,
      focusToolbar: focusToolbar,
      restoreToolbar: restoreToolbar,
      updateMode: updateMode,
      socket: constant(socket),
      dropup: constant(dropup)
    };
  }

  var global$5 = tinymce.util.Tools.resolve('tinymce.EditorManager');

  var derive$3 = function derive$3(editor) {
    var base = readOptFrom$1(editor.settings, 'skin_url').fold(function () {
      return global$5.baseURL + '/skins/ui/oxide';
    }, function (url) {
      return url;
    });
    return {
      content: base + '/content.mobile.min.css',
      ui: base + '/skin.mobile.min.css'
    };
  };
  var CssUrls = { derive: derive$3 };

  var fontSizes = ['x-small', 'small', 'medium', 'large', 'x-large'];
  var fireChange = function fireChange(realm, command, state) {
    realm.system().broadcastOn([TinyChannels.formatChanged()], {
      command: command,
      state: state
    });
  };
  var init$5 = function init$5(realm, editor) {
    var allFormats = keys(editor.formatter.get());
    each$1(allFormats, function (command) {
      editor.formatter.formatChanged(command, function (state) {
        fireChange(realm, command, state);
      });
    });
    each$1(['ul', 'ol'], function (command) {
      editor.selection.selectorChanged(command, function (state, data) {
        fireChange(realm, command, state);
      });
    });
  };
  var FormatChangers = {
    init: init$5,
    fontSizes: constant(fontSizes)
  };

  var fireSkinLoaded = function fireSkinLoaded(editor) {
    var done = function done() {
      editor._skinLoaded = true;
      editor.fire('SkinLoaded');
    };
    return function () {
      if (editor.initialized) {
        done();
      } else {
        editor.on('init', done);
      }
    };
  };
  var SkinLoaded = { fireSkinLoaded: fireSkinLoaded };

  var READING = constant('toReading');
  var EDITING = constant('toEditing');
  var renderMobileTheme = function renderMobileTheme(editor) {
    var renderUI = function renderUI() {
      var targetNode = editor.getElement();
      var cssUrls = CssUrls.derive(editor);
      if (isSkinDisabled(editor) === false) {
        editor.contentCSS.push(cssUrls.content);
        global$1.DOM.styleSheetLoader.load(cssUrls.ui, SkinLoaded.fireSkinLoaded(editor));
      } else {
        SkinLoaded.fireSkinLoaded(editor)();
      }
      var doScrollIntoView = function doScrollIntoView() {
        editor.fire('ScrollIntoView');
      };
      var realm = detect$3().os.isAndroid() ? AndroidRealm(doScrollIntoView) : IosRealm(doScrollIntoView);
      var original = Element.fromDom(targetNode);
      attachSystemAfter(original, realm.system());
      var findFocusIn = function findFocusIn(elem) {
        return search(elem).bind(function (focused) {
          return realm.system().getByDom(focused).toOption();
        });
      };
      var outerWindow = targetNode.ownerDocument.defaultView;
      var orientation = Orientation.onChange(outerWindow, {
        onChange: function onChange() {
          var alloy = realm.system();
          alloy.broadcastOn([TinyChannels.orientationChanged()], { width: Orientation.getActualWidth(outerWindow) });
        },
        onReady: noop
      });
      var _setReadOnly = function _setReadOnly(dynamicGroup, readOnlyGroups, mainGroups, ro) {
        if (ro === false) {
          editor.selection.collapse();
        }
        var toolbars = configureToolbar(dynamicGroup, readOnlyGroups, mainGroups);
        realm.setToolbarGroups(ro === true ? toolbars.readOnly : toolbars.main);
        editor.setMode(ro === true ? 'readonly' : 'design');
        editor.fire(ro === true ? READING() : EDITING());
        realm.updateMode(ro);
      };
      var configureToolbar = function configureToolbar(dynamicGroup, readOnlyGroups, mainGroups) {
        var dynamic = dynamicGroup.get();
        var toolbars = {
          readOnly: dynamic.backToMask.concat(readOnlyGroups.get()),
          main: dynamic.backToMask.concat(mainGroups.get())
        };
        return toolbars;
      };
      var bindHandler = function bindHandler(label, handler) {
        editor.on(label, handler);
        return {
          unbind: function unbind() {
            editor.off(label);
          }
        };
      };
      editor.on('init', function () {
        realm.init({
          editor: {
            getFrame: function getFrame() {
              return Element.fromDom(editor.contentAreaContainer.querySelector('iframe'));
            },
            onDomChanged: function onDomChanged() {
              return { unbind: noop };
            },
            onToReading: function onToReading(handler) {
              return bindHandler(READING(), handler);
            },
            onToEditing: function onToEditing(handler) {
              return bindHandler(EDITING(), handler);
            },
            onScrollToCursor: function onScrollToCursor(handler) {
              editor.on('ScrollIntoView', function (tinyEvent) {
                handler(tinyEvent);
              });
              var unbind = function unbind() {
                editor.off('ScrollIntoView');
                orientation.destroy();
              };
              return { unbind: unbind };
            },
            onTouchToolstrip: function onTouchToolstrip() {
              hideDropup();
            },
            onTouchContent: function onTouchContent() {
              var toolbar = Element.fromDom(editor.editorContainer.querySelector('.' + Styles.resolve('toolbar')));
              findFocusIn(toolbar).each(emitExecute);
              realm.restoreToolbar();
              hideDropup();
            },
            onTapContent: function onTapContent(evt) {
              var target = evt.target();
              if (name(target) === 'img') {
                editor.selection.select(target.dom());
                evt.kill();
              } else if (name(target) === 'a') {
                var component = realm.system().getByDom(Element.fromDom(editor.editorContainer));
                component.each(function (container) {
                  if (Swapping.isAlpha(container)) {
                    TinyCodeDupe.openLink(target.dom());
                  }
                });
              }
            }
          },
          container: Element.fromDom(editor.editorContainer),
          socket: Element.fromDom(editor.contentAreaContainer),
          toolstrip: Element.fromDom(editor.editorContainer.querySelector('.' + Styles.resolve('toolstrip'))),
          toolbar: Element.fromDom(editor.editorContainer.querySelector('.' + Styles.resolve('toolbar'))),
          dropup: realm.dropup(),
          alloy: realm.system(),
          translate: noop,
          setReadOnly: function setReadOnly(ro) {
            _setReadOnly(dynamicGroup, readOnlyGroups, mainGroups, ro);
          },
          readOnlyOnInit: function readOnlyOnInit() {
            return _readOnlyOnInit();
          }
        });
        var hideDropup = function hideDropup() {
          realm.dropup().disappear(function () {
            realm.system().broadcastOn([TinyChannels.dropupDismissed()], {});
          });
        };
        var backToMaskGroup = {
          label: 'The first group',
          scrollable: false,
          items: [Buttons.forToolbar('back', function () {
            editor.selection.collapse();
            realm.exit();
          }, {}, editor)]
        };
        var backToReadOnlyGroup = {
          label: 'Back to read only',
          scrollable: false,
          items: [Buttons.forToolbar('readonly-back', function () {
            _setReadOnly(dynamicGroup, readOnlyGroups, mainGroups, true);
          }, {}, editor)]
        };
        var readOnlyGroup = {
          label: 'The read only mode group',
          scrollable: true,
          items: []
        };
        var features = Features.setup(realm, editor);
        var items = Features.detect(editor.settings, features);
        var actionGroup = {
          label: 'the action group',
          scrollable: true,
          items: items
        };
        var extraGroup = {
          label: 'The extra group',
          scrollable: false,
          items: []
        };
        var mainGroups = Cell([actionGroup, extraGroup]);
        var readOnlyGroups = Cell([readOnlyGroup, extraGroup]);
        var dynamicGroup = Cell({
          backToMask: [backToMaskGroup],
          backToReadOnly: [backToReadOnlyGroup]
        });
        FormatChangers.init(realm, editor);
      });
      editor.on('remove', function () {
        realm.exit();
      });
      editor.on('detach', function () {
        detachSystem(realm.system());
        realm.system().destroy();
      });
      return {
        iframeContainer: realm.socket().element().dom(),
        editorContainer: realm.element().dom()
      };
    };
    return {
      getNotificationManagerImpl: function getNotificationManagerImpl() {
        return {
          open: constant({
            progressBar: { value: noop },
            close: noop,
            text: noop,
            getEl: constant(null),
            moveTo: noop,
            moveRel: noop,
            settings: {}
          }),
          close: noop,
          reposition: noop,
          getArgs: constant({})
        };
      },
      renderUI: renderUI
    };
  };
  function Theme() {
    global$2.add('mobile', renderMobileTheme);
  }

  Theme();
})(window);
//# sourceMappingURL=theme.js.map