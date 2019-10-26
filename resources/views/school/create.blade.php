@extends('layout')
@section('title')
    ساخت مدرسه جدید
@stop


@section('content')
    <section class=" container-fluid  mt-4 mx-2" id="app">

        {{--@if(auth()->user())--}}


        <school-create user="{{auth()->user()}}" schools-link="{{route('school.dropdown')}}"
                       hoozes-link="{{route('school.hoozes')}}" sitekey="{{ config('services.recaptcha.key') }}"
                       create-school-link="{{route('schools.create')}}"></school-create>

        <div class="row  justify-content-center">

            <div class="loading-page center-block hide "></div>
        </div>
        {{--@else--}}

        {{--<div class="no-result text-center py-4 text-danger">--}}
        {{--<p>--}}
        {{--<strong>--}}
        {{--لطفا ابتدا--}}
        {{--<a href="{{route('login')}}">وارد</a>--}}
        {{--شوید یا--}}
        {{--<a href="{{route('register')}}">ثبت نام</a>--}}
        {{--کنید--}}
        {{--</strong>--}}
        {{--</p>--}}
        {{--</div>--}}
        {{--@endif--}}
    </section>



@stop
@section('scripts')

@stop