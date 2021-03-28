<template>

    <div class=" container search-container  ">

        <div class="modal-header d-flex justify-content-end col-12">
            <div class="alert-blue border-all     text-dark-blue mt-2 w-100 px-3 py-1 mb-0">
                <p class="text-right font-weight-bold">ساخت رویداد جدید</p>
                <p class="text-right font-weight-bold "> شروع سال با 20، میلادی حساب می شود </p>
                <p class="text-right font-weight-bold "> نوع رویداد فعلا 1 (زمان بازی) است </p>

            </div>
        </div>

        <div class=" w-100 outline">

            <!--class="form-control mb-1 " style="    min-width: 110px;" @keyup.enter="makeWallpaper( )"></textarea>-->
            <div class="d-flex   my-1 row col-12">

                <p class="col-md-12  text-right font-weight-bold"></p>

                <dropdown :placeholder="'نام اپ'" :refId="'app'"
                          :data-link="appsLink" :multi="false" class="  mb-1 col-md-5  text-right" ref="dropdownApps"
                          :beforeSelected="false">
                </dropdown>
                <div class="col-6">
                    <label for="type-1">زمان بازی</label>
                    <input id="type-1" type="radio" v-model="type" value="1" placeholder="نوع رویداد" checked>

                </div>

            </div>

        </div>
        <div class="col-12 outline " v-show="type==1">
            <p class="col-md-12  text-right font-weight-bold"> نام تیم ها </p>

            <div class="row col-12 form-group hustify-content-center m-1">
                <input class="form-control col-6 px-1 right-border" type="text" v-model="guest" placeholder="مهمان">
                <input class="form-control col-6 px-1 left-border" type="text" v-model="host" placeholder="میزبان">
            </div>

            <p class="col-md-12  text-right font-weight-bold"> زمان رویداد </p>

            <div class=" row col-12 justify-content-center m-1">
                <input type="number" class="form-control col-md-2 right-border" placeholder="سال" v-model="time[0]"
                       min="1300">
                <input type="number" class="form-control col-md-2" placeholder="ماه" v-model="time[1]" min="1" max="12">
                <input type="number" class="form-control col-md-2" placeholder="روز" v-model="time[2]" min="1" max="31">
                <input type="number" class="form-control col-md-2  " placeholder="ساعت" v-model="time[3]"
                       max="24">
                <input type="number" class="form-control col-md-2 left-border" placeholder="دقیقه" v-model="time[4]"
                       min="0"
                       max="59">
            </div>
        </div>


        <div class="  row col-12 ">

            <div v-show="loading" class="loading-page center-block  "></div>


        </div>


        <div class="col-12 py-3">
            <button @click.prevent=" createEvent( );  " id="btn-create-evt"
                    class="btn btn-lg btn-blue   mr-1 w-100" style="min-width: 90px;">
                Create Event
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
                message: null,
                host: null,
                guest: null,
                type: 1,
                time: [null, null, null, null, null],
                options: [{id: 1, text: ''}],
                loading: false,
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

        }
        ,
        created() {

        }
        ,
        updated() {

        },
        beforeUpdate() {
        }
        ,
        methods: {

            check() {
                this.loading = true;
                let message = '';
//                let numMessage = 'Please import one image';
                if (this.type === '1' && (this.host === null || this.host === "" || this.guest === null || this.guest === "" ))
                    message += '<p class="text-danger">تیم میزبان و مهمان نباید خالی باشد </p>';

                else if (this.$refs.dropdownApps.selected.length === 0) {
                    message += '<p class="text-danger">نام اپلیکیشن ضروری است</p>';

                }
                else if (this.time.filter((e) => e === null ||
                        !Number.isInteger(parseInt(e))).length > 0)
                    message += '<p class="text-danger">فیلد های زمان ضروری و عددی هستند</p>';
                else if (parseInt(this.time[0]) < 1300)
                    message += '<p class="text-danger">سال چهار رقمی و بزرگتر از 1300 است</p>';
                else if (parseInt(this.time[1]) < 1 || parseInt(this.time[1]) > 12)
                    message += '<p class="text-danger">ماه بین 1 تا 12 باشد</p>';
                else if (parseInt(this.time[2]) < 1 || parseInt(this.time[2]) > 31)
                    message += '<p class="text-danger">روز بین 1 تا 31 باشد</p>';
                else if (parseInt(this.time[3]) < 0 || parseInt(this.time[3]) > 24)
                    message += '<p class="text-danger">ساعت بین 0 تا 24 باشد</p>';
                else if (parseInt(this.time[4]) < 0 || parseInt(this.time[4]) > 59)
                    message += '<p class="text-danger">دقیقه بین 0 تا 59 باشد</p>';

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
            createEvent() {
//                console.log('createQuiz');

                if (this.check()) {


                    axios.post(this.createLink, {
                        'message': this.type === 1 ? this.host + '$' + this.guest : this.message,
                        'app_id': this.$refs.dropdownApps.selected[0].id,
                        'time': this.createTimeFormat(this.time),
                        'type': this.type,
                    })
                        .then((response) => {
                            console.log(response);
                            this.loading = false;
                            if (response.status !== 200) {
                                swal.fire({
                                    title: 'خطایی رخ داد',
                                    html: ` <p   class="text-danger">` + response.data.message + `</p>`,
//                        text: this.errors,
                                    confirmButtonColor: '#d33',
                                    type: 'error',
                                    confirmButtonText: ' باشه',
                                });

                            }
                            else
                                window.location.reload();
//                        console.log(this.data);
//                        this.data = response.data;
//                        this.filteredData = this.data;
                        }).catch((error) => {
                        this.loading = false;
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
                }
            },

            createTimeFormat($time) {
                return $time.map((e) => e.length === 1 ? '0' + e : e).join('$');
//
            }
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