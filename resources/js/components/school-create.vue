<template>

    <div class="search-container">
        <div class="modal-header d-flex justify-content-between ">
            <h3 class="text-primary  ">ساخت مدرسه</h3>
            <i class=" glyphicon glyphicon-remove text-danger  clear-btn p-1   "
               @click="$parent.show=$parent.lastShow ;$root.$emit('changeShow','search')"></i>
        </div>
        <div class=" row col-12">

            <!--<p class="divider  "><span>نام مدرسه</span></p>-->
            <div class="input-group col-md-6 col-sm-6 pt-1 ">
                <div class="input-group-prepend   btn-group-vertical p-1">
                    <i class="fa fa-search   text-primary  "></i>
                </div>
                <input type="text" placeholder="نام مدرسه " v-model="sName" id="name-input"
                       class="my-1 py-1 pr-1 form-control border" aria-label="SearchName">
                <div class=" input-group-append  btn-group-vertical   ">
                    <i class=" glyphicon glyphicon-remove text-danger  clear-btn p-1"
                       @click="sName=''; "
                    ></i>
                </div>
            </div>

            <!--hoozes-->
            <dropdown ref="dropdown" :data-link="this.hoozesLink" :for="'hooze'" :newable="true" :multi="false"
                      class="col-md-6 col-sm-6 "></dropdown>

            <div class="col-md-6 col-sm-6 my-1">
                <p class="divider text-center "><span>کد مدرسه</span></p>
                <div class="input-container text-center my-1 px-5">
                    <input type="number" v-model="code_madrese"
                           oninput="validity.valid" id="code-madrese-input"
                           class="form-control   badge-pill"
                    />

                </div>
            </div>

            <div class="col-md-6 col-sm-6 my-1">
                <p class="divider text-center "><span>کد فضا</span></p>
                <div class="input-container text-center my-1 px-5">
                    <input type="number" v-model="code_faza"
                           oninput="validity.valid" id="code-faza-input"
                           class=" form-control  badge-pill"
                    />
                </div>
            </div>

            <div class="col-md-6 col-sm-6 my-1">
                <p class="divider text-center "><span>سال تاسیس</span></p>
                <div class="input-container text-center my-1 px-5">
                    <input type="number" v-model="sale_tasis" min="1300"
                           oninput="validity.valid" id="sal-input"
                           class="  form-control badge-pill"
                    />
                </div>
            </div>

            <div class="col-md-6 col-sm-6 my-1">
                <p class="divider text-center "><span>تعداد دانش آموز</span></p>
                <div class="input-container text-center my-1 px-5">
                    <input type="number" v-model="tedad_daneshamooz"
                           oninput="validity.valid" id="tedad-input"
                           class=" form-control  badge-pill"
                    />
                </div>
            </div>

            <div class="col-md-6 col-sm-6 my-1">
                <p class="divider text-center "><span>تعداد پایه تحصیلی</span></p>
                <div class="input-container text-center my-1 px-5">
                    <input type="number" v-model="tedad_paye_tahsili"
                           oninput="validity.valid" id="tedad-paye-input"
                           class=" form-control  badge-pill"
                    />
                </div>
            </div>

            <div class="col-md-6 col-sm-6 my-1">
                <p class="divider text-center "><span>تعداد همکاران</span></p>
                <div class="input-container text-center my-1 px-5">
                    <input type="number" v-model="tedad_hamkaran"
                           oninput="validity.valid" id="tedad-hamkaran-input"
                           class=" form-control  badge-pill "
                    />
                </div>
            </div>

            <div class="toggle-container filters-container col-12 row   rounded p-2 mx-2 border-1 border-primary">
                <div class="btn-group btn-group-toggle    col-md-6  justify-content-center   "
                     data-toggle="buttons">
                    <label id="roozane" for="roozane"
                           class="btn btn-outline-success  col-xs-6   left-border   "
                           @click="is_roozane=true;  ">
                        <input type="radio" name="options" autocomplete="off" class=" ">روزانه
                    </label>
                    <label id="shabane" for="shabane"
                           class="btn btn-outline-dark  col-xs-6   right-border  "
                           @click=" is_roozane=false ;">
                        <input type="radio" name="options" autocomplete="off" class=" ">شبانه
                    </label>
                </div>

                <div class="btn-group   btn-group-toggle    col-md-6    justify-content-center "
                     data-toggle="buttons">

                    <label class="btn   btn-outline-dark-green  left-border mr-1 "
                           @click=" doore['ebte']=!doore['ebte']; "> ابتدایی
                    </label>
                    <label class="btn   btn-outline-dark-red  no-radius "
                           @click="doore['mote1']=!doore['mote1']; "> متوسطه ۱
                    </label>
                    <label class="btn   btn-outline-dark-blue   right-border ml-1"
                           @click="doore['mote2']=!doore['mote2']; "> متوسطه ۲
                    </label>
                </div>

                <div class="btn-group   btn-group-toggle    col-md-6    justify-content-center "
                     data-toggle="buttons">
                    <label class="btn   btn-outline-dark-green  left-border mr-1 "
                           @click=" jensiat['b']=!jensiat['b']; "> پسرانه
                    </label>
                    <label class="btn   btn-outline-dark-red  right-border  "
                           @click="jensiat['g']=!jensiat['g']; ">دخترانه
                    </label>
                </div>

                <div class="btn-group btn-group-toggle    col-md-6  justify-content-center   "
                     data-toggle="buttons">
                    <label id="chador" for="chador"
                           class="btn btn-outline-dark-green  col-xs-6   left-border   "
                           @click="noe_faza='c'; ">
                        <input type="radio" name="options" autocomplete="off" class=" ">چادر
                    </label>
                    <label id="kanex" for="kanex"
                           class="btn btn-outline-dark-red  col-xs-6   no-radius  "
                           @click=" noe_faza='k';">
                        <input type="radio" name="options" autocomplete="off" class=" ">کانکس
                    </label>
                    <label id="sakhteman" for="sakhteman"
                           class="btn btn-outline-dark-blue  col-xs-6   right-border  "
                           @click=" noe_faza='s'; ">
                        <input type="radio" name="options" autocomplete="off" class=" ">ساختمان
                    </label>
                </div>
            </div>

            <!--mostaghel zamime-->
            <div class="toggle-container filters-container col-12  rounded p-2 mx-2 border-1 border-primary mt-3  ">
                <div class="  filters-container col-12 row  mt-4">
                    <div class="btn-group btn-group-toggle     col-md-6  justify-content-center   "
                         data-toggle="buttons">
                        <label id="mostaghel" for="mostaghel"
                               class="btn btn-outline-dark-green  col-xs-6   left-border   "
                               @click=" params.vaziat='m';  ">
                            <input type="radio" name="options" autocomplete="off" class=" ">مستقل
                        </label>
                        <label id="zamd" for="zamd"
                               class="btn btn-outline-dark-red  col-xs-6   no-radius  "
                               @click=" params.vaziat='d' ;  ">
                            <input type="radio" name="options" autocomplete="off" class=" ">ضمیمه دارد
                        </label>
                        <label id="zama" for="zama"
                               class="btn btn-outline-dark-blue  col-xs-6   right-border  "
                               @click=" params.vaziat='a' ;   ">
                            <input type="radio" name="options" autocomplete="off" class=" ">ضمیمه است
                        </label>
                    </div>
                </div>
                <div class=" "
                     v-if="params.vaziat=='d' || params.vaziat=='a'">
                    <!--schools-->
                    <selector ref="selector" :data-link="this.schoolsLink" :for="'school'" :newable="true"
                              class=" "></selector>
                </div>
            </div>

            <div class="toggle-container filters-container col-12 row   rounded p-2 mt-2 mx-2 border-1 border-primary">

                <!--saabet koochroo-->
                <div class=" btn-group btn-group-toggle    col-12  justify-content-center mt-4  px-5 "
                     data-toggle="buttons">
                    <label id="saabet" for="roozane"
                           class="btn btn-outline-success    col-md-6    left-border   active"
                           @click=" schoolable_type= 'App\\Saabet' ;marker('del',2); ">
                        <input type="radio" name="options" autocomplete="off" class=" ">ثابت
                    </label>
                    <label id="koochroo" for="shabane"
                           class="btn btn-outline-dark    col-md-6    right-border  "
                           @click=" schoolable_type= 'App\\Koochro'; marker('add',2);">
                        <input type="radio" name="options" autocomplete="off" class=" ">کوچ رو
                    </label>
                </div>


                <div id="map" class="map container-fluid "></div>

                <!--sayyar nimesayyar-->
                <div v-if="schoolable_type== 'App\\Koochro'"
                     class=" btn-group btn-group-toggle    col-12  justify-content-center mt-4  px-5 "
                     data-toggle="buttons">
                    <label id="sayyar" for="sayyar"
                           class="btn btn-outline-success    col-md-6    left-border    "
                           @click=" koochro_type= 's' ;  ">
                        <input type="radio" name="options" autocomplete="off" class=" ">سیار
                    </label>
                    <label id="nime-sayyar" for="nime-sayyar"
                           class="btn btn-outline-dark    col-md-6    right-border  "
                           @click=" koochro_type= 'n';  ">
                        <input type="radio" name="options" autocomplete="off" class=" ">نیمه سیار
                    </label>
                </div>

                <div class="row col-12">
                    <div class="loc-container   col-md-6 col-sm-6">
                        <p class="divider   ">
                            <span class="text-primary"> {{schoolable_type == 'App\\Saabet' ? 'مکان' : 'مکان ییلاق'}} </span>
                        </p>
                        <div class="input-group   pt-1 ">
                            <div class="input-group-prepend   btn-group-vertical p-1">
                                <i class="fa fa-map-marker  text-primary  "></i>
                            </div>
                            <input type="text" placeholder="طول" id="loc1-lat-input" v-model="loc1_lat_input"
                                   class="my-1 py-1 pr-1 form-control border " aria-label=""
                                   @input="key('loc1')">

                        </div>
                        <div class="input-group  pt-1 ">
                            <div class="input-group-prepend   btn-group-vertical p-1">
                                <i class="fa fa-map-marker  text-primary  "></i>
                            </div>
                            <input type="text" placeholder="عرض" id="loc1-lon-input" v-model="loc1_lon_input"
                                   class="my-1 py-1 pr-1 form-control right-bottom-border " aria-label=""
                                   @input="key('loc1')">
                        </div>
                        <div class="input-group  pt-1 ">
                            <div class="input-group-prepend   btn-group-vertical p-1">
                                <i class="fa fa-address-book  text-primary  "></i>
                            </div>
                            <textarea rows="2" placeholder="آدرس" id="loc1-address-input"
                                      v-model="loc1_address"
                                      class="my-1 py-1 pr-1 form-control rounded " aria-label=""></textarea>
                        </div>
                        <div class="input-group  pt-1 ">
                            <div class="input-group-prepend   btn-group-vertical p-1">
                                <i class="fa fa-road  text-primary  "></i>
                            </div>
                            <input type="number" placeholder="فاصله از شهرستان (کیلومتر)" id="loc1-fasele-input"
                                   v-model="loc1_fasele_az_shahrestan" oninput="validity.valid" min="0"

                                   class="my-1 py-1 pr-1 form-control badge-pill " aria-label=""
                            >


                        </div>
                    </div>

                    <div v-if="schoolable_type== 'App\\Koochro'" class="loc-container   col-md-6 col-sm-6">
                        <p class="divider  ">
                            <span class="text-danger">    مکان قشلاق   </span></p>
                        <div class="input-group  pt-1 ">
                            <div class="input-group-prepend   btn-group-vertical p-1">
                                <i class="fa fa-map-marker  text-primary text-danger "></i>
                            </div>
                            <input type="text" placeholder="طول" id="loc2-lat-input" v-model="loc2_lat_input"
                                   class="my-1 py-1 pr-1 form-control border " aria-label="SearchName"
                                   @input="key('loc2')">

                        </div>
                        <div class="input-group  pt-1 ">
                            <div class="input-group-prepend   btn-group-vertical p-1">
                                <i class="fa fa-map-marker  text-primary text-danger "></i>
                            </div>
                            <input type="text" placeholder="عرض" id="loc2-lon-input" v-model="loc2_lon_input"
                                   class="my-1 py-1 pr-1 form-control right-bottom-border   " aria-label="SearchName"
                                   @input="key('loc2')">
                        </div>
                        <div class="input-group  pt-1 ">
                            <div class="input-group-prepend   btn-group-vertical p-1">
                                <i class="fa fa-address-book  text-danger  "></i>
                            </div>
                            <textarea rows="2" placeholder="آدرس" id="loc2-address-input"
                                      v-model="loc2_address"
                                      class="my-1 py-1 pr-1 form-control rounded " aria-label=""></textarea>
                        </div>
                        <div class="input-group  pt-1 ">
                            <div class="input-group-prepend   btn-group-vertical p-1">
                                <i class="fa fa-road  text-danger  "></i>
                            </div>
                            <input type="Number" placeholder="فاصله از شهرستان (کیلومتر)" id="loc2-fasele-input"
                                   v-model="loc2_fasele_az_shahrestan" oninput="validity.valid" min="0"
                                   class="my-1 py-1 pr-1 form-control badge-pill " aria-label="">
                        </div>
                        <div class="input-group  pt-1 ">
                            <div class="input-group-prepend   btn-group-vertical p-1">
                                <i class="fa fa-ruler  text-danger  "></i>
                            </div>
                            <input type="Number" placeholder="مسافت کوچ (کیلومتر)" id="masafate_kooch"
                                   v-model="masafate_kooch" oninput="validity.valid" min="0"
                                   class="my-1 py-1 pr-1 form-control badge-pill " aria-label="">
                        </div>
                    </div>

                </div>
            </div>


            <div class="img-container  w-100">
                <form id="uploader" enctype="multipart/form-data" class="uploader-container mx-2 mt-2 p-2 flex-column"
                      role="form" method="post"
                      @drop="uploader.removeClass('hover');filePreview($event,'img-input') "
                      @click="openFileChooser($event,'img-input')">

                    <h5 class="uploader-message p-2 text-center  ">
                        تصاویر مدرسه...
                    </h5>
                    <h6 class="uploader-message  text-center  "> حداکثر 3 عکس </h6>
                    <h6 class="uploader-message  text-center  "> حجم عکس زیر 2MB </h6>
                    <h6 class="uploader-message  text-center  "> فرمت jpg یا  png </h6>
                    <div class="progress w-100 justify-content-end hide">
                        <div class="p-2 w-auto progress-bar  progress-bar-striped bg-success "
                             role="progressbar"
                             :style="'width:'+ percentCompleted+'%'">{{percentCompleted}}%
                        </div>
                    </div>

                </form>
                <input id="img-input" class="col-12 hide " accept=".png, .jpg, .jpeg" type="file" name="images[]"
                       style="opacity: 0" multiple
                       @change="filePreview($event,'img-input')"/>

                <div class="img-container row   mx-2   p-2   ">
                    <div v-for="(doc,index) in docs" class="thumb-container col-md-4 col-sm-6 ">
                        <a :href="doc" data-lity>
                            <img :id="'img-'+index" class="img-thumbnail "
                                 :src="doc"
                                 alt="">
                        </a>

                        <button :id="'del-'+index" class="btn close-btn bg-danger text-white"
                                @click="removeImage(index,'img-input')">
                            <i class="fa fa-window-close text-white" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
            <!--{{captcha}}-->
            <vue-recaptcha class="mb-1 mx-2"
                           ref="recaptcha"
                           @verify="onVerify"
                           :sitekey="sitekey">

            </vue-recaptcha>
            <!--footer-->
            <div class="modal-footer justify-content-center col-12">
                <button type="button" class="btn btn-primary mx-1  btn-block  "
                        @click="   $root.$emit('hoozeRequest', params); ">ذخیره
                </button>

            </div>
        </div>
    </div>


</template>

<script>
    import schoolMap from './map.vue';
    import dropdown from './dropdown.vue';
    import selector from './selector.vue';
    import LayerSwitcher from 'ol-layerswitcher/dist/ol-layerswitcher';
    import swal from 'sweetalert2';
    import VueRecaptcha from 'vue-recaptcha';


    import Map from 'ol/Map.js';
    import {Style, Icon, Stroke} from 'ol/Style.js';
    import View from 'ol/View.js';
    import {Point, LineString} from 'ol/Geom.js';
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
    import Collection from 'ol/Collection.js';


    let regOnlyNumber = new RegExp('^[0-9]+$');
    let regIsLatLong = new RegExp("^[-+]?[0-9]{1,7}(\\.[0-9]+)?$");
    let regIsZamime = new RegExp("^(a|d)\\$\\d+(\\$\\d+)*$"); //a or d and
    let map;
    let marker1, marker2, vectorSource, lineMarker;
    let layer;
    //    let kerman = [57.0532, 30.2880];
    let kerman = [505044.12642724504, 3350634.803730713];

    let input_loc1_lat;
    let input_loc1_lon;
    let input_loc2_lat;
    let input_loc2_lon;
    let coordMarker1, coordMarker2;
    let tmpCoord1, tmpCoord2;
    let docs = [];

    let captcha;
    export default {

        props: ['schoolsLink', 'createSchoolLink', 'hoozesLink', 'sitekey',],
        components: {
            school_map: schoolMap,
            dropdown,
            selector,
            VueRecaptcha,
        },
        data() {
            return {
                sName: '',
                is_roozane: '',
                doore: {'ebte': false, 'mote1': false, 'mote2': false},
                jensiat: {'b': false, 'g': false,},

                sale_tasis: '',
                tedad_daneshamooz: '',
                tedad_paye_tahsili: '',
                tedad_hamkaran: '',
                code_madrese: '',
                code_faza: '',
                schoolable_type: 'App\\Saabet',
                vaziat: '',
                loc1: {lat: null, lon: null},
                loc2: {lat: null, lon: null},
                marker1: '', marker2: '',
                uploader: $('#uploader'),
                loading: $('.loading-page'),
                percentCompleted: 0,
                docs: [],
                IMG_LIMIT: 3,
                SIZE_LIMIT: 2, //MB
                params: {doore: '', jensiat: '', hooze: '', zamime: [], vaziat: ''},
                noe_faza: '',
                loc1_lat_input: "",
                loc1_lon_input: "",
                loc2_lat_input: "",
                loc2_lon_input: "",
                loc1_fasele_az_shahrestan: "",
                loc2_fasele_az_shahrestan: "",
                masafate_kooch: "",
                loc1_address: "",
                loc2_address: "",
                koochro_type: "",
                masire_kooch: "",

                recaptcha: "",

                translate1: null,
                translate2: null,
            }
        },
        watch: {
//            noe_faza: () => {
//                return Vue.noe_faza;
//            }
        },
        computed: {
//            get_noe_faza: () => {
//                return Vue.noe_faza;
//            }
        },
        mounted() {
//            this.getSchools();


//            console.log('mo');
            this.initialize_map();
            this.setEvents();
//            this.setSliders(0);
            this.uploader = $('#uploader');
            this.loading = $('.loading-page');
//            this.loading.removeClass('hide');
//            this.key();
//            let captchaLink = this.captchaLink;
//            $(document).ready(function () {
////                // DOM ready
//                captcha = $('#botdetect-captcha').captcha({
//                    captchaEndpoint:
//                    captchaLink
//                });
//            });

        },
        created() {


        },
        updated() {
//            this.key();
//            console.log('mo');
            //add listeners to input loc 2 after showing
            if (this.schoolable_type === 'App\\Koochro') {


                input_loc1_lat = $('#loc1-lat-input');
                input_loc1_lon = $('#loc1-lon-input');

                input_loc2_lat = $('#loc2-lat-input');
                input_loc2_lon = $('#loc2-lon-input');

                coordMarker2 = marker2.getGeometry().getCoordinates();
//                input_loc2_lon.val(coordMarker2[0]);
//                input_loc2_lat.val(coordMarker2[1]);

                $(input_loc2_lon).keyup(() => {
                    marker2.getGeometry().setCoordinates([Number(input_loc2_lat.val()), Number(input_loc2_lon.val())]);
                    lineMarker.getGeometry().setCoordinates
                    ([[Number(input_loc1_lat.val()), Number(input_loc1_lon.val())],
                        [Number(input_loc2_lat.val()), Number(input_loc2_lon.val())]]);
                });
                $(input_loc2_lat).keyup(() => {
                    marker2.getGeometry().setCoordinates([Number(input_loc2_lat.val()), Number(input_loc2_lon.val())]);
                    lineMarker.getGeometry().setCoordinates
                    ([[Number(input_loc1_lat.val()), Number(input_loc1_lon.val())],
                        [Number(input_loc2_lat.val()), Number(input_loc2_lon.val())]]);
                });


            }
        },
        methods: {
            key(from) {

//                console.log('hi');
//                if (from === 'lat1')
                this.loc1_lat_input = input_loc1_lat.val();
////                else if (from === 'lon1')
                this.loc1_lon_input = input_loc1_lon.val();
//
////                else if (from === 'lat2')
                if (this.schoolable_type === 'App\\Koochro') {
                    this.loc2_lat_input = input_loc2_lat.val();
                    this.loc2_lon_input = input_loc2_lon.val();
                }
//
////                else if (from === 'lon2')
                if (from === 'loc1')
                    this.map.getView().setCenter([Number(this.loc1_lat_input), Number(this.loc1_lon_input)], 15);
                else if (from === 'loc2')
                    this.map.getView().setCenter([Number(this.loc2_lat_input), Number(this.loc2_lon_input)], 15);
//                if (this.schoolable_type === 'App\\Saabet') {
//
//                } else if (this.schoolable_type === 'App\\Koochro') {
////                    this.map.getView().setCenter(position, zoom)
//                }
            },
            onVerify(token) {
//                console.log(event);
                this.recaptcha = token;
            },
            removeImage(idx, from) {
                if (from === 'img-input')
                    this.docs.splice(idx, 1);
            },
            openFileChooser(event, from) {
//                send fake click for browser file
                let image_input = document.getElementById(from);
                if (document.createEvent) {
                    let evt = document.createEvent("MouseEvents");
                    evt.initEvent("click", false, true);
                    image_input.dispatchEvent(evt);

                } else {
                    let evt = new Event("click", {"bubbles": false, "cancelable": true});
                    image_input.dispatchEvent(evt);
                }
            },
            filePreview(e, from) {
                let files;
                if (event.dataTransfer) {
                    files = event.dataTransfer.files;
                }
                else if (event.target.files) {
                    files = event.target.files;
                }
                if (this.checkDocs(files, from))
//                    console.log(files.length);
                    if (files && files.length > 0) {
                        if (from === 'img-input') {
                            for (let i = 0; i < files.length; i++) {
//                        console.log(files.length);
                                let reader = new FileReader();
                                reader.onload = function (e) {
                                    docs.push(e.target.result);
                                };
                                reader.readAsDataURL(files[i]);
                            }
                            this.docs = docs;
                        }
                    }
            },
            checkInputs(params) {

                //check all inputs
                this.errors = '';
                // name input -> required -> not only space
                if (!this.sName.replace(/\s/g, '').length)
                    this.errors += ('<br>' + 'نام مدرسه نمی تواند خالی باشد');
                if (this.sName.length > 100)
                    this.errors += ('<br>' + 'نام مدرسه نمی تواند بیشتر از 100 حرف باشد');

                if (this.code_madrese > 4294967295 || (this.code_madrese.length > 0 && !regOnlyNumber.test(this.code_madrese)))
                    this.errors += ('<br>' + 'کد مدرسه عدد و حداکثر 10 رقم باشد');

                if (this.code_faza > 4294967295 || (this.code_faza.length > 0 && !regOnlyNumber.test(this.code_faza)))
                    this.errors += ('<br>' + 'کد فضا عدد و حداکثر 10 رقم باشد');

                if (this.sale_tasis !== "" && (this.sale_tasis > 1500 || this.sale_tasis < 1300) || (this.sale_tasis.length > 0 && !regOnlyNumber.test(this.sale_tasis)))
                    this.errors += ('<br>' + 'سال تاسیس نامعتبر است');

                if (this.tedad_daneshamooz > 4294967295 || (this.tedad_daneshamooz.length > 0 && !regOnlyNumber.test(this.tedad_daneshamooz)))
                    this.errors += ('<br>' + 'تعداد دانش آموز عدد و حداکثر 10 رقم باشد');

                if (this.tedad_paye_tahsili > 65535 || (this.tedad_paye_tahsili.length > 0 && !regOnlyNumber.test(this.tedad_paye_tahsili)))
                    this.errors += ('<br>' + 'تعداد پایه تحصیلی عدد و حداکثر 5 رقم باشد');

                if (this.tedad_hamkaran > 16777215 || (this.tedad_hamkaran.length > 0 && !regOnlyNumber.test(this.tedad_hamkaran)))
                    this.errors += ('<br>' + 'تعداد همکاران عدد و حداکثر 8 رقم باشد');

                if (this.is_roozane !== "" && typeof this.is_roozane !== "boolean")
                    this.errors += ('<br>' + 'روزانه شبانه نامعتبر است');

                for (let i in params.zamime)
                    params.vaziat += "$" + params.zamime[i].id;

                if (params.vaziat !== '' && params.vaziat !== 'm' && !regIsZamime.test(params.vaziat))
                    this.errors += ('<br>' + 'وضعیت مدرسه نامعتبر است');
                else
                    this.params.vaziat = params.vaziat;


                if (params.hooze !== '' && !regOnlyNumber.test(params.hooze))
                    this.errors += ('<br>' + 'حوزه نمایندگی نامعتبر است');
                else
                    this.params.hooze = params.hooze;

                this.params.doore = '';
                if (this.doore['ebte']) {
                    this.params.doore = '0';
                    if (this.doore['mote1'])
                        this.params.doore += '$1';
                    if (this.doore['mote2'])
                        this.params.doore += '$2';
                } else if (this.doore['mote1']) {
                    this.params.doore = '1';
                    if (this.doore['mote2'])
                        this.params.doore += '$2';
                } else if (this.doore['mote2']) {
                    this.params.doore = '2';
                }

                this.params.jensiat = '';
                if (this.jensiat['b']) {
                    this.params.jensiat = 'b';
                    if (this.jensiat['g'])
                        this.params.jensiat = 'a';
                }
                else if (this.jensiat['g'])
                    this.params.jensiat = 'g';

                if (!['c', 'k', 's', ''].includes(this.noe_faza))
                    this.errors += ('<br>' + 'نوع فضای آموزشی نا معتبر است');

                if (this.schoolable_type !== "" && this.schoolable_type !== "App\\Saabet" && this.schoolable_type !== "App\\Koochroo")
                    this.errors += ('<br>' + 'نوع مدرسه نامعتبر است');


                if (this.loc1_lat_input.length > 22 || !regIsLatLong.test(this.loc1_lat_input) && this.loc1_lat_input !== "")
                    this.errors += ('<br>' + 'طول جغرافیایی مکان ۱ معتبر نیست');
                if (this.loc1_lon_input.length > 22 || !regIsLatLong.test(this.loc1_lon_input) && this.loc1_lon_input !== "")
                    this.errors += ('<br>' + 'عرض جغرافیایی مکان ۱ معتبر نیست');

                if (this.loc2_lat_input.length > 22 || !regIsLatLong.test(this.loc2_lat_input) && this.loc2_lat_input !== "")
                    this.errors += ('<br>' + 'طول جغرافیایی مکان ۲ معتبر نیست');
                if (this.loc2_lon_input.length > 22 || !regIsLatLong.test(this.loc2_lon_input) && this.loc2_lon_input !== "")
                    this.errors += ('<br>' + 'عرض جغرافیایی مکان ۲ معتبر نیست');

                if (this.loc1_address.length > 150)
                    this.errors += ('<br>' + 'آدرس مکان ۱ نمی تواند بیشتر از 150 حرف باشد');
                if (this.loc2_address.length > 150)
                    this.errors += ('<br>' + 'آدرس مکان ۲ نمی تواند بیشتر از 150 حرف باشد');

                if (this.loc1_fasele_az_shahrestan > 4294967295 || (this.loc1_fasele_az_shahrestan.length > 0 && !regOnlyNumber.test(this.loc1_fasele_az_shahrestan)))
                    this.errors += ('<br>' + 'فاصله از شهرستان عدد و حداکثر 10 رقم باشد');
                if (this.loc2_fasele_az_shahrestan > 4294967295 || (this.loc2_fasele_az_shahrestan.length > 0 && !regOnlyNumber.test(this.loc2_fasele_az_shahrestan)))
                    this.errors += ('<br>' + 'فاصله از شهرستان عدد و حداکثر 10 رقم باشد');
//
                if (this.masafate_kooch > 4294967295 || (this.masafate_kooch.length > 0 && !regOnlyNumber.test(this.masafate_kooch)))
                    this.errors += ('<br>' + 'فاصله از شهرستان عدد و حداکثر 5 رقم باشد');

                if (this.masire_kooch !== "" && this.masire_kooch.length > 65535)
                    this.errors += ('<br>' + 'طول مسیر کوچ نمی تواند بیشتر از 5 رقم باشد');

                this.errors = '';
                if (this.errors === '')
                    this.showDialog(0);
                else
                    this.showDialog(); //errors

            }
            ,
            checkDocs(files, from) {
                return true;
                // from certs-input 3 files 4 mb
                // from agent-input 2 files 4mb
                let message = '';
                let sizeMessage = ' حجم هر عکس زیر' + this.SIZE_LIMIT + 'مگابایت باشد';
                let numMessage = 'تعداد عکس، بیش از حد مجاز است';
                for (let i = 0; i < files.length; i++)
                    if (files[i].size / 1024 / 1024 > this.SIZE_LIMIT) {
                        message = sizeMessage;
                        break;
                    }

                if (from === 'img-input' && this.docs.length + files.length > this.IMG_LIMIT)

                    message = numMessage;
                if (message !== '') {
                    swal.fire({
                        title: 'توجه',
                        text: message,
                        type: 'error',
                        showCancelButton: true,
                        showConfirmButton: false,
                        showCloseButton: true,
                        cancelButtonText: 'باشه',
                        cancelButtonColor: '#d33',

                    });
                    return false;
                }
                else
                    return true;

            }
            ,
            showDialog(type, data) {
                // 0  ready for save
                // 1  success  save
                // else show errors
                if (type === 0)
                    swal.fire({
                        title: 'توجه',
                        text: 'تغییرات ذخیره شوند؟',
                        type: 'warning',
                        showCancelButton: true,
                        showCloseButton: true,
                        cancelButtonText: 'خیر',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: ' بله',
                    }).then((result) => {
                        if (result.value) {
                            this.saveChanges();
                        }
                    });
                else if (type === 1) {
                    swal.fire({
                        title: 'توجه',
                        text: ' با موفقیت ذخیره شد!',
                        confirmButtonColor: '#60aa2f',
                        type: 'success',
                        confirmButtonText: ' باشه',
                    }).then((result) => {
                        if (result.value) {
                            location.reload();
                        }
                    });

                } else {
                    swal.fire({
                        title: 'خطاهای زیر را اصلاح نمایید',
                        html: ` <p   class="text-danger">` + this.errors + `</p>`,
//                        text: this.errors,
                        confirmButtonColor: '#d33',
                        type: 'error',
                        confirmButtonText: ' باشه',
                    });
                }
            }
            ,

            saveChanges() {
                this.loading.removeClass('hide');

//                console.log(this.schoolCreateLink);
                axios.post(this.createSchoolLink, {
//                    userEnteredCaptchaCode: captcha.userEnteredCaptchaCode,
//                    captchaId: captcha.captchaId,
                    mode: 'create',
                    recaptcha: this.recaptcha,
                    sName: this.sName,
                    hooze_namayandegi_id: this.params.hooze,
                    code_madrese: this.code_madrese,
                    code_faza: this.code_faza,
                    sale_tasis: this.sale_tasis,
                    tedad_daneshamooz: this.tedad_daneshamooz,
                    tedad_paye_tahsili: this.tedad_paye_tahsili,
                    tedad_hamkaran: this.tedad_hamkaran,
                    is_roozane: this.is_roozane,
                    doore: this.params.doore,
                    jensiat: this.params.jensiat,
                    schoolable_type: this.schoolable_type,
                    vaziat: this.params.vaziat,
                    loc1: {
                        pos: this.loc1_lon_input && this.loc1_lat_input ? this.loc1_lat_input + "," + this.loc1_lon_input : "",
                        fasele_az_shahrestan: this.loc1_fasele_az_shahrestan,
                        address: this.loc1_address
                    },
                    loc2: {
                        pos: this.loc2_lon_input && this.loc2_lat_input ? this.loc2_lat_input + "," + this.loc2_lon_input : "",
                        fasele_az_shahrestan: this.loc2_fasele_az_shahrestan,
                        address: this.loc2_address,
                        masafate_kooch: this.masafate_kooch,
                        masire_kooch: this.masire_kooch,
                        koochro_type: this.koochro_type,
                    },
                    docs: this.docs,
                    noe_fazaye_amoozeshi: this.noe_faza,


                })
                    .then((response) => {
                        this.loading.addClass('hide');
                        console.log(response);
                        if (response.status === 200) {
                            this.showDialog(1);

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
                this.$refs.recaptcha.reset();
            }
            ,
            setSliders(type) {


                if (type === 0) { //init sliders
                    $(() => {
                        $("#slider-sal").slider({
                            range: false,
                            orientation: "horizontal",
                            value: 1300,
                            min: 1300,
                            max: 1500,
                            step: 1,

                            slide: (event, ui) => {
                                this.sale_tasis = (ui.value);
                            }
                        });
                        $("#slider-tedad").slider({
                            range: false,
                            orientation: "horizontal",
                            value: 0,
                            min: 0,
                            max: 1000,
                            step: 1,

                            slide: (event, ui) => {
                                this.tedad_daneshamooz = (ui.value);
                            }
                        });
                    });

                } else if (type === 1) { //sale tasis slider update

                    $("#slider-sal").slider({
                        value: this.sale_tasis
                    });
                } else if (type === 2) { //tedad   slider update

                    $("#slider-tedad").slider({
                        value: this.tedad_daneshamooz
                    });
                }
            }
            ,
            initialize_map() {
                console.log('init');
                proj4.defs('EPSG:32640', '+proj=utm +zone=40 +datum=WGS84 +units=m +no_defs');
                register(proj4);
                let proj32640 = getProjection('EPSG:32640');
                proj32640.setExtent([-833718.61, 2641854.13, 1543086.51, 4422789.27]); //iran bound(l,b,r,u)

                let iconFeatures = [];

                let iconStyle1 = new Style({
                    image: new Icon(/** @type {olx.style.IconOptions} */ ({
                        anchor: [.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        scale: .5,
                        opacity: .9,
                        src: '/img/marker-school-blue-big.png'
                    }))
                });
                let iconStyle2 = new Style({
                    image: new Icon(/** @type {olx.style.IconOptions} */ ({
                        anchor: [.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        opacity: .9,
                        scale: .5,
                        src: '/img/marker-school-red-big.png'
                    }))
                });
                let lineStyle = new Style({
                    stroke: new Stroke({
                        color: '#09ef00',
                        width: 8
                    })
                });

                marker1 = new Feature({
                    geometry: new Point(kerman),
                    name: this.sName,

                });
                marker1.setId('marker1');
                marker2 = new Feature({
                    geometry: new Point([kerman[0] - 100, kerman[1]]),
                    name: this.sName,

                });
                marker2.setId('marker2');

//                let startPt = fromLonLat(kerman);
//                let endPt = fromLonLat([kerman[0] - .002, kerman[1]]);
                let startPt = kerman;
                let endPt = [kerman[0] - 100, kerman[1]];

                lineMarker = new Feature({
                    geometry: new LineString([startPt, endPt]),
                    name: 'Line',

                });
                lineMarker.setId('line');

                marker1.setStyle(iconStyle1);
                marker2.setStyle(iconStyle2);
                lineMarker.setStyle(lineStyle);

                iconFeatures.push(marker1);
//                iconFeatures.push(marker2);
//                iconFeatures.push(lineMarker);

                if (this.map) {
                    this.map.setTarget(null);
                    this.map = null;
                }
                vectorSource = new Vector({
                    features: iconFeatures

                });
                let markersLayer = new VectorLayer({
                    source: vectorSource,
                    name: "markers",
                    projection: 'EPSG:32640',
                });
//                console.log(marker2.getGeometry().getCoordinates());
                this.bingLayer = new TileLayer({
                    source: new BingMaps({
                        key: 'AodEaqQSDksfjZDM0HwxhdvJQDnj0Y6wgtaP6gi_wpDBcFMaefn8kz8bjvmFpN_s',
                        imagerySet: 'Aerial', //or 'Road', 'AerialWithLabels',
                        maxZoom: 19,
                        projection: 'EPSG:32640',
                    }),

                    name: "bingHybrid",
                    title: 'عوارض',

                });
                this.layer = new TileLayer({
                    source: new OSM(
                        {
                            url: "https://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&s=IR&hl=fa",
                            projection: 'EPSG:32640',
                        }
                    ),
//                    style: iconStyle,
                    name: "main",
                    title: 'ساده',
                    projection: 'EPSG:32640',
                });
                this.GoogleHybridlayer = new TileLayer({
                    source: new OSM(
                        {
                            url: 'https://mt0.google.com/vt/lyrs=y&hl=fa&x={x}&y={y}&z={z}&s=IR',
                            projection: 'EPSG:32640',
                        }
                    ),
//                    style: iconStyle1,
                    name: "googleHybrid",
                    title: 'گوگل',
                });


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
                        center: kerman,
                        zoom: 13,
                        projection: 'EPSG:32640',
                    })
                });

                this.map.addControl(new OverviewMap());
                this.map.addControl(new LayerSwitcher());
                this.map.addControl(new FullScreen());
                this.map.addControl(new Attribution());
//                this.map.addControl(new ZoomToExtent());
//                this.map.addControl(new ScaleLine());
                this.map.addControl(new ZoomSlider());
                this.map.addControl(new Zoom());
//                this.map.addControl(new Control());

//                drag features


                let translate1 = new Translate({
                    features: new Collection([marker1])
                });
                let translate2 = new Translate({
                    features: new Collection([marker2])
                });
                this.map.addInteraction(translate1);
                this.map.addInteraction(translate2);


                input_loc1_lat = $('#loc1-lat-input');
                input_loc1_lon = $('#loc1-lon-input');
                input_loc2_lat = $('#loc2-lat-input');
                input_loc2_lon = $('#loc2-lon-input');

                translate1.on('translatestart', function (evt) {
                    coordMarker2 = marker2.getGeometry().getCoordinates();

                });


                translate1.on('translating', function (evt) {
                    tmpCoord1 = marker1.getGeometry().getCoordinates();
                    lineMarker.getGeometry().setCoordinates([coordMarker2, tmpCoord1]);
                    input_loc1_lat.val(tmpCoord1[0]);
                    input_loc1_lon.val(tmpCoord1[1]);

                });
                translate1.on('translating', this.key);

                translate2.on('translatestart', function (evt) {
                    coordMarker1 = marker1.getGeometry().getCoordinates();
                });
                translate2.on('translating', function (evt) {
                    tmpCoord2 = marker2.getGeometry().getCoordinates();
                    lineMarker.getGeometry().setCoordinates([coordMarker1, tmpCoord2]);
                    input_loc2_lat.val(tmpCoord2[0]);
                    input_loc2_lon.val(tmpCoord2[1]);

                });
                translate2.on('translating', this.key);

                $(input_loc1_lon).keyup(() => {
                    marker1.getGeometry().setCoordinates([Number(input_loc1_lat.val()), Number(input_loc1_lon.val())]);
                    lineMarker.getGeometry().setCoordinates
                    ([[Number(input_loc1_lat.val()), Number(input_loc1_lon.val())],
                        [Number(input_loc2_lat.val()), Number(input_loc2_lon.val())]]);

                });

                $(input_loc1_lat).keyup(() => {
                    marker1.getGeometry().setCoordinates([Number(input_loc1_lat.val()), Number(input_loc1_lon.val())]);
                    lineMarker.getGeometry().setCoordinates
                    ([[Number(input_loc1_lat.val()), Number(input_loc1_lon.val())],
                        [Number(input_loc2_lat.val()), Number(input_loc2_lon.val())]]);

                });
                $(input_loc2_lon).keyup(() => {
                    marker2.getGeometry().setCoordinates([Number(input_loc2_lat.val()), Number(input_loc2_lon.val())]);
                    lineMarker.getGeometry().setCoordinates
                    ([[Number(input_loc1_lat.val()), Number(input_loc1_lon.val())],
                        [Number(input_loc2_lat.val()), Number(input_loc2_lon.val())]]);
                });
                $(input_loc2_lat).keyup(() => {
                    marker2.getGeometry().setCoordinates([Number(input_loc2_lat.val()), Number(input_loc2_lon.val())]);
                    lineMarker.getGeometry().setCoordinates
                    ([[Number(input_loc1_lat.val()), Number(input_loc1_lon.val())],
                        [Number(input_loc2_lat.val()), Number(input_loc2_lon.val())]]);

                });


                //first lat lon input values
                coordMarker1 = marker1.getGeometry().getCoordinates();
                coordMarker2 = marker2.getGeometry().getCoordinates();


                map = this.map;
                map.on('pointermove', function (e) {
                    if (e.dragging) return;
                    let hit = map.hasFeatureAtPixel(map.getEventPixel(e.originalEvent));
                    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
                });

                marker1.style = {display: 'none'};
                lineMarker.style = {display: 'none'};
                this.layer.getSource().changed();
                map.render();

            }
            ,

            marker(command, marker) {

                if (command === 'add' && marker === 2 && vectorSource.getFeatureById('marker2') === null) {
                    vectorSource.addFeature(lineMarker);
                    vectorSource.addFeature(marker2);

                } else if (command === 'del' && marker === 2 && vectorSource.getFeatureById('marker2') !== null) {
                    vectorSource.removeFeature(lineMarker);
                    vectorSource.removeFeature(marker2);
                }
            }
            ,

//                this.layer = layer;
            cancel() {
                $("#mapModal").removeClass('show');
            }
            ,

            getType(school, _for) {
                let text = '';
                if (_for === "kooch") {
                    if (school.schoolable_type === 'App\\Saabet')
                        text = 'نوع: ثابت';
                    else if (school.schoolable_type === 'App\\Koochro')
                        text = ' نوع: کوچ رو';
                }
                else if (_for === "sayyar") {
                    if (school.schoolable.type === 'n')
                        text = ' نیمه سیار ';
                    else if (school.schoolable.type === 's')
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
                    if (school.vaziat.startsWith('a')) //zamime ast
                        text = ' ضمیمه است ';
                    else if (school.vaziat.startsWith('d')) //zamime darad
                        text = ' ضمیمه دارد ';

                }
                else if (_for === "zamime_ids") {
                    if (school.vaziat !== 'm')
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

            }
            ,
            getImage(doc) {
                if (doc.length !== 0)
                    return doc[0].path;
                else
                    return "img/school-no.png";
            }
            ,
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
            }
            ,

            setEvents() {


                this.$root.$on('schoolsChange', data => {
                    this.schools = data;
                });


                //hoozeRequest->hoozeResponse->selectorResponse
                this.$root.$on('selectorResponse', params => {
//                    console.log(params);
                    this.checkInputs(params);
                });
//            console.log(this.banners);


                this.uploader
                    .on('dragenter',
                        (e) => {
                            this.uploader.addClass('hover');
                            return false;
                        })
                    .on('dragleave',
                        (e) => {
                            this.uploader.removeClass('hover');
                            return false;
                        });


            }
        }

    }


</script>

<style>
    .toggle-container {
        border-radius: 1rem;
        /*border-width: 1rem;*/
        /*border-style: dashed;*/
        border: .2rem dashed;

    }

</style>