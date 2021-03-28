<?php

namespace App\Http\Controllers;

use App\Ref;
use Carbon\Carbon;
use Helper;
use http\Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use InstagramScraper\Exception\InstagramException;
use Illuminate\Support\Facades\File;

class RefAPIController extends Controller
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

    public function search(Request $request)
    {

        $app_id = $request->app_id;
        $group_id = $request->group_id;
        $type_id = $request->type_id;

        $user_id = $request->user_id;
        $name = $request->name;
        $paginate = $request->paginate ?? 24;
        $page = $request->page ?? 1;
        $sortBy = $request->sortBy ?? 'id';
        $direction = $request->direction ?? 'DESC';
        $query = Ref::query();


        if ($name)
            $query = $query->where('title', 'like', $name . '%')->orWhere('username', 'like', $name . '%');

        if ($app_id != 1 && $app_id != 2)
            $query = $query->whereNotIn('app_id', [1, 2]);
        else
            $query = $query->whereIn('app_id', [1, 2]);

        if ($type_id && $type_id != 0)
            $query = $query->where('type_id', $type_id);

        if ($user_id)
            $query = $query->where('user_id', $user_id);

        if ($group_id == 1 && $type_id != 0) {
            $query = $query->where('app_id', $app_id)->where('group_id', $group_id);
        } else if ($group_id == 1 && $type_id == 0) {
            $query = $query->where('app_id', $app_id)->where('group_id', $group_id)->orWhere(function ($query) {
                $query = $query->where('type_id', 3)->where('group_id', 1)->where('app_id', '!=', 12);
            });
        } else if ($group_id == null || $group_id == 0) {
            $query->where('group_id', '!=', 1)->orWhere(function ($query) use ($app_id, $type_id) {
                $query = $query->where('app_id', $app_id)->where('group_id', 1)/*->where('type_id', $type_id)*/
                ;
            });
        } else {
            $query = $query->where('group_id', $group_id);
        }


        return $query->with('user:id,username')
            ->orderBy('is_vip', 'DESC')->orderBy('id', 'DESC')->paginate($paginate, ['*'], 'page', $page);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public
    function create(Request $request)
    {
        $img = $request->img;
        $title = $request->title;
        $vip_score = $request->is_vip ? Helper::$vip_chat_score : 0;

        if (auth()->user()->role != 'Admin' && auth()->user()->score < Helper::$install_chat_score + $vip_score)
            return response("LOW_SCORE");
        $chat_username = str_replace("@", "", $request->username);
        if (Ref::where("username", $chat_username)->where('type_id', $request->type_id)->exists())
            return response("EXISTS");


        if ($request->type_id == 1) { //telegram

//            $role = $this->getUserInChat(['chat_id' => $chat_username, 'user_id' => Helper::$bot_id,]);
//            if ($role != 'administrator' && $role != 'creator')
//                return response("BOT_NOT_ADMIN");

            $info = $this->getChatInfo($chat_username);
            if (!$info)
                return response("NOT_FOUND");
            auth()->user()->score -= (Helper::$install_chat_score + $vip_score);
            auth()->user()->save();

            $ref = Ref::create([
                'user_id' => auth()->user()->id,
                'title' => $info->title,
                'username' => $info->username,
                'app_id' => $request->app_id,
                'type_id' => $request->type_id,
                'group_id' => $request->group_id,
                'is_vip' => $request->is_vip,
                'expire_time' => $request->expires_after_hours == 0 ? null : Carbon::now()->addHours($request->expires_after_hours),
//                'chat_id' => "$info->id",
//                'chat_description' => $info->description,
            ]);
            $this->createChatImage($info->photo, "$ref->id", 'telegram');
            $ref->main_color = simple_color_thief(storage_path("app/public/refs/$ref->id.jpg"));
            $ref->save();

        } else if ($request->type_id == 2) { //instagram
            try {
                $instagram = new \InstagramScraper\Instagram(new \GuzzleHttp\Client());


                $proxy = $request->proxy;
                if (isset($proxy) && strpos($proxy, ':') !== false)
                    $instagram->setProxy(['port' => explode(':', $proxy)[1],
//                'tunnel' => true,
                        'address' => explode(':', $proxy)[0],
                        'type' => CURLPROXY_HTTP,
//                'auth' => [
//                    'user' => 'km617277',
//                    'pass' => '54778',
//                    'method' => CURLAUTH_BASIC
//                ],
                    ]);
                $account = $instagram->getAccount($chat_username);
                auth()->user()->score -= (Helper::$install_chat_score + $vip_score);
                auth()->user()->save();

                $ref = Ref::create([
                    'user_id' => auth()->user()->id,
                    'title' => $account->getFullName(),
                    'username' => $chat_username,
                    'app_id' => $request->app_id,
                    'type_id' => $request->type_id,
                    'group_id' => $request->group_id,
                    'is_vip' => $request->is_vip,
                    'expire_time' => $request->expires_after_hours == 0 ? null : Carbon::now()->addHours($request->expires_after_hours),

//                'chat_id' => "$info->id",
//                'chat_description' => $info->description,
                ]);
                $this->createChatImage($account->getProfilePicUrl(), "$ref->id", 'instagram');
                $ref->main_color = simple_color_thief(storage_path("app/public/refs/$ref->id.jpg"));
                $ref->save();
            } catch (\Exception $e) {
//                echo $e->getMessage();
//                echo $e->getCode();
                if ($img == null || $title == null)
                    return response($e . "\nNOT_FOUND");

                auth()->user()->score -= (Helper::$install_chat_score + $vip_score);
                auth()->user()->save();

                $ref = Ref::create([
                    'user_id' => auth()->user()->id,
                    'title' => $title,
                    'username' => $chat_username,
                    'app_id' => $request->app_id,
                    'type_id' => $request->type_id,
                    'group_id' => $request->group_id,
                    'is_vip' => $request->is_vip,
                    'expire_time' => $request->expires_after_hours == 0 ? null : Carbon::now()->addHours($request->expires_after_hours),

//                'chat_id' => "$info->id",
//                'chat_description' => $info->description,
                ]);
                $this->createChatImageFromHost($img, $ref->id);
                $ref->main_color = simple_color_thief(storage_path("app/public/refs/$ref->id.jpg"));
                $ref->save();

            };


//            echo "Account info:\n";
//            echo "Id: {$account->getId()}\n";
//            echo "Username: {$account->getUsername()}\n";
//            echo "Full name: {$account->getFullName()}\n";
//            echo "Biography: {$account->getBiography()}\n";
//            echo "Profile picture url: {$account->getProfilePicUrl()}\n";
//            echo "External link: {$account->getExternalUrl()}\n";
//            echo "Number of published posts: {$account->getMediaCount()}\n";
//            echo "Number of follows : {$account->getFollowsCount()}\n";
//            echo "Number of followers: {$account->getFollowedByCount()}\n";
//            echo "Is private: {$account->isPrivate()}\n";
//            echo "Is verified: {$account->isVerified()}\n";
        }
        foreach (Helper::$logs as $log)
            Helper::sendMessage($log, ' کاربر  ' . auth()->user()->telegram_username . " یک رفرنس اضافه کرد " . "\n" . Helper::$refTypes[$ref->type_id]['name'] . $ref->username, null, null, null);

        return response("REGISTER_SUCCESS", 200);


    }

    public
    function getForUpdate(Request $request)
    {
        $ref = Ref::find($request->id);
        $ref->expires_after_hours = round((Carbon::parse($ref->expire_time)->getTimestamp() - Carbon::now()->getTimestamp()) / 3600);
        $ref->shows_after_hours = round((Carbon::parse($ref->show_time)->getTimestamp() - Carbon::now()->getTimestamp()) / 3600);


        $ref->type_id = Helper::$refTypes [$ref->type_id - 1];
        $ref->app_id = getApps()[$ref->app_id - 1];
        $ref->group_id = Helper::$refGroups[$ref->group_id];

        return $ref;
    }

    public
    function delete(Request $request)
    {
        Storage::disk('public')->delete('refs' . DIRECTORY_SEPARATOR . $request->id . '.jpg');

        $ref = Ref::where('id', $request->id)->first();

        $ref->delete();
        Session::flash('message', 'باموفقیت حذف شد');
        Session::flash('alert-class', 'alert-danger');


        foreach (Helper::$logs as $log)
            Helper::sendMessage($log, ' کاربر  ' . auth()->user()->telegram_username . " یک رفرنس پاک کرد " . "\n" . Helper::$refTypes[$ref->type_id - 1]['name'] . $ref->username, null, null, null);

    }

    public
    function update(Request $request)
    {

        $img = $request->img;
        $title = $request->title;
        $id = $request->id;
        $app_id = $request->app_id;
        $type_id = $request->type_id;
        $group_id = $request->group_id;
        $username = $request->username;
        $is_vip = $request->is_vip;
        $expire_time = $request->expires_after_hours == "0" ? null : Carbon::now()->addHours($request->expires_after_hours);
        $start_time = $request->shows_after_hours == "0" ? null : Carbon::now()->addHours($request->shows_after_hours);

        $ref = Ref::find($id);

        if (auth()->user()->role != 'Admin' || $ref->user_id != auth()->user()->id)
            return response("NOT_ALLOWED", 401);


        if ($type_id == 1) { //telegram

            $info = $this->getChatInfo($username);
            if (!$info)
                return response("NOT_FOUND");

            $this->createChatImage($info->photo, "$ref->id", 'telegram');


        } else if ($request->type_id == 2) { //instagram
            try {
                $instagram = new \InstagramScraper\Instagram(/*new GuzzleHttp\Client()*/);
                $account = $instagram->getAccount($username);

                $this->createChatImage($account->getProfilePicUrl(), "$ref->id", 'instagram');

            } catch (\Exception $e) {
//
                if ($img == null || $title == null)
                    return response("NOT_FOUND");
                $this->createChatImageFromHost($img, "$ref->id");


            };

        }
        $ref->update(['app_id' => $app_id, 'type_id' => $type_id, 'title' => $title,
            'group_id' => $group_id, 'username' => $username, 'is_vip' => $is_vip,
            'expire_time' => $expire_time, 'start_time' => $start_time,
            'main_color ' => simple_color_thief(storage_path("app/public/refs/$ref->id.jpg"))
        ]);


        foreach (Helper::$logs as $log)
            Helper::sendMessage($log, 'کاربر  ' . '@' . auth()->user()->telegram_username . " یک رفرنس ویرایش کرد " . "\n" . Helper::$refTypes[$ref->type_id - 1]['name'] . $ref->username, null, null, null);
        return response("UPDATE_SUCCESS");


//        return response(200);

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
            'chat_id' => '@' . $chat_id,

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
    function createChatImage($photo, $chat_id, $type)
    {
        $client = new \GuzzleHttp\Client();
        if ($type == 'telegram') {
            if (!isset($photo) || !isset($photo->big_file_id)) return;
            $res = $this->creator('getFile', [
                'file_id' => $photo->big_file_id,

            ])->result->file_path;

            $image = "https://api.telegram.org/file/bot" . env('TELEGRAM_BOT_TOKEN', 'YOUR-BOT-TOKEN') . "/" . $res;
            Storage::put("public/refs/$chat_id.jpg", $client->get($image)->getBody());
        } else if ($type == 'instagram') {
            if ($photo != null)
                Storage::put("public/refs/$chat_id.jpg", $client->get($photo)->getBody());


        }

    }

    private
    function createChatImageFromHost($img, $id)
    {
        $image_parts = explode(";base64,", $img);
        $image_type_aux = explode("image/", $image_parts[0]);
        $image_base64 = base64_decode($image_parts[1]);

        $filenameToStore = $id . '.' . $image_type_aux[1];
        $filenameToStore = $id . '.jpg';

        $visibility = 'public';
        Storage::disk('public')->put('refs' . DIRECTORY_SEPARATOR . $filenameToStore, $image_base64, $visibility);

        $photo = imagecreatefromstring($image_base64);
        $imageSave = imagejpeg($photo, $filenameToStore, 100);
        imagedestroy($photo);
        File::delete(public_path() . DIRECTORY_SEPARATOR . $filenameToStore);


    }
}
