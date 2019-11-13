<template>
    <div class="row col-12">
        <div v-if="view=='list'">
            <div class="search-container   ">
                <div class="row">
                    <div class="btn-group btn-group-toggle mx-1  row col-12 justify-content-center "
                         data-toggle="buttons">
                        <label id="time-posts" for="time-posts"
                               class="btn btn-outline-light-blue btn-group-item col-xs-6  right-border active "
                               @click="params.sortBy='updated_at';params.direction=='ASC'?params.direction='DESC':params.direction='ASC';  getPosts( params)  ">
                            <input type="radio" name="options" autocomplete="off" class=" "> Time
                        </label>
                        <label id="like-posts" for="like-posts"
                               class="btn btn-outline-light-blue btn-group-item col-xs-6 left-border"
                               @click="params.sortBy='likes';params.direction=='ASC'?params.direction='DESC':params.direction='ASC'; getPosts( params)  ">
                            <input type="radio" name="options" autocomplete="off" class=" "> Like
                        </label>

                    </div>
                    <div class="form-group col-md-4">
                        <label for="tagSelect">Tag</label>
                        <select @change="getPosts( params)" class="form-control" id="tagSelect" v-model="params.tag">
                            <option value=""></option>
                            <option v-for="t in tags" :value="t">{{t}}</option>
                        </select>
                    </div>
                    <div class="form-group col-md-4">
                        <label for="groupSelect">Group</label>
                        <select @change="getPosts( params)" class="form-control" id="groupSelect"
                                v-model="params.group_id">
                            <option value=""></option>
                            <option v-for="g in groups" :value="g.id">{{g.name[g.name.length - 1]}}</option>
                        </select>
                    </div>
                    <div v-if="$parent.user.role=='Admin'" class="form-group col-md-4">
                        <label for="userSelect">User</label>
                        <select @change="getPosts( params)" class="form-control" id="userSelect"
                                v-model="params.user_id">
                            <option value=""></option>
                            <option v-for="u in users" :value="u.id">{{u.username}}</option>
                        </select>
                    </div>
                    <div class=" row col-12">
                        <div class="input-group col-md-6 col-sm-6 pt-1 ">
                            <div class="input-group-prepend   btn-group-vertical p-1">
                                <i class="fa fa-search   text-primary  "></i>
                            </div>
                            <input type="text" placeholder="Title" v-model="params.title" id="name-input"
                                   class="my-1 py-1 pr-1 form-control border" aria-label="SearchField"
                                   @keyup.enter="getPosts( params)">
                            <div class=" input-group-append  btn-group-vertical   ">
                                <i class=" glyphicon glyphicon-remove text-danger  clear-btn p-1"
                                   @click="params.title='';getPosts( params)"
                                ></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 row mt-4 d-flex ">
                        <div class="   col-md-8 col-sm-6">
                            <label id="search" for="search" class="btn bg-gradient-purple   btn-block hoverable"
                                   @click=" getPosts( params)">
                                <i class="fa fa-search"></i> Search
                            </label>
                        </div>
                        <div class=" col-md-3 col-sm-6 px-1">
                            <div class="input-group mb-3" data-toggle="tooltip" data-placement="top" title="In Page">

                                <div class="input-group-addon  px-1">
                                    <span class="input-group-text ">In Page</span>
                                </div>
                                <input type="number" class="form-control right-border px-2"
                                       aria-label="In Page"
                                       v-model="params.pagination" min="1"
                                       oninput="validity.valid" id="per-page">
                            </div>
                        </div>
                        <pagination class="col-12"></pagination>

                    </div>
                </div>
            </div>
            <!--create button-->
            <div class="  btn btn-success col-12 font-weight-bold hoverable"
                 @click="view='create'">
                <span class="fa fa-plus"></span>
                Create Post
            </div>
            <!--posts list-->
            <div class="  ">
                <div v-for="p,idx in this.posts" class="post-list-item py-3 d-flex justify-content-start">
                    <div class="m-1 flex-column">
                        <img class="user-img"
                             :src="getImage(p.user.img)"
                             :alt="p.user.username">
                        <div @click="view='edit';selectedPost=p;"
                             class="bg-green user-img text-white text-center hoverable-dark mt-1">
                            <div class="fa fa-user-edit"></div>
                        </div>
                        <div class="bg-red user-img text-white text-center hoverable-dark mt-1">
                            <div class="fa fa-trash"></div>
                        </div>
                    </div>
                    <div>
                        <div class="subtitle small font-weight-bold text-dark-blue ">
                            <a :href="$parent.homeLink+'/post/'+getGroup(p.group)+'/'+p.slug">{{p.title && p.title.length > 100 ? shorter(p.title, 100) : p.title}}</a>
                        </div>
                        <div class="subtitle small   text-blue ">
                            {{p.body && p.body.length > 300 ? shorter(p.body, 300) : p.body}}
                        </div>
                        <div class="subtitle small   text-gray d-flex justify-content-start">
                            <span class="mx-2 font-weight-bold">{{humanTime(p.updated_at) }} </span>

                            <span class=" mx-2 font-weight-bold">by: <span
                                    class="font-weight-normal"> {{p.user.username}} </span></span>

                            <span class=" mx-2 font-weight-bold">in: <span
                                    class="font-weight-normal">  {{getGroup(p.group)}} </span></span>
                            <span class=" mx-2 font-weight-bold"><span class="fa fa-tag"></span> tags:  <span
                                    class="font-weight-normal">  {{p.tags.toString()}} </span></span>
                        </div>
                        <div class="subtitle small   text-gray d-flex justify-content-start">

                            <span class=" mx-2 font-weight-bold"><span class="fa fa-thumbs-up"></span>Likes: <span
                                    class="font-weight-normal"> {{p.likes}} </span></span>

                            <span class=" mx-2 font-weight-bold"><span class="fa fa-thumbs-down"></span>Dislikes: <span
                                    class="font-weight-normal">  {{p.dislikes}} </span></span>
                            <span class=" mx-2 font-weight-bold"><span class="fa fa-clock">

                            </span>Status:
                                <span v-if="p.is_published"
                                      class="font-weight-normal btn-sm bg-success   py-0 text-white">Published
                                </span>
                                <span v-else-if="p.publish_at"
                                      class="font-weight-normal text-danger"><span
                                        class="btn-sm bg-danger   py-0 text-white">Publish: {{humanTime(p.publish_at)}}</span>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--edit post-->
        <div v-else-if="view=='edit' && selectedPost" class="search-container w-100 ">

            <label for="edit-title" class="col-md-4 col-form-label text-md-left">Title   </label>
            <input class="form-control" id="edit-title" type="text" v-model="selectedPost.title"/>
            <label for="post-body" class="col-md-4 col-form-label text-md-left">Text</label>
            <textarea class="form-control w-100" id="post-body" v-model="selectedPost.body"></textarea>
            <selector :for="'tags'" :newable="true" :selectedBefore="selectedPost.tags"
                      class=" "></selector>
        </div>
        <!--create post-->
        <div v-else-if="view=='create'" class="posts-container  "></div>


    </div>


</template>

<script>
    const EventBus = new Vue();
    import pagination from './pagination.vue';
    import selector from './selector.vue';

    export default {
        components: {
            pagination,
            selector,
        },
//        extends: bannerCards,

        props: ['user', 'panelLink', 'homeLink'],

        data() {
            return {
                unreadedComments: 0,
                view: 'list',
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
                selectedPost: null,
            }
        },
        created() {


        },
        mounted() {
            console.log('init');
            if (this.view === 'list') {
                this.getDropdown(['tags', 'groups', 'users']);
                this.getPosts(this.params);
            }
            /* else if (this.view === 'edit') {*/

//            }


        },
        updated() {
            tinymce.EditorManager.editors = [];

            tinymce.init({
                selector: "textarea#post-body",

                height: "20rem",
//                menubar: false,
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
//
                contextmenu: "link image imagetools table",
            });
        },
        beforeDestroy() {
//            tinymce.get('post-body').remove();
//            tinymce.remove();

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

            getDropdown(what = []) {
                this.loading = true;
                this.link = this.$parent.homeLink + '/dropdown';

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
            getPosts(params) {
                this.loading = true;
                this.link = this.$parent.homeLink + '/posts';
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
                            this.selectedPost = this.posts[0];
                            this.view = 'edit';
                        }
                    }).catch((error) => {
                    this.loading = false;
//                    console.log('res error:');
                    console.log(error);
//                    this.loading.addClass('hide');
                })
            },
            editPost(post) {
                this.loading = true;
                this.link = this.$parent.homeLink + '/posts/edit/' + post.id;
                axios.post(this.link, post)
                    .then((response) => {
                        this.loading = false;
//                        console.log(response);
                        if (response.status === 200) {
                            this.posts = response.data ? response.data.data : [];

                        }
                    }).catch((error) => {
                    this.loading = false;
//                    console.log('res error:');
                    console.log(error);
//                    this.loading.addClass('hide');
                })
            },
            createPost(post) {
                this.loading = true;
                this.link = this.$parent.homeLink + '/posts/create/';
                axios.post(this.link, post)
                    .then((response) => {
                        this.loading = false;
//                        console.log(response);
                        if (response.status === 200) {
//                            this.posts = response.data ? response.data.data : [];

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