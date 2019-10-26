<template>

    <div class="mt-5  row  mx-3 px-4 col-md-8   ">
        <div class="post-header text-dark-blue ">{{post.title}}</div>
        <div class="post-details w-100 subtitle small   text-gray d-flex justify-content-start">
            <span class="mx-3 ">{{humanTime(post.updated_at) }}</span>
            <span class=" mx-3 ">by: <a class="btn-sm  btn-dark-blue small p-1 "
                                        :href="homeLink+'/users/'+post.user.username"> {{post.user.username}}</a></span>
            <span class=" mx-3">in: <a
                    class=" btn-sm  btn-dark-blue small p-1"
                    :href="homeLink+'/groups/'+getGroup(post.group)+'/page/1'"> {{getGroup(post.group)}}</a></span>
        </div>
        <div class="card-body">{{post.body}}</div>


        <div v-for="comment in post.comments" class="col-12 ">
            <div class="card ">
                <div class="card-body ">{{comment.body}}</div>
                <div class="card-footer p-1">
                    <div class="subtitle small   text-gray d-flex justify-content-around align-items-baseline">
                        <span class="mx-3 ">{{humanTime(comment.updated_at) }}</span>
                        <span class=" mx-3 ">by: <a class=" medium p-1 "
                                                    :href="homeLink+'/users/'+comment.user.username"> {{comment.user.username}}</a></span>
                        <span class="mx-3  btn btn-sm btn-blue  hov-pointer">Reply</span>
                    </div>
                </div>
            </div>
            <div v-for="reply in comment.replies" class="m-1">
                <div class="card-footer ml-3">
                    <div class=" ">{{reply.body}}</div>
                    <div class="subtitle small   text-gray d-flex justify-content-start">
                        <span class="mx-3 ">{{humanTime(reply.updated_at) }}</span>
                        <span class=" mx-3 ">by: <a class=" medium   p-1 "
                                                    :href="homeLink+'/users/'+reply.user.username"> {{reply.user.username}}</a></span>

                    </div>
                </div>
            </div>
        </div>
        <div class="post-details w-100">
            <span class="mx-3  btn btn-sm btn-blue  hov-pointer">Comment</span>

        </div>
    </div>

</template>

<script>

    export default {
        props: ['post', 'homeLink'],
        data() {
            return {}
        },

        computed: {},


        mounted() {
        },
        created() {
            //hoozeRequest->hoozeResponse->selectorResponse
            this.$root.$on('hoozeResponse', params => {
            });
        }
        ,
        beforeDestroy() {
        }
        ,
        updated() {


        }
        ,
        methods: {
            humanTime(time) {
                return moment(time).locale('en').fromNow();
            },
            getGroup(group) {
                return group.name && group.name.length > 0 ? group.name[group.name.length - 1] : "-";
            },
        }

    }


</script>
<style>


</style>