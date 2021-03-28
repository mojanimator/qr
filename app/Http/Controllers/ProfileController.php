<?php

namespace App\Http\Controllers;

use App\Group;
use App\Profile;
use App\User;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->except(['search', 'groups']);
    }

    public function groups(Request $request)
    {
//        $query = Report::query();
        return Group::orderby('id', 'DESC')->get();
    }

    public function search(Request $request)
    {

//        $query = Report::query();
        $request->validate([
            'group_id' => 'required|numeric',
            'paginate' => 'sometimes|numeric',
            'page' => 'sometimes|numeric',
        ], []);


        $paginate = $request->paginate;
        $page = $request->page;
        $group_id = $request->group_id;
        $is_vip = $request->is_vip;
        $orderBy = $request->order_by;

        if (!$group_id) {
            $group_id = 1;
        }
        if (!$paginate) {
            $paginate = 15;
        }
        if (!$page) {
            $page = 1;
        }


        $query = Profile::where('group_id', $group_id);
        if ($is_vip == true)
            $query = $query->where('star', '!=', null);
        if ($is_vip == null)
            $query = $query->where('star', null);

        if ($orderBy)
            $query = $query->orderByDesc($orderBy);
        else
            $query = $query->inRandomOrder($orderBy);

        return $query->paginate($paginate, ['*'], 'page', $page);
    }


    public function delete(Request $request)
    {
        if (auth()->user()->role != 'Admin') return abort(404);

        DB::transaction(function () use ($request) {
            Profile::destroy($request->id);
            Storage::disk('public')->delete('profiles' . DIRECTORY_SEPARATOR . $request->group_id . DIRECTORY_SEPARATOR . $request->path);
            Storage::disk('public')->delete('profiles' . DIRECTORY_SEPARATOR . $request->group_id . DIRECTORY_SEPARATOR . 'thumb-' . $request->path);
            Storage::disk()->delete('vip' . DIRECTORY_SEPARATOR . '2' . DIRECTORY_SEPARATOR . $request->group_id . DIRECTORY_SEPARATOR . $request->path);


            $name = Group::where('id', $request->group_id)->first()->name;
            $username = auth()->user()->telegram_username;
            foreach (Helper::$logs as $log)
                Helper::sendMessage($log, " کاربر " . " $username " . " یک پروفایل $name حذف کرد ", null, null, null);


//            return 200;
        });
        return $this->search($request);

    }

    public function create(Request $request)
    {
        if (auth()->user()->role != 'Admin') return abort(404);

        $request->validate([
            'group_id' => 'required|numeric',
            'link' => 'required|string',
//            'doc' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:4096'
            'doc' => 'required|base64_image|base64_size:10240'
        ]);

//        DB::transaction(function () use ($request) {


//            $filenameWihExt = $request->file('doc')->getClientOriginalName();
//            $filename = pathinfo($filenameWihExt, PATHINFO_FILENAME);
//            $ext = $request->file('doc')->getClientOriginalExtension();
//            $filenameToStore = $request->group_id . '-' . $filename . '-' . time() . '-' . $ext;
////        $path = $request->file->storeAs($folder, $name . '.' . $uploadedFile->getClientOriginalExtension(), $disk);
//            Storage::disk('public')->put($request->group_id . '/' . $filenameToStore, $request->file);

        $image_parts = explode(";base64,", $request->doc);
        $image_type_aux = explode("image/", $image_parts[0]);
        $image_base64 = base64_decode($image_parts[1]);
//            $path = $request->group_id . '/';
        $size = strlen($image_base64) / 1024; //kb

        $doc = Profile::create(['group_id' => $request->group_id, 'path' => '', 'size' => $size, 'link' => $request->link, 'star' => $request->star,]);
        $filenameToStore = 'profile-' . $doc->id . '.' . $image_type_aux[1];
        $filenameToStore = 'profile-' . $doc->id . '.jpg';
        $doc->path = $filenameToStore;
        $doc->save();
        $visibility = 'public';


        $pubOrVip = $doc->star > 0 ? 'vip' . DIRECTORY_SEPARATOR . '2' : 'public' . DIRECTORY_SEPARATOR . 'profiles';
        Storage::disk()->put($pubOrVip . DIRECTORY_SEPARATOR . $request->group_id . DIRECTORY_SEPARATOR . $filenameToStore, $image_base64, $visibility);


        $photo = imagecreatefromstring($image_base64);
        $imageSave = imagejpeg($photo, $filenameToStore, 100);
        imagedestroy($photo);
        File::delete(public_path() . DIRECTORY_SEPARATOR . $filenameToStore);
        $thumb = public_path('storage') . DIRECTORY_SEPARATOR . 'profiles' . DIRECTORY_SEPARATOR . $request->group_id . DIRECTORY_SEPARATOR . 'thumb-' . $filenameToStore;

        createThumbnail(storage_path('app' . DIRECTORY_SEPARATOR . $pubOrVip) . DIRECTORY_SEPARATOR . $request->group_id . DIRECTORY_SEPARATOR . $filenameToStore,
            $thumb);

        $thumb = asset('storage/profiles/' . $request->group_id . "/thumb-$filenameToStore");
        $name = Group::where('id', $request->group_id)->first()->name;
        $username = auth()->user()->telegram_username;
        foreach (Helper::$logs as $log)
            Helper::sendMessage($log, " کاربر " . " $username " . " یک پروفایل $name اضافه کرد " . "\n$thumb", null, null, null);

        $app_id = null;
        $app_id = getAppIdFromGroupId($request->group_id);
        if ($app_id != null) {
//            set_time_limit(600);
            $also = '💣کانال نظرسنجی و مسابقات:' . PHP_EOL . '@vartastudio' . PHP_EOL;
            if ($app_id == 1) {
                $also .= '🔷🔷کانال ارتش استقلال:🔷🔷' . PHP_EOL . '@esteghlalwallpapers' . PHP_EOL;
                $also .= '🔷🔷دانلود اپلیکیشن ارتش استقلال:🔷🔷' . PHP_EOL . '@vartastudiobot' . PHP_EOL;
                $also .= ($request->link == 'vartastudio' ? '#طراحی_اختصاصی' : "#$request->link") . " " . '#استقلال' . " " . '#پروفایل' . PHP_EOL;
            }
            if ($app_id == 2) {
                $also .= '🔴🔴کانال ارتش پرسپولیس:🔴🔴' . PHP_EOL . '@perspoliswallpapers' . PHP_EOL;
                $also .= '🔴🔴دانلود اپلیکیشن ارتش پرسپولیس:🔴🔴' . PHP_EOL . '@vartastudiobot' . PHP_EOL;
                $also .= ($request->link == 'vartastudio' ? '#طراحی_اختصاصی' : "#$request->link") . " " . '#پرسپولیس' . " " . '#پروفایل' . PHP_EOL;
            }

            if (DB::table('queue')->where('file', null)->count() == 0) {
                $ids = User::where('app_id', $app_id)->where('telegram_id', '!=', null)->get('telegram_id AS id')->toArray();
                DB::table('queue')->insert($ids);
            }

//
//            $i = 0;
            foreach (DB::table('queue')->where('file', null)->inRandomOrder()->get()->pluck('id') as $id) {
//                $i++;
//                if ($i > 20) {
//                    $i = 0;
//                    sleep(rand(2, 3));
//                }


                Helper::sendPhoto($id, $thumb, \Lang::get($app_id, \Lang::NEW_PROFILE) . PHP_EOL . $also);
                DB::table('queue')->where('id', $id)->delete();
//                Helper::sendMessage($id, \Lang::get($app_id, \Lang::NEW_IMAGE) . "\n$thumb", null, null, null);
//                Helper::sendMessage(Helper::$channel, \Lang::get($app_id, \Lang::NEW_IMAGE) . "\n$thumb", null, null, null);
            }


//            if ($app_id == 1) {
//                Helper::sendPhoto('@esteghlalwallpapers', $thumb, \Lang::get($app_id, \Lang::NEW_PROFILE) . PHP_EOL . $also);
//            }
//            if ($app_id == 2) {
//                Helper::sendPhoto('@perspoliswallpapers', $thumb, \Lang::get($app_id, \Lang::NEW_PROFILE) . PHP_EOL . $also);
//            }
//            Helper::sendPhoto('@vartastudio', $thumb, \Lang::get($app_id, \Lang::NEW_PROFILE) . PHP_EOL . $also);
//            Helper::sendPhoto('@lamassaba', $thumb, \Lang::get($app_id, \Lang::NEW_PROFILE) . PHP_EOL . $also);
            Helper::sendMessage(Helper::$logs[0], "■ با موفقیت به کاربران  ارسال شد!", null, null, null);

            Helper::sendPush($app_id, $title = null, \Lang::get($app_id, \Lang::NEW_PROFILE) . PHP_EOL . $also, $thumb, null);

//            set_time_limit(60);
        }

//        });


        return 200;
//        return abort(500, 'error in creating doc!');
    }
}
