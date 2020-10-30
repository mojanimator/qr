'use strict';

var _quizUploader = require('./components/quiz-uploader.vue');

var _quizUploader2 = _interopRequireDefault(_quizUploader);

var _imageUploader = require('./components/image-uploader.vue');

var _imageUploader2 = _interopRequireDefault(_imageUploader);

var _wallpaperCards = require('./components/wallpaper-cards.vue');

var _wallpaperCards2 = _interopRequireDefault(_wallpaperCards);

var _quizzes = require('./components/quizzes.vue');

var _quizzes2 = _interopRequireDefault(_quizzes);

var _quizEditor = require('./components/quiz-editor.vue');

var _quizEditor2 = _interopRequireDefault(_quizEditor);

var _refs = require('./components/refs.vue');

var _refs2 = _interopRequireDefault(_refs);

var _refEditor = require('./components/ref-editor.vue');

var _refEditor2 = _interopRequireDefault(_refEditor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Vue.config.devtools = false; // import reportsForm from './components/reports-form.vue'

Vue.config.debug = false;
Vue.config.silent = true;
var app = new Vue({
    el: '#app',
    mode: 'production',

    components: {
        imageUploader: _imageUploader2.default,
        quizUploader: _quizUploader2.default,
        wallpaperCards: _wallpaperCards2.default,
        quizzes: _quizzes2.default,
        quizEditor: _quizEditor2.default,
        refs: _refs2.default,
        refEditor: _refEditor2.default

    }
});
//# sourceMappingURL=my-vue.js.map