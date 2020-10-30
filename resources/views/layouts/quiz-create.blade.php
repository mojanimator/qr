@extends('layout')

@section('content')
    <!-- Preloader Start -->
    <div id="preloader">
        <div class="colorlib-load"></div>
    </div>



    <!-- ***** Wellcome Area Start ***** -->
    <section class="welcome-area clearfix bg-indigo " id="home">
        <div class="container-fluid h-100  ">
            <div class="row  align-items-center h-100  ">

                <div class="col-12 col-md front-heading   mt-5   ">
                    <div class="welcome-heading " id="counter">


                    </div>

                    <div class="welcome-bottons-container row  col-12 d-flex  ">
                        <!-- Form Start -->

                        {{--<input type="email" class="form-control email" placeholder="name@company.com">--}}

                        @if(auth()->user())
                            <div class="  text-center col-md-6 col-sm-6 col-6 bg-dark-blue">
                                <a class="nav-link p-1 m-btn w-100"
                                   href="{{route('/')}}">Wallpapers
                                </a>
                            </div>
                            <div class="  text-center col-md-6 col-sm-6 col-6 bg-dark">
                                <a class="nav-link p-1 m-btn w-100"
                                   href="{{route('quiz.view')}}">سوالات
                                </a>
                            </div>
                            <div class="   text-center   col-12 bg-danger">
                                <form id="logout-btn" action="{{ route('logout') }}" method="POST"
                                      style="display: none;">
                                    {{ csrf_field() }}
                                </form>
                                <a class="nav-link p-1 m-btn  w-100"
                                   onclick="event.preventDefault(); document.getElementById('logout-btn').submit();"
                                   href="{{route('logout')}}">
                                    <i class="fa fa-btn  fa-sign-out-alt"></i> خروج
                                </a>

                            </div>

                    @endif

                    <!-- Form End -->
                    </div>
                </div>
            </div>

        </div>
    {{--<div class="banner-anchor   text-white text-center hoverable ">--}}
    {{--<i--}}
    {{--class="fa fa-2x fa-arrow-circle-down mt-5 "></i>--}}
    {{--</div>--}}
    <!-- Welcome thumb -->
        {{--<div class="welcome-thumb wow fadeInDown" data-wow-delay="0.5s">--}}
        {{--<img src="img/welcome-img.png" alt="">--}}
        {{--</div>--}}
    </section>
    <!-- ***** Wellcome Area End ***** -->
    @if(auth()->user())
        <section class=" clearfix    my-5">
            <quiz-uploader create-link="{{route('quiz.create')}}"
                           types-link="{{route('quiz.types')}}"
                           apps-link="{{route('quiz.apps')}}"
                           search-link="{{route('doc.search')}}">

            </quiz-uploader>


        </section>
    @endif

@endsection
@section('scripts')
    {{--<script src="js/home.js"></script>--}}
@endsection