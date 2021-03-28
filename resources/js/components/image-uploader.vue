<template>

    <div class=" container search-container  ">

        <div class="modal-header d-flex justify-content-start " style="font-family: RobotoBold,serif">
            <ul class="alert-blue border-all     text-dark-blue mt-2 w-100 px-3 py-1 mb-0">
                <h6>Upload Wallpapers</h6>
            </ul>
        </div>
        <div class="  w-100 my-1">
            <form id="uploader" enctype="multipart/form-data" class="uploader-container mx-2 mt-2 p-2 flex-column"
                  role="form" method="post" @mouseover="uploader.addClass('hover');"
                  @dragover.prevent="uploader.addClass('hover');" @dragleave.prevent="uploader.removeClass('hover');"
                  @mouseleave=" uploader.removeClass('hover');"
                  @drop.prevent="uploader.removeClass('hover');filePreview($event,'img-input') "
                  @click="openFileChooser($event,'img-input')">

                <h4 class="uploader-message p-2 text-center text-dark-blue ">
                    Click Or Drag Images Here!...
                </h4>
                <h5 class="uploader-message  text-center text-danger ">Maximum Image size:  {{SIZE_LIMIT}}MB </h5>
                <!--<h6 class="uploader-message  text-center  "> حجم عکس زیر 2MB </h6>-->
                <!--<h6 class="uploader-message  text-center  "> فرمت jpg یا  png </h6>-->
                <!--<div class="progress w-100 justify-content-end hide">-->
                <!--<div class="p-2 w-auto progress-bar  progress-bar-striped bg-success "-->
                <!--role="progressbar"-->
                <!--:style="'width:'+ percentCompleted+'%'">{{percentCompleted}}%-->
                <!--</div>-->
                <!--</div>-->

            </form>
            <input id="img-input" class="col-12 hide " accept=".png, .jpg, .jpeg" type="file" name="image"
                   style="opacity: 0"
                   @input="filePreview($event,'img-input')"/>


        </div>
        <div class="  row col-12 ">


            <div id="image-crop-outline" style="visibility: hidden" class=" w-100">

                <!--class="form-control mb-1 " style="    min-width: 110px;" @keyup.enter="makeWallpaper( )"></textarea>-->
                <div class="d-flex justify-content-between my-1 row col-12">

                    <input v-model="link" placeholder="reference" type="text" class="form-control mt-1 col-md-5">
                    <dropdown v-show="creating" :placeholder="'select group'" :refId="'doc'"
                              :data-link="docGroupsLink" :multi="false" class="  mb-1 col-md-6" ref="dropdown"
                              :beforeSelected="false">
                    </dropdown>
                    <input v-model="star" placeholder="⭐" type="number" min="0" class="form-control mt-1 col-md-1">
                </div>
                <div class="col-12">
                    <button @click=" makeWallpaper( );  " id="btn-create-qr"
                            class="btn btn-lg btn-dark-blue   mr-1 w-100" style="min-width: 90px;">
                        Create Wallpaper
                    </button>
                </div>
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

            <!--cropper and qr canvas-->
            <!--<canvas id="myCanvas"></canvas>-->
            <input id="x" name="x" type="hidden"/>
            <input id="y" name="y" type="hidden"/>
            <input id="width" name="width" type="hidden"/>
            <input id="height" name="height" type="hidden"/>
            <input id="image-name" name="image-name" type="hidden"/>


            <img src="" id="qrcode" class="col-12 hoverable" @click="downloadImage()"
            />
            <!--footer-->
            <!--<div class="modal-footer justify-content-center   col-12 mt-5">-->
            <!--<button type="button" class="btn btn-primary mx-1    col-md-6 "-->
            <!--@click=" save();  ">Save-->
            <!--</button>-->

            <!--</div>-->


        </div>

    </div>


</template>

<script>
    import swal from 'sweetalert2';
    //    import Cropper from 'cropperjs';


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


        props: ['docCreateLink', 'docSearchLink', 'docGroupsLink',],
        components: {dropdown},
        data() {
            return {
                star: null,
                doc: null,
                link: null,
                cropper: null,
                reader: null,
                loading: false,
                SIZE_LIMIT: 10, //MB
                AwesomeQRCode: null,
                qr_text: null,
                creating: false,
                removing: false,
                uploader: $('#uploader'),
                qr_image: $('#qrcode'),
                autoColor: true,
                errors: "",
            }
        },
        watch: {
            doc: function (val) {
//                console.log(val);
                if (val) {
                    this.initCropper();
                }
            }
        },
        computed: {
//            get_noe_faza: () => {
//                return Vue.noe_faza;
//            }
        },
        mounted() {
            self = this;
            image = document.getElementById('img');
            input = document.getElementById('img-input');
//            $(".point-sw")
            $input_qr_text = $("#input_qr_text");
            this.uploader = $('#uploader');
            this.qr_image = $("#qrcode");

        }
        ,
        created() {
            this.prepareQRCreator();
        }
        ,
        updated() {

//            console.log('updated');

            if (!this.creating)
                this.initCropper();
//            this.AwesomeQRCode = AwesomeQRCode;
//            console.log(window.AwesomeQRCode)
        },
        beforeUpdate() {
        }
        ,
        methods: {
            addToWallpapers() {
                let imageObj = document.getElementById("qrcode");
//                console.log(canvas.toDataURL());

                axios.post(this.docCreateLink, {
                    'doc': cropper.getCroppedCanvas().toDataURL('image/jpeg') /*imageObj.src*/,
                    'group_id': this.$refs.dropdown.selected[0].id,
                    'link': this.link,
                    'star': this.star,
                })
                    .then((response) => {
//                        console.log(response);
                        this.loading = false;
                        window.location.reload();
//                        console.log(this.data);
//                        this.data = response.data;
//                        this.filteredData = this.data;
                    }).catch((error) => {
                    this.loading = false;
                    console.log(' error:');
                    console.log(error);
                    this.errors = error;
                    this.showDialog();
                });

            },
            downloadImage() {
//                console.log(this.qr_image.attr('src'));
                let link = document.createElement('a');
                link.download = image_name;
                link.href = this.qr_image.attr('src');
                link.click();
            },
            makeWallpaper() {
//                console.log(this.$refs.dropdown.selected.length);
                if (this.$refs.dropdown.selected.length !== 1) {
                    swal.fire({
                        title: '<strong class="text-danger">Error</strong>',
                        html: '<strong class="text-danger">Please Select Group</strong>',
                        type: 'error',
                        showCancelButton: true,
                        showConfirmButton: false,
                        showCloseButton: true,
                        cancelButtonText: 'Ok',
                        cancelButtonColor: '#d33',

                    });
                    return;
                }
                this.loading = true;
                this.creating = true;
                let imageObj = document.getElementById("img");
                canvas = document.getElementById("myCanvas");
//                let input_x = $('input#x'),
//                    input_y = $('input#y'),
//                    input_width = $('input#width'),
//                    input_height = $('input#height');

//                let input_x = cropper.getCropBoxData().left,
//                    input_y = cropper.getCropBoxData().top,
//                    input_width = cropper.getCropBoxData().width,
//                    input_height = cropper.getCropBoxData().height;

//                canvas.width = input_width /*- 2*/;
//                canvas.height = input_height /*- 2*/;
//                canvas.width = input_width.val() /*- 2*/;
//                canvas.height = input_height.val() /*- 2*/;

//                let ctx = canvas.getContext("2d");

//                ctx.drawImage(imageObj, input_x.val(), input_y.val(),
//                    input_width.val(), input_height.val(),
//                    0, 0, input_width.val(), input_height.val());
//                ctx.drawImage(imageObj, input_x, input_y,
//                    input_width, input_height,
//                    0, 0, input_width, input_height);
                cropper.crop();
//                canvas = cropper.getCroppedCanvas();
//                imageObj.src = cropper.getCroppedCanvas().toDataURL();
//                console.log(cropper.getCroppedCanvas());
//                this.qr_image.src = canvas.toDataURL();
//                console.log(this.qr_image);
//                this.qr_image.value = canvas;
                $('html,body').animate({scrollTop: $("#" + 'qrcode').offset().top}, 'slow');
//                console.log(cropper.getCroppedCanvas());
                this.addToWallpapers();
            },
            initCropper() {
                $('img#qrcode').css({

                    visibility: 'hidden',
                });
//                $preview.attr('src', $(image).attr('src'));
                if (cropper)
                    cropper.destroy();
                cropper = new Cropper(image, {
                    autoCropArea: 1,
//                    viewMode: 3,
//                    autoCrop: true,
//                    aspectRatio: 3 / 4,
                    crop(event) {

//                        console.log(cropper.getCropBoxData().width);
                        $("#image-crop-outline").css({
                            visibility: 'visible',
//                            left: cropper.getCropBoxData().left + 30,
//                            top: cropper.getCropBoxData().top + cropper.getCropBoxData().height + 20,
//                            width: cropper.getCropBoxData().width
                        });
                        self.creating = true;
                    },
                });
                $('html,body').animate({scrollTop: $("#" + 'uploader').offset().top + 20}, 'slow');

//                console.log(this.cropper);

//            else

//                this.cropper.crop();
//                this.cropper.move(1, -1).rotate(45);
//                this.creating = true;
            }
            ,
            removeImage() {

                doc = null;
                this.doc = null;
                input.value = "";

//                $("#image-crop-outline").children().css({
//                    visibility: 'hidden',
//                    top: 0,
//                });
                $("#image-crop-outline,#btn-create-qr-blackdots,#btn-create-qr,#input_qr_text").css({
                    visibility: 'hidden',
                    top: 0,
                });
                $("img#qrcode").css({
                    visibility: 'hidden',
                    top: 0,


                }).attr({'src': null});


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
                        $input_qr_text.val('');
                    };
                    this.reader.readAsDataURL(file);
                    this.loading = true;
                    image_name = '[' + this.siteName + ']-' + file.name;
                }

            }
            , showDialog(type, data) {
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

            prepareQRCreator() {
                $outline = $('#image-crop-outline')
                    .css({
                        opacity: .5,
                        position: 'absolute',
                        border: '10px red'
                    });
                $input_qr_text = $("#input_qr_text")
                    .css({
                        width: '40rem',
                        opacity: 1,
                        'font-size': 18


                    }).attr("placeholder", "QR Text...");
//

                $btn_create_qr = $("#btn-create-qr")
                    .css({
                        opacity: 1

                    })
                //                    .appendTo($previewHolder)


                // **************   MY EDIT    ***************************


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