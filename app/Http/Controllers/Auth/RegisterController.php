<?php

namespace App\Http\Controllers\Auth;

use App\Http\Requests\UserRequest;
use App\Jobs\SendEmailJob;
use App\Mail\RegisterEditUserMail;
use App\Role;
use App\Rules\Recaptcha;
use App\User;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Str;
use Morilog\Jalali\CalendarUtils;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/login';

    protected function redirectTo()
    {
        return '/login';
//        if (auth()->user()->role_id == 1) {
//            return '/admin';
//        }
//        return '/panel/' . auth()->user()->username;
    }

    public function register(UserRequest $request)
    {

        $this->validator($request->all())->validate();

        event(new Registered($user = $this->create($request->all())));

//        $this->guard()->login($user);
//        return redirect('/login')->with('flash-success', 'برای تکمیل ثبت نام لطفا ایمیل خود را تایید کنید پیام تایید ایمیل  برای شما ارسال شده است');

        return $this->registered($request, $user)
            ?: redirect($this->redirectPath());
//        $this->guard()->logout();
    }

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {

        return Validator::make($data, ['recaptcha' => ['required', new  Recaptcha()],

            'username' => 'required|string|min:6|max:20|unique:users,username',
            'name' => 'required|string|min:3|max:50',
            'family' => 'required|string|min:3|max:50',
            'phone_number' => 'required|numeric|max:99999999999999999999',
            'email' => ['required', 'string', 'email', 'min:6', 'max:50', 'unique:users,email'],
            'password' => 'string|min:6|max:50|confirmed|required',
            'access_all' => 'required|boolean',
            'access_view_schools' => 'required|boolean',
            'access_create_schools' => 'required|boolean',
            'access_edit_schools' => 'required|boolean',
            'access_remove_schools' => 'required|boolean',
            'access_view_users' => 'required|boolean',
            'access_create_users' => 'required|boolean',
            'access_edit_users' => 'required|boolean',
            'access_remove_users' => 'required|boolean',
            'access_create_hoozes' => 'required|boolean',
            'access_edit_hoozes' => 'required|boolean',
            'access_remove_hoozes' => 'required|boolean',
            'access_view_reports' => 'required|boolean',
            'hoozes_all' => 'required|boolean',
            'deactivate_user' => 'required|boolean',
            "hoozes" => "nullable|array",
            "hoozes.*" => "numeric|exists:hoozes,id"],

            [
                'recaptcha.required' => 'لطفا گزینه من ربات نیستم را تایید نمایید',
                'username.required' => 'نام کاربری ضروری است',
                'username.string' => 'نام کاربری نمی تواند عدد باشد',
                'username.min' => 'نام کاربری حداقل 6 حرف باشد',
                'username.max' => 'نام کاربری حداکثر 20 حرف باشد',
                'username.unique' => 'نام کاربری تکراری است',
                'name.required' => 'نام  ضروری است',
                'name.string' => 'نام  نمی تواند عدد باشد',
                'name.min' => 'نام  حداقل 3 حرف باشد',
                'name.max' => 'نام  حداکثر 50 حرف باشد',
                'family.required' => 'نام خانوادگی ضروری است',
                'family.string' => 'نام خانوادگی نمی تواند عدد باشد',
                'family.min' => 'نام خانوادگی حداقل 3 حرف باشد',
                'family.max' => 'نام خانوادگی  حداکثر 50 حرف باشد',
                'phone_number.required' => 'شماره تماس ضروری است',
                'phone_number.numeric' => 'شماره تماس باید عدد باشد',
                'phone_number.max' => 'شماره تماس حداکثر 20 عدد باشد',
                'email.required' => 'ایمیل ضروری است',
                'email.string' => 'ایمیل نامعتبر است',
                'email.email' => 'ایمیل نامعتبر است',
                'email.min' => 'ایمیل حداقل 6 حرف باشد',
                'email.max' => 'ایمیل حداکثر 50 حرف باشد',
                'email.unique' => 'ایمیل تکراری است',
                'password.required' => 'گذرواژه  ضروری است',
                'password.string' => 'گذرواژه  نمی تواند فقط عدد باشد',
                'password.min' => 'گذرواژه  حداقل 6 حرف باشد',
                'password.max' => 'گذرواژه  حداکثر 50 حرف باشد',
                'password.confirmed' => 'گذرواژه با تکرار آن مطابقت ندارد',
                'access_all.required' => 'پارامتر دسترسی نامعتبر است',
                'access_all.boolean' => 'پارامتر دسترسی نامعتبر است',
                'access_view_schools.required' => 'پارامتر دسترسی نامعتبر است',
                'access_view_schools.boolean' => 'پارامتر دسترسی نامعتبر است',
                'access_create_schools.required' => 'پارامتر دسترسی نامعتبر است',
                'access_create_schools.boolean' => 'پارامتر دسترسی نامعتبر است',
                'access_edit_schools.required' => 'پارامتر دسترسی نامعتبر است',
                'access_edit_schools.boolean' => 'پارامتر دسترسی نامعتبر است',
                'access_remove_schools.required' => 'پارامتر دسترسی نامعتبر است',
                'access_remove_schools.boolean' => 'پارامتر دسترسی نامعتبر است',
                'access_view_users.required' => 'پارامتر دسترسی نامعتبر است',
                'access_view_users.boolean' => 'پارامتر دسترسی نامعتبر است',
                'access_create_users.required' => 'پارامتر دسترسی نامعتبر است',
                'access_create_users.boolean' => 'پارامتر دسترسی نامعتبر است',
                'access_edit_users.required' => 'پارامتر دسترسی نامعتبر است',
                'access_edit_users.boolean' => 'پارامتر دسترسی نامعتبر است',
                'access_remove_users.required' => 'پارامتر دسترسی نامعتبر است',
                'access_remove_users.boolean' => 'پارامتر دسترسی نامعتبر است',
                'access_create_hoozes.required' => 'پارامتر دسترسی نامعتبر است',
                'access_create_hoozes.boolean' => 'پارامتر دسترسی نامعتبر است',
                'access_remove_hoozes.required' => 'پارامتر دسترسی نامعتبر است',
                'access_remove_hoozes.boolean' => 'پارامتر دسترسی نامعتبر است',
                'access_view_reports.required' => 'پارامتر دسترسی نامعتبر است',
                'access_view_reports.boolean' => 'پارامتر دسترسی نامعتبر است',
                'access_edit_hoozes.required' => 'پارامتر دسترسی نامعتبر است',
                'access_edit_hoozes.boolean' => 'پارامتر دسترسی نامعتبر است',
                'hoozes_all.required' => 'پارامتر دسترسی نامعتبر است',
                'hoozes_all.boolean' => 'پارامتر دسترسی نامعتبر است',
                'deactivate_user.required' => 'پارامتر دسترسی نامعتبر است',
                'deactivate_user.boolean' => 'پارامتر دسترسی نامعتبر است',
                'hoozes.array' => 'نوع حوزه ها نامعتبر است',
                "hoozes.*.numeric" => "نوع حوزه ها نامعتبر است",
                "hoozes.*.exists" => "حوزه ها موجود نیستند!",
            ]);
    }


    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array $data
     * @return \App\User
     */
    protected function create(array $data)
    {
//        $date = Carbon::now();
        $user = null;
        DB::transaction(function () use ($data, & $user) {
            $user = User::create([
                'username' => $data['username'],
                'name' => $data['name'],
                'family' => $data['family'],
                'email' => $data['email'],
                'phone_number' => $data['phone_number'],
                'inline_role' => $data['access_all'] == true && $data['hoozes_all'] == true ? 0 : null, //superuser
                'password' => Hash::make($data['password']),
                'token' => bin2hex(openssl_random_pseudo_bytes(30)),
                'deleted_at' => $data['deactivate_user'] ? Carbon::now() : null,
                'expires_at' => $data['ex_date'] ? CalendarUtils::createCarbonFromFormat('Y/m/d', $data['ex_date'])->addDays(1)->timezone('Asia/Tehran') : null,
            ]);

            $hooze_ids = array();


            if ($data['hoozes_all'] == true)
                array_push($hooze_ids, 'all');


            Role::create([
                'user_id' => $user->id,
                'permissions' => $this->create_access($data),
                'hooze_ids' => $data['hoozes_all'] == true ? ['all'] : $data['hoozes'],
            ]);
//            dispatch(new SendEmailJob($user))->onQueue('default');
            Mail::to($user->email)->send(new RegisterEditUserMail($user->token, 'register'));
//            Mail::to($user->email)->queue(new OrderShipped($order));
        });
        return $user;
    }

    public function verify($token, $from)
    {


        if (!$token) {
            return redirect('login')->with('flash-error', 'لینک نامعتبر است!');
        }


        $user = User::where('token', $token)->first();


        if (!$user) {
            return redirect('login')->with('flash-error', 'لینک منقضی شده است!');
        }

        $user->verified = 1;

        if ($user->save()) {

            if ($from == 'register')
                return redirect('login')->with('flash-success', 'ثبت نام شما با موفقیت کامل شد!');
            else if ($from == 'edit')
                return redirect('login')->with('flash-success', 'تایید ایمیل با موفقیت کامل شد!');

        }

    }

    public function create_access(array $data)
    {
        $roles = array();
        if ($data['access_all'] == true)
            array_push($roles, 'all');
        else {
            if ($data['access_view_schools'] == true)
                array_push($roles, 'vs');
            if ($data['access_create_schools'] == true)
                array_push($roles, 'cs');
            if ($data['access_edit_schools'] == true)
                array_push($roles, 'es');
            if ($data['access_remove_schools'] == true)
                array_push($roles, 'rs');
            if ($data['access_view_users'] == true)
                array_push($roles, 'vu');
            if ($data['access_create_users'] == true)
                array_push($roles, 'cu');
            if ($data['access_edit_users'] == true)
                array_push($roles, 'eu');
            if ($data['access_remove_users'] == true)
                array_push($roles, 'ru');
            if ($data['access_create_hoozes'] == true)
                array_push($roles, 'ch');
            if ($data['access_edit_hoozes'] == true)
                array_push($roles, 'eh');
            if ($data['access_remove_hoozes'] == true)
                array_push($roles, 'rh');
            if ($data['access_view_reports'] == true)
                array_push($roles, 'vr');


        }
        return $roles;
    }

    public function showRegistrationForm()
    {
//        if (Gate::denies('isSuperuser')) {
//            abort(404, ' مجوز دسترسی ندارید!');
//        }
        return view('auth.register');
    }

    protected function registered(UserRequest $request, $user)
    {
//        $this->guard()->logout();
//        flash('flash-success', 'برای تکمیل ثبت نام لطفا ایمیل خود را تایید کنید پیام تایید ایمیل  برای شما ارسال شده است');
        return view('auth.login')->with('flash-success', 'برای تکمیل ثبت نام لطفا ایمیل خود را تایید کنید پیام تایید ایمیل  برای شما ارسال شده است')
            ->render();
    }

    public function resend(Request $request)
    {
//        $this->guard()->logout();
        $user = User::where('token', $request->token)->first();
//        dd($user);
//        return redirect('login')->with('flash-success', $user->token);
        if ($user) {
//            dispatch(new SendEmailJob($user))->onQueue('default');
            Mail::to($user->email)->send(new RegisterEditUserMail($user->token, 'register'));

            return redirect('login')->with('flash-success', 'برای تکمیل ثبت نام لطفا ایمیل خود را تایید کنید پیام تایید ایمیل  برای شما ارسال شد');
        } else {
            return redirect('login')->with('flash-error', 'کاربر وجود ندارد!');

        }
    }
}
