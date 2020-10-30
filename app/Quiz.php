<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Quiz extends Model
{

    public $timestamps = false;
    protected $fillable = [
        'id', 'type_id', 'app_id', 'question', 'response', 'options', 'is_predict', 'shows_at', 'expires_at',
        'created_at', 'score', 'responded', 'trues'


    ];
    protected $table = 'quizzes';

    protected $casts = [
        'options' => 'array',

    ];

    public function responses()
    {
        return $this->hasMany(Response::class, 'quiz_id')
            ->select('quiz_id', DB::raw('round(avg(is_true),2)*100 as avg'),
                DB::raw('round(count(*)) as count'))
            ->groupBy('quiz_id');
    }


    public function getCreatedAtAttribute($value)
    {
        if (!$value) return $value;
        return \Morilog\Jalali\CalendarUtils::strftime('Y/m/d | H:i', strtotime($value));
    }

//    public function getShowsAtAttribute($value)
//    {
//        if (!$value) return $value;
//        return \Morilog\Jalali\CalendarUtils::strftime('Y/m/d | H:i', strtotime($value));
//    }
//
//    public function getExpiresAtAttribute($value)
//    {
//        if (!$value) return $value;
//        return \Morilog\Jalali\CalendarUtils::strftime('Y/m/d | H:i', strtotime($value));
//    }

//    public function getTypeIdAttribute($value)
//    {
//        if (!$value) return $value;
//        return getGameTypes()[$value]['name'];
//    }
//
//    public function getAppIdAttribute($value)
//    {
//        if (!$value) return $value;
//        return getApps()[$value]['name'];
//    }
}
