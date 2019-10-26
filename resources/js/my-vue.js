// import schoolCards from './components/school-cards.vue'
// import schoolCreate from './components/school-create.vue'
// import schoolEdit from './components/school-edit.vue'
import login from './components/login.vue'
import searchBox from './components/search-box.vue'
import pagination from './components/pagination.vue'
// import selector from './components/selector.vue'
import userPanel from './components/user-panel.vue'
import registerForm from './components/register.vue'
// import hoozesForm from './components/hoozes-form.vue'
// import usersForm from './components/users-form.vue'
// import reportsForm from './components/reports-form.vue'
import groups from './components/groups.vue'
import sideBar from './components/sidebar.vue'
import postList from './components/post-list.vue'
import post from './components/post.vue'

Vue.config.devtools = false;
Vue.config.debug = false;
Vue.config.silent = true;
const app = new Vue({
    el: '#app',
    mode: 'production',

    components: {
        // schoolCards,
        // schoolCreate,
        // schoolEdit,
        login,
        searchBox,
        pagination,
        // selector,
        userPanel,
        registerForm,
        // hoozesForm,
        // usersForm,
        // reportsForm,
        groups,
        sideBar,
        postList,
        post,

    }
});
