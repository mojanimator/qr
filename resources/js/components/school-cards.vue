<template>

    <div class="row  mx-1  gallery">

        <div class="row col-12 mt-5" v-show="show=='create' || show=='edit' "></div>

        <div class="row col-12" v-show="show=='list' || show=='card' ">
            <div class="  col-md-4">

                <div class="  ">
                    <label id="create" for="create" class="btn btn-success   btn-block hov-pointer"
                           :class="{'ui-state-disabled':canCreate !== '1' }"
                           @click="lastShow=show; show='create' ;$root.$emit('changeShow','create')">
                        <i class="fa fa-plus"></i> مدرسه جدید
                    </label>
                </div>

            </div>
            <pagination class="  col-md-4"></pagination>
        </div>

        <div v-show="show=='card'" class="row mt-1">
            <div v-for="s,idx in schools" class="col-12 col-sm-6 col-md-4 col-lg-3 p-1">

                <div class="m-card h-100 d-flex align-items-end flex-column  " :key="s.id" data-toggle="modal"
                     data-target="#mapModal"
                     @click="selectedSchool=s">
                    <div class="m-card-header bg-transparent   ">

                        <div v-if="s.jensiat!=null" class="icon-container d-inline-block" data-toggle="tooltip"
                             data-placement="top"
                             title="جنسیت">
                            <div class="" v-if="s.jensiat=='b'"><i class="fas  fa-lg fa-male   "></i></div>
                            <div class="" v-else-if="s.jeniat=='g'"><i class="fas fa-lg fa-female"></i></div>
                            <div class="" v-else>
                                <i class="fas fa-lg fa-male"></i>
                                <i class="fas fa-lg fa-female"></i>
                            </div>
                        </div>
                        <div class="header-left  d-inline-block float-left  ">
                    <span class="right-border px-2 float-left  badge-pill bg-primary   small-1" data-toggle="tooltip"
                          data-placement="top"
                          title="تعداد دانش آموز">
                        {{s.tedad_daneshamooz}}
                    </span>

                            <span v-if="s.is_roozane!=null" class="  float-left px-1 text-white   small-1"
                                  :class="[s.is_roozane ?'bg-success':'bg-dark-gray']">
                        {{s.is_roozane ? "روزانه" : "شبانه"}}
                    </span>
                            <span class="left-border px-2 float-left  badge-pill text-white   small-1 bg-light-red"
                                  data-toggle="tooltip" data-placement="top" title="نوع فضا">
                        {{getType(s, "faza")}}
                    </span>
                        </div>
                        <img class="back-header-img" src="/img/card-header.png" alt="">
                        <img class="school-img" :src="getImage(s.docs)" alt="">


                    </div>

                    <!--<img v-else src="img/school-no.png" alt=""></div>-->
                    <div class="m-card-body  px-2   flex-column align-self-stretch">

                        <p class="text-purple mb-0 text-center"> {{s.name}}</p>

                        <div class="codes d-flex justify-content-center pt-1">
                            <small class="  left-border badge-pill bg-gray text-white small d-inline-block "
                            > کد مدرسه:
                                <span v-if="s.code_madrese"> {{s.code_madrese}}</span>
                                <span v-else> <i class="fas  fa-question-circle text-white"></i> </span>
                            </small>
                            <small class="  right-border badge-pill bg-dark-green text-white small d-inline-block "
                            >کد فضا:
                                <span v-if="s.code_faza"> {{s.code_faza}}</span>
                                <span v-else> <i class="fas  fa-question-circle text-white"></i> </span>
                            </small>
                        </div>

                        <div class="card-divider"></div>

                        <p class="card-text text-dark-blue">
                            <i class="fas  fa-arrow-circle-left"></i> تاسیس:
                            <span v-if="s.sale_tasis"> {{s.sale_tasis}}</span>
                            <span v-else> <i class="fas  fa-question-circle text-danger"></i> </span>
                        </p>
                        <p class="card-text text-dark-blue">
                            <i class="fas  fa-arrow-circle-left"></i>حوزه نمایندگی:
                            <span v-if="s.hooze"> {{s.hooze.name}}</span>
                            <span v-else> <i class="fas  fa-question-circle text-danger"></i> </span>
                        </p>

                        <p class="card-text text-dark-blue p-type">
                            <i class="fas  fa-arrow-circle-left"></i> {{getType(s, "kooch")}}
                            <i v-if="s.schoolable_type==='App\\Koochro'"
                               class="fas  fa-arrow-circle-left text-dark-red"></i>{{getType(s, "sayyar")}}
                        </p>
                        <p class="card-text text-dark-blue p-type">
                            <i class="fas  fa-arrow-circle-left"></i> تعداد همکاران:
                            <span v-if="s.tedad_hamkaran"> {{s.tedad_hamkaran}}</span>
                            <span v-else> <i class="fas  fa-question-circle text-danger"></i> </span>
                        </p>
                        <p class="card-text text-dark-blue p-type">
                            <i class="fas  fa-arrow-circle-left"></i> تعداد پایه تحصیلی:
                            <span v-if="s.tedad_paye_tahsili"> {{s.tedad_paye_tahsili}}</span>
                            <span v-else> <i class="fas  fa-question-circle text-danger"></i> </span>
                        </p>

                        <div class="card-divider"></div>

                        <div v-if="s.doore" class="doore">
                        <span v-for="d in s.doore.split('$')"
                              class="card-text badge-pill bg-purple text-white px-2  mx-1 d-inline-block">{{getType(d, "doore")}}</span>
                        </div>

                        <p v-if="s.vaziat!=null && s.vaziat!='m'"
                           class="vaziat card-text badge-pill text-dark-blue text-center  mt-2 "
                           @click.stop="$root.$emit('dropdownResponse',{'ids':getType(s, 'zamime_ids')})">
                            <i class="fas  fa-eye "></i>{{getType(s, "zamime")}}


                        </p>
                        <!--search button-->
                        <div class="  m-1 mt-4 d-block ">
                            <label id="search" for="search" class="btn bg-gradient-blue   btn-block"
                                   @click.stop="selectedSchool=s;lastShow=show;show='edit';$root.$emit('changeShow','edit')">
                                <i class="fa fa-edit"></i> ویرایش
                            </label>
                        </div>

                    </div>
                    <div class="m-card-footer  bg-transparent      ">
                        <img class="mb-auto  back-footer-img" src="/img/card-footer.png" alt="">
                    </div>

                </div>
            </div>

        </div>

        <div v-show="show=='list'" class="col-12 mt-1   ">
            <div class="table-responsive ">
                <table class="table   table-sm table-bordered table-striped   ">
                    <!--<caption> لیست مدارس</caption>-->
                    <thead class="bg-gradient-blue text-center text-white  ">
                    <tr>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='code_madrese';direction=='ASC'?direction='DESC':direction='ASC'; $root.$emit('search',{orderBy,direction});">
                            کد مدرسه
                        </th>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='name';direction=='ASC'?direction='DESC':direction='ASC'; $root.$emit('search',{orderBy,direction});">
                            نام
                        </th>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='code_faza';direction=='ASC'?direction='DESC':direction='ASC'; $root.$emit('search',{orderBy,direction});">
                            کد فضا
                        </th>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='sale_tasis';direction=='ASC'?direction='DESC':direction='ASC'; $root.$emit('search',{orderBy,direction});">
                            تاسیس
                        </th>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='hooze_namayandegi_id';direction=='ASC'?direction='DESC':direction='ASC'; $root.$emit('search',{orderBy,direction});">
                            حوزه نمایندگی
                        </th>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='schoolable_type';direction=='ASC'?direction='DESC':direction='ASC'; $root.$emit('search',{orderBy,direction});">
                            نوع
                        </th>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='noe_fazaye_amoozeshi';direction=='ASC'?direction='DESC':direction='ASC'; $root.$emit('search',{orderBy,direction});">
                            نوع فضا
                        </th>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='tedad_daneshamooz';direction=='ASC'?direction='DESC':direction='ASC'; $root.$emit('search',{orderBy,direction});">
                            تعداد دانش آموز
                        </th>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='tedad_hamkaran';direction=='ASC'?direction='DESC':direction='ASC'; $root.$emit('search',{orderBy,direction});">
                            تعداد همکاران
                        </th>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='doore';direction=='ASC'?direction='DESC':direction='ASC'; $root.$emit('search',{orderBy,direction});">
                            پایه تحصیلی
                        </th>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='tedad_paye_tahsili';direction=='ASC'?direction='DESC':direction='ASC'; $root.$emit('search',{orderBy,direction});">
                            تعداد پایه تحصیلی
                        </th>
                        <th scope="col" class="hov-pointer"
                            @click="orderBy='vaziat';direction=='ASC'?direction='DESC':direction='ASC'; $root.$emit('search',{orderBy,direction});">
                            ضمیمه
                        </th>
                        <th scope="col">عملیات</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="s,idx in schools" class=" small " :key="'row-'+s.id">
                        <th v-if="s.code_madrese" scope="row" class="text-center align-middle">{{s.code_madrese}}</th>
                        <th v-else="" scope="row" class="text-center align-middle"><i
                                class="fas  fa-question-circle text-danger   "></i></th>

                        <td class="align-middle" v-if="s.name">{{s.name}}</td>
                        <td v-else="" class="align-middle"><i class="fas  fa-question-circle text-danger   "></i></td>

                        <td class="align-middle" v-if="s.code_faza">{{s.code_faza}}</td>
                        <td v-else="" class="align-middle"><i class="fas  fa-question-circle text-danger   "></i></td>

                        <td class="align-middle" v-if="s.sale_tasis">{{s.sale_tasis}}</td>
                        <td v-else="" class="align-middle"><i class="fas  fa-question-circle text-danger   "></i></td>


                        <td class="align-middle" v-if="s.hooze">{{s.hooze.name}}</td>
                        <td class="align-middle" v-else=""><i class="fas  fa-question-circle text-danger"></i></td>


                        <td class="align-middle" v-if="s.schoolable_type==='App\\Saabet' ">ثابت</td>
                        <td class="align-middle" v-else-if="s.schoolable_type==='App\\Koochro' ">کوچ رو
                            {{getType(s, "sayyar")}}
                        </td>
                        <td v-else="" class="align-middle"><i class="fas  fa-question-circle text-danger   "></i></td>

                        <td class="align-middle" v-if="s.noe_fazaye_amoozeshi==='s' ">ساختمان</td>
                        <td class="align-middle" v-else-if="s.noe_fazaye_amoozeshi==='k' ">کانکس</td>
                        <td class="align-middle" v-else-if="s.noe_fazaye_amoozeshi==='c' ">چادر</td>
                        <td v-else="" class="align-middle"><i class="fas  fa-question-circle text-danger   "></i></td>

                        <td class="align-middle" v-if="s.tedad_daneshamooz">{{s.tedad_daneshamooz}}</td>
                        <td class="align-middle" v-else=""><i class="fas  fa-question-circle text-danger"></i></td>

                        <td class="align-middle" v-if="s.tedad_hamkaran">{{s.tedad_hamkaran}}</td>
                        <td class="align-middle" v-else=""><i class="fas  fa-question-circle text-danger"></i></td>

                        <td v-if="s.doore" class="align-middle">
                            <div v-for="d in s.doore.split('$')">
                                <span>{{getType(d, 'doore')}}</span>
                            </div>
                        </td>
                        <td v-else="" class="align-middle">
                            <i class="fas  fa-question-circle text-danger"></i>
                        </td>

                        <td class="align-middle" v-if="s.tedad_paye_tahsili">{{s.tedad_paye_tahsili}}</td>
                        <td class="align-middle" v-else=""><i class="fas  fa-question-circle text-danger"></i></td>

                        <td class="align-middle" v-if="s.vaziat && s.vaziat.startsWith('a')"
                            @click.stop="$root.$emit('dropdownResponse',{'ids':getType(s, 'zamime_ids')})">
                            <span class="  hoverable">است</span>
                        </td>
                        <td class="align-middle" v-else-if="s.vaziat && s.vaziat.startsWith('d')"
                            @click.stop="$root.$emit('dropdownResponse',{'ids':getType(s, 'zamime_ids')})">
                            <span class="  hoverable">دارد</span>
                        </td>
                        <td class="align-middle" v-else-if="s.vaziat && s.vaziat=='m'">
                            <span class="   "><i class="fas  fa-minus text-danger"></i></span>
                        </td>
                        <td class="align-middle" v-else=""><i class="fas  fa-question-circle text-danger"></i></td>


                        <td class="align-middle">
                            <nav class="nav  justify-content-between ">
                                <div class=" p-1 nav-link text-green hoverable" :key="s.id" data-toggle="modal"
                                     data-target="#mapModal"
                                     @click="selectedSchool=s"> نقشه
                                    <i class="fa fa-edit" aria-hidden="true"></i>
                                </div>
                                <div class=" p-1 nav-link text-blue hoverable"
                                     :class="{'ui-state-disabled':canEdit !== '1' }"
                                     @click="selectedSchool=s;lastShow=show;show='edit';$root.$emit('changeShow','edit')">
                                    ویرایش
                                    <i class="fa fa-edit" aria-hidden="true"></i>
                                </div>

                                <div class=" p-1 nav-link text-red  hoverable "
                                     :class="{'ui-state-disabled':canDelete !== '1' }"
                                     @click="showDialog(0,s)"> حذف
                                    <i class="fa fa-window-close" aria-hidden="true"></i>
                                </div>
                            </nav>
                        </td>


                    </tr>

                    </tbody>
                </table>
            </div>
        </div>

        <school_create class="mt-1" v-if=" show=='create'" :sitekey="sitekey"
                       :hoozes-link="hoozesLink"
                       :create-school-link="createSchoolLink"
                       :schools-link="schoolsLink">
        </school_create>

        <school_edit class="mt-1" v-if="selectedSchool && show=='edit'" :selectedSchool="selectedSchool"
                     :sitekey="sitekey" :hoozes-link="hoozesLink" :panel-link="panelLink" :schools-link="schoolsLink">
        </school_edit>

        <pagination class="col-12   "></pagination>

        <div class="modal fade px-2 " id="mapModal" tabindex="-1" role="dialog" aria-labelledby="mapModalLabel"
             aria-hidden="true">
            <div class="modal-dialog  max-w-full show" role="document">

                <div class="modal-content" v-if="selectedSchool">
                    <div class="modal-header  ">

                        <h5 class="modal-title text-primary "> {{selectedSchool.name}}</h5>
                        <h5 v-if="(selectedSchool.schoolable_type==='App\\Saabet' && (selectedSchool.schoolable===null||!selectedSchool.schoolable.loc)) ||
                          (selectedSchool.schoolable_type==='App\\Koochro' &&(!selectedSchool.schoolable|| !selectedSchool.schoolable.loc_yeylagh))"
                            class="modal-title text-danger "> اطلاعات مکانی موجود نیست</h5>
                        <i class="glyphicon glyphicon-remove text-danger  clear-btn" data-dismiss="modal"
                           aria-label="Close"
                           @click="cancel()">

                        </i>
                    </div>
                    <div class="modal-body   ">

                        <school_map id="map_card" :map="map"
                                    :s="selectedSchool"
                                    :editMode="false">
                        </school_map>
                        <!--:key="selectedSchool.id"-->
                        <div class="modal-footer justify-content-start text-dark-blue"
                             :key="selectedSchool.id+'-modal'">
                            <div v-if="selectedSchool.schoolable_type==='App\\Saabet'">
                                <p class="small text-primary"> آدرس <i class="fas fa-arrow-circle-left"></i>
                                    <span v-if="selectedSchool.schoolable&&selectedSchool.schoolable.address"> {{selectedSchool.schoolable.address}}</span>
                                    <span v-else> <i class="fas  fa-question-circle text-danger"></i> </span>
                                    <i class="fas fa-circle"></i> فاصله از شهرستان
                                    <i class="fas fa-arrow-circle-left"></i>
                                    <span v-if="selectedSchool.schoolable&&selectedSchool.schoolable.fasele_az_shahrestan"> {{selectedSchool.schoolable.fasele_az_shahrestan}} کیلومتر </span>
                                    <span v-else> <i class="fas  fa-question-circle text-danger"></i> </span>
                                </p>
                            </div>
                            <div v-else-if="selectedSchool.schoolable_type==='App\\Koochro'">
                                <p class="small text-primary"> آدرس ییلاق <i class="fas fa-arrow-circle-left"></i>
                                    <span v-if="selectedSchool.schoolable&&selectedSchool.schoolable.address_yeylagh"> {{selectedSchool.schoolable.address_yeylagh}}</span>
                                    <span v-else> <i class="fas  fa-question-circle text-danger"></i> </span>
                                    <i class="fas fa-circle"></i> فاصله از شهرستان
                                    <i class="fas fa-arrow-circle-left"></i>
                                    <span v-if="selectedSchool.schoolable&&selectedSchool.schoolable.fasele_az_shahrestan_yeylagh"> {{selectedSchool.schoolable.fasele_az_shahrestan_yeylagh}} کیلومتر </span>
                                    <span v-else> <i class="fas  fa-question-circle text-danger"></i> </span></p>
                                <p class="small text-danger"> آدرس قشلاق <i class="fas fa-arrow-circle-left"></i>
                                    {{selectedSchool.schoolable ? selectedSchool.schoolable.address_gheshlagh : ''}}
                                    <i class="fas fa-circle"></i> فاصله از شهرستان
                                    <i class="fas fa-arrow-circle-left"></i>
                                    <span v-if="selectedSchool.schoolable && selectedSchool.schoolable.fasele_az_shahrestan_gheshlagh"> {{selectedSchool.schoolable.fasele_az_shahrestan_gheshlagh}} کیلومتر </span>
                                    <span v-else> <i class="fas  fa-question-circle text-danger"></i> </span></p>
                                <p class="small text-dark"> مسافت کوچ <i class="fas fa-arrow-circle-left"></i>
                                    <span v-if="selectedSchool.schoolable&&selectedSchool.schoolable.masafate_kooch"> {{selectedSchool.schoolable.masafate_kooch}} کیلومتر </span>
                                    <span v-else> <i class="fas  fa-question-circle text-danger"></i> </span></p>
                            </div>

                        </div>


                    </div>
                </div>

            </div>
        </div><!--end modal for map-->

    </div>


</template>

<script>
    import pagination from './pagination.vue';
    import schoolMap from './map.vue';
    import schoolEdit from './school-edit.vue';
    import schoolCreate from './school-create.vue';
    import LayerSwitcher from 'ol-layerswitcher/dist/ol-layerswitcher';

    import Map from 'ol/Map.js';
    import {Style, Icon} from 'ol/Style.js';
    import View from 'ol/View.js';
    import {Point} from 'ol/Geom.js';
    import {Vector as VectorLayer, Group} from 'ol/Layer.js';

    import {
        OverviewMap,
        FullScreen,
        Attribution,
        ZoomToExtent,
        ScaleLine,
        Control,
        ZoomSlider,
        Zoom
    } from 'ol/Control.js';
    import Feature from 'ol/Feature.js';
    import {getWidth, getCenter} from 'ol/extent.js';
    import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
    import TileLayer from 'ol/layer/Tile.js';
    import {get as getProjection, transform, fromLonLat} from 'ol/proj.js';
    import {register} from 'ol/proj/proj4.js';
    import {OSM, TileImage, TileWMS, XYZ, Vector, BingMaps} from 'ol/source.js';
    import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS.js';
    import TileGrid from 'ol/tilegrid/TileGrid.js';
    import proj4 from 'proj4';
    import {Translate} from 'ol/interaction.js';

    let map;
    let layer;
    let kerman = [57.0532, 30.2880];
    export default {

        props: ['schoolsLink', 'panelLink', 'hoozesLink', 'sitekey', 'createSchoolLink', 'canCreate', 'canEdit', 'canDelete'],
        components: {
            pagination: pagination,
            school_map: schoolMap,
            school_edit: schoolEdit,
            school_create: schoolCreate,
        },
        data() {
            return {
                show: 'list', //card and table
                lastShow: 'list', //card and table
                orderBy: '',
                direction: 'ASC',
                schools: [],
                params: null,
                selectedSchool: null,
                map: null,
                layer: null,
                bingLayer: null,
                loading: null,
                errors: '',

            }
        },
        mounted() {
//            this.getSchools();

            this.setEvents();
            this.initialize_map();
            this.add_marker();
            this.loading = $('.loading-page');


//            console.log(ol.proj.transform(['637095', '3165881']));
        },
        created() {

        },
        updated() {

        },
        methods: {
            deleteSchool(school) {
                this.loading.removeClass('hide');


//                console.log(this.panelLink + "/delete/s=" + school.id);
//                console.log(param);
                axios.post(this.panelLink + "/delete", {

                    id: school.id,
                    schoolable_id: school.schoolable ? school.schoolable.id : 0,
                    schoolable_type: school.schoolable_type,

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
                    else {
                        this.errors = error;
                    }
                    this.showDialog();
                    this.loading.addClass('hide');

                })
            },
            showDialog(type, data) {
                // 0  ready for save
                // 1  success  save
                // else show errors
                if (type === 0)
                    swal.fire({
                        title: 'توجه',
                        text: 'مدرسه حذف شود؟',
                        type: 'warning',
                        showCancelButton: true,
                        showCloseButton: true,
                        cancelButtonText: 'خیر',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: ' بله',
                    }).then((result) => {
                        if (result.value) {
                            this.deleteSchool(data);
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
                            this.$root.$emit('search');
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

            add_marker() {
//                console.log("add marker");

                let iconFeatures = [];

                let layer;
//                layer = this.map.getLayers().getArray()[2];

                layer = this.map.getLayers().getArray()[0].getLayers().getArray()[3]; //markers layer
//                console.log(this.map.getLayers().getArray()[0]);

                let marker1 = new Feature({
                    geometry: new Point(transform(kerman, 'EPSG:4326',
                        'EPSG:3857')),
                    name: "kerman",


                });
                iconFeatures.push(marker1);
                this.map.getView().setCenter(fromLonLat(kerman), 4);


                layer.getSource().clear();
                layer.getSource().addFeatures(iconFeatures);

//                    layer.getSource().addFeature(iconFeatures[1]);
                this.map.setTarget($("#map")[0]);
                let extent = layer.getSource().getExtent();
                extent = [extent[0] - 100, extent[1] - 50, extent[2] + 50, extent[3] + 100]; //add padding to borders
                this.map.getView().fit(extent, this.map.getSize());

                this.map.getView().setZoom(15);
//                this.map.addLayer(layer);
//                this.map.renderSync();
//                this.map.render();
//                this.map.updateSize();
//                this.map.changed();


            },
            initialize_map() {
                proj4.defs('EPSG:32640', '+proj=utm +zone=40 +datum=WGS84 +units=m +no_defs');
                register(proj4);
                let proj32640 = getProjection('EPSG:32640');
                proj32640.setExtent([-833718.61, 2641854.13, 1543086.51, 4422789.27]); //iran bound(l,b,r,u)
//                console.log('init map');
//                console.log(transform(['637095', '3165881',]));

                let iconFeatures = [];

                let iconStyle = new Style({
                    image: new Icon(/** @type {olx.style.IconOptions} */ ({
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        opacity: .9,
                        src: '/img/marker-school-blue.png'
                    }))
                });
                let marker1 = new Feature({
//                    geometry: new ol.geom.Point(kerman),
                    geometry: new Point(transform(kerman, 'EPSG:4326', 'EPSG:3857')),
//                    name: this.s.name,
//                    population: this.s.hooze.name,

                });
//                marker1.setStyle(iconStyle);

                iconFeatures.push(marker1);

                if (this.map) {
                    this.map.setTarget(null);
                    this.map = null;
                }
                let vectorSource = new Vector({
                    features: [marker1]

                });
                let markersLayer = new VectorLayer({

                    source: vectorSource,
                    style: iconStyle,
                    name: "markers",
                    projection: 'EPSG:32640',
                });

                this.bingLayer = new TileLayer({
                    source: new BingMaps({
                        key: 'AodEaqQSDksfjZDM0HwxhdvJQDnj0Y6wgtaP6gi_wpDBcFMaefn8kz8bjvmFpN_s',
                        imagerySet: 'Aerial', //or 'Road', 'AerialWithLabels',
                        maxZoom: 19,
                        projection: 'EPSG:32640',
                    }),

                    name: "bingHybrid",
                    title: 'جزییات',
                });
                this.layer = new TileLayer({
                    source: new OSM(
                        {
                            projection: 'EPSG:32640',
//                            var urlTpl = 'https://{1-4}.{base}.maps.cit.api.here.com' +
//                                '/{type}/2.1/maptile/newest/{scheme}/{z}/{x}/{y}/256/png' +
//                                '?app_id={app_id}&app_code={app_code}';
//                            url: "https://a.tile.openstreetmap.org/maptile/newest/hybrid.day/{z}/{x}/{y}/256/png",
                            url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
//                            url: "http://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&s=IR&hl=fa",

                        }
                    ),
                    style: iconStyle,
                    name: "main",
                    title: 'ساده',
                });
                this.GoogleHybridlayer = new TileLayer({
                    source: new OSM(
                        {
                            projection: 'EPSG:32640',
//                            url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
//                            url: "http://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
                            url: 'https://mt0.google.com/vt/lyrs=y&hl=fa&x={x}&y={y}&z={z}&s=IR',

                        }
                    ),
                    style: iconStyle,
                    name: "googleHybrid",
                    title: 'گوگل',
                });

//                let overlayGroup = new ol.layer.Group({
//                    title: 'Overlays',
//                    layers: []
//                });

                this.map = new Map({
                    target: "map",
                    layers: [new Group({
                        title: 'لایه ها',
                        name: 'group',
                        layers: [
                            this.GoogleHybridlayer, this.layer, this.bingLayer, markersLayer
                        ]
                    }),
//                        overlayGroup
                    ],
                    view: new View({
                        center: fromLonLat(kerman),
                        zoom: 15,
                        projection: 'EPSG:32640',
                    })
                });


//
                this.map.addControl(new OverviewMap());
                this.map.addControl(new LayerSwitcher());
                this.map.addControl(new FullScreen());
                this.map.addControl(new Attribution());
//                this.map.addControl(new ZoomToExtent());
//                this.map.addControl(new ScaleLine());
                this.map.addControl(new ZoomSlider());
                this.map.addControl(new Zoom());

                let extent = vectorSource.getExtent();
                extent = [extent[0] - 100, extent[1] - 50, extent[2] + 50, extent[3] + 100]; //add padding to borders
                this.map.getView().fit(extent, this.map.getSize());

            },
            cancel() {
                $("#mapModal").removeClass('show');
            },

            getType(school, _for) {
                let text = '';
                if (_for === "kooch") {
                    if (school.schoolable_type === 'App\\Saabet')
                        text = 'نوع: ثابت';
                    else if (school.schoolable_type === 'App\\Koochro')
                        text = ' نوع: کوچ رو';
                    else
                        text = ' نوع: ---';
                }
                else if (_for === "sayyar") {
                    if (school.schoolable && school.schoolable.type === 'n')
                        text = ' نیمه سیار ';
                    else if (school.schoolable && school.schoolable.type === 's')
                        text = ' سیار ';

                }
                else if (_for === "faza") {
                    if (school.noe_fazaye_amoozeshi === 's')
                        text = ' ساختمان ';
                    else if (school.noe_fazaye_amoozeshi === 'k')
                        text = ' کانکس ';
                    else if (school.noe_fazaye_amoozeshi === 'c')
                        text = ' چادر ';
                }
                else if (_for === "zamime") {
                    if (school.vaziat && school.vaziat.startsWith('a')) //zamime ast
                        text = ' ضمیمه است ';
                    else if (school.vaziat && school.vaziat.startsWith('d')) //zamime darad
                        text = ' ضمیمه دارد ';

                }
                else if (_for === "zamime_ids") {
                    if (school.vaziat && school.vaziat !== 'm')
                        return school.vaziat.split("$").slice(1);


                }
                else if (_for === "doore") {
                    if (school === '0')
                        text = ' ابتدایی ';
                    else if (school === '1')
                        text = ' متوسطه ۱ ';
                    else if (school === '2')
                        text = ' متوسطه ۲ ';

                }
                return text;

            },
            getImage(doc) {
                if (doc.length !== 0)
                    return '/storage/' + doc[0].path;
                else
                    return "/img/school-no.png";
            },
            getSchools() {
                axios.post(this.schoolsLink, this.params)
                    .then((response) => {
//                        console.log(response);
                        if (response.status === 200) {
//
                            this.schools = response.data;

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


                this.$root.$on('schoolsChange', data => {
//                    console.log(data);
                    this.schools = data;
//                    this.initialize_map();
//                    this.addMarker();
//                    this.show = 'edit';
//                    this.selectedSchool = this.schools[8];
                });
                this.$root.$on('viewChange', (view) => {
//                    console.log(view);
                    this.show = view;

                });
//            console.log(this.data);
//            console.log(this.banners);
                //ids that start with img-
                $("img[id^='img-']").each((i, el) => {

                    let imgTag = el;
                    let img = new Image();
                    img.src = imgTag.src;
//                    imgTag.src = '';
                    $(imgTag).addClass('loading');
                    img.onload = () => {
                        imgTag.src = img.src;
                        $(imgTag).removeClass('loading');
//                imgTag.setAttribute('src', img.src);
                        // Fade out and hide the loading image.
//                $('.loading').fadeOut(100); // Time in milliseconds.
                    };
                    img.onerror = (e) => {
//                console.log(e);
                        $(imgTag).removeClass('loading');
                        $(imgTag).prop('src', './img/noimage.png');
                    };

                });


            }
        }

    }


</script>