<?php

use App\Product;
use App\Setting;
use App\User;
use App\Vip;
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
//date_default_timezone_set('Asia/Tehran');
Route::middleware('auth:api')->group(function () {
    Route::get('getuser', 'ApiController@getUser');
    Route::post('logout', 'ApiController@logout');
    Route::get('/quiz/getforresponding', 'QuizAPIController@getForResponding')->name('quiz.getforresponding');
    Route::get('/quiz/getresponse', 'QuizAPIController@getResponse')->name('quiz.getresponse');
    Route::post('/quiz/updatescore', 'QuizAPIController@updateScore')->name('quiz.updatescore');
    Route::get('/quiz/search', 'QuizAPIController@search')->name('quiz.search');

    Route::post('edit', 'ApiController@edit');
});
Route::get('/ref/search', 'RefAPIController@search')->name('ref.search');


Route::get('/quiz/getrecords', 'QuizAPIController@getRecords')->name('quiz.records');
Route::get('/quiz/get', 'QuizAPIController@get')->name('quiz.get');
Route::get('/quiz/statistics', 'QuizAPIController@getStatistics')->name('quiz.getstatistics');
//
Route::post('login', 'ApiController@login');
Route::post('register', 'ApiController@register');


Route::get('/profile/search', 'ProfileController@search')->name('profile.search');

Route::get('/doc/search', 'DocController@search')->name('doc.search');
Route::get('/doc/groups', 'DocController@groups')->name('doc.groups');

Route::get('/checkUpdate', function (Request $request) {
    return Setting::where('key', $request->app . '_images')->pluck('value')->first();
})->name('doc.checkUpdate');

Route::get('/getsettings', function (Request $request) {
    return [
        'event' => App\Event::where('app_id', $request->app_id)->where('start_time', '>', Carbon\Carbon::now())->orderBy('start_time', 'ASC')->first(),
        'version' => DB::table('versions')->where('name', $request->name)->first()->build,
        'bazarhide' => false, 'mykethide' => false, 'googlehide' => false, 'hide' => false,
        'top_donator' => DB::table('donators')->where('app_id', $request->app_id)->where('done', true)->orderByDesc('amount')->first(),
        'last_messages' => DB::table('donators')->where('done', true)->where('app_id', $request->app_id)->inRandomOrder()->/*orderByDesc('created_at')->*/
        pluck('desc')->take(10),
        'thumbs' => DB::table('docs')->where('group_id', $request->group_id)->inRandomOrder()->pluck('path')->take(10),
        'adv_provider' => 'notapsell',
        'native_adv_provider' => 'notapsell',
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
    $langNot = 'en';
    if ($request->app == 'perspolis')
        $like = '%esteghlal%';
    else if ($request->app == 'esteghlal')
        $like = '%perspolis%';
    else {
        $like = '';
        $langNot = 'fa';
    }
    return json_encode(DB::table('advs')->where(function ($query) use ($langNot) {
        $query->where('lang', '!=', $langNot)
            ->orWhereNull('lang');
    })->where('name', 'NOT LIKE', $like)->where('disabled', '!=', true)->inRandomOrder()->first());

})->name('doc.get.advs');


Route::post('/bot/getupdates', 'BotController@getupdates');
Route::post('/bot/sendmessage', 'BotController@sendmessage');
Route::post('/bot/getupdates_en', 'BotControllerEn@getupdates');
Route::post('/bot/sendmessage_en', 'BotControllerEn@sendmessage');
Route::get('/bot/getme', 'BotController@myInfo');


Route::any('/donate', 'ProductController@donate');
Route::any('/charge', 'ProductController@charge');
Route::get('/getinternetproducts', 'ProductController@getInternetProducts');
Route::post('/buyproduct', 'ProductController@buyProduct');
Route::get('/gettopdonators', 'ProductController@getTopDonators');
Route::get('/getiap', 'ProductController@getIAP');
Route::get('/getappevents', 'ProductController@getAppEvents');

Route::post('vip/buy', 'VipController@buy');
Route::get('vip/{address}', 'VipController@get');