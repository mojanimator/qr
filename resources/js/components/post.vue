<template>

    <div class="mt-5  row  mx-3 px-4 col-md-8   ">
        <div class="post-header text-dark-blue ">{{post.title}}</div>
        <div class="post-details w-100 subtitle small   text-gray d-flex justify-content-start align-items-baseline">
            <span class="mx-3 ">{{humanTime(post.updated_at) }}</span>

            <span class=" mx-3 ">by: <a class="btn-sm  btn-dark-red small p-1 "
                                        :href="homeLink+'/users/'+post.user.username"> {{post.user.username}}</a>

                 <a class=" small p-1 "
                    :href="homeLink+'/users/'+post.user.username">
                     <img class="user-img"
                          :src="getImage(post.user.img)"
                          :alt="post.user.username">
                 </a>
             </span>
            <span class=" mx-3">in: <a
                    class=" btn-sm  btn-dark-blue small p-1"
                    :href="homeLink+'/groups/'+getGroup(post.group)+'/page/1'"> {{getGroup(post.group)}}</a></span>
        </div>
        <div class="card-body">{{post.body}}</div>


        <div v-for="comment in post.comments" class="col-12 ">
            <div class="card my-1">
                <div class="card-body ">{{comment.body}}</div>
                <div class="card-footer p-1">
                    <div class="subtitle small   text-gray d-flex justify-content-around align-items-baseline">
                        <span class="mx-3 ">{{humanTime(comment.updated_at) }}</span>
                        <span class=" mx-3 ">by: <a class=" medium p-1 "
                                                    :href="homeLink+'/users/'+comment.user.username"> {{comment.user.username}}</a></span>
                        <span class="mx-3  btn btn-sm border-all btn-blue  hov-pointer">Reply</span>
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
        <div class="post-details w-100 mt-2">
            <span v-if="isUser" class="mb-1  btn  btn-blue  hov-pointer">Send Comment</span>
            <textarea v-if="isUser" class="form-control w-100" id="comment"></textarea>

            <div class="" v-else="">
                Please <a :href="homeLink+'/register'">Register</a> or <a :href="homeLink+'/login'">Login</a>
                For Comment
            </div>
        </div>

    </div>

</template>

<script>


    //    import 'tinymce/plugins/';

    export default {
        props: ['post', 'homeLink', 'isUser'],
        data() {
            return {}
        },

        computed: {},


        mounted() {
//            tinymce.init({
//                plugins: "lists ",
//                toolbar: "checklist copy paste",
//
//                theme: 'silver',
//                skin: 'oxide',
////                content_css: '/tinymce/skins/content/default/content.css'
////                skin_url: '/css/app'
//            });
            tinymce.init({
                selector: "textarea#comment",

                height: "20rem",
//                menubar: false,
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
//                content_css: [
//                    '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
//                    '//www.tiny.cloud/css/codepen.min.css'
//                ]
                contextmenu: "link image imagetools table",
            });


        },
        created() {
            //hoozeRequest->hoozeResponse->selectorResponse
//            this.$root.$on('hoozeResponse', params => {
//            });
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
            getImage(img) {
                if (img)
                    return '/storage/img/' + img;
                else
                    return '/storage/img/user-img.png';
            },

        }

    }


</script>
<style>


</style>