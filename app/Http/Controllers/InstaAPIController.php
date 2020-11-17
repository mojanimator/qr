<?php
/**
 * Created by PhpStorm.
 * User: MSI GS72
 * Date: 01/11/2020
 * Time: 08:07 PM
 */

namespace App\Http\Controllers;


use App\Ref;
use GuzzleHttp\Client;
use Illuminate\Http\Request;


class InstaAPIController extends Controller
{


    private $apiBaseUrl = 'https://api.instagram.com/';
    private $_getCode = '';
    public $authUrl = '';

    private $APP_ID, $APP_SECRET, $APP_SUCCESS_REDIRECT;

    function __construct()
    {
        $this->middleware('web')->except([]);

        $this->APP_ID = '349300206374776';
        $this->APP_SECRET = '1df5bf6fd6e2fb4a32419f9005a0f702';
        $this->APP_SUCCESS_REDIRECT = route('insta.token');
    }

    public function getRequestCodeLink()
    {
        $getVars = [
            'app_id' => $this->APP_ID,
            'redirect_uri' => $this->APP_SUCCESS_REDIRECT,
            'scope' => 'user_profile,user_media',
            'response_type' => 'code',
            '_token' => csrf_token()];

        $this->authUrl = $this->apiBaseUrl . 'oauth/authorize?' . http_build_query($getVars);
        return view('layouts.ref-create')->with('url', $this->authUrl);

    }


    public function getToken(Request $request)
    {
        $code = $request->code;
        $client = new Client();
        $response = $client->post($this->apiBaseUrl . 'oauth/access_token',
            ['form_params' => ['code' => $code,
                'app_id' => $this->APP_ID,
                'app_secret' => $this->APP_SECRET,
                'grant_type' => 'authorization_code',
                'redirect_uri' => $this->APP_SUCCESS_REDIRECT,

            ]]);
        $response = json_decode($response->getBody(), true);

        if (isset($response['access_token']))
            $token = $response['access_token'];

        session()->put(['token' => $token]);
        session()->save();
        return redirect()->route('ref.view.create');//->with('token', session()->get('token', 'hi'));
        // return view('layouts.ref-create')->with('token', session()->get('token', 'hi'));


    }

}