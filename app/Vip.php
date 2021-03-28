<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Vip extends Model
{


    public $timestamps = false;
    protected $fillable = [
        'owner_id', 'file_id', 'type_id', 'created_at', 'app_id'
    ];
    protected $table = 'vips';
}
