@extends('layout')
@section('title')
    Privacy Policy
@stop
@section('content')
    <!-- Preloader Start -->
    <div id="preloader">
        <div class="colorlib-load"></div>
    </div>



    <!-- ***** Wellcome Area Start ***** -->
    <section class="welcome-area clearfix bg-dark " id="home">
        <div class="container-fluid h-100  ">
            <div class="row  align-items-center h-100  ">

                <div class="col-12 col-md front-heading   mt-5   ">
                    <div class="welcome-heading " id="counter">


                    </div>

                    <div class="welcome-bottons-container row  col-12 d-flex  ">
                        <!-- Form Start -->

                        {{--<input type="email" class="form-control email" placeholder="name@company.com">--}}

                        @if(auth()->user())
                            <div class="  text-center col-md-6 col-sm-6 col-6   bg-dark-blue">
                                <a class="nav-link p-1 m-btn w-100"
                                   href="{{route('quiz.view')}}">Quiz
                                </a>
                            </div>
                            <div class="   text-center col-md-6 col-sm-6 col-6 bg-danger">
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
                            <div class=" col-12   bg-flame-start">
                                <a class="nav-link p-1 m-btn w-100"
                                   href="{{route('ref.view')}}">References
                                </a>
                            </div>

                    @endif

                    <!-- Form End -->
                    </div>
                </div>
            </div>

        </div>
        <div class="banner-anchor   text-white text-center hoverable ">
            <i class="fa fa-2x fa-arrow-circle-down mt-5 "></i>
        </div>
        <div class="col-12 text-center">
            All Your Information Is Safe And Will Be Used Only For App Usage
            تمامی اطلاعات شما نزد ما محفوظ است و فقط برای اپلیکیشن استفاده خواهد شد
        </div>

        <!-- Welcome thumb -->
        {{--<div class="welcome-thumb wow fadeInDown" data-wow-delay="0.5s">--}}
        {{--<img src="img/welcome-img.png" alt="">--}}
        {{--</div>--}}
    </section>
    <!-- ***** Wellcome Area End ***** -->


@endsection
@section('scripts')
    {{--<script src="js/home.js"></script>--}}
@endsection