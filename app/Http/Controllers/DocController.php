<?php

namespace App\Http\Controllers;

use App\Doc;
use Helper;
use App\Group;
use App\Hooze;
use App\Http\Requests\HoozeRequest;
use App\Http\Requests\SchoolRequest;
use App\Koochro;
use App\Report;
use App\Saabet;
use App\School;
use App\Setting;
use Carbon\Carbon;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\File;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Morilog\Jalali\CalendarUtils;
use function Sodium\increment;


class DocController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->except(['search', 'groups']);
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

        $app = 'fashion_visits';
        if (!$group_id) {
            $group_id = 1;
        }
        if (!$paginate) {
            $paginate = 15;
        }
        if (!$page) {
            $page = 1;
        }

        // if ($group_id >= 1 && $group_id <= 4) //is for fashion wallpapers app
        //     $app = 'fashion_visits';
        // else  if ($group_id == 5 || $group_id == 7) //is for esteghlal wallpapers app
        //     $app = 'esteghlal_visits';
        // else if ($group_id == 6 || $group_id == 8) //is for perspolis wallpapers app
        //     $app = 'perspolis_visits';
        // else if ($group_id == 9) //is for roman wallpapers app
        //     $app = 'romanbelize_visits';
        // else if ($group_id == 10) //is for legends wallpapers app
        //     $app = 'legends_visits';
        //  else if ($group_id == 11) //is for wolves wallpapers app
        //     $app = 'wolves_visits';
        // else if ($group_id == 12) //is for everton wallpapers app
        //     $app = 'everton_visits';
        // else if ($group_id == 13) //is for manchester wallpapers app
        //     $app = 'manchester_visits';
        // else if ($group_id == 14)
        //     $app = 'car_visits';
        //  else if ($group_id == 15)
        //     $app = 'motor_visits';
        //  else if ($group_id == 16)
        //     $app = 'animal_visits';
        //  else if ($group_id == 17)
        //     $app = 'film_visits';
        //  else if ($group_id == 18)
        //     $app = 'animation_visits';
        //  else if ($group_id == 19)
        //     $app = 'football_visits';
        // else if ($group_id == 20)
        //     $app = 'atelier-demo_visits';


        // Setting::where('key', $app)->increment('value', 1);

        return Doc::where('group_id', $group_id)->inRandomOrder()->/*orderBy('id', 'DESC')->*/
        paginate($paginate, ['*'], 'page', $page);
    }

    public function groups(Request $request)
    {
//        $query = Report::query();
        return Group::orderby('id', 'DESC')->get();
    }

    public function delete(Request $request)
    {
        DB::transaction(function () use ($request) {
            Doc::destroy($request->id);
            Storage::disk('public')->delete($request->group_id . DIRECTORY_SEPARATOR . $request->path);
            Storage::disk('public')->delete($request->group_id . DIRECTORY_SEPARATOR . 'thumb-' . $request->path);

            $app = 'fashion_images';
            if ($request->group_id >= 1 && $request->group_id <= 4) //is for fashion wallpapers app
                $app = 'fashion_images';
            else if ($request->group_id == 5 || $request->group_id == 7) //is for esteghlal app
                $app = 'esteghlal_images';
            else if ($request->group_id == 6 || $request->group_id = 8) //is for perspolis wallpapers app
                $app = 'perspolis_images';
            else if ($request->group_id == 9) //is for roman wallpapers app
                $app = 'romanbelize_images';
            else if ($request->group_id == 10) //is for roman wallpapers app
                $app = 'legends_images';
            else if ($request->group_id == 11) //is for roman wallpapers app
                $app = 'wolves_images';
            else if ($request->group_id == 12) //is for roman wallpapers app
                $app = 'everton_images';
            else if ($request->group_id == 13) //is for roman wallpapers app
                $app = 'manchester_images';
            else if ($request->group_id == 14)
                $app = 'car_images';
            else if ($request->group_id == 15)
                $app = 'motor_images';
            else if ($request->group_id == 16)
                $app = 'animal_images';
            else if ($request->group_id == 17)
                $app = 'film_images';
            else if ($request->group_id == 18)
                $app = 'animation_images';
            else if ($request->group_id == 19)
                $app = 'football_images';
            else if ($request->group_id == 20)
                $app = 'atelier-demo_images';
            else if ($request->group_id == 21)
                $app = 'game_images';
            else if ($request->group_id == 22)
                $app = 'psg_images';
            else if ($request->group_id == 23)
                $app = 'milan_images';
            else if ($request->group_id == 24)
                $app = 'bayern_images';
            else if ($request->group_id == 25)
                $app = 'tottenham_images';
            else if ($request->group_id == 26)
                $app = 'chelsea_images';
            else if ($request->group_id == 27)
                $app = 'city_images';
            else if ($request->group_id == 28)
                $app = 'arsenal_images';
            else if ($request->group_id == 29)
                $app = 'liverpool_images';
            else if ($request->group_id == 30)
                $app = 'premiere_images';
            else if ($request->group_id == 31)
                $app = 'barca_images';
            else if ($request->group_id == 32)
                $app = 'real_images';
            else if ($request->group_id == 33)
                $app = 'lester_images';

            Setting::where('key', $app)->decrement('value', 1);

//            return 200;
        });
        return $this->search($request);

    }

    public function create(Request $request)
    {
        $request->validate([
            'group_id' => 'required|numeric',
            'link' => 'required|string',
//            'doc' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:4096'
            'doc' => 'required|base64_image|base64_size:10240'
        ]);

        DB::transaction(function () use ($request) {


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

            $doc = Doc::create(['group_id' => $request->group_id, 'path' => '', 'size' => $size, 'link' => $request->link]);
            $filenameToStore = 'fashion-' . $doc->id . '.' . $image_type_aux[1];
            $filenameToStore = 'fashion-' . $doc->id . '.jpg';
            $doc->path = $filenameToStore;
            $doc->save();
            $visibility = 'public';
            Storage::disk('public')->put($request->group_id . DIRECTORY_SEPARATOR . $filenameToStore, $image_base64, $visibility);


            $photo = imagecreatefromstring($image_base64);
            $imageSave = imagejpeg($photo, $filenameToStore, 100);
            imagedestroy($photo);
            File::delete(public_path() . DIRECTORY_SEPARATOR . $filenameToStore);

            createThumbnail(public_path('storage') . DIRECTORY_SEPARATOR . $request->group_id . DIRECTORY_SEPARATOR . $filenameToStore,
                public_path('storage') . DIRECTORY_SEPARATOR . $request->group_id . DIRECTORY_SEPARATOR . 'thumb-' . $filenameToStore);
            $app = 'fashion_';
            if ($request->group_id >= 1 && $request->group_id <= 4) //is for fashion wallpapers app
                $app = 'fashion_';
            else if ($request->group_id == 5 || $request->group_id == 7) //is for esteghlal app
                $app = 'esteghlal_';
            else if ($request->group_id == 6 || $request->group_id == 8) //is for perspolis wallpapers app
                $app = 'perspolis_';
            else if ($request->group_id == 9) //is for roman wallpapers app
                $app = 'romanbelize_';
            else if ($request->group_id == 10) //is for roman wallpapers app
                $app = 'legends_';
            else if ($request->group_id == 11) //is for roman wallpapers app
                $app = 'wolves_';
            else if ($request->group_id == 12) //is for roman wallpapers app
                $app = 'everton_';
            else if ($request->group_id == 13) //is for roman wallpapers app
                $app = 'manchester_';
            else if ($request->group_id == 14)
                $app = 'car_';
            else if ($request->group_id == 15)
                $app = 'motor_';
            else if ($request->group_id == 16)
                $app = 'animal_';
            else if ($request->group_id == 17)
                $app = 'film_';
            else if ($request->group_id == 18)
                $app = 'animation_';
            else if ($request->group_id == 19)
                $app = 'football_';
            else if ($request->group_id == 20)
                $app = 'atelier-demo_';
            else if ($request->group_id == 21)
                $app = 'game_';
            else if ($request->group_id == 22)
                $app = 'psg_';
            else if ($request->group_id == 23)
                $app = 'milan_';
            else if ($request->group_id == 24)
                $app = 'bayern_';
            else if ($request->group_id == 25)
                $app = 'tottenham_';
            else if ($request->group_id == 26)
                $app = 'chelsea_';
            else if ($request->group_id == 27)
                $app = 'city_images';
            else if ($request->group_id == 28)
                $app = 'arsenal_';
            else if ($request->group_id == 29)
                $app = 'liverpool_';
            else if ($request->group_id == 30)
                $app = 'premiere_';
            else if ($request->group_id == 31)
                $app = 'barca_';
            else if ($request->group_id == 32)
                $app = 'real_';
            else if ($request->group_id == 33)
                $app = 'lester_';
            Group::where('id', $request->group_id)->increment('num', 1);
            Setting::where('key', $app . 'images')->increment('value', 1);

        });

        $name = Group::where('id', $request->group_id)->first()->name;

        $username = auth()->user()->telegram_username;
        foreach (Helper::$logs as $log)
            Helper::sendMessage($log, "$username" . " یک بکگراند $name اضافه کرد ", null, null, null);


        return 200;
//        return abort(500, 'error in creating doc!');
    }

//    public function fileStorageServe($file)
//    {
//        // know you can have a mapping so you dont keep the sme names as in local (you can not precsise the same structor as the storage, you can do anything)
//
//        // any permission handling or anything else
//
//        // we check for the existing of the file
//        if (!Storage::disk('local')->exists($filePath)) { // note that disk()->exists() expect a relative path, from your disk root path. so in our example we pass directly the path (/.../laravelProject/storage/app) is the default one (referenced with the helper storage_path('app')
//            abort('404'); // we redirect to 404 page if it doesn't exist
//        }
//        //file exist let serve it
//
//// if there is parameters [you can change the files, depending on them. ex serving different content to different regions, or to mobile and desktop ...etc] // repetitive things can be handled through helpers [make helpers]
//
//        return response()->file(storage_path('app' . DIRECTORY_SEPARATOR . ($filePath))); // the response()->file() will add the necessary headers in our place (no headers are needed to be provided for images (it's done automatically) expected hearder is of form => ['Content-Type' => 'image/png'];
//
//// big note here don't use Storage::url() // it's not working correctly.
//    }

//    public function getCompaniesLogo($file)
//    {
//        // know you can have a mapping so you dont keep the sme names as in local (you can not precsise the same structor as the storage, you can do anything)
//
//        // any permission handling or anything else
//
//        $filePath = config('fs.gallery') . DIRECTORY_SEPARATOR . $file; // here in place of just using 'gallery', i'm setting it in a config file
//
//        // here i'm getting only the path from the root  (this way we can change the root later) / also we can change the structor on the store itself, change in one place config.fs.
//
//        // $filePath = Storage::url($file); <== this doesn't work don't use
//
//        // check for existance
//        if (!Storage::disk('local')->exists($file)) { // as mentionned precise relatively to storage disk root (this one work well not like Storage:url()
//            abort('404');
//        }
//
//        // if there is parameters [you can change the files, depending on them. ex serving different content to different regions, or to mobile and desktop ...etc] // repetitive things can be handled through helpers [make helpers]
//
//        return response()->file(storage_path('app' . DIRECTORY_SEPARATOR . ($file))); // the response()->file() will add the necessary headers in our place
//    }
}
