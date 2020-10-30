'use strict';

/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.1.0 (2019-10-17)
 */
(function () {
  'use strict';

  var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var global$1 = tinymce.util.Tools.resolve('tinymce.Env');

  var register = function register(editor) {
    editor.addCommand('mcePrint', function () {
      if (global$1.browser.isIE()) {
        editor.getDoc().execCommand('print', false, null);
      } else {
        editor.getWin().print();
      }
    });
  };
  var Commands = { register: register };

  var register$1 = function register$1(editor) {
    editor.ui.registry.addButton('print', {
      icon: 'print',
      tooltip: 'Print',
      onAction: function onAction() {
        return editor.execCommand('mcePrint');
      }
    });
    editor.ui.registry.addMenuItem('print', {
      text: 'Print...',
      icon: 'print',
      onAction: function onAction() {
        return editor.execCommand('mcePrint');
      }
    });
  };
  var Buttons = { register: register$1 };

  function Plugin() {
    global.add('print', function (editor) {
      Commands.register(editor);
      Buttons.register(editor);
      editor.addShortcut('Meta+P', '', 'mcePrint');
    });
  }

  Plugin();
})();
//# sourceMappingURL=plugin.js.map