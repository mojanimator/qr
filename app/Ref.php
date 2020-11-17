<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ref extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'id', 'title', 'user_id', 'username', 'app_id', 'type_id', 'group_id',
        'is_vip',
        'main_color', 'start_time', 'expire_time'

    ];
    protected $casts = [
        // 'chat_id' => 'string',
        'expire_time' => 'timestamp',
        'start_time' => 'timestamp',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

//    public function getTypeIdAttribute($value)
//    {
//        if (!$value) return $value;
//        return \Helper::$refTypes[$value - 1]['name'];
//    }

//    public function getGroupIdAttribute($value)
//    {
//        if (!$value) return $value;
//        return \Helper::$refGroups[$value]['name'];
//    }

//    public function getAppIdAttribute($value)
//    {
//        if (!$value) return $value;
//        return getApps()[$value - 1]['name'];
//    }

//    public function getStartTimeAttribute($value)
//    {
//        if (!$value) return $value;
//        return \Morilog\Jalali\CalendarUtils::strftime('Y/m/d | H:i', strtotime($value));
//    }
//
//    public function getExpireTimeAttribute($value)
//    {
//        if (!$value) return $value;
//        return \Morilog\Jalali\CalendarUtils::strftime('Y/m/d | H:i', strtotime($value));
//    }
}
