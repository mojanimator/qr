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

                {{-----------------------carousel---------------------------}}
                {{--<div id="carouselExampleIndicators" class="carousel slide w-100 position-absolute top-0"--}}
                {{--data-ride="carousel"--}}
                {{--data-interval="5000">--}}
                {{--<ol class="carousel-indicators">--}}
                {{--<li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>--}}
                {{--<li data-target="#carouselExampleIndicators" data-slide-to="1"></li>--}}
                {{--<li data-target="#carouselExampleIndicators" data-slide-to="2"></li>--}}
                {{--</ol>--}}
                {{--<div class="carousel-inner">--}}
                {{--<div class="carousel-item active">--}}
                {{--<img class="d-block w-100" src="/img/ashayer_bg.png" alt="">--}}
                {{--</div>--}}
                {{--<div class="carousel-item">--}}
                {{--<img class="d-block w-100" src="/img/ashayer_bg2.png" alt="">--}}
                {{--</div>--}}
                {{--<div class="carousel-item">--}}
                {{--<img class="d-block w-100" src="/img/ashayer_bg3.png" alt="">--}}
                {{--</div>--}}
                {{--</div>--}}
                {{--<a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">--}}
                {{--<span class="carousel-control-next-icon" aria-hidden="true"></span>--}}
                {{--<span class="sr-only">Previous</span>--}}
                {{--</a>--}}
                {{--<a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">--}}
                {{--<span class="carousel-control-prev-icon" aria-hidden="true"></span>--}}
                {{--<span class="sr-only">Next</span>--}}
                {{--</a>--}}
                {{--</div>--}}
                {{-----------------------carousel---------------------------}}


                {{--<img src="/img/ashayer_bg.png" alt="">--}}
                <div class="col-12 col-md front-heading position-absolute top-0">
                    <div class="welcome-heading">
                        <h2 class="text-white mt-5 text-center">Unnamed !</h2>
                        <p class="text-white mt-5 text-center">Be Simple!</p>
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
            <div class="banner-anchor  bg-dark-blue text-white text-center hoverable ">
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

    <!-- ***** Awesome Features Start ***** -->
    <section class="features-area  bg-white   clearfix mt-5" id="features">
        <div class="container  ">
            <div class="row">
                <div class="col-12">
                    <!-- Heading Text -->
                    <div class="section-heading text-center">
                        <h2 class="text-primary">Why Besteps ?</h2>

                    </div>
                    <div class="row  text-primary text-center">
                        <div class="col-lg-4 col-sm-6 col-sm-6 p-3">
                            <div class="m-features">
                                <div class="m-features-header "><span>Simple</span></div>
                                <div class="card-body">
                                    <img class="w-100" src="/img/features-map.png" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 col-sm-6 p-3">
                            <div class="m-features">
                                <div class="m-features-header "><span>Functional</span></div>
                                <div class="card-body">
                                    <img class="w-100" src="/img/features-route.png" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-sm-6 col-sm-6 offset-lg-0 offset-md-3 offset-sm-3 p-3">
                            <div class="m-features">
                                <div class="m-features-header "><span>Only Your Response!</span></div>
                                <div class="card-body">
                                    <img class="w-100" src="/img/features-access.png" alt="">
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


        </div>
    </section>
    <!-- ***** Awesome Features End ***** -->

    <section class="madrese-num" id="numbers">
        <div id="counter" class=" container ">

            <!-- Heading Text -->
            <div class="section-heading text-center ">
                <h2 class="text-primary"> Until Now</h2>
            </div>
            <div class="row   text-primary text-center">
                <div class="col-lg-4 col-sm-6 col-sm-6 p-3">
                    <div class="m-features   ">
                        <div class="m-features-header  "><span>Steps</span></div>
                        <div class="card-body  d-flex justify-content-center  ">
                            <div class="counter-value d-flex flex-column justify-content-center align-items-center"
                                 data-count="{{\App\Post::count()}}">0
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-6 p-3">
                    <div class="m-features">
                        <div class="m-features-header "><span>Categories</span></div>
                        <div class="card-body   d-flex justify-content-center  ">
                            <div class="counter-value d-flex flex-column justify-content-center align-items-center"
                                 data-count="{{\App\Group::count()}}">0
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-sm-6 col-sm-6 offset-lg-0 offset-md-3 offset-sm-3 p-3">
                    <div class="m-features">
                        <div class="m-features-header "><span>Users</span></div>
                        <div class="card-body   d-flex justify-content-center  ">
                            <div class="counter-value d-flex flex-column justify-content-center align-items-center"
                                 data-count="{{\App\User::count()}}"> 0

                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </section>



@endsection
@section('scripts')
    <script src="js/home.js"></script>
@endsection