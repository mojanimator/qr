<?php

use App\Product;
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
Route::get('/ref/search', 'RefAPIController@search')->name('ref.search');


Route::get('/quiz/getrecords', 'QuizAPIController@getRecords')->name('quiz.records');
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
        'hide' => false, 'mykethide' => false,
        'adv_provider' => 'notapsell',
        'see_video_score' => Helper::$see_video_score,
        'show_word_score' => Helper::$show_word_score,
        'remove_block_score' => Helper::$remove_block_score,
        'remove_option_score' => Helper::$remove_option_score,
        'ref_types' => Helper::$refTypes,
        'ref_groups' => Helper::$refGroups,
        'donate_link' => Helper::$donateLink,
        'charge_link' => Helper::$chargeLink,
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


Route::any('/donate', function (Request $request) {
    $id = auth()->user() ? auth()->user()->id : null;
    Product::create(['user_id' => $id, 'type' => 'donate', 'info' => $request]);
    foreach (Helper::$logs as $log)
        sendMessage($log, '✅ یک دریافتی به حساب شما انجام شد' . "\n" . json_encode($request), null, null, null);

});

Route::any('/charge', function (Request $request) {

    $info = base64_decode(urldecode($request->data));
    foreach (Helper::$logs as $log)
        sendMessage($log, '✅ یک شارژ خریداری شد' . "\n" . $info, null, null, null);

    redirect("https://vartastudio.ir/charge/info?data=" . $request->data);
});