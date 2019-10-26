<template>
    <div class="row  mx-1  gallery">
        <div v-if="show=='list'" class="search-container d-inline-block col-12">
            <p class="divider   "><span>جستجو</span></p>
            <div class=" row col-12">
                <div class="input-group col-md-6 col-sm-6 pt-1 ">
                    <div class="input-group-prepend   btn-group-vertical p-1">
                        <i class="fa fa-search   text-primary  "></i>
                    </div>
                    <input type="text" placeholder="نام حوزه " v-model="hName" id="name-input"
                           class="my-1 py-1 pr-1 form-control border" aria-label="SearchName"
                           @keyup.enter="getHoozes();">
                    <div class=" input-group-append  btn-group-vertical   ">
                        <i class=" glyphicon glyphicon-remove text-danger  clear-btn p-1"
                           @click="hName='';getHoozes()"
                        ></i>
                    </div>
                </div>
                <div class=" mt-2  col-md-6 col-sm-6">
                    <label id="search" for="search" class="btn bg-gradient-purple   btn-block"
                           @click=" orderBy='';  getHoozes() ">
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
        <div v-if="show=='list'" class=" row col-12">

            <div class=" mt-2  col-md-6 col-sm-6">
                <label id="create" for="search" class="btn btn-success   btn-block hov-pointer"
                       :class="{'ui-state-disabled':canCreate !== '1'  }"

                       @click=" show='create' ">
                    <i class="fa fa-plus"></i> حوزه جدید
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
                            @click="orderBy='name';direction=='ASC'?direction='DESC':direction='ASC';getHoozes()">نام
                        </th>
                        <th scope="col">حوزه والد</th>
                        <th scope="col">عملیات</th>

                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="h,idx in hoozes" class=" small    ">
                        <th scope="row" class="text-center align-middle">{{h.id}}</th>
                        <td class="align-middle">{{h.name}}</td>

                        <td class="align-middle" v-if="h.parent">{{h.parent.name}}</td>
                        <td class="align-middle" v-else=""><i class="fas  fa-question-circle text-danger"></i></td>

                        <td class="align-middle">
                            <nav class="nav  justify-content-between ">

                                <div class=" p-1 nav-link text-blue hoverable  "
                                     :class="{'ui-state-disabled':canEdit !== '1' || (h.parent_id && !hooze_ids.includes(h.parent_id))}"
                                     @click="selectedHooze=h;show='edit'"> ویرایش
                                    <i class="fa fa-edit" aria-hidden="true"></i>
                                </div>

                                <div class=" p-1 nav-link text-red  hoverable  "
                                     :class="{'ui-state-disabled': canDelete!== '1'}"
                                     @click="showDialog(0,h)"> حذف
                                    <i class="fa fa-window-close" aria-hidden="true"></i>
                                </div>
                            </nav>
                        </td>

                    </tr>

                    </tbody>
                </table>
            </div>
        </div>
        <!--******  create hooze  -->
        <section class="mt-1 w-100" v-if=" show=='create'">
            <div class="search-container w-100">
                <div class="modal-header d-flex justify-content-between ">
                    <h3 class="text-primary  ">ساخت حوزه</h3>
                    <i class=" glyphicon glyphicon-remove text-danger  clear-btn p-1   "
                       @click="show='list'  "></i>
                </div>

                <div class=" row col-12">
                    <!--<p class="divider  "><span>نام مدرسه</span></p>-->
                    <div class="input-group col-md-6 col-sm-6 pt-2 ">
                        <label id="label-create-hooze-name" for="created-name-input"
                               class="  align-self-center   "> نام حوزه
                        </label>

                        <div class="input-group-prepend   btn-group-vertical p-1">
                            <i class="fa fa-search   text-primary  "></i>
                        </div>

                        <input type="text" placeholder="نام حوزه " v-model="createHoozeName"
                               id="created-name-input"
                               class="my-1 py-1 pr-1 form-control border" aria-label="SearchName">
                        <div class=" input-group-append  btn-group-vertical   ">
                            <i class=" glyphicon glyphicon-remove text-danger  clear-btn p-1"
                               @click="createHoozeName=''; "
                            ></i>
                        </div>
                    </div>

                    <div class=" input-group col-md-6 col-sm-6 pt-2">
                        <label id="label-create-parent-hooze-name"
                               class="  align-self-center   "> حوزه والد
                        </label>
                        <dropdown ref="dropdown" :data-link="this.hoozesLink" :for="'hooze'" :newable="false"
                                  :multi="false" :listID="'parent'"
                                  class=""></dropdown>
                    </div>
                </div>
                <div class="row">
                    <div class=" mt-2  col-md-6 col-sm-6">
                        <label id="label-create-btn" for="edit" class="btn btn-success   btn-block hov-pointer"
                               @click="   createHooze( ) ">
                            <i class="fa fa-plus"></i> ساخت
                        </label>
                    </div>
                    <div class=" mt-2  col-md-6 col-sm-6 ">
                        <label id="cancel-create" for="cancel-edit" class="btn btn-red   btn-block hov-pointer"
                               @click="  show='list' ">
                            <i class="fa fa-minus"></i> لغو
                        </label>
                    </div>
                </div>
            </div>
        </section>

        <!--******  edit hooze  -->
        <section class="mt-1   col-12" v-if="selectedHooze && show=='edit'">
            <div class="search-container w-100">
                <div class="modal-header d-flex justify-content-between ">
                    <h3 class="text-primary  ">ویرایش حوزه</h3>
                    <i class=" glyphicon glyphicon-remove text-danger  clear-btn p-1   "
                       @click="show='list'  "></i>
                </div>

                <div class=" row col-12">
                    <!--<p class="divider  "><span>نام مدرسه</span></p>-->
                    <div class="input-group col-md-6 col-sm-6 pt-2 ">
                        <label id="label-edit-hooze-name" for="selected-name-input"
                               class="  align-self-center   "> نام حوزه
                        </label>

                        <div class="input-group-prepend   btn-group-vertical p-1">
                            <i class="fa fa-search   text-primary  "></i>
                        </div>

                        <input type="text" placeholder="نام حوزه " v-model="selectedHooze.name"
                               id="selected-name-input"
                               class="my-1 py-1 pr-1 form-control border" aria-label="SearchName">
                        <div class=" input-group-append  btn-group-vertical   ">
                            <i class=" glyphicon glyphicon-remove text-danger  clear-btn p-1"
                               @click="selectedHooze.name=''; "
                            ></i>
                        </div>
                    </div>

                    <div class=" input-group col-md-6 col-sm-6 pt-2">
                        <label id="label-edit-parent-hooze-name"
                               class="  align-self-center   "> حوزه والد
                        </label>
                        <dropdown ref="dropdown" :data-link="this.hoozesLink" :for="'hooze'" :newable="false"
                                  :multi="false" :listID="'parent'" :beforeSelected="selectedHooze.parent_id"
                                  class=""></dropdown>
                    </div>
                </div>
                <div class="row">
                    <div class=" mt-2  col-md-6 col-sm-6">
                        <label id="edit" for="edit" class="btn btn-blue   btn-block hov-pointer"
                               @click="   editHooze(selectedHooze.id) ">
                            <i class="fa fa-search"></i> ثبت
                        </label>
                    </div>
                    <div class=" mt-2  col-md-6 col-sm-6 ">
                        <label id="cancel-edit" for="cancel-edit" class="btn btn-red   btn-block hov-pointer"
                               @click="  show='list' ">
                            <i class="fa fa-search"></i> لغو
                        </label>
                    </div>
                </div>
            </div>

        </section>
        <vue-recaptcha v-if="show=='create'|| show=='edit'" class="row col-12  mx-4"
                       ref="recaptcha"
                       @verify="onVerify"
                       :sitekey="sitekey">

        </vue-recaptcha>

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

        props: ['hoozesLink', 'sitekey', 'canCreate', 'canEdit', 'canCreate', 'canDelete', 'roles'],
        components: {

            pagination: pagination,
            VueRecaptcha,
            dropdown,
        },
        data() {
            return {
                hName: '',
                per_page: 24,
                show: 'list', //card and table
                orderBy: '',
                direction: 'ASC',
                hoozes: [],
                hooze_ids: [],
                params: null,
                selectedHooze: {},
                map: null,
                layer: null,
                bingLayer: null,
                loading: null,
                errors: '',
                recaptcha: "",
                createHoozeName: "",

            }
        },
        mounted() {

            this.setEvents();
            this.loading = $('.loading-page');
            this.getHoozes();
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
            deleteHooze(hooze) {
                this.loading.removeClass('hide');


//                console.log(this.panelLink + "/delete/s=" + school.id);
//                console.log(param);
                axios.post(this.hoozesLink + "/delete/h=" + hooze.id, {

                    id: hooze.id,

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


            cancel() {
                $("#mapModal").removeClass('show');
            },


            getHoozes() {
                this.loading.removeClass('hide');
                axios.post(this.hoozesLink, {
                    name: this.hName,
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
                            this.hoozes = response.data.data;
                            this.selectedHooze = this.hoozes[0];
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
                    this.getHoozes();
                });
//


            }
        }

    }


</script>