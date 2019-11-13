<template>

    <div class=" container search-container  ">

        <div class="modal-header d-flex justify-content-start " style="font-family: RobotoBold,serif">
            <ul class="alert-blue border-all     text-dark-blue mt-2 w-100 px-3 py-1 mb-0">
                <h6>Use High Contrast Images</h6>
                <h6>Use More Than 20 Characters</h6>
                <!--<h6>Use different Scanners</h6>-->
                <h6>For Low Contrast Images, Use Black Dots QR</h6>
                <h6>Click On Created QR For Download !</h6>
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
                <h5 class="uploader-message  text-center text-danger ">Maximum Image size:  2MB </h5>
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

            <div v-show="loading" class="loading-page center-block  "></div>
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
            <canvas id="myCanvas" class="hide"></canvas>
            <input id="x" name="x" type="hidden"/>
            <input id="y" name="y" type="hidden"/>
            <input id="width" name="width" type="hidden"/>
            <input id="height" name="height" type="hidden"/>
            <input id="image-name" name="image-name" type="hidden"/>
            <div id="image-crop-outline" style="visibility: hidden" class="position-absolute">
                <textarea placeholder="Write QR Text Here" id="input_qr_text" name="input_qr_text"
                          class="form-control mb-1 " style="    min-width: 110px;"></textarea>
                <!--class="form-control mb-1 " style="    min-width: 110px;" @keyup.enter="makeQR( )"></textarea>-->
                <div class="d-flex justify-content-between">
                    <button @click="autoColor=true;makeQR( );  " id="btn-create-qr"
                            class="btn btn-lg btn-dark-blue   mr-1 w-100" style="min-width: 90px;">
                        Colorize  QR
                    </button>
                    <button @click="autoColor=false;makeQR( );  " id="btn-create-qr-blackdots"
                            class="btn btn-lg btn-dark-red  w-100 " style="min-width: 90px;">
                        Black Dots  QR
                    </button>
                </div>

            </div>
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
    let $outline, $previewHolder, $preview, $input_qr_text, $btn_create_qr;

    //    let __awesome_qr_base_path = "awesomeqr";
    require('../awesomeqr/require');


    export default {


        props: ['siteName', 'qrCreatedLink'],
        components: {},
        data() {
            return {
                doc: null,
                cropper: null,
                reader: null,
                loading: false,
                SIZE_LIMIT: 2, //MB
                AwesomeQRCode: null,
                qr_text: null,
                creating: false,
                removing: false,
                uploader: $('#uploader'),
                qr_image: $('#qrcode'),
                autoColor: true,
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
            incrementQRCreated() {
                this.loading = true;


                axios.post(this.qrCreatedLink, {})
                    .then((response) => {
                        console.log(response);

                    }).catch((error) => {
                    console.log(error);
                })
            },
            downloadImage() {
//                console.log(this.qr_image.attr('src'));
                let link = document.createElement('a');
                link.download = image_name;
                link.href = this.qr_image.attr('src');
                link.click();
            },
            makeQR() {
                if (!$input_qr_text.val()) {
                    swal.fire({
                        title: '<strong class="text-danger">Error</strong>',
                        html: '<strong class="text-danger">Please Write Your QR Text in Field</strong>',
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
                let input_x = $('input#x'),
                    input_y = $('input#y'),
                    input_width = $('input#width'),
                    input_height = $('input#height');

                canvas.width = input_width.val() - 2;
                canvas.height = input_height.val() - 2;

                let ctx = canvas.getContext("2d");

                ctx.drawImage(imageObj, input_x.val(), input_y.val(),
                    input_width.val(), input_height.val(),
                    0, 0, input_width.val(), input_height.val());

                let $image_name = $('#image-name').val();
                let $image_format = $image_name.substring($image_name.length - 4, $image_name.length);
                if ($input_qr_text.val() === '') {

                    // console.log($image_format);
                    $input_qr_text.val($image_name.substring(0, $image_name.length - 4));
                }


                //************************* AwesomeQRCode
                require(['awesomeqr/awesome-qr'], function (AwesomeQR) {
                    // ... and make use of it
                    AwesomeQR().create({
                        text: $input_qr_text.val() + `\nCreated By: \nwww.qr-image-creator.com`,  //min is 14 char for bad images
                        size: cropper.getCropBoxData().width,
                        margin: 5,
                        whiteMargin: true,
                        binarize: false,
                        binarizeThreshold: 128,
//                        dotScale: 0.4,
//                        maskedDots: true,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        autoColor: self.autoColor,
                        bindElement: 'qrcode',
                        backgroundDimming: 'rgba(0,0,0,0)',
                        backgroundImage: cropper.getCroppedCanvas(),
                        callback: function (dataURI) {
//                            console.log($input_qr_text.val());
                            if (dataURI === undefined)
                                console.log('failed to generate the QR code');
                            else {
                                self.incrementQRCreated();
//                                console.log();
//                                $("#qrcode").css({
//                                    visibility: 'visible'
//                                })
                            }
                            self.loading = false;

                        }
                    });
                });
//                AwesomeQR().create({
//
//                        text: $input_qr_text.val(),
//                        size: input_width.val(),
//                        margin: 5,
//                        // colorDark: "#000000",
//                        // colorLight: "#ffffff",
//                        backgroundImage: image,
//                        backgroundDimming: 'rgba(0,0,0,0)',
//                        // logoImage: logoImg,
//                        // logoScale: 0.2,
//                        // logoMargin: 6,
//                        // logoCornerRadius: 8,
//                        whiteMargin: true,
//                        dotScale: 0.35,
//                        autoColor: true,
//                        binarize: false,
//                        binarizeThreshold: 128,
//                        callback: function (dataURI) {
//                            console.log('hi');
//                            if (dataURI === undefined)
//                                console.log('failed to generate the QR code');
//                            else
//                                console.log(dataURI);
//
//                        }
//                        ,
//                        bindElement: 'qrcode',
//                    }
//                );


                $('img#qrcode').css({
                    'left': cropper.getCropBoxData().left,
                    'top': cropper.getCanvasData().top,
//                    'margin-top': 160
                    'max-width': cropper.getCropBoxData().width,
                    visibility: 'visible',
                });

                $('html,body').animate({scrollTop: $("#" + 'qrcode').offset().top - 20}, 'slow');
            },
            initCropper() {
                $('img#qrcode').css({

                    visibility: 'hidden',
                });
//                $preview.attr('src', $(image).attr('src'));
                $("#image-crop-outline,#btn-create-qr-blackdots,#btn-create-qr,#input_qr_text").css({
                    visibility: 'visible',
                    'z-index': 5,

                });
                if (cropper)
                    cropper.destroy();
                cropper = new Cropper(image, {
//                    autoCrop: true,
                    aspectRatio: 1,
                    crop(event) {

                        $("#image-crop-outline").css({
//                            visibility: 'visible',
                            left: /*cropper.getData().x,*//*$(".cropper-crop-box").position().left*/ cropper.getCropBoxData().left + 30,
                            top: /*cropper.getData().y*/  cropper.getCropBoxData().top + cropper.getCropBoxData().height + 20,
                            width: cropper.getCropBoxData().width
                        });
                        self.creating = true;
//                        console.log(event.detail.x);
//                        console.log(event.detail.y);
//                        console.log(event.detail.width);
//                        console.log(event.detail.height);
//                        console.log(event.detail.rotate);
//                        console.log(event.detail.scaleX);
//                        console.log(event.detail.scaleY);
//                        console.log();
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