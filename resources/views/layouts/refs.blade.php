@extends('layout')
@section('title')
    شبکه های اجتماعی
@stop
@section('content')


    <!-- ***** Wellcome Area Start ***** -->
    <section class="welcome-area clearfix bg-dark " id="home">
        <div class="container-fluid h-100  ">
            <div class="row  align-items-center h-100  ">

                <div class="col-12 col-md front-heading ">
                    <div class="welcome-heading " id="counter">


                    </div>

                    <div class="welcome-bottons-container row  col-12 d-flex  ">
                        <!-- Form Start -->

                        {{--<input type="email" class="form-control email" placeholder="name@company.com">--}}

                        @if(auth()->user())
                            <div class="  text-center col-md-6 col-sm-6 col-6 bg-dark-blue">
                                <a class="nav-link p-1 m-btn w-100"
                                   href="{{route('/')}}">صفحه اصلی
                                </a>
                            </div>
                            <div class="  text-center col-md-6 col-sm-6 col-6 bg-success">
                                <a class="nav-link p-1 m-btn w-100"
                                   href="{{route('ref.view.create')}}">شبکه جدید
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

        <!-- Welcome thumb -->
        {{--<div class="welcome-thumb wow fadeInDown" data-wow-delay="0.5s">--}}
        {{--<img src="img/welcome-img.png" alt="">--}}
        {{--</div>--}}
    </section>
    <!-- ***** Wellcome Area End ***** -->
    @if(auth()->user())

        <section class="   container-fluid   my-5">
            <refs refs-view-link="{{route('ref.view')}}"
                  refs-link="{{route('ref.search')}}"
                  edit-link="{{route('ref.update')}}"
                  get-for-edit-link="{{route('ref.get.for.update')}}"
                  delete-link="{{route('ref.delete')}}"
                  types-link="{{route('ref.types')}}"
                  apps-link="{{route('ref.apps')}}"
                  groups-link="{{route('ref.groups')}}"
                  can-create="{{auth()->user()->role=='Admin'??1}}"
                  can-delete="{{auth()->user()->role=='Admin'??1}}"
                  can-edit="{{auth()->user()->role=='Admin'??1}}"
            >

            </refs>


        </section>
    @endif

@endsection
@section('scripts')
    {{--<script src="js/home.js"></script>--}}
@endsection