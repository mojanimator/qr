<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'roles';
    protected $fillable = ['user_id', 'permissions', 'hooze_ids'];

    public function user()
    {
//        return $this->belongsTo(User::class, 'user_id'); //if function name was not user
        return $this->belongsTo(User::class);
    }

    protected $casts = [
        'permissions' => 'array',
        'hooze_ids' => 'array',
    ];
}
