'use strict';

var _imageCropper = require('./components/image-cropper.vue');

var _imageCropper2 = _interopRequireDefault(_imageCropper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Vue.config.devtools = false; // import reportsForm from './components/reports-form.vue'

Vue.config.debug = false;
Vue.config.silent = true;
var app = new Vue({
    el: '#app',
    mode: 'production',

    components: {
        imageCropper: _imageCropper2.default

    }
});
//# sourceMappingURL=my-vue.js.map