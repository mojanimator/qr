<?php

namespace App\Console\Commands;

use App\Info;
use App\Quiz;
use App\User;
use Carbon\Carbon;
use Helper;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DailyReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send:report';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send Daily Admin Report To Bot';

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
        $txt = \Morilog\Jalali\CalendarUtils::strftime('Y/m/d | H:i') . ' گزارش کار ادمین ها تا این لحظه ';
        $txt .= PHP_EOL;
        $txt .= "-------------------" . PHP_EOL;
        $txt .= "تعداد سوالات در دسترس" . PHP_EOL;
        $now = Carbon::now();
        $txt .= Quiz::where(function ($query) use ($now) {
                $query->where('shows_at', '<', $now)
                    ->orWhereNull('shows_at');
            })->where(function ($query) use ($now) {
                $query->where('expires_at', '>', $now)
                    ->orWhereNull('expires_at');
            })->count() . PHP_EOL;
        $txt .= "-------------------" . PHP_EOL;
        $txt .= "تعداد کاربران استقلال" . PHP_EOL;
        $txt .= User::where('app_id', 1)->count() . PHP_EOL;
        $txt .= "-------------------" . PHP_EOL;
        $txt .= "تعداد کاربران پرسپولیس" . PHP_EOL;
        $txt .= User::where('app_id', 2)->count() . PHP_EOL;
        $txt .= "-------------------" . PHP_EOL;
        $txt .= "تعداد کاربران PSG" . PHP_EOL;
        $txt .= User::where('app_id', 5)->count() . PHP_EOL;
        $txt .= "-------------------" . PHP_EOL;
        $txt .= "تعداد کاربران بارسا" . PHP_EOL;
        $txt .= User::where('app_id', 3)->count() . PHP_EOL;
        $txt .= "-------------------" . PHP_EOL;
        $txt .= "تعداد کاربران میلان" . PHP_EOL;
        $txt .= User::where('app_id', 6)->count() . PHP_EOL;
        $txt .= "-------------------" . PHP_EOL;
        $txt .= "تعداد کاربران یونتوس" . PHP_EOL;
        $txt .= User::where('app_id', 8)->count() . PHP_EOL;
        $txt .= "-------------------" . PHP_EOL;
        $txt .= "تعداد کاربران لیورپول" . PHP_EOL;
        $txt .= User::where('app_id', 9)->count() . PHP_EOL;
        $txt .= "-------------------" . PHP_EOL;
        $txt .= "تعداد کاربران فورتنایت" . PHP_EOL;
        $txt .= User::where('app_id', 12)->count() . PHP_EOL;
        $txt .= "-------------------" . PHP_EOL;
//        $txt .= "✨استقلال" . PHP_EOL;
//        $txt .= '  سوال ' . Info::where('app_id', 1)->where('name', 'questions')->first()->value . PHP_EOL;
//        $txt .= '  جواب ' . Info::where('app_id', 1)->where('name', 'responses')->first()->value . PHP_EOL;
//        $txt .= '  جواب صحیح ' . Info::where('app_id', 1)->where('name', 'trues')->first()->value . PHP_EOL;
//        $txt .= "-------------------" . PHP_EOL;


        $date = PHP_EOL . \Morilog\Jalali\CalendarUtils::strftime('Y/m/d | H:i') . PHP_EOL . ' رتبه شما در بین کاربران تا این لحظه ';
        $en_date = PHP_EOL . Carbon::now('utc')->format('Y/m/d  H:i') . PHP_EOL . ' Your Rank Until Now (UTC Time)';
        $date .= PHP_EOL;
        $en_date .= PHP_EOL;
        $isNight = (strpos($date, '20:'));
        $lang = null;

        $infos = Info::orwhere('app_id', '1')->orWhere('app_id', '2')->get();
        foreach ($infos as $info) {
            if ($info['app_id'] == 1 && $info['name'] == 'responses')
                $resp1 = $info['value'];
            else if ($info['app_id'] == 1 && $info['name'] == 'trues')
                $true1 = $info['value'];
            else if ($info['app_id'] == 2 && $info['name'] == 'responses')
                $resp2 = $info['value'];
            else if ($info['app_id'] == 2 && $info['name'] == 'trues')
                $true2 = $info['value'];
        }
        $t1 = number_format((float)$true1 / $resp1, 2, '.', '');
        $t2 = number_format((float)$true2 / $resp2, 2, '.', '');

        if (DB::table('queue')->where('file', null)->count() == 0) {

            $ids = User::where('telegram_id', '!=', null)->where('telegram_id', 'not like', "c%")->get('telegram_id AS id')->toArray();
            DB::table('queue')->insert($ids);
        }

        foreach (DB::table('queue')->where('file', null)->get()->pluck('id') as $id) {

            $user = User::where('telegram_id', $id)->first();
            $count = User::where('trues', '>', $user->trues)->count() + 1;
            $txt = ' 🏆 ' . $count . ' 🏆 ';
            $user->rank = $count;
            $user->save();

            if ($isNight) {
                if ($user->app_id != 1 && $user->app_id != 2) {
                    $lang = 'en';
                    $date = $en_date;
                } else {


                    $txt .= PHP_EOL . "📘پاسخ صحیح استقلالیا: " . $t1 * 100 . "%" . PHP_EOL;
                    $txt .= PHP_EOL . "📕پاسخ صحیح پرسپولیسیا: " . $t2 * 100 . "%" . PHP_EOL . "@vartastudiobot";

                }
                Helper::sendMessage($user->telegram_id, $date . $txt, null, null, null, true, $lang);

            }
        }

        //run this last for up code crash
        foreach (Helper::$logs as $log)
            Helper::sendMessage($log, $txt, null, null, null);
    }
}
