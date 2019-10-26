<?php

namespace App\Http\Middleware;

use App\User;
use Closure;
use Illuminate\Support\Facades\Hash;

class EmailMustBeConfirmed
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {


        $user = User::where(['email' => $request->email])->first();
        if ($user && Hash::check($request->password, $user->password)) {
            if ($user->verified !== 1) {
                flash()->error('خطا', 'ابتدا باید ایمیل خود را تایید کنید!');
                return back();
            }
        } else {
            flash()->error('خطا', 'نام کاربری یا گذرواژه نادرست است!');
        }

        return $next($request);
    }
}
