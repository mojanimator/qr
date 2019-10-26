@extends('layout')
@section('title',count($group)>1 ? $group[count($group)-1]:$group[0])


@section('content')

    <div class="mt-5 row px-4">

        @foreach(  $group  as $name)
            <span>    <a
                        href="{{route('post.group',['group'=>$name,'page'=>1])}}">{{$name}}
                    </a> > </span>
        @endforeach

    </div>

    <div class="mt-5 row px-4">
        <pagination class="col-12   "></pagination>

        <post-list :from="'group'" :group-tree="{{json_encode($group)}}" :data="{{$posts}}"
                   home-link="{{route('/')}}">

        </post-list>

    </div>
    <pagination class="col-12   "></pagination>
@stop