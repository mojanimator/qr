<?php

namespace App\Jobs;

use App\Mail\RegisterEditUserMail;
use http\Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Mail;

class SendEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    /**
     * The number of seconds the job can run before timing out.
     *
     * @var int
     */
    protected $user;
    public $timeout = 20;
    public $retryAfter = 30;
    public $tries = 5;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    /**
     * Determine the time at which the job should timeout.
     *
     * @return \DateTime
     */
//    public function retryUntil()
//    {
//        return now()->addSeconds(5);
//    }

    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {

        Mail::to($this->user->email)->send(new RegisterEditUserMail($this->user->token));


    }

    /**
     * The job failed to process.
     *
     * @param  Exception $exception
     * @return void
     */
    public function failed(Exception $exception)
    {
        // Send user notification of failure, etc...
        echo "<script type='text/javascript'>alert('$exception');</script>";
    }
}
