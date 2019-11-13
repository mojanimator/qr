@extends('layout')

@section('content')
    <!-- Preloader Start -->
    <div id="preloader">
        <div class="colorlib-load"></div>
    </div>



    <!-- ***** Wellcome Area Start ***** -->
    <section class="welcome-area clearfix bg-dark-blue" id="home">
        <div class="container-fluid h-100  ">
            <div class="row h-100 align-items-center  ">


                {{--<img src="/img/ashayer_bg.png" alt="">--}}
                <div class="col-12 col-md front-heading position-absolute top-0">
                    <div class="welcome-heading " id="counter">
                        <h2 class="text-white mt-5 text-center">Create Your QR Image Freely !</h2>

                        <p
                                class="text-white mt-5 text-center counter-value d-flex flex-column  justify-content-center align-items-center"
                                data-count="{{\App\Report::where('action_target','c$q')->count()+3421}}">0
                            <span class="mx-2  ">QR Until Now  </span>
                        </p>

                    </div>

                    <div class="welcome-bottons-container row  col-12 d-flex  ">
                        <!-- Form Start -->

                        {{--<input type="email" class="form-control email" placeholder="name@company.com">--}}

                        @if(auth()->user())
                            <div class="  text-center col-md-4 col-sm-4 col-6">
                                <a class="nav-link p-1 m-btn w-100"
                                   href="{{route('user.panel',['username' =>auth()->user()->username])}}">My Panel
                                </a>
                            </div>
                            <div class="   text-center col-md-4 col-sm-4 col-6 ">
                                <form id="logout-btn" action="{{ route('logout') }}" method="POST"
                                      style="display: none;">
                                    {{ csrf_field() }}
                                </form>
                                <a class="nav-link p-1 m-btn  w-100"
                                   onclick="event.preventDefault(); document.getElementById('logout-btn').submit();"
                                   href="{{route('logout')}}">
                                    <i class="fa fa-btn  fa-sign-out-alt"></i> Logout
                                </a>

                            </div>
                    @endif

                    <!-- Form End -->
                    </div>
                </div>
            </div>
            <div class="banner-anchor   bg-dark-blue text-white text-center hoverable ">
                <i
                        class="fa fa-2x fa-arrow-circle-down mt-5 "></i>
            </div>
        </div>
        <!-- Welcome thumb -->
        {{--<div class="welcome-thumb wow fadeInDown" data-wow-delay="0.5s">--}}
        {{--<img src="img/welcome-img.png" alt="">--}}
        {{--</div>--}}
    </section>
    <!-- ***** Wellcome Area End ***** -->

    <section class=" clearfix    my-5">
        <image-cropper site-name="{{route('/')}}"></image-cropper>

    </section>



@endsection
@section('scripts')
    <script src="js/home.js"></script>
@endsection