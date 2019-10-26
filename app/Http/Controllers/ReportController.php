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
use Morilog\Jalali\CalendarUtils;


class ReportController extends Controller
{
    public function reports()
    {
        return Report::all();
    }

    public function view()
    {

        return view('user.reports');
    }

    public function search(Request $request)
    {


        $request->validate([
            'name' => 'nullable|max:50',
            'paginate' => 'nullable|numeric|max:1000000000',
            'page' => 'nullable|numeric|max:1000000000',
            'filters' => 'nullable|array',
            'filters.*' => 'string',
        ], [
            'name.max' => 'حداکثر طول نام 50 کاراکتر است',
            'paginate.numeric' => 'صفحه بندی نامعتبر است.',
            'paginate.max' => 'صفحه بندی نامعتبر است.',
            'page.numeric' => 'صفحه  نامعتبر است.',
            'page.max' => 'صفحه  نامعتبر است.',
            'filters.array' => 'فیلتر نامعتبر است',
            'filters.*.string' => 'فیلتر نامعتبر است',

        ]);

        $query = Report::query();


        $name = $request->name;
        $filters = $request->filters;
        $paginate = $request->paginate;
        $page = $request->page;
        $sortBy = $request->sortBy;
        $direction = $request->direction;

        $date1 = $request->date1 ? CalendarUtils::createCarbonFromFormat('Y/m/d', $request->date1)->timezone('Asia/Tehran') : '';
        $date2 = $request->date2 ? CalendarUtils::createCarbonFromFormat('Y/m/d', $request->date2)->timezone('Asia/Tehran') : '';

        if (!$paginate) {
            $paginate = 24;
        }
        if (!$page) {
            $page = 1;
        }


        foreach ($filters as $filter) {
            $query->orWhere('action_target', 'LIKE', '%' . $filter . '%');
        }
        if ($name != '')
            $query = $query->where('name_family', 'like', '%' . $name . '%');
//        return ($date1);
        if ($date1)
            $query = $query->where('created_at', '>=', $date1);
        if ($date2)
            $query = $query->where('created_at', '<=', $date2);

        if ($sortBy && $direction)
            $query = $query->orderBy($sortBy, $direction);

        return $query->paginate($paginate, ['*'], 'page', $page);

    }


}
