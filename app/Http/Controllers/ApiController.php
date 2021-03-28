<?php

namespace App\Http\Controllers;

use App\Product;
use Carbon\Carbon;
use Helper;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use League\OAuth2\Server\Exception\OAuthServerException;


class ApiController extends Controller
{
    public $successStatus = 200;

    public function edit(Request $request)
    {
        if (!auth()->user())
            return response()->json(['error' => $request->lang == 'en' ? 'Please Login Or Register From Main Page First' : 'ابتدا از صفحه اصلی وارد شوید یا ثبت نام کنید'], 401);

        $validator = Validator::make($request->all(), [

            'username' => 'sometimes|min:5|max:50|alpha_dash|regex:/^[A-Za-z0-9_]+$/|unique:users,username',
            'password' => 'sometimes|min:6|max:50',
            'password_confirm' => 'required_with:password|same:password',
            'doc' => 'sometimes|nullable|base64_image|base64_size:1024'

        ], $request->lang != 'en' ? [
            'username.min' => 'طول نام کاربری حداقل 5 باشد',
            'username.max' => 'طول نام کاربری حداکثر 50 باشد',
            'username.unique' => 'نام کاربری تکراری است',
            'username.alpha_dash' => 'نام کاربری فقط شامل حروف، عدد و - و _ باشد',
            'username.regex' => 'نام کاربری فقط شامل حروف، عدد و - و _ باشد',
            'password.min' => 'طول گذرواژه حداقل 6 حرف باشد',
            'password.max' => 'طول گذرواژه حداکثر50 حرف باشد',
            'password_confirm.same' => 'گذرواژه با تایید آن تطابق ندارد',
        ] : []);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 401);
        }

        $input = $request->all();

        $user = auth()->user();
        if (isset($input['username']) && $input['username'])
            $user->username = $input['username'];
        if (isset($input['password']) && $input['password'])
            $user->password = bcrypt($input['password']);
        $user->step = null;

        $user->save();
        if ($request->doc)
            $this->createImageAccount($user->id, $request->doc);
        $success['token'] = $user->createToken('AppName')->accessToken;
        foreach (Helper::$logs as $log)
            Helper::sendMessage($log, "User $user->username edited in App $user->app_id", null, null, null);

        return response()->json(['success' => 'yes'/* $success*/], $this->successStatus);
    }

    public function register(Request $request)
    {
//        if ($request->app_id == 1 || $request->app_id == 2)
//            return response()->json(['error' => 'در حال حاضر فقط ثبت نام با ربات تلگرام فعال است'], 401);
        $validator = Validator::make($request->all(), [
            'username' => 'required|min:5|max:50|alpha_dash|regex:/^[A-Za-z0-9_]+$/|unique:users,username',
            'password' => 'required|min:6|max:50',
            'app_id' => 'required|numeric',
            'c_password' => 'required|same:password',
            'doc' => 'nullable|base64_image|base64_size:1024'

        ], $request->lang != 'en' ? [
            'username.required' => 'نام کاربری ضروری است',
            'username.min' => 'طول نام کاربری حداقل 5 باشد',
            'username.max' => 'طول نام کاربری حداکثر 50 باشد',
            'username.unique' => 'نام کاربری تکراری است',
            'username.alpha_dash' => 'نام کاربری فقط شامل حروف، عدد و - و _ باشد',
            'username.regex' => 'نام کاربری فقط شامل حروف، عدد و - و _ باشد',
            'password.required' => 'گذرواژه ضروری است',
            'password.min' => 'طول گذرواژه حداقل 6 حرف باشد',
            'password.max' => 'طول گذرواژه حداکثر50 حرف باشد',
            'c_password.required' => 'تایید گذرواژه ضروری است',
            'c_password.same' => 'گذرواژه با تایید آن تطابق ندارد',
            'doc.base64_image' => 'فرمت عکس نامعتبر است',
            'doc.base64_size' => 'حداکثر حجم عکس 1 مگابایت باشد'
        ] : []);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 401);
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $user = User::create($input);
        $user->step = null;
        $user->rank = User::count();
        $user->save();
        if ($request->doc)
            $this->createImageAccount($user->id, $request->doc);
        $success['token'] = $user->createToken('AppName')->accessToken;
        foreach (Helper::$logs as $log)
            Helper::sendMessage($log, "User $user->username registered in App $user->app_id From Application", null, null, null);

        return response()->json(['success' => 'yes'/* $success*/], $this->successStatus);
    }

    function createImageAccount($id, $doc)
    {
        $image_parts = explode(";base64,", $doc);
        $image_type_aux = explode("image/", $image_parts[0]);
        $image_base64 = base64_decode($image_parts[1]);
//            $path = $request->group_id . '/';
//        $size = strlen($image_base64) / 1024; //kb

        $filenameToStore = $id . '.jpg';
        $visibility = 'public';
        Storage::disk('public')->put('users' . DIRECTORY_SEPARATOR . $filenameToStore, $image_base64, $visibility);

        $photo = imagecreatefromstring($image_base64);
        $imageSave = imagejpeg($photo, $filenameToStore, 100);
        imagedestroy($photo);
        File::delete(public_path() . DIRECTORY_SEPARATOR . $filenameToStore);

    }

    function getUser(Request $request)
    {

        if ($request->for == 'me') {
            $u = auth()->user();
            $p = Product::where('user_id', auth()->user()->id)
                ->where('type', '1_month_unlock')
                ->where('info', '!=', null)->where('created_at', '>', Carbon::now())
                ->orderBy('created_at', 'DESC')
                ->first();
            $u->unlock_sub = $p != null ? $p->created_at : null;
            return $u;
        }
        if ($request->for == 'score')
            return ['score' => auth()->user()->score,];
        if ($request->for == 'check_sub') {
            $p = Product::where('user_id', auth()->user()->id)
                ->where('type', 'unlock_1_month')
                ->where('info', '!=', null)
                ->orderBy('created_at', 'DESC')
                ->first();
            return ['unlock_sub' => $p != null ? $p->created_at : null];
        }

    }

    public function login(Request $request)
    {
        if (!$request->password || !$request->login)
            return response()->json(['res' => 'LOGIN_FAIL', 'status' => 400]);

        $http = new
        \GuzzleHttp\Client([/*'base_uri' => 'http://localhost:81/_laravelProjects/magnetgram/public/',*/
        ]);

        try {
            $response = $http->post(route('passport.token')
                // 'oauth/token'
                /* 'http://localhost:81/_laravelProjects/ashayer/public/oauth/token'*/, [

                    'headers' => ['cache-control' => 'no-cache',
                        'Content-Type' => 'application/x-www-form-urlencoded'
                    ],
                    'form_params' => [
                        'grant_type' => 'password',
                        'client_id' => config('services.passport.client_id'),
                        'client_secret' => config('services.passport.client_secret'),
                        'password' => $request->password,
                        'username' => $request->login,
                    ]
                ]);

            return $response->getBody();
        } catch (\Guzzlehttp\Exception\BadResponseException $e) {
            if ($e->getCode() == 400) {
                return response()->json(['res' => 'LOGIN_FAIL', 'status' => $e->getCode()]);
            } else if ($e->getCode() == 401) {
                return response()->json(['res' => 'LOGIN_FAIL', 'status' => $e->getCode()]);
            }
            return response()->json(['res' => 'SERVER_ERROR', 'status' => $e->getCode()]);

        } catch (OAuthServerException $e) {
            if ($e->getCode() == 400) {
                return response()->json(['res' => 'LOGIN_FAIL', 'status' => $e->getCode()]);
            } else if ($e->getCode() == 401) {
                return response()->json(['res' => 'LOGIN_FAIL', 'status' => $e->getCode()]);
            }
            return response()->json(['res' => 'SERVER_ERROR', 'status' => $e->getCode()]);

        } catch (\Exception $e) {
            if ($e->getCode() == 400) {
                return response()->json(['res' => 'LOGIN_FAIL', 'status' => $e->getCode()]);
            } else if ($e->getCode() == 401) {
                return response()->json(['res' => 'LOGIN_FAIL', 'status' => $e->getCode()]);
            }
            return response()->json(['res' => 'SERVER_ERROR', 'status' => $e->getCode()]);

        }
    }

    public function refreshToken()
    {
        $http = new \GuzzleHttp\Client(['base_uri' => 'http://localhost:81/_laravelProjects/ashayer/public/',
        ]);

        $response = $http->post('oauth/token', [
            'form_params' => [
                'grant_type' => 'refresh_token',
                'refresh_token' => 'the-refresh-token',
                'client_id' => config('services.passport.client_id'),
                'client_secret' => config('services.passport.client_secret'),
                'scope' => '',
            ],
        ]);

        return json_decode((string)$response->getBody(), true); //return new token and refresh token
    }

    // public function getUser()
    // {
    //     $user = Auth::user();
    //     return response()->json(['success' => $user], $this->successStatus);
    // }

    public function logout()
    {
        if (!auth()->user())
            return response()->json('NOT_EXISTS', 400);

        auth()->user()->tokens->each(function ($token, $key) {
            $token->delete();
        });
//        auth()->guard()->logout();
        return response()->json(['message' => 'SUCCESS_LOGOUT', 'status' => 200]);
    }


}