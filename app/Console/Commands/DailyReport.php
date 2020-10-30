<?php

namespace App\Console\Commands;

use App\Info;
use App\Quiz;
use App\User;
use Carbon\Carbon;
use Helper;
use Illuminate\Console\Command;

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
        $txt .= "تعداد کاربران بارسا" . PHP_EOL;
        $txt .= User::where('app_id', 3)->count() . PHP_EOL;
        $txt .= "-------------------" . PHP_EOL;
        $txt .= "تعداد کاربران رئال" . PHP_EOL;
        $txt .= User::where('app_id', 4)->count() . PHP_EOL;
        $txt .= "-------------------" . PHP_EOL;
        $txt .= "✨استقلال" . PHP_EOL;
        $txt .= '  سوال ' . Info::where('app_id', 1)->where('name', 'questions')->first()->value . PHP_EOL;
        $txt .= '  جواب ' . Info::where('app_id', 1)->where('name', 'responses')->first()->value . PHP_EOL;
        $txt .= '  جواب صحیح ' . Info::where('app_id', 1)->where('name', 'trues')->first()->value . PHP_EOL;
        $txt .= "-------------------" . PHP_EOL;
        $txt .= "✨پرسپولیس" . PHP_EOL;
        $txt .= '  سوال ' . Info::where('app_id', 2)->where('name', 'questions')->first()->value . PHP_EOL;
        $txt .= '  جواب ' . Info::where('app_id', 2)->where('name', 'responses')->first()->value . PHP_EOL;
        $txt .= '  جواب صحیح ' . Info::where('app_id', 2)->where('name', 'trues')->first()->value . PHP_EOL;
        $txt .= "-------------------" . PHP_EOL;
        $txt .= "✨بارسا" . PHP_EOL;
        $txt .= '  سوال ' . Info::where('app_id', 3)->where('name', 'questions')->first()->value . PHP_EOL;
        $txt .= '  جواب ' . Info::where('app_id', 3)->where('name', 'responses')->first()->value . PHP_EOL;
        $txt .= '  جواب صحیح ' . Info::where('app_id', 3)->where('name', 'trues')->first()->value . PHP_EOL;
        $txt .= "-------------------" . PHP_EOL;
        $txt .= "✨رئال" . PHP_EOL;
        $txt .= '  سوال ' . Info::where('app_id', 4)->where('name', 'questions')->first()->value . PHP_EOL;
        $txt .= '  جواب ' . Info::where('app_id', 4)->where('name', 'responses')->first()->value . PHP_EOL;
        $txt .= '  جواب صحیح ' . Info::where('app_id', 4)->where('name', 'trues')->first()->value . PHP_EOL;
        $txt .= "-------------------" . PHP_EOL;

        foreach (Helper::$logs as $log)
            Helper::sendMessage($log, $txt, null, null, null);

    }
}
