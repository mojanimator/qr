<?php

namespace App\Http\Controllers;

use App\Info;
use App\Quiz;
use App\Response;
use App\User;
use Carbon\Carbon;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;


class QuizAPIController extends Controller
{
    private $user;

    public function __construct()
    {
        date_default_timezone_set('Asia/Tehran');
//        $this->user = auth()->user();
//        $this->user_id = $this->user ? $this->user->id : null;
//        $this->middleware('auth')->except([]);
    }

    public function getStatistics(Request $request)
    {


        if ($request->app_id == '1' || $request->app_id == '2') {
            $infos = Info::orwhere('app_id', '1')->orWhere('app_id', '2')->get();

            foreach ($infos as $info) {
                if ($info['app_id'] == 1 && $info['name'] == 'responses')
                    $resp1 = $info['value'];
                else if ($info['app_id'] == 1 && $info['name'] == 'trues')
                    $true1 = $info['value'];
                else if ($info['app_id'] == 2 && $info['name'] == 'responses')
                    $resp2 = $info['value'];
                else if ($info['app_id'] == 2 && $info['name'] == 'trues')
                    $true2 = $info['value'];
            }
            return ['r1' => (int)$resp1, 't1' => (int)$true1, 'r2' => (int)$resp2, 't2' => (int)$true2];

        }
    }

    public function updateScore(Request $request)
    {
        $this->user = auth()->user();

        $score = $request->score + $this->user->score;

        if ($score < 0)
            return ['res' => false];

        else {
            $this->user->score = $score;
            $this->user->save();
        }
        return ['res' => true, 'score' => (string)$score, 'responded' => $this->user->responded, 'trues' => $this->user->trues,];
    }

    public function get(Request $request)
    {


        $paginate = $request->paginate ?? 12;
//        $app_ids = explode('$', $request->app_id); //TODO:for future
        $page = $request->page ?? 1;
        $sortBy = $request->sortBy ?? 'id';
        $direction = $request->direction ?? 'DESC';
        $now = Carbon::now();
        $query = Quiz::query();

        $query = $query
            ->where(function ($query) use ($now) {
                $query->where('shows_at', '<', $now)
                    ->orWhereNull('shows_at');
            }
            )->where(function ($query) use ($now) {
                $query->where('expires_at', '>', $now)
                    ->orWhereNull('expires_at');
            }

            );
        /*->whereIn('app_id', $app_ids) for future*/
        $query = $query->select('id', 'score', 'type_id', 'is_predict', 'responded', 'trues', 'expires_at')
            ->orderBy($sortBy, $direction)
            ->paginate($paginate, ['*'], 'page', $page);
        return $query;
    }

    public function search(Request $request)
    {


        $paginate = $request->paginate ?? 12;
        $app_id = $request->app_id;
        $page = $request->page ?? 1;
        $sortBy = $request->sortBy ?? 'id';
        $direction = $request->direction ?? 'DESC';
        $now = Carbon::now();
        $query = Quiz::query();


        $query = $query
            ->where(function ($query) use ($now) {
                $query->where('shows_at', '<', $now)
                    ->orWhereNull('shows_at');
            }
            )->where(function ($query) use ($now) {
                $query->where('expires_at', '>', $now)
                    ->orWhereNull('expires_at');
            }

            );
        if (auth()->user())
            $query = $query->whereIntegerNotInRaw('id', Response::where('user_id', auth()->user()->id)->pluck('quiz_id'));
        if ($app_id == 1 || $app_id == 2)
            $query = $query->whereIn('app_id', [1, 2]);
        else
            $query = $query->whereNotIn('app_id', [1, 2]);

        $query = $query->select('id', 'score', 'type_id', 'is_predict', 'responded', 'trues', 'expires_at')
            ->orderBy($sortBy, $direction)
            ->paginate($paginate, ['*'], 'page', $page);
        return $query;
    }

    public function getForResponding(Request $request)
    {
        $this->user = auth()->user();

        $quiz = Quiz::where('id', $request->id)->select('id', 'question', 'options', 'is_predict', 'response', 'score')->first();
        if ($quiz) {
            $response = Response::create(['user_id' => $this->user->id, 'quiz_id' => $quiz->id]);
            return ['quiz' => $quiz, 'response_id' => $response->id];
        }
        return null;
    }

    public function getRecords(Request $request)
    {
//        if ($request->app_id == 1 || $request->app_id == 2)
        return User::/*whereIn('app_id', [1, 2])->*/
        orderBy('score', 'DESC')->take(10)->select(['username', 'app_id', 'score'])->get();


    }

    public function getResponse(Request $request)
    {
        $this->user = auth()->user();
        $username = $this->user->telegram_username;


        $quiz = Quiz::find($request->id);

        if ($quiz && $quiz->is_predict) {
            Response::where('id', $request->response_id)->update(['response' => $request->response]);
            foreach (Helper::$logs as $log)
                Helper::sendMessage($log, "کاربر $username به یک پیش بینی جواب داد ", null, null, null);


            return ['res' => 'P', 'score' => $this->user->score];

        } else if ($quiz && !$quiz->is_predict) {
            $is_true = false;
            $icon = "❌";
            if ($quiz->response == $request->response) {
                $icon = "✅";
                $quiz->trues = $quiz->trues + 1;
                $this->user->trues = $this->user->trues + 1;
                $is_true = true;
                Info::where('app_id', $this->user->app_id)->where('name', 'trues')->increment('value');
                $this->user->score = $quiz->score + $this->user->score;
            }

            Response::where('id', $request->response_id)
                ->update(['response' => $request->response, 'is_true' => $is_true]);

            $quiz->responded = $quiz->responded + 1;
            $this->user->responded = $this->user->responded + 1;

            Info::where('app_id', $this->user->app_id)->where('name', 'responses')->increment('value');

            $quiz->save();
            $this->user->save();

            foreach (Helper::$logs as $log)
                Helper::sendMessage($log, "کاربر $username به یک سوال جواب داد " . "$icon", null, null, null);


            return ['res' => $is_true, 'score' => $this->user->score, 'responded' => $this->user->responded, 'trues' => $this->user->trues,];
        }


        return ['res' => null];

    }

}
