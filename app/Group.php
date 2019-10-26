<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Group extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $fillable = ['name', 'img', 'created_at', 'updated_at'];

    protected $table = 'groups';

    protected $casts = [
        'name' => 'array',
    ];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }


}
