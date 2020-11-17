<template>

    <div class=" card   col-12 ">
        <div class=" row  ">

            <div v-if="selected" class="modal fade" id="viewModal" tabindex="-1" role="dialog"
                 aria-labelledby="viewModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                                {{selected.title}}</h5>
                            <button type="button" class="close" data-dismiss="modal"
                                    aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <img class="w-100 thumb-container" :src="'storage/refs/'+selected.id+'.jpg'"/>
                            <!--<a :href="selected.type_id+selected.username" class=" m-1"><i-->
                            <!--class="hoverable-dark fas fa-2x  fa-link text-blue   "></i></a>-->

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-info"
                                    data-dismiss="modal"> بستن
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            <div v-if="show=='search'" class=" alert-blue border-all modal-header d-flex justify-content-start col-12 ">
                <div class=" row col-12">
                    <div class="input-group col-md-6 col-sm-6 pt-1 ">
                        <div class="input-group-prepend   btn-group-vertical p-1">
                            <i class="fa fa-search   text-primary  "></i>
                        </div>
                        <input type="text" placeholder="سوال  " v-model="sName" id="name-input"
                               class="my-1 py-1 pr-1 form-control border" aria-label="signalName"
                               @keyup="getRefs()"
                        >
                        <div class=" input-group-append  btn-group-vertical   ">
                            <i class=" glyphicon glyphicon-remove text-danger  clear-btn p-1"
                               @click="sName=''; "
                            ></i>
                        </div>
                    </div>


                    <paginator class=" row col-12"></paginator>
                </div>
            </div>


            <div class="card-body   align-content-center mt-2 mx-2  row col-12 ">
                <div class="col-12 mt-1   ">
                    <!-- signal search-->
                    <div v-if="show=='search'" class="table-responsive   ">
                        <table class="table   table-sm table-bordered table-striped   ">
                            <!--<caption> لیست سیگنال ها</caption>-->
                            <thead class="bg-gradient-blue text-center text-white  ">
                            <tr class=" ">
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='id';direction=='ASC'?direction='DESC':direction='ASC'; getRefs();">
                                </th>

                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='id';direction=='ASC'?direction='DESC':direction='ASC'; getRefs();">
                                    تصویر
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='user_id';direction=='ASC'?direction='DESC':direction='ASC'; getRefs();">
                                    کاربر
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='username';direction=='ASC'?direction='DESC':direction='ASC'; getRefs();">
                                    نام
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='title';direction=='ASC'?direction='DESC':direction='ASC'; getRefs();">
                                    عنوان
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='type_id';direction=='ASC'?direction='DESC':direction='ASC'; getRefs();">
                                    لینک
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='app_id';direction=='ASC'?direction='DESC':direction='ASC'; getRefs();">
                                    اپلیکیشن
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='is_vip';direction=='ASC'?direction='DESC':direction='ASC'; getRefs();">
                                    پین شده
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='group_id';direction=='ASC'?direction='DESC':direction='ASC'; getRefs();">
                                    گروه
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='start_time';direction=='ASC'?direction='DESC':direction='ASC'; getRefs();">
                                    تاریخ درج
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='expire_time';direction=='ASC'?direction='DESC':direction='ASC'; getRefs();">
                                    تاریخ انقضا
                                </th>


                                <th scope="col" class="align-middle">عملیات</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="s,idx in refs" class=" small  " :id="'row-'+s.id" :key="'row-'+s.id">

                                <th scope="row" class="text-center align-middle">{{s.id}}</th>

                                <td class="align-middle" v-if="s.id ">
                                    <a :href="'storage/refs/'+s.id + '.jpg'"><img :src="'storage/refs/' + s.id + '.jpg'"
                                                                                  alt="" height="50"></a>
                                </td>
                                <td v-else="" class="align-middle"><i
                                        class="fas  fa-question-circle text-danger   "></i>
                                </td>


                                <td class="align-middle" v-if="s.user">{{s.user.username}}</td>
                                <td v-else="" class="align-middle"><i
                                        class="fas  fa-question-circle text-danger   "></i>
                                </td>


                                <td v-if="s.username" class="align-middle">{{s.username}}</td>
                                <td v-else="" class="align-middle"><i
                                        class="fas  fa-minus-circle text-danger   "></i></td>

                                <td class="align-middle" v-if="s.title">{{s.title}}</td>
                                <td v-else="" class="align-middle"><i
                                        class="fas  fa-question-circle text-danger   "></i>
                                </td>


                                <td v-if="s.type_id==2" class="align-middle">
                                    <a :href="'https://instagram.com/'+s.username"><i
                                            class="fab fa-2x  fa-instagram text-pink   "></i></a>
                                </td>
                                <td v-else-if="s.type_id==1" class="align-middle">
                                    <a :href="'https://telegram.me/'+s.username"><i
                                            class="fab fa-2x  fa-telegram text-blue   "></i></a>
                                </td>
                                <td v-else="" class="align-middle"><i
                                        class="fas  fa-question-circle text-danger   "></i>
                                </td>

                                <td v-if="s.app_id" class="align-middle">{{s.app_id}}</td>
                                <td v-else="" class="align-middle"><i
                                        class="fas  fa-minus-circle text-danger   "></i></td>

                                <td v-if="s.is_vip" class="align-middle"><i
                                        class="fas fa-2x  fa-check-circle text-success   "></i></td>
                                <td v-else="" class="align-middle"><i
                                        class="fas fa-2x  fa-minus-circle text-danger   "></i></td>

                                <td v-if="s.group_id" class="align-middle">{{s.group_id}}</td>
                                <td v-else="" class="align-middle"><i
                                        class="fas fa-2x  fa-minus-circle text-danger   "></i></td>


                                <td class="align-middle" v-if="s.start_time">{{s.start_time}}</td>
                                <td v-else="" class="align-middle"><i
                                        class="fas  fa-question-circle text-danger   "></i>
                                </td>

                                <td class="align-middle" v-if="s.expire_time">{{s.expire_time}}</td>
                                <td v-else="" class="align-middle"><i
                                        class="fas  fa-question-circle text-danger   "></i>
                                </td>


                                <td class="align-middle">
                                    <nav class="nav  justify-content-between ">

                                        <div class=" p-1 nav-link text-indigo hoverable" data-toggle="modal"
                                             data-target="#viewModal"

                                             @click="selected=s; ">نمایش
                                            <i class="fa fa-eye" aria-hidden="true"></i>


                                        </div>

                                        <div class=" p-1 nav-link text-blue hoverable"
                                             :class="{'ui-state-disabled':canEdit !== '1' }"
                                             @click="selectedId=s.id;show='update'">
                                            ویرایش
                                            <i class="fa fa-edit" aria-hidden="true"></i>
                                        </div>

                                        <div v-if="confirmDelete[idx]===true"
                                             class=" p-1 nav-link text-red  hoverable "
                                             :class="{'ui-state-disabled':canDelete !== '1' }"
                                        > تایید  ?

                                            <span class=" btn btn-dark-blue" aria-hidden="true"
                                                  @click="confirmDeletes(idx ) ; ">لغو  </span>
                                            <span class=" btn btn-danger " aria-hidden="true"
                                                  @click="deleteRef(idx,s.id)  ">تایید  </span>
                                        </div>
                                        <div v-else="" class="p-1 nav-link text-red  hoverable"
                                             :class="{'ui-state-disabled':canDelete !== '1' }"
                                             @click="confirmDeletes(idx) "> حذف

                                        </div>
                                    </nav>
                                </td>


                            </tr>

                            </tbody>
                        </table>
                    </div>
                    <!--signal edit-->
                    <ref-editor
                            :edit-link="editLink"
                            :get-for-edit-link="getForEditLink"
                            :selectedId="selectedId"
                            v-if="show=='update'"
                            :types-link="typesLink"
                            :apps-link="appsLink"
                            :groups-link="groupsLink"
                    >

                    </ref-editor>
                </div>

            </div>
        </div>
    </div>


</template>

<script>

    import paginator from './pagination.vue';
    import refEditor from './ref-editor.vue';


    let self;
    export default {


        props: ['refsLink', 'deleteLink', 'editLink', 'canEdit', 'canDelete', 'canCreate', 'getForEditLink', 'typesLink', 'appsLink', 'groupsLink',],

        components: {paginator, refEditor},
        data() {
            return {
                loading: null,
                title: null,
                selected: null,
                show: 'search',
                sName: null,
                page: 1,
                orderBy: '',
                direction: 'ASC',
                refs: [],
                confirmDelete: [],
//                doc: null,

            }
        },
        watch: {
//            doc: function (val) {
////                console.log(val);
//                if (val) {
//                    this.initCropper();
//                }
//            }
        },
        computed: {
//            get_noe_faza: () => {
//                return Vue.noe_faza;
//            }
        },
        mounted() {
//            console.log(this.canEdit);
            self = this;
            this.loading = $('.loading-page');
            this.getRefs();
            this.setEvents();
//            this.uploader = $('#uploader');
//            this.qr_image = $("#qrcode");
        }
        ,
        created() {
//            this.prepareQRCreator();
        }
        ,
        updated() {


        },
        beforeUpdate() {
        }
        ,
        methods: {
            viewRef(quiz) {
                this.loading.hide();
                let text = "";
                if (quiz.question.includes('.jpg'))
                    text +=
                        `<img class="w-100 thumb-container" src="storage/refs/${quiz.id}.jpg"/>`;
                else text +=
                    `<p>${ quiz.question}<p>`;

                quiz.options.map(val => {
                    if (quiz.response === val)
                        text += `<div class="alert-success">${val}</div>`;
                    else
                        text += `<div class="alert-danger">${val}</div>`
                });


                return text;
            },
            print(str) {
                console.log(str);
            },

            clearAll() {
                location.reload();
            },
            confirmDeletes(idx) {

                for (let i = 0; i < this.refs.length; i++)
                    if (i === idx)
                        this.$set(this.confirmDelete, i, !this.confirmDelete[i]);
//                        this.confirmDelete[i] = !this.confirmDelete[i];
                    else
                        this.confirmDelete[i] = false;

//                this.$set(this.confirmDelete);

//                this.$set(arr, index, newValue)
            },
            getRefs() {
                this.loading.removeClass('hide');
                axios.post(this.refsLink, {
                    page: this.page,

                    direction: this.direction,
                    sortBy: this.orderBy,
                    name: this.sName,
                })
                    .then((response) => {
                        this.loading.addClass('hide');
                        if (response.status === 200) {
//                            console.log(response);
                            this.refs = response.data.data;

//                            this.show = 'update';
//                            this.selectedId = response.data.data[0].id;

                            this.confirmDelete = [];
                            for (let i = 0; i < this.refs.length; i++)
                                this.confirmDelete.push(false);

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

                            this.$root.$emit('paginationChange', this.paginator);
//                            this.selectedId = this.quizzes[5].id;
//                            this.show = 'update';
                        }
                    }).catch((error) => {
                    this.loading.addClass('hide');
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
                });
            },
            deleteRef(idx, signal_id) {

                axios.delete(this.deleteLink, {params: {id: signal_id}})
                    .then((response) => {
//                        console.log(response);
                        if (response.status === 200) {

                            this.$delete(this.refs, idx);
                            this.$delete(this.confirmDelete, idx);
                            this.$root.$emit('paginationChange', this.paginator);
//                            window.location.replace(this.quizzesViewLink)
                        }

                    }).catch((error) => {
                    if (error.response.status === 403) {
                        alert('فقط مالک  می تواند آن را پاک کند!');
                    }
                    else
                        alert(error + 'ناموفق!');
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
                });
            },
            setEvents() {
                this.$root.$on('paginate_click', data => {
                    this.page = data['page'];
                    this.getRefs();
                });
                this.$root.$on('search', (params) => {

                    if (params !== undefined) {
                        this.page = params['page'];
                        this.direction = null;
                        this.orderBy = null;
                        this.getRefs();
                    }

//
                });
            }
        }
    }


</script>

<style lang="scss">


    #input_qr_text::placeholder {
        font-weight: bold;
        color: #262626;
        opacity: 1;
    }

    #input_qr_text:-ms-input-placeholder {
        font-weight: bold;
        color: #262626;
        opacity: 1;
    }

    #image-crop-outline {
        z-index: 5;
    }

    #qrcode {
        z-index: 6;
    }

</style>