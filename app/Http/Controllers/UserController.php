<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Mail\RegisterEditUserMail;
use App\Report;
use App\Role;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Morilog\Jalali\CalendarUtils;

class UserController extends Controller
{
    public function __construct()
    {
//        parent::__construct();
        $this->middleware('auth')->except(['show']);
    }

    public function show()
    {

        return view('user.show');
    }

    public function showPanel()
    {

        return view('user.panel');
    }

    public function view()
    {

        return view('user.users');
    }

    protected function create(UserRequest $data)
    {
//        $date = Carbon::now();
        $user = null;

        DB::transaction(function () use ($data, & $user) {
            $editorRole = Role::where('user_id', auth()->user()->id)->first();
            $user = User::create([
                'username' => $data['username'],
                'name' => $data['name'],
                'family' => $data['family'],
                'email' => $data['email'],
                'phone_number' => $data['phone_number'],
                'inline_role' => auth()->user()->inline_role == 1 && $data['access_all'] == true && $data['hoozes_all'] == true ? 1 : 0, //superuser
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
                'hooze_ids' => $data['hoozes_all'] == true ?
                    $editorRole->hooze_ids : //can get only max hoozes of editor
                    $data['hoozes'],
            ]);

            Report::create(['name_family' => auth()->user()->name . ' ' . auth()->user()->family,
                'action_target' => 'c~u~' . $user->name . ' ' . $user->family,
                'created_at' => Carbon::now()
            ]);

//            dispatch(new SendEmailJob($user))->onQueue('default');
            Mail::to($user->email)->send(new RegisterEditUserMail($user->token, 'register'));
//            Mail::to($user->email)->queue(new OrderShipped($order));
            return redirect(route('user.view', [auth()->user()->username]))->with('flash-success-edit', ' پیام تایید ایمیل  برای کاربر ارسال شد');

            return 200;
        });
        return 404;
    }

    protected function update(UserRequest $request)
    {
//        $date = Carbon::now();
        $user = null;
        DB::transaction(function () use ($request, & $user) {
            $editorRole = Role::where('user_id', auth()->user()->id)->first();
            $token = bin2hex(openssl_random_pseudo_bytes(30));
            $user = User::findOrFail($request->id);
            $role = Role::where('user_id', $user->id)->first();
            $emailChanged = $user->email != $request->email ? true : false;
            if (!auth()->user()->inline_role == 1 && $user->inline_role == 1)
                return abort(403, 'مجاز به ویرایش کاربر سوپرادمین نیستید!');

            $user->username = $request->username;
            $user->name = $request->name;
            $user->family = $request->family;
            $user->email = $request->email;
            $user->phone_number = $request->phone_number;
            $user->inline_role = auth()->user()->inline_role == 1 && $request->access_all == true && $request->hoozes_all == true ? 1 : null; //superuser
            $user->password = $request->password ? Hash::make($request->password) : $user->password;
            $user->token = $token;
            $user->deleted_at = $request->deactivate_user ? Carbon::now() : null;
            $user->expires_at = $request->ex_date ? CalendarUtils::createCarbonFromFormat('Y/m/d', $request->ex_date)/*->addDays(1)*/
            ->timezone('Asia/Tehran') : null;

            if ($emailChanged) $user->verified = 0;
            $user->save();
            $hooze_ids = array();

//            if ($request['hoozes_all'] == true)
//                array_push($hooze_ids, 'all');


            $role->update([
                'permissions' => $this->create_access($request),
                'hooze_ids' => $request['hoozes_all'] == true ?
                    $editorRole->hooze_ids : //can get only max hoozes of editor
                    $request['hoozes'],
            ]);
//            $role->permissions = $this->create_access($request);
//            $role->hooze_ids = $request['hoozes_all'] == true ? ["all"] : $request->hoozes;
//            $role->save();
            Report::create(['name_family' => auth()->user()->name . ' ' . auth()->user()->family,
                'action_target' => 'e~u~' . $request->name . ' ' . $request->family,
                'created_at' => Carbon::now()
            ]);

            if ($emailChanged) $this->resendEmail($request->email, $token, 'edit');

            return 200;
        });

    }

    public function search(Request $request)
    {
        $user_access = auth()->user() ? auth()->user()->role()->first()->permissions : [];
        $is_superuser = count($user_access) > 0 && in_array('all', $user_access) ? true : false;
        if (count($user_access) == 0 || !$is_superuser && !in_array('vu', $user_access)) //user not hooze access
            return [];

        $request->validate([
            'name' => 'nullable|max:100',
            'paginate' => 'nullable|numeric|max:1000000000',
            'page' => 'nullable|numeric|max:1000000000',
//            'for' => 'sometimes|string|in:dropdown',
        ], [
            'name.max' => 'حداکثر طول نام 100 کاراکتر است',
            'paginate.numeric' => 'صفحه بندی نامعتبر است.',
            'paginate.max' => 'صفحه بندی نامعتبر است.',
            'page.numeric' => 'صفحه  نامعتبر است.',
            'page.max' => 'صفحه  نامعتبر است.',
//            'for.string' => 'نوع درخواست حوزه نامعتبر است',
//            'for.in' => 'نوع درخواست حوزه نامعتبر است',
        ]);
        $query = User::where('id', '<>', auth()->user()->id); //not return self user

        if (!$is_superuser)
            $query = $query->where('inline_role', '<>', 1); //only superuser can see superusers

        $name = $request->name;
        $paginate = $request->paginate;
        $page = $request->page;
        $sortBy = $request->sortBy;
        $direction = $request->direction;


        if (!$paginate) {
            $paginate = 24;
        }
        if (!$page) {
            $page = 1;
        }


        if ($name != '')
            $query = $query->where('name', 'like', '%' . $name . '%');


        if ($sortBy && $direction)
            $query = $query->orderBy($sortBy, $direction);

        return $query->with('role')->paginate($paginate, ['*'], 'page', $page);

    }

    protected function resendEmail($email, $token, $from)
    {

//            dispatch(new SendEmailJob($user))->onQueue('default');
        Mail::to($email)->send(new RegisterEditUserMail($token, $from));

        return redirect(route('user.view', [auth()->user()->username]))->with('flash-success-edit', ' پیام تایید ایمیل  برای کاربر ارسال شد');

    }

    protected function create_access(Request $data)
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
            if ($data['access_view_hoozes'] == true)
                array_push($roles, 'vh');
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

    public function destroy(Request $request)
    {


        $request->validate([
            'id' => 'required|numeric|min:1|max:4294967295',

        ], [
            'id.required' => 'شناسه کاربر نامعتبر است',
            'id.numeric' => 'شناسه کاربر نامعتبر است',
            'id.min' => 'شناسه کاربر نامعتبر است',
            'id.max' => 'شناسه کاربر نامعتبر است',

        ]);

        DB::transaction(function () use ($request) {
            Schema::disableForeignKeyConstraints();

            User::destroy($request->id);
            Schema::enableForeignKeyConstraints();

            return "200";
        });
        return null;
    }

}


