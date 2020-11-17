<template>

    <div class=" container search-container  ">


        <div class="modal-header d-flex justify-content-end col-12">
            <div class="alert-blue border-all     text-dark-blue mt-2 w-100 px-3 py-1 mb-0">
                <p class="text-right font-weight-bold">ساخت شبکه جدید</p>
                <p class="text-right font-weight-bold">برای تلگرام فقط نام کاربری وارد کنید</p>
                <p class="text-right font-weight-bold">برای اینستاگرام چون گیر میده باید تیتر و عکس هم وارد کنید</p>
                <p class="text-right font-weight-bold">برای سایت هوز کار نمیکنه</p>
            </div>

        </div>


        <div class=" w-100 outline">

            <!--class="form-control mb-1 " style="    min-width: 110px;" @keyup.enter="makeWallpaper( )"></textarea>-->
            <div class="d-flex   my-1 row col-12">

                <p class="col-md-12  text-right font-weight-bold"> اطلاعات شبکه اجتماعی </p>

                <dropdown :placeholder="'نام اپ'" :refId="'app'"
                          :data-link="appsLink" :multi="false" class="  mb-1 col-md-6  text-right" ref="dropdownApps"
                          :beforeSelected="false">
                </dropdown>
                <dropdown :placeholder="'نوع شبکه'" :refId="'type'"
                          :data-link="typesLink" :multi="false" class="  mb-1 col-md-6  text-right" ref="dropdownTypes"
                          :beforeSelected="false">
                </dropdown>
                <dropdown :placeholder="'موضوع'" :refId="'group'"
                          :data-link="groupsLink" :multi="false" class="  mb-1 col-md-6  text-right"
                          ref="dropdownGroups"
                          :beforeSelected="false">
                </dropdown>

                <div class=" row col-12   mx-2 ">

                    <input v-model="title" placeholder="تیتر " type="text"
                           class="form-control my-3 col-6    text-right">
                    <input v-model="username" placeholder="نام کاربری " type="text"
                           class="form-control my-3 col-6    text-right">
                </div>
                <input v-model="proxy" placeholder="پراکسی اینستاگرام" type="text"
                       class="form-control my-3 col-12 mx-2  text-right">


            </div>

        </div>
        <div class="col-12 outline ">
            <p class="col-md-12  text-right font-weight-bold">زمانبندی و جایگاه</p>

            <div class="row col-12  align-self-center align-items-baseline  p-2 ">

                <div class="col-6 d-flex     align-items-center ">
                    <label class="p-1" for="expires">انقضا (ساعت بعد)</label>
                    <input id="expires" v-model="expires_after_hours" type="number" min="0"
                           class="form-control mt-1  col-6 text-center"/>

                </div>
                <!--<div class="col-6 d-flex     align-items-center ">-->
                <!--<label class="p-1" for="shows">نمایش (ساعت بعد)</label>-->
                <!--<input id="shows" v-model="shows_after_hours" type="number" min="0"-->
                <!--class="form-control mt-1  col-6 text-center"/>-->

                <!--</div>-->
                <div class="col-6 d-flex   align-items-center ">
                    <label class="p-1" for="is_predict">سنجاق (vip)</label>
                    <input class=" " id="is_predict" type="checkbox" v-model="is_vip"
                    />
                </div>
            </div>


            <div class="col-12  ">
            </div>


        </div>


        <div class="  row col-12 ">

            <div v-show="loading" class="loading-page center-block  "></div>
            <div
                    class="  w-100 my-1">
                <form id="uploader" enctype="multipart/form-data" class="uploader-container mx-2 mt-2 p-2 flex-column"
                      role="form" method="post" @mouseover="uploader.addClass('hover');"
                      @dragover.prevent="uploader.addClass('hover');"
                      @dragleave.prevent="uploader.removeClass('hover');"
                      @mouseleave=" uploader.removeClass('hover');"
                      @drop.prevent="uploader.removeClass('hover');
                      filePreview($event,'img-input') "
                      @click="openFileChooser($event,'img-input')">

                    <h4 class="uploader-message p-2 text-center text-dark-blue ">
                        Click Or Drag Images Here!...
                    </h4>
                    <h5 class="uploader-message  text-center text-danger ">Maximum Image size:  {{SIZE_LIMIT}}MB </h5>


                </form>
                <input id="img-input" class="col-12 hide " accept=".png, .jpg, .jpeg" type="file" name="image"
                       style="opacity: 0"
                       @input="filePreview($event,'img-input')"/>


            </div>
            <div v-show="doc" class="thumb-container img-container col-12 text-center mt-2 mb-5 ">
                <!--<a :href="doc" data-lity>-->
                <img id="img" class="img-thumbnail  "
                     :src="doc"
                     alt=""/>
                <!--</a>-->

                <button :id="'del'" class="btn close-btn bg-danger text-white"
                        @click="removeImage()">
                    <i class="fa fa-window-close text-white" aria-hidden="true"></i>
                </button>
            </div>
        </div>


        <div class="col-12 py-3">
            <button @click.prevent="  createRef( );  " id="btn-create-qr"
                    class="btn btn-lg btn-blue   mr-1 w-100" style="min-width: 90px;">
                Create
            </button>
        </div>
    </div>


</template>

<script>
    import swal from 'sweetalert2';
    //    import Cropper from 'cropperjs';
    import Nanogram from 'nanogram.js';


    let regOnlyNumber = new RegExp('^[0-9]+$');
    let doc = null;

    let image = null;
    let image_name = null;
    let input = null;
    let croppedCanvas;
    let self;
    let canvas;
    let imageURL;
    let cropper;
    let $outline, $input_qr_text, $btn_create_qr;


    import dropdown from './dropdown.vue';


    export default {


        props: ['createLink', 'searchLink', 'typesLink', 'groupsLink', 'appsLink',],
        components: {dropdown},
        data() {
            return {
//                instaSelected: false,
                uploader: $('#uploader'),
                doc: null,
                title: null,
                username: '',
                proxy: '',
                is_vip: false,
                expires_after_hours: 0,
                loading: null,
            }
        },
        watch: {},
        computed: {
//            get_noe_faza: () => {
//                return Vue.noe_faza;
//            }
        },
        mounted() {
            self = this;
            this.loading = false;
//            const instagramParser = new Nanogram();
//            instagramParser.getMediaByUsername('develowper').then((media) => {
//                console.log(media);
//            });
        }
        ,
        created() {

        }
        ,
        updated() {
//            this.instaSelected = this.$refs.dropdownTypes.selected.length > 0 && this.$refs.dropdownTypes.selected[0].id == 2;
//            this.AwesomeQRCode = AwesomeQRCode;
//            console.log(this.instaSelected);
        },
        beforeUpdate() {

        },
        beforeMount() {
            this.loading = true;
        },
        methods: {

            check() {
                let message = '';
//                let numMessage = 'Please import one image';


                if (this.$refs.dropdownTypes.selected.length === 0) {
                    message += '<p class="text-danger">نوع شبکه ضروری است</p>';

                }
                else if (this.$refs.dropdownApps.selected.length === 0) {
                    message += '<p class="text-danger">نام اپلیکیشن ضروری است</p>';

                }
                else if (this.$refs.dropdownGroups.selected.length === 0) {
                    message += '<p class="text-danger">موضوع شبکه ضروری است</p>';

                }


                if (message !== '') {
                    swal.fire({
                        title: '<strong class="text-danger">Error</strong>',
                        html: message,
                        type: 'error',
                        showCancelButton: true,
                        showConfirmButton: false,
                        showCloseButton: true,
                        cancelButtonText: 'Ok',
                        cancelButtonColor: '#d33',

                    });
                    this.loading = false;
                    return false;
                }
                else
                    return true;

            },
            createRef() {

                this.loading = true;
                if (!this.check()) return;
                axios.post(this.createLink, {
                    'img': doc,
                    'title': this.title,
                    'proxy': this.proxy,
                    'username': this.username,
                    'is_vip': this.is_vip,
                    'type_id': this.$refs.dropdownTypes.selected[0].id,
                    'app_id': this.$refs.dropdownApps.selected[0].id,
                    'group_id': this.$refs.dropdownGroups.selected[0].id,
                    'expires_after_hours': this.expires_after_hours,

                })
                    .then((response) => {
//                        console.log(response);
                        this.loading = false;
                        if (response.data !== "REGISTER_SUCCESS") {
                            swal.fire({
                                title: 'خطایی رخ داد',
                                html: ` <p   class="text-danger">` + response.data + `</p>`,
//                        text: this.errors,
                                confirmButtonColor: '#d33',
                                type: 'error',
                                confirmButtonText: ' باشه',
                            });

                        } else {
                            swal.fire({
                                title: 'ثبت موفق!',
                                html: ` <p   class="text-success">` + response.data + `</p>`,
//                        text: this.errors,
                                confirmButtonColor: '#3d3',
                                type: 'success',
                                confirmButtonText: ' باشه',
                            });
                            window.location.reload();
                        }

//                        this.data = response.data;
//                        this.filteredData = this.data;
                    }).catch((error) => {
                    this.loading = false;
                    swal.fire({
                        title: 'خطایی رخ داد',
                        html: ` <p   class="text-danger">` + error + `</p>`,
//                        text: this.errors,
                        confirmButtonColor: '#d33',
                        type: 'error',
                        confirmButtonText: ' باشه',
                    });
                    console.log(' error:');
                    console.log(error);
                });
            },

            removeImage() {

                doc = null;
                this.doc = null;


            }
            ,
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
            }
            ,
            filePreview(e, from) {
                let file;
//                console.log(e);
                if (event.dataTransfer) {
                    file = event.dataTransfer.files[0];
                }
                else if (event.target.files) {
                    file = event.target.files[0];
                }
                if (this.checkDocs(file, from)) {
//                    console.log(files.length);
//                        console.log(files.length);
                    this.reader = new FileReader();
                    this.reader.onload = function (e) {

                        doc = e.target.result;
                        self.doc = doc;
                        self.loading = false;
                        self.creating = false;

                    };
                    this.reader.readAsDataURL(file);
                    this.loading = true;
                    image_name = '[' + this.siteName + ']-' + file.name;
                }

            }

            ,
            checkDocs(file, from) {

                // from certs-input 3 files 4 mb
                // from agent-input 2 files 4mb
                let message = '';
                let sizeMessage = "<strong class='text-danger'>Maximum image size is <strong class='text-primary'>" + this.SIZE_LIMIT + '</strong> MB</strong>';
//                let numMessage = 'Please import one image';

                if (file.size / 1024 / 1024 > this.SIZE_LIMIT) {
                    message = sizeMessage;

                }


                if (message !== '') {
                    swal.fire({
                        title: '<strong class="text-danger">Error</strong>',
                        html: message,
                        type: 'error',
                        showCancelButton: true,
                        showConfirmButton: false,
                        showCloseButton: true,
                        cancelButtonText: 'Ok',
                        cancelButtonColor: '#d33',

                    });
                    return false;
                }
                else
                    return true;

            }
            ,

        }
    }


</script>

<style>
    #img {
        max-width: 100%;
        overflow: hidden;

    }

    .cropper-line {
        background-image: url(../../../public/img/outline.gif);
    }

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