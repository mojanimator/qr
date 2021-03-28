<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'chat_username', 'follow_limit', 'day_limit', 'follow_now', 'follow_score', 'type', 'done', 'created_at'
    ];
    protected $table = 'orders';

}
