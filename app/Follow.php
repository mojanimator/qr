<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
//    public $timestamps = false;
    protected $fillable = [
        'order_id', 'telegram_id', 'chat_username', 'left',

    ];
    protected $table = 'follows';

}
