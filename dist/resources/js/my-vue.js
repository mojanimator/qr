'use strict';

var _login = require('./components/login.vue');

var _login2 = _interopRequireDefault(_login);

var _searchBox = require('./components/search-box.vue');

var _searchBox2 = _interopRequireDefault(_searchBox);

var _pagination = require('./components/pagination.vue');

var _pagination2 = _interopRequireDefault(_pagination);

var _userPanel = require('./components/user-panel.vue');

var _userPanel2 = _interopRequireDefault(_userPanel);

var _register = require('./components/register.vue');

var _register2 = _interopRequireDefault(_register);

var _groups = require('./components/groups.vue');

var _groups2 = _interopRequireDefault(_groups);

var _sidebar = require('./components/sidebar.vue');

var _sidebar2 = _interopRequireDefault(_sidebar);

var _postList = require('./components/post-list.vue');

var _postList2 = _interopRequireDefault(_postList);

var _post = require('./components/post.vue');

var _post2 = _interopRequireDefault(_post);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import hoozesForm from './components/hoozes-form.vue'
// import usersForm from './components/users-form.vue'
// import reportsForm from './components/reports-form.vue'

// import selector from './components/selector.vue'
Vue.config.devtools = false; // import schoolCards from './components/school-cards.vue'
// import schoolCreate from './components/school-create.vue'
// import schoolEdit from './components/school-edit.vue'

Vue.config.debug = false;
Vue.config.silent = true;
var app = new Vue({
    el: '#app',
    mode: 'production',

    components: {
        // schoolCards,
        // schoolCreate,
        // schoolEdit,
        login: _login2.default,
        searchBox: _searchBox2.default,
        pagination: _pagination2.default,
        // selector,
        userPanel: _userPanel2.default,
        registerForm: _register2.default,
        // hoozesForm,
        // usersForm,
        // reportsForm,
        groups: _groups2.default,
        sideBar: _sidebar2.default,
        postList: _postList2.default,
        post: _post2.default

    }
});
//# sourceMappingURL=my-vue.js.map