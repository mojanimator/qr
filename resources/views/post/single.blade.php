@extends('layout')
@section('title',"| ")


@section('content')

    <post :post="{{$post}}" home-link="{{route('/')}}">

    </post>
@stop