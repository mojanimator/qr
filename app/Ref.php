<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ref extends Model
{
//    public $timestamps = false;

    protected $fillable = [
        'title', 'user_id', 'username', 'app_id', 'type_id', 'is_vip',
        'main_color', 'start_time', 'expire_time'

    ];
}
