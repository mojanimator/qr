<template>
    <div class="row    m-panel container-fluid position-relative  ">

        <div class=" col-lg-4 col-md-6">
            <div class="    user-panel mb-1 d-flex flex-column  justify-content-between ">

                <div class="user-panel-header bg-gradient-blue  d-flex flex-column align-items-center ">
                    <div class="m-background"></div>
                    <div class="user-image-container">
                        <img class="user-image" src="/storage/img/blue-user.png" alt="">
                    </div>
                </div>


                <div class="user-panel-body   px-4  d-flex flex-column align-items-center   ">

                    <p class="h3 font-weight-bold text-primary ">
                        <span v-if="user.username"> {{user.username}}</span>
                        <span v-else> <i class="fas  fa-question-circle text-danger"></i> </span>
                    </p>
                    <div class="card-divider"></div>
                    <div class="text-primary  ">نام:
                        <span v-if="user.name"> {{user.name}}</span>
                        <span v-else> <i class="fas  fa-question-circle text-danger"></i> </span>
                    </div>
                    <div class="text-primary ">نام خانوادگی:
                        <span v-if="user.family"> {{user.family}}</span>
                        <span v-else> <i class="fas  fa-question-circle text-danger"></i> </span>
                    </div>
                    <div class="text-primary ">شماره تلفن:
                        <span v-if="user.phone_number"> {{user.phone_number}}</span>
                        <span v-else> <i class="fas  fa-question-circle text-danger"></i> </span>
                    </div>
                </div>

            </div>
        </div>

        <div class="row  col-lg-8 col-md-6 ">
            <div class="   col-lg-6 ">
                <div class="panel-part  " @click="view('users')">

                    <div class=" colored-half p-1  bg-primary   d-flex flex-column align-items-center  justify-content-between">
                        <div class="m-background"></div>
                        <div class="image-container   ">
                            <img class="image  " src="/storage/img/white-user.png" alt="">
                        </div>
                        <div class="h5 pt-1 text-white">کاربران</div>
                    </div>

                </div>
            </div>
            <div class=" col-lg-6">
                <div class="panel-part" @click="view('schools')">
                    <div class=" colored-half  p-1 bg-purple d-flex flex-column align-items-center  justify-content-between">
                        <div class="m-background"></div>
                        <div class="image-container    ">
                            <img class="image  " src="/storage/img/white-school.png" alt="">
                        </div>
                        <div class="h5 pt-1 text-white">مدارس</div>
                    </div>
                </div>
            </div>
            <div class=" col-lg-6">
                <div class="panel-part" @click="view('hoozes')">
                    <div class=" colored-half  p-1 bg-red d-flex flex-column align-items-center  justify-content-between">
                        <div class="m-background"></div>
                        <div class="image-container    ">
                            <img class="image  " src="/storage/img/white-hoozes.png" alt="">
                        </div>
                        <div class="h5 pt-1 text-white">حوزه ها</div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6  ">
                <div class="panel-part    " @click="view('reports')">
                    <div class=" colored-half p-1 bg-secondary d-flex flex-column align-items-center  justify-content-between">
                        <div class="m-background"></div>
                        <div class="image-container    ">
                            <img class="image  " src="/storage/img/white-reports.png" alt="">
                        </div>
                        <div class="h5 pt-1 text-white">گزارش </div>
                    </div>
                </div>
            </div>
        </div>


    </div>


</template>

<script>
    const EventBus = new Vue();

    export default {

//        extends: bannerCards,

        props: ['user', 'panelLink'],

        data() {
            return {}
        },
        created() {


        },
        mounted() {

        },
        updated() {

        },

        methods: {
            view(v) {
                let link;
                if (v === 'schools')
                    link = this.panelLink + "/" + v;
                if (v === 'users')
                    link = this.panelLink + "/" + v;
                else if (v === 'hoozes')
                    link = this.panelLink + "/" + v;
                else if (v === 'reports')
                    link = this.panelLink + "/" + v;
                window.location.href = link;
//                axios.get(link, {})
//                    .then((response) => {
//                        console.log(response);
//                        if (response.status === 200) {
//                            this.showDialog(1);
//
//                        }
//                    }).catch((error) => {
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
//                });
            },
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
        }
    }

</script>

<style lang="scss">


</style>