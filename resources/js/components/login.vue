<template>

    <div class="limiter">
        <div class="container-login100">
            <div class="wrap-login100">
                <form class="login100-form validate-form">
					<span class="login100-form-title p-b-26">
						Welcome
					</span>
                    <span class="login100-form-title p-b-48">
						<i class="zmdi zmdi-font"></i>
					</span>

                    <div class="wrap-input100 validate-input" data-validate="Valid email is: a@b.c">
                        <input class="input100" type="text" name="email">
                        <span class="focus-input100" data-placeholder="Email"></span>
                    </div>

                    <div class="wrap-input100 validate-input" data-validate="Enter password">
						<span class="btn-show-pass">
							<i class="zmdi zmdi-eye"></i>
						</span>
                        <input class="input100" type="password" name="pass">
                        <span class="focus-input100" data-placeholder="Password"></span>
                    </div>

                    <div class="container-login100-form-btn">
                        <div class="wrap-login100-form-btn">
                            <div class="login100-form-bgbtn"></div>
                            <button class="login100-form-btn">
                                Login
                            </button>
                        </div>
                    </div>

                    <div class="text-center p-t-115">
						<span class="txt1">
							Don’t have an account?
						</span>

                        <a class="txt2" href="#">
                            Sign Up
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>


</template>

<script>

    export default {

        props: [],

        data() {
            return {}
        },
        mounted() {




            /*==================================================================
            [ Focus input ]*/
            $('.input100').each(() => {
                $(this).on('blur', () => {
                    if ($(this).val().trim() !== "") {
                        $(this).addClass('has-val');
                    }
                    else {
                        $(this).removeClass('has-val');
                    }
                })
            });


            /*==================================================================
            [ Validate ]*/
            let input = $('.validate-input .input100');

            $('.validate-form').on('submit', function () {
                let check = true;

                for (let i = 0; i < input.length; i++) {
                    if (validate(input[i]) === false) {
                        showValidate(input[i]);
                        check = false;
                    }
                }

                return check;
            });


            $('.validate-form .input100').each(() => {
                $(this).focus(function () {
                    hideValidate(this);
                });
            });


            /*==================================================================
            [ Show pass ]*/
            let showPass = 0;
            $('.btn-show-pass').on('click', function () {
                if (showPass === 0) {
                    $(this).next('input').attr('type', 'text');
                    $(this).find('i').removeClass('zmdi-eye');
                    $(this).find('i').addClass('zmdi-eye-off');
                    showPass = 1;
                }
                else {
                    $(this).next('input').attr('type', 'password');
                    $(this).find('i').addClass('zmdi-eye');
                    $(this).find('i').removeClass('zmdi-eye-off');
                    showPass = 0;
                }

            });


        },
        created() {

        }
        ,
        methods: {
            validate(input) {
                if ($(input).attr('type') === 'email' || $(input).attr('name') === 'email') {
                    if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) === null) {
                        return false;
                    }
                }
                else {
                    if ($(input).val().trim() === '') {
                        return false;
                    }
                }
            },

            showValidate(input) {
                let thisAlert = $(input).parent();

                $(thisAlert).addClass('alert-validate');
            },

            hideValidate(input) {
                let thisAlert = $(input).parent();

                $(thisAlert).removeClass('alert-validate');
            }
        }

    }


</script>