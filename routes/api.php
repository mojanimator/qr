<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('getUser', 'ApiController@getUser');
    Route::post('logout', 'ApiController@logout');

    //schools
    Route::post('schools/search', 'SchoolController@search')->name('school.search')->middleware('can:viewAny,App\School');

});
//
Route::post('login', 'ApiController@login');
Route::post('register', 'ApiController@register');

