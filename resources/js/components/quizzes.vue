<template>

    <div class=" card   col-12 ">
        <div class=" row  ">

            <div v-if="selectedQuiz" class="modal fade" id="viewModal" tabindex="-1" role="dialog"
                 aria-labelledby="viewModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                                {{selectedQuiz.name}}</h5>
                            <button type="button" class="close" data-dismiss="modal"
                                    aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div v-html="viewQuiz(selectedQuiz)" class="modal-body">


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
                               @keyup="getQuizzes()"
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
                                    @click="orderBy='id';direction=='ASC'?direction='DESC':direction='ASC'; getQuizzes();">
                                </th>

                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='question';direction=='ASC'?direction='DESC':direction='ASC'; getQuizzes();">
                                    سوال
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='response';direction=='ASC'?direction='DESC':direction='ASC'; getQuizzes();">
                                    جواب
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='is_predict';direction=='ASC'?direction='DESC':direction='ASC'; getQuizzes();">
                                    پیش بینی
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='app_id';direction=='ASC'?direction='DESC':direction='ASC'; getQuizzes();">
                                    اپ
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='type_id';direction=='ASC'?direction='DESC':direction='ASC'; getQuizzes();">
                                    نوع
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='shows_at';direction=='ASC'?direction='DESC':direction='ASC'; getQuizzes();">
                                    تاریخ نمایش
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='expires_at';direction=='ASC'?direction='DESC':direction='ASC'; getQuizzes();">
                                    تاریخ انقضا
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='created_at';direction=='ASC'?direction='DESC':direction='ASC'; getQuizzes();">
                                    تاریخ ساخت
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='responses';direction=='ASC'?direction='DESC':direction='ASC'; getQuizzes();">
                                    تعداد پاسخ
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='responses';direction=='ASC'?direction='DESC':direction='ASC'; getQuizzes();">
                                    درصد پاسخ صحیح
                                </th>
                                <th scope="col" class="hov-pointer align-middle"
                                    @click="orderBy='score';direction=='ASC'?direction='DESC':direction='ASC'; getQuizzes();">
                                    امتیاز سوال
                                </th>


                                <th scope="col" class="align-middle">عملیات</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="s,idx in quizzes" class=" small  " :id="'row-'+s.id" :key="'row-'+s.id">

                                <th scope="row" class="text-center align-middle">{{s.id}}</th>

                                <td class="align-middle" v-if="s.question.includes('.jpg')">
                                    <a :href="'storage/quiz/'+s.question">{{'storage/quiz/' + s.question}}</a>
                                </td>
                                <td class="align-middle" v-else="">{{s.question.substring(0, 30) + '...'}}</td>


                                <td class="align-middle" v-if="s.response">{{s.response}}</td>
                                <td v-else="" class="align-middle"><i
                                        class="fas  fa-question-circle text-danger   "></i>
                                </td>


                                <td v-if="s.is_predict" class="align-middle"><i
                                        class="fas  fa-check-circle text-success   "></i></td>
                                <td v-else="" class="align-middle"><i
                                        class="fas  fa-minus-circle text-danger   "></i></td>

                                <td class="align-middle" v-if="s.app_id">{{s.app_id}}</td>
                                <td v-else="" class="align-middle"><i
                                        class="fas  fa-question-circle text-danger   "></i>
                                </td>

                                <td class="align-middle" v-if="s.type_id">{{s.type_id}}</td>
                                <td v-else="" class="align-middle"><i
                                        class="fas  fa-question-circle text-danger   "></i>
                                </td>

                                <td class="align-middle" v-if="s.shows_at">{{s.shows_at}}</td>
                                <td v-else="" class="align-middle"><i
                                        class="fas  fa-question-circle text-danger   "></i>
                                </td>

                                <td class="align-middle" v-if="s.expires_at">{{s.expires_at}}</td>
                                <td v-else="" class="align-middle"><i
                                        class="fas  fa-question-circle text-danger   "></i>
                                </td>

                                <td class="align-middle" v-if="s.created_at">{{s.created_at}}</td>
                                <td v-else="" class="align-middle"><i
                                        class="fas  fa-question-circle text-danger   "></i>
                                </td>

                                <td class="align-middle" v-if="s.responded">{{s.responded }}</td>
                                <td v-else="" class="align-middle"><i
                                        class="fas  fa-question-circle text-danger   "></i>
                                </td>

                                <td class="align-middle" v-if="s.responded>0">{{(s.trues / s.responded).toFixed(2)}}
                                </td>
                                <td v-else="" class="align-middle"><i
                                        class="fas  fa-question-circle text-danger   "></i>
                                </td>

                                <td class="align-middle" v-if="s.score">{{s.score}}</td>
                                <td v-else="" class="align-middle"><i
                                        class="fas  fa-question-circle text-danger   "></i>
                                </td>


                                <td class="align-middle">
                                    <nav class="nav  justify-content-between ">

                                        <div class=" p-1 nav-link text-indigo hoverable" data-toggle="modal"
                                             data-target="#viewModal"

                                             @click="selectedQuiz=s; ">نمایش
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
                                                  @click="deleteQuiz(idx,s.id)  ">تایید  </span>
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
                    <quiz-editor
                            :edit-link="editLink"
                            :get-for-edit-link="getForEditLink"
                            :selectedId="selectedId"
                            v-if="show=='update'"
                            :types-link="typesLink"
                            :apps-link="appsLink"
                    >

                    </quiz-editor>
                </div>

            </div>
        </div>
    </div>


</template>

<script>

    import paginator from './pagination.vue';
    import quizEditor from './quiz-editor.vue';


    let self;
    export default {


        props: ['quizzesLink', 'deleteLink', 'editLink', 'canEdit', 'canDelete', 'canCreate', 'getForEditLink', 'typesLink', 'appsLink',],

        components: {paginator, quizEditor},
        data() {
            return {
                loading: null,
                selectedQuiz: null,
                show: 'search',
                sName: null,
                page: 1,
                orderBy: 'id',
                direction: 'DESC',
                quizzes: [],
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
            this.getQuizzes();
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
            viewQuiz(quiz) {
                this.loading.hide();
                let text = "";
                if (quiz.question.includes('.jpg'))
                    text +=
                        `<img class="w-100 thumb-container" src="storage/quiz/${quiz.question}"/>`;
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

                for (let i = 0; i < this.quizzes.length; i++)
                    if (i === idx)
                        this.$set(this.confirmDelete, i, !this.confirmDelete[i]);
//                        this.confirmDelete[i] = !this.confirmDelete[i];
                    else
                        this.confirmDelete[i] = false;

//                this.$set(this.confirmDelete);

//                this.$set(arr, index, newValue)
            },
            getQuizzes() {
                this.loading.removeClass('hide');
                axios.post(this.quizzesLink, {
                    page: this.page,
                    direction: this.direction,
                    sortBy: this.orderBy,
                    name: this.sName,
                })
                    .then((response) => {
                        this.loading.addClass('hide');
                        if (response.status === 200) {
//
                            this.quizzes = response.data.data;
                            this.confirmDelete = [];
                            for (let i = 0; i < this.quizzes.length; i++)
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
            deleteQuiz(idx, signal_id) {

                axios.delete(this.deleteLink, {params: {id: signal_id}})
                    .then((response) => {
//                        console.log(response);
                        if (response.status === 200) {

                            this.$delete(this.quizzes, idx);
                            this.$delete(this.confirmDelete, idx);
                            this.$root.$emit('paginationChange', this.paginator);
//                            window.location.replace(this.quizzesViewLink)
                        }

                    }).catch((error) => {
                    if (error.response.status === 403) {
                        alert('فقط مالک  می تواند آن را پاک کند!');
                    }
                    else
                        alert('ناموفق!');
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
                    this.getQuizzes();
                });
                this.$root.$on('search', (params) => {

                    if (params !== undefined) {
                        this.page = params['page'];
                        this.direction = null;
                        this.orderBy = null;
                        this.getQuizzes();
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