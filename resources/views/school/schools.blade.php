@extends('layout')
@section('title')
    مدارس
@stop


@section('content')
    <section class=" container-fluid  mt-4   ">

        @if(auth()->user())
            <search-box ref="'search_box'"
                        schools-link="{{route('school.search',['username'=>auth()->user()->username])}}"
                        hoozes-link="{{route('hooze.search',['username'=>auth()->user()->username])}}"></search-box>



            <school-cards user="{{auth()->user()}} "
                          create-school-link="{{route('schools.create',['username'=>auth()->user()->username])}}"
                          panel-link="{{route('user.panel',['username'=>auth()->user()->username])}}"
                          schools-link="{{route('school.dropdown',['username'=>auth()->user()->username])}}"
                          hoozes-link="{{route('hooze.search',['username'=>auth()->user()->username])}}"
                          sitekey="{{ config('services.recaptcha.key') }}"

                          can-create="@can('createAny', ['App\School','can']){{1}}@else{{0}}@endcan"
                          can-delete="@can('deleteAny', ['App\School','can']){{1}}@else{{0}}@endcan"
                          can-edit="@can('editAny', ['App\School','can']){{1}}@else{{0}}@endcan">

            </school-cards>

            <div class="row  justify-content-center">
                <div class="no-result text-center py-4 text-danger  hide">نتیــجه ای یافت نشد</div>
                <div class="loading-page center-block  "></div>
            </div>

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