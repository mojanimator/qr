@extends('layout')

@section('content')
    @if(Session::has('flash-error'))
        <div class="alert alert-danger alert-dismissible mt-4">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
            {{ Session::get('flash-error') }}
        </div>
    @endif
    @if(Session::has('flash-success'))
        <div class="alert alert-success alert-dismissible mt-4">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
            {{ Session::get('flash-success') }}
        </div>
    @endif
    @if(Session::has('flash-warning'))
        <div class="alert alert-warning alert-dismissible mt-4">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
            {{ Session::get('flash-warning') }}


            <div>برای ارسال مجدد <a id="retry" href="{{Route('resend.mail' ,['token'=>Session::get('token')])}}">کلیک
                    کنید</a>
            </div>
        </div>
    @endif
    <div class="loading-page hide "></div>
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card">
                    <div class=" text-white card-header bg-gradient-blue rounded p-4"> ورود</div>

                    <div class="card-body">
                        <form method="POST" action="{{ route('login') }}">
                            @csrf

                            <div class="form-group row">
                                <label for="email"
                                       class="col-md-4 col-form-label text-md-right">نام کاربری یا ایمیل</label>

                                <div class="col-md-6">
                                    <input id="login" type="text"
                                           class="form-control{{ $errors->has('username') || $errors->has('email') ? ' is-invalid' : '' }}"
                                           name="login"
                                           {{--class="form-control @error('email') is-invalid @enderror" name="email"--}}
                                           value="{{ old('username') ?: old('email') }}"
                                           {{--autocomplete="email"--}}
                                           autofocus>

                                    {{--@error('email')--}}
                                    @if ($errors->has('username') || $errors->has('email'))
                                        <span class="invalid-feedback" role="alert">
                                        {{--<strong>{{ $message }}</strong>--}}
                                            <strong>{{ $errors->first('username') ?: $errors->first('email') }}</strong>
                                    </span>
                                        {{--@enderror--}}
                                    @endif
                                </div>
                            </div>

                            <div class="form-group row">
                                <label for="password"
                                       class="col-md-4 col-form-label text-md-right">{{ __('گذرواژه') }}</label>

                                <div class="col-md-6">
                                    <input id="password" type="password"
                                           class="form-control @error('password') is-invalid @enderror" name="password"
                                           autocomplete="current-password">

                                    @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row col-12">
                                <div class="col-md-6 offset-md-4">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" name="remember"
                                               id="remember" {{ old('remember') ? 'checked' : '' }}>

                                        <label class="form-check-label" for="remember">
                                            {{ 'به خاطر بسپار' }}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group row mb-0">
                                <div class="col-md-8 offset-md-4">
                                    <button type="submit" class="btn  btn-primary col-md-9   ">
                                        {{ 'ورود'}}
                                    </button>

                                    @if (Route::has('password.request'))
                                        <a class="btn btn-link" href="{{ route('password.request') }}">
                                            {{ 'گذرواژه را فراموش کرده ام' }}
                                        </a>
                                    @endif
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>


@endsection
@section('scripts')
    <script>
        $("#retry").click(function () {
            $(".loading-page").removeClass('hide');
        });

    </script>
@endsection