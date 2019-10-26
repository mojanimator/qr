<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\Hooze;
use App\School;
use App\User;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use App\Policies\SchoolPolicy;
use Illuminate\View\View;
use Morilog\Jalali\Jalalian;

Route::get('/', function () {
    return view('layouts.home');
})->name('/');
Route::get('/school/create', function () {
    return view('school.create');
})->name('school.create');


Auth::routes();
//Route::get('register', 'Auth\RegisterController@showRegistrationForm')->name('register')->middleware('can:register');
//Route::post('register', 'Auth\RegisterController@register')->middleware('can:register');
Route::get('/verifyemail/{token}/{from}', 'Auth\RegisterController@verify')->name('verification.mail');
Route::get('/resendemail/{token}', 'Auth\RegisterController@resend')->name('resend.mail');

Route::get('/home', 'HomeController@index')->name('home');


Route::get('/init', function () {
    // Call and Artisan command from within your application.
    Artisan::call('migrate:fresh');
    Artisan::call('db:seed');
    echo 'با موفقیت انجام شد!';
});

Route::get('register/confirm/{token}', 'Auth\RegisterController@confirmEmail');

Route::get('/panel/{username}/reports/', 'ReportController@view')->name('report.view')->middleware('can:viewAny,App\Report');
Route::post('/panel/{username}/reports/search', 'ReportController@search')->name('report.search')->middleware('can:viewAny,App\Report');


Route::get('/panel/{username}/users/', 'UserController@view')->name('user.view')->middleware('can:viewAny,App\User');
Route::post('/panel/{username}/users/create', 'UserController@create')->name('user.register')->middleware('can:createAny,App\User');
Route::post('/panel/{username}/users/edit', 'UserController@update')->name('user.edit')->middleware('can:editAny,App\User');
Route::post('/panel/{username}/users', 'UserController@search')->name('user.search');
Route::post('/panel/{username}/users/delete', 'UserController@destroy')->name('user.delete')->middleware('can:deleteAny,App\User');

Route::post('/panel/{username}/schools/search', 'SchoolController@search')->name('school.search')->middleware('can:viewAny,App\School');
Route::post('/panel/{username}/schools/dropdown', 'SchoolController@dropdown')->name('school.dropdown')->middleware('can:viewAny,App\School');
Route::post('/panel/{username}/schools/create', 'SchoolController@create')->name('schools.create')->middleware('can:createAny,App\School');
Route::get('/panel/{username}/schools', 'SchoolController@view')->name('school.view')->middleware('can:viewAny,App\School');
Route::post('/panel/{username}/delete', 'SchoolController@destroy')
    ->name('school.destroy')->middleware('can:delete,App\School');
Route::any('/panel/{username}', 'UserController@showPanel')
    ->name('user.panel')->middleware('auth');
Route::post('/panel/{username}/edit', 'SchoolController@update')
    ->name('school.edit')->middleware('can:edit,App\School');


Route::get('/panel/{username}/hoozes', 'HoozeController@view')
    ->name('hooze.view')->middleware('can:viewAny,App\Hooze');
Route::post('/panel/{username}/hoozes', 'HoozeController@search')
    ->name('hooze.search');
Route::post('/panel/{username}/hoozes/delete/h={id}', 'HoozeController@destroy')
    ->name('hooze.destroy')->middleware('can:delete,App\Hooze,id');
Route::post('/panel/{username}/hoozes/edit/h={id}', 'HoozeController@update')
    ->name('hooze.edit')->middleware('can:edit,App\Hooze,id');
Route::post('/panel/{username}/hoozes/create', 'HoozeController@create')
    ->name('hooze.create')->middleware('can:create,App\Hooze');


Route::group(array('before' => 'auth'), function () {

    Route::get('admin/shutdown', function () {
        touch(storage_path() . '/framework/down');
    });
});

Route::get('admin/wakeup', function () {
    @unlink(storage_path() . '/framework/down');
});

Route::get('groups/{group}/page/{page}', 'PostController@showGroupPosts')->name('post.group');
Route::get('groups/', 'PostController@showGroups')->name('post.groups');
Route::get('users/{username}', 'UserController@show')->name('user.show');
Route::get('post/{group}/{slug}', 'PostController@showPost')->name('post.show')->where('slug', '[\w\d\-\_]+');
Route::post('posts/latest', 'PostController@showLatestPosts')->name('post.latest');

