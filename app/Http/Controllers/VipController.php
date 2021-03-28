<?php

namespace App\Http\Controllers;

use App\Doc;
use App\Vip;
use Helper;
use Illuminate\Http\Request;
use Spatie\Sitemap\Crawler\Profile;

class VipController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->except([]);
    }


    public function get(Request $request)
    {
        $address = base64_decode($request->address);
        $address = explode('$', $address);

        if (/*count($address) == 3 &&*/
            $address[0] == 'owned') {
            $type = $address[1];
            $id = $address[2];
            $app_id = count($address) > 3 ? $address[3] : null;
            if ($id == 0 && $type == 1) //return all owned image ids
                return response()->json(Doc::whereIn('id', Vip::where('owner_id', auth()->user()->id)->where('type_id', $type)->where('app_id', $app_id)->pluck('file_id'))->get(['id', 'group_id']));

            if ($id == 0 && $type == 2) //return all owned profile ids
                return response()->json(Profile::whereIn('id', Vip::where('owner_id', auth()->user()->id)->where('type_id', $type)->where('app_id', $app_id)->pluck('file_id'))->get(['id', 'group_id']));
        }
        if (count($address) == 3 && $address[0] == 'check') {
            $type = $address[1];
            $id = $address[2];
            return response()->json(Vip::where('owner_id', auth()->user()->id)->where('type_id', $type)->where('file_id', $id)->exists());
        }

        if (count($address) == 3) {
            $type = $address[0];
            $group_id = $address[1];
            $id = $address[2];
            $content = Vip::where('owner_id', auth()->user()->id)->where('type_id', $type)->where('file_id', $id)->first();
            if ($type == 1 && $content)
                return response()->file(storage_path("app/vip/$type/$group_id/fashion-$id.jpg"), ['Content-Type' => 'image/jpeg']);
            if ($type == 2 && $content)
                return response()->file(storage_path("app/vip/$type/$group_id/profile-$id.jpg"), ['Content-Type' => 'image/jpeg']);
            else  return response()->json('NOT_FOUND', 404);
        } else
            return response()->json('NOT_FOUND', 404);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function buy(Request $request)
    {
        $type = $request->type;
        $id = $request->id;
        $app_id = $request->app_id;
        $n = "fashion";
        if ($type == 1) {
            $doc = Doc::where('id', $id)->first();
            $n = 'fashion';
        }
        if ($type == 2) {
            $doc = Profile::where('id', $id)->first();
            $n = 'profile';
        }
        if (!$doc)
            return response()->json('NOT_FOUND', 404);
        $vip = Vip::where('owner_id', auth()->user()->id)->where('type_id', $type)->where('file_id', $id)->first();
        if ($vip)
            return response()->file(storage_path("app/vip/$type/$doc->group_id/$n-$id.jpg"), ['Content-Type' => 'image/jpeg']);

        if ($doc->star && $doc->star > auth()->user()->score)
            return response()->json('LOW_SCORE', 404);

        auth()->user()->score = auth()->user()->score - $doc->star;
        auth()->user()->save();
        $vip = Vip::create(['owner_id' => auth()->user()->id, 'type_id' => $type, 'file_id' => $id, 'app_id' => $app_id]);
        if ($type == 1)
            $link = "https://qr-image-creator.com/wallpapers/storage/$doc->group_id/thumb-$doc->path";
        if ($type == 2)
            $link = "https://qr-image-creator.com/wallpapers/storage/profiles/$doc->group_id/thumb-$doc->path";
        $username = auth()->user()->telegram_username ?? auth()->user()->username;
        foreach (Helper::$logs as $log)
            Helper::sendMessage($log, '✅ یک تصویر خریداری شد' . "\n" . "$link\nusername:$username\nstars:$doc->star", null, null, null);
        return response()->file(storage_path("app/vip/$type/$doc->group_id/fashion-$id.jpg"), ['Content-Type' => 'image/jpeg']);


    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public
    function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Vip $vip
     * @return \Illuminate\Http\Response
     */
    public
    function show(Vip $vip)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Vip $vip
     * @return \Illuminate\Http\Response
     */
    public
    function edit(Vip $vip)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Vip $vip
     * @return \Illuminate\Http\Response
     */
    public
    function update(Request $request, Vip $vip)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Vip $vip
     * @return \Illuminate\Http\Response
     */
    public
    function destroy(Vip $vip)
    {
        //
    }
}
