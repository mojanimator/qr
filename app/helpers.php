<?php

use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;

Class Helper
{

    static $refTypes = [['id' => 0, 'name' => 'All', 'title' => 'همه', 'title2' => 'All'],
        ['id' => 1, 'name' => 'https://telegram.me/', 'title' => 'تلگرام', 'title2' => 'Telegram'],
        ['id' => 2, 'name' => 'https://instagram.com/', 'title' => 'اینستاگرام', 'title2' => 'Instagram'],
//        ['id' => 3, 'name' => 'http://www.','title'=>'','title2'=>'Site'],
    ];
    static $refGroups = [
        ['id' => 0, 'name' => 'همه', 'name2' => 'All',],
        ['id' => 1, 'name' => 'ورزشی', 'name2' => 'Sport',],
        ['id' => 2, 'name' => 'کسب و کار', 'name2' => 'Business',],
        ['id' => 3, 'name' => 'بورس', 'name2' => 'Stock',],
        ['id' => 4, 'name' => 'سرگرمی', 'name2' => 'Amuse',],
        ['id' => 5, 'name' => 'ادبیات', 'name2' => 'Literature',],
        ['id' => 6, 'name' => 'هنری', 'name2' => 'Art',],
        ['id' => 7, 'name' => 'خبری', 'name2' => 'News',],
        ['id' => 8, 'name' => 'رسانه', 'name2' => 'Media',],
        ['id' => 9, 'name' => 'علمی', 'name2' => 'Science',],
        ['id' => 10, 'name' => 'آموزشی', 'name2' => 'Tutorial',],
        ['id' => 11, 'name' => 'فرهنگی', 'name2' => 'Culture',],
        ['id' => 12, 'name' => 'مذهبی', 'name2' => 'Religion',],
    ];

    static $lang = 'fa';
    static $app_version = 1;
    static $test = true;
    static $Dev = [72534783, 225594412/* 871016407, 225594412*/]; // آیدی عددی ادمین را از بات @userinfobot بگیرید
    static $logs = [72534783, 225594412];
    static $admins = [1 => ['username' => '@develowper', 'chat_id' => 72534783], 2 => ['username' => '@fazelbabaeirudsari', 'chat_id' => 225594412],];
    static $install_chat_score = 10;
    static $vip_chat_score = 12;
    static $init_score = 5;
    static $ref_score = 5;
    static $see_video_score = 3;
    static $remove_block_score = -1;
    static $remove_option_score = -2;
    static $show_word_score = -2;

    static $chargeLink = "https://vartastudio.ir/charge";
    static $donateLink = "https://idpay.ir/vartastudio";
    static $bot = "@vartastudiobot";
    static $bot_id = "944042527";
    static $app_link = "https://play.google.com/store/apps/developer?id=Varta+Studio";
    static $channel = "@vartastudio"; // ربات را ادمین کانال کنید
    static $info = "\n\n👦[Admin 1](instagram.com/develowper)\n👱[Admin 2](tg://user?id=72534783)\n\n🏠[vartastudiobot](https://telegram.me/vartastudiobot) " . "\n📸 *instagram.com/vartastudio*";

    static function sendMessage($chat_id, $text, $mode, $reply = null, $keyboard = null, $disable_notification = false)
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
            return json_encode($res);
        }

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

    static $lang = ['fa' => [
        '✨تبریک! به یک پیش بینی درست جواب دادی و امتیاز سوال رو گرفتی!',
        ' امتیاز فعلی: ',
        '✨ این تصویر جدید رو از طریق اپلیکیشن پس زمینه گوشیت کن !',
        '✨ سوال زیر رو توی اپلیکیشن جواب بده و به تیمت توی برد کمک کن !',
    ], 'en' => [
        '✨Congratulation! you answered to one predict correctly and got the question score!',
        ' Current Score: ',
        '✨ Set This New Image As Your Device Background With Application!',
        '✨ Answer This New Question In Application And Help Your Team To Win!',
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


function getApps()
{
    //q=question a=answer t=text i=image o=options b=block
    return [
        ['id' => 1, 'name' => 'استقلال'],
        ['id' => 2, 'name' => 'پرسپولیس'],
        ['id' => 3, 'name' => 'barcelona'],
        ['id' => 4, 'name' => 'real'],
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
        $width = $img->width();
        $height = $img->height();
//        return ($width . ',' . $height);
        while ($size > 200) {

            $img = Image::make($inPath)->resize($width / 2, $height / 2, function ($constraint) {
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
