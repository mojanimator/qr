<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    public $timestamps = false;
    protected $table = 'reports';
    protected $fillable = [
        'name_family', 'action_target', 'created_at'
    ];

    public function getCreatedAtAttribute($value)
    {
        if (!$value) return $value;
        return \Morilog\Jalali\CalendarUtils::strftime('H:m | Y/m/d', strtotime($value));


    }

    public function target($type, $id)
    {
        switch ($type) {
            case 'u':
                return User::find($id);
                break;
            case 's':
                return School::find($id);
                break;
            case 'h':
                return Hooze::find($id);
                break;
            default:
                return null;
        }
    }
}
