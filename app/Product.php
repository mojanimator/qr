<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'id', 'info', 'type', 'user_id', 'name', 'telegram_id', 'step', 'phone', 'amount', 'order_id', 'pay_id', 'created_at'

    ];
    protected $casts = [
        'created_at' => 'timestamp',

    ];
}
