<?php

namespace App\Http\Controllers;

use App\Info;
use App\Quiz;
use App\User;
use Carbon\Carbon;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;


class QuizController extends Controller
{
    private $user;

    public function __construct()
    {
//        date_default_timezone_set('Asia/Tehran');

        $this->middleware('auth')->except([]);

    }


    public function delete(Request $request)
    {
        if (auth()->user()->role != 'Admin') return abort(404);

        Storage::disk('public')->delete('quiz' . DIRECTORY_SEPARATOR . 'quiz-' . $request->id . '.jpg');

        $quiz = Quiz::where('id', $request->id)->first();

        Info::where('app_id', $quiz->app_id)->where('name', 'questions')->decrement('value');
        $quiz->delete();
        Session::flash('message', 'باموفقیت حذف شد');
        Session::flash('alert-class', 'alert-danger');

        $this->user = auth()->user();

        $username = $this->user->telegram_username;
        foreach (Helper::$logs as $log)
            Helper::sendMessage($log, "$username" . " یک سوال پاک کرد ", null, null, null);

    }

    public function search(Request $request)
    {


        $paginate = $request->paginate ?? 24;
        $page = $request->page ?? 1;
        $sortBy = $request->sortBy ?? 'id';
        $direction = $request->direction ?? 'DESC';
        $query = Quiz::query();


//        if ($name)
//            $query = $query->where('name', 'like', $name . '%');

        return $query/*->with('responses')*/
        ->orderBy($sortBy, $direction)->paginate($paginate, ['*'], 'page', $page);
    }

    public function getForUpdate(Request $request)
    {
        if (auth()->user()->role != 'Admin') return abort(404);

        $quiz = Quiz::find($request->id);
        $quiz->expires_after_hours = round((Carbon::parse($quiz->expires_at)->getTimestamp() - Carbon::now()->getTimestamp()) / 3600);
        $quiz->shows_after_hours = round((Carbon::parse($quiz->shows_at)->getTimestamp() - Carbon::now()->getTimestamp()) / 3600);

        foreach (getGameTypes() as $item) {
            if ($quiz->type_id == $item['id']) {
                $quiz->type_id = ['id' => $item['id'], 'name' => $item['name']];
                break;
            }

        }
        foreach (getApps() as $item) {
            if ($quiz->app_id == $item['id']) {
                $quiz->app_id = ['id' => $item['id'], 'name' => $item['name']];
                break;
            }

        }
        return $quiz;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        if (auth()->user()->role != 'Admin') return abort(404);


//        $request->validate([
//            'group_id' => 'required|numeric',
//            'link' => 'required|string',
////            'doc' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:4096'
//            'doc' => 'nullable|base64_image|base64_size:10240'
//        ]);

        DB::transaction(function () use ($request) {

            $img = $request->img;
            $question = $request->question;
            $score = $request->score;
            $is_predict = $request->is_predict;
            $response = $request->response;
            $type_id = $request->type_id;
            $app_id = $request->app_id;
            $options = $request->options;
            $expires_at = $request->expires_after_hours == "0" ? null : Carbon::now()->addHours($request->expires_after_hours);
            $shows_at = $request->shows_after_hours == "0" ? null : Carbon::now()->addHours($request->shows_after_hours);


            if ($img == null) {
                $quiz = Quiz::create(['question' => $question, 'is_predict' => $is_predict, 'score' => $score,
                    'response' => $response, 'type_id' => $type_id, 'app_id' => $app_id,
                    'options' => $options, 'expires_at' => $expires_at, 'shows_at' => $shows_at, 'created_at' => Carbon::now(),]);
            } else {

                $image_parts = explode(";base64,", $img);
                $image_type_aux = explode("image/", $image_parts[0]);
                $image_base64 = base64_decode($image_parts[1]);
//                $size = strlen($image_base64) / 1024; //kb

                $quiz = Quiz::create(['question' => '_', 'is_predict' => $is_predict,
                    'response' => $response, 'type_id' => $type_id, 'app_id' => $app_id, 'score' => $score,
                    'options' => $options, 'expires_at' => $expires_at, 'shows_at' => $shows_at, 'created_at' => Carbon::now(),]);
                $filenameToStore = 'quiz-' . $quiz->id . '.' . $image_type_aux[1];
                $filenameToStore = 'quiz-' . $quiz->id . '.jpg';
                $quiz->question =/* $question . ',' . */
                    $filenameToStore;
                $quiz->save();
                $visibility = 'public';
                Storage::disk('public')->put('quiz' . DIRECTORY_SEPARATOR . $filenameToStore, $image_base64, $visibility);


                $photo = imagecreatefromstring($image_base64);
                $imageSave = imagejpeg($photo, $filenameToStore, 100);
                imagedestroy($photo);
                File::delete(public_path() . DIRECTORY_SEPARATOR . $filenameToStore);

//            createThumbnail(public_path('storage') . DIRECTORY_SEPARATOR . $request->group_id . DIRECTORY_SEPARATOR . $filenameToStore,
//                public_path('storage') . DIRECTORY_SEPARATOR . $request->group_id . DIRECTORY_SEPARATOR . 'thumb-' . $filenameToStore);
            }

            Info::where('app_id', $app_id)->where('name', 'questions')->increment('value');
            Session::flash('message', 'باموفقیت ساخته شد');
            Session::flash('alert-class', 'alert-success');

            $this->user = auth()->user();

            $username = $this->user->telegram_username;
            $q = substr($quiz->question, -4) === '.jpg' ? "https://qr-image-creator.com/wallpapers/storage/quiz/" . $quiz->question : $quiz->question;
            foreach (Helper::$logs as $log)
                Helper::sendMessage($log, " ادمین $username" . " یک سوال اضافه کرد " . PHP_EOL .
                    $q, null, null, null);

            if ($app_id == 1 || $app_id == 2)
                foreach (User::whereIn('app_id', [1, 2])->pluck('telegram_id') as $id)
                    Helper::sendMessage($id, \Lang::get($app_id, \Lang::NEW_QUIZ) . "\n$q", null, null, null);
            else
                foreach (User::whereNotIn('app_id', [1, 2])->pluck('telegram_id') as $id)
                    Helper::sendMessage($id, \Lang::get($app_id, \Lang::NEW_QUIZ) . "\n$q", null, null, null, true, 'en');


        });


        return response(200);


    }

    public function update(Request $request)
    {
        if (auth()->user()->role != 'Admin') return abort(404);

        DB::transaction(function () use ($request) {

            $id = $request->id;
            $img = $request->img;
            $score = $request->score;
            $question = $request->question;
            $is_predict = $request->is_predict;
            $response = $request->response;
            $type_id = $request->type_id;
            $app_id = $request->app_id;
            $options = $request->options;
            $expires_at = $request->expires_after_hours == "0" ? null : Carbon::now()->addHours($request->expires_after_hours);
            $shows_at = $request->shows_after_hours == "0" ? null : Carbon::now()->addHours($request->shows_after_hours);

            if ($img == null && $question != null) {
                $q = Quiz::find($id);
//                if (strpos($q->question, '.jpg') !== false)
                $q->update(['question' => $question, 'is_predict' => $is_predict,
                    'response' => $response, 'type_id' => $type_id, 'app_id' => $app_id,
                    'options' => $options,
                    'score' => $score,
                    'expires_at' => $expires_at,
                    'created_at' => Carbon::now(),
                    'shows_at' => $shows_at,
                ]);
            } else if ($img == null && $question == null) {
                $q = Quiz::find($id);
                $q->update(['is_predict' => $is_predict,
                    'response' => $response, 'type_id' => $type_id, 'app_id' => $app_id,
                    'options' => $options,
                    'score' => $score,
                    'expires_at' => $expires_at,
                    'created_at' => Carbon::now(),
                    'shows_at' => $shows_at,
                ]);

            } else {

                $image_parts = explode(";base64,", $img);
                $image_type_aux = explode("image/", $image_parts[0]);
                $image_base64 = base64_decode($image_parts[1]);
//                $size = strlen($image_base64) / 1024; //kb

                Quiz::find($id)->update(['is_predict' => $is_predict,
                    'response' => $response, 'type_id' => $type_id, 'app_id' => $app_id,
                    'options' => $options, 'score' => $score, 'expires_at' => $expires_at, 'shows_at' => $shows_at, 'created_at' => Carbon::now(),]);
                $filenameToStore = 'quiz-' . $id . '.' . $image_type_aux[1];
                $filenameToStore = 'quiz-' . $id . '.jpg';
//                $quiz->question = $filenameToStore;
//                $quiz->save();
                $visibility = 'public';
                Storage::disk('public')->put('quiz' . DIRECTORY_SEPARATOR . $filenameToStore, $image_base64, $visibility);


                $photo = imagecreatefromstring($image_base64);
                $imageSave = imagejpeg($photo, $filenameToStore, 100);
                imagedestroy($photo);
                File::delete(public_path() . DIRECTORY_SEPARATOR . $filenameToStore);

//            createThumbnail(public_path('storage') . DIRECTORY_SEPARATOR . $request->group_id . DIRECTORY_SEPARATOR . $filenameToStore,
//                public_path('storage') . DIRECTORY_SEPARATOR . $request->group_id . DIRECTORY_SEPARATOR . 'thumb-' . $filenameToStore);
            }

        });
        Session::flash('message', 'باموفقیت بروزرسانی شد');
        Session::flash('alert-class', 'alert-success');

        $this->user = auth()->user();

        $username = $this->user->telegram_username;
        foreach (Helper::$logs as $log)
            Helper::sendMessage($log, "$username" . " یک سوال ویرایش کرد ", null, null, null);


        return response(200);

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
     * @param  \App\Quiz $quiz
     * @return \Illuminate\Http\Response
     */
    public function show(Quiz $quiz)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Quiz $quiz
     * @return \Illuminate\Http\Response
     */
    public function edit(Quiz $quiz)
    {
        //
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Quiz $quiz
     * @return \Illuminate\Http\Response
     */
    public function destroy(Quiz $quiz)
    {
        //
    }
}
