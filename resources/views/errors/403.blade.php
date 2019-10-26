@extends('layout')
@section('title')
    خطای دسترسی
@stop

@section('content')


    <div class="alert alert-danger mt-5 m-4">
        <strong>خطای دسترسی!</strong> <br>
        {{ $exception->getMessage() }} <strong><a
                    href="@if(auth()->user()){{route('user.panel',['username'=>auth()->user()->username])}}
                    @else{{route('login')}}@endif"
                    class="text-dark-red">
                بازگشت <i class="fa fa-backward text-dark-red"></i></a></strong>
    </div>
@stop