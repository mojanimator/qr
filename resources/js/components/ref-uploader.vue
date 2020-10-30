<template>

    <div class=" container search-container  ">

        <div class="modal-header d-flex justify-content-end col-12">
            <div class="alert-blue border-all     text-dark-blue mt-2 w-100 px-3 py-1 mb-0">
                <p class="text-right font-weight-bold">ساخت سوال جدید</p>
            </div>
        </div>

        <div class=" w-100 outline">

            <!--class="form-control mb-1 " style="    min-width: 110px;" @keyup.enter="makeWallpaper( )"></textarea>-->
            <div class="d-flex   my-1 row col-12">

                <p class="col-md-12  text-right font-weight-bold">نوع سوال - نام اپ </p>

                <dropdown :placeholder="'نام اپ'" :refId="'app'"
                          :data-link="appsLink" :multi="false" class="  mb-1 col-md-5  text-right" ref="dropdownApps"
                          :beforeSelected="false">
                </dropdown>
                <dropdown :placeholder="'نوع سوال'" :refId="'type'"
                          :data-link="typesLink" :multi="false" class="  mb-1 col-md-5  text-right" ref="dropdownTypes"
                          :beforeSelected="false">
                </dropdown>


            </div>

        </div>
        <div class="col-12 outline ">
            <p class="col-md-12  text-right font-weight-bold"> جواب یا گزینه ها</p>

            <div class="row col-12  align-self-center align-items-baseline  p-2 ">

                <div class="col-6 d-flex     align-items-center ">
                    <label class="p-1" for="expires">انقضا (ساعت بعد)</label>
                    <input id="expires" v-model="expires_after_hours" type="number" min="0"
                           class="form-control mt-1  col-6 text-center"/>

                </div>
                <div class="col-6 d-flex     align-items-center ">
                    <label class="p-1" for="shows">نمایش (ساعت بعد)</label>
                    <input id="shows" v-model="shows_after_hours" type="number" min="0"
                           class="form-control mt-1  col-6 text-center"/>

                </div>

            </div>
            <div class="row col-12  align-self-center align-items-baseline  p-2 ">

                <div class="col-6 d-flex     align-items-center ">
                    <label class="p-1" for="score">امتیاز</label>
                    <input id="score" v-model="score" type="number" min="0"
                           class="form-control mt-1  col-6 text-center"/>

                </div>

                <div class="col-6 d-flex   align-items-center ">
                    <label class="p-1" for="is_predict">پیش بینی است (فعلا جواب ندارد)</label>
                    <input class=" " id="is_predict" type="checkbox" v-model="is_predict"
                           @change="is_predict===true?response=null:options.lentgh>0?response=options[0].text:response=null"/>
                </div>
            </div>

            <div class="  row col-12" v-for="op,idx in options" :key="op.id">

                <div class=" col-1  align-self-center align-content-center  ">
                    <input type="radio" name="options" :value="op.text" v-model="response"
                           @click="is_predict=false"
                    >
                </div>
                <div class=" col-1  align-self-center align-content-center  ">
                    <i class="fas fa-2x fa-minus-square  hoverable text-red"
                       @click=" response===op.text? response=null:null  ;options.splice(idx, 1); "></i>
                </div>
                <div class="col-10  ">
                    <input v-model="op.text" type="text" class="form-control mt-1 col-md-12 text-right">
                </div>

            </div>
            <div class="">
                <i class="fas fa-2x fa-plus-square  hoverable text-green"
                   @click="options.push({id:options.length+1,text:''})"></i>
            </div>

        </div>
        <div class=" col-12 outline">
            <!--class="form-control mb-1 " style="    min-width: 110px;" @keyup.enter="makeWallpaper( )"></textarea>-->
            <p class="col-md-12  text-right font-weight-bold"> متن سوال یا عکس</p>
            <div class="d-flex justify-content-between my-2 row col-12">
                <input v-model="question" type="text" class="form-control mt-1 col-md-12 text-right">
            </div>


            <div class="  w-100 my-1">
                <form id="uploader" enctype="multipart/form-data" class="uploader-container mx-2 mt-2 p-2 flex-column"
                      role="form" method="post" @mouseover="uploader.addClass('hover');"
                      @dragover.prevent="uploader.addClass('hover');"
                      @dragleave.prevent="uploader.removeClass('hover');"
                      @mouseleave=" uploader.removeClass('hover');"
                      @drop.prevent="uploader.removeClass('hover');filePreview($event,'img-input') "
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


        <div class="col-12 py-3">
            <button @click.prevent=" createQuiz( );  " id="btn-create-qr"
                    class="btn btn-lg btn-blue   mr-1 w-100" style="min-width: 90px;">
                Create Quiz
            </button>
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


        props: ['createLink', 'searchLink', 'typesLink', 'appsLink',],
        components: {dropdown},
        data() {
            return {
                doc: null,
                question: '',
                options: [{id: 1, text: ''}],
                cropper: null,
                response: null,
                is_predict: false,
                expires_after_hours: 0,
                shows_after_hours: 0,
                score: 3,
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

            check() {
                let message = '';
//                let numMessage = 'Please import one image';

                for (let idx in this.options) {

                    if (this.options[idx].text === '') {
                        message += '<p class="text-danger">لطفا گزینه های خالی جواب را پاک کرده یا پر کنید</p>';
                        break;
                    }
                    if (this.options[idx].text.length > 50) {
                        message += '<p class="text-danger">طول گزینه ها زیر 50 کلمه باشد</p>';
                        break;
                    }
                }


                if (doc === null && this.question === '') {
                    message += '<p class="text-danger">متن سوال یا  عکس ضروری است</p>';

                }
                else if (doc !== null && this.question !== '') {
                    message += '<p class="text-danger">متن و عکس به طور همزمان برای سوال غیر مجاز است</p>';

                }
                else if (this.question.length > 100) {
                    message += '<p class="text-danger">متن و عکس به طور همزمان برای سوال غیر مجاز است</p>';

                }

                else if (this.options.length === 0 && this.is_predict === false) {
                    message += '<p class="text-danger">حداقل یک گزینه بعنوان جواب ضروری است </p>';

                }
                else if (this.options.filter(item => {
                        return item.text === this.response
                    }).length === 0 && this.is_predict === false) {
                    message += '<p class="text-danger">حداقل یک گزینه بعنوان جواب ضروری است </p>';

                }

                else if (this.is_predict === true && this.expires_after_hours === 0) {
                    message += '<p class="text-danger">سوالات پیش بینی نیاز به ساعت انقضا دارند </p>';

                }
                else if (this.is_predict === false && this.response === null) {
                    message += '<p class="text-danger">یک جواب مشخص کنید یا تیک پیش بینی را بزنید </p>';

                }
                else if (this.$refs.dropdownTypes.selected.length === 0) {
                    message += '<p class="text-danger">نوع سوال ضروری است</p>';

                }
                else if (this.$refs.dropdownApps.selected.length === 0) {
                    message += '<p class="text-danger">نام اپلیکیشن ضروری است</p>';

                }
                else if ((this.$refs.dropdownTypes.selected[0].id === 1 || this.$refs.dropdownTypes.selected[0].id === 2)
                    && this.question === '') {
                    message += '<p class="text-danger">نوع سوال نیاز به متن دارد</p>';

                }
                else if ((this.$refs.dropdownTypes.selected[0].id === 3 || this.$refs.dropdownTypes.selected[0].id === 4)
                    && this.doc === null) {
                    message += '<p class="text-danger">نوع سوال نیاز به عکس دارد</p>';

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
            createQuiz() {
                console.log('createQuiz');
                this.loading = true;
                this.creating = true;
//                let imageObj = document.getElementById("img");
                canvas = document.getElementById("myCanvas");

                $('html,body').animate({scrollTop: $("#" + 'qrcode').offset().top}, 'slow');


                if (this.check()) {
                    if (cropper !== null)
                        cropper.crop();


                    axios.post(this.createLink, {
                        'img': cropper.getCroppedCanvas() !== null ? cropper.getCroppedCanvas().toDataURL('image/jpeg') : null /*imageObj.src*/,
                        'score': this.score,
                        'question': this.question,
                        'response': this.is_predict === true ? null : this.response,
                        'type_id': this.$refs.dropdownTypes.selected[0].id,
                        'app_id': this.$refs.dropdownApps.selected[0].id,
                        'options': this.options.map(item => {
                            return item.text
                        }),
                        'expires_after_hours': this.expires_after_hours,
                        'shows_after_hours': this.shows_after_hours,
                        'is_predict': this.is_predict,
                    })
                        .then((response) => {
                            console.log(response);
                            this.loading = false;
                            if (response.status !== 200) {
                                swal.fire({
                                    title: 'خطایی رخ داد',
                                    html: ` <p   class="text-danger">` + response + `</p>`,
//                        text: this.errors,
                                    confirmButtonColor: '#d33',
                                    type: 'error',
                                    confirmButtonText: ' باشه',
                                });

                            } else
                                window.location.reload();
//                        console.log(this.data);
//                        this.data = response.data;
//                        this.filteredData = this.data;
                        }).catch((error) => {
                        this.loading = false;
                        console.log(' error:');
                        console.log(error);
                    });
                }
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

                cropper.crop();

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
                $("#image-crop-outline,#input_qr_text").css({
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