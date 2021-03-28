<?php

namespace App\Http\Controllers;

use App\Event;
use App\Product;
use App\User;
use Carbon\Carbon;
use Google_Client;
use Google_Service_AndroidPublisher;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ProductController extends Controller
{
    public function __construct()
    {
        error_reporting(1);
        set_time_limit(-1);
        header("HTTP/1.0 200 OK");
//        date_default_timezone_set('Asia/Tehran');
    }

    public function getAppEvents(Request $request)
    {
        return Event::where('app_id', $request->app_id)->orderBy('start_time')->get();
    }

    public function buyProduct(Request $request)
    {
        $type = $request->type;
        $phone = $request->phone;
        $productId = $request->product_id;
        $amount = $request->amount;
        $name = $request->name;
        $desc = $request->desc;
        $app_id = $request->app_id;

        if (starts_with($phone, '090') || starts_with($phone, '093')) $operator = 'MTN';
        elseif (starts_with($phone, '0990') || starts_with($phone, '091')) $operator = 'MCI';
        elseif (starts_with($phone, '0922') || starts_with($phone, '0921')) $operator = 'RTL';
        elseif (starts_with($phone, '094')) $operator = 'WiMax';
        else   $operator = '';

        switch ($type) {
            case 'CHARGE':

                $http = new  \GuzzleHttp\Client();

                $response = $http->post(
                    Helper::$directChargeLink,
                    array(
                        'form_params' => array(
                            'webserviceId' => env('CHARGE_RESELLER'),
                            'scriptVersion' => 'Script',
                            'redirectToPage' => 'True',
                            'redirectUrl' => 'https://qr-image-creator.com/wallpapers/api/charge',
                            'firstOutputType' => 'json',
                            'secondOutputType' => 'get',
                            'type' => $operator,
                            'amount' => $amount,
                            'cellphone' => $phone,
                        )
                    ));
                $response = json_decode($response->getBody());

                if ($response->status != 'Success') {
                    Helper::sendMessage(Helper::$logs[0], $response->errorMessage, null, null, null);
                    return response(['status' => 'ERROR', 'res' => $response->errorMessage]);
                } else {
                    $url = $response->paymentInfo->url;
                    return response(['status' => 'SUCCESS', 'res' => $url]);
                }
                break;
            case 'NET':

                $http = new  \GuzzleHttp\Client();

                $response = $http->post(
                    Helper::$directInternetLink,
                    array(
                        'form_params' => array(
                            'webserviceId' => env('CHARGE_RESELLER'),
                            'scriptVersion' => 'Script',
                            'redirectToPage' => 'True',
                            'redirectUrl' => 'https://qr-image-creator.com/wallpapers/api/charge',
                            'firstOutputType' => 'json',
                            'secondOutputType' => 'get',
                            'packageId' => $productId,
                            'cellphone' => $phone,
                        )
                    ));
                $response = json_decode($response->getBody());

                if ($response->status != 'Success') {
                    Helper::sendMessage(Helper::$logs[0], $response->errorMessage, null, null, null);
                    return response(['status' => 'ERROR', 'res' => $response->errorMessage]);
                } else {
                    $url = $response->paymentInfo->url;
                    return response(['status' => 'SUCCESS', 'res' => $url]);

                }
                break;
            case  'DONATE':

                if (!isset($amount) || $amount <= 1000)
                    return response(['status' => 'ERROR', 'res' => "لطفا مبلغ بالاتر از 2000 ریال وارد نمایید"]);

                if (!isset($name) || strlen($name) > 20)
                    return response(['status' => 'ERROR', 'res' => "طول نام کوچکتر از 20 حرف باشد"]);

                if (!isset($desc) || strlen($desc) > 200)
                    return response(['status' => 'ERROR', 'res' => "توضیحات کوچکتر از 250 کلمه باشد"]);

                $http = new  \GuzzleHttp\Client(['http_errors' => false]);
                $order_id = time();
                $response = $http->post(
                    Helper::$idPayDonateServiceLink,
                    array(

                        'headers' => array(
                            'X-API-KEY' => env('IDPAY_TOKEN'),
                            'Content-Type' => 'application/json',

                        ),
                        \GuzzleHttp\RequestOptions::JSON => array(
                            'order_id' => $order_id,
                            'amount' => $amount,
                            'callback' => "https://qr-image-creator.com/wallpapers/api/donate",
                            'name' => $name,
                            'phone' => $phone,
                            'desc' => $desc,


                        )
                    ));
                $id = auth()->user() ? auth()->user()->id : null;

                $data = json_decode($response->getBody());

                if ($response->getStatusCode() != 201) {
                    if (isset($data->error_message)) {
                        Helper::sendMessage(Helper::$logs[0], $data->error_message, null, null, null);
                        return response(['status' => 'ERROR', 'res' => $data->error_message]);
                    } else {
                        Helper::sendMessage(Helper::$logs[0], json_encode($response->getBody()), null, null, null);
                        return response(['status' => 'ERROR', 'res' => json_encode($response->getBody())]);
                    }
                } else {
                    Product::create(['order_id' => $order_id, 'phone' => $phone, 'name' => $name,
                        'amount' => $amount, 'user_id' => $id,
                        'pay_id' => $data->id]);
                    DB::table('donators')->insert(['name' => $name, 'amount' => $amount,
                        'desc' => trim(preg_replace('/\s+/', ' ', $desc)), 'app_id' => $app_id, 'pay_id' => $data->id, 'order_id' => $order_id,]);

                    foreach (Helper::$logs as $log)
                        Helper::sendMessage($log, " 🎴 یک کامنت در اپ $app_id" . "\n" . "$amount\n$name\n$desc", null, null, null, false);
                    return response(['status' => 'SUCCESS', 'res' => $data->link]);
                }
                break;
            case  'IAP_DONATE_STAR':
                $user = Auth::guard('api')->user();
                $id = $user ? $user->id : null;

                if ($id == null)
                    return response(['status' => 'ERROR', 'res' => ($app_id != 1 && $app_id != 2) ? "Please Login (From Main Page) First" : "ابتدا از صفحه اصلی وارد شوید یا ثبت نام کنید"]);

                if ($amount < 20)
                    return response(['status' => 'ERROR', 'res' => ($app_id != 1 && $app_id != 2) ? "The Minimum Stars To Show Your Message In App Is 20" : "حداقل ۲۰ ستاره برای نمایش پیام شما در برنامه نیاز است."]);

                if ($user->score < $amount)
                    return response(['status' => 'ERROR', 'res' => ($app_id != 1 && $app_id != 2) ? "You Have Not $amount Stars!\nYour Current Stars is " . $user->score : "شما $amount ستاره ندارید. تعداد ستاره شما $user->score است\nمی توانید از فروشگاه تهیه کنید."]);

                if (!isset($name) || strlen($name) > 20)
                    return response(['status' => 'ERROR', 'res' => ($app_id != 1 && $app_id != 2) ? "Name Must Have Below 20 Length" : "حداکثر طول نام 20 کلمه است"]);

                if (!isset($desc) || strlen($desc) > 200)
                    return response(['status' => 'ERROR', 'res' => ($app_id != 1 && $app_id != 2) ? "Message Must Have Below 200 Length" : "حد اکثر طول پیام 200 کلمه است"]);


                $donate = DB::table('donators')->insert(['name' => $name, 'amount' => $amount,
                    'desc' => $desc, 'app_id' => $app_id, 'pay_id' => null, 'order_id' => Hash::make($name), 'done' => true]);

                $user->score = $user->score - $amount;
                $user->save();

                $u = $user->username;
                $tu = $user->telegram_username;

                foreach (Helper::$logs as $log)
                    Helper::sendMessage($log, "✅ دونیت از اپ $app_id تعداد $amount ستاره\n نام کاربری $u \n تلگرام $tu" . "\n" . "$name\n$desc", null, null, null, false);
                return response(['status' => 'SUCCESS', 'res' => "THANKS"]);

                break;
            case  'IAP_DONATE_FINISH':
                $order_id = $request->order_id;
                $pay_token = $request->pay_token;
                $pay_info = $request->pay_info;
                $p = Product::where('order_id', $order_id)->where('pay_id', null)->first();
                if (!$p)
                    return response(['status' => 'ERROR', 'res' => 'NOT_FOUND']);
                $p->info = $pay_info;
                $p->pay_id = $pay_token;
                $p->save();
                DB::table('donators')->where('order_id', $order_id)->update(['pay_id' => $pay_token, 'done' => true,]);

                foreach (Helper::$logs as $log)
                    Helper::sendMessage($log, '✅ پرداخت از گوگل' . "\n" . $pay_info, null, null, null);
                return response(['status' => 'SUCCESS', 'res' => 'DONE']);
                break;

            case  'VERIFY_SUB_PURCHASE':

                $packageName = $request->package_name;
                $sID = $request->product_id;
                $purchaseToken = $request->purchase_token;
                $client = new \Google_Client();
//                $google_client->setApplicationName($package_name);
//                $google_client->setClientId(GOOGLE_CLIENT_ID);
                $client->setAuthConfig(storage_path() . DIRECTORY_SEPARATOR . Helper::$auth_config_file);
                $client->setScopes(array('https://www.googleapis.com/auth/androidpublisher'));
                $androidPublishService = new \Google_Service_AndroidPublisher($client);
                $result = $androidPublishService->purchases_subscriptions->get(
                    $packageName,
                    $sID,
                    $purchaseToken
                );

                $current_time = time();
                $valid_time = $result['expiryTimeMillis'] / 1000;
                if ($current_time < $valid_time) {
                    return response(['status' => 'SUCCESS', 'res' => $valid_time]);
                } elseif ($current_time >= $valid_time) {
                    return response(['status' => 'ERROR', 'res' => 'EXPIRED']);

                }
                return response(['status' => 'ERROR', 'res' => $result]);

                break;
            case 'VERIFY_PRODUCT_PURCHASE':
                try {
                    $packageName = $request->package_name;
                    $pID = $request->product_id;
                    $purchaseToken = $request->purchase_token;
//                putenv('GOOGLE_APPLICATION_CREDENTIALS=/home/mydir/credentials.json');
                    $client = new \Google_Client();
//                $client->useApplicationDefaultCredentials();
                    $client->setAuthConfig(storage_path() . DIRECTORY_SEPARATOR . Helper::$auth_config_file);
                    $client->setScopes(array('https://www.googleapis.com/auth/androidpublisher'));
                    $service = new \Google_Service_AndroidPublisher($client);
                    $purchase = $service->purchases_products->get($packageName, $pID, $purchaseToken);
                    $service->inappproducts();
                    return response(['status' => 'SUCCESS', 'res' => $purchase]);
                } catch (\Exception $e) {
                    return response(['status' => 'ERROR', 'res' => $e->getMessage()]);

                }

                break;
            case 'PURCHASE_SAVE':
                if (Product::where('pay_id', $request->pay_id)->exists())
                    return response(['status' => 'ERROR', 'res' => 'EXISTS']);
                $product = Product::create([
                    'pay_id' => $request->pay_id,
                    'order_id' => $request->order_id,
                    'step' => null,
                    'phone' => null,
                    'info' => $request->info,
                    'type' => $request->product_id,
                    'amount' => $request->amount,
                    'user_id' => $request->user_id,
                    'telegram_id' => $request->telegram_id,
                    'name' => $request->name,
                ]);

                foreach (Helper::$logs as $log)
                    Helper::sendMessage($log, '✅ خرید محصول از گوگل' . " 🎴  $request->product_id  🎴 " . "\n" . $request->info, null, null, null);
                return response(['status' => 'SUCCESS', 'res' => 'CREATED']);
                break;

            case  'BUY_IRAN':
                $user = Auth::guard('api')->user();
                $id = $user ? $user->id : null;

                if ($id == null)
                    return response(['status' => 'ERROR', 'res' => "ابتدا از صفحه اصلی وارد شوید یا ثبت نام کنید"]);


                if ($productId == '1_month_unlock' && Product::where('user_id', $id)
                        ->where('type', '1_month_unlock')
                        ->where('info', '!=', null)->where('created_at', '>', Carbon::now())
                        ->exists())
                    return response(['status' => 'ERROR', 'res' => "در حال حاضر شما اشتراک دارید"]);

                $http = new  \GuzzleHttp\Client(['http_errors' => false]);
                $order_id = base64_encode("$id\$$productId\$" . time());
                $response = $http->post(
                    Helper::$idPayDonateServiceLink,
                    array(

                        'headers' => array(
                            'X-API-KEY' => env('IDPAY_TOKEN'),
                            'Content-Type' => 'application/json',

                        ),
                        \GuzzleHttp\RequestOptions::JSON => array(
                            'order_id' => $order_id,
                            'amount' => $amount * 10,
                            'callback' => "https://qr-image-creator.com/wallpapers/api/donate",
                            'name' => $id,
                            'phone' => null,
                            'desc' => " خرید $productId از اپلیکیشن $app_id",


                        )
                    ));


                $data = json_decode($response->getBody());

                if ($response->getStatusCode() != 201) {
                    if (isset($data->error_message)) {
                        Helper::sendMessage(Helper::$logs[0], $data->error_message, null, null, null);
                        return response(['status' => 'ERROR', 'res' => $data->error_message]);
                    } else {
                        Helper::sendMessage(Helper::$logs[0], json_encode($response->getBody()), null, null, null);
                        return response(['status' => 'ERROR', 'res' => json_encode($response->getBody())]);
                    }
                } else {
                    Product::create(['order_id' => $order_id, 'phone' => $phone, 'name' => $name,
                        'amount' => $amount, 'user_id' => $id,
                        'pay_id' => $data->id, 'telegram_id' => $user->telegram_id, 'type' => $productId]);

                    return response(['status' => 'SUCCESS', 'res' => $data->link]);
                }
                break;
            default:
                return null;
        }
    }

    public function getInternetProducts()
    {

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, Helper::$chargeProductsLink);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        $response = json_decode(curl_exec($ch));
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($httpcode != 200) {
            return 'SERVER_ERROR';
        }
        return json_encode($response->products->internetPackage);

    }

    public function getTopDonators(Request $request)
    {

        return DB::table('donators')->where('app_id', $request->app_id)->where('done', true)->orderByDesc('amount')->take(10)->get();

    }

    public function donate(Request $request)
    {
        $http = new  \GuzzleHttp\Client(['http_errors' => false]);

        $response = $http->post(
            Helper::$idPayDonateServiceVerifyLink,
            array(

                'headers' => array(
                    'X-API-KEY' => env('IDPAY_TOKEN'),
                    'Content-Type' => 'application/json',

                ),
                \GuzzleHttp\RequestOptions::JSON => array(
                    'id' => $request->id,
                    'order_id' => $request->order_id ?? 'aparat',


                )
            ));
        $p = Product::where('pay_id', $request->id)->where('order_id', $request->order_id)->first();

        if ($p) {

            if ($p->type == 'donate')
                DB::table('donators')->where('pay_id', $request->id)->where('order_id', $request->order_id)->update(['done' => true,]);
            else if (strpos($p->type, '_star') !== false) {
                $u = User::where('id', $p->user_id)->first();
                if ($u) {
                    $u->score = $u->score + explode('_', $p->type)[0];
                    $u->save();
                }

            } else if (strpos($p->type, '_unlock') !== false) {
//                $u = User::where('id', $p->user_id)->first();
//                if ($u) {
//                    $u->score = $u->score + explode('_', $p->type)[0];
//                    $u->save();
//                }
                $p->created_at = Carbon::now()->addMonth(); //use created at for check sub
            }
            $p->info = $response->getBody();
            $p->save();
            if ($p->telegram_id) {
                $button = json_encode(['keyboard' => [
                    in_array($p->telegram_id, Helper::$Dev) ? [['text' => 'پنل مدیران🚧']] : [],
                    [['text' => "📱 دریافت اپلیکیشن 📱"]],
                    [['text' => "🎴 ساخت دکمه شیشه ای 🎴"]],
                    [['text' => "📌 دریافت بنر دعوت 📌"]],
                    [['text' => 'امتیاز من💰']],
                    [['text' => $p->user_id ? "ویرایش اطلاعات✏" : "ثبت نام✅"]],
                    [['text' => "📱 خرید شارژ 📱"], ['text' => "📱 خرید اینترنت 📱"]],
                    [['text' => 'درباره ربات🤖'], ['text' => "🙏 حمایت از ما 🙏"]],
                ], 'resize_keyboard' => true]);
                Helper::sendMessage($p->telegram_id, '✅ از حمایت شما ممنونیم!' . "\n" . "کد رهگیری:" . $p->order_id, null, null, $button);
            }
        }
        foreach (Helper::$logs as $log)
            Helper::sendMessage($log, '✅ یک دریافتی به حساب شما انجام شد' . "\n" . $response->getBody(), null, null, null);
        return redirect("https://vartastudio.ir/donate");

    }

    public function charge(Request $request)

    {

        $info = base64_decode(urldecode($request->data));
        $decoded = json_decode($info);
        if ($decoded->status != 'Success') {
            Helper::sendMessage(Helper::$logs[0], 'خطای خرید شارژ ' . "\n" . "$info", null, null, null);
            return $info;
        }
        $phone = $decoded->products ? $decoded->products->details ? $decoded->products->details->cellphone : '' : '';
        $name = $decoded->products ? $decoded->products->name : '';

        $p = Product::where('phone', "$phone")->where('type', '!=', 'donate')->where("info", null)->first();

        if ($p) {
            $user = User::where('telegram_id', $p->telegram_id)->first();
            $button = json_encode(['keyboard' => [
                in_array($p->telegram_id, Helper::$Dev) ? [['text' => 'پنل مدیران🚧']] : [],
                [['text' => "📱 دریافت اپلیکیشن 📱"]],
                [['text' => "🎴 ساخت دکمه شیشه ای 🎴"]],
                [['text' => "📌 دریافت بنر دعوت 📌"]],
                [['text' => 'امتیاز من💰']],
                [['text' => $user ? "ویرایش اطلاعات✏" : "ثبت نام✅"]],
                [['text' => "📱 خرید شارژ 📱"], ['text' => "📱 خرید اینترنت 📱"]],
                [['text' => 'درباره ربات🤖'], ['text' => "🙏 حمایت از ما 🙏"]],
            ], 'resize_keyboard' => true]);

            Helper::sendMessage($p->telegram_id, '🤖خرید شما با موفقیت انجام شد', null, null, $button);

            if ($phone && $user && strlen($user->phones) + strlen($phone) < 50) {
                $phones = explode('$', $user->phones);
                if (count($phones) > 0 && !in_array($phone, $phones)) {
                    array_push($phones, $phone);

                    $user->phones = implode('$', $phones);
                    $user->save();
                }
            }

            $p->info = $info;
            $p->step = null;
            $p->user_id = $user ? $user->id : null;
            $p->save();
//        $user = $user ? $user->telegram_username : '';
            $from_id = $p->telegram_id;
            $from = "[user](tg://user?id=$from_id) ";
            foreach (Helper::$logs as $log)
                Helper::sendMessage($log, '✅ یک شارژ یا اینترنت خریداری شد' . "\n" . "$info\n$name\n$from", null, null, null);
        } else {
            //unknown ???
            Product::create(['user_id' => 0, 'type' => 'charge', 'info' => $info]);

            foreach (Helper::$logs as $log)
                Helper::sendMessage($log, '✅ یک شارژ یا اینترنت خریداری شد' . "\n" . "$info\n$name\nناشناس", "MarkDown", null, null);
        }
        return redirect("https://vartastudio.ir/charge/info?data=" . $request->data);
    }

    function getIAP(Request $request)
    {
        if (!$request->package)
            return [];
        if (strpos($request->package, 'esteghlal') !== false || strpos($request->package, 'perspolis') !== false)
            return Helper::$farsi_app_products;
        else
            try {
                $package = $request->package;
                $client = new \Google_Client();
                $client->setAuthConfig(storage_path() . DIRECTORY_SEPARATOR . Helper::$auth_config_file);
                $client->setScopes(array('https://www.googleapis.com/auth/androidpublisher'));
                $service = new \Google_Service_AndroidPublisher($client);
                $products = $service->inappproducts->listInappproducts($package, []);
                $items = [];
                foreach ($products as $product) {
                    if ($product->sku != 'subscribe')
                        $items[] = $product->sku;
                }
                return $items;
            } catch (\Exception $e) {
                Helper::sendMessage(Helper::$logs[0], "Get Products Error\n$e", null, null);

                return [];
            }
    }
}
