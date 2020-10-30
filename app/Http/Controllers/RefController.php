<?php

namespace App\Http\Controllers;

use App\Ref;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RefController extends Controller
{
    /**
     * RefController constructor.
     */
    public function __construct()
    {
        error_reporting(1);
        set_time_limit(-1);
        header("HTTP/1.0 200 OK");
        date_default_timezone_set('Asia/Tehran');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {

        if (auth()->user()->score < Helper::$install_chat_score)
            return response("LOW_SCORE");
        $chat_username = "@" . str_replace("@", "", $request->chat_username);
        if (Ref::where("ref_username", $chat_username)->exists())
            return response("CHAT_EXISTS");


        if ($request->type_id == 1) { //telegram

            $role = $this->getUserInChat(['chat_id' => $chat_username, 'user_id' => Helper::$bot_id,]);
            if ($role != 'administrator' && $role != 'creator')
                return response("BOT_NOT_ADMIN");

            $info = $this->getChatInfo($chat_username);
            if (!$info)
                return response("CHAT_NOT_FOUND");


            auth()->user()->score -= Helper::$install_chat_score;
            auth()->user()->save();


            'main_color', 'start_time', 'expire_time'
           $ref = Ref::create([
               'user_id' => auth()->user()->id,
               'title' => $info->title,
               'username' => $info->username,
               'app_id' => $info->app_id,
               'type_id' => $info->type_id,
               'is_vip' => $info->is_vip,
//                'chat_id' => "$info->id",
//                'chat_description' => $info->description,
           ]);
        $this->createChatImage($info->photo, "$ref->id");
        $ref->main_color = simple_color_thief(storage_path("app/public/refs/$ref->id.jpg"));
        $ref->save();

        } else if ($request->type_id == 2) { //instagram

        }

        return response("REGISTER_SUCCESS");


    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Ref $ref
     * @return \Illuminate\Http\Response
     */
    public function show(Ref $ref)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Ref $ref
     * @return \Illuminate\Http\Response
     */
    public function edit(Ref $ref)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Ref $ref
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Ref $ref)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Ref $ref
     * @return \Illuminate\Http\Response
     */
    public function destroy(Ref $ref)
    {
        //
    }

    private
    function creator($method, $datas = [])
    {
        $url = "https://api.telegram.org/bot" . env('TELEGRAM_BOT_TOKEN', 'YOUR-BOT-TOKEN') . "/" . $method;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $datas);
        $res = curl_exec($ch);

        if (curl_error($ch)) {
            return (curl_error($ch));
        } else {
            return json_decode($res);
        }
    }

    protected
    function getChatInfo($chat_id)
    {
        $res = $this->creator('getChat', [
            'chat_id' => $chat_id,

        ]);
        if (isset($res->result))
            return $res->result;
        else return null;
    }

    protected
    function getUserInChat($request)
    {
        $role = $this->creator('getChatMember', [
            'chat_id' => $request['chat_id'],
            'user_id' => $request['user_id']
        ]);
        $role = $role ? isset($role->result) ? isset($role->result->status) ? $role->result->status : $role->description : $role->description : null;
        return $role;
    }

    private
    function createChatImage($photo, $chat_id)
    {
        if (!isset($photo) || !isset($photo->big_file_id)) return;
        $client = new \GuzzleHttp\Client();
        $res = $this->creator('getFile', [
            'file_id' => $photo->big_file_id,

        ])->result->file_path;

        $image = "https://api.telegram.org/file/bot" . env('TELEGRAM_BOT_TOKEN', 'YOUR-BOT-TOKEN') . "/" . $res;
        Storage::put("public/chats/$chat_id.jpg", $client->get($image)->getBody());

    }
}
