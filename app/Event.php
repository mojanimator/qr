<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    public $timestamps = false;
    protected $table = 'events';
    protected $fillable = [
        'id', 'type', 'start_time', 'app_id', 'message'
    ];

    protected $casts = [
        'start_time' => 'timestamp'

    ];
}
