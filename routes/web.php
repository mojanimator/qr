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

use App\Comment;
use App\Hooze;
use App\Report;
use App\School;
use App\Setting;
use App\User;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Policies\SchoolPolicy;
use Illuminate\Support\Facades\Storage;
use Illuminate\View\View;
use Morilog\Jalali\Jalalian;
use Spatie\Sitemap\SitemapGenerator;


Route::get('test', function (Request $request) {

    dd(File::delete(public_path() . DIRECTORY_SEPARATOR . "fashion-120.jpg"));
//    return public_path();
});
/*->middleware('auth')*/
Route::get('sitemap', function (Request $request) {
    if (User::where('username', $request->username)->exists()) {
        SitemapGenerator::create('https://qr-image-creator.com')->writeToFile('sitemap.xml');
        return 'sitemap created !';
    } else {
        echo 'sorry !';
    }
});/*->middleware('auth')*/


Route::get('/', function () {
//    dd(phpinfo());
//    Setting::where('key', 'visits')->increment('value', 1);
    return view('layouts.home');
})->name('/');

Route::post('/doc/create', 'DocController@create')->name('doc.create');
//Route::post('/doc/search', 'DocController@search')->name('doc.search');
Route::post('/doc/groups', 'DocController@groups')->name('doc.groups');
Route::post('/doc/delete', 'DocController@delete')->name('doc.delete');


Route::get('/storage/{doc}', 'DocController@fileStorageServe')
    ->where(['fileName' => '.*'])->name('storage.gallery.file');
Route::get('/storage/gallery/{file}', 'DocController@getGalleryImage')
    ->name('storage.gallery.image');


// quiz section
Route::get('/quiz', function () {

    return view('layouts.quizzes');
})->name('quiz.view');

Route::post('/quiz/types', function () {
    return getGameTypes();
})->name('quiz.types');

Route::post('/quiz/apps', function () {
    return getApps();
})->name('quiz.apps');

Route::get('/quiz/create', function () {
    return view('layouts.quiz-create');
})->name('quiz.view.create');

Route::post('/quiz/create', 'QuizController@create')->name('quiz.create');
Route::post('/quiz/search', 'QuizController@search')->name('quiz.search');
Route::delete('/quiz/delete', 'QuizController@delete')->name('quiz.delete');
Route::post('/quiz/update', 'QuizController@update')->name('quiz.update');
Route::post('/quiz/get/update', 'QuizController@getForUpdate')->name('quiz.get.for.update');

// ref section
Route::get('/ref', function () {

    return view('layouts.refs');
})->name('ref.view');

Route::post('/ref/types', function () {
    return Helper::$refTypes;
})->name('ref.types');

Route::post('/ref/apps', function () {
    return getApps();
})->name('ref.apps');

Route::get('/ref/create', function () {
    return view('layouts.ref-create');
})->name('ref.view.create');

Route::post('/ref/create', 'RefController@create')->name('ref.create');
Route::post('/ref/search', 'RefController@search')->name('ref.search');
Route::delete('/ref/delete', 'RefController@delete')->name('ref.delete');
Route::post('/ref/update', 'RefController@update')->name('ref.update');
Route::post('/ref/get/update', 'RefController@getForUpdate')->name('ref.get.for.update');


Auth::routes();
////Route::get('register', 'Auth\RegisterController@showRegistrationForm')->name('register')->middleware('can:register');
////Route::post('register', 'Auth\RegisterController@register')->middleware('can:register');
////Route::get('/verifyemail/{token}/{from}', 'Auth\RegisterController@verify')->name('verification.mail');
////Route::get('/resendemail/{token}', 'Auth\RegisterController@resend')->name('resend.mail');
//
//
//Route::get('/init', function (Request $request) {
//    if (User::where('username', $request->username)->exists()) {
//        // Call and Artisan command from within your application.
//        Artisan::call('migrate:fresh');
//        Artisan::call('db:seed');
//        echo 'successful !';
//    } else {
//        echo 'sorry !';
//    }
//});
//
//
//Route::group(array('before' => 'auth'), function () {
//
//    Route::get('admin/shutdown', function (Request $request) {
//        if (User::where('username', $request->username)->exists()) {
//            touch(storage_path() . '/framework/down');
//        } else {
//            echo 'sorry !';
//        }
//    });
//
//});
//
//Route::get('admin/wakeup', function (Request $request) {
//    if (User::where('username', $request->username)->exists()) {
//        @unlink(storage_path() . '/framework/down');
//    } else {
//        echo 'sorry !';
//    }
//});


//Route::prefix('panel/{username}')->middleware('auth')->group(function () {
//
//});
