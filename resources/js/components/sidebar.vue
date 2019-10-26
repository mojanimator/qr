<template>

    <div class="sidebar ">

        <div class="last-posts-container p-1 m-2  border-all">

            <div v-for="post in latest_posts" class="post-list-item   p-1 ">
                <div class="subtitle small font-weight-bold text-dark-blue ">
                    <a :href="homeLink+'/post/'+getGroup(post.group)+'/'+post.slug">
                        {{post.title && post.title.length > 30 ? shorter(post.title, 30) : post.title}}
                    </a>
                </div>
                <div class="subtitle small   text-blue ">
                    {{post.body && post.body.length > 40 ? shorter(post.body, 40) : post.body}}
                </div>
                <div class="subtitle small   text-gray d-flex justify-content-between">
                    <span class=" ">{{humanTime(post.updated_at) }}</span>
                    <span class=" ">by: <a
                            :href="homeLink+'/users/'+post.user.username"> {{post.user.username}}</a></span>
                </div>

                <div class="subtitle small   text-gray d-flex justify-content-between">

                    <!--<slot name="group-link"></slot>-->
                    <!--<span class=" ">in:-->
                    <!--<span-->
                    <!--class="hoverable"-->
                    <!--@click="getView('post.group',getGroup(post.group))">-->
                    <!--{{getGroup(post.group)}}-->
                    <!--</span>-->
                    <!--</span>-->
                    <!--<a :href="getView('post.group',getGroup(post.group))"> {{getGroup(post.group)}}</a>-->
                    <a :href="homeLink+'/groups/'+getGroup(post.group)+'/page/1'">
                        {{getGroup(post.group)}}</a>
                    <!--<span @click="getView('','')"> {{getGroup(post.group)}}</span>-->
                </div>

            </div>

        </div>


    </div>

</template>

<script>

    export default {
        props: ['latestPostsLink', 'homeLink'],
        data() {
            return {
                latest_posts: []
            }
        },

        computed: {},


        mounted() {
            this.getLatestPosts(5);
        },
        created() {
        }
        ,
        beforeDestroy() {

        }
        ,
        updated() {


        }
        ,
        methods: {
            getLatestPosts(num) {
                axios.post(this.latestPostsLink, {

                    'num': num,

                })
                    .then((response) => {
                        console.log(response);
//                        this.loading.addClass('hide');
                        if (response.status === 200) {
                            this.latest_posts = response.data;
                        }

                    }).catch((error) => {
//                    console.log('res error:');
                    console.log(error);
//                    this.loading.addClass('hide');

                })
            },
            getView(_for, param) {
//                let link;
//                switch (_for) {
//                    case 'post.group':
//                        let base = '{{ route("post.group",":group") }}';
//                        link = base.replace(':group', param);
//
//                        break;
//                }
//                return link;
//                window.location.href = link;
                axios.get(this.homeLink);
//
            },
            shorter(str, len) {
                return str.substring(0, len) + " ...";
            },
            humanTime(time) {
                return moment(time).locale('en').fromNow();
            },
            getGroup(group) {
                return group.name && group.name.length > 0 ? group.name[group.name.length - 1] : "-";
            },

        }

    }


</script>
<
style
lang = "scss" >


< /style>