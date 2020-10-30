<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="canonical" href="https://qr-image-creator.com">
    <meta name="Description" content="Create QR Images For Your Business Freely!">
    <meta name="Keywords" content="create qr, qr, create, free, free qr, free qr creator, business, logo, brand">
    <meta name="Author" content="Mojtaba Rajabi">
    <meta name="Copyright" content="Copyright (c) 2019 by qr-image-creator">
    <meta name="Copyright" content="text/html; charset=unicode">
    {{--<meta name="Robots" content="index,follow">--}}
    <meta name="Resource-Type" content="document">
    <meta name="Distribution" content="Global">
    <meta name="Design" content="moj2raj2@gmail.com">
    <meta name="Generator" content="moj2raj2@gmail.com">
    <meta name="Rating" content="General">
    <meta name="icon" content="/img/logo.png">
    <meta name="shortcut icon" content="/img/logo.png">
    <link rel="icon" type="image/png" href="/img/logo.png"/>
    <meta name="csrf-token" content="{{csrf_token()}}">
    <title>@yield('title')</title>
    <link rel="stylesheet" href="{{mix('css/app.css')}}" type="text/css">
    {{--<link rel="stylesheet" href=" {{ asset('/css/app.css') }}" type="text/css">--}}

    {{--<link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">--}}
    {{--<link href="https://fonts.googleapis.com/css?family=Lato&display=swap" rel="stylesheet">--}}
    {{--<link rel="stylesheet"--}}
    {{--href="https://fonts.googleapis.com/css?family=Tangerine:Bold">--}}

<!-- Include a polyfill for ES6 Promises (optional) for IE11 -->

    {{--<link rel="stylesheet" href="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/css/ol.css"--}}
    {{--type="text/css">--}}

</head>
<body>

{{--static navbar--}}
<nav class="navbar navbar-expand-md navbar-dark fixed-top    pt-0 " id="navbar">
    {{--<div class="m-background"></div>--}}

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
            aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav mr-auto mx-1">
            <li class="{{request()->is('/') ? 'active ':''}}nav-item text-center">
                <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
            </li>
            @if(auth()->guest())
                <li class="{{request()->is('login') ? 'active ':''}}nav-item">
                    <a class="nav-link text-center" href="{{url('login')}}">Login</a></li>

            @else
                <li class="nav-item dropdown ">
                    <a href="#" class=" nav-link dropdown-toggle" data-toggle="dropdown" role="button"
                       aria-expanded="false">
                        {{auth()->user()->username}} <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu" role="menu">


                        <li class="nav-item text-center">
                            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                {{ csrf_field() }}
                            </form>

                            <a class="nav-link"
                               onclick="event.preventDefault(); document.getElementById('logout-form').submit();"
                               href="{{route('logout')}}">
                                Logout <i class="fa   fa-sign-out-alt"></i>
                            </a>
                        </li>


                    </ul>
                </li>
            @endif

        </ul>


    </div>
    <div
            class=" bg-gradient-purple text-white small position-absolute right-0 bottom-0 px-2 mx-2 ">{{ \Carbon\Carbon::now('Asia/Tehran') }}</div>


</nav>
{{--end static navbar--}}

<section class=" container-full   " id="app">
    @if(Session::has('message'))
        <p class="alert {{ Session::get('alert-class', 'alert-info') }}">{{ Session::get('message') }}</p>
    @endif
    @yield('content')
</section>


{{--@include('layouts.footer')--}}
{{--@endif--}}
<script src="{{mix('js/app.js')}}"></script>
{{--<script src="{{asset('js/app.js')}}"></script> for host --}}

@yield('scripts')
@include('flash')
<script>

</script>
</body>
</html>