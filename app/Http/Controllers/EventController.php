<?php

namespace App\Http\Controllers;

use App\Event;
use Carbon\Carbon;
use Carbon\CarbonTimeZone;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Morilog\Jalali\Jalalian;

class EventController extends Controller
{

    public function create(Request $request)
    {
        $type = $request->type;
        $time = $request->time;
        $app_id = $request->app_id;
        $message = $request->message;

        if (!$app_id || $app_id < 1)
            return abort(201, 'APP_ID_ERROR');

        if ($type == 1 && $message && count(explode('$', $message)) != 2)
            return abort(201, "TEAMS_ERROR");

        //create timestamp from shamso or miladi
        $tmp = explode('$', $time);
        if ($time && count($tmp) != 5)
            return abort(201, "TIME_ERROR");

        if (!str_starts_with($tmp[0], '20'))
            $t = Jalalian::fromFormat('Y$m$d$H$i', $time, new \DateTimeZone('Asia/Tehran'))->toCarbon()->setTimezone('utc');
        else $t = Carbon::createFromFormat('Y$m$d$H$i', $time, 'UTC')->toDateTime();
        Event::create(['type' => $type, 'start_time' => $t, 'app_id' => $app_id, 'message' => $message]);

        $txt = (" " . auth()->user()->telegram_username . " ");
        $txt .= "یک رویداد اضافه کرد";
        $txt .= (PHP_EOL . $message . PHP_EOL);
        $txt .= (PHP_EOL . ($app_id == 1 || $app_id == 2) ? Jalalian::fromFormat('Y$m$d$H$i', $time, new \DateTimeZone('Asia/Tehran'))->toString() : $time->format('d/F/Y H:i'));
        foreach (Helper::$logs as $log)
            Helper::sendMessage($log, $txt, null, null, null);
    }

    public function search(Request $request)
    {


        $paginate = $request->paginate ?? 24;
        $page = $request->page ?? 1;
        $sortBy = $request->sortBy ?? 'id';
        $direction = $request->direction ?? 'DESC';
        $query = Event::query();


//        if ($name)
//            $query = $query->where('name', 'like', $name . '%');

        return $query/*->with('responses')*/
        ->orderBy($sortBy, $direction)->paginate($paginate, ['*'], 'page', $page);
    }

    public function delete(Request $request)
    {
        if (auth()->user()->role != 'Admin') return abort(404);


        $event = Event::where('id', $request->id)->first();
        $event->delete();
        Session::flash('message', 'باموفقیت حذف شد');
        Session::flash('alert-class', 'alert-danger');

        $this->user = auth()->user();

        $username = $this->user->telegram_username;
        foreach (Helper::$logs as $log)
            Helper::sendMessage($log, 'کاربر ' . "@$username" . " یک رویداد پاک کرد " . PHP_EOL . $event->message, null, null, null);

    }
}
