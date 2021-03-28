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
use App\Event;
use App\Hooze;
use App\Quiz;
use App\Report;
use App\School;
use App\Setting;
use App\User;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Policies\SchoolPolicy;
use Illuminate\Support\Facades\Storage;
use Illuminate\View\View;
use Morilog\Jalali\Jalalian;
use Spatie\Sitemap\SitemapGenerator;
use Vantoozz\ProxyScraper\Exceptions\ValidationException;
use Vantoozz\ProxyScraper\HttpClient\HttplugHttpClient;
use function Vantoozz\ProxyScraper\proxyScraper;
use Vantoozz\ProxyScraper\Validators;
use Vantoozz\ProxyScraper\Scrapers;
use Http\Adapter\Guzzle6\Client as HttpAdapter;
use Http\Message\MessageFactory\GuzzleMessageFactory as MessageFactory;
use GuzzleHttp\Client as GuzzleClient;
use Vantoozz\ProxyScraper\Exceptions\ScraperException;


Route::get('test', function (Request $request) {
//    print_r(str_starts_with('test', 'te'));
//    return Carbon::createFromFormat('Y$m$d$H$i', '2111$01$01$02$01');
//    return explode('$', '$asd');
//    return Quiz::where('is_predict', true)->distinct('app_id')->pluck('app_id');

    foreach (Quiz::where('is_predict', true)->get() as $item) {
        $item->options = explode('$', $item->options);
        $item->save();
    };

    return;
    Artisan::call('update:status');
    return;
    return base64_decode(base64_encode('$'));
    $id = 1;
    return Event::where(function ($query) use ($id) {
        $query->orWhere('app_ids', 'like', "$id$%");
        $query->orWhere('app_ids', 'like', "%$$id");
        $query->orWhere('app_ids', 'like', "%$$id$%");
        $query->orWhere('app_ids', $id);
    })->where('type', 1)->orderBy('start_time', 'ASC')->get();
    return count(array_filter([1, 2, 3, 4, 5], function ($e) {
        return $e > 2;
    }));
    return;
    $packageName = 'com.varta.psg_wallpapers';
    $pID = 'donate_coin';
    $purchaseToken = 'aa';
//                putenv('GOOGLE_APPLICATION_CREDENTIALS=/home/mydir/credentials.json');
    $client = new \Google_Client();
//                $client->useApplicationDefaultCredentials();
    $client->setAuthConfig(storage_path() . DIRECTORY_SEPARATOR . Helper::$auth_config_file);
    $client->setScopes(array('https://www.googleapis.com/auth/androidpublisher'));
    $service = new \Google_Service_AndroidPublisher($client);
    $purchase = $service->purchases_products->get($packageName, $pID, $purchaseToken);
    $products = $service->inappproducts->listInappproducts($packageName, []);
    $items = [];
    foreach ($products as $product) {
        $items[] = $product->sku;
    }
    return json_encode($items);
    return response(['status' => 'SUCCESS', 'res' => $purchase]);
    //rotation proxy

    // use curl to make the request
    $url = 'http://falcon.proxyrotator.com:51337/?apiKey=Bjcg4PKZ7W3RCHbEGtVxXzem6MpFsASN';
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
//    curl_setopt($ch, CURLOPT_PROXY, '187.33.160.252:4145');
    $response = curl_exec($ch);
    curl_close($ch);

// decode the json response
    $json = json_decode($response, true);

// create $proxy to contain the ip:port ready to use
    $proxy = $json['proxy'];
    echo $proxy;
    $instagram = new \InstagramScraper\Instagram();
    $instagram->setProxy(['port' => explode(':', $proxy)[1],
//                'tunnel' => true,
        'address' => explode(':', $proxy)[0],
        'type' => CURLPROXY_HTTP,
//                'auth' => [
//                    'user' => 'km617277',
//                    'pass' => '54778',
//                    'method' => CURLAUTH_BASIC
//                ],
    ]);
    try {
        $account = $instagram->getAccount('kevin');
        echo json_encode($account);
    } catch (\Exception $e) {
        echo '[Error] ' . $e->getMessage() . "\n";
    }
    return;

    $validator = new Validators\ValidatorPipeline;
    $validator->addStep(new Validators\Ipv4RangeValidator);
    $httpClient = new HttplugHttpClient(
        new HttpAdapter(new GuzzleClient([
            'connect_timeout' => 2,
            'timeout' => 2,
        ])),
        new MessageFactory
    );

    $compositeScraper = new Scrapers\CompositeScraper;
    $compositeScraper->handleScraperExceptionWith(function (ScraperException $e) {
        echo 'An error occurs: ' . $e->getMessage() . "\n";
    });
    $compositeScraper->addScraper(new Scrapers\FreeProxyListScraper($httpClient));
    $compositeScraper->addScraper(new Scrapers\CoolProxyScraper($httpClient));
    $compositeScraper->addScraper(new Scrapers\SocksProxyScraper($httpClient)); //socks4

    $generator = $compositeScraper->get();

    $instagram = new \InstagramScraper\Instagram();
    $i = 0;
    while ($i++ < 10) {
        try {
            $generator->next();

            $proxy = $generator->current();
//            foreach ($proxy->getMetrics() as $metric) {
//                echo $metric->getName() . ': ' . $metric->getValue() . "\n";
//            }
            $validator->validate($proxy);
            echo '[OK] ' . $proxy . "\n";
            sleep(1);

            $instagram->setProxy(['port' => explode(':', $proxy)[1],
//                'tunnel' => true,
                'address' => explode(':', $proxy)[0],
                'type' => CURLPROXY_SOCKS4,
//                'auth' => [
//                    'user' => 'km617277',
//                    'pass' => '54778',
//                    'method' => CURLAUTH_BASIC
//                ],
            ]);
            $account = $instagram->getAccount('kevin');
            echo (string)$account;
        } catch (ValidationException $e) {
            echo '[Error] ' . $e->getMessage() . ': ' . $proxy . "\n";
        } catch (\Exception $e) {
            echo '[Error] ' . $e->getMessage() . "\n";
        }
    }

//    dd(File::delete(public_path() . DIRECTORY_SEPARATOR . "fashion-120.jpg"));

//    $instagram->setUserAgent('User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0');
//    $instagram->disableProxy();
//    $instagram->saveSession();

    // For getting information about account you don't need to auth:


// Available fields
//    echo "Account info:\n";
//    echo "Id: {$account->getId()}\n";
//    echo "Username: {$account->getUsername()}\n";
//    echo "Full name: {$account->getFullName()}\n";
//    echo "Biography: {$account->getBiography()}\n";
//    echo "Profile picture url: {$account->getProfilePicUrl()}\n";
//    echo "External link: {$account->getExternalUrl()}\n";
//    echo "Number of published posts: {$account->getMediaCount()}\n";
//    echo "Number of followers: {$account->getFollowsCount()}\n";
//    echo "Number of follows: {$account->getFollowedByCount()}\n";
//    echo "Is private: {$account->isPrivate()}\n";
//    echo "Is verified: {$account->isVerified()}\n";

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
Route::get('/policy', function () {
    return view('layouts.policy');
})->name('policy');

Route::post('/doc/create', 'DocController@create')->name('doc.create');
//Route::post('/doc/search', 'DocController@search')->name('doc.search');
Route::post('/doc/groups', 'DocController@groups')->name('doc.groups');
Route::post('/doc/delete', 'DocController@delete')->name('doc.delete');


//Route::get('/storage/{doc}', 'DocController@fileStorageServe')
//    ->where(['fileName' => '.*'])->name('storage.gallery.file');
//Route::get('/storage/gallery/{file}', 'DocController@getGalleryImage')
//    ->name('storage.gallery.image');


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

Route::post('/ref/groups', function () {
    return Helper::$refGroups;
})->name('ref.groups');

Route::post('/ref/apps', function () {
    return getApps();
})->name('ref.apps');


Route::post('/ref/create', 'RefController@create')->name('ref.create');
Route::post('/ref/search', 'RefController@search')->name('ref.search');
Route::delete('/ref/delete', 'RefController@delete')->name('ref.delete');
Route::post('/ref/update', 'RefController@update')->name('ref.update');
Route::post('/ref/get/update', 'RefController@getForUpdate')->name('ref.get.for.update');


Auth::routes();

// instagram

Route::get('/ref/create', 'InstaAPIController@getRequestCodeLink')->name('ref.view.create');
Route::get('getinstagramtoken', 'InstaAPIController@getToken')->name('insta.token');


//event section

Route::get('/event', function () {

    return view('layouts.events');
})->name('event.view');

Route::get('/event/create', function () {
    return view('layouts.event-create');
})->name('event.view.create');

Route::post('/event/create', 'EventController@create')->name('event.create');
Route::post('/event/search', 'EventController@search')->name('event.search');
Route::delete('/event/delete', 'EventController@delete')->name('event.delete');
Route::post('/event/update', 'EventController@update')->name('event.update');
Route::post('/event/get/update', 'EventController@getForUpdate')->name('event.get.for.update');


Route::get('/profile', function () {
    return view('layouts.profiles');
})->name('profile.view');
Route::post('/profile/create', 'ProfileController@create')->name('profile.create');
//Route::post('/doc/search', 'DocController@search')->name('doc.search');
Route::post('/profile/groups', 'ProfileController@groups')->name('profile.groups');
Route::post('/profile/delete', 'ProfileController@delete')->name('profile.delete');

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
Route::any('vip/{type}/{group_id}/{id}', function (Request $request) {

    if ($request->type == 1)
        return response()->file(storage_path("app/public/$request->group_id/fashion-$request->id"));
})->middleware(['auth']);