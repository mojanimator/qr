@extends('layout')
@section('title')
    کاربران
@stop


@section('content')

    @if(Session::has('flash-success-edit'))
        <div class="alert alert-success alert-dismissible mt-4">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
            {{ Session::get('flash-success-edit') }}
        </div>
    @endif

    <section class=" container-fluid  mt-4   " id="app">

        @if(auth()->user())

            <users-form user="{{auth()->user()}}"
                        users-link="{{route('user.search',['username' =>auth()->user()->username])}}"
                        schools-link="{{route('school.dropdown',['username' =>auth()->user()->username])}}"
                        hoozes-link="{{route('hooze.search',['username' =>auth()->user()->username])}}"
                        sitekey="{{config('services.recaptcha.key')}}"
                        can-create="@can('createAny', ['App\User','can']){{1}}@else{{0}}@endcan"
                        can-delete="@can('deleteAny', ['App\User','can']){{1}}@else{{0}}@endcan"
                        can-edit="@can('editAny', ['App\User','can']){{1}}@else{{0}}@endcan">
            </users-form>

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