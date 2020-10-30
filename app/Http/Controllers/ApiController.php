<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Validator;

class ApiController extends Controller
{
    public $successStatus = 200;

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required',
            'c_password' => 'required|same:password',
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }
        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $user = User::create($input);
        $success['token'] = $user->createToken('AppName')->accessToken;
        return response()->json(['success' => $success], $this->successStatus);
    }


    function getUser(Request $request)
    {

        if ($request->for == 'me')
            return auth()->user()->only(['username', 'telegram_id', 'role', 'img', 'responded', 'trues', 'app_id', 'score']);
        if ($request->for == 'score')
            return ['score' => auth()->user()->score];


    }

    public function login(Request $request)
    {


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