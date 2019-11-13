@extends('layout')
@section('title')
    پنل کاربری  ({{auth()->user()->username}})
@stop


@section('content')

    <section class=" container-fluid  mt-4  " id="app">

        @if(auth()->user())

            <user-panel :user="{{auth()->user()}}" home-link="{{route('/')}}"
                        panel-link="{{route('user.panel',['username' =>auth()->user()->username])}}">

            </user-panel>










        @else

            <div class="no-result text-center py-4 text-danger">
                <p>
                    <strong>
                        لطفا ابتدا
                        <a href="{{route('login')}}">وارد</a>
                        شوید یا
                        <a href="{{route('register')}}">ثبت نام</a>
                        کنید
                    </strong>
                </p>
            </div>
        @endif
    </section>


@stop
@section('scripts')

    {{--<script>  let map = new ol.Map({--}}
    {{--target: 'map',--}}
    {{--layers: [--}}
    {{--new ol.layer.Tile({--}}
    {{--source: new ol.source.OSM()--}}
    {{--})--}}
    {{--],--}}
    {{--view: new ol.View({--}}
    {{--center: ol.proj.fromLonLat([37.41, 8.82]),--}}
    {{--zoom: 4--}}
    {{--})--}}
    {{--});</script>--}}
@stop