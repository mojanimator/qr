/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

// require('rtl-bootstrap');
require('bootstrap');

$ = require('jquery');
$.fn.load = function (callback) {
    jQuery(window).on("load", callback);

};

// window.$ = $.extend(require('jquery-ui'));
window.jQuery = window.$ = $.extend(require('jquery-ui/ui/widgets/slider.js'));
// require('jquery-ui/ui/widgets/slider.js');
window.Vue = require('vue/dist/vue.common');
// window.Vue = require('vue');
window.axios = require('axios');


require('dropzone');
window.moment = require('moment');
require('@fortawesome/fontawesome-free/js/all');
require('./my-vue');
window.swal = require('sweetalert2');
require('lity');
// $(document).ready(() => {
window.captcha = require('jquery-captcha');


// });
// require('jquery-captcha/dist/jquery-captcha.min');
// require('ol-layerswitcher/dist/ol-layerswitcher');
// require('ol-layerswitcher/src/ol-layerswitcher');

// require('./slider-range');

// require('./footer-reveal.min');
// require('./home');


