'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/******/(function (modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/var installedModules = {};
  /******/
  /******/ // The require function
  /******/function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/if (installedModules[moduleId]) {
      /******/return installedModules[moduleId].exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/var module = installedModules[moduleId] = {
      /******/i: moduleId,
      /******/l: false,
      /******/exports: {}
      /******/ };
    /******/
    /******/ // Execute the module function
    /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ // Flag the module as loaded
    /******/module.l = true;
    /******/
    /******/ // Return the exports of the module
    /******/return module.exports;
    /******/
  }
  /******/
  /******/
  /******/ // expose the modules object (__webpack_modules__)
  /******/__webpack_require__.m = modules;
  /******/
  /******/ // expose the module cache
  /******/__webpack_require__.c = installedModules;
  /******/
  /******/ // define getter function for harmony exports
  /******/__webpack_require__.d = function (exports, name, getter) {
    /******/if (!__webpack_require__.o(exports, name)) {
      /******/Object.defineProperty(exports, name, { enumerable: true, get: getter });
      /******/
    }
    /******/
  };
  /******/
  /******/ // define __esModule on exports
  /******/__webpack_require__.r = function (exports) {
    /******/if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
      /******/
    }
    /******/Object.defineProperty(exports, '__esModule', { value: true });
    /******/
  };
  /******/
  /******/ // create a fake namespace object
  /******/ // mode & 1: value is a module id, require it
  /******/ // mode & 2: merge all properties of value into the ns
  /******/ // mode & 4: return value when already ns object
  /******/ // mode & 8|1: behave like require
  /******/__webpack_require__.t = function (value, mode) {
    /******/if (mode & 1) value = __webpack_require__(value);
    /******/if (mode & 8) return value;
    /******/if (mode & 4 && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value && value.__esModule) return value;
    /******/var ns = Object.create(null);
    /******/__webpack_require__.r(ns);
    /******/Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    /******/if (mode & 2 && typeof value != 'string') for (var key in value) {
      __webpack_require__.d(ns, key, function (key) {
        return value[key];
      }.bind(null, key));
    } /******/return ns;
    /******/
  };
  /******/
  /******/ // getDefaultExport function for compatibility with non-harmony modules
  /******/__webpack_require__.n = function (module) {
    /******/var getter = module && module.__esModule ?
    /******/function getDefault() {
      return module['default'];
    } :
    /******/function getModuleExports() {
      return module;
    };
    /******/__webpack_require__.d(getter, 'a', getter);
    /******/return getter;
    /******/
  };
  /******/
  /******/ // Object.prototype.hasOwnProperty.call
  /******/__webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/
  /******/ // __webpack_public_path__
  /******/__webpack_require__.p = "/";
  /******/
  /******/
  /******/ // Load entry module and return exports
  /******/return __webpack_require__(__webpack_require__.s = 1);
  /******/
})(
/************************************************************************/
/******/{

  /***/"./resources/js/home.js":
  /*!******************************!*\
    !*** ./resources/js/home.js ***!
    \******************************/
  /*! no static exports found */
  /***/function resourcesJsHomeJs(module, exports) {

    var a = 0;
    $('.banner-anchor').click(function () {
      $('html,body').animate({
        scrollTop: $("#" + 'uploader').offset().top - 20
      }, 'slow');
    }); // $(window).scroll(function () {

    var oTop = $('#counter').offset().top - window.innerHeight;

    if (a === 0 && $(window).scrollTop() > oTop) {
      $('.counter-value').each(function () {
        var $this = $(this),
            countTo = $this.attr('data-count');
        $({
          countNum: $this.text()
        }).animate({
          countNum: countTo
        }, {
          duration: 1000,
          easing: 'swing',
          step: function step() {
            $this.text(Math.floor(this.countNum));
          },
          complete: function complete() {
            $this.text(this.countNum + "   QR Created Until Now !"); //alert('finished');
          }
        });
      });
      a = 1;
    } // });
    // ************************uploader
    // $(document).ready(function () {
    //
    //     $('input[type="file"]').ezdz();
    //
    //     console.log(document.location.hostname);
    //
    // });
    // ************************fields validation


    (function (exports) {
      function valOrFunction(val, ctx, args) {
        if (typeof val == "function") {
          return val.apply(ctx, args);
        } else {
          return val;
        }
      }

      function InvalidInputHelper(input, options) {
        input.setCustomValidity(valOrFunction(options.defaultText, window, [input]));

        function changeOrInput() {
          if (input.value == "") {
            input.setCustomValidity(valOrFunction(options.emptyText, window, [input]));
          } else {
            input.setCustomValidity("");
          }
        }

        function invalid() {
          if (input.value == "") {
            input.setCustomValidity(valOrFunction(options.emptyText, window, [input]));
          } else {
            input.setCustomValidity(valOrFunction(options.invalidText, window, [input]));
          }
        }

        input.addEventListener("change", changeOrInput);
        input.addEventListener("input", changeOrInput);
        input.addEventListener("invalid", invalid);
      }

      exports.InvalidInputHelper = InvalidInputHelper;
    })(window);

    /***/
  },

  /***/1:
  /*!************************************!*\
    !*** multi ./resources/js/home.js ***!
    \************************************/
  /*! no static exports found */
  /***/function _(module, exports, __webpack_require__) {

    module.exports = __webpack_require__( /*! D:\_laravelProjects\wallpaper\resources\js\home.js */"./resources/js/home.js");

    /***/
  }

  /******/ });
//# sourceMappingURL=home.js.map