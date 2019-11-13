<template>
    <div class="row    m-panel   position-relative  ">


        <div id="sidebar" class=" col-3 col-xl-4 px-0   ">
            <!-- Sidebar -->
            <header>
                <img class="user-img" :src="getImage(user.img)" alt="">
                <a :href="panelLink">{{user.username}}</a>
            </header>
            <ul class="nav text-center">

                <li @click=" view='posts'" class=" slider-item nav-item py-2 m-1"
                    :class="{'active text-dark':view=='posts'}">
                    <span class="fa fa-book-open "></span>
                    Posts
                    <span v-if="unreadedComments>0" class="badge-pill badge-danger">{{unreadedComments}}</span>
                </li>
                <li @click="view='comments'" class=" slider-item nav-item py-2 m-1"
                    :class="{'active text-dark':view=='comments'}">
                    <span class="fa fa-comment "></span>
                    Comments
                </li>
                <li @click="view='users'" v-if="user.role=='Admin'" class=" slider-item nav-item py-2 m-1"
                    :class="{'active text-dark':view=='users'}">
                    <span class="fa fa-users "></span>
                    Users
                </li>
                <li @click="view='tags'" v-if="user.role=='Admin' || user.role=='Writer' "
                    class=" slider-item nav-item py-2 m-1" :class="{'active text-dark':view=='tags'}">
                    <span class="fa fa-tag "></span>
                    Tags
                </li>
                <li @click="view='admin'" v-if="user.role=='Admin'" class=" slider-item nav-item py-2 m-1"
                    :class="{'active text-dark':view=='admin'}">
                    <span class="fa fa-search "></span>
                    Reports
                </li>
                <li @click="view='profile'" class=" slider-item nav-item py-2 m-1"
                    :class="{'active text-dark':view=='profile'}"
                >
                    <span class="fa fa-user-tie "></span>
                    Profile

                </li>

            </ul>
        </div>
        <div class="row content offset-3 offset-xl-3  col-9">

            <div v-if="loading" class="loading-page center-block  "></div>

            <posts-panel v-if="view=='posts'"></posts-panel>
        </div>
    </div>


</template>

<script>
    const EventBus = new Vue();

    import pagination from './pagination.vue';
    import postsPanel from './posts-panel.vue';

    export default {
        components: {
            pagination,
            postsPanel,
        },
//        extends: bannerCards,

        props: ['user', 'panelLink', 'homeLink'],

        data() {
            return {
                unreadedComments: 0,
                view: 'posts',
                pName: '',
                params: {
                    post_id: null,
                    title: null,
                    tag: null,
                    group_id: null,
                    from: 'panel',
                    page: 1,
                    pagination: 24,
                    user_id: null,
                    sortBy: 'updated_at',
                    direction: 'DESC',

                },
                posts: [],
                tags: [],
                groups: [],
                comments: [],
                link: '',
                loading: false,
                paginator: null,
            }
        },
        created() {


        },
        mounted() {


        },
        updated() {

        },

        methods: {
            shorter(str, len) {
                return str.substring(0, len) + " ...";
            },
            humanTime(time) {
                return moment(time).locale('en').fromNow();
            },
            getGroup(group) {
                return group.name && group.name.length > 0 ? group.name[group.name.length - 1] : "-";
            },
            view(v) {
                let link;
                if (v === 'schools')
                    link = this.panelLink + "/" + v;
                if (v === 'users')
                    link = this.panelLink + "/" + v;
                else if (v === 'hoozes')
                    link = this.panelLink + "/" + v;
                else if (v === 'reports')
                    link = this.panelLink + "/" + v;
                window.location.href = link;
//                axios.get(link, {})
//                    .then((response) => {
//                        console.log(response);
//                        if (response.status === 200) {
//                            this.showDialog(1);
//
//                        }
//                    }).catch((error) => {
//                    this.errors += '<br>'; // maybe is not empty from javascript validate
//                    if (error.response && error.response.status === 422)
//                        for (let idx in error.response.data.errors)
//                            this.errors += error.response.data.errors[idx] + '<br>';
//                    else {
//                        this.errors = error;
//                    }
//                    this.showDialog();
////                    console.log(error);
////                    console.log(error.response);
//                });
            },
            getImage(img) {
                if (img)
                    return '/storage/img/' + img;
                else
                    return '/storage/img/user-img.png';
            },
            search(what) {

                switch (what) {
                    case 'posts':
                        this.link = this.homeLink + '/posts';
                        this.getPosts(this.params);
                        break;

                }
            },
            getDropdown(what = []) {
                this.loading = true;
                this.link = this.homeLink + '/dropdown';

                axios.post(this.link, {
                    what: what,
                })
                    .then((response) => {
                        this.loading = false;
//                        console.log(response);
                        if (response.status === 200) {
                            this.users = response.data.users;

                            let tmp = [];
                            for (let idx in response.data.tags)
                                for (let i in response.data.tags[idx])
                                    tmp.push(response.data.tags[idx][i])
                            this.tags = [...new Set(tmp)];
                            this.groups = response.data.groups;

                        }
                    }).catch((error) => {
                    this.loading = false;
//                    console.log('res error:');
                    console.log(error);
//                    this.loading.addClass('hide');
                })
            },
            getPosts(params = {
                pagination: this.params.pagination,

            }) {
                this.loading = true;

                axios.post(this.link, params)
                    .then((response) => {
                        this.loading = false;
//                        console.log(response);
                        if (response.status === 200) {
                            this.posts = response.data ? response.data.data : [];
                            this.paginator =
                                {
                                    current_page: response.data['current_page'],
                                    first_page_url: response.data['first_page_url'],
                                    next_page_url: response.data['next_page_url'],
                                    prev_page_url: response.data['prev_page_url'],
                                    last_page_url: response.data['last_page_url'],
                                    last_page: response.data['last_page'],
                                    from: response.data['from'],
                                    to: response.data['to'],
                                    total: response.data['total'],
                                };
//
                            this.$root.$emit('paginationChange', this.paginator);
                        }
                    }).catch((error) => {
                    this.loading = false;
//                    console.log('res error:');
                    console.log(error);
//                    this.loading.addClass('hide');
                })
            },
        }
    }

</script>

<style lang="scss">


</style>