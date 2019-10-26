<template>
    <div class="row  mx-1  gallery">
        <div v-if="show=='list'" class="search-container d-inline-block col-12">
            <p class="divider   "><span>جستجو</span></p>
            <div class=" row col-12">
                <div class="input-group col-md-6 col-sm-6 pt-1 ">
                    <div class="input-group-prepend   btn-group-vertical p-1">
                        <i class="fa fa-search   text-primary  "></i>
                    </div>
                    <input type="text" placeholder="نام کاربر " v-model="uName" id="name-input"
                           class="my-1 py-1 pr-1 form-control border" aria-label="SearchName"
                           @keyup.enter="getUsers();">
                    <div class=" input-group-append  btn-group-vertical   ">
                        <i class=" glyphicon glyphicon-remove text-danger  clear-btn p-1"
                           @click="uName='';getUsers()"
                        ></i>
                    </div>
                </div>
                <div class=" mt-2  col-md-6 col-sm-6">
                    <label id="search" for="search" class="btn bg-gradient-purple   btn-block hov-pointer"
                           @click=" orderBy='';  getUsers() ">
                        <i class="fa fa-search"></i> جستجو
                    </label>
                </div>

            </div>

            <div class="col-12 row mt-4 d-flex ">

                <div class=" col-md-6 col-sm-6 px-1">

                    <div class="input-group mb-3" data-toggle="tooltip" data-placement="top" title="تعداد در صفحه">
                        <div class="input-group-addon left-border p-1">
                            <span class="input-group-text ">تعداد</span>
                        </div>
                        <input type="number" class="form-control no-radius px-1"
                               aria-label="تعداد در صفحه"
                               v-model="per_page" min="1"
                               oninput="validity.valid" id="per-page">
                        <!--<div class="input-group-addon right-border">-->
                        <!--<span class="input-group-text">.00</span>-->
                        <!--</div>-->
                    </div>
                </div>
                <pagination class=" col-md-6 col-sm-6 px-1"></pagination>
            </div>

        </div>

        <!--new button-->
        <div v-show="show=='list'" class=" row col-12" :class="{'ui-state-disabled':canCreate !== '1' }">

            <div class=" mt-2  col-md-6 col-sm-6">
                <label id="create" for="search" class="btn btn-success   btn-block hov-pointer"
                       @click=" show='create' ">
                    <i class="fa fa-plus"></i> کاربر جدید
                </label>
            </div>

        </div>

        <div v-show="show=='list'" class="col-12 mt-1   ">
            <div class="table-responsive ">
                <table class="table   table-sm table-bordered table-striped   ">
                    <!--<caption> لیست مدارس</caption>-->
                    <thead class="bg-gradient-blue text-center text-white  ">
                    <tr>
                        <th scope="col">کد </th>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='name';direction=='ASC'?direction='DESC':direction='ASC';getUsers()">نام
                        </th>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='family';direction=='ASC'?direction='DESC':direction='ASC';getUsers()">
                            نام خانوادگی
                        </th>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='username';direction=='ASC'?direction='DESC':direction='ASC';getUsers()">
                            نام کاربری
                        </th>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='email';direction=='ASC'?direction='DESC':direction='ASC';getUsers()">
                            ایمیل
                        </th>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='phone_number';direction=='ASC'?direction='DESC':direction='ASC';getUsers()">
                            شماره تماس
                        </th>

                        <th scope="col">عملیات</th>

                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="u,idx in users" class=" small    ">
                        <th scope="row" class="text-center align-middle">{{u.id}}</th>

                        <td class="align-middle" v-if="u.name">{{u.name}}</td>
                        <td class="align-middle" v-else=""><i class="fas  fa-question-circle text-danger"></i></td>

                        <td class="align-middle" v-if="u.family">{{u.family}}</td>
                        <td class="align-middle" v-else=""><i class="fas  fa-question-circle text-danger"></i></td>

                        <td class="align-middle" v-if="u.username">{{u.username}}</td>
                        <td class="align-middle" v-else=""><i class="fas  fa-question-circle text-danger"></i></td>

                        <td class="align-middle" v-if="u.email">{{u.email}}</td>
                        <td class="align-middle" v-else=""><i class="fas  fa-question-circle text-danger"></i></td>

                        <td class="align-middle" v-if="u.phone_number">{{u.phone_number}}</td>
                        <td class="align-middle" v-else=""><i class="fas  fa-question-circle text-danger"></i></td>


                        <td class="align-middle">
                            <nav class="nav  justify-content-between ">

                                <div class=" p-1 nav-link text-blue hoverable  "
                                     :class="{'ui-state-disabled':canEdit !== '1' }"
                                     @click="selectedUser=u;show='edit'"> ویرایش
                                    <i class="fa fa-edit" aria-hidden="true"></i>
                                </div>

                                <div class=" p-1 nav-link text-red  hoverable  "
                                     :class="{'ui-state-disabled': canDelete!== '1'}"
                                     @click="showDialog(0,u)"> حذف
                                    <i class="fa fa-window-close" aria-hidden="true"></i>
                                </div>
                            </nav>
                        </td>

                    </tr>

                    </tbody>
                </table>
            </div>
        </div>

        <!-- create user-->
        <register-form
                v-if="show=='create'" :sitekey="sitekey" :_for="show"

                :users-link="usersLink"
                :schools-link="schoolsLink "
                :hoozes-link=" hoozesLink"
                :register-link=" registerLink">

        </register-form>

        <!-- edit user-->
        <register-form
                v-if="show=='edit'" :sitekey="sitekey" :_for="show"
                :selectedUser="selectedUser"
                :users-link="usersLink"
                :schools-link="schoolsLink "
                :hoozes-link=" hoozesLink"
                :register-link=" registerLink">

        </register-form>
    </div>


</template>

<script>
    import schoolMap from './map.vue';
    import schoolEdit from './school-edit.vue';
    import pagination from './pagination.vue';
    import schoolCreate from './school-create.vue';
    import dropdown from './dropdown.vue';
    import LayerSwitcher from 'ol-layerswitcher/dist/ol-layerswitcher';
    import VueRecaptcha from 'vue-recaptcha';
    import registerForm from './register.vue';

    //    import 'ol/ol.css';
    //    import Feature from 'ol/Feature.js';
    //    import Map from 'ol/Map.js';
    //    import Overlay from 'ol/Overlay.js';
    //    import View from 'ol/View.js';
    //    import Point from 'ol/geom/Point.js';
    //    import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
    //    import TileJSON from 'ol/source/TileJSON.js';
    //    import VectorSource from 'ol/source/Vector.js';
    //    import {Icon, Style} from 'ol/style.js';

    let map;
    let layer;
    let kerman = [57.0532, 30.2880];
    export default {

        props: ['panelLink', 'usersLink', 'schoolsLink', 'hoozesLink', 'registerLink', 'sitekey', 'canCreate', 'canEdit', 'canDelete', 'roles'],
        components: {

            pagination: pagination,
            VueRecaptcha,
            dropdown,
            registerForm,
        },
        data() {
            return {
                uName: '',
                per_page: 24,
                show: 'list', //card and table
                orderBy: '',
                direction: 'ASC',
                users: [],
                hooze_ids: [],
                params: null,
                selectedUser: {},
                map: null,
                layer: null,
                bingLayer: null,
                loading: null,
                errors: '',
                recaptcha: "",
                createUserName: "",
            }
        },
        mounted() {

            this.setEvents();
            this.loading = $('.loading-page');
            this.getUsers();
//            console.log(this.canEdit === '1' ? 'y' : 'n');


        },

        created() {

        },
        updated() {

        },
        methods: {
            onVerify(token) {
//                console.log(event);
                this.recaptcha = token;
            },
            deleteUser(user) {
                this.loading.removeClass('hide');


//                console.log(this.panelLink + "/delete/s=" + school.id);
//                console.log(param);
                axios.post(this.usersLink + "/delete", {

                    id: user.id,

                })
                    .then((response) => {
//                        console.log(response);
                        this.loading.addClass('hide');
                        if (response.status === 200) {
                            this.showDialog(1);
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
                        }

                    }).catch((error) => {
//                    console.log('res error:');
                    console.log(error);
                    this.errors = '';
                    if (error.response && error.response.status === 422)
                        for (let idx in error.response.data.errors)
                            this.errors += error.response.data.errors[idx] + '<br>';
                    else if (error.response && error.response.status === 403)
//                        for (let idx in error.response.data.message)
                        this.errors += error.response.data.message + '<br>';
                    else {
                        this.errors = error;
                    }
                    this.showDialog();
                    this.loading.addClass('hide');

                })
            },
            editHooze(id) {
                this.loading.removeClass('hide');


//                console.log(this.panelLink + "/delete/s=" + school.id);
//                console.log(this.$refs.dropdown.sData + this.$refs.dropdown.selected[0].id);
                axios.post(this.hoozesLink + "/edit/h=" + id, {

                    id: id,
                    name: this.selectedHooze.name,
                    parent_id: this.$refs.dropdown.selected.length > 0 ? this.$refs.dropdown.selected[0].id : '',
                    recaptcha: this.recaptcha,
                    type: 'edit',
                })
                    .then((response) => {
//                        console.log(response);
                        if (response.status === 200) {
//                            this.showDialog(1);

                        }
                        this.loading.addClass('hide');
                        this.$refs.recaptcha.reset();
                        location.reload();
                    }).catch((error) => {
//                    console.log('res error:');
                    console.log(error);
                    this.errors = '';
                    if (error.response && error.response.status === 422)
                        for (let idx in error.response.data.errors)
                            this.errors += error.response.data.errors[idx] + '<br>';
                    else if (error.response && error.response.status === 403)
//                        for (let idx in error.response.data.message)
                        this.errors += error.response.data.message + '<br>';
                    else {
                        this.errors = error;
                    }
                    this.showDialog();
                    this.loading.addClass('hide');
                    this.$refs.recaptcha.reset();
                })
            },
            createHooze() {
                this.loading.removeClass('hide');


//                console.log(this.panelLink + "/delete/s=" + school.id);
//                console.log(this.$refs.dropdown.sData + this.$refs.dropdown.selected[0].id);
                axios.post(this.hoozesLink + "/create", {

                    name: this.createHoozeName,
                    parent_id: this.$refs.dropdown.selected.length > 0 ? this.$refs.dropdown.selected[0].id : '',
                    recaptcha: this.recaptcha,
                    type: 'create',
                })
                    .then((response) => {
//                        console.log(response);
                        if (response.status === 200) {
//                            this.showDialog(1);

                        }
                        this.loading.addClass('hide');
                        this.$refs.recaptcha.reset();
                        location.reload();
                    }).catch((error) => {
//                    console.log('res error:');
                    console.log(error);
                    this.errors = '';
                    if (error.response && error.response.status === 422)
                        for (let idx in error.response.data.errors)
                            this.errors += error.response.data.errors[idx] + '<br>';
                    else if (error.response && error.response.status === 403)
//                        for (let idx in error.response.data.message)
                        this.errors += error.response.data.message + '<br>';
                    else {
                        this.errors = error;
                    }
                    this.showDialog();
                    this.loading.addClass('hide');
                    this.$refs.recaptcha.reset();
                })
            },
            showDialog(type, data) {
                // 0  ready for save
                // 1  success  save
                // else show errors
                if (type === 0)
                    swal.fire({
                        title: 'توجه',
                        text: 'کاربر حذف شود؟',
                        type: 'warning',
                        showCancelButton: true,
                        showCloseButton: true,
                        cancelButtonText: 'خیر',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: ' بله',
                    }).then((result) => {
                        if (result.value) {
                            this.deleteUser(data);
                        }
                    });
                else if (type === 1) {
                    swal.fire({
                        title: 'توجه',
                        text: ' با موفقیت حذف شد!',
                        confirmButtonColor: '#60aa2f',
                        type: 'success',
                        confirmButtonText: ' باشه',
                    }).then((result) => {
                        if (result.value) {
//                            location.reload();
                            this.getUsers();
                        }
                    });

                } else {
                    swal.fire({
                        title: 'خطایی رخ داد',
                        html: ` <p   class="text-danger">` + this.errors + `</p>`,
//                        text: this.errors,
                        confirmButtonColor: '#d33',
                        type: 'error',
                        confirmButtonText: ' باشه',
                    });
                }
            },


            cancel() {
                $("#mapModal").removeClass('show');
            },


            getUsers() {
                this.loading.removeClass('hide');
                axios.post(this.usersLink, {
                    name: this.uName,
                    paginate: this.per_page,
                    page: this.page,
                    sortBy: this.orderBy,
                    direction: this.direction,
                })
                    .then((response) => {
                        this.loading.addClass('hide');
//                        console.log(response);
                        if (response.status === 200) {
//
                            this.users = response.data.data;

                            if (this.users === null || this.users.length === 0) {
                                this.users = [];
//                                this.no_result.removeClass('hide');
                                if (this.page !== null && this.page > 1) {
                                    this.page = 1;
                                    this.getReports();
                                }

                            }
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

                        }
                    }).catch((error) => {
                    this.loading.addClass('hide');
                    this.errors += '<br>'; // maybe is not empty from javascript validate
                    if (error.response && error.response.status === 422)
                        for (let idx in error.response.data.errors)
                            this.errors += error.response.data.errors[idx] + '<br>';
                    else {
                        this.errors = error;
                    }
                    this.showDialog();
//                    console.log(error);
//                    console.log(error.response);
                });
            },

            setEvents() {


                this.$root.$on('hoozesChange', data => {
//                    console.log(data);
                    this.hoozes = data;
//                    this.initialize_map();
//                    this.addMarker();
                });
                this.$root.$on('viewChange', (view) => {
//                    console.log(view);
                    this.show = view;

                });
                this.$root.$on('search', (params) => {

                    if (params !== undefined)
                        this.page = params['page'];
                    this.getUsers();
                });
//


            }
        }

    }


</script>