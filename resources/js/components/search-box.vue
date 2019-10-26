<template>


    <div v-if="show!='create' && show!='edit'" class="search-container d-inline-block col-md-4">


        <p v-show="!simple_search" class="divider "><span>مرتب سازی</span></p>

        <div v-show="!simple_search" class="btn-group btn-group-toggle mx-1  row col-12 justify-content-center "
             data-toggle="buttons">
            <label id="new-schools" for="new-schools"
                   class="btn btn-light-blue btn-group-item col-xs-6 left-border  active "
                   @click="by='~n';  $root.$emit('search',{'orderBy':'','direction':''})  ">
                <input type="radio" name="options" autocomplete="off" class=" "> جدید ترین مدارس
            </label>
            <label id="old-schools" for="old-schools"
                   class="btn btn-togg btn-light-blue btn-group-item col-xs-6    "
                   @click=" by='~o';  $root.$emit('search',{'orderBy':'','direction':''})">
                <input type="radio" name="options" autocomplete="off" class=" "> قدیمی ترین مدارس
            </label>
            <label id="max-students" for="max-students"
                   class="btn btn-light-blue btn-group-item col-xs-6   "
                   @click="by='~ma';  $root.$emit('search',{'orderBy':'','direction':''})  ">
                <input type="radio" name="options" autocomplete="off" class=" "> بیشترین دانش آموز
            </label>
            <label id="min-students" for="min-students"
                   class="btn btn-light-blue btn-group-item col-xs-6 right-border  "
                   @click="by='~mi';  $root.$emit('search',{'orderBy':'','direction':''})  ">
                <input type="radio" name="options" autocomplete="off" class=" "> کمترین دانش آموز
            </label>

        </div>

        <!-- search filters-->

        <p v-show="!simple_search" class="divider   "><span>فیلتـــر</span></p>

        <!--status-->
        <div v-show="!simple_search"
             class="filters-container btn-group btn-group-toggle row  col-md-12 justify-content-center"
             data-toggle="buttons">
            <div class=" px-2  ">
                <label class="btn   btn-outline-success  "
                       @click=" status['koochro']=!status['koochro'];  $root.$emit('search',{'orderBy':'','direction':''})">
                    کوچ رو
                </label>

                <label class="btn   btn-outline-danger   "
                       @click="status['saabet']=!status['saabet']; $root.$emit('search',{'orderBy':'','direction':''})  ">
                    ثابت
                </label>
            </div>
            <div class="  px-2 ">
                <label class="btn btn-outline-dark-blue "
                       @click="status['roozane']=!status['roozane'];   $root.$emit('search',{'orderBy':'','direction':''})  ">روزانه
                </label>
                <label class="btn btn-outline-dark-gray "
                       @click="status['shabane']=!status['shabane'];   $root.$emit('search',{'orderBy':'','direction':''})  ">شبانه
                </label>
            </div>
            <div class="  px-2 ">
                <label class="btn btn-outline-dark-blue "
                       @click="status['boy']=!status['boy'];   $root.$emit('search',{'orderBy':'','direction':''})  ">پسرانه
                </label>
                <label class="btn btn-outline-dark-gray "
                       @click="status['girl']=!status['girl'];   $root.$emit('search',{'orderBy':'','direction':''})  ">دخترانه
                </label>
            </div>
            <div class="  px-2 ">
                <label class="btn btn-outline-dark-green "
                       @click="status['ebte']=!status['ebte'];   $root.$emit('search',{'orderBy':'','direction':''})  ">ابتدایی
                </label>
                <label class="btn btn-outline-success "
                       @click="status['mote1']=!status['mote1'];   $root.$emit('search',{'orderBy':'','direction':''})  ">متوسطه 1
                </label>
                <label class="btn btn-outline-light-green "
                       @click="status['mote2']=!status['mote2'];   $root.$emit('search',{'orderBy':'','direction':''})  ">متوسطه 2
                </label>
            </div>
            <div class=" px-2  ">
                <label class="btn btn-outline-dark "
                       @click="status['mosta']=!status['mosta'];   $root.$emit('search',{'orderBy':'','direction':''})  ">مستقل
                </label>
                <label class="btn btn-outline-dark-gray "
                       @click="status['zama']=!status['zama'];   $root.$emit('search',{'orderBy':'','direction':''})  ">ضمیمه است
                </label>
                <label class="btn btn-outline-gray "
                       @click="status['zamd']=!status['zamd'];   $root.$emit('search',{'orderBy':'','direction':''})  ">ضمیمه دارد
                </label>
            </div>
            <div class="  px-2 ">
                <label class="btn btn-outline-light-red "
                       @click="status['kanex']=!status['kanex'];   $root.$emit('search',{'orderBy':'','direction':''})  ">کانکس
                </label>
                <label class="btn btn-outline-flame-start "
                       @click="status['sakhteman']=!status['sakhteman'];   $root.$emit('search',{'orderBy':'','direction':''})  ">ساختمان
                </label>
                <label class="btn btn-outline-cream "
                       @click="status['chador']=!status['chador'];   $root.$emit('search',{'orderBy':'','direction':''})  ">چادر
                </label>
            </div>
        </div>

        <!--range sliders-->
        <div v-show="!simple_search" class="row px-5">
            <!--slider sale tasis-->
            <div class="slider-container col-md-6 col-sm-8  offset-sm-2 offset-md-0">
                <p class="divider text-center "><span>سال تاسیس</span></p>
                <div id="slider-sal" class="slider d-block "></div>
                <div class="input-container text-center my-1">
                    <input type="number" v-model="max_sal" min="1300" max="1500"
                           oninput="validity.valid" id="max_sal"
                           class="price-range-field left-border"
                           @change="setSliders(1)" @paste="setSliders(1)" @keyup="setSliders(1)"/>
                    <input type="number" v-model="min_sal" min="1300" max="1500"
                           oninput="validity.valid" id="min_sal"
                           class="price-range-field right-border "
                           @change="setSliders(1)" @paste="setSliders(1)" @keyup="setSliders(1)"/>
                </div>
            </div>
            <!--slider tedad danesh amooz-->
            <div v-show="!simple_search" class="slider-container col-md-6 col-sm-8 offset-sm-2 offset-md-0 ">
                <p class="divider  text-center"><span>تعداد دانش آموز</span></p>
                <div id="slider-tedad" class="slider d-block "></div>
                <div class="input-container text-center my-1">
                    <input type="number" v-model="max_tedad" min="1" max="1000"
                           oninput="validity.valid" id="max_tedad"
                           class="price-range-field left-border"
                           @change="setSliders(2)" @paste="setSliders(2)" @keyup="setSliders(2)"/>
                    <input type="number" v-model="min_tedad" min="1" max="1000"
                           oninput="validity.valid" id="min_tedad"
                           class="price-range-field right-border d-inline"
                           @change="setSliders(2)" @paste="setSliders(2)" @keyup="setSliders(2)"/>
                </div>
            </div>
        </div>
        <!--name search and dropdowns-->

        <p class="divider   "><span>جستجو</span></p>
        <div class=" row col-12">
            <div class="input-group col-md-6 col-sm-6 pt-1 ">
                <div class="input-group-prepend   btn-group-vertical p-1">
                    <i class="fa fa-search   text-primary  "></i>
                </div>
                <input type="text" placeholder="نام مدرسه " v-model="sName" id="name-input"
                       class="my-1 py-1 pr-1 form-control border" aria-label="SearchName"
                       @keyup.enter="    $root.$emit('search',{'orderBy':'','direction':''}) ">
                <div class=" input-group-append  btn-group-vertical   ">
                    <i class=" glyphicon glyphicon-remove text-danger  clear-btn p-1"
                       @click="sName='';$root.$emit('search',{'orderBy':'','direction':''})"
                    ></i>
                </div>
            </div>


            <dropdown v-show="!simple_search" :data-link="this.hoozesLink" :for="'hooze'" :newable="true" :multi="true"
                      class="col-md-6 col-sm-6 " :listID="'hooze'"></dropdown>
        </div>
        <!--end  search-->

        <!--search button-->
        <div class="col-12 row mt-4 d-flex ">
            <div class="   col-md-8 col-sm-6">
                <label id="search" for="search" class="btn bg-gradient-purple   btn-block"
                       @click="    $root.$emit('search',{'orderBy':'','direction':''}) ">
                    <i class="fa fa-search"></i> جستجو
                </label>
            </div>
            <div class=" col-md-2 col-sm-2 px-1">

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
            <div class="   col-md-1 col-sm-2 px-1">
                <label id="view" for="view" class="btn bg-gradient-blue   btn-block hov-pointer px-1"
                       @click=" show=='card'?show='list':show='card'; $root.$emit('viewChange',show);    ">

                    <i class="fa fa-th-large"></i>
                    <i class="fa fa-th-list"></i>

                </label>
            </div>
            <!--toggle search panel-->
            <div class="   col-md-1 col-sm-2 px-1">
                <label id="minimize" for="minimize" class="btn bg-gradient-blue  btn-block hov-pointer"
                       @click="  simple_search=!simple_search   ">
                    <span class="glyphicon "
                          :class="[simple_search?'glyphicon-arrow-down':'glyphicon-arrow-up']"></span>
                </label>
            </div>

        </div>
        <!--end  search button-->


    </div>


</template>

<script>

    import dropdown from './dropdown.vue'
    import pagination from './pagination.vue';

    export default {
        components: {
            dropdown: dropdown,
            pagination: pagination,
        },
        data() {
            return {

                show: 'search',
                simple_search: true, //only school name
                per_page: 24,
                sName: '',

                loading: $(".loading-page"),


                oldSchools: $("#old-schools"),
                newSchools: $("#new-schools"),
                maxStudents: $("#max-students"),
                minStudents: $("#min-students"),

                el_min_sal: $("#min-sal"),
                el_max_sal: $("#max-sal"),
                el_min_tedad: $("#min-tedad"),
                el_max_tedad: $("#max-tedad"),

                el_slider_sal: '',
                el_slider_tedad: '',

                min_sal: 1300,
                max_sal: 1500,
                min_tedad: 0,
                max_tedad: 1000,

                ready: $("#ready"),
                reserved: $("#reserved"),
                service_pause: $("#service-pause"),

                no_result: $('.no-result'),
                schools: '',
                sortBy: 'price',
                by: '~n',
                paginator: {},
                status: {
                    'koochro': false,
                    'saabet': false,
                    'roozane': false,
                    'shabane': false,
                    'boy': false,
                    'girl': false,
                    'ebte': false,
                    'mote1': false,
                    'mote2': false,
                    'mosta': false,
                    'zama': false,
                    'zamd': false,
                    'kanex': false,
                    'sakhteman': false,
                    'chador': false,
                },
            }
        },
        props: ['schoolsLink', 'data', 'hoozesLink'],
        mounted() {

//            this.setAxiosCsrf();

            this.setEvents();
            this.setSliders(0);
            this.$root.$emit('search');
            this.loading = $('.loading-page');
            this.no_result = $('.no-result');
            this.loading.addClass('hide');
        },
        created() {

        },
        methods: {

            search(param) {

                let sortBy = '';
                let direction = '';
                let schoolable = '';
                let is_roozane = '';
                let jensiat = '';
                let d = [];
                let doore = '';
                let vaziat = [];
                let noe_fazaye_amoozeshi = [];


                if (this.by === '~n') {
                    sortBy = 'sale_tasis';
                    direction = 'DESC';
                } else if (this.by === '~o') {
                    sortBy = 'sale_tasis';
                    direction = 'ASC';
                } else if (this.by === '~ma') {
                    sortBy = 'tedad_daneshamooz';
                    direction = 'DESC';
                } else if (this.by === '~mi') {
                    sortBy = 'tedad_daneshamooz';
                    direction = 'ASC';
                }


                if (this.status['koochro'] && !this.status['saabet'])
                    schoolable = "App\\Koochro";
                else if (!this.status['koochro'] && this.status['saabet'])
                    schoolable = "App\\Saabet";

                if (this.status['roozane'] && !this.status['shabane'])
                    is_roozane = true;
                else if (!this.status['roozane'] && this.status['shabane'])
                    is_roozane = false;

                if (this.status['boy'] && !this.status['girl'])
                    jensiat = 'b';
                else if (!this.status['boy'] && this.status['girl'])
                    jensiat = 'g';

                if (this.status['ebte'])
                    d.push('0');
                if (this.status['mote1'])
                    d.push('1');
                if (this.status['mote2'])
                    d.push('2');
                for (let i in d)
                    doore += d[i] + "$";
                if (doore.length > 1)
                    doore = doore.slice(0, doore.length - 1); //remove last $ ,

                if (this.status['mosta'])
                    vaziat.push('m');
                if (this.status['zama'])
                    vaziat.push('a');
                if (this.status['zamd'])
                    vaziat.push('d');

                if (this.status['chador'])
                    noe_fazaye_amoozeshi.push('c');
                if (this.status['sakhteman'])
                    noe_fazaye_amoozeshi.push('s');
                if (this.status['kanex'])
                    noe_fazaye_amoozeshi.push('k');


                this.loading.removeClass('hide');
                this.no_result.addClass('hide');

//                console.log(this.searchName);
//                console.log(param);
                axios.post(this.schoolsLink, {

                    ids: param['ids'] ? param['ids'] : [],
                    sortBy: sortBy,
                    direction: direction,
                    sortByTable: param.orderBy,
                    directionTable: param.direction,
                    name: this.sName,
                    schoolable: schoolable,
                    is_roozane: is_roozane,
                    jensiat: jensiat,
                    doore: doore,
                    vaziat: vaziat,
                    noe_fazaye_amoozeshi: noe_fazaye_amoozeshi,
                    hooze_namayandegi_id: param['data'],
                    paginate: this.per_page,
                    page: param['page'],
                    sale_tasis: {'min': this.min_sal, 'max': this.max_sal},
                    tedad_daneshamooz: {'min': this.min_tedad, 'max': this.max_tedad},


                })
                    .then((response) => {
//                        console.log(response);

                        this.loading.addClass('hide');
//                        this.banners = JSON.parse(response.data)['data'];
                        this.schools = response.data['data'];
                        if (this.schools === null || this.schools.length === 0) {
                            this.schools = [];
                            this.no_result.removeClass('hide');
                            if (param['page'] !== null && param['page'] > 1) {
                                param['page'] = 1;
                                this.$root.$emit('search');
                            }

                        }
//                        console.log(this.schools);
//                        console.log(response);

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
                        this.$root.$emit('schoolsChange', this.schools);


                    }).catch((error) => {
                    console.log('res error:');
                    console.log(error);
                    this.loading.addClass('hide');
                });
            },
            setEvents() {
                // event from dropdown
                this.$root.$on('dropdownResponse', (params) => {
//                    console.log(params);
                    this.search(params);

                });

                this.$root.$on('changeShow', (show) => {
//                    console.log(show);
                    this.show = show;
                    $(window).scrollTop(0);

                });


            },
            setAxiosCsrf() {
                window.axios.defaults.headers.common['X-CSRF-TOKEN'] =
                    $('meta[name="csrf-token"]').prop('content');

            },

            setSliders(type) {


                if (type === 0) { //init sliders
                    $(() => {
                        $("#slider-sal").slider({
                            range: true,
                            orientation: "horizontal",
                            min: 1300,
                            max: 1500,
                            values: [1300, 1500],
                            step: 1,

                            slide: (event, ui) => {
                                if (ui.values[0] === ui.values[1]) {
                                    return false;
                                }
                                this.min_sal = (ui.values[0]);
                                this.max_sal = (ui.values[1]);

                            }
                        });
//                        $("#min_price").val($("#slider-range").slider("values", 0));
//                        $("#max_price").val($("#slider-range").slider("values", 1));
//                        this.min_sal = el_slider_sal.slider("values", 0);
//                        this.max_sal = el_slider_sal.slider("values", 1);
                    });
                    $(() => {
                        $("#slider-tedad").slider({
                            range: true,
                            orientation: "horizontal",
                            min: 0,
                            max: 10000,
                            values: [0, 10000],
                            step: 1,

                            slide: (event, ui) => {
                                if (ui.values[0] === ui.values[1]) {
                                    return false;
                                }
                                this.min_tedad = (ui.values[0]);
                                this.max_tedad = (ui.values[1]);


                            }
                        });
//                        $("#min_price").val($("#slider-range").slider("values", 0));
//                        $("#max_price").val($("#slider-range").slider("values", 1));
//                        this.min_sal = el_slider_sal.slider("values", 0);
//                        this.max_sal = el_slider_sal.slider("values", 1);
                    });
                } else if (type === 1) {

                    if (this.min_sal > 1500)
                        this.min_sal = '';
                    if (this.max_sal > 1500)
                        this.max_sal = '';
                    if (this.min_sal > this.max_sal && this.min_sal > 1000 && this.max_sal > 1000)
                        this.max_sal = this.min_sal;

                    $("#slider-sal").slider({
                        values: [this.min_sal, this.max_sal]
                    });
                } else if (type === 2) {
                    if (this.min_tedad > 10000)
                        this.min_tedad = 10000;
                    if (this.max_tedad > 10000)
                        this.max_tedad = 10000;
                    if (this.min_tedad > this.max_tedad && this.min_tedad > 10000 && this.max_tedad > 10000)
                        this.max_tedad = this.min_tedad;

                    $("#slider-tedad").slider({
                        values: [this.min_tedad, this.max_tedad]
                    });
                }
            },
        }
    }

</script>