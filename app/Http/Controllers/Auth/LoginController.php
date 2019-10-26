<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Report;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Morilog\Jalali\CalendarUtils;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
        $this->username = $this->findUsername();
    }

    public function authenticated(Request $request, $user)
    {
        if (!$user->verified) {
            auth()->logout();
            return back()->with('flash-warning', ' ابتدا باید ایمیل خود را تایید کنید. پیام تایید ایمیل هنگام ثبت نام برای شما ارسال شده است')
                ->with('token', $user->token);
        }
//        dd(CalendarUtils::createCarbonFromFormat('Y/m/d', $user->expires_at));
        if ($user->expires_at && CalendarUtils::createCarbonFromFormat('Y/m/d', $user->expires_at) < Carbon::now()) {
            auth()->logout();
            return back()->with('flash-error', ' اعتبار شما منقضی شده است');
        }

        // count logins
        Report::create(['name_family' => $user->name . ' ' . $user->family,
            'action_target' => 'l',
            'created_at' => Carbon::now()
        ]);

        return redirect()->intended($this->redirectPath());
    }

    /**
     * Get the login username to be used by the controller.
     *
     * @return string
     */
    public function findUsername()
    {
        $login = request()->input('login');

        $fieldType = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        request()->merge([$fieldType => $login]);

        return $fieldType;
    }

    /**
     * Get username property.
     *
     * @return string
     */
    public function username()
    {
        return $this->username;
    }

    protected function validateLogin(Request $request)
    {
        $request->validate([
            $this->username() => 'required|string',
            'password' => 'required|string',
        ]);
    }
}
