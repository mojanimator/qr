<?php

namespace App\Http\Controllers;

use App\Doc;
use App\Hooze;
use App\Http\Requests\HoozeRequest;
use App\Http\Requests\SchoolRequest;
use App\Koochro;
use App\Report;
use App\Saabet;
use App\School;
use Carbon\Carbon;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;


class HoozeController extends Controller
{
    public function hoozes()
    {
        return Hooze::all();
    }

    public function dropdown(Request $request)
    {
        $hooze_namayandegi_id = $request->hooze_namayandegi_id;
        $command = $request->command;
        $name = $request->name;

        if (!$name)
            return ['data' => School::get(['id', 'name'])];
        if ($command == 'get')
            if ($hooze_namayandegi_id)
                return ['data' => School::get(['id', 'name'])->whereIn('hooze_namayandegi_id', $hooze_namayandegi_id)];
            else return ['data' => School::get(['id', 'name'])];
        else
            if ($command == 'add')
                if ($hooze_namayandegi_id)
                    if (School:: where('name', $name)->whereIn('hooze_namayandegi_id', $hooze_namayandegi_id)->exists()) {
                        return ['data' => School::get(['id', 'name'])->whereIn('hooze_namayandegi_id', $hooze_namayandegi_id),
                            'message' => 'نام مدرسه تکراری است', 'type' => 'error'];
                    } else {
                        $school = new School();
                        $school->name = $name;
                        $school->save();
                        return ['data' => School::get(['id', 'name'])->whereIn('hooze_namayandegi_id', $hooze_namayandegi_id),
                            'message' => 'مدرسه با موفقیت اضافه شد!', 'type' => 'success'
                        ];
                    }
                else {
                    if (School:: where('name', $name)->exists()) {
                        return ['data' => School::get(['id', 'name']),
                            'message' => 'نام مدرسه تکراری است', 'type' => 'error'];
                    } else {
                        $school = new School();
                        $school->name = $name;
                        $school->save();
                        return ['data' => School::get(['id', 'name']),
                            'message' => 'مدرسه با موفقیت اضافه شد!', 'type' => 'success'
                        ];
                    }
                }
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function all(Request $request)
    {
        $paginate = $request->paginate;
        $page = $request->page;
        if (!$paginate) {
            $paginate = 24;
        }
        if (!$page) {
            $page = 1;
        }
        return School::with('hooze')->with('schoolable')->paginate($paginate, ['*'], 'page', $page);
    }

    public function search(Request $request)
    {
        $hooze_user_access = auth()->user() ? auth()->user()->role()->first()->hooze_ids : [];
        if (count($hooze_user_access) == 0) //user not hooze access
            return [];

        $request->validate([
            'name' => 'nullable|max:100',
            'paginate' => 'nullable|numeric|max:1000000000',
            'page' => 'nullable|numeric|max:1000000000',
            'for' => 'sometimes|string|in:dropdown',
        ], [
            'name.max' => 'حداکثر طول نام 100 کاراکتر است',
            'paginate.numeric' => 'صفحه بندی نامعتبر است.',
            'paginate.max' => 'صفحه بندی نامعتبر است.',
            'page.numeric' => 'صفحه  نامعتبر است.',
            'page.max' => 'صفحه  نامعتبر است.',
            'for.string' => 'نوع درخواست حوزه نامعتبر است',
            'for.in' => 'نوع درخواست حوزه نامعتبر است',
        ]);
        $query = Hooze::query();
        if ($hooze_user_access[0] != 'all')
            $query = $query->whereIn('id', $hooze_user_access);

        if ($request->for && $request->for == 'dropdown') //is for dropdown not need paginate
            return $query->with('parent')->get();

        $name = $request->name;
        $paginate = $request->paginate;
        $page = $request->page;
        $sortBy = $request->sortBy;
        $direction = $request->direction;


        if (!$paginate) {
            $paginate = 24;
        }
        if (!$page) {
            $page = 1;
        }


        if ($name != '')
            $query = $query->where('name', 'like', '%' . $name . '%');


        if ($sortBy && $direction)
            $query = $query->orderBy($sortBy, $direction);

        return $query->with('parent')->paginate($paginate, ['*'], 'page', $page);

    }

    public function view()
    {
        return view('hooze.hoozes');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(HoozeRequest $request)
    {

        DB::transaction(function () use ($request) {
            $date = Carbon::now();


            $hooze = Hooze::create([
                'name' => $request->name,
                'parent_id' => $request->parent_id,
                'created_at' => $date,
                'updated_at' => $date,

            ]);

            $hooze_ids = auth()->user()->role()->first()->hooze_ids;

            if (count($hooze_ids) == 0 || (count($hooze_ids) > 0 && $hooze_ids[0] != 'all'))
                auth()->user()->role()->first()->update(['hooze_ids' => array_merge($hooze_ids, [$hooze->id])]);

            Report::create(['name_family' => auth()->user()->name . ' ' . auth()->user()->family,
                'action_target' => 'c~h~' . $request->name,
                'created_at' => Carbon::now()
            ]);

            return "200";
        });

        return "500";
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
     * @param  \App\Madrese $madrese
     * @return \Illuminate\Http\Response
     */
    public function show(School $school)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Madrese $madrese
     * @return \Illuminate\Http\Response
     */
    public function update(HoozeRequest $request)
    {
//        if (!Gate::allows('isSuperuser')) {
//        if (Gate::denies('isSuperuser')) {
//            abort(404, ' مجوز دسترسی ندارید!');
//        }
        DB::transaction(function () use ($request) {


            $hooze = Hooze::find($request->id);

            $hooze->name = $request->name;
            $hooze->updated_at = Carbon::now();
            $hooze->parent_id = $request->parent_id;
            $hooze->save();

            Report::create(['name_family' => auth()->user()->name . ' ' . auth()->user()->family,
                'action_target' => 'e~h~' . $request->name,
                'created_at' => Carbon::now()
            ]);
            return 200;
        });


    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Madrese $madrese
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {


        $request->validate([
            'id' => 'required|numeric|min:1|max:4294967295',

        ], [
            'id.required' => 'شماره حوزه نامعتبر است',
            'id.numeric' => 'شماره حوزه نامعتبر است',
            'id.min' => 'شماره حوزه نامعتبر است',
            'id.max' => 'شماره حوزه نامعتبر است',

        ]);

        DB::transaction(function () use ($request) {
            Schema::disableForeignKeyConstraints();

            Hooze::destroy($request->id);
            Schema::enableForeignKeyConstraints();

            return "200";
        });
        return null;
    }
}
