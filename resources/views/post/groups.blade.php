@extends('layout')
@section('title',"groups")


@section('content')

    <div class="mt-5 row">

        <groups class="col-md-8   " :groups="{{$groups}}">

        </groups>

        <side-bar class="col-md-4 " latest-posts-link="{{route('post.latest')}}"
                  home-link="{{route('/')}}">

        </side-bar>
    </div>
@stop