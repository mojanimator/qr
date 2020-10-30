<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Info extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'name', 'app_id', 'value',


    ];
    protected $table = 'infos';

    protected $casts = [


    ];
}
