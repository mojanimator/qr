<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'group_id', 'path', 'size', 'link', 'star'
    ];
    protected $table = 'profiles';
}
