<?php

use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;

Class Helper
{


    static $farsi_app_products = [
        ['id' => '500_star', 'title' => "500 ستاره", 'price' => 15000],
        ['id' => '200_star', 'title' => "200 ستاره", 'price' => 8000],
        ['id' => '100_star', 'title' => "100 ستاره", 'price' => 5000],
        ['id' => '50_star', 'title' => "50 ستاره", 'price' => 3000],
        ['id' => '1_month_unlock', 'title' => "باز کردن قفل یک ماهه", 'price' => 15000],
    ];
    static $refTypes = [['id' => 0, 'name' => 'All', 'title' => 'همه', 'title2' => 'All'],
        ['id' => 1, 'name' => 'https://telegram.me/', 'title' => 'تلگرام', 'title2' => 'Telegram'],
        ['id' => 2, 'name' => 'https://instagram.com/', 'title' => 'اینستاگرام', 'title2' => 'Instagram'],
        ['id' => 3, 'name' => 'https://youtube.com/channels/', 'title' => 'یوتیوب', 'title2' => 'Youtube'],
//        ['id' => 3, 'name' => 'http://www.','title'=>'','title2'=>'Site'],
    ];
    static $refGroups = [
        ['id' => 0, 'name' => 'همه', 'name2' => 'All',],
        ['id' => 1, 'name' => 'ورزشی', 'name2' => 'Sport',],
        ['id' => 2, 'name' => 'ربات', 'name2' => 'Bot',],
        ['id' => 3, 'name' => 'کسب و کار', 'name2' => 'Business',],
        ['id' => 4, 'name' => 'بورس', 'name2' => 'Stock',],
        ['id' => 5, 'name' => 'سرگرمی', 'name2' => 'Amuse',],
//        ['id' => 6, 'name' => 'ادبیات', 'name2' => 'Literature',],
        ['id' => 7, 'name' => 'هنری', 'name2' => 'Art',],
        ['id' => 8, 'name' => 'خبری', 'name2' => 'News',],
        ['id' => 9, 'name' => 'رسانه', 'name2' => 'Media',],
        ['id' => 10, 'name' => 'علمی', 'name2' => 'Science',],
        ['id' => 11, 'name' => 'آموزشی', 'name2' => 'Tutorial',],
        ['id' => 12, 'name' => 'تکنولوژی', 'name2' => 'Culture',],
        ['id' => 13, 'name' => 'مذهبی', 'name2' => 'Religion',],
    ];

    static $lang = 'fa';
    static $app_version = 1;
    static $test = true;
    static $Dev = [72534783, 225594412/* 871016407, 225594412*/]; // آیدی عددی ادمین را از بات @userinfobot بگیرید
    static $logs = [72534783, /*225594412*/];
    static $admins = [1 => ['username' => '@develowper', 'chat_id' => 72534783], 2 => ['username' => '@fazelbabaeirudsari', 'chat_id' => 225594412],];
    static $install_chat_score = 10;
    static $vip_chat_score = 12;
    static $init_score = 5;
    static $ref_score = 5;
    static $see_video_score = 3;
    static $remove_block_score = -1;
    static $remove_option_score = -2;
    static $show_word_score = -2;
    static $chargeProductsLink = 'https://chr724.ir/services/v3/EasyCharge/initializeData';
    static $directChargeLink = 'https://chr724.ir/services/v3/EasyCharge/topup';
    static $directInternetLink = 'https://chr724.ir/services/v3/EasyCharge/internetRecharge';
    static $chargeLink = "https://vartastudio.ir/charge";
    static $donateLink = "https://idpay.ir/vartastudio";
    static $idPayDonateServiceLink = "https://api.idpay.ir/v1.1/payment";
    static $idPayDonateServiceVerifyLink = "https://api.idpay.ir/v1.1/payment/verify";
    static $bot = "@vartastudiobot";
    static $en_bot = "@vartastudio_bot";
    static $admin_username = "@develowper";
    static $bot_id = "944042527";
    static $app_link = "https://play.google.com/store/apps/developer?id=Varta+Studio";
    static $channel = "@vartastudio"; // ربات را ادمین کانال کنید
    static $info = "\n\n👦[Admin 1](instagram.com/develowper)\n👱[Admin 2](tg://user?id=72534783)\n\n🏠[vartastudiobot](https://telegram.me/vartastudiobot) " . "\n📸 *instagram.com/vartastudio*";
    static $info_en = "\n\n👦[Admin 1](instagram.com/develowper)\n👱[Admin 2](tg://user?id=72534783)\n\n🏠[vartastudio_bot](https://telegram.me/vartastudio_bot) " . "\n📸 *instagram.com/vartastudio*";
    static $auth_config_file = 'pc-api-5819856715782464332-952-73a57df82a0f.json';

    static function sendMessage($chat_id, $text, $mode, $reply = null, $keyboard = null, $disable_notification = false, $app_id = null)
    {

        if ($app_id != null)
            $url = "https://api.telegram.org/bot" . env('TELEGRAM_BOT_TOKEN_EN', 'YOUR-BOT-TOKEN') . "/" . 'sendMessage';
        else
            $url = "https://api.telegram.org/bot" . env('TELEGRAM_BOT_TOKEN', 'YOUR-BOT-TOKEN') . "/" . 'sendMessage';
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, [
            'chat_id' => $chat_id,
            'text' => $text,
            'parse_mode' => $mode,
            'reply_to_message_id' => $reply,
            'reply_markup' => $keyboard,
            'disable_notification' => $disable_notification,
        ]);
        $res = curl_exec($ch);

        if (curl_error($ch)) {
            return (curl_error($ch));
        } else {
            return json_encode($res);
        }

    }

    static function sendPhoto($chat_id, $photo, $caption, $reply = null, $keyboard = null)
    {

        Helper::creator('sendPhoto', [
            'chat_id' => $chat_id,
            'photo' => $photo,
            'caption' => $caption,
            'parse_mode' => 'Markdown',
            'reply_to_message_id' => $reply,
            'reply_markup' => $keyboard
        ]);

    }

    static function sendPoll($chat_id, $question, $options, $is_anonymous = false, $type = 'regular',
                             $allows_multiple_answers = false, $correct_option_id = null, $explanation = null,
                             $disable_notification = true, $keyboard = null)
    {

        Helper::creator('sendPoll', [
            'chat_id' => $chat_id,
            'question' => $question,//Poll question, 1-300 characters
            'options' => $options, //A JSON-serialized list of answer options, 2-10 strings 1-100 characters each
            'is_anonymous' => $is_anonymous,
            'type' => $type,//Poll type, “quiz” or “regular”, defaults to “regular”
            'allows_multiple_answers' => $allows_multiple_answers,
            'correct_option_id' => $correct_option_id, //0-based identifier of the correct answer option, required for polls in quiz mode
            'explanation' => $explanation, //Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing
            'disable_notification' => $disable_notification,
            'reply_markup' => $keyboard
        ]);

    }

    static
    function Forward($chatid, $from_id, $massege_id)
    {
        Helper::creator('forwardMessage', [
            'chat_id' => $chatid,
            'from_chat_id' => $from_id,
            'message_id' => $massege_id
        ]);
    }

    static function creator($method, $datas = [])
    {
        $url = "https://api.telegram.org/bot" . env('TELEGRAM_BOT_TOKEN', 'YOUR-BOT-TOKEN') . "/" . $method;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $datas);

//        curl_setopt($ch, CURLOPT_HEADER, false);
//        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT_MS, 3500);
        curl_setopt($ch, CURLOPT_TIMEOUT_MS, 100000);
//        curl_setopt($ch, CURLOPT_POST, 1);
//        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);


        $res = curl_exec($ch);

        if (curl_error($ch)) {
            var_dump(curl_error($ch));
        } else {
            return json_decode($res);
        }
    }

    static function sendPush($app_id, $title = null, $message, $image = null, $icon = null)
    {

// Android -> https://push-pole.com/docs/api/
        $package = '';
        $t = '';
        foreach (getApps() as $app) {
            if ($app['id'] == $app_id) {
                $package = $app['package'];
                $t = $app['name'];

                break;
            }
        }
        $TOKEN = env("PUSH_TOKEN");

        $data = array(
            "app_ids" => [$package,],
            "data" => array(
                "title" => $title ?? $t,
                "content" => $message,

            ),
        );
        if (!$icon)
            $data["data"]["icon"] = asset('storage/app_icons/' . $app_id . ".png");

        if ($image != null)
            $data["data"]["image"] = $image;


// initialize curl
        $ch = curl_init("https://api.push-pole.com/v2/messaging/notifications/");

// set header parameters
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Content-Type: application/json",
            "Accept: application/json",
            "Authorization: Token " . $TOKEN,
        ));
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// set data
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

        $response = curl_exec($ch);

// report url only generated on Non-Free plan
//        $hashed_id = json_decode($response)->hashed_id;


        curl_close($ch);
//        return $hashed_id;

    }

    protected function sendError(Request $request)
    {
        $message = $request->message;


//        $this->sendMessage(Helper::$logs[0], "■ Error!\n" . $request->header('User-Agent'), null, null, null);
        $this->sendMessage(Helper::$logs[0], "\n\n $message", null, null, null);

    }

}

class Lang
{
    const CORRECT_PREDICT_CONGRATULATION = 0;
    const NOW_SCORE = 1;
    const NEW_IMAGE = 2;
    const NEW_QUIZ = 3;
    const NEW_PROFILE = 4;

    static $lang = ['fa' => [
        '✨تبریک! به یک پیش بینی درست جواب دادی و امتیاز سوال رو گرفتی!',
        ' امتیاز فعلی: ',
        '✨ این تصویر جدید رو از طریق اپلیکیشن پس زمینه گوشیت کن !',
        '✨ سوال زیر رو توی اپلیکیشن جواب بده و به تیمت توی برد کمک کن !',
        '✨ این تصویر پروفایل رو از طریق اپلیکیشن دریافت کن !',
    ], 'en' => [
        '✨Congratulation! you answered to one predict correctly and got the question score!',
        ' Current Score: ',
        '✨ Set This New Image As Your Device Background With Application!',
        '✨ Answer This New Question In Application And Help Your Team To Win!',
        '✨ Download This New Profile Image From Application!',
    ]];

    static function get($app_id, $id)
    {
        if ($app_id != 1 && $app_id != 2)
            $lan = 'en';
        else
            $lan = 'fa';

        return Lang::$lang[$lan][$id];
    }
}


function getAppIdFromGroupId($group_id)
{
    $app_id = null;
    switch ($group_id) {
        case  5  :
            $app_id = 1;
            break;
        case  6 :
            $app_id = 2;
            break;
        case  7:
            $app_id = 1;
            break;
        case  8:
            $app_id = 2;
            break;
        case  31:
            $app_id = 3;
            break;
        case  32:
            $app_id = 4;
            break;
        case  22:
            $app_id = 5;
            break;
        case  23:
            $app_id = 6;
            break;
        case  35:
            $app_id = 8;
            break;
        case  29:
            $app_id = 9;
            break;
        case  34:
            $app_id = 12;
            break;
    }
    return $app_id;
}

function getApps()
{
    //q=question a=answer t=text i=image o=options b=block
    return [
        ['id' => 1, 'name' => 'استقلال', 'package' => 'com.varta.esteghlal_wallpapers'],
        ['id' => 2, 'name' => 'پرسپولیس', 'package' => 'com.varta.perspolis_wallpapers'],
        ['id' => 3, 'name' => 'Barcelona', 'package' => 'com.varta.barca_wallpapers'],
//        ['id' => 4, 'name' => 'Real Madrid', 'package' => 'com.varta.real_wallpapers'],
        ['id' => 5, 'name' => 'PSG', 'package' => 'com.varta.psg_wallpapers'],
        ['id' => 6, 'name' => 'AC Milan', 'package' => 'com.varta.milan_wallpapers'],
//        ['id' => 7, 'name' => 'Manchester United', 'package' => 'com.varta.manchester_wallpapers'],
        ['id' => 8, 'name' => 'Juventus', 'package' => 'com.varta.juventus_wallpapers'],
        ['id' => 9, 'name' => 'Liverpool', 'package' => 'com.varta.liverpool_wallpapers'],
        ['id' => 10, 'name' => 'Bayern Munich', 'package' => 'com.varta.bayern_wallpapers'],
        ['id' => 12, 'name' => 'Fortnite', 'package' => 'com.varta.fortnite_wallpapers'],
//        ['id' => 100, 'name' => 'quiz of football'],
    ];
}

function getGameTypes()
{
    //q=question a=answer t=text i=image o=options b=block
    return [['id' => 1, 'q' => 't', 'a' => 'o', 'name' => 'متن با گزینه'],
        ['id' => 2, 'q' => 't', 'a' => 'b', 'name' => 'متن با بلاک'],
        ['id' => 3, 'q' => 'i', 'a' => 'o', 'name' => 'عکس با گزینه'],
        ['id' => 4, 'q' => 'i', 'a' => 'b', 'name' => 'عکس با بلاک'],];
}

function simple_color_thief($img, $default = null)
{
    if (@exif_imagetype($img)) { // CHECK IF IT IS AN IMAGE
        $type = getimagesize($img)[2]; // GET TYPE
        if ($type === 1) { // GIF
            $image = imagecreatefromgif($img);
            // IF IMAGE IS TRANSPARENT (alpha=127) RETURN fff FOR WHITE
            if (imagecolorsforindex($image, imagecolorstotal($image) - 1)['alpha'] == 127) return 'fff';
        } else if ($type === 2) { // JPG
            $image = imagecreatefromjpeg($img);
        } else if ($type === 3) { // PNG
            $image = imagecreatefrompng($img);
            // IF IMAGE IS TRANSPARENT (alpha=127) RETURN fff FOR WHITE
            if ((imagecolorat($image, 0, 0) >> 24) & 0x7F === 127) return 'fff';
        } else { // NO CORRECT IMAGE TYPE (GIF, JPG or PNG)
            return $default;
        }
    } else { // NOT AN IMAGE
        return null;
    }
    $newImg = imagecreatetruecolor(1, 1); // FIND DOMINANT COLOR
    imagecopyresampled($newImg, $image, 0, 0, 0, 0, 1, 1, imagesx($image), imagesy($image));
    return dechex(imagecolorat($newImg, 0, 0)); // RETURN HEX COLOR
}

function flash($title = null, $message = null)
{
//    session()->flash('flash_message', $message);
//    session()->flash('flash_message_level', $level);

    $flash = app('App\Http\Flash');

    if (func_num_args() == 0) { //  flash() is empty means flash()->success('title','message') and ...
        return $flash;
    }

    return $flash->info($title, $message); //means flash('title','message')

}

function w2e($str)
{
    $eastern = array('٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩');
    $western = array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
    return str_replace($western, $eastern, $str);
}

function sort_banners_by($column, $body)
{
    $direction = (Request::get('direction') == 'ASC') ? 'DESC' : 'ASC';

    return '<a href=' . route('banners.index', ['sortBy' => $column, 'direction' => $direction]) . '>' . $body . '</a>';
}

if (!function_exists('validate_base64')) {

    /**
     * Validate a base64 content.
     *
     * @param string $base64data
     * @param array $allowedMime example ['png', 'jpg', 'jpeg']
     * @return bool
     */
    function validate_base64($base64data, array $allowedMime)
    {
        // strip out data uri scheme information (see RFC 2397)
        if (strpos($base64data, ';base64') !== false) {
            list(, $base64data) = explode(';', $base64data);
            list(, $base64data) = explode(',', $base64data);
        }

        // strict mode filters for non-base64 alphabet characters
        if (base64_decode($base64data, true) === false) {
            return false;
        }

        // decoding and then reeconding should not change the data
        if (base64_encode(base64_decode($base64data)) !== $base64data) {
            return false;
        }

        $binaryData = base64_decode($base64data);

        // temporarily store the decoded data on the filesystem to be able to pass it to the fileAdder
        $tmpFile = tempnam(sys_get_temp_dir(), 'medialibrary');
        file_put_contents($tmpFile, $binaryData);

        // guard Against Invalid MimeType
        $allowedMime = array_flatten($allowedMime);

        // no allowedMimeTypes, then any type would be ok
        if (empty($allowedMime)) {
            return true;
        }

        // Check the MimeTypes
        $validation = Illuminate\Support\Facades\Validator::make(
            ['file' => new Illuminate\Http\File($tmpFile)],
            ['file' => 'mimes:' . implode(',', $allowedMime)]
        );

        return !$validation->fails();
    }

    function createThumbnail($inPath, $outPath)
    {
        $img = Image::make($inPath);
        $size = $img->filesize() / 1024; //kb
        $thSize = $size / 5;
        $width = $img->width();
        $height = $img->height();
//        return ($width . ',' . $height);
        while ($size > $thSize) {

            $img = Image::make($inPath)->resize($width * 3 / 4, $height * 3 / 4, function ($constraint) {
                $constraint->aspectRatio();
            });
            $img->save($outPath);
            $size = $img->filesize() / 1024; //kb
            $width = $img->width();
            $height = $img->height();
        }

        $img->save($outPath);
    }

    function sendMessage($chat_id, $text, $mode, $reply = null, $keyboard = null, $disable_notification = false)
    {
        $url = "https://api.telegram.org/bot" . env('TELEGRAM_BOT_TOKEN', 'YOUR-BOT-TOKEN') . "/" . 'sendMessage';
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, [
            'chat_id' => $chat_id,
            'text' => $text,
            'parse_mode' => $mode,
            'reply_to_message_id' => $reply,
            'reply_markup' => $keyboard,
            'disable_notification' => $disable_notification,
        ]);
        $res = curl_exec($ch);

        if (curl_error($ch)) {
            return (curl_error($ch));
        } else {
            return json_decode($res);
        }

    }
}
