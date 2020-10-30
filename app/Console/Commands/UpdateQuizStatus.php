<?php

namespace App\Console\Commands;

use App\Info;
use App\Quiz;
use App\Response;
use App\User;
use Carbon\Carbon;
use Helper;
use Illuminate\Console\Command;
use Lang;

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
        date_default_timezone_set('Asia/Tehran');
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


    }
}
