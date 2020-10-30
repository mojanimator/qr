<?php

use App\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
    Route::get('getuser', 'ApiController@getUser');
    Route::post('logout', 'ApiController@logout');
    Route::get('/quiz/getforresponding', 'QuizAPIController@getForResponding')->name('quiz.getforresponding');
    Route::get('/quiz/getresponse', 'QuizAPIController@getResponse')->name('quiz.getresponse');
    Route::post('/quiz/updatescore', 'QuizAPIController@updateScore')->name('quiz.updatescore');
    Route::get('/quiz/search', 'QuizAPIController@search')->name('quiz.search');

});
Route::get('/quiz/get', 'QuizAPIController@get')->name('quiz.get');
Route::get('/quiz/statistics', 'QuizAPIController@getStatistics')->name('quiz.getstatistics');
//
Route::post('login', 'ApiController@login');
//Route::post('register', 'ApiController@register');

Route::get('/doc/search', 'DocController@search')->name('doc.search');
Route::get('/doc/groups', 'DocController@groups')->name('doc.groups');

Route::get('/checkUpdate', function (Request $request) {
    return Setting::where('key', $request->app . '_images')->pluck('value')->first();
})->name('doc.checkUpdate');

Route::get('/getsettings', function (Request $request) {
    return ['version' => DB::table('versions')->where('name', $request->name)->first()->build,
        'adv_provider' => 'tapsell',
        'see_video_score' => Helper::$see_video_score,
        'show_word_score' => Helper::$show_word_score,
        'remove_block_score' => Helper::$remove_block_score,
        'remove_option_score' => Helper::$remove_option_score,
    ];
})->name('doc.get.settings');
Route::get('/getadv', function (Request $request) {
    if ($request->app == 'perspolis')
        $like = '%esteghlal%';
    else if ($request->app == 'esteghlal')
        $like = '%perspolis%';
    else
        $like = '';
    return json_encode(DB::table('advs')->where('name', 'NOT LIKE', $like)->inRandomOrder()->first());

})->name('doc.get.advs');


Route::post('/bot/getupdates', 'BotController@getupdates');
Route::post('/bot/sendmessage', 'BotController@sendmessage');
Route::get('/bot/getme', 'BotController@myInfo');