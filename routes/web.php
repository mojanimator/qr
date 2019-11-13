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
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Policies\SchoolPolicy;
use Illuminate\View\View;
use Morilog\Jalali\Jalalian;
use Spatie\Sitemap\SitemapGenerator;

Route::get('sitemap', function (Request $request) {
    if (User::where('username', $request->username)->exists()) {
        SitemapGenerator::create('https://qr-image-creator.com')->writeToFile('sitemap.xml');
        return 'sitemap created !';
    } else {
        echo 'sorry !';
    }
});/*->middleware('auth')*/


Route::get('/', function () {
    Setting::where('key', 'visits')->increment('value', 1);
    return view('layouts.home');
})->name('/');
Route::get('/contact', function () {
    return view('layouts.contact');
})->name('contact');
Route::post('/comment', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'body' => 'required|max:255',
//            'for' => 'sometimes|string|in:dropdown',
    ]);
    Comment::create([
        'email' => $request->email,
        'body' => $request->body,
        'ip_address' => $request->ip(),
        'user_agent' => $request->header('user-agent'),

    ]);
    return back()->with('comment.success', 'Thank You !');

})->name('comment');
Route::post('/qrcreated', function (Request $request) {

    Setting::where('key', 'created_qr')->increment('value', 1);
    return null;

})->name('qr.created');


Auth::routes();
//Route::get('register', 'Auth\RegisterController@showRegistrationForm')->name('register')->middleware('can:register');
//Route::post('register', 'Auth\RegisterController@register')->middleware('can:register');
Route::get('/verifyemail/{token}/{from}', 'Auth\RegisterController@verify')->name('verification.mail');
Route::get('/resendemail/{token}', 'Auth\RegisterController@resend')->name('resend.mail');


Route::get('/init', function (Request $request) {
    if (User::where('username', $request->username)->exists()) {
        // Call and Artisan command from within your application.
        Artisan::call('migrate:fresh');
        Artisan::call('db:seed');
        echo 'successful !';
    } else {
        echo 'sorry !';
    }
});


Route::group(array('before' => 'auth'), function () {

    Route::get('admin/shutdown', function (Request $request) {
        if (User::where('username', $request->username)->exists()) {
            touch(storage_path() . '/framework/down');
        } else {
            echo 'sorry !';
        }
    });

});

Route::get('admin/wakeup', function (Request $request) {
    if (User::where('username', $request->username)->exists()) {
        @unlink(storage_path() . '/framework/down');
    } else {
        echo 'sorry !';
    }
});


//Route::prefix('panel/{username}')->middleware('auth')->group(function () {
//
//});
