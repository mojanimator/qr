<template>

    <div class="col-md-8 col-md-offset-2 p-4">
        <div v-for="p,idx in this.posts" class="post-list-item py-3">
            <div class="subtitle small font-weight-bold text-dark-blue ">
                <a :href="homeLink+'/post/'+getGroup(p.group)+'/'+p.slug">{{p.title && p.title.length > 100 ? shorter(p.title, 100) : p.title}}</a>
            </div>
            <div class="subtitle small   text-blue ">
                {{p.body && p.body.length > 300 ? shorter(p.body, 300) : p.body}}
            </div>
            <div class="subtitle small   text-gray d-flex justify-content-start">
                <span class="mx-3 ">{{humanTime(p.updated_at) }}</span>
                <span class=" mx-3 ">by: <a class="btn-sm  btn-dark-blue small p-1 "
                                            :href="homeLink+'/users/'+p.user.username"> {{p.user.username}}</a></span>
                <span v-if="groupTree&& groupTree.length===1" class=" mx-3">in: <a
                        class=" btn-sm  btn-dark-blue small p-1"
                        :href="homeLink+'/groups/'+getGroup(p.group)+'/page/1'"> {{getGroup(p.group)}}</a></span>
            </div>

            <!--<div class="subtitle small   text-gray d-flex justify-content-between">-->
            <!--<a :href="homeLink+'/groups/'+getGroup(p.group)">-->
            <!--{{getGroup(p.group)}}</a>-->
            <!--</div>-->
        </div>

    </div>

</template>

<script>

    export default {
        props: ['from', 'data', 'homeLink', 'groupTree'],
        data() {
            return {
                posts: [],

                paginator: null,
            }
        },

        computed: {},


        mounted() {
            console.log(this.groupTree.length);
            this.setEvents();
            this.posts = this.data ? this.data.data : [];
            this.paginator =
                {
                    current_page: this.data['current_page'],
                    first_page_url: this.data['first_page_url'],
                    next_page_url: this.data['next_page_url'],
                    prev_page_url: this.data['prev_page_url'],
                    last_page_url: this.data['last_page_url'],
                    last_page: this.data['last_page'],
                    from: this.data['from'],
                    to: this.data['to'],
                    total: this.data['total'],
                };
//
            this.$root.$emit('paginationChange', this.paginator);
            if (this.from === 'group') {
                //show posts of a group
//                this.posts = this.data ? this.data.posts : [];
//                for (let p in this.data) {
//                    if (this.data[p].posts && this.data[p].posts.length > 0) {
//                        for (let pIdx in this.data[p].posts) {
//                            this.data[p].posts[pIdx].group = this.data[p].name[this.data[p].name.length - 1];
//                        }
//                        this.posts = this.posts.concat(this.data[p].posts);
////                        console.log(this.data[p].posts);
//                    }
//                }
//                console.log(this.data.data);

            }
//            if (this.data && this.data.length > 1) //root group is shown -> show subgroup
//                this.showSubgroup = true;
        },
        created() {
        }
        ,
        beforeDestroy() {
        }
        ,
        updated() {
//            console.log('sub ' + this.showSubgroup);

        }
        ,
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
            setEvents() {
                this.$root.$on('paginate_click', data => {
                    window.location.href = this.homeLink + "/groups/" + this.groupTree[this.groupTree.length - 1] + "/page/" + data.page;

                });
            }

        }

    }


</script>
<style>


</style>