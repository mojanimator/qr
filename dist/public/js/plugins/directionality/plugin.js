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

  var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools');

  var setDir = function setDir(editor, dir) {
    var dom = editor.dom;
    var curDir;
    var blocks = editor.selection.getSelectedBlocks();
    if (blocks.length) {
      curDir = dom.getAttrib(blocks[0], 'dir');
      global$1.each(blocks, function (block) {
        if (!dom.getParent(block.parentNode, '*[dir="' + dir + '"]', dom.getRoot())) {
          dom.setAttrib(block, 'dir', curDir !== dir ? dir : null);
        }
      });
      editor.nodeChanged();
    }
  };
  var Direction = { setDir: setDir };

  var register = function register(editor) {
    editor.addCommand('mceDirectionLTR', function () {
      Direction.setDir(editor, 'ltr');
    });
    editor.addCommand('mceDirectionRTL', function () {
      Direction.setDir(editor, 'rtl');
    });
  };
  var Commands = { register: register };

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
  var isFunction = isType('function');

  var nativeSlice = Array.prototype.slice;
  var from$1 = isFunction(Array.from) ? Array.from : function (x) {
    return nativeSlice.call(x);
  };

  var isSupported = function isSupported(dom) {
    return dom.style !== undefined && isFunction(dom.style.getPropertyValue);
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

  var get = function get(element, property) {
    var dom = element.dom();
    var styles = domGlobals.window.getComputedStyle(dom);
    var r = styles.getPropertyValue(property);
    var v = r === '' && !inBody(element) ? getUnsafeProperty(dom, property) : r;
    return v === null ? undefined : v;
  };
  var getUnsafeProperty = function getUnsafeProperty(dom, property) {
    return isSupported(dom) ? dom.style.getPropertyValue(property) : '';
  };

  var getDirection = function getDirection(element) {
    return get(element, 'direction') === 'rtl' ? 'rtl' : 'ltr';
  };

  var getNodeChangeHandler = function getNodeChangeHandler(editor, dir) {
    return function (api) {
      var nodeChangeHandler = function nodeChangeHandler(e) {
        var element = Element.fromDom(e.element);
        api.setActive(getDirection(element) === dir);
      };
      editor.on('NodeChange', nodeChangeHandler);
      return function () {
        return editor.off('NodeChange', nodeChangeHandler);
      };
    };
  };
  var register$1 = function register$1(editor) {
    editor.ui.registry.addToggleButton('ltr', {
      tooltip: 'Left to right',
      icon: 'ltr',
      onAction: function onAction() {
        return editor.execCommand('mceDirectionLTR');
      },
      onSetup: getNodeChangeHandler(editor, 'ltr')
    });
    editor.ui.registry.addToggleButton('rtl', {
      tooltip: 'Right to left',
      icon: 'rtl',
      onAction: function onAction() {
        return editor.execCommand('mceDirectionRTL');
      },
      onSetup: getNodeChangeHandler(editor, 'rtl')
    });
  };
  var Buttons = { register: register$1 };

  function Plugin() {
    global.add('directionality', function (editor) {
      Commands.register(editor);
      Buttons.register(editor);
    });
  }

  Plugin();
})(window);
//# sourceMappingURL=plugin.js.map