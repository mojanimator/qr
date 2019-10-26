@extends('layout')
@section('title')
    مدیریت حوزه ها
@stop


@section('content')
    <section class=" container-fluid  mt-4   " id="app">

        @if(auth()->user())


            <hoozes-form
                    hoozes-link="{{route('hooze.search',['username' =>auth()->user()->username])}}"
                    can-create="@can('createAny', 'App\Hooze'){{1}}@else{{0}}@endcan"
                    can-delete="@can('deleteAny', 'App\Hooze'){{1}}@else{{0}}@endcan"
                    can-edit="@can('editAny', 'App\Hooze'){{1}}@else{{0}}@endcan"
                    roles="{{auth()->user()->role()->first()}}"
                    sitekey="{{ config('services.recaptcha.key') }}">
            </hoozes-form>

            <div class="row  justify-content-center">

                <div class="loading-page center-block hide "></div>
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