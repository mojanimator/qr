<template>

    <div class="row col-12  mx-1  gallery">
        <div class="row col-12 mt-1">
            <div class="col-6">
                <pagination class="    "></pagination>
            </div>
            <div class="col-6">
                <dropdown :placeholder="'select group'" :refId="'docc'"
                          :data-link="docGroupsLink" :multi="false"
                          class="  mb-1 " ref="dropdownDocs2"
                          :beforeSelected="false">
                </dropdown>
            </div>
        </div>
        <div v-for="w,idx in wallpapers" class="col-12 col-sm-6 col-md-4 col-lg-3 p-1">

            <div class="m-card h-100 d-flex align-items-center flex-column justify-content-between " :key="w.id">

                <div class="m-card-header bg-transparent  w-100 ">
                    <span class="py-2 bg-danger w-100 hoverable-light text-center "
                          @click="showDialog(0,{id:w.id,group_id:w.group_id,page:params.page,path:w.path}) ">
                        <i class="fa fa-trash"></i>
                    </span>
                    <!--<span class="    px-1 text-white   ">{{w.path}}  </span>-->


                    <!--<span class="left-border px-2 float-left  badge-pill text-white   small-1 bg-light-red"-->
                    <!--data-toggle="tooltip" data-placement="top" title="image size">-->
                    <!--{{w.size}}-->
                    <!--</span>-->
                    <!--<img class="back-header-img" src="/img/card-header.png" alt="">-->
                    <!--<img onerror="this.onerror=null; this.src='img/noimage.png'" :id="'img-'+w.id" class="wallpaper-img"-->
                    <!--:src="getImage(w.group_id,w.path)" alt="">-->
                    <a :href="homeLink+getImage(w.group_id,w.path)" data-lity
                       :data-lity-desc="w.path" class=" w-100">

                        <img @loadstart="$refs['img-'+w.id][0].src=homeLink + '/img/loading.gif'"
                             @error=" $refs['img-' + w.id][0].src = homeLink + '/img/noimage.png'" :id="'img-' + w.id"
                             :ref="'img-' + w.id"
                             class="wallpaper-img w-100"
                             :src="homeLink+getImage(w.group_id,w.path,'thumb')" alt="">
                    </a>
                </div>


                <!--<img v-else src="img/school-no.png" alt=""></div>-->
                <div class="m-card-body  px-2   flex-column justify-content-start ">

                    <p class="badge-pill bg-dark text-white mb-0 text-center"> {{w.created_at}}</p>

                    <div class="codes d-flex justify-content-center pt-1">
                        <p class="  right-border  badge-pill bg-gradient-blue text-white small d-inline-block "
                        >
                            <span> {{w.size}}</span> KB
                        </p>
                        <p class="left-border  badge-pill bg-gradient-purple text-white small d-inline-block "
                        >
                            <span> {{w.path}}</span>
                        </p>
                    </div>
                    <a :href="w.link"><p class="badge-pill bg-dark text-white mb-0 text-center"> {{w.link ? w.link : '?'}}</p>
                    </a>

                    <div class="card-divider"></div>

                </div>
                <div class="m-card-footer  bg-transparent      ">
                    <img class="mb-auto  back-footer-img" :src="homeLink+'/img/card-footer.png'" alt="">
                </div>
            </div>
        </div>

    </div>


</template>

<script>
    let homeLink = '';
    let link = '';
    import pagination from './pagination.vue';
    import dropdown from './dropdown.vue';


    export default {

        props: ['docDeleteLink', 'docSearchLink', 'docGroupsLink', 'homeLink'],
        components:
            {
                pagination: pagination,
                dropdown:
                dropdown,
            }
        ,
        data() {
            return {
                params: {'group_id': 1, 'page': 1},
                orderBy: '',
                direction: 'ASC',
                wallpapers: [],
                loading: false,
                errors: '',
                updated: false,

            }
        }
        ,
        mounted() {

            this.setEvents();
            this.getWallpapers(this.params);

            this.loading = $('.loading-page');


//            console.log(ol.proj.transform(['637095', '3165881']));
        }
        ,
        created() {
            homeLink = this.homeLink;
        }
        ,

        updated() {
//            if (!this.updated) {
//                this.setEvents();
//            console.log('update');

//            } else this.updated = true;
        }
        ,
        methods: {
            deleteWallpaper(params) {
                this.loading.removeClass('hide');


//                console.log(this.panelLink + "/delete/s=" + school.id);
//                console.log(param);
                axios.post(this.docDeleteLink, params)
                    .then((response) => {
//                        console.log(response);
                        this.loading.addClass('hide');
                        if (response.status === 200) {
//                            this.showDialog(1);
                            this.wallpapers = response.data.data;
//                            console.log(this.wallpapers);

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
            }
            ,
            showDialog(type, data) {
                // 0  ready for save
                // 1  success  save
                // else show errors
                if (type === 0)
                    swal.fire({
                        title: 'Delete Image ?',
                        text: ' ',
                        type: 'error',
                        showCancelButton: true,
                        showCloseButton: true,
                        cancelButtonText: 'NO',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: ' Yes',
                    }).then((result) => {
                        if (result.value) {
                            this.deleteWallpaper(data);
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
            }
            ,


            getImage(group_id, path, thumb) {

                if (thumb)
                    return '/storage/' + group_id + '/' + 'thumb-' + path;
                else
                    return '/storage/' + group_id + '/' + path;
            }
            ,
            getWallpapers() {
//                console.log(this.$refs.dropdownDocs2.selected);
//                link = this.docSearchLink
                if (this.$refs.dropdownDocs2.selected.length > 0)
                    this.params.group_id = this.$refs.dropdownDocs2.selected[0].id;

                axios.get(this.docSearchLink, {params: this.params})
                    .then((response) => {
                        if (response.status === 200) {
//
                            this.wallpapers = response.data.data;

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

                            if (this.wallpapers.length === 0 && this.params.page !== 1) {
                                this.params.page = 1;
                                this.getWallpapers();
                            }

                        }
                    }).catch((error) => {
                    this.errors = '';
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
            }
            ,

            setEvents() {

                this.$root.$on('paginate_click', data => {
                    this.params.page = data['page'];
                    this.getWallpapers();
                });
                this.$root.$on('dropdown_click', data => {
                    this.params.group_id = data['group_id'];
                    this.getWallpapers();
                });

//                $("img[id^='img-']").each((i, el) => {
////                    console.log(i);
//
//                    let imgTag = el;
//                    let img = new Image();
//                    img.src = imgTag.src;
////                    imgTag.src = '';
//                    $(imgTag).addClass('loading');
//                    img.onload = () => {
//                        imgTag.src = img.src;
//                        $(imgTag).removeClass('loading');
////                imgTag.setAttribute('src', img.src);
//                        // Fade out and hide the loading image.
////                $('.loading').fadeOut(100); // Time in milliseconds.
//                    };
//                    img.onerror = (e) => {
////                console.log(e);
//                        $(imgTag).removeClass('loading');
//                        $(imgTag).prop('src', './img/noimage.png');
//                    };
//
//                });


            }
        }

    }


</script>