<template>
    <div class="row  mx-1  gallery">
        <div v-if="show=='list'" class="search-container d-inline-block col-12">
            <p class="divider   "><span>جستجو</span></p>
            <div class=" row col-12">
                <div class="input-group col-md-6 col-sm-6 pt-1 ">
                    <div class="input-group-prepend   btn-group-vertical p-1">
                        <i class="fa fa-search   text-primary  "></i>
                    </div>
                    <input type="text" placeholder="نام کاربر " v-model="name" id="name-input"
                           class="my-1 py-1 pr-1 form-control border" aria-label="SearchName"
                           @keyup.enter="orderBy= 'created_at';direction= 'DESC';getReports();">
                    <div class=" input-group-append  btn-group-vertical   ">
                        <i class=" glyphicon glyphicon-remove text-danger  clear-btn p-1"
                           @click="name='';orderBy= 'created_at';direction= 'DESC';getReports()"
                        ></i>
                    </div>
                </div>


            </div>
            <div class="row col-12">

                <div class="btn-group   btn-group-toggle    col-md-6    justify-content-center "
                     data-toggle="buttons">

                    <label class="btn   btn-outline-secondary  left-border mr-1 "
                           @click=" filter.login =!filter.login;orderBy= 'created_at';direction= 'DESC'; getReports(); ">ورود
                    </label>
                    <label class="btn   btn-outline-dark-green  no-radius mr-1 "
                           @click=" filter.create =!filter.create;orderBy= 'created_at';direction= 'DESC'; getReports();">ساخت
                    </label>
                    <label class="btn   btn-outline-dark-red  no-radius "
                           @click="filter.edit =!filter.edit;orderBy= 'created_at';direction= 'DESC';getReports(); ">ویرایش
                    </label>
                    <label class="btn   btn-outline-dark-blue   right-border ml-1"
                           @click="filter.remove =!filter.remove;orderBy= 'created_at';direction= 'DESC'; getReports();">حذف
                    </label>
                </div>
                <div class="btn-group   btn-group-toggle    col-md-6    justify-content-center "
                     data-toggle="buttons">

                    <label class="btn   btn-outline-dark-green  left-border mr-1 "
                           @click=" filter.school =!filter.school;orderBy= 'created_at';direction= 'DESC';getReports(); ">
                        مدارس
                    </label>
                    <label class="btn   btn-outline-dark-red  no-radius "
                           @click="filter.user =!filter.user;orderBy= 'created_at';direction= 'DESC'; getReports();">
                        کاربران
                    </label>
                    <label class="btn   btn-outline-dark-blue   right-border ml-1"
                           @click="filter.hooze =!filter.hooze;orderBy= 'created_at';direction= 'DESC'; getReports();">حوزه ها
                    </label>
                </div>


            </div>
            <div class="row col-12 mt-2  ">
                <div class="col-md-6 d-block d-flex align-items-center justify-content-center mt-1">
                    <date-picker :editable="false" id="date-picker" class="  "
                                 v-model="date1"
                                 @change=" orderBy= 'created_at';direction= 'DESC';getReports()"></date-picker>
                    <i class="  glyphicon glyphicon-remove text-danger  clear-btn  "
                       @click="date1='';orderBy=''; getReports() "></i>
                </div>
                <div class="   col-md-6 d-block d-flex align-items-center  justify-content-center mt-1 ">
                    <date-picker :editable="false" id="date-picker2" class="  "
                                 v-model="date2"
                                 @change="orderBy= 'created_at';direction= 'DESC';getReports()"></date-picker>
                    <i class="  glyphicon glyphicon-remove text-danger  clear-btn  "
                       @click="date2='';orderBy=''; getReports() "></i>
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
                               oninput="validity.valid" id="per-page"
                               @keyup.enter="orderBy='';getReports();"
                        >
                        <!--<div class="input-group-addon right-border">-->
                        <!--<span class="input-group-text">.00</span>-->
                        <!--</div>-->
                    </div>
                </div>
                <div class="    col-md-6 col-sm-6">
                    <label id="search" for="search" class="btn bg-gradient-purple   btn-block hov-pointer"
                           @click=" orderBy='created_at';direction='DESC';  getReports() ">
                        <i class="fa fa-search"></i> جستجو
                    </label>
                </div>

            </div>

        </div>

        <pagination class="col-12"></pagination>

        <div v-show="show=='list'" class="col-12 mt-1   ">
            <div class="table-responsive ">
                <table class="table   table-sm table-bordered table-striped   ">
                    <!--<caption> لیست مدارس</caption>-->
                    <thead class="bg-gradient-blue text-center text-white  ">
                    <tr>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='name_family';direction=='ASC'?direction='DESC':direction='ASC';getReports()">
                            نام کاربر
                        </th>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='action_target';direction=='ASC'?direction='DESC':direction='ASC';getReports()">
                            نوع فعالیت
                        </th>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='created_at';direction=='ASC'?direction='DESC':direction='ASC';getReports()">
                            تاریخ فعالیت
                        </th>


                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="r,idx in reports" class=" small    ">
                        <!--<th scope="row" class="text-center align-middle">{{h.id}}</th>-->
                        <td v-if="r.name_family" class="align-middle">{{r.name_family}}</td>
                        <td class="align-middle" v-else=""><i class="fas  fa-question-circle text-danger"></i></td>

                        <td class="align-middle" v-if="r.action_target">{{ parseAction(r.action_target)}}</td>
                        <td class="align-middle" v-else=""><i class="fas  fa-question-circle text-danger"></i></td>

                        <td class="align-middle" v-if="r.created_at">{{ r.created_at}}</td>
                        <td class="align-middle" v-else=""><i class="fas  fa-question-circle text-danger"></i></td>


                    </tr>

                    </tbody>
                </table>
            </div>
        </div>

        <pagination class="col-12"></pagination>


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
    import VuePersianDatetimePicker from 'vue-persian-datetime-picker';

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


    export default {

        props: ['reportsLink',],
        components: {

            pagination: pagination,
            datePicker: VuePersianDatetimePicker,

            dropdown,
        },
        data() {
            return {
                name: '',
                per_page: 24,
                show: 'list', //card and table
                orderBy: 'created_at',
                direction: 'DESC',
                date1: '',
                date2: '',
                param: null,
                layer: null,
                loading: null,
                reports: [],
                filter: {
                    login: false,
                    create: false,
                    edit: false,
                    remove: false,
                    school: false,
                    user: false,
                    hooze: false
                }

            }
        },
        mounted() {

            this.setEvents();
            this.loading = $('.loading-page');
            this.getReports();
//            console.log(this.canEdit === '1' ? 'y' : 'n');


        },

        created() {

        },
        updated() {

        },
        methods: {


            parseAction(report) {
                if (report === 'l')
                    return 'ورود';

                let tmp = report.split("~");
//                console.log(tmp[0]);
                let action = '', type = '', target = '';
                if (tmp.length > 1) {

                    if (tmp[0] === 'c')
                        action = ' ساخت ';
                    else if (tmp[0] === 'e')
                        action = ' ویرایش ';
                    else if (tmp[0] === 'r')
                        action = ' حذف ';

                    if (tmp[1] === 'u')
                        type = ' کاربر ';
                    else if (tmp[1] === 's')
                        type = ' مدرسه ';
                    else if (tmp[1] === 'h')
                        type = ' حوزه ';
                }
                if (tmp.length > 2) {
                    target = ' [ ' + tmp[2] + ' ] ';
                }
                return action + type + target;

            },

            showDialog(type, data) {
                // 0  ready for save
                // 1  success  save
                // else show errors
                if (type === 0)
                    swal.fire({
                        title: 'توجه',
                        text: 'حوزه حذف شود؟',
                        type: 'warning',
                        showCancelButton: true,
                        showCloseButton: true,
                        cancelButtonText: 'خیر',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: ' بله',
                    }).then((result) => {
                        if (result.value) {
                            this.deleteHooze(data);
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
                            this.getHoozes();
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

            createFilters() {
                let filter = [];
                if (!this.filter.login && !this.filter.create && !this.filter.edit && !this.filter.remove
                    && !this.filter.user && !this.filter.school && !this.filter.hooze)
                    return filter;
                else if (this.filter.login && this.filter.create && this.filter.edit && this.filter.remove
                    && this.filter.user && this.filter.school && this.filter.hooze)
                    return filter;
                if (this.filter.login)
                    filter.push('l');
                if (this.filter.create) {
                    if (this.filter.school)
                        filter.push('c_s');
                    if (this.filter.user)
                        filter.push('c_u');
                    if (this.filter.hooze)
                        filter.push('c_h');
                    if (!this.filter.hooze && !this.filter.user && !this.filter.school)
                        filter.push('c');
                }

                if (this.filter.edit) {
                    if (this.filter.school)
                        filter.push('e_s');
                    if (this.filter.user)
                        filter.push('e_u');
                    if (this.filter.hooze)
                        filter.push('e_h');
                    if (!this.filter.hooze && !this.filter.user && !this.filter.school)
                        filter.push('e');
                }

                if (this.filter.remove) {
                    if (this.filter.school)
                        filter.push('r_s');
                    if (this.filter.user)
                        filter.push('r_u');
                    if (this.filter.hooze)
                        filter.push('r_h');
                    if (!this.filter.hooze && !this.filter.user && !this.filter.school)
                        filter.push('r');
                }

                if (this.filter.school && !this.filter.create && !this.filter.edit && !this.filter.remove)
                    filter.push('s');
                if (this.filter.user && !this.filter.create && !this.filter.edit && !this.filter.remove)
                    filter.push('u');
                if (this.filter.hooze && !this.filter.create && !this.filter.edit && !this.filter.remove)
                    filter.push('h');

                return filter;
            },

            getReports() {
                this.loading.removeClass('hide');
                axios.post(this.reportsLink, {
                    name: this.name,
                    filters: this.createFilters(),
                    paginate: this.per_page,
                    page: this.page,
                    sortBy: this.orderBy,
                    direction: this.direction,
                    date1: this.date1,
                    date2: this.date2,
                })
                    .then((response) => {
                        this.loading.addClass('hide');
//                        console.log(response);
                        if (response.status === 200) {
//
                            this.reports = response.data.data;
                            if (this.reports === null || this.reports.length === 0) {
                                this.reports = [];
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
                    this.getReports();
                });
//


            }
        }

    }


</script>