<?php

namespace App\Console;

use App\Console\Commands\DailyReport;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
//    protected $middleware = [\Illuminate\Session\Middleware\StartSession::class];
    protected $commands = [
        DailyReport::class,
    ];

    protected function scheduleTimezone()
    {
        return 'Asia/Tehran';
    }

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
//        $schedule->command('sitemap:generate')
//            ->hourly();

        $schedule->command('send:report')
            ->twiceDaily(8, 20);
        $schedule->command('update:status')
            ->dailyAt('01:00');
        $schedule->command('send:messages')
            ->everyFiveMinutes();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
