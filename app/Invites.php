<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Invites extends Model
{
    public $timestamps = false;
    protected $table = 'invites';
    protected $fillable = [
        'new_telegram_id', 'invited_by'
    ];
}
