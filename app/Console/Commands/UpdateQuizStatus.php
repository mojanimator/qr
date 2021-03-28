<?php

namespace App\Console\Commands;

use App\Event;
use App\Follow;
use App\Info;
use App\Order;
use App\Quiz;
use App\Response;
use App\User;
use Carbon\Carbon;
use function foo\func;
use Helper;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Lang;
use Morilog\Jalali\Jalalian;

class UpdateQuizStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'check predict questions finished and update result';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
//        date_default_timezone_set('Asia/Tehran');
        error_reporting(1);
        set_time_limit(0);
        header("HTTP/1.0 200 OK");
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $now = Carbon::now();

        $txt = \Morilog\Jalali\CalendarUtils::strftime('Y/m/d | H:i') . '👉 گزارش بروزرسانی سرور ' . PHP_EOL;
        $txt .= "-------------------" . PHP_EOL;
        $txt .= '🙌 پاکسازی سوالات تاریخ گذشته' . PHP_EOL;
        $counts = Quiz::where('expires_at', '<', $now)->where('is_predict', false)->delete();
        $txt .= ' تعداد: ' . $counts . PHP_EOL;
        $txt .= "-------------------" . PHP_EOL;


        $txt .= "🙌 محاسبه نتایج سوالات پیش بینی تاریخ گذشته" . PHP_EOL;
        $quizzes = Quiz::where('expires_at', '<', $now)->where('is_predict', true)->where('response', '!=', null)->get();
        $txt .= " تعداد : " . count($quizzes) . PHP_EOL;
        foreach (Helper::$logs as $log)
            Helper::sendMessage($log, $txt, null, null, null);
        $txt = '';
        foreach ($quizzes as $idx => $quiz) {
            $qt = 0;
            $all = 0;
            $txt .= (' 💬 ' . $quiz->question . PHP_EOL);

            foreach (Response::where('quiz_id', $quiz->id)->get() as $idxx => $response) {
                $all++;
                if ($response->response == $quiz->response) {
                    $qt++;
                    $user = User::where('id', $response->user_id)->first();
                    $user->score = $user->score + $quiz->score;
                    $user->save();
                    Info::where('app_id', $user->app_id)->where('name', 'trues')->increment('value');

                    $msg = Lang::get($user->app_id, Lang::CORRECT_PREDICT_CONGRATULATION) . PHP_EOL;
                    $msg .= (Lang::get($user->app_id, Lang::NOW_SCORE) . $user->score);

                    Helper::sendMessage($user->telegram_id, $msg, null, null, null);

                }
                $response->delete();
            }
            $txt .= " درست: $qt " . " *** " . " همه : $all " . PHP_EOL;

            $quiz->delete();
            $txt .= PHP_EOL;
            $txt .= "----------✅---------" . PHP_EOL;
        }
        foreach (Helper::$logs as $log)
            Helper::sendMessage($log, $txt, null, null, null);

//**************** auto create new predicts from events
        date_default_timezone_set('utc');
        set_time_limit(600);
        //find apps that not have predict question now
        Event::where('start_time', '<', Carbon::now())->delete();
        $ids = Quiz::where('is_predict', true)->distinct('app_id')->pluck('app_id')->toArray();

        $notExistsIds = [];
        foreach (getApps() as $app) {
            if (!in_array($app['id'], $ids))
                $notExistsIds[] = $app['id'];
        }


        //create quiz from not created ids (1,2 have farsi questions)
        foreach ($notExistsIds as $id) {
            //select near upcoming events for each app id
            $event = Event::where('app_id', $id)->where('type', 1)->orderBy('start_time', 'ASC')->first();

            if (!$event)
                continue;

            //create question
            if (!in_array($event->app_id, [1, 2])) { //english questions
                $startTime = Carbon::createFromTimestamp($event->start_time);
                $question = DB::table('questions')->where('id', 2)->get();
                $questions = DB::table('questions')->where('id', '!=', 2)->whereNotIn('app_id', [1, 2])->inRandomOrder()->take(4)->get();
            } else {

                $startTime = Jalalian::forge($event->start_time, new \DateTimeZone('Asia/Tehran'));
                $startTime = str_replace(':00', '', $startTime);
                $question = DB::table('questions')->where('id', 1)->get();
                $questions = DB::table('questions')->where('id', '!=', 1)->whereIn('app_id', [1, 2])->inRandomOrder()->take(4)->get();
            }
//fill questions with teams(*1* *2*) and time($)

            foreach ($questions->merge($question) as $q) {


                $teams = explode('$', $event->message);
                $question = str_replace('*1*', $teams[0], $q->question);
                $question = str_replace('*2*', $teams[1], $question);
                $question = str_replace('$', str_replace('-', '/', str_replace(' ', ' ⏰ ', $startTime)), $question);
                $options = str_replace('*1*', $teams[0], explode('$', $q->options));
                $options = str_replace('*2*', $teams[1], $options);
                $score = $q->score;
                $is_predict = true;
                $type_id = 1;
                $app_id = $event->app_id;
                $response = null;
                $shows_at = null;
                $expires_at = in_array($event->app_id, [1, 2]) ? Carbon::createFromTimestamp($event->start_time, 'utc') : $startTime;


                $quiz = Quiz::create(['question' => $question, 'is_predict' => $is_predict, 'score' => $score,
                    'response' => $response, 'type_id' => $type_id, 'app_id' => $app_id,
                    'options' => $options, 'expires_at' => $expires_at, 'shows_at' => $shows_at, 'created_at' => Carbon::now(),]);

//
                Info::where('app_id', $app_id)->where('name', 'questions')->increment('value');


                $this->user = auth()->user();

                $username = $this->user ? $this->user->telegram_username : "System";
                $q = $quiz->question;
                foreach (Helper::$logs as $log)
                    Helper::sendMessage($log, " ادمین $username" . " یک سوال اضافه کرد " . PHP_EOL .
                        $q, null, null, null);
            }

//            $event->delete();
        }


        //send quiz messages
        sleep(1);
        $i = 0;
        $j = 0;

        foreach (Quiz::where('is_predict', true)->where('created_at', '>', Carbon::now()->subMinutes(2))->get() as $q) {
            if (strpos($q->question, 'نتیجه') === false && strpos($q->question, 'Result') === false)
                continue;

            $j++; //cant send upper 4 to one user
            if ($j > 3) {
                Helper::sendPush($q->app_id, null, $q->question);
                break;
            }

            // sleep(rand(1, 2));


            foreach (User::where('app_id', $q->app_id)->whereNotNull('telegram_id')->where('telegram_id', 'not like', "c%")->inRandomOrder()->take(80)->pluck('telegram_id') as $id) {
                $i++;
                // if ($i > 25) {
                //     $i = 0;
                //     sleep(30);
                // }
                Helper::sendMessage($id, \Lang::get($q->app_id, \Lang::NEW_QUIZ) . "\n$q->question", null, null, null, true, in_array($q->app_id, [1, 2]) ? null : 'en');
//                Helper::sendMessage(Helper::$logs[0], \Lang::get($app_id, \Lang::NEW_QUIZ) . "\n$q", null, null, null, true, in_array($app_id, [1, 2]) ? null : 'en');
            }
        }

        //send match time poll to channels
        $inline_k = json_encode(['inline_keyboard' => [
            [['text' => "📪 ارتباط با ما 📪", 'url' => "telegram.me/" . 'develowper']],
            [['text' => "📌 دانلود اپلیکیشن 📌", 'url' => "telegram.me/" . 'vartastudiobot']],
        ], 'resize_keyboard' => true]);
        foreach (Quiz::where('is_predict', true)->whereIn('app_id', [1, 2])->where('created_at', '>', Carbon::now()->subMinutes(2))->get() as $q) {
            if (strpos($q->question, 'نتیجه') !== false) {
                $txt = "⭐⭐⭐\n" . $q->question . PHP_EOL . '⭐این سوال رو داخل اپلیکیشن هم جواب بده و ستاره بگیر.با ستاره هات میتونی عکس های داخل برنامه رو بگیری!' . PHP_EOL . '@vartastudiobot';
                $q->options = json_encode($q->options);
                Helper::sendPoll('@vartastudio', $txt, $q->options, false, 'regular', false, null, null, true, $inline_k);
                sleep(1);
                Helper::sendPoll('@lamassaba', $txt, $q->options, false, 'regular', false, null, null, true, $inline_k);

                if ($q->app_id == 1)
                    Helper::sendPoll('@esteghlalwallpapers', $txt . PHP_EOL . "💙💙💙" . PHP_EOL, $q->options, true, 'regular', false, null, null, false, $inline_k);

                if ($q->app_id == 2)
                    Helper::sendPoll('@perspoliswallpapers', $txt . PHP_EOL . "💗💗💗" . PHP_EOL, $q->options, true, 'regular', false, null, null, false, $inline_k);

            }
        }


        //notify enter quiz results

        foreach (Quiz::where('expires_at', '<', Carbon::now()->subHours(2))->where('is_predict', true)->where('response', null)->get() as $item) {
            foreach (Helper::$logs as $log)
                Helper::sendMessage($log, "💬 نتیجه پیش بینی  ثبت نشده است" . PHP_EOL .
                    $item->question, null, null, null);
        }

        //notify add event for app
        $appIds = [];
        foreach (getApps() as $app)
            $appIds[] = $app['id'];

        $eAppIds = Event::distinct('app_id')->pluck('app_id')->toArray();
        foreach ($appIds as $ai) {
            if (!in_array($ai, $eAppIds))
                foreach (Helper::$logs as $log)
                    Helper::sendMessage($log, "💬 برای اپ $ai رویداد ثبت نشده است"
                        , null, null, null);
        }


        //punish left members
        foreach (Order::get() as $order)
            foreach (Follow::where('order_id', $order->id)->get() as $f) {
                $rank = Helper::creator('getChatMember', [
                    'chat_id' => "@" . $f->chat_username,
                    'user_id' => $f->telegram_id
                ])->result->status;
                Helper::sendMessage(Helper::$logs[0], $rank
                    , "MarkDown", null, null);
                if ($rank != 'creator' && $rank != 'administrator' && $rank != 'member') {
                    $chat_username = "@" . $f->chat_username;
                    $punish = $order->follow_score * 2;
                    $user = User::where('telegram_id', $f->telegram_id)->first();
                    if ($user)
                        $user->decrement('score', $punish);
                    $order->decrement('follow_now');
                    $f->delete();
                    Helper::sendMessage($f->telegram_id, "🚨" . PHP_EOL . "متاسفانه به علت لفت دادن از $chat_username تعداد $punish ستاره جریمه شدی 😰" . PHP_EOL . "ولی میتونی با زدن دکمه جوایز در ربات بازم ستاره جمع کنی 😉"
                        , null, null, null);
                    Helper::sendMessage(Helper::$logs[0], "🚨" . PHP_EOL . "کاربر [$f->telegram_id](tg://user?id= $f->telegram_id) از $chat_username لفت داد و $punish امتیاز جریمه شد"
                        , "MarkDown", null, null);
                }
            }

        set_time_limit(30);
    }
}
