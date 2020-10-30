<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Response extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'id', 'user_id', 'quiz_id', 'response', 'is_true', 'created_at'


    ];
    protected $table = 'responses';

    protected $casts = [


    ];
}
