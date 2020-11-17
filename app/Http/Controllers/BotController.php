<?php

namespace App\Http\Controllers;


use App\Info;
use App\Invites;
use App\Quiz;
use App\User;

use Carbon\Carbon;
use DateTime;

use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use PhpParser\Node\Stmt\Else_;


class BotController extends Controller
{
    protected $Dev, $logs, $channel, $info, $user, $bot, $init_score, $ref_score, $install_chat_score,
        $follow_score, $add_score, $left_score, $divar_show_items, $divar_scores, $bot_id, $tut_link, $app_link;
    //user selected  game type and click on find gamer
    //try to find gamer else connect to a bot

    public function __construct()
    {
        error_reporting(1);
        set_time_limit(-1);
        header("HTTP/1.0 200 OK");
        date_default_timezone_set('Asia/Tehran');
//--------[Your Config]--------//
        $this->Dev = Helper::$Dev; // آیدی عددی ادمین را از بات @userinfobot بگیرید
        $this->logs = Helper::$logs;
        $this->ref_score = Helper::$ref_score;
        $this->init_score = Helper::$init_score;


        $this->bot = Helper::$bot;
        $this->channel = Helper::$channel; // ربات را ادمین کانال کنید
        $this->info = Helper::$info;
        $this->bot_id = Helper::$bot_id;
        $this->app_link = Helper::$app_link;
//-----------------------------//
        define('API_KEY', env('TELEGRAM_BOT_TOKEN', 'YOUR-BOT-TOKEN')); // توکن ربات
    }


    public function getupdates(Request $request)
    {
        $update = json_decode(file_get_contents('php://input'));
        if (isset($update->message)) {
            $message = $update->message;
            $chat_id = $message->chat->id;
            $chat_username = '@' . $message->chat->username;
            $text = $message->text;
            $message_id = $message->message_id;
            $from_id = $message->from->id;
            $tc = $message->chat->type;
            $title = isset($message->chat->title) ? $message->chat->title : "";
            $first_name = isset($message->from->first_name) ? $message->from->first_name : "";
            $last_name = isset($message->from->last_name) ? $message->from->last_name : "";
            $username = isset($message->from->username) ? '@' . $message->from->username : "";
            $reply = isset($message->reply_to_message->forward_from->id) ? $message->reply_to_message->forward_from->id : "";
            $reply_id = isset($message->reply_to_message->from->id) ? $message->reply_to_message->from->id : "";
            $new_chat_member = $update->message->new_chat_member; #id,is_bot,first_name,last_name,username
            $new_chat_members = $update->message->new_chat_members; #[id,is_bot,first_name,last_name,username]
            $left_chat_member = $update->message->left_chat_member; #id,is_bot,first_name,username
            $new_chat_participant = $update->message->new_chat_participant; #id,username

//            $animation = $update->message->animation;  #file_name,mime_type,width,height,file_id,file_unique_id,file_size,thumb[file_id,file_unique_id,file_size,width,
//            $sticker = $update->message->sticker;  #width,height,emoji,set_name,is_animated,file_id,file_unique_id,file_size,thumb[file_id,file_unique_id,file_size,width,
//            $photo = $update->message->photo; #[file_id,file_unique_id,file_size,width,height] array of different photo sizes
//            $document = $update->message->document; #file_name,mime_type,thumb[file_id,file_unique_id,file_size,width,height]
//            $video = $update->message->video; #duration,width,height,mime_type,file_id,file_unique_id,file_size,thumb[file_id,file_unique_id,file_size,width,height]
//            $audio = $update->message->audio; #duration,mime_type,title,performer,file_id,file_unique_id,file_size,thumb[file_id,file_unique_id,file_size,width,height]
//            $voice = $update->message->voice; #duration,mime_type,file_id,file_unique_id,file_size
//            $video_note = $update->message->video_note; #duration,length,file_id,file_unique_id,file_size,thumb[file_id,file_unique_id,file_size,width,height]
            $caption = $message->caption;

        }
        if (isset($update->callback_query)) {
            $Data = $update->callback_query->data;
            $data_id = $update->callback_query->id;
            $chat_id = $update->callback_query->message->chat->id;
            $from_id = $update->callback_query->from->id;
            $first_name = $update->callback_query->from->first_name;
            $last_name = $update->callback_query->from->last_name;
            $username = '@' . $update->callback_query->from->username;
            $tc = $update->callback_query->message->chat->type;
            $message_id = $update->callback_query->message->message_id;

        }
        if (isset($update->channel_post)) {
            $tc = $update->channel_post->chat->type;
            $text = $update->channel_post->text;
            $chat_id = $update->channel_post->chat->id;
            $chat_username = '@' . $update->channel_post->chat->username;
            $chat_title = $update->channel_post->chat->title;

            $message_id = $update->channel_post->message_id;
//            $from_id = json_encode($update);
            $from_id = $this->Dev;
        }
//        return json_encode($from_id);
        // if ($new_chat_members || $new_chat_member || $left_chat_member){
        //     Storage::prepend('file.log', json_encode($update->message));

        //   $this->sendMessage("871016407", "$message", "Markdown", null, null);

        // }


//------------------------------------------------------------------------------
//        $rank = $this->user_in_chat($this->channel, $from_id, $tc);// $get['result']['status'];

//        $this->bot_id = $this->creator('GetMe', [])->result->id;
//        $INSTALL_ICON = '🥒';
//        $ABOUT_ICON = '🤖';
//        $USER_EDIT_ICON = "✏";
//        $USER_REGISTER_ICON = "✅";
//        $CANCEL_REGISTER_ICON = "❌";
//
//        $INSTALL_BOT = " نصب ربات";
//        $ABOUT_BOT = " درباره ربات";
//        $USER_EDIT = "ویرایش اطلاعات";
//        $USER_REGISTER = " ثبت نام ";
//        $CANCEL_REGISTER = "لغو ثبت نام";

        if ($tc == 'private') {
            $this->user = User::where('telegram_id', $from_id)->first();
//            return (string)($USER_REGISTER . "\xE2\x9C\x85" == $text);
//            return (string)(0 == null);
//            return $this->user_in_channel("@lamassaba", $from_id);// == 'administrator' or 'creator'
//            return $this->user_in_channel("@twitterfarsi", $from_id);// Bad Request: user not found
//            return $this->user_in_channel("@twitteddrfarsi", $from_id);// Bad Request: chat not found

//            return json_encode($this->inviteToChat($this->channel));
            $team_button = json_encode(['inline_keyboard' => [

                [['text' => "استقلال", 'callback_data' => "team$1"]],
                [['text' => "پرسپولیس", 'callback_data' => "team$2"]],
            ], 'resize_keyboard' => true]);

            $buy_button = json_encode(['inline_keyboard' => [
                [['text' => "📪 ارتباط با ما 📪", 'url' => "telegram.me/" . 'develowper']],
                [['text' => "📌 دریافت بنر دعوت 📌", 'callback_data' => "بنر"]],
            ], 'resize_keyboard' => true]);

            $divar_button = json_encode(['keyboard' => [

                [['text' => 'امتیاز من💰']],
                [['text' => 'منوی اصلی⬅']],
            ], 'resize_keyboard' => true]);
            $button = json_encode(['keyboard' => [
                in_array($from_id, $this->Dev) ? [['text' => 'پنل مدیران🚧']] : [],

                [['text' => "📱 دریافت اپلیکیشن 📱"]],
                [['text' => "🎴 ساخت دکمه شیشه ای 🎴"]],
                [['text' => "📌 دریافت بنر دعوت 📌"]],
                [['text' => 'امتیاز من💰']],
                [['text' => $this->user ? "ویرایش اطلاعات✏" : "ثبت نام✅"]],
                [['text' => "🙏🙏🙏🙏 حمایت از ما 🙏🙏🙏🙏"]],
                [['text' => 'درباره ربات🤖']],
            ], 'resize_keyboard' => true]);
            $cancel_button = json_encode(['keyboard' => [
                [['text' => "لغو ثبت نام❌"]],
            ], 'resize_keyboard' => true]);
            $return_button = json_encode(['inline_keyboard' => [
                [['text' => "بازگشت⬅", 'callback_data' => "edit_cancel"]],
            ], 'resize_keyboard' => true]);
            $edit_button = json_encode(['inline_keyboard' => [
                [['text' => 'ویرایش نام کاربری', 'callback_data' => "edit_username"]],
//                [['text' => 'ویرایش ایمیل', 'callback_data' => "edit_email"]],
                [['text' => 'ویرایش گذرواژه', 'callback_data' => "edit_password"]],
                [['text' => 'ویرایش تصویر پروفایل', 'callback_data' => "edit_image"]],
            ], 'resize_keyboard' => true]);
            $admin_button = json_encode(['inline_keyboard' => [
                [['text' => "📬 ارسال همگانی به همه کاربران", 'callback_data' => 'send_to_users$0']],
                [['text' => "📬 ارسال همگانی به کاربران استقلال", 'callback_data' => 'send_to_users$1']],
                [['text' => "📬 ارسال همگانی به کاربران پرسپولیس", 'callback_data' => 'send_to_users$2']],
                [['text' => "📬 ارسال همگانی به کاربران بارسا", 'callback_data' => 'send_to_users$3']],
                [['text' => "📬 ارسال همگانی به کاربران رئال", 'callback_data' => 'send_to_users$4']],
                [['text' => "📬 ارسال همگانی به گروه ها", 'callback_data' => 'send_to_chats']],
                [['text' => "🚶 مشاهده کاربران", 'callback_data' => 'see_users']],
                [['text' => "🚶 مشاهده فالورها", 'callback_data' => 'see_followers']],
                [['text' => "👑 ثبت نتیجه پیش بینی", 'callback_data' => 'predict_response']],
                [['text' => "🤖بروزرسانی سرور", 'callback_data' => 'update_server_status']],
                [['text' => "❓ راهنمای دستورات", 'callback_data' => 'admin_help']],
                [['text' => "📊 آمار", 'callback_data' => 'statistics']],
            ], 'resize_keyboard' => true]);
            $send_cancel_button = json_encode(['inline_keyboard' => [
                [['text' => "لغو ارسال⬅", 'callback_data' => "send_cancel"]],
            ], 'resize_keyboard' => true]);

            if (preg_match('/^\/(start)$/i', $text)) {

                if (!$this->user) $this->sendMessage($chat_id, "■ سلام $first_name خوش آمدید\n\n" . "📌 با این ربات توی تیم محبوبت ثبت نام کن و اپلیکیشن تیمت رو دانلود کن و با کمک هم تیمی ها برنده باش \n 🔵استقلال 👑 پرسپولیس🔴" . "\n\n📌 برای استفاده از تمامی امکانات ربات و اپلیکیشن ابتدا ثبت نام کن :", null, $message_id, $button);
                else $this->sendMessage($chat_id, "■ سلام $first_name خوش آمدید✋\n\n■ چه کاری براتون انجام بدم؟ ", null, $message_id, $button);
//                $first_name = $this->MarkDown($first_name);


                foreach ($this->logs as $log)
                    $this->sendMessage($log, "■  کاربر [$first_name](tg://user?id=$from_id) ربات ورتا را استارت زد.", 'MarkDown');

            }
//            elseif ($rank != 'creator' && $rank != 'administrator' && $rank != 'member') {
//                $this->sendMessage($chat_id, "■ برای استفاده از ربات و همچنین حمایت از ما ابتدا وارد کانال\n● $this->channel\n■ شده سپس به ربات برگشته و /start را بزنید.", null, $message_id, json_encode(['KeyboardRemove' => [], 'remove_keyboard' => true]));
//
//            }
            elseif ($text == "🙏🙏🙏🙏 حمایت از ما 🙏🙏🙏🙏") {
                $buy_button = json_encode(['inline_keyboard' => [
                    [['text' => "⬅ کلیک کنید ", 'url' => Helper::$donateLink]],
                ], 'resize_keyboard' => true]);
                $this->sendMessage($chat_id, "🙏 حمایت از ما و رایگان ماندن برنامه برای همه 🙏", 'MarkDown', null, $buy_button);

            } elseif ($text == 'منوی اصلی⬅') {
                $this->sendMessage($chat_id, "منوی اصلی", 'MarkDown', $message_id, $button);

            } elseif ($text == 'امتیاز من💰') {
                $score = $this->user->score ?? 0;

                $this->sendMessage($from_id, "💰 امتیاز فعلی شما:$score \n  برای دریافت امتیاز می توانید بنر تبلیغاتی مخصوص خود را تولید کرده و یا در اپلیکیشن ویدیو تماشا کنید و یا از طریق دکمه ارتباط با ما اقدام به خرید امتیاز نمایید ", 'Markdown', $message_id, $buy_button);


            } elseif ($text == "منوی اصلی💬") {

                $this->sendMessage($chat_id, "منوی اصلی", null, $message_id, $button);

            } elseif ($text == "لغو ❌") {
                if ($this->user) {
                    $this->user->step = null; // for register channel
                    $this->user->save();
                }
                $this->sendMessage($chat_id, "با موفقیت لغو شد!", null, $message_id, $button);

            } elseif ($text == 'درباره ربات🤖') {
                $this->sendMessage($chat_id, "✅توسط این ربات می توانید در *اپلیکیشن های استودیو ورتا* ثبت نام کرده و از *امکانات* و *سرگرمی های*  این اپلیکیشن ها  استفاده کنید✅", 'MarkDown', $message_id);
                $this->sendMessage($chat_id, " \n لینک دریافت اپلیکیشن:\n  $this->app_link \n", 'MarkDown', $message_id);
                $this->sendMessage($chat_id, "$this->info\n", 'Markdown', $message_id, $button);
            } elseif ($text == "لغو ثبت نام❌") {
                $button = json_encode(['keyboard' => [
                    [['text' => "ثبت نام✅"]],
                    [['text' => 'درباره ربات🤖']],
                ], 'resize_keyboard' => true]);# user is registering


                if ($this->user) {
                    $this->user->step = null; // for register channel
                    $this->user->delete();
                }

                $this->sendMessage($chat_id, "ثبت نام شما لغو شد", 'MarkDown', $message_id, $button);

            } elseif ($text == "ویرایش اطلاعات✏") {

                if (!$this->user) $this->sendMessage($chat_id, "شما  ثبت نام نکرده اید", 'MarkDown', $message_id, $button);
                else {
                    $this->sendMessage($chat_id, "■ برای مدیریت تنظیمات از کلید های زیر استفاده کنید :", null, $message_id, $edit_button);
//                    $this->user->step = 0;
//                    $this->user->save();
//                    $this->sendMessage($chat_id, "نام کاربری را وارد کنید", 'MarkDown', $message_id, $button);
                }
            } elseif ($Data == "help_add_bot_channel") {
                $txt = "\n*اضافه کردن ربات در کانال :*\n🔸 ابتدا وارد کانال خود شده و روی اسم آن کلیک کرده تا اطلاعات آن نمایش داده شود\n🔸 در نسخه دسکتاپ روی گزینه سه نقطه و سپس گزینه *add members* کلیک کنید.\n🔸 در نسخه موبایل روی  *subscribers* و سپس *add subscriber* کلیک کنید . \n در این مرحله اسم ربات($this->bot) را جستجو نموده و به کانال اضافه کنید\n 🔸 *ربات در کانال حتما باید به عنوان ادمین اضافه شود* . \n 🔸سپس در کانال دستور 'نصب' را وارد کنید تا کانال شما ثبت شود🌹";
                $this->sendMessage($chat_id, $txt, 'MarkDown', null);

            } elseif ($Data == "edit_username") {
                $name = $this->user->username;
                $this->user->step = 6;
                $this->user->save();
                $this->sendMessage($chat_id, "نام  فعلی: $name \n  نام کاربری جدید را وارد کنید:", 'MarkDown', null, $return_button);

            }
//            elseif ($Data == "edit_email") {
//                $name = $this->user->email;
//                $this->user->step = 7;
//                $this->user->save();
//                $this->sendMessage($chat_id, "ایمیل  فعلی: $name \n  ایمیل  جدید را وارد کنید:", 'MarkDown', null, $return_button);
//
//            }

            elseif ($Data == "edit_password") {
                $this->user->step = 8;
                $this->user->save();
                $this->sendMessage($chat_id, "    \n  گذرواژه جدید را وارد کنید:", 'MarkDown', null, $return_button);

            } elseif ($Data == "edit_image") {
//                $this->user->step = 8;
//                $this->user->save();
                $this->createUserImage($this->user->telegram_id);
                $this->sendMessage($chat_id, "تصویر فعلی تلگرام شما بعنوان عکس پروفایل در اپلیکیشن تنظیم شد", 'MarkDown', null, $return_button);

            } elseif ($Data == "edit_cancel") {
                $this->user->step = null;
                $this->user->save();
                $this->sendMessage($chat_id, "■ برای مدیریت تنظیمات از کلید های زیر استفاده کنید :", null, null, $edit_button);


            } elseif ($Data == "predict_response") {

                $quizzes = [];
                foreach (Quiz::where('is_predict', true)->select('id', 'question')->get() as $item) {
                    array_push($quizzes, [['text' => $item['question'], 'callback_data' => "predict$" . $item['id']]]);

                }
                if (count($quizzes) === 0) {
                    $this->sendMessage($chat_id, "■ در حال حاضر سوال پیش بینی وجود ندارد", null, null, null);
                    return;
                }

                $btn = json_encode(['inline_keyboard' => $quizzes, 'resize_keyboard' => true]);
                $this->sendMessage($chat_id, "■ سوال مورد نظر را انتخاب کنید :", null, null, $btn);


            } elseif (strpos($Data, "predict$") !== false) {
                $qId = explode('$', $Data)[1];
                $q = Quiz::where('id', $qId)->first();

                $options = [];
                foreach ($q->options as $item) {
                    array_push($options, [['text' => $item, 'callback_data' => $q->id . '$option$' . $item]]);

                }
                array_push($options, [['text' => 'خالی', 'callback_data' => $q->id . '$option$']]);

                $btn = json_encode(['inline_keyboard' => $options, 'resize_keyboard' => true]);
                $this->sendMessage($chat_id, "■ گزینه جواب را انتخاب کنید :", null, null, $btn);


            } elseif (strpos($Data, '$option$') !== false) {
                $qId = explode('$', $Data)[0];
                $qResponse = explode('$', $Data)[2];

                Quiz::where('id', $qId)->update(['response' => $qResponse == '' ? null : $qResponse]);


                $btn = json_encode(['inline_keyboard' => [[['text' => 'سایر سوالات', 'callback_data' => 'predict_response']]], 'resize_keyboard' => true]);
                $this->sendMessage($chat_id, "■ جواب با موفقیت ثبت شد", null, null, $btn);


            } elseif ($text == "پنل مدیران🚧") {
//
                $this->sendMessage($chat_id, "🚧فقط مدیران ربات به این پنل دسترسی دارند. گزینه مورد نظر خود را انتخاب کنید:", "Markdown", null, $admin_button);
            } elseif (strpos($Data, "send_to_users$") !== false) {

                $step = (int)explode("$", $Data)[1];

                $this->user->step = 90 + $step;
                $this->user->save();
                $this->sendMessage($chat_id, "■ متن یا فایل ارسالی را وارد کنید :", null, null, $send_cancel_button);

            } elseif ($Data == "send_cancel") {
                $this->user->step = null;
                $this->user->save();
                $this->sendMessage($chat_id, "با موفقیت لغو شد ", null, null, null);


            } elseif ($Data == "see_users") {
                $txt = "";
                $txt .= "\n-------- لیست کاربران-----\n";
                if (in_array($from_id, $this->Dev))

                    foreach (User::get(['id', 'username', 'telegram_username', 'telegram_id', 'score']) as $idx => $user) {

                        $txt .= "id: $user->id\n";
                        $txt .= "username: $user->username\n";
                        $txt .= "telegram_username: $user->telegram_username\n";
                        $txt .= "telegram_id: $user->telegram_id\n";
                        $txt .= "app: $user->app_id\n";
//                        $txt .= "channels:" . json_encode($user->channels) . "\n";
//                        $txt .= "groups: " . json_encode($user->groups) . "\n";
                        $txt .= "score: $user->score\n";
                        $txt .= "\n-----------------------\n";
                        if ($idx % 3 == 0) {
                            $this->sendMessage($chat_id, $txt, null, null, null);
                            $txt = "";
                        }
                    }


            } elseif (strpos($Data, "send_to_users_ok$") !== false) {

                $app_id = explode("$", $Data)[1];

                $this->user->step = null;
                $this->user->save();

                if ($app_id == '0')
                    $ids = User::pluck('telegram_id')->toArray();
                else
                    $ids = User::where('app_id', $app_id)->pluck('telegram_id')->toArray();


                if (in_array($from_id, $this->Dev))
                    foreach ($ids as $id) {

                        $this->sendFile($id, Storage::get('message.txt'), null);
                    }
                $this->DeleteMessage($chat_id, $message_id);
                $this->sendMessage($chat_id, "■ با موفقیت به کاربران ارسال شد!", null, null, null);


            } elseif ($Data == "send_to_chats_ok") {
                $this->user->step = null;
                $this->user->save();

                if (in_array($from_id, $this->Dev))

                    foreach (Helper::$admins as $id => $data) {

                        $channel = $data['channel'];
                        $this->sendFile($channel, Storage::get('message.txt'), null);
                    }

//                $this->DeleteMessage($chat_id, $message_id);
                $this->sendMessage($chat_id, "■ با موفقیت به گروه ها ارسال شد!", null, null, null);


            } elseif ($Data == "statistics") {


                $txt = "";
                $txt .= "تعداد کاربران استقلال" . PHP_EOL;
                $txt .= User::where('app_id', 1)->count() . PHP_EOL;
                $txt .= "-------------------" . PHP_EOL;
                $txt .= "تعداد کاربران پرسپولیس" . PHP_EOL;
                $txt .= User::where('app_id', 2)->count() . PHP_EOL;
                $txt .= "-------------------" . PHP_EOL;
                $txt .= "✨استقلال" . PHP_EOL;
                $txt .= Info::where('app_id', 1)->first() . PHP_EOL;
                $txt .= "✨پرسپولیس" . PHP_EOL;
                $txt .= Info::where('app_id', 2)->first() . PHP_EOL;
                $txt .= "✨بارسا" . PHP_EOL;
                $txt .= Info::where('app_id', 3)->first() . PHP_EOL;
                $txt .= "✨رئال" . PHP_EOL;
                $txt .= Info::where('app_id', 4)->first() . PHP_EOL;
                $txt .= "-------------------" . PHP_EOL;


//                $this->DeleteMessage($chat_id, $message_id);
                $this->sendMessage($chat_id, $txt, null, null, null);


            } elseif ($Data == "admin_help") {
                $txt = "اضافه کردن امتیاز به کاربر" . "\n";
                $txt .= "<user_id>:score:<score>" . "\n";

                $txt .= "ساخت بنر" . "\n";
                $txt .= "banner:<متن پیام>" . "\n";
                $txt .= "ساخت متن با کلید شیشه ای" . "\n";
                $txt .= "inline:<متن پیام>\nمتن1\nلینک1\n ..." . "\n";
                $txt .= "تبلیغ انتهای پیام ارسالی" . "\n";
                $txt .= "banner=name=link" . "\n";
                $this->sendMessage($chat_id, $txt, null, null, null);

            } elseif ($Data == "update_server_status") {
                Artisan::call('update:status');

            } elseif ((strpos($text, ":score:") !== false)) {


                $id = explode(":", $text)[0];
                $score = explode(":", $text)[2];
                if (in_array($from_id, $this->Dev)) {

                    $col = 'id';
                    if (substr($id, 0, 1) == "@")
                        $col = 'telegram_username';
                    $u = User::where($col, $id)->first();
                    $u->score += $score;
                    $u->save();
                    $this->sendMessage($u->telegram_id, "🙌 تبریک! \n $score  امتیاز به شما اضافه شد!  \n  امتیاز فعلی : $u->score", null, null, null);
                    $this->sendMessage($chat_id, "$score  امتیاز به $u->telegram_username  اضافه شد.", null, null, null);
                }

            } elseif ((strpos($text, "banner:") !== false)) {
                if (!in_array($from_id, $this->Dev)) return;
                $txt = " سلام   \n  توسط این ربات عضو تیم محبوبت شو و توی مسابقات کمکشون کن! \n     $this->bot ";
                $buttons = [[['text' => '👈 دانلود اپلیکیشن 👉', 'url' => Helper::$app_link]]];
                $tmp = explode(":", $text);
                if (count($tmp) >= 2 && $tmp[1] != '')
                    $txt = $tmp[1];

                $this->sendMessage($chat_id, $txt, "Markdown", null, json_encode(['inline_keyboard' => $buttons, 'resize_keyboard' => true]));


            } elseif ((strpos($text, "inline:") !== false)) {
                if (!in_array($from_id, $this->Dev)) return;
                $buttons = [];
                $inlines = explode("\n", $text);
                $txt = explode(":", array_shift($inlines))[1]; //remove first (inline)
                $len = count($inlines);
                foreach ($inlines as $idx => $item) {

                    if ($idx % 2 == 0 && $idx + 1 < $len)
                        array_push($buttons, [['text' => $inlines[$idx], 'url' => $inlines[$idx + 1]]]);

                }


                $this->sendMessage($chat_id, $txt, null, null, json_encode(['inline_keyboard' => $buttons, 'resize_keyboard' => true]));


            } elseif ($text == "ثبت نام✅") {

                if ($this->user) $this->sendMessage($chat_id, "شما قبلا ثبت نام کرده اید", 'MarkDown', $message_id, $button);
                else if ($username == "@" || $username == "") $this->sendMessage($chat_id, "لطفا قبل از ثبت نام, از منوی تنظیمات تلگرام خود, یک نام کاربری به اکانت خود تخصیص دهید!", 'MarkDown', $message_id, $button);
                else {
                    $this->user = User::create(['telegram_id' => $from_id, 'username' => $username, 'telegram_username' => $username, 'score' => $this->init_score, 'step' => 0]);

                    $this->sendMessage($chat_id, "نام کاربری خود را با حروف و اعداد انگلیسی و بدون فاصله وارد کنید \n(حداقل 6 حرف)", 'MarkDown', $message_id, $cancel_button);
                }
            } elseif ($text == "📱 دریافت اپلیکیشن 📱") {

                $this->sendMessage($chat_id, "📱لینک دریافت اپلیکیشن📱" . "\n" . Helper::$app_link, 'MarkDown', $message_id, $button);

            } elseif ($text == "🎴 ساخت دکمه شیشه ای 🎴") {
                if (!$this->user) $this->sendMessage($chat_id, "■  $first_name \n\n■  ابتدا در ربات ثبت نام کنید :", null, $message_id, $button);

                else {
                    $cancel_button = json_encode(['keyboard' => [
                        [['text' => "لغو ❌"]],
                    ], 'resize_keyboard' => true]);
                    $this->user->step = 10;

                    $this->user->save();

                    $this->sendMessage($chat_id, "متن یا فایل خود را وارد کنید", 'MarkDown', $message_id, $cancel_button);
                }
            } elseif (strpos($Data, "team$") !== false) {
                $app_id = explode('$', $Data)[1];
                if ($this->check('app_id', $app_id, $chat_id, $message_id, $cancel_button)) {
                    $this->user->app_id = $app_id;
                    $this->user->step = 5;
                    $this->user->save();
                    $this->sendMessage($chat_id, "    \n  رمز ورود خود را ثبت کنید:", 'MarkDown', null, $return_button);
                }
            } elseif (!$Data && $this->user && $this->user->step !== null && $this->user->step >= 0) {
                # user is registering

                switch ($this->user->step) {
                    case  0:
                        if ($this->check('username', $text, $chat_id, $message_id, $cancel_button)) {
                            $this->user->step = null;
                            $this->user->username = $text;
                            $this->user->save();
                            $this->sendMessage($chat_id, "تیم خود را انتخاب کنید", 'MarkDown', $message_id, $team_button);

                        }
                        break;
                    case  1:
                        if ($this->check('app_id', $text, $chat_id, $message_id, $cancel_button)) {
                            $this->user->step = 5;
                            $this->user->email = $text;
                            $this->user->save();
                            $this->sendMessage($chat_id, "رمز عبور را وارد کنید\n(حداقل 6 حرف)", 'MarkDown', $message_id);

                        }
                        break;
                    //check email or phone later
                    case  5:
                        if ($this->check('password', $text, $chat_id, $message_id, $cancel_button)) {

                            $this->user->password = Hash::make($text);
                            $this->user->step = null;
                            $this->user->save();
                            $this->createUserImage($this->user->telegram_id);
                            $this->sendMessage($chat_id, "✨با موفقیت ثبت نام شدی و 5 امتیاز گرفتی!\nمی تونی با اشتراک گذاری بنر خودت و یا دیدن ویدیو در اپلیکیشن، امتیازت روافزایش بدی.\n✨حالا از دکمه دریافت اپلیکیشن، اپلیکیشن تیمت رو دریافت کن و بهشون توی بردن مسابقه کمک کن!\n👇👇👇✨", 'MarkDown', $message_id, $button);

                            foreach ($this->logs as $log)
                                $this->sendMessage($log, "✨  کاربر [$first_name](tg://user?id=$from_id) در ربات ورتا ثبت نام کرد.", 'MarkDown');


                            $ref = Invites::where('new_telegram_id', $from_id)->first();
                            if ($ref) {
                                $user = User::where('telegram_id', $ref->invited_by)->first();
                                if ($user) {
                                    $user->score += $this->ref_score;
                                    $user->save();
                                    $this->sendMessage($ref->invited_by, "✨  کاربر [$first_name](tg://user?id=$from_id)  با لینک دعوت شما ثبت نام کرد و $this->ref_score امتیاز به شما اضافه شد!   .", 'MarkDown', null, null);
                                }
                            }
                        }
                        break;
// edit section
                    case  6:
                        if ($this->check('username', $text, $chat_id, $message_id, $return_button)) {
                            $this->user->step = null;
                            $this->user->username = $text;
                            $this->user->save();
                            $this->sendMessage($chat_id, "با موفقیت ویرایش شد!", 'MarkDown', $message_id, $edit_button);

                        }
                        break;
                    case  7:
                        if ($this->check('email', $text, $chat_id, $message_id, $return_button)) {
                            $this->user->step = null;
                            $this->user->email = $text;
                            $this->user->save();
                            $this->sendMessage($chat_id, "با موفقیت ویرایش شد!", 'MarkDown', $message_id, $edit_button);

                        }
                        break;
                    case  8:
                        if ($this->check('password', $text, $chat_id, $message_id, $return_button)) {
                            $this->user->password = Hash::make($text);
                            $this->user->step = null;
                            $this->user->save();
                            $this->sendMessage($chat_id, "با موفقیت ویرایش شد!", 'MarkDown', $message_id, $edit_button);
                        }
                        break;
                    //send to users
                    case  90:
//                        if (!in_array($from_id, $this->Dev))
//                    return;
                        $send_or_cancel = json_encode(['inline_keyboard' => [
                            [['text' => "ارسال شود✨", 'callback_data' => "send_to_users_ok$0"]],
                            [['text' => "لغو ارسال⬅", 'callback_data' => "send_cancel"]],
                        ], 'resize_keyboard' => true]);
                        $this->user->step = null;
                        $this->user->save();
                        Storage::put('message.txt', json_encode($message));
                        $this->sendMessage($chat_id, "*از ارسال به کاربران اطمینان دارید؟*", 'MarkDown', $message_id, $send_or_cancel);

                        break;
                    //send to users
                    case  91:
                        $send_or_cancel = json_encode(['inline_keyboard' => [
                            [['text' => "ارسال شود✨", 'callback_data' => "send_to_users_ok$1"]],
                            [['text' => "لغو ارسال⬅", 'callback_data' => "send_cancel"]],
                        ], 'resize_keyboard' => true]);
                        $this->user->step = null;
                        $this->user->save();
                        Storage::put('message.txt', json_encode($message));
                        $this->sendMessage($chat_id, "*از ارسال به کاربران استقلال اطمینان دارید؟*", 'MarkDown', $message_id, $send_or_cancel);

                        break;
                    //send to users
                    case  92:
                        $send_or_cancel = json_encode(['inline_keyboard' => [
                            [['text' => "ارسال شود✨", 'callback_data' => "send_to_users_ok$2"]],
                            [['text' => "لغو ارسال⬅", 'callback_data' => "send_cancel"]],
                        ], 'resize_keyboard' => true]);
                        $this->user->step = null;
                        $this->user->save();
                        Storage::put('message.txt', json_encode($message));
                        $this->sendMessage($chat_id, "*از ارسال به کاربران پرسپولیس اطمینان دارید؟*", 'MarkDown', $message_id, $send_or_cancel);

                        break;
                    //send to users
                    case  93:
                        $send_or_cancel = json_encode(['inline_keyboard' => [
                            [['text' => "ارسال شود✨", 'callback_data' => "send_to_users_ok$3"]],
                            [['text' => "لغو ارسال⬅", 'callback_data' => "send_cancel"]],
                        ], 'resize_keyboard' => true]);
                        $this->user->step = null;
                        $this->user->save();
                        Storage::put('message.txt', json_encode($message));
                        $this->sendMessage($chat_id, "*از ارسال به کاربران بارسا اطمینان دارید؟*", 'MarkDown', $message_id, $send_or_cancel);

                        break;
                    //send to users
                    case  94:
                        $send_or_cancel = json_encode(['inline_keyboard' => [
                            [['text' => "ارسال شود✨", 'callback_data' => "send_to_users_ok$4"]],
                            [['text' => "لغو ارسال⬅", 'callback_data' => "send_cancel"]],
                        ], 'resize_keyboard' => true]);
                        $this->user->step = null;
                        $this->user->save();
                        Storage::put('message.txt', json_encode($message));
                        $this->sendMessage($chat_id, "*از ارسال به کاربران رئال اطمینان دارید؟*", 'MarkDown', $message_id, $send_or_cancel);

                        break;


                    //get banner button link
                    case  10:
                        $cancel_button = json_encode(['keyboard' => [
                            [['text' => "لغو ❌"]],
                        ], 'resize_keyboard' => true]);
                        if ($text && strlen($text) > 1000) {
                            $this->sendMessage($chat_id, "*طول پیام از 1000 حرف کمتر باشد*", 'MarkDown', $message_id, $cancel_button);
                            return;
                        }
                        $this->user->step++;
                        $this->user->save();
                        Storage::put("$from_id.txt", json_encode($message));
                        $this->sendMessage($chat_id, "لینک دکمه را وارد کنید", 'MarkDown', $message_id, $cancel_button);

                        break;
                    //get banner button name
                    case  11:
                        $cancel_button = json_encode(['keyboard' => [
                            [['text' => "لغو ❌"]],
                        ], 'resize_keyboard' => true]);
                        if ($text && strlen($text) > 50) {
                            $this->sendMessage($chat_id, "*طول لینک از 50 حرف کمتر باشد*", 'MarkDown', $message_id, $cancel_button);
                            return;
                        }
                        $this->user->step++;
                        $this->user->save();
                        $txt = Storage::get("$from_id.txt");
                        Storage::put("$from_id.txt", json_encode(['message' => $txt, 'link' => $text]));
                        $this->sendMessage($chat_id, "متن دکمه را وارد کنید", 'MarkDown', $message_id, $cancel_button);

                        break;
                    //send banner
                    case  12:
                        $cancel_button = json_encode(['keyboard' => [
                            [['text' => "لغو ❌"]],
                        ], 'resize_keyboard' => true]);
                        if ($text && strlen($text) > 50) {
                            $this->sendMessage($chat_id, "*متن دکمه از 50 حرف کمتر باشد*", 'MarkDown', $message_id, $cancel_button);
                            return;
                        }
                        $this->user->step = null;
                        $this->user->save();
                        $txt = json_decode(Storage::get("$from_id.txt"));
                        Storage::put("$from_id.txt", json_encode(['message' => $txt->message, 'link' => $txt->link, 'name' => $text,]));
                        $this->sendBanner($from_id, Storage::get("$from_id.txt"));
                        $this->sendMessage($chat_id, "با موفقیت تولید شد!", 'MarkDown', $message_id, $button);


                        break;
                }

            }

        } elseif ($tc == 'channel') {


//            if (preg_match('/^\/?(add|نصب)$/ui', $text, $match)) {
//                if (!$this->Admin($chat_id, $from_id, $tc, $chat_username))
//                    return;
//                if ($chat_username == '@') {
//                    $this->sendMessage($chat_id, "🔹کانال شما باید در حالت  *public* باشد.\n 🔸روی نام کانال کلیک کنید\n 🔸 در تلگرام موبایل از قسمت بالا *آیکن مداد* را انتخاب کنید.\n 🔸در تلگرام دسکتاپ از گزینه سه نقطه بالا گزینه  *Manage Channel* را انتخاب کنید \n\n 🔸 قسمت  *Channel type*  را به حالت *public*  تغییر دهید.\n 🔸سپس یک نام عمومی به کانال خود تخصیص دهید. *ربات کانال شما را توسط این نام شناسایی می کند*. \n 🔼 در صورت داشتن هر گونه سوال به قسمت *درباره ربات* مراجعه نمایید. \n $this->bot ", 'Markdown', $message_id);
//                    return;
//                }
//
//                $this->user = User::where('channels', 'like', "%\"$chat_username\"%")->first();
//                if (!$this->user) {
//                    $this->sendMessage($chat_id, "🔸 ابتدا باید کانال را در ربات ثبت نمایید!\n🔸 *منوی اصلی ⬅ ثبت کانال💥* \n  $this->bot", 'Markdown', $message_id);
//                    return;
//                }
//
//                $this->sendMessage($chat_id, "■ ربات با موفقیت نصب شد !💫\n\n● برای تبلیغ کانال  به قسمت دیوار📈 سپس درج کانال/گروه در دیوار📌 مراجعه کنید\n \n آموزش ربات \n $this->tut_link  * $this->bot *    \n ", 'MarkDown', $message_id, $this->button);
//
//
//            }
        } elseif
        ($tc == 'supergroup' || $tc == 'group') {


//            if (preg_match('/^\/?(add|نصب)$/ui', $text, $match)) {
//
//                if (!$this->Admin($chat_id, $from_id, $tc, $chat_username))
//                    return;
//                if (!$this->Admin($chat_id, $this->bot_id, $tc, $chat_username)) {
//                    $this->sendMessage($chat_id, "🔹*ابتدا ربات را در گروه ادمین کنید و مجدد تلاش نمایید*", 'Markdown', $message_id);
//                    return;
//                }
//                if ($chat_username == '@') {
//                    $this->sendMessage($chat_id, "🔹کانال شما باید در حالت  *public* باشد.\n 🔸روی نام کانال کلیک کنید\n 🔸 در تلگرام موبایل از قسمت بالا *آیکن مداد* را انتخاب کنید.\n 🔸در تلگرام دسکتاپ از گزینه سه نقطه بالا گزینه  *Manage Channel* را انتخاب کنید \n\n 🔸 قسمت  *Channel type*  را به حالت *public*  تغییر دهید.\n 🔸سپس یک نام عمومی به کانال خود تخصیص دهید. *ربات کانال شما را توسط این نام شناسایی می کند*. \n 🔼 در صورت داشتن هر گونه سوال به قسمت *درباره ربات* مراجعه نمایید. \n $this->bot ", 'Markdown', $message_id);
//                    return;
//                }
//                $this->user = User::where('groups', 'like', "%\"$chat_username\"%")->first();
//                if (!$this->user) {
//                    $this->sendMessage($chat_id, "🔸 ابتدا باید گروه را در ربات ثبت نمایید!\n🔸 *منوی اصلی ⬅ ثبت گروه💥* \n  $this->bot", 'Markdown', $message_id);
//                    return;
//                }
//
//                $this->sendMessage($chat_id, "🔷 *ربات با موفقیت نصب شد. اکنون می توانید گروه خود را در دیوار ربات تبلیغ نمایید!* \n \n آموزش ربات \n $this->tut_link  $this->info", 'MarkDown', $message_id, $this->button);
//
//
//            }
            if ($new_chat_member && ($chat_username == "@lamassaba" || $chat_username == "@magnetgramsupport" || $chat_username == "@magnetgramadvs")) {
                $txt = "سلام $first_name\n";
                $link = "https://t.me/" . str_replace("@", "", $this->bot);
                $buttons = [[['text' => '👈 دانلود اپلیکیشن 👉', 'url' => Helper::$app_link]], [['text' => '👈 ورود به ربات 👉', 'url' => $link]]];
                $txt .= " 🔔 " . "📌 نبرد استقلال و پرسپولیس شروع شد! \n توی تیم محبوبت ثبت نام کن و با کمک هم تیمی ها برنده باش \n 🔵استقلال 👑 پرسپولیس🔴" . " \n👇👇👇 لینک ربات و اپلیکیشن 👇👇👇  \n" . "  \n$link \n\n";


                $this->DeleteMessage($chat_id, $message_id);
                $this->sendMessage($chat_id, $txt, null, null, json_encode(['inline_keyboard' => $buttons, 'resize_keyboard' => true]), true);


            }
//            elseif ($new_chat_members) {
//
//            } //
//            elseif ($left_chat_member) {
//
//
//            }
        }
        if ($text == "/start$this->bot") {
            $this->DeleteMessage($chat_id, $message_id);
            $buttons = [[['text' => '👈 ورود به ربات 👉', 'url' => "https://t.me/" . str_replace("@", "", $this->bot)]]];
            $this->sendMessage($chat_id, " $first_name " . "📌 با این ربات توی تیم محبوبت ثبت نام کن و اپلیکیشن تیمت رو دانلود کن و با کمک هم تیمی ها برنده باش \n 🔵استقلال 👑 پرسپولیس🔴", "Markdown", null, json_encode(['inline_keyboard' => $buttons, 'resize_keyboard' => true]), true);

        }
        if ($text == 'بنر' || $Data == 'بنر' || $text == "📌 دریافت بنر دعوت 📌") {
            $this->user = User::where('telegram_id', $from_id)->first();
            if (!$this->user) {
                $this->sendMessage($chat_id, "برای دریافت بنر ابتدا در ربات ثبت نام کنید\n $this->bot", null, $message_id, null);
                return;
            }
            if ($tc == 'private') {
                $this->sendMessage($from_id, "بنر زیر را فوروارد کنید و در صورت ثبت نام افراد دعوت شده, $this->ref_score امتیاز دریافت نمایید. ", "Markdown", null, null, true);

            }
            $ref_link = "https://t.me/" . str_replace("@", "", $this->bot) . "?start=" . base64_encode("$from_id");
            $buttons = [[['text' => '👈 دانلود اپلیکیشن 👉', 'url' => Helper::$app_link]], [['text' => '👈 ورود به ربات 👉', 'url' => $ref_link]]];
            $this->sendMessage($chat_id, " 🔔 " . "📌 نبرد استقلال و پرسپولیس شروع شد! \n توی تیم محبوبت ثبت نام کن و با کمک هم تیمی ها برنده باش \n 🔵استقلال 👑 پرسپولیس🔴" . " \n👇👇👇 لینک ربات و اپلیکیشن 👇👇👇  \n" . "  \n$ref_link \n\n" . "$this->bot", null, null, json_encode(['inline_keyboard' => $buttons, 'resize_keyboard' => true]), false);

        }
        //referral
        if ((strpos($text, "/start ") !== false)) { // agar ebarate /start ersal shod
            $this->user = User::where('telegram_id', $from_id)->first();
            $button = json_encode(['keyboard' => [
                in_array($from_id, $this->Dev) ? [['text' => 'پنل مدیران🚧']] : [],

                [['text' => "📱 دریافت اپلیکیشن 📱"]],
                [['text' => "🎴 ساخت دکمه شیشه ای 🎴"]],
                [['text' => "📌 دریافت بنر دعوت 📌"]],
                [['text' => 'امتیاز من💰']],
                [['text' => $this->user ? "ویرایش اطلاعات✏" : "ثبت نام✅"]],
                [['text' => "🙏🙏🙏🙏 حمایت از ما 🙏🙏🙏🙏", 'url' => Helper::$donateLink]],
                [['text' => 'درباره ربات🤖']],
            ], 'resize_keyboard' => true]);

            if ($this->user) $this->sendMessage($chat_id, "■ سلام $first_name خوش آمدید✋\n\n■ چه کاری براتون انجام بدم؟ ", null, $message_id, $button);
            else $this->sendMessage($chat_id, "■ سلام $first_name خوش آمدید✋  ", null, $message_id, $button);
            $this->sendMessage($chat_id, " 🔔 " . "📌 با این ربات توی تیم محبوبت ثبت نام کن و اپلیکیشن تیمت رو دانلود کن و با کمک هم تیمی ها برنده باش \n 🔵استقلال 👑 پرسپولیس🔴" . " \n👇👇👇 لینک ربات و اپلیکیشن 👇👇👇  \n" . " \n" . "$this->bot", null, null, $button, false);

            foreach ($this->logs as $log)
                $this->sendMessage($log, "■  کاربر [$first_name](tg://user?id=$from_id) ربات هم سیگنال را استارت کرد.", 'MarkDown');
            $inviter_code = substr($text, 7); // joda kardan id kasi ke rooye linke davatesh click shode

            if (!empty($inviter_code)) {
                $telegram_id = base64_decode($inviter_code);


                Invites::updateOrCreate(['new_telegram_id' => $from_id], ['new_telegram_id' => $from_id, 'invited_by' => "$telegram_id"]);
                $this->sendMessage($telegram_id, "\n🔔\nهم اکنون" . " [$first_name](tg://user?id=$from_id)  " . " با لینک دعوت شما وارد ربات شد. در صورت ثبت نام$this->ref_score امتیاز به شما اضافه خواهد شد   ", "Markdown", null, null, false);

            }

        }
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
//        unlink("error_log");
    }


    private
    function popupMessage2($data_id, $from_id, $message)
    {
        return $this->creator('CallbackQuery', [
            'id' => $data_id,
            'from' => $from_id,
            'message' => $message,

        ]);
    }

    private
    function popupMessage($data_id, $text)
    {
        return $this->creator('answerCallbackQuery', [
            'callback_query_id' => $data_id,
            'text' => $text,

            'show_alert' => true, # popup / notification
            'url' => null,# t.me/your_bot?start=XXXX,
            'cache_time' => null
        ]);
    }

    function sendMessage($chat_id, $text, $mode, $reply = null, $keyboard = null, $disable_notification = false)
    {
        return $this->creator('sendMessage', [
            'chat_id' => $chat_id,
            'text' => $text,
            'parse_mode' => $mode,
            'reply_to_message_id' => $reply,
            'reply_markup' => $keyboard,
            'disable_notification' => $disable_notification,
        ]);
    }


    function creator($method, $datas = [])
    {
        $url = "https://api.telegram.org/bot" . API_KEY . "/" . $method;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $datas);
        $res = curl_exec($ch);

        if (curl_error($ch)) {
            var_dump(curl_error($ch));
        } else {
            return json_decode($res);
        }
    }

    private
    function inviteToChat($chat_id)
    {

        return $this->creator('exportChatInviteLink', ['chat_id' => $chat_id,]);

    }

    private
    function getChatMembersCount($chat_id)
    {
        $res = $this->creator('getChatMembersCount', ['chat_id' => $chat_id,])->result;
        if ($res)
            return (int)$res; else return 0;
    }

    private
    function getChatInfo($chat_id)
    {
        return $this->creator('getChat', ['chat_id' => $chat_id]);
    }

    private
    function Admin($chat_id, $from_id, $chat_type, $chat_username)
    {
        if ($chat_type == 'supergroup' || $chat_type == 'group') {
            $get = $this->creator('getChatMember', ['chat_id' => $chat_id, 'user_id' => $from_id]);
            $rank = $get->result->status;

            if ($rank == 'creator' || $rank == 'administrator') {
                return true;
            } else {
//                $this->sendMessage($chat_id, "■  کاربر غیر مجاز \n $this->bot  ", 'MarkDown', null);
                return false;
            }
        } else if ($chat_type == 'channel') {
            return true;
//            $admins = $this->creator('getChatAdministrators', ['chat_id' => $chat_id])->result;
//            $is_admin = false;
//
//            foreach ($admins as $admin) {
//                if ($from_id == $admin->user->id) {
//                    $is_admin = true;
//                }
//            }
//            return $from_id;

//            $this->user = User::whereIn('telegram_id', $admin_ids)->orWhere('channels', 'like', "%[$chat_username,%")
//                ->orWhere('channels', 'like', "%,$chat_username,%")
//                ->orWhere('channels', 'like', "%,$chat_username]%")->first();
//            if (!User::orWhere('channels', 'like', "%[$chat_username,%")
//                ->orWhere('channels', 'like', "%,$chat_username,%")
//                ->orWhere('channels', 'like', "%,$chat_username]%")->exists())
//                $this->sendMessage($chat_id, "■ ابتدا کانال را در ربات ثبت نمایید  \n📣$this->bot  ", 'MarkDown', null);


//            return $this->user ? true : false;
        }
    }

    private
    function get_chat_type($chat_id)
    {

        return $this->creator('getChat', [
            'chat_id' => $chat_id,

        ])->result->type;
    }

    private
    function user_in_chat($chat_id, $user_id, $chat_type = null)
    {
        return $this->creator('getChatMember', [
            'chat_id' => $chat_id,
            'user_id' => $user_id
        ])->result->status;
    }

    private
    function EditMessageText($chat_id, $message_id, $text, $mode = null, $keyboard = null)
    {
        $this->creator('EditMessageText', [
            'chat_id' => $chat_id,
            'message_id' => $message_id,
            'text' => $text,
            'parse_mode' => $mode,
            'reply_markup' => $keyboard
        ]);
    }

    private
    function EditKeyboard($chat_id, $message_id, $keyboard)
    {
        $this->creator('EditMessageReplyMarkup', [
            'chat_id' => $chat_id,
            'message_id' => $message_id,
            'reply_markup' => $keyboard
        ]);
    }

    private
    function DeleteMessage($chatid, $massege_id)
    {
        $this->creator('DeleteMessage', [
            'chat_id' => $chatid,
            'message_id' => $massege_id
        ]);
    }

    private
    function Kick($chatid, $fromid)
    {
        $this->creator('KickChatMember', [
            'chat_id' => $chatid,
            'user_id' => $fromid
        ]);
    }

    private
    function Forward($chatid, $from_id, $massege_id)
    {
        $this->creator('ForwardMessage', [
            'chat_id' => $chatid,
            'from_chat_id' => $from_id,
            'message_id' => $massege_id
        ]);
    }

    function MarkDown($string)
    {
        return str_replace(["`", "_", "*", "[", "]"], "\t", $string);
    }


    private
    function check($what, $text, $chat_id, $message_id, $cancel_button)
    {
        $message = null;
        if ($what == 'username') {
            if (strlen($text) < 6)
                $message = "نام کاربری  حداقل  ۶ حرف باشد";
            elseif (strlen($text) > 50)
                $message = "نام کاربری  حداکثر 50 حرف باشد";
            else if (!preg_match('/^[\w]+$/', $text))
                $message = "نام کاربری فقط شامل حروف و اعداد انگلیسی و بدون فاصله باشد";
            elseif (User::where("username", $text)->exists())
                $message = "نام کاربری تکراری است";
        } else if ($what == 'password') {
            if (strlen($text) < 6)
                $message = "طول گذرواژه حداقل ۶";
            elseif (strlen($text) > 50)
                $message = "طول گذرواژه حداکثر 50";

        } else if ($what == 'email') {

            if (!filter_var($text, FILTER_VALIDATE_EMAIL))
                $message = "ایمیل نامعتبر است";

            else if (User::where('email', $text)->exists())
                $message = "این ایمیل از قبل ثبت شده است!";


        } else if ($what == 'app_id') {

            if (!in_array($text, [1, 2]))
                $message = "شماره تیم نامعتبر است";


        }

        if ($message) {
            $this->sendMessage($chat_id, $message, 'MarkDown', $message_id, $cancel_button);
            return false;
        } else {
            return true;
        }

    }

    public
    function request($request)
    {


        $http = new \GuzzleHttp\Client(['base_uri' => $request['url'],
        ]);

        try {
            $response = $http->post(/*route('passport.token'*/
                ''
                , [

                'headers' => ['cache-control' => 'no-cache',
                    'Content-Type' => 'application/x-www-form-urlencoded'
                ],
                'form_params' => $request['params']
            ]);

            return json_decode($response->getBody()->getContents(), true)["result"]["status"];
        } catch (\Guzzlehttp\Exception\BadResponseException $e) {
            if ($e->getCode() == 400) {
                return json_decode($e->getResponse()->getBody()->getContents(), true)["description"];
            } else if ($e->getCode() == 401) {
                return response()->json($e->getMessage(), $e->getCode());
            }
            return response()->json($e->getMessage(), $e->getCode());

        }
    }

    private
    function sendFile($chat_id, $storage, $reply = null)
    {


        $message = json_decode($storage);
        $poll = $message->poll;
        $text = $message->text;
        $sticker = $message->sticker;  #width,height,emoji,set_name,is_animated,file_id,file_unique_id,file_size,thumb[file_id,file_unique_id,file_size,width,
        $animation = $message->animation;  #file_name,mime_type,width,height,file_id,file_unique_id,file_size,thumb[file_id,file_unique_id,file_size,width,

        $photo = $message->photo; #[file_id,file_unique_id,file_size,width,height] array of different photo sizes
        $document = $message->document; #file_name,mime_type,thumb[file_id,file_unique_id,file_size,width,height]
        $video = $message->video; #duration,width,height,mime_type,file_id,file_unique_id,file_size,thumb[file_id,file_unique_id,file_size,width,height]
        $audio = $message->audio; #duration,mime_type,title,performer,file_id,file_unique_id,file_size,thumb[file_id,file_unique_id,file_size,width,height]
        $voice = $message->voice; #duration,mime_type,file_id,file_unique_id,file_size
        $video_note = $message->video_note; #duration,length,file_id,file_unique_id,file_size,thumb[file_id,file_unique_id,file_size,width,height]
        $caption = $message->caption;

        if ($text) {
            $adv_section = explode('banner=', $text); //banner=name=@id
            $text = $adv_section[0];
        } else if ($caption) {
            $adv_section = explode('banner=', $caption);
            $caption = $adv_section[0];
        }
        if (count($adv_section) == 2) {

            $link = explode('=', $adv_section[1]);
            $trueLink = $link[1];
            foreach ($link as $idx => $li) {
                if ($idx > 1)
                    $trueLink .= ('=' . $li);
            }
            $buttons = [[['text' => "👈 $link[0] 👉", 'url' => $trueLink]], [['text' => '👈 محل تبلیغ کانال و گروه شما 👉', 'url' => "https://t.me/" . str_replace("@", "", $this->bot)]]];
        } else {
//            if ($text) $text = $text ;  //. "\n\n" . $this->bot;
//            else if ($caption) $caption = $caption . "\n\n" . $this->bot;
            $buttons = [[['text' => '👈 محل تبلیغ کانال و گروه شما 👉', 'url' => "https://t.me/" . str_replace("@", "", $this->bot)]]];
        }
        $keyboard = json_encode(['inline_keyboard' => $buttons, 'resize_keyboard' => true]);

        if ($text)
            $this->creator('SendMessage', [
                'chat_id' => $chat_id,
                'text' => $text, //. "\n $this->bot",
                'parse_mode' => 'Markdown',
                'reply_to_message_id' => $reply,
                'reply_markup' => $keyboard
            ]);
        else if ($photo)
            $this->creator('sendPhoto', [
                'chat_id' => $chat_id,
                'photo' => $photo[count($photo) - 1]->file_id,
                'caption' => $caption,
                'parse_mode' => 'Markdown',
                'reply_to_message_id' => $reply,
                'reply_markup' => $keyboard
            ]);
        else if ($audio)
            $this->creator('sendAudio', [
                'chat_id' => $chat_id,
                'audio' => $audio->file_id,
                'caption' => $caption,
                'parse_mode' => 'Markdown',
                'duration' => $audio->duration,
                'performer' => $audio->performer,
                'title' => $audio->title,
                'thumb' => $audio->thumb,
                'reply_to_message_id' => $reply,
                'reply_markup' => $keyboard
            ]);
        else if ($document)
            $this->creator('sendDocument', [
                'chat_id' => $chat_id,
                'document' => $document->file_id,
                'caption' => $caption,
                'parse_mode' => 'Markdown',
                'thumb' => $document->thumb,
                'reply_to_message_id' => $reply,
                'reply_markup' => $keyboard
            ]);
        else if ($video)
            $this->creator('sendVideo', [
                'chat_id' => $chat_id,
                'video' => $video->file_id,
                'duration' => $video->duration,
                'width' => $video->width,
                'height' => $video->height,
                'caption' => $caption,
                'parse_mode' => 'Markdown',
                'thumb' => $video->thumb,
                'reply_to_message_id' => $reply,
                'reply_markup' => $keyboard
            ]);
        else if ($animation)
            $this->creator('sendAnimation', [
                'chat_id' => $chat_id,
                'animation' => $animation->file_id,
                'duration' => $animation->duration,
                'width' => $animation->width,
                'height' => $animation->height,
                'caption' => $caption,
                'parse_mode' => 'Markdown',
                'thumb' => $animation->thumb,
                'reply_to_message_id' => $reply,
                'reply_markup' => $keyboard
            ]);
        else if ($voice)
            $this->creator('sendVoice', [
                'chat_id' => $chat_id,
                'voice' => $voice->file_id,
                'duration' => $voice->duration,
                'caption' => $caption,
                'parse_mode' => 'Markdown',
                'reply_to_message_id' => $reply,
                'reply_markup' => $keyboard
            ]);
        else if ($video_note)
            $this->creator('sendVideoNote', [
                'chat_id' => $chat_id,
                'video_note' => $video_note->file_id,
                'duration' => $video_note->duration,
                'length' => $video_note->length,
                'thumb' => $video_note->thumb,
                'caption' => $caption,
                'parse_mode' => 'Markdown',
                'reply_to_message_id' => $reply,
                'reply_markup' => $keyboard
            ]);
        else if ($sticker)
            $this->creator('sendSticker', [
                'chat_id' => $chat_id,
                'sticker' => $sticker->file_id,
                "set_name" => "DaisyRomashka",
                'reply_to_message_id' => $reply,
                'reply_markup' => $keyboard
            ]);
        else if ($poll)
            $this->creator('sendPoll', [
                'chat_id' => $chat_id,
                'question' => "",
                'options' => json_encode(["1", "2", "3"]),
                'type' => "regular",//quiz
                'allows_multiple_answers' => false,
                'correct_option_id' => 0, // index of correct answer for quiz
//            'open_period' => 5-600,   this or close_date
//            'close_date' => 5, 5 - 600,
                'reply_to_message_id' => $reply,
                'reply_markup' => $keyboard
            ]);
    }

    private
    function sendBanner($chat_id, $storage)
    {


        $storage = json_decode($storage);
        $message = json_decode($storage->message);
        $link = $storage->link;
        $name = $storage->name;
        $poll = $message->poll;
        $text = $message->text;
        $sticker = $message->sticker;  #width,height,emoji,set_name,is_animated,file_id,file_unique_id,file_size,thumb[file_id,file_unique_id,file_size,width,
        $animation = $message->animation;  #file_name,mime_type,width,height,file_id,file_unique_id,file_size,thumb[file_id,file_unique_id,file_size,width,

        $photo = $message->photo; #[file_id,file_unique_id,file_size,width,height] array of different photo sizes
        $document = $message->document; #file_name,mime_type,thumb[file_id,file_unique_id,file_size,width,height]
        $video = $message->video; #duration,width,height,mime_type,file_id,file_unique_id,file_size,thumb[file_id,file_unique_id,file_size,width,height]
        $audio = $message->audio; #duration,mime_type,title,performer,file_id,file_unique_id,file_size,thumb[file_id,file_unique_id,file_size,width,height]
        $voice = $message->voice; #duration,mime_type,file_id,file_unique_id,file_size
        $video_note = $message->video_note; #duration,length,file_id,file_unique_id,file_size,thumb[file_id,file_unique_id,file_size,width,height]
        $caption = $message->caption . "\n $this->bot";


        $buttons = [[['text' => "👈 $name 👉", 'url' => $link]]];

        $keyboard = json_encode(['inline_keyboard' => $buttons, 'resize_keyboard' => true]);
        Storage::put("log.txt", $text);

        if ($text)
            $this->creator('SendMessage', [
                'chat_id' => $chat_id,
                'text' => $text . "\n $this->bot",
                'parse_mode' => 'Markdown',
                'reply_to_message_id' => null,
                'reply_markup' => $keyboard
            ]);
        else if ($photo)
            $this->creator('sendPhoto', [
                'chat_id' => $chat_id,
                'photo' => $photo[count($photo) - 1]->file_id,
                'caption' => $caption,
                'parse_mode' => 'Markdown',
                'reply_to_message_id' => null,
                'reply_markup' => $keyboard
            ]);
        else if ($audio)
            $this->creator('sendAudio', [
                'chat_id' => $chat_id,
                'audio' => $audio->file_id,
                'caption' => $caption,
                'parse_mode' => 'Markdown',
                'duration' => $audio->duration,
                'performer' => $audio->performer,
                'title' => $audio->title,
                'thumb' => $audio->thumb,
                'reply_to_message_id' => null,
                'reply_markup' => $keyboard
            ]);
        else if ($document)
            $this->creator('sendDocument', [
                'chat_id' => $chat_id,
                'document' => $document->file_id,
                'caption' => $caption,
                'parse_mode' => 'Markdown',
                'thumb' => $document->thumb,
                'reply_to_message_id' => null,
                'reply_markup' => $keyboard
            ]);
        else if ($video)
            $this->creator('sendVideo', [
                'chat_id' => $chat_id,
                'video' => $video->file_id,
                'duration' => $video->duration,
                'width' => $video->width,
                'height' => $video->height,
                'caption' => $caption,
                'parse_mode' => 'Markdown',
                'thumb' => $video->thumb,
                'reply_to_message_id' => null,
                'reply_markup' => $keyboard
            ]);
        else if ($animation)
            $this->creator('sendAnimation', [
                'chat_id' => $chat_id,
                'animation' => $animation->file_id,
                'duration' => $animation->duration,
                'width' => $animation->width,
                'height' => $animation->height,
                'caption' => $caption,
                'parse_mode' => 'Markdown',
                'thumb' => $animation->thumb,
                'reply_to_message_id' => null,
                'reply_markup' => $keyboard
            ]);
        else if ($voice)
            $this->creator('sendVoice', [
                'chat_id' => $chat_id,
                'voice' => $voice->file_id,
                'duration' => $voice->duration,
                'caption' => $caption,
                'parse_mode' => 'Markdown',
                'reply_to_message_id' => null,
                'reply_markup' => $keyboard
            ]);
        else if ($video_note)
            $this->creator('sendVideoNote', [
                'chat_id' => $chat_id,
                'video_note' => $video_note->file_id,
                'duration' => $video_note->duration,
                'length' => $video_note->length,
                'thumb' => $video_note->thumb,
                'caption' => $caption,
                'parse_mode' => 'Markdown',
                'reply_to_message_id' => null,
                'reply_markup' => $keyboard
            ]);
        else if ($sticker)
            $this->creator('sendSticker', [
                'chat_id' => $chat_id,
                'sticker' => $sticker->file_id,
                "set_name" => "DaisyRomashka",
                'reply_to_message_id' => null,
                'reply_markup' => $keyboard
            ]);
        else if ($poll)
            $this->creator('sendPoll', [
                'chat_id' => $chat_id,
                'question' => "",
                'options' => json_encode(["1", "2", "3"]),
                'type' => "regular",//quiz
                'allows_multiple_answers' => false,
                'correct_option_id' => 0, // index of correct answer for quiz
//            'open_period' => 5-600,   this or close_date
//            'close_date' => 5, 5 - 600,
                'reply_to_message_id' => null,
                'reply_markup' => $keyboard
            ]);

//        Storage::delete("$chat_id.txt");
    }

    private
    function createChatImage($photo, $chat_id)
    {
        if (!isset($photo) || !isset($photo->big_file_id)) return;
        $client = new \GuzzleHttp\Client();
        $res = $this->creator('getFile', [
            'file_id' => $photo->big_file_id,

        ])->result->file_path;

        $image = "https://api.telegram.org/file/bot" . env('TELEGRAM_BOT_TOKEN', 'YOUR-BOT-TOKEN') . "/" . $res;
        Storage::put("public/chats/$chat_id.jpg", $client->get($image)->getBody());

    }

    private
    function createUserImage($user_id)
    {

        $client = new \GuzzleHttp\Client();
        $res = $this->creator('getUserProfilePhotos', [
            'user_id' => $user_id,

        ])->result->photos;
        // return json_encode($res);
        if (!isset($res) || count($res) == 0) return;
        $res = $this->creator('getFile', [
            'file_id' => $res[0][count($res[0]) - 1]->file_id,

        ])->result->file_path;

        $image = "https://api.telegram.org/file/bot" . env('TELEGRAM_BOT_TOKEN', 'YOUR-BOT-TOKEN') . "/" . $res;
        Storage::put("public/users/$user_id.jpg", $client->get($image)->getBody());

    }

}
