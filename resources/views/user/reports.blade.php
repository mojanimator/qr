@extends('layout')
@section('title')
    گزارشات
@stop


@section('content')



    <section class=" container-fluid  mt-4   " id="app">

        @if(auth()->user())

            <reports-form user="{{auth()->user()}}"
                          reports-link="{{route('report.search',['username' =>auth()->user()->username])}}">
            </reports-form>

            <div class="row  justify-content-center">

                <div class="loading-page center-block hide "></div>
            </div>
        @else

            <div class=" no-result text-center py-4 text-danger">
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

@stop