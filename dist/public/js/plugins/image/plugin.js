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

  var global$1 = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var noop = function noop() {};
  var constant = function constant(value) {
    return function () {
      return value;
    };
  };
  var identity = function identity(x) {
    return x;
  };
  var die = function die(msg) {
    return function () {
      throw new Error(msg);
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

  var nativeSlice = Array.prototype.slice;
  var nativePush = Array.prototype.push;
  var each = function each(xs, f) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      f(x, i);
    }
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
  var head = function head(xs) {
    return xs.length === 0 ? Option.none() : Option.some(xs[0]);
  };
  var from$1 = isFunction(Array.from) ? Array.from : function (x) {
    return nativeSlice.call(x);
  };

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
  var Promise = module.exports.boltExport;

  var nu = function nu(baseFn) {
    var data = Option.none();
    var callbacks = [];
    var map = function map(f) {
      return nu(function (nCallback) {
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
      each(cbs, call);
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
  var pure = function pure(a) {
    return nu(function (callback) {
      callback(a);
    });
  };
  var LazyValue = {
    nu: nu,
    pure: pure
  };

  var errorReporter = function errorReporter(err) {
    domGlobals.setTimeout(function () {
      throw err;
    }, 0);
  };
  var make = function make(run) {
    var get = function get(callback) {
      run().then(callback, errorReporter);
    };
    var map = function map(fab) {
      return make(function () {
        return run().then(fab);
      });
    };
    var bind = function bind(aFutureB) {
      return make(function () {
        return run().then(function (v) {
          return aFutureB(v).toPromise();
        });
      });
    };
    var anonBind = function anonBind(futureB) {
      return make(function () {
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
      return make(function () {
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
  var nu$1 = function nu$1(baseFn) {
    return make(function () {
      return new Promise(baseFn);
    });
  };
  var pure$1 = function pure$1(a) {
    return make(function () {
      return Promise.resolve(a);
    });
  };
  var Future = {
    nu: nu$1,
    pure: pure$1
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

  var wrap = function wrap(delegate) {
    var toCached = function toCached() {
      return wrap(delegate.toCached());
    };
    var bindFuture = function bindFuture(f) {
      return wrap(delegate.bind(function (resA) {
        return resA.fold(function (err) {
          return Future.pure(Result.error(err));
        }, function (a) {
          return f(a);
        });
      }));
    };
    var bindResult = function bindResult(f) {
      return wrap(delegate.map(function (resA) {
        return resA.bind(f);
      }));
    };
    var mapResult = function mapResult(f) {
      return wrap(delegate.map(function (resA) {
        return resA.map(f);
      }));
    };
    var mapError = function mapError(f) {
      return wrap(delegate.map(function (resA) {
        return resA.mapError(f);
      }));
    };
    var foldResult = function foldResult(whenError, whenValue) {
      return delegate.map(function (res) {
        return res.fold(whenError, whenValue);
      });
    };
    var withTimeout = function withTimeout(timeout, errorThunk) {
      return wrap(Future.nu(function (callback) {
        var timedOut = false;
        var timer = domGlobals.setTimeout(function () {
          timedOut = true;
          callback(Result.error(errorThunk()));
        }, timeout);
        delegate.get(function (result) {
          if (!timedOut) {
            domGlobals.clearTimeout(timer);
            callback(result);
          }
        });
      }));
    };
    return _assign(_assign({}, delegate), {
      toCached: toCached,
      bindFuture: bindFuture,
      bindResult: bindResult,
      mapResult: mapResult,
      mapError: mapError,
      foldResult: foldResult,
      withTimeout: withTimeout
    });
  };
  var nu$2 = function nu$2(worker) {
    return wrap(Future.nu(worker));
  };
  var value$1 = function value$1(value) {
    return wrap(Future.pure(Result.value(value)));
  };
  var error$1 = function error$1(error) {
    return wrap(Future.pure(Result.error(error)));
  };
  var fromResult = function fromResult(result) {
    return wrap(Future.pure(result));
  };
  var fromFuture = function fromFuture(future) {
    return wrap(future.map(Result.value));
  };
  var fromPromise = function fromPromise(promise) {
    return nu$2(function (completer) {
      promise.then(function (value) {
        completer(Result.value(value));
      }, function (error) {
        completer(Result.error(error));
      });
    });
  };
  var FutureResult = {
    nu: nu$2,
    wrap: wrap,
    pure: value$1,
    value: value$1,
    error: error$1,
    fromResult: fromResult,
    fromFuture: fromFuture,
    fromPromise: fromPromise
  };

  var hasOwnProperty = Object.prototype.hasOwnProperty;
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
          if (hasOwnProperty.call(curObject, key)) {
            ret[key] = merger(ret[key], curObject[key]);
          }
        }
      }
      return ret;
    };
  };
  var deepMerge = baseMerge(deep);
  var merge = baseMerge(shallow);

  var makeItems = function makeItems(info) {
    var imageUrl = {
      name: 'src',
      type: 'urlinput',
      filetype: 'image',
      label: 'Source'
    };
    var imageList = info.imageList.map(function (items) {
      return {
        name: 'images',
        type: 'selectbox',
        label: 'Image list',
        items: items
      };
    });
    var imageDescription = {
      name: 'alt',
      type: 'input',
      label: 'Image description'
    };
    var imageTitle = {
      name: 'title',
      type: 'input',
      label: 'Image title'
    };
    var imageDimensions = {
      name: 'dimensions',
      type: 'sizeinput'
    };
    var classList = info.classList.map(function (items) {
      return {
        name: 'classes',
        type: 'selectbox',
        label: 'Class',
        items: items
      };
    });
    var caption = {
      type: 'label',
      label: 'Caption',
      items: [{
        type: 'checkbox',
        name: 'caption',
        label: 'Show caption'
      }]
    };
    return flatten([[imageUrl], imageList.toArray(), info.hasDescription ? [imageDescription] : [], info.hasImageTitle ? [imageTitle] : [], info.hasDimensions ? [imageDimensions] : [], [{
      type: 'grid',
      columns: 2,
      items: flatten([classList.toArray(), info.hasImageCaption ? [caption] : []])
    }]]);
  };
  var makeTab = function makeTab(info) {
    return {
      title: 'General',
      name: 'general',
      items: makeItems(info)
    };
  };
  var MainTab = {
    makeTab: makeTab,
    makeItems: makeItems
  };

  var global$2 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

  var global$3 = tinymce.util.Tools.resolve('tinymce.util.Promise');

  var global$4 = tinymce.util.Tools.resolve('tinymce.util.XHR');

  var hasDimensions = function hasDimensions(editor) {
    return editor.getParam('image_dimensions', true, 'boolean');
  };
  var hasAdvTab = function hasAdvTab(editor) {
    return editor.getParam('image_advtab', false, 'boolean');
  };
  var hasUploadTab = function hasUploadTab(editor) {
    return editor.getParam('image_uploadtab', true, 'boolean');
  };
  var getPrependUrl = function getPrependUrl(editor) {
    return editor.getParam('image_prepend_url', '', 'string');
  };
  var getClassList = function getClassList(editor) {
    return editor.getParam('image_class_list');
  };
  var hasDescription = function hasDescription(editor) {
    return editor.getParam('image_description', true, 'boolean');
  };
  var hasImageTitle = function hasImageTitle(editor) {
    return editor.getParam('image_title', false, 'boolean');
  };
  var hasImageCaption = function hasImageCaption(editor) {
    return editor.getParam('image_caption', false, 'boolean');
  };
  var getImageList = function getImageList(editor) {
    return editor.getParam('image_list', false);
  };
  var hasUploadUrl = function hasUploadUrl(editor) {
    return !!getUploadUrl(editor);
  };
  var hasUploadHandler = function hasUploadHandler(editor) {
    return !!getUploadHandler(editor);
  };
  var getUploadUrl = function getUploadUrl(editor) {
    return editor.getParam('images_upload_url', '', 'string');
  };
  var getUploadHandler = function getUploadHandler(editor) {
    return editor.getParam('images_upload_handler', undefined, 'function');
  };
  var getUploadBasePath = function getUploadBasePath(editor) {
    return editor.getParam('images_upload_base_path', undefined, 'string');
  };
  var getUploadCredentials = function getUploadCredentials(editor) {
    return editor.getParam('images_upload_credentials', false, 'boolean');
  };
  var Settings = {
    hasDimensions: hasDimensions,
    hasUploadTab: hasUploadTab,
    hasAdvTab: hasAdvTab,
    getPrependUrl: getPrependUrl,
    getClassList: getClassList,
    hasDescription: hasDescription,
    hasImageTitle: hasImageTitle,
    hasImageCaption: hasImageCaption,
    getImageList: getImageList,
    hasUploadUrl: hasUploadUrl,
    hasUploadHandler: hasUploadHandler,
    getUploadUrl: getUploadUrl,
    getUploadHandler: getUploadHandler,
    getUploadBasePath: getUploadBasePath,
    getUploadCredentials: getUploadCredentials
  };

  var parseIntAndGetMax = function parseIntAndGetMax(val1, val2) {
    return Math.max(parseInt(val1, 10), parseInt(val2, 10));
  };
  var getImageSize = function getImageSize(url, callback) {
    var img = domGlobals.document.createElement('img');
    var done = function done(dimensions) {
      if (img.parentNode) {
        img.parentNode.removeChild(img);
      }
      callback(dimensions);
    };
    img.onload = function () {
      var width = parseIntAndGetMax(img.width, img.clientWidth);
      var height = parseIntAndGetMax(img.height, img.clientHeight);
      var dimensions = {
        width: width,
        height: height
      };
      done(Result.value(dimensions));
    };
    img.onerror = function () {
      done(Result.error('Failed to get image dimensions for: ' + url));
    };
    var style = img.style;
    style.visibility = 'hidden';
    style.position = 'fixed';
    style.bottom = style.left = '0px';
    style.width = style.height = 'auto';
    domGlobals.document.body.appendChild(img);
    img.src = url;
  };
  var removePixelSuffix = function removePixelSuffix(value) {
    if (value) {
      value = value.replace(/px$/, '');
    }
    return value;
  };
  var addPixelSuffix = function addPixelSuffix(value) {
    if (value.length > 0 && /^[0-9]+$/.test(value)) {
      value += 'px';
    }
    return value;
  };
  var mergeMargins = function mergeMargins(css) {
    if (css.margin) {
      var splitMargin = String(css.margin).split(' ');
      switch (splitMargin.length) {
        case 1:
          css['margin-top'] = css['margin-top'] || splitMargin[0];
          css['margin-right'] = css['margin-right'] || splitMargin[0];
          css['margin-bottom'] = css['margin-bottom'] || splitMargin[0];
          css['margin-left'] = css['margin-left'] || splitMargin[0];
          break;
        case 2:
          css['margin-top'] = css['margin-top'] || splitMargin[0];
          css['margin-right'] = css['margin-right'] || splitMargin[1];
          css['margin-bottom'] = css['margin-bottom'] || splitMargin[0];
          css['margin-left'] = css['margin-left'] || splitMargin[1];
          break;
        case 3:
          css['margin-top'] = css['margin-top'] || splitMargin[0];
          css['margin-right'] = css['margin-right'] || splitMargin[1];
          css['margin-bottom'] = css['margin-bottom'] || splitMargin[2];
          css['margin-left'] = css['margin-left'] || splitMargin[1];
          break;
        case 4:
          css['margin-top'] = css['margin-top'] || splitMargin[0];
          css['margin-right'] = css['margin-right'] || splitMargin[1];
          css['margin-bottom'] = css['margin-bottom'] || splitMargin[2];
          css['margin-left'] = css['margin-left'] || splitMargin[3];
      }
      delete css.margin;
    }
    return css;
  };
  var createImageList = function createImageList(editor, callback) {
    var imageList = Settings.getImageList(editor);
    if (typeof imageList === 'string') {
      global$4.send({
        url: imageList,
        success: function success(text) {
          callback(JSON.parse(text));
        }
      });
    } else if (typeof imageList === 'function') {
      imageList(callback);
    } else {
      callback(imageList);
    }
  };
  var waitLoadImage = function waitLoadImage(editor, data, imgElm) {
    var selectImage = function selectImage() {
      imgElm.onload = imgElm.onerror = null;
      if (editor.selection) {
        editor.selection.select(imgElm);
        editor.nodeChanged();
      }
    };
    imgElm.onload = function () {
      if (!data.width && !data.height && Settings.hasDimensions(editor)) {
        editor.dom.setAttribs(imgElm, {
          width: String(imgElm.clientWidth),
          height: String(imgElm.clientHeight)
        });
      }
      selectImage();
    };
    imgElm.onerror = selectImage;
  };
  var blobToDataUri = function blobToDataUri(blob) {
    return new global$3(function (resolve, reject) {
      var reader = new domGlobals.FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(reader.error.message);
      };
      reader.readAsDataURL(blob);
    });
  };
  var isPlaceholderImage = function isPlaceholderImage(imgElm) {
    return imgElm.nodeName === 'IMG' && (imgElm.hasAttribute('data-mce-object') || imgElm.hasAttribute('data-mce-placeholder'));
  };
  var Utils = {
    getImageSize: getImageSize,
    removePixelSuffix: removePixelSuffix,
    addPixelSuffix: addPixelSuffix,
    mergeMargins: mergeMargins,
    createImageList: createImageList,
    waitLoadImage: waitLoadImage,
    blobToDataUri: blobToDataUri,
    isPlaceholderImage: isPlaceholderImage
  };

  var DOM = global$2.DOM;
  var getHspace = function getHspace(image) {
    if (image.style.marginLeft && image.style.marginRight && image.style.marginLeft === image.style.marginRight) {
      return Utils.removePixelSuffix(image.style.marginLeft);
    } else {
      return '';
    }
  };
  var getVspace = function getVspace(image) {
    if (image.style.marginTop && image.style.marginBottom && image.style.marginTop === image.style.marginBottom) {
      return Utils.removePixelSuffix(image.style.marginTop);
    } else {
      return '';
    }
  };
  var getBorder = function getBorder(image) {
    if (image.style.borderWidth) {
      return Utils.removePixelSuffix(image.style.borderWidth);
    } else {
      return '';
    }
  };
  var getAttrib = function getAttrib(image, name) {
    if (image.hasAttribute(name)) {
      return image.getAttribute(name);
    } else {
      return '';
    }
  };
  var getStyle = function getStyle(image, name) {
    return image.style[name] ? image.style[name] : '';
  };
  var hasCaption = function hasCaption(image) {
    return image.parentNode !== null && image.parentNode.nodeName === 'FIGURE';
  };
  var setAttrib = function setAttrib(image, name, value) {
    image.setAttribute(name, value);
  };
  var wrapInFigure = function wrapInFigure(image) {
    var figureElm = DOM.create('figure', { class: 'image' });
    DOM.insertAfter(figureElm, image);
    figureElm.appendChild(image);
    figureElm.appendChild(DOM.create('figcaption', { contentEditable: 'true' }, 'Caption'));
    figureElm.contentEditable = 'false';
  };
  var removeFigure = function removeFigure(image) {
    var figureElm = image.parentNode;
    DOM.insertAfter(image, figureElm);
    DOM.remove(figureElm);
  };
  var toggleCaption = function toggleCaption(image) {
    if (hasCaption(image)) {
      removeFigure(image);
    } else {
      wrapInFigure(image);
    }
  };
  var normalizeStyle = function normalizeStyle(image, normalizeCss) {
    var attrValue = image.getAttribute('style');
    var value = normalizeCss(attrValue !== null ? attrValue : '');
    if (value.length > 0) {
      image.setAttribute('style', value);
      image.setAttribute('data-mce-style', value);
    } else {
      image.removeAttribute('style');
    }
  };
  var setSize = function setSize(name, normalizeCss) {
    return function (image, name, value) {
      if (image.style[name]) {
        image.style[name] = Utils.addPixelSuffix(value);
        normalizeStyle(image, normalizeCss);
      } else {
        setAttrib(image, name, value);
      }
    };
  };
  var getSize = function getSize(image, name) {
    if (image.style[name]) {
      return Utils.removePixelSuffix(image.style[name]);
    } else {
      return getAttrib(image, name);
    }
  };
  var setHspace = function setHspace(image, value) {
    var pxValue = Utils.addPixelSuffix(value);
    image.style.marginLeft = pxValue;
    image.style.marginRight = pxValue;
  };
  var setVspace = function setVspace(image, value) {
    var pxValue = Utils.addPixelSuffix(value);
    image.style.marginTop = pxValue;
    image.style.marginBottom = pxValue;
  };
  var setBorder = function setBorder(image, value) {
    var pxValue = Utils.addPixelSuffix(value);
    image.style.borderWidth = pxValue;
  };
  var setBorderStyle = function setBorderStyle(image, value) {
    image.style.borderStyle = value;
  };
  var getBorderStyle = function getBorderStyle(image) {
    return getStyle(image, 'borderStyle');
  };
  var isFigure = function isFigure(elm) {
    return elm.nodeName === 'FIGURE';
  };
  var isImage = function isImage(elm) {
    return elm.nodeName === 'IMG';
  };
  var defaultData = function defaultData() {
    return {
      src: '',
      alt: '',
      title: '',
      width: '',
      height: '',
      class: '',
      style: '',
      caption: false,
      hspace: '',
      vspace: '',
      border: '',
      borderStyle: ''
    };
  };
  var getStyleValue = function getStyleValue(normalizeCss, data) {
    var image = domGlobals.document.createElement('img');
    setAttrib(image, 'style', data.style);
    if (getHspace(image) || data.hspace !== '') {
      setHspace(image, data.hspace);
    }
    if (getVspace(image) || data.vspace !== '') {
      setVspace(image, data.vspace);
    }
    if (getBorder(image) || data.border !== '') {
      setBorder(image, data.border);
    }
    if (getBorderStyle(image) || data.borderStyle !== '') {
      setBorderStyle(image, data.borderStyle);
    }
    return normalizeCss(image.getAttribute('style'));
  };
  var create = function create(normalizeCss, data) {
    var image = domGlobals.document.createElement('img');
    write(normalizeCss, merge(data, { caption: false }), image);
    setAttrib(image, 'alt', data.alt);
    if (data.caption) {
      var figure = DOM.create('figure', { class: 'image' });
      figure.appendChild(image);
      figure.appendChild(DOM.create('figcaption', { contentEditable: 'true' }, 'Caption'));
      figure.contentEditable = 'false';
      return figure;
    } else {
      return image;
    }
  };
  var read = function read(normalizeCss, image) {
    return {
      src: getAttrib(image, 'src'),
      alt: getAttrib(image, 'alt'),
      title: getAttrib(image, 'title'),
      width: getSize(image, 'width'),
      height: getSize(image, 'height'),
      class: getAttrib(image, 'class'),
      style: normalizeCss(getAttrib(image, 'style')),
      caption: hasCaption(image),
      hspace: getHspace(image),
      vspace: getVspace(image),
      border: getBorder(image),
      borderStyle: getStyle(image, 'borderStyle')
    };
  };
  var updateProp = function updateProp(image, oldData, newData, name, set) {
    if (newData[name] !== oldData[name]) {
      set(image, name, newData[name]);
    }
  };
  var normalized = function normalized(set, normalizeCss) {
    return function (image, name, value) {
      set(image, value);
      normalizeStyle(image, normalizeCss);
    };
  };
  var write = function write(normalizeCss, newData, image) {
    var oldData = read(normalizeCss, image);
    updateProp(image, oldData, newData, 'caption', function (image, _name, _value) {
      return toggleCaption(image);
    });
    updateProp(image, oldData, newData, 'src', setAttrib);
    updateProp(image, oldData, newData, 'alt', setAttrib);
    updateProp(image, oldData, newData, 'title', setAttrib);
    updateProp(image, oldData, newData, 'width', setSize('width', normalizeCss));
    updateProp(image, oldData, newData, 'height', setSize('height', normalizeCss));
    updateProp(image, oldData, newData, 'class', setAttrib);
    updateProp(image, oldData, newData, 'style', normalized(function (image, value) {
      return setAttrib(image, 'style', value);
    }, normalizeCss));
    updateProp(image, oldData, newData, 'hspace', normalized(setHspace, normalizeCss));
    updateProp(image, oldData, newData, 'vspace', normalized(setVspace, normalizeCss));
    updateProp(image, oldData, newData, 'border', normalized(setBorder, normalizeCss));
    updateProp(image, oldData, newData, 'borderStyle', normalized(setBorderStyle, normalizeCss));
  };

  var normalizeCss = function normalizeCss(editor, cssText) {
    var css = editor.dom.styles.parse(cssText);
    var mergedCss = Utils.mergeMargins(css);
    var compressed = editor.dom.styles.parse(editor.dom.styles.serialize(mergedCss));
    return editor.dom.styles.serialize(compressed);
  };
  var getSelectedImage = function getSelectedImage(editor) {
    var imgElm = editor.selection.getNode();
    var figureElm = editor.dom.getParent(imgElm, 'figure.image');
    if (figureElm) {
      return editor.dom.select('img', figureElm)[0];
    }
    if (imgElm && (imgElm.nodeName !== 'IMG' || Utils.isPlaceholderImage(imgElm))) {
      return null;
    }
    return imgElm;
  };
  var splitTextBlock = function splitTextBlock(editor, figure) {
    var dom = editor.dom;
    var textBlock = dom.getParent(figure.parentNode, function (node) {
      return editor.schema.getTextBlockElements()[node.nodeName];
    }, editor.getBody());
    if (textBlock) {
      return dom.split(textBlock, figure);
    } else {
      return figure;
    }
  };
  var readImageDataFromSelection = function readImageDataFromSelection(editor) {
    var image = getSelectedImage(editor);
    return image ? read(function (css) {
      return normalizeCss(editor, css);
    }, image) : defaultData();
  };
  var insertImageAtCaret = function insertImageAtCaret(editor, data) {
    var elm = create(function (css) {
      return normalizeCss(editor, css);
    }, data);
    editor.dom.setAttrib(elm, 'data-mce-id', '__mcenew');
    editor.focus();
    editor.selection.setContent(elm.outerHTML);
    var insertedElm = editor.dom.select('*[data-mce-id="__mcenew"]')[0];
    editor.dom.setAttrib(insertedElm, 'data-mce-id', null);
    if (isFigure(insertedElm)) {
      var figure = splitTextBlock(editor, insertedElm);
      editor.selection.select(figure);
    } else {
      editor.selection.select(insertedElm);
    }
  };
  var syncSrcAttr = function syncSrcAttr(editor, image) {
    editor.dom.setAttrib(image, 'src', image.getAttribute('src'));
  };
  var deleteImage = function deleteImage(editor, image) {
    if (image) {
      var elm = editor.dom.is(image.parentNode, 'figure.image') ? image.parentNode : image;
      editor.dom.remove(elm);
      editor.focus();
      editor.nodeChanged();
      if (editor.dom.isEmpty(editor.getBody())) {
        editor.setContent('');
        editor.selection.setCursorLocation();
      }
    }
  };
  var writeImageDataToSelection = function writeImageDataToSelection(editor, data) {
    var image = getSelectedImage(editor);
    write(function (css) {
      return normalizeCss(editor, css);
    }, data, image);
    syncSrcAttr(editor, image);
    if (isFigure(image.parentNode)) {
      var figure = image.parentNode;
      splitTextBlock(editor, figure);
      editor.selection.select(image.parentNode);
    } else {
      editor.selection.select(image);
      Utils.waitLoadImage(editor, data, image);
    }
  };
  var insertOrUpdateImage = function insertOrUpdateImage(editor, data) {
    var image = getSelectedImage(editor);
    if (image) {
      if (data.src) {
        writeImageDataToSelection(editor, data);
      } else {
        deleteImage(editor, image);
      }
    } else if (data.src) {
      insertImageAtCaret(editor, data);
    }
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

  var global$5 = tinymce.util.Tools.resolve('tinymce.util.Tools');

  var getValue = function getValue(item) {
    return isString(item.value) ? item.value : '';
  };
  var sanitizeList = function sanitizeList(list, extractValue) {
    var out = [];
    global$5.each(list, function (item) {
      var text = isString(item.text) ? item.text : isString(item.title) ? item.title : '';
      if (item.menu !== undefined) {
        var items = sanitizeList(item.menu, extractValue);
        out.push({
          text: text,
          items: items
        });
      } else {
        var value = extractValue(item);
        out.push({
          text: text,
          value: value
        });
      }
    });
    return out;
  };
  var sanitizer = function sanitizer(extracter) {
    if (extracter === void 0) {
      extracter = getValue;
    }
    return function (list) {
      if (list) {
        return Option.from(list).map(function (list) {
          return sanitizeList(list, extracter);
        });
      } else {
        return Option.none();
      }
    };
  };
  var sanitize = function sanitize(list) {
    return sanitizer(getValue)(list);
  };
  var isGroup = function isGroup(item) {
    return Object.prototype.hasOwnProperty.call(item, 'items');
  };
  var findEntryDelegate = function findEntryDelegate(list, value) {
    return findMap(list, function (item) {
      if (isGroup(item)) {
        return findEntryDelegate(item.items, value);
      } else if (item.value === value) {
        return Option.some(item);
      } else {
        return Option.none();
      }
    });
  };
  var findEntry = function findEntry(optList, value) {
    return optList.bind(function (list) {
      return findEntryDelegate(list, value);
    });
  };
  var ListUtils = {
    sanitizer: sanitizer,
    sanitize: sanitize,
    findEntry: findEntry
  };

  var pathJoin = function pathJoin(path1, path2) {
    if (path1) {
      return path1.replace(/\/$/, '') + '/' + path2.replace(/^\//, '');
    }
    return path2;
  };
  function Uploader(settings) {
    var defaultHandler = function defaultHandler(blobInfo, success, failure, progress) {
      var xhr, formData;
      xhr = new domGlobals.XMLHttpRequest();
      xhr.open('POST', settings.url);
      xhr.withCredentials = settings.credentials;
      xhr.upload.onprogress = function (e) {
        progress(e.loaded / e.total * 100);
      };
      xhr.onerror = function () {
        failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
      };
      xhr.onload = function () {
        var json;
        if (xhr.status < 200 || xhr.status >= 300) {
          failure('HTTP Error: ' + xhr.status);
          return;
        }
        json = JSON.parse(xhr.responseText);
        if (!json || typeof json.location !== 'string') {
          failure('Invalid JSON: ' + xhr.responseText);
          return;
        }
        success(pathJoin(settings.basePath, json.location));
      };
      formData = new domGlobals.FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());
      xhr.send(formData);
    };
    var uploadBlob = function uploadBlob(blobInfo, handler) {
      return new global$3(function (resolve, reject) {
        try {
          handler(blobInfo, resolve, reject, noop);
        } catch (ex) {
          reject(ex.message);
        }
      });
    };
    var isDefaultHandler = function isDefaultHandler(handler) {
      return handler === defaultHandler;
    };
    var upload = function upload(blobInfo) {
      return !settings.url && isDefaultHandler(settings.handler) ? global$3.reject('Upload url missing from the settings.') : uploadBlob(blobInfo, settings.handler);
    };
    settings = global$5.extend({
      credentials: false,
      handler: defaultHandler
    }, settings);
    return { upload: upload };
  }

  var makeTab$1 = function makeTab$1(info) {
    return {
      title: 'Advanced',
      name: 'advanced',
      items: [{
        type: 'input',
        label: 'Style',
        name: 'style'
      }, {
        type: 'grid',
        columns: 2,
        items: [{
          type: 'input',
          label: 'Vertical space',
          name: 'vspace',
          inputMode: 'numeric'
        }, {
          type: 'input',
          label: 'Horizontal space',
          name: 'hspace',
          inputMode: 'numeric'
        }, {
          type: 'input',
          label: 'Border width',
          name: 'border',
          inputMode: 'numeric'
        }, {
          type: 'selectbox',
          name: 'borderstyle',
          label: 'Border style',
          items: [{
            text: 'Select...',
            value: ''
          }, {
            text: 'Solid',
            value: 'solid'
          }, {
            text: 'Dotted',
            value: 'dotted'
          }, {
            text: 'Dashed',
            value: 'dashed'
          }, {
            text: 'Double',
            value: 'double'
          }, {
            text: 'Groove',
            value: 'groove'
          }, {
            text: 'Ridge',
            value: 'ridge'
          }, {
            text: 'Inset',
            value: 'inset'
          }, {
            text: 'Outset',
            value: 'outset'
          }, {
            text: 'None',
            value: 'none'
          }, {
            text: 'Hidden',
            value: 'hidden'
          }]
        }]
      }]
    };
  };
  var AdvTab = { makeTab: makeTab$1 };

  var collect = function collect(editor) {
    var urlListSanitizer = ListUtils.sanitizer(function (item) {
      return editor.convertURL(item.value || item.url, 'src');
    });
    var futureImageList = Future.nu(function (completer) {
      Utils.createImageList(editor, function (imageList) {
        completer(urlListSanitizer(imageList).map(function (items) {
          return flatten([[{
            text: 'None',
            value: ''
          }], items]);
        }));
      });
    });
    var classList = ListUtils.sanitize(Settings.getClassList(editor));
    var hasAdvTab = Settings.hasAdvTab(editor);
    var hasUploadTab = Settings.hasUploadTab(editor);
    var hasUploadUrl = Settings.hasUploadUrl(editor);
    var hasUploadHandler = Settings.hasUploadHandler(editor);
    var image = readImageDataFromSelection(editor);
    var hasDescription = Settings.hasDescription(editor);
    var hasImageTitle = Settings.hasImageTitle(editor);
    var hasDimensions = Settings.hasDimensions(editor);
    var hasImageCaption = Settings.hasImageCaption(editor);
    var url = Settings.getUploadUrl(editor);
    var basePath = Settings.getUploadBasePath(editor);
    var credentials = Settings.getUploadCredentials(editor);
    var handler = Settings.getUploadHandler(editor);
    var prependURL = Option.some(Settings.getPrependUrl(editor)).filter(function (preUrl) {
      return isString(preUrl) && preUrl.length > 0;
    });
    return futureImageList.map(function (imageList) {
      return {
        image: image,
        imageList: imageList,
        classList: classList,
        hasAdvTab: hasAdvTab,
        hasUploadTab: hasUploadTab,
        hasUploadUrl: hasUploadUrl,
        hasUploadHandler: hasUploadHandler,
        hasDescription: hasDescription,
        hasImageTitle: hasImageTitle,
        hasDimensions: hasDimensions,
        hasImageCaption: hasImageCaption,
        url: url,
        basePath: basePath,
        credentials: credentials,
        handler: handler,
        prependURL: prependURL
      };
    });
  };

  var makeTab$2 = function makeTab$2(info) {
    var items = [{
      type: 'dropzone',
      name: 'fileinput'
    }];
    return {
      title: 'Upload',
      name: 'upload',
      items: items
    };
  };
  var UploadTab = { makeTab: makeTab$2 };

  var createState = function createState(info) {
    return {
      prevImage: ListUtils.findEntry(info.imageList, info.image.src),
      prevAlt: info.image.alt,
      open: true
    };
  };
  var fromImageData = function fromImageData(image) {
    return {
      src: {
        value: image.src,
        meta: {}
      },
      images: image.src,
      alt: image.alt,
      title: image.title,
      dimensions: {
        width: image.width,
        height: image.height
      },
      classes: image.class,
      caption: image.caption,
      style: image.style,
      vspace: image.vspace,
      border: image.border,
      hspace: image.hspace,
      borderstyle: image.borderStyle,
      fileinput: []
    };
  };
  var toImageData = function toImageData(data) {
    return {
      src: data.src.value,
      alt: data.alt,
      title: data.title,
      width: data.dimensions.width,
      height: data.dimensions.height,
      class: data.classes,
      style: data.style,
      caption: data.caption,
      hspace: data.hspace,
      vspace: data.vspace,
      border: data.border,
      borderStyle: data.borderstyle
    };
  };
  var addPrependUrl2 = function addPrependUrl2(info, srcURL) {
    if (!/^(?:[a-zA-Z]+:)?\/\//.test(srcURL)) {
      return info.prependURL.bind(function (prependUrl) {
        if (srcURL.substring(0, prependUrl.length) !== prependUrl) {
          return Option.some(prependUrl + srcURL);
        }
        return Option.none();
      });
    }
    return Option.none();
  };
  var addPrependUrl = function addPrependUrl(info, api) {
    var data = api.getData();
    addPrependUrl2(info, data.src.value).each(function (srcURL) {
      api.setData({
        src: {
          value: srcURL,
          meta: data.src.meta
        }
      });
    });
  };
  var formFillFromMeta2 = function formFillFromMeta2(info, data, meta) {
    if (info.hasDescription && isString(meta.alt)) {
      data.alt = meta.alt;
    }
    if (info.hasImageTitle && isString(meta.title)) {
      data.title = meta.title;
    }
    if (info.hasDimensions) {
      if (isString(meta.width)) {
        data.dimensions.width = meta.width;
      }
      if (isString(meta.height)) {
        data.dimensions.height = meta.height;
      }
    }
    if (isString(meta.class)) {
      ListUtils.findEntry(info.classList, meta.class).each(function (entry) {
        data.classes = entry.value;
      });
    }
    if (info.hasImageCaption) {
      if (isBoolean(meta.caption)) {
        data.caption = meta.caption;
      }
    }
    if (info.hasAdvTab) {
      if (isString(meta.vspace)) {
        data.vspace = meta.vspace;
      }
      if (isString(meta.border)) {
        data.border = meta.border;
      }
      if (isString(meta.hspace)) {
        data.hspace = meta.hspace;
      }
      if (isString(meta.borderstyle)) {
        data.borderstyle = meta.borderstyle;
      }
    }
  };
  var formFillFromMeta = function formFillFromMeta(info, api) {
    var data = api.getData();
    var meta = data.src.meta;
    if (meta !== undefined) {
      var newData = deepMerge({}, data);
      formFillFromMeta2(info, newData, meta);
      api.setData(newData);
    }
  };
  var calculateImageSize = function calculateImageSize(helpers, info, state, api) {
    var data = api.getData();
    var url = data.src.value;
    var meta = data.src.meta || {};
    if (!meta.width && !meta.height && info.hasDimensions) {
      helpers.imageSize(url).get(function (result) {
        result.each(function (size) {
          if (state.open) {
            api.setData({ dimensions: size });
          }
        });
      });
    }
  };
  var updateImagesDropdown = function updateImagesDropdown(info, state, api) {
    var data = api.getData();
    var image = ListUtils.findEntry(info.imageList, data.src.value);
    state.prevImage = image;
    api.setData({
      images: image.map(function (entry) {
        return entry.value;
      }).getOr('')
    });
  };
  var changeSrc = function changeSrc(helpers, info, state, api) {
    addPrependUrl(info, api);
    formFillFromMeta(info, api);
    calculateImageSize(helpers, info, state, api);
    updateImagesDropdown(info, state, api);
  };
  var changeImages = function changeImages(helpers, info, state, api) {
    var data = api.getData();
    var image = ListUtils.findEntry(info.imageList, data.images);
    image.each(function (img) {
      var updateAlt = data.alt === '' || state.prevImage.map(function (image) {
        return image.text === data.alt;
      }).getOr(false);
      if (updateAlt) {
        if (img.value === '') {
          api.setData({
            src: img,
            alt: state.prevAlt
          });
        } else {
          api.setData({
            src: img,
            alt: img.text
          });
        }
      } else {
        api.setData({ src: img });
      }
    });
    state.prevImage = image;
    changeSrc(helpers, info, state, api);
  };
  var calcVSpace = function calcVSpace(css) {
    var matchingTopBottom = css['margin-top'] && css['margin-bottom'] && css['margin-top'] === css['margin-bottom'];
    return matchingTopBottom ? Utils.removePixelSuffix(String(css['margin-top'])) : '';
  };
  var calcHSpace = function calcHSpace(css) {
    var matchingLeftRight = css['margin-right'] && css['margin-left'] && css['margin-right'] === css['margin-left'];
    return matchingLeftRight ? Utils.removePixelSuffix(String(css['margin-right'])) : '';
  };
  var calcBorderWidth = function calcBorderWidth(css) {
    return css['border-width'] ? Utils.removePixelSuffix(String(css['border-width'])) : '';
  };
  var calcBorderStyle = function calcBorderStyle(css) {
    return css['border-style'] ? String(css['border-style']) : '';
  };
  var calcStyle = function calcStyle(parseStyle, serializeStyle, css) {
    return serializeStyle(parseStyle(serializeStyle(css)));
  };
  var changeStyle2 = function changeStyle2(parseStyle, serializeStyle, data) {
    var css = Utils.mergeMargins(parseStyle(data.style));
    var dataCopy = deepMerge({}, data);
    dataCopy.vspace = calcVSpace(css);
    dataCopy.hspace = calcHSpace(css);
    dataCopy.border = calcBorderWidth(css);
    dataCopy.borderstyle = calcBorderStyle(css);
    dataCopy.style = calcStyle(parseStyle, serializeStyle, css);
    return dataCopy;
  };
  var changeStyle = function changeStyle(helpers, api) {
    var data = api.getData();
    var newData = changeStyle2(helpers.parseStyle, helpers.serializeStyle, data);
    api.setData(newData);
  };
  var changeAStyle = function changeAStyle(helpers, info, api) {
    var data = deepMerge(fromImageData(info.image), api.getData());
    var style = getStyleValue(helpers.normalizeCss, toImageData(data));
    api.setData({ style: style });
  };
  var changeFileInput = function changeFileInput(helpers, info, state, api) {
    var data = api.getData();
    api.block('Uploading image');
    head(data.fileinput).fold(function () {
      api.unblock();
    }, function (file) {
      var blobUri = domGlobals.URL.createObjectURL(file);
      var uploader = Uploader({
        url: info.url,
        basePath: info.basePath,
        credentials: info.credentials,
        handler: info.handler
      });
      var finalize = function finalize() {
        api.unblock();
        domGlobals.URL.revokeObjectURL(blobUri);
      };
      Utils.blobToDataUri(file).then(function (dataUrl) {
        var blobInfo = helpers.createBlobCache(file, blobUri, dataUrl);
        uploader.upload(blobInfo).then(function (url) {
          api.setData({
            src: {
              value: url,
              meta: {}
            }
          });
          api.showTab('general');
          changeSrc(helpers, info, state, api);
          finalize();
        }).catch(function (err) {
          finalize();
          helpers.alertErr(api, err);
        });
      });
    });
  };
  var changeHandler = function changeHandler(helpers, info, state) {
    return function (api, evt) {
      if (evt.name === 'src') {
        changeSrc(helpers, info, state, api);
      } else if (evt.name === 'images') {
        changeImages(helpers, info, state, api);
      } else if (evt.name === 'alt') {
        state.prevAlt = api.getData().alt;
      } else if (evt.name === 'style') {
        changeStyle(helpers, api);
      } else if (evt.name === 'vspace' || evt.name === 'hspace' || evt.name === 'border' || evt.name === 'borderstyle') {
        changeAStyle(helpers, info, api);
      } else if (evt.name === 'fileinput') {
        changeFileInput(helpers, info, state, api);
      }
    };
  };
  var closeHandler = function closeHandler(state) {
    return function () {
      state.open = false;
    };
  };
  var makeDialogBody = function makeDialogBody(info) {
    if (info.hasAdvTab || info.hasUploadUrl || info.hasUploadHandler) {
      var tabPanel = {
        type: 'tabpanel',
        tabs: flatten([[MainTab.makeTab(info)], info.hasAdvTab ? [AdvTab.makeTab(info)] : [], info.hasUploadTab && (info.hasUploadUrl || info.hasUploadHandler) ? [UploadTab.makeTab(info)] : []])
      };
      return tabPanel;
    } else {
      var panel = {
        type: 'panel',
        items: MainTab.makeItems(info)
      };
      return panel;
    }
  };
  var makeDialog = function makeDialog(helpers) {
    return function (info) {
      var state = createState(info);
      return {
        title: 'Insert/Edit Image',
        size: 'normal',
        body: makeDialogBody(info),
        buttons: [{
          type: 'cancel',
          name: 'cancel',
          text: 'Cancel'
        }, {
          type: 'submit',
          name: 'save',
          text: 'Save',
          primary: true
        }],
        initialData: fromImageData(info.image),
        onSubmit: helpers.onSubmit(info),
        onChange: changeHandler(helpers, info, state),
        onClose: closeHandler(state)
      };
    };
  };
  var submitHandler = function submitHandler(editor) {
    return function (info) {
      return function (api) {
        var data = deepMerge(fromImageData(info.image), api.getData());
        editor.undoManager.transact(function () {
          insertOrUpdateImage(editor, toImageData(data));
        });
        editor.editorUpload.uploadImagesAuto();
        api.close();
      };
    };
  };
  var imageSize = function imageSize(editor) {
    return function (url) {
      return FutureResult.nu(function (completer) {
        Utils.getImageSize(editor.documentBaseURI.toAbsolute(url), function (data) {
          var result = data.map(function (dimensions) {
            return {
              width: String(dimensions.width),
              height: String(dimensions.height)
            };
          });
          completer(result);
        });
      });
    };
  };
  var createBlobCache = function createBlobCache(editor) {
    return function (file, blobUri, dataUrl) {
      return editor.editorUpload.blobCache.create({
        blob: file,
        blobUri: blobUri,
        name: file.name ? file.name.replace(/\.[^\.]+$/, '') : null,
        base64: dataUrl.split(',')[1]
      });
    };
  };
  var alertErr = function alertErr(editor) {
    return function (api, message) {
      editor.windowManager.alert(message, api.close);
    };
  };
  var normalizeCss$1 = function normalizeCss$1(editor) {
    return function (cssText) {
      return normalizeCss(editor, cssText);
    };
  };
  var parseStyle = function parseStyle(editor) {
    return function (cssText) {
      return editor.dom.parseStyle(cssText);
    };
  };
  var serializeStyle = function serializeStyle(editor) {
    return function (stylesArg, name) {
      return editor.dom.serializeStyle(stylesArg, name);
    };
  };
  var Dialog = function Dialog(editor) {
    var helpers = {
      onSubmit: submitHandler(editor),
      imageSize: imageSize(editor),
      createBlobCache: createBlobCache(editor),
      alertErr: alertErr(editor),
      normalizeCss: normalizeCss$1(editor),
      parseStyle: parseStyle(editor),
      serializeStyle: serializeStyle(editor)
    };
    var open = function open() {
      return collect(editor).map(makeDialog(helpers)).get(function (spec) {
        editor.windowManager.open(spec);
      });
    };
    return { open: open };
  };

  var register = function register(editor) {
    editor.addCommand('mceImage', Dialog(editor).open);
  };
  var Commands = { register: register };

  var hasImageClass = function hasImageClass(node) {
    var className = node.attr('class');
    return className && /\bimage\b/.test(className);
  };
  var toggleContentEditableState = function toggleContentEditableState(state) {
    return function (nodes) {
      var i = nodes.length;
      var toggleContentEditable = function toggleContentEditable(node) {
        node.attr('contenteditable', state ? 'true' : null);
      };
      while (i--) {
        var node = nodes[i];
        if (hasImageClass(node)) {
          node.attr('contenteditable', state ? 'false' : null);
          global$5.each(node.getAll('figcaption'), toggleContentEditable);
        }
      }
    };
  };
  var setup = function setup(editor) {
    editor.on('PreInit', function () {
      editor.parser.addNodeFilter('figure', toggleContentEditableState(true));
      editor.serializer.addNodeFilter('figure', toggleContentEditableState(false));
    });
  };
  var FilterContent = { setup: setup };

  var register$1 = function register$1(editor) {
    editor.ui.registry.addToggleButton('image', {
      icon: 'image',
      tooltip: 'Insert/edit image',
      onAction: Dialog(editor).open,
      onSetup: function onSetup(buttonApi) {
        return editor.selection.selectorChangedWithUnbind('img:not([data-mce-object],[data-mce-placeholder]),figure.image', buttonApi.setActive).unbind;
      }
    });
    editor.ui.registry.addMenuItem('image', {
      icon: 'image',
      text: 'Image...',
      onAction: Dialog(editor).open
    });
    editor.ui.registry.addContextMenu('image', {
      update: function update(element) {
        return isFigure(element) || isImage(element) && !Utils.isPlaceholderImage(element) ? ['image'] : [];
      }
    });
  };
  var Buttons = { register: register$1 };

  function Plugin() {
    global$1.add('image', function (editor) {
      FilterContent.setup(editor);
      Buttons.register(editor);
      Commands.register(editor);
    });
  }

  Plugin();
})(window);
//# sourceMappingURL=plugin.js.map